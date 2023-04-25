"use strict";

const express = require("express");

const router = express.Router();

const utilisateurController = require("../controllers/utilisateurController");


// POST => /utilisateurs
router.post("/utilisateurs",   utilisateurController.createUtilisateur);


// GET => /utilisateurs/:utilisateurId
router.get("/utilisateurs/:utilisateurId", utilisateurController.getUtilisateur);


module.exports = router;

