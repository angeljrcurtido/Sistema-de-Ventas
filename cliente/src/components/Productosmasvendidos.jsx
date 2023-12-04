import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TablaVentas = () => {
    const [productos, setProductos] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroCantidad, setFiltroCantidad] = useState('');
    const [filtroPrecio, setFiltroPrecio] = useState('');
    const [ordenCantidad, setOrdenCantidad] = useState('asc');

    useEffect(() => {
        const obtenerProductosVendidos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/productosvendidos');
                const productosArray = Object.entries(response.data).map(([nombre, datos]) => ({
                    nombre,
                    ...datos
                }));
                setProductos(productosArray);
            } catch (error) {
                console.error(error);
            }
        };

        obtenerProductosVendidos();
    }, []);

    const handleFiltroNombre = (e) => {
        setFiltroNombre(e.target.value);
    };

    const handleFiltroCantidad = (e) => {
        setFiltroCantidad(e.target.value);
    };

    const handleFiltroPrecio = (e) => {
        setFiltroPrecio(e.target.value);
    };

    const handleOrdenCantidad = (e) => {
        setOrdenCantidad(e.target.value);
    };

    const filtrarProductos = () => {
        let productosFiltrados = productos;

        if (filtroNombre) {
            productosFiltrados = productosFiltrados.filter((producto) =>
                producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
            );
        }

        if (filtroCantidad) {
            productosFiltrados = productosFiltrados.filter(
                (producto) => producto.cantidad.toString() === filtroCantidad
            );
        }

        if (filtroPrecio) {
            productosFiltrados = productosFiltrados.filter(
                (producto) => producto.precioUnitario.toString() === filtroPrecio
            );
        }

        if (ordenCantidad === 'asc') {
            productosFiltrados = productosFiltrados.sort((a, b) => a.cantidad - b.cantidad);
        } else if (ordenCantidad === 'desc') {
            productosFiltrados = productosFiltrados.sort((a, b) => b.cantidad - a.cantidad);
        }

        return productosFiltrados;
    };

    return (
        <div className='cajagrandehistorial'>
            <h2 className="bi bi-receipt"><strong>PRODUCTOS MÁS VENDIDOS</strong></h2>
            <div className='cajadeproductosvendidos'>
                <div>
                    <label htmlFor="filtroNombre">Filtrar por nombre del producto:</label>
                    <input className='form-control ms-2' type="text" id="filtroNombre" value={filtroNombre} onChange={handleFiltroNombre} />
                </div>

                <div>
                    <label htmlFor="filtroCantidad">Filtrar por cantidad:</label>
                    <input className='form-control ms-2' type="text" id="filtroCantidad" value={filtroCantidad} onChange={handleFiltroCantidad} />
                </div>

                <div>
                    <label htmlFor="filtroPrecio">Filtrar por precio unitario:</label>
                    <input className='form-control ms-2' type="text" id="filtroPrecio" value={filtroPrecio} onChange={handleFiltroPrecio} />
                </div>

                <div>
                    <label htmlFor="ordenCantidad">Ordenar por cantidad:</label>
                    <select className="form-select form-select-sm mb-2" id="ordenCantidad" value={ordenCantidad} onChange={handleOrdenCantidad}>
                        <option value="asc">De menor a mayor</option>
                        <option value="desc">De mayor a menor</option>
                    </select>
                </div>
            </div>
            <div className="tabla-scroll tablalibrosprestados">
            <table  className='table table-striped-columns'>
                <thead>
                    <tr>
                        <th>Orden</th>
                        <th>Nombre del producto</th>
                        <th>Cantidad</th>
                        <th>Precio unitario</th>
                    </tr>
                </thead>
                <tbody>
                    {filtrarProductos().map((producto, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.cantidad}</td>
                            <td>{producto.precioUnitario}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default TablaVentas;