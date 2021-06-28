import React, { useState } from "react";
import * as eva from "@eva-design/eva";
import { StyleSheet, StatusBar } from "react-native";
import { Layout } from "@ui-kitten/components";

import RootScreenLogo from "../components/RootScreenLogo";
import ScanQRModal from "../components/ScanQRModal";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

function RootScreen(props) {
  //hooks
  const [isLoginScreen, setIsLoginScreen] = useState(false);
  const [promptRegisterModal, setPromptRegisterModal] = useState(false);

  const handleSwitchScreen = () => {
    if (isLoginScreen) {
      setIsLoginScreen(false);
    } else {
      setIsLoginScreen(true);
    }
  };
  const handlePromptRegisterModal = () => {
    if (promptRegisterModal) {
      setPromptRegisterModal(false);
    } else {
      setPromptRegisterModal(true);
    }
  };

  return (
    <>
      <Layout style={styles.rootScreen}>
        <RootScreenLogo
          logoContainerStyle={styles.logoContainer}
          logoImageStyle={styles.logo}
          logoTitleStyle={styles.logoTitle}
        />
        {!isLoginScreen ? (
          <ScanQRModal
            containerStyle={styles.scanQRModalContainer}
            isHidden={isLoginScreen}
            onSwitchScreen={handleSwitchScreen}
          />
        ) : (
          <LoginModal
            containerStyle={styles.loginModalContainer}
            isHidden={isLoginScreen}
            onSwitchScreen={handleSwitchScreen}
            onPromptRegisterModal={handlePromptRegisterModal}
          />
        )}
      </Layout>

      {promptRegisterModal && (
        <RegisterModal
          onPromptRegisterModal={handlePromptRegisterModal}
          visible={promptRegisterModal}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 200,
  },
  logoContainer: {
    position: "absolute",
    top: 70,
  },
  logoTitle: {
    textAlign: "center",
  },
  rootScreen: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: StatusBar.currentHeight,
  },
  scanQRModalContainer: {
    position: "absolute",
    bottom: 70,
    width: "80%",
    height: 200,
    alignItems: "center",
  },
  loginModalContainer: {
    position: "absolute",
    bottom: 10,
    width: "80%",
    height: 320,
    alignItems: "center",
  },
});

export default RootScreen;
