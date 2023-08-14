package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

// SETTINGS
const filepath_cattle_gps_csv = "/root/MA/data/cattle-gps.csv"

// SETTINGS END

func ParseCattleGPS(filename string) (map[int][7]interface{}, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	cattleMap := make(map[int][7]interface{})

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		fields := strings.Split(line, ";")
		if len(fields) != 5 {
			continue
		}
		id, err := strconv.Atoi(fields[0])
		if err != nil {
			continue
		}
		timestamp, err := strconv.ParseInt(fields[1], 10, 64)
		if err != nil {
			continue
		}
		longitude, err := strconv.ParseFloat(fields[2], 64)
		if err != nil {
			continue
		}
		latitude, err := strconv.ParseFloat(fields[3], 64)
		if err != nil {
			continue
		}
		tag := fields[4]

		if tag != "t" {
			continue
		}

		if _, ok := cattleMap[id]; !ok {
			cattleMap[id] = [7]interface{}{longitude, longitude, latitude, latitude, timestamp, timestamp, 1}
		} else {
			bounds := cattleMap[id]
			if longitude < bounds[0].(float64) {
				bounds[0] = longitude
			}
			if longitude > bounds[1].(float64) {
				bounds[1] = longitude
			}
			if latitude < bounds[2].(float64) {
				bounds[2] = latitude
			}
			if latitude > bounds[3].(float64) {
				bounds[3] = latitude
			}
			if timestamp < bounds[4].(int64) {
				bounds[4] = timestamp
			}
			if timestamp > bounds[4].(int64) {
				bounds[5] = timestamp
			}
			bounds[6] = bounds[6].(int) + 1
			cattleMap[id] = bounds
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	sortedIDs := make([]int, 0, len(cattleMap))
	for id := range cattleMap {
		sortedIDs = append(sortedIDs, id)
	}
	sort.Ints(sortedIDs)

	for _, id := range sortedIDs {
		bounds := cattleMap[id]
		fmt.Printf("Cattle %d: minLon=%f, maxLon=%f, minLat=%f, maxLat=%f, minTime=%v, maxTime=%v, count=%d\n", id, bounds[0], bounds[1], bounds[2], bounds[3], bounds[4], bounds[5], bounds[6])
	}

	return cattleMap, nil
}

func main() {
	fmt.Println("<<<<<<<<<<<< Analyzing Cattle Data... >>>>>>>>>>>>>")
	ParseCattleGPS(filepath_cattle_gps_csv)
}
