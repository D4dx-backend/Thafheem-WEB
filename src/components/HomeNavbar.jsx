import { useState } from "react";
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
} from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import SearchConsole from "./SearchConsole";
import LanguageConsole from "./LanguageConsole";
import { useEffect } from "react";
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

  const navigate = useNavigate();
  const location = useLocation(); // Get current route

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
      console.log("User signed out successfully");
      navigate("/"); // Redirect to home page after successful logout
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

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
    { icon: Book, label: "Introduction", path: "/authorpreface" },
    { icon: LaptopMinimal, label: "Digitisation", path: "/digitisation" },
    {
      icon: BookUser,
      label: "Thafeem ul Quran",
      hasArrow: true,
      hasSubmenu: true,
      submenuItems: [
        { label: "Ayah wise", action: "setAyahWise" },
        { label: "Block wise", action: "setBlockWise" },
        { label: "Qur'an Study - Preface", path: "/quranstudy" },
        { label: "End of Prophethood", path: "/end" },
        { label: "Conclusion", path: "/conclusion" },
      ],
    },
    { icon: BookOpen, label: "Thafeem", path: "/thafeem" },
    { icon: BookType, label: "Tajwid", path: "/tajweed" },
    { icon: BookOpenCheck, label: "Quiz", path: "/quiz" },
    { icon: LetterText, label: "Drag & drop", path: "/dragdrop" },
    { icon: Sparkles, label: "What's New", path: "/whatsnew" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Bug, label: "Raise a bug", path: "/raisebug" },
    { icon: MessageCircleQuestion, label: "Share App", onClick: handleShareApp },
    { icon: CircleAlert, label: "About Author", path: "/aboutauthor" },
    { icon: User, label: "About Us", path: "/about" },
    { icon: MessageSquareMore, label: "Contact Us", path: "/contact" },
    { icon: MessageSquare, label: "Feedback", path: "/feedback" },
    { icon: Shield, label: "Privacy", path: "/privacy" },
    { icon: HelpCircle, label: "Help", path: "/help" },
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
    navigate("/bookmarkedverses");
  };
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-opacity-50"
            onClick={() => setIsSearchOpen(false)}
          ></div>
          <div className="bg-white dark:bg-[#2A2C38] w-full max-w-lg rounded-lg relative z-10 max-h-[90vh] overflow-auto mx-4">
            <SearchConsole onClose={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Language Console Popup */}
      {isLanguageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50">
          <div
            className="fixed inset-0"
            onClick={() => setIsLanguageOpen(false)}
          ></div>
          <div className="relative z-10 max-h-[90vh] overflow-auto">
            <div className="p-4">
              <LanguageConsole 
                onClose={() => setIsLanguageOpen(false)} 
                selectedLanguage={translationLanguage === 'E' ? 'English' : 'Malayalam'}
                onLanguageSelect={(lang) => {
                  // Map UI selection to API language codes
                  const code = lang.code?.toLowerCase() === 'en' ? 'E' : 'mal';
                  setTranslationLanguage(code);
                  setIsLanguageOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <nav className="bg-white dark:bg-[#2A2C38] border-b border-gray-100 dark:border-gray-700 w-full relative z-50 ">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
          {/* Left side */}
          <div className="flex items-center space-x-2 sm:space-x-3 ml-2 sm:ml-4">
            <button
              onClick={toggleMenu}
              className="flex items-center space-x-2 p-2 sm:px-3 sm:py-2 
             text-gray-600 dark:text-gray-300 
             hover:text-gray-800 dark:hover:text-white 
             hover:bg-gray-100 dark:hover:bg-gray-800 
             rounded-lg transition-colors 
             min-h-[44px] min-w-[44px] justify-center 
             sm:min-h-auto sm:min-w-auto sm:justify-start"
            >
              <Menu size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-1">
            {/* Sign In/Sign Out Button */}

            <button
              onClick={() => setIsLanguageOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Languages size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {theme === "dark" ? (
                <Sun size={16} className="sm:w-[18px] sm:h-[18px]" />
              ) : (
                <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />
              )}
            </button>

            <button
              onClick={handleBookmarkClick}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Bookmark size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hidden sm:flex p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors min-h-[44px] min-w-[44px] items-center justify-center"
            >
              <Settings size={18} />
            </button>
            {isSettingsOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <SettingsDrawer onClose={() => setIsSettingsOpen(false)} />
              </div>
            )}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Search size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            {user ? (
              <button
                onClick={handleAuthButtonClick}
                disabled={isSigningOut}
                className="flex items-center justify-center w-10 h-10 rounded-full  text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSigningOut ? (
                  <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
              </button>
            ) : (
              <button
                onClick={handleAuthButtonClick}
                className="px-2 sm:px-4 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-800 text-[#2596be] border border-[#2596be] hover:bg-[#2596be] hover:text-white rounded-full transition-colors font-medium whitespace-nowrap"
              >
                <span className="hidden xs:inline">Sign In</span>
                <span className="xs:hidden">Sign</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-opacity-50"
            onClick={toggleMenu}
          ></div>
          <div className="absolute left-0 top-0 h-full w-full max-w-xs sm:max-w-sm md:w-80 bg-white dark:bg-[#2A2C38] shadow-lg overflow-y-auto">
            <div className="flex flex-col items-start p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between w-full mb-4 mt-15 border-b border-gray-200 dark:border-gray-700 pb-2">
                <img
                  src={logo}
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
                      className={`w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3 transition-colors text-left min-h-[48px] ${
                        isMainActive
                          ? "bg-[#ebeef0] dark:bg-gray-900 text-black dark:text-white"
                          : "text-black dark:text-white hover:bg-[#ebeef0] dark:hover:bg-gray-900"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent
                          size={18}
                          className={`flex-shrink-0 ${
                            isMainActive
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
                              className={`w-full rounded-xl flex items-center px-4 sm:px-6  py-2 sm:py-2 transition-colors text-left text-sm min-h-[44px] ${
                                isSubActive
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
                    className={`w-full flex items-center space-x-3 px-4 sm:px-6 py-3 transition-colors text-left min-h-[48px] ${
                      isDangerActive
                        ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    }`}
                  >
                    <IconComponent
                      size={18}
                      className={`flex-shrink-0 ${
                        isDangerActive
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
