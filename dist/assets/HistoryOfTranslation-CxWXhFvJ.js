import{u as _,j as a,az as E}from"./index-D0NMIq43.js";import{b as g}from"./react-vendor-v5ei6ytj.js";const P=()=>{const{translationLanguage:v}=_(),p=v==="mal",[i,u]=g.useState(null),[c,b]=g.useState(!1),[d,m]=g.useState(null);return g.useEffect(()=>{if(!p){u(null),m(null);return}let s=!0;return(async()=>{try{b(!0),m(null);const l=await E();if(!s)return;u(l),l.error&&m("Unable to fetch content from the server.")}catch{s&&(m("Unable to load content. Please try again later."),u(null))}finally{s&&b(!1)}})(),()=>{s=!1}},[p]),a.jsx("div",{className:"min-h-screen bg-white dark:bg-gray-900 font-poppins",children:a.jsxs("div",{className:"max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8",children:[p&&a.jsxs(a.Fragment,{children:[c&&a.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam",children:"ഉള്ളടക്കം ലോഡുചെയ്യുന്നു..."}),!c&&d&&a.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:d}),!c&&!d&&(!i||!i.text)&&a.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam",children:"ഇപ്പോൾ ഉള്ളടക്കം ലഭ്യമല്ല."}),!c&&!d&&i&&i.text&&(()=>{const s=e=>{if(!e)return e;let r=e;return r=r.replace(/src\s*=\s*["']?(\/articles\/[^"'\s>]+)["']?/gi,(n,t)=>`src="${t}"`),r=r.replace(/src\s*=\s*["']?(articles\/[^"'\s>]+)["']?/gi,(n,t)=>t.startsWith("http://")||t.startsWith("https://")?n:`src="${`/${t}`}"`),r=r.replace(/src\s*=\s*["']?(\/[^"'\s>]+\.(png|jpg|jpeg|gif|webp|svg))["']?/gi,(n,t)=>t.startsWith("http://")||t.startsWith("https://")||t.startsWith("data:")?n:`src="${t}"`),r},x=e=>{if(!e)return e;const r=[];let n=0,t=e.replace(/<img\s+[^>]*(?:\/>|>)/gi,o=>{const j=`__IMG_PLACEHOLDER_${n}__`;return r.push(o),n++,j});t=t.replace(/\s*style=["'][^"']*border[^"']*["']/gi,""),t=t.replace(/\s*style=["'][^"']*outline[^"']*["']/gi,""),t=t.replace(/\s*border=["'][^"']*["']/gi,""),t=t.replace(/\s*border=\d+/gi,"");for(let o=r.length-1;o>=0;o--)t=t.replace(`__IMG_PLACEHOLDER_${o}__`,r[o]);return t},l=e=>e?typeof e!="string"?String(e):e:"",h=e=>{if(!e||typeof e!="string")return e;if(e.includes("&lt;")||e.includes("&gt;")||e.includes("&amp;")||e.includes("&quot;")){const r=document.createElement("textarea");r.innerHTML=e;const n=r.value;return n===e||n.includes("&lt;")?e.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&#x27;/g,"'"):n}return e},y=h(l(i.title)),k=h(l(i.text)),f=y?x(s(y)):null,w=x(s(k));return a.jsxs("div",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7",children:[f&&a.jsx("div",{className:"mb-4 prose prose-lg dark:prose-invert max-w-none font-malayalam",dangerouslySetInnerHTML:{__html:f}}),a.jsx("div",{className:"prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 font-malayalam",dangerouslySetInnerHTML:{__html:w},style:{lineHeight:1.8,textAlign:"justify"}}),a.jsx("style",{children:`
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
                      max-width: 100% !important;
                      width: auto !important;
                      height: auto !important;
                      margin: 1rem auto !important;
                      padding: 0.75rem !important;
                      border: none !important;
                      outline: none !important;
                      display: block !important;
                      object-fit: contain !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    /* Ensure images in paragraphs with thafheem class are displayed */
                    .prose p.thafheem img,
                    p.thafheem img,
                    .prose p.thafheem img[src*="/articles/"],
                    p.thafheem img[src*="/articles/"] {
                      max-width: 100% !important;
                      width: auto !important;
                      height: auto !important;
                      margin: 1rem auto !important;
                      padding: 0.75rem !important;
                      border: none !important;
                      outline: none !important;
                      display: block !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    /* Ensure all images with /articles/ paths are visible */
                    .prose img[src*="/articles/"],
                    img[src*="/articles/"] {
                      display: block !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    /* Handle broken images gracefully */
                    .prose img[src=""],
                    .prose img:not([src]) {
                      display: none !important;
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
                  `})]})})()]}),!p&&a.jsx("div",{className:"dark:text-white text-gray-800 leading-relaxed",children:a.jsx("div",{className:"prose prose-base dark:prose-invert max-w-none",children:a.jsx("p",{className:"text-gray-700 dark:text-gray-300 mb-6",children:"This section will be available soon. Please check back later."})})})]})})};export{P as default};
