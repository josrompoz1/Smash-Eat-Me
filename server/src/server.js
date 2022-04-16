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
                "DROP TABLE IF EXISTS valoracion;",                
                "DROP TABLE IF EXISTS cupondescuento;",
                "DROP TABLE IF EXISTS productopedido;",
                "DROP TABLE IF EXISTS pedidocomida;",
                "DROP TABLE IF EXISTS usuario;",
                "DROP TABLE IF EXISTS paso;",
                "DROP TABLE IF EXISTS solucion;",
                "DROP TABLE IF EXISTS reto;",
                "CREATE TABLE Usuario (id INT AUTO_INCREMENT, username VARCHAR(50) NOT NULL, nombre VARCHAR(255) NOT NULL, correo VARCHAR(100) NOT NULL, contraseña VARCHAR(255) NOT NULL, telefono INT, tipo ENUM('ADMIN','NO ADMIN') NOT NULL DEFAULT 'NO ADMIN', creditoDigital FLOAT DEFAULT 0.0, PRIMARY KEY(id));",
                "CREATE TABLE Tarjeta (id INT AUTO_INCREMENT, numero VARCHAR(20) NOT NULL, expiracion DATE NOT NULL, usuarioId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE);",
                "CREATE TABLE Direccion (id INT AUTO_INCREMENT, nombreDireccion VARCHAR(50) NOT NULL, direccion VARCHAR(200) NOT NULL, pais VARCHAR(50) NOT NULL, ciudad VARCHAR(100) NOT NULL, usuarioId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE);",
                "CREATE TABLE CuponDescuento (id INT AUTO_INCREMENT, codigo VARCHAR(255) NOT NULL, porcentaje INT NOT NULL, PRIMARY KEY(id));",
                "CREATE TABLE PedidoComida (id INT AUTO_INCREMENT, metodoPago ENUM('Tarjeta','Cartera digital'), fecha DATE NOT NULL, hora TIME NOT NULL, estado ENUM('Pagado','En preparacion','En transito','Entregado') DEFAULT 'Pagado', usuarioId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE);",
                "CREATE TABLE ProductoPedido (id INT AUTO_INCREMENT, cantidad INT NOT NULL, pedidoId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (pedidoId) REFERENCES PedidoComida(id));",
                "CREATE TABLE Valoracion (id INT AUTO_INCREMENT, puntuacion INT NOT NULL, reseña TEXT, usuarioId INT NOT NULL, productoPedidoId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE, FOREIGN KEY (productoPedidoId) REFERENCES ProductoPedido(id));",
                "CREATE TABLE Menu (id INT AUTO_INCREMENT, nombre VARCHAR(100) NOT NULL, descripcion TEXT NOT NULL, PRIMARY KEY(id));",
                "CREATE TABLE ProductoOfertado (id INT AUTO_INCREMENT, nombre VARCHAR(255) NOT NULL, descripcion VARCHAR(255) NOT NULL, imagen TEXT NOT NULL, precio FLOAT NOT NULL, tipo ENUM('Entremes','Plato','Postre','Bebida') NOT NULL, menuId INT, PRIMARY KEY(id), FOREIGN KEY (menuId) REFERENCES Menu(id));",
                "CREATE TABLE ProductoOfertadoPedido (id INT AUTO_INCREMENT, productoOfertadoId INT, productoPedidoId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (productoOfertadoId) REFERENCES ProductoOfertado(id), FOREIGN KEY (productoPedidoId) REFERENCES ProductoPedido(id))",
                "CREATE TABLE Mesa (id INT AUTO_INCREMENT, numeroPersonas INT NOT NULL, fecha DATE NOT NULL, hora TIME NOT NULL, usuarioId INT NOT NULL, menuId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE, FOREIGN KEY (menuId) REFERENCES Menu(id));",
                "CREATE TABLE Reto (id INT AUTO_INCREMENT, nombre VARCHAR(30) NOT NULL, descripcion VARCHAR(255) NOT NULL, categoria ENUM('Inyeccion de codigo','Criptografia','Autenticacion e identificacion','Control de acceso') NOT NULL, dificultad INT NOT NULL, completado BOOLEAN NOT NULL DEFAULT FALSE, PRIMARY KEY(id));",
                "CREATE TABLE Solucion (id INT AUTO_INCREMENT, tipo ENUM('Interactiva','No interactiva') NOT NULL, retoId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (retoId) REFERENCES Reto(id));",
                "CREATE TABLE Paso (id INT AUTO_INCREMENT, numero INT NOT NULL, solucion TEXT NOT NULL, solucionId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (solucionId) REFERENCES Solucion(id));",
                "INSERT INTO Menu (nombre, descripcion) VALUES ('Mediterraneo','Menu de la dieta mediterranea')",
                "INSERT INTO Menu (nombre, descripcion) VALUES ('Asiatico','Menu de la dieta asiatica')",
                "INSERT INTO Menu (nombre, descripcion) VALUES ('Sin menú','Los comensales pedirán a la carta')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Tortilla de papas', 'Tortilla española de patatas de la huerta',5.3,'https://recetasdecocina.elmundo.es/wp-content/uploads/2021/01/tortilla-de-patatas-rellena.jpg','Plato',1)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Tarta de la abuela', 'Tarda de galleta con natilla de chocolate',4.0,'https://recetasdecocina.elmundo.es/wp-content/uploads/2020/02/receta-tarta-de-galletas-y-chocolate.jpg','Postre')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Ensaladilla', 'Ensalada de patatas, mayonesa, huevo y atún',3.8,'https://www.hogarmania.com/archivos/201906/ensaladilla-rusa-xl-668x400x80xX.jpg','Entremes')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Cruzcampo', 'Cerveza española bien fresquita',2.0,'https://www.sanchez-garrido.com/wp-content/uploads/2020/03/botella1l.jpg','Bebida',1)",
                "INSERT INTO Usuario (username,nombre,correo,contraseña,telefono,creditoDigital) VALUES ('perico','Pepe Rico','perico@gmail.com','asd1234','666777888',20.5)",
                "INSERT INTO Usuario (username,nombre,correo,contraseña,telefono,tipo,creditoDigital) VALUES ('josrompoz1','Jose Carlos','josrompoz1@gmail.com','qwerty','654654654','ADMIN',10000)",
                "INSERT INTO Usuario (username,nombre,correo,contraseña,telefono) VALUES ('aitor','aitortilla','aitortilla@gmail.com','asd1234','653780421')",
                "INSERT INTO Tarjeta (numero, expiracion, usuarioId) VALUES ('55554444333322221111','2025-05-01',1)",
                "INSERT INTO Tarjeta (numero, expiracion, usuarioId) VALUES ('55554444333311112222','2026-05-01',1)",
                "INSERT INTO Tarjeta (numero, expiracion, usuarioId) VALUES ('42424242424242424242','2028-05-01',2)",
                "INSERT INTO Direccion (nombreDireccion, direccion, pais, ciudad, usuarioId) VALUES ('Mi casa','C/ Rodrigo, 2','España','Sevilla',1)",
                "INSERT INTO Direccion (nombreDireccion, direccion, pais, ciudad, usuarioId) VALUES ('Mi casa','C/ España, 23','España','Malaga',3)",
                "INSERT INTO Direccion (nombreDireccion, direccion, pais, ciudad, usuarioId) VALUES ('Casa abuela','C/ Oriente, 78','España','Granada',3)",
                "INSERT INTO CuponDescuento (codigo, porcentaje) VALUES ('semverano',5)",
                "INSERT INTO CuponDescuento (codigo, porcentaje) VALUES ('seminvierno',10)",
                "INSERT INTO CuponDescuento (codigo, porcentaje) VALUES ('semotoño',15)",
                "INSERT INTO Reto (nombre, descripcion, categoria, dificultad) VALUES ('Prueba 1', 'Reto de prueba numero 1', 'Criptografia', 1)",
                "INSERT INTO Reto (nombre, descripcion, categoria, dificultad) VALUES ('Prueba 2', 'Reto de prueba numero 2', 'Inyeccion de codigo', 3)",
                "INSERT INTO Solucion (tipo, retoId) VALUES ('Interactiva', 1)",
                "INSERT INTO Solucion (tipo, retoId) VALUES ('No interactiva', 1)",
                "INSERT INTO Solucion (tipo, retoId) VALUES ('No interactiva', 2)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (1,'Paso numero 1 de la solucion 1',1)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (2,'Paso numero 2 de la solucion 1',1)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (3,'Paso numero 3 de la solucion 1',1)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (4,'Paso numero 4 de la solucion 1',1)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (1,'Paso numero 1 de la solucion 2',2)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (2,'Paso numero 2 de la solucion 2',2)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (3,'Paso numero 3 de la solucion 2',2)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (1,'Paso numero 1 de la solucion 3',3)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (2,'Paso numero 2 de la solucion 3',3)",
                "INSERT INTO Mesa (numeroPersonas, fecha, hora, usuarioId, menuId) VALUES (4,'2023-01-01','13:30',1,3)",
                "INSERT INTO Mesa (numeroPersonas, fecha, hora, usuarioId, menuId) VALUES (8,'2023-01-01','13:30',2,2)",
                "INSERT INTO Mesa (numeroPersonas, fecha, hora, usuarioId, menuId) VALUES (5,'2023-01-01','13:30',3,1)",
                "INSERT INTO PedidoComida (metodoPago, fecha, hora, usuarioId) VALUES ('Tarjeta','2023-01-01','13:30',1)",
                "INSERT INTO PedidoComida (metodoPago, fecha, hora, estado, usuarioId) VALUES ('Cartera digital','2023-01-01','13:30','En preparacion',1)",
                "INSERT INTO PedidoComida (metodoPago, fecha, hora, estado, usuarioId) VALUES ('Tarjeta','2022-01-01','13:30','En transito',1)",
                "INSERT INTO PedidoComida (metodoPago, fecha, hora, usuarioId) VALUES ('Cartera digital','2023-01-01','13:30',2)",
                "INSERT INTO PedidoComida (metodoPago, fecha, hora, estado, usuarioId) VALUES ('Tarjeta','2023-01-01','13:30','Entregado',2)",
                "INSERT INTO PedidoComida (metodoPago, fecha, hora, usuarioId) VALUES ('Tarjeta','2023-01-01','13:30',3)"];
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
  .use(productos(connection))
  .use(usuarios(connection))
  .use(cupones(connection))
  .use(retos(connection))
  .use(mesas(connection))
  .use(pedidos(connection));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});