import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { API_BASE_URL } from '../../api'; // adjust path based on your file location


interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  description?: string;
  rating?: number;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
}


const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand
    });
  };


  return (
    <Link
      to={`/products/${product.id}`}
      className="card group"
    >
      <div className="relative overflow-hidden">
        <div className="h-56 bg-neutral-100">
          <img
            src={product.image || '/default-image.png'}
            onError={(e) => { e.currentTarget.src = '/default-image.png'; }}
            alt={product.name}
            className="w-full h-full object-contain"
          />








        </div>

        <button
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-neutral-600 hover:text-accent-500 transition-colors"
          onClick={(e) => e.preventDefault()}
          aria-label="Add to wishlist"
        >
          <Heart size={18} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-sm text-neutral-500">{product.brand}</span>
            <h3 className="text-lg font-medium mb-1 text-neutral-800">{product.name}</h3>
          </div>

          {product.rating && (
            <div className="flex items-center bg-primary-50 px-2 py-1 rounded text-sm">
              <Star size={14} className="text-secondary-500 mr-1" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>

        <div className="mt-2 flex justify-between items-center">
          <div className="text-lg font-semibold text-neutral-900">₹{product.price}</div>

          <button
            onClick={handleAddToCart}
            className="btn-primary py-1.5 px-3"
          >
            <ShoppingCart size={18} className="mr-1" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;