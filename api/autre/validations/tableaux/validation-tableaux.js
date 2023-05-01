const Joi = require("joi");

/**
 * Validation des données de création d'un tableau
 */
const schemaCreationTableau = Joi.object({
  titre: Joi.string()
    .min(1)
    .max(50)
    .required()
    .error(new Error("Le titre du tableau doit contenir entre 1 et 50 caractères")),
});

module.exports = { schemaCreationTableau };
