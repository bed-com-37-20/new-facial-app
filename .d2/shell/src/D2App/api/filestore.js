import React from "react";
import { useState } from 'react';
import { supabase } from '../utils/supabase'; // Your Supabase client setup

export default function ImageUploadForm() {
  const [ownerData, setOwnerData] = useState({
    name: '',
    email: ''
  });
  const [imageData, setImageData] = useState({
    name: '',
    description: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    text: '',
    type: ''
  });
  const handleOwnerChange = e => {
    setOwnerData({
      ...ownerData,
      [e.target.name]: e.target.value
    });
  };
  const handleImageChange = e => {
    if (e.target.name === 'file') {
      setImageData({
        ...imageData,
        file: e.target.files[0]
      });
    } else {
      setImageData({
        ...imageData,
        [e.target.name]: e.target.value
      });
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage({
      text: '',
      type: ''
    });
    try {
      // 1. First find or create the owner
      let owner;

      // Check if owner exists by email
      const {
        data: existingOwner,
        error: findError
      } = await supabase.from('owners').select('*').eq('email', ownerData.email).maybeSingle();
      if (findError) throw findError;
      if (existingOwner) {
        // Owner exists - use existing record
        owner = existingOwner;
      } else {
        // Create new owner
        const {
          data: newOwner,
          error: createError
        } = await supabase.from('owners').insert({
          name: ownerData.name,
          email: ownerData.email
        }).select().single();
        if (createError) throw createError;
        owner = newOwner;
      }

      // 2. Upload the image to storage
      const fileExt = imageData.file.name.split('.').pop();
      const fileName = `${owner.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `owners/${owner.id}/${fileName}`;
      const {
        error: uploadError
      } = await supabase.storage.from('dhis2-image-store').upload(filePath, imageData.file);
      if (uploadError) throw uploadError;

      // 3. Store image metadata in database
      const {
        error: dbError
      } = await supabase.from('images').insert({
        owner_id: owner.id,
        name: imageData.name,
        description: imageData.description,
        storage_path: filePath
      });
      if (dbError) throw dbError;
      setMessage({
        text: 'Upload successful!',
        type: 'success'
      });
      // Reset form
      setOwnerData({
        name: '',
        email: ''
      });
      setImageData({
        name: '',
        description: '',
        file: null
      });
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        text: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '28rem',
      margin: '0 auto',
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem'
    }
  }, "Upload Image with Owner Details"), message.text && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0.75rem',
      marginBottom: '1rem',
      borderRadius: '0.375rem',
      backgroundColor: message.type === 'error' ? '#FEE2E2' : '#D1FAE5',
      color: message.type === 'error' ? '#B91C1C' : '#065F46'
    }
  }, message.text), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.125rem',
      fontWeight: '500',
      marginBottom: '0.5rem'
    }
  }, "Owner Information"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name",
    style: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4B5563'
    }
  }, "Owner Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "name",
    name: "name",
    value: ownerData.name,
    onChange: handleOwnerChange,
    required: true,
    style: {
      marginTop: '0.25rem',
      display: 'block',
      width: '100%',
      borderRadius: '0.375rem',
      border: '1px solid #D1D5DB',
      padding: '0.5rem',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "email",
    style: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4B5563'
    }
  }, "Owner Email"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    id: "email",
    name: "email",
    value: ownerData.email,
    onChange: handleOwnerChange,
    required: true,
    style: {
      marginTop: '0.25rem',
      display: 'block',
      width: '100%',
      borderRadius: '0.375rem',
      border: '1px solid #D1D5DB',
      padding: '0.5rem',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    }
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.125rem',
      fontWeight: '500',
      marginBottom: '0.5rem'
    }
  }, "Image Information"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "image-name",
    style: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4B5563'
    }
  }, "Image Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "image-name",
    name: "name",
    value: imageData.name,
    onChange: handleImageChange,
    required: true,
    style: {
      marginTop: '0.25rem',
      display: 'block',
      width: '100%',
      borderRadius: '0.375rem',
      border: '1px solid #D1D5DB',
      padding: '0.5rem',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "description",
    style: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4B5563'
    }
  }, "Description"), /*#__PURE__*/React.createElement("textarea", {
    id: "description",
    name: "description",
    value: imageData.description,
    onChange: handleImageChange,
    style: {
      marginTop: '0.25rem',
      display: 'block',
      width: '100%',
      borderRadius: '0.375rem',
      border: '1px solid #D1D5DB',
      padding: '0.5rem',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "file",
    style: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4B5563'
    }
  }, "Image File"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    id: "file",
    name: "file",
    accept: "image/*",
    onChange: handleImageChange,
    required: true,
    style: {
      marginTop: '0.25rem',
      display: 'block',
      width: '100%',
      fontSize: '0.875rem',
      color: '#6B7280',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      border: '1px solid transparent',
      backgroundColor: '#EFF6FF',
      cursor: 'pointer'
    }
  })))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: loading,
    style: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'white',
      backgroundColor: loading ? '#93C5FD' : '#2563EB',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.5 : 1
    }
  }, loading ? 'Uploading...' : 'Upload Image')));
} // const { enrollStudent, loadingEnrol, errorEnrol } = useEnrollStudent();

//   const fetchTrackedEntityInstances = useCallback(async (ouId: string) => {
//     if (!ouId) return;

//     setTeiLoading(true);
//     setTeiError(null);

//     try {
//       const { trackedEntityInstances } = await engine.query({
//         trackedEntityInstances: {
//           resource: 'trackedEntityInstances',
//           params: {
//             ou: ouId,
//             //program: 'NIDbTzjU8J8', 
//            //trackedEntityType:'W85ui9yO3vH',// Using the trackedEntityType from your XMLNIDbTzjU8J8
//             fields: 'trackedEntityInstance,attributes[attribute,code,value]',
//             paging: false
//           }
//         }
//       });

//       if (!trackedEntityInstances || !Array.isArray(trackedEntityInstances.trackedEntityInstances)) {
//         throw new Error('Invalid response structure from API');
//       }

//      const transformed = trackedEntityInstances.trackedEntityInstances.map((tei: TrackedEntityInstance) => {
//   const attributes = tei.attributes.reduce((acc: Record<string, string>, attr: TrackedEntityAttribute) => {
//     // Map attributes by their codes or attribute IDs from your system
//     if (attr.code === 'school') {
//       acc['school name'] = attr.value;
//     } else if (attr.attribute === 'AAhQa2QBdLb') { // First name
//       acc['fname'] = attr.value;
//     } else if (attr.attribute === 'jcNk3WUk6CF') { // Surname
//       acc['lname'] = attr.value;
//     } else if (attr.attribute === 'oU3liZI9qx6') { // Registration number
//       acc['regnumber'] = attr.value;
//     } else if (attr.attribute === 'ctwU8hvnyk9') { // Program of study
//       acc['program of study'] = attr.value;
//     } else if (attr.attribute === 'dA6No4FoYxI') { // Year of study
//       acc['year of study'] = attr.value;
//     } else if (attr.attribute === 'DicIdiy94P8') { // Nationality
//       acc['nationality'] = attr.value;
//     } else if (attr.attribute === 'N6NvXcYsRp8') { // Gender
//       acc['gender'] = attr.value;
//     } else if (attr.attribute === 'tzLYzIpqGiB') { // Date of birth
//       acc['dateOfBirth'] = attr.value;
//     } else if (attr.attribute === 'FtBP3ctaOfX') { // Enrollment date
//       acc['enroll_date'] = attr.value;
//     } else if (attr.attribute === 'sdV0Qc0puZX') { // Academic year
//       acc['academic year'] = attr.value;
//     } else if (attr.attribute === 'Es03r1AMOwQ') { // Guardian
//       acc['guardian'] = attr.value;
//     }
//     return acc;
//   }, {} as Record<string, string>);

//   return {
//     regNumber: attributes['regnumber'] || '',
//     firstName: attributes['fname'] || '',
//     surname: attributes['lname'] || '',
//     school: attributes['school name'] || selectedSchool,
//     programOfStudy: attributes['program of study'] || '',
//     yearOfStudy: attributes['year of study'] || '',
//     nationality: attributes['nationality'] || '',
//     gender: attributes['gender'] || '',
//     dateOfBirth: attributes['dateOfBirth'] || '',
//     enrollDate: attributes['enroll_date'] || '',
//     academicYear: attributes['academic year'] || '',
//     guardian: attributes['guardian'] || '',
//   };
// });
// console.log(trackedEntityInstances)
//       setEnrollments(transformed);
//     } catch (error) {
//       console.error('Error fetching tracked entity instances:', error);
//       setTeiError(error instanceof Error ? error : new Error('Failed to fetch student data'));
//       setEnrollments([]);
//     } finally {
//       setTeiLoading(false);
//     }
//   }, [engine, selectedSchool]);