const Usuario = require('../models/Usuarios');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

exports.nuevoUsuario = async(req, res) =>{

  ///Mostrar mensajes de error
  const errores = validationResult(req);
  if(!errores.isEmpty()){
   return res.status(400).json({errores: errores.array()});   
  }

  ///Verificar si usuario fue duplicado

  const {email, password} = req.body;
  let usuario = await Usuario.findOne({email});
  
  if(usuario){
    return res.status(400).json({msg: "El usuario ya fue registrado"});
  }
  usuario = new Usuario(req.body);
    //Hashear Password
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);   
  try{
    //Crear Usuario
  await usuario.save();
  res.status(201).json({msg: "Usuario Creado Correctamente"});

  }catch(error){
    res.status(400).json({msg: "Hubo un error"});
    }
  }
