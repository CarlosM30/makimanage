import React, { useState, useEffect } from 'react';
import styles from './ManualInv.module.css'; 
import { useNavigate } from 'react-router-dom';

const UpdateInventory = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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

  const updateManualQuantity = () => {
    if (!selectedProduct || newQuantity === '') {
      setErrorMessage('Debe seleccionar un producto y proporcionar una cantidad válida.');
      return;
    }

    const producto = inventory.find(item => item.Producto === selectedProduct);

    if (producto) {
      fetch('http://localhost/sushidorado-backend/update_inventario_manual.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          producto: producto.Producto,
          cantidad: newQuantity,
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            setInventory(inventory.map(item =>
              item.Producto === producto.Producto ? { ...item, Cantidad: newQuantity } : item
            ));
            setSuccessMessage(`La cantidad del producto ${producto.Producto} ha sido actualizada a ${newQuantity}`);
            setUpdatedProduct(producto.Producto);
          } else {
            setErrorMessage('Error al actualizar la cantidad del producto');
          }
        })
        .catch(error => {
          console.error('Error al actualizar:', error);
          setErrorMessage('Error al actualizar la cantidad del producto');
        });
    } else {
      setErrorMessage('Producto no encontrado en el inventario');
    }
  };

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.inventoryContainer}>
        <h2>Actualizar Inventario</h2>

        <div>
          <label htmlFor="product">Seleccionar Producto:</label>
          <select
            id="product"
            value={selectedProduct || ''}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Seleccione un producto</option>
            {inventory.map((item, index) => (
              <option key={index} value={item.Producto}>
                {item.Producto}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="newQuantity">Nueva Cantidad:</label>
          <input
            type="number"
            id="newQuantity"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            min="0"
          />
        </div>

        <button onClick={updateManualQuantity}>Actualizar Cantidad</button>

        {errorMessage && <p className={styles.message}>{errorMessage}</p>}
        {successMessage && <p className={styles.message}>{successMessage}</p>}
      </div>
    </div>
  );
};

export default UpdateInventory;
