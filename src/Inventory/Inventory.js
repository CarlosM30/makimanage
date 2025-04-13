import React, { useState, useEffect } from 'react';
import styles from './Inventory.module.css';

const Inventory = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [nuevoProducto, setNuevoProducto] = useState('');
  const [unidad, setUnidad] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fechaCaducidad, setFechaCaducidad] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Cargar categorías
  useEffect(() => {
    fetch('http://localhost/MakiManage/inventario/get_categorias.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setCategorias(data.categorias);
        }
      });
  }, []);

  // Cargar productos existentes
  useEffect(() => {
    fetch('http://localhost/MakiManage/inventario/get_productos.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setProductos(data.productos);
        }
      });
  }, []);

  const handleGuardar = () => {
    if (!selectedCategoryId || (!selectedProductId && !nuevoProducto) || !unidad || !cantidad) {
      setMensaje('⚠️ Completa todos los campos requeridos.');
      return;
    }

    const payload = {
      nombre: selectedProductId === 'otro' ? nuevoProducto : productos.find(p => p.id === parseInt(selectedProductId)).nombre,
      unidad,
      cantidad: parseInt(cantidad),
      fecha_caducidad: fechaCaducidad || null,
      categoria_id: parseInt(selectedCategoryId),
    };

    fetch('http://localhost/MakiManage/inventario/agregar_producto_o_stock.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setMensaje(data.message || 'Guardado');
        setUnidad('');
        setCantidad('');
        setFechaCaducidad('');
        setNuevoProducto('');
        setSelectedProductId('');
      })
      .catch(err => {
        console.error(err);
        setMensaje('❌ Error al guardar.');
      });
  };

  return (
    <div className={styles.bodyContainer}>
      <h2 className={styles.title}>Agregar Producto o Stock</h2>

      <div className={styles.inputContainer}>
        <label>Categoría:</label>
        <select value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)}>
          <option value="">-- Seleccionar --</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      <div className={styles.inputContainer}>
        <label>Producto:</label>
        <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}>
          <option value="">-- Seleccionar --</option>
          {productos.map(prod => (
            <option key={prod.id} value={prod.id}>{prod.nombre}</option>
          ))}
          <option value="otro">Otro...</option>
        </select>
      </div>

      {selectedProductId === 'otro' && (
        <div className={styles.inputContainer}>
          <label>Nuevo Producto:</label>
          <input type="text" value={nuevoProducto} onChange={e => setNuevoProducto(e.target.value)} />
        </div>
      )}

      <div className={styles.inputContainer}>
        <label>Unidad:</label>
        <input type="text" value={unidad} onChange={e => setUnidad(e.target.value)} />
      </div>

      <div className={styles.inputContainer}>
        <label>Cantidad:</label>
        <input type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} />
      </div>

      <div className={styles.inputContainer}>
        <label>Fecha de caducidad (opcional):</label>
        <input type="date" value={fechaCaducidad} onChange={e => setFechaCaducidad(e.target.value)} />
      </div>

      <button onClick={handleGuardar} className={styles.btnGuardar}>Guardar</button>

      {mensaje && <p className={styles.message}>{mensaje}</p>}
    </div>
  );
};

export default Inventory;
