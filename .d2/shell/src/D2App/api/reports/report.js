import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './report.css';
//import { FaUsers, FaClock, FaCalendarAlt, FaBook, FaHome, FaUser, FaTimes } from 'react-icons/fa';

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
    }, /*#__PURE__*/React.createElement("h2", null, "No Exam Data Available"), /*#__PURE__*/React.createElement("p", null, "Please select an exam from the exam list to view its report.")));
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
    style: styles.container
  }, /*#__PURE__*/React.createElement(FilterCard, {
    organisationUnits: organisationUnits,
    handleSchoolChange: handleSchoolChange
  }), /*#__PURE__*/React.createElement(Instructions, null));
};

// FilterCard Component
const FilterCard = _ref => {
  let {
    organisationUnits,
    handleSchoolChange
  } = _ref;
  return /*#__PURE__*/React.createElement("div", {
    className: "filter-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-bar"
  }, /*#__PURE__*/React.createElement("label", null, "School", /*#__PURE__*/React.createElement("select", {
    onChange: handleSchoolChange
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select a school"), organisationUnits.map(school => /*#__PURE__*/React.createElement("option", {
    key: school.id,
    value: school.displayName
  }, school.displayName)))), /*#__PURE__*/React.createElement("label", null, "Grade", /*#__PURE__*/React.createElement("select", null, /*#__PURE__*/React.createElement("option", null, "Select a year"), [1, 2, 3, 4, 5].map(grade => /*#__PURE__*/React.createElement("option", {
    key: grade
  }, grade)))), /*#__PURE__*/React.createElement("label", null, "Program", /*#__PURE__*/React.createElement("select", null, /*#__PURE__*/React.createElement("option", null, "Program of Study"), ['Computer Science', 'Statistics', 'Political Science', 'Bachelor of Arts', 'Information System'].map(program => /*#__PURE__*/React.createElement("option", {
    key: program
  }, program)))), /*#__PURE__*/React.createElement("div", {
    className: "academic-year"
  }, /*#__PURE__*/React.createElement("span", null, "Academic Year"), /*#__PURE__*/React.createElement("span", {
    className: "year"
  }, "2025"))));
};

// Instructions Component
const Instructions = () => /*#__PURE__*/React.createElement("div", {
  className: "instructions-container",
  style: styles.instructionsContainer
}, /*#__PURE__*/React.createElement("div", {
  className: "instructions-box",
  style: styles.instructionsBox
}, /*#__PURE__*/React.createElement("h3", null, "SEMIS-Report"), /*#__PURE__*/React.createElement("p", null, "Follow the instructions to proceed:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Select the Organization unit you want to view the Report for"), /*#__PURE__*/React.createElement("li", null, "Use global filters (Class, Grade, and Academic Year)"))));

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  instructionsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  },
  instructionsBox: {
    width: '600px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'left'
  }
};