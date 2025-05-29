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
        params: ({ orgUnitId }) => ({
            ou: orgUnitId,
          
        })
    }
};

// Organization Unit Selector Component
const OrgUnitSelector = ({ orgUnits, selectedOrgUnit, onOrgUnitChange, loading }) => {
    return (
        <div className="org-unit-selector">
            <label className="orglabel" htmlFor="orgUnit">Organization Unit:</label>
            <select
                id="orgUnit"
                value={selectedOrgUnit}
                onChange={onOrgUnitChange}
                disabled={loading}
               
            >
                <option value="">Select an organization unit</option>
                {orgUnits.map(orgUnit => (
                    <option key={orgUnit.id} value={orgUnit.id}>
                        {orgUnit.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

// Search Component
const SearchBox = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="search-box">
            <input
                type="text"
                placeholder="Search students by name, program..."
                value={searchTerm}
                onChange={onSearchChange}
            />
        </div>
    );
};

// Student Table Component
const StudentTable = ({ students, selectedStudents, onSelectStudent, onSelectAll, searchTerm }) => {
    // Filter students based on search term
    const filteredStudents = students.filter(student => {
        const firstName = student.attributes.find(attr => attr.code === 'fname')?.value || '';
        const lastName = student.attributes.find(attr => attr.code === 'lname')?.value || '';
        const program = student.attributes.find(attr => attr.code === 'program of study')?.value || '';
        const regNumber = student.attributes.find(attr => attr.code === 'regnumber')?.value || '';

        const searchLower = searchTerm.toLowerCase();
        const fullName = `${firstName} ${lastName}`.toLowerCase();

        return (
            fullName.includes(searchLower) ||
            program.toLowerCase().includes(searchLower) ||
            regNumber.toLowerCase().includes(searchLower)
        );
    });

    // Check if all filtered students are selected
    const allSelected = filteredStudents.length > 0 &&
        filteredStudents.every(student => selectedStudents.includes(student.trackedEntityInstance));

    return (
        <div className="student-table-container">
            <table className="student-table">
                <thead className='student-table-header'>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={() => onSelectAll(filteredStudents.map(s => s.trackedEntityInstance), !allSelected)}
                            />
                        </th>
                        <th>Name</th>
                        <th>Registration Number</th>
                        <th>Program</th>
                        <th>Year of Study</th>
                        <th>Academic Year</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => {
                            const firstName = student.attributes.find(attr => attr.code === 'fname')?.value || 'N/A';
                            const lastName = student.attributes.find(attr => attr.code === 'lname')?.value || 'N/A';
                            const program = student.attributes.find(attr => attr.code === 'program of study')?.value || 'N/A';
                            const yearOfStudy = student.attributes.find(attr => attr.code === 'year of study')?.value || 'N/A';
                            const academicYear = student.attributes.find(attr => attr.code === 'academic year')?.value || 'N/A';
                            const regNumber = student.attributes.find(attr => attr.code === 'regnumber')?.value || 'N/A';

                            return (
                                <tr key={student.trackedEntityInstance}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(student.trackedEntityInstance)}
                                            onChange={() => onSelectStudent(student.trackedEntityInstance)}
                                        />
                                    </td>
                                    <td>{`${firstName} ${lastName}`}</td>
                                    <td>{regNumber}</td>
                                    <td>{program}</td>
                                    <td>{yearOfStudy}</td>
                                    <td>{academicYear}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="no-students">
                                No students found matching your search criteria
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
// Main Component
const SelectStudents = () => {
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
    const { courseName, date, room, supervisorName, startTime, endTime } = location.state || {}
    
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
    }, [ selectedStudents]);
    // Fetch organization units
    const { data: orgUnitData, loading: orgUnitsLoading } = useDataQuery(ORG_UNITS_QUERY);

    // Fetch students when org unit is selected
    const { data: studentData, loading: studentsLoading, refetch: refetchStudents } =
        useDataQuery(STUDENTS_QUERY, {
            lazy: true,
            variables: { orgUnitId: selectedOrgUnit }
        });

    useEffect(() => {
        if (selectedOrgUnit) {
            console.log('Fetching students for orgUnit:', selectedOrgUnit);
            refetchStudents({ orgUnitId: selectedOrgUnit });
        }
    }, [selectedOrgUnit, refetchStudents]);

    const orgUnits = orgUnitData?.orgUnits?.organisationUnits || [];
    const students = studentData?.students?.trackedEntityInstances || [];

    const handleOrgUnitChange = (e) => {
        const orgUnitId = e.target.value;
        console.log('Selected Organization Unit ID:', orgUnitId);
        setSelectedOrgUnit(orgUnitId);
        setSelectedStudents([]);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectStudent = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSelectAll = (studentIds, select) => {
        setSelectedStudents(prev =>
            select
                ? [...new Set([...prev, ...studentIds])]
                : prev.filter(id => !studentIds.includes(id))
        );
    };

    const handleCreateExam = async() => {
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        navigate('/api/attendance', { state: markedData });
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




    return (
        <div className="select-students-container">
            <h1>Select Students for Exam</h1>

            <OrgUnitSelector
                orgUnits={orgUnits}
                selectedOrgUnit={selectedOrgUnit}
                onOrgUnitChange={handleOrgUnitChange}
                loading={orgUnitsLoading}
            />
<Divider />
            {selectedOrgUnit && (
                <>
                    <SearchBox
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                    />

                    {studentsLoading ? (
                        <div className="loading">Loading students...</div>
                    ) : (
                        <>
                            <StudentTable
                                students={students}
                                selectedStudents={selectedStudents}
                                onSelectStudent={handleSelectStudent}
                                onSelectAll={handleSelectAll}
                                searchTerm={searchTerm}
                            />

                            <div className="actions">
                                <button
                                    onClick={handleCreateExam}
                                    disabled={selectedStudents.length === 0}
                                >
                                    Create Exam ({selectedStudents.length} students selected)
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}

            {showSuccessAlert && (
                <div className="success-alert">
                    Exam created successfully for {selectedStudents.length} students!
                </div>
            )}
        </div>
    );
}

export default SelectStudents;