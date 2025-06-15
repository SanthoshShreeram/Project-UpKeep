import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faWrench } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';

const API_BASE_URL = config.API_BASE_URL;

const OrderHistory = ({ navigation }) => {
  const { idToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const emergencyResponse = await fetch(
          `${API_BASE_URL}/emergency/mechanic-history`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const scheduledResponse = await fetch(
          `${API_BASE_URL}/schedule/mechanic-history`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const emergencyData = await emergencyResponse.json();
        const scheduledData = await scheduledResponse.json();

        const combinedOrders = [
          ...(emergencyData.orders || []),
          ...(scheduledData.orders || []),
        ];

        setOrders(combinedOrders);
      } catch (error) {
        console.error('Error fetching mechanic orders:', error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const renderOrderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { order: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.vehicleInfo}>
          <FontAwesomeIcon icon={faWrench} size={24} color="#007AFF" />
          <Text style={styles.vehicleName}>{item.vehicle?.name || 'N/A'}</Text>
        </View>
        <Text style={styles.amount}>{item.amount || 'N/A'}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.cardContent}>
        <Text style={styles.label}>
          Service Type:{' '}
          <Text style={styles.value}>
            {item.serviceName || item.issueType || 'N/A'}
          </Text>
        </Text>
        <Text style={styles.label}>
          Date:{' '}
          <Text style={styles.value}>
            {item.date || (item.createdAt ? item.createdAt.split('T')[0] : 'N/A')}
          </Text>
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={[styles.statusBadge, styles[item.status]]}>
          <Text style={styles.statusText}>
            {item.status?.toUpperCase() || 'PENDING'}
          </Text>
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
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderCard}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : `order-${index}`
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  cardContent: {
    gap: 8,
  },
  label: {
    color: '#666',
  },
  value: {
    color: '#000',
    fontWeight: '500',
  },
  cardFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  Completed: {
    backgroundColor: '#E8F5E9',
  },
  Pending: {
    backgroundColor: '#FFF3E0',
  },
  Scheduled: {
    backgroundColor: '#FFF3E0',
  },
  Accepted: {
    backgroundColor: '#FFF3E0',
  },
  Cancelled: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OrderHistory;
