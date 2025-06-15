import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput, Alert,
} from 'react-native';
import {faAngleLeft, faStar} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useAuth} from '../../context/AuthContext';
import {Routes} from '../../Navigation/Routes';
import config from '../../config';

const API_BASE_URL = config.API_BASE_URL;


const Review = ({ navigation, route }) => {
  const { reviewerId, reviewerRole, reviewedEntityId, entityType, requestId } = route.params || {};
  const {idToken} = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (!rating || !review) {return;}
    console.log(rating);
    console.log('requestId',requestId);
    console.log('reviewerId',reviewerId);
    console.log('reviewerRole',reviewerRole);
    console.log('reviewedEntityId',reviewedEntityId);
    console.log('entityType',entityType);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`},
        body: JSON.stringify({
          reviewerRole,
          reviewedEntityId,
          entityType,
          rating,
          comment: review,
          // requestId,
        }),
      });

      const data = await response.json();
      if (response.ok ) {
        Alert.alert('Review submitted successfully');

        if (reviewerRole === 'Mechanic') {
          navigation.replace(Routes.MechanicHome);
        } else if (reviewerRole === 'User') {
          navigation.replace(Routes.Home);
        } else {
          navigation.goBack(); // fallback
        }
      } else {
        Alert.alert(data.message);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Something went wrong');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faAngleLeft}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write a Review</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleStarPress(star)}
              style={styles.starButton}
            >
              <FontAwesomeIcon icon={faStar} size={32} color={star <= rating ? '#FFD700' : '#E5E5E5'}/>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.reviewLabel}>Tell us about your experience</Text>
        <View style={styles.reviewInputContainer}>
          <TextInput
            style={styles.reviewInput}
            multiline
            numberOfLines={6}
            placeholder="Write your review here..."
            value={review}
            onChangeText={setReview}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!rating || !review) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!rating || !review}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
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
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  starButton: {
    padding: 8,
  },
  reviewLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  reviewInputContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  reviewInput: {
    padding: 12,
    fontSize: 16,
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Review;
