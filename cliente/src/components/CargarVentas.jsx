import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import Modal from 'react-modal';
import autoTable from 'jspdf-autotable'
import { useNavigate } from 'react-router-dom';
import { PDFViewer, PDFDownloadLink, Page, Text, View, Document, StyleSheet, Table, TableHeader, TableCell, TableBody } from '@react-pdf/renderer';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Ticket from './Ticket'; // Importa el componente Ticket.jsx

const CrearVentas = () => {
  const [aperturaCajaRealizada, setAperturaCajaRealizada] = useState(false);
  const [montoCliente, setMontoCliente] = useState(0);
  const [impresion, setImpresion] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [numeroFactura, setNumeroFactura] = useState('');
  const [abrirModalPDF, setAbrirModalPDF] = useState(false);
  const [ultimaVentaRealizada, setUltimaVentaRealizada] = useState([]);
  const [ultimoDatosEmpresa, setUltimoDatosEmpresa] = useState([]);
  const [datosFactura, setDatosFactura] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [clienteMostrado, setClienteMostrado] = useState('');
  const [vendedor, setVendedor] = useState('universal');
  const [descuento, setDescuento] = useState(0)
  const [detalleCompra, setDetalleCompra] = useState(null);
  const [totalDescuentos, setTotalDescuentos] = useState(0);
  const [totalIva, setTotalIva] = useState(0);
  const [facturaNumero, setFacturaNumero] = useState('');
  const [rucclienteMostrado, setRucClienteMostrado] = useState('');
  const [ruccliente, setRucCliente] = useState('');
  const [direccion, setDireccion] = useState('');
  const [condicionVenta, setCondicionVenta] = useState('contado');
  const [productos, setProductos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoComprobante, setTipoComprobante] = useState('ticket');
  const [cantidades, setCantidades] = useState({});
  const [totalVenta, setTotalVenta] = useState(0);
  const [elementosMostrados, setElementosMostrados] = useState(5);
  const [filtroDescripcion, setFiltroDescripcion] = useState('');
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [codigoBarra, setCodigoBarra] = useState('');
  const [ultimaVentaId, setUltimaVentaId] = useState('');

  const navigate = useNavigate()
  const actualizarStock = () => {
    const nuevosProductos = productos.map((producto) => {
      const productoEncontrado = productoSeleccionado.find((p) => p.codigo === producto.codigo);
      if (productoEncontrado) {
        return { ...producto, stock: producto.stock - productoEncontrado.cantidad };
      }
      return producto;
    });
    setProductos(nuevosProductos);
  };
  const formatNumberWithSeparators = (number) => {
    return number.toLocaleString('en-US');
  };


  const styles = StyleSheet.create({
    page: {
      display: "table",
      width: "auto",
      fontSize: '8px',

    },
    page2: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      flexDirection: 'column',
      fontSize: '15px',
      fontFamily: 'Helvetica-Bold',
      fontWeight: 'bold'
    },
    page3: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      flexDirection: 'column',
      fontSize: '10px',
      fontFamily: 'Helvetica-Bold',
      fontWeight: 'bold'
    },
    page4: {
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      width: 50, // Cambia el valor a 80 para una hoja de 80 mm
      height: 50, // Cambia el valor a 80 para una hoja de 80 mm
      padding: 10,
    },
    page5: {
      display: "table",
      width: "auto",
      fontSize: '8px',
      textAlign: 'center'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    table: {
      display: 'table',
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000',
      marginBottom: 10,
    },
    tableRow: {
      margin: 'auto',
      flexDirection: 'row',
    },
    tableCell: {
      margin: 'auto',
      marginVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      textAlign: 'center',
      flexBasis: '33%',
    },

  });

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
    calcularTotalIva();
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
        const { codigo, producto, stock, preciocompra, precioventa, iva10, iva5 } = productoEncontrado;
        const cantidad = 1;
        const precioVenta = cantidad * precioventa;
        const nuevoProducto = { codigo, cantidad, producto, stock, preciocompra, precioVenta, iva10, iva5 };
        setProductoSeleccionado([...productoSeleccionado, nuevoProducto]);
        setCodigoBarra('');
      }
    }
  };

  const handleSeleccionarProducto = (productoSeleccionadoParam) => {
    const { codigo, producto, stock, preciocompra, precioventa, iva10, iva5 } = productoSeleccionadoParam;
    const cantidad = cantidades[codigo];
    const precioVenta = cantidad * precioventa;
    const TotalIva10 = cantidad * iva10;
    const TotalIva5 = cantidad * iva5;
    const nuevoProducto = { codigo, cantidad, producto, stock, preciocompra, precioventa, precioVenta, descuento: 0, iva10, iva5, TotalIva10, TotalIva5 };
    setProductoSeleccionado([...productoSeleccionado, nuevoProducto]);
    console.log(nuevoProducto)
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
    const total = productoSeleccionado.reduce((acumulador, producto) => acumulador + producto.precioVenta, 0);
    setTotalVenta(total);
  };

  const calcularTotalIva = () => {
    const total = productoSeleccionado.reduce((acumulador, producto) => acumulador + producto.TotalIva10 + producto.TotalIva5, 0);
    setTotalIva(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tipoComprobante === 'factura') {
      const confirmacion = window.confirm('¿Deseas generar una Factura?');
      if (confirmacion) {
        try {
          const facturaResponse = await axios.get('http://localhost:8000/facturaumentar2');
          const cajaResponse = await axios.get('http://localhost:8000/ultimoregistrodatosfactura');

          const Caja = cajaResponse.data.numeroCaja;
          const Sucursal = cajaResponse.data.numeroSucursal;
          const facturaNumero1 = facturaResponse.data.facturaNumero;
          const datosconcatenados = `${Sucursal} - ${Caja} - ${facturaNumero1}`;
          console.log(datosconcatenados)
          const response2 = await axios.post('http://localhost:8000/ventas', {
            cliente: clienteMostrado,
            descuento: totalDescuentos,
            ruccliente,
            vendedor,
            facturaNumero: datosconcatenados,
            direccion,
            condicionventa: condicionVenta,
            productos: productoSeleccionado,
            tipodecomprobante: tipoComprobante,
          });
          console.log('Venta con Factura:', response2.data.venta);
          console.log("Ultima Venta" + ultimaVentaRealizada)
          setVendedor('universal');
          setCondicionVenta('');
          setTipoComprobante('ticket')
          setFacturaNumero('');
          setClienteSeleccionado('');
          setDireccion('');
          setRucCliente('');
          setProductoSeleccionado([]);
          setCantidades({});
          setDescuento(0);
          setTotalDescuentos(0);
          actualizarStock();
          setUltimaVentaId(response2.data.ventaId);

          //Crear Ticket Inicia

          //Realizar solicitud get para traer datos de empresa
          try {
            const response = await axios.get('http://localhost:8000/ultimoregistrodatosfactura');
            console.log(response.data);
            setUltimoDatosEmpresa("Este es de otra empresa",response.data);
            setImpresion(response.data.impresion);
          } catch (error) {
            console.error('Error al obtener la última Datos Empresa', error);
          }

          //Realizar solicitud post para crear Factura
          try {

            const iva10Array = Object.values(response2.data.venta.iva10);
            const sumaiva10 = iva10Array.reduce((total, iva) => total + iva, 0);
            console.log(sumaiva10);

            const iva5Array = Object.values(response2.data.venta.iva5);
            const sumaiva5 = iva5Array.reduce((total, iva) => total + iva, 0);
            console.log(sumaiva5);
            const sumatotal = sumaiva10 + sumaiva5;

            const response3 = await axios.post('http://localhost:8000/crear-ticket', {
              numeroInt: response2.data.venta.numeroInterno,
              facturaNumero: response2.data.venta.facturaNumero,
              fechaActual: response2.data.venta.fecha,
              cliente: response2.data.venta.cliente,
              ruccliente: response2.data.venta.ruccliente,
              cantidad: response2.data.venta.cantidad,
              producto: response2.data.venta.descripcion,
              subtotal: response2.data.venta.subtotal,
              iva10: response2.data.venta.iva10,
              iva5: response2.data.venta.iva5,
              totalPagar: response2.data.venta.total,
              descuento: totalDescuentos,
              TotalIva10: sumaiva10,
              TotalIva5: sumaiva5,
              TotalIva: sumatotal,
              empresa: ultimoDatosEmpresa.empresa,
              ruc: ultimoDatosEmpresa.ruc,
              direccion: ultimoDatosEmpresa.direccion,
              negocio: ultimoDatosEmpresa.negocio,
              validoDesde: ultimoDatosEmpresa.validoDesde,
              validoHasta: ultimoDatosEmpresa.validoHasta,
              timbradoNumero: ultimoDatosEmpresa.timbradoNumero
            });
            console.log(response3.data);


          } catch (error) {
            console.error('Error al obtener la última Datos Empresa', error);
          }

        } catch (error) {
          console.error('Error al crear la venta:', error);
        }
      } else {
        alert('Favor corregir el tipo de comprobante');
      }
    } else {
      try {
        const response2 = await axios.post('http://localhost:8000/ventas', {
          cliente: clienteMostrado,
          descuento: totalDescuentos,
          vendedor,
          facturaNumero: '',
          direccion,
          condicionventa: condicionVenta,
          productos: productoSeleccionado,
          tipodecomprobante: tipoComprobante,
        });
        console.log('Venta creada correctamente:', response2.data);
        setVendedor('universal');
        setDireccion('');
        setFacturaNumero('');
        setCondicionVenta('');
        setTipoComprobante('ticket');
        setClienteSeleccionado('');
        setRucCliente('');
        setCondicionVenta('');
        setFacturaNumero('');
        setProductoSeleccionado([]);
        setCantidades({});
        setDescuento(0);
        setTotalDescuentos(0);
        actualizarStock();

        setUltimaVentaId(response2.data.ventaId);

        /*
                if (tipoComprobante === 'factura') {
                  navigate(`/ticket/${response.data.ventaId}`);
                } else if (tipoComprobante === 'ticket') {
                  navigate(`/ticketnormal/${response.data.ventaId}`);
                }*/

                 //Crear Ticket Inicia

          //Realizar solicitud post para crear Factura
          try {
            
          //Realizar solicitud get para traer datos de empresa
       
            const responsedatos = await axios.get('http://localhost:8000/ultimoregistrodatosfactura');
            console.log(responsedatos.data);
            setUltimoDatosEmpresa("Este es de la empresa",  responsedatos.data);
            setImpresion(responsedatos.data.impresion);

          //Fin de solicitud para traer datos de empresa

            const iva10Array = Object.values(response2.data.venta.iva10);
            const sumaiva10 = iva10Array.reduce((total, iva) => total + iva, 0);
            console.log(sumaiva10);

            const iva5Array = Object.values(response2.data.venta.iva5);
            const sumaiva5 = iva5Array.reduce((total, iva) => total + iva, 0);
            console.log(sumaiva5);
            const sumatotal = sumaiva10 + sumaiva5;

            const response3 = await axios.post('http://localhost:8000/crear-ticketnormal', {
              numeroInt: response2.data.venta.numeroInterno,
              fechaActual: response2.data.venta.fecha,
              cliente: response2.data.venta.cliente,
              cantidad: response2.data.venta.cantidad,
              producto: response2.data.venta.descripcion,
              subtotal: response2.data.venta.subtotal,
              totalPagar: response2.data.venta.total,
              TotalIva: sumatotal,
              empresa: ultimoDatosEmpresa.empresa,
              descuento: totalDescuentos,
              ruc: ultimoDatosEmpresa.ruc,
              direccion: ultimoDatosEmpresa.direccion,
              negocio: ultimoDatosEmpresa.negocio,
              timbradoNumero: ultimoDatosEmpresa.timbradoNumero

      
            });
            console.log(response3.data);
          


          } catch (error) {
            console.error('Error al obtener la última Datos Empresa2', error);
          }
      } catch (error) {
        console.error('Error al crear la venta:', error);
      }
    }

    setAbrirModalPDF(false)
    setModalIsOpen(false);
    setNumeroFactura('')



  };

  const handleCerrarModal = () => {
    setModalVisible(false);
  };

  const handleAbrirModalCalcu = () => {
    setModalIsOpen(true);
  };

  const handleCerrarModalCalcu = () => {
    setModalIsOpen(false);
  };

  const handleAbrirModalPDF = async () => {
    setAbrirModalPDF(true);
    if (tipoComprobante === 'factura') {
      try {
        // Tu código actual para facturas
        const responsedatos = await axios.get('http://localhost:8000/ultimoregistrodatosfactura');
        const responsedatosfactura = await axios.get('http://localhost:8000/ultimoregistrofactura');
        setDatosFactura(responsedatos.data);
        const facturaNumero = responsedatosfactura.data.facturaNumero;
        const nuevoNumeroFactura = String(parseInt(facturaNumero) + 1).padStart(facturaNumero.length, '0');
        setNumeroFactura(nuevoNumeroFactura);
        console.log("Este es", nuevoNumeroFactura);
      } catch (error) {
        console.error('Error al crear la venta:', error);
      }
    } else if (tipoComprobante === 'ticket') {
      try {
        // Tu código actual para facturas
        const responsedatos = await axios.get('http://localhost:8000/ultimoregistrodatosfactura');
        setDatosFactura(responsedatos.data);
      } catch (error) {
        console.error('Error al crear la venta:', error);
      }
    }
  }
  

  const fechaActual2 = new Date();
  const fechaFormateada2 = fechaActual2.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });


  const documentoPDF = () => (
    <Document>
      <Page size={datosFactura.impresion} style={styles.page}>
        <Text style={styles.page2}>{datosFactura.empresa}</Text>
        <Text style={styles.page2}>{datosFactura.negocio}</Text>
        <Text style={styles.page3}>RUC:{datosFactura.ruc}</Text>
        <Text style={styles.page3}>{datosFactura.direccion}</Text>

        <Text style={styles.page}>Cliente: {clienteMostrado}</Text>
        <Text style={styles.page}>Ruc: {ruccliente}</Text>
        <Text style={styles.page}>Factura Numero: {numeroFactura}</Text>
        <Text style={styles.page}>Valido Desde: {datosFactura.validoDesde}</Text>
        <Text style={styles.page}>Valido Hasta: {datosFactura.validoHasta}</Text>
        <Text style={styles.page}>Fecha: {fechaFormateada2}</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Producto</Text>
            <Text style={styles.tableCell}>Cantidad</Text>
            <Text style={styles.tableCell}>Precio</Text>
          </View>
          {productoSeleccionado.map((producto) => (
            <View style={styles.tableRow} key={producto.codigo}>
              <Text style={styles.tableCell}>{producto.producto}</Text>
              <Text style={styles.tableCell}>{producto.cantidad}</Text>
              <Text style={styles.tableCell}>{producto.precioVenta}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.page}>Total Iva: {totalIva.toFixed(2)}Gs.</Text>
        <Text style={styles.page}>Total Descuentos: {formatNumberWithSeparators(totalDescuentos)}Gs.</Text>
        <Text style={styles.page}>Total a Pagar: {formatNumberWithSeparators(totalVenta - totalDescuentos)}Gs.</Text>

        <Text style={styles.page}>{datosFactura.Estado}</Text>
        <Text style={styles.page5}>¡Gracias, vuelva pronto!</Text>
        <Text style={styles.page5}>VERIFIQUE SU VUELTO NO SE ACEPTAN DEVOLUCIONES NI RECLAMOS POSTERIORES</Text>
      </Page>
    </Document>
  );


  const handleDescuentoChange = (codigo, descuento) => {
    const nuevosProductos = productoSeleccionado.map((producto) => {
      if (producto.codigo === codigo) {
        return { ...producto, descuento: Number(descuento) };
      }
      return producto;
    });
    setProductoSeleccionado(nuevosProductos);
    const total = nuevosProductos.reduce((acumulador, producto) => acumulador + producto.descuento, 0);
    setTotalDescuentos(total);
  };


  const productosFiltrados = productos.filter(producto => producto.producto.toLowerCase().includes(filtroDescripcion.toLowerCase()) && producto.codigo.toLowerCase().includes(filtroCodigo.toLowerCase()));

  useEffect(() => {
    verificarAperturaCaja();
    obtenerClientes();
  }, []);

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

  const obtenerClientes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSeleccionarCliente = async (clienteId) => {
    try {
      const response = await axios.get(`http://localhost:8000/clientes/${clienteId}`);
      const cliente = response.data;
      setClienteSeleccionado(cliente.nombre);
      setClienteMostrado(cliente.nombre);
      setDireccion(cliente.direccion);
      setRucCliente(cliente.ruc);
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className='cajagrandeventas'>
      {aperturaCajaRealizada ? (
        <>
          <h2 className='bi bi-cash-stack ventas'>Crear Venta</h2>
          <form onSubmit={handleSubmit}>
            <div className='CajaGrande'>
              <div className='subcajacliente input-group' style={{ gridColumnStart: '1', gridColumnEnd: '2' }}>
                <label>Cliente:</label>
                <select
                  className='form-control ms-2'
                  value={clienteSeleccionado}
                  onChange={(e) => {
                    const clienteId = e.target.value;
                    const cliente = clientes.find((cliente) => cliente._id === clienteId);
                    setClienteSeleccionado(clienteId);
                    setClienteMostrado(cliente ? cliente.nombre : '');
                    setDireccion(cliente ? cliente.direccion : '');
                    setRucCliente(cliente ? cliente.ruc : '');
                  }}
                >
                  <option value=''>Seleccionar cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente._id} value={cliente._id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className='subcajacliente input-group' style={{ gridColumnStart: '2', gridColumnEnd: '3' }}>
                <label>Vendedor:</label>
                <input className='form-control ms-2' type="text" value={vendedor} onChange={(e) => setVendedor(e.target.value)} />
              </div>
              <div className='subcajacliente input-group' style={{ gridColumnStart: '1', gridColumnEnd: '2' }}>
                <label>Dirección:</label>
                <input className='form-control ms-2' type='text' value={direccion} onChange={(e) => setDireccion(e.target.value)} />
              </div>
              <div className='subcajacliente input-group' style={{ gridColumnStart: '1', gridColumnEnd: '2' }}>
                <label>Ruc Cliente:</label>
                <input className='form-control ms-2' type='text' value={ruccliente} onChange={(e) => setRucCliente(e.target.value)} />
              </div>
              <div className='subcajacliente input-group' style={{ gridColumnStart: '2', gridColumnEnd: '3' }}>
                <label>Condición de Venta:</label>
                <select className='form-control ms-2' value={condicionVenta} onChange={(e) => setCondicionVenta(e.target.value)}>
                  <option value="contado">Contado</option>
                  <option value="credito">Crédito</option>
                </select>
              </div>
              <div className='subcajacliente input-group' style={{ gridColumnStart: '2', gridColumnEnd: '3' }}>
                <label>Tipo de Comprobante:</label>
                <select className='form-control ms-2' value={tipoComprobante} onChange={(e) => setTipoComprobante(e.target.value)}>
                  <option value="factura" defaultValue>Factura</option>
                  <option value="ticket">Ticket</option>
                </select>
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
                        <th>Precio de Venta</th>
                        <th>Iva 10%</th>
                        <th>Iva 5%</th>
                        <th>Descuentos</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productoSeleccionado.map((producto) => (
                        <tr key={producto.codigo}>
                          <td>{producto.codigo}</td>
                          <td>{producto.cantidad}</td>
                          <td>{producto.producto}</td>
                          <td>{producto.stock}</td>
                          <td>{(producto.precioVenta) / (producto.cantidad)}Gs.</td>
                          <td>{formatNumberWithSeparators(producto.precioVenta)}Gs.</td> {/* Corregido: utiliza precioVenta en lugar de preciocompra */}
                          <td>{producto.TotalIva10}</td>
                          <td>{producto.TotalIva5}</td>
                          <td>
                            <input
                              type="text"
                              value={producto.descuento ? producto.descuento : 0}
                              onChange={(e) => handleDescuentoChange(producto.codigo, Number(e.target.value))}
                            />
                          </td>
                          <td>
                            <button className='btn btn-danger bi bi-x-circle' type="button" onClick={() => handleEliminarProducto(producto.codigo)}>Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="5">Total</td>
                        <td>{(totalVenta) - (totalDescuentos)}Gs.</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="7">Total Descuentos:</td>
                        <td>{formatNumberWithSeparators(totalDescuentos)}Gs.</td>
                      </tr>
                      <tr>
                        <td colSpan="5">Total Iva:</td>
                        <td>{totalIva.toFixed(2)}Gs.</td>

                      </tr>

                    </tfoot>
                  </table>
                </div>

                {modalIsOpen && (
                  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
                    <div className='modalproductos' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', width: '40%', height: '50%' }}>
                      <h3 className='productos bi bi-pencil-square factura'>Calculadora   <button type='button' onClick={handleCerrarModalCalcu} className='btn btn-danger sm cerrarcalculadora'>Cerrar</button></h3>
                      <table>
                        <thead>
                          <tr>
                            <th colSpan="5">Costo Compra:</th>
                            <th>{formatNumberWithSeparators(totalVenta - totalDescuentos)}Gs.</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan="5"><strong>Importe Recibido:</strong></td>
                            <td>
                              <input
                                className='form-control'
                                type="number"
                                value={montoCliente.toLocaleString('es')}
                                onChange={(e) => setMontoCliente(Number(e.target.value.replace(/[^0-9]/g, '')))}
                              />
                            </td>
                          </tr>
                          <tr>
                            <th colSpan="5">Vuelto:</th>
                            <th style={{ color: (montoCliente - (totalVenta - totalDescuentos)) < 0 ? 'red' : 'green' }}>
                              {formatNumberWithSeparators(montoCliente - (totalVenta - totalDescuentos))}Gs.
                            </th>
                          </tr>

                        </tbody>
                      </table>


                      <button className='btn btn-success bi bi-plus-circle calculadora' type="button" onClick={handleAbrirModalPDF}>Imprimir</button>
                    </div>
                  </div>
                )}

                <button className='btn btn-primary' type="button" onClick={handleAbrirModalCalcu}>Detalles</button>

              </div>
            )}

            {abrirModalPDF && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
                <div className='modalproductos' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', width: '80%', height: '80%' }}>

                  <h3 className='productos bi bi-pencil-square factura'>Factura Seleccionada  <button type='submit' className='btn btn-danger sm cerrarfactura' onClick={handleSubmit}>Cerrar</button></h3>
                  <div className='submodalproductos' style={{ maxHeight: '500px', overflow: 'auto' }}>
                    <div>
                      <PDFViewer style={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', width: '80%', height: '70%' }}>
                        {documentoPDF()}
                      </PDFViewer>
                    </div>
                  </div>
                </div>
              </div>
            )};

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
                            <td>
                              <input
                                className='form-control'
                                type="text"
                                value={cantidades[producto.codigo] || ''}
                                onChange={(e) => handleCantidadChange(producto.codigo, e.target.value)}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Permite solo números y puntos
                                }}
                              />
                            </td>
                            <td>{producto.producto}</td>
                            <td>{producto.stock}</td>
                            <td>{producto.precioventa ? formatNumberWithSeparators(producto.precioventa) : ''}</td>
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
            <button className='btn btn-success bi bi-plus-circle ms-4' type="submit">Crear Venta</button>

          </form>


        </>
      ) : (
        <h2>No se ha realizado la apertura de caja en la fecha actual. Redirigiendo...</h2>
      )}
    </div>
  );
};

export default CrearVentas;