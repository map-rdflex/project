import React, { useState } from 'react';

const AdminAddProduct: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [inStock, setInStock] = useState<boolean>(true);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Fetch the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      alert('No authentication token found. Please log in first.');
      setLoading(false);
      return;
    }

    const newProduct = {
      name: productName,
      price,
      category,
      brand,
      inStock,
      image
    };

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // Pass the token here
        },
        credentials: 'include',
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        alert('Product added successfully!');
        setProductName('');
        setPrice(0);
        setCategory('');
        setBrand('');
        setInStock(true);
        setImage('');
      } else {
        const errorResponse = await response.json(); // Assuming the backend returns an error message
        console.error('Error adding product:', errorResponse);
        alert(`Failed to add product: ${errorResponse.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error adding product:', error);
      const message =
        error?.message ||
        error?.response?.data?.message || // axios-like response
        'Unknown error';
      alert(`An error occurred: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            min="0"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Status</label>
          <select
            value={inStock ? 'inStock' : 'outOfStock'}
            onChange={(e) => setInStock(e.target.value === 'inStock')}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md">
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`btn-primary mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;
