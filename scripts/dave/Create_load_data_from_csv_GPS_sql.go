package main

import (
	"encoding/csv"
	"fmt"
	"os"
	"strconv"
	"time"
)

type CattleGPS struct {
	CattleID  int
	Timestamp time.Time
	Longitude float64
	Latitude  float64
	NMEAValid bool
}

func main() {
	file, err := os.Open("/root/2022-ma-paul-pongratz/code/data/cattle-gps-formatted.csv")
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

	// fmt.Println(cattleGPSList)
	for i := 0; i < 10 && i < len(cattleGPSList); i++ {
		fmt.Println(cattleGPSList[i])
	}
}
