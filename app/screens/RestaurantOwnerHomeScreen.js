import React, { Component } from "react";
import TabNavigator from "../navigator/BottomTabs";

class RestaurantOwnerHomeScreen extends Component {
  constructor({ navigation, route, ...props }) {
    super();

    //if inside restaurantOwnerData there's a field of role: "customer", it means it is current accessed by customer.

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
