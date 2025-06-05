// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import './report.css';
// //import { FaUsers, FaClock, FaCalendarAlt, FaBook, FaHome, FaUser, FaTimes } from 'react-icons/fa';

// const Report = () => {
//     const location = useLocation();
//     const { exam } = location.state || {};
//     const [showStudents, setShowStudents] = useState(false);

//     const allStudents = [
//         { Name: "Plaston Zanda", RegNumber: "bed-com-10-20" },
//         { Name: "John Banda", RegNumber: "bed-com-11-20" },
//         { Name: "Jane Phiri", RegNumber: "bed-com-13-20" },
//         { Name: "Michael Sata", RegNumber: "bed-com-14-20" },
//         { Name: "Edgar Lungu", RegNumber: "bed-com-15-20" },
//     ];

//     if (!exam) {
//         return (
//             <div className="no-data-container">
//                 <div className="no-data-card">
//                     <h2>No Exam Data Available</h2>
//                     <p>Please select an exam from the exam list to view its report.</p>
//                 </div>
//             </div>
//         );
//     }

//     const handleViewAllClick = () => {
//         setShowStudents(!showStudents);
//     };

//     const formatDate = (dateString) => {
//         const options = { year: 'numeric', month: 'long', day: 'numeric' };
//         return new Date(dateString).toLocaleDateString('en-US', options);
//     };

//     return (
//         <div className="report-container">
//             <div className="report-header">
//                 <h1>Exam Report</h1>
//                 <div className="exam-meta">
//                     <span className="exam-course">{exam.courseName}</span>
//                     <span className="exam-date">{formatDate(exam.date)}</span>
//                 </div>
//             </div>

//             <div className="exam-details-grid">
//                 <div className="detail-card">
//                     <div>
//                         <h3>Course</h3>
//                         <p>{exam.courseName}</p>
//                     </div>
//                 </div>

//                 <div className="detail-card">
//                     <div>
//                         <h3>Date</h3>
//                         <p>{formatDate(exam.date)}</p>
//                     </div>
//                 </div>

//                 <div className="detail-card">
//                     <div>
//                         <h3>Supervisor</h3>
//                         <p>{exam.supervisorName}</p>
//                     </div>
//                 </div>

//                 <div className="detail-card">
//                     <div>
//                         <h3>Time</h3>
//                         <p>{exam.startTime} - {exam.endTime}</p>
//                     </div>
//                 </div>

//                 <div className="detail-card">
//                     <div>
//                         <h3>Room</h3>
//                         <p>{exam.room}</p>
//                     </div>
//                 </div>

//                 <div className="detail-card students-card" onClick={handleViewAllClick}>
//                     <div>
//                         <h3>Students</h3>
//                         <p>{allStudents.length} enrolled</p>
//                         <button className="view-students-btn">
//                             {showStudents ? "Hide List" : "View All"}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {showStudents && (
//                 <div className="modal-overlay">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h2>
//                                  Students for {exam.courseName}
//                             </h2>
//                             <button className="close-modal" onClick={handleViewAllClick}>
                                
//                             </button>
//                         </div>

//                         <div className="students-table-container">
//                             <table className="students-table">
//                                 <thead>
//                                     <tr>
//                                         <th>#</th>
//                                         <th>Name</th>
//                                         <th>Registration Number</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {allStudents.map((student, index) => (
//                                         <tr key={index}>
//                                             <td>{index + 1}</td>
//                                             <td>{student.Name}</td>
//                                             <td>{student.RegNumber}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         <div className="modal-footer">
//                             <p>Total students: {allStudents.length}</p>
//                             <button className="close-btn" onClick={handleViewAllClick}>
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Report;

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './report.css';
// import useFetchEvents  from '../../hooks/api-calls/dataMutate'; // Adjust the import path as necessary
// import { useEnrolledStudents } from '../../hooks/api-calls/apis'; // Adjust the import path as necessary

import { handleRegisterEvent } from '../../hooks/api-calls/dataMutate'; // Adjust the import path as necessary

const Report = () => {
    const location = useLocation();
    const { exam } = location.state || {};
    const [showStudents, setShowStudents] = useState(false);
    // const { events } = useFetchEvents("jV19pSjiueH"); // Fetch events based on the exam's program ID
    // const { students } = useEnrolledStudents("TLvAWiCKRgq", "T23eGPkA0nc"); // Fetch enrolled students based on the program ID and org unit ID
   const  [loading, setLoading] = useState(false);
    // const { handleRegisterEvent, loading, error } = useExampleFunction();
    const allStudents = [
        { Name: "Plaston Zanda", RegNumber: "bed-com-10-20" },
        { Name: "John Banda", RegNumber: "bed-com-11-20" },
        { Name: "Jane Phiri", RegNumber: "bed-com-13-20" },
        { Name: "Michael Sata", RegNumber: "bed-com-14-20" },
        { Name: "Edgar Lungu", RegNumber: "bed-com-15-20" },
    ];

    if (!exam) {
        return (
            <div className="no-data-container">
                <div className="no-data-card">
                    <h2 style={{ color: 'black' }}>No Exam Data Available</h2>
                    <p>Please select an exam from the exam list to view its report.</p>
                </div>
            </div>
        );
    }

    const handleViewAllClick = () => {
        setShowStudents(!showStudents);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // useEffect(() => {
       
    //     console.log(events) 
    //     console.log(students);
    // }, [events])
    
    const onClickRegister = () => {
        setLoading(true);
        handleRegisterEvent(); // Call when needed, e.g., on a button click
        setLoading(false);
    };
    return (
        <div className="report-container">
            <div className="report-header">
                <h1 style={{ color: 'black' }}
                >Exam Report Summary</h1>
                <div className="exam-meta">
                    <span className="exam-course" style={{ color: 'black' }} >{exam.courseName}</span>
                    <span className="exam-date" style={{ color: 'black' }} >{formatDate(exam.date)}</span>
                </div>
            </div>

            <div className="exam-details-grid">
                {/* <div className="detail-card">
          <h3>Course</h3>
          <p>{exam.courseName}</p>
        </div>
        <div className="detail-card">
          <h3>Date</h3>
          <p>{formatDate(exam.date)}</p>
        </div> */}
                <div className="detail-card">
                    <h3>Supervisor</h3>
                    <p>{exam.supervisorName}</p>
                </div>
                <div className="detail-card">
                    <h3>Time</h3>
                    <p>{exam.startTime} - {exam.endTime}</p>
                </div>
                <div className="detail-card">
                    <h3>Room</h3>
                    <p>{exam.room}</p>
                </div>
                <div className="detail-card students-card" onClick={handleViewAllClick}>
                    <h3>Students</h3>
                    {/* <p>{allStudents.length} enrolled</p> */}
                    <button className="view-students-btn">
                        {showStudents ? "Hide List" : "List All"}
                    </button>
                </div>
            </div>

            {showStudents && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 style={{ color: 'black' }} >Students for {exam.courseName}</h2>
                            {/* <button className="close-modal" onClick={handleViewAllClick}>
                Close
              </button> */}
                        </div>
                        <div className="students-table-container">
                            <table className="students-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Registration Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allStudents.map((student, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{student.Name}</td>
                                            <td>{student.RegNumber}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <p>Total students: {allStudents.length}</p>
                            <button className="close-btn" onClick={handleViewAllClick}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h2>Register Event</h2>
            <button onClick={onClickRegister} disabled={loading}>
                {loading ? 'Registering...' : 'Register Event'}
            </button>
            {/* {error && <p style={{ color: 'red' }}>Error: {error.message}</p>} */}
        </div>
    );
};

export default Report;