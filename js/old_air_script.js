// Function to fetch and display air quality data
async function fetchAirQualityData() {
    try {
        // Fetch the air quality data from the local JSON file
        const response = await fetch('../data/air_quality_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Get the dropdown elements and table
        const siteSelect = document.getElementById('siteSelect');
        const speciesSelect = document.getElementById('speciesSelect');
        const speciesTableBody = document.getElementById('speciesTable').getElementsByTagName('tbody')[0];

        // Populate the site dropdown
        for (const siteName in data) {
            const option = document.createElement('option');
            option.value = siteName;
            option.textContent = siteName;
            siteSelect.appendChild(option);
        }

        // Event listener for site selection
        siteSelect.addEventListener('change', (event) => {
            const selectedSite = event.target.value;
            if (selectedSite) {
                // Populate the species description dropdown
                populateSpeciesDropdown(data[selectedSite]);
            } else {
                // Clear the species dropdown and table if no site is selected
                speciesSelect.innerHTML = '<option value="">Select a species description</option>';
                speciesTableBody.innerHTML = '';
            }
        });

        // Event listener for species description selection
        speciesSelect.addEventListener('change', (event) => {
            const selectedSpecies = event.target.value;
            const selectedSite = siteSelect.value;
            if (selectedSpecies && selectedSite) {
                // Filter and display the data in the table
                displaySpeciesData(data[selectedSite], selectedSpecies);
            }
        });

        // Populate species dropdown
        function populateSpeciesDropdown(objectives) {
            speciesSelect.innerHTML = '<option value="">Select a species description</option>';
            objectives.forEach(obj => {
                const option = document.createElement('option');
                option.value = obj.species_description;
                option.textContent = obj.species_description;
                speciesSelect.appendChild(option);
            });
        }

        // Display species data in the table
        function displaySpeciesData(objectives, speciesDescription) {
            // Clear existing rows
            speciesTableBody.innerHTML = '';

            // Filter the objectives based on the selected species description
            const filteredObjectives = objectives.filter(obj => obj.species_description === speciesDescription);

            // Populate the table
            filteredObjectives.forEach(obj => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${obj.year}</td>
                    <td>${obj.achieved}</td>
                `;
                speciesTableBody.appendChild(row);
            });
        }

    } catch (error) {
        console.error('Error fetching air quality data:', error);
    }
}

// Fetch air quality data when the page loads
window.onload = fetchAirQualityData;
