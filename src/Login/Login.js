import avatar from '../imagenes/Avatar.png';
import WhatsAppButton from '../WhatsAppButton';
import React, { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

/**
 * Componente de inicio de sesión.
 * 
 * Este componente permite a los usuarios ingresar su nombre de usuario y contraseña 
 * para autentificarse en la aplicación. Dependiendo del rol del usuario, se redirige
 * a una página especifica (Chef, Encargado de Inventario, Gerente)
 * 
 * @component 
 * @returns {JSX.Element} El formulario de inicio de sesión.
 */
const Login = () => {

  const navigate = useNavigate();
  const { login } = useAuth();//Hook del contexto de autenticación

  // Estados del componente
  const [username, setUsername] = useState(''); // Almacena el nombre de usuario
  const [password, setPassword] = useState(''); // Almacena la contraseña
  const [showPassword, setShowPassword] = useState(false); // Controla si se muestra la contraseña
  const [errorMessage, setErrorMessage] = useState(''); // Almacena mensajes de error

  /**
   * Maneja el envío del formulario de inicio de sesión
   * 
   * Realiza una solicitud HTTP POST al servidor para autenticar al usuario.
   * Si la autenticación es exitosa envía al usuario a una página específica
   * según su rol. Si falla, se muestra un mensaje de error.
   * 
   * @param {Event} e - El evento de envío de formulario. 
   */
  const handleLogin = (e) => {
    e.preventDefault();

    // Realiza la solicitud al servidor
    fetch('http://localhost/MakiManage/usuarios/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          if (data.Estado !== 'Activo') {
            setErrorMessage('Tu cuenta está inactiva. Contacta al administrador.');
            return; // Detiene la ejecución
          }
          login(); // 👉 Establece sesión como autenticada en el contexto

          alert(`¡Bienvenido! Especialidad: ${data.Especialidad}, Estado: ${data.Estado}`);

          // Redirige al usuario según su rol con reemplazo en el historial
          if (data.Especialidad === 'Chef') {
            navigate('/inventory', { replace: true });
          } else if (data.Especialidad === 'Encargado de Inventario') {
            navigate('/einventario', { replace: true });
          } else if (data.Especialidad === 'Gerente') {
            navigate('/gerentes', { replace: true });
          } else if (data.Especialidad === 'ADM') {
            navigate('/adm', { replace: true });
          } else {
            setErrorMessage('Rol no reconocido');
          }
        } else {
          setErrorMessage(data.message);
        }
      })
      .catch(error => {
        console.error('Error en la conexión:', error);
        setErrorMessage('Error en la conexión con el servidor.');
      });
  };

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.avatar}>
            <img src={avatar} className="App-logo" alt="Avatar" />
          </div>

          {/* Título del formulario */}
          <h2>Iniciar Sesión</h2>

          {/* Formulario de inicio de sesión */}
          <form onSubmit={handleLogin}>
            {/* Campo de nombre de usuario */}
            <div className={styles.inputContainer}>
              <label>Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Campo de contraseña */}
            <div className={styles.inputContainer}>
              <label>Contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Checkbox para mostrar/ocultar la contraseña */}
              <div className={styles.showPasswordContainer}>
                <label>Mostrar</label>
                <label>Contraseña</label>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            {/* Botón de inicio de sesión */}
            <button className={styles.loginBtn} type="submit">INGRESAR</button>

            {/* Botón de registro */}
            <button
              className={styles.registerBtn}
              type="button"
              onClick={() => navigate('/register')}
            >
              REGISTRAR
            </button>

            {/* Mensaje de error */}
            {errorMessage && <p className={styles.message}>{errorMessage}</p>}
          </form>
        </div>
            <WhatsAppButton pageName="el inicio de sesión"/>
      </div>
    </div>
    
  );
  
};

export default Login;
