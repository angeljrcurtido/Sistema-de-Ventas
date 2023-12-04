import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import { format } from 'date-fns';

const CierredeCaja = () => {
  const [compras, setCompras] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [ingresos, setIngresos] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [saldo, setSaldo] = useState(0);

  const [dineroEnCaja, setDineroEnCaja] = useState(0);
  const [diferencia, setDiferencia] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoIngreso, setNuevoIngreso] = useState('');
  const [nuevoDineroEnCaja, setNuevoDineroEnCaja] = useState('');
  const [modalDineroEnCajaOpen, setModalDineroEnCajaOpen] = useState(false);
  const [nuevoEgreso, setNuevoEgreso] = useState('');
  const [modalEgresosOpen, setModalEgresosOpen] = useState(false);

  const fechaActual2 = format(new Date(), 'yyyy-MM-dd');
  const fechaActual = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-');

  useEffect(() => {
    const obtenerVentasTotales = async () => {
      try {
        const response = await axios.get('http://localhost:8000/todasventas');
        const ventasFechaActual = response.data.filter(venta => venta.fecha === fechaActual);
        setVentas(ventasFechaActual);

        const totalVentasFechaActual = ventasFechaActual.reduce((total, venta) => total + venta.total, 0);
        setIngresos(totalVentasFechaActual);
      } catch (error) {
        console.error('Error al obtener las ventas:', error);
      }
    };
    obtenerVentasTotales();
  }, []);

  useEffect(() => {
    const obtenerComprasFechas = async () => {
      try {
        const response = await axios.get('http://localhost:8000/comprasfechas');
        const comprasFechaActual = response.data.filter(compra => compra.fechaCompra === fechaActual2);
        setCompras(comprasFechaActual);
        const totalComprasFechaActual = comprasFechaActual.reduce((total, compra) => total + compra.precioTotalCompra, 0);
        setGastos(totalComprasFechaActual);
        console.log(compras)
      } catch (error) {
        console.error('Error al obtener las compras:', error);
      }
    };
    obtenerComprasFechas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/cierres-caja', {
        ingresos,
        gastos,
        saldo,
        dineroEnCaja,
        diferencia,
      });
      console.log('Cierre de caja creado correctamente:', response.data);
      // Restablecer los campos del formulario
      setIngresos(0);
      setGastos(0);
      setSaldo(0);
      setDineroEnCaja(0);
      setDiferencia(0);
    } catch (error) {
      console.error('Error al crear el cierre de caja:', error);
    }
  };

  const handleModalDineroEnCajaOpen = () => {
    setModalDineroEnCajaOpen(true);
  };

  const handleModalDineroEnCajaClose = () => {
    setModalDineroEnCajaOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalEgresosOpen = () => {
    setModalEgresosOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalEgresosClose = () => {
    setModalEgresosOpen(false);
  };

  const calcularDiferencia = () => {
    const nuevaDiferencia = dineroEnCaja - saldo;
    setDiferencia(nuevaDiferencia)
  };

  const calcularSaldo = () => {
    const nuevoSaldo = ingresos - gastos;
    setSaldo(nuevoSaldo);
  };

  useEffect(() => {
    calcularDiferencia();
  }, [dineroEnCaja, saldo]);

  useEffect(() => {
    calcularSaldo();
  }, [ingresos, gastos]);

  const handleNuevoIngresoChange = (e) => {
    setNuevoIngreso(Number(e.target.value));
  };

  const handleNuevoEgresoChange = (e) => {
    setNuevoEgreso(Number(e.target.value));
  };

  const handleNuevoDineroEnCajaChange = (e) => {
    setNuevoDineroEnCaja(Number(e.target.value));
  };

  const handleAgregarIngreso = () => {
    setIngresos(ingresos + nuevoIngreso);
    setNuevoIngreso(0);
    setModalOpen(false);
  };

  const handleAgregarEgreso = () => {
    setGastos(gastos + nuevoEgreso);
    setNuevoEgreso(0);
    setModalEgresosOpen(false);
  };

  const handleAgregarDineroEnCaja = () => {
    setDineroEnCaja(dineroEnCaja + nuevoDineroEnCaja);
    setNuevoDineroEnCaja(0);
    setModalDineroEnCajaOpen(false);
  };
  return (
    <div>

      <form className="form-container cargarproducto" onSubmit={handleSubmit}>
        <h2 className=" bi bi-plus-circle-dotted titulodecarga">Cierre de Caja</h2>
        <div className='CajaGrande'>
          <div className='subcajacliente input-group' style={{ gridColumnStart: '1', gridColumnEnd: '2' }}>
            <label className="form-label ms-2">Ingresos:</label>
            <input className="form-control" type="number" value={ingresos} onChange={(e) => setIngresos(Number(e.target.value))} />
            <button className='btn btn-success me-3' type="button" onClick={handleModalOpen}>Agregar más ingresos</button>
          </div>
          <div className='subcajacliente input-group' style={{ gridColumnStart: '2', gridColumnEnd: '3' }}>
            <label className="form-label">Gastos:</label>
            <input className="form-control" type="number" value={gastos} onChange={(e) => setGastos(Number(e.target.value))} />
            <button className='btn btn-success me-3' type="button" onClick={handleModalEgresosOpen}>Agregar más egresos</button>
          </div>
          <div className='subcajacliente input-group' style={{ gridColumnStart: '1', gridColumnEnd: '2' }}>
            <label className="form-label ms-2">Saldo:</label>
            <input className="form-control" type="number" value={saldo} onChange={(e) => setSaldo(Number(e.target.value))} />
          </div>
          <div className='subcajacliente input-group' style={{ gridColumnStart: '2', gridColumnEnd: '3' }}>
            <label className="form-label">Dinero en Caja:</label>
            <input className="form-control" type="number" value={dineroEnCaja} onChange={(e) => setDineroEnCaja(Number(e.target.value))} />
            <button className='btn btn-success me-3' type="button" onClick={handleModalDineroEnCajaOpen}>Agregar más dinero en caja</button>
          </div>
          <div className='subcajacliente input-group' style={{ gridColumnStart: '2', gridColumnEnd: '3' }}>
            <label className="form-label">Diferencia:</label>
            <input className="form-control" type="number" value={diferencia}/>
            <button className='btn btn-success me-3' type="submit">Crear Cierre de Caja</button>
          </div>
        </div>
      </form>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
        <div>
          <h3 className=" bi bi-plus-circle-dotted titulodecarga" style={{ textAlign: 'center' }}>Ventas del Día</h3>
          <table className='table table-success table-striped-columns' style={{ marginLeft: '9%' }}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map(venta => (
                <tr key={venta._id}>
                  <td>{venta.fecha}</td>
                  <td>{venta.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ paddingRight: '13%' }}>
          <h3 className=" bi bi-plus-circle-dotted titulodecarga" style={{ textAlign: 'center' }}>Compras del Día</h3>
          <table className='table table-success table-striped-columns' style={{ marginLeft: '9%' }}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {compras.map(compra => (
                <tr key={compra._id}>
                  <td>{compra.fechaCompra.split('-').reverse().join('-')}</td>
                  <td>{compra.precioTotalCompra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
          <div className='modalproductos' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', width: '36%' }}>
            <h3 className='productos bi bi-pencil-square'>Agregar más ingresos</h3>
            <input className='form-control-sm' type="text" value={nuevoIngreso} onChange={handleNuevoIngresoChange} />
            <button className='btn btn-success sm' type="button" onClick={handleAgregarIngreso}>Agregar</button>
            <button className='btn btn-danger sm' type="button" onClick={handleModalClose}>Cerrar</button>
          </div>
        </div>
      )}
      {modalEgresosOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
          <div className='modalproductos' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', width: '36%' }}>
            <h3 className='productos bi bi-pencil-square'>Agregar más egresos</h3>
            <input className='form-control-sm' type="text" value={nuevoEgreso} onChange={handleNuevoEgresoChange} />
            <button className='btn btn-success sm' type="button" onClick={handleAgregarEgreso}>Agregar</button>
            <button className='btn btn-danger sm' type="button" onClick={handleModalEgresosClose}>Cerrar</button>
          </div>
        </div>
      )}
      {modalDineroEnCajaOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
          <div className='modalproductos' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', width: '36%' }}>
            <h3 className='productos bi bi-pencil-square'>Agregar más dinero en caja</h3>
            <input className='form-control-sm' type="text" value={nuevoDineroEnCaja} onChange={handleNuevoDineroEnCajaChange} />
            <button className='btn btn-success sm' type="button" onClick={handleAgregarDineroEnCaja}>Agregar</button>
            <button className='btn btn-danger sm' type="button" onClick={handleModalDineroEnCajaClose}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CierredeCaja;