//判断是否为数组
function isArray(arr) {
	return (arr instanceof Array);
}
//判断是否为函数
function isFunction(fn) {
	return (typeof fn == 'function')
}
// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(obj) {
	var o;
	if (Object.prototype.toString.call(obj) == "[object Array]") {
		o = [];
	} else {
		o = {};
	}
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			if (typeof obj[i] === "object") {
				o[i] = cloneObject(obj[i]);
			} else {
				o[i] = obj[i];
			}
		}
	}
	return o;

}
// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function myuniqArray(arr) {
	var result = [];
	var j;
	for (var i = 0; i < arr.length; i++) {
		if (result.length < 1) {
			result.push(arr[i]);
		} else {
			for (j = 0; j < result.length; j++) {
				if (arr[i] === result[j]) {
					break;
				}
			}
			if (j === result.length) {
				result.push(arr[i]);
			}
		}
	}
	return result;
}
// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
//参考版
function uniqArray(arr) {
	var result = [];
	for (i in arr) {
		if (result.indexOf(arr[i]) === -1) {
			result.push(arr[i]);
		}
	}
	return result;
}
//字符串去除首尾空格和TAB
function trim(str) {
	if (str.length != -1) {
		return str.replace(/^\s+|\s+$/g, "");
	}
}
// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
	for (i in arr) {
		fn(i, arr[i]);
	}
}

function output(index, item) {
	console.log(index + ":" + item);
}
// 获取一个对象里面第一层元素的数量，返回一个整数
// function getObjectLength(obj){
// 	var i,
// 		j=0;
// 	for(i in obj){
// 		j++;
// 	}
// 	return j;
// }
function getObjectLength(obj) {
	return Object.keys(obj).length; //Object.keys()返回一个包含obj第一层所有字段的数组
}
//使用正则表达式判断是否为邮箱
function isEmail(str) {
	var pattern = /^(\w+\.)*\w+@\w+(\.\w+)+$/;
	return pattern.test(str);
}
//使用正则表达式判断是否为手机号码
function isMobilePhone(str) {
	var pattern = /^1(3|4|5|7|8)\d{9}$/;
	return pattern.test(str);
}
// 为element增加一个样式名为newClassName的新样式
// function addClass(element,newClassName){
// 	element.setAttribute("class",newClassName);//setAttribute为设置class属性值,是覆盖不是添加
// }
function addClass(element, newClassName) {
	var oldClassName = element.className;
	element.className = oldClassName === "" ? newClassName : oldClassName + " " + newClassName;
}
//去除element的class样式
function removeClass(element, oldClassName) {
	var orignalClassName = element.className;
	var pattern = new RegExp("\\b" + oldClassName + "\\b");
	element.className = trim(orignalClassName.replace(pattern, ''));
}

function isSiblingNode(element, siblingNode) {
	return element.parentNode === siblingNode.parentNode; //使用parentNode指针
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
	var pos = {};
	pos.x = element.getBoundingClientRect().left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
	pos.y = element.getBoundingClientRect().top + Math.max(document.documentElement.scrollTop, document.body.scrollTop);
	//element.getBoundingClientRect()返回距离视口的位置
	//???这里后面加上根结点距滚动条的距离看不懂啊!
	return pos;
}

//接下来挑战一个mini $，它和之前的$是不兼容的，
//它应该是document.querySelector的功能子集，在不直接使用document.querySelector的情况下，在你的util.js中完成以下任务：
function $(selector) {
	if (!selector) {
		return false;
	}
	if (selector == document) {
		return document;
	}
	selector = trim(selector);
	return myQuery(selector, document)[0];
}

function myQuery(selector, root) {
	var single = selector[0];
	var content = selector.substr(1);
	var allChildren = null;
	var curAttribute = null;
	var result = [];
	root = root || document;
	var i, j;
	switch (single) {
		case "#":
			result.push(document.getElementById(content));
			break;
		case ".":
			allChildren = root.getElementsByTagName("*");
			for (i = 0; i < allChildren.length; i++) {
				curAttribute = allChildren[i].getAttribute("class");
				if (curAttribute !== null) {
					curAttributeArray = curAttribute.split(/\s+/); //分割字符串为数组
					for (j = 0; j < curAttributeArray.length; j++) {
						if (content === curAttributeArray[j]) {
							result.push(allChildren[i]);
						}
					}
				}

			}

			break;
		case "[":
			if (content.search("=") == -1) { //string.search(num)返回指定字符在字符串中的首位置
				allChildren = root.getElementsByTagName("*");
				for (i = 0; i < allChildren.length; i++) {
					if (allChildren[i].getAttribute(selector.slice(1, -1)) != null) {
						result.push(allChildren[i]);
					}
				}
			}else{
				allChildren = root.getElementsByTagName("*");
				
				var pattern=/\[(\w+)\s*\=\s*(\w+)\]/; //为了分离等号前后的内容
				cut=selector.match(pattern);
				key=cut[1];
				value=cut[2];
				for(i=0;i<allChildren.length;i++){
					if (allChildren[i].getAttribute(key)==value) {
						result.push(allChildren[i]);
					}
				}
			}
			break;
		default: //tag
			result=root.getElementsByTagName(selector);
	}
	return result;
}
//给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element,event,listener){
	if (element.addEventListener) {
		element.addEventListener(event,listener);
	}else if(element.attachEvent){
		element.attachEvent("on"+event,listener);
	}
}
// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element,event,listener){
	if (element.removeEventListener) {
		element.removeEventListener(event,listener);
	}else if(element.dettachEvent){
		element.dettachEvent("on"+event,listener);
	}
}
function clickListener(){
	removeClass(this,"red");
}
// 实现对click事件的绑定
function addClickEvent(element,listener){
	addEvent(element,"click",listener);
}
// 实现对于按Enter键时的事件绑定
function addEnterEvent(element,listener){
	addEvent(element,"keydown",function(event){
		if (event.keyCode==13) {
			listener();
		}
	});
}

//学习一下事件代理，然后实现下面新的方法：
//如果不用事件代理,一旦改变HTML结构,那么绑定的事件就无效
//所以处理动态元素时,一定要在其父元素上使用事件代理
function delegateEvent(element,tag,eventName,listener){//tag为子元素的标签名
	addEvent(element,eventName,function(event){
		var target=event.target||event.srcElement;  //event.target获取事件源
		if (target.tagName.toLowerCase()==tag.toLowerCase()) {
			listener.call(target,event);
		}
	});
}
//估计有同学已经开始吐槽了，函数里面一堆$看着晕啊，那么接下来把我们的事件函数做如下封装改变：
//就是针对selector参数的封装
$.on=function(selector,event,listener){
	addEvent($(selector),event,listener);
}
$.click=function(selector,listener){
	addClickEvent($(selector),listener);
}
$.un=function(selector,event,listener){
	removeEventListener($(selector),event,listener);
}
$.delegateEvent=function(selector,tag,eventName,listener){
	delegateEvent($(selector),tag,eventName,listener);
}
//判断是否是IE浏览器,返回-1或者版本号
function isIE(){
	var navigatorName='';
	if (document.all) {
		navigatorName+="IE:";
		for(var i=6;i<12;i++){
			if (navigator.userAgent.indexOf("MSIE "+i+".0")>0) {
				return navigatorName+=i+".0";
			}
		}
	}
	else{
		return "other navigator";
	}
}
// 设置cookie 设置无效,原因不明???
function setCookie(cookieName, cookieValue, expiredays) {
    var cookie = cookieName + "=" + encodeURIComponent(cookieValue);
    if (typeof expiredays === "number") {
        cookie += ";max-age=" + (expiredays * 60 * 60 * 24);
    }
    document.cookie = cookie;
}

// 获取cookie值
function getCookie(){
	var cookie={};
	var all=document.cookie;
	if (all==null) {
		return cookie;
	}
	var list=all.split("; ");
	for(var i;i<list.length;i++){
		var p=list[i].indexOf("=");
		var name=list[i].substr(0,p);
		var value=list[i].substr(p+1);
		value=decodeURIComponent(value);
		cookie[name]=value;
	}
	return cookie;
}

function init1() {
	var btn = $(".btn");
	var input = document.getElementById("in");
	var output = $("#output");
	var str ="";
	var valueArr=[];
	function listener() {
		var value = input.value;
		if (value == "") {
			return false;
		}
		valueArr = value.split(",");
		
		for (i in valueArr) {
			valueArr[i] = trim(valueArr[i]);
			if (valueArr[i] == "") {
				valueArr.splice(i, 1);
			}
		}

		for (var i = 0; i < valueArr.length; i++) {
			str += valueArr[i] + "<br>";
			

		}
		output.innerHTML=str;
		
	}
	addClickEvent(btn,listener);
}
window.onload = init1;