import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faAngleRight, faUser} from '@fortawesome/free-solid-svg-icons';
import {useAuth} from '../../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import config from '../../config';

const API_BASE_URL = config.API_BASE_URL;


const MechanicMenu = ({ navigation }) => {
  const { logout, idToken } = useAuth();
  const nav = useNavigation();
  const [mechanic, setMechanic] = useState(null);

  useEffect(() => {
    const fetchMechanicDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/mechanic/details`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`, // Firebase token
          },
        });

        const data = await response.json();
        if (response.ok) {
          setMechanic(data);
        } else {
          Alert.alert('Error', data.message);
        }
      } catch (error) {
        console.error('Error fetching mechanic details:', error);
        Alert.alert('Error', 'Something went wrong');
      }
    };

    fetchMechanicDetails();
  }, []);

  const menuItems = [
    {
      title: 'Earnings',
      onPress: () => navigation.navigate('Earnings'),
    },
    {
      title: 'Update service preferences',
      onPress: () => navigation.navigate('MechanicPreference'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            await logout();
            nav.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faAngleLeft} size={24} color="#000"/>
        </TouchableOpacity>
      </View>

      <View style={[styles.profileCard,styles.profileImageContainer]}>
        <View style={styles.profileImageContainer}>
          <FontAwesomeIcon icon={faUser} size={40} color="#007AFF"/>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{mechanic?.name}</Text>
          <Text style={styles.detailText}>Gender: {mechanic?.gender}</Text>
          <Text style={styles.detailText}>Phone: {mechanic?.phoneNumber}</Text>
          <Text style={styles.detailText}>Email: {mechanic?.email}</Text>
          <Text style={styles.detailText}>Aadhar: {mechanic?.aadharNumber}</Text>
        </View>
      </View>

      <View style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Text style={styles.menuText}>{item.title}</Text>
            <FontAwesomeIcon icon={faAngleRight} size={20} color="#000"/>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  profileCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImageFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  menuCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuText: {
    fontSize: 16,
  },
  logoutButton: {
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
  },
});

export default MechanicMenu;
