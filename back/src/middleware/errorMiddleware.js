const notFound = (req, res, next) => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  // Mongoose bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404
    message = "Recurso não encontrado"
  }

  // Supabase errors
  if (err.code) {
    switch (err.code) {
      case "23505": // unique_violation
        statusCode = 400
        message = "Dados duplicados"
        break
      case "23503": // foreign_key_violation
        statusCode = 400
        message = "Referência inválida"
        break
      default:
        statusCode = 500
        message = "Erro interno do servidor"
    }
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

module.exports = {
  notFound,
  errorHandler,
}
