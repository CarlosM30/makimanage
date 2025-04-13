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
                <button className={styles.registerBtn} onClick={() => navigate('/addproduct')}>PEDIDO</button>
                <button className={styles.registerBtn} onClick={() => navigate('/manualinv')}>AJUSTE INVENTARIO</button>
                <button className={styles.registerBtn} onClick={() => navigate('/addcategoria')}>AGREGAR CATEGORIA</button>
                <button className={styles.registerBtn} onClick={() => navigate('/addproveedor')}>AGREGAR PROVEEDOR</button>
                <button className={styles.registerBtn} onClick={() => navigate('/crearpedido')}>Realizar PEDIDO</button>
            </div>
        </div>
    );
}

export default GerenteS;