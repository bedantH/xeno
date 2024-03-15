import React from "react";
import { NativeBaseProvider } from "native-base";
import { LocationProvider } from "./src/context/LocationContext";
import SpeechToText from "./src/screens/SpeechToText";

export default function App() {
  return (
    <LocationProvider>
      <NativeBaseProvider>
        <SpeechToText />
      </NativeBaseProvider>
    </LocationProvider>
  );
}
