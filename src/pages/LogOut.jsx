import React, { useState } from 'react';

const LogOut = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleCancel = () => {
    setIsOpen(false);
    console.log('Logout cancelled');
  };

  const handleLogOut = () => {
    setIsOpen(false);
    console.log('User logged out');
    // Handle logout logic here
    // Example: clear user session, redirect to login page, etc.
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Open Log Out Dialog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black  bg-opacity-50 flex items-center justify-center z-50">
        
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
              className="px-4 py-2 text-gray-700 border dark:text-white dark:hover:bg-[#2A2C38] border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleLogOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
            >
              Log Out
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LogOut;