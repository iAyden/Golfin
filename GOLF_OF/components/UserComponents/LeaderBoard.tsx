import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, SafeAreaView, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

type LeaderboardStructure = {
  id: string;
  name: string;
  image: string;
  stats: {
    wins: number;
    points: number;
    winRate: number;
    matchesPlayed: number;
  };
};

const dataPhP: LeaderboardStructure[] = [
  {
    id: '1',
    name: 'League of leguends',
    image: 'https://i.pinimg.com/236x/36/b9/9d/36b99dd44debc8614db0c7445ac57b3b.jpg',
    stats: {
      wins: 15,
      points: 2450,
      winRate: 88,
      matchesPlayed: 17,
    },
  },
  {
    id: '2',
    name: 'Programacion PhP',
    image: 'https://i.pinimg.com/236x/36/b9/9d/36b99dd44debc8614db0c7445ac57b3b.jpg',
    stats: {
      wins: 20,
      points: 2350,
      winRate: 82,
      matchesPlayed: 17,
    },
  },
  {
    id: '3',
    name: 'Faker',
    image: 'https://i.pinimg.com/236x/36/b9/9d/36b99dd44debc8614db0c7445ac57b3b.jpg',
    stats: {
      wins: 300,
      points: 2200,
      winRate: 71,
      matchesPlayed: 17,
    },
  },
  {
    id: '4',
    name: 'Mordekaiser',
    image: 'https://i.pinimg.com/236x/36/b9/9d/36b99dd44debc8614db0c7445ac57b3b.jpg',
    stats: {
      wins: 10,
      points: 2100,
      winRate: 65,
      matchesPlayed: 17,
    },
  },
  {
    id: '5',
    name: 'Sonic',
    image: 'https://i.pinimg.com/236x/36/b9/9d/36b99dd44debc8614db0c7445ac57b3b.jpg',
    stats: {
      wins: 19,
      points: 2050,
      winRate: 60,
      matchesPlayed: 17,
    },
  },
];

const ordenamiento_players = dataPhP.sort((a, b) => b.stats.wins - a.stats.wins);

const StatIcon = ({ iconName, color = '#2E7D32' }: { iconName: string; color?: string }) => (
  <View style={styles.iconContainer}>
    <FontAwesome name={iconName} size={width * 0.035} color={color} />
  </View>
);

const PositionNumber = ({ position }: { position: number }) => {
  return (
    <View style={[
      styles.positionBadge,
      position === 1 && styles.firstPosition,
      position === 2 && styles.secondPosition,
      position === 3 && styles.thirdPosition,
      position > 3 && styles.otherPosition
    ]}>
      <Text style={[
        styles.positionText,
        position === 1 && styles.firstPositionText,
        position === 2 && styles.secondPositionText,
        position === 3 && styles.thirdPositionText,
        position > 3 && styles.otherPositionText
      ]}>
        #{position}
      </Text>
    </View>
  );
};

const LeaderboardThing = ({ item, index }: { item: LeaderboardStructure, index: number }) => {
  const position = index + 1; 
  
  return (
    <View style={[
      styles.itemContainer, 
      position === 1 && styles.firstPlaceItem,
      position === 2 && styles.secondPlaceItem,
      position === 3 && styles.thirdPlaceItem
    ]}>
      <PositionNumber position={position} />
      
      <Image source={{ uri: item.image }} style={[
        styles.userImage,
        position === 1 && styles.firstPlaceImage,
        position === 2 && styles.secondPlaceImage,
        position === 3 && styles.thirdPlaceImage
      ]} />
      
      <View style={styles.userInfo}>
        <Text style={[
          styles.userName,
          position === 1 && styles.firstPlaceName,
          position === 2 && styles.secondPlaceName,
          position === 3 && styles.thirdPlaceName
        ]}>
          {item.name}
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <StatIcon iconName="trophy" color="#FFC107" />
            <Text style={styles.statValue}>{item.stats.wins}</Text>
          </View>
          <View style={styles.statItem}>
            <StatIcon iconName="star" color="#FF9800" />
            <Text style={styles.statValue}>{item.stats.points}</Text>
          </View>
          <View style={styles.statItem}>
            <StatIcon iconName="line-chart" color="#4CAF50" />
            <Text style={styles.statValue}>{item.stats.winRate}%</Text>
          </View>
          <View style={styles.statItem}>
            <StatIcon iconName="flag" color="#2196F3" />
            <Text style={styles.statValue}>{item.stats.matchesPlayed}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const Leaderboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>GOLF LEADERBOARD</Text>
          <FontAwesome name='trophy' size={width * 0.09} color="#C0C0C0" />
          <View style={styles.divider} />
        </View>
      </View>
      <FlatList
        data={ordenamiento_players}
        renderItem={({ item, index }) => <LeaderboardThing item={item} index={index} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F5',
  },
  header: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.06,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: '700',
    color: '#1A3D1C',
    letterSpacing: 1.2,
    margin: height * 0.02,
  },
  divider: {
    height: height * 0.003,
    width: width * 0.15,
    backgroundColor: '#4CAF50',
    marginTop: height * 0.01,
  },
  listContent: {
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.02,
    padding: width * 0.03,
    marginBottom: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondPlaceItem: {
    borderLeftWidth: width * 0.015,
    borderLeftColor: '#C0C0C0',
    backgroundColor: '#F8F8F8',
  },
  firstPlaceItem: {
    borderLeftWidth: width * 0.015,
    borderLeftColor: '#FFD700',
    backgroundColor: '#FFF9E6',
  },
  thirdPlaceItem: {
    borderLeftWidth: width * 0.015,
    borderLeftColor: '#CD7F32',
    backgroundColor: '#F9F1E6',
  },
  positionBadge: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.03,
  },
  firstPosition: {
    backgroundColor: '#FFD700',
  },
  secondPosition: {
    backgroundColor: '#C0C0C0',
  },
  thirdPosition: {
    backgroundColor: '#CD7F32',
  },
  otherPosition: {
    backgroundColor: '#E8F5E9',
  },
  positionText: {
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  firstPlaceImage: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    borderColor: '#FFD700',
    borderWidth: width * 0.007,
  },
  firstPositionText: {
    color: 'white',
  },
  secondPositionText: {
    color: 'white',
  },
  thirdPositionText: {
    color: 'white',
  },
  userImage: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginRight: width * 0.03,
    borderWidth: width * 0.005,
    borderColor: '#E0E0E0',
  },
  secondPlaceImage: {
    borderColor: '#C0C0C0',
    borderWidth: width * 0.005,
  },
  thirdPlaceImage: {
    borderColor: '#CD7F32',
    borderWidth: width * 0.005,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: width * 0.04,
    fontWeight: '600',
    marginBottom: height * 0.01,
    color: '#263626',
  },
  thirdPlaceName: {
    fontWeight: '700',
    color: '#B08D57',
  },
  firstPlaceName: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#D4AF37',
  },
  secondPlaceName: {
    fontWeight: '700',
    color: '#7D7D7D',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    minWidth: width * 0.15,
  },
  iconContainer: {
    backgroundColor: '#E8F5E9',
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: width * 0.035,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.005,
  },
  statValue: {
    fontSize: width * 0.033,
    fontWeight: '500',
    color: '#455A64',
  },
  otherPositionText: {
    color: '#2E7D32',
  },
});

export default Leaderboard;