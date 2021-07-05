import React, { Component } from "react";
import * as eva from "@eva-design/eva";
import { StyleSheet } from "react-native";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { AntDesignIconsPack } from "./app/icons/ant-design-icons";
import * as firebase from "firebase";

import Constants from "./app/Constants";
import { default as theme } from "./theme.json";
import Stacks from "./app/navigator/Stacks";

export default class App extends Component {
  constructor(props) {
    super(props);

    //initialize firebase
    if (!firebase.default.apps.length) {
      firebase.default.initializeApp(Constants.FirebaseConfig);
    }
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
});
