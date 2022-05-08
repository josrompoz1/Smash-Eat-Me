function comprobarToken(db, token) {
    console.log("Aqui llego 2");
    db.query(
        'SELECT * FROM usuarioprincipal WHERE token=?',
        [token],
        (error, results) => {
            if(error) {
                console.log(error);
            } else {
                if(results.length>0) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    )
}

module.exports = comprobarToken;