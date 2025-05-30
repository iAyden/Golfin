import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';

type CardItemProps = {
  image: ImageSourcePropType;
  title: string;
  description: string;
};

const CardItem: React.FC<CardItemProps> = ({ image, title, description }) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        <Text style={styles.description}>{description.toUpperCase()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bdbdff',
    padding: 10,
    borderRadius: 20,
    margin: 10,
    width: '90%',
    alignSelf: 'center',
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 2,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
  },
  description: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default CardItem;