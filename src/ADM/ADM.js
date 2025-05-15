import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ADM.module.css';
import LogoutButton from '../LogoutButton';

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
            <LogoutButton /> 
            <div className={styles.adminContainer}>
                <h1 className={styles.adminTitle}>Panel de Administración</h1>

                <div className={styles.adminContent}>
                    {/* Lista de usuarios */}
                    <div className={styles.adminSection}>
                        <h2 className={styles.sectionTitle}>Usuarios Registrados</h2>
                        <table className={styles.usersTable}>
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
                                        className={selectedUser?.id === user.id ? styles.selected : ''}
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
                        <div className={styles.adminSection}>
                            {!editMode ? (
                                <>
                                    <h2 className={styles.sectionTitle}>Detalles del Usuario</h2>
                                    <div className={styles.userDetails}>
                                        <p><strong>Usuario:</strong> {selectedUser.usuario}</p>
                                        <p><strong>Especialidad:</strong> {selectedUser.especialidad}</p>
                                        <p><strong>Estado:</strong> {selectedUser.estado}</p>
                                        <p><strong>Fecha de Registro:</strong> {new Date(selectedUser.fecha_registro).toLocaleString()}</p>
                                    </div>

                                    <div className={styles.buttonGroup}>
                                        <button
                                            className={styles.buttonPrimary}
                                            onClick={() => setEditMode(true)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className={styles.buttonSecondary}
                                            onClick={handleDeleteUser}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.editFormContainer}>
                                    <h2 className={styles.sectionTitle}>Editar Usuario</h2>
                                    
                                    <div className={styles.editForm}>
                                        <div className={styles.formRow}>
                                            <div className={styles.inputContainer}>
                                                <label>Usuario</label>
                                                <input
                                                    type="text"
                                                    name="usuario"
                                                    value={formData.usuario}
                                                    onChange={handleInputChange}
                                                    required
                                                    className={styles.formInput}
                                                />
                                            </div>

                                            <div className={styles.inputContainer}>
                                                <label>Contraseña</label>
                                                <input
                                                    type="password"
                                                    name="contrasena"
                                                    value={formData.contrasena}
                                                    onChange={handleInputChange}
                                                    className={styles.formInput}
                                                    placeholder="Dejar en blanco para no cambiar"
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.inputContainer}>
                                                <label>Especialidad</label>
                                                <select
                                                    name="especialidad"
                                                    value={formData.especialidad}
                                                    onChange={handleInputChange}
                                                    required
                                                    className={styles.formInput}
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
                                                    className={styles.formInput}
                                                >
                                                    <option value="Activo">Activo</option>
                                                    <option value="Inactivo">Inactivo</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className={styles.buttonGroup}>
                                            <button
                                                className={styles.buttonPrimary}
                                                onClick={handleUpdateUser}
                                            >
                                                Guardar Cambios
                                            </button>
                                            <button
                                                className={styles.buttonSecondary}
                                                onClick={() => setEditMode(false)}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button
                    className={styles.mainActionButton}
                    onClick={() => navigate('/register')}
                >
                    Registrar Nuevo Usuario
                </button>
            </div>
        </div>
    );
};

export default ADM;