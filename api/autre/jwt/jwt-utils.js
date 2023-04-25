const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

/**
 * Signer un token JWT
 * @param {*} payload Objet contenant les données à signer
 * @returns Un token JWT expirant après 24h
 */
const signJwt = async (payload) => {
  try {
    return Promise.resolve(jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: "24h" }));
  } catch (err) {
    throw err;
  }
};

module.exports = { signJwt };
