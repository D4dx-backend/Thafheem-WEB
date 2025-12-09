import{i as A,j as a,W as w}from"./index-ZyCXWqTv.js";import{d as v,u as L,b as s}from"./react-vendor-v5ei6ytj.js";const r={malayalam:{title:"Malayalam Appendix",apiLanguage:"malayalam"},english:{title:"English Appendix",apiLanguage:"english"},urdu:{title:"Urdu Appendix",apiLanguage:"urdu"},hindi:{title:"Hindi Appendix",apiLanguage:"hindi"},bangla:{title:"Bangla Appendix",apiLanguage:"bangla"}},M=()=>{const{lang:N}=v(),c=L(),{translationLanguage:l}=A(),t=String(N||"english").toLowerCase(),h=t.startsWith("bangla")||t==="bn"||l==="bn",o=s.useMemo(()=>t.startsWith("mal")?r.malayalam:t.startsWith("urdu")||t==="u"?r.urdu:t.startsWith("hindi")||t==="hi"?r.hindi:t.startsWith("bangla")||t==="bn"?r.bangla:r.english,[t]),n=t.startsWith("urdu")||t==="u"||l==="ur"||l==="urdu",i=t.startsWith("mal")||l==="mal",m=t.startsWith("english")||t==="e"||!t.startsWith("mal")&&!t.startsWith("urdu")&&!t.startsWith("hindi")&&!t.startsWith("bangla"),[g,f]=s.useState([]),[d,y]=s.useState(!0),[p,x]=s.useState(null);s.useEffect(()=>{let e=!0;return(async()=>{try{y(!0),x(null);const u=await w(o.apiLanguage);if(!e)return;f(u.sections||[]),u.error&&x("Unable to fetch appendix content from the server.")}catch{e&&(x("Unable to load appendix content. Please try again later."),f([]))}finally{e&&y(!1)}})(),()=>{e=!1}},[o.apiLanguage]);const j=()=>{window.history.state&&window.history.state.idx>0?c(-1):c("/authorpreface")},k=e=>!n||!e?e:e.replace(/\)\?([A-Z][^(]+)\(/g,"($1?)").replace(/\(\?([A-Z][^)]+)\)/g,"($1?)");return a.jsxs("div",{className:"p-6 dark:bg-gray-900 min-h-screen",children:[n&&a.jsx("style",{children:`
          .urdu-appendix-content p {
            text-align: right !important;
            font-size: 16px !important;
            line-height: 2.6 !important;
            margin-bottom: 10px !important;
            font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
          }
        `}),m&&a.jsx("style",{children:`
          .english-appendix-content {
            text-align: justify !important;
          }
          .english-appendix-content p {
            text-align: justify !important;
          }
        `}),i&&a.jsx("style",{children:`
          .malayalam-appendix-content {
            font-family: 'Noto Sans Malayalam', sans-serif !important;
          }
          .malayalam-appendix-content p {
            font-family: 'Noto Sans Malayalam', sans-serif !important;
          }
        `}),a.jsxs("div",{className:"sm:max-w-[1070px] max-w-[350px] w-full mx-auto font-poppins",children:[a.jsx("button",{onClick:j,className:"text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4",children:"← Back"}),a.jsx("h2",{className:"text-2xl font-bold mb-2 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2",children:o.title}),a.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-6",children:o.description}),d&&a.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Loading appendix..."}),!d&&p&&a.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:p}),!d&&!p&&g.length===0&&a.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Appendix content is not available at the moment."}),!d&&!p&&g.length>0&&a.jsx("div",{className:"space-y-8",dir:n?"rtl":"ltr",children:g.map((e,b)=>a.jsxs("section",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7",children:[e.title&&a.jsx("h3",{className:`text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 ${h?"font-bengali":""} ${n?"font-urdu-nastaliq":""} ${i?"font-malayalam":""}`,dangerouslySetInnerHTML:{__html:k(e.title)},style:n?{textAlign:"right",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"}:i?{fontFamily:"'Noto Sans Malayalam', sans-serif"}:{}}),a.jsx("div",{className:`prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-7 prose-a:text-cyan-600 dark:prose-a:text-cyan-400 ${h?"font-bengali":""} ${n?"font-urdu-nastaliq urdu-appendix-content":""} ${m?"english-appendix-content":""} ${i?"malayalam-appendix-content":""}`,dangerouslySetInnerHTML:{__html:e.text||""},style:n?{textAlign:"right",fontSize:"16px",lineHeight:"2.6",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"}:m?{textAlign:"justify",fontFamily:"'Poppins', sans-serif"}:i?{fontFamily:"'Noto Sans Malayalam', sans-serif"}:{}})]},e.id||b))})]})]})};export{M as default};
