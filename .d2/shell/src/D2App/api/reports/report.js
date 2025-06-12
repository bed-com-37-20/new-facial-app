import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './report.css';
import CourseDisplay from './displayCourse';
const Report = () => {
  const location = useLocation();
  const {
    exam
  } = location.state || {};
  const [showStudents, setShowStudents] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Fetch courses from local storage instead of API
  useEffect(() => {
    const fetchCoursesFromLocalStorage = () => {
      setLoadingHistory(true);
      try {
        const storedSessions = JSON.parse(localStorage.getItem('attendanceSessions') || '[]');

        // Transform the stored sessions to match the expected format
        const formattedCourses = storedSessions.map(session => ({
          id: session.id,
          examName: session.metadata.courseName,
          date: session.metadata.date,
          startTime: session.metadata.startTime,
          endTime: session.metadata.endTime,
          room: session.metadata.room,
          supervisor: session.metadata.supervisor,
          students: session.students.length > 0 ? session.students.map(student => ({
            name: student.name || 'N/A',
            registrationNumber: student.registrationNumber,
            status: student.status
          })) : session.metadata.selectedStudents.map(regNumber => ({
            name: 'N/A',
            registrationNumber: regNumber,
            status: 'absent'
          }))
        }));
        setStudents(formattedCourses);
        setLoadingHistory(false);
      } catch (error) {
        console.error('Error loading courses from local storage:', error);
        setStudents([]);
        setLoadingHistory(false);
      }
    };
    fetchCoursesFromLocalStorage();
  }, []);
  if (!exam) {
    if (loadingHistory) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100px',
          gap: '10px',
          marginTop: '25%'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          animation: 'spin 1s linear infinite'
        }
      }), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: '18px',
          color: '#3498db',
          textAlign: 'center',
          margin: 0
        }
      }, "Loading..."));
    }
    return /*#__PURE__*/React.createElement(CourseDisplay, {
      courses: students
    });
  }
  const handleViewAllClick = () => {
    setShowStudents(!showStudents);
  };
  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  useEffect(() => {
    console.log("Exam changed:", exam);
  }, [exam]);
  return /*#__PURE__*/React.createElement("div", {
    className: "report-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "report-header"
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      color: 'black'
    }
  }, "Exam Report Summary"), /*#__PURE__*/React.createElement("div", {
    className: "exam-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "exam-course",
    style: {
      color: 'black'
    }
  }, exam.examName), /*#__PURE__*/React.createElement("span", {
    className: "exam-date",
    style: {
      color: 'black'
    }
  }, formatDate(exam.date)))), /*#__PURE__*/React.createElement("div", {
    className: "exam-details-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail-card"
  }, /*#__PURE__*/React.createElement("h3", null, "Supervisor"), /*#__PURE__*/React.createElement("p", null, exam.supervisor)), /*#__PURE__*/React.createElement("div", {
    className: "detail-card"
  }, /*#__PURE__*/React.createElement("h3", null, "Time"), /*#__PURE__*/React.createElement("p", null, exam.startTime, " - ", exam.endTime)), /*#__PURE__*/React.createElement("div", {
    className: "detail-card"
  }, /*#__PURE__*/React.createElement("h3", null, "Room"), /*#__PURE__*/React.createElement("p", null, exam.room))), /*#__PURE__*/React.createElement("div", {
    className: "fulltable"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: 'black'
    }
  }, "Students for ", exam.examName), /*#__PURE__*/React.createElement("p", null, "Total : ", exam.students.length)), /*#__PURE__*/React.createElement("div", {
    className: "students-table-container"
  }, /*#__PURE__*/React.createElement("table", {
    className: "students-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Registration Number"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, exam.students.map((student, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontSize: "18px"
    }
  }, index + 1), /*#__PURE__*/React.createElement("td", {
    style: {
      fontSize: "18px"
    }
  }, student.name), /*#__PURE__*/React.createElement("td", {
    style: {
      fontSize: "18px"
    }
  }, student.registrationNumber), /*#__PURE__*/React.createElement("td", {
    style: {
      color: student.status === 'absent' ? 'red' : 'green'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "18px"
    }
  }, student.status))))))))), showSuccessAlert && /*#__PURE__*/React.createElement("div", {
    className: "success-alert"
  }, "Exam created successfully for students!"));
};
export default Report;