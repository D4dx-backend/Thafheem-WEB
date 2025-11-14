import React, { useState } from 'react';
import { X, Copy, Share2 } from 'lucide-react';

const determineContainerWidth = (plainTextLength = 0) => {
  if (plainTextLength <= 400) {
    return "sm:max-w-xl";
  }
  if (plainTextLength <= 1200) {
    return "sm:max-w-3xl";
  }
  return "sm:max-w-5xl";
};

const NotePopup = ({
  isOpen,
  onClose,
  noteId,
  noteContent,
  loading = false,
  error = null,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  if (!isOpen) return null;

  // Extract plain text from HTML content
  const extractPlainText = (content) => {
    if (typeof content === 'string') {
      // Create a temporary div to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      return tempDiv.textContent || tempDiv.innerText || '';
    }
    return String(content || '');
  };

  // Copy note content to clipboard
  const handleCopy = async () => {
    try {
      const plainText = extractPlainText(noteContent);
      const noteText = `Note ${noteId}\n\n${plainText}`;
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(noteText);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = noteText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopySuccess(true);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy note:', error);
      // Show error feedback
      alert('Failed to copy note to clipboard');
    }
  };

  // Share note content
  const handleShare = async () => {
    try {
      const plainText = extractPlainText(noteContent);
      const shareText = `Note ${noteId}\n\n${plainText}`;
      const shareUrl = window.location.href;
      
      if (navigator.share) {
        await navigator.share({
          title: `Note ${noteId} - Thafheem`,
          text: shareText,
          url: shareUrl
        });
      } else {
        // Fallback: copy to clipboard with share message
        const shareMessage = `${shareText}\n\nShared from: ${shareUrl}`;
        
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareMessage);
          alert('Note content copied to clipboard for sharing');
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = shareMessage;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Note content copied to clipboard for sharing');
        }
      }
    } catch (error) {
      console.error('Failed to share note:', error);
      if (error.name !== 'AbortError') {
        alert('Failed to share note: ' + error.message);
      }
    }
  };

  const plainText = extractPlainText(noteContent);
  const containerWidthClass = determineContainerWidth(plainText.length);

  return (
    <>
      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}
      </style>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999] px-4">
      <div className={`bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full sm:w-auto ${containerWidthClass} max-w-[95vw] max-h-[90vh] overflow-hidden transition-all duration-200`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Back
            </button>
            <h2 className="text-lg font-medium text-[#2AA0BF]">Note {noteId}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleCopy}
              disabled={loading || !noteContent}
              className={`p-2 transition-all duration-200 relative ${
                copySuccess 
                  ? 'text-green-600 dark:text-green-400 scale-110' 
                  : `text-gray-400 ${loading || !noteContent ? 'opacity-40 cursor-not-allowed' : 'hover:text-gray-600 dark:hover:text-gray-300'}`
              }`}
              title="Copy note content"
            >
              <Copy size={18} />
              {copySuccess && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-md shadow-lg whitespace-nowrap z-10 animate-pulse">
                  ✓ Copied to clipboard!
                </div>
              )}
            </button>
            <button 
              onClick={handleShare}
              disabled={loading || !noteContent}
              className={`p-2 text-gray-400 ${loading || !noteContent ? 'opacity-40 cursor-not-allowed' : 'hover:text-gray-600 dark:hover:text-gray-300'} transition-colors`}
              title="Share note content"
            >
              <Share2 size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Close note"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {loading && (
            <div className="flex items-center justify-center py-6">
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Loading note…
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {showSuccessMessage && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg flex items-center space-x-2 animate-fade-in">
                  <div className="text-green-600 dark:text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-green-800 dark:text-green-200 font-medium">
                    Note content copied to clipboard successfully!
                  </span>
                </div>
              )}
              
              {typeof noteContent === 'string' ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-white"
                  dangerouslySetInnerHTML={{ __html: noteContent }}
                />
              ) : (
                <div 
                  className="text-gray-800 dark:text-white leading-relaxed text-justify"
                  style={{ fontFamily: "serif" }}
                >
                  {noteContent}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default NotePopup;
