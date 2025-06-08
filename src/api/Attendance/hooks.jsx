const markAllAbsent = async (url) => {

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response:', data);
        return data;
    } catch (error) {
        alert('Error posting data:', error);
        throw error;
    }
};



const camera =  (url) => {

    try {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
            
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            console.log('Response:', data);
            return data;
        });
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};

export { markAllAbsent, camera };