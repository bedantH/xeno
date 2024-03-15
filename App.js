import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import SpeechToText from "./src/screens/SpeechToText";
import { NativeBaseProvider } from "native-base";

const TabNavigator = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <TabNavigator.Navigator>
          <TabNavigator.Screen name="Home" component={SpeechToText} />
        </TabNavigator.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
