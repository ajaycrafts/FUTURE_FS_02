import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addingNew, setAddingNew] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ✅ Load saved addresses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedAddresses");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAddressList(parsed);
      setSelectedAddress(parsed[0] || null);
    }
  }, []);

  // ✅ Save address list to localStorage
  const updateStorage = (list) => {
    localStorage.setItem("savedAddresses", JSON.stringify(list));
    setAddressList(list);
  };

  // ✅ Add new address
  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (Object.values(newAddress).some((v) => !v)) {
      alert("Please fill all fields!");
      return;
    }

    if (
      addressList.some(
        (a) =>
          a.address.toLowerCase() === newAddress.address.toLowerCase() &&
          a.pincode === newAddress.pincode
      )
    ) {
      alert("This address already exists!");
      return;
    }

    const updated = [...addressList, newAddress];
    updateStorage(updated);
    setSelectedAddress(newAddress);
    setNewAddress({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
    setAddingNew(false);
  };

  // ✅ Delete address
  const handleDeleteAddress = (index) => {
    const updated = addressList.filter((_, i) => i !== index);
    updateStorage(updated);

    if (updated.length === 0) setSelectedAddress(null);
    else if (selectedAddress === addressList[index])
      setSelectedAddress(updated[0]);
  };

  // ✅ Proceed to Payment
  const handleContinue = () => {
    if (!selectedAddress) {
      alert("Please select an address before continuing.");
      return;
    }
    setStep(2);
  };

  // ✅ Place Order
  const handleOrderSubmit = (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

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

    if (paymentMethod === "upi") {
      const { upi } = paymentDetails;
      if (!upi || !/^[\w.-]+@[\w.-]+$/.test(upi)) {
        alert("Please enter a valid UPI ID (e.g., ajay@upi).");
        return;
      }
    }

    const orderData = {
      items: cart,
      total,
      address: selectedAddress,
      paymentMethod,
      paymentDetails,
      date: new Date().toLocaleString(),
    };

    clearCart();
    setOrderPlaced(true);

    setTimeout(() => navigate("/order-success", { state: { order: orderData } }), 2000);
  };

  // ✅ Order success message
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

      {/* ✅ Step 1: Address Selection */}
      {step === 1 && (
        <div className="space-y-4">
          {addressList.length > 0 && !addingNew && (
            <>
              <h2 className="text-lg font-semibold text-gray-800">Select a Saved Address:</h2>
              {addressList.map((addr, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedAddress(addr)}
                  className={`border p-4 rounded-md flex justify-between items-start cursor-pointer transition-all duration-200 ${
                    selectedAddress === addr
                      ? "border-purple-600 bg-purple-50 shadow-[0_0_10px_rgba(168,85,247,0.4)] scale-[1.02]"
                      : "border-gray-300 hover:border-purple-300"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{addr.name}</p>
                    <p>{addr.phone}</p>
                    <p>{addr.address}</p>
                    <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                  {selectedAddress === addr && (
                    <span className="text-purple-600 text-xl ml-2">✔️</span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(index);
                    }}
                    className="text-red-500 hover:text-red-700 ml-3"
                    title="Delete this address"
                  >
                    🗑️
                  </button>
                </div>
              ))}

              <div className="flex justify-between mt-4">
                <button
                  onClick={handleContinue}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                >
                  Continue to Payment
                </button>
                <button
                  onClick={() => setAddingNew(true)}
                  className="border border-purple-600 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-50 transition"
                >
                  ➕ Add New Address
                </button>
              </div>
            </>
          )}

          {/* ✅ Add New Address Form */}
          {addingNew && (
            <form onSubmit={handleAddNewAddress} className="space-y-3">
              {["name", "phone", "address", "city", "state", "pincode"].map((key) => (
                <input
                  key={key}
                  type={key === "phone" || key === "pincode" ? "number" : "text"}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={newAddress[key]}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [key]: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
                  required
                />
              ))}

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setAddingNew(false)}
                  className="border border-gray-400 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ✅ Step 2: Payment Section */}
      {step === 2 && (
        <form onSubmit={handleOrderSubmit} className="space-y-4">
          <label className="block font-medium text-gray-700">Payment Method</label>
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

          {/* Card Payment */}
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
                  setPaymentDetails({
                    ...paymentDetails,
                    ifsc: e.target.value.toUpperCase(),
                  })
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

          {/* UPI */}
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

          {/* COD */}
          {paymentMethod === "cod" && (
            <div className="p-4 border rounded-md bg-white text-gray-700">
              💵 You can pay with cash, card, or UPI at the time of delivery.
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
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
