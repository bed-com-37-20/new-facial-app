import React, { useState } from 'react';
import EnrollmentForm from './EnrollmentForm';
import {
  UserPlus,
  Download,
  Pencil,
  Trash2,
  Search
} from 'lucide-react';
import './Enrollment.css';

interface Enrollment {
    regNumber: string;
    firstName: string;
    surname: string;
    school: string;
    programOfStudy: string;
    yearOfStudy: string;
    nationality: string;
    gender: string;
    profilePicture?: string;
}

const EnrollmentPage: React.FC = () => {

  const [selectedSchool, setSelectedSchool] = useState('');
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [editingEnrollment, setEditingEnrollment] = useState<{ enrollment: Enrollment; index: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSchoolChange = (e) => setSelectedSchool(e.target.value);

  const handleEnrollStudentClick = () => {
    setEditingEnrollment(null);
    setShowEnrollmentForm(true);
  };

  const handleCloseForm = () => setShowEnrollmentForm(false);

  const handleFormSubmit = (formData: Enrollment) => {
    if (editingEnrollment) {
      const updated = enrollments.map((e, i) => (i === editingEnrollment?.index ? formData : e));
      setEnrollments(updated);
      setEditingEnrollment(null);
    } else {
      setEnrollments([...enrollments, formData]);
    }
    setShowEnrollmentForm(false);
  };

  const handleEditClick = (enrollment, index) => {
    setEditingEnrollment({ ...enrollment, index });
    setShowEnrollmentForm(true);
  };

  const filteredEnrollments = enrollments.filter((e) =>
    `${e.firstName} ${e.surname} ${e.programOfStudy} ${e.yearOfStudy}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
      return (
       <div id='enrollment-container' className="enrollment-container">
            {showEnrollmentForm && (
              <div className="modal-backdrop">
                <div className="modal-content">
                  <button className="modal-close" onClick={handleCloseForm}>
                    &times;
                  </button>
                  <EnrollmentForm
                    school={selectedSchool}
                    onSubmit={handleFormSubmit}
                    editingEnrollment={editingEnrollment}
                  />
                </div>
              </div>
            )}
      
            {!showEnrollmentForm && (
              <div className="filter-card">
                <div className="filter-bar">
                  <label>
                    School
                    <select onChange={handleSchoolChange}>
                      <option value="">Select a school</option>
                      {["UNIMA", "MUBAS", "LUANAR", "MUST", "MZUNI", "KUHES"].map((school) => (
                        <option key={school} value={school}>
                          {school}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Grade
                    <select>
                      <option>Select a year</option>
                      {[1, 2, 3, 4, 5].map((grade) => (
                        <option key={grade}>{grade}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Program
                    <select>
                      <option>Program of Study</option>
                      {["Computer Science", "Statistics", "Political Science", "Bachelor of Arts", "Information System"].map((program) => (
                        <option key={program}>{program}</option>
                      ))}
                    </select>
                  </label>
                  <div className="academic-year">
                    <span>Academic Year</span>
                    <span className="year">2025</span>
                  </div>
                </div>
              </div>
            )}
      
            {selectedSchool && !showEnrollmentForm ? (
              <div className="enrollments-section">
                <h2>Enrollments</h2>
                <div className="action-bar">
                  <div className="search-wrapper">
                    <Search className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search Student"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button onClick={handleEnrollStudentClick}>
                    <UserPlus size={16} />
                    Enroll Student
                  </button>
                  <button>
                    <Download size={16} />
                    Download PDF
                  </button>
                </div>
      
                {filteredEnrollments.length > 0 ? (
                  <table className="enrollment-table">
                    <thead>
                      <tr>
                        {["Reg Number", "First Name", "Surname", "School", "Program Of Study", "Year of Study", "Nationality", "Gender", "Profile Picture", "Actions"].map((header) => (
                          <th key={header}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnrollments.map((enrollment, index) => (
                        <tr key={index}>
                          <td>{enrollment.regNumber}</td>
                          <td>{enrollment.firstName}</td>
                          <td>{enrollment.surname}</td>
                          <td>{enrollment.school}</td>
                          <td>{enrollment.programOfStudy}</td>
                          <td>{enrollment.yearOfStudy}</td>
                          <td>{enrollment.nationality}</td>
                          <td>{enrollment.gender}</td>
                          <td>
                            <img
                              src={enrollment.profilePicture || 'https://via.placeholder.com/50'}
                              alt="Profile"
                              className="profile-img"
                            />
                          </td>
                          <td className="action-buttons">
                            <button onClick={() => handleEditClick(enrollment, index)}>
                              <Pencil size={16} color="#4caf50" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this enrollment?')) {
                                  const updated = enrollments.filter((_, i) => i !== index);
                                  setEnrollments(updated);
                                }
                              }}
                            >
                              <Trash2 size={16} color="#f44336" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  searchQuery && (
                    <div className="no-results">No Student or any Information match your search.</div>
                  )
                )}
              </div>
            ) : (
              <div className="instructions-container">
                <div className="instructions-box">
                  <h3>SEMIS-Enrollment</h3>
                  <p>Follow the instructions to proceed:</p>
                  <ul>
                    <li>Select the Organization unit you want to view data</li>
                    <li>Use global filters (Class, Grade, and Academic Year)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
      );  
    // return (
    //     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
    //         <h1>DHIS2 Enrollment</h1>
    //         <form style={{ maxWidth: "600px", margin: "0 auto" }}>
    //             <div style={{ marginBottom: "15px" }}>
    //                 <label htmlFor="program" style={{ display: "block", marginBottom: "5px" }}>
    //                     Program
    //                 </label>
    //                 <select id="program" name="program" style={{ width: "100%", padding: "8px" }}>
    //                     <option value="">Select a program</option>
    //                     <option value="program1">Program 1</option>
    //                     <option value="program2">Program 2</option>
    //                 </select>
    //             </div>
    //             <div style={{ marginBottom: "15px" }}>
    //                 <label htmlFor="orgUnit" style={{ display: "block", marginBottom: "5px" }}>
    //                     Organisation Unit
    //                 </label>
    //                 <input
    //                     type="text"
    //                     id="orgUnit"
    //                     name="orgUnit"
    //                     placeholder="Enter organisation unit"
    //                     style={{ width: "100%", padding: "8px" }}
    //                 />
    //             </div>
    //             <div style={{ marginBottom: "15px" }}>
    //                 <label htmlFor="enrollmentDate" style={{ display: "block", marginBottom: "5px" }}>
    //                     Enrollment Date
    //                 </label>
    //                 <input
    //                     type="date"
    //                     id="enrollmentDate"
    //                     name="enrollmentDate"
    //                     style={{ width: "100%", padding: "8px" }}
    //                 />
    //             </div>
    //             <div style={{ marginBottom: "15px" }}>
    //                 <label htmlFor="incidentDate" style={{ display: "block", marginBottom: "5px" }}>
    //                     Incident Date
    //                 </label>
    //                 <input
    //                     type="date"
    //                     id="incidentDate"
    //                     name="incidentDate"
    //                     style={{ width: "100%", padding: "8px" }}
    //                 />
    //             </div>
    //             <button
    //                 type="submit"
    //                 style={{
    //                     backgroundColor: "#007bff",
    //                     color: "#fff",
    //                     padding: "10px 15px",
    //                     border: "none",
    //                     borderRadius: "5px",
    //                     cursor: "pointer",
    //                 }}
    //             >
    //                 Enroll
    //             </button>
    //         </form>
    //     </div>
    // );
};

export default EnrollmentPage;