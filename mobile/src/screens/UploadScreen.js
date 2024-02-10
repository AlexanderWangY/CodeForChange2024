import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";

const UploadScreen = () => {
  const cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [photo, setPhoto] = useState();

  const takePicture = async () => {
    const options = {
      quality: 0.5,
      base64: true,
      exif: true,
      zoom: 0,
    };

    const newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  const upload = async () => {
    console.log("Uploaded photo!");
    // try {
    // const response = await fetch("http://10.136.109.212:3000/upload-data", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     image: photo.base64,
    //     class: "empty", // To be generated by the model
    //     longitude: 0,
    //     latitude: 0,
    //   }),
    //   });
    //   const data = await response.json();
    //   console.log(data);
    // } catch (error) {
    //   console.error("Error uploading data to MongoDB:", error);
    // }
  };

  const retake = () => {
    setPhoto(null);
  };

  useEffect(() => {
    (async () => {
      const cameraPermissions = await Camera.requestCameraPermissionsAsync();
      console.log(cameraPermissions);
      setHasCameraPermission(cameraPermissions.granted);
    })();
  }, []);

  // Check for connecting to the server
  // useEffect(() => {
  //   (async () => {
  //     const response = await fetch("http://10.136.109.212:3000");
  //     console.log(response);
  //   })();
  // }, []);

  if (photo) {
    console.log(photo.exif);
    return (
      <View style={styles.mainContainer}>
        <Image
          style={styles.image}
          // source={{ uri: photo.uri }}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={upload}>
          <Text>Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.retakeButton} onPress={retake}>
          <Text>Retake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log(hasCameraPermission);

  if (hasCameraPermission === undefined) {
    return (
      <View style={styles.mainContainer}>
        <Text>Requesting camera permissions</Text>
      </View>
    );
  } else if (!hasCameraPermission) {
    return (
      <View style={styles.mainContainer}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <Camera style={styles.camera} ref={cameraRef} zoom={0}>
        <View style={styles.target}></View>
      </Camera>
      <View style={styles.taskbar}>
        <TouchableOpacity
          style={styles.photoButton}
          onPress={takePicture}
        ></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    position: "relative",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  camera: {
    flex: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  target: {
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").width * 0.3,
    borderColor: "white",
    borderWidth: 2.5,
  },

  uploadButton: {
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.13,
    backgroundColor: "#05DE5D",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
    bottom: Dimensions.get("window").height * 0.17,
    borderRadius: 50,
  },

  retakeButton: {
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.13,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
    bottom: Dimensions.get("window").height * 0.08,
    borderRadius: 50,
  },

  taskbar: {
    width: "100%",
    flex: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },

  photoButton: {
    width: 100,
    height: 100,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  preview: {
    flex: 1,
  },

  image: {
    width: "100%",
    height: "100%",
  },
});

export default UploadScreen;
