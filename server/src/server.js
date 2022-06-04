const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const productos = require('./controllers/productosRouter');
const usuarios = require('./controllers/usuariosRouter');
const cupones = require('./controllers/cuponesDescuentoRouter');
const retos = require('./controllers/retosRouter');
const mesas = require('./controllers/mesaRouter');
const pedidos = require('./controllers/pedidosRouter');
const valoraciones = require('./controllers/valoracionRouter');
const login = require('./controllers/loginRouter');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'smashdb'
});

connection.connect(function(err) {
  if(err) throw err;
  console.log("Tables created!");
});

const port = process.env.PORT || 8080;

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(productos(connection))
  .use(usuarios(connection))
  .use(cupones(connection))
  .use(retos(connection))
  .use(mesas(connection))
  .use(pedidos(connection))
  .use(valoraciones(connection))
  .use(login(connection));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});