import { API_INFO_COUNTRY, API_PRICE_BITCOIN, API_WEATHER_CURRENT, API_WEATHER_FORECAST } from "../API/api_fe"
import { getData } from "../ultils/fetch/fetch";
import { getCurrentLocation } from "../ultils/getLocation/get_location"

export const getDataWeatherCurrent = async () => {
    const { latitude, longitude } = await getCurrentLocation();
    return getData(API_WEATHER_CURRENT(latitude, longitude))
}


export const getDataWeatherForecast = async () => {
    const { latitude, longitude } = await getCurrentLocation();
    return getData(API_WEATHER_FORECAST(latitude, longitude))
}

export const getDataInfoCountry = async (name_country) => {
    return getData(API_INFO_COUNTRY(name_country));
}

