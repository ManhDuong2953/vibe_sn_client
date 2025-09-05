export function generateMapIframe(latitude, longitude, zoom = 12) {
  const apiKey = import.meta.env.VITE_API_KEY_GOOGLE_MAP; // Google Maps API Key
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=${zoom}&maptype=roadmap`;
}
