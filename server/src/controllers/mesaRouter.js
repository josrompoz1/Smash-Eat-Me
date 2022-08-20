const express = require('express');

function createRouterMesas(db) {
  const router = express.Router();

  //---------------------------------ENDPOINTS MESAS---------------------------------
  router.get('/mesas', function (req, res, next) {
    db.query(
      'SELECT * FROM Mesa ORDER BY fecha DESC',
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

  router.get('/mesas/usuario/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM Mesa WHERE usuarioId=? ORDER BY fecha DESC',
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

  router.post('/mesas', (req, res, next) => {
    db.query(
      'INSERT INTO Mesa (numeroPersonas, fecha, hora, precioDescuento, usuarioId, menuId) VALUES (?,?,?,?,?,?)',
      [req.body.numeroPersonas, req.body.fecha.split("T")[0], req.body.hora, req.body.precioDescuento, req.body.usuarioId, req.body.menuId],
      (error) => {
        if (error) {
          if (req.body.numeroPersonas || req.body.fecha || req.body.hora || req.body.usuarioId || req.body.menuId) {
            res.status(400).json({ status: 'Bad request' });
          } else {
            console.error(error);
            res.status(500).json({ status: 'error' });
          }
        } else {
          res.status(201).json({status: 'Reserva realizada correctamente'});
        }
      }
    );
  });

  router.delete('/mesas/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM Mesa WHERE id=?',
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
              'DELETE FROM Mesa WHERE id=?',
              [req.params.id],
              (error) => {
                if (error) {
                  console.log(error)
                  res.status(500).json({ status: 'error' });
                } else {
                  res.status(201).json({ status: 'Reserva eliminada' });
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

module.exports = createRouterMesas;