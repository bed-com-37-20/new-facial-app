import { useState } from 'react';
import { supabase } from '../utils/supabase'; // Your Supabase client setup

export default function ImageUploadForm() {
    const [ownerData, setOwnerData] = useState({
        name: '',
        email: '',
    });

    const [imageData, setImageData] = useState({
        name: '',
        description: '',
        file: null,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleOwnerChange = (e) => {
        setOwnerData({
            ...ownerData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        if (e.target.name === 'file') {
            setImageData({
                ...imageData,
                file: e.target.files[0],
            });
        } else {
            setImageData({
                ...imageData,
                [e.target.name]: e.target.value,
            });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            // 1. First find or create the owner
            let owner;

            // Check if owner exists by email
            const { data: existingOwner, error: findError } = await supabase
                .from('owners')
                .select('*')
                .eq('email', ownerData.email)
                .maybeSingle();

            if (findError) throw findError;

            if (existingOwner) {
                // Owner exists - use existing record
                owner = existingOwner;
            } else {
                // Create new owner
                const { data: newOwner, error: createError } = await supabase
                    .from('owners')
                    .insert({
                        name: ownerData.name,
                        email: ownerData.email
                    })
                    .select()
                    .single();

                if (createError) throw createError;
                owner = newOwner;
            }

            // 2. Upload the image to storage
            const fileExt = imageData.file.name.split('.').pop();
            const fileName = `${owner.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `owners/${owner.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('dhis2-image-store')
                .upload(filePath, imageData.file);

            if (uploadError) throw uploadError;

            // 3. Store image metadata in database
            const { error: dbError } = await supabase
                .from('images')
                .insert({
                    owner_id: owner.id,
                    name: imageData.name,
                    description: imageData.description,
                    storage_path: filePath,
                });

            if (dbError) throw dbError;

            setMessage({ text: 'Upload successful!', type: 'success' });
            // Reset form
            setOwnerData({ name: '', email: '' });
            setImageData({ name: '', description: '', file: null });
        } catch (error) {
            console.error('Error:', error);
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Upload Image with Owner Details</h2>

            {message.text && (
                <div style={{
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    borderRadius: '0.375rem',
                    backgroundColor: message.type === 'error' ? '#FEE2E2' : '#D1FAE5',
                    color: message.type === 'error' ? '#B91C1C' : '#065F46'
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>Owner Information</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div>
                            <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4B5563' }}>
                                Owner Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={ownerData.name}
                                onChange={handleOwnerChange}
                                required
                                style={{
                                    marginTop: '0.25rem',
                                    display: 'block',
                                    width: '100%',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #D1D5DB',
                                    padding: '0.5rem',
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                    outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4B5563' }}>
                                Owner Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={ownerData.email}
                                onChange={handleOwnerChange}
                                required
                                style={{
                                    marginTop: '0.25rem',
                                    display: 'block',
                                    width: '100%',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #D1D5DB',
                                    padding: '0.5rem',
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                    outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>Image Information</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div>
                            <label htmlFor="image-name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4B5563' }}>
                                Image Name
                            </label>
                            <input
                                type="text"
                                id="image-name"
                                name="name"
                                value={imageData.name}
                                onChange={handleImageChange}
                                required
                                style={{
                                    marginTop: '0.25rem',
                                    display: 'block',
                                    width: '100%',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #D1D5DB',
                                    padding: '0.5rem',
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                    outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4B5563' }}>
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={imageData.description}
                                onChange={handleImageChange}
                                style={{
                                    marginTop: '0.25rem',
                                    display: 'block',
                                    width: '100%',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #D1D5DB',
                                    padding: '0.5rem',
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                    outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="file" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4B5563' }}>
                                Image File
                            </label>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                style={{
                                    marginTop: '0.25rem',
                                    display: 'block',
                                    width: '100%',
                                    fontSize: '0.875rem',
                                    color: '#6B7280',
                                    padding: '0.5rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid transparent',
                                    backgroundColor: '#EFF6FF',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
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
                        opacity: loading ? 0.5 : 1,
                    }}
                >
                    {loading ? 'Uploading...' : 'Upload Image'}
                </button>
            </form>
        </div>
    );
}