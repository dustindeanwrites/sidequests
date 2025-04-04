let turns = localStorage.getItem('turns') ? parseInt(localStorage.getItem('turns')) : 0;
let tasks = JSON.parse(localStorage.getItem('tasks')) || { today: [], week: [], month: [], year: [], completed: [] };

function updateTurns() {
    document.getElementById('turns-count').textContent = turns;
    localStorage.setItem('turns', turns);
}

function loadTasks() {
    ['today', 'week', 'month', 'year'].forEach(category => {
        const list = document.getElementById(`${category}-list`);
        list.innerHTML = '';
        tasks[category].forEach(task => {
            const taskItem = createTaskElement(task, category);
            list.appendChild(taskItem);
        });
    });
}

function createTaskElement(task, category) {
    const taskItem = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => handleTaskCompletion(task, category, checkbox));

    const text = document.createTextNode(task.text);

    taskItem.appendChild(checkbox);
    taskItem.appendChild(text);

    return taskItem;
}

function addTask(category) {
    const taskText = prompt('Enter task:');
    if (taskText) {
        const newTask = { text: taskText, completed: false };
        tasks[category].push(newTask);
        saveTasks();
        loadTasks();
    }
}

function handleTaskCompletion(task, category, checkbox) {
    if (checkbox.checked) {
        turns += 1;
        task.completed = true;

        // Move completed task to 'completed' section
        tasks.completed.push(task);

        // If there are more than 20 completed tasks, remove the oldest
        if (tasks.completed.length > 20) {
            tasks.completed.shift();
        }

        tasks[category] = tasks[category].filter(t => t !== task);
    } else {
        turns -= 1;
        task.completed = false;

        // Move task back to original category
        tasks[category].push(task);
        tasks.completed = tasks.completed.filter(t => t !== task);
    }

    saveTasks();
    updateTurns();
    loadTasks();
}

function subtractTurns() {
    const amount = prompt('How many turns to subtract?');
    if (amount && !isNaN(amount) && amount > 0) {
        turns = Math.max(turns - parseInt(amount), 0);
        updateTurns();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleCompletedSection() {
    const completedList = document.getElementById('completed-list');
    const collapsible = document.querySelector('.collapsible');

    // Toggle display of completed section
    if (completedList.style.display === 'none') {
        completedList.style.display = 'block';
        loadCompletedTasks();
    } else {
        completedList.style.display = 'none';
    }
}

function loadCompletedTasks() {
    const completedList = document.getElementById('completed-list');
    completedList.innerHTML = '';

    tasks.completed.forEach(task => {
        const taskItem = createTaskElement(task, 'completed');
        completedList.appendChild(taskItem);
    });
}

loadTasks();
updateTurns();
