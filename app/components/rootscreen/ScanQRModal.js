import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Layout, Text, Button, Icon } from "@ui-kitten/components";

import { SimpleAnimation } from "react-native-simple-animations";

import colors from "../../config/colors";

export const ScanIcon = (props) => (
  <Icon
    name="scan1"
    {...props}
    style={[props.style, { height: 48, width: 48 }]}
  />
);

function ScanQRModal({ containerStyle, onSwitchScreen }) {
  return (
    <SimpleAnimation
      direction="up"
      movementType="slide"
      duration={2000}
      distance={400}
      style={containerStyle}
    >
      <Layout>
        <Button
          style={styles.scanQRButton}
          appearance="outline"
          status="success"
          accessoryLeft={ScanIcon}
          onPress={() => console.log("Tapped")}
        >
          <Text category="h5">SCAN QR CODE</Text>
        </Button>
        <Layout style={styles.switchLoginContainer}>
          <Text category="h6">Restaurant owner? </Text>
          <TouchableOpacity onPress={onSwitchScreen}>
            <Text category="h6" status="success">
              Tap here
            </Text>
          </TouchableOpacity>
        </Layout>
      </Layout>
    </SimpleAnimation>
  );
}

const styles = StyleSheet.create({
  scanQRButton: {
    width: "100%",
    height: 110,
    borderColor: colors.primary,
  },
  switchLoginContainer: {
    width: "100%",
    marginTop: 15,
    height: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default ScanQRModal;
