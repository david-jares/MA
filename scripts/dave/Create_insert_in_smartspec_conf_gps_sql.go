package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

// SETTINGS
const filepath_cattle_gps_sensors_json = "/root/MA/data/cattle-gps-sensors.json"
const filepath_cattle_gps_spaces_json = "/root/MA/data/cattle-gps-spaces.json"
const filepath_insert_in_smartspec_conf_GPS_sql = "/root/MA/scripts/init/insert_in_smartspec_conf_GPS.sql"

//END SETTINGS
// func ReadJSONFileToString(path string) (string, error) {
// 	// Read the file
// 	data, err := ioutil.ReadFile(path)
// 	if err != nil {
// 		return "", err
// 	}

// 	// Convert the data to a string
// 	jsonString := string(data)

//		return jsonString, nil
//	}
func ReadJSONFileToString(path string) (string, error) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return "", err
	}

	// Decode the JSON data into a Go data structure
	var jsonData interface{}
	err = json.Unmarshal(data, &jsonData)
	if err != nil {
		return "", err
	}

	// Encode the data structure back into a formatted JSON string
	jsonString, err := json.MarshalIndent(jsonData, "", "    ")
	if err != nil {
		return "", err
	}

	return string(jsonString), nil
}
func ReadJSONFile_Sensors_ToString(path string) (string, error) {
	// Read the file
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return "", err
	}

	// Convert the data to a string
	jsonString := string(data)

	return jsonString, nil
}

func ReadJSONFile_Spaces_ToString(path string) (string, error) {
	// Read the file
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return "", err
	}

	// Convert the data to a string
	jsonString := string(data)

	return jsonString, nil
}

func main() {
	// Define the file content
	jsonString_Sensors, err := ReadJSONFileToString(filepath_cattle_gps_sensors_json)
	if err != nil {
		fmt.Println(err)
	}

	jsonString_Spaces, err := ReadJSONFileToString(filepath_cattle_gps_spaces_json)
	if err != nil {
		fmt.Println(err)
	}

	str1 := "INSERT INTO simcattle.smartspec_conf (`sensors`, `spaces`, `metasensors`, `learn_conf`, `gen_conf`)\nVALUES (\n'"
	str2 := jsonString_Sensors

	str3 := jsonString_Spaces
	str4 := `,
	'[
		{
			"id" : 1,
			"description" : "Bluetooth Beacon"
		}
	]',`
	str5 := `-- scenario learning configuration
'[learners]
start       = 2022-04-26 
end         = 2022-04-28
unit        = 1
validity    = 1
smooth      = EMA
window      = 10
time-thresh = 5
occ-thresh  = 1

',
-- scenario generation configuration
'[people]
number = 10
generation = all

[events]
number = 3000
generation = all

[synthetic-data-generator]
start = 2022-04-26
end   = 2022-04-26

'`

	str6 := ");"
	fileContent := str1 + str2 + "',\n'" + str3 + "'\n" + str4 + "\n" + str5 + "\n" + str6 + "\n"

	// Write the file
	err = ioutil.WriteFile(filepath_insert_in_smartspec_conf_GPS_sql, []byte(fileContent), 0644)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("File created successfully.")
}
