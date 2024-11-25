const fs = require('fs');
const path = require('path');

function copyDatabase() {
  try {
    // Cambiar la ruta de destino
    const sourceDB = path.join(__dirname, '..', 'db.sqlite3');
    const targetDir = '/opt/render/project/data';
    const targetDB = path.join(targetDir, 'db.sqlite3');
    
    // Verificar si existe el directorio de destino
    if (!fs.existsSync(targetDir)) {
      console.log('Creando directorio destino...');
      fs.mkdirSync(targetDir, { recursive: true });
      console.log('Directorio creado:', targetDir);
    }

    // Crear directorio de uploads
    const uploadsDir = path.join(targetDir, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      console.log('Creando directorio uploads...');
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Directorio uploads creado:', uploadsDir);
    }

    // Copiar base de datos
    console.log('Copiando base de datos...');
    fs.copyFileSync(sourceDB, targetDB);
    console.log('Base de datos copiada exitosamente a:', targetDB);

    // Copiar contenido de uploads
    const sourceUploads = path.join(__dirname, '..', 'uploads');
    if (fs.existsSync(sourceUploads)) {
      console.log('Copiando archivos de uploads...');
      fs.readdirSync(sourceUploads).forEach(file => {
        const sourcePath = path.join(sourceUploads, file);
        const targetPath = path.join(uploadsDir, file);
        fs.copyFileSync(sourcePath, targetPath);
      });
      console.log('Archivos de uploads copiados exitosamente');
    }

  } catch (error) {
    console.error('Error durante la copia:', error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV === 'production') {
  console.log('Iniciando proceso de copia en producción...');
  copyDatabase();
} else {
  console.log('Ejecutando en desarrollo, no se requiere copia');
}