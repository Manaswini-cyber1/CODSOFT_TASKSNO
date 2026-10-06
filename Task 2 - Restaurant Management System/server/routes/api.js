import express from 'express';
import db from '../db.js';

const router = express.Router();

// MENU ENDPOINTS
router.get('/menu', (req, res) => {
  res.json(db.getMenuItems());
});

router.post('/menu', (req, res) => {
  try {
    const item = db.addMenuItem(req.body);
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/menu/:id', (req, res) => {
  try {
    db.updateMenuItem(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/menu/:id/availability', (req, res) => {
  try {
    const isAvailable = db.toggleMenuItemAvailability(req.params.id);
    res.json({ success: true, isAvailable });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/menu/:id', (req, res) => {
  try {
    db.deleteMenuItem(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/menu/bulk-import', (req, res) => {
  try {
    const count = db.bulkImportMenuItems(req.body.items || []);
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TABLES ENDPOINTS
router.get('/tables', (req, res) => {
  res.json(db.getTables());
});

router.patch('/tables/:id/status', (req, res) => {
  try {
    db.updateTableStatus(req.params.id, req.body.status, req.body.currentOrderId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ORDERS ENDPOINTS
router.get('/orders', (req, res) => {
  res.json(db.getOrders());
});

router.post('/orders', (req, res) => {
  try {
    const order = db.addOrder(req.body);
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/orders/:id/status', (req, res) => {
  try {
    db.updateOrderStatus(req.params.id, req.body.status);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESERVATIONS ENDPOINTS
router.get('/reservations', (req, res) => {
  res.json(db.getReservations());
});

router.post('/reservations', (req, res) => {
  try {
    const reservation = db.addReservation(req.body);
    res.status(201).json({ success: true, reservation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/reservations/:id/status', (req, res) => {
  try {
    db.updateReservationStatus(req.params.id, req.body.status);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN RESET
router.post('/admin/reset-data', (req, res) => {
  try {
    db.resetAllData();
    res.json({ success: true, message: 'All transactions reset cleanly' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
