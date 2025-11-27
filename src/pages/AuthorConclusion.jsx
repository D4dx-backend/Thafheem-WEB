import React from "react";

const CONCLUSION_CONTENT = `
<p class="eng">
I express my gratitude to Allah the Highest from the bottom of my heart; the difficult task of writing Tafheem al-Quran, which I began in the month of Muharram 1361 AH (February 1942), has now come to an end after 30 years and four months. It is the immense blessing and generosity of Allah that He has bestowed upon a humble servant of His to render such service to the Holy Book of Allah. Whatever truth is in this book has come about through the light and guidance of the Almighty. If I have made any mistake in translating and interpreting the Quran, it is due to my knowledge and understanding. But - Alhamdulillah - I have not made any mistake knowingly. If I have made any mistake unknowingly, I hope in the mercy of Allah; He will forgive me. If this effort of mine has helped in any way in the guidance of His servants, I pray that He may make it a means of expiation for my sins. I also have a request to the world of scholars: May they awaken me to my mistakes. I will correct anything that convinces me with evidence that it is wrong - Insha Allah. I seek refuge in Allah from knowingly making a mistake in the Book of Allah or persisting in a mistake.<br><br>

As the title of this book suggests, I have tried to explain the Holy Quran to the literate common people as I have understood it. To explain the ideas and interests of the Quran so that they can find its spirit, to resolve the doubts that arise in the mind while reading the Quran or its mere translation, to analyze and explain the things that are stated briefly and concisely in the Quran — this was my aim. To explain more was not my aim at the beginning. Therefore, the commentary notes in the first volumes are brief. Later, as I progressed, the need for more interpretation became felt. To the extent that those who read the last volumes now begin to feel that the first volumes are dry. However, one of the benefits of the repetition of topics in the Quran is that the topics that are explained dryly in one place are later discussed in other surahs in detail in the commentary of the later surahs. It is my hope that those who read the Holy Quran once and do not finish it, but reread the entire book, will find the commentary of the last Surahs to be a sufficient guide to understand the first Surahs.<br><br>

Abul-A'la Maududi<br>
Lahore<br>
Multan<br>
24 Rabi'ul-Aqar 1392 AH<br>
(7 June 1972 AD)<br>
</p>
`;

const AuthorConclusion = () => {
  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="sm:max-w-[1070px] max-w-[350px] w-full mx-auto font-poppins">
        <h2 className="text-2xl font-bold mb-4 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2">
          Author's Conclusion
        </h2>

        <div
          className="prose prose-base dark:prose-invert prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-p:text-gray-700 dark:prose-p:text-gray-300 leading-7 text-justify"
          dangerouslySetInnerHTML={{ __html: CONCLUSION_CONTENT }}
        />
      </div>
    </div>
  );
};

export default AuthorConclusion;


