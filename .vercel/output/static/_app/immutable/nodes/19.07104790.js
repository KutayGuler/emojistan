import{S as Q,i as X,s as Y,a8 as x,k as w,y as ee,a as B,q as y,l as g,m as E,z as te,c as P,a5 as oe,h as b,r as C,p as F,n as k,b as u,A as le,G as f,a9 as ae,aa as se,u as ne,g as re,d as ie,B as pe,P as K,O as U}from"../chunks/index.8e69b878.js";import{E as I,C as L,a as _,D as v}from"../chunks/store.55a48864.js";import{b as H,d as q,e as Z,a as S}from"../chunks/index.8d01d5d1.js";import{T as be}from"../chunks/Tutorial.401a5670.js";import{C as G}from"../chunks/Rulebox.92ec5d3f.js";function J(r){let e,l,s,a;return{c(){e=w("button"),l=y("⮜"),this.h()},l(o){e=g(o,"BUTTON",{class:!0});var n=E(e);l=C(n,"⮜"),n.forEach(b),this.h()},h(){k(e,"class","btn-lg btn")},m(o,n){u(o,e,n),f(e,l),s||(a=K(e,"click",r[3]),s=!0)},p:U,d(o){o&&b(e),s=!1,a()}}}function ce(r){let e,l;return{c(){e=w("a"),l=y("INTERACTABLE ⮞"),this.h()},l(s){e=g(s,"A",{href:!0,class:!0});var a=E(e);l=C(a,"INTERACTABLE ⮞"),a.forEach(b),this.h()},h(){k(e,"href","/tutorial/interactable"),k(e,"class","btn-lg btn")},m(s,a){u(s,e,a),f(e,l)},p:U,d(s){s&&b(e)}}}function fe(r){let e,l,s,a;return{c(){e=w("button"),l=y("⮞"),this.h()},l(o){e=g(o,"BUTTON",{class:!0});var n=E(e);l=C(n,"⮞"),n.forEach(b),this.h()},h(){k(e,"class","btn-lg btn")},m(o,n){u(o,e,n),f(e,l),s||(a=K(e,"click",r[4]),s=!0)},p:U,d(o){o&&b(e),s=!1,a()}}}function de(r){let e,l,s,a,o,n,d=r[0]+1+"",A,D,V=r[2].length+"",M,$,O,T;const N=[r[1]];let R={};for(let t=0;t<N.length;t+=1)R=x(R,N[t]);e=new be({props:R});let i=r[0]>0&&J(r);function z(t,c){if(t[0]<t[2].length-1)return fe;if(t[0]===t[2].length-1)return ce}let m=z(r),p=m&&m(r);return{c(){l=w("div"),ee(e.$$.fragment),s=B(),a=B(),o=w("div"),n=w("p"),A=y(d),D=y(" / "),M=y(V),$=B(),i&&i.c(),O=B(),p&&p.c(),this.h()},l(t){l=g(t,"DIV",{style:!0});var c=E(l);te(e.$$.fragment,c),s=P(t),oe("svelte-o08gti",document.head).forEach(b),a=P(t),o=g(t,"DIV",{class:!0});var h=E(o);n=g(h,"P",{class:!0});var j=E(n);A=C(j,d),D=C(j," / "),M=C(j,V),j.forEach(b),$=P(h),i&&i.l(h),O=P(h),p&&p.l(h),h.forEach(b),this.h()},h(){F(l,"display","contents"),F(l,"--header",S),document.title="Emojistan | Tutorial - Controllable",k(n,"class","absolute -top-8 w-full"),k(o,"class","absolute bottom-4 right-4 flex items-center justify-center gap-2")},m(t,c){u(t,l,c),le(e,l,null),u(t,s,c),u(t,a,c),u(t,o,c),f(o,n),f(n,A),f(n,D),f(n,M),f(o,$),i&&i.m(o,null),f(o,O),p&&p.m(o,null),T=!0},p(t,[c]){const W=c&2?ae(N,[se(t[1])]):{};e.$set(W),(!T||c&1)&&d!==(d=t[0]+1+"")&&ne(A,d),t[0]>0?i?i.p(t,c):(i=J(t),i.c(),i.m(o,O)):i&&(i.d(1),i=null),m===(m=z(t))&&p?p.p(t,c):(p&&p.d(1),p=m&&m(t),p&&(p.c(),p.m(o,null)))},i(t){T||(re(e.$$.fragment,t),T=!0)},o(t){ie(e.$$.fragment,t),T=!1},d(t){t&&e&&b(l),pe(e,t),t&&b(s),t&&b(a),t&&b(o),i&&i.d(),p&&p.d()}}}function ue(r,e,l){const s=[{veilHeight:520,veilColor:"bg-green-50",header:"Controllable",description:"Controllables, as the name suggests, are the emojis that can be controlled by the player. At least one Controllable is required in the map for your game to be playable.",component:G,rbx:{id:"0",type:"controllable",position:{x:0,y:0},width:H,height:q,bgColor:Z,borderColor:S},props:{id:"0",emoji:"baby"},gameProps:{map:new I(new Map([["0_0","baby"]])),controllables:new Map([["1",new L("baby",1,[["any",0]],new _("",0),new v(""))]]),mapClass:"simulation",SIZE:4}},{header:"Controllable",description:"A Controllable has emoji and hp slots for Devolve, Default and Evolve. Controllables can evolve or devolve based on their current HP. <br><br> Side Effects will affect their HP and those Side Effects should be chosen from Effectors.",component:G,rbx:{id:"4",type:"controllable",position:{x:0,y:0},width:H,height:q,bgColor:Z,borderColor:S},props:{id:"4",emoji:"baby",evolve:new _("woman-walking",5),pseudoSideEffects:[["baby-bottle",1]]},gameProps:{map:new I(new Map([["0_0","baby"],["0_10","baby-bottle"],["0_11","baby-bottle"],["0_14","baby-bottle"],["0_15","baby-bottle"]])),controllables:new Map([["4",new L("baby",1,[["3",1]],new _("woman-walking",5),new v(""))],["2",new L("woman-walking",1,[],new _("",0),new v(""))]]),effectors:new Map([["3",{emoji:"baby-bottle",hp:1,type:"equippable"}]]),mapClass:"simulation",SIZE:4}},{header:"Controllable",description:"A Controllable has emoji and hp slots for Devolve, Default and Evolve. Controllables can evolve or devolve based on their current HP. <br><br> Side Effects will affect their HP and those Side Effects should be chosen from Effectors.",component:G,rbx:{id:"5",type:"controllable",position:{x:0,y:0},width:H,height:q,bgColor:Z,borderColor:S},props:{id:"5",emoji:"monkey",devolve:new v("pig"),pseudoSideEffects:[["test-tube",-1]]},gameProps:{map:new I(new Map([["0_0","monkey"],["0_10","test-tube"]])),controllables:new Map([["5",new L("monkey",1,[["3",-1]],new _("",0),new v("pig"))],["2",new L("pig",1,[],new _("",0),new v(""))]]),effectors:new Map([["3",{emoji:"test-tube",hp:1,type:"equippable"}]]),mapClass:"simulation",SIZE:4}}];let a=0,o=s[a];const n=()=>l(0,a--,a),d=()=>l(0,a++,a);return r.$$.update=()=>{r.$$.dirty&1&&l(1,o=s[a])},[a,o,s,n,d]}class ye extends Q{constructor(e){super(),X(this,e,ue,de,Y,{})}}export{ye as component};
