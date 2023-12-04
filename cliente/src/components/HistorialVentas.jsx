import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import axios from 'axios';
import './style.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const HistorialVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [tipoComprobante, setTipoComprobante] = useState('');
    const [busquedaCliente, setBusquedaCliente] = useState('');
    const [fechaInicial, setFechaInicial] = useState('');
    const [fechaFinal, setFechaFinal] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false); // Estado para controlar la visibilidad del modal
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/todasventas')
            .then(response => {
                setVentas(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const imprimirTicket = (ventaId, tipoComprobante) => {
        if (tipoComprobante === 'factura') {
            navigate(`/tickethistorial/${ventaId}`);
        } else if (tipoComprobante === 'ticket') {
            navigate(`/ticketnormalhistorial/${ventaId}`);
        }
    };



    const exportarTabla = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Historial de Ventas');
      
        // Agrega el título
        worksheet.addRow(['Historial de Ventas en Excel']);
      
        // Agrega los encabezados de las columnas
        worksheet.addRow(['N°', 'Fecha', 'Cliente', 'Total a Pagar', 'Total Gastos', 'Ganancias']);
      
        // Agrega los datos de las filas
        ventasFiltradas.forEach((venta) => {
          const totalGastos = venta.totalgastos || 0; // Si no hay valor en totalgastos, se asigna el valor 0
          worksheet.addRow([
            venta.numeroInterno,
            venta.fecha.split('-').reverse().join('-'),
            venta.cliente,
            venta.total,
            totalGastos,
            venta.total - totalGastos // Calcula la ganancia restando el total de gastos del total a pagar
          ]);
        });
      
        // Agrega la fila de totales
        worksheet.addRow(['', '', '', '', '', '']); // Fila vacía para separar los datos de las totales
        const totalAPagar = ventasFiltradas.reduce((acumulador, venta) => acumulador + venta.total, 0);
        const totalGastos = ventasFiltradas.reduce((acumulador, venta) => acumulador + (venta.totalgastos || 0), 0); // Suma los valores de totalgastos o 0 si no hay valor
        const ganancias = totalAPagar - totalGastos;
        worksheet.addRow(['', '', '', totalAPagar, totalGastos, ganancias]);
      
        // Estilo para la fila de título y totales
        const titleRow = worksheet.getRow(1);
        titleRow.font = { bold: true, size: 16 };
        const totalRow = worksheet.lastRow;
        totalRow.font = { bold: true };
      
        // Fusiona las celdas del título
        worksheet.mergeCells('A1:F1');
      
        // Guarda el archivo Excel
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(blob, 'HistorialVentas.xlsx');
        });
      };


      

    const filtrarPorCliente = (venta) => {
        if (busquedaCliente === '') {
            return true;
        }
        return venta.cliente.toLowerCase().includes(busquedaCliente.toLowerCase());
    };

    const filtrarPorFecha = (venta) => {
        if (!fechaInicial || !fechaFinal) {
            return true;
        }
        const fechaVenta = venta.fecha;
        const fechaInicialComparar = fechaInicial.split('-').reverse().join('-');
        console.log(fechaInicial)
        const fechaFinalComparar = fechaFinal.split('-').reverse().join('-');
        console.log(fechaFinal)
        return fechaVenta >= fechaInicialComparar && fechaVenta <= fechaFinalComparar;
    };

    const ventasFiltradas = ventas.filter(venta => filtrarPorCliente(venta) && filtrarPorFecha(venta));

    const calcularGanancias = () => {
        const totalAPagar = ventasFiltradas.reduce((acumulador, venta) => {
            if (venta.total) {
                return acumulador + venta.total;
            } else {
                return acumulador;
            }
        }, 0);
        const totalGastos = ventasFiltradas.reduce((acumulador, venta) => {
            if (venta.totalgastos) {
                return acumulador + venta.totalgastos;
            } else {
                return acumulador;
            }
        }, 0);
        return totalAPagar - totalGastos;
    };

    const handleMostrarGanancias = () => {
        setMostrarModal(true);
    };

    const handleCerrarModal = () => {
        setMostrarModal(false);
    };

    const anularVenta = (idVenta) => {
        axios.post(`http://localhost:8000/ventas/anular/${idVenta}`)
          .then(response => {
            // Manejar la respuesta después de anular la venta (por ejemplo, mostrar una notificación)
            alert("Anulación exitosa")
            console.log(response.data);
            setVentas(ventas.filter(venta => venta._id !== idVenta));
          })
          .catch(error => {
            // Manejar el error en caso de que ocurra algún problema durante la anulación de la venta
            console.log(error);
          });
      };
    

    return (
        <div className='cajagrandehistorial'>
            <h1 className='titulolibrosalquilados bi bi-clock-history'>Historial de Ventas</h1>
            <div className='historialventas'>
                <input
                    className='form-control-sm'
                    type="text"
                    placeholder="Buscar por cliente"
                    value={busquedaCliente}
                    onChange={(e) => setBusquedaCliente(e.target.value)}
                />
                <input
                    className='form-control-sm'
                    type="date"
                    placeholder="Fecha inicial"
                    value={fechaInicial}
                    onChange={(e) => setFechaInicial(e.target.value)}
                />
                <input
                    className='form-control-sm'
                    type="date"
                    placeholder="Fecha final"
                    value={fechaFinal}
                    onChange={(e) => setFechaFinal(e.target.value)}
                />
                <button className='btn btn-success btn-sm' onClick={handleMostrarGanancias}>Mostrar Ganancias</button>
                <button className='btn btn-success btn-sm' onClick={exportarTabla}>Exportar a Excel</button>
            </div>
            <div className="tabla-scroll tablalibrosprestados">
                <table className='table table-striped-columns'>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Total a Pagar</th>
                            <th>Total Gastos</th>
                            <th>Total IVA 10%</th>
                            <th>Tipo de Comprobantes</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventasFiltradas.map((venta, index) => (
                            <tr key={venta.numeroInterno}>
                                <td>{venta.numeroInterno}</td>
                                <td>{venta.fecha}</td>
                                <td>{venta.cliente}</td>
                                <td>{venta.total}</td>
                                <td>{venta.totalgastos}</td>
                                <td>{venta.iva10}</td>
                                <td>{venta.tipodecomprobante}</td>
                                <td>
                                    <button className='btn btn-success' onClick={() => imprimirTicket(venta._id, venta.tipodecomprobante)}>Imprimir Comprobante</button>
                                    <button className='btn btn-danger' onClick={() => anularVenta(venta._id)}>Anular Venta</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3"></td>
                            <td>Total a Pagar</td>
                            <td>Total Gastos</td>
                            <td>Ganancias</td>
                            <td colSpan="2"></td>
                        </tr>
                        <tr>
                            <td colSpan="3"></td>
                            <td>{ventasFiltradas.reduce((acumulador, venta) => {
                                if (venta.total) {
                                    return acumulador + venta.total;
                                } else {
                                    return acumulador;
                                }
                            }, 0)}</td>
                            <td>{ventasFiltradas.reduce((acumulador, venta) => {
                                if (venta.totalgastos) {
                                    return acumulador + venta.totalgastos;
                                } else {
                                    return acumulador;
                                }
                            }, 0)}</td>
                            <td>Gs.{calcularGanancias().toLocaleString()}</td>
                            <td colSpan="2">

                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            {mostrarModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Ganancias</h5>
                                <button type="button" className="btn btn-success close" onClick={handleCerrarModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Las ganancias totales son: Gs. {calcularGanancias().toLocaleString()}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={handleCerrarModal}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistorialVentas;