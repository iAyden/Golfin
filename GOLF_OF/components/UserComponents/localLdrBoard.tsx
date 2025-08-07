import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const { width, height } = Dimensions.get("window");

// Tipo real que viene del backend
export type LocalLeaderboardStructure = {
  position: number;
  username: string;
  photoURL: string;
  wins: number;
  karma?: number;
  traps?: number;
  points?: number;
  birdies?: number;
  pars?: number;
  bogeys?: number;
};

const StatIcon = ({
  iconName,
  color = "#2E7D32",
}: {
  iconName: string;
  color?: string;
}) => (
  <View style={styles.iconContainer}>
    <FontAwesome name={iconName} size={width * 0.035} color={color} />
  </View>
);

const PositionNumber = ({ position }: { position: number }) => {
  let badgeColor = '#E0E0E0';
  if (position === 1) badgeColor = '#FFD700';
  else if (position === 2) badgeColor = '#C0C0C0';
  else if (position === 3) badgeColor = '#CD7F32';
  let textColor = '#263626';
  if (position === 1) textColor = '#B8860B';
  else if (position === 2) textColor = '#7D7D7D';
  else if (position === 3) textColor = '#B08D57';
  return (
    <View style={[styles.positionBadge, { backgroundColor: badgeColor }] }>
      <Text style={[styles.positionText, { color: textColor }]}>#{position}</Text>
    </View>
  );
};

const LocalLeaderboardThing = ({ item }: { item: LocalLeaderboardStructure }) => {
  const position = item.position;
  return (
    <View style={styles.itemContainer}>
      <PositionNumber position={position} />
      <Image
        source={{ uri: item.photoURL }}
        style={[styles.userImage,
          position === 1 && styles.firstPlaceImage,
          position === 2 && styles.secondPlaceImage,
          position === 3 && styles.thirdPlaceImage,
        ]}
      />
      <View style={styles.userInfo}>
        <Text style={[styles.userName,
          position === 1 && styles.firstPlaceName,
          position === 2 && styles.secondPlaceName,
          position === 3 && styles.thirdPlaceName,
        ]}>{item.username}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <StatIcon iconName="trophy" color="#FFC107" />
            <Text style={styles.statValue}>{item.wins}</Text>
          </View>
          {item.karma !== undefined && (
            <View style={styles.statItem}>
              <StatIcon iconName="heart" color="#E91E63" />
              <Text style={styles.statValue}>{item.karma}</Text>
            </View>
          )}
          {item.traps !== undefined && (
            <View style={styles.statItem}>
              <StatIcon iconName="bomb" color="#607D8B" />
              <Text style={styles.statValue}>{item.traps}</Text>
            </View>
          )}
          {item.points !== undefined && (
            <View style={styles.statItem}>
              <StatIcon iconName="star" color="#FFD700" />
              <Text style={styles.statValue}>{item.points}</Text>
            </View>
          )}
          {item.birdies !== undefined && (
            <View style={styles.statItem}>
              <StatIcon iconName="arrow-up" color="#4CAF50" />
              <Text style={styles.statValue}>{item.birdies}</Text>
            </View>
          )}
          {item.pars !== undefined && (
            <View style={styles.statItem}>
              <StatIcon iconName="minus" color="#2196F3" />
              <Text style={styles.statValue}>{item.pars}</Text>
            </View>
          )}
          {item.bogeys !== undefined && (
            <View style={styles.statItem}>
              <StatIcon iconName="arrow-down" color="#FF5722" />
              <Text style={styles.statValue}>{item.bogeys}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const LocalLeaderboard = ({ data }: { data: LocalLeaderboardStructure[] }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>LEADERBOARD</Text>
          <FontAwesome name="trophy" size={width * 0.09} color="#C0C0C0" />
          <View style={styles.divider} />
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <LocalLeaderboardThing item={item} />}
        keyExtractor={(item) => item.username}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

// ...existing code...

// ...existing code...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: width * 0.07,
    color: '#2E7D32',
    marginRight: 8,
  },
  divider: {
    height: 2,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginTop: 6,
    borderRadius: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  positionBadge: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: width * 0.045,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#E0E0E0',
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
    backgroundColor: '#E0E0E0',
  },
  positionText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#263626',
  },
  firstPositionText: {
    color: '#B8860B',
  },
  secondPositionText: {
    color: '#7D7D7D',
  },
  thirdPositionText: {
    color: '#B08D57',
  },
  otherPositionText: {
    color: '#263626',
  },
  userImage: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.065,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  firstPlaceImage: {
    borderColor: '#FFD700',
    borderWidth: width * 0.007,
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
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
    justifyContent: 'center',
  },
  userName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
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
  thirdPlaceName: {
    fontWeight: '700',
    color: '#B08D57',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 2,
    justifyContent: 'flex-start',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: width * 0.15,
    marginRight: width * 0.03,
    marginBottom: 2,
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
    fontSize: width * 0.035,
    color: '#263626',
    marginLeft: 4,
    fontWeight: '500',
  },
});
export default LocalLeaderboard;
