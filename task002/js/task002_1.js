function init1() {
	var btn = $(".btn");
	var input = $("#in");
	var output = $("#output");
	var valueArr = [];
	var info = $(".info");

	function listener() {
		if (output.childNodes.length > 1) {
			//检查是否是第一次点击btn
			//因为元素默认有一个文字结点
			//所以这里条件为大于1
			output.innerHTML="";
		}
		var value = input.value; //input.value的类型也是string,不是引用类型!
		var str = "";
		if (value == "") {
			return false;
		}
		var patterm = /\s+|,+|，+|、+|;+/;
		valueArr = value.split(patterm);

		for (i in valueArr) {
			valueArr[i] = trim(valueArr[i]);
			if (valueArr[i] == "") {
				valueArr.splice(i, 1); //删除数组中秩为i的项,1为删除的子数组长度
			}
		}
		if (valueArr.length < 1) {
			info.innerHTML = "请输入水果名!";
			return false;
		}
		if (valueArr.length > 10) {
			info.innerHTML = "水果种类超过10种!";
			return false;
		}
		//创建checkbox
		for (let i = 0; i < valueArr.length; i++) {
			let myDiv = document.createElement('div');
			output.appendChild(myDiv);
			let checkBox = document.createElement('input');
			checkBox.setAttribute('type', 'checkbox');
			checkBox.setAttribute('id', 'checkbox' + i)
			checkBox.setAttribute('checked', '1'); //使checkbox默认选中
			myDiv.appendChild(checkBox);
			let labelForCheckBox = document.createElement("label");
			labelForCheckBox.innerHTML = valueArr[i];
			labelForCheckBox.setAttribute('for', 'checkbox' + i);
			myDiv.appendChild(labelForCheckBox);
		}

	}
	//提示用户输入,水果数目只能在1到10之间
	function oninput() {

		var value = input.value; //input.value的类型也是string,不是引用类型!
		var str = "";
		if (value == "") {
			info.innerHTML = "请输入水果名!";
			return false;
		}

		var patterm = /\s+|,+|，+|、+|;+/;
		valueArr = value.split(patterm);

		for (i in valueArr) {
			valueArr[i] = trim(valueArr[i]);
			if (valueArr[i] == "") {
				valueArr.splice(i, 1); //删除数组中秩为i的项,1为删除的子数组长度
			}
		}

		if (valueArr.length < 1) {
			info.innerHTML = "请输入水果名!";
			return false;
		}
		if (valueArr.length > 10) {
			info.innerHTML = "水果种类超过10种!";
			return false;
		}
		info.innerHTML = "";

	}

	addClickEvent(btn, listener);
	input.oninput = oninput; //监听元素的实时输入
}

function tree() {
	function BinNode(data, parent) {
		this.lChild = null;
		this.rChild = null;
		this.parent = parent;
		this.data = data;
	}
	BinNode.prototype = {
		insertAsLc: function(e) {
			return this.lChild = new BinNode(e, this);
		},
		insertAsRc: function(e) {
			return this.rChild = new BinNode(e, this);
		},
		size: function() {
			var s = 1;
			if (lChild) s += lChild.size();
			if (rChild) s += lChild.size();
			return s;
		}
	}
}
window.onload = init1;