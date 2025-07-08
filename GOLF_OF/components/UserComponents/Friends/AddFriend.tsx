import React from "react";
import { Modal, View, Text, StyleSheet, TextInput, Button } from "react-native";

interface AddFriendModalProps {
  visible: boolean;
  onClose: () => void;
  onAddFriend: (username: string) => void;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({ visible, onClose, onAddFriend }) => {
  const [username, setUsername] = React.useState("");

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Friend</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            placeholderTextColor="#ccc"
            onChangeText={setUsername}
          />
          <View style={styles.buttons}>
            <Button title="Cancel" onPress={onClose} color="#888" />
            <Button title="Add" onPress={() => onAddFriend(username)} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    color: "#000",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default AddFriendModal;
