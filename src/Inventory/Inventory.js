import React, { useState, useEffect } from 'react';
import styles from './Inventory.module.css';
import WhatsAppButton from '../WhatsAppButton';
import LogoutButton from '../LogoutButton';

const InventarioPorCategoria = () => {
    const [categorias, setCategorias] = useState([]);
    const [inventario, setInventario] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Función para formatear la fecha de caducidad
    const formatFecha = (fecha) => {
        if (!fecha) return 'No especificada';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES');
    };

    // Función para determinar el color de la fecha según proximidad a caducidad
    const getFechaStyle = (fecha) => {
        if (!fecha) return {};
        
        const hoy = new Date();
        const fechaCad = new Date(fecha);
        const diffTime = fechaCad - hoy;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 7) return { color: 'red', fontWeight: 'bold' };
        if (diffDays <= 30) return { color: 'orange' };
        return { color: 'green' };
    };

    // Función para realizar peticiones fetch con manejo de errores
    const fetchData = async (url, options = {}) => {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en fetch:', error);
            throw error;
        }
    };

    // Cargar categorías
    useEffect(() => {
        const loadCategorias = async () => {
            setLoading(true);
            try {
                const data = await fetchData('http://localhost/MakiManage/get_categorias.php');
                setCategorias(data.categorias);
            } catch (err) {
                setError(`Error al cargar categorías: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        loadCategorias();
    }, []);

    // Cargar inventario cuando se selecciona categoría
    useEffect(() => {
        if (categoriaSeleccionada) {
            const loadInventario = async () => {
                setLoading(true);
                try {
                    const data = await fetchData(
                        `http://localhost/MakiManage/get_inventario_por_categoria.php?categoria_id=${categoriaSeleccionada}`
                    );
                    setInventario(data.inventario);
                } catch (err) {
                    setError(`Error al cargar inventario: ${err.message}`);
                } finally {
                    setLoading(false);
                }
            };
            loadInventario();
        }
    }, [categoriaSeleccionada, successMessage]);

    const usarProducto = async (productoId, cantidadActual, productoNombre) => {
        if (cantidadActual <= 0) {
            alert(`No hay stock de ${productoNombre}`);
            return;
        }

        if (!window.confirm(`¿Usar 1 unidad de ${productoNombre}?`)) return;

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            await fetchData('http://localhost/MakiManage/use_producto.php', {
                method: 'POST',
                body: JSON.stringify({
                    producto_id: productoId,
                    cantidad: 1
                })
            });

            setSuccessMessage(`Se usó 1 ${productoNombre}`);
            setTimeout(() => setSuccessMessage(''), 3000);

            // Actualizar estado local
            setInventario(prev => prev.map(item => 
                item.producto_id === productoId 
                    ? {...item, cantidad_total: item.cantidad_total - 1} 
                    : item
            ));

            if (cantidadActual - 1 === 0) {
                alert(`¡Stock agotado! Por favor reponer ${productoNombre}`);
            }
        } catch (error) {
            setError(`Error al usar producto: ${error.message}`);
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className={styles.bodyContainer}>
        <LogoutButton /> 
        <div className={styles.inventarioContainer}>
            <h2 className={styles.title}>Inventario por Categoría</h2>
            
            {loading && <div className={styles.loading}>Cargando inventario...</div>}
            {error && <div className={styles.error}>{error}</div>}
            {successMessage && <div className={styles.success}>{successMessage}</div>}

            <div className={styles.categoriaSelector}>
                <label htmlFor="categoria-select">Categoría:</label>
                <select
                    id="categoria-select"
                    value={categoriaSeleccionada || ''}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    className={styles.selectInput}
                    disabled={loading}
                >
                    <option value="">-- Seleccione una categoría --</option>
                    {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
            </div>

            {categoriaSeleccionada ? (
                inventario.length > 0 ? (
                    <div className={styles.tableContainer}>
                        <table className={styles.productosTable}>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Caducidad</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventario.map(p => (
                                    <tr key={p.producto_id}>
                                        <td>{p.producto_nombre} ({p.unidad})</td>
                                        <td>{p.cantidad_total}</td>
                                        <td style={getFechaStyle(p.proxima_caducidad)}>
                                            {formatFecha(p.proxima_caducidad)}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => usarProducto(p.producto_id, p.cantidad_total, p.producto_nombre)}
                                                disabled={loading || p.cantidad_total <= 0}
                                                className={styles.useButton}
                                            >
                                                Usar 1
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.noData}>No hay productos en esta categoría</div>
                )
            ) : (
                <div className={styles.instruction}>Seleccione una categoría para ver el inventario</div>
            )}
        </div>
        <WhatsAppButton />
    </div>
);
};

export default InventarioPorCategoria;