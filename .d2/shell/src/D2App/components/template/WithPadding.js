import React from 'react';
export default function WithPadding(props) {
  const {
    children,
    padding = "0.5rem"
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: padding
    }
  }, children);
}