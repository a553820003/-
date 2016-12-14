var imgRotation=$(".imgRotation");
var imgWidth=$("img").offsetWidth;
var circleList=$(".circleList").getElementsByTagName("a");
var timerInner=null;
var nextID=0;
var activeID=0;
var timer=null;
var intervalTime=3000;
function startMove(target){
	clearInterval(timerInner);
	timerInner=setInterval(function(){
		var space=(target-imgRotation.offsetLeft)/6;
		 space=space>0?Math.ceil(space):Math.floor(space);
		imgRotation.style.left=imgRotation.offsetLeft+space+"px";
	},30);
}
function rotate(clickID){
	if (clickID) {
		nextID=clickID;
	}else{
		nextID=activeID<5?activeID+1:0;
	}
	removeClass(circleList[activeID],"active");
	addClass(circleList[nextID],"active");
	startMove("-"+nextID*imgWidth);
	activeID=nextID;
}
timer=setInterval(rotate,intervalTime);
$.delegate(".circleList","a","click",function(){
	clearInterval(timer);
	var clickID=this.index;
	console.log(clickID);
	rotate(clickID);
	timer=setInterval(rotate,intervalTime);
});
