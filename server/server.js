const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { exec } = require('child_process');
const moment = require('moment');
require('dotenv').config();
const app = express();


const PORT = process.env.PORT || 8000;

// Agregar CORS a la aplicación
app.use(cors({
  credentials: true,
  origin: '*'
}));


// INICIO DE ESQUEMA DE CATEGORIAS
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Category = mongoose.model('Category', categorySchema);

// FIN DE ESQUEMA DE CATEGORIAS

//INICIO ESQUEMA APERTURA DE CAJA

const aperturaCajaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    default: Date.now, // Establece la fecha actual como valor predeterminado
    required: true,
  },
  montoInicial: {
    type: Number,
    required: true,
  },
});

const AperturaCaja = mongoose.model('AperturaCaja', aperturaCajaSchema);

//FIN ESQUEMA DE APERTURA DE CAJA

//INICIO ESQUEMA DE PROVEEDORES
const proveedorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  ruc: {
    type: String,
    required: true
  }
});

const Proveedor = mongoose.model('Proveedor', proveedorSchema);

module.exports = Proveedor;
//FIN DE ESQUEMA DE PROVEEDORES

//INICIO DE ESQUEMA DE CLIENTES

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  cedula: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  ruc: {
    type: String,
    required: true
  }
});

const Cliente = mongoose.model('Cliente', clienteSchema);

//FIN DE ESQUEMA DE CLIENTES

//INICIO ESQUEMA CIERRE DE CAJA

const cierreCajaSchema = new mongoose.Schema({
  ingresos: {
    type: Number,
    required: true,
  },
  gastos: {
    type: Number,
    required: true,
  },
  saldo: {
    type: Number,
    required: true,
  },
  dineroEnCaja: {
    type: Number,
    required: true,
  },
  diferencia: {
    type: Number,
    required: false,
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

const CierreCaja = mongoose.model('CierreCaja', cierreCajaSchema);

//FIN ESQUEMA CIERRE DE CAJA

// INICIO ESQUEMA DE FACTURA
const ticketSchema = new mongoose.Schema({
  empresa: {
    type: String,
    default: "Empresa Fulano"
  },
  ruc: {
    type: String,
    default: "55555-5"
  },
  direccion: {
    type: String,
    default: "San Juan Nepomuceno"
  },
  factura: String,
  negocio: {
    type: String,
    default: "Medico"
  },
  numeroInt: Number,
  timbradoNumero: String,
  validoDesde: {
    type: String,
    default: "31/09/2023"
  },
  validoHasta: {
    type: String,
    default: "31/09/2024"
  },
  facturaNumero: String,
  fechaActual: {
    type: String,
    default: moment().format('DD-MM-YYYY'), // Formatear la fecha actual en "dd-mm-año",
  },
  cliente: String,
  ruccliente: String,
  cantidad: [Number],
  producto: [String],
  subtotal: [Number],
  iva10: [Number],
  iva5: [Number],
  Estado: {
    type: String,
    default:"Activo"
  },
  TotalIva10: Number,
  TotalIva5: Number,
  TotalIva: Number,
  totalPagar: Number,
  descuento:Number,
  mensaje: {
    type: String,
    default: "¡Gracias, lo esperamos siempre!"
  },
  mensajeDos: {
    type: String,
    default: "VERIFIQUE SU VUELTO, NO SE ACEPTAN DEVOLUCIONES NI RECLAMOS POSTERIORES"
  }
});
const Ticket = mongoose.model('Ticket', ticketSchema);
// FIN ESQUEMA DE FACTURA LEGAL

//INICIO DE ESQUEMA DEL NUMERO DE LA FACTURA 

const numeroFacturaSchema = new mongoose.Schema({
  facturaNumero: {
    type: String,
    default: '0000001', // Valor inicial para la primera factura
  },
});

const NumeroFactura = mongoose.model('NumeroFactura', numeroFacturaSchema);

module.exports = NumeroFactura;

//FIN DEL ESQUEMA DEL NUMERO DE LA FACTURA

//INICIO ESQUEMA DE DATOS DE FACTURA LEGAL
const DatosFacturaSchema = new mongoose.Schema({
  timbradoNumero: {
    type: String,

  },
  empresa: {
    type: String,

  },
  ruc: {
    type: String,

  },
  direccion: {
    type: String,

  },
  negocio: {
    type: String,

  },
  validoDesde: {
    type: String,

  },
  impresion: {
    type: String,
  },
  validoHasta: {
    type: String,

  },
  numeroCaja: {
    type: String,
  },
  numeroSucursal: {
    type: String,
  },
  facturaNumero: {
    type: String,
  },
  fecha: {
    type: String,
    default: moment().format('DD-MM-YYYY'), // Formatear la fecha actual en "dd-mm-año"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DatosFactura = mongoose.model('DatosFactura', DatosFacturaSchema);



// INICIO ESQUEMA DE TICKET 
const ticketnormalSchema = new mongoose.Schema({
  empresa: {
    type: String,
    default: " "
  },
  negocio: {
    type: String,

  },
  ruc: {
    type: Number,
    default: "0000"
  },
  direccion: {
    type: String,
    default: ""
  },
  Estado: {
    type: String,
    default:"Activo"
  },
  fechaActual: {
    type: String,
  },
  numeroInt: Number,
  timbradoNumero: Number,
  cliente: String,
  cantidad: [Number],
  producto: [String],
  subtotal: [Number],
  totalPagar: Number,
  descuento:Number,
  totalIva10: Number,
  mensaje: {
    type: String,
    default: "¡Gracias, vuelva pronto!"
  },
  mensajeDos: {
    type: String,
    default: "VERIFIQUE SU VUELTO \n NO SE ACEPTAN DEVOLUCIONES \n NI RECLAMOS POSTERIORES",
    style: "text-align: center"
  }
});
const TicketNormal = mongoose.model('TicketNormal', ticketnormalSchema);
// FIN ESQUEMA DE TICKETS

// INICIO DE ESQUEMA DE USUARIOS
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  codigo: { 
    type: mongoose.Schema.Types.ObjectId, // Campo para el ID automático 
    default: mongoose.Types.ObjectId // Generar automáticamente un ID único 
  },
  password: {
    type: String,
    required: true
  },
  permitidos: {
   type: [String]
  } ,
});
// FIN DE ESQUEMA DE USUARIOS
const User = mongoose.model('User',userSchema)

//INICIO ESQUEMA DE COMPRAS

const comprasSchema = new mongoose.Schema({
  proveedor: String,
  ruc: String, // Campo para el RUC del proveedor
  direccionProveedor: String, // Campo para la dirección del proveedor
  fechaCompra: {
    type: String,
    default: moment().format('DD-MM-YYYY'), // Formatear la fecha actual en "dd-mm-año"
  },
  facturaNumero: String, // Campo para el número de factura
  productos: [
    {
      codigo: String,
      cantidad: Number,
      precioCompra: Number,
    },
  ],
  precioTotalCompra: Number, // Nuevo campo para almacenar el total de la compra
});

const Compra = mongoose.model('Compra', comprasSchema);


//FIN ESQUEMA DE COMPRAS
// INICIO ESQUEMA DE VENTAS
const ventasSchema = new mongoose.Schema({
  numeroInterno: {
    type: Number,
    required: true,
    unique: true,
    default: 1,
  },
  facturaNumero: {
    type: String,
    unique: false,
    default: '',
  },

  cliente: String,
  ruccliente: String,
  descuento: Number,
  tipodecomprobante: String,
  vendedor: String,
  direccion: String,
  condicionventa: String,
  codigo: [String],
  cantidad: [Number],
  descripcion: [String],
  preciocompra: [Number],
  preciounitario: [Number],
  subtotal: [Number],
  iva10: [Number],
  iva5: [Number],
  TotalIva10: Number,
  TotalIva5: Number,
  TotalIva: Number,
  totalgastos: Number,
  total: Number,
  fecha: {
    type: String,
    default: moment().format('DD-MM-YYYY'), // Formatear la fecha actual en "dd-mm-año"
  },
});

const Venta = mongoose.model('Venta', ventasSchema);// Agrega esta línea para crear el modelo de ventas
app.use(bodyParser.json());
// FIN DE ESQUEMA DE VENTAS

// INICIA ESQUEMA DE PRODUCTOS
const ProductoSchema = new mongoose.Schema({
  codigo: String,
  lotenumero: Number,
  categoria: String,
  producto: String,
  fechadevencimiento: String,
  descripcion: String,
  imagen: String,
  preciocompra: Number,
  precioventa: Number,
  stock: Number,
  stockminimo: Number,
  iva: Number,
  iva10: Number,
  iva5: Number,
});

const Producto = mongoose.model('Producto', ProductoSchema);

app.use(bodyParser.json());
//FIN DE ESQUEMA DE PRODUCTOS


//INICIA SECCIÓN DE USUARIOS Y LOGIN:


app.get('/facturaumentar2', async (req, res) => {
  try {
    // Obtener el documento de NumeroFactura
    const numeroFactura = await NumeroFactura.findOne();

    if (numeroFactura) {
      const ultimoNumero = parseInt(numeroFactura.facturaNumero);
      const facturaNumero = (ultimoNumero + 1).toString().padStart(7, '0'); // Incrementar el número y formatearlo
      numeroFactura.facturaNumero = facturaNumero;
    } else {
      // Si no existe un documento de NumeroFactura, crear uno nuevo con valor inicial 1
      const nuevoNumeroFactura = new NumeroFactura();
      nuevoNumeroFactura.facturaNumero = '0000001';
      await nuevoNumeroFactura.save();
    }

    // Guardar el documento actualizado o creado
    await numeroFactura.save();

    res.status(200).json({ success: true, facturaNumero: numeroFactura.facturaNumero });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//Crear una nueva factura nueva

app.patch('/facturanuevo', async (req, res) => {
  try {
    const nuevoNumeroFactura = await NumeroFactura.findOneAndUpdate({}, { facturaNumero: req.body.facturaNumero }, { new: true });

    res.status(200).json({ success: true, facturaNumero: nuevoNumeroFactura.facturaNumero });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//Ruta para poder estirar el ultimo registro
app.get('/ultimoregistrofactura', async (req, res) => {
  try {
    // Ordenar los registros de forma descendente y obtener el primer documento
    const ultimaFactura = await NumeroFactura.findOne().sort({ _id: -1 });

    if (!ultimaFactura) {
      return res.status(404).json({ mensaje: 'No se encontraron facturas' });
    }

    res.json(ultimaFactura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener la última factura' });
  }
})

// Ruta para el registro de usuarios
app.post('/register', async (req, res) => {
  try {
    const { username, email, password, permitidos } = req.body;
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crear un nuevo usuario utilizando el modelo
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      permitidos: permitidos, // Modificar aquí según la estructura de tu nuevo esquema
    });
    // Guardar el usuario en la base de datos
    await newUser.save();
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

//PARA LLAMAR SOLO AL ATRIBUTO PERMITIDOS
app.get('/solopermitidos/:codigo/permitidos', async (req, res) => {
  try {
    const { codigo } = req.params; // Obtener el código del usuario desde los parámetros de la ruta

    // Encontrar el usuario y obtener solo los permitidos
    const user = await User.findOne({ codigo });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const permitidos = user.permitidos;

    res.status(200).json({ permitidos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

//EDITAR USUARIO CARGADO
app.put('/editarusuario/:id', async (req, res) => { 
  try {
    const { id } = req.params;
    const { username, email, password, permitidos } = req.body;

    // Verificar si el usuario existe en la base de datos
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar los datos del usuario
    existingUser.username = username;
    existingUser.email = email;
    existingUser.permitidos = permitidos;

    // Verificar si se proporcionó una nueva contraseña
    if (password) {
      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
    }

    // Guardar los cambios en la base de datos
    await existingUser.save();

    res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
 });


 //ELIMINAR USUARIOS POR EL ID
 app.delete('/eliminarusuario/:id', async (req, res) => { 
  try {
    const { id } = req.params;

    // Verificar si el usuario existe en la base de datos
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Eliminar el usuario de la base de datos
    await existingUser.remove();

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
 });

 //VISUALIZAR TODOS LOS USUARIOS CARGADOS
 app.get('/todoslosusuarios', async (req, res) => { 
  try {
    // Obtener todos los usuarios de la base de datos
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
 });
 //VIZUALIZAR SOLO LOS USUARIOS CON ID : 
 app.get('/usuariosporid/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    // Obtener el usuario de la base de datos por su ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


// RUTA PARA EL INICIO DE USUARIOS Y MANEJO 
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificar si el usuario existe en la base de datos
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar el token de autenticación
    const token = jwt.sign({ userId: user._id }, "secretKey", { expiresIn: "1h" });

    // Enviar el token al cliente
    res.status(200).json({ token, codigo: user.codigo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});


//INICIO CONTROLLER DE DATOS DE FACTURA 
//CONTROLLER DE CREAR DATOS DE FACTURA
app.post('/datosfactura', async (req, res) => {
  try {
    const nuevoDatoFactura = new DatosFactura(req.body);
    await nuevoDatoFactura.save();
    res.status(201).json({ mensaje: 'Dato de factura creado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el dato de factura', error });
  }
});

//FIN CONTROLLER PARA CREAR DATOS FACTURA


//INICIO CONTROLLER PARA SOLICITAR DATOS DE DATOSFACTURA

app.get('/datosfactura', async (req, res) => {
  try {
    const datosFactura = await DatosFactura.find();
    res.status(200).json(datosFactura);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los datos de factura', error });
  }
});

//FIN DE CONTROLLER PARA SOLICITAR DATOS DE DATOSFACTURA

//INICIO DE CONTROLLER PARA AUMENTAR LA FACTURA NUMERO AUTOMATICAMENTE EN +1
app.get('/facturaumentar', async (req, res) => {
  try {
    // Obtener el último registro de facturaNumero
    const ultimoRegistro = await DatosFactura.findOne({}, {}, { sort: { facturaNumero: -1 } });
    let facturaNumero = '0000001'; // Valor inicial para la primera factura

    if (ultimoRegistro) {
      const ultimoNumero = parseInt(ultimoRegistro.facturaNumero);
      facturaNumero = (ultimoNumero + 1).toString().padStart(7, '0'); // Incrementar el número y formatearlo
    }

    res.status(200).json({ success: true, facturaNumero: facturaNumero });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// FIN DE CONTROLLER PARA AUMENTAR LA FACTURA NUMERO AUTOMATICAMENTE EN +1

//INICIO DE CONTROLLER PARA REALIZAR GET DE UN SOLO DATOFACTURA POR EL ID

app.get('/datosfactura/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const datoFactura = await DatosFactura.findById(id);
    if (!datoFactura) {
      return res.status(404).json({ mensaje: 'Dato de factura no encontrado' });
    }
    res.status(200).json(datoFactura);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el dato de factura', error });
  }
});

//FIN DE CONTROLLER PARA REALIZAR GET DE UN SOLO DATOFACTURA POR EL ID

//INICIO DE CONTROLLER PARA LLAMAR AL ULTIMO REGISTRO CARGADO EN DATOSFACTURA
app.get('/ultimoregistrodatosfactura', async (req, res) => {
  try {
    const ultimoRegistro = await DatosFactura.findOne({}, {}, { sort: { 'createdAt': -1 } });
    res.status(200).json(ultimoRegistro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el último registro de datos de factura', error });
  }
});
//FIN DE CONTROLLER PARA LLAMAR AL ULTIMO REGISTRO CARGADO EN DATOSFACTURA

//INICIO CONTROLLADOR Y RUTA DE COMPRAS

// Ruta para crear una compra con varios productos
app.post('/compras', async (req, res) => {
  try {
    const { proveedor, ruc, facturaNumero, direccionProveedor, fechaCompra, productos } = req.body;

    let totalCompra = 0;

    for (const productoCompra of productos) {
      const { codigo, cantidad, precioCompra } = productoCompra;

      const producto = await Producto.findOne({ codigo });
      if (!producto) {
        return res.status(404).json({ message: `Producto con código ${codigo} no encontrado` });
      }

      producto.stock += cantidad;


      await producto.save();

      const subtotalProducto = precioCompra * cantidad;
      totalCompra += subtotalProducto;
    }

    const compra = new Compra({
      proveedor,
      ruc, // Agrega el RUC a la compra
      direccionProveedor, // Agrega la dirección del proveedor a la compra
      fechaCompra, // Agrega la fecha de compra a la compra
      facturaNumero,
      productos,
      precioTotalCompra: totalCompra,
    });

    await compra.save();

    res.status(201).json({ compraId: compra._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Ruta para anular una compra
app.delete('/compras/:id', async (req, res) => {
  try {
    const compraId = req.params.id;
    const compra = await Compra.findById(compraId);
    if (!compra) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }
    for (const productoCompra of compra.productos) {
      const { codigo, cantidad, precioCompra } = productoCompra;
      const producto = await Producto.findOne({ codigo });
      if (!producto) {
        return res.status(404).json({ message: `Producto con código ${codigo} no encontrado` });
      }
      producto.stock -= cantidad;
      await producto.save();
    }
    await Compra.findByIdAndDelete(compraId);
    res.status(200).json({ message: 'Compra anulada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener todas las compras
app.get('/compras', async (req, res) => {
  try {
    const compras = await Compra.find();
    res.status(200).json(compras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener una compra por su ID
app.get('/compras/:id', async (req, res) => {
  try {
    const compraId = req.params.id;
    const compra = await Compra.findById(compraId);
    if (!compra) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }
    res.status(200).json(compra);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener todas las compras solo por fechas
app.get('/comprasfechas', async (req, res) => {
  try {
    const compras = await Compra.find({}, { fechaCompra: 1, precioTotalCompra: 1 });
    res.status(200).json(compras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener el total de compras por mes
app.get('/compraspormesfechas', async (req, res) => {
  try {
    const compras = await Compra.aggregate([
      {
        $match: {
          fechaCompra: { $ne: "" } // Filtrar documentos con fecha no vacía
        }
      },
      {
        $addFields: {
          fechaCompra: {
            $dateFromString: {
              dateString: "$fechaCompra",
              format: "%Y-%m-%d" // Ajustar el formato de fecha aquí
            }
          }
        }
      },
      {
        $group: {
          _id: { $month: "$fechaCompra" },
          totalcantidadcompras: { $sum: 1 } // Contar la cantidad de documentos
        }
      },
      {
        $project: {
          mes: "$_id",
          totalcantidadcompras: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(compras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//FIN DE CONTROLLADOR Y RUTA DE COMPRAS

//INICIO DE CONTROLLER PARA PROVEEDORES
// Ruta para crear un proveedor
app.post('/proveedores', async (req, res) => {
  try {
    const proveedor = new Proveedor(req.body);
    await proveedor.save();
    res.status(201).send(proveedor);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Ruta para eliminar un proveedor por ID
app.delete('/proveedores/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findByIdAndDelete(req.params.id);
    if (!proveedor) {
      res.status(404).send();
    }
    res.send(proveedor);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Ruta para actualizar un proveedor por ID
app.patch('/proveedores/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['nombre', 'direccion', 'telefono', 'ruc'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const proveedor = await Proveedor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!proveedor) {
      return res.status(404).send();
    }
    res.send(proveedor);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Ruta para obtener todos los proveedores
app.get('/proveedores', async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.send(proveedores);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Ruta para obtener un proveedor por ID
app.get('/proveedores/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) {
      res.status(404).send();
    }
    res.send(proveedor);
  } catch (error) {
    res.status(500).send(error);
  }
});


//FIN DE CONTROLLER DE PROVEEDORES

//INICIO DE CONTROLLER DE CLIENTE

// Crear nuevo cliente
app.post('/clientes', async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Editar cliente
app.patch('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ver todos los clientes
app.get('/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ver un solo cliente por el id
app.get('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Eliminar cliente por ID
app.delete('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado con éxito' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//FIN DE CONTROLLER DE CLIENTE

// Ruta para crear una venta con varios productos
app.post('/ventas', async (req, res) => {
  try {
    // Obtener los datos de la venta desde el cuerpo de la solicitud
    const { cliente, iva10, iva5, TotalIva10, TotalIva5,TotalIva ,ruccliente, vendedor, direccion, facturaNumero, descuento, condicionventa, productos, tipodecomprobante } = req.body;
    // Obtener el último número interno de venta
    const lastVenta = await Venta.findOne({}, {}, { sort: { numeroInterno: -1 } });
    let numeroInterno = 1;
    if (lastVenta) {
      numeroInterno = lastVenta.numeroInterno + 1;
    }

    let totalVenta = 0;
    let totalGastos = 0; // Agregar variable para calcular el total de gastos
    const ventas = {
      numeroInterno,
      facturaNumero,
      tipodecomprobante,
      descuento,
      iva10: [],
      TotalIva10,
      TotalIva5,
      TotalIva,
      iva5: [],
      cliente,
      ruccliente,
      vendedor,
      direccion,
      condicionventa,
      codigo: [],
      cantidad: [],
      descripcion: [],
      preciocompra: [], // Agregar el arreglo para guardar el precio de compra
      preciounitario: [],
      subtotal: []
    };

    let totalIva10 = 0;
    let totalIva5 = 0;
    // Iterar sobre los productos de la venta
    for (const productoVenta of productos) {
      const { codigo, cantidad, iva10, iva5 } = productoVenta;
      // Buscar el producto en base al código
      const producto = await Producto.findOne({ codigo });
      if (!producto) {
        return res.status(404).json({ message: `Producto con código ${codigo} no encontrado` });
      }
      // Verificar si hay suficiente stock disponible
      if (producto.stock < cantidad) {
        return res.status(400).json({ message: `No hay suficiente stock disponible para el producto con código ${codigo}` });
      }
      // Restar la cantidad de productos vendidos al stock del producto
      producto.stock -= cantidad;
      // Actualizar el precio total de la venta
      const precioUnitario = producto.precioventa;
      const subTotal = precioUnitario * cantidad;
      const precioCompraTotal = producto.preciocompra * cantidad; // Calcular el precio de compra total
      // Agregar los datos del producto a los arreglos correspondientes en la venta
      ventas.codigo.push(codigo);
      ventas.cantidad.push(cantidad);
      ventas.iva10.push(iva10);
      ventas.iva5.push(iva5);
      ventas.descripcion.push(producto.producto); // Utilizar el nombre del producto en lugar de la descripción
      ventas.preciocompra.push(precioCompraTotal); // Agregar el precio de compra total al arreglo
      ventas.preciounitario.push(precioUnitario);
      ventas.subtotal.push(subTotal);

      // Sumar los valores de iva10 y iva5 a las variables totalIva10 y totalIva5
      totalIva10 += iva10;
      totalIva5 += iva5;
      // Asignar los valores de totalIva10 y totalIva5 a los campos correspondientes en ventas
      ventas.TotalIva10 = totalIva10;
      ventas.TotalIva5 = totalIva5;
    
      // Agregar el precio total del producto a la venta
      totalVenta += subTotal;
      totalGastos += precioCompraTotal; // Sumar el precio de compra total a los gastos totales
      // Guardar los cambios en el producto
      await producto.save();
    }

    // Actualizar los campos total de la venta y totalgastos
  // Calcular el valor de TotalIva sumando los valores de TotalIva10 y TotalIva5
    ventas.TotalIva = totalIva10 + totalIva5;
    ventas.total = totalVenta - descuento;
    ventas.totalgastos = totalGastos;

    // Crear la venta en la base de datos
    const venta = new Venta(ventas);
    await venta.save();
    // Devolver el ID de la venta creada como respuesta
    res.status(201).json({ venta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Ruta para anular la venta y sumar devuelta al stock 
app.post('/ventas/anular/:idVenta', async (req, res) => {
  try {
    const idVenta = req.params.idVenta;
    // Buscar la venta en base al ID
    const venta = await Venta.findById(idVenta);
    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    // Iterar sobre los productos de la venta
    for (let i = 0; i < venta.codigo.length; i++) {
      const codigoProducto = venta.codigo[i];
      const cantidadProducto = venta.cantidad[i];
      // Buscar el producto en base al código
      const producto = await Producto.findOne({ codigo: codigoProducto });
      if (!producto) {
        return res.status(404).json({ message: `Producto con código ${codigoProducto} no encontrado` });
      }
      // Sumar la cantidad de productos vendidos al stock del producto
      producto.stock += cantidadProducto;
      // Guardar los cambios en el producto
      await producto.save();
    }
    // Eliminar la venta de la base de datos
    await Venta.findByIdAndDelete(idVenta);
    res.status(200).json({ message: 'Venta anulada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener la ultima venta 
app.get('/ultimaventaregistrada', async (req, res) => {
  try {
    const ultimaVenta = await Venta.findOne().sort({$natural: -1}).limit(1);
    res.status(200).json(ultimaVenta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Ruta para obtener una venta por su ID
app.get('/ventas/:id', async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Ruta para obtener una venta por su ID
app.get('/todasventas', async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//CONTROLLER DE PRODUCTOS VENDIDOS
app.get('/productosvendidos', async (req, res) => {
  try {
    const ventas = await Venta.find();
    const productosVendidos = {};

    ventas.forEach((venta) => {
      venta.codigo.forEach((codigo, index) => {
        const nombreProducto = venta.descripcion[index];
        const cantidad = venta.cantidad[index];
        const precioUnitario = venta.preciounitario[index];

        if (!productosVendidos[nombreProducto]) {
          productosVendidos[nombreProducto] = {
            cantidad: cantidad,
            precioUnitario: precioUnitario
          };
        } else {
          productosVendidos[nombreProducto].cantidad += cantidad;
          productosVendidos[nombreProducto].precioUnitario += precioUnitario;
        }
      });
    });

    res.status(200).json(productosVendidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Controler para saber las ventas por fechas con producto, cantidad, subtotal
app.get('/ventasPorFechadecompra', async (req, res) => {
  try {
    const ventas = await Venta.find(); // Suponiendo que Venta.find() trae todas las ventas de la base de datos

    // Crear un objeto para almacenar las ventas por fecha
    const ventasPorFecha = {};

    // Recorrer todas las ventas y organizarlas por fecha
    ventas.forEach(venta => {
      const fecha = venta.fecha;

      // Comprobar si la fecha ya existe en el objeto de ventasPorFecha
      if (!ventasPorFecha[fecha]) {
        // Si la fecha no existe, se crea un objeto con la estructura necesaria
        ventasPorFecha[fecha] = {
          productos: [],
        };
      }

      // Para cada venta, se agrega la información de productos, cantidades y subtotales
      const productosVenta = {
        descripcion: venta.descripcion,
        codigo: venta.codigo,
        cantidad: venta.cantidad,
        subtotal: venta.subtotal,
      };

      ventasPorFecha[fecha].productos.push(productosVenta);
    });

    res.status(200).json(ventasPorFecha);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Controler para saber las ventas totales del mes 
app.get('/ventastotalporfecha', async (req, res) => {
  try {
    const ventas = await Venta.aggregate([
      {
        $group: {
          _id: { $month: { $toDate: "$fecha" } },
          totalVentas: { $sum: "$total" },
          totalGastos: { $sum: "$totalgastos" }
        }
      },
      {
        $project: {
          _id: 0,
          mes: "$_id",
          ganancia: { $subtract: ["$totalVentas", "$totalGastos"] } // Mostrar solo el campo ganancia
        }
      }
    ]);
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener solo total de ventas
app.get('/ventastotalesdelmes', async (req, res) => {
  try {
    const ventasPorMes = await Venta.aggregate([
      {
        $group: {
          _id: { $month: { $toDate: "$fecha" } },
          total: { $sum: "$total" }
        }
      },
      {
        $project: {
          _id: 0,
          mes: "$_id",
          total: 1
        }
      }
    ]);

    const totalDeTotales = ventasPorMes.reduce((total, venta) => total + venta.total, 0);

    res.status(200).json({ total: totalDeTotales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//Ruta para obtener ventas por fecha
app.get('/todasventasfecha', async (req, res) => {
  try {
    const ventas = await Venta.find({}, { fecha: 1, total: 1, _id: 0 }); // Obtener solo los campos de fecha y total

    res.status(200).json(ventas);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/ventasporfecha', async (req, res) => {
  try {
    const ventas = await Venta.aggregate([
      {
        $group: {
          _id: { $month: { $toDate: "$fecha" } },
          totalVentas: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          mes: "$_id",
          ventas: "$totalVentas"
        }
      }
    ]);

    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//FIN DE SECCION VENTAS

// Crear un producto
app.post('/productos', async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Controller para comparar codigos de productos
app.post('/compararCodigo', async (req, res) => {
  try {
    const codigoCliente = req.body.codigo; // Código enviado desde el cliente
    const productos = await Producto.find(); // Obtener todos los productos

    // Comprobar si el código existe en algún producto
    const codigoExistente = productos.some(producto => producto.codigo === codigoCliente);

    if (codigoExistente) {
      res.status(200).json({ mensaje: 'Código ya existente' });
    } else {
      res.status(200).json({ mensaje: 'Código aún no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Ruta para editar las categorias por id
app.put('/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const categoriaActualizada = await Category.findByIdAndUpdate(id, { name }, { new: true });

    if (!categoriaActualizada) {
      return res.status(404).json({ error: 'No se encontró la categoría' });
    }

    res.json(categoriaActualizada);
  } catch (error) {
    console.error('Error al editar la categoría:', error);
    res.status(500).json({ error: 'Error al editar la categoría' });
  }
});


//INICIO DE CONTROLLER DE FACTURA LEGAL
// Controlador para crear un nuevo ticket
app.post('/crear-ticket', async (req, res) => {
  try {
    // Obtener los datos del ticket desde el cuerpo de la solicitud
    const {
      empresa,
      ruc,
      factura,
      negocio,
      timbradoNumero,
      direccion,
      numeroInt,
      cliente,
      ruccliente,
      facturaNumero,
      fechaActual,
      validoDesde,
      validoHasta,
      cantidad,
      producto,
      subtotal,
      totalPagar,
      descuento,
      TotalIva10,
      TotalIva5,
      iva10,
      iva5,
      TotalIva,
      mensaje,
      mensajeDos
    } = req.body;

    // Utiliza los datos de la última Empresa para crear el Ticket
    const ticket = new Ticket({
      empresa,
      ruc,
      ruccliente,
      direccion,
      factura,
      negocio,
      numeroInt,
      timbradoNumero,
      validoDesde,
      validoHasta,
      facturaNumero,
      fechaActual,
      cliente,
      cantidad,
      producto,
      subtotal,
      totalPagar,
      descuento,
      TotalIva10,
      TotalIva5,
      iva10,
      iva5,
      TotalIva,
      mensaje,
      mensajeDos
    });

    await ticket.save();

    // Devolver el ID del ticket creado como respuesta
    res.status(201).json({ ticketId: ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Controlador para Anular o Activar el estado de una Factura por su ID
app.put('/tickets/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Verificar si el ticket existe en la base de datos
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    // Actualizar el estado del ticket
    ticket.Estado = estado;
    await ticket.save();

    // Devolver el ticket actualizado como respuesta
    res.status(200).json({ ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Fin del controller para anular o activar una factura

// Controlador para Anular o Activar el estado de una Factura por su ID
app.put('/ticketnormal/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Verificar si el ticket existe en la base de datos
    const ticket = await TicketNormal.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    // Actualizar el estado del ticket
    ticket.Estado = estado;
    await ticket.save();

    // Devolver el ticket actualizado como respuesta
    res.status(200).json({ ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Fin del controller para anular o activar una factura

// Controlador para obtener todas las facturas
app.get('/todostickets', async (req, res) => {
  try {
    // Obtener todos los tickets de la base de datos
    const tickets = await Ticket.find();
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Controller para obtener todos los tickets 
// Controlador para obtener todas las facturas
app.get('/todosticketnormal', async (req, res) => {
  try {
    // Obtener todos los tickets de la base de datos
    const tickets = await TicketNormal.find();
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Controlador para obtener un ticket por su ID
app.get('/ticketfactura/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//FIN DE CONTROLLER DE FACTURA LEGAL

// INICIO DE CONTROLLER CON RUTA DE TICKET
// Controlador para crear un nuevo ticket normal
app.post('/crear-ticketnormal', async (req, res) => {
  try {
    // Obtener los datos del ticket desde el cuerpo de la solicitud
    const {
      empresa,
      negocio,
      ruc,
      direccion,
      numeroInt,
      timbradoNumero,
      cliente,
      cantidad,
      producto,
      fechaActual,
      subtotal,
      totalPagar,
      descuento,
      totalIva10,
      mensaje,
      mensajeDos
    } = req.body;
    // Crear el ticket normal en la base de datos
    const ticketNormal = new TicketNormal({
      empresa,
      negocio,
      ruc,
      direccion,
      numeroInt,
      timbradoNumero,
      cliente,
      fechaActual,
      cantidad,
      producto,
      subtotal,
      totalPagar,
      descuento,
      totalIva10,
      mensaje,
      mensajeDos
    });
    await ticketNormal.save();
    // Devolver el ID del ticket normal creado como respuesta
    res.status(201).json({ ticketNormalId: ticketNormal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Controlador para obtener un ticket normal por su ID
app.get('/ticketnormal/:id', async (req, res) => {
  try {
    const ticket = await TicketNormal.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Error de aqui Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// FIN DE CONTROLLER CON RUTA DE TICKET
//INICIO DE CONTROLLER DE APERTURA DE CAJA
// Ruta para crear una apertura de caja
app.post('/aperturas-caja', async (req, res) => {
  try {
    const { montoInicial } = req.body;

    // Crear una nueva instancia de AperturaCaja utilizando el esquema
    const aperturaCaja = new AperturaCaja({
      montoInicial,
    });

    // Guardar la apertura de caja en la base de datos
    const nuevaAperturaCaja = await aperturaCaja.save();

    res.status(201).json(nuevaAperturaCaja);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la apertura de caja' });
  }
});

// Ruta para obtener la última apertura de caja cargada
app.get('/ultima-apertura', async (req, res) => {
  try {
    const ultimaApertura = await AperturaCaja.findOne().sort({ fecha: -1 });

    res.json(ultimaApertura);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la última apertura de caja' });
  }
});

// FIN DE CONTROLLER DE APERTURA DE CAJA

//INICIO DE CONTROLLER DE CIERRE DE CAJA 

// Ruta para crear un cierre de caja
app.post('/cierres-caja', async (req, res) => {
  try {
    const { ingresos, gastos, saldo, dineroEnCaja, diferencia } = req.body;

    // Crear una nueva instancia de CierreCaja utilizando el esquema
    const cierreCaja = new CierreCaja({
      ingresos,
      gastos,
      saldo,
      dineroEnCaja,
      diferencia,
    });

    // Guardar el cierre de caja en la base de datos
    const nuevoCierreCaja = await cierreCaja.save();

    res.status(201).json(nuevoCierreCaja);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cierre de caja' });
  }
});

// Ruta para obtener todos los cierres de caja
app.get('/cierres-caja', async (req, res) => {
  try {
    const cierresCaja = await CierreCaja.find();
    res.status(200).json(cierresCaja);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cierres de caja' });
  }
});
// Ruta para eliminar un cierre de caja por su ID
app.delete('/cierres-caja/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cierreCajaEliminado = await CierreCaja.findByIdAndDelete(id);
    if (!cierreCajaEliminado) {
      return res.status(404).json({ message: 'Cierre de caja no encontrado' });
    }
    res.status(200).json({ message: 'Cierre de caja eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cierre de caja' });
  }
});

//FIN DE CONTROLLER DE CIERRE DE CAJA

// Ruta para obtener todas las categorías
app.get('/categories', async (req, res) => {
  try {
    const categorias = await Category.find();
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
});

// Ruta para crear una nueva categoría
app.post('/categories', async (req, res) => {
  try {
    const nuevaCategoria = new Category(req.body);
    await nuevaCategoria.save();
    res.json(nuevaCategoria);
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
});

// Ruta para eliminar una categoría por su ID
app.delete('/categories/:id', async (req, res) => {
  try {
    const categoriaEliminada = await Category.findByIdAndDelete(req.params.id);
    if (!categoriaEliminada) {
      return res.status(404).json({ error: 'No se encontró la categoría' });
    }
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

// Editar un producto por su id
app.put('/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto por su id
app.delete('/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un producto por su id
app.get('/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//SECCIÓN DE CONEXIÓN 
mongoose
  .connect('mongodb://127.0.0.1:27017/sistemaventas5')
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error(error));


app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
//FIN DE SECCIÓN DE CONEXIÓN