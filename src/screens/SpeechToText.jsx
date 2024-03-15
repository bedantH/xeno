import React, { useEffect, useRef, useState } from "react";
import Voice from "@react-native-voice/voice";
import axios from "axios";
import { Camera, CameraType } from "expo-camera";
import { Button, Flex, Text, View } from "native-base";
import * as Speech from "expo-speech";
import * as ImageManipulator from "expo-image-manipulator";

export default function SpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState();
  const [imageBase64, setImageBase64] = useState("");
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isRealtime, setIsRealtime] = useState(false);
  const [flag, setFlag] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const speech = Speech;

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
    let interval;

    if (isRealtime && !isLoading) {
      interval = setInterval(() => {
        capturePicture();
      }, 5000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRealtime, isLoading]);

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

    const compressedPhoto = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: photo.width, height: photo.height } }],
      { format: "jpeg", base64: true, compress: 0.3 }
    );

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://9642-114-143-61-242.ngrok-free.app/llm_analysis",
        {
          image: compressedPhoto.base64,
          content: isRealtime ? 0 : 1,
        }
      );

      if (response?.data?.["response"]?.includes("blocked")) {
        setFlag(true);

        speech.speak(response?.data?.["response"], {
          language: "en",
          pitch: 1,
          rate: 1,
          voice: "com.apple.tts.Fred",
        });
      } else if (flag && response?.data?.["response"]?.includes("clear")) {
        setFlag(false);

        speech.speak(response?.data?.["response"], {
          language: "en",
          pitch: 1,
          rate: 1,
          voice: "com.apple.tts.Fred",
        });
      }

      console.log("response", response.data);
      setIsLoading(false);
      setImageBase64(photo.base64);
    } catch (e) {
      console.log("error", e);
    }
  };

  if (!permission) {
    return (
      <View>
        <Text>Camera</Text>
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
        {/* <Flex
          position={"absolute"}
          top={10}
          flexDir="row"
          justifyContent={"space-around"}
          alignItems="center"
          width={"100%"}
        >
          <Button onPress={startSpeechToText}>Start listening</Button>
          <Button onPress={stopSpeechToText}>Stop listening</Button>
        </Flex> */}
        <Flex
          position={"absolute"}
          bottom={10}
          flexDir={"row"}
          justifyContent={"space-around"}
          alignItems="center"
          width={"100%"}
        >
          <Button
            onPress={() => {
              setFlag(true);
              capturePicture();
            }}
          >
            Capture image
          </Button>
          <Button
            onPress={() => {
              if (!isRealtime) {
                setIsRealtime(true);
                capturePicture();
              } else {
                setIsRealtime(false);
              }
            }}
          >
            {isRealtime ? "Stop" : "Start"} Realtime
          </Button>
        </Flex>
      </Camera>
    </View>
  );
}
