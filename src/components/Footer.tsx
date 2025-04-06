
import { Link } from "react-router-dom";
import { BarChart2, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-market-navy border-t border-blue-900/30 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <BarChart2 className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">Market<span className="text-blue-500">Oracle</span></span>
            </Link>
            <p className="text-gray-400 text-sm">
              Predict Tomorrow, Trade Today
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-blue-500 text-sm">
                  Stock Predictions
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-blue-500 text-sm">
                  Market Analysis
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-blue-500 text-sm">
                  AI Models
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-blue-500 text-sm">
                  Historical Data
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-500 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-500 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-500 text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-500 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-blue-500 text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-blue-500 text-sm">
                  API
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-blue-500 text-sm">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/plans" className="text-gray-400 hover:text-blue-500 text-sm">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-900/30 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Market Oracle. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Built by <a href="https://automatingdna.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Automating DNA</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
