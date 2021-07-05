import React from "react";
import { StyleSheet } from "react-native";
import { Modal, Text, Button, Card, Icon, Layout } from "@ui-kitten/components";

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

export const WarningIcon = (props) => (
  <Icon
    name="exclamationcircle"
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

function PopUpMsg({
  promptConfirmMsg = false,
  confirmMsg = null,
  onPressConfirm = null,
  onPressCancelConfirm = null,
  ...props
}) {
  const { visible, onPress, success, text } = props;

  //By default is just a pop up message that show the status.
  //If want to prompt a confirm message, pass those confirm props as shown at the top.

  const StatefulModal = () => {
    try {
      return (
        <React.Fragment>
          {promptConfirmMsg && (
            <Modal
              visible={promptConfirmMsg}
              backdropStyle={{ backgroundColor: colors.backdrop }}
            >
              <Card style={styles.card} status="warning">
                <WarningIcon />
                <Text
                  style={{
                    marginBottom: 15,
                    color: colors.error,
                    ...styles.centerText,
                  }}
                >
                  {confirmMsg}
                </Text>
                <Layout
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    status="success"
                    onPress={onPressConfirm}
                    style={{ marginRight: 20 }}
                  >
                    CONFIRM
                  </Button>
                  <Button status="danger" onPress={onPressCancelConfirm}>
                    CANCEL
                  </Button>
                </Layout>
              </Card>
            </Modal>
          )}

          <Modal
            visible={visible}
            onBackdropPress={onPress}
            backdropStyle={{ backgroundColor: colors.backdrop }}
          >
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
          </Modal>
        </React.Fragment>
      );
    } catch (err) {
      return null;
    }
  };

  return <StatefulModal />;
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
    minHeight: 200,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    textAlign: "center",
  },
});

export default PopUpMsg;
