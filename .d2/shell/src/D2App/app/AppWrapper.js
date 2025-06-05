import React from 'react';
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { useDataStore } from '../hooks/appwarapper/useDataStore';
import { useGetInstanceApps } from '../hooks/appwarapper/useGetInstanceApps';
export default function AppWrapper(props) {
  const {
    error,
    loading
  } = useDataStore();
  const {
    error: errorApps,
    loading: loadingApps
  } = useGetInstanceApps();
  if (loading || loadingApps) {
    return /*#__PURE__*/React.createElement(CenteredContent, null, /*#__PURE__*/React.createElement(CircularLoader, null));
  }
  if (error != null || errorApps) {
    return /*#__PURE__*/React.createElement(CenteredContent, null, "Something went wrong wen loading the app, please check if you app is already configured");
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, props.children);
}