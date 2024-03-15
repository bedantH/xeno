import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SpeechToText from "./src/screens/SpeechToText";
import { NativeBaseProvider } from "native-base";

export default function App() {
  return (
    <NativeBaseProvider>
      <SpeechToText />
    </NativeBaseProvider>
  );
}
