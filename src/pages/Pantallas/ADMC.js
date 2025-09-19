import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './pantallas.module.css';
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton';
import LogoutButton from '../../components/Buttons/LogoutButton';

// Importa tus imágenes (asegúrate de tener estas imágenes en tu proyecto)
import inventarioIcon from '../../imagenes/inventario-icon.png';
import proveedoresIcon from '../../imagenes/proveedores-icon.png';
import usuariosIcon from '../../imagenes/usuarios-icon.png';

const GerenteS = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.bodyContainer}> 
            <LogoutButton />
            <div className={styles.homeContainer}>
                <h1 className={styles.title}>BIENVENIDO</h1>
                <h2 className={styles.subtitle}>Seleccione</h2>
                
                <div className={styles.menuOption}>
                    <img src={usuariosIcon} alt="Usuarios" />
                    <button className={styles.registerBtn} onClick={() => navigate('/adm')}>
                        GESTION USUARIOS
                    </button>
                </div>
                
                <div className={styles.menuOption}>
                    <img src={inventarioIcon} alt="Inventario" />
                    <button className={styles.loginBtn} onClick={() => navigate('/ginventario')}>
                        GESTION DE INVENTARIO
                    </button>
                </div>
                
                <div className={styles.menuOption}>
                    <img src={proveedoresIcon} alt="Proveedores" />
                    <button className={styles.registerBtn} onClick={() => navigate('/gproveedores')}>
                        GESTION DE PROVEEDORES
                    </button>
                </div>
                
            </div>
            <WhatsAppButton />
        </div>
    );
}

export default GerenteS;