import{j as t,ap as j,aq as U}from"./index-D80Klju5.js";import{u as q,b as p}from"./react-vendor-v5ei6ytj.js";const S=()=>{const y=q(),[h,b]=p.useState([]),[c,k]=p.useState(!0),[f,u]=p.useState(null),[i,d]=p.useState({open:!1,footnoteId:"",content:"",loading:!1,error:null});p.useEffect(()=>{let o=!0;return(async()=>{try{k(!0),u(null);const e=await j();if(!o)return;b(e.sections||[]),e.error&&u("Unable to fetch content from the server.")}catch{o&&(u("Unable to load content. Please try again later."),b([]))}finally{o&&k(!1)}})(),()=>{o=!1}},[]);const v=()=>{window.history.state&&window.history.state.idx>0?y(-1):y("/")},w=async o=>{const r=o.target.closest(".footnote-link")||o.target.closest("sup.footnote-link");if(!r)return;const e=r.getAttribute("data-footnote-id");if(!e){console.log("No footnote ID found on target:",r);return}o.preventDefault(),o.stopPropagation(),console.log("Footnote clicked:",e),d({open:!0,footnoteId:e,content:"Loading...",loading:!0,error:null});try{const n=await U(e);if(n?.footnote_text)d({open:!0,footnoteId:e,content:n.footnote_text,loading:!1,error:null});else throw n?.error?new Error(n.error):new Error("Footnote content not available")}catch(n){d({open:!0,footnoteId:e,content:"Footnote content not available.",loading:!1,error:n?.message||"Unable to load footnote."})}},N=(o=0)=>{let r="max-w-3xl",e="min(85vw, 500px)",n="min(90vw, 800px)";o<=300?(r="max-w-xl",e="min(80vw, 450px)",n="min(85vw, 576px)"):o<=800?(r="max-w-2xl",e="min(85vw, 500px)",n="min(90vw, 672px)"):o<=1500?(r="max-w-3xl",e="min(85vw, 550px)",n="min(90vw, 768px)"):(r="max-w-4xl",e="min(88vw, 600px)",n="min(92vw, 896px)");const g=o>500;return{widthClass:r,needsMaxHeight:g,minWidth:e,maxWidth:n}};return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
        .urdu-finality-content p {
          text-align: right !important;
          font-size: 16px !important;
          line-height: 2.6 !important;
          margin-bottom: 10px !important;
          font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
        }
        .urdu-finality-content .footnote-link,
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
        .urdu-finality-content .footnote-link:hover,
        .footnote-link:hover {
          color: #0891b2 !important;
          text-decoration: underline !important;
        }
        .urdu-finality-content .footnote-link:focus,
        .footnote-link:focus {
          outline: 2px solid #06b6d4 !important;
          outline-offset: 2px !important;
        }
        /* Ensure sup tags with footnote-link are styled correctly */
        sup.footnote-link,
        .urdu-finality-content sup.footnote-link {
          vertical-align: super !important;
          font-size: 0.85em !important;
          color: #06b6d4 !important;
          cursor: pointer !important;
          text-decoration: underline !important;
          font-weight: normal !important;
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 1px !important;
        }
        sup.footnote-link:hover,
        .urdu-finality-content sup.footnote-link:hover {
          color: #0891b2 !important;
        }
        /* Prevent any link behavior from markdown parser */
        sup.footnote-link a,
        .urdu-finality-content sup.footnote-link a {
          color: inherit !important;
          text-decoration: inherit !important;
          pointer-events: none !important;
        }
        /* Remove any href attributes that might cause navigation */
        sup.footnote-link[href],
        .urdu-finality-content sup.footnote-link[href] {
          pointer-events: none !important;
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
        /* Urdu modal content styling */
        .footnote-modal-container [dir="rtl"] {
          font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
        }
        .footnote-modal-container [dir="rtl"] p,
        .footnote-modal-container [dir="rtl"] div,
        .footnote-modal-container [dir="rtl"] span {
          text-align: justify !important;
          text-align-last: right !important;
          direction: rtl !important;
        }
        /* Ensure proper justification for RTL Urdu text */
        .urdu-footnote-content {
          text-align: justify !important;
          text-align-last: right !important;
          direction: rtl !important;
          font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
        }
        .urdu-footnote-content * {
          text-align: justify !important;
          text-align-last: right !important;
        }
        .urdu-footnote-content div {
          text-align: justify !important;
          text-align-last: right !important;
          direction: rtl !important;
        }
        /* Remove any inline styles that might override justification */
        .urdu-footnote-content [style*="text-align"] {
          text-align: justify !important;
          text-align-last: right !important;
        }
        /* Smooth scrolling for modal content */
        .footnote-modal-container .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .footnote-modal-container .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .footnote-modal-container .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .footnote-modal-container .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .footnote-modal-container .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        /* Dark mode scrollbar */
        .dark .footnote-modal-container .overflow-y-auto {
          scrollbar-color: #475569 #1e293b;
        }
        .dark .footnote-modal-container .overflow-y-auto::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .dark .footnote-modal-container .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .footnote-modal-container .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}),t.jsx("div",{className:"p-6 dark:bg-gray-900 min-h-screen",dir:"rtl",children:t.jsxs("div",{className:"sm:max-w-[1070px] max-w-[350px] w-full mx-auto font-poppins",children:[t.jsx("button",{onClick:v,className:"text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4 text-left",style:{direction:"ltr"},children:"← Back"}),t.jsx("h2",{className:"text-2xl font-bold mb-2 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2",dir:"rtl",children:"اب نبی کی آخر ضرورت کیا ہے؟"}),c&&t.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Loading content..."}),!c&&f&&t.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:f}),!c&&!f&&h.length===0&&t.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Content is not available at the moment."}),!c&&!f&&h.length>0&&t.jsx("div",{className:"space-y-8 ml-4 sm:ml-6 md:ml-8 lg:ml-12",dir:"rtl",children:h.map((o,r)=>t.jsxs("section",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7",onClick:w,children:[o.title&&t.jsx("div",{className:`mb-4 text-right prose prose-lg dark:prose-invert max-w-none font-urdu-nastaliq
                      prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:text-gray-900 dark:prose-h1:text-white
                      prose-h2:text-xl prose-h2:font-bold prose-h2:mb-3 prose-h2:text-gray-900 dark:prose-h2:text-white
                      prose-h3:text-lg prose-h3:font-semibold prose-h3:mb-3 prose-h3:text-gray-900 dark:prose-h3:text-white`,dangerouslySetInnerHTML:{__html:o.title},style:{textAlign:"right",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"}}),t.jsx("div",{className:`prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed 
                    prose-headings:text-right prose-p:text-right prose-p:mb-4 prose-p:text-justify
                    prose-ul:text-right prose-ol:text-right prose-li:text-right prose-li:mb-2
                    prose-strong:text-gray-900 dark:prose-strong:text-white
                    prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:text-right prose-blockquote:border-r-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
                    prose-h1:text-right prose-h2:text-right prose-h3:text-right prose-h4:text-right
                    prose-h1:font-bold prose-h2:font-bold prose-h3:font-semibold
                    text-gray-800 dark:text-gray-200 font-urdu-nastaliq urdu-finality-content`,dangerouslySetInnerHTML:{__html:o.text||""},style:{textAlign:"right",fontSize:"16px",lineHeight:"2.6",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"}})]},o.id||r))}),i.open&&(()=>{const o=i.content?.length||0,{widthClass:r,needsMaxHeight:e,minWidth:n,maxWidth:g}=N(o);return t.jsx("div",{className:"fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-20 pb-4",onClick:a=>{a.target===a.currentTarget&&d({open:!1,footnoteId:"",content:"",loading:!1,error:null})},children:t.jsxs("div",{className:`footnote-modal-container bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full ${r} max-h-[90vh] max-w-[95vw] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200`,style:{minWidth:n,maxWidth:g,height:e?"90vh":"auto",maxHeight:"90vh"},onClick:a=>a.stopPropagation(),dir:"rtl",children:[t.jsxs("div",{className:"flex items-start justify-between p-4 sm:p-5 pb-3 flex-shrink-0 border-b border-gray-200 dark:border-gray-700",children:[t.jsx("div",{children:t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 dark:text-white",style:{fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"},children:["حاشیہ ",i.footnoteId]})}),t.jsx("button",{onClick:()=>d({open:!1,footnoteId:"",content:"",loading:!1,error:null}),className:"text-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded","aria-label":"Close",children:"✕"})]}),t.jsx("div",{className:"flex-1 min-h-0 overflow-hidden flex flex-col",children:t.jsxs("div",{className:"p-4 sm:p-5 pt-4 overflow-y-auto flex-1",style:{maxHeight:"calc(90vh - 80px)"},children:[i.loading?t.jsx("div",{className:"text-sm text-gray-600 dark:text-gray-300 text-center py-4",style:{fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"},children:"لوڈ ہو رہا ہے..."}):t.jsx("div",{className:"urdu-footnote-content text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-200 break-words",style:{textAlign:"justify",textAlignLast:"right",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif",wordWrap:"break-word",overflowWrap:"break-word",fontSize:"16px",lineHeight:"2.6",direction:"rtl"},dangerouslySetInnerHTML:{__html:i.content?(()=>{let a=i.content;a=a.replace(/\[\{#anchor-\d+\}\]/g,""),a=a.replace(/\\\s*\n/g," ");let m=a.split(/\r\n\r\n|\n\n|\r\r/);if(m.length===1){let l=a.split(/\r\n|\n|\r/);m=[];let s=[];for(let x of l)x=x.trim(),x.length===0?s.length>0&&(m.push(s.join(" ")),s=[]):s.push(x);s.length>0&&m.push(s.join(" "))}return a=m.map(l=>l.trim()).filter(l=>l.length>0).map(l=>`<p style="text-align: justify; text-align-last: right; direction: rtl; font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif; line-height: 2.6; margin-bottom: 1.5em; margin-top: 0;">${l}</p>`).join(""),`<div style="text-align: justify; text-align-last: right; direction: rtl; font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif;">${a}</div>`})():""}}),i.error&&t.jsx("div",{className:"mt-3 text-xs text-red-600 dark:text-red-300",style:{fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"},children:i.error})]})})]})})})()]})})]})};export{S as default};
