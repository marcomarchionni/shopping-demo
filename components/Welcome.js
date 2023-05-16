import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const Welcome = ({ navigation }) => {
  const auth = getAuth();
  const signinUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("ShoppingLists", { userID: result.user.uid });
        Alert.alert("Signed in successfully");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in");
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Shopping Lists</Text>
      <TouchableOpacity style={styles.startButton} onPress={signinUser}>
        <Text style={styles.startButtonText}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appTitle: {
    fontWeight: "600",
    fontSize: 45,
    marginBottom: 100,
  },
  startButton: {
    backgroundColor: "#000",
    height: 50,
    width: "88%",
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFF",
  },
});

export default Welcome;
