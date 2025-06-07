// import React, { useState, useEffect } from 'react';
// import { useDataQuery } from '@dhis2/app-runtime';
// import './selectstudents.css';
// import { Divider } from '@material-ui/core';
// import { useNavigate } from 'react-router-dom';
// // Define DHIS2 queries
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

// // Organization Unit Selector Component
// const OrgUnitSelector = ({ orgUnits, selectedOrgUnit, onOrgUnitChange, loading }) => {
//     return (
//         <div className="org-unit-selector">
//             <label className="orglabel" htmlFor="orgUnit">Organization Unit:</label>
//             <select
//                 id="orgUnit"
//                 value={selectedOrgUnit}
//                 onChange={onOrgUnitChange}
//                 disabled={loading}

//             >
//                 <option value="">Select an organization unit</option>
//                 {orgUnits.map(orgUnit => (
//                     <option key={orgUnit.id} value={orgUnit.id}>
//                         {orgUnit.name}
//                     </option>
//                 ))}
//             </select>
//         </div>
//     );
// };

// // Search Component
// const SearchBox = ({ searchTerm, onSearchChange }) => {
//     return (
//         <div className="search-box">
//             <input
//                 type="text"
//                 placeholder="Search students by name, program..."
//                 value={searchTerm}
//                 onChange={onSearchChange}
//             />
//         </div>
//     );
// };

// // Student Table Component
// const StudentTable = ({ students, selectedStudents, onSelectStudent, onSelectAll, searchTerm }) => {
//     // Filter students based on search term
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

//     // Check if all filtered students are selected
//     const allSelected = filteredStudents.length > 0 &&
//         filteredStudents.every(student => selectedStudents.includes(student.trackedEntityInstance));

//     return (
//         <div className="student-table-container">
//             <table className="student-table">
//                 <thead className='student-table-header'>
//                     <tr>
//                         <th>
//                             <input
//                                 type="checkbox"
//                                 checked={allSelected}
//                                 onChange={() => onSelectAll(filteredStudents.map(s => s.trackedEntityInstance), !allSelected)}
//                             />
//                         </th>
//                         <th>Name</th>
//                         <th>Registration Number</th>
//                         <th>Program</th>
//                         <th>Year of Study</th>
//                         <th>Academic Year</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredStudents.length > 0 ? (
//                         filteredStudents.map(student => {
//                             const firstName = student.attributes.find(attr => attr.code === 'fname')?.value || 'N/A';
//                             const lastName = student.attributes.find(attr => attr.code === 'lname')?.value || 'N/A';
//                             const program = student.attributes.find(attr => attr.code === 'program of study')?.value || 'N/A';
//                             const yearOfStudy = student.attributes.find(attr => attr.code === 'year of study')?.value || 'N/A';
//                             const academicYear = student.attributes.find(attr => attr.code === 'academic year')?.value || 'N/A';
//                             const regNumber = student.attributes.find(attr => attr.code === 'regnumber')?.value || 'N/A';

//                             return (
//                                 <tr key={student.trackedEntityInstance}>
//                                     <td>
//                                         <input
//                                             type="checkbox"
//                                             checked={selectedStudents.includes(student.trackedEntityInstance)}
//                                             onChange={() => onSelectStudent(student.trackedEntityInstance)}
//                                         />
//                                     </td>
//                                     <td>{`${firstName} ${lastName}`}</td>
//                                     <td>{regNumber}</td>
//                                     <td>{program}</td>
//                                     <td>{yearOfStudy}</td>
//                                     <td>{academicYear}</td>
//                                 </tr>
//                             );
//                         })
//                     ) : (
//                         <tr>
//                             <td colSpan="6" className="no-students">
//                                 No students found matching your search criteria
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };
// // Main Component
// const SelectStudents = () => {
//     const [selectedOrgUnit, setSelectedOrgUnit] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedStudents, setSelectedStudents] = useState([]);
//     const [showSuccessAlert, setShowSuccessAlert] = useState(false);
//     const [examDetails, setExamDetails] = useState(null);
//     const [markedData, setMarkedData] = useState({
//         courseName: '',
//         date: '',
//         room: '',
//         supervisorName: '',
//         startTime: '',
//         endTime: '',
//         students: []
//     });

//     const navigate = useNavigate();

//     // const { loading,
//     //     error,
//     //     data,
//     //     registerEvent, } = useRegisterEvent
//      // fallback to {} to avoid errors
//     const { courseName, date, room, supervisorName, startTime, endTime } = location.state || {}

//    useEffect(() => {
//       setMarkedData({
//         courseName: courseName || '',
//         date: date || '',
//         room: room || '',
//         supervisorName: supervisorName || '',
//         startTime: startTime || '',
//         endTime: endTime || '',
//         students: selectedStudents,
//         orgUnit: selectedOrgUnit
//       });
//     }, [ selectedStudents]);
//     // Fetch organization units
//     const { data: orgUnitData, loading: orgUnitsLoading } = useDataQuery(ORG_UNITS_QUERY);

//     // Fetch students when org unit is selected
//     const { data: studentData, loading: studentsLoading, refetch: refetchStudents } =
//         useDataQuery(STUDENTS_QUERY, {
//             lazy: true,
//             variables: { orgUnitId: selectedOrgUnit }
//         });

//     useEffect(() => {
//         if (selectedOrgUnit) {
//             // console.log('Fetching students for orgUnit:', selectedOrgUnit);
//             refetchStudents({ orgUnitId: selectedOrgUnit });
//         }
//     }, [selectedOrgUnit, refetchStudents]);

//     const orgUnits = orgUnitData?.orgUnits?.organisationUnits || [];
//     const students = studentData?.students?.trackedEntityInstances || [];

//     const handleOrgUnitChange = (e) => {
//         const orgUnitId = e.target.value;
//         console.log('Selected Organization Unit ID:', orgUnitId);
//         setSelectedOrgUnit(orgUnitId);
//         setSelectedStudents([]);
//     };

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//     };

//     const handleSelectStudent = (studentId) => {
//         setSelectedStudents(prev =>
//             prev.includes(studentId)
//                 ? prev.filter(id => id !== studentId)
//                 : [...prev, studentId]
//         );
//     };

//     const handleSelectAll = (studentIds, select) => {
//         setSelectedStudents(prev =>
//             select
//                 ? [...new Set([...prev, ...studentIds])]
//                 : prev.filter(id => !studentIds.includes(id))
//         );
//     };

//     const handleCreateExam = async() => {
//         setShowSuccessAlert(true);
//         setTimeout(() => setShowSuccessAlert(false), 3000);
//         console.log('Creating exam with selected students:', markedData);
//         navigate('/api/attendance', { state: markedData });

//     };

//     return (
//         <div className="select-students-container">
//             <h1>Select Students for Exam</h1>

//             <OrgUnitSelector
//                 orgUnits={orgUnits}
//                 selectedOrgUnit={selectedOrgUnit}
//                 onOrgUnitChange={handleOrgUnitChange}
//                 loading={orgUnitsLoading}
//             />
// <Divider />
//             {selectedOrgUnit && (
//                 <>
//                     <SearchBox
//                         searchTerm={searchTerm}
//                         onSearchChange={handleSearchChange}
//                     />

//                     {studentsLoading ? (
//                         <div className="loading">Loading students...</div>
//                     ) : (
//                         <>
//                             <StudentTable
//                                 students={students}
//                                 selectedStudents={selectedStudents}
//                                 onSelectStudent={handleSelectStudent}
//                                 onSelectAll={handleSelectAll}
//                                 searchTerm={searchTerm}
//                             />

//                             <div className="actions">
//                                 <button
//                                     onClick={handleCreateExam}
//                                     disabled={selectedStudents.length === 0}
//                                 >
//                                     Create Exam ({selectedStudents.length} students selected)
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                 </>
//             )}

//             {showSuccessAlert && (
//                 <div className="success-alert">
//                     Exam created successfully for {selectedStudents.length} students!
//                 </div>
//             )}
//         </div>
//     );
// }

// export default SelectStudents;

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
//                                                                     selectedStudents.includes(student.trackedEntityInstance)
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
const ExamForm = () => {
  var _orgUnitData$orgUnits, _studentData$students;
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
  const {
    data: orgUnitData,
    loading: orgUnitsLoading
  } = useDataQuery(ORG_UNITS_QUERY);
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
      refetchStudents({
        orgUnitId: selectedOrgUnit
      });
    }
  }, [selectedOrgUnit, refetchStudents]);
  const orgUnits = (orgUnitData === null || orgUnitData === void 0 ? void 0 : (_orgUnitData$orgUnits = orgUnitData.orgUnits) === null || _orgUnitData$orgUnits === void 0 ? void 0 : _orgUnitData$orgUnits.organisationUnits) || [];
  const students = (studentData === null || studentData === void 0 ? void 0 : (_studentData$students = studentData.students) === null || _studentData$students === void 0 ? void 0 : _studentData$students.trackedEntityInstances) || [];
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setExamDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmitExamDetails = e => {
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
      navigate('/api/attendance', {
        state: examData
      });
    }, 1500);
  };
  const handleSelectStudent = studentId => {
    setSelectedStudents(prev => prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]);
  };
  const handleSelectAllStudents = (studentIds, isSelected) => {
    setSelectedStudents(prev => isSelected ? [...new Set([...prev, ...studentIds])] : prev.filter(id => !studentIds.includes(id)));
  };
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
  return /*#__PURE__*/React.createElement("div", {
    className: "exam-form-container"
  }, showExamForm ? /*#__PURE__*/React.createElement("div", {
    className: "exam-details-form"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "form-title"
  }, "Create New Exam"), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmitExamDetails
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Course Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "courseName",
    value: examDetails.courseName,
    onChange: handleInputChange,
    className: "form-input",
    required: true,
    placeholder: "Enter course name"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Date"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    name: "date",
    value: examDetails.date,
    onChange: handleInputChange,
    className: "form-input",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Room"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "room",
    value: examDetails.room,
    onChange: handleInputChange,
    className: "form-input",
    required: true,
    placeholder: "Room number"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Supervisor Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "supervisorName",
    value: examDetails.supervisorName,
    onChange: handleInputChange,
    className: "form-input",
    required: true,
    placeholder: "Enter supervisor's name"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Start Time"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    name: "startTime",
    value: examDetails.startTime,
    onChange: handleInputChange,
    className: "form-input",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "End Time"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    name: "endTime",
    value: examDetails.endTime,
    onChange: handleInputChange,
    className: "form-input",
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => navigate(-1)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Next: Select Students")))) : /*#__PURE__*/React.createElement("div", {
    className: "student-selection-container"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "selection-title"
  }, "Select Students for ", examDetails.courseName), /*#__PURE__*/React.createElement("div", {
    className: "org-unit-selector"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "orgUnit",
    className: "org-unit-label"
  }, "Organization Unit:"), /*#__PURE__*/React.createElement("select", {
    id: "orgUnit",
    value: selectedOrgUnit,
    onChange: e => setSelectedOrgUnit(e.target.value),
    disabled: orgUnitsLoading,
    className: "org-unit-select"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select an organization unit"), orgUnits.map(orgUnit => /*#__PURE__*/React.createElement("option", {
    key: orgUnit.id,
    value: orgUnit.id
  }, orgUnit.name)))), /*#__PURE__*/React.createElement(Divider, {
    className: "divider"
  }), selectedOrgUnit && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "student-search-box"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search students by name, program...",
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value),
    className: "search-input"
  })), studentsLoading ? /*#__PURE__*/React.createElement("div", {
    className: "loading-message"
  }, "Loading students...") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "student-table-wrapper"
  }, /*#__PURE__*/React.createElement("table", {
    className: "student-table"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "table-header"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "checkbox-header"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    className: "select-all-checkbox",
    checked: filteredStudents.length > 0 && filteredStudents.every(student => selectedStudents.includes(student.trackedEntityInstance)),
    onChange: e => handleSelectAllStudents(filteredStudents.map(s => s.trackedEntityInstance), e.target.checked)
  })), /*#__PURE__*/React.createElement("th", {
    className: "name-header"
  }, "Name"), /*#__PURE__*/React.createElement("th", {
    className: "reg-number-header"
  }, "Registration Number"), /*#__PURE__*/React.createElement("th", {
    className: "program-header"
  }, "Program"), /*#__PURE__*/React.createElement("th", {
    className: "year-header"
  }, "Year of Study"), /*#__PURE__*/React.createElement("th", {
    className: "academic-year-header"
  }, "Academic Year"))), /*#__PURE__*/React.createElement("tbody", {
    className: "table-body"
  }, filteredStudents.length > 0 ? filteredStudents.map(student => {
    var _student$attributes$f5, _student$attributes$f6, _student$attributes$f7, _student$attributes$f8, _student$attributes$f9, _student$attributes$f10;
    const firstName = ((_student$attributes$f5 = student.attributes.find(attr => attr.code === 'fname')) === null || _student$attributes$f5 === void 0 ? void 0 : _student$attributes$f5.value) || 'N/A';
    const lastName = ((_student$attributes$f6 = student.attributes.find(attr => attr.code === 'lname')) === null || _student$attributes$f6 === void 0 ? void 0 : _student$attributes$f6.value) || 'N/A';
    const program = ((_student$attributes$f7 = student.attributes.find(attr => attr.code === 'program of study')) === null || _student$attributes$f7 === void 0 ? void 0 : _student$attributes$f7.value) || 'N/A';
    const yearOfStudy = ((_student$attributes$f8 = student.attributes.find(attr => attr.code === 'year of study')) === null || _student$attributes$f8 === void 0 ? void 0 : _student$attributes$f8.value) || 'N/A';
    const academicYear = ((_student$attributes$f9 = student.attributes.find(attr => attr.code === 'academic year')) === null || _student$attributes$f9 === void 0 ? void 0 : _student$attributes$f9.value) || 'N/A';
    const regNumber = ((_student$attributes$f10 = student.attributes.find(attr => attr.code === 'regnumber')) === null || _student$attributes$f10 === void 0 ? void 0 : _student$attributes$f10.value) || 'N/A';
    return /*#__PURE__*/React.createElement("tr", {
      key: student.trackedEntityInstance,
      className: "student-row"
    }, /*#__PURE__*/React.createElement("td", {
      className: "student-checkbox"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      className: "student-select-checkbox",
      checked: selectedStudents.includes(student.trackedEntityInstance),
      onChange: () => handleSelectStudent(student.trackedEntityInstance)
    })), /*#__PURE__*/React.createElement("td", {
      className: "student-name"
    }, `${firstName} ${lastName}`), /*#__PURE__*/React.createElement("td", {
      className: "student-reg-number"
    }, regNumber), /*#__PURE__*/React.createElement("td", {
      className: "student-program"
    }, program), /*#__PURE__*/React.createElement("td", {
      className: "student-year"
    }, yearOfStudy), /*#__PURE__*/React.createElement("td", {
      className: "student-academic-year"
    }, academicYear));
  }) : /*#__PURE__*/React.createElement("tr", {
    className: "no-students-row"
  }, /*#__PURE__*/React.createElement("td", {
    colSpan: "6",
    className: "no-students-message"
  }, "No students found matching your search criteria"))))), /*#__PURE__*/React.createElement("div", {
    className: "selection-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-back",
    onClick: () => setShowExamForm(true)
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-submit",
    onClick: handleFinalSubmit,
    disabled: selectedStudents.length === 0
  }, "Create Exam (", selectedStudents.length, " students selected)")))), showSuccessAlert && /*#__PURE__*/React.createElement("div", {
    className: "success-alert"
  }, "Exam created successfully for ", selectedStudents.length, " students!")));
};
export default ExamForm;