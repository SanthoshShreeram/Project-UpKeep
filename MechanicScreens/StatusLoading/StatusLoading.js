import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const StatusLoading = ({ navigation }) => {
  const handleLogout = () => {
    // Handle logout logic here
    // navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Icon name="time-outline" size={48} color="#000" />

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Status : Pending</Text>
        </View>

        <Text style={styles.message}>
          Your application has been submitted for admin review. The review typically
          takes up to 24 hours. You will receive an SMS notification upon approval.
        </Text>

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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  statusContainer: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '500',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
  },
});

export default StatusLoading;
