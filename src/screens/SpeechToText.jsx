import React, { useEffect, useRef, useState } from "react";
import Voice from "@react-native-voice/voice";
import axios from "axios";
import { Camera, CameraType } from "expo-camera";
import { Button, Flex, Text, View } from "native-base";
import * as Speech from "expo-speech";
import * as ImageManipulator from "expo-image-manipulator";
import * as Location from "expo-location";
import { useLocation } from "../context/LocationContext";
import { getRoute } from "../services/getRoute";
import {
  PicovoiceErrors,
  PicovoiceManager,
} from "@picovoice/picovoice-react-native";

let arr = [
  [73.1767574, 18.8940273],
  [73.1768081, 18.8936813], // turn
  [73.1767995, 18.8936535],
  [73.1768031, 18.89408],
  [73.1768593, 18.894018],
  [73.1767597, 18.8937593],
  [73.1765478, 18.8934392], // turn
];
let d = {
  features: [
    {
      properties: {
        segments: [
          {
            distance: 756.4,
            duration: 544.6,
            steps: [
              // {
              //   distance: 10.4,
              //   duration: 7.5,
              //   type: 11,
              //   instruction: "Start by heading straight",
              //   name: "",
              //   way_points: [0, 1],
              // },
              {
                distance: 10.4,
                duration: 7.5,
                type: 11,
                instruction: "turn left up ahead",
                name: "",
                way_points: [0, 1],
              },
              {
                distance: 10.4,
                duration: 7.5,
                type: 11,
                instruction: "There is a upcoming right turn",
                name: "",
                way_points: [4, 6],
              },
            ],
          },
        ],
      },
      geometry: {
        coordinates: [
          [73.1767574, 18.8940273],
          [73.1768081, 18.8936813], // turn
          [73.1767995, 18.8936535],
          [73.1768031, 18.89408],
          [73.1768593, 18.894018],
          [73.1767597, 18.8937593],
          [73.1765478, 18.8934392], // turn
        ],
      },
    },
  ],
};

export default function SpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState();
  const [imageBase64, setImageBase64] = useState("");
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isRealtime, setIsRealtime] = useState(false);
  // const [flag, setFlag] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [waypoints, setWayPoints] = useState({});
  const [data, setData] = useState({});
  const [waypointCount, setWaypointCount] = useState(0);

  const [keywordDetected, setKeywordDetected] = useState(false);

  const { location, updateLocation } = useLocation();
  const speech = Speech;

  const ACCESS_KEY = "vFBO3p2TwSTGtMjKyMUQUY9HrdK3kU1SmhvFkMl7PFaVDy0JBy3qNQ==";
  let picovoiceManager;

  const cameraRef = useRef(null);

  const wakeWordCallback = () => {
    setIsListening(true);
  };

  const startProcessing = async () => {
    try {
      picovoiceManager.start();
    } catch (er) {
      console.log("Error: ", er);
    }
  };

  useEffect(() => {
    let wakeWordPath = `../../viz_bot.ppn`;

    picovoiceManager = PicovoiceManager.create(
      ACCESS_KEY,
      wakeWordPath,
      wakeWordCallback(),
      (err) => {
        console.log("Error: ", err);
      }
    );
  }, []);

  useEffect(() => {
    if (keywordDetected) {
      console.log("Keyword detected");
    }
  }, [keywordDetected]);

  useEffect(() => {
    if (waypoints == {}) return;
    console.log(":)))", location.longitude, location.latitude);
    let d1 = distanceFormula(
      location.longitude,
      location.latitude,
      data?.features?.[0]?.geometry?.coordinates?.[waypointCount]?.[0],
      data?.features?.[0]?.geometry?.coordinates?.[waypointCount]?.[1]
    );
    let d2 = distanceFormula(
      location.longitude,
      location.latitude,
      data?.features?.[0]?.geometry?.coordinates?.[waypointCount + 1]?.[0],
      data?.features?.[0]?.geometry?.coordinates?.[waypointCount + 1]?.[1]
    );

    if (d2 < d1) {
      if (waypoints && waypointCount + 1 + "" in waypoints)
        // speech.speak(waypoints[waypointCount + 1 + ""]?.instruction, {
        //   language: "en",
        //   pitch: 1,
        //   rate: 1,
        //   voice: "com.apple.tts.Fred",
        // });
        setWaypointCount(waypointCount + 1);
    }
  }, [location.longitude, location.latitude, waypoints]);

  useEffect(() => {
    getRoute({
      start: `${location?.longitude},${location?.latitude}`,
      end: "73.18170726299287,18.897156309800234",
    })
      .then((data) => {
        data = d;
        setData(data);
        const steps = data?.features?.[0]?.properties?.segments?.[0]?.steps;

        // create a object with the waypoints[0] as the key and the whole step object as value
        const waypoints = {};
        steps.forEach((step) => {
          waypoints[step?.way_points[0]] = step;
        });

        setWayPoints(waypoints);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      setInterval(async () => {
        let coords = await Location.getCurrentPositionAsync({});
        updateLocation(coords.coords.longitude, coords.coords.latitude);
      }, 2000);
    })();
  }, []);

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

  const distanceFormula = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  const summarizeSur = async () => {
    const photo = await cameraRef.current.takePictureAsync({ base64: true });

    setIsLoading(true);
    const compressedPhoto = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: photo.width, height: photo.height } }],
      { format: "jpeg", base64: true, compress: 0.3 }
    );

    try {
      const response = await axios.post(
        "https://9642-114-143-61-242.ngrok-free.app/cap",
        {
          image: compressedPhoto.base64,
          content: isRealtime ? 0 : 1,
        }
      );
      console.log("response", response.data);
      speech.speak(response?.data?.["response"], {
        language: "en",
        pitch: 1,
        rate: 1,
        voice: "com.apple.tts.Fred",
      });
    } catch (err) {
      console.log("error", err);
    }
  };

  const capturePicture = async () => {
    const photo = await cameraRef.current.takePictureAsync({ base64: true });

    setIsLoading(true);
    const compressedPhoto = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: photo.width, height: photo.height } }],
      { format: "jpeg", base64: true, compress: 0.3 }
    );

    try {
      const response = await axios.post(
        "https://9642-114-143-61-242.ngrok-free.app/llm_analysis",
        {
          image: compressedPhoto.base64,
          content: isRealtime ? 0 : 1,
        }
      );

      if (response?.data?.["response"]?.includes("blocked")) {
        // setFlag(true);

        speech.speak(response?.data?.["response"], {
          language: "en",
          pitch: 1,
          rate: 1,
          voice: "com.apple.tts.Fred",
        });
      } else if (response?.data?.["response"]?.includes("clear")) {
        // setFlag(false);

        speech.speak(response?.data?.["response"], {
          language: "en",
          pitch: 1,
          rate: 1,
          voice: "com.apple.tts.Fred",
        });
      }

      console.log("response", response.data);
      setImageBase64(photo.base64);
    } catch (e) {
      console.log("error", e);
    }
    setIsLoading(false);
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
          justifyContent={"center"}
          alignItems="center"
          width={"100%"}
        >
          <Button
            onPress={async () => {
              let coords = await Location.getCurrentPositionAsync({});
              console.log(coords.coords.longitude, coords.coords.latitude);
            }}
          >
            Log coordinates
          </Button>
        </Flex> */}
        <Flex
          position={"absolute"}
          bottom={10}
          flexDir={"row"}
          justifyContent={"center"}
          alignItems="center"
          width={"100%"}
          style={{
            gap: 10,
          }}
        >
          <Button
            color="#000"
            style={{
              backgroundColor: "white",
            }}
            onPress={() => {
              // setFlag(true);
              capturePicture();
            }}
          >
            <Text>Capture image</Text>
          </Button>
          <Button
            color="#000"
            style={{
              width: 160,
              backgroundColor: "white",
            }}
            onPress={() => {
              if (!isRealtime) {
                setIsRealtime(true);
                capturePicture();
              } else {
                setIsRealtime(false);
              }
            }}
          >
            <Text>{isRealtime ? "Stop Realtime" : "Start Realtime"}</Text>
          </Button>
        </Flex>
        <Flex
          position={"absolute"}
          bottom={100}
          flexDir={"row"}
          justifyContent={"center"}
          alignItems="center"
          width={"100%"}
          style={{
            gap: 10,
          }}
        >
          <Button
            color="#000"
            style={{
              backgroundColor: "white",
            }}
            onPress={() => {
              // setFlag(true);
              summarizeSur();
            }}
          >
            <Text>Whats around me</Text>
          </Button>
        </Flex>
      </Camera>
    </View>
  );
}
