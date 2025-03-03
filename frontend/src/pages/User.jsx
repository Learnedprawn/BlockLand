import React from 'react';
import { Home, Map, CheckCircle, Shield } from 'lucide-react';


const User = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-indigo-700 text-white p-4 shadow-md">
        <div className="flex items-center space-x-2">
          <Home className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Welcome to Our Platform</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center p-6">
        <h2 className="text-3xl font-bold text-indigo-700">Streamline Your Land Management</h2>
        <p className="text-gray-600 mt-2 max-w-lg">
          Our platform simplifies land verification, registration, and tracking to ensure transparency and security.
        </p>
        
        <div className="mt-6 flex space-x-4">
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md w-40">
            <Map className="h-10 w-10 text-indigo-600" />
            <p className="mt-2 font-medium">Manage Lands</p>
          </div>

          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md w-40">
            <CheckCircle className="h-10 w-10 text-green-600" />
            <p className="mt-2 font-medium">Verify Ownership</p>
          </div>

          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md w-40">
            <Shield className="h-10 w-10 text-blue-600" />
            <p className="mt-2 font-medium">Secure Transactions</p>
          </div>
        </div>

        <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
          Get Started
        </button>
      </main>
    </div>
  );
};

export default User;
