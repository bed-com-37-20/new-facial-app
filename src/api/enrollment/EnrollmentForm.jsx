import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import {
    InputField,
    SingleSelect,
    SingleSelectOption,
    Button,
    Divider,
    CircularLoader,
    NoticeBox,
} from '@dhis2/ui';
import styles from './EnrollmentForm.css';
import { useEnrollStudent } from '../hooks/api-calls/apis';
import { useNavigate } from 'react-router-dom';

const EnrollmentForm = ({ school, orgUnitId, onSubmit, editingEnrollment, onCancel }) => {
    // Form state
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

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Hooks
    const navigate = useNavigate();
    const { enrollStudent, loadingEnrol, errorEnrol } = useEnrollStudent();

    // Initialize form if editing
    useEffect(() => {
        if (editingEnrollment) {
            setFormData({
                ...editingEnrollment,
                enrollmentDate: editingEnrollment.enrollmentDate || '',
                dateOfBirth: editingEnrollment.dateOfBirth || '',
            });
        }
    }, [editingEnrollment]);

    // Handlers
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
        setIsCameraOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        setIsSubmitting(true);

        try {
            // Validate required fields
            if (!formData.regNumber || !formData.profilePicture) {
                throw new Error('Registration number and profile picture are required');
            }

            // Send face data to facial recognition system
            const faceResponse = await fetch('https://facial-attendance-system-6vy8.onrender.com/face/detect',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        file: formData.profilePicture,
                        registrationNumber: formData.regNumber
                    }),
                }
            );

            if (!faceResponse.status ) {
                alert('Failed to register face data with recognition system');
                onCancel()
            }

            // Enroll student in DHIS2
            await enrollStudent(
                'N6eVEDUrpYU',  // trackedEntityType
                'TLvAWiCKRgq',  // programId
                orgUnitId,
                formData
            );

            // Success - notify parent and navigate
            onSubmit?.(formData);
            navigate('/api/enrollments');
        } catch (error) {
            setSubmitError(error.message);
            alert('Enrollment error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } 
        onCancel()
            // Default cancel behavior
     navigate('/api/enrollments');
        
    };

    // Loading and error states
    if (loadingEnrol) {
        return (
            <div className="loader-container">
                <CircularLoader />
                <p>Loading enrollment data...</p>
            </div>
        );
    }

    if (errorEnrol) {
        return (
            <div className="error-container">
                <NoticeBox error title="Loading Error">
                    {errorEnrol.message}
                </NoticeBox>
                <Button onClick={handleCancel}>Back to Enrollments</Button>
            </div>
        );
    }

    return (
        <div className='main'>
            <h2 className='formTitle'>
                {editingEnrollment ? 'Edit Student Enrollment' : 'New Student Enrollment'}
            </h2>

            {submitError && (
                <NoticeBox error title="Submission Error" className="error-notice">
                    {submitError}
                </NoticeBox>
            )}

            <form onSubmit={handleSubmit} className='enrollmentForm'>
                <Divider className='divider' />
                <h3 className={styles.formSection}>Enrollment Details</h3>

                <label className={styles.label}>School Name</label>
                <InputField
                    className='inputField'
                    name="school"
                    value={formData.school}
                    disabled
                    required
                />

                <label className={styles.label}>Registration Number*</label>
                <InputField
                    className='inputField'
                    name="regNumber"
                    value={formData.regNumber}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                />

                <label className={styles.label}>Academic Year*</label>
                <SingleSelect
                    className='selectField'
                    name="academicYear"
                    selected={formData.academicYear}
                    onChange={({ selected }) =>
                        handleChange({ name: 'academicYear', value: selected })
                    }
                    label="Academic Year"
                    required
                    disabled={isSubmitting}
                >
                    <SingleSelectOption value="2024-2025" label="2024-2025" />
                    <SingleSelectOption value="2025-2026" label="2025-2026" />
                </SingleSelect>

                <label className={styles.label}>Year Of Study*</label>
                <SingleSelect
                    className='selectField'
                    name="yearOfStudy"
                    selected={formData.yearOfStudy}
                    onChange={({ selected }) =>
                        handleChange({ name: 'yearOfStudy', value: selected })
                    }
                    label="Year of Study"
                    required
                    disabled={isSubmitting}
                >
                    {['1', '2', '3', '4', '5'].map(year => (
                        <SingleSelectOption key={year} value={year} label={year} />
                    ))}
                </SingleSelect>

                <label className={styles.label}>Program Of Study*</label>
                <SingleSelect
                    className='selectField'
                    name="programOfStudy"
                    selected={formData.programOfStudy}
                    onChange={({ selected }) =>
                        handleChange({ name: 'programOfStudy', value: selected })
                    }
                    label="Program of Study"
                    required
                    disabled={isSubmitting}
                >
                    <SingleSelectOption value="ComputerScience" label="Computer Science" />
                    <SingleSelectOption value="Statistics" label="Statistics" />
                    <SingleSelectOption value="PoliticalScience" label="Political Science" />
                    <SingleSelectOption value="Arts" label="Bachelor of Arts" />
                    <SingleSelectOption value="InformationSystem" label="Information System" />
                </SingleSelect>

                <label className={styles.label}>Enrollment Date*</label>
                <InputField
                    className='inputField'
                    type="date"
                    name="enrollmentDate"
                    value={formData.enrollmentDate}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                />

                <Divider className='divider' />
                <h3 className="formSection">Student Profile</h3>

                <div className="imageWrapper">
                    {formData.profilePicture ? (
                        <>
                            <img
                                src={formData.profilePicture}
                                alt="Profile"
                                className="profileImage"
                            />
                            <Button
                                small
                                className='changeButton'
                                onClick={() => document.getElementById('profileInput').click()}
                                disabled={isSubmitting}
                            >
                                Change
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className='uploadButton'
                                onClick={() => document.getElementById('profileInput').click()}
                                disabled={isSubmitting}
                            >
                                Upload Profile Picture
                            </Button>
                            <Button
                                className='cameraButton'
                                onClick={() => setIsCameraOpen(true)}
                                disabled={isSubmitting}
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
                        disabled={isSubmitting}
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

                <label className={styles.label}>First Name*</label>
                <InputField
                    className='inputField'
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                />

                <label className={styles.label}>Last Name*</label>
                <InputField
                    className='inputField'
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                />

                <label className={styles.label}>Gender*</label>
                <SingleSelect
                    className='selectField'
                    name="gender"
                    selected={formData.gender}
                    onChange={({ selected }) => handleChange({ name: 'gender', value: selected })}
                    label="Gender"
                    required
                    disabled={isSubmitting}
                >
                    <SingleSelectOption value="male" label="Male" />
                    <SingleSelectOption value="female" label="Female" />
                    <SingleSelectOption value="other" label="Other" />
                </SingleSelect>

                <label className={styles.label}>Date Of Birth*</label>
                <InputField
                    className='inputField'
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                />

                <label className={styles.label}>Nationality*</label>
                <InputField
                    className='inputField'
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                />

                <label className={styles.label}>Guardian's Name</label>
                <InputField
                    className='inputField'
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                />

                <Divider className='divider' />

                <div className="buttonGroup">
                    <Button
                        className="clearButton"
                        destructive
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="submitButton"
                        primary
                        type="submit"
                        disabled={isSubmitting}
                        icon={isSubmitting ? <CircularLoader small /> : null}
                    >
                        {isSubmitting ? 'Submitting...' : 'Save and Submit'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EnrollmentForm;
