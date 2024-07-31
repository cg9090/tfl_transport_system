// Function to fetch and display data
async function fetchData() {
    try {
        // Fetch the air quality data
        const response = await fetch('../data/newest_air_quality.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Populate the dropdown with site options
        const selectElement = document.getElementById('siteSelect');
        for (const siteName in data) {
            const option = document.createElement('option');
            option.value = siteName;
            option.textContent = siteName;
            selectElement.appendChild(option);
        }
        
        // Add event listener to the select element
        selectElement.addEventListener('change', (event) => {
            const selectedSite = event.target.value;
            if (selectedSite) {
                displaySpeciesInfo(data[selectedSite]);
            } else {
                document.getElementById('tableContainer').innerHTML = '';
            }
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to display species info in a table
function displaySpeciesInfo(speciesInfo) {
    const container = document.getElementById('tableContainer');
    
    // Create a table
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Species Description</th>
                <th>Air Quality Band</th>
            </tr>
        </thead>
        <tbody>
            ${speciesInfo.map(species => `
                <tr>
                    <td>${species.SpeciesDescription}</td>
                    <td>${species.AirQualityBand}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    // Clear any existing content and append the table
    container.innerHTML = '';
    container.appendChild(table);
}

// Fetch data when the page loads
window.onload = fetchData;
