import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import BookmarkNavbar from "../components/BookmarkNavbar";
import StarNumber from "../components/StarNumber";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookmarkService from "../services/bookmarkService";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";

const BookVerse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [bookmarkedVerses, setBookmarkedVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});

  // Load bookmarked verses
  useEffect(() => {
    const loadBookmarks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const bookmarks = await BookmarkService.getBookmarks(user.uid, 'translation');
        
        // Format bookmarks for display
        const formattedBookmarks = bookmarks.map(bookmark => ({
          id: bookmark.id || `${bookmark.surahId}-${bookmark.verseId}`,
          bookmarkId: bookmark.id,
          number: bookmark.surahId,
          surah: bookmark.surahName || `Surah ${bookmark.surahId}`,
          ayah: `Ayah ${bookmark.verseId}`,
          verseText: bookmark.verseText || '',
          surahId: bookmark.surahId,
          verseId: bookmark.verseId
        }));
        
        setBookmarkedVerses(formattedBookmarks);
      } catch (err) {
        console.error("Error loading bookmarks:", err);
        setError("Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [user]);

  const handleDelete = async (bookmarkId, verseKey) => {
    if (!user) return;

    try {
      setDeleteLoading(prev => ({ ...prev, [verseKey]: true }));
      
      await BookmarkService.deleteBookmark(bookmarkId, user.uid);
      
      // Remove from local state
      setBookmarkedVerses(prev => 
        prev.filter(bookmark => bookmark.bookmarkId !== bookmarkId)
      );
      
      showSuccess("Bookmark deleted successfully");
      console.log("Bookmark deleted successfully");
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      showError("Failed to delete bookmark. Please try again.");
    } finally {
      setDeleteLoading(prev => ({ ...prev, [verseKey]: false }));
    }
  };

  const handleVerseClick = (surahId, verseId) => {
    navigate(`/surah/${surahId}#verse-${verseId}`);
  };

  // Show sign-in message if user is not authenticated
  if (!user) {
    return (
      <>
        <BookmarkNavbar />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <div className="mx-auto p-3 sm:p-4 lg:p-6 min-h-screen bg-white dark:bg-gray-900 font-poppins">
          <div className="w-full max-w-[1290px] mx-auto">
            <div className="text-center py-12">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Sign in to view bookmarks
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please sign in to bookmark verses and access your saved content.
                </p>
                <button
                  onClick={() => navigate('/sign')}
                  className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <>
        <BookmarkNavbar />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <div className="mx-auto p-3 sm:p-4 lg:p-6 min-h-screen bg-white dark:bg-gray-900 font-poppins">
          <div className="w-full max-w-[1290px] mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading bookmarks...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <BookmarkNavbar />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <div className="mx-auto p-3 sm:p-4 lg:p-6 min-h-screen bg-white dark:bg-gray-900 font-poppins">
          <div className="w-full max-w-[1290px] mx-auto">
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Empty state
  if (bookmarkedVerses.length === 0) {
    return (
      <>
        <BookmarkNavbar />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <div className="mx-auto p-3 sm:p-4 lg:p-6 min-h-screen bg-white dark:bg-black font-poppins">
          <div className="w-full max-w-[1290px] mx-auto">
            <div className="text-center py-12">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  No bookmarks yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start reading and bookmark your favorite verses to see them here.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
                >
                  Start Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BookmarkNavbar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="mx-auto p-3 sm:p-4 lg:p-6 min-h-screen bg-white dark:bg-gray-900 font-poppins">
        <div className="w-full max-w-[1290px] mx-auto">

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {bookmarkedVerses.map((verse) => {
              const verseKey = `${verse.surahId}-${verse.verseId}`;
              return (
                <div
                  key={verse.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleVerseClick(verse.surahId, verse.verseId)}
                >
                  {/* Left Section - Verse Info */}
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <StarNumber number={verse.number} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                        {verse.surah}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-white truncate">
                        {verse.ayah}
                      </p>
                      {verse.verseText && (
                        <p className="text-xs text-gray-400 dark:text-white mt-1 line-clamp-2">
                          {verse.verseText.length > 100 
                            ? `${verse.verseText.substring(0, 100)}...` 
                            : verse.verseText
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Section - Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(verse.bookmarkId, verseKey);
                    }}
                    disabled={deleteLoading[verseKey]}
                    className="p-2 text-black dark:text-white dark:hover:bg-transparent hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Delete bookmark"
                  >
                    {deleteLoading[verseKey] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-current"></div>
                    ) : (
                      <Trash2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookVerse;