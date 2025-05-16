import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RoverSpot</h3>
            <p className="text-gray-300">
              Discover the hidden gems and popular destinations of Sri Lanka through the eyes of passionate travelers.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>info@roverspot.com</span>
              </p>
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>+94 11 234 5678</span>
              </p>
              <p className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Colombo, Sri Lanka</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">© {new Date().getFullYear()} RoverSpot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;