import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Animated,
  Easing,
  ScrollView,
  Alert,
  ImageSourcePropType,
  Dimensions,
  Platform
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";

////////////////// DECLARACIONES DE LOS TIPOS ///////////////////////
type UserCardType = {
  id: string;
  name: string;
  role: string;
  score: number;
  karma: number; 
  image: ImageSourcePropType;
};

type ShopItemType = {
  id: string;
  name: string;
  icon: ImageSourcePropType; // Changed from string to ImageSourcePropType
  cost: number;
  backgroundColor: string;
};

type icons = {
  karmaIcon: ImageSourcePropType;
  scoreIcon: ImageSourcePropType;
  clock: ImageSourcePropType;
  ramp: ImageSourcePropType;
  slap: ImageSourcePropType;
  obstacle: ImageSourcePropType;
  fan: ImageSourcePropType;
  vipRamp: ImageSourcePropType;
  cart: ImageSourcePropType;
  earthquake: ImageSourcePropType;
  vipSlap: ImageSourcePropType;
  movingHole: ImageSourcePropType;
};

////////////////////////////////////////////////////////

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

const icons: icons = {
  karmaIcon: require('@/assets/images/fireC.png'),
  scoreIcon: require('@/assets/images/fireC.png'),
  clock: require('@/assets/images/fireC.png'),
  ramp: require('@/assets/images/fireC.png'),
  slap: require('@/assets/images/fireC.png'),
  obstacle: require('@/assets/images/fireC.png'),
  fan: require('@/assets/images/fireC.png'),
  vipRamp: require('@/assets/images/fireC.png'),
  cart: require('@/assets/images/fireC.png'),
  earthquake: require('@/assets/images/fireC.png'),
  vipSlap: require('@/assets/images/fireC.png'),
  movingHole: require('@/assets/images/fireC.png'),
};

const UserCard: React.FC = () => {
  // Variable para la carta 
  const [showFront, setShowFront] = useState<boolean>(true);

  /////////// Variables para el sistema de karma y puntos ///////////////
  const initailPoints = [100, 200, 300];
  const indexpoints = Math.floor(Math.random() * initailPoints.length);
  const [points, setPoints] = useState<number>(initailPoints[indexpoints]);
  const [karma, setKarma] = useState<number>(0);
  ////////////////////////////////////////////////////////////////////////

  ////////////////////// Variables para el temporizador //////////////////
  const [seconds, setSeconds] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  ///////////////////////////////////////////////////////////////////////


  const flipAnimation = useRef(new Animated.Value(0)).current; // Esta es para la animacion del volteo. 

  // ESTA ES LA FCKING PARTE DEL TIMER NO LE MUEVAN SUFRI MUCHO POR UNAS DEPENDENCIAS DE NODE
  useEffect(() => {
    let interval: number;

    if (gameStarted) {
      interval = setInterval(() => { setSeconds(prevSeconds => prevSeconds + 1); }, 1000);
    }

    return () => {
      if (interval) { clearInterval(interval); }
    };
  }, [gameStarted]);

  // NO LE MUEVAN POR FAVOR, ES POR UNA MADRE DE NODE
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  // esto es de ejemplo 
  const userCards: UserCardType[] = [
    {
      id: '1',
      name: 'KEVIN',
      role: 'FRONTEND PAPULIENCE',
      score: 5,
      karma: 7,
      image: require('@/assets/images/golf.png'), 
    },
    {
      id: '2', 
      name: 'LIAM',
      role: 'PAPU PERFIL',
      score: 6,
      karma: 7,
      image: require('@/assets/images/golf.png')
    },
    {
      id: '3',
      name: 'Diego',
      role: 'LE GUSTA PROGRAMAR EN PHP',
      score: 9,
      karma: 7,
      image: require('@/assets/images/golf.png')
    },
    {
      id: '4',
      name: 'almanza',
      role: 'Es cisco',
      score: 6,
      karma: 7,
      image: require('@/assets/images/golf.png')
    }
  ];

  // Updated shop items with images instead of emojis
  const shopItems: ShopItemType[] = [
    {
      id: '1',
      name: 'Rampa',
      icon: icons.ramp, 
      cost: 600,
      backgroundColor: '#2ecc71'
    },
    {
      id: '2',
      name: 'Cachetada lateral',
      icon: icons.slap,
      cost: 500,
      backgroundColor: '#2ecc71'
    },
    {
      id: '3',
      name: 'Obstáculo',
      icon: icons.obstacle,
      cost: 100,
      backgroundColor: '#2ecc71'
    },
    {
      id: '4',
      name: 'Ventilador',
      icon: icons.fan,
      cost: 250,
      backgroundColor: '#2ecc71'
    },
    {
      id: '5',
      name: 'Rampa VIP',
      icon: icons.vipRamp,
      cost: 350,
      backgroundColor: '#2ecc71'
    },
    {
      id: '6',
      name: 'Carrito',
      icon: icons.cart,
      cost: 700,
      backgroundColor: '#2ecc71'
    },
    {
      id: '7',
      name: 'Terremoto',
      icon: icons.earthquake,
      cost: 400,
      backgroundColor: '#2ecc71'
    },
    {
      id: '8',
      name: 'Cachetada VIP',
      icon: icons.vipSlap,
      cost: 300,
      backgroundColor: '#2ecc71'
    },
    {
      id: '9',
      name: 'Hoyo móvil',
      icon: icons.movingHole,
      cost: 500,
      backgroundColor: '#2ecc71'
    }
  ];

  const buyItem = (itemId: string): void => {
    if (!gameStarted) { Alert.alert('Espera', 'INICIA EL GAME PIRIMERO'); return; }

    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    ////////////////////   AQUI SE SUMAN LOS PUNTOS /////////////////////////////// 
    if (points >= item.cost) { setPoints(prevPoints => prevPoints + item.cost); } 
    else { Alert.alert('Error', 'NO TIENES PUNTOS'); }
  };

  const flipCard = () => {
    if (!gameStarted) { Alert.alert('Espera', 'INICIA PRIMERO EL JUEGO'); return; }

    Animated.timing(flipAnimation, {
      toValue: showFront ? 180 : 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setShowFront(!showFront);
    });
  };

  const startGame = () => { setGameStarted(true); setSeconds(0); };

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
        {/* FRENTE DE LA CARTA */}
        <Animated.View 
          style={[
            styles.cardFace, 
            styles.cardFront, 
            frontAnimatedStyle,
            { display: showFront ? 'flex' : 'none' }
          ]}
        >
          <ScrollView 
            contentContainerStyle={styles.frontContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.frontHeader}>
              <Text style={styles.mainTitle}>Party</Text>
              {gameStarted && (
                <View style={styles.timeDisplayFront}>
                  <Image source={icons.clock} style={styles.iconImageSmall}/>
                  <Text style={styles.timeTextFront}>{formatTime(seconds)}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.userCardsContainer}>
              {userCards.map(user => (
                <View key={user.id} style={styles.userCard}>
                  <View style={styles.userInfoContainer}>
                    <Image source={user.image} style={styles.userImage} />
                    <View style={styles.userTextContainer}>
                      <Text style={styles.userName}>{user.name}</Text>
                      <Text style={styles.userRole}>{user.role}</Text>
                    </View>
                  </View>
                  <View style={styles.pointsContainerRight}>
                    <View style={styles.pointsRow}>
                      <Image source={icons.scoreIcon} style={styles.iconImage} />
                      <Text style={styles.pointsText}>{user.score}</Text>
                    </View>
                    <View style={styles.pointsRow}>
                      <Image source={icons.karmaIcon} style={styles.iconImage} />
                      <Text style={styles.pointsText}>{user.karma}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            {!gameStarted ? (
              <TouchableOpacity style={styles.startButton} onPress={startGame}>
                <Text style={styles.startButtonText}>EMPEZAR</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
                <Text style={styles.flipButtonText}>Ir a la Tienda</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </Animated.View>

        {/* TRASERO DE LA CARTA */}
        <Animated.View 
          style={[ 
            styles.cardFace,  
            styles.cardBack,  
            backAnimatedStyle,
            { display: showFront ? 'none' : 'flex' }
          ]}
        >
          <ScrollView 
            contentContainerStyle={styles.backContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>Traps</Text>
              <Text style={styles.subtitle}>Use an hability to get karma</Text>
            </View>

            <View style={styles.showStatsContainer}>
              <View style={styles.pointsKarmaContainer}>
                <View style={styles.pointsContainer}> 
                  <Text style={styles.pointsText}><Image source={icons.clock} style={styles.iconImage}/>: {formatTime(seconds)}</Text>
                </View>
                <View style={styles.badPointsContainer}>
                  <Text style={styles.pointsText}>Round : {karma}</Text>
                </View>
              </View>
              <View style={styles.timeContainer}>
                <View style={styles.pointsContainer}> 
                  <Text style={styles.pointsText}><Image source={icons.scoreIcon} style={styles.iconImage}/>: {points}</Text>
                </View>
                <View style={styles.badPointsContainer}>
                  <Text style={styles.pointsText}><Image source={icons.karmaIcon} style={styles.iconImage}/>: {karma}</Text>
                </View>
              </View>
            </View>
          
            <View style={styles.shopGrid}>
              {shopItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.shopItem, 
                    {backgroundColor: item.backgroundColor},
                    (points < item.cost || !gameStarted) && styles.disabledItem
                  ]}
                  onPress={() => buyItem(item.id)}
                  disabled={points < item.cost || !gameStarted}
                >
                  <Image source={item.icon} style={styles.itemImage} />
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.cost} pts</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={[styles.flipButton, !gameStarted && styles.disabledButton]} 
              onPress={flipCard}
              disabled={!gameStarted}
            >
              <Text style={styles.flipButtonText}>Back to lobby</Text>
            </TouchableOpacity>
          </ScrollView>
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
    padding: isSmallDevice ? 10 : 20,
  },
  cardFace: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardFront: {
    backgroundColor: '#ffffff',
  },
  cardBack: {
    backgroundColor: '#eef2f7',
  },
  frontContent: {
    flexGrow: 1,
    padding: isSmallDevice ? 10 : 20,
    paddingBottom: isSmallDevice ? 20 : 40,
    alignItems: 'center',
  },
  backContent: {
    flexGrow: 1,
    padding: isSmallDevice ? 10 : 20,
    paddingBottom: isSmallDevice ? 20 : 40,
  },
  frontHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: isSmallDevice ? 5 : 10,
  },
  timeDisplayFront: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: isSmallDevice ? 5 : 8,
    borderRadius: 20,
  },
  timeTextFront: {
    color: '#2c3e50',
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  showStatsContainer: {
    flexDirection: isSmallDevice ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isSmallDevice ? 'center' : 'flex-start',
    width: '100%',
    marginBottom: isSmallDevice ? 20 : 40,
  },
  titleContainer: { 
    flex: 1,
    marginTop: isSmallDevice ? 5 : 10,
  },
  pointsKarmaContainer: {
    alignItems: isSmallDevice ? 'center' : 'flex-end',
    marginLeft: isSmallDevice ? 0 : 10,
    marginBottom: isSmallDevice ? 10 : 0,
  },
  mainTitle: {
    fontSize: isSmallDevice ? 40 : isTablet ? 70 : 60,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: isSmallDevice ? 4 : 8,
  },
  subtitle: {
    fontSize: isSmallDevice ? 16 : isTablet ? 25 : 23,
    color: '#7f8c8d',
  },
  pointsContainer: {
    backgroundColor: '#f8f9fa',
    padding: isSmallDevice ? 8 : 10,
    borderRadius: 20,
    marginBottom: isSmallDevice ? 8 : 10,
    minWidth: isSmallDevice ? 100 : 120,
  },
  timeContainer: {
    alignItems: isSmallDevice ? 'center' : 'flex-start',
    marginLeft: isSmallDevice ? 0 : 10,
  },
  badPointsContainer: {
    backgroundColor: '#f8f9fa',
    padding: isSmallDevice ? 8 : 10, 
    borderRadius: 20, 
    minWidth: isSmallDevice ? 100 : 120,
  },
  pointsText: {
    color: '#f1c40f',
    fontSize: isSmallDevice ? 16 : 20, 
    fontWeight: 'bold',
  },
  userCardsContainer: {
    width: '100%',
    marginBottom: isSmallDevice ? 10 : 20,
    margin: isSmallDevice ? 10 : 20,
  },
  frontStats: {
    alignItems: 'flex-end',
  },
  userCard: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: isSmallDevice ? 10 : 15,
    marginBottom: isSmallDevice ? 15 : 30,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userTextContainer: {
    marginLeft: isSmallDevice ? 10 : 20,
  },
  userImage: {
    width: isSmallDevice ? 50 : 70,
    height: isSmallDevice ? 50 : 70,
    borderRadius: 35,
  },
  iconImage: {
    width: isSmallDevice ? 20 : 25,
    height: isSmallDevice ? 20 : 25,
    borderRadius: 40,
  },
  iconImageSmall: {
    width: isSmallDevice ? 16 : 20,
    height: isSmallDevice ? 16 : 20,
    borderRadius: 40,
  },
  itemImage: {
    width: isSmallDevice ? 40 : 50,
    height: isSmallDevice ? 40 : 50,
    marginBottom: isSmallDevice ? 3 : 5,
  },
  userName: {
    fontSize: isSmallDevice ? 16 : 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  userRole: {
    fontSize: isSmallDevice ? 12 : 14,
    color: '#7f8c8d',
  },
  pointsContainerRight: {
    alignItems: 'center', 
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: isSmallDevice ? 1 : 2, 
  },
  userPoints: {
    fontSize: 10,
    alignItems: 'flex-end',
    fontWeight: 'bold',
    color: '#27ae60',
  },
  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: isSmallDevice ? 10 : 20,
  },
  shopItem: {
    width: isSmallDevice ? '30%' : isTablet ? '31%' : '30%',
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 10 : 15,
    padding: isSmallDevice ? 5 : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledItem: {
    opacity: 0.1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  itemName: {
    color: 'white',
    fontSize: isSmallDevice ? 10 : 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: isSmallDevice ? 2 : 3,
  },
  itemPrice: {
    color: '#f1c40f',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flipButton: {
    backgroundColor: '#3498db',
    paddingVertical: isSmallDevice ? 10 : 12,
    paddingHorizontal: isSmallDevice ? 20 : 30,
    borderRadius: 25,
    marginTop: isSmallDevice ? 5 : 10,
    alignSelf: 'center',
  },
  flipButtonText: {
    color: 'white',
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: isSmallDevice ? 12 : 15,
    paddingHorizontal: isSmallDevice ? 30 : 40,
    borderRadius: 25,
    marginTop: isSmallDevice ? 10 : 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: isSmallDevice ? 16 : 20,
    fontWeight: 'bold',
  },  
});

export default UserCard;