// import React, { useState } from "react";
// import InterpretationNavbar from "../components/InterpretationNavbar";
// import NotePopup from "../components/NotePopup";

// const MalayalamInterpreter = () => {
//   const [isNoteOpen, setIsNoteOpen] = useState(false);
//   const [selectedNote, setSelectedNote] = useState({ id: '', content: '' });

//   const handleNoteClick = (noteId) => {
//     const noteContent = getNoteContent(noteId);
//     setSelectedNote({ id: noteId, content: noteContent });
//     setIsNoteOpen(true);
//   };

//   const getNoteContent = (noteId) => {
//     const notes = {
//       'N1514': (
//         <p className="dark:text-white">
//           4. നബി(സ) തിരുമേനി ആ സന്ദര്‍ഭത്തില്‍ അകപ്പെട്ടിരുന്ന സ്ഥിതിവിശേഷമാണിവിടെ സൂചിപ്പിക്കുന്നത്. 
//           നബി(സ)ക്കും സഹചാരികള്‍ക്കും എതിരാളികള്‍ ഏല്‍പിച്ചിരുന്ന ദണ്ഡനപീഡനങ്ങളല്ല തിരുമേനിയെ 
//           ദുഃഖാകുലനാക്കിയിരുന്നതെന്ന് ഇതില്‍നിന്ന് വ്യക്തമാണ്. അവിടത്തെ കരളിനെ കാര്‍ന്നുതിന്നുകൊണ്ടിരുന്ന 
//           വേദന മറ്റൊന്നായിരുന്നു: സ്വജനതയെ മാര്‍ഗഭ്രംശത്തില്‍നിന്നും ധര്‍മച്യുതിയില്‍നിന്നും രക്ഷിക്കാന്‍ 
//           തിരുമേനി ശ്രമിച്ചുകൊണ്ടിരിക്കുന്നു. അവരോ, രക്ഷപ്പെടാന്‍ കൂട്ടാക്കുന്നുമില്ല. ഈ ദുര്‍മാര്‍ഗവ്യഗ്രതയുടെ 
//           അനിവാര്യ ഫലം നാശവും നരകവുമാണെന്ന് അറിയാവുന്നതുകൊണ്ട് മാത്രമാണ് അതില്‍നിന്ന് അവരെ തടുത്തുനിര്‍ത്താന്‍ 
//           രാപ്പകല്‍ഭേദമന്യേ തിരുമേനി തീവ്രയത്‌നം ചെയ്തുകൊണ്ടിരുന്നത്. പക്ഷേ, ഞങ്ങളെന്തായാലും ദൈവശിക്ഷയില്‍ 
//           നിപതിച്ചേ അടങ്ങൂ എന്നൊരു ശാഠ്യമായിരുന്നു ജനത്തിന്. ഈ സ്ഥിതിവിശേഷത്തെ തിരുമേനിതന്നെ ഇപ്രകാരം 
//           വര്‍ണിക്കുന്നു: ഞാനും നിങ്ങളുമായുള്ള സ്ഥിതി ഒരാള്‍ തീ കൊളുത്തിയ സ്ഥിതിയോടുപമിക്കാവുന്നതാണ്. 
//           തീ കത്തിച്ചത് വെളിച്ചത്തിനു വേണ്ടിയാണെങ്കിലും പാറ്റകളും പ്രാണികളും സ്വയം കരിഞ്ഞു ചാവാന്‍ 
//           അതില്‍ ചെന്നു വീഴുന്നു. അയാള്‍ അവയെ തീയില്‍നിന്ന് എങ്ങനെയും രക്ഷപ്പെടുത്താന്‍ ആവുംവണ്ണം 
//           ശ്രമിച്ചുനോക്കുന്നു. പക്ഷേ, അവയുണ്ടോ സമ്മതിക്കുന്നു! ഇതാണ് എന്റെയും സ്ഥിതി. ഞാന്‍ നിങ്ങളുടെ 
//           തുണിത്തുമ്പ് പിടിച്ച് വലിച്ചുകൊണ്ടേയിരിക്കുന്നു. നിങ്ങളോ പിടിയില്‍നിന്ന് കുതറിച്ചാടുകയും. 
//           ഞങ്ങളുണ്ടോ ജനങ്ങളായാലും ഞങ്ങളുടെ വിശേഷത്തെ വര്‍ണിക്കുന്നു ഇപ്രകാരം വര്‍ണിക്കുന്നു ജനത്തിന്. 
//           ഈ സ്ഥിതിവിശേഷത്തെ തിരുമേനിതന്നെ ഇപ്രകാരം വര്‍ണിക്കുന്നു: ഞാനും നിങ്ങളുമായുള്ള സ്ഥിതി 
//           ഒരാള്‍ തീ കൊളുത്തിയ സ്ഥിതിയോടുപമിക്കാവുന്നതാണ്. തീ കത്തിച്ചത് വെളിച്ചത്തിനു വേണ്ടിയാണെങ്കിലും 
//           പാറ്റകളും പ്രാണികളും സ്വയം കരിഞ്ഞു ചാവാന്‍ അതില്‍ ചെന്നു വീഴുന്നു. അയാള്‍ അവയെ തീയില്‍നിന്ന് 
//           എങ്ങനെയും രക്ഷപ്പെടുത്താന്‍ ആവുംവണ്ണം ശ്രമിച്ചുനോക്കുന്നു. പക്ഷേ, അവയുണ്ടോ സമ്മതിക്കുന്നു! 
//           ഇതാണ് എന്റെയും സ്ഥിതി. ഞാന്‍ നിങ്ങളുടെ തുണിത്തുമ്പ് പിടിച്ച് വലിച്ചുകൊണ്ടേയിരിക്കുന്നു. 
//           നിങ്ങളോ പിടിയില്‍നിന്ന് കുതറിച്ചാടുകയും. തി കത്തിച്ചത്
//         </p>
//       ),
//       'N1462': (
//         <p className="dark:text-white">
//           മുസ്‌ലിം N1462 - ഇത് മുസ്‌ലിം ഹദീസ് ശേഖരത്തിലെ 1462-ാം നമ്പര്‍ ഹദീസിനെ സൂചിപ്പിക്കുന്നു.
//         </p>
//       ),
//       '3 26:3': (
//         <div className="dark:bg-[#2A2C38]  ">
//           <div className="text-center mb-4">
//             <h3 className="text-lg font-medium text-[#2AA0BF] mb-2">Verse Range 1-6</h3>
//             <div className="text-right text-2xl leading-relaxed mb-4 dark:text-white" style={{ fontFamily: "serif" }}>
//               ﴿١﴾ الم ﴿٢﴾ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ﴿٣﴾ الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ ﴿٤﴾ وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ ﴿٥﴾ أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ ﴿٦﴾
//             </div>
//           </div>
//           <p className="text-gray-800 leading-relaxed text-justify dark:text-white">
//             4. നബി(സ) തിരുമേനി ആ സന്ദര്‍ഭത്തില്‍ അകപ്പെട്ടിരുന്ന സ്ഥിതിവിശേഷമാണിവിടെ സൂചിപ്പിക്കുന്നത്. 
//             നബി(സ)ക്കും സഹചാരികള്‍ക്കും എതിരാളികള്‍ ഏല്‍പിച്ചിരുന്ന ദണ്ഡനപീഡനങ്ങളല്ല തിരുമേനിയെ 
//             ദുഃഖാകുലനാക്കിയിരുന്നതെന്ന് ഇതില്‍നിന്ന് വ്യക്തമാണ്. അവിടത്തെ കരളിനെ കാര്‍ന്നുതിന്നുകൊണ്ടിരുന്ന 
//             വേദന മറ്റൊന്നായിരുന്നു: സ്വജനതയെ മാര്‍ഗഭ്രംശത്തില്‍നിന്നും ധര്‍മച്യുതിയില്‍നിന്നും രക്ഷിക്കാന്‍ 
//             തിരുമേനി ശ്രമിച്ചുകൊണ്ടിരിക്കുന്നു. അവരോ, രക്ഷപ്പെടാന്‍ കൂട്ടാക്കുന്നുമില്ല. ഈ ദുര്‍മാര്‍ഗവ്യഗ്രതയുടെ 
//             അനിവാര്യ ഫലം നാശവും നരകവുമാണെന്ന് അറിയാവുന്നതുകൊണ്ട് മാത്രമാണ് അതില്‍നിന്ന് അവരെ തടുത്തുനിര്‍ത്താന്‍ 
//             രാപ്പകല്‍ഭേദമന്യേ തിരുമേനി തീവ്രയത്‌നം ചെയ്തുകൊണ്ടിരുന്നത്. പക്ഷേ, ഞങ്ങളെന്തായാലും ദൈവശിക്ഷയില്‍ 
//             നിപതിച്ചേ അടങ്ങൂ എന്നൊരു ശാഠ്യമായിരുന്നു ജനത്തിന്. ഈ സ്ഥിതിവിശേഷത്തെ തിരുമേനിതന്നെ ഇപ്രകാരം 
//             വര്‍ണിക്കുന്നു: സ്വജനതയെ മാര്‍ഗഭ്രംശത്തില്‍നിന്നും ധര്‍മച്യുതിയില്‍നിന്നും രക്ഷിക്കാന്‍ തിരുമേനി 
//             ശ്രമിച്ചുകൊണ്ടിരിക്കുന്നു. അവരോ, രക്ഷപ്പെടാന്‍ കൂട്ടാക്കുന്നുമില്ല.
//           </p>
//         </div>
//       )
//     };
//     return notes[noteId] || <p>Note content not found.</p>;
//   };

//   return (
//     <>
//     <InterpretationNavbar 
//       interpretationNumber={4} 
//       surahName="18- Al-Kahf" 
//       verseRange="6 - 7" 
//     />
//       <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-[#2A2C38]">
//         <div className="space-y-6">
//           {/* Main Content Block */}
//           <div className="bg-gray-50 dark:bg-[#2A2C38] p-6 rounded-lg border-l-4 dark:border-[#2A2C38] border-white">
//             <div
//               className="text-gray-800 dark:text-white leading-relaxed text-justify space-y-4"
//               style={{ fontFamily: "serif" }}
//             >
//               <p>
//                 <span className="font-semibold">4.</span> നബി(സ) തിരുമേനി ആ
//                 സന്ദര്‍ഭത്തില്‍ അകപ്പെട്ടിരുന്ന സ്ഥിതിവിശേഷമാണിവിടെ
//                 സൂചിപ്പിക്കുന്നത്. നബി(സ)ക്കും സഹചാരികള്‍ക്കും എതിരാളികള്‍
//                 ഏല്‍പിച്ചിരുന്ന ദണ്ഡനപീഡനങ്ങളല്ല തിരുമേനിയെ
//                 ദുഃഖാകുലനാക്കിയിരുന്നതെന്ന് ഇതില്‍നിന്ന് വ്യക്തമാണ്. അവിടത്തെ
//                 കരളിനെ കാര്‍ന്നുതിന്നുകൊണ്ടിരുന്ന വേദന മറ്റൊന്നായിരുന്നു:
//                 സ്വജനതയെ മാര്‍ഗഭ്രംശത്തില്‍നിന്നും ധര്‍മച്യുതിയില്‍നിന്നും
//                 രക്ഷിക്കാന്‍ തിരുമേനി ശ്രമിച്ചുകൊണ്ടിരിക്കുന്നു. അവരോ,
//                 രക്ഷപ്പെടാന്‍ കൂട്ടാക്കുന്നുമില്ല. ഈ ദുര്‍മാര്‍ഗവ്യഗ്രതയുടെ
//                 അനിവാര്യ ഫലം നാശവും നരകവുമാണെന്ന് അറിയാവുന്നതുകൊണ്ട് മാത്രമാണ്
//                 അതില്‍നിന്ന് അവരെ തടുത്തുനിര്‍ത്താന്‍ രാപ്പകല്‍ഭേദമന്യേ
//                 തിരുമേനി തീവ്രയത്‌നം ചെയ്തുകൊണ്ടിരുന്നത്. പക്ഷേ, ഞങ്ങളെന്തായാലും
//                 ദൈവശിക്ഷയില്‍ നിപതിച്ചേ അടങ്ങൂ എന്നൊരു ശാഠ്യമായിരുന്നു ജനത്തിന്.
//                 ഈ സ്ഥിതിവിശേഷത്തെ തിരുമേനിതന്നെ ഇപ്രകാരം വര്‍ണിക്കുന്നു: ഞാനും
//                 നിങ്ങളുമായുള്ള സ്ഥിതി ഒരാള്‍ തീ കൊളുത്തിയ സ്ഥിതിയോടുപമിക്കാവുന്നതാണ്.
//                 തീ കത്തിച്ചത് വെളിച്ചത്തിനു വേണ്ടിയാണെങ്കിലും പാറ്റകളും പ്രാണികളും
//                 സ്വയം കരിഞ്ഞു ചാവാന്‍ അതില്‍ ചെന്നു വീഴുന്നു. അയാള്‍ അവയെ
//                 തീയില്‍നിന്ന് എങ്ങനെയും രക്ഷപ്പെടുത്താന്‍ ആവുംവണ്ണം
//                 ശ്രമിച്ചുനോക്കുന്നു. പക്ഷേ, അവയുണ്ടോ സമ്മതിക്കുന്നു! ഇതാണ് എന്റെയും
//                 സ്ഥിതി. ഞാന്‍ നിങ്ങളുടെ തുണിത്തുമ്പ് പിടിച്ച് വലിച്ചുകൊണ്ടേയിരിക്കുന്നു.
//                 നിങ്ങളോ പിടിയില്‍നിന്ന് കുതറിച്ചാടുകയും.'{" "}
//                 <span className="italic">(ബുഖാരി. താരതമ്യത്തിനു നോക്കുക: അശ്ശുഅറാഅ്, സൂക്തം: </span>
//                 <button 
//                   onClick={() => handleNoteClick('3 26:3')}
//                   className="text-blue-600 underline hover:text-blue-800 transition-colors cursor-pointer"
//                 >
//                   3 26:3
//                 </button>
//                 <span className="italic">)</span>.
//               </p>

//               <p>
//                 "ജനം വിശ്വാസികളാകാത്തതില്‍ മനംനൊന്ത് താങ്കള്‍ സ്വയം ഹനിച്ചേക്കാം"
//                 എന്നാണ് പ്രകൃത വാക്യത്തില്‍ പ്രത്യക്ഷമായി പറഞ്ഞിട്ടുള്ളതെങ്കിലും അതില്‍
//                 ഭംഗ്യന്തരേണ തിരുമേനിയെ സാന്ത്വനപ്പെടുത്തുകയും
//                 സമാശ്വസിപ്പിക്കുകയും കൂടി ചെയ്തിട്ടുണ്ട്. ജനങ്ങള്‍ വിശ്വസിച്ചില്ലെങ്കില്‍
//                 താങ്കള്‍ക്കതില്‍ ഉത്തരവാദിത്വമില്ല. പിന്നെന്തിനു താങ്കള്‍ സ്വയം
//                 വേദനിച്ചു വെന്തുരുകണം? രക്ഷയെക്കുറിച്ച് സന്തോഷവാര്‍ത്തയറിയിക്കുക.
//                 ശിക്ഷയെക്കുറിച്ചു മുന്നറിയിപ്പു നല്‍കുക. ഇതു മാത്രമാണ് താങ്കളുടെ
//                 ദൗത്യം. ജനങ്ങളെ വിശ്വാസമുള്ളവരാക്കുക താങ്കളുടെ കര്‍ത്തവ്യമല്ല.
//                 അതിനാല്‍, സത്യപ്രബോധനമെന്ന താങ്കളുടെ ഡ്യൂട്ടി
//                 നിര്‍വഹിച്ചുകൊണ്ടിരിക്കുക. വിശ്വസിക്കുന്നവര്‍ക്ക്
//                 സന്തോഷവാര്‍ത്തയറിയിക്കുക. നിഷേധികളെ തങ്ങളുടെ ചീത്ത
//                 പരിണാമത്തെക്കുറിച്ച് താക്കീതുചെയ്യുക.{" "}
//                 <button 
//                   onClick={() => handleNoteClick('N1514')}
//                   className="text-blue-600 underline hover:text-blue-800 transition-colors cursor-pointer"
//                 >
//                   N1514
//                 </button>,{" "}
//                 <button 
//                   onClick={() => handleNoteClick('N1462')}
//                   className="text-blue-600 underline hover:text-blue-800 transition-colors cursor-pointer"
//                 >
//                   മുസ്‌ലിം N1462
//                 </button>
//               </p>
//             </div>
//           </div>

//           {/* Navigation Block */}
//           <div className="flex justify-between items-center pt-8 border-t border-gray-200">
//             <button className="flex items-center px-4 py-2 border  dark:bg-[#2A2C38] dark:text-white dark:hover:text-white border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors bg-white">
//               <span className="mr-2">←</span>
//               <span>Previous Ayah</span>
//             </button>

//             <button className="flex items-center px-4 py-2 border dark:bg-[#2A2C38] dark:text-white dark:hover:text-white border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors bg-white">
//               <span>Next Ayah</span>
//               <span className="ml-2">→</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Note Popup */}
//       <NotePopup
//         isOpen={isNoteOpen}
//         onClose={() => setIsNoteOpen(false)}
//         noteId={selectedNote.id}
//         noteContent={selectedNote.content}
//       />
//     </>
//   );
// };

// export default MalayalamInterpreter;


import React, { useState, useEffect, useRef } from "react";
import InterpretationNavbar from "../components/InterpretationNavbar";
import NotePopup from "../components/NotePopup";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AyahModal from "../components/AyahModal";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTheme } from "../context/ThemeContext"; 
import { fetchInterpretation, fetchInterpretationRange, fetchNoteById } from "../api/apifunction"; 

const MalayalamInterpreter = () => {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState({ id: '', content: '' });
  const [showAyahModal, setShowAyahModal] = useState(false);
  const [ayahTarget, setAyahTarget] = useState({ surahId: null, verseId: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);
  const [surahId, setSurahId] = useState(6); // Default to Al-An'am
  const [range, setRange] = useState("3");
  const [iptNo, setIptNo] = useState(1);
  const [lang, setLang] = useState("en");
  const { quranFont } = useTheme();
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  // Fallback note content for when API fails
  const getFallbackNoteContent = (noteId) => {
    const fallbackNotes = {
      'N895': `
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note N895</h3>
          <p>ലാത്ത് - ഇത് ഒരു പ്രാചീന അറബ് ദേവതയുടെ പേരാണ്. ഇസ്ലാമിന് മുമ്പുള്ള അറേബ്യയിൽ ഈ ദേവതയെ ആരാധിച്ചിരുന്നു.</p>
          <p>ഖുർആനിൽ ഈ ദേവതയെ പരാമർശിക്കുന്നത് ബഹുദൈവവാദത്തിന്റെ തെറ്റിനെ വിശദീകരിക്കാനാണ്.</p>
          </div>
      `,
      'N189': `
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note N189</h3>
          <p>ഉസ്സ - ഇതും ഒരു പ്രാചീന അറബ് ദേവതയാണ്. ലാത്ത്, ഉസ്സ, മനാത് എന്നിവ മക്കയിലെ പ്രധാന ദേവതകളായിരുന്നു.</p>
          <p>ഇവയെ "അല്ലാഹുവിന്റെ പുത്രിമാർ" എന്ന് അവർ വിളിച്ചിരുന്നു.</p>
        </div>
      `,
      'N1514': `
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note N1514</h3>
          <p>നബി(സ) തിരുമേനി ആ സന്ദർഭത്തിൽ അകപ്പെട്ടിരുന്ന സ്ഥിതിവിശേഷമാണിവിടെ സൂചിപ്പിക്കുന്നത്.</p>
          <p>നബി(സ)ക്കും സഹചാരികൾക്കും എതിരാളികൾ ഏൽപിച്ചിരുന്ന ദണ്ഡനപീഡനങ്ങളല്ല തിരുമേനിയെ ദുഃഖാകുലനാക്കിയിരുന്നതെന്ന് ഇതിൽനിന്ന് വ്യക്തമാണ്.</p>
          </div>
      `,
      'N1462': `
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note N1462</h3>
          <p>മുസ്ലിം ഹദീസ് ശേഖരത്തിലെ 1462-ാം നമ്പർ ഹദീസിനെ സൂചിപ്പിക്കുന്നു.</p>
          <p>ഈ ഹദീസ് നബി(സ)യുടെ ഉദാഹരണങ്ങളെക്കുറിച്ച് പ്രതിപാദിക്കുന്നു.</p>
        </div>
      `,
      '3 26:3': `
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Verse Reference 3:26:3</h3>
          <p>അശ്ശുഅറാഅ് സൂറയിലെ 26-ാം വാക്യത്തിന്റെ 3-ാം ഭാഗത്തെ സൂചിപ്പിക്കുന്നു.</p>
          <p>ഈ വാക്യം കവികളെക്കുറിച്ചും അവരുടെ പിന്തുടർച്ചക്കാരെക്കുറിച്ചും പ്രതിപാദിക്കുന്നു.</p>
        </div>
      `
    };
    
    return fallbackNotes[noteId] || null;
  };
  // Load interpretation content from API
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use URL params if available, otherwise use defaults
        const currentSurahId = params.surahId ? parseInt(params.surahId) : parseInt(searchParams.get('surahId')) || surahId;
        const currentRange = params.range || searchParams.get('range') || range;
        const currentIpt = params.ipt ? parseInt(params.ipt) : parseInt(searchParams.get('ipt')) || iptNo;
        const currentLang = params.lang || searchParams.get('lang') || lang;
        
        setSurahId(currentSurahId);
        setRange(currentRange);
        setIptNo(currentIpt);
        setLang(currentLang);
        
        // Fetch interpretation content
        const isSingle = /^\d+$/.test(currentRange);
        const data = isSingle
          ? await fetchInterpretation(currentSurahId, parseInt(currentRange, 10), currentIpt, currentLang)
          : await fetchInterpretationRange(currentSurahId, currentRange, currentIpt, currentLang);
        
        // Normalize to array
        const items = Array.isArray(data) ? data : [data];
        setContent(items);
      } catch (err) {
        setError(err.message || "Failed to load interpretation");
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, [params, searchParams]);

  const handleNoteClick = async (noteId) => {
    console.log('=== NOTE CLICK DEBUG ===');
    console.log('Note ID:', noteId);
    console.log('Note ID type:', typeof noteId);
    
    // Show loading state immediately
    setSelectedNote({ id: noteId, content: 'Loading...' });
    setIsNoteOpen(true);
    
    // Try to get fallback content first (for immediate display)
    const fallbackContent = getFallbackNoteContent(noteId);
    if (fallbackContent) {
      console.log('Using fallback content for:', noteId);
      setSelectedNote({ id: noteId, content: fallbackContent });
    }
    
    try {
      // Try to fetch from API (but don't block the UI)
      console.log('Fetching note from API...');
      const noteData = await fetchNoteById(noteId);
      console.log('Note data received:', noteData);
      console.log('Note data type:', typeof noteData);
      console.log('Note data keys:', noteData ? Object.keys(noteData) : 'No data');
      
      // Try different possible content fields
      const content = noteData?.content || 
                     noteData?.html || 
                     noteData?.text || 
                     noteData?.body ||
                     noteData?.description ||
                     noteData?.note ||
                     (typeof noteData === 'string' ? noteData : null);
      
      if (content && content !== 'Note content not available') {
        console.log('Using API content for:', noteId);
        setSelectedNote({ id: noteId, content });
      } else {
        console.log('API content not available, keeping fallback for:', noteId);
        // Keep the fallback content that was already set
      }
    } catch (err) {
      console.error('Error fetching note:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        stack: err.stack
      });
      
      // If no fallback content was set, show error
      if (!fallbackContent) {
        setSelectedNote({ id: noteId, content: `Error loading note ${noteId}: ${err.message}` });
      }
      // Otherwise, keep the fallback content that was already set
    }
  };

  const handleContentClick = (e) => {
    const target = e.target;
    
    // Check if clicked element is a highlighted note/verse
    const isHighlightedElement = target.classList.contains('note-highlight') || 
                                 target.closest('.note-highlight') ||
                                 target.closest('sup') || 
                                 target.closest('a');
    
    if (!isHighlightedElement) return;
    
    // Get the text content
    const highlightedElement = target.classList.contains('note-highlight') ? target : target.closest('.note-highlight');
    const sup = target.closest('sup');
    const a = target.closest('a');
    
    const idText = (highlightedElement?.innerText || sup?.innerText || a?.innerText || '').trim();
    if (!idText) return;
    
    console.log('Clicked element text:', idText);
    
    // Detect verse pattern like (2:163) or 2:163
    const verseMatch = idText.match(/^\(?(\d+)\s*[:：]\s*(\d+)\)?$/);
    if (verseMatch) {
      const [, s, v] = verseMatch;
      console.log('Opening verse modal for:', s, v);
      setAyahTarget({ surahId: parseInt(s, 10), verseId: parseInt(v, 10) });
      setShowAyahModal(true);
      return;
    }
    
    // Otherwise treat as note id
    console.log('Opening note popup for:', idText);
    handleNoteClick(idText);
  };

  // Style inline note markers like N895 or "3 26:3"
  const applyHighlighting = () => {
    if (!contentRef.current) return;
    
    // First, remove any existing highlighting to prevent duplicates
    const existingHighlights = contentRef.current.querySelectorAll('.note-highlight');
    existingHighlights.forEach(highlight => {
      const parent = highlight.parentNode;
      parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
      parent.normalize(); // Merge adjacent text nodes
    });
    
    // Find all potential note markers - both in sup/a tags and in regular text
    const textNodes = [];
    
    // Get all text nodes
    const walker = document.createTreeWalker(
      contentRef.current,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      // Only process text nodes that are not already inside highlighted elements
      if (node.parentElement && 
          !node.parentElement.classList.contains('note-highlight') &&
          !node.parentElement.closest('.note-highlight') &&
          node.textContent.trim()) {
        textNodes.push(node);
      }
    }
    
    // Process text nodes that contain note patterns
    textNodes.forEach((textNode) => {
      const text = textNode.textContent;
      const parent = textNode.parentElement;
      
      // Check for note patterns in text
      const notePatterns = [
        { regex: /N\d+/g, type: 'note' },
        { regex: /\(\d+:\d+\)/g, type: 'verse' },
        { regex: /\d+\s+\d+:\d+/g, type: 'range' }
      ];
      
      notePatterns.forEach(({ regex, type }) => {
        if (regex.test(text)) {
          // Choose color based on type
          let color, bgColor, borderColor;
          if (type === 'note') {
            color = '#1e40af';
            bgColor = '#dbeafe';
            borderColor = '#3b82f6';
          } else if (type === 'verse') {
            color = '#059669';
            bgColor = '#d1fae5';
            borderColor = '#10b981';
          } else { // range
            color = '#7c3aed';
            bgColor = '#ede9fe';
            borderColor = '#8b5cf6';
          }
          
          // Replace text with highlighted version
          const highlightedText = text.replace(regex, (match) => {
               return `<span class="note-highlight" style="color: #2AA0BF !important; text-decoration: none !important; cursor: pointer !important; font-weight: 600 !important;">${match}</span>`;
          });
          
          if (highlightedText !== text) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = highlightedText;
            parent.replaceChild(tempDiv.firstChild, textNode);
          }
        }
      });
    });
    
    // Also handle existing sup/a tags
    const markers = contentRef.current.querySelectorAll('sup, a');
    markers.forEach((m) => {
      const t = (m.innerText || '').trim();
      // Note ids like N895, N1514
      if (/^N\d+$/.test(t)) {
        m.style.setProperty('color', '#2AA0BF', 'important');
        m.style.setProperty('text-decoration', 'none', 'important');
        m.style.setProperty('cursor', 'pointer', 'important');
        m.style.setProperty('font-weight', '600', 'important');
        return;
      }
      // Verse refs like 2:163 or (2:163)
      if (/^\(?\d+\s*[:：]\s*\d+\)?$/.test(t)) {
        m.style.setProperty('color', '#2AA0BF', 'important');
        m.style.setProperty('text-decoration', 'none', 'important');
        m.style.setProperty('cursor', 'pointer', 'important');
        m.style.setProperty('font-weight', '600', 'important');
        return;
      }
      // Range like "3 26:3"
      if (/^\d+\s+\d+:\d+$/.test(t)) {
        m.style.setProperty('color', '#2AA0BF', 'important');
        m.style.setProperty('text-decoration', 'none', 'important');
        m.style.setProperty('cursor', 'pointer', 'important');
        m.style.setProperty('font-weight', '600', 'important');
      }
    });
  };

  // Apply highlighting when content changes
  useEffect(() => {
    applyHighlighting();
  }, [content]);

  // Re-apply highlighting when popup closes to ensure it's still visible
  useEffect(() => {
    if (!isNoteOpen && !showAyahModal) {
      // Small delay to ensure DOM is ready
      setTimeout(applyHighlighting, 100);
    }
  }, [isNoteOpen, showAyahModal]);

  // Use MutationObserver to watch for DOM changes and re-apply highlighting
  useEffect(() => {
    if (!contentRef.current) return;
    
    const observer = new MutationObserver((mutations) => {
      let shouldReapply = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          shouldReapply = true;
        }
      });
      if (shouldReapply) {
        setTimeout(applyHighlighting, 50);
      }
    });

    observer.observe(contentRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    return () => observer.disconnect();
  }, [content]);

  // Extract text content from API response
  const extractText = (item) => {
    if (item == null) return "";
    if (typeof item === "string") return item;
    // Common possible fields
    const preferredKeys = [
      "interpret_text",
      "interpretation",
      "text",
      "content",
      "meaning",
      "body",
      "desc",
      "description",
    ];
    for (const key of preferredKeys) {
      if (typeof item[key] === "string" && item[key].trim().length > 0) return item[key];
    }
    // Fallback: first long string field
    for (const [k, v] of Object.entries(item)) {
      if (typeof v === "string" && v.trim().length > 20) return v;
    }
    // Final fallback
    try { return JSON.stringify(item); } catch { return String(item); }
  };

  // Hardcoded note rendering removed; all note clicks navigate to /note/:id

  return (
    <>
           <style>
             {`
               .note-highlight {
                 color: #2AA0BF !important;
                 text-decoration: none !important;
                 cursor: pointer !important;
                 font-weight: 600 !important;
               }
               sup.note-highlight, a.note-highlight {
                 color: #2AA0BF !important;
                 text-decoration: none !important;
                 cursor: pointer !important;
                 font-weight: 600 !important;
               }
             `}
           </style>
    <InterpretationNavbar 
      interpretationNumber={iptNo} 
      surahName={`${surahId}- Surah`} 
      verseRange={range.replace(/-/g, " - ")}
      onWordByWord={() => {}} 
    />
      <div className="w-full  mx-auto p-3 sm:p-4 lg:p-6 bg-white dark:bg-[#2A2C38] max-w-[1073px] ">
        <div className="space-y-4 sm:space-y-6">
          {/* Header controls (read-only display) */}
          <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
            <span>Surah: {surahId}</span>
            <span>• Range: {range}</span>
            <span>• Interpretation: {iptNo}</span>
            <span>• Lang: {lang}</span>
            <button 
              onClick={() => handleNoteClick('N189')}
              className="ml-4 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Test Note N189
            </button>
          </div>

          {loading && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-300">Loading interpretation…</div>
          )}

          {error && (
            <div className="text-red-600 dark:text-red-400 py-4">{error}</div>
          )}

          {!loading && !error && content.length === 0 && (
            <div className="text-center py-10 text-gray-600 dark:text-gray-300">No interpretation found for this selection.</div>
          )}

          {/* Content */}
          {content.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-[#2A2C38] p-3 sm:p-4 lg:p-6 rounded-lg border-l-4 dark:border-[#2A2C38] border-white"
            >
              <div
                className="text-gray-800 dark:text-white leading-relaxed text-justify space-y-3 sm:space-y-4 prose prose-sm dark:prose-invert max-w-none"
                ref={contentRef}
                onClick={handleContentClick}
                style={{ fontFamily: "serif" }}
                dangerouslySetInnerHTML={{ __html: extractText(item) }}
              />
            </div>
          ))}

          {/* Navigation Block */}
      {/* Navigation Block - Fixed Bottom */}
<div className=" bottom-0 left-0 w-full flex justify-between gap-3 sm:gap-0 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2A2C38] z-50">
  <button
    className="flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors group min-h-[44px] 
    text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-500"
  >
    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
    <span className="text-xs sm:text-sm font-medium">Previous Ayah</span>
  </button>

  <button
    className="flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors group min-h-[44px] 
    text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-500"
  >
    <span className="text-xs sm:text-sm font-medium">Next Ayah</span>
    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
  </button>
</div>

        </div>
      </div>

      {/* Popups */}
      {isNoteOpen && (
      <NotePopup
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        noteId={selectedNote.id}
        noteContent={selectedNote.content}
      />
      )}
             {showAyahModal && ayahTarget.surahId && ayahTarget.verseId && (
               <AyahModal
                 surahId={ayahTarget.surahId}
                 verseId={ayahTarget.verseId}
                 onClose={() => setShowAyahModal(false)}
                 interpretationNo={iptNo}
                 language={lang}
               />
             )}
    </>
  );
};

export default MalayalamInterpreter;