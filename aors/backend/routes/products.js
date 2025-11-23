import express from 'express';
import Product from '../models/Product.js';
import { authMiddleware, authorize } from '../middleware/auth.js';

const router = express.Router();

// List products
router.get('/', authMiddleware, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// Create product (admin)
router.post('/', authMiddleware, authorize('admin'), async (req, res) => {
  const { name, description, price, stock } = req.body;
  const product = new Product({ name, description, price, stock });
  await product.save();
  res.json(product);
});

// Update product (admin)
router.put('/:id', authMiddleware, authorize('admin'), async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(product);
});

// Delete product (admin)
router.delete('/:id', authMiddleware, authorize('admin'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
