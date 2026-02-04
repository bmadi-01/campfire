const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        app: "Campfire API 🔥",
        timestamp: new Date().toISOString()
    });
});
// Prefix API à mettre en production
// Routes
app.use('/auth', require('./routes/auth_routes'));
app.use('/utilisateurs', require('./routes/utilisateur_routes'));
app.use('/groupes', require('./routes/groupe_routes'));
app.use('/roles-groupes', require('./routes/role_groupe_routes'));
app.use('/plannings', require('./routes/planning_routes'));
app.use('/evenements', require('./routes/evenement_routes'));
app.use('/disponibilites', require('./routes/disponibilite_routes'));
app.use('/identites', require('./routes/identite_routes'));
app.use('/presences', require('./routes/presence_routes'));
app.use('/levels', require('./routes/level_routes'));
app.use('/roles', require('./routes/role_routes'));
app.use('/calendriers', require('./routes/calendrier_routes'));
app.use('/possede', require('./routes/possede_routes'));

app.use((req, res) => {
    res.status(404).json({
        error: 'Route non trouvée'
    });
});

module.exports = app;
