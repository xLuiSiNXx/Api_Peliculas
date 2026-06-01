import express from 'express';
import jwt from 'jsonwebtoken';
import sequelize from './database.js';
import Pelicula from './models/pelicula.js';
import SECRET_KEY, { verificarToken } from './middlewares/authMiddleware.js';

const app = express();

app.use(express.json());

// Inicializacion asincrona de la base de datos
try {
    await sequelize.authenticate();
    console.log('Conexion a la base de datos establecida exitosamente.');   
    await sequelize.sync({ force: false }); // Sincroniza los modelos con la base de datos
} catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1); // Termina la aplicacion si no se puede conectar a la base de datos
}





// =========================
// LOGIN
// =========================
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
        const user = {
            id: 1,
            username: 'admin'
        };

        const token = jwt.sign(user, SECRET_KEY, {
            expiresIn: '1h'
        });

        res.json({
            mensaje: 'Login exitoso',
            token: token
        });

    } else {
        res.status(401).json({
            mensaje: 'Credenciales invalidas'
        });
    }
});


// =========================
// GET - Todas las peliculas
// Protegido con JWT
// =========================
app.get('/peliculas', verificarToken, async (req, res) => {
    const peliculas = await Pelicula.findAll();
    res.json(peliculas);
});


// =========================
// GET - Pelicula por ID
// =========================
app.get('/peliculas/:id', verificarToken, async (req, res) => {
    const pelicula = await Pelicula.findByPk(req.params.id);

    if (pelicula) {
        res.json(pelicula);
    } else {
        res.status(404).json({
            error: 'Pelicula no encontrada'
        });
    }
});


// =========================
// POST - Crear pelicula
// =========================
app.post('/peliculas', verificarToken, async (req, res) => {
    const nuevaPelicula = await Pelicula.create(req.body);
    res.status(201).json(nuevaPelicula);
});


// =========================
// PUT - Actualizar pelicula
// =========================
app.put('/peliculas/:id', verificarToken, async (req, res) => {
    const pelicula = await Pelicula.findByPk(req.params.id);

    if (pelicula) {
        await pelicula.update(req.body);
        res.json(pelicula);
    } else {
        res.status(404).json({
            error: 'Pelicula no encontrada'
        });
    }
});


// =========================
// DELETE - Eliminar pelicula
// =========================
app.delete('/peliculas/:id', verificarToken, async (req, res) => {
    const eliminado = await Pelicula.destroy({
        where: {
            id: req.params.id
        }
    });

    res.json({
        eliminado: !!eliminado
    });
});


// =========================
// Puerto
// =========================
app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor ejecutandose en http://localhost:3000');
});