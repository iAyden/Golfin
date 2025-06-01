import React from 'react';
import { View, StyleSheet } from 'react-native';
import GolfLogin from '@/components/UserComponents/GolfLogin';

export default function login() {
  return (
    <View style={styles.container}>
      <GolfLogin />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});