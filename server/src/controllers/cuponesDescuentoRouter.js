const express = require('express');
const { route } = require('express/lib/application');

function createRouterCuponesDescuento(db) {
    const router = express.Router();

    //---------------------------------ENDPOINTS CUPONES DESCUENTO---------------------------------
    router.get('/cupones', function (req, res, next) {
        db.query(
            'SELECT * FROM CuponDescuento ORDER BY porcentaje',
            [10 * (req.params.page || 0)],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    res.status(200).json(results);
                }
            });
    });

    router.get('/cupones/codigo/:codigo', function (req, res, next) {
        db.query(
            'SELECT * FROM CuponDescuento WHERE codigo=?',
            [req.params.codigo],
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

    router.post('/cupones', (req, res, next) => {
        db.query(
            'INSERT INTO CuponDescuento (codigo, porcentaje) VALUES (?,?)',
            [req.body.codigo, req.body.porcentaje],
            (error) => {
                if (error) {
                    if (req.body.codigo || req.body.porcentaje) {
                        res.status(400).json({ status: 'Bad request' });
                    } else {
                        console.error(error);
                        res.status(500).json({ status: 'error' });
                    }
                } else {
                    res.status(201).json({ status: 'Cupon añadido correctamente' });
                }
            }
        );
    });

    router.put('/cupones/:id/changepercent/:porcentaje', function (req, res, next) {
        db.query(
            'SELECT * FROM CuponDescuento WHERE id=?',
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
                            'UPDATE CuponDescuento SET porcentaje=? WHERE id=?',
                            [req.params.porcentaje, req.params.id],
                            (error) => {
                                if (error) {
                                    if (req.params.porcentaje == undefined) {
                                        res.status(400).json({ status: 'Bad request' });
                                    } else {
                                        res.status(500).json({ status: 'error' });
                                    }
                                } else {
                                    res.status(201).json({ status: 'Porcentaje actualizado' });
                                }
                            }
                        );
                    }
                }
            }
        );
    });

    // FALTA
    router.delete('/cupones/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM CuponDescuento WHERE id=?',
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
                            'DELETE FROM CuponDescuento WHERE id=?',
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

module.exports = createRouterCuponesDescuento;