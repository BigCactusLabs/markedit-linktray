"use strict";const S=require("markedit-api");function f(e){const r=c(e);return r==="/"?[]:r.replace(/^\/+/,"").split("/")}function c(e){const r=e.replaceAll("\\","/"),t=r.startsWith("/"),n=[];for(const i of r.split("/"))if(!(!i||i===".")){if(i===".."){if(n.length>0&&n[n.length-1]!==".."){n.pop();continue}t||n.push(i);continue}n.push(i)}return n.length===0?t?"/":".":`${t?"/":""}${n.join("/")}`}function g(e){const r=c(e);if(r==="/"||r===".")return r;const t=r.lastIndexOf("/");return t<0?".":t===0?"/":r.slice(0,t)}function L(e){const r=c(e);if(r==="/"||r===".")return r;const t=r.lastIndexOf("/");return t<0?r:r.slice(t+1)}function P(...e){return c(e.filter(Boolean).join("/"))}function z(e,r){const t=c(r);return t.startsWith("/")?t:c(`${c(e)}/${t}`)}function b(e,r){const t=f(e),n=f(r);let i=0;for(;i<t.length&&i<n.length&&t[i]===n[i];)i+=1;const a=Array.from({length:t.length-i},()=>".."),o=n.slice(i);return[...a,...o].join("/")||"."}function E(e){const r=new Set;return[...e].sort((t,n)=>t.index-n.index).flatMap(t=>r.has(t.resolvedPath)?[]:(r.add(t.resolvedPath),[I(t)]))}function I(e){const r={status:e.exists?"existing":"missing",filename:L(e.resolvedPath),displayPath:e.displayPath,resolvedPath:e.resolvedPath};return e.exists?{...r,openPath:e.resolvedPath}:r}const M=/\[([^\]]+)\]\(([^)\s]+)\)/g,T=/\[\[([^[\]]+)\]\]/g;function $(e){return[...A(e),...F(e)].sort((t,n)=>t.index-n.index)}function A(e){return Array.from(e.matchAll(M),r=>{const t=r[0],n=r[2],i=n.trim(),a=r.index??0;return x(i)?{kind:"markdown",original:t,rawTarget:n,normalizedTarget:i,index:a}:null}).filter(r=>r!==null)}function F(e){return Array.from(e.matchAll(T),r=>{const t=r[0],n=r[1].split("|",1)[0].trim();return n?{kind:"wiki",original:t,rawTarget:n,normalizedTarget:R(n),index:r.index??0}:null}).filter(r=>r!==null)}function x(e){return e.toLowerCase().endsWith(".md")}function R(e){return x(e)?e:`${e}.md`}function D({currentFilePath:e,rawTarget:r,kind:t}){const n=g(c(e)),i=N(r,t);return z(n,i)}function j({currentFilePath:e,resolvedTargetPath:r,repoRootPath:t}){const n=c(r);return b(t?c(t):g(c(e)),n)}function N(e,r){const t=c(e.trim());return r==="wiki"&&!t.toLowerCase().endsWith(".md")?`${t}.md`:t}const C=".linktray-overlay{position:fixed;inset:0;z-index:10001;display:grid;place-items:start center;padding:clamp(3rem,10vh,7rem) 1rem 1.5rem;background:linear-gradient(to bottom,#edf1f7c7,#edf1f7e0);backdrop-filter:blur(6px)}.linktray-panel{width:min(43rem,100%);max-height:min(78vh,42rem);display:grid;grid-template-rows:auto auto minmax(0,1fr);border:1px solid rgba(63,77,93,.14);border-radius:18px;background:#f6f9fc;font-family:SF Pro Text,SF Pro Display,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;box-shadow:0 22px 52px #1a26341f,0 1px #ffffffb3 inset;overflow:hidden}.linktray-toolbar{display:grid;gap:.28rem;padding:.82rem .98rem .72rem;border-bottom:1px solid rgba(63,77,93,.1);background:linear-gradient(to bottom,#fffc,#f3f6faeb)}.linktray-toolbar__eyebrow{font-size:.65rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4e5f72d1}.linktray-toolbar__headline{display:flex;align-items:baseline;justify-content:space-between;gap:1rem}.linktray-toolbar__title{margin:0;font-size:clamp(.98rem,.92rem + .36vw,1.12rem);font-weight:640;letter-spacing:-.015em;color:#131f2c}.linktray-toolbar__count{font-size:.75rem;color:#48586adb;font-variant-numeric:tabular-nums}.linktray-searchRow{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:.62rem;padding:.72rem .98rem .8rem;border-bottom:1px solid rgba(63,77,93,.1)}.linktray-searchRow__label{font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4e5f72c7}.linktray-search{width:100%;border:0;outline:0;padding:0;background:transparent;color:#1c2836;font:inherit;font-size:.92rem}.linktray-search::placeholder{color:#677688c7}.linktray-body{overflow:auto;scrollbar-gutter:stable;overscroll-behavior:contain}.linktray-sectionLabel{display:block;padding:.68rem .98rem .45rem;font-size:.66rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4e5f72c7}.linktray-list{list-style:none;margin:0;padding:0}.linktray-summary{display:flex;align-items:center;justify-content:space-between;gap:.75rem;width:100%;padding:.76rem .98rem;border:0;border-top:1px solid rgba(63,77,93,.08);background:transparent;color:#233140;font:inherit;text-align:left}.linktray-summary__label{font-size:.82rem;font-weight:620}.linktray-summary__meta{font-size:.74rem;color:#4e5f72d1}.linktray-summary.linktray-item--selected{background:#44679114}.linktray-item{display:grid;grid-template-columns:auto minmax(0,1fr);gap:.14rem .72rem;align-items:start;padding:.78rem .98rem;border-left:3px solid transparent;transition:background-color .14s ease,border-color .14s ease,opacity .14s ease}.linktray-item+.linktray-item,.linktray-list+.linktray-sectionLabel,.linktray-summary+.linktray-sectionLabel,.linktray-summary+.linktray-list{border-top:1px solid rgba(63,77,93,.08)}.linktray-item__body{display:grid;gap:.12rem}.linktray-item__symbol{width:.48rem;height:.48rem;margin-top:.38rem;border-radius:999px}.linktray-item__symbol--existing{background:#58a884;box-shadow:0 0 0 3px #58a8841f;animation:linktray-status-pulse 2.8s ease-in-out infinite}.linktray-item__symbol--missing{border:1.5px solid rgba(191,88,88,.72);background:#bf585824}.linktray-item--selected{border-left-color:#3565a4e6;background:#44679114}.linktray-item__filename{font-size:.92rem;font-weight:620;letter-spacing:-.01em;color:#141f2b}.linktray-item__path{color:#4f5d6eeb;font-size:.79rem}.linktray-item--missing{opacity:.62}.linktray-empty{margin:0;padding:1rem .98rem 1.15rem;color:#4f5d6ee6;font-size:.84rem}@keyframes linktray-status-pulse{0%,to{box-shadow:0 0 0 3px #58a8841a;opacity:.9}50%{box-shadow:0 0 0 5px #58a88429;opacity:1}}@media(prefers-reduced-motion:reduce){.linktray-item__symbol--existing{animation:none}}",O=`
.linktray-overlay {
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: grid;
  place-items: start center;
  padding: clamp(3rem, 10vh, 7rem) 1rem 1.5rem;
  background:
    linear-gradient(to bottom, rgba(237, 241, 247, 0.78), rgba(237, 241, 247, 0.88));
  backdrop-filter: blur(6px);
}

.linktray-panel {
  width: min(43rem, 100%);
  max-height: min(78vh, 42rem);
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  border: 1px solid rgba(63, 77, 93, 0.14);
  border-radius: 18px;
  background: rgb(246, 249, 252);
  font-family:
    "SF Pro Text",
    "SF Pro Display",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  box-shadow:
    0 22px 52px rgba(26, 38, 52, 0.12),
    0 1px 0 rgba(255, 255, 255, 0.7) inset;
  overflow: hidden;
}

.linktray-toolbar {
  display: grid;
  gap: 0.28rem;
  padding: 0.82rem 0.98rem 0.72rem;
  border-bottom: 1px solid rgba(63, 77, 93, 0.1);
  background:
    linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(243, 246, 250, 0.92));
}

.linktray-toolbar__eyebrow {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(78, 95, 114, 0.82);
}

.linktray-toolbar__headline {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.linktray-toolbar__title {
  margin: 0;
  font-size: clamp(0.98rem, 0.92rem + 0.36vw, 1.12rem);
  font-weight: 640;
  letter-spacing: -0.015em;
  color: rgb(19, 31, 44);
}

.linktray-toolbar__count {
  font-size: 0.75rem;
  color: rgba(72, 88, 106, 0.86);
  font-variant-numeric: tabular-nums;
}

.linktray-searchRow {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.62rem;
  padding: 0.72rem 0.98rem 0.8rem;
  border-bottom: 1px solid rgba(63, 77, 93, 0.1);
}

.linktray-searchRow__label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(78, 95, 114, 0.78);
}

.linktray-search {
  width: 100%;
  border: 0;
  outline: 0;
  padding: 0;
  background: transparent;
  color: rgb(28, 40, 54);
  font: inherit;
  font-size: 0.92rem;
}

.linktray-search::placeholder {
  color: rgba(103, 118, 136, 0.78);
}

.linktray-body {
  overflow: auto;
  scrollbar-gutter: stable;
  overscroll-behavior: contain;
}

.linktray-sectionLabel {
  display: block;
  padding: 0.68rem 0.98rem 0.45rem;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(78, 95, 114, 0.78);
}

.linktray-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.linktray-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.76rem 0.98rem;
  border: 0;
  border-top: 1px solid rgba(63, 77, 93, 0.08);
  background: transparent;
  color: rgb(35, 49, 64);
  font: inherit;
  text-align: left;
}

.linktray-summary__label {
  font-size: 0.82rem;
  font-weight: 620;
}

.linktray-summary__meta {
  font-size: 0.74rem;
  color: rgba(78, 95, 114, 0.82);
}

.linktray-summary.linktray-item--selected {
  background: rgba(68, 103, 145, 0.08);
}

.linktray-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.14rem 0.72rem;
  align-items: start;
  padding: 0.78rem 0.98rem;
  border-left: 3px solid transparent;
  transition: background-color 140ms ease, border-color 140ms ease, opacity 140ms ease;
}

.linktray-item + .linktray-item,
.linktray-list + .linktray-sectionLabel,
.linktray-summary + .linktray-sectionLabel,
.linktray-summary + .linktray-list {
  border-top: 1px solid rgba(63, 77, 93, 0.08);
}

.linktray-item__body {
  display: grid;
  gap: 0.12rem;
}

.linktray-item__symbol {
  width: 0.48rem;
  height: 0.48rem;
  margin-top: 0.38rem;
  border-radius: 999px;
}

.linktray-item__symbol--existing {
  background: rgb(88, 168, 132);
  box-shadow: 0 0 0 3px rgba(88, 168, 132, 0.12);
  animation: linktray-status-pulse 2.8s ease-in-out infinite;
}

.linktray-item__symbol--missing {
  border: 1.5px solid rgba(191, 88, 88, 0.72);
  background: rgba(191, 88, 88, 0.14);
}

.linktray-item--selected {
  border-left-color: rgba(53, 101, 164, 0.9);
  background: rgba(68, 103, 145, 0.08);
}

.linktray-item__filename {
  font-size: 0.92rem;
  font-weight: 620;
  letter-spacing: -0.01em;
  color: rgb(20, 31, 43);
}

.linktray-item__path {
  color: rgba(79, 93, 110, 0.92);
  font-size: 0.79rem;
}

.linktray-item--missing {
  opacity: 0.62;
}

.linktray-empty {
  margin: 0;
  padding: 1rem 0.98rem 1.15rem;
  color: rgba(79, 93, 110, 0.9);
  font-size: 0.84rem;
}

@keyframes linktray-status-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 3px rgba(88, 168, 132, 0.1);
    opacity: 0.9;
  }

  50% {
    box-shadow: 0 0 0 5px rgba(88, 168, 132, 0.16);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .linktray-item__symbol--existing {
    animation: none;
  }
}
`,_="markedit-linktray-root",K="style[data-linktray-style]";function Q(e,r){let t=0,n="",i=!1;return{get selectedIndex(){return t},get query(){return n},render(){return q(y(e,n,i),t,n)},handleKey(a){const s=y(e,n,i).interactiveEntries;if(a==="ArrowDown"){t=Math.min(t+1,s.length-1);return}if(a==="ArrowUp"){t=Math.max(t-1,0);return}if(a==="Enter"){const l=s[t];if(l?.type==="missing-summary"){i=!i,t=Math.min(t,y(e,n,i).interactiveEntries.length-1);return}k(l?.item,r);return}a==="Escape"&&r.onClose()},click(a){t=a;const o=y(e,n,i).interactiveEntries[t];if(o?.type==="missing-summary"){i=!i;return}k(o?.item,r)},hover(a){t=a},setQuery(a){n=a,t=0}}}function W(e){return async r=>{const t=e.document??globalThis.document;if(!t?.body||!t?.head)return;U(t),H(t);const n=t.createElement("div");n.id=_,t.body.append(n);let i=!1,a=null;const o=()=>{i||(i=!0,t.removeEventListener("keydown",u,!0),t.removeEventListener("keyup",d,!0),t.removeEventListener("keypress",d,!0),n.remove())},s=Q(r,{onOpen:async m=>{await e.openFile(m),o()},onClose:async()=>{o()}}),l=()=>{i||(n.innerHTML=s.render(),a=n.querySelector(".linktray-search"),B(n,s,l),a?.focus(),a?.setSelectionRange(a.value.length,a.value.length))},u=m=>{i||!a||t.activeElement!==a||w(m.key)&&(m.preventDefault(),m.stopPropagation(),s.handleKey(m.key),!i&&m.key!=="Escape"&&l())},d=m=>{i||!a||t.activeElement!==a||w(m.key)&&(m.preventDefault(),m.stopPropagation())};return t.addEventListener("keydown",u,!0),t.addEventListener("keyup",d,!0),t.addEventListener("keypress",d,!0),l(),e.onShow?.(s),s}}function q(e,r,t){const n=e.interactiveEntries.map((l,u)=>{if(l.type==="missing-summary")return[`<button class="linktray-summary${u===r?" linktray-item--selected":""}" data-index="${u}" type="button">`,`<span class="linktray-summary__label">Missing (${l.count})</span>`,'<span class="linktray-summary__meta">Show hidden links</span>',"</button>"].join("");const d=l.item,m=["linktray-item",d.status==="missing"?"linktray-item--missing":"linktray-item--existing",u===r?"linktray-item--selected":""].filter(Boolean).join(" "),v=d.status==="missing"?' aria-disabled="true"':"";return[`<li class="${m}" data-index="${u}"${v}>`,`<span class="linktray-item__symbol linktray-item__symbol--${d.status}" aria-hidden="true"></span>`,'<div class="linktray-item__body">',`<span class="linktray-item__filename">${p(d.filename)}</span>`,`<span class="linktray-item__path">${p(d.displayPath)}</span>`,"</div>","</li>"].join("")}),i=n.slice(0,e.availableItems.length).join(""),a=e.showMissingSummary?1:0,o=a?n[e.availableItems.length]??"":"",s=n.slice(e.availableItems.length+a).join("");return['<section class="linktray-overlay" role="dialog" aria-label="Linked Markdown files">','<div class="linktray-panel">','<header class="linktray-toolbar">','<div class="linktray-toolbar__eyebrow">Index</div>','<div class="linktray-toolbar__headline">','<h2 class="linktray-toolbar__title">Linked Markdown</h2>',`<div class="linktray-toolbar__count">${p(V(e.availableItems.length,e.missingItems.length,t))}</div>`,"</div>","</header>",'<div class="linktray-searchRow">','<label class="linktray-searchRow__label" for="linktray-search">Filter</label>',`<input id="linktray-search" class="linktray-search" type="text" placeholder="Type a file, path, or status" value="${p(t)}" />`,"</div>",'<div class="linktray-body">',e.availableItems.length>0?'<span class="linktray-sectionLabel">Available</span>':"",e.availableItems.length>0?`<ul class="linktray-list">${i}</ul>`:"",o,e.missingItems.length>0&&!e.showMissingSummary?'<span class="linktray-sectionLabel">Missing</span>':"",s?`<ul class="linktray-list">${s}</ul>`:!i&&!o?'<p class="linktray-empty">No linked notes match this filter.</p>':"","</div>","</div>","</section>"].join("")}async function k(e,r){e?.openPath&&await r.onOpen(e.openPath)}function p(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function h(e,r){const t=r.trim().toLowerCase();return t?e.filter(n=>`${n.filename}
${n.displayPath}
${n.status}`.toLowerCase().includes(t)):e}function y(e,r,t){const n=h(e.filter(s=>s.status==="existing"),r),i=h(e.filter(s=>s.status==="missing"),r),a=r.trim().length>0&&i.length>0,o=i.length>0&&!a&&!t;return{availableItems:n,missingItems:i,showMissingSummary:o,interactiveEntries:[...n.map(s=>({type:"item",item:s})),...o?[{type:"missing-summary",count:i.length}]:[],...o?[]:i.map(s=>({type:"item",item:s}))]}}function B(e,r,t){const n=e.querySelector(".linktray-search"),i=e.querySelectorAll("[data-index]");n?.addEventListener("input",a=>{r.setQuery(a.currentTarget.value),t()}),i.forEach(a=>{a.addEventListener("click",()=>{const o=Number(a.dataset.index);Number.isNaN(o)||(r.click(o),t())}),a.addEventListener("mouseenter",()=>{const o=Number(a.dataset.index);Number.isNaN(o)||(r.hover(o),t())})})}function U(e){if(e.head.querySelector(K))return;const r=e.createElement("style");r.dataset.linktrayStyle="true",r.textContent=C.trim()||O,e.head.append(r)}function H(e){e.getElementById(_)?.remove()}function w(e){return e==="ArrowDown"||e==="ArrowUp"||e==="Enter"||e==="Escape"}function V(e,r,t){return t.trim()?`${e} active · ${r} missing`:`${e} active · ${r} missing`}function Y(e,r=G(e)){const t=async()=>{const n=await e.getFileInfo();if(!n?.filePath){await e.showAlert({title:"LinkTray unavailable",message:"Open a saved Markdown file before running LinkTray."});return}const i=await e.getFileContent(),a=$(i??"");if(a.length===0){await e.showAlert({title:"No linked Markdown files",message:"The current document does not contain any Markdown links to show."});return}const o=await J(e,n.filePath),s=await Promise.all(a.map(async l=>{const u=D({currentFilePath:n.filePath,rawTarget:l.rawTarget,kind:l.kind}),d=await e.getFileInfo(u);return{index:l.index,resolvedPath:u,displayPath:j({currentFilePath:n.filePath,resolvedTargetPath:u,repoRootPath:o}),exists:d!==void 0}}));await r(E(s))};return e.addMainMenuItem({title:"Open Linked Markdown",key:"L",modifiers:["Command","Shift"],action:t}),t}function G(e){return e.openFile?W({openFile:r=>e.openFile?.(r)??Promise.resolve(!1)}):async()=>{}}async function J(e,r){let t=g(c(r));for(;;){if(await e.getFileInfo(P(t,".git")))return t;const i=g(t);if(i===t)return null;t=i}}Y(S.MarkEdit);
//# sourceMappingURL=markedit-linktray.js.map
