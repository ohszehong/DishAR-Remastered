import React, { Component } from "react";
import { LogBox } from "react-native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { AntDesignIconsPack } from "./app/icons/ant-design-icons";
import * as firebase from "firebase";

import Constants from "./app/Constants";
import { default as theme } from "./theme.json";
import Stacks from "./app/navigator/Stacks";
import { default as mapping } from "./mapping.json";

LogBox.ignoreLogs([
  "Unable to deactivate keep awake. However, it probably is deactivated already.",
]);

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
        <ApplicationProvider
          {...eva}
          theme={{ ...eva.light, ...theme }}
          customMapping={mapping}
        >
          <Stacks />
        </ApplicationProvider>
      </>
    );
  }
}
