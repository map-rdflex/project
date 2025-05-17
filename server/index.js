// Required imports
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import multer from 'multer';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,

}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Set up Sequelize with PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'shri_ayu_wellness',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,  // Isse SSL cert validation bypass hota hai, Render ke liye theek hai
    }
  }
});
// test

// Initialize Razorpay (Test mode)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

// Test DB Connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

// Define Models
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING
  },
  brand: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
});

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  paymentId: {
    type: DataTypes.STRING
  },
  shippingAddress: {
    type: DataTypes.JSON
  }
});

const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

// Define Relationships
// User Model
// models/User.js
User.hasMany(Order);
Order.belongsTo(User);

// models/Order.js
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

// models/Product.js
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);


// File upload configuration


const upload = multer({ storage });

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware for Admin Access
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isAdmin: email === 'admin@example.com' // Make the admin@example.com account an admin
    });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send response
    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send response
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'isAdmin']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const { brand, category, search } = req.query;
    let whereClause = {};

    if (brand) {
      whereClause.brand = brand;
    }

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause = {
        ...whereClause,
        [Sequelize.Op.or]: [
          { name: { [Sequelize.Op.iLike]: `%${search}%` } },
          { description: { [Sequelize.Op.iLike]: `%${search}%` } }
        ]
      };
    }

    const products = await Product.findAll({ where: whereClause });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/products', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, brand, category } = req.body;

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      brand,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/products/:id', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, brand, category, inStock } = req.body;

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product
    const updatedProduct = await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price ? parseFloat(price) : product.price,
      brand: brand || product.brand,
      category: category || product.category,
      inStock: inStock !== undefined ? inStock : product.inStock,
      image: req.file ? `/uploads/${req.file.filename}` : product.image
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/products/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Order Routes
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress, total } = req.body;

    // Create order 
    const order = await Order.create({
      UserId: req.user.id,
      total,
      shippingAddress
    });

    // Create order items
    for (const item of items) {
      await OrderItem.create({
        OrderId: order.id,
        ProductId: item.id,
        quantity: item.quantity,
        price: item.price
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: OrderItem,
          include: [Product]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Parse shippingAddress if stored as string
    const parsedOrders = orders.map(order => {
      let shippingAddress = order.shippingAddress;
      if (typeof shippingAddress === 'string') {
        shippingAddress = JSON.parse(shippingAddress);
      }
      return {
        ...order.toJSON(),
        shippingAddress
      };
    });

    res.json(parsedOrders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll();  // Assuming you're using Sequelize
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});


app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        User
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the user is authorized to view this order
    if (!req.user.isAdmin && order.UserId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/orders/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status });
    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Payment Routes
app.post('/api/payment/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: 'order_receipt_' + Date.now(),
      payment_capture: 1 // auto capture
    };

    razorpay.orders.create(options, function (err, order) {
      if (err) {
        console.error('Razorpay order creation error:', err);
        return res.status(500).json({ message: 'Error creating Razorpay order' });
      }
      res.json(order);
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/payment/verify', authenticateToken, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Here you would verify the signature with Razorpay
    // This is a simplified verification for demo purposes

    // Update the order with payment info
    const { orderId } = req.body;
    if (orderId) {
      const order = await Order.findByPk(orderId);
      if (order) {
        await order.update({
          paymentId: razorpay_payment_id,
          status: 'processing'
        });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmationMail = async (userEmail, orderDetails) => {
  const mailOptions = {
    from: `"Ayurvedic Store" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Order Confirmation',
    html: `
      <h3>Thank you for your order!</h3>
      <p>Your order for <strong>${orderDetails.product.name}</strong> (Qty: ${orderDetails.quantity}) has been received.</p>
      <p>Status: ${orderDetails.status}</p>
      <p>Total: ₹${orderDetails.product.price * orderDetails.quantity}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to', userEmail);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

// Route: Admin ko notify karna (order details email)
app.post('/api/notify/admin', async (req, res) => {
  const { shippingDetails, items, total } = req.body;

  const mailOptions = {
    from: `"Ayurvedic Store" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: 'New Order Notification',
    html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #007BFF;">New Order Received</h2>
      
      <h3>Shipping Details</h3>
      <p><strong>Name:</strong> ${shippingDetails.fullName || 'N/A'}</p>
      <p><strong>Address:</strong> ${shippingDetails.address || ''}, ${shippingDetails.city || ''}, ${shippingDetails.state || ''} - ${shippingDetails.postalCode || ''}</p>
      <p><strong>Phone:</strong> ${shippingDetails.phone || 'N/A'}</p>
      
      <h3>Ordered Items</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Quantity</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Price (₹)</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.quantity}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.price.toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <h3 style="text-align: right; margin-top: 20px;">
        Total Amount: <span style="color: #007BFF;">₹${total.toFixed(2)}</span>
      </h3>
    </div>
  `,
  };


  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Mail sent: ", info.response);

    // Optional: User ko bhi order confirmation bhejna
    if (shippingDetails.email && items.length > 0) {
      // For simplicity, send confirmation for first item only
      await sendOrderConfirmationMail(shippingDetails.email, {
        product: items[0].product || { name: 'Product', price: items[0].price || 0 },
        quantity: items[0].quantity || 1,
        status: 'Received',
      });
    }

    res.json({ message: 'Email sent to admin and user (if email present)' });
  } catch (error) {
    console.error("Mail send error: ", error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});
const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true
      });
      console.log('Admin user created successfully.');
    }

    // Add some sample products if none exist
    const productsCount = await Product.count();
    if (productsCount === 0) {
      const sampleProducts = [
        {
          name: 'Chyawanprash',
          description: 'A traditional Ayurvedic health supplement made from a concentrated blend of nutrient-rich herbs and minerals. Boosts immunity and strength.',
          price: 350,
          image: 'https://images.pexels.com/photos/6169859/pexels-photo-6169859.jpeg?auto=compress&cs=tinysrgb&w=600',
          brand: 'Dabur',
          category: 'Immune Support',
          rating: 4.5
        },
        {
          name: 'Ashwagandha Capsules',
          description: 'Helps reduce stress and anxiety while improving concentration and energy levels. A powerful adaptogen for modern lifestyles.',
          price: 280,
          image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600',
          brand: 'Zandu',
          category: 'Stress Relief',
          rating: 4.3
        },
        {
          name: 'Triphala Churna',
          description: 'A traditional Ayurvedic formulation made from three fruits. Supports digestive health, detoxification, and regular elimination.',
          price: 220,
          image: 'https://images.pexels.com/photos/6942823/pexels-photo-6942823.jpeg?auto=compress&cs=tinysrgb&w=600',
          brand: 'Punarvasu',
          category: 'Digestive Health',
          rating: 4.7
        },
        {
          name: 'Shankhpushpi Syrup',
          description: 'A natural brain tonic that enhances memory, concentration, and cognitive functions. Ideal for students and professionals.',
          price: 180,
          image: 'https://images.pexels.com/photos/8989497/pexels-photo-8989497.jpeg?auto=compress&cs=tinysrgb&w=600',
          brand: 'Unjha',
          category: 'Brain Health',
          rating: 4.2
        },
        {
          name: 'Amla Juice',
          description: 'Rich in Vitamin C, this juice supports immunity, skin health, and digestion. A daily health tonic for the whole family.',
          price: 150,
          image: 'https://images.pexels.com/photos/7469189/pexels-photo-7469189.jpeg?auto=compress&cs=tinysrgb&w=600',
          brand: 'Dabur',
          category: 'Juices',
          rating: 4.6
        },
        {
          name: 'Brahmi Ghrita',
          description: 'A medicated ghee preparation that supports mental clarity, memory, and cognitive function. Traditional brain tonic.',
          price: 320,
          image: 'https://images.pexels.com/photos/5940829/pexels-photo-5940829.jpeg?auto=compress&cs=tinysrgb&w=600',
          brand: 'Zandu',
          category: 'Brain Health',
          rating: 4.4
        },
        {
          name: 'Neem Tablets',
          description: 'Supports skin health and blood purification. Known for its antibacterial and antifungal properties.',
          price: 190,
          image: 'https://images.pexels.com/photos/6942048/pexels-photo-6942048.jpeg?auto=compress&cs=tinysrgb&w=600',
          brand: 'Punarvasu',
          category: 'Skin Health',
          rating: 4.1
        },
        {
          name: 'Haritaki Powder',
          description: 'Supports digestive health and regular elimination. One of the three fruits in Triphala, known for its rejuvenating properties.',
          price: 210,
          image: 'https://images.pexels.com/photos/6941875/pexels-photo-6941875.jpeg?auto=compress&cs=tinysrgb&w=600',
          brand: 'Unjha',
          category: 'Digestive Health',
          rating: 4.5
        }
      ];

      await Product.bulkCreate(sampleProducts);
      console.log('Sample products added successfully.');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
// start the server
