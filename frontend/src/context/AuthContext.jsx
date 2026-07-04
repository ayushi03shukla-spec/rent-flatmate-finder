import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const parsed = JSON.parse(storedUser);

    setUser({
      ...parsed,
      id: parsed.id || parsed._id,
    });
  }
}, []);

 const login = ({ user, token }) => {
  const normalizedUser = {
    ...user,
    id: user.id || user._id,
  };

  localStorage.setItem("user", JSON.stringify(normalizedUser));
  localStorage.setItem("token", token);

  setUser(normalizedUser);
};;

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);