
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert, Platform, AppState, ScrollView,
} from 'react-native';
import config from '../../config';
import Sound from 'react-native-sound'; // Import Sound library
import { request, PERMISSIONS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Store availability state
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faBars} from '@fortawesome/free-solid-svg-icons';
import {Routes} from '../../Navigation/Routes';
import {useAuth} from '../../context/AuthContext';

const API_BASE_URL = config.API_BASE_URL;

const CustomSwitch = ({ isOn, onToggle }) => {
  const [animation] = useState(new Animated.Value(isOn ? 1 : 0));

  useEffect(() => {
    Animated.spring(animation, {
      toValue: isOn ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [isOn]);


  const backgroundColorInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', '#4CD964'],
  });

  const translateXInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[styles.switchContainer, { backgroundColor: '#E5E5E5' }]}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.switchTrack,
          {
            backgroundColor: backgroundColorInterpolate,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.switchThumb,
            {
              transform: [{ translateX: translateXInterpolate }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const MechanicHome = ({ navigation }) => {
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const { idToken } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const soundRef = useRef(null);
  const prevRequestCount = useRef(0); // Store previous request count
  const [region, setRegion] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loading, setLoading] = useState(true); // Added loading state
  const watchId = useRef(null);

  useEffect(() => {
    soundRef.current = new Sound('alert.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load sound', error);
      }
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, []);
  // Function to play the alert sound
  const playAlertSound = () => {
    if (soundRef.current) {
      soundRef.current.play((success) => {
        if (!success) {
          console.log('Sound playback failed');
        }
      });
    }
  };
  useEffect(() => {
    // Load stored availability status when the app starts
    const loadAvailability = async () => {
      const savedStatus = await AsyncStorage.getItem('isAvailable');
      if (savedStatus !== null) {
        setIsAvailable(JSON.parse(savedStatus));
      }
      else {
        setIsAvailable(false); // Default to false if no saved status
      }
    };

    loadAvailability();
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      await AsyncStorage.setItem('isAvailable', JSON.stringify(false)); // Set to false on close
      setIsAvailable(false);
    }
  };

  useEffect(() => {
    const loadAvailability = async () => {
      const savedStatus = await AsyncStorage.getItem('isAvailable');
      if (savedStatus !== null) {
        setIsAvailable(JSON.parse(savedStatus));
      } else {
        setIsAvailable(false);
      }
    };

    loadAvailability();

    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      appStateListener.remove(); // Proper cleanup
    };
  }, []);


  const requestLocationPermission = async () => {
    console.log('Requesting location permission...');
    if (Platform.OS === 'android') {
      const granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log('Android location permission granted:', granted);
      return granted === 'granted';
    } else {
      const granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return granted === 'granted';
    }
  };
  const fetchLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location access is required.');
      return;
    }

    watchId.current = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRegion((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
        console.log('Live Location Updated:', latitude, longitude);
      },
      (error) => {
        console.error('WatchPosition Error:', error);
      },
      { interval :10000 , enableHighAccuracy: false, distanceFilter: 10 }
    );
  };

  useEffect(() => {
    fetchLocation();
    return () => {
      if (watchId.current) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  const updateAvailability = async (status) => {
    if (status) {
      await fetchLocation();
      if (!region.latitude || !region.longitude) {
        Alert.alert('Error', 'Fetching location, please wait.');
        return;
      }
    } else {
      if (watchId.current) {
        Geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/mechanic/update-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          isAvailable: status,
          latitude: region.latitude,
          longitude: region.longitude,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsAvailable(status);
        await AsyncStorage.setItem('isAvailable', JSON.stringify(status));
        Alert.alert('Success', `Availability updated: ${status ? 'Available' : 'Unavailable'}`);
      } else {
        Alert.alert('Error', data.message || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };
  const handleAvailabilityToggle = async () => {
    const newStatus = !isAvailable;
    await updateAvailability(newStatus);
  };

  // Fetch Scheduled Appointments
  const fetchScheduledAppointments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule/mechanic-appointments`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await response.json();
      if (response.ok) {
        setScheduledAppointments(data.appointments);
      } else {
        console.error('Error fetching scheduled appointments:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // Fetch Emergency Requests
  const fetchEmergencyRequests = async () => {
    if (!isAvailable) {
      console.log('Mechanic is unavailable, skipping emergency requests fetch.');
      setEmergencyRequests([]); // Clear existing emergency requests when unavailable
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/emergency/show-requests`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        if (data.length > prevRequestCount.current) {
          playAlertSound(); // Play sound when a new request is detected
        }
        prevRequestCount.current = data.length;
        setEmergencyRequests(data);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch emergency requests.');
        console.error('Error fetching emergency requests:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  useEffect(() => {
    fetchScheduledAppointments();
    fetchEmergencyRequests();

    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      fetchScheduledAppointments();
      fetchEmergencyRequests();
    }, 15000);

    return () => clearInterval(interval); // Cleanup
  }, [isAvailable]);

  // Accept Emergency Request
  const handleAcceptEmergency = async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/emergency/accept-request/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        Alert.alert('Success', 'Emergency request accepted!');
        navigation.replace(Routes.MechanicBooking, { data });
        fetchEmergencyRequests(); // Refresh list
      } else {
        Alert.alert('Error', data.message || 'Could not accept request');
      }
    } catch (error) {
      console.error('Error accepting emergency request:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  // Reject Emergency Request
  const handleRejectEmergency = async (requestId) => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_BASE_URL}/emergency/reject-request/${requestId}`,
                {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                  },
                }
              );

              const data = await response.json();
              if (response.ok) {
                Alert.alert('Rejected', 'Request has been rejected.');
                fetchEmergencyRequests(); // Refresh the list
              } else {
                Alert.alert('Error', data.message || 'Could not reject request');
              }
            } catch (error) {
              console.error('Error rejecting emergency request:', error);
              Alert.alert('Error', 'Something went wrong');
            }
          },
        },
      ]
    );
  };


  const handleBookingAction = (action) => {
    if (action === 'accept') {
      navigation.navigate('MechanicBooking');
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=> navigation.navigate(Routes.MechanicMenu)}>
          <FontAwesomeIcon icon={faBars} size={20}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Welcome, Mechanic!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.availabilityCard}>
          <Text style={styles.cardTitle}>Your Availability</Text>
          <Text style={styles.cardSubtitle}>Set your status for receiving bookings</Text>
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleText, isAvailable && styles.toggleTextActive]}>
              Available
            </Text>
            <CustomSwitch isOn={isAvailable} onToggle={handleAvailabilityToggle} />
            <Text style={[styles.toggleText, !isAvailable && styles.toggleTextActive]}>
              Unavailable
            </Text>
          </View>
        </View>

        <ScrollView style={styles.container}>
          {/* Scheduled Appointments Section */}
          <View style={styles.section}>
            <Text style={styles.cardTitle}>Scheduled Appointments</Text>
            {scheduledAppointments.length === 0 ? (
              <Text style={styles.noDataText}>No upcoming appointments.</Text>
            ) : (
              scheduledAppointments.map((appointment) => (
                <View key={appointment._id} style={styles.card}>
                  <Text style={styles.cardTitle}>{appointment.serviceType}</Text>
                  <Text style={styles.detailText}>Date: {appointment.date}</Text>
                  <Text style={styles.detailText}>Time: {appointment.timeSlot}</Text>
                  <Text style={styles.detailText}>User: {appointment.userName}</Text>
                  <Text style={styles.detailText}>Location: {appointment.location}</Text>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => navigation.navigate('ScheduledAppointmentDetails', { appointment })}
                  >
                    <Text style={styles.detailsButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Emergency Requests Section */}
          <View style={styles.section}>
            <Text style={styles.cardTitle}>Emergency Requests</Text>
            {emergencyRequests.length === 0 ? (
              <Text style={styles.noDataText}>No emergency requests.</Text>
            ) : (
              emergencyRequests.map((request) => (
                <View key={request._id} style={styles.card}>
                  <Text style={styles.cardTitle}>{request.issueType}</Text>
                  <Text style={styles.detailText}>User: {request.userName || 'Unknown'}</Text>
                  <Text style={styles.detailText}>Vehicle: {request.vehicle.name || 'Not Provided'}</Text>
                  <Text style={styles.detailText}>
                    Location: {request.location ? `${request.location.latitude}, ${request.location.longitude}` : 'Unknown'}
                  </Text>
                  <Text style={styles.detailText}>
                    Distance: {request.distance ? `${request.distance} km away` : 'Calculating...'}
                  </Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleAcceptEmergency(request._id)}
                    >
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleRejectEmergency(request._id)}
                    >
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    flex: 1,
  },
  availabilityCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  toggleTextActive: {
    color: '#000',
    fontWeight: '500',
  },
  switchContainer: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
  },
  switchTrack: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    position: 'relative',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  detailsButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 4,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#4CD964',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 5,
  },
  rejectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MechanicHome;

