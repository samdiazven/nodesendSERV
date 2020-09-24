const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const {check} = require('express-validator');

router.post('/', 
  [
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    check('email', 'Agrega un email valido.' ).isEmail(),
    check('password', 'El password debe ser al menos de 6 Caracteres').isLength({min: 6}),
  ],
  usuarioController.nuevoUsuario
);

module.exports = router;
