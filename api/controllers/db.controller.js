"use strict";

const dotenv = require("dotenv");
dotenv.config();

const genererMessageErreur = require("../autre/generer-message-erreur");
const { hasherMotDePasse } = require("../autre/bcrypt/bcrypt-utils");

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
    // Créer un nouvel utilisateur
    const hash = await hasherMotDePasse("123456");

    const utilisateur = new Utilisateur({
      nom: "Utilisateur 1",
      courriel: "123@hotmail.com",
      motDePasse: hash,
    });

    // Sauvegarder le nouvel utilisateur
    await utilisateur.save();

    // Créer un nouveau tableau
    const tableau = new Tableau({
      titre: "Tableau 1",
      liste: [],
      proprietaire: utilisateur._id,
    });

    // Créer une nouvelle liste
    const liste = new Liste({
      titre: "Liste 1",
      cartes: [],
      tableau: tableau._id,
    });

    // Ajouter la liste au tableau
    tableau.listes.push(liste);

    // Sauvegarder la liste & le tableau
    await liste.save();
    await tableau.save();

    // Créer la carte
    const carte = new Carte({
      titre: "Carte 1",
      description: "Description de la carte 1",
      liste: liste,

      // Sauvegarder en UTC
      dateLimite: new Date().toISOString(),
    });

    // Ajouter la carte à la liste
    liste.cartes.push(carte);

    // Sauvegarder la carte & la liste
    await carte.save();
    await liste.save();

    // Répondre avec un message de succès
    res.sendStatus(200);
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};
