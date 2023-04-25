/**
 * Vérifie si tous les champs sont définits
 * @param  {object} champs Un objet contenant les champs et leur valeur
 * @returns Une liste de tous les champs manquants
 * @example champsManquants({ nom: "John", courriel: "", ... });
 */
const champsManquants = (champs) => {
  let champsManquants = [];

  for (let cle in champs) {
    if (!champs[cle]) {
      champsManquants.push(cle);
    }
  }

  return champsManquants;
};

module.exports = champsManquants;
