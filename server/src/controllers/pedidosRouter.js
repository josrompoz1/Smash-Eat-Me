const express = require('express');

function createRouterPedidos(db) {
    const router = express.Router();

    //---------------------------------ENDPOINTS PEDIDOS DE COMIDA---------------------------------
    router.get('/pedidos', function (req, res, next) {
        db.query(
            'SELECT * FROM pedidocomida ORDER BY estado',
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

    router.get('/pedidos/:id', function (req, res, next) {
        db.query(
          'SELECT * FROM pedidocomida WHERE id=?',
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

    router.get('/pedidos/usuario/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM pedidocomida WHERE usuarioId=?',
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

    router.post('/pedidos', (req, res, next) => {
        db.query(
        'INSERT INTO pedidocomida (metodoPago, fecha, hora, usuarioId) VALUES (?,?,?,?)',
        [req.body.metodoPago, req.body.fecha, req.body.hora, req.body.usuarioId],
        (error) => {
            if (error) {
                if(req.body.metodoPago || req.body.fecha || req.body.hora || req.body.usuarioId) {
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

    router.put('/pedidos/:id/preparacion', function (req, res, next) {
        db.query(
          'SELECT * FROM pedidocomida WHERE id=?',
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
                      "UPDATE pedidocomida SET estado='En preparacion' WHERE id=?",
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

    router.put('/pedidos/:id/transito', function (req, res, next) {
        db.query(
          'SELECT * FROM pedidocomida WHERE id=?',
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
                      "UPDATE pedidocomida SET estado='En transito' WHERE id=?",
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

    router.put('/pedidos/:id/entregado', function (req, res, next) {
        db.query(
          'SELECT * FROM pedidocomida WHERE id=?',
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
                      "UPDATE pedidocomida SET estado='Entregado' WHERE id=?",
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

module.exports = createRouterPedidos;