import { createContext, useContext, useState, useEffect } from 'react';

// Contexto de autenticación
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicializa el estado leyendo localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true'; // convierte string a booleano
  });

  // Guarda automáticamente el estado cada vez que cambie
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); // opcional, para limpiar
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
