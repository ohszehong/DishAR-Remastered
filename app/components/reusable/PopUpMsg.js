import React from "react";
import { StyleSheet } from "react-native";
import { SimpleAnimation } from "react-native-simple-animations";
import { Modal, Text, Button, Card, Icon } from "@ui-kitten/components";

import colors from "../../config/colors";

export const SuccessIcon = (props) => (
  <Icon
    name="checkcircle"
    {...props}
    style={[
      props.style,
      {
        height: 50,
        width: 50,
        color: colors.primary,
        marginBottom: 15,
        alignSelf: "center",
      },
    ]}
  />
);

export const FailIcon = (props) => (
  <Icon
    name="closecircle"
    {...props}
    style={[
      props.style,
      {
        height: 50,
        width: 50,
        color: colors.error,
        marginBottom: 15,
        alignSelf: "center",
      },
    ]}
  />
);

function PopUpMsg(props) {
  const { visible, onPress, success, text } = props;

  const StatefulModalContent = () => {
    return (
      <Card
        style={styles.card}
        status={success ? "success" : "danger"}
        onPress={onPress}
      >
        {success ? <SuccessIcon /> : <FailIcon />}
        <Text style={styles.centerText}>{text}</Text>
        <Text
          style={{
            ...styles.centerText,
            color: success ? colors.primary : colors.error,
            marginTop: 15,
          }}
        >
          Press anywhere to continue.
        </Text>
      </Card>
    );
  };

  return (
    <SimpleAnimation
      direction="up"
      movementType="slide"
      duration={800}
      distance={400}
      style={styles.container}
    >
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={onPress}
      >
        <StatefulModalContent />
      </Modal>
    </SimpleAnimation>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.backdrop,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    height: 200,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    textAlign: "center",
  },
});

export default PopUpMsg;
