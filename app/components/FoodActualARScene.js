import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
  ViroText,
  ViroARScene,
  Viro3DObject,
  ViroImage,
} from "@akadrimer/react-viro";
import * as firebase from "firebase";

class FoodActualARScene extends Component {
  constructor({ sceneNavigator }) {
    super();
    this.state = {
      foodData: sceneNavigator.viroAppProps.foodData,
      foodObjFileUrl: "",
      foodMtlFileUrl: "",
      foodTextureFileUrl: "",
      rotation: [0, 0, 0],
      scale: [0.1, 0.1, 0.1],
      isLoading: false,
      setupText: false,
    };
  }
  componentDidMount() {
    const { foodData } = this.state;

    this.getFoodModelAssetsUrl(foodData.foodModelAssets.foodObjFilePath, "obj");
    this.getFoodModelAssetsUrl(foodData.foodModelAssets.foodMtlFilePath, "mtl");
    this.getFoodModelAssetsUrl(
      foodData.foodModelAssets.foodTextureFilePath,
      "texture"
    );
  }

  getFoodModelAssetsUrl = (filePath, fileType) => {
    const storage = firebase.default.storage();
    const storageRef = storage.ref();
    const fileRef = storageRef.child(filePath);

    if (fileType === "obj") {
      fileRef.getDownloadURL().then((url) => {
        this.setState({ foodObjFileUrl: url });
      });
    } else if (fileType === "mtl") {
      fileRef.getDownloadURL().then((url) => {
        this.setState({ foodMtlFileUrl: url });
      });
    } else if (fileType === "texture") {
      fileRef.getDownloadURL().then((url) => {
        this.setState({ foodTextureFileUrl: url });
      });
    }
  };

  _onRotate = (rotateState, rotationFactor, source) => {
    let { rotation } = this.state;

    if (rotateState === 3) {
      this.setState({
        rotation: [rotation[0], rotation[1] + rotationFactor, rotation[2]],
      });
      return;
    }
  };

  _onPinch = (pinchState, scaleFactor, source) => {
    let { scale } = this.state;

    let newScale = [
      scale[0] * scaleFactor,
      scale[1] * scaleFactor,
      scale[2] * scaleFactor,
    ];

    if (pinchState == 3) {
      if (newScale[0] >= 1 && newScale[0] >= 1 && newScale[0] >= 1) {
        this.setState({
          scale: [1, 1, 1],
        });
        return;
      } else {
        this.setState({
          scale: newScale,
        });
        return;
      }
    }
  };

  setLoading = () => {
    const { isLoading } = this.state;
    if (isLoading) {
      this.setState({ isLoading: false, setupText: true });
    } else {
      this.setState({ isLoading: true });
    }
  };

  render() {
    const {
      foodObjFileUrl,
      foodMtlFileUrl,
      foodTextureFileUrl,
      rotation,
      isLoading,
      scale,
      foodData,
      setupText,
    } = this.state;

    return (
      <ViroARScene>
        {foodObjFileUrl != "" &&
          foodMtlFileUrl != "" &&
          foodTextureFileUrl != "" && (
            <Viro3DObject
              position={[0.0, -0.5, -5]}
              scale={scale}
              rotation={rotation}
              source={{ uri: foodObjFileUrl }}
              type="OBJ"
              dragType="FixedDistance"
              onDrag={() => {}}
              onRotate={this._onRotate}
              onPinch={this._onPinch}
              onLoadStart={this.setLoading}
              onLoadEnd={this.setLoading}
            />
          )}
        {setupText && (
          <React.Fragment>
            <ViroText
              text={"Calories: " + foodData.foodNutritionalFacts.foodCalories}
              textAlign="center"
              color="#ff0000"
              width={2}
              height={2}
              style={styles.viroTextStyle}
              position={[0, 1.2, -5]}
            />
            <ViroText
              text={"Protein: " + foodData.foodNutritionalFacts.foodProtein}
              textAlign="center"
              color="#ff0000"
              width={2}
              height={2}
              style={styles.viroTextStyle}
              position={[0, 0.8, -5]}
            />
            <ViroText
              text={
                "Carbohydrates: " +
                foodData.foodNutritionalFacts.foodCarbohydrates
              }
              textAlign="center"
              color="#ff0000"
              width={2}
              height={2}
              style={styles.viroTextStyle}
              position={[0, 0.3, -5]}
            />
            <ViroText
              text={"Fat: " + foodData.foodNutritionalFacts.foodFat}
              textAlign="center"
              color="#ff0000"
              width={2}
              height={2}
              style={styles.viroTextStyle}
              position={[0, -0.2, -5]}
            />
          </React.Fragment>
        )}
        {isLoading && (
          <ViroText
            text="Loading..., use two fingers to rotate or zoom in/out"
            textAlign="center"
            color="#ff0000"
            width={2}
            height={2}
            style={styles.viroTextStyle}
            position={[0, -2.0, -5]}
          />
        )}
        {isLoading && (
          <ViroImage
            scale={[0.2, 0.2, 0.2]}
            position={[0, -0.2, -1]}
            source={require("../assets/two-finger-gestures.png")}
          />
        )}
      </ViroARScene>
    );
  }
}

const styles = StyleSheet.create({
  viroTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

export default FoodActualARScene;
