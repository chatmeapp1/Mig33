import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import { API } from '../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, setToken } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginAsInvisible, setLoginAsInvisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/login', {
        username,
        password,
      });

      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        API.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        router.replace('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a5278" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <View style={styles.migLogo}>
              <Text style={styles.migText}>mig</Text>
            </View>
            <View style={styles.xBadge}>
              <Text style={styles.xText}>X</Text>
            </View>
          </View>
        </View>

        <Text style={styles.tagline}>Join the Fun!</Text>

        <View style={styles.charactersContainer}>
          {['😄', '⚪', '🤖', '👽', '🐱', '🐰'].map((emoji, index) => (
            <View key={index} style={styles.character}>
              <Text style={styles.characterEmoji}>{emoji}</Text>
            </View>
          ))}
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              textContentType="password"
            />
            <TouchableOpacity style={styles.helpButton}>
              <Text style={styles.helpText}>?</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Go!</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.invisibleContainer}
            onPress={() => setLoginAsInvisible(!loginAsInvisible)}
          >
            <View style={[styles.checkbox, loginAsInvisible && styles.checkboxChecked]}>
              {loginAsInvisible && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.invisibleText}>Login as Invisible</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/register')}
            style={styles.createAccountContainer}
          >
            <Text style={styles.createAccountText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a5278',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logoWrapper: {
    position: 'relative',
    width: 180,
    height: 100,
  },
  migLogo: {
    backgroundColor: '#2196F3',
    borderRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  migText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  xBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FF5722',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  xText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  tagline: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  charactersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  character: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  characterEmoji: {
    fontSize: 32,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 15,
    elevation: 2,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#000',
  },
  helpButton: {
    backgroundColor: '#2196F3',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  helpText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF5252',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#FF6F00',
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  invisibleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#fff',
  },
  checkmark: {
    color: '#1a5278',
    fontSize: 16,
    fontWeight: 'bold',
  },
  invisibleText: {
    color: '#fff',
    fontSize: 16,
  },
  createAccountContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  createAccountText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
