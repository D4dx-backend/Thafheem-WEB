import { Share2, Bookmark, Play } from "lucide-react";
import { Link } from "react-router-dom";
import HomepageNavbar from "../components/HomeNavbar";
import Transition from "../components/Transition";

const Reading = () => {

  return (
    <>
      <HomepageNavbar />
      <Transition showPageInfo={true} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Toggle Buttons */}
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gray-100 rounded-full p-1">
                <div className="flex items-center">
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    </svg>
                    <Link to="/surah">
                    <span className="text-sm text-gray-600 cursor-pointer hover:underline">
                    Translation
                    </span>
                  </Link>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
              <h1 className="text-5xl font-arabic text-gray-900 mb-4">البقرة</h1>

              {/* Action Icons */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              {/* Bismillah */}
              <div className="mb-8">
                <p className="text-3xl font-arabic text-gray-800 leading-relaxed">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>

              {/* Bottom Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <Link to="/surahinfo">
                    <span className="text-sm text-gray-600 cursor-pointer hover:underline">
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
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* First Block - Highlighted */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="text-right">
              <p className="text-2xl font-arabic leading-loose text-gray-900 mb-4">
                الم ﴿١﴾ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ
              </p>
              <p className="text-2xl font-arabic leading-loose text-gray-900 mb-4">
                الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ ﴿٢﴾
              </p>
              <p className="text-2xl font-arabic leading-loose text-gray-900 mb-4">
                وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ ﴿٣﴾
              </p>
              <p className="text-2xl font-arabic leading-loose text-gray-900 mb-4">
                أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ ﴿٤﴾
              </p>
              <p className="text-2xl font-arabic leading-loose text-gray-900">
                إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ ﴿٥﴾
              </p>
              <div className="text-right">
              <p className="text-2xl font-arabic leading-loose text-gray-900 mb-4">
                خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ ﴿٦﴾
              </p>
              <p className="text-2xl font-arabic leading-loose text-gray-900 mb-4">
                وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ
              </p>
              <p className="text-2xl font-arabic leading-loose text-gray-900 mb-4">
                يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا وَمَا يَخْدَعُونَ إِلَّا أَنفُسَهُمْ وَمَا يَشْعُرُونَ ﴿٧﴾
              </p>
              <p className="text-2xl font-arabic leading-loose text-gray-900 mb-4">
                فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ ﴿٨﴾
              </p>
              <p className="text-2xl font-arabic leading-loose text-gray-900 mb-4">
                وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا فِي الْأَرْضِ قَالُوا إِنَّمَا نَحْنُ مُصْلِحُونَ ﴿٩﴾
              </p>
              <p className="text-2xl font-arabic leading-loose text-gray-900">
                أَلَا إِنَّهُمْ هُمُ الْمُفْسِدُونَ وَلَٰكِن لَّا يَشْعُرُونَ ﴿١٠﴾
              </p>
            </div>
            </div>
          </div>



          {/* Second Block */}
          <div className="bg-white rounded-lg p-6">
            
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 px-4 py-4 mt-8">
          <div className="max-w-4xl mx-auto flex items-center justify-center space-x-6">
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Previous Page
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Beginning of Surah
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Next Page
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reading;