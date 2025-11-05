const bcrypt = require("bcryptjs")
const crypto = require("crypto")

const hashPassword = async (password) => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex")
}

const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, "")

  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) {
    return false
  }

  const cpfArray = cpf.split("").map((el) => +el)
  const rest = (count) => {
    return ((cpfArray.slice(0, count - 1).reduce((soma, el, index) => soma + el * (count - index), 0) * 10) % 11) % 10
  }

  return rest(10) === cpfArray[9] && rest(11) === cpfArray[10]
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

module.exports = {
  hashPassword,
  comparePassword,
  generateRandomToken,
  validateCPF,
  formatCurrency,
}
