import { useEffect, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  DocumentSnapshot,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const ShoppingLists = ({ db, route }) => {
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

  useEffect(() => {
    const q = query(
      collection(db, "shoppinglists"),
      where("uid", "==", userID)
    );
    const unsubShoppingList = onSnapshot(q, (documentSnapshot) => {
      let newLists = [];
      documentSnapshot.forEach((doc) => {
        newLists.push({ id: doc.id, ...doc.data() });
      });
      setLists(newLists);
    });
    return () => unsubShoppingList && unsubShoppingList();
  }, []);

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
