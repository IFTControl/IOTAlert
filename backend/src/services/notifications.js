const { Expo } = require('expo-server-sdk');

// Store push tokens for registered devices
let pushTokens = [];

class NotificationService {
  // Register a push token
  static registerToken(token) {
    if (!pushTokens.includes(token)) {
      pushTokens.push(token);
      console.log(`New push token registered: ${token.substring(0, 20)}...`);
    }
  }

  // Remove a push token
  static removeToken(token) {
    const index = pushTokens.indexOf(token);
    if (index > -1) {
      pushTokens.splice(index, 1);
      console.log(`Push token removed: ${token.substring(0, 20)}...`);
    }
  }

  // Send push notification to all registered tokens
  static async sendPushNotification(alert) {
    if (pushTokens.length === 0) {
      console.log('No push tokens registered');
      return;
    }

    const expo = new Expo();
    const messages = [];

    // Create messages for all registered tokens
    for (const token of pushTokens) {
      if (!Expo.isExpoPushToken(token)) {
        console.error(`Invalid push token: ${token}`);
        continue;
      }

      messages.push({
        to: token,
        sound: 'default',
        title: alert.title,
        body: alert.message,
        data: {
          alertId: alert.id,
          severity: alert.severity
        }
      });
    }

    // Send notifications in chunks
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        console.log(`Sent ${chunk.length} push notifications`);
      } catch (error) {
        console.error('Error sending push notifications:', error);
      }
    }

    return tickets;
  }

  // Get registered tokens count
  static getTokenCount() {
    return pushTokens.length;
  }

  // Clear all tokens
  static clearTokens() {
    pushTokens = [];
  }
}

module.exports = NotificationService;

