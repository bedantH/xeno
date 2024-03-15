import Voice from "@react-native-voice/voice";
import axios from "axios";
import { Camera, CameraType } from "expo-camera";
import { Button, Flex, Text, View } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import * as Speech from "expo-speech";

export default function SpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [results, setResults] = useState();
  const [imageBase64, setImageBase64] = useState("");
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const cameraRef = useRef(null);

  Voice.onSpeechStart = () => {
    console.log("Speech started");
    setIsListening(true);
  };

  Voice.onSpeechResults = (e) => {
    console.log("onSpeechResults: ", e);
    setResults(e.value);
  };

  useEffect(() => {
    return () => {
      try {
        Voice.destroy();
      } catch (e) {
        console.log("error", e);
      }
    };
  }, []);

  const startSpeechToText = () => {
    try {
      Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  };

  const stopSpeechToText = () => {
    try {
      Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const capturePicture = async () => {
    const photo = await cameraRef.current.takePictureAsync({ base64: true });
    photo.width = 300;
    photo.height = 300;
    try {
      const response = await axios.post(
        "https://5f6b-114-143-61-242.ngrok-free.app/llm_analysis",
        {
          image: photo.base64,
        }
      );

      Speech.speak(response.data["response"], {
        language: "en",
        pitch: 1,
        rate: 1,
        voice: "com.apple.tts.Fred",
      });
      console.log("response", response.data);
      setImageBase64(photo.base64);
    } catch (e) {
      console.log("error", e);
    }
  };

  if (!permission) {
    return (
      <View>
        <Text>Camera </Text>
      </View>
    );
  }

  if (!permission.granted) {
    requestPermission();
  }

  return (
    <View flex={1}>
      <Camera
        style={{
          flex: 1,
          height: "80%",
        }}
        type={cameraType}
        ref={cameraRef}
      >
        <Flex
          position={"absolute"}
          bottom={10}
          flexDir={"row"}
          justifyContent={"space-evenly"}
          width={"100%"}
        >
          {/* <Button onPress={startSpeechToText}>Start listening</Button>
          <Button onPress={stopSpeechToText}>Stop listening</Button> */}
          <Button onPress={capturePicture}>Capture image</Button>
        </Flex>
      </Camera>
    </View>
  );
}
