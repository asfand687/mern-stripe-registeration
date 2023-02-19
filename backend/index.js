require("dotenv").config()
const express = require("express")
const connectDB = require("./mongodb/connect")

const app = express()
connectDB(process.env.MONGODB_URI)
const PORT = process.env.PORT || 8080

app.get("/", (req, res) => {
  res.send("Hello Express")
})

app.listen(process.env.PORT, () => {
  console.log(`App listening on port: ${PORT}`)
})
