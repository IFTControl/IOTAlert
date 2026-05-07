const express = require('express');
const router = express.Router();
const AlertStore = require('../services/alertStore');
const { authenticateToken } = require('../middleware/auth');

// Get all alerts
router.get('/', authenticateToken, (req, res) => {
  try {
    const alerts = AlertStore.getAllAlerts();
    res.json({
      success: true,
      alerts,
      count: alerts.length,
      unreadCount: AlertStore.getUnreadCount()
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch alerts' 
    });
  }
});

// Get alert by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const alert = AlertStore.getAlertById(req.params.id);
    if (!alert) {
      return res.status(404).json({ 
        success: false, 
        error: 'Alert not found' 
      });
    }
    res.json({ success: true, alert });
  } catch (error) {
    console.error('Error fetching alert:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch alert' 
    });
  }
});

// Mark alert as read
router.patch('/:id/read', authenticateToken, (req, res) => {
  try {
    const success = AlertStore.markAsRead(req.params.id);
    if (!success) {
      return res.status(404).json({ 
        success: false, 
        error: 'Alert not found' 
      });
    }
    res.json({ success: true, message: 'Alert marked as read' });
  } catch (error) {
    console.error('Error marking alert as read:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mark alert as read' 
    });
  }
});

// Mark all alerts as read
router.patch('/read-all', authenticateToken, (req, res) => {
  try {
    const count = AlertStore.markAllAsRead();
    res.json({ 
      success: true, 
      message: `${count} alerts marked as read` 
    });
  } catch (error) {
    console.error('Error marking all alerts as read:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mark alerts as read' 
    });
  }
});

// Delete alert
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const alert = AlertStore.deleteAlert(req.params.id);
    if (!alert) {
      return res.status(404).json({ 
        success: false, 
        error: 'Alert not found' 
      });
    }
    res.json({ success: true, message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete alert' 
    });
  }
});

// Get unread count
router.get('/stats/unread', authenticateToken, (req, res) => {
  try {
    const unreadCount = AlertStore.getUnreadCount();
    res.json({ 
      success: true, 
      unreadCount 
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch unread count' 
    });
  }
});

module.exports = router;

