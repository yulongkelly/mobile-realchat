import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import socket from "./utils/socket";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";

const ChatComponent = ({ msg }) => {
  console.log("msg", msg);
  return (
    <View>
      {msg.user != socket.id ? (
        <View style={styles.chatComponentRight}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon icon={faUser} color={msg.color} fontSize={"lg"} />
          </View>

          <View style={styles.chatbox}>
            <Text>{msg.msg}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.chatComponentLeft}>
          <View style={styles.chatbox}>
            <Text>{msg.msg}</Text>
          </View>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon icon={faUser} color={msg.color} fontSize={"lg"} />
          </View>
        </View>
      )}
    </View>
  );
};

const Chat = ({ route, navigation }) => {
  const { roomid } = route.params;
  const [text, onChangeText] = React.useState("");
  const [messages, onChangeMessages] = React.useState([]);
  const [leaveMessage, onChangeLeaveMessage] = React.useState("");

  const submit = () => {
    socket.emit("newMessage", text);
    onChangeText("");
  };

  socket.on("sendMessage", (arr) => {
    if (roomid === arr[0]) {
      onChangeMessages(arr[1]);
    }
  });

  socket.on("user-left", (arr) => {
    if (roomid === arr[0]) {
      onChangeLeaveMessage(arr[1]);
    }
  });

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      socket.emit("leave", roomid);
    });
  }, [navigation]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.messageContainer}>
            {console.log("messages", messages)}
            {messages.length > 0 ? (
              <FlatList
                data={messages}
                renderItem={({ item }) => <ChatComponent msg={item} />}
                keyExtractor={(item) => item.id}
              />
            ) : null}
            {leaveMessage === "" ? null : <Text>{leaveMessage}</Text>}
          </View>
          <View style={styles.inputbox}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              onSubmitEditing={submit}
            />
            {/* <TouchableOpacity
              style={styles.submitButton}
              onPress={() => submit()}
            >
              <Text style={styles.submitButtonText}> Submit </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
  inputbox: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 60,
  },
  inner: {
    paddingBottom: 30,
    flex: 1,
    justifyContent: "space-around",
  },
  messagesContainer: {
    flex: 2,
  },
  chatComponentRight: {
    flex: 1,
    flexDirection: "row",
  },
  chatComponentLeft: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  chatbox: {
    backgroundColor: "lightblue",
    padding: 5,
    border: "1px solid black",
    borderRadius: 5,
  },
  iconContainer: {
    backgroundColor: "white",
    borderRadius: "50%",
    padding: 5,
    marginRight: 5,
    marginLeft: 5,
  },
});

export default Chat;
