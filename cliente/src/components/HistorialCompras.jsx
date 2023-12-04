import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

import Modal from 'react-modal';
import axios from 'axios';
import './style.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const HistorialCompras = () => {
  const [compras, setCompras] = useState([]);
  const [busquedaProveedor, setBusquedaProveedor] = useState('');
  const [fechaInicial, setFechaInicial] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [detalleCompra, setDetalleCompra] = useState(null);


  useEffect(() => {
    axios.get('http://localhost:8000/compras')
      .then(response => {
        setCompras(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const exportarTabla = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Historial de Compras');
    worksheet.addRow(['Historial de Compras en Excel']);
    worksheet.addRow(['Fecha', 'Proveedor', 'RUC', 'Dirección', 'Precio Total Compra']);
    compras.forEach((compra) => {
      worksheet.addRow([
        compra.fechaCompra,
        compra.proveedor,
        compra.ruc,
        compra.direccionProveedor,
        compra.precioTotalCompra
      ]);
    });
    worksheet.mergeCells('A1:E1');
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'HistorialCompras.xlsx');
    });
  };

  const filtrarPorProveedor = (compra) => {
    if (busquedaProveedor === '') {
      return true;
    }
    return compra.proveedor.toLowerCase().includes(busquedaProveedor.toLowerCase());
  };



  const filtrarPorFecha = (compra) => {
    if (!fechaInicial || !fechaFinal) {
      return true;
    }
    const fechaCompra = compra.fechaCompra;
    console.log("Fechacompra" + fechaCompra)

    const fechaInicialComparar = new Date(fechaInicial);
    fechaInicialComparar.setDate(fechaInicialComparar.getDate() + 1)
    const fechaInicialFormateada = format(fechaInicialComparar, 'yyyy-MM-dd')
    console.log("FechaInicial" + fechaInicialFormateada)

    const fechaFinalComparar = new Date(fechaFinal);
    fechaFinalComparar.setDate(fechaFinalComparar.getDate() + 1)
    const fechaFinalFormateada = format(fechaFinalComparar, 'yyyy-MM-dd')
    console.log("FechaFinal" + fechaFinalFormateada)

    return fechaCompra >= fechaInicialFormateada && fechaCompra <= fechaFinalFormateada;
  };
  const eliminarCompra = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/compras/${id}`);
      alert('Compra eliminada correctamente');
      setCompras(compras.filter(compra => compra._id !== id));
    } catch (error) {
      console.error('Error al eliminar la compra:', error);
    }
  };

  const mostrarDetalles = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/compras/${id}`);
      setDetalleCompra(response.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error al obtener los detalles de la compra:', error);
    }
  };
  const comprasFiltradas = compras.filter(compra => filtrarPorProveedor(compra) && filtrarPorFecha(compra));

  return (
    <div className='cajagrandehistorial'>
      <h1 className='titulolibrosalquilados bi bi-clock-history'>Historial de Compras</h1>
      <div className='historialcompras'>
        <input
          className='form-control-sm'
          type="text"
          placeholder="Buscar por proveedor"
          value={busquedaProveedor}
          onChange={(e) => setBusquedaProveedor(e.target.value)}
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
        <button className='btn btn-success btn-sm' onClick={exportarTabla}>Exportar a Excel</button>
      </div>
      <div className="tabla-scroll tablalibrosprestados">
        <table className='table table-striped-columns'>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>N° Factura</th>
              <th>RUC</th>
              <th>Dirección</th>
              <th>Precio Total Compra</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {comprasFiltradas.map((compra, index) => (
              <tr key={index}>
                <td>{compra.fechaCompra}</td>
                <td>{compra.proveedor}</td>
                <td>{compra.facturaNumero}</td>
                <td>{compra.ruc}</td>
                <td>{compra.direccionProveedor}</td>
                <td>{compra.precioTotalCompra}</td>
                <td>
                  <button className='btn btn-danger' onClick={() => eliminarCompra(compra._id)}>Eliminar</button>
                  <button className='btn btn-primary' onClick={() => mostrarDetalles(compra._id)}>Detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal para mostrar los detalles de la compra */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        {detalleCompra && (
          <div className="CajaModalDetalles">
            <h2><strong>DETALLES DE LA COMPRA</strong></h2>
            <div className='SubCajaModalDetalles'>
            <p><strong>Proveedor:</strong> {detalleCompra.proveedor}</p>
            <p><strong>RUC:</strong> {detalleCompra.ruc}</p>
            <p><strong>Dirección del proveedor:</strong> {detalleCompra.direccionProveedor}</p>
            <p><strong>Fecha de compra:</strong> {detalleCompra.fechaCompra}</p>
            <p><strong>Productos:</strong></p>
            </div>
            <table className='table table-striped-columns'>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Cantidad</th>
                  <th>Precio de compra</th>
                </tr>
              </thead>
              <tbody>
                {detalleCompra.productos.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto.codigo}</td>
                    <td>{producto.cantidad}</td>
                    <td>{producto.precioCompra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p><strong>Precio total de la compra:</strong> {detalleCompra.precioTotalCompra}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HistorialCompras;