import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClose, faPlus, faTimes} from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import config from '../../config';

const API_BASE_URL = config.API_BASE_URL;

const AdminServiceCenters = () => {
  const [centersList, setCentersList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactInfo: '',
    location: {
      coordinates: ['', ''], // [longitude, latitude]
    },
    workingHours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' },
    },
    services: [],
  });

  const [newService, setNewService] = useState('');

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleAddService = () => {
    if (newService.trim()) {
      setFormData({
        ...formData,
        services: [...formData.services, newService.trim()],
      });
      setNewService('');
    }
  };

  const handleRemoveService = (index) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: updatedServices });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.address || !formData.contactInfo) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!formData.location.coordinates[0] || !formData.location.coordinates[1]) {
      Alert.alert('Error', 'Please enter valid coordinates');
      return;
    }

    // Prepare the request body
    const requestBody = {
      name: formData.name,
      address: formData.address,
      contactInfo: formData.contactInfo,
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(formData.location.coordinates[0]), // Longitude
          parseFloat(formData.location.coordinates[1]), // Latitude
        ],
      },
      workingHours: formData.workingHours,
      services: formData.services,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/service-centers`, // Replace with your actual backend URL
        requestBody
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Service center added successfully');
        setShowAddModal(false);

        // Reset the form
        setFormData({
          name: '',
          address: '',
          contactInfo: '',
          location: {
            coordinates: ['', ''],
          },
          workingHours: {
            monday: { open: '', close: '' },
            tuesday: { open: '', close: '' },
            wednesday: { open: '', close: '' },
            thursday: { open: '', close: '' },
            friday: { open: '', close: '' },
            saturday: { open: '', close: '' },
            sunday: { open: '', close: '' },
          },
          services: [],
        });
      }
    } catch (error) {
      console.error('Error adding service center:', error);
      Alert.alert('Error', 'Failed to add service center');
    }
  };

  const renderAddForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Center Name"
        placeholderTextColor="#999" // Set a visible placeholder color
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Address"
        placeholderTextColor="#999" // Set a visible placeholder color
        multiline
        value={formData.address}
        onChangeText={(text) => setFormData({ ...formData, address: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Information"
        placeholderTextColor="#999" // Set a visible placeholder color
        value={formData.contactInfo}
        onChangeText={(text) => setFormData({ ...formData, contactInfo: text })}
      />

      <Text style={styles.sectionTitle}>Location Coordinates</Text>
      <View style={styles.coordinatesContainer}>
        <TextInput
          style={[styles.input, styles.coordinateInput]}
          placeholder="Longitude"
          placeholderTextColor="#999" // Set a visible placeholder color
          keyboardType="numeric"
          value={formData.location.coordinates[0].toString()}
          onChangeText={(text) => setFormData({
            ...formData,
            location: {
              ...formData.location,
              coordinates: [text, formData.location.coordinates[1]],
            },
          })}
        />
        <TextInput
          style={[styles.input, styles.coordinateInput]}
          placeholder="Latitude"
          placeholderTextColor="#999" // Set a visible placeholder color
          keyboardType="numeric"
          value={formData.location.coordinates[1].toString()}
          onChangeText={(text) => setFormData({
            ...formData,
            location: {
              ...formData.location,
              coordinates: [formData.location.coordinates[0], text],
            },
          })}
        />
      </View>

      <Text style={styles.sectionTitle}>Working Hours</Text>
      {days.map((day) => (
        <View key={day} style={styles.workingHoursRow}>
          <Text style={styles.dayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
          <View style={styles.hoursInputContainer}>
            <TextInput
              style={[styles.input, styles.timeInput]}
              placeholder="Open"
              placeholderTextColor="#999" // Set a visible placeholder color
              value={formData.workingHours[day].open}
              onChangeText={(text) => setFormData({
                ...formData,
                workingHours: {
                  ...formData.workingHours,
                  [day]: { ...formData.workingHours[day], open: text },
                },
              })}
            />
            <Text style={styles.toText}>to</Text>
            <TextInput
              style={[styles.input, styles.timeInput]}
              placeholder="Close"
              placeholderTextColor="#999" // Set a visible placeholder color
              value={formData.workingHours[day].close}
              onChangeText={(text) => setFormData({
                ...formData,
                workingHours: {
                  ...formData.workingHours,
                  [day]: { ...formData.workingHours[day], close: text },
                },
              })}
            />
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Services</Text>
      <View style={styles.servicesContainer}>
        <View style={styles.addServiceRow}>
          <TextInput
            style={[styles.input, styles.serviceInput]}
            placeholder="Add a service"
            placeholderTextColor="#999" // Set a visible placeholder color
            value={newService}
            onChangeText={setNewService}
          />
          <TouchableOpacity style={styles.addServiceButton} onPress={handleAddService}>
            <FontAwesomeIcon icon={faPlus} size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.servicesList}>
          {formData.services.map((service, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text style={styles.serviceText}>{service}</Text>
              <TouchableOpacity onPress={() => handleRemoveService(index)}>
                <FontAwesomeIcon icon={faClose} size={16} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Service Center</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Service Centers</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(!showAddModal)}
          >
            <FontAwesomeIcon icon={faPlus} size={20} color="#fff"/>
          </TouchableOpacity>
        </View>

        {showAddModal ? (
          renderAddForm()
        ) : (
          <View style={styles.centersList}>
            {/* List of service centers will be rendered here */}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordinateInput: {
    flex: 0.48,
  },
  workingHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayLabel: {
    width: 100,
    fontSize: 14,
  },
  hoursInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    flex: 1,
    marginBottom: 0,
  },
  toText: {
    marginHorizontal: 8,
  },
  servicesContainer: {
    marginBottom: 16,
  },
  addServiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  addServiceButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  serviceText: {
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminServiceCenters;
