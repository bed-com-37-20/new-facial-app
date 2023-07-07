import React from "react";
import style from "./home.module.css"
import enrollment from "../../assets/images/home/enrollment.png";
import attendance from "../../assets/images/home/attendance.png";
import calendar from "../../assets/images/home/calendar.png";
import performance from "../../assets/images/home/performance.png";
import transfer from "../../assets/images/home/transfer.png";
import result from "../../assets/images/home/result.png";
import { DashboardCard } from "../../components";

function cardsData () {
    return [
        {
            title: "Students",
            subItem: [
                {
                    icon: enrollment,
                    title: "Enrollment",
                    program: "programId",
                    value: 27,
                    formLink: "form-enrollment",
                    listLink: "list-enrollment"
                },
                {
                    icon: attendance,
                    title: "Attendance",
                    program: "programId",
                    value: 27,
                    formLink: "form-attendance",
                    listLink: "list-attendance"
                },
                {
                    icon: performance,
                    title: "Performance",
                    program: "programId",
                    value: 27,
                    formLink: "form-performance",
                    listLink: "list-performance"
                },
                {
                    icon: result,
                    title: "Final result",
                    program: "programId",
                    value: 27,
                    formLink: "form-result",
                    listLink: "list-result"
                },
                {
                    icon: transfer,
                    title: "Transfer",
                    program: "programId",
                    value: 27,
                    formLink: "form-transfer",
                    listLink: "list-transfer"
                }
            ]
        },
        {
            title: "Staff",
            subItem: [
                {
                    icon: enrollment,
                    title: "Teacher registry",
                    program: "programId",
                    value: 27,
                    formLink: "form-teacher",
                    listLink: "list-teacher"
                },
                {
                    icon: enrollment,
                    title: "Non-teacher registry",
                    program: "programId",
                    value: 27,
                    formLink: "form-non-teacher",
                    listLink: "list-non-teacher"
                },
                {
                    icon: attendance,
                    title: "Attendance",
                    program: "programId",
                    value: 27,
                    formLink: "form-staff-attendance",
                    listLink: "list-staff-attendance"
                },
                {
                    icon: transfer,
                    title: "Transfer",
                    program: "programId",
                    value: 27,
                    formLink: "form-staff-transfer",
                    listLink: "list-staff-transfer"
                }
            ]
        },
        {
            title: "Academic Year",
            subItem: [
                {
                    icon: calendar,
                    title: "School Calendar",
                    program: "programId",
                    value: 27,
                    formLink: "form-school-calendar",
                    listLink: "list-school-calendar"
                }
            ]
        }
    ]
}

function Home(): React.ReactElement {
  return (
    <div className={style.bodyContainer}>
        {cardsData().map((section, y) => (
          <div key={y}>
            <label className={style.title}>{section.title}</label>
            <div className={style.containerCards}>
              {section.subItem.map((data, i) => (
                <div key={i}>
                  <DashboardCard
                    program={data.program}
                    icon={data.icon}
                    title={data.title}
                    listLink={"/table"}
                    formLink={"#"}
                    value={data.value}
                  />
                  &nbsp;&nbsp;
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
  );
}
export default Home;
