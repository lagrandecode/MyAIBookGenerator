import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Demo Registration
          </h2>
        </div>
        <div className="card p-8">
          <p className="text-center text-gray-600 mb-4">
            Registration is disabled for demo.<br />
            You are always logged in as <b>Demo User</b>.
          </p>
          <Link
            to="/dashboard"
            className="btn-primary w-full justify-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 