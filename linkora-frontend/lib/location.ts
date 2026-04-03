import * as Location from "expo-location";

/**
 * Requests GPS permission and returns coordinates. There is no backend endpoint
 * to persist consumer location yet — do not call a fake `/accounts/location/` route.
 */
export async function getCurrentCoordinates(): Promise<{
  lat: number;
  lng: number;
} | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return null;

  const loc = await Location.getCurrentPositionAsync({});
  return {
    lat: loc.coords.latitude,
    lng: loc.coords.longitude,
  };
}
