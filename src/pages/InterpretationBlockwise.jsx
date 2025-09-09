import React from "react";
import InterpretationNavbar from "../components/InterpretationNavbar";

const InterpretationBlockwise = () => {
  return (
    <>
    <div>

      <InterpretationNavbar interpretationNumber={1} />
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-[#2A2C38]">
        <div className="space-y-6">
          {/* Main Content Block */}
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 dark:bg-[#2A2C38] dark:border-[#2A2C38] border-white">
            <p className="text-gray-800  dark:text-white leading-relaxed text-justify">
              <span className="font-normal font-poppins">1.</span> The names of letters of
              the Arabic alphabet, called huruf muqattaat, occur at the
              beginning of several surahs of the Qur'an. At the time of the
              Qur'anic revelation the use of such letters was a well-known
              literary device, used by both poets and orators, and we find
              several instances in the pre-Islamic Arabic literature that has
              come down to us. Since the muqattaat were commonly used the Arabs
              of that period generally knew what they meant and so they did not
              present a puzzle. We do not notice, therefore, any contemporaries
              of the Prophet (peace be on him) raising objections against the
              Qur'an on the ground that the letters at the beginning of some of
              its surahs were absurd. For the same reason no Tradition has come
              down to us of any Companion asking the Prophet about the
              significance of the muqattaat. Later on this literary device
              gradually fell into disuse and hence it became difficult for
              commentators to determine their precise meanings. It is obvious,
              however, that deriving right guidance from the Qur'an does not
              depend on grasping the meaning of these vocables, and that anyone
              who fails to understand them may still live a righteous life and
              attain salvation. The ordinary reader, therefore, need not delve
              too deeply into this matter.
            </p>
          </div>

          {/* Navigation Block */}
          <div className="flex justify-between items-center pt-8 ">
            <button className="flex items-center px-4 py-2 border dark:bg-[#2A2C38] dark:hover:text-white  dark:text-white border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors bg-white">
              <span className="mr-2">←</span>
              <span>Previous Ayah</span>
            </button>

            <button className="flex items-center px-4 py-2 border dark:bg-[#2A2C38] dark:hover:text-white dark:text-white border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors bg-white">
              <span>Next Ayah</span>
              <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default InterpretationBlockwise;
