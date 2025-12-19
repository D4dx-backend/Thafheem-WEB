import React from "react";

const EnglishTranslate = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-poppins overflow-x-hidden">
      <div className="max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
            English Translation
          </h1>
          
          <div className="mt-4 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7 overflow-hidden">
          <div
            className="prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 break-words overflow-wrap-anywhere font-poppins"
            style={{
              lineHeight: 1.8,
              textAlign: "justify",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              maxWidth: "100%",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <p className="eng">
              Ever since its completion in 1972, Tafheemul quran has been translated into many international languages. In the English language, translation of Tafhim was undertaken twice.  It was first translated by Late Chaudhry Muhammad Akbar of Sialkot in whose house Maulana Maududi used to stay whenever he visited Dr. Iqbal's home town. His translation was in 5 volumes, last of which was rendered into English by his associate Abdul Aziz Kamal. Chaudhry Muhammad Akbar's translation ends at chapter Al-Hajj but was edited and made ready for publication by Mr. A.A Kamal M.A. Despite their pioneering efforts it was felt that their translations were not up to the desired standards. Hence it was decided with the concurrence of Maulana himself to ask Dr. Zafar Ishaq Ansari to undertake a new translation which he had finished up to chapter Al-Nur (as published by MMI, New Delhi). However Dr. Ansari has not only completed the translation of the whole of the Arabic text up to the end but has also revised his own translation done up to the chapter Al-Nur making necessary corrections, amendments and improvements as stated by him in his preface to the one-volume abridged edition. He also translated The Introduction of the Tafseer written by Syed Abul Aala Maududi in Urdu into English.  While the translation of the Qur'anic text is entirely Dr Ansari's effort,(in Towards Understanding the Quran), He has been ably assisted in the explanatory notes by Dr A R Kidwai of the Islamic Foundation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnglishTranslate;
