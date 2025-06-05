import React from "react";
import { DashboardCard, Title, WithPadding } from "../../components";
// import { menuData } from "../../utils/index"
// import { MenuDataItemProps, MenuDataProps } from "../../types/menu/MenuTypes";
// import { getDataStoreKeys } from "../../utils/common/dataStore/getDataStoreKeys";
// import { useMenuData } from "../../hooks/menu/useMenuData";
// // import DashboardCard from "../../components/card"
import enrollmentIcon from "../../assets/images/home/enrollment.png";
import examIcon from "../../assets/images/home/transfer.png";
import attendancIcon from "../../assets/images/home/enrollment.png";
import reportIcon from "../../assets/images/home/result.png";
import { Divider } from "@material-ui/core";
function Home() {
  // const { menuData } = useMenuData();

  const appCards = [{
    title: "Enrollment",
    formLink: "/api/enrollment/enrollments",
    icon: enrollmentIcon,
    appName: "enrollments"
  }, {
    title: "Exams Information",
    formLink: "/api/examPage/newExam",
    icon: examIcon,
    appName: "new-exam"
  }, {
    title: "Attendance",
    formLink: "/api/attendance",
    icon: attendancIcon,
    appName: "attendance"
  }, {
    title: "Reports",
    formLink: "/api/reports/report",
    icon: reportIcon,
    appName: "reports"
  }];
  return /*#__PURE__*/React.createElement(WithPadding, {
    padding: "10px 30px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement(Title, {
    label: "Welcome to the Facial Attendance System"
  }), /*#__PURE__*/React.createElement("p", null, "This application is designed to streamline the process of tracking student attendance during exams. By utilizing facial recognition technology, it ensures accurate and efficient attendance marking, identifying students and recording their presence automatically.")), /*#__PURE__*/React.createElement(Divider, {
    style: {
      margin: "20px 0"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "50px",
      margin: "5px",
      flexWrap: "wrap"
    }
  }, appCards.map((card, index) => /*#__PURE__*/React.createElement(DashboardCard, {
    key: index,
    title: card.title,
    formLink: card.formLink,
    icon: card.icon,
    appName: card.appName
  }))));
}
export default Home;