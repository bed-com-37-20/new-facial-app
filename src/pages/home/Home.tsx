import React from "react";
import style from "./Home.module.css";
import { Badge, DashboardCard, Title, WithPadding } from "../../components";
// import { menuData } from "../../utils/index"
// import { MenuDataItemProps, MenuDataProps } from "../../types/menu/MenuTypes";
// import { getDataStoreKeys } from "../../utils/common/dataStore/getDataStoreKeys";
// import { useMenuData } from "../../hooks/menu/useMenuData";
// // import DashboardCard from "../../components/card"
import enrollmentIcon from "../../assets/images/home/enrollment.png" 
import examIcon from "../../assets/images/home/transfer.png" 
import attendancIcon from "../../assets/images/home/enrollment.png" 
import reportIcon from "../../assets/images/home/result.png" 


function Home(): React.ReactElement {
  // const { menuData } = useMenuData();

  const appCards = [
    {
      title: "Enrollment",
      formLink: "/api/enrollments",
      icon:    enrollmentIcon,
      appName: "enrollments",
    },
    {
      title: "New Exam",
      formLink: "/new-exam",
      icon: examIcon,
      appName: "new-exam",
    },
    {
      title: "Attendance",
      formLink: "/attendance",
      icon: attendancIcon,
      appName: "attendance",
    },
    {
      title: "Reports",
      formLink: "/enrollments",
      icon: reportIcon,
      appName: "reports",
    },
  ];

  return (
    <WithPadding padding="10px 30px">
      <div style={{ display: "flex", gap: "50px", margin: "5px", flexWrap: "wrap" }}>
        {appCards.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            formLink={card.formLink}
            icon={card.icon}
            appName={card.appName}
          />
        ))}
      </div>
  
    </WithPadding>
  );
}
export default Home;

     {/* {menuData?.filter(item => item.displayInDashboard && item.displayInMenu).map((section: MenuDataProps, y) => (
        <div key={y} className={style.section}>
          <Title label={section.title} />
       
          <div className={style.containerCards}>
            {section.subItem?.filter((data: MenuDataItemProps) => data.displayInMenu).map((data: MenuDataItemProps, i: number) => (
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
      ))} */}