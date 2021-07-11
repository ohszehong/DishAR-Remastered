import React, { Component } from "react";
import { StyleSheet, BackHandler } from "react-native";
import { ViroUtils, ViroARSceneNavigator } from "@akadrimer/react-viro";

import FoodActualARScene from "./FoodActualARScene";
import ArNotSupportedIcon from "../icons/ArNotSupportedIcon";
import QuittingArIcon from "../icons/QuittingArIcon";

class FoodARScene extends Component {
  constructor({ navigation, route }) {
    super();
    this.state = {
      navigation: navigation,
      foodData: route.params.foodData,
      isARSupported: false,
      isARSupportedButQuitting: false,
    };
  }

  async componentDidMount() {
    ViroUtils.isARSupportedOnDevice(
      this._handleARNotSupported,
      this._handleARSupported
    );
    BackHandler.addEventListener("hardwareBackPress", this.backPressed);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
  }

  _handleARSupported = () => {
    console.log("AR supported.");
    this.setState({ isARSupported: true });
  };

  _handleARNotSupported = (reason) => {
    console.log("AR not supported, with reason: " + reason);
  };

  backPressed = () => {
    console.log("pressed back.");
    this.setState({ isARSupportedButQuitting: true });
  };

  render() {
    let { foodData, isARSupported, isARSupportedButQuitting } = this.state;

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
    } else if (isARSupportedButQuitting) {
      return <QuittingArIcon />;
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
