const express = require('express');

function createRouterRetos(db) {
    const router = express.Router();

    //---------------------------------ENDPOINTS RETOS DE SEGURIDAD---------------------------------
    router.get('/retos', function (req, res, next) {
        db.query(
            'SELECT * FROM Reto ORDER BY dificultad',
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

    router.get('/retos/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Reto WHERE id=?',
            [req.params.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({status: 'error'});
                } else {
                    res.status(200).json(results[0]);
                }
            }
        );
    });

    router.get('/retos/categoria/:categoria', function (req, res, next) {
        db.query(
            'SELECT * FROM Reto WHERE categoria=?',
            [req.params.categoria],
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

    router.get('/retos/dificultad/:minimo/:maximo', function (req, res, next) {
        db.query(
            'SELECT * FROM Reto WHERE dificultad BETWEEN ? AND ?',
            [req.params.minimo, req.params.maximo],
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

    router.get('/retos/categoria/:categoria/dificultad/:minimo/:maximo', function (req, res, next) {
        db.query(
            'SELECT * FROM Reto WHERE categoria=? AND dificultad BETWEEN ? AND ?',
            [req.params.categoria, req.params.minimo, req.params.maximo],
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

    router.get('/retos/count/todos', function (req, res, next) {
        db.query(
            'SELECT COUNT(*) FROM Reto',
            [],
            (error, count) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({status: 'error'});
                } else {
                    res.status(200).json(count[0]['COUNT(*)']);
                }
            }
        );
    });

    router.get('/retos/count/completados', function (req, res, next) {
        db.query(
            'SELECT COUNT(*) FROM Reto WHERE completado=true',
            [],
            (error, count) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({status: 'error'});
                } else {
                    res.status(200).json(count[0]['COUNT(*)']);
                }
            }
        );
    });

    // FALTA
    router.put('/retos/:id/setfinished', function (req, res, next) {
        db.query(
            'SELECT * FROM Reto WHERE id=?',
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
                            'UPDATE Reto SET completado=TRUE WHERE id=?',
                            [req.params.id],
                            (error) => {
                                if (error) {
                                    res.status(500).json({status: 'error'});
                                } else {
                                    res.status(204).json({status: 'Resource updated successfully'});
                                }
                            }
                        );
                    }
                }
            }
        );
    });

    //---------------------------------ENDPOINTS SOLUCIONES---------------------------------
    router.get('/soluciones/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Solucion WHERE id=?',
            [req.params.id],
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

    router.get('/soluciones/reto/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Solucion WHERE retoId=?',
            [req.params.id],
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

    //---------------------------------ENDPOINTS PASOS DE LAS SOLUCIONES---------------------------------
    router.get('/pasos/solucion/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Paso WHERE solucionId=? ORDER BY numero',
            [req.params.id],
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

    //---------------------------------ENDPOINTS PISTAS DE LOS RETOS---------------------------------
    router.get('/pista/reto/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM Pista WHERE retoId=?',
            [req.params.id],
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

    return router;
}

module.exports = createRouterRetos;