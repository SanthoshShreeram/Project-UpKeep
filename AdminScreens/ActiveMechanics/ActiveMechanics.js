import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faClose, faStar, faUser} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import config from '../../config';

const API_BASE_URL = config.API_BASE_URL;

const ActiveMechanics = ({ navigation }) => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [suspending, setSuspending] = useState(false);

  // Fetch Mechanics from Backend
  useEffect(() => {
    fetchMechanics();
  }, []);


  const fetchMechanics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/mechanics`);
      setMechanics(response.data.approvedMechanics);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch mechanics. Try again later.');
      console.error('Error fetching mechanics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (mechanic) => {
    setSelectedMechanic(mechanic);
    setShowModal(true);
  };

  const handleSuspend = async (mechanicId) => {
    setSuspending(true);
    try {
      await axios.post(`${API_BASE_URL}/admin/suspend-user/${mechanicId}`);
      Alert.alert('Success', 'Mechanic suspended successfully.');
      setShowModal(false);
      fetchMechanics(); // Refresh the list after suspension
    } catch (error) {
      Alert.alert('Error', 'Failed to suspend mechanic.');
      console.error('Error suspending mechanic:', error);
    } finally {
      setSuspending(false);
    }
  };

  const renderMechanicCard = (mechanic) => (
    <TouchableOpacity
      key={mechanic._id}
      style={styles.mechanicCard}
      onPress={() => handleViewDetails(mechanic)}
    >
      <View style={styles.cardContent}>
        <View style={styles.profileSection}>
          {mechanic.profilePhoto ? (
            <Image source={{ uri: mechanic.profilePhoto }} style={styles.profilePhoto} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <FontAwesomeIcon icon={faUser} size={24} color="#666" />
            </View>
          )}
          <View style={styles.mechanicInfo}>
            <Text style={styles.mechanicName}>{mechanic.name}</Text>
            <Text style={styles.mechanicEmail}>{mechanic.email}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesomeIcon icon={faStar} size={16} color="#FFD700"/>
              <Text style={styles.ratingText}>{mechanic.rating || 'N/A'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: mechanic.isAvailable ? '#4CD964' : '#E5E5E5' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: mechanic.isAvailable ? '#fff' : '#666' }
            ]}>
              {mechanic.isAvailable ? 'Available' : 'Unavailable'}            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faAngleLeft} size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Mechanics</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.content}>
          {mechanics.length > 0 ? (
            mechanics.map(renderMechanicCard)
          ) : (
            <Text style={styles.noDataText}>No active mechanics available.</Text>
          )}
        </ScrollView>
      )}

      <Modal visible={showModal} animationType="slide" transparent={true}>
        {selectedMechanic && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Mechanic Details</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <FontAwesomeIcon icon={faClose} size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Name</Text>
                  <Text style={styles.detailValue}>{selectedMechanic.name}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{selectedMechanic.email}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{selectedMechanic.phoneNumber}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Service Preference</Text>
                  <Text style={styles.detailValue}>{selectedMechanic.servicePreference}</Text>
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.suspendButton}
                  onPress={() => handleSuspend(selectedMechanic._id)}
                  disabled={suspending}
                >
                  {suspending ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.suspendButtonText}>Suspend Mechanic</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mechanicCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profilePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mechanicInfo: {
    marginLeft: 12,
    flex: 1,
  },
  mechanicName: {
    fontSize: 16,
    fontWeight: '600',
  },
  mechanicEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalBody: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },
  modalActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  suspendButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  suspendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },
});

export default ActiveMechanics;
