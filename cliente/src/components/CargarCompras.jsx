import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { useNavigate } from 'react-router-dom';
import Ticket from './Ticket'; // Importa el componente Ticket.jsx

const CargarCompras = () => {
    const [proveedores, setProveedores] = useState([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
    const [direccionProveedor, setDireccionProveedor] = useState('');
    const [ruc, setRuc] = useState('');
    const [aperturaCajaRealizada, setAperturaCajaRealizada] = useState(false);
    const [fechaCompra, setFechaCompra] = useState(new Date().toISOString().substr(0, 10));
    const [productos, setProductos] = useState([]);
    const [filtroCodigo, setFiltroCodigo] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [cantidades, setCantidades] = useState({});
    const [totalVenta, setTotalVenta] = useState(0);
    const [elementosMostrados, setElementosMostrados] = useState(5);
    const [filtroDescripcion, setFiltroDescripcion] = useState('');
    const [codigoBarra, setCodigoBarra] = useState('');
    const [facturaNumero, setFacturaNumero] = useState('');
    const [ultimaVentaId, setUltimaVentaId] = useState('');
    const navigate = useNavigate();

    const actualizarStock = () => {
        const nuevosProductos = productos.map((producto) => {
            const productoEncontrado = productoSeleccionado.find((p) => p.codigo === producto.codigo);
            if (productoEncontrado) {
                return { ...producto, stock: producto.stock + productoEncontrado.cantidad };
            }
            return producto;
        });
        setProductos(nuevosProductos);
    };
    const formatNumberWithSeparators = (number) => {
        return number.toLocaleString('en-US');
    };

    useEffect(() => {
        obtenerProductos();
    }, []);

    useEffect(() => {
        buscarProductoPorCodigo();
    }, [codigoBarra]);

    useEffect(() => {
        console.log(ultimaVentaId);
    }, [ultimaVentaId]);

    useEffect(() => {
        calcularTotalVenta();
    }, [productoSeleccionado]);

    const obtenerProductos = async () => {
        try {
            const response = await axios.get('http://localhost:8000/productos');
            console.log("Productos obtenidos:", response.data);
            setProductos(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAgregarProducto = () => {
        setModalVisible(true);
    };

    const buscarProductoPorCodigo = () => {
        if (codigoBarra) {
            const productoEncontrado = productos.find((producto) => producto.codigo === codigoBarra);
            if (productoEncontrado) {
                const { codigo, descripcion, stock, preciocompra } = productoEncontrado;
                const cantidad = 1;
                const precioCompra = cantidad * preciocompra;
                const nuevoProducto = { codigo, cantidad, descripcion, stock, preciocompra, precioCompra };
                setProductoSeleccionado([...productoSeleccionado, nuevoProducto]);
                setCodigoBarra('');
            }
        }
    };

    const handleSeleccionarProducto = (producto) => {
        const { codigo, descripcion, stock, preciocompra } = producto;
        const cantidad = cantidades[codigo];
        const precioCompra = cantidad * preciocompra;
        const nuevoProducto = { codigo, cantidad, descripcion, stock, preciocompra, precioCompra };
        setProductoSeleccionado([...productoSeleccionado, nuevoProducto]);
        setModalVisible(false);
    };

    const handleCantidadChange = (codigo, cantidad) => {
        setCantidades({ ...cantidades, [codigo]: cantidad });
    };

    const handleEliminarProducto = (codigo) => {
        const nuevosProductos = productoSeleccionado.filter((producto) => producto.codigo !== codigo);
        setProductoSeleccionado(nuevosProductos);
    };

    const calcularTotalVenta = () => {
        const total = productoSeleccionado.reduce((acumulador, producto) => acumulador + producto.precioCompra, 0);
        setTotalVenta(total);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/compras', {
                proveedor: proveedorSeleccionado,
                ruc,
                direccionProveedor,
                fechaCompra,
                productos: productoSeleccionado,
                facturaNumero,
            });
            alert("Compra exitosa")
            console.log('Venta creada correctamente:', response.data);
            setProveedorSeleccionado('');
            setDireccionProveedor('');
            setRuc('');
            setProductoSeleccionado([]);
            setCantidades({});
            setFechaCompra(new Date().toISOString().substr(0, 10));
            actualizarStock();
            setFacturaNumero('');
        } catch (error) {
            console.error('Error al crear la venta:', error);
        }
    };
    const handleCerrarModal = () => {
        setModalVisible(false);
    };

    const productosFiltrados = productos.filter(producto => producto.descripcion.toLowerCase().includes(filtroDescripcion.toLowerCase()) && producto.codigo.toLowerCase().includes(filtroCodigo.toLowerCase()));

    useEffect(() => {
        const verificarAperturaCaja = async () => {
            try {
                const response = await axios.get('http://localhost:8000/ultima-apertura');
                const ultimaApertura = response.data;
                const fechaActual = new Date().toLocaleDateString();
                const fechaApertura = new Date(ultimaApertura.fecha).toLocaleDateString();

                if (fechaActual === fechaApertura) {
                    setAperturaCajaRealizada(true);
                } else {
                    navigate('/aperturacaja');
                }
            } catch (error) {
                console.error('Error al obtener la última apertura de caja:', error);
                navigate('/aperturacaja');
            }
        };

        verificarAperturaCaja();
    }, []);

    useEffect(() => {
        obtenerProveedores();
        obtenerProductos();
    }, []);

    const obtenerProveedores = async () => {
        try {
            const response = await axios.get('http://localhost:8000/proveedores');
            setProveedores(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    const handleSeleccionarProveedor = async (proveedorId) => {
        try {
            const response = await axios.get(`http://localhost:8000/proveedores/${proveedorId}`);
            const proveedor = response.data;
            setProveedorSeleccionado(proveedor.nombre);
            setDireccionProveedor(proveedor.direccion);
            setRuc(proveedor.ruc);
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <div className='cajagrandeventas'>
            {aperturaCajaRealizada ? (
                <>
                    <h2 className='bi bi-cash-stack ventas'>Crear Compras</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='CajaGrande'>
                            <div className='subcajacliente input-group' style={{ gridColumnStart: '1', gridColumnEnd: '2' }}>
                                <label>Proveedor:</label>
                                <select
                                    className='form-control ms-2'
                                    value={proveedorSeleccionado}
                                    onChange={(e) => handleSeleccionarProveedor(e.target.value)}
                                >
                                    <option value=''>Seleccionar proveedor</option>
                                    {proveedores.map((proveedor) => (
                                        <option key={proveedor._id} value={proveedor._id}>
                                            {proveedor.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='subcajacliente input-group' style={{ gridColumnStart: '1', gridColumnEnd: '2' }}>
                                <label>Dirección:</label>
                                <input
                                    className='form-control ms-2'
                                    type='text'
                                    value={direccionProveedor}
                                    onChange={(e) => setDireccionProveedor(e.target.value)}
                                />
                            </div>
                            <div className='subcajacliente input-group' style={{ gridColumnStart: '2', gridColumnEnd: '1' }}>
                                <label>RUC:</label>
                                <input className='form-control ms-2' type='text' value={ruc} onChange={(e) => setRuc(e.target.value)} />
                            </div>
                            <div className='subcajacliente input-group'>
                                <label htmlFor="factura">Factura N°:</label>
                                <input
                                    className='form-control ms-2'
                                    type="text"
                                    id="factura"
                                    value={facturaNumero}
                                    onChange={(e) => setFacturaNumero(e.target.value)}
                                    required
                                />
                            </div>

                            <input
                                className='form-control-sm'
                                type="text"
                                placeholder='Ingrese Codigo de Barra'
                                value={codigoBarra}
                                onChange={(e) => {
                                    console.log("Código de barras ingresado:", e.target.value);
                                    setCodigoBarra(e.target.value);
                                }}
                            />
                        </div>

                        <button className='btn btn-success bi bi-plus-circle' type="button" onClick={handleAgregarProducto}>Agregar Producto</button>

                        {productoSeleccionado.length > 0 && (
                            <div>
                                <h3 className='productoseleccionado bi bi-shop'>Productos Seleccionados:</h3>
                                <div className='cajagrandeproductosseleccionados'>
                                    <table className='table table-striped-columns'>
                                        <thead>
                                            <tr>
                                                <th>Código</th>
                                                <th>Cantidad</th>
                                                <th>Descripción</th>
                                                <th>Stock</th>
                                                <th>Precio Unitario</th>
                                                <th>Precio de Compra</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productoSeleccionado.map((producto) => (
                                                <tr key={producto.codigo}>
                                                    <td>{producto.codigo}</td>
                                                    <td>{producto.cantidad}</td>
                                                    <td>{producto.descripcion}</td>
                                                    <td>{producto.stock}</td>
                                                    <td>{formatNumberWithSeparators(producto.preciocompra)}Gs.</td>
                                                    <td>{formatNumberWithSeparators(producto.precioCompra)}Gs.</td>
                                                    <td>
                                                        <button className='btn btn-danger bi bi-x-circle' type="button" onClick={() => handleEliminarProducto(producto.codigo)}>Eliminar</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="5">Total</td>
                                                <td>{formatNumberWithSeparators(totalVenta)}Gs.</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td colSpan="5">Iva 10%</td>
                                                <td>{(totalVenta / 11).toFixed(2)}Gs.</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        )}
                        {modalVisible && (
                            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
                                <div className='modalproductos' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px' }}>
                                    <h3 className='productos bi bi-pencil-square'>Productos</h3>
                                    <div className='registrobuscador'>
                                        <div className='registro'>
                                            <label htmlFor="">Mostrar</label>
                                            <select className='form-select-sm' name="" id="" onChange={(e) => setElementosMostrados(Number(e.target.value))}>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="9999">Todo</option>
                                            </select>
                                        </div>
                                        <div className='buscar'>
                                            <label className='labelbuscar' htmlFor="">Buscar:</label>
                                            <input className='form-control-sm' type="text" value={filtroDescripcion} onChange={(e) => setFiltroDescripcion(e.target.value)} />
                                            <label className='labelbuscar' htmlFor="">Codigo:</label>
                                            <input className='form-control-sm' type="text" value={filtroCodigo} onChange={(e) => setFiltroCodigo(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className='submodalproductos' style={{ maxHeight: '300px', overflow: 'auto' }}>
                                        <table className='table table-striped-columns'>
                                            <thead>
                                                <tr>
                                                    <th>Código</th>
                                                    <th>Lote Número</th>
                                                    <th style={{ width: '50px' }}>Cantidad</th>
                                                    <th>Descripción</th>
                                                    <th>Stock</th>
                                                    <th>Precio Unitario</th>
                                                    <th style={{ width: '150px' }}>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {productosFiltrados.slice(0, elementosMostrados).map((producto) => (
                                                    <tr key={producto.codigo}>
                                                        <td>{producto.codigo}</td>
                                                        <td>{producto.lotenumero}</td>
                                                        <td>
                                                            <input
                                                                className='form-control'
                                                                type="number"
                                                                value={cantidades[producto.codigo] || ''}
                                                                onChange={(e) => handleCantidadChange(producto.codigo, Number(e.target.value))}
                                                            />
                                                        </td>
                                                        <td>{producto.descripcion}</td>

                                                        <td>{producto.stock}</td>
                                                        <td>{formatNumberWithSeparators(producto.preciocompra)}</td>
                                                        <td>
                                                            <button className='btn btn-success bi bi-plus-circle-fill' onClick={() => handleSeleccionarProducto(producto)}>Agregar</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button className='btn btn-danger bi bi-x-circle' onClick={handleCerrarModal}>Cerrar</button>
                                </div>
                            </div>
                        )}
                        <button className='btn btn-success bi bi-plus-circle ms-4' type="submit">Crear Compra</button>

                    </form>
                </>
            ) : (
                <h2>No se ha realizado la apertura de caja en la fecha actual. Redirigiendo...</h2>
            )}
        </div>
    );
};

export default CargarCompras;