import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faAngleRight, faClose, faPerson, faUser} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import config from '../../config';

const API_BASE_URL = config.API_BASE_URL;

const AdminMechanicApproval = ({ navigation }) => {
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingMechanics, setPendingMechanics] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch pending mechanics
  useEffect(() => {
    fetchPendingMechanics();
  }, []);

  const fetchPendingMechanics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/pending-mechanics`);
      setPendingMechanics(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching mechanics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (mechanic) => {
    setSelectedMechanic(mechanic);
    setShowModal(true);
  };

  const handleAction = async (mechanicId, action) => {
    try {
      setLoading(true);
      const endpoint = action === 'approve' ? 'approve-mechanic' : 'reject-mechanic';
      console.log(`Sending ${action} request for mechanicId:`, mechanicId); // Debug log

      const response = await axios.post(`${API_BASE_URL}/admin/${endpoint}/${mechanicId}`);

      Alert.alert('Success', response.data.message);
      setShowModal(false);
      fetchPendingMechanics(); // Refresh list
    } catch (error) {
      console.error(`Error ${action}ing mechanic:`, error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderMechanicCard = (mechanic) => (
    <TouchableOpacity
      key={mechanic.id || mechanic._id}
      style={styles.mechanicCard}
      onPress={() => handleViewDetails(mechanic)}
    >
      <View style={styles.cardHeader}>
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
          </View>
        </View>
        <FontAwesomeIcon icon={faAngleRight} size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faAngleLeft} size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Approvals</Text>
      </View>

      <ScrollView style={styles.content}>
        {pendingMechanics.map(renderMechanicCard)}
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
      >
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
                  <Text style={styles.detailLabel}>Aadhar Number</Text>
                  <Text style={styles.detailValue}>{selectedMechanic.aadhar}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Workshop Address</Text>
                  <Text style={styles.detailValue}>{selectedMechanic.workshopAddress}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Service Preference</Text>
                  <Text style={styles.detailValue}>{selectedMechanic.servicePreference}</Text>
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleAction(selectedMechanic._id, 'reject')}
                >
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleAction(selectedMechanic._id, 'approve')}
                >
                  <Text style={styles.approveButtonText}>Approve</Text>
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  mechanicName: {
    fontSize: 16,
    fontWeight: '600',
  },
  mechanicEmail: {
    fontSize: 14,
    color: '#666',
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
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#4CD964',
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminMechanicApproval;
