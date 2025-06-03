import React, { useState } from 'react';
import { InputField, Button, Table, TableHead, TableRow, TableCell, TableBody, SingleSelect, SingleSelectOption } from '@dhis2/ui';
const students = [{
  regNumber: 'A001',
  firstName: 'Amina',
  surname: 'Bello',
  school: 'Science College',
  programOfStudy: 'Computer Science',
  yearOfStudy: 'Year 1',
  gender: 'F'
}, {
  regNumber: 'A002',
  firstName: 'John',
  surname: 'Yusuf',
  school: 'Science College',
  programOfStudy: 'Mathematics',
  yearOfStudy: 'Year 2',
  gender: 'M'
}];
const uniqueSchools = [...new Set(students.map(s => s.school))];
const uniqueYears = [...new Set(students.map(s => s.yearOfStudy))];
const ExamTracking = () => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchText, setSearchText] = useState('');
  const [markedStudents, setMarkedStudents] = useState({});
  const filteredStudents = students.filter(student => {
    return (!selectedSchool || student.school === selectedSchool) && (!selectedYear || student.yearOfStudy === selectedYear) && (`${student.firstName} ${student.surname}`.toLowerCase().includes(searchText.toLowerCase()) || student.regNumber.toLowerCase().includes(searchText.toLowerCase()));
  });
  const toggleMark = regNumber => {
    setMarkedStudents(prev => ({
      ...prev,
      [regNumber]: !prev[regNumber]
    }));
  };
  const markAll = () => {
    const newMarks = {};
    filteredStudents.forEach(s => {
      newMarks[s.regNumber] = true;
    });
    setMarkedStudents(newMarks);
  };
  const unmarkAll = () => {
    setMarkedStudents({});
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem'
    }
  }, /*#__PURE__*/React.createElement(SingleSelect, {
    selected: selectedSchool,
    onChange: _ref => {
      let {
        selected
      } = _ref;
      return setSelectedSchool(selected);
    },
    placeholder: "Filter by school"
  }, uniqueSchools.map(school => /*#__PURE__*/React.createElement(SingleSelectOption, {
    key: school,
    label: school,
    value: school
  }))), /*#__PURE__*/React.createElement(SingleSelect, {
    selected: selectedYear,
    onChange: _ref2 => {
      let {
        selected
      } = _ref2;
      return setSelectedYear(selected);
    },
    placeholder: "Filter by year"
  }, uniqueYears.map(year => /*#__PURE__*/React.createElement(SingleSelectOption, {
    key: year,
    label: year,
    value: year
  }))), /*#__PURE__*/React.createElement(InputField, {
    label: "Search",
    value: searchText,
    onChange: _ref3 => {
      let {
        value
      } = _ref3;
      return setSearchText(value);
    },
    placeholder: "Search by name or ID"
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: markAll
  }, "Mark all"), /*#__PURE__*/React.createElement(Button, {
    onClick: unmarkAll
  }, "Unmark all")), /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, null, "Mark"), /*#__PURE__*/React.createElement(TableCell, null, "Student ID"), /*#__PURE__*/React.createElement(TableCell, null, "First Name"), /*#__PURE__*/React.createElement(TableCell, null, "Last Name"), /*#__PURE__*/React.createElement(TableCell, null, "Program"), /*#__PURE__*/React.createElement(TableCell, null, "Year"), /*#__PURE__*/React.createElement(TableCell, null, "Gender"))), /*#__PURE__*/React.createElement(TableBody, null, filteredStudents.map(student => /*#__PURE__*/React.createElement(TableRow, {
    key: student.regNumber
  }, /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!markedStudents[student.regNumber],
    onChange: () => toggleMark(student.regNumber)
  })), /*#__PURE__*/React.createElement(TableCell, null, student.regNumber), /*#__PURE__*/React.createElement(TableCell, null, student.firstName), /*#__PURE__*/React.createElement(TableCell, null, student.surname), /*#__PURE__*/React.createElement(TableCell, null, student.programOfStudy), /*#__PURE__*/React.createElement(TableCell, null, student.yearOfStudy), /*#__PURE__*/React.createElement(TableCell, null, student.gender))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1rem'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    primary: true,
    onClick: () => window.location.href = '/'
  }, "Start Tracking")));
};
export default ExamTracking;