import React from 'react';
import { ShoppingBag, Users, CreditCard, TrendingUp, Package, ArrowUp, ArrowDown } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Mock data
  const stats = [
    {
      title: 'Total Sales',
      value: '₹28,650',
      change: '+12.5%',
      increasing: true,
      icon: <CreditCard size={24} className="text-primary-500" />
    },
    {
      title: 'Total Orders',
      value: '156',
      change: '+8.2%',
      increasing: true,
      icon: <Package size={24} className="text-accent-500" />
    },
    {
      title: 'Total Products',
      value: '48',
      change: '+4.3%',
      increasing: true,
      icon: <ShoppingBag size={24} className="text-secondary-500" />
    },
    {
      title: 'Total Customers',
      value: '89',
      change: '+15.8%',
      increasing: true,
      icon: <Users size={24} className="text-primary-500" />
    }
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'Rahul Sharma', date: '12 May 2025', status: 'Delivered', amount: '₹1,250' },
    { id: 'ORD-002', customer: 'Priya Mehta', date: '11 May 2025', status: 'Processing', amount: '₹830' },
    { id: 'ORD-003', customer: 'Amit Joshi', date: '10 May 2025', status: 'Shipped', amount: '₹2,100' },
    { id: 'ORD-004', customer: 'Neha Singh', date: '09 May 2025', status: 'Pending', amount: '₹560' },
    { id: 'ORD-005', customer: 'Vikram Patel', date: '08 May 2025', status: 'Delivered', amount: '₹1,490' }
  ];

  const topProducts = [
    { name: 'Chyawanprash', brand: 'Dabur', sold: 32, revenue: '₹11,200' },
    { name: 'Ashwagandha Capsules', brand: 'Zandu', sold: 28, revenue: '₹7,840' },
    { name: 'Triphala Churna', brand: 'Punarvasu', sold: 24, revenue: '₹5,280' },
    { name: 'Amla Juice', brand: 'Dabur', sold: 18, revenue: '₹2,700' },
    { name: 'Brahmi Ghrita', brand: 'Zandu', sold: 15, revenue: '₹4,800' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button className="btn-primary">
          <TrendingUp size={16} className="mr-1" />
          Generate Report
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-500 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className="p-2 rounded-md bg-primary-50">
                {stat.icon}
              </div>
            </div>
            <div className={`flex items-center mt-2 ${
              stat.increasing ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.increasing ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="ml-1 text-sm">{stat.change}</span>
              <span className="text-neutral-500 text-sm ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-soft overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-neutral-200">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <a href="/admin/orders" className="text-primary-600 text-sm hover:text-primary-700">
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-neutral-100 text-neutral-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-soft overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-neutral-200">
            <h2 className="text-lg font-semibold">Top Selling Products</h2>
            <a href="/admin/products" className="text-primary-600 text-sm hover:text-primary-700">
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {product.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {product.sold} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {product.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;