import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Home.module.css';
import WhatsAppButton from '../WhatsAppButton';
import LogoutButton from '../LogoutButton';

const GerenteS = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.bodyContainer}> 
        <LogoutButton /> 
            <div className={styles.homeContainer}>
                <h2 className={styles.subtitle}>Seleccione</h2>
                <button className={styles.loginBtn} onClick={() => navigate('/inventory')}>INVENTARIO</button>
                <button className={styles.registerBtn} onClick={() => navigate('/addproduct')}>INGRESAR PRODUCTO</button>
                <button className={styles.registerBtn} onClick={() => navigate('/manualinv')}>AJUSTE INVENTARIO</button>
                <button className={styles.registerBtn} onClick={() => navigate('/addcategoria')}>AGREGAR CATEGORIA</button>
            </div>
            <WhatsAppButton />
        </div>
    );
}

export default GerenteS;