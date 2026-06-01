import jwt from 'jsonwebtoken';

const SECRET_KEY = 'mi_clave_secreta_super_segura';

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            mensaje: 'Token requerido'
        });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                mensaje: 'Token invalido o expirado'
            });
        }

        req.user = decoded;
        next();
    });
};

export default SECRET_KEY;