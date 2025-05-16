import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container-custom py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <ShoppingBag className="w-20 h-20 text-neutral-300 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-neutral-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            {/* Headers - Desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-600">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Subtotal</div>
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-neutral-200">
              {cart.map((item) => (
                <div key={item.id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center">
                  {/* Mobile Layout */}
                  <div className="md:hidden flex mb-4">
                    <div className="w-24 h-24 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between mb-1">
                        <h3 className="text-lg font-medium text-neutral-800">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-neutral-700"
                          aria-label="Remove item"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <p className="text-neutral-500 text-sm mb-2">{item.brand}</p>
                      <p className="font-medium text-neutral-900 mb-2">₹{item.price}</p>
                      <div className="flex items-center border border-neutral-300 rounded-md inline-flex">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-2 py-1 text-center w-8">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex md:col-span-6 items-center">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-neutral-800">{item.name}</h3>
                      <p className="text-neutral-500 text-sm">{item.brand}</p>
                    </div>
                  </div>

                  <div className="hidden md:block md:col-span-2 text-center">
                    ₹{item.price}
                  </div>

                  <div className="hidden md:flex md:col-span-2 justify-center">
                    <div className="flex items-center border border-neutral-300 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-2 py-1 text-center w-8">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:flex md:col-span-2 justify-between items-center">
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-400 hover:text-neutral-700"
                      aria-label="Remove item"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Link to="/products" className="inline-flex items-center text-primary-600 hover:text-primary-700">
              <ArrowLeft size={16} className="mr-1" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
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

            <Link
              to="/checkout"
              className="btn-primary w-full"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;