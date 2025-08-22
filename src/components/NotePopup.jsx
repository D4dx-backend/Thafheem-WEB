import React from 'react';
import { X, Copy, Share2 } from 'lucide-react';

const NotePopup = ({ isOpen, onClose, noteId, noteContent }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">

      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-[#2AA0BF]">Note {noteId}</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Copy size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Share2 size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div 
            className="text-gray-800 leading-relaxed text-justify"
            style={{ fontFamily: "serif" }}
          >
            {noteContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePopup;