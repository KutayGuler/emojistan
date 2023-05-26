import{S,i as q,s as H,a8 as O,a as B,k as l,y as z,a5 as W,h as n,c as V,l as i,m as u,z as Z,p as j,b as T,A as F,a9 as J,aa as K,g as L,d as N,B as Q,q as E,r as g,n as m,G as s,O as U}from"../chunks/index.8e69b878.js";import{E as X,C,a as G,D as P}from"../chunks/store.55a48864.js";import{m as Y,n as tt,o as et,M as A}from"../chunks/index.8d01d5d1.js";import{T as at}from"../chunks/Tutorial.401a5670.js";import{M as st}from"../chunks/Rulebox.92ec5d3f.js";function rt(x){let e,r,a,c,f,p,t,o,h,I,R,d,$,k,y,D,M;return{c(){e=l("div"),r=E(`Merger takes three emoji inputs. To put it simply,\r
		`),a=l("div"),c=l("i"),f=E(`\r
			+\r
			`),p=l("i"),t=E(` =\r
			`),o=l("i"),h=B(),I=l("br"),R=E(`\r
		Alternatively,\r
		`),d=l("div"),$=l("i"),k=E(`\r
			+\r
			`),y=l("i"),D=E(`\r
			= `),M=l("i"),this.h()},l(b){e=i(b,"DIV",{slot:!0});var w=u(e);r=g(w,`Merger takes three emoji inputs. To put it simply,\r
		`),a=i(w,"DIV",{class:!0});var _=u(a);c=i(_,"I",{class:!0}),u(c).forEach(n),f=g(_,`\r
			+\r
			`),p=i(_,"I",{class:!0}),u(p).forEach(n),t=g(_,` =\r
			`),o=i(_,"I",{class:!0}),u(o).forEach(n),_.forEach(n),h=V(w),I=i(w,"BR",{}),R=g(w,`\r
		Alternatively,\r
		`),d=i(w,"DIV",{class:!0});var v=u(d);$=i(v,"I",{class:!0}),u($).forEach(n),k=g(v,`\r
			+\r
			`),y=i(v,"I",{class:!0}),u(y).forEach(n),D=g(v,`\r
			= `),M=i(v,"I",{class:!0}),u(M).forEach(n),v.forEach(n),w.forEach(n),this.h()},h(){m(c,"class","twa twa-cloud text-2xl"),m(p,"class","twa twa-snowflake text-2xl"),m(o,"class","twa twa-cloud-with-snow text-2xl"),m(a,"class","w-fit rounded bg-neutral p-2 text-neutral-content"),m($,"class","twa twa-cloud text-2xl"),m(y,"class","twa twa-snowflake text-2xl"),m(M,"class","twa twa-cloud-with-snow text-2xl"),m(d,"class","w-fit rounded bg-neutral p-2 text-neutral-content"),m(e,"slot","description")},m(b,w){T(b,e,w),s(e,r),s(e,a),s(a,c),s(a,f),s(a,p),s(a,t),s(a,o),s(e,h),s(e,I),s(e,R),s(e,d),s(d,$),s(d,k),s(d,y),s(d,D),s(d,M)},p:U,d(b){b&&n(e)}}}function ot(x){let e,r,a,c;const f=[x[0]];let p={$$slots:{description:[rt]},$$scope:{ctx:x}};for(let t=0;t<f.length;t+=1)p=O(p,f[t]);return r=new at({props:p}),{c(){e=B(),a=l("div"),z(r.$$.fragment),this.h()},l(t){W("svelte-pu8bwd",document.head).forEach(n),e=V(t),a=i(t,"DIV",{style:!0});var h=u(a);Z(r.$$.fragment,h),this.h()},h(){document.title="Emojistan | Tutorial - Merger",j(a,"display","contents"),j(a,"--header",A)},m(t,o){T(t,e,o),T(t,a,o),F(r,a,null),c=!0},p(t,[o]){const h=o&1?J(f,[K(t[0])]):{};o&2&&(h.$$scope={dirty:o,ctx:t}),r.$set(h)},i(t){c||(L(r.$$.fragment,t),c=!0)},o(t){N(r.$$.fragment,t),c=!1},d(t){t&&n(e),t&&r&&n(a),Q(r,t)}}}function nt(x){return[{header:"Merger",component:st,rbx:{id:"-1",type:"merger",position:{x:0,y:0},width:Y,height:tt,bgColor:et,borderColor:A},props:{id:"-1",slots:["cloud","snowflake","cloud-with-snow"]},gameProps:{map:new X(new Map([["0_5","cloud"],["0_6","snowflake"]])),controllables:new Map([["0",new C("cloud",1,[["any",0]],new G("",0),new P(""))],["1",new C("snowflake",1,[["any",0]],new G("",0),new P(""))],["2",new C("cloud-with-snow",1,[["any",0]],new G("",0),new P(""))]]),mergers:new Map([["4",["cloud","snowflake","cloud-with-snow"]]]),mapClass:"simulation",SIZE:4,showHP:!1,showInventory:!1}}]}class pt extends S{constructor(e){super(),q(this,e,nt,ot,H,{})}}export{pt as component};
