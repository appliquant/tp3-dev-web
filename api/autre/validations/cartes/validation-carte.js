const Joi = require("joi");

/**
 * Validation des données de création d'une carte
 */
const schemaCreationCarte = Joi.object({
  titre: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .error(new Error("La titre doit contenir entre 1 et 50 caractères.")),

  description: Joi.string()
    .trim()
    .allow("") // Peut être vide
    .max(500)
    .error(new Error("La description ne doit pas dépasser 500 caractères")),

  dateLimite: Joi.date().error(new Error("La dateLimite doit être valide.")),
});

module.exports = { schemaCreationCarte };
