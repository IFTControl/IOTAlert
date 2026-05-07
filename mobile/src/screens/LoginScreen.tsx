import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardHeader } from '../components/Card';

export const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};

    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!credentials.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const success = await login(credentials);
      if (!success) {
        Alert.alert('Login Failed', 'Invalid username or password');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 py-8">
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
                IOT Alert
              </Text>
              <Text className="text-lg text-gray-600 text-center">
                Seeq Alerts Dashboard
              </Text>
            </View>

            <Card className="mx-2">
              <CardHeader>
                <Text className="text-xl font-semibold text-gray-900 text-center">
                  Sign In
                </Text>
                <Text className="text-gray-600 text-center mt-2">
                  Enter your credentials to access alerts
                </Text>
              </CardHeader>
              <CardContent>
                <Input
                  label="Username"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChangeText={(text) => setCredentials(prev => ({ ...prev, username: text }))}
                  error={errors.username}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChangeText={(text) => setCredentials(prev => ({ ...prev, password: text }))}
                  secureTextEntry
                  error={errors.password}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Button
                  title="Sign In"
                  onPress={handleLogin}
                  loading={isLoading}
                  disabled={isLoading}
                  className="mt-4"
                />
              </CardContent>
            </Card>

            <View className="mt-6 px-4">
              <Text className="text-sm text-gray-500 text-center">
                Default credentials: admin / password
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

