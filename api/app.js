"use strict";

const express = require("express");
const GenererMessageErreur = require("./autre/generer-message-erreur");
const mongoose = require("mongoose");
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
const utilisateurRoutes = require("./routes/utilisateur");
const tableauRoutes = require("./routes/tableau");
const listeRoutes = require("./routes/liste");
const carteRoutes = require("./routes/carte");

// Utilisation des routes en tant que middleware
app.use(authRoutes);
app.use(utilisateurRoutes);
app.use(tableauRoutes);
app.use(listeRoutes);
app.use(carteRoutes);

// Gestion des erreurs
// "Attrappe" les erreurs envoyé par "throw"
app.use(function (err, req, res, next) {
  console.trace(GenererMessageErreur(__filename, err));
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
