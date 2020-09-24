const Enlaces = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

exports.nuevoEnlace = async (req, res, next)=>{
  ///Revisar si hay errores
  const errores = validationResult(req);
  if(!errores.isEmpty()){
   return res.status(400).json({errores: errores.array()});   
  }


  ///Almacenar Datos
  const {nombre_original, password} = req.body;
  
  const enlace =  new Enlaces();
  enlace.url = shortid.generate();
  enlace.nombre =  shortid.generate();
  enlace.password = password;
  enlace.nombre_original = nombre_original;

  if(req.usuario){
      const {password, descargas} = req.body;
      
      //Asignar a enlace el numero de Descargas
      if(descargas){
	enlace.descargas = descargas;
	if(password){
	  const salt = await bcrypt.genSalt(10);
	  
	  enlace.password = await bcrypt.hash(password, salt);
	}
      }
    enlace.autor = req.usuario.id;
  }
    try{
      await enlace.save();
      res.json({msg: `${enlace.url}`});
    }catch(error){
      console.error(error);
      res.json({msg: 'Hubo un Problemaaa...'});
    }
}

exports.obtenerEnlace = async (req, res, next)=>{
    
  //Verificar el enlace
  const enlace = await Enlaces.findOne({url: req.params.url});
  if(!enlace){
    res.status(404).json({msg: "Ese enlace no existe"});
    return next();
  }
  res.json({archivo: enlace.nombre});

  //Si las descargas son iguales a 1 borrar la entrada y el archivo
  const {descargas, nombre} = enlace;
  if(descargas === 1){
    req.archivo = nombre;

    //Eliminar entrada de la base de datos
    await Enlaces.findOneAndRemove(req.params.url);

    //Pasar al siguiente controladir
    next();
  }else{
    enlace.descargas--;
    await enlace.save();
  }

  //Restarle un numero a las descargas
}
