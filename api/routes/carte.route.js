const express = require("express");
const router = express.Router();

const estConnecte = require("../autre/middleware/est-connecte");
const utilisateurExiste = require("../autre/middleware/utilisateur-existe");

const carteController = require("../controllers/carte.controller");

// POST => /tableaux/:tableauId/listes/:listeId/cartes
router.post(
  "/tableaux/:tableauId/listes/:listeId/cartes",
  [estConnecte, utilisateurExiste],
  carteController.createCarte
);

// GET => /tableaux/:tableauId/listes/:listeId/cartes
router.get("/tableaux/:tableauId/listes/:listeId/cartes", [estConnecte, utilisateurExiste], carteController.getCartes);

// GET => /tableaux/:tableauId/listes/:listeId/cartes/:carteId
router.get(
  "/tableaux/:tableauId/listes/:listeId/cartes/:carteId",
  [estConnecte, utilisateurExiste],
  carteController.getCarte
);

// PUT => /tableaux/:tableauId/listes/:listeId/cartes/:carteId
router.put(
  "/tableaux/:tableauId/listes/:listeId/cartes/:carteId",
  [estConnecte, utilisateurExiste],
  carteController.updateCarte
);

// DELETE => /tableaux/:tableauId/listes/:listeId/cartes/:carteId
router.delete("/tableaux/:tableauId/listes/:listeId/cartes/:carteId", carteController.deleteCarte);

module.exports = router;
