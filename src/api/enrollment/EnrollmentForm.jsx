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
import'./EnrollmentForm.css';
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
        

            registerAndEnrollStudent(formData, 'NIDbTzjU8J8', orgUnitId, 'W85ui9yO3vH')
                .then(result => {
                    if (result.success) {
                        console.log('Student registered and enrolled successfully!', result);
                        alert('Student registration and enrollment completed!');
                    } else {
                        console.error('Failed:', result.error);
                        alert('Error: ' + result.error);
                    }
                });
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
     navigate('/api/enrollment/enrollments');
        
    };


      return (
        <div className='main1'>
            <h2 className='formTitle'>
                {editingEnrollment ? 'Edit Student Enrollment' : 'New Student Enrollment'}
            </h2>

            {submitError && (
                <NoticeBox error title="Submission Error" className="error-notice">
                    {submitError}
                </NoticeBox>
            )}

            <form onSubmit={handleSubmit} className='enrollmentForm'>
                <div className="formContent">
                    <Divider className='divider' />
                    <h3 className='formSection'>Enrollment Details</h3>

                    <div className="formRow">
                        <div className="formGroup">
                            <label className='label'>School Name</label>
                            <InputField
                                className='inputField'
                                name="school"
                                value={formData.school}
                                disabled
                                required
                            />
                        </div>
                        
                        <div className="formGroup">
                            <label className='label'>Registration Number*</label>
                            <InputField
                                className='inputField'
                                name="regNumber"
                                value={formData.regNumber}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="formRow">
                        <div className="formGroup">
                            <label className='label'>Academic Year*</label>
                            <SingleSelect
                                className='selectField'
                                name="academicYear"
                                selected={formData.academicYear}
                                onChange={({ selected }) =>
                                    handleChange({ name: 'academicYear', value: selected })
                                }
                                required
                                disabled={isSubmitting}
                            >
                                <SingleSelectOption value="2024-2025" label="2024-2025" />
                                <SingleSelectOption value="2025-2026" label="2025-2026" />
                            </SingleSelect>
                        </div>
                        
                        <div className="formGroup">
                            <label className='label'>Year Of Study*</label>
                            <SingleSelect
                                className='selectField'
                                name="yearOfStudy"
                                selected={formData.yearOfStudy}
                                onChange={({ selected }) =>
                                    handleChange({ name: 'yearOfStudy', value: selected })
                                }
                                required
                                disabled={isSubmitting}
                            >
                                {['1', '2', '3', '4', '5'].map(year => (
                                    <SingleSelectOption key={year} value={year} label={`Year ${year}`} />
                                ))}
                            </SingleSelect>
                        </div>
                    </div>

                    <div className="formRow">
                        <div className="formGroup">
                            <label className='label'>Program Of Study*</label>
                            <SingleSelect
                                className='selectField'
                                name="programOfStudy"
                                selected={formData.programOfStudy}
                                onChange={({ selected }) =>
                                    handleChange({ name: 'programOfStudy', value: selected })
                                }
                                required
                                disabled={isSubmitting}
                            >
                                <SingleSelectOption value="ComputerScience" label="Computer Science" />
                                <SingleSelectOption value="Statistics" label="Statistics" />
                                <SingleSelectOption value="PoliticalScience" label="Political Science" />
                                <SingleSelectOption value="Arts" label="Bachelor of Arts" />
                                <SingleSelectOption value="InformationSystem" label="Information System" />
                            </SingleSelect>
                        </div>
                        
                        <div className="formGroup">
                            <label className='label'>Enrollment Date*</label>
                            <InputField
                                className='inputField'
                                type="date"
                                name="enrollmentDate"
                                value={formData.enrollmentDate}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <Divider className='divider' />
                    <h3 className="formSection">Student Profile</h3>

                    <div className="imageSection">
                        <div className="imageWrapper">
                            {formData.profilePicture ? (
                                <img
                                    src={formData.profilePicture}
                                    alt="Profile"
                                    className="profileImage"
                                />
                            ) : (
                                <div className="profileImage" style={{
                                    width: '150px',
                                    height: '150px',
                                    backgroundColor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#999',
                                    borderRadius: '8px'
                                }}>
                                    No Image
                                </div>
                            )}
                            
                            <div className="imageButtons">
                                <Button
                                    className={formData.profilePicture ? 'changeButton' : 'uploadButton'}
                                    onClick={() => document.getElementById('profileInput').click()}
                                    disabled={isSubmitting}
                                >
                                    {formData.profilePicture ? 'Change Photo' : 'Upload Photo'}
                                </Button>
                                <Button
                                    className='cameraButton'
                                    onClick={() => setIsCameraOpen(true)}
                                    disabled={isSubmitting}
                                >
                                    Take Photo
                                </Button>
                            </div>
                            
                            <input
                                type="file"
                                id="profileInput"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div style={{ flex: 1 }}>
                            <div className="formRow">
                                <div className="formGroup">
                                    <label className='label'>First Name*</label>
                                    <InputField
                                        className='inputField'
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                
                                <div className="formGroup">
                                    <label className='label'>Last Name*</label>
                                    <InputField
                                        className='inputField'
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="formRow">
                                <div className="formGroup">
                                    <label className='label'>Gender*</label>
                                    <SingleSelect
                                        className='selectField'
                                        name="gender"
                                        selected={formData.gender}
                                        onChange={({ selected }) => handleChange({ name: 'gender', value: selected })}
                                        required
                                        disabled={isSubmitting}
                                    >
                                        <SingleSelectOption value="male" label="Male" />
                                        <SingleSelectOption value="female" label="Female" />
                                        <SingleSelectOption value="other" label="Other" />
                                    </SingleSelect>
                                </div>
                                
                                <div className="formGroup">
                                    <label className='label'>Date Of Birth*</label>
                                    <InputField
                                        className='inputField'
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="formRow">
                                <div className="formGroup">
                                    <label className='label'>Nationality*</label>
                                    <InputField
                                        className='inputField'
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                
                                <div className="formGroup">
                                    <label className='label'>Guardian's Name</label>
                                    <InputField
                                        className='inputField'
                                        name="guardianName"
                                        value={formData.guardianName}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {isCameraOpen && (
                        <div className="cameraWrapper">
                            <Webcam
                                audio={false}
                                screenshotFormat="image/jpeg"
                                className="webcam"
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
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
                            </div>
                        </div>
                    )}

                    <Divider className='divider' />
                </div>

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
