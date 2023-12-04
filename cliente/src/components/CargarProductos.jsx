import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './style.css';

const CargarProductos = () => {
  const [productos, setProductos] = useState([]);
  const [autores, setAutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [filtrocodigo, setFiltrocodigo] = useState('');
  const [filtrolote, setFiltrolote] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [filtroproducto, setFiltroproducto] = useState('');
  const [tipoIva, setTipoIva] = useState('');
  const [iva10, setIva10] = useState('');
  const [iva5, setIva5] = useState('');
  const [imagen, setImagen] = useState('');
  const [cantidadProductos, setCantidadProductos] = useState(5);
  const [categoria, setCategoria] = useState('');
  const [preciocompra, setPreciocompra] = useState('');
  const [precioventa, setPrecioventa] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechadevencimiento, setFechadevencimiento] = useState('');
  const [stock, setStock] = useState('');
  const [stockminimo, setStockMinimo] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [producto, setProducto] = useState('');
  const [lote, setLote] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [codigoExistente, setCodigoExistente] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:8000/productos')
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/categories')
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let precioIva = 0;
    
    if (tipoIva === 'iva10') {
      precioIva = (precioventa / 11).toFixed(2);
      setIva10(precioIva)
      setIva5(0)
    } else if (tipoIva === 'iva5') {
      precioIva = (precioventa / 23).toFixed(2);
      setIva5(precioIva)
      setIva10(0)
    }
    // Aquí puedes hacer lo que necesites con el precioIva, como guardarlo en un estado o enviarlo en la petición POST
    
    console.log('Precio con IVA:', precioIva);
  }, [tipoIva]);

  const handleTipoIvaChange = (event) => {
    setTipoIva(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const codigoExistente = productos.some((producto) => producto.codigo === codigo);
    setCodigoExistente(codigoExistente);

    if (codigoExistente) {
      const confirmacion = window.confirm(
        "¿Deseas cargar el producto con código ya existente?"
      );

      if (confirmacion) {
        enviarPeticion();
      } else {
        return;
      }
    } else {
      enviarPeticion();
    }

    setCodigo('');
    setCategoria('');
    setProducto('');
    setDescripcion('');
    setImagen('');
    setPreciocompra('');
    setPrecioventa('');
    setStock('');
    setStockMinimo('');
    setLote(1);
    formRef.current.reset();
  };

  const enviarPeticion = () => {
    if (productoSeleccionado) {
      axios.put(`http://localhost:8000/productos/${productoSeleccionado._id}`, {
        codigo,
        categoria,
        producto,
        descripcion,
        imagen,
        preciocompra,
        precioventa,
        stock,
        stockminimo,
        lotenumero: lote
      })
        .then(response => {
          axios.get('http://localhost:8000/productos')
            .then(response => {
              console.log("aqui se edita")
              window.location.reload();
              setProductos(response.data);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      axios.post('http://localhost:8000/productos', {
        codigo,
        categoria,
        producto,
        fechadevencimiento,
        descripcion,
        iva10,
        iva5,
        imagen,
        preciocompra,
        precioventa,
        stock,
        stockminimo,
        lotenumero: lote
      })
        .then(response => {
          axios.get('http://localhost:8000/productos')
            .then(response => {
              setProductos(response.data);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    }
    setCodigo('');
    setCategoria('');
    setProducto('');
    setDescripcion('');
    setImagen('');
    setIva10('');
    setIva5('');
    setPreciocompra('');
    setPrecioventa('');
    setStock('');
    setStockMinimo('');
    setLote(1);
    formRef.current.reset();
  };

  const handleEditarLibro = (id) => {
    axios.get(`http://localhost:8000/productos/${id}`)
      .then(response => {
        setProductoSeleccionado(response.data);
        setCodigo(response.data.codigo);
        setCategoria(response.data.categoria);
        setProducto(response.data.producto);
        setDescripcion(response.data.descripcion);
        setImagen(response.data.imagen);
        setPreciocompra(response.data.preciocompra);
        setPrecioventa(response.data.precioventa);
        setStock(response.data.stock);
        setStockMinimo(response.data.stockminimo);
        setLote(response.data.lotenumero);
        setModalVisible(false);

      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleToggleModal = () => {
    setModalVisible(true);
  };

  const handleCerrarModal = () => {
    setModalVisible(false);
  };


  const handleEliminarLibro = (id) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este libro?")) {
      axios.delete(`http://localhost:8000/productos/${id}`)
        .then(response => {
          axios.get('http://localhost:8000/productos')
            .then(response => {
              setProductos(response.data);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const handleCodigoChange = (event) => {
    setFiltrocodigo(event.target.value);
  };
  const handleFiltroProductoChange = (event) => {
    setFiltroproducto(event.target.value);
  };
  const handleFiltroLoteChange = (event) => {
    setFiltrolote(event.target.value);
  };

  const productosFiltrados = productos.filter(producto =>
    producto.codigo.toLowerCase().includes(filtrocodigo.toLowerCase()) &&
    producto.producto.toLowerCase().includes(filtroproducto.toLowerCase()) &&
    (producto.lotenumero ? producto.lotenumero.toString().toLowerCase().includes(filtrolote.toLowerCase()) : "")
  );

  const productosMostrados = cantidadProductos === productosFiltrados.length ? productosFiltrados : productosFiltrados.slice(0, cantidadProductos);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    axios.get(`http://localhost:8000/productos/${id}`)
      .then(response => {
        setProductoSeleccionado(response.data);
        setCodigo(response.data.codigo);
        setCategoria(response.data.categoria);
        setProducto(response.data.producto);
        setDescripcion(response.data.descripcion);
        setImagen(response.data.imagen);
        setPreciocompra(response.data.preciocompra);
        setPrecioventa(response.data.precioventa);
        setStock(response.data.stock);
        setStockMinimo(response.data.stockminimo);
        setLote(response.data.lotenumero)
      })
      .catch(error => {
        console.log(error);
      });
  }, [location.search]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setShowOptions(true);
  };


  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="form-container cargarproducto">
        <h2 className=" bi bi-plus-circle-dotted titulodecarga">Cargar Productos</h2>
        <div className="subgrupo1 cargarpeli">
          <div className="form-group title">
            <label htmlFor="codigo" className="form-label">Codigo Producto:</label>
            <textarea type="text" className="form-control" id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value.trim())} />
          </div>

          <div className="form-group subcategoria">
            <label htmlFor="lote" className="form-label">Número de Lote:</label>
            <input type="text" className="form-control me-4" id="lote" value={lote} onChange={(e) => setLote(e.target.value.trim())} />
          </div>

          <div className="form-group autores">
            <label htmlFor="producto" className="form-label">Nombre Producto:</label>
            <div className="select-container">
              <input type="text" className="form-control" id="producto" value={producto} onChange={(e) => setProducto(e.target.value.trim())} />
            </div>
          </div>

        </div>
        <div className="subgrupo2 cargar">

          <div className="form-group1">
            <label htmlFor="descripcion" className="form-label">Descripción:</label>
            <textarea className="form-control" id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value.trim())}></textarea>
          </div>
          <div className="form-group subcategoria">
            <label htmlFor="fechadevencimiento" className="form-label">Fecha de Vencimiento:</label>
            <input type="date" className="form-control" id="fechadevencimiento" value={fechadevencimiento} onChange={(e) => setFechadevencimiento(e.target.value)} />
          </div>
          <div className="form-group categoria">
            <label htmlFor="categoria" className="form-label">Categoría:</label>
            <select className="form-control" id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ color: '#000' }}>
              <option value="">Seleccionar categoría</option>
              {categorias.map(categoria => (
                <option key={categoria._id} value={categoria.name} style={{ color: '#000' }} >{categoria.name}</option>
              ))}
            </select>
          </div>

        </div>
        <div className="subgrupo4">
          <div className="form-group subcategoria">
            <label htmlFor="preciocompra" className="form-label">Precio Compra:</label>
            <input type="number" className="form-control" id="preciocompra" value={preciocompra} onChange={(e) => setPreciocompra(e.target.value.trim())} />
          </div>

          <div className="form-group subcategoria">
            <label htmlFor="precioventa" className="form-label">Precio Venta:</label>
            <input type="number" className="form-control" id="precioventa" value={precioventa} onChange={(e) => setPrecioventa(e.target.value.trim())} />
          </div>

          <div className="form-groupdecantidad">
            <label htmlFor="stock" className="form-label">Stock:</label>
            <input type="number" className="form-control" id="stock" value={stock} onChange={(e) => setStock(e.target.value.trim())} />
          </div>
          <div className="form-groupdecantidad">
            <label htmlFor="stockminimo" className="form-label">Stock Minimo:</label>
            <input type="number" className="form-control" id="stock" value={stockminimo} onChange={(e) => setStockMinimo(e.target.value.trim())} />
          </div>
          <div className="form-groupdecantidad">
            <label htmlFor="stock" className="form-label">Tipo de Iva:</label>
            <select name="tipodeiva" id="tipodeiva" onChange={handleTipoIvaChange}>
            <option value="">Opciones</option>
              <option value="iva10">Iva 10%</option>
              <option value="iva5">Iva 5%</option>
            </select>
          </div>
        </div>



        <button type="submit" className="btn btn-success guardarlibro">{productoSeleccionado ? "Editar" : "Guardar"}</button>

      </form>
      <button className='btn btn-success bi bi-plus-circle' onClick={handleToggleModal} style={{ marginLeft: '5%' }}>Ver productos cargados</button>
      {modalVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
          <div className='modalproductos' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px' }}>
            <div className='cajagrandedeproductos'>
              <h2 className="titulodeproductoscargados"><strong>PRODUCTOS</strong></h2>
              <div className='registro select'>
                <label htmlFor="">Mostrar</label>
                <select
                  className="form-select-sm"
                  value={cantidadProductos}
                  onChange={(e) => setCantidadProductos(parseInt(e.target.value))}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value={productosFiltrados.length}>Todo</option>
                </select>
              </div>
              <button className='btn btn-danger bi bi-x-circle' style={{ marginLeft: '70%', marginRight: '2%' }} onClick={handleCerrarModal}>Cerrar</button>
            </div>
            <div className="tabla-scroll reporteslibrosprestados cargar">
              <div className="filter-container">
                <div className="form-group">
                  <label htmlFor="codigo">Filtrar por código:</label>
                  <input type="text" className="form-control" id="codigo" value={filtrocodigo} onChange={handleCodigoChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="producto">Filtrar por nombre:</label>
                  <input type="text" className="form-control" id="producto" value={filtroproducto} onChange={handleFiltroProductoChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="producto">Filtrar por Lote:</label>
                  <input type="text" className="form-control" id="producto" value={filtrolote} onChange={handleFiltroLoteChange} />
                </div>
              </div>
              <div id="reporte">

                <table className="table table-striped-columns">

                  <thead>
                    <tr>
                      <th>Codigo</th>
                      <th>Lote N°</th>
                      <th>Producto</th>
                      <th>Descripcion</th>
                      <th>Categoria</th>
                      <th>Precio Compra</th>
                      <th>Precio Venta</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosMostrados.map((producto, index) => (
                      <tr key={producto._id}>
                        <td>{producto.codigo}</td>
                        <td>{producto.lotenumero}</td>
                        <td>{producto.producto}</td>
                        <td>{producto.descripcion}</td>
                        <td>{producto.categoria}</td>
                        <td>{producto.preciocompra}</td>
                        <td>{producto.precioventa}</td>

                        <td>
                          <button className="btn btn-success" onClick={() => handleEditarLibro(producto._id)}>Editar</button>
                          <button className="btn btn-danger" onClick={() => handleEliminarLibro(producto._id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

      )}
    </div>
  );
};

export default CargarProductos;