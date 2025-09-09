import React, { useState } from "react";
import QuranStudyNavbar from "../components/QuranStudyNavbar";
import QuranStudyContent from "../components/QuranStudyContent";
import QuranStudyPlay from "../components/QuranStudyPlay";

const QuranStudy = () => {
  const [activeItem, setActiveItem] = useState("Note");
  const [showMobilePlayer, setShowMobilePlayer] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row bg-[#FAFAFA] dark:bg-black">
        <QuranStudyNavbar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
        <QuranStudyContent
          activeItem={activeItem}
          onPlayAudio={() => setShowMobilePlayer(true)}
        />
      </div>

      {/* Always show on large screens */}
      <div className="hidden lg:block">
        <QuranStudyPlay
          audioSrc="/path/to/audio.mp3"
          title={activeItem}
          onClose={() => {}} // No close functionality on desktop
        />
      </div>

      {/* Show on mobile only when button is clicked */}
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
