import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';

const AperturaCaja = () => {
    const [montoInicial, setMontoInicial] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/aperturas-caja', {
                montoInicial,
            });
            console.log('Apertura de caja creada correctamente:', response.data);
            // Restablecer el campo del formulario
           
            setMontoInicial('');
            navigate(`/crearventas`);
        } catch (error) {
            console.error('Error al crear la apertura de caja:', error);
        }
    };

    return (
        <div>

            <form onSubmit={handleSubmit} className="form-container cargarproducto apertura">
                <h2 className=" bi bi-plus-circle-dotted titulodecarga apertura">Apertura de Caja</h2>
                <div className="subgrupo1 cargarpeli">
                    <div className="form-group title">
                        <label>Monto Inicial Gs:</label>
                        
                        <input
                            className='form-control'
                            type="text"
                            value={montoInicial.toLocaleString('es')}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Remueve los caracteres no numéricos
                                setMontoInicial(Number(value));
                            }}
                        />

                        <button className='btn btn-success mt-3 mb-3' type="submit">Crear Apertura de Caja</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AperturaCaja;