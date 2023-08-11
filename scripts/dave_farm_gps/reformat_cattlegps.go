package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"math"
	"os"
	"strconv"
	"time"
)

// SETTINGS
const coordResolution_m float64 = 1000 // meters
const filepath_cattle_gps_csv = "/root/MA/data/cattle-gps.csv"
const filepath_cattle_gps_formatted_csv = "/root/MA/data/cattle-gps-formatted.csv"

// SETTINGS END
//---------------------------------

func truncateCoordinate(coordinate float64, resolution int) float64 {
	var factor float64
	if resolution >= 100000 {
		factor = 1.0 // degrees
	} else if resolution >= 10000 {
		factor = 10.0 // tens of kilometers
	} else if resolution >= 1000 {
		factor = 100.0 // kilometers
	} else if resolution >= 100 {
		factor = 1000.0 // hundreds of meters
	} else if resolution >= 10 {
		factor = 10000.0 // tens of meters
	} else if resolution >= 1 {
		factor = 100000.0 // meters
	} else {
		factor = 1000000.0 // centimeters
	}

	return math.Round(coordinate*factor) / factor
}

func main() {
	// Open the input file
	inputFile, err := os.Open(filepath_cattle_gps_csv)
	if err != nil {
		fmt.Println("Error opening input file:", err)
		return
	}
	defer inputFile.Close()

	// Create the output file
	outputFile, err := os.Create(filepath_cattle_gps_formatted_csv)
	if err != nil {
		fmt.Println("Error creating output file:", err)
		return
	}
	defer outputFile.Close()

	// Create a CSV reader and writer
	reader := csv.NewReader(inputFile)
	reader.Comma = ';'

	writer := csv.NewWriter(outputFile)

	// Read the header row
	header, err := reader.Read()
	if err != nil {
		fmt.Println("Error reading header row:", err)
		return
	}

	// Write the header row to the output file
	err = writer.Write(header)
	if err != nil {
		fmt.Println("Error writing header row:", err)
		return
	}

	// Read and format each data row
	for {
		// Read the next row
		row, err := reader.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			fmt.Println("Error reading row:", err)
			return
		}

		// Format the timestamp column
		timestamp, err := strconv.ParseInt(row[1], 10, 64)
		if err != nil {
			fmt.Println("Error parsing timestamp:", err)
			return
		}
		row[1] = time.Unix(timestamp/1000, (timestamp%1000)*int64(time.Millisecond)).Format("2006-01-02 15:04:05")

		// Format the longitude and latitude columns
		longitude, err := strconv.ParseFloat(row[2], 64)
		if err != nil {
			fmt.Println("Error parsing longitude:", err)
			return
		}

		latitude, err := strconv.ParseFloat(row[3], 64)
		if err != nil {
			fmt.Println("Error parsing latitude:", err)
			return
		}

		longitude = truncateCoordinate(longitude, int(coordResolution_m))
		latitude = truncateCoordinate(latitude, int(coordResolution_m))

		row[2] = strconv.FormatFloat(longitude, 'f', 9, 64)
		row[3] = strconv.FormatFloat(latitude, 'f', 9, 64)

		// Write the formatted row to the output file
		err = writer.Write(row)
		if err != nil {
			fmt.Println("Error writing row:", err)
			return
		}
	}

	// Flush the writer to write any remaining data to the output file
	writer.Flush()

	fmt.Println("File formatted successfully.")
}
