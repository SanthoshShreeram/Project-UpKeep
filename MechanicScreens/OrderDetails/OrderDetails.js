import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faAngleLeft,
  faCalendar,
  faClock,
  faGear,
  faPhone,
  faUser,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';

const MechanicOrderDetails = ({ route, navigation }) => {
  const { order } = route.params;
  console.log(order);

  const renderStatusBadge = (status) => {
    const statusColors = {
      accepted: '#FFD700',
      pending: '#FFD700',
      scheduled: '#FFD700',
      completed: '#4CD964',
      cancelled: '#FF3B30',
    };

    return (
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: statusColors[status?.toLowerCase()] || '#FFD700' },
        ]}
      >
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesomeIcon icon={faAngleLeft} size={20} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Order ID and Status */}
        <View style={styles.card}>
          <Text style={styles.bookingId}>Order #{order?._id}</Text>

          {/* Status (Placed Below the Order ID) */}
          <View style={{ marginTop: 8, alignSelf: 'flex-start' }}>
            {renderStatusBadge(order?.status || 'Pending')}
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.detailRow}>
            <FontAwesomeIcon icon={faWrench} size={16} color="#666" />
            <Text style={styles.detailText}>
              {order?.serviceName || order?.issueType || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <FontAwesomeIcon icon={faCalendar} size={16} color="#666" />
            <Text style={styles.detailText}>
              {order?.date || (order?.createdAt ? order.createdAt.split('T')[0] : 'N/A')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <FontAwesomeIcon icon={faClock} size={16} color="#666" />
            <Text style={styles.detailText}>
              {order?.time ||
                (order?.createdAt
                  ? new Date(order.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                  : 'N/A')}
            </Text>
          </View>
        </View>

        {/* Vehicle Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          <View style={styles.detailRow}>
            <FontAwesomeIcon icon={faGear} size={16} color="#666" />
            <Text style={styles.detailText}>{order?.vehicle?.name || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <FontAwesomeIcon icon={faGear} size={16} color="#666" />
            <Text style={styles.detailText}>{order?.vehicle?.vehicleType || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <FontAwesomeIcon icon={faGear} size={16} color="#666" />
            <Text style={styles.detailText}>{order?.vehicle?.fuelType || 'N/A'}</Text>
          </View>
        </View>

        {/* Price Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Charge</Text>
            <Text style={styles.priceValue}>₹{order?.serviceCharge || 0}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Parts & Materials</Text>
            <Text style={styles.priceValue}>₹{order?.partsCharge || 0}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              ₹{(order?.serviceCharge || 0) + (order?.partsCharge || 0)}
            </Text>
          </View>
        </View>

        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingId: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  callButtonText: {
    color: '#FFF',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default MechanicOrderDetails;
