import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { cn } from '../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  style,
  textStyle,
}) => {
  const baseClasses = 'inline-flex items-center rounded-full';
  
  const variantClasses = {
    default: 'bg-gray-100',
    secondary: 'bg-gray-200',
    destructive: 'bg-danger-100',
    outline: 'border border-gray-300 bg-transparent',
    success: 'bg-success-100',
    warning: 'bg-warning-100',
  };

  const sizeClasses = {
    sm: 'px-2 py-1',
    md: 'px-2.5 py-1.5',
    lg: 'px-3 py-2',
  };

  const textVariantClasses = {
    default: 'text-gray-800',
    secondary: 'text-gray-600',
    destructive: 'text-danger-800',
    outline: 'text-gray-700',
    success: 'text-success-800',
    warning: 'text-warning-800',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <View
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      style={style}
    >
      <Text
        className={cn(
          'font-medium',
          textVariantClasses[variant],
          textSizeClasses[size]
        )}
        style={textStyle}
      >
        {children}
      </Text>
    </View>
  );
};

