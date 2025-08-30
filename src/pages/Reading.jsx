import { Share2, Bookmark, Play,Heart } from "lucide-react";
import { Link } from "react-router-dom";
import HomepageNavbar from "../components/HomeNavbar";
import Transition from "../components/Transition";
import { ChevronLeft, ChevronRight, ArrowUp, X } from "lucide-react";
const Reading = () => {
  return (
    <>
      {/* <HomepageNavbar /> */}
      <Transition showPageInfo={true} />

      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Header */}
        <div className="bg-white px-4 py-8 dark:bg-black">
          <div className="max-w-4xl mx-auto text-center">
            {/* Toggle Buttons */}
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-1">
                <div className="flex items-center">
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:hover:bg-gray-800 dark:text-white hover:bg-gray-50 rounded-full text-sm font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    </svg>
                    <Link to="/surah">
                      <span className="text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
                        Translation
                      </span>
                    </Link>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-black dark:text-white text-gray-900 rounded-full text-sm font-medium shadow-sm">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10,9 9,9 8,9" />
                    </svg>
                    <span>Reading</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Surah Title */}
            <div className="mb-6">
              <h1 className="text-5xl font-arabic text-gray-900 dark:text-white mb-4">
                البقرة
              </h1>

              {/* Action Icons */}
              <div className="flex items-center justify-center space-x-4 mb-6">
              <button
  className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    {/* Crescent moon on top */}
    <path d="M12 2c-1 0-1.5 1-1 2s1.5 1 1 2" />

    {/* Main dome */}
    <path d="M7 10c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />

    {/* Minaret */}
    <rect x="4" y="4" width="1.5" height="8" />
    <circle cx="4.75" cy="3.5" r="0.5" />

    {/* Base structure */}
    <path d="M3 18h18" />
    <path d="M4 18v-7" />
    <path d="M20 18v-7" />
    <path d="M7 18v-8" />
    <path d="M17 18v-8" />

    {/* Entrance arch */}
    <path d="M10 18v-4c0-1 0.9-2 2-2s2 1 2 2v4" />
  </svg>
</button>

        <button
          className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          
        >
          <Heart className="w-5 h-5" />
        </button>
              </div>

              {/* Bismillah */}
              <div className="mb-8">
                <p className="text-3xl font-arabic dark:text-white text-gray-800 leading-relaxed">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>

              {/* Bottom Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full"></div>
                  <Link to="/surahinfo">
                    <span className="text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
                      Surah Info
                    </span>
                  </Link>
                </div>

                <button className="flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 transition-colors">
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">Play Audio</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Content */}

        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* First Block - Highlighted */}
          <div className="bg-white dark:bg-black rounded-lg p-6 mb-6">
            <div className="text-center">
              <p className="text-2xl font-arabic leading-loose dark:text-white text-gray-900 mb-4 bg-[#E7F0F3]">
                الم ﴿١﴾ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى
                لِّلْمُتَّقِينَ
              </p>
              <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
                الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ
                وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ ﴿٢﴾
              </p>
              <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
                وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن
                قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ ﴿٣﴾
              </p>
              <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
                أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ
                الْمُفْلِحُونَ ﴿٤﴾
              </p>
              <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
                إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ
                لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ ﴿٥﴾
              </p>
              <div className="text-center text-gray-500 mb-2">2</div>
              <hr className="w-1/2 mx-auto border-gray-300 shadow-sm" />

              <div className="text-center">
                <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
                  خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ
                  وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ
                  ﴿٦﴾
                </p>
                <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
                  وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ
                  الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ
                </p>
                <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
                  يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا وَمَا يَخْدَعُونَ
                  إِلَّا أَنفُسَهُمْ وَمَا يَشْعُرُونَ ﴿٧﴾
                </p>
                <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
                  فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ
                  عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ ﴿٨﴾
                </p>
                <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
                  وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا فِي الْأَرْضِ قَالُوا
                  إِنَّمَا نَحْنُ مُصْلِحُونَ ﴿٩﴾
                </p>
                <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
                   فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ
                  عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ ﴿١٠﴾
                </p>
                <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
                  وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا فِي الْأَرْضِ قَالُوا
                  إِنَّمَا نَحْنُ مُصْلِحُونَ ﴿١١﴾
                </p>
                <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
                  أَلَا إِنَّهُمْ هُمُ الْمُفْسِدُونَ وَلَٰكِن لَّا يَشْعُرُونَ
                  ﴿١٢﴾
                </p>

                <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
                  وَإِذَا قِيلَ لَهُمْ آمِنُوا كَمَا آمَنَ النَّاسُ قَالُوا
                  أَنُؤْمِنُ كَمَا آمَنَ السُّفَهَاءُ ۗ أَلَا إِنَّهُمْ هُمُ
                  السُّفَهَاءُ وَلَٰكِن لَّا يَعْلَمُونَ ﴿١٣﴾
                </p>

                <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
                  وَإِذَا لَقُوا الَّذِينَ آمَنُوا قَالُوا آمَنَّا وَإِذَا
                  خَلَوْا إِلَىٰ شَيَاطِينِهِمْ قَالُوا إِنَّا مَعَكُمْ إِنَّمَا
                  نَحْنُ مُسْتَهْزِئُونَ ﴿١٤﴾
                </p>

                <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
                  اللَّهُ يَسْتَهْزِئُ بِهِمْ وَيَمُدُّهُمْ فِي طُغْيَانِهِمْ
                  يَعْمَهُونَ ﴿١٥﴾
                </p>

                <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
                  أُولَٰئِكَ الَّذِينَ اشْتَرَوُا الضَّلَالَةَ بِالْهُدَىٰ فَمَا
                  رَبِحَت تِّجَارَتُهُمْ وَمَا كَانُوا مُهْتَدِينَ ﴿١٦﴾
                </p>
                <div className="text-center text-gray-500 mb-2">3</div>
                <hr className="w-1/2 mx-auto border-gray-300 shadow-sm" />

                <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white"></p>
              </div>



              <div className="text-center">
              <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
  مَثَلُهُمْ كَمَثَلِ الَّذِي اسْتَوْقَدَ نَارًا فَلَمَّا أَضَاءَتْ مَا حَوْلَهُ ذَهَبَ اللَّهُ بِنُورِهِمْ وَتَرَكَهُمْ فِي ظُلُمَاتٍ لَّا يُبْصِرُونَ ﴿١٧﴾
</p>

<p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
  صُمٌّ بُكْمٌ عُمْيٌ فَهُمْ لَا يَرْجِعُونَ ﴿١٨﴾
</p>

<p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
  أَوْ كَصَيِّبٍ مِّنَ السَّمَاءِ فِيهِ ظُلُمَاتٌ وَرَعْدٌ وَبَرْقٌ يَجْعَلُونَ أَصَابِعَهُمْ فِي آذَانِهِم مِّنَ الصَّوَاعِقِ حَذَرَ الْمَوْتِ ۚ وَاللَّهُ مُحِيطٌ بِالْكَافِرِينَ ﴿١٩﴾
</p>

<p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
  يَكَادُ الْبَرْقُ يَخْطَفُ أَبْصَارَهُمْ ۖ كُلَّمَا أَضَاءَ لَهُم مَّشَوْا فِيهِ وَإِذَا أَظْلَمَ عَلَيْهِمْ قَامُوا ۚ وَلَوْ شَاءَ اللَّهُ لَذَهَبَ بِسَمْعِهِمْ وَأَبْصَارِهِمْ ۚ إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ﴿٢٠﴾
</p>

<p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
  يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ وَالَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ ﴿٢١﴾
</p>

<p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
  الَّذِي جَعَلَ لَكُمُ الْأَرْضَ فِرَاشًا وَالسَّمَاءَ بِنَاءً وَأَنزَلَ مِنَ السَّمَاءِ مَاءً فَأَخْرَجَ بِهِ مِنَ الثَّمَرَاتِ رِزْقًا لَّكُمْ ۖ فَلَا تَجْعَلُوا لِلَّهِ أَندَادًا وَأَنتُمْ تَعْلَمُونَ ﴿٢٢﴾
</p>

<p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
  وَإِن كُنتُمْ فِي رَيْبٍ مِّمَّا نَزَّلْنَا عَلَىٰ عَبْدِنَا فَأْتُوا بِسُورَةٍ مِّن مِّثْلِهِ وَادْعُوا شُهَدَاءَكُم مِّن دُونِ اللَّهِ إِن كُنتُمْ صَادِقِينَ ﴿٢٣﴾
</p>

<p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
  فَإِن لَّمْ تَفْعَلُوا وَلَن تَفْعَلُوا فَاتَّقُوا النَّارَ الَّتِي وَقُودُهَا النَّاسُ وَالْحِجَارَةُ ۖ أُعِدَّتْ لِلْكَافِرِينَ ﴿٢٤﴾
</p>

                <div className="text-center text-gray-500 mb-2">4</div>
                <hr className="w-1/2 mx-auto border-gray-300 shadow-sm" />

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t dark:bg-black border-gray-200 px-4 py-4 mt-8">
          <div className="max-w-4xl mx-auto flex items-center justify-center space-x-6">
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900">
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Surah</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900">
              <ArrowUp className="w-4 h-4" />
              <span>Beginning of Surah</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900">
              <span>Next Surah</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reading;
