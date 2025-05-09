// LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import styles from './LogoutButton.module.css';
import logoutIcon from './imagenes/logout-icon.png'; 


const LogoutButton = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className={styles.logoutButtonContainer}>
            <button className={styles.logoutButton} onClick={handleLogout}>
                <img src={logoutIcon} alt="Logout" className={styles.logoutIcon} />
                Cerrar sesión
            </button>
        </div>
    );
};

export default LogoutButton;
