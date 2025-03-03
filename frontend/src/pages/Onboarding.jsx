import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import {
  User,
  UserCog,
  Home,
  AlertCircle,
} from "lucide-react";

const OnBoarding = () => {
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const { isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  useEffect(() => {
      if (isConnected === false) {
        navigate("/");
      }
    }, [isConnected, navigate]);

  useEffect(() => {

    const routeToSpecificPage = async () => {
      navigate(`/onboarding/${selectedRole}`);
    }
    if(selectedRole != null){
      routeToSpecificPage();
    }
  }, [selectedRole]);


  const renderRoleSelection = () => (
    <div className="space-y-4">
      <p className="text-gray-600 text-center mb-6">
        Please select your role
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={() => setSelectedRole("user")}
          className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <User className="w-10 h-10 text-blue-600 mb-3" />
          <span className="text-lg font-medium text-gray-800">User</span>
          <span className="text-sm text-gray-500 mt-1">
            Enroll for courses and exams
          </span>
        </button>

        <button
          onClick={() => setSelectedRole("official")}
          className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <UserCog className="w-10 h-10 text-blue-600 mb-3" />
          <span className="text-lg font-medium text-gray-800">Official</span>
          <span className="text-sm text-gray-500 mt-1">
            Create and manage exams
          </span>
        </button>
      </div>

      <div className="pt-4">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Home className="w-4 h-4 mr-2" />
          Return to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h1 className="text-xl font-semibold text-white">
              Account Registration
            </h1>
            <p className="text-blue-100 text-sm">
              Complete your profile to access the platform
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {!selectedRole ? renderRoleSelection() : null}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Secured by blockchain technology • All enrollments are verified and
          stored on-chain
        </p>
      </div>
    </div>
  );
};

export default OnBoarding;