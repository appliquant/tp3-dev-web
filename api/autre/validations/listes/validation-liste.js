const Joi = require("joi");

/**
 * Validation des données de création d'une liste
 */
const schemaCreationListe = Joi.object({
  titre: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .error(new Error("La liste du tableau doit contenir entre 1 et 50 caractères")),
});

module.exports = { schemaCreationListe };
