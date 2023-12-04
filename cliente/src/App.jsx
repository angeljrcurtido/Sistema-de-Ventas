import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from "axios";
import React, { useState, useEffect } from "react";
import NavBar from './components/BarraDes'
import CargarProductos from './components/CargarProductos';

import Categorias from './components/Categorias';

import VentasTicket from './components/VentasTicket';
import VentasFactura from './components/VentasFactura';
import CrearVentas from './components/CargarVentas';
import Proveedores from './components/Proveedores';
import AperturaCaja from './components/AperturaCaja';
import CierredeCaja from './components/CierredeCaja';
import HistorialVentas from './components/HistorialVentas';
import HistorialCompras from './components/HistorialCompras';
import Reportelibrosprestados from './components/Reporteslibrosprestados';
import BusquedaAutores from './components/BusquedaAutores';
import InventarioProductos from './components/InventarioProductos';
import Ticket from './components/Ticket';
import CargarDatosFactura from './components/CargarDatosFactura';
import GraficosEstadisticos from './components/GraficosEstadisticos';
import ProductosVendidosFecha from './components/ProductosVendidosFecha';
import HistorialCaja from './components/HistorialCaja';
import CargarCompras from './components/CargarCompras';
import TicketNormal from './components/TicketNormal';
import TicketHistorial from './components/TicketHistorial';
import Administrador from './components/Administrador';
import TicketNormalHistorial from './components/TicketNormalHistorial';
import SoloTicket from './components/SoloTicket';
import Productosmasvendidos from './components/Productosmasvendidos';
import SoloFactura from './components/SoloFactura';
import Clientes from './components/Clientes';

import './App.css';
import Login from './components/Login';

function App() {

  const [permitidos, setPermitidos] = useState([]);

  useEffect(() => {
    const codigo = localStorage.getItem("codigo");

    const fetchPermitidos = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/solopermitidos/${codigo}/permitidos`);
        const data = response.data;
        setPermitidos(data.permitidos);
        console.log(data.permitidos);
      } catch (error) {
        console.error(error);
      }
    };

    if (codigo) {
      fetchPermitidos();
    }
  }, []);

  // Verificar si la ruta está permitida
  const rutaProductosMasVendidos = permitidos.includes("productosmasvendidos");
  const rutaHistorialVentas = permitidos.includes("historialventas");
  const rutaHistorialCompras = permitidos.includes("historialcompras");
  const rutaCrearVentas = permitidos.includes("crearventas");
  const rutaInventarioProductos = permitidos.includes("inventarioproductos");
  const rutaAperturaCaja = permitidos.includes("aperturacaja");
  const rutaProveedores = permitidos.includes("proveedores");
  const rutaHistorialCaja = permitidos.includes("historialcaja");
  const rutaProductosVendidosFecha = permitidos.includes("productosvendidosfecha");
  const rutaClientes = permitidos.includes("clientes");
  const rutaCierreCaja = permitidos.includes("cierrecaja");
  const rutaAdministrador = permitidos.includes("administrador");
  const rutaCargarCompras = permitidos.includes("cargarcompras");
  const rutaCargarDatosFactura = permitidos.includes("cargardatosfactura");
  const rutaVentasTicket = permitidos.includes("ventasticket");
  const rutaVentasFactura = permitidos.includes("ventasfactura");
  const rutaCategorias = permitidos.includes("categorias");
  const rutaCargarProductos = permitidos.includes("cargarproductos");
  const rutaSoloTicket = permitidos.includes("soloticket");
  const rutaSoloFactura = permitidos.includes("solofactura");
  const rutaTicket = permitidos.includes("ticket");
  const rutaTicketNormal = permitidos.includes("ticketnormal");
  const rutaTicketHistorial = permitidos.includes("tickethistorial");
  const rutaTicketNormalHistorial = permitidos.includes("ticketnormalhistorial");


  return (
    <Router>
      <NavBar />
      <div className="App">
        <Routes>

          <Route path="/reportelibrosprestados" element={<Reportelibrosprestados />} />
          <Route path="/login" element={<Login />} />
          <Route path="/busquedaautores" element={<BusquedaAutores />} />
          {rutaHistorialVentas ? (<Route path="/historialventas" element={<HistorialVentas />} />) : (
            <Route
              path="/historialventas"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}
          {rutaHistorialCompras ? (<Route path="/historialcompras" element={<HistorialCompras />} />) : (
            <Route
              path="/historialcompras"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}
          {rutaCrearVentas ? (<Route path="/crearventas" element={<CrearVentas />} />) : (
            <Route
              path="/crearventas"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}

          {rutaInventarioProductos ? (<Route path="/inventarioproductos" element={<InventarioProductos />} />) : (
            <Route
              path="/inventarioproductos"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}

          {rutaVentasTicket ? (<Route path="/ventasticket" element={<VentasTicket />} />) : (
            <Route
              path="/ventasticket"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}
          {rutaAperturaCaja ? (<Route path="/aperturacaja" element={<AperturaCaja />} />) : (
            <Route
              path="/aperturacaja"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}

          {rutaProveedores ? (<Route path="/proveedores" element={<Proveedores />} />) : (
            <Route
              path="/proveedores"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}

          {rutaHistorialCaja ? (<Route path="/historialcaja" element={<HistorialCaja />} />) : (
            <Route
              path="/historialcaja"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}

          {rutaProductosVendidosFecha ? (<Route path="/productosvendidosfecha" element={<ProductosVendidosFecha />} />) : (
            <Route
              path="/productosvendidosfecha"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}

          {rutaClientes ? (<Route path="/clientes" element={<Clientes />} />) : (
            <Route
              path="/clientes"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}


          {rutaCierreCaja ? (<Route path="/cierrecaja" element={<CierredeCaja />} />) : (
            <Route
              path="/cierrecaja"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}


          {rutaAdministrador ? (<Route path="/administrador" element={<Administrador />} />) : (
            <Route
              path="/administrador"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}

          {rutaProductosMasVendidos ? (
            <Route path="/productosmasvendidos" element={<Productosmasvendidos />} />
          ) : (
            <Route
              path="/productosmasvendidos"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}

          {rutaCargarCompras ? (<Route path="/cargarcompras" element={<CargarCompras />} />) : (
            <Route
              path="/cargarcompras"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}
          {rutaCargarDatosFactura ? (<Route path="/cargardatosfactura" element={<CargarDatosFactura />} />) : ( 
            <Route
            path="/cargardatosfactura"
            element={() => (
              <div>
                <h1>No permitido</h1>
              </div>
            )}
          />
          )}
           {rutaVentasFactura ? (<Route path="/ventasfactura" element={<VentasFactura />} />) : ( 
             <Route
             path="/ventasfactura"
             element={() => (
               <div>
                 <h1>No permitido</h1>
               </div>
             )}
           />
           )}
           {rutaCategorias ? (<Route path="/categorias" element={<Categorias />} />) : ( 
             <Route
             path="/categorias"
             element={() => (
               <div>
                 <h1>No permitido</h1>
               </div>
             )}
           />
           )}
          {rutaCargarProductos ? (<Route path="/cargarproductos" element={<CargarProductos />} />) : ( 
            <Route
            path="/cargarproductos"
            element={() => (
              <div>
                <h1>No permitido</h1>
              </div>
            )}
          />
            
          )}
          
          {rutaSoloTicket ? (<Route path="/soloticket/:id" element={<SoloTicket />} />):(
              <Route
              path="/soloticket/:id"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
          )}

        
          <Route path="/" element={<GraficosEstadisticos />} />
          {rutaSoloFactura ? (<Route path="/solofactura/:id" element={<SoloFactura />} />):(  
                 <Route
                 path="/solofactura/:id"
                 element={() => (
                   <div>
                     <h1>No permitido</h1>
                   </div>
                 )}
               />
          )}
       {rutaTicket ? (<Route path="/ticket/:id" element={<Ticket />} />):(   
           <Route
           path="/ticket/:id"
           element={() => (
             <div>
               <h1>No permitido</h1>
             </div>
           )}
         />
       )}
      {rutaTicketNormal ? (<Route path="/ticketnormal/:id" element={<TicketNormal />} />):(  
        <Route
        path="/ticketnormal/:id"
        element={() => (
          <div>
            <h1>No permitido</h1>
          </div>
        )}
      />
      )}
           {rutaTicketHistorial ? ( <Route path="/tickethistorial/:id" element={<TicketHistorial />} />):(  
              <Route
              path="/tickethistorial/:id"
              element={() => (
                <div>
                  <h1>No permitido</h1>
                </div>
              )}
            />
           )}
         {rutaTicketNormalHistorial ? ( <Route path="/ticketnormalhistorial/:id" element={<TicketNormalHistorial />} />):( 
             <Route
             path="/ticketnormalhistorial/:id"
             element={() => (
               <div>
                 <h1>No permitido</h1>
               </div>
             )}
           />
         )} 
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
