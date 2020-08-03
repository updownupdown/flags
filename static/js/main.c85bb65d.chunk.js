(this.webpackJsonpflags=this.webpackJsonpflags||[]).push([[0],{20:function(e,t,a){e.exports=a(45)},25:function(e,t,a){},44:function(e,t,a){},45:function(e,t,a){"use strict";a.r(t);var r=a(0),n=a.n(r),c=a(18),s=a.n(c),o=(a(25),a(11)),l=a(1),u=function(e){return n.a.createElement("div",{className:"header"},n.a.createElement("span",{className:"logo"},"World Flags Quiz"),n.a.createElement(o.b,{activeClassName:"active",to:"/",exact:!0},"Take Quiz"),n.a.createElement(o.b,{activeClassName:"active",to:"/study"},"Study Flags"),n.a.createElement("a",{className:"about",href:"https://github.com/updownupdown/flags",target:"_blank",rel:"noopener noreferrer"},"About"))},m=a(12),i=a(6),f=a(9),d=a.n(f),E=a(8),g=a.n(E),p=function(e){return n.a.createElement("div",{className:"question"},n.a.createElement("span",{className:"instructions"},"flag"===e.questionType&&"Which flag belongs to:","name"===e.questionType&&"Which country has this flag:"),function(){switch(e.questionType){case"name":return n.a.createElement("div",{className:"flag"},n.a.createElement(g.a,{code:e.answer.code.iso2}));case"flag":return n.a.createElement("span",{className:"country-name"},e.answer.name);default:throw new Error}}())},b=(a(44),function(e){function t(){return(0===e.score.correct&&0===e.score.incorrect?50:Math.round(e.score.correct/(e.score.correct+e.score.incorrect)*100)).toString()}return n.a.createElement("div",{className:"score"},n.a.createElement("div",{className:"score-top"},n.a.createElement("span",{className:"score-perc"},"Score: ",t(),"%"),n.a.createElement("span",{className:"score-bar"},n.a.createElement("span",{className:"score-bar-result correct ".concat(!e.isQuestion&&""!==e.guess&&e.guess===e.answer.name&&"highlight"),style:{width:"".concat(t(),"%")}},n.a.createElement("span",{className:"score-bar-result-count"},e.score.correct)),n.a.createElement("span",{className:"score-bar-result incorrect ".concat(!e.isQuestion&&""!==e.guess&&e.guess!==e.answer.name&&"highlight"),style:{width:"".concat(100-t(),"%")}},n.a.createElement("span",{className:"score-bar-result-count"},e.score.incorrect)))),n.a.createElement("div",{className:"score-bottom"},n.a.createElement("span",{className:"score-tally"},"Correct",n.a.createElement("br",null),e.score.correct," / ",e.score.correct+e.score.incorrect),n.a.createElement("span",{className:"score-streak-current"},"Current streak",n.a.createElement("br",null),e.score.streakCurrent),n.a.createElement("span",{className:"score-streak-longest"},"Longest streak",n.a.createElement("br",null),e.score.streakLongest),n.a.createElement("button",{className:"score-reset",onClick:function(){e.setScore({type:"reset"})}},"Reset score")))});var h=function(e){var t={correct:0,incorrect:0,streakCurrent:0,streakLongest:0,lastCorrect:!1},a=function(e,t,a){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,c=Object(r.useReducer)(e,t,(function(e){var t=JSON.parse(localStorage.getItem(a));return null!==t?t:null!==n?n(e):e}));return Object(r.useEffect)((function(){localStorage.setItem(a,JSON.stringify(c[0]))}),[a,c]),c}((function(e,a){switch(a.type){case"reset":return t;case"correct":return Object(m.a)(Object(m.a)({},e),{},{correct:e.correct+1,lastCorrect:!0,streakCurrent:e.streakCurrent+1,streakLongest:e.streakCurrent>=e.streakLongest?e.streakCurrent+1:e.streakLongest});case"incorrect":return Object(m.a)(Object(m.a)({},e),{},{incorrect:e.incorrect+1,lastCorrect:!1,streakCurrent:0});default:throw new Error}}),t,"score"),c=Object(i.a)(a,2),s=c[0],o=c[1],l=d.a.ls("name").sort(),u=l.length;function f(){return d.a.findByName(l[Math.floor(Math.random()*(u-1))])}var E=Object(r.useState)("flag"),h=Object(i.a)(E,2),v=h[0],N=h[1],y=Object(r.useState)(""),k=Object(i.a)(y,2),w=k[0],O=k[1],j=Object(r.useState)(f),C=Object(i.a)(j,2),S=C[0],x=C[1],L=Object(r.useState)(!0),q=Object(i.a)(L,2),M=q[0],Q=q[1];function F(){x(f),N(function(e){var t="flag";return"flag"===e&&(t="name"),t}(v)),Q(!0)}var I=Object(r.useState)([]),T=Object(i.a)(I,2),W=T[0],B=T[1];function J(e){var t="option";return e===S.name?w===S.name?t+=" correct-guessed":t+=" correct-not-guessed":t+=e===w?" incorrect-guess":" other",t}return Object(r.useEffect)((function(){if(M){for(var e=[S];e.length<6;){var t=f();e.includes(t)||e.push(t)}B(function(e){for(var t=e.length-1;t>0;t--){var a=Math.floor(Math.random()*(t+1)),r=e[t];e[t]=e[a],e[a]=r}return e}(e))}}),[M]),document.body.onkeydown=function(e){(function(){var e=document.activeElement;if(e&&-1!==["input","select","textarea"].indexOf(e.tagName.toLowerCase()))return!0})()||"Enter"===e.key&&(M||F())},n.a.createElement(n.a.Fragment,null,n.a.createElement(b,{answer:S,score:s,setScore:o,guess:w,isQuestion:M}),n.a.createElement(p,{answer:S,questionType:v}),n.a.createElement("div",{className:"button-group options-".concat(v)},W.map((function(e){return n.a.createElement("button",{disabled:!M,key:e.name,tabIndex:0,className:J(e.name),onClick:function(){var t;t=e.name,O(t),Q(!1),t===S.name?o({type:"correct"}):o({type:"incorrect"})}},"name"===v&&e.name,"flag"===v&&n.a.createElement("div",{className:"flag"},n.a.createElement(g.a,{code:e.code.iso2})))}))),n.a.createElement("button",{disabled:M,tabIndex:0,className:"next-question",onClick:function(){F()}},"Next Question"))},v=function(e){var t=d.a.ls("name").sort();return n.a.createElement(n.a.Fragment,null,n.a.createElement("h1",null,"Study Flags"),n.a.createElement("div",{className:"study"},t.map((function(e){var t=d.a.findByName(e);return n.a.createElement("div",{key:e,className:"country"},n.a.createElement("div",{className:"info"},n.a.createElement("span",{className:"name"},e),n.a.createElement("span",{className:"capital"},t.capital)),n.a.createElement("div",{className:"flag"},n.a.createElement(g.a,{code:t.code.iso2})))}))))};var N=function(){return n.a.createElement(o.a,{basename:"/flags"},n.a.createElement("div",{className:"layout"},n.a.createElement("div",{className:"layout-center"},n.a.createElement("div",{className:"layout-top"},n.a.createElement(u,null)),n.a.createElement("div",{className:"layout-bottom"},n.a.createElement(l.c,null,n.a.createElement(l.a,{exact:!0,path:"/",component:h}),n.a.createElement(l.a,{path:"/study",component:v}))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(n.a.createElement(n.a.StrictMode,null,n.a.createElement(N,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[20,1,2]]]);
//# sourceMappingURL=main.c85bb65d.chunk.js.map