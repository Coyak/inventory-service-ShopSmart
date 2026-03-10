const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  totalStock: { type: Number, required: true, default: 0 },
  warehouses: [{
    warehouseId: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 }
  }],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', inventorySchema);