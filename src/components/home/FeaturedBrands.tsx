import React from 'react';
import { Link } from 'react-router-dom';

// Brand information
// const brands = [
//   {
//     id: 1,
//     name: 'Dabur',
//     logo: 'https://images.pexels.com/photos/4466522/pexels-photo-4466522.jpeg?auto=compress&cs=tinysrgb&w=600',
//     description: 'With a legacy of over 135 years, Dabur is one of India s most trusted Ayurvedic brands.'
//   },
//   {
//     id: 2,
//     name: 'Zandu',
//     logo: 'https://images.pexels.com/photos/5938242/pexels-photo-5938242.jpeg?auto=compress&cs=tinysrgb&w=600',
//     description: 'Specializing in authentic Ayurvedic formulations since 1910.'
//   },
//   {
//     id: 3,
//     name: 'Unjha',
//     logo: 'https://images.pexels.com/photos/5938346/pexels-photo-5938346.jpeg?auto=compress&cs=tinysrgb&w=600',
//     description: 'Renowned for high-quality traditional Ayurvedic preparations.'
//   },
//   {
//     id: 4,
//     name: 'Punarvasu',
//     logo: 'https://images.pexels.com/photos/5938358/pexels-photo-5938358.jpeg?auto=compress&cs=tinysrgb&w=600',
//     description: 'Modern Ayurvedic solutions blending tradition with contemporary science.'
//   }
// ];

const FeaturedBrands: React.FC = () => {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container-custom">
        {/* <h2 className="text-3xl font-bold mb-12 text-center">Featured Brands</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> */}
        {/* {brands.map(brand => (
            <Link
              key={brand.id}
              to={`/products?brand=${brand.name.toLowerCase()}`}
              className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-shadow group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{brand.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-neutral-700">{brand.description}</p>
              </div>
            </Link>
          ))} */}
        {/* </div> */}
      </div>
    </section >
  );
};

export default FeaturedBrands;