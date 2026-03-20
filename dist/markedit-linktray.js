"use strict";const S=require("markedit-api");function b(e){const n=d(e);return n==="/"?[]:n.replace(/^\/+/,"").split("/")}function d(e){const n=e.replaceAll("\\","/"),t=n.startsWith("/"),r=[];for(const i of n.split("/"))if(!(!i||i===".")){if(i===".."){if(r.length>0&&r[r.length-1]!==".."){r.pop();continue}t||r.push(i);continue}r.push(i)}return r.length===0?t?"/":".":`${t?"/":""}${r.join("/")}`}function p(e){const n=d(e);if(n==="/"||n===".")return n;const t=n.lastIndexOf("/");return t<0?".":t===0?"/":n.slice(0,t)}function L(e){const n=d(e);if(n==="/"||n===".")return n;const t=n.lastIndexOf("/");return t<0?n:n.slice(t+1)}function M(...e){return d(e.filter(Boolean).join("/"))}function z(e,n){const t=d(n);return t.startsWith("/")?t:d(`${d(e)}/${t}`)}function h(e,n){const t=b(e),r=b(n);let i=0;for(;i<t.length&&i<r.length&&t[i]===r[i];)i+=1;const a=Array.from({length:t.length-i},()=>".."),o=r.slice(i);return[...a,...o].join("/")||"."}function T(e){const n=new Set;return[...e].sort((t,r)=>t.index-r.index).flatMap(t=>n.has(t.resolvedPath)?[]:(n.add(t.resolvedPath),[F(t)]))}function F(e){const n={status:e.exists?"existing":"missing",filename:L(e.resolvedPath),displayPath:e.displayPath,resolvedPath:e.resolvedPath};return e.exists?{...n,openPath:e.resolvedPath}:n}const $=/\[([^\]]+)\]\(([^()\s]*(?:\([^()\s]*\)[^()\s]*)*)\)/g,A=/\[\[([^[\]]+)\]\]/g;function C(e){const n=j(e);return[...R(e,n),...O(n)].sort((r,i)=>r.index-i.index)}function R(e,n){return Array.from(n.matchAll($),t=>{const r=t.index??0;if(r>0&&e[r-1]==="!")return null;const i=t[0],a=t[2],o=y(a.trim());return E(o)?{kind:"markdown",original:i,rawTarget:a,normalizedTarget:o,index:r}:null}).filter(t=>t!==null)}function O(e){return Array.from(e.matchAll(A),n=>{const t=n[0],r=y(n[1].split("|",1)[0].trim());return r?{kind:"wiki",original:t,rawTarget:r,normalizedTarget:D(r),index:n.index??0}:null}).filter(n=>n!==null)}function y(e){const n=e.indexOf("#");return n<0?e:e.slice(0,n)}function E(e){return y(e).toLowerCase().endsWith(".md")}function D(e){const n=y(e);return E(n)?n:`${n}.md`}function j(e){const n=e.split("");let t=0;for(;t<e.length;){const r=N(e,t);if(r){w(n,r.start,r.end),t=r.end;continue}const i=K(e,t);if(i){w(n,i.start,i.end),t=i.end;continue}t+=1}return n.join("")}function N(e,n){const t=W(e,n);if(!t||!B(e,n))return null;let r=k(e,n);for(;r<e.length;){const i=k(e,r),a=e.slice(r,i);if(Q(a,t))return{start:n,end:i};r=i}return{start:n,end:e.length}}function K(e,n){if(e[n]!=="`")return null;let t=n;for(;e[t]==="`";)t+=1;const r=t-n;let i=t;for(;i<e.length;){const a=e.indexOf("`",i);if(a<0)return null;let o=a;for(;e[o]==="`";)o+=1;if(o-a===r)return{start:n,end:o};i=o}return null}function W(e,n){const t=e[n];if(t!=="`"&&t!=="~")return null;let r=n;for(;e[r]===t;)r+=1;return r-n>=3?e.slice(n,r):null}function B(e,n){const t=e.lastIndexOf(`
`,n-1)+1;return/^[ \t]{0,3}$/.test(e.slice(t,n))}function Q(e,n){const t=e.replace(/^[ \t]{0,3}/,""),r=n[0];let i=0;for(;t[i]===r;)i+=1;return i>=n.length&&/^[ \t\r]*$/.test(t.slice(i))}function k(e,n){const t=e.indexOf(`
`,n);return t<0?e.length:t+1}function w(e,n,t){for(let r=n;r<t;r+=1)e[r]!==`
`&&e[r]!=="\r"&&(e[r]=" ")}function q({currentFilePath:e,rawTarget:n,kind:t}){const r=p(d(e)),i=V(n,t);return z(r,i)}function U({currentFilePath:e,resolvedTargetPath:n,repoRootPath:t}){const r=d(n);return h(t?d(t):p(d(e)),r)}function H(e){const n=e.indexOf("#");return n<0?e:e.slice(0,n)}function V(e,n){const t=d(H(e.trim()));return n==="wiki"&&!t.toLowerCase().endsWith(".md")?`${t}.md`:t}const G=".linktray-overlay{position:fixed;inset:0;z-index:10001;display:grid;place-items:start center;padding:clamp(3rem,10vh,7rem) 1rem 1.5rem;background:linear-gradient(to bottom,#edf1f7c7,#edf1f7e0);backdrop-filter:blur(6px)}.linktray-panel{width:min(43rem,100%);max-height:min(78vh,42rem);display:grid;grid-template-rows:auto auto minmax(0,1fr);border:1px solid rgba(63,77,93,.14);border-radius:18px;background:#f6f9fc;font-family:SF Pro Text,SF Pro Display,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;box-shadow:0 22px 52px #1a26341f,0 1px #ffffffb3 inset;overflow:hidden}.linktray-toolbar{display:grid;gap:.28rem;padding:.82rem .98rem .72rem;border-bottom:1px solid rgba(63,77,93,.1);background:linear-gradient(to bottom,#fffc,#f3f6faeb)}.linktray-toolbar__eyebrow{font-size:.65rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4e5f72d1}.linktray-toolbar__headline{display:flex;align-items:baseline;justify-content:space-between;gap:1rem}.linktray-toolbar__title{margin:0;font-size:clamp(.98rem,.92rem + .36vw,1.12rem);font-weight:640;letter-spacing:-.015em;color:#131f2c}.linktray-toolbar__count{font-size:.75rem;color:#48586adb;font-variant-numeric:tabular-nums}.linktray-searchRow{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:.62rem;padding:.72rem .98rem .8rem;border-bottom:1px solid rgba(63,77,93,.1)}.linktray-searchRow__label{font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4e5f72c7}.linktray-search{width:100%;border:0;outline:0;padding:0;background:transparent;color:#1c2836;font:inherit;font-size:.92rem}.linktray-search::placeholder{color:#677688c7}.linktray-body{overflow:auto;scrollbar-gutter:stable;overscroll-behavior:contain}.linktray-sectionLabel{display:block;padding:.68rem .98rem .45rem;font-size:.66rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4e5f72c7}.linktray-list{list-style:none;margin:0;padding:0}.linktray-summary{display:flex;align-items:center;justify-content:space-between;gap:.75rem;width:100%;padding:.76rem .98rem;border:0;border-top:1px solid rgba(63,77,93,.08);background:transparent;color:#233140;font:inherit;text-align:left;cursor:pointer}.linktray-summary__label{font-size:.82rem;font-weight:620}.linktray-summary__meta{font-size:.74rem;color:#4e5f72d1}.linktray-summary.linktray-item--selected{background:#44679114}.linktray-item{display:grid;grid-template-columns:auto minmax(0,1fr);gap:.14rem .72rem;align-items:start;padding:.78rem .98rem;border-left:3px solid transparent;transition:background-color .14s ease,border-color .14s ease,opacity .14s ease}.linktray-item+.linktray-item,.linktray-list+.linktray-sectionLabel,.linktray-summary+.linktray-sectionLabel,.linktray-summary+.linktray-list{border-top:1px solid rgba(63,77,93,.08)}.linktray-item__body{display:grid;gap:.12rem}.linktray-item__symbol{width:.48rem;height:.48rem;margin-top:.38rem;border-radius:999px}.linktray-item__symbol--existing{background:#58a884;box-shadow:0 0 0 3px #58a8841f;animation:linktray-status-pulse 2.8s ease-in-out infinite}.linktray-item__symbol--missing{border:1.5px solid rgba(191,88,88,.72);background:#bf585824}.linktray-item--selected{border-left-color:#3565a4e6;background:#44679114}.linktray-item__filename{font-size:.92rem;font-weight:620;letter-spacing:-.01em;color:#141f2b}.linktray-item__path{color:#4f5d6eeb;font-size:.79rem}.linktray-item--missing{opacity:.62}.linktray-empty{margin:0;padding:1rem .98rem 1.15rem;color:#4f5d6ee6;font-size:.84rem}@keyframes linktray-status-pulse{0%,to{box-shadow:0 0 0 3px #58a8841a;opacity:.9}50%{box-shadow:0 0 0 5px #58a88429;opacity:1}}@media(prefers-reduced-motion:reduce){.linktray-item__symbol--existing{animation:none}}",Y=`
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
  cursor: pointer;
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
`,I="markedit-linktray-root",J="style[data-linktray-style]";function X(e,n){let t=0,r="",i=!1;return{get selectedIndex(){return t},get query(){return r},render(){return ee(g(e,r,i),t,r)},handleKey(a){const l=g(e,r,i).interactiveEntries;if(a==="ArrowDown"){if(l.length===0)return;t=Math.min(t+1,l.length-1);return}if(a==="ArrowUp"){t=Math.max(t-1,0);return}if(a==="Enter"){const m=l[t];if(m?.type==="missing-summary"){i=!i,t=Math.min(t,g(e,r,i).interactiveEntries.length-1);return}x(m?.item,n);return}a==="Escape"&&n.onClose()},click(a){t=a;const o=g(e,r,i).interactiveEntries[t];if(o?.type==="missing-summary"){i=!i;return}x(o?.item,n)},hover(a){t=a},setQuery(a){r=a,t=0}}}function Z(e){return async n=>{const t=e.document??globalThis.document;if(!t?.body||!t?.head)return;ne(t),re(t);const r=t.createElement("div");r.id=I,t.body.append(r);let i=!1,a=null;const o=()=>{i||(i=!0,t.removeEventListener("keydown",u,!0),t.removeEventListener("keyup",c,!0),t.removeEventListener("keypress",c,!0),r.remove())},l=X(n,{onOpen:async s=>{try{if(await e.openFile(s)){o();return}}catch{}await e.onOpenFailure?.(s),a?.focus()},onClose:async()=>{o()}}),m=()=>{i||(r.innerHTML=l.render(),a=r.querySelector(".linktray-search"),a?.focus(),a?.setSelectionRange(a.value.length,a.value.length))};te(r,l,m);const u=s=>{i||!a||t.activeElement!==a||_(s.key)&&(s.preventDefault(),s.stopPropagation(),l.handleKey(s.key),!i&&s.key!=="Escape"&&m())},c=s=>{i||!a||t.activeElement!==a||_(s.key)&&(s.preventDefault(),s.stopPropagation())};return t.addEventListener("keydown",u,!0),t.addEventListener("keyup",c,!0),t.addEventListener("keypress",c,!0),m(),e.onShow?.(l),l}}function ee(e,n,t){const r=e.interactiveEntries.map((m,u)=>{if(m.type==="missing-summary")return[`<button class="linktray-summary${u===n?" linktray-item--selected":""}" data-index="${u}" type="button">`,`<span class="linktray-summary__label">Missing (${m.count})</span>`,'<span class="linktray-summary__meta">Show hidden links</span>',"</button>"].join("");const c=m.item,s=["linktray-item",c.status==="missing"?"linktray-item--missing":"linktray-item--existing",u===n?"linktray-item--selected":""].filter(Boolean).join(" "),P=c.status==="missing"?' aria-disabled="true"':"";return[`<li class="${s}" data-index="${u}"${P}>`,`<span class="linktray-item__symbol linktray-item__symbol--${c.status}" aria-hidden="true"></span>`,'<div class="linktray-item__body">',`<span class="linktray-item__filename">${f(c.filename)}</span>`,`<span class="linktray-item__path">${f(c.displayPath)}</span>`,"</div>","</li>"].join("")}),i=r.slice(0,e.availableItems.length).join(""),a=e.showMissingSummary?1:0,o=a?r[e.availableItems.length]??"":"",l=r.slice(e.availableItems.length+a).join("");return['<section class="linktray-overlay" role="dialog" aria-label="Linked Markdown files">','<div class="linktray-panel">','<header class="linktray-toolbar">','<div class="linktray-toolbar__eyebrow">Index</div>','<div class="linktray-toolbar__headline">','<h2 class="linktray-toolbar__title">Linked Markdown</h2>',`<div class="linktray-toolbar__count">${f(ie(e.availableItems.length,e.missingItems.length))}</div>`,"</div>","</header>",'<div class="linktray-searchRow">','<label class="linktray-searchRow__label" for="linktray-search">Filter</label>',`<input id="linktray-search" class="linktray-search" type="text" placeholder="Type a file, path, or status" value="${f(t)}" />`,"</div>",'<div class="linktray-body">',e.availableItems.length>0?'<span class="linktray-sectionLabel">Available</span>':"",e.availableItems.length>0?`<ul class="linktray-list">${i}</ul>`:"",o,e.missingItems.length>0&&!e.showMissingSummary?'<span class="linktray-sectionLabel">Missing</span>':"",l?`<ul class="linktray-list">${l}</ul>`:!i&&!o?'<p class="linktray-empty">No linked notes match this filter.</p>':"","</div>","</div>","</section>"].join("")}async function x(e,n){e?.openPath&&await n.onOpen(e.openPath)}function f(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function v(e,n){const t=n.trim().toLowerCase();return t?e.filter(r=>`${r.filename}
${r.displayPath}
${r.status}`.toLowerCase().includes(t)):e}function g(e,n,t){const r=v(e.filter(l=>l.status==="existing"),n),i=v(e.filter(l=>l.status==="missing"),n),a=n.trim().length>0&&i.length>0,o=i.length>0&&!a&&!t;return{availableItems:r,missingItems:i,showMissingSummary:o,interactiveEntries:[...r.map(l=>({type:"item",item:l})),...o?[{type:"missing-summary",count:i.length}]:[],...o?[]:i.map(l=>({type:"item",item:l}))]}}function te(e,n,t){e.addEventListener("input",r=>{r.target.matches(".linktray-search")&&(n.setQuery(r.target.value),t())}),e.addEventListener("click",r=>{const i=r.target.closest("[data-index]");if(!i)return;const a=Number(i.dataset.index);Number.isNaN(a)||(n.click(a),t())}),e.addEventListener("mouseover",r=>{const i=r.target.closest("[data-index]");if(!i)return;const a=Number(i.dataset.index);Number.isNaN(a)||a===n.selectedIndex||(n.hover(a),t())})}function ne(e){if(e.head.querySelector(J))return;const n=e.createElement("style");n.dataset.linktrayStyle="true",n.textContent=G.trim()||Y,e.head.append(n)}function re(e){e.getElementById(I)?.remove()}function _(e){return e==="ArrowDown"||e==="ArrowUp"||e==="Enter"||e==="Escape"}function ie(e,n){return`${e} active · ${n} missing`}function ae(e,n=oe(e)){const t=async()=>{const r=await e.getFileInfo();if(!r?.filePath){await e.showAlert({title:"MarkEdit-linktray unavailable",message:"Open a saved Markdown file before running MarkEdit-linktray."});return}const i=await e.getFileContent(),a=C(i??"");if(a.length===0){await e.showAlert({title:"No linked Markdown files",message:"The current document does not contain any Markdown links to show."});return}const o=await le(e,r.filePath),l=new Set,m=a.flatMap(c=>{const s=q({currentFilePath:r.filePath,rawTarget:c.rawTarget,kind:c.kind});return l.has(s)?[]:(l.add(s),[{index:c.index,resolvedPath:s}])}),u=await Promise.all(m.map(async c=>{const s=await e.getFileInfo(c.resolvedPath);return{index:c.index,resolvedPath:c.resolvedPath,displayPath:U({currentFilePath:r.filePath,resolvedTargetPath:c.resolvedPath,repoRootPath:o}),exists:s!==void 0}}));await n(T(u))};return e.addMainMenuItem({title:"Open Linked Markdown",key:"L",modifiers:["Command","Shift"],action:t}),t}function oe(e){return e.openFile?Z({openFile:n=>e.openFile?.(n)??Promise.resolve(!1),onOpenFailure:async()=>{await e.showAlert({title:"Could not open linked Markdown file",message:"MarkEdit could not open that file. Grant its parent folder access in MarkEdit preferences and try again."})}}):async()=>{}}async function le(e,n){let t=p(d(n));for(;;){if(await e.getFileInfo(M(t,".git")))return t;const i=p(t);if(i===t)return null;t=i}}ae(S.MarkEdit);
//# sourceMappingURL=markedit-linktray.js.map
