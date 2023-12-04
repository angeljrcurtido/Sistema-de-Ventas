import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clientes = () => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cedula, setCedula] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [ruc, setRuc] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:8000/clientes');
        setProveedores(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProveedores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['nombre', 'direccion', 'cedula', 'telefono', 'ruc'];
    const missing = requiredFields.filter((field) => !eval(field));
    if (missing.length > 0) {
      setMissingFields(missing);
      alert('Por favor complete los espacios vacíos');
      return;
    }
    try {
      if (editingId) {
        await axios.patch(`http://localhost:8000/clientes/${editingId}`, {
          nombre,
          direccion,
          cedula,
          telefono,
          ruc
        });
        const updatedProveedores = proveedores.map((proveedor) => {
          if (proveedor._id === editingId) {
            return { ...proveedor, nombre, direccion, cedula, telefono, ruc };
          }
          return proveedor;
        });
        setProveedores(updatedProveedores);
        setEditingId(null);
      } else {
        const response = await axios.post('http://localhost:8000/clientes', {
          nombre,
          cedula,
          direccion,
          telefono,
          ruc
        });
        setProveedores([...proveedores, response.data]);
      }
      setNombre('');
      setDireccion('');
      setCedula('');
      setTelefono('');
      setRuc('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/clientes/${id}`);
      const proveedor = response.data;
      setNombre(proveedor.nombre);
      setDireccion(proveedor.direccion);
      setCedula(proveedor.cedula);
      setTelefono(proveedor.telefono);
      setRuc(proveedor.ruc);
      setEditingId(id);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleModal = () => {
    setModalVisible(true);
  };

  const handleCerrarModal = () => {
    setModalVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/clientes/${id}`);
      setProveedores(proveedores.filter((proveedor) => proveedor._id !== id));
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <form onSubmit={handleSubmit} className="form-container cargarproducto">

        <h1 className='bi bi-file-earmark-plus-fill titulodeclientes'><strong>CARGAR CLIENTES</strong></h1>
        <div className='cajadeclientes'>
          <div>
            <label>
              Nombre:
              <input className={`form-control ms-2 me-2 ${missingFields.includes('nombre') ? 'is-invalid' : ''}`} type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>
            <br />
            <label>
              Dirección:
              <input className={`form-control ms-2 ${missingFields.includes('direccion') ? 'is-invalid' : ''}`} type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
            </label>
            <br />
            <label>
              Teléfono:
              <input className={`form-control ms-2 ${missingFields.includes('telefono') ? 'is-invalid' : ''}`} type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </label>
            <br />
          </div>
          <div>
            <label>
              RUC:
              <input className={`form-control ms-2 ${missingFields.includes('ruc') ? 'is-invalid' : ''}`} type="text" value={ruc} onChange={(e) => setRuc(e.target.value)} />
            </label>
            <br />
            <label>
              Cedula:
              <input className={`form-control ms-2 ${missingFields.includes('cedula') ? 'is-invalid' : ''}`} type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} />
            </label>
            <br />
          </div>

        </div>
        <button className='btn btn-success bi bi-plus-circle clientes' type="submit">{editingId ? 'Actualizar Cliente' : 'Crear Cliente'}</button>
      </form>
      <br />
      <button className='btn btn-success bi bi-plus-circle' onClick={handleToggleModal} style={{ marginLeft: '5%' }}>Ver Clientes cargados</button>
      {modalVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
          <div className='modalproductos' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px' }}>
            <button className='btn btn-danger bi bi-x-circle cerrar' style={{ marginLeft: '70%', marginRight: '2%' }} onClick={handleCerrarModal}>Cerrar</button>
            <table className='table table-striped-columns'>
              <thead>
                <tr>
                  <th>Número de Orden</th>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Cedula</th>
                  <th>RUC</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map((proveedor, index) => (
                  <tr key={proveedor._id}>
                    <td>{index + 1}</td>
                    <td>{proveedor.nombre}</td>
                    <td>{proveedor.direccion}</td>
                    <td>{proveedor.telefono}</td>
                    <td>{proveedor.cedula}</td>
                    <td>{proveedor.ruc}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDelete(proveedor._id)}>Eliminar</button>
                      <button className="btn btn-success" onClick={() => handleEdit(proveedor._id)}>Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default Clientes;