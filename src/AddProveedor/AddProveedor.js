import React, { useState } from 'react';
import styles from './AddProveedor.module.css';

const AddProveedor = () => {
    const [nombre, setNombre] = useState('');
    const [contacto, setContacto] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [tipoProducto, setTipoProducto] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !telefono || !email || !ciudad || !tipoProducto) {
            setMessage('Todos los campos son obligatorios');
            return;
        }

        try {
            const response = await fetch('http://localhost/MakiManage/add_proveedor.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    contacto,
                    telefono,
                    email,
                    ciudad,
                    tipo_producto: tipoProducto,
                    estado: 'Activo' // 🔐 Valor fijo
                })
            });

            const data = await response.json();
            setMessage(data.message);

            if (data.status === 'success') {
                setNombre('');
                setContacto('');
                setTelefono('');
                setEmail('');
                setCiudad('');
                setTipoProducto('');
            }

        } catch (error) {
            console.error(error);
            setMessage('Error al conectar con el servidor');
        }
    };

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.formContainer}>
                <h2 className={styles.title}>Registrar Proveedor</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Nombre:</label>
                        <input className={styles.input} type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>

                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Contacto:</label>
                        <input className={styles.input} type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} />
                    </div>

                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Teléfono:</label>
                        <input className={styles.input} type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                    </div>

                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Email:</label>
                        <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Ciudad:</label>
                        <input className={styles.input} type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
                    </div>

                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Tipo de Producto:</label>
                        <input className={styles.input} type="text" value={tipoProducto} onChange={(e) => setTipoProducto(e.target.value)} required />
                    </div>

                    <button className={styles.button} type="submit">Registrar</button>
                </form>

                {message && <p className={styles.message}>{message}</p>}
            </div>
        </div>
    );
};

export default AddProveedor;
