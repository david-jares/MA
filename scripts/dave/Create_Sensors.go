package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"os"
	"strconv"
)

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

// type Sensor struct {
// 	ID        int
// 	X         float64
// 	Y         float64
// 	Neighbors []int
// }

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

func FindNeighbors(data []*Sensor) map[int]map[Direction]*Sensor {
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
		sensor.Neighbors = neighborValues
		// sensor.Latitude = 23.0
		fmt.Println(sensor.Neighbors)
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
		id := nextSensorID
		longitude, _ := strconv.ParseFloat(record[2], 64)
		latitude, _ := strconv.ParseFloat(record[3], 64)

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

	FindNeighbors(sensorCollection)
	// Apply a function to each member of the collection
	for _, sensor := range sensorCollection {

		fmt.Printf("Sensor %d has lat %f and lon %f and nbs %s \n", sensor.ID, sensor.Latitude, sensor.Longitude, sensor.Neighbors)
		// Apply your function here
	}

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
