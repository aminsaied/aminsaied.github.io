"use strict";(self.webpackChunkaminsaied=self.webpackChunkaminsaied||[]).push([[9273],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),u=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},l=function(e){var t=u(e.components);return r.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),c=u(n),m=a,f=c["".concat(p,".").concat(m)]||c[m]||d[m]||i;return n?r.createElement(f,o(o({ref:t},l),{},{components:n})):r.createElement(f,o({ref:t},l))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=c;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var u=2;u<i;u++)o[u]=n[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},3824:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>u});var r=n(7462),a=(n(7294),n(3905));const i={title:"Compute Usage Metrics"},o=void 0,s={unversionedId:"dsref/azure/azure-ml/compute-usage",id:"dsref/azure/azure-ml/compute-usage",title:"Compute Usage Metrics",description:"Description",source:"@site/docs/dsref/azure/azure-ml/compute-usage.md",sourceDirName:"dsref/azure/azure-ml",slug:"/dsref/azure/azure-ml/compute-usage",permalink:"/docs/dsref/azure/azure-ml/compute-usage",draft:!1,tags:[],version:"current",frontMatter:{title:"Compute Usage Metrics"},sidebar:"dsrefSidebar",previous:{title:"Compute Instances",permalink:"/docs/dsref/azure/azure-ml/compute-instance"},next:{title:"Submitting child runs from a parent",permalink:"/docs/dsref/azure/azure-ml/create-child-runs"}},p={},u=[{value:"Description",id:"description",level:2},{value:"Example",id:"example",level:2}],l={toc:u};function d(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"description"},"Description"),(0,a.kt)("p",null,"This example computes hyperdrive usage in a workspace."),(0,a.kt)("p",null,"Useful snippets:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Extract / compute duration, start time and end time from runs"),(0,a.kt)("li",{parentName:"ul"},"Check run types")),(0,a.kt)("h2",{id:"example"},"Example"),(0,a.kt)("p",null,"Connect to the relevant workspace."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},"from azureml.core import Workspace\nws = Workspace.from_config()\n")),(0,a.kt)("p",null,"Methods used to extract duration and start time from a run."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},"from datetime import datetime\n\ndef to_datetime(s):\n    return datetime.strptime(s, '%Y-%m-%dT%H:%M:%S.%fZ')\n\ndef get_duration_and_start(run):\n    try:\n        details = run.get_details()\n        start = to_datetime(details['startTimeUtc'])\n        end = to_datetime(details['endTimeUtc'])\n        duration = end-start\n        return duration.total_seconds(), start\n    except:\n        raise ValueError(f\"Error getting duration from {run.id}\")\n")),(0,a.kt)("p",null,"We then find a list of all experiments which include at least one hyperdrive run."),(0,a.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),'"This can be slow \u231a"')),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"If your workspace has a lot of experiments/runs, this can be quite slow."))),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},'# get all experiments which include a hyperdrive run\nhyperdrive_experiments = set()\nfor exp_name, exp in ws.experiments.items():\n    for run in exp.get_runs():\n        if run.type == "hyperdrive":\n            print(f"Adding {exp_name}")\n            hyperdrive_experiments.add(exp_name)\n            break\n')),(0,a.kt)("p",null,"Create a pandas ",(0,a.kt)("inlineCode",{parentName:"p"},"DataFrame")," to store the relevant information."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},'import pandas as pd\n\ncolumns = [\n    "start_date",\n    "experiment",\n    "run_id",\n    "duration",\n    "n_child_runs",\n]\n\ndf = pd.DataFrame(columns=columns)\n')),(0,a.kt)("p",null,"Now run through each hyperdrive experiment and compute duration, number of child runs, adding these\ndata to the ",(0,a.kt)("inlineCode",{parentName:"p"},"DataFrame"),"."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},'for exp_name in hyperdrive_experiments:\n    exp = ws.experiments[exp_name]\n    runs = exp.get_runs()\n    for run in exp.get_runs():\n        \n        if run.type == "hyperdrive":\n        \n            duration, start_date = get_duration_and_start(run)\n            n_child_runs = len(list(run.get_children()))\n\n            row = {\n                "start_date": start_date,\n                "experiment": exp_name,\n                "run_id": run.id,\n                "duration": duration,\n                "n_child_runs": n_child_runs,\n            }\n            \n            print(f"Adding {row}")\n\n            df = df.append(row, ignore_index=True)\n')),(0,a.kt)("p",null,"Finally, save these results to csv."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},'df.to_csv("hyperdrive-usage.csv", index=False)\n')))}d.isMDXComponent=!0}}]);