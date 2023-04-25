const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const utilisateurSchema = new Schema(
	{
		nom: {
			type: String,
			required: true,
			unique: true,
		},
		courriel: {
			type: String,
			required: true,
			unique: true,
			match: [/.+@.+\..+/, "Adresse courriel invalide"],
		},
		motDePasse: {
			type: String,
			required: true,
			minlength: 6
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Utilisateur", utilisateurSchema);
