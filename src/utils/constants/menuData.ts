import enrollment from "../../../assets/images/home/enrollment.png";
import attendance from "../../../assets/images/home/attendance.png";
import performance from "../../../assets/images/home/performance.png";
import transfer from "../../../assets/images/home/transfer.png";
import result from "../../../assets/images/home/result.png";
import gauge from "../../../assets/images/sidebar/gauge.svg"
import fileDocument from "../../../assets/images/sidebar/file-document.svg"
import glyph from "../../../assets/images/sidebar/Glyph.svg"
import listAdd from "../../../assets/images/sidebar/listAdd.svg"
import logOut from "../../../assets/images/sidebar/log-out.svg"
import userGroup from "../../../assets/images/sidebar/user-group.svg"

function data() {
    return [
        {
            title: "Students",
            subItem: [
                {
                    dashBoardIcon: enrollment,
                    sidebarIcon: listAdd,
                    title: "Enrollment",
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Enrollment",
                    formLink: "form-enrollment",
                    listLink: `enrollment?sectionType=student&academicYear=2023`,
                    disabled: false
                },
                {
                    dashBoardIcon: attendance,
                    sidebarIcon: glyph,
                    title: "Attendance",
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Attendance",
                    formLink: "form-attendance",
                    listLink: "attendance?sectionType=student&academicYear=2023",
                    disabled: false
                },
                {
                    dashBoardIcon: performance,
                    sidebarIcon: fileDocument,
                    title: "Performance",
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Performance",
                    formLink: "form-performance",
                    listLink: "performance?sectionType=student&academicYear=2023",
                    disabled: false
                },
                {
                    dashBoardIcon: result,
                    sidebarIcon: gauge,
                    title: "Final result",
                    program: "programId",
                    leftLabel: "Pending",
                    appName: "SEMIS-Final-Result",
                    formLink: "form-final-result",
                    listLink: "final-result?sectionType=student",
                    disabled: false
                },
                {
                    dashBoardIcon: transfer,
                    sidebarIcon: logOut,
                    title: "Transfer",
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Student-Transfer",
                    formLink: "form-student-transfer",
                    listLink: "student-transfer?sectionType=student",
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
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Enrollment-Staff",
                    formLink: "form-enrollment-teacher",
                    listLink: "enrollment-teacher?sectionType=staff&academicYear=2023",
                    disabled: false
                },
                {
                    dashBoardIcon: attendance,
                    sidebarIcon: glyph,
                    title: "Attendance",
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Attendance-Staff",
                    formLink: "form-staff-attendance",
                    listLink: "staff-attendance?sectionType=staff&academicYear=2023",
                    disabled: false
                },
                {
                    dashBoardIcon: transfer,
                    sidebarIcon: logOut,
                    title: "Transfer",
                    program: "programId",
                    leftLabel: "Total",
                    appName: "SEMIS-Staff-Transfer",
                    formLink: "form-staff-transfer",
                    listLink: "staff-transfer?sectionType=staff&academicYear=2023",
                    disabled: false
                }
            ]
        }
    ];
}