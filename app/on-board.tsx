import Button from "@/components/ui/button";
import SignInAuth from "@/features/auth/components/sign-in";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const OnBoardImage = require("@/assets/images/on-board.png");

export default function OnBoardPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <View style={style.container}>
      <LinearGradient
        style={style.onBoardImageContainer}
        colors={["#3F9AAE", "#fff"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Image source={OnBoardImage} style={style.onBoardImage} />
      </LinearGradient>
      <View style={style.titleContainer}>
        <Text style={style.title}>
          Navigate Your Work Journey Efficient & Easy
        </Text>
        <Text style={style.subtitle}>
          Increase your work management & career development radically
        </Text>
        <Button title="Login" fullWidth onPress={() => setShowLogin(true)} />

        <SignInAuth show={showLogin} setShow={setShowLogin} />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  onBoardImageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40%",
  },
  onBoardImage: {
    width: 300,
    height: 400,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    gap: 10,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "400",
  },
});
