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


class CanvasCoordinate{
    x: number;
    y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
}

class GeoCoordinate{
    lat: number;
    lon: number;

    constructor(lat: number, lon: number){
        this.lat = lat;
        this.lon = lon;
    }
}

class Space {
    id: number;
    description: string;
    sensorType: string;
    capacity: number;
    longitude: number;
    latitude: number;
    geoCoordinates: string;
    coordinates: string;
    canvasCoordinates: string;
    neighbors: number[];

    constructor(id: number, description: string, sensorType: string, capacity: number, longitude: number, latitude: number, geoCoordinates: string, coordinates: string, canvasCoordinates: string, neighbors: number[]) {
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
    id: number;
    metasensorId: number;
    sensorType: string;
    coverage: number;
    coordinates: string;
    geoCoordinates: string;

    constructor(id: number, metasensorId: number, sensorType: string, coverage: number, coordinates: string, geoCoordinates: string) {
        this.id = id;
        this.sensorType = sensorType;
        this.metasensorId = metasensorId;
        this.coverage = coverage;
        this.coordinates = coordinates;
        this.geoCoordinates = geoCoordinates;
    }
}

class SMARTEvent {
    id: number;
    description: string;
    metaeventId: number;
    profileIndex: number;
    spaceIds: number[];
    capacityMetaPersonId: number;
    capacityRangeMin: number;
    capacityRangeMax: number;
    startDate: Date;
    endDate: Date;
    period: string;
    periodInterval: number;
    startTime: string;
    endTime: string;
    requiredAttendance: number;
    color: string;

    constructor(id: number, description: string, metaeventId: number, profileIndex: number, spaceIds: number[], capacityMetaPersonId: number, capacityRangeMin: number, capacityRangeMax: number, startDate: Date, endDate: Date, period: string, periodInterval: number, startTime: string, endTime: string, requiredAttendance: number, color: string) {
        this.id = id;
        this.description = description;
        this.metaeventId = metaeventId;
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
        this.color = color;
    }
}
