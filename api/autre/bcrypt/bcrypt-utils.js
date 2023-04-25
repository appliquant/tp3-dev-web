const bcrypt = require("bcrypt");

/**
 * Hasher un mot de passe
 * @param {string} motDePasse Mot de passe à hasher
 * @returns {Promise<string>} Mot de passe hashé
 */
const hasherMotDePasse = async (motDePasse) => {
  try {
    const saltRounds = 10;
    return Promise.resolve(await bcrypt.hash(motDePasse, saltRounds));
  } catch (err) {
    throw err;
  }
};

/**
 * Vérifier si le mot de passe correspond au hash
 * @param {string} motDePasse Mot de passe à vérifier
 * @param {string} hash Hash du mot de passe
 * @returns {Promise<boolean>} Vrai si le mot de passe correspond au hash
 **/
const verifierHash = async (motDePasse, hash) => {
  try {
    const match = await bcrypt.compare(motDePasse, hash);
    return match;
  } catch (err) {
    throw err;
  }
};

module.exports = { hasherMotDePasse, verifierHash };
