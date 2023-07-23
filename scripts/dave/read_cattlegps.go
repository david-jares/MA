package main

import (
	"encoding/csv"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type CattleGPS struct {
	ID        int
	Timestamp int64
	Longitude float64
	Latitude  float64
	NMEAValid bool
}

type CattleGPSContainer struct {
	CattleGPSList []CattleGPS
}

func (c *CattleGPSContainer) Add(cattleGPS CattleGPS) {
	c.CattleGPSList = append(c.CattleGPSList, cattleGPS)

	measurementsMapLongitude[cattleGPS.Longitude] = true
	measurementsMapLatitude[cattleGPS.Latitude] = true
	if cattleGPS.Longitude < longMin {
		longMin = cattleGPS.Longitude
	}
	if cattleGPS.Longitude > longMax {
		longMax = cattleGPS.Longitude
	}
	if cattleGPS.Latitude < latMin {
		latMin = cattleGPS.Latitude
	}
	if cattleGPS.Latitude > latMax {
		latMax = cattleGPS.Latitude
	}

}

var longMin float64 = 1000000
var longMax float64 = 0
var latMin float64 = 1000000
var latMax float64 = 0
var measurementsMapLongitude = make(map[float64]bool)
var measurementsMapLatitude = make(map[float64]bool)

func main() {
	// Open the CSV file
	file, err := os.Open("^/root/2022-ma-paul-pongratz/code/data/cattle-gps.csv")
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer file.Close()

	// Parse the CSV file
	reader := csv.NewReader(file)
	reader.Comma = ';'
	reader.FieldsPerRecord = -1
	lines, err := reader.ReadAll()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	// Create a container for the CattleGPS data
	container := CattleGPSContainer{}

	// Loop through each line of the CSV file and parse the data
	for i, line := range lines {
		if i == 0 {
			continue // Skip header row
		}

		// Parse the data from the CSV file
		id, _ := strconv.Atoi(strings.TrimSpace(line[0]))
		timestamp, _ := strconv.ParseInt(strings.TrimSpace(line[1]), 10, 64)
		longitude, _ := strconv.ParseFloat(strings.TrimSpace(line[2]), 64)
		latitude, _ := strconv.ParseFloat(strings.TrimSpace(line[3]), 64)
		nmeaValid := strings.TrimSpace(line[4]) == "t"

		// Create a CattleGPS object and add it to the container
		cattleGPS := CattleGPS{
			ID:        id,
			Timestamp: timestamp,
			Longitude: longitude,
			Latitude:  latitude,
			NMEAValid: nmeaValid,
		}
		container.Add(cattleGPS)
	}

	fmt.Println("Number of CattleGPS  Latitude :", len(measurementsMapLatitude))
	fmt.Println("Number of CattleGPS  Longitude:", len(measurementsMapLongitude))

	fmt.Println("Latitude  Min:", latMin)
	fmt.Println("Latitude  Max:", latMax)
	fmt.Println("Longitude Min:", longMin)
	fmt.Println("Longitude Max:", longMax)

	// Get the counts of each value for longitude and latitude
	// longitudeCounts := container.GetLongitudeCounts()
	// latitudeCounts := container.GetLatitudeCounts()

	// Print out the counts of each value for longitude

}
