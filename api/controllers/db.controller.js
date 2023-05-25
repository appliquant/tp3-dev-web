"use strict";

const dotenv = require("dotenv");
dotenv.config();

const genererMessageErreur = require("../autre/generer-message-erreur");
const { hasherMotDePasse } = require("../autre/bcrypt/bcrypt-utils");
const { DONNEES_TEST_1, DONNEES_TEST_2 } = require("../autre/donnes-tests");

const Utilisateur = require("../models/utilisateur");
const Tableau = require("../models/tableau");
const Liste = require("../models/liste");
const Carte = require("../models/carte");

// Supprimer toutes les données de la base de données
exports.drop = async (req, res, next) => {
  try {
    // Supprimer toutes les données
    await Promise.all([
      await Utilisateur.deleteMany({}),
      await Tableau.deleteMany({}),
      await Liste.deleteMany({}),
      await Carte.deleteMany({}),
    ]);

    // Répondre avec un message de succès
    res.sendStatus(200);
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};

// Remplir la base de données avec des données de test
exports.seed = async (req, res, next) => {
  try {
    const hash = await hasherMotDePasse("123456");

    for (const donnees of [DONNEES_TEST_1, DONNEES_TEST_2]) {
      donnees.utilisateur.motDePasse = hash;

      // Créer des données de test
      const [utilisateur, tableau1, tableau2, listes, cartes] = await creerDonneesTest(donnees);

      // Sauvegarder les données de test dans la base de données
      await seedDb(utilisateur, [tableau1, tableau2], listes, cartes);
    }

    // Répondre avec un message de succès
    res.sendStatus(200);
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};

/**
 * Créer des données de test.
 * Un utilisateur à deux tableaux, chaque tableau à deux listes, chaque liste à deux cartes.
 * @param {} donnees
 * @returns Les données de test
 */
const creerDonneesTest = async (donnees) => {
  try {
    // const { utilisateur, tableau, liste, carte } = donnees;

    // Créer données de test
    const utilisateur = creerDonneesTestUtilisateur(donnees.utilisateur);

    // Créer deux tableaux
    const tableau1 = creerDonneesTestTableau(utilisateur, donnees.tableau);
    const tableau2 = creerDonneesTestTableau(utilisateur, {
      ...donnees.tableau,
      titre: `${donnees.tableau.titre} 2`,
    });

    /////////////////////////////////////////
    // Créer deux listes par tableau
    /////////////////////////////////////////
    const listes = [];
    for (let i = 0; i < 2; i++) {
      const liste = creerDonneesTestListe(tableau1, {
        ...donnees.liste,
        titre: `${donnees.liste.titre} ${i}`,
      });
      listes.push(liste);
    }

    for (let i = 0; i < 2; i++) {
      const liste = creerDonneesTestListe(tableau2, {
        ...donnees.liste,
        titre: `${donnees.liste.titre} ${i}`,
      });
      listes.push(liste);
    }

    /////////////////////////////////////////
    // Créer 3 cartes pour chaque liste
    /////////////////////////////////////////
    const cartes = [];

    for (const liste of listes) {
      // Ajouter 3 cartes avec des dates limites
      for (let i = 0; i < 4; i++) {
        const dateLimiteGeneree = i <= 2 ? creerDonnesTestDateLimite(i) : null;
        const carte = creerDonneesTestCarte(liste, dateLimiteGeneree, {
          ...donnees.carte,
          titre: `${donnees.carte.titre} ${i}`,
          description: `${donnees.carte.description} ${i}`,
        });

        cartes.push(carte);

        // Ajouter la carte à la liste
        liste.cartes.push(carte);
      }
    }

    return [utilisateur, tableau1, tableau2, listes, cartes];
  } catch (err) {
    throw err;
  }
};

/**
 * Créer un nouvel utilisateur
 * @param {*} donnees Données de l'utilisateur
 */
const creerDonneesTestUtilisateur = (donnees) => {
  try {
    // Créer un nouvel utilisateur
    const utilisateur = new Utilisateur({
      nom: donnees.nom,
      courriel: donnees.courriel,
      motDePasse: donnees.motDePasse,
    });

    return utilisateur;
  } catch (err) {
    throw err;
  }
};

/**
 * Créer un nouveau tableau
 * @param {*} utilisateur Utilisateur parent
 * @param {*} donnees Données du tableau
 */
const creerDonneesTestTableau = (utilisateur, donnees) => {
  try {
    // Créer un nouveau tableau
    const tableau = new Tableau({
      titre: donnees.titre,
      liste: [],
      proprietaire: utilisateur,
    });

    return tableau;
  } catch (err) {
    throw err;
  }
};

/**
 * Créer une nouvelle liste
 * @param {*} tableau Tableau parent
 * @param {*} donnees Données de la liste
 */
const creerDonneesTestListe = (tableau, donnees) => {
  try {
    // Créer une nouvelle liste
    const liste = new Liste({
      titre: donnees.titre,
      cartes: [],
      tableau: tableau,
    });

    return liste;
  } catch (err) {
    throw err;
  }
};

/**
 * Créer une nouvelle carte
 * @param {*} liste Liste parente
 * @param {*} dateLimite Date limite
 * @param {*} donnees Données de la carte
 */
const creerDonneesTestCarte = (liste, dateLimite, donnees) => {
  try {
    // Créer une nouvelle carte
    const carte = new Carte({
      titre: donnees.titre,
      description: donnees.description,
      liste: liste,
      dateLimite: dateLimite,
    });

    return carte;
  } catch (err) {
    throw err;
  }
};

/**
 * Retourne une date limite aléatoires (une dans le futur, une dans le passé)
 * @param {*} index Index de la date limite
 * @returns Date limite
 */
const creerDonnesTestDateLimite = (index) => {
  // Retourne des dates limites aléatoires
  const maintenant = new Date();

  const dans5Heures = new Date();
  dans5Heures.setHours(maintenant.getHours() + 5);

  const demain = new Date();
  demain.setDate(maintenant.getDate() + 2);

  const enRetard = new Date();
  enRetard.setDate(maintenant.getDate() - 1);

  const dates = [demain.toISOString(), enRetard.toISOString(), dans5Heures.toISOString()];

  return dates[index];
};

/**
 * Sauvegarder les données de test dans la base de données
 * @param {*} utilisateur Utilisateur
 * @param {*} tableaux Tableaux
 * @param {*} listes Listes
 * @param {*} cartes Cartes
 */
const seedDb = async (utilisateur, tableaux, listes, cartes) => {
  try {
    // Sauvegarder l'utilisateur
    await utilisateur.save();

    // Sauvegarder les tableaux
    for (const tableau of tableaux) {
      await tableau.save();
    }

    // Sauvegarder les listes
    for (const liste of listes) {
      await liste.save();
    }

    // Sauvegarder les cartes
    for (const carte of cartes) {
      await carte.save();
    }
  } catch (err) {
    throw err;
  }
};
