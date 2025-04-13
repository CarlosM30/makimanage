import React, { useState } from 'react';
import styles from './AddCategoria.module.css';

const AddCategoria = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setMessage('El nombre de la categoría es obligatorio.');
            return;
        }

        try {
            const response = await fetch('http://localhost/MakiManage/inventario/agregar_categoria.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, descripcion })
            });

            const data = await response.json();
            setMessage(data.message);

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
            <div className={styles.formContainer}>
                <h2 className={styles.title}>Nueva Categoría</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
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

                    <button className={styles.button} type="submit">
                        Crear Categoría
                    </button>
                </form>
                {message && <p className={styles.message}>{message}</p>}
            </div>
        </div>
    );
};

export default AddCategoria;
