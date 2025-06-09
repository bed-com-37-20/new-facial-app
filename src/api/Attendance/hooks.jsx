const markAllAbsent = async (url,setNetworkError) => {

    try {
        setNetworkError(true);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response:', data);
        setNetworkError(false);
        return data;
    } catch (error) {
        alert('Error Creating Session, Check Your Network Connectivity:', error);
        setNetworkError(false);
        throw error;
    }
};



const camera =  (url,setCameraStarted) => {

    try {
        setCameraStarted(true)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
            
        }).then(response => {
            if (!response.ok) {
                setCameraStarted(false)
                // throw new Error(`HTTP error! status: ${response.status}`);
            }
          
            return response.json();
        }).then(data => {
            setCameraStarted(false)
            return data;
        });
    } catch (error) {
        alert('Error Connecting to Camera, Check Your Camera Connectivity:');
        throw error;
    }
};

export { markAllAbsent, camera };