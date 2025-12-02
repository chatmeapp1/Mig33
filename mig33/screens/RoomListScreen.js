
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RoomListScreen() {
  const navigation = useNavigation();
  const [rooms, setRooms] = useState([
    { id: '1', name: 'General Chat', members: 125, category: 'Public' },
    { id: '2', name: 'Gaming Zone', members: 89, category: 'Gaming' },
    { id: '3', name: 'Music Lovers', members: 156, category: 'Entertainment' },
    { id: '4', name: 'Tech Talk', members: 67, category: 'Technology' },
    { id: '5', name: 'Random Chat', members: 234, category: 'Public' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleJoinRoom = (room) => {
    navigation.navigate('Chat', {
      roomId: room.id,
      roomName: room.name,
    });
  };

  const renderRoom = ({ item }) => (
    <TouchableOpacity
      style={styles.roomCard}
      onPress={() => handleJoinRoom(item)}
    >
      <View style={styles.roomIcon}>
        <Text style={styles.roomIconText}>{item.name.charAt(0)}</Text>
      </View>
      
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.name}</Text>
        <View style={styles.roomMeta}>
          <Text style={styles.roomCategory}>{item.category}</Text>
          <Text style={styles.roomMembers}>👥 {item.members} members</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5278" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat Rooms</Text>
        <Text style={styles.headerSubtitle}>Find and join conversations</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search rooms..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <TouchableOpacity style={styles.categoryChip}>
          <Text style={styles.categoryChipText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryChip}>
          <Text style={styles.categoryChipText}>Public</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryChip}>
          <Text style={styles.categoryChipText}>Gaming</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryChip}>
          <Text style={styles.categoryChipText}>Music</Text>
        </TouchableOpacity>
      </View>

      {/* Room List */}
      <FlatList
        data={filteredRooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No rooms found</Text>
          </View>
        }
      />

      {/* Create Room Button */}
      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>+ Create Room</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a5278',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2196F3',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  categoryChipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 15,
  },
  roomCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  roomIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roomIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  roomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomCategory: {
    fontSize: 12,
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  roomMembers: {
    fontSize: 12,
    color: '#666',
  },
  joinButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF6F00',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
