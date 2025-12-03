import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Send, MessageSquare } from 'lucide-react';

const Feedback = () => {
  const { translationLanguage } = useTheme();
  const isMalayalam = translationLanguage === 'mal';
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement feedback submission logic
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-poppins">
      <div className="max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-gray-900 mb-4 dark:text-white ${isMalayalam ? 'font-malayalam' : ''}`}>
            {isMalayalam ? 'ഫീഡ്‌ബാക്ക്' : 'Feedback'}
          </h1>
          <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Content */}
        <div className="dark:text-white text-gray-800 leading-relaxed">
          <div className="prose prose-base dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {isMalayalam 
                ? 'ഞങ്ങളുടെ സേവനം മെച്ചപ്പെടുത്താൻ നിങ്ങളുടെ അഭിപ്രായങ്ങളും നിർദ്ദേശങ്ങളും പങ്കിടുക.'
                : 'Share your thoughts and suggestions to help us improve our service.'}
            </p>

            {/* Feedback Form */}
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="mb-6">
                <label 
                  htmlFor="feedback" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {isMalayalam ? 'നിങ്ങളുടെ ഫീഡ്‌ബാക്ക്' : 'Your Feedback'}
                </label>
                <textarea
                  id="feedback"
                  rows="8"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-[#2AA0BF] focus:border-transparent
                           resize-none"
                  placeholder={isMalayalam 
                    ? 'നിങ്ങളുടെ അഭിപ്രായങ്ങൾ ഇവിടെ എഴുതുക...' 
                    : 'Please share your feedback here...'}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="flex items-center gap-2 px-6 py-3 bg-[#2AA0BF] hover:bg-[#1e7a9a] 
                         text-white rounded-lg font-medium transition-colors duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitted ? (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    {isMalayalam ? 'സമർപ്പിച്ചു' : 'Submitted'}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {isMalayalam ? 'സമർപ്പിക്കുക' : 'Submit Feedback'}
                  </>
                )}
              </button>

              {submitted && (
                <p className="mt-4 text-green-600 dark:text-green-400">
                  {isMalayalam 
                    ? 'നന്ദി! നിങ്ങളുടെ ഫീഡ്‌ബാക്ക് സ്വീകരിച്ചു.' 
                    : 'Thank you! Your feedback has been received.'}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;


