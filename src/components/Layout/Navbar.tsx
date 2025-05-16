import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = false; // Replace with actual auth state

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Compass className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-800">RoverSpot</span>
            </Link>
          </div>

          {/* Center Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md ${
                isActive('/') ? 'text-emerald-600 font-medium' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/blog"
              className={`text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md ${
                isActive('/blog') ? 'text-emerald-600 font-medium' : ''
              }`}
            >
              Blog
            </Link>
            <Link
              to="/profile"
              className={`text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md ${
                isActive('/profile') ? 'text-emerald-600 font-medium' : ''
              }`}
            >
              Profile
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isAuthenticated && (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 px-4 py-2 rounded-lg border border-gray-300 hover:border-emerald-600"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="flex items-center space-x-1 text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;