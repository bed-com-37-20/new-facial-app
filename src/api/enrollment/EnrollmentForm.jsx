
import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam'; // Import the Webcam library
import {
    InputField,
    SingleSelect,
    SingleSelectOption,
    Button,
    Divider,
} from '@dhis2/ui';
import styles from './EnrollmentForm.css';
import { useEnrollStudent } from '../hooks/api-calls/apis';
import { useNavigate } from 'react-router-dom';

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
    });
    const [isCameraOpen, setIsCameraOpen] = useState(false); // State to toggle the camera
    const navigate = useNavigate();
    const { enrollStudent, loadingEnrol, errorEnrol } = useEnrollStudent();

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

    const handleCapture = (imageSrc) => {
        setFormData(prev => ({ ...prev, profilePicture: imageSrc }));
        setIsCameraOpen(false); // Close the camera after capturing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
const url = 'https://facial-attendance-system-6vy8.onrender.com/api/face/detect'
        try {

            const faceSent = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ file: formData.profilePicture, registrationNumber: formData.regNumber }),
            });
            if (!faceSent.status) {
                alert(faceSent.status)
                return
            }
                const enrollmentPromise = enrollStudent('N6eVEDUrpYU', 'TLvAWiCKRgq', orgUnitId, formData);
            alert('Student successfully enrolled')
            // Show progress bar while enrollment is in progress
            const progressBar = document.createElement('div');
            progressBar.style.position = 'fixed';
            progressBar.style.top = '0';
            progressBar.style.left = '0';
            progressBar.style.width = '0';
            progressBar.style.height = '5px';
            progressBar.style.backgroundColor = '#4caf50';
            progressBar.style.transition = 'width 0.5s ease';
            document.body.appendChild(progressBar);

            const interval = setInterval(() => {
                progressBar.style.width = `${Math.min(parseInt(progressBar.style.width) + 10, 100)}%`;
            }, 500);

            await enrollmentPromise;

            clearInterval(interval);
            progressBar.style.width = '100%';

            setTimeout(() => {
                document.body.removeChild(progressBar);
            }, 500);

            // Navigate to the enrollments page on success
            navigate('/api/enrollments');
            onSubmit(formData); // Notify parent component
        } catch (error) {
            
            alert('Error enrolling student: ' + error.message);
        }
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
        });
        onSubmit(formData);
    };

    if (loadingEnrol) {
        return <div>Loading...</div>;
    }
    if (errorEnrol) {
        return <div>Error loading data</div>;
    }

    return (
        <div className='main'>
            <h2 className='formTitle'>Student Enrollment Form</h2>

            <form onSubmit={handleSubmit} className='enrollmentForm'>
                <Divider className='divider' />
                <h3 className={styles.formSection}>Enrollment Details</h3>

                <label className={styles.label}>School Name</label>
                <InputField className='inputField' name="school" value={formData.school} disabled />

                <label className={styles.label}>Registration Number</label>
                <InputField className='inputField' name="regNumber" value={formData.regNumber} onChange={handleChange} />

                <label className={styles.label}>Academic Year</label>
                <SingleSelect
                    className='selectField'
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
                    className='selectField'
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
                    className='selectField'
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

                <label className={styles.label} htmlFor="Enrollment Date">Enrollment Date</label>
                <InputField
                    className='inputField'
                    type="date"
                    name="enrollmentDate"
                    value={formData.enrollmentDate}
                    onChange={handleChange}
                />
                <Divider className='divider' />
                <h3 className="formSection">Student Profile</h3>

                <div className="imageWrapper">
                    {formData.profilePicture ? (
                        <>
                            <img src={formData.profilePicture} alt="Profile" className="profileImage" />
                            <Button small className='changeButton' onClick={() => document.getElementById('profileInput').click()}>Change</Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className='uploadButton'
                                onClick={() => document.getElementById('profileInput').click()}
                            >
                                Upload Profile Picture
                            </Button>
                            <Button
                                className='cameraButton'
                                onClick={() => setIsCameraOpen(true)}
                            >
                                Capture with Camera
                            </Button>
                        </>
                    )}
                    <input
                        type="file"
                        id="profileInput"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>

                {isCameraOpen && (
                    <div className="cameraWrapper">
                        <Webcam
                            audio={false}
                            screenshotFormat="image/jpeg"
                            className="webcam"
                        >
                            {({ getScreenshot }) => (
                                <>
                                    <Button
                                        className="captureButton"
                                        onClick={() => handleCapture(getScreenshot())}
                                    >
                                        Capture
                                    </Button>
                                    <Button
                                        className="closeCameraButton"
                                        onClick={() => setIsCameraOpen(false)}
                                    >
                                        Close Camera
                                    </Button>
                                </>
                            )}
                        </Webcam>
                    </div>
                )}

                <label className={styles.label} htmlFor="sirName">First Name</label>
                <InputField className='inputField' name="firstName" value={formData.firstName} onChange={handleChange} />
                <label className={styles.label} htmlFor="sirName">Last Name</label>
                <InputField className='inputField' name="surname" value={formData.surname} onChange={handleChange} />
                <label className={styles.label} htmlFor="gender"> Gender</label>
                <SingleSelect
                    className='selectField'
                    name="gender"
                    selected={formData.gender}
                    onChange={({ selected }) => handleChange({ name: 'gender', value: selected })}
                    label="Gender"
                >
                    <SingleSelectOption value="male" label="Male" />
                    <SingleSelectOption value="female" label="Female" />
                    <SingleSelectOption value="other" label="Other" />
                </SingleSelect>
                <label className={styles.label} htmlFor="sirName">Date Of Birth</label>
                <InputField
                    className='inputField'
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                />
                <label className={styles.label} htmlFor="sirName">Nationality</label>
                <InputField
                    className='inputField'
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                />
                <label className={styles.label} htmlFor="sirName">Guardian's Name</label>
                <InputField
                    className='inputField'
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                />
                <Divider className='divider' />

                <div className="buttonGroup">
                    <Button className="clearButton" destructive onClick={handleCancel}>
                        Clear and Cancel
                    </Button>
                    <Button className="submitButton" primary type="submit">
                        Save and Submit
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EnrollmentForm;
