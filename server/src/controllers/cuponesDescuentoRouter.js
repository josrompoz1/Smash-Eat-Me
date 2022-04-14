const express = require('express');
const { route } = require('express/lib/application');

function createRouterCuponesDescuento(db) {
    const router = express.Router();

    //---------------------------------ENDPOINTS CUPONES DESCUENTO---------------------------------
    router.get('/cupones', function (req, res, next) {
        db.query(
            'SELECT * FROM cupondescuento',
            [10*(req.params.page || 0)],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({status: 'error'});
                } else {
                    res.status(200).json(results);
                }
            });
    });

    router.get('/cupones/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM cupondescuento WHERE id=?',
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
        });
    });

    router.get('/cupones/codigo/:codigo', function (req, res, next) {
        db.query(
            'SELECT * FROM cupondescuento WHERE codigo=?',
            [req.params.codigo],
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

    router.get('/cupones/porcentaje/:porcentaje', function (req, res, next) {
        db.query(
            'SELECT * FROM cupondescuento WHERE porcentaje=?',
            [req.params.porcentaje],
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

    router.post('/cupones', (req, res, next) => {
        db.query(
          'INSERT INTO cupondescuento (codigo, porcentaje) VALUES (?,?)',
          [req.body.codigo, req.body.porcentaje],
          (error) => {
            if (error) {
              if(req.body.codigo || req.body.porcentaje) {
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

    router.put('/cupones/:id/changepercent', function (req, res, next) {
        db.query(
            'SELECT * FROM cupondescuento WHERE id=?',
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
                            'UPDATE cupondescuento SET porcentaje=? WHERE id=?',
                            [req.body.porcentaje, req.params.id],
                            (error) => {
                                if (error) {
                                    if(req.body.porcentaje==undefined) {
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

    router.delete('/cupones/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM cupondescuento WHERE id=?',
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
                            'DELETE FROM cupondescuento WHERE id=?',
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

module.exports = createRouterCuponesDescuento;