import { View, StyleSheet } from "react-native";
import { ThemedButton } from "react-native-really-awesome-button";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <ThemedButton
          name="bruce"
          type="primary"
          style={styles.button}
          onPress={() => navigation.navigate("Chat")}
        >
          Connect
        </ThemedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
