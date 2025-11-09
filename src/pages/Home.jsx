import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(
    localStorage.getItem("activeCategory") || "All"
  );
  const [sortOption, setSortOption] = useState(
    localStorage.getItem("sortOption") || "default"
  );

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search")?.toLowerCase() || "";

  // ✅ Wrap applyFilters in useCallback to make it dependency-safe
  const applyFilters = useCallback(
    (productList, search, category, sort) => {
      if (!Array.isArray(productList)) return;
      let result = [...productList];

      if (search) {
        result = result.filter(
          (p) =>
            p.title.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search)
        );
      }

      if (category !== "All") {
        result = result.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (sort === "priceLowHigh") {
        result.sort((a, b) => a.price - b.price);
      } else if (sort === "priceHighLow") {
        result.sort((a, b) => b.price - a.price);
      } else if (sort === "ratingHighLow") {
        result.sort((a, b) => b.rating - a.rating);
      }

      setFilteredProducts(result);
    },
    []
  );

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        const productList = data.products || [];
        setProducts(productList);

        const uniqueCategories = [
          "All",
          ...new Set(productList.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);

        applyFilters(productList, searchTerm, activeCategory, sortOption);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, [applyFilters, searchTerm, activeCategory, sortOption]);

  useEffect(() => {
    localStorage.setItem("activeCategory", activeCategory);
    localStorage.setItem("sortOption", sortOption);
  }, [activeCategory, sortOption]);

  useEffect(() => {
    applyFilters(products, searchTerm, activeCategory, sortOption);
  }, [products, searchTerm, activeCategory, sortOption, applyFilters]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Category & Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border p-2 rounded-md focus:ring focus:ring-blue-300"
          >
            <option value="default">Default</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="ratingHighLow">Rating: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/product/${p.id}`)}
              className="bg-white border rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col items-center relative group cursor-pointer hover:-translate-y-1 duration-200"
            >
              <img
                src={p.thumbnail}
                alt={p.title}
                className="h-40 w-full object-contain mb-3 transition-transform group-hover:scale-105"
              />
              <h2 className="text-sm font-semibold text-center line-clamp-2">
                {p.title}
              </h2>

              <div className="flex flex-col items-center mt-2">
                <div className="text-yellow-500 text-sm font-medium flex items-center">
                  ⭐ {p.rating.toFixed(1)}
                </div>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  ₹{p.price}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            {searchTerm || activeCategory !== "All"
              ? "No products match your filters 😔"
              : "Loading products..."}
          </p>
        )}
      </div>
    </div>
  );
}




