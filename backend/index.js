require("dotenv").config()
const express = require("express")
const cors = require('cors')
const connectDB = require("./mongodb/connect")
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const app = express()
connectDB(process.env.MONGODB_URI)
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello Express")
})

// endpoint for creating a paymentIntent
app.post('/get-client-secret', async (req, res) => {
  const { username, email } = req.body;

  try {
    // Create a PaymentIntent with the user's card details
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Replace with the amount you want to charge in cents
      currency: 'usd', // Replace with your preferred currency
      automatic_payment_methods: { enabled: true },
      metadata: {
        username,
        email,
      },
    });


    // Extract payment method ID from the PaymentIntent
    const paymentMethodId = paymentIntent.payment_method;

    // Return client secret and payment method ID in response
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})


app.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
})


app.listen(process.env.PORT, () => {
  console.log(`App listening on port: ${PORT}`)
})
