"use strict";

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");

const genererMessageErreur = require("./autre/generer-message-erreur");

const swaggerDocumentYAML = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(swaggerDocumentYAML);

const app = express();

// parse application/json
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
  next();
});

// Vérifier les headers pour les requêtes POST et PUT pour lire "req.body"
app.use((req, res, next) => {
  // Requête POST et PUT, header doit être "application/json"
  if (req.method === "POST" || req.method === "PUT") {
    if (req.headers["content-type"] !== "application/json") {
      return res.status(400).json({ message: "Content-Type doit être application/json" });
    }
  }
  next();
});

// Importe les routes
const authRoutes = require("./routes/auth.route");
const tableauRoutes = require("./routes/tableau.route");
const listeRoutes = require("./routes/liste.route");
const carteRoutes = require("./routes/carte.route");
const utilisateurRoutes = require("./routes/utilisateur");
const dbRoutes = require("./routes/db.route");

// Utilisation des routes en tant que middleware
app.use(authRoutes);
app.use(tableauRoutes);
app.use(listeRoutes);
app.use(carteRoutes);
app.use(utilisateurRoutes);
app.use(dbRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Gestion des erreurs
// "Attrappe" les erreurs envoyé par "throw"
app.use(function (err, req, res, next) {
  console.trace(genererMessageErreur(__filename, err));
  if (!err.statusCode) {
    err.statusCode = 500;
  }

  res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
});

const PORT = process.env.PORT ?? 3000;
mongoose
  .connect(process.env.DATA_BASE)
  .then(() => {
    app.listen(3000, () => {
      console.log("🌎 Node.js est à l'écoute sur http://localhost:%s ", PORT);
    });
  })
  .catch((err) => console.log(err));
