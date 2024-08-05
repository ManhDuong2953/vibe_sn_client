import { API_INFO_COUNTRY, API_WEATHER_CURRENT, API_WEATHER_FORECAST } from "../API/api_fe"
import { getCurrentLocation } from "../ultils/getLocation/get_location"

const fetchDataFE = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
};
export const getDataWeatherCurrent = async () => {
    const { latitude, longitude } = await getCurrentLocation();
    return fetchDataFE(API_WEATHER_CURRENT(latitude, longitude))
}


export const getDataWeatherForecast = async () => {
    const { latitude, longitude } = await getCurrentLocation();
    return fetchDataFE(API_WEATHER_FORECAST(latitude, longitude))
}

export const getDataInfoCountry = async (name_country) => {
    return fetchDataFE(API_INFO_COUNTRY(name_country));
}

