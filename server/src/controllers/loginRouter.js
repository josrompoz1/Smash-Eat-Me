const express = require('express');

function createRouterLogin(db) {
    const router = express.Router();

    router.post('/signin', function (req, res, next) {
        password = req.body.contrasena
        query = "SELECT * FROM Usuario WHERE username=? AND contrasena='" + password + "'"
        db.query(
            query,
            [req.body.username],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    if (results.length == 0) {
                        res.status(401).json({ status: 'Usuario y/o contraseña inválidos' })
                    } else {
                        token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
                        dicc = { "id": results[0].id, "tipo": results[0].tipo, "token": token, "fechaLogin": +new Date() };
                        db.query(
                            'INSERT INTO UsuarioPrincipal (usuarioId, tipo, token, fechaLogin) VALUES (?,?,?,?)',
                            [dicc.id, dicc.tipo, dicc.token, dicc.fechaLogin],
                            (error, results) => {
                                if (error) {
                                    console.log(error);
                                    res.status(500).json({ status: 'error' });
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