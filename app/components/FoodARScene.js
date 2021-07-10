import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
  ViroText,
  ViroScene,
  ViroARScene,
  ViroUtils,
} from "@akadrimer/react-viro";

class FoodARScene extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    ViroUtils.isARSupportedOnDevice(
      this._handleARNotSupported,
      this._handleARSupported
    );
  }

  _handleARSupported() {
    console.log("AR supported.");
  }

  _handleARNotSupported(reason) {
    console.log("AR not supported, with reason: " + reason);
  }

  render() {
    return (
      <ViroARScene>
        <ViroText
          text={"Hello World"}
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -1]}
          style={styles.helloWorldTextStyle}
        />
      </ViroARScene>
    );
  }
}

const styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

export default FoodARScene;
