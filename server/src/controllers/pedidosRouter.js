const express = require('express');

function createRouterPedidos(db) {
  const router = express.Router();

  //---------------------------------ENDPOINTS PEDIDOS DE COMIDA---------------------------------
  router.get('/pedidos', function (req, res, next) {
    db.query(
      'SELECT * FROM PedidoComida ORDER BY estado',
      [10 * (req.params.page || 0)],
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
          if (results.length == 0) {
            res.status(404).json({ status: 'Not found' })
          } else {
            res.status(200).json(results);
          }
        }
      }
    );
  });

  router.post('/pedidos', (req, res, next) => {
    db.query(
      'INSERT INTO PedidoComida (metodoPago, fecha, hora, usuarioId) VALUES (?,?,?,?)',
      [req.body.metodoPago, req.body.fecha.split("T")[0], req.body.hora, req.body.usuarioId],
      (error) => {
        if (error) {
          if (req.body.metodoPago || req.body.fecha || req.body.hora || req.body.usuarioId) {
            res.status(400).json({ status: 'Bad request' });
          } else {
            console.error(error);
            res.status(500).json({ status: 'error' });
          }
        } else {
          db.query(
            'SELECT MAX(id) AS id FROM PedidoComida',
            [10 * (req.params.page || 0)],
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

  router.put('/pedidos/:id/preparacion', function (req, res, next) {
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
                  res.status(204).json({ status: 'Resource updated successfully' });
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
                  res.status(204).json({ status: 'Resource updated successfully' });
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
                  res.status(204).json({ status: 'Resource updated successfully' });
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