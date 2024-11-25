const fs = require('fs');
const path = require('path');

// Función para copiar la base de datos
function copyDatabase() {
  const sourceDB = path.join(__dirname, '..', 'db.sqlite3');
  const targetDir = '/etc/secrets';
  const targetDB = path.join(targetDir, 'db.sqlite3');

  try {
    // Asegurarse de que el directorio existe
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Copiar la base de datos
    fs.copyFileSync(sourceDB, targetDB);
    console.log('Base de datos copiada exitosamente');
  } catch (error) {
    console.error('Error copiando la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar si estamos en producción
if (process.env.NODE_ENV === 'production') {
  copyDatabase();
}