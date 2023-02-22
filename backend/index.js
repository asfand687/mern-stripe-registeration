require("dotenv").config()
const express = require("express")
const cors = require('cors')
const connectDB = require("./mongodb/connect")
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const User = require("./models/User")

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
  const { username, email, paymentMethod, customerId } = req.body;

  try {
    // Create a PaymentIntent with the user's card details

    const customer = customerId ? { id: customerId } :
      await stripe.customers.create({
        description: `Customer for MDHub- ${email}`,
        email: email,
        name: username,
        payment_method: paymentMethod
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000, // Replace with the amount you want to charge in cents
      currency: 'usd', // Replace with your preferred currency,
      payment_method: paymentMethod,
      customer: customer.id,
      setup_future_usage: "on_session",
      confirm: true,
      metadata: {
        username,
        email,
      },
    },
      (stripeErr, stripeRes) => {
        if (stripeErr) {
          res.status(500).json(stripeErr);
        } else {
          res.status(200).json(stripeRes);
        }
      });


    console.log(paymentIntent)
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

app.post("/create-customer", async (req, res) => {
  await stripe.customers.create({
    description: "Customer for MDHub",
    email: req.body.email,
    name: req.body.username
  },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr)
      } else {
        res.status(200).json(stripeRes)
      }
    })
})

app.post("/get-card-digits", async (req, res) => {
  const { customerId } = req.body
  try {
    const paymentMethod = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    })
    res.status(200).json(paymentMethod.data[0].card.last4)
  } catch (error) {
    res.status(500).json(error)
  }
})

app.post("/subscribe", async (req, res) => {
  try {
    const customerPaymentMethods = await stripe.paymentMethods.list({
      customer: 'cus_NOqLFVnxZMSKEA',
      type: 'card'
    })

    const paymentId = customerPaymentMethods.data[0].id

    await stripe.paymentIntents.create({
      amount: 30000, // Replace with the amount you want to charge in cents
      currency: 'usd', // Replace with your preferred currency,
      payment_method: paymentId,
      customer: 'cus_NOqLFVnxZMSKEA',
      setup_future_usage: "on_session",
      confirm: true,
      metadata: {
        username: "freddymercury",
        email: "freddy@gmail.com",
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: 'cus_NOqLFVnxZMSKEA',
      items: [
        {
          price: 'price_1MdvMZE5iIaQvU2gCGMrAcEU',
        },
      ],
      trial_period_days: 90,
      default_payment_method: paymentId, // Replace this with the customer's payment method ID
    })

    res.status(200).json(subscription)

  } catch (error) {
    res.status(500).json(error)
  }
})


app.listen(process.env.PORT, () => {
  console.log(`App listening on port: ${PORT}`)
})
