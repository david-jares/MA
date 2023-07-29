package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"os"
	"sort"
	"strconv"
	"strings"
)

// Setttings
const sensorMinLat float64 = 0.0
const sensorMaxLat float64 = 100.0
const sensorMinLon float64 = 12.0
const sensorMaxLon float64 = 100.0

//

type Sensor struct {
	ID             int       `json:"id"`
	Description    string    `json:"description"`
	Capacity       int       `json:"capacity"`
	Longitude      float64   `json:"longitude"`
	Latitude       float64   `json:"latitude"`
	GeoCoordinates []float64 `json:"geoCoordinates"`
	Coordinates    []float64 `json:"coordinates"`
	Neighbors      []int     `json:"neighbors"`
}

var nextSensorID = 1

func PrintSensors(sensorCollection []*Sensor) {

	maxDigits := 0
	for _, sensor := range sensorCollection {
		idStr := strconv.Itoa(sensor.ID)
		if len(idStr) > maxDigits {
			maxDigits = len(idStr)
		}
	}
	maxDigits++

	// Print the sensors with formatted neighbor IDs
	for _, sensor := range sensorCollection {
		neighborStrs := make([]string, 8)
		for i := 0; i < 8; i++ {
			if i < len(sensor.Neighbors) {
				neighborStrs[i] = fmt.Sprintf("%-*d", maxDigits, sensor.Neighbors[i])
			} else {
				neighborStrs[i] = strings.Repeat(" ", maxDigits)
			}
		}
		neighborStr := "[ " + strings.Join(neighborStrs, " ") + " ]"
		fmt.Printf("Sensor: %-*d   lat: %f   lon: %f   nbs: %s \n", len(strconv.Itoa(nextSensorID-1)), sensor.ID, sensor.Latitude, sensor.Longitude, neighborStr)
	}

}

type Direction string

const (
	Left        Direction = "Left"
	Right       Direction = "Right"
	Above       Direction = "Above"
	Below       Direction = "Below"
	TopLeft     Direction = "TopLeft"
	TopRight    Direction = "TopRight"
	BottomLeft  Direction = "BottomLeft"
	BottomRight Direction = "BottomRight"
)

func FindAndAssignNeighbors(data []*Sensor) map[int]map[Direction]*Sensor {
	result := make(map[int]map[Direction]*Sensor)

	for _, sensor := range data {
		neighbors := make(map[Direction]*Sensor)
		directionDistances := make(map[Direction]float64)

		for _, other := range data {
			if other.ID == sensor.ID {
				continue
			}

			dx := other.Latitude - sensor.Latitude
			dy := other.Longitude - sensor.Longitude

			var direction Direction
			if dx == 0 {
				if dy > 0 {
					direction = Above
				} else {
					direction = Below
				}
			} else if dy == 0 {
				if dx > 0 {
					direction = Right
				} else {
					direction = Left
				}
			} else if dx > 0 {
				if dy > 0 {
					direction = TopRight
				} else {
					direction = BottomRight
				}
			} else if dx < 0 {
				if dy > 0 {
					direction = TopLeft
				} else {
					direction = BottomLeft
				}
			}

			distance := math.Sqrt(dx*dx + dy*dy)

			if prevDistance, exists := directionDistances[direction]; !exists || distance < prevDistance {
				directionDistances[direction] = distance
				neighbors[direction] = other
			}
		}
		result[sensor.ID] = neighbors
		neighborValues := make([]int, 0, len(neighbors))
		for _, neighbor := range neighbors {
			neighborValues = append(neighborValues, neighbor.ID)
		}
		// Sort the neighbor values in ascending order
		sort.Slice(neighborValues, func(i, j int) bool {
			return neighborValues[i] < neighborValues[j]
		})

		sensor.Neighbors = neighborValues
		// sensor.Latitude = 23.0
		// fmt.Println(sensor.Neighbors)
	}

	return result
}

func WriteSensorCollectionToFile(sensorCollection []Sensor, filepath string) error {
	// Convert the sensorCollection slice to a JSON byte slice
	sensorCollectionJSON, err := json.Marshal(sensorCollection)
	if err != nil {
		return err
	}

	// Write the JSON byte slice to a file
	err = ioutil.WriteFile(filepath, sensorCollectionJSON, 0644)
	if err != nil {
		return err
	}

	return nil
}

// func AssignNeighbors(sensor *Sensor, neighborIDs []int) {
// 	sensor.Neighbors = neighborIDs
// }

func main() {
	// Open the CSV file
	fmt.Println("<<<<<<<<<<<< Creating Sensors... >>>>>>>>>>>>>")

	file, err := os.Open("/root/2022-ma-paul-pongratz/code/data/cattle-gps-formatted.csv")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	// Parse the CSV file
	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		panic(err)
	}

	// // Create a collection of Sensor instances
	// sensorCollection := make([]Sensor, len(records)-1)
	// for i, record := range records[1:] {
	// 	id := nextSensorID
	// 	nextSensorID++
	// 	longitude, _ := strconv.ParseFloat(record[2], 64)
	// 	latitude, _ := strconv.ParseFloat(record[3], 64)

	// 	sensorCollection[i] = Sensor{
	// 		ID:        id,
	// 		Longitude: longitude,
	// 		Latitude:  latitude,
	// 		Neighbors: []int{},
	// 	}
	// }

	sensorCollection := []*Sensor{}
	uniqueSensors := make(map[string]bool)
	for _, record := range records[1:] {
		longitude, _ := strconv.ParseFloat(record[2], 64)
		latitude, _ := strconv.ParseFloat(record[3], 64)

		if latitude < sensorMinLat || latitude > sensorMaxLat || longitude < sensorMinLon || longitude > sensorMaxLon {
			continue
		}

		id := nextSensorID
		key := fmt.Sprintf("%f,%f", latitude, longitude)
		if _, ok := uniqueSensors[key]; !ok {

			sensorCollection = append(sensorCollection, &Sensor{
				ID:             id,
				Description:    "Cattle GPS Sensor for the Field (exernal test data from simon)",
				Capacity:       -1,
				Longitude:      longitude,
				Latitude:       latitude,
				GeoCoordinates: []float64{latitude, longitude, 1},
				Coordinates:    []float64{-1, -1, 1},
				Neighbors:      []int{},
			})
			uniqueSensors[key] = true
			nextSensorID++
		}
	}
	// sensorCollection = FilterSensors(sensorCollection, 50.0, 51.0, 12.0, 13.0)
	// filteredSensors := FilterSensors(sensorCollection, 48.0, 100.0, 12, 100.0)
	// filteredSensors := sensorCollection
	FindAndAssignNeighbors(sensorCollection)
	PrintSensors(sensorCollection)

	// Write the sensorCollection to a file
	sensorSlice := make([]Sensor, len(sensorCollection))
	for i, s := range sensorCollection {
		sensorSlice[i] = *s
	}
	err = WriteSensorCollectionToFile(sensorSlice, "/root/2022-ma-paul-pongratz/code/data/cattle-gps-sensors.json")
	if err != nil {
		panic(err)
	}
}
