import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView, Alert,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faCheck, faClose} from '@fortawesome/free-solid-svg-icons';
import {useAuth} from '../../context/AuthContext';
import config from '../../config';

const API_BASE_URL = config.API_BASE_URL;

const MechanicPreference = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState('');
  const { idToken } = useAuth();

  useEffect(() => {
    const fetchPreference = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/mechanic/preference`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`, // Firebase token
          },
        });

        const data = await response.json();
        if (response.ok) {
          setSelectedPreference(data.servicePreference);
        } else {
          Alert.alert('Error', data.message);
        }
      } catch (error) {
        console.error('Error fetching service preference:', error);
        Alert.alert('Error', 'Something went wrong');
      }
    };

    fetchPreference();
  }, []);
  const preferences = [
    'Emergency service only',
    'Scheduled service only',
    'Both',
  ];

  const handlePreferenceSelect = async (preference) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/mechanic/preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`, // Firebase token
        },
        body: JSON.stringify({ servicePreference: preference }),
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedPreference(preference);
        setShowModal(false);
        Alert.alert('Success', 'Service preference updated successfully');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error updating service preference:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faAngleLeft}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update service preferences</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Service preference</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.selectButtonText}>
            {selectedPreference || 'Select preference'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Preference</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faClose} size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {preferences.map((preference, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.preferenceItem}
                  onPress={() => handlePreferenceSelect(preference)}
                >
                  <Text style={styles.preferenceText}>{preference}</Text>
                  {selectedPreference === preference && (
                    <FontAwesomeIcon icon={faCheck} size={24} color="lightgreen" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
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
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
  },
  selectButtonText: {
    fontSize: 16,
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
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  preferenceText: {
    fontSize: 16,
  },
});

export default MechanicPreference;
