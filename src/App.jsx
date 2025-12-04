import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { SurahViewCacheProvider } from "./context/SurahViewCacheContext";

// Always load critical components immediately
import HomepageNavbar from "./components/HomeNavbar";
import Footer from "./components/Footer";
import LazyLoadFallback from "./components/LazyLoadFallback";
import Home from "./pages/Home"; // Load Home immediately since it's the main landing page

// Lazy load all route components to reduce initial bundle size
// These will only load when the user navigates to them
const Juz = lazy(() => import("./pages/Juz"));
const Sign = lazy(() => import("./pages/Sign"));
const Surah = lazy(() => import("./pages/Surah"));
const SurahInfo = lazy(() => import("./pages/SurahInfo"));
const Reading = lazy(() => import("./pages/Reading"));
const BlockWise = lazy(() => import("./pages/BlockWise"));
const BookVerse = lazy(() => import("./pages/bookmarkedVerses"));
const BookmarkBlock = lazy(() => import("./pages/BookmarkBlock"));
const BookInterpretations = lazy(() => import("./pages/BookInterpretations"));
const MalayalamInterpreter = lazy(() => import("./pages/MalayalamInterpreter"));
const FavoriteSurahs = lazy(() => import("./pages/FavoriteSurahs"));
const Settings = lazy(() => import("./pages/Settings"));
const PlayAudio = lazy(() => import("./components/PlayAudio"));
const TableContents = lazy(() => import("./pages/TableContents"));
const Maududi = lazy(() => import("./pages/Maududi"));
const WhatsNew = lazy(() => import("./pages/WhatsNew"));
const Digitisation = lazy(() => import("./pages/Digitisation"));
const About = lazy(() => import("./pages/About"));
const AuthorPreface = lazy(() => import("./pages/AuthorPreface"));
const AuthorConclusion = lazy(() => import("./pages/AuthorConclusion"));
const IntroductionToQuran = lazy(() => import("./pages/IntroductionToQuran"));
const Appendix = lazy(() => import("./pages/Appendix"));
const EnglishTranslate = lazy(() => import("./pages/EnglishTranslate"));
const Quiz = lazy(() => import("./pages/Quiz"));
const DragDrop = lazy(() => import("./pages/DragDrop"));
const Privacy = lazy(() => import("./pages/Privacy"));
const DeleteAccount = lazy(() => import("./pages/DeleteAccount"));
const LogOut = lazy(() => import("./pages/LogOut"));
const Conclusion = lazy(() => import("./pages/Conclusion"));
const Tajweed = lazy(() => import("./pages/Tajweed"));
const QuranStudy = lazy(() => import("./pages/QuranStudy"));
const EndofProphethood = lazy(() => import("./pages/EndofProphethood"));
const WordByWordPage = lazy(() => import("./pages/WordByWordPage"));
const InterpretationBlockwise = lazy(() => import("./pages/InterpretationBlockwise"));
const Note = lazy(() => import("./pages/Note"));
const UrduFinalityOfProphethood = lazy(() => import("./pages/UrduFinalityOfProphethood"));
const UrduJesusMohammed = lazy(() => import("./pages/UrduJesusMohammed"));
const Contact = lazy(() => import("./pages/Contact"));
const Feedback = lazy(() => import("./pages/Feedback"));
const TechnicalTerms = lazy(() => import("./pages/TechnicalTerms"));
const Translators = lazy(() => import("./pages/Translators"));
const HistoryOfTranslation = lazy(() => import("./pages/HistoryOfTranslation"));
const MalayalamJesusMohammed = lazy(() => import("./pages/MalayalamJesusMohammed"));
const MalayalamFinalityOfProphethood = lazy(() => import("./pages/MalayalamFinalityOfProphethood"));
const EnglishJesusMohammed = lazy(() => import("./pages/EnglishJesusMohammed"));
const EnglishFinalityOfProphethood = lazy(() => import("./pages/EnglishFinalityOfProphethood"));
const HindiJesusMohammed = lazy(() => import("./pages/HindiJesusMohammed"));
const HindiFinalityOfProphethood = lazy(() => import("./pages/HindiFinalityOfProphethood"));
const BanglaJesusMohammed = lazy(() => import("./pages/BanglaJesusMohammed"));
const BanglaFinalityOfProphethood = lazy(() => import("./pages/BanglaFinalityOfProphethood"));

function resolveRouterBasename() {
  const raw = import.meta.env.VITE_BASE_PATH?.trim();
  if (!raw) return '/';
  if (raw === '/' || raw === '.') return '/';
  const normalized = raw.startsWith('/') ? raw : `/${raw}`;
  return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
}

function App() {
  // Use configurable basename to mirror Vite base path
  const basename = resolveRouterBasename();
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <SurahViewCacheProvider>
          <Router basename={basename}>
          {/* Skip to main content link for accessibility */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[1000] 
                       bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg
                       focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2"
          >
            Skip to content
          </a>
          
          <HomepageNavbar />
          <Suspense fallback={<LazyLoadFallback message="Loading page..." />}>
            <main id="main-content">
              <Routes>
                <Route path="/" element={<Home />} /> {/* Surah/Home */}
                <Route path="/juz" element={<Juz />} />
                <Route path="/juz/:juzId" element={<Juz />} />
                <Route path="/sign" element={<Sign />} />
                <Route path="/surah/:surahId" element={<Surah />} />
                <Route path="/surahinfo/:surahId" element={<SurahInfo />} />
                <Route path="/reading/:surahId?" element={<Reading />} />
                <Route path="/blockwise/:surahId" element={<BlockWise />} />
                <Route path="/bookmarkblock" element={<BookmarkBlock />} />
                <Route path="/bookmarkedverses" element={<BookVerse />} />
                <Route path="/favoritesurahs" element={<FavoriteSurahs />} />
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
                <Route path="/authorconclusion" element={<AuthorConclusion />} />
                <Route path="/introduction-to-quran" element={<IntroductionToQuran />} />
                <Route path="/appendix/:lang" element={<Appendix />} />
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
                <Route path="/urdu/finality-of-prophethood" element={<UrduFinalityOfProphethood />} />
                <Route path="/urdu/jesus-mohammed" element={<UrduJesusMohammed />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/technical-terms" element={<TechnicalTerms />} />
                <Route path="/translators" element={<Translators />} />
                <Route path="/history-of-translation" element={<HistoryOfTranslation />} />
                <Route path="/malayalam/jesus-mohammed" element={<MalayalamJesusMohammed />} />
                <Route path="/malayalam/finality-of-prophethood" element={<MalayalamFinalityOfProphethood />} />
                <Route path="/english/jesus-mohammed" element={<EnglishJesusMohammed />} />
                <Route path="/english/finality-of-prophethood" element={<EnglishFinalityOfProphethood />} />
                <Route path="/hindi/jesus-mohammed" element={<HindiJesusMohammed />} />
                <Route path="/hindi/finality-of-prophethood" element={<HindiFinalityOfProphethood />} />
                <Route path="/bangla/jesus-mohammed" element={<BanglaJesusMohammed />} />
                <Route path="/bangla/finality-of-prophethood" element={<BanglaFinalityOfProphethood />} />
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
            </main>
          </Suspense>
          <Footer />
          </Router>
        </SurahViewCacheProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
