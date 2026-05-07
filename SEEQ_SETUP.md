# Seeq Webhook Setup Guide

This guide explains how to configure Seeq to send alerts to your IOT Alert app via webhooks.

## Prerequisites

- Seeq Server with administrative access
- IOT Alert backend server running and accessible via HTTPS
- Seeq Data Lab access

## Step 1: Configure Seeq Notifications

1. **Enable Notifications in Seeq**
   - Log into your Seeq server as an administrator
   - Navigate to **Administration** > **System Settings**
   - Ensure the **Notifications** feature is enabled
   - Configure notification settings as needed

2. **Create a Notification in Seeq Data Lab**
   - Open Seeq Data Lab
   - Create a new project or open an existing one
   - Use the following code to set up webhook notifications:

```python
# Import required modules
import seeq
import requests
import json

# Configure your webhook endpoint
WEBHOOK_URL = "https://your-domain.com/api/webhooks/seeq"

# Example: Create a condition and set up notifications
# Replace with your actual signal and condition logic
condition = seeq.add_condition(
    name="High Temperature Alert",
    formula="Temperature > 100",
    start_time="2024-01-01",
    end_time="2024-12-31"
)

# Set up webhook notification
def send_webhook_notification(condition_data):
    payload = {
        "title": "Seeq Alert: High Temperature",
        "message": f"Temperature condition triggered at {condition_data.get('timestamp', 'unknown time')}",
        "severity": "warning",
        "source": "Seeq",
        "data": {
            "condition_id": condition_data.get('id'),
            "condition_name": condition_data.get('name'),
            "timestamp": condition_data.get('timestamp'),
            "value": condition_data.get('value')
        }
    }
    
    try:
        response = requests.post(WEBHOOK_URL, json=payload)
        if response.status_code == 200:
            print("Webhook notification sent successfully")
        else:
            print(f"Webhook failed with status: {response.status_code}")
    except Exception as e:
        print(f"Error sending webhook: {e}")

# Example usage - you would integrate this with your actual condition monitoring
# This is a simplified example
```

## Step 2: Backend Configuration

1. **Update Backend URL**
   - In your mobile app's `src/services/api.ts`, update the `API_BASE_URL`:
   ```typescript
   const API_BASE_URL = 'https://your-domain.com/api';
   ```

2. **Environment Variables**
   - Set up your backend environment variables in `.env`:
   ```
   PORT=3000
   AUTH_SECRET=your-super-secret-jwt-key-here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=password
   ```

## Step 3: Test Webhook Integration

1. **Test Webhook Endpoint**
   ```bash
   curl -X POST https://your-domain.com/api/webhooks/test \
     -H "Content-Type: application/json" \
     -d '{"message": "Test webhook"}'
   ```

2. **Test with Sample Alert**
   ```bash
   curl -X POST https://your-domain.com/api/webhooks/seeq \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Test Alert",
       "message": "This is a test alert from Seeq",
       "severity": "info",
       "source": "Seeq",
       "data": {
         "test": true,
         "timestamp": "2024-01-01T00:00:00Z"
       }
     }'
   ```

## Step 4: Configure Seeq Data Lab for Production

1. **Create a Production Script**
   ```python
   # production_notifications.py
   import seeq
   import requests
   import json
   from datetime import datetime
   
   class SeeqWebhookNotifier:
       def __init__(self, webhook_url):
           self.webhook_url = webhook_url
       
       def send_alert(self, title, message, severity="info", data=None):
           payload = {
               "title": title,
               "message": message,
               "severity": severity,
               "source": "Seeq",
               "timestamp": datetime.now().isoformat(),
               "data": data or {}
           }
           
           try:
               response = requests.post(self.webhook_url, json=payload, timeout=10)
               return response.status_code == 200
           except Exception as e:
               print(f"Error sending webhook: {e}")
               return False
   
   # Initialize notifier
   notifier = SeeqWebhookNotifier("https://your-domain.com/api/webhooks/seeq")
   
   # Example usage in your condition monitoring
   def monitor_conditions():
       # Your condition monitoring logic here
       # When a condition is triggered:
       notifier.send_alert(
           title="Process Alert",
           message="Critical condition detected",
           severity="critical",
           data={"condition_id": "123", "value": 150.5}
       )
   ```

2. **Schedule the Script**
   - Use Seeq's scheduling features to run your monitoring script
   - Set up appropriate intervals based on your monitoring needs

## Step 5: Mobile App Configuration

1. **Update API Base URL**
   - In `mobile/src/services/api.ts`, update the base URL to point to your deployed backend

2. **Configure Push Notifications**
   - The app will automatically register for push notifications
   - Ensure your backend is configured to send notifications to registered devices

## Troubleshooting

### Common Issues

1. **Webhook not receiving data**
   - Check that your backend server is accessible via HTTPS
   - Verify the webhook URL is correct
   - Check server logs for errors

2. **Push notifications not working**
   - Ensure the device has granted notification permissions
   - Check that the Expo push token is being registered with the backend
   - Verify the backend notification service is working

3. **Authentication issues**
   - Check that the JWT secret is consistent between backend and mobile app
   - Verify user credentials are correct

### Testing Checklist

- [ ] Backend server is running and accessible
- [ ] Webhook endpoint responds to test requests
- [ ] Seeq can successfully send webhooks to your backend
- [ ] Mobile app can authenticate with backend
- [ ] Push notifications are working
- [ ] Alerts are displayed correctly in the mobile app

## Security Considerations

1. **HTTPS Required**
   - Seeq requires HTTPS for webhook endpoints
   - Use SSL certificates for production deployment

2. **Authentication**
   - Use strong JWT secrets
   - Consider implementing rate limiting
   - Validate webhook payloads

3. **Network Security**
   - Restrict webhook endpoint access if possible
   - Monitor for unusual webhook activity
   - Implement proper error handling

## Support

For issues with this setup:
1. Check the backend server logs
2. Verify Seeq Data Lab script execution
3. Test webhook endpoints independently
4. Check mobile app console for errors

