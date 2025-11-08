import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const signup = (userData) => {
    localStorage.setItem("registeredUser", JSON.stringify(userData));
    alert("Registration successful! Please log in.");
  };

  const login = (credentials) => {
    const storedUser = localStorage.getItem("registeredUser");
    if (!storedUser) {
      alert("No account found! Please sign up first.");
      return false;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.email === credentials.email) {
      setUser(parsedUser);
      localStorage.setItem("user", JSON.stringify(parsedUser));
      return true;
    } else {
      alert("Invalid email! Please try again.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

