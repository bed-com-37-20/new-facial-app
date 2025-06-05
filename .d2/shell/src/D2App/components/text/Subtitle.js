import React from "react";
import styles from "./Text.module.css";
function Subtitle(props) {
  const {
    label
  } = props;
  return /*#__PURE__*/React.createElement("h6", {
    className: styles.subTitle
  }, label);
}
export default Subtitle;