const fs = require("fs")
const path = require("path")

const logDir = path.join(__dirname, "../../logs")
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

const logger = {
  info: (message, meta = {}) => {
    const log = {
      level: "INFO",
      message,
      meta,
      timestamp: new Date().toISOString(),
    }

    console.log(JSON.stringify(log))

    if (process.env.NODE_ENV === "production") {
      fs.appendFileSync(path.join(logDir, "app.log"), JSON.stringify(log) + "\n")
    }
  },

  error: (message, error = {}) => {
    const log = {
      level: "ERROR",
      message,
      error: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    }

    console.error(JSON.stringify(log))

    if (process.env.NODE_ENV === "production") {
      fs.appendFileSync(path.join(logDir, "error.log"), JSON.stringify(log) + "\n")
    }
  },
}

module.exports = logger
