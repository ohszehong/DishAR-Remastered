import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
  ViroText,
  ViroARScene,
  Viro3DObject,
  ViroImage,
} from "@akadrimer/react-viro";

class FoodActualARScene extends Component {
  constructor({ sceneNavigator }) {
    super();
    this.state = {
      foodData: sceneNavigator.viroAppProps.foodData,
      foodObjFilePath:
        sceneNavigator.viroAppProps.foodData.foodModelAssets
          .foodObjWorkspaceFilePath,
      foodMtlFilePath:
        sceneNavigator.viroAppProps.foodData.foodModelAssets
          .foodMtlWorkspaceFilePath,
      foodTextureFilePath:
        sceneNavigator.viroAppProps.foodData.foodModelAssets
          .foodTextureWorkspaceFilePath,
      rotation: [270, 90, 0],
      isLoading: false,
      setupText: false,
    };
  }

  _onRotate = (rotateState, rotationFactor, source) => {
    let { rotation } = this.state;

    if (rotateState === 3) {
      this.setState({
        rotation: [rotation[0], rotation[1] + rotationFactor, rotation[2]],
      });
      return;
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
      rotation,
      isLoading,
      foodData,
      foodObjFilePath,
      foodMtlFilePath,
      foodTextureFilePath,
      setupText,
    } = this.state;

    // const constantRequiredDirectory = "./../assets/";

    // let trimmedObjFilePath = foodObjFilePath.replace(
    //   constantRequiredDirectory,
    //   ""
    // );
    // let trimmedMtlFilePath = foodMtlFilePath.replace(
    //   constantRequiredDirectory,
    //   ""
    // );
    // let trimmedTextureFilePath = foodTextureFilePath.replace(
    //   constantRequiredDirectory,
    //   ""
    // );

    return (
      <ViroARScene>
        {foodData.foodObjWorkspaceFilePath != "" && (
          <Viro3DObject
            position={[0.0, -0.5, -20]}
            scale={[0.8, 0.8, 0.8]}
            rotation={rotation}
            source={require("./../assets/60dd60d436a7f60ed8e230f2/Teisyoku/teisyoku2.obj")}
            resources={[
              require("./../assets/60dd60d436a7f60ed8e230f2/Teisyoku/teisyoku2.mtl"),
              require("./../assets/60dd60d436a7f60ed8e230f2/Teisyoku/teisyoku2.jpg"),
            ]}
            type="OBJ"
            dragType="FixedDistance"
            onDrag={() => {}}
            onRotate={this._onRotate}
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
