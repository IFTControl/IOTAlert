// In-memory storage for alerts
let alerts = [];
let nextId = 1;

class AlertStore {
  // Add a new alert
  static addAlert(alertData) {
    const alert = {
      id: nextId++,
      timestamp: new Date().toISOString(),
      title: alertData.title || 'Seeq Alert',
      message: alertData.message || 'No message provided',
      severity: alertData.severity || 'info',
      source: alertData.source || 'Seeq',
      data: alertData.data || {},
      read: false,
      createdAt: new Date().toISOString()
    };
    
    alerts.unshift(alert); // Add to beginning of array
    console.log(`New alert added: ${alert.title}`);
    return alert;
  }

  // Get all alerts
  static getAllAlerts() {
    return alerts;
  }

  // Get alert by ID
  static getAlertById(id) {
    return alerts.find(alert => alert.id === parseInt(id));
  }

  // Mark alert as read
  static markAsRead(id) {
    const alert = alerts.find(alert => alert.id === parseInt(id));
    if (alert) {
      alert.read = true;
      return true;
    }
    return false;
  }

  // Mark all alerts as read
  static markAllAsRead() {
    alerts.forEach(alert => alert.read = true);
    return alerts.length;
  }

  // Delete alert
  static deleteAlert(id) {
    const index = alerts.findIndex(alert => alert.id === parseInt(id));
    if (index !== -1) {
      return alerts.splice(index, 1)[0];
    }
    return null;
  }

  // Get unread count
  static getUnreadCount() {
    return alerts.filter(alert => !alert.read).length;
  }

  // Clear all alerts
  static clearAll() {
    alerts = [];
    nextId = 1;
  }
}

module.exports = AlertStore;

