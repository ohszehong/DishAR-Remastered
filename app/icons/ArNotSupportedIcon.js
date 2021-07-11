import React from "react";
import { Dimensions } from "react-native";
import { Icon, Text } from "@ui-kitten/components";

import colors from "../config/colors";

function ArNotSupportedIcon(props) {
  return (
    <React.Fragment>
      <Icon
        name="frown"
        {...props}
        style={[
          props.style,
          {
            height: 50,
            width: 50,
            color: colors.empty,
            marginBottom: 15,
            alignSelf: "center",
            marginTop: Dimensions.get("screen").height / 3.3,
          },
        ]}
      />
      <Text category="h5" style={{ textAlign: "center", color: colors.empty }}>
        AR is not supported on this phone.
      </Text>
    </React.Fragment>
  );
}

export default ArNotSupportedIcon;
