"use strict";

const express = require("express");
const router = express.Router();

const estConnecte = require("../autre/middleware/est-connecte");
const tableauController = require("../controllers/tableau.controller");

// POST => /tableaux
router.post("/tableaux", estConnecte, tableauController.createTableau);

// GET => /tableaux
router.get("/tableaux", estConnecte, tableauController.getTableaux);

// GET => /tableaux/:tableauId
router.get("/tableaux/:tableauId", estConnecte, tableauController.getTableau);

// PUT => /tableaux/:tableauId
router.put("/tableaux/:tableauId", estConnecte, tableauController.updateTableau);

// DELETE => /tableaux/:tableauId
router.delete("/tableaux/:tableauId", estConnecte, tableauController.deleteTableau);

module.exports = router;
