/*!
 * Piwik - Web Analytics
 *
 * JavaScript tracking client
 *
 * @link http://piwik.org
 * @source https://github.com/piwik/piwik/blob/master/js/piwik.js
 * @license http://piwik.org/free-software/bsd/ Simplified BSD (also in js/LICENSE.txt)
 */
if(typeof JSON2!=="object"){JSON2={}}(function(){function d(f){return f<10?"0"+f:f}function l(n,m){var f=Object.prototype.toString.apply(n);if(f==="[object Date]"){return isFinite(n.valueOf())?n.getUTCFullYear()+"-"+d(n.getUTCMonth()+1)+"-"+d(n.getUTCDate())+"T"+d(n.getUTCHours())+":"+d(n.getUTCMinutes())+":"+d(n.getUTCSeconds())+"Z":null}if(f==="[object String]"||f==="[object Number]"||f==="[object Boolean]"){return n.valueOf()}if(f!=="[object Array]"&&typeof n.toJSON==="function"){return n.toJSON(m)}return n}var c=new RegExp("[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]","g"),e='\\\\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]',i=new RegExp("["+e,"g"),j,b,k={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},h;
function a(f){i.lastIndex=0;return i.test(f)?'"'+f.replace(i,function(m){var n=k[m];return typeof n==="string"?n:"\\u"+("0000"+m.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+f+'"'}function g(s,p){var n,m,t,f,q=j,o,r=p[s];if(r&&typeof r==="object"){r=l(r,s)}if(typeof h==="function"){r=h.call(p,s,r)}switch(typeof r){case"string":return a(r);case"number":return isFinite(r)?String(r):"null";case"boolean":case"null":return String(r);case"object":if(!r){return"null"}j+=b;o=[];if(Object.prototype.toString.apply(r)==="[object Array]"){f=r.length;for(n=0;n<f;n+=1){o[n]=g(n,r)||"null"}t=o.length===0?"[]":j?"[\n"+j+o.join(",\n"+j)+"\n"+q+"]":"["+o.join(",")+"]";j=q;return t}if(h&&typeof h==="object"){f=h.length;for(n=0;n<f;n+=1){if(typeof h[n]==="string"){m=h[n];t=g(m,r);if(t){o.push(a(m)+(j?": ":":")+t)}}}}else{for(m in r){if(Object.prototype.hasOwnProperty.call(r,m)){t=g(m,r);if(t){o.push(a(m)+(j?": ":":")+t)}}}}t=o.length===0?"{}":j?"{\n"+j+o.join(",\n"+j)+"\n"+q+"}":"{"+o.join(",")+"}";j=q;
return t}}if(typeof JSON2.stringify!=="function"){JSON2.stringify=function(o,m,n){var f;j="";b="";if(typeof n==="number"){for(f=0;f<n;f+=1){b+=" "}}else{if(typeof n==="string"){b=n}}h=m;if(m&&typeof m!=="function"&&(typeof m!=="object"||typeof m.length!=="number")){throw new Error("JSON2.stringify")}return g("",{"":o})}}if(typeof JSON2.parse!=="function"){JSON2.parse=function(o,f){var n;function m(s,r){var q,p,t=s[r];if(t&&typeof t==="object"){for(q in t){if(Object.prototype.hasOwnProperty.call(t,q)){p=m(t,q);if(p!==undefined){t[q]=p}else{delete t[q]}}}}return f.call(s,r,t)}o=String(o);c.lastIndex=0;if(c.test(o)){o=o.replace(c,function(p){return"\\u"+("0000"+p.charCodeAt(0).toString(16)).slice(-4)})}if((new RegExp("^[\\],:{}\\s]*$")).test(o.replace(new RegExp('\\\\(?:["\\\\/bfnrt]|u[0-9a-fA-F]{4})',"g"),"@").replace(new RegExp('"[^"\\\\\n\r]*"|true|false|null|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?',"g"),"]").replace(new RegExp("(?:^|:|,)(?:\\s*\\[)+","g"),""))){n=eval("("+o+")");
return typeof f==="function"?m({"":n},""):n}throw new SyntaxError("JSON2.parse")}}}());if(typeof _paq!=="object"){_paq=[]}if(typeof Piwik!=="object"){Piwik=(function(){var h,a={},q=document,d=navigator,D=screen,A=window,e=A.performance||A.mozPerformance||A.msPerformance||A.webkitPerformance,m=false,y=[],j=A.encodeURIComponent,z=A.decodeURIComponent,f=unescape,E,p,c;function s(P){var O=typeof P;return O!=="undefined"}function n(O){return typeof O==="function"}function C(O){return typeof O==="object"}function k(O){return typeof O==="string"||O instanceof String}function J(){var O,Q,P;for(O=0;O<arguments.length;O+=1){P=arguments[O];Q=P.shift();if(k(Q)){E[Q].apply(E,P)}else{Q.apply(E,P)}}}function M(R,Q,P,O){if(R.addEventListener){R.addEventListener(Q,P,O);return true}if(R.attachEvent){return R.attachEvent("on"+Q,P)}R["on"+Q]=P}function H(P,S){var O="",R,Q;for(R in a){if(Object.prototype.hasOwnProperty.call(a,R)){Q=a[R][P];if(n(Q)){O+=Q(S)}}}return O}function K(){var O;H("unload");if(h){do{O=new Date()
}while(O.getTimeAlias()<h)}}function I(){var O;if(!m){m=true;H("load");for(O=0;O<y.length;O++){y[O]()}}return true}function l(){var P;if(q.addEventListener){M(q,"DOMContentLoaded",function O(){q.removeEventListener("DOMContentLoaded",O,false);I()})}else{if(q.attachEvent){q.attachEvent("onreadystatechange",function O(){if(q.readyState==="complete"){q.detachEvent("onreadystatechange",O);I()}});if(q.documentElement.doScroll&&A===A.top){(function O(){if(!m){try{q.documentElement.doScroll("left")}catch(Q){setTimeout(O,0);return}I()}}())}}}if((new RegExp("WebKit")).test(d.userAgent)){P=setInterval(function(){if(m||/loaded|complete/.test(q.readyState)){clearInterval(P);I()}},10)}M(A,"load",I,false)}function g(Q,P){var O=q.createElement("script");O.src=Q;if(O.readyState){O.onreadystatechange=function(){var R=this.readyState;if(R==="loaded"||R==="complete"){O.onreadystatechange=null;P()}}}else{O.onload=P}q.getElementsByTagName("head")[0].appendChild(O)}function t(){var O="";
try{O=A.top.document.referrer}catch(Q){if(A.parent){try{O=A.parent.document.referrer}catch(P){O=""}}}if(O===""){O=q.referrer}return O}function i(O){var Q=new RegExp("^([a-z]+):"),P=Q.exec(O);return P?P[1]:null}function b(O){var Q=new RegExp("^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)"),P=Q.exec(O);return P?P[1]:O}function B(Q,P){var O="[\\?&#]"+P+"=([^&#]*)";var S=new RegExp(O);var R=S.exec(Q);return R?z(R[1]):""}function o(O){return f(j(O))}function L(ae){var Q=function(aj,W){return(aj<<W)|(aj>>>(32-W))},af=function(al){var aj="",ak,W;for(ak=7;ak>=0;ak--){W=(al>>>(ak*4))&15;aj+=W.toString(16)}return aj},T,ah,ag,P=[],Y=1732584193,V=4023233417,U=2562383102,S=271733878,R=3285377520,ad,ac,ab,aa,Z,ai,O,X=[];ae=o(ae);O=ae.length;for(ah=0;ah<O-3;ah+=4){ag=ae.charCodeAt(ah)<<24|ae.charCodeAt(ah+1)<<16|ae.charCodeAt(ah+2)<<8|ae.charCodeAt(ah+3);X.push(ag)}switch(O&3){case 0:ah=2147483648;break;case 1:ah=ae.charCodeAt(O-1)<<24|8388608;break;case 2:ah=ae.charCodeAt(O-2)<<24|ae.charCodeAt(O-1)<<16|32768;
break;case 3:ah=ae.charCodeAt(O-3)<<24|ae.charCodeAt(O-2)<<16|ae.charCodeAt(O-1)<<8|128;break}X.push(ah);while((X.length&15)!==14){X.push(0)}X.push(O>>>29);X.push((O<<3)&4294967295);for(T=0;T<X.length;T+=16){for(ah=0;ah<16;ah++){P[ah]=X[T+ah]}for(ah=16;ah<=79;ah++){P[ah]=Q(P[ah-3]^P[ah-8]^P[ah-14]^P[ah-16],1)}ad=Y;ac=V;ab=U;aa=S;Z=R;for(ah=0;ah<=19;ah++){ai=(Q(ad,5)+((ac&ab)|(~ac&aa))+Z+P[ah]+1518500249)&4294967295;Z=aa;aa=ab;ab=Q(ac,30);ac=ad;ad=ai}for(ah=20;ah<=39;ah++){ai=(Q(ad,5)+(ac^ab^aa)+Z+P[ah]+1859775393)&4294967295;Z=aa;aa=ab;ab=Q(ac,30);ac=ad;ad=ai}for(ah=40;ah<=59;ah++){ai=(Q(ad,5)+((ac&ab)|(ac&aa)|(ab&aa))+Z+P[ah]+2400959708)&4294967295;Z=aa;aa=ab;ab=Q(ac,30);ac=ad;ad=ai}for(ah=60;ah<=79;ah++){ai=(Q(ad,5)+(ac^ab^aa)+Z+P[ah]+3395469782)&4294967295;Z=aa;aa=ab;ab=Q(ac,30);ac=ad;ad=ai}Y=(Y+ad)&4294967295;V=(V+ac)&4294967295;U=(U+ab)&4294967295;S=(S+aa)&4294967295;R=(R+Z)&4294967295}ai=af(Y)+af(V)+af(U)+af(S)+af(R);return ai.toLowerCase()}function G(Q,O,P){if(Q==="translate.googleusercontent.com"){if(P===""){P=O
}O=B(O,"u");Q=b(O)}else{if(Q==="cc.bingj.com"||Q==="webcache.googleusercontent.com"||Q.slice(0,5)==="74.6."){O=q.links[0].href;Q=b(O)}}return[Q,O,P]}function u(P){var O=P.length;if(P.charAt(--O)==="."){P=P.slice(0,O)}if(P.slice(0,2)==="*."){P=P.slice(1)}return P}function N(P){P=P&&P.text?P.text:P;if(!k(P)){var O=q.getElementsByTagName("title");if(O&&s(O[0])){P=O[0].text}}return P}function w(O,P){if(P){return P}if(O.slice(-9)==="piwik.php"){O=O.slice(0,O.length-9)}return O}function v(S){var O="Piwik_Overlay";var V=new RegExp("index\\.php\\?module=Overlay&action=startOverlaySession&idsite=([0-9]+)&period=([^&]+)&date=([^&]+)$");var Q=V.exec(q.referrer);if(Q){var R=Q[1];if(R!==String(S)){return false}var U=Q[2],P=Q[3];A.name=O+"###"+U+"###"+P}var T=A.name.split("###");return T.length===3&&T[0]===O}function F(P,U,R){var T=A.name.split("###"),S=T[1],O=T[2],Q=w(P,U);g(Q+"plugins/Overlay/client/client.js?v=1",function(){Piwik_Overlay_Client.initialize(Q,R,S,O)})}function x(am,aN){var U=G(q.domain,A.location.href,t()),a7=u(U[0]),bm=U[1],aU=U[2],aS="GET",S=am||"",aj="",aP="",bc=aN||"",aE,au=q.title,aw="7z|aac|apk|ar[cj]|as[fx]|avi|bin|csv|deb|dmg|docx?|exe|flv|gif|gz|gzip|hqx|jar|jpe?g|js|mp(2|3|4|e?g)|mov(ie)?|ms[ip]|od[bfgpst]|og[gv]|pdf|phps|png|pptx?|qtm?|ra[mr]?|rpm|sea|sit|tar|t?bz2?|tgz|torrent|txt|wav|wm[av]|wpd||xlsx?|xml|z|zip",aQ=[a7],X=[],aI=[],al=[],aO=500,Y,an,Z,ab,ay=["pk_campaign","piwik_campaign","utm_campaign","utm_source","utm_medium"],at=["pk_kwd","piwik_kwd","utm_term"],bk="_pk_",ae,bl,ac=false,bf,aA,aD,ai=63072000000,ak=1800000,aF=15768000000,aB=true,ap=0,W=false,aJ={},T={},bg=200,a0={},bd={},aX=false,aV=false,aT,aK,af,ax=L,aW,aC;
function a2(bv,bs,br,bu,bq,bt){if(ac){return}var bp;if(br){bp=new Date();bp.setTime(bp.getTime()+br)}q.cookie=bv+"="+j(bs)+(br?";expires="+bp.toGMTString():"")+";path="+(bu||"/")+(bq?";domain="+bq:"")+(bt?";secure":"")}function ah(br){if(ac){return 0}var bp=new RegExp("(^|;)[ ]*"+br+"=([^;]*)"),bq=bp.exec(q.cookie);return bq?z(bq[2]):0}function bh(bp){var bq;if(Z){bq=new RegExp("#.*");return bp.replace(bq,"")}return bp}function a6(br,bp){var bs=i(bp),bq;if(bs){return bp}if(bp.slice(0,1)==="/"){return i(br)+"://"+b(br)+bp}br=bh(br);bq=br.indexOf("?");if(bq>=0){br=br.slice(0,bq)}bq=br.lastIndexOf("/");if(bq!==br.length-1){br=br.slice(0,bq+1)}return br+bp}function aR(bs){var bq,bp,br;for(bq=0;bq<aQ.length;bq++){bp=u(aQ[bq].toLowerCase());if(bs===bp){return true}if(bp.slice(0,1)==="."){if(bs===bp.slice(1)){return true}br=bs.length-bp.length;if((br>0)&&(bs.slice(br)===bp)){return true}}}return false}function bo(bp){var bq=new Image(1,1);bq.onload=function(){p=0};bq.src=S+(S.indexOf("?")<0?"?":"&")+bp
}function a3(bp){try{var br=A.XMLHttpRequest?new A.XMLHttpRequest():A.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):null;br.open("POST",S,true);br.onreadystatechange=function(){if(this.readyState===4&&this.status!==200){bo(bp)}};br.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");br.send(bp)}catch(bq){bo(bp)}}function az(br,bq){var bp=new Date();if(!bf){if(aS==="POST"){a3(br)}else{bo(br)}h=bp.getTime()+bq}}function a1(bp){return bk+bp+"."+bc+"."+aW}function V(){if(ac){return"0"}if(!s(d.cookieEnabled)){var bp=a1("testcookie");a2(bp,"1");return ah(bp)==="1"?"1":"0"}return d.cookieEnabled?"1":"0"}function aL(){aW=ax((ae||a7)+(bl||"/")).slice(0,4)}function ag(){var bq=a1("cvar"),bp=ah(bq);if(bp.length){bp=JSON2.parse(bp);if(C(bp)){return bp}}return{}}function R(){if(W===false){W=ag()}}function bb(){var bp=new Date();aT=bp.getTime()}function ad(bt,bq,bp,bs,br,bu){a2(a1("id"),bt+"."+bq+"."+bp+"."+bs+"."+br+"."+bu,ai,bl,ae)}function Q(){var bq=new Date(),bp=Math.round(bq.getTime()/1000),bs=ah(a1("id")),br;
if(bs){br=bs.split(".");br.unshift("0")}else{if(!aC){aC=ax((d.userAgent||"")+(d.platform||"")+JSON2.stringify(bd)+bp).slice(0,16)}br=["1",aC,bp,0,bp,"",""]}return br}function O(){var bp=ah(a1("ref"));if(bp.length){try{bp=JSON2.parse(bp);if(C(bp)){return bp}}catch(bq){}}return["","",0,""]}function P(){var bp=ac;ac=false;a2(a1("id"),"",-86400,bl,ae);a2(a1("ses"),"",-86400,bl,ae);a2(a1("cvar"),"",-86400,bl,ae);a2(a1("ref"),"",-86400,bl,ae);ac=bp}function ba(bt){if(!bt||!C(bt)){return}var bs=[];var br;for(br in bt){if(Object.prototype.hasOwnProperty.call(bt,br)){bs.push(br)}}var bu={};bs.sort();var bp=bs.length;var bq;for(bq=0;bq<bp;bq++){bu[bs[bq]]=bt[bs[bq]]}return bu}function av(br,bP,bQ,bs){var bN,bq=new Date(),bz=Math.round(bq.getTime()/1000),bT,bO,bu,bF,bK,by,bI,bv,bM,bt=1024,bV,bC,bJ=W,bA=a1("ses"),bB=a1("ref"),bW=a1("cvar"),bG=Q(),bE=ah(bA),bL=O(),bS=aE||bm,bw,bp;if(ac){P()}if(bf){return""}bT=bG[0];bO=bG[1];bF=bG[2];bu=bG[3];bK=bG[4];by=bG[5];if(!s(bG[6])){bG[6]=""}bI=bG[6];if(!s(bs)){bs=""
}var bD=q.characterSet||q.charset;if(!bD||bD.toLowerCase()==="utf-8"){bD=null}bw=bL[0];bp=bL[1];bv=bL[2];bM=bL[3];if(!bE){var bR=ak/1000;if(!by||(bz-by)>bR){bu++;by=bK}if(!aD||!bw.length){for(bN in ay){if(Object.prototype.hasOwnProperty.call(ay,bN)){bw=B(bS,ay[bN]);if(bw.length){break}}}for(bN in at){if(Object.prototype.hasOwnProperty.call(at,bN)){bp=B(bS,at[bN]);if(bp.length){break}}}}bV=b(aU);bC=bM.length?b(bM):"";if(bV.length&&!aR(bV)&&(!aD||!bC.length||aR(bC))){bM=aU}if(bM.length||bw.length){bv=bz;bL=[bw,bp,bv,bh(bM.slice(0,bt))];a2(bB,JSON2.stringify(bL),aF,bl,ae)}}br+="&idsite="+bc+"&rec=1&r="+String(Math.random()).slice(2,8)+"&h="+bq.getHours()+"&m="+bq.getMinutes()+"&s="+bq.getSeconds()+"&url="+j(bh(bS))+(aU.length?"&urlref="+j(bh(aU)):"")+"&_id="+bO+"&_idts="+bF+"&_idvc="+bu+"&_idn="+bT+(bw.length?"&_rcn="+j(bw):"")+(bp.length?"&_rck="+j(bp):"")+"&_refts="+bv+"&_viewts="+by+(String(bI).length?"&_ects="+bI:"")+(String(bM).length?"&_ref="+j(bh(bM.slice(0,bt))):"")+(bD?"&cs="+j(bD):"");
for(bN in bd){if(Object.prototype.hasOwnProperty.call(bd,bN)){br+="&"+bN+"="+bd[bN]}}if(bP){br+="&data="+j(JSON2.stringify(bP))}else{if(ab){br+="&data="+j(JSON2.stringify(ab))}}function bx(bX,bY){var bZ=JSON2.stringify(bX);if(bZ.length>2){return"&"+bY+"="+j(bZ)}return""}var bU=ba(aJ);var bH=ba(T);br+=bx(bU,"cvar");br+=bx(bH,"e_cvar");if(W){br+=bx(W,"_cvar");for(bN in bJ){if(Object.prototype.hasOwnProperty.call(bJ,bN)){if(W[bN][0]===""||W[bN][1]===""){delete W[bN]}}}a2(bW,JSON2.stringify(W),ak,bl,ae)}if(aB){if(ap){br+="&gt_ms="+ap}else{if(e&&e.timing&&e.timing.requestStart&&e.timing.responseEnd){br+="&gt_ms="+(e.timing.responseEnd-e.timing.requestStart)}}}ad(bO,bF,bu,bz,by,s(bs)&&String(bs).length?bs:bI);a2(bA,"*",ak,bl,ae);br+=H(bQ);if(aP.length){br+="&"+aP}return br}function a5(bs,br,bw,bt,bp,bz){var bu="idgoal=0",bv,bq=new Date(),bx=[],by;if(String(bs).length){bu+="&ec_id="+j(bs);bv=Math.round(bq.getTime()/1000)}bu+="&revenue="+br;if(String(bw).length){bu+="&ec_st="+bw}if(String(bt).length){bu+="&ec_tx="+bt
}if(String(bp).length){bu+="&ec_sh="+bp}if(String(bz).length){bu+="&ec_dt="+bz}if(a0){for(by in a0){if(Object.prototype.hasOwnProperty.call(a0,by)){if(!s(a0[by][1])){a0[by][1]=""}if(!s(a0[by][2])){a0[by][2]=""}if(!s(a0[by][3])||String(a0[by][3]).length===0){a0[by][3]=0}if(!s(a0[by][4])||String(a0[by][4]).length===0){a0[by][4]=1}bx.push(a0[by])}}bu+="&ec_items="+j(JSON2.stringify(bx))}bu=av(bu,ab,"ecommerce",bv);az(bu,aO)}function a4(bp,bt,bs,br,bq,bu){if(String(bp).length&&s(bt)){a5(bp,bt,bs,br,bq,bu)}}function bj(bp){if(s(bp)){a5("",bp,"","","","")}}function aH(bs,bt){var bp=new Date(),br=av("action_name="+j(N(bs||au)),bt,"log");az(br,aO);if(Y&&an&&!aV){aV=true;M(q,"click",bb);M(q,"mouseup",bb);M(q,"mousedown",bb);M(q,"mousemove",bb);M(q,"mousewheel",bb);M(A,"DOMMouseScroll",bb);M(A,"scroll",bb);M(q,"keypress",bb);M(q,"keydown",bb);M(q,"keyup",bb);M(A,"resize",bb);M(A,"focus",bb);M(A,"blur",bb);aT=bp.getTime();setTimeout(function bq(){var bu;bp=new Date();if((aT+an)>bp.getTime()){if(Y<bp.getTime()){bu=av("ping=1",bt,"ping");
az(bu,aO)}setTimeout(bq,an)}},an)}}function aa(br,bt,bp,bs,bu){if(String(br).length===0||String(bt).length===0){return false}var bq=av("e_c="+j(br)+"&e_a="+j(bt)+(s(bp)?"&e_n="+j(bp):"")+(s(bs)?"&e_v="+j(bs):""),bu,"event");az(bq,aO)}function ar(bp,bs,bq,bt){var br=av("search="+j(bp)+(bs?"&search_cat="+j(bs):"")+(s(bq)?"&search_count="+bq:""),bt,"sitesearch");az(br,aO)}function aM(bp,bs,br){var bq=av("idgoal="+bp+(bs?"&revenue="+bs:""),br,"goal");az(bq,aO)}function a9(bq,bp,bs){var br=av(bp+"="+j(bh(bq)),bs,"link");az(br,aO)}function be(bq,bp){if(bq!==""){return bq+bp.charAt(0).toUpperCase()+bp.slice(1)}return bp}function aq(bu){var bt,bp,bs=["","webkit","ms","moz"],br;if(!aA){for(bp=0;bp<bs.length;bp++){br=bs[bp];if(Object.prototype.hasOwnProperty.call(q,be(br,"hidden"))){if(q[be(br,"visibilityState")]==="prerender"){bt=true}break}}}if(bt){M(q,br+"visibilitychange",function bq(){q.removeEventListener(br+"visibilitychange",bq,false);bu()});return}bu()}function ao(br,bq){var bs,bp="(^| )(piwik[_-]"+bq;
if(br){for(bs=0;bs<br.length;bs++){bp+="|"+br[bs]}}bp+=")( |$)";return new RegExp(bp)}function a8(bs,bp,bt){var br=ao(aI,"download"),bq=ao(al,"link"),bu=new RegExp("\\.("+aw+")([?&#]|$)","i");return bq.test(bs)?"link":(br.test(bs)||bu.test(bp)?"download":(bt?0:"link"))}function aZ(bu){var bs,bq,bp;bs=bu.parentNode;while(bs!==null&&s(bs)){bq=bu.tagName.toUpperCase();if(bq==="A"||bq==="AREA"){break}bu=bs;bs=bu.parentNode}if(s(bu.href)){var bv=bu.hostname||b(bu.href),bw=bv.toLowerCase(),br=bu.href.replace(bv,bw),bt=new RegExp("^(javascript|vbscript|jscript|mocha|livescript|ecmascript|mailto):","i");if(!bt.test(br)){bp=a8(bu.className,br,aR(bw));if(bp){br=f(br);a9(br,bp)}}}}function bn(bp){var bq,br;bp=bp||A.event;bq=bp.which||bp.button;br=bp.target||bp.srcElement;if(bp.type==="click"){if(br){aZ(br)}}else{if(bp.type==="mousedown"){if((bq===1||bq===2)&&br){aK=bq;af=br}else{aK=af=null}}else{if(bp.type==="mouseup"){if(bq===aK&&br===af){aZ(br)}aK=af=null}}}}function aY(bq,bp){if(bp){M(bq,"mouseup",bn,false);
M(bq,"mousedown",bn,false)}else{M(bq,"click",bn,false)}}function aG(bq){if(!aX){aX=true;var br,bp=ao(X,"ignore"),bs=q.links;if(bs){for(br=0;br<bs.length;br++){if(!bp.test(bs[br].className)){aY(bs[br],bq)}}}}}function bi(){var bq,br,bs={pdf:"application/pdf",qt:"video/quicktime",realp:"audio/x-pn-realaudio-plugin",wma:"application/x-mplayer2",dir:"application/x-director",fla:"application/x-shockwave-flash",java:"application/x-java-vm",gears:"application/x-googlegears",ag:"application/x-silverlight"},bp=(new RegExp("Mac OS X.*Safari/")).test(d.userAgent)?A.devicePixelRatio||1:1;if(!((new RegExp("MSIE")).test(d.userAgent))){if(d.mimeTypes&&d.mimeTypes.length){for(bq in bs){if(Object.prototype.hasOwnProperty.call(bs,bq)){br=d.mimeTypes[bs[bq]];bd[bq]=(br&&br.enabledPlugin)?"1":"0"}}}if(typeof navigator.javaEnabled!=="unknown"&&s(d.javaEnabled)&&d.javaEnabled()){bd.java="1"}if(n(A.GearsFactory)){bd.gears="1"}bd.cookie=V()}bd.res=D.width*bp+"x"+D.height*bp}bi();aL();return{getVisitorId:function(){return(Q())[1]
},getVisitorInfo:function(){return Q()},getAttributionInfo:function(){return O()},getAttributionCampaignName:function(){return O()[0]},getAttributionCampaignKeyword:function(){return O()[1]},getAttributionReferrerTimestamp:function(){return O()[2]},getAttributionReferrerUrl:function(){return O()[3]},setTrackerUrl:function(bp){S=bp},setSiteId:function(bp){bc=bp},setCustomData:function(bp,bq){if(C(bp)){ab=bp}else{if(!ab){ab=[]}ab[bp]=bq}},appendToTrackingUrl:function(bp){aP=bp},getCustomData:function(){return ab},setCustomVariable:function(bq,bp,bt,br){var bs;if(!s(br)){br="visit"}if(bq>0){bp=s(bp)&&!k(bp)?String(bp):bp;bt=s(bt)&&!k(bt)?String(bt):bt;bs=[bp.slice(0,bg),bt.slice(0,bg)];if(br==="visit"||br===2){R();W[bq]=bs}else{if(br==="page"||br===3){aJ[bq]=bs}else{if(br==="event"){T[bq]=bs}}}}},getCustomVariable:function(bq,br){var bp;if(!s(br)){br="visit"}if(br==="page"||br===3){bp=aJ[bq]}else{if(br==="event"){bp=T[bq]}else{if(br==="visit"||br===2){R();bp=W[bq]}}}if(!s(bp)||(bp&&bp[0]==="")){return false
}return bp},deleteCustomVariable:function(bp,bq){if(this.getCustomVariable(bp,bq)){this.setCustomVariable(bp,"","",bq)}},setLinkTrackingTimer:function(bp){aO=bp},setDownloadExtensions:function(bp){aw=bp},addDownloadExtensions:function(bp){aw+="|"+bp},setDomains:function(bp){aQ=k(bp)?[bp]:bp;aQ.push(a7)},setIgnoreClasses:function(bp){X=k(bp)?[bp]:bp},setRequestMethod:function(bp){aS=bp||"GET"},setReferrerUrl:function(bp){aU=bp},setCustomUrl:function(bp){aE=a6(bm,bp)},setDocumentTitle:function(bp){au=bp},setAPIUrl:function(bp){aj=bp},setDownloadClasses:function(bp){aI=k(bp)?[bp]:bp},setLinkClasses:function(bp){al=k(bp)?[bp]:bp},setCampaignNameKey:function(bp){ay=k(bp)?[bp]:bp},setCampaignKeywordKey:function(bp){at=k(bp)?[bp]:bp},discardHashTag:function(bp){Z=bp},setCookieNamePrefix:function(bp){bk=bp;W=ag()},setCookieDomain:function(bp){ae=u(bp);aL()},setCookiePath:function(bp){bl=bp;aL()},setVisitorCookieTimeout:function(bp){ai=bp*1000},setSessionCookieTimeout:function(bp){ak=bp*1000},setReferralCookieTimeout:function(bp){aF=bp*1000
},setConversionAttributionFirstReferrer:function(bp){aD=bp},disableCookies:function(){ac=true;bd.cookie="0"},deleteCookies:function(){P()},setDoNotTrack:function(bq){var bp=d.doNotTrack||d.msDoNotTrack;bf=bq&&(bp==="yes"||bp==="1");if(bf){this.disableCookies()}},addListener:function(bq,bp){aY(bq,bp)},enableLinkTracking:function(bp){if(m){aG(bp)}else{y.push(function(){aG(bp)})}},disablePerformanceTracking:function(){aB=false},setGenerationTimeMs:function(bp){ap=parseInt(bp,10)},setHeartBeatTimer:function(br,bq){var bp=new Date();Y=bp.getTime()+br*1000;an=bq*1000},killFrame:function(){if(A.location!==A.top.location){A.top.location=A.location}},redirectFile:function(bp){if(A.location.protocol==="file:"){A.location=bp}},setCountPreRendered:function(bp){aA=bp},trackGoal:function(bp,br,bq){aq(function(){aM(bp,br,bq)})},trackLink:function(bq,bp,br){aq(function(){a9(bq,bp,br)})},trackPageView:function(bp,bq){if(v(bc)){aq(function(){F(S,aj,bc)})}else{aq(function(){aH(bp,bq)})}},trackEvent:function(bq,bs,bp,br){aq(function(){aa(bq,bs,bp,br)
})},trackSiteSearch:function(bp,br,bq){aq(function(){ar(bp,br,bq)})},setEcommerceView:function(bs,bp,br,bq){if(!s(br)||!br.length){br=""}else{if(br instanceof Array){br=JSON2.stringify(br)}}aJ[5]=["_pkc",br];if(s(bq)&&String(bq).length){aJ[2]=["_pkp",bq]}if((!s(bs)||!bs.length)&&(!s(bp)||!bp.length)){return}if(s(bs)&&bs.length){aJ[3]=["_pks",bs]}if(!s(bp)||!bp.length){bp=""}aJ[4]=["_pkn",bp]},addEcommerceItem:function(bt,bp,br,bq,bs){if(bt.length){a0[bt]=[bt,bp,br,bq,bs]}},trackEcommerceOrder:function(bp,bt,bs,br,bq,bu){a4(bp,bt,bs,br,bq,bu)},trackEcommerceCartUpdate:function(bp){bj(bp)}}}function r(){return{push:J}}M(A,"beforeunload",K,false);l();Date.prototype.getTimeAlias=Date.prototype.getTime;E=new x();for(p=0;p<_paq.length;p++){if(_paq[p][0]==="setTrackerUrl"||_paq[p][0]==="setSiteId"){J(_paq[p]);delete _paq[p]}}for(p=0;p<_paq.length;p++){if(_paq[p]){J(_paq[p])}}_paq=new r();c={addPlugin:function(O,P){a[O]=P},getTracker:function(O,P){return new x(O,P)},getAsyncTracker:function(){return E
}};if(typeof define==="function"&&define.amd){define("piwik",[],function(){return c})}return c}())}if(typeof piwik_log!=="function"){piwik_log=function(b,f,d,g){function a(h){try{return eval("piwik_"+h)}catch(i){}return}var c,e=Piwik.getTracker(d,f);e.setDocumentTitle(b);e.setCustomData(g);c=a("tracker_pause");if(c){e.setLinkTrackingTimer(c)}c=a("download_extensions");if(c){e.setDownloadExtensions(c)}c=a("hosts_alias");if(c){e.setDomains(c)}c=a("ignore_classes");if(c){e.setIgnoreClasses(c)}e.trackPageView();if(a("install_tracker")){piwik_track=function(i,k,j,h){e.setSiteId(k);e.setTrackerUrl(j);e.trackLink(i,h)};e.enableLinkTracking()}}};
