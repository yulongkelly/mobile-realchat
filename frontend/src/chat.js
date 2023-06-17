import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import socket from "./utils/socket";

const ChatComponent = ({ msg }) => {
  console.log("msg", msg);
  return (
    <View>
      <Text>
        {msg.user}: {msg.msg}
      </Text>
    </View>
  );
};

const Chat = ({ navigation }) => {
  const [text, onChangeText] = React.useState("");
  const [messages, onChangeMessages] = React.useState([]);
  const [leaveMessage, onChangeLeaveMessage] = React.useState("");
  const submit = () => {
    socket.emit("newMessage", text);
    onChangeText("");
  };

  socket.on("sendMessage", (messages) => {
    console.log("change the msg");
    onChangeMessages(messages);
  });

  socket.on("user-left", (msg) => {
    onChangeLeaveMessage(msg);
  });

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      socket.emit("leave");
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
          <View style={styles.chatbox}>
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
  chatbox: {
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
});

export default Chat;
