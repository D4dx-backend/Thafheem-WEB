// import React, { useState } from "react";
// import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

// const DragDropQuiz = () => {
//   const [score, setScore] = useState(0);
//   const [currentQuestion, setCurrentQuestion] = useState(1);
//   const [totalQuestions] = useState(5);
//   const [draggedItem, setDraggedItem] = useState(null);
//   const [droppedItems, setDroppedItems] = useState({
//     বিসমিল্লাহ: { text: "അല്ലാഹുവിന്റെ നാമത്തിൽ", correct: true },
//     আল্লাহ: { text: "ദയാപരനായ", correct: false },
//   });

//   const arabicTexts = [
//     {
//       id: "বিসমিল্লাহ",
//       text: "بِسْمِ",
//       correctTranslation: "അല്ലാഹുവിന്റെ നാമത്തിൽ",
//     },
//     { id: "আল্লাহ", text: "اللَّهِ", correctTranslation: "അല്ലാഹു" },
//     { id: "রহমান", text: "الرَّحْمَٰنِ", correctTranslation: "പരമകാരുണികനായ" },
//     { id: "রহীম", text: "الرَّحِيمِ", correctTranslation: "പരമദയാലുവായ" },
//     { id: "হামদ", text: "الْحَمْدُ", correctTranslation: "സ്തുതി" },
//     { id: "লিল্লাহ", text: "لِلَّهِ", correctTranslation: "അല്ലാഹുവിനു" },
//     { id: "রব্বে", text: "رَبِّ", correctTranslation: "നാഥനു" },
//     {
//       id: "আলামীন",
//       text: "الْعَالَمِينَ",
//       correctTranslation: "സകലജഗത്തുകളുടെയും",
//     },
//   ];

//   const malayalamOptions = [
//     { id: "opt1", text: "നിദ്രാനിമഗ്നമായവനു" },
//     { id: "opt2", text: "പരമകാരുണികനായവനു" },
//     { id: "opt3", text: "സർവലോകങ്ങളുടെയും" },
//     { id: "opt4", text: "സ്തുതി" },
//     { id: "opt5", text: "അല്ലാഹുവിനു" },
//     { id: "opt6", text: "അല്ലാഹുവിന്റെ" },
//   ];

//   const handleDragStart = (e, item) => {
//     setDraggedItem(item);
//     e.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//   };

//   const handleDrop = (e, targetId) => {
//     e.preventDefault();
//     if (draggedItem) {
//       const targetArabic = arabicTexts.find((item) => item.id === targetId);
//       const isCorrect =
//         targetArabic && targetArabic.correctTranslation === draggedItem.text;

//       setDroppedItems((prev) => ({
//         ...prev,
//         [targetId]: { text: draggedItem.text, correct: isCorrect },
//       }));

//       if (isCorrect) {
//         setScore((prev) => prev + 1);
//       }

//       setDraggedItem(null);
//     }
//   };

//   const getDroppedItem = (targetId) => {
//     return droppedItems[targetId];
//   };

//   const handlePrevious = () => {
//     if (currentQuestion > 1) {
//       setCurrentQuestion(currentQuestion - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentQuestion < totalQuestions) {
//       setCurrentQuestion(currentQuestion + 1);
//     }
//   };

//   const getAvailableOptions = () => {
//     const usedTexts = Object.values(droppedItems).map((item) => item.text);
//     return malayalamOptions.filter(
//       (option) => !usedTexts.includes(option.text)
//     );
//   };

//   const handleStartGame = () => {
//     setGameStarted(true);
//   };

//   const handleCancelGame = () => {
//     // Could redirect back or close the application
//     console.log("Game cancelled");
//   };
//   const [gameStarted, setGameStarted] = useState(false);

//   // Show start game modal if game hasn't started
//   if (!gameStarted) {
//     return (
//       <div className="min-h-screen bg-gray-100  flex items-center justify-center ">
//         <div className="fixed inset-0 bg-gray-500  bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl p-6 w-96">
//             {/* Modal Header */}
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">
//               Start Game
//             </h2>

//             {/* Modal Content */}
//             <p className="text-gray-600 mb-6 dark:text-white">
//               Are you ready to begin the game? Let's go!
//             </p>

//             {/* Modal Actions */}
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={handleCancelGame}
//                 className="px-4 py-2 text-gray-600 dark:text-white hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleStartGame}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                 style={{ backgroundColor: "#2AA0BF" }}
//               >
//                 Start
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Main game content - shows after start button is clicked
//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-black">
//       {/* Top Navigation Bar */}
//       <div className="bg-white dark:bg-[#2A2C38] ">
//         <div className="max-w-6xl mx-auto px-4 py-2">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
//                 <span className="text-gray-800 font-medium dark:text-white">
//                   Al-Fatihah
//                 </span>
//                 <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
//               </div>
//               <span className="text-gray-400 dark:text-white">|</span>
//               <span className="text-sm text-gray-600 dark:text-white">
//                 1 - 7
//               </span>
//             </div>
//           </div>
//         </div>

//       </div>
// <div>
// <ArrowLeft className="w-5 h-5  text-gray-600 dark:text-white relative top-10 left-30" />

// </div>
//       {/* Header */}
//       <div className=" border-b dark:bg-black w-[884px] mx-auto">

//         <div className="mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//           <div className="flex items-center  gap-25">
//   <h1
//     className="text-xl font-semibold"
//     style={{ color: "#2AA0BF" }}
//   >
//     Drag & Drop
//   </h1>
// </div>

//             <div className="text-sm text-gray-600 dark:text-white">
//               <span>മാർക്ക്: {score}</span>
//               <span className="ml-4">Total: {totalQuestions}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="w-full mx-auto px-4 py-6 dark:bg-black ">
//         <div className="max-w-6xl mx-auto ">
//           <div className="bg-gray-50 dark:bg-black rounded-lg   p-6">
//             {/* Drag & Drop Area */}
//             <div className="flex gap-8 justify-center">
//               {/* Arabic Text Column */}
//               <div className="flex flex-col gap-4">
//                 {arabicTexts.map((item) => (
//                   <div
//                     key={item.id}
//                     className="bg-[#EBEEF0] dark:bg-[#323A3F] dark:text-white p-4 rounded text-center w-50 h-12 flex items-center justify-center"
//                   >
//                     <span
//                       className="text-lg font-semibold"
//                       style={{ fontFamily: "Arabic, serif" }}
//                     >
//                       {item.text}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* Drop Zones Column */}
//               <div className="flex flex-col gap-4">
//                 {arabicTexts.map((item) => {
//                   const droppedItem = getDroppedItem(item.id);

//                   return (
//                     // <div
//                     //   key={`drop-${item.id}`}
//                     //   className={`w-64 h-12 border-2 border-dashed rounded flex items-center justify-center text-sm transition-colors ${
//                     //     droppedItem
//                     //       ? droppedItem.correct
//                     //         ? 'border-green-400 bg-green-100 text-green-700'
//                     //         : 'border-red-400 bg-red-100 text-red-700'
//                     //       : 'border-gray-300 bg-white hover:border-blue-300 dark:bg-[#323A3F]'
//                     //   }`}
//                     //   onDragOver={handleDragOver}
//                     //   onDrop={(e) => handleDrop(e, item.id)}
//                     // >
//                     //   {droppedItem && (
//                     //     <span className="px-2 text-center">
//                     //       {droppedItem.text}
//                     //     </span>
//                     //   )}
//                     // </div>
//                     <div
//                       key={`drop-${item.id}`}
//                       draggable={!!droppedItem}
//                       onDragStart={(e) =>
//                         droppedItem && handleDragStart(e, droppedItem)
//                       }
//                       className={`w-64 h-12 border  rounded-lg flex items-center justify-center text-sm transition-colors ${
//                         droppedItem
//                           ? droppedItem.correct
//                             ? "border-green-400 bg-green-100 text-green-700"
//                             : "border-red-400 bg-red-100 text-red-700"
//                           : "border-gray-300 bg-[#EBEEF0] hover:border-blue-300 dark:bg-[#323A3F]"
//                       }`}
//                       onDragOver={handleDragOver}
//                       onDrop={(e) => handleDrop(e, item.id)}
//                     >
//                       {droppedItem && (
//                         <span className="px-2 text-center">
//                           {droppedItem.text}
//                         </span>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Malayalam Options Column */}
//               {/* <div className="flex flex-col gap-3">
//               {getAvailableOptions().map((option) => (
//                 <div
//                   key={option.id}
//                   draggable
//                   onDragStart={(e) => handleDragStart(e, option)}
//                   className="bg-white border  dark:bg-black dark:text-white border-gray-300 p-3 rounded cursor-move hover:shadow-md transition-shadow text-sm w-48 h-12 flex items-center justify-center"
//                 >
//                   {option.text}
//                 </div>
//               ))}
//             </div> */}
//               {/* Malayalam Options Column with 8 fixed boxes */}
//               {/* <div className="flex flex-col gap-3">
//   {Array.from({ length: 8 }).map((_, index) => {
//     const option = getAvailableOptions()[index]; // pick option if available
//     return (
//       <div
//         key={index}
//         draggable={!!option}
//         onDragStart={(e) => option && handleDragStart(e, option)}
//         className={`border rounded text-sm w-48 h-12 flex items-center justify-center transition-shadow 
//           ${option
//             ? "bg-white dark:bg-black dark:text-white border-gray-300 cursor-move hover:shadow-md"
//             : "bg-gray-100 dark:bg-[#2A2C38] border-dashed border-gray-300 text-gray-400 cursor-default"
//           }`}
//       >
//         {option ? option.text : "Empty"}
//       </div>
//     );
//   })}
// </div> */}

//               {/* Malayalam Options Column with 8 fixed, droppable boxes */}
//               <div className="flex flex-col gap-3">
//                 {Array.from({ length: 8 }).map((_, index) => {
//                   const option = getAvailableOptions()[index]; // available option for this slot

//                   const handleOptionDrop = (e) => {
//                     e.preventDefault();
//                     if (draggedItem) {
//                       // Put dragged item back to this slot
//                       const newDropped = { ...droppedItems };

//                       // Remove it from any Arabic slot where it was before
//                       for (const key in newDropped) {
//                         if (newDropped[key]?.text === draggedItem.text) {
//                           delete newDropped[key];
//                         }
//                       }

//                       setDroppedItems(newDropped);
//                       setDraggedItem(null);
//                     }
//                   };

//                   return (
//                     <div
//                       key={index}
//                       draggable={!!option}
//                       onDragStart={(e) => option && handleDragStart(e, option)}
//                       onDragOver={handleDragOver}
//                       onDrop={handleOptionDrop}
//                       className={`border rounded text-sm w-70 h-12 flex items-center justify-center transition-shadow 
//           ${
//             option
//               ? "bg-white dark:bg-black dark:text-white border-gray-300 cursor-move hover:shadow-md"
//               : "bg-gray-100 dark:bg-black  border-gray-300 text-gray-400"
//           }`}
//                     >
//                       {option ? option.text : ""}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Navigation */}
//             <div className="flex justify-center gap-8 items-center pt-8 mt-8">
//   <button
//     onClick={handlePrevious}
//     disabled={currentQuestion === 1}
//     className="flex items-center border gap-2 px-4 py-2 bg-white text-black rounded-md shadow 
//       hover:text-[#d1d5db] disabled:opacity-50 disabled:cursor-not-allowed"
//   >
//     <ChevronLeft className="w-4 h-4" />
//     Previous Question
//   </button>

//   <button
//     onClick={handleNext}
//     disabled={currentQuestion === totalQuestions}
//     className="flex items-center gap-2 px-4 py-2 bg-white  border text-black rounded-md shadow 
//  disabled:opacity-50 disabled:cursor-not-allowed"
//   >
//     Next Question
//     <ChevronRight className="w-4 h-4" />
//   </button>
// </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DragDropQuiz;

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

const DragDropQuiz = () => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(5);
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedItems, setDroppedItems] = useState({
    বিসমিল্লাহ: { text: "അല്ലാഹുവിന്റെ നാമത്തിൽ", correct: true },
    আল্লাহ: { text: "ദയാപരനായ", correct: false },
  });

  const arabicTexts = [
    {
      id: "বিসমিল্লাহ",
      text: "بِسْمِ",
      correctTranslation: "അല്ലാഹുവിന്റെ നാമത്തിൽ",
    },
    { id: "আল্লাহ", text: "اللَّهِ", correctTranslation: "അല്ലാഹു" },
    { id: "রহমান", text: "الرَّحْمَٰنِ", correctTranslation: "പരമകാരുണികനായ" },
    { id: "রহীম", text: "الرَّحِيمِ", correctTranslation: "പരമദയാലുവായ" },
    { id: "হামদ", text: "الْحَمْدُ", correctTranslation: "സ്തുതി" },
    { id: "লিল্লাহ", text: "لِلَّهِ", correctTranslation: "അല്ലാഹുവിനു" },
    { id: "রব্বে", text: "رَبِّ", correctTranslation: "നാഥനു" },
    {
      id: "আলামীন",
      text: "الْعَالَمِينَ",
      correctTranslation: "സകലജഗത്തുകളുടെയും",
    },
  ];

  const malayalamOptions = [
    { id: "opt1", text: "നിദ്രാനിമഗ്നമായവനു" },
    { id: "opt2", text: "പരമകാരുണികനായവനു" },
    { id: "opt3", text: "സർവലോകങ്ങളുടെയും" },
    { id: "opt4", text: "സ്തുതി" },
    { id: "opt5", text: "അല്ലാഹുവിനു" },
    { id: "opt6", text: "അല്ലാഹുവിന്റെ" },
  ];

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedItem) {
      const targetArabic = arabicTexts.find((item) => item.id === targetId);
      const isCorrect =
        targetArabic && targetArabic.correctTranslation === draggedItem.text;

      setDroppedItems((prev) => ({
        ...prev,
        [targetId]: { text: draggedItem.text, correct: isCorrect },
      }));

      if (isCorrect) {
        setScore((prev) => prev + 1);
      }

      setDraggedItem(null);
    }
  };

  const getDroppedItem = (targetId) => {
    return droppedItems[targetId];
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const getAvailableOptions = () => {
    const usedTexts = Object.values(droppedItems).map((item) => item.text);
    return malayalamOptions.filter(
      (option) => !usedTexts.includes(option.text)
    );
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleCancelGame = () => {
    // Could redirect back or close the application
    console.log("Game cancelled");
  };
  const [gameStarted, setGameStarted] = useState(false);

  // Show start game modal if game hasn't started
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
            {/* Modal Header */}
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 dark:text-white">
              Start Game
            </h2>

            {/* Modal Content */}
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 dark:text-white">
              Are you ready to begin the game? Let's go!
            </p>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={handleCancelGame}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 dark:text-white hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleStartGame}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors order-1 sm:order-2"
                style={{ backgroundColor: "#2AA0BF" }}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main game content - shows after start button is clicked
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-[#2A2C38]">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-1 sm:px-2 py-1 rounded">
                <span className="text-gray-800 font-medium dark:text-white text-sm sm:text-base">
                  Al-Fatihah
                </span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 rotate-90" />
              </div>
              <span className="text-gray-400 dark:text-white">|</span>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-white">
                1 - 7
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <ArrowLeft className="hidden sm:inline w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-white relative top-8 sm:top-10 left-4 sm:left-30" />
      </div>

      {/* Header */}
      {/* <div className="border-b dark:bg-black w-full max-w-[884px] mx-auto">
        <div className="mx-auto px-3 sm:px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-25">
              <h1
                className="text-lg sm:text-xl font-semibold"
                style={{ color: "#2AA0BF" }}
              >
                Drag & Drop
              </h1>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-white">
              <span>മാർക്ക്: {score}</span>
              <span className="ml-4">Total: {totalQuestions}</span>
            </div>
          </div>
        </div>
      </div> */}
 <div className="sm:border-b dark:bg-black w-full max-w-[884px] mx-auto">
  <div className="mx-auto px-3 sm:px-4 py-3">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
      
      <div className="flex items-center gap-25">
        <h1
          className="text-lg sm:text-xl font-semibold"
          style={{ color: "#2AA0BF" }}
        >
          Drag & Drop
        </h1>
      </div>

      {/* Show score only on sm and above */}
      <div className="hidden sm:block text-xs sm:text-sm text-gray-600 dark:text-white">
        <span>മാർക്ക്: {score}</span>
        <span className="ml-4">Total: {totalQuestions}</span>
      </div>
    </div>

    {/* Mobile only: Add border and show score */}
    <div className="sm:hidden border-t border-gray-300 mt-2 pt-2 text-xs text-gray-600 dark:text-white flex justify-end gap-4">
      <span>മാർക്ക്: {score}</span>
      <span>Total: {totalQuestions}</span>
    </div>

  </div>
</div>




      {/* Main Content */}
      <div className="w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 dark:bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-50 dark:bg-black rounded-lg p-3 sm:p-6">
            {/* Drag & Drop Area */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center">
              {/* Arabic Text Column */}
              <div className="flex flex-row gap-2 sm:gap-3 lg:gap-4 justify-center">
  {/* Arabic Text Column */}
  <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 order-1">
    <h3 className="text-sm sm:text-base font-medium text-center mb-2 text-gray-700 dark:text-white lg:hidden">
      Arabic Text
    </h3>
    {arabicTexts.map((item) => (
      <div
        key={item.id}
        className="bg-[#EBEEF0] dark:bg-[#323A3F] dark:text-white p-3 sm:p-4 rounded text-center  w-[164px] sm:w-48 lg:w-50 h-10 sm:h-12 flex items-center justify-center"
      >
        <span
          className="text-base sm:text-lg font-semibold"
          style={{ fontFamily: "Arabic, serif" }}
        >
          {item.text}
        </span>
      </div>
    ))}
  </div>

  {/* Drop Zones Column */}
  <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 order-2">
    <h3 className="text-sm sm:text-base font-medium text-center mb-2 text-gray-700 dark:text-white lg:hidden">
      Drop Here
    </h3>
    {arabicTexts.map((item) => {
      const droppedItem = getDroppedItem(item.id);

      return (
        <div
          key={`drop-${item.id}`}
          draggable={!!droppedItem}
          onDragStart={(e) =>
            droppedItem && handleDragStart(e, droppedItem)
          }
          className={`w-full sm:w-56 lg:w-64 h-10 sm:h-12 border rounded-lg flex items-center justify-center text-xs sm:text-sm transition-colors ${
            droppedItem
              ? droppedItem.correct
                ? "border-green-400 bg-green-100 text-green-700"
                : "border-red-400 bg-red-100 text-red-700"
              : "border-gray-300 bg-[#EBEEF0] hover:border-blue-300 dark:bg-[#323A3F]"
          }`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item.id)}
        >
          {droppedItem && (
            <span className="px-2 text-center">
              {droppedItem.text}
            </span>
          )}
        </div>
      );
    })}
  </div>
</div>


           {/* Malayalam Options Column with 8 fixed, droppable boxes */}
<div className="flex flex-col gap-2 sm:gap-3 order-3">
  <h3 className="text-sm sm:text-base font-medium text-center mb-2 text-gray-700 dark:text-white lg:hidden">
    Malayalam Options
  </h3>

  <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
    {Array.from({ length: 8 }).map((_, index) => {
      const option = getAvailableOptions()[index];

      const handleOptionDrop = (e) => {
        e.preventDefault();
        if (draggedItem) {
          const newDropped = { ...droppedItems };

          for (const key in newDropped) {
            if (newDropped[key]?.text === draggedItem.text) {
              delete newDropped[key];
            }
          }

          setDroppedItems(newDropped);
          setDraggedItem(null);
        }
      };

      return (
        <div
          key={index}
          draggable={!!option}
          onDragStart={(e) => option && handleDragStart(e, option)}
          onDragOver={handleDragOver}
          onDrop={handleOptionDrop}
          className={`border rounded text-xs sm:text-sm w-full sm:w-60 lg:w-70 h-10 sm:h-12 flex items-center justify-center transition-shadow 
            ${
              option
                ? "bg-white dark:bg-black dark:text-white border-gray-300 cursor-move hover:shadow-md"
                : "bg-gray-100 dark:bg-black border-gray-300 text-gray-400"
            }`}
        >
          {option ? option.text : ""}
        </div>
      );
    })}
  </div>
</div>

            </div>

            {/* Navigation */}
            <div className="flex flex-row sm:flex-row justify-center gap-4 sm:gap-8 items-center pt-6 sm:pt-8 mt-6 sm:mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 1}
                className="flex items-center border gap-2 px-3 sm:px-4 py-2 bg-white text-black rounded-md shadow hover:text-[#d1d5db] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center text-sm sm:text-base"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                Previous Question
              </button>

              <button
                onClick={handleNext}
                disabled={currentQuestion === totalQuestions}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border text-black rounded-md shadow disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center text-sm sm:text-base"
              >
                Next Question
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDropQuiz;