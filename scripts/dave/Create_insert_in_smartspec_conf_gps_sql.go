package main

import (
	"fmt"
	"io/ioutil"
)

func ReadJSONFileToString(path string) (string, error) {
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
	jsonString_Sensors, err := ReadJSONFileToString("/root/2022-ma-paul-pongratz/code/data/cattle-gps-sensors.json")
	if err != nil {
		fmt.Println(err)
	}

	jsonString_Spaces, err := ReadJSONFileToString("/root/2022-ma-paul-pongratz/code/data/cattle-gps-spaces.json")
	if err != nil {
		fmt.Println(err)
	}

	str1 := "INSERT INTO simcattle.smartspec_conf (`sensors`, `spaces`, `metasensors`, `learn_conf`, `gen_conf`)\nVALUES (\n'"
	str2 := jsonString_Sensors

	str3 := jsonString_Spaces
	str4 := `-- scenario learning configuration
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

	str5 := ");"
	fileContent := str1 + str2 + "',\n'" + str3 + "',\n" + str4 + "\n" + str5 + "\n"

	// Write the file
	err = ioutil.WriteFile("/root/2022-ma-paul-pongratz/code/scripts/init/insert_in_smartspec_conf_GPS.sql", []byte(fileContent), 0644)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("File created successfully.")
}