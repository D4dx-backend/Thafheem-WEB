import{j as t,ao as m}from"./index-DmadXW_T.js";import{u as g,b as s}from"./react-vendor-v5ei6ytj.js";const b=()=>{const l=g(),[a,d]=s.useState([]),[r,p]=s.useState(!0),[o,n]=s.useState(null);s.useEffect(()=>{let e=!0;return(async()=>{try{p(!0),n(null);const i=await m();if(!e)return;d(i.sections||[]),i.error&&n("Unable to fetch content from the server.")}catch{e&&(n("Unable to load content. Please try again later."),d([]))}finally{e&&p(!1)}})(),()=>{e=!1}},[]);const x=()=>{window.history.state&&window.history.state.idx>0?l(-1):l("/")};return t.jsxs("div",{className:"p-6 dark:bg-gray-900 min-h-screen",dir:"rtl",children:[t.jsx("style",{children:`
        .urdu-finality-content p {
          text-align: right !important;
          font-size: 16px !important;
          line-height: 2.6 !important;
          margin-bottom: 10px !important;
          font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
        }
      `}),t.jsxs("div",{className:"sm:max-w-[1070px] max-w-[350px] w-full mx-auto font-poppins",children:[t.jsx("button",{onClick:x,className:"text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4 text-left",style:{direction:"ltr"},children:"← Back"}),t.jsx("h2",{className:"text-2xl font-bold mb-2 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2",dir:"rtl",children:"اب نبی کی آخر ضرورت کیا ہے؟"}),r&&t.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Loading content..."}),!r&&o&&t.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:o}),!r&&!o&&a.length===0&&t.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300",children:"Content is not available at the moment."}),!r&&!o&&a.length>0&&t.jsx("div",{className:"space-y-8 ml-4 sm:ml-6 md:ml-8 lg:ml-12",dir:"rtl",children:a.map((e,h)=>t.jsxs("section",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7",children:[e.title&&t.jsx("div",{className:`mb-4 text-right prose prose-lg dark:prose-invert max-w-none font-urdu-nastaliq
                      prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:text-gray-900 dark:prose-h1:text-white
                      prose-h2:text-xl prose-h2:font-bold prose-h2:mb-3 prose-h2:text-gray-900 dark:prose-h2:text-white
                      prose-h3:text-lg prose-h3:font-semibold prose-h3:mb-3 prose-h3:text-gray-900 dark:prose-h3:text-white`,dangerouslySetInnerHTML:{__html:e.title},style:{textAlign:"right",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"}}),t.jsx("div",{className:`prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed 
                    prose-headings:text-right prose-p:text-right prose-p:mb-4 prose-p:text-justify
                    prose-ul:text-right prose-ol:text-right prose-li:text-right prose-li:mb-2
                    prose-strong:text-gray-900 dark:prose-strong:text-white
                    prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:text-right prose-blockquote:border-r-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
                    prose-h1:text-right prose-h2:text-right prose-h3:text-right prose-h4:text-right
                    prose-h1:font-bold prose-h2:font-bold prose-h3:font-semibold
                    text-gray-800 dark:text-gray-200 font-urdu-nastaliq urdu-finality-content`,dangerouslySetInnerHTML:{__html:e.text||""},style:{textAlign:"right",fontSize:"16px",lineHeight:"2.6",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"}})]},e.id||h))})]})]})};export{b as default};
