import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { cn } from '../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <View
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        className
      )}
      style={style}
    >
      {children}
    </View>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', style }) => {
  return (
    <View
      className={cn('p-6 pb-0', className)}
      style={style}
    >
      {children}
    </View>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '', style }) => {
  return (
    <View
      className={cn('p-6 pt-0', className)}
      style={style}
    >
      {children}
    </View>
  );
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', style }) => {
  return (
    <View
      className={cn('p-6 pt-0', className)}
      style={style}
    >
      {children}
    </View>
  );
};

