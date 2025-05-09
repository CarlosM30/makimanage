import React, { useState, useEffect } from 'react';
import styles from './ManualInv.module.css';
import WhatsAppButton from '../WhatsAppButton';
import LogoutButton from '../LogoutButton';

const UpdateInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const res = await fetch('http://localhost/MakiManage/get_productos_con_categorias.php');
        const data = await res.json();
        
        if (data.status === 'success' && Array.isArray(data.productos)) {
          setProducts(data.productos);
        } else {
          setErrorMessage(data.message || 'No se pudieron obtener los productos');
        }
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setErrorMessage('Error en la conexión con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Cargar inventario cuando se selecciona un producto
  useEffect(() => {
    if (selectedProductId) {
      const fetchInventoryForProduct = async () => {
        setLoading(true);
        try {
          const res = await fetch(`http://localhost/MakiManage/get_inventario_por_producto.php?producto_id=${selectedProductId}`);
          const data = await res.json();
          
          if (data.status === 'success') {
            setInventory(data.inventario);
            // Si hay inventario, mostrar la primera entrada como referencia
            if (data.inventario.length > 0) {
              setNewQuantity(data.inventario[0].cantidad);
            }
          } else {
            setErrorMessage(data.message || 'No se pudo obtener el inventario');
          }
        } catch (err) {
          console.error('Error al cargar inventario:', err);
          setErrorMessage('Error en la conexión con el servidor.');
        } finally {
          setLoading(false);
        }
      };

      fetchInventoryForProduct();
    }
  }, [selectedProductId]);

  // Función para actualizar la cantidad manualmente
  const updateManualQuantity = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    // Validaciones básicas
    if (!selectedProductId || newQuantity === '' || isNaN(newQuantity) || newQuantity < 0) {
      setErrorMessage('Seleccione un producto y una cantidad válida.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost/MakiManage/update_inventario_manual.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_id: selectedProductId,
          cantidad: parseInt(newQuantity)
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Actualizar el estado local del inventario
        setInventory(prevInventory => 
          prevInventory.map(item => ({
            ...item,
            cantidad: newQuantity
          }))
        );
        
        setSuccessMessage(`Cantidad actualizada correctamente`);
        // No limpiamos el producto seleccionado para permitir más actualizaciones
      } else {
        setErrorMessage(data.message || 'Error al actualizar el inventario');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      setErrorMessage('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.bodyContainer}>
      <LogoutButton /> 
      <div className={styles.inventoryContainer}>
        <h2 className={styles.title}>Ajuste Manual de Inventario</h2>

        {loading && <p className={styles.loading}>Cargando...</p>}

        <div className={styles.formGroup}>
          <div className={styles.inputContainer}>
            <label>Seleccionar Producto:</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              disabled={loading}
              className={styles.selectInput}
            >
              <option value="">-- Selecciona un producto --</option>
              {products.map((product) => (
                <option 
                  key={product.id} 
                  value={product.id}
                >
                  {product.nombre} ({product.categoria_nombre}) - {product.unidad}
                </option>
              ))}
            </select>
          </div>

          {selectedProductId && (
            <>
              <div className={styles.inputContainer}>
                <label>Nueva Cantidad:</label>
                <input
                  type="number"
                  min="0"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  disabled={loading}
                  className={styles.numberInput}
                  placeholder="Ingrese la nueva cantidad"
                />
              </div>

              <button
                onClick={updateManualQuantity}
                disabled={loading || !selectedProductId || !newQuantity}
                className={styles.updateButton}
              >
                {loading ? 'Actualizando...' : 'Actualizar Cantidad'}
              </button>
            </>
          )}
        </div>

        {errorMessage && (
          <div className={styles.errorMessage}>
            <p>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className={styles.successMessage}>
            <p>{successMessage}</p>
          </div>
        )}

        {/* Tabla de inventario actual para el producto seleccionado */}
        {selectedProductId && inventory.length > 0 && (
          <div className={styles.currentInventory}>
            <h3>Inventario Actual</h3>
            <table className={styles.inventoryTable}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Cantidad Actual</th>
                  <th>Unidad</th>
                  <th>Fecha de Ingreso</th>
                  <th>Fecha de Caducidad</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, index) => (
                  <tr key={`row-${index}`}>
                    <td>{item.producto_nombre}</td>
                    <td>{item.categoria_nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.unidad}</td>
                    <td>{new Date(item.fecha_ingreso).toLocaleDateString()}</td>
                    <td>{item.fecha_caducidad ? new Date(item.fecha_caducidad).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
      </div>
      <WhatsAppButton />
    </div>
    
  );
};

export default UpdateInventory;