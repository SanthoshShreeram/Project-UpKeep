import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import styles from './style';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAngleLeft,
  faLocationArrow,
  faLocationCrosshairs,
  faLocationPin, faShare,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import config from '../../../config';
import { Linking } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { ToastAndroid } from 'react-native';
import { Share } from 'react-native';
import {Routes} from '../../../Navigation/Routes';
import {useAuth} from '../../../context/AuthContext';
const API_BASE_URL = config.API_BASE_URL;

const CenterDetails = ({ route, navigation }) => {
  const { centerId } = route.params;
  const [centerDetails, setCenterDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Summary');
  const tabs = ['Summary', 'Reviews', 'Services', 'Quick Info'];
  const {idToken} = useAuth();
  const [reviews, setReviews] = useState([]);

  const handleReviewPress = () => {
    navigation.navigate('Review',{
        reviewerId: idToken, // Mechanic's Firebase UID
        reviewerRole: 'User',
        reviewedEntityId: centerId, // User's ID
        entityType: 'ServiceCenter',
        // requestId: data.request._id, // Completed request ID
      }); // pass centerId if needed
  };

  const handleDirectionPress = () => {
    const { latitude, longitude } = centerDetails.location; // make sure these values exist
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => console.error('Failed to open Google Maps', err));
  };

  const handleCopyPress = () => {
    Clipboard.setString(centerDetails.address);
    ToastAndroid.show('Address copied to clipboard!', ToastAndroid.SHORT);
  };

  const handleSharePress = async () => {
    try {
      await Share.share({
        message: `Check out this service center:\n${centerDetails.name}\n${centerDetails.address}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  // Fetch service center details
  useEffect(() => {
    const fetchCenterDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/service-center/${centerId}`);
        setCenterDetails(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching service center details:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/review-center/${centerId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
    fetchCenterDetails();
  }, [centerId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!centerDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Service center details not found.</Text>
      </View>
    );
  }

  // Render Header
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faAngleLeft} size={20} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Details</Text>
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.basicInfo}>
      <Text style={styles.name}>{centerDetails.name}</Text>
      <View style={styles.ratingContainer}>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>{centerDetails.ratings.average || 'N/A'}</Text>
          <Text style={styles.starIcon}>⭐</Text>
        </View>
        <Text style={styles.ratingCount}>{centerDetails.ratings.totalReviews || 0} Ratings</Text>
      </View>
      <Text style={styles.verifiedText}>Verified</Text>
      <Text style={styles.typeText}>Car and Bike Service</Text>
      <Text style={styles.openingTime}>Opens at {centerDetails.workingHours.monday.open || 'Unknown'}</Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleDirectionPress}>
          <FontAwesomeIcon icon={faLocationCrosshairs} color="red" size={20} />
          <Text>Direction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleReviewPress}>
          <FontAwesomeIcon icon={faStar} color="gold" size={20} />
          <Text>Review</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleSharePress}>
          <FontAwesomeIcon icon={faShare} color="blue" size={20} />
          <Text>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText,
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Reviews':
        return (
          <ScrollView style={styles.contentScrollView1}>
            <View style={styles.contentContainer1}>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <View key={index} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewerName}>{review.reviewerName || 'Gopi'}</Text>
                      <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
                    </View>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.infoText1}>No reviews available for this center yet.</Text>
              )}
            </View>
          </ScrollView>
        );

      // case 'Price List':
      //   return (
      //     <ScrollView style={styles.contentScrollView}>
      //       <View style={styles.contentContainer}>
      //         <View style={styles.priceCard}>
      //           <Text style={styles.serviceName}>Car Wash Service</Text>
      //           <Text style={styles.price}>Rs.250</Text>
      //         </View>
      //         <View style={styles.priceCard}>
      //           <Text style={styles.serviceName}>Car Wash Service</Text>
      //           <Text style={styles.price}>Rs.250</Text>
      //         </View>
      //         <TouchableOpacity style={styles.viewAllButton}>
      //           <Text style={styles.viewAllText}>View All</Text>
      //         </TouchableOpacity>
      //       </View>
      //     </ScrollView>
      //   );
      case 'Services':
        return (
          <ScrollView style={styles.contentScrollView}>
            <View style={styles.contentContainer}>
              {centerDetails.services?.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.serviceText}>{service}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        );
      case 'Quick Info':
        return (
          <ScrollView style={styles.contentScrollView}>
            <View style={styles.contentContainer}>
              <Text style={styles.infoTitle}>Address</Text>
              <Text style={styles.infoText}>{centerDetails.address}</Text>
              <Text style={styles.infoTitle}>Contact Info</Text>
              <Text style={styles.infoText}>{centerDetails.contactInfo}</Text>
              <View style={styles.directionCopyContainer}>
                <TouchableOpacity style={styles.directionButton}  onPress={handleDirectionPress}  >
                  <Text style={{ color: 'blue' }}>Direction</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.copyButton}  onPress={handleCopyPress}>
                  <Text style={{ color: 'blue' }}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        );
      default:
        return (
          <ScrollView style={styles.contentScrollView}>
            <View style={styles.contentContainer}>
              {/* Center Summary */}
              <Text style={styles.infoTitle}>About This Center</Text>
              <Text style={styles.infoText}>
                {centerDetails.name} is a trusted service provider offering car and bike services.
                Known for reliability and customer satisfaction, this center has served the community with quality service.
              </Text>
              <Text style={styles.infoTitle}>Top Services</Text>
              {centerDetails.services && centerDetails.services.length > 0 ? (
                centerDetails.services.slice(0, 3).map((service, index) => (
                  <View key={index} style={styles.serviceItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.serviceText}>{service}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.infoText}>No services listed yet.</Text>
              )}

              {/* Working Hours */}
              <Text style={styles.infoTitle}>Working Hours</Text>
              <Text style={styles.infoText}>
                {centerDetails.workingHours?.monday?.open && centerDetails.workingHours?.monday?.close
                  ? `Opens at ${centerDetails.workingHours.monday.open} - Closes at ${centerDetails.workingHours.monday.close}`
                  : 'Working hours not available'}
              </Text>

            </View>
          </ScrollView>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderBasicInfo()}
      {renderTabs()}
      {renderContent()}
    </View>
  );
};

export default CenterDetails;
