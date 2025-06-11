import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './report.css';
import CourseDisplay from './displayCourse'; // Adjust the import path as necessary
const Report = () => {
  const location = useLocation();
  const {
    exam
  } = location.state || {};
  const [showStudents, setShowStudents] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingHistory(true);
      try {
        const response = await fetch('https://facial-attendance-system-6vy8.onrender.com/attendance/getAllCourses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        // Handle both single exam and array of exams
        setStudents(Array.isArray(data) ? data : [data]);
        setLoadingHistory(false);
      } catch (error) {
        setExams([]);
        console.error('Error fetching courses:', error);
        setLoadingHistory(false);
      }
    };
    fetchCourses();
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
    // Reset showStudents when exam changes
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
  }, "Students for ", exam.examName, " "), /*#__PURE__*/React.createElement("p", null, "Total : ", exam.students.length)), /*#__PURE__*/React.createElement("div", {
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
  }, student.status))))))))));
};
export default Report;