"use strict";(self.webpackChunktypegoose_website=self.webpackChunktypegoose_website||[]).push([[826],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return d}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),m=p(n),d=o,f=m["".concat(s,".").concat(d)]||m[d]||u[d]||i;return n?r.createElement(f,a(a({ref:t},c),{},{components:n})):r.createElement(f,a({ref:t},c))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,a[1]=l;for(var p=2;p<i;p++)a[p]=n[p];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},384:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return p},toc:function(){return c},default:function(){return m}});var r=n(2122),o=n(9756),i=(n(7294),n(3905)),a=["components"],l={id:"environment-variables",title:"Environment Variables"},s=void 0,p={unversionedId:"api/environment-variables",id:"api/environment-variables",isDocsHomePage:!1,title:"Environment Variables",description:"Typegoose allows the use of some environment variables to set global options.",source:"@site/../docs/api/environment.md",sourceDirName:"api",slug:"/api/environment-variables",permalink:"/typegoose/docs/api/environment-variables",editUrl:"https://github.com/typegoose/typegoose/edit/master/docs/../docs/api/environment.md",version:"current",frontMatter:{id:"environment-variables",title:"Environment Variables"},sidebar:"docs",previous:{title:"Virtuals",permalink:"/typegoose/docs/api/virtuals"},next:{title:"Prop",permalink:"/typegoose/docs/api/decorators/prop"}},c=[{value:"Variables",id:"variables",children:[{value:"TG_ALLOW_MIXED",id:"tg_allow_mixed",children:[]}]},{value:"Examples",id:"examples",children:[]}],u={toc:c};function m(e){var t=e.components,n=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Typegoose allows the use of some environment variables to set global options."),(0,i.kt)("h2",{id:"variables"},"Variables"),(0,i.kt)("h3",{id:"tg_allow_mixed"},"TG_ALLOW_MIXED"),(0,i.kt)("p",null,"Sets the options ",(0,i.kt)("a",{parentName:"p",href:"/typegoose/docs/api/decorators/model-options#allowmixed"},(0,i.kt)("inlineCode",{parentName:"a"},"options.allowMixed"))," to the given Severity."),(0,i.kt)("p",null,"Accepts:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"numbers, in the range of ",(0,i.kt)("inlineCode",{parentName:"li"},"Severity")),(0,i.kt)("li",{parentName:"ul"},"strings, in the range of ",(0,i.kt)("inlineCode",{parentName:"li"},"Severity"))),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},'TG_ALLOW_MIXED=ALLOW npm run script # result: "options.allowMixed" is now "ALLOW" (actual: 0)\n\nTG_ALLOW_MIXED=0 npm run script # result: "options.allowMixed" is now "ALLOW" (actual: 0)\n')))}m.isMDXComponent=!0}}]);