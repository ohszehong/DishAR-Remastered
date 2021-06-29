import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Layout, Input, Divider, Button, Text } from "@ui-kitten/components";
import { SimpleAnimation } from "react-native-simple-animations";

import colors from "../../config/colors";

function LoginModal({ containerStyle, onSwitchScreen, onPromptRegisterModal }) {
  return (
    <SimpleAnimation
      direction="down"
      movementType="slide"
      duration={2000}
      distance={400}
      style={containerStyle}
    >
      <Layout style={styles.loginFormContainer}>
        <Input textStyle={styles.loginInput} placeholder="E-mail" />
        <Input
          textStyle={styles.loginInput}
          placeholder="Password"
          secureTextEntry={true}
        />
        <Divider style={styles.divider} />
        <Button size="large" status="success">
          LOGIN
        </Button>
        <Button size="large" status="warning" onPress={onPromptRegisterModal}>
          REGISTER
        </Button>
        <Layout style={styles.switchScanQRContainer}>
          <Text>Customer? </Text>
          <TouchableOpacity onPress={onSwitchScreen}>
            <Text status="success">Tap here</Text>
          </TouchableOpacity>
        </Layout>
      </Layout>
    </SimpleAnimation>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 3,
  },
  loginFormContainer: {
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  loginInput: {
    fontSize: 19,
    height: 40,
  },
  switchScanQRContainer: {
    width: "100%",
    height: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default LoginModal;
