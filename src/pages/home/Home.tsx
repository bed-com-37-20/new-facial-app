import React from "react";
import style from "./Home.module.css";
import { DashboardCard, Title, WithPadding } from "../../components";
import {menuData} from "../../utils/index"
import { MenuDataItemProps, MenuDataProps } from "../../types/menu/MenuTypes";
import { getDataStoreKeys } from "../../utils/common/dataStore/getDataStoreKeys";

function Home(): React.ReactElement {
    const { currentAcademicYear } = getDataStoreKeys()
    
    return (
    <WithPadding padding="10px 30px">
      {menuData(currentAcademicYear).map((section:MenuDataProps, y) => (
        <div key={y} className={style.section}>
          <Title label={section.title}/>
          <div className={style.containerCards}>
            {section.subItem.map((data: MenuDataItemProps, i: number) => (
              <div key={i}>
                <DashboardCard
                  program={data.program}
                  icon={data.dashBoardIcon}
                  title={data.title}
                  listLink={data.route}
                  formLink={"#"}
                  leftLabel={data.leftLabel}
                  value={"30"}
                  disabled={data.disabled}
                  appName={data.appName}
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
