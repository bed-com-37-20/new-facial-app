// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDataQuery } from '@dhis2/app-runtime';
// import { Divider } from '@material-ui/core';
// import './ExamForm.css';

// const ORG_UNITS_QUERY = {
//     orgUnits: {
//         resource: 'organisationUnits',
//         params: {
//             paging: false,
//             fields: 'id,name,level',
//             order: 'level:asc,name:asc'
//         }
//     }
// };

// const STUDENTS_QUERY = {
//     students: {
//         resource: 'trackedEntityInstances',
//         params: ({ orgUnitId }) => ({
//             ou: orgUnitId,
//         })
//     }
// };

// const ExamForm = () => {
//     const [examDetails, setExamDetails] = useState({
//         courseName: '',
//         date: '',
//         room: '',
//         supervisorName: '',
//         startTime: '',
//         endTime: ''
//     });
//     const [selectedOrgUnit, setSelectedOrgUnit] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedStudents, setSelectedStudents] = useState([]);
//     const [showExamForm, setShowExamForm] = useState(true);
//     const [showSuccessAlert, setShowSuccessAlert] = useState(false);

//     const navigate = useNavigate();

//     const { data: orgUnitData, loading: orgUnitsLoading } = useDataQuery(ORG_UNITS_QUERY);
//     const { data: studentData, loading: studentsLoading, refetch: refetchStudents } =
//         useDataQuery(STUDENTS_QUERY, {
//             lazy: true,
//             variables: { orgUnitId: selectedOrgUnit }
//         });

//     useEffect(() => {
//         if (selectedOrgUnit) {
//             refetchStudents({ orgUnitId: selectedOrgUnit });
//         }
//     }, [selectedOrgUnit, refetchStudents]);

//     const orgUnits = orgUnitData?.orgUnits?.organisationUnits || [];
//     const students = studentData?.students?.trackedEntityInstances || [];

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setExamDetails(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmitExamDetails = (e) => {
//         e.preventDefault();
//         setShowExamForm(false);
//     };

//     const handleFinalSubmit = () => {
//         const examData = {
//             ...examDetails,
//             students: selectedStudents,
//             orgUnit: selectedOrgUnit
//         };
//         setShowSuccessAlert(true);
//         setTimeout(() => {
//             navigate('/api/attendance', { state: examData });
//         }, 1500);
//     };

//     const handleSelectStudent = (studentId) => {
//         setSelectedStudents(prev =>
//             prev.includes(studentId)
//                 ? prev.filter(id => id !== studentId)
//                 : [...prev, studentId]
//         );
//     };

//     const handleSelectAllStudents = (studentIds, isSelected) => {
//         setSelectedStudents(prev =>
//             isSelected
//                 ? [...new Set([...prev, ...studentIds])]
//                 : prev.filter(id => !studentIds.includes(id))
//         );
//     };

//     const filteredStudents = students.filter(student => {
//         const firstName = student.attributes.find(attr => attr.code === 'fname')?.value || '';
//         const lastName = student.attributes.find(attr => attr.code === 'lname')?.value || '';
//         const program = student.attributes.find(attr => attr.code === 'program of study')?.value || '';
//         const regNumber = student.attributes.find(attr => attr.code === 'regnumber')?.value || '';

//         const searchLower = searchTerm.toLowerCase();
//         const fullName = `${firstName} ${lastName}`.toLowerCase();

//         return (
//             fullName.includes(searchLower) ||
//             program.toLowerCase().includes(searchLower) ||
//             regNumber.toLowerCase().includes(searchLower)
//         );
//     });

//     return (
//         <div className="exam-form-container">
//             {showExamForm ? (
//                 <div className="exam-details-form">
//                     <h2 className="form-title">Create New Exam</h2>
//                     <form onSubmit={handleSubmitExamDetails}>
//                         <div className="form-group">
//                             <label className="form-label">Course Name</label>
//                             <input
//                                 type="text"
//                                 name="courseName"
//                                 value={examDetails.courseName}
//                                 onChange={handleInputChange}
//                                 className="form-input"
//                                 required
//                                 placeholder="Enter course name"
//                             />
//                         </div>

//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label className="form-label">Date</label>
//                                 <input
//                                     type="date"
//                                     name="date"
//                                     value={examDetails.date}
//                                     onChange={handleInputChange}
//                                     className="form-input"
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label className="form-label">Room</label>
//                                 <input
//                                     type="text"
//                                     name="room"
//                                     value={examDetails.room}
//                                     onChange={handleInputChange}
//                                     className="form-input"
//                                     required
//                                     placeholder="Room number"
//                                 />
//                             </div>
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">Supervisor Name</label>
//                             <input
//                                 type="text"
//                                 name="supervisorName"
//                                 value={examDetails.supervisorName}
//                                 onChange={handleInputChange}
//                                 className="form-input"
//                                 required
//                                 placeholder="Enter supervisor's name"
//                             />
//                         </div>

//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label className="form-label">Start Time</label>
//                                 <input
//                                     type="time"
//                                     name="startTime"
//                                     value={examDetails.startTime}
//                                     onChange={handleInputChange}
//                                     className="form-input"
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label className="form-label">End Time</label>
//                                 <input
//                                     type="time"
//                                     name="endTime"
//                                     value={examDetails.endTime}
//                                     onChange={handleInputChange}
//                                     className="form-input"
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         <div className="form-actions">
//                             <button
//                                 type="button"
//                                 className="btn btn-secondary"
//                                 onClick={() => navigate(-1)}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="btn btn-primary"
//                             >
//                                 Next: Select Students
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             ) : (
//                 <div className="student-selection-container">
//                     <h1 className="selection-title">Select Students for {examDetails.courseName}</h1>

//                     <div className="org-unit-selector">
//                         <label htmlFor="orgUnit" className="org-unit-label">Organization Unit:</label>
//                         <select
//                             id="orgUnit"
//                             value={selectedOrgUnit}
//                             onChange={(e) => setSelectedOrgUnit(e.target.value)}
//                             disabled={orgUnitsLoading}
//                             className="org-unit-select"
//                         >
//                             <option value="">Select an organization unit</option>
//                             {orgUnits.map(orgUnit => (
//                                 <option key={orgUnit.id} value={orgUnit.id}>
//                                     {orgUnit.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <Divider className="divider" />

//                     {selectedOrgUnit && (
//                         <>
//                             <div className="student-search-box">
//                                 <input
//                                     type="text"
//                                     placeholder="Search students by name, program..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="search-input"
//                                 />
//                             </div>

//                             {studentsLoading ? (
//                                 <div className="loading-message">Loading students...</div>
//                             ) : (
//                                 <>
//                                     <div className="student-table-wrapper">
//                                         <table className="student-table">
//                                             <thead className="table-header">
//                                                 <tr>
//                                                     <th className="checkbox-header">
//                                                         <input
//                                                             type="checkbox"
//                                                             className="select-all-checkbox"
//                                                             checked={filteredStudents.length > 0 &&
//                                                                 filteredStudents.every(student =>
//                                                                     selectedStudents.includes(student.trackedEntityInstance))
//                                                             }
//                                                             onChange={(e) => handleSelectAllStudents(
//                                                                 filteredStudents.map(s => s.trackedEntityInstance),
//                                                                 e.target.checked
//                                                             )}
//                                                         />
//                                                     </th>
//                                                     <th className="name-header">Name</th>
//                                                     <th className="reg-number-header">Registration Number</th>
//                                                     <th className="program-header">Program</th>
//                                                     <th className="year-header">Year of Study</th>
//                                                     <th className="academic-year-header">Academic Year</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody className="table-body">
//                                                 {filteredStudents.length > 0 ? (
//                                                     filteredStudents.map(student => {
//                                                         const firstName = student.attributes.find(attr => attr.code === 'fname')?.value || 'N/A';
//                                                         const lastName = student.attributes.find(attr => attr.code === 'lname')?.value || 'N/A';
//                                                         const program = student.attributes.find(attr => attr.code === 'program of study')?.value || 'N/A';
//                                                         const yearOfStudy = student.attributes.find(attr => attr.code === 'year of study')?.value || 'N/A';
//                                                         const academicYear = student.attributes.find(attr => attr.code === 'academic year')?.value || 'N/A';
//                                                         const regNumber = student.attributes.find(attr => attr.code === 'regnumber')?.value || 'N/A';

//                                                         return (
//                                                             <tr key={student.trackedEntityInstance} className="student-row">
//                                                                 <td className="student-checkbox">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         className="student-select-checkbox"
//                                                                         checked={selectedStudents.includes(student.trackedEntityInstance)}
//                                                                         onChange={() => handleSelectStudent(student.trackedEntityInstance)}
//                                                                     />
//                                                                 </td>
//                                                                 <td className="student-name">{`${firstName} ${lastName}`}</td>
//                                                                 <td className="student-reg-number">{regNumber}</td>
//                                                                 <td className="student-program">{program}</td>
//                                                                 <td className="student-year">{yearOfStudy}</td>
//                                                                 <td className="student-academic-year">{academicYear}</td>
//                                                             </tr>
//                                                         );
//                                                     })
//                                                 ) : (
//                                                     <tr className="no-students-row">
//                                                         <td colSpan="6" className="no-students-message">
//                                                             No students found matching your search criteria
//                                                         </td>
//                                                     </tr>
//                                                 )}
//                                             </tbody>
//                                         </table>
//                                     </div>

//                                     <div className="selection-actions">
//                                         <button
//                                             className="btn btn-back"
//                                             onClick={() => setShowExamForm(true)}
//                                         >
//                                             Back
//                                         </button>
//                                         <button
//                                             className="btn btn-submit"
//                                             onClick={handleFinalSubmit}
//                                             disabled={selectedStudents.length === 0}
//                                         >
//                                             Create Exam ({selectedStudents.length} students selected)
//                                         </button>
//                                     </div>
//                                 </>
//                             )}
//                         </>
//                     )}

//                     {showSuccessAlert && (
//                         <div className="success-alert">
//                             Exam created successfully for {selectedStudents.length} students!
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ExamForm;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import { Divider } from '@material-ui/core';
import './ExamForm.css';

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
        params: ({ orgUnitId }) => ({
            ou: orgUnitId,
        })
    }
};

const ExamForm = () => {
    const [examDetails, setExamDetails] = useState({
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
    const [showExamForm, setShowExamForm] = useState(true);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const navigate = useNavigate();

    const { data: orgUnitData, loading: orgUnitsLoading } = useDataQuery(ORG_UNITS_QUERY);
    const { data: studentData, loading: studentsLoading, refetch: refetchStudents } =
        useDataQuery(STUDENTS_QUERY, {
            lazy: true,
            variables: { orgUnitId: selectedOrgUnit }
        });

    useEffect(() => {
        if (selectedOrgUnit) {
            refetchStudents({ orgUnitId: selectedOrgUnit });
        }
    }, [selectedOrgUnit, refetchStudents]);

    const orgUnits = orgUnitData?.orgUnits?.organisationUnits || [];
    const students = studentData?.students?.trackedEntityInstances || [];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExamDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitExamDetails = (e) => {
        e.preventDefault();
        setShowExamForm(false);
    };

    const handleFinalSubmit = () => {
        const examData = {
            ...examDetails,
            students: selectedStudents,
            orgUnit: selectedOrgUnit
        };
        setShowSuccessAlert(true);
        setTimeout(() => {
            navigate('/api/attendance/attendance', { state: examData });
        }, 1500);
    };

    const getRegNumber = (student) => {
        return student.attributes.find(attr => attr.code === 'regnumber')?.value || '';
    };

    const handleSelectStudent = (student) => {
        const regNumber = getRegNumber(student);
        setSelectedStudents(prev =>
            prev.includes(regNumber)
                ? prev.filter(rn => rn !== regNumber)
                : [...prev, regNumber]
        );
    };

    const handleSelectAllStudents = (students, isSelected) => {
        const regNumbers = students.map(student => getRegNumber(student));
        setSelectedStudents(prev =>
            isSelected
                ? [...new Set([...prev, ...regNumbers])]
                : prev.filter(rn => !regNumbers.includes(rn))
        );
    };

    const filteredStudents = students.filter(student => {
        const firstName = student.attributes.find(attr => attr.code === 'fname')?.value || '';
        const lastName = student.attributes.find(attr => attr.code === 'lname')?.value || '';
        const program = student.attributes.find(attr => attr.code === 'program of study')?.value || '';
        const regNumber = getRegNumber(student);

        const searchLower = searchTerm.toLowerCase();
        const fullName = `${firstName} ${lastName}`.toLowerCase();

        return (
            fullName.includes(searchLower) ||
            program.toLowerCase().includes(searchLower) ||
            regNumber.toLowerCase().includes(searchLower)
        );
    });

    const isStudentSelected = (student) => {
        const regNumber = getRegNumber(student);
        return selectedStudents.includes(regNumber);
    };

    const areAllStudentsSelected = (students) => {
        return students.length > 0 &&
            students.every(student => isStudentSelected(student));
    };

    return (
        <div className="exam-form-container">
            {showExamForm ? (
                            <div className="exam-details-form">
                                <h2 className="form-title">Create New Exam</h2>
                                <form onSubmit={handleSubmitExamDetails}>
                                    <div className="form-group">
                                        <label className="form-label">Course Name</label>
                                        <input
                                            type="text"
                                            name="courseName"
                                            value={examDetails.courseName}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                            placeholder="Enter course name"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={examDetails.date}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Room</label>
                                            <input
                                                type="text"
                                                name="room"
                                                value={examDetails.room}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                required
                                                placeholder="Room number"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Supervisor Name</label>
                                        <input
                                            type="text"
                                            name="supervisorName"
                                            value={examDetails.supervisorName}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                            placeholder="Enter supervisor's name"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Start Time</label>
                                            <input
                                                type="time"
                                                name="startTime"
                                                value={examDetails.startTime}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">End Time</label>
                                            <input
                                                type="time"
                                                name="endTime"
                                                value={examDetails.endTime}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => navigate(-1)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Next: Select Students
                                        </button>
                                    </div>
                                </form>
                            </div>
            )  : (
                <div className="student-selection-container">
                    <h1 className="selection-title">Select Students for {examDetails.courseName}</h1>

                    <div className="org-unit-selector">
                        <label htmlFor="orgUnit" className="org-unit-label">Organization Unit:</label>
                        <select
                            id="orgUnit"
                            value={selectedOrgUnit}
                            onChange={(e) => setSelectedOrgUnit(e.target.value)}
                            disabled={orgUnitsLoading}
                            className="org-unit-select"
                        >
                            <option value="">Select an organization unit</option>
                            {orgUnits.map(orgUnit => (
                                <option key={orgUnit.id} value={orgUnit.id}>
                                    {orgUnit.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Divider className="divider" />

                    {selectedOrgUnit && (
                        <>
                            <div className="student-search-box">
                                <input
                                    type="text"
                                    placeholder="Search students by name, program..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            {studentsLoading ? (
                                <div className="loading-message">Loading students...</div>
                            ) : (
                                <>
                                    <div className="student-table-wrapper">
                                        <table className="student-table">
                                            <thead className="table-header">
                                                <tr>
                                                    <th className="checkbox-header">
                                                        <input
                                                            type="checkbox"
                                                            className="select-all-checkbox"
                                                            checked={areAllStudentsSelected(filteredStudents)}
                                                            onChange={(e) => handleSelectAllStudents(
                                                                filteredStudents,
                                                                e.target.checked
                                                            )}
                                                        />
                                                    </th>
                                                    <th className="name-header">Name</th>
                                                    <th className="reg-number-header">Registration Number</th>
                                                    <th className="program-header">Program</th>
                                                    <th className="year-header">Year of Study</th>
                                                    <th className="academic-year-header">Academic Year</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-body">
                                                {filteredStudents.length > 0 ? (
                                                    filteredStudents.map(student => {
                                                        const firstName = student.attributes.find(attr => attr.code === 'fname')?.value || 'N/A';
                                                        const lastName = student.attributes.find(attr => attr.code === 'lname')?.value || 'N/A';
                                                        const program = student.attributes.find(attr => attr.code === 'program of study')?.value || 'N/A';
                                                        const yearOfStudy = student.attributes.find(attr => attr.code === 'year of study')?.value || 'N/A';
                                                        const academicYear = student.attributes.find(attr => attr.code === 'academic year')?.value || 'N/A';
                                                        const regNumber = getRegNumber(student);

                                                        return (
                                                            <tr key={student.trackedEntityInstance} className="student-row">
                                                                <td className="student-checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="student-select-checkbox"
                                                                        checked={isStudentSelected(student)}
                                                                        onChange={() => handleSelectStudent(student)}
                                                                    />
                                                                </td>
                                                                <td className="student-name">{`${firstName} ${lastName}`}</td>
                                                                <td className="student-reg-number">{regNumber}</td>
                                                                <td className="student-program">{program}</td>
                                                                <td className="student-year">{yearOfStudy}</td>
                                                                <td className="student-academic-year">{academicYear}</td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr className="no-students-row">
                                                        <td colSpan="6" className="no-students-message">
                                                            No students found matching your search criteria
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="selection-actions">
                                        <button
                                            className="btn btn-back"
                                            onClick={() => setShowExamForm(true)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            className="btn btn-submit"
                                            onClick={handleFinalSubmit}
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
            )}
        </div>
    );
};

export default ExamForm;