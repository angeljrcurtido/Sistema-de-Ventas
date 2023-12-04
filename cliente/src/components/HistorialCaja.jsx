import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistorialCaja = () => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/cierres-caja')
      .then(response => setHistorial(response.data))
      .catch(error => console.log(error));
  }, []);

  const formatNumber = (number) => {
    return number.toLocaleString("es-ES", {
      minimumFractionDigits: 0,
      useGrouping: true
    });
  };

  const handleEliminar = (id) => {
    axios.delete(`http://localhost:8000/cierres-caja/${id}`)
      .then(response => {
        console.log(response.data); // Mensaje de éxito o error de eliminación
        setHistorial(historial.filter(item => item._id !== id));
      })
      .catch(error => console.log(error));
  };

  return (
    <div className='cajagrandeventas'>
      <h1 className='productoseleccionado bi bi-shop'><strong>HISTORIAL DE CIERRES DE CAJA</strong></h1>
      <div className='cajagrandeproductosseleccionados'>
        <table className='table table-striped-columns'>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Ingresos</th>
              <th>Gastos</th>
              <th>Saldo</th>
              <th>Dinero en Caja</th>
              <th>Diferencia</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {historial.map(item => (
              <tr key={item._id}>
                <td>{new Date(item.fecha).toLocaleDateString("es-ES")}</td>
                <td>Gs.{formatNumber(item.ingresos)}</td>
                <td>Gs.{formatNumber(item.gastos)}</td>
                <td>Gs.{formatNumber(item.saldo)}</td>
                <td>Gs.{formatNumber(item.dineroEnCaja)}</td>
                <td>Gs.{formatNumber(item.diferencia)}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleEliminar(item._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialCaja;