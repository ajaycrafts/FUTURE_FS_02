import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login({ email });
    if (success) navigate(from, { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
          Login or Signup
        </h2>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Continue
        </button>

        <p className="text-center text-gray-600 mt-4">
          New user?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-purple-600 font-semibold"
          >
            Create an account
          </button>
        </p>
      </form>
    </div>
  );
}
