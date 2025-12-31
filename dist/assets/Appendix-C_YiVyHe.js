import{u as w,j as a,Y as A}from"./index-D0NMIq43.js";import{d as k,b as l}from"./react-vendor-v5ei6ytj.js";const s={malayalam:{title:"Malayalam Appendix",apiLanguage:"malayalam"},english:{title:"English Appendix",apiLanguage:"english"},urdu:{title:"Urdu Appendix",apiLanguage:"urdu"},hindi:{title:"Hindi Appendix",apiLanguage:"hindi"},bangla:{title:"Bangla Appendix",apiLanguage:"bangla"},tamil:{title:"Tamil Appendix",apiLanguage:"tamil"}},M=()=>{const{lang:b}=k(),{translationLanguage:S}=w(),t=String(b||"english").toLowerCase(),p=l.useMemo(()=>t==="ta"||t==="tamil"?s.tamil:t.startsWith("mal")?s.malayalam:t.startsWith("urdu")||t==="u"?s.urdu:t.startsWith("hindi")||t==="hi"?s.hindi:t.startsWith("bangla")||t==="bn"?s.bangla:s.english,[t]),e=t==="ta"||t==="tamil"||t.startsWith("tamil"),i=t.startsWith("urdu")||t==="u",r=t.startsWith("mal"),o=t.startsWith("bangla")||t==="bn",j=t.startsWith("hindi")||t==="hi",g=!e&&!i&&!r&&!o&&!j,[x,c]=l.useState([]),[m,h]=l.useState(!0),[d,f]=l.useState(null);l.useEffect(()=>{let n=!0;return(async()=>{try{h(!0),f(null);const u=await A(p.apiLanguage);if(!n)return;c(u.sections||[]),u.error&&f("Unable to fetch appendix content from the server.")}catch{n&&(f("Unable to load appendix content. Please try again later."),c([]))}finally{n&&h(!1)}})(),()=>{n=!1}},[p.apiLanguage]);const N=n=>!i||!n?n:n.replace(/\)\?([A-Z][^(]+)\(/g,"($1?)").replace(/\(\?([A-Z][^)]+)\)/g,"($1?)");return a.jsxs("div",{className:"p-6 dark:bg-gray-900 min-h-screen",children:[i&&a.jsx("style",{children:`
          .urdu-appendix-content p {
            text-align: right !important;
            font-size: 16px !important;
            line-height: 2.6 !important;
            margin-bottom: 10px !important;
            font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
          }
        `}),g&&a.jsx("style",{children:`
          .english-appendix-content {
            text-align: justify !important;
          }
          .english-appendix-content p {
            text-align: justify !important;
          }
        `}),r&&a.jsx("style",{children:`
          .malayalam-appendix-content {
            font-family: 'Noto Sans Malayalam' !important;
          }
          .malayalam-appendix-content p {
            text-align: justify !important;
            margin-bottom: 2em !important;
            font-family: 'Noto Sans Malayalam';
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
        `}),e&&a.jsx("style",{children:`
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
        `}),a.jsxs("div",{className:"sm:max-w-[1070px] max-w-[350px] w-full mx-auto font-poppins",children:[a.jsx("h2",{className:"text-2xl font-bold mb-2 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2",children:p.title}),a.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-6",children:p.description}),m&&a.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Loading appendix..."}),!m&&d&&a.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:d}),!m&&!d&&x.length===0&&a.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Appendix content is not available at the moment."}),!m&&!d&&x.length>0&&a.jsx("div",{className:"space-y-8",dir:i?"rtl":"ltr",children:x.map((n,y)=>a.jsxs("section",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7",children:[n.title&&a.jsx("h3",{className:`text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 ${o?"font-bengali":""} ${i?"font-urdu-nastaliq":""} ${r?"font-malayalam":""} ${e?"font-tamil":""}`,dangerouslySetInnerHTML:{__html:N(n.title)},style:i?{textAlign:"right",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"}:r?{fontFamily:"'Noto Sans Malayalam'"}:e?{fontFamily:"'Bamini', serif",textAlign:"justify"}:{}}),a.jsx("div",{className:`prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-7 prose-a:text-cyan-600 dark:prose-a:text-cyan-400 ${o?"font-bengali bangla-appendix-content":""} ${i?"font-urdu-nastaliq urdu-appendix-content":""} ${g?"english-appendix-content":""} ${r?"malayalam-appendix-content":""} ${e?"tamil-appendix-content":""}`,dangerouslySetInnerHTML:{__html:n.text||""},style:i?{textAlign:"right",fontSize:"16px",lineHeight:"2.6",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"}:g?{textAlign:"justify",fontFamily:"'Poppins', sans-serif"}:r?{fontFamily:"'Noto Sans Malayalam'"}:o?{textAlign:"justify",fontFamily:"'Noto Sans Bengali', 'Kalpurush', sans-serif"}:e?{textAlign:"justify",textJustify:"inter-word",fontFamily:"'Bamini', serif",lineHeight:"1.8",wordWrap:"break-word",overflowWrap:"break-word"}:{}})]},n.id||y))})]})]})};export{M as default};
