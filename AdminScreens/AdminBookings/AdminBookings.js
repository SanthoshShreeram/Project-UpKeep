import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faClock, faClose, faLocationDot, faPerson} from '@fortawesome/free-solid-svg-icons';
import config from '../../config';

const API_BASE_URL = config.API_BASE_URL;

const AdminBookings = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/bookings`);
      const { emergencyRequests, scheduledBookings } = response.data;

      // Transform emergency requests
      const formattedEmergencyRequests = emergencyRequests.map((booking) => ({
        id: booking._id,
        serviceType: 'Emergency Service',
        userId: booking.userId,
        mechanicName: booking.assignedMechanic, // Fetch mechanic details separately
        location: `Lat: ${booking.location.latitude}, Lng: ${booking.location.longitude}`,
        bookingTime: booking.createdAt,
        status: booking.status.toLowerCase(),
        vehicleDetails: `${booking.vehicle.name} (${booking.vehicle.fuelType})`,
        serviceName: booking.issueType, // Show issue type instead of customer name
        amount: 'N/A',
      }));

      // Transform scheduled bookings
      const formattedScheduledBookings = scheduledBookings.map((booking) => ({
        id: booking._id,
        serviceType: 'Scheduled Service',
        userId: booking.userId,
        mechanicName: booking.mechanicId, // Fetch mechanic details separately
        location: booking.address,
        bookingTime: booking.date && booking.time ? `${booking.date} ${booking.time}` : "Unknown Date", // Fix date concatenation
        status: booking.status.toLowerCase(),
        vehicleDetails: `${booking.vehicle.name} (${booking.vehicle.fuelType})`,
        serviceName: booking.serviceName, // Show service name instead of customer name
        amount: `₹${booking.amount}`
      }));

      // Merge and sort bookings by date (latest first)
      const allBookings = [...formattedEmergencyRequests, ...formattedScheduledBookings].sort(
        (a, b) => new Date(b.bookingTime) - new Date(a.bookingTime)
      );

      setBookings(allBookings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };
  const statusColors = {
    pending: '#FFD700',
    scheduled: '#FFA500',
    accepted: '#007AFF',
    ongoing: '#007AFF',
    completed: '#4CD964',
    cancelled: '#FF3B30',
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderBookingCard = (booking) => (
    <TouchableOpacity
      key={booking.id}
      style={styles.bookingCard}
      onPress={() => handleViewDetails(booking)}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.customerName}>{booking.serviceName}</Text>
          <Text style={styles.serviceType}>{booking.serviceType}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: statusColors[booking.status] }
        ]}>
          <Text style={styles.statusText}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <FontAwesomeIcon icon={faLocationDot} size={16} color="#666" />
          <Text style={styles.detailText}>{booking.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesomeIcon icon={faClock} size={16} color="#666" />
          <Text style={styles.detailText}>{booking.serviceType === "Emergency Service"
            ? formatDate(booking.bookingTime)  // Format only for emergency
            : booking.bookingTime}</Text>
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
        <Text style={styles.headerTitle}>Bookings</Text>
      </View>
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
        {['all', 'pending', 'scheduled', 'accepted','completed', 'cancelled'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filterStatus === status && styles.filterButtonActive,
            ]}
            onPress={() => handleStatusFilter(status)}
          >
            <Text style={[
              styles.filterButtonText,
              filterStatus === status && styles.filterButtonTextActive,
            ]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.content}>
          {bookings
            .filter((booking) => filterStatus === 'all' || booking.status === filterStatus)
            .map(renderBookingCard)}
        </ScrollView>
      )}

      {/* Booking Details Modal */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        {selectedBooking && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Booking Details</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <FontAwesomeIcon icon={faClose} size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>User ID</Text>
                  <Text style={styles.detailValue}>{selectedBooking.userId}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Service Name</Text>
                  <Text style={styles.detailValue}>{selectedBooking.serviceName}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Mechanic ID</Text>
                  <Text style={styles.detailValue}>{selectedBooking.mechanicName}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Service Type</Text>
                  <Text style={styles.detailValue}>{selectedBooking.serviceType}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Booking ID</Text>
                  <Text style={styles.detailValue}>{selectedBooking.id}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{selectedBooking.location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Booking Time</Text>
                  <Text style={styles.detailValue}>{selectedBooking.serviceType === "Emergency Service"
                    ? formatDate(selectedBooking.bookingTime) // Format only for Emergency Service
                    : selectedBooking.bookingTime}  {/* Keep original for Scheduled Service */}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={styles.detailValue}>{selectedBooking.amount}</Text>
                </View>
              </ScrollView>
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
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    marginBottom: 8,
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
});

export default AdminBookings;
