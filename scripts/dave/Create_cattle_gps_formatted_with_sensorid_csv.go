package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"os"
	"strconv"
	"time"
)

// SETTINGS
const filepath_cattle_gps_formatted_csv = "/root/MA/data/cattle-gps-formatted.csv"
const filepath_cattle_gps_sensors_json = "/root/MA/data/cattle-gps-sensors.json"
const filepath_cattle_gps_formatted_with_sensorid_csv = "/root/MA/data/cattle-gps-formatted-with-sensorid.csv"

// SETTINGS END

type CattleGPS struct {
	CattleID  int
	Timestamp time.Time
	Longitude float64
	Latitude  float64
	NMEAValid bool
}
type Sensor struct {
	ID             int       `json:"id"`
	MetasensorID   int       `json:"metasensor-id"`
	Coverage       []int     `json:"coverage"`
	Coordinates    []int     `json:"coordinates"`
	GeoCoordinates []float64 `json:"geoCoordinates"`
}

func GetSensorsFromJSONFile(filename string) ([]Sensor, error) {
	var mySensors []Sensor

	// Read the file
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	// Parse the JSON data
	err = json.Unmarshal(data, &mySensors)
	if err != nil {
		return nil, err
	}

	return mySensors, nil
}

func GetClosestSensorToCow(latitide float64, longitude float64, sensors []Sensor) Sensor {
	var closestSensor Sensor
	var closestDistance float64 = math.MaxFloat64
	for _, sensor := range sensors {
		var distanceToSensor = math.Sqrt(math.Pow(sensor.GeoCoordinates[0]-latitide, 2) + math.Pow(sensor.GeoCoordinates[1]-longitude, 2))
		if distanceToSensor <= closestDistance {
			closestSensor = sensor
			closestDistance = distanceToSensor
		}
	}
	return closestSensor
}
func main() {
	file, err := os.Open(filepath_cattle_gps_formatted_csv)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.FieldsPerRecord = -1
	rawCSVdata, err := reader.ReadAll()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	var cattleGPSList []CattleGPS

	for i, each := range rawCSVdata {
		if i < 1 {
			continue
		}
		cattleID, _ := strconv.Atoi(each[0])
		timestamp, _ := time.Parse("2006-01-02 15:04:05", each[1])
		longitude, _ := strconv.ParseFloat(each[2], 64)
		latitude, _ := strconv.ParseFloat(each[3], 64)
		nmeaValid := each[4] == "t"

		cattleGPS := CattleGPS{
			CattleID:  cattleID,
			Timestamp: timestamp,
			Longitude: longitude,
			Latitude:  latitude,
			NMEAValid: nmeaValid,
		}

		cattleGPSList = append(cattleGPSList, cattleGPS)
	}

	sensors, err := GetSensorsFromJSONFile(filepath_cattle_gps_sensors_json)
	if err != nil {
		fmt.Println(err)
	}

	// Create a new CSV file
	outputfile, err := os.Create(filepath_cattle_gps_formatted_with_sensorid_csv)
	if err != nil {
		panic(err)
	}
	defer outputfile.Close()

	// Write the header to the CSV file
	writer := csv.NewWriter(outputfile)
	header := []string{"cattle_id", "timestamp", "longitude", "latitude", "nmea_valid", "sensor_id"}
	err = writer.Write(header)
	if err != nil {
		panic(err)
	}

	// fmt.Println(cattleGPSList)
	// for i := 0; i < 1000 && i < len(cattleGPSList); i++ {
	for i := 0; i < len(cattleGPSList); i++ {
		var cattle = cattleGPSList[i]
		var closestSensor = GetClosestSensorToCow(cattle.Latitude, cattle.Longitude, sensors)
		row := []string{strconv.Itoa(cattle.CattleID), cattle.Timestamp.Format("2006-01-02 15:04:05"), strconv.FormatFloat(cattle.Longitude, 'f', 6, 64), strconv.FormatFloat(cattle.Latitude, 'f', 6, 64), strconv.FormatBool(cattle.NMEAValid), strconv.Itoa(closestSensor.ID)}
		err = writer.Write(row)
		if err != nil {
			panic(err)
		}
		if i < 100 {
			fmt.Println(i, "  ", cattleGPSList[i], " - closets Sensor: ", closestSensor)
		}
		if i == 100 {
			fmt.Println("...")
		}

	}

	// Flush any buffered data to the underlying writer (os.File)
	writer.Flush()

}
