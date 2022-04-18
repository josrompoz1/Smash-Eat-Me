const express = require('express');

function createRouterRetos(db) {
    const router = express.Router();

    //---------------------------------ENDPOINTS RETOS DE SEGURIDAD---------------------------------
    router.get('/retos', function (req, res, next) {
        db.query(
            'SELECT * FROM reto',
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
            'SELECT * FROM reto WHERE id=?',
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

    router.put('/retos/:id/setfinished', function (req, res, next) {
        db.query(
            'SELECT * FROM reto WHERE id=?',
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
                            'UPDATE reto SET completado=TRUE WHERE id=?',
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

    //---------------------------------ENDPOINTS SOLUCIONES---------------------------------
    router.get('/soluciones/retos', function (req, res, next) {
        db.query(
            'SELECT * FROM solucion',
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

    router.get('/soluciones/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM solucion WHERE id=?',
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

    router.get('/soluciones/reto/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM solucion WHERE retoId=?',
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

    //---------------------------------ENDPOINTS PASOS DE LAS SOLUCIONES---------------------------------
    router.get('/pasos/solucion/:id', function (req, res, next) {
        db.query(
            'SELECT * FROM paso WHERE solucionId=?',
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

    return router;
}

module.exports = createRouterRetos;