import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Necesario para algunos servicios como Heroku
        }
    },
    logging: false // Desactiva el logging de Sequelize para evitar mensajes innecesarios en la consola
});

export default sequelize;