const express = require('express');

function createRouterLogin(db) {
    const router = express.Router();

    router.get('/signin', function (req, res, next) {
        db.query(
            'SELECT * FROM Usuario WHERE username=? AND contraseña=?',
            [req.body.username, req.body.contraseña],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({status: 'error'});
                } else {
                    if(results.length==0) {
                        res.status(401).json({status: 'Invalid credentials'})
                    } else {
                        token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
                        dicc = {"id":results[0].id, "tipo":results[0].tipo, "token":token};
                        db.query(
                            'INSERT INTO UsuarioPrincipal (usuarioId, tipo, token) VALUES (?,?,?)',
                            [dicc.id, dicc.tipo, dicc.token],
                            (error, results) => {
                                if(error) {
                                    console.log(error);
                                    res.status(500).json({status: 'error'});
                                } else {
                                    res.status(200).json(dicc);
                                }
                            }
                        )                        
                    }
                }
            }
        );
    });

    return router;
}

module.exports = createRouterLogin;