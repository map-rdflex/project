import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Truck, Award } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import FeaturedBrands from '../components/home/FeaturedBrands';

// Mock data for featured products
const featuredProducts = [
  {
    id: 1,
    name: 'Chyawanprash',
    price: 350,
    image: 'https://t4.ftcdn.net/jpg/05/48/31/71/240_F_548317177_9PvyTJZeG5h2FlEfPiSPr1trf9Nl8Cxa.jpg',
    brand: 'Dabur',
    description: 'Ayurvedic health supplement to boost immunity and strength.',
    rating: 4.5,
    inStock: true
  },
  {
    id: 2,
    name: 'Sudarshan Ghanvati',
    price: 280,
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600',
    brand: 'Zandu',
    description: 'Helps reduce stress and anxiety while improving concentration.',
    rating: 4.3,
    inStock: true
  },
  {
    id: 3,
    name: 'Gioly Powder',
    price: 220,
    image: 'https://images.pexels.com/photos/6942823/pexels-photo-6942823.jpeg?auto=compress&cs=tinysrgb&w=600',
    brand: 'Punarvasu',
    description: 'Supports digestive health and detoxification.',
    rating: 4.7,
    inStock: true
  },
  {
    id: 4,
    name: 'Shankhpushpi Syrup',
    price: 180,
    image: 'https://images.pexels.com/photos/8989497/pexels-photo-8989497.jpeg?auto=compress&cs=tinysrgb&w=600',
    brand: 'Unjha',
    description: 'Enhances memory and cognitive functions.',
    rating: 4.2,
    inStock: true
  }
];

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 py-16 md:py-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Experience the Wisdom of Ayurveda
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-100">
              Discover authentic Ayurvedic products from India's most trusted brands.
              Natural remedies for modern wellness needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="btn bg-white text-primary-700 hover:bg-primary-50 focus:ring-white"
              >
                Explore Products
              </Link>
              <Link
                to="/about"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-neutral-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-soft">
              <Leaf className="text-primary-500 mb-4" size={36} />
              <h3 className="text-lg font-semibold mb-2">100% Authentic</h3>
              <p className="text-neutral-600">Genuine products sourced directly from authorized manufacturers</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-soft">
              <Shield className="text-primary-500 mb-4" size={36} />
              <h3 className="text-lg font-semibold mb-2">Quality Assured</h3>
              <p className="text-neutral-600">Every product meets rigorous quality standards</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-soft">
              <Truck className="text-primary-500 mb-4" size={36} />
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-neutral-600">Nationwide shipping with careful packaging</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-soft">
              <Award className="text-primary-500 mb-4" size={36} />
              <h3 className="text-lg font-semibold mb-2">Expert Guidance</h3>
              <p className="text-neutral-600">Personalized recommendations from Ayurveda experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
              View All <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <FeaturedBrands />

      {/* About Ayurveda */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">The Ancient Science of Life</h2>
              <p className="text-neutral-700 mb-4">
                Ayurveda, the "science of life", is India's 5000-year-old system of natural healing.
                It focuses on balancing the mind, body, and spirit through herbs, diet, yoga, and lifestyle practices.
              </p>
              <p className="text-neutral-700 mb-6">
                At Shri Ayu Wellness, we bring you the time-tested remedies from Ayurveda's rich pharmacopeia,
                carefully formulated by India's most respected brands.
              </p>
              <Link
                to="/about"
                className="btn-primary"
              >
                Discover More About Ayurveda
              </Link>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-medium">
              <img
                src="https://images.pexels.com/photos/301599/pexels-photo-301599.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Ayurvedic Herbs and Ingredients"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-soft">
              <div className="flex items-center mb-4">
                <div className="flex text-secondary-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-neutral-700 mb-4">
                "I've been using the Ashwagandha capsules for a month, and my stress levels have significantly decreased. I feel more energetic throughout the day!"
              </p>
              <div className="font-medium">Rahul S.</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-soft">
              <div className="flex items-center mb-4">
                <div className="flex text-secondary-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-neutral-700 mb-4">
                "The quality of products on this website is exceptional. Fast delivery and excellent customer service. I've recommended Shri Ayu to all my friends."
              </p>
              <div className="font-medium">Priya M.</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-soft">
              <div className="flex items-center mb-4">
                <div className="flex text-secondary-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-neutral-700 mb-4">
                "Triphala Churna has done wonders for my digestion. I love how this site provides detailed information about each product and its benefits."
              </p>
              <div className="font-medium">Amit J.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="bg-primary-600 rounded-xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Stay updated with new products, Ayurvedic tips, and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-neutral-900"
                required
              />
              <button
                type="submit"
                className="btn bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500 px-6"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;