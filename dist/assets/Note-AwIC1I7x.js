import{u as p,z as g,j as e}from"./index-D0NMIq43.js";import{d as y,b as s}from"./react-vendor-v5ei6ytj.js";const N=()=>{const{id:n}=y(),[d,l]=s.useState(!0),[i,m]=s.useState(null),[t,f]=s.useState(null),[u,c]=s.useState(!1),{translationLanguage:a}=p();s.useEffect(()=>{let r=!0;return(async()=>{try{l(!0),m(null);const o=await g(n);if(!r)return;f(o),setTimeout(()=>c(!0),50)}catch(o){if(!r)return;m(o.message||"Failed to load note"),setTimeout(()=>c(!0),50)}finally{r&&l(!1)}})(),()=>{r=!1}},[n]);const x=()=>typeof t=="string"?t:t&&typeof t=="object"?t.NoteText||t.html||t.content||t.text||JSON.stringify(t):"<p>No content</p>";return e.jsxs("div",{className:"min-h-screen bg-white dark:bg-[#2A2C38]",children:[e.jsx("style",{children:`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-slide-in-up {
            animation: slideInUp 0.4s ease-out forwards;
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}),e.jsxs("div",{className:`max-w-4xl mx-auto p-6 transition-all duration-300 ${u?"animate-slide-in-up":"opacity-0"}`,children:[e.jsx("div",{className:"mb-6",children:e.jsxs("h1",{className:"text-xl font-semibold bg-gradient-to-r from-[#2596be] to-[#62C3DC] bg-clip-text text-transparent",children:["Note ",n]})}),d&&e.jsx("div",{className:"flex items-center justify-center py-12 animate-fade-in",children:e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 border-4 border-[#2596be] border-t-transparent rounded-full animate-spin"}),e.jsx("p",{className:"text-gray-600 dark:text-gray-300 text-sm",children:"Loading note..."})]})}),i&&e.jsxs("div",{className:"p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 animate-fade-in",children:[e.jsx("p",{className:"font-medium",children:"Error loading note"}),e.jsx("p",{className:"text-sm mt-1",children:i})]}),!d&&!i&&e.jsx("div",{className:"prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-white bg-white dark:bg-[#1F2937] p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in",dangerouslySetInnerHTML:{__html:x()},style:{fontFamily:a==="hi"?"NotoSansDevanagari, sans-serif":a==="ur"?"JameelNoori, sans-serif":a==="bn"?"SutonnyMJ, sans-serif":a==="ta"?"Bamini, sans-serif":a==="mal"?"Noto Sans Malayalam, sans-serif":"Poppins, sans-serif"}})]})]})};export{N as default};
