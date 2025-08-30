import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import ProblemSection from '../components/home/ProblemSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import BenefitsSection from '../components/home/BenefitsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';
import StatsSection from '../components/home/StatsSection';
import YouTubeVideoSection from '../components/home/YouTubeVideoSection';

const HomePage = () => {
  return (
    <div className="min-h-screen" itemScope itemType="http://schema.org/Organization">
      <meta itemProp="name" content="KinPin" />
      <meta itemProp="url" content="https://www.kinpin.in/" />
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Video Section */}
      <YouTubeVideoSection />

      {/* Problem Section */}
      <ProblemSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Benefits */}
      <BenefitsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default HomePage;