import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
  ViroText,
  ViroARScene,
  Viro3DObject,
  ViroImage,
  ViroMaterials,
} from "@akadrimer/react-viro";
import * as firebase from "firebase";

class FoodActualARScene extends Component {
  constructor({ sceneNavigator }) {
    super();

    let params = sceneNavigator.viroAppProps.foodData;

    this.state = {
      foodData: params,
      foodObjFilePath: params.foodModelAssets.foodObjWorkspaceFilePath,
      foodMtlFilePath: params.foodModelAssets.foodMtlWorkspaceFilePath,
      foodTextureFilePath: params.foodModelAssets.foodTextureWorkspaceFilePath,
      foodObjFirebaseFilePath: params.foodModelAssets.foodObjFirebaseFilePath,
      foodMtlFirebaseFilePath: params.foodModelAssets.foodMtlFirebaseFilePath,
      foodTextureFirebaseFilePath:
        params.foodModelAssets.foodTextureFirebaseFilePath,
      foodObjFileUrl: "",
      foodMtlFileUrl: "",
      foodTextureFileUrl: "",
      rotation: [270, 90, 0],
      isLoading: false,
      setupText: false,
    };
  }

  async componentDidMount() {
    await this.getDownloadURLs();
  }

  getDownloadURLs = async () => {
    //retrieve download url for the resources from firebase.
    const {
      foodObjFirebaseFilePath,
      foodMtlFirebaseFilePath,
      foodTextureFirebaseFilePath,
    } = this.state;

    const storage = firebase.default.storage();
    const storageRef = storage.ref();
    const objFileRef = storageRef.child(foodObjFirebaseFilePath);
    const mtlFileRef = storageRef.child(foodMtlFirebaseFilePath);
    const textureFileRef = storageRef.child(foodTextureFirebaseFilePath);

    let foodObjFileUrl = "";
    let foodMtlFileUrl = "";
    let foodTextureFileUrl = "";

    await objFileRef.getDownloadURL().then((url) => {
      foodObjFileUrl = url;
    });

    await mtlFileRef.getDownloadURL().then((url) => {
      foodMtlFileUrl = url;
    });

    await textureFileRef.getDownloadURL().then((url) => {
      foodTextureFileUrl = url;
    });

    this.setState({ foodObjFileUrl, foodMtlFileUrl, foodTextureFileUrl });
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
      foodObjFileUrl,
      foodMtlFileUrl,
      foodTextureFileUrl,
      setupText,
    } = this.state;

    return (
      <ViroARScene>
        {foodObjFileUrl != "" &&
          foodMtlFileUrl != "" &&
          foodTextureFileUrl != "" && (
            <Viro3DObject
              position={[0.0, -0.5, -20]}
              scale={[0.8, 0.8, 0.8]}
              rotation={rotation}
              //source={require("./../assets/60dd60d436a7f60ed8e230f2/Teisyoku/teisyoku2.obj")}
              source={{ uri: foodObjFileUrl }}
              // resources={[
              //   require("./../assets/60dd60d436a7f60ed8e230f2/Teisyoku/teisyoku2.mtl"),
              //   require("./../assets/60dd60d436a7f60ed8e230f2/Teisyoku/teisyoku2.jpg"),
              // ]}
              resources={[{ uri: foodMtlFileUrl }, { uri: foodTextureFileUrl }]}
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
            text="Loading..., use two fingers to rotate"
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

// const helperCreateAndGetMaterial = (textureUrl) => {
//   // ViroMaterials.createMaterials({
//   //   food_mtl: {
//   //     shininess: 2.0,
//   //     lightingModel: "Lambert",
//   //     diffuseTexture: { uri: textureUrl },
//   //   },
//   // });
// };

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
