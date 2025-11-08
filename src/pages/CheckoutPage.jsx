import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ✅ Step 1: Validate Address
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (Object.values(address).some((field) => !field)) {
      alert("Please fill in all address fields before continuing.");
      return;
    }
    setStep(2);
  };

  // ✅ Step 2: Validate and Place Order
  const handleOrderSubmit = (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    // Card validation
    if (paymentMethod === "card") {
      const { cardNumber, ifsc, name, expiry, cvv } = paymentDetails;
      if (!cardNumber || !ifsc || !name || !expiry || !cvv) {
        alert("Please fill in all card details.");
        return;
      }
      if (!/^\d{16}$/.test(cardNumber)) {
        alert("Card number must be 16 digits.");
        return;
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
        alert("Invalid IFSC code format.");
        return;
      }
      if (!/^\d{3}$/.test(cvv)) {
        alert("CVV must be 3 digits.");
        return;
      }
    }

    // UPI validation
    if (paymentMethod === "upi") {
      const { upi } = paymentDetails;
      if (!upi || !/^[\w.-]+@[\w.-]+$/.test(upi)) {
        alert("Please enter a valid UPI ID (e.g., ajay@upi).");
        return;
      }
    }

    // COD confirmation
    if (paymentMethod === "cod") {
      alert("Cash on Delivery selected — please ensure correct delivery address.");
    }

    const orderData = {
      items: cart,
      total,
      address,
      paymentMethod,
      paymentDetails,
      date: new Date().toLocaleString(),
    };

    clearCart();
    setOrderPlaced(true);

    setTimeout(() => navigate("/order-success", { state: { order: orderData } }), 2000);
  };

  // ✅ Success Message
  if (orderPlaced) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-3xl font-semibold text-green-600 mb-4">
          ✅ Order Placed Successfully!
        </h2>
        <p className="text-gray-700">
          Thank you for shopping with <span className="text-purple-600 font-bold">MiniMartX</span>!<br />
          Redirecting you to the homepage...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">
        {step === 1 ? "📝 Shipping Address" : "💳 Payment Method"}
      </h1>

      {/* ✅ Step 1: Address Form */}
      {step === 1 && (
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          {["name", "phone", "address", "city", "state", "pincode"].map((key) => (
            <input
              key={key}
              type={key === "phone" || key === "pincode" ? "number" : "text"}
              placeholder={
                key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")
              }
              value={address[key]}
              onChange={(e) =>
                setAddress({ ...address, [key]: e.target.value })
              }
              className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
              required
            />
          ))}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
          >
            Continue to Payment
          </button>
        </form>
      )}

      {/* ✅ Step 2: Payment Form */}
      {step === 2 && (
        <form onSubmit={handleOrderSubmit} className="space-y-4">
          <label className="block font-medium text-gray-700">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setPaymentDetails({});
            }}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select a payment method</option>
            <option value="card">Credit / Debit Card</option>
            <option value="upi">UPI</option>
            <option value="cod">Cash on Delivery</option>
          </select>

          {/* ✅ Card Payment */}
          {paymentMethod === "card" && (
            <div className="space-y-3 p-4 border rounded-md bg-white">
              <input
                type="text"
                placeholder="Card Number (16 digits)"
                maxLength="16"
                className="w-full p-2 border rounded-md"
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="IFSC Code (e.g., SBIN0001234)"
                className="w-full p-2 border rounded-md uppercase"
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, ifsc: e.target.value.toUpperCase() })
                }
              />
              <input
                type="text"
                placeholder="Account Holder Name"
                className="w-full p-2 border rounded-md"
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, name: e.target.value })
                }
              />
              <div className="flex gap-2">
                <input
                  type="month"
                  className="w-1/2 p-2 border rounded-md"
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, expiry: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="CVV (3 digits)"
                  maxLength="3"
                  className="w-1/2 p-2 border rounded-md"
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, cvv: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* ✅ UPI Payment */}
          {paymentMethod === "upi" && (
            <div className="p-4 border rounded-md bg-white">
              <input
                type="text"
                placeholder="Enter your UPI ID (e.g. ajay@upi)"
                className="w-full p-2 border rounded-md"
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, upi: e.target.value })
                }
              />
            </div>
          )}

          {/* ✅ Cash on Delivery */}
          {paymentMethod === "cod" && (
            <div className="p-4 border rounded-md bg-white text-gray-700">
              💵 You can pay with cash, card, or UPI at the time of delivery.
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <p className="text-xl font-semibold">
              Total: ${total.toFixed(2)}
            </p>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Confirm & Place Order
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

