document.addEventListener('DOMContentLoaded', function() {
    loadTasksFromLocalStorage();
});

document.getElementById('new-task-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    var taskInput = document.getElementById('new-task-input');
    var taskValue = taskInput.value.trim(); // Get and trim the input value

    if (taskValue === "") {
        return; // Do not add empty tasks
    }

    addTask(taskValue);
    saveTaskToLocalStorage(taskValue);

    taskInput.value = ""; // Clear the input field
});

function addTask(taskValue) {
    var ul = document.getElementById('ul-el');
    var li = document.createElement('li');

    var taskText = document.createElement('span');
    taskText.textContent = taskValue;
    taskText.className = 'task-text';

    var arrowButton = document.createElement('button');
    arrowButton.id = 'arrow';
    arrowButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    
    var subtaskList = document.createElement('ul');
    subtaskList.className = 'subtask-list';
    subtaskList.style.display = 'none'; // Hidden initially

    arrowButton.addEventListener('click', function() {
        subtaskList.style.display = subtaskList.style.display === 'none' ? 'block' : 'none';
    });

    var completeButton = document.createElement('button');
    completeButton.id = 'complete';
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeButton.addEventListener('click', function() {
        li.style.textDecoration = 'line-through'; // Mark as completed
    });

    var deleteButton = document.createElement('button');
    deleteButton.id = 'delete';
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteButton.addEventListener('click', function() {
        ul.removeChild(li); // Remove the task
        removeTaskFromLocalStorage(taskValue);
    });

    var actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';
    actionButtons.appendChild(completeButton);
    actionButtons.appendChild(deleteButton);
    actionButtons.appendChild(arrowButton);

    li.appendChild(taskText);
    li.appendChild(actionButtons);
    li.appendChild(subtaskList); // Subtask list will be added here
    ul.appendChild(li);

    // Create the "Add Subtask" button
    var addSubtaskButton = document.createElement('button');
    addSubtaskButton.textContent = 'Add Subtask';
    addSubtaskButton.className = 'addsubtask-button'

    // Listen to the click event to add a new subtask using the input field
    addSubtaskButton.addEventListener('click', function() {
        var subtaskInput = document.getElementById('new-task-input').value.trim(); // Get the input value from the input field
        if (subtaskInput !== "") { // Only add non-empty subtasks
            addSubtask(subtaskList, subtaskInput, taskValue); // Add the subtask
            document.getElementById('new-task-input').value = ""; // Clear the input field after adding
        }
    });

    // Add the "Add Subtask" button to the subtask list
    subtaskList.appendChild(addSubtaskButton);
}

function addSubtask(subtaskList, subtaskInput, taskValue) {
    var subtaskLi = document.createElement('li');
    subtaskLi.textContent = subtaskInput;

    var subtaskCompleteButton = document.createElement('button');
    subtaskCompleteButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    subtaskCompleteButton.addEventListener('click', function() {
        subtaskLi.style.textDecoration = 'line-through';
    });

    var subtaskDeleteButton = document.createElement('button');
    subtaskDeleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    subtaskDeleteButton.addEventListener('click', function() {
        subtaskList.removeChild(subtaskLi);
    });

    var actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';
    actionButtons.appendChild(subtaskCompleteButton);
    actionButtons.appendChild(subtaskDeleteButton);

    subtaskLi.appendChild(actionButtons);
    subtaskList.appendChild(subtaskLi);

    saveSubtaskToLocalStorage(taskValue, subtaskInput);
}

function saveSubtaskToLocalStorage(taskValue, subtask) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        if (task.name === taskValue) {
            task.subtasks = task.subtasks || [];
            task.subtasks.push(subtask);
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveTaskToLocalStorage(taskValue) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ name: taskValue, subtasks: [] });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTask(task.name);
        task.subtasks.forEach(subtask => {
            var subtaskList = document.querySelector(`li:contains('${task.name}') .subtask-list`);
            addSubtask(subtaskList, subtask, task.name);
        });
    });
}

