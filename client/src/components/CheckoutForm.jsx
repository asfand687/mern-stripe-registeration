import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import React, { useState } from 'react'

const CheckoutForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [isPaymentLoading, setPaymentLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const payMoney = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    try {
      setPaymentLoading(true);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (!error) {
        const response = await fetch("http://localhost:8080/get-client-secret", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            paymentMethod: paymentMethod.id,
            amount: 20000
          })
        })

        const data = await response.json()
        setPaymentLoading(false)
        if (data.status === "succeeded") {
          alert("Payment Succesful")
        } else {
          alert("Payment Unsuccesful")
        }
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div
      style={{
        padding: "3rem",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <form
          style={{
            display: "block",
            width: "100%",
          }}
          onSubmit={payMoney}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <input value={username} onChange={({ target }) => setUsername(target.value)} className="card" type="text" placeholder="username" />
            <input value={password} onChange={({ target }) => setPassword(target.value)} className="card" type="password" placeholder="password" />
            <input value={email} onChange={({ target }) => setEmail(target.value)} className="card" type="email" placeholder="email" />
            <CardElement
              className="card"
              options={{
                style: {
                  base: {
                    backgroundColor: "white"
                  }
                },
              }}
            />
            <button
              type="submit"
              className="pay-button"
              disabled={isPaymentLoading}
            >
              {isPaymentLoading ? "Loading..." : "Proceed With Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutForm