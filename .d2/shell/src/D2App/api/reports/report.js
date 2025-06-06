import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './report.css';
const Report = () => {
  const location = useLocation();
  const {
    exam
  } = location.state || {};
  const [showStudents, setShowStudents] = useState(false);
  const allStudents = [{
    Name: "Plaston Zanda",
    RegNumber: "bed-com-10-20"
  }, {
    Name: "John Banda",
    RegNumber: "bed-com-11-20"
  }, {
    Name: "Jane Phiri",
    RegNumber: "bed-com-13-20"
  }, {
    Name: "Michael Sata",
    RegNumber: "bed-com-14-20"
  }, {
    Name: "Edgar Lungu",
    RegNumber: "bed-com-15-20"
  }];
  if (!exam) {
    return /*#__PURE__*/React.createElement("div", {
      className: "no-data-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "no-data-card"
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        color: 'black'
      }
    }, "No Exam Data Available"), /*#__PURE__*/React.createElement("p", null, "Please select an exam from the exam list to view its report.")));
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
  }, exam.courseName), /*#__PURE__*/React.createElement("span", {
    className: "exam-date",
    style: {
      color: 'black'
    }
  }, formatDate(exam.date)))), /*#__PURE__*/React.createElement("div", {
    className: "exam-details-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail-card"
  }, /*#__PURE__*/React.createElement("h3", null, "Supervisor"), /*#__PURE__*/React.createElement("p", null, exam.supervisorName)), /*#__PURE__*/React.createElement("div", {
    className: "detail-card"
  }, /*#__PURE__*/React.createElement("h3", null, "Time"), /*#__PURE__*/React.createElement("p", null, exam.startTime, " - ", exam.endTime)), /*#__PURE__*/React.createElement("div", {
    className: "detail-card"
  }, /*#__PURE__*/React.createElement("h3", null, "Room"), /*#__PURE__*/React.createElement("p", null, exam.room)), /*#__PURE__*/React.createElement("div", {
    className: "detail-card students-card",
    onClick: handleViewAllClick
  }, /*#__PURE__*/React.createElement("h3", null, "Students"), /*#__PURE__*/React.createElement("button", {
    className: "view-students-btn"
  }, showStudents ? "Hide List" : "List All"))), showStudents && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: 'black'
    }
  }, "Students for ", exam.courseName)), /*#__PURE__*/React.createElement("div", {
    className: "students-table-container"
  }, /*#__PURE__*/React.createElement("table", {
    className: "students-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Registration Number"))), /*#__PURE__*/React.createElement("tbody", null, allStudents.map((student, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", null, index + 1), /*#__PURE__*/React.createElement("td", null, student.Name), /*#__PURE__*/React.createElement("td", null, student.RegNumber)))))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("p", null, "Total students: ", allStudents.length), /*#__PURE__*/React.createElement("button", {
    className: "close-btn",
    onClick: handleViewAllClick
  }, "Close")))));
};
export default Report;