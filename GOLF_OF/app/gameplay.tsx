import React from 'react';
import { View } from 'react-native';
import UserCard from '@/components/Structures/GameCard'; // Adjust the path as needed

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <UserCard />
    </View>
  );
};

export default App;