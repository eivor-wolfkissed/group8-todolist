document.addEventListener('DOMContentLoaded', function () {
    loadTasksFromLocalStorage();
    refreshTasksEvery20Sec(); // Start the refresh timer
});

// Handle new task addition
document.getElementById('new-daily-task-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var taskInput = document.getElementById('new-daily-task-input');
    var taskValue = taskInput.value.trim();

    if (taskValue === "") {
        return; // Prevent empty tasks
    }

    addTask(taskValue);
    saveTaskToLocalStorage(taskValue);

    taskInput.value = ""; // Clear the input field
});

// Add task to the list
function addTask(taskValue, streak = 0) {
    var ul = document.getElementById('ul-el');
    var li = document.createElement('li');

    var taskText = document.createElement('span');
    taskText.textContent = `${taskValue} (Streak: ${streak})`;
    taskText.className = 'task-text';

    var completeButton = document.createElement('button');
    completeButton.id = 'complete';
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeButton.addEventListener('click', function () {
        streak++;
        taskText.textContent = `${taskValue} (Streak: ${streak})`;
        saveTaskToLocalStorage(taskValue, streak);
        if (streak >= 2) {
            li.style.textDecoration = 'line-through'; // Mark as completed after 2 completions
        }
    });

    var deleteButton = document.createElement('button');
    deleteButton.id = 'delete';
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteButton.addEventListener('click', function () {
        ul.removeChild(li);
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

// Save task and streak to localStorage
function saveTaskToLocalStorage(taskValue, streak = 0) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.name === taskValue);
    if (taskIndex !== -1) {
        tasks[taskIndex].streak = streak;
    } else {
        tasks.push({ name: taskValue, streak: streak });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove task from localStorage
function removeTaskFromLocalStorage(taskValue) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.name !== taskValue);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTask(task.name, task.streak));
}

// Refresh tasks every 20 seconds
function refreshTasksEvery20Sec() {
    setInterval(() => {
        document.getElementById('ul-el').innerHTML = ''; // Clear current list
        loadTasksFromLocalStorage(); // Reload from localStorage
    }, 20000); // 20 seconds in milliseconds
}