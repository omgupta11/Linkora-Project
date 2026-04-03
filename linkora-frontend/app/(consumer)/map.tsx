import React, { useEffect, useState, useRef, useMemo } from "react";
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

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function MapScreen() {
  const { lat, lng, title } = useLocalSearchParams<{
    lat: string;
    lng: string;
    title: string;
  }>();

  const mapRef = useRef<MapView>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const [userLocation, setUserLocation] = useState<any>(null);
  const [distance, setDistance] = useState<number>(0);

  const providerLocation = useMemo(() => {
    if (!lat || !lng) return null;
    return {
      latitude: Number(lat),
      longitude: Number(lng),
    };
  }, [lat, lng]);

  // 🚀 LOCATION SETUP
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation(loc.coords);

      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (location) => {
          setUserLocation(location.coords);
        }
      );
    })();

    return () => {
      watchRef.current?.remove();
    };
  }, []);

  // 🚀 DISTANCE CALC
  useEffect(() => {
    if (userLocation && providerLocation) {
      const d = getDistance(userLocation, providerLocation);
      setDistance(Math.round(d / 1000));
    }
  }, [userLocation, providerLocation]);

  // 🚀 AUTO FIT MAP (UBER STYLE)
  useEffect(() => {
    if (userLocation && providerLocation && mapRef.current) {
      mapRef.current.fitToCoordinates(
        [userLocation, providerLocation],
        {
          edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
          animated: true,
        }
      );
    }
  }, [userLocation, providerLocation]);

  const openInMaps = () => {
    if (!providerLocation) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${providerLocation.latitude},${providerLocation.longitude}`;
    Linking.openURL(url);
  };

  if (!userLocation) {
    return (
      <View style={styles.center}>
        <Text>Getting location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation
        followsUserLocation
      >
        {/* 📍 Provider */}
        {providerLocation && (
          <Marker
            coordinate={providerLocation}
            title={title || "Service"}
            pinColor="red"
          />
        )}

        {/* 🚗 Route Line */}
        {providerLocation && GOOGLE_MAPS_API_KEY && (
          <MapViewDirections
            origin={userLocation}
            destination={providerLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="#22C55E"
          />
        )}
      </MapView>

      {/* 🚀 BOTTOM CARD (SWIGGY STYLE) */}
      <View style={styles.card}>
        <Text style={styles.title}>{title || "Service Location"}</Text>

        <Text style={styles.distance}>
          {distance} km away
        </Text>

        <Pressable style={styles.button} onPress={openInMaps}>
          <Ionicons name="navigate" size={18} color="#000" />
          <Text style={styles.buttonText}>Navigate</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  map: {
    width,
    height,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 18,
    elevation: 10,
  },

  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },

  distance: {
    color: "#9CA3AF",
    marginTop: 4,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#22C55E",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    gap: 8,
  },

  buttonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
});