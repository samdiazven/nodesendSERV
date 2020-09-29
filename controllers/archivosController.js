const multer = require('multer');
const shortid = require('shortid');
const Enlaces = require('../models/Enlace');
const fs = require('fs');



exports.subirArchivo = async(req, res, next) =>{
const configMulter = {
  limits : {filesize: req.usuario ? 10000000 : 1000000},
  storage: fileStorage = multer.diskStorage({
      destination: (req, file, cb) =>{
	cb(null, __dirname+'/../uploads')
      },
      filename: (req, file, cb) =>{
	const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
	cb(null, `${shortid.generate()}${extension}`);

      }
  })

}
const upload = multer(configMulter).single('archivo');

  upload(req, res, async(error) =>{
  console.log(req.file);
      if(!error){
	  res.json({archivo: req.file.filename});
      }else{
	console.log(error);
	return next();
      }
  })
}

exports.eliminarArchivo = async(req, res)=>{
    
  try{
      fs.unlinkSync(__dirname+`/../uploads/${req.archivo}`);
      console.log('archivo eliminado');
  }catch(error){
    console.error(error);

  }
}

exports.descargaArchivo = async (req, res, next) =>{
  const {archivo} = req.params;
  const enlace = await Enlaces.findOne({nombre: archivo});  


  const archivodescarga = __dirname + '/../uploads/' + archivo;
  res.download(archivodescarga);

//Si las descargas son iguales a 1 borrar la entrada y el archivo
  const {descargas, nombre} = enlace;
  if(descargas === 1){
    req.archivo = nombre;

    //Eliminar entrada de la base de datos
    await Enlaces.findOneAndRemove(enlace.id);

    //Pasar al siguiente controladir
    next();
  }else{
    enlace.descargas--;
    await enlace.save();
  }
}