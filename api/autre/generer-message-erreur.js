var colors = require('colors/safe');

/**
 * Génère un message d'erreur stylé
 * @param {__filename} constanteFilename Constante "__filename"
 * @param {string} messageErreur Message d'erreur
 
 * @returns {string} Retourne un message d'erreur
 */
const GenererMessageErreur = (constanteFilename, messageErreur) => {
  let nomFichier = constanteFilename.split("/").pop()
  nomFichier = colors.red.underline(`[${nomFichier}] erreur`);
  return `${nomFichier} : ${messageErreur}`;
}

module.exports = GenererMessageErreur;