import React, { useState } from "react";
import QuranStudyNavbar from "../components/QuranStudyNavbar";
import QuranStudyContent from "../components/QuranStudyContent";
import QuranStudyPlay from "../components/QuranStudyPlay";

const QuranStudy = () => {
  const [activeItem, setActiveItem] = useState("Note");
  const [showMobilePlayer, setShowMobilePlayer] = useState(false);

  return (
    <div className="min-h-screen font-poppins">
      <div className="flex flex-col lg:flex-row bg-[#FAFAFA] dark:bg-gray-900">
        <QuranStudyNavbar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
        <QuranStudyContent
          activeItem={activeItem}
          onPlayAudio={() => setShowMobilePlayer(prev => !prev)}

        />
      </div>

      {/* Always show on large screens */}
      <div className="hidden lg:block">
        <QuranStudyPlay
          audioSrc="/path/to/audio.mp3"
          title={activeItem}
          onClose={() => {}} 
        />
      </div>

 
      {showMobilePlayer && (
        <div className="lg:hidden">
          <QuranStudyPlay
            audioSrc="/path/to/audio.mp3"
            title={activeItem}
            onClose={() => setShowMobilePlayer(false)}
          />
        </div>
      )}
    </div>
  );
};

export default QuranStudy;
