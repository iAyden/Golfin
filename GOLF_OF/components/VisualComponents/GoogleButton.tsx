import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, ViewStyle } from 'react-native';

type GoogleButtonProps = {
  onPress: () => void;
  text?: string;
  style?: ViewStyle;
};

const GoogleButton = ({ onPress, text = "Sign in with Google", style }: GoogleButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png',
        }}
        style={styles.logo}
      />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default GoogleButton;
