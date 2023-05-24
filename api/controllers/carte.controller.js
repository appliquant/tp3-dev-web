"use strict";

const dotenv = require("dotenv");
dotenv.config();

const genererMessageErreur = require("../autre/generer-message-erreur");
const champsManquants = require("../autre/champs-manquants");
const { schemaCreationCarte } = require("../autre/validations/cartes/validation-carte");

const Tableau = require("../models/tableau");
const Liste = require("../models/liste");
const Carte = require("../models/carte");

exports.createCarte = async (req, res, next) => {
  try {
    // Récupérer les données du formulaire
    const { titre, description, dateLimite } = req.body;
    const tableauId = req.params.tableauId;
    const listeId = req.params.listeId;

    // Vérifier si les données sont présentes
    const errChamps = champsManquants({
      tableauId: tableauId,
      listeId: listeId,
      titre: titre,
      description: description,
      dateLimite: dateLimite,
    });

    if (errChamps.length > 0) {
      return res.status(400).json({ message: `Champs manquants : ${errChamps.join(", ")}.` });
    }

    // Validations
    const { error: errValidation } = schemaCreationCarte.validate({
      titre,
      description,
      dateLimite,
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
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à créer une carte dans ce tableau." });
    }

    // Trouver liste
    const liste = await Liste.findById(listeId);
    if (!liste) {
      return res.status(404).json({ message: "Liste non trouvée." });
    }

    // Vérifier que la liste appartient au tableau
    if (liste.tableau.toString() !== tableauId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à créer une carte dans cette liste." });
    }

    // Créer la carte
    const carte = new Carte({
      titre: titre,
      description: description,
      liste: listeId,
      dateLimite: dateLimite === "null" ? null : dateLimite,
    });

    // Sauvegarder la carte
    await carte.save();

    // Ajouter la carte à la liste
    liste.cartes.push(carte._id);

    // Sauvegarder la liste
    await liste.save();

    // Retourner la carte (id)
    res.status(201).json({ message: "Carte créée avec succès.", id: carte._id });
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};

exports.getCartes = async (req, res, next) => {
  try {
    // Récupérer les données du formulaire
    const { tableauId, listeId } = req.params;

    // Liste des filtres
    // cardsFilterNone      : cartes sans date limite
    // cardsFilterTomorrow  : cartes qui ont une date limite demain
    // cardsFilterLate      : cartes qui ont une date limite dépassée (retard)
    const { cardsFilterNone, cardsFilterTomorrow, cardsFilterLate } = req.query;

    // Aucun filtre défini (si auncun filtre spécifé)
    const filtresUndefined =
      cardsFilterNone === undefined && cardsFilterTomorrow === undefined && cardsFilterLate === undefined;

    // Tous les filtres sont à false (filtre spécifié, mais tous à false)
    const filtresTousAFalse =
      cardsFilterNone === "false" && cardsFilterTomorrow === "false" && cardsFilterLate === "false";

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

    // Vérifier que le propriétaire du tableau est le l'utilisateur
    if (tableau.proprietaire.toString() !== req.utilisateurId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à voir ces cartes." });
    }

    // Trouver liste
    const liste = await Liste.findById(listeId);
    if (!liste) {
      return res.status(404).json({ message: "Liste non trouvée." });
    }

    // Vérifier que la liste appartient au tableau
    if (liste.tableau.toString() !== tableauId) {
      return res.status(403).json({ message: "Cette liste n'appartient pas au tableau." });
    }

    // Objet carte
    let cartes = [];

    // Aucun filtre défini ou filtres tous à false
    if (filtresUndefined || filtresTousAFalse) {
      // Retourner toutes les cartes
      const cartes = await Carte.find({ liste: listeId });
      return res.status(200).json(cartes);
    }

    // Filtre "Aucune" défini
    if (cardsFilterNone === "true") {
      // Trouver toutes les cartes sans date limite
      cartes = await Carte.find({ liste: listeId, dateLimite: undefined });
    }

    // Filtre "Demain" définicartes
    if (cardsFilterTomorrow === "true") {
      // Trouver les cartes qui finissent demain
      const maint = new Date(); // maintenant
      const demain = new Date(new Date().setDate(maint.getDate() + 1)); // maintenant + 1 jour

      // Sauvegarder resultats (car multi-choix)
      cartes.push(await Carte.find({ liste: listeId, dateLimite: { $gte: maint, $lt: demain } }));
    }

    // Filtre "Retard" défini
    if (cardsFilterLate === "true") {
      // Récupérer les cartes qui sont en retard (dateLimite plus petite qu'aujourd'hui)
      const maint = new Date(); // maintenant

      // Sauvegarder résultats (car multi-choix)
      cartes.push(await Carte.find({ liste: listeId, dateLimite: { $lt: maint } }));
    }

    // Retirer les sub-arrays [[carte], [carte]] => [carte, carte]
    cartes = cartes.flat(1);

    // Retourner les cartes
    res.status(200).json(cartes);
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};

exports.getCarte = async (req, res, next) => {
  try {
    // Récupérer les données du formulaire
    const { tableauId, listeId, carteId } = req.params;

    // Vérifier si les données sont présentes
    const errChamps = champsManquants({
      tableauId: tableauId,
      listeId: listeId,
      carteId: carteId,
    });

    if (errChamps.length > 0) {
      return res.status(400).json({ message: `Champs manquants : ${errChamps.join(", ")}.` });
    }

    // Trouver tableau
    const tableau = await Tableau.findById(tableauId);
    if (!tableau) {
      return res.status(404).json({ message: "Tableau non trouvé." });
    }

    // Vérifier que le propriétaire du tableau est le l'utilisateur
    if (tableau.proprietaire.toString() !== req.utilisateurId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à voir cette carte." });
    }

    // Trouver liste
    const liste = await Liste.findById(listeId);
    if (!liste) {
      return res.status(404).json({ message: "Liste non trouvée." });
    }

    // Vérifier que la liste appartient au tableau
    if (liste.tableau.toString() !== tableauId) {
      return res.status(403).json({ message: "Cette liste n'appartient pas au tableau." });
    }

    // Trouver carte
    const carte = await Carte.findById(carteId);
    if (!carte) {
      return res.status(404).json({ message: "Carte non trouvée." });
    }

    // Vérifier que la carte appartient à la liste
    if (carte.liste.toString() !== listeId) {
      return res.status(403).json({ message: "Cette carte n'appartient pas à cette liste." });
    }

    // Retourner la carte
    res.status(200).json(carte);
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};

exports.updateCarte = async (req, res, next) => {
  try {
    // Récupérer les données du formulaire
    const { titre, description, dateLimite } = req.body;
    const { tableauId, listeId, carteId } = req.params;

    // Vérifier si les données sont présentes
    const errChamps = champsManquants({
      tableauId: tableauId,
      listeId: listeId,
      carteId: carteId,
      titre: titre,
      description: description,
      dateLimite: dateLimite,
    });

    if (errChamps.length > 0) {
      return res.status(400).json({ message: `Champs manquants : ${errChamps.join(", ")}.` });
    }

    // Validations
    const { error: errValidation } = schemaCreationCarte.validate({
      titre,
      description,
      dateLimite,
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
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette carte." });
    }

    // Trouver liste
    const liste = await Liste.findById(listeId);
    if (!liste) {
      return res.status(404).json({ message: "Liste non trouvée." });
    }

    // Vérifier que la liste appartient au tableau
    if (liste.tableau.toString() !== tableauId) {
      return res.status(403).json({ message: "Cette liste n'appartient pas au tableau." });
    }

    // Trouver carte
    const carte = await Carte.findById(carteId);
    if (!carte) {
      return res.status(404).json({ message: "Carte non trouvée." });
    }

    // Vérifier que la carte appartient à la liste
    if (carte.liste.toString() !== listeId) {
      return res.status(403).json({ message: "Cette carte n'appartient pas à cette liste." });
    }

    // Modifier la carte
    carte.titre = titre;
    carte.description = description;
    carte.dateLimite = dateLimite === "null" ? null : dateLimite;

    // Sauvegarder la carte
    await carte.save();

    // Retourner la carte
    res.status(201).json(carte);
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};

exports.deleteCarte = async (req, res, next) => {
  try {
    // Récupérer les données du formulaire
    const { tableauId, listeId, carteId } = req.params;

    // Vérifier si les données sont présentes
    const errChamps = champsManquants({
      tableauId: tableauId,
      listeId: listeId,
      carteId: carteId,
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
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette carte." });
    }

    // Trouver liste
    const liste = await Liste.findById(listeId);
    if (!liste) {
      return res.status(404).json({ message: "Liste non trouvée." });
    }

    // Vérifier que la liste appartient au tableau
    if (liste.tableau.toString() !== tableauId) {
      return res.status(403).json({ message: "Cette liste n'appartient pas au tableau." });
    }

    // Trouver carte
    const carte = await Carte.findById(carteId);
    if (!carte) {
      return res.status(404).json({ message: "Carte non trouvée." });
    }

    // Vérifier que la carte appartient à la liste
    if (carte.liste.toString() !== listeId) {
      return res.status(403).json({ message: "Cette carte n'appartient pas à cette liste." });
    }

    // Supprimer la carte
    await carte.deleteOne();

    // Retirer la carte de la liste
    await Liste.updateOne({ _id: listeId }, { $pull: { cartes: carteId } });

    // Retourner un message de succès
    res.status(200).json({ message: "Carte supprimée avec succès.", id: carte._id });
  } catch (err) {
    console.error(genererMessageErreur(__filename, err));
    next(err);
  }
};
