import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from '../types';
import { alertsAPI } from '../services/api';
import { AlertCard } from '../components/AlertCard';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

export const AlertsListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { logout } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAlerts = async () => {
    try {
      const response = await alertsAPI.getAlerts();
      if (response.success) {
        setAlerts(response.alerts);
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  const handleMarkAsRead = async (alertId: number) => {
    try {
      await alertsAPI.markAsRead(alertId);
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, read: true } : alert
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await alertsAPI.markAllAsRead();
      setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
    }
  };

  const handleAlertPress = (alert: Alert) => {
    navigation.navigate('AlertDetail', { alert });
  };

  const handleLogout = async () => {
    await logout();
  };

  // Fetch alerts when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAlerts();
    }, [])
  );

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderAlert = ({ item }: { item: Alert }) => (
    <AlertCard
      alert={item}
      onPress={() => handleAlertPress(item)}
      onMarkAsRead={() => handleMarkAsRead(item.id)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Loading alerts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-bold text-gray-900">Alerts</Text>
              <Text className="text-sm text-gray-600">
                {alerts.length} total, {unreadCount} unread
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" size="sm">
                  {unreadCount}
                </Badge>
              )}
              <TouchableOpacity onPress={handleLogout}>
                <Text className="text-primary-600 font-medium">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Actions */}
        {alerts.length > 0 && unreadCount > 0 && (
          <View className="bg-white border-b border-gray-200 px-4 py-2">
            <Button
              title="Mark All as Read"
              onPress={handleMarkAllAsRead}
              variant="outline"
              size="sm"
              className="self-start"
            />
          </View>
        )}

        {/* Alerts List */}
        {alerts.length === 0 ? (
          <EmptyState
            title="No Alerts"
            description="You don't have any alerts yet. Alerts from Seeq will appear here when they are triggered."
            icon="🔔"
          />
        ) : (
          <FlatList
            data={alerts}
            renderItem={renderAlert}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#3b82f6']}
                tintColor="#3b82f6"
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

