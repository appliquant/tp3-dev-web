"use strict";

const express = require("express");

const router = express.Router();

const listeController = require("../controllers/listeController");


// GET /tableaux/:tableauId/liste
router.get("/tableaux/:tableauId/listes", listeController.getListes);

// POST /tableaux/:tableauId/liste
router.post("/tableaux/:tableauId/listes", listeController.createListe);

// GET /tableaux/:tableauId/liste/listeId
router.get("/tableaux/:tableauId/listes/:listeId", listeController.getListe);

// PUT /tableaux/:tableauId/liste/:listeId
router.put("/tableaux/:tableauId/listes/:listeId", listeController.updateListe);

// DELETE /tableaux/:tableauId/liste/:listeId
router.delete("/tableaux/:tableauId/listes/:listeId", listeController.deleteListe);

module.exports = router;

