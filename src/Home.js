import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.bodyContainer}>  {/* Este contenedor aún cubre toda la página */}
            <div className={styles.homeContainer}> {/* Cambié el nombre de la clase para evitar conflictos */}
                <h1 className={styles.title}>MAKIMANAGE</h1>
                <h2 className={styles.subtitle}>BIENVENIDO</h2>
                <button className={styles.loginBtn} onClick={() => navigate('/login')}>INICIAR</button>
                <button className={styles.registerBtn} onClick={() => navigate('/register')}>REGISTRAR</button>
            </div>
        </div>
    );
}

export default Home;
