import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface FriendCardProps {
  username: string;
  photoUrl?: string;
  isOnline?: boolean;
}

const FriendCard: React.FC<FriendCardProps> = ({ username, photoUrl, isOnline = false }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: photoUrl || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
        }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{username}</Text>
        <Text style={[styles.status, { color: isOnline ? "limegreen" : "gray" }]}>
          {isOnline ? "Online" : "Offline"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(232,245,233,0.3)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
  status: {
    fontSize: 13,
    color: "gray",
  },
});

export default FriendCard;
