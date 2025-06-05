import React from "react";
import styles from "./Text.module.css";
function Title(props) {
  const {
    label
  } = props;
  return /*#__PURE__*/React.createElement("label", {
    className: styles.title
  }, label);
}
export default Title;