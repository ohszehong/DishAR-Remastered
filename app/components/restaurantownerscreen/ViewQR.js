import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import QRCode from "react-native-qrcode-svg";

function ViewQR({navigation, route}) {

  const restaurantOwnerId = route.params._id;

  return (
    <Layout style={styles.QRCodeContainer}>
      <QRCode
          value={restaurantOwnerId}
          size={200}/>
    </Layout>
  );
}

const styles = StyleSheet.create({
  QRCodeContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    justifyContent:"center",
    alignItems: "center",
  }
})

export default ViewQR;
