"use strict";

const dotenv = require("dotenv");
dotenv.config();

const GenererMessageErreur = require("../autre/generer-message-erreur");
const champsManquants = require("../autre/champs-manquants");
const { schemaCreationTableau } = require("../autre/validations/tableaux/validation-tableaux");

const Utilisateur = require("../models/utilisateur");
const Tableau = require("../models/tableau");
const Liste = require("../models/liste");
const Carte = require("../models/carte");

exports.createTableau = async (req, res, next) => {
  try {
    // Récupérer les données du formulaire
    const { titre } = req.body;

    // Vérifier si les données sont présentes
    const errChamps = champsManquants({
      titre: titre,
    });

    if (errChamps.length > 0) {
      return res.status(400).json({ message: `Champs manquants : ${errChamps.join(", ")}.` });
    }

    // Validations
    const { error: errValidation } = schemaCreationTableau.validate({
      titre,
    });

    if (errValidation) {
      return res.status(400).json({ message: errValidation.message });
    }

    // Vérifier que l'utilisateur existe
    const utilisateur = await Utilisateur.findById(req.utilisateurId);
    if (!utilisateur) {
      return res.status(400).json({ message: "Utilisateur inexistant." });
    }

    // Créer le tableau
    const tableau = new Tableau({
      titre: titre,
      liste: [],
      proprietaire: req.utilisateurId,
    });

    // Sauvegarder le tableau
    await tableau.save();

    // Retourner un message de succès
    res.status(201).json({ message: "Tableau créé.", id: tableau._id });
  } catch (err) {
    console.error(GenererMessageErreur(__filename, err));
    next(err);
  }
};

exports.getTableaux = async (req, res, next) => {
  try {
    // Vérifier que l'utilisateur existe
    const utilisateur = await Utilisateur.findById(req.utilisateurId);
    if (!utilisateur) {
      return res.status(400).json({ message: "Utilisateur inexistant." });
    }

    // Récupérer les tableaux de l'utilisateur
    const tableaux = await Tableau.find({ proprietaire: req.utilisateurId });

    // Retourner les tableaux
    res.status(200).json(tableaux);
  } catch (err) {
    console.error(GenererMessageErreur(__filename, err));
    next(err);
  }
};

exports.getTableau = async (req, res, next) => {
  try {
    // Récupérer l'id du tableau
    const tableauId = req.params.tableauId;

    // Vérifier si les données sont présentes
    const errChamps = champsManquants({
      titre: titre,
    });

    if (errChamps.length > 0) {
      return res.status(400).json({ message: `Champs manquants : ${errChamps.join(", ")}.` });
    }

    // Chercher tableau
    const tableau = await Tableau.findById(tableauId);
    if (!tableau) {
      return res.status(400).json({ message: "Tableau inexistant." });
    }

    // Veririfer que l'utilisateur existe
    const utilisateur = await Utilisateur.findById(req.utilisateurId);
    if (!utilisateur) {
      return res.status(400).json({ message: "Utilisateur inexistant." });
    }

    // Verifier que le proprietaire est l'utilisateur
    if (tableau.proprietaire.toString() !== utilisateur._id.toString()) {
      return res.status(403).json({ message: "Vous n'êtes pas le propriétaire de ce tableau." });
    }

    // Retourner le tableau
    res.status(200).json(tableau);
  } catch (err) {
    console.error(GenererMessageErreur(__filename, err));
    next(err);
  }
};

exports.updateTableau = (req, res, next) => {};

exports.deleteTableau = (req, res, next) => {};
