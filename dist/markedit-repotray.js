"use strict";const S=require("markedit-api");function f(e){const t=p(e);return t==="/"?[]:t.replace(/^\/+/,"").split("/")}function p(e){const t=e.replaceAll("\\","/"),r=t.startsWith("/"),a=[];for(const o of t.split("/"))if(!(!o||o===".")){if(o===".."){if(a.length>0&&a[a.length-1]!==".."){a.pop();continue}r||a.push(o);continue}a.push(o)}return a.length===0?r?"/":".":`${r?"/":""}${a.join("/")}`}function g(e){const t=p(e);if(t==="/"||t===".")return t;const r=t.lastIndexOf("/");return r<0?".":r===0?"/":t.slice(0,r)}function P(e){const t=p(e);if(t==="/"||t===".")return t;const r=t.lastIndexOf("/");return r<0?t:t.slice(r+1)}function z(...e){return p(e.filter(Boolean).join("/"))}function E(e,t){const r=p(t);return r.startsWith("/")?r:p(`${p(e)}/${r}`)}function b(e,t){const r=f(e),a=f(t);let o=0;for(;o<r.length&&o<a.length&&r[o]===a[o];)o+=1;const n=Array.from({length:r.length-o},()=>".."),s=a.slice(o);return[...n,...s].join("/")||"."}function I(e){const t=new Set;return[...e].sort((r,a)=>r.index-a.index).flatMap(r=>t.has(r.resolvedPath)?[]:(t.add(r.resolvedPath),[L(r)]))}function L(e){const t={status:e.exists?"existing":"missing",filename:P(e.resolvedPath),displayPath:e.displayPath,resolvedPath:e.resolvedPath};return e.exists?{...t,openPath:e.resolvedPath}:t}const M=/\[([^\]]+)\]\(([^)\s]+)\)/g,T=/\[\[([^[\]]+)\]\]/g;function $(e){return[...A(e),...R(e)].sort((r,a)=>r.index-a.index)}function A(e){return Array.from(e.matchAll(M),t=>{const r=t[0],a=t[2],o=a.trim(),n=t.index??0;return _(o)?{kind:"markdown",original:r,rawTarget:a,normalizedTarget:o,index:n}:null}).filter(t=>t!==null)}function R(e){return Array.from(e.matchAll(T),t=>{const r=t[0],a=t[1].split("|",1)[0].trim();return a?{kind:"wiki",original:r,rawTarget:a,normalizedTarget:F(a),index:t.index??0}:null}).filter(t=>t!==null)}function _(e){return e.toLowerCase().endsWith(".md")}function F(e){return _(e)?e:`${e}.md`}function D({currentFilePath:e,rawTarget:t,kind:r}){const a=g(p(e)),o=C(t,r);return E(a,o)}function j({currentFilePath:e,resolvedTargetPath:t,repoRootPath:r}){const a=p(t);return b(r?p(r):g(p(e)),a)}function C(e,t){const r=p(e.trim());return t==="wiki"&&!r.toLowerCase().endsWith(".md")?`${r}.md`:r}const O=".repotray-overlay{position:fixed;inset:0;z-index:10001;display:grid;place-items:start center;padding:clamp(3rem,10vh,7rem) 1rem 1.5rem;background:linear-gradient(to bottom,#edf1f7c7,#edf1f7e0);backdrop-filter:blur(6px)}.repotray-panel{width:min(43rem,100%);max-height:min(78vh,42rem);display:grid;grid-template-rows:auto auto minmax(0,1fr);border:1px solid rgba(63,77,93,.14);border-radius:18px;background:#f6f9fc;font-family:SF Pro Text,SF Pro Display,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;box-shadow:0 22px 52px #1a26341f,0 1px #ffffffb3 inset;overflow:hidden}.repotray-toolbar{display:grid;gap:.28rem;padding:.82rem .98rem .72rem;border-bottom:1px solid rgba(63,77,93,.1);background:linear-gradient(to bottom,#fffc,#f3f6faeb)}.repotray-toolbar__eyebrow{font-size:.65rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4e5f72d1}.repotray-toolbar__headline{display:flex;align-items:baseline;justify-content:space-between;gap:1rem}.repotray-toolbar__title{margin:0;font-size:clamp(.98rem,.92rem + .36vw,1.12rem);font-weight:640;letter-spacing:-.015em;color:#131f2c}.repotray-toolbar__count{font-size:.75rem;color:#48586adb;font-variant-numeric:tabular-nums}.repotray-searchRow{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:.62rem;padding:.72rem .98rem .8rem;border-bottom:1px solid rgba(63,77,93,.1)}.repotray-searchRow__label{font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4e5f72c7}.repotray-search{width:100%;border:0;outline:0;padding:0;background:transparent;color:#1c2836;font:inherit;font-size:.92rem}.repotray-search::placeholder{color:#677688c7}.repotray-body{overflow:auto;scrollbar-gutter:stable;overscroll-behavior:contain}.repotray-sectionLabel{display:block;padding:.68rem .98rem .45rem;font-size:.66rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4e5f72c7}.repotray-list{list-style:none;margin:0;padding:0}.repotray-summary{display:flex;align-items:center;justify-content:space-between;gap:.75rem;width:100%;padding:.76rem .98rem;border:0;border-top:1px solid rgba(63,77,93,.08);background:transparent;color:#233140;font:inherit;text-align:left}.repotray-summary__label{font-size:.82rem;font-weight:620}.repotray-summary__meta{font-size:.74rem;color:#4e5f72d1}.repotray-summary.repotray-item--selected{background:#44679114}.repotray-item{display:grid;grid-template-columns:auto minmax(0,1fr);gap:.14rem .72rem;align-items:start;padding:.78rem .98rem;border-left:3px solid transparent;transition:background-color .14s ease,border-color .14s ease,opacity .14s ease}.repotray-item+.repotray-item,.repotray-list+.repotray-sectionLabel,.repotray-summary+.repotray-sectionLabel,.repotray-summary+.repotray-list{border-top:1px solid rgba(63,77,93,.08)}.repotray-item__body{display:grid;gap:.12rem}.repotray-item__symbol{width:.48rem;height:.48rem;margin-top:.38rem;border-radius:999px}.repotray-item__symbol--existing{background:#58a884;box-shadow:0 0 0 3px #58a8841f;animation:repotray-status-pulse 2.8s ease-in-out infinite}.repotray-item__symbol--missing{border:1.5px solid rgba(191,88,88,.72);background:#bf585824}.repotray-item--selected{border-left-color:#3565a4e6;background:#44679114}.repotray-item__filename{font-size:.92rem;font-weight:620;letter-spacing:-.01em;color:#141f2b}.repotray-item__path{color:#4f5d6eeb;font-size:.79rem}.repotray-item--missing{opacity:.62}.repotray-empty{margin:0;padding:1rem .98rem 1.15rem;color:#4f5d6ee6;font-size:.84rem}@keyframes repotray-status-pulse{0%,to{box-shadow:0 0 0 3px #58a8841a;opacity:.9}50%{box-shadow:0 0 0 5px #58a88429;opacity:1}}@media(prefers-reduced-motion:reduce){.repotray-item__symbol--existing{animation:none}}",K=`
.repotray-overlay {
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

.repotray-panel {
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

.repotray-toolbar {
  display: grid;
  gap: 0.28rem;
  padding: 0.82rem 0.98rem 0.72rem;
  border-bottom: 1px solid rgba(63, 77, 93, 0.1);
  background:
    linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(243, 246, 250, 0.92));
}

.repotray-toolbar__eyebrow {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(78, 95, 114, 0.82);
}

.repotray-toolbar__headline {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.repotray-toolbar__title {
  margin: 0;
  font-size: clamp(0.98rem, 0.92rem + 0.36vw, 1.12rem);
  font-weight: 640;
  letter-spacing: -0.015em;
  color: rgb(19, 31, 44);
}

.repotray-toolbar__count {
  font-size: 0.75rem;
  color: rgba(72, 88, 106, 0.86);
  font-variant-numeric: tabular-nums;
}

.repotray-searchRow {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.62rem;
  padding: 0.72rem 0.98rem 0.8rem;
  border-bottom: 1px solid rgba(63, 77, 93, 0.1);
}

.repotray-searchRow__label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(78, 95, 114, 0.78);
}

.repotray-search {
  width: 100%;
  border: 0;
  outline: 0;
  padding: 0;
  background: transparent;
  color: rgb(28, 40, 54);
  font: inherit;
  font-size: 0.92rem;
}

.repotray-search::placeholder {
  color: rgba(103, 118, 136, 0.78);
}

.repotray-body {
  overflow: auto;
  scrollbar-gutter: stable;
  overscroll-behavior: contain;
}

.repotray-sectionLabel {
  display: block;
  padding: 0.68rem 0.98rem 0.45rem;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(78, 95, 114, 0.78);
}

.repotray-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.repotray-summary {
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

.repotray-summary__label {
  font-size: 0.82rem;
  font-weight: 620;
}

.repotray-summary__meta {
  font-size: 0.74rem;
  color: rgba(78, 95, 114, 0.82);
}

.repotray-summary.repotray-item--selected {
  background: rgba(68, 103, 145, 0.08);
}

.repotray-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.14rem 0.72rem;
  align-items: start;
  padding: 0.78rem 0.98rem;
  border-left: 3px solid transparent;
  transition: background-color 140ms ease, border-color 140ms ease, opacity 140ms ease;
}

.repotray-item + .repotray-item,
.repotray-list + .repotray-sectionLabel,
.repotray-summary + .repotray-sectionLabel,
.repotray-summary + .repotray-list {
  border-top: 1px solid rgba(63, 77, 93, 0.08);
}

.repotray-item__body {
  display: grid;
  gap: 0.12rem;
}

.repotray-item__symbol {
  width: 0.48rem;
  height: 0.48rem;
  margin-top: 0.38rem;
  border-radius: 999px;
}

.repotray-item__symbol--existing {
  background: rgb(88, 168, 132);
  box-shadow: 0 0 0 3px rgba(88, 168, 132, 0.12);
  animation: repotray-status-pulse 2.8s ease-in-out infinite;
}

.repotray-item__symbol--missing {
  border: 1.5px solid rgba(191, 88, 88, 0.72);
  background: rgba(191, 88, 88, 0.14);
}

.repotray-item--selected {
  border-left-color: rgba(53, 101, 164, 0.9);
  background: rgba(68, 103, 145, 0.08);
}

.repotray-item__filename {
  font-size: 0.92rem;
  font-weight: 620;
  letter-spacing: -0.01em;
  color: rgb(20, 31, 43);
}

.repotray-item__path {
  color: rgba(79, 93, 110, 0.92);
  font-size: 0.79rem;
}

.repotray-item--missing {
  opacity: 0.62;
}

.repotray-empty {
  margin: 0;
  padding: 1rem 0.98rem 1.15rem;
  color: rgba(79, 93, 110, 0.9);
  font-size: 0.84rem;
}

@keyframes repotray-status-pulse {
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
  .repotray-item__symbol--existing {
    animation: none;
  }
}
`,v="markedit-repotray-root",N="style[data-repotray-style]";function Q(e,t){let r=0,a="",o=!1;return{get selectedIndex(){return r},get query(){return a},render(){return q(y(e,a,o),r,a)},handleKey(n){const i=y(e,a,o).interactiveEntries;if(n==="ArrowDown"){r=Math.min(r+1,i.length-1);return}if(n==="ArrowUp"){r=Math.max(r-1,0);return}if(n==="Enter"){const l=i[r];if(l?.type==="missing-summary"){o=!o,r=Math.min(r,y(e,a,o).interactiveEntries.length-1);return}h(l?.item,t);return}n==="Escape"&&t.onClose()},click(n){r=n;const s=y(e,a,o).interactiveEntries[r];if(s?.type==="missing-summary"){o=!o;return}h(s?.item,t)},setQuery(n){a=n,r=0}}}function W(e){return async t=>{const r=e.document??globalThis.document;if(!r?.body||!r?.head)return;U(r),H(r);const a=r.createElement("div");a.id=v,r.body.append(a);let o=!1,n=null;const s=()=>{o||(o=!0,r.removeEventListener("keydown",d,!0),r.removeEventListener("keyup",c,!0),r.removeEventListener("keypress",c,!0),a.remove())},i=Q(t,{onOpen:async m=>{await e.openFile(m),s()},onClose:async()=>{s()}}),l=()=>{o||(a.innerHTML=i.render(),n=a.querySelector(".repotray-search"),B(a,i,l),n?.focus(),n?.setSelectionRange(n.value.length,n.value.length))},d=m=>{o||!n||r.activeElement!==n||x(m.key)&&(m.preventDefault(),m.stopPropagation(),i.handleKey(m.key),!o&&m.key!=="Escape"&&l())},c=m=>{o||!n||r.activeElement!==n||x(m.key)&&(m.preventDefault(),m.stopPropagation())};return r.addEventListener("keydown",d,!0),r.addEventListener("keyup",c,!0),r.addEventListener("keypress",c,!0),l(),e.onShow?.(i),i}}function q(e,t,r){const a=e.interactiveEntries.map((l,d)=>{if(l.type==="missing-summary")return[`<button class="repotray-summary${d===t?" repotray-item--selected":""}" data-index="${d}" type="button">`,`<span class="repotray-summary__label">Missing (${l.count})</span>`,'<span class="repotray-summary__meta">Show hidden links</span>',"</button>"].join("");const c=l.item,m=["repotray-item",c.status==="missing"?"repotray-item--missing":"repotray-item--existing",d===t?"repotray-item--selected":""].filter(Boolean).join(" "),k=c.status==="missing"?' aria-disabled="true"':"";return[`<li class="${m}" data-index="${d}"${k}>`,`<span class="repotray-item__symbol repotray-item__symbol--${c.status}" aria-hidden="true"></span>`,'<div class="repotray-item__body">',`<span class="repotray-item__filename">${u(c.filename)}</span>`,`<span class="repotray-item__path">${u(c.displayPath)}</span>`,"</div>","</li>"].join("")}),o=a.slice(0,e.availableItems.length).join(""),n=e.showMissingSummary?1:0,s=n?a[e.availableItems.length]??"":"",i=a.slice(e.availableItems.length+n).join("");return['<section class="repotray-overlay" role="dialog" aria-label="Linked Markdown files">','<div class="repotray-panel">','<header class="repotray-toolbar">','<div class="repotray-toolbar__eyebrow">Index</div>','<div class="repotray-toolbar__headline">','<h2 class="repotray-toolbar__title">Linked Markdown</h2>',`<div class="repotray-toolbar__count">${u(V(e.availableItems.length,e.missingItems.length,r))}</div>`,"</div>","</header>",'<div class="repotray-searchRow">','<label class="repotray-searchRow__label" for="repotray-search">Filter</label>',`<input id="repotray-search" class="repotray-search" type="text" placeholder="Type a file, path, or status" value="${u(r)}" />`,"</div>",'<div class="repotray-body">',e.availableItems.length>0?'<span class="repotray-sectionLabel">Available</span>':"",e.availableItems.length>0?`<ul class="repotray-list">${o}</ul>`:"",s,e.missingItems.length>0&&!e.showMissingSummary?'<span class="repotray-sectionLabel">Missing</span>':"",i?`<ul class="repotray-list">${i}</ul>`:!o&&!s?'<p class="repotray-empty">No linked notes match this filter.</p>':"","</div>","</div>","</section>"].join("")}async function h(e,t){e?.openPath&&await t.onOpen(e.openPath)}function u(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function w(e,t){const r=t.trim().toLowerCase();return r?e.filter(a=>`${a.filename}
${a.displayPath}
${a.status}`.toLowerCase().includes(r)):e}function y(e,t,r){const a=w(e.filter(i=>i.status==="existing"),t),o=w(e.filter(i=>i.status==="missing"),t),n=t.trim().length>0&&o.length>0,s=o.length>0&&!n&&!r;return{availableItems:a,missingItems:o,showMissingSummary:s,interactiveEntries:[...a.map(i=>({type:"item",item:i})),...s?[{type:"missing-summary",count:o.length}]:[],...s?[]:o.map(i=>({type:"item",item:i}))]}}function B(e,t,r){const a=e.querySelector(".repotray-search"),o=e.querySelectorAll("[data-index]");a?.addEventListener("input",n=>{t.setQuery(n.currentTarget.value),r()}),o.forEach(n=>{n.addEventListener("click",()=>{const s=Number(n.dataset.index);Number.isNaN(s)||(t.click(s),r())})})}function U(e){if(e.head.querySelector(N))return;const t=e.createElement("style");t.dataset.repotrayStyle="true",t.textContent=O.trim()||K,e.head.append(t)}function H(e){e.getElementById(v)?.remove()}function x(e){return e==="ArrowDown"||e==="ArrowUp"||e==="Enter"||e==="Escape"}function V(e,t,r){return r.trim()?`${e} active · ${t} missing`:`${e} active · ${t} missing`}function Y(e,t=G(e)){const r=async()=>{const a=await e.getFileInfo();if(!a?.filePath){await e.showAlert({title:"RepoTray unavailable",message:"Open a saved Markdown file before running RepoTray."});return}const o=await e.getFileContent(),n=$(o??"");if(n.length===0){await e.showAlert({title:"No linked Markdown files",message:"The current document does not contain any Markdown links to show."});return}const s=await J(e,a.filePath),i=await Promise.all(n.map(async l=>{const d=D({currentFilePath:a.filePath,rawTarget:l.rawTarget,kind:l.kind}),c=await e.getFileInfo(d);return{index:l.index,resolvedPath:d,displayPath:j({currentFilePath:a.filePath,resolvedTargetPath:d,repoRootPath:s}),exists:c!==void 0}}));await t(I(i))};return e.addMainMenuItem({title:"Open Linked Markdown",key:"L",modifiers:["Command","Shift"],action:r}),r}function G(e){return e.openFile?W({openFile:t=>e.openFile?.(t)??Promise.resolve(!1)}):async()=>{}}async function J(e,t){let r=g(p(t));for(;;){if(await e.getFileInfo(z(r,".git")))return r;const o=g(r);if(o===r)return null;r=o}}Y(S.MarkEdit);
//# sourceMappingURL=markedit-repotray.js.map
