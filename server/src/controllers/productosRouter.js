const express = require('express');

function createRouterProductos(db) {
  const router = express.Router();

  //---------------------------------ENDPOINTS PRODUCTOS---------------------------------
  router.get('/productos', function (req, res, next) {
    db.query(
      'SELECT * FROM ProductoOfertado ORDER BY precio',
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

  router.get('/productos/porId/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM ProductoOfertado WHERE id=?',
      [req.params.id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          if (results.length == 0) {
            res.status(404).json({ status: 'Not found' })
          } else {
            res.status(200).json(results[0]);
          }
        }
      }
    );
  });

  router.get('/productos/busqueda/:nombre', function (req, res, next) {
    db.query(
      "SELECT * FROM ProductoOfertado WHERE nombre LIKE ?",
      "%" + [req.params.nombre] + "%",
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

  router.get('/productos/tipo/:tipo', function (req, res, next) {
    tipo = req.params.tipo
    query = "SELECT * FROM ProductoOfertado WHERE tipo='" + tipo
    // Postre'%20UNION%20SELECT%20null%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cusername%2Ccontrasena%20FROM%20Usuario;--
    // Postre'%20UNION%20SELECT%20%2A%20FROM%20Usuario;--
    db.query(
      query,
      [],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          if (results.length == 0) {
            res.status(404).json({ status: 'Not found' })
          } else {
            res.status(200).json(results);
          }
        }
      }
    );
  });

  router.get('/productos/menu/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM ProductoOfertado WHERE menuId=?',
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

  router.get('/productos/no/menu', function (req, res, next) {
    db.query(
      'SELECT * FROM ProductoOfertado WHERE menuId IS NULL',
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

  router.get('/productos/tipo/:tipo/busqueda/:busqueda', function (req, res, next) {
    tipo = req.params.tipo
    busqueda = req.params.busqueda
    query = "SELECT * FROM ProductoOfertado WHERE tipo='" + tipo + " AND nombre LIKE '%" + busqueda + "%';"
    db.query(
        query,
        [req.params.tipo, "%" + req.params.busqueda + "%"],
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

  router.post('/productos', (req, res, next) => {
    db.query(
      'INSERT INTO ProductoOfertado (nombre, descripcion, precio, imagen, tipo) VALUES (?,?,?,?,?)',
      [req.body.nombre, req.body.descripcion, req.body.precio, req.body.imagen, req.body.tipo],
      (error) => {
        if (error) {
          if (req.body.nombre || req.body.descripcion || req.body.precio || req.body.imagen || req.body.tipo) {
            res.status(400).json({ status: 'Bad request' });
          } else {
            console.error(error);
            res.status(500).json({ status: 'error' });
          }
        } else {
          res.status(201).json({status: 'Producto añadido correctamente'});
        }
      }
    );
  });

  router.put('/productos/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM ProductoOfertado WHERE id=?',
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
              'UPDATE ProductoOfertado SET nombre=?, descripcion=?, precio=?, tipo=? WHERE id=?',
              [req.body.nombre, req.body.descripcion, req.body.precio, req.body.tipo, req.params.id],
              (error) => {
                if (error) {
                  if (req.body.nombre || req.body.descripcion || req.body.precio || req.body.tipo) {
                    res.status(400).json({ status: 'Bad request' });
                  } else {
                    res.status(500).json({ status: 'error' });
                  }
                } else {
                  res.status(201).json({ status: 'Producto editado correctamente' });
                }
              }
            );
          }
        }
      }
    );
  });

  router.put('/productos/:pid/menu/:mid', function (req, res, next) {
    db.query(
      'SELECT * FROM ProductoOfertado WHERE id=?',
      [req.params.pid],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          if (results.length == 0) {
            res.status(404).json({ status: 'Product not found' });
          } else {
            db.query(
              'SELECT * FROM Menu WHERE id=?',
              [req.params.mid],
              (error, results) => {
                if (error) {
                  console.log(error);
                  res.status(500).json({ status: 'error' });
                } else {
                  if (results.length == 0) {
                    res.status(404).json({ status: 'Menu not found' });
                  } else {
                    db.query(
                      'UPDATE ProductoOfertado SET menuId=? WHERE id=?',
                      [req.params.mid, req.params.pid],
                      (error) => {
                        if (error) {
                          res.status(500).json({ status: 'error' });
                        } else {
                          res.status(201).json({ status: 'Se ha añadido el producto al menú' });
                        }
                      }
                    )
                  }
                }
              }
            )
          }
        }
      }
    )
  });

  router.delete('/productos/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM ProductoOfertado WHERE id=?',
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
              'DELETE FROM ProductoOfertado WHERE id=?',
              [req.params.id],
              (error) => {
                if (error) {
                  console.log(error)
                  res.status(500).json({ status: 'error' });
                } else {
                  res.status(201).json({ status: 'Producto eliminado' });
                }
              }
            );
          }
        }
      }
    );
  });

  //---------------------------------ENDPOINTS MENUS---------------------------------
  router.get('/menus', function (req, res, next) {
    db.query(
      'SELECT * FROM Menu',
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

  router.post('/menus', (req, res, next) => {
    db.query(
      'INSERT INTO Menu (nombre, descripcion, precio) VALUES (?,?,?)',
      [req.body.nombre, req.body.descripcion, req.body.precio],
      (error) => {
        if (error) {
          if (req.body.nombre || req.body.descripcion || req.body.precio) {
            res.status(400).json({ status: 'Bad request' });
          } else {
            console.error(error);
            res.status(500).json({ status: 'error' });
          }
        } else {
          res.status(201).json({status: 'Menú creado correctamente'});
        }
      }
    );
  });

  router.delete('/menus/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM Menu WHERE id=?',
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
              'UPDATE ProductoOfertado SET menuId=null WHERE menuId=?',
              [req.params.id],
              (error) => {
                if (error) {
                  res.status(500).json({ status: 'error' });
                } else {
                  db.query('DELETE FROM Mesa WHERE menuId=?',
                  [req.params.id],
                  (error) => {
                    if (error) {
                      res.status(500).json({ status: 'error' });
                    } else {
                      db.query(
                        'DELETE FROM Menu WHERE id=?',
                        [req.params.id],
                        (error) => {
                          if (error) {
                            res.status(500).json({ status: 'error' });
                          } else {
                            res.status(201).json({ status: 'Menú eliminado correctamente' });
                          }
                        }
                      );
                    }
                  })
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

module.exports = createRouterProductos;