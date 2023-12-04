import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CargarDatosFactura = () => {
    const [timbradoNumero, setTimbradoNumero] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [impresion, setImpresion] = useState('');
    const [ruc, setRuc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [negocio, setNegocio] = useState('');
    const [validoDesde, setValidoDesde] = useState('');
    const [validoHasta, setValidoHasta] = useState('');
    const [facturaNumero, setFacturaNumero] = useState('');
    const [numeroCaja, setNumeroCaja] = useState('');
    const [numeroSucursal, setNumeroSucursal] = useState('');
    const [datosFactura, setDatosFactura] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const handleCargarDatos = () => {
        const datos = {
            timbradoNumero,
            empresa,
            impresion,
            ruc,
            direccion,
            negocio,
            numeroCaja,
            numeroSucursal,
            validoDesde,
            validoHasta,
            facturaNumero
        };



        axios.post('http://localhost:8000/datosfactura', datos)
            .then(response => {
                alert("Los datos se cargaron exitosamente")
                // Aquí puedes manejar la respuesta del servidor si es necesario
                console.log(response.data);
                // Realizar el PATCH
            axios.patch('http://localhost:8000/facturanuevo', { facturaNumero: datos.facturaNumero })
            .then(patchResponse => {
                // Aquí puedes manejar la respuesta del PATCH si es necesario
                console.log(patchResponse.data);
            })
            .catch(patchError => {
                // Aquí puedes manejar el error del PATCH si ocurriera alguno
                console.error(patchError);
            });
                
                // Reiniciar los estados
                setTimbradoNumero('');
                setEmpresa('');
                setRuc('');
                setImpresion('');
                setDireccion('');
                setNegocio('');
                setNumeroCaja('');
                setNumeroSucursal('');
                setValidoDesde('');
                setValidoHasta('');
                setFacturaNumero('');
            })
            .catch(error => {
                // Aquí puedes manejar el error si ocurriera alguno
                console.error(error);
            });
    };
    useEffect(() => {
        axios.get('http://localhost:8000/datosfactura')
            .then(response => {
                // Aquí puedes manejar la respuesta del servidor si es necesario
                setDatosFactura(response.data);
            })
            .catch(error => {
                // Aquí puedes manejar el error si ocurriera alguno
                console.error(error);
            });
    }, []);

    // Obtener los índices de los elementos a mostrar en la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = datosFactura.slice(indexOfFirstItem, indexOfLastItem);

    // Cambiar de página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(datosFactura.length / itemsPerPage); //Esto es importante


    return (
        <div className="form-container cargarproducto">
            <h1 className='bi bi-file-earmark-plus-fill titulodeclientes'><strong>CARGAR DATOS DE LA EMPRESA</strong></h1>
            <div className='cajadeclientes datosfactura'>
                <div>
                    <label>Timbrado N°:</label>
                    <input
                        className="form-control ms-2 me-2"
                        type="text"
                        value={timbradoNumero}
                        onChange={e => setTimbradoNumero(e.target.value)}
                    />
                </div>
                <div>
                    <label>Empresa:</label>
                    <input
                        className="form-control ms-2 me-2"
                        type="text"
                        value={empresa}
                        onChange={e => setEmpresa(e.target.value)}
                    />
                </div>
                <div>
                    <label>
                        Ruc N°:
                    </label>
                    <input
                        className="form-control ms-2 me-2"
                        type="text"
                        value={ruc}
                        onChange={e => setRuc(e.target.value)}
                    />
                </div>
                <div>
                    <label>Dirección:</label>
                    <input
                        className="form-control ms-2 me-2"
                        type="text"
                        value={direccion}
                        onChange={e => setDireccion(e.target.value)}
                    />
                </div>
                <div>
                    <label>Negocio:</label>
                    <input
                        className="form-control ms-2 me-4"
                        type="text"
                        value={negocio}
                        onChange={e => setNegocio(e.target.value)}
                    />
                </div>
                <div>
                    <label>Valido Desde:</label>
                    <input
                        className="form-control ms-2 me-2"
                        type="text"
                        value={validoDesde}
                        onChange={e => setValidoDesde(e.target.value)}
                    />
                </div>
                <div>
                    <label>Valido Hasta</label>
                    <input
                        className="form-control ms-2 me-2"
                        type="text"
                        value={validoHasta}
                        onChange={e => setValidoHasta(e.target.value)}
                    />
                </div>
                <div>
                    <label>Factura Número</label>
                    <input
                        className="form-control ms-2 me-2"
                        type="text"
                        value={facturaNumero}
                        onChange={e => setFacturaNumero(e.target.value)}
                    />
                </div>
                <div>
                    <label>Número de Caja</label>
                    <input
                        className="form-control ms-2 me-2"
                        type="text"
                        value={numeroCaja}
                        onChange={e => setNumeroCaja(e.target.value)}
                    />
                </div>
                <div>
                    <label>Número de Sucursal</label>
                    <input
                        className="form-control ms-2 me-2"
                        type="text"
                        value={numeroSucursal}
                        onChange={e => setNumeroSucursal(e.target.value)}
                    />
                </div>
                <div>
                    <label>Tamaño de Impresiónes</label>
                    <select className="form-select form-select-sm" name="impresion" id="impresion" onChange={(e) => setImpresion(e.target.value)}>
                        <option value="">Seleccione una Opción</option>
                        <option value="A7">74mm</option>
                        <option value="A8">52mm</option>
                        <option value="A9">37mm</option>
                    </select>
                </div>


            </div>
            <button className='btn btn-success bi bi-plus-circle datosfactura' onClick={handleCargarDatos}>Cargar Datos</button>
            <div className="tabla-scroll tablalibrosprestados">
                <table className='table table-striped-columns datosfactura'>
                    <thead>
                        <tr>
                            <th>Timbrado Número</th>
                            <th>Empresa</th>
                            <th>RUC</th>
                            <th>Dirección</th>
                            <th>Negocio</th>
                            <th>Válido Desde</th>
                            <th>Válido Hasta</th>
                            <th>Factura Número</th>
                            <th>Tamaño de impresión</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((dato, index) => (
                            <tr key={index}>
                                <td>{dato.timbradoNumero}</td>
                                <td>{dato.empresa}</td>
                                <td>{dato.ruc}</td>
                                <td>{dato.direccion}</td>
                                <td>{dato.negocio}</td>
                                <td>{dato.validoDesde}</td>
                                <td>{dato.validoHasta}</td>
                                <td>{dato.facturaNumero}</td>
                                <td>{dato.impresion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Paginación */}
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
    );
};

export default CargarDatosFactura;