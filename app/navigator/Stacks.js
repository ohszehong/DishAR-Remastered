import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//screens
import RootScreen from "./../screens/RootScreen";
import AdminHomeScreen from "../screens/AdminHomeScreen";
import RestaurantOwnerHomeScreen from "../screens/RestaurantOwnerHomeScreen";
import QRCodeScannerScreen from "../screens/QRCodeScannerScreen";

const Stack = createStackNavigator();

const Stacks = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTransparent: true,
          headerTitle: "",
          headerLeftContainerStyle: {
            paddingLeft: 20,
          },
        }}
      >
        <Stack.Screen name="Root" component={RootScreen} />
        <Stack.Screen name="Admin" component={AdminHomeScreen} />
        <Stack.Screen
          name="RestaurantOwner"
          component={RestaurantOwnerHomeScreen}
        />
        <Stack.Screen name="QRCodeScanner" component={QRCodeScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Stacks;
