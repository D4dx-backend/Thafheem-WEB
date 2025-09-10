
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
} from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom"; 
import SearchConsole from "./SearchConsole";
import LanguageConsole from "./LanguageConsole";
import { useTheme } from "../context/ThemeContext";
import SettingsDrawer  from "../pages/Settings";

const HomepageNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSubmenu = (index) =>
    setOpenSubmenu(openSubmenu === index ? null : index);

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
        { label: "Ayah wise", path: "/ayahwise" },
        { label: "Block wise", path: "/blockwise" },
        { label: "Qur'an Study - Preface", path: "/quranstudy" },
        { label: "End of Prophethood", path: "/end" },
        { label: "Conclusion", path: "/conclusion" },
      ],
    },
    { icon: BookOpen, label: "Thafeem", path: "/thafeem" },
    { icon: BookType, label: "Tajwid", path: "/tajweed" },
    { icon: Heart, label: "Donate", path: "/donate" },
    { icon: BookOpenCheck, label: "Quiz", path: "/quiz" },
    { icon: LetterText, label: "Drag & drop", path: "/dragdrop" },
    { icon: Sparkles, label: "What's New", path: "/whatsnew" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Bug, label: "Raise a bug", path: "/raisebug" },
    { icon: MessageCircleQuestion , label: "Share App", path: "/share" },
    { icon: CircleAlert, label: "About Author", path: "/aboutauthor" },
    { icon: User, label: "About Us", path: "/about" },
    { icon: MessageSquareMore, label: "Contact Us", path: "/contact" },
    { icon: MessageSquare, label: "Feedback", path: "/feedback" },
    { icon: Shield, label: "Privacy", path: "/privacy" },
    { icon: HelpCircle, label: "Help", path: "/help" },
  ];

  const dangerMenuItems = [
    { icon: UserX, label: "Delete Account", path: "/deleteaccount", isDanger: true },
    { icon: LogOut, label: "Log Out", path: "/logout", isDanger: true },
  ];

  // Helper function to determine if a menu item is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
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
              <LanguageConsole onClose={() => setIsLanguageOpen(false)} />
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
            <button className="px-2 sm:px-4 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-800 text-[#2596be] border border-[#2596be] hover:bg-[#2596be] hover:text-white rounded-full transition-colors font-medium whitespace-nowrap">
              <span className="hidden xs:inline">Sign In</span>
              <span className="xs:hidden">Sign</span>
            </button>

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

            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
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
                {/* Uncomment if you want to re-enable the close button */}
                {/* <button
                  onClick={toggleMenu}
                  className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X size={20} />
                </button> */}
              </div>
              <h2 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-gray-100 font-poppins">MENU</h2>
            </div>

            <div className="py-2 font-poppins">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                // Check if the main menu item or any submenu item is active
                const isMainActive =
                  isActive(item.path) ||
                  (item.hasSubmenu &&
                    item.submenuItems?.some((subItem) => isActive(subItem.path)));

                return (
                  <div key={index}>
                    <button
                      onClick={() => {
                        if (item.hasSubmenu) {
                          toggleSubmenu(index);
                        } else {
                          navigate(item.path);
                          setIsMenuOpen(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3 transition-colors text-left min-h-[48px] ${
                        isMainActive
                          ? "bg-[#ebeef0] dark:bg-black text-black dark:text-white"
                          : "text-black dark:text-white hover:bg-[#ebeef0] dark:hover:bg-black"
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
                      {item.hasArrow && (
  openSubmenu === index ? (
    <ChevronDown
      size={16}
      className="text-black dark:text-white flex-shrink-0 transition-transform"
    />
  ) : (
    <ChevronRight
      size={16}
      className="text-black dark:text-white flex-shrink-0 transition-transform"
    />
  )
)}

                    </button>

                    {item.hasSubmenu && openSubmenu === index && (
                      <div className="bg-gray-50 dark:bg-[#2A2C38] ml-4 sm:ml-6 ">
                        {item.submenuItems.map((subItem, subIndex) => {
                          const isSubActive = isActive(subItem.path);
                          return (
                            <button
                              key={subIndex}
                              onClick={() => {
                                navigate(subItem.path);
                                setIsMenuOpen(false);
                              }}
                              className={`w-full rounded-xl flex items-center px-4 sm:px-6  py-2 sm:py-2 transition-colors text-left text-sm min-h-[44px] ${
                                isSubActive
                                  ? "bg-gray-100 dark:bg-black text-black dark:text-white"
                                  : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-black"
                              }`}
                            >
                              <span className="mr-3 flex-shrink-0">•</span>
                              <span className="leading-tight">{subItem.label}</span>
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

// import { useState } from "react";
// import {
//   Menu,
//   Search,
//   Settings,
//   Moon,
//   Sun,
//   Languages,
//   Bookmark,
//   X,
//   Home,
//   FileText,
//   User,
//   BookOpen,
//   Info,
//   Zap,
//   Heart,
//   Download,
//   Sparkles,
//   Bug,
//   Share,
//   Users,
//   UserCheck,
//   Mail,
//   MessageSquare,
//   Shield,
//   HelpCircle,
//   Trash2,
//   LogOut,
//   ChevronRight,
// } from "lucide-react";
// import logo from "../assets/logo.png";
// import { useNavigate } from "react-router-dom";
// import SearchConsole from "./SearchConsole";
// import LanguageConsole from "./LanguageConsole";
// import { useTheme } from "../context/ThemeContext";

// const HomepageNavbar = () => {
//   const { theme, toggleTheme } = useTheme();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [openSubmenu, setOpenSubmenu] = useState(null);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isLanguageOpen, setIsLanguageOpen] = useState(false);

//   const navigate = useNavigate();

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const toggleSubmenu = (index) =>
//     setOpenSubmenu(openSubmenu === index ? null : index);

//   const menuItems = [
//     { icon: Home, label: "Home", action: () => console.log("Navigate to Home") },
//     { icon: FileText, label: "Table of Contents", action: () => navigate("/tablecontents") },
//     { icon: User, label: "Sayyid Maududi", action: () => navigate("/maududi") },
//     { icon: Languages, label: "English Translation", action: () => console.log("Navigate to English Translation") },
//     { icon: Info, label: "Introduction", action: () => console.log("Navigate to Introduction") },
//     { icon: Zap, label: "Digitisation", action: () => console.log("Navigate to Digitisation") },
//     {
//       icon: BookOpen,
//       label: "Thafeem ul Quran",
//       hasArrow: true,
//       hasSubmenu: true,
//       submenuItems: [
//         { label: "Ayah wise", action: () => console.log("Navigate to Ayah wise") },
//         { label: "Block wise", action: () => console.log("Navigate to Block wise") },
//         { label: "Qur'an Study - Preface", action: () => navigate("/quranstudy") },
//         { label: "End of Prophethood", action: () => navigate("/end") },
//         { label: "Conclusion", action: () => navigate("/conclusion") },
//       ],
//     },
//     { icon: BookOpen, label: "Thafeem", action: () => console.log("Navigate to Thafeem") },
//     { icon: FileText, label: "Tajwid", action: () => navigate("/tajweed") },
//     { icon: Heart, label: "Donate", action: () => console.log("Navigate to Donate") },
//     { icon: BookOpen, label: "Quiz", action: () => navigate("/quiz") },
//     { icon: Download, label: "Drag & drop", action: () => navigate("/dragdrop") },
//     { icon: Sparkles, label: "What's New", action: () => navigate("/whatsnew") },
//     { icon: Settings, label: "Settings", action: () => navigate("/settings") },
//     { icon: Bug, label: "Raise a bug", action: () => console.log("Raise a bug") },
//     { icon: Share, label: "Share App", action: () => console.log("Share App") },
//     { icon: Users, label: "About Us", action: () => navigate("/about") },
//     { icon: UserCheck, label: "About Author", action: () => console.log("Navigate to About Author") },
//     { icon: Mail, label: "Contact Us", action: () => console.log("Navigate to Contact Us") },
//     { icon: MessageSquare, label: "Feedback", action: () => console.log("Open Feedback") },
//     { icon: Shield, label: "Privacy", action: () => console.log("Navigate to Privacy") },
//     { icon: HelpCircle, label: "Help", action: () => console.log("Open Help") },
//   ];

//   const dangerMenuItems = [
//     { icon: Trash2, label: "Delete Account", action: () => navigate("/deleteaccount"), isDanger: true },
//     { icon: LogOut, label: "Log Out", action: () => navigate("/logout"), isDanger: true },
//   ];

//   return (
//     <>
//       {/* Search Console Popup */}
//       {isSearchOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div className="bg-white w-full max-w-lg rounded-lg relative">
//             <SearchConsole onClose={() => setIsSearchOpen(false)} />
//           </div>
//         </div>
//       )}

//       {/* Language Console Popup */}
//       {isLanguageOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
//           <div className="bg-white w-full max-w-lg rounded-lg shadow-lg relative">
//             <div className="p-4">
//               <LanguageConsole onClose={() => setIsLanguageOpen(false)} />
//             </div>
//           </div>
//         </div>
//       )}

//       <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 w-full relative z-50">
//         <div className="flex items-center justify-between px-4 py-3">
//           {/* Left side */}
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={toggleMenu}
//               className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
//             >
//               <Menu size={20} />
//             </button>
//             <img src={logo} alt="Thafheemul Quran" className="h-8 w-auto" />
//           </div>

//           {/* Right side */}
//           <div className="flex items-center space-x-1">
//             <button className="px-4 py-1.5 text-sm bg-white dark:bg-gray-800 text-[#2596be] border border-[#2596be] hover:bg-[#2596be] hover:text-white rounded-full transition-colors font-medium">
//               Sign In
//             </button>

//             <button
//               onClick={() => setIsLanguageOpen(true)}
//               className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
//             >
//               <Languages size={18} />
//             </button>

//             {/* 🌙 / ☀️ Dark Mode Toggle */}
//             <button
//               onClick={toggleTheme}
//               className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
//             >
//               {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
//             </button>

//             <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
//               <Bookmark size={18} />
//             </button>

//             <button
//               onClick={() => navigate("/settings")}
//               className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
//             >
//               <Settings size={18} />
//             </button>

//             <button
//               onClick={() => setIsSearchOpen(true)}
//               className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
//             >
//               <Search size={18} />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Sidebar */}
//       {isMenuOpen && (
//         <div className="fixed inset-0 z-40">
//           <div className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg overflow-y-auto">
//             <div className="flex flex-col items-start p-4 border-b border-gray-200 dark:border-gray-700">
//               <div className="flex items-center justify-between w-full mb-4">
//                 <img src={logo} alt="Thafheemul Quran" className="h-12 w-auto" />
//                 <button
//                   onClick={toggleMenu}
//                   className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">MENU</h2>
//             </div>

//             <div className="py-2">
//               {menuItems.map((item, index) => {
//                 const IconComponent = item.icon;
//                 return (
//                   <div key={index}>
//                     <button
//                       onClick={() => {
//                         if (item.hasSubmenu) {
//                           toggleSubmenu(index);
//                         } else {
//                           item.action();
//                           setIsMenuOpen(false);
//                         }
//                       }}
//                       className="w-full flex items-center justify-between px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
//                     >
//                       <div className="flex items-center space-x-3">
//                         <IconComponent size={18} className="text-gray-500 dark:text-gray-400" />
//                         <span className="text-sm">{item.label}</span>
//                       </div>
//                       {item.hasArrow && (
//                         <ChevronRight
//                           size={16}
//                           className={`text-gray-400 transition-transform ${openSubmenu === index ? "rotate-90" : ""}`}
//                         />
//                       )}
//                     </button>

//                     {item.hasSubmenu && openSubmenu === index && (
//                       <div className="bg-gray-50 dark:bg-gray-800 border-l-4 border-teal-500 ml-6">
//                         {item.submenuItems.map((subItem, subIndex) => (
//                           <button
//                             key={subIndex}
//                             onClick={() => {
//                               subItem.action();
//                               setIsMenuOpen(false);
//                             }}
//                             className="w-full flex items-center px-6 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left text-sm"
//                           >
//                             <span className="mr-3">•</span>
//                             <span>{subItem.label}</span>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}

//               <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

//               {dangerMenuItems.map((item, index) => {
//                 const IconComponent = item.icon;
//                 return (
//                   <button
//                     key={`danger-${index}`}
//                     onClick={() => {
//                       item.action();
//                       setIsMenuOpen(false);
//                     }}
//                     className="w-full flex items-center space-x-3 px-6 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-left"
//                   >
//                     <IconComponent size={18} />
//                     <span className="text-sm">{item.label}</span>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default HomepageNavbar;
