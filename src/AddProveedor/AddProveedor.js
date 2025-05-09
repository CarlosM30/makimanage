import React, { useState } from 'react';
import styles from './AddProveedor.module.css';
import WhatsAppButton from '../WhatsAppButton';
import LogoutButton from '../LogoutButton';

/**
 * Componente para agregar una nuevo proveedor.
 * 
 * Este componente permite al usuario registrar aun nuevo proveedor,
 * su forma de ser conteactado y que tipos de producto maneja
 * 
 * @component
 * @returns {JSX.Element} Formulario para agregar un proveedor
 */
const AddProveedor = () => {
    // Estados para almacenar la información del formulario
    const [nombre, setNombre] = useState('');
    const [contacto, setContacto] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [tipoProducto, setTipoProducto] = useState('');
    const [message, setMessage] = useState('');

    // Función que maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        // Validación de campos obligatorios
        if (!nombre || !telefono || !email || !ciudad || !tipoProducto) {
            setMessage('Todos los campos son obligatorios');
            return;
        }

        try {
            // Enviar datos al backend usando fetch
            const response = await fetch('http://localhost/MakiManage/proveedores/add_proveedor.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    contacto,
                    telefono,
                    email,
                    ciudad,
                    tipo_producto: tipoProducto,
                    estado: 'Activo' // Estado predeterminado del proveedor
                })
            });

            const data = await response.json(); // Convertimos la respuesta en JSON
            setMessage(data.message); // Mostramos el mensaje del servidor

            // Si el servidor confirma el registro, limpiamos los campos
            if (data.status === 'success') {
                setNombre('');
                setContacto('');
                setTelefono('');
                setEmail('');
                setCiudad('');
                setTipoProducto('');
            }

        } catch (error) {
            console.error(error); // Mostramos error en consola
            setMessage('Error al conectar con el servidor'); // Mostramos mensaje al usuario
        }
    };

    return (
        <div className={styles.bodyContainer}>
            <LogoutButton /> 
            <div className={styles.formContainer}>
                <h2 className={styles.title}>Registrar Proveedor</h2>

                {/* Formulario de registro */}
                <form className={styles.form} onSubmit={handleSubmit}>

                    {/* Campo: Nombre */}
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Nombre:</label>
                        <input className={styles.input} type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>

                    {/* Campo: Contacto (opcional) */}
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Contacto:</label>
                        <input className={styles.input} type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} />
                    </div>

                    {/* Campo: Teléfono */}
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Teléfono:</label>
                        <input className={styles.input} type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                    </div>

                    {/* Campo: Email */}
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Email:</label>
                        <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    {/* Campo: Ciudad */}
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Ciudad:</label>
                        <input className={styles.input} type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
                    </div>

                    {/* Campo: Tipo de producto */}
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Tipo de Producto:</label>
                        <input className={styles.input} type="text" value={tipoProducto} onChange={(e) => setTipoProducto(e.target.value)} required />
                    </div>

                    {/* Botón para enviar el formulario */}
                    <button className={styles.button} type="submit">Registrar</button>
                </form>

                {/* Mostrar mensaje al usuario */}
                {message && <p className={styles.message}>{message}</p>}
            </div>
            <WhatsAppButton />
        </div>
    );
};

export default AddProveedor;
