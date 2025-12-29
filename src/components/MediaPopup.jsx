import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { API_BASE_PATH } from '../config/apiConfig';

const MediaPopup = ({ isOpen, onClose, mediaId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaData, setMediaData] = useState(null);

  useEffect(() => {
    if (!isOpen || !mediaId) return;

    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_PATH}/media/${mediaId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load media: ${response.status}`);
        }
        
        const data = await response.json();
        // Handle array response
        const media = Array.isArray(data) ? data[0] : data;
        setMediaData(media);
      } catch (err) {
        console.error('Error fetching media:', err);
        setError(err.message || 'Failed to load media');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [isOpen, mediaId]);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root') || document.body;

  return createPortal(
    <>
      <style>
        {`
          @keyframes backdropFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalSlideUp {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-backdrop-fade-in {
            animation: backdropFadeIn 0.2s ease-out;
          }
          .animate-modal-slide-up {
            animation: modalSlideUp 0.3s ease-out;
          }
        `}
      </style>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999] px-4 animate-backdrop-fade-in"
        onClick={onClose}
      >
        <div 
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-modal-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Noto Sans Malayalam'" }}>
              {mediaData?.mediasubject || 'Media'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading media...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-500 dark:text-red-400 mb-2">Error loading media</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
              </div>
            )}

            {!loading && !error && mediaData?.Mediafile && (
              <div className="flex justify-center">
                <img
                  src={mediaData.Mediafile}
                  alt={mediaData.mediasubject || 'Media'}
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: 'calc(90vh - 120px)' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    modalRoot
  );
};

export default MediaPopup;
