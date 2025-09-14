import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { ArrowLeft, Sun } from "lucide-react";
import {
  auth,
  googleProvider,
  appleProvider,
  signInWithPopup,
} from "../firebase";
import { useAuth } from "../context/AuthContext";

const Sign = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if already signed in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Show loading while checking auth state
  if (user) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User signed in:", result.user);
      // Navigation will be handled by useEffect when user state changes
    } catch (error) {
      console.error("Error signing in:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, appleProvider);
      console.log("User signed in with Apple:", result.user);
      // Navigation will be handled by useEffect when user state changes
    } catch (error) {
      console.error("Error signing in with Apple:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Main Content Container */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        {/* Welcome Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl font-poppins sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm lg:text-base font-poppins dark:text-white px-2">
            The unified registration of{" "}
            <span className="font-bold font-poppins">Thafheem ul Quran</span>
          </p>
        </div>

        {/* Features Card */}
        <div className="bg-white rounded-2xl shadow-sm border dark:bg-black border-gray-200 p-4 sm:p-6 w-full sm:max-w-[450px] max-w-[350px] min-h-[250px] sm:min-h-[293px] mx-auto mb-6 sm:mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              src={logo}
              alt="Thafheem ul Quran"
              className="h-12 w-24 sm:h-[66px] sm:w-[145px] object-contain"
            />
          </div>

          {/* Features List */}
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm dark:text-white text-black">
            <div className="flex items-center justify-between space-x-1 sm:space-x-2">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-white flex-shrink-0" />
                <span className="text-black dark:text-white font-poppins sm:text-[14px]">
                  New! Notes & Reflections
                </span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-white flex-shrink-0" />
                <span className="text-black dark:text-white font-poppins sm:text-[14px]">
                  Create collections
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between space-x-1 sm:space-x-2 text-black">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-white flex-shrink-0" />
                <span className="dark:text-white font-poppins sm:text-[14px]">
                  Sync your data across browsers
                </span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-white flex-shrink-0" />
                <span className="dark:text-white font-poppins sm:text-[14px]">
                  Create collections
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between space-x-1 sm:space-x-2">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-white flex-shrink-0" />
                <span className="text-black dark:text-white font-poppins sm:text-[14px]">
                  New! Notes & Reflections
                </span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-white flex-shrink-0" />
                <span className="text-black dark:text-white font-poppins sm:text-[14px]">
                  Create collections
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between space-x-1 sm:space-x-2">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-white flex-shrink-0" />
                <span className="text-black dark:text-white font-poppins sm:text-[14px]">
                  New! Notes & Reflections
                </span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-white flex-shrink-0" />
                <span className="text-black dark:text-white font-poppins sm:text-[14px]">
                  Create collections
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between space-x-1 sm:space-x-2">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-white flex-shrink-0" />
                <span className="text-black dark:text-white font-poppins sm:text-[14px]">
                  New! Notes & Reflections
                </span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-white flex-shrink-0" />
                <span className="text-black dark:text-white font-poppins sm:text-[14px]">
                  Create collections
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sign In Section */}
        <div className="text-center mb-6">
          <p className="text-black dark:text-white text-xs sm:text-sm mb-4 font-poppins sm:text-[14px]">
            Sign in or Sign up now:
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm text-center">
                {error}
              </p>
            </div>
          )}

          {/* Sign In Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full max-w-[410px] mx-auto flex items-center justify-center space-x-3 px-4 py-3 bg-[#EEEEEE] dark:hover:bg-[#373737] dark:bg-[#373737] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              ) : (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span className="text-black font-medium dark:text-white text-sm sm:text-base font-poppins">
                {loading ? "Signing in..." : "Continue with Google"}
              </span>
            </button>

            <button
              onClick={handleAppleSignIn}
              disabled={loading}
              className="w-full max-w-[410px] mx-auto flex items-center justify-center space-x-3 px-4 py-3 bg-[#EEEEEE] dark:hover:bg-[#373737] dark:bg-[#373737] text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span className="font-medium text-black dark:text-white text-sm sm:text-base font-poppins">
                Continue with Apple
              </span>
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center space-x-2 text-cyan-500 hover:text-cyan-600 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="text-center px-4">
          <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto font-poppins">
            Protecting your privacy is our priority — By signing up, you consent
            to our
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sign;
