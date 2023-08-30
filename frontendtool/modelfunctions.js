// type Space struct {
//     ID             int       `json:"id"`
//     Description    string    `json:"description"`
//     Capacity       int       `json:"capacity"`
//     Longitude      float64   `json:"longitude"`
//     Latitude       float64   `json:"latitude"`
//     GeoCoordinates []float64 `json:"geoCoordinates"`
//     Coordinates    []int     `json:"coordinates"`
//     Neighbors      []int     `json:"neighbors"`
// }

//   type Sensor struct {
// 	//sensor
// 	// "id": 2,
// 	// "metasensor-id": 1,
// 	// "coverage": [2],
// 	// "coordinates": [3,2,1],
// 	// "geoCoordinates": [49.68163864109388,12.199289060635687,1]
// 	ID             int       `json:"id"`
// 	MetasensorID   int       `json:"metasensor-id"`
// 	Coverage       []int     `json:"coverage"`
// 	Coordinates    []int     `json:"coordinates"`
// 	GeoCoordinates []float64 `json:"geoCoordinates"`
// }


class Space {
    constructor(id, description, sensorType, capacity, longitude, latitude, geoCoordinates, coordinates, canvasCoordinates, neighbors) {
        this.id = id;
        this.description = description;
        this.sensorType = sensorType;
        this.capacity = capacity;
        this.longitude = longitude;
        this.latitude = latitude;
        this.geoCoordinates = geoCoordinates;
        this.coordinates = coordinates;
        this.canvasCoordinates = canvasCoordinates;
        this.neighbors = neighbors;
    }
}


class Sensor {
    constructor(id, metasensorId, sensorType, coverage, coordinates, geoCoordinates) {
        this.id = id;
        this.sensorType = sensorType;
        this.metasensorId = metasensorId;
        this.coverage = coverage;
        this.coordinates = coordinates;
        this.geoCoordinates = geoCoordinates;
    }
}

class SMARTEvent {
    constructor(id, description, metaEventId, profileIndex, spaceIds, capacityMetaPersonId, capacityRangeMin, capacityRangeMax, startDate, endDate, period, periodInterval, startTime, endTime, requiredAttendance) {
        this.id = id;
        this.description = description;
        this.metaEventId = metaEventId;
        this.profileIndex = profileIndex;
        this.spaceIds = spaceIds;
        this.capacityMetaPersonId = capacityMetaPersonId;
        this.capacityRangeMin = capacityRangeMin;
        this.capacityRangeMax = capacityRangeMax;
        this.startDate = startDate;
        this.endDate = endDate;
        this.period = period;
        this.periodInterval = periodInterval;
        this.startTime = startTime;
        this.endTime = endTime;
        this.requiredAttendance = requiredAttendance;
    }
}
