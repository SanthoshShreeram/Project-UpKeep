import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView, Linking, Alert,
} from 'react-native';
import {Routes} from '../../Navigation/Routes';
import {useAuth} from '../../context/AuthContext';
import MechanicHome from '../MechanicHome/MechanicHome';
import config from '../../config';

const API_BASE_URL = config.API_BASE_URL;


const MechanicBooking = ({ navigation, route }) => {
  const { data } = route.params || {};
  const { idToken } = useAuth();
  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerTitle}>Error: No Booking Data</Text>
      </SafeAreaView>
    );
  }

  const handleViewLocation = () => {
    // Open Maps with the provided location
    const url = `https://www.google.com/maps/search/?api=1&query=${data.request.location.latitude},${data.request.location.longitude}`;
    Linking.openURL(url);  };

  const handleCallCustomer = () => {
    // Handle calling customer
    Linking.openURL(`tel:${data.customerPhone}`);

  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_BASE_URL}/emergency/cancel-request/${data.request._id}`,
                {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                  },
                }
              );

              const result = await response.json();

              if (response.ok) {
                Alert.alert('Success', 'Booking has been cancelled.');
                navigation.navigate(Routes.MechanicHome);
              } else {
                Alert.alert('Error', result.message || 'Could not cancel booking');
              }
            } catch (error) {
              console.error('Error cancelling booking:', error);
              Alert.alert('Error', 'Something went wrong');
            }
          },
        },
      ]
    );
  };


  const handleMarkComplete = () => {
    Alert.alert(
      'Complete Service',
      'Are you sure you want to mark this service as completed?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_BASE_URL}/emergency/complete-request/${data.request._id}`,
                {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                  },
                }
              );

              const result = await response.json();

              if (response.ok) {
                Alert.alert('Success', 'Service marked as completed.');
                navigation.navigate(Routes.Review, {
                  reviewerId: idToken, // Mechanic's Firebase UID
                  reviewerRole: 'Mechanic',
                  reviewedEntityId: data.request.userId, // User's ID
                  entityType: 'User',
                  requestId: data.request._id, // Completed request ID
                }); // Navigate to review screen
              } else {
                Alert.alert('Error', result.message || 'Could not complete service');
              }
            } catch (error) {
              console.error('Error completing request:', error);
              Alert.alert('Error', 'Something went wrong');
            }
          },
        },
      ]
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Booking Confirmed!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Service Details</Text>
        <Text style={styles.confirmationText}>
          You have successfully accepted this order
        </Text>


        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Service Type: {data.request.service}</Text>
          <Text style={styles.detailText}>Customer Name: {data.customerName}</Text>
          <Text style={styles.detailText}>Vehicle: {data.request.vehicle.name}</Text>
          <Text style={styles.detailText}>Issue: {data.request.issueType}</Text>
          <Text style={styles.detailText}>Location: {data.request.location.latitude + ',' + data.request.location.longitude}</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.locationButton]}
          onPress={handleViewLocation}
        >
          <Text style={styles.buttonText}>View Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.callButton]}
          onPress={handleCallCustomer}
        >
          <Text style={styles.callButtonText}>Call Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancelBooking}
        >
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={handleMarkComplete}
        >
          <Text style={styles.buttonText}>Mark as Completed</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  confirmationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  locationButton: {
    backgroundColor: '#007AFF',
  },
  callButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  callButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  completeButton: {
    backgroundColor: '#4CD964',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MechanicBooking;
