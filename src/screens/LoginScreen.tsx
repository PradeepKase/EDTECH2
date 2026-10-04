import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setEmailError('');
    setPasswordError('');
    setServerError('');

    let valid = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    if (!valid) {
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Login failed',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.heading}>Learning Dashboard</Text>
        <Text style={styles.subtitle}>Sign in to continue learning</Text>

        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        {!!emailError && <Text style={styles.error}>{emailError}</Text>}

        <TextInput
          style={[styles.input, passwordError && styles.inputError]}
          placeholder="Password"
          // secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {!!passwordError && <Text style={styles.error}>{passwordError}</Text>}

        {!!serverError && <Text style={styles.serverError}>{serverError}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.disabled]}
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.demo}>
          Demo: demo@example.com / password123
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  heading: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#64748b', marginBottom: 28 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginTop: 12,
  },
  inputError: { borderColor: '#dc2626' },
  error: { color: '#dc2626', marginTop: 5, fontSize: 12 },
  serverError: {
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 8,
    marginTop: 14,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  demo: { textAlign: 'center', color: '#64748b', marginTop: 18 },
});