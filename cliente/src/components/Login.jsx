import React, { useState } from "react";

import axios from "axios";
import './style.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/login", {
        username: email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('codigo', response.data.codigo);
      alert("token y código guardados en el localStorage");
      console.log(response.data);
      // Redirigir automáticamente utilizando navigate
   
      
    } catch (error) {
      console.error(error);
      alert("Usuario inválido");
    }
  };

  return (
    <div>
      <h2>Inicio de sesión</h2>
      <form onSubmit={handleSubmit} className="form-group login"> 
        <div>
          <label>Usuario:</label>
          <input className="form-control"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-success login" type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;