import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Load location from AsyncStorage on component mount
    AsyncStorage.getItem("userLocation").then((savedLocation) => {
      if (savedLocation) {
        setLocation(JSON.parse(savedLocation));
      }
    });
  }, []);

  const updateLocation = (longitude, latitude) => {
    const newLocation = { longitude, latitude };
    setLocation(newLocation);
    // Save location to AsyncStorage
    AsyncStorage.setItem("userLocation", JSON.stringify(newLocation));
  };

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;

export const useLocation = () => {
  const context = React.useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
