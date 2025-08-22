import React, { useState } from 'react';

const DeleteAccount = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleCancel = () => {
    setIsOpen(false);
    console.log('Delete account cancelled');
  };

  const handleDelete = () => {
    setIsOpen(false);
    console.log('Account deletion confirmed');
    // Handle account deletion logic here
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
          Open Delete Account Dialog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        
        {/* Modal Content */}
        <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-md mx-4">
          
          {/* Header */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Delete Account
          </h2>
          
          {/* Message */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
            >
              Delete
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;