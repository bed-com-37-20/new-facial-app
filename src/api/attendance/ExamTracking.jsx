import React, { useState } from 'react';
import { InputField, Button, Table, TableHead, TableRow, TableCell, TableBody, SingleSelect, SingleSelectOption } from '@dhis2/ui';

const students = [
  {
    regNumber: 'A001',
    firstName: 'Amina',
    surname: 'Bello',
    school: 'Science College',
    programOfStudy: 'Computer Science',
    yearOfStudy: 'Year 1',
    gender: 'F',
  },
  {
    regNumber: 'A002',
    firstName: 'John',
    surname: 'Yusuf',
    school: 'Science College',
    programOfStudy: 'Mathematics',
    yearOfStudy: 'Year 2',
    gender: 'M',
  },
];

const uniqueSchools = [...new Set(students.map(s => s.school))];
const uniqueYears = [...new Set(students.map(s => s.yearOfStudy))];

const ExamTracking = () => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchText, setSearchText] = useState('');
  const [markedStudents, setMarkedStudents] = useState({});

  const filteredStudents = students.filter(student => {
    return (
      (!selectedSchool || student.school === selectedSchool) &&
      (!selectedYear || student.yearOfStudy === selectedYear) &&
      (`${student.firstName} ${student.surname}`.toLowerCase().includes(searchText.toLowerCase()) ||
       student.regNumber.toLowerCase().includes(searchText.toLowerCase()))
    );
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

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <SingleSelect
          selected={selectedSchool}
          onChange={({ selected }) => setSelectedSchool(selected)}
          placeholder="Filter by school"
        >
          {uniqueSchools.map(school => (
            <SingleSelectOption key={school} label={school} value={school} />
          ))}
        </SingleSelect>
        <SingleSelect
          selected={selectedYear}
          onChange={({ selected }) => setSelectedYear(selected)}
          placeholder="Filter by year"
        >
          {uniqueYears.map(year => (
            <SingleSelectOption key={year} label={year} value={year} />
          ))}
        </SingleSelect>
        <InputField
          label="Search"
          value={searchText}
          onChange={({ value }) => setSearchText(value)}
          placeholder="Search by name or ID"
        />
        <Button onClick={markAll}>Mark all</Button>
        <Button onClick={unmarkAll}>Unmark all</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mark</TableCell>
            <TableCell>Student ID</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Program</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Gender</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStudents.map(student => (
            <TableRow key={student.regNumber}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={!!markedStudents[student.regNumber]}
                  onChange={() => toggleMark(student.regNumber)}
                />
              </TableCell>
              <TableCell>{student.regNumber}</TableCell>
              <TableCell>{student.firstName}</TableCell>
              <TableCell>{student.surname}</TableCell>
              <TableCell>{student.programOfStudy}</TableCell>
              <TableCell>{student.yearOfStudy}</TableCell>
              <TableCell>{student.gender}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div style={{ marginTop: '1rem' }}>
        <Button primary onClick={() => window.location.href = '/'}>
          Start Tracking
        </Button>
      </div>
    </div>
  );
};

export default ExamTracking;
