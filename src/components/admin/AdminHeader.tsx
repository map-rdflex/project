import React from 'react';
import { Bell, User, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-neutral-200 py-4 px-6 flex items-center justify-between">
      {/* Search */}
      <div className="relative w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-neutral-400" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="form-input pl-10 py-2 h-10 text-sm"
        />
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full text-neutral-600 hover:bg-neutral-100 focus:outline-none">
          <Bell size={20} />
          <span className="absolute top-1 right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary-500 text-white text-xs">
            3
          </span>
        </button>

        {/* User Menu */}
        <div className="relative group">
          <button className="flex items-center space-x-1 text-neutral-700 group-hover:text-neutral-900">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <User size={18} />
            </div>
            <span className="font-medium">{user?.username || 'Admin'}</span>
          </button>

          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
            <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
              Your Profile
            </a>
            {/* <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
              Settings
            </a> */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;