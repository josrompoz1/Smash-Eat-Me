const express = require('express');

function createRouterValoraciones(db) {
  const router = express.Router();

  //---------------------------------ENDPOINTS VALORACIONES---------------------------------
  router.get('/valoraciones', function (req, res, next) {
    db.query(
      'SELECT * FROM Valoracion',
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

  router.get('/valoraciones/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM Valoracion WHERE id=?',
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

  router.get('/valoraciones/usuario/:usuarioId', function (req, res, next) {
    db.query(
      'SELECT * FROM Valoracion WHERE usuarioId=?',
      [req.params.usuarioId],
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

  router.get('/valoraciones/producto/:productoId', function (req, res, next) {
    db.query(
      'SELECT v.puntuacion, v.resenya, v.usuarioId, p.productoOfertadoId FROM Valoracion AS v JOIN ProductoPedido AS p ON v.productoPedidoId=p.id WHERE p.productoOfertadoId=?',
      [req.params.productoId],
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

  router.post('/valoraciones', (req, res, next) => {
    db.query(
      'INSERT INTO Valoracion (puntuacion, resenya, nombreUsuario, nombreProducto, usuarioId, productoPedidoId) VALUES (?,?,?,?,?,?)',
      [req.body.puntuacion, req.body.resenya, req.body.nombreUsuario, req.body.nombreProducto, req.body.usuarioId, req.body.productoPedidoId],
      (error) => {
        if (error) {
          if (req.body.puntuacion || req.body.resenya || req.body.nombreUsuario || req.body.nombreProducto || req.body.usuarioId || req.body.productoPedidoId) {
            res.status(400).json({ status: 'Bad request' });
          } else {
            console.error(error);
            res.status(500).json({ status: 'error' });
          }
        } else {
          res.status(201).json({ status: 'Producto valorado correctamente' });
        }
      });
  });

  router.delete('/valoraciones/:id', function (req, res, next) {
    db.query(
        'SELECT * FROM Valoracion WHERE id=?',
        [req.params.id],
        (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({ status: 'error' });
            } else {
              db.query(
                'DELETE FROM Valoracion WHERE id=?',
                [req.params.id],
                (error) => {
                  if (error) {
                    res.status(500).json({ status: 'error' });
                  } else {
                    res.status(201).json({ status: 'Valoracion eliminada' });
                  }
                }
              );
            }
        });
  });

  return router;
}

module.exports = createRouterValoraciones;