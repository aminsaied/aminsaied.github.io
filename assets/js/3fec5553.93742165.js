"use strict";(self.webpackChunkaminsaied=self.webpackChunkaminsaied||[]).push([[7821],{3905:(e,n,t)=>{t.d(n,{Zo:()=>s,kt:()=>m});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var p=r.createContext({}),c=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},s=function(e){var n=c(e.components);return r.createElement(p.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),d=c(t),m=o,f=d["".concat(p,".").concat(m)]||d[m]||u[m]||i;return t?r.createElement(f,a(a({ref:n},s),{},{components:t})):r.createElement(f,a({ref:n},s))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,a=new Array(i);a[0]=d;var l={};for(var p in n)hasOwnProperty.call(n,p)&&(l[p]=n[p]);l.originalType=e,l.mdxType="string"==typeof e?e:o,a[1]=l;for(var c=2;c<i;c++)a[c]=t[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},8936:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>a,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>c});var r=t(7462),o=(t(7294),t(3905));const i={title:"VS Code Debugger",description:"Set up your Python debeugger in VS Code."},a=void 0,l={unversionedId:"dsref/python/vscode_debugger",id:"dsref/python/vscode_debugger",title:"VS Code Debugger",description:"Set up your Python debeugger in VS Code.",source:"@site/docs/dsref/python/vscode_debugger.md",sourceDirName:"dsref/python",slug:"/dsref/python/vscode_debugger",permalink:"/docs/dsref/python/vscode_debugger",draft:!1,tags:[],version:"current",frontMatter:{title:"VS Code Debugger",description:"Set up your Python debeugger in VS Code."},sidebar:"dsrefSidebar",previous:{title:"Sphinx",permalink:"/docs/dsref/python/sphinx"}},p={},c=[{value:"Set up VS Code debugger",id:"set-up-vs-code-debugger",level:2},{value:"1. Set conda environment",id:"1-set-conda-environment",level:2},{value:"2. Set pythonpath environment variable",id:"2-set-pythonpath-environment-variable",level:2}],s={toc:c};function u(e){let{components:n,...t}=e;return(0,o.kt)("wrapper",(0,r.Z)({},s,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"set-up-vs-code-debugger"},"Set up VS Code debugger"),(0,o.kt)("p",null,"This covers the following common scenarios:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Working with a conda environment ",(0,o.kt)("inlineCode",{parentName:"li"},"myenv")),(0,o.kt)("li",{parentName:"ol"},"Working with environment variable ",(0,o.kt)("inlineCode",{parentName:"li"},"export PYTHONPATH=..."))),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Note."),' You can find the "launch.json" file that configures the python debugger in the "Run and Debug" menu\n(',(0,o.kt)("inlineCode",{parentName:"p"},"ctrl"),"+",(0,o.kt)("inlineCode",{parentName:"p"},"shift"),'+d) and choose "create a launch.json file". If one already exists you directly find it with\n(',(0,o.kt)("inlineCode",{parentName:"p"},"ctrl"),"+",(0,o.kt)("inlineCode",{parentName:"p"},"shift"),'+p) >> "launch.json"'),(0,o.kt)("h2",{id:"1-set-conda-environment"},"1. Set conda environment"),(0,o.kt)("p",null,"Set the interpreter e.g. ",(0,o.kt)("inlineCode",{parentName:"p"},"ctrl"),"+",(0,o.kt)("inlineCode",{parentName:"p"},"shift"),'+p >> "Python: Select Interpreter" >> Find conda environment'),(0,o.kt)("p",null,"The debugger will run with the selected environment."),(0,o.kt)("h2",{id:"2-set-pythonpath-environment-variable"},"2. Set pythonpath environment variable"),(0,o.kt)("p",null,"Add the line"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},'"env": {"PYTHONPATH": "${workspaceFolder}${pathSeparator}${env:PYTHONPATH}"}\n')),(0,o.kt)("p",null,"to the ",(0,o.kt)("inlineCode",{parentName:"p"},"launch.json")," file:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},'{\n    // Use IntelliSense to learn about possible attributes.\n    // Hover to view descriptions of existing attributes.\n    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387\n    "version": "0.2.0",\n    "configurations": [\n        {\n            "name": "Python: Current File",\n            "type": "python",\n            "request": "launch",\n            "program": "${file}",\n            "console": "integratedTerminal",\n            "env": {"PYTHONPATH": "${workspaceFolder}${pathSeparator}${env:PYTHONPATH}"}\n        }\n    ]\n}\n')))}u.isMDXComponent=!0}}]);