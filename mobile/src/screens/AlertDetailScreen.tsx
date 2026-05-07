import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert as AlertType } from '../types';
import { alertsAPI } from '../services/api';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

interface AlertDetailScreenProps {
  route: {
    params: {
      alert: AlertType;
    };
  };
  navigation: any;
}

export const AlertDetailScreen: React.FC<AlertDetailScreenProps> = ({ route, navigation }) => {
  const { alert: initialAlert } = route.params;
  const [alert, setAlert] = useState<AlertType>(initialAlert);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mark as read when viewing details
    if (!alert.read) {
      handleMarkAsRead();
    }
  }, []);

  const handleMarkAsRead = async () => {
    if (alert.read) return;

    try {
      setLoading(true);
      await alertsAPI.markAsRead(alert.id);
      setAlert(prev => ({ ...prev, read: true }));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Alert',
      'Are you sure you want to delete this alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await alertsAPI.deleteAlert(alert.id);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting alert:', error);
              Alert.alert('Error', 'Failed to delete alert');
            }
          },
        },
      ]
    );
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header Card */}
          <Card className="mb-4">
            <CardHeader>
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 mr-2">
                  <Text className="text-xl font-bold text-gray-900 mb-2">
                    {alert.title}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {formatTimestamp(alert.timestamp)}
                  </Text>
                </View>
                <Badge variant={getSeverityVariant(alert.severity) as any}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </View>
            </CardHeader>
            <CardContent>
              <Text className="text-base text-gray-800 leading-6">
                {alert.message}
              </Text>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="mb-4">
            <CardHeader>
              <Text className="text-lg font-semibold text-gray-900">Details</Text>
            </CardHeader>
            <CardContent>
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Source:</Text>
                  <Text className="font-medium">{alert.source}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Status:</Text>
                  <Badge variant={alert.read ? 'success' : 'warning'} size="sm">
                    {alert.read ? 'Read' : 'Unread'}
                  </Badge>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Created:</Text>
                  <Text className="font-medium">{formatTimestamp(alert.createdAt)}</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Raw Data Card */}
          {Object.keys(alert.data).length > 0 && (
            <Card className="mb-4">
              <CardHeader>
                <Text className="text-lg font-semibold text-gray-900">Raw Data</Text>
              </CardHeader>
              <CardContent>
                <View className="bg-gray-100 rounded-md p-3">
                  <Text className="text-sm text-gray-700 font-mono">
                    {JSON.stringify(alert.data, null, 2)}
                  </Text>
                </View>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <View className="flex-row space-x-3">
            {!alert.read && (
              <Button
                title="Mark as Read"
                onPress={handleMarkAsRead}
                loading={loading}
                variant="outline"
                className="flex-1"
              />
            )}
            <Button
              title="Delete"
              onPress={handleDelete}
              variant="destructive"
              className="flex-1"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

