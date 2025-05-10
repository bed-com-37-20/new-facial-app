import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputField, Button, Modal, ModalTitle, ModalContent, ModalActions, SingleSelect, SingleSelectOption, Table, TableHead, TableRow, TableCell, TableBody } from '@dhis2/ui';

const classes = [
  { id: 'classA', name: 'Class A' },
  { id: 'classB', name: 'Class B' },
];

const students = [
  {
    regNumber: 'A001',
    firstName: 'Amina',
    surname: 'Bello',
    school: 'Science College',
    programOfStudy: 'Computer Science',
    yearOfStudy: 'Year 1',
    nationality: 'Nigerian',
    gender: 'F',
    profilePicture: '',
  },
  {
    regNumber: 'A002',
    firstName: 'John',
    surname: 'Yusuf',
    school: 'Science College',
    programOfStudy: 'Mathematics',
    yearOfStudy: 'Year 2',
    nationality: 'Nigerian',
    gender: 'M',
    profilePicture: '',
  },
];

const Attendances = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [showExamForm, setShowExamForm] = useState(false);

  const [examDetails, setExamDetails] = useState({
    name: '',
    date: '',
    room: '',
    invigilator: '',
    startTime: '',
    endTime: '',
  });

  const handleClassChange = ({ selected }) => {
    setSelectedClass(selected);
    setAttendanceData({});
  };

  const handleStatusChange = (regNumber, date, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [regNumber]: {
        ...prev[regNumber],
        [date]: status,
      },
    }));
  };

  const handleInputChange = (field, value) => {
    setExamDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleGoToExamTracking = () => {
    setShowExamForm(false);
    navigate('/api/attendance/ExamTracking', {
      state: {
        examDetails,
        attendanceData,
      },
    });
  };

  const dates = ['2025-05-06', '2025-05-07', '2025-05-08', '2025-05-09', '2025-05-10'];
  const statusOptions = ['Present', 'Absent', 'Late', 'Excused'];

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <SingleSelect
          selected={selectedClass}
          onChange={handleClassChange}
          placeholder="Select a class"
          label="Class/Section"
        >
          {classes.map(cls => (
            <SingleSelectOption key={cls.id} label={cls.name} value={cls.id} />
          ))}
        </SingleSelect>

        <Button name="take-attendance" primary onClick={() => setShowExamForm(true)}>
          Take attendance
        </Button>
        <Button name="view-attendance">View attendance records</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Reg Number</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Surname</TableCell>
            <TableCell>School</TableCell>
            <TableCell>Program</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Nationality</TableCell>
            <TableCell>Gender</TableCell>
            {dates.map(date => (
              <TableCell key={date}>{date}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map(student => (
            <TableRow key={student.regNumber}>
              <TableCell>{student.regNumber}</TableCell>
              <TableCell>{student.firstName}</TableCell>
              <TableCell>{student.surname}</TableCell>
              <TableCell>{student.school}</TableCell>
              <TableCell>{student.programOfStudy}</TableCell>
              <TableCell>{student.yearOfStudy}</TableCell>
              <TableCell>{student.nationality}</TableCell>
              <TableCell>{student.gender}</TableCell>
              {dates.map(date => (
                <TableCell key={date}>
                  <select
                    value={attendanceData[student.regNumber]?.[date] || ''}
                    onChange={e => handleStatusChange(student.regNumber, date, e.target.value)}
                  >
                    <option value="">--</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showExamForm && (
        <Modal large onClose={() => setShowExamForm(false)}>
          <ModalTitle>Create Exam Attendance</ModalTitle>
          <ModalContent>
            <InputField
              label="Examination Name"
              value={examDetails.name}
              onChange={({ value }) => handleInputChange('name', value)}
            />
            <InputField
              label="Date"
              type="date"
              value={examDetails.date}
              onChange={({ value }) => handleInputChange('date', value)}
            />
            <InputField
              label="Room"
              value={examDetails.room}
              onChange={({ value }) => handleInputChange('room', value)}
            />
            <InputField
              label="Invigilator"
              value={examDetails.invigilator}
              onChange={({ value }) => handleInputChange('invigilator', value)}
            />
            <InputField
              label="Start Time"
              type="time"
              value={examDetails.startTime}
              onChange={({ value }) => handleInputChange('startTime', value)}
            />
            <InputField
              label="End Time"
              type="time"
              value={examDetails.endTime}
              onChange={({ value }) => handleInputChange('endTime', value)}
            />
          </ModalContent>
          <ModalActions>
            <Button onClick={() => setShowExamForm(false)}>
              Cancel
            </Button>
            <Button primary onClick={handleGoToExamTracking}>
              Go
            </Button>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
};




export default Attendances;
