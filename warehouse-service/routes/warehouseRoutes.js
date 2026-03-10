const express = require('express');
const router = express.Router();
const Warehouse = require('../models/Warehouse');

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
 *         description: Warehouse created
 */
router.post('/', async (req, res) => {
  const warehouse = new Warehouse({
    name: req.body.name,
    location: req.body.location,
    inventory: req.body.inventory || []
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
 *     summary: Obtener inventario de un almacén
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Warehouse inventory
 */
router.get('/:id/inventory', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ message: 'Almacén no encontrado' });
    res.json(warehouse.inventory);
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
 *         description: Inventory updated
 */
router.put('/:id/inventory', async (req, res) => {
  try {
    const updatedWarehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { inventory: req.body.inventory },
      { new: true }
    );
    if (!updatedWarehouse) return res.status(404).json({ message: 'Almacén no encontrado' });
    res.json(updatedWarehouse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;