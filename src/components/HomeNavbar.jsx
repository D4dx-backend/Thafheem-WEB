import { useState } from "react";
import {
  Menu,
  Search,
  Settings,
  Moon,
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
  Power,
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
} from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import SearchConsole from "./SearchConsole";
import LanguageConsole from "./LanguageConsole";
const HomepageNavbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const menuItems = [
    {
      icon: Home,
      label: "Home",
      action: () => console.log("Navigate to Home"),
    },
    {
      icon: FileText,
      label: "Table of Contents",
      action: () => navigate("/tablecontents"), // ✅ now works
    },  
    {
      icon: User,
      label: "Sayyid Maududi",
      action: () => navigate("/maududi"),
    },
    {
      icon: Languages,
      label: "English Translation",
      action: () => console.log("Navigate to English Translation"),
    },
    {
      icon: Info,
      label: "Introduction",
      action: () => console.log("Navigate to Introduction"),
    },
    {
      icon: Zap,
      label: "Digitisation",
      action: () => console.log("Navigate to Digitisation"),
    },
    {
      icon: BookOpen,
      label: "Thafeem ul quran",
      hasArrow: true,
      hasSubmenu: true,
      submenuItems: [
        {
          label: "Ayah wise",
          action: () => console.log("Navigate to Ayah wise"),
        },
        {
          label: "Block wise",
          action: () => console.log("Navigate to Block wise"),
        },
        {
          label: "Qur'an Study - Preface",
          action: () => ("/quranstudy"),
        },
        {
          label: "End of Prophethood",
          action: () => navigate("/end"),
        },
        {
          label: "Conclusion",
          action: () => navigate("/conclusion"),
        },
      ],
    },
    {
      icon: BookOpen,
      label: "Thafeem",
      action: () => console.log("Navigate to Thafeem"),
    },
    {
      icon: FileText,
      label: "Tajwid",
      action: () => navigate("/tajweed"),
    },
    {
      icon: Heart,
      label: "Donate",
      action: () => console.log("Navigate to Donate"),
    },
    {
      icon: BookOpen,
      label: "Quiz",
      action: () => navigate("/quiz"),
    },
    {
      icon: Download,
      label: "Drag & drop",
      action: () => navigate("/dragdrop"),
    },
    {
      icon: Sparkles,
      label: "What's New",
      action: () => navigate("/whatsnew")
    },
    {
      icon: Settings,
      label: "Settings",
      action: () => navigate("/settings"),
    },
    {
      icon: Bug,
      label: "Raise a bug",
      action: () => console.log("Raise a bug"),
    },
    { icon: Share, label: "Share App", action: () => console.log("Share App") },
    {
      icon: Users,
      label: "About Us",
      action: () => navigate("/about"),
    },
    {
      icon: UserCheck,
      label: "About Author",
      action: () => console.log("Navigate to About Author"),
    },
    {
      icon: Mail,
      label: "Contact Us",
      action: () => console.log("Navigate to Contact Us"),
    },
    {
      icon: MessageSquare,
      label: "Feedback",
      action: () => console.log("Open Feedback"),
    },
    {
      icon: Shield,
      label: "Privacy",
      action: () => console.log("Navigate to Privacy"),
    },
    { icon: HelpCircle, label: "Help", action: () => console.log("Open Help") },
  ];

  const dangerMenuItems = [
    {
      icon: Trash2,
      label: "Delete Account",
      action: () => navigate("/deleteaccount"),
      isDanger: true,
    },
    {
      icon: LogOut,
      label: "Log Out",
      action: () => navigate("/logout"),
      isDanger: true,
    },
  ];
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  return (
    <>
    {/* Search Console Popup */}
    {isSearchOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="bg-white w-full max-w-lg rounded-lg relative">
      <SearchConsole onClose={() => setIsSearchOpen(false)} />
    </div>
  </div>
)}

{/* Language Console Popup */}
{isLanguageOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
    <div className="bg-white w-full max-w-lg rounded-lg shadow-lg relative">
      {/* Render LanguageConsole Component */}
      <div className="p-4">
        <LanguageConsole onClose={() => setIsLanguageOpen(false)} />
      </div>
    </div>
  </div>
)}



      <nav className="bg-white border-b border-gray-100 w-full relative z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Logo and Hamburger Menu */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMenu}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center">
              <img
                src={logo}
                alt="Thafheemul Quran"
                className="h-8 w-auto"
              />
            </div>
          </div>

          {/* Right side - Utility Icons */}
          <div className="flex items-center space-x-1">
            {/* Sign In Button */}
            <button
              onClick={() => console.log("Navigate to Sign In")}
              className="px-4 py-1.5 text-sm bg-white text-[#2596be] border border-[#2596be] hover:bg-[#2596be] hover:text-white rounded-full transition-colors font-medium"
            >
              Sign In
            </button>

            {/* Language/Translate Icon */}
            <button
  onClick={() => setIsLanguageOpen(true)}
  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
>
  <Languages size={18} />
</button>


            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Moon size={18} />
            </button>

            {/* Bookmark Icon */}
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
              <Bookmark size={18} />
            </button>

            {/* Settings Icon */}
            <button
      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
      onClick={() => navigate("/settings")}
    >
      <Settings size={18} />
    </button>

            {/* Search Icon */}
            {/* <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
              <Search size={18} />
            </button> */}
            {/* Search Icon */}
<button
  onClick={() => setIsSearchOpen(true)}
  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
>
  <Search size={18} />
</button>

          </div>
        </div>
      </nav>

      {/* Sidebar Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40">
          {/* Overlay */}

          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col items-start p-4 border-b border-gray-200">
              <div className="flex items-center justify-between w-full mb-4">
                <img
                  src="/logo.png"
                  alt="Thafheemul Quran"
                  className="h-12 w-auto"
                />
                <button
                  onClick={toggleMenu}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">MENU</h2>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index}>
                    <button
                      onClick={() => {
                        if (item.hasSubmenu) {
                          toggleSubmenu(index);
                        } else {
                          item.action();
                          setIsMenuOpen(false);
                        }
                      }}
                      className="w-full flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent size={18} className="text-gray-500" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      {item.hasArrow && (
                        <ChevronRight
                          size={16}
                          className={`text-gray-400 transition-transform ${
                            openSubmenu === index ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Submenu */}
                    {item.hasSubmenu && openSubmenu === index && (
                      <div className="bg-gray-50 border-l-4 border-teal-500 ml-6">
                        {item.submenuItems.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() => {
                              subItem.action();
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-left text-sm"
                          >
                            <span className="mr-3">•</span>
                            <span>{subItem.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Separator */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Danger Menu Items */}
              {dangerMenuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={`danger-${index}`}
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-6 py-3 text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <IconComponent size={18} />
                    <span className="text-sm">{item.label}</span>
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
