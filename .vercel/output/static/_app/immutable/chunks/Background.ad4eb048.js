import{S as w,i as j,s as B,k as p,l as v,m as x,h as u,n as y,b as $,K as D,L as m,a2 as E,a3 as M,O as q}from"./index.8e69b878.js";import{e as I}from"./emojis.b121f429.js";import{s as _}from"./index.8d01d5d1.js";function d(i,e,l){const n=i.slice();return n[7]=e[l],n[9]=l,n}function g(i){let e,l,n;return{c(){e=p("i"),this.h()},l(r){e=v(r,"I",{class:!0}),x(e).forEach(u),this.h()},h(){y(e,"class",(i[9]%2==0?"text-2xl":"text-4xl")+" shape twa twa-"+i[7]+" left-0 top-0 svelte-q8fbcu")},m(r,a){$(r,e,a),l||(n=M(i[1].call(null,e,this)),l=!0)},p:q,d(r){r&&u(e),l=!1,n()}}}function L(i){let e,l,n,r=i[0],a=[];for(let s=0;s<r.length;s+=1)a[s]=g(d(i,r,s));return{c(){e=p("div");for(let s=0;s<a.length;s+=1)a[s].c();this.h()},l(s){e=v(s,"DIV",{class:!0});var o=x(e);for(let t=0;t<a.length;t+=1)a[t].l(o);o.forEach(u),this.h()},h(){y(e,"class","h-screen w-screen")},m(s,o){$(s,e,o);for(let t=0;t<a.length;t+=1)a[t]&&a[t].m(e,null);n=!0},p(s,[o]){if(o&1){r=s[0];let t;for(t=0;t<r.length;t+=1){const c=d(s,r,t);a[t]?a[t].p(c,o):(a[t]=g(c),a[t].c(),a[t].m(e,null))}for(;t<a.length;t+=1)a[t].d(1);a.length=r.length}},i(s){n||(D(()=>{n&&(l||(l=m(e,_,{},!0)),l.run(1))}),n=!0)},o(s){l||(l=m(e,_,{},!1)),l.run(0),n=!1},d(s){s&&u(e),E(a,s),s&&l&&l.end()}}}function f(i,e){return Math.random()*(e-i)+i}function O(i){let e=[];for(let t of Object.values(I))e.push(t[Math.round(f(0,t.length))]),e.push(t[Math.round(f(0,t.length))]);const[l,n,r,a]=[0,100,-180,180];function s(t){let[c,b,k,h]=[f(l,n),f(l,n),f(r,a),f(1,t?5:2.5)];return`translate(${c}vw, ${b}vh) rotate(${k}deg) scale(${h}, ${h})`}function o(t){let c=t.init?f(50,100):f(0,1);t.style.transition=`transform ${c}s`,t.style.transform=s(t.classList.contains("small")),c=t.init?c:0,setTimeout(()=>{t.init=!0,o(t)},c*1e3+1e3)}return[e,o]}class T extends w{constructor(e){super(),j(this,e,O,L,B,{})}}export{T as B};
