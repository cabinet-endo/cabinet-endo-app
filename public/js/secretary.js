const socket = io();

let notificationSound = new Audio('/sounds/beep.mp3');
let notificationColor = '#ff0000';

// Fonction pour afficher une notification
function showNotification(message) {
    const notificationArea = document.getElementById('notification-area');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.style.backgroundColor = notificationColor;
    notification.textContent = message;
    notificationArea.appendChild(notification);
    notificationSound.play();
    
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Tâche accomplie';
    completeButton.onclick = () => {
        notificationArea.removeChild(notification);
        socket.emit('task_completed', { task: message });
    };
    notification.appendChild(completeButton);
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
        } else {
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Terminer';
            completeButton.onclick = () => completeTask(task.id);
            li.appendChild(completeButton);
        }
        taskList.appendChild(li);
    });
}

// Fonction pour marquer une tâche comme terminée
async function completeTask(taskId) {
    const response = await fetch(`/api/tasks/${taskId}/complete`, { method: 'PUT' });
    if (response.ok) {
        loadTasks();
        socket.emit('task_completed', { taskId });
    }
}

// Fonction pour sauvegarder les paramètres de notification
function saveNotificationSettings(event) {
    event.preventDefault();
    const soundSelect = document.getElementById('notification-sound');
    const colorInput = document.getElementById('notification-color');
    
    notificationSound = new Audio(`/sounds/${soundSelect.value}.mp3`);
    notificationColor = colorInput.value;
    
    localStorage.setItem('notificationSound', soundSelect.value);
    localStorage.setItem('notificationColor', notificationColor);
}

// Écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('notification-settings').addEventListener('submit', saveNotificationSettings);
    
    // Charger les paramètres sauvegardés
    const savedSound = localStorage.getItem('notificationSound');
    const savedColor = localStorage.getItem('notificationColor');
    if (savedSound) {
        document.getElementById('notification-sound').value = savedSound;
        notificationSound = new Audio(`/sounds/${savedSound}.mp3`);
    }
    if (savedColor) {
        document.getElementById('notification-color').value = savedColor;
        notificationColor = savedColor;
    }
});

// Écouter les nouvelles commandes
socket.on('new_command', (data) => {
    showNotification(data.command);
});

// Mise à jour des tâches en temps réel
socket.on('update_task', () => {
    loadTasks();
});