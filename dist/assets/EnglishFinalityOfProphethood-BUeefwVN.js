import{j as e,aD as b,aE as u}from"./index-D80Klju5.js";import{u as y,b as l}from"./react-vendor-v5ei6ytj.js";const j=()=>{const m=y(),[c,x]=l.useState([]),[i,f]=l.useState(!0),[d,p]=l.useState(null),[a,s]=l.useState({open:!1,footnoteId:"",content:"",loading:!1,error:null});l.useEffect(()=>{let t=!0;return(async()=>{try{f(!0),p(null);const r=await b();if(!t)return;x(r.sections||[]),r.error&&p("Unable to fetch content from the server.")}catch{t&&(p("Unable to load content. Please try again later."),x([]))}finally{t&&f(!1)}})(),()=>{t=!1}},[]);const w=()=>{window.history.state&&window.history.state.idx>0?m(-1):m("/")},h=async t=>{const n=t.target.closest(".footnote-link")||t.target.closest("sup.footnote-link");if(!n)return;const r=n.getAttribute("data-footnote-id");if(!r){console.log("No footnote ID found on target:",n);return}t.preventDefault(),t.stopPropagation(),console.log("Footnote clicked:",r),s({open:!0,footnoteId:r,content:"Loading...",loading:!0,error:null});try{const o=await u(r);if(o?.footnote_text)s({open:!0,footnoteId:r,content:o.footnote_text,loading:!1,error:null});else throw o?.error?new Error(o.error):new Error("Footnote content not available")}catch(o){s({open:!0,footnoteId:r,content:"Footnote content not available.",loading:!1,error:o?.message||"Unable to load footnote."})}},g=(t=0)=>{let n="max-w-lg";t<=300?n="max-w-md":t<=600?n="max-w-lg":t<=1200?n="max-w-2xl":t<=2e3?n="max-w-3xl":n="max-w-4xl";const r=t>1500;return{widthClass:n,needsMaxHeight:r}};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
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
        .prose-content,
        .prose-content *,
        .prose-content p,
        .prose-content h1,
        .prose-content h2,
        .prose-content h3,
        .prose-content h4,
        .prose-content h5,
        .prose-content h6,
        .prose-content span,
        .prose-content div,
        .prose-content li,
        .prose-content ul,
        .prose-content ol,
        .prose-content strong,
        .prose-content em,
        .prose-content a,
        .prose-content blockquote {
          font-family: 'Poppins', sans-serif !important;
        }
      `}),e.jsx("style",{children:`
        .prose-content .footnote-link,
        .footnote-link {
          color: #06b6d4 !important;
          background: transparent !important;
          border: none !important;
          padding: 0 2px !important;
          cursor: pointer !important;
          text-decoration: underline !important;
          font-size: inherit !important;
          font-family: inherit !important;
          transition: color 0.15s ease !important;
          display: inline !important;
        }
        .prose-content .footnote-link:hover,
        .footnote-link:hover {
          color: #0891b2 !important;
          text-decoration: underline !important;
        }
        .prose-content .footnote-link:focus,
        .footnote-link:focus {
          outline: 2px solid #06b6d4 !important;
          outline-offset: 2px !important;
        }
        /* Ensure sup tags with footnote-link are styled correctly */
        sup.footnote-link,
        .prose-content sup.footnote-link {
          vertical-align: baseline !important;
          font-size: 0.9em !important;
          color: #06b6d4 !important;
          cursor: pointer !important;
          text-decoration: underline !important;
        }
        sup.footnote-link:hover,
        .prose-content sup.footnote-link:hover {
          color: #0891b2 !important;
        }
        /* Modal animation */
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .footnote-modal-container {
          animation: modalFadeIn 0.2s ease-out;
        }
      `}),e.jsx("div",{className:"min-h-screen bg-white dark:bg-gray-900 font-poppins overflow-x-hidden",children:e.jsxs("div",{className:"max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8",children:[e.jsx("button",{onClick:w,className:"text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4",children:"← Back"}),e.jsxs("div",{className:"mb-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 mb-2 dark:text-white",children:"The Finality of Prophethood"}),e.jsx("div",{className:"mt-4 h-px bg-gray-200 dark:bg-gray-700"})]}),i&&e.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Loading content..."}),!i&&d&&e.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:d}),!i&&!d&&c.length===0&&e.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Content is not available at the moment."}),!i&&!d&&c.length>0&&e.jsx("div",{className:"space-y-8 overflow-x-hidden",children:c.map((t,n)=>e.jsxs("section",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7 overflow-hidden",onClick:h,children:[t.title&&e.jsx("div",{className:"mb-4 prose prose-lg dark:prose-invert max-w-none break-words overflow-wrap-anywhere prose-content font-poppins",dangerouslySetInnerHTML:{__html:t.title},style:{fontFamily:"'Poppins', sans-serif"}}),e.jsx("div",{className:"prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 break-words overflow-wrap-anywhere prose-content font-poppins",dangerouslySetInnerHTML:{__html:t.text||""},style:{lineHeight:1.8,textAlign:"justify",wordWrap:"break-word",overflowWrap:"break-word",maxWidth:"100%",fontFamily:"'Poppins', sans-serif"}})]},t.id||n))}),a.open&&(()=>{const t=a.content?.length||0,{widthClass:n,needsMaxHeight:r}=g(t);return e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-4",onClick:o=>{o.target===o.currentTarget&&s({open:!1,footnoteId:"",content:"",loading:!1,error:null})},children:e.jsxs("div",{className:`footnote-modal-container bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full ${n} ${r?"max-h-[90vh]":"max-h-[95vh]"} max-w-[95vw] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200`,style:{minWidth:"min(90vw, 320px)",maxWidth:"min(95vw, 896px)"},onClick:o=>o.stopPropagation(),children:[e.jsxs("div",{className:"flex items-start justify-between p-4 sm:p-5 pb-3 flex-shrink-0 border-b border-gray-200 dark:border-gray-700",children:[e.jsx("div",{children:e.jsxs("h3",{className:"text-lg font-semibold text-gray-900 dark:text-white",children:["Footnote ",a.footnoteId]})}),e.jsx("button",{onClick:()=>s({open:!1,footnoteId:"",content:"",loading:!1,error:null}),className:"text-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded","aria-label":"Close",children:"✕"})]}),e.jsx("div",{className:`${r?"flex-1 min-h-0 overflow-hidden flex flex-col":""}`,children:e.jsxs("div",{className:`p-4 sm:p-5 pt-4 ${r?"overflow-y-auto flex-1":""}`,children:[a.loading?e.jsx("div",{className:"text-sm text-gray-600 dark:text-gray-300 text-center py-4",children:"Loading..."}):e.jsx("div",{className:"text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-200 break-words text-justify prose-content",style:{textAlign:"justify",fontFamily:"'Poppins', sans-serif",wordWrap:"break-word",overflowWrap:"break-word"},dangerouslySetInnerHTML:{__html:a.content?(()=>{let o=a.content;return o=o.replace(/^[\s\r\n]*footnote\s*\d+\.\s*/i,""),o=o.replace(/\r\n/g,"<br>").replace(/\n/g,"<br>").replace(/\r/g,"<br>"),o=o.trim(),o})():""}}),a.error&&e.jsx("div",{className:"mt-3 text-xs text-red-600 dark:text-red-300",children:a.error})]})})]})})})()]})})]})};export{j as default};
