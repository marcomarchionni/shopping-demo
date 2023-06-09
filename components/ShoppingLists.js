import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ShoppingLists = ({ db, route, isConnected }) => {
  const { userID } = route.params;
  const [lists, setLists] = useState([]);
  const [listName, setListName] = useState("");
  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");

  const addShoppingList = async () => {
    const newList = { uid: userID, name: listName, items: [item1, item2] };
    const newListRef = await addDoc(collection(db, "shoppinglists"), newList);
    if (newListRef.id) {
      Alert.alert(`List with name ${newList.name} has been added`);
    } else {
      Alert.alert(`An error occurred, unable to add`);
    }
  };

  const cacheShoppingLists = async (lists) => {
    try {
      await AsyncStorage.setItem("shopping_lists", JSON.stringify(lists));
    } catch (error) {
      console.error(error.message);
    }
  };

  const loadCachedLists = async () => {
    try {
      const lists = (await AsyncStorage.getItem("shopping_lists")) || [];
      setLists(JSON.parse(lists));
    } catch (error) {
      console.error(error.message);
    }
  };

  let unsubShoppingList;

  useEffect(() => {
    if (isConnected === true) {
      // unregister current listener
      if (unsubShoppingList) unsubShoppingList();
      unsubShoppingList = null;

      const q = query(
        collection(db, "shoppinglists"),
        where("uid", "==", userID)
      );

      // setup new listener
      unsubShoppingList = onSnapshot(q, (documentSnapshot) => {
        let newLists = [];
        documentSnapshot.forEach((doc) => {
          newLists.push({ id: doc.id, ...doc.data() });
        });
        cacheShoppingLists(newLists);
        setLists(newLists);
      });
    } else {
      loadCachedLists();
    }
    // Unregister listener on unmount
    return () => unsubShoppingList && unsubShoppingList();
  }, [isConnected]);

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>
              {item.name}: {item.items.join(", ")}
            </Text>
          </View>
        )}
      />
      {isConnected && (
        <View style={styles.listForm}>
          <TextInput
            style={styles.listName}
            placeholder="List Name"
            value={listName}
            onChangeText={setListName}
          />
          <TextInput
            style={styles.item}
            placeholder="Item #1"
            value={item1}
            onChangeText={setItem1}
          />
          <TextInput
            style={styles.item}
            placeholder="Item #2"
            value={item2}
            onChangeText={setItem2}
          />
          <TouchableOpacity style={styles.addButton} onPress={addShoppingList}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    height: 70,
    justifyContent: "center",
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#AAA",
    flex: 1,
    flexGrow: 1,
  },
  listForm: {
    flexBasis: 275,
    flex: 0,
    margin: 15,
    padding: 15,
    backgroundColor: "#CCC",
  },
  listName: {
    height: 50,
    padding: 15,
    fontWeight: "600",
    marginRight: 50,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2,
  },
  item: {
    height: 50,
    padding: 15,
    marginLeft: 50,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#000",
    color: "#FFF",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 20,
  },
});

export default ShoppingLists;
