import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  FileText,
  User,
  Heart,
  Play,
  Copy,
  Pause,
  Bookmark,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import HomeNavbar from "../components/HomeNavbar";
import Transition from "../components/Transition";
import InterpretationBlockwise from "./InterpretationBlockwise";

const BlockWise = () => {
  const [activeTab, setActiveTab] = useState("Translation");
  const [activeView, setActiveView] = useState("Block wise");
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const navigate = useNavigate();

  const handleNumberClick = (number) => {
    setSelectedNumber(number);
    setShowInterpretation(true);
  };

  return (
    <>
      <HomeNavbar />
      <Transition />
      <div className="max-w-6xl mx-auto min-h-screen bg-white">
        {/* Header with Tabs */}
        <div className="bg-white px-6 py-6">
          {/* Translation/Reading Tabs */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab("Translation")}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === "Translation"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-gray-50 text-gray-600 hover:text-gray-800"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Translation</span>
            </button>
            <button
              onClick={() => setActiveTab("Reading")}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === "Reading"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-gray-50 text-gray-600 hover:text-gray-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Reading</span>
            </button>
          </div>

          {/* Arabic Title */}
          <div className="text-center mb-6">
            <h1
              className="text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "Arial" }}
            >
              القرآن
            </h1>
            <div className="flex justify-center space-x-4 text-gray-600 mb-6">
              <button className="p-2 hover:text-gray-800 transition-colors">
                <User className="w-5 h-5" />
              </button>
              <button className="p-2 hover:text-gray-800 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bismillah with Controls */}
          <div className="mb-8 relative">
            <p className="text-3xl font-arabic text-gray-800 leading-relaxed text-center">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            {/* Ayah wise / Block wise buttons */}
            <div className="absolute top-0 right-0">
              <div className="flex bg-gray-100 rounded-full p-1 shadow-sm">
                <button
                  className="px-4 py-1.5 text-gray-500 rounded-full text-sm font-medium hover:text-gray-700 transition-colors"
                  onClick={() => navigate("/surah")}
                >
                  Ayah wise
                </button>
                <button className="px-4 py-1.5 bg-white text-gray-900 rounded-full text-sm font-medium shadow transition-colors">
                  Block wise
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
              <Link to="/surahinfo">
                <span className="text-sm text-gray-600 cursor-pointer hover:underline">
                  Surah Info
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Ayah wise</span>
              <span>Word wise</span>
            </div>
            <button className="flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 transition-colors">
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Play Audio</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 pb-8">
          {/* Arabic Text Block */}
          <div className="bg-[#d1f1f8]">
            <div className="mb-6 p-8  rounded-lg">
              <p
                className="text-2xl leading-loose text-center text-gray-900"
                style={{
                  fontFamily: "Arial",
                  lineHeight: "3",
                  direction: "rtl",
                }}
              >
                الٓمٓ ﴿١﴾ ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى
                لِّلْمُتَّقِينَ ﴿٢﴾ ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ
                وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَٰهُمْ يُنفِقُونَ ﴿٣﴾
                وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن
                قَبْلِكَ وَبِٱلْءَاخِرَةِ هُمْ يُوقِنُونَ ﴿٤﴾ أُو۟لَٰٓئِكَ
                عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُو۟لَٰٓئِكَ هُمُ
                ٱلْمُفْلِحُونَ ﴿٥﴾
              </p>
            </div>

            {/* Translation Text */}
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed text-base">
                (2:1) Alif, Lam, Mim.
                <span
                  className="inline-flex items-center justify-center w-6 h-6 bg-cyan-500 text-white text-xs font-medium rounded-full mx-2 cursor-pointer hover:bg-cyan-600 transition-colors"
                  onClick={() => handleNumberClick(1)}
                >
                  1
                </span>
                (2:2) This is the Book of Allah, there is no doubt in it;
                <span
                  className="inline-flex items-center justify-center w-6 h-6 bg-cyan-500 text-white text-xs font-medium rounded-full mx-2 cursor-pointer hover:bg-cyan-600 transition-colors"
                  onClick={() => handleNumberClick(2)}
                >
                  2
                </span>
                it is a guidance for the pious,
                <span
                  className="inline-flex items-center justify-center w-6 h-6 bg-cyan-500 text-white text-xs font-medium rounded-full mx-2 cursor-pointer hover:bg-cyan-600 transition-colors"
                  onClick={() => handleNumberClick(3)}
                >
                  3
                </span>
                (2:3) for those who believe in the existence of that which is
                beyond the reach of perception,
                <span
                  className="inline-flex items-center justify-center w-6 h-6 bg-cyan-500 text-white text-xs font-medium rounded-full mx-2 cursor-pointer hover:bg-cyan-600 transition-colors"
                  onClick={() => handleNumberClick(4)}
                >
                  4
                </span>
                who establish Prayer
                <span
                  className="inline-flex items-center justify-center w-6 h-6 bg-cyan-500 text-white text-xs font-medium rounded-full mx-2 cursor-pointer hover:bg-cyan-600 transition-colors"
                  onClick={() => handleNumberClick(5)}
                >
                  5
                </span>
                and spend out of what We have provided them,
                <span
                  className="inline-flex items-center justify-center w-6 h-6 bg-cyan-500 text-white text-xs font-medium rounded-full mx-2 cursor-pointer hover:bg-cyan-600 transition-colors"
                  onClick={() => handleNumberClick(6)}
                >
                  6
                </span>
                (2:4) who believe in what has been revealed to you and what was
                revealed before you,
                <span
                  className="inline-flex items-center justify-center w-6 h-6 bg-cyan-500 text-white text-xs font-medium rounded-full mx-2 cursor-pointer hover:bg-cyan-600 transition-colors"
                  onClick={() => handleNumberClick(7)}
                >
                  7
                </span>
                and have firm faith in the Hereafter.
                <span
                  className="inline-flex items-center justify-center w-6 h-6 bg-cyan-500 text-white text-xs font-medium rounded-full mx-2 cursor-pointer hover:bg-cyan-600 transition-colors"
                  onClick={() => handleNumberClick(8)}
                >
                  8
                </span>
                (2:5) Such are on true guidance from their Lord; such are the
                truly successful. (2:6) As for those who have rejected (these
                truths),
                <span
                  className="inline-flex items-center justify-center w-6 h-6 bg-cyan-500 text-white text-xs font-medium rounded-full mx-2 cursor-pointer hover:bg-cyan-600 transition-colors"
                  onClick={() => handleNumberClick(9)}
                >
                  9
                </span>
                it is all the same whether or not you warn them, for they will
                not believe. (2:7) Allah has sealed their hearts,
                <span
                  className="inline-flex items-center justify-center w-6 h-6 bg-cyan-500 text-white text-xs font-medium rounded-full mx-2 cursor-pointer hover:bg-cyan-600 transition-colors"
                  onClick={() => handleNumberClick(10)}
                >
                  10
                </span>
                and their hearing, and a covering has fallen over their eyes.
                They deserve severe chastisement.
              </p>
            </div>
          </div>

          {/* Third Arabic Text Block */}
          <div className="mb-6 p-8 bg-gray-50 rounded-lg">
            <p
              className="text-2xl leading-loose text-center text-gray-900"
              style={{
                fontFamily: "Arial",
                lineHeight: "3",
                direction: "rtl",
              }}
            >
              وَإِذَا لَقُوا۟ ٱلَّذِينَ ءَامَنُوا۟ قَالُوٓا۟ ءَامَنَّا وَإِذَا
              خَلَوْا۟ إِلَىٰ شَيَٰطِينِهِمْ قَالُوٓا۟ إِنَّا مَعَكُمْ إِنَّمَا
              نَحْنُ مُسْتَهْزِءُونَ ﴿١٤﴾ ٱللَّهُ يَسْتَهْزِئُ بِهِمْ
              وَيَمُدُّهُمْ فِى طُغْيَٰنِهِمْ يَعْمَهُونَ ﴿١٥﴾ أُو۟لَٰٓئِكَ
              ٱلَّذِينَ ٱشْتَرَوُا۟ ٱلضَّلَٰلَةَ بِٱلْهُدَىٰ فَمَا رَبِحَت
              تِّجَٰرَتُهُمْ وَمَا كَانُوا۟ مُهْتَدِينَ ﴿١٦﴾ مَثَلُهُمْ كَمَثَلِ
              ٱلَّذِى ٱسْتَوْقَدَ نَارًا فَلَمَّآ أَضَآءَتْ مَا حَوْلَهُۥ ذَهَبَ
              ٱللَّهُ بِنُورِهِمْ وَتَرَكَهُمْ فِى ظُلُمَٰتٍ لَّا يُبْصِرُونَ
              ﴿١٧﴾ صُمٌّۢ بُكْمٌ عُمْىٌ فَهُمْ لَا يَرْجِعُونَ ﴿١٨﴾ أَوْ
              كَصَيِّبٍ مِّنَ ٱلسَّمَآءِ فِيهِ ظُلُمَٰتٌ وَرَعْدٌ وَبَرْقٌ
              يَجْعَلُونَ أَصَٰبِعَهُمْ فِىٓ ءَاذَانِهِم مِّنَ ٱلصَّوَٰعِقِ
              حَذَرَ ٱلْمَوْتِ ۚ وَٱللَّهُ مُحِيطٌۢ بِٱلْكَٰفِرِينَ ﴿١٩﴾ يَكَادُ
              ٱلْبَرْقُ يَخْطَفُ أَبْصَٰرَهُمْ ۖ كُلَّمَآ أَضَآءَ لَهُم
              مَّشَوْا۟ فِيهِ وَإِذَآ أَظْلَمَ عَلَيْهِمْ قَامُوا۟ ۚ وَلَوْ
              شَآءَ ٱللَّهُ لَذَهَبَ بِسَمْعِهِمْ وَأَبْصَٰرِهِمْ ۚ إِنَّ
              ٱللَّهَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ ﴿٢٠﴾
            </p>
          </div>

          {/* Translation Text for verses 8-20 */}
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed text-base">
              <strong>(2:8)</strong> There are some who say: "We believe in
              Allah and in the Last Day," while in fact they do not believe.
              <strong>(2:9)</strong> They are trying to deceive Allah and those
              who believe, but they do not realize that in truth they are only
              deceiving themselves.
              <strong>(2:10)</strong> There is a disease in their hearts and
              Allah has intensified this disease. A painful chastisement awaits
              them for their lying.
              <strong>(2:11)</strong> Whenever they are told: "Do not spread
              mischief on earth," they say: "Why! We indeed are the ones who set
              things right."
              <strong>(2:12)</strong> They are the mischief makers, but they do
              not realize it.
              <strong>(2:13)</strong> Whenever they are told: "Believe as others
              believe," they answer: "Shall we believe as the fools have
              believed?" Indeed it is they who are the fools, but they are not
              aware of it.
              <strong>(2:14)</strong> When they meet the believers, they say:
              "We believe," but when they meet their evil companions (in
              privacy), they say: "Surely we are with you; we were merely
              jesting."
              <strong>(2:15)</strong> Allah jests with them, leaving them to
              wander blindly on in their rebellion.
              <strong>(2:16)</strong> These are the ones who have purchased
              error in exchange for guidance. This bargain has brought them no
              profit and certainly they are not on the Right Way.
              <strong>(2:17)</strong> They are like him who kindled a fire, and
              when it lit up all around him, Allah took away the light (of their
              perception) and left them in utter darkness where they can see
              nothing.
              <strong>(2:18)</strong> They are deaf, they are dumb, they are
              blind; they will never return (to the Right Way).
              <strong>(2:19)</strong> Or they are like those who encounter a
              violent rainstorm from the sky, accompanied by pitch-dark clouds,
              thunder-claps and flashes of lightning; on hearing thunder-claps
              they thrust their fingers into their ears in fear of death. Allah
              encompasses these deniers of the Truth.
              <strong>(2:20)</strong> It is as if the lightning would snatch
              their sight; whenever it gleams a while for them they walk a
              little, and when darkness covers them they halt. If Allah so
              willed, He could indeed take away their hearing and their sight.
              Surely Allah is All-Powerful.
            </p>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-white border-t border-gray-200 px-4 py-4 mt-8">
            <div className="max-w-4xl mx-auto flex items-center justify-center space-x-6">
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                Previous Surah
              </button>
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                Beginning of Surah
              </button>
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                Next Surah
              </button>
            </div>
          </div>

          {/* Media Controls */}
          <div className="flex justify-start space-x-4 pt-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Copy className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Play className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Pause className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overlay Popup for Interpretation */}
        {showInterpretation && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto relative">
              {/* <button
                onClick={() => setShowInterpretation(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
              >
                ×
              </button> */}
              <InterpretationBlockwise selectedNumber={selectedNumber} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlockWise;
