import React, { useState } from 'react';
import styles from './AddCategoria.module.css';
import WhatsAppButton from '../WhatsAppButton';
import LogoutButton from '../LogoutButton';

/**
 * Componente para agregar una nueva categoría de productos.
 * 
 * Este componente permite al usuario introducir el nombre y la descripción
 * de una nueva categoría, y luego enviarla al servidor para almacenarla 
 * en la base de datos.
 * 
 * @component
 * @returns {JSX.Element} Formulario para agregar una categoría.
 */
const AddCategoria = () => {

    // Estados del componente
    const [nombre, setNombre] = useState('');            // Almacena el nombre de la categoría
    const [descripcion, setDescripcion] = useState('');  // Almacena la descripción de la categoría
    const [message, setMessage] = useState('');          // Almacena mensajes de éxito o error

    /**
     * Maneja el envío del formulario de categoría.
     * 
     * Verifica que el campo de nombre no esté vacío. Luego realiza
     * una solicitud HTTP POST al servidor para guardar la nueva categoría.
     * 
     * @param {Event} e - El evento del formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación del campo de nombre
        if (!nombre.trim()) {
            setMessage('El nombre de la categoría es obligatorio.');
            return;
        }

        try {
            // Envío de la categoría al servidor
            const response = await fetch('http://localhost/MakiManage/inventario/agregar_categoria.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, descripcion })
            });

            // Conversión de la respuesta a JSON
            const data = await response.json();
            setMessage(data.message); // Mostrar mensaje del servidor

            // Si se guardó correctamente, limpiar el formulario
            if (data.status === 'success') {
                setNombre('');
                setDescripcion('');
            }
        } catch (error) {
            console.error(error);
            setMessage('Error al conectar con el servidor.');
        }
    };

    return (
        <div className={styles.bodyContainer}>
            <LogoutButton /> 
            <div className={styles.formContainer}>
                <h2 className={styles.title}>Nueva Categoría</h2>

                {/* Formulario para crear una nueva categoría */}
                <form className={styles.form} onSubmit={handleSubmit}>

                    {/* Campo de nombre */}
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Nombre de la Categoría:</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej. postres"
                            required
                        />
                    </div>

                    {/* Campo de descripción */}
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Descripción:</label>
                        <textarea
                            className={styles.input}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Ej. Productos de postres"
                            required
                        />
                    </div>

                    {/* Botón para enviar el formulario */}
                    <button className={styles.button} type="submit">
                        Crear Categoría
                    </button>
                </form>

                {/* Mensaje de respuesta (éxito o error) */}
                {message && <p className={styles.message}>{message}</p>}
            </div>
            <WhatsAppButton />
        </div>
    );
};

export default AddCategoria;
