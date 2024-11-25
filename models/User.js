// models/User.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
// Configurar la ruta de la base de datos según el entorno
const dbPath = process.env.NODE_ENV === 'production'
  ? path.join('/opt/render/project/data', 'db.sqlite3')
  : path.join(__dirname, '..', 'db.sqlite3');

console.log('Ruta de la base de datos:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});
// Crear la tabla si no existe
db.serialize(() => { 
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      username TEXT,
      password TEXT,
      email TEXT,
      imagen TEXT,
      rol TEXT,
      updatedAt DATETIME
    )
  `);
});

module.exports = db;
