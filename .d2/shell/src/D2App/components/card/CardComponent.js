/* eslint-disable react/prop-types */
import { useConfig } from "@dhis2/app-runtime";
import { Box, Card } from "@dhis2/ui";
import React from "react";
import style from "./Card.module.css";
import { Divider, IconButton, Tooltip } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import classNames from "classnames";
import { Link } from "react-router-dom";
export default function DashboardCard(props) {
  const {
    baseUrl
  } = useConfig();
  const {
    icon,
    title,
    listLink,
    formLink,
    disabled,
    appName
  } = props;
  return /*#__PURE__*/React.createElement(Box, {
    width: "180px"
  }, /*#__PURE__*/React.createElement(Card, {
    className: classNames(style.cardContainer, disabled === true && style.disabledCard)
  }, /*#__PURE__*/React.createElement("div", {
    className: style.cardHeader
  }, /*#__PURE__*/React.createElement("img", {
    src: icon
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: style.cardStatistics
  }, /*#__PURE__*/React.createElement("strong", {
    className: style.cardTitle
  }, title)), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: style.cardActions
  }, /*#__PURE__*/React.createElement(Link, {
    to: formLink,
    className: disabled === true && style.disabledLink
  }, /*#__PURE__*/React.createElement(Tooltip, {
    title: `${title}`
  }, /*#__PURE__*/React.createElement(IconButton, {
    size: "small",
    disabled: disabled
  }, /*#__PURE__*/React.createElement(Menu, null)))))));
}