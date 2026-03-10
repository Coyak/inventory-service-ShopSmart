const mongoose = require('mongoose');

// Esquema de Inventario
const inventorySchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true }, // ID único del producto
  productName: { type: String, required: true }, // Nombre del producto
  totalStock: { type: Number, required: true, default: 0 }, // Stock total agregado de todos los almacenes
  warehouses: [{ // Lista de almacenes con stock específico
    warehouseId: { type: String, required: true }, // ID del almacén
    stock: { type: Number, required: true, default: 0 } // Stock en este almacén
  }],
  lastUpdated: { type: Date, default: Date.now } // Última actualización
});

module.exports = mongoose.model('Inventory', inventorySchema);