import React from 'react';
import { StyleSheet, Pressable, Image, View } from 'react-native';
import { useRouter, Route } from 'expo-router';

type ImagenSinFondoProps = {
  source: any;
  width?: number;
  height?: number;
  containerWidth?: number;
  containerHeight?: number;
  redirectTo?: Route; // REDIRIGIMOS A UNA RUTA
};

const ImagenSinFondo: React.FC<ImagenSinFondoProps> = ({
  source,
  width = 100,
  height = 100,
  containerWidth = 150,
  containerHeight = 150,
  redirectTo,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <View
        style={[
          styles.container,
          {
            width: containerWidth,
            height: containerHeight,
          },
        ]}
      >
        <Image
          source={source}
          style={{ width, height }}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'auto',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
});

export default ImagenSinFondo;