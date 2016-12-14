(function() {
	var leftBox = $(".containerLeft");
	var rightBox = $(".containerRight");
	var elementsLeft = document.getElementsByClassName("item1");
	var elementsRight = document.getElementsByClassName("item2");
	var elements = [...elementsLeft, ...elementsRight];
	var eleDrag = null;
	var arr1=[1,2,3];
	var arr2=[2,5,6];
	//为待拖拽的元素绑定事件
	for (var i = 0; i < elements.length; i++) {
		elements[i].onselectstart = function() {
			return false;
		};
		elements[i].ondragstart = function(ev) {
			ev.dataTransfer.effectAllowed = "move";
			ev.dataTransfer.setData("text", ev.target.innerHTML);
			ev.dataTransfer.setDragImage(ev.target, 10, 10);
			eleDrag = ev.target;
		};
		elements[i].ondragend = function(ev) {
			ev.dataTransfer.clearData("text");
			eleDrag = null;
			return false;
		};
	}
	function handleBox(box) {
		box.ondragover = function(ev) {
			ev.preventDefault();
			return true;
		};
		box.ondragenter = function(ev) {
			return false;
		};
		box.ondrop = function(ev) {
			if (eleDrag) {
				var tmp = eleDrag;
				eleDrag.parentNode.removeChild(eleDrag);
				this.appendChild(tmp);
			}
			return false;
		}
	}
	handleBox(leftBox);
	handleBox(rightBox);
})()