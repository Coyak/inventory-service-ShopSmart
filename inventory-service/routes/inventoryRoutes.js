const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const axios = require('axios');

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Obtener todos los items de inventario
 *     responses:
 *       200:
 *         description: Lista de items de inventario
 */
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/inventory/{productId}:
 *   get:
 *     summary: Obtener inventario de un producto específico
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory item
 */
router.get('/:productId', async (req, res) => {
  try {
    const item = await Inventory.findOne({ productId: req.params.productId });
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Agregar o actualizar item de inventario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               productName:
 *                 type: string
 *               warehouses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     warehouseId:
 *                       type: string
 *                     stock:
 *                       type: number
 *     responses:
 *       201:
 *         description: Inventory item created or updated
 */
router.post('/', async (req, res) => {
  const { productId, productName, warehouses } = req.body;
  const totalStock = warehouses.reduce((sum, w) => sum + w.stock, 0);
  const inventory = new Inventory({
    productId,
    productName,
    totalStock,
    warehouses
  });
  try {
    const newItem = await inventory.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/inventory/{productId}:
 *   put:
 *     summary: Actualizar inventario de un producto
 *     parameters:
 *       - in: path
 *         name: productId
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
 *               warehouses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     warehouseId:
 *                       type: string
 *                     stock:
 *                       type: number
 *     responses:
 *       200:
 *         description: Inventory updated
 */
router.put('/:productId', async (req, res) => {
  const { warehouses } = req.body;
  const totalStock = warehouses.reduce((sum, w) => sum + w.stock, 0);
  try {
    const updatedItem = await Inventory.findOneAndUpdate(
      { productId: req.params.productId },
      { warehouses, totalStock, lastUpdated: Date.now() },
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Item no encontrado' });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/inventory/{productId}:
 *   delete:
 *     summary: Eliminar item de inventario
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted
 */
router.delete('/:productId', async (req, res) => {
  try {
    const deletedItem = await Inventory.findOneAndDelete({ productId: req.params.productId });
    if (!deletedItem) return res.status(404).json({ message: 'Item no encontrado' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/inventory/sync:
 *   post:
 *     summary: Sincronizar inventario con warehouses
 *     responses:
 *       200:
 *         description: Sync completed
 */
router.post('/sync', async (req, res) => {
  try {
    // Call warehouse service to get updated data
    const response = await axios.get('http://warehouse-service:3001/api/warehouses');
    const warehouses = response.data;
    // Update inventory based on warehouses
    res.json({ message: 'Sync completed', warehouses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;