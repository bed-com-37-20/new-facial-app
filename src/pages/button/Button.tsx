import React, { useState } from "react";
import {
  Buttons,
  ButtonsGroup,
  SimpleDropdownButton,
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
import { type SimpleButtonsProps } from "../../types/Buttons/SimpleButtonsProps";

const items: SimpleButtonsProps[] = [
  { id: "item1", label: "Item 1" },
  { id: "item2", label: "Item 2" },
  { id: "item3", label: "Item 3" }
];

function ButtonsPage(): React.ReactElement {
  const [selectedTerm, setSelectedTerm] = useState<SimpleButtonsProps>();
  return (
    <div>
      <WithPadding p="15px">
        <Title label="Default buttons" />
        <Buttons />
      </WithPadding>
      <hr />

      <WithPadding p="15px">
        <Title label="Dropdown button" />
        <ButtonStrip>
          <SimpleDropdownButton items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />
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
