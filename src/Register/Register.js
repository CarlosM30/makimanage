import React, { useState } from 'react';
import styles from './Register.module.css';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de Registro de un Usuario
 * 
 * Este componente permite a las personas Registrar su Usuario, Contraseña
 * y su Especialidad (Chef, Gerente, Encargado de inventario)
 * 
 * @returns {JSX.Element} El evento de Registar un nuevo Usuario
 */
const Register = () => {
  const navigate = useNavigate();

  //Estados del componente
  const [username, setUsername] = useState(''); // Almacena el nombre de Usuario
  const [password, setPassword] = useState(''); // Almacena la contraseña
  const [specialty, setSpecialty] = useState(''); // Almacena la especialidad
  const [showPassword, setShowPassword] = useState(false); // Controla si se miuestra la contraseña
  const [message, setMessage] = useState(''); // Almacena mensajes de Error

  /**
   * Maneja el envio del formulario del Registro de un nuevo Usuario
   * 
   * Realiza una solicitud HTTP POST al servidor para Registrar un Usuario.
   * Al realizar el registro despues de segundos lo redirige a la ventana de Login
   * para iniciar sesión
   * @param {Event} e - el evento de Registro de un Nuevo Usuario 
   */
  const handleRegister = async (e) => {
    e.preventDefault();

    //Revisa si los campos estan vacios
    if (!username || !password || !specialty) {
      setMessage('Todos los campos son obligatorios.');
      return;
    }

    try {

      //Solicitud al servidor
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

        //Redirige a la pagina de Login
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

          {/* Titulo del formulario */}
          <h1 className={styles.title}>Registro</h1>

          {/* Formulario de Registro de Usuario */}
          <form onSubmit={handleRegister}>

            {/* Campo del nombre de Usuario */}
            <div className={styles.inputContainer}>
              <label>Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Campo de la contraseña */}
            <div className={styles.inputContainer}>
              <label>Contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Checkbox para mostras/ocultar la contraseña */}
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

            {/* Dropdown para seleccionar la Especialidad del Usuario*/}
            <div className={styles.inputContainer}>
              <label>Especialidad</label>
              <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} required>

                {/* Opciones del Dropdown */}
                <option value="">Selecciona una opción</option>
                <option value="Chef">Chef</option>
                <option value="Encargado de Inventario">Encargado de Inventario</option>
                <option value="Gerente">Gerente</option>
              </select>
            </div>

            {/* Boton de Registrar */}
            <button className={styles.registerBtn} type="submit">REGISTRAR</button>

            {/* Boton para voler al la ventana Login */}
            <button className={styles.loginBtn} type="button" onClick={() => navigate('/login')}>VOLVER AL LOGIN</button>
            {message && <p className={styles.message}>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
