import React from "react";
import enrollment from "../../assets/images/file.png";
import { DashboardCard } from "../../components";

function DashboardCards(): React.ReactElement {
  return (
    <>
      <DashboardCard
        icon={enrollment}
        title="Enrollment"
        value={27}
        program="jdhdjhdhs"
        addLink="#"
        listLink="#"
      />
    </>
  );
}
export default DashboardCards;
