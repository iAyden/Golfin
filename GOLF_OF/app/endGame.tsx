import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ImageSourcePropType,
  ScrollView,
} from "react-native";
import LeaderBoard from "./LeaderBoard";
import { FontAwesome } from "@expo/vector-icons";

// Example winners data (replace with real data as needed)
type Winner = {
  name: string;
  avatar: ImageSourcePropType;
  score: number;
  traps: number;
  karma: number;
  points: number;
  birdies: number;
  pars: number;
  bogeys: number;
};

const unknownAvatar = require("../assets/images/starC.png");
const winners: Winner[] = [
  {
    name: "Pana Miguel",
    avatar: unknownAvatar,
    score: 120,
    traps: 2,
    karma: 15,
    points: 120,
    birdies: 5,
    pars: 10,
    bogeys: 3,
  },
  {
    name: "Oui Liam",
    avatar: unknownAvatar,
    score: 110,
    traps: 1,
    karma: 10,
    points: 110,
    birdies: 4,
    pars: 11,
    bogeys: 3,
  },
  {
    name: "chupapi Muñeño",
    avatar: unknownAvatar,
    score: 100,
    traps: 3,
    karma: 8,
    points: 100,
    birdies: 3,
    pars: 12,
    bogeys: 3,
  },
  {
    name: "Miguelito",
    avatar: unknownAvatar,
    score: 90,
    traps: 0,
    karma: 5,
    points: 90,
    birdies: 2,
    pars: 13,
    bogeys: 3,
  },
];

const podiumColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

const EndGame = () => {
  const { width, height } = Dimensions.get("window");
  // Responsive max width for podium area
  const maxPodiumWidth = 420; // this a reference lol
  const podiumAreaWidth = Math.min(width, maxPodiumWidth);
  // Avatar sizes scale with podium area width
  const avatarBase = podiumAreaWidth * 0.22;
  const avatar2nd = avatarBase * 0.75;
  const avatar3rd = avatarBase * 0.65;
  const avatar4th = avatarBase * 0.55;
  const marginBottom = height * 0.08;
  // Podium image reference (fixed size)
  const podiumImgHeight = 200;
  const podiumImgWidth = podiumAreaWidth;
  const podiumBottom = -99;
  // 1st place: center, slightly above center step
  const avatar1stLeft = podiumImgWidth * 0.44 - avatarBase / 2;
  const avatar1stBottom = podiumBottom + podiumImgHeight * 0.68;
  // 2nd place: left step
  const avatar2ndLeft = podiumImgWidth * 0.3 - avatar2nd / 2;
  const avatar2ndBottom = podiumBottom + podiumImgHeight * 0.48;
  // 3rd place: right step
  const avatar3rdLeft = podiumImgWidth * 0.62 - avatar3rd / 2;
  const avatar3rdBottom = podiumBottom + podiumImgHeight * 0.38;
  return (
    <ImageBackground
      source={require("../assets/images/BG IMG GLF.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={[
            styles.container,
            { justifyContent: "flex-end", paddingBottom: marginBottom },
          ]}
        >
          <Text style={styles.title}>Game Results</Text>
          <View
            style={[
              styles.podiumWrapper,
              {
                position: "relative",
                minHeight: 180,
                width: podiumAreaWidth,
                alignSelf: "center",
              },
            ]}
          >
            {/* Podium image with all 3 places */}
            <Image
              source={require("../assets/images/podium_image.png")}
              style={{
                width: podiumAreaWidth,
                height: podiumImgHeight,
                resizeMode: "contain",
                position: "absolute",
                left: 0,
                bottom: podiumBottom,
                zIndex: 0,
              }}
            />
            {/* 2nd Place */}
            <View
              style={{
                position: "absolute",
                left: avatar2ndLeft,
                bottom: avatar2ndBottom,
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <View
                style={[
                  styles.avatarCircle,
                  {
                    borderColor: podiumColors[1],
                    width: avatar2nd,
                    height: avatar2nd,
                    backgroundColor: "#fff",
                  },
                ]}
              >
                <Image
                  source={winners[1].avatar}
                  style={{
                    width: avatar2nd * 0.9,
                    height: avatar2nd * 0.9,
                    borderRadius: avatar2nd * 0.45,
                  }}
                />
              </View>
              <Text style={styles.podiumName}>{winners[1].name}</Text>
              <Text style={styles.podiumScore}>2nd</Text>
            </View>
            {/* 1st Place */}
            <View
              style={{
                position: "absolute",
                left: avatar1stLeft,
                bottom: avatar1stBottom,
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <View
                style={[
                  styles.avatarCircle,
                  {
                    borderColor: podiumColors[0],
                    width: avatarBase,
                    height: avatarBase,
                    backgroundColor: "#fff",
                  },
                ]}
              >
                <Image
                  source={winners[0].avatar}
                  style={{
                    width: avatarBase * 0.9,
                    height: avatarBase * 0.9,
                    borderRadius: avatarBase * 0.45,
                  }}
                />
              </View>
              <Text
                style={[
                  styles.podiumName,
                  { fontWeight: "bold", fontSize: podiumAreaWidth * 0.06 },
                ]}
              >
                {winners[0].name}
              </Text>
              <Text
                style={[
                  styles.podiumScore,
                  { fontWeight: "bold", color: podiumColors[0] },
                ]}
              >
                1st
              </Text>
            </View>
            {/* 3rd Place */}
            <View
              style={{
                position: "absolute",
                left: avatar3rdLeft,
                bottom: avatar3rdBottom,
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <View
                style={[
                  styles.avatarCircle,
                  {
                    borderColor: podiumColors[2],
                    width: avatar3rd,
                    height: avatar3rd,
                    backgroundColor: "#fff",
                  },
                ]}
              >
                <Image
                  source={winners[2].avatar}
                  style={{
                    width: avatar3rd * 0.9,
                    height: avatar3rd * 0.9,
                    borderRadius: avatar3rd * 0.45,
                  }}
                />
              </View>
              <Text style={styles.podiumName}>{winners[2].name}</Text>
              <Text style={styles.podiumScore}>3rd</Text>
            </View>
          </View>
          {/* Fourth place and leaderboard */}
          <View
            style={[
              styles.fourthPlaceContainer,
              { marginBottom: height * 0.04 },
            ]}
          >
            <View
              style={[
                styles.avatarCircle,
                { borderColor: "#78909c", width: avatar4th, height: avatar4th },
              ]}
            >
              <Image
                source={winners[3].avatar}
                style={{
                  width: avatar4th * 0.9,
                  height: avatar4th * 0.9,
                  borderRadius: avatar4th * 0.45,
                }}
              />
            </View>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={styles.fourthName}>{winners[3].name}</Text>
              <Text style={styles.fourthScore}>4th Place</Text>
            </View>
          </View>
          <LeaderBoard />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    maxWidth: 600,
    minWidth: 280,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 24,
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: "center",
  },
  podiumRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    width: "100%",
    marginBottom: 40,
  },
  podiumSpot: {
    flex: 1,
    alignItems: "center",
  },
  avatarCircle: {
    borderWidth: 4,
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarImgLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarImgSmall: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  podiumName: {
    color: "#263626",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
    textAlign: "center",
  },
  podiumScore: {
    color: "#78909c",
    fontSize: 15,
    marginBottom: 4,
    textAlign: "center",
  },
  fourthPlaceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(232,245,233,0.7)",
    borderRadius: 16,
    padding: 12,
    marginTop: 24,
    shadowColor: "#107C10",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  fourthName: {
    color: "#263626",
    fontSize: 16,
    fontWeight: "600",
  },
  fourthScore: {
    color: "#78909c",
    fontSize: 14,
  },
  podiumWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    maxWidth: 600,
    minWidth: 260,
    marginBottom: 32,
    gap: 8,
    alignSelf: "center",
    position: "relative",
  },
  podiumColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 70,
    maxWidth: 180,
    paddingHorizontal: 2,
  },
  podiumBase: {
    width: "100%",
    minWidth: 50,
    maxWidth: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 0,
    overflow: "hidden",
    backgroundColor: "#c19a6b", // fallback wood color
    borderWidth: 1,
    borderColor: "#8d6748",
  },
});

export default EndGame;
