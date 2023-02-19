import { useState } from 'react'
import './App.css'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe("pk_test_51HDEnkE5iIaQvU2gyf2aMVGWFQyAZHMnKFyUO9FufNjUt1Y7Erw0M6AFNKzli87AuPXutdhACoUts3zAnSRTfJ9J00gG5IrPWt")

function App() {
  const [clientSecret, setClientSecret] = useState("")
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:8080/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        cardNumber: cardNumber,
        cardExpiry: cardExpiry,
        cardCvc: cardCvc,
      }),
    });
    const { clientSecret } = await response.json();
    setClientSecret(clientSecret);
  };

  const handleToken = async (token) => {
    const response = await fetch("http://localhost:8080/charge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentMethodId: token.paymentMethod.id,
        amount: 1000,
        currency: "USD",
      }),
    });
    const data = await response.json();
    console.log(data);
  };

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
      {clientSecret && (
        <Elements stripe={stripePromise}>
          <StripeCheckout
            handleToken={handleToken}
            amount={1000}
            currency="USD"
            description="Registration fee"
            clientSecret={clientSecret}
          />
        </Elements>
      )}
    </div>
  );
}



export default App
