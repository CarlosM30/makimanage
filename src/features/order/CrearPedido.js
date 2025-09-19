import React, { useState, useEffect, useRef } from 'react';
import styles from './CrearPedido.module.css';
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton';
import LogoutButton from '../../components/Buttons/LogoutButton';
//import { useReactToPrint } from 'react-to-print';
import PedidoTemplate from './PedidoTemplate';
// eslint-disable-next-line
import html2pdf from 'html2pdf.js';

/**
 * Componente para crear un pedido a un proveedor.
 * 
 * Este formulario permite seleccionar un proveedor, añadir uno o más productos 
 * con sus respectivas unidades y cantidades, enviar el pedido a la base de datos
 * y generar un PDF con el detalle del pedido.
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

    // Información de la empresa para el PDF
    const [empresaInfo] = useState({
        nombre: "MakiManage",
        direccion: "Av. Constituyentes 120",
        ciudad: "Queretaro, Queretaro",
        telefono: "442 331 6515",
        email: "mk.sushi.mx@gmail.com",
        web: "http://www.mksushi.mx/"
    });

    // Referencia para el componente de impresión
    const templateRef = useRef();

    // Estado para controlar la visualización de la vista previa
    const [showPreview, setShowPreview] = useState(false);

    // Estado para almacenar los datos del pedido creado
    const [pedidoCreado, setPedidoCreado] = useState(null);

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
     * Configuración para la generación del PDF
     */
    const handleDownloadPDF = () => {
    const element = templateRef.current;

    if (!element) {
        setMessage("No se pudo encontrar el contenido para exportar.");
        return;
    }

    const opt = {
        margin:       0.5,
        filename:     `pedido_${pedidoCreado.id}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save()
        .catch(err => {
            console.error("Error al generar el PDF:", err);
            setMessage("Hubo un problema al descargar el PDF.");
        });
};


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
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al procesar la solicitud');
            }

            setMessage(data.message);

            if (data.status === 'success') {
                // Guardar los datos del pedido creado para el PDF
                const proveedorData = proveedores.find(p => p.id === proveedorSeleccionado);
                setPedidoCreado({
                    id: data.pedido_id,
                    fecha_pedido: new Date().toISOString(),
                    estado: 'Pendiente',
                    productos: productosPedido,
                    proveedor: proveedorData
                });
                
                // Limpiar el formulario
                setProveedorSeleccionado('');
                setProductosPedido([]);
                
                // Mostrar la vista previa del PDF
                setShowPreview(true);
            }
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            setMessage(error.message || 'Error al conectar con el servidor');
        }
    };

    return (
        <div className={styles.bodyContainer}>
            <LogoutButton /> 
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
            <WhatsAppButton />

            {/* Modal para vista previa del PDF */}
            {showPreview && pedidoCreado && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Vista Previa del Pedido</h2>
                        
                        <div className={styles.previewActions}>
                            <button onClick={handleDownloadPDF}>Descargar PDF</button>
                            <button onClick={() => setShowPreview(false)}>Cerrar</button>
                        </div>
                        
                        <div className={styles.previewContainer}>
                            <PedidoTemplate 
                                ref={templateRef}
                                pedido={pedidoCreado}
                                proveedor={pedidoCreado.proveedor}
                                empresaInfo={empresaInfo}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrearPedido;