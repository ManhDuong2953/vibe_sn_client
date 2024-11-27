export function generateMapIframe(latitude, longitude, zoom = 12) {
  const apiKey = process.env.REACT_APP_API_KEY_GOOGLE_MAP; // Google Maps API Key
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=${zoom}&maptype=roadmap`;
}
