const genererMessageErreur = require("../autre/generer-message-erreur");
const { verifierJwt } = require("../autre/jwt/jwt-utils");

/**
 * Middleware qui demande qu'un utilisateur soit connecté
 * @returns Un objet "req.utilisateurId" contenant l'id de l'utilisateur
 */
const estConnecte = async (req, res, next) => {
  try {
    // Récupérer le token jwt
    let jwt = req.headers.authorization;

    // Vérifier si le token est présent
    if (!jwt) {
      return res.status(401).json({ message: "Vous devez être connecté pour accéder à cette ressource." });
    }

    // Parser le token
    // Récupérer le token après Bearer : Bearer <token> => <token>
    jwt = jwt.split(" ")[1];

    // Vérifier si le token est valide
    const payload = await verifierJwt(jwt);

    // Ajouter l'id de l'utilisateur à la requête
    req.utilisateurId = payload.id;

    // Passer à la suite
    next();
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};

module.exports = estConnecte;
