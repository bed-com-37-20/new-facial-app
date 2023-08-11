import enrollment from "../../../assets/images/home/enrollment.png";
import attendance from "../../../assets/images/home/attendance.png";
import calendar from "../../../assets/images/home/calendar.png";
import performance from "../../../assets/images/home/performance.png";
import transfer from "../../../assets/images/home/transfer.png";
import result from "../../../assets/images/home/result.png";
import { type DashboardCardProps } from "../../../types/dashboard/CardTypes";

function cardsData(): DashboardCardProps[] {
  return [
    {
      title: "Students",
      subItem: [
        {
          icon: enrollment,
          title: "Enrollment",
          program: "programId",
          leftLabel: "Total",
          appName: "SEMIS-Enrollment",
          formLink: "form-enrollment",
          listLink: `enrollment?sectionType=student`,
          disabled: false
        },
        {
          icon: attendance,
          title: "Attendance",
          program: "programId",
          leftLabel: "Total",
          appName: "DHIS2-App",
          formLink: "form-attendance",
          listLink: "/attendance",
          disabled: true
        },
        {
          icon: performance,
          title: "Performance",
          program: "programId",
          leftLabel: "Total",
          appName: "DHIS2-App",
          formLink: "form-performance",
          listLink: "/performance",
          disabled: true
        },
        {
          icon: result,
          title: "Final result",
          program: "programId",
          leftLabel: "Pending",
          appName: "DHIS2-App",
          formLink: "form-result",
          listLink: "/result",
          disabled: true
        },
        {
          icon: transfer,
          title: "Transfer",
          program: "programId",
          leftLabel: "Total",
          appName: "DHIS2-App",
          formLink: "form-transfer",
          listLink: "/transfer",
          disabled: true
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
          leftLabel: "Total",
          appName: "DHIS2-App",
          formLink: "form-teacher",
          listLink: "/teacher",
          disabled: true
        },
        {
          icon: enrollment,
          title: "Non-teacher registry",
          program: "programId",
          leftLabel: "Total",
          appName: "DHIS2-App",
          formLink: "form-non-teacher",
          listLink: "/non-teacher",
          disabled: true
        },
        {
          icon: attendance,
          title: "Attendance",
          program: "programId",
          leftLabel: "Total",
          appName: "DHIS2-App",
          formLink: "form-staff-attendance",
          listLink: "/staff-attendance",
          disabled: true
        },
        {
          icon: transfer,
          title: "Transfer",
          program: "programId",
          leftLabel: "Total",
          appName: "DHIS2-App",
          formLink: "form-staff-transfer",
          listLink: "/staff-transfer",
          disabled: true
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
          leftLabel: "School days",
          appName: "DHIS2-App",
          formLink: "form-school-calendar",
          listLink: "/school-calendar",
          disabled: true
        }
      ]
    }
  ];
}

export { cardsData };
