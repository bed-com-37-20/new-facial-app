import React from "react";
import { useState } from 'react';
import { supabase } from '../utils/supabase'; // Your Supabase client setup

export default function ImageUploadForm() {
  const [ownerData, setOwnerData] = useState({
    name: '',
    email: ''
  });
  const [imageData, setImageData] = useState({
    name: '',
    description: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    text: '',
    type: ''
  });
  const handleOwnerChange = e => {
    setOwnerData({
      ...ownerData,
      [e.target.name]: e.target.value
    });
  };
  const handleImageChange = e => {
    if (e.target.name === 'file') {
      setImageData({
        ...imageData,
        file: e.target.files[0]
      });
    } else {
      setImageData({
        ...imageData,
        [e.target.name]: e.target.value
      });
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage({
      text: '',
      type: ''
    });
    try {
      // 1. First find or create the owner
      let owner;

      // Check if owner exists by email
      const {
        data: existingOwner,
        error: findError
      } = await supabase.from('owners').select('*').eq('email', ownerData.email).maybeSingle();
      if (findError) throw findError;
      if (existingOwner) {
        // Owner exists - use existing record
        owner = existingOwner;
      } else {
        // Create new owner
        const {
          data: newOwner,
          error: createError
        } = await supabase.from('owners').insert({
          name: ownerData.name,
          email: ownerData.email
        }).select().single();
        if (createError) throw createError;
        owner = newOwner;
      }

      // 2. Upload the image to storage
      const fileExt = imageData.file.name.split('.').pop();
      const fileName = `${owner.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `owners/${owner.id}/${fileName}`;
      const {
        error: uploadError
      } = await supabase.storage.from('dhis2-image-store').upload(filePath, imageData.file);
      if (uploadError) throw uploadError;

      // 3. Store image metadata in database
      const {
        error: dbError
      } = await supabase.from('images').insert({
        owner_id: owner.id,
        name: imageData.name,
        description: imageData.description,
        storage_path: filePath
      });
      if (dbError) throw dbError;
      setMessage({
        text: 'Upload successful!',
        type: 'success'
      });
      // Reset form
      setOwnerData({
        name: '',
        email: ''
      });
      setImageData({
        name: '',
        description: '',
        file: null
      });
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        text: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '28rem',
      margin: '0 auto',
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem'
    }
  }, "Upload Image with Owner Details"), message.text && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0.75rem',
      marginBottom: '1rem',
      borderRadius: '0.375rem',
      backgroundColor: message.type === 'error' ? '#FEE2E2' : '#D1FAE5',
      color: message.type === 'error' ? '#B91C1C' : '#065F46'
    }
  }, message.text), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.125rem',
      fontWeight: '500',
      marginBottom: '0.5rem'
    }
  }, "Owner Information"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name",
    style: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4B5563'
    }
  }, "Owner Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "name",
    name: "name",
    value: ownerData.name,
    onChange: handleOwnerChange,
    required: true,
    style: {
      marginTop: '0.25rem',
      display: 'block',
      width: '100%',
      borderRadius: '0.375rem',
      border: '1px solid #D1D5DB',
      padding: '0.5rem',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "email",
    style: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4B5563'
    }
  }, "Owner Email"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    id: "email",
    name: "email",
    value: ownerData.email,
    onChange: handleOwnerChange,
    required: true,
    style: {
      marginTop: '0.25rem',
      display: 'block',
      width: '100%',
      borderRadius: '0.375rem',
      border: '1px solid #D1D5DB',
      padding: '0.5rem',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    }
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.125rem',
      fontWeight: '500',
      marginBottom: '0.5rem'
    }
  }, "Image Information"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "image-name",
    style: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4B5563'
    }
  }, "Image Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "image-name",
    name: "name",
    value: imageData.name,
    onChange: handleImageChange,
    required: true,
    style: {
      marginTop: '0.25rem',
      display: 'block',
      width: '100%',
      borderRadius: '0.375rem',
      border: '1px solid #D1D5DB',
      padding: '0.5rem',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "description",
    style: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4B5563'
    }
  }, "Description"), /*#__PURE__*/React.createElement("textarea", {
    id: "description",
    name: "description",
    value: imageData.description,
    onChange: handleImageChange,
    style: {
      marginTop: '0.25rem',
      display: 'block',
      width: '100%',
      borderRadius: '0.375rem',
      border: '1px solid #D1D5DB',
      padding: '0.5rem',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "file",
    style: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4B5563'
    }
  }, "Image File"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    id: "file",
    name: "file",
    accept: "image/*",
    onChange: handleImageChange,
    required: true,
    style: {
      marginTop: '0.25rem',
      display: 'block',
      width: '100%',
      fontSize: '0.875rem',
      color: '#6B7280',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      border: '1px solid transparent',
      backgroundColor: '#EFF6FF',
      cursor: 'pointer'
    }
  })))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: loading,
    style: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'white',
      backgroundColor: loading ? '#93C5FD' : '#2563EB',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.5 : 1
    }
  }, loading ? 'Uploading...' : 'Upload Image')));
} // const { enrollStudent, loadingEnrol, errorEnrol } = useEnrollStudent();

//   const fetchTrackedEntityInstances = useCallback(async (ouId: string) => {
//     if (!ouId) return;

//     setTeiLoading(true);
//     setTeiError(null);

//     try {
//       const { trackedEntityInstances } = await engine.query({
//         trackedEntityInstances: {
//           resource: 'trackedEntityInstances',
//           params: {
//             ou: ouId,
//             //program: 'NIDbTzjU8J8', 
//            //trackedEntityType:'W85ui9yO3vH',// Using the trackedEntityType from your XMLNIDbTzjU8J8
//             fields: 'trackedEntityInstance,attributes[attribute,code,value]',
//             paging: false
//           }
//         }
//       });

//       if (!trackedEntityInstances || !Array.isArray(trackedEntityInstances.trackedEntityInstances)) {
//         throw new Error('Invalid response structure from API');
//       }

//      const transformed = trackedEntityInstances.trackedEntityInstances.map((tei: TrackedEntityInstance) => {
//   const attributes = tei.attributes.reduce((acc: Record<string, string>, attr: TrackedEntityAttribute) => {
//     // Map attributes by their codes or attribute IDs from your system
//     if (attr.code === 'school') {
//       acc['school name'] = attr.value;
//     } else if (attr.attribute === 'AAhQa2QBdLb') { // First name
//       acc['fname'] = attr.value;
//     } else if (attr.attribute === 'jcNk3WUk6CF') { // Surname
//       acc['lname'] = attr.value;
//     } else if (attr.attribute === 'oU3liZI9qx6') { // Registration number
//       acc['regnumber'] = attr.value;
//     } else if (attr.attribute === 'ctwU8hvnyk9') { // Program of study
//       acc['program of study'] = attr.value;
//     } else if (attr.attribute === 'dA6No4FoYxI') { // Year of study
//       acc['year of study'] = attr.value;
//     } else if (attr.attribute === 'DicIdiy94P8') { // Nationality
//       acc['nationality'] = attr.value;
//     } else if (attr.attribute === 'N6NvXcYsRp8') { // Gender
//       acc['gender'] = attr.value;
//     } else if (attr.attribute === 'tzLYzIpqGiB') { // Date of birth
//       acc['dateOfBirth'] = attr.value;
//     } else if (attr.attribute === 'FtBP3ctaOfX') { // Enrollment date
//       acc['enroll_date'] = attr.value;
//     } else if (attr.attribute === 'sdV0Qc0puZX') { // Academic year
//       acc['academic year'] = attr.value;
//     } else if (attr.attribute === 'Es03r1AMOwQ') { // Guardian
//       acc['guardian'] = attr.value;
//     }
//     return acc;
//   }, {} as Record<string, string>);

//   return {
//     regNumber: attributes['regnumber'] || '',
//     firstName: attributes['fname'] || '',
//     surname: attributes['lname'] || '',
//     school: attributes['school name'] || selectedSchool,
//     programOfStudy: attributes['program of study'] || '',
//     yearOfStudy: attributes['year of study'] || '',
//     nationality: attributes['nationality'] || '',
//     gender: attributes['gender'] || '',
//     dateOfBirth: attributes['dateOfBirth'] || '',
//     enrollDate: attributes['enroll_date'] || '',
//     academicYear: attributes['academic year'] || '',
//     guardian: attributes['guardian'] || '',
//   };
// });
// console.log(trackedEntityInstances)
//       setEnrollments(transformed);
//     } catch (error) {
//       console.error('Error fetching tracked entity instances:', error);
//       setTeiError(error instanceof Error ? error : new Error('Failed to fetch student data'));
//       setEnrollments([]);
//     } finally {
//       setTeiLoading(false);
//     }
//   }, [engine, selectedSchool]);

// import React, { useEffect, useState, useCallback } from 'react';
// import './Attendance.css';
// import { useLocation } from 'react-router-dom';
// import { markAllAbsent, camera } from '../Attendance/hooks';

// const Attendance = () => {
//   const [sessions, setSessions] = useState([]);
//   const [currentSessionIds, setCurrentSessionIds] = useState([]);
//   const [viewingSessionId, setViewingSessionId] = useState(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('current');
//   const [refreshInterval, setRefreshInterval] = useState(20000);
//   const [cameraStarted, setCameraStarted] = useState(false);
//   const [networkError, setNetworkError] = useState(null);
//   const [failedSession, setFailedSession] = useState();
//   const [showDialog, setShowDialog] = useState(false);
//   const location = useLocation();
//   const {
//     courseName,
//     date,
//     room,
//     supervisorName,
//     startTime,
//     endTime,
//     students,
//     orgUnit
//   } = location.state || {};

//   const AB_END_POINT = 'https://facial-attendance-system-6vy8.onrender.com/attendance/mark-all-absent';
//   const CAMERA_START = 'https://facial-attendance-system-6vy8.onrender.com/face/recognize';
//   const SAVE_SESSION_ENDPOINT = 'https://facial-attendance-system-6vy8.onrender.com/attendance/create-new-coures';

//   // Get current sessions
//   const currentSessions = sessions.filter(session => currentSessionIds.includes(session.id));
//   // Get the session being viewed
//   const viewingSession = sessions.find(session => session.id === viewingSessionId);

//   // Save session to server
//   const saveSessionToServer = async (session) => {
//     try {
//       setIsLoading(true);

//       // Filter the data to only include what we want to send to the server
//       const filteredSession = {

//         // Only include the necessary metadata
//         metadata: {
//           room: session.metadata.room,
//           supervisor: session.metadata.supervisor,
//           examName: session.metadata.courseName,
//           date: session.metadata.date,
//           startTime: session.metadata.startTime,
//           endTime: session.metadata.endTime,
//           studentsIds: session.metadata.selectedStudents
//         }
//       };

//       const response = await fetch(SAVE_SESSION_ENDPOINT, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           "room": filteredSession.metadata.room,
//           "supervisor": filteredSession.metadata.supervisor,
//           "examName": filteredSession.metadata.examName,
//           "date": filteredSession.metadata.date,
//           "startTime": filteredSession.metadata.startTime,
//           "endTime": filteredSession.metadata.endTime,
//           "studentIds": filteredSession.metadata.studentsIds
//         }),
//       });

//       if (!response.ok) {
//         setShowDialog(true);
//       }

//       // const data = await response.json();
//       alert('Session saved successfully:');
//       return filteredSession;
//     } catch (err) {
//       alert('Error saving session:', err);
//       setError(`Failed to save session: ${err.message}`);
//       setShowDialog(true);

//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initialize a new session
//   const initNewSession = useCallback(async (sessionData) => {
//     try {
//       if (!courseName || !students) {
//         alert('Missing required session data');
//       }

//       const newSession = {
//         id: `session_${Date.now()}`,
//         examId: sessionData.examId,
//         examName: sessionData.examName || `Exam ${sessionData.examId}`,
//         startTime: new Date().toISOString(),
//         endTime: null,
//         students: [],
//         metadata: {
//           room: sessionData.room,
//           supervisor: sessionData.supervisor,
//           courseName: sessionData.course,
//           date: date,
//           startTime: startTime,
//           endTime: endTime,
//           orgUnit: orgUnit,
//           selectedStudents: students || []
//         }
//       };

//       setSessions(prev => [newSession, ...prev]);
//       setCurrentSessionIds(prev => [...prev, newSession.id]);
//       setActiveTab('current');
//       setViewingSessionId(null);
//       setError(null);

//       return newSession;
//     } catch (err) {
//       setError(`Failed to start session: ${err.message}`);
//       console.error('Error initializing session:', err);
//       alert('Failed to start session, check if you are connected to internet of exam data if not provided')
//     }
//   }, [courseName, date, endTime, orgUnit, startTime, students]);

//   // End a session
//   const endSession = async (sessionId) => {
//     try {
//       const sessionToEnd = sessions.find(s => s.id === sessionId);
//       if (!sessionToEnd) {
//         alert('Session not found');
//       }

//       const updatedSession = {
//         ...sessionToEnd,
//         endTime: new Date().toISOString()
//       };

//       // Update local state first
//       setSessions(prev => prev.map(s =>
//         s.id === sessionId ? updatedSession : s
//       ));
//       setCurrentSessionIds(prev => prev.filter(id => id !== sessionId));
//       setFailedSession(updatedSession)
//       // Save to server
//       await saveSessionToServer(updatedSession);
//       setError(null);
//     } catch (err) {
//       setError(`Failed to end session: ${err.message}`);
//       alert('Error ending session:', err);
//     }
//   };

//   // fetchAttendanceData function to replace the student list instead of appending
//   const fetchAttendanceData = useCallback(async (sessionId) => {
//     try {
//       const cameraCheck = camera(CAMERA_START, setCameraStarted);

//       const response = await fetch('https://facial-attendance-system-6vy8.onrender.com/attendance');
//       if (!response.ok) {
//         throw new Error('Failed to fetch attendance data');
//       }

//       const data = await response.json();
//       console.log('Attendance data fetched successfully:', data);

//       if (data && data.length > 0) {
//         setSessions(prev => prev.map(session => {
//           if (session.id === sessionId) {
//             // Create a new array of students with updated statuses
//             const updatedStudents = data
//               .filter(newStudent =>
//                 session.metadata.selectedStudents.includes(newStudent.registrationNumber)
//               )
//               .map(student => ({
//                 ...student,
//                 id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//                 timestamp: new Date().toISOString(),
//                 status: student.status
//               }));

//             return {
//               ...session,
//               students: updatedStudents // Replace the entire student list
//             };
//           }
//           return session;
//         }));
//       }
//     } catch (err) {
//       setError(`Failed to fetch attendance data: ${err.message}`);
//       console.error('Error fetching attendance data:', err);
//       setCurrentSessionIds(prev => prev.filter(id => id !== sessionId));
//     }
//   }, []);

//   // Modify the filterStudents function to handle cases where students might not be in the session yet
//   const filterStudents = (sessionStudents) => {
//     if (!students || !Array.isArray(students)) return [];

//     // Create a default list of all expected students with 'absent' status
//     const defaultStudents = students.map(regNumber => ({
//       registrationNumber: regNumber,
//       name: 'N/A',
//       status: 'absent',
//       timestamp: new Date().toISOString(),
//       id: `default_${regNumber}`
//     }));

//     // If no session students, return all as absent
//     if (!sessionStudents || sessionStudents.length === 0) {
//       return defaultStudents;
//     }

//     // Merge session students with default list to ensure all students are shown
//     const mergedStudents = defaultStudents.map(defaultStudent => {
//       const found = sessionStudents.find(s => s.registrationNumber === defaultStudent.registrationNumber);
//       return found || defaultStudent;
//     });

//     return mergedStudents;
//   };

//   // Poll attendance data for all active sessions
//   useEffect(() => {
//     const intervalIds = {};

//     currentSessionIds.forEach(sessionId => {
//       // Initial fetch
//       fetchAttendanceData(sessionId);
//       // Set up interval
//       intervalIds[sessionId] = setInterval(() => fetchAttendanceData(sessionId), refreshInterval);
//     });

//     return () => {
//       Object.values(intervalIds).forEach(intervalId => clearInterval(intervalId));
//     };
//   }, [currentSessionIds, fetchAttendanceData, refreshInterval]);

//   // Status badge component
//   const StatusBadge = ({ status }) => {
//     const statusClasses = {
//       present: 'status-badge present',
//       absent: 'status-badge absent',
//       late: 'status-badge late',
//       default: 'status-badge default'
//     };
//     const statusText = {
//       present: 'Present',
//       absent: 'Absent',
//       late: 'Late',
//       default: 'Unknown'
//     };
//     return (
//       <span className={statusClasses[status] || statusClasses.default}>
//         {statusText[status] || statusText.default}
//       </span>
//     );
//   };

//   const formatDateTime = (isoString) => {
//     if (!isoString) return 'N/A';
//     const date = new Date(isoString);
//     return date.toLocaleString();
//   };

//   const formatDuration = (start, end) => {
//     if (!start || !end) return 'N/A';
//     const minutes = Math.round((new Date(end) - new Date(start)) / 60000);
//     return `${minutes} mins`;
//   };

//   const retrySave = () => {
//     setShowDialog(false);
//     saveSessionToServer(failedSession);
//   };

//   const cancelSave = () => {
//     setShowDialog(false);
//     console.log('Save canceled');
//   };
//   return (

//     <div className="container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
//       <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//         <div>
//           <h1 className='h1' style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Attendance Monitoring</h1>
//           <p className='p' style={{ fontSize: '16px', color: '#666' }}>
//             {currentSessions.length > 0
//               ? `Tracking ${currentSessions.length} active session(s)`
//               : 'No active sessions'}
//           </p>
//         </div>
//         <div>
//           <button
//             onClick={async () => {
//               try {
//                 const data = await markAllAbsent(AB_END_POINT,setNetworkError);
//                 const newSession = await initNewSession({
//                   examId: courseName.replace(/\s+/g, '_') + '_' + Date.now(),
//                   examName: courseName,
//                   room: room,
//                   supervisor: supervisorName,
//                   course: courseName
//                 });
//                 console.log('New session started:', newSession);
//               } catch (err) {
//                 console.error('Error starting session:', err);
//               }
//             }}
//             className="start-session"
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#2ecc71',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               marginLeft: '10px'
//             }}
//             disabled={isLoading}
//             >
//             {networkError ? 'Connecting...' : 'Start New Session'}
//             </button>
//             <div className="camera-status-log" style={{
//             marginTop: '10px',
//             padding: '10px',
//             backgroundColor: '#f1f1f1',
//             borderRadius: '4px',
//             boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//             color: '#333',
//             fontSize: '14px'
//             }}>
//             <p style={{ margin: 0 }}>
//               Camera Status
//             </p>
//             <span style={{
//               color: cameraStarted ? '#2ecc71' : '#e74c3c',
//               fontWeight: 'bold'
//             }}>
//               {cameraStarted ? 'Connected' : 'Disconnected'}
//             </span>
//             </div>
//           </div>
//           </div>

//           {error && (
//           <div className="error-message" style={{
//             marginBottom: '20px',
//             padding: '10px',
//             backgroundColor: '#f8d7da',
//             color: '#721c24',
//             borderRadius: '4px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}>
//             <span className='span'>{error}</span>
//             <button
//             onClick={() => setError(null)}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: '#721c24',
//               cursor: 'pointer',
//               fontSize: '16px'
//             }}
//             >
//             ×
//             </button>
//           </div>
//           )}

//           <div className="tab-navigation" style={{ display: 'flex', marginBottom: '20px' }}>
//           <button
//             onClick={() => {
//             setActiveTab('current');
//             setViewingSessionId(null);
//           }}
//           className={activeTab === 'current' ? 'active' : ''}
//           style={{
//             flex: 1,
//             padding: '10px',
//             backgroundColor: activeTab === 'current' ? '#3498db' : '#ecf0f1',
//             color: activeTab === 'current' ? '#fff' : '#333',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             marginRight: '10px'
//           }}
//         >
//           Current Sessions
//         </button>
//         <button
//           onClick={() => setActiveTab('history')}
//           className={activeTab === 'history' ? 'active' : ''}
//           style={{
//             flex: 1,
//             padding: '10px',
//             backgroundColor: activeTab === 'history' ? '#3498db' : '#ecf0f1',
//             color: activeTab === 'history' ? '#fff' : '#333',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           Session History
//         </button>
//       </div>

//       {activeTab === 'current' && (
//         <div className="current-sessions-container">
//           {currentSessions.length > 0 ? (
//             currentSessions.map(session => (
//               <div key={session.id} className="current-session" style={{
//                 marginBottom: '30px',
//                 padding: '20px',
//                 backgroundColor: '#fff',
//                 borderRadius: '8px',
//                 boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                 position: 'relative'
//               }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <div>
//                     <h2 className='h2' style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
//                       {session.examName}
//                     </h2>
//                     <div className="session-meta" style={{ marginBottom: '20px' }}>
//                       <p className='p' style={{ fontSize: '16px', color: '#666' }}>Room: {session.metadata.room}</p>
//                       <p className='p' style={{ fontSize: '16px', color: '#666' }}>Supervisor: {session.metadata.supervisor}</p>
//                       <p className='p' style={{ fontSize: '16px', color: '#666' }}>Started: {formatDateTime(session.startTime)}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => endSession(session.id)}
//                     className="end-session"
//                     style={{
//                       padding: '10px 20px',
//                       backgroundColor: '#e74c3c',
//                       color: '#fff',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       alignSelf: 'flex-start'
//                     }}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? 'Ending...' : 'End Session'}
//                   </button>
//                 </div>

//                 <div className="attendance-table" style={{ overflowX: 'auto' }}>
//                   <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
//                     <thead className='thead' style={{ backgroundColor: '#3498db', color: '#fff' }}>
//                       <tr className='tr'>
//                         <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Student ID</th>
//                         <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Name</th>
//                         <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Status</th>
//                         <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Time Recorded</th>
//                       </tr>
//                     </thead>
//                     <tbody className='tbody'>
//                       {filterStudents(session.students).length > 0 ? (
//                         filterStudents(session.students).map(student => (
//                           <tr className='tr' key={student.id} style={{ borderBottom: '1px solid #ddd' }}>
//                             <td className='td' style={{ padding: '10px' }}>{student.registrationNumber}</td>
//                             <td className='td' style={{ padding: '10px' }}>{student.name || 'N/A'}</td>
//                             <td className='td' style={{ padding: '10px' }}><StatusBadge status={student.status} /></td>
//                             <td className='td' style={{ padding: '10px' }}>{formatDateTime(student.timestamp)}</td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr className='tr'>
//                           <td className='td' colSpan="4" style={{ padding: '10px', textAlign: 'center', color: '#666' }}>No attendance records yet</td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="no-sessions" style={{
//               padding: '20px',
//               backgroundColor: '#fff',
//               borderRadius: '8px',
//               boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//               textAlign: 'center',
//               color: '#666'
//             }}>
//               No active sessions. Click "Start New Session" to begin.
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === 'history' && (
//         <div className="session-history" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
//           <table className="sessions-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead className='thead' style={{ backgroundColor: '#3498db', color: '#fff' }}>
//               <tr className='tr'>
//                 <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Exam</th>
//                 <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Course</th>
//                 <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Date</th>
//                 <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Duration</th>
//                 <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Students</th>
//                 <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Status</th>
//                 <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody className='tbody'>
//               {sessions.filter(s => !currentSessionIds.includes(s.id)).length > 0 ? (
//                 sessions.filter(s => !currentSessionIds.includes(s.id)).map((session) => (
//                   <React.Fragment key={session.id}>
//                     <tr className='tr' style={{ borderBottom: '1px solid #ddd' }}>
//                       <td className='td' style={{ padding: '10px' }}>{session.examName}</td>
//                       <td className='td' style={{ padding: '10px' }}>{session.metadata.course || 'N/A'}</td>
//                       <td className='td' style={{ padding: '10px' }}>{session.metadata.date || 'N/A'}</td>
//                       <td className='td' style={{ padding: '10px' }}>
//                         {formatDuration(session.startTime, session.endTime)}
//                       </td>
//                       <td className='td' style={{ padding: '10px' }}>{filterStudents(session.students).length}</td>
//                       <td className='td' style={{ padding: '10px' }}>{session.endTime ? 'Completed' : 'Active'}</td>
//                       <td className='td' style={{ padding: '10px' }}>
//                         <button
//                           className='button'
//                           onClick={() => setViewingSessionId(session.id)}
//                           style={{
//                             padding: '5px 10px',
//                             backgroundColor: '#3498db',
//                             color: '#fff',
//                             border: 'none',
//                             borderRadius: '4px',
//                             cursor: 'pointer'
//                           }}
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                     {viewingSessionId === session.id && (
//                       <tr className='tr'>
//                         <td className='td' colSpan="7" style={{ padding: '10px' }}>
//                           <div className="session-details" style={{ padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
//                             <h4 className='h4' style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
//                               Attendance Details for {session.examName}
//                             </h4>
//                             <div style={{ marginBottom: '15px' }}>
//                               <p><strong>Room:</strong> {session.metadata.room}</p>
//                               <p><strong>Supervisor:</strong> {session.metadata.supervisor}</p>
//                               <p><strong>Start Time:</strong> {formatDateTime(session.startTime)}</p>
//                               <p><strong>End Time:</strong> {formatDateTime(session.endTime)}</p>
//                               <p><strong>Duration:</strong> {formatDuration(session.startTime, session.endTime)}</p>
//                             </div>
//                             <table className="student-details-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
//                               <thead className='thead' style={{ backgroundColor: '#3498db', color: '#fff' }}>
//                                 <tr className='tr'>
//                                   <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Student ID</th>
//                                   <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Name</th>
//                                   <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Status</th>
//                                   <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Time Recorded</th>
//                                 </tr>
//                               </thead>
//                               <tbody className='tbody'>
//                                 {filterStudents(session.students).length > 0 ? (
//                                   filterStudents(session.students).map((student) => (
//                                     <tr className='tr' key={student.id} style={{ borderBottom: '1px solid #ddd' }}>
//                                       <td className='td' style={{ padding: '10px' }}>{student.registrationNumber}</td>
//                                       <td className='td' style={{ padding: '10px' }}>{student.name || 'N/A'}</td>
//                                       <td className='td' style={{ padding: '10px' }}><StatusBadge status={student.status} /></td>
//                                       <td className='td' style={{ padding: '10px' }}>{formatDateTime(student.timestamp)}</td>
//                                     </tr>
//                                   ))
//                                 ) : (
//                                   <tr className='tr'>
//                                     <td className='td' colSpan="4" style={{ padding: '10px', textAlign: 'center', color: '#666' }}>No attendance records</td>
//                                   </tr>
//                                 )}
//                               </tbody>
//                             </table>
//                             <button
//                               onClick={() => setViewingSessionId(null)}
//                               className="close-details"
//                               style={{
//                                 padding: '10px 20px',
//                                 backgroundColor: '#e74c3c',
//                                 color: '#fff',
//                                 border: 'none',
//                                 borderRadius: '4px',
//                                 cursor: 'pointer',
//                                 marginTop: '10px'
//                               }}
//                             >
//                               Close Details
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))
//               ) : (
//                 <tr className='tr'>
//                   <td className='td' colSpan="7" style={{ padding: '10px', textAlign: 'center', color: '#666' }}>No completed sessions available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )} 
//       {showDialog && (
//         <div className="container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
//           {/* Other content remains unchanged */}

//           {showDialog && (
//             <div
//               className="dialog-overlay"
//               style={{
//                 position: 'fixed',
//                 top: 0,
//                 left: 0,
//                 width: '100%',
//                 height: '100%',
//                 backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 zIndex: 1000,
//               }}
//             >
//               <div
//                 className="dialog-box"
//                 style={{
//                   backgroundColor: '#fff',
//                   padding: '20px',
//                   borderRadius: '8px',
//                   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//                   width: '400px',
//                   maxWidth: '90%',
//                   textAlign: 'center',
//                 }}
//               >
//                 <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
//                   Save Failed
//                 </h2>
//                 <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
//                   There was an issue saving the session. Would you like to retry?
//                 </p>
//                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <button
//                     onClick={retrySave}
//                     style={{
//                       padding: '10px 20px',
//                       backgroundColor: '#3498db',
//                       color: '#fff',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       marginRight: '10px',
//                     }}
//                   >
//                     Retry
//                   </button>
//                   <button
//                     onClick={cancelSave}
//                     style={{
//                       padding: '10px 20px',
//                       backgroundColor: '#e74c3c',
//                       color: '#fff',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Attendance;