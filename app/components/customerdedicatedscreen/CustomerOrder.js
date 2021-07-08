import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Layout, Text } from "@ui-kitten/components";

class CustomerOrder extends Component {
  constructor({ navigation, route }) {
    super();

    this.state = {
      navigation: navigation,
    };
  }

  componentDidUpdate() {
    this.onScreenFocus();
  }

  onScreenFocus = () => {
    console.log("Focused...");
  };

  render() {
    return (
      <Layout>
        <Text>Hello World!</Text>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({});

export default CustomerOrder;
