import React, { useState, useEffect } from 'react';
import styles from './AddProduct.module.css';

const AddProduct = () => {
  const [categoria, setCategoria] = useState('');
  const [producto, setProducto] = useState('');
  const [unidad, setUnidad] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [message, setMessage] = useState('');
  const [tablas, setTablas] = useState([]);

  // ⚠️ Se usa por ahora mientras no sea automático
  const categoriasConFecha = ["alga", "carne", "harina", "lacteos", "mariscos"];

  // 🔁 Obtener las tablas dinámicamente
  useEffect(() => {
    fetch('http://localhost/MakiManage/get_tablas.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setTablas(data.tablas);
        }
      })
      .catch(err => console.error('Error al cargar tablas:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoria || !producto || !unidad || !cantidad || (categoriasConFecha.includes(categoria) && !fecha)) {
      setMessage('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await fetch('http://localhost/MakiManage/add_product.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoria,
          producto,
          unidad,
          cantidad,
          fecha_caducidad: fecha || null
        })
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.status === 'success') {
        setCategoria('');
        setProducto('');
        setUnidad('');
        setCantidad('');
        setFecha('');
      }

    } catch (error) {
      console.error(error);
      setMessage('Error al conectar con el servidor');
    }
  };

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Pedido Nuevo Producto</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Categoría:</label>
            <select
              className={styles.select}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecciona una tabla</option>
              {tablas.map((tabla, index) => (
                <option key={index} value={tabla}>{tabla}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label}>Producto:</label>
            <input
              className={styles.input}
              type="text"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              required
            />
          </div>

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

          {/* Mostrar el campo de fecha solo si la tabla requiere Fecha_C */}
          {categoriasConFecha.includes(categoria) && (
            <div className={styles.inputContainer}>
              <label className={styles.label}>Fecha de Caducidad:</label>
              <input
                className={styles.input}
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>
          )}

          <button className={styles.button} type="submit">Agregar Producto</button>
        </form>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default AddProduct;
