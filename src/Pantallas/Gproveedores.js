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
                <button className={styles.registerBtn} onClick={() => navigate('/addproveedor')}>AGREGAR PROVEEDOR</button>
                <button className={styles.registerBtn} onClick={() => navigate('/crearpedido')}>REALIZAR PEDIDO</button>
            </div>
            <WhatsAppButton />
        </div>
    );
}

export default GerenteS;