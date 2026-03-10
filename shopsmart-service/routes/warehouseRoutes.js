const express = require('express');
const router = express.Router();
const Warehouse = require('../models/Warehouse');
const Inventory = require('../models/Inventory');

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     summary: Obtener todos los almacenes
 *     responses:
 *       200:
 *         description: Lista de almacenes
 */
router.get('/', async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/warehouses:
 *   post:
 *     summary: Crear un nuevo almacén
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Almacén creado
 */
router.post('/', async (req, res) => {
  const warehouse = new Warehouse({
    name: req.body.name,
    location: req.body.location
  });
  try {
    const newWarehouse = await warehouse.save();
    res.status(201).json(newWarehouse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/warehouses/{id}/inventory:
 *   get:
 *     summary: Obtener inventario para un almacén
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventario del almacén
 */
router.get('/:id/inventory', async (req, res) => {
  try {
    const inventory = await Inventory.find({ 'warehouses.warehouseId': req.params.id });
    const warehouseInventory = inventory.map(item => ({
      productId: item.productId,
      productName: item.productName,
      stock: item.warehouses.find(w => w.warehouseId === req.params.id)?.stock || 0
    }));
    res.json(warehouseInventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/warehouses/{id}/inventory:
 *   put:
 *     summary: Actualizar inventario en un almacén
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inventory:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     stock:
 *                       type: number
 *     responses:
 *       200:
 *         description: Inventario actualizado
 */
router.put('/:id/inventory', async (req, res) => {
  try {
    const { inventory } = req.body;
    for (const item of inventory) {
      await Inventory.findOneAndUpdate(
        { productId: item.productId, 'warehouses.warehouseId': req.params.id },
        { $set: { 'warehouses.$.stock': item.stock } },
        { upsert: true }
      );
      // Recalcular totalStock
      const invItem = await Inventory.findOne({ productId: item.productId });
      if (invItem) {
        const total = invItem.warehouses.reduce((sum, w) => sum + w.stock, 0);
        await Inventory.findOneAndUpdate({ productId: item.productId }, { totalStock: total });
      }
    }
    res.json({ message: 'Inventario actualizado' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;