import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // or your correct path



const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [cartMessage, setCartMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { addToCart } = useCart(); // adjust based on your implementation



  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);

        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          setError('Failed to fetch product details');
        }
      } catch (error) {
        setError('An error occurred while fetching product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl, // or product.image if that’s the field
      brand: product.brand,
      // quantity: quantity
    });

    setCartMessage({
      text: `${product.name} added to your cart!`,
      type: 'success'
    });

    setTimeout(() => {
      setCartMessage(null);
    }, 3000);
  };

  // Function to check if product is in cart
  const isInCart = () => {
    try {
      const cartJSON = localStorage.getItem('cart');
      if (!cartJSON) return false;

      const cart = JSON.parse(cartJSON);
      return cart.some((item: any) => item.productId === product?.id);
    } catch (error) {
      console.error("Error checking cart:", error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Product not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the product you're looking for.
          </p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <ol className="flex space-x-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li className="before:content-['/'] before:mx-2">
              <Link to="/products" className="hover:text-blue-600">Products</Link>
            </li>
            <li className="before:content-['/'] before:mx-2 truncate max-w-xs">
              <span className="text-gray-400">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              {product.image ? (
                <img
                  src={
                    product.image.startsWith('http')
                      ? product.image
                      : `http://localhost:5000${product.image}`
                  }
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"


                />
              ) : (
                <div className="bg-gray-100 h-96 w-full flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-8">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  {product.name}
                </h1>

                {product.inStock ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Out of Stock
                  </span>
                )}
              </div>

              {product.brand && (
                <div className="text-sm text-gray-500 mb-4">
                  Brand: <span className="font-medium">{product.brand}</span>
                </div>
              )}

              <div className="mb-4">
                <span className="text-gray-500">Price:</span>
                <span className="text-2xl font-bold text-gray-800 ml-2">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </span>
              </div>

              <p className="text-gray-600 mb-6">
                {product.description || 'No description available.'}
              </p>

              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="mb-6">
                    <label htmlFor="quantity" className="block mb-1 text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      readOnly={true}
                      onChange={handleQuantityChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>


                  {product.inStock && (
                    <span className="text-sm text-gray-500">
                      {product.stockCount ? `${product.stockCount} in stock` : 'In stock'}
                    </span>
                  )}
                </div>

                {cartMessage && (
                  <div className={`mb-4 p-2 rounded text-sm ${cartMessage.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {cartMessage.text}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAddToCart}
                    className={`flex items-center justify-center px-6 py-2 rounded-lg transition-colors ${product.inStock && !addingToCart
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    disabled={!product.inStock || addingToCart}
                  >
                    {addingToCart ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </>
                    ) : isInCart() ? (
                      'Add More'
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                  {/* <button className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Add to Wishlist
                  </button> */}
                </div>
              </div>

              {/* Additional product information */}
              {(product.features || product.specifications) && (
                <div className="mt-8 border-t pt-6">
                  {product.features && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Features</h3>
                      <ul className="list-disc pl-5 text-gray-600">
                        {Array.isArray(product.features) ? (
                          product.features.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))
                        ) : (
                          <li>{product.features}</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {product.specifications && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Specifications</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex">
                            <span className="font-medium text-gray-700 mr-2">{key}:</span>
                            <span className="text-gray-600">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;