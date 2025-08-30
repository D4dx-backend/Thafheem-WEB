// import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight, ArrowLeft, X, Search,ChevronDown  } from 'lucide-react';

// const Quiz = () => {
//   const [currentQuestion, setCurrentQuestion] = useState(1);
//   const [selectedAnswer, setSelectedAnswer] = useState('B');
//   const [showAnswer, setShowAnswer] = useState(true);
//   const [score, setScore] = useState(0);
//   const [showSurahDropdown, setShowSurahDropdown] = useState(false);
//   const [activeTab, setActiveTab] = useState('Surah');

//   const quizData = {
//     title: "തഹാഫീസ് പ്രശ്നോത്തരി",
//     totalQuestions: 5,
//     questions: [
//       {
//         id: 1,
//         question: "ഖുർആന്റെ പാരായണത്തിനായി ക്ഷേത്രനിർമാണ് അല്ലാഹു പഠിപ്പിച്ച പ്രാർത്ഥന?",
//         options: [
//           { id: 'A', text: 'തത്ത്വ കത്തിത' },
//           { id: 'B', text: 'തഖ്വീർ' },
//           { id: 'C', text: 'ആയത്തുൽ കുര്സി 191, 193' }
//         ],
//         correctAnswer: 'A'
//       }
//     ]
//   };

//   const surahList = [
//     { id: 1, name: "Al-Fatihah", verseStart: 1, verseEnd: 7 },
//     { id: 2, name: "Al-Fatihah", verseStart: 8, verseEnd: 20 },
//     { id: 3, name: "Al-Fatihah", verseStart: 30, verseEnd: 39 },
//     { id: 4, name: "Al-Fatihah", verseStart: 40, verseEnd: 46 },
//     { id: 5, name: "Al-Fatihah", verseStart: 47, verseEnd: 59 },
//     { id: 6, name: "Al-Fatihah", verseStart: 60, verseEnd: 61 },
//     { id: 7, name: "Al-Fatihah", verseStart: 62, verseEnd: 71 },
//     { id: 8, name: "Al-Fatihah", verseStart: 72, verseEnd: 82 },
//     { id: 9, name: "Al-Fatihah", verseStart: 83, verseEnd: 86 },
//     { id: 10, name: "Al-Fatihah", verseStart: 87, verseEnd: 96 },
//     { id: 11, name: "Al-Fatihah", verseStart: 97, verseEnd: 103 }
//   ];

//   const currentQuestionData = quizData.questions[currentQuestion - 1];

//   const handleAnswerSelect = (answerId) => {
//     setSelectedAnswer(answerId);
//   };

//   const handlePrevious = () => {
//     if (currentQuestion > 1) {
//       setCurrentQuestion(currentQuestion - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentQuestion < quizData.totalQuestions) {
//       setCurrentQuestion(currentQuestion + 1);
//     }
//   };

//   const toggleSurahDropdown = () => {
//     setShowSurahDropdown(!showSurahDropdown);
//   };

//   return (
//     <div className="min-h-screen dark:bg-black bg-gray-100">
//       {/* Top Navigation Bar */}
//       <div className="bg-white border-b border-gray-700">
//       <div className="max-w-7xl mx-auto px-4 py-2">
//         <div className="flex items-center justify-between">
//           {/* Left: Surah + Range */}
//           <div className="flex items-center gap-3">
//             {/* Surah Dropdown */}
//             <div
//               className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded ]"
//               onClick={toggleSurahDropdown}
//             >
//               <span className="text-black font-medium">Al-Fatihah</span>
//               <ChevronDown className="w-4 h-4 text-black" />
//             </div>

//             {/* Divider */}
//             <span className="text-black">|</span>

//             {/* Verse Range */}
//             <span className="text-sm text-black">1 - 7</span>
//           </div>

//           {/* Right: Radio buttons */}
//           <div className="flex items-center gap-6">
//             {/* Entire Surah */}
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="scope"
//                 defaultChecked
//                 className="form-radio text-blue-500 focus:ring-0"
//               />
//               <span className="text-sm text-gray-300">Entire Surah</span>
//             </label>

//             {/* Entire Thafheem */}
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="scope"
//                 className="form-radio text-blue-500 focus:ring-0"
//               />
//               <span className="text-sm text-gray-300">Entire Thafheem</span>
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>

//       {/* Header */}
//       <div className="bg-white dark:bg-black shadow-sm border-b">
//         <div className="max-w-5xl mx-auto px-4 py-3 ">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <ArrowLeft className="w-5 h-5 text-gray-600 " />
//               <h1 className="text-xl font-semibold " style={{ color: '#2AA0BF' }}>
//                 {quizData.title}
//               </h1>
//             </div>
//             <div className="text-sm text-gray-600 dark:text-white">
//               <span>മാർക്ക്: {score}</span>
//               <span className="ml-4">Total: {quizData.totalQuestions}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-5xl mx-auto px-4 py-6">
//         {/* Question Container */}
//         <div className="bg-white dark:bg-[#323A3F] rounded-lg shadow-sm border p-6 mb-4">
//           {/* Question Number */}
//           <div className="mb-4">
//             <span className="text-sm text-gray-600 dark:text-white">
//               ചോദ്യം: {currentQuestion} / {quizData.totalQuestions}
//             </span>
//           </div>

//           {/* Question Text */}
//           <div className="mb-6">
//             <p className="text-lg text-gray-800 leading-relaxed dark:text-white">
//               {currentQuestionData.question}
//             </p>
//           </div>

//           {/* Answer Options */}
//           <div className="space-y-3 mb-6">
//             {currentQuestionData.options.map((option) => (
//               <label
//                 key={option.id}
//                 className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer dark:hover:bg-[#323A3F] hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex items-center">
//                   <span className="text-sm font-medium text-gray-700 mr-3 dark:text-white">
//                     {option.id}
//                   </span>
//                   <input
//                     type="radio"
//                     name="answer"
//                     value={option.id}
//                     checked={selectedAnswer === option.id}
//                     onChange={() => handleAnswerSelect(option.id)}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                 </div>
//                 <span className="text-gray-700 dark:text-white">{option.text}</span>
//               </label>
//             ))}
//           </div>

//           {/* Additional Info */}
//           <div className="text-sm text-gray-600 mb-4 dark:text-white">
//             <p>നഇറ്റുകള്‍ കപ്രയ്അമ്സ്പദ് പ്രകാശിത്രസന്തിനില്‍ ഇഷത, രമരലത്യവ്ലുക.</p>
//           </div>

//           {/* Navigation */}
//           <div className="flex justify-between items-center">
//             <button
//               onClick={handlePrevious}
//               disabled={currentQuestion === 1}
//               className="flex items-center gap-2 px-4 py-2 dark:bg-black dark:text-white dark:border dark:hover:text-white rounded-2xl text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft className="w-4 h-4" />
//               Previous Question
//             </button>
            
//             <button
//               onClick={handleNext}
//               disabled={currentQuestion === quizData.totalQuestions}
//               className="flex items-center gap-2 px-4 py-2 dark:text-white dark:bg-black  dark:border dark:hover:text-white rounded-2xl text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next Question
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Answer Feedback */}
//         {showAnswer && (
//           <div className="bg-red-50 border dark:bg-[#323A3F] border-red-200 rounded-lg p-4">
//             <div className="text-red-700">
//               <p className="font-medium mb-1 dark:text-white">Sorry...!</p>
//               <p className="text-sm dark:text-white">
//                 Answer: <span style={{ color: '#2AA0BF' }}>A) തത്ത്വ കത്തിത</span>
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Surah Selection Modal */}
//       {showSurahDropdown && (
//   <div className="fixed inset-0  bg-opacity-30 flex items-start justify-center pt-20 z-50">
//     <div className="bg-white dark:bg-[#2A2C38] rounded-2xl shadow-xl w-96 max-h-[80vh] flex flex-col overflow-hidden">
      
//       {/* Modal Header */}
//       <div className="flex items-center justify-between p-4 border-b">
//         {/* Tabs */}
//         <div className="flex bg-gray-100 dark:bg-black rounded-full p-1">
//           <button
//             className={`px-4 py-1 text-sm rounded-full transition ${
//               activeTab === "Surah"
//                 ? "bg-white shadow text-gray-900 dark:bg-[#2A2C38] dark:text-white"
//                 : "text-gray-500"
//             }`}
//             onClick={() => setActiveTab("Surah")}
//           >
//             Surah
//           </button>
//           <button
//             className={`px-4 py-1 text-sm rounded-full transition ${
//               activeTab === "Verse"
//                 ? "bg-white shadow text-gray-900 dark:bg-[#2A2C38] dark:text-white"
//                 : "text-gray-500"
//             }`}
//             onClick={() => setActiveTab("Verse")}
//           >
//             Verse
//           </button>
//         </div>

//         {/* Close Button */}
//         <button
//           onClick={toggleSurahDropdown}
//           className="text-gray-400 hover:text-gray-600"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Tip */}
//       <div className="px-4 py-2 text-xs text-gray-500 border-b">
//         Tip: try navigating with{" "}
//         <kbd className="bg-gray-100 px-1 rounded">Ctrl</kbd>{" "}
//         <kbd className="bg-gray-100 px-1 rounded">K</kbd>
//       </div>

//       {/* Search Fields */}
//       <div className="p-4 border-b flex gap-2">
//         <div className="flex-1 relative">
//           <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search Surah"
//             className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:placeholder:text-white dark:text-white"
//           />
//         </div>
//         <input
//           type="text"
//           placeholder="Verse"
//           className="w-20 px-3 py-2 text-sm bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:placeholder:text-white dark:text-white"
//         />
//       </div>

//       {/* Surah List */}
//       <div className="overflow-y-auto">
//         {surahList.map((surah) => (
//           <div
//             key={surah.id}
//             className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm ${
//               surah.id === 1 ? "bg-gray-100 dark:bg-black dark:text-white rounded-lg mx-2" : "hover:bg-gray-50 dark:hover:bg-black "
//             }`}
//             onClick={() => setShowSurahDropdown(false)}
//           >
//             <div className="flex items-center gap-3">
//               <span className="text-gray-500 w-6 dark:text-white">{surah.id}.</span>
//               <span className="text-gray-800 dark:text-white">{surah.name}</span>
//             </div>
//             <div className="flex items-center gap-2 text-gray-600">
//               <span>{surah.verseStart}</span>
//               <span>-</span>
//               <span>{surah.verseEnd}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// export default Quiz;


import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, X, Search, ChevronDown } from 'lucide-react';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState('B');
  const [showAnswer, setShowAnswer] = useState(true);
  const [score, setScore] = useState(0);
  const [showSurahDropdown, setShowSurahDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('Surah');

  const quizData = {
    title: "തഹാഫീസ് പ്രശ്നോത്തരി",
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        question: "ഖുർആന്റെ പാരായണത്തിനായി ക്ഷേത്രനിർമാണ് അല്ലാഹു പഠിപ്പിച്ച പ്രാർത്ഥന?",
        options: [
          { id: 'A', text: 'തത്ത്വ കത്തിത' },
          { id: 'B', text: 'തഖ്വീർ' },
          { id: 'C', text: 'ആയത്തുൽ കുര്സി 191, 193' }
        ],
        correctAnswer: 'A'
      }
    ]
  };

  const surahList = [
    { id: 1, name: "Al-Fatihah", verseStart: 1, verseEnd: 7 },
    { id: 2, name: "Al-Fatihah", verseStart: 8, verseEnd: 20 },
    { id: 3, name: "Al-Fatihah", verseStart: 30, verseEnd: 39 },
    { id: 4, name: "Al-Fatihah", verseStart: 40, verseEnd: 46 },
    { id: 5, name: "Al-Fatihah", verseStart: 47, verseEnd: 59 },
    { id: 6, name: "Al-Fatihah", verseStart: 60, verseEnd: 61 },
    { id: 7, name: "Al-Fatihah", verseStart: 62, verseEnd: 71 },
    { id: 8, name: "Al-Fatihah", verseStart: 72, verseEnd: 82 },
    { id: 9, name: "Al-Fatihah", verseStart: 83, verseEnd: 86 },
    { id: 10, name: "Al-Fatihah", verseStart: 87, verseEnd: 96 },
    { id: 11, name: "Al-Fatihah", verseStart: 97, verseEnd: 103 }
  ];

  const currentQuestionData = quizData.questions[currentQuestion - 1];

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const toggleSurahDropdown = () => {
    setShowSurahDropdown(!showSurahDropdown);
  };

  return (
    <div className="min-h-screen dark:bg-black bg-white">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-700 relative">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Left: Surah + Range */}
            <div className="flex items-center gap-3 relative">
              {/* Surah Dropdown Button */}
              <div
                className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded"
                onClick={toggleSurahDropdown}
              >
                <span className="text-black font-medium">Al-Fatihah</span>
                <ChevronDown className="w-4 h-4 text-black" />
              </div>
              

              {/* Verse Range */}
              <span className="text-sm text-black">| 1 - 7</span>
              <div className="flex items-center gap-6">
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name="scope"
      defaultChecked
      className="form-radio text-black focus:ring-0"
    />
    <span className="text-sm text-gray-300">Entire Surah</span>
  </label>
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name="scope"
      className="form-radio text-black focus:ring-0"
    />
    <span className="text-sm text-gray-300">Entire Thafheem</span>
  </label>
</div>

              {/* Dropdown (Positioned Below Button) */}
              {showSurahDropdown && (
                <div className="absolute left-0 top-full mt-2 bg-white dark:bg-[#2A2C38] rounded-2xl shadow-xl w-96 max-h-[70vh] overflow-hidden z-50">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    {/* Tabs */}
                    <div className="flex bg-gray-100 dark:bg-black rounded-full p-1">
                      <button
                        className={`px-4 py-1 text-sm rounded-full transition ${
                          activeTab === "Surah"
                            ? "bg-white shadow text-gray-900 dark:bg-[#2A2C38] dark:text-white"
                            : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("Surah")}
                      >
                        Surah
                      </button>
                      <button
                        className={`px-4 py-1 text-sm rounded-full transition ${
                          activeTab === "Verse"
                            ? "bg-white shadow text-gray-900 dark:bg-[#2A2C38] dark:text-white"
                            : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("Verse")}
                      >
                        Verse
                      </button>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={toggleSurahDropdown}
                      className="text-black hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search Fields */}
                  <div className="p-4 border-b flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search Surah"
                        className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:placeholder:text-white dark:text-white"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Verse"
                      className="w-20 px-3 py-2 text-sm bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:placeholder:text-white dark:text-white"
                    />
                  </div>

                  {/* Surah List */}
                  <div className="overflow-y-auto max-h-[50vh]">
                    {surahList.map((surah) => (
                      <div
                        key={surah.id}
                        className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm ${
                          surah.id === 1
                            ? "bg-gray-100 dark:bg-black dark:text-white rounded-lg mx-2"
                            : "hover:bg-gray-50 dark:hover:bg-black"
                        }`}
                        onClick={() => setShowSurahDropdown(false)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-black w-6 dark:text-white">{surah.id}.</span>
                          <span className="text-black dark:text-white">{surah.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-black">
                          <span>{surah.verseStart}</span>
                          <span>-</span>
                          <span>{surah.verseEnd}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Radio buttons */}
            {/* <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="scope" defaultChecked className="form-radio text-blue-500 focus:ring-0" />
                <span className="text-sm text-gray-300">Entire Surah</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="scope" className="form-radio text-blue-500 focus:ring-0" />
                <span className="text-sm text-gray-300">Entire Thafheem</span>
              </label>
            </div> */}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-black shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-gray-600 " />
              <h1 className="text-xl font-semibold " style={{ color: '#2AA0BF' }}>
                {quizData.title}
              </h1>
            </div>
            <div className="text-sm text-gray-600 dark:text-white">
              <span>മാർക്ക്: {score}</span>
              <span className="ml-4">Total: {quizData.totalQuestions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Question */}
        <div className=" dark:bg-[#323A3F] rounded-lg  p-6 mb-4">
          <div className='bg-[#EBEEF0] p-2 mb-4 rounded-lg'>
          <div className="mb-4 ">
            <span className="text-sm text-gray-600 dark:text-white">
              ചോദ്യം: {currentQuestion} / {quizData.totalQuestions}
            </span>
          </div>
          <div className="mb-6">
            <p className="text-lg text-gray-800 leading-relaxed dark:text-white">
              {currentQuestionData.question}
            </p>
          </div>
          </div>

          <div className="space-y-3 mb-6">
  {currentQuestionData.options.map((option) => (
    <label
      key={option.id}
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer dark:hover:bg-[#323A3F] hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center p-4 justify-center w-6 h-6 rounded-lg bg-[#EBEEF0] font-semibold text-gray-800 dark:bg-gray-700 dark:text-white">
          {option.id}
        </span>
        <input
          type="radio"
          name="answer"
          value={option.id}
          checked={selectedAnswer === option.id}
          onChange={() => handleAnswerSelect(option.id)}
          className="w-4 h-4 text-black focus:ring-0 border-gray-400"
        />
      </div>
      <div className='flex items-center p-4 w-full  rounded-lg bg-[#EBEEF0] font-semibold text-gray-800 dark:bg-gray-700 dark:text-white'>
      <span className="text-gray-700 dark:text-white">{option.text}</span>

      </div>
    </label>
  ))}
</div>

          <div className="text-sm text-gray-600 mb-4 dark:text-white">
            <p>നഇറ്റുകള്‍ കപ്രയ്അമ്സ്പദ് പ്രകാശിത്രസന്തിനില്‍ ഇഷത, രമരലത്യവ്ലുക.</p>
          </div>
          <div className="flex justify-center items-center gap-12">
  <button
    onClick={handlePrevious}
    disabled={currentQuestion === 1}
    className="flex items-center gap-2 px-4 py-2 bg-white border dark:bg-black dark:text-white dark:border rounded-2xl text-gray-600 hover:text-gray-800 disabled:opacity-50"
  >
    <ChevronLeft className="w-4 h-4" /> Previous Question
  </button>

  <button
    onClick={handleNext}
    disabled={currentQuestion === quizData.totalQuestions}
    className="flex items-center gap-2 px-4 py-2 bg-white border dark:bg-black dark:text-white dark:border rounded-2xl text-gray-600 hover:text-gray-800 disabled:opacity-50"
  >
    Next Question <ChevronRight className="w-4 h-4" />
  </button>
</div>

        </div>

        {showAnswer && (
          <div className="bg-[#EBEEF0]  dark:bg-[#323A3F] border-red-200 rounded-lg p-4">
            <div className="text-black">
              <p className="font-medium mb-1 dark:text-white">Sorry...!</p>
              <p className="text-sm dark:text-white text-black">
                Answer: <span style={{ color: '#2AA0BF' }}>A) തത്ത്വ കത്തിത</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
