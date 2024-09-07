const socket = io();

// Fonction pour charger les commandes depuis le serveur
async function loadCommands() {
    const response = await fetch('/api/commands');
    const commands = await response.json();
    const commandButtons = document.getElementById('command-buttons');
    commandButtons.innerHTML = '';
    commands.forEach(command => {
        const button = document.createElement('button');
        button.textContent = command.name;
        button.onclick = () => sendCommand(command.name);
        commandButtons.appendChild(button);
    });
}

// Fonction pour envoyer une commande
function sendCommand(commandName) {
    socket.emit('send_command', { command: commandName });
}

// Fonction pour charger les tâches depuis le serveur
async function loadTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.content;
        if (task.completed) {
            li.classList.add('completed');
        }
        taskList.appendChild(li);
    });
}

// Fonction pour ajouter une nouvelle tâche
async function addTask(event) {
    event.preventDefault();
    const newTaskInput = document.getElementById('new-task');
    const content = newTaskInput.value.trim();
    if (content) {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });
        if (response.ok) {
            newTaskInput.value = '';
            loadTasks();
        }
    }
}

// Écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    loadCommands();
    loadTasks();
    document.getElementById('add-task-form').addEventListener('submit', addTask);
});

// Mise à jour des tâches en temps réel
socket.on('update_task', () => {
    loadTasks();
});