const mongoose = require('mongoose')

// Define a user schema and model using Mongoose
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  cardNumber: String,
  cardExpiry: String,
  cardCvc: String,
})

const User = mongoose.model('User', userSchema)

module.exports = User