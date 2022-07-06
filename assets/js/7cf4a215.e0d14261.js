"use strict";(self.webpackChunkaminsaied=self.webpackChunkaminsaied||[]).push([[7633],{3905:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>g});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=n.createContext({}),c=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},s=function(e){var t=c(e.components);return n.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),u=c(r),g=a,d=u["".concat(p,".").concat(g)]||u[g]||m[g]||i;return r?n.createElement(d,l(l({ref:t},s),{},{components:r})):n.createElement(d,l({ref:t},s))}));function g(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,l=new Array(i);l[0]=u;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var c=2;c<i;c++)l[c]=r[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},1228:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>m,frontMatter:()=>i,metadata:()=>o,toc:()=>c});var n=r(7462),a=(r(7294),r(3905));const i={title:"\u2728Talk: Pipeline Model Parallelism",authors:["aminsaied"],tags:["talk","nlp"]},l=void 0,o={permalink:"/blog/2021/02/12/parallelism",source:"@site/blog/2021-02-12-parallelism/index.md",title:"\u2728Talk: Pipeline Model Parallelism",description:"Abstract. Models are getting increasingly large, to the point that",date:"2021-02-12T00:00:00.000Z",formattedDate:"February 12, 2021",tags:[{label:"talk",permalink:"/blog/tags/talk"},{label:"nlp",permalink:"/blog/tags/nlp"}],readingTime:.235,truncated:!0,authors:[{name:"Amin Saied",title:"ML Engineer, Microsoft",url:"https://github.com/aminsaied",imageURL:"https://github.com/aminsaied.png",key:"aminsaied"}],frontMatter:{title:"\u2728Talk: Pipeline Model Parallelism",authors:["aminsaied"],tags:["talk","nlp"]},prevItem:{title:"\u2728Talk: Introduction to PyTorch Lightning",permalink:"/blog/2021/05/07/pytorch-lightning"},nextItem:{title:"\u2728Talk: GPT-1 and GPT-2 Review",permalink:"/blog/2021/01/15/gpt1-gpt2"}},p={authorsImageUrls:[void 0]},c=[],s={toc:c};function m(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Abstract.")," Models are getting increasingly large, to the point that\nthey don't always fit on a single device! We discuss some techniques to\npartition models over multiple devices, from plain PyTorch to libraries\nlike deepspeed."))}m.isMDXComponent=!0}}]);