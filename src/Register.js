import React, { useState } from 'react';
import styles from './Register.module.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !specialty) {
      setMessage('Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await fetch('http://localhost/MakiManage/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          specialty,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage('Usuario registrado con éxito');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error al conectar con el servidor');
    }
  };

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <h1 className={styles.title}>Registro</h1>
          <form onSubmit={handleRegister}>
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
            <div className={styles.inputContainer}>
              <label>Especialidad</label>
              <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} required>
                <option value="">Selecciona una opción</option>
                <option value="Chef">Chef</option>
                <option value="Encargado de Inventario">Encargado de Inventario</option>
                <option value="Gerente">Gerente</option>
              </select>
            </div>
            <button className={styles.registerBtn} type="submit">REGISTRAR</button>
            <button className={styles.loginBtn} type="button" onClick={() => navigate('/login')}>VOLVER AL LOGIN</button>
            {message && <p className={styles.message}>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
