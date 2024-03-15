// getRoute axios service

import axios from "axios";

export const getRoute = async ({ start, end, profile = "foot-walking" }) => {
  try {
    const response = await axios.get(
      `https://api.openrouteservice.org/v2/directions/${profile}?api_key=5b3ce3597851110001cf6248ca466755654a4ad7845fcdfff049355e&start=${start}&end=${end}`
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
