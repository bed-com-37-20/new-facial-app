import React from "react";
import enrollment from "../../assets/images/home/enrollment.png";
import { DashboardCard, SummaryCard, TagAlert, WithPadding } from "../../components";
import { ButtonStrip, IconCheckmarkCircle16, IconCross16, IconInfo16 } from "@dhis2/ui";

function Cards(): React.ReactElement {
  return (
    <WithPadding>
      <DashboardCard
        icon={enrollment}
        title="Enrollment"
        value="27"
        leftLabel="Total"
        program="programId"
        formLink="#"
        listLink="#"
      />
      <br />
      <div className="d-flex">
        <SummaryCard value="2" label="Imported" color="success" />
        <SummaryCard value="1" label="Error" color="error" />
        <SummaryCard value="0" label="Ignored" color="secondary" />
      </div>

      <br />
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
export default Cards;
