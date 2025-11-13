import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const LogOut = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not signed in
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Show loading while checking auth state
  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleCancel = () => {
    setIsOpen(false);
navigate(-1); // Go back to previous page
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      setIsOpen(false);
navigate('/'); // Redirect to homepage
    } catch (error) {
      console.error('Error logging out:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-poppins">
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-500/70 bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal Content */}
          <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl p-6 w-96 max-w-md mx-4">
            
            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">
              Log Out
            </h2>
            
            {/* Message */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6 dark:text-white">
              Are you sure you want to log out?
            </p>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                disabled={isLoggingOut}
                className="px-4 py-2 text-gray-700 border dark:text-white dark:hover:bg-[#2A2C38] border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoggingOut && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{isLoggingOut ? 'Logging Out...' : 'Log Out'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogOut;
