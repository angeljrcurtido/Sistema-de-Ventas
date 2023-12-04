import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import axios from "axios";


const Administrador = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    permitidos: [],
  });

  useEffect(() => {
    axios.get("http://localhost:8000/todoslosusuarios")
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleVerUsuarios = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };
  const handleEliminarUsuario = (id) => {
    axios.delete(`http://localhost:8000/eliminarusuario/${id}`)
      .then(response => {
        // Realiza cualquier acción adicional después de eliminar el usuario
        console.log(`Usuario con ID ${id} eliminado correctamente`);
          axios.get("http://localhost:8000/todoslosusuarios")
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        permitidos: [...prevUserData.permitidos, value],
      }));
    } else {
      setUserData((prevUserData) => ({
        ...prevUserData,
        permitidos: prevUserData.permitidos.filter(
          (permitido) => permitido !== value
        ),
      }));
    }
  };

  const handleSectionCheckboxChange = (e) => {
    const { checked, value } = e.target;
    const checkboxesInSection = document.querySelectorAll(`input[name="${value}"]`);

    checkboxesInSection.forEach((checkbox) => {
      checkbox.checked = checked;
      if (checked) {
        setUserData((prevUserData) => ({
          ...prevUserData,
          permitidos: [...prevUserData.permitidos, checkbox.value],
        }));
      } else {
        setUserData((prevUserData) => ({
          ...prevUserData,
          permitidos: prevUserData.permitidos.filter(
            (permitido) => permitido !== checkbox.value
          ),
        }));
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/register", userData)
      .then((response) => {
        console.log(response.data);
        setUserData({
          username: "",
          email: "",
          password: "",
          permitidos: [],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='cajagrandeventas'>
      <h2 className="bi bi-person-add"><strong>CREAR USUARIOS</strong></h2>
      <form onSubmit={handleSubmit} >
        <div>
          <div>
            <label><strong>
              Username:
            </strong>
              <input
                className="form-control"
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
              />
            </label>
            <br />
            <label><strong>
              Email:
            </strong>
              <input
                className="form-control"
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
              />
            </label>
            <br />
            <label><strong>
              Password:
            </strong>
              <input
                className="form-control"
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
              />

            </label>
            <br />
          </div>
          <label>
            <strong>
              Permitidos:
            </strong>
            <br />
            <div className="cajagrandeseccion">
              <div className="subcajaseccion1">
                <label>
                  <input
                    type="checkbox"
                    value="seccion1"
                    onChange={handleSectionCheckboxChange}
                  />
                  Sección 1
                </label>
                <br />
                <div className="subseccion1grande">
                  <div className="subseccion1">
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="productosmasvendidos"
                      onChange={handleCheckboxChange}
                    />
                    Productos más vendidos
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="historialventas"
                      onChange={handleCheckboxChange}
                    />
                    Historial Ventas
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="historialcompras"
                      onChange={handleCheckboxChange}
                    />
                    Historial Compras
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="crearventas"
                      onChange={handleCheckboxChange}
                    />
                    Crear Ventas
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="inventarioproductos"
                      onChange={handleCheckboxChange}
                    />
                    Inventario de Productos
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="aperturacaja"
                      onChange={handleCheckboxChange}
                    />
                    Apertura de Caja
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="proveedores"
                      onChange={handleCheckboxChange}
                    />
                    Proveedores
                    <br />



                    <input
                      type="checkbox"
                      name="seccion1"
                      value="historialcaja"
                      onChange={handleCheckboxChange}
                    />
                    Historial de Caja
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="productosvendidosfecha"
                      onChange={handleCheckboxChange}
                    />
                    Productos más vendidos por fecha
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="clientes"
                      onChange={handleCheckboxChange}
                    />
                    Clientes
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="cierrecaja"
                      onChange={handleCheckboxChange}
                    />
                    Cierre Caja
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="cargarcompras"
                      onChange={handleCheckboxChange}
                    />
                    Cargar Compras
                    <br />
                  </div>
                  <div className="subseccion1">
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="ventasticket"
                      onChange={handleCheckboxChange}
                    />
                    Ventas con Ticket
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="ventasfactura"
                      onChange={handleCheckboxChange}
                    />
                    Ventas con Factura
                    <br />

                    <input
                      type="checkbox"
                      name="seccion1"
                      value="categorias"
                      onChange={handleCheckboxChange}
                    />
                    Crear Categorias
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="cargarproductos"
                      onChange={handleCheckboxChange}
                    />
                    Cargar Productos
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="soloticket"
                      onChange={handleCheckboxChange}
                    />
                    Visualizar solo tickets
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="solofactura"
                      onChange={handleCheckboxChange}
                    />
                    Visualizar solo facturas
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="ticket"
                      onChange={handleCheckboxChange}
                    />
                    Diseño de Factura
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="ticketnormal"
                      onChange={handleCheckboxChange}
                    />
                    Diseño de Ticket
                    <br />
                    <input
                      type="checkbox"
                      name="seccion1"
                      value="ticketnormal"
                      onChange={handleCheckboxChange}
                    />
                    Diseño de Ticket
                    <br />

                    <input
                      type="checkbox"
                      name="seccion1"
                      value="tickethistorial"
                      onChange={handleCheckboxChange}
                    />
                    Re-impresion de Ticket
                    <br />

                    <input
                      type="checkbox"
                      name="seccion1"
                      value="ticketnormalhistorial"
                      onChange={handleCheckboxChange}
                    />
                    Re-impresion de Factura
                    <br />
                  </div>
                  {/* Agrega aquí los demás checkboxes de la sección 1 */}
                </div>
              </div>

              <div className="subcajaseccion1">
                <label>
                  <input
                    type="checkbox"
                    value="seccion2"
                    onChange={handleSectionCheckboxChange}
                  />
                  Sección 2
                </label>
                <br />
                <div className="subseccion1">
                  <input
                    type="checkbox"
                    name="seccion2"
                    value="administrador"
                    onChange={handleCheckboxChange}
                  />
                  Crear Usuarios
                  <br />
                  <input
                    type="checkbox"
                    name="seccion2"
                    value="cargardatosfactura"
                    onChange={handleCheckboxChange}
                  />
                  Cargar Datos de Empresa
                  <br />
                </div>
                {/* Agrega aquí los demás checkboxes de la sección 2 */}
              </div>
            </div>
          </label>

        </div>
        <button className="btn btn-success mb-2 mt-2" type="submit">Crear Usuario</button>
      </form>

      <button className="btn btn-success mb-2 mt-2" onClick={handleVerUsuarios} type="button">Ver Usuarios</button>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
          <div className='modalproductos' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px' }}>

            <h2 className='productos bi bi-pencil-square'>Usuarios Cargados</h2>
            
            <div className='submodalproductos' style={{ maxHeight: '300px', overflow: 'auto' }}>
              <table className='table table-striped-columns'>
                <thead>
                  <tr>
                    <th>N° Orden</th>
                    <th>Nombre de Usuario</th>
                    <th>Email</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <button className='btn btn-danger bi bi-plus-circle-fill eliminar2' onClick={() => handleEliminarUsuario(user._id)}>Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className='btn btn-danger mt-2 bi bi-plus-circle-fill' onClick={handleCloseModal}>Cerrar</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Administrador;