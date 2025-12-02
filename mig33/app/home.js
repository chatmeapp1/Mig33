import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user, setUser, setToken } = useContext(AuthContext);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5278" />
      
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <View style={styles.migLogo}>
            <Text style={styles.migText}>mig</Text>
          </View>
          <View style={styles.xBadge}>
            <Text style={styles.xText}>X</Text>
          </View>
        </View>
        <Text style={styles.welcomeText}>Welcome, {user?.username || 'User'}!</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome to MigX</Text>
          <Text style={styles.cardText}>
            Connect with friends, join chat rooms, and enjoy conversations!
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Rooms</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Menu</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Chat Rooms</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuButton, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabIcon}>💬</Text>
          <Text style={styles.tabLabel}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabIcon}>👥</Text>
          <Text style={styles.tabLabel}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a5278' },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#1a5278',
    borderBottomWidth: 1,
    borderBottomColor: '#2196F3',
  },
  logoWrapper: { position: 'relative', width: 120, height: 60, marginBottom: 10 },
  migLogo: { backgroundColor: '#2196F3', borderRadius: 30, paddingHorizontal: 20, paddingVertical: 10, elevation: 8 },
  migText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  xBadge: { position: 'absolute', top: -8, right: -8, backgroundColor: '#FF5722', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  xText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  welcomeText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 15, elevation: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a5278', marginBottom: 10 },
  cardText: { fontSize: 14, color: '#666', lineHeight: 22 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#2196F3' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  menuButton: { backgroundColor: '#2196F3', borderRadius: 8, paddingVertical: 15, alignItems: 'center', marginBottom: 10 },
  menuButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#FF5722' },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1a5278',
    borderTopWidth: 1,
    borderTopColor: '#2196F3',
    paddingVertical: 10,
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabIcon: { fontSize: 24 },
  tabLabel: { color: '#fff', fontSize: 12, marginTop: 4 },
});
