import React, { useState, useRef } from 'react';

const AdminAddProduct: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [inStock, setInStock] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

    // Using FormData to handle file upload
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', price.toString());
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('inStock', String(inStock));

    // Append the image file if one was selected
    if (selectedImage) {
      formData.append('productImage', selectedImage);
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,  // Pass the token here
          // Don't set Content-Type when using FormData - the browser will set it correctly with boundary
        },
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        alert('Product added successfully!');
        // Reset the form
        setProductName('');
        setPrice(0);
        setCategory('');
        setBrand('');
        setInStock(true);
        setSelectedImage(null);
        setPreviewImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errorResponse = await response.json();
        console.error('Error adding product:', errorResponse);
        alert(`Failed to add product: ${errorResponse.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error adding product:', error);
      const message =
        error?.message ||
        error?.response?.data?.message ||
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
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100"
            />
          </div>
          {previewImage && (
            <div className="mt-2">
              <img
                src={previewImage}
                alt="Product preview"
                className="h-40 object-contain border rounded-md"
              />
            </div>
          )}
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