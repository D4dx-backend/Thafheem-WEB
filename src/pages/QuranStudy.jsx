import React, { useState } from "react";
import QuranStudyNavbar from "../components/QuranStudyNavbar";
import QuranStudyContent from "../components/QuranStudyContent";
import QuranStudyPlay from "../components/QuranStudyPlay";

const QuranStudy = () => {
  const [activeItem, setActiveItem] = useState(null);
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

      <div className="hidden lg:block">
        <QuranStudyPlay
          audioSrc={activeItem?.audiourl || ""}
          title={activeItem?.title || ""}
          onClose={() => {}}
        />
      </div>

      {showMobilePlayer && (
        <div className="lg:hidden">
          <QuranStudyPlay
            audioSrc={activeItem?.audiourl || ""}
            title={activeItem?.title || ""}
            onClose={() => setShowMobilePlayer(false)}
            isMobile={true}
          />
        </div>
      )}
    </div>
  );
};

export default QuranStudy;