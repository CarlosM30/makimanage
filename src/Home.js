import logo from './imagenes/MKSF.png';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

/**
 * Componente de pagina de inicio de la aplicación
 * 
 * Este componente da la bienvenido a los usuarios y le da las opciones de ir al
 * apartado de Iniciar sesión o Registrar un nuevo usuario.
 * 
 * @component
 * @returns {JSX.Element} Pagina de inicio de la aplicación
 */
const Home = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.homeContainer}>
                <div className={styles.avatar}>
                    <img src={logo} alt="Avatar" />{/* Logotipo del Restaurante */}
                </div>

                {/* Nombre de la Empresa */}
                <h1 className={styles.title}>MAKIMANAGE</h1>

                {/* Mensaje de Bienvenida */}
                <h2 className={styles.subtitle}>BIENVENIDO</h2>

                {/* Botón para redirigir a Login */}
                <button className={styles.loginBtn} onClick={() => navigate('/login')}>INICIAR</button>

                {/* Botón para redirigir a Registrar a un Usuario*/}
                <button className={styles.registerBtn} onClick={() => navigate('/register')}>REGISTRAR</button>
            </div>
        </div>
    );
}

export default Home;
