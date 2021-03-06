var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var tasks = [];

// handles form submit event
var taskFormHandler = function(event) {
    // Prevent page refresh
    event.preventDefault();

    // Load form input
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // form must be filled in
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    };
    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");

    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {
        // Load object with form input
        var taskDataObject = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do",
            id: taskIdCounter
        };
        taskIdCounter++;
        createTaskEl(taskDataObject);
        // Add task to tasks list
        tasks.push(taskDataObject);
        saveTasks();
        // Increment task counter
        taskIdCounter++;
    }
}

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
    // Delete from tasks array
    var taskIndex = tasks.findIndex( obj => obj.id === parseInt(taskId) );
    tasks[taskIndex].name = taskName;
    tasks[taskIndex].type = taskType;
    saveTasks();
}

// Adds task to list (window)
var createTaskEl = function(taskDataObj) {
    // Create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribue
    listItemEl.setAttribute("data-task-id",taskDataObj.id);
    
    // Create div to hold task info add to list item
    var taskInfoEl = document.createElement("div");
    // Assign class name for styling
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span";

    // Append div to li
    listItemEl.appendChild(taskInfoEl);

    // Add task actions
    listItemEl.appendChild(createTaskActions(taskDataObj.id));

    // Append li to ul
    if (taskDataObj.status === "to do")
        tasksToDoEl.appendChild(listItemEl);
    if (taskDataObj.status === "in progress")
        tasksInProgressEl.appendChild(listItemEl);
    if (taskDataObj.status === "completed")
        tasksCompletedEl.appendChild(listItemEl);

}

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // create status selector
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("data-task-id", taskId);
    statusSelectEl.setAttribute("name", "status-change");

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (let i=0;i<statusChoices.length;i++) {
        // create option element
        let statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value",statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
}

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    var taskIndex = tasks.findIndex( obj => obj.id === parseInt(taskId) );
    tasks.splice(taskIndex,1);
    saveTasks();
}

var editTask = function(taskId) {
    // Find li
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // Find h3 task-name within li
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    // Find span task-type within li
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    
    // Load values into the form fields
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    // Change button title
    document.querySelector("#save-task").textContent = "Save Task";
    // Set taskId to the form so we know what task to edit when the user hits the Save Task button
    formEl.setAttribute("data-task-id", taskId);
}

var taskButtonHandler = function(event) {
    if (event.target.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }

    if (event.target.matches(".edit-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }
}

var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    var taskIndex = tasks.findIndex( obj => obj.id === parseInt(taskId) );
    var statusValue = event.target.value.toLowerCase();
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    tasks[taskIndex].status = statusValue;

    if (statusValue === 'to do') {
        tasksToDoEl.appendChild(taskSelected);
    }
    if (statusValue === 'in progress') {
        tasksInProgressEl.appendChild(taskSelected);
    }
    if (statusValue === 'completed') {
        tasksCompletedEl.appendChild(taskSelected);
    }
    saveTasks();
}

var saveTasks = function () {
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

var loadTasks = function () {
    tasks = localStorage.getItem("tasks",tasks);
    if (!tasks) {
        tasks = [];
        return false;
    }
    tasks = JSON.parse(tasks);
    var l = tasks.length;
    
    for (var i=0;i<l;i++) {
        createTaskEl(tasks[i]);
    }
    taskIdCounter = i;
}

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);