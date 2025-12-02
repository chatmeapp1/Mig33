
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
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { API } from '../services/api';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { setUser, setToken } = useContext(AuthContext);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const countries = [
    'Select Country',
    'Indonesia',
    'Malaysia',
    'Singapore',
    'Philippines',
    'Thailand',
    'Vietnam',
    'India',
    'United States',
    'United Kingdom',
    'Australia',
    'Canada',
    'Japan',
    'South Korea',
    'China',
    'Other'
  ];

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate OTP sending (you can implement actual OTP service later)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
      Alert.alert('OTP Sent', 'Please check your email for the OTP code');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter OTP code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate OTP verification (implement actual verification later)
      // For demo purposes, accept "123456" as valid OTP
      if (otp === '123456') {
        setOtpVerified(true);
        Alert.alert('Success', 'Email verified successfully');
      } else {
        setError('Invalid OTP code');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // Validation
    if (!username || !email || !password || !confirmPassword || !gender || !country || country === 'Select Country') {
      setError('Please fill in all fields');
      return;
    }

    if (!otpVerified) {
      setError('Please verify your email first');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/register', {
        username,
        email,
        password,
        name: username,
        gender,
        country,
      });

      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        API.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        Alert.alert('Success', 'Registration successful!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        {/* Logo Section */}
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

        {/* Title */}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the migx community!</Text>

        {/* Registration Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!otpVerified}
          />

          {/* OTP Section */}
          {!otpVerified && (
            <View style={styles.otpSection}>
              {!otpSent ? (
                <TouchableOpacity
                  style={styles.otpButton}
                  onPress={handleSendOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.otpButtonText}>Send OTP</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter OTP Code"
                    placeholderTextColor="#999"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                  <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={handleVerifyOTP}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.verifyButtonText}>Verify OTP</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {otpVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Email Verified</Text>
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* Gender Selection */}
          <View style={styles.genderContainer}>
            <Text style={styles.label}>Gender:</Text>
            <View style={styles.genderButtons}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                onPress={() => setGender('male')}
              >
                <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                onPress={() => setGender('female')}
              >
                <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Country Dropdown */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={country}
              onValueChange={(itemValue) => setCountry(itemValue)}
              style={styles.picker}
              dropdownIconColor="#1a5278"
            >
              {countries.map((countryName, index) => (
                <Picker.Item
                  key={index}
                  label={countryName}
                  value={countryName}
                  enabled={countryName !== 'Select Country'}
                />
              ))}
            </Picker>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleRegister}
            disabled={loading || !otpVerified}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginContainer}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
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
    marginTop: 20,
    marginBottom: 10,
  },
  logoWrapper: {
    position: 'relative',
    width: 150,
    height: 80,
  },
  migLogo: {
    backgroundColor: '#2196F3',
    borderRadius: 40,
    paddingHorizontal: 25,
    paddingVertical: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  migText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Arial Rounded MT Bold' : 'sans-serif',
  },
  xBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FF5722',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  xText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  otpSection: {
    marginBottom: 15,
  },
  otpButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  otpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  genderContainer: {
    marginBottom: 15,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  genderButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  genderButtonText: {
    color: '#1a5278',
    fontSize: 16,
    fontWeight: 'bold',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  errorText: {
    color: '#FF5252',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#FF3D00',
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
  },
  loginLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
