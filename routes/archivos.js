const express = require('express');
const router = express.Router();
const archivosController = require('../controllers/archivosController');
const auth = require('../middlewares/auth');


router.post('/', 
  archivosController.subirArchivo

);


router.get('/:archivo',
  archivosController.descargaArchivo,
  archivosController.eliminarArchivo

);


module.exports = router;
