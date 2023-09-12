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

import { useGlobalsStore } from "@/stores/globals";
import { Rectangle } from "./utilityfunctions";
import { GeoCoordToCanvasPoint, scale } from "./canvashelperfunctions";
import type { Point } from "./tempfunctions";

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

export class RecordEntry {
    timeStamp: string;
    cattleId: number;
    space: Space;

    constructor(timeStamp: string, cattleId: number, space: Space) {
        this.timeStamp = timeStamp;
        this.cattleId = cattleId;
        this.space = space;
    }
}

export class CanvasCoordinate {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class GeoCoordinate {
    lat: number;
    lon: number;

    constructor(lat: number, lon: number) {
        this.lat = lat;
        this.lon = lon;
    }
}

export class Space {
    id: number;
    description: string;
    sensorType: string;
    capacity: number;
    longitude: number;
    latitude: number;
    geoCoordinates: number[];
    coordinates: number[]; // logical coordinate ( eg [0,1,1])
    canvasCoordinates: number[];
    neighbors: number[];
    priority: number; // drawing priority if we have multiple overlapping spaces, then the one with higher priority will be chose
    pathGeoCoords: GeoCoordinate[]; // for the barn quads we need the points to draw them as polygons
    isRectOverlappinBarn: boolean; // when computing the spaces we also remember if they overlap with the barn
    constructor(id: number, description: string, sensorType: string, capacity: number, longitude: number, latitude: number, geoCoordinates: number[], coordinates: number[], canvasCoordinates: number[], neighbors: number[], priority: number, pathGeoCoords: GeoCoordinate[] = [], isRectOverlappinBarn: boolean = false) {
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

        this.priority = priority;
        this.pathGeoCoords = pathGeoCoords;
        this.isRectOverlappinBarn = isRectOverlappinBarn;
    }

    getCanvasRectangle(): Rectangle {
        let gs = useGlobalsStore();
        return new Rectangle(this.id, this.canvasCoordinates[0] - (gs.sensorWidthInMeters * scale.value / 2), this.canvasCoordinates[1] - (gs.sensorWidthInMeters * scale.value / 2), gs.sensorWidthInMeters * scale.value, gs.sensorWidthInMeters * scale.value);
    }
    getCanvasPathCoords(): Point[] {
        return this.pathGeoCoords.map(x => GeoCoordToCanvasPoint(x));
    }
}

export class Sensor {
    id: number;
    metasensorId: number;
    sensorType: string;
    coverage: number[];
    coordinates: number[];
    geoCoordinates: number[];

    constructor(id: number, metasensorId: number, sensorType: string, coverage: number[], coordinates: number[], geoCoordinates: number[]) {
        this.id = id;
        this.sensorType = sensorType;
        this.metasensorId = metasensorId;
        this.coverage = coverage;
        this.coordinates = coordinates;
        this.geoCoordinates = geoCoordinates;
    }
}

export class SMARTEvent {
    id: number;
    description: string;
    screenDescription: string;
    metaeventId: number;
    profileIndex: number;
    spaceIds: string;
    capacityMetaPersonId: number;
    capacityRangeMin: number;
    capacityRangeMax: number;
    startDate: string;
    endDate: string;
    period: string;
    periodInterval: number;
    startTime: string;
    endTime: string;
    requiredAttendance: string;
    colorRGB: string;
    colorAlpha: number;

    constructor(id: number,screenDescription:string, description: string, metaeventId: number, profileIndex: number, spaceIds: string, capacityMetaPersonId: number, capacityRangeMin: number, capacityRangeMax: number, startDate: string, endDate: string, period: string, periodInterval: number, startTime: string, endTime: string, requiredAttendance: string, colorRGB: string, colorAlpha: number) {
        this.id = id;
        this.description = description;
        this.screenDescription = screenDescription;
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
        this.colorRGB = colorRGB;
        this.colorAlpha = colorAlpha;
    }
}
