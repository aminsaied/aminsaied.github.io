"use strict";(self.webpackChunkaminsaied=self.webpackChunkaminsaied||[]).push([[3113],{3905:(e,n,r)=>{r.d(n,{Zo:()=>d,kt:()=>m});var t=r(7294);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function a(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function o(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?a(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r,t,i={},a=Object.keys(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||(i[r]=e[r]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var l=t.createContext({}),c=function(e){var n=t.useContext(l),r=n;return e&&(r="function"==typeof e?e(n):o(o({},n),e)),r},d=function(e){var n=c(e.components);return t.createElement(l.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},u=t.forwardRef((function(e,n){var r=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),u=c(r),m=i,v=u["".concat(l,".").concat(m)]||u[m]||p[m]||a;return r?t.createElement(v,o(o({ref:n},d),{},{components:r})):t.createElement(v,o({ref:n},d))}));function m(e,n){var r=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=u;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var c=2;c<a;c++)o[c]=r[c];return t.createElement.apply(null,o)}return t.createElement.apply(null,r)}u.displayName="MDXCreateElement"},4567:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var t=r(7462),i=(r(7294),r(3905));const a={title:"CUDA",description:"Understanding available CUDA versions on your VM with `nvidia-smi`\nand `nvcc`. \n"},o=void 0,s={unversionedId:"dsref/ml/cuda",id:"dsref/ml/cuda",title:"CUDA",description:"Understanding available CUDA versions on your VM with `nvidia-smi`\nand `nvcc`. \n",source:"@site/docs/dsref/ml/cuda.md",sourceDirName:"dsref/ml",slug:"/dsref/ml/cuda",permalink:"/docs/dsref/ml/cuda",draft:!1,tags:[],version:"current",frontMatter:{title:"CUDA",description:"Understanding available CUDA versions on your VM with `nvidia-smi`\nand `nvcc`. \n"},sidebar:"dsrefSidebar",previous:{title:"Machine Learning",permalink:"/docs/category/machine-learning"},next:{title:"Distributed Data Parallel (DDP)",permalink:"/docs/dsref/ml/ddp"}},l={},c=[{value:"Understanding CUDA versions",id:"understanding-cuda-versions",level:2},{value:"Example",id:"example",level:3}],d={toc:c};function p(e){let{components:n,...r}=e;return(0,i.kt)("wrapper",(0,t.Z)({},d,r,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"understanding-cuda-versions"},"Understanding CUDA versions"),(0,i.kt)("p",null,"Useful commands:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"nvidia-smi"),": Shows the CUDA version that the driver supports"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"nvcc --version"),": Shows the CUDA toolkit version")),(0,i.kt)("p",null,"It's okay if the two CUDA versions are different. You should have ",(0,i.kt)("inlineCode",{parentName:"p"},"nvidia-smi")," version >= ",(0,i.kt)("inlineCode",{parentName:"p"},"nvcc")," version. See below for more\ndetails."),(0,i.kt)("h3",{id:"example"},"Example"),(0,i.kt)("p",null,"Running the above commands on an Azure VM gave this output"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"$ nvcc --version\nnvcc: NVIDIA (R) Cuda compiler driver\nCopyright (c) 2005-2019 NVIDIA Corporation\nBuilt on Sun_Jul_28_19:07:16_PDT_2019\nCuda compilation tools, release 10.1, V10.1.243\n\n$ nvidia-smi\nSun Jun 27 03:16:55 2021\n+-----------------------------------------------------------------------------+\n| NVIDIA-SMI 465.19.01    Driver Version: 465.19.01    CUDA Version: 11.3     |\n|-------------------------------+----------------------+----------------------+\n| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |\n| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |\n|                               |                      |               MIG M. |\n|===============================+======================+======================|\n|   0  NVIDIA Tesla K80    On   | 00000001:00:00.0 Off |                    0 |\n| N/A   41C    P8    33W / 149W |      0MiB / 11441MiB |      0%      Default |\n|                               |                      |                  N/A |\n+-------------------------------+----------------------+----------------------+\n\n+-----------------------------------------------------------------------------+\n| Processes:                                                                  |\n|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |\n|        ID   ID                                                   Usage      |\n|=============================================================================|\n|  No running processes found                                                 |\n+-----------------------------------------------------------------------------+\n")),(0,i.kt)("p",null,"There is a very detailed answer in ","[1]",". Here's a snippet:"),(0,i.kt)("p",null,"Note the CUDA versions listed here are different! That's because ",(0,i.kt)("inlineCode",{parentName:"p"},"nvidia-smi")," shows you the CUDA version that\nyour driver supports. The version the driver supports has nothing to do with the version you compile and link\nyour program against. A driver that supports CUDA 10.0 will also be able to run an application that was built\nfor CUDA 9.2"),(0,i.kt)("p",null,"[1]"," ",(0,i.kt)("a",{parentName:"p",href:"https://stackoverflow.com/questions/53422407/different-cuda-versions-shown-by-nvcc-and-nvidia-smi"},"https://stackoverflow.com/questions/53422407/different-cuda-versions-shown-by-nvcc-and-nvidia-smi")))}p.isMDXComponent=!0}}]);