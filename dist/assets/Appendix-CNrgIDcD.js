import{i as A,j as a,Y as v}from"./index-D80Klju5.js";import{d as S,u as L,b as l}from"./react-vendor-v5ei6ytj.js";const s={malayalam:{title:"Malayalam Appendix",apiLanguage:"malayalam"},english:{title:"English Appendix",apiLanguage:"english"},urdu:{title:"Urdu Appendix",apiLanguage:"urdu"},hindi:{title:"Hindi Appendix",apiLanguage:"hindi"},bangla:{title:"Bangla Appendix",apiLanguage:"bangla"},tamil:{title:"Tamil Appendix",apiLanguage:"tamil"}},$=()=>{const{lang:j}=S(),c=L(),{translationLanguage:B}=A(),t=String(j||"english").toLowerCase(),p=l.useMemo(()=>t==="ta"||t==="tamil"?s.tamil:t.startsWith("mal")?s.malayalam:t.startsWith("urdu")||t==="u"?s.urdu:t.startsWith("hindi")||t==="hi"?s.hindi:t.startsWith("bangla")||t==="bn"?s.bangla:s.english,[t]),i=t==="ta"||t==="tamil"||t.startsWith("tamil"),e=t.startsWith("urdu")||t==="u",r=t.startsWith("mal"),o=t.startsWith("bangla")||t==="bn",N=t.startsWith("hindi")||t==="hi",x=!i&&!e&&!r&&!o&&!N,[g,h]=l.useState([]),[m,y]=l.useState(!0),[d,f]=l.useState(null);l.useEffect(()=>{let n=!0;return(async()=>{try{y(!0),f(null);const u=await v(p.apiLanguage);if(!n)return;h(u.sections||[]),u.error&&f("Unable to fetch appendix content from the server.")}catch{n&&(f("Unable to load appendix content. Please try again later."),h([]))}finally{n&&y(!1)}})(),()=>{n=!1}},[p.apiLanguage]);const w=()=>{window.history.state&&window.history.state.idx>0?c(-1):c("/authorpreface")},k=n=>!e||!n?n:n.replace(/\)\?([A-Z][^(]+)\(/g,"($1?)").replace(/\(\?([A-Z][^)]+)\)/g,"($1?)");return a.jsxs("div",{className:"p-6 dark:bg-gray-900 min-h-screen",children:[e&&a.jsx("style",{children:`
          .urdu-appendix-content p {
            text-align: right !important;
            font-size: 16px !important;
            line-height: 2.6 !important;
            margin-bottom: 10px !important;
            font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
          }
        `}),x&&a.jsx("style",{children:`
          .english-appendix-content {
            text-align: justify !important;
          }
          .english-appendix-content p {
            text-align: justify !important;
          }
        `}),r&&a.jsx("style",{children:`
          .malayalam-appendix-content {
            font-family: 'NotoSansMalayalam' !important;
          }
          .malayalam-appendix-content p {
            text-align: justify !important;
            margin-bottom: 2em !important;
            font-family: 'NotoSansMalayalam';
            font-size: 16px;
            line-height: 1.7;
          }
        `}),o&&a.jsx("style",{children:`
          .bangla-appendix-content {
            text-align: justify !important;
            font-family: 'Noto Sans Bengali', 'Kalpurush', sans-serif !important;
          }
          .bangla-appendix-content p {
            text-align: justify !important;
            margin-bottom: 1em !important;
            font-family: 'Noto Sans Bengali', 'Kalpurush', sans-serif !important;
            font-size: 16px !important;
            line-height: 1.7 !important;
          }
        `}),i&&a.jsx("style",{children:`
          .tamil-appendix-content {
            font-family: 'Bamini', serif !important;
            text-align: justify !important;
            text-justify: inter-word !important;
            line-height: 1.8 !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          .tamil-appendix-content p {
            margin-bottom: 1.5em !important;
            text-align: justify !important;
            text-justify: inter-word !important;
            font-family: 'Bamini', serif !important;
            font-size: 16px !important;
            line-height: 1.8 !important;
          }
          .tamil-appendix-content h1,
          .tamil-appendix-content h2,
          .tamil-appendix-content h3,
          .tamil-appendix-content h4,
          .tamil-appendix-content strong {
            font-family: 'Bamini', serif !important;
            text-align: justify !important;
          }
        `}),a.jsxs("div",{className:"sm:max-w-[1070px] max-w-[350px] w-full mx-auto font-poppins",children:[a.jsx("button",{onClick:w,className:"text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4",children:"← Back"}),a.jsx("h2",{className:"text-2xl font-bold mb-2 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2",children:p.title}),a.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-6",children:p.description}),m&&a.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Loading appendix..."}),!m&&d&&a.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:d}),!m&&!d&&g.length===0&&a.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Appendix content is not available at the moment."}),!m&&!d&&g.length>0&&a.jsx("div",{className:"space-y-8",dir:e?"rtl":"ltr",children:g.map((n,b)=>a.jsxs("section",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7",children:[n.title&&a.jsx("h3",{className:`text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 ${o?"font-bengali":""} ${e?"font-urdu-nastaliq":""} ${r?"font-malayalam":""} ${i?"font-tamil":""}`,dangerouslySetInnerHTML:{__html:k(n.title)},style:e?{textAlign:"right",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"}:r?{fontFamily:"'NotoSansMalayalam'"}:i?{fontFamily:"'Bamini', serif",textAlign:"justify"}:{}}),a.jsx("div",{className:`prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-7 prose-a:text-cyan-600 dark:prose-a:text-cyan-400 ${o?"font-bengali bangla-appendix-content":""} ${e?"font-urdu-nastaliq urdu-appendix-content":""} ${x?"english-appendix-content":""} ${r?"malayalam-appendix-content":""} ${i?"tamil-appendix-content":""}`,dangerouslySetInnerHTML:{__html:n.text||""},style:e?{textAlign:"right",fontSize:"16px",lineHeight:"2.6",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"}:x?{textAlign:"justify",fontFamily:"'Poppins', sans-serif"}:r?{fontFamily:"'NotoSansMalayalam'"}:o?{textAlign:"justify",fontFamily:"'Noto Sans Bengali', 'Kalpurush', sans-serif"}:i?{textAlign:"justify",textJustify:"inter-word",fontFamily:"'Bamini', serif",lineHeight:"1.8",wordWrap:"break-word",overflowWrap:"break-word"}:{}})]},n.id||b))})]})]})};export{$ as default};
