import { View, StyleSheet, Button } from "react-native";
import socket from "./utils/socket";
import React, { useEffect } from "react";
import AwesomeButton, {
  ThemedButton,
} from "react-native-really-awesome-button";

export default function Home({ navigation }) {
  const connect = () => {
    socket.emit("createRoom");
    onChangeDisabled(true);
    onChangeButtonText("Connecting...");
  };
  const [roomid, onChangeRoomid] = React.useState("");
  const [disabled, onChangeDisabled] = React.useState(false);
  const [buttonText, onChangeButtonText] = React.useState("Connect");
  socket.on("roomid", (id) => {
    console.log("roomid", id);
    onChangeRoomid(id);
    console.log("onChangeRoomid", roomid);
  });
  socket.on("roomCreated", (id) => {
    console.log("roomCreated", roomid);
    if (roomid === id) {
      console.log("roomCreated", roomid);
      navigation.navigate("Chat", { roomid: roomid });
      setTimeout(() => {
        onChangeDisabled(false);
        onChangeButtonText("Connect");
      }, 1000);
    }
  });
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <ThemedButton
          name="bruce"
          type="primary"
          style={styles.button}
          onPress={connect}
          disabled={disabled}
        >
          {buttonText}
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
