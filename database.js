const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./cabinet_dentaire.db', (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données', err.message);
  } else {
    console.log('Connecté à la base de données SQLite');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      archived BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS commands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    )`);

    // Insérer les commandes prédéfinies
    const defaultCommands = [
      { name: "Apporter prochain patient", description: "Faire entrer le patient suivant" },
      { name: "Faire le ciment", description: "Préparer le ciment pour le soin" },
      { name: "Débarrasser", description: "Nettoyer et ranger le matériel utilisé" },
      { name: "Besoin d'aide au fauteuil", description: "Assistance requise pendant le soin" }
    ];

    const insertCommand = db.prepare('INSERT OR IGNORE INTO commands (name, description) VALUES (?, ?)');
    defaultCommands.forEach(cmd => {
      insertCommand.run(cmd.name, cmd.description);
    });
    insertCommand.finalize();
  });
}

module.exports = db;