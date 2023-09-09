import type { CanvasCoordinate, GeoCoordinate, SMARTEvent, Sensor, Space } from '@/myfunctions/model';
import type { Point } from '@/myfunctions/tempfunctions';
import { Rectangle } from '@/myfunctions/utilityfunctions';
import { defineStore } from 'pinia';
import type { ref } from 'vue';

interface GlobalsState {

    mousePosition: Point;

    canvasRef: any;
    ctx: CanvasRenderingContext2D | null;
    canvasWidth: number;
    canvasHeight: number;
    canvasPanOffsetX: number;
    canvasPanOffsetY: number;


    cowId: string;
    recordIntervalInSeconds: number;
    recordDurationInDays: number;
    timeSpeedMultiplier: number;
    sensorWidthInMeters: number;
    recordedData: any[];
    sensors: Sensor[];
    spaces: Space[];
    loops: number;
    isCowInBarn: boolean;
    isCowInPasture: boolean;

    nextEventID: number;
    nextUtilityId: number;
    smartEvents: SMARTEvent[];

    coordinatesPasture: GeoCoordinate[];
    coordinatesBarn: GeoCoordinate[];
    coordinatesCombined: GeoCoordinate[];


    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;

    scaleX: number;
    scaleY: number;
    scaledCoordinatesCombined: CanvasCoordinate[];

    tipEventDescription: string;
    tipEventId: string;
    tipEventMetaeventId: string;
    tipEventProfileIndex: string;
    tipEventSpaceIds: string;
    tipEventCapacity: string;





}

export const useGlobalsStore = defineStore({
    id: 'globals',  // unique id of the store
    state: (): GlobalsState => ({

       
        mousePosition: { x: 0, y: 0 },
        sensors: [],
        spaces: [],
        recordedData: [],


        ctx: null,
        canvasRef: null,
        canvasWidth: 800,
        canvasHeight: 600,
        canvasPanOffsetX: 0,
        canvasPanOffsetY: 0,
        cowId: '1',
        recordIntervalInSeconds: 60,
        recordDurationInDays: 2,
        timeSpeedMultiplier: 600,
        sensorWidthInMeters: 40,
        loops: 0,

        isCowInBarn: false,
        isCowInPasture: false,

        nextEventID: 1,
        nextUtilityId: 1,
        smartEvents: [{
            id: 1,
            description: "watering",
            metaeventId: 1,
            profileIndex: 1,
            spaceIds: '1,2,3',
            capacityMetaPersonId: 1,
            capacityRangeMin: 1,
            capacityRangeMax: 10000,
            startDate: "2021-01-01",
            endDate: "2021-02-01",
            period: 'day',
            periodInterval: 1,
            startTime: "00:00",
            endTime: "23:59",
            requiredAttendance: '02:00',
            colorRGB: "#00FFFF",
            colorAlpha:0.5
        }, {
            id: 2,
            description: "feeding",
            metaeventId: 1,
            profileIndex: 1,
            spaceIds: '11,12,13',
            capacityMetaPersonId: 1,
            capacityRangeMin: 1,
            capacityRangeMax: 10000,
            startDate: "2021-01-01",
            endDate: "2021-02-01",
            period: 'day',
            periodInterval: 1,
            startTime: "12:00",
            endTime: "14:00",
            requiredAttendance: '02:00',
            colorRGB: "#0000FF",
            colorAlpha:0.5
        }],
        coordinatesPasture: [
            { lat: 49.68101400333333, lon: 12.20009942 },
            { lat: 49.68115214666667, lon: 12.200764548333334 },
            { lat: 49.682404365, lon: 12.199464525 },
            { lat: 49.68266766333333, lon: 12.197345735 },
            { lat: 49.68249247666667, lon: 12.197450201666667 },
            // { lat: 49.68194168, lon: 12.198492973333334 },
            { lat: 49.681985108333336, lon: 12.198418175 },
            { lat: 49.68204832833333, lon: 12.199110575 },

            { lat: 49.681460, lon: 12.199756 },
            { lat: 49.681411, lon: 12.199547 },
            { lat: 49.681353, lon: 12.199602 },
            { lat: 49.681414, lon: 12.199807 },


            { lat: 49.68131979333333, lon: 12.199891363333334 },
            { lat: 49.68111546833333, lon: 12.200051731666667 }
        ],
        coordinatesBarn: [
            { lat: 49.681676, lon: 12.199107 },//B
            { lat: 49.681592, lon: 12.198746 },//C
            { lat: 49.681077, lon: 12.199190 },//D
            { lat: 49.681172, lon: 12.199589 },//E
        ],
        //    coordinatesBarn: [
        //     { lat: 49.681714, lon: 12.199252 },
        //     { lat: 49.681642, lon: 12.198957 },
        //     { lat: 49.681133, lon: 12.199435 },
        //     { lat: 49.681212, lon: 12.199739 }
        // ],
        coordinatesCombined: [
            { lat: 49.68101400333333, lon: 12.20009942 },
            { lat: 49.68115214666667, lon: 12.200764548333334 },
            { lat: 49.682404365, lon: 12.199464525 },
            { lat: 49.68266766333333, lon: 12.197345735 },
            { lat: 49.68249247666667, lon: 12.197450201666667 },
            // { lat: 49.68194168, lon: 12.198492973333334 },
            { lat: 49.681985108333336, lon: 12.198418175 },
            { lat: 49.68204832833333, lon: 12.199110575 },


            { lat: 49.681460, lon: 12.199756 }, //H
            // { lat: 49.681411, lon: 12.199547 },
            { lat: 49.681379, lon: 12.199409 },//A


            { lat: 49.681676, lon: 12.199107 },//B
            { lat: 49.681592, lon: 12.198746 },//C
            { lat: 49.681077, lon: 12.199190 },//D
            { lat: 49.681172, lon: 12.199589 },//E


            { lat: 49.681317, lon: 12.199459 },//F
            { lat: 49.681411, lon: 12.199809 },//G


            { lat: 49.68131979333333, lon: 12.199891363333334 },
            { lat: 49.68111546833333, lon: 12.200051731666667 }
        ],
        // coordinatesCombined: [
        //     { lat: 49.68101400333333, lon: 12.20009942 },
        //     { lat: 49.68115214666667, lon: 12.200764548333334 },
        //     { lat: 49.682404365, lon: 12.199464525 },
        //     { lat: 49.68266766333333, lon: 12.197345735 },
        //     { lat: 49.68249247666667, lon: 12.197450201666667 },
        //     // { lat: 49.68194168, lon: 12.198492973333334 },
        //     { lat: 49.681985108333336, lon: 12.198418175 },
        //     { lat: 49.68204832833333, lon: 12.199110575 },


        //     { lat: 49.681460, lon: 12.199756 },
        //     { lat: 49.681411, lon: 12.199547 },


        //     { lat: 49.681714, lon: 12.199252 },
        //     { lat: 49.681642, lon: 12.198957 },
        //     { lat: 49.681133, lon: 12.199435 },
        //     { lat: 49.681212, lon: 12.199739 },


        //     { lat: 49.681353, lon: 12.199602 },
        //     { lat: 49.681414, lon: 12.199807 },


        //     { lat: 49.68131979333333, lon: 12.199891363333334 },
        //     { lat: 49.68111546833333, lon: 12.200051731666667 }
        // ],
        tipEventDescription: "a human understandable description of this event",
        tipEventId: "The id property should uniquely identify an event",
        tipEventMetaeventId: "The metaevent-id property determines the metaevent group to which the event belongs.",
        tipEventProfileIndex: "The profile-index property denotes the time profile index to use in the associated metaevent entry.",
        tipEventSpaceIds: "The space-ids property denotes the spaces in which the event can take place",
        tipEventCapacity: "The capacity property denotes the number of people of each type of metaperson. The range property specifies bounds ([lo, high]) on the number of people in attendance.",
        
        get minLat(): number { return Math.min(...this.coordinatesCombined.map(p => p.lat)) },
        get maxLat(): number { return Math.max(...this.coordinatesCombined.map(p => p.lat)) },
        get minLon(): number { return Math.min(...this.coordinatesCombined.map(p => p.lon)) },
        get maxLon(): number { return Math.max(...this.coordinatesCombined.map(p => p.lon)) },

        get scaleX(): number { return this.canvasWidth / (this.maxLon - this.minLon); },
        get scaleY(): number { return this.canvasHeight / (this.maxLat - this.minLat) },

        get scaledCoordinatesCombined(): CanvasCoordinate[] {
            return this.coordinatesCombined.map(point => {
                return {
                    x: (point.lon - this.minLon) * this.scaleX,
                    y: this.canvasHeight - (point.lat - this.minLat) * this.scaleY
                };
            });
        }
    }),


    getters: {
        // getName(): string {
        //     return this.name;
        // }
    },
    actions: {
        getNextEventID(): number {
            if (this.smartEvents.length == 0) {
                return 1;
            } else {
                return Math.max(...this.smartEvents.map(e => e.id)) + 1;
            }
            // return this.nextEventID++;
        },
        addDefaultEvent(): number {
            console.log("addEvent");
            let event: SMARTEvent = {
                // gs.smartEvents.push({
                id: this.getNextEventID(),
                description: "defaultevent",
                // cowId: '1',
                metaeventId: 1,
                profileIndex: 1,
                spaceIds: '1',
                capacityMetaPersonId: 1,
                capacityRangeMin: 1,
                capacityRangeMax: 10000,
                startDate: "2021-01-01",
                endDate: "2021-02-01",
                period: 'day',
                periodInterval: 1,
                startTime: "00:00",
                endTime: "23:59",
                requiredAttendance: '02:00',
                colorRGB: "#FF0000",
                colorAlpha:0.5
            }
            this.smartEvents.push(event);
            return event.id;
        },
        updateSmartEvent(eventid: number, property: string, value: any) {
            let event = this.smartEvents.find(e => e.id == eventid);
            if (event) {
                // @ts-ignore
                event[property] = value;
            }
        },
        removeSmartEvent(eventid: number) {
            const index = this.smartEvents.findIndex(event => event.id === eventid);
            if (index !== -1) {
                this.smartEvents.splice(index, 1);
            }
        }
    }
    // }
    // setName(newName: string) {
    //     this.name = newName;
    // },
    // incrementAge() {
    //     this.age++;
    // },
    // },
});

// console.log("Globals store created");