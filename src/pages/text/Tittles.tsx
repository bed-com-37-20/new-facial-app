import React from "react";
import {
  Subtitle,
  Title,
  WithPadding
} from "../../components";

function Titles(): React.ReactElement {
  return (
    <WithPadding p="20px">
      <Title label="This is a title" />
      <br />
      <br />
      <Subtitle label="This is a subtitle component"/>
    </WithPadding>
  );
}

export default Titles;
