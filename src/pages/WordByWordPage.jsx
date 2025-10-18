import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import WordByWord from "./WordByWord";

const WordByWordPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    // Navigate back to the surah page or previous page
    const from = location.state?.from;
    if (from && from !== '/surah/all' && from !== '/surah') {
      navigate(from);
    } else {
      // If no specific 'from' path or if 'from' is the all surahs page,
      // navigate to the current surah page to avoid redirecting to all surahs
      navigate(`/surah/${params.surahId}`);
    }
  };

  const handleNavigate = (newVerseId) => {
    navigate(`/word-by-word/${params.surahId}/${newVerseId}`, {
      state: location.state
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <WordByWord
          surahId={params.surahId}
          selectedVerse={parseInt(params.verseId)}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
};

export default WordByWordPage;
