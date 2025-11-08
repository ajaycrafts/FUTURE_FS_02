import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, decreaseQty, clearCart } = useCart();
  const navigate = useNavigate();

  // Safe total calculation (handles missing prices or quantities)
  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart className="text-blue-600" />
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-center">Your cart is empty 🛒</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between items-center border-b pb-3"
              >
                {/* Product Title */}
                <span className="text-gray-800 font-medium text-center sm:text-left w-full sm:w-1/3">
                  {item.title || "Unnamed Product"}
                </span>

                {/* Quantity Controls */}
                <div className="flex items-center justify-center gap-2 w-full sm:w-1/3 mt-3 sm:mt-0">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="bg-gray-200 rounded-full w-8 h-8 flex justify-center items-center text-lg hover:bg-gray-300 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold text-lg w-6 text-center">
                    {item.quantity || 0}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-gray-200 rounded-full w-8 h-8 flex justify-center items-center text-lg hover:bg-gray-300 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Price and Remove Button */}
                <div className="flex items-center justify-end gap-4 w-full sm:w-1/3 mt-3 sm:mt-0">
                  <span className="text-lg font-medium">
                    ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total and Buttons */}
          <div className="mt-6 text-right">
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
              <p className="text-xl font-bold">
                Total: ${total.toFixed(2)}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Clear Cart
                </button>

                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

