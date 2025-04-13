import React, { useState, useEffect } from 'react';
import styles from './AddProduct.module.css';

const AddProduct = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);

  const [categoria, setCategoria] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [nuevoProducto, setNuevoProducto] = useState('');
  const [unidad, setUnidad] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [message, setMessage] = useState('');

  // Cargar categorías
  useEffect(() => {
    fetch('http://localhost/MakiManage/inventario/get_categorias.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setCategorias(data.categorias);
      });
  }, []);

  // Función para cargar productos
  // Función para cargar productos filtrados por categoría
const cargarProductos = (categoria_id) => {
  fetch('http://localhost/MakiManage/inventario/get_productos.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categoria_id: parseInt(categoria_id) }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') setProductos(data.productos);
      else setProductos([]);
    });
};

// Nuevo useEffect que se activa cuando se elige una categoría
useEffect(() => {
  if (categoria) {
    cargarProductos(categoria);
    setProductoSeleccionado('');
    setNuevoProducto('');
  }
}, [categoria]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nombre = productoSeleccionado === 'otro'
      ? nuevoProducto.trim()
      : productos.find(p => p.id === parseInt(productoSeleccionado))?.nombre;

    if (!categoria || !nombre || !unidad || !cantidad) {
      setMessage('⚠️ Todos los campos son obligatorios');
      return;
    }

    const payload = {
      categoria_id: parseInt(categoria),
      nombre,
      unidad,
      cantidad: parseInt(cantidad),
      fecha_caducidad: fecha || null,
    };

    try {
      const response = await fetch('http://localhost/MakiManage/inventario/agregar_producto_o_stock.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.status === 'success') {
        // Limpiar campos
        setCategoria('');
        setProductoSeleccionado('');
        setNuevoProducto('');
        setUnidad('');
        setCantidad('');
        setFecha('');
        cargarProductos(); // ← Actualizar productos
      }
    } catch (err) {
      setMessage('❌ Error al conectar con el servidor');
    }
  };

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Agregar Producto o Stock</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Categoría:</label>
            <select
              className={styles.select}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label}>Producto:</label>
            <select
              className={styles.select}
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
              required
            >
              <option value="">Selecciona un producto</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
              <option value="otro">Otro...</option>
            </select>
          </div>

          {productoSeleccionado === 'otro' && (
            <div className={styles.inputContainer}>
              <label className={styles.label}>Nuevo producto:</label>
              <input
                className={styles.input}
                type="text"
                value={nuevoProducto}
                onChange={(e) => setNuevoProducto(e.target.value)}
                required
              />
            </div>
          )}

          <div className={styles.inputContainer}>
            <label className={styles.label}>Unidad:</label>
            <input
              className={styles.input}
              type="text"
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label}>Cantidad:</label>
            <input
              className={styles.input}
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label}>Fecha de caducidad:</label>
            <input
              className={styles.input}
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <button className={styles.button} type="submit">Guardar</button>
        </form>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default AddProduct;
