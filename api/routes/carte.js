const express = require("express");
const router = express.Router();
const carteController = require("../controllers/carteController");


// POST => /tableaux/:tableauId/listes/:listeId/cartes
router.post("/tableaux/:tableauId/listes/:listeId/cartes", carteController.createCarte);

// GET => /tableaux/:tableauId/listes/:listeId/cartes
router.get("/tableaux/:tableauId/listes/:listeId/cartes", carteController.getCartes);

// GET => /tableaux/:tableauId/listes/:listeId/cartes/:carteId
router.get("/tableaux/:tableauId/listes/:listeId/cartes/:carteId", carteController.getCarte);

// PUT => /tableaux/:tableauId/listes/:listeId/cartes/:carteId
router.put("/tableaux/:tableauId/listes/:listeId/cartes/:carteId", carteController.updateCarte);

// DELETE => /tableaux/:tableauId/listes/:listeId/cartes/:carteId
router.delete("/tableaux/:tableauId/listes/:listeId/cartes/:carteId", carteController.deleteCarte);

module.exports = router;
