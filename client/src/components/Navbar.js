import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(() => {
    // Check localStorage or default to 'light'
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 fixed w-full z-20 top-0 left-0 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        {/* Logo and App Name */}
        <Link to="/" className="flex items-center group">
          <img src={process.env.PUBLIC_URL + '/icon.png'} alt="MyAIBook Logo" className="h-9 w-9 mr-3 rounded shadow group-hover:scale-105 transition-transform duration-200" />
          <span className="font-extrabold text-2xl text-blue-700 dark:text-blue-300 tracking-tight" style={{ fontFamily: 'Space Grotesk, Arial, sans-serif' }}>
            MyAIBook
          </span>
        </Link>
        {/* Navigation Links and Theme Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ${location.pathname === '/' ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold' : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300'}`}
            style={{ fontFamily: 'Space Grotesk, Arial, sans-serif' }}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ${location.pathname === '/pricing' ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold' : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300'}`}
            style={{ fontFamily: 'Space Grotesk, Arial, sans-serif' }}
          >
            Pricing
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ${location.pathname === '/dashboard' ? 'bg-blue-600 dark:bg-blue-500 text-white font-bold shadow' : 'text-gray-700 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white'}`}
                style={{ fontFamily: 'Space Grotesk, Arial, sans-serif' }}
              >
                Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                  Welcome, {user.username}!
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-150"
                  style={{ fontFamily: 'Space Grotesk, Arial, sans-serif' }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ${location.pathname === '/login' ? 'bg-blue-600 dark:bg-blue-500 text-white font-bold shadow' : 'text-gray-700 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white'}`}
              style={{ fontFamily: 'Space Grotesk, Arial, sans-serif' }}
            >
              Login
            </Link>
          )}
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 focus:outline-none"
            aria-label="Toggle theme"
            title="Toggle dark/light mode"
          >
            {theme === 'dark' ? (
              // Sun icon for light mode
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="5" fill="currentColor" />
                <path stroke="currentColor" strokeWidth="2" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.46 6.46L5.05 5.05m13.9 0l-1.41 1.41M6.46 17.54l-1.41 1.41" />
              </svg>
            ) : (
              // Moon icon for dark mode
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke="currentColor" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 