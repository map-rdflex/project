import React, { useState } from 'react';
import { API_BASE_URL } from '../../api';

// path apne project ke hisaab se set karo


const AdminAddProduct: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  // const [rating, setRating] = useState<string>('');
  const [inStock, setInStock] = useState<boolean>(true);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No authentication token found. Please log in first.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('price', price.toString());
      formData.append('brand', brand);
      formData.append('description', description);
      formData.append('inStock', inStock.toString());
      if (image) formData.append('image', image);

      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      let responseData: any = null;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response from server:', text);
        throw new Error('Server returned unexpected response (non-JSON)');
      }

      if (response.ok) {
        alert('Product added successfully!');
        setProductName('');
        setPrice('');
        setBrand('');
        setDescription('');
        setInStock(true);
        setImage(null);
      } else {
        console.error('Server error response:', responseData);
        alert(`Failed to add product: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Client error while adding product:', error);
      alert(`An error occurred: ${error.message || 'Unknown error'}`);
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
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
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
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700">Rating (1 to 5)</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
            min="1"
            max="5"
            step="0.1"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Status</label>
          <select
            value={inStock ? 'inStock' : 'outOfStock'}
            onChange={(e) => setInStock(e.target.value === 'inStock')}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImage(file);
            }}
            required
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
