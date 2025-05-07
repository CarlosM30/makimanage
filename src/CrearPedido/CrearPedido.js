import React, { useState, useEffect } from 'react';
import styles from './CrearPedido.module.css';

/**
 * Componente para crear un pedido a un proveedor.
 * 
 * Este formulario permite seleccionar un proveedor, añadir uno o más productos 
 * con sus respectivas unidades y cantidades, y enviar el pedido a la base de datos.
 * 
 * @component
 * @returns {JSX.Element} Formulario de creación de pedido.
 */
const CrearPedido = () => {
    // Estado para almacenar la lista de proveedores obtenidos de la base de datos
    const [proveedores, setProveedores] = useState([]);

    // Estado para guardar el ID del proveedor seleccionado en el formulario
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');

    // Estado para guardar el nombre del producto ingresado
    const [producto, setProducto] = useState('');

    // Estado para guardar la unidad del producto (ej. kg, caja, litro)
    const [unidad, setUnidad] = useState('');

    // Estado para guardar la cantidad del producto
    const [cantidad, setCantidad] = useState('');

    // Lista de productos que se han agregado al pedido actual
    const [productosPedido, setProductosPedido] = useState([]);

    // Mensaje de estado para mostrar errores o confirmaciones
    const [message, setMessage] = useState('');

    /**
     * useEffect que carga la lista de proveedores desde el backend al iniciar el componente.
     */
    useEffect(() => {
        fetch('http://localhost/MakiManage/proveedores/get_proveedores.php')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setProveedores(data.proveedores);
                }
            })
            .catch(error => {
                console.error('Error al cargar proveedores:', error);
            });
    }, []);

    /**
     * Función para agregar un producto al pedido antes de enviarlo.
     */
    const agregarProducto = () => {
        if (!producto || !unidad || !cantidad) {
            setMessage('Completa todos los campos del producto');
            return;
        }

        // Agrega el nuevo producto a la lista actual de productos del pedido
        setProductosPedido([
            ...productosPedido,
            { producto, unidad, cantidad }
        ]);

        // Limpiar los campos de entrada del producto
        setProducto('');
        setUnidad('');
        setCantidad('');
        setMessage('');
    };

    /**
     * Función para enviar el pedido completo al servidor.
     */
    const enviarPedido = async () => {
        if (!proveedorSeleccionado || productosPedido.length === 0) {
            setMessage('Selecciona un proveedor y agrega al menos un producto');
            return;
        }

        try {
            const response = await fetch('http://localhost/MakiManage/inventario/crear_pedido.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    proveedor_id: proveedorSeleccionado,
                    productos: productosPedido
                })
            });

            const data = await response.json();
            setMessage(data.message);

            if (data.status === 'success') {
                // Reiniciar formulario después de un pedido exitoso
                setProveedorSeleccionado('');
                setProductosPedido([]);
            }
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            setMessage('Error al conectar con el servidor');
        }
    };

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.formContainer}>
                <h2 className={styles.title}>Crear Pedido a Proveedor</h2>

                {/* Selector de proveedor */}
                <div className={styles.inputContainer}>
                    <label>Proveedor:</label>
                    <select
                        value={proveedorSeleccionado}
                        onChange={(e) => setProveedorSeleccionado(e.target.value)}
                    >
                        <option value="">Selecciona un proveedor</option>
                        {proveedores.map((prov) => (
                            <option key={prov.id} value={prov.id}>
                                {prov.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <hr />

                <h3>Agregar Producto</h3>

                {/* Campos para ingresar un producto */}
                <div className={styles.inputContainer}>
                    <label>Producto:</label>
                    <input type="text" value={producto} onChange={(e) => setProducto(e.target.value)} />
                </div>

                <div className={styles.inputContainer}>
                    <label>Unidad:</label>
                    <input type="text" value={unidad} onChange={(e) => setUnidad(e.target.value)} />
                </div>

                <div className={styles.inputContainer}>
                    <label>Cantidad:</label>
                    <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                </div>

                {/* Botón para agregar producto al pedido */}
                <button type="button" className={styles.button} onClick={agregarProducto}>
                    Agregar al Pedido
                </button>

                {/* Lista de productos agregados al pedido */}
                <h3>Productos en el Pedido</h3>
                <ul>
                    {productosPedido.map((item, index) => (
                        <li key={index}>
                            {item.producto} - {item.cantidad} {item.unidad}
                        </li>
                    ))}
                </ul>

                {/* Botón para enviar el pedido */}
                <button className={styles.button} onClick={enviarPedido}>Enviar Pedido</button>

                {/* Mensaje de confirmación o error */}
                {message && <p className={styles.message}>{message}</p>}
            </div>
        </div>
    );
};

export default CrearPedido;
