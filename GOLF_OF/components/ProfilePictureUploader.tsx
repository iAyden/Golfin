import React, { useState } from 'react';
import { View, Button, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

type ProfilePictureUploaderProps = {
  onUploadSuccess: (url: string) => void;
};

const ProfilePictureUploader = ({ onUploadSuccess }: ProfilePictureUploaderProps) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

 

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImageToCloudinary(uri);
    }
  };

  return (
    <View>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, borderRadius: 50 }} />
      )}
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Subir imagen" onPress={pickImage} />
      )}
    </View>
  );
};
export const uploadImageToCloudinary = async (uri: string): Promise<string> => {
  const data = new FormData();
  data.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);
  data.append('upload_preset', 'golfin_upload');

  const response = await axios.post(
    'https://api.cloudinary.com/v1_1/ddxbr2ctr/image/upload',
    data,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return response.data.secure_url;
};

export default ProfilePictureUploader;
