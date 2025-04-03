import React, { useState, useEffect } from 'react';
import styles from './AddProduct.module.css';

const AddProduct = () => {
  const [categories, setCategories] = useState([]); // Lista de categorías
  const [selectedCategory, setSelectedCategory] = useState(''); // Categoría seleccionada
  const [productName, setProductName] = useState(''); // Nombre del producto
  const [unit, setUnit] = useState(''); // Unidad de medida
  const [quantity, setQuantity] = useState(0); // Cantidad
  const [message, setMessage] = useState(''); // Mensaje de respuesta

  useEffect(() => {
    fetch('http://localhost/MakiManage/get_inventario.php') // Obtiene las categorías
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          const uniqueCategories = [...new Set(data.productos.map(item => item.categoria))];
          setCategories(uniqueCategories);
        } else {
          setMessage('Error al obtener las categorías');
        }
      })
      .catch(error => setMessage('Error de conexión con el servidor.'));
  }, []);

  const handleAddProduct = () => {
    if (!selectedCategory || !productName || !unit || quantity <= 0) {
      setMessage('Por favor, completa todos los campos');
      return;
    }

    fetch('http://localhost/MakiManage/add_product.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categoria: selectedCategory,
        producto: productName,
        unidad: unit,
        cantidad: quantity,
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setMessage('Producto agregado con éxito');
          setProductName('');
          setUnit('');
          setQuantity(0);
        } else {
          setMessage('Error al agregar el producto');
        }
      })
      .catch(error => setMessage('Error al conectar con el servidor.'));
  };

  return (
    <div className={styles.container}>
      <h2>Agregar Producto</h2>

      <label>Selecciona una categoría:</label>
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">-- Seleccionar --</option>
        {categories.map((categoria, index) => (
          <option key={index} value={categoria}>{categoria}</option>
        ))}
      </select>

      <label>Nombre del Producto:</label>
      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <label>Unidad de Medida:</label>
      <input
        type="text"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      />

      <label>Cantidad:</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <button onClick={handleAddProduct}>Agregar Producto</button>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default AddProduct;
