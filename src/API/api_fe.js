const API_KEY_OPENWEATHER_APP = "c2242b51c0bf43e3667126de3b967366"
export const API_WEATHER_FORECAST = (lat, lon) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY_OPENWEATHER_APP}&units=metric`
export const API_WEATHER_CURRENT = (lat, lon) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY_OPENWEATHER_APP}&units=metric`

export const API_TRANSLATE = (keyword, tl) => `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${keyword}`

export const API_INFO_COUNTRY = (name_country) => `https://restcountries.com/v3.1/name/${name_country}`