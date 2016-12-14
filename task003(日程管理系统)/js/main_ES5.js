"use strict";
//此文件是用Babel转换的ES5版本
var _createClass = function() {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = true;
			if ("value" in descriptor) descriptor.writable = true;
			Object.defineProperty(target, descriptor.key, descriptor);
		}
	}
	return function(Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);
		if (staticProps) defineProperties(Constructor, staticProps);
		return Constructor;
	};
}();

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}
	return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	}
	subClass.prototype = Object.create(superClass && superClass.prototype, {
		constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});
	if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _toConsumableArray(arr) {
	for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
	return arr2;
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

window.onresize = setHeightOfMainArea; //浏览器窗口发生变化时同时变化DIV高度
window.onload = initial;

//这个函数实现页面高度与浏览器高度自适应
function setHeightOfMainArea() {
	var winHeight = autodivheight();
	var mainArea = document.getElementsByClassName("main")[0];
	var textArea = document.getElementsByTagName("textArea")[0];
	mainArea.style.height = winHeight - 64 + "px";
	//使文字输入区填空剩余部分高度
	textArea.style.height = winHeight - 64 - 200 + "px";
}

function autodivheight() {
	//将body高度设置为浏览器可见区域高度
	//获取浏览器窗口高度
	var winHeight = 0;
	if (window.innerHeight) winHeight = window.innerHeight;
	else if (document.body && document.body.clientHeight) winHeight = document.body.clientHeight;
	//通过深入Document内部对body进行检测，获取浏览器窗口高度
	if (document.documentElement && document.documentElement.clientHeight) winHeight = document.documentElement.clientHeight;
	//DIV高度为浏览器窗口的高度
	//document.getElementById("test").style.height= winHeight +"px";
	//DIV高度为浏览器窗口高度的一半
	var mainArea = document.getElementsByClassName("main")[0];
	var bodyArea = document.getElementsByTagName("body")[0];
	bodyArea.style.height = winHeight + "px";
	return winHeight;
}
//主程序入口
function initial() {
	var body = document.getElementsByTagName('body')[0];

	setHeightOfMainArea();
	var defaultCategoryTree = null;
	var tree10 = JSON.parse(localStorage.getItem('tree17'));

	if (!tree10) {
		localStorage.setItem('tree17', getDemoDate());

	}
	defaultCategoryTree = getCategoryTree();
	var numOfAllTasks = $("#numOfAllTasks");
	initialzeCategoryArea(defaultCategoryTree, numOfAllTasks);
	//未执行完JS代码不显示内容
	body.style.display = "block";
}

function initialzeCategoryArea(defaultCategoryTree, numOfAllTasks) {
	var addCategoryArea = $(".addCategory");
	var inputCategory = $("#inputCategory");
	var shadow = $("#shadow");
	var confirmAddCategory = $('#confirm');
	var cancelAddCategory = $('#cancel');
	var nameOfNewCategory = $('#nameOfNewCategory');
	var selectCategoryName = $('#CategoryName');
	var mainContentController = new MainContentController();
	//添加默认分类
	defaultCategoryTree.addCategoryByName("默认分类");

	updateCategoryTree(defaultCategoryTree, numOfAllTasks);

	addCategoryArea.onclick = function() {
		nameOfNewCategory.placeholder = '';
		nameOfNewCategory.value = '';
		inputCategory.style.display = "block";
		shadow.style.display = "block";
	};

	confirmAddCategory.onclick = function() {
		var defaultCategoryTree = getCategoryTree();
		if (nameOfNewCategory.value) {
			if (selectCategoryName.value == 'default') {
				inputCategory.style.display = "none";
				shadow.style.display = "none";
				defaultCategoryTree.addCategoryByName(nameOfNewCategory.value);
				saveCategoryTree(defaultCategoryTree);
				updateCategoryTree(defaultCategoryTree, numOfAllTasks);
			} else {
				var _selectCategoryName = $('#CategoryName').value;
				var selectedCategory = defaultCategoryTree.getCategory(_selectCategoryName);
				inputCategory.style.display = "none";
				shadow.style.display = "none";
				selectedCategory.addCategoryByName(nameOfNewCategory.value);
				saveCategoryTree(defaultCategoryTree);
				updateCategoryTree(defaultCategoryTree, numOfAllTasks);
			}
		} else {
			nameOfNewCategory.placeholder = '分类名不能为空!';
		}
	};

	cancelAddCategory.onclick = function() {
		inputCategory.style.display = "none";
		shadow.style.display = "none";
	};
	//绑定主区域按钮点击事件
	mainContentController.bindClickOfBtns();
}
//专为响应右侧主区域视图变化而设置的类

var MainContentController = function() {
	function MainContentController() {
		_classCallCheck(this, MainContentController);

		// 四个按钮
		this.mainContent = document.getElementsByClassName('contentMain')[0];
		this.finishTaskBtn = this.mainContent.getElementsByTagName('span')[0];
		this.editTaskBtn = this.mainContent.getElementsByTagName('span')[1];
		this.saveBtn = this.mainContent.getElementsByTagName('span')[2];
		this.cancelBtn = this.mainContent.getElementsByTagName('span')[3];
		this.btnArr = this.mainContent.getElementsByTagName('span');
		//输入内容
		this.nameOfTaskInput = document.getElementsByClassName('nameOfTask')[0];
		this.dateContentInput = document.getElementsByClassName('dateContent')[0];
		this.mainText = document.getElementsByTagName('textarea')[0];
		//添加任务按钮
		this.addTaskBtn = document.getElementsByClassName('addTask')[0];
	}

	_createClass(MainContentController, [{
		key: "initial",
		value: function initial() {

			this.nameOfTaskInput.readOnly = true;
			this.dateContentInput.readOnly = true;
			this.mainText.readOnly = true;
			for (var i = 0; i < this.btnArr.length; i++) {
				this.btnArr[i].style.display = 'none';
			}
			this.nameOfTaskInput.style.background = "transparent";
			this.dateContentInput.style.background = "transparent";
		}
	}, {
		key: "showTaskDetail",
		value: function showTaskDetail() {

			var defaultCategoryTree = getCategoryTree();
			var highLightCategoryNode = document.getElementsByClassName('highLight')[0];
			var highLightTaskNode = document.getElementsByClassName('taskNodeHighLight')[0];

			if (!highLightTaskNode) {
				return false;
			}

			this.nameOfTaskInput.value = highLightTaskNode.taskName;
			this.dateContentInput.value = highLightTaskNode.dateOfTask;
			this.mainText.value = highLightTaskNode.textOfTask;
		}
	}, {
		key: "editState",
		value: function editState() {

			//此处readOnly一定要注意大小写!!!
			this.nameOfTaskInput.readOnly = false;
			this.dateContentInput.readOnly = false;
			this.mainText.readOnly = false;
			this.saveBtn.style.display = 'inline-block';
			this.cancelBtn.style.display = 'inline-block';
			this.finishTaskBtn.style.display = "none";
			this.editTaskBtn.style.display = "none";
			this.nameOfTaskInput.style.background = "#fff";
			this.dateContentInput.style.background = "#fff";
		}
	}, {
		key: "unfinishedState",
		value: function unfinishedState() {

			this.finishTaskBtn.style.display = 'inline-block';
			this.editTaskBtn.style.display = 'inline-block';
		}
	}, {
		key: "changeStateOfMainContent",
		value: function changeStateOfMainContent() {

			var highLightTaskNode = document.getElementsByClassName('taskNodeHighLight')[0];
			this.initial();
			this.showTaskDetail();
			if (!highLightTaskNode) {
				return false;
			}
			if (!highLightTaskNode.className.indexOf('finishedTaskNode') > -1) {
				this.unfinishedState();
			}
		}
	}, {
		key: "bindClickOfBtns",
		value: function bindClickOfBtns() {
			var that = this;
			this.editTaskBtn.onclick = function() {
				that.editState();
			};
			this.finishTaskBtn.onclick = function() {
				var taskNode = document.getElementsByClassName('taskNodeHighLight')[0];
				var taskName = taskNode.taskName;
				var defaultCategoryTree = getCategoryTree();
				var targetTask = defaultCategoryTree.getTaskByName(taskName);

				targetTask.isFinish = true;
				taskNode.className += ' finishedTaskNode';
				var finishedIcon = document.createElement('i');
				finishedIcon.className += ' fa fa-check';
				taskNode.appendChild(finishedIcon);
				saveCategoryTree(defaultCategoryTree);
			};
			this.addTaskBtn.onclick = function() {
				var highLightCategory = document.getElementsByClassName("highLight")[0];
				var nameOfhighLight = highLightCategory.categoryName;
				var defaultCategoryTree = getCategoryTree();
				if (highLightCategory.className.indexOf('category') > -1) {
					var lengthOfSubCategory = defaultCategoryTree.getCategory(nameOfhighLight).categoryArr.length;
					if (lengthOfSubCategory < 1) {
						alert("请先添加子分类");
						return false;
					}
					alert("请选择子分类");
					return false;
				}
				that.editState();
				that.nameOfTaskInput.value = '';
				that.dateContentInput.value = '';
				that.mainText.value = '';
				that.saveBtn.isAddCategoryFlag = true;
			};
			//保存按钮点击事件有修改和新建任务两种情况
			this.saveBtn.onclick = function() {
				var defaultCategoryTree = getCategoryTree();
				var highLightCategoryNode = document.getElementsByClassName('highLight')[0];
				var taskListContent = document.getElementsByClassName('taskListContent')[0];
				if (that.nameOfTaskInput.value == "") {
					alert("任务名不能为空!");
					return;
				}
				if (that.dateContentInput.value == "") {
					alert("任务日期不能为空!");
					return;
				}
				if (that.mainText.value == "") {
					alert("任务内容不能为空!");
					return;
				}
				//判断是不是在增加任务
				if (that.saveBtn.isAddCategoryFlag) {
					var indexOfHighLightCategoryNode = getElementTop(highLightCategoryNode);

					var newTask = new Task();
					var highLightSubCategory = defaultCategoryTree.getCategory(highLightCategoryNode.parentCategoryName).getCategory(highLightCategoryNode.categoryName);
					if (defaultCategoryTree.getTaskByName(that.nameOfTaskInput.value)) {
						alert("任务名不能重复!");
						return;
					}
					newTask.name = that.nameOfTaskInput.value;
					newTask.date = that.dateContentInput.value;
					newTask.text = that.mainText.value;
					highLightSubCategory.categoryArr.push(newTask);
					saveCategoryTree(defaultCategoryTree);
					var numOfAllTasks = $("#numOfAllTasks");
					updateCategoryTree(defaultCategoryTree, numOfAllTasks);
					var targetCategory = null;
					var categoryList = document.getElementsByClassName('categoryList')[0].children[indexOfHighLightCategoryNode];
					categoryList.click();
					var targetTaskNode = null;
					var taskList = taskListContent.children[0].children;
					for (var i = 0; i < taskList.length; i++) {
						if (taskList[i].taskName == newTask.name) {
							targetTaskNode = taskList[i];
						}
					}
					targetTaskNode.click();
					that.saveBtn.isAddCategoryFlag = false;
				}
				//修改任务 
				else {
					var highLightTaskNode = document.getElementsByClassName('taskNodeHighLight')[0];
					var indexOfHighLightTaskNode = getElementTop(highLightTaskNode);
					if (that.nameOfTaskInput.value != highLightTaskNode.taskName && defaultCategoryTree.getTaskByName(that.nameOfTaskInput.value)) {
						alert("任务名不能重复!");
						return;
					}
					taskListContent.innerHTML = "";
					var targetTask = defaultCategoryTree.getTaskByName(highLightTaskNode.taskName);
					targetTask.name = that.nameOfTaskInput.value;
					targetTask.date = that.dateContentInput.value;
					targetTask.text = that.mainText.value;
					saveCategoryTree(defaultCategoryTree);
					highLightCategoryNode.click();
					var _targetTaskNode = null;
					var _taskList = taskListContent.children[0].children;
					for (var _i = 0; _i < _taskList.length; _i++) {
						if (_taskList[_i].taskName == targetTask.name) {
							_targetTaskNode = _taskList[_i];
						}
					}
					_targetTaskNode.click();
				}
			};
			this.cancelBtn.onclick = function() {
				var highLightTaskNode = document.getElementsByClassName('taskNodeHighLight')[0];
				if (highLightTaskNode)
					highLightTaskNode.click();
			};
		}
	}]);

	return MainContentController;
}();
//读取,存储数据的两个方法


function saveCategoryTree(defaultCategoryTree) {
	localStorage.setItem('tree17', JSON.stringify(defaultCategoryTree));
}

function getCategoryTree() {
	var tree = JSON.parse(localStorage.getItem('tree17'));
	var defaultCategoryTree = new CateGoryRoot('allTasks');
	for (var i = 0; i < tree.categoryArr.length; i++) {
		var currentCategory = tree.categoryArr[i];
		defaultCategoryTree.addCategoryByName(currentCategory.name);

		for (var j = 0; j < currentCategory.categoryArr.length; j++) {
			var currentSubCategory = currentCategory.categoryArr[j];
			var currentDefaultCategory = defaultCategoryTree.categoryArr[i];
			currentDefaultCategory.addCategoryByName(currentSubCategory.name);

			for (var k = 0; k < currentSubCategory.categoryArr.length; k++) {
				var currentTask = currentSubCategory.categoryArr[k];
				var currentDefaultSubCategory = currentDefaultCategory.categoryArr[j];

				currentDefaultSubCategory.addCategoryByName(currentTask.name);
				var currentDefaultTask = currentDefaultSubCategory.getCategory(currentTask.name);
				currentDefaultTask.name = currentTask.name;
				currentDefaultTask.date = currentTask.date;
				currentDefaultTask.text = currentTask.text;
				currentDefaultTask.isFinish = currentTask.isFinish;
			}
		}
	}
	return defaultCategoryTree;
}
//更新分类列表,此函数有闭包问题存在,应细化为若干个类,有待优化
function updateCategoryTree(defaultCategoryTree, numOfAllTasks) {
	numOfAllTasks.innerHTML = defaultCategoryTree.getAmountOfTask();
	var categoryList = $(".categoryList");

	categoryList.innerHTML = "<p>\u5206\u7C7B\u5217\u8868</p>";
	var numOfCategorys = defaultCategoryTree.categoryArr.length;

	for (var i = 0; i < numOfCategorys; i++) {
		//更新主分类树
		var currentCategory = defaultCategoryTree.categoryArr[i];
		var numOfTasksInCurrentCategory = currentCategory.getAmountOfTask();
		var textNode = document.createTextNode(currentCategory.name + ' ( ' + numOfTasksInCurrentCategory + ' )');
		var newCategoryNode = document.createElement("p");
		var icon = document.createElement('i');

		if (i > 0) {
			var _iconDelete = document.createElement('i');
			_iconDelete.className += 'fa fa-trash-o';
			newCategoryNode.appendChild(_iconDelete);
		}
		icon.className += 'fa fa-folder-open';
		newCategoryNode.className += ' category';
		newCategoryNode.categoryName = currentCategory.name;
		newCategoryNode.numOfTasks = numOfTasksInCurrentCategory;
		newCategoryNode.appendChild(icon);
		newCategoryNode.appendChild(textNode);
		if (i == 0) {
			// newCategoryNode.className += ' highLight';
		}
		categoryList.appendChild(newCategoryNode);
		//更新子分类树
		var numOfSubCategorys = currentCategory.categoryArr.length;
		for (var j = 0; j < numOfSubCategorys; j++) {
			var currentSubCategory = currentCategory.categoryArr[j];
			var newSubCategoryNode = document.createElement("p");
			var _icon = document.createElement('i');
			var _iconDelete2 = document.createElement('i');
			var numOfTasksInCurrentSubCategory = currentSubCategory.getAmountOfTask();
			var _textNode = document.createTextNode(currentSubCategory.name + ' ( ' + numOfTasksInCurrentSubCategory + ' )');

			_iconDelete2.className += 'fa fa-trash-o';
			newSubCategoryNode.appendChild(_iconDelete2);
			_icon.className += "fa fa-file-o";
			newSubCategoryNode.className += ' subCategory';
			newSubCategoryNode.appendChild(_icon);
			newSubCategoryNode.appendChild(_textNode);
			newSubCategoryNode.categoryName = currentSubCategory.name;
			newSubCategoryNode.parentCategoryName = currentCategory.name;
			newSubCategoryNode.numOfTasks = numOfTasksInCurrentSubCategory;
			categoryList.appendChild(newSubCategoryNode);
		}
		//绑定删除事件
		var iconDelete = document.getElementsByClassName('fa-trash-o');
		if (iconDelete) {
			for (var _i2 = 0; _i2 < iconDelete.length; _i2++) {
				var currentIcon = iconDelete[_i2];
				currentIcon.onclick = function() {
					var defaultCategoryTree = getCategoryTree();
					var categoryList = $(".categoryList");
					var targetCategory = this.parentNode;
					var categoryName = targetCategory.categoryName;
					var parentCategoryName = targetCategory.parentCategoryName;
					//判断是主分类还是子分类
					//有该属性证明是子分类
					if (parentCategoryName) {
						var parentCategory = defaultCategoryTree.getCategory(parentCategoryName);
						parentCategory.deleteCategory(categoryName);
					} else {
						defaultCategoryTree.deleteCategory(categoryName);
						var lengthOfItems = categoryList.children.length;
						for (var _j = 0; _j < lengthOfItems; _j++) {
							var currentNode = categoryList.children[_j];

							if (currentNode.parentCategoryName) {
								if (currentNode.parentCategoryName == categoryName) {
									currentNode.parentNode.removeChild(currentNode);
									_j--;
									lengthOfItems--;
								}
							}
						}
					}
					targetCategory.parentNode.removeChild(targetCategory);
					saveCategoryTree(defaultCategoryTree);
					updateSelect();
					var defaultCategoryTreeNew = getCategoryTree();
					updateCategoryTree(defaultCategoryTreeNew, numOfAllTasks);
				};
			}
		}
		//添加select选项
		saveCategoryTree(defaultCategoryTree);
		updateSelect();
	}
	saveCategoryTree(defaultCategoryTree);
	bindClickOfCategory();
	binClickOfTaskListTag();
	//更新弹出框select标签的数据
	function updateSelect() {
		var defaultCategoryTree = getCategoryTree();
		var numOfCategorys = defaultCategoryTree.categoryArr.length;
		var selectCategoryName = $('#CategoryName');
		selectCategoryName.innerHTML = "<option value=\"default\">\u65B0\u589E\u4E3B\u5206\u7C7B</option>";
		for (var _i3 = 0; _i3 < numOfCategorys; _i3++) {
			var _currentCategory = defaultCategoryTree.categoryArr[_i3];
			var optionsOfSelect = selectCategoryName.getElementsByTagName('option');
			var isOptionExist = false;
			var itemOption = document.createElement('option');
			var textOfOption = document.createTextNode(_currentCategory.name);
			for (var _j2 = 0; _j2 < optionsOfSelect.length; _j2++) {
				var currentOptionText = optionsOfSelect[_j2].innerHTML;
				if (_currentCategory.name == currentOptionText) {
					isOptionExist = true;
				}
			}
			if (!isOptionExist) {
				itemOption.appendChild(textOfOption);
				itemOption.value = _currentCategory.name;
				selectCategoryName.appendChild(itemOption);
			}
		}
	}
	//绑定主分类的点击事件
	function bindClickOfCategory() {
		var defaultCategoryTree = getCategoryTree();
		var categoryList = $(".categoryList");
		var lengthOfItems = categoryList.children.length;
		var mainContentController = new MainContentController();
		//任务容器
		var taskListContent = document.getElementsByClassName('taskListContent')[0];
		//输入界面
		var nameOfTaskInput = document.getElementsByClassName('nameOfTask')[0];
		var dateContentInput = document.getElementsByClassName('dateContent')[0];
		var mainText = document.getElementsByTagName('textarea')[0];

		for (var _j3 = 1; _j3 < lengthOfItems; _j3++) {
			var currentNode = categoryList.children[_j3];
			currentNode.onclick = function() {
				var defaultCategoryTree = getCategoryTree();
				//点击分类高亮显示
				var highLightItems = document.getElementsByClassName('highLight');
				var taskList = document.getElementsByClassName('taskList')[0];
				var allTasksTag = taskList.getElementsByTagName('span')[0];

				for (var _i4 = 0; _i4 < highLightItems.length; _i4++) {
					removeClass(highLightItems[_i4], 'highLight');
				}
				this.className += ' highLight';
				clearMainContent();
				if (this.className.indexOf('category') > -1) {
					var _currentCategory2 = defaultCategoryTree.getCategory(this.categoryName);
					if (_currentCategory2) {
						var firstSubCategory = _currentCategory2.categoryArr[0];
						var orderTasks = _currentCategory2.getOrderedTask();
						taskListContent.appendChild(_currentCategory2.showTasks(orderTasks));
					}
				} else if (this.className.indexOf('subCategory') > -1) {
					var _currentSubCategory = defaultCategoryTree.getCategory(this.parentCategoryName).getCategory(this.categoryName);
					if (_currentSubCategory) {
						var _orderTasks = _currentSubCategory.getOrderedTask();
						taskListContent.appendChild(_currentSubCategory.showTasks(_orderTasks));
					}
					// let orderTasks = currentSubCategory.getOrderedTask();
					// taskListContent.appendChild(currentSubCategory.showTasks(orderTasks));
				}
				mainContentController.changeStateOfMainContent();
				setHighLightTag(allTasksTag);
			};
		}

		function clearMainContent() {
			taskListContent.innerHTML = '';
			nameOfTaskInput.value = '';
			dateContentInput.value = '';
			mainText.value = '';
		}
	}

	//绑定筛选tag的点击事件
	function binClickOfTaskListTag() {
		var taskList = document.getElementsByClassName('taskList')[0];
		var taskListContent = document.getElementsByClassName('taskListContent')[0];
		var taskArea = taskListContent.children[0];
		var allTasksTag = taskList.getElementsByTagName('span')[0];
		var unFinishedTasksTag = taskList.getElementsByTagName('span')[1];
		var finishedTasksTag = taskList.getElementsByTagName('span')[2];
		var defaultCategoryTree = getCategoryTree();
		var nameOfTaskInput = document.getElementsByClassName('nameOfTask')[0];
		var dateContentInput = document.getElementsByClassName('dateContent')[0];
		var mainText = document.getElementsByTagName('textarea')[0];
		var mainContentController = new MainContentController();

		allTasksTag.onclick = function() {
			var defaultCategoryTree = getCategoryTree();
			var highLightCategory = document.getElementsByClassName('highLight')[0];
			clearMainContent();

			if (highLightCategory.className.indexOf('category') > -1) {
				var _currentCategory3 = defaultCategoryTree.getCategory(highLightCategory.categoryName);
				var firstSubCategory = _currentCategory3.categoryArr[0];
				var orderTasks = _currentCategory3.getOrderedTask();
				taskListContent.appendChild(_currentCategory3.showTasks(orderTasks));
			} else if (highLightCategory.className.indexOf('subCategory') > -1) {
				var _currentSubCategory2 = defaultCategoryTree.getCategory(highLightCategory.parentCategoryName).getCategory(highLightCategory.categoryName);
				var _orderTasks2 = _currentSubCategory2.getOrderedTask();
				taskListContent.appendChild(_currentSubCategory2.showTasks(_orderTasks2));
			}
			setHighLightTag(this);
			mainContentController.changeStateOfMainContent();
		};

		unFinishedTasksTag.onclick = function() {
			var defaultCategoryTree = getCategoryTree();
			var highLightCategory = document.getElementsByClassName('highLight')[0];
			clearMainContent();
			if (highLightCategory.className.indexOf('category') > -1) {
				var _currentCategory4 = defaultCategoryTree.getCategory(highLightCategory.categoryName);
				var firstSubCategory = _currentCategory4.categoryArr[0];
				var orderTasks = _currentCategory4.orderTasks(_currentCategory4.getUnFinishedTasks());
				taskListContent.appendChild(_currentCategory4.showTasks(orderTasks));
			} else if (highLightCategory.className.indexOf('subCategory') > -1) {
				var _currentSubCategory3 = defaultCategoryTree.getCategory(highLightCategory.parentCategoryName).getCategory(highLightCategory.categoryName);
				var _orderTasks3 = _currentSubCategory3.orderTasks(_currentSubCategory3.getUnFinishedTasks());
				taskListContent.appendChild(_currentSubCategory3.showTasks(_orderTasks3));
			}
			setHighLightTag(this);
			mainContentController.changeStateOfMainContent();
		};
		finishedTasksTag.onclick = function() {
			var defaultCategoryTree = getCategoryTree();
			var highLightCategory = document.getElementsByClassName('highLight')[0];
			clearMainContent();

			if (highLightCategory.className.indexOf('category') > -1) {
				var _currentCategory5 = defaultCategoryTree.getCategory(highLightCategory.categoryName);
				var firstSubCategory = _currentCategory5.categoryArr[0];
				var orderTasks = _currentCategory5.orderTasks(_currentCategory5.getFinishedTasks());
				taskListContent.appendChild(_currentCategory5.showTasks(orderTasks));
			} else if (highLightCategory.className.indexOf('subCategory') > -1) {
				var _currentSubCategory4 = defaultCategoryTree.getCategory(highLightCategory.parentCategoryName).getCategory(highLightCategory.categoryName);
				var _orderTasks4 = _currentSubCategory4.orderTasks(_currentSubCategory4.getFinishedTasks());
				taskListContent.appendChild(_currentSubCategory4.showTasks(_orderTasks4));
			}
			setHighLightTag(this);
			mainContentController.changeStateOfMainContent();
		};

		function clearMainContent() {
			taskListContent.innerHTML = '';
			nameOfTaskInput.value = '';
			dateContentInput.value = '';
			mainText.value = '';
		}
	}

	function setHighLightTag(targetTag) {
		var highLightTag = document.getElementsByClassName('defaultColorOfTag')[0];
		var newClassName = highLightTag.className.replace('defaultColorOfTag', ' ');
		highLightTag.className = newClassName;
		targetTag.className += " defaultColorOfTag";
	}
}
//分类节点的实现方式,包括增删查改等函数

var CateGoryNode = function() {
	function CateGoryNode() {
		var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '分类节点';

		_classCallCheck(this, CateGoryNode);

		this.categoryArr = [];
		this.name = name;
	}

	_createClass(CateGoryNode, [{
		key: "getCategory",
		value: function getCategory(nameOfCategory) {
			if (this.categoryArr.length > 0) {
				for (var i = 0; i < this.categoryArr.length; i++) {
					if (this.categoryArr[i].name == nameOfCategory) {
						return this.categoryArr[i];
					}
				}
			} else {
				return false;
			}
		}
	}, {
		key: "addCategoryByName",
		value: function addCategoryByName() {
			var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '新建分类';

			if (this.getCategory(name)) {
				return false;
			}
			var newCategory = new CateGoryNode(name);
			this.categoryArr.push(newCategory);
		}
	}, {
		key: "deleteCategory",
		value: function deleteCategory(nameOfCategory) {
			var target = this.getCategory(nameOfCategory);
			if (target) {
				var index = this.categoryArr.indexOf(target);
				this.categoryArr.splice(index, 1);
			} else {
				return false;
			}
		}
	}, {
		key: "isExistCategory",
		value: function isExistCategory(nameOfCategory) {
			if (!nameOfCategory) {
				return false;
			}

			if (this.categoryArr.length < 1) {
				return false;
			}
			var nameOfCategoryArr = [];
			for (var i = 0; i < this.categoryArr.length; i++) {
				nameOfCategoryArr.push(this.categoryArr[i].name);
			}
			return nameOfCategoryArr.indexOf(nameOfCategory) > -1;
		}
	}, {
		key: "getAmountOfTask",
		value: function getAmountOfTask() {
			var num = 0;
			for (var i = 0; i < this.categoryArr.length; i++) {
				num = num + this.categoryArr[i].getAmountOfTask();
			}
			return num;
		}
	}, {
		key: "getAmountOfFinishedTask",
		value: function getAmountOfFinishedTask() {
			var num = 0;
			for (var i = 0; i < this.categoryArr.length; i++) {
				num = num + this.categoryArr[i].getAmountOfFinishedTask();
			}
			return num;
		}
	}, {
		key: "getAmountOfUnfinishedTask",
		value: function getAmountOfUnfinishedTask() {
			var num = 0;
			for (var i = 0; i < this.categoryArr.length; i++) {
				num = num + this.categoryArr[i].getAmountOfUnfinishedTask();
			}
			return num;
		}
	}, {
		key: "getTaskByName",
		value: function getTaskByName(name) {
			var result = null;
			for (var i = 0; i < this.categoryArr.length; i++) {
				var currentCategory = this.categoryArr[i];
				var targetTask = currentCategory.getTaskByName(name);
				if (targetTask) {
					return targetTask;
				}
			}
			return false;
		}
	}, {
		key: "orderTasks",
		value: function orderTasks(arr) {
			//深度复制数组来进行操作,不然会影响源数据结构
			var taskArr = Object.create(arr);
			if (taskArr.length <= 1) {
				return taskArr;
			}
			var pivotIndex = Math.floor(taskArr.length / 2);
			var pivot = taskArr.splice(pivotIndex, 1)[0];
			var left = [];
			var right = [];
			var result = [];
			for (var i = 0; i < taskArr.length; i++) {
				if (taskArr[i].getNumOfDate() < pivot.getNumOfDate()) {
					left.push(taskArr[i]);
				} else {
					right.push(taskArr[i]);
				}
			}
			result = [].concat(_toConsumableArray(this.orderTasks(left)), [pivot], _toConsumableArray(this.orderTasks(right)));
			return result;
		}
	}, {
		key: "getAllTasks",
		value: function getAllTasks() {
			var resultArr = [];
			for (var i = 0; i < this.categoryArr.length; i++) {
				var currentItem = this.categoryArr[i];
				resultArr = [].concat(_toConsumableArray(resultArr), _toConsumableArray(currentItem.getAllTasks()));
			}
			return resultArr;
		}
	}, {
		key: "getUnFinishedTasks",
		value: function getUnFinishedTasks() {
			var resultArr = [];
			var allTasks = this.getAllTasks();
			for (var i = 0; i < allTasks.length; i++) {
				if (!allTasks[i].isFinish) {
					resultArr.push(allTasks[i]);
				}
			}
			return resultArr;
		}
	}, {
		key: "getFinishedTasks",
		value: function getFinishedTasks() {
			var resultArr = [];
			var allTasks = this.getAllTasks();
			for (var i = 0; i < allTasks.length; i++) {
				if (allTasks[i].isFinish) {
					resultArr.push(allTasks[i]);
				}
			}
			return resultArr;
		}
	}, {
		key: "getOrderedTask",
		value: function getOrderedTask() {
				var allTasks = this.getAllTasks();
				return this.orderTasks(allTasks);
			}
			//将若干个任务数据包装成HTML标签

	}, {
		key: "showTasks",
		value: function showTasks(taskArr) {
			if (!taskArr) {
				return false;
			}
			var resultNode = document.createElement('div');
			var lastDate = null;
			for (var i = 0; i < taskArr.length; i++) {
				var currentTask = taskArr[i];
				//判断是否添加日期节点
				if (!(lastDate === currentTask.getNumOfDate())) {
					var dateNode = document.createElement('div');
					var textNode = document.createTextNode(currentTask.date);
					dateNode.appendChild(textNode);
					dateNode.className += ' dateNode';
					resultNode.appendChild(dateNode);
					lastDate = currentTask.getNumOfDate();
				}
				var taskNode = this.createDivNode(currentTask.name);

				//写入日期文字标题数据

				taskNode.taskName = currentTask.name;
				taskNode.dateOfTask = currentTask.date;
				taskNode.textOfTask = currentTask.text;
				//添加完成图标
				taskNode.className += ' taskNode';
				if (currentTask.isFinish) {
					taskNode.className += ' finishedTaskNode';
					var finishedIcon = document.createElement('i');
					finishedIcon.className += ' fa fa-check';
					taskNode.appendChild(finishedIcon);
				} else {
					taskNode.className += ' unFinishedTaskNode';
				}

				taskNode.onclick = function() {
					//点击高亮
					var highLightItems = this.parentNode.children;
					var mainContentController = new MainContentController();
					for (var _i5 = 0; _i5 < highLightItems.length; _i5++) {
						removeClass(highLightItems[_i5], 'taskNodeHighLight');
					}
					this.className += " taskNodeHighLight";
					//在主区域加载数据
					mainContentController.changeStateOfMainContent();
				};

				resultNode.appendChild(taskNode);
				//
			}
			var firstTask = resultNode.getElementsByClassName("taskNode")[0];
			if (firstTask) firstTask.className += " taskNodeHighLight";
			resultNode.className += ' taskArea';
			return resultNode;
		}
	}, {
		key: "createDivNode",
		value: function createDivNode(innerHTML) {
			var result = void 0;
			result = document.createElement('div');
			result.innerHTML = innerHTML;
			return result;
		}
	}]);

	return CateGoryNode;
}();
//根节点


var CateGoryRoot = function(_CateGoryNode) {
	_inherits(CateGoryRoot, _CateGoryNode);

	function CateGoryRoot(name) {
		_classCallCheck(this, CateGoryRoot);

		return _possibleConstructorReturn(this, (CateGoryRoot.__proto__ || Object.getPrototypeOf(CateGoryRoot)).call(this, name));
	}

	_createClass(CateGoryRoot, [{
		key: "addCategoryByName",
		value: function addCategoryByName(name) {
			if (this.getCategory(name)) {
				return false;
			}
			var newCategory = new Category(name);
			this.categoryArr.push(newCategory);
		}
	}]);

	return CateGoryRoot;
}(CateGoryNode);
//主分类节点


var Category = function(_CateGoryNode2) {
	_inherits(Category, _CateGoryNode2);

	function Category(name) {
		_classCallCheck(this, Category);

		return _possibleConstructorReturn(this, (Category.__proto__ || Object.getPrototypeOf(Category)).call(this, name));
	}

	_createClass(Category, [{
		key: "addCategoryByName",
		value: function addCategoryByName(name) {
			if (this.getCategory(name)) {
				return false;
			}
			var newCategory = new SubCategory(name);
			this.categoryArr.push(newCategory);
		}
	}]);

	return Category;
}(CateGoryNode);
//子分类节点


var SubCategory = function(_CateGoryNode3) {
	_inherits(SubCategory, _CateGoryNode3);

	function SubCategory() {
		var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '子分类';

		_classCallCheck(this, SubCategory);

		return _possibleConstructorReturn(this, (SubCategory.__proto__ || Object.getPrototypeOf(SubCategory)).call(this, name));
	}

	_createClass(SubCategory, [{
		key: "addCategoryByName",
		value: function addCategoryByName(name) {
			var newCategory = new Task(name);
			this.categoryArr.push(newCategory);
		}
	}, {
		key: "getAmountOfTask",
		value: function getAmountOfTask() {
			return this.categoryArr.length;
		}
	}, {
		key: "getAmountOfUnfinishedTask",
		value: function getAmountOfUnfinishedTask() {
			var num = 0;
			for (var i = 0; i < this.categoryArr.length; i++) {
				if (this.categoryArr[i].isFinish == false) {
					num++;
				}
			}
			return num;
		}
	}, {
		key: "getAmountOfFinishedTask",
		value: function getAmountOfFinishedTask() {
			var num = this.getAmountOfTask() - this.getAmountOfUnfinishedTask();
			return num;
		}
	}, {
		key: "getAllTasks",
		value: function getAllTasks() {
			return this.categoryArr;
		}
	}, {
		key: "getTaskByName",
		value: function getTaskByName(name) {
			return this.getCategory(name);
		}
	}]);

	return SubCategory;
}(CateGoryNode);
//任务节点


var Task = function() {
	function Task() {
		var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
		var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
		var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

		_classCallCheck(this, Task);

		this.name = name;
		this.date = date;
		this.text = text;
		this.isFinish = false;
	}

	_createClass(Task, [{
		key: "getNumOfDate",
		value: function getNumOfDate() {
			var date = this.date;
			var numOfDate = 0;
			if (date) {
				var charArr = date.split('-');
				if (charArr.length == 3) {
					numOfDate = charArr[0] * 365 + charArr[1] * 30 + charArr[2];
				}
			}
			return numOfDate;
		}
	}]);

	return Task;
}();

function getDemoDate() {
	var result = "{\"categoryArr\":[{\"categoryArr\":[{\"categoryArr\":[{\"name\":\"项目说明\",\"date\":\"2016-12-01\",\"text\":\"此应用为个人计划任务应用，结构为主分类，子分类，任务列表三层。\\n左侧有分类列表,中间为任务列表,右侧为主要显示内容。\\n可以添加任务,删除任务,修改任务,完成任务。\\n\\n数据以localStorage的方式存储在浏览器中,可以作离线应用使用。\",\"isFinish\":false}],\"name\":\"默认子分类\"}],\"name\":\"默认分类\"},{\"categoryArr\":[{\"categoryArr\":[{\"name\":\"第一周\",\"date\":\"2016-11-02\",\"text\":\"蛙泳\",\"isFinish\":false},{\"name\":\"第二周\",\"date\":\"2016-11-12\",\"text\":\"蝶泳\",\"isFinish\":true},{\"name\":\"第三周\",\"date\":\"2016-12-01\",\"text\":\"仰泳\",\"isFinish\":false},{\"name\":\"第四周\",\"date\":\"2016-12-07\",\"text\":\"自由泳\",\"isFinish\":false},{\"name\":\"第五周\",\"date\":\"2017-01-10\",\"text\":\"今天适合1000m蛙泳!!!\",\"isFinish\":false},{\"name\":\"第六周\",\"date\":\"2016-12-06\",\"text\":\"今天适合1000m蝶泳!\",\"isFinish\":true},{\"name\":\"第八周\",\"date\":\"2017-03-09\",\"text\":\"测试\",\"isFinish\":true},{\"name\":\"第七周\",\"date\":\"2017-01-19\",\"text\":\"测试\",\"isFinish\":false}],\"name\":\"游泳\"}],\"name\":\"运动计划\"},{\"categoryArr\":[{\"categoryArr\":[],\"name\":\"能量\"},{\"categoryArr\":[],\"name\":\"脂肪\"}],\"name\":\"饮食计划\"},{\"categoryArr\":[{\"categoryArr\":[],\"name\":\"日本\"},{\"categoryArr\":[{\"name\":\"温哥华\",\"date\":\"2016-12-08\",\"text\":\"加拿大城市\",\"isFinish\":false},{\"name\":\"洛杉矶\",\"date\":\"2016-08-17\",\"text\":\"西海岸核心城市\",\"isFinish\":true},{\"name\":\"华盛顿\",\"date\":\"2017-01-19\",\"text\":\"政治权利中心\",\"isFinish\":false}],\"name\":\"北美\"}],\"name\":\"旅游计划\"},{\"categoryArr\":[{\"categoryArr\":[],\"name\":\"股票\"}],\"name\":\"理财计划\"}],\"name\":\"allTasks\"}";
	return result;
}