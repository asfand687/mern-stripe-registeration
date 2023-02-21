import React, { useState } from 'react'
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from '../components/CheckoutForm'
import { Elements } from "@stripe/react-stripe-js"
const key = import.meta.env.VITE_STRIPE

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(key);

const CheckoutOne = () => {
  const [clientSecret, setClientSecret] = useState("")
  const [stripeToken, setStripeToken] = useState("")
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const onToken = (token) => {
    setStripeToken(token);
  }
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}

export default CheckoutOne