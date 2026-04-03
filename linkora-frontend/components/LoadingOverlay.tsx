import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function LoadingOverlay() {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#22C55E" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
});
