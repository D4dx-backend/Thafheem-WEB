import{g as bt,r as c,t as kt,ad as Nt,j as i,N as St,q as wt,ae as $t,J as Y,I as At,x as H,z as jt}from"./index-D2bCerlO.js";import{W as Bt,A as Ct}from"./WordByWord-DQOcv8oE.js";import{I as Tt}from"./InterpretationNavbar-Bey27izA.js";import q from"./hindiTranslationService-BBKiYQvL.js";import J from"./urduTranslationService-CWrhNGUr.js";const Rt=({surahId:K,range:G,interpretationNo:Q=1,language:X="en",onClose:Z})=>{const{user:tt}=bt?.()||{user:null},[M,P]=c.useState(!0),[S,w]=c.useState(null),[x,$]=c.useState([]),[F,W]=c.useState(""),[A,R]=c.useState(!1),[O,I]=c.useState({id:"",content:null}),[j,f]=c.useState(!1),[b,y]=c.useState({surahId:null,verseId:null}),L=c.useRef([]),[et,V]=c.useState(!1),[nt,at]=c.useState([]),[g,_]=c.useState([]),[d,rt]=c.useState(K),[o,v]=c.useState(G),[l,st]=c.useState(Q),[m,Et]=c.useState(X),[ot,it]=c.useState(!1);c.useEffect(()=>(document.body.style.overflow="hidden",()=>{document.body.style.overflow=""}),[]);const B=()=>{it(!0),setTimeout(()=>{Z()},200)};c.useEffect(()=>{d&&(async()=>{try{const n=await wt();at(n.map(r=>({value:r.id,label:`${r.id}- ${r.english||"Surah"}`})));const t=n.find(r=>r.id===Number(d));W(`${d}- ${t?.english||"Surah"}`)}catch{W(`${d}- Surah`)}})()},[d]),c.useEffect(()=>{let e=!0;return(async()=>{try{const n=await kt();if(!e)return;const r=n.find(u=>u.number===Number(d))?.ayahs||286,a=Array.from({length:r},(u,p)=>String(p+1));_(a)}catch{e&&_(Array.from({length:50},(t,r)=>String(r+1)))}})(),()=>{e=!1}},[d]),c.useEffect(()=>{(async()=>{if(!(!d||!o))try{P(!0),w(null),$([]);let n;if(m==="mal")if(/^\d+$/.test(o)){const a=await $t(d,parseInt(o,10),"mal");if(l&&a.length>0){const u=a.filter(p=>p.InterpretationNo===String(l)||p.interptn_no===l);n=u.length>0?u:[a[0]]}else n=a}else n=await Y(d,o,l,"mal");else if(m==="hi")if(/^\d+$/.test(o)){const a=await q.getExplanation(d,parseInt(o,10));n=a&&a!=="N/A"?[{Interpretation:a,AudioIntrerptn:a,text:a,content:a,InterpretationNo:l}]:[]}else{const[a,u]=o.split("-").map(s=>parseInt(s.trim(),10));n=(await q.fetchBlockwiseHindi(d,a,u)).map(s=>({Interpretation:s.explanation,AudioIntrerptn:s.explanation,text:s.explanation,content:s.explanation,InterpretationNo:l,ayah:s.ayah}))}else if(m==="ur")if(/^\d+$/.test(o)){const a=await J.getExplanation(d,parseInt(o,10));n=a&&a!=="N/A"?[{Interpretation:a,AudioIntrerptn:a,text:a,content:a,InterpretationNo:l}]:[]}else{const[a,u]=o.split("-").map(s=>parseInt(s.trim(),10));n=(await J.fetchBlockwiseUrdu(d,a,u)).map(s=>({Interpretation:s.translation,AudioIntrerptn:s.translation,text:s.translation,content:s.translation,InterpretationNo:l,ayah:s.ayah}))}else n=/^\d+$/.test(o)?await At(d,parseInt(o,10),l,m):await Y(d,o,l,m);const t=Array.isArray(n)?n:[n];if(t.length>0){const r=t.map(a=>a?.InterpretationNo||a?.interpretationNo||a?.interptn_no).filter(Boolean);t[0]}if(t.length===0||t.length===1&&(!t[0]||Object.keys(t[0]).length===0)||t.length===1&&t[0].Interpretation==="")if(console.warn(`⚠️ No interpretation ${l} available for range ${o}`),l!==1){st(1),alert(`Interpretation ${l} is not available for verses ${o}. Loading interpretation 1.`);return}else alert(`No interpretation available for verses ${o}.`),w(`No interpretation available for verses ${o}.`),$([]);else $(t)}catch(n){console.error(`❌ Failed to load interpretation ${l}:`,n);let t="Failed to load interpretation";n.message?.includes("500")?t=`Server error loading interpretation ${l}. Please try again later.`:n.message?.includes("404")?t=`Interpretation ${l} not found for this selection.`:n.message?.includes("network")||n.message?.includes("fetch")?t="Network error. Please check your connection.":t=`Interpretation ${l} is not available.`,w(t)}finally{P(!1)}})()},[d,o,l,m]);const k=()=>{L.current.forEach(e=>{if(!e)return;e.querySelectorAll("sup, a").forEach(t=>{const r=(t.innerText||t.textContent||"").trim();r&&(t.style.removeProperty("color"),t.style.removeProperty("text-decoration"),t.style.removeProperty("cursor"),t.style.removeProperty("font-weight"),/^N\d+$/.test(r)?(t.setAttribute("data-type","note"),t.setAttribute("data-value",r),t.onclick=T):(/^\(?\d+\s*[:：]\s*\d+\)?$/.test(r)||/^\d+\s*[:：]\s*\d+$/.test(r)||/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*\d+\s+\d+:\d+/.test(r)||/സൂക്തം:\s*\d+\s+\d+:\d+/.test(r))&&(t.setAttribute("data-type","verse"),t.setAttribute("data-value",r),t.onclick=T))})})};c.useEffect(()=>{x.length>0&&(k(),setTimeout(k,100))},[x]),c.useEffect(()=>{!A&&!j&&x.length>0&&(k(),setTimeout(k,100))},[A,j]);const lt=e=>({N895:`
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note N895</h3>
          <p>ലാത്ത് - ഇത് ഒരു പ്രാചീന അറബ് ദേവതയുടെ പേരാണ്. ഇസ്ലാമിന് മുമ്പുള്ള അറേബ്യയിൽ ഈ ദേവതയെ ആരാധിച്ചിരുന്നു.</p>
          <p>ഖുർആനിൽ ഈ ദേവതയെ പരാമർശിക്കുന്നത് ബഹുദൈവവാദത്തിന്റെ തെറ്റിനെ വിശദീകരിക്കാനാണ്.</p>
        </div>
      `,N189:`
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note N189</h3>
          <p>ഉസ്സ - ഇതും ഒരു പ്രാചീന അറബ് ദേവതയാണ്. ലാത്ത്, ഉസ്സ, മനാത് എന്നിവ മക്കയിലെ പ്രധാന ദേവതകളായിരുന്നു.</p>
          <p>ഇവയെ "അല്ലാഹുവിന്റെ പുത്രിമാർ" എന്ന് അവർ വിളിച്ചിരുന്നു.</p>
        </div>
      `})[e]||null,C=async e=>{I({id:e,content:"Loading..."}),R(!0);const n=lt(e);n&&I({id:e,content:n});try{const t=await jt(e),r=t?.NoteText||t?.content||t?.html||t?.text||t?.body||t?.description||t?.note||(typeof t=="string"?t:null);r&&r!=="Note content not available"&&I({id:e,content:r})}catch(t){!t.message?.includes("500")&&!t.message?.includes("Network error")&&console.warn(`Failed to fetch note ${e}:`,t.message),n||I({id:e,content:`
            <div class="note-content">
              <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note ${e}</h3>
              <p style="color: #666;">Note content is temporarily unavailable. Please try again later.</p>
            </div>
          `})}},T=e=>{e.preventDefault(),e.stopPropagation();const n=e.target,t=n.getAttribute("data-type"),r=n.getAttribute("data-value"),a=n.innerText||n.textContent||"";if(!a)return;if(t==="verse"||t==="range"){const s=r||a,h=s.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/)||s.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);if(h){const[,E,D]=h;y({surahId:parseInt(E,10),verseId:parseInt(D,10)}),f(!0);return}const N=s.match(/^\(?(\d+)\s*[:：]\s*(\d+)\)?$/);if(N){const[,E,D]=N;y({surahId:parseInt(E,10),verseId:parseInt(D,10)}),f(!0);return}}else if(t==="note"){C(r||a);return}const u=a.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/)||a.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);if(u){const[,s,h]=u;y({surahId:parseInt(s,10),verseId:parseInt(h,10)}),f(!0);return}const p=a.match(/^\(?(\d+)\s*[:：]\s*(\d+)\)?$/);if(p){const[,s,h]=p;y({surahId:parseInt(s,10),verseId:parseInt(h,10)}),f(!0);return}C(a)},ct=e=>{const n=e.target;if(n.tagName==="SUP"||n.tagName==="A"){T(e);return}const t=n.innerText||n.textContent||"",r=t.match(/N(\d+)/);if(r){const p=`N${r[1]}`;C(p);return}const a=t.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/)||t.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);if(a){const[,p,s]=a;y({surahId:parseInt(p,10),verseId:parseInt(s,10)}),f(!0);return}const u=t.match(/\(?(\d+)\s*[:：]\s*(\d+)\)?/);if(u){const[,p,s]=u;y({surahId:parseInt(p,10),verseId:parseInt(s,10)}),f(!0);return}},dt=e=>{rt(parseInt(e,10))},pt=e=>{v(String(e))},ut=()=>{const e=String(o);if(/^\d+$/.test(e)){const n=parseInt(e,10);if(n<=1){alert("Already at the first verse");return}const t=n-1;v(String(t))}else if(/^(\d+)-(\d+)$/.test(e)){const n=e.match(/^(\d+)-(\d+)$/);if(n){const[,t,r]=n,a=parseInt(t,10),p=parseInt(r,10)-a+1;if(a<=1){alert("Already at the first block");return}const s=Math.max(1,a-p),h=s+p-1;v(`${s}-${h}`)}}},ht=()=>{const e=String(o);if(/^\d+$/.test(e)){const n=parseInt(e,10),t=g.length>0?parseInt(g[g.length-1],10):286;if(n>=t){alert("Already at the last verse of this surah");return}const r=n+1;v(String(r))}else if(/^(\d+)-(\d+)$/.test(e)){const n=e.match(/^(\d+)-(\d+)$/);if(n){const[,t,r]=n,a=parseInt(t,10),u=parseInt(r,10),p=u-a+1,s=g.length>0?parseInt(g[g.length-1],10):286;if(u>=s){alert("Already at the last block of this surah");return}const h=a+p,N=Math.min(s,h+p-1);v(`${h}-${N}`)}}},mt=async()=>{try{V(!0);const e=H.getEffectiveUserId(tt);await H.addBlockInterpretationBookmark(e,d,o,F,l,m),alert(`Saved interpretation for Surah ${d}, verses ${o}`)}catch(e){console.error("Failed to bookmark interpretation",e),alert("Failed to save interpretation bookmark")}finally{setTimeout(()=>V(!1),300)}},ft=async()=>{const e=`Interpretation ${l} — Surah ${d} • Range ${o}`,n=`${window.location.origin}/interpretation-blockwise?surahId=${d}&range=${o}&ipt=${l}&lang=${m}`;try{navigator.share?await navigator.share({title:document.title||"Thafheem",text:e,url:n}):(await navigator.clipboard.writeText(`${e}
${n}`),alert("Link copied to clipboard"))}catch(t){console.error("Share failed",t),alert("Share failed: "+t.message)}},[gt,U]=c.useState(!1),[yt,z]=c.useState(1),xt=()=>{const e=/^\d+/.exec(String(o))?.[0]||"1";z(parseInt(e)),U(!0)},vt=e=>{if(e==null)return"";if(typeof e=="string")return e;const n=["interpret_text","InterpretText","Interpret_Text","interpretation","Interpretation","text","Text","content","Content","meaning","Meaning","body","Body","desc","Desc","description","Description"];for(const t of n)if(typeof e[t]=="string"&&e[t].trim().length>0)return e[t];for(const[t,r]of Object.entries(e))if(typeof r=="string"&&r.trim().length>20)return r;return console.warn("⚠️ No valid interpretation text found in item:",e),`<p class="text-gray-500 italic">No interpretation content available for interpretation ${l}</p>`},It=document.getElementById("modal-root")||document.body;return Nt.createPortal(i.jsxs(i.Fragment,{children:[i.jsx("style",{children:`
        /* Entry animations */
        @keyframes backdropFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes modalSlideDown {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
        }
        .animate-backdrop-fade-in {
          animation: backdropFadeIn 0.2s ease-out;
        }
        .animate-modal-slide-up {
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-modal-slide-down {
          animation: modalSlideDown 0.2s ease-in;
        }
        
        /* Specific styling for note and verse markers in interpretation content */
        .interpretation-content sup[data-type="note"], 
        .interpretation-content a[data-type="note"],
        .interpretation-content sup[data-type="verse"], 
        .interpretation-content a[data-type="verse"] {
          transition: all 0.2s ease !important;
          color: #2AA0BF !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          text-decoration: none !important;
        }
        
        .interpretation-content sup[data-type="note"]:hover, 
        .interpretation-content a[data-type="note"]:hover,
        .interpretation-content sup[data-type="verse"]:hover, 
        .interpretation-content a[data-type="verse"]:hover {
          color: #1e7a8c !important;
          text-decoration: underline !important;
          transform: scale(1.05) !important;
        }
        
        /* Fallback for elements without data-type but with note/verse patterns */
        .interpretation-content sup:not([data-type]), 
        .interpretation-content a:not([data-type]) {
          color: #2AA0BF !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          text-decoration: none !important;
          transition: all 0.2s ease !important;
        }
        
        .interpretation-content sup:not([data-type]):hover, 
        .interpretation-content a:not([data-type]):hover {
          color: #1e7a8c !important;
          text-decoration: underline !important;
          transform: scale(1.05) !important;
        }
        `}),i.jsxs("div",{className:"fixed inset-0 z-[99999] flex items-end sm:items-center justify-center",children:[i.jsx("div",{className:"fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity",onClick:B}),i.jsxs("div",{className:`relative w-full sm:w-auto sm:max-w-4xl xl:max-w-[1073px] max-h-[85vh] sm:max-h-[90vh] bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-slideUp sm:animate-fadeIn overflow-hidden ${ot?"animate-slideDown sm:animate-fadeOut":""}`,children:[i.jsx("div",{className:"w-full flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing",onClick:B,children:i.jsx("div",{className:"w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"})}),i.jsx("div",{className:"flex-shrink-0 z-10 bg-white dark:bg-gray-900",children:i.jsx(Tt,{interpretationNumber:l,surahName:F,verseRange:o.replace(/-/g," - "),onClose:B,onBookmark:mt,onShare:ft,onWordByWord:xt,bookmarking:et,surahOptions:nt,rangeOptions:g,onPickSurah:dt,onPickRange:pt,onPrev:ut,onNext:ht,isModal:!0})}),i.jsxs("div",{className:"flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 min-h-0",children:[M&&i.jsx("div",{className:"flex items-center justify-center py-8",children:i.jsxs("div",{className:"text-center",children:[i.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"}),i.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"Loading interpretation..."})]})}),S&&i.jsxs("div",{className:"text-center py-8",children:[i.jsx("p",{className:"text-red-500 dark:text-red-400 text-lg mb-2",children:"Failed to load interpretation"}),i.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400 mb-4",children:S}),i.jsx("button",{onClick:()=>window.location.reload(),className:"px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors",children:"Try Again"})]}),!M&&!S&&x.length===0&&i.jsx("div",{className:"text-center py-10 text-gray-600 dark:text-gray-300",children:"No interpretation found for this selection."}),i.jsx("div",{className:"font-poppins space-y-6 sm:space-y-8",children:x.map((e,n)=>i.jsx("div",{className:"mb-6 sm:mb-8",children:i.jsx("div",{className:"interpretation-content text-gray-700 leading-relaxed dark:text-gray-300 text-sm sm:text-base prose dark:prose-invert max-w-none",ref:t=>L.current[n]=t,onClick:ct,style:{pointerEvents:"auto",position:"relative",zIndex:1},dangerouslySetInnerHTML:{__html:vt(e)}})},`${d}-${o}-${l}-${e?.ID||e?.id||n}`))},`block-${d}-${o}-${l}`)]}),gt&&i.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-[100000] pt-24 sm:pt-28 lg:pt-32 p-4 overflow-hidden",children:i.jsx(Bt,{selectedVerse:yt,surahId:d,onClose:()=>U(!1),onNavigate:z,onSurahChange:()=>{}})})]})]}),i.jsx(St,{isOpen:A,onClose:()=>R(!1),noteId:O.id,noteContent:O.content}),j&&b.surahId&&b.verseId&&i.jsx(Ct,{surahId:b.surahId,verseId:b.verseId,onClose:()=>f(!1),interpretationNo:l,language:m})]}),It)};export{Rt as B};
