var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

// handles form submit event
var taskFormHandler = function(event) {
    // Prevent page refresh
    event.preventDefault();

    // Load form input
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // Load object with form input
    var taskDataObject = {
        name: taskNameInput,
        type: taskTypeInput
    }

    createTaskEl(taskDataObject);
}

// Adds task to list (window)
var createTaskEl = function(taskDataObj) {
    // Create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    
    // Create div to hold task info add to list item
    var taskInfoEl = document.createElement("div");
    // Assign class name for styling
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span";

    // Append div to li
    listItemEl.appendChild(taskInfoEl);

    // Append li to ul
    tasksToDoEl.appendChild(listItemEl);

}

formEl.addEventListener("submit", taskFormHandler);