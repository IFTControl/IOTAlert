import React, { useState } from 'react';
import { View, TextInput, Text, ViewStyle, TextStyle } from 'react-native';
import { cn } from '../utils/cn';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  disabled = false,
  className = '',
  style,
  inputStyle,
  labelStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = 'border rounded-md px-3 py-2';
  const focusClasses = isFocused ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-300';
  const errorClasses = error ? 'border-danger-500' : '';
  const disabledClasses = disabled ? 'bg-gray-100 opacity-50' : 'bg-white';

  return (
    <View className={cn('mb-4', className)} style={style}>
      {label && (
        <Text
          className={cn('text-sm font-medium text-gray-700 mb-2')}
          style={labelStyle}
        >
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          baseClasses,
          focusClasses,
          errorClasses,
          disabledClasses
        )}
        style={inputStyle}
      />
      {error && (
        <Text className="text-danger-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};

