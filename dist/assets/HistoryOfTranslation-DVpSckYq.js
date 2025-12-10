import{i as E,j as r,ay as H}from"./index-D80Klju5.js";import{u as P,b as g}from"./react-vendor-v5ei6ytj.js";const C=()=>{const b=P(),{translationLanguage:k}=E(),c=k==="mal",[i,u]=g.useState(null),[p,h]=g.useState(!1),[d,m]=g.useState(null);g.useEffect(()=>{if(!c){u(null),m(null);return}let o=!0;return(async()=>{try{h(!0),m(null);const l=await H();if(!o)return;u(l),l.error&&m("Unable to fetch content from the server.")}catch{o&&(m("Unable to load content. Please try again later."),u(null))}finally{o&&h(!1)}})(),()=>{o=!1}},[c]);const w=()=>{window.history.state&&window.history.state.idx>0?b(-1):b("/")};return r.jsx("div",{className:"min-h-screen bg-white dark:bg-gray-900 font-poppins",children:r.jsxs("div",{className:"max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8",children:[r.jsx("button",{onClick:w,className:"text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4",children:"← Back"}),c&&r.jsxs(r.Fragment,{children:[p&&r.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam",children:"ഉള്ളടക്കം ലോഡുചെയ്യുന്നു..."}),!p&&d&&r.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:d}),!p&&!d&&(!i||!i.text)&&r.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam",children:"ഇപ്പോൾ ഉള്ളടക്കം ലഭ്യമല്ല."}),!p&&!d&&i&&i.text&&(()=>{const o=e=>{if(!e)return e;let a=e;return a=a.replace(/src\s*=\s*["']?(\/articles\/[^"'\s>]+)["']?/gi,(n,t)=>`src="${t}"`),a=a.replace(/src\s*=\s*["']?(articles\/[^"'\s>]+)["']?/gi,(n,t)=>t.startsWith("http://")||t.startsWith("https://")?n:`src="${`/${t}`}"`),a=a.replace(/src\s*=\s*["']?(\/[^"'\s>]+\.(png|jpg|jpeg|gif|webp|svg))["']?/gi,(n,t)=>t.startsWith("http://")||t.startsWith("https://")||t.startsWith("data:")?n:`src="${t}"`),a},x=e=>{if(!e)return e;const a=[];let n=0,t=e.replace(/<img\s+[^>]*(?:\/>|>)/gi,s=>{const N=`__IMG_PLACEHOLDER_${n}__`;return a.push(s),n++,N});t=t.replace(/\s*style=["'][^"']*border[^"']*["']/gi,""),t=t.replace(/\s*style=["'][^"']*outline[^"']*["']/gi,""),t=t.replace(/\s*border=["'][^"']*["']/gi,""),t=t.replace(/\s*border=\d+/gi,"");for(let s=a.length-1;s>=0;s--)t=t.replace(`__IMG_PLACEHOLDER_${s}__`,a[s]);return t},l=e=>e?typeof e!="string"?String(e):e:"",y=e=>{if(!e||typeof e!="string")return e;if(e.includes("&lt;")||e.includes("&gt;")||e.includes("&amp;")||e.includes("&quot;")){const a=document.createElement("textarea");a.innerHTML=e;const n=a.value;return n===e||n.includes("&lt;")?e.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&#x27;/g,"'"):n}return e},f=y(l(i.title)),j=y(l(i.text)),v=f?x(o(f)):null,_=x(o(j));return r.jsxs("div",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7",children:[v&&r.jsx("div",{className:"mb-4 prose prose-lg dark:prose-invert max-w-none font-malayalam",dangerouslySetInnerHTML:{__html:v}}),r.jsx("div",{className:"prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 font-malayalam",dangerouslySetInnerHTML:{__html:_},style:{lineHeight:1.8,textAlign:"justify"}}),r.jsx("style",{children:`
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
                  `})]})})()]}),!c&&r.jsx("div",{className:"dark:text-white text-gray-800 leading-relaxed",children:r.jsx("div",{className:"prose prose-base dark:prose-invert max-w-none",children:r.jsx("p",{className:"text-gray-700 dark:text-gray-300 mb-6",children:"This section will be available soon. Please check back later."})})})]})})};export{C as default};
