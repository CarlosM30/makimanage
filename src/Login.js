import React, { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://localhost/sushidorado-backend/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert(`¡Bienvenido! Especialidad: ${data.Especialidad}, Estado: ${data.Estado}`);

        // Verificar el rol y redirigir a la página correspondiente
        if (data.Especialidad === 'Chef') {
          navigate('/inventory');
        } else if (data.Especialidad === 'Encargado de Inventario') {
          navigate('/manualinv');
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
            <img src="http://localhost/sushidorado-backend/avatar.jpg" alt="Avatar" />
          </div>
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <div className={styles.inputContainer}>
              <label>Usuario</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            <div className={styles.inputContainer}>
              <label>Contraseña</label>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <label>
                <input 
                  type="checkbox" 
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Mostrar Contraseña
              </label>
            </div>
            <button className={styles.loginBtn} type="submit">INGRESAR</button>
            <button className={styles.registerBtn} type="button" onClick={() => navigate('/register')}>REGISTRAR</button>
            {errorMessage && <p className={styles.message}>{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
