import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStarterClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Pricing Plans</h1>
        <p className="text-gray-600">Choose the perfect plan for your book generation needs</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="card p-8 text-center border-2 border-green-500 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              FREE
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Starter</h3>
          <div className="text-3xl font-bold text-green-600 mb-4">$0</div>
          <ul className="text-gray-600 mb-6 space-y-2">
            <li>3 Book Generations</li>
            <li>Basic Templates</li>
            <li>PDF Export</li>
            <li>Email Support</li>
          </ul>
          <button 
            onClick={handleStarterClick}
            className="btn-primary w-full"
          >
            {user ? 'Start Creating' : 'Get Started'}
          </button>
        </div>
        
        <div className="card p-8 text-center border-2 border-blue-500">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional</h3>
          <div className="text-3xl font-bold text-blue-600 mb-4">$29.99</div>
          <ul className="text-gray-600 mb-6 space-y-2">
            <li>25 Book Generations</li>
            <li>Premium Templates</li>
            <li>PDF & DOCX Export</li>
            <li>AI Cover Generation</li>
            <li>Priority Support</li>
          </ul>
          <button className="btn-secondary w-full">Coming Soon</button>
        </div>
        
        <div className="card p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise</h3>
          <div className="text-3xl font-bold text-blue-600 mb-4">$99.99</div>
          <ul className="text-gray-600 mb-6 space-y-2">
            <li>Unlimited Generations</li>
            <li>Custom Templates</li>
            <li>All Export Formats</li>
            <li>Advanced AI Features</li>
            <li>24/7 Support</li>
          </ul>
          <button className="btn-secondary w-full">Coming Soon</button>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <Link to="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Pricing; 