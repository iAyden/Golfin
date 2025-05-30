import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Sidebar from '@/components/Sidebar'; // Ajusta la ruta según tu estructura
import { Text } from '@/components/Themed';

const App: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeMenu, setActiveMenu] = useState('two');
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
    // se puede agregar lOgica adicional cuando se selecci o na un tiem
  };

  return (
    <View style={styles.container}>
      <Sidebar  
        isVisible={sidebarVisible} 
        width={sidebarWidth}
        onMenuItemPress={handleMenuPress}
        activeMenuItem={activeMenu}
      />

      {/* Contenido principal */}
      <View style={styles.mainContent}>
        <Pressable
          style={styles.hamburgerButton}
          onPress={() => setSidebarVisible(!sidebarVisible)}
          accessibilityLabel="Toggle Sidebar"
        >
          <FontAwesome name="bars" size={24} color="#2f855a" />
        </Pressable>

        <View style={styles.ejemplo}> <Text>HOLAA</Text> </View>

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
  },
  hamburgerButton: {
    marginBottom: 20,
  },
  ejemplo :{
    backgroundColor: '#FFFF',
    width: 100,
    height: 100
  }


});

export default App;