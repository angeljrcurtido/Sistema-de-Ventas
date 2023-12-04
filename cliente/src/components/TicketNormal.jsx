import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Asegúrate de importar jspdf-autotable si lo necesitas


const TicketNormal = () => {
  const { id } = useParams();
  const buttonRef = useRef(null);

  const [ticketId, setTicketId] = useState('');
  const navigate = useNavigate()
  const pdfRef = useRef(null);
  useEffect(() => {
    buttonRef.current.focus();
    axios
      .get(`http://localhost:8000/ventas/${id}`)
      .then((res) => {
        console.log(res);
        const { cliente, cantidad, descripcion, subtotal, total, iva10, fecha, numeroInterno } = res.data;
        const productos = descripcion.map((desc, index) => ({
          nombre: desc,
          cantidad: cantidad[index],
          precio: subtotal[index] / cantidad[index],
          subtotal: subtotal[index],
        }));
        setTicketData((prevData) => ({
          ...prevData,
          cliente: cliente,
          productos: productos,
          total: total,
          iva10: iva10,
          fecha:fecha,
          numeroInterno: numeroInterno,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
      
  }, []);

  const [ticketData, setTicketData] = useState({
    empresa: 'Supermercado Estrella',
    direccion: 'Calle Principal 123',
    fecha: '',
    hora: '',
    cliente: '',
    productos: [],
    total: 0,
    iva10: 0,
    numeroInterno: 0,
  });

  const handleTicketDataChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(ticketData);
    axios
      .post('http://localhost:8000/crear-ticketnormal', {
        numeroInt: ticketData.numeroInterno,
        fechaActual: ticketData.fecha,
        cliente: ticketData.cliente,
        cantidad: ticketData.productos.map((producto) => producto.cantidad),
        producto: ticketData.productos.map((producto) => producto.nombre),
        subtotal: ticketData.productos.map((producto) => producto.subtotal),
        totalPagar: ticketData.total,
        totalIva10: ticketData.iva10,
      })
      .then((response) => {
        console.log(response.data.ticketNormalId);
        setTicketId(response.data.ticketNormalId); // Guarda la ID de la venta
        // Realizar acciones adicionales si es necesario
        //navigate(`/pdf/${response.data.ticketId}`); // Redirige a la página del ticket utilizando useNavigation
      })
      .catch((error) => {
        console.log(error);
        console.log("por aqui viene el error")
        // Manejar el error si es necesario
      });
    setTicketData({
      empresa: 'Supermercado ABC',
      direccion: 'Calle Principal 123',
      fecha: '',
      hora: '',
      cliente: '',
      productos: [],
      total: 0,
      iva10: 0,
    });
  };



  const generatePDF = () => {
    axios
      .get(`http://localhost:8000/ticketnormal/${ticketId}`)
      .then((res) => {
        const data = res.data;
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [72, 100], // Tamaño de papel de 50x50 mm
        });

        // Ajustar el tamaño de fuente
        pdf.setFontSize(7); // Ajusta el tamaño de fuente según tus necesidades

        // Establecer el color de fondo de la página en blanco
        pdf.setFillColor(255, 255, 255); // Blanco en RGB
        pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height, 'F'); // Rellena toda la página en blanco


        // Agregar contenido al PDF
        pdf.setFontSize(15);
        pdf.setFont('helvetica', 'bold'); // Establece el estilo de fuente negrita
        pdf.text("LIBRERIA Y PAPELERÍA ", 5, 5);
        pdf.setFontSize(15);
        pdf.setFont('helvetica', 'bold'); // Establece el estilo de fuente negrita
        pdf.text('        UNIVERSITARIA', 5, 10);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold'); // Establece el estilo de fuente negrita
        pdf.text('                   RUC: 5488713-5', 5, 14);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold'); // Establece el estilo de fuente negrita
        pdf.text('       Mcal.Estigarribia Esq/Cerro León', 5, 17);
     
        pdf.setFontSize(8); // Establece el tamaño de fuente predeterminado 
        pdf.setFont('helvetica', 'bold'); // Establece el estilo de fuente negrita
        pdf.text("                Cel:0985-380978", 15, 20);
        pdf.text('Cliente: ' + data.cliente, 5, 23);
        pdf.text('Numero Int:' + data.numeroInt, 5, 26);
        pdf.text('Fecha:' + data.fechaActual, 5, 29);
        pdf.text('___________________________________________', 5, 29);


        // Agregar más contenido según tus necesidades

        // Crear la tabla manualmente
        const columns = ['Prod', 'Cant', 'Subtotal'];
        const rows = data.producto.map((item, index) => [
          item,
          data.cantidad[index],
          data.subtotal[index],
        ]);

        // Agregar fila de guiones
        const guionesRow = ['____________________', '_', '_________'];
        rows.push(guionesRow);

        // Agregar filas adicionales al final de la tabla

        rows.push(['Iva 10%', '', data.totalIva10]); // Iva 10%
        rows.push(['Total a Pagar', '', data.totalPagar]); // Total a Pagar


        pdf.autoTable({
          head: [columns],
          body: rows,
          startY: 30, // Ajusta la posición de inicio de la tabla
          tableWidth: 'auto', // Ajusta el ancho de la tabla
          theme: 'plain',
          pageBreak: 'auto',
          headStyles: {
            fontSize: 9, // Tamaño de fuente para los rótulos de la tabla
            fillColor: [255, 255, 255], // Establece el color de fondo del encabezado a blanco
            textColor: [0, 0, 0], // Establece el color de texto del encabezado a negro
            fontStyle: 'bold', // Establece el estilo de fuente en negrita
            borderBottomStyle: 'solid', // Establece el estilo del borde inferior
            borderBottomWidth: 1, // Establece el ancho del borde inferior a 1
            borderBottomColor: [0, 0, 0], // Establece el color del borde inferior a negro

          },
          styles: {
            fontSize: 8, // Tamaño de fuente para el contenido de la tabla
            fillColor: [255, 255, 255], // Establece el color de fondo del contenido a blanco
            textColor: [0, 0, 0], // Establece el color de texto del contenido a negro
            fontStyle: 'bold', // Establece el estilo de fuente en negrita
          },
          margin: { left: 3, right: 3 }, // Ajusta los márgenes según tus necesidades
        });

        // Agregar los mensajes después de la tabla
        pdf.setFontSize(10); 
        pdf.text("            "+data.mensaje, 10,73); // Ajusta la posición y el espaciado según tus necesidades
        pdf.text(data.mensajeDos, 0,80); // Ajusta la posición y el espaciado según tus necesidades

        // Imprimir el PDF automáticamente
        pdf.autoPrint();
        pdf.output('dataurlnewwindow');
        navigate(`/crearventas`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  



  return (
    <div>
      <h1>Imprimir Ticket</h1>

      <form onSubmit={handleSubmit} onKeyPress={generatePDF}>

        <br />
        <button
        ref={buttonRef}
        className='btn btn-success'
        href="/pdf"
        target="_blank"
        type="submit"
      >
        Crear Ticket
      </button>

      </form>
    </div>
  );
};

export default TicketNormal;