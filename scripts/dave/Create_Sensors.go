package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

// SETTINGS
const filepath_cattle_gps_spaces_json = "/root/MA/data/cattle-gps-spaces.json"
const filepath_cattle_gps_sensors_json = "/root/MA/data/cattle-gps-sensors.json"

//SETTINGS END

type Space struct {
	ID             int       `json:"id"`
	Description    string    `json:"description"`
	Capacity       int       `json:"capacity"`
	Longitude      float64   `json:"longitude"`
	Latitude       float64   `json:"latitude"`
	GeoCoordinates []float64 `json:"geoCoordinates"`
	Coordinates    []int     `json:"coordinates"`
	Neighbors      []int     `json:"neighbors"`
}

type Sensor struct {
	//sensor
	// "id": 2,
	// "metasensor-id": 1,
	// "coverage": [2],
	// "coordinates": [3,2,1],
	// "geoCoordinates": [49.68163864109388,12.199289060635687,1]
	ID             int       `json:"id"`
	MetasensorID   int       `json:"metasensor-id"`
	Coverage       []int     `json:"coverage"`
	Coordinates    []int     `json:"coordinates"`
	GeoCoordinates []float64 `json:"geoCoordinates"`
}

func ReadJSONFile(filename string) ([]Space, error) {
	var mySpaces []Space

	// Read the file
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	// Parse the JSON data
	err = json.Unmarshal(data, &mySpaces)
	if err != nil {
		return nil, err
	}

	return mySpaces, nil
}

func main() {
	fmt.Println("<<<<<<<<<<<< Creating Sensors >>>>>>>>>>>>>")
	// Read the JSON file
	mySpaces, err := ReadJSONFile(filepath_cattle_gps_spaces_json)
	if err != nil {
		panic(err)
	}

	mySensors := make([]Sensor, 0)

	// Print the data
	for _, mySpace := range mySpaces {
		if mySpace.ID == 0 {
			continue
		}
		sensor := Sensor{
			ID:             mySpace.ID,
			MetasensorID:   1,
			Coverage:       []int{mySpace.ID},
			Coordinates:    mySpace.Coordinates,
			GeoCoordinates: mySpace.GeoCoordinates,
		}
		mySensors = append(mySensors, sensor)
	}

	// Convert the sensorCollection slice to a JSON byte slice
	mySensorsJSON, err := json.Marshal(mySensors)
	if err != nil {
		fmt.Println(err)
	}

	// Write the JSON byte slice to a file
	err = ioutil.WriteFile(filepath_cattle_gps_sensors_json, mySensorsJSON, 0644)
	if err != nil {
		fmt.Println(err)
	}

	// return nil

}
