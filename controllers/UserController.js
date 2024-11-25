const multer = require('multer');
const path = require('path');
const UserService = require('../services/UserService');

// Configuración actualizada de multer para manejar las subidas de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Usar ruta condicional según el entorno
    const uploadPath = process.env.NODE_ENV === 'production'
      ? path.join('/opt/render/project/data', 'uploads')
      : 'uploads/';
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Mantener la extensión original del archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Filtro para validar tipos de archivos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  }
});

class UserController {
  static index(req, res) {
    UserService.getAllUsers((err, users) => {
      if (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).render('error', { 
          message: 'Error al cargar usuarios' 
        });
      }
      res.render('users/index', { users });
    });
  }

  static create(req, res) {
    res.render('users/create');
  }

  static store(req, res) {
    try {
      const imagePath = req.file 
        ? path.join(
            process.env.NODE_ENV === 'production' ? '/opt/render/project/data' : '',
            'uploads',
            req.file.filename
          )
        : null;

      const user = {
        ...req.body,
        imagen: imagePath,
        updatedAt: new Date()
      };

      UserService.createUser(user, (err) => {
        if (err) {
          console.error('Error al crear usuario:', err);
          return res.status(500).render('error', { 
            message: 'Error al crear usuario' 
          });
        }
        res.redirect('/');
      });
    } catch (error) {
      console.error('Error en store:', error);
      res.status(500).render('error', { 
        message: 'Error al procesar la solicitud' 
      });
    }
  }

  static show(req, res) {
    const id = req.params.id;
    UserService.getUserById(id, (err, user) => {
      if (err) {
        console.error('Error al obtener usuario:', err);
        return res.status(500).render('error', { 
          message: 'Error al cargar usuario' 
        });
      }
      if (!user) {
        return res.status(404).render('error', { 
          message: 'Usuario no encontrado' 
        });
      }
      res.render('users/show', { user });
    });
  }

  static edit(req, res) {
    const id = req.params.id;
    UserService.getUserById(id, (err, user) => {
      if (err) {
        console.error('Error al obtener usuario:', err);
        return res.status(500).render('error', { 
          message: 'Error al cargar usuario' 
        });
      }
      if (!user) {
        return res.status(404).render('error', { 
          message: 'Usuario no encontrado' 
        });
      }
      res.render('users/edit', { user });
    });
  }

  static update(req, res) {
    const id = req.params.id;
    try {
      const imagePath = req.file 
        ? path.join(
            process.env.NODE_ENV === 'production' ? '/opt/render/project/data' : '',
            'uploads',
            req.file.filename
          )
        : req.body.oldImagen;

      const user = {
        ...req.body,
        imagen: imagePath,
        updatedAt: new Date()
      };

      UserService.updateUser(id, user, (err) => {
        if (err) {
          console.error('Error al actualizar usuario:', err);
          return res.status(500).render('error', { 
            message: 'Error al actualizar usuario' 
          });
        }
        res.redirect(`/users/${id}`);
      });
    } catch (error) {
      console.error('Error en update:', error);
      res.status(500).render('error', { 
        message: 'Error al procesar la solicitud' 
      });
    }
  }

  static delete(req, res) {
    const id = req.params.id;
    UserService.deleteUser(id, (err) => {
      if (err) {
        console.error('Error al eliminar usuario:', err);
        return res.status(500).render('error', { 
          message: 'Error al eliminar usuario' 
        });
      }
      res.redirect('/users');
    });
  }

  // Método auxiliar para servir imágenes
  static getImage(req, res) {
    const imagePath = path.join(
      process.env.NODE_ENV === 'production' 
        ? '/opt/render/project/data/uploads' 
        : path.join(__dirname, '..', 'uploads'),
      req.params.filename
    );

    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error('Error al servir imagen:', err);
        res.status(404).send('Imagen no encontrada');
      }
    });
  }
}

module.exports = { UserController, upload };