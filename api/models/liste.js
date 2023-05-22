const mongoose = require("mongoose");

const listeSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
    },
    cartes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Carte",
      },
    ],
    tableau: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tableau",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Liste", listeSchema);
