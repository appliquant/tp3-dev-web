const DONNEES_TEST_1 = {
  utilisateur: {
    nom: "Utilisateur 1",
    courriel: "123@hotmail.com",
    motDePasse: "123456",
  },
  tableau: {
    titre: "Tableau",
  },
  liste: {
    titre: "Liste",
  },
  carte: {
    titre: "Carte",
    description: "Description de la carte",
    dateLimite: new Date().toISOString(),
  },
};

const DONNEES_TEST_2 = {
  utilisateur: {
    nom: "Utilisateur 2",
    courriel: "123@gmail.com",
    motDePasse: "123456",
  },
  tableau: {
    titre: "Tableau",
  },
  liste: {
    titre: "Liste",
  },
  carte: {
    titre: "Carte",
    description: "Description de la carte",
    dateLimite: new Date().toISOString(),
  },
};

module.exports = { DONNEES_TEST_1, DONNEES_TEST_2 };
