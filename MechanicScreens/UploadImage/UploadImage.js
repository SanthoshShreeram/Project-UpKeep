import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';

const UploadImage = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [preference, setPreference] = useState('');

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    }, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.assets && response.assets[0]) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = () => {
    // Handle submission logic here
    navigation.navigate('StatusLoading');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Details</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Profile photo</Text>
        <Text style={styles.subtitle}>Upload recent photo</Text>

        <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder} />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>

        <Text style={styles.preferenceTitle}>Service preference</Text>
        <TouchableOpacity style={styles.preferenceButton}>
          <Text style={styles.preferenceButtonText}>Select preference</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit for review</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  placeholder: {
    width: 150,
    height: 150,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 32,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  preferenceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  preferenceButton: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 16,
  },
  preferenceButtonText: {
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UploadImage;
