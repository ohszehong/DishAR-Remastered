import React, { Component } from "react";
import * as eva from "@eva-design/eva";
import { StyleSheet, View, TouchableHighlight, Image } from "react-native";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { AntDesignIconsPack } from "./app/icons/ant-design-icons";
import * as firebase from "firebase";

import Constants from "./app/Constants";
import { default as theme } from "./theme.json";
import Stacks from "./app/navigator/Stacks";
import FoodARScene from "./app/components/FoodARScene";
import { ViroARSceneNavigator } from "@akadrimer/react-viro";

export default class App extends Component {
  constructor(props) {
    super(props);

    //initialize firebase
    if (!firebase.default.apps.length) {
      firebase.default.initializeApp(Constants.FirebaseConfig);
    }

    this.state = {
      foodData: {
        foodModelAssets: {
          foodObjFilePath: "60dd60d436a7f60ed8e230f2/Teisyoku/teisyoku2.obj",
          foodMtlFilePath: "60dd60d436a7f60ed8e230f2/Teisyoku/teisyoku2.mtl",
          foodTextureFilePath:
            "60dd60d436a7f60ed8e230f2/Teisyoku/teisyoku2.jpg",
        },
        foodNutritionalFacts: {
          foodCalories: 234,
          foodProtein: 23,
          foodCarbohydrates: 23,
          foodFat: 23,
        },
        foodAvailable: true,
        _id: "60e68c8e28b0523bdc744c93",
        from: "60dd60d436a7f60ed8e230f2",
        foodName: "Teisyoku",
        foodPrice: 23,
        foodThumbnailFilePath:
          "60dd60d436a7f60ed8e230f2/Teisyoku/TeisyokuThumbnail.jpg",
        foodDesc: "This is teisyoku",
        foodIngredients: "Japanese shyt",
        __v: 0,
        restaurantOwnerId: "60dd60d436a7f60ed8e230f2",
        thumbnailUrl:
          "https://firebasestorage.googleapis.com/v0/b/dishar-15259.appspot.com/o/60dd60d436a7f60ed8e230f2%2FTeisyoku%2FTeisyokuThumbnail.jpg?alt=media&token=85e015c0-0077-49af-acfa-b53820fa8039",
        role: "customer",
      },
    };
  }

  render() {
    return (
      <>
        <IconRegistry icons={AntDesignIconsPack} />
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
          <Stacks />
        </ApplicationProvider>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  outer: {
    flex: 1,
  },
  buttons: {
    height: 80,
    width: 80,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#00000000",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffffff00",
  },
});
