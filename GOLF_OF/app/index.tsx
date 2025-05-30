import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Sidebar from '@/components/Sidebar';
import { Text } from '@/components/Themed';

const App: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeMenu, setActiveMenu] = useState('home'); // Cambiado a 'home'
  const sidebarWidth = useRef(new Animated.Value(250)).current;

  useEffect(() => {
    Animated.timing(sidebarWidth, {
      toValue: sidebarVisible ? 250 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [sidebarVisible]);

  const handleMenuPress = (menuItem: string) => {
    setActiveMenu(menuItem);
  };

  return (
    <View style={styles.container}>
      <Sidebar  
        isVisible={sidebarVisible} 
        width={sidebarWidth}
        onMenuItemPress={handleMenuPress}
        activeMenuItem={activeMenu}
      />

      <View style={styles.mainContent}>
        <Pressable
          style={styles.hamburgerButton}
          onPress={() => setSidebarVisible(!sidebarVisible)}
          accessibilityLabel="Toggle Sidebar"
        >
          <FontAwesome name="bars" size={24} color="#2f855a" />
        </Pressable>

        <View style={styles.ejemplo}>
          <Text>HOLAA</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0fff4',
  },
  mainContent: {
    flex: 1,
    padding: 20,
    zIndex: 0, // Asegura que el contenido esté detrás del sidebar
  },
  hamburgerButton: {
    marginBottom: 20,
  },
  ejemplo: { // Corregido el espacio antes de los dos puntos
    backgroundColor: '#FFF', // Corregido el color
    width: 100,
    height: 100
  }
});

export default App;