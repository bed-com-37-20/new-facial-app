import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import { Enrollment } from '../interfaces/enrollment';

interface Enrollment {
    regNumber: string;
    firstName: string;
    surname: string;
    school: string;
    programOfStudy: string;
    yearOfStudy: string;
    nationality: string;
    gender: string;
    dateOfBirth: string;
    enrollDate: string;
    academicYear: string;
    guardian: string;
    profilePicture?: string;
}
export const generatePDF = (enrollments: Enrollment[], schoolName: string) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(`Student Enrollments - ${schoolName}`, 14, 20);

    // Table data
    const tableData = enrollments.map(enrollment => [
        enrollment.regNumber,
        enrollment.firstName,
        enrollment.surname,
        enrollment.programOfStudy,
        enrollment.yearOfStudy,
        enrollment.nationality,
        enrollment.gender,
        new Date(enrollment.enrollDate).toLocaleDateString()
    ]);

    // Generate table
    (doc as any).autoTable({
        head: [['Reg Number', 'First Name', 'Surname', 'Program', 'Year', 'Nationality', 'Gender', 'Enroll Date']],
        body: tableData,
        startY: 30,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save(`enrollments_${schoolName}_${new Date().toISOString().slice(0, 10)}.pdf`);
};