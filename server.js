const express = require("express");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");


// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware para manejar JSON
app.use(express.json());

app.use(express.static("public"));


// Puerto configurado desde el archivo .env
const PORT = process.env.PORT_EXPRESS || 3001;

// Ruta para manejar las solicitudesa la raìz
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API de Postres");
});


// Ruta para listar (get = READ) postres con límite opcional
app.get("/postres", async (req, res) => {
  const { limit } = req.query;
  const limiteRegistros = parseInt(limit) || 10; // Por defecto, devuelve 10 registros
  try {
    const postres = await prisma.postre.findMany({
      take: limiteRegistros,
    });
    res.json(postres);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener postres" });
  }
});

// Ruta para buscar (get = READ) postres por ID
app.get("/postres/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postres = await prisma.postre.findUnique({
      where: { id: Number(id) },
    });
    if (postres) {
      res.json(postres);
    } else {
      res.status(404).json({ error: "Postre no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener postre por ID" });
  }
});

// Ruta para crear (post = CREATE) un nuevo postre
app.post("/postres", async (req, res) => {
  const { nombre, calorias, precio, fecha_elaboracion } = req.body;
  try {
    const nuevoPostre = await prisma.postre.create({
      data: {
        nombre,
        calorias,
        precio,
        fecha_elaboracion: new Date(fecha_elaboracion), // Asegúrate de convertir la cadena a un objeto Date
      },
    });
    res.json(nuevoPostre);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el postre" });
  }
});

// Ruta para modificar (put = MODIFICAR) un postre por ID
app.put("/postres/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, precio } = req.body;

  // Verificar si se proporcionaron datos
  if (!nombre && precio === undefined) {
    return res
      .status(400)
      .json({ error: "Debes proporcionar al menos un campo para modificar." });
  }

  try {
    const postreModificado = await prisma.postre.update({
      where: { id: parseInt(id) },
      data: {
        ...(nombre && { nombre }), // Solo incluye nombre si existe
        ...(precio !== undefined && { precio }), // Solo incluye precio si está definido
      },
    });
    res.json(postreModificado);
  } catch (error) {
    console.error("Error al modificar el postre:", error); // Agregar consola para depuración
    res.status(500).json({ error: error.message }); // Mensaje de error más específico
  }
});

// Ruta para eliminar (delete = ELIMINAR) un postre por ID
app.delete("/postres/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postreEliminado = await prisma.postre.delete({
      where: { id: parseInt(id) },
    });
    res.json(postreEliminado);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el postre" });
  }
});

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});