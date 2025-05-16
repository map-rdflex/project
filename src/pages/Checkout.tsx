import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, User, Home, Truck, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

interface ShippingDetails {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

interface PaymentDetails {
  cardNumber: string;
  nameOnCard: string;
  expiry: string;
  cvv: string;
}

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: ''
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    nameOnCard: '',
    expiry: '',
    cvv: ''
  });

  const [loading, setLoading] = useState(false);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loadRazorpay();
      if (!res) {
        toast.error('Razorpay SDK failed to load');
        setLoading(false);
        return;
      }

      // Create Razorpay order
      const response = await axios.post(
        'http://localhost:5000/api/payment/create-order',
        { amount: totalPrice },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const options = {
        key: 'rzp_test_nX5UDu5A20ff2J', // Replace with your actual Razorpay key ID
        amount: response.data.amount,
        currency: response.data.currency,
        name: 'Shri Ayu Wellness',
        description: 'Purchase of Ayurvedic Products',
        order_id: response.data.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            await axios.post(
              'http://localhost:5000/api/payment/verify',
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            // Create order
            const orderResponse = await axios.post(
              'http://localhost:5000/api/orders',
              {
                items: cart,
                shippingAddress: shippingDetails,
                total: totalPrice
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            // Clear cart and redirect to success page
            clearCart();
            navigate('/order-success', { 
              state: { 
                orderId: orderResponse.data.id,
                paymentId: response.razorpay_payment_id 
              } 
            });
          } catch (error) {
            console.error('Order creation error:', error);
            toast.error('Payment successful, but order creation failed');
          }
        },
        prefill: {
          name: shippingDetails.fullName,
          contact: shippingDetails.phone,
          email: user?.email
        },
        theme: {
          color: '#6cb52a'
        }
      };

      // Open Razorpay payment form
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to initiate payment process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping and Payment Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Details */}
            <div className="bg-white rounded-lg shadow-soft overflow-hidden">
              <div className="p-4 bg-primary-50 flex items-center border-b border-primary-100">
                <Truck className="text-primary-600 mr-2" size={20} />
                <h2 className="text-lg font-semibold">Shipping Details</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="form-input"
                      value={shippingDetails.fullName}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-input"
                      value={shippingDetails.phone}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-input"
                    value={shippingDetails.address}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="form-input"
                      value={shippingDetails.city}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className="form-input"
                      value={shippingDetails.state}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      className="form-input"
                      value={shippingDetails.postalCode}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-soft overflow-hidden">
              <div className="p-4 bg-primary-50 flex items-center border-b border-primary-100">
                <CreditCard className="text-primary-600 mr-2" size={20} />
                <h2 className="text-lg font-semibold">Payment Details</h2>
              </div>
              
              <div className="p-6">
                <div className="bg-secondary-50 border border-secondary-100 rounded-md p-4 mb-6">
                  <div className="flex items-start">
                    <Shield className="text-secondary-600 mr-2 mt-0.5" size={18} />
                    <p className="text-sm text-secondary-800">
                      All payment information is processed securely. We do not store your credit card details.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-center text-neutral-600">
                    Click "Complete Order" to proceed to the Razorpay payment gateway
                  </p>
                  
                  <div className="flex justify-center">
                    <img 
                      src="https://www.razorpay.com/assets/razorpay-glyph.svg" 
                      alt="Razorpay" 
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-soft p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="divide-y divide-neutral-200">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium text-neutral-800">{item.name}</p>
                      <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-neutral-200 pt-4 mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium">₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tax</span>
                  <span className="font-medium">₹0.00</span>
                </div>
                <div className="pt-3 border-t border-neutral-200">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-6"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Complete Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;