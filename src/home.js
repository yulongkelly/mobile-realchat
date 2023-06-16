import { View, Button, StyledClass } from "react-native";

export default function Home({ navigation }) {
  return (
    <View>
      <Button title="Connect" onPress={() => navigation.navigate("Chat")} />
    </View>
  );
}
