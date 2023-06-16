import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Chat from "./src/chat.js";
import Home from "./src/home.js";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen name="Chat" component={Chat} options={{ title: "Chat Room" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
