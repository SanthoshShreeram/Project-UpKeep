import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const Earnings = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faAngleLeft} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.earningsCard}>
          <View style={styles.todayEarnings}>
            <Text style={styles.sectionTitle}>Today's Earnings</Text>
            <Text style={styles.amount}>Rs.0</Text>
          </View>

          <TouchableOpacity
            style={styles.ordersSection}
            onPress={() => navigation.navigate('OrderHistory')}
          >
            <View>
              <Text style={styles.sectionTitle}>All orders</Text>
              <Text style={styles.sectionSubtitle}>
                Order history and order earnings
              </Text>
            </View>
            <FontAwesomeIcon icon={faAngleRight}/>
          </TouchableOpacity>
        </View>
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
  },
  earningsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  todayEarnings: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ordersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default Earnings;
