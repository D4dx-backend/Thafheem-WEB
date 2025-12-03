import{u as k,j as e,aq as v}from"./index-C60dBqWj.js";import{u as j,b as c}from"./react-vendor-v5ei6ytj.js";const T=()=>{const g=j(),{translationLanguage:y}=k(),r=y==="mal",[a,m]=c.useState(null),[l,u]=c.useState(!1),[i,d]=c.useState(null);c.useEffect(()=>{if(!r){m(null),d(null);return}let n=!0;return(async()=>{try{u(!0),d(null);const o=await v();if(!n)return;m(o),o.error&&d("Unable to fetch content from the server.")}catch{n&&(d("Unable to load content. Please try again later."),m(null))}finally{n&&u(!1)}})(),()=>{n=!1}},[r]);const b=()=>{window.history.state&&window.history.state.idx>0?g(-1):g("/")};return e.jsx("div",{className:"min-h-screen bg-white dark:bg-gray-900 font-poppins",children:e.jsxs("div",{className:"max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8",children:[e.jsx("button",{onClick:b,className:"text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4",children:"← Back"}),e.jsxs("div",{className:"mb-6",children:[e.jsx("h1",{className:`text-3xl font-bold text-gray-900 mb-2 dark:text-white ${r?"font-malayalam":""}`,children:r?"വിവർത്തന ചരിത്രം":"History of Translation"}),e.jsx("p",{className:"text-gray-600 dark:text-gray-300",children:r?"തഫ്ഹീമിന്റെ മലയാളം സ്രോതസുകളില്‍നിന്നുള്ള ഉള്ളടക്കം.":"History of the Malayalam translation of Thafheem."}),e.jsx("div",{className:"mt-4 h-px bg-gray-200 dark:bg-gray-700"})]}),r&&e.jsxs(e.Fragment,{children:[l&&e.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam",children:"ഉള്ളടക്കം ലോഡുചെയ്യുന്നു..."}),!l&&i&&e.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:i}),!l&&!i&&(!a||!a.text)&&e.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam",children:"ഇപ്പോൾ ഉള്ളടക്കം ലഭ്യമല്ല."}),!l&&!i&&a&&a.text&&(()=>{const n=s=>{if(!s)return s;const t="https://thafheem.net";return s.replace(/src=["'](\/articles\/[^"']+)["']/g,(f,x)=>x.startsWith("http://")||x.startsWith("https://")?f:`src="${t}${x}"`)},p=s=>{if(!s)return s;let t=s;return t=t.replace(/\s*style=["'][^"']*border[^"']*["']/gi,""),t=t.replace(/\s*style=["'][^"']*outline[^"']*["']/gi,""),t=t.replace(/\s*border=["'][^"']*["']/gi,""),t=t.replace(/\s*border=\d+/gi,""),t},o=a.title?n(p(a.title)):null,h=n(p(a.text));return e.jsxs("div",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7",children:[o&&e.jsx("div",{className:"mb-4 prose prose-lg dark:prose-invert max-w-none font-malayalam",dangerouslySetInnerHTML:{__html:o}}),e.jsx("div",{className:"prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 font-malayalam",dangerouslySetInnerHTML:{__html:h},style:{lineHeight:1.8,textAlign:"justify"}}),e.jsx("style",{children:`
                    .prose * {
                      border: none !important;
                      outline: none !important;
                      box-shadow: none !important;
                    }
                    .prose p {
                      margin-bottom: 1rem;
                      border: none !important;
                      outline: none !important;
                    }
                    .prose img {
                      max-width: 100%;
                      height: auto;
                      margin: 1rem 0;
                      border: none !important;
                      outline: none !important;
                      display: block;
                    }
                    .prose strong {
                      font-weight: 600;
                      border: none !important;
                      outline: none !important;
                    }
                    .prose br {
                      border: none !important;
                      outline: none !important;
                    }
                    .prose a {
                      color: #0891b2;
                      text-decoration: none;
                    }
                    .prose a:hover {
                      text-decoration: underline;
                    }
                    .prose span.m1 {
                      display: block;
                      margin-top: 2rem;
                      text-align: right;
                      font-style: italic;
                    }
                    /* Remove any table borders if present */
                    .prose table,
                    .prose table td,
                    .prose table th {
                      border: none !important;
                      outline: none !important;
                    }
                    /* Remove any list borders */
                    .prose ul,
                    .prose ol,
                    .prose li {
                      border: none !important;
                      outline: none !important;
                    }
                  `})]})})()]}),!r&&e.jsx("div",{className:"dark:text-white text-gray-800 leading-relaxed",children:e.jsx("div",{className:"prose prose-base dark:prose-invert max-w-none",children:e.jsx("p",{className:"text-gray-700 dark:text-gray-300 mb-6",children:"This section will be available soon. Please check back later."})})})]})})};export{T as default};
