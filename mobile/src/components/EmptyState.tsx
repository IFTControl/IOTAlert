import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent } from './Card';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = '📭',
}) => {
  return (
    <Card className="mx-4 my-8">
      <CardContent className="items-center py-12">
        <Text className="text-4xl mb-4">{icon}</Text>
        <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">
          {title}
        </Text>
        <Text className="text-gray-600 text-center leading-6">
          {description}
        </Text>
      </CardContent>
    </Card>
  );
};

