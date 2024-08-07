document.addEventListener('DOMContentLoaded', function() {
    fetch('../data/cameras.json')
        .then(response => response.json())
        .then(cameras => {
            populateDropdown(cameras);
        });

    function populateDropdown(cameras) {
        const select = document.getElementById('cameraSelect');
        cameras.forEach(camera => {
            const option = document.createElement('option');
            option.value = camera.id;
            option.textContent = camera.location;
            select.appendChild(option);
        });
    }

    window.updateVideo = function() {
        const select = document.getElementById('cameraSelect');
        const video = document.getElementById('cameraFeed');
        const source = document.getElementById('videoSource');
        const selectedCameraId = select.value;
        const videoUrl = `https://s3-eu-west-1.amazonaws.com/jamcams.tfl.gov.uk/${selectedCameraId}.mp4`;
        source.src = videoUrl;
        video.load();
    }
});
