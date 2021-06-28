import React from "react";
import * as eva from "@eva-design/eva";
import { StyleSheet } from "react-native";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";

import RootScreen from "./app/screens/RootScreen";
import { AntDesignIconsPack } from "./app/icons/ant-design-icons";

export default function App() {
  return (
    <>
      <IconRegistry icons={AntDesignIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <RootScreen />
      </ApplicationProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
