import React, { useState, useEffect } from 'react';
import styles from './Inventory.module.css';

/**
 * Componente para visualizar el inventario
 * 
 * Este componente perimite visualizar el inventario por categorias que el
 * usuario eliga, se muestra el nombre del producto, unidad de media y cantidad
 * 
 * @returns {JSX.Element} El Evento de visualizar el inventario
 */
const Inventory = () => {
  const [inventory, setInventory] = useState([]); // Almacena los datos del inventario
  const [errorMessage, setErrorMessage] = useState(''); // Almacena mensaje de error
  const [updatedProduct, setUpdatedProduct] = useState(null); // Estado para almacenar temporalmente un producto que ha sido modificado
  const [selectedCategory, setSelectedCategory] = useState(''); // Estado para almacenar la categoría seleccionada

  useEffect(() => {

    // Solicitud al servidor
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
        producto: producto.Producto,
        cantidad: cantidadRestar,
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

  // Agrupar productos por categoría (Tipo)
  const groupedInventory = inventory.reduce((acc, item) => {
    if (!acc[item.Tipo]) {
      acc[item.Tipo] = [];
    }
    acc[item.Tipo].push(item);
    return acc;
  }, {});

  return (
    <div className={styles.bodyContainer}>
      <h2 className={styles.title}>Registro</h2>

      {/* Dropdown para seleccionar la categoría */}
      <label htmlFor="categorySelect">Selecciona una categoría:</label>
      <select
        id="categorySelect"
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">-- Seleccionar --</option>
        {Object.keys(groupedInventory).map((categoria, index) => (
          <option key={index} value={categoria}>{categoria}</option>
        ))}
      </select>

      {/* Mostrar solo la tabla de la categoría seleccionada */}
      {selectedCategory && (
        <div className={styles.inventoryContainer}>
          <h3>{selectedCategory}</h3>
          <table className={styles.inventoryTable}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Unidad</th>
                <th>Cantidad</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {groupedInventory[selectedCategory].map((item, i) => (
                <tr key={i}>
                  <td>{item.Producto}</td>
                  <td>{item.Unidad}</td>
                  <td>{item.Cantidad}</td>
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
