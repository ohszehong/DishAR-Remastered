import React, { Component } from "react";
import { BackHandler, Alert } from "react-native";

import PopUpMsg from "./reusable/PopUpMsg";

class Quit extends Component {
  constructor({ navigation, route }) {
    super();
    this.state = {
      navigation: navigation,
      promptConfirmMsg: true,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backPressed);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
  }

  backPressed = () => {
    BackHandler.exitApp();
  };

  render() {
    const { navigation, promptConfirmMsg } = this.state;

    return (
      <PopUpMsg
        promptConfirmMsg={promptConfirmMsg}
        confirmMsg={"Are you sure you want to exit?"}
        onPressCancelConfirm={() => navigation.goBack()}
        onPressConfirm={this.backPressed}
      />
    );
  }
}

export default Quit;
