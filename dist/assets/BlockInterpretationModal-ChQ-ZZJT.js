import{a as pe,v as ue,j as I,N as _t,t as fe,ah as O,K as R,J as Dt,x as Rt,z as Wt}from"./index-D0NMIq43.js";import{b as f,c as he}from"./react-vendor-v5ei6ytj.js";import{s as Vt,a as zt,W as me,A as ge,M as ye,b as Ie,h as xe,p as ve,c as Ne}from"./WordByWord-CWAAPupz.js";import{I as ke}from"./InterpretationNavbar-6fKJEcm-.js";import Lt from"./hindiTranslationService-CFRwMbcP.js";import Ut from"./urduTranslationService-D6XDtXQ4.js";import yt from"./englishTranslationService-TExHbstj.js";const Be=({surahId:H,range:q,interpretationNo:J=1,language:Y="en",footnoteId:at=null,interpretationId:ot=null,onClose:Ht,blockRanges:_=[]})=>{const{user:qt}=pe?.()||{user:null},[It,xt]=f.useState(!0),[st,it]=f.useState(null),[L,W]=f.useState([]),[vt,Nt]=f.useState(""),[lt,kt]=f.useState(!1),[bt,K]=f.useState({id:"",content:null}),[ct,j]=f.useState(!1),[X,M]=f.useState({surahId:null,verseId:null}),wt=f.useRef([]),[Jt,St]=f.useState(!1),[Yt,Kt]=f.useState([]),[F,$t]=f.useState([]),[u,At]=f.useState(H),[p,T]=f.useState(q),[h,E]=f.useState(J),[s,Xt]=f.useState(Y),[$,G]=f.useState(at),[U,Gt]=f.useState(ot),[C,dt]=f.useState([]),[pt,Qt]=f.useState(!1),Et=f.useRef(!1),[Ct,ut]=f.useState({isOpen:!1,mediaId:null}),[Q,Z]=f.useState({isOpen:!1,noteId:null,noteName:null}),P=f.useCallback(n=>{if(n==null)return null;const t=String(n).trim();if(!t)return null;if(/^\d+$/.test(t)){const a=parseInt(t,10);return Number.isFinite(a)?{start:a,end:a,label:t}:null}const e=t.match(/^(\d+)\s*-\s*(\d+)$/);if(e){const a=parseInt(e[1],10),l=parseInt(e[2],10);if(Number.isFinite(a)&&Number.isFinite(l))return{start:a,end:l,label:a===l?`${a}`:`${a}-${l}`}}return null},[]),B=f.useMemo(()=>{if(!Array.isArray(_)||_.length===0)return[];const n=t=>{if(typeof t=="string"||typeof t=="number")return P(t);if(t&&typeof t=="object"){const e=t.AyaFrom??t.ayafrom??t.from??t.start??t.begin??t.AyaFromId,a=t.AyaTo??t.ayato??t.to??t.end??t.finish??t.AyaToId??e;if(e==null&&typeof t.Range=="string")return P(t.Range);if(e==null&&typeof t.range=="string")return P(t.range);const l=Number.parseInt(e,10),r=Number.parseInt(a,10);if(Number.isFinite(l)&&Number.isFinite(r))return{start:l,end:r,label:l===r?`${l}`:`${l}-${r}`}}return null};return _.map(t=>n(t)).filter(Boolean).sort((t,e)=>t.start-e.start).map((t,e)=>({...t,index:e}))},[_,P]),V=f.useCallback(async(n,t)=>{try{const[e,a]=t.includes("-")?t.split("-").map(r=>parseInt(r.trim(),10)):[parseInt(t,10),parseInt(t,10)],l=[];for(let r=e;r<=a;r++)try{const o=await yt.getAyahTranslation(n,r);if(o){const d=/<sup[^>]*foot_note="([^"]+)"[^>]*>(\d+)<\/sup>/g;let i;for(;(i=d.exec(o))!==null;){const c=i[1],g=parseInt(i[2],10);l.push({footnoteId:c,footnoteNumber:g,ayah:r})}}}catch(o){console.warn(`[BlockInterpretationModal] Failed to fetch translation for ayah ${r}:`,o)}return l.sort((r,o)=>r.ayah!==o.ayah?r.ayah-o.ayah:r.footnoteNumber-o.footnoteNumber),l}catch(e){return console.error("[BlockInterpretationModal] ❌ Error extracting footnotes from range:",e),[]}},[]),Bt=f.useCallback(async n=>{if(!B.length||!p)return!1;const t=P(p);if(!t)return!1;const e=B.findIndex(l=>l.label===t.label||l.start===t.start&&l.end===t.end);if(e===-1)return!1;let a=e+n;for(;a>=0&&a<B.length;){const l=B[a];try{const r=await V(u,l.label);if(Array.isArray(r)&&r.length>0){const o=n>0?r[0]:r[r.length-1];return T(l.label),G(o.footnoteId),E(o.footnoteNumber),dt(r),!0}}catch(r){console.warn(`[BlockInterpretationModal] Failed to load footnotes for block ${l.label}:`,r)}a+=n}return!1},[B,p,u,V,P]);f.useEffect(()=>(document.body.style.overflow="hidden",()=>{document.body.style.overflow=""}),[]),f.useEffect(()=>(Vt(n=>ut({isOpen:!0,mediaId:n}),()=>ut({isOpen:!1,mediaId:null})),()=>Vt(null,null)),[]),f.useEffect(()=>(zt(async n=>{try{const t=await Wt(n),e=t?.NoteName||null,a=t?.NoteText||t?.note_text||t?.content||t?.html||t?.text||t?.body||t?.description||t?.note||null;Z({isOpen:!0,noteId:n,noteName:e,noteText:a})}catch(t){console.error(`Failed to fetch note ${n}:`,t.message),Z({isOpen:!0,noteId:n,noteName:null,noteText:'<p style="color: #666;">Note content is temporarily unavailable. Please try again later.</p>'})}},()=>Z({isOpen:!1,noteId:null,noteName:null,noteText:null})),()=>zt(null,null)),[]),f.useEffect(()=>{At(H),T(q),E(J),Xt(Y),G(at)},[H,q,J,Y,at]),f.useEffect(()=>{Gt(ot)},[H,q,J,Y,ot]);const ft=n=>{n&&(n.preventDefault(),n.stopPropagation()),!Et.current&&(Et.current=!0,Qt(!0),setTimeout(()=>{Ht()},200))};f.useEffect(()=>{u&&(async()=>{try{const t=await fe();Kt(t.map(a=>({value:a.id,label:`${a.id}- ${a.english||"Surah"}`})));const e=t.find(a=>a.id===Number(u));Nt(`${u}- ${e?.english||"Surah"}`)}catch{Nt(`${u}- Surah`)}})()},[u]),f.useEffect(()=>{let n=!0;return(async()=>{try{const t=await ue();if(!n)return;const a=t.find(r=>r.number===Number(u))?.ayahs||286,l=Array.from({length:a},(r,o)=>String(o+1));$t(l)}catch{n&&$t(Array.from({length:50},(e,a)=>String(a+1)))}})(),()=>{n=!1}},[u]),f.useEffect(()=>{(async()=>{if(!(!u||!p))try{xt(!0),it(null),W([]);let t;if(s==="mal")if(/^\d+$/.test(p)){const o=await O(u,parseInt(p,10),"mal");if(h&&o.length>0){const d=o.filter(i=>i.InterpretationNo===String(h)||i.interptn_no===h);t=d.length>0?d:[o[0]]}else t=o}else t=await R(u,p,h,"mal");else if(s==="hi")if(/^\d+$/.test(p)){const o=await Lt.getExplanation(u,parseInt(p,10));t=o&&o!=="N/A"?[{Interpretation:o,AudioIntrerptn:o,text:o,content:o,InterpretationNo:h}]:[]}else{const[o,d]=p.split("-").map(c=>parseInt(c.trim(),10));t=(await Lt.fetchBlockwiseHindi(u,o,d)).map(c=>({Interpretation:c.explanation,AudioIntrerptn:c.explanation,text:c.explanation,content:c.explanation,InterpretationNo:h,ayah:c.ayah}))}else if(s==="ur")if(/^\d+$/.test(p)){const o=await Ut.getExplanation(u,parseInt(p,10));t=o&&o!=="N/A"?[{Interpretation:o,AudioIntrerptn:o,text:o,content:o,InterpretationNo:h}]:[]}else{const[o,d]=p.split("-").map(c=>parseInt(c.trim(),10));t=(await Ut.fetchBlockwiseUrdu(u,o,d)).map(c=>({Interpretation:c.translation,AudioIntrerptn:c.translation,text:c.translation,content:c.translation,InterpretationNo:h,ayah:c.ayah}))}else if(s==="E"||s==="en")if($||U)try{let r="";U?r=await yt.getInterpretationById(U):$&&(r=await yt.getExplanation(parseInt($,10))),t=r&&r!=="N/A"?[{Interpretation:r,AudioIntrerptn:r,text:r,content:r,InterpretationNo:String(h),footnoteId:$,interpretationId:U}]:[]}catch(r){throw console.error("[BlockInterpretationModal] ❌ Error fetching English interpretation:",{error:r,message:r?.message,footnoteId:$,interpretationId:U}),r}else{const r=/^\d+$/.test(p),o="E";try{r?t=await Dt(u,parseInt(p,10),h,o):t=await R(u,p,h,o)}catch(d){throw console.error("[BlockInterpretationModal] ❌ Error fetching interpretation:",{error:d,message:d?.message,surahId:u,range:p,interpretationNo:h,langCode:o}),d}}else{const r=/^\d+$/.test(p),o=s;try{r?t=await Dt(u,parseInt(p,10),h,o):t=await R(u,p,h,o)}catch(d){throw console.error("[BlockInterpretationModal] ❌ Error fetching interpretation:",d),d}}const e=Array.isArray(t)?t:t?[t]:[];if(!(e.length>0&&e[0]&&(e[0].Interpretation&&e[0].Interpretation!==""&&e[0].Interpretation!==null&&e[0].Interpretation!==void 0||e[0].InterpretationText&&e[0].InterpretationText!==""&&e[0].InterpretationText!==null&&e[0].InterpretationText!==void 0||e[0].interpret_text&&e[0].interpret_text!==""&&e[0].interpret_text!==null&&e[0].interpret_text!==void 0||e[0].text&&e[0].text!==""&&e[0].text!==null&&e[0].text!==void 0))){const r=p.match(/^(\d+)(?:-(\d+))?$/),o=r?parseInt(r[1],10):null,d=r&&r[2]?parseInt(r[2],10):o,i=o===d;let c=!1;if(o&&(s==="mal"||s==="E"||s==="en"))try{if(i){const m=await O(u,o,s==="E"||s==="en"?"E":"mal");if(m&&m.length>0){const k=(N,w)=>{const v=[N.InterpretationNo,N.interpretationNo,N.interptn_no,N.resolvedInterpretationNo,w+1];for(const A of v){const S=parseInt(String(A),10);if(!isNaN(S)&&S>=1&&S<=20)return S}return w+1<=20?w+1:1};let y=m.find((N,w)=>k(N,w)===h);y||(y=m[0]);const b=m.indexOf(y),x=k(y,b);E(x),W([y]),c=!0;return}}else{const m=await O(u,o,s==="E"||s==="en"?"E":"mal");if(m&&m.length>0){const k=(y,b)=>{const x=[y.InterpretationNo,y.interpretationNo,y.interptn_no,y.resolvedInterpretationNo,b+1];for(const N of x){const w=parseInt(String(N),10);if(!isNaN(w)&&w>=1&&w<=20)return w}return b+1<=20?b+1:1};for(let y=0;y<m.length;y++){const b=m[y],x=k(b,y);if(x===h)try{const w=await R(u,p,x,s==="E"||s==="en"?"E":"mal"),v=Array.isArray(w)?w:[w];if(v.length>0&&v[0]&&Object.keys(v[0]).length>0&&(v[0].Interpretation||v[0].interpret_text||v[0].text||"").trim()!==""){E(x),W(v),c=!0;return}}catch{}}}}}catch(g){console.warn("Failed to check available interpretations:",g)}if(!c&&h&&_&&_.length>0)try{const g=s==="E"||s==="en"?"E":"mal";for(const m of _){const k=m.AyaFrom||m.ayafrom||m.from||1,y=m.AyaTo||m.ayato||m.to||k,b=k===y?String(k):`${k}-${y}`;if(b!==p)try{let x=null;if(k===y){const N=await O(u,k,g);if(N&&N.length>0){const w=(A,S)=>{const D=[A.InterpretationNo,A.interpretationNo,A.interptn_no,A.resolvedInterpretationNo,S+1];for(const gt of D){const z=parseInt(String(gt),10);if(!isNaN(z)&&z>=1&&z<=20)return z}return S+1<=20?S+1:1},v=N.find((A,S)=>w(A,S)===h);v&&(x=[v])}}else{x=await R(u,b,h,g);const N=Array.isArray(x)?x:[x];N.length>0&&N[0]&&Object.keys(N[0]).length>0&&(N[0].Interpretation||N[0].interpret_text||N[0].text||"").trim()!==""?x=N:x=null}if(x&&x.length>0){T(b),W(x),c=!0;return}}catch{continue}}}catch(g){console.warn("Failed to search across blocks:",g)}if(!c)if(h!==1){E(1);return}else it(`No interpretation available for verses ${p}.`),W([])}else W(e)}catch(t){console.error(`[BlockInterpretationModal] ❌ Failed to load interpretation ${h}:`,{error:t,message:t?.message,stack:t?.stack,surahId:u,range:p,interpretationNo:h,language:s});let e="Failed to load interpretation";t.message?.includes("500")?e=`Server error loading interpretation ${h}. Please try again later.`:t.message?.includes("404")?e=`Interpretation ${h} not found for this selection.`:t.message?.includes("network")||t.message?.includes("fetch")?e="Network error. Please check your connection.":e=`Interpretation ${h} is not available.`,it(e)}finally{xt(!1)}})()},[u,p,h,s,$]);const tt=()=>{s!=="mal"&&wt.current.forEach(n=>{if(!n)return;n.querySelectorAll("sup, a").forEach(e=>{const a=(e.innerText||e.textContent||"").trim();a&&(e.style.removeProperty("color"),e.style.removeProperty("text-decoration"),e.style.removeProperty("cursor"),e.style.removeProperty("font-weight"),(/^\(?\d+\s*[:：]\s*\d+\)?$/.test(a)||/^\d+\s*[:：]\s*\d+$/.test(a)||/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*\d+\s+\d+:\d+/.test(a)||/സൂക്തം:\s*\d+\s+\d+:\d+/.test(a))&&(e.setAttribute("data-type","verse"),e.setAttribute("data-value",a),e.onclick=Tt))})})};f.useEffect(()=>{L.length>0&&(tt(),setTimeout(tt,100))},[L]),f.useEffect(()=>{!lt&&!ct&&L.length>0&&(tt(),setTimeout(tt,100))},[lt,ct]);const Ft=async n=>{K({id:n,content:"Loading..."}),kt(!0);try{const t=await Wt(n),e=t?.NoteText||t?.note_text||t?.content||t?.html||t?.text||t?.body||t?.description||t?.note||(typeof t=="string"?t:null);K(e&&e!=="Note content not available"?{id:n,content:e}:{id:n,content:'<p style="color: #666;">Note content is not available.</p>'})}catch(t){console.error(`Failed to fetch note ${n}:`,t.message),K({id:n,content:`
          <div class="note-content">
            <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note ${n}</h3>
            <p style="color: #666;">Note content is temporarily unavailable. Please try again later.</p>
            <p style="color: #999; font-size: 0.9em; margin-top: 10px;">Error: ${t.message||"Unknown error"}</p>
          </div>
        `})}},Tt=n=>{n.preventDefault(),n.stopPropagation();const t=n.target,e=t.getAttribute("data-type"),a=t.getAttribute("data-value"),l=t.innerText||t.textContent||"";if(!l)return;if(e==="verse"||e==="range"){const d=a||l,i=d.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/)||d.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);if(i){const[,g,m]=i;M({surahId:parseInt(g,10),verseId:parseInt(m,10)}),j(!0);return}const c=d.match(/^\(?(\d+)\s*[:：]\s*(\d+)\)?$/);if(c){const[,g,m]=c;M({surahId:parseInt(g,10),verseId:parseInt(m,10)}),j(!0);return}}else if(e==="note"){Ft(a||l);return}const r=l.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/)||l.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);if(r){const[,d,i]=r;M({surahId:parseInt(d,10),verseId:parseInt(i,10)}),j(!0);return}const o=l.match(/^\(?(\d+)\s*[:：]\s*(\d+)\)?$/);if(o){const[,d,i]=o;M({surahId:parseInt(d,10),verseId:parseInt(i,10)}),j(!0);return}Ft(l)},Zt=n=>{const t=n.target;if(t.closest(".malayalam-note-link")){Ie(n);return}if(t.closest(".malayalam-media-link")){xe(n);return}const l=t.closest(".verse-reference-link");if(l){n.preventDefault(),n.stopPropagation();const d=l.getAttribute("data-surah"),i=l.getAttribute("data-ayah");if(d&&i){M({surahId:parseInt(d,10),verseId:parseInt(i,10)}),j(!0);return}}if(t.tagName==="SUP"||t.tagName==="A"){Tt(n);return}if(s!=="mal"){const i=(t.innerText||t.textContent||"").match(/\(?(\d+)\s*[:：]\s*(\d+)\)?/);if(i){const[,c,g]=i;M({surahId:parseInt(c,10),verseId:parseInt(g,10)}),j(!0);return}}const r=clickedText.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/)||clickedText.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);if(r){const[,d,i]=r;M({surahId:parseInt(d,10),verseId:parseInt(i,10)}),j(!0);return}const o=clickedText.match(/\(?(\d+)\s*[:：]\s*(\d+)\)?/);if(o){const[,d,i]=o;M({surahId:parseInt(d,10),verseId:parseInt(i,10)}),j(!0);return}},te=n=>{At(parseInt(n,10))},ee=n=>{T(String(n))};f.useEffect(()=>{(s==="E"||s==="en")&&$&&p?(async()=>{const t=await V(u,p);dt(t)})():dt([])},[u,p,s,$,V]);const ht=f.useCallback(async n=>{if(!B.length||!p)return!1;const t=P(p);if(!t)return!1;const e=B.findIndex(l=>l.label===t.label||l.start===t.start&&l.end===t.end);if(e===-1)return!1;let a=e+n;for(;a>=0&&a<B.length;){const l=B[a];try{const r=await V(u,l.label);if(Array.isArray(r)&&r.length>0)return!0}catch{}a+=n}return!1},[B,p,u,V,P]),[ne,et]=f.useState(!0),[re,nt]=f.useState(!0);f.useEffect(()=>{if((s==="E"||s==="en")&&$&&B.length>0){let n=!1;return(async()=>{if(C.length===0){et(!0),nt(!0);return}const e=C.findIndex(r=>r.footnoteId===$);if(e>=0&&e<C.length-1)n||et(!0);else{const r=await ht(1);n||et(r)}if(e>0)n||nt(!0);else{const r=await ht(-1);n||nt(r)}})(),()=>{n=!0}}else et(!0),nt(!0)},[s,$,C,B,ht]);const jt=async()=>{if((s==="E"||s==="en")&&$){if(C.length===0)console.warn("[BlockInterpretationModal] ⚠️ No footnotes loaded for range:",p);else{const e=C.findIndex(a=>a.footnoteId===$);if(e>0){const a=C[e-1];G(a.footnoteId),E(a.footnoteNumber);return}}if(await Bt(-1))return}if(h>1){E(h-1);return}const n=String(p);if(/^\d+$/.test(n)){const t=parseInt(n,10);if(t<=1){alert("Already at the first verse");return}const e=t-1;if(T(String(e)),s==="mal")try{const a=await O(u,e,"mal");if(a&&a.length>0){const l=a[a.length-1],r=(i,c)=>{const g=[i.InterpretationNo,i.interpretationNo,i.interptn_no,i.resolvedInterpretationNo,c+1];for(const m of g){const k=parseInt(String(m),10);if(!isNaN(k)&&k>=1&&k<=20)return k}return c+1<=20?c+1:1},o=a.length-1,d=r(l,o);E(d)}}catch(a){console.warn("Failed to fetch available interpretations for previous verse:",a)}}else if(/^(\d+)-(\d+)$/.test(n)){const t=n.match(/^(\d+)-(\d+)$/);if(t){const[,e,a]=t,l=parseInt(e,10),o=parseInt(a,10)-l+1;if(l<=1){alert("Already at the first block");return}const d=Math.max(1,l-o),i=d+o-1;if(T(`${d}-${i}`),s==="mal")try{const c=await O(u,d,"mal");if(c&&c.length>0){const g=c[c.length-1],m=(b,x)=>{const N=[b.InterpretationNo,b.interpretationNo,b.interptn_no,b.resolvedInterpretationNo,x+1];for(const w of N){const v=parseInt(String(w),10);if(!isNaN(v)&&v>=1&&v<=20)return v}return x+1<=20?x+1:1},k=c.length-1,y=m(g,k);E(y)}}catch(c){console.warn("Failed to fetch available interpretations for previous block:",c)}}}},Mt=async()=>{if((s==="E"||s==="en")&&$){if(C.length===0)console.warn("[BlockInterpretationModal] ⚠️ No footnotes loaded for range:",p);else{const d=C.findIndex(i=>i.footnoteId===$);if(d>=0&&d<C.length-1){const i=C[d+1];G(i.footnoteId),E(i.footnoteNumber);return}}if(await Bt(1))return}const n=h+1,t=p.match(/^(\d+)(?:-(\d+))?$/),e=t?parseInt(t[1],10):null,a=t&&t[2]?parseInt(t[2],10):e,l=e===a;if(e&&s==="mal")try{let o=!1;if(l){const i=await O(u,e,"mal");if(i&&i.length>0){const c=(g,m)=>{const k=[g.InterpretationNo,g.interpretationNo,g.interptn_no,g.resolvedInterpretationNo,m+1];for(const y of k){const b=parseInt(String(y),10);if(!isNaN(b)&&b>=1&&b<=20)return b}return m+1<=20?m+1:1};for(let g=0;g<i.length;g++)if(c(i[g],g)===n){o=!0;break}}}else try{const i=await R(u,p,n,"mal"),c=Array.isArray(i)?i:[i];c.length>0&&c[0]&&Object.keys(c[0]).length>0&&(c[0].Interpretation||c[0].interpret_text||c[0].text||"").trim()!==""&&(o=!0)}catch{o=!1}if(o){E(n);return}const d=String(p);if(/^(\d+)-(\d+)$/.test(d)){const i=d.match(/^(\d+)-(\d+)$/);if(i){const[,c,g]=i,m=parseInt(c,10),k=parseInt(g,10),y=k-m+1,b=F.length>0?parseInt(F[F.length-1],10):286;if(k<b){const x=m+y,N=Math.min(b,x+y-1),w=`${x}-${N}`;try{if(x===N){const v=await O(u,x,"mal");if(v&&v.length>0){const A=(S,D)=>{const gt=[S.InterpretationNo,S.interpretationNo,S.interptn_no,S.resolvedInterpretationNo,D+1];for(const z of gt){const rt=parseInt(String(z),10);if(!isNaN(rt)&&rt>=1&&rt<=20)return rt}return D+1<=20?D+1:1};for(let S=0;S<v.length;S++)if(A(v[S],S)===n){T(w),E(n);return}}}else{const v=await R(u,w,n,"mal"),A=Array.isArray(v)?v:[v];if(A.length>0&&A[0]&&Object.keys(A[0]).length>0&&(A[0].Interpretation||A[0].interpret_text||A[0].text||"").trim()!==""){T(w),E(n);return}}}catch{}}}}}catch(o){console.warn("Failed to fetch available interpretations for next:",o)}const r=String(p);if(/^\d+$/.test(r)){const o=parseInt(r,10),d=F.length>0?parseInt(F[F.length-1],10):286;if(o>=d){alert("Already at the last verse of this surah");return}const i=o+1;T(String(i)),E(1)}else if(/^(\d+)-(\d+)$/.test(r)){const o=r.match(/^(\d+)-(\d+)$/);if(o){const[,d,i]=o,c=parseInt(d,10),g=parseInt(i,10),m=g-c+1,k=F.length>0?parseInt(F[F.length-1],10):286;if(g>=k){alert("Already at the last block of this surah");return}const y=c+m,b=Math.min(k,y+m-1);T(`${y}-${b}`),E(1)}}},ae=async()=>{try{St(!0);const n=Rt.getEffectiveUserId(qt);await Rt.addBlockInterpretationBookmark(n,u,p,vt,h,s),alert(`Saved interpretation for Surah ${u}, verses ${p}`)}catch(n){console.error("Failed to bookmark interpretation",n),alert("Failed to save interpretation bookmark")}finally{setTimeout(()=>St(!1),300)}},oe=async()=>{const n=`Interpretation ${h} — Surah ${u} • Range ${p}`,t=`${window.location.origin}/interpretation-blockwise?surahId=${u}&range=${p}&ipt=${h}&lang=${s}`;try{navigator.share?await navigator.share({title:document.title||"Thafheem",text:n,url:t}):(await navigator.clipboard.writeText(`${n}
${t}`),alert("Link copied to clipboard"))}catch(e){console.error("Share failed",e),alert("Share failed: "+e.message)}},[se,Pt]=f.useState(!1),[ie,Ot]=f.useState(1),le=()=>{const n=/^\d+/.exec(String(p))?.[0]||"1";Ot(parseInt(n)),Pt(!0)},mt=n=>{if(!n||typeof n!="string")return n;const t=/\(?(\d+)\s*[:：]\s*(\d+)\)?/g;let e=n.replace(t,(a,l,r)=>a.includes("verse-reference-link")?a:`<span class="verse-reference-link inline-block cursor-pointer text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-600 dark:decoration-cyan-400/50 dark:hover:decoration-cyan-300 transition-colors" data-surah="${l}" data-ayah="${r}" title="Click to view Surah ${l}, Verse ${r}">${a}</span>`);return s==="mal"&&(e=ve(e),e=Ne(e)),e},ce=n=>{if(n==null)return"";if(typeof n=="string")return mt(n);const t=["interpret_text","InterpretText","Interpret_Text","interpretation","Interpretation","text","Text","content","Content","meaning","Meaning","body","Body","desc","Desc","description","Description"];for(const e of t)if(typeof n[e]=="string"&&n[e].trim().length>0)return mt(n[e]);for(const[e,a]of Object.entries(n))if(typeof a=="string"&&a.trim().length>20)return mt(a);return console.warn("⚠️ No valid interpretation text found in item:",n),`<p class="text-gray-500 italic">No interpretation content available for interpretation ${h}</p>`},de=document.getElementById("modal-root")||document.body;return he.createPortal(I.jsxs(I.Fragment,{children:[I.jsx("style",{children:`
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
        
        /* Word wrapping for interpretation content to prevent horizontal overflow */
        .interpretation-content,
        .interpretation-content * {
          overflow-wrap: break-word !important;
          word-break: break-word !important;
          max-width: 100% !important;
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
        .urdu-interpretation-content a {
          font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
          text-align: right !important;
        }
        .urdu-interpretation-content * {
          font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
        }
        
        /* Urdu interpretation link (superscript) styling - matching Malayalam style */
        .urdu-interpretation-content sup.interpretation-link,
        .urdu-interpretation-content sup[data-interpretation],
        .urdu-interpretation-content sup.urdu-footnote-link,
        .urdu-interpretation-content sup[data-footnote-id] {
          cursor: pointer !important;
          background-color: transparent !important;
          color: rgb(41, 169, 199) !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          border: none !important;
          display: inline !important;
          font-size: 12px !important;
          vertical-align: super !important;
          line-height: 1 !important;
          position: relative !important;
          top: 3px !important;
          z-index: 10 !important;
          transition: 0.2s ease-in-out !important;
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
          color: #0891b2 !important;
        }
        .urdu-interpretation-content sup.interpretation-link:active,
        .urdu-interpretation-content sup[data-interpretation]:active,
        .urdu-interpretation-content sup.urdu-footnote-link:active,
        .urdu-interpretation-content sup[data-footnote-id]:active {
          color: #0e7490 !important;
        }
        `}),I.jsxs("div",{className:"fixed inset-0 z-[99999] flex items-end sm:items-center justify-center",children:[I.jsx("div",{className:"fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity",onClick:ft,style:{pointerEvents:pt?"none":"auto"}}),I.jsxs("div",{className:`relative w-full ${s==="E"||s==="en"?"sm:w-auto sm:max-w-2xl":"sm:w-auto sm:max-w-4xl xl:max-w-[1073px]"} ${s==="E"||s==="en"?"sm:max-h-[95vh]":"max-h-[85vh] sm:max-h-[90vh]"} bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-slideUp sm:animate-fadeIn ${s==="E"||s==="en"?"":"overflow-hidden"} ${pt?"animate-slideDown sm:animate-fadeOut":""}`,onClick:n=>n.stopPropagation(),style:{...s==="E"||s==="en"?{maxWidth:"42rem",minWidth:"min(90vw, 20rem)",height:"auto",maxHeight:"95vh"}:{}},children:[I.jsx("div",{className:"w-full flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing",onClick:ft,style:{pointerEvents:pt?"none":"auto"},children:I.jsx("div",{className:"w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"})}),I.jsx("div",{className:"flex-shrink-0 z-10 bg-white dark:bg-gray-900",children:I.jsx(ke,{interpretationNumber:h,surahName:vt,verseRange:p.replace(/-/g," - "),language:s,onClose:ft,onBookmark:ae,onShare:oe,onWordByWord:le,bookmarking:Jt,surahOptions:Yt,rangeOptions:F,onPickSurah:te,onPickRange:ee,onPrev:(s==="E"||s==="en")&&$&&C.length>0?re?jt:null:jt,onNext:(s==="E"||s==="en")&&$&&C.length>0?ne?Mt:null:Mt,isModal:!0,hideTitle:!!$},`navbar-${u}-${p}-${h}`)}),I.jsxs("div",{className:`${s==="E"||s==="en"?"overflow-y-auto":"flex-1 overflow-y-auto"} px-4 sm:px-6 py-6 sm:py-8 ${s==="E"||s==="en"?"":"min-h-0"}`,style:{overflowX:"hidden",...s==="E"||s==="en"?{maxHeight:"calc(95vh - 120px)"}:{}},children:[It&&I.jsx("div",{className:"flex items-center justify-center py-8",children:I.jsxs("div",{className:"text-center",children:[I.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"}),I.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"Loading interpretation..."})]})}),st&&I.jsxs("div",{className:"text-center py-8",children:[I.jsx("p",{className:"text-red-500 dark:text-red-400 text-lg mb-2",children:"Failed to load interpretation"}),I.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400 mb-4",children:st}),I.jsx("button",{onClick:()=>window.location.reload(),className:"px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors",children:"Try Again"})]}),!It&&!st&&L.length===0&&I.jsx("div",{className:"text-center py-10 text-gray-600 dark:text-gray-300",children:"No interpretation found for this selection."}),I.jsx("div",{className:"font-poppins space-y-6 sm:space-y-8",children:L.map((n,t)=>{const e=s==="ur"||s==="urdu";return I.jsx("div",{className:"mb-6 sm:mb-8",children:I.jsx("div",{className:`interpretation-content text-gray-700 leading-relaxed dark:text-gray-300 text-sm sm:text-base prose dark:prose-invert max-w-none text-justify ${e?"font-urdu-nastaliq urdu-interpretation-content":""}`,ref:a=>wt.current[t]=a,onClick:Zt,style:{pointerEvents:"auto",position:"relative",zIndex:1,overflowWrap:"break-word",wordBreak:"break-word",maxWidth:"100%",...e?{textAlign:"right",fontSize:"16px",lineHeight:"2.6",fontFamily:"'Noto Nastaliq Urdu', 'JameelNoori', serif"}:{textAlign:"justify"}},dir:e?"rtl":"ltr",dangerouslySetInnerHTML:{__html:ce(n)}})},`${u}-${p}-${h}-${n?.ID||n?.id||t}`)})},`block-${u}-${p}-${h}`)]}),se&&I.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-[100000] pt-24 sm:pt-28 lg:pt-32 p-4 overflow-hidden",children:I.jsx(me,{selectedVerse:ie,surahId:u,onClose:()=>Pt(!1),onNavigate:Ot,onSurahChange:()=>{}})})]})]}),I.jsx(_t,{isOpen:lt,onClose:()=>kt(!1),noteId:bt.id,noteContent:bt.content}),I.jsx(_t,{isOpen:Q.isOpen,onClose:()=>Z({isOpen:!1,noteId:null,noteName:null,noteText:null}),noteId:Q.noteId,noteContent:Q.noteText,noteName:Q.noteName}),ct&&X.surahId&&X.verseId&&I.jsx(ge,{surahId:X.surahId,verseId:X.verseId,onClose:()=>j(!1),interpretationNo:h,language:s}),I.jsx(ye,{isOpen:Ct.isOpen,onClose:()=>ut({isOpen:!1,mediaId:null}),mediaId:Ct.mediaId})]}),de)};export{Be as B};
