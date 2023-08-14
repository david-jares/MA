package main

import (
	"fmt"
	"math"
)

type Sensor struct {
	ID        int
	X         float64
	Y         float64
	Neighbors []int
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

func FindNeighbors(data []Sensor) map[int]map[Direction]Sensor {
	result := make(map[int]map[Direction]Sensor)

	for _, sensor := range data {
		neighbors := make(map[Direction]Sensor)
		directionDistances := make(map[Direction]float64)

		for _, other := range data {
			if other.ID == sensor.ID {
				continue
			}

			dx := other.X - sensor.X
			dy := other.Y - sensor.Y

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
	}
	return result
}

func main() {
	TestFindNeighbors()
	// data := []Sensor{
	// 	{ID: 1, X: 0, Y: 0},
	// 	{ID: 2, X: 1, Y: 1},
	// 	{ID: 3, X: 2, Y: 2},
	// 	{ID: 4, X: 3, Y: 1},
	// 	{ID: 5, X: 5, Y: 1},
	// 	{ID: 6, X: 5, Y: 2},
	// 	{ID: 7, X: 5, Y: 3},
	// 	{ID: 8, X: -1, Y: 0},
	// 	{ID: 9, X: -1, Y: -1},
	// 	{ID: 10, X: -2, Y: -1},
	// 	// ... Add more entries as needed
	// }

	// result := findNeighbors(data)
	// for id, neighbors := range result {
	// 	fmt.Printf("Sensor ID %d has neighbors:\n", id)
	// 	for direction, neighbor := range neighbors {
	// 		fmt.Printf("- %s: Sensor ID %d (X: %f, Y: %f)\n", direction, neighbor.ID, neighbor.X, neighbor.Y)
	// 	}
	// 	fmt.Println()
	// }
}

func TestFindNeighbors() {
	testData := []Sensor{
		{ID: 1, X: 1, Y: 1},
		{ID: 2, X: 0, Y: 2},
		{ID: 3, X: 1, Y: 2},
		{ID: 4, X: 2, Y: 2},
		{ID: 5, X: 2, Y: 1},
		{ID: 6, X: 2, Y: 0},
		{ID: 7, X: 1, Y: 0},
		{ID: 8, X: 0, Y: 0},
		{ID: 9, X: 0, Y: 1},
	}

	result := findNeighbors(testData)
	centralPointNeighbors := result[1]

	expectedNeighbors := map[Direction]int{
		TopLeft:     2,
		Above:       3,
		TopRight:    4,
		Right:       5,
		BottomRight: 6,
		Below:       7,
		BottomLeft:  8,
		Left:        9,
	}

	for direction, expectedID := range expectedNeighbors {
		if neighbor, exists := centralPointNeighbors[direction]; exists {
			if neighbor.ID != expectedID {
				fmt.Println("For direction %s, expected ID %d but got ID %d", direction, expectedID, neighbor.ID)
			}
		} else {
			fmt.Println("Neighbor not found for direction %s", direction)
		}
	}
	fmt.Println("Test complete")
}
