// WhatsAppButton.js
import React from 'react';
import styles from './WhatsAppButton.module.css';

const WhatsAppButton = ({ pageName = 'el sistema' }) => {
const phoneNumber = '4422014173';
const message = encodeURIComponent(`Hola, necesito ayuda con ${pageName}`);

    return (
        <div className={styles.whatsappButton}>
            <a
                href={`https://wa.me/${phoneNumber}?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="WhatsApp"
                />
                <span>¿Necesitas ayuda?</span>
            </a>
        </div>
    );
};

export default WhatsAppButton; 