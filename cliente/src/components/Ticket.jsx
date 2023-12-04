import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Asegúrate de importar jspdf-autotable si lo necesitas


const Ticket = () => {
  const { id } = useParams();
  const buttonRef = useRef(null);
  const [datosFactura, setDatosFactura] = useState({});

  const [ticketId, setTicketId] = useState('');
  const navigate = useNavigate()
  const pdfRef = useRef(null);

 
  useEffect(() => {
    buttonRef.current.focus();
    axios
      .get(`http://localhost:8000/ventas/${id}`)
      .then((res) => {
        console.log(res);
        const { cliente,ruccliente,cantidad, descripcion, subtotal, total, iva10, fecha, facturaNumero, numeroInterno,iva5, TotalIva10, TotalIva5, TotalIva } = res.data;
        const productos = descripcion.map((desc, index) => ({
          nombre: desc,
          cantidad: cantidad[index],
          precio: subtotal[index] / cantidad[index],
          subtotal: subtotal[index],
          iva10: iva10[index],
          iva5: iva5[index]
          
        }));
        setTicketData((prevData) => ({
          ...prevData,
          cliente: cliente,
          ruccliente:ruccliente,
          productos: productos,
          total: total,
          fecha: new Date().toLocaleString('es-ES'),
          facturaNumero: facturaNumero,
          numeroInterno: numeroInterno,
          TotalIva10: TotalIva10,
          TotalIva5: TotalIva5,
          TotalIva: TotalIva,
        }));
        console.log("Datos cargados correctamente:", ticketData);
      })
      .catch((err) => {
        console.log(err);
      });
      
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/ultimoregistrodatosfactura')
      .then(response => {
        setDatosFactura(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const [ticketData, setTicketData] = useState({
   
    fecha: '',
    hora: '',
    cliente: '',
    ruccliente: '',
    productos: [],
    total: 0,
    TotalIva10: 0,
    TotalIva5: 0,
    TotalIva: 0,
    facturaNumero: '',
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
      .post('http://localhost:8000/crear-ticket', {
        numeroInt: ticketData.numeroInterno,
        facturaNumero: ticketData.facturaNumero,
        fechaActual: ticketData.fecha,
        cliente: ticketData.cliente,
        ruccliente: ticketData.ruccliente,
        cantidad: ticketData.productos.map((producto) => producto.cantidad),
        producto: ticketData.productos.map((producto) => producto.nombre),
        subtotal: ticketData.productos.map((producto) => producto.subtotal),
        iva10: ticketData.productos.map((producto) => producto.iva10),
        iva5: ticketData.productos.map((producto) => producto.iva5),
        totalPagar: ticketData.total,
        TotalIva10: ticketData.TotalIva10,
        TotalIva5: ticketData.TotalIva5,
        TotalIva:ticketData.TotalIva,
        empresa: datosFactura.empresa,
        ruc: datosFactura.ruc,
        direccion: datosFactura.direccion,
        negocio: datosFactura.negocio,
        validoDesde: datosFactura.validoDesde,
        validoHasta: datosFactura.validoHasta,
        timbradoNumero: datosFactura.timbradoNumero,
      })
      .then((response) => {
        console.log(response.data.ticketId);
        setTicketId(response.data.ticketId); // Guarda la ID de la venta
        // Realizar acciones adicionales si es necesario
        //navigate(`/pdf/${response.data.ticketId}`); // Redirige a la página del ticket utilizando useNavigation
      })
      .catch((error) => {
        console.log(error);
        // Manejar el error si es necesario
      });
    setTicketData({
      fecha: '',
      hora: '',
      cliente: '',
      ruccliente: '',
      productos: [],
      total: 0,
      TotalIva10:0,
      TotalIva5:0,
      TotalIva:0,
    });
  };



  const generatePDF = () => {
    axios
      .get(`http://localhost:8000/ticketfactura/${ticketId}`)
      .then((res) => {
        const data = res.data;
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [50, 100], // Tamaño de papel de 50x50 mm
        });

        // Ajustar el tamaño de fuente
        pdf.setFontSize(5); // Ajusta el tamaño de fuente según tus necesidades

        // Establecer el color de fondo de la página en blanco
        pdf.setFillColor(255, 255, 255); // Blanco en RGB
        pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height, 'F'); // Rellena toda la página en blanco


        // Agregar contenido al PDF
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold'); // Establece el estilo de fuente negrita
        pdf.text(data.empresa, 10, 5);
        pdf.setFontSize(12); // Establece el tamaño de fuente para "negocio"
        pdf.setFont('helvetica', 'bold');// Establece el estilo de fuente negrita
        pdf.text(data.negocio, 10, 10);
        pdf.setFontSize(5); // Establece el tamaño de fuente predeterminado 
        pdf.setFont('helvetica', 'normal'); // Establece el estilo de fuente negrita
        pdf.text(data.direccion, 15, 14);
        pdf.text('Cliente: ' + data.cliente, 5, 17);
        pdf.text('Ruc Cliente: ' + data.ruccliente, 5, 19);
        pdf.text('Factura N°:' + data.facturaNumero + '-' + 'Numero Int:' + data.numeroInt, 5, 21);
        pdf.text('Valido Desde:' + data.validoDesde, 5, 23);
        pdf.text('Valido Hasta:' + data.validoHasta, 5, 26);
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

        rows.push(['Iva 5%', '', data.TotalIva5]); // Iva 5%
        rows.push(['Iva 10%', '', data.TotalIva10]); // Iva 10%
        rows.push(['Total Iva', '', data.TotalIva]); // Total Iva
        rows.push(['Total a Pagar', '', data.totalPagar]); // Total a Pagar


        pdf.autoTable({
          head: [columns],
          body: rows,
          startY: 30, // Ajusta la posición de inicio de la tabla
          tableWidth: 'auto', // Ajusta el ancho de la tabla
          theme: 'plain',
          pageBreak: 'auto',
          headStyles: {
            fontSize: 5, // Tamaño de fuente para los rótulos de la tabla
            fillColor: [255, 255, 255], // Establece el color de fondo del encabezado a blanco
            textColor: [0, 0, 0], // Establece el color de texto del encabezado a negro
            fontStyle: 'bold', // Establece el estilo de fuente en negrita
            borderBottomStyle: 'solid', // Establece el estilo del borde inferior
            borderBottomWidth: 1, // Establece el ancho del borde inferior a 1
            borderBottomColor: [0, 0, 0], // Establece el color del borde inferior a negro

          },
          styles: {
            fontSize: 5, // Tamaño de fuente para el contenido de la tabla
            fillColor: [255, 255, 255], // Establece el color de fondo del contenido a blanco
            textColor: [0, 0, 0], // Establece el color de texto del contenido a negro

          },
          margin: { left: 3, right: 3 }, // Ajusta los márgenes según tus necesidades
        });

        // Agregar los mensajes después de la tabla
        pdf.text(data.mensaje, 10, pdf.autoTable.previous.finalY + 10); // Ajusta la posición y el espaciado según tus necesidades
        pdf.text(data.mensajeDos, 0, pdf.autoTable.previous.finalY + 14); // Ajusta la posición y el espaciado según tus necesidades

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
      <h1>Imprimir Factura</h1>

      <form onSubmit={handleSubmit} onKeyPress={generatePDF}>

        <br />
        <button
        ref={buttonRef}
        className='btn btn-success'
        href="/pdf"
        target="_blank"
        type="submit"
      >
        Crear Factura
      </button>

      </form>
    </div>
  );
};

export default Ticket;