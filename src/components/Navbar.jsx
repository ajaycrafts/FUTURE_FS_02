import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();

  // ✅ Sync query with URL (when navigating back or refreshing)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get("search") || "";
    setQuery(searchTerm);
  }, [location.search]);

  // ✅ Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (trimmed === "") {
      navigate(`/`); // If search is cleared → show all products
      return;
    }

    navigate(`/?search=${encodeURIComponent(trimmed)}`);
    setMenuOpen(false);
  };

  return (
    <nav className="backdrop-blur-md bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 shadow-md sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-white">
        <Link to="/" className="text-2xl font-extrabold text-white">
          MiniMart<span className="text-blue-300">X</span>
        </Link>

        {/* 🔍 Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center w-1/2 bg-white/20 rounded-lg px-3 py-1 focus-within:ring-2 focus-within:ring-blue-200 backdrop-blur-sm"
        >
          <Search className="text-white mr-2" size={18} />
          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full outline-none bg-transparent text-white placeholder-gray-200"
          />
          <button type="submit" className="hidden" />
        </form>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/profile" className="flex items-center space-x-1 hover:text-gray-200 transition">
            <User size={20} /> <span>Profile</span>
          </Link>

          <Link to="/cart" className="relative flex items-center space-x-1 hover:text-gray-200 transition">
            <ShoppingCart size={20} /> <span>Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full shadow-md">
                {cart.length}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white text-gray-800 border-t shadow-lg">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="flex items-center border rounded-lg px-3 py-1 mb-3 bg-gray-100">
              <Search className="text-gray-500 mr-2" size={18} />
              <input
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
            </form>

            <Link
              to="/profile"
              className="block py-2 border-b text-gray-700 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>

            <Link
              to="/cart"
              className="block py-2 text-gray-700 hover:text-blue-600 relative"
              onClick={() => setMenuOpen(false)}
            >
              Cart
              {cart.length > 0 && (
                <span className="absolute top-1 right-6 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
