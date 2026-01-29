const authService = require('../services/auth_service');

/**
 * INSCRIPTION
 * POST /auth/register
 */
exports.register = async (req, res) => {
    try {
        const userData = req.body;

        const result = await authService.register(userData);

        return res.status(201).json({
            message: 'Utilisateur créé avec succès',
            utilisateur: result.utilisateur,
            token: result.token
        });

    } catch (error) {
        console.error('Register error:', error.message);

        return res.status(400).json({
            error: error.message
        });
    }
};

/**
 * CONNEXION
 * POST /auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            return res.status(400).json({
                error: 'Email et mot de passe requis'
            });
        }

        const result = await authService.login(email, mot_de_passe);

        return res.status(200).json({
            message: 'Connexion réussie',
            utilisateur: result.utilisateur,
            token: result.token
        });

    } catch (error) {
        console.error('Login error:', error.message);

        return res.status(401).json({
            error: error.message
        });
    }
};
