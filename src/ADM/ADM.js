import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ADM.module.css';

const ADM = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        usuario: '',
        contrasena: '',
        especialidad: '',
        estado: 'Activo'
    });

    // Obtener lista de usuarios
    useEffect(() => {
        fetch('http://localhost/MakiManage/usuarios/get_users.php')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error:', error));
    }, []);

    // Manejar selección de usuario
    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setFormData({
            usuario: user.usuario,
            contrasena: '',
            especialidad: user.especialidad,
            estado: user.estado
        });
        setEditMode(false);
    };

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Actualizar usuario
    const handleUpdateUser = () => {
        fetch('http://localhost/MakiManage/usuarios/update_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: selectedUser.id,
                ...formData
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Usuario actualizado correctamente');
                    // Actualizar lista de usuarios
                    return fetch('http://localhost/MakiManage/usuarios/get_users.php');
                }
                throw new Error(data.message);
            })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => {
                console.error('Error:', error);
                alert('Error al actualizar usuario');
            });
    };

    // Eliminar usuario
    const handleDeleteUser = () => {
        if (!window.confirm(`¿Estás seguro de eliminar al usuario ${selectedUser.usuario}?`)) return;

        fetch('http://localhost/MakiManage/usuarios/delete_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: selectedUser.id }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Usuario eliminado correctamente');
                    // Actualizar lista de usuarios
                    return fetch('http://localhost/MakiManage/usuarios/get_users.php');
                }
                throw new Error(data.message);
            })
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                setSelectedUser(null);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar usuario');
            });
    };

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.inventoryContainer}>
                <h1 className={styles.title}>Panel de Administración</h1>

                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    {/* Lista de usuarios */}
                    <div style={{ flex: 1 }}>
                        <h2>Usuarios Registrados</h2>
                        <table className={styles.inventoryTable}>
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Especialidad</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr
                                        key={user.id}
                                        onClick={() => handleSelectUser(user)}
                                        style={{
                                            cursor: 'pointer',
                                            backgroundColor: selectedUser?.id === user.id ? '#D92579' : 'inherit'
                                        }}
                                    >
                                        <td>{user.usuario}</td>
                                        <td>{user.especialidad}</td>
                                        <td>{user.estado}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Detalles del usuario seleccionado */}
                    {selectedUser && (
                        <div style={{ flex: 1, padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                            <h2>Detalles del Usuario</h2>

                            {!editMode ? (
                                <>
                                    <p><strong>Usuario:</strong> {selectedUser.usuario}</p>
                                    <p><strong>Especialidad:</strong> {selectedUser.especialidad}</p>
                                    <p><strong>Estado:</strong> {selectedUser.estado}</p>
                                    <p><strong>Fecha de Registro:</strong> {new Date(selectedUser.fecha_registro).toLocaleString()}</p>

                                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                        <button
                                            className={styles.loginBtn}
                                            onClick={() => setEditMode(true)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className={styles.registerBtn}
                                            onClick={handleDeleteUser}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.inputContainer}>
                                        <label>Usuario</label>
                                        <input
                                            type="text"
                                            name="usuario"
                                            value={formData.usuario}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className={styles.inputContainer}>
                                        <label>Contraseña (dejar en blanco para no cambiar)</label>
                                        <input
                                            type="password"
                                            name="contrasena"
                                            value={formData.contrasena}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className={styles.inputContainer}>
                                        <label>Especialidad</label>
                                        <select
                                            name="especialidad"
                                            value={formData.especialidad}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="Chef">Chef</option>
                                            <option value="Encargado de Inventario">Encargado de Inventario</option>
                                            <option value="Gerente">Gerente</option>
                                            <option value="ADM">Administrador</option>
                                        </select>
                                    </div>

                                    <div className={styles.inputContainer}>
                                        <label>Estado</label>
                                        <select
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>

                                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                        <button
                                            className={styles.loginBtn}
                                            onClick={handleUpdateUser}
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            className={styles.registerBtn}
                                            onClick={() => setEditMode(false)}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <button
                    className={styles.registerBtn}
                    style={{ marginTop: '20px' }}
                    onClick={() => navigate('/register')}
                >
                    Registrar Nuevo Usuario
                </button>
            </div>
        </div>
    );
};

export default ADM;