import React from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const width = Dimensions.get('window').width;

const LoginCarousel = () => {
  const data = [
    {
      image: require('../../assets/images/oil.png'),
      text: 'Book emergency car services anytime, anywhere.',
    },
    {
      image: require('../../assets/images/icons8-car-wash-100.png'),
      text: 'Get 50% off your first car wash!',
    },
    {
      image: require('../../assets/images/logo.png'),
      text: 'Track your fuel & service history easily.',
    },
  ];

  return (
    <Carousel
      loop
      width={width}
      height={250}
      autoPlay={true}
      data={data}
      scrollAnimationDuration={1000}
      renderItem={({item}) => (
        <View style={styles.carouselItem}>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.caption}>{item.text}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  caption: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});

export default LoginCarousel;
