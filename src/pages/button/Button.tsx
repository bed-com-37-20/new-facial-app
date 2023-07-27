import React from "react";
// eslint-disable-next-line import/extensions
import {
  Buttons,
  ButtonsGroup,
  SplitButtonComponent,
  SwitchButtonView,
  Title,
  WithPadding
} from "../../components";
import {
  IconUserGroup16,
  ButtonStrip
} from "@dhis2/ui";
import { enrollmentOptions } from "../../components/buttons/options";
import {
  buttonOptionsIcons,
  buttonOptionsLabels
} from "../../components/buttons/GroupedButtons/options";

function ButtonsPage(): React.ReactElement {
  return (
    <div>
      <WithPadding p="15px">
        <Title label="Default buttons" />
        <Buttons />
      </WithPadding>
      <hr />

      <WithPadding p="15px">
        <Title label="Split dropdown button" />
        <ButtonStrip>
          <SplitButtonComponent
            name="Bulk enrollment"
            icon={<IconUserGroup16 />}
            options={enrollmentOptions}
          />
        </ButtonStrip>
      </WithPadding>
      <hr />

      <WithPadding p="15px">
        <Title label="Simple customized buttons" />
        <ButtonStrip>
          <SwitchButtonView />
        </ButtonStrip>
      </WithPadding>
      <hr />

      <WithPadding p="15px">
        <Title label="Buttons group" />
        <ButtonStrip>
          <ButtonsGroup options={buttonOptionsLabels} />
          <ButtonsGroup options={buttonOptionsIcons} />
        </ButtonStrip>
      </WithPadding>
    </div>
  );
}

export default ButtonsPage;
