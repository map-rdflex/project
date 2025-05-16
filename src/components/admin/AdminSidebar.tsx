import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Leaf,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: <ShoppingBag size={20} />
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: <Package size={20} />
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <Users size={20} />
    },
    // { 
    //   name: 'Settings', 
    //   path: '/admin/settings', 
    //   icon: <Settings size={20} /> 
    // }
  ];

  return (
    <div
      className={`bg-neutral-800 text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'
        }`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-700">
        <Link to="/admin" className="flex items-center">
          <Leaf className="text-primary-500" size={24} />
          {!collapsed && (
            <span className="ml-2 font-bold text-lg">Shri Ayu Admin</span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="text-neutral-400 hover:text-white focus:outline-none"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center py-3 px-4 ${isActive(item.path)
                  ? 'bg-primary-700 text-white'
                  : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
                  } transition-colors ${collapsed ? 'justify-center' : ''
                  }`}
              >
                <span className="inline-flex">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Back to site */}
      <div className="p-4 border-t border-neutral-700">
        <Link
          to="/"
          className="flex items-center text-neutral-300 hover:text-white transition-colors"
        >
          {collapsed ? (
            <Leaf size={20} />
          ) : (
            <>
              <Leaf size={20} className="mr-2" />
              <span>Back to Website</span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;