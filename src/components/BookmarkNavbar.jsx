// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const BookmarkNavbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Define tabs with their paths
//   const tabs = [
//     { label: "Verse", path: "/bookmarkedverses" },
//     { label: "Blocks", path: "/bookmarkblock" },
//     { label: "Interpretations", path: "/bookinterpretations" },
//   ];

//   // Get active tab based on current pathname
//   const activePath = location.pathname;

//   const handleTabClick = (path) => {
//     if (activePath !== path) {
//       navigate(path);
//     }
//   };

//   return (
//     <div className="flex justify-center dark:bg-black">
//       <div className="bg-white border-b dark:bg-black border-gray-200 w-[1290px]">
//         {/* Header */}
//         <div className="text-center py-4">
//           <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
//             Bookmark
//           </h1>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="flex justify-center">
//           <div className="flex w-full max-w-md">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.path}
//                 onClick={() => handleTabClick(tab.path)}
//                 className={`flex-1 text-center pb-3 px-2 text-sm font-medium transition-colors relative ${
//                   activePath === tab.path
//                     ? "text-gray-600 dark:text-white border-b-2 border-[#2AA0BF]"
//                     : "text-gray-500 dark:text-white hover:text-gray-700"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookmarkNavbar;


import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BookmarkNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define tabs with their paths
  const tabs = [
    { label: "Verse", path: "/bookmarkedverses" },
    { label: "Blocks", path: "/bookmarkblock" },
    { label: "Interpretations", path: "/bookinterpretations" },
  ];

  // Get active tab based on current pathname
  const activePath = location.pathname;

  const handleTabClick = (path) => {
    if (activePath !== path) {
      navigate(path);
    }
  };

  return (
    <div className="flex justify-center dark:bg-black px-3 sm:px-4 lg:px-6">
      <div className="bg-white border-b dark:bg-black border-gray-200 w-full max-w-[1290px]">
        {/* Header */}
        <div className="text-center py-3 sm:py-4">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
            Bookmark
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center px-3 sm:px-0">
          <div className="flex w-full max-w-xs sm:max-w-md lg:max-w-lg">
            {tabs.map((tab) => (
              <button
                key={tab.path}
                onClick={() => handleTabClick(tab.path)}
                className={`flex-1 text-center pb-2 sm:pb-3 px-1 sm:px-2 text-xs sm:text-sm lg:text-base font-medium transition-colors relative min-h-[44px] flex items-end justify-center ${
                  activePath === tab.path
                    ? "text-gray-600 dark:text-white border-b-2 border-[#2AA0BF]"
                    : "text-gray-500 dark:text-white hover:text-gray-700"
                }`}
              >
                <span className="pb-2 sm:pb-3">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkNavbar;