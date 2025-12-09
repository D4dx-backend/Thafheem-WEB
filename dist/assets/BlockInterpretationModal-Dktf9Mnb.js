import{u as re,t as ae,j as b,N as oe,r as se,af as P,K as V,J as Tt,w as Mt,y as ie}from"./index-ZyCXWqTv.js";import{b as h,c as ce}from"./react-vendor-v5ei6ytj.js";import{W as le,A as de}from"./WordByWord-CpXLkblR.js";import{I as pe}from"./InterpretationNavbar-CUy_L0ui.js";import Pt from"./hindiTranslationService-e72fDb6R.js";import _t from"./urduTranslationService-DYIhtcEh.js";import gt from"./englishTranslationService-QMtPmafp.js";const xe=({surahId:Y,range:J,interpretationNo:K=1,language:G="en",footnoteId:at=null,interpretationId:ot=null,onClose:Dt,blockRanges:_=[]})=>{const{user:Rt}=re?.()||{user:null},[yt,It]=h.useState(!0),[st,it]=h.useState(null),[H,W]=h.useState([]),[xt,vt]=h.useState(""),[ct,bt]=h.useState(!1),[Nt,Q]=h.useState({id:"",content:null}),[lt,T]=h.useState(!1),[X,D]=h.useState({surahId:null,verseId:null}),kt=h.useRef([]),[Vt,wt]=h.useState(!1),[Wt,zt]=h.useState([]),[F,St]=h.useState([]),[p,$t]=h.useState(Y),[d,j]=h.useState(J),[m,E]=h.useState(K),[c,Ot]=h.useState(G),[$,Z]=h.useState(at),[L,Ut]=h.useState(ot),[B,dt]=h.useState([]),[pt,Ht]=h.useState(!1),At=h.useRef(!1),M=h.useCallback(n=>{if(n==null)return null;const t=String(n).trim();if(!t)return null;if(/^\d+$/.test(t)){const r=parseInt(t,10);return Number.isFinite(r)?{start:r,end:r,label:t}:null}const e=t.match(/^(\d+)\s*-\s*(\d+)$/);if(e){const r=parseInt(e[1],10),i=parseInt(e[2],10);if(Number.isFinite(r)&&Number.isFinite(i))return{start:r,end:i,label:r===i?`${r}`:`${r}-${i}`}}return null},[]),C=h.useMemo(()=>{if(!Array.isArray(_)||_.length===0)return[];const n=t=>{if(typeof t=="string"||typeof t=="number")return M(t);if(t&&typeof t=="object"){const e=t.AyaFrom??t.ayafrom??t.from??t.start??t.begin??t.AyaFromId,r=t.AyaTo??t.ayato??t.to??t.end??t.finish??t.AyaToId??e;if(e==null&&typeof t.Range=="string")return M(t.Range);if(e==null&&typeof t.range=="string")return M(t.range);const i=Number.parseInt(e,10),a=Number.parseInt(r,10);if(Number.isFinite(i)&&Number.isFinite(a))return{start:i,end:a,label:i===a?`${i}`:`${i}-${a}`}}return null};return _.map(t=>n(t)).filter(Boolean).sort((t,e)=>t.start-e.start).map((t,e)=>({...t,index:e}))},[_,M]),z=h.useCallback(async(n,t)=>{try{const[e,r]=t.includes("-")?t.split("-").map(a=>parseInt(a.trim(),10)):[parseInt(t,10),parseInt(t,10)],i=[];for(let a=e;a<=r;a++)try{const o=await gt.getAyahTranslation(n,a);if(o){const u=/<sup[^>]*foot_note="([^"]+)"[^>]*>(\d+)<\/sup>/g;let l;for(;(l=u.exec(o))!==null;){const s=l[1],f=parseInt(l[2],10);i.push({footnoteId:s,footnoteNumber:f,ayah:a})}}}catch(o){console.warn(`[BlockInterpretationModal] Failed to fetch translation for ayah ${a}:`,o)}return i.sort((a,o)=>a.ayah!==o.ayah?a.ayah-o.ayah:a.footnoteNumber-o.footnoteNumber),i}catch(e){return console.error("[BlockInterpretationModal] ❌ Error extracting footnotes from range:",e),[]}},[]),Et=h.useCallback(async n=>{if(!C.length||!d)return!1;const t=M(d);if(!t)return!1;const e=C.findIndex(i=>i.label===t.label||i.start===t.start&&i.end===t.end);if(e===-1)return!1;let r=e+n;for(;r>=0&&r<C.length;){const i=C[r];try{const a=await z(p,i.label);if(Array.isArray(a)&&a.length>0){const o=n>0?a[0]:a[a.length-1];return j(i.label),Z(o.footnoteId),E(o.footnoteNumber),dt(a),!0}}catch(a){console.warn(`[BlockInterpretationModal] Failed to load footnotes for block ${i.label}:`,a)}r+=n}return!1},[C,d,p,z,M]);h.useEffect(()=>(document.body.style.overflow="hidden",()=>{document.body.style.overflow=""}),[]),h.useEffect(()=>{$t(Y),j(J),E(K),Ot(G),Z(at)},[Y,J,K,G,at]),h.useEffect(()=>{Ut(ot)},[Y,J,K,G,ot]);const ut=n=>{n&&(n.preventDefault(),n.stopPropagation()),!At.current&&(At.current=!0,Ht(!0),setTimeout(()=>{Dt()},200))};h.useEffect(()=>{p&&(async()=>{try{const t=await se();zt(t.map(r=>({value:r.id,label:`${r.id}- ${r.english||"Surah"}`})));const e=t.find(r=>r.id===Number(p));vt(`${p}- ${e?.english||"Surah"}`)}catch{vt(`${p}- Surah`)}})()},[p]),h.useEffect(()=>{let n=!0;return(async()=>{try{const t=await ae();if(!n)return;const r=t.find(a=>a.number===Number(p))?.ayahs||286,i=Array.from({length:r},(a,o)=>String(o+1));St(i)}catch{n&&St(Array.from({length:50},(e,r)=>String(r+1)))}})(),()=>{n=!1}},[p]),h.useEffect(()=>{(async()=>{if(!(!p||!d))try{It(!0),it(null),W([]);let t;if(c==="mal")if(/^\d+$/.test(d)){const o=await P(p,parseInt(d,10),"mal");if(m&&o.length>0){const u=o.filter(l=>l.InterpretationNo===String(m)||l.interptn_no===m);t=u.length>0?u:[o[0]]}else t=o}else t=await V(p,d,m,"mal");else if(c==="hi")if(/^\d+$/.test(d)){const o=await Pt.getExplanation(p,parseInt(d,10));t=o&&o!=="N/A"?[{Interpretation:o,AudioIntrerptn:o,text:o,content:o,InterpretationNo:m}]:[]}else{const[o,u]=d.split("-").map(s=>parseInt(s.trim(),10));t=(await Pt.fetchBlockwiseHindi(p,o,u)).map(s=>({Interpretation:s.explanation,AudioIntrerptn:s.explanation,text:s.explanation,content:s.explanation,InterpretationNo:m,ayah:s.ayah}))}else if(c==="ur")if(/^\d+$/.test(d)){const o=await _t.getExplanation(p,parseInt(d,10));t=o&&o!=="N/A"?[{Interpretation:o,AudioIntrerptn:o,text:o,content:o,InterpretationNo:m}]:[]}else{const[o,u]=d.split("-").map(s=>parseInt(s.trim(),10));t=(await _t.fetchBlockwiseUrdu(p,o,u)).map(s=>({Interpretation:s.translation,AudioIntrerptn:s.translation,text:s.translation,content:s.translation,InterpretationNo:m,ayah:s.ayah}))}else if(c==="E"||c==="en")if($||L)try{let a="";L?a=await gt.getInterpretationById(L):$&&(a=await gt.getExplanation(parseInt($,10))),t=a&&a!=="N/A"?[{Interpretation:a,AudioIntrerptn:a,text:a,content:a,InterpretationNo:String(m),footnoteId:$,interpretationId:L}]:[]}catch(a){throw console.error("[BlockInterpretationModal] ❌ Error fetching English interpretation:",{error:a,message:a?.message,footnoteId:$,interpretationId:L}),a}else{const a=/^\d+$/.test(d),o="E";try{a?t=await Tt(p,parseInt(d,10),m,o):t=await V(p,d,m,o)}catch(u){throw console.error("[BlockInterpretationModal] ❌ Error fetching interpretation:",{error:u,message:u?.message,surahId:p,range:d,interpretationNo:m,langCode:o}),u}}else{const a=/^\d+$/.test(d),o=c;try{a?t=await Tt(p,parseInt(d,10),m,o):t=await V(p,d,m,o)}catch(u){throw console.error("[BlockInterpretationModal] ❌ Error fetching interpretation:",u),u}}const e=Array.isArray(t)?t:t?[t]:[];if(!(e.length>0&&e[0]&&(e[0].Interpretation&&e[0].Interpretation!==""&&e[0].Interpretation!==null&&e[0].Interpretation!==void 0||e[0].InterpretationText&&e[0].InterpretationText!==""&&e[0].InterpretationText!==null&&e[0].InterpretationText!==void 0||e[0].interpret_text&&e[0].interpret_text!==""&&e[0].interpret_text!==null&&e[0].interpret_text!==void 0||e[0].text&&e[0].text!==""&&e[0].text!==null&&e[0].text!==void 0))){const a=d.match(/^(\d+)(?:-(\d+))?$/),o=a?parseInt(a[1],10):null,u=a&&a[2]?parseInt(a[2],10):o,l=o===u;let s=!1;if(o&&(c==="mal"||c==="E"||c==="en"))try{if(l){const g=await P(p,o,c==="E"||c==="en"?"E":"mal");if(g&&g.length>0){const N=(v,w)=>{const x=[v.InterpretationNo,v.interpretationNo,v.interptn_no,v.resolvedInterpretationNo,w+1];for(const A of x){const S=parseInt(String(A),10);if(!isNaN(S)&&S>=1&&S<=20)return S}return w+1<=20?w+1:1};let y=g.find((v,w)=>N(v,w)===m);y||(y=g[0]);const k=g.indexOf(y),I=N(y,k);E(I),W([y]),s=!0;return}}else{const g=await P(p,o,c==="E"||c==="en"?"E":"mal");if(g&&g.length>0){const N=(y,k)=>{const I=[y.InterpretationNo,y.interpretationNo,y.interptn_no,y.resolvedInterpretationNo,k+1];for(const v of I){const w=parseInt(String(v),10);if(!isNaN(w)&&w>=1&&w<=20)return w}return k+1<=20?k+1:1};for(let y=0;y<g.length;y++){const k=g[y],I=N(k,y);if(I===m)try{const w=await V(p,d,I,c==="E"||c==="en"?"E":"mal"),x=Array.isArray(w)?w:[w];if(x.length>0&&x[0]&&Object.keys(x[0]).length>0&&(x[0].Interpretation||x[0].interpret_text||x[0].text||"").trim()!==""){E(I),W(x),s=!0;return}}catch{}}}}}catch(f){console.warn("Failed to check available interpretations:",f)}if(!s&&m&&_&&_.length>0)try{const f=c==="E"||c==="en"?"E":"mal";for(const g of _){const N=g.AyaFrom||g.ayafrom||g.from||1,y=g.AyaTo||g.ayato||g.to||N,k=N===y?String(N):`${N}-${y}`;if(k!==d)try{let I=null;if(N===y){const v=await P(p,N,f);if(v&&v.length>0){const w=(A,S)=>{const R=[A.InterpretationNo,A.interpretationNo,A.interptn_no,A.resolvedInterpretationNo,S+1];for(const mt of R){const U=parseInt(String(mt),10);if(!isNaN(U)&&U>=1&&U<=20)return U}return S+1<=20?S+1:1},x=v.find((A,S)=>w(A,S)===m);x&&(I=[x])}}else{I=await V(p,k,m,f);const v=Array.isArray(I)?I:[I];v.length>0&&v[0]&&Object.keys(v[0]).length>0&&(v[0].Interpretation||v[0].interpret_text||v[0].text||"").trim()!==""?I=v:I=null}if(I&&I.length>0){j(k),W(I),s=!0;return}}catch{continue}}}catch(f){console.warn("Failed to search across blocks:",f)}if(!s)if(m!==1){E(1);return}else it(`No interpretation available for verses ${d}.`),W([])}else W(e)}catch(t){console.error(`[BlockInterpretationModal] ❌ Failed to load interpretation ${m}:`,{error:t,message:t?.message,stack:t?.stack,surahId:p,range:d,interpretationNo:m,language:c});let e="Failed to load interpretation";t.message?.includes("500")?e=`Server error loading interpretation ${m}. Please try again later.`:t.message?.includes("404")?e=`Interpretation ${m} not found for this selection.`:t.message?.includes("network")||t.message?.includes("fetch")?e="Network error. Please check your connection.":e=`Interpretation ${m} is not available.`,it(e)}finally{It(!1)}})()},[p,d,m,c,$]);const tt=()=>{kt.current.forEach(n=>{if(!n)return;n.querySelectorAll("sup, a").forEach(e=>{const r=(e.innerText||e.textContent||"").trim();if(r)if(e.style.removeProperty("color"),e.style.removeProperty("text-decoration"),e.style.removeProperty("cursor"),e.style.removeProperty("font-weight"),/^N\d+$/.test(r))e.setAttribute("data-type","note"),e.setAttribute("data-value",r),e.onclick=O;else if(/^B\d+$/.test(r))e.setAttribute("data-type","note"),e.setAttribute("data-value",r),e.onclick=O;else if(/^\d+B\d+$/.test(r)){const i=r.match(/B(\d+)/i);if(i){const a=`B${i[1]}`;e.setAttribute("data-type","note"),e.setAttribute("data-value",a),e.onclick=O}}else if(/^\d+,\d+B\d+$/.test(r)){const i=r.match(/B(\d+)/i);if(i){const a=`B${i[1]}`;e.setAttribute("data-type","note"),e.setAttribute("data-value",a),e.onclick=O}}else(/^\(?\d+\s*[:：]\s*\d+\)?$/.test(r)||/^\d+\s*[:：]\s*\d+$/.test(r)||/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*\d+\s+\d+:\d+/.test(r)||/സൂക്തം:\s*\d+\s+\d+:\d+/.test(r))&&(e.setAttribute("data-type","verse"),e.setAttribute("data-value",r),e.onclick=O)})})};h.useEffect(()=>{H.length>0&&(tt(),setTimeout(tt,100))},[H]),h.useEffect(()=>{!ct&&!lt&&H.length>0&&(tt(),setTimeout(tt,100))},[ct,lt]);const q=async n=>{Q({id:n,content:"Loading..."}),bt(!0);try{const t=await ie(n),e=t?.NoteText||t?.note_text||t?.content||t?.html||t?.text||t?.body||t?.description||t?.note||(typeof t=="string"?t:null);Q(e&&e!=="Note content not available"?{id:n,content:e}:{id:n,content:'<p style="color: #666;">Note content is not available.</p>'})}catch(t){console.error(`Failed to fetch note ${n}:`,t.message),Q({id:n,content:`
          <div class="note-content">
            <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note ${n}</h3>
            <p style="color: #666;">Note content is temporarily unavailable. Please try again later.</p>
            <p style="color: #999; font-size: 0.9em; margin-top: 10px;">Error: ${t.message||"Unknown error"}</p>
          </div>
        `})}},O=n=>{n.preventDefault(),n.stopPropagation();const t=n.target,e=t.getAttribute("data-type"),r=t.getAttribute("data-value"),i=t.innerText||t.textContent||"";if(!i)return;if(e==="verse"||e==="range"){const u=r||i,l=u.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/)||u.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);if(l){const[,f,g]=l;D({surahId:parseInt(f,10),verseId:parseInt(g,10)}),T(!0);return}const s=u.match(/^\(?(\d+)\s*[:：]\s*(\d+)\)?$/);if(s){const[,f,g]=s;D({surahId:parseInt(f,10),verseId:parseInt(g,10)}),T(!0);return}}else if(e==="note"){q(r||i);return}const a=i.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/)||i.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);if(a){const[,u,l]=a;D({surahId:parseInt(u,10),verseId:parseInt(l,10)}),T(!0);return}const o=i.match(/^\(?(\d+)\s*[:：]\s*(\d+)\)?$/);if(o){const[,u,l]=o;D({surahId:parseInt(u,10),verseId:parseInt(l,10)}),T(!0);return}q(i)},Lt=n=>{const t=n.target,e=t.closest(".verse-reference-link");if(e){n.preventDefault(),n.stopPropagation();const s=e.getAttribute("data-surah"),f=e.getAttribute("data-ayah");if(s&&f){D({surahId:parseInt(s,10),verseId:parseInt(f,10)}),T(!0);return}}if(t.tagName==="SUP"||t.tagName==="A"){O(n);return}const r=t.innerText||t.textContent||"",i=r.match(/(\d+,\d+)?B(\d+)/i)||r.match(/B(\d+)/i);if(i){const s=`B${i[2]||i[1]}`;q(s);return}const a=r.match(/N(\d+)/i);if(a){const s=`N${a[1]}`;q(s);return}const o=r.match(/H(\d+)/i);if(o){const s=`H${o[1]}`;q(s);return}const u=r.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/)||r.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);if(u){const[,s,f]=u;D({surahId:parseInt(s,10),verseId:parseInt(f,10)}),T(!0);return}const l=r.match(/\(?(\d+)\s*[:：]\s*(\d+)\)?/);if(l){const[,s,f]=l;D({surahId:parseInt(s,10),verseId:parseInt(f,10)}),T(!0);return}},qt=n=>{$t(parseInt(n,10))},Yt=n=>{j(String(n))};h.useEffect(()=>{(c==="E"||c==="en")&&$&&d?(async()=>{const t=await z(p,d);dt(t)})():dt([])},[p,d,c,$,z]);const ft=h.useCallback(async n=>{if(!C.length||!d)return!1;const t=M(d);if(!t)return!1;const e=C.findIndex(i=>i.label===t.label||i.start===t.start&&i.end===t.end);if(e===-1)return!1;let r=e+n;for(;r>=0&&r<C.length;){const i=C[r];try{const a=await z(p,i.label);if(Array.isArray(a)&&a.length>0)return!0}catch{}r+=n}return!1},[C,d,p,z,M]),[Jt,et]=h.useState(!0),[Kt,nt]=h.useState(!0);h.useEffect(()=>{if((c==="E"||c==="en")&&$&&C.length>0){let n=!1;return(async()=>{if(B.length===0){et(!0),nt(!0);return}const e=B.findIndex(a=>a.footnoteId===$);if(e>=0&&e<B.length-1)n||et(!0);else{const a=await ft(1);n||et(a)}if(e>0)n||nt(!0);else{const a=await ft(-1);n||nt(a)}})(),()=>{n=!0}}else et(!0),nt(!0)},[c,$,B,C,ft]);const Bt=async()=>{if((c==="E"||c==="en")&&$){if(B.length===0)console.warn("[BlockInterpretationModal] ⚠️ No footnotes loaded for range:",d);else{const e=B.findIndex(r=>r.footnoteId===$);if(e>0){const r=B[e-1];Z(r.footnoteId),E(r.footnoteNumber);return}}if(await Et(-1))return}if(m>1){E(m-1);return}const n=String(d);if(/^\d+$/.test(n)){const t=parseInt(n,10);if(t<=1){alert("Already at the first verse");return}const e=t-1;if(j(String(e)),c==="mal")try{const r=await P(p,e,"mal");if(r&&r.length>0){const i=r[r.length-1],a=(l,s)=>{const f=[l.InterpretationNo,l.interpretationNo,l.interptn_no,l.resolvedInterpretationNo,s+1];for(const g of f){const N=parseInt(String(g),10);if(!isNaN(N)&&N>=1&&N<=20)return N}return s+1<=20?s+1:1},o=r.length-1,u=a(i,o);E(u)}}catch(r){console.warn("Failed to fetch available interpretations for previous verse:",r)}}else if(/^(\d+)-(\d+)$/.test(n)){const t=n.match(/^(\d+)-(\d+)$/);if(t){const[,e,r]=t,i=parseInt(e,10),o=parseInt(r,10)-i+1;if(i<=1){alert("Already at the first block");return}const u=Math.max(1,i-o),l=u+o-1;if(j(`${u}-${l}`),c==="mal")try{const s=await P(p,u,"mal");if(s&&s.length>0){const f=s[s.length-1],g=(k,I)=>{const v=[k.InterpretationNo,k.interpretationNo,k.interptn_no,k.resolvedInterpretationNo,I+1];for(const w of v){const x=parseInt(String(w),10);if(!isNaN(x)&&x>=1&&x<=20)return x}return I+1<=20?I+1:1},N=s.length-1,y=g(f,N);E(y)}}catch(s){console.warn("Failed to fetch available interpretations for previous block:",s)}}}},Ct=async()=>{if((c==="E"||c==="en")&&$){if(B.length===0)console.warn("[BlockInterpretationModal] ⚠️ No footnotes loaded for range:",d);else{const u=B.findIndex(l=>l.footnoteId===$);if(u>=0&&u<B.length-1){const l=B[u+1];Z(l.footnoteId),E(l.footnoteNumber);return}}if(await Et(1))return}const n=m+1,t=d.match(/^(\d+)(?:-(\d+))?$/),e=t?parseInt(t[1],10):null,r=t&&t[2]?parseInt(t[2],10):e,i=e===r;if(e&&c==="mal")try{let o=!1;if(i){const l=await P(p,e,"mal");if(l&&l.length>0){const s=(f,g)=>{const N=[f.InterpretationNo,f.interpretationNo,f.interptn_no,f.resolvedInterpretationNo,g+1];for(const y of N){const k=parseInt(String(y),10);if(!isNaN(k)&&k>=1&&k<=20)return k}return g+1<=20?g+1:1};for(let f=0;f<l.length;f++)if(s(l[f],f)===n){o=!0;break}}}else try{const l=await V(p,d,n,"mal"),s=Array.isArray(l)?l:[l];s.length>0&&s[0]&&Object.keys(s[0]).length>0&&(s[0].Interpretation||s[0].interpret_text||s[0].text||"").trim()!==""&&(o=!0)}catch{o=!1}if(o){E(n);return}const u=String(d);if(/^(\d+)-(\d+)$/.test(u)){const l=u.match(/^(\d+)-(\d+)$/);if(l){const[,s,f]=l,g=parseInt(s,10),N=parseInt(f,10),y=N-g+1,k=F.length>0?parseInt(F[F.length-1],10):286;if(N<k){const I=g+y,v=Math.min(k,I+y-1),w=`${I}-${v}`;try{if(I===v){const x=await P(p,I,"mal");if(x&&x.length>0){const A=(S,R)=>{const mt=[S.InterpretationNo,S.interpretationNo,S.interptn_no,S.resolvedInterpretationNo,R+1];for(const U of mt){const rt=parseInt(String(U),10);if(!isNaN(rt)&&rt>=1&&rt<=20)return rt}return R+1<=20?R+1:1};for(let S=0;S<x.length;S++)if(A(x[S],S)===n){j(w),E(n);return}}}else{const x=await V(p,w,n,"mal"),A=Array.isArray(x)?x:[x];if(A.length>0&&A[0]&&Object.keys(A[0]).length>0&&(A[0].Interpretation||A[0].interpret_text||A[0].text||"").trim()!==""){j(w),E(n);return}}}catch{}}}}}catch(o){console.warn("Failed to fetch available interpretations for next:",o)}const a=String(d);if(/^\d+$/.test(a)){const o=parseInt(a,10),u=F.length>0?parseInt(F[F.length-1],10):286;if(o>=u){alert("Already at the last verse of this surah");return}const l=o+1;j(String(l)),E(1)}else if(/^(\d+)-(\d+)$/.test(a)){const o=a.match(/^(\d+)-(\d+)$/);if(o){const[,u,l]=o,s=parseInt(u,10),f=parseInt(l,10),g=f-s+1,N=F.length>0?parseInt(F[F.length-1],10):286;if(f>=N){alert("Already at the last block of this surah");return}const y=s+g,k=Math.min(N,y+g-1);j(`${y}-${k}`),E(1)}}},Gt=async()=>{try{wt(!0);const n=Mt.getEffectiveUserId(Rt);await Mt.addBlockInterpretationBookmark(n,p,d,xt,m,c),alert(`Saved interpretation for Surah ${p}, verses ${d}`)}catch(n){console.error("Failed to bookmark interpretation",n),alert("Failed to save interpretation bookmark")}finally{setTimeout(()=>wt(!1),300)}},Qt=async()=>{const n=`Interpretation ${m} — Surah ${p} • Range ${d}`,t=`${window.location.origin}/interpretation-blockwise?surahId=${p}&range=${d}&ipt=${m}&lang=${c}`;try{navigator.share?await navigator.share({title:document.title||"Thafheem",text:n,url:t}):(await navigator.clipboard.writeText(`${n}
${t}`),alert("Link copied to clipboard"))}catch(e){console.error("Share failed",e),alert("Share failed: "+e.message)}},[Xt,Ft]=h.useState(!1),[Zt,jt]=h.useState(1),te=()=>{const n=/^\d+/.exec(String(d))?.[0]||"1";jt(parseInt(n)),Ft(!0)},ht=n=>{if(!n||typeof n!="string")return n;const t=/\(?(\d+)\s*[:：]\s*(\d+)\)?/g;return n.replace(t,(e,r,i)=>e.includes("verse-reference-link")?e:`<span class="verse-reference-link inline-block cursor-pointer text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-600 dark:decoration-cyan-400/50 dark:hover:decoration-cyan-300 transition-colors" data-surah="${r}" data-ayah="${i}" title="Click to view Surah ${r}, Verse ${i}">${e}</span>`)},ee=n=>{if(n==null)return"";if(typeof n=="string")return ht(n);const t=["interpret_text","InterpretText","Interpret_Text","interpretation","Interpretation","text","Text","content","Content","meaning","Meaning","body","Body","desc","Desc","description","Description"];for(const e of t)if(typeof n[e]=="string"&&n[e].trim().length>0)return ht(n[e]);for(const[e,r]of Object.entries(n))if(typeof r=="string"&&r.trim().length>20)return ht(r);return console.warn("⚠️ No valid interpretation text found in item:",n),`<p class="text-gray-500 italic">No interpretation content available for interpretation ${m}</p>`},ne=document.getElementById("modal-root")||document.body;return ce.createPortal(b.jsxs(b.Fragment,{children:[b.jsx("style",{children:`
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
        `}),b.jsxs("div",{className:"fixed inset-0 z-[99999] flex items-end sm:items-center justify-center",children:[b.jsx("div",{className:"fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity",onClick:ut,style:{pointerEvents:pt?"none":"auto"}}),b.jsxs("div",{className:`relative w-full ${c==="E"||c==="en"?"sm:w-auto sm:max-w-2xl":"sm:w-auto sm:max-w-4xl xl:max-w-[1073px]"} ${c==="E"||c==="en"?"sm:max-h-[95vh]":"max-h-[85vh] sm:max-h-[90vh]"} bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-slideUp sm:animate-fadeIn ${c==="E"||c==="en"?"":"overflow-hidden"} ${pt?"animate-slideDown sm:animate-fadeOut":""}`,onClick:n=>n.stopPropagation(),style:{...c==="E"||c==="en"?{maxWidth:"42rem",minWidth:"min(90vw, 20rem)",height:"auto",maxHeight:"95vh"}:{}},children:[b.jsx("div",{className:"w-full flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing",onClick:ut,style:{pointerEvents:pt?"none":"auto"},children:b.jsx("div",{className:"w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"})}),b.jsx("div",{className:"flex-shrink-0 z-10 bg-white dark:bg-gray-900",children:b.jsx(pe,{interpretationNumber:m,surahName:xt,verseRange:d.replace(/-/g," - "),language:c,onClose:ut,onBookmark:Gt,onShare:Qt,onWordByWord:te,bookmarking:Vt,surahOptions:Wt,rangeOptions:F,onPickSurah:qt,onPickRange:Yt,onPrev:(c==="E"||c==="en")&&$&&B.length>0?Kt?Bt:null:Bt,onNext:(c==="E"||c==="en")&&$&&B.length>0?Jt?Ct:null:Ct,isModal:!0,hideTitle:!!$},`navbar-${p}-${d}-${m}`)}),b.jsxs("div",{className:`${c==="E"||c==="en"?"overflow-y-auto":"flex-1 overflow-y-auto"} px-4 sm:px-6 py-6 sm:py-8 ${c==="E"||c==="en"?"":"min-h-0"}`,style:{...c==="E"||c==="en"?{maxHeight:"calc(95vh - 120px)"}:{}},children:[yt&&b.jsx("div",{className:"flex items-center justify-center py-8",children:b.jsxs("div",{className:"text-center",children:[b.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"}),b.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"Loading interpretation..."})]})}),st&&b.jsxs("div",{className:"text-center py-8",children:[b.jsx("p",{className:"text-red-500 dark:text-red-400 text-lg mb-2",children:"Failed to load interpretation"}),b.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400 mb-4",children:st}),b.jsx("button",{onClick:()=>window.location.reload(),className:"px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors",children:"Try Again"})]}),!yt&&!st&&H.length===0&&b.jsx("div",{className:"text-center py-10 text-gray-600 dark:text-gray-300",children:"No interpretation found for this selection."}),b.jsx("div",{className:"font-poppins space-y-6 sm:space-y-8",children:H.map((n,t)=>{const e=c==="ur"||c==="urdu";return b.jsx("div",{className:"mb-6 sm:mb-8",children:b.jsx("div",{className:`interpretation-content text-gray-700 leading-relaxed dark:text-gray-300 text-sm sm:text-base prose dark:prose-invert max-w-none text-justify ${e?"font-urdu-nastaliq urdu-interpretation-content":""}`,ref:r=>kt.current[t]=r,onClick:Lt,style:{pointerEvents:"auto",position:"relative",zIndex:1,...e?{textAlign:"right",fontSize:"16px",lineHeight:"2.6",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"}:{textAlign:"justify"}},dir:e?"rtl":"ltr",dangerouslySetInnerHTML:{__html:ee(n)}})},`${p}-${d}-${m}-${n?.ID||n?.id||t}`)})},`block-${p}-${d}-${m}`)]}),Xt&&b.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-[100000] pt-24 sm:pt-28 lg:pt-32 p-4 overflow-hidden",children:b.jsx(le,{selectedVerse:Zt,surahId:p,onClose:()=>Ft(!1),onNavigate:jt,onSurahChange:()=>{}})})]})]}),b.jsx(oe,{isOpen:ct,onClose:()=>bt(!1),noteId:Nt.id,noteContent:Nt.content}),lt&&X.surahId&&X.verseId&&b.jsx(de,{surahId:X.surahId,verseId:X.verseId,onClose:()=>T(!1),interpretationNo:m,language:c})]}),ne)};export{xe as B};
