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
  var queries = ["DROP TABLE IF EXISTS UsuarioPrincipal;",
                "DROP TABLE IF EXISTS Tarjeta;",
                "DROP TABLE IF EXISTS Valoracion;",
                "DROP TABLE IF EXISTS ProductoPedido;",
                "DROP TABLE IF EXISTS PedidoComida;",
                "DROP TABLE IF EXISTS Direccion;",
                "DROP TABLE IF EXISTS Mesa;",                
                "DROP TABLE IF EXISTS CuponDescuento;",
                "DROP TABLE IF EXISTS ProductoOfertado;",
                "DROP TABLE IF EXISTS Menu;",
                "DROP TABLE IF EXISTS Usuario;",
                "DROP TABLE IF EXISTS Paso;",
                "DROP TABLE IF EXISTS Solucion;",
                "DROP TABLE IF EXISTS Reto;",
                "CREATE TABLE UsuarioPrincipal (usuarioId INT NOT NULL, tipo ENUM('ADMIN','NO ADMIN') NOT NULL, token VARCHAR(100) NOT NULL, fechaLogin DATE NOT NULL)",
                "CREATE TABLE Usuario (id INT AUTO_INCREMENT, username VARCHAR(50) NOT NULL, nombre VARCHAR(255) NOT NULL, correo VARCHAR(100) NOT NULL, contrasena VARCHAR(255) NOT NULL, telefono INT, tipo ENUM('ADMIN','NO ADMIN') NOT NULL DEFAULT 'NO ADMIN', creditoDigital FLOAT DEFAULT 0.0, PRIMARY KEY(id));",
                "CREATE TABLE Tarjeta (id INT AUTO_INCREMENT, numero VARCHAR(20) NOT NULL, expiracion DATE NOT NULL, usuarioId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE);",
                "CREATE TABLE Direccion (id INT AUTO_INCREMENT, nombreDireccion VARCHAR(50) NOT NULL, direccion VARCHAR(200) NOT NULL, pais VARCHAR(50) NOT NULL, ciudad VARCHAR(100) NOT NULL, usuarioId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE);",
                "CREATE TABLE CuponDescuento (id INT AUTO_INCREMENT, codigo VARCHAR(255) NOT NULL, porcentaje INT NOT NULL, PRIMARY KEY(id));",
                "CREATE TABLE PedidoComida (id INT AUTO_INCREMENT, metodoPago ENUM('Tarjeta','Cartera digital'), fecha DATE NOT NULL, hora TIME NOT NULL, estado ENUM('Pagado','En preparacion','En transito','Entregado') DEFAULT 'Pagado', nombreDireccion VARCHAR(50) NOT NULL, usuarioId INT NOT NULL, direccionUsuarioId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE, FOREIGN KEY(direccionUsuarioId) REFERENCES Direccion(id) ON DELETE CASCADE);",
                "CREATE TABLE Menu (id INT AUTO_INCREMENT, nombre VARCHAR(100) NOT NULL, descripcion TEXT NOT NULL, precio FLOAT, PRIMARY KEY(id));",
                "CREATE TABLE ProductoOfertado (id INT AUTO_INCREMENT, nombre VARCHAR(255) NOT NULL, descripcion VARCHAR(255) NOT NULL, imagen TEXT NOT NULL, precio FLOAT NOT NULL, tipo ENUM('Entremes','Plato','Postre','Bebida') NOT NULL, menuId INT, PRIMARY KEY(id), FOREIGN KEY (menuId) REFERENCES Menu(id));",
                "CREATE TABLE ProductoPedido (id INT AUTO_INCREMENT, cantidad INT NOT NULL, pedidoId INT NOT NULL, productoOfertadoId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (pedidoId) REFERENCES PedidoComida(id) ON DELETE CASCADE, FOREIGN KEY (productoOfertadoId) REFERENCES ProductoOfertado(id) ON DELETE CASCADE);",
                "CREATE TABLE Valoracion (id INT AUTO_INCREMENT, puntuacion INT NOT NULL, resenya TEXT, nombreUsuario VARCHAR(50) NOT NULL, nombreProducto VARCHAR(255) NOT NULL, usuarioId INT NOT NULL, productoPedidoId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE, FOREIGN KEY (productoPedidoId) REFERENCES ProductoPedido(id) ON DELETE CASCADE);",
                "CREATE TABLE Mesa (id INT AUTO_INCREMENT, numeroPersonas INT NOT NULL, fecha DATE NOT NULL, hora TIME NOT NULL, precioDescuento FLOAT, usuarioId INT NOT NULL, menuId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE, FOREIGN KEY (menuId) REFERENCES Menu(id));",
                "CREATE TABLE Reto (id INT AUTO_INCREMENT, nombre VARCHAR(30) NOT NULL, descripcion VARCHAR(255) NOT NULL, categoria ENUM('Inyeccion de codigo','Criptografia','Autenticacion e identificacion','Control de acceso') NOT NULL, dificultad INT NOT NULL, completado BOOLEAN NOT NULL DEFAULT FALSE, PRIMARY KEY(id));",
                "CREATE TABLE Solucion (id INT AUTO_INCREMENT, nombre VARCHAR(50) NOT NULL, tipo ENUM('Interactiva','No interactiva') NOT NULL, retoId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (retoId) REFERENCES Reto(id));",
                "CREATE TABLE Paso (id INT AUTO_INCREMENT, numero INT NOT NULL, solucion TEXT NOT NULL, solucionId INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (solucionId) REFERENCES Solucion(id));",
                "INSERT INTO Menu (nombre, descripcion, precio) VALUES ('Mediterraneo','Menu de la dieta mediterranea', 15.6)",
                "INSERT INTO Menu (nombre, descripcion, precio) VALUES ('Asiatico','Menu de la dieta asiatica', 30.5)",
                "INSERT INTO Menu (nombre, descripcion) VALUES ('Sin menú','Los comensales pedirán a la carta')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Tortilla de papas', 'Tortilla española de patatas de la huerta',5.3,'https://recetasdecocina.elmundo.es/wp-content/uploads/2021/01/tortilla-de-patatas-rellena.jpg','Plato',1)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Tarta de la abuela', 'Tarda de galleta con natilla de chocolate',4.0,'https://recetasdecocina.elmundo.es/wp-content/uploads/2020/02/receta-tarta-de-galletas-y-chocolate.jpg','Postre')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Ensaladilla', 'Ensalada de patatas, mayonesa, huevo y atún',3.8,'https://www.hogarmania.com/archivos/201906/ensaladilla-rusa-xl-668x400x80xX.jpg','Entremes')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Cruzcampo', 'Cerveza española bien fresquita',2.0,'https://www.sanchez-garrido.com/wp-content/uploads/2020/03/botella1l.jpg','Bebida',1)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Croquetas caseras', 'Croquetas de puchero caseras',5.3,'https://phantom-elmundo.unidadeditorial.es/1271bfd93f034d11db1bc6ccd093e69a/crop/307x205/2765x1843/resize/473/f/webp/assets/multimedia/imagenes/2022/01/12/16420042054594.jpg','Entremes',1)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Gazpacho', 'Sopa fría con varios ingredientes como aceite de oliva, vinagre, agua, hortalizas crudas, generalmente tomates, pepinos, pimientos, cebollas y ajo',4.0,'https://es-mycooktouch.group-taurus.com/image/recipe/545x395/gazpacho-andaluz-perfecto?rev=1650902988786','Entremes')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Flamenquín', 'Flamenquin casero cordobés con queso y jamon',3.8,'https://cdn6.recetasdeescandalo.com/wp-content/uploads/2019/04/Flamenquines-cordobeses-caseros.-Receta-de-tapa-tradicional.jpg','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Ensalada de pasta', 'Ensalada de pasta con tomate, atún y huevo',2.0,'https://t2.rg.ltmcdn.com/es/posts/5/9/8/ensalada_de_pasta_con_mayonesa_y_pina_59895_600.jpg','Entremes',1)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Huevos rotos', 'Patatas nuevas, huevos, aceite de oliva virgen extra y jamón ibérico',5.3,'https://www.pequerecetas.com/wp-content/uploads/2020/09/Huevos-rotos-con-jamon-receta-660x825.jpg','Plato',1)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Solomillo de ternera', 'Solomillo de vaca gallega',15.0,'https://cdn1.cocina-familiar.com/recetas/thumb/solomillo-de-ternera-con-foie-y-compota-de-pera-conferencia.JPG','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Gambas cocidas', 'Gambas blancas de Huelva al puñado',10.0,'http://4.bp.blogspot.com/-db4WARb-ZLg/VWNsVVim9BI/AAAAAAAAyqw/GzzJgDFBPHc/s640/PicsArt_1432162728365.jpg','Entremes')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Rioja', 'Vino rioja',2.0,'https://media.area-gourmet.com/product/vino-cune-crianza-rioja-800x800.jpeg','Bebida',1)",
                "INSERT INTO Usuario (username,nombre,correo,contrasena,telefono,creditoDigital) VALUES ('perico','Pepe Rico','perico@gmail.com','asd1234','666777888',20.5)",
                "INSERT INTO Usuario (username,nombre,correo,contrasena,telefono,tipo,creditoDigital) VALUES ('josrompoz1','Jose Carlos','josrompoz1@gmail.com','qwerty','654654654','ADMIN',10000)",
                "INSERT INTO Usuario (username,nombre,correo,contrasena,telefono) VALUES ('aitor','aitortilla','aitortilla@gmail.com','asd1234','653780421')",
                "INSERT INTO Tarjeta (numero, expiracion, usuarioId) VALUES ('55554444333322221111','2025-05-01',1)",
                "INSERT INTO Tarjeta (numero, expiracion, usuarioId) VALUES ('55554444333311112222','2026-05-01',1)",
                "INSERT INTO Tarjeta (numero, expiracion, usuarioId) VALUES ('42424242424242424242','2028-05-01',2)",
                "INSERT INTO Direccion (nombreDireccion, direccion, pais, ciudad, usuarioId) VALUES ('Mi casa','C/ Rodrigo, 2','España','Sevilla',1)",
                "INSERT INTO Direccion (nombreDireccion, direccion, pais, ciudad, usuarioId) VALUES ('Mi casa','C/ España, 23','España','Malaga',1)",
                "INSERT INTO Direccion (nombreDireccion, direccion, pais, ciudad, usuarioId) VALUES ('Casa abuela','C/ Oriente, 78','España','Granada',2)",
                "INSERT INTO Direccion (nombreDireccion, direccion, pais, ciudad, usuarioId) VALUES ('Casa tio','C/ Tipo Pepe, 20','España','Almeria',3)",
                "INSERT INTO CuponDescuento (codigo, porcentaje) VALUES ('semotoño',15)",
                "INSERT INTO CuponDescuento (codigo, porcentaje) VALUES ('semverano',5)",
                "INSERT INTO CuponDescuento (codigo, porcentaje) VALUES ('seminvierno',10)",
                "INSERT INTO CuponDescuento (codigo, porcentaje) VALUES ('semprimavera',10)",
                "INSERT INTO Reto (nombre, descripcion, categoria, dificultad, completado) VALUES ('Prueba 1', 'Reto de prueba numero 1', 'Criptografia', 1, true)",
                "INSERT INTO Reto (nombre, descripcion, categoria, dificultad) VALUES ('Prueba 2', 'Reto de prueba numero 2', 'Inyeccion de codigo', 3)",
                "INSERT INTO Reto (nombre, descripcion, categoria, dificultad, completado) VALUES ('Prueba 3', 'Reto de prueba numero 3', 'Autenticacion e identificacion', 2, true)",
                "INSERT INTO Reto (nombre, descripcion, categoria, dificultad) VALUES ('Prueba 4', 'Reto de prueba numero 4', 'Autenticacion e identificacion', 4)",
                "INSERT INTO Reto (nombre, descripcion, categoria, dificultad) VALUES ('Prueba 5', 'Reto de prueba numero 5', 'Criptografia', 5)",
                "INSERT INTO Reto (nombre, descripcion, categoria, dificultad) VALUES ('Prueba 6', 'Reto de prueba numero 6', 'Inyeccion de codigo', 4)",
                "INSERT INTO Reto (nombre, descripcion, categoria, dificultad) VALUES ('Prueba 7', 'Reto de prueba numero 7', 'Control de acceso', 1)",
                "INSERT INTO Solucion (tipo, nombre, retoId) VALUES ('Interactiva', 'Solucion 1', 1)",
                "INSERT INTO Solucion (tipo, nombre, retoId) VALUES ('No interactiva', 'Solucion 2', 1)",
                "INSERT INTO Solucion (tipo, nombre, retoId) VALUES ('Interactiva', 'Solucion 1', 2)",
                "INSERT INTO Solucion (tipo, nombre, retoId) VALUES ('Interactiva', 'Solucion 1', 3)",
                "INSERT INTO Solucion (tipo, nombre, retoId) VALUES ('Interactiva', 'Solucion 1', 4)",
                "INSERT INTO Solucion (tipo, nombre, retoId) VALUES ('No interactiva', 'Solucion 1', 5)",
                "INSERT INTO Solucion (tipo, nombre, retoId) VALUES ('No interactiva', 'Solucion 1', 6)",
                "INSERT INTO Solucion (tipo, nombre, retoId) VALUES ('Interactiva', 'Solucion 2', 6)",
                "INSERT INTO Solucion (tipo, nombre, retoId) VALUES ('No interactiva', 'Solucion 1', 7)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (1,'Paso numero 1 de la solucion 1',1)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (2,'Paso numero 2 de la solucion 1',1)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (3,'Paso numero 3 de la solucion 1',1)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (4,'Paso numero 4 de la solucion 1',1)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (1,'Paso numero 1 de la solucion 2',2)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (2,'Paso numero 2 de la solucion 2',2)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (3,'Paso numero 3 de la solucion 2',2)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (1,'Paso numero 1 de la solucion 3',3)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (2,'Paso numero 2 de la solucion 3',3)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (1,'Paso numero 1 de la solucion 4',4)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (1,'Paso numero 1 de la solucion 5',5)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (2,'Paso numero 2 de la solucion 5',5)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (3,'Paso numero 3 de la solucion 5',5)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (1,'Paso numero 1 de la solucion 6',6)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (2,'Paso numero 2 de la solucion 6',6)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (3,'Paso numero 3 de la solucion 6',6)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (4,'Paso numero 4 de la solucion 6',6)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (1,'Paso numero 1 de la solucion 7',7)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (2,'Paso numero 2 de la solucion 7',7)",
                "INSERT INTO Paso (numero, solucion, solucionId) VALUES (3,'Paso numero 3 de la solucion 7',7)",
                "INSERT INTO Mesa (numeroPersonas, fecha, hora, usuarioId, menuId) VALUES (4,'2023-01-01','13:30',1,3)",
                "INSERT INTO Mesa (numeroPersonas, fecha, hora, usuarioId, menuId) VALUES (8,'2023-01-01','13:30',2,2)",
                "INSERT INTO Mesa (numeroPersonas, fecha, hora, usuarioId, menuId) VALUES (5,'2023-01-01','13:30',3,1)",
                "INSERT INTO PedidoComida (metodoPago, fecha, hora, nombreDireccion, usuarioId, direccionUsuarioId) VALUES ('Tarjeta','2023-01-01','13:30','C/ Rodrigo, 2',1,1)",
                "INSERT INTO PedidoComida (metodoPago, fecha, hora, nombreDireccion, estado, usuarioId, direccionUsuarioId) VALUES ('Cartera digital','2023-01-01','13:30','C/ España, 23','En preparacion',1,2)",
                "INSERT INTO PedidoComida (metodoPago, fecha, hora, nombreDireccion, estado, usuarioId, direccionUsuarioId) VALUES ('Tarjeta','2022-01-01','13:30','C/ España, 23','Entregado',1,2)",
                "INSERT INTO PedidoComida (metodoPago, fecha, hora, nombreDireccion, usuarioId, direccionUsuarioId) VALUES ('Cartera digital','2023-01-01','13:30','C/ Oriente, 78',2,3)",
                "INSERT INTO PedidoComida (metodoPago, fecha, hora, nombreDireccion, estado, usuarioId, direccionUsuarioId) VALUES ('Tarjeta','2023-01-01','13:30','C/ Oriente, 78','Entregado',2,3)",
                "INSERT INTO PedidoComida (metodoPago, fecha, hora, nombreDireccion, usuarioId, direccionUsuarioId) VALUES ('Tarjeta','2023-01-01','13:30','C/ Tipo Pepe, 20',3,4)",
                "INSERT INTO ProductoPedido (cantidad, pedidoId, productoOfertadoId) VALUES (2, 1, 1)",
                "INSERT INTO ProductoPedido (cantidad, pedidoId, productoOfertadoId) VALUES (3, 1, 2)",
                "INSERT INTO ProductoPedido (cantidad, pedidoId, productoOfertadoId) VALUES (1, 2, 2)",
                "INSERT INTO ProductoPedido (cantidad, pedidoId, productoOfertadoId) VALUES (1, 3, 2)",
                "INSERT INTO ProductoPedido (cantidad, pedidoId, productoOfertadoId) VALUES (1, 3, 4)",
                "INSERT INTO ProductoPedido (cantidad, pedidoId, productoOfertadoId) VALUES (1, 4, 2)",
                "INSERT INTO ProductoPedido (cantidad, pedidoId, productoOfertadoId) VALUES (1, 5, 4)",
                "INSERT INTO ProductoPedido (cantidad, pedidoId, productoOfertadoId) VALUES (1, 6, 2)",
                "INSERT INTO ProductoPedido (cantidad, pedidoId, productoOfertadoId) VALUES (1, 6, 4)",
                "INSERT INTO Valoracion (puntuacion, resenya, nombreUsuario, nombreProducto, usuarioId, productoPedidoId) VALUES (4,'Bueno','perico','Tortilla de papas',1,1)",
                "INSERT INTO Valoracion (puntuacion, resenya, nombreUsuario, nombreProducto, usuarioId, productoPedidoId) VALUES (2,'Malo','perico','Tarta de la abuela',1,2)",
                "INSERT INTO Valoracion (puntuacion, resenya, nombreUsuario, nombreProducto, usuarioId, productoPedidoId) VALUES (3,'Mediocre','perico','Tortilla de papas',1,4)",
                "INSERT INTO Valoracion (puntuacion, resenya, nombreUsuario, nombreProducto, usuarioId, productoPedidoId) VALUES (5,'Muy bueno','perico','Tarta de la abuela',1,2)"];
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
  .use(pedidos(connection))
  .use(valoraciones(connection))
  .use(login(connection));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});