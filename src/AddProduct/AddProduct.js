import React, { useState, useEffect } from 'react';
import styles from './AddProduct.module.css';
import WhatsAppButton from '../WhatsAppButton';
import LogoutButton from '../LogoutButton';

/**
 * Componente para agregar un nuevo producto o aumentar el stock de uno existente.
 * 
 * Este componente permite al usuario seleccionar una categoría, un producto 
 * (existente o nuevo), especificar la unidad, cantidad y fecha de caducidad.
 * Luego, envía esta información al servidor para su almacenamiento.
 */
const AddProduct = () => {
  //ESTADOS
  const [categorias, setCategorias] = useState([]);             // Lista de categorías disponibles
  const [productos, setProductos] = useState([]);               // Lista de productos filtrados por categoría
  const [categoria, setCategoria] = useState('');               // Categoría seleccionada
  const [productoSeleccionado, setProductoSeleccionado] = useState(''); // Producto seleccionado (por id o "otro")
  const [nuevoProducto, setNuevoProducto] = useState('');       // Nombre del nuevo producto (si es "otro")
  const [unidad, setUnidad] = useState('');                     // Unidad de medida (ej. kg, pieza)
  const [cantidad, setCantidad] = useState('');                 // Cantidad del producto
  const [fecha, setFecha] = useState('');                       // Fecha de caducidad (opcional)
  const [message, setMessage] = useState('');                   // Mensaje para mostrar éxito o error

  /**
   * useEffect para cargar las categorías al montar el componente.
   */
  useEffect(() => {
    fetch('http://localhost/MakiManage/inventario/get_categorias.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setCategorias(data.categorias);
      });
  }, []);

  /**
   * useEffect que se activa cada vez que se cambia la categoría.
   * Carga los productos correspondientes a la categoría seleccionada.
   */
  useEffect(() => {
    if (categoria) {
      cargarProductos(categoria);
      setProductoSeleccionado('');
      setNuevoProducto('');
    }
  }, [categoria]);

  /**
   * Carga los productos asociados a una categoría específica desde el servidor.
   * @param {string} categoria_id - ID de la categoría seleccionada.
   */
  const cargarProductos = (categoria_id) => {
    fetch('http://localhost/MakiManage/inventario/get_productos.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria_id: parseInt(categoria_id) }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setProductos(data.productos);
        else setProductos([]); // Si hay error, limpiar la lista
      });
  };

  /**
   * Maneja el envío del formulario.
   * Valida los campos y envía la información al servidor.
   * Si el producto no existe, se usa el valor de "nuevoProducto".
   * @param {Event} e - Evento del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determinar el nombre del producto a enviar
    const nombre = productoSeleccionado === 'otro'
      ? nuevoProducto.trim()
      : productos.find(p => p.id === parseInt(productoSeleccionado))?.nombre;

    // Validación de campos obligatorios
    if (!categoria || !nombre || !unidad || !cantidad) {
      setMessage('⚠️ Todos los campos son obligatorios');
      return;
    }

    // Preparar el objeto con los datos a enviar
    const payload = {
      categoria_id: parseInt(categoria),
      nombre,
      unidad,
      cantidad: parseInt(cantidad),
      fecha_caducidad: fecha || null,
    };

    try {
      // Enviar los datos al servidor
      const response = await fetch('http://localhost/MakiManage/inventario/agregar_producto_o_stock.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setMessage(data.message);

      // Si se guardó exitosamente, limpiar los campos
      if (data.status === 'success') {
        setCategoria('');
        setProductoSeleccionado('');
        setNuevoProducto('');
        setUnidad('');
        setCantidad('');
        setFecha('');
        cargarProductos(); // Opcional: recargar lista de productos
      }
    } catch (err) {
      setMessage('❌ Error al conectar con el servidor');
    }
  };
  
  return (
    <div className={styles.bodyContainer}>
      <LogoutButton /> 
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Agregar Producto o Stock</h2>

        {/* Formulario para agregar producto */}
        <form className={styles.form} onSubmit={handleSubmit}>

          {/* Selector de categoría */}
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

          {/* Selector de producto */}
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

          {/* Campo para nombre de nuevo producto si se selecciona "otro" */}
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

          {/* Campo de unidad */}
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

          {/* Campo de cantidad */}
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

          {/* Campo de fecha de caducidad */}
          <div className={styles.inputContainer}>
            <label className={styles.label}>Fecha de caducidad:</label>
            <input
              className={styles.input}
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          {/* Botón para enviar */}
          <button className={styles.button} type="submit">Guardar</button>
        </form>

        {/* Mensaje de error o éxito */}
        {message && <p className={styles.message}>{message}</p>}
      </div>
      <WhatsAppButton />
    </div>
  );
};

export default AddProduct;
