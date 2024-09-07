const express = require('express');
const router = express.Router();
const db = require('../database');

// Récupérer toutes les tâches
router.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks WHERE archived = 0', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Créer une nouvelle tâche
router.post('/tasks', (req, res) => {
  const { content } = req.body;
  db.run('INSERT INTO tasks (content) VALUES (?)', [content], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, content, completed: false, archived: false });
  });
});

// Marquer une tâche comme terminée
router.put('/tasks/:id/complete', (req, res) => {
  const { id } = req.params;
  db.run('UPDATE tasks SET completed = 1 WHERE id = ?', id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Tâche marquée comme terminée' });
  });
});

// Archiver une tâche
router.put('/tasks/:id/archive', (req, res) => {
  const { id } = req.params;
  db.run('UPDATE tasks SET archived = 1 WHERE id = ?', id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Tâche archivée' });
  });
});

// Récupérer toutes les commandes
router.get('/commands', (req, res) => {
  db.all('SELECT * FROM commands', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Ajouter une nouvelle commande
router.post('/commands', (req, res) => {
  const { name, description } = req.body;
  db.run('INSERT INTO commands (name, description) VALUES (?, ?)', [name, description], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, description });
  });
});

module.exports = router;