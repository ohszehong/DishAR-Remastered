import React from "react";
import { Icon } from "@ui-kitten/components";
import colors from "../config/colors";

function EditIcon({ alignSelf = "flex-end", style, ...props }) {
  return (
    <Icon
      name="edit"
      {...props}
      style={[
        props.style,
        {
          height: 23,
          width: 23,
          marginRight: 5,
          color: colors.white,
          alignSelf: alignSelf,
          ...style,
        },
      ]}
    />
  );
}

export default EditIcon;
