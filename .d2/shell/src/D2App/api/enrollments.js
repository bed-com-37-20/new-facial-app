import React, { useState, useEffect, useCallback, useMemo } from 'react';
import EnrollmentForm from './EnrollmentForm';
import { UserPlus, Download } from 'lucide-react';
import { useFetchOrganisationUnits } from '../hooks/api-calls/apis';
import { generatePDF } from '../utils/pdfGenerator';
import { validateEnrollmentForm } from '../utils/validation';
import './Enrollment.css';
import './reports/report.css';
import { useDataEngine } from '@dhis2/app-runtime';
const ErrorModal = _ref => {
  let {
    error,
    onClose
  } = _ref;
  if (!error) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-backdrop"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content error-modal"
  }, /*#__PURE__*/React.createElement("h3", null, error.message), /*#__PURE__*/React.createElement("p", null, error.details), /*#__PURE__*/React.createElement("button", {
    onClick: onClose
  }, "Close")));
};
const LoadingIndicator = _ref2 => {
  let {
    message
  } = _ref2;
  return /*#__PURE__*/React.createElement("div", {
    className: "loading-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spinner"
  }), /*#__PURE__*/React.createElement("p", null, message));
};
const ErrorDisplay = _ref3 => {
  let {
    error,
    onRetry
  } = _ref3;
  return /*#__PURE__*/React.createElement("div", {
    className: "error-container"
  }, /*#__PURE__*/React.createElement("h3", null, "Error loading data"), /*#__PURE__*/React.createElement("p", null, error.message), /*#__PURE__*/React.createElement("button", {
    onClick: onRetry
  }, "Retry"));
};
const EmptyState = _ref4 => {
  let {
    message,
    instructions
  } = _ref4;
  return /*#__PURE__*/React.createElement("div", {
    className: "instructions-container"
  }, /*#__PURE__*/React.createElement("h3", null, message), instructions && /*#__PURE__*/React.createElement("ol", null, instructions.map((instruction, index) => /*#__PURE__*/React.createElement("li", {
    key: index
  }, instruction))));
};
const FilterBar = _ref5 => {
  let {
    organisationUnits,
    selectedSchool,
    onSchoolChange
  } = _ref5;
  return /*#__PURE__*/React.createElement("div", {
    className: "filter-card"
  }, /*#__PURE__*/React.createElement("h2", null, "Student Enrollment"), /*#__PURE__*/React.createElement("div", {
    className: "filter-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "school-select"
  }, "School"), /*#__PURE__*/React.createElement("select", {
    id: "school-select",
    onChange: onSchoolChange,
    value: selectedSchool
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select a school"), organisationUnits.map(school => /*#__PURE__*/React.createElement("option", {
    key: school.id,
    value: school.displayName
  }, school.displayName)))), /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "grade-select"
  }, "Year of Study"), /*#__PURE__*/React.createElement("select", {
    id: "grade-select",
    onChange: onSchoolChange
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select a year"), [1, 2, 3, 4, 5].map(grade => /*#__PURE__*/React.createElement("option", {
    key: grade,
    value: grade
  }, grade)))), /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "program-select"
  }, "Program"), /*#__PURE__*/React.createElement("select", {
    id: "program-select",
    onChange: onSchoolChange
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Program of Study"), ["Computer Science", "Statistics", "Political Science", "Bachelor of Arts", "Information System"].map(program => /*#__PURE__*/React.createElement("option", {
    key: program,
    value: program
  }, program)))), /*#__PURE__*/React.createElement("div", {
    className: "academic-year"
  }, /*#__PURE__*/React.createElement("span", null, "Academic Year"), /*#__PURE__*/React.createElement("span", {
    className: "year"
  }, "2025"))));
};
const EnrollmentTable = _ref6 => {
  let {
    enrollments,
    onEdit,
    onDelete,
    searchQuery
  } = _ref6;
  const filteredEnrollments = useMemo(() => enrollments.filter(e => `${e.firstName} ${e.surname} ${e.programOfStudy} ${e.yearOfStudy}`.toLowerCase().includes(searchQuery.toLowerCase())), [enrollments, searchQuery]);
  if (filteredEnrollments.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "empty-table-message"
    }, searchQuery ? /*#__PURE__*/React.createElement("p", null, "No students match your search criteria.") : /*#__PURE__*/React.createElement("p", null, "No enrollments found for the selected school."));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "enrollment-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ["Reg Number", "First Name", "Surname", "Program", "Year", "Nationality", "Gender", "Enroll Date"
  //"Actions"
  ].map(header => /*#__PURE__*/React.createElement("th", {
    key: header
  }, header)))), /*#__PURE__*/React.createElement("tbody", null, filteredEnrollments.map((enrollment, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", null, enrollment.regNumber), /*#__PURE__*/React.createElement("td", null, enrollment.firstName), /*#__PURE__*/React.createElement("td", null, enrollment.surname), /*#__PURE__*/React.createElement("td", null, enrollment.programOfStudy), /*#__PURE__*/React.createElement("td", null, enrollment.yearOfStudy), /*#__PURE__*/React.createElement("td", null, enrollment.nationality), /*#__PURE__*/React.createElement("td", null, enrollment.gender), /*#__PURE__*/React.createElement("td", null, enrollment.enrollDate))))));
};
const ActionBar = _ref7 => {
  let {
    searchQuery,
    onSearchChange,
    onEnrollClick,
    onDownloadClick,
    hasEnrollments
  } = _ref7;
  return /*#__PURE__*/React.createElement("div", {
    className: "action-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-wrapper"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search by name, program, or year...",
    value: searchQuery,
    onChange: onSearchChange,
    "aria-label": "Search students"
  })), /*#__PURE__*/React.createElement("div", {
    className: "button-group"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onEnrollClick,
    className: "btn-primary"
  }, /*#__PURE__*/React.createElement(UserPlus, {
    size: 16
  }), "Enroll Student"), /*#__PURE__*/React.createElement("button", {
    onClick: onDownloadClick,
    className: "btn-secondary",
    disabled: !hasEnrollments
  }, /*#__PURE__*/React.createElement(Download, {
    size: 16
  }), "Download PDF")));
};
const EnrollmentPage = () => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orgUnitId, setOrgUnitId] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [teiLoading, setTeiLoading] = useState(false);
  const [teiError, setTeiError] = useState(null);
  const engine = useDataEngine();
  const {
    loading: orgUnitsLoading,
    error: orgUnitsError,
    organisationUnits
  } = useFetchOrganisationUnits();
  // const { enrollStudent, loadingEnrol, errorEnrol } = useEnrollStudent();

  const fetchTrackedEntityInstances = useCallback(async ouId => {
    if (!ouId) return;
    setTeiLoading(true);
    setTeiError(null);
    try {
      const {
        trackedEntityInstances
      } = await engine.query({
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
      const transformed = trackedEntityInstances.trackedEntityInstances.map(tei => {
        const attributes = tei.attributes.reduce((acc, attr) => {
          // Map attributes by their codes from your XML
          acc[attr.code] = attr.value;
          return acc;
        }, {});
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
          guardian: attributes['guardian'] || ''
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
  const handleOrgUnitChange = e => {
    const selected = organisationUnits.find(school => school.displayName === e.target.value);
    setSelectedSchool(e.target.value);
    if (selected !== null && selected !== void 0 && selected.id) {
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
  const handleFormSubmit = async formData => {
    const errors = validateEnrollmentForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      if (editingEnrollment) {
        // Update existing enrollment
        const updated = enrollments.map((e, i) => i === editingEnrollment.index ? formData : e);
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
  const handleEditClick = (enrollment, index) => {
    setEditingEnrollment({
      enrollment,
      index
    });
    setShowEnrollmentForm(true);
    setFormErrors({});
  };
  const handleDeleteClick = async index => {
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
  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };
  if (orgUnitsLoading) return /*#__PURE__*/React.createElement(LoadingIndicator, {
    message: "Loading organization units..."
  });
  if (orgUnitsError) return /*#__PURE__*/React.createElement(ErrorDisplay, {
    error: orgUnitsError,
    onRetry: () => window.location.reload()
  });
  if (!organisationUnits || organisationUnits.length === 0) {
    return /*#__PURE__*/React.createElement(EmptyState, {
      message: "No organization units found"
    });
  }
  const formatDate = dateString => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Format program of study (remove camel case)
  const formatProgram = program => {
    return program.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "enrollment-container"
  }, /*#__PURE__*/React.createElement(ErrorModal, {
    error: apiError,
    onClose: () => setApiError(null)
  }), showEnrollmentForm && /*#__PURE__*/React.createElement("div", {
    className: "modal-backdrop"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    },
    className: "modal-content form-modal"
  }, /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: handleCloseForm
  }, "\xD7"), /*#__PURE__*/React.createElement(EnrollmentForm, {
    school: selectedSchool,
    onSubmit: handleFormSubmit,
    editingEnrollment: editingEnrollment,
    orgUnitId: orgUnitId,
    errors: formErrors,
    onCancel: handleCloseForm
  }))), /*#__PURE__*/React.createElement("div", {
    className: "content-wrapper"
  }, !showEnrollmentForm && /*#__PURE__*/React.createElement(FilterBar, {
    organisationUnits: organisationUnits,
    selectedSchool: selectedSchool,
    onSchoolChange: handleOrgUnitChange
  }), selectedSchool ? /*#__PURE__*/React.createElement("div", {
    className: "enrollments-section"
  }, /*#__PURE__*/React.createElement(ActionBar, {
    searchQuery: searchQuery,
    onSearchChange: handleSearchChange,
    onEnrollClick: handleEnrollStudentClick,
    onDownloadClick: handleDownloadPDF,
    hasEnrollments: enrollments.length > 0
  }), teiLoading ? /*#__PURE__*/React.createElement(LoadingIndicator, {
    message: "Loading enrollments..."
  }) : teiError ? /*#__PURE__*/React.createElement(ErrorDisplay, {
    error: teiError,
    onRetry: () => fetchTrackedEntityInstances(orgUnitId)
  }) : /*#__PURE__*/React.createElement(EnrollmentTable, {
    enrollments: enrollments.map(enrollment => ({
      ...enrollment,
      programOfStudy: formatProgram(enrollment.programOfStudy),
      enrollDate: formatDate(enrollment.enrollDate),
      dateOfBirth: formatDate(enrollment.dateOfBirth),
      yearOfStudy: enrollment.yearOfStudy ? `${enrollment.yearOfStudy}` : ''
    })),
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
    searchQuery: searchQuery
  })) : /*#__PURE__*/React.createElement("div", {
    className: "instructions-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "instructions-box"
  }, /*#__PURE__*/React.createElement("h3", null, "SEMIS-Enrollment"), /*#__PURE__*/React.createElement("p", null, "Follow the instructions to proceed:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Select the Organization unit you want to view the Registered Student"), /*#__PURE__*/React.createElement("li", null, "Use global filters (Class, Grade, and Academic Year)"))))
  // <EmptyState
  //   message="SEMIS Enrollment System"
  //   instructions={[
  //     "Select a school from the dropdown menu",
  //     "Use the filters to narrow down results",
  //     "Click 'Enroll Student' to add new students"
  //   ]}
  // />
  ));
};

export default EnrollmentPage;