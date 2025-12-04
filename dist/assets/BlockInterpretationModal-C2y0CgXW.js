import{u as re,t as ae,j as y,N as oe,r as se,af as R,J as V,I as Ft,w as jt,y as ie}from"./index-DmadXW_T.js";import{b as f,c as ce}from"./react-vendor-v5ei6ytj.js";import{W as le,A as de}from"./WordByWord-Br-NRyM5.js";import{I as pe}from"./InterpretationNavbar-BJwNmLm3.js";import Mt from"./hindiTranslationService-BCljsrBM.js";import Tt from"./urduTranslationService-BM_bPhej.js";import ht from"./englishTranslationService-Cw_-4qKN.js";const xe=({surahId:H,range:L,interpretationNo:q=1,language:Y="en",footnoteId:rt=null,interpretationId:at=null,onClose:Pt,blockRanges:J=[]})=>{const{user:Rt}=re?.()||{user:null},[mt,gt]=f.useState(!0),[ot,st]=f.useState(null),[W,z]=f.useState([]),[yt,It]=f.useState(""),[it,xt]=f.useState(!1),[vt,K]=f.useState({id:"",content:null}),[ct,M]=f.useState(!1),[G,P]=f.useState({surahId:null,verseId:null}),bt=f.useRef([]),[Dt,Nt]=f.useState(!1),[_t,Vt]=f.useState([]),[C,kt]=f.useState([]),[u,wt]=f.useState(H),[d,j]=f.useState(L),[h,w]=f.useState(q),[c,Wt]=f.useState(Y),[k,Q]=f.useState(rt),[O,zt]=f.useState(at),[E,lt]=f.useState([]),[dt,Ot]=f.useState(!1),St=f.useRef(!1),T=f.useCallback(n=>{if(n==null)return null;const t=String(n).trim();if(!t)return null;if(/^\d+$/.test(t)){const r=parseInt(t,10);return Number.isFinite(r)?{start:r,end:r,label:t}:null}const e=t.match(/^(\d+)\s*-\s*(\d+)$/);if(e){const r=parseInt(e[1],10),i=parseInt(e[2],10);if(Number.isFinite(r)&&Number.isFinite(i))return{start:r,end:i,label:r===i?`${r}`:`${r}-${i}`}}return null},[]),B=f.useMemo(()=>{if(!Array.isArray(J)||J.length===0)return[];const n=t=>{if(typeof t=="string"||typeof t=="number")return T(t);if(t&&typeof t=="object"){const e=t.AyaFrom??t.ayafrom??t.from??t.start??t.begin??t.AyaFromId,r=t.AyaTo??t.ayato??t.to??t.end??t.finish??t.AyaToId??e;if(e==null&&typeof t.Range=="string")return T(t.Range);if(e==null&&typeof t.range=="string")return T(t.range);const i=Number.parseInt(e,10),a=Number.parseInt(r,10);if(Number.isFinite(i)&&Number.isFinite(a))return{start:i,end:a,label:i===a?`${i}`:`${i}-${a}`}}return null};return J.map(t=>n(t)).filter(Boolean).sort((t,e)=>t.start-e.start).map((t,e)=>({...t,index:e}))},[J,T]),D=f.useCallback(async(n,t)=>{try{const[e,r]=t.includes("-")?t.split("-").map(a=>parseInt(a.trim(),10)):[parseInt(t,10),parseInt(t,10)],i=[];for(let a=e;a<=r;a++)try{const o=await ht.getAyahTranslation(n,a);if(o){const p=/<sup[^>]*foot_note="([^"]+)"[^>]*>(\d+)<\/sup>/g;let l;for(;(l=p.exec(o))!==null;){const s=l[1],m=parseInt(l[2],10);i.push({footnoteId:s,footnoteNumber:m,ayah:a})}}}catch(o){console.warn(`[BlockInterpretationModal] Failed to fetch translation for ayah ${a}:`,o)}return i.sort((a,o)=>a.ayah!==o.ayah?a.ayah-o.ayah:a.footnoteNumber-o.footnoteNumber),i}catch(e){return console.error("[BlockInterpretationModal] ❌ Error extracting footnotes from range:",e),[]}},[]),$t=f.useCallback(async n=>{if(!B.length||!d)return!1;const t=T(d);if(!t)return!1;const e=B.findIndex(i=>i.label===t.label||i.start===t.start&&i.end===t.end);if(e===-1)return!1;let r=e+n;for(;r>=0&&r<B.length;){const i=B[r];try{const a=await D(u,i.label);if(Array.isArray(a)&&a.length>0){const o=n>0?a[0]:a[a.length-1];return j(i.label),Q(o.footnoteId),w(o.footnoteNumber),lt(a),!0}}catch(a){console.warn(`[BlockInterpretationModal] Failed to load footnotes for block ${i.label}:`,a)}r+=n}return!1},[B,d,u,D,T]);f.useEffect(()=>(document.body.style.overflow="hidden",()=>{document.body.style.overflow=""}),[]),f.useEffect(()=>{wt(H),j(L),w(q),Wt(Y),Q(rt)},[H,L,q,Y,rt]),f.useEffect(()=>{zt(at)},[H,L,q,Y,at]);const pt=n=>{n&&(n.preventDefault(),n.stopPropagation()),!St.current&&(St.current=!0,Ot(!0),setTimeout(()=>{Pt()},200))};f.useEffect(()=>{u&&(async()=>{try{const t=await se();Vt(t.map(r=>({value:r.id,label:`${r.id}- ${r.english||"Surah"}`})));const e=t.find(r=>r.id===Number(u));It(`${u}- ${e?.english||"Surah"}`)}catch{It(`${u}- Surah`)}})()},[u]),f.useEffect(()=>{let n=!0;return(async()=>{try{const t=await ae();if(!n)return;const r=t.find(a=>a.number===Number(u))?.ayahs||286,i=Array.from({length:r},(a,o)=>String(o+1));kt(i)}catch{n&&kt(Array.from({length:50},(e,r)=>String(r+1)))}})(),()=>{n=!1}},[u]),f.useEffect(()=>{(async()=>{if(!(!u||!d))try{gt(!0),st(null),z([]);let t;if(c==="mal")if(/^\d+$/.test(d)){const o=await R(u,parseInt(d,10),"mal");if(h&&o.length>0){const p=o.filter(l=>l.InterpretationNo===String(h)||l.interptn_no===h);t=p.length>0?p:[o[0]]}else t=o}else t=await V(u,d,h,"mal");else if(c==="hi")if(/^\d+$/.test(d)){const o=await Mt.getExplanation(u,parseInt(d,10));t=o&&o!=="N/A"?[{Interpretation:o,AudioIntrerptn:o,text:o,content:o,InterpretationNo:h}]:[]}else{const[o,p]=d.split("-").map(s=>parseInt(s.trim(),10));t=(await Mt.fetchBlockwiseHindi(u,o,p)).map(s=>({Interpretation:s.explanation,AudioIntrerptn:s.explanation,text:s.explanation,content:s.explanation,InterpretationNo:h,ayah:s.ayah}))}else if(c==="ur")if(/^\d+$/.test(d)){const o=await Tt.getExplanation(u,parseInt(d,10));t=o&&o!=="N/A"?[{Interpretation:o,AudioIntrerptn:o,text:o,content:o,InterpretationNo:h}]:[]}else{const[o,p]=d.split("-").map(s=>parseInt(s.trim(),10));t=(await Tt.fetchBlockwiseUrdu(u,o,p)).map(s=>({Interpretation:s.translation,AudioIntrerptn:s.translation,text:s.translation,content:s.translation,InterpretationNo:h,ayah:s.ayah}))}else if(c==="E"||c==="en")if(k||O)try{let a="";O?a=await ht.getInterpretationById(O):k&&(a=await ht.getExplanation(parseInt(k,10))),t=a&&a!=="N/A"?[{Interpretation:a,AudioIntrerptn:a,text:a,content:a,InterpretationNo:String(h),footnoteId:k,interpretationId:O}]:[]}catch(a){throw console.error("[BlockInterpretationModal] ❌ Error fetching English interpretation:",{error:a,message:a?.message,footnoteId:k,interpretationId:O}),a}else{const a=/^\d+$/.test(d),o="E";try{a?t=await Ft(u,parseInt(d,10),h,o):t=await V(u,d,h,o)}catch(p){throw console.error("[BlockInterpretationModal] ❌ Error fetching interpretation:",{error:p,message:p?.message,surahId:u,range:d,interpretationNo:h,langCode:o}),p}}else{const a=/^\d+$/.test(d),o=c;try{a?t=await Ft(u,parseInt(d,10),h,o):t=await V(u,d,h,o)}catch(p){throw console.error("[BlockInterpretationModal] ❌ Error fetching interpretation:",p),p}}const e=Array.isArray(t)?t:t?[t]:[];if(!(e.length>0&&e[0]&&(e[0].Interpretation&&e[0].Interpretation!==""&&e[0].Interpretation!==null&&e[0].Interpretation!==void 0||e[0].InterpretationText&&e[0].InterpretationText!==""&&e[0].InterpretationText!==null&&e[0].InterpretationText!==void 0||e[0].interpret_text&&e[0].interpret_text!==""&&e[0].interpret_text!==null&&e[0].interpret_text!==void 0||e[0].text&&e[0].text!==""&&e[0].text!==null&&e[0].text!==void 0))){console.warn(`[BlockInterpretationModal] ⚠️ No interpretation ${h} available for range ${d}`,{language:c,items:e});const a=d.match(/^(\d+)(?:-(\d+))?$/),o=a?parseInt(a[1],10):null,p=a&&a[2]?parseInt(a[2],10):o,l=o===p;let s=!1;if(o&&(c==="mal"||c==="E"||c==="en"))try{if(l){const g=await R(u,o,c==="E"||c==="en"?"E":"mal");if(g&&g.length>0){const N=($,b)=>{const x=[$.InterpretationNo,$.interpretationNo,$.interptn_no,$.resolvedInterpretationNo,b+1];for(const F of x){const A=parseInt(String(F),10);if(!isNaN(A)&&A>=1&&A<=20)return A}return b+1<=20?b+1:1};let I=g.find(($,b)=>N($,b)===h);I||(I=g[0]);const v=g.indexOf(I),S=N(I,v);w(S),z([I]),s=!0;return}}else{const g=await R(u,o,c==="E"||c==="en"?"E":"mal");if(g&&g.length>0){const N=(I,v)=>{const S=[I.InterpretationNo,I.interpretationNo,I.interptn_no,I.resolvedInterpretationNo,v+1];for(const $ of S){const b=parseInt(String($),10);if(!isNaN(b)&&b>=1&&b<=20)return b}return v+1<=20?v+1:1};for(let I=0;I<g.length;I++){const v=g[I],S=N(v,I);try{const b=await V(u,d,S,c==="E"||c==="en"?"E":"mal"),x=Array.isArray(b)?b:[b];if(x.length>0&&x[0]&&Object.keys(x[0]).length>0&&(x[0].Interpretation||x[0].interpret_text||x[0].text||"").trim()!==""){w(S),z(x),s=!0;return}}catch{continue}}}}}catch(m){console.warn("Failed to check available interpretations:",m)}if(!s)if(h!==1){w(1);return}else st(`No interpretation available for verses ${d}.`),z([])}else z(e)}catch(t){console.error(`[BlockInterpretationModal] ❌ Failed to load interpretation ${h}:`,{error:t,message:t?.message,stack:t?.stack,surahId:u,range:d,interpretationNo:h,language:c});let e="Failed to load interpretation";t.message?.includes("500")?e=`Server error loading interpretation ${h}. Please try again later.`:t.message?.includes("404")?e=`Interpretation ${h} not found for this selection.`:t.message?.includes("network")||t.message?.includes("fetch")?e="Network error. Please check your connection.":e=`Interpretation ${h} is not available.`,st(e)}finally{gt(!1)}})()},[u,d,h,c,k]);const X=()=>{bt.current.forEach(n=>{if(!n)return;n.querySelectorAll("sup, a").forEach(e=>{const r=(e.innerText||e.textContent||"").trim();if(r)if(e.style.removeProperty("color"),e.style.removeProperty("text-decoration"),e.style.removeProperty("cursor"),e.style.removeProperty("font-weight"),/^N\d+$/.test(r))e.setAttribute("data-type","note"),e.setAttribute("data-value",r),e.onclick=_;else if(/^B\d+$/.test(r))e.setAttribute("data-type","note"),e.setAttribute("data-value",r),e.onclick=_;else if(/^\d+B\d+$/.test(r)){const i=r.match(/B(\d+)/i);if(i){const a=`B${i[1]}`;e.setAttribute("data-type","note"),e.setAttribute("data-value",a),e.onclick=_}}else if(/^\d+,\d+B\d+$/.test(r)){const i=r.match(/B(\d+)/i);if(i){const a=`B${i[1]}`;e.setAttribute("data-type","note"),e.setAttribute("data-value",a),e.onclick=_}}else(/^\(?\d+\s*[:：]\s*\d+\)?$/.test(r)||/^\d+\s*[:：]\s*\d+$/.test(r)||/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*\d+\s+\d+:\d+/.test(r)||/സൂക്തം:\s*\d+\s+\d+:\d+/.test(r))&&(e.setAttribute("data-type","verse"),e.setAttribute("data-value",r),e.onclick=_)})})};f.useEffect(()=>{W.length>0&&(X(),setTimeout(X,100))},[W]),f.useEffect(()=>{!it&&!ct&&W.length>0&&(X(),setTimeout(X,100))},[it,ct]);const U=async n=>{K({id:n,content:"Loading..."}),xt(!0);try{const t=await ie(n),e=t?.NoteText||t?.note_text||t?.content||t?.html||t?.text||t?.body||t?.description||t?.note||(typeof t=="string"?t:null);K(e&&e!=="Note content not available"?{id:n,content:e}:{id:n,content:'<p style="color: #666;">Note content is not available.</p>'})}catch(t){console.error(`Failed to fetch note ${n}:`,t.message),K({id:n,content:`
          <div class="note-content">
            <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note ${n}</h3>
            <p style="color: #666;">Note content is temporarily unavailable. Please try again later.</p>
            <p style="color: #999; font-size: 0.9em; margin-top: 10px;">Error: ${t.message||"Unknown error"}</p>
          </div>
        `})}},_=n=>{n.preventDefault(),n.stopPropagation();const t=n.target,e=t.getAttribute("data-type"),r=t.getAttribute("data-value"),i=t.innerText||t.textContent||"";if(!i)return;if(e==="verse"||e==="range"){const p=r||i,l=p.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/)||p.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);if(l){const[,m,g]=l;P({surahId:parseInt(m,10),verseId:parseInt(g,10)}),M(!0);return}const s=p.match(/^\(?(\d+)\s*[:：]\s*(\d+)\)?$/);if(s){const[,m,g]=s;P({surahId:parseInt(m,10),verseId:parseInt(g,10)}),M(!0);return}}else if(e==="note"){U(r||i);return}const a=i.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/)||i.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);if(a){const[,p,l]=a;P({surahId:parseInt(p,10),verseId:parseInt(l,10)}),M(!0);return}const o=i.match(/^\(?(\d+)\s*[:：]\s*(\d+)\)?$/);if(o){const[,p,l]=o;P({surahId:parseInt(p,10),verseId:parseInt(l,10)}),M(!0);return}U(i)},Ut=n=>{const t=n.target,e=t.closest(".verse-reference-link");if(e){n.preventDefault(),n.stopPropagation();const s=e.getAttribute("data-surah"),m=e.getAttribute("data-ayah");if(s&&m){P({surahId:parseInt(s,10),verseId:parseInt(m,10)}),M(!0);return}}if(t.tagName==="SUP"||t.tagName==="A"){_(n);return}const r=t.innerText||t.textContent||"",i=r.match(/(\d+,\d+)?B(\d+)/i)||r.match(/B(\d+)/i);if(i){const s=`B${i[2]||i[1]}`;U(s);return}const a=r.match(/N(\d+)/i);if(a){const s=`N${a[1]}`;U(s);return}const o=r.match(/H(\d+)/i);if(o){const s=`H${o[1]}`;U(s);return}const p=r.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/)||r.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);if(p){const[,s,m]=p;P({surahId:parseInt(s,10),verseId:parseInt(m,10)}),M(!0);return}const l=r.match(/\(?(\d+)\s*[:：]\s*(\d+)\)?/);if(l){const[,s,m]=l;P({surahId:parseInt(s,10),verseId:parseInt(m,10)}),M(!0);return}},Ht=n=>{wt(parseInt(n,10))},Lt=n=>{j(String(n))};f.useEffect(()=>{(c==="E"||c==="en")&&k&&d?(async()=>{const t=await D(u,d);lt(t)})():lt([])},[u,d,c,k,D]);const ut=f.useCallback(async n=>{if(!B.length||!d)return!1;const t=T(d);if(!t)return!1;const e=B.findIndex(i=>i.label===t.label||i.start===t.start&&i.end===t.end);if(e===-1)return!1;let r=e+n;for(;r>=0&&r<B.length;){const i=B[r];try{const a=await D(u,i.label);if(Array.isArray(a)&&a.length>0)return!0}catch{}r+=n}return!1},[B,d,u,D,T]),[qt,Z]=f.useState(!0),[Yt,tt]=f.useState(!0);f.useEffect(()=>{if((c==="E"||c==="en")&&k&&B.length>0){let n=!1;return(async()=>{if(E.length===0){Z(!0),tt(!0);return}const e=E.findIndex(a=>a.footnoteId===k);if(e>=0&&e<E.length-1)n||Z(!0);else{const a=await ut(1);n||Z(a)}if(e>0)n||tt(!0);else{const a=await ut(-1);n||tt(a)}})(),()=>{n=!0}}else Z(!0),tt(!0)},[c,k,E,B,ut]);const At=async()=>{if((c==="E"||c==="en")&&k){if(E.length===0)console.warn("[BlockInterpretationModal] ⚠️ No footnotes loaded for range:",d);else{const e=E.findIndex(r=>r.footnoteId===k);if(e>0){const r=E[e-1];Q(r.footnoteId),w(r.footnoteNumber);return}}if(await $t(-1))return}if(h>1){w(h-1);return}const n=String(d);if(/^\d+$/.test(n)){const t=parseInt(n,10);if(t<=1){alert("Already at the first verse");return}const e=t-1;if(j(String(e)),c==="mal")try{const r=await R(u,e,"mal");if(r&&r.length>0){const i=r[r.length-1],a=(l,s)=>{const m=[l.InterpretationNo,l.interpretationNo,l.interptn_no,l.resolvedInterpretationNo,s+1];for(const g of m){const N=parseInt(String(g),10);if(!isNaN(N)&&N>=1&&N<=20)return N}return s+1<=20?s+1:1},o=r.length-1,p=a(i,o);w(p)}}catch(r){console.warn("Failed to fetch available interpretations for previous verse:",r)}}else if(/^(\d+)-(\d+)$/.test(n)){const t=n.match(/^(\d+)-(\d+)$/);if(t){const[,e,r]=t,i=parseInt(e,10),o=parseInt(r,10)-i+1;if(i<=1){alert("Already at the first block");return}const p=Math.max(1,i-o),l=p+o-1;if(j(`${p}-${l}`),c==="mal")try{const s=await R(u,p,"mal");if(s&&s.length>0){const m=s[s.length-1],g=(v,S)=>{const $=[v.InterpretationNo,v.interpretationNo,v.interptn_no,v.resolvedInterpretationNo,S+1];for(const b of $){const x=parseInt(String(b),10);if(!isNaN(x)&&x>=1&&x<=20)return x}return S+1<=20?S+1:1},N=s.length-1,I=g(m,N);w(I)}}catch(s){console.warn("Failed to fetch available interpretations for previous block:",s)}}}},Et=async()=>{if((c==="E"||c==="en")&&k){if(E.length===0)console.warn("[BlockInterpretationModal] ⚠️ No footnotes loaded for range:",d);else{const p=E.findIndex(l=>l.footnoteId===k);if(p>=0&&p<E.length-1){const l=E[p+1];Q(l.footnoteId),w(l.footnoteNumber);return}}if(await $t(1))return}const n=h+1,t=d.match(/^(\d+)(?:-(\d+))?$/),e=t?parseInt(t[1],10):null,r=t&&t[2]?parseInt(t[2],10):e,i=e===r;if(e&&c==="mal")try{let o=!1;if(i){const l=await R(u,e,"mal");if(l&&l.length>0){const s=(m,g)=>{const N=[m.InterpretationNo,m.interpretationNo,m.interptn_no,m.resolvedInterpretationNo,g+1];for(const I of N){const v=parseInt(String(I),10);if(!isNaN(v)&&v>=1&&v<=20)return v}return g+1<=20?g+1:1};for(let m=0;m<l.length;m++)if(s(l[m],m)===n){o=!0;break}}}else try{const l=await V(u,d,n,"mal"),s=Array.isArray(l)?l:[l];s.length>0&&s[0]&&Object.keys(s[0]).length>0&&(s[0].Interpretation||s[0].interpret_text||s[0].text||"").trim()!==""&&(o=!0)}catch{o=!1}if(o){w(n);return}const p=String(d);if(/^(\d+)-(\d+)$/.test(p)){const l=p.match(/^(\d+)-(\d+)$/);if(l){const[,s,m]=l,g=parseInt(s,10),N=parseInt(m,10),I=N-g+1,v=C.length>0?parseInt(C[C.length-1],10):286;if(N<v){const S=g+I,$=Math.min(v,S+I-1),b=`${S}-${$}`;try{if(S===$){const x=await R(u,S,"mal");if(x&&x.length>0){const F=(A,et)=>{const ee=[A.InterpretationNo,A.interpretationNo,A.interptn_no,A.resolvedInterpretationNo,et+1];for(const ne of ee){const nt=parseInt(String(ne),10);if(!isNaN(nt)&&nt>=1&&nt<=20)return nt}return et+1<=20?et+1:1};for(let A=0;A<x.length;A++)if(F(x[A],A)===n){j(b),w(n);return}}}else{const x=await V(u,b,n,"mal"),F=Array.isArray(x)?x:[x];if(F.length>0&&F[0]&&Object.keys(F[0]).length>0&&(F[0].Interpretation||F[0].interpret_text||F[0].text||"").trim()!==""){j(b),w(n);return}}}catch{}}}}}catch(o){console.warn("Failed to fetch available interpretations for next:",o)}const a=String(d);if(/^\d+$/.test(a)){const o=parseInt(a,10),p=C.length>0?parseInt(C[C.length-1],10):286;if(o>=p){alert("Already at the last verse of this surah");return}const l=o+1;j(String(l)),w(1)}else if(/^(\d+)-(\d+)$/.test(a)){const o=a.match(/^(\d+)-(\d+)$/);if(o){const[,p,l]=o,s=parseInt(p,10),m=parseInt(l,10),g=m-s+1,N=C.length>0?parseInt(C[C.length-1],10):286;if(m>=N){alert("Already at the last block of this surah");return}const I=s+g,v=Math.min(N,I+g-1);j(`${I}-${v}`),w(1)}}},Jt=async()=>{try{Nt(!0);const n=jt.getEffectiveUserId(Rt);await jt.addBlockInterpretationBookmark(n,u,d,yt,h,c),alert(`Saved interpretation for Surah ${u}, verses ${d}`)}catch(n){console.error("Failed to bookmark interpretation",n),alert("Failed to save interpretation bookmark")}finally{setTimeout(()=>Nt(!1),300)}},Kt=async()=>{const n=`Interpretation ${h} — Surah ${u} • Range ${d}`,t=`${window.location.origin}/interpretation-blockwise?surahId=${u}&range=${d}&ipt=${h}&lang=${c}`;try{navigator.share?await navigator.share({title:document.title||"Thafheem",text:n,url:t}):(await navigator.clipboard.writeText(`${n}
${t}`),alert("Link copied to clipboard"))}catch(e){console.error("Share failed",e),alert("Share failed: "+e.message)}},[Gt,Bt]=f.useState(!1),[Qt,Ct]=f.useState(1),Xt=()=>{const n=/^\d+/.exec(String(d))?.[0]||"1";Ct(parseInt(n)),Bt(!0)},ft=n=>{if(!n||typeof n!="string")return n;const t=/\(?(\d+)\s*[:：]\s*(\d+)\)?/g;return n.replace(t,(e,r,i)=>e.includes("verse-reference-link")?e:`<span class="verse-reference-link inline-block cursor-pointer text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-600 dark:decoration-cyan-400/50 dark:hover:decoration-cyan-300 transition-colors" data-surah="${r}" data-ayah="${i}" title="Click to view Surah ${r}, Verse ${i}">${e}</span>`)},Zt=n=>{if(n==null)return"";if(typeof n=="string")return ft(n);const t=["interpret_text","InterpretText","Interpret_Text","interpretation","Interpretation","text","Text","content","Content","meaning","Meaning","body","Body","desc","Desc","description","Description"];for(const e of t)if(typeof n[e]=="string"&&n[e].trim().length>0)return ft(n[e]);for(const[e,r]of Object.entries(n))if(typeof r=="string"&&r.trim().length>20)return ft(r);return console.warn("⚠️ No valid interpretation text found in item:",n),`<p class="text-gray-500 italic">No interpretation content available for interpretation ${h}</p>`},te=document.getElementById("modal-root")||document.body;return ce.createPortal(y.jsxs(y.Fragment,{children:[y.jsx("style",{children:`
        /* Entry animations */
        @keyframes backdropFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes modalSlideDown {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
        }
        .animate-backdrop-fade-in {
          animation: backdropFadeIn 0.2s ease-out;
        }
        .animate-modal-slide-up {
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-modal-slide-down {
          animation: modalSlideDown 0.2s ease-in;
        }
        
        /* Specific styling for note and verse markers in interpretation content */
        .interpretation-content sup[data-type="note"], 
        .interpretation-content a[data-type="note"],
        .interpretation-content sup[data-type="verse"], 
        .interpretation-content a[data-type="verse"] {
          transition: all 0.2s ease !important;
          color: #2AA0BF !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          text-decoration: none !important;
        }
        
        .interpretation-content sup[data-type="note"]:hover, 
        .interpretation-content a[data-type="note"]:hover,
        .interpretation-content sup[data-type="verse"]:hover, 
        .interpretation-content a[data-type="verse"]:hover {
          color: #1e7a8c !important;
          text-decoration: underline !important;
          transform: scale(1.05) !important;
        }
        
        /* Fallback for elements without data-type but with note/verse patterns */
        .interpretation-content sup:not([data-type]), 
        .interpretation-content a:not([data-type]) {
          color: #2AA0BF !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          text-decoration: none !important;
          transition: all 0.2s ease !important;
        }
        
        .interpretation-content sup:not([data-type]):hover, 
        .interpretation-content a:not([data-type]):hover {
          color: #1e7a8c !important;
          text-decoration: underline !important;
          transform: scale(1.05) !important;
        }
        
        /* Urdu interpretation styling */
        .urdu-interpretation-content p {
          text-align: right !important;
          font-size: 16px !important;
          line-height: 2.6 !important;
          margin-bottom: 10px !important;
          font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
        }
        
        /* Urdu interpretation link (superscript) styling - matching Malayalam style */
        .urdu-interpretation-content sup.interpretation-link,
        .urdu-interpretation-content sup[data-interpretation],
        .urdu-interpretation-content sup.urdu-footnote-link,
        .urdu-interpretation-content sup[data-footnote-id] {
          margin-right: 4px !important;
          margin-left: -1px !important;
          margin-top: -15px !important;
          cursor: pointer !important;
          background-color: rgb(41, 169, 199) !important;
          color: rgb(255, 255, 255) !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          border: none !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 12px !important;
          vertical-align: middle !important;
          line-height: 1 !important;
          border-radius: 9999px !important;
          position: relative !important;
          z-index: 10 !important;
          top: 0px !important;
          min-width: 20px !important;
          min-height: 19px !important;
          text-align: center !important;
          transition: 0.2s ease-in-out !important;
          padding: 0 !important;
        }
        .urdu-interpretation-content sup.interpretation-link > a,
        .urdu-interpretation-content sup[data-interpretation] > a,
        .urdu-interpretation-content sup.urdu-footnote-link > a,
        .urdu-interpretation-content sup[data-footnote-id] > a {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          height: 100% !important;
          color: inherit !important;
          font-weight: inherit !important;
          text-decoration: none !important;
          line-height: 1 !important;
        }
        .urdu-interpretation-content sup.interpretation-link:hover,
        .urdu-interpretation-content sup[data-interpretation]:hover,
        .urdu-interpretation-content sup.urdu-footnote-link:hover,
        .urdu-interpretation-content sup[data-footnote-id]:hover {
          background-color: #0891b2 !important;
          transform: scale(1.05) !important;
        }
        .urdu-interpretation-content sup.interpretation-link:active,
        .urdu-interpretation-content sup[data-interpretation]:active,
        .urdu-interpretation-content sup.urdu-footnote-link:active,
        .urdu-interpretation-content sup[data-footnote-id]:active {
          background-color: #0e7490 !important;
          transform: scale(0.95) !important;
        }
        `}),y.jsxs("div",{className:"fixed inset-0 z-[99999] flex items-end sm:items-center justify-center",children:[y.jsx("div",{className:"fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity",onClick:pt,style:{pointerEvents:dt?"none":"auto"}}),y.jsxs("div",{className:`relative w-full ${c==="E"||c==="en"?"sm:w-auto sm:max-w-2xl":"sm:w-auto sm:max-w-4xl xl:max-w-[1073px]"} ${c==="E"||c==="en"?"sm:max-h-[95vh]":"max-h-[85vh] sm:max-h-[90vh]"} bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-slideUp sm:animate-fadeIn ${c==="E"||c==="en"?"":"overflow-hidden"} ${dt?"animate-slideDown sm:animate-fadeOut":""}`,onClick:n=>n.stopPropagation(),style:{...c==="E"||c==="en"?{maxWidth:"42rem",minWidth:"min(90vw, 20rem)",height:"auto",maxHeight:"95vh"}:{}},children:[y.jsx("div",{className:"w-full flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing",onClick:pt,style:{pointerEvents:dt?"none":"auto"},children:y.jsx("div",{className:"w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"})}),y.jsx("div",{className:"flex-shrink-0 z-10 bg-white dark:bg-gray-900",children:y.jsx(pe,{interpretationNumber:h,surahName:yt,verseRange:d.replace(/-/g," - "),language:c,onClose:pt,onBookmark:Jt,onShare:Kt,onWordByWord:Xt,bookmarking:Dt,surahOptions:_t,rangeOptions:C,onPickSurah:Ht,onPickRange:Lt,onPrev:(c==="E"||c==="en")&&k&&E.length>0?Yt?At:null:At,onNext:(c==="E"||c==="en")&&k&&E.length>0?qt?Et:null:Et,isModal:!0,hideTitle:!!k},`navbar-${u}-${d}-${h}`)}),y.jsxs("div",{className:`${c==="E"||c==="en"?"overflow-y-auto":"flex-1 overflow-y-auto"} px-4 sm:px-6 py-6 sm:py-8 ${c==="E"||c==="en"?"":"min-h-0"}`,style:{...c==="E"||c==="en"?{maxHeight:"calc(95vh - 120px)"}:{}},children:[mt&&y.jsx("div",{className:"flex items-center justify-center py-8",children:y.jsxs("div",{className:"text-center",children:[y.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"}),y.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"Loading interpretation..."})]})}),ot&&y.jsxs("div",{className:"text-center py-8",children:[y.jsx("p",{className:"text-red-500 dark:text-red-400 text-lg mb-2",children:"Failed to load interpretation"}),y.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400 mb-4",children:ot}),y.jsx("button",{onClick:()=>window.location.reload(),className:"px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors",children:"Try Again"})]}),!mt&&!ot&&W.length===0&&y.jsx("div",{className:"text-center py-10 text-gray-600 dark:text-gray-300",children:"No interpretation found for this selection."}),y.jsx("div",{className:"font-poppins space-y-6 sm:space-y-8",children:W.map((n,t)=>{const e=c==="ur"||c==="urdu";return y.jsx("div",{className:"mb-6 sm:mb-8",children:y.jsx("div",{className:`interpretation-content text-gray-700 leading-relaxed dark:text-gray-300 text-sm sm:text-base prose dark:prose-invert max-w-none ${e?"font-urdu-nastaliq urdu-interpretation-content":""}`,ref:r=>bt.current[t]=r,onClick:Ut,style:{pointerEvents:"auto",position:"relative",zIndex:1,...e?{textAlign:"right",fontSize:"16px",lineHeight:"2.6",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"}:{}},dir:e?"rtl":"ltr",dangerouslySetInnerHTML:{__html:Zt(n)}})},`${u}-${d}-${h}-${n?.ID||n?.id||t}`)})},`block-${u}-${d}-${h}`)]}),Gt&&y.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-[100000] pt-24 sm:pt-28 lg:pt-32 p-4 overflow-hidden",children:y.jsx(le,{selectedVerse:Qt,surahId:u,onClose:()=>Bt(!1),onNavigate:Ct,onSurahChange:()=>{}})})]})]}),y.jsx(oe,{isOpen:it,onClose:()=>xt(!1),noteId:vt.id,noteContent:vt.content}),ct&&G.surahId&&G.verseId&&y.jsx(de,{surahId:G.surahId,verseId:G.verseId,onClose:()=>M(!1),interpretationNo:h,language:c})]}),te)};export{xe as B};
