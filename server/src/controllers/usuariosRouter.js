const express = require('express');

function createRouterUsuarios(db) {
    const router = express.Router();
    //---------------------------------ENDPOINTS USUARIOS---------------------------------
    router.get('/usuarios', function (req, res, next) {
        db.query(
        'SELECT * FROM usuario',
        [10*(req.params.page || 0)],
        (error, results) => {
            if (error) {
            console.log(error);
            res.status(500).json({status: 'error'});
            } else {
            res.status(200).json(results);
            }
        }
        );
    });

    router.get('/usuarios/:id', function (req, res, next) {
        db.query(
        'SELECT * FROM usuario WHERE id=?',
        [req.params.id],
        (error, results) => {
            if (error) {
            console.log(error);
            res.status(500).json({status: 'error'});
            } else {
            if(results.length==0) {
                res.status(404).json({status: 'Not found'})
            } else {
                res.status(200).json(results);
            }
            }
        }
        );
    });

    router.post('/usuarios', (req, res, next) => {
        db.query(
        'INSERT INTO usuario (username, nombre, correo, contraseña, telefono) VALUES (?,?,?,?,?)',
        [req.body.username, req.body.nombre, req.body.correo, req.body.contraseña, req.body.telefono],
        (error) => {
            if (error) {
            if(req.body.username || req.body.nombre || req.body.correo || req.body.contraseña) {
                res.status(400).json({status: 'Bad request'});
            } else {
                console.error(error);
                res.status(500).json({status: 'error'});
            }
            } else {
            res.status(200).json({status: 'ok'});
            }
        }
        );
    });

    router.put('/usuarios/:id', function (req, res, next) {
        db.query(
        'SELECT * FROM usuario WHERE id=?',
        [req.params.id],
        (error, results) => {
            if (error) {
            console.log(error);
            res.status(500).json({status: 'error'});
            } else {
            if(results.length==0) {
                res.status(404).json({status: 'Not found'})
            } else {
                db.query(
                    'UPDATE usuario SET username=?, nombre=?, correo=?, telefono=? WHERE id=?',
                    [req.body.username ? req.body.username : results[0].username, req.body.nombre ? req.body.nombre : results[0].nombre,
                    req.body.correo ? req.body.correo : results[0].correo, req.body.telefono ? req.body.telefono : results[0].telefono, req.params.id],
                    (error) => {
                        if (error) {
                        res.status(500).json({status: 'error'});
                        } else {
                        res.status(200).json({status: 'ok'});
                        }
                    }
                );
            }
            }
        }
        );
    });

    router.put('/usuarios/:id/changepassword', function (req, res, next) {
        db.query(
        'SELECT * FROM usuario WHERE id=?',
        [req.params.id],
        (error, results) => {
            if (error) {
            console.log(error);
            res.status(500).json({status: 'error'});
            } else {
            if(results.length==0) {
                res.status(404).json({status: 'Not found'})
            } else {
                db.query(
                    'UPDATE usuario SET contraseña=? WHERE id=?',
                    [req.body.contraseña, req.params.id],
                    (error) => {
                        if (error) {
                        if(req.body.contraseña==undefined) {
                            res.status(400).json({status: 'Bad request'});
                        } else {
                            res.status(500).json({status: 'error'});
                        }
                        } else {
                        res.status(200).json({status: 'ok'});
                        }
                    }
                );
            }
            }
        }
        );
    });

    router.put('/usuarios/:id/addcash', function (req, res, next) {
        db.query(
        'SELECT creditoDigital FROM usuario WHERE id=?',
        [req.params.id],
        (error, results) => {
            if (error) {
            console.log(error);
            res.status(500).json({status: 'error'});
            } else {
            if(results.length==0) {
                res.status(404).json({status: 'Not found'});
            } else {
                db.query(
                    'UPDATE usuario SET creditoDigital=? WHERE id=?',
                    [req.body.creditoDigital + results[0].creditoDigital, req.params.id],
                    (error) => {
                        if (error) {
                        if(req.body.creditoDigital==undefined) {
                            res.status(400).json({status: 'Bad request'});
                        } else {
                            res.status(500).json({status: 'error'});
                        }
                        } else {
                        res.status(200).json({status: 'ok'});
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
        'SELECT creditoDigital FROM usuario WHERE id=?',
        [req.params.id],
        (error, results) => {
            if (error) {
            console.log(error);
            res.status(500).json({status: 'error'});
            } else {
            if(results.length==0) {
                res.status(404).json({status: 'Not found'});
            } else {
                db.query(
                    'UPDATE usuario SET creditoDigital=? WHERE id=?',
                    [results[0].creditoDigital - req.body.creditoDigital, req.params.id],
                    (error) => {
                        if (error) {
                        if(req.body.creditoDigital==undefined) {
                            res.status(400).json({status: 'Bad request'});
                        } else {
                            res.status(500).json({status: 'error'});
                        }
                        } else {
                        res.status(200).json({status: 'ok'});
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
        'SELECT * FROM usuario WHERE id=?',
        [req.params.id],
        (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({status: 'error'});
            } else {
                if(results.length==0) {
                    res.status(404).json({status: 'Not found'})
                } else {
                    db.query(
                        'DELETE FROM usuario WHERE id=?',
                        [req.params.id],
                        (error) => {
                        if (error) {
                            res.status(500).json({status: 'error'});
                        } else {
                            res.status(200).json({status: 'ok'});
                        }
                        }
                    );
                }
            }
        });
    });

    //---------------------------------ENDPOINTS TARJETAS DE USUARIOS---------------------------------
    router.get('/tarjetas/:id', function (req, res, next) {
        db.query(
        'SELECT * FROM tarjeta WHERE id=?',
        [req.params.id],
        (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({status: 'error'});
            } else {
                if(results.length==0) {
                    res.status(404).json({status: 'Not found'})
                } else {
                    res.status(200).json(results);
                }
            }
        }
        );
    });

    router.get('/tarjetas/usuario/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM tarjeta WHERE usuarioId=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({status: 'error'});
                } else {
                    if(results.length==0) {
                        res.status(404).json({status: 'Not found'})
                    } else {
                        res.status(200).json(results);
                    }
                }
            }
        );
    });

    router.post('/tarjetas', (req, res, next) => {
        db.query(
        'INSERT INTO tarjeta (numero, expiracion, usuarioId) VALUES (?,?,?)',
        [req.body.numero, req.body.expiracion, req.body.usuarioId],
        (error) => {
            if (error) {
                if(req.body.numero || req.body.expiracion || req.body.usuarioId) {
                    res.status(400).json({status: 'Bad request'});
                } else {
                    console.error(error);
                    res.status(500).json({status: 'error'});
                }
            } else {
                res.status(200).json({status: 'ok'});
            }
        }
        );
    });

    router.put('/tarjetas/:id', function (req, res, next) {
        db.query(
        'SELECT * FROM tarjeta WHERE id=?',
        [req.params.id],
        (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({status: 'error'});
            } else {
                if(results.length==0) {
                    res.status(404).json({status: 'Not found'});
                } else {
                    db.query(
                        'UPDATE tarjeta SET expiracion=? WHERE id=?',
                        [req.body.expiracion, req.params.id],
                        (error) => {
                            if (error) {
                                if(req.body.expiracion==null) {
                                    res.status(400).json({status: 'Bad request'});
                                } else {
                                    res.status(500).json({status: 'error'});
                                }
                            } else {
                                res.status(200).json({status: 'ok'});
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
          'SELECT * FROM tarjeta WHERE id=?',
          [req.params.id],
          (error, results) => {
            if (error) {
              console.log(error);
              res.status(500).json({status: 'error'});
            } else {
              if(results.length==0) {
                res.status(404).json({status: 'Not found'})
              } else {
                db.query(
                    'DELETE FROM tarjeta WHERE id=?',
                    [req.params.id],
                    (error) => {
                      if (error) {
                        res.status(500).json({status: 'error'});
                      } else {
                        res.status(200).json({status: 'ok'});
                      }
                    }
                );
              }
            }
          }
        );
      });

    //---------------------------------ENDPOINTS DIRECCION DE USUARIOS---------------------------------
    router.get('/direcciones/:id', function (req, res, next) {
        db.query(
        'SELECT * FROM direccion WHERE id=?',
        [req.params.id],
        (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({status: 'error'});
            } else {
                if(results.length==0) {
                    res.status(404).json({status: 'Not found'})
                } else {
                    res.status(200).json(results);
                }
            }
        }
        );
    });

    router.get('/direcciones/usuario/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM direccion WHERE usuarioId=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({status: 'error'});
                } else {
                    if(results.length==0) {
                        res.status(404).json({status: 'Not found'})
                    } else {
                        res.status(200).json(results);
                    }
                }
            }
        );
    });

    router.post('/direcciones', (req, res, next) => {
        db.query(
        'INSERT INTO direccion (nombreDireccion, direccion, pais, ciudad, usuarioId) VALUES (?,?,?,?,?)',
        [req.body.nombreDireccion, req.body.direccion, req.body.pais, req.body.ciudad, req.body.usuarioId],
        (error) => {
            if (error) {
                if(req.body.nombreDireccion || req.body.direccion || req.body.pais || req.body.ciudad || req.body.usuarioId) {
                    res.status(400).json({status: 'Bad request'});
                } else {
                    console.error(error);
                    res.status(500).json({status: 'error'});
                }
            } else {
                res.status(200).json({status: 'ok'});
            }
        }
        );
    });

    router.delete('/direcciones/:id', function (req, res, next) {
        db.query(
          'SELECT * FROM direccion WHERE id=?',
          [req.params.id],
          (error, results) => {
            if (error) {
              console.log(error);
              res.status(500).json({status: 'error'});
            } else {
              if(results.length==0) {
                res.status(404).json({status: 'Not found'})
              } else {
                db.query(
                    'DELETE FROM direccion WHERE id=?',
                    [req.params.id],
                    (error) => {
                      if (error) {
                        res.status(500).json({status: 'error'});
                      } else {
                        res.status(200).json({status: 'ok'});
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