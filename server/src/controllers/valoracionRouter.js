const express = require('express');

function createRouterValoraciones(db) {
    const router = express.Router();

    //---------------------------------ENDPOINTS VALORACIONES---------------------------------
    router.get('/valoraciones/usuario/:usuarioId', function (req, res, next) {
        db.query(
          'SELECT * FROM valoracion WHERE usuarioId=?',
          [req.params.usuarioId],
          (error, results) => {
            if (error) {
              console.log(error);
              res.status(500).json({status: 'error'});
            } else {
              if(results.length==0) {
                res.status(404).json({status: 'Not found'});
              } else {
                res.status(200).json(results);
              }
            }
          }
        );
    });

    router.get('/valoraciones/producto/:productoId', function (req, res, next) {
        db.query(
          'SELECT valoracion.puntuacion, valoracion.reseña, valoracion.usuarioId, productopedido.productoOfertadoId FROM valoracion JOIN productopedido ON valoracion.productoPedidoId=productopedido.id AND productopedido.productoOfertadoId=?',
          [req.params.productoId],
          (error, results) => {
            if (error) {
              console.log(error);
              res.status(500).json({status: 'error'});
            } else {
              if(results.length==0) {
                res.status(404).json({status: 'Not found'});
              } else {
                res.status(200).json(results);
              }
            }
          }
        );
    });

    router.post('/valoraciones', (req, res, next) => {
        db.query(
          'INSERT INTO valoracion (puntuacion, reseña, usuarioId, productoPedidoId) VALUES (?,?,?,?)',
          [req.body.puntuacion, req.body.reseña, req.body.usuarioId, req.body.productoPedidoId],
          (error) => {
              if (error) {
                  if(req.body.puntuacion || req.body.reseña || req.body.usuarioId || req.body.productoPedidoId) {
                      res.status(400).json({status: 'Bad request'});
                  } else {
                      console.error(error);
                      res.status(500).json({status: 'error'});
                  }
              } else {
                  res.status(200).json({status: 'ok'});
              }
        });
    });
    
    return router;
}

module.exports = createRouterValoraciones;