import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import BookmarkNavbar from "../components/BookmarkNavbar";
import { ArrowLeft } from "lucide-react";
import StarNumber from "../components/StarNumber";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookmarkService from "../services/bookmarkService";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import AyahModal from "../components/AyahModal";
import BlockInterpretationModal from "../components/BlockInterpretationModal";

const BookInterpretations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const [ayahWiseInterpretations, setAyahWiseInterpretations] = useState([]);
  const [blockWiseInterpretations, setBlockWiseInterpretations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [showAyahModal, setShowAyahModal] = useState(false);
  const [selectedInterpretation, setSelectedInterpretation] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedBlockInterpretation, setSelectedBlockInterpretation] =
    useState(null);

  // Load bookmarked interpretations
  useEffect(() => {
    const loadBookmarks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Load both types of interpretation bookmarks
        const [ayahBookmarks, blockBookmarks] = await Promise.all([
          BookmarkService.getBookmarks(user.uid, "interpretation"),
          BookmarkService.getBookmarks(user.uid, "block-interpretation"),
        ]);

        // Format ayah-wise bookmarks
        const formattedAyahBookmarks = ayahBookmarks.map((bookmark) => {
          const interpretationNo = bookmark.interpretationNo || 1;
          const language = (bookmark.language || "en").toLowerCase();

          return {
            id: bookmark.id || `${bookmark.surahId}-${bookmark.verseId}`,
            bookmarkId: bookmark.id,
            number: bookmark.surahId,
            surah: bookmark.surahName || `Surah ${bookmark.surahId}`,
            // Show exact ayah + interpretation number + language
            detail: `Ayah ${bookmark.verseId} • Interpretation ${interpretationNo} • ${language.toUpperCase()}`,
            verseText: bookmark.verseText || "",
            surahId: bookmark.surahId,
            verseId: bookmark.verseId,
            interpretationNo,
            language,
          };
        });

        // Format block-wise bookmarks
        const formattedBlockBookmarks = blockBookmarks.map((bookmark) => {
          const interpretationNo = bookmark.interpretationNo || 1;
          const language = (bookmark.language || "en").toLowerCase();

          return {
            id: bookmark.id || `${bookmark.surahId}-${bookmark.range}`,
            bookmarkId: bookmark.id,
            number: bookmark.surahId,
            surah: bookmark.surahName || `Surah ${bookmark.surahId}`,
            // Show exact block range + interpretation number + language
            detail: `Verses ${bookmark.range} • Interpretation ${interpretationNo} • ${language.toUpperCase()}`,
            verseText: "",
            surahId: bookmark.surahId,
            range: bookmark.range, // This is the key difference!
            interpretationNo,
            language,
          };
        });

        setAyahWiseInterpretations(formattedAyahBookmarks);
        setBlockWiseInterpretations(formattedBlockBookmarks);
      } catch (err) {
        console.error("Error loading interpretation bookmarks:", err);
        setError("Failed to load interpretation bookmarks");
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [user]);

  const handleDelete = async (bookmarkId, type) => {
    if (!user) return;

    try {
      setDeleteLoading((prev) => ({ ...prev, [bookmarkId]: true }));

      await BookmarkService.deleteBookmark(bookmarkId, user.uid);

      // Remove from local state
      if (type === "ayah-wise") {
        setAyahWiseInterpretations((prev) =>
          prev.filter((bookmark) => bookmark.bookmarkId !== bookmarkId)
        );
      } else {
        setBlockWiseInterpretations((prev) =>
          prev.filter((bookmark) => bookmark.bookmarkId !== bookmarkId)
        );
      }

      showSuccess("Interpretation bookmark deleted successfully");
    } catch (error) {
      console.error("Error deleting interpretation bookmark:", error);
      showError("Failed to delete bookmark. Please try again.");
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [bookmarkId]: false }));
    }
  };

  const handleInterpretationClick = (interpretation) => {
    if (interpretation.range) {
      // Has range = Block-wise → Show BlockInterpretationModal
      setSelectedBlockInterpretation({
        surahId: interpretation.surahId,
        range: interpretation.range,
        interpretationNo: interpretation.interpretationNo || 1,
        language: interpretation.language || "en",
      });
      setShowBlockModal(true);
    } else {
      // No range = Ayah-wise → Show AyahModal
      setSelectedInterpretation({
        surahId: interpretation.surahId,
        verseId: interpretation.verseId,
      });
      setShowAyahModal(true);
    }
  };

  const handleAyahModalClose = () => {
    setShowAyahModal(false);
    setSelectedInterpretation(null);
  };

  const handleBlockModalClose = () => {
    setShowBlockModal(false);
    setSelectedBlockInterpretation(null);
  };

  const renderInterpretationCard = (interpretation, type) => (
    <div
      key={interpretation.id}
      className="flex items-center font-poppins justify-between p-3 sm:p-4 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={() => handleInterpretationClick(interpretation)} // Pass the entire interpretation object
    >
      {/* Left Section - Interpretation Info */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
        <div className="flex-shrink-0">
          <StarNumber number={interpretation.number} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
            {interpretation.surah}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
            {interpretation.detail}
          </p>
          {interpretation.verseText && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
              {interpretation.verseText.length > 100
                ? `${interpretation.verseText.substring(0, 100)}...`
                : interpretation.verseText}
            </p>
          )}
        </div>
      </div>

      {/* Right Section - Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(interpretation.bookmarkId, type);
        }}
        disabled={deleteLoading[interpretation.bookmarkId]}
        className="p-2 text-black dark:text-white dark:hover:bg-transparent hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Delete interpretation bookmark"
      >
        {deleteLoading[interpretation.bookmarkId] ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b border-current"></div>
        ) : (
          <Trash2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        )}
      </button>
    </div>
  );

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
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Sign in to view interpretation bookmarks
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please sign in to bookmark interpretations and access your
                  saved content.
                </p>
                <button
                  onClick={() => navigate("/sign")}
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
              <p className="text-gray-600 dark:text-gray-400">
                Loading interpretation bookmarks...
              </p>
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
          <div className="w-full max-w-[1290px] mx_auto">
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400 text-lg mb-4">
                {error}
              </p>
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
  if (
    ayahWiseInterpretations.length === 0 &&
    blockWiseInterpretations.length === 0
  ) {
    return (
      <>
        <BookmarkNavbar />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <div className="mx-auto p-3 sm:p-4 lg:p-6 min-h-screen bg-white dark:bg-gray-900 font-poppins">
          <div className="w_full max-w-[1290px] mx_auto">
            <div className="text-center py-12">
              <div className="mb-6">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  No interpretation bookmarks yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start reading verses with interpretations and bookmark them to
                  see them here.
                </p>
                <button
                  onClick={() => navigate("/")}
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
      <div className="mx-auto min-h-screen p-3 sm:p-4 lg:p-6 bg-white dark:bg-gray-900">
        <div className="w-full max-w-[1290px] mx-auto">
          <div className="space-y-6 sm:space-y-8">
            {/* Ayah wise interpretations section */}
            {ayahWiseInterpretations.length > 0 && (
              <div>
                <h2 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 sm:mb-4 dark:text-white">
                  Ayah wise interpretations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid_cols-3 xl:grid_cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {ayahWiseInterpretations.map((interpretation) =>
                    renderInterpretationCard(interpretation, "ayah-wise")
                  )}
                </div>
              </div>
            )}

            {/* Block wise interpretations section */}
            {blockWiseInterpretations.length > 0 && (
              <div>
                <h2 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 sm:mb-4 dark:text-white">
                  Block wise interpretations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid_cols-3 xl:grid_cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {blockWiseInterpretations.map((interpretation) =>
                    renderInterpretationCard(interpretation, "block-wise")
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ayah Modal for Interpretation */}
      {showAyahModal && selectedInterpretation && (
        <AyahModal
          surahId={selectedInterpretation.surahId}
          verseId={selectedInterpretation.verseId}
          onClose={handleAyahModalClose}
        />
      )}

      {/* Block Interpretation Modal */}
      {showBlockModal && selectedBlockInterpretation && (
        <BlockInterpretationModal
          surahId={selectedBlockInterpretation.surahId}
          range={selectedBlockInterpretation.range}
          interpretationNo={selectedBlockInterpretation.interpretationNo}
          language={selectedBlockInterpretation.language}
          onClose={handleBlockModalClose}
        />
      )}
    </>
  );
};

export default BookInterpretations;
