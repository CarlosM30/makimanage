import React, { useState, useEffect } from 'react';
import styles from './ManualInv.module.css';

const UpdateInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost/MakiManage/get_inventario.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.productos)) {
          setInventory(data.productos);
        } else {
          setErrorMessage(data.message || 'No se pudieron obtener los productos');
        }
      })
      .catch(err => {
        console.error('Error al cargar inventario:', err);
        setErrorMessage('Error en la conexión con el servidor.');
      });
  }, []);

  const updateManualQuantity = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedProduct || newQuantity === '') {
      setErrorMessage('Seleccione un producto y una nueva cantidad válida.');
      return;
    }

    const producto = inventory.find(item => item.Producto === selectedProduct);
    if (!producto) {
      setErrorMessage('Producto no encontrado en el inventario.');
      return;
    }

    try {
      const res = await fetch('http://localhost/MakiManage/update_inventario_manual.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto: producto.Producto,
          categoria: producto.categoria, // 🟢 NECESARIO para saber qué tabla actualizar
          cantidad: parseInt(newQuantity)
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setInventory(inventory.map(item =>
          item.Producto === producto.Producto && item.categoria === producto.categoria
            ? { ...item, Cantidad: newQuantity }
            : item
        ));
        setSuccessMessage(`Cantidad actualizada correctamente para ${producto.Producto}`);
        setNewQuantity('');
        setSelectedProduct('');
      } else {
        setErrorMessage(data.message || 'Error al actualizar el producto');
      }
    } catch (err) {
      console.error('Error al actualizar:', err);
      setErrorMessage('Error al conectar con el servidor');
    }
  };

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.inventoryContainer}>
        <h2>Actualizar Inventario</h2>

        <div className={styles.inputContainer}>
          <label>Seleccionar Producto:</label>
          <select value={selectedProduct || ''} onChange={e => setSelectedProduct(e.target.value)}>
            <option value="">-- Selecciona un producto --</option>
            {inventory.map((item, idx) => (
              <option key={idx} value={item.Producto}>
                {item.Producto} ({item.categoria})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputContainer}>
          <label>Nueva Cantidad:</label>
          <input
            type="number"
            min="0"
            value={newQuantity}
            onChange={e => setNewQuantity(e.target.value)}
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
