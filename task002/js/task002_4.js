function init() {

	// var suggestData = ['taylor', 'swift', 'taiwan', 'xhx', 'x-man', 'x-doctor', 'top10'];

	// var inputArea = $("input");

	// var ulArea = $("ul");

	addInputListener();
	clickLi();
	keyDownLi();
}
var suggestData = ['taylor', 'swift', 'taiwan', 'xhx', 'x-man', 'x-doctor', 'top10'];

var inputArea = $("input");

var ulArea = $("ul");

function addInputListener() {
	if (inputArea.addEventListener) { //except IE
		inputArea.addEventListener("input", OnInput);
	}
	if (inputArea.attachEvent) { //IE
		inputArea.attachEvent("onpropertychange", OnPropChange);
	}
}

function OnInput(event) {
	var inputValue = event.target.value; //event.target可以返回生成事件的元素
	handleInput(inputValue);
}
//IE
function OnPropChange(event) {
	var inputValue = "";
	if (event.propertyName.toLowerCase() == "value") {
		inputValue = event.srcElement.value;
		handleInput(inputValue);
	}
}

function handleInput(inputValue) {
	var lisString = "";
	var pattern = new RegExp("^" + inputValue, i);
	if (inputValue == "") {
		ulArea.style.display = "none";
	} else {
		for (var i = 0; i < suggestData.length; i++) {
			if (suggestData[i].match(pattern)) {
				lisString += "<li><span>" + inputValue + "</span>" + suggestData[i].substr(inputValue.length) + "</li>";
			}
		}
		ulArea.innerHTML = lisString;
		ulArea.style.display = "block";
	}
}

function clickLi() {
	delegateEvent(ulArea, "li", "mouseover", function() {
		addClass(this, "active");
	});
	delegateEvent(ulArea, "li", "mouseout", function() {
		removeClass(this, "active");
	});
	delegateEvent(ulArea, "li", "click", function() {
		inputArea.value = deleteSpan(this.innerHTML);
		ulArea.style.display = "none";
	});
}

function keyDownLi() {
	addEvent(inputArea, "keydown", function(event) {
		var highLightLi = $(".active");
		if (event.keyCode == 40) {
			if (highLightLi) {
				nextLi = highLightLi.nextSibling;
				if (nextLi) {
					removeClass(highLightLi, "active");
					addClass(nextLi, "active");
				}
			} else {
				addClass($("li"), "active");
			}
		}
		if (event.keyCode == 38) {
			if (highLightLi) {
				prevLi = highLightLi.previousSibling;
				if (prevLi) {
					removeClass(highLightLi, "active");
					addClass(prevLi, "active");
				}
			} else {
				addClass($("li"), "active");
			}
		}
		if (event.keyCode == 13) {
			if (highLightLi) {
				inputArea.value = deleteSpan(highLightLi.innerHTML);
				ulArea.style.display = "none";
			}
		}
	});
}

// function deleteSpan(str) {
// 	var pattern = /^<span>(\w+)<\/span>(\w+)$/;
// 	var stringArr = str.match(pattern);
// 	return stringArr[1] + stringArr[2];
// }

function deleteSpan(string) {
    var pattern = /^<span>(\w+)<\/span>(\w+)$/;
    var stringArr = string.match(pattern);
    return stringArr[1] + stringArr[2];
}
window.onload = init;