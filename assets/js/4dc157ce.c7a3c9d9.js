"use strict";(self.webpackChunkaminsaied=self.webpackChunkaminsaied||[]).push([[5966],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=c(r),f=o,m=d["".concat(s,".").concat(f)]||d[f]||u[f]||a;return r?n.createElement(m,i(i({ref:t},p),{},{components:r})):n.createElement(m,i({ref:t},p))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},2617:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>l,toc:()=>c});var n=r(7462),o=(r(7294),r(3905));const a={title:"Dotfiles"},i=void 0,l={unversionedId:"dsref/linux/dotfiles",id:"dsref/linux/dotfiles",title:"Dotfiles",description:"Clone dotfiles into ~",source:"@site/docs/dsref/linux/dotfiles.md",sourceDirName:"dsref/linux",slug:"/dsref/linux/dotfiles",permalink:"/docs/dsref/linux/dotfiles",draft:!1,tags:[],version:"current",frontMatter:{title:"Dotfiles"},sidebar:"dsrefSidebar",previous:{title:"Linux",permalink:"/docs/category/linux"},next:{title:"Git",permalink:"/docs/dsref/linux/git"}},s={},c=[{value:"References",id:"references",level:2}],p={toc:c};function u(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Clone ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/aminsaied/dotfiles"},"dotfiles")," into ",(0,o.kt)("inlineCode",{parentName:"p"},"~")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ cd ~\n$ git clone git@github.com:aminsaied/dotfiles.git\n")),(0,o.kt)("p",null,"Delete all the dotfiles in ",(0,o.kt)("inlineCode",{parentName:"p"},"~"),", e.g.,"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ rm ~/.bashrc\n")),(0,o.kt)("p",null,"or move them into dotfiles if you don't have it already"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ mv ~/.bashrc ~/dotfiles/.bashrc\n")),(0,o.kt)("p",null,"Symlink from the dotfiles to ",(0,o.kt)("inlineCode",{parentName:"p"},"~")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ ln -nfs /home/amin/dotfiles/.bashrc /home/amin/.bashrc\n")),(0,o.kt)("p",null,"These steps are automated in the dotfiles repo's ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/aminsaied/dotfiles/blob/master/bootstrap.sh"},(0,o.kt)("inlineCode",{parentName:"a"},"bootstrap.sh"))," script. Note, I do not recommend blindly running this script. It is very simple, so please read it and see what it is doing."),(0,o.kt)("h2",{id:"references"},"References"),(0,o.kt)("p",null,"I learned this trick from this youtube video: ",(0,o.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=e8BO_dYxk5c&t=2362s"},"MIT Missing Semester"),".",(0,o.kt)("br",{parentName:"p"}),"\n","Here's a ",(0,o.kt)("a",{parentName:"p",href:"https://opensource.com/article/19/3/move-your-dotfiles-version-control"},"related blog"),"."))}u.isMDXComponent=!0}}]);