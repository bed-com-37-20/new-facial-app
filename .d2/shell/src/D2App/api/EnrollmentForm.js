import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { InputField, SingleSelect, SingleSelectOption, Button, Divider, CircularLoader, NoticeBox } from '@dhis2/ui';
import styles from './EnrollmentForm.css';
import { useEnrollStudent } from '../hooks/api-calls/apis';
import { useNavigate } from 'react-router-dom';
const EnrollmentForm = _ref => {
  let {
    school,
    orgUnitId,
    onSubmit,
    editingEnrollment,
    onCancel
  } = _ref;
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
    profilePicture: null
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Hooks
  const navigate = useNavigate();
  const {
    enrollStudent,
    loadingEnrol,
    errorEnrol
  } = useEnrollStudent();

  // Initialize form if editing
  useEffect(() => {
    if (editingEnrollment) {
      setFormData({
        ...editingEnrollment,
        enrollmentDate: editingEnrollment.enrollmentDate || '',
        dateOfBirth: editingEnrollment.dateOfBirth || ''
      });
    }
  }, [editingEnrollment]);

  // Handlers
  const handleChange = _ref2 => {
    let {
      name,
      value
    } = _ref2;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCapture = imageSrc => {
    setFormData(prev => ({
      ...prev,
      profilePicture: imageSrc
    }));
    setIsCameraOpen(false);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!formData.regNumber || !formData.profilePicture) {
        throw new Error('Registration number and profile picture are required');
      }

      // Send face data to facial recognition system
      const faceResponse = await fetch('https://facial-attendance-system-6vy8.onrender.com/face/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file: formData.profilePicture,
          registrationNumber: formData.regNumber
        })
      });
      if (!faceResponse.status) {
        alert('Failed to register face data with recognition system');
        onCancel();
      }

      // Enroll student in DHIS2
      await enrollStudent('N6eVEDUrpYU',
      // trackedEntityType
      'TLvAWiCKRgq',
      // programId
      orgUnitId, formData);

      // Success - notify parent and navigate
      onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit(formData);
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
    onCancel();
    // Default cancel behavior
    navigate('/api/enrollments');
  };

  // Loading and error states
  if (loadingEnrol) {
    return /*#__PURE__*/React.createElement("div", {
      className: "loader-container"
    }, /*#__PURE__*/React.createElement(CircularLoader, null), /*#__PURE__*/React.createElement("p", null, "Loading enrollment data..."));
  }
  if (errorEnrol) {
    return /*#__PURE__*/React.createElement("div", {
      className: "error-container"
    }, /*#__PURE__*/React.createElement(NoticeBox, {
      error: true,
      title: "Loading Error"
    }, errorEnrol.message), /*#__PURE__*/React.createElement(Button, {
      onClick: handleCancel
    }, "Back to Enrollments"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "formTitle"
  }, editingEnrollment ? 'Edit Student Enrollment' : 'New Student Enrollment'), submitError && /*#__PURE__*/React.createElement(NoticeBox, {
    error: true,
    title: "Submission Error",
    className: "error-notice"
  }, submitError), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "enrollmentForm"
  }, /*#__PURE__*/React.createElement(Divider, {
    className: "divider"
  }), /*#__PURE__*/React.createElement("h3", {
    className: styles.formSection
  }, "Enrollment Details"), /*#__PURE__*/React.createElement("label", {
    className: styles.label
  }, "School Name"), /*#__PURE__*/React.createElement(InputField, {
    className: "inputField",
    name: "school",
    value: formData.school,
    disabled: true,
    required: true
  }), /*#__PURE__*/React.createElement("label", {
    className: styles.label
  }, "Registration Number*"), /*#__PURE__*/React.createElement(InputField, {
    className: "inputField",
    name: "regNumber",
    value: formData.regNumber,
    onChange: handleChange,
    required: true,
    disabled: isSubmitting
  }), /*#__PURE__*/React.createElement("label", {
    className: styles.label
  }, "Academic Year*"), /*#__PURE__*/React.createElement(SingleSelect, {
    className: "selectField",
    name: "academicYear",
    selected: formData.academicYear,
    onChange: _ref3 => {
      let {
        selected
      } = _ref3;
      return handleChange({
        name: 'academicYear',
        value: selected
      });
    },
    label: "Academic Year",
    required: true,
    disabled: isSubmitting
  }, /*#__PURE__*/React.createElement(SingleSelectOption, {
    value: "2024-2025",
    label: "2024-2025"
  }), /*#__PURE__*/React.createElement(SingleSelectOption, {
    value: "2025-2026",
    label: "2025-2026"
  })), /*#__PURE__*/React.createElement("label", {
    className: styles.label
  }, "Year Of Study*"), /*#__PURE__*/React.createElement(SingleSelect, {
    className: "selectField",
    name: "yearOfStudy",
    selected: formData.yearOfStudy,
    onChange: _ref4 => {
      let {
        selected
      } = _ref4;
      return handleChange({
        name: 'yearOfStudy',
        value: selected
      });
    },
    label: "Year of Study",
    required: true,
    disabled: isSubmitting
  }, ['1', '2', '3', '4', '5'].map(year => /*#__PURE__*/React.createElement(SingleSelectOption, {
    key: year,
    value: year,
    label: year
  }))), /*#__PURE__*/React.createElement("label", {
    className: styles.label
  }, "Program Of Study*"), /*#__PURE__*/React.createElement(SingleSelect, {
    className: "selectField",
    name: "programOfStudy",
    selected: formData.programOfStudy,
    onChange: _ref5 => {
      let {
        selected
      } = _ref5;
      return handleChange({
        name: 'programOfStudy',
        value: selected
      });
    },
    label: "Program of Study",
    required: true,
    disabled: isSubmitting
  }, /*#__PURE__*/React.createElement(SingleSelectOption, {
    value: "ComputerScience",
    label: "Computer Science"
  }), /*#__PURE__*/React.createElement(SingleSelectOption, {
    value: "Statistics",
    label: "Statistics"
  }), /*#__PURE__*/React.createElement(SingleSelectOption, {
    value: "PoliticalScience",
    label: "Political Science"
  }), /*#__PURE__*/React.createElement(SingleSelectOption, {
    value: "Arts",
    label: "Bachelor of Arts"
  }), /*#__PURE__*/React.createElement(SingleSelectOption, {
    value: "InformationSystem",
    label: "Information System"
  })), /*#__PURE__*/React.createElement("label", {
    className: styles.label
  }, "Enrollment Date*"), /*#__PURE__*/React.createElement(InputField, {
    className: "inputField",
    type: "date",
    name: "enrollmentDate",
    value: formData.enrollmentDate,
    onChange: handleChange,
    required: true,
    disabled: isSubmitting
  }), /*#__PURE__*/React.createElement(Divider, {
    className: "divider"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "formSection"
  }, "Student Profile"), /*#__PURE__*/React.createElement("div", {
    className: "imageWrapper"
  }, formData.profilePicture ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
    src: formData.profilePicture,
    alt: "Profile",
    className: "profileImage"
  }), /*#__PURE__*/React.createElement(Button, {
    small: true,
    className: "changeButton",
    onClick: () => document.getElementById('profileInput').click(),
    disabled: isSubmitting
  }, "Change")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    className: "uploadButton",
    onClick: () => document.getElementById('profileInput').click(),
    disabled: isSubmitting
  }, "Upload Profile Picture"), /*#__PURE__*/React.createElement(Button, {
    className: "cameraButton",
    onClick: () => setIsCameraOpen(true),
    disabled: isSubmitting
  }, "Capture with Camera")), /*#__PURE__*/React.createElement("input", {
    type: "file",
    id: "profileInput",
    accept: "image/*",
    style: {
      display: 'none'
    },
    onChange: handleFileChange,
    disabled: isSubmitting
  })), isCameraOpen && /*#__PURE__*/React.createElement("div", {
    className: "cameraWrapper"
  }, /*#__PURE__*/React.createElement(Webcam, {
    audio: false,
    screenshotFormat: "image/jpeg",
    className: "webcam"
  }, _ref6 => {
    let {
      getScreenshot
    } = _ref6;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      className: "captureButton",
      onClick: () => handleCapture(getScreenshot())
    }, "Capture"), /*#__PURE__*/React.createElement(Button, {
      className: "closeCameraButton",
      onClick: () => setIsCameraOpen(false)
    }, "Close Camera"));
  })), /*#__PURE__*/React.createElement("label", {
    className: styles.label
  }, "First Name*"), /*#__PURE__*/React.createElement(InputField, {
    className: "inputField",
    name: "firstName",
    value: formData.firstName,
    onChange: handleChange,
    required: true,
    disabled: isSubmitting
  }), /*#__PURE__*/React.createElement("label", {
    className: styles.label
  }, "Last Name*"), /*#__PURE__*/React.createElement(InputField, {
    className: "inputField",
    name: "surname",
    value: formData.surname,
    onChange: handleChange,
    required: true,
    disabled: isSubmitting
  }), /*#__PURE__*/React.createElement("label", {
    className: styles.label
  }, "Gender*"), /*#__PURE__*/React.createElement(SingleSelect, {
    className: "selectField",
    name: "gender",
    selected: formData.gender,
    onChange: _ref7 => {
      let {
        selected
      } = _ref7;
      return handleChange({
        name: 'gender',
        value: selected
      });
    },
    label: "Gender",
    required: true,
    disabled: isSubmitting
  }, /*#__PURE__*/React.createElement(SingleSelectOption, {
    value: "male",
    label: "Male"
  }), /*#__PURE__*/React.createElement(SingleSelectOption, {
    value: "female",
    label: "Female"
  }), /*#__PURE__*/React.createElement(SingleSelectOption, {
    value: "other",
    label: "Other"
  })), /*#__PURE__*/React.createElement("label", {
    className: styles.label
  }, "Date Of Birth*"), /*#__PURE__*/React.createElement(InputField, {
    className: "inputField",
    type: "date",
    name: "dateOfBirth",
    value: formData.dateOfBirth,
    onChange: handleChange,
    required: true,
    disabled: isSubmitting
  }), /*#__PURE__*/React.createElement("label", {
    className: styles.label
  }, "Nationality*"), /*#__PURE__*/React.createElement(InputField, {
    className: "inputField",
    name: "nationality",
    value: formData.nationality,
    onChange: handleChange,
    required: true,
    disabled: isSubmitting
  }), /*#__PURE__*/React.createElement("label", {
    className: styles.label
  }, "Guardian's Name"), /*#__PURE__*/React.createElement(InputField, {
    className: "inputField",
    name: "guardianName",
    value: formData.guardianName,
    onChange: handleChange,
    disabled: isSubmitting
  }), /*#__PURE__*/React.createElement(Divider, {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "buttonGroup"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "clearButton",
    destructive: true,
    onClick: handleCancel,
    disabled: isSubmitting
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    className: "submitButton",
    primary: true,
    type: "submit",
    disabled: isSubmitting,
    icon: isSubmitting ? /*#__PURE__*/React.createElement(CircularLoader, {
      small: true
    }) : null
  }, isSubmitting ? 'Submitting...' : 'Save and Submit'))));
};
export default EnrollmentForm;