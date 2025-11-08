import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address) {
      alert("Please fill all fields!");
      return;
    }
    signup(form);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
          Create an Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            type="button"
            className="text-purple-600 font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
