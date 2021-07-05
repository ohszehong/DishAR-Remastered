import React, { Component } from "react";
import FoodDetailsStacks from "../../navigator/FoodDetailsStacks";

class BetweenFoodAndDetails extends Component {
  constructor({ navigation, route, ...props }) {
    super();
    this.state = { restaurantOwnerData: route.params };
  }

  render() {
    const { restaurantOwnerData } = this.state;

    return <FoodDetailsStacks restaurantOwnerData={restaurantOwnerData} />;
  }
}

export default BetweenFoodAndDetails;
