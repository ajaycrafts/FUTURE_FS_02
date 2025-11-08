import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {}; // passed data from checkout

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full text-center">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-green-600 mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for shopping with <span className="text-purple-600 font-semibold">MiniMartX</span> 🎉
        </p>

        {order ? (
          <div className="text-left bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-800 mb-2">📦 Order Summary</h3>
            <ul className="text-sm text-gray-700 mb-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between border-b py-1">
                  <span>{item.title} (x{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="font-bold text-gray-800">
              Total: ${order.total.toFixed(2)}
            </div>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">🏠 Delivery Address</h3>
            <p className="text-sm text-gray-700">
              {order.address.name}<br />
              {order.address.address}, {order.address.city}, {order.address.state}<br />
              Pincode: {order.address.pincode}<br />
              Phone: {order.address.phone}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No order details available.</p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => navigate("/track", { state: { order } })}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            🚚 Track Order
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
