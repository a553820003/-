function init() {
	let btn = $(".btn");
	let date = $("#date");
	addClickEvent(btn, start);
}

function start() {
	let inputDate=date.value
	let content = $(".content");
	let ts = dateToSecond(inputDate) - (new Date()) - 3600 * 1000 * 8;//英国和中国有8个小时的时差
	let strDate = secondToStr(ts);
	content.innerHTML = "距离"+inputDate+"还有"+strDate;
	setTimeout("start()", 1000);//计时函数
	if(ts<1000){
		clearTimeout();//取消计时是不是要加参数呢??? 
	}
}
//将日期转换为毫秒数
function dateToSecond(strDate) {
	let myDate = new Date(strDate);
	return myDate.getTime();
}
//将毫秒数转换为字符串几时几分
function secondToStr(s) { //传入毫秒数
	var dd = parseInt(s / 1000 / 60 / 60 / 24);
	var hh = parseInt(s / 1000 / 60 / 60 % 24);
	var mm = parseInt(s / 1000 / 60 % 60);
	var ss = parseInt(s / 1000 % 60);
	dd = checkTime(dd);
	hh = checkTime(hh);
	mm = checkTime(mm);
	ss = checkTime(ss);
	let outPut = dd + "天" + hh + "时" + mm + "分" + ss + "秒";
	return outPut;
}

function checkTime(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

window.onload = init;