import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube as YouTube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="text-primary-400" size={24} />
              <span className="text-xl font-bold text-white">Shri Ayu Wellness</span>
            </div>
            <p className="text-neutral-300 mb-4">
              Discover the power of Ayurveda with premium products from trusted brands. Our mission is to bring authentic Ayurvedic wellness solutions to modern lifestyles.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <YouTube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-300 hover:text-primary-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-neutral-300 hover:text-primary-400 transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-300 hover:text-primary-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-300 hover:text-primary-400 transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-neutral-300 hover:text-primary-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-neutral-300 hover:text-primary-400 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Featured Brands */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Featured Brands</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?brand=dabur" className="text-neutral-300 hover:text-primary-400 transition-colors">Dabur</Link>
              </li>
              <li>
                <Link to="/products?brand=unjha" className="text-neutral-300 hover:text-primary-400 transition-colors">Unjha</Link>
              </li>
              <li>
                <Link to="/products?brand=punarvasu" className="text-neutral-300 hover:text-primary-400 transition-colors">Punarvasu</Link>
              </li>
              <li>
                <Link to="/products?brand=zandu" className="text-neutral-300 hover:text-primary-400 transition-colors">Zandu</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="text-primary-400 mr-2 mt-1" size={18} />
                <span className="text-neutral-300">D/204 Adishwar Nagar Naroda, Ahmedabad - 382330</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-primary-400 mr-2" size={18} />
                <span className="text-neutral-300">+91 7573051360</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-primary-400 mr-2" size={18} />
                <span className="text-neutral-300">malavparekh97@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-neutral-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">
            &copy; {new Date().getFullYear()} Shri Ayu Wellness. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <img
              src="https://www.razorpay.com/assets/razorpay-glyph.svg"
              alt="Razorpay"
              className="h-8 inline-block mr-2"
            />
            <span className="text-neutral-400 text-sm">Secure Payments by Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;