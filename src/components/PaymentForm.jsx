import React, { useState } from "react";

export default function PaymentForm({ total, onPlaceOrder }) {
  const [method, setMethod] = useState("");
  const [formData, setFormData] = useState({
    cardNumber: "",
    ifsc: "",
    holder: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};

    if (method === "Credit / Debit Card") {
      if (!/^\d{16}$/.test(formData.cardNumber)) {
        newErrors.cardNumber = "Card number must be 16 digits.";
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc)) {
        newErrors.ifsc = "Invalid IFSC code (e.g., SBIN0001234).";
      }
      if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "CVV must be 3 or 4 digits.";
      }
      if (formData.holder.trim().length < 3) {
        newErrors.holder = "Enter a valid account holder name.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onPlaceOrder(formData);
      alert("✅ Payment successful!");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-purple-700 flex items-center">
        💳 Payment Method
      </h2>

      <label className="block text-lg font-semibold mb-2">Payment Method</label>
      <select
        className="w-full border p-3 rounded mb-4"
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      >
        <option value="">Select a payment method</option>
        <option>Credit / Debit Card</option>
        <option>UPI</option>
        <option>Cash on Delivery</option>
      </select>

      {method === "Credit / Debit Card" && (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                className="w-full border p-3 rounded"
                value={formData.cardNumber}
                onChange={handleChange}
                maxLength={16}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm">{errors.cardNumber}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="ifsc"
                placeholder="IFSC Code"
                className="w-full border p-3 rounded"
                value={formData.ifsc}
                onChange={handleChange}
              />
              {errors.ifsc && (
                <p className="text-red-500 text-sm">{errors.ifsc}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="holder"
                placeholder="Account Holder Name"
                className="w-full border p-3 rounded"
                value={formData.holder}
                onChange={handleChange}
              />
              {errors.holder && (
                <p className="text-red-500 text-sm">{errors.holder}</p>
              )}
            </div>

            <div className="flex gap-3">
              <input
                type="month"
                name="expiry"
                className="flex-1 border p-3 rounded"
                value={formData.expiry}
                onChange={handleChange}
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                className="w-1/3 border p-3 rounded"
                value={formData.cvv}
                onChange={handleChange}
                maxLength={4}
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm">{errors.cvv}</p>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
              <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Confirm & Place Order
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
