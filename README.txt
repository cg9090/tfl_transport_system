TFL Road and Air Quality Data Project

This project provides a web interface to view road disruptions and air quality data for various sites in London. The data is fetched from relevant APIs and displayed dynamically on the web pages.

css: Contains the CSS file for styling the web pages.
js: Contains the JavaScript files for handling data fetching and DOM manipulation.
data: Contains JSON files with pre-fetched data from APIs.
data/update_data.py: Certain data has been pre-loaded using this python file.

index.html: The main page for viewing links to other pages.
road_info: The page for viewing road disruption information.
old_air_quality.html: The page for viewing previous years air quality data.
current_air_quality.html: The page for viewing current air quality data for sites around London.

To serve the HTML files and access them via a browser, start a simple HTTP server.

Using Python (May vary depending on OS):

python -m http.server 8000

This will start a local server at http://127.0.0.1:8000.