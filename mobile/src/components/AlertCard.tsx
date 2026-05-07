import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Alert } from '../types';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { cn } from '../utils/cn';

interface AlertCardProps {
  alert: Alert;
  onPress: () => void;
  onMarkAsRead?: () => void;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onPress,
  onMarkAsRead,
  className = '',
}) => {
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-danger-600';
      case 'warning':
        return 'text-warning-600';
      case 'success':
        return 'text-success-600';
      default:
        return 'text-primary-600';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card className={cn('mb-3', !alert.read && 'border-l-4 border-l-primary-500', className)}>
        <CardContent>
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-2">
              <Text className="text-lg font-semibold text-gray-900 mb-1" numberOfLines={2}>
                {alert.title}
              </Text>
              <Text className="text-sm text-gray-600 mb-2" numberOfLines={3}>
                {alert.message}
              </Text>
            </View>
            <View className="items-end">
              <Badge variant={getSeverityVariant(alert.severity) as any} size="sm">
                {alert.severity.toUpperCase()}
              </Badge>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-500">
                {formatTimestamp(alert.timestamp)}
              </Text>
              <Text className="text-xs text-gray-400 mx-1">•</Text>
              <Text className="text-xs text-gray-500">
                {alert.source}
              </Text>
            </View>
            
            {!alert.read && (
              <View className="w-2 h-2 bg-primary-500 rounded-full" />
            )}
          </View>

          {onMarkAsRead && !alert.read && (
            <TouchableOpacity
              onPress={onMarkAsRead}
              className="mt-2 self-start"
            >
              <Text className="text-xs text-primary-600 font-medium">
                Mark as read
              </Text>
            </TouchableOpacity>
          )}
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

