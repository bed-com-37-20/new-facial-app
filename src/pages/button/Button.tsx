import React from "react";
// eslint-disable-next-line import/extensions
import {
  Buttons,
  ButtonsGroup,
  DropdownButtonComponent,
  SwitchButtonView,
  WithPadding
} from "../../components";
import {
  IconUserGroup16,
  IconAddCircle24,
  Button,
  ButtonStrip
} from "@dhis2/ui";
import { enrollmentOptions } from "../../components/buttons/options";
import { buttonOptionsIcons, buttonOptionsLabels } from "../../components/buttons/GroupedButtons/options";

function ButtonsPage(): React.ReactElement {
  return (
    <WithPadding>
      <Buttons />
      <br />
      <ButtonStrip>
        <Button icon={<IconAddCircle24 />}>Enrol single student</Button>
        <DropdownButtonComponent
          name="Bulk enrollment"
          icon={<IconUserGroup16 />}
          options={enrollmentOptions}
        />
      </ButtonStrip>
      <br />

      <ButtonStrip>
        <SwitchButtonView />
      </ButtonStrip>

      <br />

      <ButtonStrip>
        <ButtonsGroup options={buttonOptionsLabels} />
        <ButtonsGroup options={buttonOptionsIcons} />
      </ButtonStrip>
    </WithPadding>
  );
}

export default ButtonsPage;
