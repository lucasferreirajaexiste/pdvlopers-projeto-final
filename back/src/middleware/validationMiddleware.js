const Joi = require("joi")

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ")

      return res.status(400).json({
        error: "Dados inválidos",
        details: errorMessage,
      })
    }

    next()
  }
}

module.exports = { validate }
