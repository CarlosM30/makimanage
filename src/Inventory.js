import React, { useState, useEffect } from 'react';
import styles from './Inventory.module.css';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [updatedProduct, setUpdatedProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost/sushidorado-backend/get_inventario.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.productos)) {
          setInventory(data.productos);
        } else {
          setErrorMessage(data.message || 'No se pudieron obtener los productos');
        }
      })
      .catch(error => {
        console.error('Error en la conexión:', error);
        setErrorMessage('Error en la conexión con el servidor.');
      });
  }, []);

  // Función para actualizar la cantidad del producto
  const updateProductQuantity = (producto, cantidadRestar) => {
    const newQuantity = producto.Cantidad - cantidadRestar;
  
    if (newQuantity < 0) {
      alert('No hay suficiente cantidad de este producto');
      return;
    }
  
    fetch('http://localhost/sushidorado-backend/update_inventario.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        producto: producto.Producto,
        cantidad: cantidadRestar, // Aquí solo envías la cantidad a restar, no la nueva cantidad
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setInventory(inventory.map(item =>
            item.Producto === producto.Producto ? { ...item, Cantidad: newQuantity } : item
          ));
          setUpdatedProduct(producto.Producto);
        } else {
          setErrorMessage('Error al actualizar el producto');
        }
      })
      .catch(error => {
        console.error('Error al actualizar:', error);
        setErrorMessage('Error al actualizar la cantidad del producto');
      });
  };
  

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.inventoryContainer}>
        <h2>Inventario</h2>
        <table className={styles.inventoryTable}>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Producto</th>
              <th>Unidad</th>
              <th>Cantidad</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {inventory && inventory.length > 0 ? (
              inventory.map((item, index) => (
                <tr key={index}>
                  <td>{item.Tipo}</td>
                  <td>{item.Producto}</td>
                  <td>{item.Unidad}</td>
                  <td>{item.Cantidad}</td>
                  <td>
                    <button
                      onClick={() => updateProductQuantity(item, 1)}
                    >
                      Usar 1
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay productos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
        {errorMessage && <p className={styles.message}>{errorMessage}</p>}
        {updatedProduct && <p>Producto actualizado: {updatedProduct}</p>}
      </div>
    </div>
  );
};

export default Inventory;
