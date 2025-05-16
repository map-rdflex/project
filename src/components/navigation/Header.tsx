import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, ShoppingCart, User, Leaf, ChevronDown, LogOut, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close menu when location changes
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Products', path: '/products' },
    // {
    //   title: 'Brands', path: '#', dropdown: [
    //     { title: 'Dabur', path: '/products?brand=dabur' },
    //     { title: 'Unjha', path: '/products?brand=unjha' },
    //     { title: 'Punarvasu', path: '/products?brand=punarvasu' },
    //     { title: 'Zandu', path: '/products?brand=zandu' },
    //   ]
    // },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="text-primary-600" size={28} />
            <span className="text-xl font-bold text-primary-700">Shri Ayu Wellness</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <div key={index} className="relative group">
                {link.dropdown ? (
                  <div className="flex items-center cursor-pointer">
                    <span className={`font-medium ${location.pathname === link.path ? 'text-primary-600' : 'text-neutral-700 hover:text-primary-600'}`}>
                      {link.title}
                    </span>
                    <ChevronDown size={16} className="ml-1" />
                    <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-48 z-10">
                      {link.dropdown.map((dropdownItem, idx) => (
                        <Link
                          key={idx}
                          to={dropdownItem.path}
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                        >
                          {dropdownItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`font-medium ${location.pathname === link.path ? 'text-primary-600' : 'text-neutral-700 hover:text-primary-600'}`}
                  >
                    {link.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              className="text-neutral-700 hover:text-primary-600 focus:outline-none"
              aria-label="Search"
            >
              <Search size={22} />
            </button>

            <Link to="/cart" className="text-neutral-700 hover:text-primary-600 relative">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-neutral-700 hover:text-primary-600 focus:outline-none"
                >
                  <User size={22} />
                  <span className="ml-1 hidden sm:inline text-sm font-medium">
                    {user.username}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/order-history"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                    >
                      Order History
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-neutral-700 hover:text-primary-600 flex items-center"
              >
                <User size={22} />
                <span className="ml-1 hidden sm:inline text-sm font-medium">Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-neutral-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 py-4 shadow-md">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link, index) => (
              <div key={index}>
                {link.dropdown ? (
                  <div>
                    <div className="font-medium text-neutral-700">
                      {link.title}
                    </div>
                    <div className="pl-4 mt-2 space-y-2">
                      {link.dropdown.map((dropdownItem, idx) => (
                        <Link
                          key={idx}
                          to={dropdownItem.path}
                          className="block text-sm text-neutral-600 hover:text-primary-600"
                        >
                          {dropdownItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`font-medium ${location.pathname === link.path ? 'text-primary-600' : 'text-neutral-700'}`}
                  >
                    {link.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;