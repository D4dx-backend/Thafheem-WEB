import{u as f,j as r,ap as y}from"./index-C60dBqWj.js";import{u as v,b as p}from"./react-vendor-v5ei6ytj.js";const T=()=>{const b=v(),{translationLanguage:h}=f(),e=h==="mal",[a,m]=p.useState(null),[s,x]=p.useState(!1),[d,l]=p.useState(null);p.useEffect(()=>{if(!e){m(null),l(null);return}let o=!0;return(async()=>{try{x(!0),l(null);const i=await y();if(!o)return;m(i),i.error&&l("Unable to fetch content from the server.")}catch{o&&(l("Unable to load content. Please try again later."),m(null))}finally{o&&x(!1)}})(),()=>{o=!1}},[e]);const g=()=>{window.history.state&&window.history.state.idx>0?b(-1):b("/")};return r.jsx("div",{className:"min-h-screen bg-white dark:bg-gray-900 font-poppins overflow-x-hidden",children:r.jsxs("div",{className:"max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8 overflow-x-hidden",children:[r.jsx("button",{onClick:g,className:"text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4",children:"← Back"}),r.jsxs("div",{className:"mb-6",children:[r.jsx("h1",{className:`text-3xl font-bold text-gray-900 mb-2 dark:text-white ${e?"font-malayalam":""}`,children:e?"വിവർത്തകർ":"Translators"}),r.jsx("p",{className:"text-gray-600 dark:text-gray-300",children:e?"തഫ്ഹീമിന്റെ മലയാളം സ്രോതസുകളില്‍നിന്നുള്ള ഉള്ളടക്കം.":"Information about the translators."}),r.jsx("div",{className:"mt-4 h-px bg-gray-200 dark:bg-gray-700"})]}),e&&r.jsxs(r.Fragment,{children:[s&&r.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam",children:"ഉള്ളടക്കം ലോഡുചെയ്യുന്നു..."}),!s&&d&&r.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:d}),!s&&!d&&(!a||!a.text)&&r.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam",children:"ഇപ്പോൾ ഉള്ളടക്കം ലഭ്യമല്ല."}),!s&&!d&&a&&a.text&&(()=>{const o=n=>{if(!n)return n;const t="https://thafheem.net";return n.replace(/src=["'](\/articles\/[^"']+)["']/g,(u,c)=>c.startsWith("http://")||c.startsWith("https://")?u:`src="${t}${c}"`)},w=n=>{if(!n)return n;let t=n;return t=t.replace(/\s*style=["'][^"']*border[^"']*["']/gi,""),t=t.replace(/\s*style=["'][^"']*outline[^"']*["']/gi,""),t=t.replace(/\s*border=["'][^"']*["']/gi,""),t=t.replace(/\s*border=\d+/gi,""),t=t.replace(/@\s*/g,'<div class="translator-separator"></div>'),t},i=a.title?o(w(a.title)):null,k=o(w(a.text));return r.jsxs("div",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7 overflow-hidden",children:[i&&r.jsx("div",{className:"mb-4 prose prose-lg dark:prose-invert max-w-none font-malayalam overflow-hidden",dangerouslySetInnerHTML:{__html:i}}),r.jsx("div",{className:"prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 font-malayalam overflow-hidden",dangerouslySetInnerHTML:{__html:k},style:{lineHeight:1.8,textAlign:"justify",overflowWrap:"break-word",wordWrap:"break-word",wordBreak:"break-word",overflowX:"hidden"}}),r.jsx("style",{children:`
                    .prose {
                      overflow-x: hidden !important;
                      word-wrap: break-word !important;
                      overflow-wrap: break-word !important;
                      word-break: break-word !important;
                      max-width: 100% !important;
                    }
                    .prose * {
                      border: none !important;
                      outline: none !important;
                      box-shadow: none !important;
                      max-width: 100% !important;
                      overflow-wrap: break-word !important;
                      word-wrap: break-word !important;
                      word-break: break-word !important;
                    }
                    .prose p {
                      margin-bottom: 1rem;
                      border: none !important;
                      outline: none !important;
                      max-width: 100% !important;
                      overflow-wrap: break-word !important;
                      word-wrap: break-word !important;
                      word-break: break-word !important;
                      overflow-x: hidden !important;
                      line-height: 1.8 !important;
                    }
                    .prose p:last-child {
                      margin-bottom: 0 !important;
                    }
                    .prose img {
                      max-width: 100% !important;
                      width: auto !important;
                      height: auto !important;
                      margin: 1rem 0;
                      border: none !important;
                      outline: none !important;
                      display: block;
                      object-fit: contain;
                    }
                    .prose strong {
                      font-weight: 700 !important;
                      color: #1f2937 !important;
                      border: none !important;
                      outline: none !important;
                      max-width: 100% !important;
                      overflow-wrap: break-word !important;
                      word-wrap: break-word !important;
                      word-break: break-word !important;
                      display: inline !important;
                      margin-right: 0.25rem !important;
                    }
                    .dark .prose strong {
                      color: #f9fafb !important;
                    }
                    .prose p strong {
                      font-weight: 700 !important;
                      display: inline !important;
                    }
                    .prose br {
                      border: none !important;
                      outline: none !important;
                      display: block !important;
                      content: "" !important;
                      margin-top: 0.5rem !important;
                    }
                    .prose span {
                      max-width: 100% !important;
                      overflow-wrap: break-word !important;
                      word-wrap: break-word !important;
                      word-break: break-word !important;
                      display: inline-block;
                    }
                    .translator-separator {
                      height: 2px;
                      background: linear-gradient(to right, transparent, #e5e7eb, transparent);
                      margin: 2rem 0;
                      border: none !important;
                      outline: none !important;
                      max-width: 100% !important;
                      overflow: hidden !important;
                    }
                    .dark .translator-separator {
                      background: linear-gradient(to right, transparent, #374151, transparent);
                    }
                    /* Remove any table borders if present */
                    .prose table {
                      width: 100% !important;
                      max-width: 100% !important;
                      table-layout: auto !important;
                      border-collapse: collapse !important;
                      overflow-x: auto !important;
                      display: block !important;
                    }
                    .prose table td,
                    .prose table th {
                      border: none !important;
                      outline: none !important;
                      max-width: 100% !important;
                      overflow-wrap: break-word !important;
                      word-wrap: break-word !important;
                      word-break: break-word !important;
                      padding: 0.5rem !important;
                    }
                    /* Remove any list borders */
                    .prose ul,
                    .prose ol {
                      border: none !important;
                      outline: none !important;
                      max-width: 100% !important;
                      overflow-x: hidden !important;
                    }
                    .prose li {
                      border: none !important;
                      outline: none !important;
                      max-width: 100% !important;
                      overflow-wrap: break-word !important;
                      word-wrap: break-word !important;
                      word-break: break-word !important;
                    }
                  `})]})})()]}),!e&&r.jsx("div",{className:"dark:text-white text-gray-800 leading-relaxed",children:r.jsx("div",{className:"prose prose-base dark:prose-invert max-w-none",children:r.jsx("p",{className:"text-gray-700 dark:text-gray-300 mb-6",children:"This section will be available soon. Please check back later."})})})]})})};export{T as default};
