// PedidoTemplate.js
import React from 'react';
import styles from './PedidoTemplate.module.css';
import logo from '../../imagenes/LogoMKSF.png';

const PedidoTemplate = React.forwardRef(({ pedido, proveedor, empresaInfo }, ref) => {
    // Formatear la fecha
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <div ref={ref} className={styles.templateContainer}>
            {/* Encabezado con logo e información de la empresa */}
            <div className={styles.header}>
                <div className={styles.logoContainer}>
                    <img src={logo} className="App-logo" alt="Logo" />
                    <h1>{empresaInfo.nombre}</h1>
                </div>
                <div className={styles.empresaInfo}>
                    <p>{empresaInfo.direccion}</p>
                    <p>{empresaInfo.ciudad}</p>
                    <p>Tel: {empresaInfo.telefono}</p>
                    <p>Email: {empresaInfo.email}</p>
                    <p>Web: {empresaInfo.web}</p>
                </div>
            </div>

            {/* Título del documento */}
            <h2 className={styles.documentTitle}>PEDIDO A PROVEEDOR</h2>

            {/* Paso 1: Información del proveedor y pedido */}
            <div className={styles.section}>
                <h3>PASO 1: INFORMACIÓN DEL PROVEEDOR Y PEDIDO</h3>
                <table className={styles.infoTable}>
                    <tbody>
                        <tr>
                            <td>PROVEEDOR:</td>
                            <td>{proveedor.nombre}</td>
                            <td>N° PEDIDO:</td>
                            <td>{pedido.id}</td>
                        </tr>
                        <tr>
                            <td>CONTACTO:</td>
                            <td>{proveedor.contacto}</td>
                            <td>FECHA PEDIDO:</td>
                            <td>{formatDate(pedido.fecha_pedido)}</td>
                        </tr>
                        <tr>
                            <td>TELÉFONO:</td>
                            <td>{proveedor.telefono}</td>
                            <td>ESTADO:</td>
                            <td>{pedido.estado}</td>
                        </tr>
                        <tr>
                            <td>EMAIL:</td>
                            <td>{proveedor.email}</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>CIUDAD:</td>
                            <td>{proveedor.ciudad}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Paso 2: Detalle de los productos */}
            <div className={styles.section}>
                <h3>PASO 2: DETALLE DE PRODUCTOS SOLICITADOS</h3>
                <table className={styles.productTable}>
                    <thead>
                        <tr>
                            <th>PRODUCTO</th>
                            <th>UNIDAD</th>
                            <th>CANTIDAD</th>
                            <th>OBSERVACIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedido.productos.map((producto, index) => (
                            <tr key={index}>
                                <td>{producto.producto}</td>
                                <td>{producto.unidad}</td>
                                <td>{producto.cantidad}</td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paso 3: Instrucciones finales */}
            <div className={styles.section}>
                <h3>PASO 3: INSTRUCCIONES DE ENTREGA</h3>
                <p>
                    Por favor confirmar recepción de este pedido y fecha estimada de entrega.
                    En caso de cualquier inconveniente, comunicarse al {empresaInfo.telefono}.
                </p>
            </div>

            {/* Firma y sello */}
            <div className={styles.signatureSection}>
                <div className={styles.signatureBox}>
                    <p>FIRMA AUTORIZADA</p>
                </div>
                <div className={styles.stampBox}>
                    <p>SELLO DE LA EMPRESA</p>
                </div>
            </div>
        </div>
    );
});

export default PedidoTemplate;