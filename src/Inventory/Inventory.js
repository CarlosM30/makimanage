import React, { useState, useEffect } from 'react';
import styles from './Inventory.module.css';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [updatedProduct, setUpdatedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetch('http://localhost/MakiManage/get_inventario.php', {
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

  const categories = [...new Set(inventory.map(item => item.categoria))];

  const updateProductQuantity = (producto, cantidadRestar) => {
    const newQuantity = producto.Cantidad - cantidadRestar;

    if (newQuantity < 0) {
      alert('No hay suficiente cantidad de este producto');
      return;
    }

    fetch('http://localhost/MakiManage/update_inventario.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categoria: producto.categoria,
        producto: producto.Producto,
        cantidad: cantidadRestar,
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setInventory(inventory.map(item =>
            item.Producto === producto.Producto && item.categoria === producto.categoria
              ? { ...item, Cantidad: newQuantity }
              : item
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

  // Filtrar productos por categoría seleccionada
  const filteredProducts = inventory.filter(item => item.categoria === selectedCategory);

  // Verificar si la categoría seleccionada tiene productos con fecha de caducidad
  const categoryHasExpiryDate = selectedCategory &&
    filteredProducts.some(item => item.Fecha_Caducidad !== null);

  return (
    <div className={styles.bodyContainer}>
      <h2 className={styles.title}>Registro</h2>

      <label htmlFor="categorySelect">Selecciona una categoría:</label>
      <select
        id="categorySelect"
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
      >
        <option value="">-- Seleccionar --</option>
        {categories.map((categoria, index) => (
          <option key={index} value={categoria}>{categoria}</option>
        ))}
      </select>

      {selectedCategory && (
        <div className={styles.inventoryContainer}>
          <h3>{selectedCategory}</h3>
          <table className={styles.inventoryTable}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Unidad</th>
                <th>Cantidad</th>
                {categoryHasExpiryDate && <th>Fecha de Caducidad</th>}
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item, i) => (
                <tr key={i}>
                  <td>{item.Producto}</td>
                  <td>{item.Unidad}</td>
                  <td>{item.Cantidad}</td>
                  {categoryHasExpiryDate && (
                    <td>{item.Fecha_Caducidad || 'N/A'}</td>
                  )}
                  <td>
                    <button onClick={() => updateProductQuantity(item, 1)}>
                      Usar 1
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {errorMessage && <p className={styles.message}>{errorMessage}</p>}
      {updatedProduct && <p>Producto actualizado: {updatedProduct}</p>}
    </div>
  );
};

export default Inventory;