import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotePopup from "../components/NotePopup";
import { fetchNoteById } from "../api/apifunction";
import { useTheme } from "../context/ThemeContext";

const Note = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { translationLanguage } = useTheme();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNoteById(id);
        if (!mounted) return;
        setContent(data);
        // Trigger entry animation after content loads
        setTimeout(() => setIsVisible(true), 50);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || "Failed to load note");
        setTimeout(() => setIsVisible(true), 50);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const resolveHtml = () => {
    if (typeof content === "string") return content;
    if (content && typeof content === "object") {
      return content.NoteText || content.html || content.content || content.text || JSON.stringify(content);
    }
    return "<p>No content</p>";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#2A2C38]">
      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-slide-in-up {
            animation: slideInUp 0.4s ease-out forwards;
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}
      </style>
      <div className={`max-w-4xl mx-auto p-6 transition-all duration-300 ${isVisible ? 'animate-slide-in-up' : 'opacity-0'}`}>
        <div className="mb-6">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-[#2596be] to-[#62C3DC] bg-clip-text text-transparent">
            Note {id}
          </h1>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12 animate-fade-in">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#2596be] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Loading note...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 animate-fade-in">
            <p className="font-medium">Error loading note</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-white bg-white dark:bg-[#1F2937] p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in"
            dangerouslySetInnerHTML={{ __html: resolveHtml() }}
            style={{
              fontFamily: translationLanguage === 'hi' ? 'NotoSansDevanagari, sans-serif' :
                translationLanguage === 'ur' ? 'JameelNoori, sans-serif' :
                  translationLanguage === 'bn' ? 'SutonnyMJ, sans-serif' :
                    translationLanguage === 'ta' ? 'Bamini, sans-serif' :
                      translationLanguage === 'mal' ? 'Noto Sans Malayalam, sans-serif' :
                        'Poppins, sans-serif',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Note;


