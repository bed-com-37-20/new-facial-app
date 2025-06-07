import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import { Divider } from '@material-ui/core';
import './exam.css';
const ORG_UNITS_QUERY = {
  orgUnits: {
    resource: 'organisationUnits',
    params: {
      paging: false,
      fields: 'id,name,level',
      order: 'level:asc,name:asc'
    }
  }
};
const STUDENTS_QUERY = {
  students: {
    resource: 'trackedEntityInstances',
    params: _ref => {
      let {
        orgUnitId
      } = _ref;
      return {
        ou: orgUnitId
      };
    }
  }
};
const NewExam = () => {
  var _orgUnitData$orgUnits, _studentData$students;
  const [filter, setFilter] = useState('');
  const [exams] = useState([{
    id: 1,
    courseName: 'SCE 421',
    date: '2023-10-01',
    room: '101',
    supervisorName: 'Joshua Judge',
    startTime: '09:00',
    endTime: '11:00'
  }, {
    id: 2,
    courseName: 'COM 211',
    date: '2023-09-15',
    room: '202',
    supervisorName: 'Isaac Mwakabila',
    startTime: '10:00',
    endTime: '12:00'
  }, {
    id: 3,
    courseName: 'MAT 211',
    date: '2023-08-20',
    room: '303',
    supervisorName: 'Alice Namagale',
    startTime: '13:00',
    endTime: '15:00'
  }]);
  const [newExam, setNewExam] = useState({
    courseName: '',
    date: '',
    room: '',
    supervisorName: '',
    startTime: '',
    endTime: ''
  });
  const [selectedOrgUnit, setSelectedOrgUnit] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showStudentSelection, setShowStudentSelection] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();
  const {
    data: orgUnitData
  } = useDataQuery(ORG_UNITS_QUERY);
  const {
    data: studentData,
    refetch: refetchStudents
  } = useDataQuery(STUDENTS_QUERY, {
    lazy: true,
    variables: {
      orgUnitId: selectedOrgUnit
    }
  });
  useEffect(() => {
    if (selectedOrgUnit) {
      refetchStudents({
        orgUnitId: selectedOrgUnit
      });
    }
  }, [selectedOrgUnit, refetchStudents]);
  const orgUnits = (orgUnitData === null || orgUnitData === void 0 ? void 0 : (_orgUnitData$orgUnits = orgUnitData.orgUnits) === null || _orgUnitData$orgUnits === void 0 ? void 0 : _orgUnitData$orgUnits.organisationUnits) || [];
  const students = (studentData === null || studentData === void 0 ? void 0 : (_studentData$students = studentData.students) === null || _studentData$students === void 0 ? void 0 : _studentData$students.trackedEntityInstances) || [];
  const filteredExams = exams.filter(exam => exam.courseName.toLowerCase().includes(filter.toLowerCase()) || exam.date.includes(filter));
  const filteredStudents = students.filter(student => {
    var _student$attributes$f, _student$attributes$f2, _student$attributes$f3, _student$attributes$f4;
    const firstName = ((_student$attributes$f = student.attributes.find(attr => attr.code === 'fname')) === null || _student$attributes$f === void 0 ? void 0 : _student$attributes$f.value) || '';
    const lastName = ((_student$attributes$f2 = student.attributes.find(attr => attr.code === 'lname')) === null || _student$attributes$f2 === void 0 ? void 0 : _student$attributes$f2.value) || '';
    const program = ((_student$attributes$f3 = student.attributes.find(attr => attr.code === 'program of study')) === null || _student$attributes$f3 === void 0 ? void 0 : _student$attributes$f3.value) || '';
    const regNumber = ((_student$attributes$f4 = student.attributes.find(attr => attr.code === 'regnumber')) === null || _student$attributes$f4 === void 0 ? void 0 : _student$attributes$f4.value) || '';
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    return fullName.includes(searchLower) || program.toLowerCase().includes(searchLower) || regNumber.toLowerCase().includes(searchLower);
  });
  const handleCreateExam = () => {
    navigate('/api/examPage/ExamForm');
  };
  const handleFinalSubmit = () => {
    const examData = {
      ...newExam,
      students: selectedStudents,
      orgUnit: selectedOrgUnit
    };
    console.log('Final Exam Data:', examData);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 2000);
  };
  const handleSelectStudent = studentId => {
    setSelectedStudents(prev => prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]);
  };
  const handleSelectAll = (studentIds, select) => {
    setSelectedStudents(prev => select ? [...new Set([...prev, ...studentIds])] : prev.filter(id => !studentIds.includes(id)));
  };
  const handleOrgUnitChange = e => {
    setSelectedOrgUnit(e.target.value);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "exam-container"
  }, !showStudentSelection ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React.createElement("h1", null, "Exam Summary"), /*#__PURE__*/React.createElement("div", {
    className: "search-box"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search by course name or date...",
    value: filter,
    onChange: e => setFilter(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary-btn",
    onClick: handleCreateExam
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "currentColor",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
  })), "New"))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("p", null, "Below is a summary of past exams. You can view details or create a new exam using the options provided."), /*#__PURE__*/React.createElement("div", {
    className: "card-container"
  }, filteredExams.length > 0 ? filteredExams.map(exam => /*#__PURE__*/React.createElement("div", {
    key: exam.id,
    className: "exam-card"
  }, /*#__PURE__*/React.createElement("h3", null, exam.courseName), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("p", {
    className: "p1"
  }, /*#__PURE__*/React.createElement("strong", null, "Date:"), ' ', new Date(exam.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })), /*#__PURE__*/React.createElement("p", {
    className: "p1"
  }, /*#__PURE__*/React.createElement("strong", null, "Room:"), " ", exam.room), /*#__PURE__*/React.createElement("p", {
    className: "p1"
  }, /*#__PURE__*/React.createElement("strong", null, "Supervisor:"), " ", exam.supervisorName), /*#__PURE__*/React.createElement("p", {
    className: "p"
  }, /*#__PURE__*/React.createElement("strong", null, "Time:"), " ", exam.startTime, " - ", exam.endTime)), /*#__PURE__*/React.createElement("button", {
    className: "secondary-btn",
    onClick: () => navigate('/api/reports/report', {
      state: {
        exam
      }
    })
  }, "View"))) : /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, "No exams found.")), showSuccessAlert && /*#__PURE__*/React.createElement("div", {
    className: "success-alert"
  }, "Exam created successfully for ", selectedStudents.length, " students!")) : /*#__PURE__*/React.createElement("div", {
    className: "student-selection"
  }, /*#__PURE__*/React.createElement("h2", null, "Select Students"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search students...",
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "student-list"
  }, filteredStudents.map(student => {
    var _student$attributes$f5, _student$attributes$f6;
    return /*#__PURE__*/React.createElement("div", {
      key: student.id,
      className: "student-item"
    }, /*#__PURE__*/React.createElement("span", null, (_student$attributes$f5 = student.attributes.find(attr => attr.code === 'fname')) === null || _student$attributes$f5 === void 0 ? void 0 : _student$attributes$f5.value, " ", (_student$attributes$f6 = student.attributes.find(attr => attr.code === 'lname')) === null || _student$attributes$f6 === void 0 ? void 0 : _student$attributes$f6.value), /*#__PURE__*/React.createElement("button", {
      onClick: () => handleSelectStudent(student.id)
    }, selectedStudents.includes(student.id) ? 'Deselect' : 'Select'));
  })), /*#__PURE__*/React.createElement("button", {
    className: "primary-btn",
    onClick: handleFinalSubmit
  }, "Submit Exam")));
};
export default NewExam;