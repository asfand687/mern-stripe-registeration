import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import React, { useState } from 'react'

const CheckoutForm = () => {
  const [isPaymentLoading, setPaymentLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const payMoney = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setPaymentLoading(true);
    const response = await fetch("http://localhost:8080/get-client-secret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "Jared Leto",
        email: "jared@gmail.com"
      })
    })

    const { clientSecret } = await response.json()
    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Jared Leto",
          address: "114 St John Street, Montreal, Quebec"
        },
      },
    })

    setPaymentLoading(false)

    if (paymentResult.error) {
      alert(paymentResult.error.message);
    } else {
      if (paymentResult.paymentIntent.status === "succeeded") {
        alert("Success!");
      }
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
            <input className="card" type="text" placeholder="username" />
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