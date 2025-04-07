import { createContext, useContext, useState } from 'react';

// Contexto de autenticación para compartir estado de sesión en toda la aplicación
const AuthContext = createContext();

/**
 * Proveedor de autenticación que envuelve la aplicación
 * y proporciona el estado de sesión y las funciones login/logout.
 *
 * @component
 * @param {object} props
 * @param {JSX.Element} props.children - Componentes hijos que tendrán acceso al contexto
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Marca al usuario como autenticado
   */
  const login = () => setIsAuthenticated(true);

  /**
   * Cierra la sesión del usuario
   */
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para acceder fácilmente al contexto de autenticación
 * @returns {{ isAuthenticated: boolean, login: Function, logout: Function }}
 */
export const useAuth = () => useContext(AuthContext);
