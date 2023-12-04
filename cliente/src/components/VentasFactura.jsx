import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PDFViewer, PDFDownloadLink, Page, Text, View, Document, StyleSheet, Table, TableHeader, TableCell, TableBody } from '@react-pdf/renderer';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';


const FacturasComponente = () => {
    const [impresion, setImpresion] = useState([]);
    const [facturas, setFacturas] = useState([]);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);


    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Obtener los índices de los elementos a mostrar en la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = facturas.slice(indexOfFirstItem, indexOfLastItem);

    // Cambiar de página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(facturas.length / itemsPerPage);



    useEffect(() => {
        obtenerFacturas();
    }, []);

    const cerrarModal = () => {
        setFacturaSeleccionada(null);
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
        const obtenerUltimoRegistro = async () => {
            try {
                const response = await axios.get('http://localhost:8000/ultimoregistrodatosfactura');
                setImpresion(response.data.impresion);
                console.log(response.data.impresion)
            } catch (error) {
                console.error(error);
            }
        };

        obtenerUltimoRegistro();
    }, []);


    const obtenerFacturas = async () => {
        try {
            const response = await axios.get('http://localhost:8000/todostickets');
            setFacturas(response.data.tickets);
        } catch (error) {
            console.error(error);
        }
    };

    const anularTicket = async (id) => {
        try {
            await axios.put(`http://localhost:8000/tickets/${id}/estado`, {
                estado: 'Anulado',
            });
            obtenerFacturas(); // Actualizar la lista de facturas después de anular el ticket
        } catch (error) {
            console.error(error);
        }
    };

    const obtenerFacturaParaImprimir = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8000/ticketfactura/${id}`);
            setFacturaSeleccionada(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const abrirModalPDF = () => {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
                <div className='modalproductos' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', width: '80%', height: '80%' }}>

                    <h3 className='productos bi bi-pencil-square'>Factura Seleccionada  <button className='btn btn-danger sm cerrarfactura' onClick={cerrarModal}>Cerrar</button></h3>
                    <div className='submodalproductos' style={{ maxHeight: '300px', overflow: 'auto' }}>
                        <div>
                            <PDFViewer style={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', width: '80%', height: '70%' }}>
                                {documentoPDF()}
                            </PDFViewer>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    const documentoPDF = () => (
        <Document>
            <Page size={impresion} style={styles.page}>
                <Text style={styles.page2}>{facturaSeleccionada.empresa}</Text>
                <Text style={styles.page2}>{facturaSeleccionada.negocio}</Text>
                <Text style={styles.page3}>RUC:{facturaSeleccionada.ruc}</Text>
                <Text style={styles.page3}>{facturaSeleccionada.direccion}</Text>

                <Text style={styles.page}>Cliente: {facturaSeleccionada.cliente}</Text>
                <Text style={styles.page}>Ruc: {facturaSeleccionada.ruccliente}</Text>
                <Text style={styles.page}>Factura Numero: {facturaSeleccionada.facturaNumero}</Text>
                <Text style={styles.page}>Valido Desde: {facturaSeleccionada.validoDesde}</Text>
                <Text style={styles.page}>Valido Hasta: {facturaSeleccionada.validoHasta}</Text>
                <Text style={styles.page}>Fecha: {facturaSeleccionada.fechaActual}</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Producto</Text>
                        <Text style={styles.tableCell}>Cantidad</Text>
                        <Text style={styles.tableCell}>Precio</Text>
                    </View>
                    {facturaSeleccionada.producto.map((producto, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCell}>{producto}</Text>
                            <Text style={styles.tableCell}>{facturaSeleccionada.cantidad[index]}</Text>
                            <Text style={styles.tableCell}>{facturaSeleccionada.subtotal[index]}</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.page}>Total Iva: {facturaSeleccionada.TotalIva}</Text>
                <Text style={styles.page}>Total a Pagar: {facturaSeleccionada.totalPagar}</Text>
                <Text style={styles.page}>{facturaSeleccionada.Estado}</Text>
                <Text style={styles.page5}>{facturaSeleccionada.mensaje}</Text>
                <Text style={styles.page5}>{facturaSeleccionada.mensajeDos}</Text>
            </Page>
        </Document>
    );

    return (
        <div className='cajagrandeventas'>
            <h1 className='bi bi-cash-stack ventas'>Facturas</h1>
            <table className='table table-striped-columns'>
                <thead>
                    <tr>
                        <th>Factura</th>
                        <th>Timbrado</th>
                        <th>Empresa</th>
                        <th>Estado</th>
                        <th>RUC</th>
                        <th>Cliente</th>
                        <th>RUC Cliente</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((factura) => (
                        <tr key={factura._id}>
                            <td>{factura.facturaNumero}</td>
                            <td>{factura.timbradoNumero}</td>
                            <td>{factura.empresa}</td>
                            <td>{factura.Estado}</td>
                            <td>{factura.ruc}</td>
                            <td>{factura.cliente}</td>
                            <td>{factura.ruccliente}</td>
                            <td>
                                <button className='btn btn-success' onClick={() => obtenerFacturaParaImprimir(factura._id)}>Re-Imprimir</button>
                                <button className='btn btn-danger' onClick={() => anularTicket(factura._id)}>Anular</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Paginación */}
            <div className='pagination'>
                {currentPage > 1 && (
                    <button
                        className='btn btn-secondary'
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        &#8592;
                    </button>
                )}
                <button className='btn btn-primary' disabled>
                    {currentPage}
                </button>
                {currentPage < totalPages && (
                    <button
                        className='btn btn-secondary'
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        &#8594;
                    </button>
                )}
            </div>

            {facturaSeleccionada && (
                <div>
                    {abrirModalPDF()}
                </div>
            )}
        </div>
    );
};

export default FacturasComponente;