const express = require("express");
const router = express.Router();

// const estConnecte = require("../middleware/est-connecte");

const dbController = require("../controllers/db.controller");

// POST /db/seed
router.get("/db/seed", dbController.seed);

// GET /db/drop
router.get("/db/drop", dbController.drop);

module.exports = router;
