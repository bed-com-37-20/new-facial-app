import enrollment from "../../assets/images/home/enrollment.png";
import attendance from "../../assets/images/home/attendance.png";
import performance from "../../assets/images/home/performance.png";
import transfer from "../../assets/images/home/transfer.png";
import result from "../../assets/images/home/result.png";
import gauge from "../../assets/images/sidebar/gauge.svg"
import home from "../../assets/images/sidebar/home.svg"
import fileDocument from "../../assets/images/sidebar/file-document.svg"
import glyph from "../../assets/images/sidebar/Glyph.svg"
import listAdd from "../../assets/images/sidebar/listAdd.svg"
import logOut from "../../assets/images/sidebar/log-out.svg"
import userGroup from "../../assets/images/sidebar/user-group.svg"
import { MenuDataProps } from "../../types/menu/MenuTypes";

function menuData(currentAcademicYear: string): MenuDataProps[] {
    return [
        {
            title: "Navigations",
            displayInMenu: true,
            displayInDashboard: false,
            subItem: [
                {
                    dashBoardIcon: home,
                    displayInMenu: true,
                    sidebarIcon: home,
                    title: "Home",
                    showBadge:false,
                    program: "programId",
                    leftLabel: "Total",
                    appName: "",
                    formLink: "home",
                    route: "/" ,//`home`,
                    disabled: false
                }
            ]
        },
        {
            title: "Students",
            displayInMenu: true,
            displayInDashboard: false,
            subItem: [
                {
                    dashBoardIcon: enrollment,
                    displayInMenu: true,
                    sidebarIcon: listAdd,
                    title: "Enrollment",
                    program: "programId",
                    showBadge:false,
                    leftLabel: "Total",
                    appName: "",
                    formLink: "form-enrollment",
                    route: "api/enrollments",//"form-enrollment", //`enrollment?sectionType=student&academicYear=${currentAcademicYear}`,
                    disabled: false
                },
                {
                    dashBoardIcon: attendance,
                    displayInMenu: true,
                    sidebarIcon: glyph,
                    title: "Attendance",
                    program: "programId",
                    showBadge:false,
                    leftLabel: "Total",
                    appName: "",
                    formLink: "form-attendance",
                    route: "api/filestore", //`attendance?sectionType=student&academicYear=${currentAcademicYear}`,
                    disabled: false
                },
                {
                    dashBoardIcon: performance,
                    displayInMenu: true,
                    sidebarIcon: fileDocument,
                    title: "Exams Info",
                    showBadge:false,
                    program: "programId",
                    leftLabel: "Total",
                    appName: "",
                    formLink: "form-performance",
                    route: `api/examPage/newExam`,
                    disabled: false
                },
                {
                    dashBoardIcon: result,
                    displayInMenu: true,
                    sidebarIcon: gauge,
                    title: "Reports",
                    showBadge:false,
                    program: "programId",
                    leftLabel: "Pending",
                    appName: "",
                    formLink: "form-final-result",
                    route: "api/reports/report",//`final-result?sectionType=student&academicYear=${currentAcademicYear}`,
                    disabled: false
                },
                // {
                //     dashBoardIcon: transfer,
                //     displayInMenu: true,
                //     sidebarIcon: logOut,
                //     title: "Transfer",
                //     showBadge:false,
                //     program: "programId",
                //     leftLabel: "Total",
                //     appName: "SEMIS-Transfer",
                //     formLink: "form-student-transfer",
                //     route: "transfer?sectionType=student",
                //     disabled: false
                // }
            ]
        },
        {
            title: "Staff",
            displayInMenu: true,
            displayInDashboard: true,
            subItem: [
                {
                    dashBoardIcon: enrollment,
                    displayInMenu: true,
                    sidebarIcon: userGroup,
                    title: "Staff registry",
                    showBadge:false,
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Enrollment",
                    formLink: "form-enrollment-teacher",
                    route: `enrollment?sectionType=staff&academicYear=${currentAcademicYear}`,
                    disabled: false
                },
                {
                    dashBoardIcon: attendance,
                    displayInMenu: true,
                    sidebarIcon: glyph,
                    showBadge:false,
                    title: "Attendance",
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Attendance",
                    formLink: "form-staff-attendance",
                    route: `attendance?sectionType=staff&academicYear=${currentAcademicYear}`,
                    disabled: false
                },
                {
                    dashBoardIcon: transfer,
                    displayInMenu: true,
                    sidebarIcon: logOut,
                    showBadge:false,
                    title: "Transfer",
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Transfer",
                    formLink: "form-staff-transfer",
                    route: `transfer?sectionType=staff`,
                    disabled: false
                },
                {
                    dashBoardIcon: result,
                    displayInMenu: true,
                    sidebarIcon: gauge,
                    showBadge:false,
                    title: "Re-enroll",
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Staff-Re-enroll",
                    formLink: "form-staff-reenroll",
                    route: `final-result?sectionType=staff`,
                    disabled: false
                }
            ]
        }
    ];
}

export {menuData}