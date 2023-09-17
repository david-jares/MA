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
    cattleId: string;
    space: Space;

    constructor(timeStamp: string, cattleId: string, space: Space) {
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
    drawTextVertically: boolean;
    fontScale: number;
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

    constructor(id: number, screenDescription: string, description: string, drawTextVertically: boolean, fontScale: number, metaeventId: number, profileIndex: number, spaceIds: string, capacityMetaPersonId: number, capacityRangeMin: number, capacityRangeMax: number, startDate: string, endDate: string, period: string, periodInterval: number, startTime: string, endTime: string, requiredAttendance: string, colorRGB: string, colorAlpha: number) {
        this.id = id;
        this.description = description;
        this.screenDescription = screenDescription;
        this.drawTextVertically = drawTextVertically;
        this.fontScale = fontScale;
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

export class BridgePair {
    id: number;
    space1Id: number;
    space2Id: number;
    constructor(id: number, space1Id: number, space2Id: number) {
        this.id = id;
        this.space1Id = space1Id;
        this.space2Id = space2Id;
    }
}










//------------------ Exportable CONFIG Classes ------------------//

export class ExportableConfig {
    sensors: ExportableSensor[];
    spaces: ExportableSpace[];
    metasensors: ExportableMetasensor[];
    metaPeople: MetaPeople[];
    metaEvents: MetaEvent[];
    events: ExportableEvent[];
    people: MetaPerson[];
    learningConfig: ExportableLearningConfig;
    generationConfig: ExportableGenerationConfig;

    constructor(sensors: ExportableSensor[], spaces: ExportableSpace[], metasensors: ExportableMetasensor[], metaPeople: MetaPeople[], metaEvents: MetaEvent[], events: ExportableEvent[], people: MetaPerson[], learningConfig: ExportableLearningConfig, generationConfig: ExportableGenerationConfig) {
        this.sensors = sensors;
        this.spaces = spaces;
        this.metasensors = metasensors;
        this.metaPeople = metaPeople;
        this.metaEvents = metaEvents;
        this.events = events;
        this.people = people;
        this.learningConfig = learningConfig;
        this.generationConfig = generationConfig;
    }
}

//describes a logical space in SmartSPEC
/**
 * Describes a space in SmartSPEC.
 * @param id The id property should uniquely identify a space.
 * @param description The description property is optional and provides a user-friendly name for the space.
 * @param capacity The capacity property denotes the maximum number of people that can be in the space at the same time. -1 is a special value denoting that a space has infinite capacity.
 * @param coordinates The coordinates property denotes x,y,z coordinates. The coordinate system is arbitrarily defined by the user.
 * @param geoCoordinates not used in smartspec - The geoCoordinates property denotes latitude, longitude, and altitude coordinates. The coordinate system is arbitrarily defined by the user.
 * @param neighbors The neighbors property is a list of space ids that are adjacent to the space.
 * @param latitude not used in smartspec
 * @param longitude not used in smartspec
 */
export class ExportableSpace {
    id: number; //The id property should uniquely identify a space.
    description: string; //The description property is optional and provides a user-friendly name for the space.
    capacity: number; //The capacity property denotes the maximum number of people that can be in the space at the same time. -1 is a special value denoting that a space has infinite capacity.
    coordinates: number[];//The coordinates property denotes x,y,z coordinates. The coordinate system is arbitrarily defined by the user.
    neighbors: number[]; // the neighborspaces ids

    geoCoordinates: number[]; // not defined in smartspec
    latitude: number; // not defined in smartspec
    longitude: number; // not defined in smartspec

    constructor(id: number, description: string, capacity: number, coordinates: number[], geoCoordinates: number[], latitude: number, longitude: number, neighbors: number[]) {
        this.id = id;
        this.description = description;
        this.capacity = capacity;
        this.coordinates = coordinates;
        this.geoCoordinates = geoCoordinates;
        this.latitude = latitude;
        this.longitude = longitude;
        this.neighbors = neighbors;
    }

}

/**
 * Describes a sensor in SmartSPEC.
 * @param id The id property should uniquely identify a sensor.
 * @param description The description property is optional and provides a user-friendly name for the sensor.
 * @param metasensorId The metasensor-id property determines the metasensor group to which the sensor belongs.
 * @param coverage The coverage property is a list of space ids that the sensor covers.
 * @param coordinates Not used in smartspec - The coordinates property denotes x,y,z coordinates. The coordinate system is arbitrarily defined by the user.
 * @param geoCoordinates Not used in smartspec - The geoCoordinates property denotes latitude, longitude, and altitude coordinates. The coordinate system is arbitrarily defined by the user.
 * @param interval The interval property determines the periodic interval in minutes for which the sensor produces observations.
 */
export class ExportableSensor {
    id: number; //The id property should uniquely identify a sensor.
    description: string; //The description property is optional and provides a user-friendly name for the sensor.
    'metasensor-Id': number;
    mobility = "static"; //The mobility property is a string taking on one of the values "static" or "mobile". An in-situ sensor is modeled with mobility="static" and a list of covered spaces coverage=[int].
    coverage: number[];
    interval: number; // in minutes; The interval property determines the periodic interval in minutes for which the sensor produces observations.
    coordinates: number[]; //not defined in smartspec
    geoCoordinates: number[]; //not defined in smartspec
    constructor(id: number, description: string, metasensorId: number, coverage: number[], coordinates: number[], geoCoordinates: number[]) {
        this.id = id;
        this.description = description;
        this['metasensor-Id'] = metasensorId;
        this.coverage = coverage;
        this.coordinates = coordinates;
        this.geoCoordinates = geoCoordinates;
        this.interval = Math.round(useGlobalsStore().recordIntervalInSeconds / 60);
    }
}


/**
 * Describes a person in SmartSPEC.
 * @param id The id property should uniquely identify a person.
 * @param metapersonId The metaperson-id property determines the metaperson group to which the person belongs.
 * @param description The description property is optional and provides a user-friendly name for the person.
 * @param profileIndex The profile-index property denotes the time profile index to use in the associated metaperson entry.
 */
export class MetaPerson {
    id: number; //The id property should uniquely identify a person.
    "metaperson-id": number; //The metaperson-id property determines the metaperson group to which the person belongs.
    description: string; //The description property is optional and provides a user-friendly name for the person.
    "profile-index": number; //The profile-index property denotes the time profile index to use in the associated metaperson entry.

    constructor(id: number, metapersonId: number, description: string, profileIndex: number) {
        this.id = id;
        this["metaperson-id"] = metapersonId;
        this.description = description;
        this["profile-index"] = profileIndex;
    }
}


/**
 * Describes an event in SmartSPEC.
 * @param id The id property should uniquely identify an event.
 * @param metaeventId The metaevent-id property determines the metaevent group to which the event belongs.
 * @param description The description property is optional and provides a user-friendly name for the event.
 * @param timeProfileIndex The profile-index property denotes the time profile index to use in the associated metaevent entry.
 * @param spaceIds The `space-ids" property denotes the spaces in which the event can take place.
 * @param capacity The capacity property denotes the number of people of each type of metaperson. The range property specifies bounds ([lo, high]) on the number of people in attendance.
 */
export class ExportableEvent {
    id: number; //The id property should uniquely identify an event.
    'metaevent-Id': number; //The metaevent-id property determines the metaevent group to which the event belongs.
    description: string; //The description property is optional and provides a user-friendly name for the event.
    "profile-index": number; //The profile-index property denotes the time profile index to use in the associated metaevent entry.
    "space-ids": number[]; //The `space-ids" property denotes the spaces in which the event can take place.
    capacity: ExportableEventCapacityEntry[]; //The capacity property denotes the number of people of each type of metaperson. The range property specifies bounds ([lo, high]) on the number of people in attendance.

    constructor(id: number, metaeventId: number, description: string, timeProfileIndex: number, spaceIds: number[], capacity: ExportableEventCapacityEntry[]) {
        this.id = id;
        this['metaevent-Id'] = metaeventId;
        this.description = description;
        this["profile-index"] = timeProfileIndex;
        this["space-ids"] = spaceIds;
        this.capacity = capacity;
    }
}


/**
 *  The capacity property denotes the number of people of each type of metaperson. The range property specifies bounds ([lo, high]) on the number of people in attendance.
 * */ 
export class ExportableEventCapacityEntry {
    "metaperson-id": number;
    range: number[];

    constructor(metapersonId: number, range: number[]) {
        this["metaperson-id"] = metapersonId;
        this.range = range;
    }
}

/**
 *  describes a characterization of a group of similar people. 
 * @param id The id property should uniquely identify a metaperson.
 * @param description The description property is optional and provides a user-friendly name for the metaperson.
 * @param probability The probability property denotes the proportion of the population that the metaperson represents
 * @param timeProfiles The time profiles denote the days and times for which a person enters/exits the simulated space.
 * @param eventAffinity The event-affinity property denotes the probabilities with which people in this group of metapeople will attend events. The probabilities specified here should be relative to each other.
 */
export class MetaPeople {
    id: number; //The id property should uniquely identify a metaperson.
    description = "Default Cow"; //The description property is optional and provides a user-friendly name for the metaperson.
    probability = 1.0; //The probability property denotes the proportion of the population that the metaperson represents
    "time-profiles": TimeProfile[]; //The time profiles denote the days and times for which a person enters/exits the simulated space.
    "event-affinity": MetaEventAffinity[]; //The event-affinity property denotes the probabilities with which people in this group of metapeople will attend events. The probabilities specified here should be relative to each other.

    constructor(id: number, description: string, probability: number, timeProfiles: TimeProfile[], eventAffinity: MetaEventAffinity[]) {
        this.id = id;
        this.description = description;
        this.probability = probability;
        this["time-profiles"] = timeProfiles;
        this["event-affinity"] = eventAffinity;
    }
}

/**
 * this is not defined in smartspec, but we still have it as Paul said he took it from smartspec - ask Paul if we need to clarify its application use case
 */
export class ExportableMetasensor {
    id: number;
    description: string;
    constructor(id: number, description: string) {
        this.id = id;
        this.description = description;
    }
}




/**
 * MetaEvents describes a characterization of a group of similar events
 * @param id The id property should uniquely identify a metaevent.
 * @param description The description property is optional and provides a user-friendly name for the metaevent.
 * @param probability The probability property denotes the number of events in the metaevent group. It is used to generate additional events. The number is normalized to become a proportion.
 * @param spaces The spaces property denotes the potential spaces for which events in this metaevent group take place. In the generation process, number spaces are selected at random from the space-ids list.
 * @param timeProfiles The time profiles denote the days and times for which an event occurs.
 * @param capacity The capacity property denotes the attendance ranges for different types of metapeople. The lo and hi properties denote mean and standard deviation parameters for a Normal distribution.
 */
export class MetaEvent {
    id: number; //The id property should uniquely identify a metaevent.
    description: string; //The description property is optional and provides a user-friendly name for the metaevent.
    probability: number; //The probability property denotes the number of events in the metaevent group. It is used to generate additional events. The number is normalized to become a proportion.
    spaces: MetaEventSpace[]; //he spaces property denotes the potential spaces for which events in this metaevent group take place. In the generation process, number spaces are selected at random from the space-ids list.
    "time-profiles": TimeProfile[]; //The time profiles denote the days and times for which an event occurs.
    capacity: MetaEventCapacity[]; //The capacity property denotes the attendance ranges for different types of metapeople. The lo and hi properties denote mean and standard deviation parameters for a Normal distribution.

    constructor(id: number, description: string, probability: number, spaces: MetaEventSpace[], timeProfiles: TimeProfile[], capacity: MetaEventCapacity[]) {
        this.id = id;
        this.description = description;
        this.probability = probability;
        this.spaces = spaces;
        this["time-profiles"] = timeProfiles;
        this.capacity = capacity;
    }

}

/**
 * The capacity property denotes the attendance ranges for different types of metapeople.
 * The lo and hi properties denote mean and standard deviation parameters for a Normal distribution.
 */
export class MetaEventCapacity {
    "metaperson-id": number;
    lo: number[];
    hi: number[];
    constructor(metapersonId: number, lowMean: number, lowStandardDeviation: number, highMean: number, highStandardDeviation: number) {
        this["metaperson-id"] = metapersonId;
        this.lo = [lowMean, lowStandardDeviation];
        this.hi = [highMean, highStandardDeviation];
    }
}


/**
 * The spaces property denotes the potential spaces for which events in this metaevent group take place. 
 * In the generation process, number spaces are selected at random from the space-ids list.
 */
export class MetaEventSpace {
    "space-ids": number[];
    "number": number;
    constructor(spaceIds: number[], number: number) {
        this["space-ids"] = spaceIds;
        this.number = number;
    }
}

/**
 * The event-affinity property denotes the probabilities with which people in this group of metapeople will attend events. The probabilities specified here should be relative to each other.
 */
export class MetaEventAffinity {
    "metaevent-id": number;
    "probability": number;
    constructor(metaeventId: number, probability: number) {
        this["metaevent-id"] = metaeventId;
        this.probability = probability;
    }
}


/**
 * TimeProfile: Used for both MetaPeople and MetaEvents; it denotes an "active" time period for an "active" day.
 *  The semantics of an "active" day and time depends on the object it describes: an active day/time for an event denotes when the event occurs,
 *  and an active day/time for a person denotes the expected time of entry/exit from the simulated space.
 *  @param startDate The start-date and end-date properties are strings in the form of 'YYYY-MM-DD' and denote the start/end dates of the time profile pattern
 * @param endDate The start-date and end-date properties are strings in the form of 'YYYY-MM-DD' and denote the start/end dates of the time profile pattern
 * @param startTime The start-time and end-time properties are strings in the form 'HH:MM:SS' and denote the start/end times for a given active day. The 2-list represents a mean time and standard deviation time as parameters to a Normal distribution.
 * @param endTime The start-time and end-time properties are strings in the form 'HH:MM:SS' and denote the start/end times for a given active day. The 2-list represents a mean time and standard deviation time as parameters to a Normal distribution.
 * @param requiredAttendance The required property denotes the minimum duration of an active period -- for people, this denotes the minimum amount of time that they must be able to attend an event before committing, and for events, this denotes the minimum amount of time that the event spans. The required property is defined by a mean time and standard deviation time, also as parameters to a Normal distribution.
 */
export class TimeProfile {
    probability: number;
    profile: any[];


    constructor(startDate: string, endDate: string, startTime: string, endTime: string, requiredAttendance: string, probability = 1) {
        this.probability = probability;
        this.profile = [
            {
                "pattern": {
                    "start-date": startDate, //The start-date and end-date properties are strings in the form of 'YYYY-MM-DD' and denote the start/end dates of the time profile pattern
                    "end-date": endDate,
                    "period": "day",
                    "period-details": {
                        "repeat-every": 1
                    }
                },
                "duration": {
                    "start-time": [startTime, "00:02:00"], //The start-time and end-time properties are strings in the form 'HH:MM:SS' and denote the start/end times for a given active day. The 2-list represents a mean time and standard deviation time as parameters to a Normal distribution.
                    "end-time": [endTime, "00:02:00"],
                    "required": [requiredAttendance, "00:01:00"], //The required property denotes the minimum duration of an active period -- for people, this denotes the minimum amount of time that they must be able to attend an event before committing, and for events, this denotes the minimum amount of time that the event spans. The required property is defined by a mean time and standard deviation time, also as parameters to a Normal distribution.
                }
            }
        ]
    }
}


/**
 * a configuration file used to run SmartSPEC in the scenario learning phase.
 * @param startDate the start date (expressed as 'YYYY-MM-DD') for learning. 
 * @param endDate the end date (expressed as 'YYYY-MM-DD') for learning.
 * @param unit unit denotes the number of minutes to group connection events
 * @param validity validity refers to the number of minutes for which the client will stay around the sensor. 
 * @param smooth smooth and window are used to indicate the type of smoothening function to apply to the occupancy graphs; use smooth=SMA to apply a simple moving average and smooth=EMA to apply an exponential moving average.
 * @param window smooth and window are used to indicate the type of smoothening function to apply to the occupancy graphs; use smooth=SMA to apply a simple moving average and smooth=EMA to apply an exponential moving average.
 * @param timethresh time-thresh determines a minimum duration (minutes) required to realize an event.
 * @param occThresh occ-thresh determines the minimum number of attendees required to realize an event.
 */
export class ExportableLearningConfig {
    startDate: string; // format 2022-04-26 
    endDate: string;
    unit: number;
    validity: number;
    smooth: string;
    window: number;
    timethresh: number;
    occthresh: number; //written occ-thresh
    constructor(startDate: string, endDate: string, unit: number, validity: number, smooth: string, window: number, timethresh: number, occThresh: number) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.unit = unit;
        this.validity = validity;
        this.smooth = smooth;
        this.window = window;
        this.timethresh = timethresh;
        this.occthresh = occThresh;
    }
    ToString(): string {
        let result = "";
        result += '[learners]\n';
        result += 'start = ' + this.startDate + '\n';
        result += 'end = ' + this.endDate + '\n';
        result += 'unit = ' + this.unit + '\n';
        result += 'validity = ' + this.validity + '\n';
        result += 'smooth = ' + this.smooth + '\n';
        result += 'window = ' + this.window + '\n';
        result += 'time-thresh = ' + this.timethresh + '\n';
        result += 'occ-thresh = ' + this.occthresh + '\n';
        result += '\n';

        return result;
    }
}

/**
 * a configuration file used to run SmartSPEC in the scenario generation phase
 * @param peopleNumber number refers to the number of people to simulate 
 * @param peopleGeneration generation refers to the manner in which new people (if any) should be added. If generation=none, then number is ignored and the people specified in filepaths/people will be used. If generation=diff, then one of each metaperson will first be generated (up to number), then additional people will be added (up to number). If generation=all, then number people will be generated using metapeople
 * @param eventsNumber number of events to simulate
 * @param eventsGeneration generation refers to the manner in which new events (if any) should be added. If generation=none, then number is ignored and the events specified in filepaths/people will be used. If generation=diff, then one of each metaevent will first be generated (up to number), then additional events will be added (up to number). If generation=all, then number events will be generated using metaevents
 * @param startDate the start date (expressed as 'YYYY-MM-DD') for the simulation.
 * @param endDate the end date (expressed as 'YYYY-MM-DD') for simulation.
 */
export class ExportableGenerationConfig {
    peopleNumber: number;
    peopleGeneration: string;

    eventsNumber: number;
    eventsGeneration: string;

    startDate: string; //2022-04-26 
    endDate: string;

    constructor(peopleNumber: number, peopleGeneration: string, eventsNumber: number, eventsGeneration: string, startDate: string, endDate: string) {
        this.peopleNumber = peopleNumber;
        this.peopleGeneration = peopleGeneration;
        this.eventsNumber = eventsNumber;
        this.eventsGeneration = eventsGeneration;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    ToString(): string {
        let result = "";
        result += '[people]\n';
        result += 'number = ' + this.peopleNumber + '\n';
        result += 'generation = ' + this.peopleGeneration + '\n';
        result += '\n';
        result += '[events]\n';
        result += 'number = ' + this.eventsNumber + '\n';
        result += 'generation = ' + this.eventsGeneration + '\n';
        result += '\n';
        result += '[synthetic-data-generator]\n';
        result += 'start = ' + this.startDate + '\n';
        result += 'end = ' + this.endDate + '\n';
        result += '\n';

        return result;
    }


}