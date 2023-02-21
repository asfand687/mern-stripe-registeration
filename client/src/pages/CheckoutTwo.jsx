import React, { useState } from 'react'
import StripeCheckout from "react-stripe-checkout"

const key = import.meta.env.VITE_STRIPE

const CheckoutTwo = () => {
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

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const response = await fetch("http://localhost:8080/register", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       username: username,
  //       email: email,
  //       password: password,
  //       cardNumber: cardNumber,
  //       cardExpiry: cardExpiry,
  //       cardCvc: cardCvc,
  //     }),
  //   });
  //   const { clientSecret } = await response.json();
  //   setClientSecret(clientSecret);
  // };

  // const handleToken = async (token) => {
  //   const response = await fetch("http://localhost:8080/charge", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       paymentMethodId: token.paymentMethod.id,
  //       amount: 1000,
  //       currency: "USD",
  //     }),
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch("http://localhost:8080/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tokenId: stripeToken.id,
          amount: 100,
        })
      })
      if (response.ok) {
        const data = await response.json()
        console.log(data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Card Number:
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </label>
        <label>
          Card Expiry:
          <input
            type="text"
            value={cardExpiry}
            onChange={(e) => setCardExpiry(e.target.value)}
          />
        </label>
        <label>
          CVC:
          <input
            type="text"
            value={cardCvc}
            onChange={(e) => setCardCvc(e.target.value)}
          />
        </label>
        <button type="submit">Register</button>
      </form>
      <StripeCheckout
        name="MD Hub"
        billingAddress
        shippingAddress
        description={`Your total is $100`}
        amount={100 * 100}
        token={onToken}
        stripeKey={key}
      >
        <button>
          CHECKOUT NOW
        </button>
      </StripeCheckout>

    </div>
  )

}

export default CheckoutTwo