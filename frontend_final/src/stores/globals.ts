import { BridgePair, type CanvasCoordinate, type GeoCoordinate, type RecordEntry, type SMARTEvent, type Sensor, type Space } from '@/myfunctions/model';
import type { Point } from '@/myfunctions/tempfunctions';
import { Rectangle, getTimeInSeconds } from '@/myfunctions/utilityfunctions';
import { defineStore } from 'pinia';
import type { ref } from 'vue';

interface GlobalsState {

    mousePosition: Point;
    now : Date;
    serverAddress: string;
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
    drawForbiddenSpaces: boolean;
    forbiddenSpaceIds: number[];
    bridgeSpaceIdPairs: BridgePair[];

    colorSpacesPasture:string;
    colorAlphaSpacesPasture:number;
    colorSpacesBarn:string;
    colorAlphaSpacesBarn:number;
    colorPolygon:string;
    colorAlphaPolygon:number;
    drawSpaceIds:boolean;
    cowDisplayMode: string;


    // scenario Learning
    scenarioLearning_startDate: string;
    scenarioLearning_endDate: string;
    scenarioLearning_unit:number;
    scenarioLearning_validity:number;
    scenarioLearning_smoothing:string;
    scenarioLearning_window:number;
    scenarioLearning_timeThreshold:number;
    scenarioLearning_occThreshold:number;

    //scenario Generation
    scenarioGeneration_numberOfCows:number;
    scenarioGeneration_numberOfEvents:number;
    scenarioGeneration_startDate:string;
    scenarioGeneration_endDate:string;


}

export const useGlobalsStore = defineStore({
    id: 'globals',  // unique id of the store
    state: (): GlobalsState => ({

        serverAddress:"http://157.230.24.1:8000",
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
        forbiddenSpaceIds: [2, 3, 8, 9,10, 16,22, 23],
        bridgeSpaceIdPairs: [new BridgePair(0,24,77), new BridgePair(1,17,77)],
        // bridgeSpaceIdPairs: [],
        colorSpacesPasture: "#FF0000",
        colorAlphaSpacesPasture: 0.25,
        colorSpacesBarn: "#00FF00",
        colorAlphaSpacesBarn: 0.55,
        colorPolygon: "#FF00FF",
        colorAlphaPolygon: 0.45,
        drawSpaceIds: true,
        drawForbiddenSpaces: true,
        loops: 0,

        isCowInBarn: false,
        isCowInPasture: false,
        cowDisplayMode: "Image",
        nextEventID: 1,
        nextUtilityId: 1,


        // scenario Learning
    scenarioLearning_startDate: "2021-01-01",
    scenarioLearning_endDate:  "2021-03-01",
    scenarioLearning_unit:1,
        scenarioLearning_validity:1,
    scenarioLearning_smoothing:"EMA",
    scenarioLearning_window:10,
    scenarioLearning_timeThreshold:5,
    scenarioLearning_occThreshold:1,

    //scenario Generation
    scenarioGeneration_numberOfCows:10,
    scenarioGeneration_numberOfEvents:300,
    scenarioGeneration_startDate:"2021-01-01",
    scenarioGeneration_endDate:"2021-03-01",




        smartEvents: [{
            id: 1,
            description: "drink",
            screenDescription: "drink",
            drawTextVertically: false,
            fontScale: 1,
            metaeventId: 1,
            profileIndex: 1,
            spaceIds: '72,80',
            capacityMetaPersonId: 1,
            capacityRangeMin: 1,
            capacityRangeMax: 1,
            startDate: "2021-01-01",
            endDate: "2022-01-01",
            period: 'day',
            periodInterval: 1,
            startTime: "00:00",
            endTime: "23:59",
            requiredAttendance: '02:00',
            colorRGB: "#FFFF00",
            colorAlpha: 0.5
        }, {
            id: 2,
            description: "feeding",
            screenDescription: "feeding",
            drawTextVertically: false,
            fontScale: 1,
            metaeventId: 1,
            profileIndex: 1,
            spaceIds: '66,70,74,78,82,86,90,94,98,102',
            capacityMetaPersonId: 1,
            capacityRangeMin: 1,
            capacityRangeMax: 10000,
            startDate: "2021-01-01",
            endDate: "2022-01-01",
            period: 'day',
            periodInterval: 1,
            startTime: "12:00",
            endTime: "14:00",
            requiredAttendance: '02:00',
            colorRGB: "#0000FF",
            colorAlpha: 0.5
        },{
            id: 3,
            description: "milking",
            screenDescription: "milk",
            drawTextVertically: false,
            fontScale: 1,
            metaeventId: 1,
            profileIndex: 1,
            spaceIds: '68',
            capacityMetaPersonId: 1,
            capacityRangeMin: 1,
            capacityRangeMax: 1,
            startDate: "2021-01-01",
            endDate: "2022-01-01",
            period: 'day',
            periodInterval: 1,
            startTime: "00:00",
            endTime: "23:59",
            requiredAttendance: '05:00',
            colorRGB: "#FF00FF",
            colorAlpha: 0.5
        },{
            id: 4,
            description: "rest",
            screenDescription: "rest",
            drawTextVertically: false,
            fontScale: 1,
            metaeventId: 1,
            profileIndex: 1,
            spaceIds: '71,72,75,76,79,80,83,84,87,88,91,92',
            capacityMetaPersonId: 1,
            capacityRangeMin: 1,
            capacityRangeMax: 1,
            startDate: "2021-01-01",
            endDate: "2022-01-01",
            period: 'day',
            periodInterval: 1,
            startTime: "00:00",
            endTime: "23:59",
            requiredAttendance: '01:00',
            colorRGB: "#00FFFF",
            colorAlpha: 0.5
        },
        {
            id: 5,
            description: "grazing",
            screenDescription: "grazing",
            drawTextVertically: false,
            fontScale: 1,
            metaeventId: 1,
            profileIndex: 1,
            spaceIds: '4,5,6,7,11,12,13,14,15,18,19,20,21,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66',
            capacityMetaPersonId: 1,
            capacityRangeMin: 1,
            capacityRangeMax: 10000,
            startDate: "2021-01-01",
            endDate: "2022-01-01",
            period: 'day',
            periodInterval: 1,
            startTime: "06:00",
            endTime: "19:00",
            requiredAttendance: '30:00',
            colorRGB: "#FF00FF",
            colorAlpha: 0.15
        }
    ],
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
            // 12.199470800802233, 49.681716730606055
            // 12.199074602093344, 49.68158218515151
            // 12.199125858569667, 49.68152673060606
            // 12.199526213209072, 49.681666730606054

            { lon: 12.199463874251379,lat: 49.68172400333333},// A
            { lat: 49.68158218515151, lon: 12.199074602093344 },// B
            { lat: 49.68152673060606, lon: 12.199125858569667 },// G
            { lon:12.199513745417534, lat:49.68166763969697} ,// H    
            // { lat: 49.681470, lon: 12.199744 },// A
            // { lat: 49.681314, lon: 12.199313 },// B
            // { lon: 12.199357205368216, lat: 49.681257639696966 },// G
            // { lat: 49.681418, lon: 12.199800 },// H
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

            { lon: 12.199463874251379,lat: 49.68172400333333},// A
            { lat: 49.68158218515151, lon: 12.199074602093344 },// B
            { lon: 12.198977630381377, lat: 49.681693094242426 }, //C
            { lon: 12.198725503930264, lat: 49.6816012760606 },// D
            { lon: 12.199206206559584, lat: 49.68104582151515 },// E
            { lon: 12.199459718320865, lat: 49.681139457878785 },// F
            { lat: 49.68152673060606, lon: 12.199125858569667 },// G
            { lon:12.199513745417534, lat:49.68166763969697} //H
        //    {lon: 12.199553919412491,lat: 49.6816412760606} //H
            // H
            // { lat: 49.68152673060606, lon: 12.199125858569667 }// H




            // { lat: 49.68131979333333, lon: 12.199891363333334 },
            // { lat: 49.68111546833333, lon: 12.200051731666667 }



            // { lat: 49.68101400333333, lon: 12.20009942 },
            // { lat: 49.68115214666667, lon: 12.200764548333334 },
            // { lat: 49.682404365, lon: 12.199464525 },
            // { lat: 49.68266766333333, lon: 12.197345735 },
            // { lat: 49.68249247666667, lon: 12.197450201666667 },
            // // { lat: 49.68194168, lon: 12.198492973333334 },
            // { lat: 49.681985108333336, lon: 12.198418175 },
            // { lat: 49.68204832833333, lon: 12.199110575 },

            // { lat: 49.681470, lon: 12.199744 },// A
            // { lat: 49.681314, lon: 12.199313 },// B
            // { lon: 12.198977630381377, lat: 49.681693094242426 }, //C
            // { lon: 12.198725503930264, lat: 49.6816012760606 },// D
            // { lon: 12.199206206559584, lat: 49.68104582151515 },// E
            // { lon: 12.199459718320865, lat: 49.681139457878785 },// F
            // { lon: 12.199357205368216, lat: 49.681257639696966 },// G
            // { lat: 49.681418, lon: 12.199800 },// H




            // { lat: 49.68131979333333, lon: 12.199891363333334 },
            // { lat: 49.68111546833333, lon: 12.200051731666667 }
 
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
                drawTextVertically: false,
                fontScale: 1,
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
        },
        removeBridgeSpaceIdPair(id: number) {
            const index = this.bridgeSpaceIdPairs.findIndex(pair => pair.id === id);
            if (index !== -1) {
                this.bridgeSpaceIdPairs.splice(index, 1);
            }
            for (let i = 0; i <  this.bridgeSpaceIdPairs.length; i++) {
                const pair =  this.bridgeSpaceIdPairs[i];
                pair.id = i;
                
            }
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




