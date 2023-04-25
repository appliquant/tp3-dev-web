"use strict";

const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

// POST => /connexion
router.post("/connexion", authController.connexion);

// POST => /inscription
router.post("/inscription", authController.inscription);

module.exports = router;
