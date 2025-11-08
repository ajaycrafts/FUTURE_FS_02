import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600 text-lg">Please log in to view your profile.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="User Avatar"
            className="w-20 h-20 rounded-full border-4 border-purple-500"
          />
        </div>
        <h1 className="text-2xl font-bold text-purple-600 mb-2">My Profile</h1>

        <div className="text-left space-y-3 mt-4">
          <p className="flex items-center gap-2"><User size={18}/> {user.name}</p>
          <p className="flex items-center gap-2"><Mail size={18}/> {user.email}</p>
          <p className="flex items-center gap-2"><Phone size={18}/> {user.phone}</p>
          <p className="flex items-center gap-2"><MapPin size={18}/> {user.address}</p>
        </div>

        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

