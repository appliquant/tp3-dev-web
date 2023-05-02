"use strict";

const dotenv = require("dotenv");
dotenv.config();

const GenererMessageErreur = require("../autre/generer-message-erreur");
const champsManquants = require("../autre/champs-manquants");
const { schemaInscription, schemaConnexion } = require("../autre/validations/auth/validation-auth");
const { hasherMotDePasse, verifierHash } = require("../autre/bcrypt/bcrypt-utils");
const { signJwt } = require("../autre/jwt/jwt-utils");

const Utilisateur = require("../models/utilisateur");

/**
 * Controlleur de connexion
 */
exports.connexion = async (req, res, next) => {
  try {
    // Récupérer les données du formulaire
    const { courriel, motDePasse } = req.body;

    // Vérifier si les données sont présentes
    const errChamps = champsManquants({
      courriel: courriel,
      motDePasse: motDePasse,
    });

    if (errChamps.length > 0) {
      return res.status(400).json({ message: `Champs manquants : ${errChamps.join(", ")}.` });
    }

    // Valider les données
    const { error: errValidation } = schemaConnexion.validate({
      courriel,
      motDePasse,
    });

    if (errValidation) {
      return res.status(400).json({ message: errValidation.message });
    }

    // Trouver utilisateur
    const utilisateur = await Utilisateur.findOne({ courriel: courriel });
    if (!utilisateur) {
      return res.status(400).json({ message: "Courriel et/ou mot de passe invalide." });
    }

    // Comparer mot de passe
    const match = await verifierHash(motDePasse, utilisateur.motDePasse);
    if (!match) {
      return res.status(400).json({ message: "Courriel et/ou mot de passe invalide." });
    }

    // Générer token jwt
    const jwt = await signJwt({ id: utilisateur._id });

    // Retourner token jwt
    res.setHeader("Authorization", `Bearer ${jwt}`);
    res.status(200).json({ message: "Utilisateur connecté." });
  } catch (err) {
    console.error(GenererMessageErreur(__filename, err));
    next(err);
  }
};

/**
 * Controlleur d'inscription
 */
exports.inscription = async (req, res, next) => {
  try {
    // Récupérer les données du formulaire
    const { nom, courriel, motDePasse, motDePasseConfirmation } = req.body;

    // Vérifier si les données sont présentes
    const errChamps = champsManquants({
      nom: nom,
      courriel: courriel,
      motDePasse: motDePasse,
      motDePasseConfirmation: motDePasseConfirmation,
    });

    if (errChamps.length > 0) {
      return res.status(400).json({ message: `Champs manquants : ${errChamps.join(", ")}.` });
    }

    // Validation des données
    const { error: errValidation } = schemaInscription.validate({
      nom,
      courriel,
      motDePasse,
      motDePasseConfirmation,
    });

    if (errValidation) {
      return res.status(400).json({ message: errValidation.message });
    }

    // Verifier si courriel existe déjà (avec courriel unique)
    const emailExiste = await Utilisateur.findOne({ courriel: courriel });
    if (emailExiste) {
      return res.status(400).json({ message: "Un utilisateur avec ce courriel existe déjà." });
    }

    // Vérifier si le nom existe déjà (avec nom unique)
    const nomExiste = await Utilisateur.findOne({ nom: nom });
    if (nomExiste) {
      return res.status(400).json({ message: "Un utilisateur avec ce nom existe déjà." });
    }

    // Hasher le mot de passe
    const hash = await hasherMotDePasse(motDePasse);

    // Créer un nouvel utilisateur
    const nouvelUtilisateur = new Utilisateur({
      nom: nom,
      courriel: courriel,
      motDePasse: hash,
    });

    // Sauvegarder l'utilisateur dans la base de données
    await nouvelUtilisateur.save();

    // Retourner un message de succès
    res.status(201).json({ message: "L'utilisateur a été créé avec succès." });
  } catch (err) {
    console.error(GenererMessageErreur(__filename, err));
    next(err);
  }
};
