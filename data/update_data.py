import requests
import json

road_response = requests.get(f'https://api.tfl.gov.uk/Road/?api_key=%205a6c6008253c43d88a866d8b9cca03cb')
air_quality_response = requests.get(f'http://api.erg.ic.ac.uk/AirQuality/Annual/MonitoringObjective/GroupName=London/Json')
newest_air_quality_response = requests.get(f'http://api.erg.ic.ac.uk/AirQuality/Daily/MonitoringIndex/Latest/GroupName=London/Json')

if road_response.status_code == 200:
    # Parse the JSON response
    data = road_response.json()

    # Create a dictionary to store id-displayName pairs
    id_display_name_pairs = {}
    
    # Loop through each entry in the list
    for entry in data:
        # Extract the display name and id
        entry_id = entry['id']
        display_name = entry['displayName']

        # Add the pair to the dictionary
        id_display_name_pairs[entry_id] = display_name

    # Save the dictionary to a JSON file
    with open('road_data.json', 'w') as json_file:
        json.dump(id_display_name_pairs, json_file)
else:
    print(f"Error with road api: {road_response.status_code}")

if air_quality_response.status_code == 200:
    # Get the response text
    response_text = air_quality_response.text
    
    # Remove BOM if present
    if response_text.startswith('\ufeff'):
        response_text = response_text[1:]

    try:
        # Parse the cleaned JSON response
        air_quality_data = json.loads(response_text)
        
        # Create a dictionary to hold the processed site data
        processed_sites = {}

        # Loop through each site in the response
        for site in air_quality_data['SiteObjectives']['Site']:
            site_name = site['@SiteName']
            
            # Initialise an array for this site's objectives
            objectives_list = []

            # Loop through each objective for the current site
            for objective in site['Objective']:
                species_description = objective['@SpeciesDescription']
                year = objective['@Year']
                achieved = objective['@Achieved']
                
                # Add the extracted data to the site's objectives array
                objectives_list.append({
                    'species_description': species_description,
                    'year': year,
                    'achieved': achieved
                })

            # Add the site's data to the dictionary
            processed_sites[site_name] = objectives_list

        # Save the processed data to a JSON file
        with open('air_quality_data.json', 'w') as json_file:
            json.dump(processed_sites, json_file, indent=4)

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")

else:
    print(f"Error with air quality api: {air_quality_response.status_code}")

if newest_air_quality_response.status_code == 200:
    # Parse the JSON response
    data = newest_air_quality_response.json()
    
    # Initialise the dictionary to hold the structured data
    site_data = {}
    
    # Loop through each local authority
    for authority in data['DailyAirQualityIndex']['LocalAuthority']:
        # Check if 'Site' key exists
        if 'Site' in authority:
            sites = authority['Site']
            
            # Handle case where 'Site' is a single dictionary
            if isinstance(sites, dict):
                sites = [sites]
            elif not isinstance(sites, list):  # Handle unexpected types
                print(f"Unexpected type for 'Site': {type(sites)}")
                continue
            
            # Loop through each site
            for site in sites:
                # Ensure site is a dictionary
                if isinstance(site, dict):
                    site_name = site.get('@SiteName', 'Unknown Site')
                    
                    # Initialise an empty list to hold species information for this site
                    species_info = []
                    
                    # Loop through each species and extract relevant information
                    if 'Species' in site:
                        species_list = site['Species']
                        
                        # Handle case where 'Species' is a single dictionary
                        if isinstance(species_list, dict):
                            species_list = [species_list]
                        elif not isinstance(species_list, list):  # Handle unexpected types
                            print(f"Unexpected type for 'Species': {type(species_list)}")
                            continue
                        
                        for species in species_list:
                            if isinstance(species, dict):
                                species_description = species.get('@SpeciesDescription', 'No Description')
                                air_quality_band = species.get('@AirQualityBand', 'Unknown Band')
                                species_info.append({
                                    'SpeciesDescription': species_description,
                                    'AirQualityBand': air_quality_band
                                })
                    
                    # Add the site data to the dictionary
                    site_data[site_name] = species_info
        else:
            print(f"No sites found for local authority: {authority.get('@LocalAuthorityName', 'Unknown')}")
    
    # Save the dictionary to a JSON file
    with open('newest_air_quality.json', 'w') as json_file:
        json.dump(site_data, json_file, indent=4)
    
else:
    print(f"Error with air quality API: {newest_air_quality_response.status_code}")