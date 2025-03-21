import React, { useState, useEffect } from "react";
import styles from "./Usuarios.module.css";

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost/sushidorado-backend/get_usuarios.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.usuarios)) {
          setUsers(data.usuarios);
        } else {
          setErrorMessage(data.message || "No se pudieron obtener los usuarios");
        }
      })
      .catch((error) => {
        console.error("Error en la conexión:", error);
        setErrorMessage("Error en la conexión con el servidor.");
      });
  }, []);

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.inventoryContainer}>
        <h2>Usuarios</h2>
        <table className={styles.inventoryTable}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Contraseña</th>
              <th>Especialidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.Usuario}</td>
                  <td></td>
                  <td>{user.Especialidad}</td>
                  <td>{user.Estado}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
        {errorMessage && <p className={styles.message}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Usuarios;
