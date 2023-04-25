const mongoose = require("mongoose");

const TableauSchema = new mongoose.Schema({
	titre: {
		type: String,
		required: true
	},
	listes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Liste"
	}],
	proprietaire: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Utilisateur",
		required: true
	}
}, {
	timestamps: true
});

module.exports = mongoose.model("Tableau", TableauSchema);
