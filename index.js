const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');


///Crear el servidor

const app = express();

//Conectar a la DB

  conectarDB();

  app.use(cors());
//Puerto de la app

const port = process.env.PORT || 4000;
//Habilitar Json
app.use(express.json());

//////Habilitar carpeta publica
app.use(express.static('uploads'));
////Rutas de la app

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

//Levantar el servidor

app.listen(port, '0.0.0.0', () =>{

      console.log(`El servidor esta funcionando en el puerto ${port}`);
})
