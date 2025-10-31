import React, { useState, useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import BookmarkNavbar from "../components/BookmarkNavbar";
import StarNumber from "../components/StarNumber";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookmarkService from "../services/bookmarkService";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import { fetchSurahs } from "../api/apifunction";

// Custom Kaaba Icon Component (Makkah)
const KaabaIcon = ({ className }) => (
  <svg
    viewBox="0 0 11 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M1 4.05096L5.50813 6.87531M1 4.05096L5.50813 1.22656L10.0017 4.05096M1 4.05096V5.72135M5.50813 12.2306L1 9.44877V5.72135M5.50813 12.2306L10.0017 9.44877V5.72135M5.50813 12.2306V8.52443M5.50813 6.87531L10.0017 4.05096M5.50813 6.87531V8.52443M10.0017 4.05096V5.72135M10.0017 5.72135L5.50813 8.52443M5.50813 8.52443L1 5.72135"
      stroke="currentColor"
      strokeLinejoin="round"
    />
  </svg>
);

// Madina Icon Component
const MadinaIcon = ({ className }) => (
  <svg
    width="11"
    height="15"
    viewBox="0 0 11 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5.625 1.0498C5.96379 1.0415 6.15318 1.43447 5.9375 1.69434L5.93848 1.69531C5.8059 1.85727 5.73354 2.06001 5.7334 2.26953C5.73364 2.7733 6.13675 3.17749 6.63965 3.17773C6.8485 3.17752 7.05247 3.1038 7.21484 2.9707C7.35907 2.84911 7.5516 2.85714 7.68555 2.94922C7.82703 3.0465 7.89339 3.22605 7.83203 3.42188C7.62359 4.1963 6.95559 4.74982 6.16699 4.82324V4.96973C6.38842 5.29376 6.73956 5.57803 7.17188 5.86035C7.39553 6.00639 7.63673 6.14949 7.88672 6.29688C8.13549 6.44354 8.39372 6.59442 8.64746 6.75391C9.69542 7.41265 10.702 8.26832 10.7217 9.86133C10.7302 10.5552 10.5894 11.4633 9.97949 12.293C10.3948 12.3364 10.7226 12.6925 10.7227 13.1182V13.9834C10.7235 14.202 10.5466 14.3792 10.3281 14.3789V14.3799H1.21582C0.998036 14.379 0.822454 14.2011 0.823242 13.9834V13.1182C0.823351 12.6643 1.19496 12.2891 1.65039 12.2891H8.89941C9.63381 11.6946 9.91674 10.8407 9.93359 9.86035C9.95344 8.7001 9.20568 8.05633 8.22656 7.4209C7.99002 7.26739 7.75176 7.12838 7.51562 6.99219C7.28064 6.85666 7.04583 6.72296 6.82227 6.58398C6.43649 6.34416 6.0728 6.08117 5.77148 5.74121C5.46708 6.08406 5.09223 6.35958 4.7002 6.60547C4.47252 6.74826 4.23591 6.88329 4.00293 7.0166C3.76878 7.15058 3.53754 7.28322 3.31543 7.42285C2.42056 7.98548 1.62622 8.63485 1.61133 9.86523C1.6014 10.6849 1.83171 11.2575 2.07324 11.6484H2.07227C2.13777 11.7504 2.15412 11.8634 2.12402 11.9678C2.0949 12.0686 2.02647 12.1474 1.94727 12.1963C1.86807 12.2451 1.76716 12.2711 1.66406 12.252C1.55623 12.2319 1.46123 12.1657 1.39941 12.0596V12.0586C1.0886 11.5539 0.816533 10.8308 0.823242 9.8623C0.83371 8.36129 1.75222 7.45412 2.89844 6.75293C3.41821 6.43497 3.92281 6.1624 4.37598 5.86426C4.80764 5.58025 5.15748 5.29245 5.37891 4.9668V4.72949C4.62425 4.47414 4.07622 3.76183 4.07617 2.9209C4.07617 2.19418 4.55355 1.26045 5.59473 1.05273L5.61035 1.0498H5.625ZM1.62207 13.0869C1.61745 13.0916 1.61137 13.1013 1.61133 13.1182V13.5908H9.93457V13.1182C9.93452 13.1022 9.92888 13.093 9.92383 13.0879C9.91879 13.0828 9.90931 13.0771 9.89355 13.0771H1.65039C1.63521 13.0771 1.6266 13.0825 1.62207 13.0869ZM4.95801 2.47852C4.89845 2.61488 4.86542 2.76443 4.86523 2.9209L4.87109 3.03613C4.92841 3.60447 5.40474 4.04371 5.98926 4.04395C6.14409 4.04376 6.29155 4.00941 6.42676 3.95117C5.66139 3.85413 5.05306 3.24442 4.95801 2.47852Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.35469"
    />
  </svg>
);

const FavoriteSurahs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [favoriteSurahs, setFavoriteSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});

  // Load favorite surahs
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const favorites = await BookmarkService.getFavoriteSurahs(user.uid);
        
        // Fetch all surahs to get type information
        const allSurahs = await fetchSurahs();
        
        // Get surah type information
        const favoritesWithType = favorites.map((fav) => {
          // Find the surah in the fetched surahs list
          const surahInfo = allSurahs.find(s => s.number === fav.surahId);
          
          return {
            id: fav.id || `fav_${fav.surahId}`,
            favoriteId: fav.id,
            number: fav.surahId,
            name: surahInfo?.name || fav.surahName || `Surah ${fav.surahId}`,
            surahId: fav.surahId,
            type: surahInfo?.type || 'Makki'
          };
        });
        
        setFavoriteSurahs(favoritesWithType);
      } catch (err) {
        console.error("Error loading favorites:", err);
        setError("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const handleDelete = async (favoriteId, surahId) => {
    if (!user) return;

    try {
      const favoriteKey = `${favoriteId}-${surahId}`;
      setDeleteLoading(prev => ({ ...prev, [favoriteKey]: true }));
      
      await BookmarkService.deleteFavoriteSurah(user.uid, surahId);
      
      // Remove from local state
      setFavoriteSurahs(prev => 
        prev.filter(fav => fav.surahId !== surahId)
      );
      
      showSuccess("Surah removed from favorites");
      console.log("Favorite removed successfully");
    } catch (error) {
      console.error("Error deleting favorite:", error);
      showError("Failed to delete favorite. Please try again.");
    } finally {
      const favoriteKey = `${favoriteId}-${surahId}`;
      setDeleteLoading(prev => ({ ...prev, [favoriteKey]: false }));
    }
  };

  const handleSurahClick = (surahId) => {
    navigate(`/surah/${surahId}`);
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Sign in to view favorite surahs
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please sign in to favorite surahs and access your saved chapters.
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
              <p className="text-gray-600 dark:text-gray-400">Loading favorites...</p>
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
  if (favoriteSurahs.length === 0) {
    return (
      <>
        <BookmarkNavbar />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <div className="mx-auto p-3 sm:p-4 lg:p-6 min-h-screen bg-white dark:bg-black font-poppins">
          <div className="w-full max-w-[1290px] mx-auto">
            <div className="text-center py-12">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  No favorite surahs yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start reading and favorite your favorite surahs to see them here.
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
            {favoriteSurahs.map((surah) => {
              const favoriteKey = `${surah.favoriteId}-${surah.surahId}`;
              const surahIcon = surah.type === 'Makki' ? (
                <KaabaIcon className="h-4 w-4 flex-shrink-0 text-[#3FA5C0]" />
              ) : (
                <MadinaIcon className="h-4 w-4 flex-shrink-0 text-[#3FA5C0]" />
              );

              return (
                <div
                  key={surah.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleSurahClick(surah.surahId)}
                >
                  {/* Left Section - Surah Info */}
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <StarNumber number={surah.number} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                        {surah.number}. {surah.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {surahIcon}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {surah.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(surah.favoriteId, surah.surahId);
                    }}
                    disabled={deleteLoading[favoriteKey]}
                    className="p-2 text-red-500 dark:text-red-400 dark:hover:bg-transparent hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Remove from favorites"
                  >
                    {deleteLoading[favoriteKey] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-current"></div>
                    ) : (
                      <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-current" />
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

export default FavoriteSurahs;

