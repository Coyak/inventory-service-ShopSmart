const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

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
 *         description: Item de inventario
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
 *         description: Item de inventario creado o actualizado
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
 *         description: Inventario actualizado
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
 *         description: Item eliminado
 */
router.delete('/:productId', async (req, res) => {
  try {
    const deletedItem = await Inventory.findOneAndDelete({ productId: req.params.productId });
    if (!deletedItem) return res.status(404).json({ message: 'Item no encontrado' });
    res.json({ message: 'Item eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/inventory/sync:
 *   post:
 *     summary: Sincronizar inventario con almacenes (recalcular totales)
 *     responses:
 *       200:
 *         description: Sincronización completada
 */
router.post('/sync', async (req, res) => {
  try {
    const inventories = await Inventory.find();
    for (const inv of inventories) {
      const total = inv.warehouses.reduce((sum, w) => sum + w.stock, 0);
      await Inventory.findOneAndUpdate({ productId: inv.productId }, { totalStock: total });
    }
    res.json({ message: 'Sincronización completada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;