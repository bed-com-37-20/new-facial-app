import React from "react";
import { TagAlert, WithPadding } from "../../components";
import { ButtonStrip, IconCheckmarkCircle16, IconCross16, IconInfo16 } from "@dhis2/ui";

function TagAlerts(): React.ReactElement {
  return (
    <WithPadding>
      <ButtonStrip>
        <TagAlert text="Data imported successfuly!"/>
        <TagAlert neutral icon={<IconCheckmarkCircle16/>} text="Data imported successfuly!"/>
        <TagAlert positive icon={<IconInfo16/>} text="Data imported successfuly!"/>
        <TagAlert negative icon={<IconCross16/>} text="Data imported successfuly!"/>
        <TagAlert bold text="Data imported successfuly!"/>
      </ButtonStrip>
    </WithPadding>
  );
}
export default TagAlerts;
