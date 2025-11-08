import { useLocation, useNavigate } from "react-router-dom";
import { Truck, PackageCheck, MapPin, Clock } from "lucide-react";

export default function TrackOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">No order found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const steps = [
    { label: "Order Placed", icon: <PackageCheck className="text-green-600 w-6 h-6" /> },
    { label: "Packed", icon: <PackageCheck className="text-blue-600 w-6 h-6" /> },
    { label: "Shipped", icon: <Truck className="text-orange-600 w-6 h-6" /> },
    { label: "Out for Delivery", icon: <MapPin className="text-yellow-600 w-6 h-6" /> },
    { label: "Delivered", icon: <Clock className="text-gray-500 w-6 h-6" /> },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🚚 Order Tracking
        </h2>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 border-l-4 ${
                index <= 2
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-gray-50"
              } rounded-lg`}
            >
              {step.icon}
              <span
                className={`text-lg font-semibold ${
                  index <= 2 ? "text-green-700" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Estimated Delivery:
          </h3>
          <p className="text-gray-600">
            {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString()}
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
