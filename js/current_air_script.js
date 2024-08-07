// Function to fetch and display data
async function fetchData() {
    try {
        // Fetch the camera data
        const response = await fetch('../data/cacameras.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Populate the dropdown with camera options
        const selectElement = document.getElementById('cameraSelect');
        data.forEach(camera => {
            const option = document.createElement('option');
            option.value = camera.id;
            option.textContent = camera.location;
            selectElement.appendChild(option);
        });

        // Add event listener to the select element
        selectElement.addEventListener('change', (event) => {
            const selectedCameraId = event.target.value;
            if (selectedCameraId) {
                updateVideo(selectedCameraId);
            } else {
                document.getElementById('cameraFeed').src = '';
            }
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to update the video source
function updateVideo(cameraId) {
    const video = document.getElementById('cameraFeed');
    const source = document.getElementById('videoSource');
    const videoUrl = `https://s3-eu-west-1.amazonaws.com/jamcams.tfl.gov.uk/${cameraId}.mp4`;
    source.src = videoUrl;
    video.load();
}

// Fetch data when the page loads
window.onload = fetchData;
