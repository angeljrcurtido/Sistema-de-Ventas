import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VentasPorFecha = () => {
    const [data, setData] = useState({});
    const [filteredData, setFilteredData] = useState({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showTable, setShowTable] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('asc');
    const productsPerPage = 15;
    // Obtener el índice inicial y final de los productos a mostrar en la página actual
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = Object.values(filteredData).slice(indexOfFirstProduct, indexOfLastProduct);

    // Calcular el número total de páginas
    const totalPages = Math.ceil(Object.values(filteredData).length / productsPerPage);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchData();
    }, []); // Fetch data when the component mounts


    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    // Ordenar los productos según el orden seleccionado
    const sortedProducts = currentProducts.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.cantidad - b.cantidad;
        } else {
            return b.cantidad - a.cantidad;
        }
    });


    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/ventasPorFechadecompra');
            setData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const filterDataByDateRange = () => {
        if (startDate && endDate) {
            const start = parseDate(startDate);
            const end = parseDate(endDate);

            const filtered = {};

            Object.keys(data).forEach(date => {
                const currentDate = parseDate(date);
                if (currentDate >= start && currentDate <= end) {
                    data[date].productos.forEach(producto => {
                        const codigo = producto.codigo[0];
                        const descripcion = producto.descripcion[0];
                        const cantidad = producto.cantidad[0];
                        const subtotal = producto.subtotal[0];

                        if (!filtered[codigo]) {
                            filtered[codigo] = {
                                codigo,
                                descripcion,
                                cantidad,
                                subtotal
                            };
                        } else {
                            filtered[codigo].cantidad += cantidad;
                            filtered[codigo].subtotal += subtotal;
                        }
                    });
                }
            });

            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    };


    const handleStartDateChange = (event) => {
        let value = event.target.value;

        // Eliminar todos los guiones antes de verificar la longitud
        value = value.replace(/-/g, '');

        // Agregar guiones en las posiciones deseadas
        if (value.length >= 2 && value.length < 4) {
            value = `${value.slice(0, 2)}-${value.slice(2)}`;
        } else if (value.length >= 4) {
            value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4, 8)}`;
        }

        setStartDate(value);
    };

    const handleEndDateChange = (event) => {
        let value = event.target.value;

        // Eliminar todos los guiones antes de verificar la longitud
        value = value.replace(/-/g, '');

        // Agregar guiones en las posiciones deseadas
        if (value.length >= 2 && value.length < 4) {
            value = `${value.slice(0, 2)}-${value.slice(2)}`;
        } else if (value.length >= 4) {
            value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4, 8)}`;
        }

        setEndDate(value);
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Fecha Inicio:", startDate);
        console.log("Fecha Fin:", endDate);
        filterDataByDateRange();
        setShowTable(true);
    };

    return (
        <div className='cajagrandehistorial'>
            <h2 className='bi bi-bookmark-check'><strong>PRODUCTOS MÁS VENDIDOS POR FECHA</strong></h2>
            <form onSubmit={handleSubmit} className='cajadeproductosvendidos'>

                <label htmlFor="startDate"><strong>Fecha Inicio:</strong></label>
                <input className='form-control ' type="text" id="startDate" value={startDate} onChange={handleStartDateChange} />

                <label htmlFor="endDate"><strong>Fecha Fin:</strong></label>
                <input className='form-control mb-2' type="text" id="endDate" value={endDate} onChange={handleEndDateChange} />
                <div>                <label htmlFor="sortOrder"><strong>Ordenar por cantidad:</strong></label>
                <select id="sortOrder" value={sortOrder} onChange={handleSortOrderChange}>
                    <option value="asc">Menor a mayor</option>
                    <option value="desc">Mayor a menor</option>
                </select>

                </div>


                <button className="bi bi-bookmark-check btn btn-success mb-2" type="submit"><strong>Filtrar</strong></button>
            </form>
            {showTable && (

                <div>
                    <table className='table table-striped-columns'>
                        <thead>
                            <tr>
                                <th>Descripción</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((producto, index) => (
                                <tr key={index}>
                                    <td>{producto.descripcion}</td>
                                    <td>{producto.cantidad}</td>
                                    <td>{producto.subtotal}</td>
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
            )}
        </div>
    );
};

export default VentasPorFecha;