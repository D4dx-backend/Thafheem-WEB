import{i as N,j as a,ax as P}from"./index-D80Klju5.js";import{u as L,b as f}from"./react-vendor-v5ei6ytj.js";const I=()=>{const y=L(),{translationLanguage:E}=N(),w=E==="mal",[m,x]=f.useState(null),[b,k]=f.useState(!1),[u,h]=f.useState(null);f.useEffect(()=>{if(!w){x(null),h(null);return}let d=!0;return(async()=>{try{k(!0),h(null);const c=await P();if(!d)return;x(c),c.error&&h("Unable to fetch content from the server.")}catch{d&&(h("Unable to load content. Please try again later."),x(null))}finally{d&&k(!1)}})(),()=>{d=!1}},[w]);const W=()=>{window.history.state&&window.history.state.idx>0?y(-1):y("/")};return a.jsx("div",{className:"min-h-screen bg-white dark:bg-gray-900 font-poppins overflow-x-hidden",children:a.jsxs("div",{className:"max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8 overflow-x-hidden",children:[a.jsx("button",{onClick:W,className:"text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4",children:"← Back"}),w&&a.jsxs(a.Fragment,{children:[b&&a.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam",children:"ഉള്ളടക്കം ലോഡുചെയ്യുന്നു..."}),!b&&u&&a.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:u}),!b&&!u&&(!m||!m.text)&&a.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam",children:"ഇപ്പോൾ ഉള്ളടക്കം ലഭ്യമല്ല."}),!b&&!u&&m&&m.text&&(()=>{const d=o=>{if(!o)return o;const t="https://thafheem.net";let i=o;return i=i.replace(/src=["'](\/articles\/[^"']+)["']/gi,(e,r)=>{if(r.startsWith("http://")||r.startsWith("https://"))return e;const l=e.includes("'")?"'":'"';return`src=${l}${r}${l}`}),i=i.replace(/src=["'](articles\/[^"']+)["']/gi,(e,r)=>{if(r.startsWith("http://")||r.startsWith("https://"))return e;const l=e.includes("'")?"'":'"';return`src=${l}/${r}${l}`}),i=i.replace(/src=["']([^"']*\.(png|jpg|jpeg|gif|webp|svg))["']/gi,(e,r)=>(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("data:")||r.startsWith("/")||r.startsWith(t),e)),i},v=o=>{if(!o)return o;let t=o;const i=[];let e=0;t=t.replace(/<img[^>]*>/gi,p=>{const s=`__IMG_PLACEHOLDER_${e}__`;return i.push(p),e++,s});const r=(t.match(/<p[^>]*>/gi)||[]).length,l=(t.match(/<\/p>/gi)||[]).length;if(l>r){const p=l-r;let s=0;t=t.replace(/<\/p>/gi,n=>s<p?(s++,""):n)}t.trim().startsWith("<")||(t="<p>"+t),!t.trim().endsWith("</p>")&&!t.trim().endsWith(">")&&(t=t+"</p>"),t=t.replace(/^[\s\n]*<\/p>[\s\n]*/gi,""),t=t.replace(/<\/p>[\s\n]*(?=[^<])/gi,"</p><p>"),t=t.replace(/<div[^>]*>([^<]*?)(?!<img)([^<]+)<\/div>/gi,"<p>$1$2</p>");const g=t.split("</p>");t=g.map((p,s)=>{const n=p.trim();if(!n)return"";const _=n.includes("__IMG_PLACEHOLDER_");return n.startsWith("<")?!n.match(/^<p[^>]*>/i)&&!n.match(/^<div[^>]*>/i)&&!n.match(/^<strong[^>]*>/i)&&!n.match(/^<br[^>]*>/i)&&!_?_?n+(s<g.length-1?"</p>":""):"<p>"+n+(s<g.length-1?"</p>":""):n+(s<g.length-1?"</p>":""):"<p>"+n+(s<g.length-1?"</p>":"")}).join(""),t=t.replace(/<p[^>]*>[\s\n]*<\/p>/gi,""),t=t.replace(/<div[^>]*>[\s\n]*<\/div>/gi,"");for(let p=i.length-1;p>=0;p--)t=t.replace(`__IMG_PLACEHOLDER_${p}__`,i[p]);return t},c=o=>{if(!o)return o;let t=o;return t=v(t),t=t.replace(/\s*style=["'][^"']*border[^"']*["']/gi,""),t=t.replace(/\s*style=["'][^"']*outline[^"']*["']/gi,""),t=t.replace(/\s*border=["'][^"']*["']/gi,""),t=t.replace(/\s*border=\d+/gi,""),t=t.replace(/\s*style=["'][^"']*text-align[^"']*["']/gi,""),t=t.replace(/@\s*/g,'<div class="translator-separator"></div>'),t=t.replace(/<p[^>]*>[\s\n]*<\/p>/gi,""),t=t.replace(/(<\/p>)\s*(<p[^>]*>)/gi,"$1$2"),t=t.replace(/\n{3,}/g,`

`),t=t.replace(/(<\/p>)\s*\n\s*\n\s*(<p[^>]*>)/gi,"$1$2"),t=t.replace(/<p[^>]*>([\s\n]*)<\/p>/gi,""),t.trim()&&!t.trim().startsWith("<div")&&(t='<div class="translator-content-block">'+t+"</div>"),t},j=m.title?d(c(m.title)):null,$=d(c(m.text));return a.jsxs("div",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7 overflow-hidden",children:[j&&a.jsx("div",{className:"mb-4 prose prose-lg dark:prose-invert max-w-none font-malayalam overflow-hidden",dangerouslySetInnerHTML:{__html:j}}),a.jsx("div",{className:"prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 font-malayalam overflow-hidden translator-content-wrapper",dangerouslySetInnerHTML:{__html:$},style:{lineHeight:1.8,textAlign:"justify",textJustify:"inter-word",overflowWrap:"break-word",wordWrap:"break-word",wordBreak:"break-word",overflowX:"hidden",width:"100%"}}),a.jsx("style",{children:`
                    .prose {
                      overflow-x: hidden !important;
                      word-wrap: break-word !important;
                      overflow-wrap: break-word !important;
                      word-break: break-word !important;
                      max-width: 100% !important;
                      text-align: justify !important;
                      text-justify: inter-word !important;
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
                    /* Ensure all text elements are justified */
                    .prose div,
                    .prose span,
                    .prose p {
                      text-align: justify !important;
                      text-justify: inter-word !important;
                    }
                    .prose p {
                      margin-bottom: 0.75rem;
                      margin-top: 0;
                      border: none !important;
                      outline: none !important;
                      max-width: 100% !important;
                      overflow-wrap: break-word !important;
                      word-wrap: break-word !important;
                      word-break: break-word !important;
                      overflow-x: hidden !important;
                      line-height: 1.8 !important;
                      text-align: justify !important;
                      text-justify: inter-word !important;
                    }
                    .prose p:last-child {
                      margin-bottom: 0 !important;
                    }
                    /* Ensure translator content flows as single block */
                    .translator-content-wrapper {
                      display: block;
                      width: 100%;
                      text-align: justify !important;
                      text-justify: inter-word !important;
                    }
                    .translator-content-block {
                      display: block;
                      width: 100%;
                      text-align: justify !important;
                      text-justify: inter-word !important;
                    }
                    .translator-content-block p {
                      margin-bottom: 0.75rem !important;
                      margin-top: 0 !important;
                      text-align: justify !important;
                      text-justify: inter-word !important;
                    }
                    /* Remove large gaps between paragraphs in translator block */
                    .translator-content-block p + p {
                      margin-top: 0 !important;
                    }
                    /* Ensure empty paragraphs don't create spacing */
                    .translator-content-block p:empty {
                      display: none !important;
                      margin: 0 !important;
                      padding: 0 !important;
                    }
                    /* Remove excessive spacing in the wrapper */
                    .translator-content-wrapper p {
                      margin-bottom: 0.75rem !important;
                      margin-top: 0 !important;
                      text-align: justify !important;
                      text-justify: inter-word !important;
                    }
                    .translator-content-wrapper p:empty {
                      display: none !important;
                      margin: 0 !important;
                      padding: 0 !important;
                      height: 0 !important;
                    }
                    /* Ensure all divs and spans are also justified */
                    .translator-content-wrapper div,
                    .translator-content-block div {
                      text-align: justify !important;
                    }
                    .translator-content-wrapper span,
                    .translator-content-block span {
                      text-align: justify !important;
                    }
                    .prose img {
                      max-width: 100% !important;
                      width: auto !important;
                      height: auto !important;
                      margin: 1rem auto;
                      padding: 0.75rem;
                      border: none !important;
                      outline: none !important;
                      display: block;
                      object-fit: contain;
                    }
                    .translator-content-wrapper img,
                    .translator-content-block img {
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
                    /* Ensure images in paragraphs are properly displayed */
                    .translator-content-wrapper p img,
                    .translator-content-block p img {
                      display: block !important;
                      margin: 1rem auto !important;
                      padding: 0.75rem !important;
                    }
                    /* Handle broken images gracefully */
                    .prose img[src=""],
                    .prose img:not([src]),
                    .translator-content-wrapper img[src=""],
                    .translator-content-wrapper img:not([src]) {
                      display: none !important;
                    }
                    /* Center images - images are block level so they'll be centered by margin: auto */
                    .translator-content-wrapper img,
                    .translator-content-block img {
                      margin-left: auto !important;
                      margin-right: auto !important;
                      padding: 0.75rem !important;
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
                    /* Ensure all text content is visible and properly aligned */
                    .translator-content-wrapper p {
                      display: block !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    .translator-content-wrapper div:not(.translator-separator) {
                      display: block !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    .translator-content-wrapper strong,
                    .translator-content-wrapper span {
                      display: inline !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    /* Ensure proper width and alignment for all content */
                    .translator-content-block * {
                      max-width: 100% !important;
                      box-sizing: border-box !important;
                    }
                    .translator-content-block p {
                      display: block !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                  `})]})})()]}),!w&&a.jsx("div",{className:"dark:text-white text-gray-800 leading-relaxed",children:a.jsx("div",{className:"prose prose-base dark:prose-invert max-w-none",children:a.jsx("p",{className:"text-gray-700 dark:text-gray-300 mb-6",children:"This section will be available soon. Please check back later."})})})]})})};export{I as default};
