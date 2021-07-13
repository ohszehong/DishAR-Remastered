import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { ViroUtils, ViroARSceneNavigator } from "@akadrimer/react-viro";

import FoodActualARScene from "./FoodActualARScene";
import ArNotSupportedIcon from "../icons/ArNotSupportedIcon";

class FoodARScene extends Component {
  constructor({ navigation, route }) {
    super();
    this.state = {
      navigation: navigation,
      foodData: route.params.foodData,
      isARSupported: false,
    };
  }

  async componentDidMount() {
    ViroUtils.isARSupportedOnDevice(
      this._handleARNotSupported,
      this._handleARSupported
    );
  }

  _handleARSupported = () => {
    console.log("AR supported.");
    this.setState({ isARSupported: true });
  };

  _handleARNotSupported = (reason) => {
    console.log("AR not supported, with reason: " + reason);
  };

  render() {
    let { foodData, isARSupported } = this.state;

    if (isARSupported) {
      return (
        <ViroARSceneNavigator
          style={styles.arView}
          initialScene={{
            scene: FoodActualARScene,
          }}
          viroAppProps={{ foodData: foodData }}
        />
      );
    } else {
      return <ArNotSupportedIcon />;
    }
  }
}

const styles = StyleSheet.create({
  arView: {
    flex: 1,
  },
});

export default FoodARScene;
