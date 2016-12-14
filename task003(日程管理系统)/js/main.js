window.onresize = setHeightOfMainArea; //浏览器窗口发生变化时同时变化DIV高度
window.onload = initial;

//这个函数实现高度与浏览器高度自适应
function setHeightOfMainArea() {
	var winHeight = autodivheight();
	var mainArea = $(".main");
	var textArea = $("textArea");
	mainArea.style.height = (winHeight - 64) + "px";
	//使文字输入区填空剩余部分高度
	textArea.style.height = (winHeight - 64 - 200) + "px";
}

function autodivheight() { //将body高度设置为浏览器可见区域高度
	//获取浏览器窗口高度
	var winHeight = 0;
	if (window.innerHeight)
		winHeight = window.innerHeight;
	else if ((document.body) && (document.body.clientHeight))
		winHeight = document.body.clientHeight;
	//通过深入Document内部对body进行检测，获取浏览器窗口高度
	if (document.documentElement && document.documentElement.clientHeight)
		winHeight = document.documentElement.clientHeight;
	//DIV高度为浏览器窗口的高度
	//document.getElementById("test").style.height= winHeight +"px";
	//DIV高度为浏览器窗口高度的一半
	var mainArea = $(".main");
	var bodyArea = $("body");
	bodyArea.style.height = winHeight + "px";
	return winHeight;
}
//主程序入口
function initial() {
	setHeightOfMainArea();
	let defaultCategoryTree = null;
	let tree10 = JSON.parse(localStorage.getItem('tree10'));
	console.log(localStorage.getItem('tree10'));
	if (!tree10) {
		localStorage.setItem('tree10', getDemoDate());
	}
	defaultCategoryTree = getCategoryTree();
	let numOfAllTasks = $("#numOfAllTasks");
	initialzeCategoryArea(defaultCategoryTree, numOfAllTasks);
}

function initialzeCategoryArea(defaultCategoryTree, numOfAllTasks) {
	let addCategoryArea = $(".addCategory");
	let inputCategory = $("#inputCategory");
	let shadow = $("#shadow");
	let confirmAddCategory = $('#confirm');
	let cancelAddCategory = $('#cancel');
	let nameOfNewCategory = $('#nameOfNewCategory');
	let selectCategoryName = $('#CategoryName');
	let mainContentController = new MainContentController();
	//添加默认分类
	defaultCategoryTree.addCategoryByName("默认分类");

	updateCategoryTree(defaultCategoryTree, numOfAllTasks);

	addCategoryArea.onclick = function() {
		nameOfNewCategory.placeholder = '';
		nameOfNewCategory.value = '';
		inputCategory.style.display = "block";
		shadow.style.display = "block";
	}

	confirmAddCategory.onclick = function() {
		let defaultCategoryTree = getCategoryTree();
		if (nameOfNewCategory.value) {
			if (selectCategoryName.value == 'default') {
				inputCategory.style.display = "none";
				shadow.style.display = "none";
				defaultCategoryTree.addCategoryByName(nameOfNewCategory.value);
				saveCategoryTree(defaultCategoryTree);
				updateCategoryTree(defaultCategoryTree, numOfAllTasks);
			} else {
				let selectCategoryName = $('#CategoryName').value;
				let selectedCategory = defaultCategoryTree.getCategory(selectCategoryName);
				inputCategory.style.display = "none";
				shadow.style.display = "none";
				selectedCategory.addCategoryByName(nameOfNewCategory.value);
				saveCategoryTree(defaultCategoryTree);
				updateCategoryTree(defaultCategoryTree, numOfAllTasks);
			}
		} else {
			nameOfNewCategory.placeholder = '分类名不能为空!';
		}
	}

	cancelAddCategory.onclick = function() {
			inputCategory.style.display = "none";
			shadow.style.display = "none";
		}
		//绑定主区域按钮点击事件
	mainContentController.bindClickOfBtns();
}
//专为响应右侧主区域视图变化而设置的类
class MainContentController {
	constructor() {
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
	initial() {

		this.nameOfTaskInput.readOnly = true;
		this.dateContentInput.readOnly = true;
		this.mainText.readOnly = true;
		for (let i = 0; i < this.btnArr.length; i++) {
			this.btnArr[i].style.display = 'none';
		}
		this.nameOfTaskInput.style.background = "transparent";
		this.dateContentInput.style.background = "transparent";
	}
	showTaskDetail() {

		let defaultCategoryTree = getCategoryTree();
		let highLightCategoryNode = document.getElementsByClassName('highLight')[0];
		let highLightTaskNode = document.getElementsByClassName('taskNodeHighLight')[0];

		if (!highLightTaskNode) {
			return false;
		}

		this.nameOfTaskInput.value = highLightTaskNode.taskName;
		this.dateContentInput.value = highLightTaskNode.dateOfTask;
		this.mainText.value = highLightTaskNode.textOfTask;
	}
	editState() {

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
	unfinishedState() {

		this.finishTaskBtn.style.display = 'inline-block';
		this.editTaskBtn.style.display = 'inline-block';
	}
	changeStateOfMainContent() {

		let highLightTaskNode = document.getElementsByClassName('taskNodeHighLight')[0];
		this.initial();
		this.showTaskDetail();
		if (!highLightTaskNode) {
			return false;
		}
		if (!highLightTaskNode.className.includes('finishedTaskNode')) {
			this.unfinishedState();
		}
	}
	bindClickOfBtns() {
		let that = this;
		this.editTaskBtn.onclick = function() {
			that.editState();
		}
		this.finishTaskBtn.onclick = function() {
			let taskNode = document.getElementsByClassName('taskNodeHighLight')[0];
			let taskName = taskNode.taskName;
			let defaultCategoryTree = getCategoryTree();
			let targetTask = defaultCategoryTree.getTaskByName(taskName);

			targetTask.isFinish = true;
			taskNode.className += ' finishedTaskNode';
			let finishedIcon = document.createElement('i');
			finishedIcon.className += ' fa fa-check';
			taskNode.appendChild(finishedIcon);
			saveCategoryTree(defaultCategoryTree);
		}
		this.addTaskBtn.onclick = function() {
				let highLightCategory = document.getElementsByClassName("highLight")[0];
				let nameOfhighLight = highLightCategory.categoryName;
				let defaultCategoryTree = getCategoryTree();
				if (highLightCategory.className.includes('category')) {
					let lengthOfSubCategory = defaultCategoryTree.getCategory(nameOfhighLight).categoryArr.length;
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
			}
			//保存按钮点击事件有修改和新建任务两种情况
		this.saveBtn.onclick = function() {
			let defaultCategoryTree = getCategoryTree();
			let highLightCategoryNode = document.getElementsByClassName('highLight')[0];
			let taskListContent = document.getElementsByClassName('taskListContent')[0];
			if (that.nameOfTaskInput.value == "") {
				alert("任务名不能为空!");
				return;
			}
			if (that.dateContentInput.value == "") {
				alert("任务日期不能为空!");
				return;
			}
			if (that.mainText.value == "") {
				alert("任务内容不能为空!")
				return;
			}
			//判断是不是在增加任务
			if (that.saveBtn.isAddCategoryFlag) {
				let indexOfHighLightCategoryNode = getElementTop(highLightCategoryNode);

				let newTask = new Task();
				let highLightSubCategory = defaultCategoryTree.getCategory(highLightCategoryNode.parentCategoryName).getCategory(highLightCategoryNode.categoryName);
				if (defaultCategoryTree.getTaskByName(that.nameOfTaskInput.value)) {
					alert("任务名不能重复!");
					return;
				}
				newTask.name = that.nameOfTaskInput.value;
				newTask.date = that.dateContentInput.value;
				newTask.text = that.mainText.value;
				highLightSubCategory.categoryArr.push(newTask);
				saveCategoryTree(defaultCategoryTree);
				let numOfAllTasks = $("#numOfAllTasks");
				updateCategoryTree(defaultCategoryTree, numOfAllTasks);
				let targetCategory = null;
				let categoryList = document.getElementsByClassName('categoryList')[0].children[indexOfHighLightCategoryNode];
				categoryList.click();
				let targetTaskNode = null;
				let taskList = taskListContent.children[0].children;
				for (let i = 0; i < taskList.length; i++) {
					if (taskList[i].taskName == newTask.name) {
						targetTaskNode = taskList[i];
					}
				}
				targetTaskNode.click();
				that.saveBtn.isAddCategoryFlag = false;
			}
			//修改任务 
			else {
				let highLightTaskNode = document.getElementsByClassName('taskNodeHighLight')[0];
				let indexOfHighLightTaskNode = getElementTop(highLightTaskNode);
				if ((that.nameOfTaskInput.value != highLightTaskNode.taskName) && defaultCategoryTree.getTaskByName(that.nameOfTaskInput.value)) {
					alert("任务名不能重复!");
					return;
				}
				taskListContent.innerHTML = "";
				let targetTask = defaultCategoryTree.getTaskByName(highLightTaskNode.taskName);
				targetTask.name = that.nameOfTaskInput.value;
				targetTask.date = that.dateContentInput.value;
				targetTask.text = that.mainText.value;
				saveCategoryTree(defaultCategoryTree);
				highLightCategoryNode.click();
				let targetTaskNode = null;
				let taskList = taskListContent.children[0].children;
				for (let i = 0; i < taskList.length; i++) {
					if (taskList[i].taskName == targetTask.name) {
						targetTaskNode = taskList[i];
					}
				}
				targetTaskNode.click();
			}
		}
		this.cancelBtn.onclick = function() {
			let highLightTaskNode = document.getElementsByClassName('taskNodeHighLight')[0];
			highLightTaskNode.click();
		}

	}

}
//读取,存储数据的两个方法
function saveCategoryTree(defaultCategoryTree) {
	localStorage.setItem('tree10', JSON.stringify(defaultCategoryTree));
}

function getCategoryTree() {
	let tree = JSON.parse(localStorage.getItem('tree10'));
	let defaultCategoryTree = new CateGoryRoot('allTasks');
	for (let i = 0; i < tree.categoryArr.length; i++) {
		let currentCategory = tree.categoryArr[i];
		defaultCategoryTree.addCategoryByName(currentCategory.name);

		for (let j = 0; j < currentCategory.categoryArr.length; j++) {
			let currentSubCategory = currentCategory.categoryArr[j];
			let currentDefaultCategory = defaultCategoryTree.categoryArr[i];
			currentDefaultCategory.addCategoryByName(currentSubCategory.name);

			for (let k = 0; k < currentSubCategory.categoryArr.length; k++) {
				let currentTask = currentSubCategory.categoryArr[k];
				let currentDefaultSubCategory = currentDefaultCategory.categoryArr[j];

				currentDefaultSubCategory.addCategoryByName(currentTask.name);
				let currentDefaultTask = currentDefaultSubCategory.getCategory(currentTask.name);
				for (value in currentTask) {
					currentDefaultTask[value] = currentTask[value];
				}
			}
		}

	}
	return defaultCategoryTree;
}
//更新分类列表,此函数有闭包问题存在,应细化为若干个类,有待优化
function updateCategoryTree(defaultCategoryTree, numOfAllTasks) {
	numOfAllTasks.innerHTML = defaultCategoryTree.getAmountOfTask();
	let categoryList = $(".categoryList");

	categoryList.innerHTML = `<p>分类列表</p>`;
	let numOfCategorys = defaultCategoryTree.categoryArr.length;

	for (let i = 0; i < numOfCategorys; i++) {
		//更新主分类树
		let currentCategory = defaultCategoryTree.categoryArr[i];
		let numOfTasksInCurrentCategory = currentCategory.getAmountOfTask();
		let textNode = document.createTextNode(currentCategory.name + ' ( ' + numOfTasksInCurrentCategory + ' )');
		let newCategoryNode = document.createElement("p");
		let icon = document.createElement('i');

		if (i > 0) {
			let iconDelete = document.createElement('i');
			iconDelete.className += 'fa fa-trash-o';
			newCategoryNode.appendChild(iconDelete);
		}
		icon.className += 'fa fa-folder-open';
		newCategoryNode.className += ' category';
		newCategoryNode.categoryName = currentCategory.name;
		newCategoryNode.numOfTasks = numOfTasksInCurrentCategory;
		newCategoryNode.appendChild(icon);
		newCategoryNode.appendChild(textNode);
		if (i == 0) {
			newCategoryNode.className += ' highLight';
		}
		categoryList.appendChild(newCategoryNode);
		//更新子分类树
		let numOfSubCategorys = currentCategory.categoryArr.length;
		for (let j = 0; j < numOfSubCategorys; j++) {
			let currentSubCategory = currentCategory.categoryArr[j];
			let newSubCategoryNode = document.createElement("p");
			let icon = document.createElement('i');
			let iconDelete = document.createElement('i');
			let numOfTasksInCurrentSubCategory = currentSubCategory.getAmountOfTask();
			let textNode = document.createTextNode(currentSubCategory.name + ' ( ' + numOfTasksInCurrentSubCategory + ' )');

			iconDelete.className += 'fa fa-trash-o';
			newSubCategoryNode.appendChild(iconDelete);
			icon.className += "fa fa-file-o";
			newSubCategoryNode.className += ' subCategory';
			newSubCategoryNode.appendChild(icon);
			newSubCategoryNode.appendChild(textNode);
			newSubCategoryNode.categoryName = currentSubCategory.name;
			newSubCategoryNode.parentCategoryName = currentCategory.name;
			newSubCategoryNode.numOfTasks = numOfTasksInCurrentSubCategory;
			categoryList.appendChild(newSubCategoryNode);
		}
		//绑定删除事件
		let iconDelete = document.getElementsByClassName('fa-trash-o');
		if (iconDelete) {
			for (let i = 0; i < iconDelete.length; i++) {
				let currentIcon = iconDelete[i];
				currentIcon.onclick = function() {
					let defaultCategoryTree = getCategoryTree();
					let categoryList = $(".categoryList");
					let targetCategory = this.parentNode;
					let categoryName = targetCategory.categoryName;
					let parentCategoryName = targetCategory.parentCategoryName;
					//判断是主分类还是子分类
					//有该属性证明是子分类
					if (parentCategoryName) {
						let parentCategory = defaultCategoryTree.getCategory(parentCategoryName);
						parentCategory.deleteCategory(categoryName);
					} else {
						defaultCategoryTree.deleteCategory(categoryName);
						let lengthOfItems = categoryList.children.length;
						for (let j = 0; j < lengthOfItems; j++) {
							let currentNode = categoryList.children[j];

							if (currentNode.parentCategoryName) {
								if (currentNode.parentCategoryName == categoryName) {
									currentNode.parentNode.removeChild(currentNode);
									j--;
									lengthOfItems--;
								}
							}
						}
					}
					targetCategory.parentNode.removeChild(targetCategory);
					saveCategoryTree(defaultCategoryTree);
					updateSelect();
					let defaultCategoryTreeNew = getCategoryTree();
					updateCategoryTree(defaultCategoryTreeNew, numOfAllTasks);
				}
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
		let defaultCategoryTree = getCategoryTree();
		let numOfCategorys = defaultCategoryTree.categoryArr.length;
		let selectCategoryName = $('#CategoryName');
		selectCategoryName.innerHTML = `<option value="default">新增主分类</option>`;
		for (let i = 0; i < numOfCategorys; i++) {
			let currentCategory = defaultCategoryTree.categoryArr[i];
			let optionsOfSelect = selectCategoryName.getElementsByTagName('option');
			let isOptionExist = false;
			let itemOption = document.createElement('option');
			let textOfOption = document.createTextNode(currentCategory.name);
			for (let j = 0; j < optionsOfSelect.length; j++) {
				let currentOptionText = optionsOfSelect[j].innerHTML;
				if (currentCategory.name == currentOptionText) {
					isOptionExist = true;
				}
			}
			if (!isOptionExist) {
				itemOption.appendChild(textOfOption);
				itemOption.value = currentCategory.name;
				selectCategoryName.appendChild(itemOption);
			}
		}
	}
	//绑定主分类的点击事件
	function bindClickOfCategory() {
		let defaultCategoryTree = getCategoryTree();
		let categoryList = $(".categoryList");
		let lengthOfItems = categoryList.children.length;
		let mainContentController = new MainContentController()
			//任务容器
		let taskListContent = document.getElementsByClassName('taskListContent')[0];
		//输入界面
		let nameOfTaskInput = document.getElementsByClassName('nameOfTask')[0];
		let dateContentInput = document.getElementsByClassName('dateContent')[0];
		let mainText = document.getElementsByTagName('textarea')[0];

		for (let j = 1; j < lengthOfItems; j++) {
			let currentNode = categoryList.children[j];
			currentNode.onclick = function() {
				let defaultCategoryTree = getCategoryTree();
				//点击分类高亮显示
				let highLightItems = document.getElementsByClassName('highLight');
				let taskList = document.getElementsByClassName('taskList')[0];
				let allTasksTag = taskList.getElementsByTagName('span')[0];


				for (let i = 0; i < highLightItems.length; i++) {
					removeClass(highLightItems[i], 'highLight');
				}
				this.className += ' highLight';
				clearMainContent();
				if (this.className.includes('category')) {
					let currentCategory = defaultCategoryTree.getCategory(this.categoryName);
					if (currentCategory) {
						let firstSubCategory = currentCategory.categoryArr[0];
						let orderTasks = currentCategory.getOrderedTask();
						taskListContent.appendChild(currentCategory.showTasks(orderTasks));
					}
				} else if (this.className.includes('subCategory')) {
					let currentSubCategory = defaultCategoryTree.getCategory(this.parentCategoryName).getCategory(this.categoryName);
					if (currentSubCategory) {
						let orderTasks = currentSubCategory.getOrderedTask();
						taskListContent.appendChild(currentSubCategory.showTasks(orderTasks));
					}
					// let orderTasks = currentSubCategory.getOrderedTask();
					// taskListContent.appendChild(currentSubCategory.showTasks(orderTasks));
				}
				mainContentController.changeStateOfMainContent();
				setHighLightTag(allTasksTag);
			}
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
		let taskList = document.getElementsByClassName('taskList')[0];
		let taskListContent = document.getElementsByClassName('taskListContent')[0];
		let taskArea = taskListContent.children[0];
		let allTasksTag = taskList.getElementsByTagName('span')[0];
		let unFinishedTasksTag = taskList.getElementsByTagName('span')[1];
		let finishedTasksTag = taskList.getElementsByTagName('span')[2];
		let defaultCategoryTree = getCategoryTree();
		let nameOfTaskInput = document.getElementsByClassName('nameOfTask')[0];
		let dateContentInput = document.getElementsByClassName('dateContent')[0];
		let mainText = document.getElementsByTagName('textarea')[0];
		let mainContentController = new MainContentController();

		allTasksTag.onclick = function() {
			let defaultCategoryTree = getCategoryTree();
			let highLightCategory = document.getElementsByClassName('highLight')[0];
			clearMainContent();

			if (highLightCategory.className.includes('category')) {
				let currentCategory = defaultCategoryTree.getCategory(highLightCategory.categoryName);
				let firstSubCategory = currentCategory.categoryArr[0];
				let orderTasks = currentCategory.getOrderedTask();
				taskListContent.appendChild(currentCategory.showTasks(orderTasks));
			} else if (highLightCategory.className.includes('subCategory')) {
				let currentSubCategory = defaultCategoryTree.getCategory(highLightCategory.parentCategoryName).getCategory(highLightCategory.categoryName);
				let orderTasks = currentSubCategory.getOrderedTask();
				taskListContent.appendChild(currentSubCategory.showTasks(orderTasks));
			}
			setHighLightTag(this);
			mainContentController.changeStateOfMainContent();
		}

		unFinishedTasksTag.onclick = function() {
			let defaultCategoryTree = getCategoryTree();
			let highLightCategory = document.getElementsByClassName('highLight')[0];
			clearMainContent();
			if (highLightCategory.className.includes('category')) {
				let currentCategory = defaultCategoryTree.getCategory(highLightCategory.categoryName);
				let firstSubCategory = currentCategory.categoryArr[0];
				let orderTasks = currentCategory.orderTasks(currentCategory.getUnFinishedTasks());
				taskListContent.appendChild(currentCategory.showTasks(orderTasks));
			} else if (highLightCategory.className.includes('subCategory')) {
				let currentSubCategory = defaultCategoryTree.getCategory(highLightCategory.parentCategoryName).getCategory(highLightCategory.categoryName);
				let orderTasks = currentSubCategory.orderTasks(currentSubCategory.getUnFinishedTasks());
				taskListContent.appendChild(currentSubCategory.showTasks(orderTasks));
			}
			setHighLightTag(this);
			mainContentController.changeStateOfMainContent();
		}
		finishedTasksTag.onclick = function() {
			let defaultCategoryTree = getCategoryTree();
			let highLightCategory = document.getElementsByClassName('highLight')[0];
			clearMainContent();

			if (highLightCategory.className.includes('category')) {
				let currentCategory = defaultCategoryTree.getCategory(highLightCategory.categoryName);
				let firstSubCategory = currentCategory.categoryArr[0];
				let orderTasks = currentCategory.orderTasks(currentCategory.getFinishedTasks());
				taskListContent.appendChild(currentCategory.showTasks(orderTasks));
			} else if (highLightCategory.className.includes('subCategory')) {
				let currentSubCategory = defaultCategoryTree.getCategory(highLightCategory.parentCategoryName).getCategory(highLightCategory.categoryName);
				let orderTasks = currentSubCategory.orderTasks(currentSubCategory.getFinishedTasks());
				taskListContent.appendChild(currentSubCategory.showTasks(orderTasks));
			}
			setHighLightTag(this);
			mainContentController.changeStateOfMainContent();
		}

		function clearMainContent() {
			taskListContent.innerHTML = '';
			nameOfTaskInput.value = '';
			dateContentInput.value = '';
			mainText.value = '';
		}
	}

	function setHighLightTag(targetTag) {
		let highLightTag = document.getElementsByClassName('defaultColorOfTag')[0];
		let newClassName = highLightTag.className.replace('defaultColorOfTag', ' ');
		highLightTag.className = newClassName;
		targetTag.className += " defaultColorOfTag";
	}
}
//分类节点的实现方式,包括增删查改等函数
class CateGoryNode {
	constructor(name = '分类节点') {
		this.categoryArr = [];
		this.name = name;
	}
	getCategory(nameOfCategory) {
		if (this.categoryArr.length > 0) {
			for (let i = 0; i < this.categoryArr.length; i++) {
				if (this.categoryArr[i].name == nameOfCategory) {
					return this.categoryArr[i];
				}
			}
		} else {
			return false;
		}
	}
	addCategoryByName(name = '新建分类') {
		if (this.getCategory(name)) {
			return false;
		}
		let newCategory = new CateGoryNode(name);
		this.categoryArr.push(newCategory);
	}
	deleteCategory(nameOfCategory) {
		let target = this.getCategory(nameOfCategory);
		if (target) {
			let index = this.categoryArr.indexOf(target);
			this.categoryArr.splice(index, 1);
		} else {
			return false;
		}
	}
	isExistCategory(nameOfCategory) {
		if (!nameOfCategory) {
			return false;
		}

		if (this.categoryArr.length < 1) {
			return false;
		}
		let nameOfCategoryArr = [];
		for (let i = 0; i < this.categoryArr.length; i++) {
			nameOfCategoryArr.push(this.categoryArr[i].name);
		}
		return nameOfCategoryArr.includes(nameOfCategory);
	}
	getAmountOfTask() {
		let num = 0;
		for (let i = 0; i < this.categoryArr.length; i++) {
			num = num + this.categoryArr[i].getAmountOfTask();
		}
		return num;
	}
	getAmountOfFinishedTask() {
		let num = 0;
		for (let i = 0; i < this.categoryArr.length; i++) {
			num = num + this.categoryArr[i].getAmountOfFinishedTask();
		}
		return num;
	}
	getAmountOfUnfinishedTask() {
		let num = 0;
		for (let i = 0; i < this.categoryArr.length; i++) {
			num = num + this.categoryArr[i].getAmountOfUnfinishedTask();
		}
		return num;
	}
	getTaskByName(name) {
		let result = null;
		for (let i = 0; i < this.categoryArr.length; i++) {
			let currentCategory = this.categoryArr[i];
			let targetTask = currentCategory.getTaskByName(name);
			if (targetTask) {
				return targetTask;
			}
		}
		return false;
	}
	orderTasks(arr) {
		//深度复制数组来进行操作,不然会影响源数据结构
		let taskArr = Object.create(arr);
		if (taskArr.length <= 1) {
			return taskArr;
		}
		let pivotIndex = Math.floor(taskArr.length / 2);
		let pivot = taskArr.splice(pivotIndex, 1)[0];
		let left = [];
		let right = [];
		let result = [];
		for (let i = 0; i < taskArr.length; i++) {
			if (taskArr[i].getNumOfDate() < pivot.getNumOfDate()) {
				left.push(taskArr[i]);
			} else {
				right.push(taskArr[i]);
			}
		}
		result = [...this.orderTasks(left), ...[pivot], ...this.orderTasks(right)];
		return result;
	}
	getAllTasks() {
		let resultArr = [];
		for (let i = 0; i < this.categoryArr.length; i++) {
			let currentItem = this.categoryArr[i];
			resultArr = [...resultArr, ...currentItem.getAllTasks()];
		}
		return resultArr;
	}
	getUnFinishedTasks() {
		let resultArr = [];
		let allTasks = this.getAllTasks();
		for (let i = 0; i < allTasks.length; i++) {
			if (!allTasks[i].isFinish) {
				resultArr.push(allTasks[i]);
			}
		}
		return resultArr;
	}
	getFinishedTasks() {
		let resultArr = [];
		let allTasks = this.getAllTasks();
		for (let i = 0; i < allTasks.length; i++) {
			if (allTasks[i].isFinish) {
				resultArr.push(allTasks[i]);
			}
		}
		return resultArr;
	}
	getOrderedTask() {
			let allTasks = this.getAllTasks();
			return this.orderTasks(allTasks);
		}
		//将若干个任务数据包装成HTML标签
	showTasks(taskArr) {
		if (!taskArr) {
			return false;
		}
		let resultNode = document.createElement('div');
		let lastDate = null;
		for (let i = 0; i < taskArr.length; i++) {
			let currentTask = taskArr[i];
			//判断是否添加日期节点
			if (!(lastDate === currentTask.getNumOfDate())) {
				let dateNode = document.createElement('div');
				let textNode = document.createTextNode(currentTask.date);
				dateNode.appendChild(textNode);
				dateNode.className += ' dateNode';
				resultNode.appendChild(dateNode);
				lastDate = currentTask.getNumOfDate();
			}
			let taskNode = this.createDivNode(currentTask.name);

			//写入日期文字标题数据

			taskNode.taskName = currentTask.name;
			taskNode.dateOfTask = currentTask.date;
			taskNode.textOfTask = currentTask.text;
			//添加完成图标
			taskNode.className += ' taskNode';
			if (currentTask.isFinish) {
				taskNode.className += ' finishedTaskNode';
				let finishedIcon = document.createElement('i');
				finishedIcon.className += ' fa fa-check';
				taskNode.appendChild(finishedIcon);
			} else {
				taskNode.className += ' unFinishedTaskNode';
			}

			taskNode.onclick = function() {
				//点击高亮
				let highLightItems = this.parentNode.children;
				let mainContentController = new MainContentController();
				for (let i = 0; i < highLightItems.length; i++) {
					removeClass(highLightItems[i], 'taskNodeHighLight');
				}
				this.className += " taskNodeHighLight";
				//在主区域加载数据
				mainContentController.changeStateOfMainContent();
			}

			resultNode.appendChild(taskNode);
			//
		}
		let firstTask = resultNode.getElementsByClassName("taskNode")[0];
		if (firstTask)
			firstTask.className += " taskNodeHighLight";
		resultNode.className += ' taskArea';
		return resultNode;
	}

	createDivNode(innerHTML) {
		let result;
		result = document.createElement('div');
		result.innerHTML = innerHTML;
		return result;
	}
}
//根节点
class CateGoryRoot extends CateGoryNode {
	constructor(name) {
		super(name);
	}
	addCategoryByName(name) {
		if (this.getCategory(name)) {
			return false;
		}
		let newCategory = new Category(name);
		this.categoryArr.push(newCategory);
	}
}
//主分类节点
class Category extends CateGoryNode {
	constructor(name) {
		super(name);
	}
	addCategoryByName(name) {
		if (this.getCategory(name)) {
			return false;
		}
		let newCategory = new SubCategory(name);
		this.categoryArr.push(newCategory);
	}
}
//子分类节点
class SubCategory extends CateGoryNode {
	constructor(name = '子分类') {
		super(name);
	}
	addCategoryByName(name) {
		let newCategory = new Task(name);
		this.categoryArr.push(newCategory);
	}
	getAmountOfTask() {
		return this.categoryArr.length;
	}
	getAmountOfUnfinishedTask() {
		let num = 0;
		for (let i = 0; i < this.categoryArr.length; i++) {
			if (this.categoryArr[i].isFinish == false) {
				num++;
			}
		}
		return num;
	}
	getAmountOfFinishedTask() {
		let num = this.getAmountOfTask() - this.getAmountOfUnfinishedTask();
		return num;
	}
	getAllTasks() {
		return this.categoryArr;
	}
	getTaskByName(name) {
		return this.getCategory(name);
	}
}
//任务节点
class Task {
	constructor(name = '', date = '', text = '') {
		this.name = name;
		this.date = date;
		this.text = text;
		this.isFinish = false;
	}
	getNumOfDate() {
		let date = this.date;
		let numOfDate = 0;
		if (date) {
			let charArr = date.split('-');
			if (charArr.length == 3) {
				numOfDate = charArr[0] * 365 + charArr[1] * 30 + charArr[2];
			}
		}
		return numOfDate;
	}
}

function getDemoDate() {
	let result = `{"categoryArr":[{"categoryArr":[{"categoryArr":[{"name":"项目说明","date":"2016-12-01","text":"此应用为个人计划任务应用，结构为主分类，子分类，任务列表三层。\n左侧有分类列表,中间为任务列表,右侧为主要显示内容。\n可以添加任务,删除任务,修改任务,完成任务。\n\n数据以localStorage的方式存储在浏览器中,可以作离线应用使用。","isFinish":false}],"name":"默认子分类"}],"name":"默认分类"},{"categoryArr":[{"categoryArr":[{"name":"第一周","date":"2016-11-02","text":"蛙泳","isFinish":false},{"name":"第二周","date":"2016-11-12","text":"蝶泳","isFinish":true},{"name":"第三周","date":"2016-12-01","text":"仰泳","isFinish":false},{"name":"第四周","date":"2016-12-07","text":"自由泳","isFinish":false},{"name":"第五周","date":"2017-01-10","text":"今天适合1000m蛙泳!!!","isFinish":false},{"name":"第六周","date":"2016-12-06","text":"今天适合1000m蝶泳!","isFinish":true},{"name":"第八周","date":"2017-03-09","text":"测试","isFinish":true},{"name":"第七周","date":"2017-01-19","text":"测试","isFinish":false}],"name":"游泳"}],"name":"运动计划"},{"categoryArr":[{"categoryArr":[],"name":"能量"},{"categoryArr":[],"name":"脂肪"}],"name":"饮食计划"},{"categoryArr":[{"categoryArr":[],"name":"日本"},{"categoryArr":[{"name":"温哥华","date":"2016-12-08","text":"加拿大城市","isFinish":false},{"name":"洛杉矶","date":"2016-08-17","text":"西海岸核心城市","isFinish":true},{"name":"华盛顿","date":"2017-01-19","text":"政治权利中心","isFinish":false}],"name":"北美"}],"name":"旅游计划"},{"categoryArr":[{"categoryArr":[],"name":"股票"}],"name":"理财计划"}],"name":"allTasks"}`;
	return result;
}