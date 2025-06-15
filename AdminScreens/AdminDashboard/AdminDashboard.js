import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser} from '@fortawesome/free-regular-svg-icons';
import {
  faAngleRight, faBell, faSquareCheck, faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import {Routes} from '../../Navigation/Routes';
import axios from 'axios';
import config from '../../config';

const API_BASE_URL = config.API_BASE_URL;

const AdminDashboard = ({ navigation }) => {
  const { idToken } = useAuth();

  // Sample data - replace with your actual data
  const [dashboardData, setDashboardData] = useState({
    pendingApprovals: 0,
    activeMechanics: 0,
    todayBookings: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/admin-dashboard-stats`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.AdminProfile)}>
          <FontAwesomeIcon icon={faUser} size={20}  style={styles.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboardData.pendingApprovals}</Text>
            <Text style={styles.statLabel}>Pending Approvals</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboardData.activeMechanics}</Text>
            <Text style={styles.statLabel}>Active Mechanics</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboardData.todayBookings}</Text>
            <Text style={styles.statLabel}>Today's Bookings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹{dashboardData.totalEarnings}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
        </View>
        <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate(Routes.AdminMechanicApproval)}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuIconContainer}>
                  <FontAwesomeIcon icon={faUserCheck}/>
                </View>
                <Text style={styles.menuText}>Mechanic Approvals</Text>
              </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{dashboardData.pendingApprovals}</Text>
                </View>
              <FontAwesomeIcon icon={faAngleRight}/>
            </TouchableOpacity>
        </View>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate(Routes.ActiveMechanics)}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIconContainer}>
                <FontAwesomeIcon icon={faSquareCheck}/>
              </View>
              <Text style={styles.menuText}>Active Mechanics</Text>
            </View>
            <FontAwesomeIcon icon={faAngleRight}/>
          </TouchableOpacity>
        </View>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate(Routes.AdminBookings)}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIconContainer}>
                <FontAwesomeIcon icon={faBell}/>
              </View>
              <Text style={styles.menuText}>Bookings</Text>
            </View>
            <FontAwesomeIcon icon={faAngleRight}/>
          </TouchableOpacity>
        </View>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate(Routes.AdminServiceCenters)}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIconContainer}>
                <FontAwesomeIcon icon={faBell}/>
              </View>
              <Text style={styles.menuText}>Add Service Centers</Text>
            </View>
            <FontAwesomeIcon icon={faAngleRight}/>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminDashboard;
