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
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('https://facial-attendance-system-6vy8.onrender.com/attendance/getAllCourses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        // Handle both single exam and array of exams
        setStudents(Array.isArray(data) ? data : [data]);
      } catch (error) {
        setExams([]);
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);
  if (!exam) {
    return (
      /*#__PURE__*/
      // <div className="no-data-container">
      //     <div className="no-data-card">
      //         <h2 style={{ color: 'black' }}>No Exam Data Available</h2>
      //         <p>Please select an exam from the exam list to view its report.</p>
      //     </div>
      // </div>
      React.createElement(CourseDisplay, {
        courses: students
      })
    );
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
  }, /*#__PURE__*/React.createElement("td", null, index + 1), /*#__PURE__*/React.createElement("td", null, student.name), /*#__PURE__*/React.createElement("td", null, student.registrationNumber), /*#__PURE__*/React.createElement("td", {
    className: student.status === 'Absent' ? 'status-absent' : 'status-present',
    style: {
      color: student.status === 'Absent' ? 'green' : 'red'
    }
  }, /*#__PURE__*/React.createElement("p", null, student.status))))))))));
};
export default Report;