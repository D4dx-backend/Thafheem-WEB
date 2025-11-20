import{d as p,a as b,r,u as y,z as h,j as e}from"./index-D2bCerlO.js";const v=()=>{const{id:n}=p(),u=b(),[d,l]=r.useState(!0),[o,m]=r.useState(null),[t,f]=r.useState(null),[x,c]=r.useState(!1),{translationLanguage:a}=y();r.useEffect(()=>{let s=!0;return(async()=>{try{l(!0),m(null);const i=await h(n);if(!s)return;f(i),setTimeout(()=>c(!0),50)}catch(i){if(!s)return;m(i.message||"Failed to load note"),setTimeout(()=>c(!0),50)}finally{s&&l(!1)}})(),()=>{s=!1}},[n]);const g=()=>typeof t=="string"?t:t&&typeof t=="object"?t.NoteText||t.html||t.content||t.text||JSON.stringify(t):"<p>No content</p>";return e.jsxs("div",{className:"min-h-screen bg-white dark:bg-[#2A2C38]",children:[e.jsx("style",{children:`
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
        `}),e.jsxs("div",{className:`max-w-4xl mx-auto p-6 transition-all duration-300 ${x?"animate-slide-in-up":"opacity-0"}`,children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsxs("h1",{className:"text-xl font-semibold bg-gradient-to-r from-[#2596be] to-[#62C3DC] bg-clip-text text-transparent",children:["Note ",n]}),e.jsx("button",{onClick:()=>u(-1),className:"group px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:border-[#2596be] dark:hover:border-[#62C3DC] hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 font-medium",children:"← Back"})]}),d&&e.jsx("div",{className:"flex items-center justify-center py-12 animate-fade-in",children:e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 border-4 border-[#2596be] border-t-transparent rounded-full animate-spin"}),e.jsx("p",{className:"text-gray-600 dark:text-gray-300 text-sm",children:"Loading note..."})]})}),o&&e.jsxs("div",{className:"p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 animate-fade-in",children:[e.jsx("p",{className:"font-medium",children:"Error loading note"}),e.jsx("p",{className:"text-sm mt-1",children:o})]}),!d&&!o&&e.jsx("div",{className:"prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-white bg-white dark:bg-[#1F2937] p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in",dangerouslySetInnerHTML:{__html:g()},style:{fontFamily:a==="hi"?"NotoSansDevanagari, sans-serif":a==="ur"?"JameelNoori, sans-serif":a==="bn"?"SutonnyMJ, sans-serif":a==="ta"?"Bamini, sans-serif":a==="mal"?"NotoSansMalayalam, sans-serif":"Poppins, sans-serif"}})]})]})};export{v as default};
