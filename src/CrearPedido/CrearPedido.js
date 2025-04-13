import React, { useState, useEffect } from 'react';
import styles from './CrearPedido.module.css';

const CrearPedido = () => {
    const [proveedores, setProveedores] = useState([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
    const [producto, setProducto] = useState('');
    const [unidad, setUnidad] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [productosPedido, setProductosPedido] = useState([]);
    const [message, setMessage] = useState('');

    // Obtener proveedores desde la base
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

    const agregarProducto = () => {
        if (!producto || !unidad || !cantidad) {
            setMessage('Completa todos los campos del producto');
            return;
        }

        setProductosPedido([
            ...productosPedido,
            { producto, unidad, cantidad }
        ]);

        setProducto('');
        setUnidad('');
        setCantidad('');
        setMessage('');
    };

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

                <button type="button" className={styles.button} onClick={agregarProducto}>
                    Agregar al Pedido
                </button>

                <h3>Productos en el Pedido</h3>
                <ul>
                    {productosPedido.map((item, index) => (
                        <li key={index}>
                            {item.producto} - {item.cantidad} {item.unidad}
                        </li>
                    ))}
                </ul>

                <button className={styles.button} onClick={enviarPedido}>Enviar Pedido</button>

                {message && <p className={styles.message}>{message}</p>}
            </div>
        </div>
    );
};

export default CrearPedido;
