import React from "react";
import { View, Image } from "react-native";
import { Text } from "@ui-kitten/components";

function RootScreenLogo({
  logoContainerStyle,
  logoImageStyle,
  logoTitleStyle,
}) {
  return (
    <View style={logoContainerStyle}>
      <Image
        style={logoImageStyle}
        source={require("../assets/DishARLogo.png")}
      />
      <Text style={logoTitleStyle} category="h1">
        DishAR
      </Text>
    </View>
  );
}

export default RootScreenLogo;
