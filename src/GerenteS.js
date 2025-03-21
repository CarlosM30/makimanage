import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const GerenteS = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.bodyContainer}> 
            <div className={styles.homeContainer}>
                <h1 className={styles.title}>BIENVENIDO</h1>
                <h2 className={styles.subtitle}>Seleccione</h2>
                <button className={styles.loginBtn} onClick={() => navigate('/inventory')}>INVENTARIO</button>
                <button className={styles.registerBtn} onClick={() => navigate('/manualinv')}>PEDIDO</button>
            </div>
        </div>
    );
}

export default GerenteS;