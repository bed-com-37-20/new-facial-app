import React from "react";
import enrollment from "../../assets/images/home/enrollment.png";
import {
  DashboardCard,
  SummaryCard,
  Title,
  WithPadding
} from "../../components";

function Cards(): React.ReactElement {
  return (
    <div>
      <WithPadding p="30px 15px">
        <Title label="Dashboard Cards" />
        <DashboardCard
          icon={enrollment}
          title="Enrollment"
          value="27"
          leftLabel="Total"
          program="programId"
          formLink="#"
          listLink="#"
        />
      </WithPadding>
      <hr />

      <WithPadding p="30px 15px">
        <Title label="Summary Cards" />
        <div className="d-flex">
          <SummaryCard value="2" label="Imported" color="success" />
          <SummaryCard value="1" label="Error" color="error" />
          <SummaryCard value="0" label="Ignored" color="secondary" />
        </div>
      </WithPadding>
    </div>
  );
}
export default Cards;
