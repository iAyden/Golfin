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
export type LeaderboardStructure = {
  position: number;
  username: string;
  photoURL: string;
  wins: number;
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
  return (
    <View
      style={[
        styles.positionBadge,
        position === 1 && styles.firstPosition,
        position === 2 && styles.secondPosition,
        position === 3 && styles.thirdPosition,
        position > 3 && styles.otherPosition,
      ]}
    >
      <Text
        style={[
          styles.positionText,
          position === 1 && styles.firstPositionText,
          position === 2 && styles.secondPositionText,
          position === 3 && styles.thirdPositionText,
          position > 3 && styles.otherPositionText,
        ]}
      >
        #{position}
      </Text>
    </View>
  );
};

const LeaderboardThing = ({ item }: { item: LeaderboardStructure }) => {
  const position = item.position;

  return (
    <View
      style={[
        styles.itemContainer,
        position === 1 && styles.firstPlaceItem,
        position === 2 && styles.secondPlaceItem,
        position === 3 && styles.thirdPlaceItem,
      ]}
    >
      <PositionNumber position={position} />

      <Image
        source={{ uri: item.photoURL }}
        style={[
          styles.userImage,
          position === 1 && styles.firstPlaceImage,
          position === 2 && styles.secondPlaceImage,
          position === 3 && styles.thirdPlaceImage,
        ]}
      />

      <View style={styles.userInfo}>
        <Text
          style={[
            styles.userName,
            position === 1 && styles.firstPlaceName,
            position === 2 && styles.secondPlaceName,
            position === 3 && styles.thirdPlaceName,
          ]}
        >
          {item.username}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <StatIcon iconName="trophy" color="#FFC107" />
            <Text style={styles.statValue}>{item.wins}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const Leaderboard = ({ data }: { data: LeaderboardStructure[] }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>GOLFIN' LEADERBOARD</Text>
          <FontAwesome name="trophy" size={width * 0.09} color="#C0C0C0" />
          <View style={styles.divider} />
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <LeaderboardThing item={item} />}
        keyExtractor={(item) => item.username}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f9f584",
  },
  header: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.06,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "700",
    color: "#1A3D1C",
    letterSpacing: 1.2,
    margin: height * 0.02,
  },
  divider: {
    height: height * 0.003,
    width: width * 0.15,
    backgroundColor: "#4CAF50",
    marginTop: height * 0.01,
  },
  listContent: {
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: width * 0.02,
    padding: width * 0.03,
    marginBottom: height * 0.01,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondPlaceItem: {
    borderLeftWidth: width * 0.015,
    borderLeftColor: "#C0C0C0",
    backgroundColor: "#F8F8F8",
  },
  firstPlaceItem: {
    borderLeftWidth: width * 0.015,
    borderLeftColor: "#FFD700",
    backgroundColor: "#FFF9E6",
  },
  thirdPlaceItem: {
    borderLeftWidth: width * 0.015,
    borderLeftColor: "#CD7F32",
    backgroundColor: "#F9F1E6",
  },
  positionBadge: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.03,
  },
  firstPosition: {
    backgroundColor: "#FFD700",
  },
  secondPosition: {
    backgroundColor: "#C0C0C0",
  },
  thirdPosition: {
    backgroundColor: "#CD7F32",
  },
  otherPosition: {
    backgroundColor: "#E8F5E9",
  },
  positionText: {
    fontWeight: "bold",
    fontSize: width * 0.04,
  },
  firstPositionText: { color: "white" },
  secondPositionText: { color: "white" },
  thirdPositionText: { color: "white" },
  otherPositionText: { color: "#2E7D32" },
  userImage: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginRight: width * 0.03,
    borderWidth: width * 0.005,
    borderColor: "#E0E0E0",
  },
  firstPlaceImage: {
    borderColor: "#FFD700",
    borderWidth: width * 0.007,
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
  },
  secondPlaceImage: {
    borderColor: "#C0C0C0",
    borderWidth: width * 0.005,
  },
  thirdPlaceImage: {
    borderColor: "#CD7F32",
    borderWidth: width * 0.005,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: width * 0.04,
    fontWeight: "600",
    marginBottom: height * 0.01,
    color: "#263626",
  },
  firstPlaceName: {
    fontSize: width * 0.045,
    fontWeight: "700",
    color: "#D4AF37",
  },
  secondPlaceName: {
    fontWeight: "700",
    color: "#7D7D7D",
  },
  thirdPlaceName: {
    fontWeight: "700",
    color: "#B08D57",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  statItem: {
    alignItems: "center",
    minWidth: width * 0.15,
    marginRight: width * 0.03,
  },
  iconContainer: {
    backgroundColor: "#E8F5E9",
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: width * 0.035,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.005,
  },
  statValue: {
    fontSize: width * 0.033,
    fontWeight: "500",
    color: "#455A64",
  },
});

export default Leaderboard;
