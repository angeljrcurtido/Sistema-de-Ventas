import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './style.css';
import Chart from 'chart.js/auto';

const GraficoEstadistico = () => {
  const [datosVentas, setDatosVentas] = useState([]);
  const [datosCompras, setDatosCompras] = useState([]);
  const [datosGanancias, setDatosGanancias] = useState([]);
  const [totalventasdelmes, setTotalVentasdelMes] = useState('')
  const chartVentasRef = useRef(null); // Referencia al gráfico de ventas
  const chartComprasRef = useRef(null); // Referencia al gráfico de compras
  const chartGananciasRef = useRef(null); // Referencia al gráfico de ganancias por mes

  useEffect(() => {
    const obtenerDatosVentas = async () => {
      try {
        const respuesta = await axios.get('http://localhost:8000/ventasporfecha');
        setDatosVentas(respuesta.data);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerDatosVentas();
  }, []);

  useEffect(() => {
    const obtenerDatosVentasTotal = async () => {
      try {
        const respuesta = await axios.get('http://localhost:8000/ventastotalesdelmes');
        setTotalVentasdelMes(respuesta.data);
        console.log(respuesta.data)
      } catch (error) {
        console.log(error);
      }
    };
    obtenerDatosVentasTotal();
  }, []);

  useEffect(() => {
    const obtenerDatosCompras = async () => {
      try {
        const respuesta = await axios.get('http://localhost:8000/compraspormesfechas');
        setDatosCompras(respuesta.data);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerDatosCompras();
  }, []);

  useEffect(() => {
    const obtenerDatosGanancias = async () => {
      try {
        const respuesta = await axios.get('http://localhost:8000/ventastotalporfecha');
        setDatosGanancias(respuesta.data);
        console.log(respuesta.data)
      } catch (error) {
        console.log(error);
      }
    };
    obtenerDatosGanancias();
  }, []);

  useEffect(() => {
    const generarGraficoVentas = () => {
      // Obtener los meses y las ventas como arreglos separados
      const meses = datosVentas.map((dato) => obtenerNombreMes(dato.mes));
      const ventas = datosVentas.map((dato) => dato.ventas);
      // Destruir el gráfico existente de ventas si existe
      if (chartVentasRef.current) {
        chartVentasRef.current.destroy();
      }
      // Generar un arreglo de colores para ventas
      const coloresVentas = generarColores(ventas.length);
      // Crear el gráfico de barras de ventas
      const ctxVentas = document.getElementById('graficoVentas').getContext('2d');
      chartVentasRef.current = new Chart(ctxVentas, {
        type: 'bar',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Ventas',
              data: ventas,
              backgroundColor: coloresVentas, // Asignar los colores a las barras de ventas
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Ventas',
              },
            },
          },
          plugins: {
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
            },
            legend: {
              labels: {
                font: {
                  size: 20, // Ajusta el tamaño de fuente de las etiquetas del gráfico
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  font: {
                    size: 15, // Ajusta el tamaño de fuente de las etiquetas del eje x
                  },
                },
              },
              y: {
                ticks: {
                  font: {
                    size: 30, // Ajusta el tamaño de fuente de las etiquetas del eje y
                  },
                },
              },
            },
          },
        },
      });
    };

    const generarGraficoCompras = () => {
      // Obtener los meses y las compras como arreglos separados
      const meses = datosCompras.map((dato) => obtenerNombreMes(dato.mes));
      const compras = datosCompras.map((dato) => dato.totalcantidadcompras);
      // Destruir el gráfico existente de compras si existe
      if (chartComprasRef.current) {
        chartComprasRef.current.destroy();
      }
      // Generar un arreglo de colores para compras
      const coloresCompras = generarColores(compras.length);
      // Crear el gráfico de barras de compras
      const ctxCompras = document.getElementById('graficoCompras').getContext('2d');
      chartComprasRef.current = new Chart(ctxCompras, {
        type: 'bar',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Compras',
              data: compras,
              backgroundColor: coloresCompras, // Asignar los colores a las barras de compras
              borderColor: 'rgba(192, 75, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Compras',
              },
            },
          },
          plugins: {
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
            },
            legend: {
              labels: {
                font: {
                  size: 20, // Ajusta el tamaño de fuente de las etiquetas del gráfico
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  font: {
                    size: 15, // Ajusta el tamaño de fuente de las etiquetas del eje x
                  },
                },
              },
              y: {
                ticks: {
                  font: {
                    size: 30, // Ajusta el tamaño de fuente de las etiquetas del eje y
                  },
                },
              },
            },
          },
        },
      });
    };

    const generarGraficoGanancias = () => {
      // Obtener los meses y las ganancias como arreglos separados
      const meses = datosGanancias.map((dato) => obtenerNombreMes(dato.mes));

      const ganancias = datosGanancias.map((dato) => dato.ganancia);
      // Destruir el gráfico existente de ganancias si existe
      if (chartGananciasRef.current) {
        chartGananciasRef.current.destroy();
      }
      // Generar un arreglo de colores para ganancias
      const coloresGanancias = generarColores(ganancias.length);
      // Crear el gráfico de barras de ganancias por mes
      const ctxGanancias = document.getElementById('graficoGanancias').getContext('2d');
      chartGananciasRef.current = new Chart(ctxGanancias, {
        type: 'line',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Ganancias',
              data: ganancias,
              backgroundColor: coloresGanancias, // Asignar los colores a las barras de ganancias
              borderColor: 'rgba(192, 192, 75, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Ganancias',
              },
            },
          },
          plugins: {
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
            },
            legend: {
              labels: {
                font: {
                  size: 20, // Ajusta el tamaño de fuente de las etiquetas del gráfico
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  font: {
                    size: 15, // Ajusta el tamaño de fuente de las etiquetas del eje x
                  },
                },
              },
              y: {
                ticks: {
                  font: {
                    size: 30, // Ajusta el tamaño de fuente de las etiquetas del eje y
                  },
                },
              },
            },
          },
        },
      });
    };

    generarGraficoVentas();
    generarGraficoCompras();
    generarGraficoGanancias();
  }, [datosVentas, datosCompras, datosGanancias]);

  const obtenerNombreMes = (numeroMes) => {
    const fecha = new Date(2022, numeroMes - 1, 1);
    return fecha.toLocaleString('es-ES', { month: 'long' });
  };

  const generarColores = (cantidad) => {
    const colores = [];
    for (let i = 0; i < cantidad; i++) {
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.2)`;
      colores.push(color);
    }
    return colores;
  };

  return (
    <div className='cajagrandedegraficos'>

      <div className='cajaseccionventas'>
        <h1 className='bi bi-bar-chart-line-fill'><strong>GRAFICOS DE VENTAS, COMPRAS Y GANANCIAS POR MES</strong></h1>
        <div className='cajadtablas'>
          <table className='table table-striped-columns' >
            <thead>
              <tr>
                <th>Mes</th>
                <th>Ventas</th>
              </tr>
            </thead>
            <tbody>
              {datosVentas.map((dato, index) => (
                <tr key={index}>
                  <td>{obtenerNombreMes(dato.mes)}</td>
                  <td>{dato.ventas}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className='table table-striped-columns'>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Compras</th>
              </tr>
            </thead>
            <tbody>
              {datosCompras.map((dato, index) => (
                <tr key={index}>
                  <td>{obtenerNombreMes(dato.mes)}</td>
                  <td>{dato.totalcantidadcompras}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className='table table-striped-columns'>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Ganancias</th>
              </tr>
            </thead>
            <tbody>
              {datosGanancias.map((dato, index) => {
                console.log(dato); // Imprimir los datos en la consola
                return (
                  <tr key={index}>
                    <td>{obtenerNombreMes(dato.mes)}</td>
                    <td>{dato.ganancia}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div  className='cajadetotalventasmes'>
          <div className='rotulostotalventasmes'>
            <p>Ventas</p>
            <p>Total de Ventas</p>
          </div>
          <h3 className='titulodeventasmes'>Gs.{totalventasdelmes.total ? totalventasdelmes.total.toLocaleString() : ''}</h3>
        </div>
        <div className="form-container cargarproducto" style={{ width: '70%', marginBottom: '3%', marginLeft: '14%' }}>
          <canvas id="graficoVentas"></canvas>

        </div>
        <div className="form-container cargarproducto" style={{ width: '70%', marginBottom: '3%', marginLeft: '14%' }}>

          <canvas id="graficoCompras"></canvas>
        </div>
        <div className="form-container cargarproducto" style={{ width: '70%', marginBottom: '3%', marginLeft: '14%' }}>
          <canvas id="graficoGanancias"></canvas>
        </div>
      </div>
    </div>
  );
};

export default GraficoEstadistico;