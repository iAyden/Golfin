import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Animated,
  Easing,
  ScrollView
} from 'react-native';

const UserCard = () => {
  const [showFront, setShowFront] = useState(true);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  //  MONGO
  const userCards = [
    {
      id: '1',
      name: 'KEVIN',
      role: 'FRONTEND PAPULIENCE',
      stats: 'porcentaje',
      image: require('@/assets/images/golf.png')
    },
    {
      id: '2', 
      name: 'LIAM',
      role: 'PAPU PERFIL',
      stats: '72% completado',
      image: require('@/assets/images/golf.png')
    },
    {
      id: '3',
      name: 'Diego',
      role: 'LE GUSTA PROGRAMAR EN PHP',
      stats: '91% completado',
      image: require('@/assets/images/golf.png')
    },
    {
      id: '4',
      name: 'almanza',
      role: 'Es cisco',
      stats: '64% completado',
      image: require('@/assets/images/golf.png')
    }
  ];

 // aqui simlume los datso
  const backButtons = [
  {
    id: '1',
    name: 'rampa',
    icon: '🎢', 
    onPress: () => console.log('Rampa se activo'),
    backgroundColor: '#3498db'
  },
  {
    id: '2',
    name: 'cachetada de los lados',
    icon: '👋🏻',
    onPress: () => console.log('Cachetada activada'),
    backgroundColor: '#9b59b6'
  },
  {
    id: '3',
    name: 'cosa del piso',
    icon: '💬',
    onPress: () => console.log('girador activado'),
    backgroundColor: '#2ecc71'
  },
  {
    id: '4',
    name: 'ventilador fuerte',
    icon: '🌬️',
    onPress: () => console.log('super ventilador activado'),
    backgroundColor: '#e74c3c'
  },
  {
    id: '5',
    name: 'Rampa',
    icon: '🎢',
    onPress: () => console.log('Rampa activvada'),
    backgroundColor: '#1abc9c'
  },
  {
    id: '6',
    name: 'carrito',
    icon: '⛳',
    onPress: () => console.log('Carrito activado '),
    backgroundColor: '#f39c12'
  },
  {
    id: '7',
    name: 'Terremoto',
    icon: '🌋',
    onPress: () => console.log('Terremoto activado'),
    backgroundColor: '#d35400'
  },
  {
    id: '8',
    name: 'Cachetada',
    icon: '👋🏻',
    onPress: () => console.log('Cachetada activada'),
    backgroundColor: '#34495e'
  },
  {
    id: '9',
    name: 'hoyo movible',
    icon: '⛳',
    onPress: () => console.log('hoyo movible activado'),
    backgroundColor: '#e74c3c'
  }
];

  // FLIP NO LE MUEVAN 
  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: showFront ? 180 : 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setShowFront(!showFront);
    });
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg']
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg']
  });

  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* FRENTE DE LA CARTA*/}
        <Animated.View 
          style={[
            styles.cardFace, 
            styles.cardFront, 
            frontAnimatedStyle,
            { display: showFront ? 'flex' : 'none' }
          ]}
        >
          <ScrollView contentContainerStyle={styles.frontContent}>
            <Text style={styles.mainTitle}>Panel de Usuarios</Text>
            <Text style={styles.subtitle}>Gestión de miembros del equipo</Text>
            
            <View style={styles.userCardsContainer}>
              {userCards.map(user => (
                <View key={user.id} style={styles.userCard}>
                  <Image source={user.image} style={styles.userImage} />
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userRole}>{user.role}</Text>
                  <Text style={styles.userStats}>{user.stats}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.flipButtonFront} 
              onPress={flipCard}
            >
              <Text style={styles.flipButtonText}>Ver Acciones</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        {/* PARTE DE ATRAS */}
        <Animated.View 
          style={[ styles.cardFace,  styles.cardBack,  backAnimatedStyle,
            { display: showFront ? 'none' : 'flex' } // no le muevan, es para que se vea la parte de atras con un rico ternario
          ]}
        >
          <Text style={styles.backTitle}>Trampas</Text>
          
          <View style={styles.buttonsGrid}>
                {backButtons.map((button) => (
                  <TouchableOpacity
                    key={button.id}
                    style={[styles.actionButton, {backgroundColor: button.backgroundColor}]}
                    onPress={button.onPress}
                  >
                    <Text style={styles.buttonIcon}>{button.icon}</Text>
                    <Text style={styles.actionButtonText}>{button.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
          
          <TouchableOpacity 
            style={styles.flipButtonBack} 
            onPress={flipCard}
          >
            <Text style={styles.flipButtonText}>Volver a Usuarios</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardFace: {
    width: '100%',
    height: '90%',
    borderRadius: 20,
    padding: 20,
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    backgroundColor: '#ffffff',
  },
  cardBack: {
    backgroundColor: '#eef2f7',
  },
  frontContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  userCardsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  userCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  userStats: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  backTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#3498db',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    padding: 5,
  },
  flipButtonFront: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  flipButtonBack: {
    backgroundColor: '#2c3e50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 'auto',
  },
  flipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
   buttonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },

});

export default UserCard;