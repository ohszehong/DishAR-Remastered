import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  Layout,
  Input,
  Divider,
  Button,
  Text,
  Spinner,
} from "@ui-kitten/components";
import { SimpleAnimation } from "react-native-simple-animations";
import { CommonActions } from "@react-navigation/native";

import colors from "../../config/colors";
import LoginAPI from "../../api/shared/login-caller";
import PopUpMsg from "../reusable/PopUpMsg";

function LoginModal({
  containerStyle,
  onSwitchScreen,
  onPromptRegisterModal,
  navigation,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //loading signal
  const [isLoading, setIsLoading] = useState(false);

  //login success signal
  const [correctCredentials, setCorrectCredentials] = useState(false);

  //action message
  const [actionMsg, setActionMsg] = useState(null);

  const handleLogin = async () => {
    setIsLoading(true);

    let credentials = {
      username: username,
      password: password,
    };

    const response = await LoginAPI.login(credentials);

    if (response.success) {
      setCorrectCredentials(true);
      setActionMsg(response.msg);

      //navigate based on role
      if (response.role === "restaurant owner") {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "RestaurantOwner", data: response.data }],
          })
        );
      } else if (response.role === "admin") {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "Admin", data: response.data }],
          })
        );
      }
    } else {
      setCorrectCredentials(false);
      setActionMsg(response.error);
    }

    setIsLoading(false);
  };

  return (
    <SimpleAnimation
      direction="down"
      movementType="slide"
      duration={2000}
      distance={400}
      style={containerStyle}
    >
      <Layout style={styles.loginFormContainer}>
        <Input
          textStyle={styles.loginInput}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
        />
        <Input
          textStyle={styles.loginInput}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <Divider style={styles.divider} />
        <Button size="large" status="success" onPress={handleLogin}>
          {isLoading ? <Spinner status="control" /> : "LOGIN"}
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

      <PopUpMsg
        visible={actionMsg}
        success={correctCredentials}
        text={actionMsg}
        onPress={() => setActionMsg(null)}
      />
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
