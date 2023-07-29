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
const spaceMinLat float64 = 48.0
const spaceMaxLat float64 = 49.0
const spaceMinLon float64 = 12.0
const spaceMaxLon float64 = 13.0

//sensor
// "id": 2,
// "metasensor-id": 1,
// "coverage": [2],
// "coordinates": [3,2,1],
// "geoCoordinates": [49.68163864109388,12.199289060635687,1]

// space
// "id": 1,
// "capacity": 10,
// "neighbors": [
// 	2, 19
// ],
// "coordinates": [3,3,1],
// "geoCoordinates": [49.68168614140271,12.199246531983448,1]

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

var nextSpaceID = 1

func PrintSpaces(spaceCollection []*Space) {

	maxDigits := 0
	for _, space := range spaceCollection {
		idStr := strconv.Itoa(space.ID)
		if len(idStr) > maxDigits {
			maxDigits = len(idStr)
		}
	}
	maxDigits++

	// Print the spaces with formatted neighbor IDs
	for _, space := range spaceCollection {
		neighborStrs := make([]string, 8)
		for i := 0; i < 8; i++ {
			if i < len(space.Neighbors) {
				neighborStrs[i] = fmt.Sprintf("%-*d", maxDigits, space.Neighbors[i])
			} else {
				neighborStrs[i] = strings.Repeat(" ", maxDigits)
			}
		}
		neighborStr := "[ " + strings.Join(neighborStrs, " ") + " ]"
		fmt.Printf("Space: %-*d   lat: %f   lon: %f   nbs: %s coords: %v\n", len(strconv.Itoa(nextSpaceID-1)), space.ID, space.Latitude, space.Longitude, neighborStr, space.Coordinates)
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
func SortSpacesByYX(spaceCollection []*Space) {
	sort.Slice(spaceCollection, func(i, j int) bool {
		if spaceCollection[i].Coordinates[1] == spaceCollection[j].Coordinates[1] {
			return spaceCollection[i].Coordinates[0] < spaceCollection[j].Coordinates[0]
		}
		return spaceCollection[i].Coordinates[1] < spaceCollection[j].Coordinates[1]
	})
}
func SortSpacesByXY(spaceCollection []*Space) {
	sort.Slice(spaceCollection, func(i, j int) bool {
		if spaceCollection[i].Coordinates[0] == spaceCollection[j].Coordinates[0] {
			return spaceCollection[i].Coordinates[1] < spaceCollection[j].Coordinates[1]
		}
		return spaceCollection[i].Coordinates[0] < spaceCollection[j].Coordinates[0]
	})
}

// func FindAndAssignNeighbors(data []*Space) map[int]map[Direction]*Space {
// 	result := make(map[int]map[Direction]*Space)

// 	for _, space := range data {
// 		neighbors := make(map[Direction]*Space)
// 		directionDistances := make(map[Direction]float64)

// 		for _, other := range data {
// 			if other.ID == space.ID {
// 				continue
// 			}

// 			dx := other.Latitude - space.Latitude
// 			dy := other.Longitude - space.Longitude

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
// 		result[space.ID] = neighbors
// 		neighborValues := make([]int, 0, len(neighbors))
// 		for _, neighbor := range neighbors {
// 			neighborValues = append(neighborValues, neighbor.ID)
// 		}
// 		// Sort the neighbor values in ascending order
// 		sort.Slice(neighborValues, func(i, j int) bool {
// 			return neighborValues[i] < neighborValues[j]
// 		})

// 		space.Neighbors = neighborValues
// 		// space.Latitude = 23.0
// 		// fmt.Println(space.Neighbors)
// 	}

//		return result
//	}

// must be called after Assigning Logical Coordinates
func FindAndAssignLogicalNeighbors(spaceCollection []*Space) {
	// Sort the spaces by x-geocoordinate
	sort.Slice(spaceCollection, func(i, j int) bool {
		return spaceCollection[i].Coordinates[0] < spaceCollection[j].Coordinates[0]
	})

	// Find neighbors for each space
	for i, space := range spaceCollection {

		if len(space.Neighbors) == 8 {
			continue
		}

		for j := i + 1; j < len(spaceCollection); j++ {
			otherSpace := spaceCollection[j]

			if AbsInt(space.Coordinates[0]-otherSpace.Coordinates[0]) <= 1 &&
				AbsInt(space.Coordinates[1]-otherSpace.Coordinates[1]) <= 1 {

				space.Neighbors = append(space.Neighbors, otherSpace.ID)
				if !containsInt(otherSpace.Neighbors, space.ID) {
					otherSpace.Neighbors = append(otherSpace.Neighbors, space.ID)
				}
			}
		}

		// if for some circumstance we didnt find any neighbours, increase the radius
		radius := 2
		for len(space.Neighbors) == 0 && radius < 10 {
			if len(space.Neighbors) == 0 {
				// for j := i + 1; j < len(spaceCollection); j++ {
				for j := 0; j < len(spaceCollection); j++ {
					otherSpace := spaceCollection[j]
					if otherSpace.ID == space.ID {
						continue
					}

					if AbsInt(space.Coordinates[0]-otherSpace.Coordinates[0]) <= radius &&
						AbsInt(space.Coordinates[1]-otherSpace.Coordinates[1]) <= radius {

						space.Neighbors = append(space.Neighbors, otherSpace.ID)
						if !containsInt(otherSpace.Neighbors, space.ID) {
							otherSpace.Neighbors = append(otherSpace.Neighbors, space.ID)
						}
					}
				}
			}
			radius++
		}
	}
}
func AssignLogicalCoordinates(spaceCollection []*Space) {
	// Sort the spaces by x-geocoordinate
	sort.Slice(spaceCollection, func(i, j int) bool {
		return spaceCollection[i].GeoCoordinates[0] < spaceCollection[j].GeoCoordinates[0]
	})

	// Assign x-logicalcoordinates to each space
	sameValueCount := 0
	for i, space := range spaceCollection {
		if i == 0 {
			space.Coordinates[0] = 0

		} else {
			if spaceCollection[i].GeoCoordinates[0] > spaceCollection[i-1].GeoCoordinates[0] {
				space.Coordinates[0] = i - sameValueCount

			} else {
				sameValueCount++
				space.Coordinates[0] = i - sameValueCount
			}
		}
	}

	// Sort the spaces by y-geocoordinate
	sort.Slice(spaceCollection, func(i, j int) bool {
		return spaceCollection[i].GeoCoordinates[1] < spaceCollection[j].GeoCoordinates[1]
	})

	sameValueCount = 0
	// Assign y-logicalcoordinates to each space
	for i, space := range spaceCollection {
		if i == 0 {
			space.Coordinates[1] = 0

		} else {
			if spaceCollection[i].GeoCoordinates[1] > spaceCollection[i-1].GeoCoordinates[1] {
				space.Coordinates[1] = i - sameValueCount

			} else {
				sameValueCount++
				space.Coordinates[1] = i - sameValueCount
			}
		}
	}

	// Assign z-logicalcoordinates to each space
	for _, space := range spaceCollection {
		space.Coordinates[2] = 1
	}

	sort.Slice(spaceCollection, func(i, j int) bool {
		return spaceCollection[i].GeoCoordinates[0] < spaceCollection[j].GeoCoordinates[0]
	})
}
func WriteSpaceCollectionToFile(spaceCollection []Space, filepath string) error {
	// Convert the spaceCollection slice to a JSON byte slice
	spaceCollectionJSON, err := json.Marshal(spaceCollection)
	if err != nil {
		return err
	}

	// Write the JSON byte slice to a file
	err = ioutil.WriteFile(filepath, spaceCollectionJSON, 0644)
	if err != nil {
		return err
	}

	return nil
}

func ReassignSpaceIDs(spaceCollection []*Space) {
	for i, space := range spaceCollection {
		space.ID = i + 1
	}
}

// should be called last in the process
func AddOutsideSpace(spaceCollection []*Space) []*Space {
	spaceCollection = append(spaceCollection, &Space{
		ID:             0,
		Description:    "outside",
		Capacity:       -1,
		Longitude:      spaceCollection[0].Longitude,
		Latitude:       spaceCollection[0].Latitude,
		GeoCoordinates: []float64{spaceCollection[0].Latitude, spaceCollection[0].Longitude, 1},
		Coordinates:    []int{0, 0, 0},
		Neighbors:      []int{1},
	})

	// now we do a hacky way to add the outside space to the neighbors of the first space
	for _, space := range spaceCollection {
		if space.ID == 1 {
			space.Neighbors = append(space.Neighbors, 0)
			break
		}
	}

	return spaceCollection
}

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
func DisplaySpaceCollection(spaceCollection []*Space) {
	// Find the minimum and maximum x and y coordinates of the spaces
	var minX, maxX, minY, maxY int
	for _, space := range spaceCollection {
		if space.Coordinates[0] < minX {
			minX = space.Coordinates[0]
		}
		if space.Coordinates[0] > maxX {
			maxX = space.Coordinates[0]
		}
		if space.Coordinates[1] < minY {
			minY = space.Coordinates[1]
		}
		if space.Coordinates[1] > maxY {
			maxY = space.Coordinates[1]
		}
	}

	// Create a grid of integer values to represent the spaces
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

	// Assign the space IDs to the grid based on their coordinates
	for _, space := range spaceCollection {
		x := space.Coordinates[0] - minX
		y := space.Coordinates[1] - minY
		grid[y+1][x+1] = strconv.Itoa(space.ID)
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
	fmt.Println("<<<<<<<<<<<< Creating Spaces... >>>>>>>>>>>>>")

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

	// // Create a collection of Space instances
	// spaceCollection := make([]Space, len(records)-1)
	// for i, record := range records[1:] {
	// 	id := nextSpaceID
	// 	nextSpaceID++
	// 	longitude, _ := strconv.ParseFloat(record[2], 64)
	// 	latitude, _ := strconv.ParseFloat(record[3], 64)

	// 	spaceCollection[i] = Space{
	// 		ID:        id,
	// 		Longitude: longitude,
	// 		Latitude:  latitude,
	// 		Neighbors: []int{},
	// 	}
	// }

	spaceCollection := []*Space{}
	uniqueSpaces := make(map[string]bool)
	for _, record := range records[1:] {
		longitude, _ := strconv.ParseFloat(record[2], 64)
		latitude, _ := strconv.ParseFloat(record[3], 64)

		if latitude < spaceMinLat || latitude > spaceMaxLat || longitude < spaceMinLon || longitude > spaceMaxLon {
			continue
		}

		id := nextSpaceID
		key := fmt.Sprintf("%f,%f", latitude, longitude)
		if _, ok := uniqueSpaces[key]; !ok {

			spaceCollection = append(spaceCollection, &Space{
				ID:             id,
				Description:    "Cattle GPS Space for the Field (exernal test data from simon)",
				Capacity:       -1,
				Longitude:      longitude,
				Latitude:       latitude,
				GeoCoordinates: []float64{latitude, longitude, 1},
				Coordinates:    []int{-1, -1, 1},
				Neighbors:      []int{},
			})
			uniqueSpaces[key] = true
			nextSpaceID++
		}
	}
	AssignLogicalCoordinates(spaceCollection)
	ReassignSpaceIDs(spaceCollection)
	// FindAndAssignNeighbors(spaceCollection)
	FindAndAssignLogicalNeighbors(spaceCollection)
	spaceCollection = AddOutsideSpace(spaceCollection)
	PrintSpaces(spaceCollection)

	// Write the spaceCollection to a file
	spaceSlice := make([]Space, len(spaceCollection))
	for i, s := range spaceCollection {
		spaceSlice[i] = *s
	}
	err = WriteSpaceCollectionToFile(spaceSlice, "/root/2022-ma-paul-pongratz/code/data/cattle-gps-spaces.json")
	if err != nil {
		panic(err)
	}

	// DisplayGrid(grid)
	SortSpacesByXY(spaceCollection)
	DisplaySpaceCollection(spaceCollection)
}
