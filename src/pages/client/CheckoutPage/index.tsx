import React, { useState } from "react";
import Navbar from "@layout/Navbar";
import Footer from "@layout/Footer";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    cvv: "",
    expiry: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert("¡Pago procesado con éxito!");
    navigate('/ticket');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8FE]">
      <Navbar />
      <div className="container mx-auto px-4 py-10 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          <CheckoutForm handleChange={handleChange} />
          <CheckoutSummary handlePay={handlePay} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
