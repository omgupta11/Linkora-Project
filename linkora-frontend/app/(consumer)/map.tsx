import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
  Dimensions,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { getDistance } from "geolib";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

// Get Google Maps API key from environment
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function MapScreen() {
  const { lat, lng, title } = useLocalSearchParams<{
    lat: string;
    lng: string;
    title: string;
  }>();

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const mapRef = useRef<MapView>(null);
  const watchIdRef = useRef<Location.LocationSubscription | null>(null);

  const providerLocation = useMemo(() => {
    return lat && lng ? {
      latitude: Number(lat),
      longitude: Number(lng),
    } : null;
  }, [lat, lng]);

  const getLocationPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required to show the map.");
      return;
    }
    setPermissionGranted(true);
    getCurrentLocation();
    startWatchingLocation();
  }, []);

  useEffect(() => {
    getLocationPermission();
    return () => {
      if (watchIdRef.current) {
        watchIdRef.current.remove();
      }
    };
  }, [getLocationPermission]);

  useEffect(() => {
    if (userLocation && providerLocation) {
      const dist = getDistance(userLocation, providerLocation);
      setDistance(Math.round(dist / 1000)); // km
    }
  }, [userLocation, providerLocation]);

  async function getCurrentLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(coords);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  }

  function startWatchingLocation() {
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Or when moved 10 meters
      },
      (location) => {
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(coords);
      }
    ).then((subscription) => {
      watchIdRef.current = subscription;
    });
  }

  function openInMaps() {
    if (!providerLocation) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${providerLocation.latitude},${providerLocation.longitude}`;
    Linking.openURL(url);
  }

  if (!permissionGranted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Enable location to view map</Text>
        <Pressable style={styles.retryButton} onPress={getLocationPermission}>
          <Text style={styles.retryText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: providerLocation?.latitude || 0,
          longitude: providerLocation?.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {providerLocation && (
          <Marker
            coordinate={providerLocation}
            title={title || "Service Location"}
            pinColor="red"
          />
        )}
        {userLocation && providerLocation && !!GOOGLE_MAPS_API_KEY && (
          <MapViewDirections
            origin={userLocation}
            destination={providerLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="#22C55E"
          />
        )}
      </MapView>

      {providerLocation && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{title || "Service Location"}</Text>
          {distance !== null && (
            <Text style={styles.cardDistance}>{distance} km away</Text>
          )}
          {!GOOGLE_MAPS_API_KEY && (
            <Text style={styles.directionsUnavailable}>Directions unavailable</Text>
          )}
          <Pressable style={styles.mapButton} onPress={openInMaps}>
            <Ionicons name="navigate-outline" size={18} color="#000" />
            <Text style={styles.mapButtonText}>Open in Maps</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#9CA3AF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryText: {
    color: "#000",
    fontWeight: "600",
  },
  card: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardDistance: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 12,
  },
  directionsUnavailable: {
    color: "#F59E0B",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 12,
  },
  mapButton: {
    backgroundColor: "#22C55E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  mapButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
});