import React, { useState } from 'react';
import styles from './AddTable.module.css';

const AddTable = () => {
    const [nombre, setNombre] = useState('');
    const [conFecha, setConFecha] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setMessage('El nombre de la tabla es obligatorio.');
            return;
        }

        try {
            const response = await fetch('http://localhost/MakiManage/create_table.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, con_fecha: conFecha })
            });

            const data = await response.json();
            setMessage(data.message);

            if (data.status === 'success') {
                setNombre('');
                setConFecha(false);
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
                        <label className={styles.label}>Nombre de la Tabla:</label>
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
                        <label className={styles.label}>
                            <input
                                type="checkbox"
                                checked={conFecha}
                                onChange={() => setConFecha(!conFecha)}
                            />
                            ¿Agregar campo de fecha de caducidad?
                        </label>
                    </div>

                    <button className={styles.button} type="submit">
                        Crear Tabla
                    </button>
                </form>
                {message && <p className={styles.message}>{message}</p>}
            </div>
        </div>
    );
};

export default AddTable;
