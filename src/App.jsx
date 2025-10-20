import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Juz from "./pages/Juz";
import Footer from "./components/Footer";
import Sign from "./pages/Sign";
import Surah from "./pages/Surah";
import SurahInfo from "./pages/SurahInfo";
import Reading from "./pages/Reading";

import BlockWise from "./pages/BlockWise";
import BookVerse from "./pages/bookmarkedVerses";
import BookmarkBlock from "./pages/BookmarkBlock";
import BookInterpretations from "./pages/BookInterpretations";
import MalayalamInterpreter from "./pages/MalayalamInterpreter";
import Settings from "./pages/Settings";
import PlayAudio from "./components/PlayAudio";
import TableContents from "./pages/TableContents";
import Maududi from "./pages/Maududi";
import WhatsNew from "./pages/WhatsNew";
import Digitisation from "./pages/Digitisation";
import About from "./pages/About";
import AuthorPreface from "./pages/AuthorPreface";
import HomepageNavbar from "./components/HomeNavbar";
import EnglishTranslate from "./pages/EnglishTranslate";
import Quiz from "./pages/Quiz";
import DragDrop from "./pages/DragDrop";
import Privacy from "./pages/Privacy";
import DeleteAccount from "./pages/DeleteAccount";
import LogOut from "./pages/LogOut";
import Conclusion from "./pages/Conclusion";
import Tajweed from "./pages/Tajweed";
import QuranStudy from "./pages/QuranStudy";
import EndofProphethood from "./pages/EndofProphethood";
import WordByWord from "./pages/WordByWord";
import WordByWordPage from "./pages/WordByWordPage";
import InterpretationBlockwise from "./pages/InterpretationBlockwise";
import Note from "./pages/Note";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ApiStatusBanner from "./components/ApiStatusBanner";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router basename="/new_thafheem_web">
          <HomepageNavbar />
          <ApiStatusBanner />
          <Routes>
            <Route path="/" element={<Home />} /> {/* Surah/Home */}
            <Route path="/juz" element={<Juz />} />
            <Route path="/juz/:juzId" element={<Juz />} />
            <Route path="/sign" element={<Sign />} />
            {/* <Route path="/surah" element={<Surah />} /> */}
            <Route path="/surah/:surahId" element={<Surah />} />
            {/* <Route path="/surahinfo" element={<SurahInfo />} /> */}
            <Route path="/surahinfo/:surahId" element={<SurahInfo />} />
            <Route path="/reading/:surahId?" element={<Reading />} />
            <Route path="/blockwise/:surahId" element={<BlockWise />} />
            <Route path="/bookmarkblock" element={<BookmarkBlock />} />
            <Route path="/bookmarkedverses" element={<BookVerse />} />
            <Route
              path="/bookinterpretations"
              element={<BookInterpretations />}
            />
            <Route
              path="/malayalaminterpretations"
              element={<MalayalamInterpreter />}
            />
            <Route path="/settings" element={<Settings />} />
            <Route path="/play" element={<PlayAudio />} />
            <Route path="/tablecontents" element={<TableContents />} />
            <Route path="/maududi" element={<Maududi />} />
            <Route path="/whatsnew" element={<WhatsNew />} />
            <Route path="/digitisation" element={<Digitisation />} />
            <Route path="/about" element={<About />} />
            <Route path="/authorpreface" element={<AuthorPreface />} />
            <Route path="/englishtranslate" element={<EnglishTranslate />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/dragdrop" element={<DragDrop />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/deleteaccount" element={<DeleteAccount />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="/conclusion" element={<Conclusion />} />
            <Route path="/tajweed" element={<Tajweed />} />
            <Route path="/quranstudy" element={<QuranStudy />} />
            <Route path="/end" element={<EndofProphethood />} />
            <Route
              path="/word-by-word/:surahId/:verseId"
              element={<WordByWordPage />}
            />
            <Route
              path="/interpretation-blockwise"
              element={<InterpretationBlockwise />}
            />
            <Route path="/note/:id" element={<Note />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
