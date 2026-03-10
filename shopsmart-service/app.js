const express = require('express');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const inventoryRoutes = require('./routes/inventoryRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Definición de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Servicio de Inventario y Almacenes ShopSmart',
      version: '1.0.0',
      description: 'API para gestionar inventario y almacenes en ShopSmart',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'], // archivos que contienen anotaciones
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(express.json());

// Rutas
app.use('/api/inventory', inventoryRoutes);
app.use('/api/warehouses', warehouseRoutes);

// Conectar a MongoDB
mongoose.connect('mongodb://mongo:27017/shopsmart', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Servicio ShopSmart ejecutándose en el puerto ${PORT}`);
});