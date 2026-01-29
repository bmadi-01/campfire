const express = require("express");
const cors = require("cors");
const app = express();

// 🔹 Middlewares globaux (public)
app.use(cors());
app.use(express.json());

// 🔹 Routes PUBLIQUES
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        app: "Campfire API 🔥",
        timestamp: new Date().toISOString()
    });
});

// 🔹 Routes AUTH (login / register)
const authRoutes = require('./routes/auth_routes');
app.use('/auth', authRoutes);

// 🔹 Middleware JWT
const authJwt = require('./middleware/auth_jwt_middleware');

// 🔹 Routes PROTÉGÉES
const roleRoutes = require('./routes/role_routes');
app.use('/roles', authJwt.authenticate, roleRoutes);

// 👉 plus tard :
// app.use('/evenements', authJwt.authenticate, evenementRoutes);
// app.use('/planning', authJwt.authenticate, planningRoutes);

module.exports = app;

