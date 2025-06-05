
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import EnrollmentForm from './EnrollmentForm';
import { UserPlus, Download, Pencil, Trash2, Search } from 'lucide-react';
import { useFetchOrganisationUnits, useEnrolledStudents } from '../../hooks/api-calls/apis';
import { generatePDF } from '../../utils/pdfGenerator';
import { validateEnrollmentForm } from '../../utils/validation';
import './Enrollment.css';
// import './reports/report.css';
import { useDataEngine } from '@dhis2/app-runtime';
import { useLocation } from 'react-router-dom';

interface Enrollment {
  regNumber: string;
  firstName: string;
  surname: string;
  school: string;
  programOfStudy: string;
  yearOfStudy: string;
  nationality: string;
  gender: string;
  dateOfBirth: string;
  enrollDate: string;
  academicYear: string;
  guardian: string;
}

interface ApiError {
  message: string;
  details?: string;
}
interface TrackedEntityAttribute {
  attribute: string;
  code: string;
  value: string;
}

interface TrackedEntityInstance {
  trackedEntityInstance: string;
  attributes: TrackedEntityAttribute[];
}

const ErrorModal: React.FC<{ error: ApiError | null; onClose: () => void }> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content error-modal">
        <h3>{error.message}</h3>
        <p>{error.details}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const LoadingIndicator: React.FC<{ message: string }> = ({ message }) => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);

const ErrorDisplay: React.FC<{ error: Error; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="error-container">
    <h3>Error loading data</h3>
    <p>{error.message}</p>
    <button onClick={onRetry}>Retry</button>
  </div>
);

const EmptyState: React.FC<{ message: string; instructions?: string[] }> = ({ message, instructions }) => (
  <div className="instructions-container">
    <h3>{message}</h3>
    {instructions && (
      <ol>
        {instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
    )}
  </div>
);

const FilterBar: React.FC<{
  organisationUnits: { id: string; displayName: string }[];
  selectedSchool: string;

  onSchoolChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ organisationUnits, selectedSchool, onSchoolChange }) => (
  <div className="filter-card">
    <h2>Student Enrollment</h2>
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="school-select">School</label>
        <select
          id="school-select"
          onChange={onSchoolChange}
          value={selectedSchool}
        >
          <option value="">Select a school</option>
          {organisationUnits.map((school) => (
            <option key={school.id} value={school.displayName}>
              {school.displayName}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="grade-select">Year of Study</label>
        <select id="grade-select"
          onChange={onSchoolChange}
          
        >
          <option value="">Select a year</option>
          {[1, 2, 3, 4, 5].map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
          
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="program-select">Program</label>
        <select id="program-select"
          onChange={onSchoolChange}
        
        >
          <option value="">Program of Study</option>
          {[
            "Computer Science",
            "Statistics",
            "Political Science",
            "Bachelor of Arts",
            "Information System"
          ].map((program) => (
            <option key={program} value={program}>
              {program}
            </option>
          ))}
        </select>
      </div>
      
      <div className="academic-year">
        <span>Academic Year</span>
        <span className="year">2025</span>
      </div>
      {/* <div style={{border:'solid 1px blue',borderRadius:'10px'}} className="academic-year">
        <span>Academic Year</span>
        <span style={{color:'red'}} className="year">2025</span>
      </div> */}

    </div>
  </div>
);

const EnrollmentTable: React.FC<{
  enrollments: Enrollment[];
  onEdit: (enrollment: Enrollment, index: number) => void;
  onDelete: (index: number) => void;
  searchQuery: string;
}> = ({ enrollments, onEdit, onDelete, searchQuery }) => {
  const filteredEnrollments = useMemo(() =>
    enrollments.filter((e) =>
      `${e.firstName} ${e.surname} ${e.programOfStudy} ${e.yearOfStudy}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [enrollments, searchQuery]
  );

  if (filteredEnrollments.length === 0) {
    return (
      <div className="empty-table-message">
        {searchQuery ? (
          <p>No students match your search criteria.</p>
        ) : (
          <p>No enrollments found for the selected school.</p>
        )}
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="enrollment-table">
        <thead>
          <tr>
            {[
              "Reg Number",
              "First Name",
              "Surname",
              "Program",
              "Year",
              "Nationality",
              "Gender",
              "Enroll Date",
              //"Actions"
            ].map((header) => (
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
              <td>{enrollment.programOfStudy}</td>
              <td>{enrollment.yearOfStudy}</td>
              <td>{enrollment.nationality}</td>
              <td>{enrollment.gender}</td>
              <td>{enrollment.enrollDate}</td>
              {/* <td className="action-buttons">
                <button
                  onClick={() => onEdit(enrollment, index)}
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(index)}
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const ActionBar: React.FC<{
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnrollClick: () => void;
  onDownloadClick: () => void;
  hasEnrollments: boolean;
}> = ({ searchQuery, onSearchChange, onEnrollClick, onDownloadClick, hasEnrollments }) => (
  <div className="action-bar">
    <div className="search-wrapper">
      {/* <Search className="search" /> */}
      <input
        type="text"
        placeholder="Search by name, program, or year..."
        value={searchQuery}
        onChange={onSearchChange}
        aria-label="Search students"
      />
    </div>
    <div className="button-group">
      <button onClick={onEnrollClick} className="btn-primary">
        <UserPlus size={16} />
        Enroll Student
      </button>
      <button
        onClick={onDownloadClick}
        className="btn-secondary"
        disabled={!hasEnrollments}
      >
        <Download size={16} />
        Download PDF
      </button>
    </div>
  </div>
);

const EnrollmentPage: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [editingEnrollment, setEditingEnrollment] = useState<{ enrollment: Enrollment; index: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orgUnitId, setOrgUnitId] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [teiLoading, setTeiLoading] = useState(false);
  const [teiError, setTeiError] = useState<Error | null>(null);


  const engine = useDataEngine();
  const { loading: orgUnitsLoading, error: orgUnitsError, organisationUnits } = useFetchOrganisationUnits();
  // const { enrollStudent, loadingEnrol, errorEnrol } = useEnrollStudent();

  const fetchTrackedEntityInstances = useCallback(async (ouId: string) => {
    if (!ouId) return;

    setTeiLoading(true);
    setTeiError(null);

    try {
      const { trackedEntityInstances } = await engine.query({
        trackedEntityInstances: {
          resource: 'trackedEntityInstances',
          params: {
            ou: ouId,
            // program: 'N6eVEDUrpYU', // Using the trackedEntityType from your XML
            fields: 'trackedEntityInstance,attributes[attribute,code,value]',
            paging: false
          }
        }
      });

      if (!trackedEntityInstances || !Array.isArray(trackedEntityInstances.trackedEntityInstances)) {
        throw new Error('Invalid response structure from API');
      }

      const transformed = trackedEntityInstances.trackedEntityInstances.map((tei: TrackedEntityInstance) => {
        const attributes = tei.attributes.reduce((acc: Record<string, string>, attr: TrackedEntityAttribute) => {
          // Map attributes by their codes from your XML
          acc[attr.code] = attr.value;
          return acc;
        }, {} as Record<string, string>);

        return {
          regNumber: attributes['regnumber'] || '',
          firstName: attributes['fname'] || '',
          surname: attributes['lname'] || '',
          school: attributes['school name'] || selectedSchool,
          programOfStudy: attributes['program of study'] || '',
          yearOfStudy: attributes['year of study'] || '',
          nationality: attributes['nationality'] || '',
          gender: attributes['gender'] || '',
          dateOfBirth: attributes['dateOfBirth'] || '',
          enrollDate: attributes['enroll_date'] || '',
          academicYear: attributes['academic year'] || '',
          guardian: attributes['guardian'] || '',
        };
      });

      setEnrollments(transformed);
    } catch (error) {
      console.error('Error fetching tracked entity instances:', error);
      setTeiError(error instanceof Error ? error : new Error('Failed to fetch student data'));
      setEnrollments([]);
    } finally {
      setTeiLoading(false);
    }
  }, [engine, selectedSchool]);

  useEffect(() => {
    if (orgUnitId) {
      fetchTrackedEntityInstances(orgUnitId);
    }
  }, [orgUnitId, fetchTrackedEntityInstances]);

  const handleOrgUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = organisationUnits.find(
      (school) => school.displayName === e.target.value
    );
    setSelectedSchool(e.target.value);
    if (selected?.id) {
      setOrgUnitId(selected.id);
    } else {
      setEnrollments([]);
    }
  };

  const handleEnrollStudentClick = () => {
    setEditingEnrollment(null);
    setShowEnrollmentForm(true);
    setFormErrors({});
  };

  const handleCloseForm = () => {
    setShowEnrollmentForm(false);
    setFormErrors({});
  };

  const handleFormSubmit = async (formData: Enrollment) => {
    const errors = validateEnrollmentForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (editingEnrollment) {
        // Update existing enrollment
        const updated = enrollments.map((e, i) =>
          i === editingEnrollment.index ? formData : e
        );
        setEnrollments(updated);
      } else {
        // Add new enrollment
        setEnrollments([...enrollments, formData]);
      }
      setShowEnrollmentForm(false);
    } catch (error) {
      setApiError({
        message: 'Failed to save enrollment',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleEditClick = (enrollment: Enrollment, index: number) => {
    setEditingEnrollment({ enrollment, index });
    setShowEnrollmentForm(true);
    setFormErrors({});
  };

  const handleDeleteClick = async (index: number) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        const updated = enrollments.filter((_, i) => i !== index);
        setEnrollments(updated);
      } catch (error) {
        setApiError({
          message: 'Failed to delete enrollment',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  };

  const handleDownloadPDF = () => {
    try {
      generatePDF(enrollments, selectedSchool);
    } catch (error) {
      setApiError({
        message: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };


  if (orgUnitsLoading) return <LoadingIndicator message="Loading organization units..." />;
  if (orgUnitsError) return <ErrorDisplay error={orgUnitsError} onRetry={() => window.location.reload()} />;
  if (!organisationUnits || organisationUnits.length === 0) {
    return <EmptyState message="No organization units found" />;
  }


  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Format program of study (remove camel case)
  const formatProgram = (program: string) => {
    return program
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className="enrollment-container">
      <ErrorModal error={apiError} onClose={() => setApiError(null)} />

      {showEnrollmentForm && (
        <div className="modal-backdrop">
          <div style={{width:'100%'}} className="modal-content form-modal">
            <button className="modal-close" onClick={handleCloseForm}>
              &times;
            </button>
            <EnrollmentForm
              school={selectedSchool}
              onSubmit={handleFormSubmit}
              editingEnrollment={editingEnrollment}
              orgUnitId={orgUnitId}
              errors={formErrors}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      <div className="content-wrapper">
        {!showEnrollmentForm && (
          <FilterBar
            organisationUnits={organisationUnits}
            selectedSchool={selectedSchool}
            onSchoolChange={handleOrgUnitChange}
          />
        )}

        {selectedSchool ? (
          <div className="enrollments-section">
            <ActionBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onEnrollClick={handleEnrollStudentClick}
              onDownloadClick={handleDownloadPDF}
              hasEnrollments={enrollments.length > 0}
            />

            {teiLoading ? (
              <LoadingIndicator message="Loading enrollments..." />
            ) : teiError ? (
              <ErrorDisplay
                error={teiError}
                onRetry={() => fetchTrackedEntityInstances(orgUnitId)}
              />
            ) : (
                  <EnrollmentTable
                    enrollments={enrollments.map(enrollment => ({
                      ...enrollment,
                      programOfStudy: formatProgram(enrollment.programOfStudy),
                      enrollDate: formatDate(enrollment.enrollDate),
                      dateOfBirth: formatDate(enrollment.dateOfBirth),
                      yearOfStudy: enrollment.yearOfStudy ? `${enrollment.yearOfStudy}` : '',
                    }))}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    searchQuery={searchQuery}
                  />
            )}
          </div>
        ) : (
            <div className="instructions-container">
              <div className="instructions-box">
                <h3>SEMIS-Enrollment</h3>
                <p>Follow the instructions to proceed:</p>
                <ul>
                  <li>Select the Organization unit you want to view the Registered Student</li>
                  <li>Use global filters (Class, Grade, and Academic Year)</li>
                </ul>
              </div>
            </div>
          // <EmptyState
          //   message="SEMIS Enrollment System"
          //   instructions={[
          //     "Select a school from the dropdown menu",
          //     "Use the filters to narrow down results",
          //     "Click 'Enroll Student' to add new students"
          //   ]}
          // />
        )}
      </div>
    </div>
  );
};

export default EnrollmentPage;