package main

import (
	"encoding/csv"
	"fmt"
	"os"
	"sort"
)

func main() {
	countUniqueValues()
}
func countUniqueValues() {
	// Open the input file
	file, err := os.Open("/root/2022-ma-paul-pongratz/code/data/cattle-gps-formatted.csv")
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	// Create a CSV reader for the input file
	reader := csv.NewReader(file)

	// Read the header row
	header, err := reader.Read()
	if err != nil {
		fmt.Println("Error reading header row:", err)
		return
	}

	// Find the indices of the longitude and latitude columns
	var longitudeIndex, latitudeIndex int
	for i, column := range header {
		if column == "longitude" {
			longitudeIndex = i
		} else if column == "latitude" {
			latitudeIndex = i
		}
	}

	// Initialize maps to store unique longitude and latitude values
	uniqueLongitudes := make(map[string]int)
	uniqueLatitudes := make(map[string]int)

	// Read the remaining rows and count unique values
	for {
		row, err := reader.Read()
		if err != nil {
			break
		}
		// Increment the count for the longitude value
		if count, ok := uniqueLongitudes[row[longitudeIndex]]; ok {
			uniqueLongitudes[row[longitudeIndex]] = count + 1
		} else {
			uniqueLongitudes[row[longitudeIndex]] = 1
		}

		// Increment the count for the latitude value
		if count, ok := uniqueLatitudes[row[latitudeIndex]]; ok {
			uniqueLatitudes[row[latitudeIndex]] = count + 1
		} else {
			uniqueLatitudes[row[latitudeIndex]] = 1
		}
	}

	// Print the unique longitude values in ascending order
	fmt.Println("Unique longitudes:")
	printSortedKeys(uniqueLongitudes)

	// Print the unique latitude values in ascending order
	fmt.Println("Unique latitudes:")
	printSortedKeys(uniqueLatitudes)
}

// Helper function to print the keys of a map in ascending order
func printSortedKeys(m map[string]int) {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	for i, k := range keys {
		fmt.Printf("%d: %s - count: %d\n", i+1, k, m[k])
	}
}
