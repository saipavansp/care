import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import LinkedInStyleLogo from '../common/LinkedInStyleLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'How It Works', path: '/how-it-works' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Contact', path: '/contact' }
    ],
    services: [
      { name: 'Book Companion', path: '/book' },
      { name: 'Corporate Plans', path: '/corporate-plans' },
      { name: 'Family Packages', path: '/family-packages' },
      { name: 'Emergency Support', path: '/emergency-support' }
    ],
    support: [
      { name: 'Help Center', path: '/help-center' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms of Service', path: '/terms-of-service' }
    ]
  };

  const socialLinks = [
    { icon: FiFacebook, url: 'https://facebook.com', label: 'Facebook' },
    { icon: FiTwitter, url: 'https://twitter.com', label: 'Twitter' },
    { icon: FiInstagram, url: 'https://instagram.com', label: 'Instagram' },
    { icon: FiLinkedin, url: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-width-container section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <LinkedInStyleLogo size="lg" className="mb-4" />
            <p className="text-gray-400 mb-6 max-w-md">
              Your trusted healthcare companion for every hospital visit. Professional support, 
              door-to-door service, and peace of mind for you and your family.
            </p>
            <div className="space-y-2">
              <a 
                href="tel:+919876543210" 
                className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors"
              >
                <FiPhone className="w-4 h-4" />
                <span>+91 9876543210</span>
              </a>
              <a 
                href="mailto:support@kinpin.in" 
                className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors"
              >
                <FiMail className="w-4 h-4" />
                <span>support@kinpin.in</span>
              </a>
              <div className="flex items-center space-x-2 text-gray-400">
                <FiMapPin className="w-4 h-4" />
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-heading font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400">
                Subscribe to our newsletter for health tips and service updates
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="max-width-container section-padding">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Kinpin. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;