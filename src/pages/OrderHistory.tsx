import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Calendar, DollarSign } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../api'; // adjust the path based on the file location

interface Product {
  id: number;
  name: string;
  image: string;
  brand: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  Product: Product;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

interface Order {
  id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  OrderItems: OrderItem[];
  shippingAddress: ShippingAddress;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Orders from API:', response.data); // Debug: check API response shape
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container-custom py-16">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <Package className="mx-auto h-16 w-16 text-neutral-300" />
          <h2 className="mt-4 text-2xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-neutral-600">Start shopping to create your first order</p>
          <Link to="/products" className="btn-primary mt-6 inline-flex">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-soft overflow-hidden">
            {/* Order Header */}
            <div className="p-6 border-b border-neutral-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                  <span className="text-lg font-semibold">Order #{order.id}</span>
                  <ChevronRight className="mx-2 text-neutral-400" size={20} />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="mt-4 md:mt-0 flex flex-wrap gap-4 text-sm text-neutral-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-1" />
                    Total: ₹{order.total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="space-y-4">
                {order.OrderItems.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                      {item.Product ? (
                        <img
                          src={item.Product.image}
                          alt={item.Product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-neutral-500">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-base font-medium text-neutral-900">
                            {item.Product?.name || 'Product Deleted'}
                          </h3>
                          <p className="mt-1 text-sm text-neutral-500">
                            {item.Product?.brand || 'N/A'}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-neutral-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}

              </div>

              {/* Shipping Address */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Shipping Address</h4>
                <div className="text-sm text-neutral-600">
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
