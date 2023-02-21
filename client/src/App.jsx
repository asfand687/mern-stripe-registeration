import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CheckoutOne from './pages/CheckoutOne';
import CheckoutTwo from './pages/CheckoutTwo';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CheckoutOne />} />
        <Route path="/checkout-two" element={<CheckoutTwo />} />
      </Routes>
    </BrowserRouter>
  );
}



export default App
