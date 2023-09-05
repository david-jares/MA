import { defineStore } from 'pinia';
import type { ref } from 'vue';

interface GlobalsState {
    
    mousePosition: Point;

    canvasRef: any;
    ctx:CanvasRenderingContext2D | null;
    canvasWidth: number;
    canvasHeight: number;

    cowId: string;
    recordIntervalInSeconds: number;
    recordDurationInDays: number;
    timeSpeedMultiplier: number;
    sensorWidthInMeters: number;

    sensors: Sensor[];
    spaces: Space[];

    isCowInBarn: boolean;
    isCowInPasture: boolean;

    nextEventID: number;
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

}

export const useGlobalsStore = defineStore({
    id: 'globals',  // unique id of the store
    state: (): GlobalsState => ({
        mousePosition : { x: 0, y: 0 },
        ctx: null,
        canvasRef: null,
        canvasWidth: 800,
        canvasHeight: 600,

        cowId: '1',
        recordIntervalInSeconds: 60,
        recordDurationInDays: 2,
        timeSpeedMultiplier: 600,
        sensorWidthInMeters: 40,

        sensors: [],
        spaces: [],

        isCowInBarn: false,
        isCowInPasture: false,

        nextEventID: 1,
        smartEvents: [],
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
            { lat: 49.681714, lon: 12.199252 },
            { lat: 49.681642, lon: 12.198957 },
            { lat: 49.681133, lon: 12.199435 },
            { lat: 49.681212, lon: 12.199739 }
        ],
        coordinatesCombined: [
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


            { lat: 49.681714, lon: 12.199252 },
            { lat: 49.681642, lon: 12.198957 },
            { lat: 49.681133, lon: 12.199435 },
            { lat: 49.681212, lon: 12.199739 },


            { lat: 49.681353, lon: 12.199602 },
            { lat: 49.681414, lon: 12.199807 },
            { lat: 49.68131979333333, lon: 12.199891363333334 },
            { lat: 49.68111546833333, lon: 12.200051731666667 }
        ],

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
        // setName(newName: string) {
        //     this.name = newName;
        // },
        // incrementAge() {
        //     this.age++;
        // },
        getNextEventID(): number {
            return this.nextEventID++;
        }
    },
});

// console.log("Globals store created");