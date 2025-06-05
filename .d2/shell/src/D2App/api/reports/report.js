import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './report.css';

const Report = () => {
  const location = useLocation();
  const { exam } = location.state || {};
  const [showStudents, setShowStudents] = useState(false);

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
          <h2>No Exam Data Available</h2>
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

  return (
    <div className="report-container">
      <div className="report-header">
        <h1 style={{ color: 'black' }} 
        >Exam Report Summary</h1>
        <div className="exam-meta">
          <span className="exam-course" style={{color: 'black'}} >{exam.courseName}</span>
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
              <h2 style ={{color: 'black'}} >Students for {exam.courseName}</h2>
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
    </div>
  );
};

export default Report;