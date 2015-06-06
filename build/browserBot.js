(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.BRAGI=e()}}(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(_dereq_,module,exports){var util=_dereq_("util");var canLog=_dereq_("./bragi/canLog");var Transports=_dereq_("./bragi/transports/Transports");var transports=_dereq_("./bragi/transports");var SYMBOLS=_dereq_("./bragi/symbols");var LOGGER={util:{},canLog:canLog};LOGGER.util.__stack=function(){var stack=null;try{var orig=Error.prepareStackTrace;Error.prepareStackTrace=function(_,stack){return stack};var err=new Error;Error.captureStackTrace(err,arguments.callee);stack=err.stack;Error.prepareStackTrace=orig}catch(e){}return stack};LOGGER.util.symbols=SYMBOLS;LOGGER.options={groupsEnabled:true,groupsDisabled:[],storeStackTrace:false};LOGGER.transports=new Transports;var _defaultTransports=[new transports.Console({showMeta:true,showStackTrace:false})];for(var i=0;i<_defaultTransports.length;i++){LOGGER.transports.add(_defaultTransports[i])}LOGGER.transportClasses=transports;LOGGER.addGroup=function addGroup(group){var groupsEnabled=LOGGER.options.groupsEnabled;if(groupsEnabled===true||groupsEnabled===false){LOGGER.options.groupsEnabled=groupsEnabled=[]}var i=0,len=groupsEnabled.length;for(i=0;i<len;i++){if(groupsEnabled[i].toString()===group.toString()){return LOGGER}}groupsEnabled.push(group);return LOGGER};LOGGER.removeGroup=function removeGroup(group){var groupsEnabled=LOGGER.options.groupsEnabled;if(groupsEnabled===true||groupsEnabled===false){LOGGER.options.groupsEnabled=groupsEnabled=[]}var i=0,len=groupsEnabled.length;var groupsEnabledWithoutGroup=[];for(i=0;i<len;i++){if(groupsEnabled[i].toString()!==group.toString()){groupsEnabledWithoutGroup.push(groupsEnabled[i])}}LOGGER.options.groupsEnabled=groupsEnabledWithoutGroup;return LOGGER};LOGGER.util.print=function print(message,color){return message};LOGGER.log=function loggerLog(group,message){var groupsEnabled,groupsDisabled,currentTransport;var transportFuncsToCall=[];for(var transport in LOGGER.transports._transports){currentTransport=LOGGER.transports._transports[transport];groupsEnabled=LOGGER.options.groupsEnabled;groupsDisabled=LOGGER.options.groupsDisabled;if(currentTransport.groupsEnabled!==undefined){groupsEnabled=currentTransport.groupsEnabled}if(currentTransport.groupsDisabled!==undefined){groupsDisabled=currentTransport.groupsDisabled}if(canLog(group,groupsEnabled,groupsDisabled)){transportFuncsToCall.push(currentTransport)}}if(transportFuncsToCall.length<1){if(!LOGGER.options.storeAllHistory){return false}}var extraArgs=Array.prototype.slice.call(arguments,2);var loggedObject={};var caller=null;if(LOGGER.options.storeStackTrace){caller="global scope";if(loggerLog.caller&&loggerLog.caller.name){caller=loggerLog.caller.name}else if((loggerLog.caller+"").indexOf("function ()")===0){caller="anonymous function"}}loggedObject.properties={};loggedObject.originalArgs=[];for(var i=0;i<extraArgs.length;i++){if(!(extraArgs[i]instanceof Array)&&typeof extraArgs[i]==="object"){for(var key in extraArgs[i]){loggedObject.properties[key]=extraArgs[i][key]}}else{loggedObject.properties["_argument"+i]=extraArgs[i]}loggedObject.originalArgs.push(extraArgs[i])}loggedObject.meta={caller:caller,date:(new Date).toJSON()};loggedObject.unixTimestamp=(new Date).getTime()/1e3;var stack=false;if(LOGGER.options.storeStackTrace){stack=LOGGER.util.__stack();if(stack){var stackLength=stack.length;var trace=[];for(i=1;i<stack.length;i++){trace.push(stack[i]+"")}loggedObject.meta.file=stack[1].getFileName();loggedObject.meta.line=stack[1].getLineNumber();loggedObject.meta.column=stack[1].getColumnNumber();loggedObject.meta.trace=trace}}loggedObject.group=group;loggedObject.message=message;for(i=0,len=transportFuncsToCall.length;i<len;i++){transportFuncsToCall[i].log.call(transportFuncsToCall[i],loggedObject)}};module.exports=LOGGER},{"./bragi/canLog":2,"./bragi/symbols":3,"./bragi/transports":4,"./bragi/transports/Transports":7,util:12}],2:[function(_dereq_,module,exports){function canLog(group,groupsEnabled,groupsDisabled){if(groupsEnabled===undefined){groupsEnabled=true}var i,len;var canLogIt=true;if(groupsEnabled===true){canLogIt=true}else if(groupsEnabled===false||groupsEnabled===null){canLogIt=false}else if(groupsEnabled instanceof Array){canLogIt=false;for(i=0,len=groupsEnabled.length;i<len;i++){if(groupsEnabled[i]instanceof RegExp){if(groupsEnabled[i].test(group)){canLogIt=true;break}}else if(group.indexOf(groupsEnabled[i])===0){canLogIt=true;break}}}if(group.indexOf("error")===0||group.indexOf("warn")===0){canLogIt=true}if(groupsDisabled&&groupsDisabled instanceof Array){for(i=0,len=groupsDisabled.length;i<len;i++){if(groupsDisabled[i]instanceof RegExp){if(groupsDisabled[i].test(group)){canLogIt=false;break}}else if(group.indexOf(groupsDisabled[i])===0){canLogIt=false;break}}}return canLogIt}module.exports=canLog},{}],3:[function(_dereq_,module,exports){module.exports={success:"✔︎ ",error:"✘ ",warn:"⚑ ",arrow:"➤ ",star:"☆ ",box:"☐ ",boxSuccess:"☑︎ ",boxError:"☒ ",circle:"◯ ",circleFilled:"◉ ",asterisk:"✢",floral:"❧",snowflake:"❄︎",fourDiamond:"❖",spade:"♠︎",club:"♣︎",heart:"♥︎",diamond:"♦︎",queen:"♛",rook:"♜",pawn:"♟",atom:"⚛"}},{}],4:[function(_dereq_,module,exports){var files=_dereq_("./transports/index");var transports={};for(var file in files){transports[file]=files[file]}module.exports=transports},{"./transports/index":8}],5:[function(_dereq_,module,exports){var SYMBOLS=_dereq_("../symbols");if(window.console&&window.console.log){if(typeof window.console.log!=="function"){window.console.log=function(){}}}else{window.console={};window.console.log=function(){}}GROUP_COLORS=[["#3182bd","#ffffff","#225588"],["#f38630","#ffffff"],["#e0e4cc","#000000","#c8cbb6"],["#8c510a","#ffffff"],["#35978f","#ffffff","#13756d"],["#c51b7d","#ffffff"],["#c6dbef","#000000"],["#af8dc3","#000000"],["#543005","#ffffff","#321002"],["#7fbf7b","#000000"],["#dfc27d","#000000","#bda05b"],["#f5f5f5","#000000"],["#e9a3c9","#000000"],["#59323C","#ffffff"],["#66c2a5","#000000"],["#f6e8c3","#000000"],["#606060","#f0f0f0"],["#8c510a","#ffffff"],["#80cdc1","#000000"],["#542788","#ffffff"],["#FB8AFE","#343434"],["#003c30","#ffffff"],["#e6f598","#000000"],["#c7eae5","#000000"],["#000000","#f0f0f0"],["#C3FF0E","#343434"]];OVERFLOW_SYMBOLS=["asterisk","floral","snowflake","fourDiamond","spade","club","heart","diamond","queen","rook","pawn","atom"];var BASE_CSS="padding: 2px; margin:2px; line-height: 1.8em;";var META_STYLE=BASE_CSS+"font-size:0.9em; color: #cdcdcd; padding-left:30px;";function TransportConsole(options){options=options||{};this.groupsEnabled=options.groupsEnabled;this.groupsDisabled=options.groupsDisabled;this.addLineBreak=options.addLineBreak!==undefined?options.addLineBreak:false;this.showMeta=options.showMeta!==undefined?options.showMeta:false;this.showStackTrace=options.showStackTrace!==undefined?options.showStackTrace:true;this.showColors=options.showColors===undefined?true:options.showColor;this._foundColors=[];this._colorDict={error:BASE_CSS+"background: #ff0000; color: #ffffff; font-style: bold; border: 4px solid #cc0000;",warn:BASE_CSS+"padding: 2px; background: #ffff00; color: #343434; font-style: bold; border: 4px solid #cccc00;"};this.curSymbolIndex=0;return this}TransportConsole.prototype.getColor=function getColor(group){var color="";var baseColor="";var curSymbol;var cssString="";group=group.split(":")[0];if(this._colorDict[group]){return this._colorDict[group]}if(this._foundColors.length>=GROUP_COLORS.length){color=GROUP_COLORS[this._foundColors.length%GROUP_COLORS.length];baseColor=color;cssString+="font-style: italic;"}else{color=GROUP_COLORS[this._foundColors.length]}var borderColor=color[2];if(!color[2]){borderColor="#";for(var i=1;i<color[0].length;i++){borderColor+=Math.max(0,parseInt(color[0][i],16)-2).toString(16)}}cssString+=BASE_CSS+"background: "+color[0]+";"+"border: 1px solid "+borderColor+";"+"color: "+color[1]+";";this._foundColors.push(color);this._colorDict[group]=cssString;return cssString};TransportConsole.prototype.name="Console";TransportConsole.prototype.log=function transportConsoleLog(loggedObject){var consoleMessage="";if(this.showColors){consoleMessage+="%c"}consoleMessage+="[ "+loggedObject.group+" "+" ] 	";consoleMessage+=loggedObject.message+" 	";if(this.addLineBreak){consoleMessage+="\n"}var toLogArray=[];toLogArray.push(consoleMessage);if(this.showColors){toLogArray.push(this.getColor(loggedObject.group))}toLogArray=toLogArray.concat(loggedObject.originalArgs);console.log.apply(console,toLogArray);var metaConsoleMessage="";var metaLogArray=[];if(this.showMeta){if(this.showColors){metaConsoleMessage+="%c"}metaConsoleMessage+=(new Date).toJSON()+" 	 	 ";if(loggedObject.meta.caller){metaConsoleMessage+="caller: "+loggedObject.meta.caller+" 	 	 "}if(loggedObject.meta.file&&loggedObject.meta.line){metaConsoleMessage+=loggedObject.meta.file+":"+loggedObject.meta.line+":"+loggedObject.meta.column+""}}if(this.showMeta&&this.showStackTrace&&loggedObject.meta.trace){metaConsoleMessage+="\n"+"(Stack Trace)"+"\n";for(i=0;i<loggedObject.meta.trace.length;i++){metaConsoleMessage+="	"+loggedObject.meta.trace[i]+"\n"}}if(this.showMeta&&this.showColors){metaLogArray.push(metaConsoleMessage);metaLogArray.push(META_STYLE)}if(metaLogArray.length>0){console.log.apply(console,metaLogArray)}return this};module.exports=TransportConsole},{"../symbols":3}],6:[function(_dereq_,module,exports){function TransportHistory(options){options=options||{};this.groupsEnabled=options.groupsEnabled;this.groupsDisabled=options.groupsDisabled;this.storeEverything=false;if(options.storeEverything===true){this.storeEverything=true;this.groupsEnabled=true}this.historySize=options.historySize!==undefined?options.historySize:200;this.history={};return this}TransportHistory.prototype.name="History";TransportHistory.prototype.log=function transportHistoryLog(loggedObject){var group=loggedObject.group.split(":")[0];if(this.history[group]===undefined){this.history[group]=[]}this.history[group].push(loggedObject);if(this.historySize>0&&this.history[group].length>this.historySize){this.history[group].shift()}return this};module.exports=TransportHistory},{}],7:[function(_dereq_,module,exports){function Transports(){this._transports={};this._transportCount={};return this}Transports.prototype.get=function get(transportName){var returnedTransportObjects=new Array;for(var key in this._transports){if(key.toLowerCase().indexOf(transportName.toLowerCase())>-1){returnedTransportObjects.push(this._transports[key])}}returnedTransportObjects.property=function transportProperty(keyOrObject,value){var i=0;var len=this.length;if(typeof keyOrObject==="string"&&value===undefined){var vals=[];for(i=0;i<len;i++){vals.push(this[i][keyOrObject])}return vals}else if(typeof keyOrObject==="string"&&value!==undefined){for(i=0;i<len;i++){this[i][keyOrObject]=value}}else if(typeof keyOrObject==="object"){for(i=0;i<len;i++){for(var keyName in keyOrObject){this[i][keyName]=keyOrObject[keyName]}}}return this};return returnedTransportObjects};Transports.prototype.add=function add(transport){if(this._transportCount[transport.name]===undefined){this._transportCount[transport.name]=1;this._transports[transport.name]=transport}else{this._transportCount[transport.name]+=1;this._transports[transport.name+""+(this._transportCount[transport.name]-1)]=transport}return this};Transports.prototype.remove=function remove(transportName,index){transportName=transportName;if(transportName.name){transportName=transportName.name}for(var key in this._transports){if(index!==undefined){if(transportName+""+index===key){delete this._transports[key]}}else{if(key.indexOf(transportName)>-1){delete this._transports[key]}}}return this};Transports.prototype.empty=function empty(){for(var key in this._transports){delete this._transports[key]}return this};module.exports=Transports},{}],8:[function(_dereq_,module,exports){module.exports.Console=_dereq_("./Console");module.exports.History=_dereq_("./History")},{"./Console":5,"./History":6}],9:[function(_dereq_,module,exports){if(typeof Object.create==="function"){module.exports=function inherits(ctor,superCtor){ctor.super_=superCtor;ctor.prototype=Object.create(superCtor.prototype,{constructor:{value:ctor,enumerable:false,writable:true,configurable:true}})}}else{module.exports=function inherits(ctor,superCtor){ctor.super_=superCtor;var TempCtor=function(){};TempCtor.prototype=superCtor.prototype;ctor.prototype=new TempCtor;ctor.prototype.constructor=ctor}}},{}],10:[function(_dereq_,module,exports){var process=module.exports={};process.nextTick=function(){var canSetImmediate=typeof window!=="undefined"&&window.setImmediate;var canPost=typeof window!=="undefined"&&window.postMessage&&window.addEventListener;if(canSetImmediate){return function(f){return window.setImmediate(f)}}if(canPost){var queue=[];window.addEventListener("message",function(ev){var source=ev.source;if((source===window||source===null)&&ev.data==="process-tick"){ev.stopPropagation();if(queue.length>0){var fn=queue.shift();fn()}}},true);return function nextTick(fn){queue.push(fn);window.postMessage("process-tick","*")}}return function nextTick(fn){setTimeout(fn,0)}}();process.title="browser";process.browser=true;process.env={};process.argv=[];function noop(){}process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.binding=function(name){throw new Error("process.binding is not supported")};process.cwd=function(){return"/"};process.chdir=function(dir){throw new Error("process.chdir is not supported")}},{}],11:[function(_dereq_,module,exports){module.exports=function isBuffer(arg){return arg&&typeof arg==="object"&&typeof arg.copy==="function"&&typeof arg.fill==="function"&&typeof arg.readUInt8==="function"}},{}],12:[function(_dereq_,module,exports){(function(process,global){var formatRegExp=/%[sdj%]/g;exports.format=function(f){if(!isString(f)){var objects=[];for(var i=0;i<arguments.length;i++){objects.push(inspect(arguments[i]))}return objects.join(" ")}var i=1;var args=arguments;var len=args.length;var str=String(f).replace(formatRegExp,function(x){if(x==="%")return"%";if(i>=len)return x;switch(x){case"%s":return String(args[i++]);case"%d":return Number(args[i++]);case"%j":try{return JSON.stringify(args[i++])}catch(_){return"[Circular]"}default:return x}});for(var x=args[i];i<len;x=args[++i]){if(isNull(x)||!isObject(x)){str+=" "+x}else{str+=" "+inspect(x)}}return str};exports.deprecate=function(fn,msg){if(isUndefined(global.process)){return function(){return exports.deprecate(fn,msg).apply(this,arguments)}}if(process.noDeprecation===true){return fn}var warned=false;function deprecated(){if(!warned){if(process.throwDeprecation){throw new Error(msg)}else if(process.traceDeprecation){console.trace(msg)}else{console.error(msg)}warned=true}return fn.apply(this,arguments)}return deprecated};var debugs={};var debugEnviron;exports.debuglog=function(set){if(isUndefined(debugEnviron))debugEnviron=process.env.NODE_DEBUG||"";set=set.toUpperCase();if(!debugs[set]){if(new RegExp("\\b"+set+"\\b","i").test(debugEnviron)){var pid=process.pid;debugs[set]=function(){var msg=exports.format.apply(exports,arguments);console.error("%s %d: %s",set,pid,msg)}}else{debugs[set]=function(){}}}return debugs[set]};function inspect(obj,opts){var ctx={seen:[],stylize:stylizeNoColor};if(arguments.length>=3)ctx.depth=arguments[2];if(arguments.length>=4)ctx.colors=arguments[3];if(isBoolean(opts)){ctx.showHidden=opts}else if(opts){exports._extend(ctx,opts)}if(isUndefined(ctx.showHidden))ctx.showHidden=false;if(isUndefined(ctx.depth))ctx.depth=2;if(isUndefined(ctx.colors))ctx.colors=false;if(isUndefined(ctx.customInspect))ctx.customInspect=true;if(ctx.colors)ctx.stylize=stylizeWithColor;return formatValue(ctx,obj,ctx.depth)}exports.inspect=inspect;inspect.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]};inspect.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"};function stylizeWithColor(str,styleType){var style=inspect.styles[styleType];if(style){return"["+inspect.colors[style][0]+"m"+str+"["+inspect.colors[style][1]+"m"}else{return str}}function stylizeNoColor(str,styleType){return str}function arrayToHash(array){var hash={};array.forEach(function(val,idx){hash[val]=true});return hash}function formatValue(ctx,value,recurseTimes){if(ctx.customInspect&&value&&isFunction(value.inspect)&&value.inspect!==exports.inspect&&!(value.constructor&&value.constructor.prototype===value)){var ret=value.inspect(recurseTimes,ctx);if(!isString(ret)){ret=formatValue(ctx,ret,recurseTimes)}return ret}var primitive=formatPrimitive(ctx,value);if(primitive){return primitive}var keys=Object.keys(value);var visibleKeys=arrayToHash(keys);if(ctx.showHidden){keys=Object.getOwnPropertyNames(value)}if(isError(value)&&(keys.indexOf("message")>=0||keys.indexOf("description")>=0)){return formatError(value)}if(keys.length===0){if(isFunction(value)){var name=value.name?": "+value.name:"";return ctx.stylize("[Function"+name+"]","special")}if(isRegExp(value)){return ctx.stylize(RegExp.prototype.toString.call(value),"regexp")}if(isDate(value)){return ctx.stylize(Date.prototype.toString.call(value),"date")}if(isError(value)){return formatError(value)}}var base="",array=false,braces=["{","}"];if(isArray(value)){array=true;braces=["[","]"]}if(isFunction(value)){var n=value.name?": "+value.name:"";base=" [Function"+n+"]"}if(isRegExp(value)){base=" "+RegExp.prototype.toString.call(value)}if(isDate(value)){base=" "+Date.prototype.toUTCString.call(value)}if(isError(value)){base=" "+formatError(value)}if(keys.length===0&&(!array||value.length==0)){return braces[0]+base+braces[1]}if(recurseTimes<0){if(isRegExp(value)){return ctx.stylize(RegExp.prototype.toString.call(value),"regexp")}else{return ctx.stylize("[Object]","special")}}ctx.seen.push(value);var output;if(array){output=formatArray(ctx,value,recurseTimes,visibleKeys,keys)}else{output=keys.map(function(key){return formatProperty(ctx,value,recurseTimes,visibleKeys,key,array)})}ctx.seen.pop();return reduceToSingleString(output,base,braces)}function formatPrimitive(ctx,value){if(isUndefined(value))return ctx.stylize("undefined","undefined");if(isString(value)){var simple="'"+JSON.stringify(value).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return ctx.stylize(simple,"string")}if(isNumber(value))return ctx.stylize(""+value,"number");if(isBoolean(value))return ctx.stylize(""+value,"boolean");if(isNull(value))return ctx.stylize("null","null")}function formatError(value){return"["+Error.prototype.toString.call(value)+"]"}function formatArray(ctx,value,recurseTimes,visibleKeys,keys){var output=[];for(var i=0,l=value.length;i<l;++i){if(hasOwnProperty(value,String(i))){output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,String(i),true))}else{output.push("")}}keys.forEach(function(key){if(!key.match(/^\d+$/)){output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,key,true))}});return output}function formatProperty(ctx,value,recurseTimes,visibleKeys,key,array){var name,str,desc;desc=Object.getOwnPropertyDescriptor(value,key)||{value:value[key]};if(desc.get){if(desc.set){str=ctx.stylize("[Getter/Setter]","special")}else{str=ctx.stylize("[Getter]","special")}}else{if(desc.set){str=ctx.stylize("[Setter]","special")}}if(!hasOwnProperty(visibleKeys,key)){name="["+key+"]"}if(!str){if(ctx.seen.indexOf(desc.value)<0){if(isNull(recurseTimes)){str=formatValue(ctx,desc.value,null)}else{str=formatValue(ctx,desc.value,recurseTimes-1)}if(str.indexOf("\n")>-1){if(array){str=str.split("\n").map(function(line){return"  "+line}).join("\n").substr(2)}else{str="\n"+str.split("\n").map(function(line){return"   "+line}).join("\n")}}}else{str=ctx.stylize("[Circular]","special")}}if(isUndefined(name)){if(array&&key.match(/^\d+$/)){return str}name=JSON.stringify(""+key);if(name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)){name=name.substr(1,name.length-2);name=ctx.stylize(name,"name")}else{name=name.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'");name=ctx.stylize(name,"string")}}return name+": "+str}function reduceToSingleString(output,base,braces){var numLinesEst=0;var length=output.reduce(function(prev,cur){numLinesEst++;if(cur.indexOf("\n")>=0)numLinesEst++;return prev+cur.replace(/\u001b\[\d\d?m/g,"").length+1},0);if(length>60){return braces[0]+(base===""?"":base+"\n ")+" "+output.join(",\n  ")+" "+braces[1]}return braces[0]+base+" "+output.join(", ")+" "+braces[1]}function isArray(ar){return Array.isArray(ar)}exports.isArray=isArray;function isBoolean(arg){return typeof arg==="boolean"}exports.isBoolean=isBoolean;function isNull(arg){return arg===null}exports.isNull=isNull;function isNullOrUndefined(arg){return arg==null}exports.isNullOrUndefined=isNullOrUndefined;function isNumber(arg){return typeof arg==="number"}exports.isNumber=isNumber;function isString(arg){return typeof arg==="string"}exports.isString=isString;function isSymbol(arg){return typeof arg==="symbol"}exports.isSymbol=isSymbol;function isUndefined(arg){return arg===void 0}exports.isUndefined=isUndefined;function isRegExp(re){return isObject(re)&&objectToString(re)==="[object RegExp]"}exports.isRegExp=isRegExp;function isObject(arg){return typeof arg==="object"&&arg!==null}exports.isObject=isObject;function isDate(d){return isObject(d)&&objectToString(d)==="[object Date]"}exports.isDate=isDate;function isError(e){return isObject(e)&&(objectToString(e)==="[object Error]"||e instanceof Error)}exports.isError=isError;function isFunction(arg){return typeof arg==="function"}exports.isFunction=isFunction;function isPrimitive(arg){return arg===null||typeof arg==="boolean"||typeof arg==="number"||typeof arg==="string"||typeof arg==="symbol"||typeof arg==="undefined"}exports.isPrimitive=isPrimitive;exports.isBuffer=_dereq_("./support/isBuffer");function objectToString(o){return Object.prototype.toString.call(o)}function pad(n){return n<10?"0"+n.toString(10):n.toString(10)}var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function timestamp(){var d=new Date;var time=[pad(d.getHours()),pad(d.getMinutes()),pad(d.getSeconds())].join(":");return[d.getDate(),months[d.getMonth()],time].join(" ")}exports.log=function(){console.log("%s - %s",timestamp(),exports.format.apply(exports,arguments))};exports.inherits=_dereq_("inherits");exports._extend=function(origin,add){if(!add||!isObject(add))return origin;var keys=Object.keys(add);var i=keys.length;while(i--){origin[keys[i]]=add[keys[i]]}return origin};function hasOwnProperty(obj,prop){return Object.prototype.hasOwnProperty.call(obj,prop)}}).call(this,_dereq_("_process"),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./support/isBuffer":11,_process:10,inherits:9}]},{},[1])(1)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NavMesh = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
; var __browserify_shim_require__=_dereq_;(function browserifyShim(module, exports, _dereq_, define, browserify_shim__define__module__export__) {
// rev 452
/********************************************************************************
 *                                                                              *
 * Author    :  Angus Johnson                                                   *
 * Version   :  6.1.3a                                                          *
 * Date      :  22 January 2014                                                 *
 * Website   :  http://www.angusj.com                                           *
 * Copyright :  Angus Johnson 2010-2014                                         *
 *                                                                              *
 * License:                                                                     *
 * Use, modification & distribution is subject to Boost Software License Ver 1. *
 * http://www.boost.org/LICENSE_1_0.txt                                         *
 *                                                                              *
 * Attributions:                                                                *
 * The code in this library is an extension of Bala Vatti's clipping algorithm: *
 * "A generic solution to polygon clipping"                                     *
 * Communications of the ACM, Vol 35, Issue 7 (July 1992) pp 56-63.             *
 * http://portal.acm.org/citation.cfm?id=129906                                 *
 *                                                                              *
 * Computer graphics and geometric modeling: implementation and algorithms      *
 * By Max K. Agoston                                                            *
 * Springer; 1 edition (January 4, 2005)                                        *
 * http://books.google.com/books?q=vatti+clipping+agoston                       *
 *                                                                              *
 * See also:                                                                    *
 * "Polygon Offsetting by Computing Winding Numbers"                            *
 * Paper no. DETC2005-85513 pp. 565-575                                         *
 * ASME 2005 International Design Engineering Technical Conferences             *
 * and Computers and Information in Engineering Conference (IDETC/CIE2005)      *
 * September 24-28, 2005 , Long Beach, California, USA                          *
 * http://www.me.berkeley.edu/~mcmains/pubs/DAC05OffsetPolygon.pdf              *
 *                                                                              *
 *******************************************************************************/
/*******************************************************************************
 *                                                                              *
 * Author    :  Timo                                                            *
 * Version   :  6.1.3.2                                                         *
 * Date      :  1 February 2014                                                 *
 *                                                                              *
 * This is a translation of the C# Clipper library to Javascript.               *
 * Int128 struct of C# is implemented using JSBN of Tom Wu.                     *
 * Because Javascript lacks support for 64-bit integers, the space              *
 * is a little more restricted than in C# version.                              *
 *                                                                              *
 * C# version has support for coordinate space:                                 *
 * +-4611686018427387903 ( sqrt(2^127 -1)/2 )                                   *
 * while Javascript version has support for space:                              *
 * +-4503599627370495 ( sqrt(2^106 -1)/2 )                                      *
 *                                                                              *
 * Tom Wu's JSBN proved to be the fastest big integer library:                  *
 * http://jsperf.com/big-integer-library-test                                   *
 *                                                                              *
 * This class can be made simpler when (if ever) 64-bit integer support comes.  *
 *                                                                              *
 *******************************************************************************/
/*******************************************************************************
 *                                                                              *
 * Basic JavaScript BN library - subset useful for RSA encryption.              *
 * http://www-cs-students.stanford.edu/~tjw/jsbn/                               *
 * Copyright (c) 2005  Tom Wu                                                   *
 * All Rights Reserved.                                                         *
 * See "LICENSE" for details:                                                   *
 * http://www-cs-students.stanford.edu/~tjw/jsbn/LICENSE                        *
 *                                                                              *
 *******************************************************************************/
(function(){function k(a,b,c){d.biginteger_used=1;null!=a&&("number"==typeof a&&"undefined"==typeof b?this.fromInt(a):"number"==typeof a?this.fromNumber(a,b,c):null==b&&"string"!=typeof a?this.fromString(a,256):this.fromString(a,b))}function q(){return new k(null)}function Q(a,b,c,e,d,g){for(;0<=--g;){var h=b*this[a++]+c[e]+d;d=Math.floor(h/67108864);c[e++]=h&67108863}return d}function R(a,b,c,e,d,g){var h=b&32767;for(b>>=15;0<=--g;){var l=this[a]&32767,k=this[a++]>>15,n=b*l+k*h,l=h*l+((n&32767)<<
15)+c[e]+(d&1073741823);d=(l>>>30)+(n>>>15)+b*k+(d>>>30);c[e++]=l&1073741823}return d}function S(a,b,c,e,d,g){var h=b&16383;for(b>>=14;0<=--g;){var l=this[a]&16383,k=this[a++]>>14,n=b*l+k*h,l=h*l+((n&16383)<<14)+c[e]+d;d=(l>>28)+(n>>14)+b*k;c[e++]=l&268435455}return d}function L(a,b){var c=B[a.charCodeAt(b)];return null==c?-1:c}function v(a){var b=q();b.fromInt(a);return b}function C(a){var b=1,c;0!=(c=a>>>16)&&(a=c,b+=16);0!=(c=a>>8)&&(a=c,b+=8);0!=(c=a>>4)&&(a=c,b+=4);0!=(c=a>>2)&&(a=c,b+=2);0!=
a>>1&&(b+=1);return b}function x(a){this.m=a}function y(a){this.m=a;this.mp=a.invDigit();this.mpl=this.mp&32767;this.mph=this.mp>>15;this.um=(1<<a.DB-15)-1;this.mt2=2*a.t}function T(a,b){return a&b}function I(a,b){return a|b}function M(a,b){return a^b}function N(a,b){return a&~b}function A(){}function O(a){return a}function w(a){this.r2=q();this.q3=q();k.ONE.dlShiftTo(2*a.t,this.r2);this.mu=this.r2.divide(a);this.m=a}var d={},D=!1;"undefined"!==typeof module&&module.exports?(module.exports=d,D=!0):
"undefined"!==typeof document?window.ClipperLib=d:self.ClipperLib=d;var r;if(D)p="chrome",r="Netscape";else{var p=navigator.userAgent.toString().toLowerCase();r=navigator.appName}var E,J,F,G,H,P;E=-1!=p.indexOf("chrome")&&-1==p.indexOf("chromium")?1:0;D=-1!=p.indexOf("chromium")?1:0;J=-1!=p.indexOf("safari")&&-1==p.indexOf("chrome")&&-1==p.indexOf("chromium")?1:0;F=-1!=p.indexOf("firefox")?1:0;p.indexOf("firefox/17");p.indexOf("firefox/15");p.indexOf("firefox/3");G=-1!=p.indexOf("opera")?1:0;p.indexOf("msie 10");
p.indexOf("msie 9");H=-1!=p.indexOf("msie 8")?1:0;P=-1!=p.indexOf("msie 7")?1:0;p=-1!=p.indexOf("msie ")?1:0;d.biginteger_used=null;"Microsoft Internet Explorer"==r?(k.prototype.am=R,r=30):"Netscape"!=r?(k.prototype.am=Q,r=26):(k.prototype.am=S,r=28);k.prototype.DB=r;k.prototype.DM=(1<<r)-1;k.prototype.DV=1<<r;k.prototype.FV=Math.pow(2,52);k.prototype.F1=52-r;k.prototype.F2=2*r-52;var B=[],u;r=48;for(u=0;9>=u;++u)B[r++]=u;r=97;for(u=10;36>u;++u)B[r++]=u;r=65;for(u=10;36>u;++u)B[r++]=u;x.prototype.convert=
function(a){return 0>a.s||0<=a.compareTo(this.m)?a.mod(this.m):a};x.prototype.revert=function(a){return a};x.prototype.reduce=function(a){a.divRemTo(this.m,null,a)};x.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};x.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};y.prototype.convert=function(a){var b=q();a.abs().dlShiftTo(this.m.t,b);b.divRemTo(this.m,null,b);0>a.s&&0<b.compareTo(k.ZERO)&&this.m.subTo(b,b);return b};y.prototype.revert=function(a){var b=q();a.copyTo(b);
this.reduce(b);return b};y.prototype.reduce=function(a){for(;a.t<=this.mt2;)a[a.t++]=0;for(var b=0;b<this.m.t;++b){var c=a[b]&32767,e=c*this.mpl+((c*this.mph+(a[b]>>15)*this.mpl&this.um)<<15)&a.DM,c=b+this.m.t;for(a[c]+=this.m.am(0,e,a,b,0,this.m.t);a[c]>=a.DV;)a[c]-=a.DV,a[++c]++}a.clamp();a.drShiftTo(this.m.t,a);0<=a.compareTo(this.m)&&a.subTo(this.m,a)};y.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};y.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};k.prototype.copyTo=
function(a){for(var b=this.t-1;0<=b;--b)a[b]=this[b];a.t=this.t;a.s=this.s};k.prototype.fromInt=function(a){this.t=1;this.s=0>a?-1:0;0<a?this[0]=a:-1>a?this[0]=a+this.DV:this.t=0};k.prototype.fromString=function(a,b){var c;if(16==b)c=4;else if(8==b)c=3;else if(256==b)c=8;else if(2==b)c=1;else if(32==b)c=5;else if(4==b)c=2;else{this.fromRadix(a,b);return}this.s=this.t=0;for(var e=a.length,d=!1,g=0;0<=--e;){var h=8==c?a[e]&255:L(a,e);0>h?"-"==a.charAt(e)&&(d=!0):(d=!1,0==g?this[this.t++]=h:g+c>this.DB?
(this[this.t-1]|=(h&(1<<this.DB-g)-1)<<g,this[this.t++]=h>>this.DB-g):this[this.t-1]|=h<<g,g+=c,g>=this.DB&&(g-=this.DB))}8==c&&0!=(a[0]&128)&&(this.s=-1,0<g&&(this[this.t-1]|=(1<<this.DB-g)-1<<g));this.clamp();d&&k.ZERO.subTo(this,this)};k.prototype.clamp=function(){for(var a=this.s&this.DM;0<this.t&&this[this.t-1]==a;)--this.t};k.prototype.dlShiftTo=function(a,b){var c;for(c=this.t-1;0<=c;--c)b[c+a]=this[c];for(c=a-1;0<=c;--c)b[c]=0;b.t=this.t+a;b.s=this.s};k.prototype.drShiftTo=function(a,b){for(var c=
a;c<this.t;++c)b[c-a]=this[c];b.t=Math.max(this.t-a,0);b.s=this.s};k.prototype.lShiftTo=function(a,b){var c=a%this.DB,e=this.DB-c,d=(1<<e)-1,g=Math.floor(a/this.DB),h=this.s<<c&this.DM,l;for(l=this.t-1;0<=l;--l)b[l+g+1]=this[l]>>e|h,h=(this[l]&d)<<c;for(l=g-1;0<=l;--l)b[l]=0;b[g]=h;b.t=this.t+g+1;b.s=this.s;b.clamp()};k.prototype.rShiftTo=function(a,b){b.s=this.s;var c=Math.floor(a/this.DB);if(c>=this.t)b.t=0;else{var e=a%this.DB,d=this.DB-e,g=(1<<e)-1;b[0]=this[c]>>e;for(var h=c+1;h<this.t;++h)b[h-
c-1]|=(this[h]&g)<<d,b[h-c]=this[h]>>e;0<e&&(b[this.t-c-1]|=(this.s&g)<<d);b.t=this.t-c;b.clamp()}};k.prototype.subTo=function(a,b){for(var c=0,e=0,d=Math.min(a.t,this.t);c<d;)e+=this[c]-a[c],b[c++]=e&this.DM,e>>=this.DB;if(a.t<this.t){for(e-=a.s;c<this.t;)e+=this[c],b[c++]=e&this.DM,e>>=this.DB;e+=this.s}else{for(e+=this.s;c<a.t;)e-=a[c],b[c++]=e&this.DM,e>>=this.DB;e-=a.s}b.s=0>e?-1:0;-1>e?b[c++]=this.DV+e:0<e&&(b[c++]=e);b.t=c;b.clamp()};k.prototype.multiplyTo=function(a,b){var c=this.abs(),e=
a.abs(),d=c.t;for(b.t=d+e.t;0<=--d;)b[d]=0;for(d=0;d<e.t;++d)b[d+c.t]=c.am(0,e[d],b,d,0,c.t);b.s=0;b.clamp();this.s!=a.s&&k.ZERO.subTo(b,b)};k.prototype.squareTo=function(a){for(var b=this.abs(),c=a.t=2*b.t;0<=--c;)a[c]=0;for(c=0;c<b.t-1;++c){var e=b.am(c,b[c],a,2*c,0,1);(a[c+b.t]+=b.am(c+1,2*b[c],a,2*c+1,e,b.t-c-1))>=b.DV&&(a[c+b.t]-=b.DV,a[c+b.t+1]=1)}0<a.t&&(a[a.t-1]+=b.am(c,b[c],a,2*c,0,1));a.s=0;a.clamp()};k.prototype.divRemTo=function(a,b,c){var e=a.abs();if(!(0>=e.t)){var d=this.abs();if(d.t<
e.t)null!=b&&b.fromInt(0),null!=c&&this.copyTo(c);else{null==c&&(c=q());var g=q(),h=this.s;a=a.s;var l=this.DB-C(e[e.t-1]);0<l?(e.lShiftTo(l,g),d.lShiftTo(l,c)):(e.copyTo(g),d.copyTo(c));e=g.t;d=g[e-1];if(0!=d){var z=d*(1<<this.F1)+(1<e?g[e-2]>>this.F2:0),n=this.FV/z,z=(1<<this.F1)/z,U=1<<this.F2,m=c.t,p=m-e,s=null==b?q():b;g.dlShiftTo(p,s);0<=c.compareTo(s)&&(c[c.t++]=1,c.subTo(s,c));k.ONE.dlShiftTo(e,s);for(s.subTo(g,g);g.t<e;)g[g.t++]=0;for(;0<=--p;){var r=c[--m]==d?this.DM:Math.floor(c[m]*n+(c[m-
1]+U)*z);if((c[m]+=g.am(0,r,c,p,0,e))<r)for(g.dlShiftTo(p,s),c.subTo(s,c);c[m]<--r;)c.subTo(s,c)}null!=b&&(c.drShiftTo(e,b),h!=a&&k.ZERO.subTo(b,b));c.t=e;c.clamp();0<l&&c.rShiftTo(l,c);0>h&&k.ZERO.subTo(c,c)}}}};k.prototype.invDigit=function(){if(1>this.t)return 0;var a=this[0];if(0==(a&1))return 0;var b=a&3,b=b*(2-(a&15)*b)&15,b=b*(2-(a&255)*b)&255,b=b*(2-((a&65535)*b&65535))&65535,b=b*(2-a*b%this.DV)%this.DV;return 0<b?this.DV-b:-b};k.prototype.isEven=function(){return 0==(0<this.t?this[0]&1:this.s)};
k.prototype.exp=function(a,b){if(4294967295<a||1>a)return k.ONE;var c=q(),e=q(),d=b.convert(this),g=C(a)-1;for(d.copyTo(c);0<=--g;)if(b.sqrTo(c,e),0<(a&1<<g))b.mulTo(e,d,c);else var h=c,c=e,e=h;return b.revert(c)};k.prototype.toString=function(a){if(0>this.s)return"-"+this.negate().toString(a);if(16==a)a=4;else if(8==a)a=3;else if(2==a)a=1;else if(32==a)a=5;else if(4==a)a=2;else return this.toRadix(a);var b=(1<<a)-1,c,e=!1,d="",g=this.t,h=this.DB-g*this.DB%a;if(0<g--)for(h<this.DB&&0<(c=this[g]>>
h)&&(e=!0,d="0123456789abcdefghijklmnopqrstuvwxyz".charAt(c));0<=g;)h<a?(c=(this[g]&(1<<h)-1)<<a-h,c|=this[--g]>>(h+=this.DB-a)):(c=this[g]>>(h-=a)&b,0>=h&&(h+=this.DB,--g)),0<c&&(e=!0),e&&(d+="0123456789abcdefghijklmnopqrstuvwxyz".charAt(c));return e?d:"0"};k.prototype.negate=function(){var a=q();k.ZERO.subTo(this,a);return a};k.prototype.abs=function(){return 0>this.s?this.negate():this};k.prototype.compareTo=function(a){var b=this.s-a.s;if(0!=b)return b;var c=this.t,b=c-a.t;if(0!=b)return 0>this.s?
-b:b;for(;0<=--c;)if(0!=(b=this[c]-a[c]))return b;return 0};k.prototype.bitLength=function(){return 0>=this.t?0:this.DB*(this.t-1)+C(this[this.t-1]^this.s&this.DM)};k.prototype.mod=function(a){var b=q();this.abs().divRemTo(a,null,b);0>this.s&&0<b.compareTo(k.ZERO)&&a.subTo(b,b);return b};k.prototype.modPowInt=function(a,b){var c;c=256>a||b.isEven()?new x(b):new y(b);return this.exp(a,c)};k.ZERO=v(0);k.ONE=v(1);A.prototype.convert=O;A.prototype.revert=O;A.prototype.mulTo=function(a,b,c){a.multiplyTo(b,
c)};A.prototype.sqrTo=function(a,b){a.squareTo(b)};w.prototype.convert=function(a){if(0>a.s||a.t>2*this.m.t)return a.mod(this.m);if(0>a.compareTo(this.m))return a;var b=q();a.copyTo(b);this.reduce(b);return b};w.prototype.revert=function(a){return a};w.prototype.reduce=function(a){a.drShiftTo(this.m.t-1,this.r2);a.t>this.m.t+1&&(a.t=this.m.t+1,a.clamp());this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);for(this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);0>a.compareTo(this.r2);)a.dAddOffset(1,
this.m.t+1);for(a.subTo(this.r2,a);0<=a.compareTo(this.m);)a.subTo(this.m,a)};w.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};w.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};var t=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,
409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],V=67108864/t[t.length-1];k.prototype.chunkSize=function(a){return Math.floor(Math.LN2*this.DB/Math.log(a))};k.prototype.toRadix=function(a){null==
a&&(a=10);if(0==this.signum()||2>a||36<a)return"0";var b=this.chunkSize(a),b=Math.pow(a,b),c=v(b),e=q(),d=q(),g="";for(this.divRemTo(c,e,d);0<e.signum();)g=(b+d.intValue()).toString(a).substr(1)+g,e.divRemTo(c,e,d);return d.intValue().toString(a)+g};k.prototype.fromRadix=function(a,b){this.fromInt(0);null==b&&(b=10);for(var c=this.chunkSize(b),e=Math.pow(b,c),d=!1,g=0,h=0,l=0;l<a.length;++l){var z=L(a,l);0>z?"-"==a.charAt(l)&&0==this.signum()&&(d=!0):(h=b*h+z,++g>=c&&(this.dMultiply(e),this.dAddOffset(h,
0),h=g=0))}0<g&&(this.dMultiply(Math.pow(b,g)),this.dAddOffset(h,0));d&&k.ZERO.subTo(this,this)};k.prototype.fromNumber=function(a,b,c){if("number"==typeof b)if(2>a)this.fromInt(1);else for(this.fromNumber(a,c),this.testBit(a-1)||this.bitwiseTo(k.ONE.shiftLeft(a-1),I,this),this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(b);)this.dAddOffset(2,0),this.bitLength()>a&&this.subTo(k.ONE.shiftLeft(a-1),this);else{c=[];var e=a&7;c.length=(a>>3)+1;b.nextBytes(c);c[0]=0<e?c[0]&(1<<e)-1:0;this.fromString(c,
256)}};k.prototype.bitwiseTo=function(a,b,c){var e,d,g=Math.min(a.t,this.t);for(e=0;e<g;++e)c[e]=b(this[e],a[e]);if(a.t<this.t){d=a.s&this.DM;for(e=g;e<this.t;++e)c[e]=b(this[e],d);c.t=this.t}else{d=this.s&this.DM;for(e=g;e<a.t;++e)c[e]=b(d,a[e]);c.t=a.t}c.s=b(this.s,a.s);c.clamp()};k.prototype.changeBit=function(a,b){var c=k.ONE.shiftLeft(a);this.bitwiseTo(c,b,c);return c};k.prototype.addTo=function(a,b){for(var c=0,e=0,d=Math.min(a.t,this.t);c<d;)e+=this[c]+a[c],b[c++]=e&this.DM,e>>=this.DB;if(a.t<
this.t){for(e+=a.s;c<this.t;)e+=this[c],b[c++]=e&this.DM,e>>=this.DB;e+=this.s}else{for(e+=this.s;c<a.t;)e+=a[c],b[c++]=e&this.DM,e>>=this.DB;e+=a.s}b.s=0>e?-1:0;0<e?b[c++]=e:-1>e&&(b[c++]=this.DV+e);b.t=c;b.clamp()};k.prototype.dMultiply=function(a){this[this.t]=this.am(0,a-1,this,0,0,this.t);++this.t;this.clamp()};k.prototype.dAddOffset=function(a,b){if(0!=a){for(;this.t<=b;)this[this.t++]=0;for(this[b]+=a;this[b]>=this.DV;)this[b]-=this.DV,++b>=this.t&&(this[this.t++]=0),++this[b]}};k.prototype.multiplyLowerTo=
function(a,b,c){var e=Math.min(this.t+a.t,b);c.s=0;for(c.t=e;0<e;)c[--e]=0;var d;for(d=c.t-this.t;e<d;++e)c[e+this.t]=this.am(0,a[e],c,e,0,this.t);for(d=Math.min(a.t,b);e<d;++e)this.am(0,a[e],c,e,0,b-e);c.clamp()};k.prototype.multiplyUpperTo=function(a,b,c){--b;var e=c.t=this.t+a.t-b;for(c.s=0;0<=--e;)c[e]=0;for(e=Math.max(b-this.t,0);e<a.t;++e)c[this.t+e-b]=this.am(b-e,a[e],c,0,0,this.t+e-b);c.clamp();c.drShiftTo(1,c)};k.prototype.modInt=function(a){if(0>=a)return 0;var b=this.DV%a,c=0>this.s?a-
1:0;if(0<this.t)if(0==b)c=this[0]%a;else for(var e=this.t-1;0<=e;--e)c=(b*c+this[e])%a;return c};k.prototype.millerRabin=function(a){var b=this.subtract(k.ONE),c=b.getLowestSetBit();if(0>=c)return!1;var e=b.shiftRight(c);a=a+1>>1;a>t.length&&(a=t.length);for(var d=q(),g=0;g<a;++g){d.fromInt(t[Math.floor(Math.random()*t.length)]);var h=d.modPow(e,this);if(0!=h.compareTo(k.ONE)&&0!=h.compareTo(b)){for(var l=1;l++<c&&0!=h.compareTo(b);)if(h=h.modPowInt(2,this),0==h.compareTo(k.ONE))return!1;if(0!=h.compareTo(b))return!1}}return!0};
k.prototype.clone=function(){var a=q();this.copyTo(a);return a};k.prototype.intValue=function(){if(0>this.s){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]};k.prototype.byteValue=function(){return 0==this.t?this.s:this[0]<<24>>24};k.prototype.shortValue=function(){return 0==this.t?this.s:this[0]<<16>>16};k.prototype.signum=function(){return 0>this.s?-1:0>=this.t||1==this.t&&0>=this[0]?
0:1};k.prototype.toByteArray=function(){var a=this.t,b=[];b[0]=this.s;var c=this.DB-a*this.DB%8,e,d=0;if(0<a--)for(c<this.DB&&(e=this[a]>>c)!=(this.s&this.DM)>>c&&(b[d++]=e|this.s<<this.DB-c);0<=a;)if(8>c?(e=(this[a]&(1<<c)-1)<<8-c,e|=this[--a]>>(c+=this.DB-8)):(e=this[a]>>(c-=8)&255,0>=c&&(c+=this.DB,--a)),0!=(e&128)&&(e|=-256),0==d&&(this.s&128)!=(e&128)&&++d,0<d||e!=this.s)b[d++]=e;return b};k.prototype.equals=function(a){return 0==this.compareTo(a)};k.prototype.min=function(a){return 0>this.compareTo(a)?
this:a};k.prototype.max=function(a){return 0<this.compareTo(a)?this:a};k.prototype.and=function(a){var b=q();this.bitwiseTo(a,T,b);return b};k.prototype.or=function(a){var b=q();this.bitwiseTo(a,I,b);return b};k.prototype.xor=function(a){var b=q();this.bitwiseTo(a,M,b);return b};k.prototype.andNot=function(a){var b=q();this.bitwiseTo(a,N,b);return b};k.prototype.not=function(){for(var a=q(),b=0;b<this.t;++b)a[b]=this.DM&~this[b];a.t=this.t;a.s=~this.s;return a};k.prototype.shiftLeft=function(a){var b=
q();0>a?this.rShiftTo(-a,b):this.lShiftTo(a,b);return b};k.prototype.shiftRight=function(a){var b=q();0>a?this.lShiftTo(-a,b):this.rShiftTo(a,b);return b};k.prototype.getLowestSetBit=function(){for(var a=0;a<this.t;++a)if(0!=this[a]){var b=a*this.DB;a=this[a];if(0==a)a=-1;else{var c=0;0==(a&65535)&&(a>>=16,c+=16);0==(a&255)&&(a>>=8,c+=8);0==(a&15)&&(a>>=4,c+=4);0==(a&3)&&(a>>=2,c+=2);0==(a&1)&&++c;a=c}return b+a}return 0>this.s?this.t*this.DB:-1};k.prototype.bitCount=function(){for(var a=0,b=this.s&
this.DM,c=0;c<this.t;++c){for(var e=this[c]^b,d=0;0!=e;)e&=e-1,++d;a+=d}return a};k.prototype.testBit=function(a){var b=Math.floor(a/this.DB);return b>=this.t?0!=this.s:0!=(this[b]&1<<a%this.DB)};k.prototype.setBit=function(a){return this.changeBit(a,I)};k.prototype.clearBit=function(a){return this.changeBit(a,N)};k.prototype.flipBit=function(a){return this.changeBit(a,M)};k.prototype.add=function(a){var b=q();this.addTo(a,b);return b};k.prototype.subtract=function(a){var b=q();this.subTo(a,b);return b};
k.prototype.multiply=function(a){var b=q();this.multiplyTo(a,b);return b};k.prototype.divide=function(a){var b=q();this.divRemTo(a,b,null);return b};k.prototype.remainder=function(a){var b=q();this.divRemTo(a,null,b);return b};k.prototype.divideAndRemainder=function(a){var b=q(),c=q();this.divRemTo(a,b,c);return[b,c]};k.prototype.modPow=function(a,b){var c=a.bitLength(),e,d=v(1),g;if(0>=c)return d;e=18>c?1:48>c?3:144>c?4:768>c?5:6;g=8>c?new x(b):b.isEven()?new w(b):new y(b);var h=[],l=3,k=e-1,n=(1<<
e)-1;h[1]=g.convert(this);if(1<e)for(c=q(),g.sqrTo(h[1],c);l<=n;)h[l]=q(),g.mulTo(c,h[l-2],h[l]),l+=2;for(var m=a.t-1,p,r=!0,s=q(),c=C(a[m])-1;0<=m;){c>=k?p=a[m]>>c-k&n:(p=(a[m]&(1<<c+1)-1)<<k-c,0<m&&(p|=a[m-1]>>this.DB+c-k));for(l=e;0==(p&1);)p>>=1,--l;0>(c-=l)&&(c+=this.DB,--m);if(r)h[p].copyTo(d),r=!1;else{for(;1<l;)g.sqrTo(d,s),g.sqrTo(s,d),l-=2;0<l?g.sqrTo(d,s):(l=d,d=s,s=l);g.mulTo(s,h[p],d)}for(;0<=m&&0==(a[m]&1<<c);)g.sqrTo(d,s),l=d,d=s,s=l,0>--c&&(c=this.DB-1,--m)}return g.revert(d)};k.prototype.modInverse=
function(a){var b=a.isEven();if(this.isEven()&&b||0==a.signum())return k.ZERO;for(var c=a.clone(),e=this.clone(),d=v(1),g=v(0),h=v(0),l=v(1);0!=c.signum();){for(;c.isEven();)c.rShiftTo(1,c),b?(d.isEven()&&g.isEven()||(d.addTo(this,d),g.subTo(a,g)),d.rShiftTo(1,d)):g.isEven()||g.subTo(a,g),g.rShiftTo(1,g);for(;e.isEven();)e.rShiftTo(1,e),b?(h.isEven()&&l.isEven()||(h.addTo(this,h),l.subTo(a,l)),h.rShiftTo(1,h)):l.isEven()||l.subTo(a,l),l.rShiftTo(1,l);0<=c.compareTo(e)?(c.subTo(e,c),b&&d.subTo(h,d),
g.subTo(l,g)):(e.subTo(c,e),b&&h.subTo(d,h),l.subTo(g,l))}if(0!=e.compareTo(k.ONE))return k.ZERO;if(0<=l.compareTo(a))return l.subtract(a);if(0>l.signum())l.addTo(a,l);else return l;return 0>l.signum()?l.add(a):l};k.prototype.pow=function(a){return this.exp(a,new A)};k.prototype.gcd=function(a){var b=0>this.s?this.negate():this.clone();a=0>a.s?a.negate():a.clone();if(0>b.compareTo(a)){var c=b,b=a;a=c}var c=b.getLowestSetBit(),e=a.getLowestSetBit();if(0>e)return b;c<e&&(e=c);0<e&&(b.rShiftTo(e,b),
a.rShiftTo(e,a));for(;0<b.signum();)0<(c=b.getLowestSetBit())&&b.rShiftTo(c,b),0<(c=a.getLowestSetBit())&&a.rShiftTo(c,a),0<=b.compareTo(a)?(b.subTo(a,b),b.rShiftTo(1,b)):(a.subTo(b,a),a.rShiftTo(1,a));0<e&&a.lShiftTo(e,a);return a};k.prototype.isProbablePrime=function(a){var b,c=this.abs();if(1==c.t&&c[0]<=t[t.length-1]){for(b=0;b<t.length;++b)if(c[0]==t[b])return!0;return!1}if(c.isEven())return!1;for(b=1;b<t.length;){for(var e=t[b],d=b+1;d<t.length&&e<V;)e*=t[d++];for(e=c.modInt(e);b<d;)if(0==e%
t[b++])return!1}return c.millerRabin(a)};k.prototype.square=function(){var a=q();this.squareTo(a);return a};var m=k;m.prototype.IsNegative=function(){return-1==this.compareTo(m.ZERO)?!0:!1};m.op_Equality=function(a,b){return 0==a.compareTo(b)?!0:!1};m.op_Inequality=function(a,b){return 0!=a.compareTo(b)?!0:!1};m.op_GreaterThan=function(a,b){return 0<a.compareTo(b)?!0:!1};m.op_LessThan=function(a,b){return 0>a.compareTo(b)?!0:!1};m.op_Addition=function(a,b){return(new m(a)).add(new m(b))};m.op_Subtraction=
function(a,b){return(new m(a)).subtract(new m(b))};m.Int128Mul=function(a,b){return(new m(a)).multiply(new m(b))};m.op_Division=function(a,b){return a.divide(b)};m.prototype.ToDouble=function(){return parseFloat(this.toString())};if("undefined"==typeof K)var K=function(a,b){var c;if("undefined"==typeof Object.getOwnPropertyNames)for(c in b.prototype){if("undefined"==typeof a.prototype[c]||a.prototype[c]==Object.prototype[c])a.prototype[c]=b.prototype[c]}else for(var e=Object.getOwnPropertyNames(b.prototype),
d=0;d<e.length;d++)"undefined"==typeof Object.getOwnPropertyDescriptor(a.prototype,e[d])&&Object.defineProperty(a.prototype,e[d],Object.getOwnPropertyDescriptor(b.prototype,e[d]));for(c in b)"undefined"==typeof a[c]&&(a[c]=b[c]);a.$baseCtor=b};d.Path=function(){return[]};d.Paths=function(){return[]};d.DoublePoint=function(){var a=arguments;this.Y=this.X=0;1==a.length?(this.X=a[0].X,this.Y=a[0].Y):2==a.length&&(this.X=a[0],this.Y=a[1])};d.DoublePoint0=function(){this.Y=this.X=0};d.DoublePoint1=function(a){this.X=
a.X;this.Y=a.Y};d.DoublePoint2=function(a,b){this.X=a;this.Y=b};d.PolyNode=function(){this.m_Parent=null;this.m_polygon=new d.Path;this.m_endtype=this.m_jointype=this.m_Index=0;this.m_Childs=[];this.IsOpen=!1};d.PolyNode.prototype.IsHoleNode=function(){for(var a=!0,b=this.m_Parent;null!==b;)a=!a,b=b.m_Parent;return a};d.PolyNode.prototype.ChildCount=function(){return this.m_Childs.length};d.PolyNode.prototype.Contour=function(){return this.m_polygon};d.PolyNode.prototype.AddChild=function(a){var b=
this.m_Childs.length;this.m_Childs.push(a);a.m_Parent=this;a.m_Index=b};d.PolyNode.prototype.GetNext=function(){return 0<this.m_Childs.length?this.m_Childs[0]:this.GetNextSiblingUp()};d.PolyNode.prototype.GetNextSiblingUp=function(){return null===this.m_Parent?null:this.m_Index==this.m_Parent.m_Childs.length-1?this.m_Parent.GetNextSiblingUp():this.m_Parent.m_Childs[this.m_Index+1]};d.PolyNode.prototype.Childs=function(){return this.m_Childs};d.PolyNode.prototype.Parent=function(){return this.m_Parent};
d.PolyNode.prototype.IsHole=function(){return this.IsHoleNode()};d.PolyTree=function(){this.m_AllPolys=[];d.PolyNode.call(this)};d.PolyTree.prototype.Clear=function(){for(var a=0,b=this.m_AllPolys.length;a<b;a++)this.m_AllPolys[a]=null;this.m_AllPolys.length=0;this.m_Childs.length=0};d.PolyTree.prototype.GetFirst=function(){return 0<this.m_Childs.length?this.m_Childs[0]:null};d.PolyTree.prototype.Total=function(){return this.m_AllPolys.length};K(d.PolyTree,d.PolyNode);d.Math_Abs_Int64=d.Math_Abs_Int32=
d.Math_Abs_Double=function(a){return Math.abs(a)};d.Math_Max_Int32_Int32=function(a,b){return Math.max(a,b)};d.Cast_Int32=p||G||J?function(a){return a|0}:function(a){return~~a};d.Cast_Int64=E?function(a){return-2147483648>a||2147483647<a?0>a?Math.ceil(a):Math.floor(a):~~a}:F&&"function"==typeof Number.toInteger?function(a){return Number.toInteger(a)}:P||H?function(a){return parseInt(a,10)}:p?function(a){return-2147483648>a||2147483647<a?0>a?Math.ceil(a):Math.floor(a):a|0}:function(a){return 0>a?Math.ceil(a):
Math.floor(a)};d.Clear=function(a){a.length=0};d.PI=3.141592653589793;d.PI2=6.283185307179586;d.IntPoint=function(){var a;a=arguments;var b=a.length;this.Y=this.X=0;2==b?(this.X=a[0],this.Y=a[1]):1==b?a[0]instanceof d.DoublePoint?(a=a[0],this.X=d.Clipper.Round(a.X),this.Y=d.Clipper.Round(a.Y)):(a=a[0],this.X=a.X,this.Y=a.Y):this.Y=this.X=0};d.IntPoint.op_Equality=function(a,b){return a.X==b.X&&a.Y==b.Y};d.IntPoint.op_Inequality=function(a,b){return a.X!=b.X||a.Y!=b.Y};d.IntPoint0=function(){this.Y=
this.X=0};d.IntPoint1=function(a){this.X=a.X;this.Y=a.Y};d.IntPoint1dp=function(a){this.X=d.Clipper.Round(a.X);this.Y=d.Clipper.Round(a.Y)};d.IntPoint2=function(a,b){this.X=a;this.Y=b};d.IntRect=function(){var a=arguments,b=a.length;4==b?(this.left=a[0],this.top=a[1],this.right=a[2],this.bottom=a[3]):1==b?(this.left=ir.left,this.top=ir.top,this.right=ir.right,this.bottom=ir.bottom):this.bottom=this.right=this.top=this.left=0};d.IntRect0=function(){this.bottom=this.right=this.top=this.left=0};d.IntRect1=
function(a){this.left=a.left;this.top=a.top;this.right=a.right;this.bottom=a.bottom};d.IntRect4=function(a,b,c,e){this.left=a;this.top=b;this.right=c;this.bottom=e};d.ClipType={ctIntersection:0,ctUnion:1,ctDifference:2,ctXor:3};d.PolyType={ptSubject:0,ptClip:1};d.PolyFillType={pftEvenOdd:0,pftNonZero:1,pftPositive:2,pftNegative:3};d.JoinType={jtSquare:0,jtRound:1,jtMiter:2};d.EndType={etOpenSquare:0,etOpenRound:1,etOpenButt:2,etClosedLine:3,etClosedPolygon:4};d.EdgeSide={esLeft:0,esRight:1};d.Direction=
{dRightToLeft:0,dLeftToRight:1};d.TEdge=function(){this.Bot=new d.IntPoint;this.Curr=new d.IntPoint;this.Top=new d.IntPoint;this.Delta=new d.IntPoint;this.Dx=0;this.PolyTyp=d.PolyType.ptSubject;this.Side=d.EdgeSide.esLeft;this.OutIdx=this.WindCnt2=this.WindCnt=this.WindDelta=0;this.PrevInSEL=this.NextInSEL=this.PrevInAEL=this.NextInAEL=this.NextInLML=this.Prev=this.Next=null};d.IntersectNode=function(){this.Edge2=this.Edge1=null;this.Pt=new d.IntPoint};d.MyIntersectNodeSort=function(){};d.MyIntersectNodeSort.Compare=
function(a,b){return b.Pt.Y-a.Pt.Y};d.LocalMinima=function(){this.Y=0;this.Next=this.RightBound=this.LeftBound=null};d.Scanbeam=function(){this.Y=0;this.Next=null};d.OutRec=function(){this.Idx=0;this.IsOpen=this.IsHole=!1;this.PolyNode=this.BottomPt=this.Pts=this.FirstLeft=null};d.OutPt=function(){this.Idx=0;this.Pt=new d.IntPoint;this.Prev=this.Next=null};d.Join=function(){this.OutPt2=this.OutPt1=null;this.OffPt=new d.IntPoint};d.ClipperBase=function(){this.m_CurrentLM=this.m_MinimaList=null;this.m_edges=
[];this.PreserveCollinear=this.m_HasOpenPaths=this.m_UseFullRange=!1;this.m_CurrentLM=this.m_MinimaList=null;this.m_HasOpenPaths=this.m_UseFullRange=!1};d.ClipperBase.horizontal=-9007199254740992;d.ClipperBase.Skip=-2;d.ClipperBase.Unassigned=-1;d.ClipperBase.tolerance=1E-20;d.ClipperBase.loRange=47453132;d.ClipperBase.hiRange=0xfffffffffffff;d.ClipperBase.near_zero=function(a){return a>-d.ClipperBase.tolerance&&a<d.ClipperBase.tolerance};d.ClipperBase.IsHorizontal=function(a){return 0===a.Delta.Y};
d.ClipperBase.prototype.PointIsVertex=function(a,b){var c=b;do{if(d.IntPoint.op_Equality(c.Pt,a))return!0;c=c.Next}while(c!=b);return!1};d.ClipperBase.prototype.PointOnLineSegment=function(a,b,c,e){return e?a.X==b.X&&a.Y==b.Y||a.X==c.X&&a.Y==c.Y||a.X>b.X==a.X<c.X&&a.Y>b.Y==a.Y<c.Y&&m.op_Equality(m.Int128Mul(a.X-b.X,c.Y-b.Y),m.Int128Mul(c.X-b.X,a.Y-b.Y)):a.X==b.X&&a.Y==b.Y||a.X==c.X&&a.Y==c.Y||a.X>b.X==a.X<c.X&&a.Y>b.Y==a.Y<c.Y&&(a.X-b.X)*(c.Y-b.Y)==(c.X-b.X)*(a.Y-b.Y)};d.ClipperBase.prototype.PointOnPolygon=
function(a,b,c){for(var e=b;;){if(this.PointOnLineSegment(a,e.Pt,e.Next.Pt,c))return!0;e=e.Next;if(e==b)break}return!1};d.ClipperBase.prototype.SlopesEqual=d.ClipperBase.SlopesEqual=function(){var a=arguments,b=a.length,c,e,f;if(3==b)return b=a[0],c=a[1],(a=a[2])?m.op_Equality(m.Int128Mul(b.Delta.Y,c.Delta.X),m.Int128Mul(b.Delta.X,c.Delta.Y)):d.Cast_Int64(b.Delta.Y*c.Delta.X)==d.Cast_Int64(b.Delta.X*c.Delta.Y);if(4==b)return b=a[0],c=a[1],e=a[2],(a=a[3])?m.op_Equality(m.Int128Mul(b.Y-c.Y,c.X-e.X),
m.Int128Mul(b.X-c.X,c.Y-e.Y)):0===d.Cast_Int64((b.Y-c.Y)*(c.X-e.X))-d.Cast_Int64((b.X-c.X)*(c.Y-e.Y));b=a[0];c=a[1];e=a[2];f=a[3];return(a=a[4])?m.op_Equality(m.Int128Mul(b.Y-c.Y,e.X-f.X),m.Int128Mul(b.X-c.X,e.Y-f.Y)):0===d.Cast_Int64((b.Y-c.Y)*(e.X-f.X))-d.Cast_Int64((b.X-c.X)*(e.Y-f.Y))};d.ClipperBase.SlopesEqual3=function(a,b,c){return c?m.op_Equality(m.Int128Mul(a.Delta.Y,b.Delta.X),m.Int128Mul(a.Delta.X,b.Delta.Y)):d.Cast_Int64(a.Delta.Y*b.Delta.X)==d.Cast_Int64(a.Delta.X*b.Delta.Y)};d.ClipperBase.SlopesEqual4=
function(a,b,c,e){return e?m.op_Equality(m.Int128Mul(a.Y-b.Y,b.X-c.X),m.Int128Mul(a.X-b.X,b.Y-c.Y)):0===d.Cast_Int64((a.Y-b.Y)*(b.X-c.X))-d.Cast_Int64((a.X-b.X)*(b.Y-c.Y))};d.ClipperBase.SlopesEqual5=function(a,b,c,e,f){return f?m.op_Equality(m.Int128Mul(a.Y-b.Y,c.X-e.X),m.Int128Mul(a.X-b.X,c.Y-e.Y)):0===d.Cast_Int64((a.Y-b.Y)*(c.X-e.X))-d.Cast_Int64((a.X-b.X)*(c.Y-e.Y))};d.ClipperBase.prototype.Clear=function(){this.DisposeLocalMinimaList();for(var a=0,b=this.m_edges.length;a<b;++a){for(var c=0,
e=this.m_edges[a].length;c<e;++c)this.m_edges[a][c]=null;d.Clear(this.m_edges[a])}d.Clear(this.m_edges);this.m_HasOpenPaths=this.m_UseFullRange=!1};d.ClipperBase.prototype.DisposeLocalMinimaList=function(){for(;null!==this.m_MinimaList;){var a=this.m_MinimaList.Next;this.m_MinimaList=null;this.m_MinimaList=a}this.m_CurrentLM=null};d.ClipperBase.prototype.RangeTest=function(a,b){if(b.Value)(a.X>d.ClipperBase.hiRange||a.Y>d.ClipperBase.hiRange||-a.X>d.ClipperBase.hiRange||-a.Y>d.ClipperBase.hiRange)&&
d.Error("Coordinate outside allowed range in RangeTest().");else if(a.X>d.ClipperBase.loRange||a.Y>d.ClipperBase.loRange||-a.X>d.ClipperBase.loRange||-a.Y>d.ClipperBase.loRange)b.Value=!0,this.RangeTest(a,b)};d.ClipperBase.prototype.InitEdge=function(a,b,c,e){a.Next=b;a.Prev=c;a.Curr.X=e.X;a.Curr.Y=e.Y;a.OutIdx=-1};d.ClipperBase.prototype.InitEdge2=function(a,b){a.Curr.Y>=a.Next.Curr.Y?(a.Bot.X=a.Curr.X,a.Bot.Y=a.Curr.Y,a.Top.X=a.Next.Curr.X,a.Top.Y=a.Next.Curr.Y):(a.Top.X=a.Curr.X,a.Top.Y=a.Curr.Y,
a.Bot.X=a.Next.Curr.X,a.Bot.Y=a.Next.Curr.Y);this.SetDx(a);a.PolyTyp=b};d.ClipperBase.prototype.FindNextLocMin=function(a){for(var b;;){for(;d.IntPoint.op_Inequality(a.Bot,a.Prev.Bot)||d.IntPoint.op_Equality(a.Curr,a.Top);)a=a.Next;if(a.Dx!=d.ClipperBase.horizontal&&a.Prev.Dx!=d.ClipperBase.horizontal)break;for(;a.Prev.Dx==d.ClipperBase.horizontal;)a=a.Prev;for(b=a;a.Dx==d.ClipperBase.horizontal;)a=a.Next;if(a.Top.Y!=a.Prev.Bot.Y){b.Prev.Bot.X<a.Bot.X&&(a=b);break}}return a};d.ClipperBase.prototype.ProcessBound=
function(a,b){var c=a,e=a,f;a.Dx==d.ClipperBase.horizontal&&(f=b?a.Prev.Bot.X:a.Next.Bot.X,a.Bot.X!=f&&this.ReverseHorizontal(a));if(e.OutIdx!=d.ClipperBase.Skip)if(b){for(;e.Top.Y==e.Next.Bot.Y&&e.Next.OutIdx!=d.ClipperBase.Skip;)e=e.Next;if(e.Dx==d.ClipperBase.horizontal&&e.Next.OutIdx!=d.ClipperBase.Skip){for(f=e;f.Prev.Dx==d.ClipperBase.horizontal;)f=f.Prev;f.Prev.Top.X==e.Next.Top.X?b||(e=f.Prev):f.Prev.Top.X>e.Next.Top.X&&(e=f.Prev)}for(;a!=e;)a.NextInLML=a.Next,a.Dx==d.ClipperBase.horizontal&&
a!=c&&a.Bot.X!=a.Prev.Top.X&&this.ReverseHorizontal(a),a=a.Next;a.Dx==d.ClipperBase.horizontal&&a!=c&&a.Bot.X!=a.Prev.Top.X&&this.ReverseHorizontal(a);e=e.Next}else{for(;e.Top.Y==e.Prev.Bot.Y&&e.Prev.OutIdx!=d.ClipperBase.Skip;)e=e.Prev;if(e.Dx==d.ClipperBase.horizontal&&e.Prev.OutIdx!=d.ClipperBase.Skip){for(f=e;f.Next.Dx==d.ClipperBase.horizontal;)f=f.Next;f.Next.Top.X==e.Prev.Top.X?b||(e=f.Next):f.Next.Top.X>e.Prev.Top.X&&(e=f.Next)}for(;a!=e;)a.NextInLML=a.Prev,a.Dx==d.ClipperBase.horizontal&&
a!=c&&a.Bot.X!=a.Next.Top.X&&this.ReverseHorizontal(a),a=a.Prev;a.Dx==d.ClipperBase.horizontal&&a!=c&&a.Bot.X!=a.Next.Top.X&&this.ReverseHorizontal(a);e=e.Prev}if(e.OutIdx==d.ClipperBase.Skip){a=e;if(b){for(;a.Top.Y==a.Next.Bot.Y;)a=a.Next;for(;a!=e&&a.Dx==d.ClipperBase.horizontal;)a=a.Prev}else{for(;a.Top.Y==a.Prev.Bot.Y;)a=a.Prev;for(;a!=e&&a.Dx==d.ClipperBase.horizontal;)a=a.Next}a==e?e=b?a.Next:a.Prev:(a=b?e.Next:e.Prev,c=new d.LocalMinima,c.Next=null,c.Y=a.Bot.Y,c.LeftBound=null,c.RightBound=
a,c.RightBound.WindDelta=0,e=this.ProcessBound(c.RightBound,b),this.InsertLocalMinima(c))}return e};d.ClipperBase.prototype.AddPath=function(a,b,c){c||b!=d.PolyType.ptClip||d.Error("AddPath: Open paths must be subject.");var e=a.length-1;if(c)for(;0<e&&d.IntPoint.op_Equality(a[e],a[0]);)--e;for(;0<e&&d.IntPoint.op_Equality(a[e],a[e-1]);)--e;if(c&&2>e||!c&&1>e)return!1;for(var f=[],g=0;g<=e;g++)f.push(new d.TEdge);var h=!0;f[1].Curr.X=a[1].X;f[1].Curr.Y=a[1].Y;var l={Value:this.m_UseFullRange};this.RangeTest(a[0],
l);this.m_UseFullRange=l.Value;l.Value=this.m_UseFullRange;this.RangeTest(a[e],l);this.m_UseFullRange=l.Value;this.InitEdge(f[0],f[1],f[e],a[0]);this.InitEdge(f[e],f[0],f[e-1],a[e]);for(g=e-1;1<=g;--g)l.Value=this.m_UseFullRange,this.RangeTest(a[g],l),this.m_UseFullRange=l.Value,this.InitEdge(f[g],f[g+1],f[g-1],a[g]);for(g=a=e=f[0];;)if(d.IntPoint.op_Equality(a.Curr,a.Next.Curr)){if(a==a.Next)break;a==e&&(e=a.Next);g=a=this.RemoveEdge(a)}else{if(a.Prev==a.Next)break;else if(c&&d.ClipperBase.SlopesEqual(a.Prev.Curr,
a.Curr,a.Next.Curr,this.m_UseFullRange)&&(!this.PreserveCollinear||!this.Pt2IsBetweenPt1AndPt3(a.Prev.Curr,a.Curr,a.Next.Curr))){a==e&&(e=a.Next);a=this.RemoveEdge(a);g=a=a.Prev;continue}a=a.Next;if(a==g)break}if(!c&&a==a.Next||c&&a.Prev==a.Next)return!1;c||(this.m_HasOpenPaths=!0,e.Prev.OutIdx=d.ClipperBase.Skip);a=e;do this.InitEdge2(a,b),a=a.Next,h&&a.Curr.Y!=e.Curr.Y&&(h=!1);while(a!=e);if(h){if(c)return!1;a.Prev.OutIdx=d.ClipperBase.Skip;a.Prev.Bot.X<a.Prev.Top.X&&this.ReverseHorizontal(a.Prev);
b=new d.LocalMinima;b.Next=null;b.Y=a.Bot.Y;b.LeftBound=null;b.RightBound=a;b.RightBound.Side=d.EdgeSide.esRight;for(b.RightBound.WindDelta=0;a.Next.OutIdx!=d.ClipperBase.Skip;)a.NextInLML=a.Next,a.Bot.X!=a.Prev.Top.X&&this.ReverseHorizontal(a),a=a.Next;this.InsertLocalMinima(b);this.m_edges.push(f);return!0}this.m_edges.push(f);for(h=null;;){a=this.FindNextLocMin(a);if(a==h)break;else null==h&&(h=a);b=new d.LocalMinima;b.Next=null;b.Y=a.Bot.Y;a.Dx<a.Prev.Dx?(b.LeftBound=a.Prev,b.RightBound=a,f=!1):
(b.LeftBound=a,b.RightBound=a.Prev,f=!0);b.LeftBound.Side=d.EdgeSide.esLeft;b.RightBound.Side=d.EdgeSide.esRight;b.LeftBound.WindDelta=c?b.LeftBound.Next==b.RightBound?-1:1:0;b.RightBound.WindDelta=-b.LeftBound.WindDelta;a=this.ProcessBound(b.LeftBound,f);e=this.ProcessBound(b.RightBound,!f);b.LeftBound.OutIdx==d.ClipperBase.Skip?b.LeftBound=null:b.RightBound.OutIdx==d.ClipperBase.Skip&&(b.RightBound=null);this.InsertLocalMinima(b);f||(a=e)}return!0};d.ClipperBase.prototype.AddPaths=function(a,b,
c){for(var e=!1,d=0,g=a.length;d<g;++d)this.AddPath(a[d],b,c)&&(e=!0);return e};d.ClipperBase.prototype.Pt2IsBetweenPt1AndPt3=function(a,b,c){return d.IntPoint.op_Equality(a,c)||d.IntPoint.op_Equality(a,b)||d.IntPoint.op_Equality(c,b)?!1:a.X!=c.X?b.X>a.X==b.X<c.X:b.Y>a.Y==b.Y<c.Y};d.ClipperBase.prototype.RemoveEdge=function(a){a.Prev.Next=a.Next;a.Next.Prev=a.Prev;var b=a.Next;a.Prev=null;return b};d.ClipperBase.prototype.SetDx=function(a){a.Delta.X=a.Top.X-a.Bot.X;a.Delta.Y=a.Top.Y-a.Bot.Y;a.Dx=
0===a.Delta.Y?d.ClipperBase.horizontal:a.Delta.X/a.Delta.Y};d.ClipperBase.prototype.InsertLocalMinima=function(a){if(null===this.m_MinimaList)this.m_MinimaList=a;else if(a.Y>=this.m_MinimaList.Y)a.Next=this.m_MinimaList,this.m_MinimaList=a;else{for(var b=this.m_MinimaList;null!==b.Next&&a.Y<b.Next.Y;)b=b.Next;a.Next=b.Next;b.Next=a}};d.ClipperBase.prototype.PopLocalMinima=function(){null!==this.m_CurrentLM&&(this.m_CurrentLM=this.m_CurrentLM.Next)};d.ClipperBase.prototype.ReverseHorizontal=function(a){var b=
a.Top.X;a.Top.X=a.Bot.X;a.Bot.X=b};d.ClipperBase.prototype.Reset=function(){this.m_CurrentLM=this.m_MinimaList;if(null!=this.m_CurrentLM)for(var a=this.m_MinimaList;null!=a;){var b=a.LeftBound;null!=b&&(b.Curr.X=b.Bot.X,b.Curr.Y=b.Bot.Y,b.Side=d.EdgeSide.esLeft,b.OutIdx=d.ClipperBase.Unassigned);b=a.RightBound;null!=b&&(b.Curr.X=b.Bot.X,b.Curr.Y=b.Bot.Y,b.Side=d.EdgeSide.esRight,b.OutIdx=d.ClipperBase.Unassigned);a=a.Next}};d.Clipper=function(a){"undefined"==typeof a&&(a=0);this.m_PolyOuts=null;this.m_ClipType=
d.ClipType.ctIntersection;this.m_IntersectNodeComparer=this.m_IntersectList=this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;this.m_ExecuteLocked=!1;this.m_SubjFillType=this.m_ClipFillType=d.PolyFillType.pftEvenOdd;this.m_GhostJoins=this.m_Joins=null;this.StrictlySimple=this.ReverseSolution=this.m_UsingPolyTree=!1;d.ClipperBase.call(this);this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;this.m_IntersectList=[];this.m_IntersectNodeComparer=d.MyIntersectNodeSort.Compare;this.m_UsingPolyTree=
this.m_ExecuteLocked=!1;this.m_PolyOuts=[];this.m_Joins=[];this.m_GhostJoins=[];this.ReverseSolution=0!==(1&a);this.StrictlySimple=0!==(2&a);this.PreserveCollinear=0!==(4&a)};d.Clipper.ioReverseSolution=1;d.Clipper.ioStrictlySimple=2;d.Clipper.ioPreserveCollinear=4;d.Clipper.prototype.Clear=function(){0!==this.m_edges.length&&(this.DisposeAllPolyPts(),d.ClipperBase.prototype.Clear.call(this))};d.Clipper.prototype.DisposeScanbeamList=function(){for(;null!==this.m_Scanbeam;){var a=this.m_Scanbeam.Next;
this.m_Scanbeam=null;this.m_Scanbeam=a}};d.Clipper.prototype.Reset=function(){d.ClipperBase.prototype.Reset.call(this);this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;for(var a=this.m_MinimaList;null!==a;)this.InsertScanbeam(a.Y),a=a.Next};d.Clipper.prototype.InsertScanbeam=function(a){if(null===this.m_Scanbeam)this.m_Scanbeam=new d.Scanbeam,this.m_Scanbeam.Next=null,this.m_Scanbeam.Y=a;else if(a>this.m_Scanbeam.Y){var b=new d.Scanbeam;b.Y=a;b.Next=this.m_Scanbeam;this.m_Scanbeam=b}else{for(var c=
this.m_Scanbeam;null!==c.Next&&a<=c.Next.Y;)c=c.Next;a!=c.Y&&(b=new d.Scanbeam,b.Y=a,b.Next=c.Next,c.Next=b)}};d.Clipper.prototype.Execute=function(){var a=arguments,b=a.length,c=a[1]instanceof d.PolyTree;if(4!=b||c){if(4==b&&c){var b=a[0],e=a[1],c=a[2],a=a[3];if(this.m_ExecuteLocked)return!1;this.m_ExecuteLocked=!0;this.m_SubjFillType=c;this.m_ClipFillType=a;this.m_ClipType=b;this.m_UsingPolyTree=!0;try{(f=this.ExecuteInternal())&&this.BuildResult2(e)}finally{this.DisposeAllPolyPts(),this.m_ExecuteLocked=
!1}return f}if(2==b&&!c||2==b&&c)return b=a[0],e=a[1],this.Execute(b,e,d.PolyFillType.pftEvenOdd,d.PolyFillType.pftEvenOdd)}else{b=a[0];e=a[1];c=a[2];a=a[3];if(this.m_ExecuteLocked)return!1;this.m_HasOpenPaths&&d.Error("Error: PolyTree struct is need for open path clipping.");this.m_ExecuteLocked=!0;d.Clear(e);this.m_SubjFillType=c;this.m_ClipFillType=a;this.m_ClipType=b;this.m_UsingPolyTree=!1;try{var f=this.ExecuteInternal();f&&this.BuildResult(e)}finally{this.DisposeAllPolyPts(),this.m_ExecuteLocked=
!1}return f}};d.Clipper.prototype.FixHoleLinkage=function(a){if(null!==a.FirstLeft&&(a.IsHole==a.FirstLeft.IsHole||null===a.FirstLeft.Pts)){for(var b=a.FirstLeft;null!==b&&(b.IsHole==a.IsHole||null===b.Pts);)b=b.FirstLeft;a.FirstLeft=b}};d.Clipper.prototype.ExecuteInternal=function(){try{this.Reset();if(null===this.m_CurrentLM)return!1;var a=this.PopScanbeam();do{this.InsertLocalMinimaIntoAEL(a);d.Clear(this.m_GhostJoins);this.ProcessHorizontals(!1);if(null===this.m_Scanbeam)break;var b=this.PopScanbeam();
if(!this.ProcessIntersections(a,b))return!1;this.ProcessEdgesAtTopOfScanbeam(b);a=b}while(null!==this.m_Scanbeam||null!==this.m_CurrentLM);for(var a=0,c=this.m_PolyOuts.length;a<c;a++){var e=this.m_PolyOuts[a];null===e.Pts||e.IsOpen||(e.IsHole^this.ReverseSolution)==0<this.Area(e)&&this.ReversePolyPtLinks(e.Pts)}this.JoinCommonEdges();a=0;for(c=this.m_PolyOuts.length;a<c;a++)e=this.m_PolyOuts[a],null===e.Pts||e.IsOpen||this.FixupOutPolygon(e);this.StrictlySimple&&this.DoSimplePolygons();return!0}finally{d.Clear(this.m_Joins),
d.Clear(this.m_GhostJoins)}};d.Clipper.prototype.PopScanbeam=function(){var a=this.m_Scanbeam.Y;this.m_Scanbeam=this.m_Scanbeam.Next;return a};d.Clipper.prototype.DisposeAllPolyPts=function(){for(var a=0,b=this.m_PolyOuts.length;a<b;++a)this.DisposeOutRec(a);d.Clear(this.m_PolyOuts)};d.Clipper.prototype.DisposeOutRec=function(a){var b=this.m_PolyOuts[a];null!==b.Pts&&this.DisposeOutPts(b.Pts);this.m_PolyOuts[a]=null};d.Clipper.prototype.DisposeOutPts=function(a){if(null!==a)for(a.Prev.Next=null;null!==
a;)a=a.Next};d.Clipper.prototype.AddJoin=function(a,b,c){var e=new d.Join;e.OutPt1=a;e.OutPt2=b;e.OffPt.X=c.X;e.OffPt.Y=c.Y;this.m_Joins.push(e)};d.Clipper.prototype.AddGhostJoin=function(a,b){var c=new d.Join;c.OutPt1=a;c.OffPt.X=b.X;c.OffPt.Y=b.Y;this.m_GhostJoins.push(c)};d.Clipper.prototype.InsertLocalMinimaIntoAEL=function(a){for(;null!==this.m_CurrentLM&&this.m_CurrentLM.Y==a;){var b=this.m_CurrentLM.LeftBound,c=this.m_CurrentLM.RightBound;this.PopLocalMinima();var e=null;null===b?(this.InsertEdgeIntoAEL(c,
null),this.SetWindingCount(c),this.IsContributing(c)&&(e=this.AddOutPt(c,c.Bot))):(null==c?(this.InsertEdgeIntoAEL(b,null),this.SetWindingCount(b),this.IsContributing(b)&&(e=this.AddOutPt(b,b.Bot))):(this.InsertEdgeIntoAEL(b,null),this.InsertEdgeIntoAEL(c,b),this.SetWindingCount(b),c.WindCnt=b.WindCnt,c.WindCnt2=b.WindCnt2,this.IsContributing(b)&&(e=this.AddLocalMinPoly(b,c,b.Bot))),this.InsertScanbeam(b.Top.Y));null!=c&&(d.ClipperBase.IsHorizontal(c)?this.AddEdgeToSEL(c):this.InsertScanbeam(c.Top.Y));
if(null!=b&&null!=c){if(null!==e&&d.ClipperBase.IsHorizontal(c)&&0<this.m_GhostJoins.length&&0!==c.WindDelta)for(var f=0,g=this.m_GhostJoins.length;f<g;f++){var h=this.m_GhostJoins[f];this.HorzSegmentsOverlap(h.OutPt1.Pt,h.OffPt,c.Bot,c.Top)&&this.AddJoin(h.OutPt1,e,h.OffPt)}0<=b.OutIdx&&null!==b.PrevInAEL&&b.PrevInAEL.Curr.X==b.Bot.X&&0<=b.PrevInAEL.OutIdx&&d.ClipperBase.SlopesEqual(b.PrevInAEL,b,this.m_UseFullRange)&&0!==b.WindDelta&&0!==b.PrevInAEL.WindDelta&&(f=this.AddOutPt(b.PrevInAEL,b.Bot),
this.AddJoin(e,f,b.Top));if(b.NextInAEL!=c&&(0<=c.OutIdx&&0<=c.PrevInAEL.OutIdx&&d.ClipperBase.SlopesEqual(c.PrevInAEL,c,this.m_UseFullRange)&&0!==c.WindDelta&&0!==c.PrevInAEL.WindDelta&&(f=this.AddOutPt(c.PrevInAEL,c.Bot),this.AddJoin(e,f,c.Top)),e=b.NextInAEL,null!==e))for(;e!=c;)this.IntersectEdges(c,e,b.Curr,!1),e=e.NextInAEL}}};d.Clipper.prototype.InsertEdgeIntoAEL=function(a,b){if(null===this.m_ActiveEdges)a.PrevInAEL=null,a.NextInAEL=null,this.m_ActiveEdges=a;else if(null===b&&this.E2InsertsBeforeE1(this.m_ActiveEdges,
a))a.PrevInAEL=null,a.NextInAEL=this.m_ActiveEdges,this.m_ActiveEdges=this.m_ActiveEdges.PrevInAEL=a;else{null===b&&(b=this.m_ActiveEdges);for(;null!==b.NextInAEL&&!this.E2InsertsBeforeE1(b.NextInAEL,a);)b=b.NextInAEL;a.NextInAEL=b.NextInAEL;null!==b.NextInAEL&&(b.NextInAEL.PrevInAEL=a);a.PrevInAEL=b;b.NextInAEL=a}};d.Clipper.prototype.E2InsertsBeforeE1=function(a,b){return b.Curr.X==a.Curr.X?b.Top.Y>a.Top.Y?b.Top.X<d.Clipper.TopX(a,b.Top.Y):a.Top.X>d.Clipper.TopX(b,a.Top.Y):b.Curr.X<a.Curr.X};d.Clipper.prototype.IsEvenOddFillType=
function(a){return a.PolyTyp==d.PolyType.ptSubject?this.m_SubjFillType==d.PolyFillType.pftEvenOdd:this.m_ClipFillType==d.PolyFillType.pftEvenOdd};d.Clipper.prototype.IsEvenOddAltFillType=function(a){return a.PolyTyp==d.PolyType.ptSubject?this.m_ClipFillType==d.PolyFillType.pftEvenOdd:this.m_SubjFillType==d.PolyFillType.pftEvenOdd};d.Clipper.prototype.IsContributing=function(a){var b,c;a.PolyTyp==d.PolyType.ptSubject?(b=this.m_SubjFillType,c=this.m_ClipFillType):(b=this.m_ClipFillType,c=this.m_SubjFillType);
switch(b){case d.PolyFillType.pftEvenOdd:if(0===a.WindDelta&&1!=a.WindCnt)return!1;break;case d.PolyFillType.pftNonZero:if(1!=Math.abs(a.WindCnt))return!1;break;case d.PolyFillType.pftPositive:if(1!=a.WindCnt)return!1;break;default:if(-1!=a.WindCnt)return!1}switch(this.m_ClipType){case d.ClipType.ctIntersection:switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0!==a.WindCnt2;case d.PolyFillType.pftPositive:return 0<a.WindCnt2;default:return 0>a.WindCnt2}case d.ClipType.ctUnion:switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0===
a.WindCnt2;case d.PolyFillType.pftPositive:return 0>=a.WindCnt2;default:return 0<=a.WindCnt2}case d.ClipType.ctDifference:if(a.PolyTyp==d.PolyType.ptSubject)switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0===a.WindCnt2;case d.PolyFillType.pftPositive:return 0>=a.WindCnt2;default:return 0<=a.WindCnt2}else switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0!==a.WindCnt2;case d.PolyFillType.pftPositive:return 0<a.WindCnt2;default:return 0>
a.WindCnt2}case d.ClipType.ctXor:if(0===a.WindDelta)switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0===a.WindCnt2;case d.PolyFillType.pftPositive:return 0>=a.WindCnt2;default:return 0<=a.WindCnt2}}return!0};d.Clipper.prototype.SetWindingCount=function(a){for(var b=a.PrevInAEL;null!==b&&(b.PolyTyp!=a.PolyTyp||0===b.WindDelta);)b=b.PrevInAEL;if(null===b)a.WindCnt=0===a.WindDelta?1:a.WindDelta,a.WindCnt2=0,b=this.m_ActiveEdges;else{if(0===a.WindDelta&&this.m_ClipType!=
d.ClipType.ctUnion)a.WindCnt=1;else if(this.IsEvenOddFillType(a))if(0===a.WindDelta){for(var c=!0,e=b.PrevInAEL;null!==e;)e.PolyTyp==b.PolyTyp&&0!==e.WindDelta&&(c=!c),e=e.PrevInAEL;a.WindCnt=c?0:1}else a.WindCnt=a.WindDelta;else 0>b.WindCnt*b.WindDelta?1<Math.abs(b.WindCnt)?a.WindCnt=0>b.WindDelta*a.WindDelta?b.WindCnt:b.WindCnt+a.WindDelta:a.WindCnt=0===a.WindDelta?1:a.WindDelta:a.WindCnt=0===a.WindDelta?0>b.WindCnt?b.WindCnt-1:b.WindCnt+1:0>b.WindDelta*a.WindDelta?b.WindCnt:b.WindCnt+a.WindDelta;
a.WindCnt2=b.WindCnt2;b=b.NextInAEL}if(this.IsEvenOddAltFillType(a))for(;b!=a;)0!==b.WindDelta&&(a.WindCnt2=0===a.WindCnt2?1:0),b=b.NextInAEL;else for(;b!=a;)a.WindCnt2+=b.WindDelta,b=b.NextInAEL};d.Clipper.prototype.AddEdgeToSEL=function(a){null===this.m_SortedEdges?(this.m_SortedEdges=a,a.PrevInSEL=null,a.NextInSEL=null):(a.NextInSEL=this.m_SortedEdges,a.PrevInSEL=null,this.m_SortedEdges=this.m_SortedEdges.PrevInSEL=a)};d.Clipper.prototype.CopyAELToSEL=function(){var a=this.m_ActiveEdges;for(this.m_SortedEdges=
a;null!==a;)a.PrevInSEL=a.PrevInAEL,a=a.NextInSEL=a.NextInAEL};d.Clipper.prototype.SwapPositionsInAEL=function(a,b){if(a.NextInAEL!=a.PrevInAEL&&b.NextInAEL!=b.PrevInAEL){if(a.NextInAEL==b){var c=b.NextInAEL;null!==c&&(c.PrevInAEL=a);var e=a.PrevInAEL;null!==e&&(e.NextInAEL=b);b.PrevInAEL=e;b.NextInAEL=a;a.PrevInAEL=b;a.NextInAEL=c}else b.NextInAEL==a?(c=a.NextInAEL,null!==c&&(c.PrevInAEL=b),e=b.PrevInAEL,null!==e&&(e.NextInAEL=a),a.PrevInAEL=e,a.NextInAEL=b,b.PrevInAEL=a,b.NextInAEL=c):(c=a.NextInAEL,
e=a.PrevInAEL,a.NextInAEL=b.NextInAEL,null!==a.NextInAEL&&(a.NextInAEL.PrevInAEL=a),a.PrevInAEL=b.PrevInAEL,null!==a.PrevInAEL&&(a.PrevInAEL.NextInAEL=a),b.NextInAEL=c,null!==b.NextInAEL&&(b.NextInAEL.PrevInAEL=b),b.PrevInAEL=e,null!==b.PrevInAEL&&(b.PrevInAEL.NextInAEL=b));null===a.PrevInAEL?this.m_ActiveEdges=a:null===b.PrevInAEL&&(this.m_ActiveEdges=b)}};d.Clipper.prototype.SwapPositionsInSEL=function(a,b){if(null!==a.NextInSEL||null!==a.PrevInSEL)if(null!==b.NextInSEL||null!==b.PrevInSEL){if(a.NextInSEL==
b){var c=b.NextInSEL;null!==c&&(c.PrevInSEL=a);var e=a.PrevInSEL;null!==e&&(e.NextInSEL=b);b.PrevInSEL=e;b.NextInSEL=a;a.PrevInSEL=b;a.NextInSEL=c}else b.NextInSEL==a?(c=a.NextInSEL,null!==c&&(c.PrevInSEL=b),e=b.PrevInSEL,null!==e&&(e.NextInSEL=a),a.PrevInSEL=e,a.NextInSEL=b,b.PrevInSEL=a,b.NextInSEL=c):(c=a.NextInSEL,e=a.PrevInSEL,a.NextInSEL=b.NextInSEL,null!==a.NextInSEL&&(a.NextInSEL.PrevInSEL=a),a.PrevInSEL=b.PrevInSEL,null!==a.PrevInSEL&&(a.PrevInSEL.NextInSEL=a),b.NextInSEL=c,null!==b.NextInSEL&&
(b.NextInSEL.PrevInSEL=b),b.PrevInSEL=e,null!==b.PrevInSEL&&(b.PrevInSEL.NextInSEL=b));null===a.PrevInSEL?this.m_SortedEdges=a:null===b.PrevInSEL&&(this.m_SortedEdges=b)}};d.Clipper.prototype.AddLocalMaxPoly=function(a,b,c){this.AddOutPt(a,c);0==b.WindDelta&&this.AddOutPt(b,c);a.OutIdx==b.OutIdx?(a.OutIdx=-1,b.OutIdx=-1):a.OutIdx<b.OutIdx?this.AppendPolygon(a,b):this.AppendPolygon(b,a)};d.Clipper.prototype.AddLocalMinPoly=function(a,b,c){var e,f;d.ClipperBase.IsHorizontal(b)||a.Dx>b.Dx?(e=this.AddOutPt(a,
c),b.OutIdx=a.OutIdx,a.Side=d.EdgeSide.esLeft,b.Side=d.EdgeSide.esRight,f=a,a=f.PrevInAEL==b?b.PrevInAEL:f.PrevInAEL):(e=this.AddOutPt(b,c),a.OutIdx=b.OutIdx,a.Side=d.EdgeSide.esRight,b.Side=d.EdgeSide.esLeft,f=b,a=f.PrevInAEL==a?a.PrevInAEL:f.PrevInAEL);null!==a&&0<=a.OutIdx&&d.Clipper.TopX(a,c.Y)==d.Clipper.TopX(f,c.Y)&&d.ClipperBase.SlopesEqual(f,a,this.m_UseFullRange)&&0!==f.WindDelta&&0!==a.WindDelta&&(c=this.AddOutPt(a,c),this.AddJoin(e,c,f.Top));return e};d.Clipper.prototype.CreateOutRec=function(){var a=
new d.OutRec;a.Idx=-1;a.IsHole=!1;a.IsOpen=!1;a.FirstLeft=null;a.Pts=null;a.BottomPt=null;a.PolyNode=null;this.m_PolyOuts.push(a);a.Idx=this.m_PolyOuts.length-1;return a};d.Clipper.prototype.AddOutPt=function(a,b){var c=a.Side==d.EdgeSide.esLeft;if(0>a.OutIdx){var e=this.CreateOutRec();e.IsOpen=0===a.WindDelta;var f=new d.OutPt;e.Pts=f;f.Idx=e.Idx;f.Pt.X=b.X;f.Pt.Y=b.Y;f.Next=f;f.Prev=f;e.IsOpen||this.SetHoleState(a,e);a.OutIdx=e.Idx}else{var e=this.m_PolyOuts[a.OutIdx],g=e.Pts;if(c&&d.IntPoint.op_Equality(b,
g.Pt))return g;if(!c&&d.IntPoint.op_Equality(b,g.Prev.Pt))return g.Prev;f=new d.OutPt;f.Idx=e.Idx;f.Pt.X=b.X;f.Pt.Y=b.Y;f.Next=g;f.Prev=g.Prev;f.Prev.Next=f;g.Prev=f;c&&(e.Pts=f)}return f};d.Clipper.prototype.SwapPoints=function(a,b){var c=new d.IntPoint(a.Value);a.Value.X=b.Value.X;a.Value.Y=b.Value.Y;b.Value.X=c.X;b.Value.Y=c.Y};d.Clipper.prototype.HorzSegmentsOverlap=function(a,b,c,e){return a.X>c.X==a.X<e.X?!0:b.X>c.X==b.X<e.X?!0:c.X>a.X==c.X<b.X?!0:e.X>a.X==e.X<b.X?!0:a.X==c.X&&b.X==e.X?!0:a.X==
e.X&&b.X==c.X?!0:!1};d.Clipper.prototype.InsertPolyPtBetween=function(a,b,c){var e=new d.OutPt;e.Pt.X=c.X;e.Pt.Y=c.Y;b==a.Next?(a.Next=e,b.Prev=e,e.Next=b,e.Prev=a):(b.Next=e,a.Prev=e,e.Next=a,e.Prev=b);return e};d.Clipper.prototype.SetHoleState=function(a,b){for(var c=!1,e=a.PrevInAEL;null!==e;)0<=e.OutIdx&&0!=e.WindDelta&&(c=!c,null===b.FirstLeft&&(b.FirstLeft=this.m_PolyOuts[e.OutIdx])),e=e.PrevInAEL;c&&(b.IsHole=!0)};d.Clipper.prototype.GetDx=function(a,b){return a.Y==b.Y?d.ClipperBase.horizontal:
(b.X-a.X)/(b.Y-a.Y)};d.Clipper.prototype.FirstIsBottomPt=function(a,b){for(var c=a.Prev;d.IntPoint.op_Equality(c.Pt,a.Pt)&&c!=a;)c=c.Prev;for(var e=Math.abs(this.GetDx(a.Pt,c.Pt)),c=a.Next;d.IntPoint.op_Equality(c.Pt,a.Pt)&&c!=a;)c=c.Next;for(var f=Math.abs(this.GetDx(a.Pt,c.Pt)),c=b.Prev;d.IntPoint.op_Equality(c.Pt,b.Pt)&&c!=b;)c=c.Prev;for(var g=Math.abs(this.GetDx(b.Pt,c.Pt)),c=b.Next;d.IntPoint.op_Equality(c.Pt,b.Pt)&&c!=b;)c=c.Next;c=Math.abs(this.GetDx(b.Pt,c.Pt));return e>=g&&e>=c||f>=g&&f>=
c};d.Clipper.prototype.GetBottomPt=function(a){for(var b=null,c=a.Next;c!=a;)c.Pt.Y>a.Pt.Y?(a=c,b=null):c.Pt.Y==a.Pt.Y&&c.Pt.X<=a.Pt.X&&(c.Pt.X<a.Pt.X?(b=null,a=c):c.Next!=a&&c.Prev!=a&&(b=c)),c=c.Next;if(null!==b)for(;b!=c;)for(this.FirstIsBottomPt(c,b)||(a=b),b=b.Next;d.IntPoint.op_Inequality(b.Pt,a.Pt);)b=b.Next;return a};d.Clipper.prototype.GetLowermostRec=function(a,b){null===a.BottomPt&&(a.BottomPt=this.GetBottomPt(a.Pts));null===b.BottomPt&&(b.BottomPt=this.GetBottomPt(b.Pts));var c=a.BottomPt,
e=b.BottomPt;return c.Pt.Y>e.Pt.Y?a:c.Pt.Y<e.Pt.Y?b:c.Pt.X<e.Pt.X?a:c.Pt.X>e.Pt.X?b:c.Next==c?b:e.Next==e?a:this.FirstIsBottomPt(c,e)?a:b};d.Clipper.prototype.Param1RightOfParam2=function(a,b){do if(a=a.FirstLeft,a==b)return!0;while(null!==a);return!1};d.Clipper.prototype.GetOutRec=function(a){for(a=this.m_PolyOuts[a];a!=this.m_PolyOuts[a.Idx];)a=this.m_PolyOuts[a.Idx];return a};d.Clipper.prototype.AppendPolygon=function(a,b){var c=this.m_PolyOuts[a.OutIdx],e=this.m_PolyOuts[b.OutIdx],f;f=this.Param1RightOfParam2(c,
e)?e:this.Param1RightOfParam2(e,c)?c:this.GetLowermostRec(c,e);var g=c.Pts,h=g.Prev,l=e.Pts,k=l.Prev;a.Side==d.EdgeSide.esLeft?(b.Side==d.EdgeSide.esLeft?(this.ReversePolyPtLinks(l),l.Next=g,g.Prev=l,h.Next=k,k.Prev=h,c.Pts=k):(k.Next=g,g.Prev=k,l.Prev=h,h.Next=l,c.Pts=l),g=d.EdgeSide.esLeft):(b.Side==d.EdgeSide.esRight?(this.ReversePolyPtLinks(l),h.Next=k,k.Prev=h,l.Next=g,g.Prev=l):(h.Next=l,l.Prev=h,g.Prev=k,k.Next=g),g=d.EdgeSide.esRight);c.BottomPt=null;f==e&&(e.FirstLeft!=c&&(c.FirstLeft=e.FirstLeft),
c.IsHole=e.IsHole);e.Pts=null;e.BottomPt=null;e.FirstLeft=c;f=a.OutIdx;h=b.OutIdx;a.OutIdx=-1;b.OutIdx=-1;for(l=this.m_ActiveEdges;null!==l;){if(l.OutIdx==h){l.OutIdx=f;l.Side=g;break}l=l.NextInAEL}e.Idx=c.Idx};d.Clipper.prototype.ReversePolyPtLinks=function(a){if(null!==a){var b,c;b=a;do c=b.Next,b.Next=b.Prev,b=b.Prev=c;while(b!=a)}};d.Clipper.SwapSides=function(a,b){var c=a.Side;a.Side=b.Side;b.Side=c};d.Clipper.SwapPolyIndexes=function(a,b){var c=a.OutIdx;a.OutIdx=b.OutIdx;b.OutIdx=c};d.Clipper.prototype.IntersectEdges=
function(a,b,c,e){var f=!e&&null===a.NextInLML&&a.Top.X==c.X&&a.Top.Y==c.Y;e=!e&&null===b.NextInLML&&b.Top.X==c.X&&b.Top.Y==c.Y;var g=0<=a.OutIdx,h=0<=b.OutIdx;if(0===a.WindDelta||0===b.WindDelta)0===a.WindDelta&&0===b.WindDelta?(f||e)&&g&&h&&this.AddLocalMaxPoly(a,b,c):a.PolyTyp==b.PolyTyp&&a.WindDelta!=b.WindDelta&&this.m_ClipType==d.ClipType.ctUnion?0===a.WindDelta?h&&(this.AddOutPt(a,c),g&&(a.OutIdx=-1)):g&&(this.AddOutPt(b,c),h&&(b.OutIdx=-1)):a.PolyTyp!=b.PolyTyp&&(0!==a.WindDelta||1!=Math.abs(b.WindCnt)||
this.m_ClipType==d.ClipType.ctUnion&&0!==b.WindCnt2?0!==b.WindDelta||1!=Math.abs(a.WindCnt)||this.m_ClipType==d.ClipType.ctUnion&&0!==a.WindCnt2||(this.AddOutPt(b,c),h&&(b.OutIdx=-1)):(this.AddOutPt(a,c),g&&(a.OutIdx=-1))),f&&(0>a.OutIdx?this.DeleteFromAEL(a):d.Error("Error intersecting polylines")),e&&(0>b.OutIdx?this.DeleteFromAEL(b):d.Error("Error intersecting polylines"));else{if(a.PolyTyp==b.PolyTyp)if(this.IsEvenOddFillType(a)){var l=a.WindCnt;a.WindCnt=b.WindCnt;b.WindCnt=l}else a.WindCnt=
0===a.WindCnt+b.WindDelta?-a.WindCnt:a.WindCnt+b.WindDelta,b.WindCnt=0===b.WindCnt-a.WindDelta?-b.WindCnt:b.WindCnt-a.WindDelta;else this.IsEvenOddFillType(b)?a.WindCnt2=0===a.WindCnt2?1:0:a.WindCnt2+=b.WindDelta,this.IsEvenOddFillType(a)?b.WindCnt2=0===b.WindCnt2?1:0:b.WindCnt2-=a.WindDelta;var k,n,m;a.PolyTyp==d.PolyType.ptSubject?(k=this.m_SubjFillType,m=this.m_ClipFillType):(k=this.m_ClipFillType,m=this.m_SubjFillType);b.PolyTyp==d.PolyType.ptSubject?(n=this.m_SubjFillType,l=this.m_ClipFillType):
(n=this.m_ClipFillType,l=this.m_SubjFillType);switch(k){case d.PolyFillType.pftPositive:k=a.WindCnt;break;case d.PolyFillType.pftNegative:k=-a.WindCnt;break;default:k=Math.abs(a.WindCnt)}switch(n){case d.PolyFillType.pftPositive:n=b.WindCnt;break;case d.PolyFillType.pftNegative:n=-b.WindCnt;break;default:n=Math.abs(b.WindCnt)}if(g&&h)f||e||0!==k&&1!=k||0!==n&&1!=n||a.PolyTyp!=b.PolyTyp&&this.m_ClipType!=d.ClipType.ctXor?this.AddLocalMaxPoly(a,b,c):(this.AddOutPt(a,c),this.AddOutPt(b,c),d.Clipper.SwapSides(a,
b),d.Clipper.SwapPolyIndexes(a,b));else if(g){if(0===n||1==n)this.AddOutPt(a,c),d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b)}else if(h){if(0===k||1==k)this.AddOutPt(b,c),d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b)}else if(!(0!==k&&1!=k||0!==n&&1!=n||f||e)){switch(m){case d.PolyFillType.pftPositive:g=a.WindCnt2;break;case d.PolyFillType.pftNegative:g=-a.WindCnt2;break;default:g=Math.abs(a.WindCnt2)}switch(l){case d.PolyFillType.pftPositive:h=b.WindCnt2;break;case d.PolyFillType.pftNegative:h=
-b.WindCnt2;break;default:h=Math.abs(b.WindCnt2)}if(a.PolyTyp!=b.PolyTyp)this.AddLocalMinPoly(a,b,c);else if(1==k&&1==n)switch(this.m_ClipType){case d.ClipType.ctIntersection:0<g&&0<h&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctUnion:0>=g&&0>=h&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctDifference:(a.PolyTyp==d.PolyType.ptClip&&0<g&&0<h||a.PolyTyp==d.PolyType.ptSubject&&0>=g&&0>=h)&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctXor:this.AddLocalMinPoly(a,b,c)}else d.Clipper.SwapSides(a,
b)}f!=e&&(f&&0<=a.OutIdx||e&&0<=b.OutIdx)&&(d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b));f&&this.DeleteFromAEL(a);e&&this.DeleteFromAEL(b)}};d.Clipper.prototype.DeleteFromAEL=function(a){var b=a.PrevInAEL,c=a.NextInAEL;if(null!==b||null!==c||a==this.m_ActiveEdges)null!==b?b.NextInAEL=c:this.m_ActiveEdges=c,null!==c&&(c.PrevInAEL=b),a.NextInAEL=null,a.PrevInAEL=null};d.Clipper.prototype.DeleteFromSEL=function(a){var b=a.PrevInSEL,c=a.NextInSEL;if(null!==b||null!==c||a==this.m_SortedEdges)null!==
b?b.NextInSEL=c:this.m_SortedEdges=c,null!==c&&(c.PrevInSEL=b),a.NextInSEL=null,a.PrevInSEL=null};d.Clipper.prototype.UpdateEdgeIntoAEL=function(a){null===a.NextInLML&&d.Error("UpdateEdgeIntoAEL: invalid call");var b=a.PrevInAEL,c=a.NextInAEL;a.NextInLML.OutIdx=a.OutIdx;null!==b?b.NextInAEL=a.NextInLML:this.m_ActiveEdges=a.NextInLML;null!==c&&(c.PrevInAEL=a.NextInLML);a.NextInLML.Side=a.Side;a.NextInLML.WindDelta=a.WindDelta;a.NextInLML.WindCnt=a.WindCnt;a.NextInLML.WindCnt2=a.WindCnt2;a=a.NextInLML;
a.Curr.X=a.Bot.X;a.Curr.Y=a.Bot.Y;a.PrevInAEL=b;a.NextInAEL=c;d.ClipperBase.IsHorizontal(a)||this.InsertScanbeam(a.Top.Y);return a};d.Clipper.prototype.ProcessHorizontals=function(a){for(var b=this.m_SortedEdges;null!==b;)this.DeleteFromSEL(b),this.ProcessHorizontal(b,a),b=this.m_SortedEdges};d.Clipper.prototype.GetHorzDirection=function(a,b){a.Bot.X<a.Top.X?(b.Left=a.Bot.X,b.Right=a.Top.X,b.Dir=d.Direction.dLeftToRight):(b.Left=a.Top.X,b.Right=a.Bot.X,b.Dir=d.Direction.dRightToLeft)};d.Clipper.prototype.PrepareHorzJoins=
function(a,b){var c=this.m_PolyOuts[a.OutIdx].Pts;a.Side!=d.EdgeSide.esLeft&&(c=c.Prev);b&&(d.IntPoint.op_Equality(c.Pt,a.Top)?this.AddGhostJoin(c,a.Bot):this.AddGhostJoin(c,a.Top))};d.Clipper.prototype.ProcessHorizontal=function(a,b){var c={Dir:null,Left:null,Right:null};this.GetHorzDirection(a,c);for(var e=c.Dir,f=c.Left,g=c.Right,h=a,l=null;null!==h.NextInLML&&d.ClipperBase.IsHorizontal(h.NextInLML);)h=h.NextInLML;for(null===h.NextInLML&&(l=this.GetMaximaPair(h));;){for(var k=a==h,n=this.GetNextInAEL(a,
e);null!==n&&!(n.Curr.X==a.Top.X&&null!==a.NextInLML&&n.Dx<a.NextInLML.Dx);){c=this.GetNextInAEL(n,e);if(e==d.Direction.dLeftToRight&&n.Curr.X<=g||e==d.Direction.dRightToLeft&&n.Curr.X>=f){0<=a.OutIdx&&0!=a.WindDelta&&this.PrepareHorzJoins(a,b);if(n==l&&k){e==d.Direction.dLeftToRight?this.IntersectEdges(a,n,n.Top,!1):this.IntersectEdges(n,a,n.Top,!1);0<=l.OutIdx&&d.Error("ProcessHorizontal error");return}if(e==d.Direction.dLeftToRight){var m=new d.IntPoint(n.Curr.X,a.Curr.Y);this.IntersectEdges(a,
n,m,!0)}else m=new d.IntPoint(n.Curr.X,a.Curr.Y),this.IntersectEdges(n,a,m,!0);this.SwapPositionsInAEL(a,n)}else if(e==d.Direction.dLeftToRight&&n.Curr.X>=g||e==d.Direction.dRightToLeft&&n.Curr.X<=f)break;n=c}0<=a.OutIdx&&0!==a.WindDelta&&this.PrepareHorzJoins(a,b);if(null!==a.NextInLML&&d.ClipperBase.IsHorizontal(a.NextInLML))a=this.UpdateEdgeIntoAEL(a),0<=a.OutIdx&&this.AddOutPt(a,a.Bot),c={Dir:e,Left:f,Right:g},this.GetHorzDirection(a,c),e=c.Dir,f=c.Left,g=c.Right;else break}null!==a.NextInLML?
0<=a.OutIdx?(e=this.AddOutPt(a,a.Top),a=this.UpdateEdgeIntoAEL(a),0!==a.WindDelta&&(f=a.PrevInAEL,c=a.NextInAEL,null!==f&&f.Curr.X==a.Bot.X&&f.Curr.Y==a.Bot.Y&&0!==f.WindDelta&&0<=f.OutIdx&&f.Curr.Y>f.Top.Y&&d.ClipperBase.SlopesEqual(a,f,this.m_UseFullRange)?(c=this.AddOutPt(f,a.Bot),this.AddJoin(e,c,a.Top)):null!==c&&c.Curr.X==a.Bot.X&&c.Curr.Y==a.Bot.Y&&0!==c.WindDelta&&0<=c.OutIdx&&c.Curr.Y>c.Top.Y&&d.ClipperBase.SlopesEqual(a,c,this.m_UseFullRange)&&(c=this.AddOutPt(c,a.Bot),this.AddJoin(e,c,
a.Top)))):this.UpdateEdgeIntoAEL(a):null!==l?0<=l.OutIdx?(e==d.Direction.dLeftToRight?this.IntersectEdges(a,l,a.Top,!1):this.IntersectEdges(l,a,a.Top,!1),0<=l.OutIdx&&d.Error("ProcessHorizontal error")):(this.DeleteFromAEL(a),this.DeleteFromAEL(l)):(0<=a.OutIdx&&this.AddOutPt(a,a.Top),this.DeleteFromAEL(a))};d.Clipper.prototype.GetNextInAEL=function(a,b){return b==d.Direction.dLeftToRight?a.NextInAEL:a.PrevInAEL};d.Clipper.prototype.IsMinima=function(a){return null!==a&&a.Prev.NextInLML!=a&&a.Next.NextInLML!=
a};d.Clipper.prototype.IsMaxima=function(a,b){return null!==a&&a.Top.Y==b&&null===a.NextInLML};d.Clipper.prototype.IsIntermediate=function(a,b){return a.Top.Y==b&&null!==a.NextInLML};d.Clipper.prototype.GetMaximaPair=function(a){var b=null;d.IntPoint.op_Equality(a.Next.Top,a.Top)&&null===a.Next.NextInLML?b=a.Next:d.IntPoint.op_Equality(a.Prev.Top,a.Top)&&null===a.Prev.NextInLML&&(b=a.Prev);return null===b||-2!=b.OutIdx&&(b.NextInAEL!=b.PrevInAEL||d.ClipperBase.IsHorizontal(b))?b:null};d.Clipper.prototype.ProcessIntersections=
function(a,b){if(null==this.m_ActiveEdges)return!0;try{this.BuildIntersectList(a,b);if(0==this.m_IntersectList.length)return!0;if(1==this.m_IntersectList.length||this.FixupIntersectionOrder())this.ProcessIntersectList();else return!1}catch(c){this.m_SortedEdges=null,this.m_IntersectList.length=0,d.Error("ProcessIntersections error")}this.m_SortedEdges=null;return!0};d.Clipper.prototype.BuildIntersectList=function(a,b){if(null!==this.m_ActiveEdges){var c=this.m_ActiveEdges;for(this.m_SortedEdges=c;null!==
c;)c.PrevInSEL=c.PrevInAEL,c.NextInSEL=c.NextInAEL,c.Curr.X=d.Clipper.TopX(c,b),c=c.NextInAEL;for(var e=!0;e&&null!==this.m_SortedEdges;){e=!1;for(c=this.m_SortedEdges;null!==c.NextInSEL;){var f=c.NextInSEL,g=new d.IntPoint;c.Curr.X>f.Curr.X?(!this.IntersectPoint(c,f,g)&&c.Curr.X>f.Curr.X+1&&d.Error("Intersection error"),g.Y>a&&(g.Y=a,Math.abs(c.Dx)>Math.abs(f.Dx)?g.X=d.Clipper.TopX(f,a):g.X=d.Clipper.TopX(c,a)),e=new d.IntersectNode,e.Edge1=c,e.Edge2=f,e.Pt.X=g.X,e.Pt.Y=g.Y,this.m_IntersectList.push(e),
this.SwapPositionsInSEL(c,f),e=!0):c=f}if(null!==c.PrevInSEL)c.PrevInSEL.NextInSEL=null;else break}this.m_SortedEdges=null}};d.Clipper.prototype.EdgesAdjacent=function(a){return a.Edge1.NextInSEL==a.Edge2||a.Edge1.PrevInSEL==a.Edge2};d.Clipper.IntersectNodeSort=function(a,b){return b.Pt.Y-a.Pt.Y};d.Clipper.prototype.FixupIntersectionOrder=function(){this.m_IntersectList.sort(this.m_IntersectNodeComparer);this.CopyAELToSEL();for(var a=this.m_IntersectList.length,b=0;b<a;b++){if(!this.EdgesAdjacent(this.m_IntersectList[b])){for(var c=
b+1;c<a&&!this.EdgesAdjacent(this.m_IntersectList[c]);)c++;if(c==a)return!1;var e=this.m_IntersectList[b];this.m_IntersectList[b]=this.m_IntersectList[c];this.m_IntersectList[c]=e}this.SwapPositionsInSEL(this.m_IntersectList[b].Edge1,this.m_IntersectList[b].Edge2)}return!0};d.Clipper.prototype.ProcessIntersectList=function(){for(var a=0,b=this.m_IntersectList.length;a<b;a++){var c=this.m_IntersectList[a];this.IntersectEdges(c.Edge1,c.Edge2,c.Pt,!0);this.SwapPositionsInAEL(c.Edge1,c.Edge2)}this.m_IntersectList.length=
0};E=function(a){return 0>a?Math.ceil(a-0.5):Math.round(a)};F=function(a){return 0>a?Math.ceil(a-0.5):Math.floor(a+0.5)};G=function(a){return 0>a?-Math.round(Math.abs(a)):Math.round(a)};H=function(a){if(0>a)return a-=0.5,-2147483648>a?Math.ceil(a):a|0;a+=0.5;return 2147483647<a?Math.floor(a):a|0};d.Clipper.Round=p?E:D?G:J?H:F;d.Clipper.TopX=function(a,b){return b==a.Top.Y?a.Top.X:a.Bot.X+d.Clipper.Round(a.Dx*(b-a.Bot.Y))};d.Clipper.prototype.IntersectPoint=function(a,b,c){c.X=0;c.Y=0;var e,f;if(d.ClipperBase.SlopesEqual(a,
b,this.m_UseFullRange)||a.Dx==b.Dx)return b.Bot.Y>a.Bot.Y?(c.X=b.Bot.X,c.Y=b.Bot.Y):(c.X=a.Bot.X,c.Y=a.Bot.Y),!1;if(0===a.Delta.X)c.X=a.Bot.X,d.ClipperBase.IsHorizontal(b)?c.Y=b.Bot.Y:(f=b.Bot.Y-b.Bot.X/b.Dx,c.Y=d.Clipper.Round(c.X/b.Dx+f));else if(0===b.Delta.X)c.X=b.Bot.X,d.ClipperBase.IsHorizontal(a)?c.Y=a.Bot.Y:(e=a.Bot.Y-a.Bot.X/a.Dx,c.Y=d.Clipper.Round(c.X/a.Dx+e));else{e=a.Bot.X-a.Bot.Y*a.Dx;f=b.Bot.X-b.Bot.Y*b.Dx;var g=(f-e)/(a.Dx-b.Dx);c.Y=d.Clipper.Round(g);Math.abs(a.Dx)<Math.abs(b.Dx)?
c.X=d.Clipper.Round(a.Dx*g+e):c.X=d.Clipper.Round(b.Dx*g+f)}if(c.Y<a.Top.Y||c.Y<b.Top.Y){if(a.Top.Y>b.Top.Y)return c.Y=a.Top.Y,c.X=d.Clipper.TopX(b,a.Top.Y),c.X<a.Top.X;c.Y=b.Top.Y;Math.abs(a.Dx)<Math.abs(b.Dx)?c.X=d.Clipper.TopX(a,c.Y):c.X=d.Clipper.TopX(b,c.Y)}return!0};d.Clipper.prototype.ProcessEdgesAtTopOfScanbeam=function(a){for(var b=this.m_ActiveEdges;null!==b;){var c=this.IsMaxima(b,a);c&&(c=this.GetMaximaPair(b),c=null===c||!d.ClipperBase.IsHorizontal(c));if(c){var e=b.PrevInAEL;this.DoMaxima(b);
b=null===e?this.m_ActiveEdges:e.NextInAEL}else this.IsIntermediate(b,a)&&d.ClipperBase.IsHorizontal(b.NextInLML)?(b=this.UpdateEdgeIntoAEL(b),0<=b.OutIdx&&this.AddOutPt(b,b.Bot),this.AddEdgeToSEL(b)):(b.Curr.X=d.Clipper.TopX(b,a),b.Curr.Y=a),this.StrictlySimple&&(e=b.PrevInAEL,0<=b.OutIdx&&0!==b.WindDelta&&null!==e&&0<=e.OutIdx&&e.Curr.X==b.Curr.X&&0!==e.WindDelta&&(c=this.AddOutPt(e,b.Curr),e=this.AddOutPt(b,b.Curr),this.AddJoin(c,e,b.Curr))),b=b.NextInAEL}this.ProcessHorizontals(!0);for(b=this.m_ActiveEdges;null!==
b;){if(this.IsIntermediate(b,a)){c=null;0<=b.OutIdx&&(c=this.AddOutPt(b,b.Top));var b=this.UpdateEdgeIntoAEL(b),e=b.PrevInAEL,f=b.NextInAEL;null!==e&&e.Curr.X==b.Bot.X&&e.Curr.Y==b.Bot.Y&&null!==c&&0<=e.OutIdx&&e.Curr.Y>e.Top.Y&&d.ClipperBase.SlopesEqual(b,e,this.m_UseFullRange)&&0!==b.WindDelta&&0!==e.WindDelta?(e=this.AddOutPt(e,b.Bot),this.AddJoin(c,e,b.Top)):null!==f&&f.Curr.X==b.Bot.X&&f.Curr.Y==b.Bot.Y&&null!==c&&0<=f.OutIdx&&f.Curr.Y>f.Top.Y&&d.ClipperBase.SlopesEqual(b,f,this.m_UseFullRange)&&
0!==b.WindDelta&&0!==f.WindDelta&&(e=this.AddOutPt(f,b.Bot),this.AddJoin(c,e,b.Top))}b=b.NextInAEL}};d.Clipper.prototype.DoMaxima=function(a){var b=this.GetMaximaPair(a);if(null===b)0<=a.OutIdx&&this.AddOutPt(a,a.Top),this.DeleteFromAEL(a);else{for(var c=a.NextInAEL;null!==c&&c!=b;)this.IntersectEdges(a,c,a.Top,!0),this.SwapPositionsInAEL(a,c),c=a.NextInAEL;-1==a.OutIdx&&-1==b.OutIdx?(this.DeleteFromAEL(a),this.DeleteFromAEL(b)):0<=a.OutIdx&&0<=b.OutIdx?this.IntersectEdges(a,b,a.Top,!1):0===a.WindDelta?
(0<=a.OutIdx&&(this.AddOutPt(a,a.Top),a.OutIdx=-1),this.DeleteFromAEL(a),0<=b.OutIdx&&(this.AddOutPt(b,a.Top),b.OutIdx=-1),this.DeleteFromAEL(b)):d.Error("DoMaxima error")}};d.Clipper.ReversePaths=function(a){for(var b=0,c=a.length;b<c;b++)a[b].reverse()};d.Clipper.Orientation=function(a){return 0<=d.Clipper.Area(a)};d.Clipper.prototype.PointCount=function(a){if(null===a)return 0;var b=0,c=a;do b++,c=c.Next;while(c!=a);return b};d.Clipper.prototype.BuildResult=function(a){d.Clear(a);for(var b=0,c=
this.m_PolyOuts.length;b<c;b++){var e=this.m_PolyOuts[b];if(null!==e.Pts){var e=e.Pts.Prev,f=this.PointCount(e);if(!(2>f)){for(var g=Array(f),h=0;h<f;h++)g[h]=e.Pt,e=e.Prev;a.push(g)}}}};d.Clipper.prototype.BuildResult2=function(a){a.Clear();for(var b=0,c=this.m_PolyOuts.length;b<c;b++){var e=this.m_PolyOuts[b],f=this.PointCount(e.Pts);if(!(e.IsOpen&&2>f||!e.IsOpen&&3>f)){this.FixHoleLinkage(e);var g=new d.PolyNode;a.m_AllPolys.push(g);e.PolyNode=g;g.m_polygon.length=f;for(var e=e.Pts.Prev,h=0;h<
f;h++)g.m_polygon[h]=e.Pt,e=e.Prev}}b=0;for(c=this.m_PolyOuts.length;b<c;b++)e=this.m_PolyOuts[b],null!==e.PolyNode&&(e.IsOpen?(e.PolyNode.IsOpen=!0,a.AddChild(e.PolyNode)):null!==e.FirstLeft&&null!=e.FirstLeft.PolyNode?e.FirstLeft.PolyNode.AddChild(e.PolyNode):a.AddChild(e.PolyNode))};d.Clipper.prototype.FixupOutPolygon=function(a){var b=null;a.BottomPt=null;for(var c=a.Pts;;){if(c.Prev==c||c.Prev==c.Next){this.DisposeOutPts(c);a.Pts=null;return}if(d.IntPoint.op_Equality(c.Pt,c.Next.Pt)||d.IntPoint.op_Equality(c.Pt,
c.Prev.Pt)||d.ClipperBase.SlopesEqual(c.Prev.Pt,c.Pt,c.Next.Pt,this.m_UseFullRange)&&(!this.PreserveCollinear||!this.Pt2IsBetweenPt1AndPt3(c.Prev.Pt,c.Pt,c.Next.Pt)))b=null,c.Prev.Next=c.Next,c=c.Next.Prev=c.Prev;else if(c==b)break;else null===b&&(b=c),c=c.Next}a.Pts=c};d.Clipper.prototype.DupOutPt=function(a,b){var c=new d.OutPt;c.Pt.X=a.Pt.X;c.Pt.Y=a.Pt.Y;c.Idx=a.Idx;b?(c.Next=a.Next,c.Prev=a,a.Next.Prev=c,a.Next=c):(c.Prev=a.Prev,c.Next=a,a.Prev.Next=c,a.Prev=c);return c};d.Clipper.prototype.GetOverlap=
function(a,b,c,e,d){a<b?c<e?(d.Left=Math.max(a,c),d.Right=Math.min(b,e)):(d.Left=Math.max(a,e),d.Right=Math.min(b,c)):c<e?(d.Left=Math.max(b,c),d.Right=Math.min(a,e)):(d.Left=Math.max(b,e),d.Right=Math.min(a,c));return d.Left<d.Right};d.Clipper.prototype.JoinHorz=function(a,b,c,e,f,g){var h=a.Pt.X>b.Pt.X?d.Direction.dRightToLeft:d.Direction.dLeftToRight;e=c.Pt.X>e.Pt.X?d.Direction.dRightToLeft:d.Direction.dLeftToRight;if(h==e)return!1;if(h==d.Direction.dLeftToRight){for(;a.Next.Pt.X<=f.X&&a.Next.Pt.X>=
a.Pt.X&&a.Next.Pt.Y==f.Y;)a=a.Next;g&&a.Pt.X!=f.X&&(a=a.Next);b=this.DupOutPt(a,!g);d.IntPoint.op_Inequality(b.Pt,f)&&(a=b,a.Pt.X=f.X,a.Pt.Y=f.Y,b=this.DupOutPt(a,!g))}else{for(;a.Next.Pt.X>=f.X&&a.Next.Pt.X<=a.Pt.X&&a.Next.Pt.Y==f.Y;)a=a.Next;g||a.Pt.X==f.X||(a=a.Next);b=this.DupOutPt(a,g);d.IntPoint.op_Inequality(b.Pt,f)&&(a=b,a.Pt.X=f.X,a.Pt.Y=f.Y,b=this.DupOutPt(a,g))}if(e==d.Direction.dLeftToRight){for(;c.Next.Pt.X<=f.X&&c.Next.Pt.X>=c.Pt.X&&c.Next.Pt.Y==f.Y;)c=c.Next;g&&c.Pt.X!=f.X&&(c=c.Next);
e=this.DupOutPt(c,!g);d.IntPoint.op_Inequality(e.Pt,f)&&(c=e,c.Pt.X=f.X,c.Pt.Y=f.Y,e=this.DupOutPt(c,!g))}else{for(;c.Next.Pt.X>=f.X&&c.Next.Pt.X<=c.Pt.X&&c.Next.Pt.Y==f.Y;)c=c.Next;g||c.Pt.X==f.X||(c=c.Next);e=this.DupOutPt(c,g);d.IntPoint.op_Inequality(e.Pt,f)&&(c=e,c.Pt.X=f.X,c.Pt.Y=f.Y,e=this.DupOutPt(c,g))}h==d.Direction.dLeftToRight==g?(a.Prev=c,c.Next=a,b.Next=e,e.Prev=b):(a.Next=c,c.Prev=a,b.Prev=e,e.Next=b);return!0};d.Clipper.prototype.JoinPoints=function(a,b,c){var e=a.OutPt1,f=new d.OutPt,
g=a.OutPt2,h=new d.OutPt;if((h=a.OutPt1.Pt.Y==a.OffPt.Y)&&d.IntPoint.op_Equality(a.OffPt,a.OutPt1.Pt)&&d.IntPoint.op_Equality(a.OffPt,a.OutPt2.Pt)){for(f=a.OutPt1.Next;f!=e&&d.IntPoint.op_Equality(f.Pt,a.OffPt);)f=f.Next;f=f.Pt.Y>a.OffPt.Y;for(h=a.OutPt2.Next;h!=g&&d.IntPoint.op_Equality(h.Pt,a.OffPt);)h=h.Next;if(f==h.Pt.Y>a.OffPt.Y)return!1;f?(f=this.DupOutPt(e,!1),h=this.DupOutPt(g,!0),e.Prev=g,g.Next=e,f.Next=h,h.Prev=f):(f=this.DupOutPt(e,!0),h=this.DupOutPt(g,!1),e.Next=g,g.Prev=e,f.Prev=h,
h.Next=f);a.OutPt1=e;a.OutPt2=f;return!0}if(h){for(f=e;e.Prev.Pt.Y==e.Pt.Y&&e.Prev!=f&&e.Prev!=g;)e=e.Prev;for(;f.Next.Pt.Y==f.Pt.Y&&f.Next!=e&&f.Next!=g;)f=f.Next;if(f.Next==e||f.Next==g)return!1;for(h=g;g.Prev.Pt.Y==g.Pt.Y&&g.Prev!=h&&g.Prev!=f;)g=g.Prev;for(;h.Next.Pt.Y==h.Pt.Y&&h.Next!=g&&h.Next!=e;)h=h.Next;if(h.Next==g||h.Next==e)return!1;c={Left:null,Right:null};if(!this.GetOverlap(e.Pt.X,f.Pt.X,g.Pt.X,h.Pt.X,c))return!1;b=c.Left;var l=c.Right;c=new d.IntPoint;e.Pt.X>=b&&e.Pt.X<=l?(c.X=e.Pt.X,
c.Y=e.Pt.Y,b=e.Pt.X>f.Pt.X):g.Pt.X>=b&&g.Pt.X<=l?(c.X=g.Pt.X,c.Y=g.Pt.Y,b=g.Pt.X>h.Pt.X):f.Pt.X>=b&&f.Pt.X<=l?(c.X=f.Pt.X,c.Y=f.Pt.Y,b=f.Pt.X>e.Pt.X):(c.X=h.Pt.X,c.Y=h.Pt.Y,b=h.Pt.X>g.Pt.X);a.OutPt1=e;a.OutPt2=g;return this.JoinHorz(e,f,g,h,c,b)}for(f=e.Next;d.IntPoint.op_Equality(f.Pt,e.Pt)&&f!=e;)f=f.Next;if(l=f.Pt.Y>e.Pt.Y||!d.ClipperBase.SlopesEqual(e.Pt,f.Pt,a.OffPt,this.m_UseFullRange)){for(f=e.Prev;d.IntPoint.op_Equality(f.Pt,e.Pt)&&f!=e;)f=f.Prev;if(f.Pt.Y>e.Pt.Y||!d.ClipperBase.SlopesEqual(e.Pt,
f.Pt,a.OffPt,this.m_UseFullRange))return!1}for(h=g.Next;d.IntPoint.op_Equality(h.Pt,g.Pt)&&h!=g;)h=h.Next;var k=h.Pt.Y>g.Pt.Y||!d.ClipperBase.SlopesEqual(g.Pt,h.Pt,a.OffPt,this.m_UseFullRange);if(k){for(h=g.Prev;d.IntPoint.op_Equality(h.Pt,g.Pt)&&h!=g;)h=h.Prev;if(h.Pt.Y>g.Pt.Y||!d.ClipperBase.SlopesEqual(g.Pt,h.Pt,a.OffPt,this.m_UseFullRange))return!1}if(f==e||h==g||f==h||b==c&&l==k)return!1;l?(f=this.DupOutPt(e,!1),h=this.DupOutPt(g,!0),e.Prev=g,g.Next=e,f.Next=h,h.Prev=f):(f=this.DupOutPt(e,!0),
h=this.DupOutPt(g,!1),e.Next=g,g.Prev=e,f.Prev=h,h.Next=f);a.OutPt1=e;a.OutPt2=f;return!0};d.Clipper.GetBounds=function(a){for(var b=0,c=a.length;b<c&&0==a[b].length;)b++;if(b==c)return new d.IntRect(0,0,0,0);var e=new d.IntRect;e.left=a[b][0].X;e.right=e.left;e.top=a[b][0].Y;for(e.bottom=e.top;b<c;b++)for(var f=0,g=a[b].length;f<g;f++)a[b][f].X<e.left?e.left=a[b][f].X:a[b][f].X>e.right&&(e.right=a[b][f].X),a[b][f].Y<e.top?e.top=a[b][f].Y:a[b][f].Y>e.bottom&&(e.bottom=a[b][f].Y);return e};d.Clipper.prototype.GetBounds2=
function(a){var b=a,c=new d.IntRect;c.left=a.Pt.X;c.right=a.Pt.X;c.top=a.Pt.Y;c.bottom=a.Pt.Y;for(a=a.Next;a!=b;)a.Pt.X<c.left&&(c.left=a.Pt.X),a.Pt.X>c.right&&(c.right=a.Pt.X),a.Pt.Y<c.top&&(c.top=a.Pt.Y),a.Pt.Y>c.bottom&&(c.bottom=a.Pt.Y),a=a.Next;return c};d.Clipper.PointInPolygon=function(a,b){var c=0,e=b.length;if(3>e)return 0;for(var d=b[0],g=1;g<=e;++g){var h=g==e?b[0]:b[g];if(h.Y==a.Y&&(h.X==a.X||d.Y==a.Y&&h.X>a.X==d.X<a.X))return-1;if(d.Y<a.Y!=h.Y<a.Y)if(d.X>=a.X)if(h.X>a.X)c=1-c;else{var l=
(d.X-a.X)*(h.Y-a.Y)-(h.X-a.X)*(d.Y-a.Y);if(0==l)return-1;0<l==h.Y>d.Y&&(c=1-c)}else if(h.X>a.X){l=(d.X-a.X)*(h.Y-a.Y)-(h.X-a.X)*(d.Y-a.Y);if(0==l)return-1;0<l==h.Y>d.Y&&(c=1-c)}d=h}return c};d.Clipper.prototype.PointInPolygon=function(a,b){for(var c=0,e=b;;){var d=b.Pt.X,g=b.Pt.Y,h=b.Next.Pt.X,l=b.Next.Pt.Y;if(l==a.Y&&(h==a.X||g==a.Y&&h>a.X==d<a.X))return-1;if(g<a.Y!=l<a.Y)if(d>=a.X)if(h>a.X)c=1-c;else{d=(d-a.X)*(l-a.Y)-(h-a.X)*(g-a.Y);if(0==d)return-1;0<d==l>g&&(c=1-c)}else if(h>a.X){d=(d-a.X)*(l-
a.Y)-(h-a.X)*(g-a.Y);if(0==d)return-1;0<d==l>g&&(c=1-c)}b=b.Next;if(e==b)break}return c};d.Clipper.prototype.Poly2ContainsPoly1=function(a,b){var c=a;do{var e=this.PointInPolygon(c.Pt,b);if(0<=e)return 0!=e;c=c.Next}while(c!=a);return!0};d.Clipper.prototype.FixupFirstLefts1=function(a,b){for(var c=0,e=this.m_PolyOuts.length;c<e;c++){var d=this.m_PolyOuts[c];null!==d.Pts&&d.FirstLeft==a&&this.Poly2ContainsPoly1(d.Pts,b.Pts)&&(d.FirstLeft=b)}};d.Clipper.prototype.FixupFirstLefts2=function(a,b){for(var c=
0,e=this.m_PolyOuts,d=e.length,g=e[c];c<d;c++,g=e[c])g.FirstLeft==a&&(g.FirstLeft=b)};d.Clipper.ParseFirstLeft=function(a){for(;null!=a&&null==a.Pts;)a=a.FirstLeft;return a};d.Clipper.prototype.JoinCommonEdges=function(){for(var a=0,b=this.m_Joins.length;a<b;a++){var c=this.m_Joins[a],e=this.GetOutRec(c.OutPt1.Idx),f=this.GetOutRec(c.OutPt2.Idx);if(null!=e.Pts&&null!=f.Pts){var g;g=e==f?e:this.Param1RightOfParam2(e,f)?f:this.Param1RightOfParam2(f,e)?e:this.GetLowermostRec(e,f);if(this.JoinPoints(c,
e,f))if(e==f){e.Pts=c.OutPt1;e.BottomPt=null;f=this.CreateOutRec();f.Pts=c.OutPt2;this.UpdateOutPtIdxs(f);if(this.m_UsingPolyTree){g=0;for(var h=this.m_PolyOuts.length;g<h-1;g++){var l=this.m_PolyOuts[g];null!=l.Pts&&d.Clipper.ParseFirstLeft(l.FirstLeft)==e&&l.IsHole!=e.IsHole&&this.Poly2ContainsPoly1(l.Pts,c.OutPt2)&&(l.FirstLeft=f)}}this.Poly2ContainsPoly1(f.Pts,e.Pts)?(f.IsHole=!e.IsHole,f.FirstLeft=e,this.m_UsingPolyTree&&this.FixupFirstLefts2(f,e),(f.IsHole^this.ReverseSolution)==0<this.Area(f)&&
this.ReversePolyPtLinks(f.Pts)):this.Poly2ContainsPoly1(e.Pts,f.Pts)?(f.IsHole=e.IsHole,e.IsHole=!f.IsHole,f.FirstLeft=e.FirstLeft,e.FirstLeft=f,this.m_UsingPolyTree&&this.FixupFirstLefts2(e,f),(e.IsHole^this.ReverseSolution)==0<this.Area(e)&&this.ReversePolyPtLinks(e.Pts)):(f.IsHole=e.IsHole,f.FirstLeft=e.FirstLeft,this.m_UsingPolyTree&&this.FixupFirstLefts1(e,f))}else f.Pts=null,f.BottomPt=null,f.Idx=e.Idx,e.IsHole=g.IsHole,g==f&&(e.FirstLeft=f.FirstLeft),f.FirstLeft=e,this.m_UsingPolyTree&&this.FixupFirstLefts2(f,
e)}}};d.Clipper.prototype.UpdateOutPtIdxs=function(a){var b=a.Pts;do b.Idx=a.Idx,b=b.Prev;while(b!=a.Pts)};d.Clipper.prototype.DoSimplePolygons=function(){for(var a=0;a<this.m_PolyOuts.length;){var b=this.m_PolyOuts[a++],c=b.Pts;if(null!==c){do{for(var e=c.Next;e!=b.Pts;){if(d.IntPoint.op_Equality(c.Pt,e.Pt)&&e.Next!=c&&e.Prev!=c){var f=c.Prev,g=e.Prev;c.Prev=g;g.Next=c;e.Prev=f;f.Next=e;b.Pts=c;f=this.CreateOutRec();f.Pts=e;this.UpdateOutPtIdxs(f);this.Poly2ContainsPoly1(f.Pts,b.Pts)?(f.IsHole=!b.IsHole,
f.FirstLeft=b):this.Poly2ContainsPoly1(b.Pts,f.Pts)?(f.IsHole=b.IsHole,b.IsHole=!f.IsHole,f.FirstLeft=b.FirstLeft,b.FirstLeft=f):(f.IsHole=b.IsHole,f.FirstLeft=b.FirstLeft);e=c}e=e.Next}c=c.Next}while(c!=b.Pts)}}};d.Clipper.Area=function(a){var b=a.length;if(3>b)return 0;for(var c=0,e=0,d=b-1;e<b;++e)c+=(a[d].X+a[e].X)*(a[d].Y-a[e].Y),d=e;return 0.5*-c};d.Clipper.prototype.Area=function(a){var b=a.Pts;if(null==b)return 0;var c=0;do c+=(b.Prev.Pt.X+b.Pt.X)*(b.Prev.Pt.Y-b.Pt.Y),b=b.Next;while(b!=a.Pts);
return 0.5*c};d.Clipper.SimplifyPolygon=function(a,b){var c=[],e=new d.Clipper(0);e.StrictlySimple=!0;e.AddPath(a,d.PolyType.ptSubject,!0);e.Execute(d.ClipType.ctUnion,c,b,b);return c};d.Clipper.SimplifyPolygons=function(a,b){"undefined"==typeof b&&(b=d.PolyFillType.pftEvenOdd);var c=[],e=new d.Clipper(0);e.StrictlySimple=!0;e.AddPaths(a,d.PolyType.ptSubject,!0);e.Execute(d.ClipType.ctUnion,c,b,b);return c};d.Clipper.DistanceSqrd=function(a,b){var c=a.X-b.X,e=a.Y-b.Y;return c*c+e*e};d.Clipper.DistanceFromLineSqrd=
function(a,b,c){var e=b.Y-c.Y;c=c.X-b.X;b=e*b.X+c*b.Y;b=e*a.X+c*a.Y-b;return b*b/(e*e+c*c)};d.Clipper.SlopesNearCollinear=function(a,b,c,e){return d.Clipper.DistanceFromLineSqrd(b,a,c)<e};d.Clipper.PointsAreClose=function(a,b,c){var e=a.X-b.X;a=a.Y-b.Y;return e*e+a*a<=c};d.Clipper.ExcludeOp=function(a){var b=a.Prev;b.Next=a.Next;a.Next.Prev=b;b.Idx=0;return b};d.Clipper.CleanPolygon=function(a,b){"undefined"==typeof b&&(b=1.415);var c=a.length;if(0==c)return[];for(var e=Array(c),f=0;f<c;++f)e[f]=
new d.OutPt;for(f=0;f<c;++f)e[f].Pt=a[f],e[f].Next=e[(f+1)%c],e[f].Next.Prev=e[f],e[f].Idx=0;f=b*b;for(e=e[0];0==e.Idx&&e.Next!=e.Prev;)d.Clipper.PointsAreClose(e.Pt,e.Prev.Pt,f)?(e=d.Clipper.ExcludeOp(e),c--):d.Clipper.PointsAreClose(e.Prev.Pt,e.Next.Pt,f)?(d.Clipper.ExcludeOp(e.Next),e=d.Clipper.ExcludeOp(e),c-=2):d.Clipper.SlopesNearCollinear(e.Prev.Pt,e.Pt,e.Next.Pt,f)?(e=d.Clipper.ExcludeOp(e),c--):(e.Idx=1,e=e.Next);3>c&&(c=0);for(var g=Array(c),f=0;f<c;++f)g[f]=new d.IntPoint(e.Pt),e=e.Next;
return g};d.Clipper.CleanPolygons=function(a,b){for(var c=Array(a.length),e=0,f=a.length;e<f;e++)c[e]=d.Clipper.CleanPolygon(a[e],b);return c};d.Clipper.Minkowski=function(a,b,c,e){var f=e?1:0,g=a.length,h=b.length;e=[];if(c)for(c=0;c<h;c++){for(var l=Array(g),k=0,n=a.length,m=a[k];k<n;k++,m=a[k])l[k]=new d.IntPoint(b[c].X+m.X,b[c].Y+m.Y);e.push(l)}else for(c=0;c<h;c++){l=Array(g);k=0;n=a.length;for(m=a[k];k<n;k++,m=a[k])l[k]=new d.IntPoint(b[c].X-m.X,b[c].Y-m.Y);e.push(l)}a=[];for(c=0;c<h-1+f;c++)for(k=
0;k<g;k++)b=[],b.push(e[c%h][k%g]),b.push(e[(c+1)%h][k%g]),b.push(e[(c+1)%h][(k+1)%g]),b.push(e[c%h][(k+1)%g]),d.Clipper.Orientation(b)||b.reverse(),a.push(b);f=new d.Clipper(0);f.AddPaths(a,d.PolyType.ptSubject,!0);f.Execute(d.ClipType.ctUnion,e,d.PolyFillType.pftNonZero,d.PolyFillType.pftNonZero);return e};d.Clipper.MinkowskiSum=function(){var a=arguments,b=a.length;if(3==b){var c=a[0],e=a[2];return d.Clipper.Minkowski(c,a[1],!0,e)}if(4==b){for(var c=a[0],f=a[1],b=a[2],e=a[3],a=new d.Clipper,g,
h=0,l=f.length;h<l;++h)g=d.Clipper.Minkowski(c,f[h],!0,e),a.AddPaths(g,d.PolyType.ptSubject,!0);e&&a.AddPaths(f,d.PolyType.ptClip,!0);c=new d.Paths;a.Execute(d.ClipType.ctUnion,c,b,b);return c}};d.Clipper.MinkowskiDiff=function(a,b,c){return d.Clipper.Minkowski(a,b,!1,c)};d.Clipper.PolyTreeToPaths=function(a){var b=[];d.Clipper.AddPolyNodeToPaths(a,d.Clipper.NodeType.ntAny,b);return b};d.Clipper.AddPolyNodeToPaths=function(a,b,c){var e=!0;switch(b){case d.Clipper.NodeType.ntOpen:return;case d.Clipper.NodeType.ntClosed:e=
!a.IsOpen}0<a.m_polygon.length&&e&&c.push(a.m_polygon);e=0;a=a.Childs();for(var f=a.length,g=a[e];e<f;e++,g=a[e])d.Clipper.AddPolyNodeToPaths(g,b,c)};d.Clipper.OpenPathsFromPolyTree=function(a){for(var b=new d.Paths,c=0,e=a.ChildCount();c<e;c++)a.Childs()[c].IsOpen&&b.push(a.Childs()[c].m_polygon);return b};d.Clipper.ClosedPathsFromPolyTree=function(a){var b=new d.Paths;d.Clipper.AddPolyNodeToPaths(a,d.Clipper.NodeType.ntClosed,b);return b};K(d.Clipper,d.ClipperBase);d.Clipper.NodeType={ntAny:0,ntOpen:1,
ntClosed:2};d.ClipperOffset=function(a,b){"undefined"==typeof a&&(a=2);"undefined"==typeof b&&(b=d.ClipperOffset.def_arc_tolerance);this.m_destPolys=new d.Paths;this.m_srcPoly=new d.Path;this.m_destPoly=new d.Path;this.m_normals=[];this.m_StepsPerRad=this.m_miterLim=this.m_cos=this.m_sin=this.m_sinA=this.m_delta=0;this.m_lowest=new d.IntPoint;this.m_polyNodes=new d.PolyNode;this.MiterLimit=a;this.ArcTolerance=b;this.m_lowest.X=-1};d.ClipperOffset.two_pi=6.28318530717959;d.ClipperOffset.def_arc_tolerance=
0.25;d.ClipperOffset.prototype.Clear=function(){d.Clear(this.m_polyNodes.Childs());this.m_lowest.X=-1};d.ClipperOffset.Round=d.Clipper.Round;d.ClipperOffset.prototype.AddPath=function(a,b,c){var e=a.length-1;if(!(0>e)){var f=new d.PolyNode;f.m_jointype=b;f.m_endtype=c;if(c==d.EndType.etClosedLine||c==d.EndType.etClosedPolygon)for(;0<e&&d.IntPoint.op_Equality(a[0],a[e]);)e--;f.m_polygon.push(a[0]);var g=0;b=0;for(var h=1;h<=e;h++)d.IntPoint.op_Inequality(f.m_polygon[g],a[h])&&(g++,f.m_polygon.push(a[h]),
a[h].Y>f.m_polygon[b].Y||a[h].Y==f.m_polygon[b].Y&&a[h].X<f.m_polygon[b].X)&&(b=g);if(!(c==d.EndType.etClosedPolygon&&2>g||c!=d.EndType.etClosedPolygon&&0>g)&&(this.m_polyNodes.AddChild(f),c==d.EndType.etClosedPolygon))if(0>this.m_lowest.X)this.m_lowest=new d.IntPoint(0,b);else if(a=this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon[this.m_lowest.Y],f.m_polygon[b].Y>a.Y||f.m_polygon[b].Y==a.Y&&f.m_polygon[b].X<a.X)this.m_lowest=new d.IntPoint(this.m_polyNodes.ChildCount()-1,b)}};d.ClipperOffset.prototype.AddPaths=
function(a,b,c){for(var e=0,d=a.length;e<d;e++)this.AddPath(a[e],b,c)};d.ClipperOffset.prototype.FixOrientations=function(){if(0<=this.m_lowest.X&&!d.Clipper.Orientation(this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon))for(var a=0;a<this.m_polyNodes.ChildCount();a++){var b=this.m_polyNodes.Childs()[a];(b.m_endtype==d.EndType.etClosedPolygon||b.m_endtype==d.EndType.etClosedLine&&d.Clipper.Orientation(b.m_polygon))&&b.m_polygon.reverse()}else for(a=0;a<this.m_polyNodes.ChildCount();a++)b=this.m_polyNodes.Childs()[a],
b.m_endtype!=d.EndType.etClosedLine||d.Clipper.Orientation(b.m_polygon)||b.m_polygon.reverse()};d.ClipperOffset.GetUnitNormal=function(a,b){var c=b.X-a.X,e=b.Y-a.Y;if(0==c&&0==e)return new d.DoublePoint(0,0);var f=1/Math.sqrt(c*c+e*e);return new d.DoublePoint(e*f,-(c*f))};d.ClipperOffset.prototype.DoOffset=function(a){this.m_destPolys=[];this.m_delta=a;if(d.ClipperBase.near_zero(a))for(var b=0;b<this.m_polyNodes.ChildCount();b++){var c=this.m_polyNodes.Childs()[b];c.m_endtype==d.EndType.etClosedPolygon&&
this.m_destPolys.push(c.m_polygon)}else{this.m_miterLim=2<this.MiterLimit?2/(this.MiterLimit*this.MiterLimit):0.5;var b=0>=this.ArcTolerance?d.ClipperOffset.def_arc_tolerance:this.ArcTolerance>Math.abs(a)*d.ClipperOffset.def_arc_tolerance?Math.abs(a)*d.ClipperOffset.def_arc_tolerance:this.ArcTolerance,e=3.14159265358979/Math.acos(1-b/Math.abs(a));this.m_sin=Math.sin(d.ClipperOffset.two_pi/e);this.m_cos=Math.cos(d.ClipperOffset.two_pi/e);this.m_StepsPerRad=e/d.ClipperOffset.two_pi;0>a&&(this.m_sin=
-this.m_sin);for(b=0;b<this.m_polyNodes.ChildCount();b++){c=this.m_polyNodes.Childs()[b];this.m_srcPoly=c.m_polygon;var f=this.m_srcPoly.length;if(!(0==f||0>=a&&(3>f||c.m_endtype!=d.EndType.etClosedPolygon))){this.m_destPoly=[];if(1==f)if(c.m_jointype==d.JoinType.jtRound)for(var c=1,f=0,g=1;g<=e;g++){this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X+c*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y+f*a)));var h=c,c=c*this.m_cos-this.m_sin*f,f=h*this.m_sin+f*this.m_cos}else for(f=
c=-1,g=0;4>g;++g)this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X+c*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y+f*a))),0>c?c=1:0>f?f=1:c=-1;else{for(g=this.m_normals.length=0;g<f-1;g++)this.m_normals.push(d.ClipperOffset.GetUnitNormal(this.m_srcPoly[g],this.m_srcPoly[g+1]));c.m_endtype==d.EndType.etClosedLine||c.m_endtype==d.EndType.etClosedPolygon?this.m_normals.push(d.ClipperOffset.GetUnitNormal(this.m_srcPoly[f-1],this.m_srcPoly[0])):this.m_normals.push(new d.DoublePoint(this.m_normals[f-
2]));if(c.m_endtype==d.EndType.etClosedPolygon)for(h=f-1,g=0;g<f;g++)h=this.OffsetPoint(g,h,c.m_jointype);else if(c.m_endtype==d.EndType.etClosedLine){h=f-1;for(g=0;g<f;g++)h=this.OffsetPoint(g,h,c.m_jointype);this.m_destPolys.push(this.m_destPoly);this.m_destPoly=[];h=this.m_normals[f-1];for(g=f-1;0<g;g--)this.m_normals[g]=new d.DoublePoint(-this.m_normals[g-1].X,-this.m_normals[g-1].Y);this.m_normals[0]=new d.DoublePoint(-h.X,-h.Y);h=0;for(g=f-1;0<=g;g--)h=this.OffsetPoint(g,h,c.m_jointype)}else{h=
0;for(g=1;g<f-1;++g)h=this.OffsetPoint(g,h,c.m_jointype);c.m_endtype==d.EndType.etOpenButt?(g=f-1,h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[g].X+this.m_normals[g].X*a),d.ClipperOffset.Round(this.m_srcPoly[g].Y+this.m_normals[g].Y*a)),this.m_destPoly.push(h),h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[g].X-this.m_normals[g].X*a),d.ClipperOffset.Round(this.m_srcPoly[g].Y-this.m_normals[g].Y*a)),this.m_destPoly.push(h)):(g=f-1,h=f-2,this.m_sinA=0,this.m_normals[g]=new d.DoublePoint(-this.m_normals[g].X,
-this.m_normals[g].Y),c.m_endtype==d.EndType.etOpenSquare?this.DoSquare(g,h):this.DoRound(g,h));for(g=f-1;0<g;g--)this.m_normals[g]=new d.DoublePoint(-this.m_normals[g-1].X,-this.m_normals[g-1].Y);this.m_normals[0]=new d.DoublePoint(-this.m_normals[1].X,-this.m_normals[1].Y);h=f-1;for(g=h-1;0<g;--g)h=this.OffsetPoint(g,h,c.m_jointype);c.m_endtype==d.EndType.etOpenButt?(h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X-this.m_normals[0].X*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y-this.m_normals[0].Y*
a)),this.m_destPoly.push(h),h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X+this.m_normals[0].X*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y+this.m_normals[0].Y*a)),this.m_destPoly.push(h)):(this.m_sinA=0,c.m_endtype==d.EndType.etOpenSquare?this.DoSquare(0,1):this.DoRound(0,1))}}this.m_destPolys.push(this.m_destPoly)}}}};d.ClipperOffset.prototype.Execute=function(){var a=arguments;if(a[0]instanceof d.PolyTree)if(b=a[0],c=a[1],b.Clear(),this.FixOrientations(),this.DoOffset(c),a=new d.Clipper(0),
a.AddPaths(this.m_destPolys,d.PolyType.ptSubject,!0),0<c)a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftPositive,d.PolyFillType.pftPositive);else if(c=d.Clipper.GetBounds(this.m_destPolys),e=new d.Path,e.push(new d.IntPoint(c.left-10,c.bottom+10)),e.push(new d.IntPoint(c.right+10,c.bottom+10)),e.push(new d.IntPoint(c.right+10,c.top-10)),e.push(new d.IntPoint(c.left-10,c.top-10)),a.AddPath(e,d.PolyType.ptSubject,!0),a.ReverseSolution=!0,a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftNegative,d.PolyFillType.pftNegative),
1==b.ChildCount()&&0<b.Childs()[0].ChildCount())for(a=b.Childs()[0],b.Childs()[0]=a.Childs()[0],c=1;c<a.ChildCount();c++)b.AddChild(a.Childs()[c]);else b.Clear();else{var b=a[0],c=a[1];d.Clear(b);this.FixOrientations();this.DoOffset(c);a=new d.Clipper(0);a.AddPaths(this.m_destPolys,d.PolyType.ptSubject,!0);if(0<c)a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftPositive,d.PolyFillType.pftPositive);else{var c=d.Clipper.GetBounds(this.m_destPolys),e=new d.Path;e.push(new d.IntPoint(c.left-10,c.bottom+
10));e.push(new d.IntPoint(c.right+10,c.bottom+10));e.push(new d.IntPoint(c.right+10,c.top-10));e.push(new d.IntPoint(c.left-10,c.top-10));a.AddPath(e,d.PolyType.ptSubject,!0);a.ReverseSolution=!0;a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftNegative,d.PolyFillType.pftNegative);0<b.length&&b.splice(0,1)}}};d.ClipperOffset.prototype.OffsetPoint=function(a,b,c){this.m_sinA=this.m_normals[b].X*this.m_normals[a].Y-this.m_normals[a].X*this.m_normals[b].Y;if(5E-5>this.m_sinA&&-5E-5<this.m_sinA)return b;
1<this.m_sinA?this.m_sinA=1:-1>this.m_sinA&&(this.m_sinA=-1);if(0>this.m_sinA*this.m_delta)this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_normals[b].X*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_normals[b].Y*this.m_delta))),this.m_destPoly.push(new d.IntPoint(this.m_srcPoly[a])),this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_normals[a].X*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_normals[a].Y*
this.m_delta)));else switch(c){case d.JoinType.jtMiter:c=1+(this.m_normals[a].X*this.m_normals[b].X+this.m_normals[a].Y*this.m_normals[b].Y);c>=this.m_miterLim?this.DoMiter(a,b,c):this.DoSquare(a,b);break;case d.JoinType.jtSquare:this.DoSquare(a,b);break;case d.JoinType.jtRound:this.DoRound(a,b)}return a};d.ClipperOffset.prototype.DoSquare=function(a,b){var c=Math.tan(Math.atan2(this.m_sinA,this.m_normals[b].X*this.m_normals[a].X+this.m_normals[b].Y*this.m_normals[a].Y)/4);this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+
this.m_delta*(this.m_normals[b].X-this.m_normals[b].Y*c)),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_delta*(this.m_normals[b].Y+this.m_normals[b].X*c))));this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_delta*(this.m_normals[a].X+this.m_normals[a].Y*c)),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_delta*(this.m_normals[a].Y-this.m_normals[a].X*c))))};d.ClipperOffset.prototype.DoMiter=function(a,b,c){c=this.m_delta/c;this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+
(this.m_normals[b].X+this.m_normals[a].X)*c),d.ClipperOffset.Round(this.m_srcPoly[a].Y+(this.m_normals[b].Y+this.m_normals[a].Y)*c)))};d.ClipperOffset.prototype.DoRound=function(a,b){for(var c=Math.atan2(this.m_sinA,this.m_normals[b].X*this.m_normals[a].X+this.m_normals[b].Y*this.m_normals[a].Y),c=d.Cast_Int32(d.ClipperOffset.Round(this.m_StepsPerRad*Math.abs(c))),e=this.m_normals[b].X,f=this.m_normals[b].Y,g,h=0;h<c;++h)this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+
e*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+f*this.m_delta))),g=e,e=e*this.m_cos-this.m_sin*f,f=g*this.m_sin+f*this.m_cos;this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_normals[a].X*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_normals[a].Y*this.m_delta)))};d.Error=function(a){try{throw Error(a);}catch(b){alert(b.message)}};d.JS={};d.JS.AreaOfPolygon=function(a,b){b||(b=1);return d.Clipper.Area(a)/(b*b)};d.JS.AreaOfPolygons=function(a,
b){b||(b=1);for(var c=0,e=0;e<a.length;e++)c+=d.Clipper.Area(a[e]);return c/(b*b)};d.JS.BoundsOfPath=function(a,b){return d.JS.BoundsOfPaths([a],b)};d.JS.BoundsOfPaths=function(a,b){b||(b=1);var c=d.Clipper.GetBounds(a);c.left/=b;c.bottom/=b;c.right/=b;c.top/=b;return c};d.JS.Clean=function(a,b){if(!(a instanceof Array))return[];var c=a[0]instanceof Array;a=d.JS.Clone(a);if("number"!=typeof b||null===b)return d.Error("Delta is not a number in Clean()."),a;if(0===a.length||1==a.length&&0===a[0].length||
0>b)return a;c||(a=[a]);for(var e=a.length,f,g,h,l,k,n,m,p=[],q=0;q<e;q++)if(g=a[q],f=g.length,0!==f)if(3>f)h=g,p.push(h);else{h=g;l=b*b;k=g[0];for(m=n=1;m<f;m++)(g[m].X-k.X)*(g[m].X-k.X)+(g[m].Y-k.Y)*(g[m].Y-k.Y)<=l||(h[n]=g[m],k=g[m],n++);k=g[n-1];(g[0].X-k.X)*(g[0].X-k.X)+(g[0].Y-k.Y)*(g[0].Y-k.Y)<=l&&n--;n<f&&h.splice(n,f-n);h.length&&p.push(h)}!c&&p.length?p=p[0]:c||0!==p.length?c&&0===p.length&&(p=[[]]):p=[];return p};d.JS.Clone=function(a){if(!(a instanceof Array)||0===a.length)return[];if(1==
a.length&&0===a[0].length)return[[]];var b=a[0]instanceof Array;b||(a=[a]);var c=a.length,e,d,g,h,l=Array(c);for(d=0;d<c;d++){e=a[d].length;h=Array(e);for(g=0;g<e;g++)h[g]={X:a[d][g].X,Y:a[d][g].Y};l[d]=h}b||(l=l[0]);return l};d.JS.Lighten=function(a,b){if(!(a instanceof Array))return[];if("number"!=typeof b||null===b)return d.Error("Tolerance is not a number in Lighten()."),d.JS.Clone(a);if(0===a.length||1==a.length&&0===a[0].length||0>b)return d.JS.Clone(a);a[0]instanceof Array||(a=[a]);var c,e,
f,g,h,l,k,m,p,q,r,s,t,u,v,x=a.length,y=b*b,w=[];for(c=0;c<x;c++)if(f=a[c],l=f.length,0!=l){for(g=0;1E6>g;g++){h=[];l=f.length;f[l-1].X!=f[0].X||f[l-1].Y!=f[0].Y?(r=1,f.push({X:f[0].X,Y:f[0].Y}),l=f.length):r=0;q=[];for(e=0;e<l-2;e++){k=f[e];p=f[e+1];m=f[e+2];u=k.X;v=k.Y;k=m.X-u;s=m.Y-v;if(0!==k||0!==s)t=((p.X-u)*k+(p.Y-v)*s)/(k*k+s*s),1<t?(u=m.X,v=m.Y):0<t&&(u+=k*t,v+=s*t);k=p.X-u;s=p.Y-v;m=k*k+s*s;m<=y&&(q[e+1]=1,e++)}h.push({X:f[0].X,Y:f[0].Y});for(e=1;e<l-1;e++)q[e]||h.push({X:f[e].X,Y:f[e].Y});
h.push({X:f[l-1].X,Y:f[l-1].Y});r&&f.pop();if(q.length)f=h;else break}l=h.length;h[l-1].X==h[0].X&&h[l-1].Y==h[0].Y&&h.pop();2<h.length&&w.push(h)}!a[0]instanceof Array&&(w=w[0]);"undefined"==typeof w&&(w=[[]]);return w};d.JS.PerimeterOfPath=function(a,b,c){if("undefined"==typeof a)return 0;var e=Math.sqrt,d=0,g,h,k=0,m=g=0;h=0;var n=a.length;if(2>n)return 0;b&&(a[n]=a[0],n++);for(;--n;)g=a[n],k=g.X,g=g.Y,h=a[n-1],m=h.X,h=h.Y,d+=e((k-m)*(k-m)+(g-h)*(g-h));b&&a.pop();return d/c};d.JS.PerimeterOfPaths=
function(a,b,c){c||(c=1);for(var e=0,f=0;f<a.length;f++)e+=d.JS.PerimeterOfPath(a[f],b,c);return e};d.JS.ScaleDownPath=function(a,b){var c,d;b||(b=1);for(c=a.length;c--;)d=a[c],d.X/=b,d.Y/=b};d.JS.ScaleDownPaths=function(a,b){var c,d,f;b||(b=1);for(c=a.length;c--;)for(d=a[c].length;d--;)f=a[c][d],f.X/=b,f.Y/=b};d.JS.ScaleUpPath=function(a,b){var c,d,f=Math.round;b||(b=1);for(c=a.length;c--;)d=a[c],d.X=f(d.X*b),d.Y=f(d.Y*b)};d.JS.ScaleUpPaths=function(a,b){var c,d,f,g=Math.round;b||(b=1);for(c=a.length;c--;)for(d=
a[c].length;d--;)f=a[c][d],f.X=g(f.X*b),f.Y=g(f.Y*b)};d.ExPolygons=function(){return[]};d.ExPolygon=function(){this.holes=this.outer=null};d.JS.AddOuterPolyNodeToExPolygons=function(a,b){var c=new d.ExPolygon;c.outer=a.Contour();var e=a.Childs(),f=e.length;c.holes=Array(f);var g,h,k,m,n;for(h=0;h<f;h++)for(g=e[h],c.holes[h]=g.Contour(),k=0,m=g.Childs(),n=m.length;k<n;k++)g=m[k],d.JS.AddOuterPolyNodeToExPolygons(g,b);b.push(c)};d.JS.ExPolygonsToPaths=function(a){var b,c,e,f,g=new d.Paths;b=0;for(e=
a.length;b<e;b++)for(g.push(a[b].outer),c=0,f=a[b].holes.length;c<f;c++)g.push(a[b].holes[c]);return g};d.JS.PolyTreeToExPolygons=function(a){var b=new d.ExPolygons,c,e,f;c=0;e=a.Childs();for(f=e.length;c<f;c++)a=e[c],d.JS.AddOuterPolyNodeToExPolygons(a,b);return b}})();

; browserify_shim__define__module__export__(typeof ClipperLib != "undefined" ? ClipperLib : window.ClipperLib);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
;(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();

},{}],3:[function(_dereq_,module,exports){
(function (global){
/*! poly2tri v1.3.5 | (c) 2009-2014 Poly2Tri Contributors */
!function(t){if("object"==typeof exports)module.exports=t();else if("function"==typeof define&&define.amd)define(t);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.poly2tri=t()}}(function(){return function t(n,e,i){function o(s,p){if(!e[s]){if(!n[s]){var a="function"==typeof _dereq_&&_dereq_;if(!p&&a)return a(s,!0);if(r)return r(s,!0);throw new Error("Cannot find module '"+s+"'")}var h=e[s]={exports:{}};n[s][0].call(h.exports,function(t){var e=n[s][1][t];return o(e?e:t)},h,h.exports,t,n,e,i)}return e[s].exports}for(var r="function"==typeof _dereq_&&_dereq_,s=0;s<i.length;s++)o(i[s]);return o}({1:[function(t,n){n.exports={version:"1.3.5"}},{}],2:[function(t,n){"use strict";var e=function(t,n){this.point=t,this.triangle=n||null,this.next=null,this.prev=null,this.value=t.x},i=function(t,n){this.head_=t,this.tail_=n,this.search_node_=t};i.prototype.head=function(){return this.head_},i.prototype.setHead=function(t){this.head_=t},i.prototype.tail=function(){return this.tail_},i.prototype.setTail=function(t){this.tail_=t},i.prototype.search=function(){return this.search_node_},i.prototype.setSearch=function(t){this.search_node_=t},i.prototype.findSearchNode=function(){return this.search_node_},i.prototype.locateNode=function(t){var n=this.search_node_;if(t<n.value){for(;n=n.prev;)if(t>=n.value)return this.search_node_=n,n}else for(;n=n.next;)if(t<n.value)return this.search_node_=n.prev,n.prev;return null},i.prototype.locatePoint=function(t){var n=t.x,e=this.findSearchNode(n),i=e.point.x;if(n===i){if(t!==e.point)if(t===e.prev.point)e=e.prev;else{if(t!==e.next.point)throw new Error("poly2tri Invalid AdvancingFront.locatePoint() call");e=e.next}}else if(i>n)for(;(e=e.prev)&&t!==e.point;);else for(;(e=e.next)&&t!==e.point;);return e&&(this.search_node_=e),e},n.exports=i,n.exports.Node=e},{}],3:[function(t,n){"use strict";function e(t,n){if(!t)throw new Error(n||"Assert Failed")}n.exports=e},{}],4:[function(t,n){"use strict";var e=t("./xy"),i=function(t,n){this.x=+t||0,this.y=+n||0,this._p2t_edge_list=null};i.prototype.toString=function(){return e.toStringBase(this)},i.prototype.toJSON=function(){return{x:this.x,y:this.y}},i.prototype.clone=function(){return new i(this.x,this.y)},i.prototype.set_zero=function(){return this.x=0,this.y=0,this},i.prototype.set=function(t,n){return this.x=+t||0,this.y=+n||0,this},i.prototype.negate=function(){return this.x=-this.x,this.y=-this.y,this},i.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this},i.prototype.sub=function(t){return this.x-=t.x,this.y-=t.y,this},i.prototype.mul=function(t){return this.x*=t,this.y*=t,this},i.prototype.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},i.prototype.normalize=function(){var t=this.length();return this.x/=t,this.y/=t,t},i.prototype.equals=function(t){return this.x===t.x&&this.y===t.y},i.negate=function(t){return new i(-t.x,-t.y)},i.add=function(t,n){return new i(t.x+n.x,t.y+n.y)},i.sub=function(t,n){return new i(t.x-n.x,t.y-n.y)},i.mul=function(t,n){return new i(t*n.x,t*n.y)},i.cross=function(t,n){return"number"==typeof t?"number"==typeof n?t*n:new i(-t*n.y,t*n.x):"number"==typeof n?new i(n*t.y,-n*t.x):t.x*n.y-t.y*n.x},i.toString=e.toString,i.compare=e.compare,i.cmp=e.compare,i.equals=e.equals,i.dot=function(t,n){return t.x*n.x+t.y*n.y},n.exports=i},{"./xy":11}],5:[function(t,n){"use strict";var e=t("./xy"),i=function(t,n){this.name="PointError",this.points=n=n||[],this.message=t||"Invalid Points!";for(var i=0;i<n.length;i++)this.message+=" "+e.toString(n[i])};i.prototype=new Error,i.prototype.constructor=i,n.exports=i},{"./xy":11}],6:[function(t,n,e){(function(n){"use strict";var i=n.poly2tri;e.noConflict=function(){return n.poly2tri=i,e},e.VERSION=t("../dist/version.json").version,e.PointError=t("./pointerror"),e.Point=t("./point"),e.Triangle=t("./triangle"),e.SweepContext=t("./sweepcontext");var o=t("./sweep");e.triangulate=o.triangulate,e.sweep={Triangulate:o.triangulate}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../dist/version.json":1,"./point":4,"./pointerror":5,"./sweep":7,"./sweepcontext":8,"./triangle":9}],7:[function(t,n,e){"use strict";function i(t){t.initTriangulation(),t.createAdvancingFront(),o(t),r(t)}function o(t){var n,e=t.pointCount();for(n=1;e>n;++n)for(var i=t.getPoint(n),o=s(t,i),r=i._p2t_edge_list,a=0;r&&a<r.length;++a)p(t,r[a],o)}function r(t){for(var n=t.front().head().next.triangle,e=t.front().head().next.point;!n.getConstrainedEdgeCW(e);)n=n.neighborCCW(e);t.meshClean(n)}function s(t,n){var e=t.locateNode(n),i=u(t,n,e);return n.x<=e.point.x+F&&d(t,e),g(t,i),i}function p(t,n,e){t.edge_event.constrained_edge=n,t.edge_event.right=n.p.x>n.q.x,h(e.triangle,n.p,n.q)||(C(t,n,e),a(t,n.p,n.q,e.triangle,n.q))}function a(t,n,e,i,o){if(!h(i,n,e)){var r=i.pointCCW(o),s=z(e,r,n);if(s===M.COLLINEAR)throw new D("poly2tri EdgeEvent: Collinear not supported!",[e,r,n]);var p=i.pointCW(o),u=z(e,p,n);if(u===M.COLLINEAR)throw new D("poly2tri EdgeEvent: Collinear not supported!",[e,p,n]);s===u?(i=s===M.CW?i.neighborCCW(o):i.neighborCW(o),a(t,n,e,i,o)):q(t,n,e,i,o)}}function h(t,n,e){var i=t.edgeIndex(n,e);if(-1!==i){t.markConstrainedEdgeByIndex(i);var o=t.getNeighbor(i);return o&&o.markConstrainedEdgeByPoints(n,e),!0}return!1}function u(t,n,e){var i=new O(n,e.point,e.next.point);i.markNeighbor(e.triangle),t.addToMap(i);var o=new B(n);return o.next=e.next,o.prev=e,e.next.prev=o,e.next=o,l(t,i)||t.mapTriangleToNodes(i),o}function d(t,n){var e=new O(n.prev.point,n.point,n.next.point);e.markNeighbor(n.prev.triangle),e.markNeighbor(n.triangle),t.addToMap(e),n.prev.next=n.next,n.next.prev=n.prev,l(t,e)||t.mapTriangleToNodes(e)}function g(t,n){for(var e=n.next;e.next&&!j(e.point,e.next.point,e.prev.point);)d(t,e),e=e.next;for(e=n.prev;e.prev&&!j(e.point,e.next.point,e.prev.point);)d(t,e),e=e.prev;n.next&&n.next.next&&f(n)&&y(t,n)}function f(t){var n=t.point.x-t.next.next.point.x,e=t.point.y-t.next.next.point.y;return S(e>=0,"unordered y"),n>=0||Math.abs(n)<e}function l(t,n){for(var e=0;3>e;++e)if(!n.delaunay_edge[e]){var i=n.getNeighbor(e);if(i){var o=n.getPoint(e),r=i.oppositePoint(n,o),s=i.index(r);if(i.constrained_edge[s]||i.delaunay_edge[s]){n.constrained_edge[e]=i.constrained_edge[s];continue}var p=c(o,n.pointCCW(o),n.pointCW(o),r);if(p){n.delaunay_edge[e]=!0,i.delaunay_edge[s]=!0,_(n,o,i,r);var a=!l(t,n);return a&&t.mapTriangleToNodes(n),a=!l(t,i),a&&t.mapTriangleToNodes(i),n.delaunay_edge[e]=!1,i.delaunay_edge[s]=!1,!0}}}return!1}function c(t,n,e,i){var o=t.x-i.x,r=t.y-i.y,s=n.x-i.x,p=n.y-i.y,a=o*p,h=s*r,u=a-h;if(0>=u)return!1;var d=e.x-i.x,g=e.y-i.y,f=d*r,l=o*g,c=f-l;if(0>=c)return!1;var _=s*g,y=d*p,x=o*o+r*r,v=s*s+p*p,C=d*d+g*g,b=x*(_-y)+v*c+C*u;return b>0}function _(t,n,e,i){var o,r,s,p;o=t.neighborCCW(n),r=t.neighborCW(n),s=e.neighborCCW(i),p=e.neighborCW(i);var a,h,u,d;a=t.getConstrainedEdgeCCW(n),h=t.getConstrainedEdgeCW(n),u=e.getConstrainedEdgeCCW(i),d=e.getConstrainedEdgeCW(i);var g,f,l,c;g=t.getDelaunayEdgeCCW(n),f=t.getDelaunayEdgeCW(n),l=e.getDelaunayEdgeCCW(i),c=e.getDelaunayEdgeCW(i),t.legalize(n,i),e.legalize(i,n),e.setDelaunayEdgeCCW(n,g),t.setDelaunayEdgeCW(n,f),t.setDelaunayEdgeCCW(i,l),e.setDelaunayEdgeCW(i,c),e.setConstrainedEdgeCCW(n,a),t.setConstrainedEdgeCW(n,h),t.setConstrainedEdgeCCW(i,u),e.setConstrainedEdgeCW(i,d),t.clearNeighbors(),e.clearNeighbors(),o&&e.markNeighbor(o),r&&t.markNeighbor(r),s&&t.markNeighbor(s),p&&e.markNeighbor(p),t.markNeighbor(e)}function y(t,n){for(t.basin.left_node=z(n.point,n.next.point,n.next.next.point)===M.CCW?n.next.next:n.next,t.basin.bottom_node=t.basin.left_node;t.basin.bottom_node.next&&t.basin.bottom_node.point.y>=t.basin.bottom_node.next.point.y;)t.basin.bottom_node=t.basin.bottom_node.next;if(t.basin.bottom_node!==t.basin.left_node){for(t.basin.right_node=t.basin.bottom_node;t.basin.right_node.next&&t.basin.right_node.point.y<t.basin.right_node.next.point.y;)t.basin.right_node=t.basin.right_node.next;t.basin.right_node!==t.basin.bottom_node&&(t.basin.width=t.basin.right_node.point.x-t.basin.left_node.point.x,t.basin.left_highest=t.basin.left_node.point.y>t.basin.right_node.point.y,x(t,t.basin.bottom_node))}}function x(t,n){if(!v(t,n)){d(t,n);var e;if(n.prev!==t.basin.left_node||n.next!==t.basin.right_node){if(n.prev===t.basin.left_node){if(e=z(n.point,n.next.point,n.next.next.point),e===M.CW)return;n=n.next}else if(n.next===t.basin.right_node){if(e=z(n.point,n.prev.point,n.prev.prev.point),e===M.CCW)return;n=n.prev}else n=n.prev.point.y<n.next.point.y?n.prev:n.next;x(t,n)}}}function v(t,n){var e;return e=t.basin.left_highest?t.basin.left_node.point.y-n.point.y:t.basin.right_node.point.y-n.point.y,t.basin.width>e?!0:!1}function C(t,n,e){t.edge_event.right?b(t,n,e):E(t,n,e)}function b(t,n,e){for(;e.next.point.x<n.p.x;)z(n.q,e.next.point,n.p)===M.CCW?m(t,n,e):e=e.next}function m(t,n,e){e.point.x<n.p.x&&(z(e.point,e.next.point,e.next.next.point)===M.CCW?W(t,n,e):(w(t,n,e),m(t,n,e)))}function W(t,n,e){d(t,e.next),e.next.point!==n.p&&z(n.q,e.next.point,n.p)===M.CCW&&z(e.point,e.next.point,e.next.next.point)===M.CCW&&W(t,n,e)}function w(t,n,e){z(e.next.point,e.next.next.point,e.next.next.next.point)===M.CCW?W(t,n,e.next):z(n.q,e.next.next.point,n.p)===M.CCW&&w(t,n,e.next)}function E(t,n,e){for(;e.prev.point.x>n.p.x;)z(n.q,e.prev.point,n.p)===M.CW?P(t,n,e):e=e.prev}function P(t,n,e){e.point.x>n.p.x&&(z(e.point,e.prev.point,e.prev.prev.point)===M.CW?T(t,n,e):(N(t,n,e),P(t,n,e)))}function N(t,n,e){z(e.prev.point,e.prev.prev.point,e.prev.prev.prev.point)===M.CW?T(t,n,e.prev):z(n.q,e.prev.prev.point,n.p)===M.CW&&N(t,n,e.prev)}function T(t,n,e){d(t,e.prev),e.prev.point!==n.p&&z(n.q,e.prev.point,n.p)===M.CW&&z(e.point,e.prev.point,e.prev.prev.point)===M.CW&&T(t,n,e)}function q(t,n,e,i,o){var r=i.neighborAcross(o);S(r,"FLIP failed due to missing triangle!");var s=r.oppositePoint(i,o);if(i.getConstrainedEdgeAcross(o)){var p=i.index(o);throw new D("poly2tri Intersecting Constraints",[o,s,i.getPoint((p+1)%3),i.getPoint((p+2)%3)])}if(H(o,i.pointCCW(o),i.pointCW(o),s))if(_(i,o,r,s),t.mapTriangleToNodes(i),t.mapTriangleToNodes(r),o===e&&s===n)e===t.edge_event.constrained_edge.q&&n===t.edge_event.constrained_edge.p&&(i.markConstrainedEdgeByPoints(n,e),r.markConstrainedEdgeByPoints(n,e),l(t,i),l(t,r));else{var h=z(e,s,n);i=I(t,h,i,r,o,s),q(t,n,e,i,o)}else{var u=k(n,e,r,s);A(t,n,e,i,r,u),a(t,n,e,i,o)}}function I(t,n,e,i,o,r){var s;return n===M.CCW?(s=i.edgeIndex(o,r),i.delaunay_edge[s]=!0,l(t,i),i.clearDelaunayEdges(),e):(s=e.edgeIndex(o,r),e.delaunay_edge[s]=!0,l(t,e),e.clearDelaunayEdges(),i)}function k(t,n,e,i){var o=z(n,i,t);if(o===M.CW)return e.pointCCW(i);if(o===M.CCW)return e.pointCW(i);throw new D("poly2tri [Unsupported] nextFlipPoint: opposing point on constrained edge!",[n,i,t])}function A(t,n,e,i,o,r){var s=o.neighborAcross(r);S(s,"FLIP failed due to missing triangle");var p=s.oppositePoint(o,r);if(H(e,i.pointCCW(e),i.pointCW(e),p))q(t,e,p,s,p);else{var a=k(n,e,s,p);A(t,n,e,i,s,a)}}var S=t("./assert"),D=t("./pointerror"),O=t("./triangle"),B=t("./advancingfront").Node,L=t("./utils"),F=L.EPSILON,M=L.Orientation,z=L.orient2d,H=L.inScanArea,j=L.isAngleObtuse;e.triangulate=i},{"./advancingfront":2,"./assert":3,"./pointerror":5,"./triangle":9,"./utils":10}],8:[function(t,n){"use strict";var e=t("./pointerror"),i=t("./point"),o=t("./triangle"),r=t("./sweep"),s=t("./advancingfront"),p=s.Node,a=.3,h=function(t,n){if(this.p=t,this.q=n,t.y>n.y)this.q=t,this.p=n;else if(t.y===n.y)if(t.x>n.x)this.q=t,this.p=n;else if(t.x===n.x)throw new e("poly2tri Invalid Edge constructor: repeated points!",[t]);this.q._p2t_edge_list||(this.q._p2t_edge_list=[]),this.q._p2t_edge_list.push(this)},u=function(){this.left_node=null,this.bottom_node=null,this.right_node=null,this.width=0,this.left_highest=!1};u.prototype.clear=function(){this.left_node=null,this.bottom_node=null,this.right_node=null,this.width=0,this.left_highest=!1};var d=function(){this.constrained_edge=null,this.right=!1},g=function(t,n){n=n||{},this.triangles_=[],this.map_=[],this.points_=n.cloneArrays?t.slice(0):t,this.edge_list=[],this.pmin_=this.pmax_=null,this.front_=null,this.head_=null,this.tail_=null,this.af_head_=null,this.af_middle_=null,this.af_tail_=null,this.basin=new u,this.edge_event=new d,this.initEdges(this.points_)};g.prototype.addHole=function(t){this.initEdges(t);var n,e=t.length;for(n=0;e>n;n++)this.points_.push(t[n]);return this},g.prototype.AddHole=g.prototype.addHole,g.prototype.addHoles=function(t){var n,e=t.length;for(n=0;e>n;n++)this.initEdges(t[n]);return this.points_=this.points_.concat.apply(this.points_,t),this},g.prototype.addPoint=function(t){return this.points_.push(t),this},g.prototype.AddPoint=g.prototype.addPoint,g.prototype.addPoints=function(t){return this.points_=this.points_.concat(t),this},g.prototype.triangulate=function(){return r.triangulate(this),this},g.prototype.getBoundingBox=function(){return{min:this.pmin_,max:this.pmax_}},g.prototype.getTriangles=function(){return this.triangles_},g.prototype.GetTriangles=g.prototype.getTriangles,g.prototype.front=function(){return this.front_},g.prototype.pointCount=function(){return this.points_.length},g.prototype.head=function(){return this.head_},g.prototype.setHead=function(t){this.head_=t},g.prototype.tail=function(){return this.tail_},g.prototype.setTail=function(t){this.tail_=t},g.prototype.getMap=function(){return this.map_},g.prototype.initTriangulation=function(){var t,n=this.points_[0].x,e=this.points_[0].x,o=this.points_[0].y,r=this.points_[0].y,s=this.points_.length;for(t=1;s>t;t++){var p=this.points_[t];p.x>n&&(n=p.x),p.x<e&&(e=p.x),p.y>o&&(o=p.y),p.y<r&&(r=p.y)}this.pmin_=new i(e,r),this.pmax_=new i(n,o);var h=a*(n-e),u=a*(o-r);this.head_=new i(n+h,r-u),this.tail_=new i(e-h,r-u),this.points_.sort(i.compare)},g.prototype.initEdges=function(t){var n,e=t.length;for(n=0;e>n;++n)this.edge_list.push(new h(t[n],t[(n+1)%e]))},g.prototype.getPoint=function(t){return this.points_[t]},g.prototype.addToMap=function(t){this.map_.push(t)},g.prototype.locateNode=function(t){return this.front_.locateNode(t.x)},g.prototype.createAdvancingFront=function(){var t,n,e,i=new o(this.points_[0],this.tail_,this.head_);this.map_.push(i),t=new p(i.getPoint(1),i),n=new p(i.getPoint(0),i),e=new p(i.getPoint(2)),this.front_=new s(t,e),t.next=n,n.next=e,n.prev=t,e.prev=n},g.prototype.removeNode=function(){},g.prototype.mapTriangleToNodes=function(t){for(var n=0;3>n;++n)if(!t.getNeighbor(n)){var e=this.front_.locatePoint(t.pointCW(t.getPoint(n)));e&&(e.triangle=t)}},g.prototype.removeFromMap=function(t){var n,e=this.map_,i=e.length;for(n=0;i>n;n++)if(e[n]===t){e.splice(n,1);break}},g.prototype.meshClean=function(t){for(var n,e,i=[t];n=i.pop();)if(!n.isInterior())for(n.setInterior(!0),this.triangles_.push(n),e=0;3>e;e++)n.constrained_edge[e]||i.push(n.getNeighbor(e))},n.exports=g},{"./advancingfront":2,"./point":4,"./pointerror":5,"./sweep":7,"./triangle":9}],9:[function(t,n){"use strict";var e=t("./xy"),i=function(t,n,e){this.points_=[t,n,e],this.neighbors_=[null,null,null],this.interior_=!1,this.constrained_edge=[!1,!1,!1],this.delaunay_edge=[!1,!1,!1]},o=e.toString;i.prototype.toString=function(){return"["+o(this.points_[0])+o(this.points_[1])+o(this.points_[2])+"]"},i.prototype.getPoint=function(t){return this.points_[t]},i.prototype.GetPoint=i.prototype.getPoint,i.prototype.getPoints=function(){return this.points_},i.prototype.getNeighbor=function(t){return this.neighbors_[t]},i.prototype.containsPoint=function(t){var n=this.points_;return t===n[0]||t===n[1]||t===n[2]},i.prototype.containsEdge=function(t){return this.containsPoint(t.p)&&this.containsPoint(t.q)},i.prototype.containsPoints=function(t,n){return this.containsPoint(t)&&this.containsPoint(n)},i.prototype.isInterior=function(){return this.interior_},i.prototype.setInterior=function(t){return this.interior_=t,this},i.prototype.markNeighborPointers=function(t,n,e){var i=this.points_;if(t===i[2]&&n===i[1]||t===i[1]&&n===i[2])this.neighbors_[0]=e;else if(t===i[0]&&n===i[2]||t===i[2]&&n===i[0])this.neighbors_[1]=e;else{if(!(t===i[0]&&n===i[1]||t===i[1]&&n===i[0]))throw new Error("poly2tri Invalid Triangle.markNeighborPointers() call");this.neighbors_[2]=e}},i.prototype.markNeighbor=function(t){var n=this.points_;t.containsPoints(n[1],n[2])?(this.neighbors_[0]=t,t.markNeighborPointers(n[1],n[2],this)):t.containsPoints(n[0],n[2])?(this.neighbors_[1]=t,t.markNeighborPointers(n[0],n[2],this)):t.containsPoints(n[0],n[1])&&(this.neighbors_[2]=t,t.markNeighborPointers(n[0],n[1],this))},i.prototype.clearNeighbors=function(){this.neighbors_[0]=null,this.neighbors_[1]=null,this.neighbors_[2]=null},i.prototype.clearDelaunayEdges=function(){this.delaunay_edge[0]=!1,this.delaunay_edge[1]=!1,this.delaunay_edge[2]=!1},i.prototype.pointCW=function(t){var n=this.points_;return t===n[0]?n[2]:t===n[1]?n[0]:t===n[2]?n[1]:null},i.prototype.pointCCW=function(t){var n=this.points_;return t===n[0]?n[1]:t===n[1]?n[2]:t===n[2]?n[0]:null},i.prototype.neighborCW=function(t){return t===this.points_[0]?this.neighbors_[1]:t===this.points_[1]?this.neighbors_[2]:this.neighbors_[0]},i.prototype.neighborCCW=function(t){return t===this.points_[0]?this.neighbors_[2]:t===this.points_[1]?this.neighbors_[0]:this.neighbors_[1]},i.prototype.getConstrainedEdgeCW=function(t){return t===this.points_[0]?this.constrained_edge[1]:t===this.points_[1]?this.constrained_edge[2]:this.constrained_edge[0]},i.prototype.getConstrainedEdgeCCW=function(t){return t===this.points_[0]?this.constrained_edge[2]:t===this.points_[1]?this.constrained_edge[0]:this.constrained_edge[1]},i.prototype.getConstrainedEdgeAcross=function(t){return t===this.points_[0]?this.constrained_edge[0]:t===this.points_[1]?this.constrained_edge[1]:this.constrained_edge[2]},i.prototype.setConstrainedEdgeCW=function(t,n){t===this.points_[0]?this.constrained_edge[1]=n:t===this.points_[1]?this.constrained_edge[2]=n:this.constrained_edge[0]=n},i.prototype.setConstrainedEdgeCCW=function(t,n){t===this.points_[0]?this.constrained_edge[2]=n:t===this.points_[1]?this.constrained_edge[0]=n:this.constrained_edge[1]=n},i.prototype.getDelaunayEdgeCW=function(t){return t===this.points_[0]?this.delaunay_edge[1]:t===this.points_[1]?this.delaunay_edge[2]:this.delaunay_edge[0]},i.prototype.getDelaunayEdgeCCW=function(t){return t===this.points_[0]?this.delaunay_edge[2]:t===this.points_[1]?this.delaunay_edge[0]:this.delaunay_edge[1]},i.prototype.setDelaunayEdgeCW=function(t,n){t===this.points_[0]?this.delaunay_edge[1]=n:t===this.points_[1]?this.delaunay_edge[2]=n:this.delaunay_edge[0]=n},i.prototype.setDelaunayEdgeCCW=function(t,n){t===this.points_[0]?this.delaunay_edge[2]=n:t===this.points_[1]?this.delaunay_edge[0]=n:this.delaunay_edge[1]=n},i.prototype.neighborAcross=function(t){return t===this.points_[0]?this.neighbors_[0]:t===this.points_[1]?this.neighbors_[1]:this.neighbors_[2]},i.prototype.oppositePoint=function(t,n){var e=t.pointCW(n);return this.pointCW(e)},i.prototype.legalize=function(t,n){var e=this.points_;if(t===e[0])e[1]=e[0],e[0]=e[2],e[2]=n;else if(t===e[1])e[2]=e[1],e[1]=e[0],e[0]=n;else{if(t!==e[2])throw new Error("poly2tri Invalid Triangle.legalize() call");e[0]=e[2],e[2]=e[1],e[1]=n}},i.prototype.index=function(t){var n=this.points_;if(t===n[0])return 0;if(t===n[1])return 1;if(t===n[2])return 2;throw new Error("poly2tri Invalid Triangle.index() call")},i.prototype.edgeIndex=function(t,n){var e=this.points_;if(t===e[0]){if(n===e[1])return 2;if(n===e[2])return 1}else if(t===e[1]){if(n===e[2])return 0;if(n===e[0])return 2}else if(t===e[2]){if(n===e[0])return 1;if(n===e[1])return 0}return-1},i.prototype.markConstrainedEdgeByIndex=function(t){this.constrained_edge[t]=!0},i.prototype.markConstrainedEdgeByEdge=function(t){this.markConstrainedEdgeByPoints(t.p,t.q)},i.prototype.markConstrainedEdgeByPoints=function(t,n){var e=this.points_;n===e[0]&&t===e[1]||n===e[1]&&t===e[0]?this.constrained_edge[2]=!0:n===e[0]&&t===e[2]||n===e[2]&&t===e[0]?this.constrained_edge[1]=!0:(n===e[1]&&t===e[2]||n===e[2]&&t===e[1])&&(this.constrained_edge[0]=!0)},n.exports=i},{"./xy":11}],10:[function(t,n,e){"use strict";function i(t,n,e){var i=(t.x-e.x)*(n.y-e.y),o=(t.y-e.y)*(n.x-e.x),r=i-o;return r>-s&&s>r?p.COLLINEAR:r>0?p.CCW:p.CW}function o(t,n,e,i){var o=(t.x-n.x)*(i.y-n.y)-(i.x-n.x)*(t.y-n.y);if(o>=-s)return!1;var r=(t.x-e.x)*(i.y-e.y)-(i.x-e.x)*(t.y-e.y);return s>=r?!1:!0}function r(t,n,e){var i=n.x-t.x,o=n.y-t.y,r=e.x-t.x,s=e.y-t.y;return 0>i*r+o*s}var s=1e-12;e.EPSILON=s;var p={CW:1,CCW:-1,COLLINEAR:0};e.Orientation=p,e.orient2d=i,e.inScanArea=o,e.isAngleObtuse=r},{}],11:[function(t,n){"use strict";function e(t){return"("+t.x+";"+t.y+")"}function i(t){var n=t.toString();return"[object Object]"===n?e(t):n}function o(t,n){return t.y===n.y?t.x-n.x:t.y-n.y}function r(t,n){return t.x===n.x&&t.y===n.y}n.exports={toString:i,toStringBase:e,compare:o,equals:r}},{}]},{},[6])(6)});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(_dereq_,module,exports){
(function (global){
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.PriorityQueue=t()}}(function(){return function t(e,i,r){function o(n,s){if(!i[n]){if(!e[n]){var u="function"==typeof _dereq_&&_dereq_;if(!s&&u)return u(n,!0);if(a)return a(n,!0);var h=new Error("Cannot find module '"+n+"'");throw h.code="MODULE_NOT_FOUND",h}var p=i[n]={exports:{}};e[n][0].call(p.exports,function(t){var i=e[n][1][t];return o(i?i:t)},p,p.exports,t,e,i,r)}return i[n].exports}for(var a="function"==typeof _dereq_&&_dereq_,n=0;n<r.length;n++)o(r[n]);return o}({1:[function(t,e){var i,r,o,a,n,s={}.hasOwnProperty,u=function(t,e){function i(){this.constructor=t}for(var r in e)s.call(e,r)&&(t[r]=e[r]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t};i=t("./PriorityQueue/AbstractPriorityQueue"),r=t("./PriorityQueue/ArrayStrategy"),a=t("./PriorityQueue/BinaryHeapStrategy"),o=t("./PriorityQueue/BHeapStrategy"),n=function(t){function e(t){t||(t={}),t.strategy||(t.strategy=a),t.comparator||(t.comparator=function(t,e){return(t||0)-(e||0)}),e.__super__.constructor.call(this,t)}return u(e,t),e}(i),n.ArrayStrategy=r,n.BinaryHeapStrategy=a,n.BHeapStrategy=o,e.exports=n},{"./PriorityQueue/AbstractPriorityQueue":2,"./PriorityQueue/ArrayStrategy":3,"./PriorityQueue/BHeapStrategy":4,"./PriorityQueue/BinaryHeapStrategy":5}],2:[function(t,e){var i;e.exports=i=function(){function t(t){if(null==(null!=t?t.strategy:void 0))throw"Must pass options.strategy, a strategy";if(null==(null!=t?t.comparator:void 0))throw"Must pass options.comparator, a comparator";this.priv=new t.strategy(t),this.length=0}return t.prototype.queue=function(t){return this.length++,void this.priv.queue(t)},t.prototype.dequeue=function(){if(!this.length)throw"Empty queue";return this.length--,this.priv.dequeue()},t.prototype.peek=function(){if(!this.length)throw"Empty queue";return this.priv.peek()},t}()},{}],3:[function(t,e){var i,r;r=function(t,e,i){var r,o,a;for(o=0,r=t.length;r>o;)a=o+r>>>1,i(t[a],e)>=0?o=a+1:r=a;return o},e.exports=i=function(){function t(t){var e;this.options=t,this.comparator=this.options.comparator,this.data=(null!=(e=this.options.initialValues)?e.slice(0):void 0)||[],this.data.sort(this.comparator).reverse()}return t.prototype.queue=function(t){var e;return e=r(this.data,t,this.comparator),void this.data.splice(e,0,t)},t.prototype.dequeue=function(){return this.data.pop()},t.prototype.peek=function(){return this.data[this.data.length-1]},t}()},{}],4:[function(t,e){var i;e.exports=i=function(){function t(t){var e,i,r,o,a,n,s,u,h;for(this.comparator=(null!=t?t.comparator:void 0)||function(t,e){return t-e},this.pageSize=(null!=t?t.pageSize:void 0)||512,this.length=0,r=0;1<<r<this.pageSize;)r+=1;if(1<<r!==this.pageSize)throw"pageSize must be a power of two";for(this._shift=r,this._emptyMemoryPageTemplate=e=[],i=a=0,u=this.pageSize;u>=0?u>a:a>u;i=u>=0?++a:--a)e.push(null);if(this._memory=[],this._mask=this.pageSize-1,t.initialValues)for(h=t.initialValues,n=0,s=h.length;s>n;n++)o=h[n],this.queue(o)}return t.prototype.queue=function(t){return this.length+=1,this._write(this.length,t),void this._bubbleUp(this.length,t)},t.prototype.dequeue=function(){var t,e;return t=this._read(1),e=this._read(this.length),this.length-=1,this.length>0&&(this._write(1,e),this._bubbleDown(1,e)),t},t.prototype.peek=function(){return this._read(1)},t.prototype._write=function(t,e){var i;for(i=t>>this._shift;i>=this._memory.length;)this._memory.push(this._emptyMemoryPageTemplate.slice(0));return this._memory[i][t&this._mask]=e},t.prototype._read=function(t){return this._memory[t>>this._shift][t&this._mask]},t.prototype._bubbleUp=function(t,e){var i,r,o,a;for(i=this.comparator;t>1&&(r=t&this._mask,t<this.pageSize||r>3?o=t&~this._mask|r>>1:2>r?(o=t-this.pageSize>>this._shift,o+=o&~(this._mask>>1),o|=this.pageSize>>1):o=t-2,a=this._read(o),!(i(a,e)<0));)this._write(o,e),this._write(t,a),t=o;return void 0},t.prototype._bubbleDown=function(t,e){var i,r,o,a,n;for(n=this.comparator;t<this.length;)if(t>this._mask&&!(t&this._mask-1)?i=r=t+2:t&this.pageSize>>1?(i=(t&~this._mask)>>1,i|=t&this._mask>>1,i=i+1<<this._shift,r=i+1):(i=t+(t&this._mask),r=i+1),i!==r&&r<=this.length)if(o=this._read(i),a=this._read(r),n(o,e)<0&&n(o,a)<=0)this._write(i,e),this._write(t,o),t=i;else{if(!(n(a,e)<0))break;this._write(r,e),this._write(t,a),t=r}else{if(!(i<=this.length))break;if(o=this._read(i),!(n(o,e)<0))break;this._write(i,e),this._write(t,o),t=i}return void 0},t}()},{}],5:[function(t,e){var i;e.exports=i=function(){function t(t){var e;this.comparator=(null!=t?t.comparator:void 0)||function(t,e){return t-e},this.length=0,this.data=(null!=(e=t.initialValues)?e.slice(0):void 0)||[],this._heapify()}return t.prototype._heapify=function(){var t,e,i;if(this.data.length>0)for(t=e=1,i=this.data.length;i>=1?i>e:e>i;t=i>=1?++e:--e)this._bubbleUp(t);return void 0},t.prototype.queue=function(t){return this.data.push(t),void this._bubbleUp(this.data.length-1)},t.prototype.dequeue=function(){var t,e;return e=this.data[0],t=this.data.pop(),this.data.length>0&&(this.data[0]=t,this._bubbleDown(0)),e},t.prototype.peek=function(){return this.data[0]},t.prototype._bubbleUp=function(t){for(var e,i;t>0&&(e=t-1>>>1,this.comparator(this.data[t],this.data[e])<0);)i=this.data[e],this.data[e]=this.data[t],this.data[t]=i,t=e;return void 0},t.prototype._bubbleDown=function(t){var e,i,r,o,a;for(e=this.data.length-1;;){if(i=(t<<1)+1,o=i+1,r=t,e>=i&&this.comparator(this.data[i],this.data[r])<0&&(r=i),e>=o&&this.comparator(this.data[o],this.data[r])<0&&(r=o),r===t)break;a=this.data[r],this.data[r]=this.data[t],this.data[t]=a,t=r}return void 0},t}()},{}]},{},[1])(1)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(_dereq_,module,exports){
/* 
 * These action values correspond to the 256 states possible given empty
 * tiles, diagonal tiles, and square tiles. Generated using diagonals.js.
 * There are two possible forms for an action value. One is as a single object.
 * If an item has only a single object, then there is only one possible entrance/
 * exit possible from that arrangement of tiles. If an item has an array of
 * objects then there are multiple entrance/exits possible. Each of the objects
 * in an array of this sort has a 'loc' property that itself is an object with
 * properties 'in_dir' and 'out_dir' corresponding to the values to get into the
 * cell and the value that should be taken to get out of it. Each of the objects
 * also has a property 'v' which is a boolean corresponding to whether there is 
 * a vertex at a tile with this arrangement. The locations can be n, e, s, w, ne,
 * nw, se, sw.
 * The keys of this object are strings generated using the number values of a
 * contour tile starting from the top left and moving clockwise, separated by hyphens.
 */
module.exports = {"0-0-0-0":{"v":false,"loc":"none"},"1-0-0-0":{"v":true,"loc":"w"},"2-0-0-0":{"v":true,"loc":"w"},"3-0-0-0":{"v":true,"loc":"nw"},"0-1-0-0":{"v":true,"loc":"n"},"1-1-0-0":{"v":false,"loc":"w"},"2-1-0-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"3-1-0-0":{"v":true,"loc":"nw"},"0-2-0-0":{"v":true,"loc":"ne"},"1-2-0-0":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-0-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-0-0":[{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-0-0":{"v":true,"loc":"n"},"1-3-0-0":{"v":true,"loc":"w"},"2-3-0-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"3-3-0-0":{"v":true,"loc":"nw"},"0-0-1-0":{"v":true,"loc":"e"},"1-0-1-0":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"2-0-1-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"3-0-1-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"e"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-1-0":{"v":false,"loc":"n"},"1-1-1-0":{"v":true,"loc":"w"},"2-1-1-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":false,"loc":{"in_dir":"n","out_dir":"n"}}],"3-1-1-0":{"v":true,"loc":"nw"},"0-2-1-0":{"v":true,"loc":"ne"},"1-2-1-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"w"}}],"2-2-1-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}}],"3-2-1-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-1-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"e"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"1-3-1-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"e"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"2-3-1-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"3-3-1-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"e"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"0-0-2-0":{"v":true,"loc":"se"},"1-0-2-0":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-0-2-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-0-2-0":[{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-1-2-0":[{"v":true,"loc":{"in_dir":"w","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"1-1-2-0":[{"v":false,"loc":{"in_dir":"w","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-1-2-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-1-2-0":[{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-2-2-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"1-2-2-0":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-2-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-2-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"se"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"0-3-2-0":[{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"1-3-2-0":[{"v":true,"loc":{"in_dir":"sw","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-3-2-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-3-2-0":[{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-0-3-0":{"v":true,"loc":"e"},"1-0-3-0":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"2-0-3-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"3-0-3-0":[{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-3-0":{"v":true,"loc":"n"},"1-1-3-0":{"v":true,"loc":"w"},"2-1-3-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"n"}}],"3-1-3-0":{"v":false,"loc":"nw"},"0-2-3-0":{"v":true,"loc":"ne"},"1-2-3-0":[{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"w"}}],"2-2-3-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}}],"3-2-3-0":[{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-3-0":[{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"1-3-3-0":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"2-3-3-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"3-3-3-0":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"0-0-0-1":{"v":true,"loc":"s"},"1-0-0-1":{"v":false,"loc":"s"},"2-0-0-1":{"v":true,"loc":"s"},"3-0-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"1-1-0-1":{"v":true,"loc":"s"},"2-1-0-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"3-1-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}}],"0-2-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"1-2-0-1":[{"v":false,"loc":{"in_dir":"s","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-0-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"1-3-0-1":{"v":true,"loc":"s"},"2-3-0-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"3-3-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}}],"0-0-1-1":{"v":false,"loc":"e"},"1-0-1-1":{"v":true,"loc":"e"},"2-0-1-1":{"v":true,"loc":"e"},"3-0-1-1":[{"v":false,"loc":{"in_dir":"e","out_dir":"e"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-1-1":{"v":true,"loc":"n"},"1-1-1-1":{"v":false,"loc":"none"},"2-1-1-1":{"v":true,"loc":"n"},"3-1-1-1":{"v":true,"loc":"nw"},"0-2-1-1":{"v":true,"loc":"ne"},"1-2-1-1":{"v":true,"loc":"ne"},"2-2-1-1":{"v":true,"loc":"ne"},"3-2-1-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-1-1":[{"v":false,"loc":{"in_dir":"e","out_dir":"e"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"1-3-1-1":{"v":true,"loc":"e"},"2-3-1-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"3-3-1-1":[{"v":false,"loc":{"in_dir":"e","out_dir":"e"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"0-0-2-1":{"v":true,"loc":"se"},"1-0-2-1":{"v":true,"loc":"se"},"2-0-2-1":{"v":false,"loc":"se"},"3-0-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"1-1-2-1":{"v":true,"loc":"se"},"2-1-2-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"3-1-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}}],"0-2-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"1-2-2-1":[{"v":true,"loc":{"in_dir":"s","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-2-1":[{"v":false,"loc":{"in_dir":"se","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"0-3-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"1-3-2-1":{"v":true,"loc":"se"},"2-3-2-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"3-3-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}}],"0-0-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"1-0-3-1":[{"v":false,"loc":{"in_dir":"s","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"2-0-3-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"3-0-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"1-1-3-1":{"v":true,"loc":"s"},"2-1-3-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"3-1-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"0-2-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"1-2-3-1":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":false,"loc":{"in_dir":"s","out_dir":"s"}}],"2-2-3-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"3-2-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"1-3-3-1":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"2-3-3-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"3-3-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"0-0-0-2":{"v":true,"loc":"s"},"1-0-0-2":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-0-0-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-0-0-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-0-2":[{"v":true,"loc":{"in_dir":"w","out_dir":"n"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"1-1-0-2":[{"v":false,"loc":{"in_dir":"w","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-1-0-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-1-0-2":[{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"0-2-0-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"1-2-0-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-0-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-0-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-0-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"1-3-0-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-3-0-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-3-0-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"0-0-1-2":{"v":true,"loc":"e"},"1-0-1-2":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-0-1-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-0-1-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"e"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-1-2":{"v":true,"loc":"n"},"1-1-1-2":{"v":true,"loc":"w"},"2-1-1-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-1-1-2":{"v":true,"loc":"nw"},"0-2-1-2":{"v":false,"loc":"ne"},"1-2-1-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"s","out_dir":"w"}}],"2-2-1-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-2-1-2":[{"v":false,"loc":{"in_dir":"ne","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-1-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"e"}}],"1-3-1-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-3-1-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-3-1-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"e"}}],"0-0-2-2":{"v":true,"loc":"se"},"1-0-2-2":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-0-2-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-0-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"1-1-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":false,"loc":{"in_dir":"w","out_dir":"w"}}],"2-1-2-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"3-1-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}}],"0-2-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"1-2-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-2-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"0-3-2-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}}],"1-3-2-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-3-2-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-3-2-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}}],"0-0-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"1-0-3-2":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-0-3-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-0-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"1-1-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-1-3-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-1-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"0-2-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"1-2-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"s","out_dir":"w"}}],"2-2-3-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-2-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-3-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"1-3-3-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-3-3-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-3-3-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"0-0-0-3":{"v":true,"loc":"sw"},"1-0-0-3":{"v":true,"loc":"sw"},"2-0-0-3":{"v":true,"loc":"sw"},"3-0-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"1-1-0-3":{"v":true,"loc":"sw"},"2-1-0-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"3-1-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}}],"0-2-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"1-2-0-3":[{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-0-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"1-3-0-3":{"v":false,"loc":"sw"},"2-3-0-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"3-3-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}}],"0-0-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"1-0-1-3":[{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"2-0-1-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"3-0-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":false,"loc":{"in_dir":"n","out_dir":"n"}}],"1-1-1-3":{"v":true,"loc":"sw"},"2-1-1-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":false,"loc":{"in_dir":"n","out_dir":"n"}}],"3-1-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"nw"}}],"0-2-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}}],"1-2-1-3":[{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}}],"2-2-1-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}}],"3-2-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"1-3-1-3":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"2-3-1-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"3-3-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"0-0-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"1-0-2-3":[{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-0-2-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-0-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-1-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"1-1-2-3":[{"v":true,"loc":{"in_dir":"w","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-1-2-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-1-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-2-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"1-2-2-3":[{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-2-2-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-2-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-3-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"1-3-2-3":[{"v":false,"loc":{"in_dir":"sw","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-3-2-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-3-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-0-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"1-0-3-3":[{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"2-0-3-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"3-0-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"n"}}],"1-1-3-3":{"v":true,"loc":"sw"},"2-1-3-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"n"}}],"3-1-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":false,"loc":{"in_dir":"nw","out_dir":"nw"}}],"0-2-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}}],"1-2-3-3":[{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}}],"2-2-3-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}}],"3-2-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"1-3-3-3":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"2-3-3-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"3-3-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}]};

},{}],6:[function(_dereq_,module,exports){
/**
 * A point can represent a vertex in a 2d environment or a vector.
 * @constructor
 * @param {number} x - The `x` coordinate of the point.
 * @param {number} y - The `y` coordinate of the point.
 */
Point = function(x, y) {
  this.x = x;
  this.y = y;
};
exports.Point = Point;

/**
 * Convert a point-like object into a point.
 * @param {PointLike} p - The point-like object to convert.
 * @return {Point} - The new point representing the point-like
 *   object.
 */
Point.fromPointLike = function(p) {
  return new Point(p.x, p.y);
};

/**
 * String method for point-like objects.
 * @param {PointLike} p - The point-like object to convert.
 * @return {Point} - The new point representing the point-like
 *   object.
 */
Point.toString = function(p) {
  return "x" + p.x + "y" + p.y;
};

/**
 * Takes a point or scalar and adds slotwise in the case of another
 * point, or to each parameter in the case of a scalar.
 * @param {(Point|number)} - The Point, or scalar, to add to this
 *   point.
 */
Point.prototype.add = function(p) {
  if (typeof p == "number")
    return new Point(this.x + p, this.y + p);
  return new Point(this.x + p.x, this.y + p.y);
};

/**
 * Takes a point or scalar and subtracts slotwise in the case of
 * another point or from each parameter in the case of a scalar.
 * @param {(Point|number)} - The Point, or scalar, to subtract from
 *   this point.
 */
Point.prototype.sub = function(p) {
  if (typeof p == "number")
    return new Point(this.x - p, this.y - p);
  return new Point(this.x - p.x, this.y - p.y);
};

/**
 * Takes a scalar value and multiplies each parameter of the point
 * by the scalar.
 * @param  {number} f - The number to multiple the parameters by.
 * @return {Point} - A new point with the calculated coordinates.
 */
Point.prototype.mul = function(f) {
  return new Point(this.x * f, this.y * f);
};

/**
 * Takes a scalar value and divides each parameter of the point
 * by the scalar.
 * @param  {number} f - The number to divide the parameters by.
 * @return {Point} - A new point with the calculated coordinates.
 */
Point.prototype.div = function(f) {
  return new Point(this.x / f, this.y / f);
};

/**
 * Takes another point and returns a boolean indicating whether the
 * points are equal. Two points are equal if their parameters are
 * equal.
 * @param  {Point} p - The point to check equality against.
 * @return {boolean} - Whether or not the two points are equal.
 */
Point.prototype.eq = function(p) {
  return (this.x == p.x && this.y == p.y);
};

/**
 * Takes another point and returns a boolean indicating whether the
 * points are not equal. Two points are considered not equal if their
 * parameters are not equal.
 * @param  {Point} p - The point to check equality against.
 * @return {boolean} - Whether or not the two points are not equal.
 */
Point.prototype.neq = function(p) {
  return (this.x != p.x || this.y != p.y);
};

// Given another point, returns the dot product.
Point.prototype.dot = function(p) {
  return (this.x * p.x + this.y * p.y);
};

// Given another point, returns the 'cross product', or at least the 2d
// equivalent.
Point.prototype.cross = function(p) {
  return (this.x * p.y - this.y * p.x);
};

// Given another point, returns the distance to that point.
Point.prototype.dist = function(p) {
  var diff = this.sub(p);
  return Math.sqrt(diff.dot(diff));
};

// Given another point, returns the squared distance to that point.
Point.prototype.dist2 = function(p) {
  var diff = this.sub(p);
  return diff.dot(diff);
};

/**
 * Returns true if the point is (0, 0).
 * @return {boolean} - Whether or not the point is (0, 0).
 */
Point.prototype.zero = function() {
  return this.x == 0 && this.y == 0;
};

Point.prototype.len = function() {
  return this.dist(new Point(0, 0));
};

Point.prototype.normalize = function() {
  var n = this.dist(new Point(0, 0));
  if (n > 0) return this.div(n);
  return new Point(0, 0);
};

Point.prototype.toString = function() {
  return 'x' + this.x + 'y' + this.y;
};

/**
 * Return a copy of the point.
 * @return {Point} - The new point.
 */
Point.prototype.clone = function() {
  return new Point(this.x, this.y);
};

/**
 * Edges are used to represent the border between two adjacent
 * polygons.
 * @constructor
 * @param {Point} p1 - The first point of the edge.
 * @param {Point} p2 - The second point of the edge.
 */
Edge = function(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
  this.center = p1.add(p2.sub(p1).div(2));
  this.points = [this.p1, this.center, this.p2];
};
exports.Edge = Edge;

Edge.prototype._CCW = function(p1, p2, p3) {
  a = p1.x; b = p1.y;
  c = p2.x; d = p2.y;
  e = p3.x; f = p3.y;
  return (f - b) * (c - a) > (d - b) * (e - a);
};

/**
 * from http://stackoverflow.com/a/16725715
 * Checks whether this edge intersects the provided edge.
 * @param {Edge} edge - The edge to check intersection for.
 * @return {boolean} - Whether or not the edges intersect.
 */
Edge.prototype.intersects = function(edge) {
  var q1 = edge.p1, q2 = edge.p2;
  if (q1.eq(this.p1) || q1.eq(this.p2) || q2.eq(this.p1) || q2.eq(this.p2)) return false;
  return (this._CCW(this.p1, q1, q2) != this._CCW(this.p2, q1, q2)) && (this._CCW(this.p1, this.p2, q1) != this._CCW(this.p1, this.p2, q2));
};

/**
 * Polygon class.
 * Can be initialized with an array of points.
 * @constructor
 * @param {Array.<Point>} [points] - The points to use to initialize
 *   the poly.
 */
Poly = function(points) {
  if (typeof points == 'undefined') points = false;
  this.hole = false;
  this.points = null;
  this.numpoints = 0;
  if (points) {
    this.numpoints = points.length;
    this.points = points.slice();
  }
};
exports.Poly = Poly;

Poly.prototype.init = function(n) {
  this.points = new Array(n);
  this.numpoints = n;
};

Poly.prototype.update = function() {
  this.numpoints = this.points.length;
};

Poly.prototype.triangle = function(p1, p2, p3) {
  this.init(3);
  this.points[0] = p1;
  this.points[1] = p2;
  this.points[2] = p3;
};

// Takes an index and returns the point at that index, or null.
Poly.prototype.getPoint = function(n) {
  if (this.points && this.numpoints > n)
    return this.points[n];
  return null;
};

// Set a point, fails silently otherwise. TODO: replace with bracket notation.
Poly.prototype.setPoint = function(i, p) {
  if (this.points && this.points.length > i) {
    this.points[i] = p;
  }
};

// Given an index i, return the index of the next point.
Poly.prototype.getNextI = function(i) {
  return (i + 1) % this.numpoints;
};

Poly.prototype.getPrevI = function(i) {
  if (i == 0)
    return (this.numpoints - 1);
  return i - 1;
};

// Returns the signed area of a polygon, if the vertices are given in
// CCW order then the area will be > 0, < 0 otherwise.
Poly.prototype.getArea = function() {
  var area = 0;
  for (var i = 0; i < this.numpoints; i++) {
    var i2 = this.getNextI(i);
    area += this.points[i].x * this.points[i2].y - this.points[i].y * this.points[i2].x;
  }
  return area;
};

Poly.prototype.getOrientation = function() {
  var area = this.getArea();
  if (area > 0) return "CCW";
  if (area < 0) return "CW";
  return 0;
};

Poly.prototype.setOrientation = function(orientation) {
  var current_orientation = this.getOrientation();
  if (current_orientation && (current_orientation !== orientation)) {
    this.invert();
  }
};

Poly.prototype.invert = function() {
  var newpoints = new Array(this.numpoints);
  for (var i = 0; i < this.numpoints; i++) {
    newpoints[i] = this.points[this.numpoints - i - 1];
  }
  this.points = newpoints;
};

Poly.prototype.getCenter = function() {
  var x = this.points.map(function(p) { return p.x });
  var y = this.points.map(function(p) { return p.y });
  var minX = Math.min.apply(null, x);
  var maxX = Math.max.apply(null, x);
  var minY = Math.min.apply(null, y);
  var maxY = Math.max.apply(null, y);
  return new Point((minX + maxX)/2, (minY + maxY)/2);
};

// Adapted from http://stackoverflow.com/a/16283349
Poly.prototype.centroid = function() {
  var x = 0,
      y = 0,
      i,
      j,
      f,
      point1,
      point2;

  for (i = 0, j = this.points.length - 1; i < this.points.length; j = i, i += 1) {
    point1 = this.points[i];
    point2 = this.points[j];
    f = point1.x * point2.y - point2.x * point1.y;
    x += (point1.x + point2.x) * f;
    y += (point1.y + point2.y) * f;
  }

  f = this.getArea() * 3;
  x = Math.abs(x);
  y = Math.abs(y);
  return new Point(x / f, y / f);
};

Poly.prototype.toString = function() {
  var center = this.centroid();
  return "" + center.x + " " + center.y;
};

/**
 * Checks if the given point is contained within the Polygon.
 * Adapted from http://stackoverflow.com/a/8721483
 *
 * @param {Point} p - The point to check.
 * @return {boolean} - Whether or not the point is contained within
 *   the polygon.
 */
Poly.prototype.containsPoint = function(p) {
  var result = false;
  for (var i = 0, j = this.numpoints - 1; i < this.numpoints; j = i++) {
    var p1 = this.points[j], p2 = this.points[i];
    if ((p2.y > p.y) != (p1.y > p.y) &&
        (p.x < (p1.x - p2.x) * (p.y - p2.y) / (p1.y - p2.y) + p2.x)) {
      result = !result;
    }
  }
  return result;
};

/**
 * Clone the given polygon into a new polygon.
 * @return {Poly} - A clone of the polygon.
 */
Poly.prototype.clone = function() {
  return new Poly(this.points.slice().map(function(point) {
    return point.clone();
  }));
};

/**
 * Translate a polygon along a given vector.
 * @param {Point} vec - The vector along which to translate the
 *   polygon.
 * @return {Poly} - The translated polygon.
 */
Poly.prototype.translate = function(vec) {
  return new Poly(this.points.map(function(point) {
    return point.add(vec);
  }));
};

/**
 * Returns an array of edges representing the polygon.
 * @return {Array.<Edge>} - The edges of the polygon.
 */
Poly.prototype.edges = function() {
  if (!this.hasOwnProperty("cached_edges")) {
    this.cached_edges = this.points.map(function(point, i) {
      return new Edge(point, this.points[this.getNextI(i)]);
    }, this);
  }
  return this.cached_edges;
};

/**
 * Naive check if other poly intersects this one, assuming both convex.
 * @param {Poly} poly
 * @return {boolean} - Whether the polygons intersect.
 */
Poly.prototype.intersects = function(poly) {
  var inside = poly.points.some(function(p) {
    return this.containsPoint(p);
  }, this);
  inside = inside || this.points.some(function(p) {
    return poly.containsPoint(p);
  });
  if (inside) {
    return true;
  } else {
    var ownEdges = this.edges();
    var otherEdges = poly.edges();
    var intersect = ownEdges.some(function(ownEdge) {
      return otherEdges.some(function(otherEdge) {
        return ownEdge.intersects(otherEdge);
      });
    });
    return intersect;
  }
};

var util = {};
exports.util = util;

/**
 * Given an array of polygons, returns the one that contains the point.
 * If no polygon is found, null is returned.
 * @param {Point} p - The point to find the polygon for.
 * @param {Array.<Poly>} polys - The polygons to search for the point.
 * @return {?Polygon} - The polygon containing the point.
 */
util.findPolyForPoint = function(p, polys) {
  var i, poly;
  for (i in polys) {
    poly = polys[i];
    if (poly.containsPoint(p)) {
      return poly;
    }
  }
  return null;
};

/**
 * Holds the properties of a collision, if one occurred.
 * @typedef Collision
 * @type {object}
 * @property {boolean} collides - Whether there is a collision.
 * @property {boolean} inside - Whether one object is inside the other.
 * @property {?Point} point - The point of collision, if collision
 *   occurs, and if `inside` is false.
 * @property {?Point} normal - A unit vector normal to the point
 *   of collision, if it occurs and if `inside` is false.
 */
/**
 * If the ray intersects the circle, the distance to the intersection
 * along the ray is returned, otherwise false is returned.
 * @param {Point} p - The start of the ray.
 * @param {Point} ray - Unit vector extending from `p`.
 * @param {Point} c - The center of the circle for the object being
 *   checked for intersection.
 * @param {number} radius - The radius of the circle.
 * @return {Collision} - The collision information.
 */
util.lineCircleIntersection = function(p, ray, c, radius) {
  var collision = {
    collides: false,
    inside: false,
    point: null,
    normal: null
  };
  var vpc = c.sub(p);

  if (vpc.len() <= radius) {
    // Point is inside obstacle.
    collision.collides = true;
    collision.inside = (vpc.len() !== radius);
  } else if (ray.dot(vpc) >= 0) {
    // Circle is ahead of point.
    // Projection of center point onto ray.
    var pc = p.add(ray.mul(ray.dot(vpc)));
    // Length from c to its projection on the ray.
    var len_c_pc = c.sub(pc).len();

    if (len_c_pc <= radius) {
      collision.collides = true;

      // Distance from projected point to intersection.
      var len_intersection = Math.sqrt(len_c_pc * len_c_pc + radius * radius);
      collision.point = pc.sub(ray.mul(len_intersection));
      collision.normal = collision.point.sub(c).normalize();
    }
  }
  return collision;
};

},{}],7:[function(_dereq_,module,exports){
var partition = _dereq_('./partition');
var geo = _dereq_('./geometry');
var Point = geo.Point;
var Poly = geo.Poly;
var Edge = geo.Edge;

var MapParser = _dereq_('./parse-map');
var Pathfinder = _dereq_('./pathfinder');

_dereq_('math-round');
var ClipperLib = _dereq_('jsclipper');

/**
 * A NavMesh represents the traversable area of a map and gives
 * utilities for pathfinding.
 * Usage:
 * ```javascript
 * // Assuming the 2d map tiles array is available:
 * var navmesh = new NavMesh(map);
 * navmesh.calculatePath(currentlocation, targetLocation, callback);
 * ```
 * @module NavMesh
 */  
/**
 * @constructor
 * @alias module:NavMesh
 * @param {MapTiles} map - The 2d array defining the map tiles.
 * @param {Logger} [logger] - The logger to use.
 */
var NavMesh = function(map, logger) {
  if (typeof logger == 'undefined') {
    logger = {};
    logger.log = function() {};
  }
  this.logger = logger;

  this.initialized = false;

  this.updateFuncs = [];

  this._setupWorker();
  
  // Parse map tiles into polygons.
  var polys = MapParser.parse(map);
  if (!polys) {
    throw "Map parsing failed!";
  }

  // Track map state.
  this.map = JSON.parse(JSON.stringify(map));

  // Initialize navmesh.
  this._init(polys);
};
module.exports = NavMesh;

/**
 * Callback for path calculation requests.
 * @callback PathCallback
 * @param {?Array.<PointLike>} - The calculated path beginning with
 *   the start point, and ending at the target point. If no path is
 *   found then null is passed to the callback.
 */

/**
 * Calculate a path from the source point to the target point, invoking
 * the callback with the path after calculation.
 * @param {PointLike} source - The start location of the search.
 * @param {PointLike} target - The target of the search.
 * @param {PathCallback} callback - The callback function invoked
 *   when the path has been calculated.
 */
NavMesh.prototype.calculatePath = function(source, target, callback) {
  this.logger.log("navmesh:debug", "Calculating path.");

  // Use web worker if present.
  if (this.worker && this.workerInitialized) {
    this.logger.log("navmesh:debug", "Using worker to calculate path.");
    this.worker.postMessage(["aStar", source, target]);
    // Set callback so it is accessible when results are sent back.
    this.lastCallback = callback;
  } else {
    source = Point.fromPointLike(source);
    target = Point.fromPointLike(target);
    path = this.pathfinder.aStar(source, target);
    callback(path);
  }
};

/**
 * Check whether one point is visible from another, without being
 * blocked by obstacles.
 * @param {PointLike} p1 - The first point.
 * @param {PointLike} p2 - The second point.
 * @return {boolean} - Whether `p1` is visible from `p2`.
 */
NavMesh.prototype.checkVisible = function(p1, p2) {
  var edge = new Edge(Point.fromPointLike(p1), Point.fromPointLike(p2));
  var blocked = this.obstacle_edges.some(function(e) {return e.intersects(edge);});
  return !blocked;
};

/**
 * Ensure that passed function is executed when the navmesh has been
 * fully initialized.
 * @param {Function} fn - The function to call when the navmesh is
 *   initialized.
 */
NavMesh.prototype.onInit = function(fn) {
  if (this.initialized) {
    fn();
  } else {
    setTimeout(function() {
      this.onInit(fn);
    }.bind(this), 10);
  }
};

/**
 * @typedef TileUpdate
 * @type {object}
 * @property {integer} x - The x index of the tile to update in the
 *   original map array.
 * @property {integer} y - The y index of the tile to update in the
 *   original map array.
 * @property {(number|string)} v - The new value for the tile.
 */

/**
 * Takes an array of tiles and updates the navigation mesh to reflect
 * the newly traversable area. This should be set as a listener to
 * `mapupdate` socket events.
 * @param {Array.<TileUpdate>} - Information on the tiles updates.
 */
NavMesh.prototype.mapUpdate = function(data) {
  // Check the passed values.
  var error = false;
  // Hold updated tile locations.
  var updates = [];
  data.forEach(function(update) {
    // Update internal map state.
    this.map[update.x][update.y] = update.v;
    if (error) return;
    var tileId = update.v;
    var locId = Point.toString(update);
    var passable = this._isPassable(tileId);
    var currentLocState = this.obstacle_state[locId];
    // All dynamic tile locations should be defined.
    if (typeof currentLocState == 'undefined') {
      error = true;
      this.logger.log("navmesh:error",
        "Dynamic obstacle found but not already initialized.");
      return;
    } else {
      if (passable == currentLocState) {
        // Nothing to do here.
        return;
      } else {
        this.obstacle_state[locId] = passable;
        // Track whether update is making the tiles passable or
        // impassable.
        update.passable = passable;
        updates.push(update);
      }
    }
  }, this);

  if (error) {
    return;
  }

  // Check that we have updates to carry out.
  if (updates.length > 0) {
    // See whether this is an update from passable to impassable
    // or vice-versa.
    var passable = updates[0].passable;

    // Ensure that they all have the same update type.
    updates.forEach(function(update) {
      if (update.passable !== passable) {
        error = true;
      }
    }, this);
    if (error) {
      this.logger.log("navmesh:error",
        "Not all updates of same type.");
      return;
    }
    // Passable/impassable-specific update functions.
    if (passable) {
      this._passableUpdate(updates);
    } else {
      this._impassableUpdate(updates);
    }
  }
};

/**
 * Set up the navmesh to listen to the relevant socket.
 * @param  {Socket} socket - The socket to listen on for `mapupdate`
 *   packets.
 */
NavMesh.prototype.listen = function(socket) {
  socket.on("mapupdate", this.mapUpdate.bind(this));
};

/**
 * A function called when the navigation mesh updates.
 * @callback UpdateCallback
 * @param {Array.<Poly>} - The polys defining the current navigation
 *   mesh.
 * @param {Array.<Poly>} - The polys that were added to the mesh.
 * @param {Array.<integer>} - The indices of the polys that were
 *   removed from the mesh.
 */

/**
 * Register a function to be called when the navigation mesh updates.
 * @param {UpdateCallback} fn - The function to be called.
 */
NavMesh.prototype.onUpdate = function(fn) {
  this.updateFuncs.push(fn);
};

/**
 * Set specific tile identifiers as impassable to the agent.
 * @param {Array.<number>} ids - The tile ids to set as impassable.
 * @param {string} obstacle - The identifier for the polygon for the
 *   obstacles (already passed to addObstaclePoly).
 */
NavMesh.prototype.setImpassable = function(ids) {
  // Remove ids already set as impassable.
  ids = ids.filter(function(id) {
    return this._isPassable(id);
  }, this);
  this.logger.log("navmesh:debug", "Ids passed:", ids);

  var updates = [];
  // Check if any of the dynamic tiles have the values passed.
  this.dynamic_obstacle_locations.forEach(function(loc) {
    var idx = ids.indexOf(this.map[loc.x][loc.y]);
    if (idx !== -1) {
      updates.push({
        x: loc.x,
        y: loc.y,
        v: ids[idx]
      });
    }
  }, this);

  // Add to list of impassable tiles.
  ids.forEach(function(id) {
    this.impassable[id] = true;
  }, this);

  if (updates.length > 0) {
    this.mapUpdate(updates);
  }
};

/**
 * Remove tile identifiers from set of impassable tile types.
 * @param {Array.<number>} ids - The tile ids to set as traversable.
 */
NavMesh.prototype.removeImpassable = function(ids) {
  // Remove ids not set as impassable.
  ids = ids.filter(function(id) {
    return !this._isPassable(id);
  }, this);

  var updates = [];
  // Check if any of the dynamic tiles have the values passed.
  this.dynamic_obstacle_locations.forEach(function(loc) {
    var idx = ids.indexOf(this.map[loc.x][loc.y]);
    if (idx !== -1) {
      updates.push({
        x: loc.x,
        y: loc.y,
        v: ids[idx]
      });
    }
  }, this);

  // Remove from list of impassable tiles.
  ids.forEach(function(id) {
    this.impassable[id] = false;
  }, this);

  if (updates.length > 0) {
    this.mapUpdate(updates);
  }
};

/**
 * Initialize the navigation mesh with the polygons describing the
 * map elements.
 * @private
 * @param {ParsedMap} - The map information parsed into polygons.
 */
NavMesh.prototype._init = function(parsedMap) {
  // Save original parsed map polys.
  this.parsedMap = parsedMap;

  // Static objects relative to the navmesh.
  var navigation_static_objects = {
    walls: parsedMap.walls,
    obstacles: parsedMap.static_obstacles
  };
  var navigation_dynamic_objects = parsedMap.dynamic_obstacles;

  // Offset polys from side so they represent traversable area.
  var areas = this._offsetPolys(navigation_static_objects);

  this.polys = areas.map(NavMesh._geometry.partitionArea);
  this.polys = NavMesh._util.flatten(this.polys);

  if (!this.workerInitialized) {
    this.pathfinder = new Pathfinder(this.polys);
  }

  this._setupDynamicObstacles(navigation_dynamic_objects);

  
  // Hold the edges of static obstacles.
  this.static_obstacle_edges = [];
  areas.forEach(function(area) {
    var polys = [area.polygon].concat(area.holes);
    polys.forEach(function(poly) {
      for (var i = 0, j = poly.numpoints - 1; i < poly.numpoints; j = i++) {
        this.static_obstacle_edges.push(new Edge(poly.points[j], poly.points[i]));
      }
    }, this);
  }, this);

  // Holds the edges of static and dynamic obstacles.
  this.obstacle_edges = this.static_obstacle_edges.slice();

  this.initialized = true;
};

/**
 * Set up mesh-dynamic obstacles.
 * @private
 */
NavMesh.prototype._setupDynamicObstacles = function(obstacles) {
  // Holds tile id<->impassable (boolean) associations.
  this.impassable = {};
  // Polygons defining obstacles.
  this.obstacleDefinitions = {};
  // Relation between ids and obstacles.
  this.idToObstacles = {};

  var geo = NavMesh._geometry;

  // Add polygons describing dynamic obstacles.
  this._addObstaclePoly("bomb", geo.getApproximateCircle(15));
  this._addObstaclePoly("boost", geo.getApproximateCircle(15));
  this._addObstaclePoly("portal", geo.getApproximateCircle(15));
  this._addObstaclePoly("spike", geo.getApproximateCircle(14));
  this._addObstaclePoly("gate", geo.getSquare(20));
  this._addObstaclePoly("tile", geo.getSquare(20));
  this._addObstaclePoly("wall", geo.getSquare(20));
  this._addObstaclePoly("sewall", geo.getDiagonal(20, "se"));
  this._addObstaclePoly("newall", geo.getDiagonal(20, "ne"));
  this._addObstaclePoly("swwall", geo.getDiagonal(20, "sw"));
  this._addObstaclePoly("nwwall", geo.getDiagonal(20, "nw"));

  // Add id<->type associations.
  this._setObstacleType([10, 10.1], "bomb");
  this._setObstacleType([5, 5.1, 14, 14.1, 15, 15.1], "boost");
  this._setObstacleType([9, 9.1, 9.2, 9.3], "gate");
  this._setObstacleType([1], "wall");
  this._setObstacleType([1.1], "swwall");
  this._setObstacleType([1.2], "nwwall");
  this._setObstacleType([1.3], "newall");
  this._setObstacleType([1.4], "sewall");
  this._setObstacleType([7], "spike");

  // Set up obstacle state container. Holds whether position is
  // passable or not. Referenced using array location.
  this.obstacle_state = {};

  // Location of dynamic obstacles.
  this.dynamic_obstacle_locations = [];

  // Edges of offsetted obstacled, organized by id.
  this.dynamic_obstacle_polys = {};

  // Container to hold initial obstacle states.
  var initial_states = [];
  obstacles.forEach(function(obstacle) {
    var id = Point.toString(obstacle);

    // Generate offset obstacle.
    var obs = this._offsetDynamicObs([this._getTilePoly(obstacle)]);
    var areas = NavMesh._geometry.getAreas(obs);
    areas = areas.map(function(area) {
      area.holes.push(area.polygon);
      return area.holes;
    });
    areas = NavMesh._util.flatten(areas);
    // Get edges of obstacle.
    var edges = areas.map(function(poly) {
      return poly.edges();
    });
    edges = NavMesh._util.flatten(edges);
    this.dynamic_obstacle_polys[id] = edges;

    // Initialize obstacle states to all be passable.
    this.obstacle_state[id] = true;
    this.dynamic_obstacle_locations.push(Point.fromPointLike(obstacle));
    initial_states.push(obstacle);
  }, this);

  // Set up already-known dynamic impassable values.
  this.setImpassable([10, 5, 9.1]);
  // Walls and spikes.
  this.setImpassable([1, 1.1, 1.2, 1.3, 1.4, 7]);

  // Set up callback to regenerate obstacle edges for visibility checking.
  this.onUpdate(function(polys) {
    var obstacle_edges = [];
    for (id in this.obstacle_state) {
      if (!this.obstacle_state[id]) {
        Array.prototype.push.apply(
          obstacle_edges,
          this.dynamic_obstacle_polys[id]);
      }
    }
    this.obstacle_edges = this.static_obstacle_edges.concat(obstacle_edges);
  }.bind(this));

  // Initialize mapupdate with already-present dynamic obstacles.
  this.mapUpdate(initial_states);
};

/**
 * Add poly definition for obstacle type.
 * edges should be relative to center of tile.
 * @private
 */
NavMesh.prototype._addObstaclePoly = function(name, poly) {
  this.obstacleDefinitions[name] = poly;
};

/**
 * Retrieve the polygon for a given obstacle id.
 * @private
 * @param {number} id - The id to retrieve the obstacle polygon for.
 * @return {Poly} - The polygon representing the obstacle.
 */
NavMesh.prototype._getObstaclePoly = function(id) {
  var poly = this.obstacleDefinitions[this.idToObstacles[id]]
  if (poly) {
    return poly.clone();
  } else {
    this.logger.log("navmesh:debug", "No poly found for id:", id);
  }
};

/**
 * Update the navigation mesh to the given polys and call the update
 * functions.
 * @private
 * @param {Array.<Poly>} polys - The new polys defining the nav mesh.
 * @param {Array.<Poly>} added - The polys that were added to the mesh.
 * @param {Array.<integer>} removed - The indices of the polys that were
 *   removed from the mesh.
 */
NavMesh.prototype._update = function(polys, added, removed) {
  this.polys = polys;
  this.updateFuncs.forEach(function(fn) {
    setTimeout(function() {
      fn(this.polys, added, removed);
    }.bind(this), 0);
  }, this);
};

/**
 * Set the relationship between specific tile identifiers and the
 * polygons representing the shape of the obstacle they correspond
 * to.
 * @private
 * @param {Array.<number>} ids - The tile ids to set as impassable.
 * @param {string} obstacle - The identifier for the polygon for the
 *   obstacles (already passed to addObstaclePoly).
 */
NavMesh.prototype._setObstacleType = function(ids, type) {
  ids.forEach(function(id) {
    this.idToObstacles[id] = type;
  }, this);
};

/**
 * Check whether the provided id corresponds to a passable tile.
 * @return {boolean} - Whether the id is for a passable tile.
 */
NavMesh.prototype._isPassable = function(id) {
  // Check if in list of impassable tiles.
  return !this.impassable.hasOwnProperty(id) || !this.impassable[id];
};

/**
 * Get a polygon corresponding to the dimensions and location of the
 * provided tile update.
 * @private
 * @param {TileUpdate} tile - The tile update information.
 * @return {Poly} - The polygon representing the tile.
 */
NavMesh.prototype._getTilePoly = function(tile) {
  // Get the base poly from a list of such things by tile id
  // then translate according to the array location.
  var id = tile.v;
  var p = this._getWorldCoord(tile);
  var poly = this._getObstaclePoly(id).translate(p);
  return poly;
};

/**
 * Represents a point in space or a location in a 2d array.
 * @typedef PointLike
 * @type {object}
 * @property {number} x - The `x` coordinate for the point, or row
 *   for the array location.
 * @property {number} y - The `y` coordinate for the point. or column
 *   for the array location.
 */

/**
 * Given an array location, return the world coordinate representing
 * the center point of the tile at that array location.
 * @private
 * @param {PointLike} arrayLoc - The location in the map for the point.
 * @returm {Point} - The coordinates for the center of the location.
 */
NavMesh.prototype._getWorldCoord = function(arrayLoc) {
  var TILE_WIDTH = 40;
  return new Point(
    arrayLoc.x * TILE_WIDTH + (TILE_WIDTH / 2),
    arrayLoc.y * TILE_WIDTH + (TILE_WIDTH / 2)
  );
};

/**
 * Carry out the navmesh update for impassable dynamic obstacles that
 * have been removed from the navmesh.
 * @private
 * @param {Array.<TileUpdate>} updates - The tile update information.
 */
NavMesh.prototype._passableUpdate = function(updates) {
  var scale = 100;
  // Assume each of the tiles is now a square of open space.
  var passableTiles = updates.map(function(update) {
    return this._getTilePoly({
      x: update.x,
      y: update.y,
      v: 1
    });
  }, this);

  // Offset and merge newly passable tiles, assuming no tile along
  // with its offset would have been larger than a single tile.
  // Set offset slightly larger that normal so that we catch all
  // relevant polygons that need to be updated in the navmesh.
  var passableArea = this._offsetDynamicObs(passableTiles, 20);

  var cpr = NavMesh._geometry.cpr;

  // Get impassable tiles bordering the now-passable area and offset them.
  var borderingTiles = this._getBorderedTiles(updates);
  var borderingPolys = borderingTiles.map(this._getTilePoly, this);
  var surroundingArea = this._offsetDynamicObs(borderingPolys);

  // Get difference between the open area and the surrounding obstacles.
  cpr.Clear();
  var actualPassableArea = new ClipperLib.Paths();
  cpr.AddPaths(passableArea, ClipperLib.PolyType.ptSubject, true);
  cpr.AddPaths(surroundingArea, ClipperLib.PolyType.ptClip, true);
  cpr.Execute(ClipperLib.ClipType.ctDifference,
    actualPassableArea,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero
  );

  var passableAreas = NavMesh._geometry.getAreas(actualPassableArea, scale);

  var passablePartition = NavMesh._geometry.partitionAreas(passableAreas);

  // Get mesh polys intersected by offsetted passable area.
  var intersection = this._getIntersectedPolys(passablePartition);
  var intersectedMeshPolys = intersection.polys;

  // Create outline with matched mesh polys.
  intersectedMeshPolys = intersectedMeshPolys.map(NavMesh._geometry.convertPolyToClipper);
  ClipperLib.JS.ScaleUpPaths(intersectedMeshPolys, scale);

  // Merge intersected mesh polys and with newly passable area.
  cpr.Clear();
  cpr.AddPaths(intersectedMeshPolys, ClipperLib.PolyType.ptSubject, true);
  cpr.AddPaths(actualPassableArea, ClipperLib.PolyType.ptSubject, true);
  var newMeshArea = new ClipperLib.Paths();
  cpr.Execute(
    ClipperLib.ClipType.ctUnion,
    newMeshArea,
    ClipperLib.PolyFillType.pftNonZero,
    null);

  // Partition the unioned mesh polys and new passable area and add
  // to the existing mesh polys.
  var meshAreas = NavMesh._geometry.getAreas(newMeshArea, scale);
  var newPolys = NavMesh._geometry.partitionAreas(meshAreas);
  Array.prototype.push.apply(this.polys, newPolys);

  this._update(this.polys, newPolys, intersection.indices);
};

/**
 * Carry out the navmesh update for impassable dynamic obstacles that
 * have been added to the navmesh.
 * @private
 * @param {Array.<TileUpdate>} updates - The tile update information.
 */
NavMesh.prototype._impassableUpdate = function(updates) {
  var scale = 100;
  // Get polygons defining these obstacles.
  var obstaclePolys = updates.map(function(update) {
    return this._getTilePoly(update);
  }, this);

  // Offset the obstacle polygons.
  var offsettedObstacles = this._offsetDynamicObs(obstaclePolys);
  var obstacleAreas = NavMesh._geometry.getAreas(offsettedObstacles);

  // Get convex partition of new obstacle areas for finding
  // intersections.
  var obstaclePartition = NavMesh._geometry.partitionAreas(obstacleAreas);

  // Get mesh polys intersected by offsetted obstacles.
  var intersection = this._getIntersectedPolys(obstaclePartition);
  var intersectedMeshPolys = intersection.polys;

  // Create outline with matched mesh polys.
  intersectedMeshPolys = intersectedMeshPolys.map(NavMesh._geometry.convertPolyToClipper);
  ClipperLib.JS.ScaleUpPaths(intersectedMeshPolys, scale);
  var cpr = NavMesh._geometry.cpr;

  // Merge matched polys
  cpr.Clear();
  cpr.AddPaths(intersectedMeshPolys, ClipperLib.PolyType.ptSubject, true);
  var mergedMeshPolys = new ClipperLib.Paths();
  cpr.Execute(
    ClipperLib.ClipType.ctUnion,
    mergedMeshPolys,
    ClipperLib.PolyFillType.pftNonZero,
    null);

  // Take difference of mesh polys and obstacle polys.
  var paths = new ClipperLib.Paths();
  cpr.Clear();
  cpr.AddPaths(mergedMeshPolys, ClipperLib.PolyType.ptSubject, true);
  cpr.AddPaths(offsettedObstacles, ClipperLib.PolyType.ptClip, true);

  cpr.Execute(ClipperLib.ClipType.ctDifference,
    paths,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero
  );

  var areas = NavMesh._geometry.getAreas(paths, scale);
  // Make polys from new space.
  var polys = NavMesh._geometry.partitionAreas(areas);

  // Add to existing polygons.
  Array.prototype.push.apply(this.polys, polys);

  this._update(this.polys, polys, intersection.indices);
};

/**
 * Offsetting function for dynamic obstacles.
 * @private
 * @param {Array.<Poly>} obstacles
 * @param {number} [offset=16]
 * @return {Array.<Poly>}
 */
NavMesh.prototype._offsetDynamicObs = function(obstacles, offset) {
  if (typeof offset == 'undefined') offset = 16;
  var scale = 100;
  obstacles = obstacles.map(NavMesh._geometry.convertPolyToClipper);
  ClipperLib.JS.ScaleUpPaths(obstacles, scale);

  var cpr = NavMesh._geometry.cpr;
  var co = NavMesh._geometry.co;

  // Merge obstacles together, so obstacles that share a common edge
  // will be expanded properly.
  cpr.Clear();
  cpr.AddPaths(obstacles, ClipperLib.PolyType.ptSubject, true);
  var merged_obstacles = new ClipperLib.Paths();
  cpr.Execute(
    ClipperLib.ClipType.ctUnion,
    merged_obstacles,
    ClipperLib.PolyFillType.pftNonZero,
    null);

  // Offset obstacles.
  var offsetted_paths = new ClipperLib.Paths();

  merged_obstacles.forEach(function(obstacle) {
    var offsetted_obstacle = new ClipperLib.Paths();
    co.Clear();
    co.AddPath(obstacle, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
    co.Execute(offsetted_obstacle, offset * scale);
    offsetted_paths.push(offsetted_obstacle[0]);
  });

  // Merge any newly-overlapping obstacles.
  cpr.Clear();
  cpr.AddPaths(offsetted_paths, ClipperLib.PolyType.ptSubject, true);
  merged_obstacles = new ClipperLib.Paths();
  cpr.Execute(
    ClipperLib.ClipType.ctUnion,
    merged_obstacles,
    ClipperLib.PolyFillType.pftNonZero,
    null);
  return merged_obstacles;
};

/**
 * Get and remove the mesh polygons impacted by the addition of new
 * obstacles. The provided obstacles should already be offsetted.
 * @private
 * @param {Array.<Poly>} obstacles - The offsetted obstacles to get
 *   the intersection of. Must be convex.
 * @return {Array.<Poly>} - The affected polys.
 */
NavMesh.prototype._getIntersectedPolys = function(obstacles) {
  var intersectedIndices = NavMesh._geometry.getIntersections(obstacles, this.polys);
  return {
    indices: intersectedIndices,
    polys: NavMesh._util.splice(this.polys, intersectedIndices)
  };
};

/**
 * Get the impassable tiles bordering updated passable tiles.
 * @private
 * @param {Array.<TileUpdate>} tiles - The updated passable tiles.
 * @return {Array.<ArrayLoc>} - The new array locations.
 */
NavMesh.prototype._getBorderedTiles = function(tiles) {
  // Track locations already being updated or added.
  var locations = {};
  tiles.forEach(function(tile) {
    locations[Point.toString(tile)] = true;
  });

  var map = this.map;
  var xUpperBound = map.length;
  var yUpperBound = map[0].length;
  // Get the locations adjacent to a given tile in the map.
  var getAdjacent = function(tile) {
    var x = tile.x;
    var y = tile.y;
    var xUp = x + 1 < xUpperBound;
    var xDown = x >= 0;
    var yUp = y + 1 < yUpperBound;
    var yDown = y >= 0;

    var adjacents = [];
    if (xUp) {
      adjacents.push({x: x + 1, y: y});
      if (yUp) {
        adjacents.push({x: x + 1, y: y + 1});
      }
      if (yDown) {
        adjacents.push({x: x + 1, y: y - 1});
      }
    }
    if (xDown) {
      adjacents.push({x: x - 1, y: y});
      if (yUp) {
        adjacents.push({x: x - 1, y: y + 1});
      }
      if (yDown) {
        adjacents.push({x: x - 1, y: y - 1});
      }
    }
    if (yUp) {
      adjacents.push({x: x, y: y + 1});
    }
    if (yDown) {
      adjacents.push({x: x, y: y - 1});
    }
    return adjacents;
  };

  // Store adjacent impassable tiles.
  var adjacent_tiles = [];
  tiles.forEach(function(tile) {
    var adjacents = getAdjacent(tile);
    adjacents.forEach(function(adjacent) {
      var id = Point.toString(adjacent);
      if (!locations[id]) {
        // Record as having been seen.
        locations[id] = true;
        var val = this.map[adjacent.x][adjacent.y];
        if (!this._isPassable(val)) {
          adjacent.v = val;
          adjacent_tiles.push(adjacent);
        }
      }
    }, this);
  }, this);
  return adjacent_tiles;
};

/**
 * Represents the outline of a shape along with its holes.
 * @typedef MapArea
 * @type {object}
 * @property {Poly} polygon - The polygon defining the exterior of
 *   the shape.
 * @property {Array.<Poly>} holes - The holes of the shape.
 */

/**
 * Offset the polygons such that there is a `offset` unit buffer
 * between the sides of the outline and around the obstacles. This
 * buffer makes it so that the mesh truly represents the movable area
 * in the map. Assumes vertices defining interior shapes (like the
 * main outline of an enclosed map) are given in CCW order and
 * obstacles are given in CW order.
 * @private
 * @param {Array.<Poly>} polys - The polygons to offset.
 * @param {number} [offset=16] - The amount to offset the polygons
 *   from the movable areas.
 * @return {Array.<MapArea>} - The shapes defining the polygons after
 *   offsetting and merging.
 */
NavMesh.prototype._offsetPolys = function(static_objects, offset) {
  // ~= ball radius / 2
  if (typeof offset == 'undefined') offset = 16;

  // Separate interior and exterior walls. The CCW shapes correspond
  // to the interior wall outlines of out map, the CW shapes are walls
  // that were traced on their outside.
  var interior_walls = [];
  var exterior_walls = static_objects.walls.filter(function(poly, index) {
    if (poly.getOrientation() == "CCW") {
      interior_walls.push(poly);
      return false;
    }
    return true;
  });

  var scale = 100;
  
  // Offset the interior walls.
  interior_walls = interior_walls.map(NavMesh._geometry.convertPolyToClipper);
  ClipperLib.JS.ScaleUpPaths(interior_walls, scale);
  
  var offsetted_interior_walls = [];
  interior_walls.forEach(function(wall) {
    var offsetted_paths = NavMesh._geometry.offsetInterior(wall, offset);
    Array.prototype.push.apply(offsetted_interior_walls, offsetted_paths);
  });

  // Reverse paths since from here on we're going to treat the
  // outlines as the exterior of a shape.
  offsetted_interior_walls.forEach(function(path) {
    path.reverse();
  });
  
  exterior_walls = exterior_walls.map(NavMesh._geometry.convertPolyToClipper);

  ClipperLib.JS.ScaleUpPaths(exterior_walls, scale);

  //var cpr = new ClipperLib.Clipper();
  var cpr = NavMesh._geometry.cpr;
  var co = NavMesh._geometry.co;
  
  var wall_fillType = ClipperLib.PolyFillType.pftEvenOdd;
  var obstacle_fillType = ClipperLib.PolyFillType.pftNonZero;
  
  // Offset exterior walls.
  var offsetted_exterior_walls = [];

  exterior_walls.forEach(function(wall) {
    var offsetted_exterior_wall = new ClipperLib.Paths();
    co.Clear();
    co.AddPath(wall, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
    co.Execute(offsetted_exterior_wall, offset * scale);
    offsetted_exterior_walls.push(offsetted_exterior_wall[0]);
  });
  
  // Offset obstacles.
  // Obstacles are offsetted using miter join type to avoid
  // unnecessary small edges.
  var offsetted_obstacles = new ClipperLib.Paths();

  var obstacles = static_objects.obstacles.map(NavMesh._geometry.convertPolyToClipper);
  ClipperLib.JS.ScaleUpPaths(obstacles, scale);
  co.Clear();
  co.AddPaths(obstacles, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
  co.Execute(offsetted_obstacles, offset * scale);

  // Take difference of polygons defining interior wall and polygons
  // defining exterior walls, limiting to exterior wall polygons whose
  // area is less than the interior wall polygons so the difference
  // operation doesn't remove potentially traversable areas.
  var merged_paths = [];
  offsetted_interior_walls.forEach(function(wall) {
    var area = ClipperLib.JS.AreaOfPolygon(wall, scale);
    var smaller_exterior_walls = offsetted_exterior_walls.filter(function(ext_wall) {
      return ClipperLib.JS.AreaOfPolygon(ext_wall, scale) < area;
    });
    var paths = new ClipperLib.Paths();
    cpr.Clear();
    cpr.AddPath(wall, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(smaller_exterior_walls, ClipperLib.PolyType.ptClip, true);
    // Obstacles are small individual solid objects that aren't at
    // risk of enclosing an interior area.
    cpr.AddPaths(offsetted_obstacles, ClipperLib.PolyType.ptClip, true);
    cpr.Execute(ClipperLib.ClipType.ctDifference,
      paths,
      ClipperLib.PolyFillType.pftNonZero,
      ClipperLib.PolyFillType.pftNonZero
    );
    Array.prototype.push.apply(merged_paths, paths);
  });

  return NavMesh._geometry.getAreas(merged_paths, scale);
};

/**
 * Sets up callbacks on the web worker promise object to initialize
 * the web worker interface once loaded.
 * @private
 */
NavMesh.prototype._setupWorker = function() {
  // Initial state.
  this.worker = new Worker(window.URL.createObjectURL(new Blob(['(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module \'"+o+"\'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n(function (global){\n!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.PriorityQueue=t()}}(function(){return function t(e,i,r){function o(n,s){if(!i[n]){if(!e[n]){var u="function"==typeof require&&require;if(!s&&u)return u(n,!0);if(a)return a(n,!0);var h=new Error("Cannot find module \'"+n+"\'");throw h.code="MODULE_NOT_FOUND",h}var p=i[n]={exports:{}};e[n][0].call(p.exports,function(t){var i=e[n][1][t];return o(i?i:t)},p,p.exports,t,e,i,r)}return i[n].exports}for(var a="function"==typeof require&&require,n=0;n<r.length;n++)o(r[n]);return o}({1:[function(t,e){var i,r,o,a,n,s={}.hasOwnProperty,u=function(t,e){function i(){this.constructor=t}for(var r in e)s.call(e,r)&&(t[r]=e[r]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t};i=t("./PriorityQueue/AbstractPriorityQueue"),r=t("./PriorityQueue/ArrayStrategy"),a=t("./PriorityQueue/BinaryHeapStrategy"),o=t("./PriorityQueue/BHeapStrategy"),n=function(t){function e(t){t||(t={}),t.strategy||(t.strategy=a),t.comparator||(t.comparator=function(t,e){return(t||0)-(e||0)}),e.__super__.constructor.call(this,t)}return u(e,t),e}(i),n.ArrayStrategy=r,n.BinaryHeapStrategy=a,n.BHeapStrategy=o,e.exports=n},{"./PriorityQueue/AbstractPriorityQueue":2,"./PriorityQueue/ArrayStrategy":3,"./PriorityQueue/BHeapStrategy":4,"./PriorityQueue/BinaryHeapStrategy":5}],2:[function(t,e){var i;e.exports=i=function(){function t(t){if(null==(null!=t?t.strategy:void 0))throw"Must pass options.strategy, a strategy";if(null==(null!=t?t.comparator:void 0))throw"Must pass options.comparator, a comparator";this.priv=new t.strategy(t),this.length=0}return t.prototype.queue=function(t){return this.length++,void this.priv.queue(t)},t.prototype.dequeue=function(){if(!this.length)throw"Empty queue";return this.length--,this.priv.dequeue()},t.prototype.peek=function(){if(!this.length)throw"Empty queue";return this.priv.peek()},t}()},{}],3:[function(t,e){var i,r;r=function(t,e,i){var r,o,a;for(o=0,r=t.length;r>o;)a=o+r>>>1,i(t[a],e)>=0?o=a+1:r=a;return o},e.exports=i=function(){function t(t){var e;this.options=t,this.comparator=this.options.comparator,this.data=(null!=(e=this.options.initialValues)?e.slice(0):void 0)||[],this.data.sort(this.comparator).reverse()}return t.prototype.queue=function(t){var e;return e=r(this.data,t,this.comparator),void this.data.splice(e,0,t)},t.prototype.dequeue=function(){return this.data.pop()},t.prototype.peek=function(){return this.data[this.data.length-1]},t}()},{}],4:[function(t,e){var i;e.exports=i=function(){function t(t){var e,i,r,o,a,n,s,u,h;for(this.comparator=(null!=t?t.comparator:void 0)||function(t,e){return t-e},this.pageSize=(null!=t?t.pageSize:void 0)||512,this.length=0,r=0;1<<r<this.pageSize;)r+=1;if(1<<r!==this.pageSize)throw"pageSize must be a power of two";for(this._shift=r,this._emptyMemoryPageTemplate=e=[],i=a=0,u=this.pageSize;u>=0?u>a:a>u;i=u>=0?++a:--a)e.push(null);if(this._memory=[],this._mask=this.pageSize-1,t.initialValues)for(h=t.initialValues,n=0,s=h.length;s>n;n++)o=h[n],this.queue(o)}return t.prototype.queue=function(t){return this.length+=1,this._write(this.length,t),void this._bubbleUp(this.length,t)},t.prototype.dequeue=function(){var t,e;return t=this._read(1),e=this._read(this.length),this.length-=1,this.length>0&&(this._write(1,e),this._bubbleDown(1,e)),t},t.prototype.peek=function(){return this._read(1)},t.prototype._write=function(t,e){var i;for(i=t>>this._shift;i>=this._memory.length;)this._memory.push(this._emptyMemoryPageTemplate.slice(0));return this._memory[i][t&this._mask]=e},t.prototype._read=function(t){return this._memory[t>>this._shift][t&this._mask]},t.prototype._bubbleUp=function(t,e){var i,r,o,a;for(i=this.comparator;t>1&&(r=t&this._mask,t<this.pageSize||r>3?o=t&~this._mask|r>>1:2>r?(o=t-this.pageSize>>this._shift,o+=o&~(this._mask>>1),o|=this.pageSize>>1):o=t-2,a=this._read(o),!(i(a,e)<0));)this._write(o,e),this._write(t,a),t=o;return void 0},t.prototype._bubbleDown=function(t,e){var i,r,o,a,n;for(n=this.comparator;t<this.length;)if(t>this._mask&&!(t&this._mask-1)?i=r=t+2:t&this.pageSize>>1?(i=(t&~this._mask)>>1,i|=t&this._mask>>1,i=i+1<<this._shift,r=i+1):(i=t+(t&this._mask),r=i+1),i!==r&&r<=this.length)if(o=this._read(i),a=this._read(r),n(o,e)<0&&n(o,a)<=0)this._write(i,e),this._write(t,o),t=i;else{if(!(n(a,e)<0))break;this._write(r,e),this._write(t,a),t=r}else{if(!(i<=this.length))break;if(o=this._read(i),!(n(o,e)<0))break;this._write(i,e),this._write(t,o),t=i}return void 0},t}()},{}],5:[function(t,e){var i;e.exports=i=function(){function t(t){var e;this.comparator=(null!=t?t.comparator:void 0)||function(t,e){return t-e},this.length=0,this.data=(null!=(e=t.initialValues)?e.slice(0):void 0)||[],this._heapify()}return t.prototype._heapify=function(){var t,e,i;if(this.data.length>0)for(t=e=1,i=this.data.length;i>=1?i>e:e>i;t=i>=1?++e:--e)this._bubbleUp(t);return void 0},t.prototype.queue=function(t){return this.data.push(t),void this._bubbleUp(this.data.length-1)},t.prototype.dequeue=function(){var t,e;return e=this.data[0],t=this.data.pop(),this.data.length>0&&(this.data[0]=t,this._bubbleDown(0)),e},t.prototype.peek=function(){return this.data[0]},t.prototype._bubbleUp=function(t){for(var e,i;t>0&&(e=t-1>>>1,this.comparator(this.data[t],this.data[e])<0);)i=this.data[e],this.data[e]=this.data[t],this.data[t]=i,t=e;return void 0},t.prototype._bubbleDown=function(t){var e,i,r,o,a;for(e=this.data.length-1;;){if(i=(t<<1)+1,o=i+1,r=t,e>=i&&this.comparator(this.data[i],this.data[r])<0&&(r=i),e>=o&&this.comparator(this.data[o],this.data[r])<0&&(r=o),r===t)break;a=this.data[r],this.data[r]=this.data[t],this.data[t]=a,t=r}return void 0},t}()},{}]},{},[1])(1)});\n}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})\n},{}],2:[function(require,module,exports){\nvar Pathfinder = require(\'./pathfinder\');\r\nvar geo = require(\'./geometry\');\r\n\r\n/**\r\n * Pathfinding web worker implementation.\r\n * @ignore\r\n */\r\nvar Point = geo.Point;\r\nvar Poly = geo.Poly;\r\n\r\n/**\r\n * Object with utility methods for converting objects from serialized\r\n * message form into the required objects.\r\n * @private\r\n */\r\nvar Convert = {};\r\n\r\n/**\r\n * The format of a Point as serialized by the Web Worker message-\r\n * passing interface.\r\n * @private\r\n * @typedef {object} PointObj\r\n * @property {number} x\r\n * @property {number} y\r\n */\r\n\r\n/**\r\n * Convert serialized Point object back to Point.\r\n * @private\r\n * @param {PointObj} obj - The serialized Point object.\r\n */\r\nConvert.toPoint = function(obj) {\r\n  return new Point(obj.x, obj.y);\r\n};\r\n\r\n/**\r\n * The format of a Poly as serialized by the Web Worker message-\r\n * passing interface.\r\n * @private\r\n * @typedef {object} PolyObj\r\n * @property {Array.<PointObj>} points - The array of serialized\r\n *   Points.\r\n * @property {boolean} hole - Whether or not the polygon is a hole.\r\n * @property {integer} numpoints - The number of points in the Poly.\r\n */\r\n\r\n /**\r\n  * Convert serialized Poly object back to Poly.\r\n  * @private\r\n  * @param {PolyObj} obj - The serialized Poly object.\r\n  */\r\nConvert.toPoly = function(obj) {\r\n  var poly = new Poly();\r\n  poly.points = obj.points.map(Convert.toPoint);\r\n  poly.hole = obj.hole;\r\n  poly.update();\r\n  return poly;\r\n};\r\n\r\nvar Logger = {};\r\n\r\n/**\r\n * Sends message to parent to be logged to console. Takes same\r\n * arguments as Bragi logger.\r\n * @private\r\n * @param {string} group - The group to associate the message with.\r\n * @param {...*} - arbitrary arguments to be passed back to the parent\r\n *   logging function.\r\n */\r\nLogger.log = function(group) {\r\n  var message = ["log"];\r\n  Array.prototype.push.apply(message, arguments);\r\n  postMessage(message);\r\n};\r\n\r\nvar Util = {};\r\n\r\nUtil.splice = function(ary, indices) {\r\n  indices = indices.sort(Util._numberCompare).reverse();\r\n  var removed = [];\r\n  indices.forEach(function(i) {\r\n    removed.push(ary.splice(i, 1)[0]);\r\n  });\r\n  return removed;\r\n};\r\n\r\nUtil._numberCompare = function(a, b) {\r\n  if (a < b) {\r\n    return -1;\r\n  } else if (a > b) {\r\n    return 1;\r\n  } else {\r\n    return 0;\r\n  }\r\n};\r\n\r\n/**\r\n * Set up various actions to take on communication.\r\n * @private\r\n * @param {Array} e - An array with the first element being a string\r\n *   identifier for the message type, and subsequent elements being\r\n *   arguments to be passed to the relevant function. Message types:\r\n *   * polys - sets the polygons to use for navigation\r\n *       - {Array.<Poly>} array of polygons defining the map\r\n *   * aStar - computes A* on above-set items\r\n *       - {Point} start location to use for search\r\n *       - {Point} end location to use for search\r\n *   * isInitialized - check if the worker is initialized.\r\n */\r\nonmessage = function(e) {\r\n  var data = e.data;\r\n  var name = data[0];\r\n  Logger.log("worker:debug", "Message received by worker:", data);\r\n  if (name == "polys") {\r\n    // Polygons defining map.\r\n    self.polys = data[1].map(Convert.toPoly);\r\n\r\n    // Initialize pathfinder module.\r\n    self.pathfinder = new Pathfinder(self.polys);\r\n  } else if (name == "polyUpdate") {\r\n    // Update to navmesh.\r\n    var newPolys = data[1].map(Convert.toPoly);\r\n    var removedPolys = data[2];\r\n\r\n    Util.splice(self.polys, removedPolys);\r\n    Array.prototype.push.apply(self.polys, newPolys);\r\n\r\n    // Re-initialize pathfinder.\r\n    self.pathfinder = new Pathfinder(self.polys);\r\n  } else if (name == "aStar") {\r\n    var source = Convert.toPoint(data[1]);\r\n    var target = Convert.toPoint(data[2]);\r\n\r\n    var path = self.pathfinder.aStar(source, target);\r\n    postMessage(["result", path]);\r\n  } else if (name == "isInitialized") {\r\n    postMessage(["initialized"]);\r\n  }\r\n};\r\n\r\nLogger.log("worker", "Worker loaded.");\r\n// Sent confirmation that worker is initialized.\r\npostMessage(["initialized"]);\r\n\n},{"./geometry":3,"./pathfinder":4}],3:[function(require,module,exports){\n/**\r\n * A point can represent a vertex in a 2d environment or a vector.\r\n * @constructor\r\n * @param {number} x - The `x` coordinate of the point.\r\n * @param {number} y - The `y` coordinate of the point.\r\n */\r\nPoint = function(x, y) {\r\n  this.x = x;\r\n  this.y = y;\r\n};\r\nexports.Point = Point;\r\n\r\n/**\r\n * Convert a point-like object into a point.\r\n * @param {PointLike} p - The point-like object to convert.\r\n * @return {Point} - The new point representing the point-like\r\n *   object.\r\n */\r\nPoint.fromPointLike = function(p) {\r\n  return new Point(p.x, p.y);\r\n};\r\n\r\n/**\r\n * String method for point-like objects.\r\n * @param {PointLike} p - The point-like object to convert.\r\n * @return {Point} - The new point representing the point-like\r\n *   object.\r\n */\r\nPoint.toString = function(p) {\r\n  return "x" + p.x + "y" + p.y;\r\n};\r\n\r\n/**\r\n * Takes a point or scalar and adds slotwise in the case of another\r\n * point, or to each parameter in the case of a scalar.\r\n * @param {(Point|number)} - The Point, or scalar, to add to this\r\n *   point.\r\n */\r\nPoint.prototype.add = function(p) {\r\n  if (typeof p == "number")\r\n    return new Point(this.x + p, this.y + p);\r\n  return new Point(this.x + p.x, this.y + p.y);\r\n};\r\n\r\n/**\r\n * Takes a point or scalar and subtracts slotwise in the case of\r\n * another point or from each parameter in the case of a scalar.\r\n * @param {(Point|number)} - The Point, or scalar, to subtract from\r\n *   this point.\r\n */\r\nPoint.prototype.sub = function(p) {\r\n  if (typeof p == "number")\r\n    return new Point(this.x - p, this.y - p);\r\n  return new Point(this.x - p.x, this.y - p.y);\r\n};\r\n\r\n/**\r\n * Takes a scalar value and multiplies each parameter of the point\r\n * by the scalar.\r\n * @param  {number} f - The number to multiple the parameters by.\r\n * @return {Point} - A new point with the calculated coordinates.\r\n */\r\nPoint.prototype.mul = function(f) {\r\n  return new Point(this.x * f, this.y * f);\r\n};\r\n\r\n/**\r\n * Takes a scalar value and divides each parameter of the point\r\n * by the scalar.\r\n * @param  {number} f - The number to divide the parameters by.\r\n * @return {Point} - A new point with the calculated coordinates.\r\n */\r\nPoint.prototype.div = function(f) {\r\n  return new Point(this.x / f, this.y / f);\r\n};\r\n\r\n/**\r\n * Takes another point and returns a boolean indicating whether the\r\n * points are equal. Two points are equal if their parameters are\r\n * equal.\r\n * @param  {Point} p - The point to check equality against.\r\n * @return {boolean} - Whether or not the two points are equal.\r\n */\r\nPoint.prototype.eq = function(p) {\r\n  return (this.x == p.x && this.y == p.y);\r\n};\r\n\r\n/**\r\n * Takes another point and returns a boolean indicating whether the\r\n * points are not equal. Two points are considered not equal if their\r\n * parameters are not equal.\r\n * @param  {Point} p - The point to check equality against.\r\n * @return {boolean} - Whether or not the two points are not equal.\r\n */\r\nPoint.prototype.neq = function(p) {\r\n  return (this.x != p.x || this.y != p.y);\r\n};\r\n\r\n// Given another point, returns the dot product.\r\nPoint.prototype.dot = function(p) {\r\n  return (this.x * p.x + this.y * p.y);\r\n};\r\n\r\n// Given another point, returns the \'cross product\', or at least the 2d\r\n// equivalent.\r\nPoint.prototype.cross = function(p) {\r\n  return (this.x * p.y - this.y * p.x);\r\n};\r\n\r\n// Given another point, returns the distance to that point.\r\nPoint.prototype.dist = function(p) {\r\n  var diff = this.sub(p);\r\n  return Math.sqrt(diff.dot(diff));\r\n};\r\n\r\n// Given another point, returns the squared distance to that point.\r\nPoint.prototype.dist2 = function(p) {\r\n  var diff = this.sub(p);\r\n  return diff.dot(diff);\r\n};\r\n\r\n/**\r\n * Returns true if the point is (0, 0).\r\n * @return {boolean} - Whether or not the point is (0, 0).\r\n */\r\nPoint.prototype.zero = function() {\r\n  return this.x == 0 && this.y == 0;\r\n};\r\n\r\nPoint.prototype.len = function() {\r\n  return this.dist(new Point(0, 0));\r\n};\r\n\r\nPoint.prototype.normalize = function() {\r\n  var n = this.dist(new Point(0, 0));\r\n  if (n > 0) return this.div(n);\r\n  return new Point(0, 0);\r\n};\r\n\r\nPoint.prototype.toString = function() {\r\n  return \'x\' + this.x + \'y\' + this.y;\r\n};\r\n\r\n/**\r\n * Return a copy of the point.\r\n * @return {Point} - The new point.\r\n */\r\nPoint.prototype.clone = function() {\r\n  return new Point(this.x, this.y);\r\n};\r\n\r\n/**\r\n * Edges are used to represent the border between two adjacent\r\n * polygons.\r\n * @constructor\r\n * @param {Point} p1 - The first point of the edge.\r\n * @param {Point} p2 - The second point of the edge.\r\n */\r\nEdge = function(p1, p2) {\r\n  this.p1 = p1;\r\n  this.p2 = p2;\r\n  this.center = p1.add(p2.sub(p1).div(2));\r\n  this.points = [this.p1, this.center, this.p2];\r\n};\r\nexports.Edge = Edge;\r\n\r\nEdge.prototype._CCW = function(p1, p2, p3) {\r\n  a = p1.x; b = p1.y;\r\n  c = p2.x; d = p2.y;\r\n  e = p3.x; f = p3.y;\r\n  return (f - b) * (c - a) > (d - b) * (e - a);\r\n};\r\n\r\n/**\r\n * from http://stackoverflow.com/a/16725715\r\n * Checks whether this edge intersects the provided edge.\r\n * @param {Edge} edge - The edge to check intersection for.\r\n * @return {boolean} - Whether or not the edges intersect.\r\n */\r\nEdge.prototype.intersects = function(edge) {\r\n  var q1 = edge.p1, q2 = edge.p2;\r\n  if (q1.eq(this.p1) || q1.eq(this.p2) || q2.eq(this.p1) || q2.eq(this.p2)) return false;\r\n  return (this._CCW(this.p1, q1, q2) != this._CCW(this.p2, q1, q2)) && (this._CCW(this.p1, this.p2, q1) != this._CCW(this.p1, this.p2, q2));\r\n};\r\n\r\n/**\r\n * Polygon class.\r\n * Can be initialized with an array of points.\r\n * @constructor\r\n * @param {Array.<Point>} [points] - The points to use to initialize\r\n *   the poly.\r\n */\r\nPoly = function(points) {\r\n  if (typeof points == \'undefined\') points = false;\r\n  this.hole = false;\r\n  this.points = null;\r\n  this.numpoints = 0;\r\n  if (points) {\r\n    this.numpoints = points.length;\r\n    this.points = points.slice();\r\n  }\r\n};\r\nexports.Poly = Poly;\r\n\r\nPoly.prototype.init = function(n) {\r\n  this.points = new Array(n);\r\n  this.numpoints = n;\r\n};\r\n\r\nPoly.prototype.update = function() {\r\n  this.numpoints = this.points.length;\r\n};\r\n\r\nPoly.prototype.triangle = function(p1, p2, p3) {\r\n  this.init(3);\r\n  this.points[0] = p1;\r\n  this.points[1] = p2;\r\n  this.points[2] = p3;\r\n};\r\n\r\n// Takes an index and returns the point at that index, or null.\r\nPoly.prototype.getPoint = function(n) {\r\n  if (this.points && this.numpoints > n)\r\n    return this.points[n];\r\n  return null;\r\n};\r\n\r\n// Set a point, fails silently otherwise. TODO: replace with bracket notation.\r\nPoly.prototype.setPoint = function(i, p) {\r\n  if (this.points && this.points.length > i) {\r\n    this.points[i] = p;\r\n  }\r\n};\r\n\r\n// Given an index i, return the index of the next point.\r\nPoly.prototype.getNextI = function(i) {\r\n  return (i + 1) % this.numpoints;\r\n};\r\n\r\nPoly.prototype.getPrevI = function(i) {\r\n  if (i == 0)\r\n    return (this.numpoints - 1);\r\n  return i - 1;\r\n};\r\n\r\n// Returns the signed area of a polygon, if the vertices are given in\r\n// CCW order then the area will be > 0, < 0 otherwise.\r\nPoly.prototype.getArea = function() {\r\n  var area = 0;\r\n  for (var i = 0; i < this.numpoints; i++) {\r\n    var i2 = this.getNextI(i);\r\n    area += this.points[i].x * this.points[i2].y - this.points[i].y * this.points[i2].x;\r\n  }\r\n  return area;\r\n};\r\n\r\nPoly.prototype.getOrientation = function() {\r\n  var area = this.getArea();\r\n  if (area > 0) return "CCW";\r\n  if (area < 0) return "CW";\r\n  return 0;\r\n};\r\n\r\nPoly.prototype.setOrientation = function(orientation) {\r\n  var current_orientation = this.getOrientation();\r\n  if (current_orientation && (current_orientation !== orientation)) {\r\n    this.invert();\r\n  }\r\n};\r\n\r\nPoly.prototype.invert = function() {\r\n  var newpoints = new Array(this.numpoints);\r\n  for (var i = 0; i < this.numpoints; i++) {\r\n    newpoints[i] = this.points[this.numpoints - i - 1];\r\n  }\r\n  this.points = newpoints;\r\n};\r\n\r\nPoly.prototype.getCenter = function() {\r\n  var x = this.points.map(function(p) { return p.x });\r\n  var y = this.points.map(function(p) { return p.y });\r\n  var minX = Math.min.apply(null, x);\r\n  var maxX = Math.max.apply(null, x);\r\n  var minY = Math.min.apply(null, y);\r\n  var maxY = Math.max.apply(null, y);\r\n  return new Point((minX + maxX)/2, (minY + maxY)/2);\r\n};\r\n\r\n// Adapted from http://stackoverflow.com/a/16283349\r\nPoly.prototype.centroid = function() {\r\n  var x = 0,\r\n      y = 0,\r\n      i,\r\n      j,\r\n      f,\r\n      point1,\r\n      point2;\r\n\r\n  for (i = 0, j = this.points.length - 1; i < this.points.length; j = i, i += 1) {\r\n    point1 = this.points[i];\r\n    point2 = this.points[j];\r\n    f = point1.x * point2.y - point2.x * point1.y;\r\n    x += (point1.x + point2.x) * f;\r\n    y += (point1.y + point2.y) * f;\r\n  }\r\n\r\n  f = this.getArea() * 3;\r\n  x = Math.abs(x);\r\n  y = Math.abs(y);\r\n  return new Point(x / f, y / f);\r\n};\r\n\r\nPoly.prototype.toString = function() {\r\n  var center = this.centroid();\r\n  return "" + center.x + " " + center.y;\r\n};\r\n\r\n/**\r\n * Checks if the given point is contained within the Polygon.\r\n * Adapted from http://stackoverflow.com/a/8721483\r\n *\r\n * @param {Point} p - The point to check.\r\n * @return {boolean} - Whether or not the point is contained within\r\n *   the polygon.\r\n */\r\nPoly.prototype.containsPoint = function(p) {\r\n  var result = false;\r\n  for (var i = 0, j = this.numpoints - 1; i < this.numpoints; j = i++) {\r\n    var p1 = this.points[j], p2 = this.points[i];\r\n    if ((p2.y > p.y) != (p1.y > p.y) &&\r\n        (p.x < (p1.x - p2.x) * (p.y - p2.y) / (p1.y - p2.y) + p2.x)) {\r\n      result = !result;\r\n    }\r\n  }\r\n  return result;\r\n};\r\n\r\n/**\r\n * Clone the given polygon into a new polygon.\r\n * @return {Poly} - A clone of the polygon.\r\n */\r\nPoly.prototype.clone = function() {\r\n  return new Poly(this.points.slice().map(function(point) {\r\n    return point.clone();\r\n  }));\r\n};\r\n\r\n/**\r\n * Translate a polygon along a given vector.\r\n * @param {Point} vec - The vector along which to translate the\r\n *   polygon.\r\n * @return {Poly} - The translated polygon.\r\n */\r\nPoly.prototype.translate = function(vec) {\r\n  return new Poly(this.points.map(function(point) {\r\n    return point.add(vec);\r\n  }));\r\n};\r\n\r\n/**\r\n * Returns an array of edges representing the polygon.\r\n * @return {Array.<Edge>} - The edges of the polygon.\r\n */\r\nPoly.prototype.edges = function() {\r\n  if (!this.hasOwnProperty("cached_edges")) {\r\n    this.cached_edges = this.points.map(function(point, i) {\r\n      return new Edge(point, this.points[this.getNextI(i)]);\r\n    }, this);\r\n  }\r\n  return this.cached_edges;\r\n};\r\n\r\n/**\r\n * Naive check if other poly intersects this one, assuming both convex.\r\n * @param {Poly} poly\r\n * @return {boolean} - Whether the polygons intersect.\r\n */\r\nPoly.prototype.intersects = function(poly) {\r\n  var inside = poly.points.some(function(p) {\r\n    return this.containsPoint(p);\r\n  }, this);\r\n  inside = inside || this.points.some(function(p) {\r\n    return poly.containsPoint(p);\r\n  });\r\n  if (inside) {\r\n    return true;\r\n  } else {\r\n    var ownEdges = this.edges();\r\n    var otherEdges = poly.edges();\r\n    var intersect = ownEdges.some(function(ownEdge) {\r\n      return otherEdges.some(function(otherEdge) {\r\n        return ownEdge.intersects(otherEdge);\r\n      });\r\n    });\r\n    return intersect;\r\n  }\r\n};\r\n\r\nvar util = {};\r\nexports.util = util;\r\n\r\n/**\r\n * Given an array of polygons, returns the one that contains the point.\r\n * If no polygon is found, null is returned.\r\n * @param {Point} p - The point to find the polygon for.\r\n * @param {Array.<Poly>} polys - The polygons to search for the point.\r\n * @return {?Polygon} - The polygon containing the point.\r\n */\r\nutil.findPolyForPoint = function(p, polys) {\r\n  var i, poly;\r\n  for (i in polys) {\r\n    poly = polys[i];\r\n    if (poly.containsPoint(p)) {\r\n      return poly;\r\n    }\r\n  }\r\n  return null;\r\n};\r\n\r\n/**\r\n * Holds the properties of a collision, if one occurred.\r\n * @typedef Collision\r\n * @type {object}\r\n * @property {boolean} collides - Whether there is a collision.\r\n * @property {boolean} inside - Whether one object is inside the other.\r\n * @property {?Point} point - The point of collision, if collision\r\n *   occurs, and if `inside` is false.\r\n * @property {?Point} normal - A unit vector normal to the point\r\n *   of collision, if it occurs and if `inside` is false.\r\n */\r\n/**\r\n * If the ray intersects the circle, the distance to the intersection\r\n * along the ray is returned, otherwise false is returned.\r\n * @param {Point} p - The start of the ray.\r\n * @param {Point} ray - Unit vector extending from `p`.\r\n * @param {Point} c - The center of the circle for the object being\r\n *   checked for intersection.\r\n * @param {number} radius - The radius of the circle.\r\n * @return {Collision} - The collision information.\r\n */\r\nutil.lineCircleIntersection = function(p, ray, c, radius) {\r\n  var collision = {\r\n    collides: false,\r\n    inside: false,\r\n    point: null,\r\n    normal: null\r\n  };\r\n  var vpc = c.sub(p);\r\n\r\n  if (vpc.len() <= radius) {\r\n    // Point is inside obstacle.\r\n    collision.collides = true;\r\n    collision.inside = (vpc.len() !== radius);\r\n  } else if (ray.dot(vpc) >= 0) {\r\n    // Circle is ahead of point.\r\n    // Projection of center point onto ray.\r\n    var pc = p.add(ray.mul(ray.dot(vpc)));\r\n    // Length from c to its projection on the ray.\r\n    var len_c_pc = c.sub(pc).len();\r\n\r\n    if (len_c_pc <= radius) {\r\n      collision.collides = true;\r\n\r\n      // Distance from projected point to intersection.\r\n      var len_intersection = Math.sqrt(len_c_pc * len_c_pc + radius * radius);\r\n      collision.point = pc.sub(ray.mul(len_intersection));\r\n      collision.normal = collision.point.sub(c).normalize();\r\n    }\r\n  }\r\n  return collision;\r\n};\r\n\n},{}],4:[function(require,module,exports){\nvar geo = require(\'./geometry\');\r\nvar findPolyForPoint = geo.util.findPolyForPoint;\r\nvar PriorityQueue = require(\'priority-queue\');\r\n\r\n/**\r\n * Pathfinder implements pathfinding on a navigation mesh.\r\n * @constructor\r\n * @param {Array.<Poly>} polys - The polygons defining the navigation mesh.\r\n * @param {boolean} [init=true] - Whether or not to initialize the pathfinder.\r\n */\r\nvar Pathfinder = function(polys, init) {\r\n  if (typeof init == "undefined") init = true;\r\n  this.polys = polys;\r\n  if (init) {\r\n    this.init();\r\n  }\r\n};\r\nmodule.exports = Pathfinder;\r\n\r\nPathfinder.prototype.init = function() {\r\n  this.grid = this.generateAdjacencyGrid(this.polys);\r\n};\r\n\r\n/**\r\n * Computes path from source to target, using sides and centers of the edges\r\n * between adjacent polygons. source and target are Points and polys should\r\n * be the final partitioned map.\r\n * @param {Point} source - The start location for the search.\r\n * @param {Point} target - The target location for the search.\r\n * @return {?Array.<Point>} - A series of points representing the path from\r\n *   the source to the target. If a path is not found, `null` is returned.\r\n */\r\nPathfinder.prototype.aStar = function(source, target) {\r\n  // Compares the value of two nodes.\r\n  function nodeValue(node1, node2) {\r\n    return (node1.dist + heuristic(node1.point)) - (node2.dist + heuristic(node2.point));\r\n  }\r\n\r\n  // Distance between polygons.\r\n  function euclideanDistance(p1, p2) {\r\n    return p1.dist(p2);\r\n  }\r\n\r\n  // Distance between polygons. todo: update\r\n  function manhattanDistance(elt1, elt2) {\r\n    return (elt1.r - elt2.r) + (elt1.c - elt2.c);\r\n  }\r\n\r\n  // Takes Point and returns value.\r\n  function heuristic(p) {\r\n    return euclideanDistance(p, target);\r\n  }\r\n\r\n  var sourcePoly = findPolyForPoint(source, this.polys);\r\n\r\n  // We\'re outside of the mesh somehow. Try a few nearby points.\r\n  if (!sourcePoly) {\r\n    var offsetSource = [new Point(5, 0), new Point(-5, 0), new Point(0, -5), new Point(0, 5)];\r\n    for (var i = 0; i < offsetSource.length; i++) {\r\n      // Make new point.\r\n      var point = source.add(offsetSource[i]);\r\n      sourcePoly = findPolyForPoint(point, this.polys);\r\n      if (sourcePoly) {\r\n        source = point;\r\n        break;\r\n      }\r\n    }\r\n    if (!sourcePoly) {\r\n      return null;\r\n    }\r\n  }\r\n  var targetPoly = findPolyForPoint(target, this.polys);\r\n\r\n  // Handle trivial case.\r\n  if (sourcePoly == targetPoly) {\r\n    return [source, target];\r\n  }\r\n\r\n  // Warning, may have compatibility issues.\r\n  var discoveredPolys = new WeakSet();\r\n  var discoveredPoints = new WeakSet();\r\n  var pq = new PriorityQueue({ comparator: nodeValue });\r\n  var found = null;\r\n  // Initialize with start location.\r\n  pq.queue({dist: 0, poly: sourcePoly, point: source, parent: null});\r\n  while (pq.length > 0) {\r\n    var node = pq.dequeue();\r\n    if (node.poly == targetPoly) {\r\n      found = node;\r\n      break;\r\n    } else {\r\n      discoveredPolys.add(node.poly);\r\n      discoveredPoints.add(node.point);\r\n    }\r\n    // This may be undefined if there was no polygon found.\r\n    var neighbors = this.grid.get(node.poly);\r\n    for (var i = 0; i < neighbors.length; i++) {\r\n      var elt = neighbors[i];\r\n      var neighborFound = discoveredPolys.has(elt.poly);\r\n\r\n      for (var j = 0; j < elt.edge.points.length; j++) {\r\n        var p = elt.edge.points[j];\r\n        if (!neighborFound || !discoveredPoints.has(p))\r\n          pq.queue({dist: node.dist + euclideanDistance(p, node.point), poly: elt.poly, point: p, parent: node});\r\n      }\r\n    }\r\n  }\r\n\r\n  if (found) {\r\n    var path = [];\r\n    var current = found;\r\n    while (current.parent) {\r\n      path.unshift(current.point);\r\n      current = current.parent;\r\n    }\r\n    path.unshift(current.point);\r\n    // Add end point to path.\r\n    path.push(target);\r\n    return path;\r\n  } else {\r\n    return null;\r\n  }\r\n};\r\n\r\n/**\r\n * Holds the "neighbor" relationship of Poly objects in the partition\r\n * using the Poly\'s themselves as keys, and an array of Poly\'s as\r\n * values, where the Polys in the array are neighbors of the Poly\r\n * that was the key.\r\n * @typedef AdjacencyGrid\r\n * @type {Object.<Poly, Array<Poly>>}\r\n */\r\n\r\n/**\r\n * Given an array of Poly objects, find all neighboring polygons for\r\n * each polygon.\r\n * @private\r\n * @param {Array.<Poly>} polys - The array of polys to find neighbors\r\n *   among.\r\n * @return {AdjacencyGrid} - The "neighbor" relationships.\r\n */\r\nPathfinder.prototype.generateAdjacencyGrid = function(polys) {\r\n  var neighbors = new WeakMap();\r\n  polys.forEach(function(poly, polyI, polys) {\r\n    if (neighbors.has(poly)) {\r\n      // Maximum number of neighbors already found.\r\n      if (neighbors.get(poly).length == poly.numpoints) {\r\n        return;\r\n      }\r\n    } else {\r\n      // Initialize array.\r\n      neighbors.set(poly, new Array());\r\n    }\r\n    // Of remaining polygons, find some that are adjacent.\r\n    poly.points.forEach(function(p1, i, points) {\r\n      // Next point.\r\n      var p2 = points[poly.getNextI(i)];\r\n      for (var polyJ = polyI + 1; polyJ < polys.length; polyJ++) {\r\n        var poly2 = polys[polyJ];\r\n        // Iterate over points until match is found.\r\n        poly2.points.some(function(q1, j, points2) {\r\n          var q2 = points2[poly2.getNextI(j)];\r\n          var match = p1.eq(q2) && p2.eq(q1);\r\n          if (match) {\r\n            var edge = new Edge(p1, p2);\r\n            neighbors.get(poly).push({ poly: poly2, edge: edge });\r\n            if (!neighbors.has(poly2)) {\r\n              neighbors.set(poly2, new Array());\r\n            }\r\n            neighbors.get(poly2).push({ poly: poly, edge: edge });\r\n          }\r\n          return match;\r\n        });\r\n        if (neighbors.get(poly).length == poly.numpoints) break;\r\n      }\r\n    });\r\n  });\r\n  return neighbors;\r\n};\r\n\n},{"./geometry":3,"priority-queue":1}]},{},[2])'],{type:"text/javascript"})));
  this.worker.onmessage = this._getWorkerInterface();
  // Check if worker is already initialized.
  this.worker.postMessage(["isInitialized"]);
  this.workerInitialized = false;

  // Set up callback to update worker on navmesh update.
  this.onUpdate(function(disregard, newPolys, removedIndices) {
    if (this.worker && this.workerInitialized) {
      this.worker.postMessage(["polyUpdate", newPolys, removedIndices]);
    } else {
      this.logger.log("navmesh:debug", "Worker not loaded yet.");
    }
  }.bind(this));
};

/**
 * Handler for log messages sent by worker.
 * @private
 * @param {Array.<(string|object)>} message - Array of arguments to
 *   pass to `Logger.log`. The first element should be the group to
 *   associate the message with.
 */
NavMesh.prototype._workerLogger = function(message) {
  this.logger.log.apply(null, message);
};

/**
 * Returns the function to be used for the `onmessage` callback for
 * the web worker.
 * @private
 * @return {Function} - The `onmessage` handler for the web worker.
 */
NavMesh.prototype._getWorkerInterface = function() {
  return function(message) {
    var data = message.data;
    var name = data[0];

    // Output debug message for all messages received except "log"
    // messages.
    if (name !== "log")
      this.logger.log("navmesh:debug", "Message received from worker:", data);

    if (name == "log") {
      this._workerLogger(data.slice(1));
    } else if (name == "result") {
      var path = data[1];
      this.lastCallback(path);
    } else if (name == "initialized") {
      this.workerInitialized = true;
      // Send parsed map polygons to worker when available.
      this.onInit(function() {
        this.worker.postMessage(["polys", this.polys]);
      }.bind(this));
    }
  }.bind(this);
};

/**
 * Make utilities in polypartition available without requiring
 * that it be included in external scripts.
 */
NavMesh.poly = geo;

/**
 * Hold methods used for generating the navigation mesh.
 * @private
 */
NavMesh._geometry = {};

/**
 * Initialized Clipper for operations.
 * @private
 * @type {ClipperLib.Clipper}
 */
NavMesh._geometry.cpr = new ClipperLib.Clipper();

/**
 * Initialized ClipperOffset for operations.
 * @private
 * @type {ClipperLib.ClipperOffset}
 */
NavMesh._geometry.co = new ClipperLib.ClipperOffset();

// Defaults.
NavMesh._geometry.co.MiterLimit = 2;
NavMesh._geometry.scale = 100;

/**
 * Get a polygonal approximation of a circle of a given radius
 * centered at the provided point. Vertices of polygon are in CW
 * order.
 * @private
 * @param {number} radius - The radius for the polygon.
 * @param {Point} [point] - The point at which to center the polygon.
 *   If a point is not provided then the polygon is centered at the
 *   origin.
 * @return {Poly} - The approximated circle.
 */
NavMesh._geometry.getApproximateCircle = function(radius, point) {
  var x, y;
  if (point) {
    x = point.x;
    y = point.y;
  } else {
    x = 0;
    y = 0;
  }
  var offset = radius * Math.tan(Math.PI / 8);
  offset = Math.round10(offset, -1);
  var poly = new Poly([
    new Point(x - radius, y - offset),
    new Point(x - radius, y + offset),
    new Point(x - offset, y + radius),
    new Point(x + offset, y + radius),
    new Point(x + radius, y + offset),
    new Point(x + radius, y - offset),
    new Point(x + offset, y - radius),
    new Point(x - offset, y - radius)
  ]);
  return poly;
};

/**
 * Returns a square with side length given by double the provided
 * radius, centered at the origin. Vertices of polygon are in CW
 * order.
 * @private
 * @param {number} radius - The length of half of one side.
 * @return {Poly} - The constructed square.
 */
NavMesh._geometry.getSquare = function(radius) {
  var poly = new Poly([
    new Point(-radius, radius),
    new Point(radius, radius),
    new Point(radius, -radius),
    new Point(-radius, -radius)
  ]);
  return poly;
};

/**
 * Get the upper or lower diagonal of a square of the given
 * radius. 
 * @private
 * @param {number} radius - The length of half of one side of the
 *   square to get the diagonal of.
 * @param {string} corner - One of ne, se, nw, sw indicating which
 *   corner should be filled.
 * @return {Poly} - The diagonal shape.
 */
NavMesh._geometry.getDiagonal = function(radius, corner) {
  var types = {
    "ne": [[radius, -radius], [radius, radius], [-radius, -radius]],
    "se": [[radius, radius], [-radius, radius], [radius, -radius]],
    "sw": [[-radius, radius], [-radius, -radius], [radius, radius]],
    "nw": [[-radius, -radius], [radius, -radius], [-radius, radius]]
  };
  var points = types[corner].map(function(mul) {
    return new Point(mul[0], mul[1]);
  });
  return new Poly(points);
};

/**
 * Given two sets of polygons, return indices of the ones in the blue
 * set that are intersected by ones in red.
 * @private
 * @param {Array.<Poly>} red
 * @param {Array.<Poly>} blue
 * @return {Array.<integer>} - The indices of the intersected blue
 *   polys.
 */
NavMesh._geometry.getIntersections = function(red, blue) {
  var indices = [];
  // Naive solution.
  blue.forEach(function(poly, i) {
    var intersects = red.some(function(polyb) {
      return poly.intersects(polyb);
    });
    if (intersects) {
      indices.push(i);
    }
  });
  return indices;
};

/**
 * An Area is an object that holds a polygon representing a space
 * along with its holes. An Area can represent, for example, a
 * traversable region, if we consider the non-hole area of the
 * polygon as being traversable, or the opposite, if we consider
 * the non-hole area as being solid, blocking movement.
 * @typedef Area
 * @type {object}
 * @property {Poly} polygon - The polygon defining the outside of the
 *   area.
 * @property {Array.<Poly>} holes - The holes in the polygon for this
 *   area.
 */
/**
 * Given a PolyTree, return an array of areas assuming even-odd fill
 * ordering.
 * @private
 * @param {ClipperLib.Paths} paths - The paths output from some
 *   operation. Paths should be non-overlapping, i.e. the edges of
 *   represented polygons should not be overlapping, but polygons
 *   may be fully contained in one another. Paths should already
 *   be scaled up.
 * @param {integer} [scale=100] - The scale to use when bringing the
 *   Clipper paths down to size.
 * @return {Array.<Area>} - The areas represented by the polytree.
 */
NavMesh._geometry.getAreas = function(paths, scale) {
  if (typeof scale == 'undefined') scale = NavMesh._geometry.scale;
  // We are really only concerned with getting the paths into a
  // polytree structure.
  var cpr = NavMesh._geometry.cpr;
  cpr.Clear();
  cpr.AddPaths(paths, ClipperLib.PolyType.ptSubject, true);
  var unioned_shapes_polytree = new ClipperLib.PolyTree();
  cpr.Execute(
    ClipperLib.ClipType.ctUnion,
    unioned_shapes_polytree,
    ClipperLib.PolyFillType.pftEvenOdd,
    null);

  var areas = [];

  var outer_polygons = unioned_shapes_polytree.Childs();

  // Organize shapes into their outer polygons and holes, assuming
  // that the first layer of polygons in the polytree represent the
  // outside edge of the desired areas.
  for (var i = 0; i < outer_polygons.length; i++) {
    var outer_polygon = outer_polygons[i];
    var contour = outer_polygon.Contour();
    ClipperLib.JS.ScaleDownPath(contour, scale);
    var area = {
      polygon: contour,
      holes: []
    };

    outer_polygon.Childs().forEach(function(child) {
      var contour = child.Contour();
      ClipperLib.JS.ScaleDownPath(child.Contour(), scale);
      // Add as a hole.
      area.holes.push(contour);

      // Add children as additional outer polygons to be expanded.
      child.Childs().forEach(function(child_outer) {
        outer_polygons.push(child_outer);
      });
    });
    areas.push(area);
  }
  
  // Convert Clipper Paths to Polys.
  areas.forEach(function(area) {
    area.polygon = NavMesh._geometry.convertClipperToPoly(area.polygon);
    area.holes = area.holes.map(NavMesh._geometry.convertClipperToPoly);
  });

  return areas;
};

/**
 * Offset a polygon inwards (as opposed to deflating it). The polygon
 * vertices should be in CCW order and the polygon should already be
 * scaled.
 * @private
 * @param {CLShape} shape - The shape to inflate inwards.
 * @param {number} offset - The amount to offset the shape.
 * @param {integer} [scale=100] - The scale for the operation.
 * @return {ClipperLib.Paths} - The resulting shape from offsetting.
 *   If the process of offsetting resulted in the interior shape
 *   closing completely, then an empty array will be returned. The
 *   returned shape will still be scaled up, for use in other
 *   operations.
 */
NavMesh._geometry.offsetInterior = function(shape, offset, scale) {
  if (typeof scale == 'undefined') scale = NavMesh._geometry.scale;

  var cpr = NavMesh._geometry.cpr;
  var co = NavMesh._geometry.co;

  // First, create a shape with the outline as the interior.
  var boundingShape = NavMesh._geometry.getBoundingShapeForPaths([shape]);

  cpr.Clear();
  cpr.AddPath(boundingShape, ClipperLib.PolyType.ptSubject, true);
  cpr.AddPath(shape, ClipperLib.PolyType.ptClip, true);

  var solution_paths = new ClipperLib.Paths();
  cpr.Execute(ClipperLib.ClipType.ctDifference,
    solution_paths,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero);

  // Once we have the shape as created above, inflate it. This gives
  // better results than treating the outline as the exterior of a
  // shape and deflating it.
  var offsetted_paths = new ClipperLib.Paths();

  co.Clear();
  co.AddPaths(solution_paths, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
  co.Execute(offsetted_paths, offset * scale);

  // If this is not true then the offsetting process shrank the
  // outline into non-existence and only the bounding shape is
  // left.
  // >= 2 in case the offsetting process isolates portions of the
  // outline (see: GamePad).
  if (offsetted_paths.length >= 2) {
    // Get only the paths defining the outlines we were interested
    // in, discarding the exterior bounding shape.
    offsetted_paths.shift();
  } else {
    offsetted_paths = new ClipperLib.Paths();
  }
  return offsetted_paths;
};

/**
 * Offset a polygon. The polygon vertices should be in CW order and
 * the polygon should already be scaled up.
 * @private
 * @param {CLShape} shape - The shape to inflate outwards.
 * @param {number} offset - The amount to offset the shape.
 * @param {integer} [scale=100] - The scale for the operation.
 * @return {ClipperLib.Paths} - The resulting shape from offsetting.
 *   If the process of offsetting resulted in the interior shape
 *   closing completely, then an empty array will be returned. The
 *   returned shape will still be scaled up, for use in other
 *   operations.
 */
NavMesh._geometry.offsetExterior = function(shape, offset, scale) {
  // TODO
};

/**
 * Generate a convex partition of the provided polygon, excluding
 * areas given by the holes.
 * @private
 * @param {Poly} outline - The polygon outline of the area to
 *   partition.
 * @param {Array.<Poly>} holes - Holes in the polygon.
 * @return {Array.<Poly>} - Polygons representing the partitioned
 *   space.
 */
NavMesh._geometry.convexPartition = function(outline, holes) {
  // Ensure proper vertex order for holes and outline.
  outline.setOrientation("CCW");
  holes.forEach(function(e) {
    e.setOrientation("CW");
    e.hole = true;
  });
  
  return partition(outline, holes);
};

/**
 * Partition the provided area.
 * @private
 * @param {Area} area - The Area to partition.
 * @return {Array.<Poly>} - Polygons representing the partitioned
 *   space.
 */
NavMesh._geometry.partitionArea = function(area) {
  return NavMesh._geometry.convexPartition(area.polygon, area.holes);
};

/**
 * Partition the provided areas.
 * @private
 * @param {Array.<Area>} areas - The areas to partition.
 * @return {Array.<Poly>} - Polygons representing the partitioned
 *   space.
 */
NavMesh._geometry.partitionAreas = function(areas) {
  var polys = areas.map(NavMesh._geometry.partitionArea);
  return NavMesh._util.flatten(polys);
};

/**
 * A point in ClipperLib is just an object with properties
 * X and Y corresponding to a point.
 * @typedef CLPoint
 * @type {object}
 * @property {integer} X - The x coordinate of the point.
 * @property {integer} Y - The y coordinate of the point.
 */
/**
 * A shape in ClipperLib is simply an array of CLPoints.
 * @typedef CLShape
 * @type {Array.<CLPoint>}
 */
/**
 * Takes a Poly and converts it into a ClipperLib polygon.
 * @private
 * @param {Poly} poly - The Poly to convert.
 * @return {CLShape} - The converted polygon.
 */
NavMesh._geometry.convertPolyToClipper = function(poly) {
  return poly.points.map(function(p) {
    return {X:p.x, Y:p.y};
  });
};

/**
 * Convert a ClipperLib shape into a Poly.
 * @private
 * @param {CLShape} clip - The shape to convert.
 * @return {Poly} - The converted shape.
 */
NavMesh._geometry.convertClipperToPoly = function(clip) {
  var points = clip.map(function(p) {
    return new Point(p.X, p.Y);
  });
  return new Poly(points);
};

/**
 * Generate a bounding shape for paths with a given buffer. If using
 * for an offsetting operation, the returned CLShape does NOT need to
 * be scaled up.
 * @private
 * @param {Array.<CLShape>} paths - The paths to get a bounding shape for.
 * @param {integer} [buffer=5] - How many units to pad the bounding
 *   rectangle.
 * @return {CLShape} - A bounding rectangle for the paths.
 */
NavMesh._geometry.getBoundingShapeForPaths = function(paths, buffer) {
  if (typeof buffer == "undefined") buffer = 5;
  var bounds = ClipperLib.Clipper.GetBounds(paths);
  bounds.left -= buffer;
  bounds.top -= buffer;
  bounds.right += buffer;
  bounds.bottom += buffer;
  var shape = [];
  shape.push({X: bounds.right, Y: bounds.bottom});
  shape.push({X: bounds.left, Y: bounds.bottom});
  shape.push({X: bounds.left, Y: bounds.top});
  shape.push({X: bounds.right, Y: bounds.top});
  return shape;
};

/**
 * Holds utility methods needed by the navmesh.
 * @private
 */
NavMesh._util = {};

/**
 * Removes and returns the items at the indices identified in
 * `indices`.
 * @private
 * @param {Array} ary - The array to remove items from.
 * @param {Array.<integer>} indices - The indices from which to
 *   remove the items from in ary. Indices should be unique and
 *   each should be less than the length of `ary` itself.
 * @return {Array} - The items removed from ary.
 */
NavMesh._util.splice = function(ary, indices) {
  indices = indices.sort(NavMesh._util._numberCompare).reverse();
  var removed = [];
  indices.forEach(function(i) {
    removed.push(ary.splice(i, 1)[0]);
  });
  return removed;
};

/**
 * Comparison function for numbers.
 * @private
 */
NavMesh._util._numberCompare = function(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
};

/**
 * Take an array of arrays and flatten it.
 * @private
 * @param  {Array.<Array.<*>>} ary - The array to flatten.
 * @return {Array.<*>} - The flattened array.
 */
NavMesh._util.flatten = function(ary) {
  return Array.prototype.concat.apply([], ary);
};

},{"./geometry":6,"./parse-map":8,"./partition":9,"./pathfinder":10,"jsclipper":1,"math-round":2}],8:[function(_dereq_,module,exports){
/**
 * @ignore
 * @module MapParser
 */

var ActionValues = _dereq_('./action-values');
var geo = _dereq_('./geometry');
var Point = geo.Point;
var Poly = geo.Poly;

/**
 * Contains utilities for generating usable map representations from
 * map tiles.
 */
var MapParser = {};

/**
 * An object with x and y properties that represents a coordinate pair.
 * @private
 * @typedef MPPoint
 * @type {object}
 * @property {number} x - The x coordinate of the location.
 * @property {number} y - The y coordinate of the location.
 */

/**
 * A Shape is an array of points, where points are objects with x and y properties which represent coordinates on the map.
 * @private
 * @typedef MPShape
 * @type {Array.<MPPoint>}
 */

/**
 * An object with r and c properties that represents a row/column
 * location in a 2d array.
 * @private
 * @typedef ArrayLoc
 * @type {object}
 * @property {integer} r - The row number of the array location.
 * @property {integer} c - The column number of the array location.
 */

/**
 * The 2d tile grid from `tagpro.map`, or a similar 2d grid resulting
 * from an operation on the original.
 * @typedef MapTiles
 * @type {Array.<Array.<number>>}
 */

/**
 * A Cell is just an array that holds the values of the four adjacent
 * cells in a 2d array, recorded in CCW order starting from the upper-
 * left quadrant. For example, given a 2d array:
 * [[1, 0, 1],
 *  [1, 0, 0],
 *  [1, 1, 1]]
 * we would generate the representation using the cells:
 * [1, 0,  [0, 1,  [1, 0,  [0, 0  
 *  1, 0]   0, 0]   1, 1]   1, 1].
 * These correspond to the parts of a tile that would be covered if
 * placed at the intersection of 4 tiles. The value 0 represents a
 * blank location, 1 indicates that the quadrant is covered.
 * To represent how such tiles would be covered in the case of diagonal
 * tiles, we use 2 to indicate that the lower diagonal of a quadrant is
 * filled, and 3 to indicate that the upper diagonal of a quadrant is
 * filled. The tiles available force the diagonals of each quadrant to
 * point to the center, so this is sufficient for describing all
 * possible overlappings.
 * @private
 * @typedef Cell
 * @type {Array.<number>}
 */

/**
 * Callback that receives each of the elements in the 2d map function.
 * @private
 * @callback mapCallback
 * @param {*} - The element from the 2d array.
 * @return {*} - The transformed element.
 */

/**
 * Applies `fn` to every individual element of the 2d array `arr`.
 * @private
 * @param {Array.<Array.<*>>} arr - The 2d array to use.
 * @param {mapCallback} fn - The function to apply to each element.
 * @return {Array.<Array.<*>>} - The 2d array after the function
 *   has been applied to each element.
 */
function map2d(arr, fn) {
  return arr.map(function(row) {
    return row.map(fn);
  });
}

/**
 * Returns 1 if a tile value is one that we want to consider as
 * a wall (we consider empty space to be a wall), or the tile value
 * itself for diagonal walls. 0 is returned otherwise.
 * @private
 * @param {number} elt - The tile value at a row/column location
 * @return {number} - The number to insert in place of the tile value.
 */
function isBadCell(elt) {
  var bad_cells = [1, 1.1, 1.2, 1.3, 1.4];
  if(bad_cells.indexOf(elt) !== -1) {
    // Ensure empty spaces get mapped to full tiles so outside of
    // map isn't traced.
    if (elt == 0) {
      return 1;
    } else {
      return elt;
    }
    return elt;
  } else {
    return 0;
  }
}

/**
 * Converts the provided array into its equivalent representation
 * using cells.
 * @private
 * @param {MapTiles} arr - 
 * @param {Array.<Array.<Cell>>} - The converted array.
 */
function generateContourGrid(arr) {
  // Generate grid for holding values.
  var contour_grid = new Array(arr.length - 1);
  for (var n = 0; n < contour_grid.length; n++) {
    contour_grid[n] = new Array(arr[0].length - 1);
  }
  var corners = [1.1, 1.2, 1.3, 1.4];
  // Specifies the resulting values for the above corner values. The index
  // of the objects in this array corresponds to the proper values for the
  // quadrant of the same index.
  var corner_values = [
    {1.1: 3, 1.2: 0, 1.3: 2, 1.4: 1},
    {1.1: 0, 1.2: 3, 1.3: 1, 1.4: 2},
    {1.1: 3, 1.2: 1, 1.3: 2, 1.4: 0},
    {1.1: 1, 1.2: 3, 1.3: 0, 1.4: 2}
  ];
  for (var i = 0; i < (arr.length - 1); i++) {
    for (var j = 0; j < (arr[0].length - 1); j++) {
      var cell = [arr[i][j], arr[i][j+1], arr[i+1][j+1], arr[i+1][j]];
      // Convert corner tiles to appropriate representation.
      cell.forEach(function(val, i, cell) {
        if (corners.indexOf(val) !== -1) {
          cell[i] = corner_values[i][val];
        }
      });

      contour_grid[i][j] = cell;
    }
  }
  return contour_grid;
}

/**
 * Callback function for testing equality of items.
 * @private
 * @callback comparisonCallback
 * @param {*} - The first item.
 * @param {*} - The second item.
 * @return {boolean} - Whether or not the items are equal.
 */

/**
 * Returns the location of obj in arr with equality determined by cmp.
 * @private
 * @param {Array.<*>} arr - The array to be searched.
 * @param {*} obj - The item to find a match for.
 * @param {comparisonCallback} cmp - The callback that defines
 *   whether `obj` matches.
 * @return {integer} - The index of the first element to match `obj`,
 *   or -1 if no such element was located.
 */
function find(arr, obj, cmp) {
  if (typeof cmp !== 'undefined') {
    for (var i = 0; i < arr.length; i++) {
      if (cmp(arr[i], obj)) {
        return i;
      }
    }
    return -1;
  }
}

/**
 * Compare two objects defining row/col locations in an array
 * and return true if they represent the same row/col location.
 * @private
 * @param {ArrayLoc} elt1
 * @param {ArrayLoc} elt2
 * @return {boolean} - Whether or not these two array locations
 *   represent the same row/column.
 */
function eltCompare(elt1, elt2) {
  return (elt1.c == elt2.c && elt1.r == elt2.r);
}

/**
 * Takes in the vertex/action information and returns an array of arrays,
 * where each array corresponds to a shape and each element of the array is
 * a vertex which is connected to it's previous and next neighbor (circular).
 * @private
 * @param {} actionInfo
 * @return {Array.<Array<ArrayLoc>>} - Array of vertex locations in 
 */
function generateShapes(actionInfo) {
  // Total number of cells.
  var total = actionInfo.length * actionInfo[0].length;
  var directions = {
    "n": [-1, 0],
    "e": [0, 1],
    "s": [1, 0],
    "w": [0, -1],
    "ne": [-1, 1],
    "se": [1, 1],
    "sw": [1, -1],
    "nw": [-1, -1]
  };
  // Takes the current location and direction at this point and
  // returns the next location to check. Returns null if this cell is
  // not part of a shape.
  function nextNeighbor(elt, dir) {
    var drow = 0, dcol = 0;
    if (dir == "none") {
      return null;
    } else {
      var offset = directions[dir];
      return {r: elt.r + offset[0], c: elt.c + offset[1]};
    }
  }

  // Get the next cell, from left to right, top to bottom. Returns null
  // if last element in array reached.
  function nextCell(elt) {
    if (elt.c + 1 < actionInfo[elt.r].length) {
      return {r: elt.r, c: elt.c + 1};
    } else if (elt.r + 1 < actionInfo.length) {
      return {r: elt.r + 1, c: 0};
    }
    return null;
  }

  // Get identifier for given node and direction
  function getIdentifier(node, dir) {
    return "r" + node.r + "c" + node.c + "d" + dir;
  }
  
  var discovered = [];
  var node = {r: 0, c: 0};
  var shapes = [];
  var current_shape = [];
  var shape_node_start = null;
  var last_action = null;
  // Object to track location + actions that have been taken.
  var taken_actions = {};
  var iterations = 0;

  // Iterate until all nodes have been visited.
  while (discovered.length !== total) {
    if (!node) {
      // Reached end.
      break;
    }
    if (iterations > total * 4) {
      // Sanity check on number of iterations. Maximum number of
      // times a single tile would be visited is 4 for a fan-like
      // pattern of triangle wall tiles.
      break;
    } else {
      iterations++;
    }
    // It's okay to be in a discovered node if shapes are adjacent,
    // we just want to keep track of the ones we've seen.
    if (find(discovered, node, eltCompare) == -1) {
      discovered.push(node);
    }

    var action = actionInfo[node.r][node.c];
    var dir;
    // If action has multiple possibilities.
    if (action instanceof Array) {
      // Part of a shape, find the info with that previous action as
      // in_dir.
      if (last_action !== "none") {
        var action_found = false;
        for (var i = 0; i < action.length; i++) {
          var this_action = action[i];
          if (this_action["loc"]["in_dir"] == last_action) {
            action = this_action;
            dir = this_action["loc"]["out_dir"];
            action_found = true;
            break;
          }
        }

        if (!action_found) {
          throw "Error!";
        }
      } else {
        // Find the first action that has not been taken previously.
        var action_found = false;
        for (var i = 0; i < action.length; i++) {
          var this_action = action[i];
          if (!taken_actions[getIdentifier(node, this_action["loc"]["out_dir"])]) {
            action = this_action
            dir = this_action["loc"]["out_dir"];
            action_found = true;
            break;
          }
        }
        if (!action_found) {
          throw "Error!";
        }
      }
    } else { // Action only has single possibility.
      dir = action.loc;
    }

    // Set node/action as having been visited.
    taken_actions[getIdentifier(node, dir)] = true;

    last_action = dir;
    var next = nextNeighbor(node, dir);
    if (next) { // Part of a shape.
      // Save location for restarting after this shape has been defined.
      var first = false;
      if (current_shape.length == 0) {
        first = true;
        shape_node_start = node;
        shape_node_start_action = last_action;
      }
      
      // Current node and direction is same as at start of shape,
      // shape has been explored.
      if (!first && eltCompare(node, shape_node_start) && last_action == shape_node_start_action) {
        shapes.push(current_shape);
        current_shape = [];
        // Get the next undiscovered node.
        node = nextCell(shape_node_start);
        while (node && (find(discovered, node, eltCompare) !== -1)) {
          node = nextCell(node);
        }
        shape_node_start = null;
      } else {
        if (action.v || first) {
          current_shape.push(node);
        }
        node = next;
      }
    } else { // Not part of a shape.
      node = nextCell(node);
      // Get the next undiscovered node.
      while (node && (find(discovered, node, eltCompare) !== -1)) {
        node = nextCell(node);
      }
    }
  } // end while

  if (discovered.length == total) {
    return shapes;
  } else {
    return null;
  }
}

// Return whether there should be a vertex at the given location and
// which location to go next, if any.
// Value returned is an object with properties 'v' and 'loc'. 'v' is a boolean
// indicating whether there is a vertex, and 'loc' gives the next location to move, if any.
// loc is a string, of none, down, left, right, up, down corresponding to
// tracing out a shape clockwise (or the interior of a shape CCW), or a function
// that takes a string corresponding to the direction taken to get to the current
// cell.
// There will never be a vertex without a next direction.
function getAction(cell) {
  var str = cell[0] + "-" + cell[1] + "-" + cell[2] + "-" + cell[3];
  return ActionValues[str];
}

/**
 * Convert an array location to a point representing the top-left
 * corner of the tile in global coordinates.
 * @private
 * @param {ArrayLoc} location - The array location to get the
 *   coordinates for.
 * @return {MPPoint} - The coordinates of the tile.
 */
function getCoordinates(location) {
  var tile_width = 40;
  var x = location.r * tile_width;
  var y = location.c * tile_width;
  return {x: x, y: y};
}

/**
 * Takes in an array of shapes and converts from contour grid layout
 * to actual coordinates.
 * @private
 * @param {Array.<Array.<ArrayLoc>>} shapes - output from generateShapes
 * @return {Array.<Array.<{{x: number, y: number}}>>}
 */
function convertShapesToCoords(shapes) {
  var tile_width = 40;

  var new_shapes = map2d(shapes, function(loc) {
    // It would be loc.r + 1 and loc.c + 1 but that has been removed
    // to account for the one-tile width of padding added in doParse.
    var row = loc.r * tile_width;
    var col = loc.c * tile_width;
    return {x: row, y: col}
  });
  return new_shapes;
}

// Given an x and y value, return a polygon (octagon) that approximates
// a spike at the tile given by that x, y location. Points in CW order.
function getSpikeShape(coord) {
  var x = coord.x + 20, y = coord.y + 20;
  var spike_radius = 14;
  // almost = spike_radius * tan(pi/8) for the vertices of a regular octagon.
  var point_offset = 5.8;
  return [
    {x: x - spike_radius, y: y - point_offset},
    {x: x - spike_radius, y: y + point_offset},
    {x: x - point_offset, y: y + spike_radius},
    {x: x + point_offset, y: y + spike_radius},
    {x: x + spike_radius, y: y + point_offset},
    {x: x + spike_radius, y: y - point_offset},
    {x: x + point_offset, y: y - spike_radius},
    {x: x - point_offset, y: y - spike_radius}
  ];
}

/**
 * Returns an array of the array locations of the spikes contained
 * in the map tiles, replacing those array locations in the original
 * map tiles with 2, which corresponds to a floor tile.
 * @private
 * @param {MapTiles} tiles - The map tiles.
 * @return {Array.<ArrayLoc>} - The array of locations that held
 *   spike tiles.
 */
MapParser.extractSpikes = function(tiles) {
  var spike_locations = [];
  tiles.forEach(function(row, row_n) {
    row.forEach(function(cell_value, index, row) {
      if (cell_value == 7) {
        spike_locations.push({r: row_n, c: index});
        row[index] = 2;
      }
    });
  });
  return spike_locations;
};

var Obstacle = function(type, ids) {
  this.type = type;
  this.vals = [];
  this.info = {};
  ids.forEach(function(id) {
    if (typeof id == "number") {
      this.vals.push(id);
      this.info[id] = this.type;
    } else {
      this.vals.push(id.num);
      this.info[id] = id.name;
    }
  }, this);
};

Obstacle.prototype.describes = function(val) {
  if(this.vals.indexOf(Math.floor(+val)) !== -1) {
    return (this.info[+val] || this.info[Math.floor(+val)]);
  } else {
    return false;
  }
};

var Obstacles = [
  new Obstacle("bomb", [10, 10.1]),
  new Obstacle("boost",
    [5, 5.1, {num: 14, name: "redboost"}, {num: 15, name: "blueboost"}]),
  new Obstacle("gate",
    [9, {num: 9.1, name: "greengate"}, {num: 9.2, name: "redgate"},
    {num: 9.3, name: "bluegate"}])
];

MapParser.extractDynamicObstacles = function(tiles) {
  var dynamic_obstacles = [];
  tiles.forEach(function(row, x) {
    row.forEach(function(tile, y) {
      Obstacles.some(function(obstacle_type) {
        var dynamic_obstacle = obstacle_type.describes(tile)
        if (dynamic_obstacle) {
          dynamic_obstacles.push({
            type: dynamic_obstacle,
            x: x,
            y: y,
            v: tile
          });
          tiles[x][y] = 0;
          return true;
        } else {
          return false;
        }
      });
    });
  });
  return dynamic_obstacles;
};

/**
 * The returned value from the map parsing function.
 * @typedef ParsedMap
 * @type {object}
 * @property {Array.<MPShape>} walls - The parsed walls.
 * @property {Array.<MPShape>} obstacles - The parsed obstacles.
 */

/**
 * Converts the 2d array defining a TagPro map into shapes.
 * @param {MapTiles} tiles - The tiles as retrieved from `tagpro.map`.
 * @return {?ParsedMap} - The result of converting the map into
 *   polygons, or null if there was an issue parsing the map.
 */
MapParser.parse = function(tiles) {
  // Make copy of tiles to preserve original array
  tiles = JSON.parse(JSON.stringify(tiles));

  // Returns a list of the spike locations and removes them from
  // the tiles.
  var spike_locations = MapParser.extractSpikes(tiles);

  var dynamic_obstacles = MapParser.extractDynamicObstacles(tiles);

  // Pad tiles with a ring of wall tiles, to ensure the map is
  // closed.
  var empty_row = [];
  for (var i = 0; i < tiles[0].length + 2; i++) {
    empty_row.push(1);
  }
  tiles.forEach(function(row) {
    row.unshift(1);
    row.push(1);
  });
  tiles.unshift(empty_row);
  tiles.push(empty_row.slice());

  // Actually doing the conversion.
  // Get rid of tile values except those for the walls.
  var threshold_tiles = map2d(tiles, isBadCell);

  // Generate contour grid, essentially a grid whose cells are at the
  // intersection of every set of 4 cells in the original map.
  var contour_grid_2 = generateContourGrid(threshold_tiles);

  // Get tile vertex and actions for each cell in contour grid.
  var tile_actions = map2d(contour_grid_2, getAction);

  var generated_shapes = generateShapes(tile_actions);
  if (!generated_shapes) {
    return null;
  }

  var actual_shapes = generated_shapes.filter(function(elt) {
    return elt.length > 0;
  });

  var converted_shapes = convertShapesToCoords(actual_shapes);

  // Get spike-approximating shapes and add to list.
  var static_obstacles = spike_locations.map(function(spike) {
    return getSpikeShape(getCoordinates(spike));
  });

  return {
    walls: this.convertShapesToPolys(converted_shapes),
    static_obstacles: this.convertShapesToPolys(static_obstacles),
    dynamic_obstacles: dynamic_obstacles
  };
};

/**
 * Convert shapes into polys.
 * @private
 * @param {Array.<Shape>} shapes - The shapes to be converted.
 * @return {Array.<Poly>} - The converted shapes.
 */
MapParser.convertShapesToPolys = function(shapes) {
  var polys = shapes.map(function(shape) {
    return MapParser.convertShapeToPoly(shape);
  });
  return polys;
};


/**
 * Convert a shape into a Poly.
 * @param {MPShape} shape - The shape to convert.
 * @return {Poly} - The converted shape.
 */
MapParser.convertShapeToPoly = function(shape) {
  var poly = new Poly();
  poly.init(shape.length);
  for (var i = 0; i < shape.length; i++) {
    var point = new Point(shape[i].x, shape[i].y);
    poly.setPoint(i, point);
  }
  return poly;
};

module.exports = MapParser;

},{"./action-values":5,"./geometry":6}],9:[function(_dereq_,module,exports){
/**
 * Holds classes for points, polygons, and utilities for operating on
 * them.
 * Adapted/copied from https://code.google.com/p/polypartition/
 * @module PolyPartition
 */
var poly2tri = _dereq_('poly2tri');
var geo = _dereq_('./geometry');

var Point = geo.Point;
var Edge = geo.Edge;
var Poly = geo.Poly;

/**
 * The Point class used by poly2tri.
 * @private
 * @typedef P2TPoint
 */

/**
 * A polygon for use with poly2tri.
 * @private
 * @typedef P2TPoly
 * @type {Array.<P2TPoint>}
 */

/**
 * Convert a polygon into format required by poly2tri.
 * @private
 * @param {Poly} poly - The polygon to convert.
 * @return {P2TPoly} - The converted polygon.
 */
function convertPolyToP2TPoly(poly) {
  return poly.points.map(function(p) {
    return new poly2tri.Point(p.x, p.y);
  });
}

/**
 * Convert a polygon/triangle returned from poly2tri back into a
 * polygon.
 * @private
 * @param {P2TPoly} p2tpoly - The polygon to convert.
 * @return {Poly} - The converted polygon.
 */
function convertP2TPolyToPoly(p2tpoly) {
  var points = p2tpoly.getPoints().map(function(p) {
    return new Point(p.x, p.y);
  });

  return new Poly(points);
}

function isConvex(p1, p2, p3) {
  var tmp = (p3.y - p1.y) * (p2.x - p1.x) - (p3.x - p1.x) * (p2.y - p1.y);
  return (tmp > 0);
}

/**
 * Takes an array of polygons that overlap themselves and others
 * at discrete corner points and separate those overlapping corners
 * slightly so the polygons are suitable for triangulation by
 * poly2tri.js. This changes the Poly objects in the array.
 * @private
 * @param {Array.<Poly>} polys - The polygons to separate.
 * @param {number} [offset=1] - The number of units the vertices
 *   should be moved away from each other.
 */
function separatePolys(polys, offset) {
  offset = offset || 1;
  var discovered = {};
  var dupes = {};
  // Offset to use in calculation.
  // Find duplicates.
  for (var s1 = 0; s1 < polys.length; s1++) {
    var poly = polys[s1];
    for (var i = 0; i < poly.numpoints; i++) {
      var point = poly.points[i].toString();
      if (!discovered.hasOwnProperty(point)) {
        discovered[point] = true;
      } else {
        dupes[point] = true;
      }
    }
  }

  // Get duplicate points.
  var dupe_points = [];
  var dupe;
  for (var s1 = 0; s1 < polys.length; s1++) {
    var poly = polys[s1];
    for (var i = 0; i < poly.numpoints; i++) {
      var point = poly.points[i];
      if (dupes.hasOwnProperty(point.toString())) {
        dupe = [point, i, poly];
        dupe_points.push(dupe);
      }
    }
  }

  // Sort elements in descending order based on their indices to
  // prevent future indices from becoming invalid when changes are made.
  dupe_points.sort(function(a, b) {
    return b[1] - a[1]
  });
  // Edit duplicates.
  var prev, next, point, index, p1, p2;
  dupe_points.forEach(function(e, i, ary) {
    point = e[0], index = e[1], poly = e[2];
    prev = poly.points[poly.getPrevI(index)];
    next = poly.points[poly.getNextI(index)];
    p1 = point.add(prev.sub(point).normalize().mul(offset));
    p2 = point.add(next.sub(point).normalize().mul(offset));
    // Insert new points.
    poly.points.splice(index, 1, p1, p2);
    poly.update();
  });
}

/**
 * Partition a polygon with (optional) holes into a set of convex
 * polygons. The vertices of the polygon must be given in CW order,
 * and the vertices of the holes must be in CCW order. Uses poly2tri
 * for the initial triangulation and Hertel-Mehlhorn to combine them
 * into convex polygons.
 * @param {Poly} poly - The polygon to use as the outline.
 * @param {Array.<Poly>} [holes] - An array of holes present in the
 *   polygon.
 * @param {number} [minArea=5] - An optional parameter that filters
 *   out polygons in the partition smaller than this value.
 * @return {Array.<Poly>} - The set of polygons defining the
 *   partition of the provided polygon.
 */
module.exports = function(poly, holes, minArea) {
  if (typeof holes == 'undefined') holes = false;
  if (typeof minArea == 'undefined') minArea = 5;

  var i11, i12, i13, i21, i22, i23;
  var parts = new Array();

  // Check if poly is already convex only if there are no holes.
  if (!holes || holes.length == 0) {
    var reflex = false;
    // Check if already convex.
    for (var i = 0; i < poly.numpoints; i++) {
      var prev = poly.getPrevI(i);
      var next = poly.getNextI(i);
      if (!isConvex(poly.getPoint(prev), poly.getPoint(i), poly.getPoint(next))) {
        reflex = true;
        break;
      }
    }
    if (!reflex) {
      parts.push(poly);
      return parts;
    }
  }

  // Separate polys to remove collinear points.
  separatePolys(holes.concat(poly));

  // Convert polygon into format required by poly2tri.
  var contour = convertPolyToP2TPoly(poly);

  if (holes) {
    // Convert holes into format required by poly2tri.
    holes = holes.map(convertPolyToP2TPoly);
  }

  var swctx = new poly2tri.SweepContext(contour);
  if (holes) {
    swctx.addHoles(holes);
  }
  var triangles = swctx.triangulate().getTriangles();
  
  // Convert poly2tri triangles back into polygons and filter out the
  // ones too small to be relevant.
  triangles = triangles.map(convertP2TPolyToPoly).filter(function(poly) {
    return poly.getArea() >= minArea;
  });

  for (var s1 = 0; s1 < triangles.length; s1++) {
    var poly1 = triangles[s1];
    var s2_index = null;
    for (i11 = 0; i11 < poly1.numpoints; i11++) {
      var d1 = poly1.getPoint(i11);
      i12 = poly1.getNextI(i11);
      var d2 = poly1.getPoint(i12);

      var isdiagonal = false;
      for (var s2 = s1; s2 < triangles.length; s2++) {
        if (s1 == s2) continue;
        var poly2 = triangles[s2];
        for (i21 = 0; i21 < poly2.numpoints; i21++) {
          if (d2.neq(poly2.getPoint(i21))) continue;
          i22 = poly2.getNextI(i21);
          if (d1.neq(poly2.getPoint(i22))) continue;
          isdiagonal = true;
          object_2_index = s2;
          break;
        }
        if (isdiagonal) break;
      }

      if (!isdiagonal) continue;
      var p1, p2, p3;
      p2 = poly1.getPoint(i11);
      i13 = poly1.getPrevI(i11);
      p1 = poly1.getPoint(i13);
      i23 = poly2.getNextI(i22);
      p3 = poly2.getPoint(i23);

      if (!isConvex(p1, p2, p3)) continue;

      p2 = poly1.getPoint(i12);
      i13 = poly1.getNextI(i12);
      p3 = poly1.getPoint(i13);
      i23 = poly2.getPrevI(i21);
      p1 = poly2.getPoint(i23);

      if (!isConvex(p1, p2, p3)) continue;

      var newpoly = new Poly();
      newpoly.init(poly1.numpoints + poly2.numpoints - 2);
      var k = 0;
      for (var j = i12; j != i11; j = poly1.getNextI(j)) {
        newpoly.setPoint(k, poly1.getPoint(j));
        k++;
      }
      for (var j = i22; j != i21; j = poly2.getNextI(j)) {
        newpoly.setPoint(k, poly2.getPoint(j));
        k++;
      }

      if (s1 > object_2_index) {
        triangles[s1] = newpoly;
        poly1 = triangles[s1];
        triangles.splice(object_2_index, 1);
      } else {
        triangles.splice(object_2_index, 1);
        triangles[s1] = newpoly;
        poly1 = triangles[s1];
      }
      i11 = -1;
    }
  }
  return triangles;
};

},{"./geometry":6,"poly2tri":3}],10:[function(_dereq_,module,exports){
var geo = _dereq_('./geometry');
var findPolyForPoint = geo.util.findPolyForPoint;
var PriorityQueue = _dereq_('priority-queue');

/**
 * Pathfinder implements pathfinding on a navigation mesh.
 * @constructor
 * @param {Array.<Poly>} polys - The polygons defining the navigation mesh.
 * @param {boolean} [init=true] - Whether or not to initialize the pathfinder.
 */
var Pathfinder = function(polys, init) {
  if (typeof init == "undefined") init = true;
  this.polys = polys;
  if (init) {
    this.init();
  }
};
module.exports = Pathfinder;

Pathfinder.prototype.init = function() {
  this.grid = this.generateAdjacencyGrid(this.polys);
};

/**
 * Computes path from source to target, using sides and centers of the edges
 * between adjacent polygons. source and target are Points and polys should
 * be the final partitioned map.
 * @param {Point} source - The start location for the search.
 * @param {Point} target - The target location for the search.
 * @return {?Array.<Point>} - A series of points representing the path from
 *   the source to the target. If a path is not found, `null` is returned.
 */
Pathfinder.prototype.aStar = function(source, target) {
  // Compares the value of two nodes.
  function nodeValue(node1, node2) {
    return (node1.dist + heuristic(node1.point)) - (node2.dist + heuristic(node2.point));
  }

  // Distance between polygons.
  function euclideanDistance(p1, p2) {
    return p1.dist(p2);
  }

  // Distance between polygons. todo: update
  function manhattanDistance(elt1, elt2) {
    return (elt1.r - elt2.r) + (elt1.c - elt2.c);
  }

  // Takes Point and returns value.
  function heuristic(p) {
    return euclideanDistance(p, target);
  }

  var sourcePoly = findPolyForPoint(source, this.polys);

  // We're outside of the mesh somehow. Try a few nearby points.
  if (!sourcePoly) {
    var offsetSource = [new Point(5, 0), new Point(-5, 0), new Point(0, -5), new Point(0, 5)];
    for (var i = 0; i < offsetSource.length; i++) {
      // Make new point.
      var point = source.add(offsetSource[i]);
      sourcePoly = findPolyForPoint(point, this.polys);
      if (sourcePoly) {
        source = point;
        break;
      }
    }
    if (!sourcePoly) {
      return null;
    }
  }
  var targetPoly = findPolyForPoint(target, this.polys);

  // Handle trivial case.
  if (sourcePoly == targetPoly) {
    return [source, target];
  }

  // Warning, may have compatibility issues.
  var discoveredPolys = new WeakSet();
  var discoveredPoints = new WeakSet();
  var pq = new PriorityQueue({ comparator: nodeValue });
  var found = null;
  // Initialize with start location.
  pq.queue({dist: 0, poly: sourcePoly, point: source, parent: null});
  while (pq.length > 0) {
    var node = pq.dequeue();
    if (node.poly == targetPoly) {
      found = node;
      break;
    } else {
      discoveredPolys.add(node.poly);
      discoveredPoints.add(node.point);
    }
    // This may be undefined if there was no polygon found.
    var neighbors = this.grid.get(node.poly);
    for (var i = 0; i < neighbors.length; i++) {
      var elt = neighbors[i];
      var neighborFound = discoveredPolys.has(elt.poly);

      for (var j = 0; j < elt.edge.points.length; j++) {
        var p = elt.edge.points[j];
        if (!neighborFound || !discoveredPoints.has(p))
          pq.queue({dist: node.dist + euclideanDistance(p, node.point), poly: elt.poly, point: p, parent: node});
      }
    }
  }

  if (found) {
    var path = [];
    var current = found;
    while (current.parent) {
      path.unshift(current.point);
      current = current.parent;
    }
    path.unshift(current.point);
    // Add end point to path.
    path.push(target);
    return path;
  } else {
    return null;
  }
};

/**
 * Holds the "neighbor" relationship of Poly objects in the partition
 * using the Poly's themselves as keys, and an array of Poly's as
 * values, where the Polys in the array are neighbors of the Poly
 * that was the key.
 * @typedef AdjacencyGrid
 * @type {Object.<Poly, Array<Poly>>}
 */

/**
 * Given an array of Poly objects, find all neighboring polygons for
 * each polygon.
 * @private
 * @param {Array.<Poly>} polys - The array of polys to find neighbors
 *   among.
 * @return {AdjacencyGrid} - The "neighbor" relationships.
 */
Pathfinder.prototype.generateAdjacencyGrid = function(polys) {
  var neighbors = new WeakMap();
  polys.forEach(function(poly, polyI, polys) {
    if (neighbors.has(poly)) {
      // Maximum number of neighbors already found.
      if (neighbors.get(poly).length == poly.numpoints) {
        return;
      }
    } else {
      // Initialize array.
      neighbors.set(poly, new Array());
    }
    // Of remaining polygons, find some that are adjacent.
    poly.points.forEach(function(p1, i, points) {
      // Next point.
      var p2 = points[poly.getNextI(i)];
      for (var polyJ = polyI + 1; polyJ < polys.length; polyJ++) {
        var poly2 = polys[polyJ];
        // Iterate over points until match is found.
        poly2.points.some(function(q1, j, points2) {
          var q2 = points2[poly2.getNextI(j)];
          var match = p1.eq(q2) && p2.eq(q1);
          if (match) {
            var edge = new Edge(p1, p2);
            neighbors.get(poly).push({ poly: poly2, edge: edge });
            if (!neighbors.has(poly2)) {
              neighbors.set(poly2, new Array());
            }
            neighbors.get(poly2).push({ poly: poly, edge: edge });
          }
          return match;
        });
        if (neighbors.get(poly).length == poly.numpoints) break;
      }
    });
  });
  return neighbors;
};

},{"./geometry":6,"priority-queue":4}]},{},[7])(7)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
var NavMesh = require('tagpro-navmesh');

var Brain = require('./brain');
var DrawUtils = require('./drawutils');
var geo = require('./geometry');

/**
 * A Bot is responsible for decision making, navigation (with the aid
 * of map-related modules) and low-level steering/locomotion.
 * @exports Bot
 */
// Alias useful classes.
var Point = geo.Point;
var Poly = geo.Poly;
var PolyUtils = geo.util;

var Stance = {
  offense: 0,
  defense: 1
};

/**
 * @constructor
 * @name Bot
 * @param {} state
 * @param {} mover
 * @param {Logger} [logger]
 */
var Bot = function(state, mover, logger) {
  if (typeof logger == 'undefined') {
    logger = {};
    logger.log = function() {};
  }
  this.logger = logger;

  // Holds interval ids.
  this.actions = {};

  // Hold environment-specific movement and game state objects.
  this.move = mover.move.bind(mover);
  this.game = state;

  this.stance = Stance.offense;

  this.initialized = false;
  this.mapInitialized = false;
  this.init();

  this.brain = new Brain(this);

  setTimeout(this._processMap.bind(this), 50);
};

module.exports = Bot;

// Initialize functionality dependent on tagpro provisioning playerId.
Bot.prototype.init = function() {
  this.logger.log("bot", "Initializing Bot.");
  // Ensure that the tagpro global object has initialized and allocated us an id.
  if (!this.game.initialized()) {return setTimeout(this.init.bind(this), 250);}

  // Self is the TagPro player object.
  this.self = this.game.player();

  // Sensed keeps track of sensed states.
  this.sensed = {
    dead: false
  };

  this.logger.log("bot", "Bot loaded."); // DEBUG
  
  this._initializeParameters();

  // Set up drawing.
  this.draw = new DrawUtils();

  // Register items to draw.
  this.draw.addVector("seek", 0x00ff00);
  this.draw.addVector("avoid", 0xff0000);
  this.draw.addVector("desired", 0x0000ff);
  this.draw.addBackground("mesh", 0x555555);
  this.draw.addPoint("goal", 0x00ff00, "foreground");
  this.draw.addPoint("hit", 0xff0000, "foreground");

  this.initialized = true;
}

/**
 * Update function that drives the rest of the ongoing bot behavior.
 */
Bot.prototype.update = function() {
  this.brain.process();
  this._move();
  // Sense any real-time, big-implication environment actions and
  // send to brain.
  this._sense();
};

Bot.prototype.attack = function() {
  this.stance = Stance.offense;
};

Bot.prototype.defend = function() {
  this.stance = Stance.defense;
};

Bot.prototype.isOffense = function() {
  return this.stance == Stance.offense;
};

Bot.prototype.isDefense = function() {
  return this.stance == Stance.defense;
};

/**
 * Sense environment changes and send messages to brain if needed.
 */
Bot.prototype._sense = function() {
  // Newly dead.
  if (this.self.dead && !this.sensed.dead) {
    this.sensed.dead = true;
    this.brain.handleMessage("dead");
  }
  // Newly living.
  if (this.sensed.dead && !this.self.dead) {
    this.sensed.dead = false;
    this.brain.handleMessage("alive");
  }
  if (this.last_stance && this.last_stance !== this.stance) {
    this.brain.handleMessage("stanceChange");
  }
  this.last_stance = this.stance;
  if (this.navUpdate) {
    this.brain.handleMessage("navUpdate");
    this.navUpdate = false;
  }
};

// Do movements.
Bot.prototype._move = function() {
  if (this.goal) {
    this.navigate();
  } else {
    this.allUp();
  }
};

/**
 * Sets the given point as the target for the bot to navigate to.
 * @param {Point} point - The point to navigate to.
 */
Bot.prototype.setTarget = function(point) {
  this.goal = point;
};

/**
 * Initialize the parameters for the various variable functions of
 * the bot.
 * @private
 */
Bot.prototype._initializeParameters = function() {
  this.parameters = {};
  
  // Holds information about the game physics parameters.
  this.parameters.game = {
    step: 1e3 / 60, // Physics step size in ms.
    radius: {
      spike: 14,
      ball: 19
    }
  };

  // Holds interval update timers.
  this.parameters.intervals = {
    game: 1000,
    navigate: 10,
    goal: 10
  };

  // Hold steering parameters.
  this.parameters.steering = {};
  this.parameters.steering["seek"] = {
    max_see_ahead: this.parameters.intervals.navigate
  };

  this.parameters.steering["avoid"] = {
    max_see_ahead: 2e3, // Time in ms to look ahead for a collision.
    max_avoid_force: 35,
    buffer: 25,
    spike_intersection_radius: this.parameters.game.radius.spike + this.parameters.game.radius.ball
  };

  this.parameters.steering["update"] = {
    action_threshold: 0.01,
    top_speed_threshold: 0.1,
    current_vector: 0
  };
}

/**
 * Process map and generate navigation mesh.
 * @private
 */
Bot.prototype._processMap = function() {
  var map = this.game.map();
  if (!map) {
    setTimeout(this.processMap.bind(this), 250);
  } else {
    this.navmesh = new NavMesh(map, this.logger);

    // Whether the navigation mesh has been updated.
    this.navUpdate = false;

    // Update navigation mesh visualization and set flag for
    // sense function to pass message to brain.
    this.navmesh.onUpdate(function(polys) {
      this.draw.updateBackground("mesh", polys);
      this.logger.log("bot", "Navmesh updated.");
      this.navUpdate = true;
    }.bind(this));

    // Add tile id of opposite team tile to navmesh impassable
    if (this.game.team() == this.game.Teams.red) {
      // Blue gate and red speedpad.
      this.navmesh.setImpassable([9.3, 14]);
    } else {
      // Red gate and blue speedpad.
      this.navmesh.setImpassable([9.2, 15]);
    }

    // Set mapUpdate function of navmesh as the callback to the tagpro
    // mapupdate packets.
    this.navmesh.listen(this.game.tagpro.socket);

    this.draw.updateBackground("mesh", this.navmesh.polys);
    this.logger.log("bot", "Navmesh constructed.");

    this.mapInitialized = true;
  }
}

// Stops the bot. Sets the stop action which all methods need to check for, and also
// ensures the bot stays still (ish).
Bot.prototype.stop = function() {
  this.logger.log("bot", "Stopping bot.");
  this.stopped = true;
  this.goal = false;
  this._clearInterval("think");
  this._clearInterval("update");

  // Stop thinking.
  this.brain.terminate();

  // Stop moving.
  this.allUp();
  this._removeDraw();
}

// Restarts the bot.
Bot.prototype.start = function() {
  // Don't execute if bot or map isn't initialized.
  if (!this.initialized || !this.mapInitialized) {
    this.logger.log("bot:info", "Bot not initialized. Cancelling start.");
    return;
  } else {
    this.logger.log("bot:info", "Starting bot.");
  }

  this.stopped = false;
  this.brain.think();
  this._setInterval("think", this.brain.think.bind(this.brain), 500);
  this._setInterval("update", this.update, 20);
  this.draw.showVector("seek");
  this.draw.showVector("avoid");
}

/**
 * Navigates a path, assuming the end target is static.
 */
Bot.prototype.navigate = function() {
  // Don't execute function if bot is stopped.
  if (this.stopped) return;

  var desired_vector = this._steering(32);
  this.draw.updateVector("desired", desired_vector.mul(10));
  // Apply desired vector after a short delay.
  setTimeout(function() {
    if (!this.stopped) {
      this._update(desired_vector.mul(2));
    }
  }.bind(this), 0);
}

/**
 * @param {number} n - The number of vectors to consider.
 */
Bot.prototype._steering = function(n) {
  if (typeof n == 'undefined') n = 8;
  // Generate vectors.
  var angle = 2 * Math.PI / n;
  var vectors = [];
  for (var i = 0; i < n; i++) {
    vectors.push(new Point(Math.cos(angle * i), Math.sin(angle * i)));
  }

  // Calculate costs.
  var costs = [];
  costs.push(this._inv_Avoid(vectors));
  costs.push(this._inv_Seek(vectors));

  // Do selection.
  var heuristic = function(costs) {
    var w = 1;
    var summedCosts = [];
    for (var i = 0; i < costs[0].length; i++) {
      summedCosts[i] = 0;
    }
    summedCosts = costs.reduce(function(summed, cost) {
      return summed.map(function(sum, i) {
        return sum + cost[i];
      });
    }, summedCosts);
    var min = summedCosts[0];
    var idx = 0;
    for (var i = 1; i < summedCosts.length; i++) {
      if (summedCosts[i] < min) {
        min = summedCosts[i];
        idx = i;
      }
    }
    return idx;
  }

  var idx = heuristic(costs);
  return vectors[idx];
}

// Takes in vectors, associates cost with each.
// Returns vector of costs.
Bot.prototype._inv_Avoid = function(vectors) {
  var costs = vectors.map(function() {
    return 0;
  });

  var BALL_DIAMETER = 38;
  // For determining intersection and cost of distance.
  var SPIKE_INTERSECTION_RADIUS = 55;
  // For determining how many ms to look ahead for the location to use
  // as the basis for seeing the impact a direction will have.
  var LOOK_AHEAD = 40;

  // For determining how much difference heading towards a single direction
  // will make.
  var DIR_LOOK_AHEAD = 40;

  // Ray with current position as basis.
  var position = this.game.location();
  // look ahead 20ms
  var ahead = this.game.pLocation(LOOK_AHEAD);
  var ahead_distance = ahead.sub(position).len();

  var relative_location = ahead.sub(position);

  var spikes = this.game.getspikes();

  vectors.forEach(function(vector, i) {
    vector = relative_location.add(vector.mul(DIR_LOOK_AHEAD));
    var veclen = vector.len();
    // Put vector relative to predicted position.
    vector = vector.normalize();
    for (var j = 0; j < spikes.length; j++) {
      var spike = spikes[j];
      // Skip spikes that are too far away to matter.
      if (spike.dist(position) - SPIKE_INTERSECTION_RADIUS > veclen) continue;
      collision = PolyUtils.lineCircleIntersection(
        position,
        vector,
        spike,
        SPIKE_INTERSECTION_RADIUS
      );
      if (collision.collides) {
        if (collision.inside) {
          costs[i] += 100;
        } else {
          // Calculate cost.
          costs[i] += SPIKE_INTERSECTION_RADIUS / position.dist(collision.point);
          /*var tmpDist2 = position.dist2(collision.point);
          if (tmpDist2 < minDist2) {
            minCollision = collision;
            minDist2 = tmpDist2;
          }*/
        }
      }
    }
  });
  return costs;
}

Bot.prototype._inv_Seek = function(vectors) {
  var costs = vectors.map(function() {
    return 0;
  });
  var params = this.parameters.steering["seek"];
  var p = this.game.location();
  if (this.goal) {
    var goal = this.goal.sub(p).normalize();
  } else {
    var goal = false;
  }
  vectors.forEach(function(vector, i) {
    if (goal) {
      var val = vector.dot(goal);
      if (val < 0) {
        costs[i] = 20;
      } else {
        costs[i] = 1 / val;
      }
    }
  });
  return costs;
}

/**
 * Clear the interval identified by `name`.
 * @private
 * @param {string} name - The interval to clear.
 */
Bot.prototype._clearInterval = function(name) {
  if (this._isInterval(name)) {
    clearInterval(this.actions[name]);
    delete this.actions[name];
  }
}

/**
 * Set the given function as an function executed on an interval
 * given by `time`. Function is bound to `this`, and can be removed
 * using `_clearInterval`. If an interval function with the given name
 * is already set, the function does nothing.
 * @private
 * @param {string} name
 * @param {Function} fn
 * @param {integer} time - The time in ms.
 */
Bot.prototype._setInterval = function(name, fn, time) {
  if (!this._isInterval(name)) {
    this.actions[name] = setInterval(fn.bind(this), time);
  }
}

/**
 * Check whether the interval with the given name is active.
 * @private
 * @param {string} name
 * @return {boolean} - Whether the interval is active.
 */
Bot.prototype._isInterval = function(name) {
  return this.actions.hasOwnProperty(name);
}

Bot.prototype._removeDraw = function() {
  this.draw.hideVector("seek");
  this.draw.hideVector("avoid");
}

/**
 * Scale a vector so that one of the components is maximized.
 * @param {Point} vec - The vector to scale.
 * @param {number} max - The maximum (absolute) value of either component.
 * @return {Point} - The converted vector.
 */
Bot.prototype._scaleVector = function(vec, max) {
  var ratio = 0;
  if (Math.abs(vec.x) >= Math.abs(vec.y) && vec.x !== 0) {
    ratio = Math.abs(max / vec.x);
  } else if (vec.y !== 0) {
    ratio = Math.abs(max / vec.y);
  }
  var scaled = vec.mul(ratio);
  return scaled;
}

/**
 * Takes the desired velocity as a parameter and presses the keys
 * necessary to make it happen.
 * @param {Point} vec - The desired velocity.
 */
Bot.prototype._update = function(vec) {
  if (vec.x == 0 && vec.y == 0) return;
  var params = this.parameters.steering["update"];
  // The cutoff for the difference between a desired velocity and the
  // current velocity is small enough that no action needs to be taken.
  var ACTION_THRESHOLD = params.action_threshold;
  var CURRENT_VECTOR = params.current_vector;
  var TOP_SPEED_THRESHOLD = params.top_speed_threshold;
  var current = this.game.pVelocity(CURRENT_VECTOR);
  var topSpeed = this.self.ms;
  var isTopSpeed = {};
  // actual speed can vary +- 0.02 of top speed/
  isTopSpeed.x = Math.abs(topSpeed - Math.abs(current.x)) < TOP_SPEED_THRESHOLD;
  isTopSpeed.y = Math.abs(topSpeed - Math.abs(current.y)) < TOP_SPEED_THRESHOLD;
  var dirs = {};
  if (Math.abs(current.x - vec.x) < ACTION_THRESHOLD && (Math.abs(vec.x) < Math.abs(current.x))) {
    // Do nothing.
  } else if (Math.abs(current.x - vec.x) < ACTION_THRESHOLD) {
    // We're already going fast and we want to keep going fast.
    if (isTopSpeed.x) {
      if (current.x > 0) {
        dirs.right = true;
      } else {
        dirs.left = true;
      }
    }
  } else if (vec.x < current.x) {
    dirs.left = true;
  } else {
    dirs.right = true;
  }

  if (Math.abs(current.y - vec.y) < ACTION_THRESHOLD && (Math.abs(vec.y) < Math.abs(current.y))) {
    // Do nothing.
  } else if (Math.abs(current.y - vec.y) < ACTION_THRESHOLD) {
    // We're already going fast and we want to keep going fast.
    if (isTopSpeed.y) {
      if (current.y > 0) {
        dirs.down = true;
      } else {
        dirs.up = true;
      }
    }
  } else if (vec.y < current.y) {
    dirs.up = true;
  } else {
    dirs.down = true;
  }
  this.move(dirs);
}

/**
 * Stop all movement.
 */
Bot.prototype.allUp = function() {
  this.move({});
}

/**
 * Send a chat message to the active game. Truncates messages that
 * are too long. Maximum length for a message is 71.
 * @param {string} message - The message to send.
 * @param {boolean} [all=true] - Whether the chat should be to all
 *   players or just to the team.
 */
Bot.prototype.chat = function(message, all) {
  if (typeof all == 'undefined') all = true;
  if (!this.hasOwnProperty('lastMessage')) this.lastMessage = 0;
  var limit = 500 + 10;
  var now = Date.now();
  var timeDiff = now - this.lastMessage;
  var maxLength = 71;
  if (timeDiff > limit) {
    if (message.length > maxLength) {
      message = message.substr(0, maxLength);
    }
    tagpro.socket.emit("chat", {
      message: message,
      toAll: all ? 1 : 0
    });
    this.lastMessage = Date.now();
  } else if (timeDiff >= 0) {
    setTimeout(function() {
      this.chat(message, all);
    }.bind(this), limit - timeDiff);
  }
}

},{"./brain":4,"./drawutils":8,"./geometry":9,"tagpro-navmesh":2}],4:[function(require,module,exports){
var Point = require('./geometry').Point;

function inherits(child, parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}

GoalStatus = {
  inactive: 1,
  active: 2,
  completed: 3,
  failed: 4,
  waiting: 5
};

var Goal = function(bot) {
  this.bot = bot;
  this.status = GoalStatus.inactive;
};

Goal.prototype.activate = function() {};

Goal.prototype.process = function() {};

Goal.prototype.terminate = function() {};

/**
 * This function allows passing a message to a goal to be handled in
 * real-time. If this is not overriden then the default behavior is
 * to not handle the message.
 * @param {} msg - The message.
 * @return {boolean} - Whether or not the goal handled the message.
 */
Goal.prototype.handleMessage = function(msg) {
  return false;
};

/**
 * Run the activate function for the current goal if its current
 * status is inactive, otherwise do nothing.
 * @return {boolean} - Whether or not the activate function was run.
 */
Goal.prototype.activateIfInactive = function() {
  if (this.isInactive()) {
    this.activate();
    return true;
  } else {
    return false;
  }
};

Goal.prototype.reactivateIfFailed = function() {
  if (this.hasFailed()) {
    this.status = GoalStatus.inactive;
  }
};

Goal.prototype.type = function() {
  return this.constructor;
};

Goal.prototype.isActive = function() {
  return this.status == GoalStatus.active;
};

Goal.prototype.isInactive = function() {
  return this.status == GoalStatus.inactive;
};

Goal.prototype.isCompleted = function() {
  return this.status == GoalStatus.completed;
};

Goal.prototype.hasFailed = function() {
  return this.status == GoalStatus.failed;
};

/**
 * Acts as a goal with subgoals.
 * @constructor
 * @param {Bot} bot
 */
CompositeGoal = function(bot) {
  Goal.apply(this, arguments);
  this.subgoals = [];
};

inherits(CompositeGoal, Goal);

/**
 * By default, a composite goal forwards messages to the first
 * subgoal and returns the result.
 * @param {} msg - The message to handle.
 * @return {boolean} - Whether or not the message was handled.
 */
CompositeGoal.prototype.handleMessage = function(msg) {
  return this.forwardToFirstSubgoal(msg);
};

/**
 * Forward the given message to the first subgoal of this goal, or if
 * there are no subgoals, return false.
 * @param {} msg - The message to forward.
 * @param {boolean} - Whether or not the nessage was handled.
 */
CompositeGoal.prototype.forwardToFirstSubgoal = function(msg) {
  if (this.subgoals.length > 0) {
    return this.subgoals[0].handleMessage(msg);
  } else {
    return false;
  }
};

/**
 * Process the subgoals of a composite goal. This removes completed
 * and failed goals from the subgoal list and processes the first
 * subgoal still remaining.
 */
CompositeGoal.prototype.processSubgoals = function() {
  // Remove completed and failed subgoals.
  while (this.subgoals.length !== 0 &&
    (this.subgoals[0].isCompleted() || this.subgoals[0].hasFailed())) {
    var subgoal = this.subgoals.shift();
    subgoal.terminate();
  }
  // Process first subgoal.
  if (this.subgoals.length !== 0) {
    var subgoalStatus = this.subgoals[0].process();
    if (subgoalStatus == GoalStatus.completed && this.subgoals.length > 1) {
      return GoalStatus.active;
    }
    return subgoalStatus;
  } else {
    return GoalStatus.completed;
  }
};

/**
 * Add goal to subgoals.
 * @param {Goal} goal - The goal to add.
 */
CompositeGoal.prototype.addSubgoal = function(goal) {
  this.subgoals.push(goal);
};

CompositeGoal.prototype.removeAllSubgoals = function() {
  var subgoals = this.subgoals.splice(0, this.subgoals.length);
  subgoals.forEach(function(subgoal) {
    subgoal.terminate();
  });
};

/**
 * Checks if the current first subgoal is of the type passed. If
 * there are no subgoals then this returns false.
 * @param {Function} goalType - The type to check for.
 * @return {boolean} - Whether the first subgoal is of the given
 *   type.
 */
CompositeGoal.prototype.isFirstSubgoal = function(goalType) {
  if (this.subgoals.length > 0) {
    return (this.subgoals[0] instanceof goalType);
  } else {
    return false;
  }
};

/**
 * Clean up.
 * @override
 */
CompositeGoal.prototype.terminate = function() {
  this.removeAllSubgoals();
};

/**
 * This goal is concerned with making decisions and guiding the
 * behavior of the bot.
 */
var Think = function(bot) {
  CompositeGoal.apply(this, arguments);
  // Game type, either ctf or cf
  this.gameType = this.bot.game.gameType();
  this.alive = this.bot.game.alive();
};
module.exports = Think;

inherits(Think, CompositeGoal);

/**
 * Initiate thinking if alive.
 * @override
 */
Think.prototype.activate = function() {
  this.status = GoalStatus.active;
  if (this.alive) {
    this.think();
  } else {
    this.status = GoalStatus.inactive;
  }
};

Think.prototype.process = function() {
  this.activateIfInactive();
  var status = this.processSubgoals();
  if (status == GoalStatus.completed || status == GoalStatus.failed) {
    this.status = GoalStatus.inactive;
  }
  return this.status;
};

/**
 * Think handles the following message types:
 * * dead
 * * stanceChange
 * * alive
 * @override
 */
Think.prototype.handleMessage = function(msg) {
  if (msg == "dead") {
    this.terminate();
    this.status = GoalStatus.inactive;
    this.alive = false;
    return true;
  } else if (msg == "alive") {
    this.alive = true;
    return true;
  } else if (msg == "stanceChange") {
    this.terminate();
    this.status = GoalStatus.inactive;
    return true;
  } else {
    return this.forwardToFirstSubgoal(msg);
  }
};

/**
 * Choose action to take.
 */
Think.prototype.think = function() {
  if (this.gameType == this.bot.game.GameTypes.ctf) {
    // Choose based on manual selection.
    if (this.bot.isOffense()) {
      // Make sure we're not already on offense.
      if (!this.isFirstSubgoal(Offense)) {
        // Only set to offense for now.
        // This goal replaces all others.
        this.removeAllSubgoals();
        this.addSubgoal(new Offense(this.bot));
      }
    } else if (this.bot.isDefense()) {
      if (!this.isFirstSubgoal(Defense)) {
        this.removeAllSubgoals();
        this.addSubgoal(new Defense(this.bot));
      }
    }
  } else {
    // Center flag game.
    this.bot.chat("I can't play this.");
  }
};

/**
 * Offense is a goal with the purpose of capturing the enemy flag and
 * returning it to base to obtain a capture.
 * @constructor
 * @param {Bot} bot - The bot.
 */
var Offense = function(bot) {
  CompositeGoal.apply(this, arguments);
};

inherits(Offense, CompositeGoal);

/**
 * The Offense goal activation function checks whether or not the bot
 * has the flag and initiates navigation to either retrieve it or
 * return to base to get a capture.
 */
Offense.prototype.activate = function() {
  this.status = GoalStatus.active;
  var destination;
  if (!this.bot.self.flag) {
    destination = this.bot.game.findEnemyFlag();
    this.addSubgoal(new NavigateToPoint(this.bot, destination.location));
  } else {
    destination = this.bot.game.findOwnFlag();
    this.addSubgoal(new NavigateToPoint(this.bot, destination.location));
  }
};

Offense.prototype.process = function() {
  this.activateIfInactive();

  var status = this.processSubgoals();

  if (status == GoalStatus.completed) {
    this.activate();
  }
  return this.status;
};

/**
 * The Defense goal is concerned with defending a flag in base,
 * preventing an enemy capture, and chasing and returning the
 * enemy flag carrier.
 */
var Defense = function(bot) {
  CompositeGoal.apply(this, arguments);
};

inherits(Defense, CompositeGoal);

Defense.prototype.activate = function() {
  this.status = GoalStatus.active;
  // Get own team's flag status.
  var flag = this.bot.game.findOwnFlag();
  // Flag is home.
  if (flag.state) {
    // Consider current location.
    if (this.bot.game.inBase()) {
      // Inside base, defend our flag.
      this.addSubgoal(new DefendFlag(this.bot));
    } else {
      // Outside of base, plot a course for the base's location.
      var base = this.bot.game.base();
      this.addSubgoal(new NavigateToPoint(this.bot, base.location));
    }
  } else {
    // Flag is not home.
    this.addSubgoal(new OffensiveDefense(this.bot));
  }
};

Defense.prototype.process = function() {
  this.activateIfInactive();

  var status = this.processSubgoals();
  if (status !== GoalStatus.active) {
    this.activate();
  }

  return this.status;
};

Defense.prototype.handleMessage = function(msg) {
  // Enemy takes flag, resort to out-of-base defense.
  // Our/Enemy flag has been returned.
  // Our/Enemy flag has been taken.
  // Default behavior.
  return this.forwardToFirstSubgoal(msg);
};

/**
 * Implements strategies and behaviors related to the goal of in-base
 * defense. Assumes we're located in-base.
 */
var DefendFlag = function(bot) {
  CompositeGoal.apply(this, arguments);
};

inherits(DefendFlag, CompositeGoal);

DefendFlag.prototype.activate = function() {
  this.status = GoalStatus.active;
  // Play no-grab for now.
  //if (!this.isFirstSubgoal(NoGrabDefense)) {
    this.removeAllSubgoals();
    this.addSubgoal(new NoGrabDefense(this.bot));
  //}
};

DefendFlag.prototype.process = function() {
  this.activateIfInactive();
  this.status = this.processSubgoals();
  return this.status;
};

DefendFlag.prototype.handleMessage = function(msg) {
  // Powerup value consideration.
  // Additional enemies present in base.
  // Default behavior.
  return this.forwardToFirstSubgoal(msg);
};

/**
 * Holds the strategy of no-grab defense. Push enemies away from
 * own flag.
 */
var NoGrabDefense = function(bot) {
  CompositeGoal.apply(this, arguments);
};

inherits(NoGrabDefense, CompositeGoal);

NoGrabDefense.prototype.activate = function() {
  this.status = GoalStatus.active;
  // Select target enemy.
  var enemies = this.bot.game.enemiesInBase();
  if (enemies.length > 0) {
    // Select first for now.
    var target = enemies[0];
    var base = this.bot.game.base().location;
    this.addSubgoal(new KeepPlayerFromPoint(this.bot, target.id, base));
  } else {
    // Nothing now.
  }
};

NoGrabDefense.prototype.process = function() {
  this.activateIfInactive();

  this.status = this.processSubgoals();

  return this.status;
};

/**
 * Push an enemy away from the flag.
 * @param {Bot} bot - The bot.
 * @param {integer} target - The id of the player to push away from
 *   the flag.
 * @param {Point} point - The point to keep the target away from.
 */
var KeepPlayerFromPoint = function(bot, target, point) {
  CompositeGoal.apply(this, arguments);
  this.target = this.bot.game.player(target);
  this.point = point;
};

inherits(KeepPlayerFromPoint, CompositeGoal);

/**
 * Checks that player is in-between target player and point, getting
 * between if necessary and pushing away.
 */
KeepPlayerFromPoint.prototype.activate = function() {
  this.status = GoalStatus.active;
  // The margin for checking whether player is between the two points.
  var margin = 20;
  var playerPos = this.bot.game.location();
  var targetPos = this.bot.game.location(this.target.id);
  var flagPos = this.point;
  if (this.bot.game.isInterposed(playerPos, targetPos, flagPos)) {
    // Player is between target and flag.
    this.bot.chat("I'm between target and flag.");
    //this.addSubgoal(new )
  } else {
    // Player is not between target and flag.
    this.addSubgoal(new StaticInterpose(this.bot, this.target.id, this.point));
  }
};

KeepPlayerFromPoint.prototype.process = function() {
  this.activateIfInactive();

  var status = this.processSubgoals();
  if (status == GoalStatus.completed) {
    // Set to inactive so we run activate next tick.
    this.status = GoalStatus.inactive;
  }

  return this.status;
};

/**
 * Get in-between a target and static point.
 * @param {Bot} bot - The bot.
 * @param {number} target - The id of the player to push away from
 *   the flag.
 * @param {Point} point - The point to keep the target away from.
 */
var StaticInterpose = function(bot, target, point) {
  CompositeGoal.apply(this, arguments);
  this.target = this.bot.game.player(target);
  this.point = point;
};

inherits(StaticInterpose, CompositeGoal);

StaticInterpose.prototype.activate = function() {
  this.status = GoalStatus.active;

  var pos = this.bot.game.location();
  var enemyPos = this.bot.game.location(this.target.id);
  var point = this.point;

  if (!this.bot.game.isInterposed(pos, enemyPos, point)) {
    // Get position to seek towards.
    var vel = this.bot.game.velocity();

    var enemyVel = this.bot.game.velocity(this.target.id);
    // Point to seek between two objects.
    var midpoint = point.add(enemyPos).div(2);
    this.addSubgoal(new SeekToPoint(this.bot, midpoint));
  } else {
    this.status = GoalStatus.completed;
  }
};

StaticInterpose.prototype.process = function() {
  var status = this.processSubgoals();
  if (status !== GoalStatus.active) {
    this.activate();
  }

  return this.status;
};

/**
 * Tries to push a target player away along a ray emanating from a
 * point.
 * @param {Bot} bot - The Bot.
 * @param {Player} target - The target player.
 * @param {Point} point - The point to push the player from.
 * @param {Point} ray - Unit vector direction from point in which to
 *   push the player.
 */
var PushPlayerAway = function(bot, target, point, ray) {
  Goal.apply(this, arguments);
  this.target = target;
  this.point = point;
  this.ray = ray;
};

inherits(PushPlayerAway, Goal);

/**
 * Check that target player is within a margin of the target ray,
 * failing if they are too far.
 */
PushPlayerAway.prototype.activate = function() {
  
};

PushPlayerAway.prototype.process = function() {
  
};

var ContainmentDefense = function(bot) {
  CompositeGoal.apply(this, arguments);
};

inherits(ContainmentDefense, CompositeGoal);


/**
 * Defense strategy to use when flag is out-of-base.
 */
var OffensiveDefense = function(bot) {
  CompositeGoal.apply(this, arguments);
};

inherits(OffensiveDefense, CompositeGoal);

OffensiveDefense.prototype.activate = function() {
  this.status = GoalStatus.active;
};

OffensiveDefense.prototype.process = function() {
  this.activateIfInactive();

  this.status = this.processSubgoals();

  return this.status;
};

/**
 * This goal navigates to the given point, where the point may be
 * a static location anywhere in the traversable area of the game
 * map.
 * @param {Bot} bot - The bot.
 * @param {Point} point - The point to navigate to.
 */
var NavigateToPoint = function(bot, point) {
  CompositeGoal.apply(this, arguments);
  this.point = point;
};

inherits(NavigateToPoint, CompositeGoal);

NavigateToPoint.prototype.activate = function() {
  this.status = GoalStatus.active;
  var start = this.bot.game.location();
  var end = this.point;

  this.removeAllSubgoals();

  // Add subgoal to calculate the path.
  this.addSubgoal(new CalculatePath(this.bot, start, end, function(path) {
    if (path) {
      this.addSubgoal(new FollowPath(this.bot, path));
    } else {
      // Handle no path being found.
      // pass back up and retry a specific number of times?
    }
  }.bind(this)));
};

NavigateToPoint.prototype.process = function() {
  this.activateIfInactive();
  
  this.status = this.processSubgoals();

  return this.status;
};

/**
 * Handles navUpdate message.
 */
NavigateToPoint.prototype.handleMessage = function(msg) {
  if (msg == "navUpdate") {
    // Inactivate so we find a different path.
    this.status = GoalStatus.inactive;
    // todo: incorporate partial path update.
    // consider button pressing on dynamic obstacles.
  }
};

/**
 * Callback function to the CalculatePath goal.
 * @callback PathCallback
 * @param {?Array.<PointLike>} - The path, or null if the path was
 *   not found.
 */
/**
 * This goal calculates a path from the start to the end points and
 * calls the provided callback function after the path is calculated.
 * @param {Bot} bot - The bot.
 * @param {Point} start - The start location for the path.
 * @param {Point} end - The end location for the path.
 * @param {} callback - The callback function to be invoked when the
 *   path has been calculated.
 */
var CalculatePath = function(bot, start, end, callback) {
  Goal.apply(this, arguments);
  this.start = start;
  this.end = end;
  this.callback = callback;
};

inherits(CalculatePath, Goal);

CalculatePath.prototype.activate = function() {
  this.status = GoalStatus.waiting;
  // Calculate path.
  this.bot.navmesh.calculatePath(this.start, this.end, function(path) {
    if (path) {
      this.status = GoalStatus.completed;
      path = this._postProcessPath(path);
    } else {
      this.status = GoalStatus.failed;
    }
    this.callback(path);
  }.bind(this));
};

CalculatePath.prototype.process = function() {
  this.activateIfInactive();
  return this.status;
};

/**
 * Post-process a path to move it away from obstacles.
 * @private
 * @param {Array.<Point>} path - The path to process.
 * @return {Array.<Point>} - The processed path.
 */
CalculatePath.prototype._postProcessPath = function(path) {
  // Convert point-like path coordinates to point objects.
  path = path.map(Point.fromPointLike);

  // Remove current point.
  if (path.length > 1) {
    path.shift();
  }
  var spikes = this.bot.game.getspikes();
  // The additional buffer to give the obstacles.
  var buffer = this.bot.spike_buffer || 20;
  // The threshold for determining points which are 'close' to
  // obstacles.
  var threshold = this.bot.spike_threshold || 60;
  var spikesByPoint = new Map();
  path.forEach(function(point) {
    var closeSpikes = [];
    spikes.forEach(function(spike) {
      if (spike.dist(point) < threshold) {
        closeSpikes.push(spike);
      }
    });
    if (closeSpikes.length > 0) {
      spikesByPoint.set(point, closeSpikes);
    }
  });
  for (var i = 0; i < path.length; i++) {
    var point = path[i];
    if (spikesByPoint.has(point)) {
      var obstacles = spikesByPoint.get(point);
      if (obstacles.length == 1) {
        // Move away from the single point.
        var obstacle = obstacles[0];
        var v = point.sub(obstacle);
        var len = v.len();
        var newPoint = obstacle.add(v.mul(1 + buffer / len));
        path[i] = newPoint;
      } else if (obstacles.length == 2) {
        // Move away from both obstacles.
        var center = obstacles[1].add(obstacles[0].sub(obstacles[1]).mul(0.5));
        var v = point.sub(center);
        var len = v.len();
        var newPoint = center.add(v.mul(1 + (buffer + threshold) / len));
        path[i] = newPoint;
      }
    }
  }
  return path;
};

/**
 * This goal 
 * @param {Bot} bot - The bot.
 * @param {Array.<Point>} path - The path to follow.
 */
var FollowPath = function(bot, path) {
  CompositeGoal.apply(this, arguments);
  this.path = path;
  this.iteration = 0;
  this.reactivate_threshold = 20;
};

inherits(FollowPath, CompositeGoal);

FollowPath.prototype.activate = function() {
  this.status = GoalStatus.active;
  // Get front of path.
  var destination = this._getNext();

  // try to navigate to front of path.
  if (destination) {
    if (this.subgoals.length > 0) {
      var subgoal = this.subgoals[0];
      if (subgoal.point && subgoal.point.neq(destination)) {
        this.removeAllSubgoals();
        this.addSubgoal(new SeekToPoint(this.bot, destination));
      }
    } else {
      this.addSubgoal(new SeekToPoint(this.bot, destination));
    }
  } else {
    this.status = GoalStatus.failed;
  }

  // If front of path is not visible, set failed. - may need to do
  // lower in goal hierarchy.
};

FollowPath.prototype.process = function() {
  this.iteration++;
  if (this.iteration == this.reactivate_threshold) {
    this.status = GoalStatus.inactive;
    this.iteration = 0;
  }
  this.activateIfInactive();

  if (this.status !== GoalStatus.failed) {
    var status = this.processSubgoals();
    // Add next point onto path if possible.
    if (status == GoalStatus.completed && this.path.length !== 2) {
      this.activate();
    }
  }

  return this.status;
};

/**
 * Get the next point along the path.
 * @private
 * @param {integer} [limit] - If provided, limits the number of
 *   points ahead on the path that will be checked for visibility.
 * @return {Point} - The next point on the path to navigate to.
 */
FollowPath.prototype._getNext = function(limit) {
  if (typeof limit == 'undefined') {
    limit = this.path.length;
  } else {
    limit = Math.min(limit, this.path.length);
  }
  if (!this.path)
    return;

  var goal = false;
  var path = this.path.slice();
  // Find next location to seek out in path.
  if (path.length > 0) {
    var me = this.bot.game.location();
    var anyVisible = false;
    var last_index = 0;
    goal = path[0];

    // Get point furthest along path that is visible from current
    // location.
    for (var i = 0; i < limit; i++) {
      var point = path[i];
      if (this.bot.navmesh.checkVisible(me, point)) {
        goal = point;
        last_index = i;
        anyVisible = true;
      } else {
        // If we're very near a point, remove it and head towards the
        // next one.
        if (me.dist(goal) < 20) {
          last_index = i;
        }
      }
    }

    if (anyVisible) {
      path = path.slice(last_index);
      if (path.length == 1) {
        goal = path[0];
        if (me.dist(goal) < 20) {
          goal = false;
          this.status = GoalStatus.completed;
        }
      }
    } else {
      goal = false;
      this.status = GoalStatus.failed;
    }
  }

  // Update bot state.
  if (goal) {
    this.bot.draw.updatePoint("goal", goal);
    this.path = path;
  }
  return goal;
};

/**
 * Seek to the given point, which is assumed to be a static point in
 * the line-of-sight of the bot.
 * @param {Bot} bot
 * @param {Point} point - The point to navigate to.
 */
var SeekToPoint = function(bot, point) {
  CompositeGoal.apply(this, arguments);
  this.point = point;
};

inherits(SeekToPoint, Goal);

SeekToPoint.prototype.activate = function() {
  this.status = GoalStatus.active;

  // Set bot steering target.
  this.bot.setTarget(this.point);
};

SeekToPoint.prototype.process = function() {
  this.activateIfInactive();

  // Check for death. - may need to be done higher up.
  var position = this.bot.game.location();
  // Check for point visibility.
  // Check if at position.
  if (position.dist(this.point) < 20) {
    this.status = GoalStatus.completed;
    this.bot.setTarget(false);
  } else if (!this.bot.navmesh.checkVisible(position, this.point)) {
    this.status = GoalStatus.failed;
  }

  return this.status;
};

/**
 * Clean up.
 */
SeekToPoint.prototype.terminate = function() {
  this.bot.setTarget(false);
};

},{"./geometry":9}],5:[function(require,module,exports){
(function (global){
var Logger = require('bragi');
var Bot = require('./bot');
var Mover = require('./browserMover');
var GameState = require('./browserGameState');

/**
 * The Browser Agent is an implementation of the TagPro agent meant
 * to run in the browser.
 *
 * @module agent/browser
 */
function waitForTagproPlayer(fn) {
  if (typeof tagpro !== "undefined" && tagpro.players && tagpro.playerId) {
    fn();
  } else {
    setTimeout(function() {
      waitForTagproPlayer(fn);
    });
  }
}

waitForTagproPlayer(function() {
  // Initialize browser-specific state and action utilities.
  var state = new GameState(tagpro);
  var mover = new Mover();

  // Start.
  var bot = new Bot(state, mover, Logger);

  var baseUrl = "http://localhost:8000/src/";

  // Set up UI.
  $.get(baseUrl + "ui.html", function(data) {
    $('body').append(data);
  });

  // For debugging.
  global.myBot = bot;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./bot":3,"./browserGameState":6,"./browserMover":7,"bragi":1}],6:[function(require,module,exports){
/**
 * The GameState object is responsible for providing information
 * about the environment, including the player's location within it.
 * @constructor
 * @alias module:gamestate/browser
 * @param {TagPro} tagpro - The initialized tagpro object available
 *   in the browser client execution environment.
 */
var GameState = function(tagpro) {
  // Initialization
  this.tagpro = tagpro;
  this.parameters = {};
  // Holds information about the game physics parameters.
  this.parameters.game = {
    step: 1e3 / 60, // Physics step size in ms.
    radius: {
      spike: 14,
      ball: 19
    }
  };
  this.self = this.player();
};

module.exports = GameState;

/**
 * Set up browser-based optimizations that will assist in retrieving
 * information about the game state.
 */
GameState.prototype.optimizations = function() {
  // Overriding this function allows the state of the box2d body to
  // be accessed from the player object.
  Box2D.Dynamics.b2Body.prototype.GetPosition = function() {
    var player = tagpro.players[this.player.id];
    // Assign "this" to "player.body".
    player.body = player.body || this;
    
    // Return current position.
    return this.m_xf.position;
  };
};

GameState.prototype.initialized = function() {
  return !(typeof tagpro !== 'object' || !tagpro.playerId);
};

/**
 * Register a function to listen for a socket event.
 */
GameState.prototype.on = function(eventName, fn) {
  this.tagpro.socket.on(eventName, fn);
};

/**
 * Get player given by id, or `null` if no such player exists. If id
 * is not provided, then the current player is returned.
 */
GameState.prototype.player = function(id) {
  if (typeof id == 'undefined') id = this.tagpro.playerId;
  return this.tagpro.players[id] || null;
};

/**
 * Get team of player given by id, or `null` if no such player
 * exists. If id is not provided, then the id of the current
 * player is used.
 */
GameState.prototype.team = function(id) {
  var player = this.player(id);
  if (player) {
    return player.team;
  } else {
    return null;
  }
};

/**
 * Returns the array of map tiles, or `null` if not initialized.
 */
GameState.prototype.map = function() {
  if (typeof this.tagpro !== 'object' || !this.tagpro.map) return null;
  return this.tagpro.map;
};

/**
 * Get the location of the player given by id, or `null` if no such
 * player exists. If id is not provided, then the location for the
 * current player is returned.
 * @param {integer} [id] - The id of the player to get the predicted
 *   location for. Defaults to id of current player.
 * @return {Point} - The current location of the player.
 */
GameState.prototype.location = function(id) {
  var player = this.player(id);
  return new Point(player.x + 20, player.y + 20);
};

/**
 * Get predicted location based on current position and velocity.
 * @param {integer} [id] - The id of the player to get the predicted
 *   location for. Defaults to id of current player.
 * @param {number} ahead - The amount to look ahead to determine the
 *   predicted location. Default interpretation is in ms.
 * @param {boolean} [steps=false] - Whether to interpret `ahead` as
 *   the number of steps in the physics simulation.
 * @return {Point} - The predicted location of the player.
 */
GameState.prototype.pLocation = function(id, ahead, steps) {
  if (arguments.length == 1) {
    id = this.tagpro.playerId;
    ahead = this._msToSteps(arguments[0]);
  } else if (arguments.length == 2) {
    if (typeof arguments[1] == 'boolean') {
      ahead = arguments[0];
      steps = arguments[1];
      if (!steps) {
        ahead = this._msToSteps(ahead);
      }
    }
  }
  if (steps) {
    var time = this._msToSteps(ahead);
  } else {
    var time = ahead;
  }
  var cv = this.velocity(id);
  // Bound the predicted velocity 
  var pv = this.pVelocity(id, 1, true);
  var current_location = this.location(id);
  var dx = 0;
  var dy = 0;

  if (Math.abs(pv.x) == this.self.ms) {
    // Find point that max velocity was reached.
    var step = Math.abs(pv.x - cv.x) / this.self.ac;
    var accTime = step * (1 / 60);
    dx += accTime * ((pv.x + cv.x) / 2);
    dx += (time - accTime) * pv.x;
  } else {
    dx += time * ((pv.x + cv.x) / 2);
  }

  if (Math.abs(pv.y) == this.self.ms) {
    var step = Math.abs(pv.y - cv.y) / this.self.ac;
    var accTime = step * (1 / 60);
    dy += accTime * ((pv.y + cv.y) / 2);
    dy += (time - accTime) * pv.y;
  } else {
    dy += time * ((pv.y + cv.y) / 2);
  }
  var dl = new Point(dx, dy);
  // Convert from physics units to x, y coordinates.
  dl = dl.mul(100);

  return current_location.add(dl);
};

/**
 * Get velocity of player given by id. If id is not provided, then
 * returns the velocity for the current player.
 * @param {integer} [id] - The id of the player to get the velocity
 *   for. Defaults to id of current player.
 * @return {Point} - The velocity of the player.
 */
GameState.prototype.velocity = function(id) {
  var player = this.player(id);
  var clx, cly;
  if (player.body) {
    var vel = player.body.GetLinearVelocity();
    clx = vel.x;
    cly = vel.y;
  } else {
    clx = player.lx;
    cly = player.ly;
  }
  return new Point(clx, cly);
};

/**
 * Get predicted velocity a number of steps into the future based on
 * current velocity, acceleration, max velocity, and the keys being
 * pressed.
 * @param {integer} [id] - The id of the player to get the predicted
 *   velocity for. Defaults to id of current player.
 * @param {number} ahead - The amount to look ahead to determine the
 *   predicted velocity. Default interpretation is in ms.
 * @param {boolean} [steps=false] - Whether to interpret `ahead` as
 *   the number of steps in the physics simulation.
 * @return {Point} - The predicted velocity of the player.
 */
GameState.prototype.pVelocity = function(id, ahead, steps) {
  if (arguments.length == 1) {
    id = this.tagpro.playerId;
    ahead = this._msToSteps(arguments[0]);
  } else if (arguments.length == 2) {
    if (typeof arguments[1] == 'boolean') {
      ahead = arguments[0];
      steps = arguments[1];
      if (!steps) {
        ahead = this._msToSteps(ahead);
      }
    }
  }
  var vel = this.velocity(id);
  var player = this.player(id);

  var change_x = 0, change_y = 0;
  if (player.pressing.up) {
    change_y = -1;
  } else if (player.pressing.down) {
    change_y = 1;
  }
  if (player.pressing.left) {
    change_x = -1;
  } else if (player.pressing.right) {
    change_x = 1;
  }
  var plx, ply;
  plx = vel.x + player.ac * ahead * change_x;
  plx = Math.sign(plx) * Math.min(Math.abs(plx), player.ms);
  ply = vel.y + player.ac * ahead * change_y;
  ply = Math.sign(ply) * Math.min(Math.abs(ply), player.ms);

  return new Point(plx, ply);
};

/**
 * Given a time in ms, return the number of steps needed to represent
 * that time.
 * @private
 * @param {integer} ms - The number of ms.
 * @return {integer} - The number of steps.
 */
GameState.prototype._msToSteps = function(ms) {
  return ms / this.parameters.game.step;
};

/**
 * Translate an array location from `tagpro.map` into a point
 * representing the x, y coordinates of the top left of the tile,
 * or the center of the tile if 'center' is true.
 * @private
 * @param {integer} row - The row of the tile.
 * @param {integer} col - The column of the tile.
 * @return {Point} - The x, y coordinates of the tile.
 */
GameState.prototype._arrayToCoord = function(row, col) {
  return new Point(40 * row, 40 * col);
};

/**
 * Indicates whether a player with the given id is visible to the
 * current player.
 * @param {integer} id - The id of the player to check visibility
 *   for.
 * @return {boolean} - Whether the player is visible.
 */
GameState.prototype.visible = function(id) {
  return !!this.player(id).draw;
};

/**
 * Indicates whether a player with the given id is alive.
 * @param {integer} id - The id of the player to check for
 *   liveliness.
 * @return {boolean} - Whether the player is alive.
 */
GameState.prototype.alive = function(id) {
  return !this.player(id).dead;
};

/**
 * Locates the enemy flag. If found and not taken, the `state` of the
 * returned search result will be true, and false otherwise. If not
 * found, then null is returned.
 * @return {?TileSearchResult} - The search result for the enemy flag,
 *   if found.
 */
GameState.prototype.findEnemyFlag = function() {
  // Get flag value.
  var tile = (this.self.team == GameState.Teams.blue ? GameState.Tiles.redflag : GameState.Tiles.blueflag);
  return this.findTile(tile);
};

/**
 * Locates the team flag for the current player. If found and not
 * taken, the `state` of the returned search result will be true, and
 * false otherwise. If not found, then null is returned.
 * @return {?TileSearchResult} - The search result for the flag, if
 *   found.
 */
GameState.prototype.findOwnFlag = function() {
  var tile = (this.self.team == GameState.Teams.blue ? GameState.Tiles.blueflag : GameState.Tiles.redflag);
  return this.findTile(tile);
};

/**
 * Find yellow flag.
 */
GameState.prototype.findYellowFlag = function() {
  return this.findTile(GameState.Tiles.yellowflag);
};

/**
 * Returns an array of Points that specifies the coordinates of any
 * spikes on the map.
 * @return {Array.<Point>} - An array of Point objects representing the
 *   coordinates of the center of each spike.
 */
GameState.prototype.getspikes = function() {
  if (this.hasOwnProperty('spikes')) {
    return this.spikes;
  } else {
    var results = this.findTiles(GameState.Tiles.spike);
    var spikes = results.map(function(result) {
      return result.location;
    });
    this.spikes = spikes;
    // Debugging, draw circle used for determining spike intersection.
    /*this.spikes.forEach(function(spike, i) {
      this.draw.addCircle(
        "spike-" + i,
        this.parameters.steering.avoid.spike_intersection_radius,
        0xbbbb00
      );
      this.draw.updateCircle("spike-" + i, spike);
    }, this);*/
    return spikes;
  }
};

// Static Game Information
/**
 * Represents a tile along with its possible values and the value for the 'state' attribute
 * of the tile result that should be returned from a search.
 * @typedef Tile
 * @type {object.<(number|string), *>}
 */
GameState.Tiles = {
  yellowflag: {16: true, "16.1": false},
  redflag: {3: true, "3.1": false},
  blueflag: {4: true, "4.1": false},
  powerup: {6: false, "6.1": "grip", "6.2": "bomb", "6.3": "tagpro", "6.4": "speed"},
  bomb: {10: true, "10.1": false},
  spike: {7: true}
};

GameState.Teams = {
  red: 1,
  blue: 2
};

GameState.GameTypes = {
  ctf: 1, // Capture-the-flag
  yf: 2 // Yellow flag
};

GameState.prototype.Tiles = GameState.Tiles;
GameState.prototype.Teams = GameState.Teams;
GameState.prototype.GameTypes = GameState.GameTypes;

/**
 * Result of tile search function, contains a location and state.
 * @typedef TileSearchResult
 * @type {object}
 * @property {Point} location - The x, y location of the found tile.
 * @property {*} state - A field defined by the given tile object and
 *   the actual value that was matched.
 */

/**
 * Search the map for a tile matching the given tile description, and
 * return the first one found, or `null` if no such tile is found. The
 * location in the returned tile results points to the center of the
 * tile.
 * @param {Tile} tile - A tile to search for.
 * @return {?TileSearchResult} - The result of the tile search, or
 *   null if no tile was found.
 */
GameState.prototype.findTile = function(tile) {
  // Get keys and convert to numbers
  var vals = Object.keys(tile).map(function(val) {return +val;});
  for (var row in this.tagpro.map) {
    for (var col in this.tagpro.map[row]) {
      if (vals.indexOf(+this.tagpro.map[row][col]) !== -1) {
        var loc = this._arrayToCoord(+row, +col).add(20);
        var state = tile[this.tagpro.map[row][col]];
        return {location: loc, state: state};
      }
    }
  }
  return null;
};

/**
 * Find all tiles in map that match the given tile, and return their
 * information.
 * @param {Tile} tile - A tile type to search for the locations of in
 *   the map.
 * @return {Array.<TileSearchResult>} - The results of the search, or
 *   an empty array if no tiles were found.
 */
GameState.prototype.findTiles = function(tile) {
  var tiles_found = [];
  var vals = Object.keys(tile).map(function(val) {return +val;});
  for (var row in this.tagpro.map) {
    for (var col in this.tagpro.map[row]) {
      if (vals.indexOf(+this.tagpro.map[row][col]) !== -1) {
        var loc = this._arrayToCoord(+row, +col).add(20);
        var state = tile[this.tagpro.map[row][col]];
        tiles_found.push({location: loc, state: state});
      }
    }
  }
  return tiles_found;
};

// Identify the game time, whether capture the flag or yellow flag.
// Returns either "ctf" or "yf".
GameState.prototype.gameType = function() {
  if (this.findOwnFlag() && this.findEnemyFlag()) {
    return GameState.GameTypes.ctf;
  } else {
    return GameState.GameTypes.yf;
  }
};

/**
 * Find players that are on the team of the current player.
 * @return {Array.<Player>} - The teammates.
 */
GameState.prototype.teammates = function() {
  var teammates = [];
  for (id in this.tagpro.players) {
    var player = this.tagpro.players[id];
    if (player.team == this.self.team) {
      teammates.push(player);
    }
  }
  return teammates;
};

/**
 * Find players that are not on the team of the current player.
 * @return {Array.<Player>} - The non-teammate players.
 */
GameState.prototype.enemies = function() {
  var enemies = [];
  for (id in this.tagpro.players) {
    var player = this.tagpro.players[id];
    if (player.team !== this.self.team) {
      enemies.push(player);
    }
  }
  return enemies;
};

/**
 * Check if any of the given players are within a given circular
 * area. Limits to visible players.
 * @param {Array.<Player>} players - The players to look for.
 * @param {Point} center - The center of the point to look for
 *   players within.
 * @param {number} radius - The radius to search within.
 * @return {Array.<Player>} - The players found within the area.
 */
GameState.prototype.playersWithinArea = function(players, center, radius) {
  var found = players.filter(function(player) {
    return this.playerWithinArea(player, center, radius);
  }, this);
  return found;
};

/**
 * Check if a given player is within a certain range of a point. If
 * the player is not visible, then returns false.
 * @param {Player} player - The player to check the location of.
 * @param {Point} center - The center of the area to use for location
 *   determination.
 * @param {number} radius - The radius of the area centered at the
 *   point to search within.
 * @return {boolean} - Whether the player is in the area.
 */
GameState.prototype.playerWithinArea = function(player, center, radius) {
  if (!this.visible(player.id)) return false;
  var loc = this.location(player.id);
  return loc.sub(center).len() < radius;
};

/**
 * Determines which enemies are in the current player's base.
 * @return {Aray.<Player>} - The enemies in base.
 */
GameState.prototype.enemiesInBase = function() {
  var enemies = this.enemies();
  var base = this.base();
  var found = this.playersWithinArea(enemies, base.location, base.radius);
  return found;
};

/**
 * Determines whether the current player is in-base or not.
 * @return {boolean} - Whether the current player is in-base.
 */
GameState.prototype.inBase = function() {
  var base = this.base();
  return this.playerWithinArea(this.self, base.location, base.radius);
};

/**
 * Holds information about what is considered the 'base' for the
 * current player. Defines a circular area centered on the current
 * player's flag.
 * @typedef Base
 * @type {object}
 * @property {?Point} location - The location of the center of the
 *   base. If no flag for the current player is found, then this is
 *   null.
 * @property {number} radius - The distance away from the center
 *   point that the base extends.
 */
/**
 * Returns information about the current player's base that can be
 * used for determining the number of players/items in base.
 * @return {Base} - The base location/extent information.
 */
GameState.prototype.base = function(first_argument) {
  var base = {};
  // Radius used to determine whether something is in-base.
  base.radius = 200;
  base.location = this.findOwnFlag().location;
  return base;
};

/**
 * Determines whether or not the current player is within `margin`
 * of the line between two points.
 * @param {Point} p - The point to check between the two points.
 * @param {Point} p1 - The first point.
 * @param {Point} p2 - The second point.
 * @param {number} [margin=20] - the distance from the line between p1 and
 *   p2 that the current player may be to be considered 'between'
 *   them.
 * @return {boolean} - Whether the player is between the given points.
 */
GameState.prototype.isInterposed = function(p, p1, p2, margin) {
  if (typeof margin == 'undefined') margin = 20;
  return Math.abs(p1.dist(p) + p2.dist(p) - p1.dist(p2)) < margin;
};

},{}],7:[function(require,module,exports){
// TODO: resolve jquery dependency.
/**
 * The Mover is responsible for executing actions within the
 * browser environment and managing keypresses.
 * Agents should utilize a personal `move` function that should
 * be set as the move function of the object created from this
 * class.
 * @constructor
 * @alias module:mover/browser
 */
var Mover = function() {
  // Tracks active movement directions.
  this.dirPressed = {right: false, left: false, down: false, up: false};

  // Maps directions to key codes.
  this.keyCodes = {
    right: 100,
    left: 97,
    down: 115,
    up: 119
  };

  // For differently-named viewports on tangent/other servers.
  var possible_ids = ["viewPort", "viewport"];
  for (var i = 0; i < possible_ids.length; i++) {
    var possible_id = possible_ids[i];
    if ($('#' + possible_id).length > 0) {
      this.viewport = $('#' + possible_id);
      break;
    }
  }
  
  // This is to detect key presses. Both real key presses and the bots. This is needed so we don't mess up the simPressed object.
  document.onkeydown = this._keyUpdateFunc(true);

  // This is to detect key releases. Both real key releases and the bots. This is needed so we don't mess up the simPressed object.
  document.onkeyup = this._keyUpdateFunc(false);
};
module.exports = Mover;
/**
 * @typedef DirHash
 * @type {object}
 * @property {boolean} [left]
 * @property {boolean} [right]
 * @property {boolean} [up]
 * @property {boolean} [down]
 */

/**
 * Sets the state of movement directions to that indicated by the
 * `state` parameter. If a direction is omitted from the object then
 * it will be assumed `false` and the keys corresponding to that
 * movement direction will be 'released'.
 * @param {DirHash} state - The desired movement direction states.
 */
Mover.prototype.move = function(state) {
  // Keys to set.
  var keys = [];
  var keysSeen = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  // Add calls for explicitly set keys.
  for (var dir in state) {
    keysSeen[dir] = true;
    if (state[dir] !== this.dirPressed[dir]) {
      keys.push({
        dir: dir,
        state: (state[dir] ? "keydown" : "keyup")
      });
    }
  }

  // Add calls for keys not explicitly set.
  for (var dir in keysSeen) {
    if (!keysSeen[dir] && this.dirPressed[dir]) {
      keys.push({
        dir: dir,
        state: "keyup"
      });
    }
  }

  if (keys.length > 0)
    this._updateKeys(keys);
};

/**
 * This function takes an array of function simulates a keypress on the viewport.
 * @param {Array.<{{dir: string, state: string}}>} keys - The keys
 *   to update. The dir property gives the direction and state is either
 *   "keyup" or "keydown".
 */
Mover.prototype._updateKeys = function(keys) {
  keys.forEach(function(key) {
    var e = $.Event(key.state);
    e.keyCode = this.keyCodes[key.dir];
    this.viewport.trigger(e);
  }, this);
};

/**
 * Creates a callback function for updating current movement direction
 * as the server sees it.
 * @param {boolean} newState - Whether the event indicates the key
 *   would cause movement in a direction.
 * @returns {function} - Function to update the movement direction state.
 */
Mover.prototype._keyUpdateFunc = function(newState) {
  return function(d) {
    d = d || window.event;
    switch(d.keyCode) {
      case 39: case 68: case 100: this.dirPressed.right = newState; break;
      case 37: case 65: case 97: this.dirPressed.left = newState; break;
      case 40: case 83: case 115: this.dirPressed.down = newState; break;
      case 38: case 87: case 119: this.dirPressed.up = newState; break;
    }
  }.bind(this);
};

return Mover;

},{}],8:[function(require,module,exports){
/**
 * DrawUtils holds canvas-drawing responsibility, including keeping track of
 * what items are to be drawn on the canvas as well as how to actually do it.
 * To add an item to be drawn, simply register it using the register function,
 * passing in the name of the global variable that, when set, will point to your
 * object. Objects must have 'item' and 'color' properties. The item must point
 * to a Poly, Edge, or Point, and the color property must point to a string defining
 * the color to be used in drawing the item.
 */
DrawUtils = function() {
  this.init();
};
module.exports = DrawUtils;

// Initialize drawing functions.
DrawUtils.prototype.init = function() {
  if (typeof tagpro.renderer == "undefined") {
    console.log("Can't handle old canvas!");
    return;
  }

  this.self = tagpro.players[tagpro.playerId];

  // Store items to be drawn.
  this.vectors = {};
  this.backgrounds = {};
  this.points = {};
  this.circles = {};

  // Add vectors container to player sprites object.
  this.self.sprites.vectors = new PIXI.Graphics();
  this.self.sprite.addChild(this.self.sprites.vectors);

  // Center vectors on player.
  this.self.sprites.vectors.position.x = 20;
  this.self.sprites.vectors.position.y = 20;
};

/**
 * Adds a vector to be drawn over the current player.
 * @param {string} name - The name used to refer to the vector.
 * @param {number} [color=0x000000] - The color used when drawing the
 *   vector.
 */
DrawUtils.prototype.addVector = function(name, color) {
  var vector = {
    name: name,
    container: new PIXI.Graphics(),
    color: color || 0x000000
  };
  this.vectors[name] = vector;
  this.self.sprites.vectors.addChild(vector.container);
};

/**
 * Updates the vector identified with `name` with the values from
 * point `p`.
 * @param {string} name - The name of the vector to update.
 * @param {Point} p - The point to use to update the vector.
 */
DrawUtils.prototype.updateVector = function(name, p) {
  this.vectors[name].x = p.x;
  this.vectors[name].y = p.y;
  this._drawVector(this.vectors[name]);
};

DrawUtils.prototype.hideVector = function(name) {
  this.vectors[name].container.visible = false;
};

DrawUtils.prototype.showVector = function(name) {
  this.vectors[name].container.visible = true;
};

/**
 * Add navmesh polys to background.
 */
DrawUtils.prototype.addBackground = function(name, color) {
  var background = {
    color: color,
    container: new PIXI.Graphics()
  };
  // Add background as child of background layer.
  tagpro.renderer.layers.background.addChild(background.container);
  this.backgrounds[name] = background;
};

DrawUtils.prototype.updateBackground = function(name, polys) {
  this.backgrounds[name].polys = polys;
  this._drawBackground(this.backgrounds[name]);
};

/**
 * Add circle to be drawn on the screen.
 */
DrawUtils.prototype.addCircle = function(name, radius, color) {
  var circle = {
    color: color,
    radius: radius,
    container: new PIXI.Graphics()
  };
  tagpro.renderer.layers.foreground.addChild(circle.container);
  this.circles[name] = circle;
};

DrawUtils.prototype.updateCircle = function(name, point) {
  this.circles[name].center = point;
  this._drawCircle(this.circles[name]);
};

DrawUtils.prototype._drawCircle = function(circle) {
  var c = circle;

  c.container.clear();
  c.container.lineStyle(1, c.color, 1);
  c.container.drawCircle(c.center.x, c.center.y, c.radius);
};

/**
 * Represents a point to be drawn on the screen, along with information
 * about how to draw it.
 * @typedef PointInfo
 * @type {object}
 * @property {number} color - The fill color for the point.
 * @property {PIXI.Graphics} container - The container on which to
 *   draw the point.
 * @property {string} layer - The layer on which to draw the point,
 *   can be any layer identified in `tagpro.renderer.layers`.
 * @property {?Point} point - The location to draw the point. May
 *   be null as it is not initially set.
 */

/**
 * Represents a set of points to be drawn on the screen, along with
 * information about how to draw them.
 * @typedef PointsInfo
 * @type {object}
 * @property {number} color - The fill color for the point.
 * @property {PIXI.Graphics} container - The container on which to
 *   draw the point.
 * @property {string} layer - The layer on which to draw the point,
 *   can be any layer identified in `tagpro.renderer.layers`.
 */

/**
 * Add an identifier for a point or set of points to be drawn on the
 * screen.
 * @param {string} name - The name to identify the point.
 * @param {integer} color - The number identifying the color to use.
 * @param {string} [layer="background"] - A string identifying the
 *   layer to draw the point on.
 */
DrawUtils.prototype.addPoint = function(name, color, layer) {
  if (typeof layer == "undefined") layer = "background";
  var point = {
    color: color,
    container: new PIXI.Graphics(),
    layer: layer
  };
  tagpro.renderer.layers[layer].addChild(point.container);
  this.points[name] = point;
};

/**
 * Update the location of a point to be drawn on the screen.
 * @param {string} name - The name of the point to update.
 * @param {Point} point - The information about the point.
 */
DrawUtils.prototype.updatePoint = function(name, point) {
  this.points[name].point = point;
  this._drawPoint(this.points[name]);
};

/**
 * Update the location of a set point to be drawn on the screen.
 * @param {string} name - The name of the point to update.
 * @param {Array.<Point>} points - The set of updated points.
 */
DrawUtils.prototype.updatePoints = function(name, points) {
  this.points[name].points = points;
  this._drawPoints(this.points[name]);
};

DrawUtils.prototype.hidePoint = function(name) {
  this.points[name].container.visible = false;
};

/**
 * Represents a 2d vector emanating from the center of the player,
 * along with attributes for drawing.
 * @typedef VectorInfo
 * @type {object}
 * @property {string} name - An identifier for the vector (unique
 *   relative to the other vectors.)
 * @property {PIXI.Graphics} container - The graphics container to
 *   draw the vector on.
 * @property {integer} color - Number representing color to use (e.g.
 *   0x000000.)
 * @property {?number} [x] - Number representing the x coordinate of
 *   the vector, relative to the center of the player.
 * @property {?number} [y] - Number representing the y coordinate of
 *   the vector, relative to the center of the player.
 */
/**
 * Draw a vector as a small arrow based at the center of the current
 * player.
 * @private
 * @param {VectorInfo} vector
 */
DrawUtils.prototype._drawVector = function(vector) {
  var v = new Point(vector.x, vector.y);
  var v_n = v.normalize();
  if (v.len() < 2) {
    this.hideVector(vector.name);
    return;
  } else {
    this.showVector(vector.name);
  }
  var vectorWidth = 4;
  // For arrowhead.
  var vectorAngle = Math.atan2(v.y, v.x);
  var headAngle = Math.PI / 6;
  var headLength = 10;
  var leftHead = (new Point(
    Math.cos((Math.PI - headAngle + vectorAngle) % (2 * Math.PI)),
    Math.sin((Math.PI - headAngle + vectorAngle) % (2 * Math.PI))));
  leftHead = leftHead.mul(headLength).add(v);
  var rightHead = (new Point(
    Math.cos((Math.PI + headAngle + vectorAngle) % (2 * Math.PI)),
    Math.sin((Math.PI + headAngle + vectorAngle) % (2 * Math.PI))));
  rightHead = rightHead.mul(headLength).add(v);
  // For fat vector body.
  var leftBase = (new Point(
    Math.cos((Math.PI / 2 + vectorAngle) % (2 * Math.PI)),
    Math.sin((Math.PI / 2 + vectorAngle) % (2 * Math.PI))));
  var rightBase = leftBase.mul(-1);

  leftBase = leftBase.mul(vectorWidth / 2);
  rightBase = rightBase.mul(vectorWidth / 2);
  var end = v_n.mul(v_n.dot(leftHead));
  var leftTop = leftBase.add(end);
  var rightTop = rightBase.add(end);

  // Add shapes to container.
  var c = vector.container;
  c.clear();
  c.lineStyle(2, 0x000000, 1);
  c.beginFill(vector.color, 1);
  c.moveTo(leftBase.x, leftBase.y);
  c.lineTo(leftTop.x, leftTop.y);
  c.lineTo(leftHead.x, leftHead.y);
  c.lineTo(v.x, v.y);
  c.lineTo(rightHead.x, rightHead.y);
  c.lineTo(rightTop.x, rightTop.y);
  c.lineTo(rightBase.x, rightBase.y);
  var v_n_l = v_n.mul(vectorWidth / 2);
  var cp1 = rightBase.sub(v_n_l);
  var cp2 = leftBase.sub(v_n_l);
  c.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, leftBase.x, leftBase.y);
  c.endFill();
};

/**
 * Redraw background in background container given a background
 * object.
 * @param {BackgroundInfo} background - The background to draw.
 */
DrawUtils.prototype._drawBackground = function(background) {
  var bg = background;

  var polys = background.polys.map(function(poly) {
    return this._convertPolyToPixiPoly(poly);
  }, this);

  
  bg.container.clear();
  bg.container.lineStyle(1, bg.color, 1);
  polys.forEach(function(shape) {
    bg.container.drawShape(shape);
  });
};

/**
 * Draw a point, given a point to draw.
 * @private
 * @param {PointInfo} point - The point to draw.
 */
DrawUtils.prototype._drawPoint = function(point) {
  var p = point;

  p.container.clear();
  p.container.lineStyle(1, 0x000000, 1);
  p.container.beginFill(point.color, 1);
  p.container.drawCircle(p.point.x, p.point.y, 3);
  p.container.endFill();
  p.container.visible = true;
};

/**
 * Draw a set of points, given information about them.
 * @private
 * @param {PointsInfo} points - The points to draw.
 */
DrawUtils.prototype._drawPoints = function(points) {
  var p = points;

  p.container.clear();
  p.container.lineStyle(1, 0x000000, 1);
  p.container.beginFill(p.color, 1);
  p.points.forEach(function(point) {
    p.container.drawCircle(point.x, point.y, 3);
  });
  p.container.endFill();
  p.container.visible = true;
};

/**
 * @param {Poly} poly
 */
DrawUtils.prototype._convertPolyToPixiPoly = function(poly) {
  var point_array = poly.points.reduce(function(values, point) {
    return values.concat(point.x, point.y);
  }, []);
  // Add original point back to point array to resolve Pixi.js rendering issue.
  point_array = point_array.concat(point_array[0], point_array[1]);
  return new PIXI.Polygon(point_array);
};

},{}],9:[function(require,module,exports){
/**
 * A point can represent a vertex in a 2d environment or a vector.
 * @constructor
 * @param {number} x - The `x` coordinate of the point.
 * @param {number} y - The `y` coordinate of the point.
 */
Point = function(x, y) {
  this.x = x;
  this.y = y;
};
exports.Point = Point;

/**
 * Convert a point-like object into a point.
 * @param {PointLike} p - The point-like object to convert.
 * @return {Point} - The new point representing the point-like
 *   object.
 */
Point.fromPointLike = function(p) {
  return new Point(p.x, p.y);
};

/**
 * String method for point-like objects.
 * @param {PointLike} p - The point-like object to convert.
 * @return {Point} - The new point representing the point-like
 *   object.
 */
Point.toString = function(p) {
  return "x" + p.x + "y" + p.y;
};

/**
 * Takes a point or scalar and adds slotwise in the case of another
 * point, or to each parameter in the case of a scalar.
 * @param {(Point|number)} - The Point, or scalar, to add to this
 *   point.
 */
Point.prototype.add = function(p) {
  if (typeof p == "number")
    return new Point(this.x + p, this.y + p);
  return new Point(this.x + p.x, this.y + p.y);
};

/**
 * Takes a point or scalar and subtracts slotwise in the case of
 * another point or from each parameter in the case of a scalar.
 * @param {(Point|number)} - The Point, or scalar, to subtract from
 *   this point.
 */
Point.prototype.sub = function(p) {
  if (typeof p == "number")
    return new Point(this.x - p, this.y - p);
  return new Point(this.x - p.x, this.y - p.y);
};

/**
 * Takes a scalar value and multiplies each parameter of the point
 * by the scalar.
 * @param  {number} f - The number to multiple the parameters by.
 * @return {Point} - A new point with the calculated coordinates.
 */
Point.prototype.mul = function(f) {
  return new Point(this.x * f, this.y * f);
};

/**
 * Takes a scalar value and divides each parameter of the point
 * by the scalar.
 * @param  {number} f - The number to divide the parameters by.
 * @return {Point} - A new point with the calculated coordinates.
 */
Point.prototype.div = function(f) {
  return new Point(this.x / f, this.y / f);
};

/**
 * Takes another point and returns a boolean indicating whether the
 * points are equal. Two points are equal if their parameters are
 * equal.
 * @param  {Point} p - The point to check equality against.
 * @return {boolean} - Whether or not the two points are equal.
 */
Point.prototype.eq = function(p) {
  return (this.x == p.x && this.y == p.y);
};

/**
 * Takes another point and returns a boolean indicating whether the
 * points are not equal. Two points are considered not equal if their
 * parameters are not equal.
 * @param  {Point} p - The point to check equality against.
 * @return {boolean} - Whether or not the two points are not equal.
 */
Point.prototype.neq = function(p) {
  return (this.x != p.x || this.y != p.y);
};

// Given another point, returns the dot product.
Point.prototype.dot = function(p) {
  return (this.x * p.x + this.y * p.y);
};

// Given another point, returns the 'cross product', or at least the 2d
// equivalent.
Point.prototype.cross = function(p) {
  return (this.x * p.y - this.y * p.x);
};

// Given another point, returns the distance to that point.
Point.prototype.dist = function(p) {
  var diff = this.sub(p);
  return Math.sqrt(diff.dot(diff));
};

// Given another point, returns the squared distance to that point.
Point.prototype.dist2 = function(p) {
  var diff = this.sub(p);
  return diff.dot(diff);
};

/**
 * Returns true if the point is (0, 0).
 * @return {boolean} - Whether or not the point is (0, 0).
 */
Point.prototype.zero = function() {
  return this.x == 0 && this.y == 0;
};

Point.prototype.len = function() {
  return this.dist(new Point(0, 0));
};

Point.prototype.normalize = function() {
  var n = this.dist(new Point(0, 0));
  if (n > 0) return this.div(n);
  return new Point(0, 0);
};

Point.prototype.toString = function() {
  return 'x' + this.x + 'y' + this.y;
};

/**
 * Return a copy of the point.
 * @return {Point} - The new point.
 */
Point.prototype.clone = function() {
  return new Point(this.x, this.y);
};

/**
 * Edges are used to represent the border between two adjacent
 * polygons.
 * @constructor
 * @param {Point} p1 - The first point of the edge.
 * @param {Point} p2 - The second point of the edge.
 */
Edge = function(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
  this.center = p1.add(p2.sub(p1).div(2));
  this.points = [this.p1, this.center, this.p2];
};
exports.Edge = Edge;

Edge.prototype._CCW = function(p1, p2, p3) {
  a = p1.x; b = p1.y;
  c = p2.x; d = p2.y;
  e = p3.x; f = p3.y;
  return (f - b) * (c - a) > (d - b) * (e - a);
};

/**
 * from http://stackoverflow.com/a/16725715
 * Checks whether this edge intersects the provided edge.
 * @param {Edge} edge - The edge to check intersection for.
 * @return {boolean} - Whether or not the edges intersect.
 */
Edge.prototype.intersects = function(edge) {
  var q1 = edge.p1, q2 = edge.p2;
  if (q1.eq(this.p1) || q1.eq(this.p2) || q2.eq(this.p1) || q2.eq(this.p2)) return false;
  return (this._CCW(this.p1, q1, q2) != this._CCW(this.p2, q1, q2)) && (this._CCW(this.p1, this.p2, q1) != this._CCW(this.p1, this.p2, q2));
};

/**
 * Polygon class.
 * Can be initialized with an array of points.
 * @constructor
 * @param {Array.<Point>} [points] - The points to use to initialize
 *   the poly.
 */
Poly = function(points) {
  if (typeof points == 'undefined') points = false;
  this.hole = false;
  this.points = null;
  this.numpoints = 0;
  if (points) {
    this.numpoints = points.length;
    this.points = points.slice();
  }
};
exports.Poly = Poly;

Poly.prototype.init = function(n) {
  this.points = new Array(n);
  this.numpoints = n;
};

Poly.prototype.update = function() {
  this.numpoints = this.points.length;
};

Poly.prototype.triangle = function(p1, p2, p3) {
  this.init(3);
  this.points[0] = p1;
  this.points[1] = p2;
  this.points[2] = p3;
};

// Takes an index and returns the point at that index, or null.
Poly.prototype.getPoint = function(n) {
  if (this.points && this.numpoints > n)
    return this.points[n];
  return null;
};

// Set a point, fails silently otherwise. TODO: replace with bracket notation.
Poly.prototype.setPoint = function(i, p) {
  if (this.points && this.points.length > i) {
    this.points[i] = p;
  }
};

// Given an index i, return the index of the next point.
Poly.prototype.getNextI = function(i) {
  return (i + 1) % this.numpoints;
};

Poly.prototype.getPrevI = function(i) {
  if (i == 0)
    return (this.numpoints - 1);
  return i - 1;
};

// Returns the signed area of a polygon, if the vertices are given in
// CCW order then the area will be > 0, < 0 otherwise.
Poly.prototype.getArea = function() {
  var area = 0;
  for (var i = 0; i < this.numpoints; i++) {
    var i2 = this.getNextI(i);
    area += this.points[i].x * this.points[i2].y - this.points[i].y * this.points[i2].x;
  }
  return area;
};

Poly.prototype.getOrientation = function() {
  var area = this.getArea();
  if (area > 0) return "CCW";
  if (area < 0) return "CW";
  return 0;
};

Poly.prototype.setOrientation = function(orientation) {
  var current_orientation = this.getOrientation();
  if (current_orientation && (current_orientation !== orientation)) {
    this.invert();
  }
};

Poly.prototype.invert = function() {
  var newpoints = new Array(this.numpoints);
  for (var i = 0; i < this.numpoints; i++) {
    newpoints[i] = this.points[this.numpoints - i - 1];
  }
  this.points = newpoints;
};

Poly.prototype.getCenter = function() {
  var x = this.points.map(function(p) { return p.x });
  var y = this.points.map(function(p) { return p.y });
  var minX = Math.min.apply(null, x);
  var maxX = Math.max.apply(null, x);
  var minY = Math.min.apply(null, y);
  var maxY = Math.max.apply(null, y);
  return new Point((minX + maxX)/2, (minY + maxY)/2);
};

// Adapted from http://stackoverflow.com/a/16283349
Poly.prototype.centroid = function() {
  var x = 0,
      y = 0,
      i,
      j,
      f,
      point1,
      point2;

  for (i = 0, j = this.points.length - 1; i < this.points.length; j = i, i += 1) {
    point1 = this.points[i];
    point2 = this.points[j];
    f = point1.x * point2.y - point2.x * point1.y;
    x += (point1.x + point2.x) * f;
    y += (point1.y + point2.y) * f;
  }

  f = this.getArea() * 3;
  x = Math.abs(x);
  y = Math.abs(y);
  return new Point(x / f, y / f);
};

Poly.prototype.toString = function() {
  var center = this.centroid();
  return "" + center.x + " " + center.y;
};

/**
 * Checks if the given point is contained within the Polygon.
 * Adapted from http://stackoverflow.com/a/8721483
 *
 * @param {Point} p - The point to check.
 * @return {boolean} - Whether or not the point is contained within
 *   the polygon.
 */
Poly.prototype.containsPoint = function(p) {
  var result = false;
  for (var i = 0, j = this.numpoints - 1; i < this.numpoints; j = i++) {
    var p1 = this.points[j], p2 = this.points[i];
    if ((p2.y > p.y) != (p1.y > p.y) &&
        (p.x < (p1.x - p2.x) * (p.y - p2.y) / (p1.y - p2.y) + p2.x)) {
      result = !result;
    }
  }
  return result;
};

/**
 * Clone the given polygon into a new polygon.
 * @return {Poly} - A clone of the polygon.
 */
Poly.prototype.clone = function() {
  return new Poly(this.points.slice().map(function(point) {
    return point.clone();
  }));
};

/**
 * Translate a polygon along a given vector.
 * @param {Point} vec - The vector along which to translate the
 *   polygon.
 * @return {Poly} - The translated polygon.
 */
Poly.prototype.translate = function(vec) {
  return new Poly(this.points.map(function(point) {
    return point.add(vec);
  }));
};

/**
 * Returns an array of edges representing the polygon.
 * @return {Array.<Edge>} - The edges of the polygon.
 */
Poly.prototype.edges = function() {
  if (!this.hasOwnProperty("cached_edges")) {
    this.cached_edges = this.points.map(function(point, i) {
      return new Edge(point, this.points[this.getNextI(i)]);
    }, this);
  }
  return this.cached_edges;
};

/**
 * Naive check if other poly intersects this one, assuming both convex.
 * @param {Poly} poly
 * @return {boolean} - Whether the polygons intersect.
 */
Poly.prototype.intersects = function(poly) {
  var inside = poly.points.some(function(p) {
    return this.containsPoint(p);
  }, this);
  inside = inside || this.points.some(function(p) {
    return poly.containsPoint(p);
  });
  if (inside) {
    return true;
  } else {
    var ownEdges = this.edges();
    var otherEdges = poly.edges();
    var intersect = ownEdges.some(function(ownEdge) {
      return otherEdges.some(function(otherEdge) {
        return ownEdge.intersects(otherEdge);
      });
    });
    return intersect;
  }
};

var util = {};
exports.util = util;

/**
 * Given an array of polygons, returns the one that contains the point.
 * If no polygon is found, null is returned.
 * @param {Point} p - The point to find the polygon for.
 * @param {Array.<Poly>} polys - The polygons to search for the point.
 * @return {?Polygon} - The polygon containing the point.
 */
util.findPolyForPoint = function(p, polys) {
  var i, poly;
  for (i in polys) {
    poly = polys[i];
    if (poly.containsPoint(p)) {
      return poly;
    }
  }
  return null;
};

/**
 * Holds the properties of a collision, if one occurred.
 * @typedef Collision
 * @type {object}
 * @property {boolean} collides - Whether there is a collision.
 * @property {boolean} inside - Whether one object is inside the other.
 * @property {?Point} point - The point of collision, if collision
 *   occurs, and if `inside` is false.
 * @property {?Point} normal - A unit vector normal to the point
 *   of collision, if it occurs and if `inside` is false.
 */
/**
 * If the ray intersects the circle, the distance to the intersection
 * along the ray is returned, otherwise false is returned.
 * @param {Point} p - The start of the ray.
 * @param {Point} ray - Unit vector extending from `p`.
 * @param {Point} c - The center of the circle for the object being
 *   checked for intersection.
 * @param {number} radius - The radius of the circle.
 * @return {Collision} - The collision information.
 */
util.lineCircleIntersection = function(p, ray, c, radius) {
  var collision = {
    collides: false,
    inside: false,
    point: null,
    normal: null
  };
  var vpc = c.sub(p);

  if (vpc.len() <= radius) {
    // Point is inside obstacle.
    collision.collides = true;
    collision.inside = (vpc.len() !== radius);
  } else if (ray.dot(vpc) >= 0) {
    // Circle is ahead of point.
    // Projection of center point onto ray.
    var pc = p.add(ray.mul(ray.dot(vpc)));
    // Length from c to its projection on the ray.
    var len_c_pc = c.sub(pc).len();

    if (len_c_pc <= radius) {
      collision.collides = true;

      // Distance from projected point to intersection.
      var len_intersection = Math.sqrt(len_c_pc * len_c_pc + radius * radius);
      collision.point = pc.sub(ray.mul(len_intersection));
      collision.normal = collision.point.sub(c).normalize();
    }
  }
  return collision;
};

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYnJhZ2kubWluLmpzIiwibm9kZV9tb2R1bGVzL3RhZ3Byby1uYXZtZXNoL2J1aWxkL3JlbGVhc2UvbmF2bWVzaC5qcyIsInNyYy9ib3QuanMiLCJzcmMvYnJhaW4uanMiLCJzcmMvYnJvd3NlckJvdC5qcyIsInNyYy9icm93c2VyR2FtZVN0YXRlLmpzIiwic3JjL2Jyb3dzZXJNb3Zlci5qcyIsInNyYy9kcmF3dXRpbHMuanMiLCJzcmMvZ2VvbWV0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5dEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOWpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiFmdW5jdGlvbihlKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSltb2R1bGUuZXhwb3J0cz1lKCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtdLGUpO2Vsc2V7dmFyIGY7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz9mPXdpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2Y9Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiYoZj1zZWxmKSxmLkJSQUdJPWUoKX19KGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KHsxOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXt2YXIgdXRpbD1fZGVyZXFfKFwidXRpbFwiKTt2YXIgY2FuTG9nPV9kZXJlcV8oXCIuL2JyYWdpL2NhbkxvZ1wiKTt2YXIgVHJhbnNwb3J0cz1fZGVyZXFfKFwiLi9icmFnaS90cmFuc3BvcnRzL1RyYW5zcG9ydHNcIik7dmFyIHRyYW5zcG9ydHM9X2RlcmVxXyhcIi4vYnJhZ2kvdHJhbnNwb3J0c1wiKTt2YXIgU1lNQk9MUz1fZGVyZXFfKFwiLi9icmFnaS9zeW1ib2xzXCIpO3ZhciBMT0dHRVI9e3V0aWw6e30sY2FuTG9nOmNhbkxvZ307TE9HR0VSLnV0aWwuX19zdGFjaz1mdW5jdGlvbigpe3ZhciBzdGFjaz1udWxsO3RyeXt2YXIgb3JpZz1FcnJvci5wcmVwYXJlU3RhY2tUcmFjZTtFcnJvci5wcmVwYXJlU3RhY2tUcmFjZT1mdW5jdGlvbihfLHN0YWNrKXtyZXR1cm4gc3RhY2t9O3ZhciBlcnI9bmV3IEVycm9yO0Vycm9yLmNhcHR1cmVTdGFja1RyYWNlKGVycixhcmd1bWVudHMuY2FsbGVlKTtzdGFjaz1lcnIuc3RhY2s7RXJyb3IucHJlcGFyZVN0YWNrVHJhY2U9b3JpZ31jYXRjaChlKXt9cmV0dXJuIHN0YWNrfTtMT0dHRVIudXRpbC5zeW1ib2xzPVNZTUJPTFM7TE9HR0VSLm9wdGlvbnM9e2dyb3Vwc0VuYWJsZWQ6dHJ1ZSxncm91cHNEaXNhYmxlZDpbXSxzdG9yZVN0YWNrVHJhY2U6ZmFsc2V9O0xPR0dFUi50cmFuc3BvcnRzPW5ldyBUcmFuc3BvcnRzO3ZhciBfZGVmYXVsdFRyYW5zcG9ydHM9W25ldyB0cmFuc3BvcnRzLkNvbnNvbGUoe3Nob3dNZXRhOnRydWUsc2hvd1N0YWNrVHJhY2U6ZmFsc2V9KV07Zm9yKHZhciBpPTA7aTxfZGVmYXVsdFRyYW5zcG9ydHMubGVuZ3RoO2krKyl7TE9HR0VSLnRyYW5zcG9ydHMuYWRkKF9kZWZhdWx0VHJhbnNwb3J0c1tpXSl9TE9HR0VSLnRyYW5zcG9ydENsYXNzZXM9dHJhbnNwb3J0cztMT0dHRVIuYWRkR3JvdXA9ZnVuY3Rpb24gYWRkR3JvdXAoZ3JvdXApe3ZhciBncm91cHNFbmFibGVkPUxPR0dFUi5vcHRpb25zLmdyb3Vwc0VuYWJsZWQ7aWYoZ3JvdXBzRW5hYmxlZD09PXRydWV8fGdyb3Vwc0VuYWJsZWQ9PT1mYWxzZSl7TE9HR0VSLm9wdGlvbnMuZ3JvdXBzRW5hYmxlZD1ncm91cHNFbmFibGVkPVtdfXZhciBpPTAsbGVuPWdyb3Vwc0VuYWJsZWQubGVuZ3RoO2ZvcihpPTA7aTxsZW47aSsrKXtpZihncm91cHNFbmFibGVkW2ldLnRvU3RyaW5nKCk9PT1ncm91cC50b1N0cmluZygpKXtyZXR1cm4gTE9HR0VSfX1ncm91cHNFbmFibGVkLnB1c2goZ3JvdXApO3JldHVybiBMT0dHRVJ9O0xPR0dFUi5yZW1vdmVHcm91cD1mdW5jdGlvbiByZW1vdmVHcm91cChncm91cCl7dmFyIGdyb3Vwc0VuYWJsZWQ9TE9HR0VSLm9wdGlvbnMuZ3JvdXBzRW5hYmxlZDtpZihncm91cHNFbmFibGVkPT09dHJ1ZXx8Z3JvdXBzRW5hYmxlZD09PWZhbHNlKXtMT0dHRVIub3B0aW9ucy5ncm91cHNFbmFibGVkPWdyb3Vwc0VuYWJsZWQ9W119dmFyIGk9MCxsZW49Z3JvdXBzRW5hYmxlZC5sZW5ndGg7dmFyIGdyb3Vwc0VuYWJsZWRXaXRob3V0R3JvdXA9W107Zm9yKGk9MDtpPGxlbjtpKyspe2lmKGdyb3Vwc0VuYWJsZWRbaV0udG9TdHJpbmcoKSE9PWdyb3VwLnRvU3RyaW5nKCkpe2dyb3Vwc0VuYWJsZWRXaXRob3V0R3JvdXAucHVzaChncm91cHNFbmFibGVkW2ldKX19TE9HR0VSLm9wdGlvbnMuZ3JvdXBzRW5hYmxlZD1ncm91cHNFbmFibGVkV2l0aG91dEdyb3VwO3JldHVybiBMT0dHRVJ9O0xPR0dFUi51dGlsLnByaW50PWZ1bmN0aW9uIHByaW50KG1lc3NhZ2UsY29sb3Ipe3JldHVybiBtZXNzYWdlfTtMT0dHRVIubG9nPWZ1bmN0aW9uIGxvZ2dlckxvZyhncm91cCxtZXNzYWdlKXt2YXIgZ3JvdXBzRW5hYmxlZCxncm91cHNEaXNhYmxlZCxjdXJyZW50VHJhbnNwb3J0O3ZhciB0cmFuc3BvcnRGdW5jc1RvQ2FsbD1bXTtmb3IodmFyIHRyYW5zcG9ydCBpbiBMT0dHRVIudHJhbnNwb3J0cy5fdHJhbnNwb3J0cyl7Y3VycmVudFRyYW5zcG9ydD1MT0dHRVIudHJhbnNwb3J0cy5fdHJhbnNwb3J0c1t0cmFuc3BvcnRdO2dyb3Vwc0VuYWJsZWQ9TE9HR0VSLm9wdGlvbnMuZ3JvdXBzRW5hYmxlZDtncm91cHNEaXNhYmxlZD1MT0dHRVIub3B0aW9ucy5ncm91cHNEaXNhYmxlZDtpZihjdXJyZW50VHJhbnNwb3J0Lmdyb3Vwc0VuYWJsZWQhPT11bmRlZmluZWQpe2dyb3Vwc0VuYWJsZWQ9Y3VycmVudFRyYW5zcG9ydC5ncm91cHNFbmFibGVkfWlmKGN1cnJlbnRUcmFuc3BvcnQuZ3JvdXBzRGlzYWJsZWQhPT11bmRlZmluZWQpe2dyb3Vwc0Rpc2FibGVkPWN1cnJlbnRUcmFuc3BvcnQuZ3JvdXBzRGlzYWJsZWR9aWYoY2FuTG9nKGdyb3VwLGdyb3Vwc0VuYWJsZWQsZ3JvdXBzRGlzYWJsZWQpKXt0cmFuc3BvcnRGdW5jc1RvQ2FsbC5wdXNoKGN1cnJlbnRUcmFuc3BvcnQpfX1pZih0cmFuc3BvcnRGdW5jc1RvQ2FsbC5sZW5ndGg8MSl7aWYoIUxPR0dFUi5vcHRpb25zLnN0b3JlQWxsSGlzdG9yeSl7cmV0dXJuIGZhbHNlfX12YXIgZXh0cmFBcmdzPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywyKTt2YXIgbG9nZ2VkT2JqZWN0PXt9O3ZhciBjYWxsZXI9bnVsbDtpZihMT0dHRVIub3B0aW9ucy5zdG9yZVN0YWNrVHJhY2Upe2NhbGxlcj1cImdsb2JhbCBzY29wZVwiO2lmKGxvZ2dlckxvZy5jYWxsZXImJmxvZ2dlckxvZy5jYWxsZXIubmFtZSl7Y2FsbGVyPWxvZ2dlckxvZy5jYWxsZXIubmFtZX1lbHNlIGlmKChsb2dnZXJMb2cuY2FsbGVyK1wiXCIpLmluZGV4T2YoXCJmdW5jdGlvbiAoKVwiKT09PTApe2NhbGxlcj1cImFub255bW91cyBmdW5jdGlvblwifX1sb2dnZWRPYmplY3QucHJvcGVydGllcz17fTtsb2dnZWRPYmplY3Qub3JpZ2luYWxBcmdzPVtdO2Zvcih2YXIgaT0wO2k8ZXh0cmFBcmdzLmxlbmd0aDtpKyspe2lmKCEoZXh0cmFBcmdzW2ldaW5zdGFuY2VvZiBBcnJheSkmJnR5cGVvZiBleHRyYUFyZ3NbaV09PT1cIm9iamVjdFwiKXtmb3IodmFyIGtleSBpbiBleHRyYUFyZ3NbaV0pe2xvZ2dlZE9iamVjdC5wcm9wZXJ0aWVzW2tleV09ZXh0cmFBcmdzW2ldW2tleV19fWVsc2V7bG9nZ2VkT2JqZWN0LnByb3BlcnRpZXNbXCJfYXJndW1lbnRcIitpXT1leHRyYUFyZ3NbaV19bG9nZ2VkT2JqZWN0Lm9yaWdpbmFsQXJncy5wdXNoKGV4dHJhQXJnc1tpXSl9bG9nZ2VkT2JqZWN0Lm1ldGE9e2NhbGxlcjpjYWxsZXIsZGF0ZToobmV3IERhdGUpLnRvSlNPTigpfTtsb2dnZWRPYmplY3QudW5peFRpbWVzdGFtcD0obmV3IERhdGUpLmdldFRpbWUoKS8xZTM7dmFyIHN0YWNrPWZhbHNlO2lmKExPR0dFUi5vcHRpb25zLnN0b3JlU3RhY2tUcmFjZSl7c3RhY2s9TE9HR0VSLnV0aWwuX19zdGFjaygpO2lmKHN0YWNrKXt2YXIgc3RhY2tMZW5ndGg9c3RhY2subGVuZ3RoO3ZhciB0cmFjZT1bXTtmb3IoaT0xO2k8c3RhY2subGVuZ3RoO2krKyl7dHJhY2UucHVzaChzdGFja1tpXStcIlwiKX1sb2dnZWRPYmplY3QubWV0YS5maWxlPXN0YWNrWzFdLmdldEZpbGVOYW1lKCk7bG9nZ2VkT2JqZWN0Lm1ldGEubGluZT1zdGFja1sxXS5nZXRMaW5lTnVtYmVyKCk7bG9nZ2VkT2JqZWN0Lm1ldGEuY29sdW1uPXN0YWNrWzFdLmdldENvbHVtbk51bWJlcigpO2xvZ2dlZE9iamVjdC5tZXRhLnRyYWNlPXRyYWNlfX1sb2dnZWRPYmplY3QuZ3JvdXA9Z3JvdXA7bG9nZ2VkT2JqZWN0Lm1lc3NhZ2U9bWVzc2FnZTtmb3IoaT0wLGxlbj10cmFuc3BvcnRGdW5jc1RvQ2FsbC5sZW5ndGg7aTxsZW47aSsrKXt0cmFuc3BvcnRGdW5jc1RvQ2FsbFtpXS5sb2cuY2FsbCh0cmFuc3BvcnRGdW5jc1RvQ2FsbFtpXSxsb2dnZWRPYmplY3QpfX07bW9kdWxlLmV4cG9ydHM9TE9HR0VSfSx7XCIuL2JyYWdpL2NhbkxvZ1wiOjIsXCIuL2JyYWdpL3N5bWJvbHNcIjozLFwiLi9icmFnaS90cmFuc3BvcnRzXCI6NCxcIi4vYnJhZ2kvdHJhbnNwb3J0cy9UcmFuc3BvcnRzXCI6Nyx1dGlsOjEyfV0sMjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7ZnVuY3Rpb24gY2FuTG9nKGdyb3VwLGdyb3Vwc0VuYWJsZWQsZ3JvdXBzRGlzYWJsZWQpe2lmKGdyb3Vwc0VuYWJsZWQ9PT11bmRlZmluZWQpe2dyb3Vwc0VuYWJsZWQ9dHJ1ZX12YXIgaSxsZW47dmFyIGNhbkxvZ0l0PXRydWU7aWYoZ3JvdXBzRW5hYmxlZD09PXRydWUpe2NhbkxvZ0l0PXRydWV9ZWxzZSBpZihncm91cHNFbmFibGVkPT09ZmFsc2V8fGdyb3Vwc0VuYWJsZWQ9PT1udWxsKXtjYW5Mb2dJdD1mYWxzZX1lbHNlIGlmKGdyb3Vwc0VuYWJsZWQgaW5zdGFuY2VvZiBBcnJheSl7Y2FuTG9nSXQ9ZmFsc2U7Zm9yKGk9MCxsZW49Z3JvdXBzRW5hYmxlZC5sZW5ndGg7aTxsZW47aSsrKXtpZihncm91cHNFbmFibGVkW2ldaW5zdGFuY2VvZiBSZWdFeHApe2lmKGdyb3Vwc0VuYWJsZWRbaV0udGVzdChncm91cCkpe2NhbkxvZ0l0PXRydWU7YnJlYWt9fWVsc2UgaWYoZ3JvdXAuaW5kZXhPZihncm91cHNFbmFibGVkW2ldKT09PTApe2NhbkxvZ0l0PXRydWU7YnJlYWt9fX1pZihncm91cC5pbmRleE9mKFwiZXJyb3JcIik9PT0wfHxncm91cC5pbmRleE9mKFwid2FyblwiKT09PTApe2NhbkxvZ0l0PXRydWV9aWYoZ3JvdXBzRGlzYWJsZWQmJmdyb3Vwc0Rpc2FibGVkIGluc3RhbmNlb2YgQXJyYXkpe2ZvcihpPTAsbGVuPWdyb3Vwc0Rpc2FibGVkLmxlbmd0aDtpPGxlbjtpKyspe2lmKGdyb3Vwc0Rpc2FibGVkW2ldaW5zdGFuY2VvZiBSZWdFeHApe2lmKGdyb3Vwc0Rpc2FibGVkW2ldLnRlc3QoZ3JvdXApKXtjYW5Mb2dJdD1mYWxzZTticmVha319ZWxzZSBpZihncm91cC5pbmRleE9mKGdyb3Vwc0Rpc2FibGVkW2ldKT09PTApe2NhbkxvZ0l0PWZhbHNlO2JyZWFrfX19cmV0dXJuIGNhbkxvZ0l0fW1vZHVsZS5leHBvcnRzPWNhbkxvZ30se31dLDM6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPXtzdWNjZXNzOlwi4pyU77iOIFwiLGVycm9yOlwi4pyYIFwiLHdhcm46XCLimpEgXCIsYXJyb3c6XCLinqQgXCIsc3RhcjpcIuKYhiBcIixib3g6XCLimJAgXCIsYm94U3VjY2VzczpcIuKYke+4jiBcIixib3hFcnJvcjpcIuKYkiBcIixjaXJjbGU6XCLil68gXCIsY2lyY2xlRmlsbGVkOlwi4peJIFwiLGFzdGVyaXNrOlwi4pyiXCIsZmxvcmFsOlwi4p2nXCIsc25vd2ZsYWtlOlwi4p2E77iOXCIsZm91ckRpYW1vbmQ6XCLinZZcIixzcGFkZTpcIuKZoO+4jlwiLGNsdWI6XCLimaPvuI5cIixoZWFydDpcIuKZpe+4jlwiLGRpYW1vbmQ6XCLimabvuI5cIixxdWVlbjpcIuKZm1wiLHJvb2s6XCLimZxcIixwYXduOlwi4pmfXCIsYXRvbTpcIuKam1wifX0se31dLDQ6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe3ZhciBmaWxlcz1fZGVyZXFfKFwiLi90cmFuc3BvcnRzL2luZGV4XCIpO3ZhciB0cmFuc3BvcnRzPXt9O2Zvcih2YXIgZmlsZSBpbiBmaWxlcyl7dHJhbnNwb3J0c1tmaWxlXT1maWxlc1tmaWxlXX1tb2R1bGUuZXhwb3J0cz10cmFuc3BvcnRzfSx7XCIuL3RyYW5zcG9ydHMvaW5kZXhcIjo4fV0sNTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7dmFyIFNZTUJPTFM9X2RlcmVxXyhcIi4uL3N5bWJvbHNcIik7aWYod2luZG93LmNvbnNvbGUmJndpbmRvdy5jb25zb2xlLmxvZyl7aWYodHlwZW9mIHdpbmRvdy5jb25zb2xlLmxvZyE9PVwiZnVuY3Rpb25cIil7d2luZG93LmNvbnNvbGUubG9nPWZ1bmN0aW9uKCl7fX19ZWxzZXt3aW5kb3cuY29uc29sZT17fTt3aW5kb3cuY29uc29sZS5sb2c9ZnVuY3Rpb24oKXt9fUdST1VQX0NPTE9SUz1bW1wiIzMxODJiZFwiLFwiI2ZmZmZmZlwiLFwiIzIyNTU4OFwiXSxbXCIjZjM4NjMwXCIsXCIjZmZmZmZmXCJdLFtcIiNlMGU0Y2NcIixcIiMwMDAwMDBcIixcIiNjOGNiYjZcIl0sW1wiIzhjNTEwYVwiLFwiI2ZmZmZmZlwiXSxbXCIjMzU5NzhmXCIsXCIjZmZmZmZmXCIsXCIjMTM3NTZkXCJdLFtcIiNjNTFiN2RcIixcIiNmZmZmZmZcIl0sW1wiI2M2ZGJlZlwiLFwiIzAwMDAwMFwiXSxbXCIjYWY4ZGMzXCIsXCIjMDAwMDAwXCJdLFtcIiM1NDMwMDVcIixcIiNmZmZmZmZcIixcIiMzMjEwMDJcIl0sW1wiIzdmYmY3YlwiLFwiIzAwMDAwMFwiXSxbXCIjZGZjMjdkXCIsXCIjMDAwMDAwXCIsXCIjYmRhMDViXCJdLFtcIiNmNWY1ZjVcIixcIiMwMDAwMDBcIl0sW1wiI2U5YTNjOVwiLFwiIzAwMDAwMFwiXSxbXCIjNTkzMjNDXCIsXCIjZmZmZmZmXCJdLFtcIiM2NmMyYTVcIixcIiMwMDAwMDBcIl0sW1wiI2Y2ZThjM1wiLFwiIzAwMDAwMFwiXSxbXCIjNjA2MDYwXCIsXCIjZjBmMGYwXCJdLFtcIiM4YzUxMGFcIixcIiNmZmZmZmZcIl0sW1wiIzgwY2RjMVwiLFwiIzAwMDAwMFwiXSxbXCIjNTQyNzg4XCIsXCIjZmZmZmZmXCJdLFtcIiNGQjhBRkVcIixcIiMzNDM0MzRcIl0sW1wiIzAwM2MzMFwiLFwiI2ZmZmZmZlwiXSxbXCIjZTZmNTk4XCIsXCIjMDAwMDAwXCJdLFtcIiNjN2VhZTVcIixcIiMwMDAwMDBcIl0sW1wiIzAwMDAwMFwiLFwiI2YwZjBmMFwiXSxbXCIjQzNGRjBFXCIsXCIjMzQzNDM0XCJdXTtPVkVSRkxPV19TWU1CT0xTPVtcImFzdGVyaXNrXCIsXCJmbG9yYWxcIixcInNub3dmbGFrZVwiLFwiZm91ckRpYW1vbmRcIixcInNwYWRlXCIsXCJjbHViXCIsXCJoZWFydFwiLFwiZGlhbW9uZFwiLFwicXVlZW5cIixcInJvb2tcIixcInBhd25cIixcImF0b21cIl07dmFyIEJBU0VfQ1NTPVwicGFkZGluZzogMnB4OyBtYXJnaW46MnB4OyBsaW5lLWhlaWdodDogMS44ZW07XCI7dmFyIE1FVEFfU1RZTEU9QkFTRV9DU1MrXCJmb250LXNpemU6MC45ZW07IGNvbG9yOiAjY2RjZGNkOyBwYWRkaW5nLWxlZnQ6MzBweDtcIjtmdW5jdGlvbiBUcmFuc3BvcnRDb25zb2xlKG9wdGlvbnMpe29wdGlvbnM9b3B0aW9uc3x8e307dGhpcy5ncm91cHNFbmFibGVkPW9wdGlvbnMuZ3JvdXBzRW5hYmxlZDt0aGlzLmdyb3Vwc0Rpc2FibGVkPW9wdGlvbnMuZ3JvdXBzRGlzYWJsZWQ7dGhpcy5hZGRMaW5lQnJlYWs9b3B0aW9ucy5hZGRMaW5lQnJlYWshPT11bmRlZmluZWQ/b3B0aW9ucy5hZGRMaW5lQnJlYWs6ZmFsc2U7dGhpcy5zaG93TWV0YT1vcHRpb25zLnNob3dNZXRhIT09dW5kZWZpbmVkP29wdGlvbnMuc2hvd01ldGE6ZmFsc2U7dGhpcy5zaG93U3RhY2tUcmFjZT1vcHRpb25zLnNob3dTdGFja1RyYWNlIT09dW5kZWZpbmVkP29wdGlvbnMuc2hvd1N0YWNrVHJhY2U6dHJ1ZTt0aGlzLnNob3dDb2xvcnM9b3B0aW9ucy5zaG93Q29sb3JzPT09dW5kZWZpbmVkP3RydWU6b3B0aW9ucy5zaG93Q29sb3I7dGhpcy5fZm91bmRDb2xvcnM9W107dGhpcy5fY29sb3JEaWN0PXtlcnJvcjpCQVNFX0NTUytcImJhY2tncm91bmQ6ICNmZjAwMDA7IGNvbG9yOiAjZmZmZmZmOyBmb250LXN0eWxlOiBib2xkOyBib3JkZXI6IDRweCBzb2xpZCAjY2MwMDAwO1wiLHdhcm46QkFTRV9DU1MrXCJwYWRkaW5nOiAycHg7IGJhY2tncm91bmQ6ICNmZmZmMDA7IGNvbG9yOiAjMzQzNDM0OyBmb250LXN0eWxlOiBib2xkOyBib3JkZXI6IDRweCBzb2xpZCAjY2NjYzAwO1wifTt0aGlzLmN1clN5bWJvbEluZGV4PTA7cmV0dXJuIHRoaXN9VHJhbnNwb3J0Q29uc29sZS5wcm90b3R5cGUuZ2V0Q29sb3I9ZnVuY3Rpb24gZ2V0Q29sb3IoZ3JvdXApe3ZhciBjb2xvcj1cIlwiO3ZhciBiYXNlQ29sb3I9XCJcIjt2YXIgY3VyU3ltYm9sO3ZhciBjc3NTdHJpbmc9XCJcIjtncm91cD1ncm91cC5zcGxpdChcIjpcIilbMF07aWYodGhpcy5fY29sb3JEaWN0W2dyb3VwXSl7cmV0dXJuIHRoaXMuX2NvbG9yRGljdFtncm91cF19aWYodGhpcy5fZm91bmRDb2xvcnMubGVuZ3RoPj1HUk9VUF9DT0xPUlMubGVuZ3RoKXtjb2xvcj1HUk9VUF9DT0xPUlNbdGhpcy5fZm91bmRDb2xvcnMubGVuZ3RoJUdST1VQX0NPTE9SUy5sZW5ndGhdO2Jhc2VDb2xvcj1jb2xvcjtjc3NTdHJpbmcrPVwiZm9udC1zdHlsZTogaXRhbGljO1wifWVsc2V7Y29sb3I9R1JPVVBfQ09MT1JTW3RoaXMuX2ZvdW5kQ29sb3JzLmxlbmd0aF19dmFyIGJvcmRlckNvbG9yPWNvbG9yWzJdO2lmKCFjb2xvclsyXSl7Ym9yZGVyQ29sb3I9XCIjXCI7Zm9yKHZhciBpPTE7aTxjb2xvclswXS5sZW5ndGg7aSsrKXtib3JkZXJDb2xvcis9TWF0aC5tYXgoMCxwYXJzZUludChjb2xvclswXVtpXSwxNiktMikudG9TdHJpbmcoMTYpfX1jc3NTdHJpbmcrPUJBU0VfQ1NTK1wiYmFja2dyb3VuZDogXCIrY29sb3JbMF0rXCI7XCIrXCJib3JkZXI6IDFweCBzb2xpZCBcIitib3JkZXJDb2xvcitcIjtcIitcImNvbG9yOiBcIitjb2xvclsxXStcIjtcIjt0aGlzLl9mb3VuZENvbG9ycy5wdXNoKGNvbG9yKTt0aGlzLl9jb2xvckRpY3RbZ3JvdXBdPWNzc1N0cmluZztyZXR1cm4gY3NzU3RyaW5nfTtUcmFuc3BvcnRDb25zb2xlLnByb3RvdHlwZS5uYW1lPVwiQ29uc29sZVwiO1RyYW5zcG9ydENvbnNvbGUucHJvdG90eXBlLmxvZz1mdW5jdGlvbiB0cmFuc3BvcnRDb25zb2xlTG9nKGxvZ2dlZE9iamVjdCl7dmFyIGNvbnNvbGVNZXNzYWdlPVwiXCI7aWYodGhpcy5zaG93Q29sb3JzKXtjb25zb2xlTWVzc2FnZSs9XCIlY1wifWNvbnNvbGVNZXNzYWdlKz1cIlsgXCIrbG9nZ2VkT2JqZWN0Lmdyb3VwK1wiIFwiK1wiIF0gXHRcIjtjb25zb2xlTWVzc2FnZSs9bG9nZ2VkT2JqZWN0Lm1lc3NhZ2UrXCIgXHRcIjtpZih0aGlzLmFkZExpbmVCcmVhayl7Y29uc29sZU1lc3NhZ2UrPVwiXFxuXCJ9dmFyIHRvTG9nQXJyYXk9W107dG9Mb2dBcnJheS5wdXNoKGNvbnNvbGVNZXNzYWdlKTtpZih0aGlzLnNob3dDb2xvcnMpe3RvTG9nQXJyYXkucHVzaCh0aGlzLmdldENvbG9yKGxvZ2dlZE9iamVjdC5ncm91cCkpfXRvTG9nQXJyYXk9dG9Mb2dBcnJheS5jb25jYXQobG9nZ2VkT2JqZWN0Lm9yaWdpbmFsQXJncyk7Y29uc29sZS5sb2cuYXBwbHkoY29uc29sZSx0b0xvZ0FycmF5KTt2YXIgbWV0YUNvbnNvbGVNZXNzYWdlPVwiXCI7dmFyIG1ldGFMb2dBcnJheT1bXTtpZih0aGlzLnNob3dNZXRhKXtpZih0aGlzLnNob3dDb2xvcnMpe21ldGFDb25zb2xlTWVzc2FnZSs9XCIlY1wifW1ldGFDb25zb2xlTWVzc2FnZSs9KG5ldyBEYXRlKS50b0pTT04oKStcIiBcdCBcdCBcIjtpZihsb2dnZWRPYmplY3QubWV0YS5jYWxsZXIpe21ldGFDb25zb2xlTWVzc2FnZSs9XCJjYWxsZXI6IFwiK2xvZ2dlZE9iamVjdC5tZXRhLmNhbGxlcitcIiBcdCBcdCBcIn1pZihsb2dnZWRPYmplY3QubWV0YS5maWxlJiZsb2dnZWRPYmplY3QubWV0YS5saW5lKXttZXRhQ29uc29sZU1lc3NhZ2UrPWxvZ2dlZE9iamVjdC5tZXRhLmZpbGUrXCI6XCIrbG9nZ2VkT2JqZWN0Lm1ldGEubGluZStcIjpcIitsb2dnZWRPYmplY3QubWV0YS5jb2x1bW4rXCJcIn19aWYodGhpcy5zaG93TWV0YSYmdGhpcy5zaG93U3RhY2tUcmFjZSYmbG9nZ2VkT2JqZWN0Lm1ldGEudHJhY2Upe21ldGFDb25zb2xlTWVzc2FnZSs9XCJcXG5cIitcIihTdGFjayBUcmFjZSlcIitcIlxcblwiO2ZvcihpPTA7aTxsb2dnZWRPYmplY3QubWV0YS50cmFjZS5sZW5ndGg7aSsrKXttZXRhQ29uc29sZU1lc3NhZ2UrPVwiXHRcIitsb2dnZWRPYmplY3QubWV0YS50cmFjZVtpXStcIlxcblwifX1pZih0aGlzLnNob3dNZXRhJiZ0aGlzLnNob3dDb2xvcnMpe21ldGFMb2dBcnJheS5wdXNoKG1ldGFDb25zb2xlTWVzc2FnZSk7bWV0YUxvZ0FycmF5LnB1c2goTUVUQV9TVFlMRSl9aWYobWV0YUxvZ0FycmF5Lmxlbmd0aD4wKXtjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLG1ldGFMb2dBcnJheSl9cmV0dXJuIHRoaXN9O21vZHVsZS5leHBvcnRzPVRyYW5zcG9ydENvbnNvbGV9LHtcIi4uL3N5bWJvbHNcIjozfV0sNjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7ZnVuY3Rpb24gVHJhbnNwb3J0SGlzdG9yeShvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O3RoaXMuZ3JvdXBzRW5hYmxlZD1vcHRpb25zLmdyb3Vwc0VuYWJsZWQ7dGhpcy5ncm91cHNEaXNhYmxlZD1vcHRpb25zLmdyb3Vwc0Rpc2FibGVkO3RoaXMuc3RvcmVFdmVyeXRoaW5nPWZhbHNlO2lmKG9wdGlvbnMuc3RvcmVFdmVyeXRoaW5nPT09dHJ1ZSl7dGhpcy5zdG9yZUV2ZXJ5dGhpbmc9dHJ1ZTt0aGlzLmdyb3Vwc0VuYWJsZWQ9dHJ1ZX10aGlzLmhpc3RvcnlTaXplPW9wdGlvbnMuaGlzdG9yeVNpemUhPT11bmRlZmluZWQ/b3B0aW9ucy5oaXN0b3J5U2l6ZToyMDA7dGhpcy5oaXN0b3J5PXt9O3JldHVybiB0aGlzfVRyYW5zcG9ydEhpc3RvcnkucHJvdG90eXBlLm5hbWU9XCJIaXN0b3J5XCI7VHJhbnNwb3J0SGlzdG9yeS5wcm90b3R5cGUubG9nPWZ1bmN0aW9uIHRyYW5zcG9ydEhpc3RvcnlMb2cobG9nZ2VkT2JqZWN0KXt2YXIgZ3JvdXA9bG9nZ2VkT2JqZWN0Lmdyb3VwLnNwbGl0KFwiOlwiKVswXTtpZih0aGlzLmhpc3RvcnlbZ3JvdXBdPT09dW5kZWZpbmVkKXt0aGlzLmhpc3RvcnlbZ3JvdXBdPVtdfXRoaXMuaGlzdG9yeVtncm91cF0ucHVzaChsb2dnZWRPYmplY3QpO2lmKHRoaXMuaGlzdG9yeVNpemU+MCYmdGhpcy5oaXN0b3J5W2dyb3VwXS5sZW5ndGg+dGhpcy5oaXN0b3J5U2l6ZSl7dGhpcy5oaXN0b3J5W2dyb3VwXS5zaGlmdCgpfXJldHVybiB0aGlzfTttb2R1bGUuZXhwb3J0cz1UcmFuc3BvcnRIaXN0b3J5fSx7fV0sNzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7ZnVuY3Rpb24gVHJhbnNwb3J0cygpe3RoaXMuX3RyYW5zcG9ydHM9e307dGhpcy5fdHJhbnNwb3J0Q291bnQ9e307cmV0dXJuIHRoaXN9VHJhbnNwb3J0cy5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uIGdldCh0cmFuc3BvcnROYW1lKXt2YXIgcmV0dXJuZWRUcmFuc3BvcnRPYmplY3RzPW5ldyBBcnJheTtmb3IodmFyIGtleSBpbiB0aGlzLl90cmFuc3BvcnRzKXtpZihrZXkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRyYW5zcG9ydE5hbWUudG9Mb3dlckNhc2UoKSk+LTEpe3JldHVybmVkVHJhbnNwb3J0T2JqZWN0cy5wdXNoKHRoaXMuX3RyYW5zcG9ydHNba2V5XSl9fXJldHVybmVkVHJhbnNwb3J0T2JqZWN0cy5wcm9wZXJ0eT1mdW5jdGlvbiB0cmFuc3BvcnRQcm9wZXJ0eShrZXlPck9iamVjdCx2YWx1ZSl7dmFyIGk9MDt2YXIgbGVuPXRoaXMubGVuZ3RoO2lmKHR5cGVvZiBrZXlPck9iamVjdD09PVwic3RyaW5nXCImJnZhbHVlPT09dW5kZWZpbmVkKXt2YXIgdmFscz1bXTtmb3IoaT0wO2k8bGVuO2krKyl7dmFscy5wdXNoKHRoaXNbaV1ba2V5T3JPYmplY3RdKX1yZXR1cm4gdmFsc31lbHNlIGlmKHR5cGVvZiBrZXlPck9iamVjdD09PVwic3RyaW5nXCImJnZhbHVlIT09dW5kZWZpbmVkKXtmb3IoaT0wO2k8bGVuO2krKyl7dGhpc1tpXVtrZXlPck9iamVjdF09dmFsdWV9fWVsc2UgaWYodHlwZW9mIGtleU9yT2JqZWN0PT09XCJvYmplY3RcIil7Zm9yKGk9MDtpPGxlbjtpKyspe2Zvcih2YXIga2V5TmFtZSBpbiBrZXlPck9iamVjdCl7dGhpc1tpXVtrZXlOYW1lXT1rZXlPck9iamVjdFtrZXlOYW1lXX19fXJldHVybiB0aGlzfTtyZXR1cm4gcmV0dXJuZWRUcmFuc3BvcnRPYmplY3RzfTtUcmFuc3BvcnRzLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24gYWRkKHRyYW5zcG9ydCl7aWYodGhpcy5fdHJhbnNwb3J0Q291bnRbdHJhbnNwb3J0Lm5hbWVdPT09dW5kZWZpbmVkKXt0aGlzLl90cmFuc3BvcnRDb3VudFt0cmFuc3BvcnQubmFtZV09MTt0aGlzLl90cmFuc3BvcnRzW3RyYW5zcG9ydC5uYW1lXT10cmFuc3BvcnR9ZWxzZXt0aGlzLl90cmFuc3BvcnRDb3VudFt0cmFuc3BvcnQubmFtZV0rPTE7dGhpcy5fdHJhbnNwb3J0c1t0cmFuc3BvcnQubmFtZStcIlwiKyh0aGlzLl90cmFuc3BvcnRDb3VudFt0cmFuc3BvcnQubmFtZV0tMSldPXRyYW5zcG9ydH1yZXR1cm4gdGhpc307VHJhbnNwb3J0cy5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uIHJlbW92ZSh0cmFuc3BvcnROYW1lLGluZGV4KXt0cmFuc3BvcnROYW1lPXRyYW5zcG9ydE5hbWU7aWYodHJhbnNwb3J0TmFtZS5uYW1lKXt0cmFuc3BvcnROYW1lPXRyYW5zcG9ydE5hbWUubmFtZX1mb3IodmFyIGtleSBpbiB0aGlzLl90cmFuc3BvcnRzKXtpZihpbmRleCE9PXVuZGVmaW5lZCl7aWYodHJhbnNwb3J0TmFtZStcIlwiK2luZGV4PT09a2V5KXtkZWxldGUgdGhpcy5fdHJhbnNwb3J0c1trZXldfX1lbHNle2lmKGtleS5pbmRleE9mKHRyYW5zcG9ydE5hbWUpPi0xKXtkZWxldGUgdGhpcy5fdHJhbnNwb3J0c1trZXldfX19cmV0dXJuIHRoaXN9O1RyYW5zcG9ydHMucHJvdG90eXBlLmVtcHR5PWZ1bmN0aW9uIGVtcHR5KCl7Zm9yKHZhciBrZXkgaW4gdGhpcy5fdHJhbnNwb3J0cyl7ZGVsZXRlIHRoaXMuX3RyYW5zcG9ydHNba2V5XX1yZXR1cm4gdGhpc307bW9kdWxlLmV4cG9ydHM9VHJhbnNwb3J0c30se31dLDg6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzLkNvbnNvbGU9X2RlcmVxXyhcIi4vQ29uc29sZVwiKTttb2R1bGUuZXhwb3J0cy5IaXN0b3J5PV9kZXJlcV8oXCIuL0hpc3RvcnlcIil9LHtcIi4vQ29uc29sZVwiOjUsXCIuL0hpc3RvcnlcIjo2fV0sOTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7aWYodHlwZW9mIE9iamVjdC5jcmVhdGU9PT1cImZ1bmN0aW9uXCIpe21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uIGluaGVyaXRzKGN0b3Isc3VwZXJDdG9yKXtjdG9yLnN1cGVyXz1zdXBlckN0b3I7Y3Rvci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6Y3RvcixlbnVtZXJhYmxlOmZhbHNlLHdyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWV9fSl9fWVsc2V7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24gaW5oZXJpdHMoY3RvcixzdXBlckN0b3Ipe2N0b3Iuc3VwZXJfPXN1cGVyQ3Rvcjt2YXIgVGVtcEN0b3I9ZnVuY3Rpb24oKXt9O1RlbXBDdG9yLnByb3RvdHlwZT1zdXBlckN0b3IucHJvdG90eXBlO2N0b3IucHJvdG90eXBlPW5ldyBUZW1wQ3RvcjtjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1jdG9yfX19LHt9XSwxMDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7dmFyIHByb2Nlc3M9bW9kdWxlLmV4cG9ydHM9e307cHJvY2Vzcy5uZXh0VGljaz1mdW5jdGlvbigpe3ZhciBjYW5TZXRJbW1lZGlhdGU9dHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCImJndpbmRvdy5zZXRJbW1lZGlhdGU7dmFyIGNhblBvc3Q9dHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCImJndpbmRvdy5wb3N0TWVzc2FnZSYmd2luZG93LmFkZEV2ZW50TGlzdGVuZXI7aWYoY2FuU2V0SW1tZWRpYXRlKXtyZXR1cm4gZnVuY3Rpb24oZil7cmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZil9fWlmKGNhblBvc3Qpe3ZhciBxdWV1ZT1bXTt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIixmdW5jdGlvbihldil7dmFyIHNvdXJjZT1ldi5zb3VyY2U7aWYoKHNvdXJjZT09PXdpbmRvd3x8c291cmNlPT09bnVsbCkmJmV2LmRhdGE9PT1cInByb2Nlc3MtdGlja1wiKXtldi5zdG9wUHJvcGFnYXRpb24oKTtpZihxdWV1ZS5sZW5ndGg+MCl7dmFyIGZuPXF1ZXVlLnNoaWZ0KCk7Zm4oKX19fSx0cnVlKTtyZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pe3F1ZXVlLnB1c2goZm4pO3dpbmRvdy5wb3N0TWVzc2FnZShcInByb2Nlc3MtdGlja1wiLFwiKlwiKX19cmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKXtzZXRUaW1lb3V0KGZuLDApfX0oKTtwcm9jZXNzLnRpdGxlPVwiYnJvd3NlclwiO3Byb2Nlc3MuYnJvd3Nlcj10cnVlO3Byb2Nlc3MuZW52PXt9O3Byb2Nlc3MuYXJndj1bXTtmdW5jdGlvbiBub29wKCl7fXByb2Nlc3Mub249bm9vcDtwcm9jZXNzLmFkZExpc3RlbmVyPW5vb3A7cHJvY2Vzcy5vbmNlPW5vb3A7cHJvY2Vzcy5vZmY9bm9vcDtwcm9jZXNzLnJlbW92ZUxpc3RlbmVyPW5vb3A7cHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnM9bm9vcDtwcm9jZXNzLmVtaXQ9bm9vcDtwcm9jZXNzLmJpbmRpbmc9ZnVuY3Rpb24obmFtZSl7dGhyb3cgbmV3IEVycm9yKFwicHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWRcIil9O3Byb2Nlc3MuY3dkPWZ1bmN0aW9uKCl7cmV0dXJuXCIvXCJ9O3Byb2Nlc3MuY2hkaXI9ZnVuY3Rpb24oZGlyKXt0aHJvdyBuZXcgRXJyb3IoXCJwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWRcIil9fSx7fV0sMTE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uIGlzQnVmZmVyKGFyZyl7cmV0dXJuIGFyZyYmdHlwZW9mIGFyZz09PVwib2JqZWN0XCImJnR5cGVvZiBhcmcuY29weT09PVwiZnVuY3Rpb25cIiYmdHlwZW9mIGFyZy5maWxsPT09XCJmdW5jdGlvblwiJiZ0eXBlb2YgYXJnLnJlYWRVSW50OD09PVwiZnVuY3Rpb25cIn19LHt9XSwxMjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHByb2Nlc3MsZ2xvYmFsKXt2YXIgZm9ybWF0UmVnRXhwPS8lW3NkaiVdL2c7ZXhwb3J0cy5mb3JtYXQ9ZnVuY3Rpb24oZil7aWYoIWlzU3RyaW5nKGYpKXt2YXIgb2JqZWN0cz1bXTtmb3IodmFyIGk9MDtpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXtvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKX1yZXR1cm4gb2JqZWN0cy5qb2luKFwiIFwiKX12YXIgaT0xO3ZhciBhcmdzPWFyZ3VtZW50czt2YXIgbGVuPWFyZ3MubGVuZ3RoO3ZhciBzdHI9U3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLGZ1bmN0aW9uKHgpe2lmKHg9PT1cIiVcIilyZXR1cm5cIiVcIjtpZihpPj1sZW4pcmV0dXJuIHg7c3dpdGNoKHgpe2Nhc2VcIiVzXCI6cmV0dXJuIFN0cmluZyhhcmdzW2krK10pO2Nhc2VcIiVkXCI6cmV0dXJuIE51bWJlcihhcmdzW2krK10pO2Nhc2VcIiVqXCI6dHJ5e3JldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pfWNhdGNoKF8pe3JldHVyblwiW0NpcmN1bGFyXVwifWRlZmF1bHQ6cmV0dXJuIHh9fSk7Zm9yKHZhciB4PWFyZ3NbaV07aTxsZW47eD1hcmdzWysraV0pe2lmKGlzTnVsbCh4KXx8IWlzT2JqZWN0KHgpKXtzdHIrPVwiIFwiK3h9ZWxzZXtzdHIrPVwiIFwiK2luc3BlY3QoeCl9fXJldHVybiBzdHJ9O2V4cG9ydHMuZGVwcmVjYXRlPWZ1bmN0aW9uKGZuLG1zZyl7aWYoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sbXNnKS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fWlmKHByb2Nlc3Mubm9EZXByZWNhdGlvbj09PXRydWUpe3JldHVybiBmbn12YXIgd2FybmVkPWZhbHNlO2Z1bmN0aW9uIGRlcHJlY2F0ZWQoKXtpZighd2FybmVkKXtpZihwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pe3Rocm93IG5ldyBFcnJvcihtc2cpfWVsc2UgaWYocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKXtjb25zb2xlLnRyYWNlKG1zZyl9ZWxzZXtjb25zb2xlLmVycm9yKG1zZyl9d2FybmVkPXRydWV9cmV0dXJuIGZuLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1yZXR1cm4gZGVwcmVjYXRlZH07dmFyIGRlYnVncz17fTt2YXIgZGVidWdFbnZpcm9uO2V4cG9ydHMuZGVidWdsb2c9ZnVuY3Rpb24oc2V0KXtpZihpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKWRlYnVnRW52aXJvbj1wcm9jZXNzLmVudi5OT0RFX0RFQlVHfHxcIlwiO3NldD1zZXQudG9VcHBlckNhc2UoKTtpZighZGVidWdzW3NldF0pe2lmKG5ldyBSZWdFeHAoXCJcXFxcYlwiK3NldCtcIlxcXFxiXCIsXCJpXCIpLnRlc3QoZGVidWdFbnZpcm9uKSl7dmFyIHBpZD1wcm9jZXNzLnBpZDtkZWJ1Z3Nbc2V0XT1mdW5jdGlvbigpe3ZhciBtc2c9ZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpO2NvbnNvbGUuZXJyb3IoXCIlcyAlZDogJXNcIixzZXQscGlkLG1zZyl9fWVsc2V7ZGVidWdzW3NldF09ZnVuY3Rpb24oKXt9fX1yZXR1cm4gZGVidWdzW3NldF19O2Z1bmN0aW9uIGluc3BlY3Qob2JqLG9wdHMpe3ZhciBjdHg9e3NlZW46W10sc3R5bGl6ZTpzdHlsaXplTm9Db2xvcn07aWYoYXJndW1lbnRzLmxlbmd0aD49MyljdHguZGVwdGg9YXJndW1lbnRzWzJdO2lmKGFyZ3VtZW50cy5sZW5ndGg+PTQpY3R4LmNvbG9ycz1hcmd1bWVudHNbM107aWYoaXNCb29sZWFuKG9wdHMpKXtjdHguc2hvd0hpZGRlbj1vcHRzfWVsc2UgaWYob3B0cyl7ZXhwb3J0cy5fZXh0ZW5kKGN0eCxvcHRzKX1pZihpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpY3R4LnNob3dIaWRkZW49ZmFsc2U7aWYoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSljdHguZGVwdGg9MjtpZihpc1VuZGVmaW5lZChjdHguY29sb3JzKSljdHguY29sb3JzPWZhbHNlO2lmKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSljdHguY3VzdG9tSW5zcGVjdD10cnVlO2lmKGN0eC5jb2xvcnMpY3R4LnN0eWxpemU9c3R5bGl6ZVdpdGhDb2xvcjtyZXR1cm4gZm9ybWF0VmFsdWUoY3R4LG9iaixjdHguZGVwdGgpfWV4cG9ydHMuaW5zcGVjdD1pbnNwZWN0O2luc3BlY3QuY29sb3JzPXtib2xkOlsxLDIyXSxpdGFsaWM6WzMsMjNdLHVuZGVybGluZTpbNCwyNF0saW52ZXJzZTpbNywyN10sd2hpdGU6WzM3LDM5XSxncmV5Ols5MCwzOV0sYmxhY2s6WzMwLDM5XSxibHVlOlszNCwzOV0sY3lhbjpbMzYsMzldLGdyZWVuOlszMiwzOV0sbWFnZW50YTpbMzUsMzldLHJlZDpbMzEsMzldLHllbGxvdzpbMzMsMzldfTtpbnNwZWN0LnN0eWxlcz17c3BlY2lhbDpcImN5YW5cIixudW1iZXI6XCJ5ZWxsb3dcIixcImJvb2xlYW5cIjpcInllbGxvd1wiLHVuZGVmaW5lZDpcImdyZXlcIixcIm51bGxcIjpcImJvbGRcIixzdHJpbmc6XCJncmVlblwiLGRhdGU6XCJtYWdlbnRhXCIscmVnZXhwOlwicmVkXCJ9O2Z1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLHN0eWxlVHlwZSl7dmFyIHN0eWxlPWluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07aWYoc3R5bGUpe3JldHVyblwiXHUwMDFiW1wiK2luc3BlY3QuY29sb3JzW3N0eWxlXVswXStcIm1cIitzdHIrXCJcdTAwMWJbXCIraW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdK1wibVwifWVsc2V7cmV0dXJuIHN0cn19ZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLHN0eWxlVHlwZSl7cmV0dXJuIHN0cn1mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSl7dmFyIGhhc2g9e307YXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsaWR4KXtoYXNoW3ZhbF09dHJ1ZX0pO3JldHVybiBoYXNofWZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCx2YWx1ZSxyZWN1cnNlVGltZXMpe2lmKGN0eC5jdXN0b21JbnNwZWN0JiZ2YWx1ZSYmaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSYmdmFsdWUuaW5zcGVjdCE9PWV4cG9ydHMuaW5zcGVjdCYmISh2YWx1ZS5jb25zdHJ1Y3RvciYmdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlPT09dmFsdWUpKXt2YXIgcmV0PXZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLGN0eCk7aWYoIWlzU3RyaW5nKHJldCkpe3JldD1mb3JtYXRWYWx1ZShjdHgscmV0LHJlY3Vyc2VUaW1lcyl9cmV0dXJuIHJldH12YXIgcHJpbWl0aXZlPWZvcm1hdFByaW1pdGl2ZShjdHgsdmFsdWUpO2lmKHByaW1pdGl2ZSl7cmV0dXJuIHByaW1pdGl2ZX12YXIga2V5cz1PYmplY3Qua2V5cyh2YWx1ZSk7dmFyIHZpc2libGVLZXlzPWFycmF5VG9IYXNoKGtleXMpO2lmKGN0eC5zaG93SGlkZGVuKXtrZXlzPU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKX1pZihpc0Vycm9yKHZhbHVlKSYmKGtleXMuaW5kZXhPZihcIm1lc3NhZ2VcIik+PTB8fGtleXMuaW5kZXhPZihcImRlc2NyaXB0aW9uXCIpPj0wKSl7cmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKX1pZihrZXlzLmxlbmd0aD09PTApe2lmKGlzRnVuY3Rpb24odmFsdWUpKXt2YXIgbmFtZT12YWx1ZS5uYW1lP1wiOiBcIit2YWx1ZS5uYW1lOlwiXCI7cmV0dXJuIGN0eC5zdHlsaXplKFwiW0Z1bmN0aW9uXCIrbmFtZStcIl1cIixcInNwZWNpYWxcIil9aWYoaXNSZWdFeHAodmFsdWUpKXtyZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSxcInJlZ2V4cFwiKX1pZihpc0RhdGUodmFsdWUpKXtyZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksXCJkYXRlXCIpfWlmKGlzRXJyb3IodmFsdWUpKXtyZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpfX12YXIgYmFzZT1cIlwiLGFycmF5PWZhbHNlLGJyYWNlcz1bXCJ7XCIsXCJ9XCJdO2lmKGlzQXJyYXkodmFsdWUpKXthcnJheT10cnVlO2JyYWNlcz1bXCJbXCIsXCJdXCJdfWlmKGlzRnVuY3Rpb24odmFsdWUpKXt2YXIgbj12YWx1ZS5uYW1lP1wiOiBcIit2YWx1ZS5uYW1lOlwiXCI7YmFzZT1cIiBbRnVuY3Rpb25cIituK1wiXVwifWlmKGlzUmVnRXhwKHZhbHVlKSl7YmFzZT1cIiBcIitSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpfWlmKGlzRGF0ZSh2YWx1ZSkpe2Jhc2U9XCIgXCIrRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSl9aWYoaXNFcnJvcih2YWx1ZSkpe2Jhc2U9XCIgXCIrZm9ybWF0RXJyb3IodmFsdWUpfWlmKGtleXMubGVuZ3RoPT09MCYmKCFhcnJheXx8dmFsdWUubGVuZ3RoPT0wKSl7cmV0dXJuIGJyYWNlc1swXStiYXNlK2JyYWNlc1sxXX1pZihyZWN1cnNlVGltZXM8MCl7aWYoaXNSZWdFeHAodmFsdWUpKXtyZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSxcInJlZ2V4cFwiKX1lbHNle3JldHVybiBjdHguc3R5bGl6ZShcIltPYmplY3RdXCIsXCJzcGVjaWFsXCIpfX1jdHguc2Vlbi5wdXNoKHZhbHVlKTt2YXIgb3V0cHV0O2lmKGFycmF5KXtvdXRwdXQ9Zm9ybWF0QXJyYXkoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyx2aXNpYmxlS2V5cyxrZXlzKX1lbHNle291dHB1dD1rZXlzLm1hcChmdW5jdGlvbihrZXkpe3JldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsdmFsdWUscmVjdXJzZVRpbWVzLHZpc2libGVLZXlzLGtleSxhcnJheSl9KX1jdHguc2Vlbi5wb3AoKTtyZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LGJhc2UsYnJhY2VzKX1mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LHZhbHVlKXtpZihpc1VuZGVmaW5lZCh2YWx1ZSkpcmV0dXJuIGN0eC5zdHlsaXplKFwidW5kZWZpbmVkXCIsXCJ1bmRlZmluZWRcIik7aWYoaXNTdHJpbmcodmFsdWUpKXt2YXIgc2ltcGxlPVwiJ1wiK0pTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csXCJcIikucmVwbGFjZSgvJy9nLFwiXFxcXCdcIikucmVwbGFjZSgvXFxcXFwiL2csJ1wiJykrXCInXCI7cmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSxcInN0cmluZ1wiKX1pZihpc051bWJlcih2YWx1ZSkpcmV0dXJuIGN0eC5zdHlsaXplKFwiXCIrdmFsdWUsXCJudW1iZXJcIik7aWYoaXNCb29sZWFuKHZhbHVlKSlyZXR1cm4gY3R4LnN0eWxpemUoXCJcIit2YWx1ZSxcImJvb2xlYW5cIik7aWYoaXNOdWxsKHZhbHVlKSlyZXR1cm4gY3R4LnN0eWxpemUoXCJudWxsXCIsXCJudWxsXCIpfWZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKXtyZXR1cm5cIltcIitFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkrXCJdXCJ9ZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyx2aXNpYmxlS2V5cyxrZXlzKXt2YXIgb3V0cHV0PVtdO2Zvcih2YXIgaT0wLGw9dmFsdWUubGVuZ3RoO2k8bDsrK2kpe2lmKGhhc093blByb3BlcnR5KHZhbHVlLFN0cmluZyhpKSkpe291dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCx2YWx1ZSxyZWN1cnNlVGltZXMsdmlzaWJsZUtleXMsU3RyaW5nKGkpLHRydWUpKX1lbHNle291dHB1dC5wdXNoKFwiXCIpfX1rZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KXtpZigha2V5Lm1hdGNoKC9eXFxkKyQvKSl7b3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyx2aXNpYmxlS2V5cyxrZXksdHJ1ZSkpfX0pO3JldHVybiBvdXRwdXR9ZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyx2aXNpYmxlS2V5cyxrZXksYXJyYXkpe3ZhciBuYW1lLHN0cixkZXNjO2Rlc2M9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSxrZXkpfHx7dmFsdWU6dmFsdWVba2V5XX07aWYoZGVzYy5nZXQpe2lmKGRlc2Muc2V0KXtzdHI9Y3R4LnN0eWxpemUoXCJbR2V0dGVyL1NldHRlcl1cIixcInNwZWNpYWxcIil9ZWxzZXtzdHI9Y3R4LnN0eWxpemUoXCJbR2V0dGVyXVwiLFwic3BlY2lhbFwiKX19ZWxzZXtpZihkZXNjLnNldCl7c3RyPWN0eC5zdHlsaXplKFwiW1NldHRlcl1cIixcInNwZWNpYWxcIil9fWlmKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cyxrZXkpKXtuYW1lPVwiW1wiK2tleStcIl1cIn1pZighc3RyKXtpZihjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpPDApe2lmKGlzTnVsbChyZWN1cnNlVGltZXMpKXtzdHI9Zm9ybWF0VmFsdWUoY3R4LGRlc2MudmFsdWUsbnVsbCl9ZWxzZXtzdHI9Zm9ybWF0VmFsdWUoY3R4LGRlc2MudmFsdWUscmVjdXJzZVRpbWVzLTEpfWlmKHN0ci5pbmRleE9mKFwiXFxuXCIpPi0xKXtpZihhcnJheSl7c3RyPXN0ci5zcGxpdChcIlxcblwiKS5tYXAoZnVuY3Rpb24obGluZSl7cmV0dXJuXCIgIFwiK2xpbmV9KS5qb2luKFwiXFxuXCIpLnN1YnN0cigyKX1lbHNle3N0cj1cIlxcblwiK3N0ci5zcGxpdChcIlxcblwiKS5tYXAoZnVuY3Rpb24obGluZSl7cmV0dXJuXCIgICBcIitsaW5lfSkuam9pbihcIlxcblwiKX19fWVsc2V7c3RyPWN0eC5zdHlsaXplKFwiW0NpcmN1bGFyXVwiLFwic3BlY2lhbFwiKX19aWYoaXNVbmRlZmluZWQobmFtZSkpe2lmKGFycmF5JiZrZXkubWF0Y2goL15cXGQrJC8pKXtyZXR1cm4gc3RyfW5hbWU9SlNPTi5zdHJpbmdpZnkoXCJcIitrZXkpO2lmKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKXtuYW1lPW5hbWUuc3Vic3RyKDEsbmFtZS5sZW5ndGgtMik7bmFtZT1jdHguc3R5bGl6ZShuYW1lLFwibmFtZVwiKX1lbHNle25hbWU9bmFtZS5yZXBsYWNlKC8nL2csXCJcXFxcJ1wiKS5yZXBsYWNlKC9cXFxcXCIvZywnXCInKS5yZXBsYWNlKC8oXlwifFwiJCkvZyxcIidcIik7bmFtZT1jdHguc3R5bGl6ZShuYW1lLFwic3RyaW5nXCIpfX1yZXR1cm4gbmFtZStcIjogXCIrc3RyfWZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCxiYXNlLGJyYWNlcyl7dmFyIG51bUxpbmVzRXN0PTA7dmFyIGxlbmd0aD1vdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsY3VyKXtudW1MaW5lc0VzdCsrO2lmKGN1ci5pbmRleE9mKFwiXFxuXCIpPj0wKW51bUxpbmVzRXN0Kys7cmV0dXJuIHByZXYrY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLFwiXCIpLmxlbmd0aCsxfSwwKTtpZihsZW5ndGg+NjApe3JldHVybiBicmFjZXNbMF0rKGJhc2U9PT1cIlwiP1wiXCI6YmFzZStcIlxcbiBcIikrXCIgXCIrb3V0cHV0LmpvaW4oXCIsXFxuICBcIikrXCIgXCIrYnJhY2VzWzFdfXJldHVybiBicmFjZXNbMF0rYmFzZStcIiBcIitvdXRwdXQuam9pbihcIiwgXCIpK1wiIFwiK2JyYWNlc1sxXX1mdW5jdGlvbiBpc0FycmF5KGFyKXtyZXR1cm4gQXJyYXkuaXNBcnJheShhcil9ZXhwb3J0cy5pc0FycmF5PWlzQXJyYXk7ZnVuY3Rpb24gaXNCb29sZWFuKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT1cImJvb2xlYW5cIn1leHBvcnRzLmlzQm9vbGVhbj1pc0Jvb2xlYW47ZnVuY3Rpb24gaXNOdWxsKGFyZyl7cmV0dXJuIGFyZz09PW51bGx9ZXhwb3J0cy5pc051bGw9aXNOdWxsO2Z1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZyl7cmV0dXJuIGFyZz09bnVsbH1leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkPWlzTnVsbE9yVW5kZWZpbmVkO2Z1bmN0aW9uIGlzTnVtYmVyKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT1cIm51bWJlclwifWV4cG9ydHMuaXNOdW1iZXI9aXNOdW1iZXI7ZnVuY3Rpb24gaXNTdHJpbmcoYXJnKXtyZXR1cm4gdHlwZW9mIGFyZz09PVwic3RyaW5nXCJ9ZXhwb3J0cy5pc1N0cmluZz1pc1N0cmluZztmdW5jdGlvbiBpc1N5bWJvbChhcmcpe3JldHVybiB0eXBlb2YgYXJnPT09XCJzeW1ib2xcIn1leHBvcnRzLmlzU3ltYm9sPWlzU3ltYm9sO2Z1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZyl7cmV0dXJuIGFyZz09PXZvaWQgMH1leHBvcnRzLmlzVW5kZWZpbmVkPWlzVW5kZWZpbmVkO2Z1bmN0aW9uIGlzUmVnRXhwKHJlKXtyZXR1cm4gaXNPYmplY3QocmUpJiZvYmplY3RUb1N0cmluZyhyZSk9PT1cIltvYmplY3QgUmVnRXhwXVwifWV4cG9ydHMuaXNSZWdFeHA9aXNSZWdFeHA7ZnVuY3Rpb24gaXNPYmplY3QoYXJnKXtyZXR1cm4gdHlwZW9mIGFyZz09PVwib2JqZWN0XCImJmFyZyE9PW51bGx9ZXhwb3J0cy5pc09iamVjdD1pc09iamVjdDtmdW5jdGlvbiBpc0RhdGUoZCl7cmV0dXJuIGlzT2JqZWN0KGQpJiZvYmplY3RUb1N0cmluZyhkKT09PVwiW29iamVjdCBEYXRlXVwifWV4cG9ydHMuaXNEYXRlPWlzRGF0ZTtmdW5jdGlvbiBpc0Vycm9yKGUpe3JldHVybiBpc09iamVjdChlKSYmKG9iamVjdFRvU3RyaW5nKGUpPT09XCJbb2JqZWN0IEVycm9yXVwifHxlIGluc3RhbmNlb2YgRXJyb3IpfWV4cG9ydHMuaXNFcnJvcj1pc0Vycm9yO2Z1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKXtyZXR1cm4gdHlwZW9mIGFyZz09PVwiZnVuY3Rpb25cIn1leHBvcnRzLmlzRnVuY3Rpb249aXNGdW5jdGlvbjtmdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpe3JldHVybiBhcmc9PT1udWxsfHx0eXBlb2YgYXJnPT09XCJib29sZWFuXCJ8fHR5cGVvZiBhcmc9PT1cIm51bWJlclwifHx0eXBlb2YgYXJnPT09XCJzdHJpbmdcInx8dHlwZW9mIGFyZz09PVwic3ltYm9sXCJ8fHR5cGVvZiBhcmc9PT1cInVuZGVmaW5lZFwifWV4cG9ydHMuaXNQcmltaXRpdmU9aXNQcmltaXRpdmU7ZXhwb3J0cy5pc0J1ZmZlcj1fZGVyZXFfKFwiLi9zdXBwb3J0L2lzQnVmZmVyXCIpO2Z1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pe3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyl9ZnVuY3Rpb24gcGFkKG4pe3JldHVybiBuPDEwP1wiMFwiK24udG9TdHJpbmcoMTApOm4udG9TdHJpbmcoMTApfXZhciBtb250aHM9W1wiSmFuXCIsXCJGZWJcIixcIk1hclwiLFwiQXByXCIsXCJNYXlcIixcIkp1blwiLFwiSnVsXCIsXCJBdWdcIixcIlNlcFwiLFwiT2N0XCIsXCJOb3ZcIixcIkRlY1wiXTtmdW5jdGlvbiB0aW1lc3RhbXAoKXt2YXIgZD1uZXcgRGF0ZTt2YXIgdGltZT1bcGFkKGQuZ2V0SG91cnMoKSkscGFkKGQuZ2V0TWludXRlcygpKSxwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKFwiOlwiKTtyZXR1cm5bZC5nZXREYXRlKCksbW9udGhzW2QuZ2V0TW9udGgoKV0sdGltZV0uam9pbihcIiBcIil9ZXhwb3J0cy5sb2c9ZnVuY3Rpb24oKXtjb25zb2xlLmxvZyhcIiVzIC0gJXNcIix0aW1lc3RhbXAoKSxleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLGFyZ3VtZW50cykpfTtleHBvcnRzLmluaGVyaXRzPV9kZXJlcV8oXCJpbmhlcml0c1wiKTtleHBvcnRzLl9leHRlbmQ9ZnVuY3Rpb24ob3JpZ2luLGFkZCl7aWYoIWFkZHx8IWlzT2JqZWN0KGFkZCkpcmV0dXJuIG9yaWdpbjt2YXIga2V5cz1PYmplY3Qua2V5cyhhZGQpO3ZhciBpPWtleXMubGVuZ3RoO3doaWxlKGktLSl7b3JpZ2luW2tleXNbaV1dPWFkZFtrZXlzW2ldXX1yZXR1cm4gb3JpZ2lufTtmdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmoscHJvcCl7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmoscHJvcCl9fSkuY2FsbCh0aGlzLF9kZXJlcV8oXCJfcHJvY2Vzc1wiKSx0eXBlb2YgZ2xvYmFsIT09XCJ1bmRlZmluZWRcIj9nbG9iYWw6dHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiP3NlbGY6dHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCI/d2luZG93Ont9KX0se1wiLi9zdXBwb3J0L2lzQnVmZmVyXCI6MTEsX3Byb2Nlc3M6MTAsaW5oZXJpdHM6OX1dfSx7fSxbMV0pKDEpfSk7IiwiKGZ1bmN0aW9uKGYpe2lmKHR5cGVvZiBleHBvcnRzPT09XCJvYmplY3RcIiYmdHlwZW9mIG1vZHVsZSE9PVwidW5kZWZpbmVkXCIpe21vZHVsZS5leHBvcnRzPWYoKX1lbHNlIGlmKHR5cGVvZiBkZWZpbmU9PT1cImZ1bmN0aW9uXCImJmRlZmluZS5hbWQpe2RlZmluZShbXSxmKX1lbHNle3ZhciBnO2lmKHR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiKXtnPXdpbmRvd31lbHNlIGlmKHR5cGVvZiBnbG9iYWwhPT1cInVuZGVmaW5lZFwiKXtnPWdsb2JhbH1lbHNlIGlmKHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIil7Zz1zZWxmfWVsc2V7Zz10aGlzfWcuTmF2TWVzaCA9IGYoKX19KShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbihmdW5jdGlvbiAoZ2xvYmFsKXtcbjsgdmFyIF9fYnJvd3NlcmlmeV9zaGltX3JlcXVpcmVfXz1fZGVyZXFfOyhmdW5jdGlvbiBicm93c2VyaWZ5U2hpbShtb2R1bGUsIGV4cG9ydHMsIF9kZXJlcV8sIGRlZmluZSwgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18pIHtcbi8vIHJldiA0NTJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiBBdXRob3IgICAgOiAgQW5ndXMgSm9obnNvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFZlcnNpb24gICA6ICA2LjEuM2EgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogRGF0ZSAgICAgIDogIDIyIEphbnVhcnkgMjAxNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiBXZWJzaXRlICAgOiAgaHR0cDovL3d3dy5hbmd1c2ouY29tICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIENvcHlyaWdodCA6ICBBbmd1cyBKb2huc29uIDIwMTAtMjAxNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiBMaWNlbnNlOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFVzZSwgbW9kaWZpY2F0aW9uICYgZGlzdHJpYnV0aW9uIGlzIHN1YmplY3QgdG8gQm9vc3QgU29mdHdhcmUgTGljZW5zZSBWZXIgMS4gKlxuICogaHR0cDovL3d3dy5ib29zdC5vcmcvTElDRU5TRV8xXzAudHh0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIEF0dHJpYnV0aW9uczogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogVGhlIGNvZGUgaW4gdGhpcyBsaWJyYXJ5IGlzIGFuIGV4dGVuc2lvbiBvZiBCYWxhIFZhdHRpJ3MgY2xpcHBpbmcgYWxnb3JpdGhtOiAqXG4gKiBcIkEgZ2VuZXJpYyBzb2x1dGlvbiB0byBwb2x5Z29uIGNsaXBwaW5nXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogQ29tbXVuaWNhdGlvbnMgb2YgdGhlIEFDTSwgVm9sIDM1LCBJc3N1ZSA3IChKdWx5IDE5OTIpIHBwIDU2LTYzLiAgICAgICAgICAgICAqXG4gKiBodHRwOi8vcG9ydGFsLmFjbS5vcmcvY2l0YXRpb24uY2ZtP2lkPTEyOTkwNiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogQ29tcHV0ZXIgZ3JhcGhpY3MgYW5kIGdlb21ldHJpYyBtb2RlbGluZzogaW1wbGVtZW50YXRpb24gYW5kIGFsZ29yaXRobXMgICAgICAqXG4gKiBCeSBNYXggSy4gQWdvc3RvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFNwcmluZ2VyOyAxIGVkaXRpb24gKEphbnVhcnkgNCwgMjAwNSkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogaHR0cDovL2Jvb2tzLmdvb2dsZS5jb20vYm9va3M/cT12YXR0aStjbGlwcGluZythZ29zdG9uICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFNlZSBhbHNvOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogXCJQb2x5Z29uIE9mZnNldHRpbmcgYnkgQ29tcHV0aW5nIFdpbmRpbmcgTnVtYmVyc1wiICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFBhcGVyIG5vLiBERVRDMjAwNS04NTUxMyBwcC4gNTY1LTU3NSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogQVNNRSAyMDA1IEludGVybmF0aW9uYWwgRGVzaWduIEVuZ2luZWVyaW5nIFRlY2huaWNhbCBDb25mZXJlbmNlcyAgICAgICAgICAgICAqXG4gKiBhbmQgQ29tcHV0ZXJzIGFuZCBJbmZvcm1hdGlvbiBpbiBFbmdpbmVlcmluZyBDb25mZXJlbmNlIChJREVUQy9DSUUyMDA1KSAgICAgICpcbiAqIFNlcHRlbWJlciAyNC0yOCwgMjAwNSAsIExvbmcgQmVhY2gsIENhbGlmb3JuaWEsIFVTQSAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogaHR0cDovL3d3dy5tZS5iZXJrZWxleS5lZHUvfm1jbWFpbnMvcHVicy9EQUMwNU9mZnNldFBvbHlnb24ucGRmICAgICAgICAgICAgICAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogQXV0aG9yICAgIDogIFRpbW8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiBWZXJzaW9uICAgOiAgNi4xLjMuMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIERhdGUgICAgICA6ICAxIEZlYnJ1YXJ5IDIwMTQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiBUaGlzIGlzIGEgdHJhbnNsYXRpb24gb2YgdGhlIEMjIENsaXBwZXIgbGlicmFyeSB0byBKYXZhc2NyaXB0LiAgICAgICAgICAgICAgICpcbiAqIEludDEyOCBzdHJ1Y3Qgb2YgQyMgaXMgaW1wbGVtZW50ZWQgdXNpbmcgSlNCTiBvZiBUb20gV3UuICAgICAgICAgICAgICAgICAgICAgKlxuICogQmVjYXVzZSBKYXZhc2NyaXB0IGxhY2tzIHN1cHBvcnQgZm9yIDY0LWJpdCBpbnRlZ2VycywgdGhlIHNwYWNlICAgICAgICAgICAgICAqXG4gKiBpcyBhIGxpdHRsZSBtb3JlIHJlc3RyaWN0ZWQgdGhhbiBpbiBDIyB2ZXJzaW9uLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogQyMgdmVyc2lvbiBoYXMgc3VwcG9ydCBmb3IgY29vcmRpbmF0ZSBzcGFjZTogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiArLTQ2MTE2ODYwMTg0MjczODc5MDMgKCBzcXJ0KDJeMTI3IC0xKS8yICkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIHdoaWxlIEphdmFzY3JpcHQgdmVyc2lvbiBoYXMgc3VwcG9ydCBmb3Igc3BhY2U6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogKy00NTAzNTk5NjI3MzcwNDk1ICggc3FydCgyXjEwNiAtMSkvMiApICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFRvbSBXdSdzIEpTQk4gcHJvdmVkIHRvIGJlIHRoZSBmYXN0ZXN0IGJpZyBpbnRlZ2VyIGxpYnJhcnk6ICAgICAgICAgICAgICAgICAgKlxuICogaHR0cDovL2pzcGVyZi5jb20vYmlnLWludGVnZXItbGlicmFyeS10ZXN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFRoaXMgY2xhc3MgY2FuIGJlIG1hZGUgc2ltcGxlciB3aGVuIChpZiBldmVyKSA2NC1iaXQgaW50ZWdlciBzdXBwb3J0IGNvbWVzLiAgKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIEJhc2ljIEphdmFTY3JpcHQgQk4gbGlicmFyeSAtIHN1YnNldCB1c2VmdWwgZm9yIFJTQSBlbmNyeXB0aW9uLiAgICAgICAgICAgICAgKlxuICogaHR0cDovL3d3dy1jcy1zdHVkZW50cy5zdGFuZm9yZC5lZHUvfnRqdy9qc2JuLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDUgIFRvbSBXdSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogU2VlIFwiTElDRU5TRVwiIGZvciBkZXRhaWxzOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIGh0dHA6Ly93d3ctY3Mtc3R1ZGVudHMuc3RhbmZvcmQuZWR1L350ancvanNibi9MSUNFTlNFICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbihmdW5jdGlvbigpe2Z1bmN0aW9uIGsoYSxiLGMpe2QuYmlnaW50ZWdlcl91c2VkPTE7bnVsbCE9YSYmKFwibnVtYmVyXCI9PXR5cGVvZiBhJiZcInVuZGVmaW5lZFwiPT10eXBlb2YgYj90aGlzLmZyb21JbnQoYSk6XCJudW1iZXJcIj09dHlwZW9mIGE/dGhpcy5mcm9tTnVtYmVyKGEsYixjKTpudWxsPT1iJiZcInN0cmluZ1wiIT10eXBlb2YgYT90aGlzLmZyb21TdHJpbmcoYSwyNTYpOnRoaXMuZnJvbVN0cmluZyhhLGIpKX1mdW5jdGlvbiBxKCl7cmV0dXJuIG5ldyBrKG51bGwpfWZ1bmN0aW9uIFEoYSxiLGMsZSxkLGcpe2Zvcig7MDw9LS1nOyl7dmFyIGg9Yip0aGlzW2ErK10rY1tlXStkO2Q9TWF0aC5mbG9vcihoLzY3MTA4ODY0KTtjW2UrK109aCY2NzEwODg2M31yZXR1cm4gZH1mdW5jdGlvbiBSKGEsYixjLGUsZCxnKXt2YXIgaD1iJjMyNzY3O2ZvcihiPj49MTU7MDw9LS1nOyl7dmFyIGw9dGhpc1thXSYzMjc2NyxrPXRoaXNbYSsrXT4+MTUsbj1iKmwraypoLGw9aCpsKygobiYzMjc2Nyk8PFxuMTUpK2NbZV0rKGQmMTA3Mzc0MTgyMyk7ZD0obD4+PjMwKSsobj4+PjE1KStiKmsrKGQ+Pj4zMCk7Y1tlKytdPWwmMTA3Mzc0MTgyM31yZXR1cm4gZH1mdW5jdGlvbiBTKGEsYixjLGUsZCxnKXt2YXIgaD1iJjE2MzgzO2ZvcihiPj49MTQ7MDw9LS1nOyl7dmFyIGw9dGhpc1thXSYxNjM4MyxrPXRoaXNbYSsrXT4+MTQsbj1iKmwraypoLGw9aCpsKygobiYxNjM4Myk8PDE0KStjW2VdK2Q7ZD0obD4+MjgpKyhuPj4xNCkrYiprO2NbZSsrXT1sJjI2ODQzNTQ1NX1yZXR1cm4gZH1mdW5jdGlvbiBMKGEsYil7dmFyIGM9QlthLmNoYXJDb2RlQXQoYildO3JldHVybiBudWxsPT1jPy0xOmN9ZnVuY3Rpb24gdihhKXt2YXIgYj1xKCk7Yi5mcm9tSW50KGEpO3JldHVybiBifWZ1bmN0aW9uIEMoYSl7dmFyIGI9MSxjOzAhPShjPWE+Pj4xNikmJihhPWMsYis9MTYpOzAhPShjPWE+PjgpJiYoYT1jLGIrPTgpOzAhPShjPWE+PjQpJiYoYT1jLGIrPTQpOzAhPShjPWE+PjIpJiYoYT1jLGIrPTIpOzAhPVxuYT4+MSYmKGIrPTEpO3JldHVybiBifWZ1bmN0aW9uIHgoYSl7dGhpcy5tPWF9ZnVuY3Rpb24geShhKXt0aGlzLm09YTt0aGlzLm1wPWEuaW52RGlnaXQoKTt0aGlzLm1wbD10aGlzLm1wJjMyNzY3O3RoaXMubXBoPXRoaXMubXA+PjE1O3RoaXMudW09KDE8PGEuREItMTUpLTE7dGhpcy5tdDI9MiphLnR9ZnVuY3Rpb24gVChhLGIpe3JldHVybiBhJmJ9ZnVuY3Rpb24gSShhLGIpe3JldHVybiBhfGJ9ZnVuY3Rpb24gTShhLGIpe3JldHVybiBhXmJ9ZnVuY3Rpb24gTihhLGIpe3JldHVybiBhJn5ifWZ1bmN0aW9uIEEoKXt9ZnVuY3Rpb24gTyhhKXtyZXR1cm4gYX1mdW5jdGlvbiB3KGEpe3RoaXMucjI9cSgpO3RoaXMucTM9cSgpO2suT05FLmRsU2hpZnRUbygyKmEudCx0aGlzLnIyKTt0aGlzLm11PXRoaXMucjIuZGl2aWRlKGEpO3RoaXMubT1hfXZhciBkPXt9LEQ9ITE7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzPyhtb2R1bGUuZXhwb3J0cz1kLEQ9ITApOlxuXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudD93aW5kb3cuQ2xpcHBlckxpYj1kOnNlbGYuQ2xpcHBlckxpYj1kO3ZhciByO2lmKEQpcD1cImNocm9tZVwiLHI9XCJOZXRzY2FwZVwiO2Vsc2V7dmFyIHA9bmF2aWdhdG9yLnVzZXJBZ2VudC50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7cj1uYXZpZ2F0b3IuYXBwTmFtZX12YXIgRSxKLEYsRyxILFA7RT0tMSE9cC5pbmRleE9mKFwiY2hyb21lXCIpJiYtMT09cC5pbmRleE9mKFwiY2hyb21pdW1cIik/MTowO0Q9LTEhPXAuaW5kZXhPZihcImNocm9taXVtXCIpPzE6MDtKPS0xIT1wLmluZGV4T2YoXCJzYWZhcmlcIikmJi0xPT1wLmluZGV4T2YoXCJjaHJvbWVcIikmJi0xPT1wLmluZGV4T2YoXCJjaHJvbWl1bVwiKT8xOjA7Rj0tMSE9cC5pbmRleE9mKFwiZmlyZWZveFwiKT8xOjA7cC5pbmRleE9mKFwiZmlyZWZveC8xN1wiKTtwLmluZGV4T2YoXCJmaXJlZm94LzE1XCIpO3AuaW5kZXhPZihcImZpcmVmb3gvM1wiKTtHPS0xIT1wLmluZGV4T2YoXCJvcGVyYVwiKT8xOjA7cC5pbmRleE9mKFwibXNpZSAxMFwiKTtcbnAuaW5kZXhPZihcIm1zaWUgOVwiKTtIPS0xIT1wLmluZGV4T2YoXCJtc2llIDhcIik/MTowO1A9LTEhPXAuaW5kZXhPZihcIm1zaWUgN1wiKT8xOjA7cD0tMSE9cC5pbmRleE9mKFwibXNpZSBcIik/MTowO2QuYmlnaW50ZWdlcl91c2VkPW51bGw7XCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIj09cj8oay5wcm90b3R5cGUuYW09UixyPTMwKTpcIk5ldHNjYXBlXCIhPXI/KGsucHJvdG90eXBlLmFtPVEscj0yNik6KGsucHJvdG90eXBlLmFtPVMscj0yOCk7ay5wcm90b3R5cGUuREI9cjtrLnByb3RvdHlwZS5ETT0oMTw8ciktMTtrLnByb3RvdHlwZS5EVj0xPDxyO2sucHJvdG90eXBlLkZWPU1hdGgucG93KDIsNTIpO2sucHJvdG90eXBlLkYxPTUyLXI7ay5wcm90b3R5cGUuRjI9MipyLTUyO3ZhciBCPVtdLHU7cj00ODtmb3IodT0wOzk+PXU7Kyt1KUJbcisrXT11O3I9OTc7Zm9yKHU9MTA7MzY+dTsrK3UpQltyKytdPXU7cj02NTtmb3IodT0xMDszNj51OysrdSlCW3IrK109dTt4LnByb3RvdHlwZS5jb252ZXJ0PVxuZnVuY3Rpb24oYSl7cmV0dXJuIDA+YS5zfHwwPD1hLmNvbXBhcmVUbyh0aGlzLm0pP2EubW9kKHRoaXMubSk6YX07eC5wcm90b3R5cGUucmV2ZXJ0PWZ1bmN0aW9uKGEpe3JldHVybiBhfTt4LnByb3RvdHlwZS5yZWR1Y2U9ZnVuY3Rpb24oYSl7YS5kaXZSZW1Ubyh0aGlzLm0sbnVsbCxhKX07eC5wcm90b3R5cGUubXVsVG89ZnVuY3Rpb24oYSxiLGMpe2EubXVsdGlwbHlUbyhiLGMpO3RoaXMucmVkdWNlKGMpfTt4LnByb3RvdHlwZS5zcXJUbz1mdW5jdGlvbihhLGIpe2Euc3F1YXJlVG8oYik7dGhpcy5yZWR1Y2UoYil9O3kucHJvdG90eXBlLmNvbnZlcnQ9ZnVuY3Rpb24oYSl7dmFyIGI9cSgpO2EuYWJzKCkuZGxTaGlmdFRvKHRoaXMubS50LGIpO2IuZGl2UmVtVG8odGhpcy5tLG51bGwsYik7MD5hLnMmJjA8Yi5jb21wYXJlVG8oay5aRVJPKSYmdGhpcy5tLnN1YlRvKGIsYik7cmV0dXJuIGJ9O3kucHJvdG90eXBlLnJldmVydD1mdW5jdGlvbihhKXt2YXIgYj1xKCk7YS5jb3B5VG8oYik7XG50aGlzLnJlZHVjZShiKTtyZXR1cm4gYn07eS5wcm90b3R5cGUucmVkdWNlPWZ1bmN0aW9uKGEpe2Zvcig7YS50PD10aGlzLm10MjspYVthLnQrK109MDtmb3IodmFyIGI9MDtiPHRoaXMubS50OysrYil7dmFyIGM9YVtiXSYzMjc2NyxlPWMqdGhpcy5tcGwrKChjKnRoaXMubXBoKyhhW2JdPj4xNSkqdGhpcy5tcGwmdGhpcy51bSk8PDE1KSZhLkRNLGM9Yit0aGlzLm0udDtmb3IoYVtjXSs9dGhpcy5tLmFtKDAsZSxhLGIsMCx0aGlzLm0udCk7YVtjXT49YS5EVjspYVtjXS09YS5EVixhWysrY10rK31hLmNsYW1wKCk7YS5kclNoaWZ0VG8odGhpcy5tLnQsYSk7MDw9YS5jb21wYXJlVG8odGhpcy5tKSYmYS5zdWJUbyh0aGlzLm0sYSl9O3kucHJvdG90eXBlLm11bFRvPWZ1bmN0aW9uKGEsYixjKXthLm11bHRpcGx5VG8oYixjKTt0aGlzLnJlZHVjZShjKX07eS5wcm90b3R5cGUuc3FyVG89ZnVuY3Rpb24oYSxiKXthLnNxdWFyZVRvKGIpO3RoaXMucmVkdWNlKGIpfTtrLnByb3RvdHlwZS5jb3B5VG89XG5mdW5jdGlvbihhKXtmb3IodmFyIGI9dGhpcy50LTE7MDw9YjstLWIpYVtiXT10aGlzW2JdO2EudD10aGlzLnQ7YS5zPXRoaXMuc307ay5wcm90b3R5cGUuZnJvbUludD1mdW5jdGlvbihhKXt0aGlzLnQ9MTt0aGlzLnM9MD5hPy0xOjA7MDxhP3RoaXNbMF09YTotMT5hP3RoaXNbMF09YSt0aGlzLkRWOnRoaXMudD0wfTtrLnByb3RvdHlwZS5mcm9tU3RyaW5nPWZ1bmN0aW9uKGEsYil7dmFyIGM7aWYoMTY9PWIpYz00O2Vsc2UgaWYoOD09YiljPTM7ZWxzZSBpZigyNTY9PWIpYz04O2Vsc2UgaWYoMj09YiljPTE7ZWxzZSBpZigzMj09YiljPTU7ZWxzZSBpZig0PT1iKWM9MjtlbHNle3RoaXMuZnJvbVJhZGl4KGEsYik7cmV0dXJufXRoaXMucz10aGlzLnQ9MDtmb3IodmFyIGU9YS5sZW5ndGgsZD0hMSxnPTA7MDw9LS1lOyl7dmFyIGg9OD09Yz9hW2VdJjI1NTpMKGEsZSk7MD5oP1wiLVwiPT1hLmNoYXJBdChlKSYmKGQ9ITApOihkPSExLDA9PWc/dGhpc1t0aGlzLnQrK109aDpnK2M+dGhpcy5EQj9cbih0aGlzW3RoaXMudC0xXXw9KGgmKDE8PHRoaXMuREItZyktMSk8PGcsdGhpc1t0aGlzLnQrK109aD4+dGhpcy5EQi1nKTp0aGlzW3RoaXMudC0xXXw9aDw8ZyxnKz1jLGc+PXRoaXMuREImJihnLT10aGlzLkRCKSl9OD09YyYmMCE9KGFbMF0mMTI4KSYmKHRoaXMucz0tMSwwPGcmJih0aGlzW3RoaXMudC0xXXw9KDE8PHRoaXMuREItZyktMTw8ZykpO3RoaXMuY2xhbXAoKTtkJiZrLlpFUk8uc3ViVG8odGhpcyx0aGlzKX07ay5wcm90b3R5cGUuY2xhbXA9ZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcy5zJnRoaXMuRE07MDx0aGlzLnQmJnRoaXNbdGhpcy50LTFdPT1hOyktLXRoaXMudH07ay5wcm90b3R5cGUuZGxTaGlmdFRvPWZ1bmN0aW9uKGEsYil7dmFyIGM7Zm9yKGM9dGhpcy50LTE7MDw9YzstLWMpYltjK2FdPXRoaXNbY107Zm9yKGM9YS0xOzA8PWM7LS1jKWJbY109MDtiLnQ9dGhpcy50K2E7Yi5zPXRoaXMuc307ay5wcm90b3R5cGUuZHJTaGlmdFRvPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPVxuYTtjPHRoaXMudDsrK2MpYltjLWFdPXRoaXNbY107Yi50PU1hdGgubWF4KHRoaXMudC1hLDApO2Iucz10aGlzLnN9O2sucHJvdG90eXBlLmxTaGlmdFRvPWZ1bmN0aW9uKGEsYil7dmFyIGM9YSV0aGlzLkRCLGU9dGhpcy5EQi1jLGQ9KDE8PGUpLTEsZz1NYXRoLmZsb29yKGEvdGhpcy5EQiksaD10aGlzLnM8PGMmdGhpcy5ETSxsO2ZvcihsPXRoaXMudC0xOzA8PWw7LS1sKWJbbCtnKzFdPXRoaXNbbF0+PmV8aCxoPSh0aGlzW2xdJmQpPDxjO2ZvcihsPWctMTswPD1sOy0tbCliW2xdPTA7YltnXT1oO2IudD10aGlzLnQrZysxO2Iucz10aGlzLnM7Yi5jbGFtcCgpfTtrLnByb3RvdHlwZS5yU2hpZnRUbz1mdW5jdGlvbihhLGIpe2Iucz10aGlzLnM7dmFyIGM9TWF0aC5mbG9vcihhL3RoaXMuREIpO2lmKGM+PXRoaXMudCliLnQ9MDtlbHNle3ZhciBlPWEldGhpcy5EQixkPXRoaXMuREItZSxnPSgxPDxlKS0xO2JbMF09dGhpc1tjXT4+ZTtmb3IodmFyIGg9YysxO2g8dGhpcy50OysraCliW2gtXG5jLTFdfD0odGhpc1toXSZnKTw8ZCxiW2gtY109dGhpc1toXT4+ZTswPGUmJihiW3RoaXMudC1jLTFdfD0odGhpcy5zJmcpPDxkKTtiLnQ9dGhpcy50LWM7Yi5jbGFtcCgpfX07ay5wcm90b3R5cGUuc3ViVG89ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9MCxlPTAsZD1NYXRoLm1pbihhLnQsdGhpcy50KTtjPGQ7KWUrPXRoaXNbY10tYVtjXSxiW2MrK109ZSZ0aGlzLkRNLGU+Pj10aGlzLkRCO2lmKGEudDx0aGlzLnQpe2ZvcihlLT1hLnM7Yzx0aGlzLnQ7KWUrPXRoaXNbY10sYltjKytdPWUmdGhpcy5ETSxlPj49dGhpcy5EQjtlKz10aGlzLnN9ZWxzZXtmb3IoZSs9dGhpcy5zO2M8YS50OyllLT1hW2NdLGJbYysrXT1lJnRoaXMuRE0sZT4+PXRoaXMuREI7ZS09YS5zfWIucz0wPmU/LTE6MDstMT5lP2JbYysrXT10aGlzLkRWK2U6MDxlJiYoYltjKytdPWUpO2IudD1jO2IuY2xhbXAoKX07ay5wcm90b3R5cGUubXVsdGlwbHlUbz1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMuYWJzKCksZT1cbmEuYWJzKCksZD1jLnQ7Zm9yKGIudD1kK2UudDswPD0tLWQ7KWJbZF09MDtmb3IoZD0wO2Q8ZS50OysrZCliW2QrYy50XT1jLmFtKDAsZVtkXSxiLGQsMCxjLnQpO2Iucz0wO2IuY2xhbXAoKTt0aGlzLnMhPWEucyYmay5aRVJPLnN1YlRvKGIsYil9O2sucHJvdG90eXBlLnNxdWFyZVRvPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj10aGlzLmFicygpLGM9YS50PTIqYi50OzA8PS0tYzspYVtjXT0wO2ZvcihjPTA7YzxiLnQtMTsrK2Mpe3ZhciBlPWIuYW0oYyxiW2NdLGEsMipjLDAsMSk7KGFbYytiLnRdKz1iLmFtKGMrMSwyKmJbY10sYSwyKmMrMSxlLGIudC1jLTEpKT49Yi5EViYmKGFbYytiLnRdLT1iLkRWLGFbYytiLnQrMV09MSl9MDxhLnQmJihhW2EudC0xXSs9Yi5hbShjLGJbY10sYSwyKmMsMCwxKSk7YS5zPTA7YS5jbGFtcCgpfTtrLnByb3RvdHlwZS5kaXZSZW1Ubz1mdW5jdGlvbihhLGIsYyl7dmFyIGU9YS5hYnMoKTtpZighKDA+PWUudCkpe3ZhciBkPXRoaXMuYWJzKCk7aWYoZC50PFxuZS50KW51bGwhPWImJmIuZnJvbUludCgwKSxudWxsIT1jJiZ0aGlzLmNvcHlUbyhjKTtlbHNle251bGw9PWMmJihjPXEoKSk7dmFyIGc9cSgpLGg9dGhpcy5zO2E9YS5zO3ZhciBsPXRoaXMuREItQyhlW2UudC0xXSk7MDxsPyhlLmxTaGlmdFRvKGwsZyksZC5sU2hpZnRUbyhsLGMpKTooZS5jb3B5VG8oZyksZC5jb3B5VG8oYykpO2U9Zy50O2Q9Z1tlLTFdO2lmKDAhPWQpe3ZhciB6PWQqKDE8PHRoaXMuRjEpKygxPGU/Z1tlLTJdPj50aGlzLkYyOjApLG49dGhpcy5GVi96LHo9KDE8PHRoaXMuRjEpL3osVT0xPDx0aGlzLkYyLG09Yy50LHA9bS1lLHM9bnVsbD09Yj9xKCk6YjtnLmRsU2hpZnRUbyhwLHMpOzA8PWMuY29tcGFyZVRvKHMpJiYoY1tjLnQrK109MSxjLnN1YlRvKHMsYykpO2suT05FLmRsU2hpZnRUbyhlLHMpO2ZvcihzLnN1YlRvKGcsZyk7Zy50PGU7KWdbZy50KytdPTA7Zm9yKDswPD0tLXA7KXt2YXIgcj1jWy0tbV09PWQ/dGhpcy5ETTpNYXRoLmZsb29yKGNbbV0qbisoY1ttLVxuMV0rVSkqeik7aWYoKGNbbV0rPWcuYW0oMCxyLGMscCwwLGUpKTxyKWZvcihnLmRsU2hpZnRUbyhwLHMpLGMuc3ViVG8ocyxjKTtjW21dPC0tcjspYy5zdWJUbyhzLGMpfW51bGwhPWImJihjLmRyU2hpZnRUbyhlLGIpLGghPWEmJmsuWkVSTy5zdWJUbyhiLGIpKTtjLnQ9ZTtjLmNsYW1wKCk7MDxsJiZjLnJTaGlmdFRvKGwsYyk7MD5oJiZrLlpFUk8uc3ViVG8oYyxjKX19fX07ay5wcm90b3R5cGUuaW52RGlnaXQ9ZnVuY3Rpb24oKXtpZigxPnRoaXMudClyZXR1cm4gMDt2YXIgYT10aGlzWzBdO2lmKDA9PShhJjEpKXJldHVybiAwO3ZhciBiPWEmMyxiPWIqKDItKGEmMTUpKmIpJjE1LGI9YiooMi0oYSYyNTUpKmIpJjI1NSxiPWIqKDItKChhJjY1NTM1KSpiJjY1NTM1KSkmNjU1MzUsYj1iKigyLWEqYiV0aGlzLkRWKSV0aGlzLkRWO3JldHVybiAwPGI/dGhpcy5EVi1iOi1ifTtrLnByb3RvdHlwZS5pc0V2ZW49ZnVuY3Rpb24oKXtyZXR1cm4gMD09KDA8dGhpcy50P3RoaXNbMF0mMTp0aGlzLnMpfTtcbmsucHJvdG90eXBlLmV4cD1mdW5jdGlvbihhLGIpe2lmKDQyOTQ5NjcyOTU8YXx8MT5hKXJldHVybiBrLk9ORTt2YXIgYz1xKCksZT1xKCksZD1iLmNvbnZlcnQodGhpcyksZz1DKGEpLTE7Zm9yKGQuY29weVRvKGMpOzA8PS0tZzspaWYoYi5zcXJUbyhjLGUpLDA8KGEmMTw8ZykpYi5tdWxUbyhlLGQsYyk7ZWxzZSB2YXIgaD1jLGM9ZSxlPWg7cmV0dXJuIGIucmV2ZXJ0KGMpfTtrLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbihhKXtpZigwPnRoaXMucylyZXR1cm5cIi1cIit0aGlzLm5lZ2F0ZSgpLnRvU3RyaW5nKGEpO2lmKDE2PT1hKWE9NDtlbHNlIGlmKDg9PWEpYT0zO2Vsc2UgaWYoMj09YSlhPTE7ZWxzZSBpZigzMj09YSlhPTU7ZWxzZSBpZig0PT1hKWE9MjtlbHNlIHJldHVybiB0aGlzLnRvUmFkaXgoYSk7dmFyIGI9KDE8PGEpLTEsYyxlPSExLGQ9XCJcIixnPXRoaXMudCxoPXRoaXMuREItZyp0aGlzLkRCJWE7aWYoMDxnLS0pZm9yKGg8dGhpcy5EQiYmMDwoYz10aGlzW2ddPj5cbmgpJiYoZT0hMCxkPVwiMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCIuY2hhckF0KGMpKTswPD1nOyloPGE/KGM9KHRoaXNbZ10mKDE8PGgpLTEpPDxhLWgsY3w9dGhpc1stLWddPj4oaCs9dGhpcy5EQi1hKSk6KGM9dGhpc1tnXT4+KGgtPWEpJmIsMD49aCYmKGgrPXRoaXMuREIsLS1nKSksMDxjJiYoZT0hMCksZSYmKGQrPVwiMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCIuY2hhckF0KGMpKTtyZXR1cm4gZT9kOlwiMFwifTtrLnByb3RvdHlwZS5uZWdhdGU9ZnVuY3Rpb24oKXt2YXIgYT1xKCk7ay5aRVJPLnN1YlRvKHRoaXMsYSk7cmV0dXJuIGF9O2sucHJvdG90eXBlLmFicz1mdW5jdGlvbigpe3JldHVybiAwPnRoaXMucz90aGlzLm5lZ2F0ZSgpOnRoaXN9O2sucHJvdG90eXBlLmNvbXBhcmVUbz1mdW5jdGlvbihhKXt2YXIgYj10aGlzLnMtYS5zO2lmKDAhPWIpcmV0dXJuIGI7dmFyIGM9dGhpcy50LGI9Yy1hLnQ7aWYoMCE9YilyZXR1cm4gMD50aGlzLnM/XG4tYjpiO2Zvcig7MDw9LS1jOylpZigwIT0oYj10aGlzW2NdLWFbY10pKXJldHVybiBiO3JldHVybiAwfTtrLnByb3RvdHlwZS5iaXRMZW5ndGg9ZnVuY3Rpb24oKXtyZXR1cm4gMD49dGhpcy50PzA6dGhpcy5EQioodGhpcy50LTEpK0ModGhpc1t0aGlzLnQtMV1edGhpcy5zJnRoaXMuRE0pfTtrLnByb3RvdHlwZS5tb2Q9ZnVuY3Rpb24oYSl7dmFyIGI9cSgpO3RoaXMuYWJzKCkuZGl2UmVtVG8oYSxudWxsLGIpOzA+dGhpcy5zJiYwPGIuY29tcGFyZVRvKGsuWkVSTykmJmEuc3ViVG8oYixiKTtyZXR1cm4gYn07ay5wcm90b3R5cGUubW9kUG93SW50PWZ1bmN0aW9uKGEsYil7dmFyIGM7Yz0yNTY+YXx8Yi5pc0V2ZW4oKT9uZXcgeChiKTpuZXcgeShiKTtyZXR1cm4gdGhpcy5leHAoYSxjKX07ay5aRVJPPXYoMCk7ay5PTkU9digxKTtBLnByb3RvdHlwZS5jb252ZXJ0PU87QS5wcm90b3R5cGUucmV2ZXJ0PU87QS5wcm90b3R5cGUubXVsVG89ZnVuY3Rpb24oYSxiLGMpe2EubXVsdGlwbHlUbyhiLFxuYyl9O0EucHJvdG90eXBlLnNxclRvPWZ1bmN0aW9uKGEsYil7YS5zcXVhcmVUbyhiKX07dy5wcm90b3R5cGUuY29udmVydD1mdW5jdGlvbihhKXtpZigwPmEuc3x8YS50PjIqdGhpcy5tLnQpcmV0dXJuIGEubW9kKHRoaXMubSk7aWYoMD5hLmNvbXBhcmVUbyh0aGlzLm0pKXJldHVybiBhO3ZhciBiPXEoKTthLmNvcHlUbyhiKTt0aGlzLnJlZHVjZShiKTtyZXR1cm4gYn07dy5wcm90b3R5cGUucmV2ZXJ0PWZ1bmN0aW9uKGEpe3JldHVybiBhfTt3LnByb3RvdHlwZS5yZWR1Y2U9ZnVuY3Rpb24oYSl7YS5kclNoaWZ0VG8odGhpcy5tLnQtMSx0aGlzLnIyKTthLnQ+dGhpcy5tLnQrMSYmKGEudD10aGlzLm0udCsxLGEuY2xhbXAoKSk7dGhpcy5tdS5tdWx0aXBseVVwcGVyVG8odGhpcy5yMix0aGlzLm0udCsxLHRoaXMucTMpO2Zvcih0aGlzLm0ubXVsdGlwbHlMb3dlclRvKHRoaXMucTMsdGhpcy5tLnQrMSx0aGlzLnIyKTswPmEuY29tcGFyZVRvKHRoaXMucjIpOylhLmRBZGRPZmZzZXQoMSxcbnRoaXMubS50KzEpO2ZvcihhLnN1YlRvKHRoaXMucjIsYSk7MDw9YS5jb21wYXJlVG8odGhpcy5tKTspYS5zdWJUbyh0aGlzLm0sYSl9O3cucHJvdG90eXBlLm11bFRvPWZ1bmN0aW9uKGEsYixjKXthLm11bHRpcGx5VG8oYixjKTt0aGlzLnJlZHVjZShjKX07dy5wcm90b3R5cGUuc3FyVG89ZnVuY3Rpb24oYSxiKXthLnNxdWFyZVRvKGIpO3RoaXMucmVkdWNlKGIpfTt2YXIgdD1bMiwzLDUsNywxMSwxMywxNywxOSwyMywyOSwzMSwzNyw0MSw0Myw0Nyw1Myw1OSw2MSw2Nyw3MSw3Myw3OSw4Myw4OSw5NywxMDEsMTAzLDEwNywxMDksMTEzLDEyNywxMzEsMTM3LDEzOSwxNDksMTUxLDE1NywxNjMsMTY3LDE3MywxNzksMTgxLDE5MSwxOTMsMTk3LDE5OSwyMTEsMjIzLDIyNywyMjksMjMzLDIzOSwyNDEsMjUxLDI1NywyNjMsMjY5LDI3MSwyNzcsMjgxLDI4MywyOTMsMzA3LDMxMSwzMTMsMzE3LDMzMSwzMzcsMzQ3LDM0OSwzNTMsMzU5LDM2NywzNzMsMzc5LDM4MywzODksMzk3LDQwMSxcbjQwOSw0MTksNDIxLDQzMSw0MzMsNDM5LDQ0Myw0NDksNDU3LDQ2MSw0NjMsNDY3LDQ3OSw0ODcsNDkxLDQ5OSw1MDMsNTA5LDUyMSw1MjMsNTQxLDU0Nyw1NTcsNTYzLDU2OSw1NzEsNTc3LDU4Nyw1OTMsNTk5LDYwMSw2MDcsNjEzLDYxNyw2MTksNjMxLDY0MSw2NDMsNjQ3LDY1Myw2NTksNjYxLDY3Myw2NzcsNjgzLDY5MSw3MDEsNzA5LDcxOSw3MjcsNzMzLDczOSw3NDMsNzUxLDc1Nyw3NjEsNzY5LDc3Myw3ODcsNzk3LDgwOSw4MTEsODIxLDgyMyw4MjcsODI5LDgzOSw4NTMsODU3LDg1OSw4NjMsODc3LDg4MSw4ODMsODg3LDkwNyw5MTEsOTE5LDkyOSw5MzcsOTQxLDk0Nyw5NTMsOTY3LDk3MSw5NzcsOTgzLDk5MSw5OTddLFY9NjcxMDg4NjQvdFt0Lmxlbmd0aC0xXTtrLnByb3RvdHlwZS5jaHVua1NpemU9ZnVuY3Rpb24oYSl7cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5MTjIqdGhpcy5EQi9NYXRoLmxvZyhhKSl9O2sucHJvdG90eXBlLnRvUmFkaXg9ZnVuY3Rpb24oYSl7bnVsbD09XG5hJiYoYT0xMCk7aWYoMD09dGhpcy5zaWdudW0oKXx8Mj5hfHwzNjxhKXJldHVyblwiMFwiO3ZhciBiPXRoaXMuY2h1bmtTaXplKGEpLGI9TWF0aC5wb3coYSxiKSxjPXYoYiksZT1xKCksZD1xKCksZz1cIlwiO2Zvcih0aGlzLmRpdlJlbVRvKGMsZSxkKTswPGUuc2lnbnVtKCk7KWc9KGIrZC5pbnRWYWx1ZSgpKS50b1N0cmluZyhhKS5zdWJzdHIoMSkrZyxlLmRpdlJlbVRvKGMsZSxkKTtyZXR1cm4gZC5pbnRWYWx1ZSgpLnRvU3RyaW5nKGEpK2d9O2sucHJvdG90eXBlLmZyb21SYWRpeD1mdW5jdGlvbihhLGIpe3RoaXMuZnJvbUludCgwKTtudWxsPT1iJiYoYj0xMCk7Zm9yKHZhciBjPXRoaXMuY2h1bmtTaXplKGIpLGU9TWF0aC5wb3coYixjKSxkPSExLGc9MCxoPTAsbD0wO2w8YS5sZW5ndGg7KytsKXt2YXIgej1MKGEsbCk7MD56P1wiLVwiPT1hLmNoYXJBdChsKSYmMD09dGhpcy5zaWdudW0oKSYmKGQ9ITApOihoPWIqaCt6LCsrZz49YyYmKHRoaXMuZE11bHRpcGx5KGUpLHRoaXMuZEFkZE9mZnNldChoLFxuMCksaD1nPTApKX0wPGcmJih0aGlzLmRNdWx0aXBseShNYXRoLnBvdyhiLGcpKSx0aGlzLmRBZGRPZmZzZXQoaCwwKSk7ZCYmay5aRVJPLnN1YlRvKHRoaXMsdGhpcyl9O2sucHJvdG90eXBlLmZyb21OdW1iZXI9ZnVuY3Rpb24oYSxiLGMpe2lmKFwibnVtYmVyXCI9PXR5cGVvZiBiKWlmKDI+YSl0aGlzLmZyb21JbnQoMSk7ZWxzZSBmb3IodGhpcy5mcm9tTnVtYmVyKGEsYyksdGhpcy50ZXN0Qml0KGEtMSl8fHRoaXMuYml0d2lzZVRvKGsuT05FLnNoaWZ0TGVmdChhLTEpLEksdGhpcyksdGhpcy5pc0V2ZW4oKSYmdGhpcy5kQWRkT2Zmc2V0KDEsMCk7IXRoaXMuaXNQcm9iYWJsZVByaW1lKGIpOyl0aGlzLmRBZGRPZmZzZXQoMiwwKSx0aGlzLmJpdExlbmd0aCgpPmEmJnRoaXMuc3ViVG8oay5PTkUuc2hpZnRMZWZ0KGEtMSksdGhpcyk7ZWxzZXtjPVtdO3ZhciBlPWEmNztjLmxlbmd0aD0oYT4+MykrMTtiLm5leHRCeXRlcyhjKTtjWzBdPTA8ZT9jWzBdJigxPDxlKS0xOjA7dGhpcy5mcm9tU3RyaW5nKGMsXG4yNTYpfX07ay5wcm90b3R5cGUuYml0d2lzZVRvPWZ1bmN0aW9uKGEsYixjKXt2YXIgZSxkLGc9TWF0aC5taW4oYS50LHRoaXMudCk7Zm9yKGU9MDtlPGc7KytlKWNbZV09Yih0aGlzW2VdLGFbZV0pO2lmKGEudDx0aGlzLnQpe2Q9YS5zJnRoaXMuRE07Zm9yKGU9ZztlPHRoaXMudDsrK2UpY1tlXT1iKHRoaXNbZV0sZCk7Yy50PXRoaXMudH1lbHNle2Q9dGhpcy5zJnRoaXMuRE07Zm9yKGU9ZztlPGEudDsrK2UpY1tlXT1iKGQsYVtlXSk7Yy50PWEudH1jLnM9Yih0aGlzLnMsYS5zKTtjLmNsYW1wKCl9O2sucHJvdG90eXBlLmNoYW5nZUJpdD1mdW5jdGlvbihhLGIpe3ZhciBjPWsuT05FLnNoaWZ0TGVmdChhKTt0aGlzLmJpdHdpc2VUbyhjLGIsYyk7cmV0dXJuIGN9O2sucHJvdG90eXBlLmFkZFRvPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPTAsZT0wLGQ9TWF0aC5taW4oYS50LHRoaXMudCk7YzxkOyllKz10aGlzW2NdK2FbY10sYltjKytdPWUmdGhpcy5ETSxlPj49dGhpcy5EQjtpZihhLnQ8XG50aGlzLnQpe2ZvcihlKz1hLnM7Yzx0aGlzLnQ7KWUrPXRoaXNbY10sYltjKytdPWUmdGhpcy5ETSxlPj49dGhpcy5EQjtlKz10aGlzLnN9ZWxzZXtmb3IoZSs9dGhpcy5zO2M8YS50OyllKz1hW2NdLGJbYysrXT1lJnRoaXMuRE0sZT4+PXRoaXMuREI7ZSs9YS5zfWIucz0wPmU/LTE6MDswPGU/YltjKytdPWU6LTE+ZSYmKGJbYysrXT10aGlzLkRWK2UpO2IudD1jO2IuY2xhbXAoKX07ay5wcm90b3R5cGUuZE11bHRpcGx5PWZ1bmN0aW9uKGEpe3RoaXNbdGhpcy50XT10aGlzLmFtKDAsYS0xLHRoaXMsMCwwLHRoaXMudCk7Kyt0aGlzLnQ7dGhpcy5jbGFtcCgpfTtrLnByb3RvdHlwZS5kQWRkT2Zmc2V0PWZ1bmN0aW9uKGEsYil7aWYoMCE9YSl7Zm9yKDt0aGlzLnQ8PWI7KXRoaXNbdGhpcy50KytdPTA7Zm9yKHRoaXNbYl0rPWE7dGhpc1tiXT49dGhpcy5EVjspdGhpc1tiXS09dGhpcy5EViwrK2I+PXRoaXMudCYmKHRoaXNbdGhpcy50KytdPTApLCsrdGhpc1tiXX19O2sucHJvdG90eXBlLm11bHRpcGx5TG93ZXJUbz1cbmZ1bmN0aW9uKGEsYixjKXt2YXIgZT1NYXRoLm1pbih0aGlzLnQrYS50LGIpO2Mucz0wO2ZvcihjLnQ9ZTswPGU7KWNbLS1lXT0wO3ZhciBkO2ZvcihkPWMudC10aGlzLnQ7ZTxkOysrZSljW2UrdGhpcy50XT10aGlzLmFtKDAsYVtlXSxjLGUsMCx0aGlzLnQpO2ZvcihkPU1hdGgubWluKGEudCxiKTtlPGQ7KytlKXRoaXMuYW0oMCxhW2VdLGMsZSwwLGItZSk7Yy5jbGFtcCgpfTtrLnByb3RvdHlwZS5tdWx0aXBseVVwcGVyVG89ZnVuY3Rpb24oYSxiLGMpey0tYjt2YXIgZT1jLnQ9dGhpcy50K2EudC1iO2ZvcihjLnM9MDswPD0tLWU7KWNbZV09MDtmb3IoZT1NYXRoLm1heChiLXRoaXMudCwwKTtlPGEudDsrK2UpY1t0aGlzLnQrZS1iXT10aGlzLmFtKGItZSxhW2VdLGMsMCwwLHRoaXMudCtlLWIpO2MuY2xhbXAoKTtjLmRyU2hpZnRUbygxLGMpfTtrLnByb3RvdHlwZS5tb2RJbnQ9ZnVuY3Rpb24oYSl7aWYoMD49YSlyZXR1cm4gMDt2YXIgYj10aGlzLkRWJWEsYz0wPnRoaXMucz9hLVxuMTowO2lmKDA8dGhpcy50KWlmKDA9PWIpYz10aGlzWzBdJWE7ZWxzZSBmb3IodmFyIGU9dGhpcy50LTE7MDw9ZTstLWUpYz0oYipjK3RoaXNbZV0pJWE7cmV0dXJuIGN9O2sucHJvdG90eXBlLm1pbGxlclJhYmluPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuc3VidHJhY3Qoay5PTkUpLGM9Yi5nZXRMb3dlc3RTZXRCaXQoKTtpZigwPj1jKXJldHVybiExO3ZhciBlPWIuc2hpZnRSaWdodChjKTthPWErMT4+MTthPnQubGVuZ3RoJiYoYT10Lmxlbmd0aCk7Zm9yKHZhciBkPXEoKSxnPTA7ZzxhOysrZyl7ZC5mcm9tSW50KHRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnQubGVuZ3RoKV0pO3ZhciBoPWQubW9kUG93KGUsdGhpcyk7aWYoMCE9aC5jb21wYXJlVG8oay5PTkUpJiYwIT1oLmNvbXBhcmVUbyhiKSl7Zm9yKHZhciBsPTE7bCsrPGMmJjAhPWguY29tcGFyZVRvKGIpOylpZihoPWgubW9kUG93SW50KDIsdGhpcyksMD09aC5jb21wYXJlVG8oay5PTkUpKXJldHVybiExO2lmKDAhPWguY29tcGFyZVRvKGIpKXJldHVybiExfX1yZXR1cm4hMH07XG5rLnByb3RvdHlwZS5jbG9uZT1mdW5jdGlvbigpe3ZhciBhPXEoKTt0aGlzLmNvcHlUbyhhKTtyZXR1cm4gYX07ay5wcm90b3R5cGUuaW50VmFsdWU9ZnVuY3Rpb24oKXtpZigwPnRoaXMucyl7aWYoMT09dGhpcy50KXJldHVybiB0aGlzWzBdLXRoaXMuRFY7aWYoMD09dGhpcy50KXJldHVybi0xfWVsc2V7aWYoMT09dGhpcy50KXJldHVybiB0aGlzWzBdO2lmKDA9PXRoaXMudClyZXR1cm4gMH1yZXR1cm4odGhpc1sxXSYoMTw8MzItdGhpcy5EQiktMSk8PHRoaXMuREJ8dGhpc1swXX07ay5wcm90b3R5cGUuYnl0ZVZhbHVlPWZ1bmN0aW9uKCl7cmV0dXJuIDA9PXRoaXMudD90aGlzLnM6dGhpc1swXTw8MjQ+PjI0fTtrLnByb3RvdHlwZS5zaG9ydFZhbHVlPWZ1bmN0aW9uKCl7cmV0dXJuIDA9PXRoaXMudD90aGlzLnM6dGhpc1swXTw8MTY+PjE2fTtrLnByb3RvdHlwZS5zaWdudW09ZnVuY3Rpb24oKXtyZXR1cm4gMD50aGlzLnM/LTE6MD49dGhpcy50fHwxPT10aGlzLnQmJjA+PXRoaXNbMF0/XG4wOjF9O2sucHJvdG90eXBlLnRvQnl0ZUFycmF5PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy50LGI9W107YlswXT10aGlzLnM7dmFyIGM9dGhpcy5EQi1hKnRoaXMuREIlOCxlLGQ9MDtpZigwPGEtLSlmb3IoYzx0aGlzLkRCJiYoZT10aGlzW2FdPj5jKSE9KHRoaXMucyZ0aGlzLkRNKT4+YyYmKGJbZCsrXT1lfHRoaXMuczw8dGhpcy5EQi1jKTswPD1hOylpZig4PmM/KGU9KHRoaXNbYV0mKDE8PGMpLTEpPDw4LWMsZXw9dGhpc1stLWFdPj4oYys9dGhpcy5EQi04KSk6KGU9dGhpc1thXT4+KGMtPTgpJjI1NSwwPj1jJiYoYys9dGhpcy5EQiwtLWEpKSwwIT0oZSYxMjgpJiYoZXw9LTI1NiksMD09ZCYmKHRoaXMucyYxMjgpIT0oZSYxMjgpJiYrK2QsMDxkfHxlIT10aGlzLnMpYltkKytdPWU7cmV0dXJuIGJ9O2sucHJvdG90eXBlLmVxdWFscz1mdW5jdGlvbihhKXtyZXR1cm4gMD09dGhpcy5jb21wYXJlVG8oYSl9O2sucHJvdG90eXBlLm1pbj1mdW5jdGlvbihhKXtyZXR1cm4gMD50aGlzLmNvbXBhcmVUbyhhKT9cbnRoaXM6YX07ay5wcm90b3R5cGUubWF4PWZ1bmN0aW9uKGEpe3JldHVybiAwPHRoaXMuY29tcGFyZVRvKGEpP3RoaXM6YX07ay5wcm90b3R5cGUuYW5kPWZ1bmN0aW9uKGEpe3ZhciBiPXEoKTt0aGlzLmJpdHdpc2VUbyhhLFQsYik7cmV0dXJuIGJ9O2sucHJvdG90eXBlLm9yPWZ1bmN0aW9uKGEpe3ZhciBiPXEoKTt0aGlzLmJpdHdpc2VUbyhhLEksYik7cmV0dXJuIGJ9O2sucHJvdG90eXBlLnhvcj1mdW5jdGlvbihhKXt2YXIgYj1xKCk7dGhpcy5iaXR3aXNlVG8oYSxNLGIpO3JldHVybiBifTtrLnByb3RvdHlwZS5hbmROb3Q9ZnVuY3Rpb24oYSl7dmFyIGI9cSgpO3RoaXMuYml0d2lzZVRvKGEsTixiKTtyZXR1cm4gYn07ay5wcm90b3R5cGUubm90PWZ1bmN0aW9uKCl7Zm9yKHZhciBhPXEoKSxiPTA7Yjx0aGlzLnQ7KytiKWFbYl09dGhpcy5ETSZ+dGhpc1tiXTthLnQ9dGhpcy50O2Eucz1+dGhpcy5zO3JldHVybiBhfTtrLnByb3RvdHlwZS5zaGlmdExlZnQ9ZnVuY3Rpb24oYSl7dmFyIGI9XG5xKCk7MD5hP3RoaXMuclNoaWZ0VG8oLWEsYik6dGhpcy5sU2hpZnRUbyhhLGIpO3JldHVybiBifTtrLnByb3RvdHlwZS5zaGlmdFJpZ2h0PWZ1bmN0aW9uKGEpe3ZhciBiPXEoKTswPmE/dGhpcy5sU2hpZnRUbygtYSxiKTp0aGlzLnJTaGlmdFRvKGEsYik7cmV0dXJuIGJ9O2sucHJvdG90eXBlLmdldExvd2VzdFNldEJpdD1mdW5jdGlvbigpe2Zvcih2YXIgYT0wO2E8dGhpcy50OysrYSlpZigwIT10aGlzW2FdKXt2YXIgYj1hKnRoaXMuREI7YT10aGlzW2FdO2lmKDA9PWEpYT0tMTtlbHNle3ZhciBjPTA7MD09KGEmNjU1MzUpJiYoYT4+PTE2LGMrPTE2KTswPT0oYSYyNTUpJiYoYT4+PTgsYys9OCk7MD09KGEmMTUpJiYoYT4+PTQsYys9NCk7MD09KGEmMykmJihhPj49MixjKz0yKTswPT0oYSYxKSYmKytjO2E9Y31yZXR1cm4gYithfXJldHVybiAwPnRoaXMucz90aGlzLnQqdGhpcy5EQjotMX07ay5wcm90b3R5cGUuYml0Q291bnQ9ZnVuY3Rpb24oKXtmb3IodmFyIGE9MCxiPXRoaXMucyZcbnRoaXMuRE0sYz0wO2M8dGhpcy50OysrYyl7Zm9yKHZhciBlPXRoaXNbY11eYixkPTA7MCE9ZTspZSY9ZS0xLCsrZDthKz1kfXJldHVybiBhfTtrLnByb3RvdHlwZS50ZXN0Qml0PWZ1bmN0aW9uKGEpe3ZhciBiPU1hdGguZmxvb3IoYS90aGlzLkRCKTtyZXR1cm4gYj49dGhpcy50PzAhPXRoaXMuczowIT0odGhpc1tiXSYxPDxhJXRoaXMuREIpfTtrLnByb3RvdHlwZS5zZXRCaXQ9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuY2hhbmdlQml0KGEsSSl9O2sucHJvdG90eXBlLmNsZWFyQml0PWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmNoYW5nZUJpdChhLE4pfTtrLnByb3RvdHlwZS5mbGlwQml0PWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmNoYW5nZUJpdChhLE0pfTtrLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24oYSl7dmFyIGI9cSgpO3RoaXMuYWRkVG8oYSxiKTtyZXR1cm4gYn07ay5wcm90b3R5cGUuc3VidHJhY3Q9ZnVuY3Rpb24oYSl7dmFyIGI9cSgpO3RoaXMuc3ViVG8oYSxiKTtyZXR1cm4gYn07XG5rLnByb3RvdHlwZS5tdWx0aXBseT1mdW5jdGlvbihhKXt2YXIgYj1xKCk7dGhpcy5tdWx0aXBseVRvKGEsYik7cmV0dXJuIGJ9O2sucHJvdG90eXBlLmRpdmlkZT1mdW5jdGlvbihhKXt2YXIgYj1xKCk7dGhpcy5kaXZSZW1UbyhhLGIsbnVsbCk7cmV0dXJuIGJ9O2sucHJvdG90eXBlLnJlbWFpbmRlcj1mdW5jdGlvbihhKXt2YXIgYj1xKCk7dGhpcy5kaXZSZW1UbyhhLG51bGwsYik7cmV0dXJuIGJ9O2sucHJvdG90eXBlLmRpdmlkZUFuZFJlbWFpbmRlcj1mdW5jdGlvbihhKXt2YXIgYj1xKCksYz1xKCk7dGhpcy5kaXZSZW1UbyhhLGIsYyk7cmV0dXJuW2IsY119O2sucHJvdG90eXBlLm1vZFBvdz1mdW5jdGlvbihhLGIpe3ZhciBjPWEuYml0TGVuZ3RoKCksZSxkPXYoMSksZztpZigwPj1jKXJldHVybiBkO2U9MTg+Yz8xOjQ4PmM/MzoxNDQ+Yz80Ojc2OD5jPzU6NjtnPTg+Yz9uZXcgeChiKTpiLmlzRXZlbigpP25ldyB3KGIpOm5ldyB5KGIpO3ZhciBoPVtdLGw9MyxrPWUtMSxuPSgxPDxcbmUpLTE7aFsxXT1nLmNvbnZlcnQodGhpcyk7aWYoMTxlKWZvcihjPXEoKSxnLnNxclRvKGhbMV0sYyk7bDw9bjspaFtsXT1xKCksZy5tdWxUbyhjLGhbbC0yXSxoW2xdKSxsKz0yO2Zvcih2YXIgbT1hLnQtMSxwLHI9ITAscz1xKCksYz1DKGFbbV0pLTE7MDw9bTspe2M+PWs/cD1hW21dPj5jLWsmbjoocD0oYVttXSYoMTw8YysxKS0xKTw8ay1jLDA8bSYmKHB8PWFbbS0xXT4+dGhpcy5EQitjLWspKTtmb3IobD1lOzA9PShwJjEpOylwPj49MSwtLWw7MD4oYy09bCkmJihjKz10aGlzLkRCLC0tbSk7aWYociloW3BdLmNvcHlUbyhkKSxyPSExO2Vsc2V7Zm9yKDsxPGw7KWcuc3FyVG8oZCxzKSxnLnNxclRvKHMsZCksbC09MjswPGw/Zy5zcXJUbyhkLHMpOihsPWQsZD1zLHM9bCk7Zy5tdWxUbyhzLGhbcF0sZCl9Zm9yKDswPD1tJiYwPT0oYVttXSYxPDxjKTspZy5zcXJUbyhkLHMpLGw9ZCxkPXMscz1sLDA+LS1jJiYoYz10aGlzLkRCLTEsLS1tKX1yZXR1cm4gZy5yZXZlcnQoZCl9O2sucHJvdG90eXBlLm1vZEludmVyc2U9XG5mdW5jdGlvbihhKXt2YXIgYj1hLmlzRXZlbigpO2lmKHRoaXMuaXNFdmVuKCkmJmJ8fDA9PWEuc2lnbnVtKCkpcmV0dXJuIGsuWkVSTztmb3IodmFyIGM9YS5jbG9uZSgpLGU9dGhpcy5jbG9uZSgpLGQ9digxKSxnPXYoMCksaD12KDApLGw9digxKTswIT1jLnNpZ251bSgpOyl7Zm9yKDtjLmlzRXZlbigpOyljLnJTaGlmdFRvKDEsYyksYj8oZC5pc0V2ZW4oKSYmZy5pc0V2ZW4oKXx8KGQuYWRkVG8odGhpcyxkKSxnLnN1YlRvKGEsZykpLGQuclNoaWZ0VG8oMSxkKSk6Zy5pc0V2ZW4oKXx8Zy5zdWJUbyhhLGcpLGcuclNoaWZ0VG8oMSxnKTtmb3IoO2UuaXNFdmVuKCk7KWUuclNoaWZ0VG8oMSxlKSxiPyhoLmlzRXZlbigpJiZsLmlzRXZlbigpfHwoaC5hZGRUbyh0aGlzLGgpLGwuc3ViVG8oYSxsKSksaC5yU2hpZnRUbygxLGgpKTpsLmlzRXZlbigpfHxsLnN1YlRvKGEsbCksbC5yU2hpZnRUbygxLGwpOzA8PWMuY29tcGFyZVRvKGUpPyhjLnN1YlRvKGUsYyksYiYmZC5zdWJUbyhoLGQpLFxuZy5zdWJUbyhsLGcpKTooZS5zdWJUbyhjLGUpLGImJmguc3ViVG8oZCxoKSxsLnN1YlRvKGcsbCkpfWlmKDAhPWUuY29tcGFyZVRvKGsuT05FKSlyZXR1cm4gay5aRVJPO2lmKDA8PWwuY29tcGFyZVRvKGEpKXJldHVybiBsLnN1YnRyYWN0KGEpO2lmKDA+bC5zaWdudW0oKSlsLmFkZFRvKGEsbCk7ZWxzZSByZXR1cm4gbDtyZXR1cm4gMD5sLnNpZ251bSgpP2wuYWRkKGEpOmx9O2sucHJvdG90eXBlLnBvdz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5leHAoYSxuZXcgQSl9O2sucHJvdG90eXBlLmdjZD1mdW5jdGlvbihhKXt2YXIgYj0wPnRoaXMucz90aGlzLm5lZ2F0ZSgpOnRoaXMuY2xvbmUoKTthPTA+YS5zP2EubmVnYXRlKCk6YS5jbG9uZSgpO2lmKDA+Yi5jb21wYXJlVG8oYSkpe3ZhciBjPWIsYj1hO2E9Y312YXIgYz1iLmdldExvd2VzdFNldEJpdCgpLGU9YS5nZXRMb3dlc3RTZXRCaXQoKTtpZigwPmUpcmV0dXJuIGI7YzxlJiYoZT1jKTswPGUmJihiLnJTaGlmdFRvKGUsYiksXG5hLnJTaGlmdFRvKGUsYSkpO2Zvcig7MDxiLnNpZ251bSgpOykwPChjPWIuZ2V0TG93ZXN0U2V0Qml0KCkpJiZiLnJTaGlmdFRvKGMsYiksMDwoYz1hLmdldExvd2VzdFNldEJpdCgpKSYmYS5yU2hpZnRUbyhjLGEpLDA8PWIuY29tcGFyZVRvKGEpPyhiLnN1YlRvKGEsYiksYi5yU2hpZnRUbygxLGIpKTooYS5zdWJUbyhiLGEpLGEuclNoaWZ0VG8oMSxhKSk7MDxlJiZhLmxTaGlmdFRvKGUsYSk7cmV0dXJuIGF9O2sucHJvdG90eXBlLmlzUHJvYmFibGVQcmltZT1mdW5jdGlvbihhKXt2YXIgYixjPXRoaXMuYWJzKCk7aWYoMT09Yy50JiZjWzBdPD10W3QubGVuZ3RoLTFdKXtmb3IoYj0wO2I8dC5sZW5ndGg7KytiKWlmKGNbMF09PXRbYl0pcmV0dXJuITA7cmV0dXJuITF9aWYoYy5pc0V2ZW4oKSlyZXR1cm4hMTtmb3IoYj0xO2I8dC5sZW5ndGg7KXtmb3IodmFyIGU9dFtiXSxkPWIrMTtkPHQubGVuZ3RoJiZlPFY7KWUqPXRbZCsrXTtmb3IoZT1jLm1vZEludChlKTtiPGQ7KWlmKDA9PWUlXG50W2IrK10pcmV0dXJuITF9cmV0dXJuIGMubWlsbGVyUmFiaW4oYSl9O2sucHJvdG90eXBlLnNxdWFyZT1mdW5jdGlvbigpe3ZhciBhPXEoKTt0aGlzLnNxdWFyZVRvKGEpO3JldHVybiBhfTt2YXIgbT1rO20ucHJvdG90eXBlLklzTmVnYXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4tMT09dGhpcy5jb21wYXJlVG8obS5aRVJPKT8hMDohMX07bS5vcF9FcXVhbGl0eT1mdW5jdGlvbihhLGIpe3JldHVybiAwPT1hLmNvbXBhcmVUbyhiKT8hMDohMX07bS5vcF9JbmVxdWFsaXR5PWZ1bmN0aW9uKGEsYil7cmV0dXJuIDAhPWEuY29tcGFyZVRvKGIpPyEwOiExfTttLm9wX0dyZWF0ZXJUaGFuPWZ1bmN0aW9uKGEsYil7cmV0dXJuIDA8YS5jb21wYXJlVG8oYik/ITA6ITF9O20ub3BfTGVzc1RoYW49ZnVuY3Rpb24oYSxiKXtyZXR1cm4gMD5hLmNvbXBhcmVUbyhiKT8hMDohMX07bS5vcF9BZGRpdGlvbj1mdW5jdGlvbihhLGIpe3JldHVybihuZXcgbShhKSkuYWRkKG5ldyBtKGIpKX07bS5vcF9TdWJ0cmFjdGlvbj1cbmZ1bmN0aW9uKGEsYil7cmV0dXJuKG5ldyBtKGEpKS5zdWJ0cmFjdChuZXcgbShiKSl9O20uSW50MTI4TXVsPWZ1bmN0aW9uKGEsYil7cmV0dXJuKG5ldyBtKGEpKS5tdWx0aXBseShuZXcgbShiKSl9O20ub3BfRGl2aXNpb249ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5kaXZpZGUoYil9O20ucHJvdG90eXBlLlRvRG91YmxlPWZ1bmN0aW9uKCl7cmV0dXJuIHBhcnNlRmxvYXQodGhpcy50b1N0cmluZygpKX07aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIEspdmFyIEs9ZnVuY3Rpb24oYSxiKXt2YXIgYztpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpZm9yKGMgaW4gYi5wcm90b3R5cGUpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBhLnByb3RvdHlwZVtjXXx8YS5wcm90b3R5cGVbY109PU9iamVjdC5wcm90b3R5cGVbY10pYS5wcm90b3R5cGVbY109Yi5wcm90b3R5cGVbY119ZWxzZSBmb3IodmFyIGU9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYi5wcm90b3R5cGUpLFxuZD0wO2Q8ZS5sZW5ndGg7ZCsrKVwidW5kZWZpbmVkXCI9PXR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGEucHJvdG90eXBlLGVbZF0pJiZPYmplY3QuZGVmaW5lUHJvcGVydHkoYS5wcm90b3R5cGUsZVtkXSxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGIucHJvdG90eXBlLGVbZF0pKTtmb3IoYyBpbiBiKVwidW5kZWZpbmVkXCI9PXR5cGVvZiBhW2NdJiYoYVtjXT1iW2NdKTthLiRiYXNlQ3Rvcj1ifTtkLlBhdGg9ZnVuY3Rpb24oKXtyZXR1cm5bXX07ZC5QYXRocz1mdW5jdGlvbigpe3JldHVybltdfTtkLkRvdWJsZVBvaW50PWZ1bmN0aW9uKCl7dmFyIGE9YXJndW1lbnRzO3RoaXMuWT10aGlzLlg9MDsxPT1hLmxlbmd0aD8odGhpcy5YPWFbMF0uWCx0aGlzLlk9YVswXS5ZKToyPT1hLmxlbmd0aCYmKHRoaXMuWD1hWzBdLHRoaXMuWT1hWzFdKX07ZC5Eb3VibGVQb2ludDA9ZnVuY3Rpb24oKXt0aGlzLlk9dGhpcy5YPTB9O2QuRG91YmxlUG9pbnQxPWZ1bmN0aW9uKGEpe3RoaXMuWD1cbmEuWDt0aGlzLlk9YS5ZfTtkLkRvdWJsZVBvaW50Mj1mdW5jdGlvbihhLGIpe3RoaXMuWD1hO3RoaXMuWT1ifTtkLlBvbHlOb2RlPWZ1bmN0aW9uKCl7dGhpcy5tX1BhcmVudD1udWxsO3RoaXMubV9wb2x5Z29uPW5ldyBkLlBhdGg7dGhpcy5tX2VuZHR5cGU9dGhpcy5tX2pvaW50eXBlPXRoaXMubV9JbmRleD0wO3RoaXMubV9DaGlsZHM9W107dGhpcy5Jc09wZW49ITF9O2QuUG9seU5vZGUucHJvdG90eXBlLklzSG9sZU5vZGU9ZnVuY3Rpb24oKXtmb3IodmFyIGE9ITAsYj10aGlzLm1fUGFyZW50O251bGwhPT1iOylhPSFhLGI9Yi5tX1BhcmVudDtyZXR1cm4gYX07ZC5Qb2x5Tm9kZS5wcm90b3R5cGUuQ2hpbGRDb3VudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLm1fQ2hpbGRzLmxlbmd0aH07ZC5Qb2x5Tm9kZS5wcm90b3R5cGUuQ29udG91cj1mdW5jdGlvbigpe3JldHVybiB0aGlzLm1fcG9seWdvbn07ZC5Qb2x5Tm9kZS5wcm90b3R5cGUuQWRkQ2hpbGQ9ZnVuY3Rpb24oYSl7dmFyIGI9XG50aGlzLm1fQ2hpbGRzLmxlbmd0aDt0aGlzLm1fQ2hpbGRzLnB1c2goYSk7YS5tX1BhcmVudD10aGlzO2EubV9JbmRleD1ifTtkLlBvbHlOb2RlLnByb3RvdHlwZS5HZXROZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIDA8dGhpcy5tX0NoaWxkcy5sZW5ndGg/dGhpcy5tX0NoaWxkc1swXTp0aGlzLkdldE5leHRTaWJsaW5nVXAoKX07ZC5Qb2x5Tm9kZS5wcm90b3R5cGUuR2V0TmV4dFNpYmxpbmdVcD1mdW5jdGlvbigpe3JldHVybiBudWxsPT09dGhpcy5tX1BhcmVudD9udWxsOnRoaXMubV9JbmRleD09dGhpcy5tX1BhcmVudC5tX0NoaWxkcy5sZW5ndGgtMT90aGlzLm1fUGFyZW50LkdldE5leHRTaWJsaW5nVXAoKTp0aGlzLm1fUGFyZW50Lm1fQ2hpbGRzW3RoaXMubV9JbmRleCsxXX07ZC5Qb2x5Tm9kZS5wcm90b3R5cGUuQ2hpbGRzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubV9DaGlsZHN9O2QuUG9seU5vZGUucHJvdG90eXBlLlBhcmVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLm1fUGFyZW50fTtcbmQuUG9seU5vZGUucHJvdG90eXBlLklzSG9sZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLklzSG9sZU5vZGUoKX07ZC5Qb2x5VHJlZT1mdW5jdGlvbigpe3RoaXMubV9BbGxQb2x5cz1bXTtkLlBvbHlOb2RlLmNhbGwodGhpcyl9O2QuUG9seVRyZWUucHJvdG90eXBlLkNsZWFyPWZ1bmN0aW9uKCl7Zm9yKHZhciBhPTAsYj10aGlzLm1fQWxsUG9seXMubGVuZ3RoO2E8YjthKyspdGhpcy5tX0FsbFBvbHlzW2FdPW51bGw7dGhpcy5tX0FsbFBvbHlzLmxlbmd0aD0wO3RoaXMubV9DaGlsZHMubGVuZ3RoPTB9O2QuUG9seVRyZWUucHJvdG90eXBlLkdldEZpcnN0PWZ1bmN0aW9uKCl7cmV0dXJuIDA8dGhpcy5tX0NoaWxkcy5sZW5ndGg/dGhpcy5tX0NoaWxkc1swXTpudWxsfTtkLlBvbHlUcmVlLnByb3RvdHlwZS5Ub3RhbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLm1fQWxsUG9seXMubGVuZ3RofTtLKGQuUG9seVRyZWUsZC5Qb2x5Tm9kZSk7ZC5NYXRoX0Fic19JbnQ2ND1kLk1hdGhfQWJzX0ludDMyPVxuZC5NYXRoX0Fic19Eb3VibGU9ZnVuY3Rpb24oYSl7cmV0dXJuIE1hdGguYWJzKGEpfTtkLk1hdGhfTWF4X0ludDMyX0ludDMyPWZ1bmN0aW9uKGEsYil7cmV0dXJuIE1hdGgubWF4KGEsYil9O2QuQ2FzdF9JbnQzMj1wfHxHfHxKP2Z1bmN0aW9uKGEpe3JldHVybiBhfDB9OmZ1bmN0aW9uKGEpe3JldHVybn5+YX07ZC5DYXN0X0ludDY0PUU/ZnVuY3Rpb24oYSl7cmV0dXJuLTIxNDc0ODM2NDg+YXx8MjE0NzQ4MzY0NzxhPzA+YT9NYXRoLmNlaWwoYSk6TWF0aC5mbG9vcihhKTp+fmF9OkYmJlwiZnVuY3Rpb25cIj09dHlwZW9mIE51bWJlci50b0ludGVnZXI/ZnVuY3Rpb24oYSl7cmV0dXJuIE51bWJlci50b0ludGVnZXIoYSl9OlB8fEg/ZnVuY3Rpb24oYSl7cmV0dXJuIHBhcnNlSW50KGEsMTApfTpwP2Z1bmN0aW9uKGEpe3JldHVybi0yMTQ3NDgzNjQ4PmF8fDIxNDc0ODM2NDc8YT8wPmE/TWF0aC5jZWlsKGEpOk1hdGguZmxvb3IoYSk6YXwwfTpmdW5jdGlvbihhKXtyZXR1cm4gMD5hP01hdGguY2VpbChhKTpcbk1hdGguZmxvb3IoYSl9O2QuQ2xlYXI9ZnVuY3Rpb24oYSl7YS5sZW5ndGg9MH07ZC5QST0zLjE0MTU5MjY1MzU4OTc5MztkLlBJMj02LjI4MzE4NTMwNzE3OTU4NjtkLkludFBvaW50PWZ1bmN0aW9uKCl7dmFyIGE7YT1hcmd1bWVudHM7dmFyIGI9YS5sZW5ndGg7dGhpcy5ZPXRoaXMuWD0wOzI9PWI/KHRoaXMuWD1hWzBdLHRoaXMuWT1hWzFdKToxPT1iP2FbMF1pbnN0YW5jZW9mIGQuRG91YmxlUG9pbnQ/KGE9YVswXSx0aGlzLlg9ZC5DbGlwcGVyLlJvdW5kKGEuWCksdGhpcy5ZPWQuQ2xpcHBlci5Sb3VuZChhLlkpKTooYT1hWzBdLHRoaXMuWD1hLlgsdGhpcy5ZPWEuWSk6dGhpcy5ZPXRoaXMuWD0wfTtkLkludFBvaW50Lm9wX0VxdWFsaXR5PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuWD09Yi5YJiZhLlk9PWIuWX07ZC5JbnRQb2ludC5vcF9JbmVxdWFsaXR5PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuWCE9Yi5YfHxhLlkhPWIuWX07ZC5JbnRQb2ludDA9ZnVuY3Rpb24oKXt0aGlzLlk9XG50aGlzLlg9MH07ZC5JbnRQb2ludDE9ZnVuY3Rpb24oYSl7dGhpcy5YPWEuWDt0aGlzLlk9YS5ZfTtkLkludFBvaW50MWRwPWZ1bmN0aW9uKGEpe3RoaXMuWD1kLkNsaXBwZXIuUm91bmQoYS5YKTt0aGlzLlk9ZC5DbGlwcGVyLlJvdW5kKGEuWSl9O2QuSW50UG9pbnQyPWZ1bmN0aW9uKGEsYil7dGhpcy5YPWE7dGhpcy5ZPWJ9O2QuSW50UmVjdD1mdW5jdGlvbigpe3ZhciBhPWFyZ3VtZW50cyxiPWEubGVuZ3RoOzQ9PWI/KHRoaXMubGVmdD1hWzBdLHRoaXMudG9wPWFbMV0sdGhpcy5yaWdodD1hWzJdLHRoaXMuYm90dG9tPWFbM10pOjE9PWI/KHRoaXMubGVmdD1pci5sZWZ0LHRoaXMudG9wPWlyLnRvcCx0aGlzLnJpZ2h0PWlyLnJpZ2h0LHRoaXMuYm90dG9tPWlyLmJvdHRvbSk6dGhpcy5ib3R0b209dGhpcy5yaWdodD10aGlzLnRvcD10aGlzLmxlZnQ9MH07ZC5JbnRSZWN0MD1mdW5jdGlvbigpe3RoaXMuYm90dG9tPXRoaXMucmlnaHQ9dGhpcy50b3A9dGhpcy5sZWZ0PTB9O2QuSW50UmVjdDE9XG5mdW5jdGlvbihhKXt0aGlzLmxlZnQ9YS5sZWZ0O3RoaXMudG9wPWEudG9wO3RoaXMucmlnaHQ9YS5yaWdodDt0aGlzLmJvdHRvbT1hLmJvdHRvbX07ZC5JbnRSZWN0ND1mdW5jdGlvbihhLGIsYyxlKXt0aGlzLmxlZnQ9YTt0aGlzLnRvcD1iO3RoaXMucmlnaHQ9Yzt0aGlzLmJvdHRvbT1lfTtkLkNsaXBUeXBlPXtjdEludGVyc2VjdGlvbjowLGN0VW5pb246MSxjdERpZmZlcmVuY2U6MixjdFhvcjozfTtkLlBvbHlUeXBlPXtwdFN1YmplY3Q6MCxwdENsaXA6MX07ZC5Qb2x5RmlsbFR5cGU9e3BmdEV2ZW5PZGQ6MCxwZnROb25aZXJvOjEscGZ0UG9zaXRpdmU6MixwZnROZWdhdGl2ZTozfTtkLkpvaW5UeXBlPXtqdFNxdWFyZTowLGp0Um91bmQ6MSxqdE1pdGVyOjJ9O2QuRW5kVHlwZT17ZXRPcGVuU3F1YXJlOjAsZXRPcGVuUm91bmQ6MSxldE9wZW5CdXR0OjIsZXRDbG9zZWRMaW5lOjMsZXRDbG9zZWRQb2x5Z29uOjR9O2QuRWRnZVNpZGU9e2VzTGVmdDowLGVzUmlnaHQ6MX07ZC5EaXJlY3Rpb249XG57ZFJpZ2h0VG9MZWZ0OjAsZExlZnRUb1JpZ2h0OjF9O2QuVEVkZ2U9ZnVuY3Rpb24oKXt0aGlzLkJvdD1uZXcgZC5JbnRQb2ludDt0aGlzLkN1cnI9bmV3IGQuSW50UG9pbnQ7dGhpcy5Ub3A9bmV3IGQuSW50UG9pbnQ7dGhpcy5EZWx0YT1uZXcgZC5JbnRQb2ludDt0aGlzLkR4PTA7dGhpcy5Qb2x5VHlwPWQuUG9seVR5cGUucHRTdWJqZWN0O3RoaXMuU2lkZT1kLkVkZ2VTaWRlLmVzTGVmdDt0aGlzLk91dElkeD10aGlzLldpbmRDbnQyPXRoaXMuV2luZENudD10aGlzLldpbmREZWx0YT0wO3RoaXMuUHJldkluU0VMPXRoaXMuTmV4dEluU0VMPXRoaXMuUHJldkluQUVMPXRoaXMuTmV4dEluQUVMPXRoaXMuTmV4dEluTE1MPXRoaXMuUHJldj10aGlzLk5leHQ9bnVsbH07ZC5JbnRlcnNlY3ROb2RlPWZ1bmN0aW9uKCl7dGhpcy5FZGdlMj10aGlzLkVkZ2UxPW51bGw7dGhpcy5QdD1uZXcgZC5JbnRQb2ludH07ZC5NeUludGVyc2VjdE5vZGVTb3J0PWZ1bmN0aW9uKCl7fTtkLk15SW50ZXJzZWN0Tm9kZVNvcnQuQ29tcGFyZT1cbmZ1bmN0aW9uKGEsYil7cmV0dXJuIGIuUHQuWS1hLlB0Lll9O2QuTG9jYWxNaW5pbWE9ZnVuY3Rpb24oKXt0aGlzLlk9MDt0aGlzLk5leHQ9dGhpcy5SaWdodEJvdW5kPXRoaXMuTGVmdEJvdW5kPW51bGx9O2QuU2NhbmJlYW09ZnVuY3Rpb24oKXt0aGlzLlk9MDt0aGlzLk5leHQ9bnVsbH07ZC5PdXRSZWM9ZnVuY3Rpb24oKXt0aGlzLklkeD0wO3RoaXMuSXNPcGVuPXRoaXMuSXNIb2xlPSExO3RoaXMuUG9seU5vZGU9dGhpcy5Cb3R0b21QdD10aGlzLlB0cz10aGlzLkZpcnN0TGVmdD1udWxsfTtkLk91dFB0PWZ1bmN0aW9uKCl7dGhpcy5JZHg9MDt0aGlzLlB0PW5ldyBkLkludFBvaW50O3RoaXMuUHJldj10aGlzLk5leHQ9bnVsbH07ZC5Kb2luPWZ1bmN0aW9uKCl7dGhpcy5PdXRQdDI9dGhpcy5PdXRQdDE9bnVsbDt0aGlzLk9mZlB0PW5ldyBkLkludFBvaW50fTtkLkNsaXBwZXJCYXNlPWZ1bmN0aW9uKCl7dGhpcy5tX0N1cnJlbnRMTT10aGlzLm1fTWluaW1hTGlzdD1udWxsO3RoaXMubV9lZGdlcz1cbltdO3RoaXMuUHJlc2VydmVDb2xsaW5lYXI9dGhpcy5tX0hhc09wZW5QYXRocz10aGlzLm1fVXNlRnVsbFJhbmdlPSExO3RoaXMubV9DdXJyZW50TE09dGhpcy5tX01pbmltYUxpc3Q9bnVsbDt0aGlzLm1fSGFzT3BlblBhdGhzPXRoaXMubV9Vc2VGdWxsUmFuZ2U9ITF9O2QuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbD0tOTAwNzE5OTI1NDc0MDk5MjtkLkNsaXBwZXJCYXNlLlNraXA9LTI7ZC5DbGlwcGVyQmFzZS5VbmFzc2lnbmVkPS0xO2QuQ2xpcHBlckJhc2UudG9sZXJhbmNlPTFFLTIwO2QuQ2xpcHBlckJhc2UubG9SYW5nZT00NzQ1MzEzMjtkLkNsaXBwZXJCYXNlLmhpUmFuZ2U9MHhmZmZmZmZmZmZmZmZmO2QuQ2xpcHBlckJhc2UubmVhcl96ZXJvPWZ1bmN0aW9uKGEpe3JldHVybiBhPi1kLkNsaXBwZXJCYXNlLnRvbGVyYW5jZSYmYTxkLkNsaXBwZXJCYXNlLnRvbGVyYW5jZX07ZC5DbGlwcGVyQmFzZS5Jc0hvcml6b250YWw9ZnVuY3Rpb24oYSl7cmV0dXJuIDA9PT1hLkRlbHRhLll9O1xuZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuUG9pbnRJc1ZlcnRleD1mdW5jdGlvbihhLGIpe3ZhciBjPWI7ZG97aWYoZC5JbnRQb2ludC5vcF9FcXVhbGl0eShjLlB0LGEpKXJldHVybiEwO2M9Yy5OZXh0fXdoaWxlKGMhPWIpO3JldHVybiExfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5Qb2ludE9uTGluZVNlZ21lbnQ9ZnVuY3Rpb24oYSxiLGMsZSl7cmV0dXJuIGU/YS5YPT1iLlgmJmEuWT09Yi5ZfHxhLlg9PWMuWCYmYS5ZPT1jLll8fGEuWD5iLlg9PWEuWDxjLlgmJmEuWT5iLlk9PWEuWTxjLlkmJm0ub3BfRXF1YWxpdHkobS5JbnQxMjhNdWwoYS5YLWIuWCxjLlktYi5ZKSxtLkludDEyOE11bChjLlgtYi5YLGEuWS1iLlkpKTphLlg9PWIuWCYmYS5ZPT1iLll8fGEuWD09Yy5YJiZhLlk9PWMuWXx8YS5YPmIuWD09YS5YPGMuWCYmYS5ZPmIuWT09YS5ZPGMuWSYmKGEuWC1iLlgpKihjLlktYi5ZKT09KGMuWC1iLlgpKihhLlktYi5ZKX07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuUG9pbnRPblBvbHlnb249XG5mdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBlPWI7Oyl7aWYodGhpcy5Qb2ludE9uTGluZVNlZ21lbnQoYSxlLlB0LGUuTmV4dC5QdCxjKSlyZXR1cm4hMDtlPWUuTmV4dDtpZihlPT1iKWJyZWFrfXJldHVybiExfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5TbG9wZXNFcXVhbD1kLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsPWZ1bmN0aW9uKCl7dmFyIGE9YXJndW1lbnRzLGI9YS5sZW5ndGgsYyxlLGY7aWYoMz09YilyZXR1cm4gYj1hWzBdLGM9YVsxXSwoYT1hWzJdKT9tLm9wX0VxdWFsaXR5KG0uSW50MTI4TXVsKGIuRGVsdGEuWSxjLkRlbHRhLlgpLG0uSW50MTI4TXVsKGIuRGVsdGEuWCxjLkRlbHRhLlkpKTpkLkNhc3RfSW50NjQoYi5EZWx0YS5ZKmMuRGVsdGEuWCk9PWQuQ2FzdF9JbnQ2NChiLkRlbHRhLlgqYy5EZWx0YS5ZKTtpZig0PT1iKXJldHVybiBiPWFbMF0sYz1hWzFdLGU9YVsyXSwoYT1hWzNdKT9tLm9wX0VxdWFsaXR5KG0uSW50MTI4TXVsKGIuWS1jLlksYy5YLWUuWCksXG5tLkludDEyOE11bChiLlgtYy5YLGMuWS1lLlkpKTowPT09ZC5DYXN0X0ludDY0KChiLlktYy5ZKSooYy5YLWUuWCkpLWQuQ2FzdF9JbnQ2NCgoYi5YLWMuWCkqKGMuWS1lLlkpKTtiPWFbMF07Yz1hWzFdO2U9YVsyXTtmPWFbM107cmV0dXJuKGE9YVs0XSk/bS5vcF9FcXVhbGl0eShtLkludDEyOE11bChiLlktYy5ZLGUuWC1mLlgpLG0uSW50MTI4TXVsKGIuWC1jLlgsZS5ZLWYuWSkpOjA9PT1kLkNhc3RfSW50NjQoKGIuWS1jLlkpKihlLlgtZi5YKSktZC5DYXN0X0ludDY0KChiLlgtYy5YKSooZS5ZLWYuWSkpfTtkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsMz1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIGM/bS5vcF9FcXVhbGl0eShtLkludDEyOE11bChhLkRlbHRhLlksYi5EZWx0YS5YKSxtLkludDEyOE11bChhLkRlbHRhLlgsYi5EZWx0YS5ZKSk6ZC5DYXN0X0ludDY0KGEuRGVsdGEuWSpiLkRlbHRhLlgpPT1kLkNhc3RfSW50NjQoYS5EZWx0YS5YKmIuRGVsdGEuWSl9O2QuQ2xpcHBlckJhc2UuU2xvcGVzRXF1YWw0PVxuZnVuY3Rpb24oYSxiLGMsZSl7cmV0dXJuIGU/bS5vcF9FcXVhbGl0eShtLkludDEyOE11bChhLlktYi5ZLGIuWC1jLlgpLG0uSW50MTI4TXVsKGEuWC1iLlgsYi5ZLWMuWSkpOjA9PT1kLkNhc3RfSW50NjQoKGEuWS1iLlkpKihiLlgtYy5YKSktZC5DYXN0X0ludDY0KChhLlgtYi5YKSooYi5ZLWMuWSkpfTtkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsNT1mdW5jdGlvbihhLGIsYyxlLGYpe3JldHVybiBmP20ub3BfRXF1YWxpdHkobS5JbnQxMjhNdWwoYS5ZLWIuWSxjLlgtZS5YKSxtLkludDEyOE11bChhLlgtYi5YLGMuWS1lLlkpKTowPT09ZC5DYXN0X0ludDY0KChhLlktYi5ZKSooYy5YLWUuWCkpLWQuQ2FzdF9JbnQ2NCgoYS5YLWIuWCkqKGMuWS1lLlkpKX07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuQ2xlYXI9ZnVuY3Rpb24oKXt0aGlzLkRpc3Bvc2VMb2NhbE1pbmltYUxpc3QoKTtmb3IodmFyIGE9MCxiPXRoaXMubV9lZGdlcy5sZW5ndGg7YTxiOysrYSl7Zm9yKHZhciBjPTAsXG5lPXRoaXMubV9lZGdlc1thXS5sZW5ndGg7YzxlOysrYyl0aGlzLm1fZWRnZXNbYV1bY109bnVsbDtkLkNsZWFyKHRoaXMubV9lZGdlc1thXSl9ZC5DbGVhcih0aGlzLm1fZWRnZXMpO3RoaXMubV9IYXNPcGVuUGF0aHM9dGhpcy5tX1VzZUZ1bGxSYW5nZT0hMX07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuRGlzcG9zZUxvY2FsTWluaW1hTGlzdD1mdW5jdGlvbigpe2Zvcig7bnVsbCE9PXRoaXMubV9NaW5pbWFMaXN0Oyl7dmFyIGE9dGhpcy5tX01pbmltYUxpc3QuTmV4dDt0aGlzLm1fTWluaW1hTGlzdD1udWxsO3RoaXMubV9NaW5pbWFMaXN0PWF9dGhpcy5tX0N1cnJlbnRMTT1udWxsfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5SYW5nZVRlc3Q9ZnVuY3Rpb24oYSxiKXtpZihiLlZhbHVlKShhLlg+ZC5DbGlwcGVyQmFzZS5oaVJhbmdlfHxhLlk+ZC5DbGlwcGVyQmFzZS5oaVJhbmdlfHwtYS5YPmQuQ2xpcHBlckJhc2UuaGlSYW5nZXx8LWEuWT5kLkNsaXBwZXJCYXNlLmhpUmFuZ2UpJiZcbmQuRXJyb3IoXCJDb29yZGluYXRlIG91dHNpZGUgYWxsb3dlZCByYW5nZSBpbiBSYW5nZVRlc3QoKS5cIik7ZWxzZSBpZihhLlg+ZC5DbGlwcGVyQmFzZS5sb1JhbmdlfHxhLlk+ZC5DbGlwcGVyQmFzZS5sb1JhbmdlfHwtYS5YPmQuQ2xpcHBlckJhc2UubG9SYW5nZXx8LWEuWT5kLkNsaXBwZXJCYXNlLmxvUmFuZ2UpYi5WYWx1ZT0hMCx0aGlzLlJhbmdlVGVzdChhLGIpfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5Jbml0RWRnZT1mdW5jdGlvbihhLGIsYyxlKXthLk5leHQ9YjthLlByZXY9YzthLkN1cnIuWD1lLlg7YS5DdXJyLlk9ZS5ZO2EuT3V0SWR4PS0xfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5Jbml0RWRnZTI9ZnVuY3Rpb24oYSxiKXthLkN1cnIuWT49YS5OZXh0LkN1cnIuWT8oYS5Cb3QuWD1hLkN1cnIuWCxhLkJvdC5ZPWEuQ3Vyci5ZLGEuVG9wLlg9YS5OZXh0LkN1cnIuWCxhLlRvcC5ZPWEuTmV4dC5DdXJyLlkpOihhLlRvcC5YPWEuQ3Vyci5YLGEuVG9wLlk9YS5DdXJyLlksXG5hLkJvdC5YPWEuTmV4dC5DdXJyLlgsYS5Cb3QuWT1hLk5leHQuQ3Vyci5ZKTt0aGlzLlNldER4KGEpO2EuUG9seVR5cD1ifTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5GaW5kTmV4dExvY01pbj1mdW5jdGlvbihhKXtmb3IodmFyIGI7Oyl7Zm9yKDtkLkludFBvaW50Lm9wX0luZXF1YWxpdHkoYS5Cb3QsYS5QcmV2LkJvdCl8fGQuSW50UG9pbnQub3BfRXF1YWxpdHkoYS5DdXJyLGEuVG9wKTspYT1hLk5leHQ7aWYoYS5EeCE9ZC5DbGlwcGVyQmFzZS5ob3Jpem9udGFsJiZhLlByZXYuRHghPWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbClicmVhaztmb3IoO2EuUHJldi5EeD09ZC5DbGlwcGVyQmFzZS5ob3Jpem9udGFsOylhPWEuUHJldjtmb3IoYj1hO2EuRHg9PWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbDspYT1hLk5leHQ7aWYoYS5Ub3AuWSE9YS5QcmV2LkJvdC5ZKXtiLlByZXYuQm90Llg8YS5Cb3QuWCYmKGE9Yik7YnJlYWt9fXJldHVybiBhfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5Qcm9jZXNzQm91bmQ9XG5mdW5jdGlvbihhLGIpe3ZhciBjPWEsZT1hLGY7YS5EeD09ZC5DbGlwcGVyQmFzZS5ob3Jpem9udGFsJiYoZj1iP2EuUHJldi5Cb3QuWDphLk5leHQuQm90LlgsYS5Cb3QuWCE9ZiYmdGhpcy5SZXZlcnNlSG9yaXpvbnRhbChhKSk7aWYoZS5PdXRJZHghPWQuQ2xpcHBlckJhc2UuU2tpcClpZihiKXtmb3IoO2UuVG9wLlk9PWUuTmV4dC5Cb3QuWSYmZS5OZXh0Lk91dElkeCE9ZC5DbGlwcGVyQmFzZS5Ta2lwOyllPWUuTmV4dDtpZihlLkR4PT1kLkNsaXBwZXJCYXNlLmhvcml6b250YWwmJmUuTmV4dC5PdXRJZHghPWQuQ2xpcHBlckJhc2UuU2tpcCl7Zm9yKGY9ZTtmLlByZXYuRHg9PWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbDspZj1mLlByZXY7Zi5QcmV2LlRvcC5YPT1lLk5leHQuVG9wLlg/Ynx8KGU9Zi5QcmV2KTpmLlByZXYuVG9wLlg+ZS5OZXh0LlRvcC5YJiYoZT1mLlByZXYpfWZvcig7YSE9ZTspYS5OZXh0SW5MTUw9YS5OZXh0LGEuRHg9PWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbCYmXG5hIT1jJiZhLkJvdC5YIT1hLlByZXYuVG9wLlgmJnRoaXMuUmV2ZXJzZUhvcml6b250YWwoYSksYT1hLk5leHQ7YS5EeD09ZC5DbGlwcGVyQmFzZS5ob3Jpem9udGFsJiZhIT1jJiZhLkJvdC5YIT1hLlByZXYuVG9wLlgmJnRoaXMuUmV2ZXJzZUhvcml6b250YWwoYSk7ZT1lLk5leHR9ZWxzZXtmb3IoO2UuVG9wLlk9PWUuUHJldi5Cb3QuWSYmZS5QcmV2Lk91dElkeCE9ZC5DbGlwcGVyQmFzZS5Ta2lwOyllPWUuUHJldjtpZihlLkR4PT1kLkNsaXBwZXJCYXNlLmhvcml6b250YWwmJmUuUHJldi5PdXRJZHghPWQuQ2xpcHBlckJhc2UuU2tpcCl7Zm9yKGY9ZTtmLk5leHQuRHg9PWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbDspZj1mLk5leHQ7Zi5OZXh0LlRvcC5YPT1lLlByZXYuVG9wLlg/Ynx8KGU9Zi5OZXh0KTpmLk5leHQuVG9wLlg+ZS5QcmV2LlRvcC5YJiYoZT1mLk5leHQpfWZvcig7YSE9ZTspYS5OZXh0SW5MTUw9YS5QcmV2LGEuRHg9PWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbCYmXG5hIT1jJiZhLkJvdC5YIT1hLk5leHQuVG9wLlgmJnRoaXMuUmV2ZXJzZUhvcml6b250YWwoYSksYT1hLlByZXY7YS5EeD09ZC5DbGlwcGVyQmFzZS5ob3Jpem9udGFsJiZhIT1jJiZhLkJvdC5YIT1hLk5leHQuVG9wLlgmJnRoaXMuUmV2ZXJzZUhvcml6b250YWwoYSk7ZT1lLlByZXZ9aWYoZS5PdXRJZHg9PWQuQ2xpcHBlckJhc2UuU2tpcCl7YT1lO2lmKGIpe2Zvcig7YS5Ub3AuWT09YS5OZXh0LkJvdC5ZOylhPWEuTmV4dDtmb3IoO2EhPWUmJmEuRHg9PWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbDspYT1hLlByZXZ9ZWxzZXtmb3IoO2EuVG9wLlk9PWEuUHJldi5Cb3QuWTspYT1hLlByZXY7Zm9yKDthIT1lJiZhLkR4PT1kLkNsaXBwZXJCYXNlLmhvcml6b250YWw7KWE9YS5OZXh0fWE9PWU/ZT1iP2EuTmV4dDphLlByZXY6KGE9Yj9lLk5leHQ6ZS5QcmV2LGM9bmV3IGQuTG9jYWxNaW5pbWEsYy5OZXh0PW51bGwsYy5ZPWEuQm90LlksYy5MZWZ0Qm91bmQ9bnVsbCxjLlJpZ2h0Qm91bmQ9XG5hLGMuUmlnaHRCb3VuZC5XaW5kRGVsdGE9MCxlPXRoaXMuUHJvY2Vzc0JvdW5kKGMuUmlnaHRCb3VuZCxiKSx0aGlzLkluc2VydExvY2FsTWluaW1hKGMpKX1yZXR1cm4gZX07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuQWRkUGF0aD1mdW5jdGlvbihhLGIsYyl7Y3x8YiE9ZC5Qb2x5VHlwZS5wdENsaXB8fGQuRXJyb3IoXCJBZGRQYXRoOiBPcGVuIHBhdGhzIG11c3QgYmUgc3ViamVjdC5cIik7dmFyIGU9YS5sZW5ndGgtMTtpZihjKWZvcig7MDxlJiZkLkludFBvaW50Lm9wX0VxdWFsaXR5KGFbZV0sYVswXSk7KS0tZTtmb3IoOzA8ZSYmZC5JbnRQb2ludC5vcF9FcXVhbGl0eShhW2VdLGFbZS0xXSk7KS0tZTtpZihjJiYyPmV8fCFjJiYxPmUpcmV0dXJuITE7Zm9yKHZhciBmPVtdLGc9MDtnPD1lO2crKylmLnB1c2gobmV3IGQuVEVkZ2UpO3ZhciBoPSEwO2ZbMV0uQ3Vyci5YPWFbMV0uWDtmWzFdLkN1cnIuWT1hWzFdLlk7dmFyIGw9e1ZhbHVlOnRoaXMubV9Vc2VGdWxsUmFuZ2V9O3RoaXMuUmFuZ2VUZXN0KGFbMF0sXG5sKTt0aGlzLm1fVXNlRnVsbFJhbmdlPWwuVmFsdWU7bC5WYWx1ZT10aGlzLm1fVXNlRnVsbFJhbmdlO3RoaXMuUmFuZ2VUZXN0KGFbZV0sbCk7dGhpcy5tX1VzZUZ1bGxSYW5nZT1sLlZhbHVlO3RoaXMuSW5pdEVkZ2UoZlswXSxmWzFdLGZbZV0sYVswXSk7dGhpcy5Jbml0RWRnZShmW2VdLGZbMF0sZltlLTFdLGFbZV0pO2ZvcihnPWUtMTsxPD1nOy0tZylsLlZhbHVlPXRoaXMubV9Vc2VGdWxsUmFuZ2UsdGhpcy5SYW5nZVRlc3QoYVtnXSxsKSx0aGlzLm1fVXNlRnVsbFJhbmdlPWwuVmFsdWUsdGhpcy5Jbml0RWRnZShmW2ddLGZbZysxXSxmW2ctMV0sYVtnXSk7Zm9yKGc9YT1lPWZbMF07OylpZihkLkludFBvaW50Lm9wX0VxdWFsaXR5KGEuQ3VycixhLk5leHQuQ3Vycikpe2lmKGE9PWEuTmV4dClicmVhazthPT1lJiYoZT1hLk5leHQpO2c9YT10aGlzLlJlbW92ZUVkZ2UoYSl9ZWxzZXtpZihhLlByZXY9PWEuTmV4dClicmVhaztlbHNlIGlmKGMmJmQuQ2xpcHBlckJhc2UuU2xvcGVzRXF1YWwoYS5QcmV2LkN1cnIsXG5hLkN1cnIsYS5OZXh0LkN1cnIsdGhpcy5tX1VzZUZ1bGxSYW5nZSkmJighdGhpcy5QcmVzZXJ2ZUNvbGxpbmVhcnx8IXRoaXMuUHQySXNCZXR3ZWVuUHQxQW5kUHQzKGEuUHJldi5DdXJyLGEuQ3VycixhLk5leHQuQ3VycikpKXthPT1lJiYoZT1hLk5leHQpO2E9dGhpcy5SZW1vdmVFZGdlKGEpO2c9YT1hLlByZXY7Y29udGludWV9YT1hLk5leHQ7aWYoYT09ZylicmVha31pZighYyYmYT09YS5OZXh0fHxjJiZhLlByZXY9PWEuTmV4dClyZXR1cm4hMTtjfHwodGhpcy5tX0hhc09wZW5QYXRocz0hMCxlLlByZXYuT3V0SWR4PWQuQ2xpcHBlckJhc2UuU2tpcCk7YT1lO2RvIHRoaXMuSW5pdEVkZ2UyKGEsYiksYT1hLk5leHQsaCYmYS5DdXJyLlkhPWUuQ3Vyci5ZJiYoaD0hMSk7d2hpbGUoYSE9ZSk7aWYoaCl7aWYoYylyZXR1cm4hMTthLlByZXYuT3V0SWR4PWQuQ2xpcHBlckJhc2UuU2tpcDthLlByZXYuQm90Llg8YS5QcmV2LlRvcC5YJiZ0aGlzLlJldmVyc2VIb3Jpem9udGFsKGEuUHJldik7XG5iPW5ldyBkLkxvY2FsTWluaW1hO2IuTmV4dD1udWxsO2IuWT1hLkJvdC5ZO2IuTGVmdEJvdW5kPW51bGw7Yi5SaWdodEJvdW5kPWE7Yi5SaWdodEJvdW5kLlNpZGU9ZC5FZGdlU2lkZS5lc1JpZ2h0O2ZvcihiLlJpZ2h0Qm91bmQuV2luZERlbHRhPTA7YS5OZXh0Lk91dElkeCE9ZC5DbGlwcGVyQmFzZS5Ta2lwOylhLk5leHRJbkxNTD1hLk5leHQsYS5Cb3QuWCE9YS5QcmV2LlRvcC5YJiZ0aGlzLlJldmVyc2VIb3Jpem9udGFsKGEpLGE9YS5OZXh0O3RoaXMuSW5zZXJ0TG9jYWxNaW5pbWEoYik7dGhpcy5tX2VkZ2VzLnB1c2goZik7cmV0dXJuITB9dGhpcy5tX2VkZ2VzLnB1c2goZik7Zm9yKGg9bnVsbDs7KXthPXRoaXMuRmluZE5leHRMb2NNaW4oYSk7aWYoYT09aClicmVhaztlbHNlIG51bGw9PWgmJihoPWEpO2I9bmV3IGQuTG9jYWxNaW5pbWE7Yi5OZXh0PW51bGw7Yi5ZPWEuQm90Llk7YS5EeDxhLlByZXYuRHg/KGIuTGVmdEJvdW5kPWEuUHJldixiLlJpZ2h0Qm91bmQ9YSxmPSExKTpcbihiLkxlZnRCb3VuZD1hLGIuUmlnaHRCb3VuZD1hLlByZXYsZj0hMCk7Yi5MZWZ0Qm91bmQuU2lkZT1kLkVkZ2VTaWRlLmVzTGVmdDtiLlJpZ2h0Qm91bmQuU2lkZT1kLkVkZ2VTaWRlLmVzUmlnaHQ7Yi5MZWZ0Qm91bmQuV2luZERlbHRhPWM/Yi5MZWZ0Qm91bmQuTmV4dD09Yi5SaWdodEJvdW5kPy0xOjE6MDtiLlJpZ2h0Qm91bmQuV2luZERlbHRhPS1iLkxlZnRCb3VuZC5XaW5kRGVsdGE7YT10aGlzLlByb2Nlc3NCb3VuZChiLkxlZnRCb3VuZCxmKTtlPXRoaXMuUHJvY2Vzc0JvdW5kKGIuUmlnaHRCb3VuZCwhZik7Yi5MZWZ0Qm91bmQuT3V0SWR4PT1kLkNsaXBwZXJCYXNlLlNraXA/Yi5MZWZ0Qm91bmQ9bnVsbDpiLlJpZ2h0Qm91bmQuT3V0SWR4PT1kLkNsaXBwZXJCYXNlLlNraXAmJihiLlJpZ2h0Qm91bmQ9bnVsbCk7dGhpcy5JbnNlcnRMb2NhbE1pbmltYShiKTtmfHwoYT1lKX1yZXR1cm4hMH07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuQWRkUGF0aHM9ZnVuY3Rpb24oYSxiLFxuYyl7Zm9yKHZhciBlPSExLGQ9MCxnPWEubGVuZ3RoO2Q8ZzsrK2QpdGhpcy5BZGRQYXRoKGFbZF0sYixjKSYmKGU9ITApO3JldHVybiBlfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5QdDJJc0JldHdlZW5QdDFBbmRQdDM9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBkLkludFBvaW50Lm9wX0VxdWFsaXR5KGEsYyl8fGQuSW50UG9pbnQub3BfRXF1YWxpdHkoYSxiKXx8ZC5JbnRQb2ludC5vcF9FcXVhbGl0eShjLGIpPyExOmEuWCE9Yy5YP2IuWD5hLlg9PWIuWDxjLlg6Yi5ZPmEuWT09Yi5ZPGMuWX07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuUmVtb3ZlRWRnZT1mdW5jdGlvbihhKXthLlByZXYuTmV4dD1hLk5leHQ7YS5OZXh0LlByZXY9YS5QcmV2O3ZhciBiPWEuTmV4dDthLlByZXY9bnVsbDtyZXR1cm4gYn07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuU2V0RHg9ZnVuY3Rpb24oYSl7YS5EZWx0YS5YPWEuVG9wLlgtYS5Cb3QuWDthLkRlbHRhLlk9YS5Ub3AuWS1hLkJvdC5ZO2EuRHg9XG4wPT09YS5EZWx0YS5ZP2QuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbDphLkRlbHRhLlgvYS5EZWx0YS5ZfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5JbnNlcnRMb2NhbE1pbmltYT1mdW5jdGlvbihhKXtpZihudWxsPT09dGhpcy5tX01pbmltYUxpc3QpdGhpcy5tX01pbmltYUxpc3Q9YTtlbHNlIGlmKGEuWT49dGhpcy5tX01pbmltYUxpc3QuWSlhLk5leHQ9dGhpcy5tX01pbmltYUxpc3QsdGhpcy5tX01pbmltYUxpc3Q9YTtlbHNle2Zvcih2YXIgYj10aGlzLm1fTWluaW1hTGlzdDtudWxsIT09Yi5OZXh0JiZhLlk8Yi5OZXh0Llk7KWI9Yi5OZXh0O2EuTmV4dD1iLk5leHQ7Yi5OZXh0PWF9fTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5Qb3BMb2NhbE1pbmltYT1mdW5jdGlvbigpe251bGwhPT10aGlzLm1fQ3VycmVudExNJiYodGhpcy5tX0N1cnJlbnRMTT10aGlzLm1fQ3VycmVudExNLk5leHQpfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5SZXZlcnNlSG9yaXpvbnRhbD1mdW5jdGlvbihhKXt2YXIgYj1cbmEuVG9wLlg7YS5Ub3AuWD1hLkJvdC5YO2EuQm90Llg9Yn07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuUmVzZXQ9ZnVuY3Rpb24oKXt0aGlzLm1fQ3VycmVudExNPXRoaXMubV9NaW5pbWFMaXN0O2lmKG51bGwhPXRoaXMubV9DdXJyZW50TE0pZm9yKHZhciBhPXRoaXMubV9NaW5pbWFMaXN0O251bGwhPWE7KXt2YXIgYj1hLkxlZnRCb3VuZDtudWxsIT1iJiYoYi5DdXJyLlg9Yi5Cb3QuWCxiLkN1cnIuWT1iLkJvdC5ZLGIuU2lkZT1kLkVkZ2VTaWRlLmVzTGVmdCxiLk91dElkeD1kLkNsaXBwZXJCYXNlLlVuYXNzaWduZWQpO2I9YS5SaWdodEJvdW5kO251bGwhPWImJihiLkN1cnIuWD1iLkJvdC5YLGIuQ3Vyci5ZPWIuQm90LlksYi5TaWRlPWQuRWRnZVNpZGUuZXNSaWdodCxiLk91dElkeD1kLkNsaXBwZXJCYXNlLlVuYXNzaWduZWQpO2E9YS5OZXh0fX07ZC5DbGlwcGVyPWZ1bmN0aW9uKGEpe1widW5kZWZpbmVkXCI9PXR5cGVvZiBhJiYoYT0wKTt0aGlzLm1fUG9seU91dHM9bnVsbDt0aGlzLm1fQ2xpcFR5cGU9XG5kLkNsaXBUeXBlLmN0SW50ZXJzZWN0aW9uO3RoaXMubV9JbnRlcnNlY3ROb2RlQ29tcGFyZXI9dGhpcy5tX0ludGVyc2VjdExpc3Q9dGhpcy5tX1NvcnRlZEVkZ2VzPXRoaXMubV9BY3RpdmVFZGdlcz10aGlzLm1fU2NhbmJlYW09bnVsbDt0aGlzLm1fRXhlY3V0ZUxvY2tlZD0hMTt0aGlzLm1fU3ViakZpbGxUeXBlPXRoaXMubV9DbGlwRmlsbFR5cGU9ZC5Qb2x5RmlsbFR5cGUucGZ0RXZlbk9kZDt0aGlzLm1fR2hvc3RKb2lucz10aGlzLm1fSm9pbnM9bnVsbDt0aGlzLlN0cmljdGx5U2ltcGxlPXRoaXMuUmV2ZXJzZVNvbHV0aW9uPXRoaXMubV9Vc2luZ1BvbHlUcmVlPSExO2QuQ2xpcHBlckJhc2UuY2FsbCh0aGlzKTt0aGlzLm1fU29ydGVkRWRnZXM9dGhpcy5tX0FjdGl2ZUVkZ2VzPXRoaXMubV9TY2FuYmVhbT1udWxsO3RoaXMubV9JbnRlcnNlY3RMaXN0PVtdO3RoaXMubV9JbnRlcnNlY3ROb2RlQ29tcGFyZXI9ZC5NeUludGVyc2VjdE5vZGVTb3J0LkNvbXBhcmU7dGhpcy5tX1VzaW5nUG9seVRyZWU9XG50aGlzLm1fRXhlY3V0ZUxvY2tlZD0hMTt0aGlzLm1fUG9seU91dHM9W107dGhpcy5tX0pvaW5zPVtdO3RoaXMubV9HaG9zdEpvaW5zPVtdO3RoaXMuUmV2ZXJzZVNvbHV0aW9uPTAhPT0oMSZhKTt0aGlzLlN0cmljdGx5U2ltcGxlPTAhPT0oMiZhKTt0aGlzLlByZXNlcnZlQ29sbGluZWFyPTAhPT0oNCZhKX07ZC5DbGlwcGVyLmlvUmV2ZXJzZVNvbHV0aW9uPTE7ZC5DbGlwcGVyLmlvU3RyaWN0bHlTaW1wbGU9MjtkLkNsaXBwZXIuaW9QcmVzZXJ2ZUNvbGxpbmVhcj00O2QuQ2xpcHBlci5wcm90b3R5cGUuQ2xlYXI9ZnVuY3Rpb24oKXswIT09dGhpcy5tX2VkZ2VzLmxlbmd0aCYmKHRoaXMuRGlzcG9zZUFsbFBvbHlQdHMoKSxkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5DbGVhci5jYWxsKHRoaXMpKX07ZC5DbGlwcGVyLnByb3RvdHlwZS5EaXNwb3NlU2NhbmJlYW1MaXN0PWZ1bmN0aW9uKCl7Zm9yKDtudWxsIT09dGhpcy5tX1NjYW5iZWFtOyl7dmFyIGE9dGhpcy5tX1NjYW5iZWFtLk5leHQ7XG50aGlzLm1fU2NhbmJlYW09bnVsbDt0aGlzLm1fU2NhbmJlYW09YX19O2QuQ2xpcHBlci5wcm90b3R5cGUuUmVzZXQ9ZnVuY3Rpb24oKXtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5SZXNldC5jYWxsKHRoaXMpO3RoaXMubV9Tb3J0ZWRFZGdlcz10aGlzLm1fQWN0aXZlRWRnZXM9dGhpcy5tX1NjYW5iZWFtPW51bGw7Zm9yKHZhciBhPXRoaXMubV9NaW5pbWFMaXN0O251bGwhPT1hOyl0aGlzLkluc2VydFNjYW5iZWFtKGEuWSksYT1hLk5leHR9O2QuQ2xpcHBlci5wcm90b3R5cGUuSW5zZXJ0U2NhbmJlYW09ZnVuY3Rpb24oYSl7aWYobnVsbD09PXRoaXMubV9TY2FuYmVhbSl0aGlzLm1fU2NhbmJlYW09bmV3IGQuU2NhbmJlYW0sdGhpcy5tX1NjYW5iZWFtLk5leHQ9bnVsbCx0aGlzLm1fU2NhbmJlYW0uWT1hO2Vsc2UgaWYoYT50aGlzLm1fU2NhbmJlYW0uWSl7dmFyIGI9bmV3IGQuU2NhbmJlYW07Yi5ZPWE7Yi5OZXh0PXRoaXMubV9TY2FuYmVhbTt0aGlzLm1fU2NhbmJlYW09Yn1lbHNle2Zvcih2YXIgYz1cbnRoaXMubV9TY2FuYmVhbTtudWxsIT09Yy5OZXh0JiZhPD1jLk5leHQuWTspYz1jLk5leHQ7YSE9Yy5ZJiYoYj1uZXcgZC5TY2FuYmVhbSxiLlk9YSxiLk5leHQ9Yy5OZXh0LGMuTmV4dD1iKX19O2QuQ2xpcHBlci5wcm90b3R5cGUuRXhlY3V0ZT1mdW5jdGlvbigpe3ZhciBhPWFyZ3VtZW50cyxiPWEubGVuZ3RoLGM9YVsxXWluc3RhbmNlb2YgZC5Qb2x5VHJlZTtpZig0IT1ifHxjKXtpZig0PT1iJiZjKXt2YXIgYj1hWzBdLGU9YVsxXSxjPWFbMl0sYT1hWzNdO2lmKHRoaXMubV9FeGVjdXRlTG9ja2VkKXJldHVybiExO3RoaXMubV9FeGVjdXRlTG9ja2VkPSEwO3RoaXMubV9TdWJqRmlsbFR5cGU9Yzt0aGlzLm1fQ2xpcEZpbGxUeXBlPWE7dGhpcy5tX0NsaXBUeXBlPWI7dGhpcy5tX1VzaW5nUG9seVRyZWU9ITA7dHJ5eyhmPXRoaXMuRXhlY3V0ZUludGVybmFsKCkpJiZ0aGlzLkJ1aWxkUmVzdWx0MihlKX1maW5hbGx5e3RoaXMuRGlzcG9zZUFsbFBvbHlQdHMoKSx0aGlzLm1fRXhlY3V0ZUxvY2tlZD1cbiExfXJldHVybiBmfWlmKDI9PWImJiFjfHwyPT1iJiZjKXJldHVybiBiPWFbMF0sZT1hWzFdLHRoaXMuRXhlY3V0ZShiLGUsZC5Qb2x5RmlsbFR5cGUucGZ0RXZlbk9kZCxkLlBvbHlGaWxsVHlwZS5wZnRFdmVuT2RkKX1lbHNle2I9YVswXTtlPWFbMV07Yz1hWzJdO2E9YVszXTtpZih0aGlzLm1fRXhlY3V0ZUxvY2tlZClyZXR1cm4hMTt0aGlzLm1fSGFzT3BlblBhdGhzJiZkLkVycm9yKFwiRXJyb3I6IFBvbHlUcmVlIHN0cnVjdCBpcyBuZWVkIGZvciBvcGVuIHBhdGggY2xpcHBpbmcuXCIpO3RoaXMubV9FeGVjdXRlTG9ja2VkPSEwO2QuQ2xlYXIoZSk7dGhpcy5tX1N1YmpGaWxsVHlwZT1jO3RoaXMubV9DbGlwRmlsbFR5cGU9YTt0aGlzLm1fQ2xpcFR5cGU9Yjt0aGlzLm1fVXNpbmdQb2x5VHJlZT0hMTt0cnl7dmFyIGY9dGhpcy5FeGVjdXRlSW50ZXJuYWwoKTtmJiZ0aGlzLkJ1aWxkUmVzdWx0KGUpfWZpbmFsbHl7dGhpcy5EaXNwb3NlQWxsUG9seVB0cygpLHRoaXMubV9FeGVjdXRlTG9ja2VkPVxuITF9cmV0dXJuIGZ9fTtkLkNsaXBwZXIucHJvdG90eXBlLkZpeEhvbGVMaW5rYWdlPWZ1bmN0aW9uKGEpe2lmKG51bGwhPT1hLkZpcnN0TGVmdCYmKGEuSXNIb2xlPT1hLkZpcnN0TGVmdC5Jc0hvbGV8fG51bGw9PT1hLkZpcnN0TGVmdC5QdHMpKXtmb3IodmFyIGI9YS5GaXJzdExlZnQ7bnVsbCE9PWImJihiLklzSG9sZT09YS5Jc0hvbGV8fG51bGw9PT1iLlB0cyk7KWI9Yi5GaXJzdExlZnQ7YS5GaXJzdExlZnQ9Yn19O2QuQ2xpcHBlci5wcm90b3R5cGUuRXhlY3V0ZUludGVybmFsPWZ1bmN0aW9uKCl7dHJ5e3RoaXMuUmVzZXQoKTtpZihudWxsPT09dGhpcy5tX0N1cnJlbnRMTSlyZXR1cm4hMTt2YXIgYT10aGlzLlBvcFNjYW5iZWFtKCk7ZG97dGhpcy5JbnNlcnRMb2NhbE1pbmltYUludG9BRUwoYSk7ZC5DbGVhcih0aGlzLm1fR2hvc3RKb2lucyk7dGhpcy5Qcm9jZXNzSG9yaXpvbnRhbHMoITEpO2lmKG51bGw9PT10aGlzLm1fU2NhbmJlYW0pYnJlYWs7dmFyIGI9dGhpcy5Qb3BTY2FuYmVhbSgpO1xuaWYoIXRoaXMuUHJvY2Vzc0ludGVyc2VjdGlvbnMoYSxiKSlyZXR1cm4hMTt0aGlzLlByb2Nlc3NFZGdlc0F0VG9wT2ZTY2FuYmVhbShiKTthPWJ9d2hpbGUobnVsbCE9PXRoaXMubV9TY2FuYmVhbXx8bnVsbCE9PXRoaXMubV9DdXJyZW50TE0pO2Zvcih2YXIgYT0wLGM9dGhpcy5tX1BvbHlPdXRzLmxlbmd0aDthPGM7YSsrKXt2YXIgZT10aGlzLm1fUG9seU91dHNbYV07bnVsbD09PWUuUHRzfHxlLklzT3Blbnx8KGUuSXNIb2xlXnRoaXMuUmV2ZXJzZVNvbHV0aW9uKT09MDx0aGlzLkFyZWEoZSkmJnRoaXMuUmV2ZXJzZVBvbHlQdExpbmtzKGUuUHRzKX10aGlzLkpvaW5Db21tb25FZGdlcygpO2E9MDtmb3IoYz10aGlzLm1fUG9seU91dHMubGVuZ3RoO2E8YzthKyspZT10aGlzLm1fUG9seU91dHNbYV0sbnVsbD09PWUuUHRzfHxlLklzT3Blbnx8dGhpcy5GaXh1cE91dFBvbHlnb24oZSk7dGhpcy5TdHJpY3RseVNpbXBsZSYmdGhpcy5Eb1NpbXBsZVBvbHlnb25zKCk7cmV0dXJuITB9ZmluYWxseXtkLkNsZWFyKHRoaXMubV9Kb2lucyksXG5kLkNsZWFyKHRoaXMubV9HaG9zdEpvaW5zKX19O2QuQ2xpcHBlci5wcm90b3R5cGUuUG9wU2NhbmJlYW09ZnVuY3Rpb24oKXt2YXIgYT10aGlzLm1fU2NhbmJlYW0uWTt0aGlzLm1fU2NhbmJlYW09dGhpcy5tX1NjYW5iZWFtLk5leHQ7cmV0dXJuIGF9O2QuQ2xpcHBlci5wcm90b3R5cGUuRGlzcG9zZUFsbFBvbHlQdHM9ZnVuY3Rpb24oKXtmb3IodmFyIGE9MCxiPXRoaXMubV9Qb2x5T3V0cy5sZW5ndGg7YTxiOysrYSl0aGlzLkRpc3Bvc2VPdXRSZWMoYSk7ZC5DbGVhcih0aGlzLm1fUG9seU91dHMpfTtkLkNsaXBwZXIucHJvdG90eXBlLkRpc3Bvc2VPdXRSZWM9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5tX1BvbHlPdXRzW2FdO251bGwhPT1iLlB0cyYmdGhpcy5EaXNwb3NlT3V0UHRzKGIuUHRzKTt0aGlzLm1fUG9seU91dHNbYV09bnVsbH07ZC5DbGlwcGVyLnByb3RvdHlwZS5EaXNwb3NlT3V0UHRzPWZ1bmN0aW9uKGEpe2lmKG51bGwhPT1hKWZvcihhLlByZXYuTmV4dD1udWxsO251bGwhPT1cbmE7KWE9YS5OZXh0fTtkLkNsaXBwZXIucHJvdG90eXBlLkFkZEpvaW49ZnVuY3Rpb24oYSxiLGMpe3ZhciBlPW5ldyBkLkpvaW47ZS5PdXRQdDE9YTtlLk91dFB0Mj1iO2UuT2ZmUHQuWD1jLlg7ZS5PZmZQdC5ZPWMuWTt0aGlzLm1fSm9pbnMucHVzaChlKX07ZC5DbGlwcGVyLnByb3RvdHlwZS5BZGRHaG9zdEpvaW49ZnVuY3Rpb24oYSxiKXt2YXIgYz1uZXcgZC5Kb2luO2MuT3V0UHQxPWE7Yy5PZmZQdC5YPWIuWDtjLk9mZlB0Llk9Yi5ZO3RoaXMubV9HaG9zdEpvaW5zLnB1c2goYyl9O2QuQ2xpcHBlci5wcm90b3R5cGUuSW5zZXJ0TG9jYWxNaW5pbWFJbnRvQUVMPWZ1bmN0aW9uKGEpe2Zvcig7bnVsbCE9PXRoaXMubV9DdXJyZW50TE0mJnRoaXMubV9DdXJyZW50TE0uWT09YTspe3ZhciBiPXRoaXMubV9DdXJyZW50TE0uTGVmdEJvdW5kLGM9dGhpcy5tX0N1cnJlbnRMTS5SaWdodEJvdW5kO3RoaXMuUG9wTG9jYWxNaW5pbWEoKTt2YXIgZT1udWxsO251bGw9PT1iPyh0aGlzLkluc2VydEVkZ2VJbnRvQUVMKGMsXG5udWxsKSx0aGlzLlNldFdpbmRpbmdDb3VudChjKSx0aGlzLklzQ29udHJpYnV0aW5nKGMpJiYoZT10aGlzLkFkZE91dFB0KGMsYy5Cb3QpKSk6KG51bGw9PWM/KHRoaXMuSW5zZXJ0RWRnZUludG9BRUwoYixudWxsKSx0aGlzLlNldFdpbmRpbmdDb3VudChiKSx0aGlzLklzQ29udHJpYnV0aW5nKGIpJiYoZT10aGlzLkFkZE91dFB0KGIsYi5Cb3QpKSk6KHRoaXMuSW5zZXJ0RWRnZUludG9BRUwoYixudWxsKSx0aGlzLkluc2VydEVkZ2VJbnRvQUVMKGMsYiksdGhpcy5TZXRXaW5kaW5nQ291bnQoYiksYy5XaW5kQ250PWIuV2luZENudCxjLldpbmRDbnQyPWIuV2luZENudDIsdGhpcy5Jc0NvbnRyaWJ1dGluZyhiKSYmKGU9dGhpcy5BZGRMb2NhbE1pblBvbHkoYixjLGIuQm90KSkpLHRoaXMuSW5zZXJ0U2NhbmJlYW0oYi5Ub3AuWSkpO251bGwhPWMmJihkLkNsaXBwZXJCYXNlLklzSG9yaXpvbnRhbChjKT90aGlzLkFkZEVkZ2VUb1NFTChjKTp0aGlzLkluc2VydFNjYW5iZWFtKGMuVG9wLlkpKTtcbmlmKG51bGwhPWImJm51bGwhPWMpe2lmKG51bGwhPT1lJiZkLkNsaXBwZXJCYXNlLklzSG9yaXpvbnRhbChjKSYmMDx0aGlzLm1fR2hvc3RKb2lucy5sZW5ndGgmJjAhPT1jLldpbmREZWx0YSlmb3IodmFyIGY9MCxnPXRoaXMubV9HaG9zdEpvaW5zLmxlbmd0aDtmPGc7ZisrKXt2YXIgaD10aGlzLm1fR2hvc3RKb2luc1tmXTt0aGlzLkhvcnpTZWdtZW50c092ZXJsYXAoaC5PdXRQdDEuUHQsaC5PZmZQdCxjLkJvdCxjLlRvcCkmJnRoaXMuQWRkSm9pbihoLk91dFB0MSxlLGguT2ZmUHQpfTA8PWIuT3V0SWR4JiZudWxsIT09Yi5QcmV2SW5BRUwmJmIuUHJldkluQUVMLkN1cnIuWD09Yi5Cb3QuWCYmMDw9Yi5QcmV2SW5BRUwuT3V0SWR4JiZkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGIuUHJldkluQUVMLGIsdGhpcy5tX1VzZUZ1bGxSYW5nZSkmJjAhPT1iLldpbmREZWx0YSYmMCE9PWIuUHJldkluQUVMLldpbmREZWx0YSYmKGY9dGhpcy5BZGRPdXRQdChiLlByZXZJbkFFTCxiLkJvdCksXG50aGlzLkFkZEpvaW4oZSxmLGIuVG9wKSk7aWYoYi5OZXh0SW5BRUwhPWMmJigwPD1jLk91dElkeCYmMDw9Yy5QcmV2SW5BRUwuT3V0SWR4JiZkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGMuUHJldkluQUVMLGMsdGhpcy5tX1VzZUZ1bGxSYW5nZSkmJjAhPT1jLldpbmREZWx0YSYmMCE9PWMuUHJldkluQUVMLldpbmREZWx0YSYmKGY9dGhpcy5BZGRPdXRQdChjLlByZXZJbkFFTCxjLkJvdCksdGhpcy5BZGRKb2luKGUsZixjLlRvcCkpLGU9Yi5OZXh0SW5BRUwsbnVsbCE9PWUpKWZvcig7ZSE9YzspdGhpcy5JbnRlcnNlY3RFZGdlcyhjLGUsYi5DdXJyLCExKSxlPWUuTmV4dEluQUVMfX19O2QuQ2xpcHBlci5wcm90b3R5cGUuSW5zZXJ0RWRnZUludG9BRUw9ZnVuY3Rpb24oYSxiKXtpZihudWxsPT09dGhpcy5tX0FjdGl2ZUVkZ2VzKWEuUHJldkluQUVMPW51bGwsYS5OZXh0SW5BRUw9bnVsbCx0aGlzLm1fQWN0aXZlRWRnZXM9YTtlbHNlIGlmKG51bGw9PT1iJiZ0aGlzLkUySW5zZXJ0c0JlZm9yZUUxKHRoaXMubV9BY3RpdmVFZGdlcyxcbmEpKWEuUHJldkluQUVMPW51bGwsYS5OZXh0SW5BRUw9dGhpcy5tX0FjdGl2ZUVkZ2VzLHRoaXMubV9BY3RpdmVFZGdlcz10aGlzLm1fQWN0aXZlRWRnZXMuUHJldkluQUVMPWE7ZWxzZXtudWxsPT09YiYmKGI9dGhpcy5tX0FjdGl2ZUVkZ2VzKTtmb3IoO251bGwhPT1iLk5leHRJbkFFTCYmIXRoaXMuRTJJbnNlcnRzQmVmb3JlRTEoYi5OZXh0SW5BRUwsYSk7KWI9Yi5OZXh0SW5BRUw7YS5OZXh0SW5BRUw9Yi5OZXh0SW5BRUw7bnVsbCE9PWIuTmV4dEluQUVMJiYoYi5OZXh0SW5BRUwuUHJldkluQUVMPWEpO2EuUHJldkluQUVMPWI7Yi5OZXh0SW5BRUw9YX19O2QuQ2xpcHBlci5wcm90b3R5cGUuRTJJbnNlcnRzQmVmb3JlRTE9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYi5DdXJyLlg9PWEuQ3Vyci5YP2IuVG9wLlk+YS5Ub3AuWT9iLlRvcC5YPGQuQ2xpcHBlci5Ub3BYKGEsYi5Ub3AuWSk6YS5Ub3AuWD5kLkNsaXBwZXIuVG9wWChiLGEuVG9wLlkpOmIuQ3Vyci5YPGEuQ3Vyci5YfTtkLkNsaXBwZXIucHJvdG90eXBlLklzRXZlbk9kZEZpbGxUeXBlPVxuZnVuY3Rpb24oYSl7cmV0dXJuIGEuUG9seVR5cD09ZC5Qb2x5VHlwZS5wdFN1YmplY3Q/dGhpcy5tX1N1YmpGaWxsVHlwZT09ZC5Qb2x5RmlsbFR5cGUucGZ0RXZlbk9kZDp0aGlzLm1fQ2xpcEZpbGxUeXBlPT1kLlBvbHlGaWxsVHlwZS5wZnRFdmVuT2RkfTtkLkNsaXBwZXIucHJvdG90eXBlLklzRXZlbk9kZEFsdEZpbGxUeXBlPWZ1bmN0aW9uKGEpe3JldHVybiBhLlBvbHlUeXA9PWQuUG9seVR5cGUucHRTdWJqZWN0P3RoaXMubV9DbGlwRmlsbFR5cGU9PWQuUG9seUZpbGxUeXBlLnBmdEV2ZW5PZGQ6dGhpcy5tX1N1YmpGaWxsVHlwZT09ZC5Qb2x5RmlsbFR5cGUucGZ0RXZlbk9kZH07ZC5DbGlwcGVyLnByb3RvdHlwZS5Jc0NvbnRyaWJ1dGluZz1mdW5jdGlvbihhKXt2YXIgYixjO2EuUG9seVR5cD09ZC5Qb2x5VHlwZS5wdFN1YmplY3Q/KGI9dGhpcy5tX1N1YmpGaWxsVHlwZSxjPXRoaXMubV9DbGlwRmlsbFR5cGUpOihiPXRoaXMubV9DbGlwRmlsbFR5cGUsYz10aGlzLm1fU3ViakZpbGxUeXBlKTtcbnN3aXRjaChiKXtjYXNlIGQuUG9seUZpbGxUeXBlLnBmdEV2ZW5PZGQ6aWYoMD09PWEuV2luZERlbHRhJiYxIT1hLldpbmRDbnQpcmV0dXJuITE7YnJlYWs7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvOmlmKDEhPU1hdGguYWJzKGEuV2luZENudCkpcmV0dXJuITE7YnJlYWs7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZTppZigxIT1hLldpbmRDbnQpcmV0dXJuITE7YnJlYWs7ZGVmYXVsdDppZigtMSE9YS5XaW5kQ250KXJldHVybiExfXN3aXRjaCh0aGlzLm1fQ2xpcFR5cGUpe2Nhc2UgZC5DbGlwVHlwZS5jdEludGVyc2VjdGlvbjpzd2l0Y2goYyl7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRFdmVuT2RkOmNhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybzpyZXR1cm4gMCE9PWEuV2luZENudDI7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZTpyZXR1cm4gMDxhLldpbmRDbnQyO2RlZmF1bHQ6cmV0dXJuIDA+YS5XaW5kQ250Mn1jYXNlIGQuQ2xpcFR5cGUuY3RVbmlvbjpzd2l0Y2goYyl7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRFdmVuT2RkOmNhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybzpyZXR1cm4gMD09PVxuYS5XaW5kQ250MjtjYXNlIGQuUG9seUZpbGxUeXBlLnBmdFBvc2l0aXZlOnJldHVybiAwPj1hLldpbmRDbnQyO2RlZmF1bHQ6cmV0dXJuIDA8PWEuV2luZENudDJ9Y2FzZSBkLkNsaXBUeXBlLmN0RGlmZmVyZW5jZTppZihhLlBvbHlUeXA9PWQuUG9seVR5cGUucHRTdWJqZWN0KXN3aXRjaChjKXtjYXNlIGQuUG9seUZpbGxUeXBlLnBmdEV2ZW5PZGQ6Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvOnJldHVybiAwPT09YS5XaW5kQ250MjtjYXNlIGQuUG9seUZpbGxUeXBlLnBmdFBvc2l0aXZlOnJldHVybiAwPj1hLldpbmRDbnQyO2RlZmF1bHQ6cmV0dXJuIDA8PWEuV2luZENudDJ9ZWxzZSBzd2l0Y2goYyl7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRFdmVuT2RkOmNhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybzpyZXR1cm4gMCE9PWEuV2luZENudDI7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZTpyZXR1cm4gMDxhLldpbmRDbnQyO2RlZmF1bHQ6cmV0dXJuIDA+XG5hLldpbmRDbnQyfWNhc2UgZC5DbGlwVHlwZS5jdFhvcjppZigwPT09YS5XaW5kRGVsdGEpc3dpdGNoKGMpe2Nhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0RXZlbk9kZDpjYXNlIGQuUG9seUZpbGxUeXBlLnBmdE5vblplcm86cmV0dXJuIDA9PT1hLldpbmRDbnQyO2Nhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0UG9zaXRpdmU6cmV0dXJuIDA+PWEuV2luZENudDI7ZGVmYXVsdDpyZXR1cm4gMDw9YS5XaW5kQ250Mn19cmV0dXJuITB9O2QuQ2xpcHBlci5wcm90b3R5cGUuU2V0V2luZGluZ0NvdW50PWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1hLlByZXZJbkFFTDtudWxsIT09YiYmKGIuUG9seVR5cCE9YS5Qb2x5VHlwfHwwPT09Yi5XaW5kRGVsdGEpOyliPWIuUHJldkluQUVMO2lmKG51bGw9PT1iKWEuV2luZENudD0wPT09YS5XaW5kRGVsdGE/MTphLldpbmREZWx0YSxhLldpbmRDbnQyPTAsYj10aGlzLm1fQWN0aXZlRWRnZXM7ZWxzZXtpZigwPT09YS5XaW5kRGVsdGEmJnRoaXMubV9DbGlwVHlwZSE9XG5kLkNsaXBUeXBlLmN0VW5pb24pYS5XaW5kQ250PTE7ZWxzZSBpZih0aGlzLklzRXZlbk9kZEZpbGxUeXBlKGEpKWlmKDA9PT1hLldpbmREZWx0YSl7Zm9yKHZhciBjPSEwLGU9Yi5QcmV2SW5BRUw7bnVsbCE9PWU7KWUuUG9seVR5cD09Yi5Qb2x5VHlwJiYwIT09ZS5XaW5kRGVsdGEmJihjPSFjKSxlPWUuUHJldkluQUVMO2EuV2luZENudD1jPzA6MX1lbHNlIGEuV2luZENudD1hLldpbmREZWx0YTtlbHNlIDA+Yi5XaW5kQ250KmIuV2luZERlbHRhPzE8TWF0aC5hYnMoYi5XaW5kQ250KT9hLldpbmRDbnQ9MD5iLldpbmREZWx0YSphLldpbmREZWx0YT9iLldpbmRDbnQ6Yi5XaW5kQ250K2EuV2luZERlbHRhOmEuV2luZENudD0wPT09YS5XaW5kRGVsdGE/MTphLldpbmREZWx0YTphLldpbmRDbnQ9MD09PWEuV2luZERlbHRhPzA+Yi5XaW5kQ250P2IuV2luZENudC0xOmIuV2luZENudCsxOjA+Yi5XaW5kRGVsdGEqYS5XaW5kRGVsdGE/Yi5XaW5kQ250OmIuV2luZENudCthLldpbmREZWx0YTtcbmEuV2luZENudDI9Yi5XaW5kQ250MjtiPWIuTmV4dEluQUVMfWlmKHRoaXMuSXNFdmVuT2RkQWx0RmlsbFR5cGUoYSkpZm9yKDtiIT1hOykwIT09Yi5XaW5kRGVsdGEmJihhLldpbmRDbnQyPTA9PT1hLldpbmRDbnQyPzE6MCksYj1iLk5leHRJbkFFTDtlbHNlIGZvcig7YiE9YTspYS5XaW5kQ250Mis9Yi5XaW5kRGVsdGEsYj1iLk5leHRJbkFFTH07ZC5DbGlwcGVyLnByb3RvdHlwZS5BZGRFZGdlVG9TRUw9ZnVuY3Rpb24oYSl7bnVsbD09PXRoaXMubV9Tb3J0ZWRFZGdlcz8odGhpcy5tX1NvcnRlZEVkZ2VzPWEsYS5QcmV2SW5TRUw9bnVsbCxhLk5leHRJblNFTD1udWxsKTooYS5OZXh0SW5TRUw9dGhpcy5tX1NvcnRlZEVkZ2VzLGEuUHJldkluU0VMPW51bGwsdGhpcy5tX1NvcnRlZEVkZ2VzPXRoaXMubV9Tb3J0ZWRFZGdlcy5QcmV2SW5TRUw9YSl9O2QuQ2xpcHBlci5wcm90b3R5cGUuQ29weUFFTFRvU0VMPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5tX0FjdGl2ZUVkZ2VzO2Zvcih0aGlzLm1fU29ydGVkRWRnZXM9XG5hO251bGwhPT1hOylhLlByZXZJblNFTD1hLlByZXZJbkFFTCxhPWEuTmV4dEluU0VMPWEuTmV4dEluQUVMfTtkLkNsaXBwZXIucHJvdG90eXBlLlN3YXBQb3NpdGlvbnNJbkFFTD1mdW5jdGlvbihhLGIpe2lmKGEuTmV4dEluQUVMIT1hLlByZXZJbkFFTCYmYi5OZXh0SW5BRUwhPWIuUHJldkluQUVMKXtpZihhLk5leHRJbkFFTD09Yil7dmFyIGM9Yi5OZXh0SW5BRUw7bnVsbCE9PWMmJihjLlByZXZJbkFFTD1hKTt2YXIgZT1hLlByZXZJbkFFTDtudWxsIT09ZSYmKGUuTmV4dEluQUVMPWIpO2IuUHJldkluQUVMPWU7Yi5OZXh0SW5BRUw9YTthLlByZXZJbkFFTD1iO2EuTmV4dEluQUVMPWN9ZWxzZSBiLk5leHRJbkFFTD09YT8oYz1hLk5leHRJbkFFTCxudWxsIT09YyYmKGMuUHJldkluQUVMPWIpLGU9Yi5QcmV2SW5BRUwsbnVsbCE9PWUmJihlLk5leHRJbkFFTD1hKSxhLlByZXZJbkFFTD1lLGEuTmV4dEluQUVMPWIsYi5QcmV2SW5BRUw9YSxiLk5leHRJbkFFTD1jKTooYz1hLk5leHRJbkFFTCxcbmU9YS5QcmV2SW5BRUwsYS5OZXh0SW5BRUw9Yi5OZXh0SW5BRUwsbnVsbCE9PWEuTmV4dEluQUVMJiYoYS5OZXh0SW5BRUwuUHJldkluQUVMPWEpLGEuUHJldkluQUVMPWIuUHJldkluQUVMLG51bGwhPT1hLlByZXZJbkFFTCYmKGEuUHJldkluQUVMLk5leHRJbkFFTD1hKSxiLk5leHRJbkFFTD1jLG51bGwhPT1iLk5leHRJbkFFTCYmKGIuTmV4dEluQUVMLlByZXZJbkFFTD1iKSxiLlByZXZJbkFFTD1lLG51bGwhPT1iLlByZXZJbkFFTCYmKGIuUHJldkluQUVMLk5leHRJbkFFTD1iKSk7bnVsbD09PWEuUHJldkluQUVMP3RoaXMubV9BY3RpdmVFZGdlcz1hOm51bGw9PT1iLlByZXZJbkFFTCYmKHRoaXMubV9BY3RpdmVFZGdlcz1iKX19O2QuQ2xpcHBlci5wcm90b3R5cGUuU3dhcFBvc2l0aW9uc0luU0VMPWZ1bmN0aW9uKGEsYil7aWYobnVsbCE9PWEuTmV4dEluU0VMfHxudWxsIT09YS5QcmV2SW5TRUwpaWYobnVsbCE9PWIuTmV4dEluU0VMfHxudWxsIT09Yi5QcmV2SW5TRUwpe2lmKGEuTmV4dEluU0VMPT1cbmIpe3ZhciBjPWIuTmV4dEluU0VMO251bGwhPT1jJiYoYy5QcmV2SW5TRUw9YSk7dmFyIGU9YS5QcmV2SW5TRUw7bnVsbCE9PWUmJihlLk5leHRJblNFTD1iKTtiLlByZXZJblNFTD1lO2IuTmV4dEluU0VMPWE7YS5QcmV2SW5TRUw9YjthLk5leHRJblNFTD1jfWVsc2UgYi5OZXh0SW5TRUw9PWE/KGM9YS5OZXh0SW5TRUwsbnVsbCE9PWMmJihjLlByZXZJblNFTD1iKSxlPWIuUHJldkluU0VMLG51bGwhPT1lJiYoZS5OZXh0SW5TRUw9YSksYS5QcmV2SW5TRUw9ZSxhLk5leHRJblNFTD1iLGIuUHJldkluU0VMPWEsYi5OZXh0SW5TRUw9Yyk6KGM9YS5OZXh0SW5TRUwsZT1hLlByZXZJblNFTCxhLk5leHRJblNFTD1iLk5leHRJblNFTCxudWxsIT09YS5OZXh0SW5TRUwmJihhLk5leHRJblNFTC5QcmV2SW5TRUw9YSksYS5QcmV2SW5TRUw9Yi5QcmV2SW5TRUwsbnVsbCE9PWEuUHJldkluU0VMJiYoYS5QcmV2SW5TRUwuTmV4dEluU0VMPWEpLGIuTmV4dEluU0VMPWMsbnVsbCE9PWIuTmV4dEluU0VMJiZcbihiLk5leHRJblNFTC5QcmV2SW5TRUw9YiksYi5QcmV2SW5TRUw9ZSxudWxsIT09Yi5QcmV2SW5TRUwmJihiLlByZXZJblNFTC5OZXh0SW5TRUw9YikpO251bGw9PT1hLlByZXZJblNFTD90aGlzLm1fU29ydGVkRWRnZXM9YTpudWxsPT09Yi5QcmV2SW5TRUwmJih0aGlzLm1fU29ydGVkRWRnZXM9Yil9fTtkLkNsaXBwZXIucHJvdG90eXBlLkFkZExvY2FsTWF4UG9seT1mdW5jdGlvbihhLGIsYyl7dGhpcy5BZGRPdXRQdChhLGMpOzA9PWIuV2luZERlbHRhJiZ0aGlzLkFkZE91dFB0KGIsYyk7YS5PdXRJZHg9PWIuT3V0SWR4PyhhLk91dElkeD0tMSxiLk91dElkeD0tMSk6YS5PdXRJZHg8Yi5PdXRJZHg/dGhpcy5BcHBlbmRQb2x5Z29uKGEsYik6dGhpcy5BcHBlbmRQb2x5Z29uKGIsYSl9O2QuQ2xpcHBlci5wcm90b3R5cGUuQWRkTG9jYWxNaW5Qb2x5PWZ1bmN0aW9uKGEsYixjKXt2YXIgZSxmO2QuQ2xpcHBlckJhc2UuSXNIb3Jpem9udGFsKGIpfHxhLkR4PmIuRHg/KGU9dGhpcy5BZGRPdXRQdChhLFxuYyksYi5PdXRJZHg9YS5PdXRJZHgsYS5TaWRlPWQuRWRnZVNpZGUuZXNMZWZ0LGIuU2lkZT1kLkVkZ2VTaWRlLmVzUmlnaHQsZj1hLGE9Zi5QcmV2SW5BRUw9PWI/Yi5QcmV2SW5BRUw6Zi5QcmV2SW5BRUwpOihlPXRoaXMuQWRkT3V0UHQoYixjKSxhLk91dElkeD1iLk91dElkeCxhLlNpZGU9ZC5FZGdlU2lkZS5lc1JpZ2h0LGIuU2lkZT1kLkVkZ2VTaWRlLmVzTGVmdCxmPWIsYT1mLlByZXZJbkFFTD09YT9hLlByZXZJbkFFTDpmLlByZXZJbkFFTCk7bnVsbCE9PWEmJjA8PWEuT3V0SWR4JiZkLkNsaXBwZXIuVG9wWChhLGMuWSk9PWQuQ2xpcHBlci5Ub3BYKGYsYy5ZKSYmZC5DbGlwcGVyQmFzZS5TbG9wZXNFcXVhbChmLGEsdGhpcy5tX1VzZUZ1bGxSYW5nZSkmJjAhPT1mLldpbmREZWx0YSYmMCE9PWEuV2luZERlbHRhJiYoYz10aGlzLkFkZE91dFB0KGEsYyksdGhpcy5BZGRKb2luKGUsYyxmLlRvcCkpO3JldHVybiBlfTtkLkNsaXBwZXIucHJvdG90eXBlLkNyZWF0ZU91dFJlYz1mdW5jdGlvbigpe3ZhciBhPVxubmV3IGQuT3V0UmVjO2EuSWR4PS0xO2EuSXNIb2xlPSExO2EuSXNPcGVuPSExO2EuRmlyc3RMZWZ0PW51bGw7YS5QdHM9bnVsbDthLkJvdHRvbVB0PW51bGw7YS5Qb2x5Tm9kZT1udWxsO3RoaXMubV9Qb2x5T3V0cy5wdXNoKGEpO2EuSWR4PXRoaXMubV9Qb2x5T3V0cy5sZW5ndGgtMTtyZXR1cm4gYX07ZC5DbGlwcGVyLnByb3RvdHlwZS5BZGRPdXRQdD1mdW5jdGlvbihhLGIpe3ZhciBjPWEuU2lkZT09ZC5FZGdlU2lkZS5lc0xlZnQ7aWYoMD5hLk91dElkeCl7dmFyIGU9dGhpcy5DcmVhdGVPdXRSZWMoKTtlLklzT3Blbj0wPT09YS5XaW5kRGVsdGE7dmFyIGY9bmV3IGQuT3V0UHQ7ZS5QdHM9ZjtmLklkeD1lLklkeDtmLlB0Llg9Yi5YO2YuUHQuWT1iLlk7Zi5OZXh0PWY7Zi5QcmV2PWY7ZS5Jc09wZW58fHRoaXMuU2V0SG9sZVN0YXRlKGEsZSk7YS5PdXRJZHg9ZS5JZHh9ZWxzZXt2YXIgZT10aGlzLm1fUG9seU91dHNbYS5PdXRJZHhdLGc9ZS5QdHM7aWYoYyYmZC5JbnRQb2ludC5vcF9FcXVhbGl0eShiLFxuZy5QdCkpcmV0dXJuIGc7aWYoIWMmJmQuSW50UG9pbnQub3BfRXF1YWxpdHkoYixnLlByZXYuUHQpKXJldHVybiBnLlByZXY7Zj1uZXcgZC5PdXRQdDtmLklkeD1lLklkeDtmLlB0Llg9Yi5YO2YuUHQuWT1iLlk7Zi5OZXh0PWc7Zi5QcmV2PWcuUHJldjtmLlByZXYuTmV4dD1mO2cuUHJldj1mO2MmJihlLlB0cz1mKX1yZXR1cm4gZn07ZC5DbGlwcGVyLnByb3RvdHlwZS5Td2FwUG9pbnRzPWZ1bmN0aW9uKGEsYil7dmFyIGM9bmV3IGQuSW50UG9pbnQoYS5WYWx1ZSk7YS5WYWx1ZS5YPWIuVmFsdWUuWDthLlZhbHVlLlk9Yi5WYWx1ZS5ZO2IuVmFsdWUuWD1jLlg7Yi5WYWx1ZS5ZPWMuWX07ZC5DbGlwcGVyLnByb3RvdHlwZS5Ib3J6U2VnbWVudHNPdmVybGFwPWZ1bmN0aW9uKGEsYixjLGUpe3JldHVybiBhLlg+Yy5YPT1hLlg8ZS5YPyEwOmIuWD5jLlg9PWIuWDxlLlg/ITA6Yy5YPmEuWD09Yy5YPGIuWD8hMDplLlg+YS5YPT1lLlg8Yi5YPyEwOmEuWD09Yy5YJiZiLlg9PWUuWD8hMDphLlg9PVxuZS5YJiZiLlg9PWMuWD8hMDohMX07ZC5DbGlwcGVyLnByb3RvdHlwZS5JbnNlcnRQb2x5UHRCZXR3ZWVuPWZ1bmN0aW9uKGEsYixjKXt2YXIgZT1uZXcgZC5PdXRQdDtlLlB0Llg9Yy5YO2UuUHQuWT1jLlk7Yj09YS5OZXh0PyhhLk5leHQ9ZSxiLlByZXY9ZSxlLk5leHQ9YixlLlByZXY9YSk6KGIuTmV4dD1lLGEuUHJldj1lLGUuTmV4dD1hLGUuUHJldj1iKTtyZXR1cm4gZX07ZC5DbGlwcGVyLnByb3RvdHlwZS5TZXRIb2xlU3RhdGU9ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9ITEsZT1hLlByZXZJbkFFTDtudWxsIT09ZTspMDw9ZS5PdXRJZHgmJjAhPWUuV2luZERlbHRhJiYoYz0hYyxudWxsPT09Yi5GaXJzdExlZnQmJihiLkZpcnN0TGVmdD10aGlzLm1fUG9seU91dHNbZS5PdXRJZHhdKSksZT1lLlByZXZJbkFFTDtjJiYoYi5Jc0hvbGU9ITApfTtkLkNsaXBwZXIucHJvdG90eXBlLkdldER4PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuWT09Yi5ZP2QuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbDpcbihiLlgtYS5YKS8oYi5ZLWEuWSl9O2QuQ2xpcHBlci5wcm90b3R5cGUuRmlyc3RJc0JvdHRvbVB0PWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPWEuUHJldjtkLkludFBvaW50Lm9wX0VxdWFsaXR5KGMuUHQsYS5QdCkmJmMhPWE7KWM9Yy5QcmV2O2Zvcih2YXIgZT1NYXRoLmFicyh0aGlzLkdldER4KGEuUHQsYy5QdCkpLGM9YS5OZXh0O2QuSW50UG9pbnQub3BfRXF1YWxpdHkoYy5QdCxhLlB0KSYmYyE9YTspYz1jLk5leHQ7Zm9yKHZhciBmPU1hdGguYWJzKHRoaXMuR2V0RHgoYS5QdCxjLlB0KSksYz1iLlByZXY7ZC5JbnRQb2ludC5vcF9FcXVhbGl0eShjLlB0LGIuUHQpJiZjIT1iOyljPWMuUHJldjtmb3IodmFyIGc9TWF0aC5hYnModGhpcy5HZXREeChiLlB0LGMuUHQpKSxjPWIuTmV4dDtkLkludFBvaW50Lm9wX0VxdWFsaXR5KGMuUHQsYi5QdCkmJmMhPWI7KWM9Yy5OZXh0O2M9TWF0aC5hYnModGhpcy5HZXREeChiLlB0LGMuUHQpKTtyZXR1cm4gZT49ZyYmZT49Y3x8Zj49ZyYmZj49XG5jfTtkLkNsaXBwZXIucHJvdG90eXBlLkdldEJvdHRvbVB0PWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1udWxsLGM9YS5OZXh0O2MhPWE7KWMuUHQuWT5hLlB0Llk/KGE9YyxiPW51bGwpOmMuUHQuWT09YS5QdC5ZJiZjLlB0Llg8PWEuUHQuWCYmKGMuUHQuWDxhLlB0Llg/KGI9bnVsbCxhPWMpOmMuTmV4dCE9YSYmYy5QcmV2IT1hJiYoYj1jKSksYz1jLk5leHQ7aWYobnVsbCE9PWIpZm9yKDtiIT1jOylmb3IodGhpcy5GaXJzdElzQm90dG9tUHQoYyxiKXx8KGE9YiksYj1iLk5leHQ7ZC5JbnRQb2ludC5vcF9JbmVxdWFsaXR5KGIuUHQsYS5QdCk7KWI9Yi5OZXh0O3JldHVybiBhfTtkLkNsaXBwZXIucHJvdG90eXBlLkdldExvd2VybW9zdFJlYz1mdW5jdGlvbihhLGIpe251bGw9PT1hLkJvdHRvbVB0JiYoYS5Cb3R0b21QdD10aGlzLkdldEJvdHRvbVB0KGEuUHRzKSk7bnVsbD09PWIuQm90dG9tUHQmJihiLkJvdHRvbVB0PXRoaXMuR2V0Qm90dG9tUHQoYi5QdHMpKTt2YXIgYz1hLkJvdHRvbVB0LFxuZT1iLkJvdHRvbVB0O3JldHVybiBjLlB0Llk+ZS5QdC5ZP2E6Yy5QdC5ZPGUuUHQuWT9iOmMuUHQuWDxlLlB0Llg/YTpjLlB0Llg+ZS5QdC5YP2I6Yy5OZXh0PT1jP2I6ZS5OZXh0PT1lP2E6dGhpcy5GaXJzdElzQm90dG9tUHQoYyxlKT9hOmJ9O2QuQ2xpcHBlci5wcm90b3R5cGUuUGFyYW0xUmlnaHRPZlBhcmFtMj1mdW5jdGlvbihhLGIpe2RvIGlmKGE9YS5GaXJzdExlZnQsYT09YilyZXR1cm4hMDt3aGlsZShudWxsIT09YSk7cmV0dXJuITF9O2QuQ2xpcHBlci5wcm90b3R5cGUuR2V0T3V0UmVjPWZ1bmN0aW9uKGEpe2ZvcihhPXRoaXMubV9Qb2x5T3V0c1thXTthIT10aGlzLm1fUG9seU91dHNbYS5JZHhdOylhPXRoaXMubV9Qb2x5T3V0c1thLklkeF07cmV0dXJuIGF9O2QuQ2xpcHBlci5wcm90b3R5cGUuQXBwZW5kUG9seWdvbj1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMubV9Qb2x5T3V0c1thLk91dElkeF0sZT10aGlzLm1fUG9seU91dHNbYi5PdXRJZHhdLGY7Zj10aGlzLlBhcmFtMVJpZ2h0T2ZQYXJhbTIoYyxcbmUpP2U6dGhpcy5QYXJhbTFSaWdodE9mUGFyYW0yKGUsYyk/Yzp0aGlzLkdldExvd2VybW9zdFJlYyhjLGUpO3ZhciBnPWMuUHRzLGg9Zy5QcmV2LGw9ZS5QdHMsaz1sLlByZXY7YS5TaWRlPT1kLkVkZ2VTaWRlLmVzTGVmdD8oYi5TaWRlPT1kLkVkZ2VTaWRlLmVzTGVmdD8odGhpcy5SZXZlcnNlUG9seVB0TGlua3MobCksbC5OZXh0PWcsZy5QcmV2PWwsaC5OZXh0PWssay5QcmV2PWgsYy5QdHM9ayk6KGsuTmV4dD1nLGcuUHJldj1rLGwuUHJldj1oLGguTmV4dD1sLGMuUHRzPWwpLGc9ZC5FZGdlU2lkZS5lc0xlZnQpOihiLlNpZGU9PWQuRWRnZVNpZGUuZXNSaWdodD8odGhpcy5SZXZlcnNlUG9seVB0TGlua3MobCksaC5OZXh0PWssay5QcmV2PWgsbC5OZXh0PWcsZy5QcmV2PWwpOihoLk5leHQ9bCxsLlByZXY9aCxnLlByZXY9ayxrLk5leHQ9ZyksZz1kLkVkZ2VTaWRlLmVzUmlnaHQpO2MuQm90dG9tUHQ9bnVsbDtmPT1lJiYoZS5GaXJzdExlZnQhPWMmJihjLkZpcnN0TGVmdD1lLkZpcnN0TGVmdCksXG5jLklzSG9sZT1lLklzSG9sZSk7ZS5QdHM9bnVsbDtlLkJvdHRvbVB0PW51bGw7ZS5GaXJzdExlZnQ9YztmPWEuT3V0SWR4O2g9Yi5PdXRJZHg7YS5PdXRJZHg9LTE7Yi5PdXRJZHg9LTE7Zm9yKGw9dGhpcy5tX0FjdGl2ZUVkZ2VzO251bGwhPT1sOyl7aWYobC5PdXRJZHg9PWgpe2wuT3V0SWR4PWY7bC5TaWRlPWc7YnJlYWt9bD1sLk5leHRJbkFFTH1lLklkeD1jLklkeH07ZC5DbGlwcGVyLnByb3RvdHlwZS5SZXZlcnNlUG9seVB0TGlua3M9ZnVuY3Rpb24oYSl7aWYobnVsbCE9PWEpe3ZhciBiLGM7Yj1hO2RvIGM9Yi5OZXh0LGIuTmV4dD1iLlByZXYsYj1iLlByZXY9Yzt3aGlsZShiIT1hKX19O2QuQ2xpcHBlci5Td2FwU2lkZXM9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLlNpZGU7YS5TaWRlPWIuU2lkZTtiLlNpZGU9Y307ZC5DbGlwcGVyLlN3YXBQb2x5SW5kZXhlcz1mdW5jdGlvbihhLGIpe3ZhciBjPWEuT3V0SWR4O2EuT3V0SWR4PWIuT3V0SWR4O2IuT3V0SWR4PWN9O2QuQ2xpcHBlci5wcm90b3R5cGUuSW50ZXJzZWN0RWRnZXM9XG5mdW5jdGlvbihhLGIsYyxlKXt2YXIgZj0hZSYmbnVsbD09PWEuTmV4dEluTE1MJiZhLlRvcC5YPT1jLlgmJmEuVG9wLlk9PWMuWTtlPSFlJiZudWxsPT09Yi5OZXh0SW5MTUwmJmIuVG9wLlg9PWMuWCYmYi5Ub3AuWT09Yy5ZO3ZhciBnPTA8PWEuT3V0SWR4LGg9MDw9Yi5PdXRJZHg7aWYoMD09PWEuV2luZERlbHRhfHwwPT09Yi5XaW5kRGVsdGEpMD09PWEuV2luZERlbHRhJiYwPT09Yi5XaW5kRGVsdGE/KGZ8fGUpJiZnJiZoJiZ0aGlzLkFkZExvY2FsTWF4UG9seShhLGIsYyk6YS5Qb2x5VHlwPT1iLlBvbHlUeXAmJmEuV2luZERlbHRhIT1iLldpbmREZWx0YSYmdGhpcy5tX0NsaXBUeXBlPT1kLkNsaXBUeXBlLmN0VW5pb24/MD09PWEuV2luZERlbHRhP2gmJih0aGlzLkFkZE91dFB0KGEsYyksZyYmKGEuT3V0SWR4PS0xKSk6ZyYmKHRoaXMuQWRkT3V0UHQoYixjKSxoJiYoYi5PdXRJZHg9LTEpKTphLlBvbHlUeXAhPWIuUG9seVR5cCYmKDAhPT1hLldpbmREZWx0YXx8MSE9TWF0aC5hYnMoYi5XaW5kQ250KXx8XG50aGlzLm1fQ2xpcFR5cGU9PWQuQ2xpcFR5cGUuY3RVbmlvbiYmMCE9PWIuV2luZENudDI/MCE9PWIuV2luZERlbHRhfHwxIT1NYXRoLmFicyhhLldpbmRDbnQpfHx0aGlzLm1fQ2xpcFR5cGU9PWQuQ2xpcFR5cGUuY3RVbmlvbiYmMCE9PWEuV2luZENudDJ8fCh0aGlzLkFkZE91dFB0KGIsYyksaCYmKGIuT3V0SWR4PS0xKSk6KHRoaXMuQWRkT3V0UHQoYSxjKSxnJiYoYS5PdXRJZHg9LTEpKSksZiYmKDA+YS5PdXRJZHg/dGhpcy5EZWxldGVGcm9tQUVMKGEpOmQuRXJyb3IoXCJFcnJvciBpbnRlcnNlY3RpbmcgcG9seWxpbmVzXCIpKSxlJiYoMD5iLk91dElkeD90aGlzLkRlbGV0ZUZyb21BRUwoYik6ZC5FcnJvcihcIkVycm9yIGludGVyc2VjdGluZyBwb2x5bGluZXNcIikpO2Vsc2V7aWYoYS5Qb2x5VHlwPT1iLlBvbHlUeXApaWYodGhpcy5Jc0V2ZW5PZGRGaWxsVHlwZShhKSl7dmFyIGw9YS5XaW5kQ250O2EuV2luZENudD1iLldpbmRDbnQ7Yi5XaW5kQ250PWx9ZWxzZSBhLldpbmRDbnQ9XG4wPT09YS5XaW5kQ250K2IuV2luZERlbHRhPy1hLldpbmRDbnQ6YS5XaW5kQ250K2IuV2luZERlbHRhLGIuV2luZENudD0wPT09Yi5XaW5kQ250LWEuV2luZERlbHRhPy1iLldpbmRDbnQ6Yi5XaW5kQ250LWEuV2luZERlbHRhO2Vsc2UgdGhpcy5Jc0V2ZW5PZGRGaWxsVHlwZShiKT9hLldpbmRDbnQyPTA9PT1hLldpbmRDbnQyPzE6MDphLldpbmRDbnQyKz1iLldpbmREZWx0YSx0aGlzLklzRXZlbk9kZEZpbGxUeXBlKGEpP2IuV2luZENudDI9MD09PWIuV2luZENudDI/MTowOmIuV2luZENudDItPWEuV2luZERlbHRhO3ZhciBrLG4sbTthLlBvbHlUeXA9PWQuUG9seVR5cGUucHRTdWJqZWN0PyhrPXRoaXMubV9TdWJqRmlsbFR5cGUsbT10aGlzLm1fQ2xpcEZpbGxUeXBlKTooaz10aGlzLm1fQ2xpcEZpbGxUeXBlLG09dGhpcy5tX1N1YmpGaWxsVHlwZSk7Yi5Qb2x5VHlwPT1kLlBvbHlUeXBlLnB0U3ViamVjdD8obj10aGlzLm1fU3ViakZpbGxUeXBlLGw9dGhpcy5tX0NsaXBGaWxsVHlwZSk6XG4obj10aGlzLm1fQ2xpcEZpbGxUeXBlLGw9dGhpcy5tX1N1YmpGaWxsVHlwZSk7c3dpdGNoKGspe2Nhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0UG9zaXRpdmU6az1hLldpbmRDbnQ7YnJlYWs7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnROZWdhdGl2ZTprPS1hLldpbmRDbnQ7YnJlYWs7ZGVmYXVsdDprPU1hdGguYWJzKGEuV2luZENudCl9c3dpdGNoKG4pe2Nhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0UG9zaXRpdmU6bj1iLldpbmRDbnQ7YnJlYWs7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnROZWdhdGl2ZTpuPS1iLldpbmRDbnQ7YnJlYWs7ZGVmYXVsdDpuPU1hdGguYWJzKGIuV2luZENudCl9aWYoZyYmaClmfHxlfHwwIT09ayYmMSE9a3x8MCE9PW4mJjEhPW58fGEuUG9seVR5cCE9Yi5Qb2x5VHlwJiZ0aGlzLm1fQ2xpcFR5cGUhPWQuQ2xpcFR5cGUuY3RYb3I/dGhpcy5BZGRMb2NhbE1heFBvbHkoYSxiLGMpOih0aGlzLkFkZE91dFB0KGEsYyksdGhpcy5BZGRPdXRQdChiLGMpLGQuQ2xpcHBlci5Td2FwU2lkZXMoYSxcbmIpLGQuQ2xpcHBlci5Td2FwUG9seUluZGV4ZXMoYSxiKSk7ZWxzZSBpZihnKXtpZigwPT09bnx8MT09bil0aGlzLkFkZE91dFB0KGEsYyksZC5DbGlwcGVyLlN3YXBTaWRlcyhhLGIpLGQuQ2xpcHBlci5Td2FwUG9seUluZGV4ZXMoYSxiKX1lbHNlIGlmKGgpe2lmKDA9PT1rfHwxPT1rKXRoaXMuQWRkT3V0UHQoYixjKSxkLkNsaXBwZXIuU3dhcFNpZGVzKGEsYiksZC5DbGlwcGVyLlN3YXBQb2x5SW5kZXhlcyhhLGIpfWVsc2UgaWYoISgwIT09ayYmMSE9a3x8MCE9PW4mJjEhPW58fGZ8fGUpKXtzd2l0Y2gobSl7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZTpnPWEuV2luZENudDI7YnJlYWs7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnROZWdhdGl2ZTpnPS1hLldpbmRDbnQyO2JyZWFrO2RlZmF1bHQ6Zz1NYXRoLmFicyhhLldpbmRDbnQyKX1zd2l0Y2gobCl7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZTpoPWIuV2luZENudDI7YnJlYWs7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnROZWdhdGl2ZTpoPVxuLWIuV2luZENudDI7YnJlYWs7ZGVmYXVsdDpoPU1hdGguYWJzKGIuV2luZENudDIpfWlmKGEuUG9seVR5cCE9Yi5Qb2x5VHlwKXRoaXMuQWRkTG9jYWxNaW5Qb2x5KGEsYixjKTtlbHNlIGlmKDE9PWsmJjE9PW4pc3dpdGNoKHRoaXMubV9DbGlwVHlwZSl7Y2FzZSBkLkNsaXBUeXBlLmN0SW50ZXJzZWN0aW9uOjA8ZyYmMDxoJiZ0aGlzLkFkZExvY2FsTWluUG9seShhLGIsYyk7YnJlYWs7Y2FzZSBkLkNsaXBUeXBlLmN0VW5pb246MD49ZyYmMD49aCYmdGhpcy5BZGRMb2NhbE1pblBvbHkoYSxiLGMpO2JyZWFrO2Nhc2UgZC5DbGlwVHlwZS5jdERpZmZlcmVuY2U6KGEuUG9seVR5cD09ZC5Qb2x5VHlwZS5wdENsaXAmJjA8ZyYmMDxofHxhLlBvbHlUeXA9PWQuUG9seVR5cGUucHRTdWJqZWN0JiYwPj1nJiYwPj1oKSYmdGhpcy5BZGRMb2NhbE1pblBvbHkoYSxiLGMpO2JyZWFrO2Nhc2UgZC5DbGlwVHlwZS5jdFhvcjp0aGlzLkFkZExvY2FsTWluUG9seShhLGIsYyl9ZWxzZSBkLkNsaXBwZXIuU3dhcFNpZGVzKGEsXG5iKX1mIT1lJiYoZiYmMDw9YS5PdXRJZHh8fGUmJjA8PWIuT3V0SWR4KSYmKGQuQ2xpcHBlci5Td2FwU2lkZXMoYSxiKSxkLkNsaXBwZXIuU3dhcFBvbHlJbmRleGVzKGEsYikpO2YmJnRoaXMuRGVsZXRlRnJvbUFFTChhKTtlJiZ0aGlzLkRlbGV0ZUZyb21BRUwoYil9fTtkLkNsaXBwZXIucHJvdG90eXBlLkRlbGV0ZUZyb21BRUw9ZnVuY3Rpb24oYSl7dmFyIGI9YS5QcmV2SW5BRUwsYz1hLk5leHRJbkFFTDtpZihudWxsIT09Ynx8bnVsbCE9PWN8fGE9PXRoaXMubV9BY3RpdmVFZGdlcyludWxsIT09Yj9iLk5leHRJbkFFTD1jOnRoaXMubV9BY3RpdmVFZGdlcz1jLG51bGwhPT1jJiYoYy5QcmV2SW5BRUw9YiksYS5OZXh0SW5BRUw9bnVsbCxhLlByZXZJbkFFTD1udWxsfTtkLkNsaXBwZXIucHJvdG90eXBlLkRlbGV0ZUZyb21TRUw9ZnVuY3Rpb24oYSl7dmFyIGI9YS5QcmV2SW5TRUwsYz1hLk5leHRJblNFTDtpZihudWxsIT09Ynx8bnVsbCE9PWN8fGE9PXRoaXMubV9Tb3J0ZWRFZGdlcyludWxsIT09XG5iP2IuTmV4dEluU0VMPWM6dGhpcy5tX1NvcnRlZEVkZ2VzPWMsbnVsbCE9PWMmJihjLlByZXZJblNFTD1iKSxhLk5leHRJblNFTD1udWxsLGEuUHJldkluU0VMPW51bGx9O2QuQ2xpcHBlci5wcm90b3R5cGUuVXBkYXRlRWRnZUludG9BRUw9ZnVuY3Rpb24oYSl7bnVsbD09PWEuTmV4dEluTE1MJiZkLkVycm9yKFwiVXBkYXRlRWRnZUludG9BRUw6IGludmFsaWQgY2FsbFwiKTt2YXIgYj1hLlByZXZJbkFFTCxjPWEuTmV4dEluQUVMO2EuTmV4dEluTE1MLk91dElkeD1hLk91dElkeDtudWxsIT09Yj9iLk5leHRJbkFFTD1hLk5leHRJbkxNTDp0aGlzLm1fQWN0aXZlRWRnZXM9YS5OZXh0SW5MTUw7bnVsbCE9PWMmJihjLlByZXZJbkFFTD1hLk5leHRJbkxNTCk7YS5OZXh0SW5MTUwuU2lkZT1hLlNpZGU7YS5OZXh0SW5MTUwuV2luZERlbHRhPWEuV2luZERlbHRhO2EuTmV4dEluTE1MLldpbmRDbnQ9YS5XaW5kQ250O2EuTmV4dEluTE1MLldpbmRDbnQyPWEuV2luZENudDI7YT1hLk5leHRJbkxNTDtcbmEuQ3Vyci5YPWEuQm90Llg7YS5DdXJyLlk9YS5Cb3QuWTthLlByZXZJbkFFTD1iO2EuTmV4dEluQUVMPWM7ZC5DbGlwcGVyQmFzZS5Jc0hvcml6b250YWwoYSl8fHRoaXMuSW5zZXJ0U2NhbmJlYW0oYS5Ub3AuWSk7cmV0dXJuIGF9O2QuQ2xpcHBlci5wcm90b3R5cGUuUHJvY2Vzc0hvcml6b250YWxzPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj10aGlzLm1fU29ydGVkRWRnZXM7bnVsbCE9PWI7KXRoaXMuRGVsZXRlRnJvbVNFTChiKSx0aGlzLlByb2Nlc3NIb3Jpem9udGFsKGIsYSksYj10aGlzLm1fU29ydGVkRWRnZXN9O2QuQ2xpcHBlci5wcm90b3R5cGUuR2V0SG9yekRpcmVjdGlvbj1mdW5jdGlvbihhLGIpe2EuQm90Llg8YS5Ub3AuWD8oYi5MZWZ0PWEuQm90LlgsYi5SaWdodD1hLlRvcC5YLGIuRGlyPWQuRGlyZWN0aW9uLmRMZWZ0VG9SaWdodCk6KGIuTGVmdD1hLlRvcC5YLGIuUmlnaHQ9YS5Cb3QuWCxiLkRpcj1kLkRpcmVjdGlvbi5kUmlnaHRUb0xlZnQpfTtkLkNsaXBwZXIucHJvdG90eXBlLlByZXBhcmVIb3J6Sm9pbnM9XG5mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMubV9Qb2x5T3V0c1thLk91dElkeF0uUHRzO2EuU2lkZSE9ZC5FZGdlU2lkZS5lc0xlZnQmJihjPWMuUHJldik7YiYmKGQuSW50UG9pbnQub3BfRXF1YWxpdHkoYy5QdCxhLlRvcCk/dGhpcy5BZGRHaG9zdEpvaW4oYyxhLkJvdCk6dGhpcy5BZGRHaG9zdEpvaW4oYyxhLlRvcCkpfTtkLkNsaXBwZXIucHJvdG90eXBlLlByb2Nlc3NIb3Jpem9udGFsPWZ1bmN0aW9uKGEsYil7dmFyIGM9e0RpcjpudWxsLExlZnQ6bnVsbCxSaWdodDpudWxsfTt0aGlzLkdldEhvcnpEaXJlY3Rpb24oYSxjKTtmb3IodmFyIGU9Yy5EaXIsZj1jLkxlZnQsZz1jLlJpZ2h0LGg9YSxsPW51bGw7bnVsbCE9PWguTmV4dEluTE1MJiZkLkNsaXBwZXJCYXNlLklzSG9yaXpvbnRhbChoLk5leHRJbkxNTCk7KWg9aC5OZXh0SW5MTUw7Zm9yKG51bGw9PT1oLk5leHRJbkxNTCYmKGw9dGhpcy5HZXRNYXhpbWFQYWlyKGgpKTs7KXtmb3IodmFyIGs9YT09aCxuPXRoaXMuR2V0TmV4dEluQUVMKGEsXG5lKTtudWxsIT09biYmIShuLkN1cnIuWD09YS5Ub3AuWCYmbnVsbCE9PWEuTmV4dEluTE1MJiZuLkR4PGEuTmV4dEluTE1MLkR4KTspe2M9dGhpcy5HZXROZXh0SW5BRUwobixlKTtpZihlPT1kLkRpcmVjdGlvbi5kTGVmdFRvUmlnaHQmJm4uQ3Vyci5YPD1nfHxlPT1kLkRpcmVjdGlvbi5kUmlnaHRUb0xlZnQmJm4uQ3Vyci5YPj1mKXswPD1hLk91dElkeCYmMCE9YS5XaW5kRGVsdGEmJnRoaXMuUHJlcGFyZUhvcnpKb2lucyhhLGIpO2lmKG49PWwmJmspe2U9PWQuRGlyZWN0aW9uLmRMZWZ0VG9SaWdodD90aGlzLkludGVyc2VjdEVkZ2VzKGEsbixuLlRvcCwhMSk6dGhpcy5JbnRlcnNlY3RFZGdlcyhuLGEsbi5Ub3AsITEpOzA8PWwuT3V0SWR4JiZkLkVycm9yKFwiUHJvY2Vzc0hvcml6b250YWwgZXJyb3JcIik7cmV0dXJufWlmKGU9PWQuRGlyZWN0aW9uLmRMZWZ0VG9SaWdodCl7dmFyIG09bmV3IGQuSW50UG9pbnQobi5DdXJyLlgsYS5DdXJyLlkpO3RoaXMuSW50ZXJzZWN0RWRnZXMoYSxcbm4sbSwhMCl9ZWxzZSBtPW5ldyBkLkludFBvaW50KG4uQ3Vyci5YLGEuQ3Vyci5ZKSx0aGlzLkludGVyc2VjdEVkZ2VzKG4sYSxtLCEwKTt0aGlzLlN3YXBQb3NpdGlvbnNJbkFFTChhLG4pfWVsc2UgaWYoZT09ZC5EaXJlY3Rpb24uZExlZnRUb1JpZ2h0JiZuLkN1cnIuWD49Z3x8ZT09ZC5EaXJlY3Rpb24uZFJpZ2h0VG9MZWZ0JiZuLkN1cnIuWDw9ZilicmVhaztuPWN9MDw9YS5PdXRJZHgmJjAhPT1hLldpbmREZWx0YSYmdGhpcy5QcmVwYXJlSG9yekpvaW5zKGEsYik7aWYobnVsbCE9PWEuTmV4dEluTE1MJiZkLkNsaXBwZXJCYXNlLklzSG9yaXpvbnRhbChhLk5leHRJbkxNTCkpYT10aGlzLlVwZGF0ZUVkZ2VJbnRvQUVMKGEpLDA8PWEuT3V0SWR4JiZ0aGlzLkFkZE91dFB0KGEsYS5Cb3QpLGM9e0RpcjplLExlZnQ6ZixSaWdodDpnfSx0aGlzLkdldEhvcnpEaXJlY3Rpb24oYSxjKSxlPWMuRGlyLGY9Yy5MZWZ0LGc9Yy5SaWdodDtlbHNlIGJyZWFrfW51bGwhPT1hLk5leHRJbkxNTD9cbjA8PWEuT3V0SWR4PyhlPXRoaXMuQWRkT3V0UHQoYSxhLlRvcCksYT10aGlzLlVwZGF0ZUVkZ2VJbnRvQUVMKGEpLDAhPT1hLldpbmREZWx0YSYmKGY9YS5QcmV2SW5BRUwsYz1hLk5leHRJbkFFTCxudWxsIT09ZiYmZi5DdXJyLlg9PWEuQm90LlgmJmYuQ3Vyci5ZPT1hLkJvdC5ZJiYwIT09Zi5XaW5kRGVsdGEmJjA8PWYuT3V0SWR4JiZmLkN1cnIuWT5mLlRvcC5ZJiZkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGEsZix0aGlzLm1fVXNlRnVsbFJhbmdlKT8oYz10aGlzLkFkZE91dFB0KGYsYS5Cb3QpLHRoaXMuQWRkSm9pbihlLGMsYS5Ub3ApKTpudWxsIT09YyYmYy5DdXJyLlg9PWEuQm90LlgmJmMuQ3Vyci5ZPT1hLkJvdC5ZJiYwIT09Yy5XaW5kRGVsdGEmJjA8PWMuT3V0SWR4JiZjLkN1cnIuWT5jLlRvcC5ZJiZkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGEsYyx0aGlzLm1fVXNlRnVsbFJhbmdlKSYmKGM9dGhpcy5BZGRPdXRQdChjLGEuQm90KSx0aGlzLkFkZEpvaW4oZSxjLFxuYS5Ub3ApKSkpOnRoaXMuVXBkYXRlRWRnZUludG9BRUwoYSk6bnVsbCE9PWw/MDw9bC5PdXRJZHg/KGU9PWQuRGlyZWN0aW9uLmRMZWZ0VG9SaWdodD90aGlzLkludGVyc2VjdEVkZ2VzKGEsbCxhLlRvcCwhMSk6dGhpcy5JbnRlcnNlY3RFZGdlcyhsLGEsYS5Ub3AsITEpLDA8PWwuT3V0SWR4JiZkLkVycm9yKFwiUHJvY2Vzc0hvcml6b250YWwgZXJyb3JcIikpOih0aGlzLkRlbGV0ZUZyb21BRUwoYSksdGhpcy5EZWxldGVGcm9tQUVMKGwpKTooMDw9YS5PdXRJZHgmJnRoaXMuQWRkT3V0UHQoYSxhLlRvcCksdGhpcy5EZWxldGVGcm9tQUVMKGEpKX07ZC5DbGlwcGVyLnByb3RvdHlwZS5HZXROZXh0SW5BRUw9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYj09ZC5EaXJlY3Rpb24uZExlZnRUb1JpZ2h0P2EuTmV4dEluQUVMOmEuUHJldkluQUVMfTtkLkNsaXBwZXIucHJvdG90eXBlLklzTWluaW1hPWZ1bmN0aW9uKGEpe3JldHVybiBudWxsIT09YSYmYS5QcmV2Lk5leHRJbkxNTCE9YSYmYS5OZXh0Lk5leHRJbkxNTCE9XG5hfTtkLkNsaXBwZXIucHJvdG90eXBlLklzTWF4aW1hPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG51bGwhPT1hJiZhLlRvcC5ZPT1iJiZudWxsPT09YS5OZXh0SW5MTUx9O2QuQ2xpcHBlci5wcm90b3R5cGUuSXNJbnRlcm1lZGlhdGU9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5Ub3AuWT09YiYmbnVsbCE9PWEuTmV4dEluTE1MfTtkLkNsaXBwZXIucHJvdG90eXBlLkdldE1heGltYVBhaXI9ZnVuY3Rpb24oYSl7dmFyIGI9bnVsbDtkLkludFBvaW50Lm9wX0VxdWFsaXR5KGEuTmV4dC5Ub3AsYS5Ub3ApJiZudWxsPT09YS5OZXh0Lk5leHRJbkxNTD9iPWEuTmV4dDpkLkludFBvaW50Lm9wX0VxdWFsaXR5KGEuUHJldi5Ub3AsYS5Ub3ApJiZudWxsPT09YS5QcmV2Lk5leHRJbkxNTCYmKGI9YS5QcmV2KTtyZXR1cm4gbnVsbD09PWJ8fC0yIT1iLk91dElkeCYmKGIuTmV4dEluQUVMIT1iLlByZXZJbkFFTHx8ZC5DbGlwcGVyQmFzZS5Jc0hvcml6b250YWwoYikpP2I6bnVsbH07ZC5DbGlwcGVyLnByb3RvdHlwZS5Qcm9jZXNzSW50ZXJzZWN0aW9ucz1cbmZ1bmN0aW9uKGEsYil7aWYobnVsbD09dGhpcy5tX0FjdGl2ZUVkZ2VzKXJldHVybiEwO3RyeXt0aGlzLkJ1aWxkSW50ZXJzZWN0TGlzdChhLGIpO2lmKDA9PXRoaXMubV9JbnRlcnNlY3RMaXN0Lmxlbmd0aClyZXR1cm4hMDtpZigxPT10aGlzLm1fSW50ZXJzZWN0TGlzdC5sZW5ndGh8fHRoaXMuRml4dXBJbnRlcnNlY3Rpb25PcmRlcigpKXRoaXMuUHJvY2Vzc0ludGVyc2VjdExpc3QoKTtlbHNlIHJldHVybiExfWNhdGNoKGMpe3RoaXMubV9Tb3J0ZWRFZGdlcz1udWxsLHRoaXMubV9JbnRlcnNlY3RMaXN0Lmxlbmd0aD0wLGQuRXJyb3IoXCJQcm9jZXNzSW50ZXJzZWN0aW9ucyBlcnJvclwiKX10aGlzLm1fU29ydGVkRWRnZXM9bnVsbDtyZXR1cm4hMH07ZC5DbGlwcGVyLnByb3RvdHlwZS5CdWlsZEludGVyc2VjdExpc3Q9ZnVuY3Rpb24oYSxiKXtpZihudWxsIT09dGhpcy5tX0FjdGl2ZUVkZ2VzKXt2YXIgYz10aGlzLm1fQWN0aXZlRWRnZXM7Zm9yKHRoaXMubV9Tb3J0ZWRFZGdlcz1jO251bGwhPT1cbmM7KWMuUHJldkluU0VMPWMuUHJldkluQUVMLGMuTmV4dEluU0VMPWMuTmV4dEluQUVMLGMuQ3Vyci5YPWQuQ2xpcHBlci5Ub3BYKGMsYiksYz1jLk5leHRJbkFFTDtmb3IodmFyIGU9ITA7ZSYmbnVsbCE9PXRoaXMubV9Tb3J0ZWRFZGdlczspe2U9ITE7Zm9yKGM9dGhpcy5tX1NvcnRlZEVkZ2VzO251bGwhPT1jLk5leHRJblNFTDspe3ZhciBmPWMuTmV4dEluU0VMLGc9bmV3IGQuSW50UG9pbnQ7Yy5DdXJyLlg+Zi5DdXJyLlg/KCF0aGlzLkludGVyc2VjdFBvaW50KGMsZixnKSYmYy5DdXJyLlg+Zi5DdXJyLlgrMSYmZC5FcnJvcihcIkludGVyc2VjdGlvbiBlcnJvclwiKSxnLlk+YSYmKGcuWT1hLE1hdGguYWJzKGMuRHgpPk1hdGguYWJzKGYuRHgpP2cuWD1kLkNsaXBwZXIuVG9wWChmLGEpOmcuWD1kLkNsaXBwZXIuVG9wWChjLGEpKSxlPW5ldyBkLkludGVyc2VjdE5vZGUsZS5FZGdlMT1jLGUuRWRnZTI9ZixlLlB0Llg9Zy5YLGUuUHQuWT1nLlksdGhpcy5tX0ludGVyc2VjdExpc3QucHVzaChlKSxcbnRoaXMuU3dhcFBvc2l0aW9uc0luU0VMKGMsZiksZT0hMCk6Yz1mfWlmKG51bGwhPT1jLlByZXZJblNFTCljLlByZXZJblNFTC5OZXh0SW5TRUw9bnVsbDtlbHNlIGJyZWFrfXRoaXMubV9Tb3J0ZWRFZGdlcz1udWxsfX07ZC5DbGlwcGVyLnByb3RvdHlwZS5FZGdlc0FkamFjZW50PWZ1bmN0aW9uKGEpe3JldHVybiBhLkVkZ2UxLk5leHRJblNFTD09YS5FZGdlMnx8YS5FZGdlMS5QcmV2SW5TRUw9PWEuRWRnZTJ9O2QuQ2xpcHBlci5JbnRlcnNlY3ROb2RlU29ydD1mdW5jdGlvbihhLGIpe3JldHVybiBiLlB0LlktYS5QdC5ZfTtkLkNsaXBwZXIucHJvdG90eXBlLkZpeHVwSW50ZXJzZWN0aW9uT3JkZXI9ZnVuY3Rpb24oKXt0aGlzLm1fSW50ZXJzZWN0TGlzdC5zb3J0KHRoaXMubV9JbnRlcnNlY3ROb2RlQ29tcGFyZXIpO3RoaXMuQ29weUFFTFRvU0VMKCk7Zm9yKHZhciBhPXRoaXMubV9JbnRlcnNlY3RMaXN0Lmxlbmd0aCxiPTA7YjxhO2IrKyl7aWYoIXRoaXMuRWRnZXNBZGphY2VudCh0aGlzLm1fSW50ZXJzZWN0TGlzdFtiXSkpe2Zvcih2YXIgYz1cbmIrMTtjPGEmJiF0aGlzLkVkZ2VzQWRqYWNlbnQodGhpcy5tX0ludGVyc2VjdExpc3RbY10pOyljKys7aWYoYz09YSlyZXR1cm4hMTt2YXIgZT10aGlzLm1fSW50ZXJzZWN0TGlzdFtiXTt0aGlzLm1fSW50ZXJzZWN0TGlzdFtiXT10aGlzLm1fSW50ZXJzZWN0TGlzdFtjXTt0aGlzLm1fSW50ZXJzZWN0TGlzdFtjXT1lfXRoaXMuU3dhcFBvc2l0aW9uc0luU0VMKHRoaXMubV9JbnRlcnNlY3RMaXN0W2JdLkVkZ2UxLHRoaXMubV9JbnRlcnNlY3RMaXN0W2JdLkVkZ2UyKX1yZXR1cm4hMH07ZC5DbGlwcGVyLnByb3RvdHlwZS5Qcm9jZXNzSW50ZXJzZWN0TGlzdD1mdW5jdGlvbigpe2Zvcih2YXIgYT0wLGI9dGhpcy5tX0ludGVyc2VjdExpc3QubGVuZ3RoO2E8YjthKyspe3ZhciBjPXRoaXMubV9JbnRlcnNlY3RMaXN0W2FdO3RoaXMuSW50ZXJzZWN0RWRnZXMoYy5FZGdlMSxjLkVkZ2UyLGMuUHQsITApO3RoaXMuU3dhcFBvc2l0aW9uc0luQUVMKGMuRWRnZTEsYy5FZGdlMil9dGhpcy5tX0ludGVyc2VjdExpc3QubGVuZ3RoPVxuMH07RT1mdW5jdGlvbihhKXtyZXR1cm4gMD5hP01hdGguY2VpbChhLTAuNSk6TWF0aC5yb3VuZChhKX07Rj1mdW5jdGlvbihhKXtyZXR1cm4gMD5hP01hdGguY2VpbChhLTAuNSk6TWF0aC5mbG9vcihhKzAuNSl9O0c9ZnVuY3Rpb24oYSl7cmV0dXJuIDA+YT8tTWF0aC5yb3VuZChNYXRoLmFicyhhKSk6TWF0aC5yb3VuZChhKX07SD1mdW5jdGlvbihhKXtpZigwPmEpcmV0dXJuIGEtPTAuNSwtMjE0NzQ4MzY0OD5hP01hdGguY2VpbChhKTphfDA7YSs9MC41O3JldHVybiAyMTQ3NDgzNjQ3PGE/TWF0aC5mbG9vcihhKTphfDB9O2QuQ2xpcHBlci5Sb3VuZD1wP0U6RD9HOko/SDpGO2QuQ2xpcHBlci5Ub3BYPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGI9PWEuVG9wLlk/YS5Ub3AuWDphLkJvdC5YK2QuQ2xpcHBlci5Sb3VuZChhLkR4KihiLWEuQm90LlkpKX07ZC5DbGlwcGVyLnByb3RvdHlwZS5JbnRlcnNlY3RQb2ludD1mdW5jdGlvbihhLGIsYyl7Yy5YPTA7Yy5ZPTA7dmFyIGUsZjtpZihkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGEsXG5iLHRoaXMubV9Vc2VGdWxsUmFuZ2UpfHxhLkR4PT1iLkR4KXJldHVybiBiLkJvdC5ZPmEuQm90Llk/KGMuWD1iLkJvdC5YLGMuWT1iLkJvdC5ZKTooYy5YPWEuQm90LlgsYy5ZPWEuQm90LlkpLCExO2lmKDA9PT1hLkRlbHRhLlgpYy5YPWEuQm90LlgsZC5DbGlwcGVyQmFzZS5Jc0hvcml6b250YWwoYik/Yy5ZPWIuQm90Llk6KGY9Yi5Cb3QuWS1iLkJvdC5YL2IuRHgsYy5ZPWQuQ2xpcHBlci5Sb3VuZChjLlgvYi5EeCtmKSk7ZWxzZSBpZigwPT09Yi5EZWx0YS5YKWMuWD1iLkJvdC5YLGQuQ2xpcHBlckJhc2UuSXNIb3Jpem9udGFsKGEpP2MuWT1hLkJvdC5ZOihlPWEuQm90LlktYS5Cb3QuWC9hLkR4LGMuWT1kLkNsaXBwZXIuUm91bmQoYy5YL2EuRHgrZSkpO2Vsc2V7ZT1hLkJvdC5YLWEuQm90LlkqYS5EeDtmPWIuQm90LlgtYi5Cb3QuWSpiLkR4O3ZhciBnPShmLWUpLyhhLkR4LWIuRHgpO2MuWT1kLkNsaXBwZXIuUm91bmQoZyk7TWF0aC5hYnMoYS5EeCk8TWF0aC5hYnMoYi5EeCk/XG5jLlg9ZC5DbGlwcGVyLlJvdW5kKGEuRHgqZytlKTpjLlg9ZC5DbGlwcGVyLlJvdW5kKGIuRHgqZytmKX1pZihjLlk8YS5Ub3AuWXx8Yy5ZPGIuVG9wLlkpe2lmKGEuVG9wLlk+Yi5Ub3AuWSlyZXR1cm4gYy5ZPWEuVG9wLlksYy5YPWQuQ2xpcHBlci5Ub3BYKGIsYS5Ub3AuWSksYy5YPGEuVG9wLlg7Yy5ZPWIuVG9wLlk7TWF0aC5hYnMoYS5EeCk8TWF0aC5hYnMoYi5EeCk/Yy5YPWQuQ2xpcHBlci5Ub3BYKGEsYy5ZKTpjLlg9ZC5DbGlwcGVyLlRvcFgoYixjLlkpfXJldHVybiEwfTtkLkNsaXBwZXIucHJvdG90eXBlLlByb2Nlc3NFZGdlc0F0VG9wT2ZTY2FuYmVhbT1mdW5jdGlvbihhKXtmb3IodmFyIGI9dGhpcy5tX0FjdGl2ZUVkZ2VzO251bGwhPT1iOyl7dmFyIGM9dGhpcy5Jc01heGltYShiLGEpO2MmJihjPXRoaXMuR2V0TWF4aW1hUGFpcihiKSxjPW51bGw9PT1jfHwhZC5DbGlwcGVyQmFzZS5Jc0hvcml6b250YWwoYykpO2lmKGMpe3ZhciBlPWIuUHJldkluQUVMO3RoaXMuRG9NYXhpbWEoYik7XG5iPW51bGw9PT1lP3RoaXMubV9BY3RpdmVFZGdlczplLk5leHRJbkFFTH1lbHNlIHRoaXMuSXNJbnRlcm1lZGlhdGUoYixhKSYmZC5DbGlwcGVyQmFzZS5Jc0hvcml6b250YWwoYi5OZXh0SW5MTUwpPyhiPXRoaXMuVXBkYXRlRWRnZUludG9BRUwoYiksMDw9Yi5PdXRJZHgmJnRoaXMuQWRkT3V0UHQoYixiLkJvdCksdGhpcy5BZGRFZGdlVG9TRUwoYikpOihiLkN1cnIuWD1kLkNsaXBwZXIuVG9wWChiLGEpLGIuQ3Vyci5ZPWEpLHRoaXMuU3RyaWN0bHlTaW1wbGUmJihlPWIuUHJldkluQUVMLDA8PWIuT3V0SWR4JiYwIT09Yi5XaW5kRGVsdGEmJm51bGwhPT1lJiYwPD1lLk91dElkeCYmZS5DdXJyLlg9PWIuQ3Vyci5YJiYwIT09ZS5XaW5kRGVsdGEmJihjPXRoaXMuQWRkT3V0UHQoZSxiLkN1cnIpLGU9dGhpcy5BZGRPdXRQdChiLGIuQ3VyciksdGhpcy5BZGRKb2luKGMsZSxiLkN1cnIpKSksYj1iLk5leHRJbkFFTH10aGlzLlByb2Nlc3NIb3Jpem9udGFscyghMCk7Zm9yKGI9dGhpcy5tX0FjdGl2ZUVkZ2VzO251bGwhPT1cbmI7KXtpZih0aGlzLklzSW50ZXJtZWRpYXRlKGIsYSkpe2M9bnVsbDswPD1iLk91dElkeCYmKGM9dGhpcy5BZGRPdXRQdChiLGIuVG9wKSk7dmFyIGI9dGhpcy5VcGRhdGVFZGdlSW50b0FFTChiKSxlPWIuUHJldkluQUVMLGY9Yi5OZXh0SW5BRUw7bnVsbCE9PWUmJmUuQ3Vyci5YPT1iLkJvdC5YJiZlLkN1cnIuWT09Yi5Cb3QuWSYmbnVsbCE9PWMmJjA8PWUuT3V0SWR4JiZlLkN1cnIuWT5lLlRvcC5ZJiZkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGIsZSx0aGlzLm1fVXNlRnVsbFJhbmdlKSYmMCE9PWIuV2luZERlbHRhJiYwIT09ZS5XaW5kRGVsdGE/KGU9dGhpcy5BZGRPdXRQdChlLGIuQm90KSx0aGlzLkFkZEpvaW4oYyxlLGIuVG9wKSk6bnVsbCE9PWYmJmYuQ3Vyci5YPT1iLkJvdC5YJiZmLkN1cnIuWT09Yi5Cb3QuWSYmbnVsbCE9PWMmJjA8PWYuT3V0SWR4JiZmLkN1cnIuWT5mLlRvcC5ZJiZkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGIsZix0aGlzLm1fVXNlRnVsbFJhbmdlKSYmXG4wIT09Yi5XaW5kRGVsdGEmJjAhPT1mLldpbmREZWx0YSYmKGU9dGhpcy5BZGRPdXRQdChmLGIuQm90KSx0aGlzLkFkZEpvaW4oYyxlLGIuVG9wKSl9Yj1iLk5leHRJbkFFTH19O2QuQ2xpcHBlci5wcm90b3R5cGUuRG9NYXhpbWE9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5HZXRNYXhpbWFQYWlyKGEpO2lmKG51bGw9PT1iKTA8PWEuT3V0SWR4JiZ0aGlzLkFkZE91dFB0KGEsYS5Ub3ApLHRoaXMuRGVsZXRlRnJvbUFFTChhKTtlbHNle2Zvcih2YXIgYz1hLk5leHRJbkFFTDtudWxsIT09YyYmYyE9YjspdGhpcy5JbnRlcnNlY3RFZGdlcyhhLGMsYS5Ub3AsITApLHRoaXMuU3dhcFBvc2l0aW9uc0luQUVMKGEsYyksYz1hLk5leHRJbkFFTDstMT09YS5PdXRJZHgmJi0xPT1iLk91dElkeD8odGhpcy5EZWxldGVGcm9tQUVMKGEpLHRoaXMuRGVsZXRlRnJvbUFFTChiKSk6MDw9YS5PdXRJZHgmJjA8PWIuT3V0SWR4P3RoaXMuSW50ZXJzZWN0RWRnZXMoYSxiLGEuVG9wLCExKTowPT09YS5XaW5kRGVsdGE/XG4oMDw9YS5PdXRJZHgmJih0aGlzLkFkZE91dFB0KGEsYS5Ub3ApLGEuT3V0SWR4PS0xKSx0aGlzLkRlbGV0ZUZyb21BRUwoYSksMDw9Yi5PdXRJZHgmJih0aGlzLkFkZE91dFB0KGIsYS5Ub3ApLGIuT3V0SWR4PS0xKSx0aGlzLkRlbGV0ZUZyb21BRUwoYikpOmQuRXJyb3IoXCJEb01heGltYSBlcnJvclwiKX19O2QuQ2xpcHBlci5SZXZlcnNlUGF0aHM9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPTAsYz1hLmxlbmd0aDtiPGM7YisrKWFbYl0ucmV2ZXJzZSgpfTtkLkNsaXBwZXIuT3JpZW50YXRpb249ZnVuY3Rpb24oYSl7cmV0dXJuIDA8PWQuQ2xpcHBlci5BcmVhKGEpfTtkLkNsaXBwZXIucHJvdG90eXBlLlBvaW50Q291bnQ9ZnVuY3Rpb24oYSl7aWYobnVsbD09PWEpcmV0dXJuIDA7dmFyIGI9MCxjPWE7ZG8gYisrLGM9Yy5OZXh0O3doaWxlKGMhPWEpO3JldHVybiBifTtkLkNsaXBwZXIucHJvdG90eXBlLkJ1aWxkUmVzdWx0PWZ1bmN0aW9uKGEpe2QuQ2xlYXIoYSk7Zm9yKHZhciBiPTAsYz1cbnRoaXMubV9Qb2x5T3V0cy5sZW5ndGg7YjxjO2IrKyl7dmFyIGU9dGhpcy5tX1BvbHlPdXRzW2JdO2lmKG51bGwhPT1lLlB0cyl7dmFyIGU9ZS5QdHMuUHJldixmPXRoaXMuUG9pbnRDb3VudChlKTtpZighKDI+Zikpe2Zvcih2YXIgZz1BcnJheShmKSxoPTA7aDxmO2grKylnW2hdPWUuUHQsZT1lLlByZXY7YS5wdXNoKGcpfX19fTtkLkNsaXBwZXIucHJvdG90eXBlLkJ1aWxkUmVzdWx0Mj1mdW5jdGlvbihhKXthLkNsZWFyKCk7Zm9yKHZhciBiPTAsYz10aGlzLm1fUG9seU91dHMubGVuZ3RoO2I8YztiKyspe3ZhciBlPXRoaXMubV9Qb2x5T3V0c1tiXSxmPXRoaXMuUG9pbnRDb3VudChlLlB0cyk7aWYoIShlLklzT3BlbiYmMj5mfHwhZS5Jc09wZW4mJjM+Zikpe3RoaXMuRml4SG9sZUxpbmthZ2UoZSk7dmFyIGc9bmV3IGQuUG9seU5vZGU7YS5tX0FsbFBvbHlzLnB1c2goZyk7ZS5Qb2x5Tm9kZT1nO2cubV9wb2x5Z29uLmxlbmd0aD1mO2Zvcih2YXIgZT1lLlB0cy5QcmV2LGg9MDtoPFxuZjtoKyspZy5tX3BvbHlnb25baF09ZS5QdCxlPWUuUHJldn19Yj0wO2ZvcihjPXRoaXMubV9Qb2x5T3V0cy5sZW5ndGg7YjxjO2IrKyllPXRoaXMubV9Qb2x5T3V0c1tiXSxudWxsIT09ZS5Qb2x5Tm9kZSYmKGUuSXNPcGVuPyhlLlBvbHlOb2RlLklzT3Blbj0hMCxhLkFkZENoaWxkKGUuUG9seU5vZGUpKTpudWxsIT09ZS5GaXJzdExlZnQmJm51bGwhPWUuRmlyc3RMZWZ0LlBvbHlOb2RlP2UuRmlyc3RMZWZ0LlBvbHlOb2RlLkFkZENoaWxkKGUuUG9seU5vZGUpOmEuQWRkQ2hpbGQoZS5Qb2x5Tm9kZSkpfTtkLkNsaXBwZXIucHJvdG90eXBlLkZpeHVwT3V0UG9seWdvbj1mdW5jdGlvbihhKXt2YXIgYj1udWxsO2EuQm90dG9tUHQ9bnVsbDtmb3IodmFyIGM9YS5QdHM7Oyl7aWYoYy5QcmV2PT1jfHxjLlByZXY9PWMuTmV4dCl7dGhpcy5EaXNwb3NlT3V0UHRzKGMpO2EuUHRzPW51bGw7cmV0dXJufWlmKGQuSW50UG9pbnQub3BfRXF1YWxpdHkoYy5QdCxjLk5leHQuUHQpfHxkLkludFBvaW50Lm9wX0VxdWFsaXR5KGMuUHQsXG5jLlByZXYuUHQpfHxkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGMuUHJldi5QdCxjLlB0LGMuTmV4dC5QdCx0aGlzLm1fVXNlRnVsbFJhbmdlKSYmKCF0aGlzLlByZXNlcnZlQ29sbGluZWFyfHwhdGhpcy5QdDJJc0JldHdlZW5QdDFBbmRQdDMoYy5QcmV2LlB0LGMuUHQsYy5OZXh0LlB0KSkpYj1udWxsLGMuUHJldi5OZXh0PWMuTmV4dCxjPWMuTmV4dC5QcmV2PWMuUHJldjtlbHNlIGlmKGM9PWIpYnJlYWs7ZWxzZSBudWxsPT09YiYmKGI9YyksYz1jLk5leHR9YS5QdHM9Y307ZC5DbGlwcGVyLnByb3RvdHlwZS5EdXBPdXRQdD1mdW5jdGlvbihhLGIpe3ZhciBjPW5ldyBkLk91dFB0O2MuUHQuWD1hLlB0Llg7Yy5QdC5ZPWEuUHQuWTtjLklkeD1hLklkeDtiPyhjLk5leHQ9YS5OZXh0LGMuUHJldj1hLGEuTmV4dC5QcmV2PWMsYS5OZXh0PWMpOihjLlByZXY9YS5QcmV2LGMuTmV4dD1hLGEuUHJldi5OZXh0PWMsYS5QcmV2PWMpO3JldHVybiBjfTtkLkNsaXBwZXIucHJvdG90eXBlLkdldE92ZXJsYXA9XG5mdW5jdGlvbihhLGIsYyxlLGQpe2E8Yj9jPGU/KGQuTGVmdD1NYXRoLm1heChhLGMpLGQuUmlnaHQ9TWF0aC5taW4oYixlKSk6KGQuTGVmdD1NYXRoLm1heChhLGUpLGQuUmlnaHQ9TWF0aC5taW4oYixjKSk6YzxlPyhkLkxlZnQ9TWF0aC5tYXgoYixjKSxkLlJpZ2h0PU1hdGgubWluKGEsZSkpOihkLkxlZnQ9TWF0aC5tYXgoYixlKSxkLlJpZ2h0PU1hdGgubWluKGEsYykpO3JldHVybiBkLkxlZnQ8ZC5SaWdodH07ZC5DbGlwcGVyLnByb3RvdHlwZS5Kb2luSG9yej1mdW5jdGlvbihhLGIsYyxlLGYsZyl7dmFyIGg9YS5QdC5YPmIuUHQuWD9kLkRpcmVjdGlvbi5kUmlnaHRUb0xlZnQ6ZC5EaXJlY3Rpb24uZExlZnRUb1JpZ2h0O2U9Yy5QdC5YPmUuUHQuWD9kLkRpcmVjdGlvbi5kUmlnaHRUb0xlZnQ6ZC5EaXJlY3Rpb24uZExlZnRUb1JpZ2h0O2lmKGg9PWUpcmV0dXJuITE7aWYoaD09ZC5EaXJlY3Rpb24uZExlZnRUb1JpZ2h0KXtmb3IoO2EuTmV4dC5QdC5YPD1mLlgmJmEuTmV4dC5QdC5YPj1cbmEuUHQuWCYmYS5OZXh0LlB0Llk9PWYuWTspYT1hLk5leHQ7ZyYmYS5QdC5YIT1mLlgmJihhPWEuTmV4dCk7Yj10aGlzLkR1cE91dFB0KGEsIWcpO2QuSW50UG9pbnQub3BfSW5lcXVhbGl0eShiLlB0LGYpJiYoYT1iLGEuUHQuWD1mLlgsYS5QdC5ZPWYuWSxiPXRoaXMuRHVwT3V0UHQoYSwhZykpfWVsc2V7Zm9yKDthLk5leHQuUHQuWD49Zi5YJiZhLk5leHQuUHQuWDw9YS5QdC5YJiZhLk5leHQuUHQuWT09Zi5ZOylhPWEuTmV4dDtnfHxhLlB0Llg9PWYuWHx8KGE9YS5OZXh0KTtiPXRoaXMuRHVwT3V0UHQoYSxnKTtkLkludFBvaW50Lm9wX0luZXF1YWxpdHkoYi5QdCxmKSYmKGE9YixhLlB0Llg9Zi5YLGEuUHQuWT1mLlksYj10aGlzLkR1cE91dFB0KGEsZykpfWlmKGU9PWQuRGlyZWN0aW9uLmRMZWZ0VG9SaWdodCl7Zm9yKDtjLk5leHQuUHQuWDw9Zi5YJiZjLk5leHQuUHQuWD49Yy5QdC5YJiZjLk5leHQuUHQuWT09Zi5ZOyljPWMuTmV4dDtnJiZjLlB0LlghPWYuWCYmKGM9Yy5OZXh0KTtcbmU9dGhpcy5EdXBPdXRQdChjLCFnKTtkLkludFBvaW50Lm9wX0luZXF1YWxpdHkoZS5QdCxmKSYmKGM9ZSxjLlB0Llg9Zi5YLGMuUHQuWT1mLlksZT10aGlzLkR1cE91dFB0KGMsIWcpKX1lbHNle2Zvcig7Yy5OZXh0LlB0Llg+PWYuWCYmYy5OZXh0LlB0Llg8PWMuUHQuWCYmYy5OZXh0LlB0Llk9PWYuWTspYz1jLk5leHQ7Z3x8Yy5QdC5YPT1mLlh8fChjPWMuTmV4dCk7ZT10aGlzLkR1cE91dFB0KGMsZyk7ZC5JbnRQb2ludC5vcF9JbmVxdWFsaXR5KGUuUHQsZikmJihjPWUsYy5QdC5YPWYuWCxjLlB0Llk9Zi5ZLGU9dGhpcy5EdXBPdXRQdChjLGcpKX1oPT1kLkRpcmVjdGlvbi5kTGVmdFRvUmlnaHQ9PWc/KGEuUHJldj1jLGMuTmV4dD1hLGIuTmV4dD1lLGUuUHJldj1iKTooYS5OZXh0PWMsYy5QcmV2PWEsYi5QcmV2PWUsZS5OZXh0PWIpO3JldHVybiEwfTtkLkNsaXBwZXIucHJvdG90eXBlLkpvaW5Qb2ludHM9ZnVuY3Rpb24oYSxiLGMpe3ZhciBlPWEuT3V0UHQxLGY9bmV3IGQuT3V0UHQsXG5nPWEuT3V0UHQyLGg9bmV3IGQuT3V0UHQ7aWYoKGg9YS5PdXRQdDEuUHQuWT09YS5PZmZQdC5ZKSYmZC5JbnRQb2ludC5vcF9FcXVhbGl0eShhLk9mZlB0LGEuT3V0UHQxLlB0KSYmZC5JbnRQb2ludC5vcF9FcXVhbGl0eShhLk9mZlB0LGEuT3V0UHQyLlB0KSl7Zm9yKGY9YS5PdXRQdDEuTmV4dDtmIT1lJiZkLkludFBvaW50Lm9wX0VxdWFsaXR5KGYuUHQsYS5PZmZQdCk7KWY9Zi5OZXh0O2Y9Zi5QdC5ZPmEuT2ZmUHQuWTtmb3IoaD1hLk91dFB0Mi5OZXh0O2ghPWcmJmQuSW50UG9pbnQub3BfRXF1YWxpdHkoaC5QdCxhLk9mZlB0KTspaD1oLk5leHQ7aWYoZj09aC5QdC5ZPmEuT2ZmUHQuWSlyZXR1cm4hMTtmPyhmPXRoaXMuRHVwT3V0UHQoZSwhMSksaD10aGlzLkR1cE91dFB0KGcsITApLGUuUHJldj1nLGcuTmV4dD1lLGYuTmV4dD1oLGguUHJldj1mKTooZj10aGlzLkR1cE91dFB0KGUsITApLGg9dGhpcy5EdXBPdXRQdChnLCExKSxlLk5leHQ9ZyxnLlByZXY9ZSxmLlByZXY9aCxcbmguTmV4dD1mKTthLk91dFB0MT1lO2EuT3V0UHQyPWY7cmV0dXJuITB9aWYoaCl7Zm9yKGY9ZTtlLlByZXYuUHQuWT09ZS5QdC5ZJiZlLlByZXYhPWYmJmUuUHJldiE9ZzspZT1lLlByZXY7Zm9yKDtmLk5leHQuUHQuWT09Zi5QdC5ZJiZmLk5leHQhPWUmJmYuTmV4dCE9ZzspZj1mLk5leHQ7aWYoZi5OZXh0PT1lfHxmLk5leHQ9PWcpcmV0dXJuITE7Zm9yKGg9ZztnLlByZXYuUHQuWT09Zy5QdC5ZJiZnLlByZXYhPWgmJmcuUHJldiE9ZjspZz1nLlByZXY7Zm9yKDtoLk5leHQuUHQuWT09aC5QdC5ZJiZoLk5leHQhPWcmJmguTmV4dCE9ZTspaD1oLk5leHQ7aWYoaC5OZXh0PT1nfHxoLk5leHQ9PWUpcmV0dXJuITE7Yz17TGVmdDpudWxsLFJpZ2h0Om51bGx9O2lmKCF0aGlzLkdldE92ZXJsYXAoZS5QdC5YLGYuUHQuWCxnLlB0LlgsaC5QdC5YLGMpKXJldHVybiExO2I9Yy5MZWZ0O3ZhciBsPWMuUmlnaHQ7Yz1uZXcgZC5JbnRQb2ludDtlLlB0Llg+PWImJmUuUHQuWDw9bD8oYy5YPWUuUHQuWCxcbmMuWT1lLlB0LlksYj1lLlB0Llg+Zi5QdC5YKTpnLlB0Llg+PWImJmcuUHQuWDw9bD8oYy5YPWcuUHQuWCxjLlk9Zy5QdC5ZLGI9Zy5QdC5YPmguUHQuWCk6Zi5QdC5YPj1iJiZmLlB0Llg8PWw/KGMuWD1mLlB0LlgsYy5ZPWYuUHQuWSxiPWYuUHQuWD5lLlB0LlgpOihjLlg9aC5QdC5YLGMuWT1oLlB0LlksYj1oLlB0Llg+Zy5QdC5YKTthLk91dFB0MT1lO2EuT3V0UHQyPWc7cmV0dXJuIHRoaXMuSm9pbkhvcnooZSxmLGcsaCxjLGIpfWZvcihmPWUuTmV4dDtkLkludFBvaW50Lm9wX0VxdWFsaXR5KGYuUHQsZS5QdCkmJmYhPWU7KWY9Zi5OZXh0O2lmKGw9Zi5QdC5ZPmUuUHQuWXx8IWQuQ2xpcHBlckJhc2UuU2xvcGVzRXF1YWwoZS5QdCxmLlB0LGEuT2ZmUHQsdGhpcy5tX1VzZUZ1bGxSYW5nZSkpe2ZvcihmPWUuUHJldjtkLkludFBvaW50Lm9wX0VxdWFsaXR5KGYuUHQsZS5QdCkmJmYhPWU7KWY9Zi5QcmV2O2lmKGYuUHQuWT5lLlB0Lll8fCFkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGUuUHQsXG5mLlB0LGEuT2ZmUHQsdGhpcy5tX1VzZUZ1bGxSYW5nZSkpcmV0dXJuITF9Zm9yKGg9Zy5OZXh0O2QuSW50UG9pbnQub3BfRXF1YWxpdHkoaC5QdCxnLlB0KSYmaCE9ZzspaD1oLk5leHQ7dmFyIGs9aC5QdC5ZPmcuUHQuWXx8IWQuQ2xpcHBlckJhc2UuU2xvcGVzRXF1YWwoZy5QdCxoLlB0LGEuT2ZmUHQsdGhpcy5tX1VzZUZ1bGxSYW5nZSk7aWYoayl7Zm9yKGg9Zy5QcmV2O2QuSW50UG9pbnQub3BfRXF1YWxpdHkoaC5QdCxnLlB0KSYmaCE9ZzspaD1oLlByZXY7aWYoaC5QdC5ZPmcuUHQuWXx8IWQuQ2xpcHBlckJhc2UuU2xvcGVzRXF1YWwoZy5QdCxoLlB0LGEuT2ZmUHQsdGhpcy5tX1VzZUZ1bGxSYW5nZSkpcmV0dXJuITF9aWYoZj09ZXx8aD09Z3x8Zj09aHx8Yj09YyYmbD09aylyZXR1cm4hMTtsPyhmPXRoaXMuRHVwT3V0UHQoZSwhMSksaD10aGlzLkR1cE91dFB0KGcsITApLGUuUHJldj1nLGcuTmV4dD1lLGYuTmV4dD1oLGguUHJldj1mKTooZj10aGlzLkR1cE91dFB0KGUsITApLFxuaD10aGlzLkR1cE91dFB0KGcsITEpLGUuTmV4dD1nLGcuUHJldj1lLGYuUHJldj1oLGguTmV4dD1mKTthLk91dFB0MT1lO2EuT3V0UHQyPWY7cmV0dXJuITB9O2QuQ2xpcHBlci5HZXRCb3VuZHM9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPTAsYz1hLmxlbmd0aDtiPGMmJjA9PWFbYl0ubGVuZ3RoOyliKys7aWYoYj09YylyZXR1cm4gbmV3IGQuSW50UmVjdCgwLDAsMCwwKTt2YXIgZT1uZXcgZC5JbnRSZWN0O2UubGVmdD1hW2JdWzBdLlg7ZS5yaWdodD1lLmxlZnQ7ZS50b3A9YVtiXVswXS5ZO2ZvcihlLmJvdHRvbT1lLnRvcDtiPGM7YisrKWZvcih2YXIgZj0wLGc9YVtiXS5sZW5ndGg7ZjxnO2YrKylhW2JdW2ZdLlg8ZS5sZWZ0P2UubGVmdD1hW2JdW2ZdLlg6YVtiXVtmXS5YPmUucmlnaHQmJihlLnJpZ2h0PWFbYl1bZl0uWCksYVtiXVtmXS5ZPGUudG9wP2UudG9wPWFbYl1bZl0uWTphW2JdW2ZdLlk+ZS5ib3R0b20mJihlLmJvdHRvbT1hW2JdW2ZdLlkpO3JldHVybiBlfTtkLkNsaXBwZXIucHJvdG90eXBlLkdldEJvdW5kczI9XG5mdW5jdGlvbihhKXt2YXIgYj1hLGM9bmV3IGQuSW50UmVjdDtjLmxlZnQ9YS5QdC5YO2MucmlnaHQ9YS5QdC5YO2MudG9wPWEuUHQuWTtjLmJvdHRvbT1hLlB0Llk7Zm9yKGE9YS5OZXh0O2EhPWI7KWEuUHQuWDxjLmxlZnQmJihjLmxlZnQ9YS5QdC5YKSxhLlB0Llg+Yy5yaWdodCYmKGMucmlnaHQ9YS5QdC5YKSxhLlB0Llk8Yy50b3AmJihjLnRvcD1hLlB0LlkpLGEuUHQuWT5jLmJvdHRvbSYmKGMuYm90dG9tPWEuUHQuWSksYT1hLk5leHQ7cmV0dXJuIGN9O2QuQ2xpcHBlci5Qb2ludEluUG9seWdvbj1mdW5jdGlvbihhLGIpe3ZhciBjPTAsZT1iLmxlbmd0aDtpZigzPmUpcmV0dXJuIDA7Zm9yKHZhciBkPWJbMF0sZz0xO2c8PWU7KytnKXt2YXIgaD1nPT1lP2JbMF06YltnXTtpZihoLlk9PWEuWSYmKGguWD09YS5YfHxkLlk9PWEuWSYmaC5YPmEuWD09ZC5YPGEuWCkpcmV0dXJuLTE7aWYoZC5ZPGEuWSE9aC5ZPGEuWSlpZihkLlg+PWEuWClpZihoLlg+YS5YKWM9MS1jO2Vsc2V7dmFyIGw9XG4oZC5YLWEuWCkqKGguWS1hLlkpLShoLlgtYS5YKSooZC5ZLWEuWSk7aWYoMD09bClyZXR1cm4tMTswPGw9PWguWT5kLlkmJihjPTEtYyl9ZWxzZSBpZihoLlg+YS5YKXtsPShkLlgtYS5YKSooaC5ZLWEuWSktKGguWC1hLlgpKihkLlktYS5ZKTtpZigwPT1sKXJldHVybi0xOzA8bD09aC5ZPmQuWSYmKGM9MS1jKX1kPWh9cmV0dXJuIGN9O2QuQ2xpcHBlci5wcm90b3R5cGUuUG9pbnRJblBvbHlnb249ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9MCxlPWI7Oyl7dmFyIGQ9Yi5QdC5YLGc9Yi5QdC5ZLGg9Yi5OZXh0LlB0LlgsbD1iLk5leHQuUHQuWTtpZihsPT1hLlkmJihoPT1hLlh8fGc9PWEuWSYmaD5hLlg9PWQ8YS5YKSlyZXR1cm4tMTtpZihnPGEuWSE9bDxhLlkpaWYoZD49YS5YKWlmKGg+YS5YKWM9MS1jO2Vsc2V7ZD0oZC1hLlgpKihsLWEuWSktKGgtYS5YKSooZy1hLlkpO2lmKDA9PWQpcmV0dXJuLTE7MDxkPT1sPmcmJihjPTEtYyl9ZWxzZSBpZihoPmEuWCl7ZD0oZC1hLlgpKihsLVxuYS5ZKS0oaC1hLlgpKihnLWEuWSk7aWYoMD09ZClyZXR1cm4tMTswPGQ9PWw+ZyYmKGM9MS1jKX1iPWIuTmV4dDtpZihlPT1iKWJyZWFrfXJldHVybiBjfTtkLkNsaXBwZXIucHJvdG90eXBlLlBvbHkyQ29udGFpbnNQb2x5MT1mdW5jdGlvbihhLGIpe3ZhciBjPWE7ZG97dmFyIGU9dGhpcy5Qb2ludEluUG9seWdvbihjLlB0LGIpO2lmKDA8PWUpcmV0dXJuIDAhPWU7Yz1jLk5leHR9d2hpbGUoYyE9YSk7cmV0dXJuITB9O2QuQ2xpcHBlci5wcm90b3R5cGUuRml4dXBGaXJzdExlZnRzMT1mdW5jdGlvbihhLGIpe2Zvcih2YXIgYz0wLGU9dGhpcy5tX1BvbHlPdXRzLmxlbmd0aDtjPGU7YysrKXt2YXIgZD10aGlzLm1fUG9seU91dHNbY107bnVsbCE9PWQuUHRzJiZkLkZpcnN0TGVmdD09YSYmdGhpcy5Qb2x5MkNvbnRhaW5zUG9seTEoZC5QdHMsYi5QdHMpJiYoZC5GaXJzdExlZnQ9Yil9fTtkLkNsaXBwZXIucHJvdG90eXBlLkZpeHVwRmlyc3RMZWZ0czI9ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9XG4wLGU9dGhpcy5tX1BvbHlPdXRzLGQ9ZS5sZW5ndGgsZz1lW2NdO2M8ZDtjKyssZz1lW2NdKWcuRmlyc3RMZWZ0PT1hJiYoZy5GaXJzdExlZnQ9Yil9O2QuQ2xpcHBlci5QYXJzZUZpcnN0TGVmdD1mdW5jdGlvbihhKXtmb3IoO251bGwhPWEmJm51bGw9PWEuUHRzOylhPWEuRmlyc3RMZWZ0O3JldHVybiBhfTtkLkNsaXBwZXIucHJvdG90eXBlLkpvaW5Db21tb25FZGdlcz1mdW5jdGlvbigpe2Zvcih2YXIgYT0wLGI9dGhpcy5tX0pvaW5zLmxlbmd0aDthPGI7YSsrKXt2YXIgYz10aGlzLm1fSm9pbnNbYV0sZT10aGlzLkdldE91dFJlYyhjLk91dFB0MS5JZHgpLGY9dGhpcy5HZXRPdXRSZWMoYy5PdXRQdDIuSWR4KTtpZihudWxsIT1lLlB0cyYmbnVsbCE9Zi5QdHMpe3ZhciBnO2c9ZT09Zj9lOnRoaXMuUGFyYW0xUmlnaHRPZlBhcmFtMihlLGYpP2Y6dGhpcy5QYXJhbTFSaWdodE9mUGFyYW0yKGYsZSk/ZTp0aGlzLkdldExvd2VybW9zdFJlYyhlLGYpO2lmKHRoaXMuSm9pblBvaW50cyhjLFxuZSxmKSlpZihlPT1mKXtlLlB0cz1jLk91dFB0MTtlLkJvdHRvbVB0PW51bGw7Zj10aGlzLkNyZWF0ZU91dFJlYygpO2YuUHRzPWMuT3V0UHQyO3RoaXMuVXBkYXRlT3V0UHRJZHhzKGYpO2lmKHRoaXMubV9Vc2luZ1BvbHlUcmVlKXtnPTA7Zm9yKHZhciBoPXRoaXMubV9Qb2x5T3V0cy5sZW5ndGg7ZzxoLTE7ZysrKXt2YXIgbD10aGlzLm1fUG9seU91dHNbZ107bnVsbCE9bC5QdHMmJmQuQ2xpcHBlci5QYXJzZUZpcnN0TGVmdChsLkZpcnN0TGVmdCk9PWUmJmwuSXNIb2xlIT1lLklzSG9sZSYmdGhpcy5Qb2x5MkNvbnRhaW5zUG9seTEobC5QdHMsYy5PdXRQdDIpJiYobC5GaXJzdExlZnQ9Zil9fXRoaXMuUG9seTJDb250YWluc1BvbHkxKGYuUHRzLGUuUHRzKT8oZi5Jc0hvbGU9IWUuSXNIb2xlLGYuRmlyc3RMZWZ0PWUsdGhpcy5tX1VzaW5nUG9seVRyZWUmJnRoaXMuRml4dXBGaXJzdExlZnRzMihmLGUpLChmLklzSG9sZV50aGlzLlJldmVyc2VTb2x1dGlvbik9PTA8dGhpcy5BcmVhKGYpJiZcbnRoaXMuUmV2ZXJzZVBvbHlQdExpbmtzKGYuUHRzKSk6dGhpcy5Qb2x5MkNvbnRhaW5zUG9seTEoZS5QdHMsZi5QdHMpPyhmLklzSG9sZT1lLklzSG9sZSxlLklzSG9sZT0hZi5Jc0hvbGUsZi5GaXJzdExlZnQ9ZS5GaXJzdExlZnQsZS5GaXJzdExlZnQ9Zix0aGlzLm1fVXNpbmdQb2x5VHJlZSYmdGhpcy5GaXh1cEZpcnN0TGVmdHMyKGUsZiksKGUuSXNIb2xlXnRoaXMuUmV2ZXJzZVNvbHV0aW9uKT09MDx0aGlzLkFyZWEoZSkmJnRoaXMuUmV2ZXJzZVBvbHlQdExpbmtzKGUuUHRzKSk6KGYuSXNIb2xlPWUuSXNIb2xlLGYuRmlyc3RMZWZ0PWUuRmlyc3RMZWZ0LHRoaXMubV9Vc2luZ1BvbHlUcmVlJiZ0aGlzLkZpeHVwRmlyc3RMZWZ0czEoZSxmKSl9ZWxzZSBmLlB0cz1udWxsLGYuQm90dG9tUHQ9bnVsbCxmLklkeD1lLklkeCxlLklzSG9sZT1nLklzSG9sZSxnPT1mJiYoZS5GaXJzdExlZnQ9Zi5GaXJzdExlZnQpLGYuRmlyc3RMZWZ0PWUsdGhpcy5tX1VzaW5nUG9seVRyZWUmJnRoaXMuRml4dXBGaXJzdExlZnRzMihmLFxuZSl9fX07ZC5DbGlwcGVyLnByb3RvdHlwZS5VcGRhdGVPdXRQdElkeHM9ZnVuY3Rpb24oYSl7dmFyIGI9YS5QdHM7ZG8gYi5JZHg9YS5JZHgsYj1iLlByZXY7d2hpbGUoYiE9YS5QdHMpfTtkLkNsaXBwZXIucHJvdG90eXBlLkRvU2ltcGxlUG9seWdvbnM9ZnVuY3Rpb24oKXtmb3IodmFyIGE9MDthPHRoaXMubV9Qb2x5T3V0cy5sZW5ndGg7KXt2YXIgYj10aGlzLm1fUG9seU91dHNbYSsrXSxjPWIuUHRzO2lmKG51bGwhPT1jKXtkb3tmb3IodmFyIGU9Yy5OZXh0O2UhPWIuUHRzOyl7aWYoZC5JbnRQb2ludC5vcF9FcXVhbGl0eShjLlB0LGUuUHQpJiZlLk5leHQhPWMmJmUuUHJldiE9Yyl7dmFyIGY9Yy5QcmV2LGc9ZS5QcmV2O2MuUHJldj1nO2cuTmV4dD1jO2UuUHJldj1mO2YuTmV4dD1lO2IuUHRzPWM7Zj10aGlzLkNyZWF0ZU91dFJlYygpO2YuUHRzPWU7dGhpcy5VcGRhdGVPdXRQdElkeHMoZik7dGhpcy5Qb2x5MkNvbnRhaW5zUG9seTEoZi5QdHMsYi5QdHMpPyhmLklzSG9sZT0hYi5Jc0hvbGUsXG5mLkZpcnN0TGVmdD1iKTp0aGlzLlBvbHkyQ29udGFpbnNQb2x5MShiLlB0cyxmLlB0cyk/KGYuSXNIb2xlPWIuSXNIb2xlLGIuSXNIb2xlPSFmLklzSG9sZSxmLkZpcnN0TGVmdD1iLkZpcnN0TGVmdCxiLkZpcnN0TGVmdD1mKTooZi5Jc0hvbGU9Yi5Jc0hvbGUsZi5GaXJzdExlZnQ9Yi5GaXJzdExlZnQpO2U9Y31lPWUuTmV4dH1jPWMuTmV4dH13aGlsZShjIT1iLlB0cyl9fX07ZC5DbGlwcGVyLkFyZWE9ZnVuY3Rpb24oYSl7dmFyIGI9YS5sZW5ndGg7aWYoMz5iKXJldHVybiAwO2Zvcih2YXIgYz0wLGU9MCxkPWItMTtlPGI7KytlKWMrPShhW2RdLlgrYVtlXS5YKSooYVtkXS5ZLWFbZV0uWSksZD1lO3JldHVybiAwLjUqLWN9O2QuQ2xpcHBlci5wcm90b3R5cGUuQXJlYT1mdW5jdGlvbihhKXt2YXIgYj1hLlB0cztpZihudWxsPT1iKXJldHVybiAwO3ZhciBjPTA7ZG8gYys9KGIuUHJldi5QdC5YK2IuUHQuWCkqKGIuUHJldi5QdC5ZLWIuUHQuWSksYj1iLk5leHQ7d2hpbGUoYiE9YS5QdHMpO1xucmV0dXJuIDAuNSpjfTtkLkNsaXBwZXIuU2ltcGxpZnlQb2x5Z29uPWZ1bmN0aW9uKGEsYil7dmFyIGM9W10sZT1uZXcgZC5DbGlwcGVyKDApO2UuU3RyaWN0bHlTaW1wbGU9ITA7ZS5BZGRQYXRoKGEsZC5Qb2x5VHlwZS5wdFN1YmplY3QsITApO2UuRXhlY3V0ZShkLkNsaXBUeXBlLmN0VW5pb24sYyxiLGIpO3JldHVybiBjfTtkLkNsaXBwZXIuU2ltcGxpZnlQb2x5Z29ucz1mdW5jdGlvbihhLGIpe1widW5kZWZpbmVkXCI9PXR5cGVvZiBiJiYoYj1kLlBvbHlGaWxsVHlwZS5wZnRFdmVuT2RkKTt2YXIgYz1bXSxlPW5ldyBkLkNsaXBwZXIoMCk7ZS5TdHJpY3RseVNpbXBsZT0hMDtlLkFkZFBhdGhzKGEsZC5Qb2x5VHlwZS5wdFN1YmplY3QsITApO2UuRXhlY3V0ZShkLkNsaXBUeXBlLmN0VW5pb24sYyxiLGIpO3JldHVybiBjfTtkLkNsaXBwZXIuRGlzdGFuY2VTcXJkPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5YLWIuWCxlPWEuWS1iLlk7cmV0dXJuIGMqYytlKmV9O2QuQ2xpcHBlci5EaXN0YW5jZUZyb21MaW5lU3FyZD1cbmZ1bmN0aW9uKGEsYixjKXt2YXIgZT1iLlktYy5ZO2M9Yy5YLWIuWDtiPWUqYi5YK2MqYi5ZO2I9ZSphLlgrYyphLlktYjtyZXR1cm4gYipiLyhlKmUrYypjKX07ZC5DbGlwcGVyLlNsb3Blc05lYXJDb2xsaW5lYXI9ZnVuY3Rpb24oYSxiLGMsZSl7cmV0dXJuIGQuQ2xpcHBlci5EaXN0YW5jZUZyb21MaW5lU3FyZChiLGEsYyk8ZX07ZC5DbGlwcGVyLlBvaW50c0FyZUNsb3NlPWZ1bmN0aW9uKGEsYixjKXt2YXIgZT1hLlgtYi5YO2E9YS5ZLWIuWTtyZXR1cm4gZSplK2EqYTw9Y307ZC5DbGlwcGVyLkV4Y2x1ZGVPcD1mdW5jdGlvbihhKXt2YXIgYj1hLlByZXY7Yi5OZXh0PWEuTmV4dDthLk5leHQuUHJldj1iO2IuSWR4PTA7cmV0dXJuIGJ9O2QuQ2xpcHBlci5DbGVhblBvbHlnb249ZnVuY3Rpb24oYSxiKXtcInVuZGVmaW5lZFwiPT10eXBlb2YgYiYmKGI9MS40MTUpO3ZhciBjPWEubGVuZ3RoO2lmKDA9PWMpcmV0dXJuW107Zm9yKHZhciBlPUFycmF5KGMpLGY9MDtmPGM7KytmKWVbZl09XG5uZXcgZC5PdXRQdDtmb3IoZj0wO2Y8YzsrK2YpZVtmXS5QdD1hW2ZdLGVbZl0uTmV4dD1lWyhmKzEpJWNdLGVbZl0uTmV4dC5QcmV2PWVbZl0sZVtmXS5JZHg9MDtmPWIqYjtmb3IoZT1lWzBdOzA9PWUuSWR4JiZlLk5leHQhPWUuUHJldjspZC5DbGlwcGVyLlBvaW50c0FyZUNsb3NlKGUuUHQsZS5QcmV2LlB0LGYpPyhlPWQuQ2xpcHBlci5FeGNsdWRlT3AoZSksYy0tKTpkLkNsaXBwZXIuUG9pbnRzQXJlQ2xvc2UoZS5QcmV2LlB0LGUuTmV4dC5QdCxmKT8oZC5DbGlwcGVyLkV4Y2x1ZGVPcChlLk5leHQpLGU9ZC5DbGlwcGVyLkV4Y2x1ZGVPcChlKSxjLT0yKTpkLkNsaXBwZXIuU2xvcGVzTmVhckNvbGxpbmVhcihlLlByZXYuUHQsZS5QdCxlLk5leHQuUHQsZik/KGU9ZC5DbGlwcGVyLkV4Y2x1ZGVPcChlKSxjLS0pOihlLklkeD0xLGU9ZS5OZXh0KTszPmMmJihjPTApO2Zvcih2YXIgZz1BcnJheShjKSxmPTA7ZjxjOysrZilnW2ZdPW5ldyBkLkludFBvaW50KGUuUHQpLGU9ZS5OZXh0O1xucmV0dXJuIGd9O2QuQ2xpcHBlci5DbGVhblBvbHlnb25zPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPUFycmF5KGEubGVuZ3RoKSxlPTAsZj1hLmxlbmd0aDtlPGY7ZSsrKWNbZV09ZC5DbGlwcGVyLkNsZWFuUG9seWdvbihhW2VdLGIpO3JldHVybiBjfTtkLkNsaXBwZXIuTWlua293c2tpPWZ1bmN0aW9uKGEsYixjLGUpe3ZhciBmPWU/MTowLGc9YS5sZW5ndGgsaD1iLmxlbmd0aDtlPVtdO2lmKGMpZm9yKGM9MDtjPGg7YysrKXtmb3IodmFyIGw9QXJyYXkoZyksaz0wLG49YS5sZW5ndGgsbT1hW2tdO2s8bjtrKyssbT1hW2tdKWxba109bmV3IGQuSW50UG9pbnQoYltjXS5YK20uWCxiW2NdLlkrbS5ZKTtlLnB1c2gobCl9ZWxzZSBmb3IoYz0wO2M8aDtjKyspe2w9QXJyYXkoZyk7az0wO249YS5sZW5ndGg7Zm9yKG09YVtrXTtrPG47aysrLG09YVtrXSlsW2tdPW5ldyBkLkludFBvaW50KGJbY10uWC1tLlgsYltjXS5ZLW0uWSk7ZS5wdXNoKGwpfWE9W107Zm9yKGM9MDtjPGgtMStmO2MrKylmb3Ioaz1cbjA7azxnO2srKyliPVtdLGIucHVzaChlW2MlaF1bayVnXSksYi5wdXNoKGVbKGMrMSklaF1bayVnXSksYi5wdXNoKGVbKGMrMSklaF1bKGsrMSklZ10pLGIucHVzaChlW2MlaF1bKGsrMSklZ10pLGQuQ2xpcHBlci5PcmllbnRhdGlvbihiKXx8Yi5yZXZlcnNlKCksYS5wdXNoKGIpO2Y9bmV3IGQuQ2xpcHBlcigwKTtmLkFkZFBhdGhzKGEsZC5Qb2x5VHlwZS5wdFN1YmplY3QsITApO2YuRXhlY3V0ZShkLkNsaXBUeXBlLmN0VW5pb24sZSxkLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvLGQuUG9seUZpbGxUeXBlLnBmdE5vblplcm8pO3JldHVybiBlfTtkLkNsaXBwZXIuTWlua293c2tpU3VtPWZ1bmN0aW9uKCl7dmFyIGE9YXJndW1lbnRzLGI9YS5sZW5ndGg7aWYoMz09Yil7dmFyIGM9YVswXSxlPWFbMl07cmV0dXJuIGQuQ2xpcHBlci5NaW5rb3dza2koYyxhWzFdLCEwLGUpfWlmKDQ9PWIpe2Zvcih2YXIgYz1hWzBdLGY9YVsxXSxiPWFbMl0sZT1hWzNdLGE9bmV3IGQuQ2xpcHBlcixnLFxuaD0wLGw9Zi5sZW5ndGg7aDxsOysraClnPWQuQ2xpcHBlci5NaW5rb3dza2koYyxmW2hdLCEwLGUpLGEuQWRkUGF0aHMoZyxkLlBvbHlUeXBlLnB0U3ViamVjdCwhMCk7ZSYmYS5BZGRQYXRocyhmLGQuUG9seVR5cGUucHRDbGlwLCEwKTtjPW5ldyBkLlBhdGhzO2EuRXhlY3V0ZShkLkNsaXBUeXBlLmN0VW5pb24sYyxiLGIpO3JldHVybiBjfX07ZC5DbGlwcGVyLk1pbmtvd3NraURpZmY9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBkLkNsaXBwZXIuTWlua293c2tpKGEsYiwhMSxjKX07ZC5DbGlwcGVyLlBvbHlUcmVlVG9QYXRocz1mdW5jdGlvbihhKXt2YXIgYj1bXTtkLkNsaXBwZXIuQWRkUG9seU5vZGVUb1BhdGhzKGEsZC5DbGlwcGVyLk5vZGVUeXBlLm50QW55LGIpO3JldHVybiBifTtkLkNsaXBwZXIuQWRkUG9seU5vZGVUb1BhdGhzPWZ1bmN0aW9uKGEsYixjKXt2YXIgZT0hMDtzd2l0Y2goYil7Y2FzZSBkLkNsaXBwZXIuTm9kZVR5cGUubnRPcGVuOnJldHVybjtjYXNlIGQuQ2xpcHBlci5Ob2RlVHlwZS5udENsb3NlZDplPVxuIWEuSXNPcGVufTA8YS5tX3BvbHlnb24ubGVuZ3RoJiZlJiZjLnB1c2goYS5tX3BvbHlnb24pO2U9MDthPWEuQ2hpbGRzKCk7Zm9yKHZhciBmPWEubGVuZ3RoLGc9YVtlXTtlPGY7ZSsrLGc9YVtlXSlkLkNsaXBwZXIuQWRkUG9seU5vZGVUb1BhdGhzKGcsYixjKX07ZC5DbGlwcGVyLk9wZW5QYXRoc0Zyb21Qb2x5VHJlZT1mdW5jdGlvbihhKXtmb3IodmFyIGI9bmV3IGQuUGF0aHMsYz0wLGU9YS5DaGlsZENvdW50KCk7YzxlO2MrKylhLkNoaWxkcygpW2NdLklzT3BlbiYmYi5wdXNoKGEuQ2hpbGRzKClbY10ubV9wb2x5Z29uKTtyZXR1cm4gYn07ZC5DbGlwcGVyLkNsb3NlZFBhdGhzRnJvbVBvbHlUcmVlPWZ1bmN0aW9uKGEpe3ZhciBiPW5ldyBkLlBhdGhzO2QuQ2xpcHBlci5BZGRQb2x5Tm9kZVRvUGF0aHMoYSxkLkNsaXBwZXIuTm9kZVR5cGUubnRDbG9zZWQsYik7cmV0dXJuIGJ9O0soZC5DbGlwcGVyLGQuQ2xpcHBlckJhc2UpO2QuQ2xpcHBlci5Ob2RlVHlwZT17bnRBbnk6MCxudE9wZW46MSxcbm50Q2xvc2VkOjJ9O2QuQ2xpcHBlck9mZnNldD1mdW5jdGlvbihhLGIpe1widW5kZWZpbmVkXCI9PXR5cGVvZiBhJiYoYT0yKTtcInVuZGVmaW5lZFwiPT10eXBlb2YgYiYmKGI9ZC5DbGlwcGVyT2Zmc2V0LmRlZl9hcmNfdG9sZXJhbmNlKTt0aGlzLm1fZGVzdFBvbHlzPW5ldyBkLlBhdGhzO3RoaXMubV9zcmNQb2x5PW5ldyBkLlBhdGg7dGhpcy5tX2Rlc3RQb2x5PW5ldyBkLlBhdGg7dGhpcy5tX25vcm1hbHM9W107dGhpcy5tX1N0ZXBzUGVyUmFkPXRoaXMubV9taXRlckxpbT10aGlzLm1fY29zPXRoaXMubV9zaW49dGhpcy5tX3NpbkE9dGhpcy5tX2RlbHRhPTA7dGhpcy5tX2xvd2VzdD1uZXcgZC5JbnRQb2ludDt0aGlzLm1fcG9seU5vZGVzPW5ldyBkLlBvbHlOb2RlO3RoaXMuTWl0ZXJMaW1pdD1hO3RoaXMuQXJjVG9sZXJhbmNlPWI7dGhpcy5tX2xvd2VzdC5YPS0xfTtkLkNsaXBwZXJPZmZzZXQudHdvX3BpPTYuMjgzMTg1MzA3MTc5NTk7ZC5DbGlwcGVyT2Zmc2V0LmRlZl9hcmNfdG9sZXJhbmNlPVxuMC4yNTtkLkNsaXBwZXJPZmZzZXQucHJvdG90eXBlLkNsZWFyPWZ1bmN0aW9uKCl7ZC5DbGVhcih0aGlzLm1fcG9seU5vZGVzLkNoaWxkcygpKTt0aGlzLm1fbG93ZXN0Llg9LTF9O2QuQ2xpcHBlck9mZnNldC5Sb3VuZD1kLkNsaXBwZXIuUm91bmQ7ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5BZGRQYXRoPWZ1bmN0aW9uKGEsYixjKXt2YXIgZT1hLmxlbmd0aC0xO2lmKCEoMD5lKSl7dmFyIGY9bmV3IGQuUG9seU5vZGU7Zi5tX2pvaW50eXBlPWI7Zi5tX2VuZHR5cGU9YztpZihjPT1kLkVuZFR5cGUuZXRDbG9zZWRMaW5lfHxjPT1kLkVuZFR5cGUuZXRDbG9zZWRQb2x5Z29uKWZvcig7MDxlJiZkLkludFBvaW50Lm9wX0VxdWFsaXR5KGFbMF0sYVtlXSk7KWUtLTtmLm1fcG9seWdvbi5wdXNoKGFbMF0pO3ZhciBnPTA7Yj0wO2Zvcih2YXIgaD0xO2g8PWU7aCsrKWQuSW50UG9pbnQub3BfSW5lcXVhbGl0eShmLm1fcG9seWdvbltnXSxhW2hdKSYmKGcrKyxmLm1fcG9seWdvbi5wdXNoKGFbaF0pLFxuYVtoXS5ZPmYubV9wb2x5Z29uW2JdLll8fGFbaF0uWT09Zi5tX3BvbHlnb25bYl0uWSYmYVtoXS5YPGYubV9wb2x5Z29uW2JdLlgpJiYoYj1nKTtpZighKGM9PWQuRW5kVHlwZS5ldENsb3NlZFBvbHlnb24mJjI+Z3x8YyE9ZC5FbmRUeXBlLmV0Q2xvc2VkUG9seWdvbiYmMD5nKSYmKHRoaXMubV9wb2x5Tm9kZXMuQWRkQ2hpbGQoZiksYz09ZC5FbmRUeXBlLmV0Q2xvc2VkUG9seWdvbikpaWYoMD50aGlzLm1fbG93ZXN0LlgpdGhpcy5tX2xvd2VzdD1uZXcgZC5JbnRQb2ludCgwLGIpO2Vsc2UgaWYoYT10aGlzLm1fcG9seU5vZGVzLkNoaWxkcygpW3RoaXMubV9sb3dlc3QuWF0ubV9wb2x5Z29uW3RoaXMubV9sb3dlc3QuWV0sZi5tX3BvbHlnb25bYl0uWT5hLll8fGYubV9wb2x5Z29uW2JdLlk9PWEuWSYmZi5tX3BvbHlnb25bYl0uWDxhLlgpdGhpcy5tX2xvd2VzdD1uZXcgZC5JbnRQb2ludCh0aGlzLm1fcG9seU5vZGVzLkNoaWxkQ291bnQoKS0xLGIpfX07ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5BZGRQYXRocz1cbmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGU9MCxkPWEubGVuZ3RoO2U8ZDtlKyspdGhpcy5BZGRQYXRoKGFbZV0sYixjKX07ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5GaXhPcmllbnRhdGlvbnM9ZnVuY3Rpb24oKXtpZigwPD10aGlzLm1fbG93ZXN0LlgmJiFkLkNsaXBwZXIuT3JpZW50YXRpb24odGhpcy5tX3BvbHlOb2Rlcy5DaGlsZHMoKVt0aGlzLm1fbG93ZXN0LlhdLm1fcG9seWdvbikpZm9yKHZhciBhPTA7YTx0aGlzLm1fcG9seU5vZGVzLkNoaWxkQ291bnQoKTthKyspe3ZhciBiPXRoaXMubV9wb2x5Tm9kZXMuQ2hpbGRzKClbYV07KGIubV9lbmR0eXBlPT1kLkVuZFR5cGUuZXRDbG9zZWRQb2x5Z29ufHxiLm1fZW5kdHlwZT09ZC5FbmRUeXBlLmV0Q2xvc2VkTGluZSYmZC5DbGlwcGVyLk9yaWVudGF0aW9uKGIubV9wb2x5Z29uKSkmJmIubV9wb2x5Z29uLnJldmVyc2UoKX1lbHNlIGZvcihhPTA7YTx0aGlzLm1fcG9seU5vZGVzLkNoaWxkQ291bnQoKTthKyspYj10aGlzLm1fcG9seU5vZGVzLkNoaWxkcygpW2FdLFxuYi5tX2VuZHR5cGUhPWQuRW5kVHlwZS5ldENsb3NlZExpbmV8fGQuQ2xpcHBlci5PcmllbnRhdGlvbihiLm1fcG9seWdvbil8fGIubV9wb2x5Z29uLnJldmVyc2UoKX07ZC5DbGlwcGVyT2Zmc2V0LkdldFVuaXROb3JtYWw9ZnVuY3Rpb24oYSxiKXt2YXIgYz1iLlgtYS5YLGU9Yi5ZLWEuWTtpZigwPT1jJiYwPT1lKXJldHVybiBuZXcgZC5Eb3VibGVQb2ludCgwLDApO3ZhciBmPTEvTWF0aC5zcXJ0KGMqYytlKmUpO3JldHVybiBuZXcgZC5Eb3VibGVQb2ludChlKmYsLShjKmYpKX07ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5Eb09mZnNldD1mdW5jdGlvbihhKXt0aGlzLm1fZGVzdFBvbHlzPVtdO3RoaXMubV9kZWx0YT1hO2lmKGQuQ2xpcHBlckJhc2UubmVhcl96ZXJvKGEpKWZvcih2YXIgYj0wO2I8dGhpcy5tX3BvbHlOb2Rlcy5DaGlsZENvdW50KCk7YisrKXt2YXIgYz10aGlzLm1fcG9seU5vZGVzLkNoaWxkcygpW2JdO2MubV9lbmR0eXBlPT1kLkVuZFR5cGUuZXRDbG9zZWRQb2x5Z29uJiZcbnRoaXMubV9kZXN0UG9seXMucHVzaChjLm1fcG9seWdvbil9ZWxzZXt0aGlzLm1fbWl0ZXJMaW09Mjx0aGlzLk1pdGVyTGltaXQ/Mi8odGhpcy5NaXRlckxpbWl0KnRoaXMuTWl0ZXJMaW1pdCk6MC41O3ZhciBiPTA+PXRoaXMuQXJjVG9sZXJhbmNlP2QuQ2xpcHBlck9mZnNldC5kZWZfYXJjX3RvbGVyYW5jZTp0aGlzLkFyY1RvbGVyYW5jZT5NYXRoLmFicyhhKSpkLkNsaXBwZXJPZmZzZXQuZGVmX2FyY190b2xlcmFuY2U/TWF0aC5hYnMoYSkqZC5DbGlwcGVyT2Zmc2V0LmRlZl9hcmNfdG9sZXJhbmNlOnRoaXMuQXJjVG9sZXJhbmNlLGU9My4xNDE1OTI2NTM1ODk3OS9NYXRoLmFjb3MoMS1iL01hdGguYWJzKGEpKTt0aGlzLm1fc2luPU1hdGguc2luKGQuQ2xpcHBlck9mZnNldC50d29fcGkvZSk7dGhpcy5tX2Nvcz1NYXRoLmNvcyhkLkNsaXBwZXJPZmZzZXQudHdvX3BpL2UpO3RoaXMubV9TdGVwc1BlclJhZD1lL2QuQ2xpcHBlck9mZnNldC50d29fcGk7MD5hJiYodGhpcy5tX3Npbj1cbi10aGlzLm1fc2luKTtmb3IoYj0wO2I8dGhpcy5tX3BvbHlOb2Rlcy5DaGlsZENvdW50KCk7YisrKXtjPXRoaXMubV9wb2x5Tm9kZXMuQ2hpbGRzKClbYl07dGhpcy5tX3NyY1BvbHk9Yy5tX3BvbHlnb247dmFyIGY9dGhpcy5tX3NyY1BvbHkubGVuZ3RoO2lmKCEoMD09Znx8MD49YSYmKDM+Znx8Yy5tX2VuZHR5cGUhPWQuRW5kVHlwZS5ldENsb3NlZFBvbHlnb24pKSl7dGhpcy5tX2Rlc3RQb2x5PVtdO2lmKDE9PWYpaWYoYy5tX2pvaW50eXBlPT1kLkpvaW5UeXBlLmp0Um91bmQpZm9yKHZhciBjPTEsZj0wLGc9MTtnPD1lO2crKyl7dGhpcy5tX2Rlc3RQb2x5LnB1c2gobmV3IGQuSW50UG9pbnQoZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9zcmNQb2x5WzBdLlgrYyphKSxkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbMF0uWStmKmEpKSk7dmFyIGg9YyxjPWMqdGhpcy5tX2Nvcy10aGlzLm1fc2luKmYsZj1oKnRoaXMubV9zaW4rZip0aGlzLm1fY29zfWVsc2UgZm9yKGY9XG5jPS0xLGc9MDs0Pmc7KytnKXRoaXMubV9kZXN0UG9seS5wdXNoKG5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVswXS5YK2MqYSksZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9zcmNQb2x5WzBdLlkrZiphKSkpLDA+Yz9jPTE6MD5mP2Y9MTpjPS0xO2Vsc2V7Zm9yKGc9dGhpcy5tX25vcm1hbHMubGVuZ3RoPTA7ZzxmLTE7ZysrKXRoaXMubV9ub3JtYWxzLnB1c2goZC5DbGlwcGVyT2Zmc2V0LkdldFVuaXROb3JtYWwodGhpcy5tX3NyY1BvbHlbZ10sdGhpcy5tX3NyY1BvbHlbZysxXSkpO2MubV9lbmR0eXBlPT1kLkVuZFR5cGUuZXRDbG9zZWRMaW5lfHxjLm1fZW5kdHlwZT09ZC5FbmRUeXBlLmV0Q2xvc2VkUG9seWdvbj90aGlzLm1fbm9ybWFscy5wdXNoKGQuQ2xpcHBlck9mZnNldC5HZXRVbml0Tm9ybWFsKHRoaXMubV9zcmNQb2x5W2YtMV0sdGhpcy5tX3NyY1BvbHlbMF0pKTp0aGlzLm1fbm9ybWFscy5wdXNoKG5ldyBkLkRvdWJsZVBvaW50KHRoaXMubV9ub3JtYWxzW2YtXG4yXSkpO2lmKGMubV9lbmR0eXBlPT1kLkVuZFR5cGUuZXRDbG9zZWRQb2x5Z29uKWZvcihoPWYtMSxnPTA7ZzxmO2crKyloPXRoaXMuT2Zmc2V0UG9pbnQoZyxoLGMubV9qb2ludHlwZSk7ZWxzZSBpZihjLm1fZW5kdHlwZT09ZC5FbmRUeXBlLmV0Q2xvc2VkTGluZSl7aD1mLTE7Zm9yKGc9MDtnPGY7ZysrKWg9dGhpcy5PZmZzZXRQb2ludChnLGgsYy5tX2pvaW50eXBlKTt0aGlzLm1fZGVzdFBvbHlzLnB1c2godGhpcy5tX2Rlc3RQb2x5KTt0aGlzLm1fZGVzdFBvbHk9W107aD10aGlzLm1fbm9ybWFsc1tmLTFdO2ZvcihnPWYtMTswPGc7Zy0tKXRoaXMubV9ub3JtYWxzW2ddPW5ldyBkLkRvdWJsZVBvaW50KC10aGlzLm1fbm9ybWFsc1tnLTFdLlgsLXRoaXMubV9ub3JtYWxzW2ctMV0uWSk7dGhpcy5tX25vcm1hbHNbMF09bmV3IGQuRG91YmxlUG9pbnQoLWguWCwtaC5ZKTtoPTA7Zm9yKGc9Zi0xOzA8PWc7Zy0tKWg9dGhpcy5PZmZzZXRQb2ludChnLGgsYy5tX2pvaW50eXBlKX1lbHNle2g9XG4wO2ZvcihnPTE7ZzxmLTE7KytnKWg9dGhpcy5PZmZzZXRQb2ludChnLGgsYy5tX2pvaW50eXBlKTtjLm1fZW5kdHlwZT09ZC5FbmRUeXBlLmV0T3BlbkJ1dHQ/KGc9Zi0xLGg9bmV3IGQuSW50UG9pbnQoZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9zcmNQb2x5W2ddLlgrdGhpcy5tX25vcm1hbHNbZ10uWCphKSxkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbZ10uWSt0aGlzLm1fbm9ybWFsc1tnXS5ZKmEpKSx0aGlzLm1fZGVzdFBvbHkucHVzaChoKSxoPW5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVtnXS5YLXRoaXMubV9ub3JtYWxzW2ddLlgqYSksZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9zcmNQb2x5W2ddLlktdGhpcy5tX25vcm1hbHNbZ10uWSphKSksdGhpcy5tX2Rlc3RQb2x5LnB1c2goaCkpOihnPWYtMSxoPWYtMix0aGlzLm1fc2luQT0wLHRoaXMubV9ub3JtYWxzW2ddPW5ldyBkLkRvdWJsZVBvaW50KC10aGlzLm1fbm9ybWFsc1tnXS5YLFxuLXRoaXMubV9ub3JtYWxzW2ddLlkpLGMubV9lbmR0eXBlPT1kLkVuZFR5cGUuZXRPcGVuU3F1YXJlP3RoaXMuRG9TcXVhcmUoZyxoKTp0aGlzLkRvUm91bmQoZyxoKSk7Zm9yKGc9Zi0xOzA8ZztnLS0pdGhpcy5tX25vcm1hbHNbZ109bmV3IGQuRG91YmxlUG9pbnQoLXRoaXMubV9ub3JtYWxzW2ctMV0uWCwtdGhpcy5tX25vcm1hbHNbZy0xXS5ZKTt0aGlzLm1fbm9ybWFsc1swXT1uZXcgZC5Eb3VibGVQb2ludCgtdGhpcy5tX25vcm1hbHNbMV0uWCwtdGhpcy5tX25vcm1hbHNbMV0uWSk7aD1mLTE7Zm9yKGc9aC0xOzA8ZzstLWcpaD10aGlzLk9mZnNldFBvaW50KGcsaCxjLm1fam9pbnR5cGUpO2MubV9lbmR0eXBlPT1kLkVuZFR5cGUuZXRPcGVuQnV0dD8oaD1uZXcgZC5JbnRQb2ludChkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbMF0uWC10aGlzLm1fbm9ybWFsc1swXS5YKmEpLGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVswXS5ZLXRoaXMubV9ub3JtYWxzWzBdLlkqXG5hKSksdGhpcy5tX2Rlc3RQb2x5LnB1c2goaCksaD1uZXcgZC5JbnRQb2ludChkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbMF0uWCt0aGlzLm1fbm9ybWFsc1swXS5YKmEpLGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVswXS5ZK3RoaXMubV9ub3JtYWxzWzBdLlkqYSkpLHRoaXMubV9kZXN0UG9seS5wdXNoKGgpKToodGhpcy5tX3NpbkE9MCxjLm1fZW5kdHlwZT09ZC5FbmRUeXBlLmV0T3BlblNxdWFyZT90aGlzLkRvU3F1YXJlKDAsMSk6dGhpcy5Eb1JvdW5kKDAsMSkpfX10aGlzLm1fZGVzdFBvbHlzLnB1c2godGhpcy5tX2Rlc3RQb2x5KX19fX07ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5FeGVjdXRlPWZ1bmN0aW9uKCl7dmFyIGE9YXJndW1lbnRzO2lmKGFbMF1pbnN0YW5jZW9mIGQuUG9seVRyZWUpaWYoYj1hWzBdLGM9YVsxXSxiLkNsZWFyKCksdGhpcy5GaXhPcmllbnRhdGlvbnMoKSx0aGlzLkRvT2Zmc2V0KGMpLGE9bmV3IGQuQ2xpcHBlcigwKSxcbmEuQWRkUGF0aHModGhpcy5tX2Rlc3RQb2x5cyxkLlBvbHlUeXBlLnB0U3ViamVjdCwhMCksMDxjKWEuRXhlY3V0ZShkLkNsaXBUeXBlLmN0VW5pb24sYixkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZSxkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZSk7ZWxzZSBpZihjPWQuQ2xpcHBlci5HZXRCb3VuZHModGhpcy5tX2Rlc3RQb2x5cyksZT1uZXcgZC5QYXRoLGUucHVzaChuZXcgZC5JbnRQb2ludChjLmxlZnQtMTAsYy5ib3R0b20rMTApKSxlLnB1c2gobmV3IGQuSW50UG9pbnQoYy5yaWdodCsxMCxjLmJvdHRvbSsxMCkpLGUucHVzaChuZXcgZC5JbnRQb2ludChjLnJpZ2h0KzEwLGMudG9wLTEwKSksZS5wdXNoKG5ldyBkLkludFBvaW50KGMubGVmdC0xMCxjLnRvcC0xMCkpLGEuQWRkUGF0aChlLGQuUG9seVR5cGUucHRTdWJqZWN0LCEwKSxhLlJldmVyc2VTb2x1dGlvbj0hMCxhLkV4ZWN1dGUoZC5DbGlwVHlwZS5jdFVuaW9uLGIsZC5Qb2x5RmlsbFR5cGUucGZ0TmVnYXRpdmUsZC5Qb2x5RmlsbFR5cGUucGZ0TmVnYXRpdmUpLFxuMT09Yi5DaGlsZENvdW50KCkmJjA8Yi5DaGlsZHMoKVswXS5DaGlsZENvdW50KCkpZm9yKGE9Yi5DaGlsZHMoKVswXSxiLkNoaWxkcygpWzBdPWEuQ2hpbGRzKClbMF0sYz0xO2M8YS5DaGlsZENvdW50KCk7YysrKWIuQWRkQ2hpbGQoYS5DaGlsZHMoKVtjXSk7ZWxzZSBiLkNsZWFyKCk7ZWxzZXt2YXIgYj1hWzBdLGM9YVsxXTtkLkNsZWFyKGIpO3RoaXMuRml4T3JpZW50YXRpb25zKCk7dGhpcy5Eb09mZnNldChjKTthPW5ldyBkLkNsaXBwZXIoMCk7YS5BZGRQYXRocyh0aGlzLm1fZGVzdFBvbHlzLGQuUG9seVR5cGUucHRTdWJqZWN0LCEwKTtpZigwPGMpYS5FeGVjdXRlKGQuQ2xpcFR5cGUuY3RVbmlvbixiLGQuUG9seUZpbGxUeXBlLnBmdFBvc2l0aXZlLGQuUG9seUZpbGxUeXBlLnBmdFBvc2l0aXZlKTtlbHNle3ZhciBjPWQuQ2xpcHBlci5HZXRCb3VuZHModGhpcy5tX2Rlc3RQb2x5cyksZT1uZXcgZC5QYXRoO2UucHVzaChuZXcgZC5JbnRQb2ludChjLmxlZnQtMTAsYy5ib3R0b20rXG4xMCkpO2UucHVzaChuZXcgZC5JbnRQb2ludChjLnJpZ2h0KzEwLGMuYm90dG9tKzEwKSk7ZS5wdXNoKG5ldyBkLkludFBvaW50KGMucmlnaHQrMTAsYy50b3AtMTApKTtlLnB1c2gobmV3IGQuSW50UG9pbnQoYy5sZWZ0LTEwLGMudG9wLTEwKSk7YS5BZGRQYXRoKGUsZC5Qb2x5VHlwZS5wdFN1YmplY3QsITApO2EuUmV2ZXJzZVNvbHV0aW9uPSEwO2EuRXhlY3V0ZShkLkNsaXBUeXBlLmN0VW5pb24sYixkLlBvbHlGaWxsVHlwZS5wZnROZWdhdGl2ZSxkLlBvbHlGaWxsVHlwZS5wZnROZWdhdGl2ZSk7MDxiLmxlbmd0aCYmYi5zcGxpY2UoMCwxKX19fTtkLkNsaXBwZXJPZmZzZXQucHJvdG90eXBlLk9mZnNldFBvaW50PWZ1bmN0aW9uKGEsYixjKXt0aGlzLm1fc2luQT10aGlzLm1fbm9ybWFsc1tiXS5YKnRoaXMubV9ub3JtYWxzW2FdLlktdGhpcy5tX25vcm1hbHNbYV0uWCp0aGlzLm1fbm9ybWFsc1tiXS5ZO2lmKDVFLTU+dGhpcy5tX3NpbkEmJi01RS01PHRoaXMubV9zaW5BKXJldHVybiBiO1xuMTx0aGlzLm1fc2luQT90aGlzLm1fc2luQT0xOi0xPnRoaXMubV9zaW5BJiYodGhpcy5tX3NpbkE9LTEpO2lmKDA+dGhpcy5tX3NpbkEqdGhpcy5tX2RlbHRhKXRoaXMubV9kZXN0UG9seS5wdXNoKG5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVthXS5YK3RoaXMubV9ub3JtYWxzW2JdLlgqdGhpcy5tX2RlbHRhKSxkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbYV0uWSt0aGlzLm1fbm9ybWFsc1tiXS5ZKnRoaXMubV9kZWx0YSkpKSx0aGlzLm1fZGVzdFBvbHkucHVzaChuZXcgZC5JbnRQb2ludCh0aGlzLm1fc3JjUG9seVthXSkpLHRoaXMubV9kZXN0UG9seS5wdXNoKG5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVthXS5YK3RoaXMubV9ub3JtYWxzW2FdLlgqdGhpcy5tX2RlbHRhKSxkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbYV0uWSt0aGlzLm1fbm9ybWFsc1thXS5ZKlxudGhpcy5tX2RlbHRhKSkpO2Vsc2Ugc3dpdGNoKGMpe2Nhc2UgZC5Kb2luVHlwZS5qdE1pdGVyOmM9MSsodGhpcy5tX25vcm1hbHNbYV0uWCp0aGlzLm1fbm9ybWFsc1tiXS5YK3RoaXMubV9ub3JtYWxzW2FdLlkqdGhpcy5tX25vcm1hbHNbYl0uWSk7Yz49dGhpcy5tX21pdGVyTGltP3RoaXMuRG9NaXRlcihhLGIsYyk6dGhpcy5Eb1NxdWFyZShhLGIpO2JyZWFrO2Nhc2UgZC5Kb2luVHlwZS5qdFNxdWFyZTp0aGlzLkRvU3F1YXJlKGEsYik7YnJlYWs7Y2FzZSBkLkpvaW5UeXBlLmp0Um91bmQ6dGhpcy5Eb1JvdW5kKGEsYil9cmV0dXJuIGF9O2QuQ2xpcHBlck9mZnNldC5wcm90b3R5cGUuRG9TcXVhcmU9ZnVuY3Rpb24oYSxiKXt2YXIgYz1NYXRoLnRhbihNYXRoLmF0YW4yKHRoaXMubV9zaW5BLHRoaXMubV9ub3JtYWxzW2JdLlgqdGhpcy5tX25vcm1hbHNbYV0uWCt0aGlzLm1fbm9ybWFsc1tiXS5ZKnRoaXMubV9ub3JtYWxzW2FdLlkpLzQpO3RoaXMubV9kZXN0UG9seS5wdXNoKG5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVthXS5YK1xudGhpcy5tX2RlbHRhKih0aGlzLm1fbm9ybWFsc1tiXS5YLXRoaXMubV9ub3JtYWxzW2JdLlkqYykpLGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVthXS5ZK3RoaXMubV9kZWx0YSoodGhpcy5tX25vcm1hbHNbYl0uWSt0aGlzLm1fbm9ybWFsc1tiXS5YKmMpKSkpO3RoaXMubV9kZXN0UG9seS5wdXNoKG5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVthXS5YK3RoaXMubV9kZWx0YSoodGhpcy5tX25vcm1hbHNbYV0uWCt0aGlzLm1fbm9ybWFsc1thXS5ZKmMpKSxkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbYV0uWSt0aGlzLm1fZGVsdGEqKHRoaXMubV9ub3JtYWxzW2FdLlktdGhpcy5tX25vcm1hbHNbYV0uWCpjKSkpKX07ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5Eb01pdGVyPWZ1bmN0aW9uKGEsYixjKXtjPXRoaXMubV9kZWx0YS9jO3RoaXMubV9kZXN0UG9seS5wdXNoKG5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVthXS5YK1xuKHRoaXMubV9ub3JtYWxzW2JdLlgrdGhpcy5tX25vcm1hbHNbYV0uWCkqYyksZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9zcmNQb2x5W2FdLlkrKHRoaXMubV9ub3JtYWxzW2JdLlkrdGhpcy5tX25vcm1hbHNbYV0uWSkqYykpKX07ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5Eb1JvdW5kPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPU1hdGguYXRhbjIodGhpcy5tX3NpbkEsdGhpcy5tX25vcm1hbHNbYl0uWCp0aGlzLm1fbm9ybWFsc1thXS5YK3RoaXMubV9ub3JtYWxzW2JdLlkqdGhpcy5tX25vcm1hbHNbYV0uWSksYz1kLkNhc3RfSW50MzIoZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9TdGVwc1BlclJhZCpNYXRoLmFicyhjKSkpLGU9dGhpcy5tX25vcm1hbHNbYl0uWCxmPXRoaXMubV9ub3JtYWxzW2JdLlksZyxoPTA7aDxjOysraCl0aGlzLm1fZGVzdFBvbHkucHVzaChuZXcgZC5JbnRQb2ludChkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbYV0uWCtcbmUqdGhpcy5tX2RlbHRhKSxkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbYV0uWStmKnRoaXMubV9kZWx0YSkpKSxnPWUsZT1lKnRoaXMubV9jb3MtdGhpcy5tX3NpbipmLGY9Zyp0aGlzLm1fc2luK2YqdGhpcy5tX2Nvczt0aGlzLm1fZGVzdFBvbHkucHVzaChuZXcgZC5JbnRQb2ludChkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbYV0uWCt0aGlzLm1fbm9ybWFsc1thXS5YKnRoaXMubV9kZWx0YSksZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9zcmNQb2x5W2FdLlkrdGhpcy5tX25vcm1hbHNbYV0uWSp0aGlzLm1fZGVsdGEpKSl9O2QuRXJyb3I9ZnVuY3Rpb24oYSl7dHJ5e3Rocm93IEVycm9yKGEpO31jYXRjaChiKXthbGVydChiLm1lc3NhZ2UpfX07ZC5KUz17fTtkLkpTLkFyZWFPZlBvbHlnb249ZnVuY3Rpb24oYSxiKXtifHwoYj0xKTtyZXR1cm4gZC5DbGlwcGVyLkFyZWEoYSkvKGIqYil9O2QuSlMuQXJlYU9mUG9seWdvbnM9ZnVuY3Rpb24oYSxcbmIpe2J8fChiPTEpO2Zvcih2YXIgYz0wLGU9MDtlPGEubGVuZ3RoO2UrKyljKz1kLkNsaXBwZXIuQXJlYShhW2VdKTtyZXR1cm4gYy8oYipiKX07ZC5KUy5Cb3VuZHNPZlBhdGg9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gZC5KUy5Cb3VuZHNPZlBhdGhzKFthXSxiKX07ZC5KUy5Cb3VuZHNPZlBhdGhzPWZ1bmN0aW9uKGEsYil7Ynx8KGI9MSk7dmFyIGM9ZC5DbGlwcGVyLkdldEJvdW5kcyhhKTtjLmxlZnQvPWI7Yy5ib3R0b20vPWI7Yy5yaWdodC89YjtjLnRvcC89YjtyZXR1cm4gY307ZC5KUy5DbGVhbj1mdW5jdGlvbihhLGIpe2lmKCEoYSBpbnN0YW5jZW9mIEFycmF5KSlyZXR1cm5bXTt2YXIgYz1hWzBdaW5zdGFuY2VvZiBBcnJheTthPWQuSlMuQ2xvbmUoYSk7aWYoXCJudW1iZXJcIiE9dHlwZW9mIGJ8fG51bGw9PT1iKXJldHVybiBkLkVycm9yKFwiRGVsdGEgaXMgbm90IGEgbnVtYmVyIGluIENsZWFuKCkuXCIpLGE7aWYoMD09PWEubGVuZ3RofHwxPT1hLmxlbmd0aCYmMD09PWFbMF0ubGVuZ3RofHxcbjA+YilyZXR1cm4gYTtjfHwoYT1bYV0pO2Zvcih2YXIgZT1hLmxlbmd0aCxmLGcsaCxsLGssbixtLHA9W10scT0wO3E8ZTtxKyspaWYoZz1hW3FdLGY9Zy5sZW5ndGgsMCE9PWYpaWYoMz5mKWg9ZyxwLnB1c2goaCk7ZWxzZXtoPWc7bD1iKmI7az1nWzBdO2ZvcihtPW49MTttPGY7bSsrKShnW21dLlgtay5YKSooZ1ttXS5YLWsuWCkrKGdbbV0uWS1rLlkpKihnW21dLlktay5ZKTw9bHx8KGhbbl09Z1ttXSxrPWdbbV0sbisrKTtrPWdbbi0xXTsoZ1swXS5YLWsuWCkqKGdbMF0uWC1rLlgpKyhnWzBdLlktay5ZKSooZ1swXS5ZLWsuWSk8PWwmJm4tLTtuPGYmJmguc3BsaWNlKG4sZi1uKTtoLmxlbmd0aCYmcC5wdXNoKGgpfSFjJiZwLmxlbmd0aD9wPXBbMF06Y3x8MCE9PXAubGVuZ3RoP2MmJjA9PT1wLmxlbmd0aCYmKHA9W1tdXSk6cD1bXTtyZXR1cm4gcH07ZC5KUy5DbG9uZT1mdW5jdGlvbihhKXtpZighKGEgaW5zdGFuY2VvZiBBcnJheSl8fDA9PT1hLmxlbmd0aClyZXR1cm5bXTtpZigxPT1cbmEubGVuZ3RoJiYwPT09YVswXS5sZW5ndGgpcmV0dXJuW1tdXTt2YXIgYj1hWzBdaW5zdGFuY2VvZiBBcnJheTtifHwoYT1bYV0pO3ZhciBjPWEubGVuZ3RoLGUsZCxnLGgsbD1BcnJheShjKTtmb3IoZD0wO2Q8YztkKyspe2U9YVtkXS5sZW5ndGg7aD1BcnJheShlKTtmb3IoZz0wO2c8ZTtnKyspaFtnXT17WDphW2RdW2ddLlgsWTphW2RdW2ddLll9O2xbZF09aH1ifHwobD1sWzBdKTtyZXR1cm4gbH07ZC5KUy5MaWdodGVuPWZ1bmN0aW9uKGEsYil7aWYoIShhIGluc3RhbmNlb2YgQXJyYXkpKXJldHVybltdO2lmKFwibnVtYmVyXCIhPXR5cGVvZiBifHxudWxsPT09YilyZXR1cm4gZC5FcnJvcihcIlRvbGVyYW5jZSBpcyBub3QgYSBudW1iZXIgaW4gTGlnaHRlbigpLlwiKSxkLkpTLkNsb25lKGEpO2lmKDA9PT1hLmxlbmd0aHx8MT09YS5sZW5ndGgmJjA9PT1hWzBdLmxlbmd0aHx8MD5iKXJldHVybiBkLkpTLkNsb25lKGEpO2FbMF1pbnN0YW5jZW9mIEFycmF5fHwoYT1bYV0pO3ZhciBjLGUsXG5mLGcsaCxsLGssbSxwLHEscixzLHQsdSx2LHg9YS5sZW5ndGgseT1iKmIsdz1bXTtmb3IoYz0wO2M8eDtjKyspaWYoZj1hW2NdLGw9Zi5sZW5ndGgsMCE9bCl7Zm9yKGc9MDsxRTY+ZztnKyspe2g9W107bD1mLmxlbmd0aDtmW2wtMV0uWCE9ZlswXS5YfHxmW2wtMV0uWSE9ZlswXS5ZPyhyPTEsZi5wdXNoKHtYOmZbMF0uWCxZOmZbMF0uWX0pLGw9Zi5sZW5ndGgpOnI9MDtxPVtdO2ZvcihlPTA7ZTxsLTI7ZSsrKXtrPWZbZV07cD1mW2UrMV07bT1mW2UrMl07dT1rLlg7dj1rLlk7az1tLlgtdTtzPW0uWS12O2lmKDAhPT1rfHwwIT09cyl0PSgocC5YLXUpKmsrKHAuWS12KSpzKS8oayprK3MqcyksMTx0Pyh1PW0uWCx2PW0uWSk6MDx0JiYodSs9ayp0LHYrPXMqdCk7az1wLlgtdTtzPXAuWS12O209ayprK3MqczttPD15JiYocVtlKzFdPTEsZSsrKX1oLnB1c2goe1g6ZlswXS5YLFk6ZlswXS5ZfSk7Zm9yKGU9MTtlPGwtMTtlKyspcVtlXXx8aC5wdXNoKHtYOmZbZV0uWCxZOmZbZV0uWX0pO1xuaC5wdXNoKHtYOmZbbC0xXS5YLFk6ZltsLTFdLll9KTtyJiZmLnBvcCgpO2lmKHEubGVuZ3RoKWY9aDtlbHNlIGJyZWFrfWw9aC5sZW5ndGg7aFtsLTFdLlg9PWhbMF0uWCYmaFtsLTFdLlk9PWhbMF0uWSYmaC5wb3AoKTsyPGgubGVuZ3RoJiZ3LnB1c2goaCl9IWFbMF1pbnN0YW5jZW9mIEFycmF5JiYodz13WzBdKTtcInVuZGVmaW5lZFwiPT10eXBlb2YgdyYmKHc9W1tdXSk7cmV0dXJuIHd9O2QuSlMuUGVyaW1ldGVyT2ZQYXRoPWZ1bmN0aW9uKGEsYixjKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgYSlyZXR1cm4gMDt2YXIgZT1NYXRoLnNxcnQsZD0wLGcsaCxrPTAsbT1nPTA7aD0wO3ZhciBuPWEubGVuZ3RoO2lmKDI+bilyZXR1cm4gMDtiJiYoYVtuXT1hWzBdLG4rKyk7Zm9yKDstLW47KWc9YVtuXSxrPWcuWCxnPWcuWSxoPWFbbi0xXSxtPWguWCxoPWguWSxkKz1lKChrLW0pKihrLW0pKyhnLWgpKihnLWgpKTtiJiZhLnBvcCgpO3JldHVybiBkL2N9O2QuSlMuUGVyaW1ldGVyT2ZQYXRocz1cbmZ1bmN0aW9uKGEsYixjKXtjfHwoYz0xKTtmb3IodmFyIGU9MCxmPTA7ZjxhLmxlbmd0aDtmKyspZSs9ZC5KUy5QZXJpbWV0ZXJPZlBhdGgoYVtmXSxiLGMpO3JldHVybiBlfTtkLkpTLlNjYWxlRG93blBhdGg9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkO2J8fChiPTEpO2ZvcihjPWEubGVuZ3RoO2MtLTspZD1hW2NdLGQuWC89YixkLlkvPWJ9O2QuSlMuU2NhbGVEb3duUGF0aHM9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGY7Ynx8KGI9MSk7Zm9yKGM9YS5sZW5ndGg7Yy0tOylmb3IoZD1hW2NdLmxlbmd0aDtkLS07KWY9YVtjXVtkXSxmLlgvPWIsZi5ZLz1ifTtkLkpTLlNjYWxlVXBQYXRoPWZ1bmN0aW9uKGEsYil7dmFyIGMsZCxmPU1hdGgucm91bmQ7Ynx8KGI9MSk7Zm9yKGM9YS5sZW5ndGg7Yy0tOylkPWFbY10sZC5YPWYoZC5YKmIpLGQuWT1mKGQuWSpiKX07ZC5KUy5TY2FsZVVwUGF0aHM9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGYsZz1NYXRoLnJvdW5kO2J8fChiPTEpO2ZvcihjPWEubGVuZ3RoO2MtLTspZm9yKGQ9XG5hW2NdLmxlbmd0aDtkLS07KWY9YVtjXVtkXSxmLlg9ZyhmLlgqYiksZi5ZPWcoZi5ZKmIpfTtkLkV4UG9seWdvbnM9ZnVuY3Rpb24oKXtyZXR1cm5bXX07ZC5FeFBvbHlnb249ZnVuY3Rpb24oKXt0aGlzLmhvbGVzPXRoaXMub3V0ZXI9bnVsbH07ZC5KUy5BZGRPdXRlclBvbHlOb2RlVG9FeFBvbHlnb25zPWZ1bmN0aW9uKGEsYil7dmFyIGM9bmV3IGQuRXhQb2x5Z29uO2Mub3V0ZXI9YS5Db250b3VyKCk7dmFyIGU9YS5DaGlsZHMoKSxmPWUubGVuZ3RoO2MuaG9sZXM9QXJyYXkoZik7dmFyIGcsaCxrLG0sbjtmb3IoaD0wO2g8ZjtoKyspZm9yKGc9ZVtoXSxjLmhvbGVzW2hdPWcuQ29udG91cigpLGs9MCxtPWcuQ2hpbGRzKCksbj1tLmxlbmd0aDtrPG47aysrKWc9bVtrXSxkLkpTLkFkZE91dGVyUG9seU5vZGVUb0V4UG9seWdvbnMoZyxiKTtiLnB1c2goYyl9O2QuSlMuRXhQb2x5Z29uc1RvUGF0aHM9ZnVuY3Rpb24oYSl7dmFyIGIsYyxlLGYsZz1uZXcgZC5QYXRocztiPTA7Zm9yKGU9XG5hLmxlbmd0aDtiPGU7YisrKWZvcihnLnB1c2goYVtiXS5vdXRlciksYz0wLGY9YVtiXS5ob2xlcy5sZW5ndGg7YzxmO2MrKylnLnB1c2goYVtiXS5ob2xlc1tjXSk7cmV0dXJuIGd9O2QuSlMuUG9seVRyZWVUb0V4UG9seWdvbnM9ZnVuY3Rpb24oYSl7dmFyIGI9bmV3IGQuRXhQb2x5Z29ucyxjLGUsZjtjPTA7ZT1hLkNoaWxkcygpO2ZvcihmPWUubGVuZ3RoO2M8ZjtjKyspYT1lW2NdLGQuSlMuQWRkT3V0ZXJQb2x5Tm9kZVRvRXhQb2x5Z29ucyhhLGIpO3JldHVybiBifX0pKCk7XG5cbjsgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18odHlwZW9mIENsaXBwZXJMaWIgIT0gXCJ1bmRlZmluZWRcIiA/IENsaXBwZXJMaWIgOiB3aW5kb3cuQ2xpcHBlckxpYik7XG5cbn0pLmNhbGwoZ2xvYmFsLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZ1bmN0aW9uIGRlZmluZUV4cG9ydChleCkgeyBtb2R1bGUuZXhwb3J0cyA9IGV4OyB9KTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG59LHt9XSwyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8vIEZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWF0aC9yb3VuZFxyXG47KGZ1bmN0aW9uKCkge1xyXG4gIC8qKlxyXG4gICAqIERlY2ltYWwgYWRqdXN0bWVudCBvZiBhIG51bWJlci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgdHlwZSAgVGhlIHR5cGUgb2YgYWRqdXN0bWVudC5cclxuICAgKiBAcGFyYW0ge051bWJlcn0gIHZhbHVlIFRoZSBudW1iZXIuXHJcbiAgICogQHBhcmFtIHtJbnRlZ2VyfSBleHAgICBUaGUgZXhwb25lbnQgKHRoZSAxMCBsb2dhcml0aG0gb2YgdGhlIGFkanVzdG1lbnQgYmFzZSkuXHJcbiAgICogQHJldHVybnMge051bWJlcn0gVGhlIGFkanVzdGVkIHZhbHVlLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGRlY2ltYWxBZGp1c3QodHlwZSwgdmFsdWUsIGV4cCkge1xyXG4gICAgLy8gSWYgdGhlIGV4cCBpcyB1bmRlZmluZWQgb3IgemVyby4uLlxyXG4gICAgaWYgKHR5cGVvZiBleHAgPT09ICd1bmRlZmluZWQnIHx8ICtleHAgPT09IDApIHtcclxuICAgICAgcmV0dXJuIE1hdGhbdHlwZV0odmFsdWUpO1xyXG4gICAgfVxyXG4gICAgdmFsdWUgPSArdmFsdWU7XHJcbiAgICBleHAgPSArZXhwO1xyXG4gICAgLy8gSWYgdGhlIHZhbHVlIGlzIG5vdCBhIG51bWJlciBvciB0aGUgZXhwIGlzIG5vdCBhbiBpbnRlZ2VyLi4uXHJcbiAgICBpZiAoaXNOYU4odmFsdWUpIHx8ICEodHlwZW9mIGV4cCA9PT0gJ251bWJlcicgJiYgZXhwICUgMSA9PT0gMCkpIHtcclxuICAgICAgcmV0dXJuIE5hTjtcclxuICAgIH1cclxuICAgIC8vIFNoaWZ0XHJcbiAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJ2UnKTtcclxuICAgIHZhbHVlID0gTWF0aFt0eXBlXSgrKHZhbHVlWzBdICsgJ2UnICsgKHZhbHVlWzFdID8gKCt2YWx1ZVsxXSAtIGV4cCkgOiAtZXhwKSkpO1xyXG4gICAgLy8gU2hpZnQgYmFja1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnNwbGl0KCdlJyk7XHJcbiAgICByZXR1cm4gKyh2YWx1ZVswXSArICdlJyArICh2YWx1ZVsxXSA/ICgrdmFsdWVbMV0gKyBleHApIDogZXhwKSk7XHJcbiAgfVxyXG5cclxuICAvLyBEZWNpbWFsIHJvdW5kXHJcbiAgaWYgKCFNYXRoLnJvdW5kMTApIHtcclxuICAgIE1hdGgucm91bmQxMCA9IGZ1bmN0aW9uKHZhbHVlLCBleHApIHtcclxuICAgICAgcmV0dXJuIGRlY2ltYWxBZGp1c3QoJ3JvdW5kJywgdmFsdWUsIGV4cCk7XHJcbiAgICB9O1xyXG4gIH1cclxuICAvLyBEZWNpbWFsIGZsb29yXHJcbiAgaWYgKCFNYXRoLmZsb29yMTApIHtcclxuICAgIE1hdGguZmxvb3IxMCA9IGZ1bmN0aW9uKHZhbHVlLCBleHApIHtcclxuICAgICAgcmV0dXJuIGRlY2ltYWxBZGp1c3QoJ2Zsb29yJywgdmFsdWUsIGV4cCk7XHJcbiAgICB9O1xyXG4gIH1cclxuICAvLyBEZWNpbWFsIGNlaWxcclxuICBpZiAoIU1hdGguY2VpbDEwKSB7XHJcbiAgICBNYXRoLmNlaWwxMCA9IGZ1bmN0aW9uKHZhbHVlLCBleHApIHtcclxuICAgICAgcmV0dXJuIGRlY2ltYWxBZGp1c3QoJ2NlaWwnLCB2YWx1ZSwgZXhwKTtcclxuICAgIH07XHJcbiAgfVxyXG59KSgpO1xyXG5cbn0se31dLDM6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyohIHBvbHkydHJpIHYxLjMuNSB8IChjKSAyMDA5LTIwMTQgUG9seTJUcmkgQ29udHJpYnV0b3JzICovXHJcbiFmdW5jdGlvbih0KXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyltb2R1bGUuZXhwb3J0cz10KCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKHQpO2Vsc2V7dmFyIG47XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz9uPXdpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP249Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiYobj1zZWxmKSxuLnBvbHkydHJpPXQoKX19KGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uIHQobixlLGkpe2Z1bmN0aW9uIG8ocyxwKXtpZighZVtzXSl7aWYoIW5bc10pe3ZhciBhPVwiZnVuY3Rpb25cIj09dHlwZW9mIF9kZXJlcV8mJl9kZXJlcV87aWYoIXAmJmEpcmV0dXJuIGEocywhMCk7aWYocilyZXR1cm4gcihzLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK3MrXCInXCIpfXZhciBoPWVbc109e2V4cG9ydHM6e319O25bc11bMF0uY2FsbChoLmV4cG9ydHMsZnVuY3Rpb24odCl7dmFyIGU9bltzXVsxXVt0XTtyZXR1cm4gbyhlP2U6dCl9LGgsaC5leHBvcnRzLHQsbixlLGkpfXJldHVybiBlW3NdLmV4cG9ydHN9Zm9yKHZhciByPVwiZnVuY3Rpb25cIj09dHlwZW9mIF9kZXJlcV8mJl9kZXJlcV8scz0wO3M8aS5sZW5ndGg7cysrKW8oaVtzXSk7cmV0dXJuIG99KHsxOltmdW5jdGlvbih0LG4pe24uZXhwb3J0cz17dmVyc2lvbjpcIjEuMy41XCJ9fSx7fV0sMjpbZnVuY3Rpb24odCxuKXtcInVzZSBzdHJpY3RcIjt2YXIgZT1mdW5jdGlvbih0LG4pe3RoaXMucG9pbnQ9dCx0aGlzLnRyaWFuZ2xlPW58fG51bGwsdGhpcy5uZXh0PW51bGwsdGhpcy5wcmV2PW51bGwsdGhpcy52YWx1ZT10Lnh9LGk9ZnVuY3Rpb24odCxuKXt0aGlzLmhlYWRfPXQsdGhpcy50YWlsXz1uLHRoaXMuc2VhcmNoX25vZGVfPXR9O2kucHJvdG90eXBlLmhlYWQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5oZWFkX30saS5wcm90b3R5cGUuc2V0SGVhZD1mdW5jdGlvbih0KXt0aGlzLmhlYWRfPXR9LGkucHJvdG90eXBlLnRhaWw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50YWlsX30saS5wcm90b3R5cGUuc2V0VGFpbD1mdW5jdGlvbih0KXt0aGlzLnRhaWxfPXR9LGkucHJvdG90eXBlLnNlYXJjaD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnNlYXJjaF9ub2RlX30saS5wcm90b3R5cGUuc2V0U2VhcmNoPWZ1bmN0aW9uKHQpe3RoaXMuc2VhcmNoX25vZGVfPXR9LGkucHJvdG90eXBlLmZpbmRTZWFyY2hOb2RlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc2VhcmNoX25vZGVffSxpLnByb3RvdHlwZS5sb2NhdGVOb2RlPWZ1bmN0aW9uKHQpe3ZhciBuPXRoaXMuc2VhcmNoX25vZGVfO2lmKHQ8bi52YWx1ZSl7Zm9yKDtuPW4ucHJldjspaWYodD49bi52YWx1ZSlyZXR1cm4gdGhpcy5zZWFyY2hfbm9kZV89bixufWVsc2UgZm9yKDtuPW4ubmV4dDspaWYodDxuLnZhbHVlKXJldHVybiB0aGlzLnNlYXJjaF9ub2RlXz1uLnByZXYsbi5wcmV2O3JldHVybiBudWxsfSxpLnByb3RvdHlwZS5sb2NhdGVQb2ludD1mdW5jdGlvbih0KXt2YXIgbj10LngsZT10aGlzLmZpbmRTZWFyY2hOb2RlKG4pLGk9ZS5wb2ludC54O2lmKG49PT1pKXtpZih0IT09ZS5wb2ludClpZih0PT09ZS5wcmV2LnBvaW50KWU9ZS5wcmV2O2Vsc2V7aWYodCE9PWUubmV4dC5wb2ludCl0aHJvdyBuZXcgRXJyb3IoXCJwb2x5MnRyaSBJbnZhbGlkIEFkdmFuY2luZ0Zyb250LmxvY2F0ZVBvaW50KCkgY2FsbFwiKTtlPWUubmV4dH19ZWxzZSBpZihpPm4pZm9yKDsoZT1lLnByZXYpJiZ0IT09ZS5wb2ludDspO2Vsc2UgZm9yKDsoZT1lLm5leHQpJiZ0IT09ZS5wb2ludDspO3JldHVybiBlJiYodGhpcy5zZWFyY2hfbm9kZV89ZSksZX0sbi5leHBvcnRzPWksbi5leHBvcnRzLk5vZGU9ZX0se31dLDM6W2Z1bmN0aW9uKHQsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gZSh0LG4pe2lmKCF0KXRocm93IG5ldyBFcnJvcihufHxcIkFzc2VydCBGYWlsZWRcIil9bi5leHBvcnRzPWV9LHt9XSw0OltmdW5jdGlvbih0LG4pe1widXNlIHN0cmljdFwiO3ZhciBlPXQoXCIuL3h5XCIpLGk9ZnVuY3Rpb24odCxuKXt0aGlzLng9K3R8fDAsdGhpcy55PStufHwwLHRoaXMuX3AydF9lZGdlX2xpc3Q9bnVsbH07aS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gZS50b1N0cmluZ0Jhc2UodGhpcyl9LGkucHJvdG90eXBlLnRvSlNPTj1mdW5jdGlvbigpe3JldHVybnt4OnRoaXMueCx5OnRoaXMueX19LGkucHJvdG90eXBlLmNsb25lPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBpKHRoaXMueCx0aGlzLnkpfSxpLnByb3RvdHlwZS5zZXRfemVybz1mdW5jdGlvbigpe3JldHVybiB0aGlzLng9MCx0aGlzLnk9MCx0aGlzfSxpLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdGhpcy54PSt0fHwwLHRoaXMueT0rbnx8MCx0aGlzfSxpLnByb3RvdHlwZS5uZWdhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy54PS10aGlzLngsdGhpcy55PS10aGlzLnksdGhpc30saS5wcm90b3R5cGUuYWRkPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLngrPXQueCx0aGlzLnkrPXQueSx0aGlzfSxpLnByb3RvdHlwZS5zdWI9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMueC09dC54LHRoaXMueS09dC55LHRoaXN9LGkucHJvdG90eXBlLm11bD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy54Kj10LHRoaXMueSo9dCx0aGlzfSxpLnByb3RvdHlwZS5sZW5ndGg9ZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCp0aGlzLngrdGhpcy55KnRoaXMueSl9LGkucHJvdG90eXBlLm5vcm1hbGl6ZT1mdW5jdGlvbigpe3ZhciB0PXRoaXMubGVuZ3RoKCk7cmV0dXJuIHRoaXMueC89dCx0aGlzLnkvPXQsdH0saS5wcm90b3R5cGUuZXF1YWxzPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLng9PT10LngmJnRoaXMueT09PXQueX0saS5uZWdhdGU9ZnVuY3Rpb24odCl7cmV0dXJuIG5ldyBpKC10LngsLXQueSl9LGkuYWRkPWZ1bmN0aW9uKHQsbil7cmV0dXJuIG5ldyBpKHQueCtuLngsdC55K24ueSl9LGkuc3ViPWZ1bmN0aW9uKHQsbil7cmV0dXJuIG5ldyBpKHQueC1uLngsdC55LW4ueSl9LGkubXVsPWZ1bmN0aW9uKHQsbil7cmV0dXJuIG5ldyBpKHQqbi54LHQqbi55KX0saS5jcm9zcz1mdW5jdGlvbih0LG4pe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiB0P1wibnVtYmVyXCI9PXR5cGVvZiBuP3QqbjpuZXcgaSgtdCpuLnksdCpuLngpOlwibnVtYmVyXCI9PXR5cGVvZiBuP25ldyBpKG4qdC55LC1uKnQueCk6dC54Km4ueS10Lnkqbi54fSxpLnRvU3RyaW5nPWUudG9TdHJpbmcsaS5jb21wYXJlPWUuY29tcGFyZSxpLmNtcD1lLmNvbXBhcmUsaS5lcXVhbHM9ZS5lcXVhbHMsaS5kb3Q9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdC54Km4ueCt0Lnkqbi55fSxuLmV4cG9ydHM9aX0se1wiLi94eVwiOjExfV0sNTpbZnVuY3Rpb24odCxuKXtcInVzZSBzdHJpY3RcIjt2YXIgZT10KFwiLi94eVwiKSxpPWZ1bmN0aW9uKHQsbil7dGhpcy5uYW1lPVwiUG9pbnRFcnJvclwiLHRoaXMucG9pbnRzPW49bnx8W10sdGhpcy5tZXNzYWdlPXR8fFwiSW52YWxpZCBQb2ludHMhXCI7Zm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspdGhpcy5tZXNzYWdlKz1cIiBcIitlLnRvU3RyaW5nKG5baV0pfTtpLnByb3RvdHlwZT1uZXcgRXJyb3IsaS5wcm90b3R5cGUuY29uc3RydWN0b3I9aSxuLmV4cG9ydHM9aX0se1wiLi94eVwiOjExfV0sNjpbZnVuY3Rpb24odCxuLGUpeyhmdW5jdGlvbihuKXtcInVzZSBzdHJpY3RcIjt2YXIgaT1uLnBvbHkydHJpO2Uubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBuLnBvbHkydHJpPWksZX0sZS5WRVJTSU9OPXQoXCIuLi9kaXN0L3ZlcnNpb24uanNvblwiKS52ZXJzaW9uLGUuUG9pbnRFcnJvcj10KFwiLi9wb2ludGVycm9yXCIpLGUuUG9pbnQ9dChcIi4vcG9pbnRcIiksZS5UcmlhbmdsZT10KFwiLi90cmlhbmdsZVwiKSxlLlN3ZWVwQ29udGV4dD10KFwiLi9zd2VlcGNvbnRleHRcIik7dmFyIG89dChcIi4vc3dlZXBcIik7ZS50cmlhbmd1bGF0ZT1vLnRyaWFuZ3VsYXRlLGUuc3dlZXA9e1RyaWFuZ3VsYXRlOm8udHJpYW5ndWxhdGV9fSkuY2FsbCh0aGlzLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6e30pfSx7XCIuLi9kaXN0L3ZlcnNpb24uanNvblwiOjEsXCIuL3BvaW50XCI6NCxcIi4vcG9pbnRlcnJvclwiOjUsXCIuL3N3ZWVwXCI6NyxcIi4vc3dlZXBjb250ZXh0XCI6OCxcIi4vdHJpYW5nbGVcIjo5fV0sNzpbZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCl7dC5pbml0VHJpYW5ndWxhdGlvbigpLHQuY3JlYXRlQWR2YW5jaW5nRnJvbnQoKSxvKHQpLHIodCl9ZnVuY3Rpb24gbyh0KXt2YXIgbixlPXQucG9pbnRDb3VudCgpO2ZvcihuPTE7ZT5uOysrbilmb3IodmFyIGk9dC5nZXRQb2ludChuKSxvPXModCxpKSxyPWkuX3AydF9lZGdlX2xpc3QsYT0wO3ImJmE8ci5sZW5ndGg7KythKXAodCxyW2FdLG8pfWZ1bmN0aW9uIHIodCl7Zm9yKHZhciBuPXQuZnJvbnQoKS5oZWFkKCkubmV4dC50cmlhbmdsZSxlPXQuZnJvbnQoKS5oZWFkKCkubmV4dC5wb2ludDshbi5nZXRDb25zdHJhaW5lZEVkZ2VDVyhlKTspbj1uLm5laWdoYm9yQ0NXKGUpO3QubWVzaENsZWFuKG4pfWZ1bmN0aW9uIHModCxuKXt2YXIgZT10LmxvY2F0ZU5vZGUobiksaT11KHQsbixlKTtyZXR1cm4gbi54PD1lLnBvaW50LngrRiYmZCh0LGUpLGcodCxpKSxpfWZ1bmN0aW9uIHAodCxuLGUpe3QuZWRnZV9ldmVudC5jb25zdHJhaW5lZF9lZGdlPW4sdC5lZGdlX2V2ZW50LnJpZ2h0PW4ucC54Pm4ucS54LGgoZS50cmlhbmdsZSxuLnAsbi5xKXx8KEModCxuLGUpLGEodCxuLnAsbi5xLGUudHJpYW5nbGUsbi5xKSl9ZnVuY3Rpb24gYSh0LG4sZSxpLG8pe2lmKCFoKGksbixlKSl7dmFyIHI9aS5wb2ludENDVyhvKSxzPXooZSxyLG4pO2lmKHM9PT1NLkNPTExJTkVBUil0aHJvdyBuZXcgRChcInBvbHkydHJpIEVkZ2VFdmVudDogQ29sbGluZWFyIG5vdCBzdXBwb3J0ZWQhXCIsW2UscixuXSk7dmFyIHA9aS5wb2ludENXKG8pLHU9eihlLHAsbik7aWYodT09PU0uQ09MTElORUFSKXRocm93IG5ldyBEKFwicG9seTJ0cmkgRWRnZUV2ZW50OiBDb2xsaW5lYXIgbm90IHN1cHBvcnRlZCFcIixbZSxwLG5dKTtzPT09dT8oaT1zPT09TS5DVz9pLm5laWdoYm9yQ0NXKG8pOmkubmVpZ2hib3JDVyhvKSxhKHQsbixlLGksbykpOnEodCxuLGUsaSxvKX19ZnVuY3Rpb24gaCh0LG4sZSl7dmFyIGk9dC5lZGdlSW5kZXgobixlKTtpZigtMSE9PWkpe3QubWFya0NvbnN0cmFpbmVkRWRnZUJ5SW5kZXgoaSk7dmFyIG89dC5nZXROZWlnaGJvcihpKTtyZXR1cm4gbyYmby5tYXJrQ29uc3RyYWluZWRFZGdlQnlQb2ludHMobixlKSwhMH1yZXR1cm4hMX1mdW5jdGlvbiB1KHQsbixlKXt2YXIgaT1uZXcgTyhuLGUucG9pbnQsZS5uZXh0LnBvaW50KTtpLm1hcmtOZWlnaGJvcihlLnRyaWFuZ2xlKSx0LmFkZFRvTWFwKGkpO3ZhciBvPW5ldyBCKG4pO3JldHVybiBvLm5leHQ9ZS5uZXh0LG8ucHJldj1lLGUubmV4dC5wcmV2PW8sZS5uZXh0PW8sbCh0LGkpfHx0Lm1hcFRyaWFuZ2xlVG9Ob2RlcyhpKSxvfWZ1bmN0aW9uIGQodCxuKXt2YXIgZT1uZXcgTyhuLnByZXYucG9pbnQsbi5wb2ludCxuLm5leHQucG9pbnQpO2UubWFya05laWdoYm9yKG4ucHJldi50cmlhbmdsZSksZS5tYXJrTmVpZ2hib3Iobi50cmlhbmdsZSksdC5hZGRUb01hcChlKSxuLnByZXYubmV4dD1uLm5leHQsbi5uZXh0LnByZXY9bi5wcmV2LGwodCxlKXx8dC5tYXBUcmlhbmdsZVRvTm9kZXMoZSl9ZnVuY3Rpb24gZyh0LG4pe2Zvcih2YXIgZT1uLm5leHQ7ZS5uZXh0JiYhaihlLnBvaW50LGUubmV4dC5wb2ludCxlLnByZXYucG9pbnQpOylkKHQsZSksZT1lLm5leHQ7Zm9yKGU9bi5wcmV2O2UucHJldiYmIWooZS5wb2ludCxlLm5leHQucG9pbnQsZS5wcmV2LnBvaW50KTspZCh0LGUpLGU9ZS5wcmV2O24ubmV4dCYmbi5uZXh0Lm5leHQmJmYobikmJnkodCxuKX1mdW5jdGlvbiBmKHQpe3ZhciBuPXQucG9pbnQueC10Lm5leHQubmV4dC5wb2ludC54LGU9dC5wb2ludC55LXQubmV4dC5uZXh0LnBvaW50Lnk7cmV0dXJuIFMoZT49MCxcInVub3JkZXJlZCB5XCIpLG4+PTB8fE1hdGguYWJzKG4pPGV9ZnVuY3Rpb24gbCh0LG4pe2Zvcih2YXIgZT0wOzM+ZTsrK2UpaWYoIW4uZGVsYXVuYXlfZWRnZVtlXSl7dmFyIGk9bi5nZXROZWlnaGJvcihlKTtpZihpKXt2YXIgbz1uLmdldFBvaW50KGUpLHI9aS5vcHBvc2l0ZVBvaW50KG4sbykscz1pLmluZGV4KHIpO2lmKGkuY29uc3RyYWluZWRfZWRnZVtzXXx8aS5kZWxhdW5heV9lZGdlW3NdKXtuLmNvbnN0cmFpbmVkX2VkZ2VbZV09aS5jb25zdHJhaW5lZF9lZGdlW3NdO2NvbnRpbnVlfXZhciBwPWMobyxuLnBvaW50Q0NXKG8pLG4ucG9pbnRDVyhvKSxyKTtpZihwKXtuLmRlbGF1bmF5X2VkZ2VbZV09ITAsaS5kZWxhdW5heV9lZGdlW3NdPSEwLF8obixvLGkscik7dmFyIGE9IWwodCxuKTtyZXR1cm4gYSYmdC5tYXBUcmlhbmdsZVRvTm9kZXMobiksYT0hbCh0LGkpLGEmJnQubWFwVHJpYW5nbGVUb05vZGVzKGkpLG4uZGVsYXVuYXlfZWRnZVtlXT0hMSxpLmRlbGF1bmF5X2VkZ2Vbc109ITEsITB9fX1yZXR1cm4hMX1mdW5jdGlvbiBjKHQsbixlLGkpe3ZhciBvPXQueC1pLngscj10LnktaS55LHM9bi54LWkueCxwPW4ueS1pLnksYT1vKnAsaD1zKnIsdT1hLWg7aWYoMD49dSlyZXR1cm4hMTt2YXIgZD1lLngtaS54LGc9ZS55LWkueSxmPWQqcixsPW8qZyxjPWYtbDtpZigwPj1jKXJldHVybiExO3ZhciBfPXMqZyx5PWQqcCx4PW8qbytyKnIsdj1zKnMrcCpwLEM9ZCpkK2cqZyxiPXgqKF8teSkrdipjK0MqdTtyZXR1cm4gYj4wfWZ1bmN0aW9uIF8odCxuLGUsaSl7dmFyIG8scixzLHA7bz10Lm5laWdoYm9yQ0NXKG4pLHI9dC5uZWlnaGJvckNXKG4pLHM9ZS5uZWlnaGJvckNDVyhpKSxwPWUubmVpZ2hib3JDVyhpKTt2YXIgYSxoLHUsZDthPXQuZ2V0Q29uc3RyYWluZWRFZGdlQ0NXKG4pLGg9dC5nZXRDb25zdHJhaW5lZEVkZ2VDVyhuKSx1PWUuZ2V0Q29uc3RyYWluZWRFZGdlQ0NXKGkpLGQ9ZS5nZXRDb25zdHJhaW5lZEVkZ2VDVyhpKTt2YXIgZyxmLGwsYztnPXQuZ2V0RGVsYXVuYXlFZGdlQ0NXKG4pLGY9dC5nZXREZWxhdW5heUVkZ2VDVyhuKSxsPWUuZ2V0RGVsYXVuYXlFZGdlQ0NXKGkpLGM9ZS5nZXREZWxhdW5heUVkZ2VDVyhpKSx0LmxlZ2FsaXplKG4saSksZS5sZWdhbGl6ZShpLG4pLGUuc2V0RGVsYXVuYXlFZGdlQ0NXKG4sZyksdC5zZXREZWxhdW5heUVkZ2VDVyhuLGYpLHQuc2V0RGVsYXVuYXlFZGdlQ0NXKGksbCksZS5zZXREZWxhdW5heUVkZ2VDVyhpLGMpLGUuc2V0Q29uc3RyYWluZWRFZGdlQ0NXKG4sYSksdC5zZXRDb25zdHJhaW5lZEVkZ2VDVyhuLGgpLHQuc2V0Q29uc3RyYWluZWRFZGdlQ0NXKGksdSksZS5zZXRDb25zdHJhaW5lZEVkZ2VDVyhpLGQpLHQuY2xlYXJOZWlnaGJvcnMoKSxlLmNsZWFyTmVpZ2hib3JzKCksbyYmZS5tYXJrTmVpZ2hib3IobyksciYmdC5tYXJrTmVpZ2hib3IocikscyYmdC5tYXJrTmVpZ2hib3IocykscCYmZS5tYXJrTmVpZ2hib3IocCksdC5tYXJrTmVpZ2hib3IoZSl9ZnVuY3Rpb24geSh0LG4pe2Zvcih0LmJhc2luLmxlZnRfbm9kZT16KG4ucG9pbnQsbi5uZXh0LnBvaW50LG4ubmV4dC5uZXh0LnBvaW50KT09PU0uQ0NXP24ubmV4dC5uZXh0Om4ubmV4dCx0LmJhc2luLmJvdHRvbV9ub2RlPXQuYmFzaW4ubGVmdF9ub2RlO3QuYmFzaW4uYm90dG9tX25vZGUubmV4dCYmdC5iYXNpbi5ib3R0b21fbm9kZS5wb2ludC55Pj10LmJhc2luLmJvdHRvbV9ub2RlLm5leHQucG9pbnQueTspdC5iYXNpbi5ib3R0b21fbm9kZT10LmJhc2luLmJvdHRvbV9ub2RlLm5leHQ7aWYodC5iYXNpbi5ib3R0b21fbm9kZSE9PXQuYmFzaW4ubGVmdF9ub2RlKXtmb3IodC5iYXNpbi5yaWdodF9ub2RlPXQuYmFzaW4uYm90dG9tX25vZGU7dC5iYXNpbi5yaWdodF9ub2RlLm5leHQmJnQuYmFzaW4ucmlnaHRfbm9kZS5wb2ludC55PHQuYmFzaW4ucmlnaHRfbm9kZS5uZXh0LnBvaW50Lnk7KXQuYmFzaW4ucmlnaHRfbm9kZT10LmJhc2luLnJpZ2h0X25vZGUubmV4dDt0LmJhc2luLnJpZ2h0X25vZGUhPT10LmJhc2luLmJvdHRvbV9ub2RlJiYodC5iYXNpbi53aWR0aD10LmJhc2luLnJpZ2h0X25vZGUucG9pbnQueC10LmJhc2luLmxlZnRfbm9kZS5wb2ludC54LHQuYmFzaW4ubGVmdF9oaWdoZXN0PXQuYmFzaW4ubGVmdF9ub2RlLnBvaW50Lnk+dC5iYXNpbi5yaWdodF9ub2RlLnBvaW50LnkseCh0LHQuYmFzaW4uYm90dG9tX25vZGUpKX19ZnVuY3Rpb24geCh0LG4pe2lmKCF2KHQsbikpe2QodCxuKTt2YXIgZTtpZihuLnByZXYhPT10LmJhc2luLmxlZnRfbm9kZXx8bi5uZXh0IT09dC5iYXNpbi5yaWdodF9ub2RlKXtpZihuLnByZXY9PT10LmJhc2luLmxlZnRfbm9kZSl7aWYoZT16KG4ucG9pbnQsbi5uZXh0LnBvaW50LG4ubmV4dC5uZXh0LnBvaW50KSxlPT09TS5DVylyZXR1cm47bj1uLm5leHR9ZWxzZSBpZihuLm5leHQ9PT10LmJhc2luLnJpZ2h0X25vZGUpe2lmKGU9eihuLnBvaW50LG4ucHJldi5wb2ludCxuLnByZXYucHJldi5wb2ludCksZT09PU0uQ0NXKXJldHVybjtuPW4ucHJldn1lbHNlIG49bi5wcmV2LnBvaW50Lnk8bi5uZXh0LnBvaW50Lnk/bi5wcmV2Om4ubmV4dDt4KHQsbil9fX1mdW5jdGlvbiB2KHQsbil7dmFyIGU7cmV0dXJuIGU9dC5iYXNpbi5sZWZ0X2hpZ2hlc3Q/dC5iYXNpbi5sZWZ0X25vZGUucG9pbnQueS1uLnBvaW50Lnk6dC5iYXNpbi5yaWdodF9ub2RlLnBvaW50Lnktbi5wb2ludC55LHQuYmFzaW4ud2lkdGg+ZT8hMDohMX1mdW5jdGlvbiBDKHQsbixlKXt0LmVkZ2VfZXZlbnQucmlnaHQ/Yih0LG4sZSk6RSh0LG4sZSl9ZnVuY3Rpb24gYih0LG4sZSl7Zm9yKDtlLm5leHQucG9pbnQueDxuLnAueDspeihuLnEsZS5uZXh0LnBvaW50LG4ucCk9PT1NLkNDVz9tKHQsbixlKTplPWUubmV4dH1mdW5jdGlvbiBtKHQsbixlKXtlLnBvaW50Lng8bi5wLngmJih6KGUucG9pbnQsZS5uZXh0LnBvaW50LGUubmV4dC5uZXh0LnBvaW50KT09PU0uQ0NXP1codCxuLGUpOih3KHQsbixlKSxtKHQsbixlKSkpfWZ1bmN0aW9uIFcodCxuLGUpe2QodCxlLm5leHQpLGUubmV4dC5wb2ludCE9PW4ucCYmeihuLnEsZS5uZXh0LnBvaW50LG4ucCk9PT1NLkNDVyYmeihlLnBvaW50LGUubmV4dC5wb2ludCxlLm5leHQubmV4dC5wb2ludCk9PT1NLkNDVyYmVyh0LG4sZSl9ZnVuY3Rpb24gdyh0LG4sZSl7eihlLm5leHQucG9pbnQsZS5uZXh0Lm5leHQucG9pbnQsZS5uZXh0Lm5leHQubmV4dC5wb2ludCk9PT1NLkNDVz9XKHQsbixlLm5leHQpOnoobi5xLGUubmV4dC5uZXh0LnBvaW50LG4ucCk9PT1NLkNDVyYmdyh0LG4sZS5uZXh0KX1mdW5jdGlvbiBFKHQsbixlKXtmb3IoO2UucHJldi5wb2ludC54Pm4ucC54Oyl6KG4ucSxlLnByZXYucG9pbnQsbi5wKT09PU0uQ1c/UCh0LG4sZSk6ZT1lLnByZXZ9ZnVuY3Rpb24gUCh0LG4sZSl7ZS5wb2ludC54Pm4ucC54JiYoeihlLnBvaW50LGUucHJldi5wb2ludCxlLnByZXYucHJldi5wb2ludCk9PT1NLkNXP1QodCxuLGUpOihOKHQsbixlKSxQKHQsbixlKSkpfWZ1bmN0aW9uIE4odCxuLGUpe3ooZS5wcmV2LnBvaW50LGUucHJldi5wcmV2LnBvaW50LGUucHJldi5wcmV2LnByZXYucG9pbnQpPT09TS5DVz9UKHQsbixlLnByZXYpOnoobi5xLGUucHJldi5wcmV2LnBvaW50LG4ucCk9PT1NLkNXJiZOKHQsbixlLnByZXYpfWZ1bmN0aW9uIFQodCxuLGUpe2QodCxlLnByZXYpLGUucHJldi5wb2ludCE9PW4ucCYmeihuLnEsZS5wcmV2LnBvaW50LG4ucCk9PT1NLkNXJiZ6KGUucG9pbnQsZS5wcmV2LnBvaW50LGUucHJldi5wcmV2LnBvaW50KT09PU0uQ1cmJlQodCxuLGUpfWZ1bmN0aW9uIHEodCxuLGUsaSxvKXt2YXIgcj1pLm5laWdoYm9yQWNyb3NzKG8pO1MocixcIkZMSVAgZmFpbGVkIGR1ZSB0byBtaXNzaW5nIHRyaWFuZ2xlIVwiKTt2YXIgcz1yLm9wcG9zaXRlUG9pbnQoaSxvKTtpZihpLmdldENvbnN0cmFpbmVkRWRnZUFjcm9zcyhvKSl7dmFyIHA9aS5pbmRleChvKTt0aHJvdyBuZXcgRChcInBvbHkydHJpIEludGVyc2VjdGluZyBDb25zdHJhaW50c1wiLFtvLHMsaS5nZXRQb2ludCgocCsxKSUzKSxpLmdldFBvaW50KChwKzIpJTMpXSl9aWYoSChvLGkucG9pbnRDQ1cobyksaS5wb2ludENXKG8pLHMpKWlmKF8oaSxvLHIscyksdC5tYXBUcmlhbmdsZVRvTm9kZXMoaSksdC5tYXBUcmlhbmdsZVRvTm9kZXMociksbz09PWUmJnM9PT1uKWU9PT10LmVkZ2VfZXZlbnQuY29uc3RyYWluZWRfZWRnZS5xJiZuPT09dC5lZGdlX2V2ZW50LmNvbnN0cmFpbmVkX2VkZ2UucCYmKGkubWFya0NvbnN0cmFpbmVkRWRnZUJ5UG9pbnRzKG4sZSksci5tYXJrQ29uc3RyYWluZWRFZGdlQnlQb2ludHMobixlKSxsKHQsaSksbCh0LHIpKTtlbHNle3ZhciBoPXooZSxzLG4pO2k9SSh0LGgsaSxyLG8scykscSh0LG4sZSxpLG8pfWVsc2V7dmFyIHU9ayhuLGUscixzKTtBKHQsbixlLGkscix1KSxhKHQsbixlLGksbyl9fWZ1bmN0aW9uIEkodCxuLGUsaSxvLHIpe3ZhciBzO3JldHVybiBuPT09TS5DQ1c/KHM9aS5lZGdlSW5kZXgobyxyKSxpLmRlbGF1bmF5X2VkZ2Vbc109ITAsbCh0LGkpLGkuY2xlYXJEZWxhdW5heUVkZ2VzKCksZSk6KHM9ZS5lZGdlSW5kZXgobyxyKSxlLmRlbGF1bmF5X2VkZ2Vbc109ITAsbCh0LGUpLGUuY2xlYXJEZWxhdW5heUVkZ2VzKCksaSl9ZnVuY3Rpb24gayh0LG4sZSxpKXt2YXIgbz16KG4saSx0KTtpZihvPT09TS5DVylyZXR1cm4gZS5wb2ludENDVyhpKTtpZihvPT09TS5DQ1cpcmV0dXJuIGUucG9pbnRDVyhpKTt0aHJvdyBuZXcgRChcInBvbHkydHJpIFtVbnN1cHBvcnRlZF0gbmV4dEZsaXBQb2ludDogb3Bwb3NpbmcgcG9pbnQgb24gY29uc3RyYWluZWQgZWRnZSFcIixbbixpLHRdKX1mdW5jdGlvbiBBKHQsbixlLGksbyxyKXt2YXIgcz1vLm5laWdoYm9yQWNyb3NzKHIpO1MocyxcIkZMSVAgZmFpbGVkIGR1ZSB0byBtaXNzaW5nIHRyaWFuZ2xlXCIpO3ZhciBwPXMub3Bwb3NpdGVQb2ludChvLHIpO2lmKEgoZSxpLnBvaW50Q0NXKGUpLGkucG9pbnRDVyhlKSxwKSlxKHQsZSxwLHMscCk7ZWxzZXt2YXIgYT1rKG4sZSxzLHApO0EodCxuLGUsaSxzLGEpfX12YXIgUz10KFwiLi9hc3NlcnRcIiksRD10KFwiLi9wb2ludGVycm9yXCIpLE89dChcIi4vdHJpYW5nbGVcIiksQj10KFwiLi9hZHZhbmNpbmdmcm9udFwiKS5Ob2RlLEw9dChcIi4vdXRpbHNcIiksRj1MLkVQU0lMT04sTT1MLk9yaWVudGF0aW9uLHo9TC5vcmllbnQyZCxIPUwuaW5TY2FuQXJlYSxqPUwuaXNBbmdsZU9idHVzZTtlLnRyaWFuZ3VsYXRlPWl9LHtcIi4vYWR2YW5jaW5nZnJvbnRcIjoyLFwiLi9hc3NlcnRcIjozLFwiLi9wb2ludGVycm9yXCI6NSxcIi4vdHJpYW5nbGVcIjo5LFwiLi91dGlsc1wiOjEwfV0sODpbZnVuY3Rpb24odCxuKXtcInVzZSBzdHJpY3RcIjt2YXIgZT10KFwiLi9wb2ludGVycm9yXCIpLGk9dChcIi4vcG9pbnRcIiksbz10KFwiLi90cmlhbmdsZVwiKSxyPXQoXCIuL3N3ZWVwXCIpLHM9dChcIi4vYWR2YW5jaW5nZnJvbnRcIikscD1zLk5vZGUsYT0uMyxoPWZ1bmN0aW9uKHQsbil7aWYodGhpcy5wPXQsdGhpcy5xPW4sdC55Pm4ueSl0aGlzLnE9dCx0aGlzLnA9bjtlbHNlIGlmKHQueT09PW4ueSlpZih0Lng+bi54KXRoaXMucT10LHRoaXMucD1uO2Vsc2UgaWYodC54PT09bi54KXRocm93IG5ldyBlKFwicG9seTJ0cmkgSW52YWxpZCBFZGdlIGNvbnN0cnVjdG9yOiByZXBlYXRlZCBwb2ludHMhXCIsW3RdKTt0aGlzLnEuX3AydF9lZGdlX2xpc3R8fCh0aGlzLnEuX3AydF9lZGdlX2xpc3Q9W10pLHRoaXMucS5fcDJ0X2VkZ2VfbGlzdC5wdXNoKHRoaXMpfSx1PWZ1bmN0aW9uKCl7dGhpcy5sZWZ0X25vZGU9bnVsbCx0aGlzLmJvdHRvbV9ub2RlPW51bGwsdGhpcy5yaWdodF9ub2RlPW51bGwsdGhpcy53aWR0aD0wLHRoaXMubGVmdF9oaWdoZXN0PSExfTt1LnByb3RvdHlwZS5jbGVhcj1mdW5jdGlvbigpe3RoaXMubGVmdF9ub2RlPW51bGwsdGhpcy5ib3R0b21fbm9kZT1udWxsLHRoaXMucmlnaHRfbm9kZT1udWxsLHRoaXMud2lkdGg9MCx0aGlzLmxlZnRfaGlnaGVzdD0hMX07dmFyIGQ9ZnVuY3Rpb24oKXt0aGlzLmNvbnN0cmFpbmVkX2VkZ2U9bnVsbCx0aGlzLnJpZ2h0PSExfSxnPWZ1bmN0aW9uKHQsbil7bj1ufHx7fSx0aGlzLnRyaWFuZ2xlc189W10sdGhpcy5tYXBfPVtdLHRoaXMucG9pbnRzXz1uLmNsb25lQXJyYXlzP3Quc2xpY2UoMCk6dCx0aGlzLmVkZ2VfbGlzdD1bXSx0aGlzLnBtaW5fPXRoaXMucG1heF89bnVsbCx0aGlzLmZyb250Xz1udWxsLHRoaXMuaGVhZF89bnVsbCx0aGlzLnRhaWxfPW51bGwsdGhpcy5hZl9oZWFkXz1udWxsLHRoaXMuYWZfbWlkZGxlXz1udWxsLHRoaXMuYWZfdGFpbF89bnVsbCx0aGlzLmJhc2luPW5ldyB1LHRoaXMuZWRnZV9ldmVudD1uZXcgZCx0aGlzLmluaXRFZGdlcyh0aGlzLnBvaW50c18pfTtnLnByb3RvdHlwZS5hZGRIb2xlPWZ1bmN0aW9uKHQpe3RoaXMuaW5pdEVkZ2VzKHQpO3ZhciBuLGU9dC5sZW5ndGg7Zm9yKG49MDtlPm47bisrKXRoaXMucG9pbnRzXy5wdXNoKHRbbl0pO3JldHVybiB0aGlzfSxnLnByb3RvdHlwZS5BZGRIb2xlPWcucHJvdG90eXBlLmFkZEhvbGUsZy5wcm90b3R5cGUuYWRkSG9sZXM9ZnVuY3Rpb24odCl7dmFyIG4sZT10Lmxlbmd0aDtmb3Iobj0wO2U+bjtuKyspdGhpcy5pbml0RWRnZXModFtuXSk7cmV0dXJuIHRoaXMucG9pbnRzXz10aGlzLnBvaW50c18uY29uY2F0LmFwcGx5KHRoaXMucG9pbnRzXyx0KSx0aGlzfSxnLnByb3RvdHlwZS5hZGRQb2ludD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5wb2ludHNfLnB1c2godCksdGhpc30sZy5wcm90b3R5cGUuQWRkUG9pbnQ9Zy5wcm90b3R5cGUuYWRkUG9pbnQsZy5wcm90b3R5cGUuYWRkUG9pbnRzPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLnBvaW50c189dGhpcy5wb2ludHNfLmNvbmNhdCh0KSx0aGlzfSxnLnByb3RvdHlwZS50cmlhbmd1bGF0ZT1mdW5jdGlvbigpe3JldHVybiByLnRyaWFuZ3VsYXRlKHRoaXMpLHRoaXN9LGcucHJvdG90eXBlLmdldEJvdW5kaW5nQm94PWZ1bmN0aW9uKCl7cmV0dXJue21pbjp0aGlzLnBtaW5fLG1heDp0aGlzLnBtYXhffX0sZy5wcm90b3R5cGUuZ2V0VHJpYW5nbGVzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudHJpYW5nbGVzX30sZy5wcm90b3R5cGUuR2V0VHJpYW5nbGVzPWcucHJvdG90eXBlLmdldFRyaWFuZ2xlcyxnLnByb3RvdHlwZS5mcm9udD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmZyb250X30sZy5wcm90b3R5cGUucG9pbnRDb3VudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBvaW50c18ubGVuZ3RofSxnLnByb3RvdHlwZS5oZWFkPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaGVhZF99LGcucHJvdG90eXBlLnNldEhlYWQ9ZnVuY3Rpb24odCl7dGhpcy5oZWFkXz10fSxnLnByb3RvdHlwZS50YWlsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGFpbF99LGcucHJvdG90eXBlLnNldFRhaWw9ZnVuY3Rpb24odCl7dGhpcy50YWlsXz10fSxnLnByb3RvdHlwZS5nZXRNYXA9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tYXBffSxnLnByb3RvdHlwZS5pbml0VHJpYW5ndWxhdGlvbj1mdW5jdGlvbigpe3ZhciB0LG49dGhpcy5wb2ludHNfWzBdLngsZT10aGlzLnBvaW50c19bMF0ueCxvPXRoaXMucG9pbnRzX1swXS55LHI9dGhpcy5wb2ludHNfWzBdLnkscz10aGlzLnBvaW50c18ubGVuZ3RoO2Zvcih0PTE7cz50O3QrKyl7dmFyIHA9dGhpcy5wb2ludHNfW3RdO3AueD5uJiYobj1wLngpLHAueDxlJiYoZT1wLngpLHAueT5vJiYobz1wLnkpLHAueTxyJiYocj1wLnkpfXRoaXMucG1pbl89bmV3IGkoZSxyKSx0aGlzLnBtYXhfPW5ldyBpKG4sbyk7dmFyIGg9YSoobi1lKSx1PWEqKG8tcik7dGhpcy5oZWFkXz1uZXcgaShuK2gsci11KSx0aGlzLnRhaWxfPW5ldyBpKGUtaCxyLXUpLHRoaXMucG9pbnRzXy5zb3J0KGkuY29tcGFyZSl9LGcucHJvdG90eXBlLmluaXRFZGdlcz1mdW5jdGlvbih0KXt2YXIgbixlPXQubGVuZ3RoO2ZvcihuPTA7ZT5uOysrbil0aGlzLmVkZ2VfbGlzdC5wdXNoKG5ldyBoKHRbbl0sdFsobisxKSVlXSkpfSxnLnByb3RvdHlwZS5nZXRQb2ludD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5wb2ludHNfW3RdfSxnLnByb3RvdHlwZS5hZGRUb01hcD1mdW5jdGlvbih0KXt0aGlzLm1hcF8ucHVzaCh0KX0sZy5wcm90b3R5cGUubG9jYXRlTm9kZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5mcm9udF8ubG9jYXRlTm9kZSh0LngpfSxnLnByb3RvdHlwZS5jcmVhdGVBZHZhbmNpbmdGcm9udD1mdW5jdGlvbigpe3ZhciB0LG4sZSxpPW5ldyBvKHRoaXMucG9pbnRzX1swXSx0aGlzLnRhaWxfLHRoaXMuaGVhZF8pO3RoaXMubWFwXy5wdXNoKGkpLHQ9bmV3IHAoaS5nZXRQb2ludCgxKSxpKSxuPW5ldyBwKGkuZ2V0UG9pbnQoMCksaSksZT1uZXcgcChpLmdldFBvaW50KDIpKSx0aGlzLmZyb250Xz1uZXcgcyh0LGUpLHQubmV4dD1uLG4ubmV4dD1lLG4ucHJldj10LGUucHJldj1ufSxnLnByb3RvdHlwZS5yZW1vdmVOb2RlPWZ1bmN0aW9uKCl7fSxnLnByb3RvdHlwZS5tYXBUcmlhbmdsZVRvTm9kZXM9ZnVuY3Rpb24odCl7Zm9yKHZhciBuPTA7Mz5uOysrbilpZighdC5nZXROZWlnaGJvcihuKSl7dmFyIGU9dGhpcy5mcm9udF8ubG9jYXRlUG9pbnQodC5wb2ludENXKHQuZ2V0UG9pbnQobikpKTtlJiYoZS50cmlhbmdsZT10KX19LGcucHJvdG90eXBlLnJlbW92ZUZyb21NYXA9ZnVuY3Rpb24odCl7dmFyIG4sZT10aGlzLm1hcF8saT1lLmxlbmd0aDtmb3Iobj0wO2k+bjtuKyspaWYoZVtuXT09PXQpe2Uuc3BsaWNlKG4sMSk7YnJlYWt9fSxnLnByb3RvdHlwZS5tZXNoQ2xlYW49ZnVuY3Rpb24odCl7Zm9yKHZhciBuLGUsaT1bdF07bj1pLnBvcCgpOylpZighbi5pc0ludGVyaW9yKCkpZm9yKG4uc2V0SW50ZXJpb3IoITApLHRoaXMudHJpYW5nbGVzXy5wdXNoKG4pLGU9MDszPmU7ZSsrKW4uY29uc3RyYWluZWRfZWRnZVtlXXx8aS5wdXNoKG4uZ2V0TmVpZ2hib3IoZSkpfSxuLmV4cG9ydHM9Z30se1wiLi9hZHZhbmNpbmdmcm9udFwiOjIsXCIuL3BvaW50XCI6NCxcIi4vcG9pbnRlcnJvclwiOjUsXCIuL3N3ZWVwXCI6NyxcIi4vdHJpYW5nbGVcIjo5fV0sOTpbZnVuY3Rpb24odCxuKXtcInVzZSBzdHJpY3RcIjt2YXIgZT10KFwiLi94eVwiKSxpPWZ1bmN0aW9uKHQsbixlKXt0aGlzLnBvaW50c189W3QsbixlXSx0aGlzLm5laWdoYm9yc189W251bGwsbnVsbCxudWxsXSx0aGlzLmludGVyaW9yXz0hMSx0aGlzLmNvbnN0cmFpbmVkX2VkZ2U9WyExLCExLCExXSx0aGlzLmRlbGF1bmF5X2VkZ2U9WyExLCExLCExXX0sbz1lLnRvU3RyaW5nO2kucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJbXCIrbyh0aGlzLnBvaW50c19bMF0pK28odGhpcy5wb2ludHNfWzFdKStvKHRoaXMucG9pbnRzX1syXSkrXCJdXCJ9LGkucHJvdG90eXBlLmdldFBvaW50PWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLnBvaW50c19bdF19LGkucHJvdG90eXBlLkdldFBvaW50PWkucHJvdG90eXBlLmdldFBvaW50LGkucHJvdG90eXBlLmdldFBvaW50cz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBvaW50c199LGkucHJvdG90eXBlLmdldE5laWdoYm9yPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLm5laWdoYm9yc19bdF19LGkucHJvdG90eXBlLmNvbnRhaW5zUG9pbnQ9ZnVuY3Rpb24odCl7dmFyIG49dGhpcy5wb2ludHNfO3JldHVybiB0PT09blswXXx8dD09PW5bMV18fHQ9PT1uWzJdfSxpLnByb3RvdHlwZS5jb250YWluc0VkZ2U9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuY29udGFpbnNQb2ludCh0LnApJiZ0aGlzLmNvbnRhaW5zUG9pbnQodC5xKX0saS5wcm90b3R5cGUuY29udGFpbnNQb2ludHM9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdGhpcy5jb250YWluc1BvaW50KHQpJiZ0aGlzLmNvbnRhaW5zUG9pbnQobil9LGkucHJvdG90eXBlLmlzSW50ZXJpb3I9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pbnRlcmlvcl99LGkucHJvdG90eXBlLnNldEludGVyaW9yPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmludGVyaW9yXz10LHRoaXN9LGkucHJvdG90eXBlLm1hcmtOZWlnaGJvclBvaW50ZXJzPWZ1bmN0aW9uKHQsbixlKXt2YXIgaT10aGlzLnBvaW50c187aWYodD09PWlbMl0mJm49PT1pWzFdfHx0PT09aVsxXSYmbj09PWlbMl0pdGhpcy5uZWlnaGJvcnNfWzBdPWU7ZWxzZSBpZih0PT09aVswXSYmbj09PWlbMl18fHQ9PT1pWzJdJiZuPT09aVswXSl0aGlzLm5laWdoYm9yc19bMV09ZTtlbHNle2lmKCEodD09PWlbMF0mJm49PT1pWzFdfHx0PT09aVsxXSYmbj09PWlbMF0pKXRocm93IG5ldyBFcnJvcihcInBvbHkydHJpIEludmFsaWQgVHJpYW5nbGUubWFya05laWdoYm9yUG9pbnRlcnMoKSBjYWxsXCIpO3RoaXMubmVpZ2hib3JzX1syXT1lfX0saS5wcm90b3R5cGUubWFya05laWdoYm9yPWZ1bmN0aW9uKHQpe3ZhciBuPXRoaXMucG9pbnRzXzt0LmNvbnRhaW5zUG9pbnRzKG5bMV0sblsyXSk/KHRoaXMubmVpZ2hib3JzX1swXT10LHQubWFya05laWdoYm9yUG9pbnRlcnMoblsxXSxuWzJdLHRoaXMpKTp0LmNvbnRhaW5zUG9pbnRzKG5bMF0sblsyXSk/KHRoaXMubmVpZ2hib3JzX1sxXT10LHQubWFya05laWdoYm9yUG9pbnRlcnMoblswXSxuWzJdLHRoaXMpKTp0LmNvbnRhaW5zUG9pbnRzKG5bMF0sblsxXSkmJih0aGlzLm5laWdoYm9yc19bMl09dCx0Lm1hcmtOZWlnaGJvclBvaW50ZXJzKG5bMF0sblsxXSx0aGlzKSl9LGkucHJvdG90eXBlLmNsZWFyTmVpZ2hib3JzPWZ1bmN0aW9uKCl7dGhpcy5uZWlnaGJvcnNfWzBdPW51bGwsdGhpcy5uZWlnaGJvcnNfWzFdPW51bGwsdGhpcy5uZWlnaGJvcnNfWzJdPW51bGx9LGkucHJvdG90eXBlLmNsZWFyRGVsYXVuYXlFZGdlcz1mdW5jdGlvbigpe3RoaXMuZGVsYXVuYXlfZWRnZVswXT0hMSx0aGlzLmRlbGF1bmF5X2VkZ2VbMV09ITEsdGhpcy5kZWxhdW5heV9lZGdlWzJdPSExfSxpLnByb3RvdHlwZS5wb2ludENXPWZ1bmN0aW9uKHQpe3ZhciBuPXRoaXMucG9pbnRzXztyZXR1cm4gdD09PW5bMF0/blsyXTp0PT09blsxXT9uWzBdOnQ9PT1uWzJdP25bMV06bnVsbH0saS5wcm90b3R5cGUucG9pbnRDQ1c9ZnVuY3Rpb24odCl7dmFyIG49dGhpcy5wb2ludHNfO3JldHVybiB0PT09blswXT9uWzFdOnQ9PT1uWzFdP25bMl06dD09PW5bMl0/blswXTpudWxsfSxpLnByb3RvdHlwZS5uZWlnaGJvckNXPWZ1bmN0aW9uKHQpe3JldHVybiB0PT09dGhpcy5wb2ludHNfWzBdP3RoaXMubmVpZ2hib3JzX1sxXTp0PT09dGhpcy5wb2ludHNfWzFdP3RoaXMubmVpZ2hib3JzX1syXTp0aGlzLm5laWdoYm9yc19bMF19LGkucHJvdG90eXBlLm5laWdoYm9yQ0NXPWZ1bmN0aW9uKHQpe3JldHVybiB0PT09dGhpcy5wb2ludHNfWzBdP3RoaXMubmVpZ2hib3JzX1syXTp0PT09dGhpcy5wb2ludHNfWzFdP3RoaXMubmVpZ2hib3JzX1swXTp0aGlzLm5laWdoYm9yc19bMV19LGkucHJvdG90eXBlLmdldENvbnN0cmFpbmVkRWRnZUNXPWZ1bmN0aW9uKHQpe3JldHVybiB0PT09dGhpcy5wb2ludHNfWzBdP3RoaXMuY29uc3RyYWluZWRfZWRnZVsxXTp0PT09dGhpcy5wb2ludHNfWzFdP3RoaXMuY29uc3RyYWluZWRfZWRnZVsyXTp0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMF19LGkucHJvdG90eXBlLmdldENvbnN0cmFpbmVkRWRnZUNDVz1mdW5jdGlvbih0KXtyZXR1cm4gdD09PXRoaXMucG9pbnRzX1swXT90aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMl06dD09PXRoaXMucG9pbnRzX1sxXT90aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMF06dGhpcy5jb25zdHJhaW5lZF9lZGdlWzFdfSxpLnByb3RvdHlwZS5nZXRDb25zdHJhaW5lZEVkZ2VBY3Jvc3M9ZnVuY3Rpb24odCl7cmV0dXJuIHQ9PT10aGlzLnBvaW50c19bMF0/dGhpcy5jb25zdHJhaW5lZF9lZGdlWzBdOnQ9PT10aGlzLnBvaW50c19bMV0/dGhpcy5jb25zdHJhaW5lZF9lZGdlWzFdOnRoaXMuY29uc3RyYWluZWRfZWRnZVsyXX0saS5wcm90b3R5cGUuc2V0Q29uc3RyYWluZWRFZGdlQ1c9ZnVuY3Rpb24odCxuKXt0PT09dGhpcy5wb2ludHNfWzBdP3RoaXMuY29uc3RyYWluZWRfZWRnZVsxXT1uOnQ9PT10aGlzLnBvaW50c19bMV0/dGhpcy5jb25zdHJhaW5lZF9lZGdlWzJdPW46dGhpcy5jb25zdHJhaW5lZF9lZGdlWzBdPW59LGkucHJvdG90eXBlLnNldENvbnN0cmFpbmVkRWRnZUNDVz1mdW5jdGlvbih0LG4pe3Q9PT10aGlzLnBvaW50c19bMF0/dGhpcy5jb25zdHJhaW5lZF9lZGdlWzJdPW46dD09PXRoaXMucG9pbnRzX1sxXT90aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMF09bjp0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMV09bn0saS5wcm90b3R5cGUuZ2V0RGVsYXVuYXlFZGdlQ1c9ZnVuY3Rpb24odCl7cmV0dXJuIHQ9PT10aGlzLnBvaW50c19bMF0/dGhpcy5kZWxhdW5heV9lZGdlWzFdOnQ9PT10aGlzLnBvaW50c19bMV0/dGhpcy5kZWxhdW5heV9lZGdlWzJdOnRoaXMuZGVsYXVuYXlfZWRnZVswXX0saS5wcm90b3R5cGUuZ2V0RGVsYXVuYXlFZGdlQ0NXPWZ1bmN0aW9uKHQpe3JldHVybiB0PT09dGhpcy5wb2ludHNfWzBdP3RoaXMuZGVsYXVuYXlfZWRnZVsyXTp0PT09dGhpcy5wb2ludHNfWzFdP3RoaXMuZGVsYXVuYXlfZWRnZVswXTp0aGlzLmRlbGF1bmF5X2VkZ2VbMV19LGkucHJvdG90eXBlLnNldERlbGF1bmF5RWRnZUNXPWZ1bmN0aW9uKHQsbil7dD09PXRoaXMucG9pbnRzX1swXT90aGlzLmRlbGF1bmF5X2VkZ2VbMV09bjp0PT09dGhpcy5wb2ludHNfWzFdP3RoaXMuZGVsYXVuYXlfZWRnZVsyXT1uOnRoaXMuZGVsYXVuYXlfZWRnZVswXT1ufSxpLnByb3RvdHlwZS5zZXREZWxhdW5heUVkZ2VDQ1c9ZnVuY3Rpb24odCxuKXt0PT09dGhpcy5wb2ludHNfWzBdP3RoaXMuZGVsYXVuYXlfZWRnZVsyXT1uOnQ9PT10aGlzLnBvaW50c19bMV0/dGhpcy5kZWxhdW5heV9lZGdlWzBdPW46dGhpcy5kZWxhdW5heV9lZGdlWzFdPW59LGkucHJvdG90eXBlLm5laWdoYm9yQWNyb3NzPWZ1bmN0aW9uKHQpe3JldHVybiB0PT09dGhpcy5wb2ludHNfWzBdP3RoaXMubmVpZ2hib3JzX1swXTp0PT09dGhpcy5wb2ludHNfWzFdP3RoaXMubmVpZ2hib3JzX1sxXTp0aGlzLm5laWdoYm9yc19bMl19LGkucHJvdG90eXBlLm9wcG9zaXRlUG9pbnQ9ZnVuY3Rpb24odCxuKXt2YXIgZT10LnBvaW50Q1cobik7cmV0dXJuIHRoaXMucG9pbnRDVyhlKX0saS5wcm90b3R5cGUubGVnYWxpemU9ZnVuY3Rpb24odCxuKXt2YXIgZT10aGlzLnBvaW50c187aWYodD09PWVbMF0pZVsxXT1lWzBdLGVbMF09ZVsyXSxlWzJdPW47ZWxzZSBpZih0PT09ZVsxXSllWzJdPWVbMV0sZVsxXT1lWzBdLGVbMF09bjtlbHNle2lmKHQhPT1lWzJdKXRocm93IG5ldyBFcnJvcihcInBvbHkydHJpIEludmFsaWQgVHJpYW5nbGUubGVnYWxpemUoKSBjYWxsXCIpO2VbMF09ZVsyXSxlWzJdPWVbMV0sZVsxXT1ufX0saS5wcm90b3R5cGUuaW5kZXg9ZnVuY3Rpb24odCl7dmFyIG49dGhpcy5wb2ludHNfO2lmKHQ9PT1uWzBdKXJldHVybiAwO2lmKHQ9PT1uWzFdKXJldHVybiAxO2lmKHQ9PT1uWzJdKXJldHVybiAyO3Rocm93IG5ldyBFcnJvcihcInBvbHkydHJpIEludmFsaWQgVHJpYW5nbGUuaW5kZXgoKSBjYWxsXCIpfSxpLnByb3RvdHlwZS5lZGdlSW5kZXg9ZnVuY3Rpb24odCxuKXt2YXIgZT10aGlzLnBvaW50c187aWYodD09PWVbMF0pe2lmKG49PT1lWzFdKXJldHVybiAyO2lmKG49PT1lWzJdKXJldHVybiAxfWVsc2UgaWYodD09PWVbMV0pe2lmKG49PT1lWzJdKXJldHVybiAwO2lmKG49PT1lWzBdKXJldHVybiAyfWVsc2UgaWYodD09PWVbMl0pe2lmKG49PT1lWzBdKXJldHVybiAxO2lmKG49PT1lWzFdKXJldHVybiAwfXJldHVybi0xfSxpLnByb3RvdHlwZS5tYXJrQ29uc3RyYWluZWRFZGdlQnlJbmRleD1mdW5jdGlvbih0KXt0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbdF09ITB9LGkucHJvdG90eXBlLm1hcmtDb25zdHJhaW5lZEVkZ2VCeUVkZ2U9ZnVuY3Rpb24odCl7dGhpcy5tYXJrQ29uc3RyYWluZWRFZGdlQnlQb2ludHModC5wLHQucSl9LGkucHJvdG90eXBlLm1hcmtDb25zdHJhaW5lZEVkZ2VCeVBvaW50cz1mdW5jdGlvbih0LG4pe3ZhciBlPXRoaXMucG9pbnRzXztuPT09ZVswXSYmdD09PWVbMV18fG49PT1lWzFdJiZ0PT09ZVswXT90aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMl09ITA6bj09PWVbMF0mJnQ9PT1lWzJdfHxuPT09ZVsyXSYmdD09PWVbMF0/dGhpcy5jb25zdHJhaW5lZF9lZGdlWzFdPSEwOihuPT09ZVsxXSYmdD09PWVbMl18fG49PT1lWzJdJiZ0PT09ZVsxXSkmJih0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMF09ITApfSxuLmV4cG9ydHM9aX0se1wiLi94eVwiOjExfV0sMTA6W2Z1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpKHQsbixlKXt2YXIgaT0odC54LWUueCkqKG4ueS1lLnkpLG89KHQueS1lLnkpKihuLngtZS54KSxyPWktbztyZXR1cm4gcj4tcyYmcz5yP3AuQ09MTElORUFSOnI+MD9wLkNDVzpwLkNXfWZ1bmN0aW9uIG8odCxuLGUsaSl7dmFyIG89KHQueC1uLngpKihpLnktbi55KS0oaS54LW4ueCkqKHQueS1uLnkpO2lmKG8+PS1zKXJldHVybiExO3ZhciByPSh0LngtZS54KSooaS55LWUueSktKGkueC1lLngpKih0LnktZS55KTtyZXR1cm4gcz49cj8hMTohMH1mdW5jdGlvbiByKHQsbixlKXt2YXIgaT1uLngtdC54LG89bi55LXQueSxyPWUueC10Lngscz1lLnktdC55O3JldHVybiAwPmkqcitvKnN9dmFyIHM9MWUtMTI7ZS5FUFNJTE9OPXM7dmFyIHA9e0NXOjEsQ0NXOi0xLENPTExJTkVBUjowfTtlLk9yaWVudGF0aW9uPXAsZS5vcmllbnQyZD1pLGUuaW5TY2FuQXJlYT1vLGUuaXNBbmdsZU9idHVzZT1yfSx7fV0sMTE6W2Z1bmN0aW9uKHQsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gZSh0KXtyZXR1cm5cIihcIit0LngrXCI7XCIrdC55K1wiKVwifWZ1bmN0aW9uIGkodCl7dmFyIG49dC50b1N0cmluZygpO3JldHVyblwiW29iamVjdCBPYmplY3RdXCI9PT1uP2UodCk6bn1mdW5jdGlvbiBvKHQsbil7cmV0dXJuIHQueT09PW4ueT90Lngtbi54OnQueS1uLnl9ZnVuY3Rpb24gcih0LG4pe3JldHVybiB0Lng9PT1uLngmJnQueT09PW4ueX1uLmV4cG9ydHM9e3RvU3RyaW5nOmksdG9TdHJpbmdCYXNlOmUsY29tcGFyZTpvLGVxdWFsczpyfX0se31dfSx7fSxbNl0pKDYpfSk7XHJcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG59LHt9XSw0OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbihmdW5jdGlvbiAoZ2xvYmFsKXtcbiFmdW5jdGlvbih0KXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSltb2R1bGUuZXhwb3J0cz10KCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtdLHQpO2Vsc2V7dmFyIGU7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz9lPXdpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2U9Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiYoZT1zZWxmKSxlLlByaW9yaXR5UXVldWU9dCgpfX0oZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24gdChlLGkscil7ZnVuY3Rpb24gbyhuLHMpe2lmKCFpW25dKXtpZighZVtuXSl7dmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgX2RlcmVxXyYmX2RlcmVxXztpZighcyYmdSlyZXR1cm4gdShuLCEwKTtpZihhKXJldHVybiBhKG4sITApO3ZhciBoPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbitcIidcIik7dGhyb3cgaC5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGh9dmFyIHA9aVtuXT17ZXhwb3J0czp7fX07ZVtuXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbih0KXt2YXIgaT1lW25dWzFdW3RdO3JldHVybiBvKGk/aTp0KX0scCxwLmV4cG9ydHMsdCxlLGkscil9cmV0dXJuIGlbbl0uZXhwb3J0c31mb3IodmFyIGE9XCJmdW5jdGlvblwiPT10eXBlb2YgX2RlcmVxXyYmX2RlcmVxXyxuPTA7bjxyLmxlbmd0aDtuKyspbyhyW25dKTtyZXR1cm4gb30oezE6W2Z1bmN0aW9uKHQsZSl7dmFyIGkscixvLGEsbixzPXt9Lmhhc093blByb3BlcnR5LHU9ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBpKCl7dGhpcy5jb25zdHJ1Y3Rvcj10fWZvcih2YXIgciBpbiBlKXMuY2FsbChlLHIpJiYodFtyXT1lW3JdKTtyZXR1cm4gaS5wcm90b3R5cGU9ZS5wcm90b3R5cGUsdC5wcm90b3R5cGU9bmV3IGksdC5fX3N1cGVyX189ZS5wcm90b3R5cGUsdH07aT10KFwiLi9Qcmlvcml0eVF1ZXVlL0Fic3RyYWN0UHJpb3JpdHlRdWV1ZVwiKSxyPXQoXCIuL1ByaW9yaXR5UXVldWUvQXJyYXlTdHJhdGVneVwiKSxhPXQoXCIuL1ByaW9yaXR5UXVldWUvQmluYXJ5SGVhcFN0cmF0ZWd5XCIpLG89dChcIi4vUHJpb3JpdHlRdWV1ZS9CSGVhcFN0cmF0ZWd5XCIpLG49ZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSh0KXt0fHwodD17fSksdC5zdHJhdGVneXx8KHQuc3RyYXRlZ3k9YSksdC5jb21wYXJhdG9yfHwodC5jb21wYXJhdG9yPWZ1bmN0aW9uKHQsZSl7cmV0dXJuKHR8fDApLShlfHwwKX0pLGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyx0KX1yZXR1cm4gdShlLHQpLGV9KGkpLG4uQXJyYXlTdHJhdGVneT1yLG4uQmluYXJ5SGVhcFN0cmF0ZWd5PWEsbi5CSGVhcFN0cmF0ZWd5PW8sZS5leHBvcnRzPW59LHtcIi4vUHJpb3JpdHlRdWV1ZS9BYnN0cmFjdFByaW9yaXR5UXVldWVcIjoyLFwiLi9Qcmlvcml0eVF1ZXVlL0FycmF5U3RyYXRlZ3lcIjozLFwiLi9Qcmlvcml0eVF1ZXVlL0JIZWFwU3RyYXRlZ3lcIjo0LFwiLi9Qcmlvcml0eVF1ZXVlL0JpbmFyeUhlYXBTdHJhdGVneVwiOjV9XSwyOltmdW5jdGlvbih0LGUpe3ZhciBpO2UuZXhwb3J0cz1pPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0KXtpZihudWxsPT0obnVsbCE9dD90LnN0cmF0ZWd5OnZvaWQgMCkpdGhyb3dcIk11c3QgcGFzcyBvcHRpb25zLnN0cmF0ZWd5LCBhIHN0cmF0ZWd5XCI7aWYobnVsbD09KG51bGwhPXQ/dC5jb21wYXJhdG9yOnZvaWQgMCkpdGhyb3dcIk11c3QgcGFzcyBvcHRpb25zLmNvbXBhcmF0b3IsIGEgY29tcGFyYXRvclwiO3RoaXMucHJpdj1uZXcgdC5zdHJhdGVneSh0KSx0aGlzLmxlbmd0aD0wfXJldHVybiB0LnByb3RvdHlwZS5xdWV1ZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5sZW5ndGgrKyx2b2lkIHRoaXMucHJpdi5xdWV1ZSh0KX0sdC5wcm90b3R5cGUuZGVxdWV1ZT1mdW5jdGlvbigpe2lmKCF0aGlzLmxlbmd0aCl0aHJvd1wiRW1wdHkgcXVldWVcIjtyZXR1cm4gdGhpcy5sZW5ndGgtLSx0aGlzLnByaXYuZGVxdWV1ZSgpfSx0LnByb3RvdHlwZS5wZWVrPWZ1bmN0aW9uKCl7aWYoIXRoaXMubGVuZ3RoKXRocm93XCJFbXB0eSBxdWV1ZVwiO3JldHVybiB0aGlzLnByaXYucGVlaygpfSx0fSgpfSx7fV0sMzpbZnVuY3Rpb24odCxlKXt2YXIgaSxyO3I9ZnVuY3Rpb24odCxlLGkpe3ZhciByLG8sYTtmb3Iobz0wLHI9dC5sZW5ndGg7cj5vOylhPW8rcj4+PjEsaSh0W2FdLGUpPj0wP289YSsxOnI9YTtyZXR1cm4gb30sZS5leHBvcnRzPWk9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQpe3ZhciBlO3RoaXMub3B0aW9ucz10LHRoaXMuY29tcGFyYXRvcj10aGlzLm9wdGlvbnMuY29tcGFyYXRvcix0aGlzLmRhdGE9KG51bGwhPShlPXRoaXMub3B0aW9ucy5pbml0aWFsVmFsdWVzKT9lLnNsaWNlKDApOnZvaWQgMCl8fFtdLHRoaXMuZGF0YS5zb3J0KHRoaXMuY29tcGFyYXRvcikucmV2ZXJzZSgpfXJldHVybiB0LnByb3RvdHlwZS5xdWV1ZT1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gZT1yKHRoaXMuZGF0YSx0LHRoaXMuY29tcGFyYXRvciksdm9pZCB0aGlzLmRhdGEuc3BsaWNlKGUsMCx0KX0sdC5wcm90b3R5cGUuZGVxdWV1ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmRhdGEucG9wKCl9LHQucHJvdG90eXBlLnBlZWs9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGgtMV19LHR9KCl9LHt9XSw0OltmdW5jdGlvbih0LGUpe3ZhciBpO2UuZXhwb3J0cz1pPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0KXt2YXIgZSxpLHIsbyxhLG4scyx1LGg7Zm9yKHRoaXMuY29tcGFyYXRvcj0obnVsbCE9dD90LmNvbXBhcmF0b3I6dm9pZCAwKXx8ZnVuY3Rpb24odCxlKXtyZXR1cm4gdC1lfSx0aGlzLnBhZ2VTaXplPShudWxsIT10P3QucGFnZVNpemU6dm9pZCAwKXx8NTEyLHRoaXMubGVuZ3RoPTAscj0wOzE8PHI8dGhpcy5wYWdlU2l6ZTspcis9MTtpZigxPDxyIT09dGhpcy5wYWdlU2l6ZSl0aHJvd1wicGFnZVNpemUgbXVzdCBiZSBhIHBvd2VyIG9mIHR3b1wiO2Zvcih0aGlzLl9zaGlmdD1yLHRoaXMuX2VtcHR5TWVtb3J5UGFnZVRlbXBsYXRlPWU9W10saT1hPTAsdT10aGlzLnBhZ2VTaXplO3U+PTA/dT5hOmE+dTtpPXU+PTA/KythOi0tYSllLnB1c2gobnVsbCk7aWYodGhpcy5fbWVtb3J5PVtdLHRoaXMuX21hc2s9dGhpcy5wYWdlU2l6ZS0xLHQuaW5pdGlhbFZhbHVlcylmb3IoaD10LmluaXRpYWxWYWx1ZXMsbj0wLHM9aC5sZW5ndGg7cz5uO24rKylvPWhbbl0sdGhpcy5xdWV1ZShvKX1yZXR1cm4gdC5wcm90b3R5cGUucXVldWU9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMubGVuZ3RoKz0xLHRoaXMuX3dyaXRlKHRoaXMubGVuZ3RoLHQpLHZvaWQgdGhpcy5fYnViYmxlVXAodGhpcy5sZW5ndGgsdCl9LHQucHJvdG90eXBlLmRlcXVldWU9ZnVuY3Rpb24oKXt2YXIgdCxlO3JldHVybiB0PXRoaXMuX3JlYWQoMSksZT10aGlzLl9yZWFkKHRoaXMubGVuZ3RoKSx0aGlzLmxlbmd0aC09MSx0aGlzLmxlbmd0aD4wJiYodGhpcy5fd3JpdGUoMSxlKSx0aGlzLl9idWJibGVEb3duKDEsZSkpLHR9LHQucHJvdG90eXBlLnBlZWs9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmVhZCgxKX0sdC5wcm90b3R5cGUuX3dyaXRlPWZ1bmN0aW9uKHQsZSl7dmFyIGk7Zm9yKGk9dD4+dGhpcy5fc2hpZnQ7aT49dGhpcy5fbWVtb3J5Lmxlbmd0aDspdGhpcy5fbWVtb3J5LnB1c2godGhpcy5fZW1wdHlNZW1vcnlQYWdlVGVtcGxhdGUuc2xpY2UoMCkpO3JldHVybiB0aGlzLl9tZW1vcnlbaV1bdCZ0aGlzLl9tYXNrXT1lfSx0LnByb3RvdHlwZS5fcmVhZD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fbWVtb3J5W3Q+PnRoaXMuX3NoaWZ0XVt0JnRoaXMuX21hc2tdfSx0LnByb3RvdHlwZS5fYnViYmxlVXA9ZnVuY3Rpb24odCxlKXt2YXIgaSxyLG8sYTtmb3IoaT10aGlzLmNvbXBhcmF0b3I7dD4xJiYocj10JnRoaXMuX21hc2ssdDx0aGlzLnBhZ2VTaXplfHxyPjM/bz10Jn50aGlzLl9tYXNrfHI+PjE6Mj5yPyhvPXQtdGhpcy5wYWdlU2l6ZT4+dGhpcy5fc2hpZnQsbys9byZ+KHRoaXMuX21hc2s+PjEpLG98PXRoaXMucGFnZVNpemU+PjEpOm89dC0yLGE9dGhpcy5fcmVhZChvKSwhKGkoYSxlKTwwKSk7KXRoaXMuX3dyaXRlKG8sZSksdGhpcy5fd3JpdGUodCxhKSx0PW87cmV0dXJuIHZvaWQgMH0sdC5wcm90b3R5cGUuX2J1YmJsZURvd249ZnVuY3Rpb24odCxlKXt2YXIgaSxyLG8sYSxuO2ZvcihuPXRoaXMuY29tcGFyYXRvcjt0PHRoaXMubGVuZ3RoOylpZih0PnRoaXMuX21hc2smJiEodCZ0aGlzLl9tYXNrLTEpP2k9cj10KzI6dCZ0aGlzLnBhZ2VTaXplPj4xPyhpPSh0Jn50aGlzLl9tYXNrKT4+MSxpfD10JnRoaXMuX21hc2s+PjEsaT1pKzE8PHRoaXMuX3NoaWZ0LHI9aSsxKTooaT10Kyh0JnRoaXMuX21hc2spLHI9aSsxKSxpIT09ciYmcjw9dGhpcy5sZW5ndGgpaWYobz10aGlzLl9yZWFkKGkpLGE9dGhpcy5fcmVhZChyKSxuKG8sZSk8MCYmbihvLGEpPD0wKXRoaXMuX3dyaXRlKGksZSksdGhpcy5fd3JpdGUodCxvKSx0PWk7ZWxzZXtpZighKG4oYSxlKTwwKSlicmVhazt0aGlzLl93cml0ZShyLGUpLHRoaXMuX3dyaXRlKHQsYSksdD1yfWVsc2V7aWYoIShpPD10aGlzLmxlbmd0aCkpYnJlYWs7aWYobz10aGlzLl9yZWFkKGkpLCEobihvLGUpPDApKWJyZWFrO3RoaXMuX3dyaXRlKGksZSksdGhpcy5fd3JpdGUodCxvKSx0PWl9cmV0dXJuIHZvaWQgMH0sdH0oKX0se31dLDU6W2Z1bmN0aW9uKHQsZSl7dmFyIGk7ZS5leHBvcnRzPWk9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQpe3ZhciBlO3RoaXMuY29tcGFyYXRvcj0obnVsbCE9dD90LmNvbXBhcmF0b3I6dm9pZCAwKXx8ZnVuY3Rpb24odCxlKXtyZXR1cm4gdC1lfSx0aGlzLmxlbmd0aD0wLHRoaXMuZGF0YT0obnVsbCE9KGU9dC5pbml0aWFsVmFsdWVzKT9lLnNsaWNlKDApOnZvaWQgMCl8fFtdLHRoaXMuX2hlYXBpZnkoKX1yZXR1cm4gdC5wcm90b3R5cGUuX2hlYXBpZnk9ZnVuY3Rpb24oKXt2YXIgdCxlLGk7aWYodGhpcy5kYXRhLmxlbmd0aD4wKWZvcih0PWU9MSxpPXRoaXMuZGF0YS5sZW5ndGg7aT49MT9pPmU6ZT5pO3Q9aT49MT8rK2U6LS1lKXRoaXMuX2J1YmJsZVVwKHQpO3JldHVybiB2b2lkIDB9LHQucHJvdG90eXBlLnF1ZXVlPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmRhdGEucHVzaCh0KSx2b2lkIHRoaXMuX2J1YmJsZVVwKHRoaXMuZGF0YS5sZW5ndGgtMSl9LHQucHJvdG90eXBlLmRlcXVldWU9ZnVuY3Rpb24oKXt2YXIgdCxlO3JldHVybiBlPXRoaXMuZGF0YVswXSx0PXRoaXMuZGF0YS5wb3AoKSx0aGlzLmRhdGEubGVuZ3RoPjAmJih0aGlzLmRhdGFbMF09dCx0aGlzLl9idWJibGVEb3duKDApKSxlfSx0LnByb3RvdHlwZS5wZWVrPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZGF0YVswXX0sdC5wcm90b3R5cGUuX2J1YmJsZVVwPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZSxpO3Q+MCYmKGU9dC0xPj4+MSx0aGlzLmNvbXBhcmF0b3IodGhpcy5kYXRhW3RdLHRoaXMuZGF0YVtlXSk8MCk7KWk9dGhpcy5kYXRhW2VdLHRoaXMuZGF0YVtlXT10aGlzLmRhdGFbdF0sdGhpcy5kYXRhW3RdPWksdD1lO3JldHVybiB2b2lkIDB9LHQucHJvdG90eXBlLl9idWJibGVEb3duPWZ1bmN0aW9uKHQpe3ZhciBlLGkscixvLGE7Zm9yKGU9dGhpcy5kYXRhLmxlbmd0aC0xOzspe2lmKGk9KHQ8PDEpKzEsbz1pKzEscj10LGU+PWkmJnRoaXMuY29tcGFyYXRvcih0aGlzLmRhdGFbaV0sdGhpcy5kYXRhW3JdKTwwJiYocj1pKSxlPj1vJiZ0aGlzLmNvbXBhcmF0b3IodGhpcy5kYXRhW29dLHRoaXMuZGF0YVtyXSk8MCYmKHI9bykscj09PXQpYnJlYWs7YT10aGlzLmRhdGFbcl0sdGhpcy5kYXRhW3JdPXRoaXMuZGF0YVt0XSx0aGlzLmRhdGFbdF09YSx0PXJ9cmV0dXJuIHZvaWQgMH0sdH0oKX0se31dfSx7fSxbMV0pKDEpfSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbn0se31dLDU6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyogXHJcbiAqIFRoZXNlIGFjdGlvbiB2YWx1ZXMgY29ycmVzcG9uZCB0byB0aGUgMjU2IHN0YXRlcyBwb3NzaWJsZSBnaXZlbiBlbXB0eVxyXG4gKiB0aWxlcywgZGlhZ29uYWwgdGlsZXMsIGFuZCBzcXVhcmUgdGlsZXMuIEdlbmVyYXRlZCB1c2luZyBkaWFnb25hbHMuanMuXHJcbiAqIFRoZXJlIGFyZSB0d28gcG9zc2libGUgZm9ybXMgZm9yIGFuIGFjdGlvbiB2YWx1ZS4gT25lIGlzIGFzIGEgc2luZ2xlIG9iamVjdC5cclxuICogSWYgYW4gaXRlbSBoYXMgb25seSBhIHNpbmdsZSBvYmplY3QsIHRoZW4gdGhlcmUgaXMgb25seSBvbmUgcG9zc2libGUgZW50cmFuY2UvXHJcbiAqIGV4aXQgcG9zc2libGUgZnJvbSB0aGF0IGFycmFuZ2VtZW50IG9mIHRpbGVzLiBJZiBhbiBpdGVtIGhhcyBhbiBhcnJheSBvZlxyXG4gKiBvYmplY3RzIHRoZW4gdGhlcmUgYXJlIG11bHRpcGxlIGVudHJhbmNlL2V4aXRzIHBvc3NpYmxlLiBFYWNoIG9mIHRoZSBvYmplY3RzXHJcbiAqIGluIGFuIGFycmF5IG9mIHRoaXMgc29ydCBoYXMgYSAnbG9jJyBwcm9wZXJ0eSB0aGF0IGl0c2VsZiBpcyBhbiBvYmplY3Qgd2l0aFxyXG4gKiBwcm9wZXJ0aWVzICdpbl9kaXInIGFuZCAnb3V0X2RpcicgY29ycmVzcG9uZGluZyB0byB0aGUgdmFsdWVzIHRvIGdldCBpbnRvIHRoZVxyXG4gKiBjZWxsIGFuZCB0aGUgdmFsdWUgdGhhdCBzaG91bGQgYmUgdGFrZW4gdG8gZ2V0IG91dCBvZiBpdC4gRWFjaCBvZiB0aGUgb2JqZWN0c1xyXG4gKiBhbHNvIGhhcyBhIHByb3BlcnR5ICd2JyB3aGljaCBpcyBhIGJvb2xlYW4gY29ycmVzcG9uZGluZyB0byB3aGV0aGVyIHRoZXJlIGlzIFxyXG4gKiBhIHZlcnRleCBhdCBhIHRpbGUgd2l0aCB0aGlzIGFycmFuZ2VtZW50LiBUaGUgbG9jYXRpb25zIGNhbiBiZSBuLCBlLCBzLCB3LCBuZSxcclxuICogbncsIHNlLCBzdy5cclxuICogVGhlIGtleXMgb2YgdGhpcyBvYmplY3QgYXJlIHN0cmluZ3MgZ2VuZXJhdGVkIHVzaW5nIHRoZSBudW1iZXIgdmFsdWVzIG9mIGFcclxuICogY29udG91ciB0aWxlIHN0YXJ0aW5nIGZyb20gdGhlIHRvcCBsZWZ0IGFuZCBtb3ZpbmcgY2xvY2t3aXNlLCBzZXBhcmF0ZWQgYnkgaHlwaGVucy5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0ge1wiMC0wLTAtMFwiOntcInZcIjpmYWxzZSxcImxvY1wiOlwibm9uZVwifSxcIjEtMC0wLTBcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwid1wifSxcIjItMC0wLTBcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwid1wifSxcIjMtMC0wLTBcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwibndcIn0sXCIwLTEtMC0wXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIm5cIn0sXCIxLTEtMC0wXCI6e1widlwiOmZhbHNlLFwibG9jXCI6XCJ3XCJ9LFwiMi0xLTAtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIzLTEtMC0wXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIm53XCJ9LFwiMC0yLTAtMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJuZVwifSxcIjEtMi0wLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMi0yLTAtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMy0yLTAtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0zLTAtMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJuXCJ9LFwiMS0zLTAtMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJ3XCJ9LFwiMi0zLTAtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMy0zLTAtMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJud1wifSxcIjAtMC0xLTBcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwiZVwifSxcIjEtMC0xLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIyLTAtMS0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjMtMC0xLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0xLTEtMFwiOntcInZcIjpmYWxzZSxcImxvY1wiOlwiblwifSxcIjEtMS0xLTBcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwid1wifSxcIjItMS0xLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6ZmFsc2UsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjMtMS0xLTBcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwibndcIn0sXCIwLTItMS0wXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIm5lXCJ9LFwiMS0yLTEtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwibmVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIyLTItMS0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIzLTItMS0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTMtMS0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjEtMy0xLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMi0zLTEtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjMtMy0xLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMC0wLTItMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJzZVwifSxcIjEtMC0yLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMi0wLTItMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMy0wLTItMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMC0xLTItMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIxLTEtMi0wXCI6W3tcInZcIjpmYWxzZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIyLTEtMi0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMy0xLTItMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMC0yLTItMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMS0yLTItMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjItMi0yLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMy0yLTItMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIwLTMtMi0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIxLTMtMi0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIyLTMtMi0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjMtMy0yLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJud1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIwLTAtMy0wXCI6e1widlwiOnRydWUsXCJsb2NcIjpcImVcIn0sXCIxLTAtMy0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjItMC0zLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjMtMC0zLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMS0zLTBcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwiblwifSxcIjEtMS0zLTBcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwid1wifSxcIjItMS0zLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjMtMS0zLTBcIjp7XCJ2XCI6ZmFsc2UsXCJsb2NcIjpcIm53XCJ9LFwiMC0yLTMtMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJuZVwifSxcIjEtMi0zLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjItMi0zLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIzLTItMy0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwibmVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0zLTMtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMS0zLTMtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMi0zLTMtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIzLTMtMy0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIwLTAtMC0xXCI6e1widlwiOnRydWUsXCJsb2NcIjpcInNcIn0sXCIxLTAtMC0xXCI6e1widlwiOmZhbHNlLFwibG9jXCI6XCJzXCJ9LFwiMi0wLTAtMVwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJzXCJ9LFwiMy0wLTAtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTEtMC0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMS0xLTAtMVwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJzXCJ9LFwiMi0xLTAtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIzLTEtMC0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMi0wLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMS0yLTAtMVwiOlt7XCJ2XCI6ZmFsc2UsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMi0yLTAtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMy0yLTAtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMy0wLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMS0zLTAtMVwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJzXCJ9LFwiMi0zLTAtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMy0zLTAtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0wLTEtMVwiOntcInZcIjpmYWxzZSxcImxvY1wiOlwiZVwifSxcIjEtMC0xLTFcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwiZVwifSxcIjItMC0xLTFcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwiZVwifSxcIjMtMC0xLTFcIjpbe1widlwiOmZhbHNlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMS0xLTFcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwiblwifSxcIjEtMS0xLTFcIjp7XCJ2XCI6ZmFsc2UsXCJsb2NcIjpcIm5vbmVcIn0sXCIyLTEtMS0xXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIm5cIn0sXCIzLTEtMS0xXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIm53XCJ9LFwiMC0yLTEtMVwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJuZVwifSxcIjEtMi0xLTFcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwibmVcIn0sXCIyLTItMS0xXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIm5lXCJ9LFwiMy0yLTEtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwibmVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0zLTEtMVwiOlt7XCJ2XCI6ZmFsc2UsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMS0zLTEtMVwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJlXCJ9LFwiMi0zLTEtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMy0zLTEtMVwiOlt7XCJ2XCI6ZmFsc2UsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMC0wLTItMVwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJzZVwifSxcIjEtMC0yLTFcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwic2VcIn0sXCIyLTAtMi0xXCI6e1widlwiOmZhbHNlLFwibG9jXCI6XCJzZVwifSxcIjMtMC0yLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMS0yLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMS0xLTItMVwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJzZVwifSxcIjItMS0yLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMy0xLTItMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0yLTItMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMS0yLTItMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMi0yLTItMVwiOlt7XCJ2XCI6ZmFsc2UsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJzZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIzLTItMi0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjAtMy0yLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjEtMy0yLTFcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwic2VcIn0sXCIyLTMtMi0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIzLTMtMi0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0wLTMtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIxLTAtMy0xXCI6W3tcInZcIjpmYWxzZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIyLTAtMy0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIzLTAtMy0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0xLTMtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIxLTEtMy0xXCI6e1widlwiOnRydWUsXCJsb2NcIjpcInNcIn0sXCIyLTEtMy0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIzLTEtMy0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjAtMi0zLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMS0yLTMtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjpmYWxzZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMi0yLTMtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMy0yLTMtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMy0zLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIxLTMtMy0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIyLTMtMy0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjMtMy0zLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIwLTAtMC0yXCI6e1widlwiOnRydWUsXCJsb2NcIjpcInNcIn0sXCIxLTAtMC0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjItMC0wLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjMtMC0wLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMS0wLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMS0xLTAtMlwiOlt7XCJ2XCI6ZmFsc2UsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMi0xLTAtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjMtMS0wLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm53XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjAtMi0wLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjEtMi0wLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIyLTItMC0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjMtMi0wLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0zLTAtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMS0zLTAtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMi0zLTAtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIzLTMtMC0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwibndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMC0wLTEtMlwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJlXCJ9LFwiMS0wLTEtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIyLTAtMS0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIzLTAtMS0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTEtMS0yXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIm5cIn0sXCIxLTEtMS0yXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIndcIn0sXCIyLTEtMS0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIzLTEtMS0yXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIm53XCJ9LFwiMC0yLTEtMlwiOntcInZcIjpmYWxzZSxcImxvY1wiOlwibmVcIn0sXCIxLTItMS0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjItMi0xLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjMtMi0xLTJcIjpbe1widlwiOmZhbHNlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwibmVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0zLTEtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMS0zLTEtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMi0zLTEtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIzLTMtMS0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIwLTAtMi0yXCI6e1widlwiOnRydWUsXCJsb2NcIjpcInNlXCJ9LFwiMS0wLTItMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIyLTAtMi0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIzLTAtMi0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0xLTItMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcInNlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMS0xLTItMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjpmYWxzZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMi0xLTItMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjMtMS0yLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTItMi0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMS0yLTItMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjItMi0yLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMy0yLTItMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcInNlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMC0zLTItMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjEtMy0yLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjItMy0yLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMy0zLTItMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm53XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIwLTAtMy0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIxLTAtMy0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMi0wLTMtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIzLTAtMy0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMS0zLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjEtMS0zLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjItMS0zLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMy0xLTMtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMC0yLTMtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMS0yLTMtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjItMi0zLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMy0yLTMtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTMtMy0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjEtMy0zLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMi0zLTMtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjMtMy0zLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMC0wLTAtM1wiOntcInZcIjp0cnVlLFwibG9jXCI6XCJzd1wifSxcIjEtMC0wLTNcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwic3dcIn0sXCIyLTAtMC0zXCI6e1widlwiOnRydWUsXCJsb2NcIjpcInN3XCJ9LFwiMy0wLTAtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0xLTAtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIxLTEtMC0zXCI6e1widlwiOnRydWUsXCJsb2NcIjpcInN3XCJ9LFwiMi0xLTAtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIzLTEtMC0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTItMC0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIxLTItMC0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIyLTItMC0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMy0yLTAtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTMtMC0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIxLTMtMC0zXCI6e1widlwiOmZhbHNlLFwibG9jXCI6XCJzd1wifSxcIjItMy0wLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjMtMy0wLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTAtMS0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjEtMC0xLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMi0wLTEtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMy0wLTEtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMS0xLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6ZmFsc2UsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjEtMS0xLTNcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwic3dcIn0sXCIyLTEtMS0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOmZhbHNlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIzLTEtMS0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTItMS0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIxLTItMS0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIyLTItMS0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMy0yLTEtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTMtMS0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMS0zLTEtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIyLTMtMS0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMy0zLTEtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjAtMC0yLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjEtMC0yLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjItMC0yLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIzLTAtMi0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjAtMS0yLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIxLTEtMi0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIyLTEtMi0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMy0xLTItM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJud1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIwLTItMi0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjEtMi0yLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMi0yLTItM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMy0yLTItM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjAtMy0yLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMS0zLTItM1wiOlt7XCJ2XCI6ZmFsc2UsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIyLTMtMi0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjMtMy0yLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm53XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjAtMC0zLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjEtMC0zLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjItMC0zLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIzLTAtMy0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMS0zLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjEtMS0zLTNcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwic3dcIn0sXCIyLTEtMy0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIzLTEtMy0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOmZhbHNlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMi0zLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIxLTItMy0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwibmVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJzd1wifX1dLFwiMi0yLTMtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIzLTItMy0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTMtMy0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjEtMy0zLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjItMy0zLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMy0zLTMtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV19O1xyXG5cbn0se31dLDY6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyoqXHJcbiAqIEEgcG9pbnQgY2FuIHJlcHJlc2VudCBhIHZlcnRleCBpbiBhIDJkIGVudmlyb25tZW50IG9yIGEgdmVjdG9yLlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgYHhgIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LlxyXG4gKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSBgeWAgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQuXHJcbiAqL1xyXG5Qb2ludCA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuICB0aGlzLnggPSB4O1xyXG4gIHRoaXMueSA9IHk7XHJcbn07XHJcbmV4cG9ydHMuUG9pbnQgPSBQb2ludDtcclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgcG9pbnQtbGlrZSBvYmplY3QgaW50byBhIHBvaW50LlxyXG4gKiBAcGFyYW0ge1BvaW50TGlrZX0gcCAtIFRoZSBwb2ludC1saWtlIG9iamVjdCB0byBjb252ZXJ0LlxyXG4gKiBAcmV0dXJuIHtQb2ludH0gLSBUaGUgbmV3IHBvaW50IHJlcHJlc2VudGluZyB0aGUgcG9pbnQtbGlrZVxyXG4gKiAgIG9iamVjdC5cclxuICovXHJcblBvaW50LmZyb21Qb2ludExpa2UgPSBmdW5jdGlvbihwKSB7XHJcbiAgcmV0dXJuIG5ldyBQb2ludChwLngsIHAueSk7XHJcbn07XHJcblxyXG4vKipcclxuICogU3RyaW5nIG1ldGhvZCBmb3IgcG9pbnQtbGlrZSBvYmplY3RzLlxyXG4gKiBAcGFyYW0ge1BvaW50TGlrZX0gcCAtIFRoZSBwb2ludC1saWtlIG9iamVjdCB0byBjb252ZXJ0LlxyXG4gKiBAcmV0dXJuIHtQb2ludH0gLSBUaGUgbmV3IHBvaW50IHJlcHJlc2VudGluZyB0aGUgcG9pbnQtbGlrZVxyXG4gKiAgIG9iamVjdC5cclxuICovXHJcblBvaW50LnRvU3RyaW5nID0gZnVuY3Rpb24ocCkge1xyXG4gIHJldHVybiBcInhcIiArIHAueCArIFwieVwiICsgcC55O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRha2VzIGEgcG9pbnQgb3Igc2NhbGFyIGFuZCBhZGRzIHNsb3R3aXNlIGluIHRoZSBjYXNlIG9mIGFub3RoZXJcclxuICogcG9pbnQsIG9yIHRvIGVhY2ggcGFyYW1ldGVyIGluIHRoZSBjYXNlIG9mIGEgc2NhbGFyLlxyXG4gKiBAcGFyYW0geyhQb2ludHxudW1iZXIpfSAtIFRoZSBQb2ludCwgb3Igc2NhbGFyLCB0byBhZGQgdG8gdGhpc1xyXG4gKiAgIHBvaW50LlxyXG4gKi9cclxuUG9pbnQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHApIHtcclxuICBpZiAodHlwZW9mIHAgPT0gXCJudW1iZXJcIilcclxuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54ICsgcCwgdGhpcy55ICsgcCk7XHJcbiAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnggKyBwLngsIHRoaXMueSArIHAueSk7XHJcbn07XHJcblxyXG4vKipcclxuICogVGFrZXMgYSBwb2ludCBvciBzY2FsYXIgYW5kIHN1YnRyYWN0cyBzbG90d2lzZSBpbiB0aGUgY2FzZSBvZlxyXG4gKiBhbm90aGVyIHBvaW50IG9yIGZyb20gZWFjaCBwYXJhbWV0ZXIgaW4gdGhlIGNhc2Ugb2YgYSBzY2FsYXIuXHJcbiAqIEBwYXJhbSB7KFBvaW50fG51bWJlcil9IC0gVGhlIFBvaW50LCBvciBzY2FsYXIsIHRvIHN1YnRyYWN0IGZyb21cclxuICogICB0aGlzIHBvaW50LlxyXG4gKi9cclxuUG9pbnQucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uKHApIHtcclxuICBpZiAodHlwZW9mIHAgPT0gXCJudW1iZXJcIilcclxuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54IC0gcCwgdGhpcy55IC0gcCk7XHJcbiAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnggLSBwLngsIHRoaXMueSAtIHAueSk7XHJcbn07XHJcblxyXG4vKipcclxuICogVGFrZXMgYSBzY2FsYXIgdmFsdWUgYW5kIG11bHRpcGxpZXMgZWFjaCBwYXJhbWV0ZXIgb2YgdGhlIHBvaW50XHJcbiAqIGJ5IHRoZSBzY2FsYXIuXHJcbiAqIEBwYXJhbSAge251bWJlcn0gZiAtIFRoZSBudW1iZXIgdG8gbXVsdGlwbGUgdGhlIHBhcmFtZXRlcnMgYnkuXHJcbiAqIEByZXR1cm4ge1BvaW50fSAtIEEgbmV3IHBvaW50IHdpdGggdGhlIGNhbGN1bGF0ZWQgY29vcmRpbmF0ZXMuXHJcbiAqL1xyXG5Qb2ludC5wcm90b3R5cGUubXVsID0gZnVuY3Rpb24oZikge1xyXG4gIHJldHVybiBuZXcgUG9pbnQodGhpcy54ICogZiwgdGhpcy55ICogZik7XHJcbn07XHJcblxyXG4vKipcclxuICogVGFrZXMgYSBzY2FsYXIgdmFsdWUgYW5kIGRpdmlkZXMgZWFjaCBwYXJhbWV0ZXIgb2YgdGhlIHBvaW50XHJcbiAqIGJ5IHRoZSBzY2FsYXIuXHJcbiAqIEBwYXJhbSAge251bWJlcn0gZiAtIFRoZSBudW1iZXIgdG8gZGl2aWRlIHRoZSBwYXJhbWV0ZXJzIGJ5LlxyXG4gKiBAcmV0dXJuIHtQb2ludH0gLSBBIG5ldyBwb2ludCB3aXRoIHRoZSBjYWxjdWxhdGVkIGNvb3JkaW5hdGVzLlxyXG4gKi9cclxuUG9pbnQucHJvdG90eXBlLmRpdiA9IGZ1bmN0aW9uKGYpIHtcclxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCAvIGYsIHRoaXMueSAvIGYpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRha2VzIGFub3RoZXIgcG9pbnQgYW5kIHJldHVybnMgYSBib29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0aGVcclxuICogcG9pbnRzIGFyZSBlcXVhbC4gVHdvIHBvaW50cyBhcmUgZXF1YWwgaWYgdGhlaXIgcGFyYW1ldGVycyBhcmVcclxuICogZXF1YWwuXHJcbiAqIEBwYXJhbSAge1BvaW50fSBwIC0gVGhlIHBvaW50IHRvIGNoZWNrIGVxdWFsaXR5IGFnYWluc3QuXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciBvciBub3QgdGhlIHR3byBwb2ludHMgYXJlIGVxdWFsLlxyXG4gKi9cclxuUG9pbnQucHJvdG90eXBlLmVxID0gZnVuY3Rpb24ocCkge1xyXG4gIHJldHVybiAodGhpcy54ID09IHAueCAmJiB0aGlzLnkgPT0gcC55KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUYWtlcyBhbm90aGVyIHBvaW50IGFuZCByZXR1cm5zIGEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlXHJcbiAqIHBvaW50cyBhcmUgbm90IGVxdWFsLiBUd28gcG9pbnRzIGFyZSBjb25zaWRlcmVkIG5vdCBlcXVhbCBpZiB0aGVpclxyXG4gKiBwYXJhbWV0ZXJzIGFyZSBub3QgZXF1YWwuXHJcbiAqIEBwYXJhbSAge1BvaW50fSBwIC0gVGhlIHBvaW50IHRvIGNoZWNrIGVxdWFsaXR5IGFnYWluc3QuXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciBvciBub3QgdGhlIHR3byBwb2ludHMgYXJlIG5vdCBlcXVhbC5cclxuICovXHJcblBvaW50LnByb3RvdHlwZS5uZXEgPSBmdW5jdGlvbihwKSB7XHJcbiAgcmV0dXJuICh0aGlzLnggIT0gcC54IHx8IHRoaXMueSAhPSBwLnkpO1xyXG59O1xyXG5cclxuLy8gR2l2ZW4gYW5vdGhlciBwb2ludCwgcmV0dXJucyB0aGUgZG90IHByb2R1Y3QuXHJcblBvaW50LnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbihwKSB7XHJcbiAgcmV0dXJuICh0aGlzLnggKiBwLnggKyB0aGlzLnkgKiBwLnkpO1xyXG59O1xyXG5cclxuLy8gR2l2ZW4gYW5vdGhlciBwb2ludCwgcmV0dXJucyB0aGUgJ2Nyb3NzIHByb2R1Y3QnLCBvciBhdCBsZWFzdCB0aGUgMmRcclxuLy8gZXF1aXZhbGVudC5cclxuUG9pbnQucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24ocCkge1xyXG4gIHJldHVybiAodGhpcy54ICogcC55IC0gdGhpcy55ICogcC54KTtcclxufTtcclxuXHJcbi8vIEdpdmVuIGFub3RoZXIgcG9pbnQsIHJldHVybnMgdGhlIGRpc3RhbmNlIHRvIHRoYXQgcG9pbnQuXHJcblBvaW50LnByb3RvdHlwZS5kaXN0ID0gZnVuY3Rpb24ocCkge1xyXG4gIHZhciBkaWZmID0gdGhpcy5zdWIocCk7XHJcbiAgcmV0dXJuIE1hdGguc3FydChkaWZmLmRvdChkaWZmKSk7XHJcbn07XHJcblxyXG4vLyBHaXZlbiBhbm90aGVyIHBvaW50LCByZXR1cm5zIHRoZSBzcXVhcmVkIGRpc3RhbmNlIHRvIHRoYXQgcG9pbnQuXHJcblBvaW50LnByb3RvdHlwZS5kaXN0MiA9IGZ1bmN0aW9uKHApIHtcclxuICB2YXIgZGlmZiA9IHRoaXMuc3ViKHApO1xyXG4gIHJldHVybiBkaWZmLmRvdChkaWZmKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHBvaW50IGlzICgwLCAwKS5cclxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgcG9pbnQgaXMgKDAsIDApLlxyXG4gKi9cclxuUG9pbnQucHJvdG90eXBlLnplcm8gPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy54ID09IDAgJiYgdGhpcy55ID09IDA7XHJcbn07XHJcblxyXG5Qb2ludC5wcm90b3R5cGUubGVuID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuZGlzdChuZXcgUG9pbnQoMCwgMCkpO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBuID0gdGhpcy5kaXN0KG5ldyBQb2ludCgwLCAwKSk7XHJcbiAgaWYgKG4gPiAwKSByZXR1cm4gdGhpcy5kaXYobik7XHJcbiAgcmV0dXJuIG5ldyBQb2ludCgwLCAwKTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiAneCcgKyB0aGlzLnggKyAneScgKyB0aGlzLnk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJuIGEgY29weSBvZiB0aGUgcG9pbnQuXHJcbiAqIEByZXR1cm4ge1BvaW50fSAtIFRoZSBuZXcgcG9pbnQuXHJcbiAqL1xyXG5Qb2ludC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBFZGdlcyBhcmUgdXNlZCB0byByZXByZXNlbnQgdGhlIGJvcmRlciBiZXR3ZWVuIHR3byBhZGphY2VudFxyXG4gKiBwb2x5Z29ucy5cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7UG9pbnR9IHAxIC0gVGhlIGZpcnN0IHBvaW50IG9mIHRoZSBlZGdlLlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwMiAtIFRoZSBzZWNvbmQgcG9pbnQgb2YgdGhlIGVkZ2UuXHJcbiAqL1xyXG5FZGdlID0gZnVuY3Rpb24ocDEsIHAyKSB7XHJcbiAgdGhpcy5wMSA9IHAxO1xyXG4gIHRoaXMucDIgPSBwMjtcclxuICB0aGlzLmNlbnRlciA9IHAxLmFkZChwMi5zdWIocDEpLmRpdigyKSk7XHJcbiAgdGhpcy5wb2ludHMgPSBbdGhpcy5wMSwgdGhpcy5jZW50ZXIsIHRoaXMucDJdO1xyXG59O1xyXG5leHBvcnRzLkVkZ2UgPSBFZGdlO1xyXG5cclxuRWRnZS5wcm90b3R5cGUuX0NDVyA9IGZ1bmN0aW9uKHAxLCBwMiwgcDMpIHtcclxuICBhID0gcDEueDsgYiA9IHAxLnk7XHJcbiAgYyA9IHAyLng7IGQgPSBwMi55O1xyXG4gIGUgPSBwMy54OyBmID0gcDMueTtcclxuICByZXR1cm4gKGYgLSBiKSAqIChjIC0gYSkgPiAoZCAtIGIpICogKGUgLSBhKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2NzI1NzE1XHJcbiAqIENoZWNrcyB3aGV0aGVyIHRoaXMgZWRnZSBpbnRlcnNlY3RzIHRoZSBwcm92aWRlZCBlZGdlLlxyXG4gKiBAcGFyYW0ge0VkZ2V9IGVkZ2UgLSBUaGUgZWRnZSB0byBjaGVjayBpbnRlcnNlY3Rpb24gZm9yLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSBlZGdlcyBpbnRlcnNlY3QuXHJcbiAqL1xyXG5FZGdlLnByb3RvdHlwZS5pbnRlcnNlY3RzID0gZnVuY3Rpb24oZWRnZSkge1xyXG4gIHZhciBxMSA9IGVkZ2UucDEsIHEyID0gZWRnZS5wMjtcclxuICBpZiAocTEuZXEodGhpcy5wMSkgfHwgcTEuZXEodGhpcy5wMikgfHwgcTIuZXEodGhpcy5wMSkgfHwgcTIuZXEodGhpcy5wMikpIHJldHVybiBmYWxzZTtcclxuICByZXR1cm4gKHRoaXMuX0NDVyh0aGlzLnAxLCBxMSwgcTIpICE9IHRoaXMuX0NDVyh0aGlzLnAyLCBxMSwgcTIpKSAmJiAodGhpcy5fQ0NXKHRoaXMucDEsIHRoaXMucDIsIHExKSAhPSB0aGlzLl9DQ1codGhpcy5wMSwgdGhpcy5wMiwgcTIpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQb2x5Z29uIGNsYXNzLlxyXG4gKiBDYW4gYmUgaW5pdGlhbGl6ZWQgd2l0aCBhbiBhcnJheSBvZiBwb2ludHMuXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2ludD59IFtwb2ludHNdIC0gVGhlIHBvaW50cyB0byB1c2UgdG8gaW5pdGlhbGl6ZVxyXG4gKiAgIHRoZSBwb2x5LlxyXG4gKi9cclxuUG9seSA9IGZ1bmN0aW9uKHBvaW50cykge1xyXG4gIGlmICh0eXBlb2YgcG9pbnRzID09ICd1bmRlZmluZWQnKSBwb2ludHMgPSBmYWxzZTtcclxuICB0aGlzLmhvbGUgPSBmYWxzZTtcclxuICB0aGlzLnBvaW50cyA9IG51bGw7XHJcbiAgdGhpcy5udW1wb2ludHMgPSAwO1xyXG4gIGlmIChwb2ludHMpIHtcclxuICAgIHRoaXMubnVtcG9pbnRzID0gcG9pbnRzLmxlbmd0aDtcclxuICAgIHRoaXMucG9pbnRzID0gcG9pbnRzLnNsaWNlKCk7XHJcbiAgfVxyXG59O1xyXG5leHBvcnRzLlBvbHkgPSBQb2x5O1xyXG5cclxuUG9seS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKG4pIHtcclxuICB0aGlzLnBvaW50cyA9IG5ldyBBcnJheShuKTtcclxuICB0aGlzLm51bXBvaW50cyA9IG47XHJcbn07XHJcblxyXG5Qb2x5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLm51bXBvaW50cyA9IHRoaXMucG9pbnRzLmxlbmd0aDtcclxufTtcclxuXHJcblBvbHkucHJvdG90eXBlLnRyaWFuZ2xlID0gZnVuY3Rpb24ocDEsIHAyLCBwMykge1xyXG4gIHRoaXMuaW5pdCgzKTtcclxuICB0aGlzLnBvaW50c1swXSA9IHAxO1xyXG4gIHRoaXMucG9pbnRzWzFdID0gcDI7XHJcbiAgdGhpcy5wb2ludHNbMl0gPSBwMztcclxufTtcclxuXHJcbi8vIFRha2VzIGFuIGluZGV4IGFuZCByZXR1cm5zIHRoZSBwb2ludCBhdCB0aGF0IGluZGV4LCBvciBudWxsLlxyXG5Qb2x5LnByb3RvdHlwZS5nZXRQb2ludCA9IGZ1bmN0aW9uKG4pIHtcclxuICBpZiAodGhpcy5wb2ludHMgJiYgdGhpcy5udW1wb2ludHMgPiBuKVxyXG4gICAgcmV0dXJuIHRoaXMucG9pbnRzW25dO1xyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuLy8gU2V0IGEgcG9pbnQsIGZhaWxzIHNpbGVudGx5IG90aGVyd2lzZS4gVE9ETzogcmVwbGFjZSB3aXRoIGJyYWNrZXQgbm90YXRpb24uXHJcblBvbHkucHJvdG90eXBlLnNldFBvaW50ID0gZnVuY3Rpb24oaSwgcCkge1xyXG4gIGlmICh0aGlzLnBvaW50cyAmJiB0aGlzLnBvaW50cy5sZW5ndGggPiBpKSB7XHJcbiAgICB0aGlzLnBvaW50c1tpXSA9IHA7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gR2l2ZW4gYW4gaW5kZXggaSwgcmV0dXJuIHRoZSBpbmRleCBvZiB0aGUgbmV4dCBwb2ludC5cclxuUG9seS5wcm90b3R5cGUuZ2V0TmV4dEkgPSBmdW5jdGlvbihpKSB7XHJcbiAgcmV0dXJuIChpICsgMSkgJSB0aGlzLm51bXBvaW50cztcclxufTtcclxuXHJcblBvbHkucHJvdG90eXBlLmdldFByZXZJID0gZnVuY3Rpb24oaSkge1xyXG4gIGlmIChpID09IDApXHJcbiAgICByZXR1cm4gKHRoaXMubnVtcG9pbnRzIC0gMSk7XHJcbiAgcmV0dXJuIGkgLSAxO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB0aGUgc2lnbmVkIGFyZWEgb2YgYSBwb2x5Z29uLCBpZiB0aGUgdmVydGljZXMgYXJlIGdpdmVuIGluXHJcbi8vIENDVyBvcmRlciB0aGVuIHRoZSBhcmVhIHdpbGwgYmUgPiAwLCA8IDAgb3RoZXJ3aXNlLlxyXG5Qb2x5LnByb3RvdHlwZS5nZXRBcmVhID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGFyZWEgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1wb2ludHM7IGkrKykge1xyXG4gICAgdmFyIGkyID0gdGhpcy5nZXROZXh0SShpKTtcclxuICAgIGFyZWEgKz0gdGhpcy5wb2ludHNbaV0ueCAqIHRoaXMucG9pbnRzW2kyXS55IC0gdGhpcy5wb2ludHNbaV0ueSAqIHRoaXMucG9pbnRzW2kyXS54O1xyXG4gIH1cclxuICByZXR1cm4gYXJlYTtcclxufTtcclxuXHJcblBvbHkucHJvdG90eXBlLmdldE9yaWVudGF0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGFyZWEgPSB0aGlzLmdldEFyZWEoKTtcclxuICBpZiAoYXJlYSA+IDApIHJldHVybiBcIkNDV1wiO1xyXG4gIGlmIChhcmVhIDwgMCkgcmV0dXJuIFwiQ1dcIjtcclxuICByZXR1cm4gMDtcclxufTtcclxuXHJcblBvbHkucHJvdG90eXBlLnNldE9yaWVudGF0aW9uID0gZnVuY3Rpb24ob3JpZW50YXRpb24pIHtcclxuICB2YXIgY3VycmVudF9vcmllbnRhdGlvbiA9IHRoaXMuZ2V0T3JpZW50YXRpb24oKTtcclxuICBpZiAoY3VycmVudF9vcmllbnRhdGlvbiAmJiAoY3VycmVudF9vcmllbnRhdGlvbiAhPT0gb3JpZW50YXRpb24pKSB7XHJcbiAgICB0aGlzLmludmVydCgpO1xyXG4gIH1cclxufTtcclxuXHJcblBvbHkucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBuZXdwb2ludHMgPSBuZXcgQXJyYXkodGhpcy5udW1wb2ludHMpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1wb2ludHM7IGkrKykge1xyXG4gICAgbmV3cG9pbnRzW2ldID0gdGhpcy5wb2ludHNbdGhpcy5udW1wb2ludHMgLSBpIC0gMV07XHJcbiAgfVxyXG4gIHRoaXMucG9pbnRzID0gbmV3cG9pbnRzO1xyXG59O1xyXG5cclxuUG9seS5wcm90b3R5cGUuZ2V0Q2VudGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHggPSB0aGlzLnBvaW50cy5tYXAoZnVuY3Rpb24ocCkgeyByZXR1cm4gcC54IH0pO1xyXG4gIHZhciB5ID0gdGhpcy5wb2ludHMubWFwKGZ1bmN0aW9uKHApIHsgcmV0dXJuIHAueSB9KTtcclxuICB2YXIgbWluWCA9IE1hdGgubWluLmFwcGx5KG51bGwsIHgpO1xyXG4gIHZhciBtYXhYID0gTWF0aC5tYXguYXBwbHkobnVsbCwgeCk7XHJcbiAgdmFyIG1pblkgPSBNYXRoLm1pbi5hcHBseShudWxsLCB5KTtcclxuICB2YXIgbWF4WSA9IE1hdGgubWF4LmFwcGx5KG51bGwsIHkpO1xyXG4gIHJldHVybiBuZXcgUG9pbnQoKG1pblggKyBtYXhYKS8yLCAobWluWSArIG1heFkpLzIpO1xyXG59O1xyXG5cclxuLy8gQWRhcHRlZCBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2MjgzMzQ5XHJcblBvbHkucHJvdG90eXBlLmNlbnRyb2lkID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHggPSAwLFxyXG4gICAgICB5ID0gMCxcclxuICAgICAgaSxcclxuICAgICAgaixcclxuICAgICAgZixcclxuICAgICAgcG9pbnQxLFxyXG4gICAgICBwb2ludDI7XHJcblxyXG4gIGZvciAoaSA9IDAsIGogPSB0aGlzLnBvaW50cy5sZW5ndGggLSAxOyBpIDwgdGhpcy5wb2ludHMubGVuZ3RoOyBqID0gaSwgaSArPSAxKSB7XHJcbiAgICBwb2ludDEgPSB0aGlzLnBvaW50c1tpXTtcclxuICAgIHBvaW50MiA9IHRoaXMucG9pbnRzW2pdO1xyXG4gICAgZiA9IHBvaW50MS54ICogcG9pbnQyLnkgLSBwb2ludDIueCAqIHBvaW50MS55O1xyXG4gICAgeCArPSAocG9pbnQxLnggKyBwb2ludDIueCkgKiBmO1xyXG4gICAgeSArPSAocG9pbnQxLnkgKyBwb2ludDIueSkgKiBmO1xyXG4gIH1cclxuXHJcbiAgZiA9IHRoaXMuZ2V0QXJlYSgpICogMztcclxuICB4ID0gTWF0aC5hYnMoeCk7XHJcbiAgeSA9IE1hdGguYWJzKHkpO1xyXG4gIHJldHVybiBuZXcgUG9pbnQoeCAvIGYsIHkgLyBmKTtcclxufTtcclxuXHJcblBvbHkucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGNlbnRlciA9IHRoaXMuY2VudHJvaWQoKTtcclxuICByZXR1cm4gXCJcIiArIGNlbnRlci54ICsgXCIgXCIgKyBjZW50ZXIueTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgdGhlIGdpdmVuIHBvaW50IGlzIGNvbnRhaW5lZCB3aXRoaW4gdGhlIFBvbHlnb24uXHJcbiAqIEFkYXB0ZWQgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84NzIxNDgzXHJcbiAqXHJcbiAqIEBwYXJhbSB7UG9pbnR9IHAgLSBUaGUgcG9pbnQgdG8gY2hlY2suXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciBvciBub3QgdGhlIHBvaW50IGlzIGNvbnRhaW5lZCB3aXRoaW5cclxuICogICB0aGUgcG9seWdvbi5cclxuICovXHJcblBvbHkucHJvdG90eXBlLmNvbnRhaW5zUG9pbnQgPSBmdW5jdGlvbihwKSB7XHJcbiAgdmFyIHJlc3VsdCA9IGZhbHNlO1xyXG4gIGZvciAodmFyIGkgPSAwLCBqID0gdGhpcy5udW1wb2ludHMgLSAxOyBpIDwgdGhpcy5udW1wb2ludHM7IGogPSBpKyspIHtcclxuICAgIHZhciBwMSA9IHRoaXMucG9pbnRzW2pdLCBwMiA9IHRoaXMucG9pbnRzW2ldO1xyXG4gICAgaWYgKChwMi55ID4gcC55KSAhPSAocDEueSA+IHAueSkgJiZcclxuICAgICAgICAocC54IDwgKHAxLnggLSBwMi54KSAqIChwLnkgLSBwMi55KSAvIChwMS55IC0gcDIueSkgKyBwMi54KSkge1xyXG4gICAgICByZXN1bHQgPSAhcmVzdWx0O1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsb25lIHRoZSBnaXZlbiBwb2x5Z29uIGludG8gYSBuZXcgcG9seWdvbi5cclxuICogQHJldHVybiB7UG9seX0gLSBBIGNsb25lIG9mIHRoZSBwb2x5Z29uLlxyXG4gKi9cclxuUG9seS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gbmV3IFBvbHkodGhpcy5wb2ludHMuc2xpY2UoKS5tYXAoZnVuY3Rpb24ocG9pbnQpIHtcclxuICAgIHJldHVybiBwb2ludC5jbG9uZSgpO1xyXG4gIH0pKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUcmFuc2xhdGUgYSBwb2x5Z29uIGFsb25nIGEgZ2l2ZW4gdmVjdG9yLlxyXG4gKiBAcGFyYW0ge1BvaW50fSB2ZWMgLSBUaGUgdmVjdG9yIGFsb25nIHdoaWNoIHRvIHRyYW5zbGF0ZSB0aGVcclxuICogICBwb2x5Z29uLlxyXG4gKiBAcmV0dXJuIHtQb2x5fSAtIFRoZSB0cmFuc2xhdGVkIHBvbHlnb24uXHJcbiAqL1xyXG5Qb2x5LnByb3RvdHlwZS50cmFuc2xhdGUgPSBmdW5jdGlvbih2ZWMpIHtcclxuICByZXR1cm4gbmV3IFBvbHkodGhpcy5wb2ludHMubWFwKGZ1bmN0aW9uKHBvaW50KSB7XHJcbiAgICByZXR1cm4gcG9pbnQuYWRkKHZlYyk7XHJcbiAgfSkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgZWRnZXMgcmVwcmVzZW50aW5nIHRoZSBwb2x5Z29uLlxyXG4gKiBAcmV0dXJuIHtBcnJheS48RWRnZT59IC0gVGhlIGVkZ2VzIG9mIHRoZSBwb2x5Z29uLlxyXG4gKi9cclxuUG9seS5wcm90b3R5cGUuZWRnZXMgPSBmdW5jdGlvbigpIHtcclxuICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkoXCJjYWNoZWRfZWRnZXNcIikpIHtcclxuICAgIHRoaXMuY2FjaGVkX2VkZ2VzID0gdGhpcy5wb2ludHMubWFwKGZ1bmN0aW9uKHBvaW50LCBpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRWRnZShwb2ludCwgdGhpcy5wb2ludHNbdGhpcy5nZXROZXh0SShpKV0pO1xyXG4gICAgfSwgdGhpcyk7XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzLmNhY2hlZF9lZGdlcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYWl2ZSBjaGVjayBpZiBvdGhlciBwb2x5IGludGVyc2VjdHMgdGhpcyBvbmUsIGFzc3VtaW5nIGJvdGggY29udmV4LlxyXG4gKiBAcGFyYW0ge1BvbHl9IHBvbHlcclxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIHRoZSBwb2x5Z29ucyBpbnRlcnNlY3QuXHJcbiAqL1xyXG5Qb2x5LnByb3RvdHlwZS5pbnRlcnNlY3RzID0gZnVuY3Rpb24ocG9seSkge1xyXG4gIHZhciBpbnNpZGUgPSBwb2x5LnBvaW50cy5zb21lKGZ1bmN0aW9uKHApIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5zUG9pbnQocCk7XHJcbiAgfSwgdGhpcyk7XHJcbiAgaW5zaWRlID0gaW5zaWRlIHx8IHRoaXMucG9pbnRzLnNvbWUoZnVuY3Rpb24ocCkge1xyXG4gICAgcmV0dXJuIHBvbHkuY29udGFpbnNQb2ludChwKTtcclxuICB9KTtcclxuICBpZiAoaW5zaWRlKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIG93bkVkZ2VzID0gdGhpcy5lZGdlcygpO1xyXG4gICAgdmFyIG90aGVyRWRnZXMgPSBwb2x5LmVkZ2VzKCk7XHJcbiAgICB2YXIgaW50ZXJzZWN0ID0gb3duRWRnZXMuc29tZShmdW5jdGlvbihvd25FZGdlKSB7XHJcbiAgICAgIHJldHVybiBvdGhlckVkZ2VzLnNvbWUoZnVuY3Rpb24ob3RoZXJFZGdlKSB7XHJcbiAgICAgICAgcmV0dXJuIG93bkVkZ2UuaW50ZXJzZWN0cyhvdGhlckVkZ2UpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGludGVyc2VjdDtcclxuICB9XHJcbn07XHJcblxyXG52YXIgdXRpbCA9IHt9O1xyXG5leHBvcnRzLnV0aWwgPSB1dGlsO1xyXG5cclxuLyoqXHJcbiAqIEdpdmVuIGFuIGFycmF5IG9mIHBvbHlnb25zLCByZXR1cm5zIHRoZSBvbmUgdGhhdCBjb250YWlucyB0aGUgcG9pbnQuXHJcbiAqIElmIG5vIHBvbHlnb24gaXMgZm91bmQsIG51bGwgaXMgcmV0dXJuZWQuXHJcbiAqIEBwYXJhbSB7UG9pbnR9IHAgLSBUaGUgcG9pbnQgdG8gZmluZCB0aGUgcG9seWdvbiBmb3IuXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFBvbHk+fSBwb2x5cyAtIFRoZSBwb2x5Z29ucyB0byBzZWFyY2ggZm9yIHRoZSBwb2ludC5cclxuICogQHJldHVybiB7P1BvbHlnb259IC0gVGhlIHBvbHlnb24gY29udGFpbmluZyB0aGUgcG9pbnQuXHJcbiAqL1xyXG51dGlsLmZpbmRQb2x5Rm9yUG9pbnQgPSBmdW5jdGlvbihwLCBwb2x5cykge1xyXG4gIHZhciBpLCBwb2x5O1xyXG4gIGZvciAoaSBpbiBwb2x5cykge1xyXG4gICAgcG9seSA9IHBvbHlzW2ldO1xyXG4gICAgaWYgKHBvbHkuY29udGFpbnNQb2ludChwKSkge1xyXG4gICAgICByZXR1cm4gcG9seTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn07XHJcblxyXG4vKipcclxuICogSG9sZHMgdGhlIHByb3BlcnRpZXMgb2YgYSBjb2xsaXNpb24sIGlmIG9uZSBvY2N1cnJlZC5cclxuICogQHR5cGVkZWYgQ29sbGlzaW9uXHJcbiAqIEB0eXBlIHtvYmplY3R9XHJcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gY29sbGlkZXMgLSBXaGV0aGVyIHRoZXJlIGlzIGEgY29sbGlzaW9uLlxyXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGluc2lkZSAtIFdoZXRoZXIgb25lIG9iamVjdCBpcyBpbnNpZGUgdGhlIG90aGVyLlxyXG4gKiBAcHJvcGVydHkgez9Qb2ludH0gcG9pbnQgLSBUaGUgcG9pbnQgb2YgY29sbGlzaW9uLCBpZiBjb2xsaXNpb25cclxuICogICBvY2N1cnMsIGFuZCBpZiBgaW5zaWRlYCBpcyBmYWxzZS5cclxuICogQHByb3BlcnR5IHs/UG9pbnR9IG5vcm1hbCAtIEEgdW5pdCB2ZWN0b3Igbm9ybWFsIHRvIHRoZSBwb2ludFxyXG4gKiAgIG9mIGNvbGxpc2lvbiwgaWYgaXQgb2NjdXJzIGFuZCBpZiBgaW5zaWRlYCBpcyBmYWxzZS5cclxuICovXHJcbi8qKlxyXG4gKiBJZiB0aGUgcmF5IGludGVyc2VjdHMgdGhlIGNpcmNsZSwgdGhlIGRpc3RhbmNlIHRvIHRoZSBpbnRlcnNlY3Rpb25cclxuICogYWxvbmcgdGhlIHJheSBpcyByZXR1cm5lZCwgb3RoZXJ3aXNlIGZhbHNlIGlzIHJldHVybmVkLlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwIC0gVGhlIHN0YXJ0IG9mIHRoZSByYXkuXHJcbiAqIEBwYXJhbSB7UG9pbnR9IHJheSAtIFVuaXQgdmVjdG9yIGV4dGVuZGluZyBmcm9tIGBwYC5cclxuICogQHBhcmFtIHtQb2ludH0gYyAtIFRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZSBmb3IgdGhlIG9iamVjdCBiZWluZ1xyXG4gKiAgIGNoZWNrZWQgZm9yIGludGVyc2VjdGlvbi5cclxuICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIGNpcmNsZS5cclxuICogQHJldHVybiB7Q29sbGlzaW9ufSAtIFRoZSBjb2xsaXNpb24gaW5mb3JtYXRpb24uXHJcbiAqL1xyXG51dGlsLmxpbmVDaXJjbGVJbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihwLCByYXksIGMsIHJhZGl1cykge1xyXG4gIHZhciBjb2xsaXNpb24gPSB7XHJcbiAgICBjb2xsaWRlczogZmFsc2UsXHJcbiAgICBpbnNpZGU6IGZhbHNlLFxyXG4gICAgcG9pbnQ6IG51bGwsXHJcbiAgICBub3JtYWw6IG51bGxcclxuICB9O1xyXG4gIHZhciB2cGMgPSBjLnN1YihwKTtcclxuXHJcbiAgaWYgKHZwYy5sZW4oKSA8PSByYWRpdXMpIHtcclxuICAgIC8vIFBvaW50IGlzIGluc2lkZSBvYnN0YWNsZS5cclxuICAgIGNvbGxpc2lvbi5jb2xsaWRlcyA9IHRydWU7XHJcbiAgICBjb2xsaXNpb24uaW5zaWRlID0gKHZwYy5sZW4oKSAhPT0gcmFkaXVzKTtcclxuICB9IGVsc2UgaWYgKHJheS5kb3QodnBjKSA+PSAwKSB7XHJcbiAgICAvLyBDaXJjbGUgaXMgYWhlYWQgb2YgcG9pbnQuXHJcbiAgICAvLyBQcm9qZWN0aW9uIG9mIGNlbnRlciBwb2ludCBvbnRvIHJheS5cclxuICAgIHZhciBwYyA9IHAuYWRkKHJheS5tdWwocmF5LmRvdCh2cGMpKSk7XHJcbiAgICAvLyBMZW5ndGggZnJvbSBjIHRvIGl0cyBwcm9qZWN0aW9uIG9uIHRoZSByYXkuXHJcbiAgICB2YXIgbGVuX2NfcGMgPSBjLnN1YihwYykubGVuKCk7XHJcblxyXG4gICAgaWYgKGxlbl9jX3BjIDw9IHJhZGl1cykge1xyXG4gICAgICBjb2xsaXNpb24uY29sbGlkZXMgPSB0cnVlO1xyXG5cclxuICAgICAgLy8gRGlzdGFuY2UgZnJvbSBwcm9qZWN0ZWQgcG9pbnQgdG8gaW50ZXJzZWN0aW9uLlxyXG4gICAgICB2YXIgbGVuX2ludGVyc2VjdGlvbiA9IE1hdGguc3FydChsZW5fY19wYyAqIGxlbl9jX3BjICsgcmFkaXVzICogcmFkaXVzKTtcclxuICAgICAgY29sbGlzaW9uLnBvaW50ID0gcGMuc3ViKHJheS5tdWwobGVuX2ludGVyc2VjdGlvbikpO1xyXG4gICAgICBjb2xsaXNpb24ubm9ybWFsID0gY29sbGlzaW9uLnBvaW50LnN1YihjKS5ub3JtYWxpemUoKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGNvbGxpc2lvbjtcclxufTtcclxuXG59LHt9XSw3OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbnZhciBwYXJ0aXRpb24gPSBfZGVyZXFfKCcuL3BhcnRpdGlvbicpO1xyXG52YXIgZ2VvID0gX2RlcmVxXygnLi9nZW9tZXRyeScpO1xyXG52YXIgUG9pbnQgPSBnZW8uUG9pbnQ7XHJcbnZhciBQb2x5ID0gZ2VvLlBvbHk7XHJcbnZhciBFZGdlID0gZ2VvLkVkZ2U7XHJcblxyXG52YXIgTWFwUGFyc2VyID0gX2RlcmVxXygnLi9wYXJzZS1tYXAnKTtcclxudmFyIFBhdGhmaW5kZXIgPSBfZGVyZXFfKCcuL3BhdGhmaW5kZXInKTtcclxuXHJcbl9kZXJlcV8oJ21hdGgtcm91bmQnKTtcclxudmFyIENsaXBwZXJMaWIgPSBfZGVyZXFfKCdqc2NsaXBwZXInKTtcclxuXHJcbi8qKlxyXG4gKiBBIE5hdk1lc2ggcmVwcmVzZW50cyB0aGUgdHJhdmVyc2FibGUgYXJlYSBvZiBhIG1hcCBhbmQgZ2l2ZXNcclxuICogdXRpbGl0aWVzIGZvciBwYXRoZmluZGluZy5cclxuICogVXNhZ2U6XHJcbiAqIGBgYGphdmFzY3JpcHRcclxuICogLy8gQXNzdW1pbmcgdGhlIDJkIG1hcCB0aWxlcyBhcnJheSBpcyBhdmFpbGFibGU6XHJcbiAqIHZhciBuYXZtZXNoID0gbmV3IE5hdk1lc2gobWFwKTtcclxuICogbmF2bWVzaC5jYWxjdWxhdGVQYXRoKGN1cnJlbnRsb2NhdGlvbiwgdGFyZ2V0TG9jYXRpb24sIGNhbGxiYWNrKTtcclxuICogYGBgXHJcbiAqIEBtb2R1bGUgTmF2TWVzaFxyXG4gKi8gIFxyXG4vKipcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBhbGlhcyBtb2R1bGU6TmF2TWVzaFxyXG4gKiBAcGFyYW0ge01hcFRpbGVzfSBtYXAgLSBUaGUgMmQgYXJyYXkgZGVmaW5pbmcgdGhlIG1hcCB0aWxlcy5cclxuICogQHBhcmFtIHtMb2dnZXJ9IFtsb2dnZXJdIC0gVGhlIGxvZ2dlciB0byB1c2UuXHJcbiAqL1xyXG52YXIgTmF2TWVzaCA9IGZ1bmN0aW9uKG1hcCwgbG9nZ2VyKSB7XHJcbiAgaWYgKHR5cGVvZiBsb2dnZXIgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGxvZ2dlciA9IHt9O1xyXG4gICAgbG9nZ2VyLmxvZyA9IGZ1bmN0aW9uKCkge307XHJcbiAgfVxyXG4gIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xyXG5cclxuICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gIHRoaXMudXBkYXRlRnVuY3MgPSBbXTtcclxuXHJcbiAgdGhpcy5fc2V0dXBXb3JrZXIoKTtcclxuICBcclxuICAvLyBQYXJzZSBtYXAgdGlsZXMgaW50byBwb2x5Z29ucy5cclxuICB2YXIgcG9seXMgPSBNYXBQYXJzZXIucGFyc2UobWFwKTtcclxuICBpZiAoIXBvbHlzKSB7XHJcbiAgICB0aHJvdyBcIk1hcCBwYXJzaW5nIGZhaWxlZCFcIjtcclxuICB9XHJcblxyXG4gIC8vIFRyYWNrIG1hcCBzdGF0ZS5cclxuICB0aGlzLm1hcCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobWFwKSk7XHJcblxyXG4gIC8vIEluaXRpYWxpemUgbmF2bWVzaC5cclxuICB0aGlzLl9pbml0KHBvbHlzKTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBOYXZNZXNoO1xyXG5cclxuLyoqXHJcbiAqIENhbGxiYWNrIGZvciBwYXRoIGNhbGN1bGF0aW9uIHJlcXVlc3RzLlxyXG4gKiBAY2FsbGJhY2sgUGF0aENhbGxiYWNrXHJcbiAqIEBwYXJhbSB7P0FycmF5LjxQb2ludExpa2U+fSAtIFRoZSBjYWxjdWxhdGVkIHBhdGggYmVnaW5uaW5nIHdpdGhcclxuICogICB0aGUgc3RhcnQgcG9pbnQsIGFuZCBlbmRpbmcgYXQgdGhlIHRhcmdldCBwb2ludC4gSWYgbm8gcGF0aCBpc1xyXG4gKiAgIGZvdW5kIHRoZW4gbnVsbCBpcyBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBDYWxjdWxhdGUgYSBwYXRoIGZyb20gdGhlIHNvdXJjZSBwb2ludCB0byB0aGUgdGFyZ2V0IHBvaW50LCBpbnZva2luZ1xyXG4gKiB0aGUgY2FsbGJhY2sgd2l0aCB0aGUgcGF0aCBhZnRlciBjYWxjdWxhdGlvbi5cclxuICogQHBhcmFtIHtQb2ludExpa2V9IHNvdXJjZSAtIFRoZSBzdGFydCBsb2NhdGlvbiBvZiB0aGUgc2VhcmNoLlxyXG4gKiBAcGFyYW0ge1BvaW50TGlrZX0gdGFyZ2V0IC0gVGhlIHRhcmdldCBvZiB0aGUgc2VhcmNoLlxyXG4gKiBAcGFyYW0ge1BhdGhDYWxsYmFja30gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gaW52b2tlZFxyXG4gKiAgIHdoZW4gdGhlIHBhdGggaGFzIGJlZW4gY2FsY3VsYXRlZC5cclxuICovXHJcbk5hdk1lc2gucHJvdG90eXBlLmNhbGN1bGF0ZVBhdGggPSBmdW5jdGlvbihzb3VyY2UsIHRhcmdldCwgY2FsbGJhY2spIHtcclxuICB0aGlzLmxvZ2dlci5sb2coXCJuYXZtZXNoOmRlYnVnXCIsIFwiQ2FsY3VsYXRpbmcgcGF0aC5cIik7XHJcblxyXG4gIC8vIFVzZSB3ZWIgd29ya2VyIGlmIHByZXNlbnQuXHJcbiAgaWYgKHRoaXMud29ya2VyICYmIHRoaXMud29ya2VySW5pdGlhbGl6ZWQpIHtcclxuICAgIHRoaXMubG9nZ2VyLmxvZyhcIm5hdm1lc2g6ZGVidWdcIiwgXCJVc2luZyB3b3JrZXIgdG8gY2FsY3VsYXRlIHBhdGguXCIpO1xyXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoW1wiYVN0YXJcIiwgc291cmNlLCB0YXJnZXRdKTtcclxuICAgIC8vIFNldCBjYWxsYmFjayBzbyBpdCBpcyBhY2Nlc3NpYmxlIHdoZW4gcmVzdWx0cyBhcmUgc2VudCBiYWNrLlxyXG4gICAgdGhpcy5sYXN0Q2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICB9IGVsc2Uge1xyXG4gICAgc291cmNlID0gUG9pbnQuZnJvbVBvaW50TGlrZShzb3VyY2UpO1xyXG4gICAgdGFyZ2V0ID0gUG9pbnQuZnJvbVBvaW50TGlrZSh0YXJnZXQpO1xyXG4gICAgcGF0aCA9IHRoaXMucGF0aGZpbmRlci5hU3Rhcihzb3VyY2UsIHRhcmdldCk7XHJcbiAgICBjYWxsYmFjayhwYXRoKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgd2hldGhlciBvbmUgcG9pbnQgaXMgdmlzaWJsZSBmcm9tIGFub3RoZXIsIHdpdGhvdXQgYmVpbmdcclxuICogYmxvY2tlZCBieSBvYnN0YWNsZXMuXHJcbiAqIEBwYXJhbSB7UG9pbnRMaWtlfSBwMSAtIFRoZSBmaXJzdCBwb2ludC5cclxuICogQHBhcmFtIHtQb2ludExpa2V9IHAyIC0gVGhlIHNlY29uZCBwb2ludC5cclxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIGBwMWAgaXMgdmlzaWJsZSBmcm9tIGBwMmAuXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5jaGVja1Zpc2libGUgPSBmdW5jdGlvbihwMSwgcDIpIHtcclxuICB2YXIgZWRnZSA9IG5ldyBFZGdlKFBvaW50LmZyb21Qb2ludExpa2UocDEpLCBQb2ludC5mcm9tUG9pbnRMaWtlKHAyKSk7XHJcbiAgdmFyIGJsb2NrZWQgPSB0aGlzLm9ic3RhY2xlX2VkZ2VzLnNvbWUoZnVuY3Rpb24oZSkge3JldHVybiBlLmludGVyc2VjdHMoZWRnZSk7fSk7XHJcbiAgcmV0dXJuICFibG9ja2VkO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVuc3VyZSB0aGF0IHBhc3NlZCBmdW5jdGlvbiBpcyBleGVjdXRlZCB3aGVuIHRoZSBuYXZtZXNoIGhhcyBiZWVuXHJcbiAqIGZ1bGx5IGluaXRpYWxpemVkLlxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiAtIFRoZSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIG5hdm1lc2ggaXNcclxuICogICBpbml0aWFsaXplZC5cclxuICovXHJcbk5hdk1lc2gucHJvdG90eXBlLm9uSW5pdCA9IGZ1bmN0aW9uKGZuKSB7XHJcbiAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcclxuICAgIGZuKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMub25Jbml0KGZuKTtcclxuICAgIH0uYmluZCh0aGlzKSwgMTApO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiBUaWxlVXBkYXRlXHJcbiAqIEB0eXBlIHtvYmplY3R9XHJcbiAqIEBwcm9wZXJ0eSB7aW50ZWdlcn0geCAtIFRoZSB4IGluZGV4IG9mIHRoZSB0aWxlIHRvIHVwZGF0ZSBpbiB0aGVcclxuICogICBvcmlnaW5hbCBtYXAgYXJyYXkuXHJcbiAqIEBwcm9wZXJ0eSB7aW50ZWdlcn0geSAtIFRoZSB5IGluZGV4IG9mIHRoZSB0aWxlIHRvIHVwZGF0ZSBpbiB0aGVcclxuICogICBvcmlnaW5hbCBtYXAgYXJyYXkuXHJcbiAqIEBwcm9wZXJ0eSB7KG51bWJlcnxzdHJpbmcpfSB2IC0gVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHRpbGUuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIFRha2VzIGFuIGFycmF5IG9mIHRpbGVzIGFuZCB1cGRhdGVzIHRoZSBuYXZpZ2F0aW9uIG1lc2ggdG8gcmVmbGVjdFxyXG4gKiB0aGUgbmV3bHkgdHJhdmVyc2FibGUgYXJlYS4gVGhpcyBzaG91bGQgYmUgc2V0IGFzIGEgbGlzdGVuZXIgdG9cclxuICogYG1hcHVwZGF0ZWAgc29ja2V0IGV2ZW50cy5cclxuICogQHBhcmFtIHtBcnJheS48VGlsZVVwZGF0ZT59IC0gSW5mb3JtYXRpb24gb24gdGhlIHRpbGVzIHVwZGF0ZXMuXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5tYXBVcGRhdGUgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgLy8gQ2hlY2sgdGhlIHBhc3NlZCB2YWx1ZXMuXHJcbiAgdmFyIGVycm9yID0gZmFsc2U7XHJcbiAgLy8gSG9sZCB1cGRhdGVkIHRpbGUgbG9jYXRpb25zLlxyXG4gIHZhciB1cGRhdGVzID0gW107XHJcbiAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHVwZGF0ZSkge1xyXG4gICAgLy8gVXBkYXRlIGludGVybmFsIG1hcCBzdGF0ZS5cclxuICAgIHRoaXMubWFwW3VwZGF0ZS54XVt1cGRhdGUueV0gPSB1cGRhdGUudjtcclxuICAgIGlmIChlcnJvcikgcmV0dXJuO1xyXG4gICAgdmFyIHRpbGVJZCA9IHVwZGF0ZS52O1xyXG4gICAgdmFyIGxvY0lkID0gUG9pbnQudG9TdHJpbmcodXBkYXRlKTtcclxuICAgIHZhciBwYXNzYWJsZSA9IHRoaXMuX2lzUGFzc2FibGUodGlsZUlkKTtcclxuICAgIHZhciBjdXJyZW50TG9jU3RhdGUgPSB0aGlzLm9ic3RhY2xlX3N0YXRlW2xvY0lkXTtcclxuICAgIC8vIEFsbCBkeW5hbWljIHRpbGUgbG9jYXRpb25zIHNob3VsZCBiZSBkZWZpbmVkLlxyXG4gICAgaWYgKHR5cGVvZiBjdXJyZW50TG9jU3RhdGUgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgZXJyb3IgPSB0cnVlO1xyXG4gICAgICB0aGlzLmxvZ2dlci5sb2coXCJuYXZtZXNoOmVycm9yXCIsXHJcbiAgICAgICAgXCJEeW5hbWljIG9ic3RhY2xlIGZvdW5kIGJ1dCBub3QgYWxyZWFkeSBpbml0aWFsaXplZC5cIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChwYXNzYWJsZSA9PSBjdXJyZW50TG9jU3RhdGUpIHtcclxuICAgICAgICAvLyBOb3RoaW5nIHRvIGRvIGhlcmUuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMub2JzdGFjbGVfc3RhdGVbbG9jSWRdID0gcGFzc2FibGU7XHJcbiAgICAgICAgLy8gVHJhY2sgd2hldGhlciB1cGRhdGUgaXMgbWFraW5nIHRoZSB0aWxlcyBwYXNzYWJsZSBvclxyXG4gICAgICAgIC8vIGltcGFzc2FibGUuXHJcbiAgICAgICAgdXBkYXRlLnBhc3NhYmxlID0gcGFzc2FibGU7XHJcbiAgICAgICAgdXBkYXRlcy5wdXNoKHVwZGF0ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCB0aGlzKTtcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBDaGVjayB0aGF0IHdlIGhhdmUgdXBkYXRlcyB0byBjYXJyeSBvdXQuXHJcbiAgaWYgKHVwZGF0ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgLy8gU2VlIHdoZXRoZXIgdGhpcyBpcyBhbiB1cGRhdGUgZnJvbSBwYXNzYWJsZSB0byBpbXBhc3NhYmxlXHJcbiAgICAvLyBvciB2aWNlLXZlcnNhLlxyXG4gICAgdmFyIHBhc3NhYmxlID0gdXBkYXRlc1swXS5wYXNzYWJsZTtcclxuXHJcbiAgICAvLyBFbnN1cmUgdGhhdCB0aGV5IGFsbCBoYXZlIHRoZSBzYW1lIHVwZGF0ZSB0eXBlLlxyXG4gICAgdXBkYXRlcy5mb3JFYWNoKGZ1bmN0aW9uKHVwZGF0ZSkge1xyXG4gICAgICBpZiAodXBkYXRlLnBhc3NhYmxlICE9PSBwYXNzYWJsZSkge1xyXG4gICAgICAgIGVycm9yID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSwgdGhpcyk7XHJcbiAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgdGhpcy5sb2dnZXIubG9nKFwibmF2bWVzaDplcnJvclwiLFxyXG4gICAgICAgIFwiTm90IGFsbCB1cGRhdGVzIG9mIHNhbWUgdHlwZS5cIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIFBhc3NhYmxlL2ltcGFzc2FibGUtc3BlY2lmaWMgdXBkYXRlIGZ1bmN0aW9ucy5cclxuICAgIGlmIChwYXNzYWJsZSkge1xyXG4gICAgICB0aGlzLl9wYXNzYWJsZVVwZGF0ZSh1cGRhdGVzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2ltcGFzc2FibGVVcGRhdGUodXBkYXRlcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCB1cCB0aGUgbmF2bWVzaCB0byBsaXN0ZW4gdG8gdGhlIHJlbGV2YW50IHNvY2tldC5cclxuICogQHBhcmFtICB7U29ja2V0fSBzb2NrZXQgLSBUaGUgc29ja2V0IHRvIGxpc3RlbiBvbiBmb3IgYG1hcHVwZGF0ZWBcclxuICogICBwYWNrZXRzLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUubGlzdGVuID0gZnVuY3Rpb24oc29ja2V0KSB7XHJcbiAgc29ja2V0Lm9uKFwibWFwdXBkYXRlXCIsIHRoaXMubWFwVXBkYXRlLmJpbmQodGhpcykpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIG5hdmlnYXRpb24gbWVzaCB1cGRhdGVzLlxyXG4gKiBAY2FsbGJhY2sgVXBkYXRlQ2FsbGJhY2tcclxuICogQHBhcmFtIHtBcnJheS48UG9seT59IC0gVGhlIHBvbHlzIGRlZmluaW5nIHRoZSBjdXJyZW50IG5hdmlnYXRpb25cclxuICogICBtZXNoLlxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gLSBUaGUgcG9seXMgdGhhdCB3ZXJlIGFkZGVkIHRvIHRoZSBtZXNoLlxyXG4gKiBAcGFyYW0ge0FycmF5LjxpbnRlZ2VyPn0gLSBUaGUgaW5kaWNlcyBvZiB0aGUgcG9seXMgdGhhdCB3ZXJlXHJcbiAqICAgcmVtb3ZlZCBmcm9tIHRoZSBtZXNoLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBSZWdpc3RlciBhIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBuYXZpZ2F0aW9uIG1lc2ggdXBkYXRlcy5cclxuICogQHBhcmFtIHtVcGRhdGVDYWxsYmFja30gZm4gLSBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUub25VcGRhdGUgPSBmdW5jdGlvbihmbikge1xyXG4gIHRoaXMudXBkYXRlRnVuY3MucHVzaChmbik7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IHNwZWNpZmljIHRpbGUgaWRlbnRpZmllcnMgYXMgaW1wYXNzYWJsZSB0byB0aGUgYWdlbnQuXHJcbiAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGlkcyAtIFRoZSB0aWxlIGlkcyB0byBzZXQgYXMgaW1wYXNzYWJsZS5cclxuICogQHBhcmFtIHtzdHJpbmd9IG9ic3RhY2xlIC0gVGhlIGlkZW50aWZpZXIgZm9yIHRoZSBwb2x5Z29uIGZvciB0aGVcclxuICogICBvYnN0YWNsZXMgKGFscmVhZHkgcGFzc2VkIHRvIGFkZE9ic3RhY2xlUG9seSkuXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5zZXRJbXBhc3NhYmxlID0gZnVuY3Rpb24oaWRzKSB7XHJcbiAgLy8gUmVtb3ZlIGlkcyBhbHJlYWR5IHNldCBhcyBpbXBhc3NhYmxlLlxyXG4gIGlkcyA9IGlkcy5maWx0ZXIoZnVuY3Rpb24oaWQpIHtcclxuICAgIHJldHVybiB0aGlzLl9pc1Bhc3NhYmxlKGlkKTtcclxuICB9LCB0aGlzKTtcclxuICB0aGlzLmxvZ2dlci5sb2coXCJuYXZtZXNoOmRlYnVnXCIsIFwiSWRzIHBhc3NlZDpcIiwgaWRzKTtcclxuXHJcbiAgdmFyIHVwZGF0ZXMgPSBbXTtcclxuICAvLyBDaGVjayBpZiBhbnkgb2YgdGhlIGR5bmFtaWMgdGlsZXMgaGF2ZSB0aGUgdmFsdWVzIHBhc3NlZC5cclxuICB0aGlzLmR5bmFtaWNfb2JzdGFjbGVfbG9jYXRpb25zLmZvckVhY2goZnVuY3Rpb24obG9jKSB7XHJcbiAgICB2YXIgaWR4ID0gaWRzLmluZGV4T2YodGhpcy5tYXBbbG9jLnhdW2xvYy55XSk7XHJcbiAgICBpZiAoaWR4ICE9PSAtMSkge1xyXG4gICAgICB1cGRhdGVzLnB1c2goe1xyXG4gICAgICAgIHg6IGxvYy54LFxyXG4gICAgICAgIHk6IGxvYy55LFxyXG4gICAgICAgIHY6IGlkc1tpZHhdXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sIHRoaXMpO1xyXG5cclxuICAvLyBBZGQgdG8gbGlzdCBvZiBpbXBhc3NhYmxlIHRpbGVzLlxyXG4gIGlkcy5mb3JFYWNoKGZ1bmN0aW9uKGlkKSB7XHJcbiAgICB0aGlzLmltcGFzc2FibGVbaWRdID0gdHJ1ZTtcclxuICB9LCB0aGlzKTtcclxuXHJcbiAgaWYgKHVwZGF0ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgdGhpcy5tYXBVcGRhdGUodXBkYXRlcyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSB0aWxlIGlkZW50aWZpZXJzIGZyb20gc2V0IG9mIGltcGFzc2FibGUgdGlsZSB0eXBlcy5cclxuICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gaWRzIC0gVGhlIHRpbGUgaWRzIHRvIHNldCBhcyB0cmF2ZXJzYWJsZS5cclxuICovXHJcbk5hdk1lc2gucHJvdG90eXBlLnJlbW92ZUltcGFzc2FibGUgPSBmdW5jdGlvbihpZHMpIHtcclxuICAvLyBSZW1vdmUgaWRzIG5vdCBzZXQgYXMgaW1wYXNzYWJsZS5cclxuICBpZHMgPSBpZHMuZmlsdGVyKGZ1bmN0aW9uKGlkKSB7XHJcbiAgICByZXR1cm4gIXRoaXMuX2lzUGFzc2FibGUoaWQpO1xyXG4gIH0sIHRoaXMpO1xyXG5cclxuICB2YXIgdXBkYXRlcyA9IFtdO1xyXG4gIC8vIENoZWNrIGlmIGFueSBvZiB0aGUgZHluYW1pYyB0aWxlcyBoYXZlIHRoZSB2YWx1ZXMgcGFzc2VkLlxyXG4gIHRoaXMuZHluYW1pY19vYnN0YWNsZV9sb2NhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihsb2MpIHtcclxuICAgIHZhciBpZHggPSBpZHMuaW5kZXhPZih0aGlzLm1hcFtsb2MueF1bbG9jLnldKTtcclxuICAgIGlmIChpZHggIT09IC0xKSB7XHJcbiAgICAgIHVwZGF0ZXMucHVzaCh7XHJcbiAgICAgICAgeDogbG9jLngsXHJcbiAgICAgICAgeTogbG9jLnksXHJcbiAgICAgICAgdjogaWRzW2lkeF1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSwgdGhpcyk7XHJcblxyXG4gIC8vIFJlbW92ZSBmcm9tIGxpc3Qgb2YgaW1wYXNzYWJsZSB0aWxlcy5cclxuICBpZHMuZm9yRWFjaChmdW5jdGlvbihpZCkge1xyXG4gICAgdGhpcy5pbXBhc3NhYmxlW2lkXSA9IGZhbHNlO1xyXG4gIH0sIHRoaXMpO1xyXG5cclxuICBpZiAodXBkYXRlcy5sZW5ndGggPiAwKSB7XHJcbiAgICB0aGlzLm1hcFVwZGF0ZSh1cGRhdGVzKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogSW5pdGlhbGl6ZSB0aGUgbmF2aWdhdGlvbiBtZXNoIHdpdGggdGhlIHBvbHlnb25zIGRlc2NyaWJpbmcgdGhlXHJcbiAqIG1hcCBlbGVtZW50cy5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtQYXJzZWRNYXB9IC0gVGhlIG1hcCBpbmZvcm1hdGlvbiBwYXJzZWQgaW50byBwb2x5Z29ucy5cclxuICovXHJcbk5hdk1lc2gucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24ocGFyc2VkTWFwKSB7XHJcbiAgLy8gU2F2ZSBvcmlnaW5hbCBwYXJzZWQgbWFwIHBvbHlzLlxyXG4gIHRoaXMucGFyc2VkTWFwID0gcGFyc2VkTWFwO1xyXG5cclxuICAvLyBTdGF0aWMgb2JqZWN0cyByZWxhdGl2ZSB0byB0aGUgbmF2bWVzaC5cclxuICB2YXIgbmF2aWdhdGlvbl9zdGF0aWNfb2JqZWN0cyA9IHtcclxuICAgIHdhbGxzOiBwYXJzZWRNYXAud2FsbHMsXHJcbiAgICBvYnN0YWNsZXM6IHBhcnNlZE1hcC5zdGF0aWNfb2JzdGFjbGVzXHJcbiAgfTtcclxuICB2YXIgbmF2aWdhdGlvbl9keW5hbWljX29iamVjdHMgPSBwYXJzZWRNYXAuZHluYW1pY19vYnN0YWNsZXM7XHJcblxyXG4gIC8vIE9mZnNldCBwb2x5cyBmcm9tIHNpZGUgc28gdGhleSByZXByZXNlbnQgdHJhdmVyc2FibGUgYXJlYS5cclxuICB2YXIgYXJlYXMgPSB0aGlzLl9vZmZzZXRQb2x5cyhuYXZpZ2F0aW9uX3N0YXRpY19vYmplY3RzKTtcclxuXHJcbiAgdGhpcy5wb2x5cyA9IGFyZWFzLm1hcChOYXZNZXNoLl9nZW9tZXRyeS5wYXJ0aXRpb25BcmVhKTtcclxuICB0aGlzLnBvbHlzID0gTmF2TWVzaC5fdXRpbC5mbGF0dGVuKHRoaXMucG9seXMpO1xyXG5cclxuICBpZiAoIXRoaXMud29ya2VySW5pdGlhbGl6ZWQpIHtcclxuICAgIHRoaXMucGF0aGZpbmRlciA9IG5ldyBQYXRoZmluZGVyKHRoaXMucG9seXMpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5fc2V0dXBEeW5hbWljT2JzdGFjbGVzKG5hdmlnYXRpb25fZHluYW1pY19vYmplY3RzKTtcclxuXHJcbiAgXHJcbiAgLy8gSG9sZCB0aGUgZWRnZXMgb2Ygc3RhdGljIG9ic3RhY2xlcy5cclxuICB0aGlzLnN0YXRpY19vYnN0YWNsZV9lZGdlcyA9IFtdO1xyXG4gIGFyZWFzLmZvckVhY2goZnVuY3Rpb24oYXJlYSkge1xyXG4gICAgdmFyIHBvbHlzID0gW2FyZWEucG9seWdvbl0uY29uY2F0KGFyZWEuaG9sZXMpO1xyXG4gICAgcG9seXMuZm9yRWFjaChmdW5jdGlvbihwb2x5KSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gcG9seS5udW1wb2ludHMgLSAxOyBpIDwgcG9seS5udW1wb2ludHM7IGogPSBpKyspIHtcclxuICAgICAgICB0aGlzLnN0YXRpY19vYnN0YWNsZV9lZGdlcy5wdXNoKG5ldyBFZGdlKHBvbHkucG9pbnRzW2pdLCBwb2x5LnBvaW50c1tpXSkpO1xyXG4gICAgICB9XHJcbiAgICB9LCB0aGlzKTtcclxuICB9LCB0aGlzKTtcclxuXHJcbiAgLy8gSG9sZHMgdGhlIGVkZ2VzIG9mIHN0YXRpYyBhbmQgZHluYW1pYyBvYnN0YWNsZXMuXHJcbiAgdGhpcy5vYnN0YWNsZV9lZGdlcyA9IHRoaXMuc3RhdGljX29ic3RhY2xlX2VkZ2VzLnNsaWNlKCk7XHJcblxyXG4gIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCB1cCBtZXNoLWR5bmFtaWMgb2JzdGFjbGVzLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX3NldHVwRHluYW1pY09ic3RhY2xlcyA9IGZ1bmN0aW9uKG9ic3RhY2xlcykge1xyXG4gIC8vIEhvbGRzIHRpbGUgaWQ8LT5pbXBhc3NhYmxlIChib29sZWFuKSBhc3NvY2lhdGlvbnMuXHJcbiAgdGhpcy5pbXBhc3NhYmxlID0ge307XHJcbiAgLy8gUG9seWdvbnMgZGVmaW5pbmcgb2JzdGFjbGVzLlxyXG4gIHRoaXMub2JzdGFjbGVEZWZpbml0aW9ucyA9IHt9O1xyXG4gIC8vIFJlbGF0aW9uIGJldHdlZW4gaWRzIGFuZCBvYnN0YWNsZXMuXHJcbiAgdGhpcy5pZFRvT2JzdGFjbGVzID0ge307XHJcblxyXG4gIHZhciBnZW8gPSBOYXZNZXNoLl9nZW9tZXRyeTtcclxuXHJcbiAgLy8gQWRkIHBvbHlnb25zIGRlc2NyaWJpbmcgZHluYW1pYyBvYnN0YWNsZXMuXHJcbiAgdGhpcy5fYWRkT2JzdGFjbGVQb2x5KFwiYm9tYlwiLCBnZW8uZ2V0QXBwcm94aW1hdGVDaXJjbGUoMTUpKTtcclxuICB0aGlzLl9hZGRPYnN0YWNsZVBvbHkoXCJib29zdFwiLCBnZW8uZ2V0QXBwcm94aW1hdGVDaXJjbGUoMTUpKTtcclxuICB0aGlzLl9hZGRPYnN0YWNsZVBvbHkoXCJwb3J0YWxcIiwgZ2VvLmdldEFwcHJveGltYXRlQ2lyY2xlKDE1KSk7XHJcbiAgdGhpcy5fYWRkT2JzdGFjbGVQb2x5KFwic3Bpa2VcIiwgZ2VvLmdldEFwcHJveGltYXRlQ2lyY2xlKDE0KSk7XHJcbiAgdGhpcy5fYWRkT2JzdGFjbGVQb2x5KFwiZ2F0ZVwiLCBnZW8uZ2V0U3F1YXJlKDIwKSk7XHJcbiAgdGhpcy5fYWRkT2JzdGFjbGVQb2x5KFwidGlsZVwiLCBnZW8uZ2V0U3F1YXJlKDIwKSk7XHJcbiAgdGhpcy5fYWRkT2JzdGFjbGVQb2x5KFwid2FsbFwiLCBnZW8uZ2V0U3F1YXJlKDIwKSk7XHJcbiAgdGhpcy5fYWRkT2JzdGFjbGVQb2x5KFwic2V3YWxsXCIsIGdlby5nZXREaWFnb25hbCgyMCwgXCJzZVwiKSk7XHJcbiAgdGhpcy5fYWRkT2JzdGFjbGVQb2x5KFwibmV3YWxsXCIsIGdlby5nZXREaWFnb25hbCgyMCwgXCJuZVwiKSk7XHJcbiAgdGhpcy5fYWRkT2JzdGFjbGVQb2x5KFwic3d3YWxsXCIsIGdlby5nZXREaWFnb25hbCgyMCwgXCJzd1wiKSk7XHJcbiAgdGhpcy5fYWRkT2JzdGFjbGVQb2x5KFwibnd3YWxsXCIsIGdlby5nZXREaWFnb25hbCgyMCwgXCJud1wiKSk7XHJcblxyXG4gIC8vIEFkZCBpZDwtPnR5cGUgYXNzb2NpYXRpb25zLlxyXG4gIHRoaXMuX3NldE9ic3RhY2xlVHlwZShbMTAsIDEwLjFdLCBcImJvbWJcIik7XHJcbiAgdGhpcy5fc2V0T2JzdGFjbGVUeXBlKFs1LCA1LjEsIDE0LCAxNC4xLCAxNSwgMTUuMV0sIFwiYm9vc3RcIik7XHJcbiAgdGhpcy5fc2V0T2JzdGFjbGVUeXBlKFs5LCA5LjEsIDkuMiwgOS4zXSwgXCJnYXRlXCIpO1xyXG4gIHRoaXMuX3NldE9ic3RhY2xlVHlwZShbMV0sIFwid2FsbFwiKTtcclxuICB0aGlzLl9zZXRPYnN0YWNsZVR5cGUoWzEuMV0sIFwic3d3YWxsXCIpO1xyXG4gIHRoaXMuX3NldE9ic3RhY2xlVHlwZShbMS4yXSwgXCJud3dhbGxcIik7XHJcbiAgdGhpcy5fc2V0T2JzdGFjbGVUeXBlKFsxLjNdLCBcIm5ld2FsbFwiKTtcclxuICB0aGlzLl9zZXRPYnN0YWNsZVR5cGUoWzEuNF0sIFwic2V3YWxsXCIpO1xyXG4gIHRoaXMuX3NldE9ic3RhY2xlVHlwZShbN10sIFwic3Bpa2VcIik7XHJcblxyXG4gIC8vIFNldCB1cCBvYnN0YWNsZSBzdGF0ZSBjb250YWluZXIuIEhvbGRzIHdoZXRoZXIgcG9zaXRpb24gaXNcclxuICAvLyBwYXNzYWJsZSBvciBub3QuIFJlZmVyZW5jZWQgdXNpbmcgYXJyYXkgbG9jYXRpb24uXHJcbiAgdGhpcy5vYnN0YWNsZV9zdGF0ZSA9IHt9O1xyXG5cclxuICAvLyBMb2NhdGlvbiBvZiBkeW5hbWljIG9ic3RhY2xlcy5cclxuICB0aGlzLmR5bmFtaWNfb2JzdGFjbGVfbG9jYXRpb25zID0gW107XHJcblxyXG4gIC8vIEVkZ2VzIG9mIG9mZnNldHRlZCBvYnN0YWNsZWQsIG9yZ2FuaXplZCBieSBpZC5cclxuICB0aGlzLmR5bmFtaWNfb2JzdGFjbGVfcG9seXMgPSB7fTtcclxuXHJcbiAgLy8gQ29udGFpbmVyIHRvIGhvbGQgaW5pdGlhbCBvYnN0YWNsZSBzdGF0ZXMuXHJcbiAgdmFyIGluaXRpYWxfc3RhdGVzID0gW107XHJcbiAgb2JzdGFjbGVzLmZvckVhY2goZnVuY3Rpb24ob2JzdGFjbGUpIHtcclxuICAgIHZhciBpZCA9IFBvaW50LnRvU3RyaW5nKG9ic3RhY2xlKTtcclxuXHJcbiAgICAvLyBHZW5lcmF0ZSBvZmZzZXQgb2JzdGFjbGUuXHJcbiAgICB2YXIgb2JzID0gdGhpcy5fb2Zmc2V0RHluYW1pY09icyhbdGhpcy5fZ2V0VGlsZVBvbHkob2JzdGFjbGUpXSk7XHJcbiAgICB2YXIgYXJlYXMgPSBOYXZNZXNoLl9nZW9tZXRyeS5nZXRBcmVhcyhvYnMpO1xyXG4gICAgYXJlYXMgPSBhcmVhcy5tYXAoZnVuY3Rpb24oYXJlYSkge1xyXG4gICAgICBhcmVhLmhvbGVzLnB1c2goYXJlYS5wb2x5Z29uKTtcclxuICAgICAgcmV0dXJuIGFyZWEuaG9sZXM7XHJcbiAgICB9KTtcclxuICAgIGFyZWFzID0gTmF2TWVzaC5fdXRpbC5mbGF0dGVuKGFyZWFzKTtcclxuICAgIC8vIEdldCBlZGdlcyBvZiBvYnN0YWNsZS5cclxuICAgIHZhciBlZGdlcyA9IGFyZWFzLm1hcChmdW5jdGlvbihwb2x5KSB7XHJcbiAgICAgIHJldHVybiBwb2x5LmVkZ2VzKCk7XHJcbiAgICB9KTtcclxuICAgIGVkZ2VzID0gTmF2TWVzaC5fdXRpbC5mbGF0dGVuKGVkZ2VzKTtcclxuICAgIHRoaXMuZHluYW1pY19vYnN0YWNsZV9wb2x5c1tpZF0gPSBlZGdlcztcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIG9ic3RhY2xlIHN0YXRlcyB0byBhbGwgYmUgcGFzc2FibGUuXHJcbiAgICB0aGlzLm9ic3RhY2xlX3N0YXRlW2lkXSA9IHRydWU7XHJcbiAgICB0aGlzLmR5bmFtaWNfb2JzdGFjbGVfbG9jYXRpb25zLnB1c2goUG9pbnQuZnJvbVBvaW50TGlrZShvYnN0YWNsZSkpO1xyXG4gICAgaW5pdGlhbF9zdGF0ZXMucHVzaChvYnN0YWNsZSk7XHJcbiAgfSwgdGhpcyk7XHJcblxyXG4gIC8vIFNldCB1cCBhbHJlYWR5LWtub3duIGR5bmFtaWMgaW1wYXNzYWJsZSB2YWx1ZXMuXHJcbiAgdGhpcy5zZXRJbXBhc3NhYmxlKFsxMCwgNSwgOS4xXSk7XHJcbiAgLy8gV2FsbHMgYW5kIHNwaWtlcy5cclxuICB0aGlzLnNldEltcGFzc2FibGUoWzEsIDEuMSwgMS4yLCAxLjMsIDEuNCwgN10pO1xyXG5cclxuICAvLyBTZXQgdXAgY2FsbGJhY2sgdG8gcmVnZW5lcmF0ZSBvYnN0YWNsZSBlZGdlcyBmb3IgdmlzaWJpbGl0eSBjaGVja2luZy5cclxuICB0aGlzLm9uVXBkYXRlKGZ1bmN0aW9uKHBvbHlzKSB7XHJcbiAgICB2YXIgb2JzdGFjbGVfZWRnZXMgPSBbXTtcclxuICAgIGZvciAoaWQgaW4gdGhpcy5vYnN0YWNsZV9zdGF0ZSkge1xyXG4gICAgICBpZiAoIXRoaXMub2JzdGFjbGVfc3RhdGVbaWRdKSB7XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoXHJcbiAgICAgICAgICBvYnN0YWNsZV9lZGdlcyxcclxuICAgICAgICAgIHRoaXMuZHluYW1pY19vYnN0YWNsZV9wb2x5c1tpZF0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLm9ic3RhY2xlX2VkZ2VzID0gdGhpcy5zdGF0aWNfb2JzdGFjbGVfZWRnZXMuY29uY2F0KG9ic3RhY2xlX2VkZ2VzKTtcclxuICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAvLyBJbml0aWFsaXplIG1hcHVwZGF0ZSB3aXRoIGFscmVhZHktcHJlc2VudCBkeW5hbWljIG9ic3RhY2xlcy5cclxuICB0aGlzLm1hcFVwZGF0ZShpbml0aWFsX3N0YXRlcyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQWRkIHBvbHkgZGVmaW5pdGlvbiBmb3Igb2JzdGFjbGUgdHlwZS5cclxuICogZWRnZXMgc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGNlbnRlciBvZiB0aWxlLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX2FkZE9ic3RhY2xlUG9seSA9IGZ1bmN0aW9uKG5hbWUsIHBvbHkpIHtcclxuICB0aGlzLm9ic3RhY2xlRGVmaW5pdGlvbnNbbmFtZV0gPSBwb2x5O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHJpZXZlIHRoZSBwb2x5Z29uIGZvciBhIGdpdmVuIG9ic3RhY2xlIGlkLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gaWQgLSBUaGUgaWQgdG8gcmV0cmlldmUgdGhlIG9ic3RhY2xlIHBvbHlnb24gZm9yLlxyXG4gKiBAcmV0dXJuIHtQb2x5fSAtIFRoZSBwb2x5Z29uIHJlcHJlc2VudGluZyB0aGUgb2JzdGFjbGUuXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5fZ2V0T2JzdGFjbGVQb2x5ID0gZnVuY3Rpb24oaWQpIHtcclxuICB2YXIgcG9seSA9IHRoaXMub2JzdGFjbGVEZWZpbml0aW9uc1t0aGlzLmlkVG9PYnN0YWNsZXNbaWRdXVxyXG4gIGlmIChwb2x5KSB7XHJcbiAgICByZXR1cm4gcG9seS5jbG9uZSgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLmxvZ2dlci5sb2coXCJuYXZtZXNoOmRlYnVnXCIsIFwiTm8gcG9seSBmb3VuZCBmb3IgaWQ6XCIsIGlkKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVXBkYXRlIHRoZSBuYXZpZ2F0aW9uIG1lc2ggdG8gdGhlIGdpdmVuIHBvbHlzIGFuZCBjYWxsIHRoZSB1cGRhdGVcclxuICogZnVuY3Rpb25zLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gcG9seXMgLSBUaGUgbmV3IHBvbHlzIGRlZmluaW5nIHRoZSBuYXYgbWVzaC5cclxuICogQHBhcmFtIHtBcnJheS48UG9seT59IGFkZGVkIC0gVGhlIHBvbHlzIHRoYXQgd2VyZSBhZGRlZCB0byB0aGUgbWVzaC5cclxuICogQHBhcmFtIHtBcnJheS48aW50ZWdlcj59IHJlbW92ZWQgLSBUaGUgaW5kaWNlcyBvZiB0aGUgcG9seXMgdGhhdCB3ZXJlXHJcbiAqICAgcmVtb3ZlZCBmcm9tIHRoZSBtZXNoLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uKHBvbHlzLCBhZGRlZCwgcmVtb3ZlZCkge1xyXG4gIHRoaXMucG9seXMgPSBwb2x5cztcclxuICB0aGlzLnVwZGF0ZUZ1bmNzLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgIGZuKHRoaXMucG9seXMsIGFkZGVkLCByZW1vdmVkKTtcclxuICAgIH0uYmluZCh0aGlzKSwgMCk7XHJcbiAgfSwgdGhpcyk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IHRoZSByZWxhdGlvbnNoaXAgYmV0d2VlbiBzcGVjaWZpYyB0aWxlIGlkZW50aWZpZXJzIGFuZCB0aGVcclxuICogcG9seWdvbnMgcmVwcmVzZW50aW5nIHRoZSBzaGFwZSBvZiB0aGUgb2JzdGFjbGUgdGhleSBjb3JyZXNwb25kXHJcbiAqIHRvLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBpZHMgLSBUaGUgdGlsZSBpZHMgdG8gc2V0IGFzIGltcGFzc2FibGUuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYnN0YWNsZSAtIFRoZSBpZGVudGlmaWVyIGZvciB0aGUgcG9seWdvbiBmb3IgdGhlXHJcbiAqICAgb2JzdGFjbGVzIChhbHJlYWR5IHBhc3NlZCB0byBhZGRPYnN0YWNsZVBvbHkpLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX3NldE9ic3RhY2xlVHlwZSA9IGZ1bmN0aW9uKGlkcywgdHlwZSkge1xyXG4gIGlkcy5mb3JFYWNoKGZ1bmN0aW9uKGlkKSB7XHJcbiAgICB0aGlzLmlkVG9PYnN0YWNsZXNbaWRdID0gdHlwZTtcclxuICB9LCB0aGlzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBwcm92aWRlZCBpZCBjb3JyZXNwb25kcyB0byBhIHBhc3NhYmxlIHRpbGUuXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciB0aGUgaWQgaXMgZm9yIGEgcGFzc2FibGUgdGlsZS5cclxuICovXHJcbk5hdk1lc2gucHJvdG90eXBlLl9pc1Bhc3NhYmxlID0gZnVuY3Rpb24oaWQpIHtcclxuICAvLyBDaGVjayBpZiBpbiBsaXN0IG9mIGltcGFzc2FibGUgdGlsZXMuXHJcbiAgcmV0dXJuICF0aGlzLmltcGFzc2FibGUuaGFzT3duUHJvcGVydHkoaWQpIHx8ICF0aGlzLmltcGFzc2FibGVbaWRdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBhIHBvbHlnb24gY29ycmVzcG9uZGluZyB0byB0aGUgZGltZW5zaW9ucyBhbmQgbG9jYXRpb24gb2YgdGhlXHJcbiAqIHByb3ZpZGVkIHRpbGUgdXBkYXRlLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge1RpbGVVcGRhdGV9IHRpbGUgLSBUaGUgdGlsZSB1cGRhdGUgaW5mb3JtYXRpb24uXHJcbiAqIEByZXR1cm4ge1BvbHl9IC0gVGhlIHBvbHlnb24gcmVwcmVzZW50aW5nIHRoZSB0aWxlLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX2dldFRpbGVQb2x5ID0gZnVuY3Rpb24odGlsZSkge1xyXG4gIC8vIEdldCB0aGUgYmFzZSBwb2x5IGZyb20gYSBsaXN0IG9mIHN1Y2ggdGhpbmdzIGJ5IHRpbGUgaWRcclxuICAvLyB0aGVuIHRyYW5zbGF0ZSBhY2NvcmRpbmcgdG8gdGhlIGFycmF5IGxvY2F0aW9uLlxyXG4gIHZhciBpZCA9IHRpbGUudjtcclxuICB2YXIgcCA9IHRoaXMuX2dldFdvcmxkQ29vcmQodGlsZSk7XHJcbiAgdmFyIHBvbHkgPSB0aGlzLl9nZXRPYnN0YWNsZVBvbHkoaWQpLnRyYW5zbGF0ZShwKTtcclxuICByZXR1cm4gcG9seTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXByZXNlbnRzIGEgcG9pbnQgaW4gc3BhY2Ugb3IgYSBsb2NhdGlvbiBpbiBhIDJkIGFycmF5LlxyXG4gKiBAdHlwZWRlZiBQb2ludExpa2VcclxuICogQHR5cGUge29iamVjdH1cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHggLSBUaGUgYHhgIGNvb3JkaW5hdGUgZm9yIHRoZSBwb2ludCwgb3Igcm93XHJcbiAqICAgZm9yIHRoZSBhcnJheSBsb2NhdGlvbi5cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHkgLSBUaGUgYHlgIGNvb3JkaW5hdGUgZm9yIHRoZSBwb2ludC4gb3IgY29sdW1uXHJcbiAqICAgZm9yIHRoZSBhcnJheSBsb2NhdGlvbi5cclxuICovXHJcblxyXG4vKipcclxuICogR2l2ZW4gYW4gYXJyYXkgbG9jYXRpb24sIHJldHVybiB0aGUgd29ybGQgY29vcmRpbmF0ZSByZXByZXNlbnRpbmdcclxuICogdGhlIGNlbnRlciBwb2ludCBvZiB0aGUgdGlsZSBhdCB0aGF0IGFycmF5IGxvY2F0aW9uLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge1BvaW50TGlrZX0gYXJyYXlMb2MgLSBUaGUgbG9jYXRpb24gaW4gdGhlIG1hcCBmb3IgdGhlIHBvaW50LlxyXG4gKiBAcmV0dXJtIHtQb2ludH0gLSBUaGUgY29vcmRpbmF0ZXMgZm9yIHRoZSBjZW50ZXIgb2YgdGhlIGxvY2F0aW9uLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX2dldFdvcmxkQ29vcmQgPSBmdW5jdGlvbihhcnJheUxvYykge1xyXG4gIHZhciBUSUxFX1dJRFRIID0gNDA7XHJcbiAgcmV0dXJuIG5ldyBQb2ludChcclxuICAgIGFycmF5TG9jLnggKiBUSUxFX1dJRFRIICsgKFRJTEVfV0lEVEggLyAyKSxcclxuICAgIGFycmF5TG9jLnkgKiBUSUxFX1dJRFRIICsgKFRJTEVfV0lEVEggLyAyKVxyXG4gICk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2Fycnkgb3V0IHRoZSBuYXZtZXNoIHVwZGF0ZSBmb3IgaW1wYXNzYWJsZSBkeW5hbWljIG9ic3RhY2xlcyB0aGF0XHJcbiAqIGhhdmUgYmVlbiByZW1vdmVkIGZyb20gdGhlIG5hdm1lc2guXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFRpbGVVcGRhdGU+fSB1cGRhdGVzIC0gVGhlIHRpbGUgdXBkYXRlIGluZm9ybWF0aW9uLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX3Bhc3NhYmxlVXBkYXRlID0gZnVuY3Rpb24odXBkYXRlcykge1xyXG4gIHZhciBzY2FsZSA9IDEwMDtcclxuICAvLyBBc3N1bWUgZWFjaCBvZiB0aGUgdGlsZXMgaXMgbm93IGEgc3F1YXJlIG9mIG9wZW4gc3BhY2UuXHJcbiAgdmFyIHBhc3NhYmxlVGlsZXMgPSB1cGRhdGVzLm1hcChmdW5jdGlvbih1cGRhdGUpIHtcclxuICAgIHJldHVybiB0aGlzLl9nZXRUaWxlUG9seSh7XHJcbiAgICAgIHg6IHVwZGF0ZS54LFxyXG4gICAgICB5OiB1cGRhdGUueSxcclxuICAgICAgdjogMVxyXG4gICAgfSk7XHJcbiAgfSwgdGhpcyk7XHJcblxyXG4gIC8vIE9mZnNldCBhbmQgbWVyZ2UgbmV3bHkgcGFzc2FibGUgdGlsZXMsIGFzc3VtaW5nIG5vIHRpbGUgYWxvbmdcclxuICAvLyB3aXRoIGl0cyBvZmZzZXQgd291bGQgaGF2ZSBiZWVuIGxhcmdlciB0aGFuIGEgc2luZ2xlIHRpbGUuXHJcbiAgLy8gU2V0IG9mZnNldCBzbGlnaHRseSBsYXJnZXIgdGhhdCBub3JtYWwgc28gdGhhdCB3ZSBjYXRjaCBhbGxcclxuICAvLyByZWxldmFudCBwb2x5Z29ucyB0aGF0IG5lZWQgdG8gYmUgdXBkYXRlZCBpbiB0aGUgbmF2bWVzaC5cclxuICB2YXIgcGFzc2FibGVBcmVhID0gdGhpcy5fb2Zmc2V0RHluYW1pY09icyhwYXNzYWJsZVRpbGVzLCAyMCk7XHJcblxyXG4gIHZhciBjcHIgPSBOYXZNZXNoLl9nZW9tZXRyeS5jcHI7XHJcblxyXG4gIC8vIEdldCBpbXBhc3NhYmxlIHRpbGVzIGJvcmRlcmluZyB0aGUgbm93LXBhc3NhYmxlIGFyZWEgYW5kIG9mZnNldCB0aGVtLlxyXG4gIHZhciBib3JkZXJpbmdUaWxlcyA9IHRoaXMuX2dldEJvcmRlcmVkVGlsZXModXBkYXRlcyk7XHJcbiAgdmFyIGJvcmRlcmluZ1BvbHlzID0gYm9yZGVyaW5nVGlsZXMubWFwKHRoaXMuX2dldFRpbGVQb2x5LCB0aGlzKTtcclxuICB2YXIgc3Vycm91bmRpbmdBcmVhID0gdGhpcy5fb2Zmc2V0RHluYW1pY09icyhib3JkZXJpbmdQb2x5cyk7XHJcblxyXG4gIC8vIEdldCBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIG9wZW4gYXJlYSBhbmQgdGhlIHN1cnJvdW5kaW5nIG9ic3RhY2xlcy5cclxuICBjcHIuQ2xlYXIoKTtcclxuICB2YXIgYWN0dWFsUGFzc2FibGVBcmVhID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuICBjcHIuQWRkUGF0aHMocGFzc2FibGVBcmVhLCBDbGlwcGVyTGliLlBvbHlUeXBlLnB0U3ViamVjdCwgdHJ1ZSk7XHJcbiAgY3ByLkFkZFBhdGhzKHN1cnJvdW5kaW5nQXJlYSwgQ2xpcHBlckxpYi5Qb2x5VHlwZS5wdENsaXAsIHRydWUpO1xyXG4gIGNwci5FeGVjdXRlKENsaXBwZXJMaWIuQ2xpcFR5cGUuY3REaWZmZXJlbmNlLFxyXG4gICAgYWN0dWFsUGFzc2FibGVBcmVhLFxyXG4gICAgQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybyxcclxuICAgIENsaXBwZXJMaWIuUG9seUZpbGxUeXBlLnBmdE5vblplcm9cclxuICApO1xyXG5cclxuICB2YXIgcGFzc2FibGVBcmVhcyA9IE5hdk1lc2guX2dlb21ldHJ5LmdldEFyZWFzKGFjdHVhbFBhc3NhYmxlQXJlYSwgc2NhbGUpO1xyXG5cclxuICB2YXIgcGFzc2FibGVQYXJ0aXRpb24gPSBOYXZNZXNoLl9nZW9tZXRyeS5wYXJ0aXRpb25BcmVhcyhwYXNzYWJsZUFyZWFzKTtcclxuXHJcbiAgLy8gR2V0IG1lc2ggcG9seXMgaW50ZXJzZWN0ZWQgYnkgb2Zmc2V0dGVkIHBhc3NhYmxlIGFyZWEuXHJcbiAgdmFyIGludGVyc2VjdGlvbiA9IHRoaXMuX2dldEludGVyc2VjdGVkUG9seXMocGFzc2FibGVQYXJ0aXRpb24pO1xyXG4gIHZhciBpbnRlcnNlY3RlZE1lc2hQb2x5cyA9IGludGVyc2VjdGlvbi5wb2x5cztcclxuXHJcbiAgLy8gQ3JlYXRlIG91dGxpbmUgd2l0aCBtYXRjaGVkIG1lc2ggcG9seXMuXHJcbiAgaW50ZXJzZWN0ZWRNZXNoUG9seXMgPSBpbnRlcnNlY3RlZE1lc2hQb2x5cy5tYXAoTmF2TWVzaC5fZ2VvbWV0cnkuY29udmVydFBvbHlUb0NsaXBwZXIpO1xyXG4gIENsaXBwZXJMaWIuSlMuU2NhbGVVcFBhdGhzKGludGVyc2VjdGVkTWVzaFBvbHlzLCBzY2FsZSk7XHJcblxyXG4gIC8vIE1lcmdlIGludGVyc2VjdGVkIG1lc2ggcG9seXMgYW5kIHdpdGggbmV3bHkgcGFzc2FibGUgYXJlYS5cclxuICBjcHIuQ2xlYXIoKTtcclxuICBjcHIuQWRkUGF0aHMoaW50ZXJzZWN0ZWRNZXNoUG9seXMsIENsaXBwZXJMaWIuUG9seVR5cGUucHRTdWJqZWN0LCB0cnVlKTtcclxuICBjcHIuQWRkUGF0aHMoYWN0dWFsUGFzc2FibGVBcmVhLCBDbGlwcGVyTGliLlBvbHlUeXBlLnB0U3ViamVjdCwgdHJ1ZSk7XHJcbiAgdmFyIG5ld01lc2hBcmVhID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuICBjcHIuRXhlY3V0ZShcclxuICAgIENsaXBwZXJMaWIuQ2xpcFR5cGUuY3RVbmlvbixcclxuICAgIG5ld01lc2hBcmVhLFxyXG4gICAgQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybyxcclxuICAgIG51bGwpO1xyXG5cclxuICAvLyBQYXJ0aXRpb24gdGhlIHVuaW9uZWQgbWVzaCBwb2x5cyBhbmQgbmV3IHBhc3NhYmxlIGFyZWEgYW5kIGFkZFxyXG4gIC8vIHRvIHRoZSBleGlzdGluZyBtZXNoIHBvbHlzLlxyXG4gIHZhciBtZXNoQXJlYXMgPSBOYXZNZXNoLl9nZW9tZXRyeS5nZXRBcmVhcyhuZXdNZXNoQXJlYSwgc2NhbGUpO1xyXG4gIHZhciBuZXdQb2x5cyA9IE5hdk1lc2guX2dlb21ldHJ5LnBhcnRpdGlvbkFyZWFzKG1lc2hBcmVhcyk7XHJcbiAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5wb2x5cywgbmV3UG9seXMpO1xyXG5cclxuICB0aGlzLl91cGRhdGUodGhpcy5wb2x5cywgbmV3UG9seXMsIGludGVyc2VjdGlvbi5pbmRpY2VzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDYXJyeSBvdXQgdGhlIG5hdm1lc2ggdXBkYXRlIGZvciBpbXBhc3NhYmxlIGR5bmFtaWMgb2JzdGFjbGVzIHRoYXRcclxuICogaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBuYXZtZXNoLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5LjxUaWxlVXBkYXRlPn0gdXBkYXRlcyAtIFRoZSB0aWxlIHVwZGF0ZSBpbmZvcm1hdGlvbi5cclxuICovXHJcbk5hdk1lc2gucHJvdG90eXBlLl9pbXBhc3NhYmxlVXBkYXRlID0gZnVuY3Rpb24odXBkYXRlcykge1xyXG4gIHZhciBzY2FsZSA9IDEwMDtcclxuICAvLyBHZXQgcG9seWdvbnMgZGVmaW5pbmcgdGhlc2Ugb2JzdGFjbGVzLlxyXG4gIHZhciBvYnN0YWNsZVBvbHlzID0gdXBkYXRlcy5tYXAoZnVuY3Rpb24odXBkYXRlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZ2V0VGlsZVBvbHkodXBkYXRlKTtcclxuICB9LCB0aGlzKTtcclxuXHJcbiAgLy8gT2Zmc2V0IHRoZSBvYnN0YWNsZSBwb2x5Z29ucy5cclxuICB2YXIgb2Zmc2V0dGVkT2JzdGFjbGVzID0gdGhpcy5fb2Zmc2V0RHluYW1pY09icyhvYnN0YWNsZVBvbHlzKTtcclxuICB2YXIgb2JzdGFjbGVBcmVhcyA9IE5hdk1lc2guX2dlb21ldHJ5LmdldEFyZWFzKG9mZnNldHRlZE9ic3RhY2xlcyk7XHJcblxyXG4gIC8vIEdldCBjb252ZXggcGFydGl0aW9uIG9mIG5ldyBvYnN0YWNsZSBhcmVhcyBmb3IgZmluZGluZ1xyXG4gIC8vIGludGVyc2VjdGlvbnMuXHJcbiAgdmFyIG9ic3RhY2xlUGFydGl0aW9uID0gTmF2TWVzaC5fZ2VvbWV0cnkucGFydGl0aW9uQXJlYXMob2JzdGFjbGVBcmVhcyk7XHJcblxyXG4gIC8vIEdldCBtZXNoIHBvbHlzIGludGVyc2VjdGVkIGJ5IG9mZnNldHRlZCBvYnN0YWNsZXMuXHJcbiAgdmFyIGludGVyc2VjdGlvbiA9IHRoaXMuX2dldEludGVyc2VjdGVkUG9seXMob2JzdGFjbGVQYXJ0aXRpb24pO1xyXG4gIHZhciBpbnRlcnNlY3RlZE1lc2hQb2x5cyA9IGludGVyc2VjdGlvbi5wb2x5cztcclxuXHJcbiAgLy8gQ3JlYXRlIG91dGxpbmUgd2l0aCBtYXRjaGVkIG1lc2ggcG9seXMuXHJcbiAgaW50ZXJzZWN0ZWRNZXNoUG9seXMgPSBpbnRlcnNlY3RlZE1lc2hQb2x5cy5tYXAoTmF2TWVzaC5fZ2VvbWV0cnkuY29udmVydFBvbHlUb0NsaXBwZXIpO1xyXG4gIENsaXBwZXJMaWIuSlMuU2NhbGVVcFBhdGhzKGludGVyc2VjdGVkTWVzaFBvbHlzLCBzY2FsZSk7XHJcbiAgdmFyIGNwciA9IE5hdk1lc2guX2dlb21ldHJ5LmNwcjtcclxuXHJcbiAgLy8gTWVyZ2UgbWF0Y2hlZCBwb2x5c1xyXG4gIGNwci5DbGVhcigpO1xyXG4gIGNwci5BZGRQYXRocyhpbnRlcnNlY3RlZE1lc2hQb2x5cywgQ2xpcHBlckxpYi5Qb2x5VHlwZS5wdFN1YmplY3QsIHRydWUpO1xyXG4gIHZhciBtZXJnZWRNZXNoUG9seXMgPSBuZXcgQ2xpcHBlckxpYi5QYXRocygpO1xyXG4gIGNwci5FeGVjdXRlKFxyXG4gICAgQ2xpcHBlckxpYi5DbGlwVHlwZS5jdFVuaW9uLFxyXG4gICAgbWVyZ2VkTWVzaFBvbHlzLFxyXG4gICAgQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybyxcclxuICAgIG51bGwpO1xyXG5cclxuICAvLyBUYWtlIGRpZmZlcmVuY2Ugb2YgbWVzaCBwb2x5cyBhbmQgb2JzdGFjbGUgcG9seXMuXHJcbiAgdmFyIHBhdGhzID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuICBjcHIuQ2xlYXIoKTtcclxuICBjcHIuQWRkUGF0aHMobWVyZ2VkTWVzaFBvbHlzLCBDbGlwcGVyTGliLlBvbHlUeXBlLnB0U3ViamVjdCwgdHJ1ZSk7XHJcbiAgY3ByLkFkZFBhdGhzKG9mZnNldHRlZE9ic3RhY2xlcywgQ2xpcHBlckxpYi5Qb2x5VHlwZS5wdENsaXAsIHRydWUpO1xyXG5cclxuICBjcHIuRXhlY3V0ZShDbGlwcGVyTGliLkNsaXBUeXBlLmN0RGlmZmVyZW5jZSxcclxuICAgIHBhdGhzLFxyXG4gICAgQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybyxcclxuICAgIENsaXBwZXJMaWIuUG9seUZpbGxUeXBlLnBmdE5vblplcm9cclxuICApO1xyXG5cclxuICB2YXIgYXJlYXMgPSBOYXZNZXNoLl9nZW9tZXRyeS5nZXRBcmVhcyhwYXRocywgc2NhbGUpO1xyXG4gIC8vIE1ha2UgcG9seXMgZnJvbSBuZXcgc3BhY2UuXHJcbiAgdmFyIHBvbHlzID0gTmF2TWVzaC5fZ2VvbWV0cnkucGFydGl0aW9uQXJlYXMoYXJlYXMpO1xyXG5cclxuICAvLyBBZGQgdG8gZXhpc3RpbmcgcG9seWdvbnMuXHJcbiAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5wb2x5cywgcG9seXMpO1xyXG5cclxuICB0aGlzLl91cGRhdGUodGhpcy5wb2x5cywgcG9seXMsIGludGVyc2VjdGlvbi5pbmRpY2VzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBPZmZzZXR0aW5nIGZ1bmN0aW9uIGZvciBkeW5hbWljIG9ic3RhY2xlcy5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheS48UG9seT59IG9ic3RhY2xlc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gW29mZnNldD0xNl1cclxuICogQHJldHVybiB7QXJyYXkuPFBvbHk+fVxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX29mZnNldER5bmFtaWNPYnMgPSBmdW5jdGlvbihvYnN0YWNsZXMsIG9mZnNldCkge1xyXG4gIGlmICh0eXBlb2Ygb2Zmc2V0ID09ICd1bmRlZmluZWQnKSBvZmZzZXQgPSAxNjtcclxuICB2YXIgc2NhbGUgPSAxMDA7XHJcbiAgb2JzdGFjbGVzID0gb2JzdGFjbGVzLm1hcChOYXZNZXNoLl9nZW9tZXRyeS5jb252ZXJ0UG9seVRvQ2xpcHBlcik7XHJcbiAgQ2xpcHBlckxpYi5KUy5TY2FsZVVwUGF0aHMob2JzdGFjbGVzLCBzY2FsZSk7XHJcblxyXG4gIHZhciBjcHIgPSBOYXZNZXNoLl9nZW9tZXRyeS5jcHI7XHJcbiAgdmFyIGNvID0gTmF2TWVzaC5fZ2VvbWV0cnkuY287XHJcblxyXG4gIC8vIE1lcmdlIG9ic3RhY2xlcyB0b2dldGhlciwgc28gb2JzdGFjbGVzIHRoYXQgc2hhcmUgYSBjb21tb24gZWRnZVxyXG4gIC8vIHdpbGwgYmUgZXhwYW5kZWQgcHJvcGVybHkuXHJcbiAgY3ByLkNsZWFyKCk7XHJcbiAgY3ByLkFkZFBhdGhzKG9ic3RhY2xlcywgQ2xpcHBlckxpYi5Qb2x5VHlwZS5wdFN1YmplY3QsIHRydWUpO1xyXG4gIHZhciBtZXJnZWRfb2JzdGFjbGVzID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuICBjcHIuRXhlY3V0ZShcclxuICAgIENsaXBwZXJMaWIuQ2xpcFR5cGUuY3RVbmlvbixcclxuICAgIG1lcmdlZF9vYnN0YWNsZXMsXHJcbiAgICBDbGlwcGVyTGliLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvLFxyXG4gICAgbnVsbCk7XHJcblxyXG4gIC8vIE9mZnNldCBvYnN0YWNsZXMuXHJcbiAgdmFyIG9mZnNldHRlZF9wYXRocyA9IG5ldyBDbGlwcGVyTGliLlBhdGhzKCk7XHJcblxyXG4gIG1lcmdlZF9vYnN0YWNsZXMuZm9yRWFjaChmdW5jdGlvbihvYnN0YWNsZSkge1xyXG4gICAgdmFyIG9mZnNldHRlZF9vYnN0YWNsZSA9IG5ldyBDbGlwcGVyTGliLlBhdGhzKCk7XHJcbiAgICBjby5DbGVhcigpO1xyXG4gICAgY28uQWRkUGF0aChvYnN0YWNsZSwgQ2xpcHBlckxpYi5Kb2luVHlwZS5qdE1pdGVyLCBDbGlwcGVyTGliLkVuZFR5cGUuZXRDbG9zZWRQb2x5Z29uKTtcclxuICAgIGNvLkV4ZWN1dGUob2Zmc2V0dGVkX29ic3RhY2xlLCBvZmZzZXQgKiBzY2FsZSk7XHJcbiAgICBvZmZzZXR0ZWRfcGF0aHMucHVzaChvZmZzZXR0ZWRfb2JzdGFjbGVbMF0pO1xyXG4gIH0pO1xyXG5cclxuICAvLyBNZXJnZSBhbnkgbmV3bHktb3ZlcmxhcHBpbmcgb2JzdGFjbGVzLlxyXG4gIGNwci5DbGVhcigpO1xyXG4gIGNwci5BZGRQYXRocyhvZmZzZXR0ZWRfcGF0aHMsIENsaXBwZXJMaWIuUG9seVR5cGUucHRTdWJqZWN0LCB0cnVlKTtcclxuICBtZXJnZWRfb2JzdGFjbGVzID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuICBjcHIuRXhlY3V0ZShcclxuICAgIENsaXBwZXJMaWIuQ2xpcFR5cGUuY3RVbmlvbixcclxuICAgIG1lcmdlZF9vYnN0YWNsZXMsXHJcbiAgICBDbGlwcGVyTGliLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvLFxyXG4gICAgbnVsbCk7XHJcbiAgcmV0dXJuIG1lcmdlZF9vYnN0YWNsZXM7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IGFuZCByZW1vdmUgdGhlIG1lc2ggcG9seWdvbnMgaW1wYWN0ZWQgYnkgdGhlIGFkZGl0aW9uIG9mIG5ld1xyXG4gKiBvYnN0YWNsZXMuIFRoZSBwcm92aWRlZCBvYnN0YWNsZXMgc2hvdWxkIGFscmVhZHkgYmUgb2Zmc2V0dGVkLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gb2JzdGFjbGVzIC0gVGhlIG9mZnNldHRlZCBvYnN0YWNsZXMgdG8gZ2V0XHJcbiAqICAgdGhlIGludGVyc2VjdGlvbiBvZi4gTXVzdCBiZSBjb252ZXguXHJcbiAqIEByZXR1cm4ge0FycmF5LjxQb2x5Pn0gLSBUaGUgYWZmZWN0ZWQgcG9seXMuXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5fZ2V0SW50ZXJzZWN0ZWRQb2x5cyA9IGZ1bmN0aW9uKG9ic3RhY2xlcykge1xyXG4gIHZhciBpbnRlcnNlY3RlZEluZGljZXMgPSBOYXZNZXNoLl9nZW9tZXRyeS5nZXRJbnRlcnNlY3Rpb25zKG9ic3RhY2xlcywgdGhpcy5wb2x5cyk7XHJcbiAgcmV0dXJuIHtcclxuICAgIGluZGljZXM6IGludGVyc2VjdGVkSW5kaWNlcyxcclxuICAgIHBvbHlzOiBOYXZNZXNoLl91dGlsLnNwbGljZSh0aGlzLnBvbHlzLCBpbnRlcnNlY3RlZEluZGljZXMpXHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIGltcGFzc2FibGUgdGlsZXMgYm9yZGVyaW5nIHVwZGF0ZWQgcGFzc2FibGUgdGlsZXMuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFRpbGVVcGRhdGU+fSB0aWxlcyAtIFRoZSB1cGRhdGVkIHBhc3NhYmxlIHRpbGVzLlxyXG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXlMb2M+fSAtIFRoZSBuZXcgYXJyYXkgbG9jYXRpb25zLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX2dldEJvcmRlcmVkVGlsZXMgPSBmdW5jdGlvbih0aWxlcykge1xyXG4gIC8vIFRyYWNrIGxvY2F0aW9ucyBhbHJlYWR5IGJlaW5nIHVwZGF0ZWQgb3IgYWRkZWQuXHJcbiAgdmFyIGxvY2F0aW9ucyA9IHt9O1xyXG4gIHRpbGVzLmZvckVhY2goZnVuY3Rpb24odGlsZSkge1xyXG4gICAgbG9jYXRpb25zW1BvaW50LnRvU3RyaW5nKHRpbGUpXSA9IHRydWU7XHJcbiAgfSk7XHJcblxyXG4gIHZhciBtYXAgPSB0aGlzLm1hcDtcclxuICB2YXIgeFVwcGVyQm91bmQgPSBtYXAubGVuZ3RoO1xyXG4gIHZhciB5VXBwZXJCb3VuZCA9IG1hcFswXS5sZW5ndGg7XHJcbiAgLy8gR2V0IHRoZSBsb2NhdGlvbnMgYWRqYWNlbnQgdG8gYSBnaXZlbiB0aWxlIGluIHRoZSBtYXAuXHJcbiAgdmFyIGdldEFkamFjZW50ID0gZnVuY3Rpb24odGlsZSkge1xyXG4gICAgdmFyIHggPSB0aWxlLng7XHJcbiAgICB2YXIgeSA9IHRpbGUueTtcclxuICAgIHZhciB4VXAgPSB4ICsgMSA8IHhVcHBlckJvdW5kO1xyXG4gICAgdmFyIHhEb3duID0geCA+PSAwO1xyXG4gICAgdmFyIHlVcCA9IHkgKyAxIDwgeVVwcGVyQm91bmQ7XHJcbiAgICB2YXIgeURvd24gPSB5ID49IDA7XHJcblxyXG4gICAgdmFyIGFkamFjZW50cyA9IFtdO1xyXG4gICAgaWYgKHhVcCkge1xyXG4gICAgICBhZGphY2VudHMucHVzaCh7eDogeCArIDEsIHk6IHl9KTtcclxuICAgICAgaWYgKHlVcCkge1xyXG4gICAgICAgIGFkamFjZW50cy5wdXNoKHt4OiB4ICsgMSwgeTogeSArIDF9KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoeURvd24pIHtcclxuICAgICAgICBhZGphY2VudHMucHVzaCh7eDogeCArIDEsIHk6IHkgLSAxfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh4RG93bikge1xyXG4gICAgICBhZGphY2VudHMucHVzaCh7eDogeCAtIDEsIHk6IHl9KTtcclxuICAgICAgaWYgKHlVcCkge1xyXG4gICAgICAgIGFkamFjZW50cy5wdXNoKHt4OiB4IC0gMSwgeTogeSArIDF9KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoeURvd24pIHtcclxuICAgICAgICBhZGphY2VudHMucHVzaCh7eDogeCAtIDEsIHk6IHkgLSAxfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh5VXApIHtcclxuICAgICAgYWRqYWNlbnRzLnB1c2goe3g6IHgsIHk6IHkgKyAxfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoeURvd24pIHtcclxuICAgICAgYWRqYWNlbnRzLnB1c2goe3g6IHgsIHk6IHkgLSAxfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYWRqYWNlbnRzO1xyXG4gIH07XHJcblxyXG4gIC8vIFN0b3JlIGFkamFjZW50IGltcGFzc2FibGUgdGlsZXMuXHJcbiAgdmFyIGFkamFjZW50X3RpbGVzID0gW107XHJcbiAgdGlsZXMuZm9yRWFjaChmdW5jdGlvbih0aWxlKSB7XHJcbiAgICB2YXIgYWRqYWNlbnRzID0gZ2V0QWRqYWNlbnQodGlsZSk7XHJcbiAgICBhZGphY2VudHMuZm9yRWFjaChmdW5jdGlvbihhZGphY2VudCkge1xyXG4gICAgICB2YXIgaWQgPSBQb2ludC50b1N0cmluZyhhZGphY2VudCk7XHJcbiAgICAgIGlmICghbG9jYXRpb25zW2lkXSkge1xyXG4gICAgICAgIC8vIFJlY29yZCBhcyBoYXZpbmcgYmVlbiBzZWVuLlxyXG4gICAgICAgIGxvY2F0aW9uc1tpZF0gPSB0cnVlO1xyXG4gICAgICAgIHZhciB2YWwgPSB0aGlzLm1hcFthZGphY2VudC54XVthZGphY2VudC55XTtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzUGFzc2FibGUodmFsKSkge1xyXG4gICAgICAgICAgYWRqYWNlbnQudiA9IHZhbDtcclxuICAgICAgICAgIGFkamFjZW50X3RpbGVzLnB1c2goYWRqYWNlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSwgdGhpcyk7XHJcbiAgfSwgdGhpcyk7XHJcbiAgcmV0dXJuIGFkamFjZW50X3RpbGVzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgdGhlIG91dGxpbmUgb2YgYSBzaGFwZSBhbG9uZyB3aXRoIGl0cyBob2xlcy5cclxuICogQHR5cGVkZWYgTWFwQXJlYVxyXG4gKiBAdHlwZSB7b2JqZWN0fVxyXG4gKiBAcHJvcGVydHkge1BvbHl9IHBvbHlnb24gLSBUaGUgcG9seWdvbiBkZWZpbmluZyB0aGUgZXh0ZXJpb3Igb2ZcclxuICogICB0aGUgc2hhcGUuXHJcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPFBvbHk+fSBob2xlcyAtIFRoZSBob2xlcyBvZiB0aGUgc2hhcGUuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIE9mZnNldCB0aGUgcG9seWdvbnMgc3VjaCB0aGF0IHRoZXJlIGlzIGEgYG9mZnNldGAgdW5pdCBidWZmZXJcclxuICogYmV0d2VlbiB0aGUgc2lkZXMgb2YgdGhlIG91dGxpbmUgYW5kIGFyb3VuZCB0aGUgb2JzdGFjbGVzLiBUaGlzXHJcbiAqIGJ1ZmZlciBtYWtlcyBpdCBzbyB0aGF0IHRoZSBtZXNoIHRydWx5IHJlcHJlc2VudHMgdGhlIG1vdmFibGUgYXJlYVxyXG4gKiBpbiB0aGUgbWFwLiBBc3N1bWVzIHZlcnRpY2VzIGRlZmluaW5nIGludGVyaW9yIHNoYXBlcyAobGlrZSB0aGVcclxuICogbWFpbiBvdXRsaW5lIG9mIGFuIGVuY2xvc2VkIG1hcCkgYXJlIGdpdmVuIGluIENDVyBvcmRlciBhbmRcclxuICogb2JzdGFjbGVzIGFyZSBnaXZlbiBpbiBDVyBvcmRlci5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheS48UG9seT59IHBvbHlzIC0gVGhlIHBvbHlnb25zIHRvIG9mZnNldC5cclxuICogQHBhcmFtIHtudW1iZXJ9IFtvZmZzZXQ9MTZdIC0gVGhlIGFtb3VudCB0byBvZmZzZXQgdGhlIHBvbHlnb25zXHJcbiAqICAgZnJvbSB0aGUgbW92YWJsZSBhcmVhcy5cclxuICogQHJldHVybiB7QXJyYXkuPE1hcEFyZWE+fSAtIFRoZSBzaGFwZXMgZGVmaW5pbmcgdGhlIHBvbHlnb25zIGFmdGVyXHJcbiAqICAgb2Zmc2V0dGluZyBhbmQgbWVyZ2luZy5cclxuICovXHJcbk5hdk1lc2gucHJvdG90eXBlLl9vZmZzZXRQb2x5cyA9IGZ1bmN0aW9uKHN0YXRpY19vYmplY3RzLCBvZmZzZXQpIHtcclxuICAvLyB+PSBiYWxsIHJhZGl1cyAvIDJcclxuICBpZiAodHlwZW9mIG9mZnNldCA9PSAndW5kZWZpbmVkJykgb2Zmc2V0ID0gMTY7XHJcblxyXG4gIC8vIFNlcGFyYXRlIGludGVyaW9yIGFuZCBleHRlcmlvciB3YWxscy4gVGhlIENDVyBzaGFwZXMgY29ycmVzcG9uZFxyXG4gIC8vIHRvIHRoZSBpbnRlcmlvciB3YWxsIG91dGxpbmVzIG9mIG91dCBtYXAsIHRoZSBDVyBzaGFwZXMgYXJlIHdhbGxzXHJcbiAgLy8gdGhhdCB3ZXJlIHRyYWNlZCBvbiB0aGVpciBvdXRzaWRlLlxyXG4gIHZhciBpbnRlcmlvcl93YWxscyA9IFtdO1xyXG4gIHZhciBleHRlcmlvcl93YWxscyA9IHN0YXRpY19vYmplY3RzLndhbGxzLmZpbHRlcihmdW5jdGlvbihwb2x5LCBpbmRleCkge1xyXG4gICAgaWYgKHBvbHkuZ2V0T3JpZW50YXRpb24oKSA9PSBcIkNDV1wiKSB7XHJcbiAgICAgIGludGVyaW9yX3dhbGxzLnB1c2gocG9seSk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0pO1xyXG5cclxuICB2YXIgc2NhbGUgPSAxMDA7XHJcbiAgXHJcbiAgLy8gT2Zmc2V0IHRoZSBpbnRlcmlvciB3YWxscy5cclxuICBpbnRlcmlvcl93YWxscyA9IGludGVyaW9yX3dhbGxzLm1hcChOYXZNZXNoLl9nZW9tZXRyeS5jb252ZXJ0UG9seVRvQ2xpcHBlcik7XHJcbiAgQ2xpcHBlckxpYi5KUy5TY2FsZVVwUGF0aHMoaW50ZXJpb3Jfd2FsbHMsIHNjYWxlKTtcclxuICBcclxuICB2YXIgb2Zmc2V0dGVkX2ludGVyaW9yX3dhbGxzID0gW107XHJcbiAgaW50ZXJpb3Jfd2FsbHMuZm9yRWFjaChmdW5jdGlvbih3YWxsKSB7XHJcbiAgICB2YXIgb2Zmc2V0dGVkX3BhdGhzID0gTmF2TWVzaC5fZ2VvbWV0cnkub2Zmc2V0SW50ZXJpb3Iod2FsbCwgb2Zmc2V0KTtcclxuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9mZnNldHRlZF9pbnRlcmlvcl93YWxscywgb2Zmc2V0dGVkX3BhdGhzKTtcclxuICB9KTtcclxuXHJcbiAgLy8gUmV2ZXJzZSBwYXRocyBzaW5jZSBmcm9tIGhlcmUgb24gd2UncmUgZ29pbmcgdG8gdHJlYXQgdGhlXHJcbiAgLy8gb3V0bGluZXMgYXMgdGhlIGV4dGVyaW9yIG9mIGEgc2hhcGUuXHJcbiAgb2Zmc2V0dGVkX2ludGVyaW9yX3dhbGxzLmZvckVhY2goZnVuY3Rpb24ocGF0aCkge1xyXG4gICAgcGF0aC5yZXZlcnNlKCk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgZXh0ZXJpb3Jfd2FsbHMgPSBleHRlcmlvcl93YWxscy5tYXAoTmF2TWVzaC5fZ2VvbWV0cnkuY29udmVydFBvbHlUb0NsaXBwZXIpO1xyXG5cclxuICBDbGlwcGVyTGliLkpTLlNjYWxlVXBQYXRocyhleHRlcmlvcl93YWxscywgc2NhbGUpO1xyXG5cclxuICAvL3ZhciBjcHIgPSBuZXcgQ2xpcHBlckxpYi5DbGlwcGVyKCk7XHJcbiAgdmFyIGNwciA9IE5hdk1lc2guX2dlb21ldHJ5LmNwcjtcclxuICB2YXIgY28gPSBOYXZNZXNoLl9nZW9tZXRyeS5jbztcclxuICBcclxuICB2YXIgd2FsbF9maWxsVHlwZSA9IENsaXBwZXJMaWIuUG9seUZpbGxUeXBlLnBmdEV2ZW5PZGQ7XHJcbiAgdmFyIG9ic3RhY2xlX2ZpbGxUeXBlID0gQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybztcclxuICBcclxuICAvLyBPZmZzZXQgZXh0ZXJpb3Igd2FsbHMuXHJcbiAgdmFyIG9mZnNldHRlZF9leHRlcmlvcl93YWxscyA9IFtdO1xyXG5cclxuICBleHRlcmlvcl93YWxscy5mb3JFYWNoKGZ1bmN0aW9uKHdhbGwpIHtcclxuICAgIHZhciBvZmZzZXR0ZWRfZXh0ZXJpb3Jfd2FsbCA9IG5ldyBDbGlwcGVyTGliLlBhdGhzKCk7XHJcbiAgICBjby5DbGVhcigpO1xyXG4gICAgY28uQWRkUGF0aCh3YWxsLCBDbGlwcGVyTGliLkpvaW5UeXBlLmp0U3F1YXJlLCBDbGlwcGVyTGliLkVuZFR5cGUuZXRDbG9zZWRQb2x5Z29uKTtcclxuICAgIGNvLkV4ZWN1dGUob2Zmc2V0dGVkX2V4dGVyaW9yX3dhbGwsIG9mZnNldCAqIHNjYWxlKTtcclxuICAgIG9mZnNldHRlZF9leHRlcmlvcl93YWxscy5wdXNoKG9mZnNldHRlZF9leHRlcmlvcl93YWxsWzBdKTtcclxuICB9KTtcclxuICBcclxuICAvLyBPZmZzZXQgb2JzdGFjbGVzLlxyXG4gIC8vIE9ic3RhY2xlcyBhcmUgb2Zmc2V0dGVkIHVzaW5nIG1pdGVyIGpvaW4gdHlwZSB0byBhdm9pZFxyXG4gIC8vIHVubmVjZXNzYXJ5IHNtYWxsIGVkZ2VzLlxyXG4gIHZhciBvZmZzZXR0ZWRfb2JzdGFjbGVzID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuXHJcbiAgdmFyIG9ic3RhY2xlcyA9IHN0YXRpY19vYmplY3RzLm9ic3RhY2xlcy5tYXAoTmF2TWVzaC5fZ2VvbWV0cnkuY29udmVydFBvbHlUb0NsaXBwZXIpO1xyXG4gIENsaXBwZXJMaWIuSlMuU2NhbGVVcFBhdGhzKG9ic3RhY2xlcywgc2NhbGUpO1xyXG4gIGNvLkNsZWFyKCk7XHJcbiAgY28uQWRkUGF0aHMob2JzdGFjbGVzLCBDbGlwcGVyTGliLkpvaW5UeXBlLmp0TWl0ZXIsIENsaXBwZXJMaWIuRW5kVHlwZS5ldENsb3NlZFBvbHlnb24pO1xyXG4gIGNvLkV4ZWN1dGUob2Zmc2V0dGVkX29ic3RhY2xlcywgb2Zmc2V0ICogc2NhbGUpO1xyXG5cclxuICAvLyBUYWtlIGRpZmZlcmVuY2Ugb2YgcG9seWdvbnMgZGVmaW5pbmcgaW50ZXJpb3Igd2FsbCBhbmQgcG9seWdvbnNcclxuICAvLyBkZWZpbmluZyBleHRlcmlvciB3YWxscywgbGltaXRpbmcgdG8gZXh0ZXJpb3Igd2FsbCBwb2x5Z29ucyB3aG9zZVxyXG4gIC8vIGFyZWEgaXMgbGVzcyB0aGFuIHRoZSBpbnRlcmlvciB3YWxsIHBvbHlnb25zIHNvIHRoZSBkaWZmZXJlbmNlXHJcbiAgLy8gb3BlcmF0aW9uIGRvZXNuJ3QgcmVtb3ZlIHBvdGVudGlhbGx5IHRyYXZlcnNhYmxlIGFyZWFzLlxyXG4gIHZhciBtZXJnZWRfcGF0aHMgPSBbXTtcclxuICBvZmZzZXR0ZWRfaW50ZXJpb3Jfd2FsbHMuZm9yRWFjaChmdW5jdGlvbih3YWxsKSB7XHJcbiAgICB2YXIgYXJlYSA9IENsaXBwZXJMaWIuSlMuQXJlYU9mUG9seWdvbih3YWxsLCBzY2FsZSk7XHJcbiAgICB2YXIgc21hbGxlcl9leHRlcmlvcl93YWxscyA9IG9mZnNldHRlZF9leHRlcmlvcl93YWxscy5maWx0ZXIoZnVuY3Rpb24oZXh0X3dhbGwpIHtcclxuICAgICAgcmV0dXJuIENsaXBwZXJMaWIuSlMuQXJlYU9mUG9seWdvbihleHRfd2FsbCwgc2NhbGUpIDwgYXJlYTtcclxuICAgIH0pO1xyXG4gICAgdmFyIHBhdGhzID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuICAgIGNwci5DbGVhcigpO1xyXG4gICAgY3ByLkFkZFBhdGgod2FsbCwgQ2xpcHBlckxpYi5Qb2x5VHlwZS5wdFN1YmplY3QsIHRydWUpO1xyXG4gICAgY3ByLkFkZFBhdGhzKHNtYWxsZXJfZXh0ZXJpb3Jfd2FsbHMsIENsaXBwZXJMaWIuUG9seVR5cGUucHRDbGlwLCB0cnVlKTtcclxuICAgIC8vIE9ic3RhY2xlcyBhcmUgc21hbGwgaW5kaXZpZHVhbCBzb2xpZCBvYmplY3RzIHRoYXQgYXJlbid0IGF0XHJcbiAgICAvLyByaXNrIG9mIGVuY2xvc2luZyBhbiBpbnRlcmlvciBhcmVhLlxyXG4gICAgY3ByLkFkZFBhdGhzKG9mZnNldHRlZF9vYnN0YWNsZXMsIENsaXBwZXJMaWIuUG9seVR5cGUucHRDbGlwLCB0cnVlKTtcclxuICAgIGNwci5FeGVjdXRlKENsaXBwZXJMaWIuQ2xpcFR5cGUuY3REaWZmZXJlbmNlLFxyXG4gICAgICBwYXRocyxcclxuICAgICAgQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybyxcclxuICAgICAgQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVyb1xyXG4gICAgKTtcclxuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG1lcmdlZF9wYXRocywgcGF0aHMpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gTmF2TWVzaC5fZ2VvbWV0cnkuZ2V0QXJlYXMobWVyZ2VkX3BhdGhzLCBzY2FsZSk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0cyB1cCBjYWxsYmFja3Mgb24gdGhlIHdlYiB3b3JrZXIgcHJvbWlzZSBvYmplY3QgdG8gaW5pdGlhbGl6ZVxyXG4gKiB0aGUgd2ViIHdvcmtlciBpbnRlcmZhY2Ugb25jZSBsb2FkZWQuXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5fc2V0dXBXb3JrZXIgPSBmdW5jdGlvbigpIHtcclxuICAvLyBJbml0aWFsIHN0YXRlLlxyXG4gIHRoaXMud29ya2VyID0gbmV3IFdvcmtlcih3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbJyhmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlIFxcJ1wiK28rXCJcXCdcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XFxuKGZ1bmN0aW9uIChnbG9iYWwpe1xcbiFmdW5jdGlvbih0KXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSltb2R1bGUuZXhwb3J0cz10KCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtdLHQpO2Vsc2V7dmFyIGU7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz9lPXdpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2U9Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiYoZT1zZWxmKSxlLlByaW9yaXR5UXVldWU9dCgpfX0oZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24gdChlLGkscil7ZnVuY3Rpb24gbyhuLHMpe2lmKCFpW25dKXtpZighZVtuXSl7dmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighcyYmdSlyZXR1cm4gdShuLCEwKTtpZihhKXJldHVybiBhKG4sITApO3ZhciBoPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSBcXCdcIituK1wiXFwnXCIpO3Rocm93IGguY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixofXZhciBwPWlbbl09e2V4cG9ydHM6e319O2Vbbl1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24odCl7dmFyIGk9ZVtuXVsxXVt0XTtyZXR1cm4gbyhpP2k6dCl9LHAscC5leHBvcnRzLHQsZSxpLHIpfXJldHVybiBpW25dLmV4cG9ydHN9Zm9yKHZhciBhPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsbj0wO248ci5sZW5ndGg7bisrKW8ocltuXSk7cmV0dXJuIG99KHsxOltmdW5jdGlvbih0LGUpe3ZhciBpLHIsbyxhLG4scz17fS5oYXNPd25Qcm9wZXJ0eSx1PWZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gaSgpe3RoaXMuY29uc3RydWN0b3I9dH1mb3IodmFyIHIgaW4gZSlzLmNhbGwoZSxyKSYmKHRbcl09ZVtyXSk7cmV0dXJuIGkucHJvdG90eXBlPWUucHJvdG90eXBlLHQucHJvdG90eXBlPW5ldyBpLHQuX19zdXBlcl9fPWUucHJvdG90eXBlLHR9O2k9dChcIi4vUHJpb3JpdHlRdWV1ZS9BYnN0cmFjdFByaW9yaXR5UXVldWVcIikscj10KFwiLi9Qcmlvcml0eVF1ZXVlL0FycmF5U3RyYXRlZ3lcIiksYT10KFwiLi9Qcmlvcml0eVF1ZXVlL0JpbmFyeUhlYXBTdHJhdGVneVwiKSxvPXQoXCIuL1ByaW9yaXR5UXVldWUvQkhlYXBTdHJhdGVneVwiKSxuPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCl7dHx8KHQ9e30pLHQuc3RyYXRlZ3l8fCh0LnN0cmF0ZWd5PWEpLHQuY29tcGFyYXRvcnx8KHQuY29tcGFyYXRvcj1mdW5jdGlvbih0LGUpe3JldHVybih0fHwwKS0oZXx8MCl9KSxlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsdCl9cmV0dXJuIHUoZSx0KSxlfShpKSxuLkFycmF5U3RyYXRlZ3k9cixuLkJpbmFyeUhlYXBTdHJhdGVneT1hLG4uQkhlYXBTdHJhdGVneT1vLGUuZXhwb3J0cz1ufSx7XCIuL1ByaW9yaXR5UXVldWUvQWJzdHJhY3RQcmlvcml0eVF1ZXVlXCI6MixcIi4vUHJpb3JpdHlRdWV1ZS9BcnJheVN0cmF0ZWd5XCI6MyxcIi4vUHJpb3JpdHlRdWV1ZS9CSGVhcFN0cmF0ZWd5XCI6NCxcIi4vUHJpb3JpdHlRdWV1ZS9CaW5hcnlIZWFwU3RyYXRlZ3lcIjo1fV0sMjpbZnVuY3Rpb24odCxlKXt2YXIgaTtlLmV4cG9ydHM9aT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCl7aWYobnVsbD09KG51bGwhPXQ/dC5zdHJhdGVneTp2b2lkIDApKXRocm93XCJNdXN0IHBhc3Mgb3B0aW9ucy5zdHJhdGVneSwgYSBzdHJhdGVneVwiO2lmKG51bGw9PShudWxsIT10P3QuY29tcGFyYXRvcjp2b2lkIDApKXRocm93XCJNdXN0IHBhc3Mgb3B0aW9ucy5jb21wYXJhdG9yLCBhIGNvbXBhcmF0b3JcIjt0aGlzLnByaXY9bmV3IHQuc3RyYXRlZ3kodCksdGhpcy5sZW5ndGg9MH1yZXR1cm4gdC5wcm90b3R5cGUucXVldWU9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMubGVuZ3RoKyssdm9pZCB0aGlzLnByaXYucXVldWUodCl9LHQucHJvdG90eXBlLmRlcXVldWU9ZnVuY3Rpb24oKXtpZighdGhpcy5sZW5ndGgpdGhyb3dcIkVtcHR5IHF1ZXVlXCI7cmV0dXJuIHRoaXMubGVuZ3RoLS0sdGhpcy5wcml2LmRlcXVldWUoKX0sdC5wcm90b3R5cGUucGVlaz1mdW5jdGlvbigpe2lmKCF0aGlzLmxlbmd0aCl0aHJvd1wiRW1wdHkgcXVldWVcIjtyZXR1cm4gdGhpcy5wcml2LnBlZWsoKX0sdH0oKX0se31dLDM6W2Z1bmN0aW9uKHQsZSl7dmFyIGkscjtyPWZ1bmN0aW9uKHQsZSxpKXt2YXIgcixvLGE7Zm9yKG89MCxyPXQubGVuZ3RoO3I+bzspYT1vK3I+Pj4xLGkodFthXSxlKT49MD9vPWErMTpyPWE7cmV0dXJuIG99LGUuZXhwb3J0cz1pPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0KXt2YXIgZTt0aGlzLm9wdGlvbnM9dCx0aGlzLmNvbXBhcmF0b3I9dGhpcy5vcHRpb25zLmNvbXBhcmF0b3IsdGhpcy5kYXRhPShudWxsIT0oZT10aGlzLm9wdGlvbnMuaW5pdGlhbFZhbHVlcyk/ZS5zbGljZSgwKTp2b2lkIDApfHxbXSx0aGlzLmRhdGEuc29ydCh0aGlzLmNvbXBhcmF0b3IpLnJldmVyc2UoKX1yZXR1cm4gdC5wcm90b3R5cGUucXVldWU9ZnVuY3Rpb24odCl7dmFyIGU7cmV0dXJuIGU9cih0aGlzLmRhdGEsdCx0aGlzLmNvbXBhcmF0b3IpLHZvaWQgdGhpcy5kYXRhLnNwbGljZShlLDAsdCl9LHQucHJvdG90eXBlLmRlcXVldWU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kYXRhLnBvcCgpfSx0LnByb3RvdHlwZS5wZWVrPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZGF0YVt0aGlzLmRhdGEubGVuZ3RoLTFdfSx0fSgpfSx7fV0sNDpbZnVuY3Rpb24odCxlKXt2YXIgaTtlLmV4cG9ydHM9aT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCl7dmFyIGUsaSxyLG8sYSxuLHMsdSxoO2Zvcih0aGlzLmNvbXBhcmF0b3I9KG51bGwhPXQ/dC5jb21wYXJhdG9yOnZvaWQgMCl8fGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQtZX0sdGhpcy5wYWdlU2l6ZT0obnVsbCE9dD90LnBhZ2VTaXplOnZvaWQgMCl8fDUxMix0aGlzLmxlbmd0aD0wLHI9MDsxPDxyPHRoaXMucGFnZVNpemU7KXIrPTE7aWYoMTw8ciE9PXRoaXMucGFnZVNpemUpdGhyb3dcInBhZ2VTaXplIG11c3QgYmUgYSBwb3dlciBvZiB0d29cIjtmb3IodGhpcy5fc2hpZnQ9cix0aGlzLl9lbXB0eU1lbW9yeVBhZ2VUZW1wbGF0ZT1lPVtdLGk9YT0wLHU9dGhpcy5wYWdlU2l6ZTt1Pj0wP3U+YTphPnU7aT11Pj0wPysrYTotLWEpZS5wdXNoKG51bGwpO2lmKHRoaXMuX21lbW9yeT1bXSx0aGlzLl9tYXNrPXRoaXMucGFnZVNpemUtMSx0LmluaXRpYWxWYWx1ZXMpZm9yKGg9dC5pbml0aWFsVmFsdWVzLG49MCxzPWgubGVuZ3RoO3M+bjtuKyspbz1oW25dLHRoaXMucXVldWUobyl9cmV0dXJuIHQucHJvdG90eXBlLnF1ZXVlPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmxlbmd0aCs9MSx0aGlzLl93cml0ZSh0aGlzLmxlbmd0aCx0KSx2b2lkIHRoaXMuX2J1YmJsZVVwKHRoaXMubGVuZ3RoLHQpfSx0LnByb3RvdHlwZS5kZXF1ZXVlPWZ1bmN0aW9uKCl7dmFyIHQsZTtyZXR1cm4gdD10aGlzLl9yZWFkKDEpLGU9dGhpcy5fcmVhZCh0aGlzLmxlbmd0aCksdGhpcy5sZW5ndGgtPTEsdGhpcy5sZW5ndGg+MCYmKHRoaXMuX3dyaXRlKDEsZSksdGhpcy5fYnViYmxlRG93bigxLGUpKSx0fSx0LnByb3RvdHlwZS5wZWVrPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3JlYWQoMSl9LHQucHJvdG90eXBlLl93cml0ZT1mdW5jdGlvbih0LGUpe3ZhciBpO2ZvcihpPXQ+PnRoaXMuX3NoaWZ0O2k+PXRoaXMuX21lbW9yeS5sZW5ndGg7KXRoaXMuX21lbW9yeS5wdXNoKHRoaXMuX2VtcHR5TWVtb3J5UGFnZVRlbXBsYXRlLnNsaWNlKDApKTtyZXR1cm4gdGhpcy5fbWVtb3J5W2ldW3QmdGhpcy5fbWFza109ZX0sdC5wcm90b3R5cGUuX3JlYWQ9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX21lbW9yeVt0Pj50aGlzLl9zaGlmdF1bdCZ0aGlzLl9tYXNrXX0sdC5wcm90b3R5cGUuX2J1YmJsZVVwPWZ1bmN0aW9uKHQsZSl7dmFyIGkscixvLGE7Zm9yKGk9dGhpcy5jb21wYXJhdG9yO3Q+MSYmKHI9dCZ0aGlzLl9tYXNrLHQ8dGhpcy5wYWdlU2l6ZXx8cj4zP289dCZ+dGhpcy5fbWFza3xyPj4xOjI+cj8obz10LXRoaXMucGFnZVNpemU+PnRoaXMuX3NoaWZ0LG8rPW8mfih0aGlzLl9tYXNrPj4xKSxvfD10aGlzLnBhZ2VTaXplPj4xKTpvPXQtMixhPXRoaXMuX3JlYWQobyksIShpKGEsZSk8MCkpOyl0aGlzLl93cml0ZShvLGUpLHRoaXMuX3dyaXRlKHQsYSksdD1vO3JldHVybiB2b2lkIDB9LHQucHJvdG90eXBlLl9idWJibGVEb3duPWZ1bmN0aW9uKHQsZSl7dmFyIGkscixvLGEsbjtmb3Iobj10aGlzLmNvbXBhcmF0b3I7dDx0aGlzLmxlbmd0aDspaWYodD50aGlzLl9tYXNrJiYhKHQmdGhpcy5fbWFzay0xKT9pPXI9dCsyOnQmdGhpcy5wYWdlU2l6ZT4+MT8oaT0odCZ+dGhpcy5fbWFzayk+PjEsaXw9dCZ0aGlzLl9tYXNrPj4xLGk9aSsxPDx0aGlzLl9zaGlmdCxyPWkrMSk6KGk9dCsodCZ0aGlzLl9tYXNrKSxyPWkrMSksaSE9PXImJnI8PXRoaXMubGVuZ3RoKWlmKG89dGhpcy5fcmVhZChpKSxhPXRoaXMuX3JlYWQociksbihvLGUpPDAmJm4obyxhKTw9MCl0aGlzLl93cml0ZShpLGUpLHRoaXMuX3dyaXRlKHQsbyksdD1pO2Vsc2V7aWYoIShuKGEsZSk8MCkpYnJlYWs7dGhpcy5fd3JpdGUocixlKSx0aGlzLl93cml0ZSh0LGEpLHQ9cn1lbHNle2lmKCEoaTw9dGhpcy5sZW5ndGgpKWJyZWFrO2lmKG89dGhpcy5fcmVhZChpKSwhKG4obyxlKTwwKSlicmVhazt0aGlzLl93cml0ZShpLGUpLHRoaXMuX3dyaXRlKHQsbyksdD1pfXJldHVybiB2b2lkIDB9LHR9KCl9LHt9XSw1OltmdW5jdGlvbih0LGUpe3ZhciBpO2UuZXhwb3J0cz1pPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0KXt2YXIgZTt0aGlzLmNvbXBhcmF0b3I9KG51bGwhPXQ/dC5jb21wYXJhdG9yOnZvaWQgMCl8fGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQtZX0sdGhpcy5sZW5ndGg9MCx0aGlzLmRhdGE9KG51bGwhPShlPXQuaW5pdGlhbFZhbHVlcyk/ZS5zbGljZSgwKTp2b2lkIDApfHxbXSx0aGlzLl9oZWFwaWZ5KCl9cmV0dXJuIHQucHJvdG90eXBlLl9oZWFwaWZ5PWZ1bmN0aW9uKCl7dmFyIHQsZSxpO2lmKHRoaXMuZGF0YS5sZW5ndGg+MClmb3IodD1lPTEsaT10aGlzLmRhdGEubGVuZ3RoO2k+PTE/aT5lOmU+aTt0PWk+PTE/KytlOi0tZSl0aGlzLl9idWJibGVVcCh0KTtyZXR1cm4gdm9pZCAwfSx0LnByb3RvdHlwZS5xdWV1ZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5kYXRhLnB1c2godCksdm9pZCB0aGlzLl9idWJibGVVcCh0aGlzLmRhdGEubGVuZ3RoLTEpfSx0LnByb3RvdHlwZS5kZXF1ZXVlPWZ1bmN0aW9uKCl7dmFyIHQsZTtyZXR1cm4gZT10aGlzLmRhdGFbMF0sdD10aGlzLmRhdGEucG9wKCksdGhpcy5kYXRhLmxlbmd0aD4wJiYodGhpcy5kYXRhWzBdPXQsdGhpcy5fYnViYmxlRG93bigwKSksZX0sdC5wcm90b3R5cGUucGVlaz1mdW5jdGlvbigpe3JldHVybiB0aGlzLmRhdGFbMF19LHQucHJvdG90eXBlLl9idWJibGVVcD1mdW5jdGlvbih0KXtmb3IodmFyIGUsaTt0PjAmJihlPXQtMT4+PjEsdGhpcy5jb21wYXJhdG9yKHRoaXMuZGF0YVt0XSx0aGlzLmRhdGFbZV0pPDApOylpPXRoaXMuZGF0YVtlXSx0aGlzLmRhdGFbZV09dGhpcy5kYXRhW3RdLHRoaXMuZGF0YVt0XT1pLHQ9ZTtyZXR1cm4gdm9pZCAwfSx0LnByb3RvdHlwZS5fYnViYmxlRG93bj1mdW5jdGlvbih0KXt2YXIgZSxpLHIsbyxhO2ZvcihlPXRoaXMuZGF0YS5sZW5ndGgtMTs7KXtpZihpPSh0PDwxKSsxLG89aSsxLHI9dCxlPj1pJiZ0aGlzLmNvbXBhcmF0b3IodGhpcy5kYXRhW2ldLHRoaXMuZGF0YVtyXSk8MCYmKHI9aSksZT49byYmdGhpcy5jb21wYXJhdG9yKHRoaXMuZGF0YVtvXSx0aGlzLmRhdGFbcl0pPDAmJihyPW8pLHI9PT10KWJyZWFrO2E9dGhpcy5kYXRhW3JdLHRoaXMuZGF0YVtyXT10aGlzLmRhdGFbdF0sdGhpcy5kYXRhW3RdPWEsdD1yfXJldHVybiB2b2lkIDB9LHR9KCl9LHt9XX0se30sWzFdKSgxKX0pO1xcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXFxufSx7fV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XFxudmFyIFBhdGhmaW5kZXIgPSByZXF1aXJlKFxcJy4vcGF0aGZpbmRlclxcJyk7XFxyXFxudmFyIGdlbyA9IHJlcXVpcmUoXFwnLi9nZW9tZXRyeVxcJyk7XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUGF0aGZpbmRpbmcgd2ViIHdvcmtlciBpbXBsZW1lbnRhdGlvbi5cXHJcXG4gKiBAaWdub3JlXFxyXFxuICovXFxyXFxudmFyIFBvaW50ID0gZ2VvLlBvaW50O1xcclxcbnZhciBQb2x5ID0gZ2VvLlBvbHk7XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogT2JqZWN0IHdpdGggdXRpbGl0eSBtZXRob2RzIGZvciBjb252ZXJ0aW5nIG9iamVjdHMgZnJvbSBzZXJpYWxpemVkXFxyXFxuICogbWVzc2FnZSBmb3JtIGludG8gdGhlIHJlcXVpcmVkIG9iamVjdHMuXFxyXFxuICogQHByaXZhdGVcXHJcXG4gKi9cXHJcXG52YXIgQ29udmVydCA9IHt9O1xcclxcblxcclxcbi8qKlxcclxcbiAqIFRoZSBmb3JtYXQgb2YgYSBQb2ludCBhcyBzZXJpYWxpemVkIGJ5IHRoZSBXZWIgV29ya2VyIG1lc3NhZ2UtXFxyXFxuICogcGFzc2luZyBpbnRlcmZhY2UuXFxyXFxuICogQHByaXZhdGVcXHJcXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBQb2ludE9ialxcclxcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB4XFxyXFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHlcXHJcXG4gKi9cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBDb252ZXJ0IHNlcmlhbGl6ZWQgUG9pbnQgb2JqZWN0IGJhY2sgdG8gUG9pbnQuXFxyXFxuICogQHByaXZhdGVcXHJcXG4gKiBAcGFyYW0ge1BvaW50T2JqfSBvYmogLSBUaGUgc2VyaWFsaXplZCBQb2ludCBvYmplY3QuXFxyXFxuICovXFxyXFxuQ29udmVydC50b1BvaW50ID0gZnVuY3Rpb24ob2JqKSB7XFxyXFxuICByZXR1cm4gbmV3IFBvaW50KG9iai54LCBvYmoueSk7XFxyXFxufTtcXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBUaGUgZm9ybWF0IG9mIGEgUG9seSBhcyBzZXJpYWxpemVkIGJ5IHRoZSBXZWIgV29ya2VyIG1lc3NhZ2UtXFxyXFxuICogcGFzc2luZyBpbnRlcmZhY2UuXFxyXFxuICogQHByaXZhdGVcXHJcXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBQb2x5T2JqXFxyXFxuICogQHByb3BlcnR5IHtBcnJheS48UG9pbnRPYmo+fSBwb2ludHMgLSBUaGUgYXJyYXkgb2Ygc2VyaWFsaXplZFxcclxcbiAqICAgUG9pbnRzLlxcclxcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaG9sZSAtIFdoZXRoZXIgb3Igbm90IHRoZSBwb2x5Z29uIGlzIGEgaG9sZS5cXHJcXG4gKiBAcHJvcGVydHkge2ludGVnZXJ9IG51bXBvaW50cyAtIFRoZSBudW1iZXIgb2YgcG9pbnRzIGluIHRoZSBQb2x5LlxcclxcbiAqL1xcclxcblxcclxcbiAvKipcXHJcXG4gICogQ29udmVydCBzZXJpYWxpemVkIFBvbHkgb2JqZWN0IGJhY2sgdG8gUG9seS5cXHJcXG4gICogQHByaXZhdGVcXHJcXG4gICogQHBhcmFtIHtQb2x5T2JqfSBvYmogLSBUaGUgc2VyaWFsaXplZCBQb2x5IG9iamVjdC5cXHJcXG4gICovXFxyXFxuQ29udmVydC50b1BvbHkgPSBmdW5jdGlvbihvYmopIHtcXHJcXG4gIHZhciBwb2x5ID0gbmV3IFBvbHkoKTtcXHJcXG4gIHBvbHkucG9pbnRzID0gb2JqLnBvaW50cy5tYXAoQ29udmVydC50b1BvaW50KTtcXHJcXG4gIHBvbHkuaG9sZSA9IG9iai5ob2xlO1xcclxcbiAgcG9seS51cGRhdGUoKTtcXHJcXG4gIHJldHVybiBwb2x5O1xcclxcbn07XFxyXFxuXFxyXFxudmFyIExvZ2dlciA9IHt9O1xcclxcblxcclxcbi8qKlxcclxcbiAqIFNlbmRzIG1lc3NhZ2UgdG8gcGFyZW50IHRvIGJlIGxvZ2dlZCB0byBjb25zb2xlLiBUYWtlcyBzYW1lXFxyXFxuICogYXJndW1lbnRzIGFzIEJyYWdpIGxvZ2dlci5cXHJcXG4gKiBAcHJpdmF0ZVxcclxcbiAqIEBwYXJhbSB7c3RyaW5nfSBncm91cCAtIFRoZSBncm91cCB0byBhc3NvY2lhdGUgdGhlIG1lc3NhZ2Ugd2l0aC5cXHJcXG4gKiBAcGFyYW0gey4uLip9IC0gYXJiaXRyYXJ5IGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgYmFjayB0byB0aGUgcGFyZW50XFxyXFxuICogICBsb2dnaW5nIGZ1bmN0aW9uLlxcclxcbiAqL1xcclxcbkxvZ2dlci5sb2cgPSBmdW5jdGlvbihncm91cCkge1xcclxcbiAgdmFyIG1lc3NhZ2UgPSBbXCJsb2dcIl07XFxyXFxuICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShtZXNzYWdlLCBhcmd1bWVudHMpO1xcclxcbiAgcG9zdE1lc3NhZ2UobWVzc2FnZSk7XFxyXFxufTtcXHJcXG5cXHJcXG52YXIgVXRpbCA9IHt9O1xcclxcblxcclxcblV0aWwuc3BsaWNlID0gZnVuY3Rpb24oYXJ5LCBpbmRpY2VzKSB7XFxyXFxuICBpbmRpY2VzID0gaW5kaWNlcy5zb3J0KFV0aWwuX251bWJlckNvbXBhcmUpLnJldmVyc2UoKTtcXHJcXG4gIHZhciByZW1vdmVkID0gW107XFxyXFxuICBpbmRpY2VzLmZvckVhY2goZnVuY3Rpb24oaSkge1xcclxcbiAgICByZW1vdmVkLnB1c2goYXJ5LnNwbGljZShpLCAxKVswXSk7XFxyXFxuICB9KTtcXHJcXG4gIHJldHVybiByZW1vdmVkO1xcclxcbn07XFxyXFxuXFxyXFxuVXRpbC5fbnVtYmVyQ29tcGFyZSA9IGZ1bmN0aW9uKGEsIGIpIHtcXHJcXG4gIGlmIChhIDwgYikge1xcclxcbiAgICByZXR1cm4gLTE7XFxyXFxuICB9IGVsc2UgaWYgKGEgPiBiKSB7XFxyXFxuICAgIHJldHVybiAxO1xcclxcbiAgfSBlbHNlIHtcXHJcXG4gICAgcmV0dXJuIDA7XFxyXFxuICB9XFxyXFxufTtcXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBTZXQgdXAgdmFyaW91cyBhY3Rpb25zIHRvIHRha2Ugb24gY29tbXVuaWNhdGlvbi5cXHJcXG4gKiBAcHJpdmF0ZVxcclxcbiAqIEBwYXJhbSB7QXJyYXl9IGUgLSBBbiBhcnJheSB3aXRoIHRoZSBmaXJzdCBlbGVtZW50IGJlaW5nIGEgc3RyaW5nXFxyXFxuICogICBpZGVudGlmaWVyIGZvciB0aGUgbWVzc2FnZSB0eXBlLCBhbmQgc3Vic2VxdWVudCBlbGVtZW50cyBiZWluZ1xcclxcbiAqICAgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byB0aGUgcmVsZXZhbnQgZnVuY3Rpb24uIE1lc3NhZ2UgdHlwZXM6XFxyXFxuICogICAqIHBvbHlzIC0gc2V0cyB0aGUgcG9seWdvbnMgdG8gdXNlIGZvciBuYXZpZ2F0aW9uXFxyXFxuICogICAgICAgLSB7QXJyYXkuPFBvbHk+fSBhcnJheSBvZiBwb2x5Z29ucyBkZWZpbmluZyB0aGUgbWFwXFxyXFxuICogICAqIGFTdGFyIC0gY29tcHV0ZXMgQSogb24gYWJvdmUtc2V0IGl0ZW1zXFxyXFxuICogICAgICAgLSB7UG9pbnR9IHN0YXJ0IGxvY2F0aW9uIHRvIHVzZSBmb3Igc2VhcmNoXFxyXFxuICogICAgICAgLSB7UG9pbnR9IGVuZCBsb2NhdGlvbiB0byB1c2UgZm9yIHNlYXJjaFxcclxcbiAqICAgKiBpc0luaXRpYWxpemVkIC0gY2hlY2sgaWYgdGhlIHdvcmtlciBpcyBpbml0aWFsaXplZC5cXHJcXG4gKi9cXHJcXG5vbm1lc3NhZ2UgPSBmdW5jdGlvbihlKSB7XFxyXFxuICB2YXIgZGF0YSA9IGUuZGF0YTtcXHJcXG4gIHZhciBuYW1lID0gZGF0YVswXTtcXHJcXG4gIExvZ2dlci5sb2coXCJ3b3JrZXI6ZGVidWdcIiwgXCJNZXNzYWdlIHJlY2VpdmVkIGJ5IHdvcmtlcjpcIiwgZGF0YSk7XFxyXFxuICBpZiAobmFtZSA9PSBcInBvbHlzXCIpIHtcXHJcXG4gICAgLy8gUG9seWdvbnMgZGVmaW5pbmcgbWFwLlxcclxcbiAgICBzZWxmLnBvbHlzID0gZGF0YVsxXS5tYXAoQ29udmVydC50b1BvbHkpO1xcclxcblxcclxcbiAgICAvLyBJbml0aWFsaXplIHBhdGhmaW5kZXIgbW9kdWxlLlxcclxcbiAgICBzZWxmLnBhdGhmaW5kZXIgPSBuZXcgUGF0aGZpbmRlcihzZWxmLnBvbHlzKTtcXHJcXG4gIH0gZWxzZSBpZiAobmFtZSA9PSBcInBvbHlVcGRhdGVcIikge1xcclxcbiAgICAvLyBVcGRhdGUgdG8gbmF2bWVzaC5cXHJcXG4gICAgdmFyIG5ld1BvbHlzID0gZGF0YVsxXS5tYXAoQ29udmVydC50b1BvbHkpO1xcclxcbiAgICB2YXIgcmVtb3ZlZFBvbHlzID0gZGF0YVsyXTtcXHJcXG5cXHJcXG4gICAgVXRpbC5zcGxpY2Uoc2VsZi5wb2x5cywgcmVtb3ZlZFBvbHlzKTtcXHJcXG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoc2VsZi5wb2x5cywgbmV3UG9seXMpO1xcclxcblxcclxcbiAgICAvLyBSZS1pbml0aWFsaXplIHBhdGhmaW5kZXIuXFxyXFxuICAgIHNlbGYucGF0aGZpbmRlciA9IG5ldyBQYXRoZmluZGVyKHNlbGYucG9seXMpO1xcclxcbiAgfSBlbHNlIGlmIChuYW1lID09IFwiYVN0YXJcIikge1xcclxcbiAgICB2YXIgc291cmNlID0gQ29udmVydC50b1BvaW50KGRhdGFbMV0pO1xcclxcbiAgICB2YXIgdGFyZ2V0ID0gQ29udmVydC50b1BvaW50KGRhdGFbMl0pO1xcclxcblxcclxcbiAgICB2YXIgcGF0aCA9IHNlbGYucGF0aGZpbmRlci5hU3Rhcihzb3VyY2UsIHRhcmdldCk7XFxyXFxuICAgIHBvc3RNZXNzYWdlKFtcInJlc3VsdFwiLCBwYXRoXSk7XFxyXFxuICB9IGVsc2UgaWYgKG5hbWUgPT0gXCJpc0luaXRpYWxpemVkXCIpIHtcXHJcXG4gICAgcG9zdE1lc3NhZ2UoW1wiaW5pdGlhbGl6ZWRcIl0pO1xcclxcbiAgfVxcclxcbn07XFxyXFxuXFxyXFxuTG9nZ2VyLmxvZyhcIndvcmtlclwiLCBcIldvcmtlciBsb2FkZWQuXCIpO1xcclxcbi8vIFNlbnQgY29uZmlybWF0aW9uIHRoYXQgd29ya2VyIGlzIGluaXRpYWxpemVkLlxcclxcbnBvc3RNZXNzYWdlKFtcImluaXRpYWxpemVkXCJdKTtcXHJcXG5cXG59LHtcIi4vZ2VvbWV0cnlcIjozLFwiLi9wYXRoZmluZGVyXCI6NH1dLDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xcbi8qKlxcclxcbiAqIEEgcG9pbnQgY2FuIHJlcHJlc2VudCBhIHZlcnRleCBpbiBhIDJkIGVudmlyb25tZW50IG9yIGEgdmVjdG9yLlxcclxcbiAqIEBjb25zdHJ1Y3RvclxcclxcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIGB4YCBjb29yZGluYXRlIG9mIHRoZSBwb2ludC5cXHJcXG4gKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSBgeWAgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQuXFxyXFxuICovXFxyXFxuUG9pbnQgPSBmdW5jdGlvbih4LCB5KSB7XFxyXFxuICB0aGlzLnggPSB4O1xcclxcbiAgdGhpcy55ID0geTtcXHJcXG59O1xcclxcbmV4cG9ydHMuUG9pbnQgPSBQb2ludDtcXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBDb252ZXJ0IGEgcG9pbnQtbGlrZSBvYmplY3QgaW50byBhIHBvaW50LlxcclxcbiAqIEBwYXJhbSB7UG9pbnRMaWtlfSBwIC0gVGhlIHBvaW50LWxpa2Ugb2JqZWN0IHRvIGNvbnZlcnQuXFxyXFxuICogQHJldHVybiB7UG9pbnR9IC0gVGhlIG5ldyBwb2ludCByZXByZXNlbnRpbmcgdGhlIHBvaW50LWxpa2VcXHJcXG4gKiAgIG9iamVjdC5cXHJcXG4gKi9cXHJcXG5Qb2ludC5mcm9tUG9pbnRMaWtlID0gZnVuY3Rpb24ocCkge1xcclxcbiAgcmV0dXJuIG5ldyBQb2ludChwLngsIHAueSk7XFxyXFxufTtcXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBTdHJpbmcgbWV0aG9kIGZvciBwb2ludC1saWtlIG9iamVjdHMuXFxyXFxuICogQHBhcmFtIHtQb2ludExpa2V9IHAgLSBUaGUgcG9pbnQtbGlrZSBvYmplY3QgdG8gY29udmVydC5cXHJcXG4gKiBAcmV0dXJuIHtQb2ludH0gLSBUaGUgbmV3IHBvaW50IHJlcHJlc2VudGluZyB0aGUgcG9pbnQtbGlrZVxcclxcbiAqICAgb2JqZWN0LlxcclxcbiAqL1xcclxcblBvaW50LnRvU3RyaW5nID0gZnVuY3Rpb24ocCkge1xcclxcbiAgcmV0dXJuIFwieFwiICsgcC54ICsgXCJ5XCIgKyBwLnk7XFxyXFxufTtcXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBUYWtlcyBhIHBvaW50IG9yIHNjYWxhciBhbmQgYWRkcyBzbG90d2lzZSBpbiB0aGUgY2FzZSBvZiBhbm90aGVyXFxyXFxuICogcG9pbnQsIG9yIHRvIGVhY2ggcGFyYW1ldGVyIGluIHRoZSBjYXNlIG9mIGEgc2NhbGFyLlxcclxcbiAqIEBwYXJhbSB7KFBvaW50fG51bWJlcil9IC0gVGhlIFBvaW50LCBvciBzY2FsYXIsIHRvIGFkZCB0byB0aGlzXFxyXFxuICogICBwb2ludC5cXHJcXG4gKi9cXHJcXG5Qb2ludC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24ocCkge1xcclxcbiAgaWYgKHR5cGVvZiBwID09IFwibnVtYmVyXCIpXFxyXFxuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54ICsgcCwgdGhpcy55ICsgcCk7XFxyXFxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCArIHAueCwgdGhpcy55ICsgcC55KTtcXHJcXG59O1xcclxcblxcclxcbi8qKlxcclxcbiAqIFRha2VzIGEgcG9pbnQgb3Igc2NhbGFyIGFuZCBzdWJ0cmFjdHMgc2xvdHdpc2UgaW4gdGhlIGNhc2Ugb2ZcXHJcXG4gKiBhbm90aGVyIHBvaW50IG9yIGZyb20gZWFjaCBwYXJhbWV0ZXIgaW4gdGhlIGNhc2Ugb2YgYSBzY2FsYXIuXFxyXFxuICogQHBhcmFtIHsoUG9pbnR8bnVtYmVyKX0gLSBUaGUgUG9pbnQsIG9yIHNjYWxhciwgdG8gc3VidHJhY3QgZnJvbVxcclxcbiAqICAgdGhpcyBwb2ludC5cXHJcXG4gKi9cXHJcXG5Qb2ludC5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24ocCkge1xcclxcbiAgaWYgKHR5cGVvZiBwID09IFwibnVtYmVyXCIpXFxyXFxuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54IC0gcCwgdGhpcy55IC0gcCk7XFxyXFxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCAtIHAueCwgdGhpcy55IC0gcC55KTtcXHJcXG59O1xcclxcblxcclxcbi8qKlxcclxcbiAqIFRha2VzIGEgc2NhbGFyIHZhbHVlIGFuZCBtdWx0aXBsaWVzIGVhY2ggcGFyYW1ldGVyIG9mIHRoZSBwb2ludFxcclxcbiAqIGJ5IHRoZSBzY2FsYXIuXFxyXFxuICogQHBhcmFtICB7bnVtYmVyfSBmIC0gVGhlIG51bWJlciB0byBtdWx0aXBsZSB0aGUgcGFyYW1ldGVycyBieS5cXHJcXG4gKiBAcmV0dXJuIHtQb2ludH0gLSBBIG5ldyBwb2ludCB3aXRoIHRoZSBjYWxjdWxhdGVkIGNvb3JkaW5hdGVzLlxcclxcbiAqL1xcclxcblBvaW50LnByb3RvdHlwZS5tdWwgPSBmdW5jdGlvbihmKSB7XFxyXFxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCAqIGYsIHRoaXMueSAqIGYpO1xcclxcbn07XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogVGFrZXMgYSBzY2FsYXIgdmFsdWUgYW5kIGRpdmlkZXMgZWFjaCBwYXJhbWV0ZXIgb2YgdGhlIHBvaW50XFxyXFxuICogYnkgdGhlIHNjYWxhci5cXHJcXG4gKiBAcGFyYW0gIHtudW1iZXJ9IGYgLSBUaGUgbnVtYmVyIHRvIGRpdmlkZSB0aGUgcGFyYW1ldGVycyBieS5cXHJcXG4gKiBAcmV0dXJuIHtQb2ludH0gLSBBIG5ldyBwb2ludCB3aXRoIHRoZSBjYWxjdWxhdGVkIGNvb3JkaW5hdGVzLlxcclxcbiAqL1xcclxcblBvaW50LnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbihmKSB7XFxyXFxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCAvIGYsIHRoaXMueSAvIGYpO1xcclxcbn07XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogVGFrZXMgYW5vdGhlciBwb2ludCBhbmQgcmV0dXJucyBhIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZVxcclxcbiAqIHBvaW50cyBhcmUgZXF1YWwuIFR3byBwb2ludHMgYXJlIGVxdWFsIGlmIHRoZWlyIHBhcmFtZXRlcnMgYXJlXFxyXFxuICogZXF1YWwuXFxyXFxuICogQHBhcmFtICB7UG9pbnR9IHAgLSBUaGUgcG9pbnQgdG8gY2hlY2sgZXF1YWxpdHkgYWdhaW5zdC5cXHJcXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSB0d28gcG9pbnRzIGFyZSBlcXVhbC5cXHJcXG4gKi9cXHJcXG5Qb2ludC5wcm90b3R5cGUuZXEgPSBmdW5jdGlvbihwKSB7XFxyXFxuICByZXR1cm4gKHRoaXMueCA9PSBwLnggJiYgdGhpcy55ID09IHAueSk7XFxyXFxufTtcXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBUYWtlcyBhbm90aGVyIHBvaW50IGFuZCByZXR1cm5zIGEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlXFxyXFxuICogcG9pbnRzIGFyZSBub3QgZXF1YWwuIFR3byBwb2ludHMgYXJlIGNvbnNpZGVyZWQgbm90IGVxdWFsIGlmIHRoZWlyXFxyXFxuICogcGFyYW1ldGVycyBhcmUgbm90IGVxdWFsLlxcclxcbiAqIEBwYXJhbSAge1BvaW50fSBwIC0gVGhlIHBvaW50IHRvIGNoZWNrIGVxdWFsaXR5IGFnYWluc3QuXFxyXFxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgdHdvIHBvaW50cyBhcmUgbm90IGVxdWFsLlxcclxcbiAqL1xcclxcblBvaW50LnByb3RvdHlwZS5uZXEgPSBmdW5jdGlvbihwKSB7XFxyXFxuICByZXR1cm4gKHRoaXMueCAhPSBwLnggfHwgdGhpcy55ICE9IHAueSk7XFxyXFxufTtcXHJcXG5cXHJcXG4vLyBHaXZlbiBhbm90aGVyIHBvaW50LCByZXR1cm5zIHRoZSBkb3QgcHJvZHVjdC5cXHJcXG5Qb2ludC5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24ocCkge1xcclxcbiAgcmV0dXJuICh0aGlzLnggKiBwLnggKyB0aGlzLnkgKiBwLnkpO1xcclxcbn07XFxyXFxuXFxyXFxuLy8gR2l2ZW4gYW5vdGhlciBwb2ludCwgcmV0dXJucyB0aGUgXFwnY3Jvc3MgcHJvZHVjdFxcJywgb3IgYXQgbGVhc3QgdGhlIDJkXFxyXFxuLy8gZXF1aXZhbGVudC5cXHJcXG5Qb2ludC5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbihwKSB7XFxyXFxuICByZXR1cm4gKHRoaXMueCAqIHAueSAtIHRoaXMueSAqIHAueCk7XFxyXFxufTtcXHJcXG5cXHJcXG4vLyBHaXZlbiBhbm90aGVyIHBvaW50LCByZXR1cm5zIHRoZSBkaXN0YW5jZSB0byB0aGF0IHBvaW50LlxcclxcblBvaW50LnByb3RvdHlwZS5kaXN0ID0gZnVuY3Rpb24ocCkge1xcclxcbiAgdmFyIGRpZmYgPSB0aGlzLnN1YihwKTtcXHJcXG4gIHJldHVybiBNYXRoLnNxcnQoZGlmZi5kb3QoZGlmZikpO1xcclxcbn07XFxyXFxuXFxyXFxuLy8gR2l2ZW4gYW5vdGhlciBwb2ludCwgcmV0dXJucyB0aGUgc3F1YXJlZCBkaXN0YW5jZSB0byB0aGF0IHBvaW50LlxcclxcblBvaW50LnByb3RvdHlwZS5kaXN0MiA9IGZ1bmN0aW9uKHApIHtcXHJcXG4gIHZhciBkaWZmID0gdGhpcy5zdWIocCk7XFxyXFxuICByZXR1cm4gZGlmZi5kb3QoZGlmZik7XFxyXFxufTtcXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHBvaW50IGlzICgwLCAwKS5cXHJcXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSBwb2ludCBpcyAoMCwgMCkuXFxyXFxuICovXFxyXFxuUG9pbnQucHJvdG90eXBlLnplcm8gPSBmdW5jdGlvbigpIHtcXHJcXG4gIHJldHVybiB0aGlzLnggPT0gMCAmJiB0aGlzLnkgPT0gMDtcXHJcXG59O1xcclxcblxcclxcblBvaW50LnByb3RvdHlwZS5sZW4gPSBmdW5jdGlvbigpIHtcXHJcXG4gIHJldHVybiB0aGlzLmRpc3QobmV3IFBvaW50KDAsIDApKTtcXHJcXG59O1xcclxcblxcclxcblBvaW50LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcXHJcXG4gIHZhciBuID0gdGhpcy5kaXN0KG5ldyBQb2ludCgwLCAwKSk7XFxyXFxuICBpZiAobiA+IDApIHJldHVybiB0aGlzLmRpdihuKTtcXHJcXG4gIHJldHVybiBuZXcgUG9pbnQoMCwgMCk7XFxyXFxufTtcXHJcXG5cXHJcXG5Qb2ludC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcXHJcXG4gIHJldHVybiBcXCd4XFwnICsgdGhpcy54ICsgXFwneVxcJyArIHRoaXMueTtcXHJcXG59O1xcclxcblxcclxcbi8qKlxcclxcbiAqIFJldHVybiBhIGNvcHkgb2YgdGhlIHBvaW50LlxcclxcbiAqIEByZXR1cm4ge1BvaW50fSAtIFRoZSBuZXcgcG9pbnQuXFxyXFxuICovXFxyXFxuUG9pbnQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XFxyXFxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcXHJcXG59O1xcclxcblxcclxcbi8qKlxcclxcbiAqIEVkZ2VzIGFyZSB1c2VkIHRvIHJlcHJlc2VudCB0aGUgYm9yZGVyIGJldHdlZW4gdHdvIGFkamFjZW50XFxyXFxuICogcG9seWdvbnMuXFxyXFxuICogQGNvbnN0cnVjdG9yXFxyXFxuICogQHBhcmFtIHtQb2ludH0gcDEgLSBUaGUgZmlyc3QgcG9pbnQgb2YgdGhlIGVkZ2UuXFxyXFxuICogQHBhcmFtIHtQb2ludH0gcDIgLSBUaGUgc2Vjb25kIHBvaW50IG9mIHRoZSBlZGdlLlxcclxcbiAqL1xcclxcbkVkZ2UgPSBmdW5jdGlvbihwMSwgcDIpIHtcXHJcXG4gIHRoaXMucDEgPSBwMTtcXHJcXG4gIHRoaXMucDIgPSBwMjtcXHJcXG4gIHRoaXMuY2VudGVyID0gcDEuYWRkKHAyLnN1YihwMSkuZGl2KDIpKTtcXHJcXG4gIHRoaXMucG9pbnRzID0gW3RoaXMucDEsIHRoaXMuY2VudGVyLCB0aGlzLnAyXTtcXHJcXG59O1xcclxcbmV4cG9ydHMuRWRnZSA9IEVkZ2U7XFxyXFxuXFxyXFxuRWRnZS5wcm90b3R5cGUuX0NDVyA9IGZ1bmN0aW9uKHAxLCBwMiwgcDMpIHtcXHJcXG4gIGEgPSBwMS54OyBiID0gcDEueTtcXHJcXG4gIGMgPSBwMi54OyBkID0gcDIueTtcXHJcXG4gIGUgPSBwMy54OyBmID0gcDMueTtcXHJcXG4gIHJldHVybiAoZiAtIGIpICogKGMgLSBhKSA+IChkIC0gYikgKiAoZSAtIGEpO1xcclxcbn07XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNjcyNTcxNVxcclxcbiAqIENoZWNrcyB3aGV0aGVyIHRoaXMgZWRnZSBpbnRlcnNlY3RzIHRoZSBwcm92aWRlZCBlZGdlLlxcclxcbiAqIEBwYXJhbSB7RWRnZX0gZWRnZSAtIFRoZSBlZGdlIHRvIGNoZWNrIGludGVyc2VjdGlvbiBmb3IuXFxyXFxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgZWRnZXMgaW50ZXJzZWN0LlxcclxcbiAqL1xcclxcbkVkZ2UucHJvdG90eXBlLmludGVyc2VjdHMgPSBmdW5jdGlvbihlZGdlKSB7XFxyXFxuICB2YXIgcTEgPSBlZGdlLnAxLCBxMiA9IGVkZ2UucDI7XFxyXFxuICBpZiAocTEuZXEodGhpcy5wMSkgfHwgcTEuZXEodGhpcy5wMikgfHwgcTIuZXEodGhpcy5wMSkgfHwgcTIuZXEodGhpcy5wMikpIHJldHVybiBmYWxzZTtcXHJcXG4gIHJldHVybiAodGhpcy5fQ0NXKHRoaXMucDEsIHExLCBxMikgIT0gdGhpcy5fQ0NXKHRoaXMucDIsIHExLCBxMikpICYmICh0aGlzLl9DQ1codGhpcy5wMSwgdGhpcy5wMiwgcTEpICE9IHRoaXMuX0NDVyh0aGlzLnAxLCB0aGlzLnAyLCBxMikpO1xcclxcbn07XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUG9seWdvbiBjbGFzcy5cXHJcXG4gKiBDYW4gYmUgaW5pdGlhbGl6ZWQgd2l0aCBhbiBhcnJheSBvZiBwb2ludHMuXFxyXFxuICogQGNvbnN0cnVjdG9yXFxyXFxuICogQHBhcmFtIHtBcnJheS48UG9pbnQ+fSBbcG9pbnRzXSAtIFRoZSBwb2ludHMgdG8gdXNlIHRvIGluaXRpYWxpemVcXHJcXG4gKiAgIHRoZSBwb2x5LlxcclxcbiAqL1xcclxcblBvbHkgPSBmdW5jdGlvbihwb2ludHMpIHtcXHJcXG4gIGlmICh0eXBlb2YgcG9pbnRzID09IFxcJ3VuZGVmaW5lZFxcJykgcG9pbnRzID0gZmFsc2U7XFxyXFxuICB0aGlzLmhvbGUgPSBmYWxzZTtcXHJcXG4gIHRoaXMucG9pbnRzID0gbnVsbDtcXHJcXG4gIHRoaXMubnVtcG9pbnRzID0gMDtcXHJcXG4gIGlmIChwb2ludHMpIHtcXHJcXG4gICAgdGhpcy5udW1wb2ludHMgPSBwb2ludHMubGVuZ3RoO1xcclxcbiAgICB0aGlzLnBvaW50cyA9IHBvaW50cy5zbGljZSgpO1xcclxcbiAgfVxcclxcbn07XFxyXFxuZXhwb3J0cy5Qb2x5ID0gUG9seTtcXHJcXG5cXHJcXG5Qb2x5LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24obikge1xcclxcbiAgdGhpcy5wb2ludHMgPSBuZXcgQXJyYXkobik7XFxyXFxuICB0aGlzLm51bXBvaW50cyA9IG47XFxyXFxufTtcXHJcXG5cXHJcXG5Qb2x5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcXHJcXG4gIHRoaXMubnVtcG9pbnRzID0gdGhpcy5wb2ludHMubGVuZ3RoO1xcclxcbn07XFxyXFxuXFxyXFxuUG9seS5wcm90b3R5cGUudHJpYW5nbGUgPSBmdW5jdGlvbihwMSwgcDIsIHAzKSB7XFxyXFxuICB0aGlzLmluaXQoMyk7XFxyXFxuICB0aGlzLnBvaW50c1swXSA9IHAxO1xcclxcbiAgdGhpcy5wb2ludHNbMV0gPSBwMjtcXHJcXG4gIHRoaXMucG9pbnRzWzJdID0gcDM7XFxyXFxufTtcXHJcXG5cXHJcXG4vLyBUYWtlcyBhbiBpbmRleCBhbmQgcmV0dXJucyB0aGUgcG9pbnQgYXQgdGhhdCBpbmRleCwgb3IgbnVsbC5cXHJcXG5Qb2x5LnByb3RvdHlwZS5nZXRQb2ludCA9IGZ1bmN0aW9uKG4pIHtcXHJcXG4gIGlmICh0aGlzLnBvaW50cyAmJiB0aGlzLm51bXBvaW50cyA+IG4pXFxyXFxuICAgIHJldHVybiB0aGlzLnBvaW50c1tuXTtcXHJcXG4gIHJldHVybiBudWxsO1xcclxcbn07XFxyXFxuXFxyXFxuLy8gU2V0IGEgcG9pbnQsIGZhaWxzIHNpbGVudGx5IG90aGVyd2lzZS4gVE9ETzogcmVwbGFjZSB3aXRoIGJyYWNrZXQgbm90YXRpb24uXFxyXFxuUG9seS5wcm90b3R5cGUuc2V0UG9pbnQgPSBmdW5jdGlvbihpLCBwKSB7XFxyXFxuICBpZiAodGhpcy5wb2ludHMgJiYgdGhpcy5wb2ludHMubGVuZ3RoID4gaSkge1xcclxcbiAgICB0aGlzLnBvaW50c1tpXSA9IHA7XFxyXFxuICB9XFxyXFxufTtcXHJcXG5cXHJcXG4vLyBHaXZlbiBhbiBpbmRleCBpLCByZXR1cm4gdGhlIGluZGV4IG9mIHRoZSBuZXh0IHBvaW50LlxcclxcblBvbHkucHJvdG90eXBlLmdldE5leHRJID0gZnVuY3Rpb24oaSkge1xcclxcbiAgcmV0dXJuIChpICsgMSkgJSB0aGlzLm51bXBvaW50cztcXHJcXG59O1xcclxcblxcclxcblBvbHkucHJvdG90eXBlLmdldFByZXZJID0gZnVuY3Rpb24oaSkge1xcclxcbiAgaWYgKGkgPT0gMClcXHJcXG4gICAgcmV0dXJuICh0aGlzLm51bXBvaW50cyAtIDEpO1xcclxcbiAgcmV0dXJuIGkgLSAxO1xcclxcbn07XFxyXFxuXFxyXFxuLy8gUmV0dXJucyB0aGUgc2lnbmVkIGFyZWEgb2YgYSBwb2x5Z29uLCBpZiB0aGUgdmVydGljZXMgYXJlIGdpdmVuIGluXFxyXFxuLy8gQ0NXIG9yZGVyIHRoZW4gdGhlIGFyZWEgd2lsbCBiZSA+IDAsIDwgMCBvdGhlcndpc2UuXFxyXFxuUG9seS5wcm90b3R5cGUuZ2V0QXJlYSA9IGZ1bmN0aW9uKCkge1xcclxcbiAgdmFyIGFyZWEgPSAwO1xcclxcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bXBvaW50czsgaSsrKSB7XFxyXFxuICAgIHZhciBpMiA9IHRoaXMuZ2V0TmV4dEkoaSk7XFxyXFxuICAgIGFyZWEgKz0gdGhpcy5wb2ludHNbaV0ueCAqIHRoaXMucG9pbnRzW2kyXS55IC0gdGhpcy5wb2ludHNbaV0ueSAqIHRoaXMucG9pbnRzW2kyXS54O1xcclxcbiAgfVxcclxcbiAgcmV0dXJuIGFyZWE7XFxyXFxufTtcXHJcXG5cXHJcXG5Qb2x5LnByb3RvdHlwZS5nZXRPcmllbnRhdGlvbiA9IGZ1bmN0aW9uKCkge1xcclxcbiAgdmFyIGFyZWEgPSB0aGlzLmdldEFyZWEoKTtcXHJcXG4gIGlmIChhcmVhID4gMCkgcmV0dXJuIFwiQ0NXXCI7XFxyXFxuICBpZiAoYXJlYSA8IDApIHJldHVybiBcIkNXXCI7XFxyXFxuICByZXR1cm4gMDtcXHJcXG59O1xcclxcblxcclxcblBvbHkucHJvdG90eXBlLnNldE9yaWVudGF0aW9uID0gZnVuY3Rpb24ob3JpZW50YXRpb24pIHtcXHJcXG4gIHZhciBjdXJyZW50X29yaWVudGF0aW9uID0gdGhpcy5nZXRPcmllbnRhdGlvbigpO1xcclxcbiAgaWYgKGN1cnJlbnRfb3JpZW50YXRpb24gJiYgKGN1cnJlbnRfb3JpZW50YXRpb24gIT09IG9yaWVudGF0aW9uKSkge1xcclxcbiAgICB0aGlzLmludmVydCgpO1xcclxcbiAgfVxcclxcbn07XFxyXFxuXFxyXFxuUG9seS5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24oKSB7XFxyXFxuICB2YXIgbmV3cG9pbnRzID0gbmV3IEFycmF5KHRoaXMubnVtcG9pbnRzKTtcXHJcXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1wb2ludHM7IGkrKykge1xcclxcbiAgICBuZXdwb2ludHNbaV0gPSB0aGlzLnBvaW50c1t0aGlzLm51bXBvaW50cyAtIGkgLSAxXTtcXHJcXG4gIH1cXHJcXG4gIHRoaXMucG9pbnRzID0gbmV3cG9pbnRzO1xcclxcbn07XFxyXFxuXFxyXFxuUG9seS5wcm90b3R5cGUuZ2V0Q2VudGVyID0gZnVuY3Rpb24oKSB7XFxyXFxuICB2YXIgeCA9IHRoaXMucG9pbnRzLm1hcChmdW5jdGlvbihwKSB7IHJldHVybiBwLnggfSk7XFxyXFxuICB2YXIgeSA9IHRoaXMucG9pbnRzLm1hcChmdW5jdGlvbihwKSB7IHJldHVybiBwLnkgfSk7XFxyXFxuICB2YXIgbWluWCA9IE1hdGgubWluLmFwcGx5KG51bGwsIHgpO1xcclxcbiAgdmFyIG1heFggPSBNYXRoLm1heC5hcHBseShudWxsLCB4KTtcXHJcXG4gIHZhciBtaW5ZID0gTWF0aC5taW4uYXBwbHkobnVsbCwgeSk7XFxyXFxuICB2YXIgbWF4WSA9IE1hdGgubWF4LmFwcGx5KG51bGwsIHkpO1xcclxcbiAgcmV0dXJuIG5ldyBQb2ludCgobWluWCArIG1heFgpLzIsIChtaW5ZICsgbWF4WSkvMik7XFxyXFxufTtcXHJcXG5cXHJcXG4vLyBBZGFwdGVkIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTYyODMzNDlcXHJcXG5Qb2x5LnByb3RvdHlwZS5jZW50cm9pZCA9IGZ1bmN0aW9uKCkge1xcclxcbiAgdmFyIHggPSAwLFxcclxcbiAgICAgIHkgPSAwLFxcclxcbiAgICAgIGksXFxyXFxuICAgICAgaixcXHJcXG4gICAgICBmLFxcclxcbiAgICAgIHBvaW50MSxcXHJcXG4gICAgICBwb2ludDI7XFxyXFxuXFxyXFxuICBmb3IgKGkgPSAwLCBqID0gdGhpcy5wb2ludHMubGVuZ3RoIC0gMTsgaSA8IHRoaXMucG9pbnRzLmxlbmd0aDsgaiA9IGksIGkgKz0gMSkge1xcclxcbiAgICBwb2ludDEgPSB0aGlzLnBvaW50c1tpXTtcXHJcXG4gICAgcG9pbnQyID0gdGhpcy5wb2ludHNbal07XFxyXFxuICAgIGYgPSBwb2ludDEueCAqIHBvaW50Mi55IC0gcG9pbnQyLnggKiBwb2ludDEueTtcXHJcXG4gICAgeCArPSAocG9pbnQxLnggKyBwb2ludDIueCkgKiBmO1xcclxcbiAgICB5ICs9IChwb2ludDEueSArIHBvaW50Mi55KSAqIGY7XFxyXFxuICB9XFxyXFxuXFxyXFxuICBmID0gdGhpcy5nZXRBcmVhKCkgKiAzO1xcclxcbiAgeCA9IE1hdGguYWJzKHgpO1xcclxcbiAgeSA9IE1hdGguYWJzKHkpO1xcclxcbiAgcmV0dXJuIG5ldyBQb2ludCh4IC8gZiwgeSAvIGYpO1xcclxcbn07XFxyXFxuXFxyXFxuUG9seS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcXHJcXG4gIHZhciBjZW50ZXIgPSB0aGlzLmNlbnRyb2lkKCk7XFxyXFxuICByZXR1cm4gXCJcIiArIGNlbnRlci54ICsgXCIgXCIgKyBjZW50ZXIueTtcXHJcXG59O1xcclxcblxcclxcbi8qKlxcclxcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gcG9pbnQgaXMgY29udGFpbmVkIHdpdGhpbiB0aGUgUG9seWdvbi5cXHJcXG4gKiBBZGFwdGVkIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODcyMTQ4M1xcclxcbiAqXFxyXFxuICogQHBhcmFtIHtQb2ludH0gcCAtIFRoZSBwb2ludCB0byBjaGVjay5cXHJcXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSBwb2ludCBpcyBjb250YWluZWQgd2l0aGluXFxyXFxuICogICB0aGUgcG9seWdvbi5cXHJcXG4gKi9cXHJcXG5Qb2x5LnByb3RvdHlwZS5jb250YWluc1BvaW50ID0gZnVuY3Rpb24ocCkge1xcclxcbiAgdmFyIHJlc3VsdCA9IGZhbHNlO1xcclxcbiAgZm9yICh2YXIgaSA9IDAsIGogPSB0aGlzLm51bXBvaW50cyAtIDE7IGkgPCB0aGlzLm51bXBvaW50czsgaiA9IGkrKykge1xcclxcbiAgICB2YXIgcDEgPSB0aGlzLnBvaW50c1tqXSwgcDIgPSB0aGlzLnBvaW50c1tpXTtcXHJcXG4gICAgaWYgKChwMi55ID4gcC55KSAhPSAocDEueSA+IHAueSkgJiZcXHJcXG4gICAgICAgIChwLnggPCAocDEueCAtIHAyLngpICogKHAueSAtIHAyLnkpIC8gKHAxLnkgLSBwMi55KSArIHAyLngpKSB7XFxyXFxuICAgICAgcmVzdWx0ID0gIXJlc3VsdDtcXHJcXG4gICAgfVxcclxcbiAgfVxcclxcbiAgcmV0dXJuIHJlc3VsdDtcXHJcXG59O1xcclxcblxcclxcbi8qKlxcclxcbiAqIENsb25lIHRoZSBnaXZlbiBwb2x5Z29uIGludG8gYSBuZXcgcG9seWdvbi5cXHJcXG4gKiBAcmV0dXJuIHtQb2x5fSAtIEEgY2xvbmUgb2YgdGhlIHBvbHlnb24uXFxyXFxuICovXFxyXFxuUG9seS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcXHJcXG4gIHJldHVybiBuZXcgUG9seSh0aGlzLnBvaW50cy5zbGljZSgpLm1hcChmdW5jdGlvbihwb2ludCkge1xcclxcbiAgICByZXR1cm4gcG9pbnQuY2xvbmUoKTtcXHJcXG4gIH0pKTtcXHJcXG59O1xcclxcblxcclxcbi8qKlxcclxcbiAqIFRyYW5zbGF0ZSBhIHBvbHlnb24gYWxvbmcgYSBnaXZlbiB2ZWN0b3IuXFxyXFxuICogQHBhcmFtIHtQb2ludH0gdmVjIC0gVGhlIHZlY3RvciBhbG9uZyB3aGljaCB0byB0cmFuc2xhdGUgdGhlXFxyXFxuICogICBwb2x5Z29uLlxcclxcbiAqIEByZXR1cm4ge1BvbHl9IC0gVGhlIHRyYW5zbGF0ZWQgcG9seWdvbi5cXHJcXG4gKi9cXHJcXG5Qb2x5LnByb3RvdHlwZS50cmFuc2xhdGUgPSBmdW5jdGlvbih2ZWMpIHtcXHJcXG4gIHJldHVybiBuZXcgUG9seSh0aGlzLnBvaW50cy5tYXAoZnVuY3Rpb24ocG9pbnQpIHtcXHJcXG4gICAgcmV0dXJuIHBvaW50LmFkZCh2ZWMpO1xcclxcbiAgfSkpO1xcclxcbn07XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUmV0dXJucyBhbiBhcnJheSBvZiBlZGdlcyByZXByZXNlbnRpbmcgdGhlIHBvbHlnb24uXFxyXFxuICogQHJldHVybiB7QXJyYXkuPEVkZ2U+fSAtIFRoZSBlZGdlcyBvZiB0aGUgcG9seWdvbi5cXHJcXG4gKi9cXHJcXG5Qb2x5LnByb3RvdHlwZS5lZGdlcyA9IGZ1bmN0aW9uKCkge1xcclxcbiAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KFwiY2FjaGVkX2VkZ2VzXCIpKSB7XFxyXFxuICAgIHRoaXMuY2FjaGVkX2VkZ2VzID0gdGhpcy5wb2ludHMubWFwKGZ1bmN0aW9uKHBvaW50LCBpKSB7XFxyXFxuICAgICAgcmV0dXJuIG5ldyBFZGdlKHBvaW50LCB0aGlzLnBvaW50c1t0aGlzLmdldE5leHRJKGkpXSk7XFxyXFxuICAgIH0sIHRoaXMpO1xcclxcbiAgfVxcclxcbiAgcmV0dXJuIHRoaXMuY2FjaGVkX2VkZ2VzO1xcclxcbn07XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogTmFpdmUgY2hlY2sgaWYgb3RoZXIgcG9seSBpbnRlcnNlY3RzIHRoaXMgb25lLCBhc3N1bWluZyBib3RoIGNvbnZleC5cXHJcXG4gKiBAcGFyYW0ge1BvbHl9IHBvbHlcXHJcXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgdGhlIHBvbHlnb25zIGludGVyc2VjdC5cXHJcXG4gKi9cXHJcXG5Qb2x5LnByb3RvdHlwZS5pbnRlcnNlY3RzID0gZnVuY3Rpb24ocG9seSkge1xcclxcbiAgdmFyIGluc2lkZSA9IHBvbHkucG9pbnRzLnNvbWUoZnVuY3Rpb24ocCkge1xcclxcbiAgICByZXR1cm4gdGhpcy5jb250YWluc1BvaW50KHApO1xcclxcbiAgfSwgdGhpcyk7XFxyXFxuICBpbnNpZGUgPSBpbnNpZGUgfHwgdGhpcy5wb2ludHMuc29tZShmdW5jdGlvbihwKSB7XFxyXFxuICAgIHJldHVybiBwb2x5LmNvbnRhaW5zUG9pbnQocCk7XFxyXFxuICB9KTtcXHJcXG4gIGlmIChpbnNpZGUpIHtcXHJcXG4gICAgcmV0dXJuIHRydWU7XFxyXFxuICB9IGVsc2Uge1xcclxcbiAgICB2YXIgb3duRWRnZXMgPSB0aGlzLmVkZ2VzKCk7XFxyXFxuICAgIHZhciBvdGhlckVkZ2VzID0gcG9seS5lZGdlcygpO1xcclxcbiAgICB2YXIgaW50ZXJzZWN0ID0gb3duRWRnZXMuc29tZShmdW5jdGlvbihvd25FZGdlKSB7XFxyXFxuICAgICAgcmV0dXJuIG90aGVyRWRnZXMuc29tZShmdW5jdGlvbihvdGhlckVkZ2UpIHtcXHJcXG4gICAgICAgIHJldHVybiBvd25FZGdlLmludGVyc2VjdHMob3RoZXJFZGdlKTtcXHJcXG4gICAgICB9KTtcXHJcXG4gICAgfSk7XFxyXFxuICAgIHJldHVybiBpbnRlcnNlY3Q7XFxyXFxuICB9XFxyXFxufTtcXHJcXG5cXHJcXG52YXIgdXRpbCA9IHt9O1xcclxcbmV4cG9ydHMudXRpbCA9IHV0aWw7XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogR2l2ZW4gYW4gYXJyYXkgb2YgcG9seWdvbnMsIHJldHVybnMgdGhlIG9uZSB0aGF0IGNvbnRhaW5zIHRoZSBwb2ludC5cXHJcXG4gKiBJZiBubyBwb2x5Z29uIGlzIGZvdW5kLCBudWxsIGlzIHJldHVybmVkLlxcclxcbiAqIEBwYXJhbSB7UG9pbnR9IHAgLSBUaGUgcG9pbnQgdG8gZmluZCB0aGUgcG9seWdvbiBmb3IuXFxyXFxuICogQHBhcmFtIHtBcnJheS48UG9seT59IHBvbHlzIC0gVGhlIHBvbHlnb25zIHRvIHNlYXJjaCBmb3IgdGhlIHBvaW50LlxcclxcbiAqIEByZXR1cm4gez9Qb2x5Z29ufSAtIFRoZSBwb2x5Z29uIGNvbnRhaW5pbmcgdGhlIHBvaW50LlxcclxcbiAqL1xcclxcbnV0aWwuZmluZFBvbHlGb3JQb2ludCA9IGZ1bmN0aW9uKHAsIHBvbHlzKSB7XFxyXFxuICB2YXIgaSwgcG9seTtcXHJcXG4gIGZvciAoaSBpbiBwb2x5cykge1xcclxcbiAgICBwb2x5ID0gcG9seXNbaV07XFxyXFxuICAgIGlmIChwb2x5LmNvbnRhaW5zUG9pbnQocCkpIHtcXHJcXG4gICAgICByZXR1cm4gcG9seTtcXHJcXG4gICAgfVxcclxcbiAgfVxcclxcbiAgcmV0dXJuIG51bGw7XFxyXFxufTtcXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBIb2xkcyB0aGUgcHJvcGVydGllcyBvZiBhIGNvbGxpc2lvbiwgaWYgb25lIG9jY3VycmVkLlxcclxcbiAqIEB0eXBlZGVmIENvbGxpc2lvblxcclxcbiAqIEB0eXBlIHtvYmplY3R9XFxyXFxuICogQHByb3BlcnR5IHtib29sZWFufSBjb2xsaWRlcyAtIFdoZXRoZXIgdGhlcmUgaXMgYSBjb2xsaXNpb24uXFxyXFxuICogQHByb3BlcnR5IHtib29sZWFufSBpbnNpZGUgLSBXaGV0aGVyIG9uZSBvYmplY3QgaXMgaW5zaWRlIHRoZSBvdGhlci5cXHJcXG4gKiBAcHJvcGVydHkgez9Qb2ludH0gcG9pbnQgLSBUaGUgcG9pbnQgb2YgY29sbGlzaW9uLCBpZiBjb2xsaXNpb25cXHJcXG4gKiAgIG9jY3VycywgYW5kIGlmIGBpbnNpZGVgIGlzIGZhbHNlLlxcclxcbiAqIEBwcm9wZXJ0eSB7P1BvaW50fSBub3JtYWwgLSBBIHVuaXQgdmVjdG9yIG5vcm1hbCB0byB0aGUgcG9pbnRcXHJcXG4gKiAgIG9mIGNvbGxpc2lvbiwgaWYgaXQgb2NjdXJzIGFuZCBpZiBgaW5zaWRlYCBpcyBmYWxzZS5cXHJcXG4gKi9cXHJcXG4vKipcXHJcXG4gKiBJZiB0aGUgcmF5IGludGVyc2VjdHMgdGhlIGNpcmNsZSwgdGhlIGRpc3RhbmNlIHRvIHRoZSBpbnRlcnNlY3Rpb25cXHJcXG4gKiBhbG9uZyB0aGUgcmF5IGlzIHJldHVybmVkLCBvdGhlcndpc2UgZmFsc2UgaXMgcmV0dXJuZWQuXFxyXFxuICogQHBhcmFtIHtQb2ludH0gcCAtIFRoZSBzdGFydCBvZiB0aGUgcmF5LlxcclxcbiAqIEBwYXJhbSB7UG9pbnR9IHJheSAtIFVuaXQgdmVjdG9yIGV4dGVuZGluZyBmcm9tIGBwYC5cXHJcXG4gKiBAcGFyYW0ge1BvaW50fSBjIC0gVGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlIGZvciB0aGUgb2JqZWN0IGJlaW5nXFxyXFxuICogICBjaGVja2VkIGZvciBpbnRlcnNlY3Rpb24uXFxyXFxuICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIGNpcmNsZS5cXHJcXG4gKiBAcmV0dXJuIHtDb2xsaXNpb259IC0gVGhlIGNvbGxpc2lvbiBpbmZvcm1hdGlvbi5cXHJcXG4gKi9cXHJcXG51dGlsLmxpbmVDaXJjbGVJbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihwLCByYXksIGMsIHJhZGl1cykge1xcclxcbiAgdmFyIGNvbGxpc2lvbiA9IHtcXHJcXG4gICAgY29sbGlkZXM6IGZhbHNlLFxcclxcbiAgICBpbnNpZGU6IGZhbHNlLFxcclxcbiAgICBwb2ludDogbnVsbCxcXHJcXG4gICAgbm9ybWFsOiBudWxsXFxyXFxuICB9O1xcclxcbiAgdmFyIHZwYyA9IGMuc3ViKHApO1xcclxcblxcclxcbiAgaWYgKHZwYy5sZW4oKSA8PSByYWRpdXMpIHtcXHJcXG4gICAgLy8gUG9pbnQgaXMgaW5zaWRlIG9ic3RhY2xlLlxcclxcbiAgICBjb2xsaXNpb24uY29sbGlkZXMgPSB0cnVlO1xcclxcbiAgICBjb2xsaXNpb24uaW5zaWRlID0gKHZwYy5sZW4oKSAhPT0gcmFkaXVzKTtcXHJcXG4gIH0gZWxzZSBpZiAocmF5LmRvdCh2cGMpID49IDApIHtcXHJcXG4gICAgLy8gQ2lyY2xlIGlzIGFoZWFkIG9mIHBvaW50LlxcclxcbiAgICAvLyBQcm9qZWN0aW9uIG9mIGNlbnRlciBwb2ludCBvbnRvIHJheS5cXHJcXG4gICAgdmFyIHBjID0gcC5hZGQocmF5Lm11bChyYXkuZG90KHZwYykpKTtcXHJcXG4gICAgLy8gTGVuZ3RoIGZyb20gYyB0byBpdHMgcHJvamVjdGlvbiBvbiB0aGUgcmF5LlxcclxcbiAgICB2YXIgbGVuX2NfcGMgPSBjLnN1YihwYykubGVuKCk7XFxyXFxuXFxyXFxuICAgIGlmIChsZW5fY19wYyA8PSByYWRpdXMpIHtcXHJcXG4gICAgICBjb2xsaXNpb24uY29sbGlkZXMgPSB0cnVlO1xcclxcblxcclxcbiAgICAgIC8vIERpc3RhbmNlIGZyb20gcHJvamVjdGVkIHBvaW50IHRvIGludGVyc2VjdGlvbi5cXHJcXG4gICAgICB2YXIgbGVuX2ludGVyc2VjdGlvbiA9IE1hdGguc3FydChsZW5fY19wYyAqIGxlbl9jX3BjICsgcmFkaXVzICogcmFkaXVzKTtcXHJcXG4gICAgICBjb2xsaXNpb24ucG9pbnQgPSBwYy5zdWIocmF5Lm11bChsZW5faW50ZXJzZWN0aW9uKSk7XFxyXFxuICAgICAgY29sbGlzaW9uLm5vcm1hbCA9IGNvbGxpc2lvbi5wb2ludC5zdWIoYykubm9ybWFsaXplKCk7XFxyXFxuICAgIH1cXHJcXG4gIH1cXHJcXG4gIHJldHVybiBjb2xsaXNpb247XFxyXFxufTtcXHJcXG5cXG59LHt9XSw0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcXG52YXIgZ2VvID0gcmVxdWlyZShcXCcuL2dlb21ldHJ5XFwnKTtcXHJcXG52YXIgZmluZFBvbHlGb3JQb2ludCA9IGdlby51dGlsLmZpbmRQb2x5Rm9yUG9pbnQ7XFxyXFxudmFyIFByaW9yaXR5UXVldWUgPSByZXF1aXJlKFxcJ3ByaW9yaXR5LXF1ZXVlXFwnKTtcXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBQYXRoZmluZGVyIGltcGxlbWVudHMgcGF0aGZpbmRpbmcgb24gYSBuYXZpZ2F0aW9uIG1lc2guXFxyXFxuICogQGNvbnN0cnVjdG9yXFxyXFxuICogQHBhcmFtIHtBcnJheS48UG9seT59IHBvbHlzIC0gVGhlIHBvbHlnb25zIGRlZmluaW5nIHRoZSBuYXZpZ2F0aW9uIG1lc2guXFxyXFxuICogQHBhcmFtIHtib29sZWFufSBbaW5pdD10cnVlXSAtIFdoZXRoZXIgb3Igbm90IHRvIGluaXRpYWxpemUgdGhlIHBhdGhmaW5kZXIuXFxyXFxuICovXFxyXFxudmFyIFBhdGhmaW5kZXIgPSBmdW5jdGlvbihwb2x5cywgaW5pdCkge1xcclxcbiAgaWYgKHR5cGVvZiBpbml0ID09IFwidW5kZWZpbmVkXCIpIGluaXQgPSB0cnVlO1xcclxcbiAgdGhpcy5wb2x5cyA9IHBvbHlzO1xcclxcbiAgaWYgKGluaXQpIHtcXHJcXG4gICAgdGhpcy5pbml0KCk7XFxyXFxuICB9XFxyXFxufTtcXHJcXG5tb2R1bGUuZXhwb3J0cyA9IFBhdGhmaW5kZXI7XFxyXFxuXFxyXFxuUGF0aGZpbmRlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xcclxcbiAgdGhpcy5ncmlkID0gdGhpcy5nZW5lcmF0ZUFkamFjZW5jeUdyaWQodGhpcy5wb2x5cyk7XFxyXFxufTtcXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBDb21wdXRlcyBwYXRoIGZyb20gc291cmNlIHRvIHRhcmdldCwgdXNpbmcgc2lkZXMgYW5kIGNlbnRlcnMgb2YgdGhlIGVkZ2VzXFxyXFxuICogYmV0d2VlbiBhZGphY2VudCBwb2x5Z29ucy4gc291cmNlIGFuZCB0YXJnZXQgYXJlIFBvaW50cyBhbmQgcG9seXMgc2hvdWxkXFxyXFxuICogYmUgdGhlIGZpbmFsIHBhcnRpdGlvbmVkIG1hcC5cXHJcXG4gKiBAcGFyYW0ge1BvaW50fSBzb3VyY2UgLSBUaGUgc3RhcnQgbG9jYXRpb24gZm9yIHRoZSBzZWFyY2guXFxyXFxuICogQHBhcmFtIHtQb2ludH0gdGFyZ2V0IC0gVGhlIHRhcmdldCBsb2NhdGlvbiBmb3IgdGhlIHNlYXJjaC5cXHJcXG4gKiBAcmV0dXJuIHs/QXJyYXkuPFBvaW50Pn0gLSBBIHNlcmllcyBvZiBwb2ludHMgcmVwcmVzZW50aW5nIHRoZSBwYXRoIGZyb21cXHJcXG4gKiAgIHRoZSBzb3VyY2UgdG8gdGhlIHRhcmdldC4gSWYgYSBwYXRoIGlzIG5vdCBmb3VuZCwgYG51bGxgIGlzIHJldHVybmVkLlxcclxcbiAqL1xcclxcblBhdGhmaW5kZXIucHJvdG90eXBlLmFTdGFyID0gZnVuY3Rpb24oc291cmNlLCB0YXJnZXQpIHtcXHJcXG4gIC8vIENvbXBhcmVzIHRoZSB2YWx1ZSBvZiB0d28gbm9kZXMuXFxyXFxuICBmdW5jdGlvbiBub2RlVmFsdWUobm9kZTEsIG5vZGUyKSB7XFxyXFxuICAgIHJldHVybiAobm9kZTEuZGlzdCArIGhldXJpc3RpYyhub2RlMS5wb2ludCkpIC0gKG5vZGUyLmRpc3QgKyBoZXVyaXN0aWMobm9kZTIucG9pbnQpKTtcXHJcXG4gIH1cXHJcXG5cXHJcXG4gIC8vIERpc3RhbmNlIGJldHdlZW4gcG9seWdvbnMuXFxyXFxuICBmdW5jdGlvbiBldWNsaWRlYW5EaXN0YW5jZShwMSwgcDIpIHtcXHJcXG4gICAgcmV0dXJuIHAxLmRpc3QocDIpO1xcclxcbiAgfVxcclxcblxcclxcbiAgLy8gRGlzdGFuY2UgYmV0d2VlbiBwb2x5Z29ucy4gdG9kbzogdXBkYXRlXFxyXFxuICBmdW5jdGlvbiBtYW5oYXR0YW5EaXN0YW5jZShlbHQxLCBlbHQyKSB7XFxyXFxuICAgIHJldHVybiAoZWx0MS5yIC0gZWx0Mi5yKSArIChlbHQxLmMgLSBlbHQyLmMpO1xcclxcbiAgfVxcclxcblxcclxcbiAgLy8gVGFrZXMgUG9pbnQgYW5kIHJldHVybnMgdmFsdWUuXFxyXFxuICBmdW5jdGlvbiBoZXVyaXN0aWMocCkge1xcclxcbiAgICByZXR1cm4gZXVjbGlkZWFuRGlzdGFuY2UocCwgdGFyZ2V0KTtcXHJcXG4gIH1cXHJcXG5cXHJcXG4gIHZhciBzb3VyY2VQb2x5ID0gZmluZFBvbHlGb3JQb2ludChzb3VyY2UsIHRoaXMucG9seXMpO1xcclxcblxcclxcbiAgLy8gV2VcXCdyZSBvdXRzaWRlIG9mIHRoZSBtZXNoIHNvbWVob3cuIFRyeSBhIGZldyBuZWFyYnkgcG9pbnRzLlxcclxcbiAgaWYgKCFzb3VyY2VQb2x5KSB7XFxyXFxuICAgIHZhciBvZmZzZXRTb3VyY2UgPSBbbmV3IFBvaW50KDUsIDApLCBuZXcgUG9pbnQoLTUsIDApLCBuZXcgUG9pbnQoMCwgLTUpLCBuZXcgUG9pbnQoMCwgNSldO1xcclxcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9mZnNldFNvdXJjZS5sZW5ndGg7IGkrKykge1xcclxcbiAgICAgIC8vIE1ha2UgbmV3IHBvaW50LlxcclxcbiAgICAgIHZhciBwb2ludCA9IHNvdXJjZS5hZGQob2Zmc2V0U291cmNlW2ldKTtcXHJcXG4gICAgICBzb3VyY2VQb2x5ID0gZmluZFBvbHlGb3JQb2ludChwb2ludCwgdGhpcy5wb2x5cyk7XFxyXFxuICAgICAgaWYgKHNvdXJjZVBvbHkpIHtcXHJcXG4gICAgICAgIHNvdXJjZSA9IHBvaW50O1xcclxcbiAgICAgICAgYnJlYWs7XFxyXFxuICAgICAgfVxcclxcbiAgICB9XFxyXFxuICAgIGlmICghc291cmNlUG9seSkge1xcclxcbiAgICAgIHJldHVybiBudWxsO1xcclxcbiAgICB9XFxyXFxuICB9XFxyXFxuICB2YXIgdGFyZ2V0UG9seSA9IGZpbmRQb2x5Rm9yUG9pbnQodGFyZ2V0LCB0aGlzLnBvbHlzKTtcXHJcXG5cXHJcXG4gIC8vIEhhbmRsZSB0cml2aWFsIGNhc2UuXFxyXFxuICBpZiAoc291cmNlUG9seSA9PSB0YXJnZXRQb2x5KSB7XFxyXFxuICAgIHJldHVybiBbc291cmNlLCB0YXJnZXRdO1xcclxcbiAgfVxcclxcblxcclxcbiAgLy8gV2FybmluZywgbWF5IGhhdmUgY29tcGF0aWJpbGl0eSBpc3N1ZXMuXFxyXFxuICB2YXIgZGlzY292ZXJlZFBvbHlzID0gbmV3IFdlYWtTZXQoKTtcXHJcXG4gIHZhciBkaXNjb3ZlcmVkUG9pbnRzID0gbmV3IFdlYWtTZXQoKTtcXHJcXG4gIHZhciBwcSA9IG5ldyBQcmlvcml0eVF1ZXVlKHsgY29tcGFyYXRvcjogbm9kZVZhbHVlIH0pO1xcclxcbiAgdmFyIGZvdW5kID0gbnVsbDtcXHJcXG4gIC8vIEluaXRpYWxpemUgd2l0aCBzdGFydCBsb2NhdGlvbi5cXHJcXG4gIHBxLnF1ZXVlKHtkaXN0OiAwLCBwb2x5OiBzb3VyY2VQb2x5LCBwb2ludDogc291cmNlLCBwYXJlbnQ6IG51bGx9KTtcXHJcXG4gIHdoaWxlIChwcS5sZW5ndGggPiAwKSB7XFxyXFxuICAgIHZhciBub2RlID0gcHEuZGVxdWV1ZSgpO1xcclxcbiAgICBpZiAobm9kZS5wb2x5ID09IHRhcmdldFBvbHkpIHtcXHJcXG4gICAgICBmb3VuZCA9IG5vZGU7XFxyXFxuICAgICAgYnJlYWs7XFxyXFxuICAgIH0gZWxzZSB7XFxyXFxuICAgICAgZGlzY292ZXJlZFBvbHlzLmFkZChub2RlLnBvbHkpO1xcclxcbiAgICAgIGRpc2NvdmVyZWRQb2ludHMuYWRkKG5vZGUucG9pbnQpO1xcclxcbiAgICB9XFxyXFxuICAgIC8vIFRoaXMgbWF5IGJlIHVuZGVmaW5lZCBpZiB0aGVyZSB3YXMgbm8gcG9seWdvbiBmb3VuZC5cXHJcXG4gICAgdmFyIG5laWdoYm9ycyA9IHRoaXMuZ3JpZC5nZXQobm9kZS5wb2x5KTtcXHJcXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcXHJcXG4gICAgICB2YXIgZWx0ID0gbmVpZ2hib3JzW2ldO1xcclxcbiAgICAgIHZhciBuZWlnaGJvckZvdW5kID0gZGlzY292ZXJlZFBvbHlzLmhhcyhlbHQucG9seSk7XFxyXFxuXFxyXFxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBlbHQuZWRnZS5wb2ludHMubGVuZ3RoOyBqKyspIHtcXHJcXG4gICAgICAgIHZhciBwID0gZWx0LmVkZ2UucG9pbnRzW2pdO1xcclxcbiAgICAgICAgaWYgKCFuZWlnaGJvckZvdW5kIHx8ICFkaXNjb3ZlcmVkUG9pbnRzLmhhcyhwKSlcXHJcXG4gICAgICAgICAgcHEucXVldWUoe2Rpc3Q6IG5vZGUuZGlzdCArIGV1Y2xpZGVhbkRpc3RhbmNlKHAsIG5vZGUucG9pbnQpLCBwb2x5OiBlbHQucG9seSwgcG9pbnQ6IHAsIHBhcmVudDogbm9kZX0pO1xcclxcbiAgICAgIH1cXHJcXG4gICAgfVxcclxcbiAgfVxcclxcblxcclxcbiAgaWYgKGZvdW5kKSB7XFxyXFxuICAgIHZhciBwYXRoID0gW107XFxyXFxuICAgIHZhciBjdXJyZW50ID0gZm91bmQ7XFxyXFxuICAgIHdoaWxlIChjdXJyZW50LnBhcmVudCkge1xcclxcbiAgICAgIHBhdGgudW5zaGlmdChjdXJyZW50LnBvaW50KTtcXHJcXG4gICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XFxyXFxuICAgIH1cXHJcXG4gICAgcGF0aC51bnNoaWZ0KGN1cnJlbnQucG9pbnQpO1xcclxcbiAgICAvLyBBZGQgZW5kIHBvaW50IHRvIHBhdGguXFxyXFxuICAgIHBhdGgucHVzaCh0YXJnZXQpO1xcclxcbiAgICByZXR1cm4gcGF0aDtcXHJcXG4gIH0gZWxzZSB7XFxyXFxuICAgIHJldHVybiBudWxsO1xcclxcbiAgfVxcclxcbn07XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogSG9sZHMgdGhlIFwibmVpZ2hib3JcIiByZWxhdGlvbnNoaXAgb2YgUG9seSBvYmplY3RzIGluIHRoZSBwYXJ0aXRpb25cXHJcXG4gKiB1c2luZyB0aGUgUG9seVxcJ3MgdGhlbXNlbHZlcyBhcyBrZXlzLCBhbmQgYW4gYXJyYXkgb2YgUG9seVxcJ3MgYXNcXHJcXG4gKiB2YWx1ZXMsIHdoZXJlIHRoZSBQb2x5cyBpbiB0aGUgYXJyYXkgYXJlIG5laWdoYm9ycyBvZiB0aGUgUG9seVxcclxcbiAqIHRoYXQgd2FzIHRoZSBrZXkuXFxyXFxuICogQHR5cGVkZWYgQWRqYWNlbmN5R3JpZFxcclxcbiAqIEB0eXBlIHtPYmplY3QuPFBvbHksIEFycmF5PFBvbHk+Pn1cXHJcXG4gKi9cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBHaXZlbiBhbiBhcnJheSBvZiBQb2x5IG9iamVjdHMsIGZpbmQgYWxsIG5laWdoYm9yaW5nIHBvbHlnb25zIGZvclxcclxcbiAqIGVhY2ggcG9seWdvbi5cXHJcXG4gKiBAcHJpdmF0ZVxcclxcbiAqIEBwYXJhbSB7QXJyYXkuPFBvbHk+fSBwb2x5cyAtIFRoZSBhcnJheSBvZiBwb2x5cyB0byBmaW5kIG5laWdoYm9yc1xcclxcbiAqICAgYW1vbmcuXFxyXFxuICogQHJldHVybiB7QWRqYWNlbmN5R3JpZH0gLSBUaGUgXCJuZWlnaGJvclwiIHJlbGF0aW9uc2hpcHMuXFxyXFxuICovXFxyXFxuUGF0aGZpbmRlci5wcm90b3R5cGUuZ2VuZXJhdGVBZGphY2VuY3lHcmlkID0gZnVuY3Rpb24ocG9seXMpIHtcXHJcXG4gIHZhciBuZWlnaGJvcnMgPSBuZXcgV2Vha01hcCgpO1xcclxcbiAgcG9seXMuZm9yRWFjaChmdW5jdGlvbihwb2x5LCBwb2x5SSwgcG9seXMpIHtcXHJcXG4gICAgaWYgKG5laWdoYm9ycy5oYXMocG9seSkpIHtcXHJcXG4gICAgICAvLyBNYXhpbXVtIG51bWJlciBvZiBuZWlnaGJvcnMgYWxyZWFkeSBmb3VuZC5cXHJcXG4gICAgICBpZiAobmVpZ2hib3JzLmdldChwb2x5KS5sZW5ndGggPT0gcG9seS5udW1wb2ludHMpIHtcXHJcXG4gICAgICAgIHJldHVybjtcXHJcXG4gICAgICB9XFxyXFxuICAgIH0gZWxzZSB7XFxyXFxuICAgICAgLy8gSW5pdGlhbGl6ZSBhcnJheS5cXHJcXG4gICAgICBuZWlnaGJvcnMuc2V0KHBvbHksIG5ldyBBcnJheSgpKTtcXHJcXG4gICAgfVxcclxcbiAgICAvLyBPZiByZW1haW5pbmcgcG9seWdvbnMsIGZpbmQgc29tZSB0aGF0IGFyZSBhZGphY2VudC5cXHJcXG4gICAgcG9seS5wb2ludHMuZm9yRWFjaChmdW5jdGlvbihwMSwgaSwgcG9pbnRzKSB7XFxyXFxuICAgICAgLy8gTmV4dCBwb2ludC5cXHJcXG4gICAgICB2YXIgcDIgPSBwb2ludHNbcG9seS5nZXROZXh0SShpKV07XFxyXFxuICAgICAgZm9yICh2YXIgcG9seUogPSBwb2x5SSArIDE7IHBvbHlKIDwgcG9seXMubGVuZ3RoOyBwb2x5SisrKSB7XFxyXFxuICAgICAgICB2YXIgcG9seTIgPSBwb2x5c1twb2x5Sl07XFxyXFxuICAgICAgICAvLyBJdGVyYXRlIG92ZXIgcG9pbnRzIHVudGlsIG1hdGNoIGlzIGZvdW5kLlxcclxcbiAgICAgICAgcG9seTIucG9pbnRzLnNvbWUoZnVuY3Rpb24ocTEsIGosIHBvaW50czIpIHtcXHJcXG4gICAgICAgICAgdmFyIHEyID0gcG9pbnRzMltwb2x5Mi5nZXROZXh0SShqKV07XFxyXFxuICAgICAgICAgIHZhciBtYXRjaCA9IHAxLmVxKHEyKSAmJiBwMi5lcShxMSk7XFxyXFxuICAgICAgICAgIGlmIChtYXRjaCkge1xcclxcbiAgICAgICAgICAgIHZhciBlZGdlID0gbmV3IEVkZ2UocDEsIHAyKTtcXHJcXG4gICAgICAgICAgICBuZWlnaGJvcnMuZ2V0KHBvbHkpLnB1c2goeyBwb2x5OiBwb2x5MiwgZWRnZTogZWRnZSB9KTtcXHJcXG4gICAgICAgICAgICBpZiAoIW5laWdoYm9ycy5oYXMocG9seTIpKSB7XFxyXFxuICAgICAgICAgICAgICBuZWlnaGJvcnMuc2V0KHBvbHkyLCBuZXcgQXJyYXkoKSk7XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgIG5laWdoYm9ycy5nZXQocG9seTIpLnB1c2goeyBwb2x5OiBwb2x5LCBlZGdlOiBlZGdlIH0pO1xcclxcbiAgICAgICAgICB9XFxyXFxuICAgICAgICAgIHJldHVybiBtYXRjaDtcXHJcXG4gICAgICAgIH0pO1xcclxcbiAgICAgICAgaWYgKG5laWdoYm9ycy5nZXQocG9seSkubGVuZ3RoID09IHBvbHkubnVtcG9pbnRzKSBicmVhaztcXHJcXG4gICAgICB9XFxyXFxuICAgIH0pO1xcclxcbiAgfSk7XFxyXFxuICByZXR1cm4gbmVpZ2hib3JzO1xcclxcbn07XFxyXFxuXFxufSx7XCIuL2dlb21ldHJ5XCI6MyxcInByaW9yaXR5LXF1ZXVlXCI6MX1dfSx7fSxbMl0pJ10se3R5cGU6XCJ0ZXh0L2phdmFzY3JpcHRcIn0pKSk7XHJcbiAgdGhpcy53b3JrZXIub25tZXNzYWdlID0gdGhpcy5fZ2V0V29ya2VySW50ZXJmYWNlKCk7XHJcbiAgLy8gQ2hlY2sgaWYgd29ya2VyIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWQuXHJcbiAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoW1wiaXNJbml0aWFsaXplZFwiXSk7XHJcbiAgdGhpcy53b3JrZXJJbml0aWFsaXplZCA9IGZhbHNlO1xyXG5cclxuICAvLyBTZXQgdXAgY2FsbGJhY2sgdG8gdXBkYXRlIHdvcmtlciBvbiBuYXZtZXNoIHVwZGF0ZS5cclxuICB0aGlzLm9uVXBkYXRlKGZ1bmN0aW9uKGRpc3JlZ2FyZCwgbmV3UG9seXMsIHJlbW92ZWRJbmRpY2VzKSB7XHJcbiAgICBpZiAodGhpcy53b3JrZXIgJiYgdGhpcy53b3JrZXJJbml0aWFsaXplZCkge1xyXG4gICAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZShbXCJwb2x5VXBkYXRlXCIsIG5ld1BvbHlzLCByZW1vdmVkSW5kaWNlc10pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5sb2dnZXIubG9nKFwibmF2bWVzaDpkZWJ1Z1wiLCBcIldvcmtlciBub3QgbG9hZGVkIHlldC5cIik7XHJcbiAgICB9XHJcbiAgfS5iaW5kKHRoaXMpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBIYW5kbGVyIGZvciBsb2cgbWVzc2FnZXMgc2VudCBieSB3b3JrZXIuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPChzdHJpbmd8b2JqZWN0KT59IG1lc3NhZ2UgLSBBcnJheSBvZiBhcmd1bWVudHMgdG9cclxuICogICBwYXNzIHRvIGBMb2dnZXIubG9nYC4gVGhlIGZpcnN0IGVsZW1lbnQgc2hvdWxkIGJlIHRoZSBncm91cCB0b1xyXG4gKiAgIGFzc29jaWF0ZSB0aGUgbWVzc2FnZSB3aXRoLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX3dvcmtlckxvZ2dlciA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcclxuICB0aGlzLmxvZ2dlci5sb2cuYXBwbHkobnVsbCwgbWVzc2FnZSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgZnVuY3Rpb24gdG8gYmUgdXNlZCBmb3IgdGhlIGBvbm1lc3NhZ2VgIGNhbGxiYWNrIGZvclxyXG4gKiB0aGUgd2ViIHdvcmtlci5cclxuICogQHByaXZhdGVcclxuICogQHJldHVybiB7RnVuY3Rpb259IC0gVGhlIGBvbm1lc3NhZ2VgIGhhbmRsZXIgZm9yIHRoZSB3ZWIgd29ya2VyLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX2dldFdvcmtlckludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiBmdW5jdGlvbihtZXNzYWdlKSB7XHJcbiAgICB2YXIgZGF0YSA9IG1lc3NhZ2UuZGF0YTtcclxuICAgIHZhciBuYW1lID0gZGF0YVswXTtcclxuXHJcbiAgICAvLyBPdXRwdXQgZGVidWcgbWVzc2FnZSBmb3IgYWxsIG1lc3NhZ2VzIHJlY2VpdmVkIGV4Y2VwdCBcImxvZ1wiXHJcbiAgICAvLyBtZXNzYWdlcy5cclxuICAgIGlmIChuYW1lICE9PSBcImxvZ1wiKVxyXG4gICAgICB0aGlzLmxvZ2dlci5sb2coXCJuYXZtZXNoOmRlYnVnXCIsIFwiTWVzc2FnZSByZWNlaXZlZCBmcm9tIHdvcmtlcjpcIiwgZGF0YSk7XHJcblxyXG4gICAgaWYgKG5hbWUgPT0gXCJsb2dcIikge1xyXG4gICAgICB0aGlzLl93b3JrZXJMb2dnZXIoZGF0YS5zbGljZSgxKSk7XHJcbiAgICB9IGVsc2UgaWYgKG5hbWUgPT0gXCJyZXN1bHRcIikge1xyXG4gICAgICB2YXIgcGF0aCA9IGRhdGFbMV07XHJcbiAgICAgIHRoaXMubGFzdENhbGxiYWNrKHBhdGgpO1xyXG4gICAgfSBlbHNlIGlmIChuYW1lID09IFwiaW5pdGlhbGl6ZWRcIikge1xyXG4gICAgICB0aGlzLndvcmtlckluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgLy8gU2VuZCBwYXJzZWQgbWFwIHBvbHlnb25zIHRvIHdvcmtlciB3aGVuIGF2YWlsYWJsZS5cclxuICAgICAgdGhpcy5vbkluaXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoW1wicG9seXNcIiwgdGhpcy5wb2x5c10pO1xyXG4gICAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG4gIH0uYmluZCh0aGlzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBNYWtlIHV0aWxpdGllcyBpbiBwb2x5cGFydGl0aW9uIGF2YWlsYWJsZSB3aXRob3V0IHJlcXVpcmluZ1xyXG4gKiB0aGF0IGl0IGJlIGluY2x1ZGVkIGluIGV4dGVybmFsIHNjcmlwdHMuXHJcbiAqL1xyXG5OYXZNZXNoLnBvbHkgPSBnZW87XHJcblxyXG4vKipcclxuICogSG9sZCBtZXRob2RzIHVzZWQgZm9yIGdlbmVyYXRpbmcgdGhlIG5hdmlnYXRpb24gbWVzaC5cclxuICogQHByaXZhdGVcclxuICovXHJcbk5hdk1lc2guX2dlb21ldHJ5ID0ge307XHJcblxyXG4vKipcclxuICogSW5pdGlhbGl6ZWQgQ2xpcHBlciBmb3Igb3BlcmF0aW9ucy5cclxuICogQHByaXZhdGVcclxuICogQHR5cGUge0NsaXBwZXJMaWIuQ2xpcHBlcn1cclxuICovXHJcbk5hdk1lc2guX2dlb21ldHJ5LmNwciA9IG5ldyBDbGlwcGVyTGliLkNsaXBwZXIoKTtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplZCBDbGlwcGVyT2Zmc2V0IGZvciBvcGVyYXRpb25zLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAdHlwZSB7Q2xpcHBlckxpYi5DbGlwcGVyT2Zmc2V0fVxyXG4gKi9cclxuTmF2TWVzaC5fZ2VvbWV0cnkuY28gPSBuZXcgQ2xpcHBlckxpYi5DbGlwcGVyT2Zmc2V0KCk7XHJcblxyXG4vLyBEZWZhdWx0cy5cclxuTmF2TWVzaC5fZ2VvbWV0cnkuY28uTWl0ZXJMaW1pdCA9IDI7XHJcbk5hdk1lc2guX2dlb21ldHJ5LnNjYWxlID0gMTAwO1xyXG5cclxuLyoqXHJcbiAqIEdldCBhIHBvbHlnb25hbCBhcHByb3hpbWF0aW9uIG9mIGEgY2lyY2xlIG9mIGEgZ2l2ZW4gcmFkaXVzXHJcbiAqIGNlbnRlcmVkIGF0IHRoZSBwcm92aWRlZCBwb2ludC4gVmVydGljZXMgb2YgcG9seWdvbiBhcmUgaW4gQ1dcclxuICogb3JkZXIuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIGZvciB0aGUgcG9seWdvbi5cclxuICogQHBhcmFtIHtQb2ludH0gW3BvaW50XSAtIFRoZSBwb2ludCBhdCB3aGljaCB0byBjZW50ZXIgdGhlIHBvbHlnb24uXHJcbiAqICAgSWYgYSBwb2ludCBpcyBub3QgcHJvdmlkZWQgdGhlbiB0aGUgcG9seWdvbiBpcyBjZW50ZXJlZCBhdCB0aGVcclxuICogICBvcmlnaW4uXHJcbiAqIEByZXR1cm4ge1BvbHl9IC0gVGhlIGFwcHJveGltYXRlZCBjaXJjbGUuXHJcbiAqL1xyXG5OYXZNZXNoLl9nZW9tZXRyeS5nZXRBcHByb3hpbWF0ZUNpcmNsZSA9IGZ1bmN0aW9uKHJhZGl1cywgcG9pbnQpIHtcclxuICB2YXIgeCwgeTtcclxuICBpZiAocG9pbnQpIHtcclxuICAgIHggPSBwb2ludC54O1xyXG4gICAgeSA9IHBvaW50Lnk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHggPSAwO1xyXG4gICAgeSA9IDA7XHJcbiAgfVxyXG4gIHZhciBvZmZzZXQgPSByYWRpdXMgKiBNYXRoLnRhbihNYXRoLlBJIC8gOCk7XHJcbiAgb2Zmc2V0ID0gTWF0aC5yb3VuZDEwKG9mZnNldCwgLTEpO1xyXG4gIHZhciBwb2x5ID0gbmV3IFBvbHkoW1xyXG4gICAgbmV3IFBvaW50KHggLSByYWRpdXMsIHkgLSBvZmZzZXQpLFxyXG4gICAgbmV3IFBvaW50KHggLSByYWRpdXMsIHkgKyBvZmZzZXQpLFxyXG4gICAgbmV3IFBvaW50KHggLSBvZmZzZXQsIHkgKyByYWRpdXMpLFxyXG4gICAgbmV3IFBvaW50KHggKyBvZmZzZXQsIHkgKyByYWRpdXMpLFxyXG4gICAgbmV3IFBvaW50KHggKyByYWRpdXMsIHkgKyBvZmZzZXQpLFxyXG4gICAgbmV3IFBvaW50KHggKyByYWRpdXMsIHkgLSBvZmZzZXQpLFxyXG4gICAgbmV3IFBvaW50KHggKyBvZmZzZXQsIHkgLSByYWRpdXMpLFxyXG4gICAgbmV3IFBvaW50KHggLSBvZmZzZXQsIHkgLSByYWRpdXMpXHJcbiAgXSk7XHJcbiAgcmV0dXJuIHBvbHk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIHNxdWFyZSB3aXRoIHNpZGUgbGVuZ3RoIGdpdmVuIGJ5IGRvdWJsZSB0aGUgcHJvdmlkZWRcclxuICogcmFkaXVzLCBjZW50ZXJlZCBhdCB0aGUgb3JpZ2luLiBWZXJ0aWNlcyBvZiBwb2x5Z29uIGFyZSBpbiBDV1xyXG4gKiBvcmRlci5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSBsZW5ndGggb2YgaGFsZiBvZiBvbmUgc2lkZS5cclxuICogQHJldHVybiB7UG9seX0gLSBUaGUgY29uc3RydWN0ZWQgc3F1YXJlLlxyXG4gKi9cclxuTmF2TWVzaC5fZ2VvbWV0cnkuZ2V0U3F1YXJlID0gZnVuY3Rpb24ocmFkaXVzKSB7XHJcbiAgdmFyIHBvbHkgPSBuZXcgUG9seShbXHJcbiAgICBuZXcgUG9pbnQoLXJhZGl1cywgcmFkaXVzKSxcclxuICAgIG5ldyBQb2ludChyYWRpdXMsIHJhZGl1cyksXHJcbiAgICBuZXcgUG9pbnQocmFkaXVzLCAtcmFkaXVzKSxcclxuICAgIG5ldyBQb2ludCgtcmFkaXVzLCAtcmFkaXVzKVxyXG4gIF0pO1xyXG4gIHJldHVybiBwb2x5O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgdXBwZXIgb3IgbG93ZXIgZGlhZ29uYWwgb2YgYSBzcXVhcmUgb2YgdGhlIGdpdmVuXHJcbiAqIHJhZGl1cy4gXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgbGVuZ3RoIG9mIGhhbGYgb2Ygb25lIHNpZGUgb2YgdGhlXHJcbiAqICAgc3F1YXJlIHRvIGdldCB0aGUgZGlhZ29uYWwgb2YuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb3JuZXIgLSBPbmUgb2YgbmUsIHNlLCBudywgc3cgaW5kaWNhdGluZyB3aGljaFxyXG4gKiAgIGNvcm5lciBzaG91bGQgYmUgZmlsbGVkLlxyXG4gKiBAcmV0dXJuIHtQb2x5fSAtIFRoZSBkaWFnb25hbCBzaGFwZS5cclxuICovXHJcbk5hdk1lc2guX2dlb21ldHJ5LmdldERpYWdvbmFsID0gZnVuY3Rpb24ocmFkaXVzLCBjb3JuZXIpIHtcclxuICB2YXIgdHlwZXMgPSB7XHJcbiAgICBcIm5lXCI6IFtbcmFkaXVzLCAtcmFkaXVzXSwgW3JhZGl1cywgcmFkaXVzXSwgWy1yYWRpdXMsIC1yYWRpdXNdXSxcclxuICAgIFwic2VcIjogW1tyYWRpdXMsIHJhZGl1c10sIFstcmFkaXVzLCByYWRpdXNdLCBbcmFkaXVzLCAtcmFkaXVzXV0sXHJcbiAgICBcInN3XCI6IFtbLXJhZGl1cywgcmFkaXVzXSwgWy1yYWRpdXMsIC1yYWRpdXNdLCBbcmFkaXVzLCByYWRpdXNdXSxcclxuICAgIFwibndcIjogW1stcmFkaXVzLCAtcmFkaXVzXSwgW3JhZGl1cywgLXJhZGl1c10sIFstcmFkaXVzLCByYWRpdXNdXVxyXG4gIH07XHJcbiAgdmFyIHBvaW50cyA9IHR5cGVzW2Nvcm5lcl0ubWFwKGZ1bmN0aW9uKG11bCkge1xyXG4gICAgcmV0dXJuIG5ldyBQb2ludChtdWxbMF0sIG11bFsxXSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIG5ldyBQb2x5KHBvaW50cyk7XHJcbn07XHJcblxyXG4vKipcclxuICogR2l2ZW4gdHdvIHNldHMgb2YgcG9seWdvbnMsIHJldHVybiBpbmRpY2VzIG9mIHRoZSBvbmVzIGluIHRoZSBibHVlXHJcbiAqIHNldCB0aGF0IGFyZSBpbnRlcnNlY3RlZCBieSBvbmVzIGluIHJlZC5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheS48UG9seT59IHJlZFxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gYmx1ZVxyXG4gKiBAcmV0dXJuIHtBcnJheS48aW50ZWdlcj59IC0gVGhlIGluZGljZXMgb2YgdGhlIGludGVyc2VjdGVkIGJsdWVcclxuICogICBwb2x5cy5cclxuICovXHJcbk5hdk1lc2guX2dlb21ldHJ5LmdldEludGVyc2VjdGlvbnMgPSBmdW5jdGlvbihyZWQsIGJsdWUpIHtcclxuICB2YXIgaW5kaWNlcyA9IFtdO1xyXG4gIC8vIE5haXZlIHNvbHV0aW9uLlxyXG4gIGJsdWUuZm9yRWFjaChmdW5jdGlvbihwb2x5LCBpKSB7XHJcbiAgICB2YXIgaW50ZXJzZWN0cyA9IHJlZC5zb21lKGZ1bmN0aW9uKHBvbHliKSB7XHJcbiAgICAgIHJldHVybiBwb2x5LmludGVyc2VjdHMocG9seWIpO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoaW50ZXJzZWN0cykge1xyXG4gICAgICBpbmRpY2VzLnB1c2goaSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGluZGljZXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQW4gQXJlYSBpcyBhbiBvYmplY3QgdGhhdCBob2xkcyBhIHBvbHlnb24gcmVwcmVzZW50aW5nIGEgc3BhY2VcclxuICogYWxvbmcgd2l0aCBpdHMgaG9sZXMuIEFuIEFyZWEgY2FuIHJlcHJlc2VudCwgZm9yIGV4YW1wbGUsIGFcclxuICogdHJhdmVyc2FibGUgcmVnaW9uLCBpZiB3ZSBjb25zaWRlciB0aGUgbm9uLWhvbGUgYXJlYSBvZiB0aGVcclxuICogcG9seWdvbiBhcyBiZWluZyB0cmF2ZXJzYWJsZSwgb3IgdGhlIG9wcG9zaXRlLCBpZiB3ZSBjb25zaWRlclxyXG4gKiB0aGUgbm9uLWhvbGUgYXJlYSBhcyBiZWluZyBzb2xpZCwgYmxvY2tpbmcgbW92ZW1lbnQuXHJcbiAqIEB0eXBlZGVmIEFyZWFcclxuICogQHR5cGUge29iamVjdH1cclxuICogQHByb3BlcnR5IHtQb2x5fSBwb2x5Z29uIC0gVGhlIHBvbHlnb24gZGVmaW5pbmcgdGhlIG91dHNpZGUgb2YgdGhlXHJcbiAqICAgYXJlYS5cclxuICogQHByb3BlcnR5IHtBcnJheS48UG9seT59IGhvbGVzIC0gVGhlIGhvbGVzIGluIHRoZSBwb2x5Z29uIGZvciB0aGlzXHJcbiAqICAgYXJlYS5cclxuICovXHJcbi8qKlxyXG4gKiBHaXZlbiBhIFBvbHlUcmVlLCByZXR1cm4gYW4gYXJyYXkgb2YgYXJlYXMgYXNzdW1pbmcgZXZlbi1vZGQgZmlsbFxyXG4gKiBvcmRlcmluZy5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtDbGlwcGVyTGliLlBhdGhzfSBwYXRocyAtIFRoZSBwYXRocyBvdXRwdXQgZnJvbSBzb21lXHJcbiAqICAgb3BlcmF0aW9uLiBQYXRocyBzaG91bGQgYmUgbm9uLW92ZXJsYXBwaW5nLCBpLmUuIHRoZSBlZGdlcyBvZlxyXG4gKiAgIHJlcHJlc2VudGVkIHBvbHlnb25zIHNob3VsZCBub3QgYmUgb3ZlcmxhcHBpbmcsIGJ1dCBwb2x5Z29uc1xyXG4gKiAgIG1heSBiZSBmdWxseSBjb250YWluZWQgaW4gb25lIGFub3RoZXIuIFBhdGhzIHNob3VsZCBhbHJlYWR5XHJcbiAqICAgYmUgc2NhbGVkIHVwLlxyXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtzY2FsZT0xMDBdIC0gVGhlIHNjYWxlIHRvIHVzZSB3aGVuIGJyaW5naW5nIHRoZVxyXG4gKiAgIENsaXBwZXIgcGF0aHMgZG93biB0byBzaXplLlxyXG4gKiBAcmV0dXJuIHtBcnJheS48QXJlYT59IC0gVGhlIGFyZWFzIHJlcHJlc2VudGVkIGJ5IHRoZSBwb2x5dHJlZS5cclxuICovXHJcbk5hdk1lc2guX2dlb21ldHJ5LmdldEFyZWFzID0gZnVuY3Rpb24ocGF0aHMsIHNjYWxlKSB7XHJcbiAgaWYgKHR5cGVvZiBzY2FsZSA9PSAndW5kZWZpbmVkJykgc2NhbGUgPSBOYXZNZXNoLl9nZW9tZXRyeS5zY2FsZTtcclxuICAvLyBXZSBhcmUgcmVhbGx5IG9ubHkgY29uY2VybmVkIHdpdGggZ2V0dGluZyB0aGUgcGF0aHMgaW50byBhXHJcbiAgLy8gcG9seXRyZWUgc3RydWN0dXJlLlxyXG4gIHZhciBjcHIgPSBOYXZNZXNoLl9nZW9tZXRyeS5jcHI7XHJcbiAgY3ByLkNsZWFyKCk7XHJcbiAgY3ByLkFkZFBhdGhzKHBhdGhzLCBDbGlwcGVyTGliLlBvbHlUeXBlLnB0U3ViamVjdCwgdHJ1ZSk7XHJcbiAgdmFyIHVuaW9uZWRfc2hhcGVzX3BvbHl0cmVlID0gbmV3IENsaXBwZXJMaWIuUG9seVRyZWUoKTtcclxuICBjcHIuRXhlY3V0ZShcclxuICAgIENsaXBwZXJMaWIuQ2xpcFR5cGUuY3RVbmlvbixcclxuICAgIHVuaW9uZWRfc2hhcGVzX3BvbHl0cmVlLFxyXG4gICAgQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0RXZlbk9kZCxcclxuICAgIG51bGwpO1xyXG5cclxuICB2YXIgYXJlYXMgPSBbXTtcclxuXHJcbiAgdmFyIG91dGVyX3BvbHlnb25zID0gdW5pb25lZF9zaGFwZXNfcG9seXRyZWUuQ2hpbGRzKCk7XHJcblxyXG4gIC8vIE9yZ2FuaXplIHNoYXBlcyBpbnRvIHRoZWlyIG91dGVyIHBvbHlnb25zIGFuZCBob2xlcywgYXNzdW1pbmdcclxuICAvLyB0aGF0IHRoZSBmaXJzdCBsYXllciBvZiBwb2x5Z29ucyBpbiB0aGUgcG9seXRyZWUgcmVwcmVzZW50IHRoZVxyXG4gIC8vIG91dHNpZGUgZWRnZSBvZiB0aGUgZGVzaXJlZCBhcmVhcy5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG91dGVyX3BvbHlnb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgb3V0ZXJfcG9seWdvbiA9IG91dGVyX3BvbHlnb25zW2ldO1xyXG4gICAgdmFyIGNvbnRvdXIgPSBvdXRlcl9wb2x5Z29uLkNvbnRvdXIoKTtcclxuICAgIENsaXBwZXJMaWIuSlMuU2NhbGVEb3duUGF0aChjb250b3VyLCBzY2FsZSk7XHJcbiAgICB2YXIgYXJlYSA9IHtcclxuICAgICAgcG9seWdvbjogY29udG91cixcclxuICAgICAgaG9sZXM6IFtdXHJcbiAgICB9O1xyXG5cclxuICAgIG91dGVyX3BvbHlnb24uQ2hpbGRzKCkuZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xyXG4gICAgICB2YXIgY29udG91ciA9IGNoaWxkLkNvbnRvdXIoKTtcclxuICAgICAgQ2xpcHBlckxpYi5KUy5TY2FsZURvd25QYXRoKGNoaWxkLkNvbnRvdXIoKSwgc2NhbGUpO1xyXG4gICAgICAvLyBBZGQgYXMgYSBob2xlLlxyXG4gICAgICBhcmVhLmhvbGVzLnB1c2goY29udG91cik7XHJcblxyXG4gICAgICAvLyBBZGQgY2hpbGRyZW4gYXMgYWRkaXRpb25hbCBvdXRlciBwb2x5Z29ucyB0byBiZSBleHBhbmRlZC5cclxuICAgICAgY2hpbGQuQ2hpbGRzKCkuZm9yRWFjaChmdW5jdGlvbihjaGlsZF9vdXRlcikge1xyXG4gICAgICAgIG91dGVyX3BvbHlnb25zLnB1c2goY2hpbGRfb3V0ZXIpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgYXJlYXMucHVzaChhcmVhKTtcclxuICB9XHJcbiAgXHJcbiAgLy8gQ29udmVydCBDbGlwcGVyIFBhdGhzIHRvIFBvbHlzLlxyXG4gIGFyZWFzLmZvckVhY2goZnVuY3Rpb24oYXJlYSkge1xyXG4gICAgYXJlYS5wb2x5Z29uID0gTmF2TWVzaC5fZ2VvbWV0cnkuY29udmVydENsaXBwZXJUb1BvbHkoYXJlYS5wb2x5Z29uKTtcclxuICAgIGFyZWEuaG9sZXMgPSBhcmVhLmhvbGVzLm1hcChOYXZNZXNoLl9nZW9tZXRyeS5jb252ZXJ0Q2xpcHBlclRvUG9seSk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBhcmVhcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBPZmZzZXQgYSBwb2x5Z29uIGlud2FyZHMgKGFzIG9wcG9zZWQgdG8gZGVmbGF0aW5nIGl0KS4gVGhlIHBvbHlnb25cclxuICogdmVydGljZXMgc2hvdWxkIGJlIGluIENDVyBvcmRlciBhbmQgdGhlIHBvbHlnb24gc2hvdWxkIGFscmVhZHkgYmVcclxuICogc2NhbGVkLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0NMU2hhcGV9IHNoYXBlIC0gVGhlIHNoYXBlIHRvIGluZmxhdGUgaW53YXJkcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCAtIFRoZSBhbW91bnQgdG8gb2Zmc2V0IHRoZSBzaGFwZS5cclxuICogQHBhcmFtIHtpbnRlZ2VyfSBbc2NhbGU9MTAwXSAtIFRoZSBzY2FsZSBmb3IgdGhlIG9wZXJhdGlvbi5cclxuICogQHJldHVybiB7Q2xpcHBlckxpYi5QYXRoc30gLSBUaGUgcmVzdWx0aW5nIHNoYXBlIGZyb20gb2Zmc2V0dGluZy5cclxuICogICBJZiB0aGUgcHJvY2VzcyBvZiBvZmZzZXR0aW5nIHJlc3VsdGVkIGluIHRoZSBpbnRlcmlvciBzaGFwZVxyXG4gKiAgIGNsb3NpbmcgY29tcGxldGVseSwgdGhlbiBhbiBlbXB0eSBhcnJheSB3aWxsIGJlIHJldHVybmVkLiBUaGVcclxuICogICByZXR1cm5lZCBzaGFwZSB3aWxsIHN0aWxsIGJlIHNjYWxlZCB1cCwgZm9yIHVzZSBpbiBvdGhlclxyXG4gKiAgIG9wZXJhdGlvbnMuXHJcbiAqL1xyXG5OYXZNZXNoLl9nZW9tZXRyeS5vZmZzZXRJbnRlcmlvciA9IGZ1bmN0aW9uKHNoYXBlLCBvZmZzZXQsIHNjYWxlKSB7XHJcbiAgaWYgKHR5cGVvZiBzY2FsZSA9PSAndW5kZWZpbmVkJykgc2NhbGUgPSBOYXZNZXNoLl9nZW9tZXRyeS5zY2FsZTtcclxuXHJcbiAgdmFyIGNwciA9IE5hdk1lc2guX2dlb21ldHJ5LmNwcjtcclxuICB2YXIgY28gPSBOYXZNZXNoLl9nZW9tZXRyeS5jbztcclxuXHJcbiAgLy8gRmlyc3QsIGNyZWF0ZSBhIHNoYXBlIHdpdGggdGhlIG91dGxpbmUgYXMgdGhlIGludGVyaW9yLlxyXG4gIHZhciBib3VuZGluZ1NoYXBlID0gTmF2TWVzaC5fZ2VvbWV0cnkuZ2V0Qm91bmRpbmdTaGFwZUZvclBhdGhzKFtzaGFwZV0pO1xyXG5cclxuICBjcHIuQ2xlYXIoKTtcclxuICBjcHIuQWRkUGF0aChib3VuZGluZ1NoYXBlLCBDbGlwcGVyTGliLlBvbHlUeXBlLnB0U3ViamVjdCwgdHJ1ZSk7XHJcbiAgY3ByLkFkZFBhdGgoc2hhcGUsIENsaXBwZXJMaWIuUG9seVR5cGUucHRDbGlwLCB0cnVlKTtcclxuXHJcbiAgdmFyIHNvbHV0aW9uX3BhdGhzID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuICBjcHIuRXhlY3V0ZShDbGlwcGVyTGliLkNsaXBUeXBlLmN0RGlmZmVyZW5jZSxcclxuICAgIHNvbHV0aW9uX3BhdGhzLFxyXG4gICAgQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybyxcclxuICAgIENsaXBwZXJMaWIuUG9seUZpbGxUeXBlLnBmdE5vblplcm8pO1xyXG5cclxuICAvLyBPbmNlIHdlIGhhdmUgdGhlIHNoYXBlIGFzIGNyZWF0ZWQgYWJvdmUsIGluZmxhdGUgaXQuIFRoaXMgZ2l2ZXNcclxuICAvLyBiZXR0ZXIgcmVzdWx0cyB0aGFuIHRyZWF0aW5nIHRoZSBvdXRsaW5lIGFzIHRoZSBleHRlcmlvciBvZiBhXHJcbiAgLy8gc2hhcGUgYW5kIGRlZmxhdGluZyBpdC5cclxuICB2YXIgb2Zmc2V0dGVkX3BhdGhzID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuXHJcbiAgY28uQ2xlYXIoKTtcclxuICBjby5BZGRQYXRocyhzb2x1dGlvbl9wYXRocywgQ2xpcHBlckxpYi5Kb2luVHlwZS5qdFNxdWFyZSwgQ2xpcHBlckxpYi5FbmRUeXBlLmV0Q2xvc2VkUG9seWdvbik7XHJcbiAgY28uRXhlY3V0ZShvZmZzZXR0ZWRfcGF0aHMsIG9mZnNldCAqIHNjYWxlKTtcclxuXHJcbiAgLy8gSWYgdGhpcyBpcyBub3QgdHJ1ZSB0aGVuIHRoZSBvZmZzZXR0aW5nIHByb2Nlc3Mgc2hyYW5rIHRoZVxyXG4gIC8vIG91dGxpbmUgaW50byBub24tZXhpc3RlbmNlIGFuZCBvbmx5IHRoZSBib3VuZGluZyBzaGFwZSBpc1xyXG4gIC8vIGxlZnQuXHJcbiAgLy8gPj0gMiBpbiBjYXNlIHRoZSBvZmZzZXR0aW5nIHByb2Nlc3MgaXNvbGF0ZXMgcG9ydGlvbnMgb2YgdGhlXHJcbiAgLy8gb3V0bGluZSAoc2VlOiBHYW1lUGFkKS5cclxuICBpZiAob2Zmc2V0dGVkX3BhdGhzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAvLyBHZXQgb25seSB0aGUgcGF0aHMgZGVmaW5pbmcgdGhlIG91dGxpbmVzIHdlIHdlcmUgaW50ZXJlc3RlZFxyXG4gICAgLy8gaW4sIGRpc2NhcmRpbmcgdGhlIGV4dGVyaW9yIGJvdW5kaW5nIHNoYXBlLlxyXG4gICAgb2Zmc2V0dGVkX3BhdGhzLnNoaWZ0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIG9mZnNldHRlZF9wYXRocyA9IG5ldyBDbGlwcGVyTGliLlBhdGhzKCk7XHJcbiAgfVxyXG4gIHJldHVybiBvZmZzZXR0ZWRfcGF0aHM7XHJcbn07XHJcblxyXG4vKipcclxuICogT2Zmc2V0IGEgcG9seWdvbi4gVGhlIHBvbHlnb24gdmVydGljZXMgc2hvdWxkIGJlIGluIENXIG9yZGVyIGFuZFxyXG4gKiB0aGUgcG9seWdvbiBzaG91bGQgYWxyZWFkeSBiZSBzY2FsZWQgdXAuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7Q0xTaGFwZX0gc2hhcGUgLSBUaGUgc2hhcGUgdG8gaW5mbGF0ZSBvdXR3YXJkcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCAtIFRoZSBhbW91bnQgdG8gb2Zmc2V0IHRoZSBzaGFwZS5cclxuICogQHBhcmFtIHtpbnRlZ2VyfSBbc2NhbGU9MTAwXSAtIFRoZSBzY2FsZSBmb3IgdGhlIG9wZXJhdGlvbi5cclxuICogQHJldHVybiB7Q2xpcHBlckxpYi5QYXRoc30gLSBUaGUgcmVzdWx0aW5nIHNoYXBlIGZyb20gb2Zmc2V0dGluZy5cclxuICogICBJZiB0aGUgcHJvY2VzcyBvZiBvZmZzZXR0aW5nIHJlc3VsdGVkIGluIHRoZSBpbnRlcmlvciBzaGFwZVxyXG4gKiAgIGNsb3NpbmcgY29tcGxldGVseSwgdGhlbiBhbiBlbXB0eSBhcnJheSB3aWxsIGJlIHJldHVybmVkLiBUaGVcclxuICogICByZXR1cm5lZCBzaGFwZSB3aWxsIHN0aWxsIGJlIHNjYWxlZCB1cCwgZm9yIHVzZSBpbiBvdGhlclxyXG4gKiAgIG9wZXJhdGlvbnMuXHJcbiAqL1xyXG5OYXZNZXNoLl9nZW9tZXRyeS5vZmZzZXRFeHRlcmlvciA9IGZ1bmN0aW9uKHNoYXBlLCBvZmZzZXQsIHNjYWxlKSB7XHJcbiAgLy8gVE9ET1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdlbmVyYXRlIGEgY29udmV4IHBhcnRpdGlvbiBvZiB0aGUgcHJvdmlkZWQgcG9seWdvbiwgZXhjbHVkaW5nXHJcbiAqIGFyZWFzIGdpdmVuIGJ5IHRoZSBob2xlcy5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtQb2x5fSBvdXRsaW5lIC0gVGhlIHBvbHlnb24gb3V0bGluZSBvZiB0aGUgYXJlYSB0b1xyXG4gKiAgIHBhcnRpdGlvbi5cclxuICogQHBhcmFtIHtBcnJheS48UG9seT59IGhvbGVzIC0gSG9sZXMgaW4gdGhlIHBvbHlnb24uXHJcbiAqIEByZXR1cm4ge0FycmF5LjxQb2x5Pn0gLSBQb2x5Z29ucyByZXByZXNlbnRpbmcgdGhlIHBhcnRpdGlvbmVkXHJcbiAqICAgc3BhY2UuXHJcbiAqL1xyXG5OYXZNZXNoLl9nZW9tZXRyeS5jb252ZXhQYXJ0aXRpb24gPSBmdW5jdGlvbihvdXRsaW5lLCBob2xlcykge1xyXG4gIC8vIEVuc3VyZSBwcm9wZXIgdmVydGV4IG9yZGVyIGZvciBob2xlcyBhbmQgb3V0bGluZS5cclxuICBvdXRsaW5lLnNldE9yaWVudGF0aW9uKFwiQ0NXXCIpO1xyXG4gIGhvbGVzLmZvckVhY2goZnVuY3Rpb24oZSkge1xyXG4gICAgZS5zZXRPcmllbnRhdGlvbihcIkNXXCIpO1xyXG4gICAgZS5ob2xlID0gdHJ1ZTtcclxuICB9KTtcclxuICBcclxuICByZXR1cm4gcGFydGl0aW9uKG91dGxpbmUsIGhvbGVzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQYXJ0aXRpb24gdGhlIHByb3ZpZGVkIGFyZWEuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJlYX0gYXJlYSAtIFRoZSBBcmVhIHRvIHBhcnRpdGlvbi5cclxuICogQHJldHVybiB7QXJyYXkuPFBvbHk+fSAtIFBvbHlnb25zIHJlcHJlc2VudGluZyB0aGUgcGFydGl0aW9uZWRcclxuICogICBzcGFjZS5cclxuICovXHJcbk5hdk1lc2guX2dlb21ldHJ5LnBhcnRpdGlvbkFyZWEgPSBmdW5jdGlvbihhcmVhKSB7XHJcbiAgcmV0dXJuIE5hdk1lc2guX2dlb21ldHJ5LmNvbnZleFBhcnRpdGlvbihhcmVhLnBvbHlnb24sIGFyZWEuaG9sZXMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBhcnRpdGlvbiB0aGUgcHJvdmlkZWQgYXJlYXMuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPEFyZWE+fSBhcmVhcyAtIFRoZSBhcmVhcyB0byBwYXJ0aXRpb24uXHJcbiAqIEByZXR1cm4ge0FycmF5LjxQb2x5Pn0gLSBQb2x5Z29ucyByZXByZXNlbnRpbmcgdGhlIHBhcnRpdGlvbmVkXHJcbiAqICAgc3BhY2UuXHJcbiAqL1xyXG5OYXZNZXNoLl9nZW9tZXRyeS5wYXJ0aXRpb25BcmVhcyA9IGZ1bmN0aW9uKGFyZWFzKSB7XHJcbiAgdmFyIHBvbHlzID0gYXJlYXMubWFwKE5hdk1lc2guX2dlb21ldHJ5LnBhcnRpdGlvbkFyZWEpO1xyXG4gIHJldHVybiBOYXZNZXNoLl91dGlsLmZsYXR0ZW4ocG9seXMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEEgcG9pbnQgaW4gQ2xpcHBlckxpYiBpcyBqdXN0IGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXNcclxuICogWCBhbmQgWSBjb3JyZXNwb25kaW5nIHRvIGEgcG9pbnQuXHJcbiAqIEB0eXBlZGVmIENMUG9pbnRcclxuICogQHR5cGUge29iamVjdH1cclxuICogQHByb3BlcnR5IHtpbnRlZ2VyfSBYIC0gVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQuXHJcbiAqIEBwcm9wZXJ0eSB7aW50ZWdlcn0gWSAtIFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LlxyXG4gKi9cclxuLyoqXHJcbiAqIEEgc2hhcGUgaW4gQ2xpcHBlckxpYiBpcyBzaW1wbHkgYW4gYXJyYXkgb2YgQ0xQb2ludHMuXHJcbiAqIEB0eXBlZGVmIENMU2hhcGVcclxuICogQHR5cGUge0FycmF5LjxDTFBvaW50Pn1cclxuICovXHJcbi8qKlxyXG4gKiBUYWtlcyBhIFBvbHkgYW5kIGNvbnZlcnRzIGl0IGludG8gYSBDbGlwcGVyTGliIHBvbHlnb24uXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7UG9seX0gcG9seSAtIFRoZSBQb2x5IHRvIGNvbnZlcnQuXHJcbiAqIEByZXR1cm4ge0NMU2hhcGV9IC0gVGhlIGNvbnZlcnRlZCBwb2x5Z29uLlxyXG4gKi9cclxuTmF2TWVzaC5fZ2VvbWV0cnkuY29udmVydFBvbHlUb0NsaXBwZXIgPSBmdW5jdGlvbihwb2x5KSB7XHJcbiAgcmV0dXJuIHBvbHkucG9pbnRzLm1hcChmdW5jdGlvbihwKSB7XHJcbiAgICByZXR1cm4ge1g6cC54LCBZOnAueX07XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29udmVydCBhIENsaXBwZXJMaWIgc2hhcGUgaW50byBhIFBvbHkuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7Q0xTaGFwZX0gY2xpcCAtIFRoZSBzaGFwZSB0byBjb252ZXJ0LlxyXG4gKiBAcmV0dXJuIHtQb2x5fSAtIFRoZSBjb252ZXJ0ZWQgc2hhcGUuXHJcbiAqL1xyXG5OYXZNZXNoLl9nZW9tZXRyeS5jb252ZXJ0Q2xpcHBlclRvUG9seSA9IGZ1bmN0aW9uKGNsaXApIHtcclxuICB2YXIgcG9pbnRzID0gY2xpcC5tYXAoZnVuY3Rpb24ocCkge1xyXG4gICAgcmV0dXJuIG5ldyBQb2ludChwLlgsIHAuWSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIG5ldyBQb2x5KHBvaW50cyk7XHJcbn07XHJcblxyXG4vKipcclxuICogR2VuZXJhdGUgYSBib3VuZGluZyBzaGFwZSBmb3IgcGF0aHMgd2l0aCBhIGdpdmVuIGJ1ZmZlci4gSWYgdXNpbmdcclxuICogZm9yIGFuIG9mZnNldHRpbmcgb3BlcmF0aW9uLCB0aGUgcmV0dXJuZWQgQ0xTaGFwZSBkb2VzIE5PVCBuZWVkIHRvXHJcbiAqIGJlIHNjYWxlZCB1cC5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheS48Q0xTaGFwZT59IHBhdGhzIC0gVGhlIHBhdGhzIHRvIGdldCBhIGJvdW5kaW5nIHNoYXBlIGZvci5cclxuICogQHBhcmFtIHtpbnRlZ2VyfSBbYnVmZmVyPTVdIC0gSG93IG1hbnkgdW5pdHMgdG8gcGFkIHRoZSBib3VuZGluZ1xyXG4gKiAgIHJlY3RhbmdsZS5cclxuICogQHJldHVybiB7Q0xTaGFwZX0gLSBBIGJvdW5kaW5nIHJlY3RhbmdsZSBmb3IgdGhlIHBhdGhzLlxyXG4gKi9cclxuTmF2TWVzaC5fZ2VvbWV0cnkuZ2V0Qm91bmRpbmdTaGFwZUZvclBhdGhzID0gZnVuY3Rpb24ocGF0aHMsIGJ1ZmZlcikge1xyXG4gIGlmICh0eXBlb2YgYnVmZmVyID09IFwidW5kZWZpbmVkXCIpIGJ1ZmZlciA9IDU7XHJcbiAgdmFyIGJvdW5kcyA9IENsaXBwZXJMaWIuQ2xpcHBlci5HZXRCb3VuZHMocGF0aHMpO1xyXG4gIGJvdW5kcy5sZWZ0IC09IGJ1ZmZlcjtcclxuICBib3VuZHMudG9wIC09IGJ1ZmZlcjtcclxuICBib3VuZHMucmlnaHQgKz0gYnVmZmVyO1xyXG4gIGJvdW5kcy5ib3R0b20gKz0gYnVmZmVyO1xyXG4gIHZhciBzaGFwZSA9IFtdO1xyXG4gIHNoYXBlLnB1c2goe1g6IGJvdW5kcy5yaWdodCwgWTogYm91bmRzLmJvdHRvbX0pO1xyXG4gIHNoYXBlLnB1c2goe1g6IGJvdW5kcy5sZWZ0LCBZOiBib3VuZHMuYm90dG9tfSk7XHJcbiAgc2hhcGUucHVzaCh7WDogYm91bmRzLmxlZnQsIFk6IGJvdW5kcy50b3B9KTtcclxuICBzaGFwZS5wdXNoKHtYOiBib3VuZHMucmlnaHQsIFk6IGJvdW5kcy50b3B9KTtcclxuICByZXR1cm4gc2hhcGU7XHJcbn07XHJcblxyXG4vKipcclxuICogSG9sZHMgdXRpbGl0eSBtZXRob2RzIG5lZWRlZCBieSB0aGUgbmF2bWVzaC5cclxuICogQHByaXZhdGVcclxuICovXHJcbk5hdk1lc2guX3V0aWwgPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSBpdGVtcyBhdCB0aGUgaW5kaWNlcyBpZGVudGlmaWVkIGluXHJcbiAqIGBpbmRpY2VzYC5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheX0gYXJ5IC0gVGhlIGFycmF5IHRvIHJlbW92ZSBpdGVtcyBmcm9tLlxyXG4gKiBAcGFyYW0ge0FycmF5LjxpbnRlZ2VyPn0gaW5kaWNlcyAtIFRoZSBpbmRpY2VzIGZyb20gd2hpY2ggdG9cclxuICogICByZW1vdmUgdGhlIGl0ZW1zIGZyb20gaW4gYXJ5LiBJbmRpY2VzIHNob3VsZCBiZSB1bmlxdWUgYW5kXHJcbiAqICAgZWFjaCBzaG91bGQgYmUgbGVzcyB0aGFuIHRoZSBsZW5ndGggb2YgYGFyeWAgaXRzZWxmLlxyXG4gKiBAcmV0dXJuIHtBcnJheX0gLSBUaGUgaXRlbXMgcmVtb3ZlZCBmcm9tIGFyeS5cclxuICovXHJcbk5hdk1lc2guX3V0aWwuc3BsaWNlID0gZnVuY3Rpb24oYXJ5LCBpbmRpY2VzKSB7XHJcbiAgaW5kaWNlcyA9IGluZGljZXMuc29ydChOYXZNZXNoLl91dGlsLl9udW1iZXJDb21wYXJlKS5yZXZlcnNlKCk7XHJcbiAgdmFyIHJlbW92ZWQgPSBbXTtcclxuICBpbmRpY2VzLmZvckVhY2goZnVuY3Rpb24oaSkge1xyXG4gICAgcmVtb3ZlZC5wdXNoKGFyeS5zcGxpY2UoaSwgMSlbMF0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiByZW1vdmVkO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXBhcmlzb24gZnVuY3Rpb24gZm9yIG51bWJlcnMuXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5OYXZNZXNoLl91dGlsLl9udW1iZXJDb21wYXJlID0gZnVuY3Rpb24oYSwgYikge1xyXG4gIGlmIChhIDwgYikge1xyXG4gICAgcmV0dXJuIC0xO1xyXG4gIH0gZWxzZSBpZiAoYSA+IGIpIHtcclxuICAgIHJldHVybiAxO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVGFrZSBhbiBhcnJheSBvZiBhcnJheXMgYW5kIGZsYXR0ZW4gaXQuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSAge0FycmF5LjxBcnJheS48Kj4+fSBhcnkgLSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cclxuICogQHJldHVybiB7QXJyYXkuPCo+fSAtIFRoZSBmbGF0dGVuZWQgYXJyYXkuXHJcbiAqL1xyXG5OYXZNZXNoLl91dGlsLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnkpIHtcclxuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgYXJ5KTtcclxufTtcclxuXG59LHtcIi4vZ2VvbWV0cnlcIjo2LFwiLi9wYXJzZS1tYXBcIjo4LFwiLi9wYXJ0aXRpb25cIjo5LFwiLi9wYXRoZmluZGVyXCI6MTAsXCJqc2NsaXBwZXJcIjoxLFwibWF0aC1yb3VuZFwiOjJ9XSw4OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxyXG4gKiBAaWdub3JlXHJcbiAqIEBtb2R1bGUgTWFwUGFyc2VyXHJcbiAqL1xyXG5cclxudmFyIEFjdGlvblZhbHVlcyA9IF9kZXJlcV8oJy4vYWN0aW9uLXZhbHVlcycpO1xyXG52YXIgZ2VvID0gX2RlcmVxXygnLi9nZW9tZXRyeScpO1xyXG52YXIgUG9pbnQgPSBnZW8uUG9pbnQ7XHJcbnZhciBQb2x5ID0gZ2VvLlBvbHk7XHJcblxyXG4vKipcclxuICogQ29udGFpbnMgdXRpbGl0aWVzIGZvciBnZW5lcmF0aW5nIHVzYWJsZSBtYXAgcmVwcmVzZW50YXRpb25zIGZyb21cclxuICogbWFwIHRpbGVzLlxyXG4gKi9cclxudmFyIE1hcFBhcnNlciA9IHt9O1xyXG5cclxuLyoqXHJcbiAqIEFuIG9iamVjdCB3aXRoIHggYW5kIHkgcHJvcGVydGllcyB0aGF0IHJlcHJlc2VudHMgYSBjb29yZGluYXRlIHBhaXIuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEB0eXBlZGVmIE1QUG9pbnRcclxuICogQHR5cGUge29iamVjdH1cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHggLSBUaGUgeCBjb29yZGluYXRlIG9mIHRoZSBsb2NhdGlvbi5cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIG9mIHRoZSBsb2NhdGlvbi5cclxuICovXHJcblxyXG4vKipcclxuICogQSBTaGFwZSBpcyBhbiBhcnJheSBvZiBwb2ludHMsIHdoZXJlIHBvaW50cyBhcmUgb2JqZWN0cyB3aXRoIHggYW5kIHkgcHJvcGVydGllcyB3aGljaCByZXByZXNlbnQgY29vcmRpbmF0ZXMgb24gdGhlIG1hcC5cclxuICogQHByaXZhdGVcclxuICogQHR5cGVkZWYgTVBTaGFwZVxyXG4gKiBAdHlwZSB7QXJyYXkuPE1QUG9pbnQ+fVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBbiBvYmplY3Qgd2l0aCByIGFuZCBjIHByb3BlcnRpZXMgdGhhdCByZXByZXNlbnRzIGEgcm93L2NvbHVtblxyXG4gKiBsb2NhdGlvbiBpbiBhIDJkIGFycmF5LlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAdHlwZWRlZiBBcnJheUxvY1xyXG4gKiBAdHlwZSB7b2JqZWN0fVxyXG4gKiBAcHJvcGVydHkge2ludGVnZXJ9IHIgLSBUaGUgcm93IG51bWJlciBvZiB0aGUgYXJyYXkgbG9jYXRpb24uXHJcbiAqIEBwcm9wZXJ0eSB7aW50ZWdlcn0gYyAtIFRoZSBjb2x1bW4gbnVtYmVyIG9mIHRoZSBhcnJheSBsb2NhdGlvbi5cclxuICovXHJcblxyXG4vKipcclxuICogVGhlIDJkIHRpbGUgZ3JpZCBmcm9tIGB0YWdwcm8ubWFwYCwgb3IgYSBzaW1pbGFyIDJkIGdyaWQgcmVzdWx0aW5nXHJcbiAqIGZyb20gYW4gb3BlcmF0aW9uIG9uIHRoZSBvcmlnaW5hbC5cclxuICogQHR5cGVkZWYgTWFwVGlsZXNcclxuICogQHR5cGUge0FycmF5LjxBcnJheS48bnVtYmVyPj59XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEEgQ2VsbCBpcyBqdXN0IGFuIGFycmF5IHRoYXQgaG9sZHMgdGhlIHZhbHVlcyBvZiB0aGUgZm91ciBhZGphY2VudFxyXG4gKiBjZWxscyBpbiBhIDJkIGFycmF5LCByZWNvcmRlZCBpbiBDQ1cgb3JkZXIgc3RhcnRpbmcgZnJvbSB0aGUgdXBwZXItXHJcbiAqIGxlZnQgcXVhZHJhbnQuIEZvciBleGFtcGxlLCBnaXZlbiBhIDJkIGFycmF5OlxyXG4gKiBbWzEsIDAsIDFdLFxyXG4gKiAgWzEsIDAsIDBdLFxyXG4gKiAgWzEsIDEsIDFdXVxyXG4gKiB3ZSB3b3VsZCBnZW5lcmF0ZSB0aGUgcmVwcmVzZW50YXRpb24gdXNpbmcgdGhlIGNlbGxzOlxyXG4gKiBbMSwgMCwgIFswLCAxLCAgWzEsIDAsICBbMCwgMCAgXHJcbiAqICAxLCAwXSAgIDAsIDBdICAgMSwgMV0gICAxLCAxXS5cclxuICogVGhlc2UgY29ycmVzcG9uZCB0byB0aGUgcGFydHMgb2YgYSB0aWxlIHRoYXQgd291bGQgYmUgY292ZXJlZCBpZlxyXG4gKiBwbGFjZWQgYXQgdGhlIGludGVyc2VjdGlvbiBvZiA0IHRpbGVzLiBUaGUgdmFsdWUgMCByZXByZXNlbnRzIGFcclxuICogYmxhbmsgbG9jYXRpb24sIDEgaW5kaWNhdGVzIHRoYXQgdGhlIHF1YWRyYW50IGlzIGNvdmVyZWQuXHJcbiAqIFRvIHJlcHJlc2VudCBob3cgc3VjaCB0aWxlcyB3b3VsZCBiZSBjb3ZlcmVkIGluIHRoZSBjYXNlIG9mIGRpYWdvbmFsXHJcbiAqIHRpbGVzLCB3ZSB1c2UgMiB0byBpbmRpY2F0ZSB0aGF0IHRoZSBsb3dlciBkaWFnb25hbCBvZiBhIHF1YWRyYW50IGlzXHJcbiAqIGZpbGxlZCwgYW5kIDMgdG8gaW5kaWNhdGUgdGhhdCB0aGUgdXBwZXIgZGlhZ29uYWwgb2YgYSBxdWFkcmFudCBpc1xyXG4gKiBmaWxsZWQuIFRoZSB0aWxlcyBhdmFpbGFibGUgZm9yY2UgdGhlIGRpYWdvbmFscyBvZiBlYWNoIHF1YWRyYW50IHRvXHJcbiAqIHBvaW50IHRvIHRoZSBjZW50ZXIsIHNvIHRoaXMgaXMgc3VmZmljaWVudCBmb3IgZGVzY3JpYmluZyBhbGxcclxuICogcG9zc2libGUgb3ZlcmxhcHBpbmdzLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAdHlwZWRlZiBDZWxsXHJcbiAqIEB0eXBlIHtBcnJheS48bnVtYmVyPn1cclxuICovXHJcblxyXG4vKipcclxuICogQ2FsbGJhY2sgdGhhdCByZWNlaXZlcyBlYWNoIG9mIHRoZSBlbGVtZW50cyBpbiB0aGUgMmQgbWFwIGZ1bmN0aW9uLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAY2FsbGJhY2sgbWFwQ2FsbGJhY2tcclxuICogQHBhcmFtIHsqfSAtIFRoZSBlbGVtZW50IGZyb20gdGhlIDJkIGFycmF5LlxyXG4gKiBAcmV0dXJuIHsqfSAtIFRoZSB0cmFuc2Zvcm1lZCBlbGVtZW50LlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBcHBsaWVzIGBmbmAgdG8gZXZlcnkgaW5kaXZpZHVhbCBlbGVtZW50IG9mIHRoZSAyZCBhcnJheSBgYXJyYC5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheS48QXJyYXkuPCo+Pn0gYXJyIC0gVGhlIDJkIGFycmF5IHRvIHVzZS5cclxuICogQHBhcmFtIHttYXBDYWxsYmFja30gZm4gLSBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBlbGVtZW50LlxyXG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXkuPCo+Pn0gLSBUaGUgMmQgYXJyYXkgYWZ0ZXIgdGhlIGZ1bmN0aW9uXHJcbiAqICAgaGFzIGJlZW4gYXBwbGllZCB0byBlYWNoIGVsZW1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBtYXAyZChhcnIsIGZuKSB7XHJcbiAgcmV0dXJuIGFyci5tYXAoZnVuY3Rpb24ocm93KSB7XHJcbiAgICByZXR1cm4gcm93Lm1hcChmbik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIDEgaWYgYSB0aWxlIHZhbHVlIGlzIG9uZSB0aGF0IHdlIHdhbnQgdG8gY29uc2lkZXIgYXNcclxuICogYSB3YWxsICh3ZSBjb25zaWRlciBlbXB0eSBzcGFjZSB0byBiZSBhIHdhbGwpLCBvciB0aGUgdGlsZSB2YWx1ZVxyXG4gKiBpdHNlbGYgZm9yIGRpYWdvbmFsIHdhbGxzLiAwIGlzIHJldHVybmVkIG90aGVyd2lzZS5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtudW1iZXJ9IGVsdCAtIFRoZSB0aWxlIHZhbHVlIGF0IGEgcm93L2NvbHVtbiBsb2NhdGlvblxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IC0gVGhlIG51bWJlciB0byBpbnNlcnQgaW4gcGxhY2Ugb2YgdGhlIHRpbGUgdmFsdWUuXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0JhZENlbGwoZWx0KSB7XHJcbiAgdmFyIGJhZF9jZWxscyA9IFsxLCAxLjEsIDEuMiwgMS4zLCAxLjRdO1xyXG4gIGlmKGJhZF9jZWxscy5pbmRleE9mKGVsdCkgIT09IC0xKSB7XHJcbiAgICAvLyBFbnN1cmUgZW1wdHkgc3BhY2VzIGdldCBtYXBwZWQgdG8gZnVsbCB0aWxlcyBzbyBvdXRzaWRlIG9mXHJcbiAgICAvLyBtYXAgaXNuJ3QgdHJhY2VkLlxyXG4gICAgaWYgKGVsdCA9PSAwKSB7XHJcbiAgICAgIHJldHVybiAxO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGVsdDtcclxuICAgIH1cclxuICAgIHJldHVybiBlbHQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAwO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHRoZSBwcm92aWRlZCBhcnJheSBpbnRvIGl0cyBlcXVpdmFsZW50IHJlcHJlc2VudGF0aW9uXHJcbiAqIHVzaW5nIGNlbGxzLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge01hcFRpbGVzfSBhcnIgLSBcclxuICogQHBhcmFtIHtBcnJheS48QXJyYXkuPENlbGw+Pn0gLSBUaGUgY29udmVydGVkIGFycmF5LlxyXG4gKi9cclxuZnVuY3Rpb24gZ2VuZXJhdGVDb250b3VyR3JpZChhcnIpIHtcclxuICAvLyBHZW5lcmF0ZSBncmlkIGZvciBob2xkaW5nIHZhbHVlcy5cclxuICB2YXIgY29udG91cl9ncmlkID0gbmV3IEFycmF5KGFyci5sZW5ndGggLSAxKTtcclxuICBmb3IgKHZhciBuID0gMDsgbiA8IGNvbnRvdXJfZ3JpZC5sZW5ndGg7IG4rKykge1xyXG4gICAgY29udG91cl9ncmlkW25dID0gbmV3IEFycmF5KGFyclswXS5sZW5ndGggLSAxKTtcclxuICB9XHJcbiAgdmFyIGNvcm5lcnMgPSBbMS4xLCAxLjIsIDEuMywgMS40XTtcclxuICAvLyBTcGVjaWZpZXMgdGhlIHJlc3VsdGluZyB2YWx1ZXMgZm9yIHRoZSBhYm92ZSBjb3JuZXIgdmFsdWVzLiBUaGUgaW5kZXhcclxuICAvLyBvZiB0aGUgb2JqZWN0cyBpbiB0aGlzIGFycmF5IGNvcnJlc3BvbmRzIHRvIHRoZSBwcm9wZXIgdmFsdWVzIGZvciB0aGVcclxuICAvLyBxdWFkcmFudCBvZiB0aGUgc2FtZSBpbmRleC5cclxuICB2YXIgY29ybmVyX3ZhbHVlcyA9IFtcclxuICAgIHsxLjE6IDMsIDEuMjogMCwgMS4zOiAyLCAxLjQ6IDF9LFxyXG4gICAgezEuMTogMCwgMS4yOiAzLCAxLjM6IDEsIDEuNDogMn0sXHJcbiAgICB7MS4xOiAzLCAxLjI6IDEsIDEuMzogMiwgMS40OiAwfSxcclxuICAgIHsxLjE6IDEsIDEuMjogMywgMS4zOiAwLCAxLjQ6IDJ9XHJcbiAgXTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IChhcnIubGVuZ3RoIC0gMSk7IGkrKykge1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCAoYXJyWzBdLmxlbmd0aCAtIDEpOyBqKyspIHtcclxuICAgICAgdmFyIGNlbGwgPSBbYXJyW2ldW2pdLCBhcnJbaV1baisxXSwgYXJyW2krMV1baisxXSwgYXJyW2krMV1bal1dO1xyXG4gICAgICAvLyBDb252ZXJ0IGNvcm5lciB0aWxlcyB0byBhcHByb3ByaWF0ZSByZXByZXNlbnRhdGlvbi5cclxuICAgICAgY2VsbC5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaSwgY2VsbCkge1xyXG4gICAgICAgIGlmIChjb3JuZXJzLmluZGV4T2YodmFsKSAhPT0gLTEpIHtcclxuICAgICAgICAgIGNlbGxbaV0gPSBjb3JuZXJfdmFsdWVzW2ldW3ZhbF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnRvdXJfZ3JpZFtpXVtqXSA9IGNlbGw7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBjb250b3VyX2dyaWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDYWxsYmFjayBmdW5jdGlvbiBmb3IgdGVzdGluZyBlcXVhbGl0eSBvZiBpdGVtcy5cclxuICogQHByaXZhdGVcclxuICogQGNhbGxiYWNrIGNvbXBhcmlzb25DYWxsYmFja1xyXG4gKiBAcGFyYW0geyp9IC0gVGhlIGZpcnN0IGl0ZW0uXHJcbiAqIEBwYXJhbSB7Kn0gLSBUaGUgc2Vjb25kIGl0ZW0uXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciBvciBub3QgdGhlIGl0ZW1zIGFyZSBlcXVhbC5cclxuICovXHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgbG9jYXRpb24gb2Ygb2JqIGluIGFyciB3aXRoIGVxdWFsaXR5IGRldGVybWluZWQgYnkgY21wLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gYXJyIC0gVGhlIGFycmF5IHRvIGJlIHNlYXJjaGVkLlxyXG4gKiBAcGFyYW0geyp9IG9iaiAtIFRoZSBpdGVtIHRvIGZpbmQgYSBtYXRjaCBmb3IuXHJcbiAqIEBwYXJhbSB7Y29tcGFyaXNvbkNhbGxiYWNrfSBjbXAgLSBUaGUgY2FsbGJhY2sgdGhhdCBkZWZpbmVzXHJcbiAqICAgd2hldGhlciBgb2JqYCBtYXRjaGVzLlxyXG4gKiBAcmV0dXJuIHtpbnRlZ2VyfSAtIFRoZSBpbmRleCBvZiB0aGUgZmlyc3QgZWxlbWVudCB0byBtYXRjaCBgb2JqYCxcclxuICogICBvciAtMSBpZiBubyBzdWNoIGVsZW1lbnQgd2FzIGxvY2F0ZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiBmaW5kKGFyciwgb2JqLCBjbXApIHtcclxuICBpZiAodHlwZW9mIGNtcCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChjbXAoYXJyW2ldLCBvYmopKSB7XHJcbiAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb21wYXJlIHR3byBvYmplY3RzIGRlZmluaW5nIHJvdy9jb2wgbG9jYXRpb25zIGluIGFuIGFycmF5XHJcbiAqIGFuZCByZXR1cm4gdHJ1ZSBpZiB0aGV5IHJlcHJlc2VudCB0aGUgc2FtZSByb3cvY29sIGxvY2F0aW9uLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5TG9jfSBlbHQxXHJcbiAqIEBwYXJhbSB7QXJyYXlMb2N9IGVsdDJcclxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGVzZSB0d28gYXJyYXkgbG9jYXRpb25zXHJcbiAqICAgcmVwcmVzZW50IHRoZSBzYW1lIHJvdy9jb2x1bW4uXHJcbiAqL1xyXG5mdW5jdGlvbiBlbHRDb21wYXJlKGVsdDEsIGVsdDIpIHtcclxuICByZXR1cm4gKGVsdDEuYyA9PSBlbHQyLmMgJiYgZWx0MS5yID09IGVsdDIucik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUYWtlcyBpbiB0aGUgdmVydGV4L2FjdGlvbiBpbmZvcm1hdGlvbiBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBhcnJheXMsXHJcbiAqIHdoZXJlIGVhY2ggYXJyYXkgY29ycmVzcG9uZHMgdG8gYSBzaGFwZSBhbmQgZWFjaCBlbGVtZW50IG9mIHRoZSBhcnJheSBpc1xyXG4gKiBhIHZlcnRleCB3aGljaCBpcyBjb25uZWN0ZWQgdG8gaXQncyBwcmV2aW91cyBhbmQgbmV4dCBuZWlnaGJvciAoY2lyY3VsYXIpLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge30gYWN0aW9uSW5mb1xyXG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXk8QXJyYXlMb2M+Pn0gLSBBcnJheSBvZiB2ZXJ0ZXggbG9jYXRpb25zIGluIFxyXG4gKi9cclxuZnVuY3Rpb24gZ2VuZXJhdGVTaGFwZXMoYWN0aW9uSW5mbykge1xyXG4gIC8vIFRvdGFsIG51bWJlciBvZiBjZWxscy5cclxuICB2YXIgdG90YWwgPSBhY3Rpb25JbmZvLmxlbmd0aCAqIGFjdGlvbkluZm9bMF0ubGVuZ3RoO1xyXG4gIHZhciBkaXJlY3Rpb25zID0ge1xyXG4gICAgXCJuXCI6IFstMSwgMF0sXHJcbiAgICBcImVcIjogWzAsIDFdLFxyXG4gICAgXCJzXCI6IFsxLCAwXSxcclxuICAgIFwid1wiOiBbMCwgLTFdLFxyXG4gICAgXCJuZVwiOiBbLTEsIDFdLFxyXG4gICAgXCJzZVwiOiBbMSwgMV0sXHJcbiAgICBcInN3XCI6IFsxLCAtMV0sXHJcbiAgICBcIm53XCI6IFstMSwgLTFdXHJcbiAgfTtcclxuICAvLyBUYWtlcyB0aGUgY3VycmVudCBsb2NhdGlvbiBhbmQgZGlyZWN0aW9uIGF0IHRoaXMgcG9pbnQgYW5kXHJcbiAgLy8gcmV0dXJucyB0aGUgbmV4dCBsb2NhdGlvbiB0byBjaGVjay4gUmV0dXJucyBudWxsIGlmIHRoaXMgY2VsbCBpc1xyXG4gIC8vIG5vdCBwYXJ0IG9mIGEgc2hhcGUuXHJcbiAgZnVuY3Rpb24gbmV4dE5laWdoYm9yKGVsdCwgZGlyKSB7XHJcbiAgICB2YXIgZHJvdyA9IDAsIGRjb2wgPSAwO1xyXG4gICAgaWYgKGRpciA9PSBcIm5vbmVcIikge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBvZmZzZXQgPSBkaXJlY3Rpb25zW2Rpcl07XHJcbiAgICAgIHJldHVybiB7cjogZWx0LnIgKyBvZmZzZXRbMF0sIGM6IGVsdC5jICsgb2Zmc2V0WzFdfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEdldCB0aGUgbmV4dCBjZWxsLCBmcm9tIGxlZnQgdG8gcmlnaHQsIHRvcCB0byBib3R0b20uIFJldHVybnMgbnVsbFxyXG4gIC8vIGlmIGxhc3QgZWxlbWVudCBpbiBhcnJheSByZWFjaGVkLlxyXG4gIGZ1bmN0aW9uIG5leHRDZWxsKGVsdCkge1xyXG4gICAgaWYgKGVsdC5jICsgMSA8IGFjdGlvbkluZm9bZWx0LnJdLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm4ge3I6IGVsdC5yLCBjOiBlbHQuYyArIDF9O1xyXG4gICAgfSBlbHNlIGlmIChlbHQuciArIDEgPCBhY3Rpb25JbmZvLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm4ge3I6IGVsdC5yICsgMSwgYzogMH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIC8vIEdldCBpZGVudGlmaWVyIGZvciBnaXZlbiBub2RlIGFuZCBkaXJlY3Rpb25cclxuICBmdW5jdGlvbiBnZXRJZGVudGlmaWVyKG5vZGUsIGRpcikge1xyXG4gICAgcmV0dXJuIFwiclwiICsgbm9kZS5yICsgXCJjXCIgKyBub2RlLmMgKyBcImRcIiArIGRpcjtcclxuICB9XHJcbiAgXHJcbiAgdmFyIGRpc2NvdmVyZWQgPSBbXTtcclxuICB2YXIgbm9kZSA9IHtyOiAwLCBjOiAwfTtcclxuICB2YXIgc2hhcGVzID0gW107XHJcbiAgdmFyIGN1cnJlbnRfc2hhcGUgPSBbXTtcclxuICB2YXIgc2hhcGVfbm9kZV9zdGFydCA9IG51bGw7XHJcbiAgdmFyIGxhc3RfYWN0aW9uID0gbnVsbDtcclxuICAvLyBPYmplY3QgdG8gdHJhY2sgbG9jYXRpb24gKyBhY3Rpb25zIHRoYXQgaGF2ZSBiZWVuIHRha2VuLlxyXG4gIHZhciB0YWtlbl9hY3Rpb25zID0ge307XHJcbiAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xyXG5cclxuICAvLyBJdGVyYXRlIHVudGlsIGFsbCBub2RlcyBoYXZlIGJlZW4gdmlzaXRlZC5cclxuICB3aGlsZSAoZGlzY292ZXJlZC5sZW5ndGggIT09IHRvdGFsKSB7XHJcbiAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgLy8gUmVhY2hlZCBlbmQuXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgaWYgKGl0ZXJhdGlvbnMgPiB0b3RhbCAqIDQpIHtcclxuICAgICAgLy8gU2FuaXR5IGNoZWNrIG9uIG51bWJlciBvZiBpdGVyYXRpb25zLiBNYXhpbXVtIG51bWJlciBvZlxyXG4gICAgICAvLyB0aW1lcyBhIHNpbmdsZSB0aWxlIHdvdWxkIGJlIHZpc2l0ZWQgaXMgNCBmb3IgYSBmYW4tbGlrZVxyXG4gICAgICAvLyBwYXR0ZXJuIG9mIHRyaWFuZ2xlIHdhbGwgdGlsZXMuXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlcmF0aW9ucysrO1xyXG4gICAgfVxyXG4gICAgLy8gSXQncyBva2F5IHRvIGJlIGluIGEgZGlzY292ZXJlZCBub2RlIGlmIHNoYXBlcyBhcmUgYWRqYWNlbnQsXHJcbiAgICAvLyB3ZSBqdXN0IHdhbnQgdG8ga2VlcCB0cmFjayBvZiB0aGUgb25lcyB3ZSd2ZSBzZWVuLlxyXG4gICAgaWYgKGZpbmQoZGlzY292ZXJlZCwgbm9kZSwgZWx0Q29tcGFyZSkgPT0gLTEpIHtcclxuICAgICAgZGlzY292ZXJlZC5wdXNoKG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBhY3Rpb24gPSBhY3Rpb25JbmZvW25vZGUucl1bbm9kZS5jXTtcclxuICAgIHZhciBkaXI7XHJcbiAgICAvLyBJZiBhY3Rpb24gaGFzIG11bHRpcGxlIHBvc3NpYmlsaXRpZXMuXHJcbiAgICBpZiAoYWN0aW9uIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgLy8gUGFydCBvZiBhIHNoYXBlLCBmaW5kIHRoZSBpbmZvIHdpdGggdGhhdCBwcmV2aW91cyBhY3Rpb24gYXNcclxuICAgICAgLy8gaW5fZGlyLlxyXG4gICAgICBpZiAobGFzdF9hY3Rpb24gIT09IFwibm9uZVwiKSB7XHJcbiAgICAgICAgdmFyIGFjdGlvbl9mb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0aW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB2YXIgdGhpc19hY3Rpb24gPSBhY3Rpb25baV07XHJcbiAgICAgICAgICBpZiAodGhpc19hY3Rpb25bXCJsb2NcIl1bXCJpbl9kaXJcIl0gPT0gbGFzdF9hY3Rpb24pIHtcclxuICAgICAgICAgICAgYWN0aW9uID0gdGhpc19hY3Rpb247XHJcbiAgICAgICAgICAgIGRpciA9IHRoaXNfYWN0aW9uW1wibG9jXCJdW1wib3V0X2RpclwiXTtcclxuICAgICAgICAgICAgYWN0aW9uX2ZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWFjdGlvbl9mb3VuZCkge1xyXG4gICAgICAgICAgdGhyb3cgXCJFcnJvciFcIjtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gRmluZCB0aGUgZmlyc3QgYWN0aW9uIHRoYXQgaGFzIG5vdCBiZWVuIHRha2VuIHByZXZpb3VzbHkuXHJcbiAgICAgICAgdmFyIGFjdGlvbl9mb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0aW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB2YXIgdGhpc19hY3Rpb24gPSBhY3Rpb25baV07XHJcbiAgICAgICAgICBpZiAoIXRha2VuX2FjdGlvbnNbZ2V0SWRlbnRpZmllcihub2RlLCB0aGlzX2FjdGlvbltcImxvY1wiXVtcIm91dF9kaXJcIl0pXSkge1xyXG4gICAgICAgICAgICBhY3Rpb24gPSB0aGlzX2FjdGlvblxyXG4gICAgICAgICAgICBkaXIgPSB0aGlzX2FjdGlvbltcImxvY1wiXVtcIm91dF9kaXJcIl07XHJcbiAgICAgICAgICAgIGFjdGlvbl9mb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWFjdGlvbl9mb3VuZCkge1xyXG4gICAgICAgICAgdGhyb3cgXCJFcnJvciFcIjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7IC8vIEFjdGlvbiBvbmx5IGhhcyBzaW5nbGUgcG9zc2liaWxpdHkuXHJcbiAgICAgIGRpciA9IGFjdGlvbi5sb2M7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2V0IG5vZGUvYWN0aW9uIGFzIGhhdmluZyBiZWVuIHZpc2l0ZWQuXHJcbiAgICB0YWtlbl9hY3Rpb25zW2dldElkZW50aWZpZXIobm9kZSwgZGlyKV0gPSB0cnVlO1xyXG5cclxuICAgIGxhc3RfYWN0aW9uID0gZGlyO1xyXG4gICAgdmFyIG5leHQgPSBuZXh0TmVpZ2hib3Iobm9kZSwgZGlyKTtcclxuICAgIGlmIChuZXh0KSB7IC8vIFBhcnQgb2YgYSBzaGFwZS5cclxuICAgICAgLy8gU2F2ZSBsb2NhdGlvbiBmb3IgcmVzdGFydGluZyBhZnRlciB0aGlzIHNoYXBlIGhhcyBiZWVuIGRlZmluZWQuXHJcbiAgICAgIHZhciBmaXJzdCA9IGZhbHNlO1xyXG4gICAgICBpZiAoY3VycmVudF9zaGFwZS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIGZpcnN0ID0gdHJ1ZTtcclxuICAgICAgICBzaGFwZV9ub2RlX3N0YXJ0ID0gbm9kZTtcclxuICAgICAgICBzaGFwZV9ub2RlX3N0YXJ0X2FjdGlvbiA9IGxhc3RfYWN0aW9uO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBDdXJyZW50IG5vZGUgYW5kIGRpcmVjdGlvbiBpcyBzYW1lIGFzIGF0IHN0YXJ0IG9mIHNoYXBlLFxyXG4gICAgICAvLyBzaGFwZSBoYXMgYmVlbiBleHBsb3JlZC5cclxuICAgICAgaWYgKCFmaXJzdCAmJiBlbHRDb21wYXJlKG5vZGUsIHNoYXBlX25vZGVfc3RhcnQpICYmIGxhc3RfYWN0aW9uID09IHNoYXBlX25vZGVfc3RhcnRfYWN0aW9uKSB7XHJcbiAgICAgICAgc2hhcGVzLnB1c2goY3VycmVudF9zaGFwZSk7XHJcbiAgICAgICAgY3VycmVudF9zaGFwZSA9IFtdO1xyXG4gICAgICAgIC8vIEdldCB0aGUgbmV4dCB1bmRpc2NvdmVyZWQgbm9kZS5cclxuICAgICAgICBub2RlID0gbmV4dENlbGwoc2hhcGVfbm9kZV9zdGFydCk7XHJcbiAgICAgICAgd2hpbGUgKG5vZGUgJiYgKGZpbmQoZGlzY292ZXJlZCwgbm9kZSwgZWx0Q29tcGFyZSkgIT09IC0xKSkge1xyXG4gICAgICAgICAgbm9kZSA9IG5leHRDZWxsKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzaGFwZV9ub2RlX3N0YXJ0ID0gbnVsbDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoYWN0aW9uLnYgfHwgZmlyc3QpIHtcclxuICAgICAgICAgIGN1cnJlbnRfc2hhcGUucHVzaChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZSA9IG5leHQ7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7IC8vIE5vdCBwYXJ0IG9mIGEgc2hhcGUuXHJcbiAgICAgIG5vZGUgPSBuZXh0Q2VsbChub2RlKTtcclxuICAgICAgLy8gR2V0IHRoZSBuZXh0IHVuZGlzY292ZXJlZCBub2RlLlxyXG4gICAgICB3aGlsZSAobm9kZSAmJiAoZmluZChkaXNjb3ZlcmVkLCBub2RlLCBlbHRDb21wYXJlKSAhPT0gLTEpKSB7XHJcbiAgICAgICAgbm9kZSA9IG5leHRDZWxsKG5vZGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSAvLyBlbmQgd2hpbGVcclxuXHJcbiAgaWYgKGRpc2NvdmVyZWQubGVuZ3RoID09IHRvdGFsKSB7XHJcbiAgICByZXR1cm4gc2hhcGVzO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuXHJcbi8vIFJldHVybiB3aGV0aGVyIHRoZXJlIHNob3VsZCBiZSBhIHZlcnRleCBhdCB0aGUgZ2l2ZW4gbG9jYXRpb24gYW5kXHJcbi8vIHdoaWNoIGxvY2F0aW9uIHRvIGdvIG5leHQsIGlmIGFueS5cclxuLy8gVmFsdWUgcmV0dXJuZWQgaXMgYW4gb2JqZWN0IHdpdGggcHJvcGVydGllcyAndicgYW5kICdsb2MnLiAndicgaXMgYSBib29sZWFuXHJcbi8vIGluZGljYXRpbmcgd2hldGhlciB0aGVyZSBpcyBhIHZlcnRleCwgYW5kICdsb2MnIGdpdmVzIHRoZSBuZXh0IGxvY2F0aW9uIHRvIG1vdmUsIGlmIGFueS5cclxuLy8gbG9jIGlzIGEgc3RyaW5nLCBvZiBub25lLCBkb3duLCBsZWZ0LCByaWdodCwgdXAsIGRvd24gY29ycmVzcG9uZGluZyB0b1xyXG4vLyB0cmFjaW5nIG91dCBhIHNoYXBlIGNsb2Nrd2lzZSAob3IgdGhlIGludGVyaW9yIG9mIGEgc2hhcGUgQ0NXKSwgb3IgYSBmdW5jdGlvblxyXG4vLyB0aGF0IHRha2VzIGEgc3RyaW5nIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGRpcmVjdGlvbiB0YWtlbiB0byBnZXQgdG8gdGhlIGN1cnJlbnRcclxuLy8gY2VsbC5cclxuLy8gVGhlcmUgd2lsbCBuZXZlciBiZSBhIHZlcnRleCB3aXRob3V0IGEgbmV4dCBkaXJlY3Rpb24uXHJcbmZ1bmN0aW9uIGdldEFjdGlvbihjZWxsKSB7XHJcbiAgdmFyIHN0ciA9IGNlbGxbMF0gKyBcIi1cIiArIGNlbGxbMV0gKyBcIi1cIiArIGNlbGxbMl0gKyBcIi1cIiArIGNlbGxbM107XHJcbiAgcmV0dXJuIEFjdGlvblZhbHVlc1tzdHJdO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydCBhbiBhcnJheSBsb2NhdGlvbiB0byBhIHBvaW50IHJlcHJlc2VudGluZyB0aGUgdG9wLWxlZnRcclxuICogY29ybmVyIG9mIHRoZSB0aWxlIGluIGdsb2JhbCBjb29yZGluYXRlcy5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheUxvY30gbG9jYXRpb24gLSBUaGUgYXJyYXkgbG9jYXRpb24gdG8gZ2V0IHRoZVxyXG4gKiAgIGNvb3JkaW5hdGVzIGZvci5cclxuICogQHJldHVybiB7TVBQb2ludH0gLSBUaGUgY29vcmRpbmF0ZXMgb2YgdGhlIHRpbGUuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRDb29yZGluYXRlcyhsb2NhdGlvbikge1xyXG4gIHZhciB0aWxlX3dpZHRoID0gNDA7XHJcbiAgdmFyIHggPSBsb2NhdGlvbi5yICogdGlsZV93aWR0aDtcclxuICB2YXIgeSA9IGxvY2F0aW9uLmMgKiB0aWxlX3dpZHRoO1xyXG4gIHJldHVybiB7eDogeCwgeTogeX07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUYWtlcyBpbiBhbiBhcnJheSBvZiBzaGFwZXMgYW5kIGNvbnZlcnRzIGZyb20gY29udG91ciBncmlkIGxheW91dFxyXG4gKiB0byBhY3R1YWwgY29vcmRpbmF0ZXMuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPEFycmF5LjxBcnJheUxvYz4+fSBzaGFwZXMgLSBvdXRwdXQgZnJvbSBnZW5lcmF0ZVNoYXBlc1xyXG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXkuPHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fT4+fVxyXG4gKi9cclxuZnVuY3Rpb24gY29udmVydFNoYXBlc1RvQ29vcmRzKHNoYXBlcykge1xyXG4gIHZhciB0aWxlX3dpZHRoID0gNDA7XHJcblxyXG4gIHZhciBuZXdfc2hhcGVzID0gbWFwMmQoc2hhcGVzLCBmdW5jdGlvbihsb2MpIHtcclxuICAgIC8vIEl0IHdvdWxkIGJlIGxvYy5yICsgMSBhbmQgbG9jLmMgKyAxIGJ1dCB0aGF0IGhhcyBiZWVuIHJlbW92ZWRcclxuICAgIC8vIHRvIGFjY291bnQgZm9yIHRoZSBvbmUtdGlsZSB3aWR0aCBvZiBwYWRkaW5nIGFkZGVkIGluIGRvUGFyc2UuXHJcbiAgICB2YXIgcm93ID0gbG9jLnIgKiB0aWxlX3dpZHRoO1xyXG4gICAgdmFyIGNvbCA9IGxvYy5jICogdGlsZV93aWR0aDtcclxuICAgIHJldHVybiB7eDogcm93LCB5OiBjb2x9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIG5ld19zaGFwZXM7XHJcbn1cclxuXHJcbi8vIEdpdmVuIGFuIHggYW5kIHkgdmFsdWUsIHJldHVybiBhIHBvbHlnb24gKG9jdGFnb24pIHRoYXQgYXBwcm94aW1hdGVzXHJcbi8vIGEgc3Bpa2UgYXQgdGhlIHRpbGUgZ2l2ZW4gYnkgdGhhdCB4LCB5IGxvY2F0aW9uLiBQb2ludHMgaW4gQ1cgb3JkZXIuXHJcbmZ1bmN0aW9uIGdldFNwaWtlU2hhcGUoY29vcmQpIHtcclxuICB2YXIgeCA9IGNvb3JkLnggKyAyMCwgeSA9IGNvb3JkLnkgKyAyMDtcclxuICB2YXIgc3Bpa2VfcmFkaXVzID0gMTQ7XHJcbiAgLy8gYWxtb3N0ID0gc3Bpa2VfcmFkaXVzICogdGFuKHBpLzgpIGZvciB0aGUgdmVydGljZXMgb2YgYSByZWd1bGFyIG9jdGFnb24uXHJcbiAgdmFyIHBvaW50X29mZnNldCA9IDUuODtcclxuICByZXR1cm4gW1xyXG4gICAge3g6IHggLSBzcGlrZV9yYWRpdXMsIHk6IHkgLSBwb2ludF9vZmZzZXR9LFxyXG4gICAge3g6IHggLSBzcGlrZV9yYWRpdXMsIHk6IHkgKyBwb2ludF9vZmZzZXR9LFxyXG4gICAge3g6IHggLSBwb2ludF9vZmZzZXQsIHk6IHkgKyBzcGlrZV9yYWRpdXN9LFxyXG4gICAge3g6IHggKyBwb2ludF9vZmZzZXQsIHk6IHkgKyBzcGlrZV9yYWRpdXN9LFxyXG4gICAge3g6IHggKyBzcGlrZV9yYWRpdXMsIHk6IHkgKyBwb2ludF9vZmZzZXR9LFxyXG4gICAge3g6IHggKyBzcGlrZV9yYWRpdXMsIHk6IHkgLSBwb2ludF9vZmZzZXR9LFxyXG4gICAge3g6IHggKyBwb2ludF9vZmZzZXQsIHk6IHkgLSBzcGlrZV9yYWRpdXN9LFxyXG4gICAge3g6IHggLSBwb2ludF9vZmZzZXQsIHk6IHkgLSBzcGlrZV9yYWRpdXN9XHJcbiAgXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIGFycmF5IGxvY2F0aW9ucyBvZiB0aGUgc3Bpa2VzIGNvbnRhaW5lZFxyXG4gKiBpbiB0aGUgbWFwIHRpbGVzLCByZXBsYWNpbmcgdGhvc2UgYXJyYXkgbG9jYXRpb25zIGluIHRoZSBvcmlnaW5hbFxyXG4gKiBtYXAgdGlsZXMgd2l0aCAyLCB3aGljaCBjb3JyZXNwb25kcyB0byBhIGZsb29yIHRpbGUuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7TWFwVGlsZXN9IHRpbGVzIC0gVGhlIG1hcCB0aWxlcy5cclxuICogQHJldHVybiB7QXJyYXkuPEFycmF5TG9jPn0gLSBUaGUgYXJyYXkgb2YgbG9jYXRpb25zIHRoYXQgaGVsZFxyXG4gKiAgIHNwaWtlIHRpbGVzLlxyXG4gKi9cclxuTWFwUGFyc2VyLmV4dHJhY3RTcGlrZXMgPSBmdW5jdGlvbih0aWxlcykge1xyXG4gIHZhciBzcGlrZV9sb2NhdGlvbnMgPSBbXTtcclxuICB0aWxlcy5mb3JFYWNoKGZ1bmN0aW9uKHJvdywgcm93X24pIHtcclxuICAgIHJvdy5mb3JFYWNoKGZ1bmN0aW9uKGNlbGxfdmFsdWUsIGluZGV4LCByb3cpIHtcclxuICAgICAgaWYgKGNlbGxfdmFsdWUgPT0gNykge1xyXG4gICAgICAgIHNwaWtlX2xvY2F0aW9ucy5wdXNoKHtyOiByb3dfbiwgYzogaW5kZXh9KTtcclxuICAgICAgICByb3dbaW5kZXhdID0gMjtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHNwaWtlX2xvY2F0aW9ucztcclxufTtcclxuXHJcbnZhciBPYnN0YWNsZSA9IGZ1bmN0aW9uKHR5cGUsIGlkcykge1xyXG4gIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgdGhpcy52YWxzID0gW107XHJcbiAgdGhpcy5pbmZvID0ge307XHJcbiAgaWRzLmZvckVhY2goZnVuY3Rpb24oaWQpIHtcclxuICAgIGlmICh0eXBlb2YgaWQgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICB0aGlzLnZhbHMucHVzaChpZCk7XHJcbiAgICAgIHRoaXMuaW5mb1tpZF0gPSB0aGlzLnR5cGU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnZhbHMucHVzaChpZC5udW0pO1xyXG4gICAgICB0aGlzLmluZm9baWRdID0gaWQubmFtZTtcclxuICAgIH1cclxuICB9LCB0aGlzKTtcclxufTtcclxuXHJcbk9ic3RhY2xlLnByb3RvdHlwZS5kZXNjcmliZXMgPSBmdW5jdGlvbih2YWwpIHtcclxuICBpZih0aGlzLnZhbHMuaW5kZXhPZihNYXRoLmZsb29yKCt2YWwpKSAhPT0gLTEpIHtcclxuICAgIHJldHVybiAodGhpcy5pbmZvWyt2YWxdIHx8IHRoaXMuaW5mb1tNYXRoLmZsb29yKCt2YWwpXSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcblxyXG52YXIgT2JzdGFjbGVzID0gW1xyXG4gIG5ldyBPYnN0YWNsZShcImJvbWJcIiwgWzEwLCAxMC4xXSksXHJcbiAgbmV3IE9ic3RhY2xlKFwiYm9vc3RcIixcclxuICAgIFs1LCA1LjEsIHtudW06IDE0LCBuYW1lOiBcInJlZGJvb3N0XCJ9LCB7bnVtOiAxNSwgbmFtZTogXCJibHVlYm9vc3RcIn1dKSxcclxuICBuZXcgT2JzdGFjbGUoXCJnYXRlXCIsXHJcbiAgICBbOSwge251bTogOS4xLCBuYW1lOiBcImdyZWVuZ2F0ZVwifSwge251bTogOS4yLCBuYW1lOiBcInJlZGdhdGVcIn0sXHJcbiAgICB7bnVtOiA5LjMsIG5hbWU6IFwiYmx1ZWdhdGVcIn1dKVxyXG5dO1xyXG5cclxuTWFwUGFyc2VyLmV4dHJhY3REeW5hbWljT2JzdGFjbGVzID0gZnVuY3Rpb24odGlsZXMpIHtcclxuICB2YXIgZHluYW1pY19vYnN0YWNsZXMgPSBbXTtcclxuICB0aWxlcy5mb3JFYWNoKGZ1bmN0aW9uKHJvdywgeCkge1xyXG4gICAgcm93LmZvckVhY2goZnVuY3Rpb24odGlsZSwgeSkge1xyXG4gICAgICBPYnN0YWNsZXMuc29tZShmdW5jdGlvbihvYnN0YWNsZV90eXBlKSB7XHJcbiAgICAgICAgdmFyIGR5bmFtaWNfb2JzdGFjbGUgPSBvYnN0YWNsZV90eXBlLmRlc2NyaWJlcyh0aWxlKVxyXG4gICAgICAgIGlmIChkeW5hbWljX29ic3RhY2xlKSB7XHJcbiAgICAgICAgICBkeW5hbWljX29ic3RhY2xlcy5wdXNoKHtcclxuICAgICAgICAgICAgdHlwZTogZHluYW1pY19vYnN0YWNsZSxcclxuICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgeTogeSxcclxuICAgICAgICAgICAgdjogdGlsZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aWxlc1t4XVt5XSA9IDA7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm4gZHluYW1pY19vYnN0YWNsZXM7XHJcbn07XHJcblxyXG4vKipcclxuICogVGhlIHJldHVybmVkIHZhbHVlIGZyb20gdGhlIG1hcCBwYXJzaW5nIGZ1bmN0aW9uLlxyXG4gKiBAdHlwZWRlZiBQYXJzZWRNYXBcclxuICogQHR5cGUge29iamVjdH1cclxuICogQHByb3BlcnR5IHtBcnJheS48TVBTaGFwZT59IHdhbGxzIC0gVGhlIHBhcnNlZCB3YWxscy5cclxuICogQHByb3BlcnR5IHtBcnJheS48TVBTaGFwZT59IG9ic3RhY2xlcyAtIFRoZSBwYXJzZWQgb2JzdGFjbGVzLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB0aGUgMmQgYXJyYXkgZGVmaW5pbmcgYSBUYWdQcm8gbWFwIGludG8gc2hhcGVzLlxyXG4gKiBAcGFyYW0ge01hcFRpbGVzfSB0aWxlcyAtIFRoZSB0aWxlcyBhcyByZXRyaWV2ZWQgZnJvbSBgdGFncHJvLm1hcGAuXHJcbiAqIEByZXR1cm4gez9QYXJzZWRNYXB9IC0gVGhlIHJlc3VsdCBvZiBjb252ZXJ0aW5nIHRoZSBtYXAgaW50b1xyXG4gKiAgIHBvbHlnb25zLCBvciBudWxsIGlmIHRoZXJlIHdhcyBhbiBpc3N1ZSBwYXJzaW5nIHRoZSBtYXAuXHJcbiAqL1xyXG5NYXBQYXJzZXIucGFyc2UgPSBmdW5jdGlvbih0aWxlcykge1xyXG4gIC8vIE1ha2UgY29weSBvZiB0aWxlcyB0byBwcmVzZXJ2ZSBvcmlnaW5hbCBhcnJheVxyXG4gIHRpbGVzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aWxlcykpO1xyXG5cclxuICAvLyBSZXR1cm5zIGEgbGlzdCBvZiB0aGUgc3Bpa2UgbG9jYXRpb25zIGFuZCByZW1vdmVzIHRoZW0gZnJvbVxyXG4gIC8vIHRoZSB0aWxlcy5cclxuICB2YXIgc3Bpa2VfbG9jYXRpb25zID0gTWFwUGFyc2VyLmV4dHJhY3RTcGlrZXModGlsZXMpO1xyXG5cclxuICB2YXIgZHluYW1pY19vYnN0YWNsZXMgPSBNYXBQYXJzZXIuZXh0cmFjdER5bmFtaWNPYnN0YWNsZXModGlsZXMpO1xyXG5cclxuICAvLyBQYWQgdGlsZXMgd2l0aCBhIHJpbmcgb2Ygd2FsbCB0aWxlcywgdG8gZW5zdXJlIHRoZSBtYXAgaXNcclxuICAvLyBjbG9zZWQuXHJcbiAgdmFyIGVtcHR5X3JvdyA9IFtdO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGlsZXNbMF0ubGVuZ3RoICsgMjsgaSsrKSB7XHJcbiAgICBlbXB0eV9yb3cucHVzaCgxKTtcclxuICB9XHJcbiAgdGlsZXMuZm9yRWFjaChmdW5jdGlvbihyb3cpIHtcclxuICAgIHJvdy51bnNoaWZ0KDEpO1xyXG4gICAgcm93LnB1c2goMSk7XHJcbiAgfSk7XHJcbiAgdGlsZXMudW5zaGlmdChlbXB0eV9yb3cpO1xyXG4gIHRpbGVzLnB1c2goZW1wdHlfcm93LnNsaWNlKCkpO1xyXG5cclxuICAvLyBBY3R1YWxseSBkb2luZyB0aGUgY29udmVyc2lvbi5cclxuICAvLyBHZXQgcmlkIG9mIHRpbGUgdmFsdWVzIGV4Y2VwdCB0aG9zZSBmb3IgdGhlIHdhbGxzLlxyXG4gIHZhciB0aHJlc2hvbGRfdGlsZXMgPSBtYXAyZCh0aWxlcywgaXNCYWRDZWxsKTtcclxuXHJcbiAgLy8gR2VuZXJhdGUgY29udG91ciBncmlkLCBlc3NlbnRpYWxseSBhIGdyaWQgd2hvc2UgY2VsbHMgYXJlIGF0IHRoZVxyXG4gIC8vIGludGVyc2VjdGlvbiBvZiBldmVyeSBzZXQgb2YgNCBjZWxscyBpbiB0aGUgb3JpZ2luYWwgbWFwLlxyXG4gIHZhciBjb250b3VyX2dyaWRfMiA9IGdlbmVyYXRlQ29udG91ckdyaWQodGhyZXNob2xkX3RpbGVzKTtcclxuXHJcbiAgLy8gR2V0IHRpbGUgdmVydGV4IGFuZCBhY3Rpb25zIGZvciBlYWNoIGNlbGwgaW4gY29udG91ciBncmlkLlxyXG4gIHZhciB0aWxlX2FjdGlvbnMgPSBtYXAyZChjb250b3VyX2dyaWRfMiwgZ2V0QWN0aW9uKTtcclxuXHJcbiAgdmFyIGdlbmVyYXRlZF9zaGFwZXMgPSBnZW5lcmF0ZVNoYXBlcyh0aWxlX2FjdGlvbnMpO1xyXG4gIGlmICghZ2VuZXJhdGVkX3NoYXBlcykge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICB2YXIgYWN0dWFsX3NoYXBlcyA9IGdlbmVyYXRlZF9zaGFwZXMuZmlsdGVyKGZ1bmN0aW9uKGVsdCkge1xyXG4gICAgcmV0dXJuIGVsdC5sZW5ndGggPiAwO1xyXG4gIH0pO1xyXG5cclxuICB2YXIgY29udmVydGVkX3NoYXBlcyA9IGNvbnZlcnRTaGFwZXNUb0Nvb3JkcyhhY3R1YWxfc2hhcGVzKTtcclxuXHJcbiAgLy8gR2V0IHNwaWtlLWFwcHJveGltYXRpbmcgc2hhcGVzIGFuZCBhZGQgdG8gbGlzdC5cclxuICB2YXIgc3RhdGljX29ic3RhY2xlcyA9IHNwaWtlX2xvY2F0aW9ucy5tYXAoZnVuY3Rpb24oc3Bpa2UpIHtcclxuICAgIHJldHVybiBnZXRTcGlrZVNoYXBlKGdldENvb3JkaW5hdGVzKHNwaWtlKSk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB3YWxsczogdGhpcy5jb252ZXJ0U2hhcGVzVG9Qb2x5cyhjb252ZXJ0ZWRfc2hhcGVzKSxcclxuICAgIHN0YXRpY19vYnN0YWNsZXM6IHRoaXMuY29udmVydFNoYXBlc1RvUG9seXMoc3RhdGljX29ic3RhY2xlcyksXHJcbiAgICBkeW5hbWljX29ic3RhY2xlczogZHluYW1pY19vYnN0YWNsZXNcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgc2hhcGVzIGludG8gcG9seXMuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFNoYXBlPn0gc2hhcGVzIC0gVGhlIHNoYXBlcyB0byBiZSBjb252ZXJ0ZWQuXHJcbiAqIEByZXR1cm4ge0FycmF5LjxQb2x5Pn0gLSBUaGUgY29udmVydGVkIHNoYXBlcy5cclxuICovXHJcbk1hcFBhcnNlci5jb252ZXJ0U2hhcGVzVG9Qb2x5cyA9IGZ1bmN0aW9uKHNoYXBlcykge1xyXG4gIHZhciBwb2x5cyA9IHNoYXBlcy5tYXAoZnVuY3Rpb24oc2hhcGUpIHtcclxuICAgIHJldHVybiBNYXBQYXJzZXIuY29udmVydFNoYXBlVG9Qb2x5KHNoYXBlKTtcclxuICB9KTtcclxuICByZXR1cm4gcG9seXM7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgYSBzaGFwZSBpbnRvIGEgUG9seS5cclxuICogQHBhcmFtIHtNUFNoYXBlfSBzaGFwZSAtIFRoZSBzaGFwZSB0byBjb252ZXJ0LlxyXG4gKiBAcmV0dXJuIHtQb2x5fSAtIFRoZSBjb252ZXJ0ZWQgc2hhcGUuXHJcbiAqL1xyXG5NYXBQYXJzZXIuY29udmVydFNoYXBlVG9Qb2x5ID0gZnVuY3Rpb24oc2hhcGUpIHtcclxuICB2YXIgcG9seSA9IG5ldyBQb2x5KCk7XHJcbiAgcG9seS5pbml0KHNoYXBlLmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaGFwZS5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHBvaW50ID0gbmV3IFBvaW50KHNoYXBlW2ldLngsIHNoYXBlW2ldLnkpO1xyXG4gICAgcG9seS5zZXRQb2ludChpLCBwb2ludCk7XHJcbiAgfVxyXG4gIHJldHVybiBwb2x5O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBQYXJzZXI7XHJcblxufSx7XCIuL2FjdGlvbi12YWx1ZXNcIjo1LFwiLi9nZW9tZXRyeVwiOjZ9XSw5OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxyXG4gKiBIb2xkcyBjbGFzc2VzIGZvciBwb2ludHMsIHBvbHlnb25zLCBhbmQgdXRpbGl0aWVzIGZvciBvcGVyYXRpbmcgb25cclxuICogdGhlbS5cclxuICogQWRhcHRlZC9jb3BpZWQgZnJvbSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHlwYXJ0aXRpb24vXHJcbiAqIEBtb2R1bGUgUG9seVBhcnRpdGlvblxyXG4gKi9cclxudmFyIHBvbHkydHJpID0gX2RlcmVxXygncG9seTJ0cmknKTtcclxudmFyIGdlbyA9IF9kZXJlcV8oJy4vZ2VvbWV0cnknKTtcclxuXHJcbnZhciBQb2ludCA9IGdlby5Qb2ludDtcclxudmFyIEVkZ2UgPSBnZW8uRWRnZTtcclxudmFyIFBvbHkgPSBnZW8uUG9seTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgUG9pbnQgY2xhc3MgdXNlZCBieSBwb2x5MnRyaS5cclxuICogQHByaXZhdGVcclxuICogQHR5cGVkZWYgUDJUUG9pbnRcclxuICovXHJcblxyXG4vKipcclxuICogQSBwb2x5Z29uIGZvciB1c2Ugd2l0aCBwb2x5MnRyaS5cclxuICogQHByaXZhdGVcclxuICogQHR5cGVkZWYgUDJUUG9seVxyXG4gKiBAdHlwZSB7QXJyYXkuPFAyVFBvaW50Pn1cclxuICovXHJcblxyXG4vKipcclxuICogQ29udmVydCBhIHBvbHlnb24gaW50byBmb3JtYXQgcmVxdWlyZWQgYnkgcG9seTJ0cmkuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7UG9seX0gcG9seSAtIFRoZSBwb2x5Z29uIHRvIGNvbnZlcnQuXHJcbiAqIEByZXR1cm4ge1AyVFBvbHl9IC0gVGhlIGNvbnZlcnRlZCBwb2x5Z29uLlxyXG4gKi9cclxuZnVuY3Rpb24gY29udmVydFBvbHlUb1AyVFBvbHkocG9seSkge1xyXG4gIHJldHVybiBwb2x5LnBvaW50cy5tYXAoZnVuY3Rpb24ocCkge1xyXG4gICAgcmV0dXJuIG5ldyBwb2x5MnRyaS5Qb2ludChwLngsIHAueSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgcG9seWdvbi90cmlhbmdsZSByZXR1cm5lZCBmcm9tIHBvbHkydHJpIGJhY2sgaW50byBhXHJcbiAqIHBvbHlnb24uXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7UDJUUG9seX0gcDJ0cG9seSAtIFRoZSBwb2x5Z29uIHRvIGNvbnZlcnQuXHJcbiAqIEByZXR1cm4ge1BvbHl9IC0gVGhlIGNvbnZlcnRlZCBwb2x5Z29uLlxyXG4gKi9cclxuZnVuY3Rpb24gY29udmVydFAyVFBvbHlUb1BvbHkocDJ0cG9seSkge1xyXG4gIHZhciBwb2ludHMgPSBwMnRwb2x5LmdldFBvaW50cygpLm1hcChmdW5jdGlvbihwKSB7XHJcbiAgICByZXR1cm4gbmV3IFBvaW50KHAueCwgcC55KTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIG5ldyBQb2x5KHBvaW50cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQ29udmV4KHAxLCBwMiwgcDMpIHtcclxuICB2YXIgdG1wID0gKHAzLnkgLSBwMS55KSAqIChwMi54IC0gcDEueCkgLSAocDMueCAtIHAxLngpICogKHAyLnkgLSBwMS55KTtcclxuICByZXR1cm4gKHRtcCA+IDApO1xyXG59XHJcblxyXG4vKipcclxuICogVGFrZXMgYW4gYXJyYXkgb2YgcG9seWdvbnMgdGhhdCBvdmVybGFwIHRoZW1zZWx2ZXMgYW5kIG90aGVyc1xyXG4gKiBhdCBkaXNjcmV0ZSBjb3JuZXIgcG9pbnRzIGFuZCBzZXBhcmF0ZSB0aG9zZSBvdmVybGFwcGluZyBjb3JuZXJzXHJcbiAqIHNsaWdodGx5IHNvIHRoZSBwb2x5Z29ucyBhcmUgc3VpdGFibGUgZm9yIHRyaWFuZ3VsYXRpb24gYnlcclxuICogcG9seTJ0cmkuanMuIFRoaXMgY2hhbmdlcyB0aGUgUG9seSBvYmplY3RzIGluIHRoZSBhcnJheS5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheS48UG9seT59IHBvbHlzIC0gVGhlIHBvbHlnb25zIHRvIHNlcGFyYXRlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW29mZnNldD0xXSAtIFRoZSBudW1iZXIgb2YgdW5pdHMgdGhlIHZlcnRpY2VzXHJcbiAqICAgc2hvdWxkIGJlIG1vdmVkIGF3YXkgZnJvbSBlYWNoIG90aGVyLlxyXG4gKi9cclxuZnVuY3Rpb24gc2VwYXJhdGVQb2x5cyhwb2x5cywgb2Zmc2V0KSB7XHJcbiAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDE7XHJcbiAgdmFyIGRpc2NvdmVyZWQgPSB7fTtcclxuICB2YXIgZHVwZXMgPSB7fTtcclxuICAvLyBPZmZzZXQgdG8gdXNlIGluIGNhbGN1bGF0aW9uLlxyXG4gIC8vIEZpbmQgZHVwbGljYXRlcy5cclxuICBmb3IgKHZhciBzMSA9IDA7IHMxIDwgcG9seXMubGVuZ3RoOyBzMSsrKSB7XHJcbiAgICB2YXIgcG9seSA9IHBvbHlzW3MxXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9seS5udW1wb2ludHM7IGkrKykge1xyXG4gICAgICB2YXIgcG9pbnQgPSBwb2x5LnBvaW50c1tpXS50b1N0cmluZygpO1xyXG4gICAgICBpZiAoIWRpc2NvdmVyZWQuaGFzT3duUHJvcGVydHkocG9pbnQpKSB7XHJcbiAgICAgICAgZGlzY292ZXJlZFtwb2ludF0gPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGR1cGVzW3BvaW50XSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEdldCBkdXBsaWNhdGUgcG9pbnRzLlxyXG4gIHZhciBkdXBlX3BvaW50cyA9IFtdO1xyXG4gIHZhciBkdXBlO1xyXG4gIGZvciAodmFyIHMxID0gMDsgczEgPCBwb2x5cy5sZW5ndGg7IHMxKyspIHtcclxuICAgIHZhciBwb2x5ID0gcG9seXNbczFdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2x5Lm51bXBvaW50czsgaSsrKSB7XHJcbiAgICAgIHZhciBwb2ludCA9IHBvbHkucG9pbnRzW2ldO1xyXG4gICAgICBpZiAoZHVwZXMuaGFzT3duUHJvcGVydHkocG9pbnQudG9TdHJpbmcoKSkpIHtcclxuICAgICAgICBkdXBlID0gW3BvaW50LCBpLCBwb2x5XTtcclxuICAgICAgICBkdXBlX3BvaW50cy5wdXNoKGR1cGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBTb3J0IGVsZW1lbnRzIGluIGRlc2NlbmRpbmcgb3JkZXIgYmFzZWQgb24gdGhlaXIgaW5kaWNlcyB0b1xyXG4gIC8vIHByZXZlbnQgZnV0dXJlIGluZGljZXMgZnJvbSBiZWNvbWluZyBpbnZhbGlkIHdoZW4gY2hhbmdlcyBhcmUgbWFkZS5cclxuICBkdXBlX3BvaW50cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgIHJldHVybiBiWzFdIC0gYVsxXVxyXG4gIH0pO1xyXG4gIC8vIEVkaXQgZHVwbGljYXRlcy5cclxuICB2YXIgcHJldiwgbmV4dCwgcG9pbnQsIGluZGV4LCBwMSwgcDI7XHJcbiAgZHVwZV9wb2ludHMuZm9yRWFjaChmdW5jdGlvbihlLCBpLCBhcnkpIHtcclxuICAgIHBvaW50ID0gZVswXSwgaW5kZXggPSBlWzFdLCBwb2x5ID0gZVsyXTtcclxuICAgIHByZXYgPSBwb2x5LnBvaW50c1twb2x5LmdldFByZXZJKGluZGV4KV07XHJcbiAgICBuZXh0ID0gcG9seS5wb2ludHNbcG9seS5nZXROZXh0SShpbmRleCldO1xyXG4gICAgcDEgPSBwb2ludC5hZGQocHJldi5zdWIocG9pbnQpLm5vcm1hbGl6ZSgpLm11bChvZmZzZXQpKTtcclxuICAgIHAyID0gcG9pbnQuYWRkKG5leHQuc3ViKHBvaW50KS5ub3JtYWxpemUoKS5tdWwob2Zmc2V0KSk7XHJcbiAgICAvLyBJbnNlcnQgbmV3IHBvaW50cy5cclxuICAgIHBvbHkucG9pbnRzLnNwbGljZShpbmRleCwgMSwgcDEsIHAyKTtcclxuICAgIHBvbHkudXBkYXRlKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQYXJ0aXRpb24gYSBwb2x5Z29uIHdpdGggKG9wdGlvbmFsKSBob2xlcyBpbnRvIGEgc2V0IG9mIGNvbnZleFxyXG4gKiBwb2x5Z29ucy4gVGhlIHZlcnRpY2VzIG9mIHRoZSBwb2x5Z29uIG11c3QgYmUgZ2l2ZW4gaW4gQ1cgb3JkZXIsXHJcbiAqIGFuZCB0aGUgdmVydGljZXMgb2YgdGhlIGhvbGVzIG11c3QgYmUgaW4gQ0NXIG9yZGVyLiBVc2VzIHBvbHkydHJpXHJcbiAqIGZvciB0aGUgaW5pdGlhbCB0cmlhbmd1bGF0aW9uIGFuZCBIZXJ0ZWwtTWVobGhvcm4gdG8gY29tYmluZSB0aGVtXHJcbiAqIGludG8gY29udmV4IHBvbHlnb25zLlxyXG4gKiBAcGFyYW0ge1BvbHl9IHBvbHkgLSBUaGUgcG9seWdvbiB0byB1c2UgYXMgdGhlIG91dGxpbmUuXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFBvbHk+fSBbaG9sZXNdIC0gQW4gYXJyYXkgb2YgaG9sZXMgcHJlc2VudCBpbiB0aGVcclxuICogICBwb2x5Z29uLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW21pbkFyZWE9NV0gLSBBbiBvcHRpb25hbCBwYXJhbWV0ZXIgdGhhdCBmaWx0ZXJzXHJcbiAqICAgb3V0IHBvbHlnb25zIGluIHRoZSBwYXJ0aXRpb24gc21hbGxlciB0aGFuIHRoaXMgdmFsdWUuXHJcbiAqIEByZXR1cm4ge0FycmF5LjxQb2x5Pn0gLSBUaGUgc2V0IG9mIHBvbHlnb25zIGRlZmluaW5nIHRoZVxyXG4gKiAgIHBhcnRpdGlvbiBvZiB0aGUgcHJvdmlkZWQgcG9seWdvbi5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocG9seSwgaG9sZXMsIG1pbkFyZWEpIHtcclxuICBpZiAodHlwZW9mIGhvbGVzID09ICd1bmRlZmluZWQnKSBob2xlcyA9IGZhbHNlO1xyXG4gIGlmICh0eXBlb2YgbWluQXJlYSA9PSAndW5kZWZpbmVkJykgbWluQXJlYSA9IDU7XHJcblxyXG4gIHZhciBpMTEsIGkxMiwgaTEzLCBpMjEsIGkyMiwgaTIzO1xyXG4gIHZhciBwYXJ0cyA9IG5ldyBBcnJheSgpO1xyXG5cclxuICAvLyBDaGVjayBpZiBwb2x5IGlzIGFscmVhZHkgY29udmV4IG9ubHkgaWYgdGhlcmUgYXJlIG5vIGhvbGVzLlxyXG4gIGlmICghaG9sZXMgfHwgaG9sZXMubGVuZ3RoID09IDApIHtcclxuICAgIHZhciByZWZsZXggPSBmYWxzZTtcclxuICAgIC8vIENoZWNrIGlmIGFscmVhZHkgY29udmV4LlxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2x5Lm51bXBvaW50czsgaSsrKSB7XHJcbiAgICAgIHZhciBwcmV2ID0gcG9seS5nZXRQcmV2SShpKTtcclxuICAgICAgdmFyIG5leHQgPSBwb2x5LmdldE5leHRJKGkpO1xyXG4gICAgICBpZiAoIWlzQ29udmV4KHBvbHkuZ2V0UG9pbnQocHJldiksIHBvbHkuZ2V0UG9pbnQoaSksIHBvbHkuZ2V0UG9pbnQobmV4dCkpKSB7XHJcbiAgICAgICAgcmVmbGV4ID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCFyZWZsZXgpIHtcclxuICAgICAgcGFydHMucHVzaChwb2x5KTtcclxuICAgICAgcmV0dXJuIHBhcnRzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gU2VwYXJhdGUgcG9seXMgdG8gcmVtb3ZlIGNvbGxpbmVhciBwb2ludHMuXHJcbiAgc2VwYXJhdGVQb2x5cyhob2xlcy5jb25jYXQocG9seSkpO1xyXG5cclxuICAvLyBDb252ZXJ0IHBvbHlnb24gaW50byBmb3JtYXQgcmVxdWlyZWQgYnkgcG9seTJ0cmkuXHJcbiAgdmFyIGNvbnRvdXIgPSBjb252ZXJ0UG9seVRvUDJUUG9seShwb2x5KTtcclxuXHJcbiAgaWYgKGhvbGVzKSB7XHJcbiAgICAvLyBDb252ZXJ0IGhvbGVzIGludG8gZm9ybWF0IHJlcXVpcmVkIGJ5IHBvbHkydHJpLlxyXG4gICAgaG9sZXMgPSBob2xlcy5tYXAoY29udmVydFBvbHlUb1AyVFBvbHkpO1xyXG4gIH1cclxuXHJcbiAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcclxuICBpZiAoaG9sZXMpIHtcclxuICAgIHN3Y3R4LmFkZEhvbGVzKGhvbGVzKTtcclxuICB9XHJcbiAgdmFyIHRyaWFuZ2xlcyA9IHN3Y3R4LnRyaWFuZ3VsYXRlKCkuZ2V0VHJpYW5nbGVzKCk7XHJcbiAgXHJcbiAgLy8gQ29udmVydCBwb2x5MnRyaSB0cmlhbmdsZXMgYmFjayBpbnRvIHBvbHlnb25zIGFuZCBmaWx0ZXIgb3V0IHRoZVxyXG4gIC8vIG9uZXMgdG9vIHNtYWxsIHRvIGJlIHJlbGV2YW50LlxyXG4gIHRyaWFuZ2xlcyA9IHRyaWFuZ2xlcy5tYXAoY29udmVydFAyVFBvbHlUb1BvbHkpLmZpbHRlcihmdW5jdGlvbihwb2x5KSB7XHJcbiAgICByZXR1cm4gcG9seS5nZXRBcmVhKCkgPj0gbWluQXJlYTtcclxuICB9KTtcclxuXHJcbiAgZm9yICh2YXIgczEgPSAwOyBzMSA8IHRyaWFuZ2xlcy5sZW5ndGg7IHMxKyspIHtcclxuICAgIHZhciBwb2x5MSA9IHRyaWFuZ2xlc1tzMV07XHJcbiAgICB2YXIgczJfaW5kZXggPSBudWxsO1xyXG4gICAgZm9yIChpMTEgPSAwOyBpMTEgPCBwb2x5MS5udW1wb2ludHM7IGkxMSsrKSB7XHJcbiAgICAgIHZhciBkMSA9IHBvbHkxLmdldFBvaW50KGkxMSk7XHJcbiAgICAgIGkxMiA9IHBvbHkxLmdldE5leHRJKGkxMSk7XHJcbiAgICAgIHZhciBkMiA9IHBvbHkxLmdldFBvaW50KGkxMik7XHJcblxyXG4gICAgICB2YXIgaXNkaWFnb25hbCA9IGZhbHNlO1xyXG4gICAgICBmb3IgKHZhciBzMiA9IHMxOyBzMiA8IHRyaWFuZ2xlcy5sZW5ndGg7IHMyKyspIHtcclxuICAgICAgICBpZiAoczEgPT0gczIpIGNvbnRpbnVlO1xyXG4gICAgICAgIHZhciBwb2x5MiA9IHRyaWFuZ2xlc1tzMl07XHJcbiAgICAgICAgZm9yIChpMjEgPSAwOyBpMjEgPCBwb2x5Mi5udW1wb2ludHM7IGkyMSsrKSB7XHJcbiAgICAgICAgICBpZiAoZDIubmVxKHBvbHkyLmdldFBvaW50KGkyMSkpKSBjb250aW51ZTtcclxuICAgICAgICAgIGkyMiA9IHBvbHkyLmdldE5leHRJKGkyMSk7XHJcbiAgICAgICAgICBpZiAoZDEubmVxKHBvbHkyLmdldFBvaW50KGkyMikpKSBjb250aW51ZTtcclxuICAgICAgICAgIGlzZGlhZ29uYWwgPSB0cnVlO1xyXG4gICAgICAgICAgb2JqZWN0XzJfaW5kZXggPSBzMjtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNkaWFnb25hbCkgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghaXNkaWFnb25hbCkgY29udGludWU7XHJcbiAgICAgIHZhciBwMSwgcDIsIHAzO1xyXG4gICAgICBwMiA9IHBvbHkxLmdldFBvaW50KGkxMSk7XHJcbiAgICAgIGkxMyA9IHBvbHkxLmdldFByZXZJKGkxMSk7XHJcbiAgICAgIHAxID0gcG9seTEuZ2V0UG9pbnQoaTEzKTtcclxuICAgICAgaTIzID0gcG9seTIuZ2V0TmV4dEkoaTIyKTtcclxuICAgICAgcDMgPSBwb2x5Mi5nZXRQb2ludChpMjMpO1xyXG5cclxuICAgICAgaWYgKCFpc0NvbnZleChwMSwgcDIsIHAzKSkgY29udGludWU7XHJcblxyXG4gICAgICBwMiA9IHBvbHkxLmdldFBvaW50KGkxMik7XHJcbiAgICAgIGkxMyA9IHBvbHkxLmdldE5leHRJKGkxMik7XHJcbiAgICAgIHAzID0gcG9seTEuZ2V0UG9pbnQoaTEzKTtcclxuICAgICAgaTIzID0gcG9seTIuZ2V0UHJldkkoaTIxKTtcclxuICAgICAgcDEgPSBwb2x5Mi5nZXRQb2ludChpMjMpO1xyXG5cclxuICAgICAgaWYgKCFpc0NvbnZleChwMSwgcDIsIHAzKSkgY29udGludWU7XHJcblxyXG4gICAgICB2YXIgbmV3cG9seSA9IG5ldyBQb2x5KCk7XHJcbiAgICAgIG5ld3BvbHkuaW5pdChwb2x5MS5udW1wb2ludHMgKyBwb2x5Mi5udW1wb2ludHMgLSAyKTtcclxuICAgICAgdmFyIGsgPSAwO1xyXG4gICAgICBmb3IgKHZhciBqID0gaTEyOyBqICE9IGkxMTsgaiA9IHBvbHkxLmdldE5leHRJKGopKSB7XHJcbiAgICAgICAgbmV3cG9seS5zZXRQb2ludChrLCBwb2x5MS5nZXRQb2ludChqKSk7XHJcbiAgICAgICAgaysrO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAodmFyIGogPSBpMjI7IGogIT0gaTIxOyBqID0gcG9seTIuZ2V0TmV4dEkoaikpIHtcclxuICAgICAgICBuZXdwb2x5LnNldFBvaW50KGssIHBvbHkyLmdldFBvaW50KGopKTtcclxuICAgICAgICBrKys7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzMSA+IG9iamVjdF8yX2luZGV4KSB7XHJcbiAgICAgICAgdHJpYW5nbGVzW3MxXSA9IG5ld3BvbHk7XHJcbiAgICAgICAgcG9seTEgPSB0cmlhbmdsZXNbczFdO1xyXG4gICAgICAgIHRyaWFuZ2xlcy5zcGxpY2Uob2JqZWN0XzJfaW5kZXgsIDEpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRyaWFuZ2xlcy5zcGxpY2Uob2JqZWN0XzJfaW5kZXgsIDEpO1xyXG4gICAgICAgIHRyaWFuZ2xlc1tzMV0gPSBuZXdwb2x5O1xyXG4gICAgICAgIHBvbHkxID0gdHJpYW5nbGVzW3MxXTtcclxuICAgICAgfVxyXG4gICAgICBpMTEgPSAtMTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHRyaWFuZ2xlcztcclxufTtcclxuXG59LHtcIi4vZ2VvbWV0cnlcIjo2LFwicG9seTJ0cmlcIjozfV0sMTA6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xudmFyIGdlbyA9IF9kZXJlcV8oJy4vZ2VvbWV0cnknKTtcclxudmFyIGZpbmRQb2x5Rm9yUG9pbnQgPSBnZW8udXRpbC5maW5kUG9seUZvclBvaW50O1xyXG52YXIgUHJpb3JpdHlRdWV1ZSA9IF9kZXJlcV8oJ3ByaW9yaXR5LXF1ZXVlJyk7XHJcblxyXG4vKipcclxuICogUGF0aGZpbmRlciBpbXBsZW1lbnRzIHBhdGhmaW5kaW5nIG9uIGEgbmF2aWdhdGlvbiBtZXNoLlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHBhcmFtIHtBcnJheS48UG9seT59IHBvbHlzIC0gVGhlIHBvbHlnb25zIGRlZmluaW5nIHRoZSBuYXZpZ2F0aW9uIG1lc2guXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2luaXQ9dHJ1ZV0gLSBXaGV0aGVyIG9yIG5vdCB0byBpbml0aWFsaXplIHRoZSBwYXRoZmluZGVyLlxyXG4gKi9cclxudmFyIFBhdGhmaW5kZXIgPSBmdW5jdGlvbihwb2x5cywgaW5pdCkge1xyXG4gIGlmICh0eXBlb2YgaW5pdCA9PSBcInVuZGVmaW5lZFwiKSBpbml0ID0gdHJ1ZTtcclxuICB0aGlzLnBvbHlzID0gcG9seXM7XHJcbiAgaWYgKGluaXQpIHtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH1cclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBQYXRoZmluZGVyO1xyXG5cclxuUGF0aGZpbmRlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuZ3JpZCA9IHRoaXMuZ2VuZXJhdGVBZGphY2VuY3lHcmlkKHRoaXMucG9seXMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGVzIHBhdGggZnJvbSBzb3VyY2UgdG8gdGFyZ2V0LCB1c2luZyBzaWRlcyBhbmQgY2VudGVycyBvZiB0aGUgZWRnZXNcclxuICogYmV0d2VlbiBhZGphY2VudCBwb2x5Z29ucy4gc291cmNlIGFuZCB0YXJnZXQgYXJlIFBvaW50cyBhbmQgcG9seXMgc2hvdWxkXHJcbiAqIGJlIHRoZSBmaW5hbCBwYXJ0aXRpb25lZCBtYXAuXHJcbiAqIEBwYXJhbSB7UG9pbnR9IHNvdXJjZSAtIFRoZSBzdGFydCBsb2NhdGlvbiBmb3IgdGhlIHNlYXJjaC5cclxuICogQHBhcmFtIHtQb2ludH0gdGFyZ2V0IC0gVGhlIHRhcmdldCBsb2NhdGlvbiBmb3IgdGhlIHNlYXJjaC5cclxuICogQHJldHVybiB7P0FycmF5LjxQb2ludD59IC0gQSBzZXJpZXMgb2YgcG9pbnRzIHJlcHJlc2VudGluZyB0aGUgcGF0aCBmcm9tXHJcbiAqICAgdGhlIHNvdXJjZSB0byB0aGUgdGFyZ2V0LiBJZiBhIHBhdGggaXMgbm90IGZvdW5kLCBgbnVsbGAgaXMgcmV0dXJuZWQuXHJcbiAqL1xyXG5QYXRoZmluZGVyLnByb3RvdHlwZS5hU3RhciA9IGZ1bmN0aW9uKHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgLy8gQ29tcGFyZXMgdGhlIHZhbHVlIG9mIHR3byBub2Rlcy5cclxuICBmdW5jdGlvbiBub2RlVmFsdWUobm9kZTEsIG5vZGUyKSB7XHJcbiAgICByZXR1cm4gKG5vZGUxLmRpc3QgKyBoZXVyaXN0aWMobm9kZTEucG9pbnQpKSAtIChub2RlMi5kaXN0ICsgaGV1cmlzdGljKG5vZGUyLnBvaW50KSk7XHJcbiAgfVxyXG5cclxuICAvLyBEaXN0YW5jZSBiZXR3ZWVuIHBvbHlnb25zLlxyXG4gIGZ1bmN0aW9uIGV1Y2xpZGVhbkRpc3RhbmNlKHAxLCBwMikge1xyXG4gICAgcmV0dXJuIHAxLmRpc3QocDIpO1xyXG4gIH1cclxuXHJcbiAgLy8gRGlzdGFuY2UgYmV0d2VlbiBwb2x5Z29ucy4gdG9kbzogdXBkYXRlXHJcbiAgZnVuY3Rpb24gbWFuaGF0dGFuRGlzdGFuY2UoZWx0MSwgZWx0Mikge1xyXG4gICAgcmV0dXJuIChlbHQxLnIgLSBlbHQyLnIpICsgKGVsdDEuYyAtIGVsdDIuYyk7XHJcbiAgfVxyXG5cclxuICAvLyBUYWtlcyBQb2ludCBhbmQgcmV0dXJucyB2YWx1ZS5cclxuICBmdW5jdGlvbiBoZXVyaXN0aWMocCkge1xyXG4gICAgcmV0dXJuIGV1Y2xpZGVhbkRpc3RhbmNlKHAsIHRhcmdldCk7XHJcbiAgfVxyXG5cclxuICB2YXIgc291cmNlUG9seSA9IGZpbmRQb2x5Rm9yUG9pbnQoc291cmNlLCB0aGlzLnBvbHlzKTtcclxuXHJcbiAgLy8gV2UncmUgb3V0c2lkZSBvZiB0aGUgbWVzaCBzb21laG93LiBUcnkgYSBmZXcgbmVhcmJ5IHBvaW50cy5cclxuICBpZiAoIXNvdXJjZVBvbHkpIHtcclxuICAgIHZhciBvZmZzZXRTb3VyY2UgPSBbbmV3IFBvaW50KDUsIDApLCBuZXcgUG9pbnQoLTUsIDApLCBuZXcgUG9pbnQoMCwgLTUpLCBuZXcgUG9pbnQoMCwgNSldO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvZmZzZXRTb3VyY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgLy8gTWFrZSBuZXcgcG9pbnQuXHJcbiAgICAgIHZhciBwb2ludCA9IHNvdXJjZS5hZGQob2Zmc2V0U291cmNlW2ldKTtcclxuICAgICAgc291cmNlUG9seSA9IGZpbmRQb2x5Rm9yUG9pbnQocG9pbnQsIHRoaXMucG9seXMpO1xyXG4gICAgICBpZiAoc291cmNlUG9seSkge1xyXG4gICAgICAgIHNvdXJjZSA9IHBvaW50O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIXNvdXJjZVBvbHkpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHZhciB0YXJnZXRQb2x5ID0gZmluZFBvbHlGb3JQb2ludCh0YXJnZXQsIHRoaXMucG9seXMpO1xyXG5cclxuICAvLyBIYW5kbGUgdHJpdmlhbCBjYXNlLlxyXG4gIGlmIChzb3VyY2VQb2x5ID09IHRhcmdldFBvbHkpIHtcclxuICAgIHJldHVybiBbc291cmNlLCB0YXJnZXRdO1xyXG4gIH1cclxuXHJcbiAgLy8gV2FybmluZywgbWF5IGhhdmUgY29tcGF0aWJpbGl0eSBpc3N1ZXMuXHJcbiAgdmFyIGRpc2NvdmVyZWRQb2x5cyA9IG5ldyBXZWFrU2V0KCk7XHJcbiAgdmFyIGRpc2NvdmVyZWRQb2ludHMgPSBuZXcgV2Vha1NldCgpO1xyXG4gIHZhciBwcSA9IG5ldyBQcmlvcml0eVF1ZXVlKHsgY29tcGFyYXRvcjogbm9kZVZhbHVlIH0pO1xyXG4gIHZhciBmb3VuZCA9IG51bGw7XHJcbiAgLy8gSW5pdGlhbGl6ZSB3aXRoIHN0YXJ0IGxvY2F0aW9uLlxyXG4gIHBxLnF1ZXVlKHtkaXN0OiAwLCBwb2x5OiBzb3VyY2VQb2x5LCBwb2ludDogc291cmNlLCBwYXJlbnQ6IG51bGx9KTtcclxuICB3aGlsZSAocHEubGVuZ3RoID4gMCkge1xyXG4gICAgdmFyIG5vZGUgPSBwcS5kZXF1ZXVlKCk7XHJcbiAgICBpZiAobm9kZS5wb2x5ID09IHRhcmdldFBvbHkpIHtcclxuICAgICAgZm91bmQgPSBub2RlO1xyXG4gICAgICBicmVhaztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRpc2NvdmVyZWRQb2x5cy5hZGQobm9kZS5wb2x5KTtcclxuICAgICAgZGlzY292ZXJlZFBvaW50cy5hZGQobm9kZS5wb2ludCk7XHJcbiAgICB9XHJcbiAgICAvLyBUaGlzIG1heSBiZSB1bmRlZmluZWQgaWYgdGhlcmUgd2FzIG5vIHBvbHlnb24gZm91bmQuXHJcbiAgICB2YXIgbmVpZ2hib3JzID0gdGhpcy5ncmlkLmdldChub2RlLnBvbHkpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGVsdCA9IG5laWdoYm9yc1tpXTtcclxuICAgICAgdmFyIG5laWdoYm9yRm91bmQgPSBkaXNjb3ZlcmVkUG9seXMuaGFzKGVsdC5wb2x5KTtcclxuXHJcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZWx0LmVkZ2UucG9pbnRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgdmFyIHAgPSBlbHQuZWRnZS5wb2ludHNbal07XHJcbiAgICAgICAgaWYgKCFuZWlnaGJvckZvdW5kIHx8ICFkaXNjb3ZlcmVkUG9pbnRzLmhhcyhwKSlcclxuICAgICAgICAgIHBxLnF1ZXVlKHtkaXN0OiBub2RlLmRpc3QgKyBldWNsaWRlYW5EaXN0YW5jZShwLCBub2RlLnBvaW50KSwgcG9seTogZWx0LnBvbHksIHBvaW50OiBwLCBwYXJlbnQ6IG5vZGV9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGZvdW5kKSB7XHJcbiAgICB2YXIgcGF0aCA9IFtdO1xyXG4gICAgdmFyIGN1cnJlbnQgPSBmb3VuZDtcclxuICAgIHdoaWxlIChjdXJyZW50LnBhcmVudCkge1xyXG4gICAgICBwYXRoLnVuc2hpZnQoY3VycmVudC5wb2ludCk7XHJcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcclxuICAgIH1cclxuICAgIHBhdGgudW5zaGlmdChjdXJyZW50LnBvaW50KTtcclxuICAgIC8vIEFkZCBlbmQgcG9pbnQgdG8gcGF0aC5cclxuICAgIHBhdGgucHVzaCh0YXJnZXQpO1xyXG4gICAgcmV0dXJuIHBhdGg7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBIb2xkcyB0aGUgXCJuZWlnaGJvclwiIHJlbGF0aW9uc2hpcCBvZiBQb2x5IG9iamVjdHMgaW4gdGhlIHBhcnRpdGlvblxyXG4gKiB1c2luZyB0aGUgUG9seSdzIHRoZW1zZWx2ZXMgYXMga2V5cywgYW5kIGFuIGFycmF5IG9mIFBvbHkncyBhc1xyXG4gKiB2YWx1ZXMsIHdoZXJlIHRoZSBQb2x5cyBpbiB0aGUgYXJyYXkgYXJlIG5laWdoYm9ycyBvZiB0aGUgUG9seVxyXG4gKiB0aGF0IHdhcyB0aGUga2V5LlxyXG4gKiBAdHlwZWRlZiBBZGphY2VuY3lHcmlkXHJcbiAqIEB0eXBlIHtPYmplY3QuPFBvbHksIEFycmF5PFBvbHk+Pn1cclxuICovXHJcblxyXG4vKipcclxuICogR2l2ZW4gYW4gYXJyYXkgb2YgUG9seSBvYmplY3RzLCBmaW5kIGFsbCBuZWlnaGJvcmluZyBwb2x5Z29ucyBmb3JcclxuICogZWFjaCBwb2x5Z29uLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gcG9seXMgLSBUaGUgYXJyYXkgb2YgcG9seXMgdG8gZmluZCBuZWlnaGJvcnNcclxuICogICBhbW9uZy5cclxuICogQHJldHVybiB7QWRqYWNlbmN5R3JpZH0gLSBUaGUgXCJuZWlnaGJvclwiIHJlbGF0aW9uc2hpcHMuXHJcbiAqL1xyXG5QYXRoZmluZGVyLnByb3RvdHlwZS5nZW5lcmF0ZUFkamFjZW5jeUdyaWQgPSBmdW5jdGlvbihwb2x5cykge1xyXG4gIHZhciBuZWlnaGJvcnMgPSBuZXcgV2Vha01hcCgpO1xyXG4gIHBvbHlzLmZvckVhY2goZnVuY3Rpb24ocG9seSwgcG9seUksIHBvbHlzKSB7XHJcbiAgICBpZiAobmVpZ2hib3JzLmhhcyhwb2x5KSkge1xyXG4gICAgICAvLyBNYXhpbXVtIG51bWJlciBvZiBuZWlnaGJvcnMgYWxyZWFkeSBmb3VuZC5cclxuICAgICAgaWYgKG5laWdoYm9ycy5nZXQocG9seSkubGVuZ3RoID09IHBvbHkubnVtcG9pbnRzKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBJbml0aWFsaXplIGFycmF5LlxyXG4gICAgICBuZWlnaGJvcnMuc2V0KHBvbHksIG5ldyBBcnJheSgpKTtcclxuICAgIH1cclxuICAgIC8vIE9mIHJlbWFpbmluZyBwb2x5Z29ucywgZmluZCBzb21lIHRoYXQgYXJlIGFkamFjZW50LlxyXG4gICAgcG9seS5wb2ludHMuZm9yRWFjaChmdW5jdGlvbihwMSwgaSwgcG9pbnRzKSB7XHJcbiAgICAgIC8vIE5leHQgcG9pbnQuXHJcbiAgICAgIHZhciBwMiA9IHBvaW50c1twb2x5LmdldE5leHRJKGkpXTtcclxuICAgICAgZm9yICh2YXIgcG9seUogPSBwb2x5SSArIDE7IHBvbHlKIDwgcG9seXMubGVuZ3RoOyBwb2x5SisrKSB7XHJcbiAgICAgICAgdmFyIHBvbHkyID0gcG9seXNbcG9seUpdO1xyXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBwb2ludHMgdW50aWwgbWF0Y2ggaXMgZm91bmQuXHJcbiAgICAgICAgcG9seTIucG9pbnRzLnNvbWUoZnVuY3Rpb24ocTEsIGosIHBvaW50czIpIHtcclxuICAgICAgICAgIHZhciBxMiA9IHBvaW50czJbcG9seTIuZ2V0TmV4dEkoaildO1xyXG4gICAgICAgICAgdmFyIG1hdGNoID0gcDEuZXEocTIpICYmIHAyLmVxKHExKTtcclxuICAgICAgICAgIGlmIChtYXRjaCkge1xyXG4gICAgICAgICAgICB2YXIgZWRnZSA9IG5ldyBFZGdlKHAxLCBwMik7XHJcbiAgICAgICAgICAgIG5laWdoYm9ycy5nZXQocG9seSkucHVzaCh7IHBvbHk6IHBvbHkyLCBlZGdlOiBlZGdlIH0pO1xyXG4gICAgICAgICAgICBpZiAoIW5laWdoYm9ycy5oYXMocG9seTIpKSB7XHJcbiAgICAgICAgICAgICAgbmVpZ2hib3JzLnNldChwb2x5MiwgbmV3IEFycmF5KCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5laWdoYm9ycy5nZXQocG9seTIpLnB1c2goeyBwb2x5OiBwb2x5LCBlZGdlOiBlZGdlIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChuZWlnaGJvcnMuZ2V0KHBvbHkpLmxlbmd0aCA9PSBwb2x5Lm51bXBvaW50cykgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiBuZWlnaGJvcnM7XHJcbn07XHJcblxufSx7XCIuL2dlb21ldHJ5XCI6NixcInByaW9yaXR5LXF1ZXVlXCI6NH1dfSx7fSxbN10pKDcpXG59KTsiLCJ2YXIgTmF2TWVzaCA9IHJlcXVpcmUoJ3RhZ3Byby1uYXZtZXNoJyk7XHJcblxyXG52YXIgQnJhaW4gPSByZXF1aXJlKCcuL2JyYWluJyk7XHJcbnZhciBEcmF3VXRpbHMgPSByZXF1aXJlKCcuL2RyYXd1dGlscycpO1xyXG52YXIgZ2VvID0gcmVxdWlyZSgnLi9nZW9tZXRyeScpO1xyXG5cclxuLyoqXHJcbiAqIEEgQm90IGlzIHJlc3BvbnNpYmxlIGZvciBkZWNpc2lvbiBtYWtpbmcsIG5hdmlnYXRpb24gKHdpdGggdGhlIGFpZFxyXG4gKiBvZiBtYXAtcmVsYXRlZCBtb2R1bGVzKSBhbmQgbG93LWxldmVsIHN0ZWVyaW5nL2xvY29tb3Rpb24uXHJcbiAqIEBleHBvcnRzIEJvdFxyXG4gKi9cclxuLy8gQWxpYXMgdXNlZnVsIGNsYXNzZXMuXHJcbnZhciBQb2ludCA9IGdlby5Qb2ludDtcclxudmFyIFBvbHkgPSBnZW8uUG9seTtcclxudmFyIFBvbHlVdGlscyA9IGdlby51dGlsO1xyXG5cclxudmFyIFN0YW5jZSA9IHtcclxuICBvZmZlbnNlOiAwLFxyXG4gIGRlZmVuc2U6IDFcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQG5hbWUgQm90XHJcbiAqIEBwYXJhbSB7fSBzdGF0ZVxyXG4gKiBAcGFyYW0ge30gbW92ZXJcclxuICogQHBhcmFtIHtMb2dnZXJ9IFtsb2dnZXJdXHJcbiAqL1xyXG52YXIgQm90ID0gZnVuY3Rpb24oc3RhdGUsIG1vdmVyLCBsb2dnZXIpIHtcclxuICBpZiAodHlwZW9mIGxvZ2dlciA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgbG9nZ2VyID0ge307XHJcbiAgICBsb2dnZXIubG9nID0gZnVuY3Rpb24oKSB7fTtcclxuICB9XHJcbiAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcblxyXG4gIC8vIEhvbGRzIGludGVydmFsIGlkcy5cclxuICB0aGlzLmFjdGlvbnMgPSB7fTtcclxuXHJcbiAgLy8gSG9sZCBlbnZpcm9ubWVudC1zcGVjaWZpYyBtb3ZlbWVudCBhbmQgZ2FtZSBzdGF0ZSBvYmplY3RzLlxyXG4gIHRoaXMubW92ZSA9IG1vdmVyLm1vdmUuYmluZChtb3Zlcik7XHJcbiAgdGhpcy5nYW1lID0gc3RhdGU7XHJcblxyXG4gIHRoaXMuc3RhbmNlID0gU3RhbmNlLm9mZmVuc2U7XHJcblxyXG4gIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICB0aGlzLm1hcEluaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgdGhpcy5pbml0KCk7XHJcblxyXG4gIHRoaXMuYnJhaW4gPSBuZXcgQnJhaW4odGhpcyk7XHJcblxyXG4gIHNldFRpbWVvdXQodGhpcy5fcHJvY2Vzc01hcC5iaW5kKHRoaXMpLCA1MCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJvdDtcclxuXHJcbi8vIEluaXRpYWxpemUgZnVuY3Rpb25hbGl0eSBkZXBlbmRlbnQgb24gdGFncHJvIHByb3Zpc2lvbmluZyBwbGF5ZXJJZC5cclxuQm90LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5sb2dnZXIubG9nKFwiYm90XCIsIFwiSW5pdGlhbGl6aW5nIEJvdC5cIik7XHJcbiAgLy8gRW5zdXJlIHRoYXQgdGhlIHRhZ3BybyBnbG9iYWwgb2JqZWN0IGhhcyBpbml0aWFsaXplZCBhbmQgYWxsb2NhdGVkIHVzIGFuIGlkLlxyXG4gIGlmICghdGhpcy5nYW1lLmluaXRpYWxpemVkKCkpIHtyZXR1cm4gc2V0VGltZW91dCh0aGlzLmluaXQuYmluZCh0aGlzKSwgMjUwKTt9XHJcblxyXG4gIC8vIFNlbGYgaXMgdGhlIFRhZ1BybyBwbGF5ZXIgb2JqZWN0LlxyXG4gIHRoaXMuc2VsZiA9IHRoaXMuZ2FtZS5wbGF5ZXIoKTtcclxuXHJcbiAgLy8gU2Vuc2VkIGtlZXBzIHRyYWNrIG9mIHNlbnNlZCBzdGF0ZXMuXHJcbiAgdGhpcy5zZW5zZWQgPSB7XHJcbiAgICBkZWFkOiBmYWxzZVxyXG4gIH07XHJcblxyXG4gIHRoaXMubG9nZ2VyLmxvZyhcImJvdFwiLCBcIkJvdCBsb2FkZWQuXCIpOyAvLyBERUJVR1xyXG4gIFxyXG4gIHRoaXMuX2luaXRpYWxpemVQYXJhbWV0ZXJzKCk7XHJcblxyXG4gIC8vIFNldCB1cCBkcmF3aW5nLlxyXG4gIHRoaXMuZHJhdyA9IG5ldyBEcmF3VXRpbHMoKTtcclxuXHJcbiAgLy8gUmVnaXN0ZXIgaXRlbXMgdG8gZHJhdy5cclxuICB0aGlzLmRyYXcuYWRkVmVjdG9yKFwic2Vla1wiLCAweDAwZmYwMCk7XHJcbiAgdGhpcy5kcmF3LmFkZFZlY3RvcihcImF2b2lkXCIsIDB4ZmYwMDAwKTtcclxuICB0aGlzLmRyYXcuYWRkVmVjdG9yKFwiZGVzaXJlZFwiLCAweDAwMDBmZik7XHJcbiAgdGhpcy5kcmF3LmFkZEJhY2tncm91bmQoXCJtZXNoXCIsIDB4NTU1NTU1KTtcclxuICB0aGlzLmRyYXcuYWRkUG9pbnQoXCJnb2FsXCIsIDB4MDBmZjAwLCBcImZvcmVncm91bmRcIik7XHJcbiAgdGhpcy5kcmF3LmFkZFBvaW50KFwiaGl0XCIsIDB4ZmYwMDAwLCBcImZvcmVncm91bmRcIik7XHJcblxyXG4gIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlIGZ1bmN0aW9uIHRoYXQgZHJpdmVzIHRoZSByZXN0IG9mIHRoZSBvbmdvaW5nIGJvdCBiZWhhdmlvci5cclxuICovXHJcbkJvdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5icmFpbi5wcm9jZXNzKCk7XHJcbiAgdGhpcy5fbW92ZSgpO1xyXG4gIC8vIFNlbnNlIGFueSByZWFsLXRpbWUsIGJpZy1pbXBsaWNhdGlvbiBlbnZpcm9ubWVudCBhY3Rpb25zIGFuZFxyXG4gIC8vIHNlbmQgdG8gYnJhaW4uXHJcbiAgdGhpcy5fc2Vuc2UoKTtcclxufTtcclxuXHJcbkJvdC5wcm90b3R5cGUuYXR0YWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5zdGFuY2UgPSBTdGFuY2Uub2ZmZW5zZTtcclxufTtcclxuXHJcbkJvdC5wcm90b3R5cGUuZGVmZW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5zdGFuY2UgPSBTdGFuY2UuZGVmZW5zZTtcclxufTtcclxuXHJcbkJvdC5wcm90b3R5cGUuaXNPZmZlbnNlID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuc3RhbmNlID09IFN0YW5jZS5vZmZlbnNlO1xyXG59O1xyXG5cclxuQm90LnByb3RvdHlwZS5pc0RlZmVuc2UgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5zdGFuY2UgPT0gU3RhbmNlLmRlZmVuc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogU2Vuc2UgZW52aXJvbm1lbnQgY2hhbmdlcyBhbmQgc2VuZCBtZXNzYWdlcyB0byBicmFpbiBpZiBuZWVkZWQuXHJcbiAqL1xyXG5Cb3QucHJvdG90eXBlLl9zZW5zZSA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIE5ld2x5IGRlYWQuXHJcbiAgaWYgKHRoaXMuc2VsZi5kZWFkICYmICF0aGlzLnNlbnNlZC5kZWFkKSB7XHJcbiAgICB0aGlzLnNlbnNlZC5kZWFkID0gdHJ1ZTtcclxuICAgIHRoaXMuYnJhaW4uaGFuZGxlTWVzc2FnZShcImRlYWRcIik7XHJcbiAgfVxyXG4gIC8vIE5ld2x5IGxpdmluZy5cclxuICBpZiAodGhpcy5zZW5zZWQuZGVhZCAmJiAhdGhpcy5zZWxmLmRlYWQpIHtcclxuICAgIHRoaXMuc2Vuc2VkLmRlYWQgPSBmYWxzZTtcclxuICAgIHRoaXMuYnJhaW4uaGFuZGxlTWVzc2FnZShcImFsaXZlXCIpO1xyXG4gIH1cclxuICBpZiAodGhpcy5sYXN0X3N0YW5jZSAmJiB0aGlzLmxhc3Rfc3RhbmNlICE9PSB0aGlzLnN0YW5jZSkge1xyXG4gICAgdGhpcy5icmFpbi5oYW5kbGVNZXNzYWdlKFwic3RhbmNlQ2hhbmdlXCIpO1xyXG4gIH1cclxuICB0aGlzLmxhc3Rfc3RhbmNlID0gdGhpcy5zdGFuY2U7XHJcbiAgaWYgKHRoaXMubmF2VXBkYXRlKSB7XHJcbiAgICB0aGlzLmJyYWluLmhhbmRsZU1lc3NhZ2UoXCJuYXZVcGRhdGVcIik7XHJcbiAgICB0aGlzLm5hdlVwZGF0ZSA9IGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIERvIG1vdmVtZW50cy5cclxuQm90LnByb3RvdHlwZS5fbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLmdvYWwpIHtcclxuICAgIHRoaXMubmF2aWdhdGUoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5hbGxVcCgpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXRzIHRoZSBnaXZlbiBwb2ludCBhcyB0aGUgdGFyZ2V0IGZvciB0aGUgYm90IHRvIG5hdmlnYXRlIHRvLlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwb2ludCAtIFRoZSBwb2ludCB0byBuYXZpZ2F0ZSB0by5cclxuICovXHJcbkJvdC5wcm90b3R5cGUuc2V0VGFyZ2V0ID0gZnVuY3Rpb24ocG9pbnQpIHtcclxuICB0aGlzLmdvYWwgPSBwb2ludDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIHRoZSBwYXJhbWV0ZXJzIGZvciB0aGUgdmFyaW91cyB2YXJpYWJsZSBmdW5jdGlvbnMgb2ZcclxuICogdGhlIGJvdC5cclxuICogQHByaXZhdGVcclxuICovXHJcbkJvdC5wcm90b3R5cGUuX2luaXRpYWxpemVQYXJhbWV0ZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5wYXJhbWV0ZXJzID0ge307XHJcbiAgXHJcbiAgLy8gSG9sZHMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGdhbWUgcGh5c2ljcyBwYXJhbWV0ZXJzLlxyXG4gIHRoaXMucGFyYW1ldGVycy5nYW1lID0ge1xyXG4gICAgc3RlcDogMWUzIC8gNjAsIC8vIFBoeXNpY3Mgc3RlcCBzaXplIGluIG1zLlxyXG4gICAgcmFkaXVzOiB7XHJcbiAgICAgIHNwaWtlOiAxNCxcclxuICAgICAgYmFsbDogMTlcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvLyBIb2xkcyBpbnRlcnZhbCB1cGRhdGUgdGltZXJzLlxyXG4gIHRoaXMucGFyYW1ldGVycy5pbnRlcnZhbHMgPSB7XHJcbiAgICBnYW1lOiAxMDAwLFxyXG4gICAgbmF2aWdhdGU6IDEwLFxyXG4gICAgZ29hbDogMTBcclxuICB9O1xyXG5cclxuICAvLyBIb2xkIHN0ZWVyaW5nIHBhcmFtZXRlcnMuXHJcbiAgdGhpcy5wYXJhbWV0ZXJzLnN0ZWVyaW5nID0ge307XHJcbiAgdGhpcy5wYXJhbWV0ZXJzLnN0ZWVyaW5nW1wic2Vla1wiXSA9IHtcclxuICAgIG1heF9zZWVfYWhlYWQ6IHRoaXMucGFyYW1ldGVycy5pbnRlcnZhbHMubmF2aWdhdGVcclxuICB9O1xyXG5cclxuICB0aGlzLnBhcmFtZXRlcnMuc3RlZXJpbmdbXCJhdm9pZFwiXSA9IHtcclxuICAgIG1heF9zZWVfYWhlYWQ6IDJlMywgLy8gVGltZSBpbiBtcyB0byBsb29rIGFoZWFkIGZvciBhIGNvbGxpc2lvbi5cclxuICAgIG1heF9hdm9pZF9mb3JjZTogMzUsXHJcbiAgICBidWZmZXI6IDI1LFxyXG4gICAgc3Bpa2VfaW50ZXJzZWN0aW9uX3JhZGl1czogdGhpcy5wYXJhbWV0ZXJzLmdhbWUucmFkaXVzLnNwaWtlICsgdGhpcy5wYXJhbWV0ZXJzLmdhbWUucmFkaXVzLmJhbGxcclxuICB9O1xyXG5cclxuICB0aGlzLnBhcmFtZXRlcnMuc3RlZXJpbmdbXCJ1cGRhdGVcIl0gPSB7XHJcbiAgICBhY3Rpb25fdGhyZXNob2xkOiAwLjAxLFxyXG4gICAgdG9wX3NwZWVkX3RocmVzaG9sZDogMC4xLFxyXG4gICAgY3VycmVudF92ZWN0b3I6IDBcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICogUHJvY2VzcyBtYXAgYW5kIGdlbmVyYXRlIG5hdmlnYXRpb24gbWVzaC5cclxuICogQHByaXZhdGVcclxuICovXHJcbkJvdC5wcm90b3R5cGUuX3Byb2Nlc3NNYXAgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgbWFwID0gdGhpcy5nYW1lLm1hcCgpO1xyXG4gIGlmICghbWFwKSB7XHJcbiAgICBzZXRUaW1lb3V0KHRoaXMucHJvY2Vzc01hcC5iaW5kKHRoaXMpLCAyNTApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLm5hdm1lc2ggPSBuZXcgTmF2TWVzaChtYXAsIHRoaXMubG9nZ2VyKTtcclxuXHJcbiAgICAvLyBXaGV0aGVyIHRoZSBuYXZpZ2F0aW9uIG1lc2ggaGFzIGJlZW4gdXBkYXRlZC5cclxuICAgIHRoaXMubmF2VXBkYXRlID0gZmFsc2U7XHJcblxyXG4gICAgLy8gVXBkYXRlIG5hdmlnYXRpb24gbWVzaCB2aXN1YWxpemF0aW9uIGFuZCBzZXQgZmxhZyBmb3JcclxuICAgIC8vIHNlbnNlIGZ1bmN0aW9uIHRvIHBhc3MgbWVzc2FnZSB0byBicmFpbi5cclxuICAgIHRoaXMubmF2bWVzaC5vblVwZGF0ZShmdW5jdGlvbihwb2x5cykge1xyXG4gICAgICB0aGlzLmRyYXcudXBkYXRlQmFja2dyb3VuZChcIm1lc2hcIiwgcG9seXMpO1xyXG4gICAgICB0aGlzLmxvZ2dlci5sb2coXCJib3RcIiwgXCJOYXZtZXNoIHVwZGF0ZWQuXCIpO1xyXG4gICAgICB0aGlzLm5hdlVwZGF0ZSA9IHRydWU7XHJcbiAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgIC8vIEFkZCB0aWxlIGlkIG9mIG9wcG9zaXRlIHRlYW0gdGlsZSB0byBuYXZtZXNoIGltcGFzc2FibGVcclxuICAgIGlmICh0aGlzLmdhbWUudGVhbSgpID09IHRoaXMuZ2FtZS5UZWFtcy5yZWQpIHtcclxuICAgICAgLy8gQmx1ZSBnYXRlIGFuZCByZWQgc3BlZWRwYWQuXHJcbiAgICAgIHRoaXMubmF2bWVzaC5zZXRJbXBhc3NhYmxlKFs5LjMsIDE0XSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBSZWQgZ2F0ZSBhbmQgYmx1ZSBzcGVlZHBhZC5cclxuICAgICAgdGhpcy5uYXZtZXNoLnNldEltcGFzc2FibGUoWzkuMiwgMTVdKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTZXQgbWFwVXBkYXRlIGZ1bmN0aW9uIG9mIG5hdm1lc2ggYXMgdGhlIGNhbGxiYWNrIHRvIHRoZSB0YWdwcm9cclxuICAgIC8vIG1hcHVwZGF0ZSBwYWNrZXRzLlxyXG4gICAgdGhpcy5uYXZtZXNoLmxpc3Rlbih0aGlzLmdhbWUudGFncHJvLnNvY2tldCk7XHJcblxyXG4gICAgdGhpcy5kcmF3LnVwZGF0ZUJhY2tncm91bmQoXCJtZXNoXCIsIHRoaXMubmF2bWVzaC5wb2x5cyk7XHJcbiAgICB0aGlzLmxvZ2dlci5sb2coXCJib3RcIiwgXCJOYXZtZXNoIGNvbnN0cnVjdGVkLlwiKTtcclxuXHJcbiAgICB0aGlzLm1hcEluaXRpYWxpemVkID0gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbi8vIFN0b3BzIHRoZSBib3QuIFNldHMgdGhlIHN0b3AgYWN0aW9uIHdoaWNoIGFsbCBtZXRob2RzIG5lZWQgdG8gY2hlY2sgZm9yLCBhbmQgYWxzb1xyXG4vLyBlbnN1cmVzIHRoZSBib3Qgc3RheXMgc3RpbGwgKGlzaCkuXHJcbkJvdC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMubG9nZ2VyLmxvZyhcImJvdFwiLCBcIlN0b3BwaW5nIGJvdC5cIik7XHJcbiAgdGhpcy5zdG9wcGVkID0gdHJ1ZTtcclxuICB0aGlzLmdvYWwgPSBmYWxzZTtcclxuICB0aGlzLl9jbGVhckludGVydmFsKFwidGhpbmtcIik7XHJcbiAgdGhpcy5fY2xlYXJJbnRlcnZhbChcInVwZGF0ZVwiKTtcclxuXHJcbiAgLy8gU3RvcCB0aGlua2luZy5cclxuICB0aGlzLmJyYWluLnRlcm1pbmF0ZSgpO1xyXG5cclxuICAvLyBTdG9wIG1vdmluZy5cclxuICB0aGlzLmFsbFVwKCk7XHJcbiAgdGhpcy5fcmVtb3ZlRHJhdygpO1xyXG59XHJcblxyXG4vLyBSZXN0YXJ0cyB0aGUgYm90LlxyXG5Cb3QucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gRG9uJ3QgZXhlY3V0ZSBpZiBib3Qgb3IgbWFwIGlzbid0IGluaXRpYWxpemVkLlxyXG4gIGlmICghdGhpcy5pbml0aWFsaXplZCB8fCAhdGhpcy5tYXBJbml0aWFsaXplZCkge1xyXG4gICAgdGhpcy5sb2dnZXIubG9nKFwiYm90OmluZm9cIiwgXCJCb3Qgbm90IGluaXRpYWxpemVkLiBDYW5jZWxsaW5nIHN0YXJ0LlwiKTtcclxuICAgIHJldHVybjtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5sb2dnZXIubG9nKFwiYm90OmluZm9cIiwgXCJTdGFydGluZyBib3QuXCIpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5zdG9wcGVkID0gZmFsc2U7XHJcbiAgdGhpcy5icmFpbi50aGluaygpO1xyXG4gIHRoaXMuX3NldEludGVydmFsKFwidGhpbmtcIiwgdGhpcy5icmFpbi50aGluay5iaW5kKHRoaXMuYnJhaW4pLCA1MDApO1xyXG4gIHRoaXMuX3NldEludGVydmFsKFwidXBkYXRlXCIsIHRoaXMudXBkYXRlLCAyMCk7XHJcbiAgdGhpcy5kcmF3LnNob3dWZWN0b3IoXCJzZWVrXCIpO1xyXG4gIHRoaXMuZHJhdy5zaG93VmVjdG9yKFwiYXZvaWRcIik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZXMgYSBwYXRoLCBhc3N1bWluZyB0aGUgZW5kIHRhcmdldCBpcyBzdGF0aWMuXHJcbiAqL1xyXG5Cb3QucHJvdG90eXBlLm5hdmlnYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gRG9uJ3QgZXhlY3V0ZSBmdW5jdGlvbiBpZiBib3QgaXMgc3RvcHBlZC5cclxuICBpZiAodGhpcy5zdG9wcGVkKSByZXR1cm47XHJcblxyXG4gIHZhciBkZXNpcmVkX3ZlY3RvciA9IHRoaXMuX3N0ZWVyaW5nKDMyKTtcclxuICB0aGlzLmRyYXcudXBkYXRlVmVjdG9yKFwiZGVzaXJlZFwiLCBkZXNpcmVkX3ZlY3Rvci5tdWwoMTApKTtcclxuICAvLyBBcHBseSBkZXNpcmVkIHZlY3RvciBhZnRlciBhIHNob3J0IGRlbGF5LlxyXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoIXRoaXMuc3RvcHBlZCkge1xyXG4gICAgICB0aGlzLl91cGRhdGUoZGVzaXJlZF92ZWN0b3IubXVsKDIpKTtcclxuICAgIH1cclxuICB9LmJpbmQodGhpcyksIDApO1xyXG59XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtudW1iZXJ9IG4gLSBUaGUgbnVtYmVyIG9mIHZlY3RvcnMgdG8gY29uc2lkZXIuXHJcbiAqL1xyXG5Cb3QucHJvdG90eXBlLl9zdGVlcmluZyA9IGZ1bmN0aW9uKG4pIHtcclxuICBpZiAodHlwZW9mIG4gPT0gJ3VuZGVmaW5lZCcpIG4gPSA4O1xyXG4gIC8vIEdlbmVyYXRlIHZlY3RvcnMuXHJcbiAgdmFyIGFuZ2xlID0gMiAqIE1hdGguUEkgLyBuO1xyXG4gIHZhciB2ZWN0b3JzID0gW107XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcclxuICAgIHZlY3RvcnMucHVzaChuZXcgUG9pbnQoTWF0aC5jb3MoYW5nbGUgKiBpKSwgTWF0aC5zaW4oYW5nbGUgKiBpKSkpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIGNvc3RzLlxyXG4gIHZhciBjb3N0cyA9IFtdO1xyXG4gIGNvc3RzLnB1c2godGhpcy5faW52X0F2b2lkKHZlY3RvcnMpKTtcclxuICBjb3N0cy5wdXNoKHRoaXMuX2ludl9TZWVrKHZlY3RvcnMpKTtcclxuXHJcbiAgLy8gRG8gc2VsZWN0aW9uLlxyXG4gIHZhciBoZXVyaXN0aWMgPSBmdW5jdGlvbihjb3N0cykge1xyXG4gICAgdmFyIHcgPSAxO1xyXG4gICAgdmFyIHN1bW1lZENvc3RzID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvc3RzWzBdLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHN1bW1lZENvc3RzW2ldID0gMDtcclxuICAgIH1cclxuICAgIHN1bW1lZENvc3RzID0gY29zdHMucmVkdWNlKGZ1bmN0aW9uKHN1bW1lZCwgY29zdCkge1xyXG4gICAgICByZXR1cm4gc3VtbWVkLm1hcChmdW5jdGlvbihzdW0sIGkpIHtcclxuICAgICAgICByZXR1cm4gc3VtICsgY29zdFtpXTtcclxuICAgICAgfSk7XHJcbiAgICB9LCBzdW1tZWRDb3N0cyk7XHJcbiAgICB2YXIgbWluID0gc3VtbWVkQ29zdHNbMF07XHJcbiAgICB2YXIgaWR4ID0gMDtcclxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgc3VtbWVkQ29zdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKHN1bW1lZENvc3RzW2ldIDwgbWluKSB7XHJcbiAgICAgICAgbWluID0gc3VtbWVkQ29zdHNbaV07XHJcbiAgICAgICAgaWR4ID0gaTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlkeDtcclxuICB9XHJcblxyXG4gIHZhciBpZHggPSBoZXVyaXN0aWMoY29zdHMpO1xyXG4gIHJldHVybiB2ZWN0b3JzW2lkeF07XHJcbn1cclxuXHJcbi8vIFRha2VzIGluIHZlY3RvcnMsIGFzc29jaWF0ZXMgY29zdCB3aXRoIGVhY2guXHJcbi8vIFJldHVybnMgdmVjdG9yIG9mIGNvc3RzLlxyXG5Cb3QucHJvdG90eXBlLl9pbnZfQXZvaWQgPSBmdW5jdGlvbih2ZWN0b3JzKSB7XHJcbiAgdmFyIGNvc3RzID0gdmVjdG9ycy5tYXAoZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gMDtcclxuICB9KTtcclxuXHJcbiAgdmFyIEJBTExfRElBTUVURVIgPSAzODtcclxuICAvLyBGb3IgZGV0ZXJtaW5pbmcgaW50ZXJzZWN0aW9uIGFuZCBjb3N0IG9mIGRpc3RhbmNlLlxyXG4gIHZhciBTUElLRV9JTlRFUlNFQ1RJT05fUkFESVVTID0gNTU7XHJcbiAgLy8gRm9yIGRldGVybWluaW5nIGhvdyBtYW55IG1zIHRvIGxvb2sgYWhlYWQgZm9yIHRoZSBsb2NhdGlvbiB0byB1c2VcclxuICAvLyBhcyB0aGUgYmFzaXMgZm9yIHNlZWluZyB0aGUgaW1wYWN0IGEgZGlyZWN0aW9uIHdpbGwgaGF2ZS5cclxuICB2YXIgTE9PS19BSEVBRCA9IDQwO1xyXG5cclxuICAvLyBGb3IgZGV0ZXJtaW5pbmcgaG93IG11Y2ggZGlmZmVyZW5jZSBoZWFkaW5nIHRvd2FyZHMgYSBzaW5nbGUgZGlyZWN0aW9uXHJcbiAgLy8gd2lsbCBtYWtlLlxyXG4gIHZhciBESVJfTE9PS19BSEVBRCA9IDQwO1xyXG5cclxuICAvLyBSYXkgd2l0aCBjdXJyZW50IHBvc2l0aW9uIGFzIGJhc2lzLlxyXG4gIHZhciBwb3NpdGlvbiA9IHRoaXMuZ2FtZS5sb2NhdGlvbigpO1xyXG4gIC8vIGxvb2sgYWhlYWQgMjBtc1xyXG4gIHZhciBhaGVhZCA9IHRoaXMuZ2FtZS5wTG9jYXRpb24oTE9PS19BSEVBRCk7XHJcbiAgdmFyIGFoZWFkX2Rpc3RhbmNlID0gYWhlYWQuc3ViKHBvc2l0aW9uKS5sZW4oKTtcclxuXHJcbiAgdmFyIHJlbGF0aXZlX2xvY2F0aW9uID0gYWhlYWQuc3ViKHBvc2l0aW9uKTtcclxuXHJcbiAgdmFyIHNwaWtlcyA9IHRoaXMuZ2FtZS5nZXRzcGlrZXMoKTtcclxuXHJcbiAgdmVjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKHZlY3RvciwgaSkge1xyXG4gICAgdmVjdG9yID0gcmVsYXRpdmVfbG9jYXRpb24uYWRkKHZlY3Rvci5tdWwoRElSX0xPT0tfQUhFQUQpKTtcclxuICAgIHZhciB2ZWNsZW4gPSB2ZWN0b3IubGVuKCk7XHJcbiAgICAvLyBQdXQgdmVjdG9yIHJlbGF0aXZlIHRvIHByZWRpY3RlZCBwb3NpdGlvbi5cclxuICAgIHZlY3RvciA9IHZlY3Rvci5ub3JtYWxpemUoKTtcclxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3Bpa2VzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIHZhciBzcGlrZSA9IHNwaWtlc1tqXTtcclxuICAgICAgLy8gU2tpcCBzcGlrZXMgdGhhdCBhcmUgdG9vIGZhciBhd2F5IHRvIG1hdHRlci5cclxuICAgICAgaWYgKHNwaWtlLmRpc3QocG9zaXRpb24pIC0gU1BJS0VfSU5URVJTRUNUSU9OX1JBRElVUyA+IHZlY2xlbikgY29udGludWU7XHJcbiAgICAgIGNvbGxpc2lvbiA9IFBvbHlVdGlscy5saW5lQ2lyY2xlSW50ZXJzZWN0aW9uKFxyXG4gICAgICAgIHBvc2l0aW9uLFxyXG4gICAgICAgIHZlY3RvcixcclxuICAgICAgICBzcGlrZSxcclxuICAgICAgICBTUElLRV9JTlRFUlNFQ1RJT05fUkFESVVTXHJcbiAgICAgICk7XHJcbiAgICAgIGlmIChjb2xsaXNpb24uY29sbGlkZXMpIHtcclxuICAgICAgICBpZiAoY29sbGlzaW9uLmluc2lkZSkge1xyXG4gICAgICAgICAgY29zdHNbaV0gKz0gMTAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBDYWxjdWxhdGUgY29zdC5cclxuICAgICAgICAgIGNvc3RzW2ldICs9IFNQSUtFX0lOVEVSU0VDVElPTl9SQURJVVMgLyBwb3NpdGlvbi5kaXN0KGNvbGxpc2lvbi5wb2ludCk7XHJcbiAgICAgICAgICAvKnZhciB0bXBEaXN0MiA9IHBvc2l0aW9uLmRpc3QyKGNvbGxpc2lvbi5wb2ludCk7XHJcbiAgICAgICAgICBpZiAodG1wRGlzdDIgPCBtaW5EaXN0Mikge1xyXG4gICAgICAgICAgICBtaW5Db2xsaXNpb24gPSBjb2xsaXNpb247XHJcbiAgICAgICAgICAgIG1pbkRpc3QyID0gdG1wRGlzdDI7XHJcbiAgICAgICAgICB9Ki9cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gY29zdHM7XHJcbn1cclxuXHJcbkJvdC5wcm90b3R5cGUuX2ludl9TZWVrID0gZnVuY3Rpb24odmVjdG9ycykge1xyXG4gIHZhciBjb3N0cyA9IHZlY3RvcnMubWFwKGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIDA7XHJcbiAgfSk7XHJcbiAgdmFyIHBhcmFtcyA9IHRoaXMucGFyYW1ldGVycy5zdGVlcmluZ1tcInNlZWtcIl07XHJcbiAgdmFyIHAgPSB0aGlzLmdhbWUubG9jYXRpb24oKTtcclxuICBpZiAodGhpcy5nb2FsKSB7XHJcbiAgICB2YXIgZ29hbCA9IHRoaXMuZ29hbC5zdWIocCkubm9ybWFsaXplKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBnb2FsID0gZmFsc2U7XHJcbiAgfVxyXG4gIHZlY3RvcnMuZm9yRWFjaChmdW5jdGlvbih2ZWN0b3IsIGkpIHtcclxuICAgIGlmIChnb2FsKSB7XHJcbiAgICAgIHZhciB2YWwgPSB2ZWN0b3IuZG90KGdvYWwpO1xyXG4gICAgICBpZiAodmFsIDwgMCkge1xyXG4gICAgICAgIGNvc3RzW2ldID0gMjA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29zdHNbaV0gPSAxIC8gdmFsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGNvc3RzO1xyXG59XHJcblxyXG4vKipcclxuICogQ2xlYXIgdGhlIGludGVydmFsIGlkZW50aWZpZWQgYnkgYG5hbWVgLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBpbnRlcnZhbCB0byBjbGVhci5cclxuICovXHJcbkJvdC5wcm90b3R5cGUuX2NsZWFySW50ZXJ2YWwgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgaWYgKHRoaXMuX2lzSW50ZXJ2YWwobmFtZSkpIHtcclxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5hY3Rpb25zW25hbWVdKTtcclxuICAgIGRlbGV0ZSB0aGlzLmFjdGlvbnNbbmFtZV07XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogU2V0IHRoZSBnaXZlbiBmdW5jdGlvbiBhcyBhbiBmdW5jdGlvbiBleGVjdXRlZCBvbiBhbiBpbnRlcnZhbFxyXG4gKiBnaXZlbiBieSBgdGltZWAuIEZ1bmN0aW9uIGlzIGJvdW5kIHRvIGB0aGlzYCwgYW5kIGNhbiBiZSByZW1vdmVkXHJcbiAqIHVzaW5nIGBfY2xlYXJJbnRlcnZhbGAuIElmIGFuIGludGVydmFsIGZ1bmN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcclxuICogaXMgYWxyZWFkeSBzZXQsIHRoZSBmdW5jdGlvbiBkb2VzIG5vdGhpbmcuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEBwYXJhbSB7aW50ZWdlcn0gdGltZSAtIFRoZSB0aW1lIGluIG1zLlxyXG4gKi9cclxuQm90LnByb3RvdHlwZS5fc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbihuYW1lLCBmbiwgdGltZSkge1xyXG4gIGlmICghdGhpcy5faXNJbnRlcnZhbChuYW1lKSkge1xyXG4gICAgdGhpcy5hY3Rpb25zW25hbWVdID0gc2V0SW50ZXJ2YWwoZm4uYmluZCh0aGlzKSwgdGltZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgd2hldGhlciB0aGUgaW50ZXJ2YWwgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBpcyBhY3RpdmUuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciB0aGUgaW50ZXJ2YWwgaXMgYWN0aXZlLlxyXG4gKi9cclxuQm90LnByb3RvdHlwZS5faXNJbnRlcnZhbCA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICByZXR1cm4gdGhpcy5hY3Rpb25zLmhhc093blByb3BlcnR5KG5hbWUpO1xyXG59XHJcblxyXG5Cb3QucHJvdG90eXBlLl9yZW1vdmVEcmF3ID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5kcmF3LmhpZGVWZWN0b3IoXCJzZWVrXCIpO1xyXG4gIHRoaXMuZHJhdy5oaWRlVmVjdG9yKFwiYXZvaWRcIik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTY2FsZSBhIHZlY3RvciBzbyB0aGF0IG9uZSBvZiB0aGUgY29tcG9uZW50cyBpcyBtYXhpbWl6ZWQuXHJcbiAqIEBwYXJhbSB7UG9pbnR9IHZlYyAtIFRoZSB2ZWN0b3IgdG8gc2NhbGUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSBUaGUgbWF4aW11bSAoYWJzb2x1dGUpIHZhbHVlIG9mIGVpdGhlciBjb21wb25lbnQuXHJcbiAqIEByZXR1cm4ge1BvaW50fSAtIFRoZSBjb252ZXJ0ZWQgdmVjdG9yLlxyXG4gKi9cclxuQm90LnByb3RvdHlwZS5fc2NhbGVWZWN0b3IgPSBmdW5jdGlvbih2ZWMsIG1heCkge1xyXG4gIHZhciByYXRpbyA9IDA7XHJcbiAgaWYgKE1hdGguYWJzKHZlYy54KSA+PSBNYXRoLmFicyh2ZWMueSkgJiYgdmVjLnggIT09IDApIHtcclxuICAgIHJhdGlvID0gTWF0aC5hYnMobWF4IC8gdmVjLngpO1xyXG4gIH0gZWxzZSBpZiAodmVjLnkgIT09IDApIHtcclxuICAgIHJhdGlvID0gTWF0aC5hYnMobWF4IC8gdmVjLnkpO1xyXG4gIH1cclxuICB2YXIgc2NhbGVkID0gdmVjLm11bChyYXRpbyk7XHJcbiAgcmV0dXJuIHNjYWxlZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRha2VzIHRoZSBkZXNpcmVkIHZlbG9jaXR5IGFzIGEgcGFyYW1ldGVyIGFuZCBwcmVzc2VzIHRoZSBrZXlzXHJcbiAqIG5lY2Vzc2FyeSB0byBtYWtlIGl0IGhhcHBlbi5cclxuICogQHBhcmFtIHtQb2ludH0gdmVjIC0gVGhlIGRlc2lyZWQgdmVsb2NpdHkuXHJcbiAqL1xyXG5Cb3QucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbih2ZWMpIHtcclxuICBpZiAodmVjLnggPT0gMCAmJiB2ZWMueSA9PSAwKSByZXR1cm47XHJcbiAgdmFyIHBhcmFtcyA9IHRoaXMucGFyYW1ldGVycy5zdGVlcmluZ1tcInVwZGF0ZVwiXTtcclxuICAvLyBUaGUgY3V0b2ZmIGZvciB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIGEgZGVzaXJlZCB2ZWxvY2l0eSBhbmQgdGhlXHJcbiAgLy8gY3VycmVudCB2ZWxvY2l0eSBpcyBzbWFsbCBlbm91Z2ggdGhhdCBubyBhY3Rpb24gbmVlZHMgdG8gYmUgdGFrZW4uXHJcbiAgdmFyIEFDVElPTl9USFJFU0hPTEQgPSBwYXJhbXMuYWN0aW9uX3RocmVzaG9sZDtcclxuICB2YXIgQ1VSUkVOVF9WRUNUT1IgPSBwYXJhbXMuY3VycmVudF92ZWN0b3I7XHJcbiAgdmFyIFRPUF9TUEVFRF9USFJFU0hPTEQgPSBwYXJhbXMudG9wX3NwZWVkX3RocmVzaG9sZDtcclxuICB2YXIgY3VycmVudCA9IHRoaXMuZ2FtZS5wVmVsb2NpdHkoQ1VSUkVOVF9WRUNUT1IpO1xyXG4gIHZhciB0b3BTcGVlZCA9IHRoaXMuc2VsZi5tcztcclxuICB2YXIgaXNUb3BTcGVlZCA9IHt9O1xyXG4gIC8vIGFjdHVhbCBzcGVlZCBjYW4gdmFyeSArLSAwLjAyIG9mIHRvcCBzcGVlZC9cclxuICBpc1RvcFNwZWVkLnggPSBNYXRoLmFicyh0b3BTcGVlZCAtIE1hdGguYWJzKGN1cnJlbnQueCkpIDwgVE9QX1NQRUVEX1RIUkVTSE9MRDtcclxuICBpc1RvcFNwZWVkLnkgPSBNYXRoLmFicyh0b3BTcGVlZCAtIE1hdGguYWJzKGN1cnJlbnQueSkpIDwgVE9QX1NQRUVEX1RIUkVTSE9MRDtcclxuICB2YXIgZGlycyA9IHt9O1xyXG4gIGlmIChNYXRoLmFicyhjdXJyZW50LnggLSB2ZWMueCkgPCBBQ1RJT05fVEhSRVNIT0xEICYmIChNYXRoLmFicyh2ZWMueCkgPCBNYXRoLmFicyhjdXJyZW50LngpKSkge1xyXG4gICAgLy8gRG8gbm90aGluZy5cclxuICB9IGVsc2UgaWYgKE1hdGguYWJzKGN1cnJlbnQueCAtIHZlYy54KSA8IEFDVElPTl9USFJFU0hPTEQpIHtcclxuICAgIC8vIFdlJ3JlIGFscmVhZHkgZ29pbmcgZmFzdCBhbmQgd2Ugd2FudCB0byBrZWVwIGdvaW5nIGZhc3QuXHJcbiAgICBpZiAoaXNUb3BTcGVlZC54KSB7XHJcbiAgICAgIGlmIChjdXJyZW50LnggPiAwKSB7XHJcbiAgICAgICAgZGlycy5yaWdodCA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGlycy5sZWZ0ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAodmVjLnggPCBjdXJyZW50LngpIHtcclxuICAgIGRpcnMubGVmdCA9IHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRpcnMucmlnaHQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKE1hdGguYWJzKGN1cnJlbnQueSAtIHZlYy55KSA8IEFDVElPTl9USFJFU0hPTEQgJiYgKE1hdGguYWJzKHZlYy55KSA8IE1hdGguYWJzKGN1cnJlbnQueSkpKSB7XHJcbiAgICAvLyBEbyBub3RoaW5nLlxyXG4gIH0gZWxzZSBpZiAoTWF0aC5hYnMoY3VycmVudC55IC0gdmVjLnkpIDwgQUNUSU9OX1RIUkVTSE9MRCkge1xyXG4gICAgLy8gV2UncmUgYWxyZWFkeSBnb2luZyBmYXN0IGFuZCB3ZSB3YW50IHRvIGtlZXAgZ29pbmcgZmFzdC5cclxuICAgIGlmIChpc1RvcFNwZWVkLnkpIHtcclxuICAgICAgaWYgKGN1cnJlbnQueSA+IDApIHtcclxuICAgICAgICBkaXJzLmRvd24gPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRpcnMudXAgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmICh2ZWMueSA8IGN1cnJlbnQueSkge1xyXG4gICAgZGlycy51cCA9IHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRpcnMuZG93biA9IHRydWU7XHJcbiAgfVxyXG4gIHRoaXMubW92ZShkaXJzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFN0b3AgYWxsIG1vdmVtZW50LlxyXG4gKi9cclxuQm90LnByb3RvdHlwZS5hbGxVcCA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMubW92ZSh7fSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZW5kIGEgY2hhdCBtZXNzYWdlIHRvIHRoZSBhY3RpdmUgZ2FtZS4gVHJ1bmNhdGVzIG1lc3NhZ2VzIHRoYXRcclxuICogYXJlIHRvbyBsb25nLiBNYXhpbXVtIGxlbmd0aCBmb3IgYSBtZXNzYWdlIGlzIDcxLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIFRoZSBtZXNzYWdlIHRvIHNlbmQuXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2FsbD10cnVlXSAtIFdoZXRoZXIgdGhlIGNoYXQgc2hvdWxkIGJlIHRvIGFsbFxyXG4gKiAgIHBsYXllcnMgb3IganVzdCB0byB0aGUgdGVhbS5cclxuICovXHJcbkJvdC5wcm90b3R5cGUuY2hhdCA9IGZ1bmN0aW9uKG1lc3NhZ2UsIGFsbCkge1xyXG4gIGlmICh0eXBlb2YgYWxsID09ICd1bmRlZmluZWQnKSBhbGwgPSB0cnVlO1xyXG4gIGlmICghdGhpcy5oYXNPd25Qcm9wZXJ0eSgnbGFzdE1lc3NhZ2UnKSkgdGhpcy5sYXN0TWVzc2FnZSA9IDA7XHJcbiAgdmFyIGxpbWl0ID0gNTAwICsgMTA7XHJcbiAgdmFyIG5vdyA9IERhdGUubm93KCk7XHJcbiAgdmFyIHRpbWVEaWZmID0gbm93IC0gdGhpcy5sYXN0TWVzc2FnZTtcclxuICB2YXIgbWF4TGVuZ3RoID0gNzE7XHJcbiAgaWYgKHRpbWVEaWZmID4gbGltaXQpIHtcclxuICAgIGlmIChtZXNzYWdlLmxlbmd0aCA+IG1heExlbmd0aCkge1xyXG4gICAgICBtZXNzYWdlID0gbWVzc2FnZS5zdWJzdHIoMCwgbWF4TGVuZ3RoKTtcclxuICAgIH1cclxuICAgIHRhZ3Byby5zb2NrZXQuZW1pdChcImNoYXRcIiwge1xyXG4gICAgICBtZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICB0b0FsbDogYWxsID8gMSA6IDBcclxuICAgIH0pO1xyXG4gICAgdGhpcy5sYXN0TWVzc2FnZSA9IERhdGUubm93KCk7XHJcbiAgfSBlbHNlIGlmICh0aW1lRGlmZiA+PSAwKSB7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLmNoYXQobWVzc2FnZSwgYWxsKTtcclxuICAgIH0uYmluZCh0aGlzKSwgbGltaXQgLSB0aW1lRGlmZik7XHJcbiAgfVxyXG59XHJcbiIsInZhciBQb2ludCA9IHJlcXVpcmUoJy4vZ2VvbWV0cnknKS5Qb2ludDtcclxuXHJcbmZ1bmN0aW9uIGluaGVyaXRzKGNoaWxkLCBwYXJlbnQpIHtcclxuICBjaGlsZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBhcmVudC5wcm90b3R5cGUpO1xyXG4gIGNoaWxkLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNoaWxkO1xyXG59XHJcblxyXG5Hb2FsU3RhdHVzID0ge1xyXG4gIGluYWN0aXZlOiAxLFxyXG4gIGFjdGl2ZTogMixcclxuICBjb21wbGV0ZWQ6IDMsXHJcbiAgZmFpbGVkOiA0LFxyXG4gIHdhaXRpbmc6IDVcclxufTtcclxuXHJcbnZhciBHb2FsID0gZnVuY3Rpb24oYm90KSB7XHJcbiAgdGhpcy5ib3QgPSBib3Q7XHJcbiAgdGhpcy5zdGF0dXMgPSBHb2FsU3RhdHVzLmluYWN0aXZlO1xyXG59O1xyXG5cclxuR29hbC5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbigpIHt9O1xyXG5cclxuR29hbC5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uKCkge307XHJcblxyXG5Hb2FsLnByb3RvdHlwZS50ZXJtaW5hdGUgPSBmdW5jdGlvbigpIHt9O1xyXG5cclxuLyoqXHJcbiAqIFRoaXMgZnVuY3Rpb24gYWxsb3dzIHBhc3NpbmcgYSBtZXNzYWdlIHRvIGEgZ29hbCB0byBiZSBoYW5kbGVkIGluXHJcbiAqIHJlYWwtdGltZS4gSWYgdGhpcyBpcyBub3Qgb3ZlcnJpZGVuIHRoZW4gdGhlIGRlZmF1bHQgYmVoYXZpb3IgaXNcclxuICogdG8gbm90IGhhbmRsZSB0aGUgbWVzc2FnZS5cclxuICogQHBhcmFtIHt9IG1zZyAtIFRoZSBtZXNzYWdlLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSBnb2FsIGhhbmRsZWQgdGhlIG1lc3NhZ2UuXHJcbiAqL1xyXG5Hb2FsLnByb3RvdHlwZS5oYW5kbGVNZXNzYWdlID0gZnVuY3Rpb24obXNnKSB7XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJ1biB0aGUgYWN0aXZhdGUgZnVuY3Rpb24gZm9yIHRoZSBjdXJyZW50IGdvYWwgaWYgaXRzIGN1cnJlbnRcclxuICogc3RhdHVzIGlzIGluYWN0aXZlLCBvdGhlcndpc2UgZG8gbm90aGluZy5cclxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgYWN0aXZhdGUgZnVuY3Rpb24gd2FzIHJ1bi5cclxuICovXHJcbkdvYWwucHJvdG90eXBlLmFjdGl2YXRlSWZJbmFjdGl2ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLmlzSW5hY3RpdmUoKSkge1xyXG4gICAgdGhpcy5hY3RpdmF0ZSgpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcblxyXG5Hb2FsLnByb3RvdHlwZS5yZWFjdGl2YXRlSWZGYWlsZWQgPSBmdW5jdGlvbigpIHtcclxuICBpZiAodGhpcy5oYXNGYWlsZWQoKSkge1xyXG4gICAgdGhpcy5zdGF0dXMgPSBHb2FsU3RhdHVzLmluYWN0aXZlO1xyXG4gIH1cclxufTtcclxuXHJcbkdvYWwucHJvdG90eXBlLnR5cGUgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcjtcclxufTtcclxuXHJcbkdvYWwucHJvdG90eXBlLmlzQWN0aXZlID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuc3RhdHVzID09IEdvYWxTdGF0dXMuYWN0aXZlO1xyXG59O1xyXG5cclxuR29hbC5wcm90b3R5cGUuaXNJbmFjdGl2ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLnN0YXR1cyA9PSBHb2FsU3RhdHVzLmluYWN0aXZlO1xyXG59O1xyXG5cclxuR29hbC5wcm90b3R5cGUuaXNDb21wbGV0ZWQgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5zdGF0dXMgPT0gR29hbFN0YXR1cy5jb21wbGV0ZWQ7XHJcbn07XHJcblxyXG5Hb2FsLnByb3RvdHlwZS5oYXNGYWlsZWQgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5zdGF0dXMgPT0gR29hbFN0YXR1cy5mYWlsZWQ7XHJcbn07XHJcblxyXG4vKipcclxuICogQWN0cyBhcyBhIGdvYWwgd2l0aCBzdWJnb2Fscy5cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7Qm90fSBib3RcclxuICovXHJcbkNvbXBvc2l0ZUdvYWwgPSBmdW5jdGlvbihib3QpIHtcclxuICBHb2FsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgdGhpcy5zdWJnb2FscyA9IFtdO1xyXG59O1xyXG5cclxuaW5oZXJpdHMoQ29tcG9zaXRlR29hbCwgR29hbCk7XHJcblxyXG4vKipcclxuICogQnkgZGVmYXVsdCwgYSBjb21wb3NpdGUgZ29hbCBmb3J3YXJkcyBtZXNzYWdlcyB0byB0aGUgZmlyc3RcclxuICogc3ViZ29hbCBhbmQgcmV0dXJucyB0aGUgcmVzdWx0LlxyXG4gKiBAcGFyYW0ge30gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gaGFuZGxlLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSBtZXNzYWdlIHdhcyBoYW5kbGVkLlxyXG4gKi9cclxuQ29tcG9zaXRlR29hbC5wcm90b3R5cGUuaGFuZGxlTWVzc2FnZSA9IGZ1bmN0aW9uKG1zZykge1xyXG4gIHJldHVybiB0aGlzLmZvcndhcmRUb0ZpcnN0U3ViZ29hbChtc2cpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZvcndhcmQgdGhlIGdpdmVuIG1lc3NhZ2UgdG8gdGhlIGZpcnN0IHN1YmdvYWwgb2YgdGhpcyBnb2FsLCBvciBpZlxyXG4gKiB0aGVyZSBhcmUgbm8gc3ViZ29hbHMsIHJldHVybiBmYWxzZS5cclxuICogQHBhcmFtIHt9IG1zZyAtIFRoZSBtZXNzYWdlIHRvIGZvcndhcmQuXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgbmVzc2FnZSB3YXMgaGFuZGxlZC5cclxuICovXHJcbkNvbXBvc2l0ZUdvYWwucHJvdG90eXBlLmZvcndhcmRUb0ZpcnN0U3ViZ29hbCA9IGZ1bmN0aW9uKG1zZykge1xyXG4gIGlmICh0aGlzLnN1YmdvYWxzLmxlbmd0aCA+IDApIHtcclxuICAgIHJldHVybiB0aGlzLnN1YmdvYWxzWzBdLmhhbmRsZU1lc3NhZ2UobXNnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBQcm9jZXNzIHRoZSBzdWJnb2FscyBvZiBhIGNvbXBvc2l0ZSBnb2FsLiBUaGlzIHJlbW92ZXMgY29tcGxldGVkXHJcbiAqIGFuZCBmYWlsZWQgZ29hbHMgZnJvbSB0aGUgc3ViZ29hbCBsaXN0IGFuZCBwcm9jZXNzZXMgdGhlIGZpcnN0XHJcbiAqIHN1YmdvYWwgc3RpbGwgcmVtYWluaW5nLlxyXG4gKi9cclxuQ29tcG9zaXRlR29hbC5wcm90b3R5cGUucHJvY2Vzc1N1YmdvYWxzID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gUmVtb3ZlIGNvbXBsZXRlZCBhbmQgZmFpbGVkIHN1YmdvYWxzLlxyXG4gIHdoaWxlICh0aGlzLnN1YmdvYWxzLmxlbmd0aCAhPT0gMCAmJlxyXG4gICAgKHRoaXMuc3ViZ29hbHNbMF0uaXNDb21wbGV0ZWQoKSB8fCB0aGlzLnN1YmdvYWxzWzBdLmhhc0ZhaWxlZCgpKSkge1xyXG4gICAgdmFyIHN1YmdvYWwgPSB0aGlzLnN1YmdvYWxzLnNoaWZ0KCk7XHJcbiAgICBzdWJnb2FsLnRlcm1pbmF0ZSgpO1xyXG4gIH1cclxuICAvLyBQcm9jZXNzIGZpcnN0IHN1YmdvYWwuXHJcbiAgaWYgKHRoaXMuc3ViZ29hbHMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICB2YXIgc3ViZ29hbFN0YXR1cyA9IHRoaXMuc3ViZ29hbHNbMF0ucHJvY2VzcygpO1xyXG4gICAgaWYgKHN1YmdvYWxTdGF0dXMgPT0gR29hbFN0YXR1cy5jb21wbGV0ZWQgJiYgdGhpcy5zdWJnb2Fscy5sZW5ndGggPiAxKSB7XHJcbiAgICAgIHJldHVybiBHb2FsU3RhdHVzLmFjdGl2ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdWJnb2FsU3RhdHVzO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gR29hbFN0YXR1cy5jb21wbGV0ZWQ7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBnb2FsIHRvIHN1YmdvYWxzLlxyXG4gKiBAcGFyYW0ge0dvYWx9IGdvYWwgLSBUaGUgZ29hbCB0byBhZGQuXHJcbiAqL1xyXG5Db21wb3NpdGVHb2FsLnByb3RvdHlwZS5hZGRTdWJnb2FsID0gZnVuY3Rpb24oZ29hbCkge1xyXG4gIHRoaXMuc3ViZ29hbHMucHVzaChnb2FsKTtcclxufTtcclxuXHJcbkNvbXBvc2l0ZUdvYWwucHJvdG90eXBlLnJlbW92ZUFsbFN1YmdvYWxzID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHN1YmdvYWxzID0gdGhpcy5zdWJnb2Fscy5zcGxpY2UoMCwgdGhpcy5zdWJnb2Fscy5sZW5ndGgpO1xyXG4gIHN1YmdvYWxzLmZvckVhY2goZnVuY3Rpb24oc3ViZ29hbCkge1xyXG4gICAgc3ViZ29hbC50ZXJtaW5hdGUoKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgZmlyc3Qgc3ViZ29hbCBpcyBvZiB0aGUgdHlwZSBwYXNzZWQuIElmXHJcbiAqIHRoZXJlIGFyZSBubyBzdWJnb2FscyB0aGVuIHRoaXMgcmV0dXJucyBmYWxzZS5cclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZ29hbFR5cGUgLSBUaGUgdHlwZSB0byBjaGVjayBmb3IuXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciB0aGUgZmlyc3Qgc3ViZ29hbCBpcyBvZiB0aGUgZ2l2ZW5cclxuICogICB0eXBlLlxyXG4gKi9cclxuQ29tcG9zaXRlR29hbC5wcm90b3R5cGUuaXNGaXJzdFN1YmdvYWwgPSBmdW5jdGlvbihnb2FsVHlwZSkge1xyXG4gIGlmICh0aGlzLnN1YmdvYWxzLmxlbmd0aCA+IDApIHtcclxuICAgIHJldHVybiAodGhpcy5zdWJnb2Fsc1swXSBpbnN0YW5jZW9mIGdvYWxUeXBlKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbGVhbiB1cC5cclxuICogQG92ZXJyaWRlXHJcbiAqL1xyXG5Db21wb3NpdGVHb2FsLnByb3RvdHlwZS50ZXJtaW5hdGUgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnJlbW92ZUFsbFN1YmdvYWxzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogVGhpcyBnb2FsIGlzIGNvbmNlcm5lZCB3aXRoIG1ha2luZyBkZWNpc2lvbnMgYW5kIGd1aWRpbmcgdGhlXHJcbiAqIGJlaGF2aW9yIG9mIHRoZSBib3QuXHJcbiAqL1xyXG52YXIgVGhpbmsgPSBmdW5jdGlvbihib3QpIHtcclxuICBDb21wb3NpdGVHb2FsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgLy8gR2FtZSB0eXBlLCBlaXRoZXIgY3RmIG9yIGNmXHJcbiAgdGhpcy5nYW1lVHlwZSA9IHRoaXMuYm90LmdhbWUuZ2FtZVR5cGUoKTtcclxuICB0aGlzLmFsaXZlID0gdGhpcy5ib3QuZ2FtZS5hbGl2ZSgpO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IFRoaW5rO1xyXG5cclxuaW5oZXJpdHMoVGhpbmssIENvbXBvc2l0ZUdvYWwpO1xyXG5cclxuLyoqXHJcbiAqIEluaXRpYXRlIHRoaW5raW5nIGlmIGFsaXZlLlxyXG4gKiBAb3ZlcnJpZGVcclxuICovXHJcblRoaW5rLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuc3RhdHVzID0gR29hbFN0YXR1cy5hY3RpdmU7XHJcbiAgaWYgKHRoaXMuYWxpdmUpIHtcclxuICAgIHRoaXMudGhpbmsoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5zdGF0dXMgPSBHb2FsU3RhdHVzLmluYWN0aXZlO1xyXG4gIH1cclxufTtcclxuXHJcblRoaW5rLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5hY3RpdmF0ZUlmSW5hY3RpdmUoKTtcclxuICB2YXIgc3RhdHVzID0gdGhpcy5wcm9jZXNzU3ViZ29hbHMoKTtcclxuICBpZiAoc3RhdHVzID09IEdvYWxTdGF0dXMuY29tcGxldGVkIHx8IHN0YXR1cyA9PSBHb2FsU3RhdHVzLmZhaWxlZCkge1xyXG4gICAgdGhpcy5zdGF0dXMgPSBHb2FsU3RhdHVzLmluYWN0aXZlO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy5zdGF0dXM7XHJcbn07XHJcblxyXG4vKipcclxuICogVGhpbmsgaGFuZGxlcyB0aGUgZm9sbG93aW5nIG1lc3NhZ2UgdHlwZXM6XHJcbiAqICogZGVhZFxyXG4gKiAqIHN0YW5jZUNoYW5nZVxyXG4gKiAqIGFsaXZlXHJcbiAqIEBvdmVycmlkZVxyXG4gKi9cclxuVGhpbmsucHJvdG90eXBlLmhhbmRsZU1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpIHtcclxuICBpZiAobXNnID09IFwiZGVhZFwiKSB7XHJcbiAgICB0aGlzLnRlcm1pbmF0ZSgpO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBHb2FsU3RhdHVzLmluYWN0aXZlO1xyXG4gICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBlbHNlIGlmIChtc2cgPT0gXCJhbGl2ZVwiKSB7XHJcbiAgICB0aGlzLmFsaXZlID0gdHJ1ZTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gZWxzZSBpZiAobXNnID09IFwic3RhbmNlQ2hhbmdlXCIpIHtcclxuICAgIHRoaXMudGVybWluYXRlKCk7XHJcbiAgICB0aGlzLnN0YXR1cyA9IEdvYWxTdGF0dXMuaW5hY3RpdmU7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHRoaXMuZm9yd2FyZFRvRmlyc3RTdWJnb2FsKG1zZyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENob29zZSBhY3Rpb24gdG8gdGFrZS5cclxuICovXHJcblRoaW5rLnByb3RvdHlwZS50aGluayA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLmdhbWVUeXBlID09IHRoaXMuYm90LmdhbWUuR2FtZVR5cGVzLmN0Zikge1xyXG4gICAgLy8gQ2hvb3NlIGJhc2VkIG9uIG1hbnVhbCBzZWxlY3Rpb24uXHJcbiAgICBpZiAodGhpcy5ib3QuaXNPZmZlbnNlKCkpIHtcclxuICAgICAgLy8gTWFrZSBzdXJlIHdlJ3JlIG5vdCBhbHJlYWR5IG9uIG9mZmVuc2UuXHJcbiAgICAgIGlmICghdGhpcy5pc0ZpcnN0U3ViZ29hbChPZmZlbnNlKSkge1xyXG4gICAgICAgIC8vIE9ubHkgc2V0IHRvIG9mZmVuc2UgZm9yIG5vdy5cclxuICAgICAgICAvLyBUaGlzIGdvYWwgcmVwbGFjZXMgYWxsIG90aGVycy5cclxuICAgICAgICB0aGlzLnJlbW92ZUFsbFN1YmdvYWxzKCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdWJnb2FsKG5ldyBPZmZlbnNlKHRoaXMuYm90KSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5ib3QuaXNEZWZlbnNlKCkpIHtcclxuICAgICAgaWYgKCF0aGlzLmlzRmlyc3RTdWJnb2FsKERlZmVuc2UpKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBbGxTdWJnb2FscygpO1xyXG4gICAgICAgIHRoaXMuYWRkU3ViZ29hbChuZXcgRGVmZW5zZSh0aGlzLmJvdCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIENlbnRlciBmbGFnIGdhbWUuXHJcbiAgICB0aGlzLmJvdC5jaGF0KFwiSSBjYW4ndCBwbGF5IHRoaXMuXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBPZmZlbnNlIGlzIGEgZ29hbCB3aXRoIHRoZSBwdXJwb3NlIG9mIGNhcHR1cmluZyB0aGUgZW5lbXkgZmxhZyBhbmRcclxuICogcmV0dXJuaW5nIGl0IHRvIGJhc2UgdG8gb2J0YWluIGEgY2FwdHVyZS5cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7Qm90fSBib3QgLSBUaGUgYm90LlxyXG4gKi9cclxudmFyIE9mZmVuc2UgPSBmdW5jdGlvbihib3QpIHtcclxuICBDb21wb3NpdGVHb2FsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5pbmhlcml0cyhPZmZlbnNlLCBDb21wb3NpdGVHb2FsKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgT2ZmZW5zZSBnb2FsIGFjdGl2YXRpb24gZnVuY3Rpb24gY2hlY2tzIHdoZXRoZXIgb3Igbm90IHRoZSBib3RcclxuICogaGFzIHRoZSBmbGFnIGFuZCBpbml0aWF0ZXMgbmF2aWdhdGlvbiB0byBlaXRoZXIgcmV0cmlldmUgaXQgb3JcclxuICogcmV0dXJuIHRvIGJhc2UgdG8gZ2V0IGEgY2FwdHVyZS5cclxuICovXHJcbk9mZmVuc2UucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5zdGF0dXMgPSBHb2FsU3RhdHVzLmFjdGl2ZTtcclxuICB2YXIgZGVzdGluYXRpb247XHJcbiAgaWYgKCF0aGlzLmJvdC5zZWxmLmZsYWcpIHtcclxuICAgIGRlc3RpbmF0aW9uID0gdGhpcy5ib3QuZ2FtZS5maW5kRW5lbXlGbGFnKCk7XHJcbiAgICB0aGlzLmFkZFN1YmdvYWwobmV3IE5hdmlnYXRlVG9Qb2ludCh0aGlzLmJvdCwgZGVzdGluYXRpb24ubG9jYXRpb24pKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZGVzdGluYXRpb24gPSB0aGlzLmJvdC5nYW1lLmZpbmRPd25GbGFnKCk7XHJcbiAgICB0aGlzLmFkZFN1YmdvYWwobmV3IE5hdmlnYXRlVG9Qb2ludCh0aGlzLmJvdCwgZGVzdGluYXRpb24ubG9jYXRpb24pKTtcclxuICB9XHJcbn07XHJcblxyXG5PZmZlbnNlLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5hY3RpdmF0ZUlmSW5hY3RpdmUoKTtcclxuXHJcbiAgdmFyIHN0YXR1cyA9IHRoaXMucHJvY2Vzc1N1YmdvYWxzKCk7XHJcblxyXG4gIGlmIChzdGF0dXMgPT0gR29hbFN0YXR1cy5jb21wbGV0ZWQpIHtcclxuICAgIHRoaXMuYWN0aXZhdGUoKTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMuc3RhdHVzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBEZWZlbnNlIGdvYWwgaXMgY29uY2VybmVkIHdpdGggZGVmZW5kaW5nIGEgZmxhZyBpbiBiYXNlLFxyXG4gKiBwcmV2ZW50aW5nIGFuIGVuZW15IGNhcHR1cmUsIGFuZCBjaGFzaW5nIGFuZCByZXR1cm5pbmcgdGhlXHJcbiAqIGVuZW15IGZsYWcgY2Fycmllci5cclxuICovXHJcbnZhciBEZWZlbnNlID0gZnVuY3Rpb24oYm90KSB7XHJcbiAgQ29tcG9zaXRlR29hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuaW5oZXJpdHMoRGVmZW5zZSwgQ29tcG9zaXRlR29hbCk7XHJcblxyXG5EZWZlbnNlLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuc3RhdHVzID0gR29hbFN0YXR1cy5hY3RpdmU7XHJcbiAgLy8gR2V0IG93biB0ZWFtJ3MgZmxhZyBzdGF0dXMuXHJcbiAgdmFyIGZsYWcgPSB0aGlzLmJvdC5nYW1lLmZpbmRPd25GbGFnKCk7XHJcbiAgLy8gRmxhZyBpcyBob21lLlxyXG4gIGlmIChmbGFnLnN0YXRlKSB7XHJcbiAgICAvLyBDb25zaWRlciBjdXJyZW50IGxvY2F0aW9uLlxyXG4gICAgaWYgKHRoaXMuYm90LmdhbWUuaW5CYXNlKCkpIHtcclxuICAgICAgLy8gSW5zaWRlIGJhc2UsIGRlZmVuZCBvdXIgZmxhZy5cclxuICAgICAgdGhpcy5hZGRTdWJnb2FsKG5ldyBEZWZlbmRGbGFnKHRoaXMuYm90KSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBPdXRzaWRlIG9mIGJhc2UsIHBsb3QgYSBjb3Vyc2UgZm9yIHRoZSBiYXNlJ3MgbG9jYXRpb24uXHJcbiAgICAgIHZhciBiYXNlID0gdGhpcy5ib3QuZ2FtZS5iYXNlKCk7XHJcbiAgICAgIHRoaXMuYWRkU3ViZ29hbChuZXcgTmF2aWdhdGVUb1BvaW50KHRoaXMuYm90LCBiYXNlLmxvY2F0aW9uKSk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIEZsYWcgaXMgbm90IGhvbWUuXHJcbiAgICB0aGlzLmFkZFN1YmdvYWwobmV3IE9mZmVuc2l2ZURlZmVuc2UodGhpcy5ib3QpKTtcclxuICB9XHJcbn07XHJcblxyXG5EZWZlbnNlLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5hY3RpdmF0ZUlmSW5hY3RpdmUoKTtcclxuXHJcbiAgdmFyIHN0YXR1cyA9IHRoaXMucHJvY2Vzc1N1YmdvYWxzKCk7XHJcbiAgaWYgKHN0YXR1cyAhPT0gR29hbFN0YXR1cy5hY3RpdmUpIHtcclxuICAgIHRoaXMuYWN0aXZhdGUoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzLnN0YXR1cztcclxufTtcclxuXHJcbkRlZmVuc2UucHJvdG90eXBlLmhhbmRsZU1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpIHtcclxuICAvLyBFbmVteSB0YWtlcyBmbGFnLCByZXNvcnQgdG8gb3V0LW9mLWJhc2UgZGVmZW5zZS5cclxuICAvLyBPdXIvRW5lbXkgZmxhZyBoYXMgYmVlbiByZXR1cm5lZC5cclxuICAvLyBPdXIvRW5lbXkgZmxhZyBoYXMgYmVlbiB0YWtlbi5cclxuICAvLyBEZWZhdWx0IGJlaGF2aW9yLlxyXG4gIHJldHVybiB0aGlzLmZvcndhcmRUb0ZpcnN0U3ViZ29hbChtc2cpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEltcGxlbWVudHMgc3RyYXRlZ2llcyBhbmQgYmVoYXZpb3JzIHJlbGF0ZWQgdG8gdGhlIGdvYWwgb2YgaW4tYmFzZVxyXG4gKiBkZWZlbnNlLiBBc3N1bWVzIHdlJ3JlIGxvY2F0ZWQgaW4tYmFzZS5cclxuICovXHJcbnZhciBEZWZlbmRGbGFnID0gZnVuY3Rpb24oYm90KSB7XHJcbiAgQ29tcG9zaXRlR29hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuaW5oZXJpdHMoRGVmZW5kRmxhZywgQ29tcG9zaXRlR29hbCk7XHJcblxyXG5EZWZlbmRGbGFnLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuc3RhdHVzID0gR29hbFN0YXR1cy5hY3RpdmU7XHJcbiAgLy8gUGxheSBuby1ncmFiIGZvciBub3cuXHJcbiAgLy9pZiAoIXRoaXMuaXNGaXJzdFN1YmdvYWwoTm9HcmFiRGVmZW5zZSkpIHtcclxuICAgIHRoaXMucmVtb3ZlQWxsU3ViZ29hbHMoKTtcclxuICAgIHRoaXMuYWRkU3ViZ29hbChuZXcgTm9HcmFiRGVmZW5zZSh0aGlzLmJvdCkpO1xyXG4gIC8vfVxyXG59O1xyXG5cclxuRGVmZW5kRmxhZy5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuYWN0aXZhdGVJZkluYWN0aXZlKCk7XHJcbiAgdGhpcy5zdGF0dXMgPSB0aGlzLnByb2Nlc3NTdWJnb2FscygpO1xyXG4gIHJldHVybiB0aGlzLnN0YXR1cztcclxufTtcclxuXHJcbkRlZmVuZEZsYWcucHJvdG90eXBlLmhhbmRsZU1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpIHtcclxuICAvLyBQb3dlcnVwIHZhbHVlIGNvbnNpZGVyYXRpb24uXHJcbiAgLy8gQWRkaXRpb25hbCBlbmVtaWVzIHByZXNlbnQgaW4gYmFzZS5cclxuICAvLyBEZWZhdWx0IGJlaGF2aW9yLlxyXG4gIHJldHVybiB0aGlzLmZvcndhcmRUb0ZpcnN0U3ViZ29hbChtc2cpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhvbGRzIHRoZSBzdHJhdGVneSBvZiBuby1ncmFiIGRlZmVuc2UuIFB1c2ggZW5lbWllcyBhd2F5IGZyb21cclxuICogb3duIGZsYWcuXHJcbiAqL1xyXG52YXIgTm9HcmFiRGVmZW5zZSA9IGZ1bmN0aW9uKGJvdCkge1xyXG4gIENvbXBvc2l0ZUdvYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcbmluaGVyaXRzKE5vR3JhYkRlZmVuc2UsIENvbXBvc2l0ZUdvYWwpO1xyXG5cclxuTm9HcmFiRGVmZW5zZS5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnN0YXR1cyA9IEdvYWxTdGF0dXMuYWN0aXZlO1xyXG4gIC8vIFNlbGVjdCB0YXJnZXQgZW5lbXkuXHJcbiAgdmFyIGVuZW1pZXMgPSB0aGlzLmJvdC5nYW1lLmVuZW1pZXNJbkJhc2UoKTtcclxuICBpZiAoZW5lbWllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAvLyBTZWxlY3QgZmlyc3QgZm9yIG5vdy5cclxuICAgIHZhciB0YXJnZXQgPSBlbmVtaWVzWzBdO1xyXG4gICAgdmFyIGJhc2UgPSB0aGlzLmJvdC5nYW1lLmJhc2UoKS5sb2NhdGlvbjtcclxuICAgIHRoaXMuYWRkU3ViZ29hbChuZXcgS2VlcFBsYXllckZyb21Qb2ludCh0aGlzLmJvdCwgdGFyZ2V0LmlkLCBiYXNlKSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIE5vdGhpbmcgbm93LlxyXG4gIH1cclxufTtcclxuXHJcbk5vR3JhYkRlZmVuc2UucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLmFjdGl2YXRlSWZJbmFjdGl2ZSgpO1xyXG5cclxuICB0aGlzLnN0YXR1cyA9IHRoaXMucHJvY2Vzc1N1YmdvYWxzKCk7XHJcblxyXG4gIHJldHVybiB0aGlzLnN0YXR1cztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQdXNoIGFuIGVuZW15IGF3YXkgZnJvbSB0aGUgZmxhZy5cclxuICogQHBhcmFtIHtCb3R9IGJvdCAtIFRoZSBib3QuXHJcbiAqIEBwYXJhbSB7aW50ZWdlcn0gdGFyZ2V0IC0gVGhlIGlkIG9mIHRoZSBwbGF5ZXIgdG8gcHVzaCBhd2F5IGZyb21cclxuICogICB0aGUgZmxhZy5cclxuICogQHBhcmFtIHtQb2ludH0gcG9pbnQgLSBUaGUgcG9pbnQgdG8ga2VlcCB0aGUgdGFyZ2V0IGF3YXkgZnJvbS5cclxuICovXHJcbnZhciBLZWVwUGxheWVyRnJvbVBvaW50ID0gZnVuY3Rpb24oYm90LCB0YXJnZXQsIHBvaW50KSB7XHJcbiAgQ29tcG9zaXRlR29hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gIHRoaXMudGFyZ2V0ID0gdGhpcy5ib3QuZ2FtZS5wbGF5ZXIodGFyZ2V0KTtcclxuICB0aGlzLnBvaW50ID0gcG9pbnQ7XHJcbn07XHJcblxyXG5pbmhlcml0cyhLZWVwUGxheWVyRnJvbVBvaW50LCBDb21wb3NpdGVHb2FsKTtcclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgdGhhdCBwbGF5ZXIgaXMgaW4tYmV0d2VlbiB0YXJnZXQgcGxheWVyIGFuZCBwb2ludCwgZ2V0dGluZ1xyXG4gKiBiZXR3ZWVuIGlmIG5lY2Vzc2FyeSBhbmQgcHVzaGluZyBhd2F5LlxyXG4gKi9cclxuS2VlcFBsYXllckZyb21Qb2ludC5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnN0YXR1cyA9IEdvYWxTdGF0dXMuYWN0aXZlO1xyXG4gIC8vIFRoZSBtYXJnaW4gZm9yIGNoZWNraW5nIHdoZXRoZXIgcGxheWVyIGlzIGJldHdlZW4gdGhlIHR3byBwb2ludHMuXHJcbiAgdmFyIG1hcmdpbiA9IDIwO1xyXG4gIHZhciBwbGF5ZXJQb3MgPSB0aGlzLmJvdC5nYW1lLmxvY2F0aW9uKCk7XHJcbiAgdmFyIHRhcmdldFBvcyA9IHRoaXMuYm90LmdhbWUubG9jYXRpb24odGhpcy50YXJnZXQuaWQpO1xyXG4gIHZhciBmbGFnUG9zID0gdGhpcy5wb2ludDtcclxuICBpZiAodGhpcy5ib3QuZ2FtZS5pc0ludGVycG9zZWQocGxheWVyUG9zLCB0YXJnZXRQb3MsIGZsYWdQb3MpKSB7XHJcbiAgICAvLyBQbGF5ZXIgaXMgYmV0d2VlbiB0YXJnZXQgYW5kIGZsYWcuXHJcbiAgICB0aGlzLmJvdC5jaGF0KFwiSSdtIGJldHdlZW4gdGFyZ2V0IGFuZCBmbGFnLlwiKTtcclxuICAgIC8vdGhpcy5hZGRTdWJnb2FsKG5ldyApXHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIFBsYXllciBpcyBub3QgYmV0d2VlbiB0YXJnZXQgYW5kIGZsYWcuXHJcbiAgICB0aGlzLmFkZFN1YmdvYWwobmV3IFN0YXRpY0ludGVycG9zZSh0aGlzLmJvdCwgdGhpcy50YXJnZXQuaWQsIHRoaXMucG9pbnQpKTtcclxuICB9XHJcbn07XHJcblxyXG5LZWVwUGxheWVyRnJvbVBvaW50LnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5hY3RpdmF0ZUlmSW5hY3RpdmUoKTtcclxuXHJcbiAgdmFyIHN0YXR1cyA9IHRoaXMucHJvY2Vzc1N1YmdvYWxzKCk7XHJcbiAgaWYgKHN0YXR1cyA9PSBHb2FsU3RhdHVzLmNvbXBsZXRlZCkge1xyXG4gICAgLy8gU2V0IHRvIGluYWN0aXZlIHNvIHdlIHJ1biBhY3RpdmF0ZSBuZXh0IHRpY2suXHJcbiAgICB0aGlzLnN0YXR1cyA9IEdvYWxTdGF0dXMuaW5hY3RpdmU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcy5zdGF0dXM7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IGluLWJldHdlZW4gYSB0YXJnZXQgYW5kIHN0YXRpYyBwb2ludC5cclxuICogQHBhcmFtIHtCb3R9IGJvdCAtIFRoZSBib3QuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0YXJnZXQgLSBUaGUgaWQgb2YgdGhlIHBsYXllciB0byBwdXNoIGF3YXkgZnJvbVxyXG4gKiAgIHRoZSBmbGFnLlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwb2ludCAtIFRoZSBwb2ludCB0byBrZWVwIHRoZSB0YXJnZXQgYXdheSBmcm9tLlxyXG4gKi9cclxudmFyIFN0YXRpY0ludGVycG9zZSA9IGZ1bmN0aW9uKGJvdCwgdGFyZ2V0LCBwb2ludCkge1xyXG4gIENvbXBvc2l0ZUdvYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB0aGlzLnRhcmdldCA9IHRoaXMuYm90LmdhbWUucGxheWVyKHRhcmdldCk7XHJcbiAgdGhpcy5wb2ludCA9IHBvaW50O1xyXG59O1xyXG5cclxuaW5oZXJpdHMoU3RhdGljSW50ZXJwb3NlLCBDb21wb3NpdGVHb2FsKTtcclxuXHJcblN0YXRpY0ludGVycG9zZS5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnN0YXR1cyA9IEdvYWxTdGF0dXMuYWN0aXZlO1xyXG5cclxuICB2YXIgcG9zID0gdGhpcy5ib3QuZ2FtZS5sb2NhdGlvbigpO1xyXG4gIHZhciBlbmVteVBvcyA9IHRoaXMuYm90LmdhbWUubG9jYXRpb24odGhpcy50YXJnZXQuaWQpO1xyXG4gIHZhciBwb2ludCA9IHRoaXMucG9pbnQ7XHJcblxyXG4gIGlmICghdGhpcy5ib3QuZ2FtZS5pc0ludGVycG9zZWQocG9zLCBlbmVteVBvcywgcG9pbnQpKSB7XHJcbiAgICAvLyBHZXQgcG9zaXRpb24gdG8gc2VlayB0b3dhcmRzLlxyXG4gICAgdmFyIHZlbCA9IHRoaXMuYm90LmdhbWUudmVsb2NpdHkoKTtcclxuXHJcbiAgICB2YXIgZW5lbXlWZWwgPSB0aGlzLmJvdC5nYW1lLnZlbG9jaXR5KHRoaXMudGFyZ2V0LmlkKTtcclxuICAgIC8vIFBvaW50IHRvIHNlZWsgYmV0d2VlbiB0d28gb2JqZWN0cy5cclxuICAgIHZhciBtaWRwb2ludCA9IHBvaW50LmFkZChlbmVteVBvcykuZGl2KDIpO1xyXG4gICAgdGhpcy5hZGRTdWJnb2FsKG5ldyBTZWVrVG9Qb2ludCh0aGlzLmJvdCwgbWlkcG9pbnQpKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5zdGF0dXMgPSBHb2FsU3RhdHVzLmNvbXBsZXRlZDtcclxuICB9XHJcbn07XHJcblxyXG5TdGF0aWNJbnRlcnBvc2UucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgc3RhdHVzID0gdGhpcy5wcm9jZXNzU3ViZ29hbHMoKTtcclxuICBpZiAoc3RhdHVzICE9PSBHb2FsU3RhdHVzLmFjdGl2ZSkge1xyXG4gICAgdGhpcy5hY3RpdmF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXMuc3RhdHVzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRyaWVzIHRvIHB1c2ggYSB0YXJnZXQgcGxheWVyIGF3YXkgYWxvbmcgYSByYXkgZW1hbmF0aW5nIGZyb20gYVxyXG4gKiBwb2ludC5cclxuICogQHBhcmFtIHtCb3R9IGJvdCAtIFRoZSBCb3QuXHJcbiAqIEBwYXJhbSB7UGxheWVyfSB0YXJnZXQgLSBUaGUgdGFyZ2V0IHBsYXllci5cclxuICogQHBhcmFtIHtQb2ludH0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gcHVzaCB0aGUgcGxheWVyIGZyb20uXHJcbiAqIEBwYXJhbSB7UG9pbnR9IHJheSAtIFVuaXQgdmVjdG9yIGRpcmVjdGlvbiBmcm9tIHBvaW50IGluIHdoaWNoIHRvXHJcbiAqICAgcHVzaCB0aGUgcGxheWVyLlxyXG4gKi9cclxudmFyIFB1c2hQbGF5ZXJBd2F5ID0gZnVuY3Rpb24oYm90LCB0YXJnZXQsIHBvaW50LCByYXkpIHtcclxuICBHb2FsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgdGhpcy5wb2ludCA9IHBvaW50O1xyXG4gIHRoaXMucmF5ID0gcmF5O1xyXG59O1xyXG5cclxuaW5oZXJpdHMoUHVzaFBsYXllckF3YXksIEdvYWwpO1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIHRoYXQgdGFyZ2V0IHBsYXllciBpcyB3aXRoaW4gYSBtYXJnaW4gb2YgdGhlIHRhcmdldCByYXksXHJcbiAqIGZhaWxpbmcgaWYgdGhleSBhcmUgdG9vIGZhci5cclxuICovXHJcblB1c2hQbGF5ZXJBd2F5LnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIFxyXG59O1xyXG5cclxuUHVzaFBsYXllckF3YXkucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbigpIHtcclxuICBcclxufTtcclxuXHJcbnZhciBDb250YWlubWVudERlZmVuc2UgPSBmdW5jdGlvbihib3QpIHtcclxuICBDb21wb3NpdGVHb2FsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5pbmhlcml0cyhDb250YWlubWVudERlZmVuc2UsIENvbXBvc2l0ZUdvYWwpO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBEZWZlbnNlIHN0cmF0ZWd5IHRvIHVzZSB3aGVuIGZsYWcgaXMgb3V0LW9mLWJhc2UuXHJcbiAqL1xyXG52YXIgT2ZmZW5zaXZlRGVmZW5zZSA9IGZ1bmN0aW9uKGJvdCkge1xyXG4gIENvbXBvc2l0ZUdvYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcbmluaGVyaXRzKE9mZmVuc2l2ZURlZmVuc2UsIENvbXBvc2l0ZUdvYWwpO1xyXG5cclxuT2ZmZW5zaXZlRGVmZW5zZS5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnN0YXR1cyA9IEdvYWxTdGF0dXMuYWN0aXZlO1xyXG59O1xyXG5cclxuT2ZmZW5zaXZlRGVmZW5zZS5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuYWN0aXZhdGVJZkluYWN0aXZlKCk7XHJcblxyXG4gIHRoaXMuc3RhdHVzID0gdGhpcy5wcm9jZXNzU3ViZ29hbHMoKTtcclxuXHJcbiAgcmV0dXJuIHRoaXMuc3RhdHVzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoaXMgZ29hbCBuYXZpZ2F0ZXMgdG8gdGhlIGdpdmVuIHBvaW50LCB3aGVyZSB0aGUgcG9pbnQgbWF5IGJlXHJcbiAqIGEgc3RhdGljIGxvY2F0aW9uIGFueXdoZXJlIGluIHRoZSB0cmF2ZXJzYWJsZSBhcmVhIG9mIHRoZSBnYW1lXHJcbiAqIG1hcC5cclxuICogQHBhcmFtIHtCb3R9IGJvdCAtIFRoZSBib3QuXHJcbiAqIEBwYXJhbSB7UG9pbnR9IHBvaW50IC0gVGhlIHBvaW50IHRvIG5hdmlnYXRlIHRvLlxyXG4gKi9cclxudmFyIE5hdmlnYXRlVG9Qb2ludCA9IGZ1bmN0aW9uKGJvdCwgcG9pbnQpIHtcclxuICBDb21wb3NpdGVHb2FsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgdGhpcy5wb2ludCA9IHBvaW50O1xyXG59O1xyXG5cclxuaW5oZXJpdHMoTmF2aWdhdGVUb1BvaW50LCBDb21wb3NpdGVHb2FsKTtcclxuXHJcbk5hdmlnYXRlVG9Qb2ludC5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnN0YXR1cyA9IEdvYWxTdGF0dXMuYWN0aXZlO1xyXG4gIHZhciBzdGFydCA9IHRoaXMuYm90LmdhbWUubG9jYXRpb24oKTtcclxuICB2YXIgZW5kID0gdGhpcy5wb2ludDtcclxuXHJcbiAgdGhpcy5yZW1vdmVBbGxTdWJnb2FscygpO1xyXG5cclxuICAvLyBBZGQgc3ViZ29hbCB0byBjYWxjdWxhdGUgdGhlIHBhdGguXHJcbiAgdGhpcy5hZGRTdWJnb2FsKG5ldyBDYWxjdWxhdGVQYXRoKHRoaXMuYm90LCBzdGFydCwgZW5kLCBmdW5jdGlvbihwYXRoKSB7XHJcbiAgICBpZiAocGF0aCkge1xyXG4gICAgICB0aGlzLmFkZFN1YmdvYWwobmV3IEZvbGxvd1BhdGgodGhpcy5ib3QsIHBhdGgpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIEhhbmRsZSBubyBwYXRoIGJlaW5nIGZvdW5kLlxyXG4gICAgICAvLyBwYXNzIGJhY2sgdXAgYW5kIHJldHJ5IGEgc3BlY2lmaWMgbnVtYmVyIG9mIHRpbWVzP1xyXG4gICAgfVxyXG4gIH0uYmluZCh0aGlzKSkpO1xyXG59O1xyXG5cclxuTmF2aWdhdGVUb1BvaW50LnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5hY3RpdmF0ZUlmSW5hY3RpdmUoKTtcclxuICBcclxuICB0aGlzLnN0YXR1cyA9IHRoaXMucHJvY2Vzc1N1YmdvYWxzKCk7XHJcblxyXG4gIHJldHVybiB0aGlzLnN0YXR1cztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBIYW5kbGVzIG5hdlVwZGF0ZSBtZXNzYWdlLlxyXG4gKi9cclxuTmF2aWdhdGVUb1BvaW50LnByb3RvdHlwZS5oYW5kbGVNZXNzYWdlID0gZnVuY3Rpb24obXNnKSB7XHJcbiAgaWYgKG1zZyA9PSBcIm5hdlVwZGF0ZVwiKSB7XHJcbiAgICAvLyBJbmFjdGl2YXRlIHNvIHdlIGZpbmQgYSBkaWZmZXJlbnQgcGF0aC5cclxuICAgIHRoaXMuc3RhdHVzID0gR29hbFN0YXR1cy5pbmFjdGl2ZTtcclxuICAgIC8vIHRvZG86IGluY29ycG9yYXRlIHBhcnRpYWwgcGF0aCB1cGRhdGUuXHJcbiAgICAvLyBjb25zaWRlciBidXR0b24gcHJlc3Npbmcgb24gZHluYW1pYyBvYnN0YWNsZXMuXHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENhbGxiYWNrIGZ1bmN0aW9uIHRvIHRoZSBDYWxjdWxhdGVQYXRoIGdvYWwuXHJcbiAqIEBjYWxsYmFjayBQYXRoQ2FsbGJhY2tcclxuICogQHBhcmFtIHs/QXJyYXkuPFBvaW50TGlrZT59IC0gVGhlIHBhdGgsIG9yIG51bGwgaWYgdGhlIHBhdGggd2FzXHJcbiAqICAgbm90IGZvdW5kLlxyXG4gKi9cclxuLyoqXHJcbiAqIFRoaXMgZ29hbCBjYWxjdWxhdGVzIGEgcGF0aCBmcm9tIHRoZSBzdGFydCB0byB0aGUgZW5kIHBvaW50cyBhbmRcclxuICogY2FsbHMgdGhlIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIHRoZSBwYXRoIGlzIGNhbGN1bGF0ZWQuXHJcbiAqIEBwYXJhbSB7Qm90fSBib3QgLSBUaGUgYm90LlxyXG4gKiBAcGFyYW0ge1BvaW50fSBzdGFydCAtIFRoZSBzdGFydCBsb2NhdGlvbiBmb3IgdGhlIHBhdGguXHJcbiAqIEBwYXJhbSB7UG9pbnR9IGVuZCAtIFRoZSBlbmQgbG9jYXRpb24gZm9yIHRoZSBwYXRoLlxyXG4gKiBAcGFyYW0ge30gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZVxyXG4gKiAgIHBhdGggaGFzIGJlZW4gY2FsY3VsYXRlZC5cclxuICovXHJcbnZhciBDYWxjdWxhdGVQYXRoID0gZnVuY3Rpb24oYm90LCBzdGFydCwgZW5kLCBjYWxsYmFjaykge1xyXG4gIEdvYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XHJcbiAgdGhpcy5lbmQgPSBlbmQ7XHJcbiAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG59O1xyXG5cclxuaW5oZXJpdHMoQ2FsY3VsYXRlUGF0aCwgR29hbCk7XHJcblxyXG5DYWxjdWxhdGVQYXRoLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuc3RhdHVzID0gR29hbFN0YXR1cy53YWl0aW5nO1xyXG4gIC8vIENhbGN1bGF0ZSBwYXRoLlxyXG4gIHRoaXMuYm90Lm5hdm1lc2guY2FsY3VsYXRlUGF0aCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgZnVuY3Rpb24ocGF0aCkge1xyXG4gICAgaWYgKHBhdGgpIHtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBHb2FsU3RhdHVzLmNvbXBsZXRlZDtcclxuICAgICAgcGF0aCA9IHRoaXMuX3Bvc3RQcm9jZXNzUGF0aChwYXRoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzID0gR29hbFN0YXR1cy5mYWlsZWQ7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNhbGxiYWNrKHBhdGgpO1xyXG4gIH0uYmluZCh0aGlzKSk7XHJcbn07XHJcblxyXG5DYWxjdWxhdGVQYXRoLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5hY3RpdmF0ZUlmSW5hY3RpdmUoKTtcclxuICByZXR1cm4gdGhpcy5zdGF0dXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUG9zdC1wcm9jZXNzIGEgcGF0aCB0byBtb3ZlIGl0IGF3YXkgZnJvbSBvYnN0YWNsZXMuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFBvaW50Pn0gcGF0aCAtIFRoZSBwYXRoIHRvIHByb2Nlc3MuXHJcbiAqIEByZXR1cm4ge0FycmF5LjxQb2ludD59IC0gVGhlIHByb2Nlc3NlZCBwYXRoLlxyXG4gKi9cclxuQ2FsY3VsYXRlUGF0aC5wcm90b3R5cGUuX3Bvc3RQcm9jZXNzUGF0aCA9IGZ1bmN0aW9uKHBhdGgpIHtcclxuICAvLyBDb252ZXJ0IHBvaW50LWxpa2UgcGF0aCBjb29yZGluYXRlcyB0byBwb2ludCBvYmplY3RzLlxyXG4gIHBhdGggPSBwYXRoLm1hcChQb2ludC5mcm9tUG9pbnRMaWtlKTtcclxuXHJcbiAgLy8gUmVtb3ZlIGN1cnJlbnQgcG9pbnQuXHJcbiAgaWYgKHBhdGgubGVuZ3RoID4gMSkge1xyXG4gICAgcGF0aC5zaGlmdCgpO1xyXG4gIH1cclxuICB2YXIgc3Bpa2VzID0gdGhpcy5ib3QuZ2FtZS5nZXRzcGlrZXMoKTtcclxuICAvLyBUaGUgYWRkaXRpb25hbCBidWZmZXIgdG8gZ2l2ZSB0aGUgb2JzdGFjbGVzLlxyXG4gIHZhciBidWZmZXIgPSB0aGlzLmJvdC5zcGlrZV9idWZmZXIgfHwgMjA7XHJcbiAgLy8gVGhlIHRocmVzaG9sZCBmb3IgZGV0ZXJtaW5pbmcgcG9pbnRzIHdoaWNoIGFyZSAnY2xvc2UnIHRvXHJcbiAgLy8gb2JzdGFjbGVzLlxyXG4gIHZhciB0aHJlc2hvbGQgPSB0aGlzLmJvdC5zcGlrZV90aHJlc2hvbGQgfHwgNjA7XHJcbiAgdmFyIHNwaWtlc0J5UG9pbnQgPSBuZXcgTWFwKCk7XHJcbiAgcGF0aC5mb3JFYWNoKGZ1bmN0aW9uKHBvaW50KSB7XHJcbiAgICB2YXIgY2xvc2VTcGlrZXMgPSBbXTtcclxuICAgIHNwaWtlcy5mb3JFYWNoKGZ1bmN0aW9uKHNwaWtlKSB7XHJcbiAgICAgIGlmIChzcGlrZS5kaXN0KHBvaW50KSA8IHRocmVzaG9sZCkge1xyXG4gICAgICAgIGNsb3NlU3Bpa2VzLnB1c2goc3Bpa2UpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGlmIChjbG9zZVNwaWtlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHNwaWtlc0J5UG9pbnQuc2V0KHBvaW50LCBjbG9zZVNwaWtlcyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgcG9pbnQgPSBwYXRoW2ldO1xyXG4gICAgaWYgKHNwaWtlc0J5UG9pbnQuaGFzKHBvaW50KSkge1xyXG4gICAgICB2YXIgb2JzdGFjbGVzID0gc3Bpa2VzQnlQb2ludC5nZXQocG9pbnQpO1xyXG4gICAgICBpZiAob2JzdGFjbGVzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgLy8gTW92ZSBhd2F5IGZyb20gdGhlIHNpbmdsZSBwb2ludC5cclxuICAgICAgICB2YXIgb2JzdGFjbGUgPSBvYnN0YWNsZXNbMF07XHJcbiAgICAgICAgdmFyIHYgPSBwb2ludC5zdWIob2JzdGFjbGUpO1xyXG4gICAgICAgIHZhciBsZW4gPSB2LmxlbigpO1xyXG4gICAgICAgIHZhciBuZXdQb2ludCA9IG9ic3RhY2xlLmFkZCh2Lm11bCgxICsgYnVmZmVyIC8gbGVuKSk7XHJcbiAgICAgICAgcGF0aFtpXSA9IG5ld1BvaW50O1xyXG4gICAgICB9IGVsc2UgaWYgKG9ic3RhY2xlcy5sZW5ndGggPT0gMikge1xyXG4gICAgICAgIC8vIE1vdmUgYXdheSBmcm9tIGJvdGggb2JzdGFjbGVzLlxyXG4gICAgICAgIHZhciBjZW50ZXIgPSBvYnN0YWNsZXNbMV0uYWRkKG9ic3RhY2xlc1swXS5zdWIob2JzdGFjbGVzWzFdKS5tdWwoMC41KSk7XHJcbiAgICAgICAgdmFyIHYgPSBwb2ludC5zdWIoY2VudGVyKTtcclxuICAgICAgICB2YXIgbGVuID0gdi5sZW4oKTtcclxuICAgICAgICB2YXIgbmV3UG9pbnQgPSBjZW50ZXIuYWRkKHYubXVsKDEgKyAoYnVmZmVyICsgdGhyZXNob2xkKSAvIGxlbikpO1xyXG4gICAgICAgIHBhdGhbaV0gPSBuZXdQb2ludDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcGF0aDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGlzIGdvYWwgXHJcbiAqIEBwYXJhbSB7Qm90fSBib3QgLSBUaGUgYm90LlxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2ludD59IHBhdGggLSBUaGUgcGF0aCB0byBmb2xsb3cuXHJcbiAqL1xyXG52YXIgRm9sbG93UGF0aCA9IGZ1bmN0aW9uKGJvdCwgcGF0aCkge1xyXG4gIENvbXBvc2l0ZUdvYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gIHRoaXMuaXRlcmF0aW9uID0gMDtcclxuICB0aGlzLnJlYWN0aXZhdGVfdGhyZXNob2xkID0gMjA7XHJcbn07XHJcblxyXG5pbmhlcml0cyhGb2xsb3dQYXRoLCBDb21wb3NpdGVHb2FsKTtcclxuXHJcbkZvbGxvd1BhdGgucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5zdGF0dXMgPSBHb2FsU3RhdHVzLmFjdGl2ZTtcclxuICAvLyBHZXQgZnJvbnQgb2YgcGF0aC5cclxuICB2YXIgZGVzdGluYXRpb24gPSB0aGlzLl9nZXROZXh0KCk7XHJcblxyXG4gIC8vIHRyeSB0byBuYXZpZ2F0ZSB0byBmcm9udCBvZiBwYXRoLlxyXG4gIGlmIChkZXN0aW5hdGlvbikge1xyXG4gICAgaWYgKHRoaXMuc3ViZ29hbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICB2YXIgc3ViZ29hbCA9IHRoaXMuc3ViZ29hbHNbMF07XHJcbiAgICAgIGlmIChzdWJnb2FsLnBvaW50ICYmIHN1YmdvYWwucG9pbnQubmVxKGRlc3RpbmF0aW9uKSkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsU3ViZ29hbHMoKTtcclxuICAgICAgICB0aGlzLmFkZFN1YmdvYWwobmV3IFNlZWtUb1BvaW50KHRoaXMuYm90LCBkZXN0aW5hdGlvbikpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmFkZFN1YmdvYWwobmV3IFNlZWtUb1BvaW50KHRoaXMuYm90LCBkZXN0aW5hdGlvbikpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLnN0YXR1cyA9IEdvYWxTdGF0dXMuZmFpbGVkO1xyXG4gIH1cclxuXHJcbiAgLy8gSWYgZnJvbnQgb2YgcGF0aCBpcyBub3QgdmlzaWJsZSwgc2V0IGZhaWxlZC4gLSBtYXkgbmVlZCB0byBkb1xyXG4gIC8vIGxvd2VyIGluIGdvYWwgaGllcmFyY2h5LlxyXG59O1xyXG5cclxuRm9sbG93UGF0aC5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuaXRlcmF0aW9uKys7XHJcbiAgaWYgKHRoaXMuaXRlcmF0aW9uID09IHRoaXMucmVhY3RpdmF0ZV90aHJlc2hvbGQpIHtcclxuICAgIHRoaXMuc3RhdHVzID0gR29hbFN0YXR1cy5pbmFjdGl2ZTtcclxuICAgIHRoaXMuaXRlcmF0aW9uID0gMDtcclxuICB9XHJcbiAgdGhpcy5hY3RpdmF0ZUlmSW5hY3RpdmUoKTtcclxuXHJcbiAgaWYgKHRoaXMuc3RhdHVzICE9PSBHb2FsU3RhdHVzLmZhaWxlZCkge1xyXG4gICAgdmFyIHN0YXR1cyA9IHRoaXMucHJvY2Vzc1N1YmdvYWxzKCk7XHJcbiAgICAvLyBBZGQgbmV4dCBwb2ludCBvbnRvIHBhdGggaWYgcG9zc2libGUuXHJcbiAgICBpZiAoc3RhdHVzID09IEdvYWxTdGF0dXMuY29tcGxldGVkICYmIHRoaXMucGF0aC5sZW5ndGggIT09IDIpIHtcclxuICAgICAgdGhpcy5hY3RpdmF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXMuc3RhdHVzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgbmV4dCBwb2ludCBhbG9uZyB0aGUgcGF0aC5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtpbnRlZ2VyfSBbbGltaXRdIC0gSWYgcHJvdmlkZWQsIGxpbWl0cyB0aGUgbnVtYmVyIG9mXHJcbiAqICAgcG9pbnRzIGFoZWFkIG9uIHRoZSBwYXRoIHRoYXQgd2lsbCBiZSBjaGVja2VkIGZvciB2aXNpYmlsaXR5LlxyXG4gKiBAcmV0dXJuIHtQb2ludH0gLSBUaGUgbmV4dCBwb2ludCBvbiB0aGUgcGF0aCB0byBuYXZpZ2F0ZSB0by5cclxuICovXHJcbkZvbGxvd1BhdGgucHJvdG90eXBlLl9nZXROZXh0ID0gZnVuY3Rpb24obGltaXQpIHtcclxuICBpZiAodHlwZW9mIGxpbWl0ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBsaW1pdCA9IHRoaXMucGF0aC5sZW5ndGg7XHJcbiAgfSBlbHNlIHtcclxuICAgIGxpbWl0ID0gTWF0aC5taW4obGltaXQsIHRoaXMucGF0aC5sZW5ndGgpO1xyXG4gIH1cclxuICBpZiAoIXRoaXMucGF0aClcclxuICAgIHJldHVybjtcclxuXHJcbiAgdmFyIGdvYWwgPSBmYWxzZTtcclxuICB2YXIgcGF0aCA9IHRoaXMucGF0aC5zbGljZSgpO1xyXG4gIC8vIEZpbmQgbmV4dCBsb2NhdGlvbiB0byBzZWVrIG91dCBpbiBwYXRoLlxyXG4gIGlmIChwYXRoLmxlbmd0aCA+IDApIHtcclxuICAgIHZhciBtZSA9IHRoaXMuYm90LmdhbWUubG9jYXRpb24oKTtcclxuICAgIHZhciBhbnlWaXNpYmxlID0gZmFsc2U7XHJcbiAgICB2YXIgbGFzdF9pbmRleCA9IDA7XHJcbiAgICBnb2FsID0gcGF0aFswXTtcclxuXHJcbiAgICAvLyBHZXQgcG9pbnQgZnVydGhlc3QgYWxvbmcgcGF0aCB0aGF0IGlzIHZpc2libGUgZnJvbSBjdXJyZW50XHJcbiAgICAvLyBsb2NhdGlvbi5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGltaXQ7IGkrKykge1xyXG4gICAgICB2YXIgcG9pbnQgPSBwYXRoW2ldO1xyXG4gICAgICBpZiAodGhpcy5ib3QubmF2bWVzaC5jaGVja1Zpc2libGUobWUsIHBvaW50KSkge1xyXG4gICAgICAgIGdvYWwgPSBwb2ludDtcclxuICAgICAgICBsYXN0X2luZGV4ID0gaTtcclxuICAgICAgICBhbnlWaXNpYmxlID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBJZiB3ZSdyZSB2ZXJ5IG5lYXIgYSBwb2ludCwgcmVtb3ZlIGl0IGFuZCBoZWFkIHRvd2FyZHMgdGhlXHJcbiAgICAgICAgLy8gbmV4dCBvbmUuXHJcbiAgICAgICAgaWYgKG1lLmRpc3QoZ29hbCkgPCAyMCkge1xyXG4gICAgICAgICAgbGFzdF9pbmRleCA9IGk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFueVZpc2libGUpIHtcclxuICAgICAgcGF0aCA9IHBhdGguc2xpY2UobGFzdF9pbmRleCk7XHJcbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgZ29hbCA9IHBhdGhbMF07XHJcbiAgICAgICAgaWYgKG1lLmRpc3QoZ29hbCkgPCAyMCkge1xyXG4gICAgICAgICAgZ29hbCA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy5zdGF0dXMgPSBHb2FsU3RhdHVzLmNvbXBsZXRlZDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGdvYWwgPSBmYWxzZTtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBHb2FsU3RhdHVzLmZhaWxlZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBib3Qgc3RhdGUuXHJcbiAgaWYgKGdvYWwpIHtcclxuICAgIHRoaXMuYm90LmRyYXcudXBkYXRlUG9pbnQoXCJnb2FsXCIsIGdvYWwpO1xyXG4gICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICB9XHJcbiAgcmV0dXJuIGdvYWw7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VlayB0byB0aGUgZ2l2ZW4gcG9pbnQsIHdoaWNoIGlzIGFzc3VtZWQgdG8gYmUgYSBzdGF0aWMgcG9pbnQgaW5cclxuICogdGhlIGxpbmUtb2Ytc2lnaHQgb2YgdGhlIGJvdC5cclxuICogQHBhcmFtIHtCb3R9IGJvdFxyXG4gKiBAcGFyYW0ge1BvaW50fSBwb2ludCAtIFRoZSBwb2ludCB0byBuYXZpZ2F0ZSB0by5cclxuICovXHJcbnZhciBTZWVrVG9Qb2ludCA9IGZ1bmN0aW9uKGJvdCwgcG9pbnQpIHtcclxuICBDb21wb3NpdGVHb2FsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgdGhpcy5wb2ludCA9IHBvaW50O1xyXG59O1xyXG5cclxuaW5oZXJpdHMoU2Vla1RvUG9pbnQsIEdvYWwpO1xyXG5cclxuU2Vla1RvUG9pbnQucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5zdGF0dXMgPSBHb2FsU3RhdHVzLmFjdGl2ZTtcclxuXHJcbiAgLy8gU2V0IGJvdCBzdGVlcmluZyB0YXJnZXQuXHJcbiAgdGhpcy5ib3Quc2V0VGFyZ2V0KHRoaXMucG9pbnQpO1xyXG59O1xyXG5cclxuU2Vla1RvUG9pbnQucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLmFjdGl2YXRlSWZJbmFjdGl2ZSgpO1xyXG5cclxuICAvLyBDaGVjayBmb3IgZGVhdGguIC0gbWF5IG5lZWQgdG8gYmUgZG9uZSBoaWdoZXIgdXAuXHJcbiAgdmFyIHBvc2l0aW9uID0gdGhpcy5ib3QuZ2FtZS5sb2NhdGlvbigpO1xyXG4gIC8vIENoZWNrIGZvciBwb2ludCB2aXNpYmlsaXR5LlxyXG4gIC8vIENoZWNrIGlmIGF0IHBvc2l0aW9uLlxyXG4gIGlmIChwb3NpdGlvbi5kaXN0KHRoaXMucG9pbnQpIDwgMjApIHtcclxuICAgIHRoaXMuc3RhdHVzID0gR29hbFN0YXR1cy5jb21wbGV0ZWQ7XHJcbiAgICB0aGlzLmJvdC5zZXRUYXJnZXQoZmFsc2UpO1xyXG4gIH0gZWxzZSBpZiAoIXRoaXMuYm90Lm5hdm1lc2guY2hlY2tWaXNpYmxlKHBvc2l0aW9uLCB0aGlzLnBvaW50KSkge1xyXG4gICAgdGhpcy5zdGF0dXMgPSBHb2FsU3RhdHVzLmZhaWxlZDtcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzLnN0YXR1cztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbGVhbiB1cC5cclxuICovXHJcblNlZWtUb1BvaW50LnByb3RvdHlwZS50ZXJtaW5hdGUgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLmJvdC5zZXRUYXJnZXQoZmFsc2UpO1xyXG59O1xyXG4iLCJ2YXIgTG9nZ2VyID0gcmVxdWlyZSgnYnJhZ2knKTtcclxudmFyIEJvdCA9IHJlcXVpcmUoJy4vYm90Jyk7XHJcbnZhciBNb3ZlciA9IHJlcXVpcmUoJy4vYnJvd3Nlck1vdmVyJyk7XHJcbnZhciBHYW1lU3RhdGUgPSByZXF1aXJlKCcuL2Jyb3dzZXJHYW1lU3RhdGUnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgQnJvd3NlciBBZ2VudCBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgVGFnUHJvIGFnZW50IG1lYW50XHJcbiAqIHRvIHJ1biBpbiB0aGUgYnJvd3Nlci5cclxuICpcclxuICogQG1vZHVsZSBhZ2VudC9icm93c2VyXHJcbiAqL1xyXG5mdW5jdGlvbiB3YWl0Rm9yVGFncHJvUGxheWVyKGZuKSB7XHJcbiAgaWYgKHR5cGVvZiB0YWdwcm8gIT09IFwidW5kZWZpbmVkXCIgJiYgdGFncHJvLnBsYXllcnMgJiYgdGFncHJvLnBsYXllcklkKSB7XHJcbiAgICBmbigpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICB3YWl0Rm9yVGFncHJvUGxheWVyKGZuKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxud2FpdEZvclRhZ3Byb1BsYXllcihmdW5jdGlvbigpIHtcclxuICAvLyBJbml0aWFsaXplIGJyb3dzZXItc3BlY2lmaWMgc3RhdGUgYW5kIGFjdGlvbiB1dGlsaXRpZXMuXHJcbiAgdmFyIHN0YXRlID0gbmV3IEdhbWVTdGF0ZSh0YWdwcm8pO1xyXG4gIHZhciBtb3ZlciA9IG5ldyBNb3ZlcigpO1xyXG5cclxuICAvLyBTdGFydC5cclxuICB2YXIgYm90ID0gbmV3IEJvdChzdGF0ZSwgbW92ZXIsIExvZ2dlcik7XHJcblxyXG4gIHZhciBiYXNlVXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjgwMDAvc3JjL1wiO1xyXG5cclxuICAvLyBTZXQgdXAgVUkuXHJcbiAgJC5nZXQoYmFzZVVybCArIFwidWkuaHRtbFwiLCBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAkKCdib2R5JykuYXBwZW5kKGRhdGEpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBGb3IgZGVidWdnaW5nLlxyXG4gIGdsb2JhbC5teUJvdCA9IGJvdDtcclxufSk7XHJcbiIsIi8qKlxyXG4gKiBUaGUgR2FtZVN0YXRlIG9iamVjdCBpcyByZXNwb25zaWJsZSBmb3IgcHJvdmlkaW5nIGluZm9ybWF0aW9uXHJcbiAqIGFib3V0IHRoZSBlbnZpcm9ubWVudCwgaW5jbHVkaW5nIHRoZSBwbGF5ZXIncyBsb2NhdGlvbiB3aXRoaW4gaXQuXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAYWxpYXMgbW9kdWxlOmdhbWVzdGF0ZS9icm93c2VyXHJcbiAqIEBwYXJhbSB7VGFnUHJvfSB0YWdwcm8gLSBUaGUgaW5pdGlhbGl6ZWQgdGFncHJvIG9iamVjdCBhdmFpbGFibGVcclxuICogICBpbiB0aGUgYnJvd3NlciBjbGllbnQgZXhlY3V0aW9uIGVudmlyb25tZW50LlxyXG4gKi9cclxudmFyIEdhbWVTdGF0ZSA9IGZ1bmN0aW9uKHRhZ3Bybykge1xyXG4gIC8vIEluaXRpYWxpemF0aW9uXHJcbiAgdGhpcy50YWdwcm8gPSB0YWdwcm87XHJcbiAgdGhpcy5wYXJhbWV0ZXJzID0ge307XHJcbiAgLy8gSG9sZHMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGdhbWUgcGh5c2ljcyBwYXJhbWV0ZXJzLlxyXG4gIHRoaXMucGFyYW1ldGVycy5nYW1lID0ge1xyXG4gICAgc3RlcDogMWUzIC8gNjAsIC8vIFBoeXNpY3Mgc3RlcCBzaXplIGluIG1zLlxyXG4gICAgcmFkaXVzOiB7XHJcbiAgICAgIHNwaWtlOiAxNCxcclxuICAgICAgYmFsbDogMTlcclxuICAgIH1cclxuICB9O1xyXG4gIHRoaXMuc2VsZiA9IHRoaXMucGxheWVyKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVTdGF0ZTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgdXAgYnJvd3Nlci1iYXNlZCBvcHRpbWl6YXRpb25zIHRoYXQgd2lsbCBhc3Npc3QgaW4gcmV0cmlldmluZ1xyXG4gKiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZ2FtZSBzdGF0ZS5cclxuICovXHJcbkdhbWVTdGF0ZS5wcm90b3R5cGUub3B0aW1pemF0aW9ucyA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIE92ZXJyaWRpbmcgdGhpcyBmdW5jdGlvbiBhbGxvd3MgdGhlIHN0YXRlIG9mIHRoZSBib3gyZCBib2R5IHRvXHJcbiAgLy8gYmUgYWNjZXNzZWQgZnJvbSB0aGUgcGxheWVyIG9iamVjdC5cclxuICBCb3gyRC5EeW5hbWljcy5iMkJvZHkucHJvdG90eXBlLkdldFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgcGxheWVyID0gdGFncHJvLnBsYXllcnNbdGhpcy5wbGF5ZXIuaWRdO1xyXG4gICAgLy8gQXNzaWduIFwidGhpc1wiIHRvIFwicGxheWVyLmJvZHlcIi5cclxuICAgIHBsYXllci5ib2R5ID0gcGxheWVyLmJvZHkgfHwgdGhpcztcclxuICAgIFxyXG4gICAgLy8gUmV0dXJuIGN1cnJlbnQgcG9zaXRpb24uXHJcbiAgICByZXR1cm4gdGhpcy5tX3hmLnBvc2l0aW9uO1xyXG4gIH07XHJcbn07XHJcblxyXG5HYW1lU3RhdGUucHJvdG90eXBlLmluaXRpYWxpemVkID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuICEodHlwZW9mIHRhZ3BybyAhPT0gJ29iamVjdCcgfHwgIXRhZ3Byby5wbGF5ZXJJZCk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVnaXN0ZXIgYSBmdW5jdGlvbiB0byBsaXN0ZW4gZm9yIGEgc29ja2V0IGV2ZW50LlxyXG4gKi9cclxuR2FtZVN0YXRlLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcclxuICB0aGlzLnRhZ3Byby5zb2NrZXQub24oZXZlbnROYW1lLCBmbik7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHBsYXllciBnaXZlbiBieSBpZCwgb3IgYG51bGxgIGlmIG5vIHN1Y2ggcGxheWVyIGV4aXN0cy4gSWYgaWRcclxuICogaXMgbm90IHByb3ZpZGVkLCB0aGVuIHRoZSBjdXJyZW50IHBsYXllciBpcyByZXR1cm5lZC5cclxuICovXHJcbkdhbWVTdGF0ZS5wcm90b3R5cGUucGxheWVyID0gZnVuY3Rpb24oaWQpIHtcclxuICBpZiAodHlwZW9mIGlkID09ICd1bmRlZmluZWQnKSBpZCA9IHRoaXMudGFncHJvLnBsYXllcklkO1xyXG4gIHJldHVybiB0aGlzLnRhZ3Byby5wbGF5ZXJzW2lkXSB8fCBudWxsO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCB0ZWFtIG9mIHBsYXllciBnaXZlbiBieSBpZCwgb3IgYG51bGxgIGlmIG5vIHN1Y2ggcGxheWVyXHJcbiAqIGV4aXN0cy4gSWYgaWQgaXMgbm90IHByb3ZpZGVkLCB0aGVuIHRoZSBpZCBvZiB0aGUgY3VycmVudFxyXG4gKiBwbGF5ZXIgaXMgdXNlZC5cclxuICovXHJcbkdhbWVTdGF0ZS5wcm90b3R5cGUudGVhbSA9IGZ1bmN0aW9uKGlkKSB7XHJcbiAgdmFyIHBsYXllciA9IHRoaXMucGxheWVyKGlkKTtcclxuICBpZiAocGxheWVyKSB7XHJcbiAgICByZXR1cm4gcGxheWVyLnRlYW07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBhcnJheSBvZiBtYXAgdGlsZXMsIG9yIGBudWxsYCBpZiBub3QgaW5pdGlhbGl6ZWQuXHJcbiAqL1xyXG5HYW1lU3RhdGUucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0eXBlb2YgdGhpcy50YWdwcm8gIT09ICdvYmplY3QnIHx8ICF0aGlzLnRhZ3Byby5tYXApIHJldHVybiBudWxsO1xyXG4gIHJldHVybiB0aGlzLnRhZ3Byby5tYXA7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBsb2NhdGlvbiBvZiB0aGUgcGxheWVyIGdpdmVuIGJ5IGlkLCBvciBgbnVsbGAgaWYgbm8gc3VjaFxyXG4gKiBwbGF5ZXIgZXhpc3RzLiBJZiBpZCBpcyBub3QgcHJvdmlkZWQsIHRoZW4gdGhlIGxvY2F0aW9uIGZvciB0aGVcclxuICogY3VycmVudCBwbGF5ZXIgaXMgcmV0dXJuZWQuXHJcbiAqIEBwYXJhbSB7aW50ZWdlcn0gW2lkXSAtIFRoZSBpZCBvZiB0aGUgcGxheWVyIHRvIGdldCB0aGUgcHJlZGljdGVkXHJcbiAqICAgbG9jYXRpb24gZm9yLiBEZWZhdWx0cyB0byBpZCBvZiBjdXJyZW50IHBsYXllci5cclxuICogQHJldHVybiB7UG9pbnR9IC0gVGhlIGN1cnJlbnQgbG9jYXRpb24gb2YgdGhlIHBsYXllci5cclxuICovXHJcbkdhbWVTdGF0ZS5wcm90b3R5cGUubG9jYXRpb24gPSBmdW5jdGlvbihpZCkge1xyXG4gIHZhciBwbGF5ZXIgPSB0aGlzLnBsYXllcihpZCk7XHJcbiAgcmV0dXJuIG5ldyBQb2ludChwbGF5ZXIueCArIDIwLCBwbGF5ZXIueSArIDIwKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgcHJlZGljdGVkIGxvY2F0aW9uIGJhc2VkIG9uIGN1cnJlbnQgcG9zaXRpb24gYW5kIHZlbG9jaXR5LlxyXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtpZF0gLSBUaGUgaWQgb2YgdGhlIHBsYXllciB0byBnZXQgdGhlIHByZWRpY3RlZFxyXG4gKiAgIGxvY2F0aW9uIGZvci4gRGVmYXVsdHMgdG8gaWQgb2YgY3VycmVudCBwbGF5ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBhaGVhZCAtIFRoZSBhbW91bnQgdG8gbG9vayBhaGVhZCB0byBkZXRlcm1pbmUgdGhlXHJcbiAqICAgcHJlZGljdGVkIGxvY2F0aW9uLiBEZWZhdWx0IGludGVycHJldGF0aW9uIGlzIGluIG1zLlxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtzdGVwcz1mYWxzZV0gLSBXaGV0aGVyIHRvIGludGVycHJldCBgYWhlYWRgIGFzXHJcbiAqICAgdGhlIG51bWJlciBvZiBzdGVwcyBpbiB0aGUgcGh5c2ljcyBzaW11bGF0aW9uLlxyXG4gKiBAcmV0dXJuIHtQb2ludH0gLSBUaGUgcHJlZGljdGVkIGxvY2F0aW9uIG9mIHRoZSBwbGF5ZXIuXHJcbiAqL1xyXG5HYW1lU3RhdGUucHJvdG90eXBlLnBMb2NhdGlvbiA9IGZ1bmN0aW9uKGlkLCBhaGVhZCwgc3RlcHMpIHtcclxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICBpZCA9IHRoaXMudGFncHJvLnBsYXllcklkO1xyXG4gICAgYWhlYWQgPSB0aGlzLl9tc1RvU3RlcHMoYXJndW1lbnRzWzBdKTtcclxuICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xyXG4gICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgIGFoZWFkID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICBzdGVwcyA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgaWYgKCFzdGVwcykge1xyXG4gICAgICAgIGFoZWFkID0gdGhpcy5fbXNUb1N0ZXBzKGFoZWFkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoc3RlcHMpIHtcclxuICAgIHZhciB0aW1lID0gdGhpcy5fbXNUb1N0ZXBzKGFoZWFkKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIHRpbWUgPSBhaGVhZDtcclxuICB9XHJcbiAgdmFyIGN2ID0gdGhpcy52ZWxvY2l0eShpZCk7XHJcbiAgLy8gQm91bmQgdGhlIHByZWRpY3RlZCB2ZWxvY2l0eSBcclxuICB2YXIgcHYgPSB0aGlzLnBWZWxvY2l0eShpZCwgMSwgdHJ1ZSk7XHJcbiAgdmFyIGN1cnJlbnRfbG9jYXRpb24gPSB0aGlzLmxvY2F0aW9uKGlkKTtcclxuICB2YXIgZHggPSAwO1xyXG4gIHZhciBkeSA9IDA7XHJcblxyXG4gIGlmIChNYXRoLmFicyhwdi54KSA9PSB0aGlzLnNlbGYubXMpIHtcclxuICAgIC8vIEZpbmQgcG9pbnQgdGhhdCBtYXggdmVsb2NpdHkgd2FzIHJlYWNoZWQuXHJcbiAgICB2YXIgc3RlcCA9IE1hdGguYWJzKHB2LnggLSBjdi54KSAvIHRoaXMuc2VsZi5hYztcclxuICAgIHZhciBhY2NUaW1lID0gc3RlcCAqICgxIC8gNjApO1xyXG4gICAgZHggKz0gYWNjVGltZSAqICgocHYueCArIGN2LngpIC8gMik7XHJcbiAgICBkeCArPSAodGltZSAtIGFjY1RpbWUpICogcHYueDtcclxuICB9IGVsc2Uge1xyXG4gICAgZHggKz0gdGltZSAqICgocHYueCArIGN2LngpIC8gMik7XHJcbiAgfVxyXG5cclxuICBpZiAoTWF0aC5hYnMocHYueSkgPT0gdGhpcy5zZWxmLm1zKSB7XHJcbiAgICB2YXIgc3RlcCA9IE1hdGguYWJzKHB2LnkgLSBjdi55KSAvIHRoaXMuc2VsZi5hYztcclxuICAgIHZhciBhY2NUaW1lID0gc3RlcCAqICgxIC8gNjApO1xyXG4gICAgZHkgKz0gYWNjVGltZSAqICgocHYueSArIGN2LnkpIC8gMik7XHJcbiAgICBkeSArPSAodGltZSAtIGFjY1RpbWUpICogcHYueTtcclxuICB9IGVsc2Uge1xyXG4gICAgZHkgKz0gdGltZSAqICgocHYueSArIGN2LnkpIC8gMik7XHJcbiAgfVxyXG4gIHZhciBkbCA9IG5ldyBQb2ludChkeCwgZHkpO1xyXG4gIC8vIENvbnZlcnQgZnJvbSBwaHlzaWNzIHVuaXRzIHRvIHgsIHkgY29vcmRpbmF0ZXMuXHJcbiAgZGwgPSBkbC5tdWwoMTAwKTtcclxuXHJcbiAgcmV0dXJuIGN1cnJlbnRfbG9jYXRpb24uYWRkKGRsKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgdmVsb2NpdHkgb2YgcGxheWVyIGdpdmVuIGJ5IGlkLiBJZiBpZCBpcyBub3QgcHJvdmlkZWQsIHRoZW5cclxuICogcmV0dXJucyB0aGUgdmVsb2NpdHkgZm9yIHRoZSBjdXJyZW50IHBsYXllci5cclxuICogQHBhcmFtIHtpbnRlZ2VyfSBbaWRdIC0gVGhlIGlkIG9mIHRoZSBwbGF5ZXIgdG8gZ2V0IHRoZSB2ZWxvY2l0eVxyXG4gKiAgIGZvci4gRGVmYXVsdHMgdG8gaWQgb2YgY3VycmVudCBwbGF5ZXIuXHJcbiAqIEByZXR1cm4ge1BvaW50fSAtIFRoZSB2ZWxvY2l0eSBvZiB0aGUgcGxheWVyLlxyXG4gKi9cclxuR2FtZVN0YXRlLnByb3RvdHlwZS52ZWxvY2l0eSA9IGZ1bmN0aW9uKGlkKSB7XHJcbiAgdmFyIHBsYXllciA9IHRoaXMucGxheWVyKGlkKTtcclxuICB2YXIgY2x4LCBjbHk7XHJcbiAgaWYgKHBsYXllci5ib2R5KSB7XHJcbiAgICB2YXIgdmVsID0gcGxheWVyLmJvZHkuR2V0TGluZWFyVmVsb2NpdHkoKTtcclxuICAgIGNseCA9IHZlbC54O1xyXG4gICAgY2x5ID0gdmVsLnk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNseCA9IHBsYXllci5seDtcclxuICAgIGNseSA9IHBsYXllci5seTtcclxuICB9XHJcbiAgcmV0dXJuIG5ldyBQb2ludChjbHgsIGNseSk7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHByZWRpY3RlZCB2ZWxvY2l0eSBhIG51bWJlciBvZiBzdGVwcyBpbnRvIHRoZSBmdXR1cmUgYmFzZWQgb25cclxuICogY3VycmVudCB2ZWxvY2l0eSwgYWNjZWxlcmF0aW9uLCBtYXggdmVsb2NpdHksIGFuZCB0aGUga2V5cyBiZWluZ1xyXG4gKiBwcmVzc2VkLlxyXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtpZF0gLSBUaGUgaWQgb2YgdGhlIHBsYXllciB0byBnZXQgdGhlIHByZWRpY3RlZFxyXG4gKiAgIHZlbG9jaXR5IGZvci4gRGVmYXVsdHMgdG8gaWQgb2YgY3VycmVudCBwbGF5ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBhaGVhZCAtIFRoZSBhbW91bnQgdG8gbG9vayBhaGVhZCB0byBkZXRlcm1pbmUgdGhlXHJcbiAqICAgcHJlZGljdGVkIHZlbG9jaXR5LiBEZWZhdWx0IGludGVycHJldGF0aW9uIGlzIGluIG1zLlxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtzdGVwcz1mYWxzZV0gLSBXaGV0aGVyIHRvIGludGVycHJldCBgYWhlYWRgIGFzXHJcbiAqICAgdGhlIG51bWJlciBvZiBzdGVwcyBpbiB0aGUgcGh5c2ljcyBzaW11bGF0aW9uLlxyXG4gKiBAcmV0dXJuIHtQb2ludH0gLSBUaGUgcHJlZGljdGVkIHZlbG9jaXR5IG9mIHRoZSBwbGF5ZXIuXHJcbiAqL1xyXG5HYW1lU3RhdGUucHJvdG90eXBlLnBWZWxvY2l0eSA9IGZ1bmN0aW9uKGlkLCBhaGVhZCwgc3RlcHMpIHtcclxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICBpZCA9IHRoaXMudGFncHJvLnBsYXllcklkO1xyXG4gICAgYWhlYWQgPSB0aGlzLl9tc1RvU3RlcHMoYXJndW1lbnRzWzBdKTtcclxuICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xyXG4gICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgIGFoZWFkID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICBzdGVwcyA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgaWYgKCFzdGVwcykge1xyXG4gICAgICAgIGFoZWFkID0gdGhpcy5fbXNUb1N0ZXBzKGFoZWFkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICB2YXIgdmVsID0gdGhpcy52ZWxvY2l0eShpZCk7XHJcbiAgdmFyIHBsYXllciA9IHRoaXMucGxheWVyKGlkKTtcclxuXHJcbiAgdmFyIGNoYW5nZV94ID0gMCwgY2hhbmdlX3kgPSAwO1xyXG4gIGlmIChwbGF5ZXIucHJlc3NpbmcudXApIHtcclxuICAgIGNoYW5nZV95ID0gLTE7XHJcbiAgfSBlbHNlIGlmIChwbGF5ZXIucHJlc3NpbmcuZG93bikge1xyXG4gICAgY2hhbmdlX3kgPSAxO1xyXG4gIH1cclxuICBpZiAocGxheWVyLnByZXNzaW5nLmxlZnQpIHtcclxuICAgIGNoYW5nZV94ID0gLTE7XHJcbiAgfSBlbHNlIGlmIChwbGF5ZXIucHJlc3NpbmcucmlnaHQpIHtcclxuICAgIGNoYW5nZV94ID0gMTtcclxuICB9XHJcbiAgdmFyIHBseCwgcGx5O1xyXG4gIHBseCA9IHZlbC54ICsgcGxheWVyLmFjICogYWhlYWQgKiBjaGFuZ2VfeDtcclxuICBwbHggPSBNYXRoLnNpZ24ocGx4KSAqIE1hdGgubWluKE1hdGguYWJzKHBseCksIHBsYXllci5tcyk7XHJcbiAgcGx5ID0gdmVsLnkgKyBwbGF5ZXIuYWMgKiBhaGVhZCAqIGNoYW5nZV95O1xyXG4gIHBseSA9IE1hdGguc2lnbihwbHkpICogTWF0aC5taW4oTWF0aC5hYnMocGx5KSwgcGxheWVyLm1zKTtcclxuXHJcbiAgcmV0dXJuIG5ldyBQb2ludChwbHgsIHBseSk7XHJcbn07XHJcblxyXG4vKipcclxuICogR2l2ZW4gYSB0aW1lIGluIG1zLCByZXR1cm4gdGhlIG51bWJlciBvZiBzdGVwcyBuZWVkZWQgdG8gcmVwcmVzZW50XHJcbiAqIHRoYXQgdGltZS5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtpbnRlZ2VyfSBtcyAtIFRoZSBudW1iZXIgb2YgbXMuXHJcbiAqIEByZXR1cm4ge2ludGVnZXJ9IC0gVGhlIG51bWJlciBvZiBzdGVwcy5cclxuICovXHJcbkdhbWVTdGF0ZS5wcm90b3R5cGUuX21zVG9TdGVwcyA9IGZ1bmN0aW9uKG1zKSB7XHJcbiAgcmV0dXJuIG1zIC8gdGhpcy5wYXJhbWV0ZXJzLmdhbWUuc3RlcDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUcmFuc2xhdGUgYW4gYXJyYXkgbG9jYXRpb24gZnJvbSBgdGFncHJvLm1hcGAgaW50byBhIHBvaW50XHJcbiAqIHJlcHJlc2VudGluZyB0aGUgeCwgeSBjb29yZGluYXRlcyBvZiB0aGUgdG9wIGxlZnQgb2YgdGhlIHRpbGUsXHJcbiAqIG9yIHRoZSBjZW50ZXIgb2YgdGhlIHRpbGUgaWYgJ2NlbnRlcicgaXMgdHJ1ZS5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtpbnRlZ2VyfSByb3cgLSBUaGUgcm93IG9mIHRoZSB0aWxlLlxyXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGNvbCAtIFRoZSBjb2x1bW4gb2YgdGhlIHRpbGUuXHJcbiAqIEByZXR1cm4ge1BvaW50fSAtIFRoZSB4LCB5IGNvb3JkaW5hdGVzIG9mIHRoZSB0aWxlLlxyXG4gKi9cclxuR2FtZVN0YXRlLnByb3RvdHlwZS5fYXJyYXlUb0Nvb3JkID0gZnVuY3Rpb24ocm93LCBjb2wpIHtcclxuICByZXR1cm4gbmV3IFBvaW50KDQwICogcm93LCA0MCAqIGNvbCk7XHJcbn07XHJcblxyXG4vKipcclxuICogSW5kaWNhdGVzIHdoZXRoZXIgYSBwbGF5ZXIgd2l0aCB0aGUgZ2l2ZW4gaWQgaXMgdmlzaWJsZSB0byB0aGVcclxuICogY3VycmVudCBwbGF5ZXIuXHJcbiAqIEBwYXJhbSB7aW50ZWdlcn0gaWQgLSBUaGUgaWQgb2YgdGhlIHBsYXllciB0byBjaGVjayB2aXNpYmlsaXR5XHJcbiAqICAgZm9yLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgdGhlIHBsYXllciBpcyB2aXNpYmxlLlxyXG4gKi9cclxuR2FtZVN0YXRlLnByb3RvdHlwZS52aXNpYmxlID0gZnVuY3Rpb24oaWQpIHtcclxuICByZXR1cm4gISF0aGlzLnBsYXllcihpZCkuZHJhdztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBJbmRpY2F0ZXMgd2hldGhlciBhIHBsYXllciB3aXRoIHRoZSBnaXZlbiBpZCBpcyBhbGl2ZS5cclxuICogQHBhcmFtIHtpbnRlZ2VyfSBpZCAtIFRoZSBpZCBvZiB0aGUgcGxheWVyIHRvIGNoZWNrIGZvclxyXG4gKiAgIGxpdmVsaW5lc3MuXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciB0aGUgcGxheWVyIGlzIGFsaXZlLlxyXG4gKi9cclxuR2FtZVN0YXRlLnByb3RvdHlwZS5hbGl2ZSA9IGZ1bmN0aW9uKGlkKSB7XHJcbiAgcmV0dXJuICF0aGlzLnBsYXllcihpZCkuZGVhZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBMb2NhdGVzIHRoZSBlbmVteSBmbGFnLiBJZiBmb3VuZCBhbmQgbm90IHRha2VuLCB0aGUgYHN0YXRlYCBvZiB0aGVcclxuICogcmV0dXJuZWQgc2VhcmNoIHJlc3VsdCB3aWxsIGJlIHRydWUsIGFuZCBmYWxzZSBvdGhlcndpc2UuIElmIG5vdFxyXG4gKiBmb3VuZCwgdGhlbiBudWxsIGlzIHJldHVybmVkLlxyXG4gKiBAcmV0dXJuIHs/VGlsZVNlYXJjaFJlc3VsdH0gLSBUaGUgc2VhcmNoIHJlc3VsdCBmb3IgdGhlIGVuZW15IGZsYWcsXHJcbiAqICAgaWYgZm91bmQuXHJcbiAqL1xyXG5HYW1lU3RhdGUucHJvdG90eXBlLmZpbmRFbmVteUZsYWcgPSBmdW5jdGlvbigpIHtcclxuICAvLyBHZXQgZmxhZyB2YWx1ZS5cclxuICB2YXIgdGlsZSA9ICh0aGlzLnNlbGYudGVhbSA9PSBHYW1lU3RhdGUuVGVhbXMuYmx1ZSA/IEdhbWVTdGF0ZS5UaWxlcy5yZWRmbGFnIDogR2FtZVN0YXRlLlRpbGVzLmJsdWVmbGFnKTtcclxuICByZXR1cm4gdGhpcy5maW5kVGlsZSh0aWxlKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBMb2NhdGVzIHRoZSB0ZWFtIGZsYWcgZm9yIHRoZSBjdXJyZW50IHBsYXllci4gSWYgZm91bmQgYW5kIG5vdFxyXG4gKiB0YWtlbiwgdGhlIGBzdGF0ZWAgb2YgdGhlIHJldHVybmVkIHNlYXJjaCByZXN1bHQgd2lsbCBiZSB0cnVlLCBhbmRcclxuICogZmFsc2Ugb3RoZXJ3aXNlLiBJZiBub3QgZm91bmQsIHRoZW4gbnVsbCBpcyByZXR1cm5lZC5cclxuICogQHJldHVybiB7P1RpbGVTZWFyY2hSZXN1bHR9IC0gVGhlIHNlYXJjaCByZXN1bHQgZm9yIHRoZSBmbGFnLCBpZlxyXG4gKiAgIGZvdW5kLlxyXG4gKi9cclxuR2FtZVN0YXRlLnByb3RvdHlwZS5maW5kT3duRmxhZyA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciB0aWxlID0gKHRoaXMuc2VsZi50ZWFtID09IEdhbWVTdGF0ZS5UZWFtcy5ibHVlID8gR2FtZVN0YXRlLlRpbGVzLmJsdWVmbGFnIDogR2FtZVN0YXRlLlRpbGVzLnJlZGZsYWcpO1xyXG4gIHJldHVybiB0aGlzLmZpbmRUaWxlKHRpbGUpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZpbmQgeWVsbG93IGZsYWcuXHJcbiAqL1xyXG5HYW1lU3RhdGUucHJvdG90eXBlLmZpbmRZZWxsb3dGbGFnID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuZmluZFRpbGUoR2FtZVN0YXRlLlRpbGVzLnllbGxvd2ZsYWcpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgUG9pbnRzIHRoYXQgc3BlY2lmaWVzIHRoZSBjb29yZGluYXRlcyBvZiBhbnlcclxuICogc3Bpa2VzIG9uIHRoZSBtYXAuXHJcbiAqIEByZXR1cm4ge0FycmF5LjxQb2ludD59IC0gQW4gYXJyYXkgb2YgUG9pbnQgb2JqZWN0cyByZXByZXNlbnRpbmcgdGhlXHJcbiAqICAgY29vcmRpbmF0ZXMgb2YgdGhlIGNlbnRlciBvZiBlYWNoIHNwaWtlLlxyXG4gKi9cclxuR2FtZVN0YXRlLnByb3RvdHlwZS5nZXRzcGlrZXMgPSBmdW5jdGlvbigpIHtcclxuICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnc3Bpa2VzJykpIHtcclxuICAgIHJldHVybiB0aGlzLnNwaWtlcztcclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIHJlc3VsdHMgPSB0aGlzLmZpbmRUaWxlcyhHYW1lU3RhdGUuVGlsZXMuc3Bpa2UpO1xyXG4gICAgdmFyIHNwaWtlcyA9IHJlc3VsdHMubWFwKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICByZXR1cm4gcmVzdWx0LmxvY2F0aW9uO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNwaWtlcyA9IHNwaWtlcztcclxuICAgIC8vIERlYnVnZ2luZywgZHJhdyBjaXJjbGUgdXNlZCBmb3IgZGV0ZXJtaW5pbmcgc3Bpa2UgaW50ZXJzZWN0aW9uLlxyXG4gICAgLyp0aGlzLnNwaWtlcy5mb3JFYWNoKGZ1bmN0aW9uKHNwaWtlLCBpKSB7XHJcbiAgICAgIHRoaXMuZHJhdy5hZGRDaXJjbGUoXHJcbiAgICAgICAgXCJzcGlrZS1cIiArIGksXHJcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnN0ZWVyaW5nLmF2b2lkLnNwaWtlX2ludGVyc2VjdGlvbl9yYWRpdXMsXHJcbiAgICAgICAgMHhiYmJiMDBcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5kcmF3LnVwZGF0ZUNpcmNsZShcInNwaWtlLVwiICsgaSwgc3Bpa2UpO1xyXG4gICAgfSwgdGhpcyk7Ki9cclxuICAgIHJldHVybiBzcGlrZXM7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gU3RhdGljIEdhbWUgSW5mb3JtYXRpb25cclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgYSB0aWxlIGFsb25nIHdpdGggaXRzIHBvc3NpYmxlIHZhbHVlcyBhbmQgdGhlIHZhbHVlIGZvciB0aGUgJ3N0YXRlJyBhdHRyaWJ1dGVcclxuICogb2YgdGhlIHRpbGUgcmVzdWx0IHRoYXQgc2hvdWxkIGJlIHJldHVybmVkIGZyb20gYSBzZWFyY2guXHJcbiAqIEB0eXBlZGVmIFRpbGVcclxuICogQHR5cGUge29iamVjdC48KG51bWJlcnxzdHJpbmcpLCAqPn1cclxuICovXHJcbkdhbWVTdGF0ZS5UaWxlcyA9IHtcclxuICB5ZWxsb3dmbGFnOiB7MTY6IHRydWUsIFwiMTYuMVwiOiBmYWxzZX0sXHJcbiAgcmVkZmxhZzogezM6IHRydWUsIFwiMy4xXCI6IGZhbHNlfSxcclxuICBibHVlZmxhZzogezQ6IHRydWUsIFwiNC4xXCI6IGZhbHNlfSxcclxuICBwb3dlcnVwOiB7NjogZmFsc2UsIFwiNi4xXCI6IFwiZ3JpcFwiLCBcIjYuMlwiOiBcImJvbWJcIiwgXCI2LjNcIjogXCJ0YWdwcm9cIiwgXCI2LjRcIjogXCJzcGVlZFwifSxcclxuICBib21iOiB7MTA6IHRydWUsIFwiMTAuMVwiOiBmYWxzZX0sXHJcbiAgc3Bpa2U6IHs3OiB0cnVlfVxyXG59O1xyXG5cclxuR2FtZVN0YXRlLlRlYW1zID0ge1xyXG4gIHJlZDogMSxcclxuICBibHVlOiAyXHJcbn07XHJcblxyXG5HYW1lU3RhdGUuR2FtZVR5cGVzID0ge1xyXG4gIGN0ZjogMSwgLy8gQ2FwdHVyZS10aGUtZmxhZ1xyXG4gIHlmOiAyIC8vIFllbGxvdyBmbGFnXHJcbn07XHJcblxyXG5HYW1lU3RhdGUucHJvdG90eXBlLlRpbGVzID0gR2FtZVN0YXRlLlRpbGVzO1xyXG5HYW1lU3RhdGUucHJvdG90eXBlLlRlYW1zID0gR2FtZVN0YXRlLlRlYW1zO1xyXG5HYW1lU3RhdGUucHJvdG90eXBlLkdhbWVUeXBlcyA9IEdhbWVTdGF0ZS5HYW1lVHlwZXM7XHJcblxyXG4vKipcclxuICogUmVzdWx0IG9mIHRpbGUgc2VhcmNoIGZ1bmN0aW9uLCBjb250YWlucyBhIGxvY2F0aW9uIGFuZCBzdGF0ZS5cclxuICogQHR5cGVkZWYgVGlsZVNlYXJjaFJlc3VsdFxyXG4gKiBAdHlwZSB7b2JqZWN0fVxyXG4gKiBAcHJvcGVydHkge1BvaW50fSBsb2NhdGlvbiAtIFRoZSB4LCB5IGxvY2F0aW9uIG9mIHRoZSBmb3VuZCB0aWxlLlxyXG4gKiBAcHJvcGVydHkgeyp9IHN0YXRlIC0gQSBmaWVsZCBkZWZpbmVkIGJ5IHRoZSBnaXZlbiB0aWxlIG9iamVjdCBhbmRcclxuICogICB0aGUgYWN0dWFsIHZhbHVlIHRoYXQgd2FzIG1hdGNoZWQuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIFNlYXJjaCB0aGUgbWFwIGZvciBhIHRpbGUgbWF0Y2hpbmcgdGhlIGdpdmVuIHRpbGUgZGVzY3JpcHRpb24sIGFuZFxyXG4gKiByZXR1cm4gdGhlIGZpcnN0IG9uZSBmb3VuZCwgb3IgYG51bGxgIGlmIG5vIHN1Y2ggdGlsZSBpcyBmb3VuZC4gVGhlXHJcbiAqIGxvY2F0aW9uIGluIHRoZSByZXR1cm5lZCB0aWxlIHJlc3VsdHMgcG9pbnRzIHRvIHRoZSBjZW50ZXIgb2YgdGhlXHJcbiAqIHRpbGUuXHJcbiAqIEBwYXJhbSB7VGlsZX0gdGlsZSAtIEEgdGlsZSB0byBzZWFyY2ggZm9yLlxyXG4gKiBAcmV0dXJuIHs/VGlsZVNlYXJjaFJlc3VsdH0gLSBUaGUgcmVzdWx0IG9mIHRoZSB0aWxlIHNlYXJjaCwgb3JcclxuICogICBudWxsIGlmIG5vIHRpbGUgd2FzIGZvdW5kLlxyXG4gKi9cclxuR2FtZVN0YXRlLnByb3RvdHlwZS5maW5kVGlsZSA9IGZ1bmN0aW9uKHRpbGUpIHtcclxuICAvLyBHZXQga2V5cyBhbmQgY29udmVydCB0byBudW1iZXJzXHJcbiAgdmFyIHZhbHMgPSBPYmplY3Qua2V5cyh0aWxlKS5tYXAoZnVuY3Rpb24odmFsKSB7cmV0dXJuICt2YWw7fSk7XHJcbiAgZm9yICh2YXIgcm93IGluIHRoaXMudGFncHJvLm1hcCkge1xyXG4gICAgZm9yICh2YXIgY29sIGluIHRoaXMudGFncHJvLm1hcFtyb3ddKSB7XHJcbiAgICAgIGlmICh2YWxzLmluZGV4T2YoK3RoaXMudGFncHJvLm1hcFtyb3ddW2NvbF0pICE9PSAtMSkge1xyXG4gICAgICAgIHZhciBsb2MgPSB0aGlzLl9hcnJheVRvQ29vcmQoK3JvdywgK2NvbCkuYWRkKDIwKTtcclxuICAgICAgICB2YXIgc3RhdGUgPSB0aWxlW3RoaXMudGFncHJvLm1hcFtyb3ddW2NvbF1dO1xyXG4gICAgICAgIHJldHVybiB7bG9jYXRpb246IGxvYywgc3RhdGU6IHN0YXRlfTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGaW5kIGFsbCB0aWxlcyBpbiBtYXAgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gdGlsZSwgYW5kIHJldHVybiB0aGVpclxyXG4gKiBpbmZvcm1hdGlvbi5cclxuICogQHBhcmFtIHtUaWxlfSB0aWxlIC0gQSB0aWxlIHR5cGUgdG8gc2VhcmNoIGZvciB0aGUgbG9jYXRpb25zIG9mIGluXHJcbiAqICAgdGhlIG1hcC5cclxuICogQHJldHVybiB7QXJyYXkuPFRpbGVTZWFyY2hSZXN1bHQ+fSAtIFRoZSByZXN1bHRzIG9mIHRoZSBzZWFyY2gsIG9yXHJcbiAqICAgYW4gZW1wdHkgYXJyYXkgaWYgbm8gdGlsZXMgd2VyZSBmb3VuZC5cclxuICovXHJcbkdhbWVTdGF0ZS5wcm90b3R5cGUuZmluZFRpbGVzID0gZnVuY3Rpb24odGlsZSkge1xyXG4gIHZhciB0aWxlc19mb3VuZCA9IFtdO1xyXG4gIHZhciB2YWxzID0gT2JqZWN0LmtleXModGlsZSkubWFwKGZ1bmN0aW9uKHZhbCkge3JldHVybiArdmFsO30pO1xyXG4gIGZvciAodmFyIHJvdyBpbiB0aGlzLnRhZ3Byby5tYXApIHtcclxuICAgIGZvciAodmFyIGNvbCBpbiB0aGlzLnRhZ3Byby5tYXBbcm93XSkge1xyXG4gICAgICBpZiAodmFscy5pbmRleE9mKCt0aGlzLnRhZ3Byby5tYXBbcm93XVtjb2xdKSAhPT0gLTEpIHtcclxuICAgICAgICB2YXIgbG9jID0gdGhpcy5fYXJyYXlUb0Nvb3JkKCtyb3csICtjb2wpLmFkZCgyMCk7XHJcbiAgICAgICAgdmFyIHN0YXRlID0gdGlsZVt0aGlzLnRhZ3Byby5tYXBbcm93XVtjb2xdXTtcclxuICAgICAgICB0aWxlc19mb3VuZC5wdXNoKHtsb2NhdGlvbjogbG9jLCBzdGF0ZTogc3RhdGV9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdGlsZXNfZm91bmQ7XHJcbn07XHJcblxyXG4vLyBJZGVudGlmeSB0aGUgZ2FtZSB0aW1lLCB3aGV0aGVyIGNhcHR1cmUgdGhlIGZsYWcgb3IgeWVsbG93IGZsYWcuXHJcbi8vIFJldHVybnMgZWl0aGVyIFwiY3RmXCIgb3IgXCJ5ZlwiLlxyXG5HYW1lU3RhdGUucHJvdG90eXBlLmdhbWVUeXBlID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKHRoaXMuZmluZE93bkZsYWcoKSAmJiB0aGlzLmZpbmRFbmVteUZsYWcoKSkge1xyXG4gICAgcmV0dXJuIEdhbWVTdGF0ZS5HYW1lVHlwZXMuY3RmO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gR2FtZVN0YXRlLkdhbWVUeXBlcy55ZjtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogRmluZCBwbGF5ZXJzIHRoYXQgYXJlIG9uIHRoZSB0ZWFtIG9mIHRoZSBjdXJyZW50IHBsYXllci5cclxuICogQHJldHVybiB7QXJyYXkuPFBsYXllcj59IC0gVGhlIHRlYW1tYXRlcy5cclxuICovXHJcbkdhbWVTdGF0ZS5wcm90b3R5cGUudGVhbW1hdGVzID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHRlYW1tYXRlcyA9IFtdO1xyXG4gIGZvciAoaWQgaW4gdGhpcy50YWdwcm8ucGxheWVycykge1xyXG4gICAgdmFyIHBsYXllciA9IHRoaXMudGFncHJvLnBsYXllcnNbaWRdO1xyXG4gICAgaWYgKHBsYXllci50ZWFtID09IHRoaXMuc2VsZi50ZWFtKSB7XHJcbiAgICAgIHRlYW1tYXRlcy5wdXNoKHBsYXllcik7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0ZWFtbWF0ZXM7XHJcbn07XHJcblxyXG4vKipcclxuICogRmluZCBwbGF5ZXJzIHRoYXQgYXJlIG5vdCBvbiB0aGUgdGVhbSBvZiB0aGUgY3VycmVudCBwbGF5ZXIuXHJcbiAqIEByZXR1cm4ge0FycmF5LjxQbGF5ZXI+fSAtIFRoZSBub24tdGVhbW1hdGUgcGxheWVycy5cclxuICovXHJcbkdhbWVTdGF0ZS5wcm90b3R5cGUuZW5lbWllcyA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBlbmVtaWVzID0gW107XHJcbiAgZm9yIChpZCBpbiB0aGlzLnRhZ3Byby5wbGF5ZXJzKSB7XHJcbiAgICB2YXIgcGxheWVyID0gdGhpcy50YWdwcm8ucGxheWVyc1tpZF07XHJcbiAgICBpZiAocGxheWVyLnRlYW0gIT09IHRoaXMuc2VsZi50ZWFtKSB7XHJcbiAgICAgIGVuZW1pZXMucHVzaChwbGF5ZXIpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZW5lbWllcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBhbnkgb2YgdGhlIGdpdmVuIHBsYXllcnMgYXJlIHdpdGhpbiBhIGdpdmVuIGNpcmN1bGFyXHJcbiAqIGFyZWEuIExpbWl0cyB0byB2aXNpYmxlIHBsYXllcnMuXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFBsYXllcj59IHBsYXllcnMgLSBUaGUgcGxheWVycyB0byBsb29rIGZvci5cclxuICogQHBhcmFtIHtQb2ludH0gY2VudGVyIC0gVGhlIGNlbnRlciBvZiB0aGUgcG9pbnQgdG8gbG9vayBmb3JcclxuICogICBwbGF5ZXJzIHdpdGhpbi5cclxuICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgdG8gc2VhcmNoIHdpdGhpbi5cclxuICogQHJldHVybiB7QXJyYXkuPFBsYXllcj59IC0gVGhlIHBsYXllcnMgZm91bmQgd2l0aGluIHRoZSBhcmVhLlxyXG4gKi9cclxuR2FtZVN0YXRlLnByb3RvdHlwZS5wbGF5ZXJzV2l0aGluQXJlYSA9IGZ1bmN0aW9uKHBsYXllcnMsIGNlbnRlciwgcmFkaXVzKSB7XHJcbiAgdmFyIGZvdW5kID0gcGxheWVycy5maWx0ZXIoZnVuY3Rpb24ocGxheWVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wbGF5ZXJXaXRoaW5BcmVhKHBsYXllciwgY2VudGVyLCByYWRpdXMpO1xyXG4gIH0sIHRoaXMpO1xyXG4gIHJldHVybiBmb3VuZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBhIGdpdmVuIHBsYXllciBpcyB3aXRoaW4gYSBjZXJ0YWluIHJhbmdlIG9mIGEgcG9pbnQuIElmXHJcbiAqIHRoZSBwbGF5ZXIgaXMgbm90IHZpc2libGUsIHRoZW4gcmV0dXJucyBmYWxzZS5cclxuICogQHBhcmFtIHtQbGF5ZXJ9IHBsYXllciAtIFRoZSBwbGF5ZXIgdG8gY2hlY2sgdGhlIGxvY2F0aW9uIG9mLlxyXG4gKiBAcGFyYW0ge1BvaW50fSBjZW50ZXIgLSBUaGUgY2VudGVyIG9mIHRoZSBhcmVhIHRvIHVzZSBmb3IgbG9jYXRpb25cclxuICogICBkZXRlcm1pbmF0aW9uLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcmFkaXVzIC0gVGhlIHJhZGl1cyBvZiB0aGUgYXJlYSBjZW50ZXJlZCBhdCB0aGVcclxuICogICBwb2ludCB0byBzZWFyY2ggd2l0aGluLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgdGhlIHBsYXllciBpcyBpbiB0aGUgYXJlYS5cclxuICovXHJcbkdhbWVTdGF0ZS5wcm90b3R5cGUucGxheWVyV2l0aGluQXJlYSA9IGZ1bmN0aW9uKHBsYXllciwgY2VudGVyLCByYWRpdXMpIHtcclxuICBpZiAoIXRoaXMudmlzaWJsZShwbGF5ZXIuaWQpKSByZXR1cm4gZmFsc2U7XHJcbiAgdmFyIGxvYyA9IHRoaXMubG9jYXRpb24ocGxheWVyLmlkKTtcclxuICByZXR1cm4gbG9jLnN1YihjZW50ZXIpLmxlbigpIDwgcmFkaXVzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hpY2ggZW5lbWllcyBhcmUgaW4gdGhlIGN1cnJlbnQgcGxheWVyJ3MgYmFzZS5cclxuICogQHJldHVybiB7QXJheS48UGxheWVyPn0gLSBUaGUgZW5lbWllcyBpbiBiYXNlLlxyXG4gKi9cclxuR2FtZVN0YXRlLnByb3RvdHlwZS5lbmVtaWVzSW5CYXNlID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGVuZW1pZXMgPSB0aGlzLmVuZW1pZXMoKTtcclxuICB2YXIgYmFzZSA9IHRoaXMuYmFzZSgpO1xyXG4gIHZhciBmb3VuZCA9IHRoaXMucGxheWVyc1dpdGhpbkFyZWEoZW5lbWllcywgYmFzZS5sb2NhdGlvbiwgYmFzZS5yYWRpdXMpO1xyXG4gIHJldHVybiBmb3VuZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGN1cnJlbnQgcGxheWVyIGlzIGluLWJhc2Ugb3Igbm90LlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgdGhlIGN1cnJlbnQgcGxheWVyIGlzIGluLWJhc2UuXHJcbiAqL1xyXG5HYW1lU3RhdGUucHJvdG90eXBlLmluQmFzZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBiYXNlID0gdGhpcy5iYXNlKCk7XHJcbiAgcmV0dXJuIHRoaXMucGxheWVyV2l0aGluQXJlYSh0aGlzLnNlbGYsIGJhc2UubG9jYXRpb24sIGJhc2UucmFkaXVzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBIb2xkcyBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGlzIGNvbnNpZGVyZWQgdGhlICdiYXNlJyBmb3IgdGhlXHJcbiAqIGN1cnJlbnQgcGxheWVyLiBEZWZpbmVzIGEgY2lyY3VsYXIgYXJlYSBjZW50ZXJlZCBvbiB0aGUgY3VycmVudFxyXG4gKiBwbGF5ZXIncyBmbGFnLlxyXG4gKiBAdHlwZWRlZiBCYXNlXHJcbiAqIEB0eXBlIHtvYmplY3R9XHJcbiAqIEBwcm9wZXJ0eSB7P1BvaW50fSBsb2NhdGlvbiAtIFRoZSBsb2NhdGlvbiBvZiB0aGUgY2VudGVyIG9mIHRoZVxyXG4gKiAgIGJhc2UuIElmIG5vIGZsYWcgZm9yIHRoZSBjdXJyZW50IHBsYXllciBpcyBmb3VuZCwgdGhlbiB0aGlzIGlzXHJcbiAqICAgbnVsbC5cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJhZGl1cyAtIFRoZSBkaXN0YW5jZSBhd2F5IGZyb20gdGhlIGNlbnRlclxyXG4gKiAgIHBvaW50IHRoYXQgdGhlIGJhc2UgZXh0ZW5kcy5cclxuICovXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IHBsYXllcidzIGJhc2UgdGhhdCBjYW4gYmVcclxuICogdXNlZCBmb3IgZGV0ZXJtaW5pbmcgdGhlIG51bWJlciBvZiBwbGF5ZXJzL2l0ZW1zIGluIGJhc2UuXHJcbiAqIEByZXR1cm4ge0Jhc2V9IC0gVGhlIGJhc2UgbG9jYXRpb24vZXh0ZW50IGluZm9ybWF0aW9uLlxyXG4gKi9cclxuR2FtZVN0YXRlLnByb3RvdHlwZS5iYXNlID0gZnVuY3Rpb24oZmlyc3RfYXJndW1lbnQpIHtcclxuICB2YXIgYmFzZSA9IHt9O1xyXG4gIC8vIFJhZGl1cyB1c2VkIHRvIGRldGVybWluZSB3aGV0aGVyIHNvbWV0aGluZyBpcyBpbi1iYXNlLlxyXG4gIGJhc2UucmFkaXVzID0gMjAwO1xyXG4gIGJhc2UubG9jYXRpb24gPSB0aGlzLmZpbmRPd25GbGFnKCkubG9jYXRpb247XHJcbiAgcmV0dXJuIGJhc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgY3VycmVudCBwbGF5ZXIgaXMgd2l0aGluIGBtYXJnaW5gXHJcbiAqIG9mIHRoZSBsaW5lIGJldHdlZW4gdHdvIHBvaW50cy5cclxuICogQHBhcmFtIHtQb2ludH0gcCAtIFRoZSBwb2ludCB0byBjaGVjayBiZXR3ZWVuIHRoZSB0d28gcG9pbnRzLlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwMSAtIFRoZSBmaXJzdCBwb2ludC5cclxuICogQHBhcmFtIHtQb2ludH0gcDIgLSBUaGUgc2Vjb25kIHBvaW50LlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW21hcmdpbj0yMF0gLSB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgbGluZSBiZXR3ZWVuIHAxIGFuZFxyXG4gKiAgIHAyIHRoYXQgdGhlIGN1cnJlbnQgcGxheWVyIG1heSBiZSB0byBiZSBjb25zaWRlcmVkICdiZXR3ZWVuJ1xyXG4gKiAgIHRoZW0uXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciB0aGUgcGxheWVyIGlzIGJldHdlZW4gdGhlIGdpdmVuIHBvaW50cy5cclxuICovXHJcbkdhbWVTdGF0ZS5wcm90b3R5cGUuaXNJbnRlcnBvc2VkID0gZnVuY3Rpb24ocCwgcDEsIHAyLCBtYXJnaW4pIHtcclxuICBpZiAodHlwZW9mIG1hcmdpbiA9PSAndW5kZWZpbmVkJykgbWFyZ2luID0gMjA7XHJcbiAgcmV0dXJuIE1hdGguYWJzKHAxLmRpc3QocCkgKyBwMi5kaXN0KHApIC0gcDEuZGlzdChwMikpIDwgbWFyZ2luO1xyXG59O1xyXG4iLCIvLyBUT0RPOiByZXNvbHZlIGpxdWVyeSBkZXBlbmRlbmN5LlxyXG4vKipcclxuICogVGhlIE1vdmVyIGlzIHJlc3BvbnNpYmxlIGZvciBleGVjdXRpbmcgYWN0aW9ucyB3aXRoaW4gdGhlXHJcbiAqIGJyb3dzZXIgZW52aXJvbm1lbnQgYW5kIG1hbmFnaW5nIGtleXByZXNzZXMuXHJcbiAqIEFnZW50cyBzaG91bGQgdXRpbGl6ZSBhIHBlcnNvbmFsIGBtb3ZlYCBmdW5jdGlvbiB0aGF0IHNob3VsZFxyXG4gKiBiZSBzZXQgYXMgdGhlIG1vdmUgZnVuY3Rpb24gb2YgdGhlIG9iamVjdCBjcmVhdGVkIGZyb20gdGhpc1xyXG4gKiBjbGFzcy5cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBhbGlhcyBtb2R1bGU6bW92ZXIvYnJvd3NlclxyXG4gKi9cclxudmFyIE1vdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gVHJhY2tzIGFjdGl2ZSBtb3ZlbWVudCBkaXJlY3Rpb25zLlxyXG4gIHRoaXMuZGlyUHJlc3NlZCA9IHtyaWdodDogZmFsc2UsIGxlZnQ6IGZhbHNlLCBkb3duOiBmYWxzZSwgdXA6IGZhbHNlfTtcclxuXHJcbiAgLy8gTWFwcyBkaXJlY3Rpb25zIHRvIGtleSBjb2Rlcy5cclxuICB0aGlzLmtleUNvZGVzID0ge1xyXG4gICAgcmlnaHQ6IDEwMCxcclxuICAgIGxlZnQ6IDk3LFxyXG4gICAgZG93bjogMTE1LFxyXG4gICAgdXA6IDExOVxyXG4gIH07XHJcblxyXG4gIC8vIEZvciBkaWZmZXJlbnRseS1uYW1lZCB2aWV3cG9ydHMgb24gdGFuZ2VudC9vdGhlciBzZXJ2ZXJzLlxyXG4gIHZhciBwb3NzaWJsZV9pZHMgPSBbXCJ2aWV3UG9ydFwiLCBcInZpZXdwb3J0XCJdO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcG9zc2libGVfaWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgcG9zc2libGVfaWQgPSBwb3NzaWJsZV9pZHNbaV07XHJcbiAgICBpZiAoJCgnIycgKyBwb3NzaWJsZV9pZCkubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLnZpZXdwb3J0ID0gJCgnIycgKyBwb3NzaWJsZV9pZCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICAvLyBUaGlzIGlzIHRvIGRldGVjdCBrZXkgcHJlc3Nlcy4gQm90aCByZWFsIGtleSBwcmVzc2VzIGFuZCB0aGUgYm90cy4gVGhpcyBpcyBuZWVkZWQgc28gd2UgZG9uJ3QgbWVzcyB1cCB0aGUgc2ltUHJlc3NlZCBvYmplY3QuXHJcbiAgZG9jdW1lbnQub25rZXlkb3duID0gdGhpcy5fa2V5VXBkYXRlRnVuYyh0cnVlKTtcclxuXHJcbiAgLy8gVGhpcyBpcyB0byBkZXRlY3Qga2V5IHJlbGVhc2VzLiBCb3RoIHJlYWwga2V5IHJlbGVhc2VzIGFuZCB0aGUgYm90cy4gVGhpcyBpcyBuZWVkZWQgc28gd2UgZG9uJ3QgbWVzcyB1cCB0aGUgc2ltUHJlc3NlZCBvYmplY3QuXHJcbiAgZG9jdW1lbnQub25rZXl1cCA9IHRoaXMuX2tleVVwZGF0ZUZ1bmMoZmFsc2UpO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IE1vdmVyO1xyXG4vKipcclxuICogQHR5cGVkZWYgRGlySGFzaFxyXG4gKiBAdHlwZSB7b2JqZWN0fVxyXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtsZWZ0XVxyXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtyaWdodF1cclxuICogQHByb3BlcnR5IHtib29sZWFufSBbdXBdXHJcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2Rvd25dXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIFNldHMgdGhlIHN0YXRlIG9mIG1vdmVtZW50IGRpcmVjdGlvbnMgdG8gdGhhdCBpbmRpY2F0ZWQgYnkgdGhlXHJcbiAqIGBzdGF0ZWAgcGFyYW1ldGVyLiBJZiBhIGRpcmVjdGlvbiBpcyBvbWl0dGVkIGZyb20gdGhlIG9iamVjdCB0aGVuXHJcbiAqIGl0IHdpbGwgYmUgYXNzdW1lZCBgZmFsc2VgIGFuZCB0aGUga2V5cyBjb3JyZXNwb25kaW5nIHRvIHRoYXRcclxuICogbW92ZW1lbnQgZGlyZWN0aW9uIHdpbGwgYmUgJ3JlbGVhc2VkJy5cclxuICogQHBhcmFtIHtEaXJIYXNofSBzdGF0ZSAtIFRoZSBkZXNpcmVkIG1vdmVtZW50IGRpcmVjdGlvbiBzdGF0ZXMuXHJcbiAqL1xyXG5Nb3Zlci5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XHJcbiAgLy8gS2V5cyB0byBzZXQuXHJcbiAgdmFyIGtleXMgPSBbXTtcclxuICB2YXIga2V5c1NlZW4gPSB7XHJcbiAgICB1cDogZmFsc2UsXHJcbiAgICBkb3duOiBmYWxzZSxcclxuICAgIGxlZnQ6IGZhbHNlLFxyXG4gICAgcmlnaHQ6IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgLy8gQWRkIGNhbGxzIGZvciBleHBsaWNpdGx5IHNldCBrZXlzLlxyXG4gIGZvciAodmFyIGRpciBpbiBzdGF0ZSkge1xyXG4gICAga2V5c1NlZW5bZGlyXSA9IHRydWU7XHJcbiAgICBpZiAoc3RhdGVbZGlyXSAhPT0gdGhpcy5kaXJQcmVzc2VkW2Rpcl0pIHtcclxuICAgICAga2V5cy5wdXNoKHtcclxuICAgICAgICBkaXI6IGRpcixcclxuICAgICAgICBzdGF0ZTogKHN0YXRlW2Rpcl0gPyBcImtleWRvd25cIiA6IFwia2V5dXBcIilcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgY2FsbHMgZm9yIGtleXMgbm90IGV4cGxpY2l0bHkgc2V0LlxyXG4gIGZvciAodmFyIGRpciBpbiBrZXlzU2Vlbikge1xyXG4gICAgaWYgKCFrZXlzU2VlbltkaXJdICYmIHRoaXMuZGlyUHJlc3NlZFtkaXJdKSB7XHJcbiAgICAgIGtleXMucHVzaCh7XHJcbiAgICAgICAgZGlyOiBkaXIsXHJcbiAgICAgICAgc3RhdGU6IFwia2V5dXBcIlxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChrZXlzLmxlbmd0aCA+IDApXHJcbiAgICB0aGlzLl91cGRhdGVLZXlzKGtleXMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoaXMgZnVuY3Rpb24gdGFrZXMgYW4gYXJyYXkgb2YgZnVuY3Rpb24gc2ltdWxhdGVzIGEga2V5cHJlc3Mgb24gdGhlIHZpZXdwb3J0LlxyXG4gKiBAcGFyYW0ge0FycmF5Ljx7e2Rpcjogc3RyaW5nLCBzdGF0ZTogc3RyaW5nfX0+fSBrZXlzIC0gVGhlIGtleXNcclxuICogICB0byB1cGRhdGUuIFRoZSBkaXIgcHJvcGVydHkgZ2l2ZXMgdGhlIGRpcmVjdGlvbiBhbmQgc3RhdGUgaXMgZWl0aGVyXHJcbiAqICAgXCJrZXl1cFwiIG9yIFwia2V5ZG93blwiLlxyXG4gKi9cclxuTW92ZXIucHJvdG90eXBlLl91cGRhdGVLZXlzID0gZnVuY3Rpb24oa2V5cykge1xyXG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcclxuICAgIHZhciBlID0gJC5FdmVudChrZXkuc3RhdGUpO1xyXG4gICAgZS5rZXlDb2RlID0gdGhpcy5rZXlDb2Rlc1trZXkuZGlyXTtcclxuICAgIHRoaXMudmlld3BvcnQudHJpZ2dlcihlKTtcclxuICB9LCB0aGlzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIHVwZGF0aW5nIGN1cnJlbnQgbW92ZW1lbnQgZGlyZWN0aW9uXHJcbiAqIGFzIHRoZSBzZXJ2ZXIgc2VlcyBpdC5cclxuICogQHBhcmFtIHtib29sZWFufSBuZXdTdGF0ZSAtIFdoZXRoZXIgdGhlIGV2ZW50IGluZGljYXRlcyB0aGUga2V5XHJcbiAqICAgd291bGQgY2F1c2UgbW92ZW1lbnQgaW4gYSBkaXJlY3Rpb24uXHJcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn0gLSBGdW5jdGlvbiB0byB1cGRhdGUgdGhlIG1vdmVtZW50IGRpcmVjdGlvbiBzdGF0ZS5cclxuICovXHJcbk1vdmVyLnByb3RvdHlwZS5fa2V5VXBkYXRlRnVuYyA9IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGQpIHtcclxuICAgIGQgPSBkIHx8IHdpbmRvdy5ldmVudDtcclxuICAgIHN3aXRjaChkLmtleUNvZGUpIHtcclxuICAgICAgY2FzZSAzOTogY2FzZSA2ODogY2FzZSAxMDA6IHRoaXMuZGlyUHJlc3NlZC5yaWdodCA9IG5ld1N0YXRlOyBicmVhaztcclxuICAgICAgY2FzZSAzNzogY2FzZSA2NTogY2FzZSA5NzogdGhpcy5kaXJQcmVzc2VkLmxlZnQgPSBuZXdTdGF0ZTsgYnJlYWs7XHJcbiAgICAgIGNhc2UgNDA6IGNhc2UgODM6IGNhc2UgMTE1OiB0aGlzLmRpclByZXNzZWQuZG93biA9IG5ld1N0YXRlOyBicmVhaztcclxuICAgICAgY2FzZSAzODogY2FzZSA4NzogY2FzZSAxMTk6IHRoaXMuZGlyUHJlc3NlZC51cCA9IG5ld1N0YXRlOyBicmVhaztcclxuICAgIH1cclxuICB9LmJpbmQodGhpcyk7XHJcbn07XHJcblxyXG5yZXR1cm4gTW92ZXI7XHJcbiIsIi8qKlxyXG4gKiBEcmF3VXRpbHMgaG9sZHMgY2FudmFzLWRyYXdpbmcgcmVzcG9uc2liaWxpdHksIGluY2x1ZGluZyBrZWVwaW5nIHRyYWNrIG9mXHJcbiAqIHdoYXQgaXRlbXMgYXJlIHRvIGJlIGRyYXduIG9uIHRoZSBjYW52YXMgYXMgd2VsbCBhcyBob3cgdG8gYWN0dWFsbHkgZG8gaXQuXHJcbiAqIFRvIGFkZCBhbiBpdGVtIHRvIGJlIGRyYXduLCBzaW1wbHkgcmVnaXN0ZXIgaXQgdXNpbmcgdGhlIHJlZ2lzdGVyIGZ1bmN0aW9uLFxyXG4gKiBwYXNzaW5nIGluIHRoZSBuYW1lIG9mIHRoZSBnbG9iYWwgdmFyaWFibGUgdGhhdCwgd2hlbiBzZXQsIHdpbGwgcG9pbnQgdG8geW91clxyXG4gKiBvYmplY3QuIE9iamVjdHMgbXVzdCBoYXZlICdpdGVtJyBhbmQgJ2NvbG9yJyBwcm9wZXJ0aWVzLiBUaGUgaXRlbSBtdXN0IHBvaW50XHJcbiAqIHRvIGEgUG9seSwgRWRnZSwgb3IgUG9pbnQsIGFuZCB0aGUgY29sb3IgcHJvcGVydHkgbXVzdCBwb2ludCB0byBhIHN0cmluZyBkZWZpbmluZ1xyXG4gKiB0aGUgY29sb3IgdG8gYmUgdXNlZCBpbiBkcmF3aW5nIHRoZSBpdGVtLlxyXG4gKi9cclxuRHJhd1V0aWxzID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5pbml0KCk7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gRHJhd1V0aWxzO1xyXG5cclxuLy8gSW5pdGlhbGl6ZSBkcmF3aW5nIGZ1bmN0aW9ucy5cclxuRHJhd1V0aWxzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKHR5cGVvZiB0YWdwcm8ucmVuZGVyZXIgPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgY29uc29sZS5sb2coXCJDYW4ndCBoYW5kbGUgb2xkIGNhbnZhcyFcIik7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB0aGlzLnNlbGYgPSB0YWdwcm8ucGxheWVyc1t0YWdwcm8ucGxheWVySWRdO1xyXG5cclxuICAvLyBTdG9yZSBpdGVtcyB0byBiZSBkcmF3bi5cclxuICB0aGlzLnZlY3RvcnMgPSB7fTtcclxuICB0aGlzLmJhY2tncm91bmRzID0ge307XHJcbiAgdGhpcy5wb2ludHMgPSB7fTtcclxuICB0aGlzLmNpcmNsZXMgPSB7fTtcclxuXHJcbiAgLy8gQWRkIHZlY3RvcnMgY29udGFpbmVyIHRvIHBsYXllciBzcHJpdGVzIG9iamVjdC5cclxuICB0aGlzLnNlbGYuc3ByaXRlcy52ZWN0b3JzID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcclxuICB0aGlzLnNlbGYuc3ByaXRlLmFkZENoaWxkKHRoaXMuc2VsZi5zcHJpdGVzLnZlY3RvcnMpO1xyXG5cclxuICAvLyBDZW50ZXIgdmVjdG9ycyBvbiBwbGF5ZXIuXHJcbiAgdGhpcy5zZWxmLnNwcml0ZXMudmVjdG9ycy5wb3NpdGlvbi54ID0gMjA7XHJcbiAgdGhpcy5zZWxmLnNwcml0ZXMudmVjdG9ycy5wb3NpdGlvbi55ID0gMjA7XHJcbn07XHJcblxyXG4vKipcclxuICogQWRkcyBhIHZlY3RvciB0byBiZSBkcmF3biBvdmVyIHRoZSBjdXJyZW50IHBsYXllci5cclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSB1c2VkIHRvIHJlZmVyIHRvIHRoZSB2ZWN0b3IuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbY29sb3I9MHgwMDAwMDBdIC0gVGhlIGNvbG9yIHVzZWQgd2hlbiBkcmF3aW5nIHRoZVxyXG4gKiAgIHZlY3Rvci5cclxuICovXHJcbkRyYXdVdGlscy5wcm90b3R5cGUuYWRkVmVjdG9yID0gZnVuY3Rpb24obmFtZSwgY29sb3IpIHtcclxuICB2YXIgdmVjdG9yID0ge1xyXG4gICAgbmFtZTogbmFtZSxcclxuICAgIGNvbnRhaW5lcjogbmV3IFBJWEkuR3JhcGhpY3MoKSxcclxuICAgIGNvbG9yOiBjb2xvciB8fCAweDAwMDAwMFxyXG4gIH07XHJcbiAgdGhpcy52ZWN0b3JzW25hbWVdID0gdmVjdG9yO1xyXG4gIHRoaXMuc2VsZi5zcHJpdGVzLnZlY3RvcnMuYWRkQ2hpbGQodmVjdG9yLmNvbnRhaW5lcik7XHJcbn07XHJcblxyXG4vKipcclxuICogVXBkYXRlcyB0aGUgdmVjdG9yIGlkZW50aWZpZWQgd2l0aCBgbmFtZWAgd2l0aCB0aGUgdmFsdWVzIGZyb21cclxuICogcG9pbnQgYHBgLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSB2ZWN0b3IgdG8gdXBkYXRlLlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwIC0gVGhlIHBvaW50IHRvIHVzZSB0byB1cGRhdGUgdGhlIHZlY3Rvci5cclxuICovXHJcbkRyYXdVdGlscy5wcm90b3R5cGUudXBkYXRlVmVjdG9yID0gZnVuY3Rpb24obmFtZSwgcCkge1xyXG4gIHRoaXMudmVjdG9yc1tuYW1lXS54ID0gcC54O1xyXG4gIHRoaXMudmVjdG9yc1tuYW1lXS55ID0gcC55O1xyXG4gIHRoaXMuX2RyYXdWZWN0b3IodGhpcy52ZWN0b3JzW25hbWVdKTtcclxufTtcclxuXHJcbkRyYXdVdGlscy5wcm90b3R5cGUuaGlkZVZlY3RvciA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICB0aGlzLnZlY3RvcnNbbmFtZV0uY29udGFpbmVyLnZpc2libGUgPSBmYWxzZTtcclxufTtcclxuXHJcbkRyYXdVdGlscy5wcm90b3R5cGUuc2hvd1ZlY3RvciA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICB0aGlzLnZlY3RvcnNbbmFtZV0uY29udGFpbmVyLnZpc2libGUgPSB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBuYXZtZXNoIHBvbHlzIHRvIGJhY2tncm91bmQuXHJcbiAqL1xyXG5EcmF3VXRpbHMucHJvdG90eXBlLmFkZEJhY2tncm91bmQgPSBmdW5jdGlvbihuYW1lLCBjb2xvcikge1xyXG4gIHZhciBiYWNrZ3JvdW5kID0ge1xyXG4gICAgY29sb3I6IGNvbG9yLFxyXG4gICAgY29udGFpbmVyOiBuZXcgUElYSS5HcmFwaGljcygpXHJcbiAgfTtcclxuICAvLyBBZGQgYmFja2dyb3VuZCBhcyBjaGlsZCBvZiBiYWNrZ3JvdW5kIGxheWVyLlxyXG4gIHRhZ3Byby5yZW5kZXJlci5sYXllcnMuYmFja2dyb3VuZC5hZGRDaGlsZChiYWNrZ3JvdW5kLmNvbnRhaW5lcik7XHJcbiAgdGhpcy5iYWNrZ3JvdW5kc1tuYW1lXSA9IGJhY2tncm91bmQ7XHJcbn07XHJcblxyXG5EcmF3VXRpbHMucHJvdG90eXBlLnVwZGF0ZUJhY2tncm91bmQgPSBmdW5jdGlvbihuYW1lLCBwb2x5cykge1xyXG4gIHRoaXMuYmFja2dyb3VuZHNbbmFtZV0ucG9seXMgPSBwb2x5cztcclxuICB0aGlzLl9kcmF3QmFja2dyb3VuZCh0aGlzLmJhY2tncm91bmRzW25hbWVdKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgY2lyY2xlIHRvIGJlIGRyYXduIG9uIHRoZSBzY3JlZW4uXHJcbiAqL1xyXG5EcmF3VXRpbHMucHJvdG90eXBlLmFkZENpcmNsZSA9IGZ1bmN0aW9uKG5hbWUsIHJhZGl1cywgY29sb3IpIHtcclxuICB2YXIgY2lyY2xlID0ge1xyXG4gICAgY29sb3I6IGNvbG9yLFxyXG4gICAgcmFkaXVzOiByYWRpdXMsXHJcbiAgICBjb250YWluZXI6IG5ldyBQSVhJLkdyYXBoaWNzKClcclxuICB9O1xyXG4gIHRhZ3Byby5yZW5kZXJlci5sYXllcnMuZm9yZWdyb3VuZC5hZGRDaGlsZChjaXJjbGUuY29udGFpbmVyKTtcclxuICB0aGlzLmNpcmNsZXNbbmFtZV0gPSBjaXJjbGU7XHJcbn07XHJcblxyXG5EcmF3VXRpbHMucHJvdG90eXBlLnVwZGF0ZUNpcmNsZSA9IGZ1bmN0aW9uKG5hbWUsIHBvaW50KSB7XHJcbiAgdGhpcy5jaXJjbGVzW25hbWVdLmNlbnRlciA9IHBvaW50O1xyXG4gIHRoaXMuX2RyYXdDaXJjbGUodGhpcy5jaXJjbGVzW25hbWVdKTtcclxufTtcclxuXHJcbkRyYXdVdGlscy5wcm90b3R5cGUuX2RyYXdDaXJjbGUgPSBmdW5jdGlvbihjaXJjbGUpIHtcclxuICB2YXIgYyA9IGNpcmNsZTtcclxuXHJcbiAgYy5jb250YWluZXIuY2xlYXIoKTtcclxuICBjLmNvbnRhaW5lci5saW5lU3R5bGUoMSwgYy5jb2xvciwgMSk7XHJcbiAgYy5jb250YWluZXIuZHJhd0NpcmNsZShjLmNlbnRlci54LCBjLmNlbnRlci55LCBjLnJhZGl1cyk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVwcmVzZW50cyBhIHBvaW50IHRvIGJlIGRyYXduIG9uIHRoZSBzY3JlZW4sIGFsb25nIHdpdGggaW5mb3JtYXRpb25cclxuICogYWJvdXQgaG93IHRvIGRyYXcgaXQuXHJcbiAqIEB0eXBlZGVmIFBvaW50SW5mb1xyXG4gKiBAdHlwZSB7b2JqZWN0fVxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29sb3IgLSBUaGUgZmlsbCBjb2xvciBmb3IgdGhlIHBvaW50LlxyXG4gKiBAcHJvcGVydHkge1BJWEkuR3JhcGhpY3N9IGNvbnRhaW5lciAtIFRoZSBjb250YWluZXIgb24gd2hpY2ggdG9cclxuICogICBkcmF3IHRoZSBwb2ludC5cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGxheWVyIC0gVGhlIGxheWVyIG9uIHdoaWNoIHRvIGRyYXcgdGhlIHBvaW50LFxyXG4gKiAgIGNhbiBiZSBhbnkgbGF5ZXIgaWRlbnRpZmllZCBpbiBgdGFncHJvLnJlbmRlcmVyLmxheWVyc2AuXHJcbiAqIEBwcm9wZXJ0eSB7P1BvaW50fSBwb2ludCAtIFRoZSBsb2NhdGlvbiB0byBkcmF3IHRoZSBwb2ludC4gTWF5XHJcbiAqICAgYmUgbnVsbCBhcyBpdCBpcyBub3QgaW5pdGlhbGx5IHNldC5cclxuICovXHJcblxyXG4vKipcclxuICogUmVwcmVzZW50cyBhIHNldCBvZiBwb2ludHMgdG8gYmUgZHJhd24gb24gdGhlIHNjcmVlbiwgYWxvbmcgd2l0aFxyXG4gKiBpbmZvcm1hdGlvbiBhYm91dCBob3cgdG8gZHJhdyB0aGVtLlxyXG4gKiBAdHlwZWRlZiBQb2ludHNJbmZvXHJcbiAqIEB0eXBlIHtvYmplY3R9XHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb2xvciAtIFRoZSBmaWxsIGNvbG9yIGZvciB0aGUgcG9pbnQuXHJcbiAqIEBwcm9wZXJ0eSB7UElYSS5HcmFwaGljc30gY29udGFpbmVyIC0gVGhlIGNvbnRhaW5lciBvbiB3aGljaCB0b1xyXG4gKiAgIGRyYXcgdGhlIHBvaW50LlxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbGF5ZXIgLSBUaGUgbGF5ZXIgb24gd2hpY2ggdG8gZHJhdyB0aGUgcG9pbnQsXHJcbiAqICAgY2FuIGJlIGFueSBsYXllciBpZGVudGlmaWVkIGluIGB0YWdwcm8ucmVuZGVyZXIubGF5ZXJzYC5cclxuICovXHJcblxyXG4vKipcclxuICogQWRkIGFuIGlkZW50aWZpZXIgZm9yIGEgcG9pbnQgb3Igc2V0IG9mIHBvaW50cyB0byBiZSBkcmF3biBvbiB0aGVcclxuICogc2NyZWVuLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIHRvIGlkZW50aWZ5IHRoZSBwb2ludC5cclxuICogQHBhcmFtIHtpbnRlZ2VyfSBjb2xvciAtIFRoZSBudW1iZXIgaWRlbnRpZnlpbmcgdGhlIGNvbG9yIHRvIHVzZS5cclxuICogQHBhcmFtIHtzdHJpbmd9IFtsYXllcj1cImJhY2tncm91bmRcIl0gLSBBIHN0cmluZyBpZGVudGlmeWluZyB0aGVcclxuICogICBsYXllciB0byBkcmF3IHRoZSBwb2ludCBvbi5cclxuICovXHJcbkRyYXdVdGlscy5wcm90b3R5cGUuYWRkUG9pbnQgPSBmdW5jdGlvbihuYW1lLCBjb2xvciwgbGF5ZXIpIHtcclxuICBpZiAodHlwZW9mIGxheWVyID09IFwidW5kZWZpbmVkXCIpIGxheWVyID0gXCJiYWNrZ3JvdW5kXCI7XHJcbiAgdmFyIHBvaW50ID0ge1xyXG4gICAgY29sb3I6IGNvbG9yLFxyXG4gICAgY29udGFpbmVyOiBuZXcgUElYSS5HcmFwaGljcygpLFxyXG4gICAgbGF5ZXI6IGxheWVyXHJcbiAgfTtcclxuICB0YWdwcm8ucmVuZGVyZXIubGF5ZXJzW2xheWVyXS5hZGRDaGlsZChwb2ludC5jb250YWluZXIpO1xyXG4gIHRoaXMucG9pbnRzW25hbWVdID0gcG9pbnQ7XHJcbn07XHJcblxyXG4vKipcclxuICogVXBkYXRlIHRoZSBsb2NhdGlvbiBvZiBhIHBvaW50IHRvIGJlIGRyYXduIG9uIHRoZSBzY3JlZW4uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHBvaW50IHRvIHVwZGF0ZS5cclxuICogQHBhcmFtIHtQb2ludH0gcG9pbnQgLSBUaGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHBvaW50LlxyXG4gKi9cclxuRHJhd1V0aWxzLnByb3RvdHlwZS51cGRhdGVQb2ludCA9IGZ1bmN0aW9uKG5hbWUsIHBvaW50KSB7XHJcbiAgdGhpcy5wb2ludHNbbmFtZV0ucG9pbnQgPSBwb2ludDtcclxuICB0aGlzLl9kcmF3UG9pbnQodGhpcy5wb2ludHNbbmFtZV0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSB0aGUgbG9jYXRpb24gb2YgYSBzZXQgcG9pbnQgdG8gYmUgZHJhd24gb24gdGhlIHNjcmVlbi5cclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgcG9pbnQgdG8gdXBkYXRlLlxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2ludD59IHBvaW50cyAtIFRoZSBzZXQgb2YgdXBkYXRlZCBwb2ludHMuXHJcbiAqL1xyXG5EcmF3VXRpbHMucHJvdG90eXBlLnVwZGF0ZVBvaW50cyA9IGZ1bmN0aW9uKG5hbWUsIHBvaW50cykge1xyXG4gIHRoaXMucG9pbnRzW25hbWVdLnBvaW50cyA9IHBvaW50cztcclxuICB0aGlzLl9kcmF3UG9pbnRzKHRoaXMucG9pbnRzW25hbWVdKTtcclxufTtcclxuXHJcbkRyYXdVdGlscy5wcm90b3R5cGUuaGlkZVBvaW50ID0gZnVuY3Rpb24obmFtZSkge1xyXG4gIHRoaXMucG9pbnRzW25hbWVdLmNvbnRhaW5lci52aXNpYmxlID0gZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVwcmVzZW50cyBhIDJkIHZlY3RvciBlbWFuYXRpbmcgZnJvbSB0aGUgY2VudGVyIG9mIHRoZSBwbGF5ZXIsXHJcbiAqIGFsb25nIHdpdGggYXR0cmlidXRlcyBmb3IgZHJhd2luZy5cclxuICogQHR5cGVkZWYgVmVjdG9ySW5mb1xyXG4gKiBAdHlwZSB7b2JqZWN0fVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSAtIEFuIGlkZW50aWZpZXIgZm9yIHRoZSB2ZWN0b3IgKHVuaXF1ZVxyXG4gKiAgIHJlbGF0aXZlIHRvIHRoZSBvdGhlciB2ZWN0b3JzLilcclxuICogQHByb3BlcnR5IHtQSVhJLkdyYXBoaWNzfSBjb250YWluZXIgLSBUaGUgZ3JhcGhpY3MgY29udGFpbmVyIHRvXHJcbiAqICAgZHJhdyB0aGUgdmVjdG9yIG9uLlxyXG4gKiBAcHJvcGVydHkge2ludGVnZXJ9IGNvbG9yIC0gTnVtYmVyIHJlcHJlc2VudGluZyBjb2xvciB0byB1c2UgKGUuZy5cclxuICogICAweDAwMDAwMC4pXHJcbiAqIEBwcm9wZXJ0eSB7P251bWJlcn0gW3hdIC0gTnVtYmVyIHJlcHJlc2VudGluZyB0aGUgeCBjb29yZGluYXRlIG9mXHJcbiAqICAgdGhlIHZlY3RvciwgcmVsYXRpdmUgdG8gdGhlIGNlbnRlciBvZiB0aGUgcGxheWVyLlxyXG4gKiBAcHJvcGVydHkgez9udW1iZXJ9IFt5XSAtIE51bWJlciByZXByZXNlbnRpbmcgdGhlIHkgY29vcmRpbmF0ZSBvZlxyXG4gKiAgIHRoZSB2ZWN0b3IsIHJlbGF0aXZlIHRvIHRoZSBjZW50ZXIgb2YgdGhlIHBsYXllci5cclxuICovXHJcbi8qKlxyXG4gKiBEcmF3IGEgdmVjdG9yIGFzIGEgc21hbGwgYXJyb3cgYmFzZWQgYXQgdGhlIGNlbnRlciBvZiB0aGUgY3VycmVudFxyXG4gKiBwbGF5ZXIuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7VmVjdG9ySW5mb30gdmVjdG9yXHJcbiAqL1xyXG5EcmF3VXRpbHMucHJvdG90eXBlLl9kcmF3VmVjdG9yID0gZnVuY3Rpb24odmVjdG9yKSB7XHJcbiAgdmFyIHYgPSBuZXcgUG9pbnQodmVjdG9yLngsIHZlY3Rvci55KTtcclxuICB2YXIgdl9uID0gdi5ub3JtYWxpemUoKTtcclxuICBpZiAodi5sZW4oKSA8IDIpIHtcclxuICAgIHRoaXMuaGlkZVZlY3Rvcih2ZWN0b3IubmFtZSk7XHJcbiAgICByZXR1cm47XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMuc2hvd1ZlY3Rvcih2ZWN0b3IubmFtZSk7XHJcbiAgfVxyXG4gIHZhciB2ZWN0b3JXaWR0aCA9IDQ7XHJcbiAgLy8gRm9yIGFycm93aGVhZC5cclxuICB2YXIgdmVjdG9yQW5nbGUgPSBNYXRoLmF0YW4yKHYueSwgdi54KTtcclxuICB2YXIgaGVhZEFuZ2xlID0gTWF0aC5QSSAvIDY7XHJcbiAgdmFyIGhlYWRMZW5ndGggPSAxMDtcclxuICB2YXIgbGVmdEhlYWQgPSAobmV3IFBvaW50KFxyXG4gICAgTWF0aC5jb3MoKE1hdGguUEkgLSBoZWFkQW5nbGUgKyB2ZWN0b3JBbmdsZSkgJSAoMiAqIE1hdGguUEkpKSxcclxuICAgIE1hdGguc2luKChNYXRoLlBJIC0gaGVhZEFuZ2xlICsgdmVjdG9yQW5nbGUpICUgKDIgKiBNYXRoLlBJKSkpKTtcclxuICBsZWZ0SGVhZCA9IGxlZnRIZWFkLm11bChoZWFkTGVuZ3RoKS5hZGQodik7XHJcbiAgdmFyIHJpZ2h0SGVhZCA9IChuZXcgUG9pbnQoXHJcbiAgICBNYXRoLmNvcygoTWF0aC5QSSArIGhlYWRBbmdsZSArIHZlY3RvckFuZ2xlKSAlICgyICogTWF0aC5QSSkpLFxyXG4gICAgTWF0aC5zaW4oKE1hdGguUEkgKyBoZWFkQW5nbGUgKyB2ZWN0b3JBbmdsZSkgJSAoMiAqIE1hdGguUEkpKSkpO1xyXG4gIHJpZ2h0SGVhZCA9IHJpZ2h0SGVhZC5tdWwoaGVhZExlbmd0aCkuYWRkKHYpO1xyXG4gIC8vIEZvciBmYXQgdmVjdG9yIGJvZHkuXHJcbiAgdmFyIGxlZnRCYXNlID0gKG5ldyBQb2ludChcclxuICAgIE1hdGguY29zKChNYXRoLlBJIC8gMiArIHZlY3RvckFuZ2xlKSAlICgyICogTWF0aC5QSSkpLFxyXG4gICAgTWF0aC5zaW4oKE1hdGguUEkgLyAyICsgdmVjdG9yQW5nbGUpICUgKDIgKiBNYXRoLlBJKSkpKTtcclxuICB2YXIgcmlnaHRCYXNlID0gbGVmdEJhc2UubXVsKC0xKTtcclxuXHJcbiAgbGVmdEJhc2UgPSBsZWZ0QmFzZS5tdWwodmVjdG9yV2lkdGggLyAyKTtcclxuICByaWdodEJhc2UgPSByaWdodEJhc2UubXVsKHZlY3RvcldpZHRoIC8gMik7XHJcbiAgdmFyIGVuZCA9IHZfbi5tdWwodl9uLmRvdChsZWZ0SGVhZCkpO1xyXG4gIHZhciBsZWZ0VG9wID0gbGVmdEJhc2UuYWRkKGVuZCk7XHJcbiAgdmFyIHJpZ2h0VG9wID0gcmlnaHRCYXNlLmFkZChlbmQpO1xyXG5cclxuICAvLyBBZGQgc2hhcGVzIHRvIGNvbnRhaW5lci5cclxuICB2YXIgYyA9IHZlY3Rvci5jb250YWluZXI7XHJcbiAgYy5jbGVhcigpO1xyXG4gIGMubGluZVN0eWxlKDIsIDB4MDAwMDAwLCAxKTtcclxuICBjLmJlZ2luRmlsbCh2ZWN0b3IuY29sb3IsIDEpO1xyXG4gIGMubW92ZVRvKGxlZnRCYXNlLngsIGxlZnRCYXNlLnkpO1xyXG4gIGMubGluZVRvKGxlZnRUb3AueCwgbGVmdFRvcC55KTtcclxuICBjLmxpbmVUbyhsZWZ0SGVhZC54LCBsZWZ0SGVhZC55KTtcclxuICBjLmxpbmVUbyh2LngsIHYueSk7XHJcbiAgYy5saW5lVG8ocmlnaHRIZWFkLngsIHJpZ2h0SGVhZC55KTtcclxuICBjLmxpbmVUbyhyaWdodFRvcC54LCByaWdodFRvcC55KTtcclxuICBjLmxpbmVUbyhyaWdodEJhc2UueCwgcmlnaHRCYXNlLnkpO1xyXG4gIHZhciB2X25fbCA9IHZfbi5tdWwodmVjdG9yV2lkdGggLyAyKTtcclxuICB2YXIgY3AxID0gcmlnaHRCYXNlLnN1Yih2X25fbCk7XHJcbiAgdmFyIGNwMiA9IGxlZnRCYXNlLnN1Yih2X25fbCk7XHJcbiAgYy5iZXppZXJDdXJ2ZVRvKGNwMS54LCBjcDEueSwgY3AyLngsIGNwMi55LCBsZWZ0QmFzZS54LCBsZWZ0QmFzZS55KTtcclxuICBjLmVuZEZpbGwoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZWRyYXcgYmFja2dyb3VuZCBpbiBiYWNrZ3JvdW5kIGNvbnRhaW5lciBnaXZlbiBhIGJhY2tncm91bmRcclxuICogb2JqZWN0LlxyXG4gKiBAcGFyYW0ge0JhY2tncm91bmRJbmZvfSBiYWNrZ3JvdW5kIC0gVGhlIGJhY2tncm91bmQgdG8gZHJhdy5cclxuICovXHJcbkRyYXdVdGlscy5wcm90b3R5cGUuX2RyYXdCYWNrZ3JvdW5kID0gZnVuY3Rpb24oYmFja2dyb3VuZCkge1xyXG4gIHZhciBiZyA9IGJhY2tncm91bmQ7XHJcblxyXG4gIHZhciBwb2x5cyA9IGJhY2tncm91bmQucG9seXMubWFwKGZ1bmN0aW9uKHBvbHkpIHtcclxuICAgIHJldHVybiB0aGlzLl9jb252ZXJ0UG9seVRvUGl4aVBvbHkocG9seSk7XHJcbiAgfSwgdGhpcyk7XHJcblxyXG4gIFxyXG4gIGJnLmNvbnRhaW5lci5jbGVhcigpO1xyXG4gIGJnLmNvbnRhaW5lci5saW5lU3R5bGUoMSwgYmcuY29sb3IsIDEpO1xyXG4gIHBvbHlzLmZvckVhY2goZnVuY3Rpb24oc2hhcGUpIHtcclxuICAgIGJnLmNvbnRhaW5lci5kcmF3U2hhcGUoc2hhcGUpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERyYXcgYSBwb2ludCwgZ2l2ZW4gYSBwb2ludCB0byBkcmF3LlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge1BvaW50SW5mb30gcG9pbnQgLSBUaGUgcG9pbnQgdG8gZHJhdy5cclxuICovXHJcbkRyYXdVdGlscy5wcm90b3R5cGUuX2RyYXdQb2ludCA9IGZ1bmN0aW9uKHBvaW50KSB7XHJcbiAgdmFyIHAgPSBwb2ludDtcclxuXHJcbiAgcC5jb250YWluZXIuY2xlYXIoKTtcclxuICBwLmNvbnRhaW5lci5saW5lU3R5bGUoMSwgMHgwMDAwMDAsIDEpO1xyXG4gIHAuY29udGFpbmVyLmJlZ2luRmlsbChwb2ludC5jb2xvciwgMSk7XHJcbiAgcC5jb250YWluZXIuZHJhd0NpcmNsZShwLnBvaW50LngsIHAucG9pbnQueSwgMyk7XHJcbiAgcC5jb250YWluZXIuZW5kRmlsbCgpO1xyXG4gIHAuY29udGFpbmVyLnZpc2libGUgPSB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERyYXcgYSBzZXQgb2YgcG9pbnRzLCBnaXZlbiBpbmZvcm1hdGlvbiBhYm91dCB0aGVtLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge1BvaW50c0luZm99IHBvaW50cyAtIFRoZSBwb2ludHMgdG8gZHJhdy5cclxuICovXHJcbkRyYXdVdGlscy5wcm90b3R5cGUuX2RyYXdQb2ludHMgPSBmdW5jdGlvbihwb2ludHMpIHtcclxuICB2YXIgcCA9IHBvaW50cztcclxuXHJcbiAgcC5jb250YWluZXIuY2xlYXIoKTtcclxuICBwLmNvbnRhaW5lci5saW5lU3R5bGUoMSwgMHgwMDAwMDAsIDEpO1xyXG4gIHAuY29udGFpbmVyLmJlZ2luRmlsbChwLmNvbG9yLCAxKTtcclxuICBwLnBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uKHBvaW50KSB7XHJcbiAgICBwLmNvbnRhaW5lci5kcmF3Q2lyY2xlKHBvaW50LngsIHBvaW50LnksIDMpO1xyXG4gIH0pO1xyXG4gIHAuY29udGFpbmVyLmVuZEZpbGwoKTtcclxuICBwLmNvbnRhaW5lci52aXNpYmxlID0gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge1BvbHl9IHBvbHlcclxuICovXHJcbkRyYXdVdGlscy5wcm90b3R5cGUuX2NvbnZlcnRQb2x5VG9QaXhpUG9seSA9IGZ1bmN0aW9uKHBvbHkpIHtcclxuICB2YXIgcG9pbnRfYXJyYXkgPSBwb2x5LnBvaW50cy5yZWR1Y2UoZnVuY3Rpb24odmFsdWVzLCBwb2ludCkge1xyXG4gICAgcmV0dXJuIHZhbHVlcy5jb25jYXQocG9pbnQueCwgcG9pbnQueSk7XHJcbiAgfSwgW10pO1xyXG4gIC8vIEFkZCBvcmlnaW5hbCBwb2ludCBiYWNrIHRvIHBvaW50IGFycmF5IHRvIHJlc29sdmUgUGl4aS5qcyByZW5kZXJpbmcgaXNzdWUuXHJcbiAgcG9pbnRfYXJyYXkgPSBwb2ludF9hcnJheS5jb25jYXQocG9pbnRfYXJyYXlbMF0sIHBvaW50X2FycmF5WzFdKTtcclxuICByZXR1cm4gbmV3IFBJWEkuUG9seWdvbihwb2ludF9hcnJheSk7XHJcbn07XHJcbiIsIi8qKlxyXG4gKiBBIHBvaW50IGNhbiByZXByZXNlbnQgYSB2ZXJ0ZXggaW4gYSAyZCBlbnZpcm9ubWVudCBvciBhIHZlY3Rvci5cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIGB4YCBjb29yZGluYXRlIG9mIHRoZSBwb2ludC5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgYHlgIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LlxyXG4gKi9cclxuUG9pbnQgPSBmdW5jdGlvbih4LCB5KSB7XHJcbiAgdGhpcy54ID0geDtcclxuICB0aGlzLnkgPSB5O1xyXG59O1xyXG5leHBvcnRzLlBvaW50ID0gUG9pbnQ7XHJcblxyXG4vKipcclxuICogQ29udmVydCBhIHBvaW50LWxpa2Ugb2JqZWN0IGludG8gYSBwb2ludC5cclxuICogQHBhcmFtIHtQb2ludExpa2V9IHAgLSBUaGUgcG9pbnQtbGlrZSBvYmplY3QgdG8gY29udmVydC5cclxuICogQHJldHVybiB7UG9pbnR9IC0gVGhlIG5ldyBwb2ludCByZXByZXNlbnRpbmcgdGhlIHBvaW50LWxpa2VcclxuICogICBvYmplY3QuXHJcbiAqL1xyXG5Qb2ludC5mcm9tUG9pbnRMaWtlID0gZnVuY3Rpb24ocCkge1xyXG4gIHJldHVybiBuZXcgUG9pbnQocC54LCBwLnkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFN0cmluZyBtZXRob2QgZm9yIHBvaW50LWxpa2Ugb2JqZWN0cy5cclxuICogQHBhcmFtIHtQb2ludExpa2V9IHAgLSBUaGUgcG9pbnQtbGlrZSBvYmplY3QgdG8gY29udmVydC5cclxuICogQHJldHVybiB7UG9pbnR9IC0gVGhlIG5ldyBwb2ludCByZXByZXNlbnRpbmcgdGhlIHBvaW50LWxpa2VcclxuICogICBvYmplY3QuXHJcbiAqL1xyXG5Qb2ludC50b1N0cmluZyA9IGZ1bmN0aW9uKHApIHtcclxuICByZXR1cm4gXCJ4XCIgKyBwLnggKyBcInlcIiArIHAueTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUYWtlcyBhIHBvaW50IG9yIHNjYWxhciBhbmQgYWRkcyBzbG90d2lzZSBpbiB0aGUgY2FzZSBvZiBhbm90aGVyXHJcbiAqIHBvaW50LCBvciB0byBlYWNoIHBhcmFtZXRlciBpbiB0aGUgY2FzZSBvZiBhIHNjYWxhci5cclxuICogQHBhcmFtIHsoUG9pbnR8bnVtYmVyKX0gLSBUaGUgUG9pbnQsIG9yIHNjYWxhciwgdG8gYWRkIHRvIHRoaXNcclxuICogICBwb2ludC5cclxuICovXHJcblBvaW50LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihwKSB7XHJcbiAgaWYgKHR5cGVvZiBwID09IFwibnVtYmVyXCIpXHJcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCArIHAsIHRoaXMueSArIHApO1xyXG4gIHJldHVybiBuZXcgUG9pbnQodGhpcy54ICsgcC54LCB0aGlzLnkgKyBwLnkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRha2VzIGEgcG9pbnQgb3Igc2NhbGFyIGFuZCBzdWJ0cmFjdHMgc2xvdHdpc2UgaW4gdGhlIGNhc2Ugb2ZcclxuICogYW5vdGhlciBwb2ludCBvciBmcm9tIGVhY2ggcGFyYW1ldGVyIGluIHRoZSBjYXNlIG9mIGEgc2NhbGFyLlxyXG4gKiBAcGFyYW0geyhQb2ludHxudW1iZXIpfSAtIFRoZSBQb2ludCwgb3Igc2NhbGFyLCB0byBzdWJ0cmFjdCBmcm9tXHJcbiAqICAgdGhpcyBwb2ludC5cclxuICovXHJcblBvaW50LnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbihwKSB7XHJcbiAgaWYgKHR5cGVvZiBwID09IFwibnVtYmVyXCIpXHJcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCAtIHAsIHRoaXMueSAtIHApO1xyXG4gIHJldHVybiBuZXcgUG9pbnQodGhpcy54IC0gcC54LCB0aGlzLnkgLSBwLnkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRha2VzIGEgc2NhbGFyIHZhbHVlIGFuZCBtdWx0aXBsaWVzIGVhY2ggcGFyYW1ldGVyIG9mIHRoZSBwb2ludFxyXG4gKiBieSB0aGUgc2NhbGFyLlxyXG4gKiBAcGFyYW0gIHtudW1iZXJ9IGYgLSBUaGUgbnVtYmVyIHRvIG11bHRpcGxlIHRoZSBwYXJhbWV0ZXJzIGJ5LlxyXG4gKiBAcmV0dXJuIHtQb2ludH0gLSBBIG5ldyBwb2ludCB3aXRoIHRoZSBjYWxjdWxhdGVkIGNvb3JkaW5hdGVzLlxyXG4gKi9cclxuUG9pbnQucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uKGYpIHtcclxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCAqIGYsIHRoaXMueSAqIGYpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRha2VzIGEgc2NhbGFyIHZhbHVlIGFuZCBkaXZpZGVzIGVhY2ggcGFyYW1ldGVyIG9mIHRoZSBwb2ludFxyXG4gKiBieSB0aGUgc2NhbGFyLlxyXG4gKiBAcGFyYW0gIHtudW1iZXJ9IGYgLSBUaGUgbnVtYmVyIHRvIGRpdmlkZSB0aGUgcGFyYW1ldGVycyBieS5cclxuICogQHJldHVybiB7UG9pbnR9IC0gQSBuZXcgcG9pbnQgd2l0aCB0aGUgY2FsY3VsYXRlZCBjb29yZGluYXRlcy5cclxuICovXHJcblBvaW50LnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbihmKSB7XHJcbiAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnggLyBmLCB0aGlzLnkgLyBmKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUYWtlcyBhbm90aGVyIHBvaW50IGFuZCByZXR1cm5zIGEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlXHJcbiAqIHBvaW50cyBhcmUgZXF1YWwuIFR3byBwb2ludHMgYXJlIGVxdWFsIGlmIHRoZWlyIHBhcmFtZXRlcnMgYXJlXHJcbiAqIGVxdWFsLlxyXG4gKiBAcGFyYW0gIHtQb2ludH0gcCAtIFRoZSBwb2ludCB0byBjaGVjayBlcXVhbGl0eSBhZ2FpbnN0LlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSB0d28gcG9pbnRzIGFyZSBlcXVhbC5cclxuICovXHJcblBvaW50LnByb3RvdHlwZS5lcSA9IGZ1bmN0aW9uKHApIHtcclxuICByZXR1cm4gKHRoaXMueCA9PSBwLnggJiYgdGhpcy55ID09IHAueSk7XHJcbn07XHJcblxyXG4vKipcclxuICogVGFrZXMgYW5vdGhlciBwb2ludCBhbmQgcmV0dXJucyBhIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZVxyXG4gKiBwb2ludHMgYXJlIG5vdCBlcXVhbC4gVHdvIHBvaW50cyBhcmUgY29uc2lkZXJlZCBub3QgZXF1YWwgaWYgdGhlaXJcclxuICogcGFyYW1ldGVycyBhcmUgbm90IGVxdWFsLlxyXG4gKiBAcGFyYW0gIHtQb2ludH0gcCAtIFRoZSBwb2ludCB0byBjaGVjayBlcXVhbGl0eSBhZ2FpbnN0LlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSB0d28gcG9pbnRzIGFyZSBub3QgZXF1YWwuXHJcbiAqL1xyXG5Qb2ludC5wcm90b3R5cGUubmVxID0gZnVuY3Rpb24ocCkge1xyXG4gIHJldHVybiAodGhpcy54ICE9IHAueCB8fCB0aGlzLnkgIT0gcC55KTtcclxufTtcclxuXHJcbi8vIEdpdmVuIGFub3RoZXIgcG9pbnQsIHJldHVybnMgdGhlIGRvdCBwcm9kdWN0LlxyXG5Qb2ludC5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24ocCkge1xyXG4gIHJldHVybiAodGhpcy54ICogcC54ICsgdGhpcy55ICogcC55KTtcclxufTtcclxuXHJcbi8vIEdpdmVuIGFub3RoZXIgcG9pbnQsIHJldHVybnMgdGhlICdjcm9zcyBwcm9kdWN0Jywgb3IgYXQgbGVhc3QgdGhlIDJkXHJcbi8vIGVxdWl2YWxlbnQuXHJcblBvaW50LnByb3RvdHlwZS5jcm9zcyA9IGZ1bmN0aW9uKHApIHtcclxuICByZXR1cm4gKHRoaXMueCAqIHAueSAtIHRoaXMueSAqIHAueCk7XHJcbn07XHJcblxyXG4vLyBHaXZlbiBhbm90aGVyIHBvaW50LCByZXR1cm5zIHRoZSBkaXN0YW5jZSB0byB0aGF0IHBvaW50LlxyXG5Qb2ludC5wcm90b3R5cGUuZGlzdCA9IGZ1bmN0aW9uKHApIHtcclxuICB2YXIgZGlmZiA9IHRoaXMuc3ViKHApO1xyXG4gIHJldHVybiBNYXRoLnNxcnQoZGlmZi5kb3QoZGlmZikpO1xyXG59O1xyXG5cclxuLy8gR2l2ZW4gYW5vdGhlciBwb2ludCwgcmV0dXJucyB0aGUgc3F1YXJlZCBkaXN0YW5jZSB0byB0aGF0IHBvaW50LlxyXG5Qb2ludC5wcm90b3R5cGUuZGlzdDIgPSBmdW5jdGlvbihwKSB7XHJcbiAgdmFyIGRpZmYgPSB0aGlzLnN1YihwKTtcclxuICByZXR1cm4gZGlmZi5kb3QoZGlmZik7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBwb2ludCBpcyAoMCwgMCkuXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciBvciBub3QgdGhlIHBvaW50IGlzICgwLCAwKS5cclxuICovXHJcblBvaW50LnByb3RvdHlwZS56ZXJvID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMueCA9PSAwICYmIHRoaXMueSA9PSAwO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLmxlbiA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLmRpc3QobmV3IFBvaW50KDAsIDApKTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgbiA9IHRoaXMuZGlzdChuZXcgUG9pbnQoMCwgMCkpO1xyXG4gIGlmIChuID4gMCkgcmV0dXJuIHRoaXMuZGl2KG4pO1xyXG4gIHJldHVybiBuZXcgUG9pbnQoMCwgMCk7XHJcbn07XHJcblxyXG5Qb2ludC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gJ3gnICsgdGhpcy54ICsgJ3knICsgdGhpcy55O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiBhIGNvcHkgb2YgdGhlIHBvaW50LlxyXG4gKiBAcmV0dXJuIHtQb2ludH0gLSBUaGUgbmV3IHBvaW50LlxyXG4gKi9cclxuUG9pbnQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XHJcbn07XHJcblxyXG4vKipcclxuICogRWRnZXMgYXJlIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBib3JkZXIgYmV0d2VlbiB0d28gYWRqYWNlbnRcclxuICogcG9seWdvbnMuXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAcGFyYW0ge1BvaW50fSBwMSAtIFRoZSBmaXJzdCBwb2ludCBvZiB0aGUgZWRnZS5cclxuICogQHBhcmFtIHtQb2ludH0gcDIgLSBUaGUgc2Vjb25kIHBvaW50IG9mIHRoZSBlZGdlLlxyXG4gKi9cclxuRWRnZSA9IGZ1bmN0aW9uKHAxLCBwMikge1xyXG4gIHRoaXMucDEgPSBwMTtcclxuICB0aGlzLnAyID0gcDI7XHJcbiAgdGhpcy5jZW50ZXIgPSBwMS5hZGQocDIuc3ViKHAxKS5kaXYoMikpO1xyXG4gIHRoaXMucG9pbnRzID0gW3RoaXMucDEsIHRoaXMuY2VudGVyLCB0aGlzLnAyXTtcclxufTtcclxuZXhwb3J0cy5FZGdlID0gRWRnZTtcclxuXHJcbkVkZ2UucHJvdG90eXBlLl9DQ1cgPSBmdW5jdGlvbihwMSwgcDIsIHAzKSB7XHJcbiAgYSA9IHAxLng7IGIgPSBwMS55O1xyXG4gIGMgPSBwMi54OyBkID0gcDIueTtcclxuICBlID0gcDMueDsgZiA9IHAzLnk7XHJcbiAgcmV0dXJuIChmIC0gYikgKiAoYyAtIGEpID4gKGQgLSBiKSAqIChlIC0gYSk7XHJcbn07XHJcblxyXG4vKipcclxuICogZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNjcyNTcxNVxyXG4gKiBDaGVja3Mgd2hldGhlciB0aGlzIGVkZ2UgaW50ZXJzZWN0cyB0aGUgcHJvdmlkZWQgZWRnZS5cclxuICogQHBhcmFtIHtFZGdlfSBlZGdlIC0gVGhlIGVkZ2UgdG8gY2hlY2sgaW50ZXJzZWN0aW9uIGZvci5cclxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgZWRnZXMgaW50ZXJzZWN0LlxyXG4gKi9cclxuRWRnZS5wcm90b3R5cGUuaW50ZXJzZWN0cyA9IGZ1bmN0aW9uKGVkZ2UpIHtcclxuICB2YXIgcTEgPSBlZGdlLnAxLCBxMiA9IGVkZ2UucDI7XHJcbiAgaWYgKHExLmVxKHRoaXMucDEpIHx8IHExLmVxKHRoaXMucDIpIHx8IHEyLmVxKHRoaXMucDEpIHx8IHEyLmVxKHRoaXMucDIpKSByZXR1cm4gZmFsc2U7XHJcbiAgcmV0dXJuICh0aGlzLl9DQ1codGhpcy5wMSwgcTEsIHEyKSAhPSB0aGlzLl9DQ1codGhpcy5wMiwgcTEsIHEyKSkgJiYgKHRoaXMuX0NDVyh0aGlzLnAxLCB0aGlzLnAyLCBxMSkgIT0gdGhpcy5fQ0NXKHRoaXMucDEsIHRoaXMucDIsIHEyKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUG9seWdvbiBjbGFzcy5cclxuICogQ2FuIGJlIGluaXRpYWxpemVkIHdpdGggYW4gYXJyYXkgb2YgcG9pbnRzLlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHBhcmFtIHtBcnJheS48UG9pbnQ+fSBbcG9pbnRzXSAtIFRoZSBwb2ludHMgdG8gdXNlIHRvIGluaXRpYWxpemVcclxuICogICB0aGUgcG9seS5cclxuICovXHJcblBvbHkgPSBmdW5jdGlvbihwb2ludHMpIHtcclxuICBpZiAodHlwZW9mIHBvaW50cyA9PSAndW5kZWZpbmVkJykgcG9pbnRzID0gZmFsc2U7XHJcbiAgdGhpcy5ob2xlID0gZmFsc2U7XHJcbiAgdGhpcy5wb2ludHMgPSBudWxsO1xyXG4gIHRoaXMubnVtcG9pbnRzID0gMDtcclxuICBpZiAocG9pbnRzKSB7XHJcbiAgICB0aGlzLm51bXBvaW50cyA9IHBvaW50cy5sZW5ndGg7XHJcbiAgICB0aGlzLnBvaW50cyA9IHBvaW50cy5zbGljZSgpO1xyXG4gIH1cclxufTtcclxuZXhwb3J0cy5Qb2x5ID0gUG9seTtcclxuXHJcblBvbHkucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihuKSB7XHJcbiAgdGhpcy5wb2ludHMgPSBuZXcgQXJyYXkobik7XHJcbiAgdGhpcy5udW1wb2ludHMgPSBuO1xyXG59O1xyXG5cclxuUG9seS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5udW1wb2ludHMgPSB0aGlzLnBvaW50cy5sZW5ndGg7XHJcbn07XHJcblxyXG5Qb2x5LnByb3RvdHlwZS50cmlhbmdsZSA9IGZ1bmN0aW9uKHAxLCBwMiwgcDMpIHtcclxuICB0aGlzLmluaXQoMyk7XHJcbiAgdGhpcy5wb2ludHNbMF0gPSBwMTtcclxuICB0aGlzLnBvaW50c1sxXSA9IHAyO1xyXG4gIHRoaXMucG9pbnRzWzJdID0gcDM7XHJcbn07XHJcblxyXG4vLyBUYWtlcyBhbiBpbmRleCBhbmQgcmV0dXJucyB0aGUgcG9pbnQgYXQgdGhhdCBpbmRleCwgb3IgbnVsbC5cclxuUG9seS5wcm90b3R5cGUuZ2V0UG9pbnQgPSBmdW5jdGlvbihuKSB7XHJcbiAgaWYgKHRoaXMucG9pbnRzICYmIHRoaXMubnVtcG9pbnRzID4gbilcclxuICAgIHJldHVybiB0aGlzLnBvaW50c1tuXTtcclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbi8vIFNldCBhIHBvaW50LCBmYWlscyBzaWxlbnRseSBvdGhlcndpc2UuIFRPRE86IHJlcGxhY2Ugd2l0aCBicmFja2V0IG5vdGF0aW9uLlxyXG5Qb2x5LnByb3RvdHlwZS5zZXRQb2ludCA9IGZ1bmN0aW9uKGksIHApIHtcclxuICBpZiAodGhpcy5wb2ludHMgJiYgdGhpcy5wb2ludHMubGVuZ3RoID4gaSkge1xyXG4gICAgdGhpcy5wb2ludHNbaV0gPSBwO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEdpdmVuIGFuIGluZGV4IGksIHJldHVybiB0aGUgaW5kZXggb2YgdGhlIG5leHQgcG9pbnQuXHJcblBvbHkucHJvdG90eXBlLmdldE5leHRJID0gZnVuY3Rpb24oaSkge1xyXG4gIHJldHVybiAoaSArIDEpICUgdGhpcy5udW1wb2ludHM7XHJcbn07XHJcblxyXG5Qb2x5LnByb3RvdHlwZS5nZXRQcmV2SSA9IGZ1bmN0aW9uKGkpIHtcclxuICBpZiAoaSA9PSAwKVxyXG4gICAgcmV0dXJuICh0aGlzLm51bXBvaW50cyAtIDEpO1xyXG4gIHJldHVybiBpIC0gMTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgdGhlIHNpZ25lZCBhcmVhIG9mIGEgcG9seWdvbiwgaWYgdGhlIHZlcnRpY2VzIGFyZSBnaXZlbiBpblxyXG4vLyBDQ1cgb3JkZXIgdGhlbiB0aGUgYXJlYSB3aWxsIGJlID4gMCwgPCAwIG90aGVyd2lzZS5cclxuUG9seS5wcm90b3R5cGUuZ2V0QXJlYSA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBhcmVhID0gMDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtcG9pbnRzOyBpKyspIHtcclxuICAgIHZhciBpMiA9IHRoaXMuZ2V0TmV4dEkoaSk7XHJcbiAgICBhcmVhICs9IHRoaXMucG9pbnRzW2ldLnggKiB0aGlzLnBvaW50c1tpMl0ueSAtIHRoaXMucG9pbnRzW2ldLnkgKiB0aGlzLnBvaW50c1tpMl0ueDtcclxuICB9XHJcbiAgcmV0dXJuIGFyZWE7XHJcbn07XHJcblxyXG5Qb2x5LnByb3RvdHlwZS5nZXRPcmllbnRhdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBhcmVhID0gdGhpcy5nZXRBcmVhKCk7XHJcbiAgaWYgKGFyZWEgPiAwKSByZXR1cm4gXCJDQ1dcIjtcclxuICBpZiAoYXJlYSA8IDApIHJldHVybiBcIkNXXCI7XHJcbiAgcmV0dXJuIDA7XHJcbn07XHJcblxyXG5Qb2x5LnByb3RvdHlwZS5zZXRPcmllbnRhdGlvbiA9IGZ1bmN0aW9uKG9yaWVudGF0aW9uKSB7XHJcbiAgdmFyIGN1cnJlbnRfb3JpZW50YXRpb24gPSB0aGlzLmdldE9yaWVudGF0aW9uKCk7XHJcbiAgaWYgKGN1cnJlbnRfb3JpZW50YXRpb24gJiYgKGN1cnJlbnRfb3JpZW50YXRpb24gIT09IG9yaWVudGF0aW9uKSkge1xyXG4gICAgdGhpcy5pbnZlcnQoKTtcclxuICB9XHJcbn07XHJcblxyXG5Qb2x5LnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgbmV3cG9pbnRzID0gbmV3IEFycmF5KHRoaXMubnVtcG9pbnRzKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtcG9pbnRzOyBpKyspIHtcclxuICAgIG5ld3BvaW50c1tpXSA9IHRoaXMucG9pbnRzW3RoaXMubnVtcG9pbnRzIC0gaSAtIDFdO1xyXG4gIH1cclxuICB0aGlzLnBvaW50cyA9IG5ld3BvaW50cztcclxufTtcclxuXHJcblBvbHkucHJvdG90eXBlLmdldENlbnRlciA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciB4ID0gdGhpcy5wb2ludHMubWFwKGZ1bmN0aW9uKHApIHsgcmV0dXJuIHAueCB9KTtcclxuICB2YXIgeSA9IHRoaXMucG9pbnRzLm1hcChmdW5jdGlvbihwKSB7IHJldHVybiBwLnkgfSk7XHJcbiAgdmFyIG1pblggPSBNYXRoLm1pbi5hcHBseShudWxsLCB4KTtcclxuICB2YXIgbWF4WCA9IE1hdGgubWF4LmFwcGx5KG51bGwsIHgpO1xyXG4gIHZhciBtaW5ZID0gTWF0aC5taW4uYXBwbHkobnVsbCwgeSk7XHJcbiAgdmFyIG1heFkgPSBNYXRoLm1heC5hcHBseShudWxsLCB5KTtcclxuICByZXR1cm4gbmV3IFBvaW50KChtaW5YICsgbWF4WCkvMiwgKG1pblkgKyBtYXhZKS8yKTtcclxufTtcclxuXHJcbi8vIEFkYXB0ZWQgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNjI4MzM0OVxyXG5Qb2x5LnByb3RvdHlwZS5jZW50cm9pZCA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciB4ID0gMCxcclxuICAgICAgeSA9IDAsXHJcbiAgICAgIGksXHJcbiAgICAgIGosXHJcbiAgICAgIGYsXHJcbiAgICAgIHBvaW50MSxcclxuICAgICAgcG9pbnQyO1xyXG5cclxuICBmb3IgKGkgPSAwLCBqID0gdGhpcy5wb2ludHMubGVuZ3RoIC0gMTsgaSA8IHRoaXMucG9pbnRzLmxlbmd0aDsgaiA9IGksIGkgKz0gMSkge1xyXG4gICAgcG9pbnQxID0gdGhpcy5wb2ludHNbaV07XHJcbiAgICBwb2ludDIgPSB0aGlzLnBvaW50c1tqXTtcclxuICAgIGYgPSBwb2ludDEueCAqIHBvaW50Mi55IC0gcG9pbnQyLnggKiBwb2ludDEueTtcclxuICAgIHggKz0gKHBvaW50MS54ICsgcG9pbnQyLngpICogZjtcclxuICAgIHkgKz0gKHBvaW50MS55ICsgcG9pbnQyLnkpICogZjtcclxuICB9XHJcblxyXG4gIGYgPSB0aGlzLmdldEFyZWEoKSAqIDM7XHJcbiAgeCA9IE1hdGguYWJzKHgpO1xyXG4gIHkgPSBNYXRoLmFicyh5KTtcclxuICByZXR1cm4gbmV3IFBvaW50KHggLyBmLCB5IC8gZik7XHJcbn07XHJcblxyXG5Qb2x5LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBjZW50ZXIgPSB0aGlzLmNlbnRyb2lkKCk7XHJcbiAgcmV0dXJuIFwiXCIgKyBjZW50ZXIueCArIFwiIFwiICsgY2VudGVyLnk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBwb2ludCBpcyBjb250YWluZWQgd2l0aGluIHRoZSBQb2x5Z29uLlxyXG4gKiBBZGFwdGVkIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODcyMTQ4M1xyXG4gKlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwIC0gVGhlIHBvaW50IHRvIGNoZWNrLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSBwb2ludCBpcyBjb250YWluZWQgd2l0aGluXHJcbiAqICAgdGhlIHBvbHlnb24uXHJcbiAqL1xyXG5Qb2x5LnByb3RvdHlwZS5jb250YWluc1BvaW50ID0gZnVuY3Rpb24ocCkge1xyXG4gIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICBmb3IgKHZhciBpID0gMCwgaiA9IHRoaXMubnVtcG9pbnRzIC0gMTsgaSA8IHRoaXMubnVtcG9pbnRzOyBqID0gaSsrKSB7XHJcbiAgICB2YXIgcDEgPSB0aGlzLnBvaW50c1tqXSwgcDIgPSB0aGlzLnBvaW50c1tpXTtcclxuICAgIGlmICgocDIueSA+IHAueSkgIT0gKHAxLnkgPiBwLnkpICYmXHJcbiAgICAgICAgKHAueCA8IChwMS54IC0gcDIueCkgKiAocC55IC0gcDIueSkgLyAocDEueSAtIHAyLnkpICsgcDIueCkpIHtcclxuICAgICAgcmVzdWx0ID0gIXJlc3VsdDtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbG9uZSB0aGUgZ2l2ZW4gcG9seWdvbiBpbnRvIGEgbmV3IHBvbHlnb24uXHJcbiAqIEByZXR1cm4ge1BvbHl9IC0gQSBjbG9uZSBvZiB0aGUgcG9seWdvbi5cclxuICovXHJcblBvbHkucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIG5ldyBQb2x5KHRoaXMucG9pbnRzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKHBvaW50KSB7XHJcbiAgICByZXR1cm4gcG9pbnQuY2xvbmUoKTtcclxuICB9KSk7XHJcbn07XHJcblxyXG4vKipcclxuICogVHJhbnNsYXRlIGEgcG9seWdvbiBhbG9uZyBhIGdpdmVuIHZlY3Rvci5cclxuICogQHBhcmFtIHtQb2ludH0gdmVjIC0gVGhlIHZlY3RvciBhbG9uZyB3aGljaCB0byB0cmFuc2xhdGUgdGhlXHJcbiAqICAgcG9seWdvbi5cclxuICogQHJldHVybiB7UG9seX0gLSBUaGUgdHJhbnNsYXRlZCBwb2x5Z29uLlxyXG4gKi9cclxuUG9seS5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24odmVjKSB7XHJcbiAgcmV0dXJuIG5ldyBQb2x5KHRoaXMucG9pbnRzLm1hcChmdW5jdGlvbihwb2ludCkge1xyXG4gICAgcmV0dXJuIHBvaW50LmFkZCh2ZWMpO1xyXG4gIH0pKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIGVkZ2VzIHJlcHJlc2VudGluZyB0aGUgcG9seWdvbi5cclxuICogQHJldHVybiB7QXJyYXkuPEVkZ2U+fSAtIFRoZSBlZGdlcyBvZiB0aGUgcG9seWdvbi5cclxuICovXHJcblBvbHkucHJvdG90eXBlLmVkZ2VzID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KFwiY2FjaGVkX2VkZ2VzXCIpKSB7XHJcbiAgICB0aGlzLmNhY2hlZF9lZGdlcyA9IHRoaXMucG9pbnRzLm1hcChmdW5jdGlvbihwb2ludCwgaSkge1xyXG4gICAgICByZXR1cm4gbmV3IEVkZ2UocG9pbnQsIHRoaXMucG9pbnRzW3RoaXMuZ2V0TmV4dEkoaSldKTtcclxuICAgIH0sIHRoaXMpO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy5jYWNoZWRfZWRnZXM7XHJcbn07XHJcblxyXG4vKipcclxuICogTmFpdmUgY2hlY2sgaWYgb3RoZXIgcG9seSBpbnRlcnNlY3RzIHRoaXMgb25lLCBhc3N1bWluZyBib3RoIGNvbnZleC5cclxuICogQHBhcmFtIHtQb2x5fSBwb2x5XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciB0aGUgcG9seWdvbnMgaW50ZXJzZWN0LlxyXG4gKi9cclxuUG9seS5wcm90b3R5cGUuaW50ZXJzZWN0cyA9IGZ1bmN0aW9uKHBvbHkpIHtcclxuICB2YXIgaW5zaWRlID0gcG9seS5wb2ludHMuc29tZShmdW5jdGlvbihwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluc1BvaW50KHApO1xyXG4gIH0sIHRoaXMpO1xyXG4gIGluc2lkZSA9IGluc2lkZSB8fCB0aGlzLnBvaW50cy5zb21lKGZ1bmN0aW9uKHApIHtcclxuICAgIHJldHVybiBwb2x5LmNvbnRhaW5zUG9pbnQocCk7XHJcbiAgfSk7XHJcbiAgaWYgKGluc2lkZSkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBvd25FZGdlcyA9IHRoaXMuZWRnZXMoKTtcclxuICAgIHZhciBvdGhlckVkZ2VzID0gcG9seS5lZGdlcygpO1xyXG4gICAgdmFyIGludGVyc2VjdCA9IG93bkVkZ2VzLnNvbWUoZnVuY3Rpb24ob3duRWRnZSkge1xyXG4gICAgICByZXR1cm4gb3RoZXJFZGdlcy5zb21lKGZ1bmN0aW9uKG90aGVyRWRnZSkge1xyXG4gICAgICAgIHJldHVybiBvd25FZGdlLmludGVyc2VjdHMob3RoZXJFZGdlKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBpbnRlcnNlY3Q7XHJcbiAgfVxyXG59O1xyXG5cclxudmFyIHV0aWwgPSB7fTtcclxuZXhwb3J0cy51dGlsID0gdXRpbDtcclxuXHJcbi8qKlxyXG4gKiBHaXZlbiBhbiBhcnJheSBvZiBwb2x5Z29ucywgcmV0dXJucyB0aGUgb25lIHRoYXQgY29udGFpbnMgdGhlIHBvaW50LlxyXG4gKiBJZiBubyBwb2x5Z29uIGlzIGZvdW5kLCBudWxsIGlzIHJldHVybmVkLlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwIC0gVGhlIHBvaW50IHRvIGZpbmQgdGhlIHBvbHlnb24gZm9yLlxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gcG9seXMgLSBUaGUgcG9seWdvbnMgdG8gc2VhcmNoIGZvciB0aGUgcG9pbnQuXHJcbiAqIEByZXR1cm4gez9Qb2x5Z29ufSAtIFRoZSBwb2x5Z29uIGNvbnRhaW5pbmcgdGhlIHBvaW50LlxyXG4gKi9cclxudXRpbC5maW5kUG9seUZvclBvaW50ID0gZnVuY3Rpb24ocCwgcG9seXMpIHtcclxuICB2YXIgaSwgcG9seTtcclxuICBmb3IgKGkgaW4gcG9seXMpIHtcclxuICAgIHBvbHkgPSBwb2x5c1tpXTtcclxuICAgIGlmIChwb2x5LmNvbnRhaW5zUG9pbnQocCkpIHtcclxuICAgICAgcmV0dXJuIHBvbHk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhvbGRzIHRoZSBwcm9wZXJ0aWVzIG9mIGEgY29sbGlzaW9uLCBpZiBvbmUgb2NjdXJyZWQuXHJcbiAqIEB0eXBlZGVmIENvbGxpc2lvblxyXG4gKiBAdHlwZSB7b2JqZWN0fVxyXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGNvbGxpZGVzIC0gV2hldGhlciB0aGVyZSBpcyBhIGNvbGxpc2lvbi5cclxuICogQHByb3BlcnR5IHtib29sZWFufSBpbnNpZGUgLSBXaGV0aGVyIG9uZSBvYmplY3QgaXMgaW5zaWRlIHRoZSBvdGhlci5cclxuICogQHByb3BlcnR5IHs/UG9pbnR9IHBvaW50IC0gVGhlIHBvaW50IG9mIGNvbGxpc2lvbiwgaWYgY29sbGlzaW9uXHJcbiAqICAgb2NjdXJzLCBhbmQgaWYgYGluc2lkZWAgaXMgZmFsc2UuXHJcbiAqIEBwcm9wZXJ0eSB7P1BvaW50fSBub3JtYWwgLSBBIHVuaXQgdmVjdG9yIG5vcm1hbCB0byB0aGUgcG9pbnRcclxuICogICBvZiBjb2xsaXNpb24sIGlmIGl0IG9jY3VycyBhbmQgaWYgYGluc2lkZWAgaXMgZmFsc2UuXHJcbiAqL1xyXG4vKipcclxuICogSWYgdGhlIHJheSBpbnRlcnNlY3RzIHRoZSBjaXJjbGUsIHRoZSBkaXN0YW5jZSB0byB0aGUgaW50ZXJzZWN0aW9uXHJcbiAqIGFsb25nIHRoZSByYXkgaXMgcmV0dXJuZWQsIG90aGVyd2lzZSBmYWxzZSBpcyByZXR1cm5lZC5cclxuICogQHBhcmFtIHtQb2ludH0gcCAtIFRoZSBzdGFydCBvZiB0aGUgcmF5LlxyXG4gKiBAcGFyYW0ge1BvaW50fSByYXkgLSBVbml0IHZlY3RvciBleHRlbmRpbmcgZnJvbSBgcGAuXHJcbiAqIEBwYXJhbSB7UG9pbnR9IGMgLSBUaGUgY2VudGVyIG9mIHRoZSBjaXJjbGUgZm9yIHRoZSBvYmplY3QgYmVpbmdcclxuICogICBjaGVja2VkIGZvciBpbnRlcnNlY3Rpb24uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBjaXJjbGUuXHJcbiAqIEByZXR1cm4ge0NvbGxpc2lvbn0gLSBUaGUgY29sbGlzaW9uIGluZm9ybWF0aW9uLlxyXG4gKi9cclxudXRpbC5saW5lQ2lyY2xlSW50ZXJzZWN0aW9uID0gZnVuY3Rpb24ocCwgcmF5LCBjLCByYWRpdXMpIHtcclxuICB2YXIgY29sbGlzaW9uID0ge1xyXG4gICAgY29sbGlkZXM6IGZhbHNlLFxyXG4gICAgaW5zaWRlOiBmYWxzZSxcclxuICAgIHBvaW50OiBudWxsLFxyXG4gICAgbm9ybWFsOiBudWxsXHJcbiAgfTtcclxuICB2YXIgdnBjID0gYy5zdWIocCk7XHJcblxyXG4gIGlmICh2cGMubGVuKCkgPD0gcmFkaXVzKSB7XHJcbiAgICAvLyBQb2ludCBpcyBpbnNpZGUgb2JzdGFjbGUuXHJcbiAgICBjb2xsaXNpb24uY29sbGlkZXMgPSB0cnVlO1xyXG4gICAgY29sbGlzaW9uLmluc2lkZSA9ICh2cGMubGVuKCkgIT09IHJhZGl1cyk7XHJcbiAgfSBlbHNlIGlmIChyYXkuZG90KHZwYykgPj0gMCkge1xyXG4gICAgLy8gQ2lyY2xlIGlzIGFoZWFkIG9mIHBvaW50LlxyXG4gICAgLy8gUHJvamVjdGlvbiBvZiBjZW50ZXIgcG9pbnQgb250byByYXkuXHJcbiAgICB2YXIgcGMgPSBwLmFkZChyYXkubXVsKHJheS5kb3QodnBjKSkpO1xyXG4gICAgLy8gTGVuZ3RoIGZyb20gYyB0byBpdHMgcHJvamVjdGlvbiBvbiB0aGUgcmF5LlxyXG4gICAgdmFyIGxlbl9jX3BjID0gYy5zdWIocGMpLmxlbigpO1xyXG5cclxuICAgIGlmIChsZW5fY19wYyA8PSByYWRpdXMpIHtcclxuICAgICAgY29sbGlzaW9uLmNvbGxpZGVzID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIERpc3RhbmNlIGZyb20gcHJvamVjdGVkIHBvaW50IHRvIGludGVyc2VjdGlvbi5cclxuICAgICAgdmFyIGxlbl9pbnRlcnNlY3Rpb24gPSBNYXRoLnNxcnQobGVuX2NfcGMgKiBsZW5fY19wYyArIHJhZGl1cyAqIHJhZGl1cyk7XHJcbiAgICAgIGNvbGxpc2lvbi5wb2ludCA9IHBjLnN1YihyYXkubXVsKGxlbl9pbnRlcnNlY3Rpb24pKTtcclxuICAgICAgY29sbGlzaW9uLm5vcm1hbCA9IGNvbGxpc2lvbi5wb2ludC5zdWIoYykubm9ybWFsaXplKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBjb2xsaXNpb247XHJcbn07XHJcbiJdfQ==
