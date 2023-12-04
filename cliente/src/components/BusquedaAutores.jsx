import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BusquedaAutores = ({ closeModal, setAutor }) => {
  const [autores, setAutores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    axios
      .get("https://node-mongo-api4.onrender.com/autores")
      .then((response) => {
        setAutores(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  const handleBusqueda = (event) => {
    setBusqueda(event.target.value);
  };
  
  const handleSeleccionarFila = (autor) => {
    setFilaSeleccionada(autor.id);
    setBusqueda(autor.nombre);
    setAutor(autor.nombre);
    closeModal();
  };
  
  const autoresFiltrados = autores.filter((autor) =>
    autor.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  
  return (
    <div>
      <h2>Autores</h2>
      <input
        type="text"
        placeholder="Buscar autor..."
        value={busqueda}
        onChange={handleBusqueda}
      />
      <table className="table-bordered subcategorias autores">
        <thead>
          <tr>
            <th>N°</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {autoresFiltrados.map((autor, index) => (
            <tr key={autor.id} onClick={() => handleSeleccionarFila(autor)}>
              <td>{index + 1}</td>
              <td>{autor.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusquedaAutores;