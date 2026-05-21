import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={style.container}>
      <Text style={style.title}>i am good boy</Text>
      <Link href="(auth)/signup">Signup Page</Link>
      <Link href="(auth)">Login Page</Link>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
