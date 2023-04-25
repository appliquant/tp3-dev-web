"use strict";

const express = require("express");

const router = express.Router();

const tableauController = require("../controllers/tableauController");


// POST => /tableaux
router.post("/tableaux",  tableauController.createTableau);

// GET => /tableaux 
router.get("/tableaux",  tableauController.getTableaux);

// GET => /tableaux/:tableauId
router.get("/tableaux/:tableauId", tableauController.getTableau);

// PUT => /tableaux/:tableauId
router.put("/tableaux/:tableauId", tableauController.updateTableau);

// DELETE => /tableaux/:tableauId
router.delete("/tableaux/:tableauId", tableauController.deleteTableau);

module.exports = router;

