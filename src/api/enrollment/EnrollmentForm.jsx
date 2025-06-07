// import React, { useState, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import {
//     InputField,
//     SingleSelect,
//     SingleSelectOption,
//     Button,
//     Divider,
//     CircularLoader,
//     NoticeBox,
// } from '@dhis2/ui';
// import'./EnrollmentForm.css';
// import { useNavigate } from 'react-router-dom';
// import { useEnrolledStudents } from '../../hooks/api-calls/apis';
// import { registerAndEnrollStudent } from '../../hooks/api-calls/apis'
// const EnrollmentForm = ({ school, orgUnitId, onSubmit, editingEnrollment, onCancel }) => {
//     // Form state
//     const [formData, setFormData] = useState({
//         regNumber: '',
//         school: school || '',
//         academicYear: '',
//         yearOfStudy: '',
//         programOfStudy: '',
//         enrollmentDate: '',
//         firstName: '',
//         surname: '',
//         gender: '',
//         dateOfBirth: '',
//         nationality: '',
//         guardianName: '',
//         profilePicture: null,
//     });

//     // UI state
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [isCameraOpen, setIsCameraOpen] = useState(false);
//     const [submitError, setSubmitError] = useState(null);

//     // Hooks
//     const navigate = useNavigate();
//     // const { enrollStudent, loadingEnrol, errorEnrol } = useEnrolledStudents();

//     // Initialize form if editing
//     useEffect(() => {
//         if (editingEnrollment) {
//             setFormData({
//                 ...editingEnrollment,
//                 enrollmentDate: editingEnrollment.enrollmentDate || '',
//                 dateOfBirth: editingEnrollment.dateOfBirth || '',
//             });
//         }
//     }, [editingEnrollment]);

//     // Handlers
//     const handleChange = ({ name, value }) => {
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setFormData(prev => ({ ...prev, profilePicture: reader.result }));
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleCapture = (imageSrc) => {
//         setFormData(prev => ({ ...prev, profilePicture: imageSrc }));
//         setIsCameraOpen(false);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSubmitError(null);
//         setIsSubmitting(true);

//         try {
//             // Validate required fields
//             // if (!formData.regNumber || !formData.profilePicture) {
//             //     throw new Error('Registration number and profile picture are required');
//             // }

//             // Send face data to facial recognition system
//             // const faceResponse = await fetch('https://facial-attendance-system-6vy8.onrender.com/face/detect',
//             faceResponse = await fetch('https://1dd7-102-70-92-142.ngrok-free.app/face/detect',
//                 {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         file: formData.profilePicture,
//                         registrationNumber: formData.regNumber
//                     }),
//                 }
//             );
// console.log('Face response:', faceResponse);
//             if (faceResponse.status === 'false') {
//                 alert('Failed to register face data with recognition system');
//                 onCancel()
//             }else{    
//                 console.log('Face data registered successfully');

//             registerAndEnrollStudent(formData, 'TLvAWiCKRgq', orgUnitId, 'N6eVEDUrpYU')
//                 .then(result => {
//                     if (result.success) {
//                         console.log('Student registered and enrolled successfully!', result);
//                         alert('Student registration and enrollment completed!');
//                     } else {
//                         console.error('Failed:', result.error);
//                         alert('Error: ' + result.error);
//                     }
//                 });
//             }
//             // Success - notify parent and navigate
//             onSubmit?.(formData);
//             navigate('/api/enrollments');
//         } catch (error) {
//             setSubmitError(error.message);
//             alert('Enrollment error:', error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleCancel = () => {
//         if (onCancel) {
//             onCancel();
//         } 
//         onCancel()
//             // Default cancel behavior
//      navigate('/api/enrollment/enrollments');

//     };


//       return (
//         <div className='main1'>
//             <h2 className='formTitle'>
//                 {editingEnrollment ? 'Edit Student Enrollment' : 'New Student Enrollment'}
//             </h2>

//             {submitError && (
//                 <NoticeBox error title="Submission Error" className="error-notice">
//                     {submitError}
//                 </NoticeBox>
//             )}

//             <form onSubmit={handleSubmit} className='enrollmentForm'>
//                 <div className="formContent">
//                     <Divider className='divider' />
//                     <h3 className='formSection'>Enrollment Details</h3>

//                     <div className="formRow">
//                         <div className="formGroup">
//                             <label className='label'>School Name</label>
//                             <InputField
//                                 className='inputField'
//                                 name="school"
//                                 value={formData.school}
//                                 disabled
//                                 required
//                             />
//                         </div>

//                         <div className="formGroup">
//                             <label className='label'>Registration Number*</label>
//                             <InputField
//                                 className='inputField'
//                                 name="regNumber"
//                                 value={formData.regNumber}
//                                 onChange={handleChange}
//                                 required
//                                 disabled={isSubmitting}
//                             />
//                         </div>
//                     </div>

//                     <div className="formRow">
//                         <div className="formGroup">
//                             <label className='label'>Academic Year*</label>
//                             <SingleSelect
//                                 className='selectField'
//                                 name="academicYear"
//                                 selected={formData.academicYear}
//                                 onChange={({ selected }) =>
//                                     handleChange({ name: 'academicYear', value: selected })
//                                 }
//                                 required
//                                 disabled={isSubmitting}
//                             >
//                                 <SingleSelectOption value="2024-2025" label="2024-2025" />
//                                 <SingleSelectOption value="2025-2026" label="2025-2026" />
//                             </SingleSelect>
//                         </div>

//                         <div className="formGroup">
//                             <label className='label'>Year Of Study*</label>
//                             <SingleSelect
//                                 className='selectField'
//                                 name="yearOfStudy"
//                                 selected={formData.yearOfStudy}
//                                 onChange={({ selected }) =>
//                                     handleChange({ name: 'yearOfStudy', value: selected })
//                                 }
//                                 required
//                                 disabled={isSubmitting}
//                             >
//                                 {['1', '2', '3', '4', '5'].map(year => (
//                                     <SingleSelectOption key={year} value={year} label={`Year ${year}`} />
//                                 ))}
//                             </SingleSelect>
//                         </div>
//                     </div>

//                     <div className="formRow">
//                         <div className="formGroup">
//                             <label className='label'>Program Of Study*</label>
//                             <SingleSelect
//                                 className='selectField'
//                                 name="programOfStudy"
//                                 selected={formData.programOfStudy}
//                                 onChange={({ selected }) =>
//                                     handleChange({ name: 'programOfStudy', value: selected })
//                                 }
//                                 required
//                                 disabled={isSubmitting}
//                             >
//                                 <SingleSelectOption value="ComputerScience" label="Computer Science" />
//                                 <SingleSelectOption value="Statistics" label="Statistics" />
//                                 <SingleSelectOption value="PoliticalScience" label="Political Science" />
//                                 <SingleSelectOption value="Arts" label="Bachelor of Arts" />
//                                 <SingleSelectOption value="InformationSystem" label="Information System" />
//                             </SingleSelect>
//                         </div>

//                         <div className="formGroup">
//                             <label className='label'>Enrollment Date*</label>
//                             <InputField
//                                 className='inputField'
//                                 type="date"
//                                 name="enrollmentDate"
//                                 value={formData.enrollmentDate}
//                                 onChange={handleChange}
//                                 required
//                                 disabled={isSubmitting}
//                             />
//                         </div>
//                     </div>

//                     <Divider className='divider' />
//                     <h3 className="formSection">Student Profile</h3>

//                     <div className="imageSection">
//                         <div className="imageWrapper">
//                             {formData.profilePicture ? (
//                                 <img
//                                     src={formData.profilePicture}
//                                     alt="Profile"
//                                     className="profileImage"
//                                 />
//                             ) : (
//                                 <div className="profileImage" style={{
//                                     width: '150px',
//                                     height: '150px',
//                                     backgroundColor: '#f0f0f0',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                     color: '#999',
//                                     borderRadius: '8px'
//                                 }}>
//                                     No Image
//                                 </div>
//                             )}

//                             <div className="imageButtons">
//                                 <Button
//                                     className={formData.profilePicture ? 'changeButton' : 'uploadButton'}
//                                     onClick={() => document.getElementById('profileInput').click()}
//                                     disabled={isSubmitting}
//                                 >
//                                     {formData.profilePicture ? 'Change Photo' : 'Upload Photo'}
//                                 </Button>
//                                 <Button
//                                     className='cameraButton'
//                                     onClick={() => setIsCameraOpen(true)}
//                                     disabled={isSubmitting}
//                                 >
//                                     Take Photo
//                                 </Button>
//                             </div>

//                             <input
//                                 type="file"
//                                 id="profileInput"
//                                 accept="image/*"
//                                 style={{ display: 'none' }}
//                                 onChange={handleFileChange}
//                                 disabled={isSubmitting}
//                             />
//                         </div>

//                         <div style={{ flex: 1 }}>
//                             <div className="formRow">
//                                 <div className="formGroup">
//                                     <label className='label'>First Name*</label>
//                                     <InputField
//                                         className='inputField'
//                                         name="firstName"
//                                         value={formData.firstName}
//                                         onChange={handleChange}
//                                         required
//                                         disabled={isSubmitting}
//                                     />
//                                 </div>

//                                 <div className="formGroup">
//                                     <label className='label'>Last Name*</label>
//                                     <InputField
//                                         className='inputField'
//                                         name="surname"
//                                         value={formData.surname}
//                                         onChange={handleChange}
//                                         required
//                                         disabled={isSubmitting}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="formRow">
//                                 <div className="formGroup">
//                                     <label className='label'>Gender*</label>
//                                     <SingleSelect
//                                         className='selectField'
//                                         name="gender"
//                                         selected={formData.gender}
//                                         onChange={({ selected }) => handleChange({ name: 'gender', value: selected })}
//                                         required
//                                         disabled={isSubmitting}
//                                     >
//                                         <SingleSelectOption value="male" label="Male" />
//                                         <SingleSelectOption value="female" label="Female" />
//                                         <SingleSelectOption value="other" label="Other" />
//                                     </SingleSelect>
//                                 </div>

//                                 <div className="formGroup">
//                                     <label className='label'>Date Of Birth*</label>
//                                     <InputField
//                                         className='inputField'
//                                         type="date"
//                                         name="dateOfBirth"
//                                         value={formData.dateOfBirth}
//                                         onChange={handleChange}
//                                         required
//                                         disabled={isSubmitting}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="formRow">
//                                 <div className="formGroup">
//                                     <label className='label'>Nationality*</label>
//                                     <InputField
//                                         className='inputField'
//                                         name="nationality"
//                                         value={formData.nationality}
//                                         onChange={handleChange}
//                                         required
//                                         disabled={isSubmitting}
//                                     />
//                                 </div>

//                                 <div className="formGroup">
//                                     <label className='label'>Guardian's Name</label>
//                                     <InputField
//                                         className='inputField'
//                                         name="guardianName"
//                                         value={formData.guardianName}
//                                         onChange={handleChange}
//                                         disabled={isSubmitting}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {isCameraOpen && (
//                         <div className="cameraWrapper">
//                             <Webcam
//                                 audio={false}
//                                 screenshotFormat="image/jpeg"
//                                 className="webcam"
//                             />
//                             <div style={{ display: 'flex', gap: '10px' }}>
//                                 <Button
//                                     className="captureButton"
//                                     onClick={() => handleCapture(getScreenshot())}
//                                 >
//                                     Capture
//                                 </Button>
//                                 <Button
//                                     className="closeCameraButton"
//                                     onClick={() => setIsCameraOpen(false)}
//                                 >
//                                     Close Camera
//                                 </Button>
//                             </div>
//                         </div>
//                     )}

//                     <Divider className='divider' />
//                 </div>

//                 <div className="buttonGroup">
//                     <Button
//                         className="clearButton"
//                         destructive
//                         onClick={handleCancel}
//                         disabled={isSubmitting}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         className="submitButton"
//                         primary
//                         type="submit"
//                         disabled={isSubmitting}
//                         icon={isSubmitting ? <CircularLoader small /> : null}
//                     >
//                         {isSubmitting ? 'Submitting...' : 'Save and Submit'}
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default EnrollmentForm;

import React, { useState, useEffect, useRef } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { registerAndEnrollStudent } from '../../hooks/api-calls/apis';

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

    // Webcam reference
    const webcamRef = useRef(null);

    // Hooks
    const navigate = useNavigate();

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

    const resizeImage = (file, maxWidth, maxHeight, quality = 0.7) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Resize image before setting it in state
                const resizedImage = await resizeImage(file, 400, 400);
                setFormData(prev => ({ ...prev, profilePicture: resizedImage }));
            } catch (error) {
                console.error('Error resizing image:', error);
                // Fallback to original if resizing fails
                const reader = new FileReader();
                reader.onload = () => {
                    setFormData(prev => ({ ...prev, profilePicture: reader.result }));
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleCapture = () => {
        if (webcamRef.current) {
            const screenshot = webcamRef.current.getScreenshot();
            // Resize the captured image
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxWidth = 400;
                const maxHeight = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                setFormData(prev => ({ ...prev, profilePicture: canvas.toDataURL('image/jpeg', 0.7) }));
                setIsCameraOpen(false);
            };
            img.src = screenshot;
        } else {
            console.error('Webcam reference is not available');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        setIsSubmitting(true);

        try {
            // Prepare form data for backend
            const formDataToSend = new FormData();
            formDataToSend.append('registrationNumber', formData.regNumber);
            formDataToSend.append('name', formData.firstName + ' ' + formData.surname);

            // Convert base64 image to blob if it exists
            if (formData.profilePicture) {
                const blob = await fetch(formData.profilePicture).then(res => res.blob());
                formDataToSend.append('file', blob, 'profile.jpg');
            }

         

            // Send to face detection endpoint
            const faceResponse = await fetch('https://facial-attendance-system-6vy8.onrender.com/face/detect', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!faceResponse.ok) {
                throw new Error('Failed to register face data with recognition system');
            }

            const faceData = await faceResponse.json();
            console.log('Face data registered successfully:', faceData);

            // // Proceed with enrollment
            const enrollmentResult = await registerAndEnrollStudent(formData, 'TLvAWiCKRgq', orgUnitId, 'N6eVEDUrpYU');

            if (enrollmentResult.success) {
                console.log('Student registered and enrolled successfully!', enrollmentResult);
                alert('Student registration and enrollment completed!');
                
            } else {
                throw new Error(enrollmentResult.error || 'Failed to enroll student');
            }
            onSubmit?.(formData);
            navigate('/api/enrollment/enrollments');
        } catch (error) {
            setSubmitError(error.message);
            console.error('Enrollment error:', error);
            alert('Error: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onCancel?.();
        navigate('/api/enrollment/enrollments');
    };

    const inputStyle = {
        width: '100%',
        maxWidth: '600px',
        boxSizing: 'border-box',
    };

    return (
        <div style={{ overflow: "auto", padding: '2rem', margin: "2rem" }} className='main1'>
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

                    {/* Enrollment Details */}
                    <div className="formRow">
                        <div className="formGroup">
                            <label className='label'>School Name</label>
                            <InputField
                                style={inputStyle}
                                name="school"
                                value={formData.school}
                                disabled
                                required
                            />
                        </div>

                        <div className="formGroup">
                            <label className='label'>Registration Number*</label>
                            <InputField
                                style={inputStyle}
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
                                style={inputStyle}
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
                                style={inputStyle}
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
                                style={inputStyle}
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
                                style={inputStyle}
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

                    {/* Profile Picture Section */}
                    <div className="imageSection">
                        <div className="imageWrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {formData.profilePicture ? (
                                <img
                                    src={formData.profilePicture}
                                    alt="Profile"
                                    style={{
                                        width: '150px',
                                        height: '150px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        marginBottom: '10px'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '150px',
                                    height: '150px',
                                    backgroundColor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#999',
                                    borderRadius: '8px',
                                    marginBottom: '10px'
                                }}>
                                    No Image
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <Button
                                    onClick={() => document.getElementById('profileInput').click()}
                                    disabled={isSubmitting}
                                >
                                    {formData.profilePicture ? 'Change Photo' : 'Upload Photo'}
                                </Button>
                                <Button
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

                        {isCameraOpen && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000
                            }}>
                                <div style={{ width: '80%', maxWidth: '500px', marginBottom: '20px' }}>
                                    <Webcam
                                        audio={false}
                                        screenshotFormat="image/jpeg"
                                        style={{ width: '100%', borderRadius: '8px' }}
                                        ref={webcamRef}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <Button
                                        onClick={handleCapture}
                                        primary
                                    >
                                        Capture
                                    </Button>
                                    <Button
                                        onClick={() => setIsCameraOpen(false)}
                                        destructive
                                    >
                                        Close Camera
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Additional Fields */}
                    <div style={{ flex: 1 }}>
                        <div className="formRow">
                            <div className="formGroup">
                                <label className='label'>First Name*</label>
                                <InputField
                                    style={inputStyle}
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
                                    style={inputStyle}
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
                                    style={inputStyle}
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
                                    style={inputStyle}
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
                                    style={inputStyle}
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
                                    style={inputStyle}
                                    name="guardianName"
                                    value={formData.guardianName}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    <Divider className='divider' />
                </div>

                <div style={{ display: "flex", flexDirection: "row", padding: "1rem", justifyItems: "space-between" }}>
                    <button
                        style={{ marginRight: "2rem" }}
                        destructive
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        style={{ marginLeft: "50%", backgroundColor: "blue" }}
                        primary
                        type="submit"
                        disabled={isSubmitting}
                        icon={isSubmitting ? <CircularLoader small /> : null}
                    >
                        {isSubmitting ? 'Submitting...' : 'Save and Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EnrollmentForm;