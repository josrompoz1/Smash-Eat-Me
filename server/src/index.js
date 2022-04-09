const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const events = require('./events');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'smashdb',
  password : 'password',
  database : 'smashdb'
});

connection.connect(function(err) {
  if(err) throw err;
  var queries = ["DROP TABLE IF EXISTS productoofertadopedido;",
                "DROP TABLE IF EXISTS productoofertado;",
                "DROP TABLE IF EXISTS tarjeta;",
                "DROP TABLE IF EXISTS direccion;",
                "DROP TABLE IF EXISTS mesa;",
                "DROP TABLE IF EXISTS menu;",
                "DROP TABLE IF EXISTS pedidocomida;",
                "DROP TABLE IF EXISTS valoracion;",
                "DROP TABLE IF EXISTS usuario;",
                "DROP TABLE IF EXISTS cupondescuento;",
                "DROP TABLE IF EXISTS productopedido;",
                "DROP TABLE IF EXISTS paso;",
                "DROP TABLE IF EXISTS solucion;",
                "DROP TABLE IF EXISTS reto;",
                "CREATE TABLE Usuario (id INT AUTO_INCREMENT, username VARCHAR(50) NOT NULL, nombre VARCHAR(255) NOT NULL, correo VARCHAR(100) NOT NULL, contraseña VARCHAR(255) NOT NULL, telefono INT, tipo ENUM('ADMIN','NO ADMIN') NOT NULL, creditoDigital FLOAT DEFAULT 0.0, PRIMARY KEY(id));",
                "CREATE TABLE Tarjeta (id INT AUTO_INCREMENT, numero VARCHAR(20) NOT NULL, expiracion DATE NOT NULL, usuarioId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id));",
                "CREATE TABLE Direccion (id INT AUTO_INCREMENT, nombreDireccion VARCHAR(50) NOT NULL, direccion VARCHAR(200) NOT NULL, pais VARCHAR(50) NOT NULL, ciudad VARCHAR(100) NOT NULL, usuarioId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id));",
                "CREATE TABLE CuponDescuento (id INT AUTO_INCREMENT, codigo VARCHAR(255) NOT NULL, porcentaje INT NOT NULL, PRIMARY KEY(id));",
                "CREATE TABLE ProductoPedido (id INT AUTO_INCREMENT, cantidad INT NOT NULL, PRIMARY KEY(id));",
                "CREATE TABLE PedidoComida (id INT AUTO_INCREMENT, metodoPago ENUM('Tarjeta','Cartera digital'), fecha DATE NOT NULL, hora TIME NOT NULL, estado ENUM('Pagado','En preparacion','En transito','Entregado'), usuarioId INT NOT NULL, productoPedidoId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id), FOREIGN KEY (productoPedidoId) REFERENCES ProductoPedido(id));",
                "CREATE TABLE Valoracion (id INT AUTO_INCREMENT, puntuacion INT NOT NULL, reseña TEXT, usuarioId INT NOT NULL, productoPedidoId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id), FOREIGN KEY (productoPedidoId) REFERENCES ProductoPedido(id));",
                "CREATE TABLE Menu (id INT AUTO_INCREMENT, nombre VARCHAR(100) NOT NULL, descripcion TEXT NOT NULL, PRIMARY KEY(id));",
                "CREATE TABLE ProductoOfertado (id INT AUTO_INCREMENT, nombre VARCHAR(255) NOT NULL, descripcion VARCHAR(255) NOT NULL, imagen BLOB, precio FLOAT NOT NULL, tipo ENUM('Entremes','Plato','Postre','Bebida') NOT NULL, menuId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (menuId) REFERENCES Menu(id));",
                "CREATE TABLE ProductoOfertadoPedido (id INT AUTO_INCREMENT, productoOfertadoId INT, productoPedidoId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (productoOfertadoId) REFERENCES ProductoOfertado(id), FOREIGN KEY (productoPedidoId) REFERENCES ProductoPedido(id))",
                "CREATE TABLE Mesa (id INT AUTO_INCREMENT, numeroPersonas INT NOT NULL, fecha DATE NOT NULL, hora TIME NOT NULL, usuarioId INT NOT NULL, menuId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id), FOREIGN KEY (menuId) REFERENCES Menu(id));",
                "CREATE TABLE Reto (id INT AUTO_INCREMENT, nombre VARCHAR(30) NOT NULL, descripcion VARCHAR(255) NOT NULL, categoria ENUM('Inyeccion de codigo','Criptografia','Autenticacion e identificacion','Control de acceso') NOT NULL, dificultad INT NOT NULL, completado BOOLEAN NOT NULL DEFAULT false, PRIMARY KEY(id));",
                "CREATE TABLE Solucion (id INT AUTO_INCREMENT, tipo ENUM('Interactiva','No interactiva') NOT NULL, retoId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (retoId) REFERENCES Reto(id));",
                "CREATE TABLE Paso (id INT AUTO_INCREMENT, numero INT NOT NULL, descripcion VARCHAR(255) NOT NULL, solucion TEXT NOT NULL, solucionId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (solucionId) REFERENCES Solucion(id));",
                "INSERT INTO Usuario (username,nombre,correo,contraseña,telefono,tipo,creditoDigital) VALUES ('perico','Pepe Rico','perico@gmail.com','asd1234','666777888','ADMIN',20.5)"];
  queries.forEach(function(q) {
    connection.query(q, function (err, result) {
      if(err) throw err;
    });
  });
  console.log("Tables created!");
});

const port = process.env.PORT || 8080;

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(events(connection));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});