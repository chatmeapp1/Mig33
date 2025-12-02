
import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import RoomListScreen from './RoomListScreen';
import ChatScreen from './ChatScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Home Tab Component
function HomeTab() {
  const { user } = useContext(AuthContext);
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5278" />
      
      {/* Header */}
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

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎉 Welcome to MigX</Text>
          <Text style={styles.cardText}>
            Connect with friends, join chat rooms, and enjoy conversations!
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>💬 Quick Stats</Text>
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
          <Text style={styles.cardTitle}>🚀 Get Started</Text>
          <Text style={styles.cardText}>
            • Tap "Chat Rooms" to join conversations{'\n'}
            • Tap "Profile" to customize your account{'\n'}
            • Swipe left/right to navigate tabs
          </Text>
        </View>
      </View>
    </View>
  );
}

// Main HomeScreen with Bottom Tabs
export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          if (route.name === 'HomeTab') {
            icon = '🏠';
          } else if (route.name === 'ChatRooms') {
            icon = '💬';
          } else if (route.name === 'Profile') {
            icon = '👤';
          }
          return <Text style={{ fontSize: 24 }}>{icon}</Text>;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#1a5278',
          borderTopColor: '#2196F3',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      })}
      swipeEnabled={true}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeTab}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="ChatRooms" 
        component={RoomListScreen}
        options={{ tabBarLabel: 'Chat Rooms' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a5278',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#1a5278',
    borderBottomWidth: 1,
    borderBottomColor: '#2196F3',
  },
  logoWrapper: {
    position: 'relative',
    width: 120,
    height: 60,
    marginBottom: 10,
  },
  migLogo: {
    backgroundColor: '#2196F3',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  migText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  xBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF5722',
    borderRadius: 20,
    width: 40,
    height: 40,
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a5278',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
