document.addEventListener('DOMContentLoaded', function() {
    loadTasksFromLocalStorage();
});

document.getElementById('new-daily-task-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    var taskInput = document.getElementById('new-daily-task-input');
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

    li.appendChild(taskText);
    li.appendChild(actionButtons);
    ul.appendChild(li);
}

function saveTaskToLocalStorage(taskValue) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(taskValue);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskValue) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task !== taskValue);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTask(task));
}
