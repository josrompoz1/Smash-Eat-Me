# Smash&Eat Me
Smash&Eat Me es una aplicación web insegura que propone retos de seguridad basados en vulnerabilidades del OWASP Top Ten. Su objetivo es concienciar sobre los problemas que puede causar que una aplicación real tenga debilidades o fallas de seguridad. Se puede utilizar para realizar diversos ataques que en una aplicación real sería ilegal.

<p align="center">
  <img src="https://i.ibb.co/nCBJTHS/logo-sin-fondo.png" alt="Smash&Eat Me Logo">
</p>

## Configuración
Para configurar y levantar la aplicación en una máquina local se seguirán los siguientes pasos:
1. Instalar node.js en su versión 18. Se puede instalar [node.js](http://nodejs.org) en su página oficial.
2. También es necesario tener instalado y configurado Docker en la máquina. Se puede instalar [Docker](https://docs.docker.com/engine/install/) para diferentes sistemas operativos desde su página oficial.
3. Clonar el proyecto en la máquina mediante ```git clone https://github.com/josrompoz1/Smash-Eat-Me.git```
4. En el directorio del proyecto, ```cd ./server```
5. Para levantar la base de datos MySQL se usa un contenedor Docker. Para ello, ```docker-compose up ```
6. Ahora es paso de levantar el servidor de Express.js. En una nueva ventana de comandos, se accede al directorio del proyecto y se ejecutan los comandos ```cd ./server/src``` y ```node server.js```
7. Por último, levantamos el servidor Angular que contiene la aplicación. En otra ventana de comandos y en el directorio del proyecto, se ejecutan los comandos ```cd ./smash-eat-me``` y ```ng serve --open```
8. Se abrirá una ventana en el navegador y la aplicación estará lista para ser usada.
9. Si no se abre esta ventana, simplemente hay que acceder a http://localhost:4200
