import React from "react";
import { Icon } from "@ui-kitten/components";
import colors from "../config/colors";

function PriceIcon({ alignSelf = "flex-end", style, ...props }) {
  return (
    <Icon
      name="tag"
      {...props}
      style={[
        props.style,
        {
          height: 23,
          width: 23,
          marginRight: 5,
          color: colors.primary,
          alignSelf: alignSelf,
          ...style,
        },
      ]}
    />
  );
}

export default PriceIcon;
