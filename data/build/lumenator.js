!function(){var e,_,n,t,l,o,r={},i=[],u=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function c(e,_){for(var n in _)e[n]=_[n];return e}function s(e){var _=e.parentNode;_&&_.removeChild(e)}function f(_,n,t){var l,o,r,i={};for(r in n)"key"==r?l=n[r]:"ref"==r?o=n[r]:i[r]=n[r];if(arguments.length>2&&(i.children=arguments.length>3?e.call(arguments,2):t),"function"==typeof _&&null!=_.defaultProps)for(r in _.defaultProps)void 0===i[r]&&(i[r]=_.defaultProps[r]);return a(_,i,l,o,null)}function a(e,t,l,o,r){var i={type:e,props:t,key:l,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++n:r};return null!=_.vnode&&_.vnode(i),i}function p(e){return e.children}function d(e,_){this.props=e,this.context=_}function h(e,_){if(null==_)return e.__?h(e.__,e.__.__k.indexOf(e)+1):null;for(var n;_<e.__k.length;_++)if(null!=(n=e.__k[_])&&null!=n.__e)return n.__e;return"function"==typeof e.type?h(e):null}function v(e){var _,n;if(null!=(e=e.__)&&null!=e.__c){for(e.__e=e.__c.base=null,_=0;_<e.__k.length;_++)if(null!=(n=e.__k[_])&&null!=n.__e){e.__e=e.__c.base=n.__e;break}return v(e)}}function y(e){(!e.__d&&(e.__d=!0)&&t.push(e)&&!m.__r++||o!==_.debounceRendering)&&((o=_.debounceRendering)||l)(m)}function m(){for(var e;m.__r=t.length;)e=t.sort((function(e,_){return e.__v.__b-_.__v.__b})),t=[],e.some((function(e){var _,n,t,l,o,r;e.__d&&(o=(l=(_=e).__v).__e,(r=_.__P)&&(n=[],(t=c({},l)).__v=l.__v+1,A(r,l,t,_.__n,void 0!==r.ownerSVGElement,null!=l.__h?[o]:null,n,null==o?h(l):o,l.__h),H(n,l),l.__e!=o&&v(l)))}))}function k(e,_,n,t,l,o,u,c,s,f){var d,v,y,m,k,x,E,S=t&&t.__k||i,C=S.length;for(n.__k=[],d=0;d<_.length;d++)if(null!=(m=n.__k[d]=null==(m=_[d])||"boolean"==typeof m?null:"string"==typeof m||"number"==typeof m||"bigint"==typeof m?a(null,m,null,null,m):Array.isArray(m)?a(p,{children:m},null,null,null):m.__b>0?a(m.type,m.props,m.key,null,m.__v):m)){if(m.__=n,m.__b=n.__b+1,null===(y=S[d])||y&&m.key==y.key&&m.type===y.type)S[d]=void 0;else for(v=0;v<C;v++){if((y=S[v])&&m.key==y.key&&m.type===y.type){S[v]=void 0;break}y=null}A(e,m,y=y||r,l,o,u,c,s,f),k=m.__e,(v=m.ref)&&y.ref!=v&&(E||(E=[]),y.ref&&E.push(y.ref,null,m),E.push(v,m.__c||k,m)),null!=k?(null==x&&(x=k),"function"==typeof m.type&&null!=m.__k&&m.__k===y.__k?m.__d=s=g(m,s,e):s=b(e,m,y,S,k,s),f||"option"!==n.type?"function"==typeof n.type&&(n.__d=s):e.value=""):s&&y.__e==s&&s.parentNode!=e&&(s=h(y))}for(n.__e=x,d=C;d--;)null!=S[d]&&("function"==typeof n.type&&null!=S[d].__e&&S[d].__e==n.__d&&(n.__d=h(t,d+1)),T(S[d],S[d]));if(E)for(d=0;d<E.length;d++)P(E[d],E[++d],E[++d])}function g(e,_,n){var t,l;for(t=0;t<e.__k.length;t++)(l=e.__k[t])&&(l.__=e,_="function"==typeof l.type?g(l,_,n):b(n,l,l,e.__k,l.__e,_));return _}function b(e,_,n,t,l,o){var r,i,u;if(void 0!==_.__d)r=_.__d,_.__d=void 0;else if(null==n||l!=o||null==l.parentNode)e:if(null==o||o.parentNode!==e)e.appendChild(l),r=null;else{for(i=o,u=0;(i=i.nextSibling)&&u<t.length;u+=2)if(i==l)break e;e.insertBefore(l,o),r=o}return void 0!==r?r:l.nextSibling}function x(e,_,n){"-"===_[0]?e.setProperty(_,n):e[_]=null==n?"":"number"!=typeof n||u.test(_)?n:n+"px"}function E(e,_,n,t,l){var o;e:if("style"===_)if("string"==typeof n)e.style.cssText=n;else{if("string"==typeof t&&(e.style.cssText=t=""),t)for(_ in t)n&&_ in n||x(e.style,_,"");if(n)for(_ in n)t&&n[_]===t[_]||x(e.style,_,n[_])}else if("o"===_[0]&&"n"===_[1])o=_!==(_=_.replace(/Capture$/,"")),_=_.toLowerCase()in e?_.toLowerCase().slice(2):_.slice(2),e.l||(e.l={}),e.l[_+o]=n,n?t||e.addEventListener(_,o?C:S,o):e.removeEventListener(_,o?C:S,o);else if("dangerouslySetInnerHTML"!==_){if(l)_=_.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==_&&"list"!==_&&"form"!==_&&"tabIndex"!==_&&"download"!==_&&_ in e)try{e[_]=null==n?"":n;break e}catch(e){}"function"==typeof n||(null!=n&&(!1!==n||"a"===_[0]&&"r"===_[1])?e.setAttribute(_,n):e.removeAttribute(_))}}function S(e){this.l[e.type+!1](_.event?_.event(e):e)}function C(e){this.l[e.type+!0](_.event?_.event(e):e)}function A(n,t,l,o,i,u,f,a,v){var y,m,g,b,x,S,C,A,H,P,T,D=t.type;if(void 0!==t.constructor)return null;null!=l.__h&&(v=l.__h,a=t.__e=l.__e,t.__h=null,u=[a]),(y=_.__b)&&y(t);try{e:if("function"==typeof D){if(A=t.props,H=(y=D.contextType)&&o[y.__c],P=y?H?H.props.value:y.__:o,l.__c?C=(m=t.__c=l.__c).__=m.__E:("prototype"in D&&D.prototype.render?t.__c=m=new D(A,P):(t.__c=m=new d(A,P),m.constructor=D,m.render=w),H&&H.sub(m),m.props=A,m.state||(m.state={}),m.context=P,m.__n=o,g=m.__d=!0,m.__h=[]),null==m.__s&&(m.__s=m.state),null!=D.getDerivedStateFromProps&&(m.__s==m.state&&(m.__s=c({},m.__s)),c(m.__s,D.getDerivedStateFromProps(A,m.__s))),b=m.props,x=m.state,g)null==D.getDerivedStateFromProps&&null!=m.componentWillMount&&m.componentWillMount(),null!=m.componentDidMount&&m.__h.push(m.componentDidMount);else{if(null==D.getDerivedStateFromProps&&A!==b&&null!=m.componentWillReceiveProps&&m.componentWillReceiveProps(A,P),!m.__e&&null!=m.shouldComponentUpdate&&!1===m.shouldComponentUpdate(A,m.__s,P)||t.__v===l.__v){m.props=A,m.state=m.__s,t.__v!==l.__v&&(m.__d=!1),m.__v=t,t.__e=l.__e,t.__k=l.__k,t.__k.forEach((function(e){e&&(e.__=t)})),m.__h.length&&f.push(m);break e}null!=m.componentWillUpdate&&m.componentWillUpdate(A,m.__s,P),null!=m.componentDidUpdate&&m.__h.push((function(){m.componentDidUpdate(b,x,S)}))}m.context=P,m.props=A,m.state=m.__s,(y=_.__r)&&y(t),m.__d=!1,m.__v=t,m.__P=n,y=m.render(m.props,m.state,m.context),m.state=m.__s,null!=m.getChildContext&&(o=c(c({},o),m.getChildContext())),g||null==m.getSnapshotBeforeUpdate||(S=m.getSnapshotBeforeUpdate(b,x)),T=null!=y&&y.type===p&&null==y.key?y.props.children:y,k(n,Array.isArray(T)?T:[T],t,l,o,i,u,f,a,v),m.base=t.__e,t.__h=null,m.__h.length&&f.push(m),C&&(m.__E=m.__=null),m.__e=!1}else null==u&&t.__v===l.__v?(t.__k=l.__k,t.__e=l.__e):t.__e=function(_,n,t,l,o,i,u,c){var f,a,p,d=t.props,v=n.props,y=n.type,m=0;if("svg"===y&&(o=!0),null!=i)for(;m<i.length;m++)if((f=i[m])&&(f===_||(y?f.localName==y:3==f.nodeType))){_=f,i[m]=null;break}if(null==_){if(null===y)return document.createTextNode(v);_=o?document.createElementNS("http://www.w3.org/2000/svg",y):document.createElement(y,v.is&&v),i=null,c=!1}if(null===y)d===v||c&&_.data===v||(_.data=v);else{if(i=i&&e.call(_.childNodes),a=(d=t.props||r).dangerouslySetInnerHTML,p=v.dangerouslySetInnerHTML,!c){if(null!=i)for(d={},m=0;m<_.attributes.length;m++)d[_.attributes[m].name]=_.attributes[m].value;(p||a)&&(p&&(a&&p.__html==a.__html||p.__html===_.innerHTML)||(_.innerHTML=p&&p.__html||""))}if(function(e,_,n,t,l){var o;for(o in n)"children"===o||"key"===o||o in _||E(e,o,null,n[o],t);for(o in _)l&&"function"!=typeof _[o]||"children"===o||"key"===o||"value"===o||"checked"===o||n[o]===_[o]||E(e,o,_[o],n[o],t)}(_,v,d,o,c),p)n.__k=[];else if(m=n.props.children,k(_,Array.isArray(m)?m:[m],n,t,l,o&&"foreignObject"!==y,i,u,i?i[0]:t.__k&&h(t,0),c),null!=i)for(m=i.length;m--;)null!=i[m]&&s(i[m]);c||("value"in v&&void 0!==(m=v.value)&&(m!==_.value||"progress"===y&&!m)&&E(_,"value",m,d.value,!1),"checked"in v&&void 0!==(m=v.checked)&&m!==_.checked&&E(_,"checked",m,d.checked,!1))}return _}(l.__e,t,l,o,i,u,f,v);(y=_.diffed)&&y(t)}catch(n){t.__v=null,(v||null!=u)&&(t.__e=a,t.__h=!!v,u[u.indexOf(a)]=null),_.__e(n,t,l)}}function H(e,n){_.__c&&_.__c(n,e),e.some((function(n){try{e=n.__h,n.__h=[],e.some((function(e){e.call(n)}))}catch(e){_.__e(e,n.__v)}}))}function P(e,n,t){try{"function"==typeof e?e(n):e.current=n}catch(e){_.__e(e,t)}}function T(e,n,t){var l,o;if(_.unmount&&_.unmount(e),(l=e.ref)&&(l.current&&l.current!==e.__e||P(l,null,n)),null!=(l=e.__c)){if(l.componentWillUnmount)try{l.componentWillUnmount()}catch(e){_.__e(e,n)}l.base=l.__P=null}if(l=e.__k)for(o=0;o<l.length;o++)l[o]&&T(l[o],n,"function"!=typeof e.type);t||null==e.__e||s(e.__e),e.__e=e.__d=void 0}function w(e,_,n){return this.constructor(e,n)}function D(n,t,l){var o,i,u;_.__&&_.__(n,t),i=(o="function"==typeof l)?null:l&&l.__k||t.__k,u=[],A(t,n=(!o&&l||t).__k=f(p,null,[n]),i||r,r,void 0!==t.ownerSVGElement,!o&&l?[l]:i?null:t.firstChild?e.call(t.childNodes):null,u,!o&&l?l:i?i.__e:t.firstChild,o),H(u,n)}e=i.slice,_={__e:function(e,_){for(var n,t,l;_=_.__;)if((n=_.__c)&&!n.__)try{if((t=n.constructor)&&null!=t.getDerivedStateFromError&&(n.setState(t.getDerivedStateFromError(e)),l=n.__d),null!=n.componentDidCatch&&(n.componentDidCatch(e),l=n.__d),l)return n.__E=n}catch(_){e=_}throw e}},n=0,d.prototype.setState=function(e,_){var n;n=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=c({},this.state),"function"==typeof e&&(e=e(c({},n),this.props)),e&&c(n,e),null!=e&&this.__v&&(_&&this.__h.push(_),y(this))},d.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),y(this))},d.prototype.render=p,t=[],l="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,m.__r=0;const N=e=>f("div",{class:"lum-Chip"},e.text||e.children);var F,M,U,L=0,W=[],I=_.__b,q=_.__r,R=_.diffed,B=_.__c,O=_.unmount;function $(e){return L=1,function(e,n,t){var l=function(e,n){_.__h&&_.__h(M,e,L||n),L=0;var t=M.__H||(M.__H={__:[],__h:[]});return e>=t.__.length&&t.__.push({}),t.__[e]}(F++,2);return l.t=e,l.__c||(l.__=[t?t(n):Q(void 0,n),function(e){var _=l.t(l.__[0],e);l.__[0]!==_&&(l.__=[_,l.__[1]],l.__c.setState({}))}],l.__c=M),l.__}(Q,e)}function G(){W.forEach((function(e){if(e.__P)try{e.__H.__h.forEach(j),e.__H.__h.forEach(z),e.__H.__h=[]}catch(n){e.__H.__h=[],_.__e(n,e.__v)}})),W=[]}_.__b=function(e){M=null,I&&I(e)},_.__r=function(e){q&&q(e),F=0;var _=(M=e.__c).__H;_&&(_.__h.forEach(j),_.__h.forEach(z),_.__h=[])},_.diffed=function(e){R&&R(e);var n=e.__c;n&&n.__H&&n.__H.__h.length&&(1!==W.push(n)&&U===_.requestAnimationFrame||((U=_.requestAnimationFrame)||function(e){var _,n=function(){clearTimeout(t),V&&cancelAnimationFrame(_),setTimeout(e)},t=setTimeout(n,100);V&&(_=requestAnimationFrame(n))})(G)),M=void 0},_.__c=function(e,n){n.some((function(e){try{e.__h.forEach(j),e.__h=e.__h.filter((function(e){return!e.__||z(e)}))}catch(t){n.some((function(e){e.__h&&(e.__h=[])})),n=[],_.__e(t,e.__v)}})),B&&B(e,n)},_.unmount=function(e){O&&O(e);var n=e.__c;if(n&&n.__H)try{n.__H.__.forEach(j)}catch(e){_.__e(e,n.__v)}};var V="function"==typeof requestAnimationFrame;function j(e){var _=M;"function"==typeof e.__c&&e.__c(),M=_}function z(e){var _=M;e.__c=e.__(),M=_}function Q(e,_){return"function"==typeof _?_(e):_}const J=e=>{const[_,n]=$(e.activeId||0);return f(p,null,f("div",{class:"lum-Nav"},f("ul",{class:"lum-NavMenu"},Array.isArray(e.children)?e.children.map(e=>{const t=e.props;return f("li",{class:"tab"+(e.props.id===_?" active":""),onClick:()=>{n(e.props.id)}},t.title)}):e.children.props?f("li",{class:"tab active"},e.children.props.title):void 0)),f("main",null,Array.isArray(e.children)?e.children.find(e=>e.props.id===_):e.children.props?e.children:void 0))},K=e=>f("div",null,e.children);document.body.id;D(f(()=>f("div",{id:"lumenator-web-app"},f("header",null,f("div",{class:"header-container"},f("div",{class:"header-items"},f("h2",null,"Lumenator"),f(N,{text:"test"}),f("div",{class:"version"},"v1.0")))),f(J,{activeId:1},f(K,{id:1,title:"Control"},"Tab 1 stuff"),f(K,{id:2,title:"Device"}),f(K,{id:3,title:"MQTT"}),f(K,{id:4,title:"Network"}))),null),document.body)}();