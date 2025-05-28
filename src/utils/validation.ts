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

export const validateEnrollmentForm = (data: Enrollment): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.regNumber.trim()) errors.regNumber = 'Registration number is required';
    if (!data.firstName.trim()) errors.firstName = 'First name is required';
    if (!data.surname.trim()) errors.surname = 'Surname is required';
    if (!data.programOfStudy) errors.programOfStudy = 'Program of study is required';
    if (!data.yearOfStudy) errors.yearOfStudy = 'Year of study is required';
    if (!data.nationality) errors.nationality = 'Nationality is required';
    if (!data.gender) errors.gender = 'Gender is required';
    if (!data.enrollDate) errors.enrollDate = 'Enrollment date is required';

    // Validate date format if needed
    if (data.enrollDate && isNaN(Date.parse(data.enrollDate))) {
        errors.enrollDate = 'Invalid date format';
    }

    return errors;
};