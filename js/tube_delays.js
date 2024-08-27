document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'https://api.tfl.gov.uk/Line/Mode/tube/Disruption';

    // Fetch the data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayDelays(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('delays').innerHTML = '<p>Sorry, there was an error loading the delay information.</p>';
        });
    
    // Function to display the delays on the page
    function displayDelays(delays) {
        const delaysContainer = document.getElementById('delays');

        if (delays.length === 0) {
            delaysContainer.innerHTML = '<p>No current delays.</p>';
            return;
        }

        delays.forEach(delay => {
            const delayDiv = document.createElement('div');
            delayDiv.className = 'delay';

            const delayDescription = document.createElement('p');
            delayDescription.textContent = delay.description;

            delayDiv.appendChild(delayDescription);
            delaysContainer.appendChild(delayDiv);
        });
    }
});
