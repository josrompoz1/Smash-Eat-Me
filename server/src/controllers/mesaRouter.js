const express = require('express');

function createRouterMesas(db) {
    const router = express.Router();

    //---------------------------------ENDPOINTS MESAS---------------------------------
    router.get('/mesas', function (req, res, next) {
        db.query(
          'SELECT * FROM mesa',
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

    router.get('/mesas/:id', function (req, res, next) {
        db.query(
          'SELECT * FROM mesa WHERE id=?',
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

    router.get('/mesas/usuario/:id', function (req, res, next) {
        db.query(
          'SELECT * FROM mesa WHERE usuarioId=?',
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

    router.get('/mesas/menu/:id', function (req, res, next) {
        db.query(
          'SELECT * FROM mesa WHERE menuId=?',
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

    router.post('/mesas', (req, res, next) => {
        db.query(
            'INSERT INTO mesa (numeroPersonas, fecha, hora, usuarioId, menuId) VALUES (?,?,?,?,?)',
            [req.body.numeroPersonas, req.body.fecha, req.body.hora, req.body.usuarioId, req.body.menuId],
            (error) => {
                if (error) {
                if(req.body.numeroPersonas || req.body.fecha || req.body.hora || req.body.usuarioId || req.body.menuId) {
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

    router.delete('/mesas/:id', function (req, res, next) {
        db.query(
          'SELECT * FROM mesa WHERE id=?',
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
                    'DELETE FROM mesa WHERE id=?',
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

module.exports = createRouterMesas;