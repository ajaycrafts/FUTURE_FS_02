import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.thumbnail);
      })
      .catch((err) => console.error("Error loading product:", err));
  }, [id]);

  if (!product) {
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Loading product details...
      </p>
    );
  }

  return (
    // 👇 Added pt-24 so the top content stays below the sticky navbar
    <div className="pt-24 p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-xl">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      {/* Product Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Image Gallery */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`product-${idx}`}
                className={`w-16 h-16 object-contain cursor-pointer border rounded-md ${
                  selectedImage === img
                    ? "border-purple-600"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onMouseEnter={() => setSelectedImage(img)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-80 h-80 object-contain rounded-lg transition-transform hover:scale-105"
            />
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-3">
            <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
              {product.rating.toFixed(1)} ★
            </span>
            <span className="text-gray-600 text-sm">
              {Math.floor(Math.random() * 5000 + 1000)} Ratings & Reviews
            </span>
          </div>

          <p className="text-3xl font-semibold text-blue-700 mb-4">
            ₹{product.price}
          </p>

          <p className="text-gray-700 mb-3 leading-relaxed">
            {product.description}
          </p>

          <p className="text-gray-800 font-medium mb-1">
            Category:{" "}
            <span className="capitalize text-purple-600">
              {product.category}
            </span>
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-yellow-500 text-white py-3 rounded-md font-semibold hover:bg-yellow-600 transition"
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={() => {
                addToCart(product);
                navigate("/checkout");
              }}
              className="flex-1 bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700 transition"
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

