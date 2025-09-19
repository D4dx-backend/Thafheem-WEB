import React from 'react';

const TableContents = () => {
  const malayalamSymbols = [
    {
      category: "Chapter:",
      description: "In the technical language of the Quran, what is called 'Surah' is translated as chapter. The Quran is divided into one hundred and fourteen sections. Each such divided section is a Surah. The division and naming of Surahs is divine. The main theme of each Surah will be a part of the original subject of the Quran or any subject related to it."
    },
    {
      category: "Revelation:",
      description: "After receiving prophethood, Prophet Muhammad (peace be upon him) lived in Makkah for about thirteen years and in Madinah for about ten years. The Surahs revealed during his stay in Makkah are called Makki Surahs and those revealed after migration to Madinah are called Madani Surahs. The place of revelation of each Surah is shown at the beginning of the respective Surahs in this translation."
    }
  ];

  const verseSymbols = [
    {
      category: "Section:",
      description: "For ease of recitation, the Quran is divided into thirty Juz' (parts). Each Juz' is divided into several Ruku's. The number of Ruku's contained in each chapter is shown as a section at the beginning of the chapter."
    },
    {
      category: "Verse:",
      description: "What is called 'Ayat' in technical language is translated as verse. Ayat are the individual sentences in the Surah. The scope of the verses is determined by Allah. In the Arabic original, the verses in each Surah are separated by adding serial numbers in between. In the Malayalam translation, the verses are not separated individually. The serial number of the verses contained in each section is given at its beginning. If there is a '-' mark before or after the verse number, it means that the translation of that verse is not complete in the given section. Example: 15-17- indicates that the translation of verse 17 is only partially included in this section. When shown as -17-22, it means that the translation of verse 17 is partially included in the previous section."
    }
  ];

  const arabicSymbols = [
    { symbol: "ج", meaning: "Pause is preferred" },
    { symbol: "ز", meaning: "Pause is prohibited" },
    { symbol: "ص", meaning: "Pause is mandatory" },
    { symbol: "ق", meaning: "Pause and continuation are equal" },
    { symbol: "", meaning: "Pause at one of two places only" },
    { symbol: "لا", meaning: "Pause is optional but continuation is preferred" },
    { symbol: "ل", meaning: "Isolated letter should not be pronounced" },
    { symbol: "", meaning: "Letter should not be pronounced when joined" },
    { symbol: "", meaning: "Closed vowel sound" },
    { symbol: "م", meaning: "Pronounced between and based on closed Meem" },
    { symbol: "ن", meaning: "Pronounce Tanween clearly" },
    { symbol: "", meaning: "Tanween should be merged or hidden" },
    { symbol: "ل", meaning: "Must pronounce the omitted letter" },
    { symbol: "عه", meaning: "Must pronounce liquid as 'Seen'. When (عه) appears before the letter, pronounce it as 'Saad'" },
    { symbol: "", meaning: "Must elongate more than usual" },
    { symbol: "۝", meaning: "Facilitation prostration - verse requiring prostration is underlined" },
    { symbol: "۞", meaning: "Symbol indicating start of Juz, half Juz (Hizb), ¼ Hizb, 1/8 Hizb" },
    { symbol: "۩", meaning: "End of verse and verse number" }
  ];

  return (
    
    <div className="w-full mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 font-poppins">
      <div className="w-full max-w-[1070px] mx-auto px-4 sm:px-0">
      <div className="border-b-2 border-gray-900 dark:border-white pb-2 mb-6">
  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
    Symbols Guide
  </h1>
</div>

      {/* Malayalam Translation Section */}
      <section className="mb-6 sm:mb-8 ]">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 pb-2 dark:text-white">
          Symbols in Malayalam Translation
        </h2>
        <div className="space-y-4">
          {malayalamSymbols.map((item, index) => (
            <div key={index} className="p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-[#4FAEC7] mb-2 text-sm sm:text-base">{item.category}</h3>
              <p className="text-gray-700 leading-relaxed dark:text-white text-sm sm:text-base">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Verses Section */}
      <section className="mb-6 sm:mb-8">
  
        <div className="space-y-4">
          {verseSymbols.map((item, index) => (
            <div key={index} className="p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-[#4FAEC7] mb-2 text-sm sm:text-base">{item.category}</h3>
              <p className="text-gray-700 leading-relaxed dark:text-white text-sm sm:text-base">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Arabic Text Symbols Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-white  pb-2">
          Symbols in Arabic Text
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full  bg-white dark:bg-gray-900  shadow-lg rounded-lg">
            <thead>
              <tr className="">
                <th className=" dark:text-white  px-4 py-3 text-left font-semibold ">
                  Symbol
                </th>
                <th className=" dark:text-white  px-4 py-3 text-left font-semibold ">
                  Meaning
                </th>
              </tr>
            </thead>
            <tbody>
              {arabicSymbols.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? " dark:bg-gray-900" : "bg-white dark:bg-gray-900"}>
                  <td className=" px-4 py-3 text-center text-xl font-bold dark:text-white ">
                  <div className="w-[53px] h-[53px] bg-white dark:bg-gray-900 border border-gray-200 rounded-xl shadow-md flex items-center justify-center">
  {item.symbol || "—"}
</div>

                  </td>
                  <td className=" px-4 py-3 text-gray-700 dark:text-white">
                  <div className=' h-[53px]'>
                  {item.meaning}
                  </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>


      {/* Footer */}
      <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-400 px-4 sm:px-0">
        <p>This guide helps in understanding the various symbols used in Quranic text and translation.</p>
      </div>
      </div>
    </div>
  );
};

export default TableContents;