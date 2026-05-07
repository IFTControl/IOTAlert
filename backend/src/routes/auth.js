const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const NotificationService = require('../services/notifications');

// Login endpoint
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Simple authentication - in production, use proper password hashing
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'password';
    
    if (username === validUsername && password === validPassword) {
      const token = jwt.sign(
        { username, userId: 1 },
        process.env.AUTH_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
      
      res.json({
        success: true,
        token,
        user: { username, userId: 1 }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Register push token endpoint
router.post('/register-push-token', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Push token is required'
      });
    }
    
    NotificationService.registerToken(token);
    
    res.json({
      success: true,
      message: 'Push token registered successfully',
      tokenCount: NotificationService.getTokenCount()
    });
  } catch (error) {
    console.error('Error registering push token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register push token'
    });
  }
});

// Remove push token endpoint
router.delete('/push-token', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Push token is required'
      });
    }
    
    NotificationService.removeToken(token);
    
    res.json({
      success: true,
      message: 'Push token removed successfully',
      tokenCount: NotificationService.getTokenCount()
    });
  } catch (error) {
    console.error('Error removing push token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove push token'
    });
  }
});

// Get push token stats
router.get('/push-token-stats', (req, res) => {
  try {
    res.json({
      success: true,
      tokenCount: NotificationService.getTokenCount()
    });
  } catch (error) {
    console.error('Error fetching push token stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch push token stats'
    });
  }
});

module.exports = router;

