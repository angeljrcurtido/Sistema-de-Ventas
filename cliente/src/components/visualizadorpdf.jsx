import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Asegúrate de importar jspdf-autotable si lo necesitas
import './style.css';

const Visualizadorpdf = () => {
  const { id } = useParams();
  const pdfRef = useRef(null);

  const generatePDF = () => {
    axios
      .get(`http://localhost:8000/ticket/${id}`)
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
        pdf.text('Factura N°:' + data.facturaNumero + '-' + 'Numero Int:' + data.numeroInt, 5, 20);
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
        const guionesRow = ['____________________','_','_________'];
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1>Imprimir Ticket</h1>
      <button className='btn btn-success'onClick={generatePDF}>Imprimir Ticket</button>
      <div ref={pdfRef}></div>
    </div>
  );
};


export default Visualizadorpdf;


