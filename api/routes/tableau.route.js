"use strict";

const express = require("express");
const router = express.Router();

const estConnecte = require("../autre/middleware/est-connecte");
const utilisateurExiste = require("../autre/middleware/utilisateur-existe");
const tableauController = require("../controllers/tableau.controller");

// POST => /tableaux
router.post("/tableaux", [estConnecte, utilisateurExiste], tableauController.createTableau);

// GET => /tableaux
router.get("/tableaux", [estConnecte, utilisateurExiste], tableauController.getTableaux);

// GET => /tableaux/:tableauId
router.get("/tableaux/:tableauId", [estConnecte, utilisateurExiste], tableauController.getTableau);

// PUT => /tableaux/:tableauId
router.put("/tableaux/:tableauId", [estConnecte, utilisateurExiste], tableauController.updateTableau);

// DELETE => /tableaux/:tableauId
router.delete("/tableaux/:tableauId", [estConnecte, utilisateurExiste], tableauController.deleteTableau);

module.exports = router;
