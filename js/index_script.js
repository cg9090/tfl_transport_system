// Function to fetch and display data
async function fetchData() {
    try {
        // Fetch the roads data
        const response = await fetch('../data/road_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Get the select element and div to display the data
        const selectElement = document.getElementById('roadSelect');
        const dataDiv = document.getElementById('data');

        // Populate the dropdown with options
        for (const [id, displayName] of Object.entries(data)) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = displayName;
            selectElement.appendChild(option);
        }

        // Add event listener to the select element
        selectElement.addEventListener('change', async (event) => {
            const selectedId = event.target.value;
            if (selectedId) {
                // Fetch and display road details
                dataDiv.innerHTML = `ID: ${selectedId}, Display Name: ${data[selectedId]}`;
                
                // Fetch disruptions for the selected road
                await fetchDisruptions(data[selectedId]);
            } else {
                dataDiv.textContent = '';
            }
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to fetch disruptions for a given road ID
async function fetchDisruptions(roadId) {
    try {
        const response = await fetch(`https://api.tfl.gov.uk/Road/${roadId}/Disruption`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const disruptions = await response.json();
        
        // Get the div to display the data
        const dataDiv = document.getElementById('data');
        dataDiv.innerHTML += '<h2>Disruptions:</h2>';  // Adding a heading for clarity

        if (disruptions.length > 0) {
            const comment = disruptions[0].comments || 'No comment available';
            
            // Create a paragraph element for the disruption comment
            const commentParagraph = document.createElement('p');
            commentParagraph.textContent = `Disruption Comment: ${comment}`;
            dataDiv.appendChild(commentParagraph);
        } else {
            dataDiv.innerHTML += '<p>No disruptions reported.</p>';
        }

    } catch (error) {
        console.error('Error fetching disruptions:', error);
    }
}

// Fetch data when the page loads
window.onload = fetchData;
