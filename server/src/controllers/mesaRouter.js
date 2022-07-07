const express = require('express');

function createRouterMesas(db) {
  const router = express.Router();

  //---------------------------------ENDPOINTS MESAS---------------------------------
  router.get('/mesas', function (req, res, next) {
    db.query(
      'SELECT * FROM Mesa',
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

  router.get('/mesas/:id', function (req, res, next) {
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
            res.status(200).json(results);
          }
        }
      }
    );
  });

  router.get('/mesas/usuario/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM Mesa WHERE usuarioId=?',
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

  router.get('/mesas/menu/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM Mesa WHERE menuId=?',
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

  router.post('/mesas', (req, res, next) => {
    db.query(
      'INSERT INTO Mesa (numeroPersonas, fecha, hora, precioDescuento, usuarioId, menuId) VALUES (?,?,?,?,?,?)',
      [req.body.numeroPersonas, req.body.fecha.split("T")[0], req.body.hora, req.body.precioDescuento, req.body.usuarioId, req.body.menuId],
      (error) => {
        if (error) {
          if (req.body.numeroPersonas || req.body.fecha || req.body.hora || req.body.usuarioId || req.body.menuId) {
            console.log(req.body.fecha)
            console.log(req.body.hora)
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

  return router;
}

module.exports = createRouterMesas;