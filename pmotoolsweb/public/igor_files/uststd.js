(function(){var h=function(){function g(d,b,a){function l(e){function l(b){if(c(b)){a:{b=d+"/"+b;var a;b:{a=b.split("/");for(var m=[],n=0;n<a.length;n++){var g=a[n];if("."===g)0===m.length&&m.push(g);else if(".."===g)if(2<=m.length)m.pop();else{a=null;break b}else m.push(g)}a=m.join("/")}if("string"===typeof a&&""!==a){b=f[a];b="undefined"!==typeof b?b.get(e):null;if(null!==b)break a;throw Error("Brak definicji modu\u0142u: "+a);}throw Error("Problem ze znormalizowaniem \u015bcie\u017cki: "+b);}return b}if(b in
e)b=e[b];else throw Error("Brak definicji zewn\u0119trznego modu\u0142u : "+b);return b}for(var n=[],g=0;g<b.length;g++)n.push(l(b[g]));return a.apply(null,n)}var n=null;e(b);return{get:function(b){null===n&&(n=l(b));return n}}}function e(a){for(var b=0;b<a.length;b++){var f=a[b];c(f)||d.addName(f)}}function c(a){if("string"===typeof a)return 2<=a.length&&"./"===a.substr(0,2)?!0:3<=a.length&&"../"===a.substr(0,3)?!0:!1;throw Error("Spodziewano si\u0119 stringa");}var a=!1,d=function(){var a=[],b=
{};return{addName:function(f){if("string"===typeof f&&""!==f)"string"!==typeof b[f]&&(b[f]=f,a.push(f));else throw Error("Nieprawid\u0142owy typ parametru");},getExtendsModulesObject:function(b){if(a.length===b.length){for(var f={},d=0;d<a.length;d++)f[a[d]]=b[d];return f}throw Error("nieprawid\u0142owe odga\u0142\u0119zienie programu");},getModulesName:function(){return a}}}(),f={};return{getDefine:function(d,b){return function(c,e){if(!1===a)f[d+"/"+b]=g(d,c,e);else throw Error("Nie mo\u017cna nic definiowa\u0107 po zako\u0144czeniu procesu konfiguracji");
}},install:function(c){if(!1===a)a=!0,define(d.getModulesName(),function(){var b=Array.prototype.slice.call(arguments,0),b=d.getExtendsModulesObject(b);if("undefined"!==typeof f[c])b=f[c].get(b);else throw Error("Brak zdefiniowanego modu\u0142u: "+c);return b});else throw Error("Nieprawid\u0142owy stan");}}}();(function(g){g([],function(){if("undefined"!==typeof window.JSONPLoader)return window.JSONPLoader;var e=function(){this.appId=null};e.callbacks={};e.callbacksCount=0;e.prototype.getJSON=function(c,
a,d){c+=c.indexOf("?")+1?"&":"?";var f=document.createElement("script"),k=function(b){d(b);window.setTimeout(function(){document.getElementsByTagName("head")[0].removeChild(f)},2E3)};this.success=k;e.callbacksCount++;e.callbacks["success"+e.callbacksCount]=k;a.callback="JSONPLoader.callbacks.success"+e.callbacksCount;this.appId&&(a["X-Onet-App"]=this.appId);c+=e.serialize(a);f.type="text/javascript";f.src=c;document.getElementsByTagName("head")[0].appendChild(f)};e.prototype.getJSONRPC=function(c,
a,d,f){c=(c.match("http://")?"":"http://")+c+"/";var e={};this.appId&&(e["X-Onet-App"]=this.appId);e["content-type"]="application/jsonp";e.body={jsonrpc:"2.0",id:a+ +new Date,method:a,params:d};this.getJSON(c,e,function(b){b.hasOwnProperty("error")?f(b.error,b.result):f(null,b.result)})};e.serialize=function(c){var a=[],d=function(f,b){b=b instanceof Function?b():b;a[a.length]=encodeURIComponent(f)+"="+encodeURIComponent(b)},f;for(f in c)e._buildParams(f,c[f],d);return a.join("&").replace(/%20/g,
"+")};e._buildParams=function(c,a,d){var f;f="function"===typeof Array.isArray?Array.isArray(a):"[object Array]"===Object.prototype.toString.call(a);if(f){f=0;for(var k=a.length;f<k;f++){var b=a[f];/\[\]$/.test(c)?d(c,b):e._buildParams(c+"["+("object"===typeof b?f:"")+"]",b,d)}}else if("object"===typeof a)for(k in a)e._buildParams(c+"["+k+"]",a[k],d);else d(c,a)};return window.JSONPLoader=e})})(h.getDefine("./uststd","JSONPLoader"));(function(g){g([],function(){function e(a){function d(b){a!==b&&
(f(b),a=b)}function f(b){var a=c(e);setTimeout(function(){for(var f=0;f<a.length;f++)a[f](b)},0)}var e=[],b={change:function(a){e.push(a);return b},set:d,get:function(){return a},replaceValue:function(b){d(b(a))}};return b}function c(a){for(var d=[],f=0;f<a.length;f++)d[f]=a[f];return d}return{create:e,createTimeout:function(a,d){function f(){c!==b&&(clearTimeout(l),c=b,m.set(b))}var c=a.get(),b=c,m=e(c),l=null;a.change(function(a){b=a;clearTimeout(l);l=setTimeout(f,d)});return{chan:m,flush:function(){setTimeout(f,
0)}}},combine:function(a,d){function f(b,a){b.change(function(b){k[a]=b;m.set(d(c(k)))})}for(var k=function(){for(var b=[],f=0;f<a.length;f++)b.push(a[f].get());return b}(),b=d(c(k)),m=e(b),b=0;b<a.length;b++)f(a[b],b);return m}}})})(h.getDefine("./uststd","channels"));(function(g){g([],function(){return{getLabel:function(e){e=new Date(e);var c=new Date,a=Math.floor(e.getTime()/1E3),d=Math.floor(c.getTime()/1E3),f=e.toTimeString().substr(0,5),k="sty lut mar kwi maja cze lip sie wrz pa\u017a lis gru".split(" "),
b=[];e.getFullYear()===c.getFullYear()?a>d-3600&&a<d?(e=Math.floor((d-a)/60),1===e?c="minuta":(c=e%10,a=Math.floor(e/10)%10,c=1<c&&5>c&&1!==a?"minuty":"minut"),b=[e,c,"temu"]):b=e.getDate()===c.getDate()?["dzisiaj",f]:e.getDate()===c.getDate()-1?["wczoraj",f]:[e.getDate(),k[e.getMonth()]+",",f]:b=[e.getDate(),k[e.getMonth()],e.getFullYear().toString(),f];return b.join(" ")}}})})(h.getDefine("./uststd","dateApi"));(function(g){g([],function(){function e(c){var a=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
return"function"===typeof c.trim?c.trim():null===c?"":(c+"").replace(a,"")}return"undefined"!==typeof JSON&&"function"===typeof JSON.parse?function(){return JSON.parse.apply(JSON,arguments)}:function(c){var a=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g,d,f=null;return(c=e(c+""))&&!e(c.replace(a,function(a,b,c,e){d&&b&&(f=0);if(0===f)return a;d=c||b;f+=!e-!c;return""}))?Function("return "+c)():null}})})(h.getDefine("./uststd/environment",
"JSONparse"));(function(g){g([],function(){function e(a){k.lastIndex=0;return k.test(a)?'"'+a.replace(k,function(a){var f=b[a];return"string"===typeof f?f:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function c(b,l){var k,g,q,t,s=a,p,h=l[b];h&&"object"===typeof h&&"function"===typeof h.toJSON&&(h=h.toJSON(b));"function"===typeof f&&(h=f.call(l,b,h));switch(typeof h){case "string":return e(h);case "number":return isFinite(h)?String(h):"null";case "boolean":case "null":return String(h);
case "object":if(!h)return"null";a+=d;p=[];if("[object Array]"===Object.prototype.toString.apply(h)){t=h.length;for(k=0;k<t;k+=1)p[k]=c(k,h)||"null";q=0===p.length?"[]":a?"[\n"+a+p.join(",\n"+a)+"\n"+s+"]":"["+p.join(",")+"]";a=s;return q}if(f&&"object"===typeof f)for(t=f.length,k=0;k<t;k+=1)"string"===typeof f[k]&&(g=f[k],(q=c(g,h))&&p.push(e(g)+(a?": ":":")+q));else for(g in h)Object.prototype.hasOwnProperty.call(h,g)&&(q=c(g,h))&&p.push(e(g)+(a?": ":":")+q);q=0===p.length?"{}":a?"{\n"+a+p.join(",\n"+
a)+"\n"+s+"}":"{"+p.join(",")+"}";a=s;return q}}if("undefined"!==typeof JSON&&"function"===typeof JSON.stringify)return function(){return JSON.stringify.apply(JSON,arguments)};var a,d,f,k=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,b={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};return function(b,e,k){var g;d=a="";if("number"===typeof k)for(g=0;g<k;g+=1)d+=" ";else"string"===typeof k&&(d=
k);if((f=e)&&"function"!==typeof e&&("object"!==typeof e||"number"!==typeof e.length))throw Error("JSON.stringify");return c("",{"":b})}})})(h.getDefine("./uststd/environment","JSONstringify"));(function(g){g([],function(){var e,c,a,d,f;if("undefined"===typeof e){for(var k=[{stringName:"Edge",detectBy:"userAgent",regexBrowser:/Edge\//,versionDetectBy:"userAgent",regexVersion:/Edge\/([\d\.]+)/,regexVersionMin:/Edge\/[\d]+\.([\d\.]+)/},{stringName:"Microsoft Internet Explorer",detectBy:"userAgent",
regexBrowser:/Trident\//,versionDetectBy:"appVersion",regexVersion:/(?:MSIE |rv\:)([\d\.]+)/,regexVersionMin:/(?:MSIE |rv\:)[\d]+\.([\d\.]+)/},{stringName:"Firefox",detectBy:"userAgent",regexBrowser:/Firefox\//,versionDetectBy:"userAgent",regexVersion:/Firefox\/([\d\.]+)/,regexVersionMin:/Firefox\/[\d]+\.([\d\.]+)/},{stringName:"Opera",detectBy:"userAgent",regexBrowser:/(Opera|OPR)\//,versionDetectBy:"userAgent",regexVersion:/(?:Opera|OPR)\/([\d\.]+)/,regexVersionMin:/(?:Opera|OPR)\/[\d]+\.([\d\.]+)/},
{stringName:"Chrome",detectBy:"userAgent",regexBrowser:/Chrome\//,versionDetectBy:"userAgent",regexVersion:/Chrome\/([\d\.]+)/,regexVersionMin:/Chrome\/[\d]+\.([\d\.]+)/},{stringName:"Safari",detectBy:"userAgent",regexBrowser:/Safari\//,versionDetectBy:"userAgent",regexVersion:/Version\/([\d\.]+)/,regexVersionMin:/Version\/[\d]+\.([\d\.]+)/}],b=0;b<k.length;b++){f=k[b];if(f.regexBrowser.test(navigator[f.detectBy])){e=f.stringName;k=navigator[f.versionDetectBy];(b=k.match(f.regexVersion))&&1<b.length&&
(d=b[1],c=parseInt(d,10));(f=k.match(f.regexVersionMin))&&1<f.length&&(a=parseFloat(f[1]));break}"undefined"===typeof e&&(e="Unknown",c=a=d=0)}f=document.createElement("div");f.setAttribute("ongesturestart","return;");f="function"===typeof f.ongesturestart}return{browser:e,version:{major:c,minor:a,full:d},touchDevice:f,browsers:{MSIE:"Microsoft Internet Explorer",EDGE:"Edge",FF:"Firefox",Chrome:"Chrome",Safari:"Safari",Opera:"Opera",Unknown:"Unknown"}}})})(h.getDefine("./uststd/environment","browser"));
(function(g){g([],function(){function e(){var a=window.location.host+"";if(c(a,"biznes.pl"))return"384017398284801";if(c(a,"ekstraklasa.tv"))return"547498602040311";if(c(a,"zumi.pl"))return"339664449461846";if(c(a,"sztukaflirtu.pl"))return"423063524509893";if(c(a,"vumag.pl"))return"338852806218988";if(c(a,"topgear.com.pl"))return"1595251924020595";if(c(a,"plejada.pl"))return"878959768808154";if(c(a,"noizz.pl"))return"996316943767640";var d=document.querySelectorAll('meta[property="fb:app_id"]');return 0<
d.length?d[0].getAttribute("content"):c(a,"onet.pl")?"226508470737473":null}function c(a,d){return a.length<d.length?!1:a.substr(-d.length)===d?!0:!1}var a=!1,d=null;return{getId:function(){!1===a&&(a=!0,d=e());return d}}})})(h.getDefine("./uststd/environment","facebook_id"));(function(g){g([],function(){var e=!1,c=null;return function(){if(!1===e){e=!0;var a;if("undefined"!==typeof window.matchMedia||"undefined"!==typeof window.msMatchMedia)a=!0;else b:{var d=document.createElement("div"),f=document.createElement("style"),
k=document.createTextNode("@media all { div#uststd_test_id_4389342834829894334 { width : 1000px; } }");try{if(d.setAttribute("id","uststd_test_id_4389342834829894334"),f.setAttribute("type","text/css"),f.appendChild(k),document.head.appendChild(f),document.body.appendChild(d),1E3===d.offsetWidth){a=!0;break b}}catch(b){}a=!1}c=a}return c}})})(h.getDefine("./uststd/environment","isMediaQuery"));(function(g){g([],function(){var e=[];return{error:function(c){window.console&&"function"===typeof window.console.error&&
window.console.error(c);e.push({time:new Date,type:"error",mess:c})},add:function(c){e.push({time:new Date,type:"log",mess:c})},dump:function(){function c(d){"log"===d.type?window.console&&"function"===typeof window.console.log&&window.console.log(a(d)+" -> "+d.mess):"error"===d.type?window.console&&"function"===typeof window.console.error&&window.console.error(a(d)+" -> "+d.mess):"todo"===d.type&&window.console&&"function"===typeof window.console.warn&&window.console.warn(a(d)+" -> "+d.mess)}function a(a){var b=
a.time.getHours(),f=a.time.getMinutes(),c=a.time.getSeconds();a=a.time.getMilliseconds();b=d(b,2);f=d(f,2);c=d(c,2);a=d(a,3);return b+":"+f+":"+c+" "+a+"ms"}function d(a,b){for(var d=a+"";d.length<b;)d="0"+d;return d}window.console&&"function"===typeof window.console.group&&window.console.group();if(0===e.length)window.console&&"function"===typeof window.console.info&&window.console.info("Brak log\u00f3w");else for(var f=0;f<e.length;f++)c(e[f]);window.console&&"function"===typeof window.console.groupEnd&&
window.console.groupEnd()},logException:function(c){setTimeout(function(){throw c;},0)},logTodo:function(c){window.console&&"function"===typeof window.console.warn&&window.console.warn("%c%s","color: white; background-color: red;",c);e.push({time:new Date,type:"todo",mess:c})}}})})(h.getDefine("./uststd/environment","logs"));(function(g){g([],function(){return function(e){function c(d,f){var c=d.split("?");return 1===c.length?a(c[0],"",f):2===c.length?a(c[0],c[1],f):null}function a(a,f,c){var b={};
f=f.split("&");for(var e=0;e<f.length;e++){var l=f[e].split("=");if(2===l.length){var g=l[1],l=decodeURIComponent(l[0]),g=decodeURIComponent(g);b[l]=g}}return{baseUrl:a,queryParams:b,hash:c}}return function(a){a=a.split("#");return 1===a.length?c(a[0],""):2===a.length?c(a[0],a[1]):null}(e)}})})(h.getDefine("./uststd/environment","parseurl"));(function(g){g([],function(){return{picoajax:function(e){e.method=e.method?e.method.toUpperCase():"GET";var c=window.ActiveXObject?new window.ActiveXObject("Microsoft.XMLHTTP"):
new window.XMLHttpRequest;this.stateChange=function(){4===c.readyState&&(200<=c.status&&300>c.status?e.success&&e.success(c.responseText,c):e.failure&&e.failure(c))};c.onreadystatechange=this.stateChange;if("object"===typeof e.data){var a="",d;for(d in e.data)a+=(0<a.length?"&":"")+encodeURIComponent(d)+"="+encodeURIComponent(e.data[d]);e.data=a}"POST"!==e.method&&e.data&&(e.url=e.url+"?"+e.data);c.open(e.method,e.url,!0);"POST"===e.method?(c.setRequestHeader("Content-type","application/x-www-form-urlencoded"),
c.send(e.data?e.data:null)):c.send()}}})})(h.getDefine("./uststd/environment","picoajax"));(function(g){g([],function(){return function(e,c){var a=[];e(window,"message",function(d){c(a,function(a){d.source===a.iframeWindow&&a.callback(d)})});return function(d,f){a.push({iframeWindow:d.contentWindow||d,callback:f})}}})})(h.getDefine("./uststd/environment","windowMessage"));(function(g){g([],function(){var e=null;return{remove:function(){Array.prototype.$family&&(e=Array.prototype.$family,delete Array.prototype.$family)},
restore:function(){e&&(Array.prototype.$family=e)}}})})(h.getDefine("./uststd/libloader","arrayproto"));(function(g){g([],function(){return{create:function(){function e(){if(null===d)for(;0<a.length;)c(a.shift())}function c(a){setTimeout(function(){a(window.onetAds)},0)}var a=[],d=setInterval(function(){"undefined"!==typeof window.onetAds&&null!==d&&(clearInterval(d),d=null,setTimeout(e,0))},100);return function(d){a.push(d);setTimeout(e,0)}}}})})(h.getDefine("./uststd/libloader","loaderOnetAds"));
(function(g){g(["./environment/picoajax"],function(e){return function(c,a){return{renderPreset:function(a,c,k,b){c=c||{};"undefined"===typeof b&&(b=k,k=!1);if(a){var g={};k?g.json=JSON.stringify(c):g=c;g.____presetName=a;e.picoajax({method:"GET",url:"/_cdf/api",data:g,success:function(a,d){b(null,d,a)},failure:function(a){b(a.status,a)}})}}}}(window)})})(h.getDefine("./uststd","Cdf"));(function(g){g(["./logs"],function(e){function c(a){for(var c=[],e=0;e<a.length;e++)c.push(a[e]);return c}var a=!1;
return function(d,f){function g(a,c){1>c.length&&e.error("query nie powinno by\u0107 puste");return{getResult:function(){if(c[0].match(a)){if(1===c.length)return[a];for(var d=[],e=1;e<c.length;e++)d.push(c[e]);return b(a,d)}return b(a,c)}}}function b(a,b){for(var c=a.childNodes,d=[],e,f=0;f<c.length;f++)if(e=c[f],1===e.nodeType){e=g(e,b).getResult();for(var m=0;m<e.length;m++)d.push(e[m])}return d}if(0<=f.indexOf("#"))return e.error("uststd.environment.elementFindAll: niedozwolony znak # w query: "+
f),null;d===document&&(d=document.documentElement);if("function"===typeof d.querySelectorAll)return c(d.querySelectorAll(f));!1===a&&(a=!0,e.add("elementFindAll: Emuluj\u0119 dla starszych przegl\u0105darek"));var m=function(a){function b(a){function c(){var b=/^\.([a-z][a-z0-9_]*)(.*)$/gi.exec(a);null!==b&&(h.push(g(b[1])),a=b[2])}function d(){return""===a?!1:function(){var b=/^\[([^\[\]]+)="([^\[\]\s]+)"\](.*)$/gi.exec(a);if(b)return h.push(k(b[1],b[2])),a=b[3],!0}()||function(){var b=/^\[([^\[\]]+)\](.*)$/gi.exec(a);
if(b)return h.push(m(b[1])),a=b[2],!0}()?!0:!1}function f(){return{match:function(){return!0}}}function g(a){return{match:function(b){return RegExp("(\\s|^)"+a+"(\\s|$)").test(b.className)}}}function l(a){return{match:function(b){return b.tagName.toLowerCase()===a}}}function k(a,b){return{match:function(c){return c.getAttribute(a)===b}}}function m(a){return{match:function(b){return"string"===typeof b.getAttribute(a)}}}var h=[];(function(){0<a.length&&"*"===a.substr(0,1)&&(h.push(f()),a=a.substr(1));
var b=/^([a-z][a-z0-9]*)(.*)$/gi.exec(a);null!==b&&(h.push(l(b[1].toLowerCase())),a=b[2])})();for(var n=0;3>n;n++)c();for(n=0;100>n&&d();n++);""!==a&&e.error("Problem z parsowaniem wyra\u017cenia : "+a);return{match:function(a){for(var b=0;b<h.length;b++)if(!1===h[b].match(a))return!1;return!0}}}a=a.split(" ");for(var c=[],d=0;d<a.length;d++)c.push(b(a[d]));return c}(f);return null===m?[]:g(d,m).getResult()}})})(h.getDefine("./uststd/environment","elementFindAll"));(function(g){g(["./environment/JSONparse"],
function(e){function c(){var a=document.querySelector("meta[name='onet-appconfig']");if(a)if(a=a.getAttribute("data-config"))try{return a=e(a)}catch(c){return setTimeout(function(){throw Error("Onet-appconfig parse problem.");},0),{}}else return{};else return{}}var a=null;return{getAll:function(){null===a&&(a=c());return a},get:function(d){if(d&&(null===a&&(a=c()),a.hasOwnProperty(d)))return a[d]}}})})(h.getDefine("./uststd","siteConfig"));(function(g){g("./environment/JSONparse ./environment/JSONstringify ./environment/elementFindAll ./environment/logs ./environment/browser ./environment/picoajax ./environment/windowMessage ./environment/parseurl ./environment/facebook_id ./environment/isMediaQuery".split(" "),
function(e,c,a,d,f,g,b,m,l,h){function r(a,b,c){if(a.addEventListener)a.addEventListener(b,c,!1);else if(a.attachEvent)a.attachEvent("on"+b,c);else throw Error("nieprawidlowe odgalezienie");}function q(a,b){return"undefined"!==typeof a.classList?a.classList.contains(b):RegExp("(\\s|^)"+b+"(\\s|$)").test(a.className)}function t(a,b){"undefined"!==typeof a.classList?a.classList.remove(b):q(a,b)&&(a.className=a.className.replace(RegExp("(\\s|^)"+b+"(\\s|$)")," ").replace(/^\s+|\s+$/g,""))}function s(a,
b){if(0<=b.indexOf(" "))for(var c=b.split(" "),d=0;d<c.length;d++)s(a,c[d]);else"undefined"!==typeof a.classList?a.classList.add(b):q(a,b)||(a.className+=(a.className?" ":"")+b)}function p(a,b){for(var c=[],d=0;d<a.length;d++)c.push(a[d]);for(d=0;d<c.length;d++)b(c[d],d)}function y(a){a.parentNode.removeChild(a)}function z(a){var b=document.cookie,c=b.indexOf(" "+a+"=");-1===c&&(c=b.indexOf(a+"="));-1===c?b=null:(c=b.indexOf("=",c)+1,a=b.indexOf(";",c),-1===a&&(a=b.length),b=decodeURIComponent(b.substring(c,
a)));return b}function u(a){return 10>a?"0"+a:a}function x(a){return Array.isArray?Array.isArray(a):"[object Array]"===Object.prototype.toString.call(a)}function C(a,b,c,d){if(0>=c)"function"===typeof d&&d();else{var e=(b-a.scrollTop)/c*10;setTimeout(function(){a.scrollTop+=e;C(a,b,c-10,d)},10)}}function B(){return{width:window.innerWidth||document.documentElement&&document.documentElement.clientWidth||document.body&&document.body.clientWidth||0,height:window.innerHeight||document.documentElement&&
document.documentElement.clientHeight||document.body&&document.body.clientHeight||0}}function D(a,b,c,d,e){function f(){E(function(){var d=(new Date).getTime();d>=k?(a[b]=c,e()):(a[b]=g+(c-g)*(d-l)/(k-l),setTimeout(f,20))})}var g=a[b],l=(new Date).getTime(),k=l+d;setTimeout(f,20)}function A(a,b){function c(f){a[f](function(){if(!1===d[f])a:if(d[f]=!0,!1===e){for(var a=0;a<d.length;a++)if(!1===d[a])break a;e=!0;b()}})}var d=[],e=!1;if(0===a.length)b();else{for(var f=0;f<a.length;f++)d[f]=!1;for(f=
0;f<a.length;f++)c(f)}}function v(a,b){var c=[],d;for(d in b)c.push(encodeURIComponent(d)+"="+encodeURIComponent(b[d]));return 0<c.length?0<=a.indexOf("?")?a+"&"+c.join("&"):a+"?"+c.join("&"):a}function w(a,b,c,d){var e=[["width",c],["height",d],["scrollbars","1"],["scrollbars","yes"],["toolbar","0"],["status","0"]],f=void 0!==window.screenLeft?window.screenLeft:window.screen.left,g=void 0!==window.screenTop?window.screenTop:window.screen.top,l=window.outerWidth?window.outerWidth:document.documentElement&&
document.documentElement.clientWidth?document.documentElement.clientWidth:null,k=window.outerHeight?window.outerHeight:document.documentElement&&document.documentElement.clientHeight?document.documentElement.clientHeight:null;null!==l&&e.push(["left",Math.floor((l-c)/2)+f]);null!==k&&e.push(["top",Math.floor((k-d)/2)+g]);window.open(a,b,function(a){for(var b=[],c=0;c<a.length;c++)b.push(a[c].join("="));return b.join(", ")}(e))}function F(a,b){var c=new Image;r(c,"load",b);c.src=a}var E=function(){if("function"===
typeof window.requestAnimationFrame)return window.requestAnimationFrame;for(var a=["ms","moz","webkit","o"],b=null,c=0;c<a.length;++c)if(b=window[a[c]+"RequestAnimationFrame"],"function"===typeof b)return b;return function(a){a()}}(),G=function(){function a(b,c){var d=b.indexOf(c);0<=d&&b.splice(d,1);return b}function b(a,c){for(var d=[],e=0;e<a.length;e++)a[e]!==c&&d.push(a[e]);return d}return"function"===typeof Array.prototype.indexOf&&"function"===typeof Array.prototype.splice?a:b}();b=b(r,p);
return{createFilterTimeEvent:function(a,b){var c=null;return function(){null!==c&&clearTimeout(c);c=setTimeout(function(){null!==c&&(c=null,b())},a)}},addEvent:r,removeEvent:function(a,b,c){if(a.removeEventListener)a.removeEventListener(b,c,!1);else if(a.detachEvent)a.detachEvent("on"+b,c);else throw Error("nieprawidlowe odgalezienie");},trigger:function(a,b){var c;document.createEvent?(c=document.createEvent("HTMLEvents"),c.initEvent(b,!0,!0)):(c=document.createEventObject(),c.eventType=b);c.eventName=
b;document.createEvent?a.dispatchEvent(c):a.fireEvent("on"+c.eventType,c)},picoajax:g.picoajax,logError:d.error,logAdd:d.add,logDump:d.dump,logException:d.logException,logTodo:d.logTodo,DebugMode:function(){},hasClass:q,removeClass:t,addClass:s,toggleClass:function(a,b){q(a,b)?t(a,b):s(a,b)},forEachSelector:function(b,c,d){p(a(b,c),d)},forEach:p,forEachKey:function(a,b){var c={},d;for(d in a)c[d]=a[d];for(d in c)b(c[d],d)},loadCss:function(a){var b=document.createElement("link");b.type="text/css";
b.rel="stylesheet";b.href=a;document.getElementsByTagName("head")[0].appendChild(b)},createChild:function(a,b){var c=document.createElement(b);a.appendChild(c);return c},createChildAfter:function(a,b){var c=document.createElement(b);a.parentNode.insertBefore(c,a.nextSibling);return c},removeChild:y,replaceChild:function(a,b){a.parentNode.insertBefore(b,a);y(a)},createText:function(a,b){var c=document.createTextNode(b);a.appendChild(c);return c},addChildAfter:function(a,b){a.parentNode.insertBefore(b,
a)},addAsFirstChild:function(a,b){var c=null;0<a.childNodes.length&&(c=a.childNodes.item(0));a.insertBefore(b,c)},getText:function(a){if("undefined"!==typeof a.textContent)return a.textContent;if("undefined"!==typeof a.innerText)return a.innerText},setText:function(a,b){"undefined"!==typeof a.textContent?a.textContent=b:"undefined"!==typeof a.innerText&&(a.innerText=b)},isStaticSite:function(){return"undefined"!==typeof window.offline&&!0===window.offline},getCookie:z,setCookie:function(a,b,c){var d=
".onet.pl";if("string"!==typeof d||""===d)d=".onet.pl";-1!==document.domain.toLowerCase().indexOf(".dev.onet")&&(d=".dev.onet");var e=new Date;e.setTime(+e+864E5*c);document.cookie=[encodeURIComponent(a)+"="+encodeURIComponent(b),"expires="+e.toUTCString(),"path=/","domain="+d].join(";")},elementFindAll:a,elementFind:function(b,c){var d=a(b,c);return d&&1===d.length?d[0]:null},elementFindChild:function(a){var b=[];a=a.childNodes;for(var c=0;c<a.length;c++)1===a[c].nodeType&&b.push(a[c]);return b},
preventDefault:function(a){"function"===typeof a.preventDefault&&a.preventDefault();"function"===typeof a.stopPropagation?a.stopPropagation():a.cancelBubble=!0},createPromis:function(a){function b(){"empty"===c?(c="init",a(function(a){"init"===c&&(c="set",d=a,setTimeout(b,0))})):"init"!==c&&"set"===c&&0<e.length&&(e.shift()(d),setTimeout(b,0))}var c="empty",d=null,e=[];return{get:function(a){e.push(a);setTimeout(b,0)}}},getFormData:function(a,b,c){if(a.elements){for(var d={},e=0;e<a.elements.length;e++){var f=
a.elements[e],g=f.value,l=f.name;if(-1!==l.indexOf("[")){for(var l=l.split("["),k=d,m=0;m<l.length;m++){var h=l[m];if("]"===h)if(b){if(x(k)||"undefined"===typeof k)k={};if("select-one"===f.type.toLowerCase())for(h=0;h<f.options.length;h++){var n=f.options[h],r=n.getAttribute(c);k[r?r:n.value]=!f.disabled&&n.selected&&"disabled"!==f.getAttribute("data-disabled")}else h=f.getAttribute(c),k[h?h:f.value]=!f.disabled&&f.checked}else x(k)||(k=[]);else 2<h.length&&"]"===h[h.length-1]?(h=h.substr(0,h.length-
1),"undefined"===typeof k[h]&&(k[h]=b?{}:[])):"undefined"===typeof k[h]&&(k[h]={}),k=k[h]}b||f.disabled||"checkbox"===f.type.toLowerCase()&&!f.checked||!x(k)||k.push(g)}else d[l]=g}return d}},trim:function(a){var b=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;return"function"===typeof a.trim?a.trim():null===a?"":(a+"").replace(b,"")},stringFormat:function(a){var b=Array.prototype.slice.call(arguments,1);return a.replace(/{(\d+)}/g,function(a,c){return"undefined"!==typeof b[c]?b[c]:a})},styleValue:function(a,
b){if(a){var c;"getComputedStyle"in window?c=window.getComputedStyle(a,null):"currentStyle"in a&&(c=a.currentStyle);if(c)if(b&&b.length){if(-1!==b.indexOf("-")&&(b=b.replace(/\-([a-z]?)/g,function(a,b){return b.toUpperCase()})),b in c)return c[b]}else return c}},getBrowserInfo:function(){var a=navigator.appName,b=navigator.userAgent,c,d=b.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);d&&null!=(c=b.match(/version\/([\.\d]+)/i))&&(d[2]=c[1]);return d=d?[d[1].toLowerCase(),d[2]]:
[a,navigator.appVersion,"-?"]},JSONparse:e,JSONstringify:c,clone:function(a){return e(c(a))},show:function(a){a&&a.style&&(a.style.display="block")},hide:function(a){a&&a.style&&(a.style.display="none")},dateToISOString:function(a){return Date.prototype.toISOString?a.toISOString():a.getUTCFullYear()+"-"+u(a.getUTCMonth()+1)+"-"+u(a.getUTCDate())+"T"+u(a.getUTCHours())+":"+u(a.getUTCMinutes())+":"+u(a.getUTCSeconds())+"."+(a.getUTCMilliseconds()/1E3).toFixed(3).slice(2,5)+"Z"},elementEmpty:function(a){for(;a.firstChild;)a.removeChild(a.firstChild)},
isArray:x,objectKeys:function(a){if(Object.keys)return Object.keys(a);if(a!==Object(a))throw new TypeError("Object.keys called on a non-object");var b=[],c;for(c in a)Object.prototype.hasOwnProperty.call(a,c)&&b.push(c);return b},scrollToTop:C,isMobile:function(){var a=navigator.userAgent||navigator.vendor||window.opera,b=/android/i.test(a)||/(bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||
/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,
4));return function(){return b}}(),remIsSupported:function(){try{var a;a=document.createElement("p");a.innerHTML="Onet.pl";a.style.cssText="font-size: 1.5rem";return 0<a.style.fontSize.indexOf("rem")}catch(b){return!1}},browser:f,getWindowSize:function(){var a=!0,b=null;r(window,"resize",function(){a=!0});return function(){d.logTodo("Stop using the function uststd.environment.getWindowSize()");!0===a&&(a=!1,b=B());return{width:b.width,height:b.height}}}(),windowSize:B,requestAnimationFrame:E,scrollToElement:function(a,
b){function c(){var e=d.scrollTop,f=a.getBoundingClientRect().top;return e-((b.marginTop&&0<b.marginTop?b.marginTop:0)-f)}var d=document.documentElement.style&&"function"===typeof document.documentElement.style.hasOwnProperty&&document.documentElement.style.hasOwnProperty("WebkitAppearance")?document.body:document.documentElement;b.timeAnimation?D(d,"scrollTop",c(),b.timeAnimation,function(){d.scrollTop=c();setTimeout(function(){d.scrollTop=c();"function"===typeof b.callbackEnd&&b.callbackEnd()},
500)}):(d.scrollTop=c(),"function"===typeof b.callbackEnd&&b.callbackEnd())},animateProperty:D,runAsync:A,removeFromArray:G,makeUrl:v,popup:w,share_facebook:function(a){a=v("https://www.facebook.com/sharer/sharer.php",{u:a});w(a,"share_window",600,600)},share_facebook_feed:function(a,b,c){a=v("https://www.facebook.com/dialog/feed",{app_id:l.getId(),link:a,name:b,description:c,redirect_uri:a});w(a,"share_window",600,600)},share_twitter:function(a,b,c){a={url:a,text:b,original_referer:a};"string"===
typeof c&&""!==c&&(a.via=c);c=v("https://twitter.com/intent/tweet",a);w(c,"share_window",550,480)},share_gplus:function(a){a=v("https://plus.google.com/share",{url:a});w(a,"share_window",550,480)},isMediaQuery:h,postMessageFromIframe:b,parseUrl:m,ontouch:function(a,b){function c(){g=!1;b("none","end",h)}function d(a){return a.changedTouches&&0<a.changedTouches.length?{pageX:a.changedTouches[0].pageX,pageY:a.changedTouches[0].pageY}:{pageX:a.pageX,pageY:a.pageY}}function e(a){g=!0;a=d(a);k="none";
m=a.pageX;n=a.pageY}function f(a){if(!1!==g){var c=d(a);p=c.pageX-m;q=c.pageY-n;Math.abs(p)>Math.abs(q)?(h=p,k=0>p?"left":"right"):(h=q,k=0>q?"up":"down");!1===b(k,"move",h)&&a.preventDefault()}}function l(a){g=!1;!1===b(Math.abs(p)>=s&&Math.abs(q)<=t?k:Math.abs(q)>=s&&Math.abs(p)<=t?k:"none","end",h)&&a.preventDefault()}var g=!1,k="none",h=0,m,n,p,q,s=150,t=100;r(a,"touchstart",e);r(a,"mousedown",e);r(a,"touchmove",f);r(a,"mousemove",f);r(a,"touchend",l);r(a,"mouseup",l);r(a,"touchcancel",c);r(window,
"touchend",c);r(window,"mouseup",c)},getFbAppId:l.getId,getLang:function(){for(var b,c,d=["pl_PL","hu_HU","sr_SP","sk_SK"],e=a(document,'meta[property="og:locale"]'),f=0;f<e.length;f++){a:{c=e[f].getAttribute("content");for(b=0;b<d.length;b++)if(d[b]===c){b=!0;break a}b=!1;c=""}if(b)return c}return"pl_PL"},isCookieOnetUbiOld:function(a){var b=z("onet_ubi");if("string"===typeof b&&""!==b){var c=b.match(/^([0-9]{4})([0-9]{2})([0-9]{2})/);if(c)return(new Date-new Date(c[1],c[2]-1,c[3]))/864E5>a;d.error("Problem ze sparsowaniem ciasteczka onet_ubi: "+
b)}return!1},whenImageLoad:F,whenImageListLoad:function(a,b){function c(a){d.push(function(b){F(a,b)})}for(var d=[],e=0;e<a.length;e++)c(a[e]);A(d,b)}}})})(h.getDefine("./uststd","environment"));(function(g){g(["./environment"],function(e){function c(){var c=document.createDocumentFragment();return a(c)}function a(c){function f(a){return a.replace(/-([a-z0-9])/gi,function(a,b){return b?b.toUpperCase():""})}var g={create:function(b){b=document.createElement(b);c.appendChild(b);return a(b)},setHtml:function(a){c.innerHTML=
a;return g},addHtml:function(a){var e=document.createElement("div");e.innerHTML=a;for(a=e.childNodes;0<a.length;)c.appendChild(a.item(0));return g},createText:function(a){a=document.createTextNode(a);c.appendChild(a);return g},setAttr:function(a){for(var e in a)c.setAttribute(e,a[e]);return g},getDomElement:function(){return c},setCss:function(a){var e,l;for(l in a)e=a[l],"float"===l?(c.style.cssFloat=e,c.style.styleFloat=e):c.style[f(l)]=e;return g},addClass:function(a){e.addClass(c,a);return g},
removeClass:function(a){e.removeClass(c,a);return g},appendChild:function(a){c.appendChild(a);return g},addEvent:function(a,f){e.addEvent(c,a,f);return g}};return g}return{createFragment:c,fromDom:function(c){return a(c)},createDebugWindow:function(){var a=c().create("div").setCss({position:"fixed",left:"0",right:"0",bottom:"0",height:"100px","background-color":"white",border:"1px solid black",margin:"10px",padding:"10px","z-index":"1000000","overflow-y":"scroll"}).setAttr({id:"testdeb"});document.body.appendChild(a.getDomElement());
return function(c){a.create("div").createText("log : "+c);c=a.getDomElement();c.scrollTop=c.scrollHeight}}}})})(h.getDefine("./uststd","domBuilder"));(function(g){g(["./environment","./environment/logs"],function(e,c){return{create:function(){function a(){function a(c,d){for(var e=b,f=[],g=0;g<e.length;g++)f.push(e[g]);for(;0<f.length;)0<c.length?d(f.shift(),c):d(f.shift(),[])}var b=[];return{emit:function(b){a(b,f)},emitSync:function(b){a(b,g)},on:function(a){b.push(a)},remove:function(a){b=e.removeFromArray(b,
a)}}}function d(a){function b(e){!1===g?(g=!0,h=e,d()):c.error("events emit hard: zdarzenie by\u0142o ju\u017c wyemitowane: "+a)}function d(){if(!0===g)for(;0<k.length;)0<h.length?f(k.shift(),h):f(k.shift(),[])}var g=!1,h=null,k=[];return{emit:b,emitSync:b,on:function(a){k.push(a);d()},remove:function(a){k=e.removeFromArray(k,a)}}}function f(a,b){setTimeout(function(){a.apply(null,b)},0)}function g(a,b){a.apply(null,b)}var b={},h={addSoft:function(d){"undefined"===typeof b[d]?b[d]=a():c.error("events addSoft: zdarzenie jest ju\u017c zdefiniowane: "+
d);return h},addHard:function(a){"undefined"===typeof b[a]?b[a]=d(a):c.error("events addHard: zdarzenie jest ju\u017c zdefiniowane: "+a);return h},on:function(a,d){if("undefined"===typeof b[a])c.error("events on: brak zdarzenia: "+a);else b[a].on(d);return h},emit:function(a,d){"undefined"===typeof b[a]?c.error("events emit: brak zdarzenia: "+a):b[a].emit(d);return h},emitSync:function(a,d){"undefined"===typeof b[a]?c.error("events emitSync: brak zdarzenia: "+a):b[a].emitSync(d);return h},remove:function(a,
d){"undefined"===typeof b[a]?c.error("events remove: brak zdarzenia: "+a):b[a].remove(d);return h}};return h}}})})(h.getDefine("./uststd","events"));(function(g){g(["../events"],function(e){return{createLoadFunction:function(c,a){function d(){var b=a.url;"string"===typeof b&&""!==b&&require([a.url],f)}function f(){"undefined"!==typeof window[c]&&g(window[c])}function g(c){"function"===typeof a.beforeCallback?a.beforeCallback(c,function(){b.emit("ready",[c])}):b.emit("ready",[c])}var b=e.create();
b.addHard("ready");var h=!1;return function(c){b.on("ready",c);!1===h&&(h=!0,"function"===typeof a.beforeInit?a.beforeInit(d):d())}}}})})(h.getDefine("./uststd/libloader","loaderStandard"));(function(g){g(["./events","./environment"],function(e,c){function a(){f.emit("scroll",[])}function d(){f.emit("resize",[])}var f=e.create();f.addSoft("scroll");f.addSoft("resize");c.addEvent(window,"scroll",a);c.addEvent(window,"resize",d);return{on:f.on,triggerEventScroll:a,triggerEventResize:d}})})(h.getDefine("./uststd",
"window"));(function(g){g(["../environment","./arrayproto","./loaderStandard","./loaderOnetAds"],function(e,c,a,d){function f(a){var b=!1;return function(){!1===b&&(b=!0,a())}}var g=e.getLang(),b={getFB:a.createLoadFunction("FB",{url:"//connect.facebook.net/"+g+"/sdk.js",beforeCallback:function(a,b){var c=e.getFbAppId();null!==c?a.init({appId:c,status:!0,cookie:!0,xfbml:!0,oauth:!0,version:"v2.0"}):(window.console&&window.console.warn("%c%s","color: black; background-color: red;","embeddedapp -> init facebook -> missing setting appID"),
a.init({status:!0,cookie:!0,xfbml:!0,oauth:!0,version:"v2.0"}));b()}}),getAddthis:a.createLoadFunction("addthis",{url:"//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-509c045a0fbd81cb",beforeInit:function(a){b.getFB(function(){b.getTwttr(function(){c.remove();a()})})},beforeCallback:function(a,b){c.restore();var d=f(b);a.addEventListener("addthis.ready",d);setTimeout(d,1E4)}}),getOnetAds:d.create(),getHdwebplayer:a.createLoadFunction("hdwebplayer",{url:"http://www3.radiokrakow.pl/HDplayer/player/js/hdwebplayer.js"}),
getTwttr:a.createLoadFunction("twttr",{url:"//platform.twitter.com/widgets.js"}),getGoogleCorechart:a.createLoadFunction("google",{url:"//www.google.com/jsapi",beforeCallback:function(a,b){a.load("visualization","1",{packages:["corechart"],callback:b})}}),getPinterest:a.createLoadFunction("Pinterest",{url:"//assets.pinterest.com/js/pinit.js"}),getVintom:a.createLoadFunction("vintom",{url:"//www.vintom.com/api"})};return b})})(h.getDefine("./uststd/libloader","libloader"));(function(g){g("./uststd/environment ./uststd/Cdf ./uststd/JSONPLoader ./uststd/domBuilder ./uststd/events ./uststd/siteConfig ./uststd/window ./uststd/libloader/libloader ./uststd/dateApi ./uststd/channels".split(" "),
function(e,c,a,d,f,g,b,h,l,n){return{environment:e,Cdf:c,JSONPLoader:a,domBuilder:d,events:f,siteConfig:g,window:b,libloader:h,dateApi:l,channels:n}})})(h.getDefine(".","uststd"));h.install("./uststd")})();