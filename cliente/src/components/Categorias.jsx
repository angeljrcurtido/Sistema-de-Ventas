import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import { useNavigate } from "react-router-dom";

const Categorias = () => {
  const [name, setName] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [mensajeError, setMensajeError] = useState('');
  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const navigate = useNavigate();

 

  useEffect(() => {
    obtenerCategorias();
  }, []);

  useEffect(() => {
    if (categoriaEditada) {
      setName(categoriaEditada.name);
    }
  }, [categoriaEditada]);

  const obtenerCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:8000/categories');
      setCategorias(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verificar si la categoría ya existe
    const categoriaExistente = categorias.some((categoria) =>
      categoria.name.toLowerCase() === name.toLowerCase()
    );
    if (categoriaExistente) {
      setMensajeError('¡La categoría ya existe!');
      setTimeout(() => {
        setMensajeError('');
      }, 1000);
      return;
    }

    if (categoriaEditada) {
      await axios.put(`http://localhost:8000/categories/${categoriaEditada._id}`, {
        name
      })
        .then(response => {
          console.log("Categoría editada correctamente");
          alert("Categoría editada correctamente");
          setCategoriaEditada(null); // Reiniciar la categoría editada
          setName(''); // Limpiar el input
          obtenerCategorias(); // Actualizar la lista de categorías después de editar una categoría
        })
        .catch(error => {
          console.log(error);
          console.log("Este es el error");
        });
    } else {
      await axios.post('http://localhost:8000/categories', {
        name
      })
        .then(response => {
          console.log("Categoría creada correctamente");
          alert("Categoría creada correctamente");
          obtenerCategorias(); // Actualizar la lista de categorías después de agregar una nueva
        })
        .catch(error => {
          console.log(error);
          console.log("Este es el error");
        });
    }
  };

  const handleEditar = (categoria) => {
    setCategoriaEditada(categoria);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      await axios.delete(`http://localhost:8000/categories/${id}`)
        .then(response => {
          console.log("Categoría eliminada correctamente");
          alert("Categoría eliminada correctamente");
          obtenerCategorias(); // Actualizar la lista de categorías después de eliminar una categoría
        })
        .catch(error => {
          console.log(error);
          console.log("Este es el error");
        });
    }
  };

  return (
    <div className='cajagrandecategorias'>
      <h2 className='bi bi-bookmarks-fill categorias'>Categorias</h2>
      <form onSubmit={handleSubmit} className='subgrupo3 categorias'>
        <div className="form-group title">
          <label htmlFor="name" className="form-label"><strong>Nombre de la Categoría:</strong></label>
          <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button className='btn btn-success categorias' type="submit">{categoriaEditada ? 'Guardar edición' : 'Crear categoría'}</button>
      </form>
      {mensajeError && <p>{mensajeError}</p>}
      <div className="categorias-list">
        <h3>Categorías Cargadas:</h3>
        <div className='cajadecategorias'>
          <table className="table table-striped-columns categorias">
            <thead>
              <tr>
                <th>N°</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria, index) => (
                <tr key={categoria._id}>
                  <td>{index + 1}</td>
                  <td>{categoria.name}</td>
                  <td>
                    <button className="btn btn-success" onClick={() => handleEditar(categoria)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleEliminar(categoria._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categorias;