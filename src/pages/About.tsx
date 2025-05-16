import React from 'react';

const About = () => {
    return (
        <div className="about-page-container" style={{ padding: '60px 20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Heading Section */}
            <div className="about-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', color: '#333', fontWeight: 'bold', marginBottom: '20px' }}>
                    About Us
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#777', lineHeight: '1.6', maxWidth: '900px', margin: '0 auto' }}>
                    Welcome to our store! We are dedicated to providing the best quality Ayurvedic products to ensure your
                    health and well-being. Our goal is to offer natural, sustainable, and effective solutions through ancient
                    wisdom, combined with modern convenience and technology.
                </p>
            </div>


        </div>
    );
};

export default About;
