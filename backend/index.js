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
app.post('/register', async (req, res) => {
  const { username, email, password, cardNumber, cardExpiry, cardCvc } = req.body;

  try {
    // Create a PaymentIntent with the user's card details
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Replace with the amount you want to charge in cents
      currency: 'USD', // Replace with your preferred currency
      payment_method_data: {
        type: 'card',
        card: {
          number: cardNumber,
          exp_month: cardExpiry.substring(0, 2),
          exp_year: cardExpiry.substring(3, 5),
          cvc: cardCvc,
        },
      },
      metadata: {
        username,
        email,
        password,
      },
    });

    // Extract payment method ID from the PaymentIntent
    const paymentMethodId = paymentIntent.payment_method;

    // Return client secret and payment method ID in response
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentMethodId: paymentMethodId,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

// charge
app.post('/charge', async (req, res) => {
  const paymentMethodId = req.body.paymentMethodId;
  const amount = 1000; // Replace with the amount you want to charge in cents
  const currency = 'USD'; // Replace with your preferred currency

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: paymentMethodId,
      amount: amount,
      currency: currency,
      confirm: true
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port: ${PORT}`)
})
