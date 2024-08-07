import xml.etree.ElementTree as ET
import json

def extract_camera_data(xml_file, output_json_file):
    # Parse the XML file
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    # List to hold camera data
    cameras = []

    # Iterate through all camera elements
    for camera in root.findall(".//camera"):
        camera_id = camera.get('id')
        location = camera.find('location').text if camera.find('location') is not None else "Unknown"
        cameras.append({'id': camera_id, 'location': location})

    # Write the data to a JSON file
    with open(output_json_file, 'w') as json_file:
        json.dump(cameras, json_file, indent=4)

# Specify the input XML file and the output JSON file
input_xml_file = 'camera-list.xml'  # Replace with your actual XML file path
output_json_file = 'cameras.json'

# Extract camera data and save to JSON
extract_camera_data(input_xml_file, output_json_file)

print(f"Camera data has been saved to {output_json_file}")
