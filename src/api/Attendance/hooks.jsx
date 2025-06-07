const markAllAbsent = async () => {
    const endpoint = 'https://facial-attendance-system-6vy8.onrender.com/mark-all-absent';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response:', data);
        return data;
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};

export default markAllAbsent;