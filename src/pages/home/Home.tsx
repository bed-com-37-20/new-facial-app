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
import { Divider } from "@material-ui/core";


function Home(): React.ReactElement {
  // const { menuData } = useMenuData();

  const appCards = [
    {
      title: "Enrollment",
      formLink: "/api/enrollment/enrollments",
      icon:    enrollmentIcon,
      appName: "enrollments",
    },
    {
      title: "Exams Information",
      formLink: "/api/examPage/newExam",
      icon: examIcon,
      appName: "new-exam",
    },
    {
      title: "Exam Check",
      formLink: "/api/attendance/attendance",
      icon: attendancIcon,
      appName: "attendance",
    },
    {
      title: "Reports",
      formLink: "/api/reports/report",
      icon: reportIcon,
      appName: "reports",
    },
  ];

  return (
    <WithPadding padding="10px 30px">
      <div style={{ marginBottom: "20px" }}>
        <Title label="Welcome to the Facial Attendance System" />
        <p>
          This application is designed to streamline the process of tracking student attendance during exams. 
          By utilizing facial recognition technology, it ensures accurate and efficient attendance marking, 
          identifying students and recording their presence automatically.
        </p>
      </div>

      <Divider style={{ margin: "20px 0" }} />  
     
    
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

