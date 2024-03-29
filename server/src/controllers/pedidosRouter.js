const express = require('express');

function createRouterPedidos(db) {
  const router = express.Router();

  //---------------------------------ENDPOINTS PEDIDOS DE COMIDA---------------------------------
  router.get('/pedidos', function (req, res, next) {
    db.query(
      'SELECT * FROM PedidoComida ORDER BY estado',
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

  router.get('/pedidos/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM PedidoComida WHERE id=?',
      [req.params.id],
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

  router.get('/pedidos/usuario/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM PedidoComida WHERE usuarioId=?',
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

  router.post('/pedidos', (req, res, next) => {
    db.query(
      'INSERT INTO PedidoComida (metodoPago, fecha, hora, nombreDireccion, usuarioId, direccionUsuarioId) VALUES (?,?,?,?,?,?)',
      [req.body.metodoPago, req.body.fecha.split("T")[0], req.body.hora, req.body.nombreDireccion, req.body.usuarioId, req.body.direccionUsuarioId],
      (error) => {
        if (error) {
          if (req.body.metodoPago || req.body.fecha || req.body.hora || req.body.nombreDireccion || req.body.usuarioId || req.body.direccionUsuarioId) {
            console.log(erorr)
            res.status(400).json({ status: 'Bad request' });
          } else {
            console.error(error);
            res.status(500).json({ status: 'error' });
          }
        } else {
          db.query(
            'SELECT MAX(id) AS id FROM PedidoComida',
            [],
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ status: 'error' });
              } else {
                res.status(201).json({status: 'Pedido realizado, gracias!', id: result[0].id});
              }
            }
          );
        }
      }
    );
  });

  router.put('/pedidos/preparacion/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM PedidoComida WHERE id=?',
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
              "UPDATE PedidoComida SET estado='En preparacion' WHERE id=?",
              [req.params.id],
              (error) => {
                if (error) {
                  res.status(500).json({ status: 'error' });
                } else {
                  res.status(201).json({ status: 'Estado actualizado a: En preparacion' });
                }
              }
            );
          }
        }
      }
    );
  });

  router.put('/pedidos/transito/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM PedidoComida WHERE id=?',
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
              "UPDATE PedidoComida SET estado='En transito' WHERE id=?",
              [req.params.id],
              (error) => {
                if (error) {
                  res.status(500).json({ status: 'error' });
                } else {
                  res.status(201).json({ status: 'Estado actualizado a: En transito' });
                }
              }
            );
          }
        }
      }
    );
  });

  router.put('/pedidos/entregado/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM PedidoComida WHERE id=?',
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
              "UPDATE PedidoComida SET estado='Entregado' WHERE id=?",
              [req.params.id],
              (error) => {
                if (error) {
                  res.status(500).json({ status: 'error' });
                } else {
                  res.status(201).json({ status: 'Estado actualizado a: Entregado' });
                }
              }
            );
          }
        }
      }
    );
  });

  //---------------------------------ENDPOINTS PRODUCTOS PEDIDOS---------------------------------
  router.get('/productospedidos/:pedidoId', function (req, res, next) {
    db.query(
      'SELECT * FROM ProductoPedido WHERE pedidoId=?',
      [req.params.pedidoId],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          if (results.length == 0) {
            res.status(404).json({ status: 'Not found' });
          } else {
            res.status(200).json(results);
          }
        }
      }
    );
  });

  router.post('/productospedidos', (req, res, next) => {
    db.query(
      'INSERT INTO ProductoPedido (cantidad, pedidoId, productoOfertadoId) VALUES (?,?,?)',
      [req.body.cantidad, req.body.pedidoId, req.body.productoOfertadoId],
      (error) => {
        if (error) {
          if (req.body.cantidad || req.body.pedidoId || req.body.productoOfertadoId) {
            res.status(400).json({ status: 'Bad request' });
          } else {
            console.error(error);
            res.status(500).json({ status: 'error' });
          }
        } else {
          res.status(202).json({status: 'Resource created'});
        }
      });
  });

  return router;
}

module.exports = createRouterPedidos;