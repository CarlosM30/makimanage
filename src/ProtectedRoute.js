import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Componente de ruta protegida.
 *
 * Verifica si el usuario está autenticado antes de permitirle el acceso a la ruta.
 * Si no está autenticado, lo redirige automáticamente a la página de inicio de sesión.
 *
 * @component
 * @param {object} props
 * @param {JSX.Element} props.children - El componente que debe renderizarse si el usuario está autenticado.
 * @returns {JSX.Element} El componente hijo si está autenticado, o una redirección a /login en caso contrario.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
