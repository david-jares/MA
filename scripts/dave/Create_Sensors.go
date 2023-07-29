package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"sort"
	"strconv"
	"strings"
)

// Setttings
const sensorMinLat float64 = 48.0
const sensorMaxLat float64 = 49.0
const sensorMinLon float64 = 12.0
const sensorMaxLon float64 = 13.0

//

type Sensor struct {
	ID             int       `json:"id"`
	Description    string    `json:"description"`
	Capacity       int       `json:"capacity"`
	Longitude      float64   `json:"longitude"`
	Latitude       float64   `json:"latitude"`
	GeoCoordinates []float64 `json:"geoCoordinates"`
	Coordinates    []int     `json:"coordinates"`
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
		fmt.Printf("Sensor: %-*d   lat: %f   lon: %f   nbs: %s coords: %v\n", len(strconv.Itoa(nextSensorID-1)), sensor.ID, sensor.Latitude, sensor.Longitude, neighborStr, sensor.Coordinates)
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

func containsInt(slice []int, value int) bool {
	for _, v := range slice {
		if v == value {
			return true
		}
	}
	return false
}
func AbsInt(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
func SortSensorsByYX(sensorCollection []*Sensor) {
	sort.Slice(sensorCollection, func(i, j int) bool {
		if sensorCollection[i].Coordinates[1] == sensorCollection[j].Coordinates[1] {
			return sensorCollection[i].Coordinates[0] < sensorCollection[j].Coordinates[0]
		}
		return sensorCollection[i].Coordinates[1] < sensorCollection[j].Coordinates[1]
	})
}
func SortSensorsByXY(sensorCollection []*Sensor) {
	sort.Slice(sensorCollection, func(i, j int) bool {
		if sensorCollection[i].Coordinates[0] == sensorCollection[j].Coordinates[0] {
			return sensorCollection[i].Coordinates[1] < sensorCollection[j].Coordinates[1]
		}
		return sensorCollection[i].Coordinates[0] < sensorCollection[j].Coordinates[0]
	})
}

// func FindAndAssignNeighbors(data []*Sensor) map[int]map[Direction]*Sensor {
// 	result := make(map[int]map[Direction]*Sensor)

// 	for _, sensor := range data {
// 		neighbors := make(map[Direction]*Sensor)
// 		directionDistances := make(map[Direction]float64)

// 		for _, other := range data {
// 			if other.ID == sensor.ID {
// 				continue
// 			}

// 			dx := other.Latitude - sensor.Latitude
// 			dy := other.Longitude - sensor.Longitude

// 			var direction Direction
// 			if dx == 0 {
// 				if dy > 0 {
// 					direction = Above
// 				} else {
// 					direction = Below
// 				}
// 			} else if dy == 0 {
// 				if dx > 0 {
// 					direction = Right
// 				} else {
// 					direction = Left
// 				}
// 			} else if dx > 0 {
// 				if dy > 0 {
// 					direction = TopRight
// 				} else {
// 					direction = BottomRight
// 				}
// 			} else if dx < 0 {
// 				if dy > 0 {
// 					direction = TopLeft
// 				} else {
// 					direction = BottomLeft
// 				}
// 			}

// 			distance := math.Sqrt(dx*dx + dy*dy)

// 			if prevDistance, exists := directionDistances[direction]; !exists || distance < prevDistance {
// 				directionDistances[direction] = distance
// 				neighbors[direction] = other
// 			}
// 		}
// 		result[sensor.ID] = neighbors
// 		neighborValues := make([]int, 0, len(neighbors))
// 		for _, neighbor := range neighbors {
// 			neighborValues = append(neighborValues, neighbor.ID)
// 		}
// 		// Sort the neighbor values in ascending order
// 		sort.Slice(neighborValues, func(i, j int) bool {
// 			return neighborValues[i] < neighborValues[j]
// 		})

// 		sensor.Neighbors = neighborValues
// 		// sensor.Latitude = 23.0
// 		// fmt.Println(sensor.Neighbors)
// 	}

//		return result
//	}

// must be called after Assigning Logical Coordinates
func FindAndAssignLogicalNeighbors(sensorCollection []*Sensor) {
	// Sort the sensors by x-geocoordinate
	sort.Slice(sensorCollection, func(i, j int) bool {
		return sensorCollection[i].Coordinates[0] < sensorCollection[j].Coordinates[0]
	})

	// Find neighbors for each sensor
	for i, sensor := range sensorCollection {

		if len(sensor.Neighbors) == 8 {
			continue
		}

		for j := i + 1; j < len(sensorCollection); j++ {
			otherSensor := sensorCollection[j]

			if AbsInt(sensor.Coordinates[0]-otherSensor.Coordinates[0]) <= 1 &&
				AbsInt(sensor.Coordinates[1]-otherSensor.Coordinates[1]) <= 1 {

				sensor.Neighbors = append(sensor.Neighbors, otherSensor.ID)
				if !containsInt(otherSensor.Neighbors, sensor.ID) {
					otherSensor.Neighbors = append(otherSensor.Neighbors, sensor.ID)
				}
			}
			// otherSensor.Neighbors = append(otherSensor.Neighbors, sensor.ID)
		}

		// if for some circumstance we didnt find any neighbours, increase the radius
		radius := 2
		for len(sensor.Neighbors) == 0 && radius < 10 {
			if len(sensor.Neighbors) == 0 {
				// for j := i + 1; j < len(sensorCollection); j++ {
				for j := 0; j < len(sensorCollection); j++ {
					otherSensor := sensorCollection[j]
					if otherSensor.ID == sensor.ID {
						continue
					}

					if AbsInt(sensor.Coordinates[0]-otherSensor.Coordinates[0]) <= radius &&
						AbsInt(sensor.Coordinates[1]-otherSensor.Coordinates[1]) <= radius {

						sensor.Neighbors = append(sensor.Neighbors, otherSensor.ID)
						if !containsInt(otherSensor.Neighbors, sensor.ID) {
							otherSensor.Neighbors = append(otherSensor.Neighbors, sensor.ID)
						}
					}
					// otherSensor.Neighbors = append(otherSensor.Neighbors, sensor.ID)
				}
			}
			radius++
		}
	}
}
func AssignLogicalCoordinates(sensorCollection []*Sensor) {
	// Sort the sensors by x-geocoordinate
	sort.Slice(sensorCollection, func(i, j int) bool {
		return sensorCollection[i].GeoCoordinates[0] < sensorCollection[j].GeoCoordinates[0]
	})

	// Assign x-logicalcoordinates to each sensor
	sameValueCount := 0
	for i, sensor := range sensorCollection {
		if i == 0 {
			sensor.Coordinates[0] = 0

		} else {
			if sensorCollection[i].GeoCoordinates[0] > sensorCollection[i-1].GeoCoordinates[0] {
				sensor.Coordinates[0] = i - sameValueCount

			} else {
				sameValueCount++
				sensor.Coordinates[0] = i - sameValueCount
			}
		}
	}

	// Sort the sensors by y-geocoordinate
	sort.Slice(sensorCollection, func(i, j int) bool {
		return sensorCollection[i].GeoCoordinates[1] < sensorCollection[j].GeoCoordinates[1]
	})

	sameValueCount = 0
	// Assign y-logicalcoordinates to each sensor
	for i, sensor := range sensorCollection {
		if i == 0 {
			sensor.Coordinates[1] = 0

		} else {
			if sensorCollection[i].GeoCoordinates[1] > sensorCollection[i-1].GeoCoordinates[1] {
				sensor.Coordinates[1] = i - sameValueCount

			} else {
				sameValueCount++
				sensor.Coordinates[1] = i - sameValueCount
			}
		}
	}

	// Assign z-logicalcoordinates to each sensor
	for _, sensor := range sensorCollection {
		sensor.Coordinates[2] = 1
	}

	sort.Slice(sensorCollection, func(i, j int) bool {
		return sensorCollection[i].GeoCoordinates[0] < sensorCollection[j].GeoCoordinates[0]
	})
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

func ReassignSensorIDs(sensorCollection []*Sensor) {
	for i, sensor := range sensorCollection {
		sensor.ID = i + 1
	}
}

//	func AssignNeighbors(sensor *Sensor, neighborIDs []int) {
//		sensor.Neighbors = neighborIDs
//	}
func DisplayGrid(grid [][]int) {
	for _, row := range grid {
		for _, value := range row {
			// if value == 0 {
			// 	fmt.Printf("%v  ", "-")
			// } else {
			fmt.Printf("%3d ", value)
			// }
		}
		fmt.Println()
		fmt.Println()
	}
}
func DisplaySensorCollection(sensorCollection []*Sensor) {
	// Find the minimum and maximum x and y coordinates of the sensors
	var minX, maxX, minY, maxY int
	for _, sensor := range sensorCollection {
		if sensor.Coordinates[0] < minX {
			minX = sensor.Coordinates[0]
		}
		if sensor.Coordinates[0] > maxX {
			maxX = sensor.Coordinates[0]
		}
		if sensor.Coordinates[1] < minY {
			minY = sensor.Coordinates[1]
		}
		if sensor.Coordinates[1] > maxY {
			maxY = sensor.Coordinates[1]
		}
	}

	// Create a grid of integer values to represent the sensors
	gridWidth := int(maxX-minX) + 1
	gridHeight := int(maxY-minY) + 1
	grid := make([][]string, gridHeight+1)
	for i := range grid {
		grid[i] = make([]string, gridWidth+1)
		for j := range grid[i] {
			if i == 0 {
				if j == 0 {
					grid[i][j] = " |   "
				} else {
					grid[i][j] = " " + strconv.Itoa(minY+j-1)
				}
			} else if j == 0 {
				grid[i][j] = strconv.Itoa(minX + i - 1)
			} else {
				grid[i][j] = "+"
			}
		}
	}

	// Assign the sensor IDs to the grid based on their coordinates
	for _, sensor := range sensorCollection {
		x := sensor.Coordinates[0] - minX
		y := sensor.Coordinates[1] - minY
		grid[y+1][x+1] = strconv.Itoa(sensor.ID)
	}

	// Convert the grid to a slice of integers
	intGrid := make([][]int, len(grid))
	for i := range grid {
		intGrid[i] = make([]int, len(grid[i]))
		for j := range grid[i] {
			intGrid[i][j], _ = strconv.Atoi(grid[i][j])
		}
	}

	// Display the grid using the DisplayGrid function
	DisplayGrid(intGrid)
}
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
				Coordinates:    []int{-1, -1, 1},
				Neighbors:      []int{},
			})
			uniqueSensors[key] = true
			nextSensorID++
		}
	}
	// sensorCollection = FilterSensors(sensorCollection, 50.0, 51.0, 12.0, 13.0)
	// filteredSensors := FilterSensors(sensorCollection, 48.0, 100.0, 12, 100.0)
	// filteredSensors := sensorCollection
	AssignLogicalCoordinates(sensorCollection)
	ReassignSensorIDs(sensorCollection)
	// FindAndAssignNeighbors(sensorCollection)
	FindAndAssignLogicalNeighbors(sensorCollection)
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

	// DisplayGrid(grid)
	SortSensorsByXY(sensorCollection)
	DisplaySensorCollection(sensorCollection)
}
