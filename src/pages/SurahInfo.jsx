import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
const SurahInfo = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-white px-4 py-4 dark:bg-black">
        <div className="max-w-7xl mx-auto flex items-center">
        <Link to="/surah">
          <button  className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-white" />
          </button>
        </Link>

          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Surah Al-Baqarah</h1>
        </div>
      </div>
 
      {/* Content */}
      <div className="w-[1290px] mx-auto px-4 py-6 ">
        {/* Arabic Title */}
        <div className="text-center mb-8 border-b border-gray-200 dark:border-white pb-6">
  <h2 className="text-4xl font-arabic text-black mb-6 dark:text-white">سورة البقرة</h2>
  <div>
    <div className="flex flex-wrap justify-center gap-x-15 gap-y-4 text-sm text-center">
      <div>
        <span className="text-black dark:text-white">Revelation: </span>
        <span className="font-semibold text-black dark:text-white">Madinah</span>
      </div>
      <div>
        <span className="text-black dark:text-white">Revelation Order: </span>
        <span className="font-semibold text-black dark:text-white">87</span>
      </div>
      <div>
        <span className="text-black dark:text-white">Verses: </span>
        <span className="font-semibold text-black dark:text-white">286</span>
      </div>
    </div>

    <div className="flex justify-center gap-x-15 gap-y-4 mt-4">
      <div>
        <span className="text-black dark:text-white">Thafheem Vol: </span>
        <span className="font-semibold text-black dark:text-white">1</span>
      </div>
      <div>
        <span className="text-black dark:text-white">Paragraph: </span>
        <span className="font-semibold text-black dark:text-white">40</span>
      </div>
    </div>
  </div>
</div>



        {/* Name Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-cyan-600 mb-4 ">Name</h3>
          <p className="text-gray-700 leading-relaxed dark:text-white">
            Why the name Al-BAQARAH? Al-BAQARAH (the Cow) has been so named from the story of the Cow occurring in this Surah (vv. 67-73). It has not, however, been 
            used as a title to indicate the subject of the Surah. It will, therefore, be as wrong to translate the name Al-Baqarah into "The Cow" or "The Heifer" as to translate 
            any Surah, say Yaaseen, Al-Hijr, Al-Ahzaab, etc., into their literal meanings. This is the longest Surah and is the first complete Surah to deal with the subject 
            of the Cow. Many more Surahs of the Quran have been named in the same way, because no comprehensive words exist in Arabic (in spite of its richness) to 
            denote the wide scope of the subject discussed in them. As a matter of fact, all human languages suffer from the same limitation.
          </p>
        </div>

        {/* Sequence Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-cyan-600 mb-4">Sequence</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-white">
            Though it is a Madani Surah, it follows naturally a Makki Surah Al-Fatihah, which ended with the prayer: "Show us the straight way." It begins with the answer to 
            that prayer, "This is the Book (that)..." is guidance.
          </p>
          <p className="text-gray-700 leading-relaxed dark:text-white">
            The greater part of Al-Baqara was revealed during the first two years of the Holy Prophet's life at Al-Madinah. The smaller part which was revealed at a later 
            period has been included in this Surah because its contents are closely related to those dealt with in this Surah. For instance, the verses prohibiting interest were 
            revealed during the last period of the Holy Prophet's life but have been inserted in this Surah. For the same reason, the last verses (284-286) of this Surah which 
            were revealed at Makkah before the migration of the Holy Prophet to Al-Madinah have also been included in it.
          </p>
        </div>

        {/* Historical Background Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-cyan-600 mb-4">Historical Background</h3>
          
          <div className="space-y-4 text-gray-700 leading-relaxed dark:text-white">
            <p>
              At Makkah, the Quran generally addressed the mushrik Quraish who were ignorant of Islam, but at Al-Madinah it was also concerned with the Jews who were 
              acquainted with the creed of the Unity of Allah, Prophethood, Revelation, the Hereafter and Angels. They also professed to believe in the law which was revealed 
              by Allah to their Prophet Moses (Allah's peace be upon him), and in principle, their way was the same (Islam) that was being taught by Prophet Muhammad 
              (Allah's peace be upon him).
            </p>
            
            <p>
              But they had strayed away from it during the centuries of degeneration and had adopted many un-Islamic creeds, rites and customs of which there was no 
              mention and for which there was no sanction in the Torah. Not only this: they had tampered with the Torah by inserting their own...
            </p>
            
            <p>
              At Makkah, the Quran generally addressed the mushrik Quraish who were ignorant of Islam, but at Al-Madinah it was also concerned with the Jews who were 
              acquainted with the creed of the Unity of Allah, Prophethood, Revelation, the Hereafter and Angels. They also professed to believe in the law which was revealed 
              by Allah to their Prophet Moses (Allah's peace be upon him), and in principle, their way was the same (Islam) that was being taught by Prophet Muhammad 
              (Allah's peace be upon him).
            </p>
            
            <p>
              But they had strayed away from it during the centuries of degeneration and had adopted many un-Islamic creeds, rites and customs of which there was no 
              mention and for which there was no sanction in the Torah. Not only this: they had tampered with the Torah by inserting their own...
            </p>
            
            <p>
              At Makkah, the Quran generally addressed the mushrik Quraish who were ignorant of Islam, but at Al-Madinah it was also concerned with the Jews who were 
              acquainted with the creed of the Unity of Allah, Prophethood, Revelation, the Hereafter and Angels. They also professed to believe in the law which was revealed 
              by Allah to their Prophet Moses (Allah's peace be upon him), and in principle, their way was the same (Islam) that was being taught by Prophet Muhammad 
              (Allah's peace be upon him).
            </p>
            
            <p>
              But they had strayed away from it during the centuries of degeneration and had adopted many un-Islamic creeds, rites and customs of which there was no 
              mention and for which there was no sanction in the Torah. Not only this: they had tampered with the Torah by inserting their own...
            </p>
            
            <p>
              At Makkah, the Quran generally addressed the mushrik Quraish who were ignorant of Islam, but at Al-Madinah it was also concerned with the Jews who were 
              acquainted with the creed of the Unity of Allah, Prophethood, Revelation, the Hereafter and Angels. They also professed to believe in the law which was revealed 
              by Allah to their Prophet Moses (Allah's peace be upon him), and in principle, their way was the same (Islam) that was being taught by Prophet Muhammad 
              (Allah's peace be upon him).
            </p>
            
            <p>
              But they had strayed away from it during the centuries of degeneration and had adopted many un-Islamic creeds, rites and customs of which there was no 
              mention and for which there was no sanction in the Torah. Not only this: they had tampered with the Torah by inserting their own...
            </p>
            
            <p>
              At Makkah, the Quran generally addressed the mushrik Quraish who were ignorant of Islam, but at Al-Madinah it was also concerned with the Jews who were 
              acquainted with the creed of the Unity of Allah, Prophethood, Revelation, the Hereafter and Angels. They also professed to believe in the law which was revealed 
              by Allah to their Prophet Moses (Allah's peace be upon him), and in principle, their way was the same (Islam) that was being taught by Prophet Muhammad 
              (Allah's peace be upon him).
            </p>
            
            <p>
              But they had strayed away from it during the centuries of degeneration and had adopted many un-Islamic creeds, rites and customs of which there was no 
              mention and for which there was no sanction in the Torah. Not only this: they had tampered with the Torah by inserting their own...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurahInfo;