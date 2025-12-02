import apiClient from "../api/apiClient";
import type { WeatherResponse } from "../types/types";

const useApi = () => {
  const getWeather = async (): Promise<WeatherResponse[] | null> => {
    try {
      const res = await apiClient.get<WeatherResponse[]>("/WeatherForecast");
      return res.data;
    } catch (err) {
      console.error("Error fetching weather data:", err);
      return null;
    }
  };
  return { getWeather };
};

export default useApi;
