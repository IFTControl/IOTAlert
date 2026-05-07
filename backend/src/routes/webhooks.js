const express = require('express');
const router = express.Router();
const AlertStore = require('../services/alertStore');
const NotificationService = require('../services/notifications');

// Webhook endpoint for Seeq alerts
router.post('/seeq', async (req, res) => {
  try {
    console.log('Received Seeq webhook:', JSON.stringify(req.body, null, 2));
    
    // Extract alert data from webhook payload
    const alertData = {
      title: req.body.title || req.body.alertTitle || 'Seeq Alert',
      message: req.body.message || req.body.description || req.body.alertMessage || 'No message provided',
      severity: req.body.severity || req.body.level || 'info',
      source: req.body.source || 'Seeq',
      data: req.body
    };

    // Add alert to store
    const alert = AlertStore.addAlert(alertData);
    
    // Send push notification
    await NotificationService.sendPushNotification(alert);
    
    res.status(200).json({ 
      success: true, 
      message: 'Alert processed successfully',
      alertId: alert.id 
    });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Test webhook endpoint
router.post('/test', async (req, res) => {
  try {
    const testAlert = {
      title: 'Test Alert',
      message: 'This is a test alert from the webhook',
      severity: 'info',
      source: 'Test'
    };

    const alert = AlertStore.addAlert(testAlert);
    await NotificationService.sendPushNotification(alert);
    
    res.status(200).json({ 
      success: true, 
      message: 'Test alert created successfully',
      alertId: alert.id 
    });
    
  } catch (error) {
    console.error('Error creating test alert:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

module.exports = router;

