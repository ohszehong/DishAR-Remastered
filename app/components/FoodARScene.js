import React, { Component } from "react";
import { StyleSheet, BackHandler } from "react-native";
import { ViroUtils, ViroARSceneNavigator } from "@akadrimer/react-viro";

import FoodActualARScene from "./FoodActualARScene";

class FoodARScene extends Component {
  constructor({ navigation, route }) {
    super();
    this.state = {
      navigation: navigation,
      foodData: route.params.foodData,
    };
  }

  async componentDidMount() {
    ViroUtils.isARSupportedOnDevice(
      this._handleARNotSupported,
      this._handleARSupported
    );

    // BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.handleBackButtonClick
    // );
  }

  _handleARSupported() {
    console.log("AR supported.");
  }

  _handleARNotSupported(reason) {
    console.log("AR not supported, with reason: " + reason);
  }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener(
  //     "hardwareBackPress",
  //     this.handleBackButtonClick
  //   );
  // }

  // handleBackButtonClick = () => {
  //   const { navigation, foodData } = this.state;

  //   console.log("Pressed back button." + JSON.stringify(foodData));

  //   navigation.push("FoodDetails", { data: foodData });
  //   return true;
  // };

  render() {
    let { foodData } = this.state;

    return (
      <ViroARSceneNavigator
        style={styles.arView}
        initialScene={{
          scene: FoodActualARScene,
        }}
        viroAppProps={{ foodData: foodData }}
      />
    );
  }
}

const styles = StyleSheet.create({
  arView: {
    flex: 1,
  },
});

export default FoodARScene;
