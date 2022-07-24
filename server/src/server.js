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
                "CREATE TABLE UsuarioPrincipal (usuarioId INT NOT NULL, tipo ENUM('ADMIN','NO ADMIN') NOT NULL, token VARCHAR(100) NOT NULL, fechaLogin BIGINT NOT NULL)",
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
                "INSERT INTO Menu (nombre, descripcion, precio) VALUES ('Menú completo','Menú de hamburguesa completa, patatas fritas y refresco',10.0)",
                "INSERT INTO Menu (nombre, descripcion, precio) VALUES ('Menú italiano','Menú clásico de Italia',18.8)",
                "INSERT INTO Menu (nombre, descripcion) VALUES ('Sin menú','Los comensales pedirán a la carta')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Hamburgesa especial', 'Hamburguesa con queso, lechuga, tomate y cebolla',4.5,'https://cdn-icons-png.flaticon.com/512/883/883517.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Pizza', 'Pizza con base de tomate, mozzarella y bacon',8.0,'https://cdn-icons-png.flaticon.com/512/1404/1404945.png','Plato',4)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Perrito caliente', 'Perrito caliente clásico con ketchup y patatas',2.5,'https://cdn-icons-png.flaticon.com/512/3845/3845161.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Ensalada', 'Ensalada mixta',4.5,'https://cdn-icons-png.flaticon.com/512/1057/1057510.png','Entremes',1)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Hamburguesa completa', 'Hamburguesa de buey con lechuga, tomate, cebolla y queso',7.0,'https://cdn-icons-png.flaticon.com/512/267/267873.png','Plato',3)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Sopa', 'Sopa caliente de pollo con fideos',4.0,'https://cdn-icons-png.flaticon.com/512/3823/3823394.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Churrasco', 'Churrasco de cerdo con patatas fritas de guarnición',6.8,'https://cdn-icons-png.flaticon.com/512/5854/5854405.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Té frío', 'Té de frutas del bosque con hielo',2.0,'https://cdn-icons-png.flaticon.com/512/8088/8088125.png','Bebida',2)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Sushi', 'Plato de sushi combinado',9.0,'https://cdn-icons-png.flaticon.com/512/6920/6920151.png','Plato',2)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Alitas de pollo', 'Cubo de alitas de pollo fritas',8.0,'https://cdn-icons-png.flaticon.com/512/6611/6611751.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Espaguetis', 'Espaguettis italianos a la boloñesa',6.5,'https://cdn-icons-png.flaticon.com/512/3823/3823096.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Chelitas de cordero', 'Chuletas de cordero a la brasa',10.0,'https://cdn-icons-png.flaticon.com/512/4802/4802503.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Burrito mejicano', 'Tortilla de trigo enrollada en rellena de lechuga, aguacate, pollo y frijoles',5.0,'https://cdn-icons-png.flaticon.com/512/6981/6981359.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Taco mejicano', 'Carne de ternera o de pollo con tomate, cebolla y guacamole en una tortilla de maíz',5.0,'https://cdn-icons-png.flaticon.com/512/4062/4062916.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Patatas fritas', 'Patatas naturales fritas',1.5,'https://cdn-icons-png.flaticon.com/512/1046/1046786.png','Entremes',3)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Nachos con guacamole', 'Triángulos de tortilla de maíz fritos con queso y guacamole',7.0,'https://cdn-icons-png.flaticon.com/512/5596/5596725.png','Entremes')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Churros con chocolate', 'Masa de agua, harina, aceite y sal frita',2.0,'https://cdn-icons-png.flaticon.com/512/7433/7433816.png','Postre')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Huevos revueltos', 'Revuelto de huevo con gambas, espárragos y tacos de jamón',6.5,'https://cdn-icons-png.flaticon.com/512/1814/1814189.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Paella', 'Arroz con marisco',6.0,'https://cdn-icons-png.flaticon.com/512/4900/4900654.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Salmón', 'Salmón cocinado a la plancha',10.0,'https://cdn-icons-png.flaticon.com/512/988/988911.png','Plato',2)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Tarta de queso', 'Tarta de queso con mermelada de frambuesa',3.5,'https://cdn-icons-png.flaticon.com/512/4771/4771563.png','Postre')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Pollo asado', 'Pollo al carbón',7.0,'https://cdn-icons-png.flaticon.com/512/1046/1046802.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Sandwich', 'Sandwich mixto, queso y jamon cocido',2.0,'https://cdn-icons-png.flaticon.com/512/1033/1033228.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Empanadas', 'Masa de pan rellena de atún y tomate',4.3,'https://cdn-icons-png.flaticon.com/512/5100/5100421.png','Entremes')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Cóctel', 'Mezcla de diferentes bebidas',3.8,'https://cdn-icons-png.flaticon.com/512/8078/8078904.png','Entremes')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Café', 'Café al gusto, solo, con leche, cortado',1.5,'https://cdn-icons-png.flaticon.com/512/4566/4566425.png','Postre')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Aliño de pulpo', 'Ensalada de cebolla, tomate, pimiento y pulto aliñada con aceite y vinagre',3.6,'https://cdn-icons-png.flaticon.com/512/6433/6433380.png','Entremes')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Helado de fresa', 'Helado con fresas naturales',2.8,'https://cdn-icons-png.flaticon.com/512/3409/3409647.png','Postre')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Refresco', 'Gaseosa a elegir',1.0,'https://cdn-icons-png.flaticon.com/512/1046/1046782.png','Bebida',3)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Kebap', 'Auténtico kebap turco con carne de ternera y pollo, salsa yogur y picante y lechuga, tomate y cebolla',5.4,'https://cdn-icons-png.flaticon.com/512/706/706856.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Lasaña', 'Láminas de pasta superpuestas con relleno de carne de ternera, queso y tomate',6.1,'https://cdn-icons-png.flaticon.com/512/6785/6785760.png','Plato',4)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Bocadillo', 'Bocadillo de jamón ibérico',6.3,'https://cdn-icons-png.flaticon.com/512/5508/5508486.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Pancakes', 'Masa de harina, huevo, leche y aceite con sirope de caramento',3.2,'https://cdn-icons-png.flaticon.com/512/135/135561.png','Postre')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Gambas cocidas', 'Gambas de Huelva al puñao',12.0,'https://cdn-icons-png.flaticon.com/512/7430/7430044.png','Entremes',1)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Cerveza', 'Cerveza casera',10.0,'https://cdn-icons-png.flaticon.com/512/931/931949.png','Bebida')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Tarta de chocolate', 'Tarta con galleta y natilla de chocolate',3.0,'https://cdn-icons-png.flaticon.com/512/3565/3565217.png','Postre',1)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Helado de chocolate', 'Helado de chocolate',10.0,'https://cdn-icons-png.flaticon.com/512/8060/8060536.png','Postre')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Copa de vino', 'Copa de vino Rioja',2.5,'https://cdn-icons-png.flaticon.com/512/850/850207.png','Bebida')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Pechuga de pollo empanada', 'Pechuga de pollo con rebozado frita',4.0,'https://cdn-icons-png.flaticon.com/512/8043/8043419.png','Plato')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Batido de fresa', 'Batido casero de fresas',3.1,'https://cdn-icons-png.flaticon.com/512/5912/5912107.png','Postre')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo) VALUES ('Flan de huevo', 'Flan de huevo con base de caramelo',2.5,'https://cdn-icons-png.flaticon.com/512/7397/7397545.png','Postre')",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Risotto', 'Arroz meloso con caldo de pollo y champiñones',9.5,'https://cdn-icons-png.flaticon.com/512/135/135640.png','Plato',4)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Gazpacho', 'Sopa de tomate, pepino, cebolla, agua, vinagre',3.7,'https://cdn-icons-png.flaticon.com/512/6938/6938398.png','Entremes',1)",
                "INSERT INTO ProductoOfertado (nombre,descripcion,precio,imagen,tipo,menuId) VALUES ('Solomillo de ternera', 'Solomillo de vaca vieja a la brasa',15.8,'https://cdn-icons-png.flaticon.com/512/2114/2114716.png','Plato',1)",
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