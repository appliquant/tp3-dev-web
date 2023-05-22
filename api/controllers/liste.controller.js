"use strict";

const dotenv = require("dotenv");
dotenv.config();

const genererMessageErreur = require("../autre/generer-message-erreur");
const champsManquants = require("../autre/champs-manquants");
const { schemaCreationListe } = require("../autre/validations/listes/validation-liste");

const Tableau = require("../models/tableau");
const Liste = require("../models/liste");

exports.createListe = async (req, res, next) => {
  try {
    // Récupérer les données du formulaire
    const { titre } = req.body;
    const tableauId = req.params.tableauId;

    // Vérifier si les données sont présentes
    const errChamps = champsManquants({
      titre: titre,
      tableauId: tableauId,
    });

    if (errChamps.length > 0) {
      return res.status(400).json({ message: `Champs manquants : ${errChamps.join(", ")}.` });
    }

    // Validations
    const { error: errValidation } = schemaCreationListe.validate({
      titre,
    });

    if (errValidation) {
      return res.status(400).json({ message: errValidation.message });
    }

    // Trouver tableau
    const tableau = await Tableau.findById(tableauId);
    if (!tableau) {
      return res.status(404).json({ message: "Tableau non trouvé." });
    }

    // Vérifier que le propriétaire du tableau est le l'utilisateur
    if (tableau.proprietaire.toString() !== req.utilisateurId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à créer une liste dans ce tableau." });
    }

    // Créer la liste
    const liste = new Liste({
      titre: titre,
      cartes: [],
      tableau: tableauId,
    });

    // Sauvegarder la liste
    await liste.save();

    // Ajouter la liste au tableau
    tableau.listes.push(liste._id);

    // Sauvegarder le tableau
    await tableau.save();

    // Retourner un message de succès
    res.status(201).json({ message: "Liste créée.", id: liste._id });
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};

exports.getListes = async (req, res, next) => {
  try {
    // Récupérer les données
    const tableauId = req.params.tableauId;

    // Vérifier si les données sont présentes
    const errChamps = champsManquants({
      tableauId: tableauId,
    });

    if (errChamps.length > 0) {
      return res.status(400).json({ message: `Champs manquants : ${errChamps.join(", ")}.` });
    }

    // Trouver tableau
    const tableau = await Tableau.findById(tableauId);
    if (!tableau) {
      return res.status(404).json({ message: "Tableau non trouvé." });
    }

    // Vérifier que le propriétaire du tableau est l'utilisateur
    if (tableau.proprietaire.toString() !== req.utilisateurId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à voir les listes de ce tableau." });
    }

    // Trouver les listes
    const listes = await Liste.find({ tableau: tableauId });

    // Retourner les listes
    res.status(200).json(listes);
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};

exports.getListe = async (req, res, next) => {
  try {
    // Récupérer les données
    const tableauId = req.params.tableauId;
    const listeId = req.params.listeId;

    // Vérifier si les données sont présentes
    const errChamps = champsManquants({
      tableauId: tableauId,
      listeId: listeId,
    });

    if (errChamps.length > 0) {
      return res.status(400).json({ message: `Champs manquants : ${errChamps.join(", ")}.` });
    }

    // Trouver tableau
    const tableau = await Tableau.findById(tableauId);
    if (!tableau) {
      return res.status(404).json({ message: "Tableau non trouvé." });
    }

    // Vérifier que le propriétaire du tableau est l'utilisateur
    if (tableau.proprietaire.toString() !== req.utilisateurId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à voir cette liste." });
    }

    // Trouver la liste
    const liste = await Liste.findById(listeId);
    if (!liste) {
      return res.status(404).json({ message: "Liste non trouvée." });
    }

    // Vérifier que la liste appartient au tableau
    if (liste.tableau.toString() !== tableauId) {
      return res.status(403).json({ message: "Cette liste n'appartient pas au tableau." });
    }

    // Retourner la liste
    res.status(200).json(liste);
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};

exports.updateListe = async (req, res, next) => {
  try {
    // Récupérer les données
    const tableauId = req.params.tableauId;
    const listeId = req.params.listeId;
    const { titre } = req.body;

    // Vérifier si les données sont présentes
    const errChamps = champsManquants({
      tableauId: tableauId,
      listeId: listeId,
      titre: titre,
    });

    if (errChamps.length > 0) {
      return res.status(400).json({ message: `Champs manquants : ${errChamps.join(", ")}.` });
    }

    // Validations
    const { error: errValidation } = schemaCreationListe.validate({
      titre,
    });

    if (errValidation) {
      return res.status(400).json({ message: errValidation.message });
    }

    // Trouver tableau
    const tableau = await Tableau.findById(tableauId);
    if (!tableau) {
      return res.status(404).json({ message: "Tableau non trouvé." });
    }

    // Vérifier que le propriétaire du tableau est l'utilisateur
    if (tableau.proprietaire.toString() !== req.utilisateurId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette liste." });
    }

    // Trouver la liste
    const liste = await Liste.findById(listeId);
    if (!liste) {
      return res.status(404).json({ message: "Liste non trouvée." });
    }

    // Vérifier que la liste appartient au tableau
    if (liste.tableau.toString() !== tableauId) {
      return res.status(403).json({ message: "Cette liste n'appartient pas au tableau." });
    }

    // Modifier la liste
    liste.titre = titre;

    // Sauvegarder la liste
    await liste.save();

    // Retourner un message de succès
    res.status(201).json(liste);
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};

exports.deleteListe = async (req, res, next) => {
  try {
    // Récupérer les données
    const tableauId = req.params.tableauId;
    const listeId = req.params.listeId;

    // Vérifier si les données sont présentes
    const errChamps = champsManquants({
      tableauId: tableauId,
      listeId: listeId,
    });

    if (errChamps.length > 0) {
      return res.status(400).json({ message: `Champs manquants : ${errChamps.join(", ")}.` });
    }

    // Trouver tableau
    const tableau = await Tableau.findById(tableauId);
    if (!tableau) {
      return res.status(404).json({ message: "Tableau non trouvé." });
    }

    // Vérifier que le propriétaire du tableau est l'utilisateur
    if (tableau.proprietaire.toString() !== req.utilisateurId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette liste." });
    }

    // Trouver la liste
    const liste = await Liste.findById(listeId);
    if (!liste) {
      return res.status(404).json({ message: "Liste non trouvée." });
    }

    // Vérifier que la liste appartient au tableau
    if (liste.tableau.toString() !== tableauId) {
      return res.status(403).json({ message: "Cette liste n'appartient pas au tableau." });
    }

    // Supprimer la liste
    await liste.deleteOne();

    // Retourner un message de succès
    res.status(200).json({ message: "Liste supprimée." });
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};
