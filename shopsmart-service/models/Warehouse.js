const mongoose = require('mongoose');

// Esquema de Almacén
const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nombre del almacén
  location: { type: String, required: true }, // Ubicación del almacén
  createdAt: { type: Date, default: Date.now } // Fecha de creación
});

module.exports = mongoose.model('Warehouse', warehouseSchema);