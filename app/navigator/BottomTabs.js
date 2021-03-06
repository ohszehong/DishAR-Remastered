import React from "react";
import { StyleSheet, BackHandler } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from "@ui-kitten/components";

import AddFoodForm from "./../components/restaurantownerscreen/AddFoodForm";
import ViewQR from "./../components/restaurantownerscreen/ViewQR";
import BetweenFoodAndDetails from "../components/restaurantownerscreen/BetweenFoodAndDetails";
import Quit from "../components/Quit";

const { Navigator, Screen } = createBottomTabNavigator();

export const MenuIcon = (props) => (
  <Icon
    name="profile"
    {...props}
    style={[props.style, { height: 25, width: 25 }]}
  />
);

export const AddFoodIcon = (props) => (
  <Icon
    name="pluscircleo"
    {...props}
    style={[props.style, { height: 25, width: 25 }]}
  />
);

export const QRIcon = (props) => (
  <Icon
    name="qrcode"
    {...props}
    style={[props.style, { height: 25, width: 25 }]}
  />
);

export const LogoutIcon = (props) => (
  <Icon
    name="logout"
    {...props}
    style={[props.style, { height: 25, width: 25 }]}
  />
);

const BottomTabBar = ({ navigation, state, restaurantOwnerData }) => {
  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) =>
        navigation.jumpTo(state.routeNames[index], {
          data: restaurantOwnerData,
        })
      }
      style={styles.bottomTabBar}
    >
      <BottomNavigationTab title="MENU" icon={MenuIcon} />
      <BottomNavigationTab title="ADD" icon={AddFoodIcon} />
      <BottomNavigationTab title="QR CODE" icon={QRIcon} />
      <BottomNavigationTab title="QUIT" icon={LogoutIcon} />
    </BottomNavigation>
  );
};

const CustomerBottomTabBar = ({ navigation, state, restaurantOwnerData }) => {
  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) =>
        navigation.jumpTo(state.routeNames[index], {
          data: restaurantOwnerData,
        })
      }
      style={styles.bottomTabBar}
    >
      <BottomNavigationTab title="MENU" icon={MenuIcon} />
      <BottomNavigationTab title="QUIT" icon={LogoutIcon} />
    </BottomNavigation>
  );
};

const TabNavigator = ({ restaurantOwnerData }) => {
  if (restaurantOwnerData.role === "customer") {
    return (
      <Navigator
        tabBar={(props) => (
          <CustomerBottomTabBar
            {...props}
            restaurantOwnerData={restaurantOwnerData}
          />
        )}
      >
        {/* later come back here */}
        <Screen
          name="BetweenFoodAndDetails"
          children={(props) => <BetweenFoodAndDetails {...props} />}
          initialParams={restaurantOwnerData}
          options={{ unmountOnBlur: true }}
        />
        <Screen
          name="Quit"
          options={{ unmountOnBlur: true }}
          children={(props) => <Quit {...props} />}
        />
      </Navigator>
    );
  } else {
    return (
      <Navigator
        tabBar={(props) => (
          <BottomTabBar {...props} restaurantOwnerData={restaurantOwnerData} />
        )}
      >
        <Screen
          name="BetweenFoodAndDetails"
          children={(props) => <BetweenFoodAndDetails {...props} />}
          initialParams={restaurantOwnerData}
        />
        <Screen name="AddFood" component={AddFoodForm} />
        <Screen
          name="ViewQR"
          component={ViewQR}
          initialParams={restaurantOwnerData}
        />
        <Screen
          name="Quit"
          options={{ unmountOnBlur: true }}
          children={(props) => <Quit {...props} />}
        />
      </Navigator>
    );
  }
};

const styles = StyleSheet.create({
  bottomTabBar: {
    marginBottom: 30,
    width: "90%",
    alignSelf: "center",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
});

export default TabNavigator;
