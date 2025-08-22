import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
} from "lucide-react";

const Tajweed = () => {
  const [expandedSections, setExpandedSections] = useState({
    topics: false,
    chapter: false,
    resonance: false,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(2);
  const [totalTime] = useState(18);

  const handleBack = () => {
    console.log("Navigate back");
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    console.log("Previous verse");
  };

  const handleNext = () => {
    console.log("Next verse");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              ഖുർആന്‍ പാരായണ ശാസ്ത്രം (علم التجويد)
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Basic Introduction Text */}
            <div className="prose prose-gray max-w-none mb-8">
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                അല്ലാഹുവിന്റെ തിരുവചനങ്ങള്‍ നമ്മളിലെ ഹൃദയത്തില്‍ വന്നിറങ്ങിയ
                അതിവിശുദ്ധ പുസ്തകമാണ് ഖുര്‍ആന്‍. എല്ലാ യുഗത്തിലും ജീവിക്കുന്ന
                മനുഷ്യര്‍ക്ക് കൃത്യമായ പ്രമാണപത്രവും ഹിദായത്തും ആയിരിക്കാന്‍
                നിര്‍ദ്ദേശിച്ചിരിക്കുന്ന ഖുര്‍ആന്‍ ഖുര്‍ഇഷ് അറബികളില്‍ക്കൂടെ
                ലോകം മുഴുവന്‍ അറിയിക്കപ്പെട്ടിരിക്കുന്നു. നബി (സ) യുടെ കാലത്ത്
                ഖുര്‍ആന്‍ പഠനത്തിന്റെ ലക്ഷ്യമായിരുന്നത് പാരായണം. പാരായണത്തിന്റെ
                സൗന്ദര്യവും അര്‍ത്ഥബോധവും ഒരുപോലെ പ്രാധാന്യമുള്ളതാണ്. ഇസ്‌ലാമിക്
                ശാസ്ത്രത്തിലെ ഒരു പ്രധാന ശാഖയാണ് തജ്‌വീദ്. ഖുര്‍ആന്‍
                പാരായണത്തിന്റെ നിയമാവലി വിശദീകരിക്കുന്ന ശാസ്ത്രമാണ് എന്ന് ഇതിനെ
                വിശേഷിപ്പിക്കാവുന്നതാണ്. 'തജ്‌വീദ്' എന്ന നിബന്ധന ഗുണഭേദം
                വര്‍ത്തിച്ച് അതിമനോഹരമാക്കുക എന്ന് അര്‍ത്ഥമാക്കുന്നു. ഖുര്‍ആന്‍
                പാരായണത്തിലെ ഓരോ അക്ഷരത്തിനും കൃത്യമായ ശബ്ദരൂപവും കൃത്യമായ
                ഉച്ചാരണ നിയമങ്ങളും ഉണ്ട്.
              </p>

              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                നമ്മുടെ ഖുര്‍ആന്‍ പാരായണം ശുദ്ധമാകണം. എന്ന് ഇതിലെ ഓരോ വ്യാകരണം,
                'തജ്‌വീദിന്റെ നിലവാരം അറിയാതെ ഖുര്‍ആന്‍ തന്നെയാണെങ്കില്‍ എന്ന്
                അര്‍ത്ഥമാകും അതിനാല്‍ കൃത്യമായ ഉച്ചാരണത്തോടെ സാധാരണ ഹാഫിസുകള്‍,
                വിദ്വാന്മാര്‍, കത്ത്, കൃത്യങ്ങള്‍, വിശേഷങ്ങള്‍, ഭേദങ്ങള്‍,
                ന്യൂനതകള്‍, സമന്വയങ്ങള്‍, മോവും, ദീര്‍ഘം, കത്ത് കൃത്യങ്ങള്‍,
                കൃത്യങ്ങള്‍, വിശേഷങ്ങള്‍ നിയമാവലിയുടെ അടിസ്ഥാനത്തിലറിയേണ്ടത്
                പ്രധാനമാണ്. അതിനാല്‍പൊകാതിരിക്കുന്ന ആര്‍ക്കും സാധിച്ചേക്കാം
                എന്നിവ സാധാരണഗതിയില്‍ തന്നെ മനസ്സിലാക്കാം. അതിനായി ധ്വനിയുടെ
                ഖുര്‍ആന്‍ പാരായണത്തിലേക്ക് ശ്രദ്ധിക്കുന്ന ഓരോ അക്ഷരത്തിനും
                ഉച്ചാരണം. 1. സത്യപഠനത്തിലൂടെ പാരായണം നൈപുണ്യം ബി
                തത്ത്വശാസ്ത്രത്തോട് അടുത്ത് ബന്ധപ്പെട്ടുകൊണ്ട് (اوسط) ആ
                തത്ത്വത്തിനോ അന്തര്‍ബന്ധം (قياس عام) കൃത്യമാണ്.
              </p>
            </div>

            {/* വിവിധയിനം വിരാമങ്ങള്‍ Section */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("topics")}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <h3 className="text-base font-medium text-gray-800">
                  വിവിധയിനം വിരാമങ്ങള്‍
                </h3>
                {expandedSections.topics ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.topics && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed mt-3">
                    الوقف ഭാഷാര്‍ഥം: തടഞ്ഞുവെക്കുക സാങ്കേതികാര്‍ഥം: പാരായണം
                    തുടരണമെന്ന ഉദ്ദേശ്യത്തോടെ സാധാരണഗതിയില്‍ ശ്വാസം വിടാവുന്ന
                    സമയം നിര്‍ത്തുക. അനുബന്ധം : وَقْف ചെയ്യാനുദ്ദേശിക്കുന്ന
                    പദത്തിന്റെ ഒടുവില്‍ فَتْحُ التَّنْوِين ആണുള്ളതെങ്കില്‍ ആ
                    تَنْوِين നെ اَلِف ആക്കി മാറ്റി സാധാരണ ദീര്‍ഘം നല്‍കി വേണം
                    നിറുത്തുവാന്‍. ഉദാ: فَضْلاً مِنَ اللهِ وَرِضْوَانًا ഇനി
                    وَقْف ചെയ്യാനുദ്ദേശിക്കുന്ന പദത്തിന്റെ ഒടുവില്‍
                    സ്ത്രീലിംഗത്തെ കുറിക്കുന്ന تَاءُ التَّأْنِيث = ة
                    ആണുള്ളതെങ്കില്‍ അതിനെ هَاء ആക്കിമാറ്റി سُكُون
                    ചെയ്തുച്ചരിക്കണം. ഉദാ: عَالِيَة = عَالِيَه خَاشِعَة =
                    خَاشِعَه. മറ്റു സ്ഥലങ്ങളിലെല്ലാം وَقْف ചെയ്യാനുദ്ദേശിക്കുന്ന
                    പദത്തിന്റെ അവസാനത്തെ حَرْف ന്سُكُون നല്‍കിക്കൊണ്ടാണ് وَقْف
                    ചെയ്യേണ്ടത്. ഉദാ: أَكْرَمنِ = أَكْرَمَنْ فَصْلٌ = فَصْلْ
                    خُسْرٍ = خُسْرْ يَعْمَلُونَ = يَعْمَلُونْ
                  </p>
                </div>
              )}
            </div>

            {/* രണ്ടനക്ക സമയം അടങ്ങുക Section */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("chapter")}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <h3 className="text-base font-medium text-blue-600">
                രണ്ടനക്ക സമയം അടങ്ങുക
                </h3>
                {expandedSections.chapter ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.chapter && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed mt-3">
                  ശ്വാസം വിടാതെ വായന തുടരാമെന്ന ഉദ്ദേശ്യത്തോടെ രണ്ടനക്ക സമയം അടങ്ങുക. س ആണ് ഇതിന്റെ അടയാളം.
                  </p>
                        {/* ഉദാഹരണം Section */}
            <div>
              <h4 className="text-sm font-medium text-green-600 mb-4">
                ഉദാഹരണം:
              </h4>

              {/* Audio Player */}
              <div className="bg-gray-100 rounded-lg p-6">
                {/* Arabic Text Display */}
                <div className="text-center mb-6">
                  <p
                    className="text-xl font-semibold text-gray-800 mb-2"
                    style={{ fontFamily: "Arabic, serif", direction: "rtl" }}
                  >
                    كَلَّا ۖ بَلْ رَانَ عَلَىٰ قُلُوبِهِم مَّا كَانُوا
                    يَكْسِبُونَ (14)
                  </p>
                </div>

                {/* Navigation Arrows */}
                <div className="flex justify-center items-center mb-4">
                  <button
                    onClick={handlePrevious}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-600 rotate-90" />
                  </button>
                  <div className="mx-8"></div>
                  <button
                    onClick={handleNext}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-600 -rotate-90" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-300 rounded-full h-1">
                    <div
                      className="bg-gray-600 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / totalTime) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Time Display */}
                <div className="flex justify-between text-xs text-gray-500 mb-4">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(totalTime)}</span>
                </div>

                {/* Audio Controls */}
                <div className="flex justify-center items-center gap-4">
                  <button className="p-2 hover:bg-gray-200 rounded">
                    <Rewind className="w-4 h-4 text-gray-600" />
                  </button>

                  <button className="p-2 hover:bg-gray-200 rounded">
                    <SkipBack className="w-4 h-4 text-gray-600" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="p-3 bg-gray-600 hover:bg-gray-700 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-1" />
                    )}
                  </button>

                  <button className="p-2 hover:bg-gray-200 rounded">
                    <SkipForward className="w-4 h-4 text-gray-600" />
                  </button>

                  <button className="p-2 hover:bg-gray-200 rounded">
                    <FastForward className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
                </div>
              )}
            </div>

      

            {/* അനനുവദനീയ വിരാമം Section */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("resonance")}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <h3 className="text-base font-medium text-gray-800">
                അനനുവദനീയ വിരാമം
                </h3>
                {expandedSections.resonance ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.resonance && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed mt-3">
                    ഖുര്‍ആന്‍ പാരായണത്തിലെ വിവിധ അനുനാദങ്ങളുടെയും ശബ്ദ
                    വൈശിഷ്ട്യങ്ങളുടെയും വിശേഷതകള്‍ ഇവിടെ വിവരിക്കുന്നു.
                  </p>
                </div>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("resonance")}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <h3 className="text-base font-medium text-gray-800">
                അനിവാര്യമായ വിരാമം
                </h3>
                {expandedSections.resonance ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.resonance && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  {/* <p className="text-sm text-gray-700 leading-relaxed mt-3">
                    ഖുര്‍ആന്‍ പാരായണത്തിലെ വിവിധ അനുനാദങ്ങളുടെയും ശബ്ദ
                    വൈശിഷ്ട്യങ്ങളുടെയും വിശേഷതകള്‍ ഇവിടെ വിവരിക്കുന്നു.
                  </p> */}
                </div>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("resonance")}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <h3 className="text-base font-medium text-gray-800">
                ഹംസഃയുടെ ഇനങ്ങള്‍
                </h3>
                {expandedSections.resonance ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.resonance && (
                <div className="px-4 pb-4 border-t border-gray-200">
                </div>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("resonance")}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <h3 className="text-base font-medium text-gray-800">
                ഖല്‍ഖലത്തിന്റെ പദവികള്‍
                </h3>
                {expandedSections.resonance ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.resonance && (
                <div className="px-4 pb-4 border-t border-gray-200">
                </div>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("resonance")}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <h3 className="text-base font-medium text-gray-800">
                നൂനും തന്‍വീനും
                </h3>
                {expandedSections.resonance ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.resonance && (
                <div className="px-4 pb-4 border-t border-gray-200">
                </div>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("resonance")}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <h3 className="text-base font-medium text-gray-800">
                നൂനും മീമും
                </h3>
                {expandedSections.resonance ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.resonance && (
                <div className="px-4 pb-4 border-t border-gray-200">
                </div>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("resonance")}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <h3 className="text-base font-medium text-gray-800">
                സുകൂനുള്ള മീമ്
                </h3>
                {expandedSections.resonance ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.resonance && (
                <div className="px-4 pb-4 border-t border-gray-200">
                </div>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("resonance")}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <h3 className="text-base font-medium text-gray-800">
                സുകൂനുള്ള ലാമുകള്‍
                </h3>
                {expandedSections.resonance ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.resonance && (
                <div className="px-4 pb-4 border-t border-gray-200">
                </div>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("resonance")}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <h3 className="text-base font-medium text-gray-800">
                വിവിധയിനം ദീര്‍ഘങ്ങള്‍
                </h3>
                {expandedSections.resonance ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.resonance && (
                <div className="px-4 pb-4 border-t border-gray-200">
                </div>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection("resonance")}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <h3 className="text-base font-medium text-gray-800">
                സുകൂനുള്ള രണ്ട് അക്ഷരങ്ങള്‍ ഒരുമിച്ച് വരല്‍
                </h3>
                {expandedSections.resonance ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.resonance && (
                <div className="px-4 pb-4 border-t border-gray-200">
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tajweed;
