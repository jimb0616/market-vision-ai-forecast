
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, BarChart2 } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-market-navy/80 backdrop-blur-md border-b border-blue-900/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BarChart2 className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">Market<span className="text-blue-500">Oracle</span></span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Features <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-market-charcoal border border-blue-900/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="py-1">
                  <Link to="/dashboard/predictions" className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-800/20 hover:text-white">
                    Stock Predictions
                  </Link>
                  <Link to="/dashboard/analytics" className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-800/20 hover:text-white">
                    Market Analysis
                  </Link>
                  <Link to="/dashboard/models" className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-800/20 hover:text-white">
                    AI Models
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/plans" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              Pricing
            </Link>
            <div className="flex items-center space-x-2 ml-4">
              <Link to="/login">
                <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500/10">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-market-navy border-b border-blue-900/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-800/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/dashboard/predictions"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-800/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Stock Predictions
            </Link>
            <Link
              to="/dashboard/analytics"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-800/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Market Analysis
            </Link>
            <Link
              to="/dashboard/models"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-800/20"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Models
            </Link>
            <Link
              to="/plans"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-800/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-800/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 text-center py-3"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
