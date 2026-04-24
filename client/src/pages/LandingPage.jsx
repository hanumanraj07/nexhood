import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SmartNeighborhoodSection from '../components/SmartNeighborhoodSection';
import MapSection from '../components/MapSection';
import PrecisionSection from '../components/PrecisionSection';
import SmartParkingSection from '../components/SmartParkingSection';
import TemporalSection from '../components/TemporalSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';

const LandingPage = () => {
    return (
        <div style={{ background: '#e0e5ec', minHeight: '100vh' }}>
            <Navbar />
            <main>
                <HeroSection />
                <SmartNeighborhoodSection />
                <MapSection />
                <PrecisionSection />
                <SmartParkingSection />
                <TemporalSection />
                <TestimonialsSection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
