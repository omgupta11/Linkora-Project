import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";

export default function PaymentScreen() {
  const { amount } = useLocalSearchParams();

  const handlePayment = () => {
    const upiId = "yourupi@upi"; // 🔥 replace later
    const name = "Linkora";

    const url = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "No UPI app found");
    });
  };

  const confirmPayment = () => {
    Alert.alert("Success", "Payment marked as done");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>

      <Text style={styles.amount}>₹{amount}</Text>

      <Pressable style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Pay with UPI</Text>
      </Pressable>

      <Pressable onPress={confirmPayment}>
        <Text style={{ color: "blue", marginTop: 15 }}>
          I have paid
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  amount: { fontSize: 28, marginBottom: 30 },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 16 },
});