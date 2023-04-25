const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
	titre: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: ""
	},
	liste: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "List",
		required: true
	},
	dateLimite: {
		type: Date,
		default: null
	}
}, {
	timestamps: true
});

module.exports = mongoose.model("Carte", CardSchema);
