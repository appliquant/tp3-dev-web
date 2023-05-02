const Utilisateur = require("../../models/utilisateur");
const GenererMessageErreur = require("../generer-message-erreur");

/**
 * Middleware qui vérifie si l'utilisateur existe avec l'id dans "req.utilisateurId"
 */
const utilisateurExiste = async (req, res, next) => {
  try {
    // Vérifier que l'utilisateur existe
    const utilisateur = await Utilisateur.findById(req.utilisateurId);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur inexistant." });
    }

    // Poursuivre
    next();
  } catch (err) {
    console.error(GenererMessageErreur(__filename, err));
    next(err);
  }
};

module.exports = utilisateurExiste;
