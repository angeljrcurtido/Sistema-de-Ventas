import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Dropdown from 'react-bootstrap/Dropdown';

import axios from "axios";
import { useState, useEffect } from "react";
import './style.css';
import imagen4 from './imagenes/CASADECULTURA.png';

const NavBar = () => {

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
    <nav className='navbarsuper'>
      <div className="nav-header">
        <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
    
          <h2 className='texto0'>Sistema de Libreria y Papeleria</h2>
        </div>
      </div>

      <ul className={`navegador1`}>

        <Dropdown>
          <Dropdown.Toggle className='botondespliege' variant="success" id="dropdown-basic">
            Caja
          </Dropdown.Toggle>

          <Dropdown.Menu>
          <Dropdown.Item className={rutaAperturaCaja? '' : 'disabled'} href="/aperturacaja">Apertura de Caja</Dropdown.Item>
            
            <Dropdown.Item className={rutaCierreCaja? '' : 'disabled'}    href="/cierrecaja">Cierre de Caja</Dropdown.Item>
           
            <Dropdown.Item className= {rutaHistorialCaja? '' : 'disabled'} href="/historialcaja">Historial de Cierre de Caja</Dropdown.Item>
            
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle className='botondespliege' variant="success" id="dropdown-basic">
            Mantenimiento
          </Dropdown.Toggle>

          <Dropdown.Menu>
          
          <Dropdown.Item className={rutaClientes? '' : 'disabled'} href="/clientes">Clientes</Dropdown.Item>
          
          <Dropdown.Item className={rutaProveedores? '' : 'disabled'} href="/proveedores">Proveedores</Dropdown.Item>
          
            <Dropdown.Item className={rutaCargarDatosFactura? '' : 'disabled'} href="/cargardatosfactura">Datos Empresa</Dropdown.Item>
            <Dropdown.Item className={rutaAdministrador? '' : 'disabled'} href="/administrador">Administrador</Dropdown.Item>
            
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle className='botondespliege' variant="success" id="dropdown-basic">
            Reportes
          </Dropdown.Toggle>

          <Dropdown.Menu>
         
            <Dropdown.Item className= {rutaProductosMasVendidos? '' : 'disabled'} href="/productosmasvendidos">Más Vendidos</Dropdown.Item>
            
            <Dropdown.Item className={rutaProductosVendidosFecha? '' : 'disabled'} href="/productosvendidosfecha">Más Vendidos por Fecha</Dropdown.Item>  
         
            <Dropdown.Item className='bi bi-bar-chart-line-fill' href="/">Graficos Estadisticos</Dropdown.Item>

          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle className='botondespliege' variant="success" id="dropdown-basic">
            Prductos y Categorias
          </Dropdown.Toggle>

          <Dropdown.Menu>
               
            <Dropdown.Item className={rutaCargarProductos? '' : 'disabled'} href="/cargarproductos">Productos</Dropdown.Item>
            
            <Dropdown.Item className={rutaCategorias? '' : 'disabled'} href="/categorias">Categorias</Dropdown.Item>
            
            <Dropdown.Item className={rutaInventarioProductos? '' : 'disabled'} href="/inventarioproductos">Inventario Productos</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle className='botondespliege' variant="success" id="dropdown-basic">
            Ventas
          </Dropdown.Toggle>

          <Dropdown.Menu>
          
            <Dropdown.Item className={rutaCrearVentas? '' : 'disabled'} href="/crearventas">Ventas</Dropdown.Item>
            
            <Dropdown.Item className={rutaHistorialVentas? '' : 'disabled'} href="/historialventas">Historial de Ventas</Dropdown.Item>
            
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle className='botondespliege' variant="success" id="dropdown-basic">
            Comprobantes
          </Dropdown.Toggle>

          <Dropdown.Menu>
          
            <Dropdown.Item className={rutaVentasTicket? '' : 'disabled'} href="/ventasticket">Ticket</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle className='botondespliege' variant="success" id="dropdown-basic">
            Compras
          </Dropdown.Toggle>

          <Dropdown.Menu>
          
            <Dropdown.Item className={rutaCargarCompras? '' : 'disabled'} href="/cargarcompras">Compras</Dropdown.Item>
            
            <Dropdown.Item className={rutaHistorialCompras? '' : 'disabled'} href="/historialcompras">Historial de Compras</Dropdown.Item>
            
          </Dropdown.Menu>
        </Dropdown>

      </ul>
    </nav>
  );
};

export default NavBar;