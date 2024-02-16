import enrollment from "../../assets/images/home/enrollment.png";
import attendance from "../../assets/images/home/attendance.png";
import performance from "../../assets/images/home/performance.png";
import transfer from "../../assets/images/home/transfer.png";
import result from "../../assets/images/home/result.png";
import gauge from "../../assets/images/sidebar/gauge.svg"
import fileDocument from "../../assets/images/sidebar/file-document.svg"
import glyph from "../../assets/images/sidebar/Glyph.svg"
import listAdd from "../../assets/images/sidebar/listAdd.svg"
import logOut from "../../assets/images/sidebar/log-out.svg"
import userGroup from "../../assets/images/sidebar/user-group.svg"
import { MenuDataProps } from "../../types/menu/MenuTypes";

function menuData(currentAcademicYear: string): MenuDataProps[] {
    return [
        {
            title: "Students",
            subItem: [
                {
                    dashBoardIcon: enrollment,
                    sidebarIcon: listAdd,
                    title: "Enrollment",
                    program: "programId",
                    showBadge:false,
                    leftLabel: "Total",
                    appName: "SEMIS-Enrollment",
                    formLink: "form-enrollment",
                    route: `enrollment?sectionType=student&academicYear=${currentAcademicYear}`,
                    disabled: false
                },
                {
                    dashBoardIcon: attendance,
                    sidebarIcon: glyph,
                    title: "Attendance",
                    program: "programId",
                    showBadge:false,
                    leftLabel: "Total",
                    appName: "SEMIS-Attendance",
                    formLink: "form-attendance",
                    route: `attendance?sectionType=student&academicYear=${currentAcademicYear}`,
                    disabled: false
                },
                {
                    dashBoardIcon: performance,
                    sidebarIcon: fileDocument,
                    title: "Performance",
                    showBadge:false,
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Performance",
                    formLink: "form-performance",
                    route: `performance?sectionType=student&academicYear=${currentAcademicYear}`,
                    disabled: false
                },
                {
                    dashBoardIcon: result,
                    sidebarIcon: gauge,
                    title: "Final result",
                    showBadge:false,
                    program: "programId",
                    leftLabel: "Pending",
                    appName: "SEMIS-Final-Result",
                    formLink: "form-final-result",
                    route: "final-result?sectionType=student&academicYear=${currentAcademicYear}",
                    disabled: false
                },
                {
                    dashBoardIcon: transfer,
                    sidebarIcon: logOut,
                    title: "Transfer",
                    showBadge:false,
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Student-Transfer",
                    formLink: "form-student-transfer",
                    route: "student-transfer?sectionType=student",
                    disabled: false
                }
            ]
        },
        {
            title: "Staff",
            subItem: [
                {
                    dashBoardIcon: enrollment,
                    sidebarIcon: userGroup,
                    title: "Staff registry",
                    showBadge:false,
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Enrollment-Staff",
                    formLink: "form-enrollment-teacher",
                    route: `enrollment-teacher?sectionType=staff&academicYear=${currentAcademicYear}`,
                    disabled: false
                },
                {
                    dashBoardIcon: attendance,
                    sidebarIcon: glyph,
                    showBadge:false,
                    title: "Attendance",
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Attendance-Staff",
                    formLink: "form-staff-attendance",
                    route: `staff-attendance?sectionType=staff&academicYear=${currentAcademicYear}`,
                    disabled: false
                },
                {
                    dashBoardIcon: transfer,
                    sidebarIcon: logOut,
                    showBadge:false,
                    title: "Transfer",
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Staff-Transfer",
                    formLink: "form-staff-transfer",
                    route: `staff-transfer?sectionType=staff`,
                    disabled: false
                }
            ]
        }
    ];
}

export {menuData}