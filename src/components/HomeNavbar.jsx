import { useState, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  Settings,
  Moon,
  Sun,
  Languages,
  Bookmark,
  X,
  Home,
  FileText,
  User,
  BookOpen,
  Info,
  Zap,
  Heart,
  Download,
  Sparkles,
  Bug,
  Share,
  Users,
  UserCheck,
  Mail,
  MessageSquare,
  Shield,
  HelpCircle,
  Trash2,
  LogOut,
  ChevronRight,
  BookA,
  Book,
  LaptopMinimal,
  BookUser,
  BookType,
  BookOpenCheck,
  LetterText,
  MessageCircleQuestion,
  CircleAlert,
  MessageSquareMore,
  UserX,
  ChevronDown,
  Copy,
  ExternalLink,
  Send,
  FolderOpen,
} from "lucide-react";
import logo from "../assets/logo.png";
import logoBlack from "../assets/logo-black.png";
import logoWhite from "../assets/logo-white.png";
import { useNavigate, useLocation } from "react-router-dom";
import Transition from "./Transition";
import SearchConsole from "./SearchConsole";
import LanguageConsole from "./LanguageConsole";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import SettingsDrawer from "../pages/Settings";

const HomepageNavbar = () => {
  const { theme, toggleTheme, setViewType, translationLanguage, setTranslationLanguage } = useTheme();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState(0);

  const navRef = useRef(null);
  const lastScrollY = useRef(0);

  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const isReaderPage =
    location.pathname.startsWith("/reading") ||
    location.pathname.startsWith("/surah") ||
    location.pathname.startsWith("/blockwise");
  const isBookmarkPage =
    location.pathname.startsWith("/bookmark") ||
    location.pathname.startsWith("/bookmarked") ||
    location.pathname.startsWith("/favorite");
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSubmenu = (index) =>
    setOpenSubmenu(openSubmenu === index ? null : index);

  // Resolve share URL from env or current origin
  const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || window.location.origin;

  // Share App handler (uses Web Share API with clipboard/modal fallback)
  const handleShareApp = async () => {
    const shareUrl = `${PUBLIC_URL}/`;
    const shareData = {
      title: "Thafheem ul Quran",
      text: "Explore Thafheem ul Quran",
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        setIsShareOpen(true);
      }
    } catch (error) {
      console.error("Share failed:", error);
      setIsShareOpen(true);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut(auth);
      navigate("/"); // Redirect to home page after successful logout
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Redirect away from Blockwise when language doesn't support it
  useEffect(() => {
    // Languages without Blockwise support
    const noBlockwise = new Set(["ta", "hi", "bn", "ur"]);
    if (location.pathname.startsWith("/blockwise/") && noBlockwise.has(translationLanguage)) {
      const match = location.pathname.match(/\/blockwise\/(\d+)/);
      const currentSurahId = match ? match[1] : undefined;
      if (currentSurahId) {
        navigate(`/surah/${currentSurahId}`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [translationLanguage, location.pathname, navigate]);

  const handleAuthButtonClick = () => {
    if (user) {
      handleSignOut();
    } else {
      navigate("/sign");
    }
  };

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Table of Contents", path: "/tablecontents" },
    { icon: FileText, label: "Sayyid Maududi", path: "/maududi" },
    { icon: BookA, label: "English Translation", path: "/englishtranslate" },
    {
      icon: Book,
      label: "Introduction",
      path: "/authorpreface",
      hasSubmenu: true,
      hasArrow: true,
      submenuItems: [
        { label: "Author's Preface", path: "/authorpreface" },
        { label: "Author's Conclusion", path: "/authorconclusion" },
      ],
    },
    {
      icon: FolderOpen,
      label: "Appendix",
      path: "/appendix/english",
      hasSubmenu: true,
      hasArrow: true,
      submenuItems: [
        { label: "Malayalam Appendix", path: "/appendix/malayalam" },
        { label: "English Appendix", path: "/appendix/english" },
      ],
    },
    { icon: LaptopMinimal, label: "Digitisation", path: "/digitisation" },
    { icon: BookType, label: "Tajwid", path: "/tajweed" },
    { icon: BookOpenCheck, label: "Quiz", path: "/quiz" },
    { icon: LetterText, label: "Drag & drop", path: "/dragdrop" },
    { icon: Sparkles, label: "What's New", path: "/whatsnew" },
    { icon: MessageCircleQuestion, label: "Share App", onClick: handleShareApp },
    { icon: User, label: "About Us", path: "/about" },
    { icon: MessageSquareMore, label: "Contact Us", path: "/contact" },
    { icon: Shield, label: "Privacy", path: "/privacy" },
  ];

  const dangerMenuItems = [
    {
      icon: UserX,
      label: "Delete Account",
      path: "/deleteaccount",
      isDanger: true,
    },
    { icon: LogOut, label: "Log Out", path: "/logout", isDanger: true },
  ];

  // Helper function to determine if a menu item is active
  const isActive = (path) => location.pathname === path;
  const handleBookmarkClick = () => {
    // Navigate to bookmarks page - users can then click on their preferred tab
    navigate("/bookmarkedverses");
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateNavbarHeight = () => {
      if (navRef.current) {
        setNavbarHeight(navRef.current.offsetHeight || 0);
      }
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    lastScrollY.current = window.scrollY;
    setIsNavbarVisible(true);

    if (!isReaderPage) {
      return;
    }

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = Math.abs(currentScroll - lastScrollY.current);

      if (delta < 4) {
        return;
      }

      let nextVisible = true;

      if (currentScroll < 80) {
        nextVisible = true;
      } else if (currentScroll > lastScrollY.current) {
        nextVisible = false;
      } else {
        nextVisible = true;
      }

      setIsNavbarVisible((prev) => (prev === nextVisible ? prev : nextVisible));
      lastScrollY.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isReaderPage, location.pathname]);
  return (
    <>
      {/* Share Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsShareOpen(false)}></div>
          <div className="relative z-10 w-full max-w-sm rounded-lg bg-white dark:bg-[#2A2C38] p-4 shadow-xl">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Share className="w-5 h-5" /> Share Thafheem
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Invite others with your favorite app or copy the link.</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const url = `${PUBLIC_URL}/`;
                  const text = encodeURIComponent("Explore Thafheem ul Quran");
                  const u = encodeURIComponent(url);
                  window.open(`https://wa.me/?text=${text}%20${u}`, "_blank");
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-[#25D366] text-white hover:opacity-90 transition"
              >
                <Send className="w-4 h-4" /> WhatsApp
              </button>
              <button
                onClick={() => {
                  const url = `${PUBLIC_URL}/`;
                  const text = encodeURIComponent("Explore Thafheem ul Quran");
                  const u = encodeURIComponent(url);
                  window.open(`https://t.me/share/url?url=${u}&text=${text}`, "_blank");
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-[#229ED9] text-white hover:opacity-90 transition"
              >
                <ExternalLink className="w-4 h-4" /> Telegram
              </button>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={`${PUBLIC_URL}/`}
                  className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100"
                />
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(`${PUBLIC_URL}/`);
                    alert("Link copied to clipboard");
                  }}
                  className="px-3 py-2 rounded-md bg-gray-900 text-white dark:bg-gray-700 hover:opacity-90 transition flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
              </div>
              <button
                onClick={() => setIsShareOpen(false)}
                className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Search Console Popup */}
      {isSearchOpen && (
        <SearchConsole onClose={() => setIsSearchOpen(false)} />
      )}

      {/* Language Console Popup */}
      {isLanguageOpen && (
        <LanguageConsole
          onClose={() => setIsLanguageOpen(false)}
          selectedLanguage={
            translationLanguage === 'E' ? 'English' :
              translationLanguage === 'ta' ? 'Tamil' :
                translationLanguage === 'hi' ? 'Hindi' :
                  translationLanguage === 'ur' ? 'Urdu' :
                    translationLanguage === 'bn' ? 'Bangla' :
                      'Malayalam'
          }
          onLanguageSelect={(lang) => {
            // Map UI selection to API language codes
            let code = 'mal'; // default to Malayalam
            if (lang.code?.toLowerCase() === 'en') {
              code = 'E';
            } else if (lang.code?.toLowerCase() === 'ta') {
              code = 'ta';
            } else if (lang.code?.toLowerCase() === 'hi') {
              code = 'hi';
            } else if (lang.code?.toLowerCase() === 'ur') {
              code = 'ur';
            } else if (lang.code?.toLowerCase() === 'bn') {
              code = 'bn';
            }
            setTranslationLanguage(code);
            setIsLanguageOpen(false);
          }}
        />
      )}

      <nav
        ref={navRef}
        className={`bg-white/95 dark:bg-[#2A2C38]/95 backdrop-blur-md w-full z-[80] border-b border-gray-200/50 dark:border-gray-700/50 ${isReaderPage ? "shadow-none" : "shadow-lg shadow-gray-200/50 dark:shadow-black/20"
          } sticky top-0 transition-all duration-300 ${isReaderPage && !isNavbarVisible ? "-translate-y-full" : ""
          }`}
      >
        <div
          className={`flex items-center justify-between px-3 sm:px-4 ${isReaderPage ? "py-2 sm:py-2.5" : "py-2.5 sm:py-3"
            }`}
        >
          {/* Left side */}
          <div className="flex items-center space-x-2 sm:space-x-3 ml-2 sm:ml-4">
            <button
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="group relative flex items-center space-x-2 p-2 sm:px-3 sm:py-2 
             text-gray-700 dark:text-gray-200 
             hover:text-[#2596be] dark:hover:text-[#62C3DC] 
             hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 
             dark:hover:bg-gradient-to-br dark:hover:from-gray-800 dark:hover:to-gray-700 
             rounded-xl transition-all duration-300 ease-out
             min-h-[44px] min-w-[44px] justify-center 
             sm:min-h-auto sm:min-w-auto sm:justify-start
             hover:shadow-md hover:scale-105 active:scale-95"
              title={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu size={18} className="sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-180" />
            </button>

            {(location.pathname === '/' || location.pathname.startsWith('/reading') || location.pathname.startsWith('/surah') || location.pathname.startsWith('/blockwise') || isBookmarkPage) && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105 active:scale-95"
                aria-label="Go to home page"
              >
                <img
                  src={theme === 'dark' ? logoWhite : logoBlack}
                  alt="Thafheem ul Quran"
                  className="h-7 sm:h-8 w-auto select-none drop-shadow-sm"
                  draggable="false"
                />
              </button>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5 sm:gap-2 mr-1 sm:mr-4">
            {/* Language Button */}
            <button
              onClick={() => setIsLanguageOpen(true)}
              aria-label="Change language"
              className="group relative p-2 sm:p-2.5 text-gray-700 dark:text-gray-200 
                hover:text-white hover:bg-gradient-to-br hover:from-[#62C3DC] hover:to-[#3FA6C0] 
                dark:hover:from-[#3FA6C0] dark:hover:to-[#2596be] 
                rounded-xl transition-all duration-300 ease-out
                min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] 
                flex items-center justify-center
                hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-110 active:scale-95"
              title="Change language"
            >
              <Languages size={15} className="sm:w-[18px] sm:h-[18px] transition-all duration-300 group-hover:rotate-12" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="group relative p-2 sm:p-2.5 text-gray-700 dark:text-gray-200 
                hover:text-white hover:bg-gradient-to-br hover:from-[#62C3DC] hover:to-[#3FA6C0] 
                dark:hover:from-[#3FA6C0] dark:hover:to-[#2596be] 
                rounded-xl transition-all duration-300 ease-out
                min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] 
                flex items-center justify-center
                hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-110 active:scale-95"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun size={15} className="sm:w-[18px] sm:h-[18px] transition-all duration-300 group-hover:rotate-180" />
              ) : (
                <Moon size={15} className="sm:w-[18px] sm:h-[18px] transition-all duration-300 group-hover:-rotate-12" />
              )}
            </button>

            {/* Bookmark Button - Only show when user is logged in */}
            {user && (
              <button
                onClick={handleBookmarkClick}
                aria-label="View bookmarks"
                className="group relative p-2 sm:p-2.5 text-gray-700 dark:text-gray-200 
                  hover:text-white hover:bg-gradient-to-br hover:from-[#62C3DC] hover:to-[#3FA6C0] 
                  dark:hover:from-[#3FA6C0] dark:hover:to-[#2596be] 
                  rounded-xl transition-all duration-300 ease-out
                  min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] 
                  flex items-center justify-center
                  hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-110 active:scale-95"
                title="View bookmarks"
              >
                <Bookmark size={15} className="sm:w-[18px] sm:h-[18px] transition-all duration-300 group-hover:scale-110 group-hover:fill-current" />
              </button>
            )}

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Open settings"
              className="group relative p-2 sm:p-2.5 text-gray-700 dark:text-gray-200 
                hover:text-white hover:bg-gradient-to-br hover:from-[#62C3DC] hover:to-[#3FA6C0] 
                dark:hover:from-[#3FA6C0] dark:hover:to-[#2596be] 
                rounded-xl transition-all duration-300 ease-out
                min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] 
                flex items-center justify-center
                hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-110 active:scale-95"
              title="Open settings"
            >
              <Settings size={18} className="transition-all duration-300 group-hover:rotate-90" />
            </button>
            {isSettingsOpen && (
              <SettingsDrawer onClose={() => setIsSettingsOpen(false)} />
            )}

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="group relative p-2 sm:p-2.5 text-gray-700 dark:text-gray-200 
                hover:text-white hover:bg-gradient-to-br hover:from-[#62C3DC] hover:to-[#3FA6C0] 
                dark:hover:from-[#3FA6C0] dark:hover:to-[#2596be] 
                rounded-xl transition-all duration-300 ease-out
                min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] 
                flex items-center justify-center
                hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-110 active:scale-95"
              title="Search"
            >
              <Search size={15} className="sm:w-[18px] sm:h-[18px] transition-all duration-300 group-hover:scale-110" />
            </button>

            {/* Auth Button */}
            {user ? (
              <button
                onClick={handleAuthButtonClick}
                disabled={isSigningOut}
                className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 
                  rounded-full text-red-500 
                  hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 
                  dark:hover:from-red-900/40 dark:hover:to-red-800/40 
                  transition-all duration-300 ease-out
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:shadow-lg hover:shadow-red-500/30 hover:scale-110 active:scale-95"
                title="Sign out"
              >
                {isSigningOut ? (
                  <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                )}
              </button>
            ) : (
              <button
                onClick={handleAuthButtonClick}
                className="group relative px-3 py-1.5 xs:px-4 sm:px-5 xs:py-2 sm:py-2.5 text-[9px] xs:text-xs sm:text-sm 
                  bg-white dark:bg-[#2A2C38] 
                  text-[#2596be] dark:text-[#62C3DC] 
                  border border-[#2596be]/30 dark:border-[#62C3DC]/30 
                  hover:bg-gradient-to-r hover:from-[#2596be] hover:to-[#1e7a9a] 
                  hover:text-white hover:border-[#2596be]
                  rounded-xl transition-all duration-300 ease-out
                  font-medium whitespace-nowrap
                  shadow-sm hover:shadow-md hover:shadow-cyan-500/20 
                  hover:scale-[1.02] active:scale-[0.98]
                  overflow-hidden min-h-[32px] xs:min-h-[36px] sm:min-h-[40px] 
                  flex items-center justify-center
                  backdrop-blur-sm"
                title="Sign in"
              >
                <span className="relative z-10 hidden xs:inline font-semibold text-sm sm:text-base">Sign In</span>
                <span className="relative z-10 xs:hidden text-[9px] font-semibold">Sign</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#62C3DC] to-[#2596be] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Route-scoped dropdown bar under the navbar (only on reading/surah/blockwise) - Made STICKY */}
      {isReaderPage && (
        <div
          className="sticky z-[70] transition-all duration-300"
          style={{ top: isNavbarVisible ? navbarHeight : 0 }}
        >
          <Transition showPageInfo={false} />
        </div>
      )}

      {/* Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[80]">
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/70"
            onClick={toggleMenu}
          ></div>
          <div className="absolute left-0 top-0 h-full max-w-[280px] sm:max-w-[300px] md:w-72 bg-white dark:bg-[#2A2C38] shadow-lg overflow-y-auto">
            <div className="flex flex-col items-start p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between w-full mb-4 mt-15 border-b border-gray-200 dark:border-gray-700 pb-2">
                <img
                  src={theme === 'dark' ? logoWhite : logoBlack}
                  alt="Thafheemul Quran"
                  className="h-10 sm:h-12 w-auto"
                />
                <button
                  onClick={() => window.open('https://app.thafheem.net/', '_blank')}
                  className="flex items-center gap-2 px-3 py-2 bg-[#2596be] hover:bg-[#1e7a9a] text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Donate Now</span>
                </button>
                {/* Uncomment if you want to re-enable the close button */}
                {/* <button
                  onClick={toggleMenu}
                  className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X size={20} />
                </button> */}
              </div>
              <h2 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-gray-100 font-poppins">
                MENU
              </h2>
            </div>

            <div className="py-2 font-poppins">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                // Check if the main menu item or any submenu item is active
                const isMainActive =
                  isActive(item.path) ||
                  (item.hasSubmenu &&
                    item.submenuItems?.some((subItem) =>
                      isActive(subItem.path)
                    ));

                return (
                  <div key={index}>
                    <button
                      onClick={() => {
                        if (item.hasSubmenu) {
                          toggleSubmenu(index);
                        } else if (item.onClick) {
                          item.onClick();
                          setIsMenuOpen(false);
                        } else {
                          navigate(item.path);
                          setIsMenuOpen(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3 transition-colors text-left min-h-[48px] ${isMainActive
                        ? "bg-[#ebeef0] dark:bg-gray-900 text-black dark:text-white"
                        : "text-black dark:text-white hover:bg-[#ebeef0] dark:hover:bg-gray-900"
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent
                          size={18}
                          className={`flex-shrink-0 ${isMainActive
                            ? "text-black dark:text-white "
                            : "text-[#d9d9d9] dark:text-gray-400"
                            }`}
                        />
                        <span className="text-sm sm:text-sm leading-tight">
                          {item.label}
                        </span>
                      </div>
                      {item.hasArrow &&
                        (openSubmenu === index ? (
                          <ChevronDown
                            size={16}
                            className="text-black dark:text-white flex-shrink-0 transition-transform"
                          />
                        ) : (
                          <ChevronRight
                            size={16}
                            className="text-black dark:text-white flex-shrink-0 transition-transform"
                          />
                        ))}
                    </button>

                    {item.hasSubmenu && openSubmenu === index && (
                      <div className="bg-gray-50 dark:bg-[#2A2C38] ml-4 sm:ml-6 ">
                        {item.submenuItems.map((subItem, subIndex) => {
                          const isSubActive = subItem.path
                            ? isActive(subItem.path)
                            : false;
                          return (
                            <button
                              key={subIndex}
                              onClick={() => {
                                if (subItem.action === "setAyahWise") {
                                  setViewType("Ayah Wise");
                                  navigate("/");
                                  setIsMenuOpen(false);
                                } else if (subItem.action === "setBlockWise") {
                                  setViewType("Block Wise");
                                  navigate("/");
                                  setIsMenuOpen(false);
                                } else if (subItem.path) {
                                  navigate(subItem.path);
                                  setIsMenuOpen(false);
                                }
                              }}
                              className={`w-full rounded-xl flex items-center px-4 sm:px-6  py-2 sm:py-2 transition-colors text-left text-sm min-h-[44px] ${isSubActive
                                ? "bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
                                : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                                }`}
                            >
                              <span className="mr-3 flex-shrink-0">•</span>
                              <span className="leading-tight">
                                {subItem.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

              {dangerMenuItems.map((item, index) => {
                const IconComponent = item.icon;
                const isDangerActive = isActive(item.path);
                return (
                  <button
                    key={`danger-${index}`}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 sm:px-6 py-3 transition-colors text-left min-h-[48px] ${isDangerActive
                      ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      }`}
                  >
                    <IconComponent
                      size={18}
                      className={`flex-shrink-0 ${isDangerActive
                        ? "text-red-600 dark:text-red-400"
                        : "text-red-600 dark:text-red-400"
                        }`}
                    />
                    <span className="text-sm leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomepageNavbar;