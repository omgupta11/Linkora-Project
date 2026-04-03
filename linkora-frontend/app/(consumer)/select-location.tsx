import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Text, ActivityIndicator } from "react-native";
// Temporarily comment out maps
// import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SelectLocation() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      // Use a default location for now
      const defaultLocation = {
        coords: {
          latitude: 19.0760, // Mumbai
          longitude: 72.8777,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };
      
      setLocation(defaultLocation);
      setLoading(false);
    })();
  }, []);

  const handleUseCurrentLocation = () => {
    // Simulate using current location
    alert("Using current location (simulated)");
    router.back(); // Go back to previous screen
  };

  const handleSelectOnMap = () => {
    alert("Map selection disabled temporarily");
    // router.push("/(consumer)/map-select"); // If you have a map screen
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Loading location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.title}>Select Location</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Choose how you want to set your location
        </Text>

        {errorMsg && (
          <Text style={styles.errorText}>{errorMsg}</Text>
        )}

        {location && (
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={20} color="#22C55E" />
            <Text style={styles.locationText}>
              Current Location: Mumbai, India (19.0760, 72.8777)
            </Text>
          </View>
        )}

        <Pressable style={styles.optionButton} onPress={handleUseCurrentLocation}>
          <View style={styles.optionIcon}>
            <Ionicons name="navigate" size={24} color="#22C55E" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Use Current Location</Text>
            <Text style={styles.optionSubtitle}>Automatically detect your location</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </Pressable>

        <Pressable style={styles.optionButton} onPress={handleSelectOnMap}>
          <View style={styles.optionIcon}>
            <Ionicons name="map" size={24} color="#22C55E" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Select on Map</Text>
            <Text style={styles.optionSubtitle}>Choose location manually on map</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </Pressable>

        <Pressable style={styles.manualButton} onPress={() => alert("Manual entry disabled")}>
          <Ionicons name="create-outline" size={20} color="#22C55E" />
          <Text style={styles.manualButtonText}>Enter Address Manually</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0F",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 30,
    textAlign: "center",
  },
  loadingText: {
    color: "#9CA3AF",
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#1F2937",
    borderRadius: 8,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  locationText: {
    color: "#FFF",
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionSubtitle: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  manualButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#22C55E",
    borderRadius: 14,
    marginTop: 20,
  },
  manualButtonText: {
    color: "#22C55E",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
});