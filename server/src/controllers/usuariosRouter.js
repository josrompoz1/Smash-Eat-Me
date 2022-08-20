const express = require('express');

function createRouterUsuarios(db) {
    const router = express.Router();
    //---------------------------------ENDPOINTS USUARIOS---------------------------------
    router.get('/usuarios', function (req, res, next) {
        db.query(
            'SELECT * FROM Usuario',
            [],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    res.status(200).json(results);
                }
            }
        );
    });

    router.get('/usuarios/:id', function (req, res, next) {
        db.query(
            "SELECT * FROM Usuario WHERE id=?",
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    res.status(200).json(results[0]);
                }
            }
        );
    });

    router.get('/usuarios/cartera/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Usuario WHERE id=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    res.status(200).json(results[0].creditoDigital);
                }
            }
        );
    });

    router.post('/usuarios', (req, res, next) => {
        db.query(
            'INSERT INTO Usuario (username, nombre, correo, contrasena, telefono, tipo) VALUES (?,?,?,?,?,?)',
            [req.body.username, req.body.nombre, req.body.correo, req.body.contrasena, req.body.telefono, req.body.tipo],
            (error) => {
                if (error) {
                    console.log(error);
                    if (req.body.username || req.body.nombre || req.body.correo || req.body.contraseña) {
                        res.status(400).json({ status: 'Bad request' });
                    } else {
                        console.error(error);
                        res.status(500).json({ status: 'error' });
                    }
                } else {
                    res.status(201).json({ status: 'Usuario añadido correctamente' });
                }
            }
        );
    });

    router.put('/usuarios/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Usuario WHERE id=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    if (results.length == 0) {
                        res.status(404).json({ status: 'Not found' })
                    } else {
                        db.query(
                            'UPDATE Usuario SET username=?, nombre=?, contrasena=?, correo=?, telefono=?, tipo=? WHERE id=?',
                            [req.body.username ? req.body.username : results[0].username, req.body.nombre ? req.body.nombre : results[0].nombre,
                            req.body.contrasena ? req.body.contrasena : results[0].contrasena,
                            req.body.correo ? req.body.correo : results[0].correo, req.body.telefono, req.body.tipo, req.params.id],
                            (error) => {
                                if (error) {
                                    res.status(500).json({ status: 'error' });
                                } else {
                                    res.status(201).json({ status: 'Usuario actualizado correctamente' });
                                }
                            }
                        );
                    }
                }
            }
        );
    });

    router.put('/usuarios/:id/addcash/:creditoDigital', function (req, res, next) {
        db.query(
            'SELECT creditoDigital FROM Usuario WHERE id=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    if (results.length == 0) {
                        res.status(404).json({ status: 'Not found' });
                    } else {
                        db.query(
                            'UPDATE Usuario SET creditoDigital=? WHERE id=?',
                            [+req.params.creditoDigital + +results[0].creditoDigital, req.params.id],
                            (error) => {
                                if (error) {
                                    if (req.body.creditoDigital == undefined) {
                                        res.status(400).json({ status: 'Bad request' });
                                    } else {
                                        res.status(500).json({ status: 'error' });
                                    }
                                } else {
                                    res.status(201).json({ status: 'Credito actualizado correctamente' });
                                }
                            }
                        );
                    }
                }
            }
        );
    });

    router.put('/usuarios/:id/deletecash', function (req, res, next) {
        db.query(
            'SELECT creditoDigital FROM Usuario WHERE id=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    if (results.length == 0) {
                        res.status(404).json({ status: 'Not found' });
                    } else {
                        db.query(
                            'UPDATE Usuario SET creditoDigital=? WHERE id=?',
                            [+results[0].creditoDigital - +req.body.creditoDigital, req.params.id],
                            (error) => {
                                if (error) {
                                    if (req.body.creditoDigital == undefined) {
                                        res.status(400).json({ status: 'Bad request' });
                                    } else {
                                        res.status(500).json({ status: 'error' });
                                    }
                                } else {
                                    res.status(201).json({ status: 'Credito digital disminuido' });
                                }
                            }
                        );
                    }
                }
            }
        );
    });

    router.delete('/usuarios/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Usuario WHERE id=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    if (results.length == 0) {
                        res.status(404).json({ status: 'Not found' })
                    } else {
                        db.query(
                            'DELETE FROM Usuario WHERE id=?',
                            [req.params.id],
                            (error) => {
                                if (error) {
                                    res.status(500).json({ status: 'error' });
                                } else {
                                    res.status(201).json({ status: 'Usuario eliminado' });
                                }
                            }
                        );
                    }
                }
            });
    });

    //---------------------------------ENDPOINTS TARJETAS DE USUARIOS---------------------------------
    router.get('/tarjetas/usuario/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Tarjeta WHERE usuarioId=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    res.status(200).json(results);
                }
            }
        );
    });

    router.post('/tarjetas', (req, res, next) => {
        db.query(
            'INSERT INTO Tarjeta (numero, expiracion, usuarioId) VALUES (?,?,?)',
            [req.body.numero, req.body.expiracion, req.body.usuarioId],
            (error) => {
                if (error) {
                    if (req.body.numero || req.body.expiracion || req.body.usuarioId) {
                        res.status(400).json({ status: 'Bad request' });
                    } else {
                        console.error(error);
                        res.status(500).json({ status: 'error' });
                    }
                } else {
                    res.status(201).json({ status: 'Tarjeta creada correctamente' });
                }
            }
        );
    });

    router.put('/tarjetas/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Tarjeta WHERE id=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    if (results.length == 0) {
                        res.status(404).json({ status: 'Not found' });
                    } else {
                        db.query(
                            'UPDATE Tarjeta SET numero=?, expiracion=? WHERE id=?',
                            [req.body.numero, req.body.expiracion.split("T")[0], req.params.id],
                            (error) => {
                                if (error) {
                                    if (req.body.numero || req.body.expiracion) {
                                        res.status(400).json({ status: 'El formato de la fecha debe ser dd/MM/yyyy' });
                                    } else {
                                        console.log(error)
                                        res.status(500).json({ status: 'error' });
                                    }
                                } else {
                                    res.status(201).json({ status: 'Tarjeta actualizada correctamente' });
                                }
                            }
                        );
                    }
                }
            }
        );
    });

    router.delete('/tarjetas/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Tarjeta WHERE id=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    if (results.length == 0) {
                        res.status(404).json({ status: 'Not found' })
                    } else {
                        db.query(
                            'DELETE FROM Tarjeta WHERE id=?',
                            [req.params.id],
                            (error) => {
                                if (error) {
                                    res.status(500).json({ status: 'error' });
                                } else {
                                    res.status(200).json({ status: 'ok' });
                                }
                            }
                        );
                    }
                }
            }
        );
    });

    //---------------------------------ENDPOINTS DIRECCION DE USUARIOS---------------------------------
    router.get('/direcciones/usuario/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Direccion WHERE usuarioId=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    res.status(200).json(results);
                }
            }
        );
    });

    router.post('/direcciones', (req, res, next) => {
        db.query(
            'INSERT INTO Direccion (nombreDireccion, direccion, pais, ciudad, usuarioId) VALUES (?,?,?,?,?)',
            [req.body.nombreDireccion, req.body.direccion, req.body.pais, req.body.ciudad, req.body.usuarioId],
            (error) => {
                if (error) {
                    if (req.body.nombreDireccion || req.body.direccion || req.body.pais || req.body.ciudad || req.body.usuarioId) {
                        console.log(error)
                        res.status(400).json({ status: 'Bad request' });
                    } else {
                        console.error(error);
                        res.status(500).json({ status: 'error' });
                    }
                } else {
                    res.status(201).json({status: 'Direccion añadida correctamente'});
                }
            }
        );
    });

    router.put('/direcciones/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Direccion WHERE id=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    if (results.length == 0) {
                        res.status(404).json({ status: 'Not found' });
                    } else {
                        db.query(
                            'UPDATE Direccion SET nombreDireccion=?, direccion=?, pais=?, ciudad=? WHERE id=?',
                            [req.body.nombreDireccion, req.body.direccion, req.body.pais, req.body.ciudad, req.params.id],
                            (error) => {
                                if (error) {
                                    if (req.body.nombreDireccion || req.body.direccion || req.body.pais || req.body.ciudad) {
                                        res.status(400).json({ status: 'Bad request' });
                                    } else {
                                        console.log(error)
                                        res.status(500).json({ status: 'error' });
                                    }
                                } else {
                                    res.status(201).json({ status: 'Direccion actualizada correctamente' });
                                }
                            }
                        );
                    }
                }
            }
        );
    });

    router.delete('/direcciones/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Direccion WHERE id=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    if (results.length == 0) {
                        res.status(404).json({ status: 'Not found' })
                    } else {
                        db.query(
                            'DELETE FROM Direccion WHERE id=?',
                            [req.params.id],
                            (error) => {
                                if (error) {
                                    console.log(error)
                                    res.status(500).json({ status: 'error' });
                                } else {
                                    res.status(201).json({ status: 'Direccion eliminada' });
                                }
                            }
                        );
                    }
                }
            }
        );
    });

    return router;
}

module.exports = createRouterUsuarios;