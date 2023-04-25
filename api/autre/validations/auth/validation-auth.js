const Joi = require("joi");

/**
 * Validation des données du formulaire d'inscription
 */
const schemaInscription = Joi.object({
  nom: Joi.string().min(3).max(50).required().error(new Error("Le nom doit contenir entre 3 et 50 caractères")),
  courriel: Joi.string()
    .email()
    .max(50)
    .required()
    .error(new Error("Le courriel doit être valide, est obligatoire et ne doit pas dépasser 50 caractères")),
  motDePasse: Joi.string()
    .min(6)
    .max(50)
    .required()
    .error(new Error("Le mot de passe doit contenir entre 6 et 50 caractères")),
  motDePasseConfirmation: Joi.any()
    .valid(Joi.ref("motDePasse"))
    .required()
    .error(new Error("Le motDePasseConfirmation doit être identique à motDePasse")),
}).with("motDePasse", "motDePasseConfirmation");

const schemaConnexion = Joi.object({
  courriel: Joi.string()
    .email()
    .max(50)
    .required()
    .error(new Error("Le courriel doit être valide, est obligatoire et ne doit pas dépasser 50 caractères")),

  motDePasse: Joi.string()
    .min(6)
    .max(50)
    .required()
    .error(new Error("Le mot de passe doit contenir entre 6 et 50 caractères")),
});

module.exports = { schemaInscription, schemaConnexion };
