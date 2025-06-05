import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import './selectstudents.css';
import { Divider } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
// import useRegisterEvent from '../../hooks/api-calls/dataMutate'

// Define DHIS2 queries
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

// Static query definition that can accept orgUnitId as a variable
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

// Organization Unit Selector Component
const OrgUnitSelector = _ref2 => {
  let {
    orgUnits,
    selectedOrgUnit,
    onOrgUnitChange,
    loading
  } = _ref2;
  return /*#__PURE__*/React.createElement("div", {
    className: "org-unit-selector"
  }, /*#__PURE__*/React.createElement("label", {
    className: "orglabel",
    htmlFor: "orgUnit"
  }, "Organization Unit:"), /*#__PURE__*/React.createElement("select", {
    id: "orgUnit",
    value: selectedOrgUnit,
    onChange: onOrgUnitChange,
    disabled: loading
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select an organization unit"), orgUnits.map(orgUnit => /*#__PURE__*/React.createElement("option", {
    key: orgUnit.id,
    value: orgUnit.id
  }, orgUnit.name))));
};

// Search Component
const SearchBox = _ref3 => {
  let {
    searchTerm,
    onSearchChange
  } = _ref3;
  return /*#__PURE__*/React.createElement("div", {
    className: "search-box"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search students by name, program...",
    value: searchTerm,
    onChange: onSearchChange
  }));
};

// Student Table Component
const StudentTable = _ref4 => {
  let {
    students,
    selectedStudents,
    onSelectStudent,
    onSelectAll,
    searchTerm
  } = _ref4;
  // Filter students based on search term
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

  // Check if all filtered students are selected
  const allSelected = filteredStudents.length > 0 && filteredStudents.every(student => selectedStudents.includes(student.trackedEntityInstance));
  return /*#__PURE__*/React.createElement("div", {
    className: "student-table-container"
  }, /*#__PURE__*/React.createElement("table", {
    className: "student-table"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "student-table-header"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: allSelected,
    onChange: () => onSelectAll(filteredStudents.map(s => s.trackedEntityInstance), !allSelected)
  })), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Registration Number"), /*#__PURE__*/React.createElement("th", null, "Program"), /*#__PURE__*/React.createElement("th", null, "Year of Study"), /*#__PURE__*/React.createElement("th", null, "Academic Year"))), /*#__PURE__*/React.createElement("tbody", null, filteredStudents.length > 0 ? filteredStudents.map(student => {
    var _student$attributes$f5, _student$attributes$f6, _student$attributes$f7, _student$attributes$f8, _student$attributes$f9, _student$attributes$f10;
    const firstName = ((_student$attributes$f5 = student.attributes.find(attr => attr.code === 'fname')) === null || _student$attributes$f5 === void 0 ? void 0 : _student$attributes$f5.value) || 'N/A';
    const lastName = ((_student$attributes$f6 = student.attributes.find(attr => attr.code === 'lname')) === null || _student$attributes$f6 === void 0 ? void 0 : _student$attributes$f6.value) || 'N/A';
    const program = ((_student$attributes$f7 = student.attributes.find(attr => attr.code === 'program of study')) === null || _student$attributes$f7 === void 0 ? void 0 : _student$attributes$f7.value) || 'N/A';
    const yearOfStudy = ((_student$attributes$f8 = student.attributes.find(attr => attr.code === 'year of study')) === null || _student$attributes$f8 === void 0 ? void 0 : _student$attributes$f8.value) || 'N/A';
    const academicYear = ((_student$attributes$f9 = student.attributes.find(attr => attr.code === 'academic year')) === null || _student$attributes$f9 === void 0 ? void 0 : _student$attributes$f9.value) || 'N/A';
    const regNumber = ((_student$attributes$f10 = student.attributes.find(attr => attr.code === 'regnumber')) === null || _student$attributes$f10 === void 0 ? void 0 : _student$attributes$f10.value) || 'N/A';
    return /*#__PURE__*/React.createElement("tr", {
      key: student.trackedEntityInstance
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: selectedStudents.includes(student.trackedEntityInstance),
      onChange: () => onSelectStudent(student.trackedEntityInstance)
    })), /*#__PURE__*/React.createElement("td", null, `${firstName} ${lastName}`), /*#__PURE__*/React.createElement("td", null, regNumber), /*#__PURE__*/React.createElement("td", null, program), /*#__PURE__*/React.createElement("td", null, yearOfStudy), /*#__PURE__*/React.createElement("td", null, academicYear));
  }) : /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "6",
    className: "no-students"
  }, "No students found matching your search criteria")))));
};
// Main Component
const SelectStudents = () => {
  var _orgUnitData$orgUnits, _studentData$students;
  const [selectedOrgUnit, setSelectedOrgUnit] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [examDetails, setExamDetails] = useState(null);
  const [markedData, setMarkedData] = useState({
    courseName: '',
    date: '',
    room: '',
    supervisorName: '',
    startTime: '',
    endTime: '',
    students: []
  });
  const navigate = useNavigate();

  // const { loading,
  //     error,
  //     data,
  //     registerEvent, } = useRegisterEvent
  // fallback to {} to avoid errors
  const {
    courseName,
    date,
    room,
    supervisorName,
    startTime,
    endTime
  } = location.state || {};
  useEffect(() => {
    setMarkedData({
      courseName: courseName || '',
      date: date || '',
      room: room || '',
      supervisorName: supervisorName || '',
      startTime: startTime || '',
      endTime: endTime || '',
      students: selectedStudents,
      orgUnit: selectedOrgUnit
    });
  }, [selectedStudents]);
  // Fetch organization units
  const {
    data: orgUnitData,
    loading: orgUnitsLoading
  } = useDataQuery(ORG_UNITS_QUERY);

  // Fetch students when org unit is selected
  const {
    data: studentData,
    loading: studentsLoading,
    refetch: refetchStudents
  } = useDataQuery(STUDENTS_QUERY, {
    lazy: true,
    variables: {
      orgUnitId: selectedOrgUnit
    }
  });
  useEffect(() => {
    if (selectedOrgUnit) {
      // console.log('Fetching students for orgUnit:', selectedOrgUnit);
      refetchStudents({
        orgUnitId: selectedOrgUnit
      });
    }
  }, [selectedOrgUnit, refetchStudents]);
  const orgUnits = (orgUnitData === null || orgUnitData === void 0 ? void 0 : (_orgUnitData$orgUnits = orgUnitData.orgUnits) === null || _orgUnitData$orgUnits === void 0 ? void 0 : _orgUnitData$orgUnits.organisationUnits) || [];
  const students = (studentData === null || studentData === void 0 ? void 0 : (_studentData$students = studentData.students) === null || _studentData$students === void 0 ? void 0 : _studentData$students.trackedEntityInstances) || [];
  const handleOrgUnitChange = e => {
    const orgUnitId = e.target.value;
    console.log('Selected Organization Unit ID:', orgUnitId);
    setSelectedOrgUnit(orgUnitId);
    setSelectedStudents([]);
  };
  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };
  const handleSelectStudent = studentId => {
    setSelectedStudents(prev => prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]);
  };
  const handleSelectAll = (studentIds, select) => {
    setSelectedStudents(prev => select ? [...new Set([...prev, ...studentIds])] : prev.filter(id => !studentIds.includes(id)));
  };
  const handleCreateExam = async () => {
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
    navigate('/api/attendance', {
      state: markedData
    });
    // console.log(courseName,
    //     date,
    //     room,
    //     supervisorName,
    //     startTime,
    //     endTime)

    //     const result = await registerEvent({
    //         program: 'FnpXlAn2N2t',
    //         orgUnit: 'ORG_UNIT_UID',
    //         programStage: '', // if applicable
    //         date: '2023-11-15', // ISO format
    //         attendance: '45',
    //         startTime: '09:00',
    //         endTime: '11:00',
    //         courseName: 'Mathematics',
    //         examRoom: 'Room 101',
    //         supervisor: 'John Doe'
    //     });

    //     if (result.success) {
    //         // Handle success
    //     }
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "select-students-container"
  }, /*#__PURE__*/React.createElement("h1", null, "Select Students for Exam"), /*#__PURE__*/React.createElement(OrgUnitSelector, {
    orgUnits: orgUnits,
    selectedOrgUnit: selectedOrgUnit,
    onOrgUnitChange: handleOrgUnitChange,
    loading: orgUnitsLoading
  }), /*#__PURE__*/React.createElement(Divider, null), selectedOrgUnit && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SearchBox, {
    searchTerm: searchTerm,
    onSearchChange: handleSearchChange
  }), studentsLoading ? /*#__PURE__*/React.createElement("div", {
    className: "loading"
  }, "Loading students...") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(StudentTable, {
    students: students,
    selectedStudents: selectedStudents,
    onSelectStudent: handleSelectStudent,
    onSelectAll: handleSelectAll,
    searchTerm: searchTerm
  }), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleCreateExam,
    disabled: selectedStudents.length === 0
  }, "Create Exam (", selectedStudents.length, " students selected)")))), showSuccessAlert && /*#__PURE__*/React.createElement("div", {
    className: "success-alert"
  }, "Exam created successfully for ", selectedStudents.length, " students!"));
};
export default SelectStudents;