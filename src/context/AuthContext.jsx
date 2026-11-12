import { createContext, useContext, useState } from "react";
import { addUser, findUser, getUserByEmail } from "../config/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "fastfood_user";

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  const saveUser = (data) => {
    const { password, ...safeUser } = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    setUser(safeUser);
  };

  const login = async (email, password) => {
    const res = await findUser(email, password);
    if (res.data.length === 0) {
      throw new Error("Email hoặc mật khẩu không đúng.");
    }
    saveUser(res.data[0]);
  };

  const register = async ({ fullName, email, phone, password }) => {
    const exists = await getUserByEmail(email);
    if (exists.data.length > 0) {
      throw new Error("Email này đã được đăng ký.");
    }
    const res = await addUser({
      fullName,
      email,
      phone,
      password,
      role: "user",
      createdAt: new Date().toISOString(),
    });
    saveUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
