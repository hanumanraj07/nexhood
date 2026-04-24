import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PrecisionSection from './components/PrecisionSection';
import TemporalSection from './components/TemporalSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';

function App() {
    return (
        <div style={{ background: '#e0e5ec', minHeight: '100vh' }}>
            <Navbar />
            <main>
                <HeroSection />
                <PrecisionSection />
                <TemporalSection />
                <TestimonialsSection />
            </main>
            <Footer />
        </div>
    );
}

export default App;
