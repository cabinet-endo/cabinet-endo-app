// Fonction pour charger les commandes depuis le serveur
async function loadCommands() {
    const response = await fetch('/api/commands');
    const commands = await response.json();
    const commandList = document.getElementById('command-list');
    commandList.innerHTML = '';
    commands.forEach(command => {
        const li = document.createElement('li');
        li.textContent = `${command.name}: ${command.description}`;
        commandList.appendChild(li);
    });
}

// Fonction pour ajouter une nouvelle commande
async function addCommand(event) {
    event.preventDefault();
    const nameInput = document.getElementById('command-name');
    const descriptionInput = document.getElementById('command-description');
    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (name && description) {
        const response = await fetch('/api/commands', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description }),
        });
        if (response.ok) {
            nameInput.value = '';
            descriptionInput.value = '';
            loadCommands();
        }
    }
}

// Fonction pour charger l'historique des tâches
async function loadTaskHistory() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    const taskHistoryList = document.getElementById('task-history-list');
    taskHistoryList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.content} - ${task.completed ? 'Terminée' : 'En cours'} - Créée le ${new Date(task.created_at).toLocaleString()}`;
        taskHistoryList.appendChild(li);
    });
}

// Écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    loadCommands();
    loadTaskHistory();
    document.getElementById('add-command-form').addEventListener('submit', addCommand);
});

// Fonction pour rafraîchir l'historique des tâches toutes les 30 secondes
setInterval(loadTaskHistory, 30000);