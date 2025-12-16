import{j as t,aJ as h}from"./index-CUlJBpza.js";import{u as f,b as s}from"./react-vendor-v5ei6ytj.js";const u=()=>{const m=f(),[n,l]=s.useState([]),[a,d]=s.useState(!0),[r,i]=s.useState(null);s.useEffect(()=>{let e=!0;return(async()=>{try{d(!0),i(null);const o=await h();if(!e)return;l(o.sections||[]),o.error&&i("Unable to fetch content from the server.")}catch{e&&(i("Unable to load content. Please try again later."),l([]))}finally{e&&d(!1)}})(),()=>{e=!1}},[]);const c=()=>{window.history.state&&window.history.state.idx>0?m(-1):m("/")};return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
        .tamil-jesus-mohammed-content {
          font-family: 'Bamini', serif !important;
          text-align: justify !important;
          text-justify: inter-word !important;
          line-height: 1.8 !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        .tamil-jesus-mohammed-content p {
          margin-bottom: 1.5em !important;
          text-align: justify !important;
          text-justify: inter-word !important;
          font-family: 'Bamini', serif !important;
          font-size: 16px !important;
          line-height: 1.8 !important;
        }
        .tamil-jesus-mohammed-content h1,
        .tamil-jesus-mohammed-content h2,
        .tamil-jesus-mohammed-content h3,
        .tamil-jesus-mohammed-content h4,
        .tamil-jesus-mohammed-content strong {
          font-family: 'Bamini', serif !important;
          text-align: justify !important;
        }
      `}),t.jsx("div",{className:"min-h-screen bg-white dark:bg-gray-900 font-tamil overflow-x-hidden",children:t.jsxs("div",{className:"max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8",children:[t.jsx("button",{onClick:c,className:"text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4",children:"← Back"}),t.jsxs("div",{className:"mb-6",children:[t.jsx("h1",{className:"text-3xl font-bold text-gray-900 mb-2 dark:text-white font-tamil",children:"இயேசு மற்றும் முஹம்மது"}),t.jsx("div",{className:"mt-4 h-px bg-gray-200 dark:bg-gray-700"})]}),a&&t.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Loading content..."}),!a&&r&&t.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:r}),!a&&!r&&n.length===0&&t.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Content is not available at the moment."}),!a&&!r&&n.length>0&&t.jsx("div",{className:"space-y-8",children:n.map((e,x)=>t.jsxs("section",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7",children:[e.title&&t.jsx("h3",{className:"text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 font-tamil",dangerouslySetInnerHTML:{__html:e.title},style:{fontFamily:"'Bamini', serif",textAlign:"justify"}}),t.jsx("div",{className:"prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 break-words overflow-wrap-anywhere tamil-jesus-mohammed-content",dangerouslySetInnerHTML:{__html:e.text||""},style:{lineHeight:1.8,textAlign:"justify",textJustify:"inter-word",wordWrap:"break-word",overflowWrap:"break-word",fontFamily:"'Bamini', serif"}})]},e.id||x))})]})})]})};export{u as default};
