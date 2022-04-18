const express = require('express');

function createRouterProductos(db) {
  const router = express.Router();

  //---------------------------------ENDPOINTS PRODUCTOS---------------------------------
  router.get('/productos', function (req, res, next) {
    db.query(
      'SELECT * FROM productoofertado',
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

  router.get('/productos/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM productoofertado WHERE id=?',
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

  router.get('/productos/tipo/:tipo', function (req, res, next) {
    db.query(
      'SELECT * FROM productoofertado WHERE tipo=?',
      [req.params.tipo],
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

  router.get('/productos/menu/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM productoofertado WHERE menuId=?',
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

  router.post('/productos', (req, res, next) => {
    db.query(
      'INSERT INTO productoofertado (nombre, descripcion, precio, tipo) VALUES (?,?,?,?)',
      [req.body.nombre, req.body.descripcion, req.body.precio, req.body.tipo],
      (error) => {
        if (error) {
          if(req.body.nombre || req.body.descripcion || req.body.precio || req.body.tipo) {
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

  router.put('/productos/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM productoofertado WHERE id=?',
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
                  'UPDATE productoofertado SET nombre=?, descripcion=?, precio=?, tipo=? WHERE id=?',
                  [req.body.nombre, req.body.descripcion, req.body.precio, req.body.tipo, req.params.id],
                  (error) => {
                    if (error) {
                      if(req.body.nombre || req.body.descripcion || req.body.precio || req.body.tipo) {
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

  router.put('/productos/:pid/menu/:mid', function (req, res, next) {
    db.query(
      'SELECT * FROM productoofertado WHERE id=?',
      [req.params.pid],
      (error, results) => {
        if(error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          if(results.length==0) {
            res.status(404).json({status: 'Product not found'});
          } else {
            db.query(
              'SELECT * FROM menu WHERE id=?',
              [req.params.mid],
              (error, results) => {
                if(error) {
                  console.log(error);
                  res.status(500).json({status: 'error'});
                } else {
                  if(results.length==0) {
                    res.status(404).json({status: 'Menu not found'});
                  } else {
                    db.query(
                      'UPDATE productoofertado SET menuId=? WHERE id=?',
                      [req.params.mid, req.params.pid],
                      (error) => {
                        if (error) {
                          res.status(500).json({status: 'error'});
                        } else {
                          res.status(200).json({status: 'ok'});
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
      'SELECT * FROM productoofertado WHERE id=?',
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
                'DELETE FROM productoofertado WHERE id=?',
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

  //---------------------------------ENDPOINTS MENUS---------------------------------
  router.get('/menus', function (req, res, next) {
    db.query(
      'SELECT * FROM menu',
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

  router.get('/menus/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM menu WHERE id=?',
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

  router.post('/menus', (req, res, next) => {
    db.query(
      'INSERT INTO menu (nombre, descripcion) VALUES (?,?)',
      [req.body.nombre, req.body.descripcion],
      (error) => {
        if (error) {
          if(req.body.nombre || req.body.descripcion) {
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

  router.delete('/menus/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM menu WHERE id=?',
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
              'UPDATE productoofertado SET menuId=null WHERE menuId=?',
              [req.params.id],
              (error) => {
                if (error) {
                  res.status(500).json({status: 'error'});
                } else {
                  db.query(
                    'DELETE FROM menu WHERE id=?',
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
            );
            
          }
        }
      }
    );
  });
  
  return router;
}

module.exports = createRouterProductos;