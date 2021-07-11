import React, { Component } from "react";
import TabNavigator from "../navigator/BottomTabs";

class RestaurantOwnerHomeScreen extends Component {
  constructor({ navigation, route, ...props }) {
    super();

    this.state = {
      restaurantOwnerData: route.data,
    };
  }

  render() {
    const { restaurantOwnerData } = this.state;

    return <TabNavigator restaurantOwnerData={restaurantOwnerData} />;
  }
}

export default RestaurantOwnerHomeScreen;
