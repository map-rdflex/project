import React, { useState, useEffect } from 'react';
import ProductCard from '../components/products/ProductCard';
import { API_BASE_URL } from '../api';  // path apne project ke hisaab se set karo



function Products() {
  const [products, setProducts] = useState<any[]>([]); // State for storing products
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]); // State for filtered products
  const [loading, setLoading] = useState<boolean>(true); // Loading state for better UX
  const [error, setError] = useState<string>(''); // Error state to handle errors
  const [searchTerm, setSearchTerm] = useState<string>(''); // Search term
  const [selectedBrand, setSelectedBrand] = useState<string>(''); // Selected brand for filtering
  const [brands, setBrands] = useState<string[]>([]); // Available brands



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          setFilteredProducts(data);

          const uniqueBrands = Array.from(
            new Set(data.map((product: any) => product.brand).filter(Boolean))
          );
          setBrands(uniqueBrands as string[]);
        } else {
          setError('Failed to fetch products');
        }
      } catch (error) {
        setError('An error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  // Filter products based on search term and selected brand
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === '' || product.brand === selectedBrand;

      return matchesSearch && matchesBrand;
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedBrand, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      {/* Filters section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search filter */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Brand filter */}
        <div className="w-full md:w-64">
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedBrand}
            onChange={handleBrandChange}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="mb-4 text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No products found matching your criteria. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;