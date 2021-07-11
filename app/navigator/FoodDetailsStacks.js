import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

//screens
import FoodDetails from "../components/restaurantownerscreen/FoodDetails";
import MenuList from "./../components/restaurantownerscreen/MenuList";
import FoodARScene from "../components/FoodARScene";

const Stack = createSharedElementStackNavigator();

const FoodDetailsStacks = ({ restaurantOwnerData }) => {
  return (
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
        headerLeft: null,
      }}
    >
      <Stack.Screen
        name="MenuList"
        component={MenuList}
        initialParams={restaurantOwnerData}
      />
      <Stack.Screen
        name="FoodDetails"
        component={FoodDetails}
        sharedElementsConfig={(route, otherRoute, showing) => {
          const { data } = route.params;
          return [data._id];
        }}
      />
      <Stack.Screen name="FoodARScene" component={FoodARScene} />
    </Stack.Navigator>
  );
};

export default FoodDetailsStacks;
