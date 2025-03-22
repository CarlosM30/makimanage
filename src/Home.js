import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.bodyContainer}> 
            <div className={styles.homeContainer}>
                <div className={styles.avatar}>
                <img src="http://localhost/MakiManage/MKSF.png" alt="Avatar" /> {/* Logotipo del Restaurante */}
                </div>
                <h1 className={styles.title}>MAKIMANAGE</h1>
                <h2 className={styles.subtitle}>BIENVENIDO</h2>
                <button className={styles.loginBtn} onClick={() => navigate('/login')}>INICIAR</button> {/* Botón para redirigir a Login*/}
                <button className={styles.registerBtn} onClick={() => navigate('/register')}>REGISTRAR</button> {/* Botón para redirigir a Registrar Usuario*/}
            </div>
        </div>
    );
}

export default Home;
