!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.OptimalSelect=t():e.OptimalSelect=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var u=n[r]={exports:{},id:r,loaded:!1};return e[r].call(u.exports,u,u.exports,t),u.loaded=!0,u.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.optimize=t.select=void 0;var u=n(3),l=r(u),o=n(1),a=r(o);t.select=l.default,t.optimize=a.default,t.default=l.default},function(e,t){"use strict";function n(e,t){var n=e.replace(/> /g,">").split(" ");if(n.length<3)return e;for(var u=[n.pop()];n.length>1;){var l=n.pop(),o=n.join(" "),a=u.join(" "),i=o+" "+a,c=document.querySelectorAll(i);1!==c.length&&u.unshift(r(o,l,a,t))}return u.unshift(n[0]),n=u,n[0]=r("",n[0],n.slice(1).join(" "),t),n[n.length-1]=r(n.slice(0,-1).join(" "),n[n.length-1],"",t),n.join(" ").replace(/>/g,"> ").trim()}function r(e,t,n,r){if(e.length&&(e+=" "),n.length&&(n=" "+n),/>/.test(t)){var u=t.replace(/>/,""),l=""+e+u+n,o=document.querySelectorAll(l);1===o.length&&o[0]===r&&(t=u)}if(/\[*\]/.test(t)){var a=t.replace(/=.*$/,"]"),l=""+e+a+n,o=document.querySelectorAll(l);1===o.length&&o[0]===r&&(t=a)}if(/\:nth-child/.test(t)){var i=t.replace(/nth-child/g,"nth-of-type"),l=""+e+i+n,o=document.querySelectorAll(l);1===o.length&&o[0]===r&&(t=i)}if(/\.\S+\.\S+/.test(t))for(var c=t.trim().split(".").slice(1).map(function(e){return"."+e}).sort(function(e,t){return e.length-t.length});c.length;){var s=t.replace(c.shift(),""),l=""+e+s+n,o=document.querySelectorAll(l);1===o.length&&o[0]===r&&(t=s)}return t}Object.defineProperty(t,"__esModule",{value:!0}),t.default=n,e.exports=t.default},function(e,t){"use strict";function n(e,t){for(var n=[],p=e,g=n.length;!(p===document||d(p,n)||r(p,n)||o(p,n,t)||c(p,n));)u(p,n),n.length===g&&a(p,n,t),n.length===g&&s(p,n),n.length===g&&l(p,n),n.length===g&&i(p,n,t),n.length===g&&f(p,n),p=p.parentNode,g=n.length;return p===document&&n.unshift("*"),n.join(" ")}function r(e,t){return p(e,t,document)}function u(e,t){return p(e,t,e.parentNode)}function l(e,t){var n=e.className;return n?m(e,t,"."+n.replace(/ /g,".")):!1}function o(e,t,n){return g(e,t,document,n)}function a(e,t,n){return g(e,t,e.parentNode,n)}function i(e,t,n){var r=e.attributes;return Object.keys(r).some(function(u){var l=r[u],o=l.name;if(["id","class"].concat(n.excludes).indexOf(o)>-1)return!1;var a=l.value,i="["+o+'="'+a+'"]';return m(e,t,i,n)})}function c(e,t){return h(e,t,document)}function s(e,t){return h(e,t,e.parentNode)}function f(e,t){return m(e,t,e.tagName.toLowerCase())}function d(e,t){var n=e.id;return n?(t.unshift("#"+n),!0):!1}function p(e,t,n){var r=e.className;if(!r)return!1;var u=n.getElementsByClassName(r);return 1===u.length?(t.unshift("."+r.replace(/ /g,".")),!0):!1}function g(e,t,n,r){var u=e.attributes;return Object.keys(u).some(function(e){var l=u[e],o=l.name;if(["id","class"].concat(r.excludes).indexOf(o)>-1)return!1;var a=l.value,i="["+o+'="'+a+'"]',c=n.querySelectorAll(i);return 1===c.length?(t.unshift(i),!0):void 0})}function h(e,t,n){var r=e.tagName.toLowerCase(),u=n.getElementsByTagName(r);return 1===u.length?(t.unshift(r),!0):!1}function m(e,t,n){for(var r=e.parentNode,u=r.children,l=0,o=u.length;o>l;l++)if(u[l]===e)return t.unshift("> "+n+":nth-child("+(l+1)+")"),!0;return!1}Object.defineProperty(t,"__esModule",{value:!0}),t.default=n,e.exports=t.default},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function u(e){var t=arguments.length<=1||void 0===arguments[1]?f:arguments[1];return Array.isArray(e)?o(e,t):l(e,t)}function l(e,t){if(e instanceof Text)return u(e.parentNode);if(e instanceof HTMLElement==!1)throw new Error("Invalid input!");var n=(0,i.default)(e,t),r=(0,s.default)(n,e);return r}function o(e,t){for(var n=null,r=null,u=null,o=null,a=0,i=e.length;i>a;a++){var c=e[a];if(n){if(n!==c.parentNode)return console.log("Can't be efficiently mapped. It probably best to use multiple single selectors instead!")}else n=c.parentNode,r=c.className,o=c.tagName;if(c.className!==r){var s,f,d=[];c.className.length>r.length?(s=c.className,f=r):(s=r,f=c.className),f.split(" ").forEach(function(e){s.indexOf(e)>-1&&d.push(e)}),r=d.join(" ")}c.tagName!==o&&(o=null)}var p=l(n);return console.log(p,r,u,o),r?p+" > ."+r.replace(/ /g,"."):o?p+" > "+o.toLowerCase():p+" > *"}Object.defineProperty(t,"__esModule",{value:!0}),t.default=u,t.getSingleSelector=l,t.getMultiSelector=o;var a=n(2),i=r(a),c=n(1),s=r(c),f={excludes:["style","data-reactid","data-react-checksum"]}}])});
//# sourceMappingURL=optimal-select.js.map