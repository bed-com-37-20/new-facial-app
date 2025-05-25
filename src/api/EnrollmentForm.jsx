import React, { useState, useEffect } from 'react';
import {
    InputField,
    SingleSelect,
    SingleSelectOption,
    Button,
    Divider,
} from '@dhis2/ui';
import styles from './Enrollment.css';
// import { useFetchPrograms } from '../hooks/api-calls/apis';
import { useEnrollStudent } from '../hooks/api-calls/apis';

const EnrollmentForm = ({ school, orgUnitId, onSubmit, editingEnrollment }) => {
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
        // enrollIntoProgram: '',
    });

    // const { loading, error, programs } = useFetchPrograms();
    // const [selectedProgramId, setSelectedProgramId] = useState('');
    const { enrollStudent, loadingEnrol, errorEnrol } = useEnrollStudent()


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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData(prev => ({ ...prev, profilePicture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        enrollStudent('N6eVEDUrpYU', 'TLvAWiCKRgq', orgUnitId, formData);
        onSubmit(formData);
    };

    const handleCancel = (e) => {
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
            // profilePicture: null,
            // enrollIntoProgram: '',
        });
        // onSubmit();
    };
    if (loadingEnrol) {
        return <div>Loading...</div>;
    }
    if (errorEnrol) {
        return <div>Error loading data</div>;
    }

  

    return (
        <div className={styles.container}>
            <h2>Student Enrollment Form</h2>

            {/* {loading && <div>Loading...</div>}
            {error && <div>Error loading data</div>}
            {!loading && !error && programs.length === 0 && <div>No programs found</div>}

            {!loading && !error && programs.length > 0 && ( */}
            <form onSubmit={handleSubmit} className='enrollment-form'>
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
                    onChange={({ selected }) =>
                        handleChange({ name: 'academicYear', value: selected })
                    }
                    label="Academic Year"
                >
                    <SingleSelectOption value="2024-2025" label="2024-2025" />
                    <SingleSelectOption value="2025-2026" label="2025-2026" />
                </SingleSelect>

                <label className={styles.label} htmlFor="Year Of Study">Year Of Study</label>
                <SingleSelect
                    name="yearOfStudy"
                    selected={formData.yearOfStudy}
                    onChange={({ selected }) =>
                        handleChange({ name: 'yearOfStudy', value: selected })
                    }
                    label="Year of Study"
                >
                    {['1', '2', '3', '4', '5'].map(year => (
                        <SingleSelectOption key={year} value={year} label={year} />
                    ))}
                </SingleSelect>

                <label className={styles.label} htmlFor="Program Of Study">Program Of Study</label>
                <SingleSelect
                    name="programOfStudy"
                    selected={formData.programOfStudy}
                    onChange={({ selected }) =>
                        handleChange({ name: 'programOfStudy', value: selected })
                    }
                    label="Program of Study"
                >
                    <SingleSelectOption value="ComputerScience" label="Computer Science" />
                    <SingleSelectOption value="Statistics" label="Statistics" />
                    <SingleSelectOption value="PoliticalScience" label="Political Science" />
                    <SingleSelectOption value="Arts" label="Bachelor of Arts" />
                    <SingleSelectOption value="InformationSystem" label="Information System" />
                </SingleSelect>

                {/* <label className={styles.label} htmlFor="Enroll Into">Enroll Into</label>
                    <SingleSelect
                        name="enrollIntoProgram"
                        selected={formData.enrollIntoProgram}
                        onChange={({ selected }) => setSelectedProgramId(selected)}
                        label="Enroll Into"
                    >
                        {programs.map(program => (
                            <SingleSelectOption
                                key={program.id}
                                value={program.id}
                                label={program.displayName}
                            />
                        ))}
                    </SingleSelect> */}

                <label className={styles.label} htmlFor="Enrollment Date">Enrollment Date</label>
                <InputField
                    type="date"
                    name="enrollmentDate"
                    value={formData.enrollmentDate}
                    onChange={handleChange}
                />
                <Divider />
                <h3 className="formSection">Student Profile</h3>

                <div className="imageWrapper">
                    {formData.profilePicture ? (
                        <>
                            <img src={formData.profilePicture} alt="Profile" className="profileImage" />
                            <Button small onClick={() => document.getElementById('profileInput').click()}>Change</Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => document.getElementById('profileInput').click()}
                            className={styles.uploadBtn}
                        >
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
                <label htmlFor="sirName">First Name</label>
                <InputField name="firstName" value={formData.firstName} onChange={handleChange} />
                <label htmlFor="sirName">Last Name</label>
                <InputField name="surname" value={formData.surname} onChange={handleChange} />
                <label htmlFor="gender"> Gender</label>
                <SingleSelect
                    name="gender"
                    selected={formData.gender}
                    onChange={({ selected }) => handleChange({ name: 'gender', value: selected })}
                    label="Gender"
                >
                    <SingleSelectOption value="male" label="Male" />
                    <SingleSelectOption value="female" label="Female" />
                    <SingleSelectOption value="other" label="Other" />
                </SingleSelect>
                <label htmlFor="sirName">Date Of Birth</label>
                <InputField
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                />
                <label htmlFor="sirName">Nationality</label>
                <InputField
                    name="nationality"

                    value={formData.nationality}
                    onChange={handleChange}
                />
                <label htmlFor="sirName">Guardian's Name</label>
                <InputField
                    name="guardianName"

                    value={formData.guardianName}
                    onChange={handleChange}
                />
                <Divider />

                <div className="buttonGroup">
                    <Button className="buttons" destructive onClick={handleCancel}>
                        Clear and Cancel
                    </Button>
                    <Button className="buttons" primary type="submit">
                        Save and Submit
                    </Button>
                </div>
            </form>

        </div>
    );
};

export default EnrollmentForm;
