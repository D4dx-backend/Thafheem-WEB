import{u as H,j as n,ay as L}from"./index-D0NMIq43.js";import{b as k}from"./react-vendor-v5ei6ytj.js";const C=()=>{const{translationLanguage:$}=H(),b=$==="mal",[d,v]=k.useState(null),[u,_]=k.useState(!1),[f,h]=k.useState(null);return k.useEffect(()=>{if(!b){v(null),h(null);return}let c=!0;return(async()=>{try{_(!0),h(null);const w=await L();if(!c)return;v(w),w.error&&h("Unable to fetch content from the server.")}catch{c&&(h("Unable to load content. Please try again later."),v(null))}finally{c&&_(!1)}})(),()=>{c=!1}},[b]),n.jsx("div",{className:"min-h-screen bg-white dark:bg-gray-900 font-poppins overflow-x-hidden",children:n.jsxs("div",{className:"max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8 overflow-x-hidden",children:[b&&n.jsxs(n.Fragment,{children:[u&&n.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam",children:"ഉള്ളടക്കം ലോഡുചെയ്യുന്നു..."}),!u&&f&&n.jsx("div",{className:"mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",children:f}),!u&&!f&&(!d||!d.text)&&n.jsx("div",{className:"py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam",children:"ഇപ്പോൾ ഉള്ളടക്കം ലഭ്യമല്ല."}),!u&&!f&&d&&d.text&&(()=>{const c={"tk.png":"ടി.കെ. ഉബൈദ്","tka.png":"ടി.കെ. അബ്ദുള്ള","ti.png":"ടി. ഇസ്ഹാഖ്","vk.png":"വി.കെ. അലി"},j=s=>{if(!s)return s;const t="https://thafheem.net";let o=s;return o=o.replace(/src=["'](\/articles\/[^"']+)["']/gi,(a,r)=>{if(r.startsWith("http://")||r.startsWith("https://"))return a;const l=a.includes("'")?"'":'"';return`src=${l}${r}${l}`}),o=o.replace(/src=["'](articles\/[^"']+)["']/gi,(a,r)=>{if(r.startsWith("http://")||r.startsWith("https://"))return a;const l=a.includes("'")?"'":'"';return`src=${l}/${r}${l}`}),o=o.replace(/src=["']([^"']*\.(png|jpg|jpeg|gif|webp|svg))["']/gi,(a,r)=>(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("data:")||r.startsWith("/")||r.startsWith(t),a)),o},w=s=>{if(!s)return s;let t=s;const o=[];let a=0;t=t.replace(/<img[^>]*>/gi,i=>{const p=`__IMG_PLACEHOLDER_${a}__`;return o.push(i),a++,p});const r=(t.match(/<p[^>]*>/gi)||[]).length,l=(t.match(/<\/p>/gi)||[]).length;if(l>r){const i=l-r;let p=0;t=t.replace(/<\/p>/gi,e=>p<i?(p++,""):e)}t.trim().startsWith("<")||(t="<p>"+t),!t.trim().endsWith("</p>")&&!t.trim().endsWith(">")&&(t=t+"</p>"),t=t.replace(/^[\s\n]*<\/p>[\s\n]*/gi,""),t=t.replace(/<\/p>[\s\n]*(?=[^<])/gi,"</p><p>"),t=t.replace(/<div[^>]*>([^<]*?)(?!<img)([^<]+)<\/div>/gi,"<p>$1$2</p>");const m=t.split("</p>");t=m.map((i,p)=>{const e=i.trim();if(!e)return"";const g=e.includes("__IMG_PLACEHOLDER_");return e.startsWith("<")?!e.match(/^<p[^>]*>/i)&&!e.match(/^<div[^>]*>/i)&&!e.match(/^<strong[^>]*>/i)&&!e.match(/^<br[^>]*>/i)&&!g?g?e+(p<m.length-1?"</p>":""):"<p>"+e+(p<m.length-1?"</p>":""):e+(p<m.length-1?"</p>":""):"<p>"+e+(p<m.length-1?"</p>":"")}).join(""),t=t.replace(/<p[^>]*>[\s\n]*<\/p>/gi,""),t=t.replace(/<div[^>]*>[\s\n]*<\/div>/gi,"");for(let i=o.length-1;i>=0;i--)t=t.replace(`__IMG_PLACEHOLDER_${i}__`,o[i]);return t},E=s=>{if(!s)return s;let t=s;return t=w(t),Object.keys(c).forEach(o=>{const a=c[o],r=o.replace(".","\\."),l=new RegExp(`(<img([^>]*?)src=["']([^"']*?)${r}([^"']*?)["']([^>]*?)>)`,"gi"),m=[];let x;const i=t;for(;(x=l.exec(i))!==null;)m.push({fullMatch:x[0],index:x.index});for(let p=m.length-1;p>=0;p--){const{fullMatch:e,index:g}=m[p],y=i.substring(Math.max(0,g-300),g);if(y.includes("translator-name-wrapper")&&y.includes(a)){const I=y.lastIndexOf("translator-name-wrapper"),P=y.lastIndexOf("</div>");if(I>P)continue}const N=`<div class="translator-name-wrapper"><div class="translator-name">${a}</div>${e}</div>`;t=t.substring(0,g)+N+t.substring(g+e.length)}}),t=t.replace(/\s*style=["'][^"']*border[^"']*["']/gi,""),t=t.replace(/\s*style=["'][^"']*outline[^"']*["']/gi,""),t=t.replace(/\s*border=["'][^"']*["']/gi,""),t=t.replace(/\s*border=\d+/gi,""),t=t.replace(/\s*style=["'][^"']*text-align[^"']*["']/gi,""),t=t.replace(/@\s*/g,'<div class="translator-separator"></div>'),t=t.replace(/<p[^>]*>[\s\n]*<\/p>/gi,""),t=t.replace(/(<\/p>)\s*(<p[^>]*>)/gi,"$1$2"),t=t.replace(/\n{3,}/g,`

`),t=t.replace(/(<\/p>)\s*\n\s*\n\s*(<p[^>]*>)/gi,"$1$2"),t=t.replace(/<p[^>]*>([\s\n]*)<\/p>/gi,""),t.trim()&&!t.trim().startsWith("<div")&&(t='<div class="translator-content-block">'+t+"</div>"),t},W=d.title?j(E(d.title)):null,M=j(E(d.text));return n.jsxs(n.Fragment,{children:[W&&n.jsx("div",{className:"mb-4 prose prose-xl dark:prose-invert max-w-none font-malayalam overflow-hidden text-right py-4",style:{fontSize:"1.75rem",lineHeight:"2.5rem"},dangerouslySetInnerHTML:{__html:W}}),n.jsxs("div",{className:"bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7 overflow-hidden",children:[n.jsx("div",{className:"prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 font-malayalam overflow-hidden translator-content-wrapper",dangerouslySetInnerHTML:{__html:M},style:{lineHeight:1.8,textAlign:"justify",textJustify:"inter-word",overflowWrap:"break-word",wordWrap:"break-word",wordBreak:"break-word",overflowX:"hidden",width:"100%"}}),n.jsx("style",{children:`
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
                    /* Translator name wrapper and name styling */
                    .translator-name-wrapper {
                      margin: 2rem 0 1rem 0 !important;
                      display: block !important;
                      width: 100% !important;
                    }
                    .translator-name {
                      font-size: 1.25rem !important;
                      font-weight: 700 !important;
                      color: #1f2937 !important;
                      margin-bottom: 1rem !important;
                      text-align: left !important;
                      font-family: 'Noto Sans Malayalam', sans-serif !important;
                      line-height: 1.5 !important;
                      padding: 0.5rem 0 !important;
                    }
                    .dark .translator-name {
                      color: #f9fafb !important;
                    }
                    .translator-name-wrapper img {
                      margin-top: 0 !important;
                      margin-bottom: 1rem !important;
                    }
                  `})]})]})})()]}),!b&&n.jsx("div",{className:"dark:text-white text-gray-800 leading-relaxed",children:n.jsx("div",{className:"prose prose-base dark:prose-invert max-w-none",children:n.jsx("p",{className:"text-gray-700 dark:text-gray-300 mb-6",children:"This section will be available soon. Please check back later."})})})]})})};export{C as default};
