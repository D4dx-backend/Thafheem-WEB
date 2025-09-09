import React, { useState, useEffect } from "react";
import EndofProphethoodNavbar from "../components/EndofProphethoodNavbar";
import EndofProphethoodContent from "../components/EndofProphethoodContent";
import EndofProphethoodPlay from "../components/EndofProphethoodPlay";

const EndofProphethood = () => {
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [activeSection, setActiveSection] = useState("The end of prophethood");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint is 1024px
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handlePlayAudio = () => {
    setShowAudioPlayer(true);
  };

  const handleCloseAudio = () => {
    setShowAudioPlayer(false);
  };

  // Show audio player always on desktop, conditionally on mobile
  const shouldShowAudioPlayer = !isMobile || showAudioPlayer;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-black">
      <div className="flex flex-col lg:flex-row">
        <EndofProphethoodNavbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <EndofProphethoodContent
          onPlayAudio={handlePlayAudio}
          activeSection={activeSection}
          showPlayButton={isMobile} // Only show play button on mobile
        />
      </div>

      {shouldShowAudioPlayer && (
        <EndofProphethoodPlay
          audioSrc="/path/to/audio.mp3"
          title={activeSection}
          onClose={handleCloseAudio}
          autoPlay={false}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default EndofProphethood;
