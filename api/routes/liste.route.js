"use strict";

const express = require("express");
const router = express.Router();

const estConnecte = require("../autre/middleware/est-connecte");
const utilisateurExiste = require("../autre/middleware/utilisateur-existe");

const listeController = require("../controllers/liste.controller");

// GET /tableaux/:tableauId/liste
router.get("/tableaux/:tableauId/listes", [estConnecte, utilisateurExiste], listeController.getListes);

// POST /tableaux/:tableauId/liste
router.post("/tableaux/:tableauId/listes", [estConnecte, utilisateurExiste], listeController.createListe);

// GET /tableaux/:tableauId/liste/:listeId
router.get("/tableaux/:tableauId/listes/:listeId", [estConnecte, utilisateurExiste], listeController.getListe);

// PUT /tableaux/:tableauId/liste/:listeId
router.put("/tableaux/:tableauId/listes/:listeId", [estConnecte, utilisateurExiste], listeController.updateListe);

// DELETE /tableaux/:tableauId/liste/:listeId
router.delete("/tableaux/:tableauId/listes/:listeId", [estConnecte, utilisateurExiste], listeController.deleteListe);

module.exports = router;
