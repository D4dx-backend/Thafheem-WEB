import{j as e,az as h}from"./index-CQnsQrCL.js";import{u as x,b as o}from"./react-vendor-v5ei6ytj.js";const g=()=>{const i=x(),[s,l]=o.useState([]),[t,p]=o.useState(!0),[a,n]=o.useState(null);o.useEffect(()=>{let r=!0;return(async()=>{try{p(!0),n(null);const d=await h();if(!r)return;l(d.sections||[]),d.error&&n("Unable to fetch content from the server.")}catch{r&&(n("Unable to load content. Please try again later."),l([]))}finally{r&&p(!1)}})(),()=>{r=!1}},[]);const c=()=>{window.history.state&&window.history.state.idx>0?i(-1):i("/")};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        .prose-content img {
          max-width: 100% !important;
          height: auto;
        }
        .prose-content table {
          max-width: 100% !important;
          table-layout: auto;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .prose-content table td,
        .prose-content table th {
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 0;
        }
        .prose-content pre {
          max-width: 100% !important;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .prose-content code {
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: pre-wrap;
        }
        .prose-content blockquote {
          max-width: 100% !important;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .prose-content * {
          max-width: 100% !important;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .prose-content {
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
      `}),e.jsx("div",{className:"min-h-screen bg-white dark:bg-gray-900 font-poppins overflow-x-hidden",children:e.jsxs("div",{className:"max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8",children:[e.jsx("button",{onClick:c,className:"text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4",children:"← Back"}),e.jsxs("div",{className:"mb-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 mb-2 dark:text-white",children:"The Finality of Prophethood"}),e.jsx("p",{className:"text-gray-600 dark:text-gray-300",children:"English content from Thafheem resources."}),e.jsx("div",{className:"mt-4 h-px bg-gray-200 dark:bg-gray-700"})]}),t&&e.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Loading content..."}),!t&&a&&e.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:a}),!t&&!a&&s.length===0&&e.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Content is not available at the moment."}),!t&&!a&&s.length>0&&e.jsx("div",{className:"space-y-8 overflow-x-hidden",children:s.map((r,w)=>e.jsxs("section",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7 overflow-hidden",children:[r.title&&e.jsx("div",{className:"mb-4 prose prose-lg dark:prose-invert max-w-none break-words overflow-wrap-anywhere prose-content font-poppins",dangerouslySetInnerHTML:{__html:r.title}}),e.jsx("div",{className:"prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 break-words overflow-wrap-anywhere prose-content font-poppins",dangerouslySetInnerHTML:{__html:r.text||""},style:{lineHeight:1.8,textAlign:"justify",wordWrap:"break-word",overflowWrap:"break-word",maxWidth:"100%",fontFamily:"'Poppins', sans-serif"}})]},r.id||w))})]})})]})};export{g as default};
