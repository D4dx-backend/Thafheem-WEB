import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleCancel = () => {
    setIsOpen(false);
    console.log('Delete account cancelled');
    navigate(-1); // 👈 Goes back to the previous page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-500/70 bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal Content */}
          <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl p-6 w-96 max-w-md mx-4">
            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Delete Account
            </h2>

            {/* Message */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6 dark:text-white">
              Are you sure you want to delete your account? This action cannot be undone.
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
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
