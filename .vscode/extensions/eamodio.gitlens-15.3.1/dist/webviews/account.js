var e={d:(t,o)=>{for(var i in o)e.o(o,i)&&!e.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:o[i]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};void 0!==e&&Object.defineProperty(e,"p",{get:function(){try{if("string"!=typeof webpackResourceBasePath)throw new Error("WebpackRequireFrom: 'webpackResourceBasePath' is not a string or not available at runtime. See https://github.com/agoldis/webpack-require-from#troubleshooting");return webpackResourceBasePath}catch(e){return"#{root}/dist/webviews/"}},set:function(e){}});var t={};e.d(t,{r:()=>AccountApp});class IpcCall{constructor(e,t,o=!1,i=!1){this.scope=e,this.reset=o,this.pack=i,this.method=`${e}/${t}`}is(e){return e.method===this.method}}class IpcCommand extends IpcCall{}class IpcNotification extends IpcCall{}const o=new IpcCommand("core","webview/ready"),i=new IpcCommand("core","webview/focus/changed"),r=new IpcCommand("core","command/execute"),s=(new IpcCommand("core","configuration/update"),new IpcNotification("core","window/focus/didChange"),new IpcCommand("core","webview/focus/didChange"));new IpcNotification("core","configuration/didChange");const a=new IpcNotification("account","subscription/didChange");function l(e,t,o){let i,r,s,a,l;function c(e){const o=e-(r??0);return null==r||o>=t||o<0}function d(){const e=Date.now();if(c(e))h();else{l=setTimeout(d,t-(e-(r??0)))}}function h(){return l=void 0,i?function(){const t=i,o=s;return i=s=void 0,a=e.apply(o,t),a}():(i=void 0,s=void 0,a)}function u(...e){const h=Date.now(),u=c(h);return i=null!=o&&i?o(i,e):e,s=this,r=h,u&&null==l?(l=setTimeout(d,t),a):(null==l&&(l=setTimeout(d,t)),a)}return u.cancel=function(){null!=l&&clearTimeout(l),i=void 0,r=void 0,s=void 0,l=void 0},u.flush=function(){return null==l?a:(clearTimeout(l),h())},u.pending=function(){return null!=l},u}const c=",",d="=",h="{",u="(",p=")",f=/\(([\s\S]*)\)/,g=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,m=/\s?=.*$/;function v(e){const t=.001*performance.now();let o=Math.floor(t),i=Math.floor(t%1*1e9);return void 0!==e&&(o-=e[0],i-=e[1],i<0&&(o--,i+=1e9)),[o,i]}const y=500;function w(){let e=0;return{get current(){return e},next:function(){return 1073741823===e&&(e=0),++e}}}const _=w(),x=new Map;function $(e){x.delete(e)}function A(e,t){if(null!=t)return{scopeId:t.scopeId,prefix:`${t.prefix}${e}`};const o=_.next();return{scopeId:o,prefix:`[${String(o).padStart(5)}] ${e}`}}Error;function S(e){return null!=e&&(e instanceof Promise||"function"==typeof e?.then)}Error;Object.freeze({".png":"image/png",".gif":"image/gif",".jpg":"image/jpeg",".jpeg":"image/jpeg",".jpe":"image/jpeg",".webp":"image/webp",".tif":"image/tiff",".tiff":"image/tiff",".bmp":"image/bmp"});const P=Object.freeze({codeSuggest:"https://gitkraken.com/solutions/code-suggest?utm_source=gitlens-extension&utm_medium=in-app-links",cloudPatches:"https://gitkraken.com/solutions/cloud-patches?utm_source=gitlens-extension&utm_medium=in-app-links",graph:"https://gitkraken.com/solutions/commit-graph?utm_source=gitlens-extension&utm_medium=in-app-links",launchpad:"https://gitkraken.com/solutions/launchpad?utm_source=gitlens-extension&utm_medium=in-app-links",platform:"https://gitkraken.com/devex?utm_source=gitlens-extension&utm_medium=in-app-links",pricing:"https://gitkraken.com/gitlens/pricing?utm_source=gitlens-extension&utm_medium=in-app-links",proFeatures:"https://gitkraken.com/gitlens/pro-features?utm_source=gitlens-extension&utm_medium=in-app-links",security:"https://help.gitkraken.com/gitlens/security?utm_source=gitlens-extension&utm_medium=in-app-links",workspaces:"https://gitkraken.com/solutions/workspaces?utm_source=gitlens-extension&utm_medium=in-app-links",cli:"https://gitkraken.com/cli?utm_source=gitlens-extension&utm_medium=in-app-links",browserExtension:"https://gitkraken.com/browser-extension?utm_source=gitlens-extension&utm_medium=in-app-links",desktop:"https://gitkraken.com/git-client?utm_source=gitlens-extension&utm_medium=in-app-links",releaseNotes:"https://help.gitkraken.com/gitlens/gitlens-release-notes-current/",releaseAnnouncement:"https://www.gitkraken.com/blog/gitkraken-launches-devex-platform-acquires-codesee?utm_source=gitlens-extension&utm_medium=in-app-links"});var C=(e=>(e[e.Hash=35]="Hash",e[e.Slash=47]="Slash",e[e.Digit0=48]="Digit0",e[e.Digit1=49]="Digit1",e[e.Digit2=50]="Digit2",e[e.Digit3=51]="Digit3",e[e.Digit4=52]="Digit4",e[e.Digit5=53]="Digit5",e[e.Digit6=54]="Digit6",e[e.Digit7=55]="Digit7",e[e.Digit8=56]="Digit8",e[e.Digit9=57]="Digit9",e[e.Backslash=92]="Backslash",e[e.A=65]="A",e[e.B=66]="B",e[e.C=67]="C",e[e.D=68]="D",e[e.E=69]="E",e[e.F=70]="F",e[e.Z=90]="Z",e[e.a=97]="a",e[e.b=98]="b",e[e.c=99]="c",e[e.d=100]="d",e[e.e=101]="e",e[e.f=102]="f",e[e.z=122]="z",e))(C||{});const{fromCharCode:E}=String;new TextEncoder;function T(e){const[t,o]=v(e);return 1e3*t+Math.floor(o/1e6)}const D=Symbol("logInstanceNameFn");function z(e){return function(e,t=!1){let o,i,r,s,a,l=0,w=!1,A=!1,P=!0;null!=e&&({args:o,if:i,enter:r,exit:s,prefix:a,logThreshold:l=0,scoped:w=!0,singleLine:A=!1,timed:P=!0}=e);l>0&&(A=!0,P=!0);P&&(w=!0);const C=O.isDebugging,E=t?O.debug:O.log,z=C?"debug":"info";return(e,t,B)=>{let F,U;if("function"==typeof B.value?(F=B.value,U="value"):"function"==typeof B.get&&(F=B.get,U="get"),null==F||null==U)throw new Error("Not supported");const N=!1!==o?function(e){if("function"!=typeof e)throw new Error("Not supported");if(0===e.length)return[];let t=Function.prototype.toString.call(e);t=t.replace(g,"")||t,t=t.slice(0,t.indexOf(h));let o=t.indexOf(u),i=t.indexOf(p);o=o>=0?o+1:0,i=i>0?i:t.indexOf(d),t=t.slice(o,i),t=`(${t})`;const r=f.exec(t);return null!=r?r[1].split(c).map((e=>e.trim().replace(m,""))):[]}(F):[];B[U]=function(...e){if(!C&&!O.enabled(z)||null!=i&&!i.apply(this,e))return F.apply(this,e);const c=_.next(),d=null!=this?function(e){let t;if("function"==typeof e){if(null==e.prototype?.constructor)return e.name;t=e.prototype.constructor}else t=e.constructor;let o=t?.name??"";const i=o.indexOf("_");o=-1===i?o:o.substr(i+1),null!=t?.[D]&&(o=t[D](e,o));return o}(this):void 0;let h,u=d?w?`[${c.toString(16).padStart(5)}] ${d}.${t}`:`${d}.${t}`:t;null!=a&&(u=a({id:c,instance:this,instanceName:d??"",name:t,prefix:u},...e)),w&&(h={scopeId:c,prefix:u},function(e,t){x.set(e,t)}(c,h));const p=null!=r?r(...e):"";let f;if(!1===o||0===e.length)f="",A||E.call(O,`${u}${p}`);else{let t;f="";let i,r,s,a=-1;for(s of e){if(i=N[++a],t=o?.[a],null!=t){if("boolean"==typeof t)continue;if(f.length>0&&(f+=", "),"string"==typeof t){f+=t;continue}r=String(t(s))}else f.length>0&&(f+=", "),r=O.toLoggable(s);f+=i?`${i}=${r}`:r}A||E.call(O,f?`${u}${p}(${f})`:`${u}${p}`)}if(A||P||null!=s){const t=P?v():void 0,o=e=>{const o=void 0!==t?` [${T(t)}ms]`:"";A?O.error(e,f?`${u}${p}(${f})`:`${u}${p}`,h?.exitDetails?`failed${h.exitDetails}${o}`:`failed${o}`):O.error(e,u,h?.exitDetails?`failed${h.exitDetails}${o}`:`failed${o}`),w&&$(c)};let i;try{i=F.apply(this,e)}catch(e){throw o(e),e}const r=e=>{let o,i,r,a;if(null!=t?(o=T(t),o>y?(i=O.warn,r=` [*${o}ms] (slow)`):(i=E,r=` [${o}ms]`)):(r="",i=E),null!=s)if("function"==typeof s)try{a=s(e)}catch(e){a=`@log.exit error: ${e}`}else!0===s&&(a=`returned ${O.toLoggable(e)}`);else h?.exitFailed?(a=h.exitFailed,i=O.error):a="completed";A?(0===l||o>l)&&i.call(O,f?`${u}${p}(${f}) ${a}${h?.exitDetails||""}${r}`:`${u}${p} ${a}${h?.exitDetails||""}${r}`):i.call(O,f?`${u}(${f}) ${a}${h?.exitDetails||""}${r}`:`${u} ${a}${h?.exitDetails||""}${r}`),w&&$(c)};return null!=i&&S(i)?i.then(r,o):r(i),i}return F.apply(this,e)}}}(e,!0)}const O=new class Logger2{constructor(){this._isDebugging=!1,this.level=0,this._logLevel="off"}configure(e,t,o=!1){this.provider=e,this._isDebugging=o,this.logLevel=t}enabled(e){return this.level>=B(e)}get isDebugging(){return this._isDebugging}get logLevel(){return this._logLevel}set logLevel(e){this._logLevel=e,this.level=B(this._logLevel),"off"===e?(this.output?.dispose?.(),this.output=void 0):this.output??=this.provider.createChannel(this.provider.name)}get timestamp(){return`[${(new Date).toISOString().replace(/T/," ").slice(0,-1)}]`}debug(e,...t){if(this.level<4&&!this.isDebugging)return;let o;"string"==typeof e?o=e:(o=t.shift(),null!=e&&(o=`${e.prefix} ${o??""}`)),this.isDebugging,null==this.output||this.level<4||this.output.appendLine(`${this.timestamp} ${o??""}${this.toLoggableParams(!0,t)}`)}error(e,t,...o){if(this.level<1&&!this.isDebugging)return;let i;if(i=null==t||"string"==typeof t?t:`${t.prefix} ${o.shift()??""}`,null==i){const t=e instanceof Error?e.stack:void 0;if(t){const e=/.*\s*?at\s(.+?)\s/.exec(t);null!=e&&(i=e[1])}}this.isDebugging,null==this.output||this.level<1||this.output.appendLine(`${this.timestamp} ${i??""}${this.toLoggableParams(!1,o)}${null!=e?`\n${String(e)}`:""}`)}log(e,...t){if(this.level<3&&!this.isDebugging)return;let o;"string"==typeof e?o=e:(o=t.shift(),null!=e&&(o=`${e.prefix} ${o??""}`)),this.isDebugging,null==this.output||this.level<3||this.output.appendLine(`${this.timestamp} ${o??""}${this.toLoggableParams(!1,t)}`)}warn(e,...t){if(this.level<2&&!this.isDebugging)return;let o;"string"==typeof e?o=e:(o=t.shift(),null!=e&&(o=`${e.prefix} ${o??""}`)),this.isDebugging,null==this.output||this.level<2||this.output.appendLine(`${this.timestamp} ${o??""}${this.toLoggableParams(!1,t)}`)}showOutputChannel(e){this.output?.show?.(e)}toLoggable(e,t){if("object"!=typeof e)return String(e);if(Array.isArray(e))return`[${e.map((e=>this.toLoggable(e,t))).join(", ")}]`;const o=this.provider.toLoggable?.(e);if(null!=o)return o;try{return JSON.stringify(e,t)}catch{return"<error>"}}toLoggableParams(e,t){if(0===t.length||e&&this.level<4&&!this.isDebugging)return"";const o=t.map((e=>this.toLoggable(e))).join(", ");return 0!==o.length?` — ${o}`:""}};function B(e){switch(e){case"off":default:return 0;case"error":return 1;case"warn":return 2;case"info":return 3;case"debug":return 4}}const F={enabled:e=>O.enabled(e)||O.isDebugging,log:(e,t,o,...i)=>{switch(e){case"error":O.error("",t,o,...i);break;case"warn":O.warn(t,o,...i);break;case"info":O.log(t,o,...i);break;default:O.debug(t,o,...i)}}};var U;(U||(U={})).on=function(e,t,o,i){let r=!1;if("string"==typeof e){const s=function(t){const i=t?.target?.closest(e);null!=i&&o(t,i)};return document.addEventListener(t,s,i??!0),{dispose:()=>{r||(r=!0,document.removeEventListener(t,s,i??!0))}}}const s=function(e){o(e,this)};return e.addEventListener(t,s,i??!1),{dispose:()=>{r||(r=!0,e.removeEventListener(t,s,i??!1))}}},Symbol.dispose??=Symbol("Symbol.dispose"),Symbol.asyncDispose??=Symbol("Symbol.asyncDispose");class Stopwatch{constructor(e,t,...o){let i;if(this._stopped=!1,this.logScope=null!=e&&"string"!=typeof e?e:A(e??""),i="boolean"==typeof t?.log?t.log?{}:void 0:t?.log??{},this.logLevel=t?.logLevel??"info",this.logProvider=t?.provider??F,this._time=v(),null!=i){if(!this.logProvider.enabled(this.logLevel))return;o.length?this.logProvider.log(this.logLevel,this.logScope,`${i.message??""}${i.suffix??""}`,...o):this.logProvider.log(this.logLevel,this.logScope,`${i.message??""}${i.suffix??""}`)}}get startTime(){return this._time}[Symbol.dispose](){this.stop()}elapsed(){const[e,t]=v(this._time);return 1e3*e+Math.floor(t/1e6)}log(e){this.logCore(e,!1)}restart(e){this.logCore(e,!0),this._time=v(),this._stopped=!1}stop(e){this._stopped||(this.restart(e),this._stopped=!0)}logCore(e,t){if(!this.logProvider.enabled(this.logLevel))return;if(!t)return void this.logProvider.log(this.logLevel,this.logScope,`${e?.message??""}${e?.suffix??""}`);const[o,i]=v(this._time),r=1e3*o+Math.floor(i/1e6),s=e?.message??"";this.logProvider.log(r>250?"warn":this.logLevel,this.logScope,`${s?`${s} `:""}[${r}ms]${e?.suffix??""}`)}}const N=class _Emitter{constructor(){this._disposed=!1}get event(){return null==this._event&&(this._event=(e,t,o)=>{null==this.listeners&&(this.listeners=new LinkedList);const i=this.listeners.push(null==t?e:[e,t]),r={dispose:()=>{r.dispose=_Emitter._noop,this._disposed||i()}};return Array.isArray(o)&&o.push(r),r}),this._event}fire(e){if(null!=this.listeners){null==this._deliveryQueue&&(this._deliveryQueue=new LinkedList);for(let t=this.listeners.iterator(),o=t.next();!o.done;o=t.next())this._deliveryQueue.push([o.value,e]);for(;this._deliveryQueue.size>0;){const[e,t]=this._deliveryQueue.shift();try{"function"==typeof e?e(t):e[0].call(e[1],t)}catch(e){}}}}dispose(){this.listeners?.clear(),this._deliveryQueue?.clear(),this._disposed=!0}};N._noop=function(){};let j=N;const q={done:!0,value:void 0},G=class _Node{constructor(e){this.element=e,this.next=_Node.Undefined,this.prev=_Node.Undefined}};G.Undefined=new G(void 0);let W=G;class LinkedList{constructor(){this._first=W.Undefined,this._last=W.Undefined,this._size=0}get size(){return this._size}isEmpty(){return this._first===W.Undefined}clear(){this._first=W.Undefined,this._last=W.Undefined,this._size=0}unshift(e){return this._insert(e,!1)}push(e){return this._insert(e,!0)}_insert(e,t){const o=new W(e);if(this._first===W.Undefined)this._first=o,this._last=o;else if(t){const e=this._last;this._last=o,o.prev=e,e.next=o}else{const e=this._first;this._first=o,o.next=e,e.prev=o}this._size+=1;let i=!1;return()=>{i||(i=!0,this._remove(o))}}shift(){if(this._first===W.Undefined)return;const e=this._first.element;return this._remove(this._first),e}pop(){if(this._last===W.Undefined)return;const e=this._last.element;return this._remove(this._last),e}_remove(e){if(e.prev!==W.Undefined&&e.next!==W.Undefined){const t=e.prev;t.next=e.next,e.next.prev=t}else e.prev===W.Undefined&&e.next===W.Undefined?(this._first=W.Undefined,this._last=W.Undefined):e.next===W.Undefined?(this._last=this._last.prev,this._last.next=W.Undefined):e.prev===W.Undefined&&(this._first=this._first.next,this._first.prev=W.Undefined);this._size-=1}iterator(){let e,t=this._first;return{next:function(){return t===W.Undefined?q:(null==e?e={done:!1,value:t.element}:e.value=t.element,t=t.next,e)}}}toArray(){const e=[];for(let t=this._first;t!==W.Undefined;t=t.next)e.push(t.element);return e}}var Z=Object.defineProperty,K=Object.getOwnPropertyDescriptor,Y=(e,t,o,i)=>{for(var r,s=i>1?void 0:i?K(t,o):t,a=e.length-1;a>=0;a--)(r=e[a])&&(s=(i?r(t,o,s):r(s))||s);return i&&s&&Z(t,o,s),s};let Q;function J(){return Q??=acquireVsCodeApi()}const X=w();function ee(){return`webview:${X.next()}`}let te=class{constructor(e){this.appName=e,this._onReceiveMessage=new j,this._pendingHandlers=new Map,this._api=J(),this._disposable=U.on(window,"message",(e=>this.onMessageReceived(e)))}get onReceiveMessage(){return this._onReceiveMessage.event}dispose(){this._disposable.dispose()}onMessageReceived(e){const t=x.get(_.current),o=e.data;if(o.packed&&o.params instanceof Uint8Array){const i=function(e,t,...o){return(t?.provider??F).enabled(t?.logLevel??"info")?new Stopwatch(e,t,...o):void 0}(A(` deserializing msg=${e.data.method}`,t),{log:!1,logLevel:"debug"});this._textDecoder??=new TextDecoder,o.params=JSON.parse(this._textDecoder.decode(o.params)),i?.stop()}if(null==o.completionId)this._onReceiveMessage.fire(o);else{const e=ie(o.method,o.completionId);this._pendingHandlers.get(e)?.(o)}}sendCommand(e,t){const o=ee();this.postMessage({id:o,scope:e.scope,method:e.method,params:t})}async sendRequest(e,t){const o=ee(),i=new Promise(((t,i)=>{const r=ie(e.response.method,o);let s;function a(){clearTimeout(s),s=void 0,this._pendingHandlers.delete(r)}s=setTimeout((()=>{a.call(this),i(new Error(`Timed out waiting for completion of ${r}`))}),6e4),this._pendingHandlers.set(r,(e=>{a.call(this),queueMicrotask((()=>t(e.params)))}))}));return this.postMessage({id:o,scope:e.scope,method:e.method,params:t,completionId:o}),i}setState(e){this._api.setState(e)}postMessage(e){this._api.postMessage(e)}};var oe;function ie(e,t){return`${e}|${t}`}Y([z({args:{0:e=>`${e.data.id}, method=${e.data.method}`}})],te.prototype,"onMessageReceived",1),Y([z({args:{0:e=>e.method,1:!1}})],te.prototype,"sendCommand",1),Y([z({args:{0:e=>e.method,1:!1,2:!1}})],te.prototype,"sendRequest",1),Y([z({args:{0:e=>`${e.id}, method=${e.method}`}})],te.prototype,"postMessage",1),te=Y([(oe=(e,t)=>`${e.appName}(${t})`,e=>{e[D]=oe})],te);function re(e,t){const o=Math.pow(10,t);return Math.round(e*o)/o}class RGBA{constructor(e,t,o,i=1){this._rgbaBrand=void 0,this.r=0|Math.min(255,Math.max(0,e)),this.g=0|Math.min(255,Math.max(0,t)),this.b=0|Math.min(255,Math.max(0,o)),this.a=re(Math.max(Math.min(1,i),0),3)}static equals(e,t){return e.r===t.r&&e.g===t.g&&e.b===t.b&&e.a===t.a}}class HSLA{constructor(e,t,o,i){this._hslaBrand=void 0,this.h=0|Math.max(Math.min(360,e),0),this.s=re(Math.max(Math.min(1,t),0),3),this.l=re(Math.max(Math.min(1,o),0),3),this.a=re(Math.max(Math.min(1,i),0),3)}static equals(e,t){return e.h===t.h&&e.s===t.s&&e.l===t.l&&e.a===t.a}static fromRGBA(e){const t=e.r/255,o=e.g/255,i=e.b/255,r=e.a,s=Math.max(t,o,i),a=Math.min(t,o,i);let l=0,c=0;const d=(a+s)/2,h=s-a;if(h>0){switch(c=Math.min(d<=.5?h/(2*d):h/(2-2*d),1),s){case t:l=(o-i)/h+(o<i?6:0);break;case o:l=(i-t)/h+2;break;case i:l=(t-o)/h+4}l*=60,l=Math.round(l)}return new HSLA(l,c,d,r)}static _hue2rgb(e,t,o){return o<0&&(o+=1),o>1&&(o-=1),o<1/6?e+6*(t-e)*o:o<.5?t:o<2/3?e+(t-e)*(2/3-o)*6:e}static toRGBA(e){const t=e.h/360,{s:o,l:i,a:r}=e;let s,a,l;if(0===o)s=a=l=i;else{const e=i<.5?i*(1+o):i+o-i*o,r=2*i-e;s=HSLA._hue2rgb(r,e,t+1/3),a=HSLA._hue2rgb(r,e,t),l=HSLA._hue2rgb(r,e,t-1/3)}return new RGBA(Math.round(255*s),Math.round(255*a),Math.round(255*l),r)}}class HSVA{constructor(e,t,o,i){this._hsvaBrand=void 0,this.h=0|Math.max(Math.min(360,e),0),this.s=re(Math.max(Math.min(1,t),0),3),this.v=re(Math.max(Math.min(1,o),0),3),this.a=re(Math.max(Math.min(1,i),0),3)}static equals(e,t){return e.h===t.h&&e.s===t.s&&e.v===t.v&&e.a===t.a}static fromRGBA(e){const t=e.r/255,o=e.g/255,i=e.b/255,r=Math.max(t,o,i),s=r-Math.min(t,o,i),a=0===r?0:s/r;let l;return l=0===s?0:r===t?((o-i)/s%6+6)%6:r===o?(i-t)/s+2:(t-o)/s+4,new HSVA(Math.round(60*l),a,r,e.a)}static toRGBA(e){const{h:t,s:o,v:i,a:r}=e,s=i*o,a=s*(1-Math.abs(t/60%2-1)),l=i-s;let[c,d,h]=[0,0,0];return t<60?(c=s,d=a):t<120?(c=a,d=s):t<180?(d=s,h=a):t<240?(d=a,h=s):t<300?(c=a,h=s):t<=360&&(c=s,h=a),c=Math.round(255*(c+l)),d=Math.round(255*(d+l)),h=Math.round(255*(h+l)),new RGBA(c,d,h,r)}}function ne(e,t){return t.getPropertyValue(e).trim()}const se=class _Color{static from(e){return e instanceof _Color?e:ue(e)||_Color.red}static fromCssVariable(e,t){return ue(ne(e,t))||_Color.red}static fromHex(e){return pe(e)||_Color.red}static equals(e,t){return!e&&!t||!(!e||!t)&&e.equals(t)}get hsla(){return this._hsla?this._hsla:HSLA.fromRGBA(this.rgba)}get hsva(){return this._hsva?this._hsva:HSVA.fromRGBA(this.rgba)}constructor(e){if(!e)throw new Error("Color needs a value");if(e instanceof RGBA)this.rgba=e;else if(e instanceof HSLA)this._hsla=e,this.rgba=HSLA.toRGBA(e);else{if(!(e instanceof HSVA))throw new Error("Invalid color ctor argument");this._hsva=e,this.rgba=HSVA.toRGBA(e)}}equals(e){return null!=e&&(Boolean(e)&&RGBA.equals(this.rgba,e.rgba)&&HSLA.equals(this.hsla,e.hsla)&&HSVA.equals(this.hsva,e.hsva))}getRelativeLuminance(){return re(.2126*_Color._relativeLuminanceForComponent(this.rgba.r)+.7152*_Color._relativeLuminanceForComponent(this.rgba.g)+.0722*_Color._relativeLuminanceForComponent(this.rgba.b),4)}static _relativeLuminanceForComponent(e){const t=e/255;return t<=.03928?t/12.92:Math.pow((t+.055)/1.055,2.4)}luminance(e){return function(e,t){if(0===t)return new ae(new RGBA(0,0,0,e.rgba.a));if(1===t)return new ae(new RGBA(255,255,255,e.rgba.a));const o=e.getRelativeLuminance();let i=20;const r=(e,o)=>{const s=e.mix(o,.5),a=s.getRelativeLuminance();return Math.abs(t-a)<1e-7||!i--?s:a>t?r(e,s):r(s,o)},s=(o>t?r(ae.black,e):r(e,ae.white)).rgba;return new ae(new RGBA(s.r,s.g,s.b,e.rgba.a))}(this,e)}getContrastRatio(e){const t=this.getRelativeLuminance(),o=e.getRelativeLuminance();return t>o?(t+.05)/(o+.05):(o+.05)/(t+.05)}isDarker(){return(299*this.rgba.r+587*this.rgba.g+114*this.rgba.b)/1e3<128}isLighter(){return(299*this.rgba.r+587*this.rgba.g+114*this.rgba.b)/1e3>=128}isLighterThan(e){return this.getRelativeLuminance()>e.getRelativeLuminance()}isDarkerThan(e){return this.getRelativeLuminance()<e.getRelativeLuminance()}lighten(e){return new _Color(new HSLA(this.hsla.h,this.hsla.s,this.hsla.l+this.hsla.l*e,this.hsla.a))}darken(e){return new _Color(new HSLA(this.hsla.h,this.hsla.s,this.hsla.l-this.hsla.l*e,this.hsla.a))}transparent(e){const{r:t,g:o,b:i,a:r}=this.rgba;return new _Color(new RGBA(t,o,i,r*e))}isTransparent(){return 0===this.rgba.a}isOpaque(){return 1===this.rgba.a}opposite(){return new _Color(new RGBA(255-this.rgba.r,255-this.rgba.g,255-this.rgba.b,this.rgba.a))}blend(e){const t=e.rgba,o=this.rgba.a,i=t.a,r=o+i*(1-o);if(r<1e-6)return _Color.transparent;const s=this.rgba.r*o/r+t.r*i*(1-o)/r,a=this.rgba.g*o/r+t.g*i*(1-o)/r,l=this.rgba.b*o/r+t.b*i*(1-o)/r;return new _Color(new RGBA(s,a,l,r))}mix(e,t){return function(e,t,o){const i=e.rgba,r=t.rgba;return new ae(new RGBA(i.r+o*(r.r-i.r),i.g+o*(r.g-i.g),i.b+o*(r.b-i.b),i.a+o*(r.a-i.a)))}(this,e,t)}makeOpaque(e){if(this.isOpaque()||1!==e.rgba.a)return this;const{r:t,g:o,b:i,a:r}=this.rgba;return new _Color(new RGBA(e.rgba.r-r*(e.rgba.r-t),e.rgba.g-r*(e.rgba.g-o),e.rgba.b-r*(e.rgba.b-i),1))}flatten(...e){const t=e.reduceRight(((e,t)=>_Color._flatten(t,e)));return _Color._flatten(this,t)}static _flatten(e,t){const o=1-e.rgba.a;return new _Color(new RGBA(o*t.rgba.r+e.rgba.a*e.rgba.r,o*t.rgba.g+e.rgba.a*e.rgba.g,o*t.rgba.b+e.rgba.a*e.rgba.b))}toString(){return this._toString||(this._toString=function(e){if(e.isOpaque())return de(e);return le(e)}(this)),this._toString}static getLighterColor(e,t,o){if(e.isLighterThan(t))return e;o=o||.5;const i=e.getRelativeLuminance(),r=t.getRelativeLuminance();return o=o*(r-i)/r,e.lighten(o)}static getDarkerColor(e,t,o){if(e.isDarkerThan(t))return e;o=o||.5;const i=e.getRelativeLuminance();return o=o*(i-t.getRelativeLuminance())/i,e.darken(o)}};se.white=new se(new RGBA(255,255,255,1)),se.black=new se(new RGBA(0,0,0,1)),se.red=new se(new RGBA(255,0,0,1)),se.blue=new se(new RGBA(0,0,255,1)),se.green=new se(new RGBA(0,255,0,1)),se.cyan=new se(new RGBA(0,255,255,1)),se.lightgrey=new se(new RGBA(211,211,211,1)),se.transparent=new se(new RGBA(0,0,0,0));let ae=se;function le(e){return`rgba(${e.rgba.r}, ${e.rgba.g}, ${e.rgba.b}, ${Number(e.rgba.a.toFixed(2))})`}function ce(e){const t=e.toString(16);return 2!==t.length?`0${t}`:t}function de(e){return`#${ce(e.rgba.r)}${ce(e.rgba.g)}${ce(e.rgba.b)}`}const he=/^((?:rgb|hsl)a?)\((-?\d+%?)[,\s]+(-?\d+%?)[,\s]+(-?\d+%?)[,\s]*(-?[\d.]+%?)?\)$/i;function ue(e){if(0===(e=e.trim()).length)return null;if(e.charCodeAt(0)===C.Hash)return pe(e);const t=he.exec(e);if(null==t)return null;const o=t[1];let i;switch(o){case"rgb":case"hsl":i=[parseInt(t[2],10),parseInt(t[3],10),parseInt(t[4],10),1];break;case"rgba":case"hsla":i=[parseInt(t[2],10),parseInt(t[3],10),parseInt(t[4],10),parseFloat(t[5])];break;default:return null}switch(o){case"rgb":case"rgba":return new ae(new RGBA(i[0],i[1],i[2],i[3]));case"hsl":case"hsla":return new ae(new HSLA(i[0],i[1],i[2],i[3]))}return ae.red}function pe(e){const t=(e=e.trim()).length;if(0===t)return null;if(e.charCodeAt(0)!==C.Hash)return null;switch(t){case 7:{const t=16*fe(e.charCodeAt(1))+fe(e.charCodeAt(2)),o=16*fe(e.charCodeAt(3))+fe(e.charCodeAt(4)),i=16*fe(e.charCodeAt(5))+fe(e.charCodeAt(6));return new ae(new RGBA(t,o,i,1))}case 9:{const t=16*fe(e.charCodeAt(1))+fe(e.charCodeAt(2)),o=16*fe(e.charCodeAt(3))+fe(e.charCodeAt(4)),i=16*fe(e.charCodeAt(5))+fe(e.charCodeAt(6)),r=16*fe(e.charCodeAt(7))+fe(e.charCodeAt(8));return new ae(new RGBA(t,o,i,r/255))}case 4:{const t=fe(e.charCodeAt(1)),o=fe(e.charCodeAt(2)),i=fe(e.charCodeAt(3));return new ae(new RGBA(16*t+t,16*o+o,16*i+i))}case 5:{const t=fe(e.charCodeAt(1)),o=fe(e.charCodeAt(2)),i=fe(e.charCodeAt(3)),r=fe(e.charCodeAt(4));return new ae(new RGBA(16*t+t,16*o+o,16*i+i,(16*r+r)/255))}default:return null}}function fe(e){switch(e){case C.Digit0:return 0;case C.Digit1:return 1;case C.Digit2:return 2;case C.Digit3:return 3;case C.Digit4:return 4;case C.Digit5:return 5;case C.Digit6:return 6;case C.Digit7:return 7;case C.Digit8:return 8;case C.Digit9:return 9;case C.a:case C.A:return 10;case C.b:case C.B:return 11;case C.c:case C.C:return 12;case C.d:case C.D:return 13;case C.e:case C.E:return 14;case C.f:case C.F:return 15}return 0}const ge=new j,be=ge.event;function me(e){const t=document.documentElement,o=window.getComputedStyle(t),i=document.body.classList,r=i.contains("vscode-light")||i.contains("vscode-high-contrast-light"),s=i.contains("vscode-high-contrast")||i.contains("vscode-high-contrast-light"),a=ne("--vscode-editor-background",o);let l=ne("--vscode-editor-foreground",o);return l||(l=ne("--vscode-foreground",o)),{colors:{background:a,foreground:l},computedStyle:o,isLightTheme:r,isHighContrastTheme:s,isInitializing:null==e}}class App{constructor(e){this.appName=e;const t=[],i=me();if(null!=this.onThemeUpdated&&(this.onThemeUpdated(i),t.push(be(this.onThemeUpdated,this))),this.state=window.bootstrap,window.bootstrap=void 0,this.placement=document.body.getAttribute("data-placement")??"editor",O.configure({name:e,createChannel:function(e){return{name:e,appendLine:function(e){}}}},"off"),this.log(`${e}()`),this._api=J(),this._hostIpc=new te(this.appName),t.push(this._hostIpc),null!=this.state){const e=this.getState();this.state.timestamp>=(e?.timestamp??0)?this._api.setState(this.state):this.state=e}t.push(function(){const e=new MutationObserver((e=>{ge.fire(me(e))}));return e.observe(document.body,{attributeFilter:["class"]}),{dispose:()=>e.disconnect()}}()),requestAnimationFrame((()=>{this.log(`${e}(): initializing...`);try{this.onInitialize?.(),this.bind(),null!=this.onMessageReceived&&t.push(this._hostIpc.onReceiveMessage((e=>{if(!0===s.is(e))window.dispatchEvent(new CustomEvent(e.params.focused?"webview-focus":"webview-blur"));else this.onMessageReceived(e)}))),this.sendCommand(o,void 0),this.onInitialized?.()}finally{document.body.classList.contains("preload")&&setTimeout((()=>{document.body.classList.remove("preload")}),500)}})),t.push(U.on(window,"pagehide",(()=>{t?.forEach((e=>e.dispose())),this.bindDisposables?.forEach((e=>e.dispose())),this.bindDisposables=void 0})))}bind(){document.querySelectorAll("a").forEach((e=>{e.href===e.title&&e.removeAttribute("title")})),this.bindDisposables?.forEach((e=>e.dispose())),this.bindDisposables=this.onBind?.(),null==this.bindDisposables&&(this.bindDisposables=[]);const e=l((e=>{this.sendCommand(i,e)}),150);this.bindDisposables.push(U.on(document,"focusin",(t=>{const o=t.composedPath().some((e=>"INPUT"===e.tagName));!0===this._focused&&this._inputFocused===o||(this._focused=!0,this._inputFocused=o,e({focused:!0,inputFocused:o}))})),U.on(document,"focusout",(()=>{!1===this._focused&&!1===this._inputFocused||(this._focused=!1,this._inputFocused=!1,e({focused:!1,inputFocused:!1}))})))}log(e,...t){"string"==typeof e?O.log(e,...t):O.log(e,t.shift(),...t)}getState(){return this._api.getState()}sendCommand(e,t){this._hostIpc.sendCommand(e,t)}sendRequest(e,t){return this._hostIpc.sendRequest(e,t)}setState(e){this._api.setState(e)}}const ve=globalThis,ye=ve.ShadowRoot&&(void 0===ve.ShadyCSS||ve.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,we=Symbol(),_e=new WeakMap;class n{constructor(e,t,o){if(this._$cssResult$=!0,o!==we)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(ye&&void 0===e){const o=void 0!==t&&1===t.length;o&&(e=_e.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&_e.set(t,e))}return e}toString(){return this.cssText}}const xe=e=>new n("string"==typeof e?e:e+"",void 0,we),$e=(e,...t)=>{const o=1===e.length?e[0]:t.reduce(((t,o,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[i+1]),e[0]);return new n(o,e,we)},ke=ye?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return xe(t)})(e):e,{is:Ae,defineProperty:Se,getOwnPropertyDescriptor:Pe,getOwnPropertyNames:Ce,getOwnPropertySymbols:Ee,getPrototypeOf:Re}=Object,Te=globalThis,Le=Te.trustedTypes,De=Le?Le.emptyScript:"",ze=Te.reactiveElementPolyfillSupport,Oe=(e,t)=>e,Me={toAttribute(e,t){switch(t){case Boolean:e=e?De:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=null!==e;break;case Number:o=null===e?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch(e){o=null}}return o}},Be=(e,t)=>!Ae(e,t),Fe={attribute:!0,type:String,converter:Me,reflect:!1,hasChanged:Be};Symbol.metadata??=Symbol("metadata"),Te.litPropertyMetadata??=new WeakMap;class b extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Fe){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,t);void 0!==i&&Se(this.prototype,e,i)}}static getPropertyDescriptor(e,t,o){const{get:i,set:r}=Pe(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get(){return i?.call(this)},set(t){const s=i?.call(this);r.call(this,t),this.requestUpdate(e,s,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Fe}static _$Ei(){if(this.hasOwnProperty(Oe("elementProperties")))return;const e=Re(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Oe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Oe("properties"))){const e=this.properties,t=[...Ce(e),...Ee(e)];for(const o of t)this.createProperty(o,e[o])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,o]of t)this.elementProperties.set(e,o)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const o=this._$Eu(e,t);void 0!==o&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const e of o)t.unshift(ke(e))}else void 0!==e&&t.push(ke(e));return t}static _$Eu(e,t){const o=t.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(ye)e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const o of t){const t=document.createElement("style"),i=ve.litNonce;void 0!==i&&t.setAttribute("nonce",i),t.textContent=o.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$EC(e,t){const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(void 0!==i&&!0===o.reflect){const r=(void 0!==o.converter?.toAttribute?o.converter:Me).toAttribute(t,o.type);this._$Em=e,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){const o=this.constructor,i=o._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=o.getPropertyOptions(i),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:Me;this._$Em=i,this[i]=r.fromAttribute(t,e.type),this._$Em=null}}requestUpdate(e,t,o){if(void 0!==e){if(o??=this.constructor.getPropertyOptions(e),!(o.hasChanged??Be)(this[e],t))return;this.P(e,t,o)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(e,t,o){this._$AL.has(e)||this._$AL.set(e,t),!0===o.reflect&&this._$Em!==e&&(this._$Ej??=new Set).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,o]of e)!0!==o.wrapped||this._$AL.has(t)||void 0===this[t]||this.P(t,this[t],o)}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EU()}catch(t){throw e=!1,this._$EU(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&=this._$Ej.forEach((e=>this._$EC(e,this[e]))),this._$EU()}updated(e){}firstUpdated(e){}}b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[Oe("elementProperties")]=new Map,b[Oe("finalized")]=new Map,ze?.({ReactiveElement:b}),(Te.reactiveElementVersions??=[]).push("2.0.4");const Ue=globalThis,Ie=Ue.trustedTypes,He=Ie?Ie.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ne="$lit$",je=`lit$${Math.random().toFixed(9).slice(2)}$`,qe="?"+je,Ve=`<${qe}>`,Ge=document,We=()=>Ge.createComment(""),Ze=e=>null===e||"object"!=typeof e&&"function"!=typeof e,Ke=Array.isArray,Ye=e=>Ke(e)||"function"==typeof e?.[Symbol.iterator],Qe="[ \t\n\f\r]",Je=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Xe=/-->/g,et=/>/g,tt=RegExp(`>|${Qe}(?:([^\\s"'>=/]+)(${Qe}*=${Qe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),ot=/'/g,it=/"/g,rt=/^(?:script|style|textarea|title)$/i,nt=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),st=nt(1),at=nt(2),lt=Symbol.for("lit-noChange"),ct=Symbol.for("lit-nothing"),dt=new WeakMap,ht=Ge.createTreeWalker(Ge,129);function ut(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==He?He.createHTML(t):t}const pt=(e,t)=>{const o=e.length-1,i=[];let r,s=2===t?"<svg>":"",a=Je;for(let t=0;t<o;t++){const o=e[t];let l,c,d=-1,h=0;for(;h<o.length&&(a.lastIndex=h,c=a.exec(o),null!==c);)h=a.lastIndex,a===Je?"!--"===c[1]?a=Xe:void 0!==c[1]?a=et:void 0!==c[2]?(rt.test(c[2])&&(r=RegExp("</"+c[2],"g")),a=tt):void 0!==c[3]&&(a=tt):a===tt?">"===c[0]?(a=r??Je,d=-1):void 0===c[1]?d=-2:(d=a.lastIndex-c[2].length,l=c[1],a=void 0===c[3]?tt:'"'===c[3]?it:ot):a===it||a===ot?a=tt:a===Xe||a===et?a=Je:(a=tt,r=void 0);const u=a===tt&&e[t+1].startsWith("/>")?" ":"";s+=a===Je?o+Ve:d>=0?(i.push(l),o.slice(0,d)+Ne+o.slice(d)+je+u):o+je+(-2===d?t:u)}return[ut(e,s+(e[o]||"<?>")+(2===t?"</svg>":"")),i]};class V{constructor({strings:e,_$litType$:t},o){let i;this.parts=[];let r=0,s=0;const a=e.length-1,l=this.parts,[c,d]=pt(e,t);if(this.el=V.createElement(c,o),ht.currentNode=this.el.content,2===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=ht.nextNode())&&l.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(Ne)){const t=d[s++],o=i.getAttribute(e).split(je),a=/([.?@])?(.*)/.exec(t);l.push({type:1,index:r,name:a[2],strings:o,ctor:"."===a[1]?k:"?"===a[1]?H:"@"===a[1]?I:R}),i.removeAttribute(e)}else e.startsWith(je)&&(l.push({type:6,index:r}),i.removeAttribute(e));if(rt.test(i.tagName)){const e=i.textContent.split(je),t=e.length-1;if(t>0){i.textContent=Ie?Ie.emptyScript:"";for(let o=0;o<t;o++)i.append(e[o],We()),ht.nextNode(),l.push({type:2,index:++r});i.append(e[t],We())}}}else if(8===i.nodeType)if(i.data===qe)l.push({type:2,index:r});else{let e=-1;for(;-1!==(e=i.data.indexOf(je,e+1));)l.push({type:7,index:r}),e+=je.length-1}r++}}static createElement(e,t){const o=Ge.createElement("template");return o.innerHTML=e,o}}function ft(e,t,o=e,i){if(t===lt)return t;let r=void 0!==i?o._$Co?.[i]:o._$Cl;const s=Ze(t)?void 0:t._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),void 0===s?r=void 0:(r=new s(e),r._$AT(e,o,i)),void 0!==i?(o._$Co??=[])[i]=r:o._$Cl=r),void 0!==r&&(t=ft(e,r._$AS(e,t.values),r,i)),t}class lit_html_S{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,i=(e?.creationScope??Ge).importNode(t,!0);ht.currentNode=i;let r=ht.nextNode(),s=0,a=0,l=o[0];for(;void 0!==l;){if(s===l.index){let t;2===l.type?t=new M(r,r.nextSibling,this,e):1===l.type?t=new l.ctor(r,l.name,l.strings,this,e):6===l.type&&(t=new L(r,this,e)),this._$AV.push(t),l=o[++a]}s!==l?.index&&(r=ht.nextNode(),s++)}return ht.currentNode=Ge,i}p(e){let t=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class M{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,i){this.type=2,this._$AH=ct,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ft(this,e,t),Ze(e)?e===ct||null==e||""===e?(this._$AH!==ct&&this._$AR(),this._$AH=ct):e!==this._$AH&&e!==lt&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):Ye(e)?this.k(e):this._(e)}S(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.S(e))}_(e){this._$AH!==ct&&Ze(this._$AH)?this._$AA.nextSibling.data=e:this.T(Ge.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:o}=e,i="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=V.createElement(ut(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new lit_html_S(i,this),o=e.u(this.options);e.p(t),this.T(o),this._$AH=e}}_$AC(e){let t=dt.get(e.strings);return void 0===t&&dt.set(e.strings,t=new V(e)),t}k(e){Ke(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,i=0;for(const r of e)i===t.length?t.push(o=new M(this.S(We()),this.S(We()),this,this.options)):o=t[i],o._$AI(r),i++;i<t.length&&(this._$AR(o&&o._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class R{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,i,r){this.type=1,this._$AH=ct,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=ct}_$AI(e,t=this,o,i){const r=this.strings;let s=!1;if(void 0===r)e=ft(this,e,t,0),s=!Ze(e)||e!==this._$AH&&e!==lt,s&&(this._$AH=e);else{const i=e;let a,l;for(e=r[0],a=0;a<r.length-1;a++)l=ft(this,i[o+a],t,a),l===lt&&(l=this._$AH[a]),s||=!Ze(l)||l!==this._$AH[a],l===ct?e=ct:e!==ct&&(e+=(l??"")+r[a+1]),this._$AH[a]=l}s&&!i&&this.j(e)}j(e){e===ct?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class k extends R{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===ct?void 0:e}}class H extends R{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==ct)}}class I extends R{constructor(e,t,o,i,r){super(e,t,o,i,r),this.type=5}_$AI(e,t=this){if((e=ft(this,e,t,0)??ct)===lt)return;const o=this._$AH,i=e===ct&&o!==ct||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,r=e!==ct&&(o===ct||i);i&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class L{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){ft(this,e)}}const gt=Ue.litHtmlPolyfillSupport;gt?.(V,M),(Ue.litHtmlVersions??=[]).push("3.1.4");class lit_element_s extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,o)=>{const i=o?.renderBefore??t;let r=i._$litPart$;if(void 0===r){const e=o?.renderBefore??null;i._$litPart$=r=new M(t.insertBefore(We(),e),e,void 0,o??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return lt}}lit_element_s._$litElement$=!0,lit_element_s.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:lit_element_s});const bt=globalThis.litElementPolyfillSupport;bt?.({LitElement:lit_element_s});(globalThis.litElementVersions??=[]).push("4.0.6");const mt=e=>(t,o)=>{void 0!==o?o.addInitializer((()=>{customElements.define(e,t)})):customElements.define(e,t)},vt={attribute:!0,type:String,converter:Me,reflect:!1,hasChanged:Be},yt=(e=vt,t,o)=>{const{kind:i,metadata:r}=o;let s=globalThis.litPropertyMetadata.get(r);if(void 0===s&&globalThis.litPropertyMetadata.set(r,s=new Map),s.set(o.name,e),"accessor"===i){const{name:i}=o;return{set(o){const r=t.get.call(this);t.set.call(this,o),this.requestUpdate(i,r,e)},init(t){return void 0!==t&&this.P(i,void 0,e),t}}}if("setter"===i){const{name:i}=o;return function(o){const r=this[i];t.call(this,o),this.requestUpdate(i,r,e)}}throw Error("Unsupported decorator location: "+i)};function wt(e){return(t,o)=>"object"==typeof o?yt(e,t,o):((e,t,o)=>{const i=t.hasOwnProperty(o);return t.constructor.createProperty(o,i?{...e,wrapped:!0}:e),i?Object.getOwnPropertyDescriptor(t,o):void 0})(e,t,o)}const _t=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,o),o);function xt(e,t){return(o,i,r)=>{const s=t=>t.renderRoot?.querySelector(e)??null;if(t){const{get:e,set:t}="object"==typeof i?o:r??(()=>{const e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return _t(o,i,{get(){let o=e.call(this);return void 0===o&&(o=s(this),(null!==o||this.hasUpdated)&&t.call(this,o)),o}})}return _t(o,i,{get(){return s(this)}})}}function $t(e,t,o){return e?t(e):o?.(e)}var kt=(e=>(e.Free="free",e.FreePlus="free+",e.Pro="pro",e.Teams="teams",e.Enterprise="enterprise",e))(kt||{}),At=(e=>(e[e.VerificationRequired=-1]="VerificationRequired",e[e.Free=0]="Free",e[e.FreeInPreviewTrial=1]="FreeInPreviewTrial",e[e.FreePreviewTrialExpired=2]="FreePreviewTrialExpired",e[e.FreePlusInTrial=3]="FreePlusInTrial",e[e.FreePlusTrialExpired=4]="FreePlusTrialExpired",e[e.FreePlusTrialReactivationEligible=5]="FreePlusTrialReactivationEligible",e[e.Paid=6]="Paid",e))(At||{});function St(e){switch(e){case"free+":return"GitKraken Free";case"pro":return"GitKraken Pro";case"teams":return"GitKraken Teams";case"enterprise":return"GitKraken Enterprise";default:return"GitKraken"}}function Pt(e,t){return Ct(e.plan.effective.expiresOn,t)}function Ct(e,t){return null!=e?function(e,t,o,i){const r=("number"==typeof t?t:t.getTime())-("number"==typeof e?e:e.getTime()),s=i??Math.floor;switch(o){case"days":return s(r/864e5);case"hours":return s(r/36e5);case"minutes":return s(r/6e4);case"seconds":return s(r/1e3);default:return r}}(Date.now(),new Date(e),t,Math.round):void 0}const Et=[{key:"devexdays24",code:"DEVEXDAYS24",states:[At.FreePlusInTrial,At.FreePlusTrialExpired,At.FreePlusTrialReactivationEligible],expiresOn:new Date("2024-09-05T06:59:00.000Z").getTime(),linkTooltip:"Sale: Save up to 80% on GitLens Pro - lowest price of the year!"},{key:"pro50",states:[At.Free,At.FreeInPreviewTrial,At.FreePlusInTrial,At.FreePlusTrialExpired,At.FreePlusTrialReactivationEligible],linkTooltip:"Special: 1st seat of Pro is now 50%+ off. See your special price."}];$e`
	.sr-only,
	.sr-only-focusable:not(:active):not(:focus) {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		width: 1px;
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
	}
`;const Rt=$e`
	outline: 1px solid var(--color-focus-border);
	outline-offset: 2px;
`,Tt=$e`
	:host {
		box-sizing: border-box;
	}
	:host *,
	:host *::before,
	:host *::after {
		box-sizing: inherit;
	}
	[hidden] {
		display: none !important;
	}
`,Lt=$e`
	a {
		color: var(--vscode-textLink-foreground);
		text-decoration: none;
	}
	a:focus {
		${$e`
	outline: 1px solid var(--color-focus-border);
	outline-offset: -1px;
`}
	}
	a:hover {
		text-decoration: underline;
	}
`;$e`
	::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}
	::-webkit-scrollbar-corner {
		background-color: transparent;
	}

	::-webkit-scrollbar-thumb {
		background-color: transparent;
		border-color: inherit;
		border-right-style: inset;
		border-right-width: calc(100vw + 100vh);
		border-radius: unset !important;
	}
	::-webkit-scrollbar-thumb:hover {
		border-color: var(--vscode-scrollbarSlider-hoverBackground);
	}
	::-webkit-scrollbar-thumb:active {
		border-color: var(--vscode-scrollbarSlider-activeBackground);
	}

	.scrollable {
		border-color: transparent;
		transition: border-color 1s linear;
	}

	:host(:hover) .scrollable,
	:host(:focus-within) .scrollable {
		border-color: var(--vscode-scrollbarSlider-background);
		transition: none;
	}
`;var Dt=Object.defineProperty,zt=Object.defineProperties,Ot=Object.getOwnPropertyDescriptor,Mt=Object.getOwnPropertyDescriptors,Bt=Object.getOwnPropertySymbols,Ft=Object.prototype.hasOwnProperty,Ut=Object.prototype.propertyIsEnumerable,It=(e,t,o)=>t in e?Dt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,Ht=(e,t)=>{for(var o in t||(t={}))Ft.call(t,o)&&It(e,o,t[o]);if(Bt)for(var o of Bt(t))Ut.call(t,o)&&It(e,o,t[o]);return e},Nt=(e,t)=>zt(e,Mt(t)),jt=(e,t,o,i)=>{for(var r,s=i>1?void 0:i?Ot(t,o):t,a=e.length-1;a>=0;a--)(r=e[a])&&(s=(i?r(t,o,s):r(s))||s);return i&&s&&Dt(t,o,s),s},qt=new Map,Vt=new WeakMap;function Gt(e){return null!=e?e:{keyframes:[],options:{duration:0}}}function Wt(e,t){return"rtl"===t.toLowerCase()?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function Zt(e,t){qt.set(e,Gt(t))}function Kt(e,t,o){const i=Vt.get(e);if(null==i?void 0:i[t])return Wt(i[t],o.dir);const r=qt.get(t);return r?Wt(r,o.dir):{keyframes:[],options:{duration:0}}}var Yt=$e`
  :host {
    --max-width: 20rem;
    --hide-delay: 0ms;
    --show-delay: 150ms;

    display: contents;
  }

  .tooltip {
    --arrow-size: var(--sl-tooltip-arrow-size);
    --arrow-color: var(--sl-tooltip-background-color);
  }

  .tooltip::part(popup) {
    z-index: var(--sl-z-index-tooltip);
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .tooltip__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--sl-tooltip-border-radius);
    background-color: var(--sl-tooltip-background-color);
    font-family: var(--sl-tooltip-font-family);
    font-size: var(--sl-tooltip-font-size);
    font-weight: var(--sl-tooltip-font-weight);
    line-height: var(--sl-tooltip-line-height);
    text-align: start;
    white-space: normal;
    color: var(--sl-tooltip-color);
    padding: var(--sl-tooltip-padding);
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }
`,Qt=$e`
  :host {
    --arrow-color: var(--sl-color-neutral-1000);
    --arrow-size: 6px;

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45), which is the diagonal size of the arrow's container after rotating.
     */
    --arrow-size-diagonal: calc(var(--arrow-size) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);
  }

  .popup--fixed {
    position: fixed;
  }

  .popup:not(.popup--active) {
    display: none;
  }

  .popup__arrow {
    position: absolute;
    width: calc(var(--arrow-size-diagonal) * 2);
    height: calc(var(--arrow-size-diagonal) * 2);
    rotate: 45deg;
    background: var(--arrow-color);
    z-index: -1;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge--visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: calc(var(--sl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }
`,Jt=$e`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`,Xt=class extends lit_element_s{constructor(){super(),Object.entries(this.constructor.dependencies).forEach((([e,t])=>{this.constructor.define(e,t)}))}emit(e,t){const o=new CustomEvent(e,Ht({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(o),o}static define(e,t=this,o={}){const i=customElements.get(e);if(!i)return void customElements.define(e,class extends t{},o);let r=" (unknown version)",s=r;"version"in t&&t.version&&(r=" v"+t.version),"version"in i&&i.version&&(s=" v"+i.version)}};Xt.version="2.15.1",Xt.dependencies={},jt([wt()],Xt.prototype,"dir",2),jt([wt()],Xt.prototype,"lang",2);const eo=Math.min,to=Math.max,oo=Math.round,io=Math.floor,ro=e=>({x:e,y:e}),no={left:"right",right:"left",bottom:"top",top:"bottom"},so={start:"end",end:"start"};function ao(e,t,o){return to(e,eo(t,o))}function lo(e,t){return"function"==typeof e?e(t):e}function co(e){return e.split("-")[0]}function ho(e){return e.split("-")[1]}function uo(e){return"x"===e?"y":"x"}function po(e){return"y"===e?"height":"width"}function fo(e){return["top","bottom"].includes(co(e))?"y":"x"}function go(e){return uo(fo(e))}function bo(e){return e.replace(/start|end/g,(e=>so[e]))}function mo(e){return e.replace(/left|right|bottom|top/g,(e=>no[e]))}function vo(e){return"number"!=typeof e?function(e){return{top:0,right:0,bottom:0,left:0,...e}}(e):{top:e,right:e,bottom:e,left:e}}function yo(e){const{x:t,y:o,width:i,height:r}=e;return{width:i,height:r,top:o,left:t,right:t+i,bottom:o+r,x:t,y:o}}function wo(e,t,o){let{reference:i,floating:r}=e;const s=fo(t),a=go(t),l=po(a),c=co(t),d="y"===s,h=i.x+i.width/2-r.width/2,u=i.y+i.height/2-r.height/2,p=i[l]/2-r[l]/2;let f;switch(c){case"top":f={x:h,y:i.y-r.height};break;case"bottom":f={x:h,y:i.y+i.height};break;case"right":f={x:i.x+i.width,y:u};break;case"left":f={x:i.x-r.width,y:u};break;default:f={x:i.x,y:i.y}}switch(ho(t)){case"start":f[a]-=p*(o&&d?-1:1);break;case"end":f[a]+=p*(o&&d?-1:1)}return f}async function _o(e,t){var o;void 0===t&&(t={});const{x:i,y:r,platform:s,rects:a,elements:l,strategy:c}=e,{boundary:d="clippingAncestors",rootBoundary:h="viewport",elementContext:u="floating",altBoundary:p=!1,padding:f=0}=lo(t,e),g=vo(f),m=l[p?"floating"===u?"reference":"floating":u],v=yo(await s.getClippingRect({element:null==(o=await(null==s.isElement?void 0:s.isElement(m)))||o?m:m.contextElement||await(null==s.getDocumentElement?void 0:s.getDocumentElement(l.floating)),boundary:d,rootBoundary:h,strategy:c})),y="floating"===u?{x:i,y:r,width:a.floating.width,height:a.floating.height}:a.reference,w=await(null==s.getOffsetParent?void 0:s.getOffsetParent(l.floating)),_=await(null==s.isElement?void 0:s.isElement(w))&&await(null==s.getScale?void 0:s.getScale(w))||{x:1,y:1},x=yo(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:y,offsetParent:w,strategy:c}):y);return{top:(v.top-x.top+g.top)/_.y,bottom:(x.bottom-v.bottom+g.bottom)/_.y,left:(v.left-x.left+g.left)/_.x,right:(x.right-v.right+g.right)/_.x}}function xo(e){return Ao(e)?(e.nodeName||"").toLowerCase():"#document"}function $o(e){var t;return(null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function ko(e){var t;return null==(t=(Ao(e)?e.ownerDocument:e.document)||window.document)?void 0:t.documentElement}function Ao(e){return e instanceof Node||e instanceof $o(e).Node}function So(e){return e instanceof Element||e instanceof $o(e).Element}function Po(e){return e instanceof HTMLElement||e instanceof $o(e).HTMLElement}function Co(e){return"undefined"!=typeof ShadowRoot&&(e instanceof ShadowRoot||e instanceof $o(e).ShadowRoot)}function Eo(e){const{overflow:t,overflowX:o,overflowY:i,display:r}=Oo(e);return/auto|scroll|overlay|hidden|clip/.test(t+i+o)&&!["inline","contents"].includes(r)}function Ro(e){return["table","td","th"].includes(xo(e))}function To(e){return[":popover-open",":modal"].some((t=>{try{return e.matches(t)}catch(e){return!1}}))}function Lo(e){const t=Do(),o=So(e)?Oo(e):e;return"none"!==o.transform||"none"!==o.perspective||!!o.containerType&&"normal"!==o.containerType||!t&&!!o.backdropFilter&&"none"!==o.backdropFilter||!t&&!!o.filter&&"none"!==o.filter||["transform","perspective","filter"].some((e=>(o.willChange||"").includes(e)))||["paint","layout","strict","content"].some((e=>(o.contain||"").includes(e)))}function Do(){return!("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function zo(e){return["html","body","#document"].includes(xo(e))}function Oo(e){return $o(e).getComputedStyle(e)}function Mo(e){return So(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Bo(e){if("html"===xo(e))return e;const t=e.assignedSlot||e.parentNode||Co(e)&&e.host||ko(e);return Co(t)?t.host:t}function Fo(e){const t=Bo(e);return zo(t)?e.ownerDocument?e.ownerDocument.body:e.body:Po(t)&&Eo(t)?t:Fo(t)}function Uo(e,t,o){var i;void 0===t&&(t=[]),void 0===o&&(o=!0);const r=Fo(e),s=r===(null==(i=e.ownerDocument)?void 0:i.body),a=$o(r);return s?t.concat(a,a.visualViewport||[],Eo(r)?r:[],a.frameElement&&o?Uo(a.frameElement):[]):t.concat(r,Uo(r,[],o))}function Io(e){const t=Oo(e);let o=parseFloat(t.width)||0,i=parseFloat(t.height)||0;const r=Po(e),s=r?e.offsetWidth:o,a=r?e.offsetHeight:i,l=oo(o)!==s||oo(i)!==a;return l&&(o=s,i=a),{width:o,height:i,$:l}}function Ho(e){return So(e)?e:e.contextElement}function No(e){const t=Ho(e);if(!Po(t))return ro(1);const o=t.getBoundingClientRect(),{width:i,height:r,$:s}=Io(t);let a=(s?oo(o.width):o.width)/i,l=(s?oo(o.height):o.height)/r;return a&&Number.isFinite(a)||(a=1),l&&Number.isFinite(l)||(l=1),{x:a,y:l}}const jo=ro(0);function qo(e){const t=$o(e);return Do()&&t.visualViewport?{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}:jo}function Vo(e,t,o,i){void 0===t&&(t=!1),void 0===o&&(o=!1);const r=e.getBoundingClientRect(),s=Ho(e);let a=ro(1);t&&(i?So(i)&&(a=No(i)):a=No(e));const l=function(e,t,o){return void 0===t&&(t=!1),!(!o||t&&o!==$o(e))&&t}(s,o,i)?qo(s):ro(0);let c=(r.left+l.x)/a.x,d=(r.top+l.y)/a.y,h=r.width/a.x,u=r.height/a.y;if(s){const e=$o(s),t=i&&So(i)?$o(i):i;let o=e,r=o.frameElement;for(;r&&i&&t!==o;){const e=No(r),t=r.getBoundingClientRect(),i=Oo(r),s=t.left+(r.clientLeft+parseFloat(i.paddingLeft))*e.x,a=t.top+(r.clientTop+parseFloat(i.paddingTop))*e.y;c*=e.x,d*=e.y,h*=e.x,u*=e.y,c+=s,d+=a,o=$o(r),r=o.frameElement}}return yo({width:h,height:u,x:c,y:d})}function Go(e){return Vo(ko(e)).left+Mo(e).scrollLeft}function Wo(e,t,o){let i;if("viewport"===t)i=function(e,t){const o=$o(e),i=ko(e),r=o.visualViewport;let s=i.clientWidth,a=i.clientHeight,l=0,c=0;if(r){s=r.width,a=r.height;const e=Do();(!e||e&&"fixed"===t)&&(l=r.offsetLeft,c=r.offsetTop)}return{width:s,height:a,x:l,y:c}}(e,o);else if("document"===t)i=function(e){const t=ko(e),o=Mo(e),i=e.ownerDocument.body,r=to(t.scrollWidth,t.clientWidth,i.scrollWidth,i.clientWidth),s=to(t.scrollHeight,t.clientHeight,i.scrollHeight,i.clientHeight);let a=-o.scrollLeft+Go(e);const l=-o.scrollTop;return"rtl"===Oo(i).direction&&(a+=to(t.clientWidth,i.clientWidth)-r),{width:r,height:s,x:a,y:l}}(ko(e));else if(So(t))i=function(e,t){const o=Vo(e,!0,"fixed"===t),i=o.top+e.clientTop,r=o.left+e.clientLeft,s=Po(e)?No(e):ro(1);return{width:e.clientWidth*s.x,height:e.clientHeight*s.y,x:r*s.x,y:i*s.y}}(t,o);else{const o=qo(e);i={...t,x:t.x-o.x,y:t.y-o.y}}return yo(i)}function Zo(e,t){const o=Bo(e);return!(o===t||!So(o)||zo(o))&&("fixed"===Oo(o).position||Zo(o,t))}function Ko(e,t,o){const i=Po(t),r=ko(t),s="fixed"===o,a=Vo(e,!0,s,t);let l={scrollLeft:0,scrollTop:0};const c=ro(0);if(i||!i&&!s)if(("body"!==xo(t)||Eo(r))&&(l=Mo(t)),i){const e=Vo(t,!0,s,t);c.x=e.x+t.clientLeft,c.y=e.y+t.clientTop}else r&&(c.x=Go(r));return{x:a.left+l.scrollLeft-c.x,y:a.top+l.scrollTop-c.y,width:a.width,height:a.height}}function Yo(e){return"static"===Oo(e).position}function Qo(e,t){return Po(e)&&"fixed"!==Oo(e).position?t?t(e):e.offsetParent:null}function Jo(e,t){const o=$o(e);if(To(e))return o;if(!Po(e)){let t=Bo(e);for(;t&&!zo(t);){if(So(t)&&!Yo(t))return t;t=Bo(t)}return o}let i=Qo(e,t);for(;i&&Ro(i)&&Yo(i);)i=Qo(i,t);return i&&zo(i)&&Yo(i)&&!Lo(i)?o:i||function(e){let t=Bo(e);for(;Po(t)&&!zo(t);){if(Lo(t))return t;if(To(t))return null;t=Bo(t)}return null}(e)||o}const Xo={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{elements:t,rect:o,offsetParent:i,strategy:r}=e;const s="fixed"===r,a=ko(i),l=!!t&&To(t.floating);if(i===a||l&&s)return o;let c={scrollLeft:0,scrollTop:0},d=ro(1);const h=ro(0),u=Po(i);if((u||!u&&!s)&&(("body"!==xo(i)||Eo(a))&&(c=Mo(i)),Po(i))){const e=Vo(i);d=No(i),h.x=e.x+i.clientLeft,h.y=e.y+i.clientTop}return{width:o.width*d.x,height:o.height*d.y,x:o.x*d.x-c.scrollLeft*d.x+h.x,y:o.y*d.y-c.scrollTop*d.y+h.y}},getDocumentElement:ko,getClippingRect:function(e){let{element:t,boundary:o,rootBoundary:i,strategy:r}=e;const s=[..."clippingAncestors"===o?To(t)?[]:function(e,t){const o=t.get(e);if(o)return o;let i=Uo(e,[],!1).filter((e=>So(e)&&"body"!==xo(e))),r=null;const s="fixed"===Oo(e).position;let a=s?Bo(e):e;for(;So(a)&&!zo(a);){const t=Oo(a),o=Lo(a);o||"fixed"!==t.position||(r=null),(s?!o&&!r:!o&&"static"===t.position&&r&&["absolute","fixed"].includes(r.position)||Eo(a)&&!o&&Zo(e,a))?i=i.filter((e=>e!==a)):r=t,a=Bo(a)}return t.set(e,i),i}(t,this._c):[].concat(o),i],a=s[0],l=s.reduce(((e,o)=>{const i=Wo(t,o,r);return e.top=to(i.top,e.top),e.right=eo(i.right,e.right),e.bottom=eo(i.bottom,e.bottom),e.left=to(i.left,e.left),e}),Wo(t,a,r));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}},getOffsetParent:Jo,getElementRects:async function(e){const t=this.getOffsetParent||Jo,o=this.getDimensions,i=await o(e.floating);return{reference:Ko(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){const{width:t,height:o}=Io(e);return{width:t,height:o}},getScale:No,isElement:So,isRTL:function(e){return"rtl"===Oo(e).direction}};function ei(e,t,o,i){void 0===i&&(i={});const{ancestorScroll:r=!0,ancestorResize:s=!0,elementResize:a="function"==typeof ResizeObserver,layoutShift:l="function"==typeof IntersectionObserver,animationFrame:c=!1}=i,d=Ho(e),h=r||s?[...d?Uo(d):[],...Uo(t)]:[];h.forEach((e=>{r&&e.addEventListener("scroll",o,{passive:!0}),s&&e.addEventListener("resize",o)}));const u=d&&l?function(e,t){let o,i=null;const r=ko(e);function s(){var e;clearTimeout(o),null==(e=i)||e.disconnect(),i=null}return function a(l,c){void 0===l&&(l=!1),void 0===c&&(c=1),s();const{left:d,top:h,width:u,height:p}=e.getBoundingClientRect();if(l||t(),!u||!p)return;const f={rootMargin:-io(h)+"px "+-io(r.clientWidth-(d+u))+"px "+-io(r.clientHeight-(h+p))+"px "+-io(d)+"px",threshold:to(0,eo(1,c))||1};let g=!0;function m(e){const t=e[0].intersectionRatio;if(t!==c){if(!g)return a();t?a(!1,t):o=setTimeout((()=>{a(!1,1e-7)}),1e3)}g=!1}try{i=new IntersectionObserver(m,{...f,root:r.ownerDocument})}catch(e){i=new IntersectionObserver(m,f)}i.observe(e)}(!0),s}(d,o):null;let p,f=-1,g=null;a&&(g=new ResizeObserver((e=>{let[i]=e;i&&i.target===d&&g&&(g.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame((()=>{var e;null==(e=g)||e.observe(t)}))),o()})),d&&!c&&g.observe(d),g.observe(t));let m=c?Vo(e):null;return c&&function t(){const i=Vo(e);!m||i.x===m.x&&i.y===m.y&&i.width===m.width&&i.height===m.height||o();m=i,p=requestAnimationFrame(t)}(),o(),()=>{var e;h.forEach((e=>{r&&e.removeEventListener("scroll",o),s&&e.removeEventListener("resize",o)})),null==u||u(),null==(e=g)||e.disconnect(),g=null,c&&cancelAnimationFrame(p)}}const ti=function(e){return void 0===e&&(e=0),{name:"offset",options:e,async fn(t){var o,i;const{x:r,y:s,placement:a,middlewareData:l}=t,c=await async function(e,t){const{placement:o,platform:i,elements:r}=e,s=await(null==i.isRTL?void 0:i.isRTL(r.floating)),a=co(o),l=ho(o),c="y"===fo(o),d=["left","top"].includes(a)?-1:1,h=s&&c?-1:1,u=lo(t,e);let{mainAxis:p,crossAxis:f,alignmentAxis:g}="number"==typeof u?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...u};return l&&"number"==typeof g&&(f="end"===l?-1*g:g),c?{x:f*h,y:p*d}:{x:p*d,y:f*h}}(t,e);return a===(null==(o=l.offset)?void 0:o.placement)&&null!=(i=l.arrow)&&i.alignmentOffset?{}:{x:r+c.x,y:s+c.y,data:{...c,placement:a}}}}},oi=function(e){return void 0===e&&(e={}),{name:"shift",options:e,async fn(t){const{x:o,y:i,placement:r}=t,{mainAxis:s=!0,crossAxis:a=!1,limiter:l={fn:e=>{let{x:t,y:o}=e;return{x:t,y:o}}},...c}=lo(e,t),d={x:o,y:i},h=await _o(t,c),u=fo(co(r)),p=uo(u);let f=d[p],g=d[u];if(s){const e="y"===p?"bottom":"right";f=ao(f+h["y"===p?"top":"left"],f,f-h[e])}if(a){const e="y"===u?"bottom":"right";g=ao(g+h["y"===u?"top":"left"],g,g-h[e])}const m=l.fn({...t,[p]:f,[u]:g});return{...m,data:{x:m.x-o,y:m.y-i}}}}},ii=function(e){return void 0===e&&(e={}),{name:"flip",options:e,async fn(t){var o,i;const{placement:r,middlewareData:s,rects:a,initialPlacement:l,platform:c,elements:d}=t,{mainAxis:h=!0,crossAxis:u=!0,fallbackPlacements:p,fallbackStrategy:f="bestFit",fallbackAxisSideDirection:g="none",flipAlignment:m=!0,...v}=lo(e,t);if(null!=(o=s.arrow)&&o.alignmentOffset)return{};const y=co(r),w=fo(l),_=co(l)===l,x=await(null==c.isRTL?void 0:c.isRTL(d.floating)),$=p||(_||!m?[mo(l)]:function(e){const t=mo(e);return[bo(e),t,bo(t)]}(l)),A="none"!==g;!p&&A&&$.push(...function(e,t,o,i){const r=ho(e);let s=function(e,t,o){const i=["left","right"],r=["right","left"],s=["top","bottom"],a=["bottom","top"];switch(e){case"top":case"bottom":return o?t?r:i:t?i:r;case"left":case"right":return t?s:a;default:return[]}}(co(e),"start"===o,i);return r&&(s=s.map((e=>e+"-"+r)),t&&(s=s.concat(s.map(bo)))),s}(l,m,g,x));const S=[l,...$],P=await _o(t,v),C=[];let E=(null==(i=s.flip)?void 0:i.overflows)||[];if(h&&C.push(P[y]),u){const e=function(e,t,o){void 0===o&&(o=!1);const i=ho(e),r=go(e),s=po(r);let a="x"===r?i===(o?"end":"start")?"right":"left":"start"===i?"bottom":"top";return t.reference[s]>t.floating[s]&&(a=mo(a)),[a,mo(a)]}(r,a,x);C.push(P[e[0]],P[e[1]])}if(E=[...E,{placement:r,overflows:C}],!C.every((e=>e<=0))){var T,D;const e=((null==(T=s.flip)?void 0:T.index)||0)+1,t=S[e];if(t)return{data:{index:e,overflows:E},reset:{placement:t}};let o=null==(D=E.filter((e=>e.overflows[0]<=0)).sort(((e,t)=>e.overflows[1]-t.overflows[1]))[0])?void 0:D.placement;if(!o)switch(f){case"bestFit":{var z;const e=null==(z=E.filter((e=>{if(A){const t=fo(e.placement);return t===w||"y"===t}return!0})).map((e=>[e.placement,e.overflows.filter((e=>e>0)).reduce(((e,t)=>e+t),0)])).sort(((e,t)=>e[1]-t[1]))[0])?void 0:z[0];e&&(o=e);break}case"initialPlacement":o=l}if(r!==o)return{reset:{placement:o}}}return{}}}},ri=function(e){return void 0===e&&(e={}),{name:"size",options:e,async fn(t){const{placement:o,rects:i,platform:r,elements:s}=t,{apply:a=()=>{},...l}=lo(e,t),c=await _o(t,l),d=co(o),h=ho(o),u="y"===fo(o),{width:p,height:f}=i.floating;let g,m;"top"===d||"bottom"===d?(g=d,m=h===(await(null==r.isRTL?void 0:r.isRTL(s.floating))?"start":"end")?"left":"right"):(m=d,g="end"===h?"top":"bottom");const v=f-c.top-c.bottom,y=p-c.left-c.right,w=eo(f-c[g],v),_=eo(p-c[m],y),x=!t.middlewareData.shift;let $=w,A=_;if(u?A=h||x?eo(_,y):y:$=h||x?eo(w,v):v,x&&!h){const e=to(c.left,0),t=to(c.right,0),o=to(c.top,0),i=to(c.bottom,0);u?A=p-2*(0!==e||0!==t?e+t:to(c.left,c.right)):$=f-2*(0!==o||0!==i?o+i:to(c.top,c.bottom))}await a({...t,availableWidth:A,availableHeight:$});const S=await r.getDimensions(s.floating);return p!==S.width||f!==S.height?{reset:{rects:!0}}:{}}}},ni=e=>({name:"arrow",options:e,async fn(t){const{x:o,y:i,placement:r,rects:s,platform:a,elements:l,middlewareData:c}=t,{element:d,padding:h=0}=lo(e,t)||{};if(null==d)return{};const u=vo(h),p={x:o,y:i},f=go(r),g=po(f),m=await a.getDimensions(d),v="y"===f,y=v?"top":"left",w=v?"bottom":"right",_=v?"clientHeight":"clientWidth",x=s.reference[g]+s.reference[f]-p[f]-s.floating[g],$=p[f]-s.reference[f],A=await(null==a.getOffsetParent?void 0:a.getOffsetParent(d));let S=A?A[_]:0;S&&await(null==a.isElement?void 0:a.isElement(A))||(S=l.floating[_]||s.floating[g]);const P=x/2-$/2,C=S/2-m[g]/2-1,E=eo(u[y],C),T=eo(u[w],C),D=E,z=S-m[g]-T,O=S/2-m[g]/2+P,B=ao(D,O,z),F=!c.arrow&&null!=ho(r)&&O!==B&&s.reference[g]/2-(O<D?E:T)-m[g]/2<0,U=F?O<D?O-D:O-z:0;return{[f]:p[f]+U,data:{[f]:B,centerOffset:O-B-U,...F&&{alignmentOffset:U}},reset:F}}}),si=(e,t,o)=>{const i=new Map,r={platform:Xo,...o},s={...r.platform,_c:i};return(async(e,t,o)=>{const{placement:i="bottom",strategy:r="absolute",middleware:s=[],platform:a}=o,l=s.filter(Boolean),c=await(null==a.isRTL?void 0:a.isRTL(t));let d=await a.getElementRects({reference:e,floating:t,strategy:r}),{x:h,y:u}=wo(d,i,c),p=i,f={},g=0;for(let o=0;o<l.length;o++){const{name:s,fn:m}=l[o],{x:v,y,data:w,reset:_}=await m({x:h,y:u,initialPlacement:i,placement:p,strategy:r,middlewareData:f,rects:d,platform:a,elements:{reference:e,floating:t}});h=null!=v?v:h,u=null!=y?y:u,f={...f,[s]:{...f[s],...w}},_&&g<=50&&(g++,"object"==typeof _&&(_.placement&&(p=_.placement),_.rects&&(d=!0===_.rects?await a.getElementRects({reference:e,floating:t,strategy:r}):_.rects),({x:h,y:u}=wo(d,p,c))),o=-1)}return{x:h,y:u,placement:p,strategy:r,middlewareData:f}})(e,t,{...r,platform:s})},ai=1;class directive_i{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,o){this._$Ct=e,this._$AM=t,this._$Ci=o}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const li=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends directive_i{constructor(e){if(super(e),e.type!==ai||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter((e=>""!==e))));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const o=e.element.classList;for(const e of this.st)e in t||(o.remove(e),this.st.delete(e));for(const e in t){const i=!!t[e];i===this.st.has(e)||this.nt?.has(e)||(i?(o.add(e),this.st.add(e)):(o.remove(e),this.st.delete(e)))}return lt}});function ci(e){return hi(e)}function di(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function hi(e){for(let t=e;t;t=di(t))if(t instanceof Element&&"none"===getComputedStyle(t).display)return null;for(let t=di(e);t;t=di(t)){if(!(t instanceof Element))continue;const e=getComputedStyle(t);if("contents"!==e.display){if("static"!==e.position||"none"!==e.filter)return t;if("BODY"===t.tagName)return t}}return null}var ui=class extends Xt{constructor(){super(...arguments),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect();let o=0,i=0,r=0,s=0,a=0,l=0,c=0,d=0;this.placement.includes("top")||this.placement.includes("bottom")?e.top<t.top?(o=e.left,i=e.bottom,r=e.right,s=e.bottom,a=t.left,l=t.top,c=t.right,d=t.top):(o=t.left,i=t.bottom,r=t.right,s=t.bottom,a=e.left,l=e.top,c=e.right,d=e.top):e.left<t.left?(o=e.right,i=e.top,r=t.left,s=t.top,a=e.right,l=e.bottom,c=t.left,d=t.bottom):(o=t.right,i=t.top,r=e.left,s=e.top,a=t.right,l=t.bottom,c=e.left,d=e.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${o}px`),this.style.setProperty("--hover-bridge-top-left-y",`${i}px`),this.style.setProperty("--hover-bridge-top-right-x",`${r}px`),this.style.setProperty("--hover-bridge-top-right-y",`${s}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${d}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has("active")&&(this.active?this.start():this.stop()),e.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&"string"==typeof this.anchor){const e=this.getRootNode();this.anchorEl=e.getElementById(this.anchor)}else this.anchor instanceof Element||function(e){return null!==e&&"object"==typeof e&&"getBoundingClientRect"in e&&(!("contextElement"in e)||e instanceof Element)}(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.start()}start(){this.anchorEl&&(this.cleanup=ei(this.anchorEl,this.popup,(()=>{this.reposition()})))}async stop(){return new Promise((e=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame((()=>e()))):e()}))}reposition(){if(!this.active||!this.anchorEl)return;const e=[ti({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(ri({apply:({rects:e})=>{const t="width"===this.sync||"both"===this.sync,o="height"===this.sync||"both"===this.sync;this.popup.style.width=t?`${e.reference.width}px`:"",this.popup.style.height=o?`${e.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&e.push(ii({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:"best-fit"===this.flipFallbackStrategy?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&e.push(oi({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?e.push(ri({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:e,availableHeight:t})=>{"vertical"===this.autoSize||"both"===this.autoSize?this.style.setProperty("--auto-size-available-height",`${t}px`):this.style.removeProperty("--auto-size-available-height"),"horizontal"===this.autoSize||"both"===this.autoSize?this.style.setProperty("--auto-size-available-width",`${e}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&e.push(ni({element:this.arrowEl,padding:this.arrowPadding}));const t="absolute"===this.strategy?e=>Xo.getOffsetParent(e,ci):Xo.getOffsetParent;si(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.strategy,platform:Nt(Ht({},Xo),{getOffsetParent:t})}).then((({x:e,y:t,middlewareData:o,placement:i})=>{const r="rtl"===getComputedStyle(this).direction,s={top:"bottom",right:"left",bottom:"top",left:"right"}[i.split("-")[0]];if(this.setAttribute("data-current-placement",i),Object.assign(this.popup.style,{left:`${e}px`,top:`${t}px`}),this.arrow){const e=o.arrow.x,t=o.arrow.y;let i="",a="",l="",c="";if("start"===this.arrowPlacement){const o="number"==typeof e?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";i="number"==typeof t?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",a=r?o:"",c=r?"":o}else if("end"===this.arrowPlacement){const o="number"==typeof e?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";a=r?"":o,c=r?o:"",l="number"==typeof t?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else"center"===this.arrowPlacement?(c="number"==typeof e?"calc(50% - var(--arrow-size-diagonal))":"",i="number"==typeof t?"calc(50% - var(--arrow-size-diagonal))":""):(c="number"==typeof e?`${e}px`:"",i="number"==typeof t?`${t}px`:"");Object.assign(this.arrowEl.style,{top:i,right:a,bottom:l,left:c,[s]:"calc(var(--arrow-size-diagonal) * -1)"})}})),requestAnimationFrame((()=>this.updateHoverBridge())),this.emit("sl-reposition")}render(){return st`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${li({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${li({popup:!0,"popup--active":this.active,"popup--fixed":"fixed"===this.strategy,"popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?st`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};function pi(e,t){return new Promise((o=>{e.addEventListener(t,(function i(r){r.target===e&&(e.removeEventListener(t,i),o())}))}))}function fi(e,t,o){return new Promise((i=>{if((null==o?void 0:o.duration)===1/0)throw new Error("Promise-based animations must be finite.");const r=e.animate(t,Nt(Ht({},o),{duration:bi()?0:o.duration}));r.addEventListener("cancel",i,{once:!0}),r.addEventListener("finish",i,{once:!0})}))}function gi(e){return(e=e.toString().toLowerCase()).indexOf("ms")>-1?parseFloat(e):e.indexOf("s")>-1?1e3*parseFloat(e):parseFloat(e)}function bi(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function mi(e){return Promise.all(e.getAnimations().map((e=>new Promise((t=>{e.cancel(),requestAnimationFrame(t)})))))}ui.styles=[Jt,Qt],jt([xt(".popup")],ui.prototype,"popup",2),jt([xt(".popup__arrow")],ui.prototype,"arrowEl",2),jt([wt()],ui.prototype,"anchor",2),jt([wt({type:Boolean,reflect:!0})],ui.prototype,"active",2),jt([wt({reflect:!0})],ui.prototype,"placement",2),jt([wt({reflect:!0})],ui.prototype,"strategy",2),jt([wt({type:Number})],ui.prototype,"distance",2),jt([wt({type:Number})],ui.prototype,"skidding",2),jt([wt({type:Boolean})],ui.prototype,"arrow",2),jt([wt({attribute:"arrow-placement"})],ui.prototype,"arrowPlacement",2),jt([wt({attribute:"arrow-padding",type:Number})],ui.prototype,"arrowPadding",2),jt([wt({type:Boolean})],ui.prototype,"flip",2),jt([wt({attribute:"flip-fallback-placements",converter:{fromAttribute:e=>e.split(" ").map((e=>e.trim())).filter((e=>""!==e)),toAttribute:e=>e.join(" ")}})],ui.prototype,"flipFallbackPlacements",2),jt([wt({attribute:"flip-fallback-strategy"})],ui.prototype,"flipFallbackStrategy",2),jt([wt({type:Object})],ui.prototype,"flipBoundary",2),jt([wt({attribute:"flip-padding",type:Number})],ui.prototype,"flipPadding",2),jt([wt({type:Boolean})],ui.prototype,"shift",2),jt([wt({type:Object})],ui.prototype,"shiftBoundary",2),jt([wt({attribute:"shift-padding",type:Number})],ui.prototype,"shiftPadding",2),jt([wt({attribute:"auto-size"})],ui.prototype,"autoSize",2),jt([wt()],ui.prototype,"sync",2),jt([wt({type:Object})],ui.prototype,"autoSizeBoundary",2),jt([wt({attribute:"auto-size-padding",type:Number})],ui.prototype,"autoSizePadding",2),jt([wt({attribute:"hover-bridge",type:Boolean})],ui.prototype,"hoverBridge",2);const vi=new Set,yi=new Map;let wi,_i="ltr",xi="en";const $i="undefined"!=typeof MutationObserver&&"undefined"!=typeof document&&void 0!==document.documentElement;if($i){const e=new MutationObserver(Ai);_i=document.documentElement.dir||"ltr",xi=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function ki(...e){e.map((e=>{const t=e.$code.toLowerCase();yi.has(t)?yi.set(t,Object.assign(Object.assign({},yi.get(t)),e)):yi.set(t,e),wi||(wi=e)})),Ai()}function Ai(){$i&&(_i=document.documentElement.dir||"ltr",xi=document.documentElement.lang||navigator.language),[...vi.keys()].map((e=>{"function"==typeof e.requestUpdate&&e.requestUpdate()}))}class LocalizeController{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){vi.add(this.host)}hostDisconnected(){vi.delete(this.host)}dir(){return`${this.host.dir||_i}`.toLowerCase()}lang(){return`${this.host.lang||xi}`.toLowerCase()}getTranslationData(e){var t,o;const i=new Intl.Locale(e.replace(/_/g,"-")),r=null==i?void 0:i.language.toLowerCase(),s=null!==(o=null===(t=null==i?void 0:i.region)||void 0===t?void 0:t.toLowerCase())&&void 0!==o?o:"";return{locale:i,language:r,region:s,primary:yi.get(`${r}-${s}`),secondary:yi.get(r)}}exists(e,t){var o;const{primary:i,secondary:r}=this.getTranslationData(null!==(o=t.lang)&&void 0!==o?o:this.lang());return t=Object.assign({includeFallback:!1},t),!!(i&&i[e]||r&&r[e]||t.includeFallback&&wi&&wi[e])}term(e,...t){const{primary:o,secondary:i}=this.getTranslationData(this.lang());let r;if(o&&o[e])r=o[e];else if(i&&i[e])r=i[e];else{if(!wi||!wi[e])return String(e);r=wi[e]}return"function"==typeof r?r(...t):r}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(e,t)}}var Si={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>0===e?"No options selected":1===e?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"};ki(Si);var Pi=Si,Ci=class extends LocalizeController{};function Ei(e,t){const o=Ht({waitUntilFirstUpdate:!1},t);return(t,i)=>{const{update:r}=t,s=Array.isArray(e)?e:[e];t.update=function(e){s.forEach((t=>{const r=t;if(e.has(r)){const t=e.get(r),s=this[r];t!==s&&(o.waitUntilFirstUpdate&&!this.hasUpdated||this[i](t,s))}})),r.call(this,e)}}}ki(Pi);var Ri=class extends Xt{constructor(){super(),this.localize=new Ci(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=e=>{"Escape"===e.key&&(e.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const e=gi(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout((()=>this.show()),e)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const e=gi(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout((()=>this.hide()),e)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var e;null==(e=this.closeWatcher)||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(e){return this.trigger.split(" ").includes(e)}async handleOpenChange(){var e,t;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?(null==(e=this.closeWatcher)||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await mi(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:t,options:o}=Kt(this,"tooltip.show",{dir:this.localize.dir()});await fi(this.popup.popup,t,o),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),null==(t=this.closeWatcher)||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await mi(this.body);const{keyframes:e,options:o}=Kt(this,"tooltip.hide",{dir:this.localize.dir()});await fi(this.popup.popup,e,o),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,pi(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,pi(this,"sl-after-hide")}render(){return st`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${li({tooltip:!0,"tooltip--open":this.open})}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        arrow
        hover-bridge
      >
        ${""}
        <slot slot="anchor" aria-describedby="tooltip"></slot>

        ${""}
        <div part="body" id="tooltip" class="tooltip__body" role="tooltip" aria-live=${this.open?"polite":"off"}>
          <slot name="content">${this.content}</slot>
        </div>
      </sl-popup>
    `}};Ri.styles=[Jt,Yt],Ri.dependencies={"sl-popup":ui},jt([xt("slot:not([name])")],Ri.prototype,"defaultSlot",2),jt([xt(".tooltip__body")],Ri.prototype,"body",2),jt([xt("sl-popup")],Ri.prototype,"popup",2),jt([wt()],Ri.prototype,"content",2),jt([wt()],Ri.prototype,"placement",2),jt([wt({type:Boolean,reflect:!0})],Ri.prototype,"disabled",2),jt([wt({type:Number})],Ri.prototype,"distance",2),jt([wt({type:Boolean,reflect:!0})],Ri.prototype,"open",2),jt([wt({type:Number})],Ri.prototype,"skidding",2),jt([wt()],Ri.prototype,"trigger",2),jt([wt({type:Boolean})],Ri.prototype,"hoist",2),jt([Ei("open",{waitUntilFirstUpdate:!0})],Ri.prototype,"handleOpenChange",1),jt([Ei(["content","distance","hoist","placement","skidding"])],Ri.prototype,"handleOptionsChange",1),jt([Ei("disabled")],Ri.prototype,"handleDisabledChange",1),Zt("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),Zt("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}});Ri.define("sl-tooltip");var Ti=Object.defineProperty,Li=Object.getOwnPropertyDescriptor,Di=(e,t,o,i)=>{for(var r,s=i>1?void 0:i?Li(t,o):t,a=e.length-1;a>=0;a--)(r=e[a])&&(s=(i?r(t,o,s):r(s))||s);return i&&s&&Ti(t,o,s),s};Zt("tooltip.show",null),Zt("tooltip.hide",null);let zi=class extends lit_element_s{constructor(){super(...arguments),this.placement="bottom",this.disabled=!1}firstUpdated(){this.observer=new MutationObserver((e=>{for(const t of e)if("attributes"===t.type&&"data-current-placement"===t.attributeName){const e=t.target.getAttribute("data-current-placement");e?this.setAttribute("data-current-placement",e):this.removeAttribute("data-current-placement")}}));const e=this.shadowRoot?.querySelector("sl-tooltip")?.shadowRoot;this.observer.observe(e,{attributes:!0,attributeFilter:["data-current-placement"],subtree:!0})}disconnectedCallback(){this.observer?.disconnect()}render(){return st`<sl-tooltip
			.placement=${this.placement}
			?disabled=${this.disabled}
			.distance=${this.distance??ct}
			hoist
		>
			<slot></slot>
			<div slot="content">
				<slot name="content">${this.content}</slot>
			</div>
		</sl-tooltip>`}};zi.styles=$e`
		sl-tooltip {
			--max-width: 320px;
			--hide-delay: 0ms;
			--show-delay: 500ms;
		}

		sl-tooltip::part(base__popup) {
			pointer-events: none;
		}

		sl-tooltip::part(body) {
			border: 1px solid var(--gl-tooltip-border-color);
			box-shadow: 0 2px 8px var(--gl-tooltip-shadow);
		}

		sl-tooltip::part(base__arrow) {
			border: 1px solid var(--gl-tooltip-border-color);
			z-index: 1;
		}

		:host([data-current-placement^='top']) sl-tooltip::part(base__arrow) {
			border-top-width: 0;
			border-left-width: 0;
		}

		:host([data-current-placement^='bottom']) sl-tooltip::part(base__arrow) {
			border-bottom-width: 0;
			border-right-width: 0;
		}

		:host([data-current-placement^='left']) sl-tooltip::part(base__arrow) {
			border-bottom-width: 0;
			border-left-width: 0;
		}

		:host([data-current-placement^='right']) sl-tooltip::part(base__arrow) {
			border-top-width: 0;
			border-right-width: 0;
		}
	`,Di([wt()],zi.prototype,"content",2),Di([wt({reflect:!0})],zi.prototype,"placement",2),Di([wt({type:Boolean})],zi.prototype,"disabled",2),Di([wt({type:Number})],zi.prototype,"distance",2),Di([wt({type:Boolean})],zi.prototype,"hoist",2),zi=Di([mt("gl-tooltip")],zi);var Oi=Object.defineProperty,Mi=Object.getOwnPropertyDescriptor,Bi=(e,t,o,i)=>{for(var r,s=i>1?void 0:i?Mi(t,o):t,a=e.length-1;a>=0;a--)(r=e[a])&&(s=(i?r(t,o,s):r(s))||s);return i&&s&&Oi(t,o,s),s};let Fi=class extends lit_element_s{constructor(){super(...arguments),this.disabled=!1,this.full=!1}get role(){return this.href?"link":"button"}updated(e){super.updated(e),e.has("disabled")&&this.setAttribute("aria-disabled",this.disabled.toString())}render(){return this.tooltip?st`<gl-tooltip .content=${this.tooltip}>${this.renderControl()}</gl-tooltip>`:this.querySelectorAll('[slot="tooltip"]').length>0?st`<gl-tooltip>
				${this.renderControl()}
				<slot name="tooltip" slot="content"></slot>
			</gl-tooltip>`:this.renderControl()}renderControl(){return null!=this.href?st`<a
				class="control"
				tabindex="${!1===this.disabled?0:-1}"
				href=${this.href}
				@keypress=${e=>this.onLinkKeypress(e)}
				><slot name="prefix"></slot><slot class="label"></slot><slot name="suffix"></slot
			></a>`:st`<button class="control" ?disabled=${this.disabled}>
			<slot name="prefix"></slot><slot class="label"></slot><slot name="suffix"></slot>
		</button>`}onLinkKeypress(e){" "===e.key&&this.control.click()}focus(e){this.control.focus(e)}blur(){this.control.blur()}click(){this.control.click()}};Fi.shadowRootOptions={...lit_element_s.shadowRootOptions,delegatesFocus:!0},Fi.styles=[Tt,$e`
			:host {
				--button-foreground: var(--color-button-foreground);
				--button-background: var(--color-button-background);
				--button-hover-background: var(--vscode-button-hoverBackground);
				--button-padding: 0.4rem;
				--button-gap: 0.6rem;
				--button-compact-padding: 0.4rem;
				--button-tight-padding: 0.4rem 0.8rem;
				--button-line-height: 1.35;
				--button-border: var(--vscode-button-border, transparent);

				display: inline-block;
				border: none;
				font-family: inherit;
				font-size: inherit;
				line-height: var(--button-line-height);
				text-align: center;
				text-decoration: none;
				user-select: none;
				background: var(--button-background);
				color: var(--button-foreground);
				cursor: pointer;
				border: 1px solid var(--button-border);
				border-radius: var(--gk-action-radius, 0.3rem);
			}

			.control {
				display: inline-flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				gap: var(--button-gap);
				padding: var(--button-padding);
				line-height: var(--button-line-height);

				color: inherit;
				text-decoration: none;

				width: max-content;
				height: 100%;
				cursor: pointer;
			}

			button.control {
				appearance: none;
				background: transparent;
				border: none;
			}

			.control:focus {
				outline: none;
			}

			.label {
				display: inline-block;
			}

			:host(:hover) {
				background: var(--button-hover-background);
			}

			:host(:focus-within) {
				${Rt}
			}

			:host([full]),
			:host([full]) .control {
				width: 100%;
			}

			:host([appearance='secondary']) {
				--button-background: var(--vscode-button-secondaryBackground);
				--button-foreground: var(--vscode-button-secondaryForeground);
				--button-hover-background: var(--vscode-button-secondaryHoverBackground);
			}

			:host([appearance='toolbar']) {
				--button-background: transparent;
				--button-foreground: var(--vscode-foreground);
				--button-hover-background: var(--vscode-toolbar-hoverBackground);
				--button-border: transparent;
			}

			:host([appearance='alert']) {
				--button-background: transparent;
				--button-border: var(--color-alert-infoBorder);
				--button-foreground: var(--color-button-foreground);
				--button-hover-background: var(--color-alert-infoBorder);
				--button-line-height: 1.64;
				width: max-content;
			}

			:host-context(.vscode-light):host([appearance='alert']:not(:hover)),
			:host-context(.vscode-high-contrast-light):host([appearance='alert']:not(:hover)) {
				--button-foreground: var(--color-foreground);
			}

			:host([appearance='toolbar'][href]) > a {
				display: flex;
				align-items: center;
			}

			:host([appearance='alert'][href]) > a {
				display: block;
				width: max-content;
			}

			:host([density='compact']) .control {
				padding: var(--button-compact-padding);
			}

			:host([density='tight']) .control {
				padding: var(--button-tight-padding);
			}

			:host([density='tight']) .control ::slotted(code-icon) {
				--code-icon-size: 11px;
				--code-icon-v-align: unset;
			}

			:host([disabled]) {
				opacity: 0.4;
				cursor: not-allowed;
				pointer-events: none;
			}

			gl-tooltip {
				height: 100%;
				display: inline-flex;
				align-items: center;
				justify-content: center;
			}
		`],Bi([xt(".control")],Fi.prototype,"control",2),Bi([wt({reflect:!0})],Fi.prototype,"appearance",2),Bi([wt({type:Boolean,reflect:!0})],Fi.prototype,"disabled",2),Bi([wt({reflect:!0})],Fi.prototype,"density",2),Bi([wt({type:Boolean,reflect:!0})],Fi.prototype,"full",2),Bi([wt()],Fi.prototype,"href",2),Bi([wt({reflect:!0})],Fi.prototype,"role",1),Bi([wt()],Fi.prototype,"tooltip",2),Fi=Bi([mt("gl-button")],Fi);var Ui=Object.defineProperty,Ii=Object.getOwnPropertyDescriptor,Hi=(e,t,o,i)=>{for(var r,s=i>1?void 0:i?Ii(t,o):t,a=e.length-1;a>=0;a--)(r=e[a])&&(s=(i?r(t,o,s):r(s))||s);return i&&s&&Ui(t,o,s),s};let Ni=class extends lit_element_s{constructor(){super(...arguments),this.editor=!1}render(){return st`<div class="group"><slot></slot></div>`}};Ni.styles=[Tt,$e`
			:host {
				display: block;
				max-width: 30rem;
				margin-right: auto;
				margin-left: auto;
				text-align: left;
				transition: max-width 0.2s ease-out;
			}

			@media (min-width: 640px) {
				:host(:not([editor])) {
					max-width: 100%;
				}
			}

			.group {
				display: inline-flex;
				gap: 0.4rem;
				width: 100%;
				max-width: 30rem;
			}
		`],Hi([wt({type:Boolean})],Ni.prototype,"editor",2),Ni=Hi([mt("button-container")],Ni);var ji=Object.defineProperty,qi=Object.getOwnPropertyDescriptor,Vi=(e,t,o,i)=>{for(var r,s=i>1?void 0:i?qi(t,o):t,a=e.length-1;a>=0;a--)(r=e[a])&&(s=(i?r(t,o,s):r(s))||s);return i&&s&&ji(t,o,s),s};const Gi=Object.freeze({add:"\\ea60",plus:"\\ea60","gist-new":"\\ea60","repo-create":"\\ea60",lightbulb:"\\ea61","light-bulb":"\\ea61",repo:"\\ea62","repo-delete":"\\ea62","gist-fork":"\\ea63","repo-forked":"\\ea63","git-pull-request":"\\ea64","git-pull-request-abandoned":"\\ea64","record-keys":"\\ea65",keyboard:"\\ea65",tag:"\\ea66","tag-add":"\\ea66","tag-remove":"\\ea66",person:"\\ea67","person-follow":"\\ea67","person-outline":"\\ea67","person-filled":"\\ea67","git-branch":"\\ea68","git-branch-create":"\\ea68","git-branch-delete":"\\ea68","source-control":"\\ea68",mirror:"\\ea69","mirror-public":"\\ea69",star:"\\ea6a","star-add":"\\ea6a","star-delete":"\\ea6a","star-empty":"\\ea6a",comment:"\\ea6b","comment-add":"\\ea6b",alert:"\\ea6c",warning:"\\ea6c",search:"\\ea6d","search-save":"\\ea6d","log-out":"\\ea6e","sign-out":"\\ea6e","log-in":"\\ea6f","sign-in":"\\ea6f",eye:"\\ea70","eye-unwatch":"\\ea70","eye-watch":"\\ea70","circle-filled":"\\ea71","primitive-dot":"\\ea71","close-dirty":"\\ea71","debug-breakpoint":"\\ea71","debug-breakpoint-disabled":"\\ea71","debug-hint":"\\ea71","primitive-square":"\\ea72",edit:"\\ea73",pencil:"\\ea73",info:"\\ea74","issue-opened":"\\ea74","gist-private":"\\ea75","git-fork-private":"\\ea75",lock:"\\ea75","mirror-private":"\\ea75",close:"\\ea76","remove-close":"\\ea76",x:"\\ea76","repo-sync":"\\ea77",sync:"\\ea77",clone:"\\ea78","desktop-download":"\\ea78",beaker:"\\ea79",microscope:"\\ea79",vm:"\\ea7a","device-desktop":"\\ea7a",file:"\\ea7b","file-text":"\\ea7b",more:"\\ea7c",ellipsis:"\\ea7c","kebab-horizontal":"\\ea7c","mail-reply":"\\ea7d",reply:"\\ea7d",organization:"\\ea7e","organization-filled":"\\ea7e","organization-outline":"\\ea7e","new-file":"\\ea7f","file-add":"\\ea7f","new-folder":"\\ea80","file-directory-create":"\\ea80",trash:"\\ea81",trashcan:"\\ea81",history:"\\ea82",clock:"\\ea82",folder:"\\ea83","file-directory":"\\ea83","symbol-folder":"\\ea83","logo-github":"\\ea84","mark-github":"\\ea84",github:"\\ea84",terminal:"\\ea85",console:"\\ea85",repl:"\\ea85",zap:"\\ea86","symbol-event":"\\ea86",error:"\\ea87",stop:"\\ea87",variable:"\\ea88","symbol-variable":"\\ea88",array:"\\ea8a","symbol-array":"\\ea8a","symbol-module":"\\ea8b","symbol-package":"\\ea8b","symbol-namespace":"\\ea8b","symbol-object":"\\ea8b","symbol-method":"\\ea8c","symbol-function":"\\ea8c","symbol-constructor":"\\ea8c","symbol-boolean":"\\ea8f","symbol-null":"\\ea8f","symbol-numeric":"\\ea90","symbol-number":"\\ea90","symbol-structure":"\\ea91","symbol-struct":"\\ea91","symbol-parameter":"\\ea92","symbol-type-parameter":"\\ea92","symbol-key":"\\ea93","symbol-text":"\\ea93","symbol-reference":"\\ea94","go-to-file":"\\ea94","symbol-enum":"\\ea95","symbol-value":"\\ea95","symbol-ruler":"\\ea96","symbol-unit":"\\ea96","activate-breakpoints":"\\ea97",archive:"\\ea98","arrow-both":"\\ea99","arrow-down":"\\ea9a","arrow-left":"\\ea9b","arrow-right":"\\ea9c","arrow-small-down":"\\ea9d","arrow-small-left":"\\ea9e","arrow-small-right":"\\ea9f","arrow-small-up":"\\eaa0","arrow-up":"\\eaa1",bell:"\\eaa2",bold:"\\eaa3",book:"\\eaa4",bookmark:"\\eaa5","debug-breakpoint-conditional-unverified":"\\eaa6","debug-breakpoint-conditional":"\\eaa7","debug-breakpoint-conditional-disabled":"\\eaa7","debug-breakpoint-data-unverified":"\\eaa8","debug-breakpoint-data":"\\eaa9","debug-breakpoint-data-disabled":"\\eaa9","debug-breakpoint-log-unverified":"\\eaaa","debug-breakpoint-log":"\\eaab","debug-breakpoint-log-disabled":"\\eaab",briefcase:"\\eaac",broadcast:"\\eaad",browser:"\\eaae",bug:"\\eaaf",calendar:"\\eab0","case-sensitive":"\\eab1",check:"\\eab2",checklist:"\\eab3","chevron-down":"\\eab4","chevron-left":"\\eab5","chevron-right":"\\eab6","chevron-up":"\\eab7","chrome-close":"\\eab8","chrome-maximize":"\\eab9","chrome-minimize":"\\eaba","chrome-restore":"\\eabb","circle-outline":"\\eabc","debug-breakpoint-unverified":"\\eabc","circle-slash":"\\eabd","circuit-board":"\\eabe","clear-all":"\\eabf",clippy:"\\eac0","close-all":"\\eac1","cloud-download":"\\eac2","cloud-upload":"\\eac3",code:"\\eac4","collapse-all":"\\eac5","color-mode":"\\eac6","comment-discussion":"\\eac7","credit-card":"\\eac9",dash:"\\eacc",dashboard:"\\eacd",database:"\\eace","debug-continue":"\\eacf","debug-disconnect":"\\ead0","debug-pause":"\\ead1","debug-restart":"\\ead2","debug-start":"\\ead3","debug-step-into":"\\ead4","debug-step-out":"\\ead5","debug-step-over":"\\ead6","debug-stop":"\\ead7",debug:"\\ead8","device-camera-video":"\\ead9","device-camera":"\\eada","device-mobile":"\\eadb","diff-added":"\\eadc","diff-ignored":"\\eadd","diff-modified":"\\eade","diff-removed":"\\eadf","diff-renamed":"\\eae0",diff:"\\eae1",discard:"\\eae2","editor-layout":"\\eae3","empty-window":"\\eae4",exclude:"\\eae5",extensions:"\\eae6","eye-closed":"\\eae7","file-binary":"\\eae8","file-code":"\\eae9","file-media":"\\eaea","file-pdf":"\\eaeb","file-submodule":"\\eaec","file-symlink-directory":"\\eaed","file-symlink-file":"\\eaee","file-zip":"\\eaef",files:"\\eaf0",filter:"\\eaf1",flame:"\\eaf2","fold-down":"\\eaf3","fold-up":"\\eaf4",fold:"\\eaf5","folder-active":"\\eaf6","folder-opened":"\\eaf7",gear:"\\eaf8",gift:"\\eaf9","gist-secret":"\\eafa",gist:"\\eafb","git-commit":"\\eafc","git-compare":"\\eafd","compare-changes":"\\eafd","git-merge":"\\eafe","github-action":"\\eaff","github-alt":"\\eb00",globe:"\\eb01",grabber:"\\eb02",graph:"\\eb03",gripper:"\\eb04",heart:"\\eb05",home:"\\eb06","horizontal-rule":"\\eb07",hubot:"\\eb08",inbox:"\\eb09","issue-reopened":"\\eb0b",issues:"\\eb0c",italic:"\\eb0d",jersey:"\\eb0e",json:"\\eb0f","kebab-vertical":"\\eb10",key:"\\eb11",law:"\\eb12","lightbulb-autofix":"\\eb13","link-external":"\\eb14",link:"\\eb15","list-ordered":"\\eb16","list-unordered":"\\eb17","live-share":"\\eb18",loading:"\\eb19",location:"\\eb1a","mail-read":"\\eb1b",mail:"\\eb1c",markdown:"\\eb1d",megaphone:"\\eb1e",mention:"\\eb1f",milestone:"\\eb20","mortar-board":"\\eb21",move:"\\eb22","multiple-windows":"\\eb23",mute:"\\eb24","no-newline":"\\eb25",note:"\\eb26",octoface:"\\eb27","open-preview":"\\eb28",package:"\\eb29",paintcan:"\\eb2a",pin:"\\eb2b",play:"\\eb2c",run:"\\eb2c",plug:"\\eb2d","preserve-case":"\\eb2e",preview:"\\eb2f",project:"\\eb30",pulse:"\\eb31",question:"\\eb32",quote:"\\eb33","radio-tower":"\\eb34",reactions:"\\eb35",references:"\\eb36",refresh:"\\eb37",regex:"\\eb38","remote-explorer":"\\eb39",remote:"\\eb3a",remove:"\\eb3b","replace-all":"\\eb3c",replace:"\\eb3d","repo-clone":"\\eb3e","repo-force-push":"\\eb3f","repo-pull":"\\eb40","repo-push":"\\eb41",report:"\\eb42","request-changes":"\\eb43",rocket:"\\eb44","root-folder-opened":"\\eb45","root-folder":"\\eb46",rss:"\\eb47",ruby:"\\eb48","save-all":"\\eb49","save-as":"\\eb4a",save:"\\eb4b","screen-full":"\\eb4c","screen-normal":"\\eb4d","search-stop":"\\eb4e",server:"\\eb50","settings-gear":"\\eb51",settings:"\\eb52",shield:"\\eb53",smiley:"\\eb54","sort-precedence":"\\eb55","split-horizontal":"\\eb56","split-vertical":"\\eb57",squirrel:"\\eb58","star-full":"\\eb59","star-half":"\\eb5a","symbol-class":"\\eb5b","symbol-color":"\\eb5c","symbol-constant":"\\eb5d","symbol-enum-member":"\\eb5e","symbol-field":"\\eb5f","symbol-file":"\\eb60","symbol-interface":"\\eb61","symbol-keyword":"\\eb62","symbol-misc":"\\eb63","symbol-operator":"\\eb64","symbol-property":"\\eb65",wrench:"\\eb65","wrench-subaction":"\\eb65","symbol-snippet":"\\eb66",tasklist:"\\eb67",telescope:"\\eb68","text-size":"\\eb69","three-bars":"\\eb6a",thumbsdown:"\\eb6b",thumbsup:"\\eb6c",tools:"\\eb6d","triangle-down":"\\eb6e","triangle-left":"\\eb6f","triangle-right":"\\eb70","triangle-up":"\\eb71",twitter:"\\eb72",unfold:"\\eb73",unlock:"\\eb74",unmute:"\\eb75",unverified:"\\eb76",verified:"\\eb77",versions:"\\eb78","vm-active":"\\eb79","vm-outline":"\\eb7a","vm-running":"\\eb7b",watch:"\\eb7c",whitespace:"\\eb7d","whole-word":"\\eb7e",window:"\\eb7f","word-wrap":"\\eb80","zoom-in":"\\eb81","zoom-out":"\\eb82","list-filter":"\\eb83","list-flat":"\\eb84","list-selection":"\\eb85",selection:"\\eb85","list-tree":"\\eb86","debug-breakpoint-function-unverified":"\\eb87","debug-breakpoint-function":"\\eb88","debug-breakpoint-function-disabled":"\\eb88","debug-stackframe-active":"\\eb89","debug-stackframe-dot":"\\eb8a","debug-stackframe":"\\eb8b","debug-stackframe-focused":"\\eb8b","debug-breakpoint-unsupported":"\\eb8c","symbol-string":"\\eb8d","debug-reverse-continue":"\\eb8e","debug-step-back":"\\eb8f","debug-restart-frame":"\\eb90","debug-alt":"\\eb91","call-incoming":"\\eb92","call-outgoing":"\\eb93",menu:"\\eb94","expand-all":"\\eb95",feedback:"\\eb96","group-by-ref-type":"\\eb97","ungroup-by-ref-type":"\\eb98",account:"\\eb99","bell-dot":"\\eb9a","debug-console":"\\eb9b",library:"\\eb9c",output:"\\eb9d","run-all":"\\eb9e","sync-ignored":"\\eb9f",pinned:"\\eba0","github-inverted":"\\eba1","server-process":"\\eba2","server-environment":"\\eba3",pass:"\\eba4","issue-closed":"\\eba4","stop-circle":"\\eba5","play-circle":"\\eba6",record:"\\eba7","debug-alt-small":"\\eba8","vm-connect":"\\eba9",cloud:"\\ebaa",merge:"\\ebab",export:"\\ebac","graph-left":"\\ebad",magnet:"\\ebae",notebook:"\\ebaf",redo:"\\ebb0","check-all":"\\ebb1","pinned-dirty":"\\ebb2","pass-filled":"\\ebb3","circle-large-filled":"\\ebb4","circle-large-outline":"\\ebb5",combine:"\\ebb6",gather:"\\ebb6",table:"\\ebb7","variable-group":"\\ebb8","type-hierarchy":"\\ebb9","type-hierarchy-sub":"\\ebba","type-hierarchy-super":"\\ebbb","git-pull-request-create":"\\ebbc","run-above":"\\ebbd","run-below":"\\ebbe","notebook-template":"\\ebbf","debug-rerun":"\\ebc0","workspace-trusted":"\\ebc1","workspace-untrusted":"\\ebc2","workspace-unknown":"\\ebc3","terminal-cmd":"\\ebc4","terminal-debian":"\\ebc5","terminal-linux":"\\ebc6","terminal-powershell":"\\ebc7","terminal-tmux":"\\ebc8","terminal-ubuntu":"\\ebc9","terminal-bash":"\\ebca","arrow-swap":"\\ebcb",copy:"\\ebcc","person-add":"\\ebcd","filter-filled":"\\ebce",wand:"\\ebcf","debug-line-by-line":"\\ebd0",inspect:"\\ebd1",layers:"\\ebd2","layers-dot":"\\ebd3","layers-active":"\\ebd4",compass:"\\ebd5","compass-dot":"\\ebd6","compass-active":"\\ebd7",azure:"\\ebd8","issue-draft":"\\ebd9","git-pull-request-closed":"\\ebda","git-pull-request-draft":"\\ebdb","debug-all":"\\ebdc","debug-coverage":"\\ebdd","run-errors":"\\ebde","folder-library":"\\ebdf","debug-continue-small":"\\ebe0","beaker-stop":"\\ebe1","graph-line":"\\ebe2","graph-scatter":"\\ebe3","pie-chart":"\\ebe4",bracket:"\\eb0f","bracket-dot":"\\ebe5","bracket-error":"\\ebe6","lock-small":"\\ebe7","azure-devops":"\\ebe8","verified-filled":"\\ebe9",newline:"\\ebea",layout:"\\ebeb","layout-activitybar-left":"\\ebec","layout-activitybar-right":"\\ebed","layout-panel-left":"\\ebee","layout-panel-center":"\\ebef","layout-panel-justify":"\\ebf0","layout-panel-right":"\\ebf1","layout-panel":"\\ebf2","layout-sidebar-left":"\\ebf3","layout-sidebar-right":"\\ebf4","layout-statusbar":"\\ebf5","layout-menubar":"\\ebf6","layout-centered":"\\ebf7",target:"\\ebf8",indent:"\\ebf9","record-small":"\\ebfa","error-small":"\\ebfb","terminal-decoration-error":"\\ebfb","arrow-circle-down":"\\ebfc","arrow-circle-left":"\\ebfd","arrow-circle-right":"\\ebfe","arrow-circle-up":"\\ebff","layout-sidebar-right-off":"\\ec00","layout-panel-off":"\\ec01","layout-sidebar-left-off":"\\ec02",blank:"\\ec03","heart-filled":"\\ec04",map:"\\ec05","map-filled":"\\ec06","circle-small":"\\ec07","bell-slash":"\\ec08","bell-slash-dot":"\\ec09","comment-unresolved":"\\ec0a","git-pull-request-go-to-changes":"\\ec0b","git-pull-request-new-changes":"\\ec0c","search-fuzzy":"\\ec0d","comment-draft":"\\ec0e",send:"\\ec0f",sparkle:"\\ec10",insert:"\\ec11","gl-commit-horizontal":"\\f101","gl-graph":"\\f102","gl-next-commit":"\\f103","gl-prev-commit-menu":"\\f104","gl-prev-commit":"\\f105","gl-compare-ref-working":"\\f106","gl-branches-view":"\\f107","gl-commit-view":"\\f108","gl-commits-view":"\\f109","gl-compare-view":"\\f10a","gl-contributors-view":"\\f10b","gl-history-view":"\\f10c","gl-remotes-view":"\\f10d","gl-repositories-view":"\\f10e","gl-search-view":"\\f10f","gl-stashes-view":"\\f110","gl-tags-view":"\\f111","gl-worktrees-view":"\\f112","gl-gitlens":"\\f113","gl-stash-pop":"\\f114","gl-stash-save":"\\f115","gl-unplug":"\\f116","gl-open-revision":"\\f117","gl-switch":"\\f118","gl-expand":"\\f119","gl-list-auto":"\\f11a","gl-repo-force-push":"\\f11b","gl-pinned-filled":"\\f11c","gl-clock":"\\f11d","gl-provider-azdo":"\\f11e","gl-provider-bitbucket":"\\f11f","gl-provider-gerrit":"\\f120","gl-provider-gitea":"\\f121","gl-provider-github":"\\f122","gl-provider-gitlab":"\\f123","gl-gitlens-inspect":"\\f124","gl-workspaces-view":"\\f125","gl-cloud-patch":"\\f128","gl-cloud-patch-share":"\\f129","gl-inspect":"\\f12a","gl-repository-filled":"\\f12b","gl-code-suggestion":"\\f12d","gl-diff-multiple":"\\f12e","gl-diff-single":"\\f12f","gl-repo-fetch":"\\f130","gl-repo-pull":"\\f131","gl-repo-push":"\\f132","gl-provider-jira":"\\f133"});let Wi=class extends lit_element_s{constructor(){super(...arguments),this.icon="",this.modifier="",this.size=void 0}updated(e){e.has("size")&&this.style.setProperty("--code-icon-size",`${this.size}px`),super.update(e)}};Wi.styles=$e`
		:host {
			--code-icon-size: 16px;
			--code-icon-v-align: text-bottom;

			font: normal normal normal var(--code-icon-size, 16px) / 1 codicon;
			display: inline-block;
			text-decoration: none;
			text-rendering: auto;
			text-align: center;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			user-select: none;
			-webkit-user-select: none;
			-ms-user-select: none;
			color: inherit;
			vertical-align: var(--code-icon-v-align);
			letter-spacing: normal;
		}

		:host([icon^='gl-']) {
			font-family: 'glicons';
		}

		${xe(Object.entries(Gi).map((([e,t])=>`\n\t\t\t\t\t\t:host([icon='${e}'])::before {\n\t\t\t\t\t\t\tcontent: '${t}';\n\t\t\t\t\t\t}\n\t\t\t\t\t`)).join(""))}

		:host([icon='gl-pinned-filled']):before {
			/* TODO: see relative positioning needed in every use-case */
			position: relative;
			left: 1px;
		}

		@keyframes codicon-spin {
			100% {
				transform: rotate(360deg);
			}
		}

		:host([modifier='spin']) {
			/* Use steps to throttle FPS to reduce CPU usage */
			animation: codicon-spin 1.5s steps(30) infinite;
		}
		:host([icon='loading'][modifier='spin']) {
			/* Use steps to throttle FPS to reduce CPU usage */
			animation: codicon-spin 1.5s steps(30) infinite;

			/* custom speed & easing for loading icon */
			animation-duration: 1s !important;
			animation-timing-function: cubic-bezier(0.53, 0.21, 0.29, 0.67) !important;
		}

		:host([flip='inline']) {
			transform: rotateY(180deg);
		}

		:host([flip='block']) {
			transform: rotateX(180deg);
		}

		:host([rotate='45']) {
			transform: rotateZ(45deg);
		}
	`,Vi([wt({reflect:!0})],Wi.prototype,"icon",2),Vi([wt({reflect:!0})],Wi.prototype,"modifier",2),Vi([wt({type:Number})],Wi.prototype,"size",2),Vi([wt({reflect:!0})],Wi.prototype,"flip",2),Vi([wt({reflect:!0})],Wi.prototype,"rotate",2),Wi=Vi([mt("code-icon")],Wi);var Zi=Object.defineProperty,Ki=Object.getOwnPropertyDescriptor,Yi=(e,t,o,i)=>{for(var r,s=i>1?void 0:i?Ki(t,o):t,a=e.length-1;a>=0;a--)(r=e[a])&&(s=(i?r(t,o,s):r(s))||s);return i&&s&&Zi(t,o,s),s};let Qi=class extends lit_element_s{constructor(){super(...arguments),this.type="info"}render(){if(!this.promo)return;const e=this.renderPromo(this.promo);return e?"link"===this.type?st`<a
				class="link"
				href="${this.promo.command??"command:gitlens.plus.upgrade"}"
				title="${this.promo.linkTooltip}"
				>${e}</a
			>`:st`<p class="promo">${e}</p>`:void 0}renderPromo(e){switch(e.key){case"devexdays24":return st`<span class="header"><gl-svg-devexdays24-promo></gl-svg-devexdays24-promo>Sale:</span
					><span class="content"><b>Save up to 80% on GitLens Pro</b> - lowest price of the year!</span>`;case"pro50":return"link"===this.type?st`<span class="content"
						>Special: <b>1st seat of Pro is now 50%+ off.</b> See your special price.</span
					>`:st`<span class="content muted">Special: <b>1st seat of Pro is now 50%+ off</b></span>`}return ct}};Qi.styles=[$e`
			:host {
				display: block;
			}

			.promo {
				margin: 0;
				margin-top: 0.8rem;
				text-align: center;
			}

			.header {
				margin-right: 0.4rem;
			}

			.content {
				font-size: smaller;
			}

			.muted {
				opacity: 0.7;
			}

			.link {
				display: block;
				color: inherit;
				max-width: 100%;
				text-align: center;
				text-decoration: none;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.link:hover {
				color: inherit;
				text-decoration: underline;
			}
		`],Yi([wt({type:Object})],Qi.prototype,"promo",2),Yi([wt({reflect:!0,type:String})],Qi.prototype,"type",2),Qi=Yi([mt("gl-promo")],Qi);let Ji=class extends lit_element_s{render(){return at`
			<!-- Don't reformat or let prettier reformat the SVG otherwise whitespace will get added incorrect and screw up the positioning -->
			<!-- a-prettier-ignore -->
			<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 25">
				<path
					d="M64.06 13.26c0 .73-.55 1.32-1.24 1.32-.68 0-1.24-.6-1.24-1.32 0-.73.56-1.33 1.24-1.33.69 0 1.24.6 1.24 1.33ZM29.84 19.64h-1.66l-4.2-13h1.57l3.47 11.06L32.5 6.65h1.55l-4.2 12.99ZM22.93 19.64H15.6c-1.65 0-2.43-.4-2.43-2.5v-8c0-2.1.78-2.5 2.43-2.5h5.38c1.66 0 2.44.4 2.44 2.5v2.96c0 2.1-.78 2.5-2.44 2.5h-6.3v2.51c0 1.04.33 1.06 2.14 1.06h6.1v1.47Zm-1-7.56V9.2c0-.69-.13-1.07-1.01-1.07h-5.23c-.88 0-1.01.38-1.01 1.07v3.94h6.24c.88 0 1.01-.38 1.01-1.06ZM8.79 19.64H3.4c-1.66 0-2.43-.4-2.43-2.5v-8c0-2.1.77-2.5 2.43-2.5h6.33V.75h1.48v16.4c0 2.1-.77 2.5-2.43 2.5Zm.95-2.53V8.13H3.5c-.89 0-1.02.38-1.02 1.07v7.91c0 .69.13 1.06 1.02 1.06h5.22c.89 0 1.02-.37 1.02-1.06ZM109.26 19.64h-6.7v-1.47h6.61c.89 0 1.02-.37 1.02-1.06v-2.2c0-.68-.13-1.06-1.02-1.06h-4.7c-1.65 0-2.42-.4-2.42-2.5v-2.2c0-2.1.77-2.5 2.43-2.5h6.66v1.48h-6.6c-.88 0-1.01.38-1.01 1.07v2.12c0 .64.13 1.07.95 1.07h4.78c1.66 0 2.43.4 2.43 2.5v2.24c0 2.1-.77 2.5-2.43 2.5ZM95.77 24.36H94.4l1.48-4.72-4.43-13h1.6l3.54 10.73 3.43-10.72h1.5l-5.75 17.71ZM88.22 19.64h-5.38c-1.66 0-2.43-.4-2.43-2.5v-3.12c0-2.1.77-2.5 2.43-2.5h6.33V9.2c0-.69-.14-1.07-1.02-1.07h-7.5V6.65h7.57c1.66 0 2.43.4 2.43 2.5v7.98c0 2.1-.77 2.5-2.43 2.5Zm.95-2.53V13h-6.24c-.89 0-1.02.38-1.02 1.06v3.05c0 .69.13 1.06 1.02 1.06h5.22c.88 0 1.02-.37 1.02-1.06ZM76.27 19.64h-5.38c-1.66 0-2.43-.4-2.43-2.5V9.14c0-2.1.77-2.5 2.43-2.5h6.33V.74h1.48v16.4c0 2.1-.77 2.5-2.43 2.5Zm.95-2.53V8.13h-6.24c-.89 0-1.02.38-1.02 1.07v7.91c0 .69.13 1.06 1.02 1.06h5.22c.89 0 1.02-.37 1.02-1.06ZM45.6 19.64h-7.33c-1.66 0-2.43-.4-2.43-2.5v-8c0-2.1.77-2.5 2.43-2.5h5.38c1.66 0 2.43.4 2.43 2.5v2.96c0 2.1-.77 2.5-2.43 2.5h-5.53v1.92c0 .8.2.83 1.17.83h6.3v2.29Zm-1.77-8.15v-1.7c0-.69-.13-.83-.8-.83h-4.11c-.67 0-.8.14-.8.83v2.52h4.91c.66 0 .8-.14.8-.82ZM137.37 19.64h-2.65V15.4h-7.97v-2.84l4.98-9.99h3.05l-5.13 10.11h5.07V6.65h2.65v12.99ZM125.83 19.64h-10.18V16.6l6.8-6.56c.86-.85.9-1.4.9-2.08V6c0-.69-.13-.71-.69-.71h-3.65c-.55 0-.68.02-.68.7v1.68h-2.68v-2.6c0-2.1.77-2.5 2.43-2.5h5.5c1.65 0 2.42.4 2.42 2.5v2.63c0 2.1-.02 2.9-1.37 4.2l-5.24 5.01h6.44v2.72ZM46.42 22.65c0-.63.48-1.14 1.07-1.14h10.1c.6 0 1.08.5 1.08 1.14 0 .63-.48 1.14-1.07 1.14H47.49c-.59 0-1.07-.51-1.07-1.14ZM47.54 17.98l2.99-4.46-3-5.03c-.42-.7.05-1.61.83-1.61h1.6c.35 0 .68.2.85.52l3.46 6.38-3.45 5.4a.97.97 0 0 1-.81.46h-1.67c-.8 0-1.27-.97-.8-1.66Z"
					fill="currentColor"
				/>
				<path
					opacity=".5"
					d="m57.8 17.98-2.99-4.46 3-5.03c.42-.7-.05-1.61-.83-1.61h-1.6c-.35 0-.68.2-.85.52l-3.46 6.38 3.45 5.4c.18.29.49.46.81.46H57c.8 0 1.27-.97.8-1.66Z"
					fill="currentColor"
				/>
			</svg>
		`}};Ji.styles=[$e`
			svg {
				max-width: 8rem;
				height: auto;
				vertical-align: text-bottom;
			}
		`],Ji=Yi([mt("gl-svg-devexdays24-promo")],Ji);var Xi=Object.defineProperty,er=Object.getOwnPropertyDescriptor,tr=(e,t,o,i)=>{for(var r,s=i>1?void 0:i?er(t,o):t,a=e.length-1;a>=0;a--)(r=e[a])&&(s=(i?r(t,o,s):r(s))||s);return i&&s&&Xi(t,o,s),s};let or=class extends lit_element_s{constructor(){super(...arguments),this.image="",this.organizationsCount=0}get daysRemaining(){return null==this.subscription?0:Pt(this.subscription,"days")??0}get hasAccount(){return null!=(e=this.state)&&0!==e&&2!==e&&1!==e;var e}get isReactivatedTrial(){return this.state===At.FreePlusInTrial&&(this.subscription?.plan.effective.trialReactivationCount??0)>0}get planId(){return this.subscription?.plan.actual.id??kt.Pro}get planName(){switch(this.state){case At.Free:case At.FreePreviewTrialExpired:case At.FreePlusTrialExpired:case At.FreePlusTrialReactivationEligible:return"GitKraken Free";case At.FreeInPreviewTrial:case At.FreePlusInTrial:return"GitKraken Pro (Trial)";case At.VerificationRequired:return`${St(this.planId)} (Unverified)`;default:return St(this.planId)}}get state(){return this.subscription?.state}render(){return st`${this.renderAccountInfo()}${this.renderOrganization()}${this.renderAccountState()}`}renderAccountInfo(){return this.hasAccount?st`
			<div class="account">
				<div class="account__media">
					${this.image?st`<img src=${this.image} class="account__image" />`:st`<code-icon icon="account" size="34"></code-icon>`}
				</div>
				<div class="account__details">
					<p class="account__title">${this.subscription?.account?.name??""}</p>
					${$t(0===this.organizationsCount,(()=>st`<p class="account__access">${this.planName}</p>`))}
				</div>
				<div class="account__signout">
					<gl-button
						appearance="toolbar"
						href="command:gitlens.plus.logout"
						tooltip="Sign Out"
						aria-label="Sign Out"
						><code-icon icon="sign-out"></code-icon
					></gl-button>
				</div>
			</div>
		`:ct}renderOrganization(){const e=this.subscription?.activeOrganization?.name??"";return this.hasAccount&&e?st`
			<div class="account account--org">
				<div class="account__media">
					<code-icon icon="organization" size="22"></code-icon>
				</div>
				<div class="account__details">
					<p class="account__title">${e}</p>
					<p class="account__access">${this.planName}</p>
				</div>
				${$t(this.organizationsCount>1,(()=>st`<div class="account__signout">
							<span class="account__badge">+${this.organizationsCount-1}</span>
							<gl-button
								appearance="toolbar"
								href="command:gitlens.gk.switchOrganization"
								tooltip="Switch Organization"
								aria-label="Switch Organization"
								><code-icon icon="arrow-swap"></code-icon
							></gl-button>
						</div>`))}
			</div>
		`:ct}renderAccountState(){const e=function(e){if(null==e)return;const t=Date.now();for(const o of Et)if((null==o.states||o.states.includes(e))&&(null==o.expiresOn||o.expiresOn>t)&&(null==o.startsOn||o.startsOn<t))return o}(this.state);switch(this.state){case At.Paid:return st`
					<button-container>
						<gl-button appearance="secondary" full href="command:gitlens.plus.manage"
							>Manage Account</gl-button
						>
						<gl-button
							appearance="secondary"
							full
							href="command:gitlens.plus.cloudIntegrations.manage?%7B%22source%22%3A%22account%22%7D"
							>Integrations</gl-button
						>
					</button-container>
					<p>
						Your ${St(this.planId)} plan provides full access to all Pro features and
						our <a href="${P.platform}">DevEx platform</a>, unleashing powerful Git visualization &
						productivity capabilities everywhere you work: IDE, desktop, browser, and terminal.
					</p>
				`;case At.VerificationRequired:return st`
					<p>You must verify your email before you can access Pro features.</p>
					<button-container>
						<gl-button full href="command:gitlens.plus.resendVerification">Resend Email</gl-button>
						<gl-button appearance="secondary" href="command:gitlens.plus.validate"
							><code-icon size="20" icon="refresh"></code-icon>
						</gl-button>
					</button-container>
				`;case At.FreePlusInTrial:{const t=this.daysRemaining;return st`
					${this.isReactivatedTrial?st`<p>
								<code-icon icon="megaphone"></code-icon>
								See
								<a href="${P.releaseNotes}">what's new</a>
								in GitLens.
						  </p>`:ct}
					<p>
						You have
						<strong>${t<1?"<1 day":function(e,t,o){if(null==o)return`${t} ${e}${1===t?"":"s"}`;const i=1===t?e:o.plural??`${e}s`;return o.only?i:`${0===t?o.zero??t:o.format?.(t)??t}${o.infix??" "}${i}`}("day",t,{infix:" more "})} left</strong>
						in your Pro trial. Once your trial ends, you will only be able to use Pro features on
						publicly-hosted repos.
					</p>
					<button-container>
						<gl-button full href="command:gitlens.plus.upgrade">Upgrade to Pro</gl-button>
					</button-container>
					${this.renderPromo(e)} ${this.renderIncludesDevEx()}
				`}case At.FreePlusTrialExpired:return st`
					<p>Your Pro trial has ended. You can now only use Pro features on publicly-hosted repos.</p>
					<button-container>
						<gl-button full href="command:gitlens.plus.upgrade">Upgrade to Pro</gl-button>
					</button-container>
					${this.renderPromo(e)} ${this.renderIncludesDevEx()}
				`;case At.FreePlusTrialReactivationEligible:return st`
					<p>Reactivate your Pro trial and experience all the new Pro features — free for another 7 days!</p>
					<button-container>
						<gl-button full href="command:gitlens.plus.reactivateProTrial">Reactivate Pro Trial</gl-button>
					</button-container>
					${this.renderIncludesDevEx()}
				`;default:return st`
					<p>
						Sign up for access to Pro features and our
						<a href="${P.platform}">DevEx platform</a>, or
						<a href="command:gitlens.plus.login">sign in</a>.
					</p>
					<button-container>
						<gl-button full href="command:gitlens.plus.signUp">Sign Up</gl-button>
					</button-container>
					<p>Signing up starts your free 7-day Pro trial.</p>
					${this.renderIncludesDevEx()}
				`}}renderIncludesDevEx(){return st`
			<p>
				Includes access to our
				<a href="${P.platform}">DevEx platform</a>, unleashing powerful Git visualization & productivity
				capabilities everywhere you work: IDE, desktop, browser, and terminal.
			</p>
		`}renderPromo(e){return st`<gl-promo .promo=${e}></gl-promo>`}};or.styles=[Tt,Lt,$e`
			:host {
				display: block;
				margin-bottom: 1.3rem;
			}

			button-container {
				margin-bottom: 1.3rem;
			}

			.account {
				position: relative;
				display: grid;
				gap: 0 0.8rem;
				grid-template-columns: 3.4rem auto min-content;
				grid-auto-flow: column;
				margin-bottom: 1.3rem;
			}

			.account--org {
				font-size: 0.9em;
				line-height: 1.2;
				margin-top: -1rem;
			}

			.account__media {
				grid-column: 1;
				grid-row: 1 / span 2;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.account--org .account__media {
				color: var(--color-foreground--65);
			}

			.account__image {
				width: 100%;
				aspect-ratio: 1 / 1;
				border-radius: 50%;
			}

			.account__details {
				grid-row: 1 / span 2;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}

			.account__title {
				font-size: 1.5rem;
				font-weight: 600;
				margin: 0;
			}

			.account--org .account__title {
				font-size: 1.2rem;
				font-weight: normal;
			}

			.account__access {
				position: relative;
				margin: 0;
				color: var(--color-foreground--65);
			}

			.account__signout {
				grid-row: 1 / span 2;
				display: flex;
				gap: 0.2rem;
				flex-direction: row;
				align-items: center;
				justify-content: center;
			}

			.account__badge {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 2.4rem;
				height: 2.4rem;
				line-height: 2.4rem;
				font-size: 1rem;
				font-weight: 600;
				color: var(--color-foreground--65);
				background-color: var(--vscode-toolbar-hoverBackground);
				border-radius: 50%;
			}

			.repo-access {
				font-size: 1.1em;
				margin-right: 0.2rem;
			}
			.repo-access:not(.is-pro) {
				filter: grayscale(1) brightness(0.7);
			}

			.special {
				margin-top: 0.8rem;
				text-align: center;
			}

			.special-dim {
				font-size: smaller;
				opacity: 0.6;
			}
		`],tr([wt()],or.prototype,"image",2),tr([wt({type:Number})],or.prototype,"organizationsCount",2),tr([wt({attribute:!1})],or.prototype,"subscription",2),or=tr([mt("account-content")],or);class AccountApp extends App{constructor(){super("AccountApp")}onInitialize(){this.state=this.getState()??this.state,this.updateState()}onBind(){const e=super.onBind?.()??[];return e.push(U.on("[data-action]","click",((e,t)=>this.onDataActionClicked(e,t)))),e}onMessageReceived(e){if(!0===a.is(e))this.state.subscription=e.params.subscription,this.state.avatar=e.params.avatar,this.state.organizationsCount=e.params.organizationsCount,this.state.timestamp=Date.now(),this.setState(this.state),this.updateState();else super.onMessageReceived?.(e)}onDataActionClicked(e,t){const o=t.dataset.action;this.onActionClickedCore(o)}onActionClickedCore(e){e?.startsWith("command:")&&this.sendCommand(r,{command:e.slice(8)})}updateState(){const{subscription:e,avatar:t,organizationsCount:o}=this.state,i=document.getElementById("account-content");i.image=t??"",i.subscription=e,i.organizationsCount=o??0}}new AccountApp;var ir=t.r;export{ir as AccountApp};