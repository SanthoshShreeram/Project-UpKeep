import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCar, faTools, faLocationDot} from '@fortawesome/free-solid-svg-icons';

const OngoingBookingCard = ({booking, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <FontAwesomeIcon icon={faTools} size={24} color="#007AFF" />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.statusText}>Ongoing Service</Text>
        <View style={styles.infoRow}>
          <FontAwesomeIcon icon={faCar} size={12} color="#666" />
          <Text style={styles.vehicleText}>{booking?.vehicleName || 'Your Vehicle'}</Text>
          <View style={styles.dot} />
          <FontAwesomeIcon icon={faLocationDot} size={12} color="#666" />
          <Text style={styles.locationText}>
            {/*latitude={booking.location?.latitude ?? booking.coordinates?.latitude}*/}
            {/*longitude={booking.location?.longitude ?? booking.coordinates?.longitude} || */}
            'Current Location'</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>{booking?.status || 'In Progress'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // marginBottom: 10,
    bottom: 70, // Position above bottom navigation
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleText: {
    fontSize: 12,
    color: '#666',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#666',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
  },
  statusContainer: {
    marginLeft: 12,
  },
  statusBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: '600',
  },
});

export default OngoingBookingCard;
