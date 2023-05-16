import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Create the navigator
const Stack = createNativeStackNavigator(); // Create the navigator

import ShoppingLists from "./components/ShoppingLists";
import Welcome from "./components/Welcome";

export default function App() {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBY4UF1l7mVN6kC97ewtt0UQywmalXeSrw",
    authDomain: "shopping-list-demo-43215.firebaseapp.com",
    projectId: "shopping-list-demo-43215",
    storageBucket: "shopping-list-demo-43215.appspot.com",
    messagingSenderId: "797799314079",
    appId: "1:797799314079:web:08881959bcb1f8f0c228aa",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="ShoppingLists">
          {(props) => <ShoppingLists db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
