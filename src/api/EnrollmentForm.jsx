import React, { useState, useEffect } from 'react';
import { InputField, SingleSelect, SingleSelectOption, Button, Divider } from '@dhis2/ui';
import styles from './EnrollmentForm.module.css';

const EnrollmentForm = ({ school, onSubmit, editingEnrollment }) => {
    const [formData, setFormData] = useState({
        regNumber: '',
        school: school || '',
        academicYear: '',
        yearOfStudy: '',
        programOfStudy: '',
        enrollmentDate: '',
        firstName: '',
        surname: '',
        gender: '',
        dateOfBirth: '',
        nationality: '',
        guardianName: '',
        profilePicture: null,
    });

    useEffect(() => {
        if (editingEnrollment) {
            setFormData({
                ...editingEnrollment,
                enrollmentDate: editingEnrollment.enrollmentDate || '',
                dateOfBirth: editingEnrollment.dateOfBirth || '',
            });
        }
    }, [editingEnrollment]);

    const handleChange = ({ name, value }) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData(prev => ({ ...prev, profilePicture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleCancel = () => {
        setFormData({
            regNumber: '',
            school: school || '',
            academicYear: '',
            yearOfStudy: '',
            programOfStudy: '',
            enrollmentDate: '',
            firstName: '',
            surname: '',
            gender: '',
            dateOfBirth: '',
            nationality: '',
            guardianName: '',
            profilePicture: null,
        });
        onSubmit();
    };

    return (
        <div className={styles.container}>
            <h2>Student Enrollment Form</h2>
            <form onSubmit={handleSubmit}>
                <Divider />
                <h3 className={styles.formSection}>Enrollment Details</h3>

        
                <label className={styles.label}>School Name</label>

                <InputField name="school" value={formData.school} disabled />

                <label className={styles.label}>Registration Number</label>
                <InputField name="regNumber" value={formData.regNumber} onChange={handleChange} />
                <label className={styles.label}>Academic Year</label>
                <SingleSelect
                    name="academicYear"
                    selected={formData.academicYear}
                    onChange={({ selected }) => handleChange({ name: 'academicYear', value: selected })}
                    label="Academic Year"
                >
                    <SingleSelectOption value="2024-2025" label="2024-2025" />
                    <SingleSelectOption value="2025-2026" label="2025-2026" />
                </SingleSelect>

                <label className={styles.label} htmlFor="Year Of Study"> Year Of Study</label>
                <SingleSelect
                    name="yearOfStudy"
                    selected={formData.yearOfStudy}
                    onChange={({ selected }) => handleChange({ name: 'yearOfStudy', value: selected })}
                    label="Year of Study"
                >
                    {['1', '2', '3', '4', '5'].map(year => (
                        <SingleSelectOption key={year} value={year} label={year} />
                    ))}
                </SingleSelect>

                <label className={styles.label} htmlFor="Program Of Study"> Program Of Study</label>
                <SingleSelect
                    name="programOfStudy"
                    selected={formData.programOfStudy}
                    onChange={({ selected }) => handleChange({ name: 'programOfStudy', value: selected })}
                    label="Program of Study"
                >
                    <SingleSelectOption value="ComputerScience" label="Computer Science" />
                    <SingleSelectOption value="Statistics" label="Statistics" />
                    <SingleSelectOption value="PoliticalScience" label="Political Science" />
                    <SingleSelectOption value="Arts" label="Bachelor of Arts" />
                    <SingleSelectOption value="InformationSystem" label="Information System" />
                </SingleSelect>
                <label className={styles.label} htmlFor="Enrollment Date"> Enrollment Date</label>
                <InputField
                    type="date"
                    name="enrollmentDate"
                    value={formData.enrollmentDate}
                    onChange={handleChange}
                />

                <h3 className={styles.formSection}>Student Profile</h3>

                <div className={styles.imageWrapper}>
                    {formData.profilePicture ? (
                        <>
                            <img src={formData.profilePicture} alt="Profile" className={styles.profileImage} />
                            <Button small onClick={() => document.getElementById('profileInput').click()}>Change</Button>
                        </>
                    ) : (
                        <Button onClick={() => document.getElementById('profileInput').click()} className={styles.uploadBtn}>
                            Upload Profile Picture
                        </Button>
                    )}
                    <input
                        type="file"
                        id="profileInput"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>

                <InputField name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} />
                <InputField name="surname" label="Surname" value={formData.surname} onChange={handleChange} />

                <SingleSelect
                    name="gender"
                    selected={formData.gender}
                    onChange={({ selected }) => handleChange({ name: 'gender', value: selected })}
                    label="Gender"
                >
                    <SingleSelectOption value="Male" label="Male" />
                    <SingleSelectOption value="Female" label="Female" />
                    <SingleSelectOption value="Other" label="Other" />
                </SingleSelect>

                <InputField
                    type="date"
                    name="dateOfBirth"
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                />

                <InputField name="nationality" label="Nationality" value={formData.nationality} onChange={handleChange} />
                <InputField name="guardianName" label="Guardian's Name" value={formData.guardianName} onChange={handleChange} />

                <div className={styles.buttonGroup}>
                    <Button destructive onClick={handleCancel}>
                        Clear and Cancel
                    </Button>
                    <Button primary type="submit">
                        Save and Submit
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EnrollmentForm;
