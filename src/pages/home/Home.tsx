import React from "react";
import style from "./home.module.css";
import { DashboardCard, Title, WithPadding } from "../../components";
import { cardsData } from "../../utils/constants/dashboard/dashboardData";

function Home(): React.ReactElement {
  return (
    <WithPadding p="10px 30px">
      {cardsData().map((section, y) => (
        <div key={y} className={style.section}>
          <Title label={section.title}/>
          <div className={style.containerCards}>
            {section.subItem.map((data: any, i: number) => (
              <div key={i}>
                <DashboardCard
                  program={data.program}
                  icon={data.icon}
                  title={data.title}
                  listLink={data.listLink}
                  formLink={"#"}
                  leftLabel={data.leftLabel}
                  value={"30"}
                  disabled={data.disabled}
                />
                &nbsp;&nbsp;
              </div>
            ))}
          </div>
        </div>
      ))}
    </WithPadding>
  );
}
export default Home;
