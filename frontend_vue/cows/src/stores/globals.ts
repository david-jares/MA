import type { CanvasCoordinate, GeoCoordinate, RecordEntry, SMARTEvent, Sensor, Space } from '@/myfunctions/model';
import type { Point } from '@/myfunctions/tempfunctions';
import { Rectangle, getTimeInSeconds } from '@/myfunctions/utilityfunctions';
import { defineStore } from 'pinia';
import type { ref } from 'vue';

interface GlobalsState {

    mousePosition: Point;
    now : Date;

    canvasRef: any;
    ctx: CanvasRenderingContext2D | null;
    canvasWidth: number;
    canvasHeight: number;
    canvasPanOffsetX: number;
    canvasPanOffsetY: number;


    cowId: string;
    recordIntervalInSeconds: number;
    recordDurationInDays: number;
    stepsPerSecond: number;
    sensorWidthInMeters: number;
    recordings: RecordEntry[];
    sensors: Sensor[];
    spaces: Space[];
    spaceNeighborCache: Map<number, number[]>;
    // spacesBarn: Space[];
    // spacesPasture: Space[];
    loops: number;
    isCowInBarn: boolean;
    isCowInPasture: boolean;

    nextEventID: number;
    nextUtilityId: number;
    smartEvents: SMARTEvent[];

    coordinatesPasture: GeoCoordinate[];
    coordinatesBarn: GeoCoordinate[];
    coordinatesCombined: GeoCoordinate[];
    coordinatesBridgeBarnToPasture: GeoCoordinate[];


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


    timePassed: number;

    
    
    
    drawBarnRects: boolean;
    drawPastureRects: boolean;
    drawNeighbourSpaces: boolean;
    forbiddenSpaceIds: number[];
    bridgeSpaceIdPairs: number[][];

    colorSpacesPasture:string;
    colorAlphaSpacesPasture:number;
    colorSpacesBarn:string;
    colorAlphaSpacesBarn:number;
    colorPolygon:string;
    colorAlphaPolygon:number;
    drawSpaceIds:boolean;
}

export const useGlobalsStore = defineStore({
    id: 'globals',  // unique id of the store
    state: (): GlobalsState => ({


        mousePosition: { x: 0, y: 0 },
        sensors: [],
        spaces: [],
        spaceNeighborCache: new Map<number, number[]>(),
        // spacesBarn: [],
        // spacesPasture: [],

        recordings: [],
        now : new Date('2021-01-01T01:00:00'),

        ctx: null,
        canvasRef: null,
        canvasWidth: 800,
        canvasHeight: 600,
        canvasPanOffsetX: 0,
        canvasPanOffsetY: 0,
        cowId: '1',
        recordIntervalInSeconds: 300,
        recordDurationInDays: 2,
        stepsPerSecond: 1,
        sensorWidthInMeters: 20,

        drawBarnRects: true,
        drawPastureRects: true,
        drawNeighbourSpaces: false,
        forbiddenSpaceIds: [2, 3, 8, 9, 16, 17, 23, 24, 25],
        bridgeSpaceIdPairs: [[10, 94], [10, 98], [10, 102]],
        colorSpacesPasture: "#FF0000",
        colorAlphaSpacesPasture: 0.25,
        colorSpacesBarn: "#00FF00",
        colorAlphaSpacesBarn: 0.55,
        colorPolygon: "#FF00FF",
        colorAlphaPolygon: 0.45,
        drawSpaceIds: true,
        loops: 0,

        isCowInBarn: false,
        isCowInPasture: false,

        nextEventID: 1,
        nextUtilityId: 1,
        smartEvents: [{
            id: 1,
            description: "watering",
            screenDescription: "watering",
            metaeventId: 1,
            profileIndex: 1,
            spaceIds: '55,56,57',
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
            colorAlpha: 0.5
        }, {
            id: 2,
            description: "feeding",
            screenDescription: "feeding",
            metaeventId: 1,
            profileIndex: 1,
            spaceIds: '67,68,69,70',
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
            colorAlpha: 0.5
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
            { lon: 12.198977630381377, lat: 49.681693094242426 }, //C
            { lon: 12.198725503930264, lat: 49.6816012760606 },// D
            { lon: 12.199206206559584, lat: 49.68104582151515 },// E
            { lon: 12.199459718320865, lat: 49.681139457878785 },// F
        ],
        coordinatesBridgeBarnToPasture: [
            { lat: 49.681470, lon: 12.199744 },// A
            { lat: 49.681314, lon: 12.199313 },// B
            { lon: 12.199357205368216, lat: 49.681257639696966 },// G
            { lat: 49.681418, lon: 12.199800 },// H
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

            { lat: 49.681470, lon: 12.199744 },// A
            { lat: 49.681314, lon: 12.199313 },// B
            { lon: 12.198977630381377, lat: 49.681693094242426 }, //C
            { lon: 12.198725503930264, lat: 49.6816012760606 },// D
            { lon: 12.199206206559584, lat: 49.68104582151515 },// E
            { lon: 12.199459718320865, lat: 49.681139457878785 },// F
            { lon: 12.199357205368216, lat: 49.681257639696966 },// G
            { lat: 49.681418, lon: 12.199800 },// H




            { lat: 49.68131979333333, lon: 12.199891363333334 },
            { lat: 49.68111546833333, lon: 12.200051731666667 }
        ],

        tipEventDescription: "a human understandable description of this event",
        tipEventId: "The id property should uniquely identify an event",
        tipEventMetaeventId: "The metaevent-id property determines the metaevent group to which the event belongs.",
        tipEventProfileIndex: "The profile-index property denotes the time profile index to use in the associated metaevent entry.",
        tipEventSpaceIds: "The space-ids property denotes the spaces in which the event can take place",
        tipEventCapacity: "The capacity property denotes the number of people of each type of metaperson. The range property specifies bounds ([lo, high]) on the number of people in attendance.",

        timePassed: 0,
     
        
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
        spacesBarn(): Space[] {
            return this.spaces.filter(s => s.sensorType == "Beacon");
        },
        spacesPasture(): Space[] {
            return this.spaces.filter(s => s.sensorType == "Mioty" || s.sensorType == "GPS");

        },
         recordTimeUpperBound():number{
            return getTimeInSeconds(this.now.toDateString()) + this.recordDurationInDays * 24 * 60 * 60;
        },
        isSimulationEndTimeReached():boolean{
            return this.timePassed >= this.recordTimeUpperBound;
        }
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
                screenDescription: "defaultevent",
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
                colorAlpha: 0.5
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
        },
        ResetTimePassed(){
            this.timePassed =  getTimeInSeconds(this.now.toDateString());
        }
        
    }
});


// Save the state of the store to localStorage
// useGlobalsStore().$subscribe(
//     (state) => localStorage.setItem('counterState', JSON.stringify(state)),
//     { deep: true }
//   );
  
//   // Retrieve the state of the store from localStorage
//   const savedState = JSON.parse(localStorage.getItem('counterState') || '{}');
//   useCounterStore.$state = savedState;




