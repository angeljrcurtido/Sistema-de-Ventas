import React, { useState, useEffect } from "react";
import axios from "axios";

const InventarioProductos = () => {
    const [productos, setProductos] = useState([]);
    const [codigo, setCodigo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [filtrolote, setFiltrolote] = useState('');
    const [productos2, setProductos2] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const [stockMaximo, setStockMaximo] = useState('');
    const [filtroStockMinimo, setFiltroStockMinimo] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 15;

    useEffect(() => {
        axios.get("http://localhost:8000/productos")
            .then(response => {
                setProductos(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    // Funciones para filtrar

    const handleCodigoChange = (event) => {
        setCodigo(event.target.value);
    };

    const handleCategoriaChange = (event) => {
        setCategoria(event.target.value);
    };

    const handleProductoChange = (event) => {
        setProductos2(event.target.value);
    };

    const handleStockMinimoChange = (event) => {
        setFiltroStockMinimo(event.target.value);
    };

    const handleFechaInicioChange = (event) => {
        setFechaInicio(event.target.value);
    };

    const handleFechaFinChange = (event) => {
        setFechaFin(event.target.value);
    };
    const handleFiltroLoteChange = (event) => {
        setFiltrolote(event.target.value);
    };
    // Filtrar productos en tiempo real según código, categoría, nombre de producto y rango de fechas 
    const productosFiltrados = productos.filter(producto =>
        producto.codigo.toLowerCase().includes(codigo.toLowerCase()) &&
        producto.categoria.toLowerCase().includes(categoria.toLowerCase()) &&
        producto.producto.toLowerCase().trim().startsWith(productos2.toLowerCase().trim()) &&
        (fechaInicio === '' || producto.fechadevencimiento >= fechaInicio) &&
        (fechaFin === '' || producto.fechadevencimiento <= fechaFin) &&
        (stockMaximo === '' || producto.stock <= stockMaximo) &&
        (producto.lotenumero ? producto.lotenumero.toString().toLowerCase().includes(filtrolote.toLowerCase()) : "") &&
        (filtroStockMinimo === '' || (filtroStockMinimo === 'si' && producto.stock <= producto.stockminimo))
    );

    // Obtener el índice inicial y final de los productos a mostrar en la página actual
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productosFiltrados.slice(indexOfFirstProduct, indexOfLastProduct);

    // Calcular el número total de páginas
    const totalPages = Math.ceil(productosFiltrados.length / productsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <div className='cajagrandehistorial'>
            <h2 className='titulolibrosalquilados bi bi-clock-history'>Inventario de Productos</h2>
            <div className="tabla-scroll tablalibrosprestados">
                <div className="filter-container">
                    <div className="form-group">
                        <label htmlFor="codigo">Filtrar por código:</label>
                        <input type="text" className="form-control" id="codigo" value={codigo} onChange={handleCodigoChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="producto">Filtrar por Lote:</label>
                        <input type="text" className="form-control" id="producto" value={filtrolote} onChange={handleFiltroLoteChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="categoria">Filtrar por categoría:</label>
                        <input type="text" className="form-control" id="categoria" value={categoria} onChange={handleCategoriaChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="producto">Filtrar por nombre de producto:</label>
                        <input type="text" className="form-control" id="producto" value={productos2} onChange={handleProductoChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaInicio">Fecha de inicio:</label>
                        <input type="date" className="form-control" id="fechaInicio" value={fechaInicio} onChange={handleFechaInicioChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFin">Fecha de fin:</label>
                        <input type="date" className="form-control" id="fechaFin" value={fechaFin} onChange={handleFechaFinChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="stockMaximo">Stock máximo:</label>
                        <input type="number" className="form-control" id="stockMaximo" value={stockMaximo} onChange={(e) => setStockMaximo(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="filtroStockMinimo">Stock mínimo:</label>
                        <select
                            id="filtroStockMinimo"
                            className="form-control"
                            value={filtroStockMinimo}
                            onChange={handleStockMinimoChange}
                        >
                            <option value="">Mostrar todos</option>
                            <option value="si">Mostrar igual o menor al stock mínimo</option>
                        </select>
                    </div>

                </div>
                <table className='table table-striped-columns'>
                    <thead>
                        <tr>
                            <th>N° Orden</th>
                            <th>Código</th>
                            <th>Lote N°</th>
                            <th>Categoría</th>
                            <th>Producto</th>
                            <th>Fecha de Vencimiento</th>
                            <th>Descripción</th>
                            <th>Stock</th>
                            <th>Precio Compra</th>
                            <th>Precio Venta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((producto, index) => (
                            <tr key={producto._id}>
                                <td>{index + 1}</td>
                                <td>{producto.codigo}</td>
                                <td>{producto.lotenumero}</td>
                                <td>{producto.categoria}</td>
                                <td>{producto.producto}</td>
                                <td>{producto.fechadevencimiento}</td>
                                <td>{producto.descripcion}</td>
                                <td>{producto.stock}</td>
                                <td>{producto.preciocompra}</td>
                                <td>{producto.precioventa}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                        {currentPage > 1 && (
                            <button className="btn btn-secondary" onClick={() => handlePageChange(currentPage - 1)}>
                                &#8592;
                            </button>
                        )}
                        <button className="btn btn-primary" disabled>
                            {currentPage}
                        </button>
                        {currentPage < totalPages && (
                            <button className="btn btn-secondary" onClick={() => handlePageChange(currentPage + 1)}>
                                &#8594;
                            </button>
                        )}
                    </div>
            </div>
        </div>
    );
};

export default InventarioProductos;